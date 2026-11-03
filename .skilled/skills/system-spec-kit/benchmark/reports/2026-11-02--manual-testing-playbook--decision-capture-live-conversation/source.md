# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · decision capture live conversations

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenarios | `decision-capture-live-conversation.md`, `decision-capture-kill-switch-conversation.md` and `decision-capture-sibling-reproof-conversation.md` under `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` |
| Runner | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`, owned by `specs/sk-doc/065-conversation-playbook-scenarios` |
| Run evidence | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/<runtime>-run1/`: the runner output per scenario, the 13-row stage file, and the real-repository status before and after |
| Codex attempts | `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs/codex-run1/attempts/` |
| Base | `main` at `4c3222d5b9` plus this series' uncommitted changes |

---

## 2. BOUNDARY

The scenarios are inputs and are never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-11-02.
