---
title: "Tasks: Phase 9: ai-council-writer-and-round-model"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ai council writer and round model tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: ai-council-writer-and-round-model

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

**Variables**: `A` is `.skilled/agents/ai-council.md`. `C` is `.claude/agents/ai-council.md`. `R` is `.skilled/agents/agent-registry.json`. `D` is `.skilled/skills/system-deep-loop/deep-ai-council`. `scratch/` is this folder's `scratch/`. Line numbers are those at `c1dbb1bcc4`. Phase 6 moves them, so T003 re-reads them before any edit. A `[B]` task waits on an install the operator approves. The writer answer is A, the agent, recorded 2026-11-14.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the operator's answer to the writer question, A, B or C, under section 10 (`spec.md`). Verify: `rg -n 'Operator answer' spec.md` prints one line naming A, B or C. Done 2026-11-14: A.
- [x] T002 Confirm phases 6 and 8 have landed on the base (`A`, `.skilled/agents/orchestrate.md`). Verify: `git log --oneline c1dbb1bcc4..HEAD -- .skilled/agents/ai-council.md .skilled/agents/orchestrate.md` lists the phase 6 and phase 8 commits.
- [x] T003 Re-run the Measured Behavior commands before any edit (`scratch/measure.sh`). Verify: `bash scratch/measure.sh > scratch/measured-behavior-build.txt`, then `diff <(sort scratch/measured-behavior.txt) <(sort scratch/measured-behavior-build.txt)` shows only lines that phases 6 and 8 changed. Every changed line number is carried into the tasks below before they run.
- [x] T004 Install the `system-spec-kit/runtime` dependencies once the operator says yes, then capture the council-suite baseline (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: `npm run test:council` prints a pass and fail count, saved to `scratch/baseline-tests.txt`. Done 2026-11-15 with no install: vitest resolves from `.skilled/node_modules`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 REQ-003: rewrite the nine lines that say the gateway refreshes `ai-council-state.jsonl`, citing `append-mode-event.ts:255-275` (`A`). Verify: `rg -c --include-zero 'refresh' A` prints 0.
- [x] T006 REQ-006: state that `max_rounds` defaults to 3 beside the config shape (`A`). Verify: `rg -n 'max_rounds. defaults to 3' A` prints one line.
- [x] T007 REQ-007: make Depth 1 the default, add the operator-invocation opt-in at lines 62-63 and turn the section 5 decision tree to the same question (`A`). Verify: `rg -c --include-zero 'Otherwise, operate at Depth 0' A` prints 0, and `rg -c --include-zero 'Otherwise, operate at Depth 1' A` prints 1.
- [x] T008 [P] REQ-007: change the same default at lines 96 and 142 (`D/references/convergence/depth-dispatch.md`). Verify: `rg -c --include-zero 'fallback when no nesting|operate as Depth 0' D/references/convergence/depth-dispatch.md` prints 0.
- [x] T009 REQ-008: call the CLI rows at lines 110-111 lenses, drop the Temp column at line 148, delete the Temperature block at lines 243-245 and list each vantage once at line 394 (`A`). Verify: `rg -c --include-zero 'External AI vantage|temperature <TEMP>|^\| Strategy \| Temp' A` prints 0, and `rg -c --include-zero 'AI Vantage Target' A` prints 1 or more.
- [x] T010 [P] REQ-008: drop the Temp column at line 51 (`D/references/patterns/seat-diversity-patterns.md`). Verify: `rg -c --include-zero '^\| Strategy \| Temp' D/references/patterns/seat-diversity-patterns.md` prints 0.
- [x] T011 REQ-009: replace the thresholds at lines 336-338, 343, 347-349, 356 and 376-386 with the one table `plan.md` gives (`A`). Verify: `rg -c --include-zero 'within 15 points|>15 point lead|<10 point spread|within 10 points|25\+ points' A` prints 0, and `rg -c --include-zero 'Lead of 15 to 24' A` prints 1.
- [x] T012 [P] REQ-009: put the same table in place of lines 149, 170, 174 and 265-266 (`D/references/scoring/scoring-rubric.md`). Verify: the two searches of T011 on this file print 0 and 1.
- [x] T013 REQ-001: name the one writer at lines 403 and 739, and under answer B or C set `write` and `edit` to deny and edit description lines 3, 24 and 30 (`A`). Verify: `rg -n 'sole writer|Single writer authority|persist-artifacts' A` names only the chosen writer, as `spec.md` section 10 lists.
- [x] T014 REQ-001: rewrite the `ai-council` notes for the chosen writer, run `node .skilled/bin/sync-agent-roster.cjs`, then copy the new agent-files row into the `.claude` fork by hand (`R`, `.claude/agents/orchestrate.md`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `rg -c --include-zero 'ai-council' .claude/agents/orchestrate.md` matches the count in `.skilled/agents/orchestrate.md`.
- [x] T015 REQ-002: rewrite Q11 at line 567 and its fix line at line 570 to the chosen answer's wording, and drop "exit 0 receipt" from line 668 (`A`). Verify: `rg -c --include-zero 'exit 0 receipt' A` prints 0.
- [x] T016 REQ-004: replace step 8 at line 678 with one round per invocation, and move the caller's loop and resume rule to the state reference with the chosen resume source (`A`, `D/references/structure/state-format.md`). Verify: `rg -c --include-zero 'repeat from step 3' A` prints 0, and `rg -n 'one round per invocation' A` prints 1 line or more.
- [x] T017 REQ-004: restate what the resume scenario checks and repoint its lines 30, 42 and 68 (`D/manual-testing-playbook/depth-and-failure-handling/resume-after-interrupted-state.md`). Verify: `rg -c --include-zero '§13' D/manual-testing-playbook/depth-and-failure-handling/resume-after-interrupted-state.md` prints 0, and its pass line names the resume source from T016.
- [x] T018 REQ-010: diff sections 12 to 17 against their target references, carry over only what is missing and replace them in the agent with a pointer paragraph (`A`, `D/references/structure/folder-layout.md`, `state-format.md`, `D/references/convergence/convergence-signals.md`, `failure-handling.md`, `D/references/patterns/command-wiring.md`). Verify: `rg -c --include-zero '^## 1[4-9]\. ' A` prints 0, and `rg -n '^## 1[23]\. ' A` prints HOOK-INJECTED CONTEXT ROUTING and RELATED RESOURCES.
- [x] T019 REQ-010: in the same commit as T018, repoint the seventeen live citation lines `spec.md` lists, which are thirteen in `D` and the agent's own §12 and §15 references at lines 403 and 678 with their `.claude` twins at 388 and 663. Fix ROLLBACK as §18 at `folder-layout.md:81` and read the ADR behind `folder-layout.md:87` (`D/references/`, `D/manual-testing-playbook/`, `A`, `C`). Verify: `rg -n '§1[2-9]' A C D -g '!**/changelog/**'` prints no citation of a moved or renumbered agent section.
- [x] T020 REQ-010: in the same commit, rewrite the `templateExceptions` reason with the real citation count and the sections still cited (`R`). Verify: `rg -c --include-zero 'Twelve files' R` prints 0, and `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`.
- [x] T021 REQ-010: in the same commit, update the strings at lines 96-97, and lines 71-72 and 93-95 under answer B or C (`.skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts`). Verify: `rg -c --include-zero 'COUNCIL PERSISTENCE PROTOCOL' .skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts` prints 0 when section 16 has left the agent, and every remaining `toContain` string is found by `rg -c` in `.codex/agents/ai-council.toml` after T024.
- [x] T022 REQ-010: make the cuts in the `plan.md` line budget in order, measuring after each, until the file is at 600 lines or fewer (`A`). Verify: `wc -l < A` prints 600 or less, and each cut's real count is written in `implementation-summary.md`.
- [x] T023 Hand-edit the `.claude` fork to match every edit above, matched by content because its frontmatter is 15 lines shorter (`C`). Verify: `diff <(sed -n '/^# The AI Council/,$p' A) <(sed -n '/^# The AI Council/,$p' C)` shows only the three lines it shows today: the Path Convention line and two RELATED RESOURCES links that name `.claude/agents/`.
- [x] T024 Regenerate the pi, codex and dsh copies of `ai-council` and `orchestrate` (`.pi/agents/`, `.codex/agents/`, `.dsh/agents/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` each exit 0.
- [x] T025 Rewrite the compiled contract, which hashes the agent and the references (`.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council --write` prints the contract path and exits 0.
- [x] T026 Read the hub version rule at `.skilled/skills/system-deep-loop/SKILL.md:18` and, if the reference edits require it, raise the mode version and add its changelog entry (`D/SKILL.md`, `D/changelog/`). Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py <new entry>` prints `fail=0`, or the rule's text is quoted in `implementation-summary.md` as the reason no entry was added.
- [x] T027 Regenerate the trigger-index outputs from the final tree (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0 and prints no `manifest hash differs` note.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T028 Run the roster and mirror checks (`.skilled/bin/`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 with `all comparable mirrors in sync`.
- [x] T029 Check the compiled contract against a fresh build (`.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council | diff -q - .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown` exits 0.
- [x] T030 Run the council suites and compare with the T004 baseline (`scratch/after-tests.txt`). Verify: `npm run test:council` in `.skilled/skills/system-spec-kit/runtime` prints 0 failures.
- [x] T031 Run every acceptance command in `spec.md` section 4 and save the output (`scratch/after.txt`). Verify: each command prints the value its row states.
- [x] T032 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/009-ai-council-writer-and-round-model --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every owned finding id has a row in `implementation-summary.md` with the command that shows it fixed
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

A `[B]` task stays blocked until the operator approves the install.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` section 4, one per planned fix. Evidence: REQ-001 to REQ-010.
- [x] CHK-002 [P0] Technical approach per requirement in `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies available: the writer answer, phases 6 and 8 landed and the vitest install approved.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node -e "JSON.parse(require('fs').readFileSync('.skilled/agents/agent-registry.json','utf8'))"` exits 0 after the notes edit.
- [x] CHK-011 [P0] No edited file gains an em dash: `rg -c --include-zero '\x{2014}'` on each edited file prints the same count as before.
- [x] CHK-012 [P1] `wc -l < .skilled/agents/ai-council.md` prints 600 or less.
- [x] CHK-013 [P1] No moved or new text carries a packet, phase or finding id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met` with observed evidence.
- [x] CHK-021 [P0] `npm run test:council` prints 0 failures.
- [x] CHK-022 [P1] The two playbook scenarios are read end to end and their pass lines match the new agent text.
- [x] CHK-023 [P1] `rg -n '§1[2-9]' .skilled/agents/ai-council.md .claude/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council -g '!**/changelog/**'` prints no citation of a moved or renumbered agent section.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: ai-council-1, ai-council-2 and ai-council-7 are `cross-consumer`. ai-council-4, ai-council-5 and ai-council-6 are `class-of-bug`, with a copy in `depth-dispatch.md`, `seat-diversity-patterns.md` and `scoring-rubric.md`. ai-council-3 is `cross-consumer` through `state-format.md` and the resume scenario.
- [x] CHK-FIX-002 [P0] Same-class producer inventory re-run with the four searches in `plan.md`, and every hit is updated or named as historical.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the citation search, the two test files, the generated rosters and the compiled contract.
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction code changes.
- [x] CHK-FIX-005 [P1] Matrix axes listed: writer answer A, B or C against REQ-001 to REQ-010, thirty rows in `spec.md` section 10.
- [x] CHK-FIX-006 [P1] N/A. No test or code reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit SHA in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token or credential enters the agent, the registry or the references.
- [x] CHK-031 [P0] The write boundary does not widen: `rg -n '^  (write|edit|bash|patch):' .skilled/agents/ai-council.md` shows `bash` and `patch` still deny.
- [x] CHK-032 [P1] N/A. No auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and this file name the same writer answer and the same ten requirements.
- [x] CHK-041 [P1] The pointer paragraph in the agent names each reference that received a section.
- [x] CHK-042 [P2] N/A unless the `deep-ai-council` README cites a moved section. Check with `rg -n '§1[2-7]' .skilled/skills/system-deep-loop/deep-ai-council/README.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary output lives in this folder's `scratch/` only.
- [x] CHK-051 [P1] `scratch/` keeps `measure.sh` and the evidence files the summary cites, and nothing else.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
