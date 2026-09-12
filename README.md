# Eorzea UI

A dependency-free, FFXIV-inspired CSS toolkit. Neutral charcoal beveled windows, antique gold accents, native form controls, and an optional palette from the game’s Stain sheet. No external fonts.

## Repository layout and imports

The reusable toolkit stays at the repository root. The complete interactive reference page lives in [`demo/`](demo/index.html), keeping demo-only code separate from production assets.

| File | Required | Purpose |
| --- | --- | --- |
| `ffxiv.css` | Yes | Core components, themes, controls, navigation, cards, accordions, notices, tables, and tokens. |
| `ffxiv-colors.css` | Optional | Named FFXIV Stain colors as `--xiv-stain-*` variables. |
| `demo/xiv.js` | Optional | Custom dropdown behavior, keyboard handling, outside-click closing, and form-reset synchronization. |
| `demo/demo.css` | No | Demo/documentation layout only. |
| `demo/demo.js` | No | Playground, theme switcher, copy buttons, tabs, and demo interactions only. |
| `demo/stains.js` | No | Bundled data used by the demo dye browser. |

Minimal setup:

```html
<link rel="stylesheet" href="ffxiv.css">
<link rel="stylesheet" href="ffxiv-colors.css">
<script src="demo/xiv.js" defer></script>
```

Open [`demo/index.html`](demo/index.html) for the live component gallery.

## GitHub Pages publishing

Every push to `main` runs [`.github/workflows/gh-pages.yml`](.github/workflows/gh-pages.yml). It assembles the contents of `demo/` together with the root toolkit files and publishes that site at the root of the `gh-pages` branch. Enable GitHub Pages in the repository settings with `gh-pages` as the deployment branch. The published site therefore uses `index.html` at the Pages root while source files remain organized under `demo/`.

The workflow rewrites the demo’s local `../ffxiv.css` and `../ffxiv-colors.css` references to root-relative published paths. This is necessary because the Pages artifact is intentionally flattened; local `demo/index.html` continues to use parent-relative paths when opened from the source tree.

## Try it

Open `demo/index.html` in a modern browser. No install or build step. Use the class playground to select an element and variant, edit its content or classes, toggle disabled states, and copy the resulting HTML. Copy buttons support a fallback for local files, subject to browser clipboard permissions.

## Use it

Copy `ffxiv.css` into your project. The demo styles and JavaScript are not required.

```html
<link rel="stylesheet" href="ffxiv.css">
<div class="xiv">
  <section class="xiv-panel">
    <h2 class="xiv-title">Duty Information</h2>
    <label class="xiv-field">Character name
      <input class="xiv-input" placeholder="Warrior of Light">
    </label>
    <button class="xiv-button xiv-button--primary">Accept quest</button>
  </section>
</div>
```

Always use an `.xiv` ancestor (or put it on `body`). Modifier classes accompany their base class. CSS is placed in `@layer xiv` so your unlayered application styles can override it easily.

## Class reference

| Base class | Modifiers / usage |
| --- | --- |
| `xiv-panel` | `xiv-panel--parchment`, `xiv-panel--glass` |
| `xiv-title` | Panel heading |
| `xiv-button` | `--primary`, `--ghost`, `--danger`, `--small`; native `disabled` |
| `xiv-field` | Label wrapper with spacing |
| `xiv-input` | Text, search, email, and other native inputs; `aria-invalid="true"` for errors |
| `xiv-select` | Native select |
| `xiv-textarea` | Resizable multiline input |
| `xiv-help`, `xiv-error` | Descriptions; connect using `aria-describedby` |
| `xiv-check` | Label wrapping an `input type="checkbox"` |
| `xiv-radio` | Label wrapping an `input type="radio"`; share `name` within a group |
| `xiv-switch` | Label wrapping an `input type="checkbox" role="switch"` |
| `xiv-range` | Native `input type="range"` |
| `xiv-tabs`, `xiv-tab` | Tab list and buttons; active state via `aria-selected="true"` |
| `xiv-badge` | `--blue`, `--green`, `--red` |
| `xiv-notice` | `--quest` |
| `xiv-progress` | Native `progress`; `--exp` (gold), `--hp` (green), `--mp` (pink); use `value`, `max`, and an accessible label |
| `xiv-exp-track` | Rested EXP track containing `xiv-exp-rested` then `xiv-exp-earned`; set each width as a percentage |
| `xiv-tooltip`, `xiv-tooltip-content` | Wrapper and tooltip; connect trigger with `aria-describedby` |
| `xiv-table` | Table with native headers and caption |
| `xiv-dialog` | Combine with `xiv-panel` on a native `dialog` |

Short modifiers in this table include their base name, e.g. `xiv-badge--blue`.

## Theme

```css
.xiv {
  --xiv-gold: #cab582;
  --xiv-gold-bright: #f0deb0;
  --xiv-blue: #9ed9ed;
  --xiv-text: #e8e5dc;
  --xiv-muted: #a7adb1;
  --xiv-surface: #292929;
  --xiv-surface-deep: #202020;
  --xiv-bg: #181818;
  --xiv-border: #69665b;
  --xiv-radius: 8px;
  --xiv-font: 'Segoe UI', system-ui, sans-serif;
}
```

`--xiv-bg` and `--xiv-surface` are available for your app’s layout backgrounds. Decorative gradients use additional fixed shades; changing a token does not recolor every gradient.

## Behavior and accessibility

The stylesheet controls appearance. Provide your own application behavior for tabs, dialogs, validation, and notifications. `demo.js` contains working examples, including arrow/Home/End keyboard navigation for tabs and native modal dialogs. Native checkboxes, radios, selects, ranges, and text fields work without JavaScript. Use real buttons for disabled controls; `aria-disabled` on links only styles them and does not prevent navigation. Tooltips are supplemental: keep essential instructions visible. Focus indicators and reduced-motion support are included.

Targets modern browsers with cascade layers, `:has()`, and native dialog support. Glass panels retain a translucent background if backdrop blur is unavailable. No build pipeline or framework dependency.

## Named game dye palette

The color browser uses **all 125 named dyes from the Stain sheet**, with dye names, row IDs, and exact RGB hex values. Search by name, ID, variable, or hex; copy individual colors or the entire palette. Include `ffxiv-colors.css` alongside the toolkit:

```html
<link rel="stylesheet" href="ffxiv-colors.css">
<span style="color: var(--xiv-stain-snow-white)">Snow White</span>
```

Each dye has a readable name variable and a numeric alias, e.g. `--xiv-stain-snow-white` and `--xiv-stain-1`. Both are `#e4dfd0`, converted directly from `Stain.Color` (24-bit RGB, not RGBA). Metallic dyes show their stored flat swatch; reflective material effects require more than a color value.

Source: [XIVAPI Stain](https://v2.xivapi.com/api/sheet/Stain?limit=500&fields=Name,Color), retrieved 2026-09-12. The response is preserved in `stains-source.json`. Run `python build-palette.py` to regenerate `ffxiv-colors.css` and `stains.js` offline. No Color (row 0) and three unnamed rows are excluded from the generated palette. There are no theme variants in this dye palette.

HUD gradients remain separate visual approximations of the interface, exposed as `--xiv-exp`, `--xiv-rested`, `--xiv-hp`, and `--xiv-mp`. Stain dye values are not used as invented mappings for HUD resources.

## License

MIT; see `LICENSE`. Independent fan project, not affiliated with Square Enix. FINAL FANTASY XIV is a trademark of Square Enix.

### Interaction containment
Button hover highlights and keyboard focus rings render inside their bounds; pressing a button does not move it. Labels wrap to fit available width. Tooltips reserve their hint space above the trigger so revealing them does not overflow the parent or shift surrounding content.

### Custom dropdowns

The demo's Custom dropdowns section includes copyable single-select and multi-select examples. Load `xiv.js` (with `defer`) alongside `ffxiv.css` for interactive summaries, Escape, outside-click/focus dismissal, and form-reset synchronization. Use `.xiv-dropdown` on `details`, `.xiv-dropdown-trigger` on `summary`, `.xiv-dropdown-value` for the selected text, and `.xiv-dropdown-menu` on a fieldset. Options combine `.xiv-dropdown-option` with `.xiv-radio` or `.xiv-check`. Add `.xiv-dropdown--multiple` for the multiple-selection example.

Native radio inputs share a unique `name` per dropdown; checkboxes can share a name to submit multiple values. Input type determines single vs. multiple behavior. Native details and inputs still function without JavaScript. The menu expands in document flow and scrolls within a bounded height. Keyboard: Enter/Space opens the summary, ArrowDown/ArrowUp enters the options, native radio arrows or checkbox Tab/Space select, Enter confirms a radio, and Escape closes. Disabled options retain native disabled behavior.

Focus styling uses `--xiv-focus` (muted gold) independently of semantic blue badges or informational colors.

### Eight interface styles

Apply `data-xiv-theme` to your `.xiv` wrapper (or a nested component area). Supported values: `Dark`, `Light`, `ClassicFF`, `ClearBlue`, `ClearWhite`, `ClearGreen`, `ClearGrey`, `ClearPink`.

```html
<div class="xiv" data-xiv-theme="ClearGreen">
  <section class="xiv-panel">
    <h2 class="xiv-title">Duty information</h2>
    <input class="xiv-input" aria-label="Character name">
    <button class="xiv-button">Confirm</button>
  </section>
</div>
```

The demo has all eight styles side by side and a selector that updates component examples and remembers your choice locally. The documentation shell and exact Stain dye values remain unchanged. Presets cover surfaces, readable foregrounds, fields, native/custom dropdowns, buttons, tabs, notices, selection controls, and tooltips. Semantic HP/MP/EXP colors retain their meaning. Parchment is an explicit surface variant and retains its parchment appearance.

These are CSS interpretations of the game styles, not extracted game textures or verified pixel-exact themes. Clear styles use translucent surfaces; their appearance depends on the background. Themes are included in `ffxiv.css`; no additional theme file is needed.
