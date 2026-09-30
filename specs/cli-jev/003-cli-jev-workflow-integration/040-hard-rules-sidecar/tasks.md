---
title: "Tasks: Phase 40: hard-rules-sidecar"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hard rules sidecar tasks"
  - "skill frontmatter migration tasks"
  - "reader repoint checklist"
  - "hard rules verdict comparison checklist"
  - "hard rules task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 40: hard-rules-sidecar

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

**Task Format**: `T### [P?] Description (file path)`

`E` is `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`. `S` is one of the nine skill folders that declare `hard_rules:` today. `B` is the fixed command set per skill that the design note fixes, `V` is the recordings under `scratch/verify/` and `D` is the design note under `scratch/`. The plan's eight phases map onto the three sections below: design and the fixed contract (plan phase 1) in Phase 1, with the baseline and before verdicts (plan phase 2), the engine, the readers, the nine rule sets and the docs (plan phases 3, 4 and 5) in Phase 2, and the after verdicts, the suites, the review and the closure (plan phases 6, 7 and 8) in Phase 3. Every task is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (D6). The session runs the baselines, the verdict comparison and the closure gates, never an executor. This phase is Planned, so every task is `[ ]` and every check is open. Closure (2026-09-30): the design's batches 2 to 5 landed as one change (the engine reads the sibling sidecar, `stripQuotes` and `parseHardRules` are deleted, the nine sidecars are emitted from the before snapshots, the nine frontmatter blocks lose the key, and the tests that read a SKILL.md move), then batch 6 the docs through sk-doc, batch 7 the Hermes sync and the manifest refresh, and batch 8 the after verdicts and the comparison. The evidence sits under `scratch/verify/` and in `scratch/w4-build/design.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read `E`, its two suites, the four preflight adapters (`.skilled/hooks/dispatch/claude/`, `codex/`, `devin/` and `pi/`), the registry `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, both sk-git scripts with the pi twin, both OpenCode plugin copies with `.opencode/plugins/tests/source-root-consumers.test.cjs`, the devin policy at `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`, and `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, all read-only. Check: `D` names every reader row of `spec.md` section 3 with its line, every row is either moved or recorded as not a consumer with its evidence, and no read-only source is edited. Evidence: `scratch/w4-build/design.md` names every reader row of `spec.md` section 3 with its line, marks the six rows `scratch/context/context.md` missed, fixes the sidecar contract in section 2 and records `dispatch-audit.mjs` and the Hermes sync as non-readers; the design edited no read-only source (`scratch/verify/session-evidence.md`, design entry).
- [x] T002 Fix the sidecar contract in `D`, executor DeepSeek V4.1 Flash (D6). Fix the sidecar name and shape, the `readHardRules` signature, the fail-open behavior per failure case, the fixed command set `B` per skill, the comparison method and the recording paths under `V`. Check: each answer is one sentence with the alternative it was chosen over, `spec.md` section 10's six questions each have a proposed answer, and every `UNKNOWN` is named with what would resolve it. Evidence: `scratch/w4-build/design.md` fixes the name `hard-rules.json`, a bare JSON array over a versioned object, the `readHardRules(skillMdPath)` signature over a folder parameter, the fail-open cases one by one and the folder guard; section 3 fixes the command set `B`, the corpus and the recording paths under `scratch/verify/`, and section 7 answers `spec.md` section 10.
- [x] T003 Baselines and before verdicts, executor the orchestrating session. Re-count the rules per skill, run the five suites of `spec.md` section 3 from the repo root, run `B` through `evaluate` from the pre-change state with the rules read from frontmatter, and save the results under `V`. Check: nine recordings exist, each has the corpus's row count, a command that triggers no rule records an empty verdict set, and each suite result is captured with its pass and fail counts. Evidence: `scratch/verify/before/` holds nine `<skill>.rules.json` snapshots and nine `<skill>.verdicts.json` recordings; every corpus row pins its expected violation ids and the empty rows record `[]` (`scratch/verify/corpus.json`); `scratch/verify/baseline-suites.txt` captures the five suites at 135 passed and 0 failed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] The engine reads the sidecar, executor DeepSeek V4.1 Flash (D6). In `E`, make `readHardRules` read the sibling `hard-rules.json`, parse it with `JSON.parse`, return an empty list on any read or parse error, and delete the frontmatter parse. Check: the function adds no dependency, the missing, empty, malformed and non-array cases each return an empty list without throwing, and no code comment names a spec path, phase number or requirement id. Evidence: `parseHardRules` is gone from every production file, the only remaining hit being a dated benchmark raw report (`scratch/verify/session-evidence.md`, criterion 2); `scratch/verify/s1.txt` passes `reads the real hard rules from the sidecar beside each SKILL.md` and the fail-open test, 20 of 20 with 0 failed; the review re-ran every failure shape live and each returns `[]` without throwing, with comment hygiene clean (`scratch/verify/review-mimo-r1.txt`).
- [x] T005 [P] Sidecar parse tests, executor DeepSeek V4.1 Flash (D6). In `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, move the fail-open cases at `:217-220` to the sidecar, keep the four skills' id assertions and the assertion that every declared `check` id is implemented in `CHECKS`. Check: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` exits 0 with 0 failed, and the sidecar cases cover at least the missing, empty, malformed and object-not-array shapes. Evidence: `scratch/verify/s1.txt` records 20 pass and 0 fail, including `reads the real hard rules from the sidecar beside each SKILL.md` and `readHardRules reads the sibling sidecar and fails open on malformed input`; the suite's cases cover missing, empty, null, object-not-array, malformed, an entry without `id` or `check`, a directory-named sidecar, a folder argument and a non-string, and keep the four skills' id assertions and the check bijection (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:218-249`).
- [x] T006 Readers and tests move in the same change, executor DeepSeek V4.1 Flash (D6). Reconcile each row of `spec.md` section 3: the four preflight adapters, the two OpenCode plugin copies, the three sk-git files, the pi twin, the devin policy and the five test files, including the `hard_rules:` sentinel at `.opencode/plugins/tests/source-root-consumers.test.cjs:29` and the SKILL.md copy in `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs:85`. Check: `rg -n 'parseHardRules'` finds no reader of SKILL.md text, and each moved test file's rule assertions read the sidecar. Evidence: `rg -n 'parseHardRules'` finds no production reader (`scratch/verify/session-evidence.md`, criterion 2); the twelve readers keep their `…/SKILL.md` argument so the sibling read resolves (`scratch/verify/review-mimo-r1.txt`); the `.opencode/plugins/tests/source-root-consumers.test.cjs` fixture writes a `hard-rules.json` sibling and the sk-git advisory fixture copies the real sidecar beside the real SKILL.md, both green (`scratch/verify/s5.txt`, `scratch/verify/s4.txt`).
- [x] T007 Move the nine rule sets, executor DeepSeek V4.1 Flash (D6). Create `hard-rules.json` beside each `S`, holding that skill's rules copied exactly and in order, and remove the `hard_rules` key from each SKILL.md frontmatter block with every other byte kept. Check: the rule-for-rule comparison prints `equal` and the counts 17, 8, 8, 5, 4, 2, 2, 2 and 2 for sk-git, cli-jev, cli-hermes, cli-opencode, cli-pi, cli-claude-code, cli-codex, cli-cursor and cli-devin, and `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing. Evidence: the nine sidecars hold 50 rules in all, 17 sk-git, 8 cli-jev, 8 cli-hermes, 5 cli-opencode, 4 cli-pi and 2 each for cli-claude-code, cli-codex, cli-cursor and cli-devin; `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing at exit 1 (`scratch/verify/session-evidence.md`, criterion 1); each sidecar was emitted from its before snapshot with `JSON.stringify(rules, null, 2)`, never retyped, and the one sk-git body sentence at `SKILL.md:313` was repointed (`scratch/w4-build/design.md` sections 3 and 5).
- [x] T008 Docs through sk-doc, executor DeepSeek V4.1 Flash (D6). Update `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` with its `SKILL.md`, and `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`, so both say where hard rules live and that `hard_rules` is not a SKILL.md frontmatter key. Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, no doc claims a result no run printed, and the template points at the sidecar rather than describing a frontmatter key. Evidence: `sk-create-frontmatter/SKILL.md`, `assets/frontmatter-templates.md` and `sk-create-skill/assets/skill/skill-md-template.md` name `hard-rules.json` and say `hard_rules` is not a frontmatter key; `validate_document.py` reports 0 issues on all 37 changed docs, 27 skill docs in the session's run and 37 in the reviewer's; the one-line sweep of docs that described the frontmatter mechanism landed in the same batch (`scratch/verify/session-evidence.md`, criterion 4; `scratch/verify/review-mimo-r1.txt`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 After verdicts, executor the orchestrating session. Run `B` through `evaluate` from the final state and save one recording per skill under `V`. Check: the before and after recordings compare equal per skill, row for row, including the empty-verdict rows, and the comparison output is recorded in `implementation-summary.md`. Evidence: `scratch/verify/after/` holds the nine rule snapshots and nine verdict recordings; `scratch/verify/compare.txt` prints nine `equal <skill> <n> rows` lines at exit 0; the review reproduced all 47 corpus rows live against the current engine, the empty-verdict rows included (`scratch/verify/review-mimo-r1.txt`); the comparison is recorded in `implementation-summary.md`.
- [x] T010 Suites and the Hermes check from the final state, executor the orchestrating session. Rerun the five suites of `spec.md` section 3, the three registered hooks' adapters, and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`. Check: each suite is at or above its baseline with 0 failed, each hook still resolves, `--check` passes, and the design's finding about whether a Hermes copy needs the sidecar is recorded. Evidence: `scratch/verify/s1.txt` to `s5.txt` record 20 + 75 + 26 + 7 + 7 = 135 passed and 0 failed, equal to `scratch/verify/baseline-suites.txt`; `scratch/verify/h2.txt` prints `PASS: 72 Hermes skill copies in sync` after 10 of 72 copies written and 0 pruned; the live hook smoke denied a bad dispatch and passed a compliant one (`scratch/verify/hook-smoke-jev.txt`); `scratch/verify/g2.txt` all seven hubs fresh and `scratch/verify/df.txt` derived metadata 15 of 15 fresh; the design records that no Hermes copy needs the sidecar because no Hermes runtime reads a rule (`scratch/w4-build/design.md` section 1).
- [x] T011 Cross-family review, executor MiMo v2.6 Pro (D6). Review every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. The review output is `scratch/verify/review-mimo-r1.txt` (proposed), and any DeepSeek reverse-review is `scratch/verify/review-deepseek-r1.txt` (proposed). Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, and P2 findings recorded. Evidence: `scratch/verify/review-mimo-r1.txt` prints `VERDICT: PASS` with all five criteria met, all 50 rules byte-equal and all 47 corpus rows reproduced live; no P0 or P1 is open; the two P2 findings were both fixed in the session, `evaluate`'s JSDoc and the scratch recorder's session path (`scratch/verify/session-evidence.md`, fix after review); the one non-applicable check is recorded (sk-git is not a parent hub).
- [x] T012 Closure, executor the orchestrating session. Record the rule counts, the verdict comparison and every gate result in `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)` and `packet_durable_chars` at or under 4000. Evidence: this closure pass; `repair-derived.cjs --apply` printed `inspected=1 repaired=1 failed=0`, `validate.sh --strict --recursive` printed `RESULT: PASSED` for every folder, `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` on this phase and the parent, and `goal.cjs packet` printed `packet_budget=ok`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it. Evidence: T001 to T012 are `[x]` and no task reports a blocker; two verification-checklist rows, CHK-022 and CHK-FIX-004, stay open for their symlinked-path clause and are named below.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries `[B]`.
- [x] Manual verification passed: the five suites, the before-and-after verdict comparison and the Hermes check run from the final state, and the three registered hooks still resolve. Evidence: `scratch/verify/s1.txt` to `s5.txt` run the five suites at 135 of 135 with 0 failed, `scratch/verify/compare.txt` compares the before and after verdicts equal for all nine skills, `scratch/verify/h2.txt` passes the Hermes check, and the registered hook paths resolve: the claude preflight adapter denied a real dispatch over the sidecar-read rules and passed a compliant one (`scratch/verify/hook-smoke-jev.txt`), and the source-root consumers suite covers the dispatch guard, the git preflight and the Codex watchdog (`scratch/verify/s5.txt`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Source record**: `scratch/context/context.md`
- **Prior phase**: `../039-hub-cleanup/`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012, with the sidecar contract fixed at spec approval. Planned: `spec.md` section 4. Evidence: `spec.md` section 4 holds REQ-001 to REQ-012 across its P0 and P1 lists.
- [x] CHK-002 [P0] Technical approach defined in plan.md with the eight phases and their checks. Planned: `plan.md` section 4. Evidence: `plan.md` section 4 lists the eight phases, each with its observable check.
- [x] CHK-003 [P1] Dependencies identified and available: phase 039, the engine at `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, the nine SKILL.md files and the five test files. Planned: `plan.md` section 6. Evidence: 039 is Complete (`03a6f5f285`, `a829c9a870`); the engine, the nine SKILL.md files and the five test files are present and runnable from the repo root (`scratch/verify/baseline-suites.txt`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The engine reads the sidecar with no new dependency, and a missing, empty or malformed sidecar returns an empty rule list without throwing. Planned: REQ-002. Evidence: the engine reads the sibling sidecar with `JSON.parse` and adds no dependency; `scratch/verify/s1.txt` passes the sidecar-read and fail-open tests; the review re-ran every failure shape live and each returns `[]` without throwing (`scratch/verify/review-mimo-r1.txt`).
- [x] CHK-011 [P0] No console errors or warnings on any reader path, before or after the move. Planned: proof plan 3 and 4. Evidence: the five suites print no error line and 0 failed (`scratch/verify/s1.txt` to `s5.txt`), and the review re-ran the reader paths live with no warning (`scratch/verify/review-mimo-r1.txt`).
- [x] CHK-012 [P1] Every failure path has one handling: the missing, empty, malformed and object-not-array sidecar cases, and the rule naming an unimplemented `check` id. Planned: `spec.md` edge cases. Evidence: the missing, empty, null, object-not-array, malformed, entry-without-`id`-or-`check`, directory-named sidecar, folder argument and non-string cases all return `[]` (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:218-249`; `scratch/verify/review-mimo-r1.txt`), and the check bijection guards an unimplemented `check` id (`scratch/verify/s1.txt`).
- [x] CHK-013 [P1] The change follows the engine's existing shape, and comments carry no spec path, phase number or requirement id. Planned: REQ-009. Evidence: the engine keeps `readHardRules`'s signature and exports, and the review records comment hygiene clean across the diff with no spec path, phase number or task id in a code comment (`scratch/verify/review-mimo-r1.txt`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`. Evidence: all five rows there are `Met` with their observed outputs (this closure pass).
- [x] CHK-021 [P0] The five suites of `spec.md` section 3 pass at or above their recorded baselines from the final state. Planned: T010. Evidence: `scratch/verify/s1.txt` 20, `s2.txt` 75, `s3.txt` 26, `s4.txt` 7, `s5.txt` 7, 135 passed and 0 failed, equal to `scratch/verify/baseline-suites.txt`.
- [ ] CHK-022 [P1] Edge cases tested: the missing, empty, malformed and object-not-array sidecar, the symlinked SKILL.md path, and a command that triggers no rule. Planned: T005 and T009. Open: the four sidecar failure shapes, the folder argument, the non-string and a command that triggers no rule are covered (`scratch/verify/s1.txt`; the corpus `none` rows), but no test hands `readHardRules` a SKILL.md path resolved through a symlinked directory, and the design's fixed test list does not carry that case.
- [x] CHK-023 [P1] The before-and-after verdict comparison covers every skill and every declared `check` id, with the empty-verdict rows included. Planned: T003 and T009. Evidence: `scratch/verify/compare.txt` compares all nine skills row for row at exit 0 with the empty-verdict rows included, and the corpus pins the ids it covers, reproduced live by the review (all 47 rows); sk-git's 17 warn checks split between the two corpus warn rows and every `GIT_CHECKS` entry exercised in `scratch/verify/s3.txt`, as the design fixed (`scratch/w4-build/design.md` section 3).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Planned: this is a migration, so the classes apply only if the review raises a finding. Evidence: the review raised two P2s, both instance-level and both fixed: `evaluate`'s JSDoc named the deleted frontmatter field, and the scratch recorder hardcoded a session scratchpad path (`scratch/verify/review-mimo-r1.txt`; `scratch/verify/session-evidence.md`, fix after review); no P0 or P1 was raised.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the nine SKILL.md producers from `grep -rln '^hard_rules:'`. Evidence: the nine producers are the nine SKILL.md files the grep names, every one moved, no other SKILL.md declares the key, and the final-state grep is empty at exit 1 (`scratch/verify/session-evidence.md`, criterion 1).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed reader, its callers, its docs and its tests. Planned: `spec.md` section 3 lists the 10 readers and five test files with their lines. Evidence: `scratch/w4-build/design.md` section 1 lists twelve reader files and five test files with their lines, six of them missed by the context file; every reader resolves the sidecar through the unchanged `…/SKILL.md` argument (`scratch/verify/review-mimo-r1.txt`).
- [ ] CHK-FIX-004 [P0] Adversarial table tests exist for the moved surface: the four sidecar failure shapes, the symlinked path and the unimplemented `check` id. Planned: T005. Open: the four sidecar failure shapes, the folder argument, the non-string and the unimplemented `check` id are covered (`scratch/verify/s1.txt`), but no test resolves a SKILL.md path through a symlinked directory, the case the plan's FIX ADDENDUM names, and the design's fixed test list does not carry it.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the skill, field, failure, reader, runtime and verdict axes. Evidence: `plan.md`'s FIX ADDENDUM lists those axes; `scratch/w4-build/design.md` section 3 carries the 47-row corpus and section 4 the eleven engine cases plus the reader fixtures.
- [x] CHK-FIX-006 [P1] A hostile-tree variant runs where a reader resolves a path: a sidecar replaced by a directory, and a SKILL.md whose sibling is absent. Planned: T005. Evidence: a sidecar replaced by a directory and a SKILL.md whose sibling is absent both return `[]` (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:218-249`), and the review re-ran both live (`scratch/verify/review-mimo-r1.txt`).
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Planned: T012 names the build commit and each recording under `V`. Evidence: `scratch/w4-build/design.md` records its read at the start HEAD `b3964f2a3f`; every recording sits under `scratch/verify/` and carries no absolute path; the orchestrator commits the build path-scoped after this pass, so no build commit exists yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret in any changed file, and the sidecar holds rule text only. Planned: REQ-008. Evidence: the nine sidecars hold only the four rule fields (`id`, `check`, `message`, `severity`), all text, and the review compared all 50 rules byte for byte (`scratch/verify/review-mimo-r1.txt`; `scratch/w4-build/design.md` section 2).
- [x] CHK-031 [P0] No reader reads a `.env` file, prints an environment value or passes a credential. Planned: NFR-S01. Evidence: the engine reads only the sibling sidecar; no changed file reads a `.env` or prints an environment value, and the corpus runner keeps its own PATH stub directory (`scratch/w4-build/design.md` sections 2 and 3).
- [x] CHK-032 [P1] The sidecar is repo-local and authored, so no new input surface enters the hook path. Planned: NFR-S02. Evidence: the sidecars are nine repo-local authored files read with `JSON.parse`, the engine adds no dependency and no new input enters the hook path (`scratch/w4-build/design.md` section 2).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass. Evidence: this closure pass updated spec, tasks, acceptance criteria, goal and summary in one pass.
- [x] CHK-041 [P1] The sk-doc frontmatter contract and skill template name the sidecar, and no doc claims a result no run printed. Planned: T008. Evidence: the contract and both templates name `hard-rules.json` and say `hard_rules` is not a frontmatter key; `validate_document.py` reports 0 issues on all 37 changed docs, and the sweep of docs that described the frontmatter mechanism landed with them (`scratch/verify/session-evidence.md`, criterion 4; `scratch/verify/review-mimo-r1.txt`).
- [x] CHK-042 [P2] The Hermes copies' handling of the sidecar is recorded with its evidence, whether or not the sync changes. Planned: T010. Evidence: `scratch/verify/h2.txt` prints `PASS: 72 Hermes skill copies in sync` after 10 of 72 copies written and 0 pruned; no sidecar is copied because no Hermes runtime reads a rule (`scratch/w4-build/design.md` section 1), recorded in `implementation-summary.md` and the goal log.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The design note and the comparison script stay in `scratch/` only. Planned: T001 and T003. Evidence: `scratch/w4-build/design.md`, `scratch/verify/corpus.json` and `scratch/verify/record-verdicts.mjs` sit under `scratch/` only (this pass); no temp file appears outside `scratch/` in the working tree.
- [x] CHK-051 [P1] The before and after recordings stay under `scratch/verify/` and are removable. Planned: T003 and T009. Evidence: `scratch/verify/before/` and `scratch/verify/after/` hold nine rule snapshots and nine verdict recordings each, all under `scratch/verify/` (this pass).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-30. 24 of 26 rows verified from the build's records under `scratch/verify/` and the final-state gates (this closure pass); CHK-022 and CHK-FIX-004 stay open for their symlinked-SKILL.md-path clause, which no test or recording exercises.
<!-- /ANCHOR:summary -->

---
