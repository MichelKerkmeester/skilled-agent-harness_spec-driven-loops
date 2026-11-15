---
title: "Implementation Plan: Phase 19: vibe-relaunch-command-tier"
description: "Add Vibe to the session-relaunch loop on the command-only tier: the runtime list, the wrapper's launch case, the prepare message and the README row, proven by the relaunch suites and one manual hop."
trigger_phrases:
  - "vibe relaunch command tier plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: vibe-relaunch-command-tier

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`skilled-loop`), Node.js CommonJS (relaunch CLI and core) |
| **Framework** | The session-relaunch loop and Vibe 3.1.2's interactive CLI |
| **Storage** | The existing relaunch record and hop history; no new state |
| **Testing** | `node --test` relaunch suites and one manual hop |

### Overview
Vibe joins the loop the way Cursor and Devin did: it is a value in the runtime list, a case in the wrapper and a row in the README, and the operator ends the session by hand after `/speckit-handoff`. The suites prove the list, the launch line and the child skip, and one manual hop proves a fresh Vibe session claims the note.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` prints `fail 0` before any edit, as the baseline
- [ ] `ls .vibe/prompts/speckit-handoff.md` prints the path

### Definition of Done
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` prints `fail 0` with the Vibe cases added
- [ ] `scratch/manual-hop.md` and `scratch/resume-probe.md` exist with their commands and outputs
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-only relaunch tier.

### Key Components
- **Runtime list** (`lib/relaunch-core.cjs`): without `vibe` in it, every CLI command refuses `--runtime vibe`.
- **Wrapper case** (`.skilled/bin/skilled-loop`): without it, `skilled-loop vibe` launches Claude.
- **Prepare message** (`bin/session-relaunch.cjs`): without the Vibe entry, the session is told the loop will end it, which no Vibe hook does.

### Data Flow
The operator runs `skilled-loop vibe`. In the session, `/speckit-handoff` writes the note and runs `prepare --runtime vibe`, which arms the record and prints that nothing ends the session. The operator exits Vibe, the wrapper consumes the record and starts `vibe "<seed>"`, and the receiver claims the note from the seed.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the relaunch suites as the baseline and records Vibe's value-taking options from `vibe --help`. Implementation adds `vibe` to the runtime list, the wrapper case and option tables, the prepare message, the README row and the test cases. Verification runs the suites, one manual hop and the resume probe. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` covers the runtime list, the CLI's runtime checks (the CLI test already loops over `RUNTIMES`), the wrapper's Vibe launch line and the child skip. The manual hop and the resume probe are keyed runs, recorded in `scratch/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2`, Node.js, Bash, and `MISTRAL_API_KEY` for the two keyed runs. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: `skilled-loop` misparses a launch line for another runtime after the option-table change. Revert the phase's commit; the other six runtimes return to their tested state.
<!-- /ANCHOR:rollback -->

---
