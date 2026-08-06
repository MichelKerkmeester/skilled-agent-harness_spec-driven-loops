---
title: Minimal Theme Index (`Minimal`)
description: "Entry point for operating the Minimal Obsidian theme at the file layer: identity, activation contract, file surface, customization boundary and sibling reference files."
trigger_phrases:
  - "minimal theme obsidian"
  - "minimal css theme"
  - "obsidian appearance cssTheme"
  - "minimal theme snippets"
  - "obsidian theme file layer"
  - "minimal theme settings"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Minimal Theme Index (`Minimal`)

The `mcp-obsidian` mode treats Minimal as a **theme artifact layer**, never as a plugin. The AI reads the theme package, verifies activation and proposes snippet-based tweaks. It never edits the theme's own CSS in a real vault.

---

## 1. OVERVIEW
| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian theme ID | `Minimal` | Theme directory name and the exact `cssTheme` value |
| Display name | **Minimal** | Current manifest name |
| Artifact type | Theme, not plugin | No `main.js`, no `data.json`, no commands, no settings keys |
| Author | @kepano (Steph Ango) | Manifest `author` field |
| Version installed | 9.0.2 | Verified on disk in `.obsidian/themes/Minimal/manifest.json` |
| Minimum Obsidian version | 1.13.0 | Manifest `minAppVersion` field |
| Documentation | https://minimal.guide | Cited inside the theme's embedded settings block |
| License header | MIT, Copyright 2020-2026 | First comment in `theme.css` |

---

## 2. WHAT IT IS

Minimal is a complete UI theme shipped as one `theme.css` stylesheet plus a `manifest.json`. It restyles the whole Obsidian interface, including tabs, sidebars, the editor, properties, tables, callouts, code blocks, graphs, canvas and the ribbon. It reads no vault content and writes no vault content.

The theme has no plugin surface. It exposes no commands, no ribbon actions, no hotkeys and no settings keys of its own. Customization happens through the CSS variables the theme defines and through optional companion plugins that expose those variables in a settings panel.

### Companion plugins

The `theme.css` header names two optional companions. Neither is installed in this vault, verified by reading `.obsidian/community-plugins.json`.

| Companion | Plugin ID | Role |
| --- | --- | --- |
| Minimal Theme Settings | `obsidian-minimal-settings` | Hotkeys, feature toggles, fonts, preset color schemes |
| Style Settings | `obsidian-style-settings` | Renders the theme's embedded `@settings` schema as an in-app panel |

When both companions are absent, snippet-based tweaks are the only customization path available at the file layer.

### What the theme changes

| UI surface | What Minimal restyles |
| --- | --- |
| Tabs and header | Tab styles, header height, stacked tab panes |
| Sidebars | Tab style, vault profile display, ribbon style |
| Editor | Heading sizes and weights, code blocks, blockquotes, embeds |
| Properties | Metadata headers, dividers, label widths |
| Tables | Text size, row and column lines, hover rows |
| Callouts | Callout style and color blending |
| Graphs and canvas | Line and node colors, dot patterns |
| Images | Radius, blending, grid backgrounds |

### Theme versus plugin

| Property | Theme | Plugin |
| --- | --- | --- |
| Artifact folder | `.obsidian/themes/` | `.obsidian/plugins/` |
| Runtime file | `theme.css` | `main.js` |
| Config file | None | `data.json` |
| Activation | `cssTheme` in `appearance.json` | Entry in `community-plugins.json` |
| AI edits | Snippets only | Plugin data files |

The folder location is the quickest discriminator. A folder under `themes/` is a theme and follows this reference set. A folder under `plugins/` follows the plugin sets.

---

## 3. FILE-LAYER SURFACE

| Layer | Path or artifact | Operable by AI |
| --- | --- | --- |
| Theme package | `.obsidian/themes/Minimal/manifest.json` | **Read only** in a real vault |
| Theme package | `.obsidian/themes/Minimal/theme.css` | **Read only** in a real vault |
| Activation | `.obsidian/appearance.json` → `cssTheme` | Read always. Write only with explicit approval |
| Custom snippets | `.obsidian/snippets/*.css` | Read, propose, write with backup discipline |
| Companion data | `.obsidian/plugins/obsidian-minimal-settings/` | Not present in this vault |
| Companion data | `.obsidian/plugins/obsidian-style-settings/` | Not present in this vault |

The theme package is a shipped artifact. Every other layer is user configuration. The AI distinguishes the two on every operation.

### Update behavior

Obsidian replaces the theme folder when a theme update installs. A snippet survives the update because it lives outside the theme folder. A hand-edited `theme.css` does not survive and blocks the update. This is the durable why behind the read-only rule.

---

## 4. ACTIVATION LOCATION

Activation is a single string key in the appearance file. The vault currently has the theme active, verified by reading the file.

```json
{
  "cssTheme": "Minimal"
}
```

### Key semantics

- The key name is `cssTheme` and the value is a string, not an array.
- The value must equal the theme folder name under `.obsidian/themes/`.
- A missing `cssTheme` key means the default theme is active.
- An empty string means the default theme is active.
- A value with no matching folder renders nothing until the theme is installed.

### Vault state

This vault holds two theme folders, `Minimal` and `Primary`. The exact string match keeps activation stable. In the UI the same setting lives at Settings → Appearance → Themes. Obsidian stores the selection in this file automatically.

### Verification command

```bash
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/appearance.json
```

Expected output is the two-line JSON above. Any other value means the theme is not the active appearance.

### Write policy

Writing `appearance.json` is a rare, approval-gated action. Take a timestamped backup first. Change only the `cssTheme` value. Re-parse the JSON after the write. Reverting is a single restore of the backup.

---

## 5. WHEN TO USE THIS REFERENCE SET

Use this set when the user asks about the theme, the appearance settings, colors, fonts, UI spacing, CSS tweaks or why the interface renders a certain way. The frontmatter trigger phrases cover the common phrasings.

| Prompt signal | Route |
| --- | --- |
| "Minimal theme" | This set |
| "cssTheme" or "appearance" | This set |
| "theme colors" or "UI looks" | This set |
| "CSS snippet" or "customize the look" | This set |
| A named plugin inside the themed UI | That plugin's reference set |

### Example prompts

| User phrasing | Answer |
| --- | --- |
| "Is Minimal installed?" | Read the manifest and report the version |
| "Which theme is active?" | Read `appearance.json` and report the `cssTheme` value |
| "Can you make headings smaller?" | Propose a snippet that overrides `--h1-size` |
| "Where do I change theme colors?" | Point to Settings → Appearance → Themes and the snippet path |

Plugin questions stay in the plugin sets. Iconic, Dataview, Charts, Health.md and the other reference sets each own their plugin file layer. A question about a plugin that renders inside the themed UI belongs to that plugin's set, not here.

---

## 6. BOUNDARY RULES

- **Never edit `theme.css` in a real vault.** The file is the shipped artifact. Editing it breaks theme updates and hides the change from the user.
- **Never edit `manifest.json`.** Its version field is the theme's identity. A hand-edited version breaks Obsidian's update detection.
- **Validate in throwaway vaults.** Any CSS experiment runs in a temporary vault first, never against the live appearance.
- **Propose snippets, then write with backup discipline.** A snippet file gets a timestamped backup before any write.
- **Never invent settings keys.** The theme has no settings keys. The embedded `@settings` schema is read-only documentation for companion plugins.
- **State the reload boundary.** CSS changes render after a reload or restart. File-layer verification never proves rendered pixels.

---

## 7. SIBLING FILES

| File | Contents |
| --- | --- |
| `data-model.md` | Exact theme artifacts, the activation key, the embedded settings schema and the snippets contract |
| `workflows.md` | Numbered recipes for verifying installation, verifying activation and proposing snippet tweaks with backup discipline |
| `troubleshooting.md` | Failure modes, the diagnosis sequence and named validation checkpoints |
