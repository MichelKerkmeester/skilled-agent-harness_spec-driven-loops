# mcp-bladebro Benchmark Sources

> mcp-bladebro · manual-testing-playbook · 14-step macOS plan

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/mcp-browser-use/mcp-bladebro` |
| Scenarios | `BB-001` to `BB-014` under `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/` |
| Plan | The 14-step macOS plan in `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/spec.md` section 3 |
| Install answer | The progress table in the same packet's `goal.md` |
| Run evidence | A session scratch folder outside the repository, `bb/step3.txt` to `bb/step14b.txt`, `bb/step13-launch.log`, `bb/sidecar/` and `bb/steps.json`. It sits under the system temporary folder and is not durable. The quotes in `README.md` are the lasting record |
| Base | Branch `worktrees/505-mcp-browser-use-hub` at `614858c884c` plus its uncommitted changes |

---

## 2. BOUNDARY

The scenarios are inputs and are never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-11-21.
