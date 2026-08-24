---
name: sk-code-mobile-cli
description: "Read-only Svelte design-system and source-convention evidence for the Pi Remote Mobile-CLI app."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.3.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: pi-remote, mobile-cli, app-mobile, app-relay, packages/pi-rpc-protocol, svelte, sveltekit, runes, scoped-styles, app.css, design-system, token-library, component-tokens, retint-recipes, theme-remap, ds-grammar, designer-editability, folder-docs, module-banners, browser-free-resolver -->
<!-- Owns: Pi Remote app / mobile cli app / app-mobile / app-relay / packages/pi-rpc-protocol / design system code / @ds grammar / Svelte source conventions / token library edit / component-token retint / theme remap / designer-editable frontend / source-folder README and CODE guidance. Does NOT own: routing (parent sk-code hub), code implementation lifecycle (workflow modes), app source values (frozen). -->

# mobile-cli Surface — Pi Remote Design-System and Svelte Evidence

Read-only evidence for code work on the **Pi Remote Mobile-CLI** app (`app-mobile/` and its relay
peer `app-relay/`, with the shared protocol in `packages/pi-rpc-protocol/`). The shipped web surface is
a SvelteKit app with Svelte runes and component-scoped styles. When the hub bundles this surface, a
code workflow gains the app's formalized design system, source-tree conventions, `@ds` inline-comment
grammar, guardrails that keep designer edits out of logic and the security boundary, and the
browser-free verification gate this codebase actually uses.

---

## 1. WHEN THE HUB BUNDLES THIS

- The task's CWD or changed/target files sit under `app-mobile/`, `app-relay/`, or
  `packages/pi-rpc-protocol/` in the Mobile CLI app repository. The hub's surface detection resolves
  **PI_REMOTE**.
- The active workflow phase needs the app's design-system evidence: the primitive → semantic →
  component token model, the `@ds` inline-comment editability grammar, the `@ds guardrail: do-not-edit`
  fences, or the browser-free verification gate.
- The active workflow needs the shipped Svelte source grammar: kebab-case names, SvelteKit route
  exemptions, runes lifecycle rules, shared-folder ownership, section banners, or paired source-folder
  documentation.
- This surface never owns edits, tests, or verification itself. The bundled workflow mode does the
  work (for example, `sk-code-quality` or `sk-code-review`) and this packet supplies the evidence it
  must honor. A typical resolution is `[sk-code-quality, sk-code-mobile-cli]` or
  `[sk-code-review, sk-code-mobile-cli]`.

This packet is **advisor-invisible** (`routingClass: metadata`) and **read-only**. It never routes as a
primary and mutates nothing. It supplies evidence while the acting workflow applies it.

---

## 2. REFERENCE MAP

| Reference | What it carries |
| --- | --- |
| [`references/token-library.md`](references/token-library.md) | The three-layer model — primitive (`--pi-*`, 8 frozen values) → semantic role → component token — with the frozen ink-on-parchment values and how a retint propagates. |
| [`references/component-tokens.md`](references/component-tokens.md) | The Layer-3 per-surface component token families (`--model-sheet-*`, `--slash-*`, `--diff-*`): what each alias resolves to, per theme, and the blast radius of retinting one. |
| [`references/retint-recipes.md`](references/retint-recipes.md) | Two worked, step-by-step retint recipes — a semantic-role retint (system-wide) and a component-token retint (one surface) — each with the browser-free resolver proof steps. |
| [`references/theme-remap.md`](references/theme-remap.md) | The light / dark / system-dark `@ds theme:` semantic remap: which role reads which primitive per theme, and which roles stay literal. |
| [`references/ds-grammar.md`](references/ds-grammar.md) | The `@ds` inline-comment grammar: `surface / slot / state / variant / edit / guardrail / catalog / theme`, and how to read each seam. |
| [`references/editability-guardrails.md`](references/editability-guardrails.md) | The `@ds guardrail: do-not-edit` fences and the architectural reason a CSS/token edit cannot reach logic or the security boundary. |
| [`references/verification.md`](references/verification.md) | The verification command set and the browser-free resolver method. The app's CSP renders it unstyled headless, so selector → value resolution, not screenshots, is the authoritative value-preservation gate. |
| [`references/workflow-implement.md`](references/workflow-implement.md) · [`workflow-debug.md`](references/workflow-debug.md) · [`workflow-verify.md`](references/workflow-verify.md) | The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`). |

Checklists (`assets/`): `assets/token-retint-checklist.md`, `assets/guardrail-audit-checklist.md`,
`assets/ds-verification-checklist.md` — see §4.

App documentation lives under `references/` in six purpose-named folders, each grouping one concern so
the set reads by intent:

- `references/operations/` — running the live relay: `operations.md`, `incident-playbooks.md`, `rollback.md`.
- `references/release/` — shipping a build: `ai-deploy-playbook.md`, `release-verification.md`.
- `references/setup/` — first run: `setup.md`, `install-and-onboarding.md`.
- `references/standards/` — the rules a change must hold: `code-standards.md`, `security.md`, `platform-support.md`.
- `references/design-reference/` — the `mobile-chat-apps/` UI teardown, current-UI map, competitor research, and screens.
- `references/quality/` — the DQI and full-access-runtime baselines.

The **feature catalog** and the **manual testing playbook** are the single source of truth at the app
repository root (`feature-catalog/` and `manual-testing-playbook/`). This surface does not mirror them,
so the evidence cannot drift from the shipped app.

The live design-system evidence lives in the app repository, not in this packet:
`feature-catalog/design-system/token-library.md` (token catalogue),
`feature-catalog/design-system/designer-editability.md` (designer editability guide), and
`app-mobile/catalog.html` (the live catalog — every migrated surface in every state, light and dark).

---

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of code-mobile-cli's own intent → reference/asset routing,
consumed by the skill-benchmark router-replay. Keep it in sync with the parent hub union.

```python
# code-mobile-cli owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-mobile-cli/) and the sibling surface maps plus the
# parent-owned universal/shared tier. A drift guard enforces that equality.
DEFAULT_RESOURCE = [
    "references/token-library.md",
    "references/ds-grammar.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":     {"weight": 1, "keywords": ["retint", "token edit", "component token", "semantic role", "@ds edit", "css custom property", "implement", "build", "primitive", "theme remap"]},
    "CODE_QUALITY":       {"weight": 1, "keywords": ["guardrail", "do-not-edit", "lint", "quality gate", "frozen value", "code smell", "naming", "folder docs", "comment grammar"]},
    "DEBUGGING":          {"weight": 1, "keywords": ["debug", "broken", "regression", "wrong theme", "unexpected color", "leaking retint", "orphaned reference", "self-invalidation", "effect loop"]},
    "VERIFICATION":       {"weight": 1, "keywords": ["verify", "resolver", "value-preservation", "contrast", "wcag", "type-check", "test:web", "completion claim", "browser-free", "scan-skill-references"]},
    "LANGUAGE_STANDARDS": {"weight": 1, "keywords": ["Svelte", "SvelteKit", "runes", "$state", "$derived", "$effect", "untrack", "scoped style", "app.css", "kebab-case", "MODULE", "section divider", "folder docs", "contrast.test.tsx"]},
    "ACCESSIBILITY":      {"weight": 1, "keywords": ["a11y", "accessibility", "reduced motion", "prefers-contrast", "forced-colors", "focus ring", "target size", "44px", "wcag aa"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/token-library.md",
        "references/ds-grammar.md",
        "references/component-tokens.md",
        "references/retint-recipes.md",
        "references/theme-remap.md",
        "assets/token-retint-checklist.md",
    ],
    "CODE_QUALITY": [
        "references/editability-guardrails.md",
        "assets/guardrail-audit-checklist.md",
    ],
    "DEBUGGING": [
        "references/verification.md",
        "references/component-tokens.md",
    ],
    "VERIFICATION": [
        "references/verification.md",
        "assets/ds-verification-checklist.md",
    ],
    "LANGUAGE_STANDARDS": [
        "references/token-library.md",
        "references/component-tokens.md",
        "references/theme-remap.md",
    ],
    "ACCESSIBILITY": [
        "references/editability-guardrails.md",
        "references/verification.md",
    ],
}
```

---

## 3. SURFACE STANDARDS (the non-negotiables)

These are frozen by the design and security contracts the app ships under. A workflow bundling this
surface MUST honor them:

- **Token values are frozen.** The 8 `--pi-*` primitives (ink-on-parchment, Inter + Source Serif 4)
  are the palette contract. Retint a **semantic role** or a **component token**, never a `--pi-*` value.
- **The `@ds` grammar marks the seams.** A designer edits presentation through `@ds edit:` / `slot:` /
  `state:` seams. The `@ds guardrail: do-not-edit` fences (frozen primitives, focus ring,
  reduced-motion/contrast/forced-colors, ≥44px targets, per-surface state machines + status text,
  plan-mode overlay + atomic execute path, redaction chip, bounded-reading overflow) are off-limits.
- **CSS/token edits are presentation-only.** They cannot reach state computation, the mutation/ticket
  path, redaction, or plan-mode enforcement. That logic lives in TypeScript and Svelte modules, never
  in a component's style block.
- **WCAG AA holds in both themes**, controls stay ≥44px, and clay is never the sole state signal.
- **CSS ownership is scoped.** Every surface's CSS lives in its component's scoped `<style>` block.
  `app-mobile/src/app.css` holds only rules shared by two or more renderers, including shared tokens,
  theme remaps, and resets.
- **Verification is browser-free.** Because the app's strict CSP renders it unstyled under headless CDP,
  value-preservation is proven by resolving `app-mobile/src/app.css` together with the changed
  component's scoped `<style>` block to final values per theme, not by screenshots. Structural mount
  checks run against the built output. `npm run typecheck`, `build`, and `test:web` (including
  `app-mobile/tests/contrast.test.tsx`) gate every change. See `references/verification.md`.

---

## 3b. SOURCE TREE CONVENTIONS (the shipped grammar)

This is the current source authority for the Mobile CLI tree. Apply it together with the frozen design
and security standards above.

### Naming and routing

- **Kebab-case applies everywhere under `app-mobile/src/` except `app-mobile/src/routes/**`.** This
  includes Svelte components, TypeScript modules, stories, workers, and `.svelte.ts` runes twins.
- **The `routes/**` exemption is deliberate.** SvelteKit reads `+page`, `+layout`, `+error`, and
  `[param]` segments as routing directives. Renaming one changes the URL contract, so those reserved
  names remain exactly as SvelteKit requires them.
- **The kind comes first in a component name**, from the closed list: `sheet-`, `menu-`, `dialog-`,
  `card-`, `button-`, `toggle-`, `radio-`, `screen-`. Use `sheet-model-effort.svelte` for
  model-effort sheets. A prefix search then reaches every instance of a kind.
- **Screens carry `screen-`**: `screen-chat.svelte`, `screen-home.svelte`, `screen-review.svelte`,
  `screen-attention-inbox.svelte`, and `screen-enrollment.svelte`. A screen is a kind like any other.
- **Feature components take no prefix**, because the feature name already identifies the thing. Only an
  instance of a listed kind leads with that kind.
- The grammar is executable. `scripts/naming/scan-naming.mjs` reports any in-scope path that does not
  match, and renames are generated from a manifest rather than typed by hand.

The package surface is the single `packages/pi-rpc-protocol/` package. Do not infer sibling packages
from the workspace wildcard. The remaining `.tsx` filename is intentional:
`app-mobile/tests/contrast.test.tsx` still exists and remains part of the web verification gate.

### Shared ownership

`app-mobile/src/shared/` is grouped by one reason to change, not by an abstract layer split:

| Folder | Changes when |
| --- | --- |
| `transport/` | The relay, auth, cache, or browser I/O contract changes. |
| `state/` | A reducer, state machine, or reactive state projection changes. |
| `commands/` | Host-command or slash-command behavior changes. |
| `catalog/` | Model, effort, or design-system catalog data changes. |
| `format/` | Display formatting or view-model shaping changes. |
| `viewport/` | Keyboard-safe visual viewport behavior changes. |
| `fixtures/` | Offline demo or story data changes. |
| `primitives/` | Reusable interaction primitives change. |
| `chrome/` | App-wide shell, status, theme, or header surfaces change. |

Keep feature-specific composition in `app-mobile/src/pages/`. A module belongs in the shared folder
whose reason to change matches the change. The grouping is an ownership boundary, not a claim that all
shared code has the same runtime layer.

### Module and comment grammar

Every source file opens with a `MODULE:` banner. Sections are numbered and use a paired box-drawing
rule, as in `app-mobile/src/shared/state/turns.ts`:

```ts
// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────
```

Apply the comment grammar actually present in the tree:

- Start prose comments in sentence case. Continuation lines may continue the sentence, but a new
  comment starts with a capital letter unless it is a directive, identifier, or code-shaped marker.
- Leave no commented-out code behind. Delete obsolete code instead of preserving a second, inert copy.
- Preserve the `@ds` seam markers where the design system exposes them: `surface`, `slot`, `state`,
  `variant`, `edit`, `guardrail`, `catalog`, and `theme`. They are searchable contract annotations.
- `scripts/naming/scan-comments.mjs` is the executable check for banners, sentence starts, commented-out
  code, `@ds guardrail:` shape, and section-rule coverage.

### Folder documentation

A source-bearing folder under `app-mobile/src/` owes a `CODE.md` only when it has three or more direct
source files or has child source folders. Those folders carry both `README.md` and `CODE.md`:

- `README.md` uses sk-doc's `readme-template.md` and answers what the folder does for someone using the
  app, what belongs there, and where to start.
- `CODE.md` uses sk-doc's `readme-code-template.md` and answers how the logic is arranged: topology,
  boundaries, entrypoints, flow, and validation.

A folder with fewer than three direct source files and no child source folders carries only `README.md`.
It still explains what its files own, the boundary with its caller, and where a change of a given kind
belongs. The reason matters: a rule without its reason gets optimised away by the next reader. The
threshold exists because documentation ceremony reads as content and rots the same way. The paired documents shared
one sentence in 2,877, so the split was duplicating nothing — it was scaling badly. Across the 29 folders, one leaf with a single component carried 266 lines
describing it twice. Folders with one or two source files averaged about 221
documentation lines per source file against about 36 in folders with three or more. Ten folders therefore
collapsed to one README, each about 45% shorter than the pair it replaced, while retaining the orientation
a reader needs and dropping a directory tree that repeated the key-files table. Orientation hubs such as
`pages/chat/` keep both documents when their child source folders make the code map useful.

The documents are current-state orientation, not migration history. `scripts/naming/scan-folder-docs.mjs`
enforces both directions: it reports a missing `CODE.md` where the threshold is met and a stray `CODE.md`
where it is not. Keep each folder's documents aligned when its source ownership, direct file count, or
child-folder structure changes.

### Runes effects: prevent self-invalidation

Svelte `$effect` tracks every reactive read made while it runs, including reads hidden inside a function
it calls. A synchronous dispatch can look write-only while its reducer reads the `$state` it reduces.
That read becomes an effect dependency. The dispatch then writes the same state, so the effect runs again
and its cleanup cancels work that is still in flight.

This is not a theoretical style concern. During the migration it froze auth and made the session roster
oscillate between loading and loaded, producing seven separate defects. Two of the seven appeared only
after tracing an API method that dispatched internally, not by grepping for a literal dispatch call. One
file needed fixing twice because correcting one effect did not clear the other effect in the file.

For every ported or edited effect:

1. Read the real reactive inputs in tracked scope.
2. Wrap the dispatch, or the API method that synchronously dispatches, in `untrack(...)`.
3. Trace every called method to the reducer and the state it reads and writes. Do not audit only for a
   visible `dispatch(...)` call shape.
4. Audit every effect in the file. A fixed effect does not prove its neighboring effects are safe.

The doctrine prevents cleanup-driven auth freezes, reconnect loops, and oscillating session state. It is
part of the source contract because the failure is otherwise silent until a lifecycle is exercised.

---

## 4. ASSETS (on-demand)

- Retint pre-flight and proof checklist — `assets/token-retint-checklist.md`
- Guardrail-fence audit checklist — `assets/guardrail-audit-checklist.md`
- Verification-gate checklist — `assets/ds-verification-checklist.md`

Assets are pulled on demand by the active workflow phase. They are not part of the initial evidence
slice.

---

## 5. RULES

### ✅ ALWAYS

- Follow the parent hub's selected workflow mode and apply this surface's standards as read-only
  evidence.
- Stay within the declared read-only tool surface: `Read`, `Bash`, `Grep`, and `Glob`.
- Apply the shipped source grammar before proposing a file path, component name, comment, or source-folder
  document.
- Trace Svelte effects through called APIs and reducers, then use `untrack(...)` for synchronous state
  mutations that would otherwise become dependencies.
- Prove value preservation with the browser-free resolvers before any "done" claim.

### ❌ NEVER

- Never act as a separate advisor identity or route as a primary.
- Never change a `--pi-*` primitive value, a security boundary, or an `@ds guardrail: do-not-edit` fence.
- Never rename SvelteKit-reserved route files or parameter segments.
- Never place a component-only rule in `app-mobile/src/app.css`.
- Never load resources outside this packet directory.

### ⚠️ ESCALATE IF

- A requested edit cannot be made through a token, slot, state, layout, or scoped-style seam without
  touching logic.
- A requested rename targets `app-mobile/src/routes/**` or a `[param]` segment and its URL impact is not
  explicit.
- An effect's called API hides state reads or writes and the dependency boundary cannot be established.
- A change would alter a resolved token value, a security boundary, or an accessibility guarantee.

---

## 6. INTEGRATION POINTS

- **Input:** requests routed to `sk-code` whose surface detects as PI_REMOTE. The hub bundles this
  surface behind the chosen workflow mode.
- **Output:** the design-system rules, Svelte source grammar, seams, and verification gate the workflow
  applies to `app-mobile/` and its relay/protocol peers.
- **Reference integrity:** from the app repository root, run
  `node scripts/naming/scan-skill-references.mjs /path/to/SKILL.md`. It resolves every app path named by
  this skill and rejects a counter-example that starts resolving. The expected result is `broken : 0`.
- **Source gates:** use `node scripts/naming/scan-naming.mjs`, `node scripts/naming/scan-comments.mjs`,
  and `node scripts/naming/scan-folder-docs.mjs` when checking the corresponding source conventions.
- **Related:** `../sk-code-webflow` and `../sk-code-opencode` (sibling surfaces), `../../shared/` (the
  shared doctrine), `system-spec-kit` (spec folders), and `sk-git` (worktrees and commits).
