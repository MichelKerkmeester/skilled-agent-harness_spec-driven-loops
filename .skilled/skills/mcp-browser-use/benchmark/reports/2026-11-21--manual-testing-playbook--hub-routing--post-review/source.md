# mcp-browser-use Benchmark Sources

> mcp-browser-use · manual-testing-playbook · hub routing, after the deep-review fixes

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/mcp-browser-use` |
| Scenarios | `MT-001`, `MT-004`, `MT-007`, `MT-012`, `MT-013`, `MT-H01` and `MT-H04` under `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/` |
| Canary probe | The `chrome-devtools-http-403-forbidden` case in `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` |
| Router | `.skilled/bin/compiled-route.cjs` |
| Admission | `.skilled/bin/compiled-route-admission.cjs` and `.skilled/bin/tests/compiled-route-admission.test.cjs` |
| Review that drove the fix | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/review-report.md` |
| Run evidence | Captured to a temporary folder outside the repository. The quotes in `README.md` are the lasting record |
| Base | Branch `worktrees/505-mcp-browser-use-hub` at `c7f38f295d2` plus its uncommitted changes |

---

## 2. BOUNDARY

The scenarios are inputs and are never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-11-21.
