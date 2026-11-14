---
title: "Tasks: Phase 6: codex-persona-tool-mapping"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "codex persona tool mapping tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: codex-persona-tool-mapping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `A` is `.skilled/agents`. `K` is `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`. `Q` is `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the Measured Behavior commands and their output, and the Codex version and login status (`scratch/baseline.txt`). Verify: `rg -c 'Logged in' scratch/baseline.txt` prints 1.
- [x] T002 Read how each of the six other modes attaches a persona and record whether the child has the persona's tools (`scratch/other-modes.md`). Verify: `rg -c '^\| cli-' scratch/other-modes.md` prints 6.
- [x] T003 Locate the canonical persona-injection section, or record that it is missing (`scratch/baseline.txt`). Verify: `rg -c 'canonical contract:' scratch/baseline.txt` prints 1.
- [x] T004 Read the hub's version rule and record which files a packet change must touch (`scratch/baseline.txt`). Verify: `rg -c 'version files:' scratch/baseline.txt` prints 1.
- [x] T005 Save the probe prompt with the preamble, the mapping line, the `context` persona and the read task (`scratch/codex-probe-prompt.txt`). Verify: `rg -c 'TOOL MAPPING' scratch/codex-probe-prompt.txt` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the tool-mapping requirement and its literal text to rule 17 (`.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`). Verify: `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more.
- [x] T007 Add the failure signature to the dispatch gotchas (`.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`). Verify: `rg -c 'FILES READ: none' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more.
- [x] T008 State the rule in the canonical contract for every CLI whose tools differ from the persona's (`.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`). Verify: `rg -c -i 'tool mapping' .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` prints 1 or more.
- [x] T009 Bump the packet version and add the changelog entry the version rule requires (`.skilled/skills/cli-external-orchestration/cli-codex/changelog/`). Verify: the newest file name under `cli-codex/changelog/` matches `rg -n '^version:'` in the packet's `SKILL.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the probe prompt with `codex exec --sandbox read-only` and save the report (`scratch/codex-probe-report.txt`). Verify: `rg -c 'FILES READ: .skilled/agents/README.txt' scratch/codex-probe-report.txt` prints 1. Observed: run before the rule text was written, so the prompt carries the same mapping line the rule now holds.
- [x] T011 Run the same prompt with the mapping line removed and save the report (`scratch/codex-probe-control.txt`). Verify: `tail -1 scratch/codex-probe-control.txt` starts `FILES READ:`. Observed: the control also read the file. The failure did not reproduce on codex-cli 0.169.0.
- [x] T012 Run the hub's vocabulary and version checks named in the hub `SKILL.md` (`scratch/after.txt`). Verify: each check exits 0 and its output is saved.
- [x] T013 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/codex-probe-report.txt` contains `FILES READ: .skilled/agents/README.txt` and rule 17 carries the mapping text
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A `[B]` task blocks close until its blocker is named in this file and the operator has answered it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are in `spec.md` section 4 and each has a row in `acceptance-criteria.md` Evidence: seven REQ rows in `spec.md` section 4 and seven AC rows.
- [x] CHK-002 [P0] The baseline in `spec.md` Measured Behavior was rerun and saved to `scratch/baseline.txt` Evidence: `scratch/baseline.txt` holds both commands with the outputs `0` and `228:`, taken before the change.
- [x] CHK-003 [P1] `command -v codex` prints a path and `codex login status` reports a ChatGPT login Evidence: `codex --version` printed `codex-cli 0.169.0` and `codex login status` printed `Logged in using ChatGPT`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The literal mapping text names read commands only: `cat`, `sed -n`, `rg`, `ls`, `wc`, `find` Evidence: the text in rule 17 names `cat`, `sed -n`, `rg`, `find`, `ls` and `wc`, and ends `Run no other command.`
- [x] CHK-011 [P0] Both probe dispatches carry `--sandbox read-only`, `</dev/null` and the child-dispatch preamble Evidence: both runs used `--sandbox read-only` and `</dev/null`, and both prompts open with the child-dispatch preamble. Each run log prints `sandbox: read-only`.
- [x] CHK-012 [P1] The rule is stated once in the canonical contract and cited, not copied, from `cli-codex/SKILL.md` Evidence: the card's section 6.3 states the rule for every CLI and points at Rule 17 for the Codex text. Rule 17 holds the literal Codex text and cites the card as the canonical contract on its next line.
- [x] CHK-013 [P1] No changed line names a spec path, a packet number or a task id Evidence: `git show 7018e7f5dc -- .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md | rg '^\+.*(specs/|REQ-|CHK-|T0)'` printed no line. The changelog entry names the spec folder, as every entry in that folder does.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] REQ-001 to REQ-003 hold as `acceptance-criteria.md` states Evidence: AC-001 to AC-003 are `Met`, each with its observed output.
- [x] CHK-021 [P0] Both probe results are read from their report files, not from exit status Evidence: both results were read with `tail -1` on the report files. Both runs exited 0, which decided nothing.
- [x] CHK-022 [P1] REQ-004 to REQ-007 hold as `acceptance-criteria.md` states Evidence: AC-004 to AC-007 are `Met`, each with its observed output.
- [x] CHK-023 [P1] `git status --short` shows no file changed by either probe dispatch Evidence: `git status --short` after both runs listed only the files this phase had written under `scratch/`, the two `-o` report files among them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding has a class recorded in `scratch/baseline.txt`: `cross-consumer`, because every CLI mode that inlines a persona shares the rule Evidence: `rg -c 'finding class: cross-consumer' scratch/baseline.txt` printed 1.
- [x] CHK-FIX-002 [P0] The same-class search across the six other modes ran and is recorded in `scratch/other-modes.md` Evidence: `rg -c '^\| cli-' scratch/other-modes.md` printed 6.
- [x] CHK-FIX-003 [P1] The probe evidence names the codex-cli version and the commit it ran at Evidence: `scratch/after.txt` names codex-cli 0.169.0 and the commit `1756387767` the runs were made on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Neither probe prompt contains a credential, an email address or a private path outside the repository Evidence: a search of both prompts for an email address, `api_key` or `token=` printed no line. The one absolute path is the worktree root, in the preamble's REPOSITORY ROOT line.
- [x] CHK-031 [P1] The mapping text grants no write, and the sandbox flag is unchanged in every example Evidence: the text names read commands only, and no example in `cli-codex/SKILL.md` changed its sandbox flag: the diff touches the frontmatter version, the gotcha list and rule 17.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same two skill files Evidence: the three documents name `cli-codex/SKILL.md` and `sk-prompt/assets/cli-prompt-quality-card.md`.
- [x] CHK-041 [P1] Each mode that `scratch/other-modes.md` marks `needs the line` is listed in `spec.md` section 10 as a follow-up Evidence: `cli-deepseek-harness` is the one mode marked `needs the line`, and `spec.md` section 10 lists it as a follow-up.
- [ ] CHK-042 [P2] `cli-codex/README.md` mentions the tool-mapping line where it describes persona injection Deferred: `cli-codex/README.md` does not describe persona injection (`rg -c -i persona` on it prints no line), so there is no passage to add the mention to.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines, parity tables and removal maps live under `scratch/` only Evidence: `ls scratch` lists the baseline, the table, the prompts, the reports, `after.txt` and the briefs.
- [x] CHK-051 [P1] `git status --short` lists no file outside the paths in `spec.md` Files to Change and this packet Evidence: `git show --stat 7018e7f5dc` lists the two skill files, the changelog entry, this packet, and the two compiled-routing manifests the commit gate re-mints when a skill file in the hub changes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 0/1, deferred with its reason |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



