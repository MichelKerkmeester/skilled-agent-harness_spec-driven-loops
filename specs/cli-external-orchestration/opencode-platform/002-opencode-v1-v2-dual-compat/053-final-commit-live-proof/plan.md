---
title: "Implementation Plan: Phase 53: final-commit-live-proof"
description: "A driver extracts each plugin-utilization scenario file's own command block and runs the 17 of them unchanged, one after another, on OpenCode 1.19.3 and 2.0.32 from origin/main dfdc523af5. Verdicts are read from the evidence files per version, so a silent plugin cannot hide behind a block's exit code, and one scenario is rerun once with the reason recorded."
trigger_phrases:
  - "final commit live proof plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 53: final-commit-live-proof

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash for the driver and the scenario blocks, Markdown for the matrix |
| **Framework** | OpenCode 1.19.3 (`opencode run`) and 2.0.32 (`opencode2 run --standalone`), model `llmgateway/deepseek-v4.1-flash` |
| **Storage** | None; the evidence lands in the gitignored state folder and is copied into `scratch/live-runs/` |
| **Testing** | The live 17-plugin playbook, plus `validate.sh --strict` on this folder |

### Overview
A driver extracts each scenario file's own `Exact Command Sequence` bash block and runs it unchanged, in order, on both versions, between 21:14 and 21:25 UTC. Nothing is edited between blocks, so a plugin that fails here fails on the shipped tree. Each verdict is then read from that scenario's evidence: the events stream, the captured system prompt, the plugin's log lines and the state files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a verification pass over an existing playbook, at a commit nothing else in the phase touches.

### Key Components
- **The scenario files**: `manual-testing-playbook/plugin-utilization/*.md`, each owning one `Exact Command Sequence` block that the driver copies rather than rewrites, so the run cannot drift from the documented command.
- **The driver**: reads the blocks out in order and runs them one after another, writing one `<plugin>.txt` per scenario and one line per block in `summary.txt`.
- **The evidence**: the events stream, the captured system prompt, the plugin log lines and the state files under the gitignored state folder; the per-run effect and exit files are copied into `effects/`.
- **`validate.sh --strict`**: the gate on this folder, since the phase changes no code to test.

### Data Flow
Scenario file, then extracted block, then live session on v1 and on v2, then evidence files, then one verdict per cell in the matrix. `summary.txt` records each block's exit code, which is its last command's, so it corroborates the run but never decides a verdict.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`llmgateway/deepseek-v4.1-flash` must answer on both installed versions, and the playbook runner must capture events, prompts, plugin log lines and state files for each block. The shared OpenCode 2 service must be left alone: every v2 run passes `--standalone`, so PID 46220 is neither stopped nor attached to.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here. This phase changes no code: reverting it removes this folder's docs and evidence and nothing else, and the proof at `eb0c18f7e9` in 046 still stands.
<!-- /ANCHOR:rollback -->

---
