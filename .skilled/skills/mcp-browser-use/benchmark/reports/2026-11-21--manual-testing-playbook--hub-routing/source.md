# mcp-browser-use Benchmark Sources

> mcp-browser-use · manual-testing-playbook · hub routing

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/mcp-browser-use` |
| Scenarios | `MT-001`, `MT-004`, `MT-007`, `MT-012`, `MT-013`, `MT-H01` and `MT-H04` under `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/` |
| Origin of five scenarios | `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/` at `HEAD`, read with `git show` |
| Router | `.skilled/bin/compiled-route.cjs` |
| Admission | `.skilled/bin/compiled-route-admission.cjs` and `.skilled/bin/tests/compiled-route-admission.test.cjs` |
| Run evidence | Captured to a temporary folder outside the repository and removed after the run. The quotes in `README.md` are the lasting record, trimmed where marked |
| Base | Branch `worktrees/505-mcp-browser-use-hub` at `614858c884c` plus its uncommitted changes |

---

## 2. BOUNDARY

The scenarios are inputs and are never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-11-21.
