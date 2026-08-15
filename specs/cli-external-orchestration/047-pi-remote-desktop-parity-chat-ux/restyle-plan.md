# Pi Remote PWA — Claude Design-System Restyle Plan

## Overview and authority boundary

Apply the Claude visual language as a presentation layer without changing Pi Remote's information architecture, host authority, or interaction contracts. Pi Remote remains a task-critical Product surface in the preserve lane, calibrated at **variance 4 / motion 2 / density 6**: warm and editorial, but compact enough for operational use.

The signature move remains the relay-orbit motif, redrawn as a quiet paper-and-ink signal diagram with Chalk/Mist rings, Carbon geometry, and one small Clay node. Clay is never the default call-to-action color.

This plan does not alter:

- relay authentication, foreground authority, redaction, one-use tickets, revisions, rate limits, or idempotency;
- the single live Pi session or host authority for model, effort, mode, streaming, and tools;
- content-free push payloads;
- transcript storage, stable ids/revisions/sequences, replay, cache, virtualization, or snapshot barriers;
- command filtering, Plan enforcement, delivery-unknown handling, or no-auto-submit rules;
- routes, navigation meanings, form fields, validation meaning, or approval wording.

The packet's frozen implementation scope must be revised, or an implementation child must be established, before application changes begin. This document is the visual implementation contract; it does not itself authorize application code changes.

## 1. Source fidelity and deliberate Pi Remote adaptations

The Claude bundle is the source for light-theme material, type character, shape, spacing vocabulary, and restraint. Pi Remote adaptations are explicit rather than described as exact source copies.

| Decision | Source fidelity or adaptation | Binding outcome and rationale |
|---|---|---|
| Claude color primitives, 8/16/24px radii, paper shadows, 24/30px serif headings | Source fidelity | Copy the named primitive values without reinterpretation. |
| Source font names | Source fidelity as reference only | Keep `--font-anthropic-*` reference primitives distinct from application aliases; production uses the licensed bundled substitutes below. |
| Primary card padding | Pi Remote density adaptation | Use 24px on operational cards and 16px on nested evidence instead of Claude's characteristic 32px. Verify at 390×844 and 200% text. |
| Controls and metadata | Pi Remote density adaptation | Keep 44px targets, 14–15px compact UI, and 12px meaningful captions. Do not reproduce marketing-page whitespace. |
| Dark theme | Pi Remote contract adaptation | Derive a warm dark semantic palette because System/Light/Dark already exists and is a release gate. The Claude source remains canonical for light. |
| Success, warning, danger, and diff colors | Operational adaptation | Use only for real state/evidence, always with label or icon. They are not competing brand accents. |
| Focus treatment | Accessibility adaptation | Carbon on light and warm white on dark replace the source's accent/glow focus treatment so the ring meets 3:1 everywhere. |
| Content width | Product adaptation | Preserve the current 76rem shell and 66ch reading measure; the source's 1200px marketing layout is not imposed on the control surface. |

Release screenshots must include 390×844 light and dark, plus 390×844 at 200% text, so these adaptations cannot be mistaken for drift.

## 2. Token architecture and exhaustive migration

### 2.1 Layer boundary

Use three distinct layers:

1. **Claude source primitives** in `@theme`: exact bundle names/values for colors, source font identities, type steps, spacing, radii, and shadows.
2. **Pi Remote semantic aliases**: theme-aware roles such as `--canvas`, `--ink-muted`, `--control-border`, and semantic typography roles. Components consume only these aliases.
3. **Phase opt-in scope**: until Phase 4 cutover, new/migrated component roots opt into the Claude semantic aliases without changing the legacy aliases used by still-unmigrated surfaces.

Do not rename a source primitive into an application role. In particular, keep `--font-anthropic-serif` and `--font-anthropic-sans` as reference primitives; use `--font-display` and `--font-ui` for the actual bundled families.

### 2.2 Exact Claude source primitives

```css
@theme {
  --color-bone-parchment: #f8f8f6;
  --color-paper-white: #ffffff;
  --color-soft-stone: #efeeeb;
  --color-carbon-ink: #121212;
  --color-graphite: #373734;
  --color-ashen: #7b7974;
  --color-pebble: #9c9a92;
  --color-mist: #b7b7b5;
  --color-chalk: #e7e6e1;
  --color-obsidian: #000000;
  --color-clay: #d97757;

  --font-anthropic-serif: 'Anthropic Serif', ui-serif, Georgia, Cambria, serif;
  --font-anthropic-sans: 'Anthropic Sans', ui-sans-serif, system-ui, sans-serif;

  --text-caption: 11px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.2;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-w580: 580;
  --font-weight-semibold: 600;

  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --shadow-lg: 0 4px 20px rgb(0 0 0 / 4%);
  --shadow-lg-2: 0 4px 24px oklab(0.431435 -0.02915 -0.125723 / 10%);
}
```

These are fidelity references, not blanket permission to use every primitive for text or controls. The allowed-use matrices below are authoritative.

### 2.3 Application typography, layout, spacing, and motion roles

```css
:root {
  --font-display: 'Source Serif 4', Charter, Georgia, Cambria, 'Times New Roman', serif;
  --font-ui: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-code: 'SFMono-Regular', 'Cascadia Code', 'Roboto Mono', Consolas, monospace;

  --type-micro-size: 11px;
  --type-micro-leading: 1.5;
  --type-caption-size: 12px;
  --type-caption-leading: 1.4;
  --type-compact-size: 14px;
  --type-compact-leading: 1.5;
  --type-ui-size: 15px;
  --type-ui-leading: 1.5;
  --type-control-size: 15px;
  --type-control-leading: 1.33;
  --type-prose-size: 16px;
  --type-prose-leading: 1.6;
  --type-heading-sm-size: 24px;
  --type-heading-sm-leading: 1.33;
  --type-heading-size: 30px;
  --type-heading-leading: 1.2;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-strong: 550;
  --weight-ui-max: 580;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --page-gutter: clamp(16px, 4vw, 48px);
  --content-width: 76rem;
  --reading-width: 66ch;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 16px;
  --radius-control: 8px;
  --radius-panel: 16px;
  --radius-elevated: 24px;

  --duration-fast: 120ms;
  --duration-state: 220ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-interface: var(--ease-out);
}
```

`--text-body` remains the Claude 14px source step. Product body and assistant prose never consume it directly; they use `--type-ui-size` and `--type-prose-size`. This removes the former 14/15/16px role collision.

### 2.4 Exhaustive current-token disposition

Every token currently declared by `style.css` is accounted for below. “Replace” means the final Phase 4 cutover changes the value; the opt-in boundary in Section 7 prevents an early global restyle.

| Current token | Disposition | Final role/value |
|---|---|---|
| `--font-sans` | Replace | Alias to `--font-ui`; do not alias to the Anthropic source reference. |
| `--font-mono` | Preserve/rename | Alias to `--font-code`; keep the existing system mono stack. |
| `--radius-control` | Replace | 8px control radius. |
| `--radius-panel` | Replace | 16px panel radius. |
| `--ease-out-interface` | Preserve/alias | `var(--ease-out)`. |
| `--canvas` | Replace | Light `#f8f8f6`; dark `#181715`. |
| `--canvas-subtle` | Replace | Light `#efeeeb`; dark `#1f1e1b`. |
| `--surface` | Replace | Light `#ffffff`; dark `#24221f`. |
| `--surface-raised` | Replace | Light `#ffffff`; dark `#2b2925`. |
| `--surface-muted` | Replace | Light `#efeeeb`; dark `#302e2a`. |
| `--surface-code` | Replace | Light/dark `#0f0f0e`; code is the bounded dark-surface exception. |
| `--ink` | Replace | Light `#121212`; dark `#f4f1eb`. |
| `--ink-secondary` | Replace | Light `#373734`; dark `#d8d3ca`. |
| `--ink-muted` | Replace | Light `#6c6a65`; dark `#b5afa5`. Meaningful small text only uses this or a stronger tier. |
| `--ink-inverse` | Replace | Light `#f8f8f6`; dark `#181715`. |
| `--line` | Replace | Light `#e7e6e1`; dark `#3b3934`; decorative separation only. |
| `--line-strong` | Replace/alias | `var(--control-border)`: light `#7b7974`; dark `#807a70`. |
| `--accent` | Replace | Clay `#d97757`; non-text marks only unless an allowed ratio is documented. |
| `--accent-strong` | Replace | Light `#b85f42`; dark `#e18b6c`; mark hover/press only. |
| `--accent-soft` | Replace | Light `#f3e4de`; dark `#3a2720`. |
| `--accent-ink` | Replace | Light `#8a452f`; dark `#f0b19a`; all accent-family ordinary text. |
| `--success` | Replace | Light `#37624a`; dark `#8fc4a4`. |
| `--success-soft` | Replace | Light `#e7eee9`; dark `#203129`. |
| `--warning` | Replace | Light `#8a452f`; dark `#f0b19a`. |
| `--warning-soft` | Replace | Light `#f3e4de`; dark `#3a2720`. |
| `--danger` | Replace | Light `#8d382e`; dark `#ee9b91`. |
| `--danger-soft` | Replace | Light `#f4e7e4`; dark `#3a2522`. |
| `--focus` | Replace | Light `#121212`; dark `#f4f1eb`. |
| `--diff-add` | Replace | Light `#e4eee7`; dark `#203129`. |
| `--diff-remove` | Replace | Light `#f3e5e2`; dark `#3a2522`. |
| `--shadow-raised` | Replace | Light Claude paper shadow; dark `0 4px 20px rgb(0 0 0 / 24%)`. |
| `--space-1` | Preserve | 4px compatibility step. |
| `--space-2` | Preserve | 8px. |
| `--space-3` | Preserve | 12px compatibility step. |
| `--space-4` | Preserve | 16px. |
| `--space-6` | Preserve | 24px. |
| `--space-8` | Preserve | 32px. |
| `--space-12` | Preserve | 48px operational section step. |
| `--space-16` | Preserve | 64px Claude section step. |
| `--page-gutter` | Preserve | `clamp(16px, 4vw, 48px)`. |
| `--content-width` | Preserve | 76rem shell. |
| `--reading-width` | Preserve | 66ch prose measure. |
| `--radius-sm` | Replace | 8px. |
| `--radius-md` | Replace | 16px contained/evidence radius; controls use `--radius-control`. |
| `--radius-lg` | Preserve | 16px. |
| `--duration-fast` | Preserve | 120ms named-property interaction transition. |
| `--duration-state` | Preserve | 220ms occasional state/sheet transition. |
| `--ease-out` | Preserve | `cubic-bezier(0.22, 1, 0.36, 1)`. |

New required roles are `--ink-tertiary-safe`, `--ink-disabled`, `--placeholder`, `--line-hairline`, `--control-border`, `--decoration-low`, `--action-bg`, `--action-fg`, `--radius-elevated`, and the typography roles above. No current token is deleted without an alias through final cutover.

## 3. Color roles and verified contrast

### 3.1 Light semantic palette

```css
:root {
  color-scheme: light;
  --canvas: #f8f8f6;
  --canvas-subtle: #efeeeb;
  --surface: #ffffff;
  --surface-raised: #ffffff;
  --surface-muted: #efeeeb;
  --surface-code: #0f0f0e;

  --ink: #121212;
  --ink-secondary: #373734;
  --ink-muted: #6c6a65;
  --ink-tertiary-safe: #6c6a65;
  --ink-disabled: #6c6a65;
  --placeholder: #6c6a65;
  --ink-inverse: #f8f8f6;

  --line: #e7e6e1;
  --line-hairline: #b7b7b5;
  --control-border: #7b7974;
  --line-strong: var(--control-border);
  --decoration-low: #9c9a92;

  --accent: #d97757;
  --accent-strong: #b85f42;
  --accent-soft: #f3e4de;
  --accent-ink: #8a452f;
  --action-bg: #121212;
  --action-fg: #f8f8f6;
  --focus: #121212;

  --success: #37624a;
  --success-soft: #e7eee9;
  --warning: #8a452f;
  --warning-soft: #f3e4de;
  --danger: #8d382e;
  --danger-soft: #f4e7e4;
  --diff-add: #e4eee7;
  --diff-remove: #f3e5e2;
}
```

Allowed-use matrix, recomputed against the actual Claude surfaces:

| Foreground role | Bone `#f8f8f6` | Paper `#ffffff` | Stone `#efeeeb` | Allowed use |
|---|---:|---:|---:|---|
| Carbon `#121212` | 17.62 | 18.73 | 16.15 | All text, icons, actions, focus. |
| Graphite `#373734` | 11.23 | 11.94 | 10.29 | All text and controls. |
| Safe tertiary `#6c6a65` | 5.08 | 5.40 | 4.66 | Metadata, helper text, placeholders, disabled labels. |
| Raw Ashen `#7b7974` | 4.09 | 4.35 | 3.75 | Sole control boundary or large text only; never ordinary text. |
| Raw Pebble `#9c9a92` | 2.65 | 2.82 | 2.43 | Decoration only; never text, icon meaning, or sole boundary. |
| Raw Clay `#d97757` | 2.94 | 3.12 | 2.69 | Decoration only on Bone/Stone; Paper non-text mark only. |
| Clay ink `#8a452f` | 6.64 | 7.06 | 6.09 | All Clay-family ordinary text. |

`--control-border` therefore uses Ashen and reaches 4.09/4.35/3.75:1 across every permitted light surface. Chalk and Mist are decorative separators only. Focus uses Carbon and is never Clay. The disabled state uses a contrast-safe label plus a muted fill and disabled semantics; it does not rely on opacity.

Semantic paired ratios are also binding: success `#37624a` on `#e7eee9` is 5.92:1; warning `#8a452f` on `#f3e4de` is 5.71:1; danger `#8d382e` on `#f4e7e4` is 6.35:1; action text `#f8f8f6` on `#121212` is 17.62:1.

### 3.2 Complete dark semantic palette

```css
:root[data-theme='dark'] {
  color-scheme: dark;
  --canvas: #181715;
  --canvas-subtle: #1f1e1b;
  --surface: #24221f;
  --surface-raised: #2b2925;
  --surface-muted: #302e2a;
  --surface-code: #0f0f0e;

  --ink: #f4f1eb;
  --ink-secondary: #d8d3ca;
  --ink-muted: #b5afa5;
  --ink-tertiary-safe: #9f998f;
  --ink-disabled: #9f998f;
  --placeholder: #9f998f;
  --ink-inverse: #181715;

  --line: #3b3934;
  --line-hairline: #4a4741;
  --control-border: #807a70;
  --line-strong: var(--control-border);
  --decoration-low: #777168;

  --accent: #d97757;
  --accent-strong: #e18b6c;
  --accent-soft: #3a2720;
  --accent-ink: #f0b19a;
  --action-bg: #f4f1eb;
  --action-fg: #181715;
  --focus: #f4f1eb;

  --success: #8fc4a4;
  --success-soft: #203129;
  --warning: #f0b19a;
  --warning-soft: #3a2720;
  --danger: #ee9b91;
  --danger-soft: #3a2522;
  --diff-add: #203129;
  --diff-remove: #3a2522;
}
```

The system-dark branch must share this declaration through a selector/layer, not copy it. The full permitted-surface matrix is:

| Foreground | Canvas | Subtle | Surface | Raised | Muted | Allowed role |
|---|---:|---:|---:|---:|---:|---|
| Primary `#f4f1eb` | 15.89 | 14.79 | 14.07 | 12.88 | 12.02 | All text/control. |
| Secondary `#d8d3ca` | 12.02 | 11.18 | 10.65 | 9.74 | 9.09 | All text/control. |
| Muted `#b5afa5` | 8.22 | 7.65 | 7.28 | 6.66 | 6.22 | Metadata/helper text. |
| Tertiary/disabled `#9f998f` | 6.34 | 5.90 | 5.61 | 5.13 | 4.79 | Ordinary tertiary and disabled labels. |
| Boundary `#807a70` | 4.21 | 3.92 | 3.73 | 3.41 | 3.18 | Sole meaningful non-text boundary only. |
| Raw Clay `#d97757` | 5.74 | 5.34 | 5.08 | 4.65 | 4.34 | Non-text selection/current marks; not ordinary text on Muted. |
| Clay text `#f0b19a` | 9.78 | 9.10 | 8.66 | 7.92 | 7.39 | All accent-family ordinary text. |

The former `#777168` boundary is removed from meaningful UI; it is decorative/inactive only. `#807a70` fixes the muted-surface boundary failure at 3.18:1. Code text `#f8f8f6` on `#0f0f0e` is 18.04:1. Dark action text `#181715` on `#f4f1eb` is 15.89:1. Semantic pairs pass: success 6.92:1, warning 7.69:1, danger 6.63:1.

## 4. Deterministic offline font supply chain

The shipping build uses one committed substitute pair: Source Serif 4 Regular plus Inter Roman Variable. Anthropic font files are excluded unless a separate rights-approved asset manifest replaces the whole pair. Runtime font or asset requests to external origins are prohibited.

### 4.1 Pinned acquisition and committed asset manifest

| Family | Upstream pin | Verified archive | Extracted upstream file | Committed public filename | CSS coverage |
|---|---|---|---|---|---|
| Source Serif 4 | Adobe `4.005R`, release commit `2823e99` | `source-serif-4.005_Desktop.zip`, SHA-256 `549fdb8f9a682bd06944298621404969f6de77c2e422ff3b8244a1dcd6a0c425` | `WOFF2/TTF/SourceSerif4-Regular.ttf.woff2` | `fonts/source-serif-4-4.005r-regular.woff2` | normal, weight 400 |
| Inter | rsms `v4.1`, release commit `e3a3d4c` | `Inter-4.1.zip`, SHA-256 `9883fdd4a49d4fb66bd8177ba6625ef9a64aa45899767dde3d36aa425756b11e` | `web/InterVariable.woff2` | `fonts/inter-4.1-roman-variable.woff2` | normal, weights 400 600 |

Subsetting decision: **no additional subsetting in this release**. Preserve the upstream WOFF2 bytes so model labels, transcript content, and locale fallback do not depend on a locally generated subset. The icon's π becomes an SVG path and does not rely on either font.

Commit beside the fonts:

- `fonts/source-serif-4-OFL-1.1.txt` copied from the pinned Source Serif release;
- `fonts/inter-4.1-OFL-1.1.txt` copied from the pinned Inter release;
- `fonts/font-assets.json` containing family, release/tag, source URL, archive SHA-256, extracted path, committed path, byte length, and **the computed SHA-256 of each committed WOFF2**.

No `PENDING`, wildcard, or unverified hash is allowed. The vendoring step first verifies the archive checksum, extracts only the named file, computes the committed-file checksum, writes it to the manifest, and then `sha256sum -c` (or the cross-platform Node equivalent) must pass in CI. This makes the individual file hashes exact for the bytes actually committed without trusting a copied hash from another distribution.

### 4.2 Font faces and fallback behavior

```css
@font-face {
  font-family: 'Source Serif 4';
  src: url('/fonts/source-serif-4-4.005r-regular.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-4.1-roman-variable.woff2') format('woff2');
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
}
```

Do not use `local()` and do not put `Anthropic Serif`, `Anthropic Sans`, or IBM Plex ahead of the bundled pair. Deterministic stacks are:

- display: `'Source Serif 4', Charter, Georgia, Cambria, 'Times New Roman', serif`;
- UI: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
- code: the existing system mono stack.

Preload exactly the two committed WOFF2 files with `as="font"`, `type="font/woff2"`, and `crossorigin`. Add exactly those paths to the release asset cache. Fallback metric overrides may be added only after measurement against these exact bytes; guessed `size-adjust` or ascent/descent values are forbidden.

## 5. Pre-paint theme contract

The persisted preference must be applied synchronously in `<head>` after the `theme-color` meta and before any stylesheet, preload that affects rendering, or module script. The bootstrap is static source text: no user-controlled interpolation and no external request. The snippet below is the **Phase 4 final form**. Foundation F lands the identical enum validation/order/listener contract with the current `#f4f5f7` light and `#101319` dark shell constants so the foundation remains visually inert; Phase 4 changes only those constants to the Claude values shown here when it owns the global cutover.

Binding bootstrap behavior:

```html
<meta name="theme-color" content="#f8f8f6" />
<script>
  (() => {
    const key = 'pi-remote.theme';
    const allowed = new Set(['system', 'light', 'dark']);
    let preference = 'system';
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null && allowed.has(stored)) preference = stored;
    } catch {}
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const resolved = preference === 'dark' || (preference === 'system' && media.matches)
      ? 'dark'
      : 'light';
    document.documentElement.dataset.theme = preference;
    document.documentElement.dataset.resolvedTheme = resolved;
    document.documentElement.style.colorScheme = resolved;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolved === 'dark' ? '#181715' : '#f8f8f6');
  })();
</script>
```

`index.html` keeps `data-theme="system"` as the no-script fallback and puts the bootstrap in the exact order above. If CSP is introduced, authorize this exact script with a nonce or pinned hash; never add `unsafe-inline`.

`main.tsx` cooperates as follows:

1. Before `createRoot`, read the already validated `document.documentElement.dataset.theme`; accept only `system | light | dark` and otherwise use `system`.
2. Pass that value as the initial App theme so React does not reread storage and overwrite the boot state.
3. The runtime theme setter validates the same enum, updates both data attributes, `color-scheme`, and `theme-color`, then attempts persistence.
4. Keep one `matchMedia` listener. It recomputes only the resolved theme when preference is `system`; it never changes the saved preference.
5. Remove the current later effect as an independent source of truth.

Automated first-paint proof must delay `/src/main.tsx` and the JS bundle, seed each storage case, and assert `data-theme`, `data-resolved-theme`, computed canvas color, and `theme-color` before React loads. Cases: explicit light, explicit dark, system light, system dark, a live system change, corrupt storage, blocked storage, and no-script/system fallback. No screenshot may contain the opposite theme.

## 6. Surface and component treatment

The already-sound hierarchy remains binding:

- App canvas is flat Bone; remove the cool gradient. Top bar is Paper/Bone with a decorative Chalk divider and no blur.
- Primary operational cards are Paper, 16px radius, 24px padding, no default shadow. Interactive cards use `--control-border`, not Chalk, as their sole boundary.
- Nested evidence is Stone at 16px radius. Enrollment and mobile sheets use 24px outer corners and the single overlay shadow.
- Composer is Paper, 16px outer radius, 8px controls, safe-area padding, `--control-border`, and no glass. Its shadow is allowed only where it overlaps content.
- User prompts are compact Stone/Paper bubbles; assistant prose is borderless 16px/1.6 at 66ch. Plans, diffs, errors, and approvals remain prominent. Routine evidence is a recoverable Disclosure.
- Code/evidence uses `#0f0f0e` with `#f8f8f6`, internal 8px radius, and contained overflow. Usage is flat divided rows.
- Review uses 30px Serif title, Paper approval cards, Carbon primary approval, outlined danger Deny, and secondary grant. Canonical arguments remain fully available.
- Attention uses label-first Paper rows with neutral icon wells. Enrollment uses one 24px Paper card and Carbon primary action.
- Runtime controls preserve exact Model/Effort labels; Build/Plan commits only after host confirmation. Sheets use 24px mobile corners/16px desktop dialog, safe areas, wrapped labels, and 44px rows.
- Empty states and quick actions fill drafts only. Turn actions are quiet overflow/long-press actions and never create an auto-submit path.
- Remove timeline rail, hover lift, accent-filled CTAs, glass blur, oversized headings, continuous pulse, and decorative motion in the phase that owns each surface.

## 7. Complete interaction-state contract

### 7.1 Global state and compound-state precedence

For every React Aria control, rest, hover, pressed, selected, focus-visible, disabled, pending, and error are explicit. Focus is an additive ring and never erased by selected/pending/error styling.

State precedence for behavior and announcement is:

1. unavailable/unsupported or authority unknown;
2. error or delivery-unknown;
3. pending/submitted;
4. offline/reconnecting/stale/checking;
5. disabled by local validity;
6. selected/expanded;
7. pressed, focus-visible, hover, rest.

Rules for compound states:

- Offline + stale announces “Offline · cached at …”; offline wins the action gate, stale time remains visible.
- Pending + disconnect becomes delivery-unknown/reconcile; it never returns to an enabled Retry state automatically.
- Selected + disabled keeps the selected check/label while using disabled semantics; selection is not visually erased.
- If the host-selected model/effort disappears, keep it as a pinned non-selectable “Current option unavailable” row, mark runtime stale, close mutation authority, and require refresh/reconciliation.
- Error overrides empty and loading. Empty is shown only after a successful settled load. No-results is distinct from an empty catalog.
- A control that becomes unavailable while focused moves focus to the nearest stable heading/status only when the element is removed; merely disabled controls retain visible contextual status without forced focus jumps.
- Reduced motion removes scale, translate, sheet travel, pulse, wave, and smooth scrolling; state text, outline, check, and live-region changes remain immediate.

### 7.2 Universal actionable-control matrix

| State | Trigger and transition | Visual treatment | Forbidden action / recovery | Accessible and focus contract |
|---|---|---|---|---|
| Rest | Settled, available | Paper/transparent, Graphite/Carbon label, compliant boundary where needed | None | Stable accessible name. |
| Hover | Fine pointer enters | Stone fill or stronger boundary; no lift | Must not expose touch-only information | `data-hovered`; no announcement. |
| Pressed | Pointer/key down | Immediate Carbon/Stone tonal change; no spatial scale in reduced motion | No commit until activation | `data-pressed`; spoken role unchanged. |
| Selected | Host/user selection settled | Carbon/Bone inversion or Stone row + Carbon check | Color alone cannot signal selection | `data-selected`/`aria-selected` or pressed semantics, whichever React Aria owns. |
| Focus-visible | Keyboard/assistive focus | 3px `--focus`, 2–3px offset; additive over all states | Never Clay or outline removal | `data-focus-visible`; logical tab order. |
| Disabled | Unsupported, stale authority, invalid input | Safe-muted label, muted fill, compliant retained boundary; no opacity-only treatment | Activation blocked | `data-disabled`/native disabled; reason is adjacent or described. |
| Pending | Accepted user intent awaiting authority | Only chosen row/action shows static pending label; other conflicting controls disabled | No duplicate activation or optimistic committed value | `aria-busy` or status text; one polite announcement. |
| Error | Settled failure | Danger label/icon plus compliant boundary or soft fill | Automatic repeat blocked; explicit recovery only | Error/status association; focus remains or moves to error summary only on submit failure policy. |

### 7.3 Per-surface state matrix

| Surface/control | States and trigger | Treatment and transition | Recovery / forbidden action | Name, announcement, focus, reduced motion |
|---|---|---|---|---|
| Top bar and connection status | authenticating, connecting, reconnecting, live, offline, error | Static label + icon; Clay dot only for active signal; no pulse | Offline/error never implies action authority | `role=status`; announce phase change once, not timer ticks. Mobile theme controls keep full accessible names even when visible labels compact. |
| Theme control | rest/hover/pressed/selected/focus/disabled plus system change | Selected Carbon/Bone; system changes only `data-resolved-theme` | Corrupt/blocked storage falls back to System | React Aria `ToggleButton` state is authoritative; no local selected mirror. |
| Session catalog/card | loading, empty, error, cached/stale, live; card rest/hover/pressed/focus/disabled | Layout-preserving text; Paper card, Stone hover, no lift; stale timestamp remains safe-muted | Error provides Refresh; stale/offline card may open cached view but cannot imply steering | Entire 44px+ row is named; loading/empty/error are distinct live statuses. |
| Device actions | rest/hover/pressed/focus/pending/error | Outlined text action; danger text only for destructive meaning | No double revoke/logout | Pending status names operation; focus returns to surviving shell control after success. |
| Push settings | checking, unsupported, permission denied, subscribing, subscribed, saving, unsubscribe pending, failure | Stone section; Carbon switch track/Bone thumb; safe-muted support copy | Permission denied offers browser-settings guidance; failure preserves last confirmed preferences and explicit Retry | Switch `data-selected` is authoritative; denied/unsupported announced once; controls disabled while request pending. |
| Runtime strip | checking, ready, pending, stale, offline, unavailable, error | Exact labels remain visible; checking/stale/error are text + icon, not color-only | All mutations blocked outside ready; Refresh/Reconcile is explicit | One polite authority-state announcement; no cached committed value. |
| Model/Effort rows | loading, empty catalog, no results, catalog failure, stale, rest/hover/pressed/focus/selected/pending/disabled, selected option disappears | Paper sheet, Stone row hover/selection, Carbon check, pending only on chosen row | No optimistic closed-chip change; disappeared selection enters stale rule above | `ListBox` semantics own selection/disabled. Search says result count/no results. Escape closes; focus returns to trigger. |
| Command palette and quick actions | closed/open, loading, empty, no results, failure, stale catalog, active row, selection | Instant open/keyboard navigation; quiet list; selection inserts draft text | Selection/quick action never submits; stale catalog disables insertion until refresh | `ComboBox`/`ListBox` semantics; selection closes and returns focus to composer. Scroll locks only background, not sheet. |
| Sheet/dialog shell | opening, open, dismissing, error | Neutral Carbon scrim without blur; no spatial travel in reduced motion | Outside click/Escape cannot discard an in-flight mutation; it may close only after status remains available in strip | Initial focus search/heading; trap within; restore trigger focus; body scroll restored exactly once. |
| Composer draft | empty, editing, offline, stale barrier, Plan, validation error | 16px textarea, 1–6 lines; Plan uses text + small mark only after host confirmation | Plain Return is newline; no action while authority unavailable | Visible label/description; hardware submit optional; no hidden touch dispatch. |
| Composer submission | queued/sending, immutable pending snapshot, accepted, rejected, delivery-unknown, reconnecting | Pending snapshot separate from new draft; rejected/delivery states are explicit cards/status | Rejected offers restore without overwriting new draft. Delivery-unknown offers Reconcile, never Retry. | One submitted/verifying/result announcement. Focus stays in new draft unless user chooses recovery. |
| Streaming actions | idle Send; streaming Steer/Later/Stop; pending/error | One Carbon primary at a time; Stop outlined danger | Slash extensions cannot use Steer/Later; pending action cannot repeat | Exact action name and pending state; 44px targets above keyboard. |
| Empty transcript runway | runtime checking/ready/error, action rest/hover/pressed/focus/disabled | Calm greeting with model/effort/mode and 2–4 draft actions | Actions fill only; disabled until runtime is authoritative | Buttons state their inserted draft; focus moves to populated composer. |
| User/assistant turn | optimistic pending, accepted, rejected, delivery-unknown, settled | User bubble shows text status; assistant prose stays borderless | No duplicate retry on unknown delivery | Status is text, not hue; revisions do not steal focus. |
| WorkingGroup/disclosures | running, settled-success collapsed, error expanded, rest/hover/pressed/focus/expanded/disabled | Stone group; high-signal error/plan/diff remains open/prominent | Typed evidence cannot become irrecoverable | React Aria `data-expanded`; trigger names Show/Hide; phase announcements throttled; motion static when reduced. |
| Plan card | viewing, refine draft, build confirmation, submitted, executing, timeout/unknown, error | Paper/Stone hierarchy, Carbon explicit actions | Refine never submits. Build cannot claim start before `executing-plan`; unknown offers Reconcile only | Confirmation receives focus; execution transition announced once. |
| Live edge | following, reader-away with N new, focused/pressed, returning | Carbon/Bone 8px control; count changes without movement | Never force-scroll while away | Polite count, not every token; focus/anchor survives revisions; reduced motion jumps instantly. |
| Turn actions | closed/open; Copy, Retry, Edit-and-resend available/unavailable/pending/error | Quiet overflow menu; no persistent icon row | Retry/Edit restore a draft only. Delivery-unknown hides Retry until reconciliation proves safe | `MenuTrigger/Menu/MenuItem`; disabled reason readable; close returns to trigger; long press has equivalent visible overflow button. |
| Review and alerts | load/empty/error; approval pending/submitted/verifying/approved/denied/expired/revoked/failed; grant active/expired | Pending uses compliant boundary + countdown; alerts use paired semantic tokens | Submitted action immutable; no repeat while verifying | Full action stays in name/context; live region announces submission/result, not countdown ticks; focused approval remains stable. |
| Attention inbox | loading, empty, error, stale, row rest/hover/pressed/focus, reauthenticating/disabled | Paper rows, neutral wells, explicit status text | Reauth disables only that row; error offers Retry; stale + offline follows precedence | Row name includes attention class/time/action; focus returns to row on recoverable failure. |
| Enrollment | idle, scan reading, scan failure, validation error, binding/busy, auth checking, success/failure/recovery | 24px Paper card; Carbon Enroll; outlined Scan; safe error pairs | Busy blocks duplicate bind. Scan failure preserves pasted input. Validation never clears entry. | Label and error association retained; busy announced once; focus moves to invalid input or error summary per submission result. |

Every row above is tied to Phase 2–4 tests and the physical-device checklist. A generic screenshot is not proof of state completeness.

## 8. React Aria and `App.tsx` migration contract

`App.tsx` may gain stable role classes such as `runtime-strip`, `approval-card`, or `attention-row`; it must not duplicate interaction state in local booleans for styling.

- Visual selectors consume React Aria's `data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-disabled`, `data-expanded`, and validation attributes.
- `Button`, `ToggleButton`, `Switch`, `Disclosure`, `ListBox`, `Dialog`, `ComboBox`, `Menu`, and related components remain the semantic owners. Do not replace their state with native-only selectors or parallel `isHovered`/`isPressed`/`isFocused` state.
- Classes describe durable component roles, not state. State classes are permitted only for domain state that React Aria does not own, such as `runtime-stale` or `delivery-unknown`, and must be derived from the authoritative reducer.
- Preserve accessible names, descriptions, error associations, selected/pressed/expanded state, disabled reasons, focus traps, focus return, and logical tab order.
- For every modified React Aria component, tests assert accessible name, role, selected/pressed/expanded state, disabled state, keyboard activation, Escape/dismissal where applicable, and focus return. CSS state tests assert the corresponding `data-*` selector rather than a duplicate class.
- Remove the current in-file transcript presentation only after every typed renderer has parity in Phase 3. Do not extract Home/Review/Inbox/Enrollment solely for styling.

## 9. Isolated integration with the five phases

Use an opt-in migration. There is no global alias switch before Phase 4.

| Sequence | Exclusive ownership | Permitted restyle work | Explicitly forbidden overlap | Exit gate |
|---|---|---|---|---|
| Phase 0 | Runtime baseline | None | Fonts, tokens, theme, selectors, assets | Existing Phase 0 gate. |
| Phase 1 | Dark control plane | None | Any visible restyle dependency | Existing Phase 1 authority/redaction gate. |
| Foundation F, after Phase 1 | Inert visual infrastructure only | Add exact Claude primitives under new names, semantic token definitions under an opt-in scope, font faces/assets/licenses/manifest, pre-paint theme runtime using the **current** shell colors, font preloads, asset-integrity tests, and two-generation cache support | Changing `body` font, current global semantic alias values, any existing component selector, icon colors, manifest colors, transcript/composer/home/review/enrollment appearance | Existing screenshots are pixel-stable except elimination of a wrong-theme flash; font hashes, first-paint tests, cache upgrade/downgrade tests pass. |
| Phase 2 | New runtime dock, sheets, commands, composer | Put only the new Phase 2 component roots in the Claude opt-in scope and implement their complete states | Restyling legacy transcript, Home, Review, Attention, Enrollment, top bar, icon, or manifest | Phase 2 behavior and state matrix pass while legacy transcript screenshots remain unchanged. |
| Phase 3 | New turn/transcript subtree | Opt in `TurnList`, `Turn`, evidence, Plan, working, and live-edge components; remove the rail with renderer replacement | Restyling legacy non-session pages or final global alias cutover | Typed parity, reader anchoring, and Phase 3 visual/state tests pass. |
| Phase 4 | Legacy surfaces and final cutover | Migrate shell, Home, Review, Attention, Enrollment, push, empty/error states, icon/manifest; update bootstrap shell colors to Claude; flip root aliases; remove legacy opt-in scaffolding and old literals | Authority/protocol/storage changes | Full residue, contrast, accessibility, installed-PWA, cache rollback, and physical-iPhone gates pass. |

This section supersedes conflicting visual wording in `implementation-phases.md`. Before app implementation begins, its documentation-only entry gate must make these exact reconciliations:

- Phase 2 task 7: replace “existing one-accent tokens” with “Claude semantic tokens inside the Phase 2 opt-in scope; legacy surfaces remain stable.”
- Phase 3 task 8: replace “existing 8/12/16/24 rhythm” with “the Pi Remote semantic 8/12/16/24 rhythm backed by the Claude source scale.”
- Phase 4 task 1: replace “existing OKLCH tokens” with “final Claude semantic light/dark tokens,” and name Phase 4 as the global cutover owner.
- Add Foundation F's file set, entry/exit gate, and rollback drill to the phase table without renumbering Phases 0–4.

If those phrases remain inconsistent, application implementation is blocked. The foundation is a reversible infrastructure change, not an unnumbered global restyle.

## 10. Concrete file ownership

Paths are relative to the Pi Mobile workspace.

| File | Owning step and change |
|---|---|
| `apps/pi-remote-web/src/style.css` | Foundation F adds inert primitives, opt-in semantics, font faces, and shared state selectors; Phases 2–4 migrate only owned selectors; Phase 4 removes old literals/global aliases. |
| `apps/pi-remote-web/index.html` | Foundation F adds ordered pre-paint bootstrap and exact font preloads; Phase 4 changes shell colors to final Claude values. |
| `apps/pi-remote-web/src/main.tsx` | Foundation F seeds React from the bootstrapped preference before `createRoot` and installs one runtime theme authority. |
| `apps/pi-remote-web/src/App.tsx` | Owning phases add stable role/domain hooks only, preserving React Aria semantics and authority reducers. |
| `apps/pi-remote-web/public/fonts/*` | Foundation F adds exactly two WOFF2 files, two licenses, and `font-assets.json`. |
| `apps/pi-remote-web/public/service-worker.js` | Foundation F adds release-specific cache manifests and two-generation retention; Phase 4 uses final asset list. Push and API bypass remain unchanged. |
| `apps/pi-remote-web/public/manifest.webmanifest` | Phase 4 changes `background_color`/`theme_color` to `#f8f8f6`. |
| `apps/pi-remote-web/public/icon.svg` | Phase 4 replaces `#151924/#6f8bff/#4b68df/#ffffff` with approved Carbon/Bone/Clay literals and replaces `<text>` with a self-contained π path in the maskable safe zone. |
| Phase 2 runtime/composer components | Phase 2 owns Claude opt-in styling and all state rows for runtime, sheets, commands, quick actions, and composer. |
| Phase 3 transcript components | Phase 3 owns Claude opt-in styling and all state rows for turns, typed evidence, working group, Plan, and live edge. |
| `TurnActions.tsx` and legacy page surfaces | Phase 4 owns menu states and final legacy-surface migration. |
| `apps/pi-remote-web/tests/App.test.tsx` plus focused tests | Each phase adds behavioral, React Aria state, theme, focus, and no-auto-submit coverage for its owned surface. |
| `docs/quality/pi-remote-chat-ux-iphone.md` | Phase 4 records palette/font/theme, cold offline launch, cache upgrade/downgrade, VoiceOver, 200% text, keyboards/safe areas, and reduced motion. |

## 11. Residual-literal and implementation proof plan

### 11.1 Exact old literals and patterns to eliminate

The final Phase 4 tree must contain none of these old hex literals in `apps/pi-remote-web/src`, `public`, or `index.html`:

`#101319`, `#151924`, `#4b68df`, `#6f8bff`, `#f4f5f7`.

It must also eliminate every current raw `oklch(...)` literal, including the code/diff exceptions `oklch(0.9 0.012 255)`, `oklch(0.82 0.1 25)`, `oklch(0.82 0.08 153)`, and `oklch(0.82 0.08 25)`. The old OKLCH shadows, both duplicated system-dark blocks, raw `white` fills/text, the body `linear-gradient(...)`, `backdrop-filter`/`-webkit-backdrop-filter`, hover `translateY`, continuous `signal-pulse`/`working-wave`, and `Avenir Next` font references are residue.

Remote runtime asset patterns are forbidden: `https?://` in CSS `url()`, `@import` other than the local Tailwind import, Google/Adobe/Anthropic/font CDN hosts, and protocol-relative asset URLs. `transition: all` is forbidden.

### 11.2 Allowlist-based scan

Implementation adds `scripts/verify-pi-remote-visual-literals.mjs` and a reviewed `apps/pi-remote-web/visual-literals.allowlist.json`. The verifier scans `.css`, `.tsx`, `.ts`, `.html`, `.svg`, `.webmanifest`, and service-worker asset manifests and exits nonzero when it finds:

- any hex, named color, `rgb[a]`, `hsl[a]`, `oklab`, or `oklch` literal outside the declared primitive/semantic blocks or explicitly approved icon/manifest asset entries;
- any old literal/pattern listed above, even inside an otherwise allowlisted file;
- any external asset/font URL;
- a literal foreground/background pair not present in the contrast inventory;
- `<text>` in `icon.svg`, a non-WOFF2 font, an unmanifested font, or a font hash mismatch.

The mechanical residue command remains a transparent negative control:

```text
rg -n -i '#101319|#151924|#4b68df|#6f8bff|#f4f5f7|oklch\(|\bAvenir Next\b|backdrop-filter|signal-pulse|working-wave|transition\s*:\s*all|https?://[^"' )]+\.(woff2?|ttf|otf)' apps/pi-remote-web
```

Expected final result: no matches. The allowlist verifier is authoritative because it also catches new, previously unknown literals.

### 11.3 Selector-to-surface contrast inventory

Generate a machine-readable inventory with component/selector, state, theme, foreground token, background token, boundary token, font size/weight, and threshold. Expand every permitted semantic foreground across every surface allowed by the state matrix, then run the repository contrast checker. Normal text must be at least 4.5:1; large text and meaningful non-text UI at least 3:1. Decorative exemptions must be named and cannot carry text, status, focus, selection, or the sole control boundary.

### 11.4 Objective gates

1. **Token inventory:** extract all `--*` declarations/usages before and after. Every old token appears in Section 2.4 and has a final declaration or explicit deleted alias; no undefined use remains.
2. **Theme first paint:** the delayed-module tests in Section 5 pass for all eight cases with no opposite-theme frame.
3. **Font integrity/offline:** archive and committed-file hashes pass; only the two WOFF2 files ship; installed PWA cold-launches in airplane mode with no blank text or external request.
4. **Interaction states:** every matrix row has an automated semantic assertion where possible and a named physical check otherwise. Rest/hover/pressed/selected/focus/disabled/pending/error evidence exists for each applicable control.
5. **Responsive/assistive:** 320/375/390/414/768 CSS px, 200% text, portrait/landscape, coarse/fine pointer, software/hardware keyboard, VoiceOver, light/dark/system, and reduced motion pass without hidden model identity, clipped actions, focus loss, unsafe submit, or horizontal page scroll.
6. **Security/UX:** no optimistic runtime state, auto-submit, stale-authority action, delivery-unknown retry, typed-evidence loss, content-bearing push, or client-only Plan state.
7. **Visual proof:** fixed 390×844 screenshots cover Claude source fidelity and each deliberate density adaptation in light/dark/200% text.
8. **Workspace gate:** `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:web`, and `npm run build` all exit 0 from the final state.

## 12. Executable service-worker rollback

Font and visual asset rollout is a versioned release contract, not a source-only rollback.

### 12.1 Forward-compatible cache design

- Use immutable, versioned font filenames from Section 4 and Vite-hashed JS/CSS assets.
- Name caches `pi-remote-shell-<release-id>` and `pi-remote-assets-<release-id>`; each service worker embeds `CURRENT_RELEASE` and `PREVIOUS_RELEASE` plus exact shell/asset manifests.
- Install opens the current caches and `addAll`s every required shell/font asset. Any missing asset fails installation; a partial cache never activates.
- Do not delete all older caches on activate. Retain current and previous release caches; delete only caches outside that two-release allowlist after clients are on the new worker.
- Keep both current and previous release assets deployed for at least one full worker generation and the documented rollback window. Never rename or overwrite a versioned font in place.
- `service-worker.js` and `index.html` are served with revalidation/no-cache semantics. The worker never caches `/service-worker.js`, `/api/*`, or `/health`.
- Replace unconditional install-time `skipWaiting()` with an explicit update-ready handshake. Activate only after the current cache is complete; reload controlled clients once, after the user-safe activation point. Preserve content-free push handlers byte-for-byte in behavior.

### 12.2 Exact rollback procedure

For release `R` rolled back to prior verified release `R-1`:

1. Disable the new runtime-control capability if the broader release requires it; do not alter session data.
2. Redeploy the full verified `R-1` HTML/CSS/JS/icon/manifest set while retaining both `R` and `R-1` immutable font/hashed assets.
3. Publish a **new** rollback worker byte/version, `R-1-rollback-1`, whose current manifest points to `R-1` and whose previous manifest points to `R`. Restoring the old worker file without a new version is invalid.
4. Verify online that the rollback worker installs all `R-1` assets before activation, then trigger the explicit activation handshake and one client reload.
5. Verify cache storage contains the rollback current cache plus one previous cache, the document and font responses come from `R-1`, and `/api/*`, `/health`, and push behavior remain unchanged.
6. Close the installed PWA, enable airplane mode, and cold-launch. Verify `R-1` shell, fonts, light/dark theme, and core read-only navigation.
7. Only after a later healthy worker generation may `R` caches/assets be removed. Record release ids, cache names, worker state, and screenshots/logs in the rollback drill.

Required automated scenarios: upgrade installed `R-1` → `R`; first load online; repeat load offline; cold launch after `R` activation; rollback `R` → `R-1-rollback-1`; cold offline launch after rollback; a client left open across both activation boundaries. A failure blocks release. Rollback never deletes the session database or rewrites browser transcript storage.

## 13. Security, UX, and release invariants

- No visual class, label, preview, notification, or asset manifest contains unredacted prompt/tool/session content.
- Push remains content-free; service-worker changes do not alter notification payload parsing.
- Carbon/warm white owns primary action and focus. Clay is a bounded mark; operational semantics always include text/icon.
- Every coarse-pointer target is at least 44×44px. Focus is visible. Color is never the only state signal.
- React Aria remains semantic authority; host/runtime reducers remain domain authority.
- Plan, model, effort, commands, Send/Steer/Later/Stop, retry, and delivery-unknown rules remain exactly as defined by the five-phase build plan.
- Typed evidence remains recoverable; virtualization, replay, revisions, anchoring, and snapshot barriers are presentation-invariant.
- No external CDN or runtime asset origin is introduced.

## 14. Verification-finding closure

| Finding | Resolution in this plan |
|---|---|
| R-01 | Exhaustive current-token disposition; source/application alias boundary; complete spacing/width/motion/type roles; no 14/15/16px conflict. |
| R-02 | Enforceable light allowed-use matrix, safe tertiary/disabled/placeholder roles, compliant control border/focus, and exact ratios. |
| R-03 | `#807a70` dark control boundary, `#777168` decorative-only, raw Clay restriction, and full five-surface dark matrix. |
| R-04 | Universal and per-surface state matrices with trigger, precedence, recovery, semantics, focus, and reduced-motion behavior. |
| R-05 | Inert Foundation F plus per-phase opt-in migration, non-overlapping owners, exit gates, and exact build-plan wording reconciliation. |
| R-06 | Synchronous validated head bootstrap before render resources, plus explicit `main.tsx`/App cooperation and delayed-module tests. |
| R-07 | One pinned Source Serif/Inter pair, exact WOFF2 files, no subsetting, archive and committed-file integrity manifest, licenses, faces, preloads, cache entries, and system fallbacks. |
| R-08 | Exact old literal/pattern inventory, authoritative allowlist scanner, selector-to-surface matrix, and zero-residue negative control. |
| R-09 | Two-generation cache retention, immutable assets, activation handshake, exact rollback worker/version, and upgrade/downgrade/offline drills. |
| R-10 | Source-fidelity versus Pi Remote adaptation ledger and required comparison screenshots. |
| R-11 | React Aria state authority, stable-role-only classes, domain-state limits, and accessible-name/state/focus assertions. |

The restyle is ready for application implementation only after the documentation reconciliation in Section 9 is complete and every phase's objective gates are encoded. Recognition criteria remain: Claude in material, typography, restraint, and shape; Pi Remote in task hierarchy, relay-specific signature, security language, authority, and operational behavior.
