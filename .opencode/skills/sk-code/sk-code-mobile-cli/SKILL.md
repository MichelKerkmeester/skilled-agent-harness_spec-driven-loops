---
name: sk-code-mobile-cli
description: Read-only design-system evidence for the Pi Remote Mobile-CLI app — the primitive→semantic→component token library, the @ds editability grammar, the guardrails, and the browser-free verification gate.
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: pi-remote, mobile-cli, apps/pi-remote-web, design-system, token-library, ds-grammar, designer-editability, ink-on-parchment, primitive-semantic-component, browser-free-resolver -->
<!-- Owns: pi remote app / mobile cli app / pi-remote-web / design system code / @ds grammar / token library edit / designer-editable frontend. Does NOT own: routing (parent sk-code hub), code implementation lifecycle (workflow modes), app source values (frozen). -->

# mobile-cli Surface — Pi Remote Design-System Evidence

Read-only evidence base for code work on the **Pi Remote Mobile-CLI** app (`apps/pi-remote-web/`, a
React 19 + Vite + Tailwind 4 PWA). When the hub bundles this surface, a code workflow gains the app's
formalized design system: the three-layer token library, the `@ds` inline-comment editability grammar,
the guardrails that keep a designer edit out of logic and the security boundary, and the browser-free
verification gate this codebase actually uses.

---

## 1. WHEN THE HUB BUNDLES THIS

The parent `sk-code` hub bundles this surface (via `routerPolicy.outcomes.surfaceBundle`) alongside a
workflow mode whenever the detected surface is **PI_REMOTE** — code work whose CWD or changed/target
files sit under `apps/pi-remote-web/`, `apps/pi-remote-relay/`, or a `packages/pi-*` / `@pi-remote/*`
workspace. A typical resolution is `[sk-code-quality, sk-code-mobile-cli]` or
`[sk-code-review, sk-code-mobile-cli]`: the workflow mode acts, this surface supplies the design-system
rules it must honor.

This packet is **advisor-invisible** (`routingClass: metadata`) and **read-only** — it never routes as a
primary and mutates nothing. It supplies evidence; the acting workflow applies it.

---

## 2. REFERENCE MAP

| Reference | What it carries |
| --- | --- |
| [`references/token-library.md`](references/token-library.md) | The three-layer model — primitive (`--pi-*`, 8 frozen values) → semantic role → component token — with the frozen ink-on-parchment values and how a retint propagates. |
| [`references/ds-grammar.md`](references/ds-grammar.md) | The `@ds` inline-comment grammar: `surface / slot / state / variant / edit / guardrail / catalog / theme`, and how to read each seam. |
| [`references/editability-guardrails.md`](references/editability-guardrails.md) | The `@ds guardrail: do-not-edit` fences and the architectural reason a CSS/token edit cannot reach logic or the security boundary. |
| [`references/verification.md`](references/verification.md) | The verification command set + the browser-free resolver method (the app's CSP renders it unstyled headless, so selector→value resolution — not screenshots — is the authoritative value-preservation gate). |
| [`references/workflow-implement.md`](references/workflow-implement.md) · [`workflow-debug.md`](references/workflow-debug.md) · [`workflow-verify.md`](references/workflow-verify.md) | The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`). |

The live evidence lives in the app repo, not in this packet — this surface points at it:
`apps/pi-remote-web/src/design-system/tokens.md` (token catalogue),
`apps/pi-remote-web/src/design-system/designer-guide.md` (the designer guide), and
`apps/pi-remote-web/catalog.html` (the live catalog — every migrated surface in every state, light+dark).

---

## 2b. SMART ROUTING (machine-readable)

```python
# code-mobile-cli owns its intent -> reference routing. Paths are relative to this
# skill root. The hub reaches this map by bundling the packet as read-only evidence
# (hub-router.json routerPolicy.outcomes.surfaceBundle), and the packet's references
# are typed into the hub's leaf-manifest.json — the sk-create-skill typed-leaf
# contract. This design-system map is intentionally NOT folded into the hub ROUTER.md
# machine block, which projects the Webflow / OpenCode / Motion.dev surfaces only.
INTENT_SIGNALS = {
    "TOKEN_EDIT":   ["retint", "token", "--pi-", "semantic role", "component token", "color", "theme"],
    "DS_GRAMMAR":   ["@ds", "slot", "state", "variant", "edit here", "catalog", "seam"],
    "GUARDRAIL":    ["guardrail", "do-not-edit", "focus ring", "reduced-motion", "redaction", "a11y", "wcag"],
    "VERIFY":       ["verify", "resolver", "value-preservation", "contrast", "390px", "mount check"],
}
RESOURCE_MAP = {
    "TOKEN_EDIT": ["references/token-library.md"],
    "DS_GRAMMAR": ["references/ds-grammar.md"],
    "GUARDRAIL":  ["references/editability-guardrails.md"],
    "VERIFY":     ["references/verification.md",
                   "references/workflow-verify.md"],
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

## 4. RULES

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

## 5. INTEGRATION POINTS

- **Input:** requests routed to `sk-code` whose surface detects as PI_REMOTE; the hub bundles this
  surface behind the chosen workflow mode.
- **Output:** the design-system rules, seams, and verification gate the workflow applies to
  `apps/pi-remote-web/`.
- **Related:** `../sk-code-webflow` and `../sk-code-opencode` (sibling surfaces); `../../shared/` (the
  shared doctrine); `system-spec-kit` (spec folders), `sk-git` (worktrees/commits).
