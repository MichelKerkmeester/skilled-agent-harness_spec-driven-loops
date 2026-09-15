---
title: "Tasks: Phase 1: gate-3-option-merge"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: gate-3-option-merge

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-run the inventory grep, `rg -ln "Update related|Extend phased packet|E\) Skip" --glob '!specs/**' --glob '!node_modules/**' --glob '!.worktrees/**' --glob '!**/dist/**' --glob '!**/z_archive/**' .`, to catch drift since planning. Evidence: the widened re-run (also matching `A/B/C/D/E`, `A-E`, `Use a phase folder`) returned 43 files, not the planned 31 — drift included `.opencode/commands/deep/{review,ai-council,research}.md`, `.opencode/hooks/injection-contract.md`, `child-dispatch-preamble.md`, `prompt-pack-iteration.md.tmpl`, `system-spec-kit/SKILL.md`, `decision-format.md`, `quick-reference.md`, `hooks/pi/README.md`, and two benchmark/evidence files. All were triaged (see T015 evidence for the 3 deliberately excluded).
- [x] T002 Read `spec-gate-core.test.mjs` in full, both `POSITIVE_ANSWER_CORPUS` and `NEGATIVE_PROMPT_CORPUS`, to scope the fixture rewrite. Evidence: read in full before editing; both corpora and every direct `answerParse`/`isAnswerAttempt`/`classifyIntent` call site naming a letter were rewritten in the same pass.
- [x] T003 Confirm whether a generator produces `.opencode/commands/deep/assets/compiled/*.contract.md`, by searching beyond the paths already checked (`.opencode/commands/deep/`, `.opencode/bin/`) if the earlier search left any directory unchecked. Evidence: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` is the generator (`outputPathFor` writes `.opencode/commands/deep/assets/compiled/<slug>.contract.md`); T009 edited its source and ran `node compile-command-contracts.cjs --command deep/<mode> --write` for all three commands instead of hand-editing the compiled files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Edit `AGENTS.md`: replace the C and D option lines with one C "Related" line merging both wordings, relabel Skip from E to D, remove the old fifth line (`AGENTS.md`). Evidence: lines 53-58 now list A/B/C/D only; the VIOLATION RECOVERY line's `(A/B/C/D/E)` is now `(A/B/C/D)`.
- [x] T005 Edit `spec-gate-core.mjs`: `GATE_3_QUESTION` text to match the new four-option wording (`.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Evidence: `GATE_3_QUESTION` now lists A-D with merged C and D-as-Skip; `GATE_3_DENY_DETAIL` reads "letter A-D".
- [x] T006 Edit `spec-gate-core.mjs`: move the skip letter from E to D across `STANDALONE_LETTER_E_REGEX` (renamed `STANDALONE_LETTER_D_REGEX`), `ANSWER_LETTER_PREFIX_REGEX`, `NATURAL_LEAD_IN_LETTER_REGEX`, `ANSWER_LETTER_ATTEMPT_REGEX`, `ANSWER_LETTER_VOCAB_REGEX` (`.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Evidence: the accepted range narrowed from a-e to a-d (the menu itself shrank to 4 letters, so a bare fifth letter no longer has a meaning to recognize — `spec-gate-core.test.mjs` now asserts this) and `SKIP_ALTERNATIVE_OPTION_REGEX` narrowed from a-d to a-c (D is no longer an "alternative to skip" option, it is skip). `node --test` (T013) passes 87/87 non-skipped.
- [x] T007 Edit `spec-gate-core.test.mjs`: rewrite `POSITIVE_ANSWER_CORPUS` and `NEGATIVE_PROMPT_CORPUS` rows that assert the old D-as-folder or E-as-skip meaning to the new D-as-skip and merged-C wording (`.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs`). Evidence: both corpora rewritten; every `isAnswerAttempt`/`answerParse`/`classifyIntent` call site naming a letter updated; added a bare-`D`-binds-skip case and a bare-`E`-no-longer-registers case in both the corpus and the direct `isAnswerAttempt` assertions. `node --test` passes.
- [x] T008 [P] Edit the command asset files under `.opencode/commands/create/assets/`, `.opencode/commands/deep/assets/`, `.opencode/commands/speckit/assets/` to the new four-option wording. Evidence: 19 files edited (more than the planned 9 — the re-run inventory in T001 found the full set), each in its own format (YAML prose, presentation.txt Q&A blocks, ASCII option lists).
- [x] T009 [P] Edit the 3 compiled contracts under `.opencode/commands/deep/assets/compiled/` (`deep-research.contract.md`, `deep-review.contract.md`, `deep-ai-council.contract.md`) to the new four-option wording. Evidence: T003 found the generator, so the 3 files were regenerated via `node compile-command-contracts.cjs --command deep/<mode> --write` after editing the generator's own hardcoded string and every one of its `sourcePaths` inputs; `check-contract-drift.vitest.ts` (8/8) and `compile-command-contracts.vitest.ts` (12/12) both pass against the regenerated output.
- [x] T010 [P] Edit `.opencode/skills/system-spec-kit/references/workflows/worked-examples.md` and `.opencode/skills/system-spec-kit/references/memory/trigger-config.md` to align their short-form lists to the new canonical wording. Evidence: both now read `A) Existing | B) New | C) Related | D) Skip`.
- [x] T011 [P] Edit `README.md`'s Gate 3 pipeline-diagram box to the new four-option wording. Evidence: the two-line C/D/E box content collapsed to one line, `A) Existing  B) New  C) Related  D) Skip`, re-padded to the box's existing border width.
- [x] T012 [P] Edit `.opencode/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` to the new four-option wording. Evidence: the `"gate"` field now holds the exact new `GATE_3_QUESTION` string, verified byte-for-byte against `node --input-type=module -e "import{GATE_3_QUESTION}...console.log(JSON.stringify(...))"` output; file re-validated as JSON.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` and confirm it passes. Evidence: `tests 90 / pass 87 / fail 0 / cancelled 0 / skipped 3 (pre-existing --experimental-test-module-mocks skips, untouched) / duration_ms 456.127959`, exit status 0.
- [x] T014 Run the classifier's own existing test suite for `gate-3-classifier.ts` unmodified and confirm it passes. Evidence: `npx vitest run cli/tests/gate-3-classifier.vitest.ts --config ../vitest.config.ts` -> `Test Files 1 passed (1)`, `Tests 62 passed (62)`, exit status 0. `gate-3-classifier.ts` was not edited; grep for `satisfiedBy|prior_answer|[A-E])` shows only its existing `satisfiedBy`/`prior_answer` plumbing, no option-letter dependency.
- [x] T015 Re-run the inventory grep from T001 and confirm zero hits outside spec folders and archives. Evidence: the grep returns exactly 3 files, all deliberately excluded as historical/captured-evidence records outside this packet's scope boundary (same rationale as spec.md's "archives" exclusion, applied by content, not by directory) — `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` (embeds a real dated `codex exec` transcript, including the model's own literal "I'm using option E" reply, from 2026-07-13), and the two `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.{md,json}` files (a dated benchmark run's captured tool output). Editing any of the three would rewrite what a prior run actually produced. Every other surface in the original 43-file inventory (including the drift T001 found) was edited. A second, narrower grep for `\bE\) Skip\b|\(A/B/C/D/E\)|letter A-E\b` returns hits only inside the same one excluded file.
- [x] T016 Confirm `CLAUDE.md` is still a symlink resolving to `AGENTS.md`. Evidence: `test -L CLAUDE.md && [ "$(readlink CLAUDE.md)" = "AGENTS.md" ]` holds; `readlink CLAUDE.md` -> `AGENTS.md`.
- [x] T017 Update documentation cross-references touched by the change (this task list stands as the record). Evidence: this task list (T001-T017) and `acceptance-criteria.md` AC-001..AC-006 record every touched surface with its verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..REQ-006 (`spec.md` §4)
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §3-4 (affected-surfaces table, phased implementation)
- [x] CHK-003 [P1] Dependencies identified and available — the one open dependency (generator for the compiled contracts) resolved to `compile-command-contracts.cjs`; used to regenerate rather than hand-edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --test` and `vitest` both parse and run the edited `.mjs`/`.cjs`/`.ts` files clean; no separate lint script is configured for this runtime package
- [x] CHK-011 [P0] No console errors or warnings — hook test suite's "static shape: core never writes console output" case still passes; no `console.*` added
- [x] CHK-012 [P1] Error handling implemented — unchanged; the fail-open behavior on malformed input, corrupt state, and unexpected errors was not touched, and its tests (fail-open, `HIGHEST BLAST proof`) still pass
- [x] CHK-013 [P1] Code follows project patterns — new regex/comments match the file's existing naming and comment style; no ephemeral spec/packet ids added to code comments (Comment Hygiene)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001..AC-006 all `Met` (`acceptance-criteria.md`)
- [x] CHK-021 [P0] Manual testing complete — `test -L CLAUDE.md`, the inventory greps, and the regenerated compiled contracts were all re-checked after implementation, not just unit-tested
- [x] CHK-022 [P1] Edge cases tested — bare `D`, bare `E` (no longer registers), `D-danger` compound word, `D: do not skip; use A instead` contradiction, `option D` natural lead-in, path-outranks-skip for both a plain letter and the skip letter
- [x] CHK-023 [P1] Error scenarios validated — fail-open paths (`HIGHEST BLAST proof`, corrupt state, unwritable dir) re-run unmodified and pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — `cross-consumer`: one letter-contract change with 42 independent producer/consumer surfaces (prose, YAML, JSON fixture, a parser).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — the widened inventory grep (43 files, 3 deliberately excluded as historical evidence) is the producer inventory; re-run at T015 confirms zero remaining producers outside the exclusions.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — the hook's regex consumers (`isAnswerAttempt`, `answerParse`, `classifyIntent` call sites), its test corpora, the advisor-parity fixture, and every doc surface in T008-T012 were all updated in the same pass.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — `answerParse()` is the parser under change; its corpus already covers delimiter variants (comma/period/colon/paren/dash/end-of-string), a joined compound-word case (`D-danger`), a contradiction/fallback case (`D: do not skip; use A instead`), and a path-outranks-skip case.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — one axis, "which surface," 42 edited files (listed in the git-diff scope check below) plus the hook's regex logic as its own row, per `plan.md`'s own framing.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — the pre-existing `HIGHEST BLAST proof` tests (full tool/target/gate-state matrix, and the SYSTEM_SPEC_GATE_ENFORCE-unset sweep) were re-run unmodified and still pass, confirming no regression under global-state variation.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — no commit exists yet (uncommitted working-tree change); evidence is pinned to the explicit, enumerated 42-file pathspec used for `git diff --stat -- <42 files>`, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — N/A, no secret-bearing surface touched
- [x] CHK-031 [P0] Input validation implemented — the answer-letter regex IS the input validation for this surface; re-tested (T013)
- [x] CHK-032 [P1] Auth/authz working correctly — N/A, no auth/authz surface in this change
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` Status Complete, this task list fully ticked, `acceptance-criteria.md` all `Met`
- [x] CHK-041 [P1] Code comments adequate — every comment naming the old skip letter was rewritten to name D, with no ephemeral spec/packet ids added
- [x] CHK-042 [P2] README updated (if applicable) — `README.md`'s Gate 3 pipeline-diagram box updated to the merged four-option line
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — N/A, no temp files were created
- [x] CHK-051 [P1] scratch/ cleaned before completion — N/A, nothing to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15
<!-- /ANCHOR:summary -->

---
