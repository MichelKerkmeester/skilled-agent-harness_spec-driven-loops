# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · weak-model authoring

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenarios | the eight files under `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/`, mapped in `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/scenarios.tsv` |
| Execution host | disposable worktree `worktrees/221-playbook-run`, removed at phase close |
| Base ref | `95abd302c8fbe320f9fd76b36951e33fff5f7d10` |
| Run files | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/`, one per playbook id, each with a `.check.txt` and a `.stderr.txt` sidecar |
| Scenario 483 worker files | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/483.worker-1/` (brief, reply, reply error output, validation output) |
| Verdict page | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/verdicts.md` |
| Source packet | `specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/` |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-10-25.
