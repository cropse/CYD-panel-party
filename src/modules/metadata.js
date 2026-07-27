// Metadata encoding/decoding for YAML round-trip import.
// Extracted from yaml-engine.js to break the circular import:
// import.js needs decodeMetadata, yaml-engine.js needs normalizeImportedConfig from import.js.

const METADATA_MARKER_BEGIN = '# cyd-config: begin';
const METADATA_MARKER_END = '# cyd-config: end';
export const CUSTOM_MARKER_BEGIN = '# cyd-custom: begin';
export const CUSTOM_MARKER_END = '# cyd-custom: end';
const METADATA_VERSION = 1;

function b64Encode(str) {
  if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(str)));
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf8').toString('base64');
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function b64Decode(base64) {
  if (typeof atob === 'function') return decodeURIComponent(escape(atob(base64)));
  if (typeof Buffer !== 'undefined') return Buffer.from(base64, 'base64').toString('utf8');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeMetadata(normalizedConfig) {
  const gapFill = {
    version: METADATA_VERSION,
    buttons: normalizedConfig.buttons.map(btn => ({
      id: btn.id,
      name: btn.name,
      empty: btn.empty || undefined,
      threshold: btn.threshold != null ? String(btn.threshold) : undefined,
      condition: btn.condition && btn.condition !== 'above' ? btn.condition : undefined,
      customColors: btn.customColors || undefined,
      colorOff: btn.customColors && btn.colorOff && btn.colorOff !== '808080' ? btn.colorOff : undefined
    })).filter(b => b.name !== `Button ${b.id?.replace('btn_', '')}` || b.empty || b.threshold || b.condition || b.customColors)
  };

  const payload = {
    version: METADATA_VERSION,
    gapFill
  };

  const json = JSON.stringify(payload);
  const base64 = b64Encode(json);
  const lines = base64.match(/.{1,76}/g) || [];
  return [
    METADATA_MARKER_BEGIN,
    ...lines.map(l => `# ${l}`),
    METADATA_MARKER_END
  ].join('\n');
}

export function decodeMetadata(yamlText) {
  const lines = yamlText.split('\n');
  const beginIdx = lines.lastIndexOf(METADATA_MARKER_BEGIN);
  const endIdx = beginIdx >= 0 ? lines.indexOf(METADATA_MARKER_END, beginIdx + 1) : -1;
  if (beginIdx < 0 || endIdx < 0 || endIdx <= beginIdx) {
    if (beginIdx >= 0 || endIdx >= 0) {
      return { gapFill: null, config: null, warnings: ['Metadata markers are present but malformed.'] };
    }
    return null;
  }

  const base64Lines = lines.slice(beginIdx + 1, endIdx)
    .map(l => l.replace(/^#\s?/, ''))
    .join('');
  const warnings = [];

  let json;
  try {
    json = b64Decode(base64Lines);
  } catch {
    warnings.push('Embedded config metadata is corrupt and could not be decoded.');
    return { gapFill: null, config: null, warnings };
  }

  let payload;
  try {
    payload = JSON.parse(json);
  } catch {
    warnings.push('Embedded config metadata is corrupt and could not be parsed.');
    return { gapFill: null, config: null, warnings };
  }

  if (!payload || payload.version !== METADATA_VERSION || !payload.gapFill) {
    warnings.push('Embedded config metadata has an unsupported version or format.');
    return { gapFill: null, config: null, warnings };
  }

  return { gapFill: payload.gapFill, config: null, warnings };
}