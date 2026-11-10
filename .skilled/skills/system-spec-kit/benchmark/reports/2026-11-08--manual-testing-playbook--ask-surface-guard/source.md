# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · ask-surface guard live conversations

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenarios | `ask-surface-guard-live-conversation.md`, `ask-surface-guard-devin-advisory-conversation.md`, `ask-surface-guard-kill-switch-conversation.md` and `ask-surface-guard-no-false-positive-conversation.md` under `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` |
| Runner | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` |
| Run evidence | `specs/hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement/scratch/live-runs/<scenario>/<runtime>/`: the runner output per run. Whole-repository snapshots over 1 MB are replaced by `repo-snapshots.sha256` |
| Base | `main` at `51fc49ae75` plus this packet's uncommitted changes |

---

## 2. BOUNDARY

The scenarios are inputs and are never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-11-08.
