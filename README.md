# CYD Config Generator

A web-based tool for generating ESPHome YAML configurations for CYD (Cheap Yellow Display - ESP32-2432S028R) devices.

**Live: https://cropse.github.io/CYD-panel-party/**

![CYD Config Generator](https://img.shields.io/badge/Platform-GitHub%20Pages-blue)
![ESPHome](https://img.shields.io/badge/ESPHome-2024.6%2B-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Visual Button Grid**: 4x3 grid preview with live updates
- **Button Configuration**:
  - Stateless buttons (single action)
  - Checkable buttons (sync with Home Assistant entity state)
  - Dual actions (short press + long press)
- **Icon Picker**: Searchable Material Design Icons (7000+ icons)
- **Color Picker**: Native color picker + preset swatches
- **Home Assistant Actions**:
  - Script calls
  - Switch control (toggle, turn_on, turn_off)
  - Cover control (open, close, set position)
  - Media player control
  - Automation triggers
- **Presets**: Pre-configured templates (Living Room, Back Garden, Bedroom)
- **YAML Import/Export**: Save, edit, and reload ESPHome YAML configurations
- **YAML Output**: Copy or download generated configuration
- **Dark/Light Theme**: Toggle between themes
- **Icon Search**: Searches 7000+ Material Design Icons (requires internet; results cached in localStorage for 7 days)

## Supported Boards

The generator supports the following boards:

| Board | Resolution | RGB LED |
|---|---|---|
| ESP32-2432S028-2port (default) | 320×240 | ✅ |
| ESP32-E32R28T | 320×240 | ❌ |
| ESP32-3248S035C | 480×320 | ✅ |
| ESP32-E32R35T | 480×320 | ✅ |
| ESP32-E32R40T | 480×320 | ✅ |
| Guition JC4827543C | 480×272 | ❌ |

Use the board selector to choose the target hardware before generating YAML. The default board is ESP32-2432S028-2port.

Note: The Guition JC4827543C uses ESP32-S3 with ESP-IDF framework, QSPI display, and GT911 touch controller. Boards without an RGB LED (ESP32-E32R28T, Guition JC4827543C) hide the RGB LED controls and omit related configuration from the generated YAML.

## Usage

### Quick Start

1. Open the web app: **<https://cropse.github.io/CYD-panel-party/>**
2. Click on a button in the grid to edit it
3. Configure:
   - **Type**: Stateless or Checkable
   - **Label**: Button text
   - **Icon**: Click to open icon picker
   - **Color**: Use color picker or swatches
   - **Position**: Grid column and row
   - **Actions**: Short press and optional long press
4. Download or copy the generated YAML config into your ESPHome folder
5. Copy the `cyd-lib/` folder into your ESPHome folder (e.g. `esphome/cyd-lib/`)
6. Check that your `secrets.yaml` has the required secret variables configured (see [Secrets](#secrets) below)
7. Compile in ESPHome

> **⚠️ The `cyd-lib/` folder is required.** The generated YAML references `cyd-lib/fonts/` for fonts and `cyd-lib/templates/` for button/widget templates. Without it, compilation will fail with file-not-found errors.

### Secrets

The generated YAML uses `!secret` placeholders for credentials. Make sure your `secrets.yaml` (in your ESPHome folder) defines all of these:

```yaml
# secrets.yaml
api_encryption_key: "<your-key>"
ota_password: "<your-password>"
wifi_ssid: "<your-ssid>"
wifi_password: "<your-wifi-password>"
```

> **⚠️ Without these secrets, compilation will fail.** Never hardcode credentials directly in the generated YAML.

### Button Types

#### Stateless Button
A simple button that triggers a Home Assistant action when pressed.

#### Checkable Button
A button that syncs its state with a Home Assistant entity:
- Shows different icons for ON/OFF states
- Visual indication of current state
- Requires entity ID and state icons

#### Timer Sync Button
A button that syncs with a Home Assistant `timer` entity:
- Shows the button label when the timer is idle
- Displays remaining time while the timer is running
- Requires a timer entity ID

#### Number Sync Button
A button that syncs with a Home Assistant `number` or `sensor` entity:
- Flips between two icons based on a numeric threshold
- Requires entity ID, threshold value, and icon-on/icon-off

### Home Assistant Actions

| Action Type | Description | Key Fields |
|-------------|-------------|------------|
| Script | Call a Home Assistant script | Script ID |
| Custom | Call any HA service with arbitrary action + JSON data | Action, Data (JSON) |
| Switch | Control a switch entity | Entity/Device ID, Operation (toggle/turn_on/turn_off) |
| Light | Control a light entity | Entity/Device ID, Operation (turn_on/turn_off/toggle), Brightness |
| Cover | Control a cover/blinds | Entity/Device ID, Operation (open/close/stop/set_cover_position), Position |
| Media Player | Control media playback | Entity/Device ID, Operation (play_pause/play/stop/next_track/prev_track/mute) |
| Climate | Control a climate/HVAC entity | Entity/Device ID, Operation (set_hvac_mode/set_temperature), HVAC Mode |
| Fan | Control a fan entity | Entity/Device ID, Operation (turn_on/turn_off/toggle/set_percentage) |
| Vacuum | Control a vacuum/robot cleaner | Entity/Device ID, Operation (start/stop/return_to_base/start_pause) |
| Lock | Control a lock entity | Entity/Device ID, Operation (lock/unlock/open) |
| Scene | Activate a scene | Scene ID |
| Input Boolean | Toggle an input_boolean | Entity ID, Operation (toggle/turn_on/turn_off) |
| Input Select | Select an option on input_select | Entity ID, Option |
| Humidifier | Control a humidifier | Entity/Device ID, Operation (turn_on/turn_off/toggle/set_humidity) |
| Button | Trigger a button entity | Entity ID |
| Automation | Trigger an automation | Automation ID |

### Presets

- **Empty**: Blank configuration
- **Living Room**: Example living room setup with lights, media, curtains
- **Bedroom**: Example bedroom setup with lights, fan, TV

### Keyboard Shortcuts

- `Ctrl+S`: Download YAML file
- `Esc`: Close icon picker modal

## Deployment

### GitHub Pages

Deployment is automated via the GitHub Actions workflow in `.github/workflows/deploy.yml`. On push to `main` or `master`, it builds the project and publishes the `dist/` folder to GitHub Pages.

To set up manually:

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select source: "Deploy from a branch"
4. Select branch: `master` (or `main`)
5. Select folder: `/ (root)` — the workflow handles building `dist/` automatically
6. Save and wait for deployment

The app is live at **https://cropse.github.io/CYD-panel-party/**

### Local Usage

The app uses ES modules, so opening `index.html` directly won't work (browsers block module loading over `file://`). Run a dev server instead:

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

## Generated YAML Structure

The generated YAML follows the ESPHome configuration format:

```yaml
substitutions:
  device_name: my-cyd
  nice_name: My CYD

esp32:
  board: esp32dev
  framework:
    type: arduino

# ... hardware config (display, touchscreen, SPI, etc.)

font:
  # Arimo fonts + Material Design Icons

color:
  # Per-button color definitions

binary_sensor:
  # Button press handlers with HA actions

packages:
  # State sync for checkable buttons

lvgl:
  # Button widgets in 4x3 grid
```

## Requirements

### ESPHome

- ESPHome 2024.6.0 or later (for LVGL support)
- **`cyd-lib/` folder** placed in your ESPHome config directory — the generated YAML references `cyd-lib/fonts/Arimo-Regular.ttf`, `cyd-lib/fonts/materialdesignicons-webfont.ttf`, and `cyd-lib/templates/*.yaml`. Without this folder, compilation fails.
- The `cyd-lib/` folder is included in this repository under `cyd-lib/` — copy it as-is into your ESPHome folder.

### Home Assistant

- API encryption key configured
- Entities/scripts/automations as configured in buttons

## File Structure

```
CYD-panel-party/
├── index.html              # Vite HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite build config (chunk splitting, cyd-lib copy)
├── README.md               # This documentation
├── cyd-lib/                # ⚠️ Required by generated YAML — copy into your ESPHome folder
│   ├── fonts/              # Arimo-Regular.ttf, materialdesignicons-webfont.ttf
│   └── templates/          # Button/widget templates (checkable, stateless, state-sync, etc.)
├── src/
│   ├── main.js             # Entry point — app init, event listeners, orchestration
│   ├── styles/
│   │   └── main.css        # All CSS
│   └── modules/
│       ├── config.js       # Constants: boards, presets, action schemas, defaults
│       ├── board-configs.js # Board hardware definitions
│       ├── store.js        # State management with undo/redo
│       ├── yaml-engine.js  # YAML generation
│       ├── validation-engine.js # Config validation
│       ├── import.js       # Import/normalize config logic
│       ├── mdi.js          # MDI icon loading and search
│       ├── utils.js        # Utility functions
│       └── tests/          # Unit and integration tests
├── dist/                   # Production build output (gitignored, created by `npm run build`)
├── esphome/                # ESPHome configurations (gitignored)
│   ├── back-garden-cyd.yaml
│   ├── living-room-cyd.yaml
│   ├── fonts/              # Font files
│   └── devices/            # Device definitions
└── back-garden-cyd.yaml    # Golden reference YAML
```

## Experimental Features

> **⚠️ These features are still in progress and may change or break in future releases.**

### Custom YAML Blocks

Inject arbitrary ESPHome YAML (custom sensors, `i2c:`, `api:` overrides, etc.) using marker comments:

```yaml
# cyd-custom: begin
i2c:
  sda: GPIO21
  scl: GPIO22
# cyd-custom: end
```

- Round-trip preserved on import/re-export.
- No UI editor — hand-edit the YAML markers.
- Content is **not validated**; invalid or duplicate keys will fail ESPHome compilation.

### Config Round-Trip Metadata

Generated YAML includes a base64 metadata block (`# cyd-config: begin` / `end`) that stores UI-only state (button names, thresholds, custom colors). It's ignored by ESPHome but needed for full round-trip import. Stripping it means import still works but may lose some UI state.

## License

MIT License - feel free to use and modify.

## Credits

This project is inspired by and builds upon:

- **[ESP32-CYD-ESPHome](https://github.com/makeitworktech/ESP32-CYD-ESPHome/)** by [makeitworktech](https://github.com/makeitworktech) - Original ESPHome YAML configurations for CYD devices that served as the foundation for this generator
- **[ESP32-Cheap-Yellow-Display](https://github.com/witnessmenow/ESP32-Cheap-Yellow-Display)** by [witnessmenow](https://github.com/witnessmenow) - Hardware reference and CYD community resources

Additional resources:

- [ESPHome](https://esphome.io/) - ESP32 firmware framework
- [LVGL](https://lvgl.io/) - Light and Versatile Graphics Library
- [Material Design Icons](https://pictogrammers.com/library/mdi/) by [Pictogrammers](https://pictogrammers.com/) - Icon library
