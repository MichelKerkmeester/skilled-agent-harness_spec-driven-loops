---
title: "Minimal Theme File-Layer Data Model"
description: "File-layer contract for the Minimal theme: theme package files, the cssTheme activation key, the embedded @settings schema, the snippets layer and the boundary the AI must not cross."
trigger_phrases:
  - "minimal theme data model"
  - "minimal theme file contract"
  - "obsidian theme manifest json"
  - "minimal settings schema"
  - "obsidian css snippet contract"
  - "minimal theme appearance json"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Minimal Theme File-Layer Data Model

Minimal is a theme, so its data model is a **file-layer contract**, not a plugin rulebook. There is no `data.json`, no settings schema owned by a plugin and no vault content written by the theme. The model covers the theme package, the activation key, the embedded settings schema and the snippets layer.

## 1. OVERVIEW

### Core contract

- The theme lives in `.obsidian/themes/Minimal/` as two files, `manifest.json` and `theme.css`.
- Activation is the single `cssTheme` string in `.obsidian/appearance.json`.
- The theme reads no vault content and writes no vault content.
- Customization at the file layer happens through CSS snippets in `.obsidian/snippets/`.
- The embedded `@settings` block in `theme.css` documents companion-plugin variables but changes nothing by itself.

### Artifact layers

| Layer | Artifact | AI role |
| --- | --- | --- |
| Theme package | `.obsidian/themes/Minimal/` | Read only |
| Activation | `.obsidian/appearance.json` | Read always. Write only with approval |
| Snippets | `.obsidian/snippets/*.css` | Read, propose, write with backup |
| Companion plugins | `.obsidian/plugins/obsidian-*-settings/` | Absent in this vault |

---

## 2. THEME PACKAGE

### Directory listing

The installed package contains exactly two files, verified on disk.

```text
.obsidian/themes/Minimal/
  manifest.json
  theme.css
```

There is no `main.js`, no `styles.json`, no `data.json` and no subfolder. A theme without `main.js` is normal. The absence of `main.js` is the strongest single signal that this artifact is a theme, not a plugin.

### manifest.json schema

| Key | Type | Installed value | Notes |
| --- | --- | --- | --- |
| `name` | string | `Minimal` | Display name |
| `version` | string | `9.0.2` | Theme version, used for update detection |
| `minAppVersion` | string | `1.13.0` | Oldest Obsidian the theme supports |
| `author` | string | `@kepano` | Author handle |
| `authorUrl` | string | `https://twitter.com/kepano` | Author link |
| `fundingUrl` | string | `https://www.buymeacoffee.com/kepano` | Optional funding link |

The AI reads this file to report the installed version. It never writes it.

### theme.css contract

`theme.css` is the entire rendering surface, 8709 lines in the installed copy. The file structure is stable and worth knowing:

| Region | Contents |
| --- | --- |
| Header comment | License, author, companion plugin names, copyright years |
| Variable block | `--h1-size`, `--blockquote-color`, `--font-editor` and hundreds of other CSS variables |
| Feature sections | Headings, code blocks, callouts, tables, graphs, canvas and more |
| Embedded settings block | The `/* @settings */` schema, documented in section 4 |

The header comment is verified text and reads in part: "Designed to be used with Minimal Theme Settings and Hider plugins." This is the theme author's own statement of companion intent.

---

## 3. ACTIVATION ARTIFACT

### appearance.json schema

The theme activates through a single optional key in `.obsidian/appearance.json`. The installed file contains exactly one key, verified on disk.

```json
{
  "cssTheme": "Minimal"
}
```

| Key | Type | Meaning |
| --- | --- | --- |
| `cssTheme` | string | The active theme folder name. Absent or empty means the default theme |

### Semantics

- The value must match a folder name under `.obsidian/themes/` exactly.
- This vault also contains a `Primary` theme folder, so the match must be exact.
- Obsidian writes this key when the user picks a theme in Settings → Appearance → Themes.
- The AI treats this file as user-owned configuration. Reads are always safe. Writes require explicit approval and a backup.

### Related appearance keys

Obsidian stores other appearance state in the same file, including interface language, base color scheme and enabled CSS snippets. This vault's file holds only `cssTheme` today. The snippet enablement key is documented in section 5.

---

## 4. EMBEDDED SETTINGS SCHEMA

`theme.css` ends with a `/* @settings */` block that describes the theme's customizable variables. The block has the schema id `minimal-style`, verified in the installed file.

### Purpose

The block is a declarative schema for companion plugins. Minimal Theme Settings and Style Settings read the block and render a settings panel from it. The block itself changes nothing. The theme renders identically without the companions.

### Format notes

The block uses an indented, TOML-like format. Entries declare a title, a control type and defaults. Verified examples from the installed file:

```text
id: bg1
title: Primary background
type: variable-themed-color
format: hex
default-light: '#'
default-dark: '#'
```

Control types include `variable-themed-color` with `format` values such as `hex` and `hsl-split`, plus `heading` and boolean-style toggles. An `opacity: true` line appears on variables that support transparency.

### Verified top-level groups

The block organizes variables under named groups. The following groups are verified in the installed file:

| Group | What it controls |
| --- | --- |
| `interface` | Base, background and border colors |
| `accent-color` | Accent and text-on-accent colors |
| `extended-palette` | Red, orange, yellow, green, cyan, blue, purple, pink |
| `bases` | Obsidian Bases toolbar and table appearance |
| `blockquotes` | Quote color, background, border and size |
| `callouts` | Callout style and color blending |
| `canvas` | Canvas dot pattern |
| `code-blocks` | Code size, background and syntax colors |
| `dataview` | Dataview table trimming and column width |
| `embed-blocks` | Embed titles, underlines and backgrounds |
| `graphs` | Graph line and node colors |
| `headings` | H1 through H6 fonts, sizes, weights and colors |
| `icons` | Icon color states |
| `images` | Image radius, blending and grid behavior |
| `links` | Internal and external link colors |
| `lists` | Checkbox shape, list spacing and indent |
| `pdf` | PDF page style and dark-mode inversion |
| `properties` | Metadata panel headers and dividers |
| `sidebars` | Sidebar tab style and vault profile display |
| `tables` | Table text size, lines and hover behavior |
| `tabs` | Header height, tab style and stacked tabs |
| `tags` | Tag radius, colors and borders |
| `text` | Base text, highlight and muted colors |
| `titles` | File header and inline title appearance |
| `window-frame` | Titlebar text and frame colors |

### Verified variable ids

Representative variable ids from the block, verified in the installed file:

| Id | Controls |
| --- | --- |
| `base` | Base color for all backgrounds and borders |
| `bg1`, `bg2`, `bg3` | Primary, secondary and active backgrounds |
| `ui1`, `ui2`, `ui3` | Border, highlighted border and active border colors |
| `ax1`, `ax2`, `ax3` | Accent, accent hover and accent interactive |
| `sp1` | Text on accent |
| `h1-size` through `h6-size` | Heading sizes per level |
| `blockquote-color` | Blockquote text color |
| `table-text-size` | Table font size |
| `tag-radius` | Tag corner radius |

The AI reads these ids to explain what a tweak would change. It never writes them into `theme.css`. The full list lives in the `@settings` block inside the installed file.

---

## 5. SNIPPETS LAYER

### Directory contract

Custom CSS lives in `.obsidian/snippets/` as plain `.css` files. This vault has no snippets folder yet, verified on disk. The folder appears automatically when the user creates the first snippet in Settings → Appearance → CSS snippets.

### File contract

A snippet is plain CSS. The idiomatic snippet overrides theme variables on the `body` selector so the change scales across the interface.

```css
/* Durable why: tighten heading sizes for dense reading */
body {
  --h1-size: 1.15em;
  --h2-size: 1.05em;
}
```

Obsidian applies snippets on top of the active theme, so the same variable names win over the theme defaults.

### Enablement

Obsidian records enabled snippets in an array inside `appearance.json`. The exact key name follows Obsidian's documented appearance file format (VERIFY: the key is not present in this vault because no snippet exists yet). The AI proposes the snippet file first and documents the enable step as the user's in-app action.

### Backup discipline

Every snippet write starts with a timestamped backup.

```bash
cp snippet.css snippet.css.bak-$(date +%s)
```

A single snippet file stays one logical tweak set. Multiple tweaks become multiple files with clear names.

---

## 6. COMPANION PLUGIN DATA

Minimal Theme Settings and Style Settings are separate community plugins. Neither is installed in this vault, verified in `.obsidian/community-plugins.json`. When one is installed later, it owns its own plugin folder and its own data file. It falls under the plugin reference-set discipline, not this theme set.

---

## 7. WHAT THE AI MUST NOT DO

- **Never edit `theme.css`.** It is the shipped artifact and the theme's update payload.
- **Never edit `manifest.json`.** Version and identity live there.
- **Never fabricate settings keys.** The theme has none. The `@settings` block is documentation, not a write target.
- **Never claim the theme writes data.** It reads and writes no vault content.
- **Never treat a snippet as a theme edit.** Snippets are user-owned overlay files.
- **Never validate by pixels.** File-layer checks end at valid JSON, present files and exact key values.
