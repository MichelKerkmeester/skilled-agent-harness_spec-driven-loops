# Phase 4 — Plan-only flow

Phase 4 is delivered as one work-leaf, [`001-mode-design-plan`](001-mode-design-plan/), which plans
a dedicated `sk-code` surface packet for Mobile-CLI app work. It authors **no** skill files; the
deliverable is the plan document.

## Leaf — `001-mode-design-plan`

### Objective

Plan the new SURFACE evidence packet `sk-code-mobile-cli` under the `sk-code` parent hub so future
code work on `apps/pi-remote-web/` auto-loads the design-system and designer-editability conventions.

### Scope

Ground the plan in the real hub contract (`sk-code/SKILL.md` §2, `mode-registry.json`, `ROUTER.md`,
`shared/`), then specify: the packet identity (`graph-metadata.json`), the `mode-registry.json`
surface entry, the `PI_REMOTE`/`MOBILE_CLI` surface-detection marker and its precedence, the folded
implement → debug → verify workflow doctrine, and how the packet encodes the token library, the
`@ds` grammar, the editability guardrails, and the verification command set. Author no files under
`.opencode/skills/sk-code/`.

### Verification gate

Plan-only — documentary, not the app CDP gate:

```text
node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "code work on apps/pi-remote-web" || true
```

The gate passes only when the plan cites `sk-code/SKILL.md` §2 and the real `mode-registry.json`
schema; every hub convention maps to a concrete packet section; the plan explains how the token
library, `@ds` grammar, and editability guardrails are encoded; and the plan states that building
the mode is out of scope and lists the exact files a follow-on build packet would create.
