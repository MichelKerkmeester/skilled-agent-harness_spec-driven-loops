---
title: "Implementation Plan: Phase 17: handover-docs-and-harness"
description: "Fix finish-run.sh test first, then write the README and playbook sections phase by phase as each of phases 009 to 016 closes, then raise the playbook version and run the live background-worker check once."
trigger_phrases:
  - "handover docs and harness plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: handover-docs-and-harness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown for the two documents, Bash for the harness |
| **Framework** | None |
| **Storage** | None |
| **Testing** | A plain Bash test script, `validate_document.py`, `frontmatter-version.mjs` and one live tmux run |

### Overview
The phase first fixes the harness, because the live check at the end depends on it: a Bash test reproduces the late write, then `finish-run.sh` watches the removed folder for a settle window and removes it again. The README and playbook sections are then written one sibling phase at a time, each from that phase's closed acceptance criteria. Verification raises the playbook version, runs the background-worker check live once and runs strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -c 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/0{09,10,11,12,13,14,15,16}-*/acceptance-criteria.md` prints 8 lines, or each phase without Yes records its decline in its own `goal.md`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` exits 0 and prints `ok`
- [ ] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` prints `VALID` and `Total issues: 0` for the README and the playbook
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs follow shipped phases.

### Key Components
- **`finish-run.sh`**: reduces transcripts and removes the sandbox session folder, and after this phase watches it for a settle window.
- **`test-finish-run.sh`**: a fake run folder, a writer that recreates the project folder late, and one assertion that the folder is gone.
- **README `HANDOFF PROTOCOL` and `STARTING THE LOOP` sections**: where each shipped change is described.
- **Playbook `Hand-Over State Checks` section**: one check per shipped behaviour and the background-worker hop.

### Data Flow
`run-hop.sh` writes the project folder path to `project-dir.txt` (`run-hop.sh:35`) and its exit trap kills the tmux server (`run-hop.sh:24-25`), so the receiver may still be shutting down when `finish-run.sh` starts. `finish-run.sh` removes the folder, then checks it once a second for the settle window and removes it again on each reappearance. For the docs, each sibling phase's `acceptance-criteria.md` and `implementation-summary.md` are the source, and the README and playbook quote what they record.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `finish-run.sh` | Removes the project folder in one step (`finish-run.sh:16`) | update | `bash $H/test-finish-run.sh` exits 0 |
| `run-hop.sh` | Writes `project-dir.txt` and kills its tmux server on exit | unchanged | `git diff --name-only -- $H` lists no `run-hop.sh` |
| `run-hop-variant.diff` | Records the background-worker variant | unchanged, applied to a copy | `patch -o` exits 0 |
| README line 83 | States the record as the name source | update | `rg -n 'name, provider and Pi extension settings come from the relaunch record' .skilled/hooks/session-relaunch/README.md` prints nothing unless phase 012 makes it true |
| `research/deep-research-state.jsonl:6` | Holds the wrong 09:30Z stamp | not a consumer, out of scope per D4 | `git diff --name-only -- research/` prints nothing |

Required inventories:
- Finding classes: the late write is `test-isolation` (the harness leaks state outside its sandbox). The README sentence is `matrix/evidence`.
- Same-class producers: `rg -n 'rm -rf' $H` lists every removal in the harness, and only `finish-run.sh` removes a runtime folder.
- Consumers of changed symbols: `rg -n 'finish-run.sh' .skilled/skills/system-spec-kit/manual-testing-playbook` lists the playbook lines that call it.
- Matrix axes: project-dir.txt (absent, empty, a path), late write (none, inside the window), settle window (default 15 s, 5 s in the test).
- Algorithm invariant: `finish-run.sh` returns 0 only when the folder named in `project-dir.txt` is absent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 009 to 016 have closed, applies the worker diff to a scratch copy and records the document baselines. Implementation fixes `finish-run.sh` test first, then writes the README and playbook sections phase by phase. Verification raises the playbook version, runs the live background-worker check once and runs strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The late-write case and the empty `project-dir.txt` case of `finish-run.sh` | `bash $H/test-finish-run.sh` |
| Integration | The playbook commands for each shipped behaviour | The named suites each sibling phase added |
| Manual | One live background-worker hop on Claude | `tmux`, `claude`, the patched copy of `run-hop.sh` |

The test runs against the unchanged `finish-run.sh` first and must exit 1 with `FAIL: project folder still present`. After the fix it must exit 0 and print `ok`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 009 to 016 closed | Internal | Red | No README or playbook section can be written for an open phase |
| `patch`, `tmux`, `claude` | External | Green | The live check cannot run |
| `frontmatter-version.mjs` | Internal | Green | The version cannot be raised |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a README sentence describes a change its phase did not ship, or `finish-run.sh` removes anything other than the two folders it removes today.
- **Procedure**: `git checkout -- <file>` for the one file, or revert the phase commit. No state is migrated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 009 to 016 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close of this phase and of the parent packet |
<!-- /ANCHOR:phase-deps -->

---
