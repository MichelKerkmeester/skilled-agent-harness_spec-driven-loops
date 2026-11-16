---
title: "Implementation Plan: Phase 8: wider-hop-recall-measurement"
description: "Copy the phase 1 hop-recall harness, point it at the engine's new build path, add Codex and Vibe, then run both arms with synthetic codes and real handoffs and record one result table."
trigger_phrases:
  - "wider hop recall measurement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: wider-hop-recall-measurement

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Python 3, the phase 1 harness |
| **Framework** | `skilled-loop` under tmux, one private session per run |
| **Storage** | Run folders under `scratch/runs/`, one `result.json` each |
| **Testing** | One dry run per runtime before the counted runs |

### Overview
The phase 1 harness drives a Claude Code sender that prints 120 one-time codes and hands over, then asks the receiver for one code. This plan copies it into this phase, fixes the engine build path it hides in the baseline arm, adds a runtime argument for Codex and Vibe, and adds real handoffs. The counted runs then fill one result table.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator has settled the run counts and models in `spec.md` section 7
- [ ] `test -f .skilled/hooks/session-handover/history/dist/cli.js && echo built` prints `built`
- [ ] Codex and Vibe each start a session from the repository root

### Definition of Done
- [ ] Every counted run has a `result.json`, and `scratch/measurement.md` reports every runtime, arm and handoff kind
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-arm field measurement.

### Key Components
- **`scratch/harness/hop-recall.sh`**: starts the sender under `skilled-loop`, accepts the trust and hook dialogs, asks the receiver the question and hides the engine build in the baseline arm.
- **`scratch/harness/analyze.py`**: reads the receiver's transcript and scores `lookup_attempted`, the answer and whether the note held it.

### Data Flow
The sender works and hands over. `skilled-loop` relaunches the receiver, which claims the note. In the lookup arm the claim prints the History Lookup section, and in the baseline arm the hidden build withholds it. The harness asks the question, and the scorer writes `result.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup copies the harness and fixes its build path. Implementation adds Codex, Vibe and real handoffs, then runs the counted runs one runtime at a time. Verification checks every counted run against the counting rule and writes the result table.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

One uncounted dry run per runtime and arm proves the harness before counting starts. In the dry baseline run, `test -f .skilled/hooks/session-handover/history/dist/cli.js` fails while the receiver runs and passes after the run ends.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`tmux`, `node`, `python3`, and logged-in Claude Code, Codex and Vibe. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase writes only under its own `scratch/` folder. If a run leaves the engine build hidden, `npm --prefix .skilled/hooks/session-handover/history run build` restores it.
<!-- /ANCHOR:rollback -->

---
