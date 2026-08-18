---
name: sk-code-mobile-cli
description: "Read-only design-system evidence for the Pi Remote Mobile-CLI app — the primitive→semantic→component token library, the @ds editability grammar, the guardrails, and the browser-free verification gate."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: pi-remote, mobile-cli, apps/pi-remote-web, design-system, token-library, component-tokens, retint-recipes, theme-remap, ds-grammar, designer-editability, ink-on-parchment, primitive-semantic-component, model-sheet, slash-panel, diff-add, diff-remove, browser-free-resolver -->
<!-- Owns: pi remote app / mobile cli app / pi-remote-web / design system code / @ds grammar / token library edit / component-token retint / theme remap / designer-editable frontend. Does NOT own: routing (parent sk-code hub), code implementation lifecycle (workflow modes), app source values (frozen). -->

# mobile-cli Surface — Pi Remote Design-System Evidence

Read-only evidence base for code work on the **Pi Remote Mobile-CLI** app (`apps/pi-remote-web/`, a
React 19 + Vite + Tailwind 4 PWA). When the hub bundles this surface, a code workflow gains the app's
formalized design system: the three-layer token library, the `@ds` inline-comment editability grammar,
the guardrails that keep a designer edit out of logic and the security boundary, and the browser-free
verification gate this codebase actually uses.

---

## 1. WHEN THE HUB BUNDLES THIS

- The task's CWD or changed/target files sit under `apps/pi-remote-web/`, `apps/pi-remote-relay/`, or a
  `packages/pi-*` / `@pi-remote/*` workspace — the hub's surface detection resolves **PI_REMOTE**.
- The active workflow phase needs the app's design-system evidence: the primitive → semantic →
  component token model, the `@ds` inline-comment editability grammar, the `@ds guardrail: do-not-edit`
  fences, or the browser-free verification gate.
- This surface never owns edits, tests, or verification itself — the bundled workflow mode does the
  work (e.g. `sk-code-quality`, `sk-code-review`), and this packet supplies the design-system rules it
  must honor. A typical resolution is `[sk-code-quality, sk-code-mobile-cli]` or
  `[sk-code-review, sk-code-mobile-cli]`.

This packet is **advisor-invisible** (`routingClass: metadata`) and **read-only** — it never routes as a
primary and mutates nothing. It supplies evidence; the acting workflow applies it.

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
| [`references/verification.md`](references/verification.md) | The verification command set + the browser-free resolver method (the app's CSP renders it unstyled headless, so selector→value resolution — not screenshots — is the authoritative value-preservation gate). |
| [`references/workflow-implement.md`](references/workflow-implement.md) · [`workflow-debug.md`](references/workflow-debug.md) · [`workflow-verify.md`](references/workflow-verify.md) | The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`). |

Checklists (`assets/`): `assets/token-retint-checklist.md`, `assets/guardrail-audit-checklist.md`,
`assets/ds-verification-checklist.md` — see §4.

App documentation (`references/app-guide/`): the full Pi Remote app documentation set — operations,
setup, security, rollback, release-verification, incident playbooks, platform support, code standards,
install/onboarding, the `feature-catalog/` (auth-and-boundary, approval-and-mutation, command-and-push,
transport-and-state, pwa, release), `quality/` baselines, and `design-reference/` (UI teardown, map,
research, and screens). This surface is the single source for Pi Remote app documentation.

The live evidence lives in the app repo, not in this packet — this surface points at it:
`apps/pi-remote-web/src/design-system/tokens.md` (token catalogue),
`apps/pi-remote-web/src/design-system/designer-guide.md` (the designer guide), and
`apps/pi-remote-web/catalog.html` (the live catalog — every migrated surface in every state, light+dark).

---

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of code-mobile-cli's own intent -> reference/asset routing,
consumed by the skill-benchmark router-replay; keep it in sync with the parent hub union.

```python
# code-mobile-cli owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-mobile-cli/) and the sibling surface maps (code-webflow,
# code-opencode) plus the parent-owned universal/shared tier; a drift guard enforces
# that equality.
DEFAULT_RESOURCE = [
    "references/token-library.md",
    "references/ds-grammar.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":     {"weight": 1, "keywords": ["retint", "token edit", "component token", "semantic role", "@ds edit", "css custom property", "implement", "build", "primitive", "theme remap"]},
    "CODE_QUALITY":       {"weight": 1, "keywords": ["guardrail", "do-not-edit", "lint", "quality gate", "frozen value", "code smell", "naming"]},
    "DEBUGGING":          {"weight": 1, "keywords": ["debug", "broken", "regression", "wrong theme", "unexpected color", "leaking retint", "orphaned reference"]},
    "VERIFICATION":       {"weight": 1, "keywords": ["verify", "resolver", "value-preservation", "contrast", "wcag", "type-check", "test:web", "completion claim", "browser-free"]},
    "LANGUAGE_STANDARDS": {"weight": 1, "keywords": ["css variable", "css custom property", "typescript", ".tsx", "style.css", "tailwind", "token naming"]},
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

- **Token values are frozen.** The 8 `--pi-*` primitives (ink-on-parchment; Inter + Source Serif 4) are
  the palette contract. Retint a **semantic role** or a **component token**; never edit a `--pi-*` value.
- **The `@ds` grammar marks the seams.** A designer edits presentation through `@ds edit:` / `slot:` /
  `state:` seams; the `@ds guardrail: do-not-edit` fences (frozen primitives, focus ring,
  reduced-motion/contrast/forced-colors, ≥44px targets, per-surface state machines + status text,
  plan-mode overlay + atomic execute path, redaction chip, bounded-reading overflow) are off-limits.
- **CSS/token edits are presentation-only.** They cannot reach state computation, the mutation/ticket
  path, redaction, or plan-mode enforcement — that logic lives in TypeScript, never in the stylesheet.
- **WCAG AA holds in both themes**, controls stay ≥44px, and clay is never the sole state signal.
- **Verification is browser-free.** Because the app's strict CSP renders it unstyled under headless CDP,
  value-preservation is proven by resolving `src/style.css` to final values per theme (not screenshots);
  structural mount checks run against the built output. `npm run typecheck` / `build` / `test:web` (incl.
  `contrast.test.tsx`) gate every change. See `references/verification.md`.

---

## 4. ASSETS (on-demand, deferred from the first slice)

- Retint pre-flight + proof checklist — `assets/token-retint-checklist.md`
- Guardrail-fence audit checklist — `assets/guardrail-audit-checklist.md`
- Verification-gate checklist — `assets/ds-verification-checklist.md`

Assets are pulled on demand by the active workflow phase; they are not part of the initial evidence slice.

---

## 5. RULES

### ✅ ALWAYS
- Follow the parent hub's selected workflow mode; apply this surface's standards as read-only evidence.
- Stay within the declared read-only tool surface (`Read, Bash, Grep, Glob`).
- Prove value-preservation with the browser-free resolvers before any "done" claim.

### ❌ NEVER
- Never act as a separate advisor identity or route as a primary.
- Never change a `--pi-*` primitive value, a security boundary, or a `@ds guardrail: do-not-edit` fence.
- Never load resources outside this packet directory.

### ⚠️ ESCALATE IF
- A requested edit cannot be made through a token/slot/state/layout seam without touching logic.
- A change would alter a resolved token value, a security boundary, or an accessibility guarantee.

---

## 6. INTEGRATION POINTS

- **Input:** requests routed to `sk-code` whose surface detects as PI_REMOTE; the hub bundles this
  surface behind the chosen workflow mode.
- **Output:** the design-system rules, seams, and verification gate the workflow applies to
  `apps/pi-remote-web/`.
- **Related:** `../sk-code-webflow` and `../sk-code-opencode` (sibling surfaces); `../../shared/` (the
  shared doctrine); `system-spec-kit` (spec folders), `sk-git` (worktrees/commits).
