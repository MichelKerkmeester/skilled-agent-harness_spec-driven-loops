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

`E` is `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`. `S` is one of the nine skill folders that declare `hard_rules:` today. `B` is the fixed command set per skill that the design note fixes, `V` is the recordings under `scratch/verify/` and `D` is the design note under `scratch/`. The plan's eight phases map onto the three sections below: design and the fixed contract (plan phase 1) in Phase 1, with the baseline and before verdicts (plan phase 2), the engine, the readers, the nine rule sets and the docs (plan phases 3, 4 and 5) in Phase 2, and the after verdicts, the suites, the review and the closure (plan phases 6, 7 and 8) in Phase 3. Every task is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (D6). The session runs the baselines, the verdict comparison and the closure gates, never an executor. This phase is Planned, so every task is `[ ]` and every check is open.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read `E`, its two suites, the four preflight adapters (`.skilled/hooks/dispatch/claude/`, `codex/`, `devin/` and `pi/`), the registry `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, both sk-git scripts with the pi twin, both OpenCode plugin copies with `.opencode/plugins/tests/source-root-consumers.test.cjs`, the devin policy at `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`, and `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, all read-only. Check: `D` names every reader row of `spec.md` section 3 with its line, every row is either moved or recorded as not a consumer with its evidence, and no read-only source is edited.
- [ ] T002 Fix the sidecar contract in `D`, executor DeepSeek V4.1 Flash (D6). Fix the sidecar name and shape, the `readHardRules` signature, the fail-open behavior per failure case, the fixed command set `B` per skill, the comparison method and the recording paths under `V`. Check: each answer is one sentence with the alternative it was chosen over, `spec.md` section 10's six questions each have a proposed answer, and every `UNKNOWN` is named with what would resolve it.
- [ ] T003 Baselines and before verdicts, executor the orchestrating session. Re-count the rules per skill, run the five suites of `spec.md` section 3 from the repo root, run `B` through `evaluate` from the pre-change state with the rules read from frontmatter, and save the results under `V`. Check: nine recordings exist, each has the corpus's row count, a command that triggers no rule records an empty verdict set, and each suite result is captured with its pass and fail counts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] The engine reads the sidecar, executor DeepSeek V4.1 Flash (D6). In `E`, make `readHardRules` read the sibling `hard-rules.json`, parse it with `JSON.parse`, return an empty list on any read or parse error, and delete the frontmatter parse. Check: the function adds no dependency, the missing, empty, malformed and non-array cases each return an empty list without throwing, and no code comment names a spec path, phase number or requirement id.
- [ ] T005 [P] Sidecar parse tests, executor DeepSeek V4.1 Flash (D6). In `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, move the fail-open cases at `:217-220` to the sidecar, keep the four skills' id assertions and the assertion that every declared `check` id is implemented in `CHECKS`. Check: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` exits 0 with 0 failed, and the sidecar cases cover at least the missing, empty, malformed and object-not-array shapes.
- [ ] T006 Readers and tests move in the same change, executor DeepSeek V4.1 Flash (D6). Reconcile each row of `spec.md` section 3: the four preflight adapters, the two OpenCode plugin copies, the three sk-git files, the pi twin, the devin policy and the five test files, including the `hard_rules:` sentinel at `.opencode/plugins/tests/source-root-consumers.test.cjs:29` and the SKILL.md copy in `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs:85`. Check: `rg -n 'parseHardRules'` finds no reader of SKILL.md text, and each moved test file's rule assertions read the sidecar.
- [ ] T007 Move the nine rule sets, executor DeepSeek V4.1 Flash (D6). Create `hard-rules.json` beside each `S`, holding that skill's rules copied exactly and in order, and remove the `hard_rules` key from each SKILL.md frontmatter block with every other byte kept. Check: the rule-for-rule comparison prints `equal` and the counts 17, 8, 8, 5, 4, 2, 2, 2 and 2 for sk-git, cli-usage, cli-hermes, cli-opencode, cli-pi, cli-claude-code, cli-codex, cli-cursor and cli-devin, and `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing.
- [ ] T008 Docs through sk-doc, executor DeepSeek V4.1 Flash (D6). Update `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` with its `SKILL.md`, and `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`, so both say where hard rules live and that `hard_rules` is not a SKILL.md frontmatter key. Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, no doc claims a result no run printed, and the template points at the sidecar rather than describing a frontmatter key.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 After verdicts, executor the orchestrating session. Run `B` through `evaluate` from the final state and save one recording per skill under `V`. Check: the before and after recordings compare equal per skill, row for row, including the empty-verdict rows, and the comparison output is recorded in `implementation-summary.md`.
- [ ] T010 Suites and the Hermes check from the final state, executor the orchestrating session. Rerun the five suites of `spec.md` section 3, the three registered hooks' adapters, and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`. Check: each suite is at or above its baseline with 0 failed, each hook still resolves, `--check` passes, and the design's finding about whether a Hermes copy needs the sidecar is recorded.
- [ ] T011 Cross-family review, executor MiMo v2.6 Pro (D6). Review every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. The review output is `scratch/verify/review-mimo-r1.txt` (proposed), and any DeepSeek reverse-review is `scratch/verify/review-deepseek-r1.txt` (proposed). Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, and P2 findings recorded.
- [ ] T012 Closure, executor the orchestrating session. Record the rule counts, the verdict comparison and every gate result in `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)` and `packet_durable_chars` at or under 4000.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Manual verification passed: the five suites, the before-and-after verdict comparison and the Hermes check run from the final state, and the three registered hooks still resolve.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012, with the sidecar contract fixed at spec approval. Planned: `spec.md` section 4.
- [ ] CHK-002 [P0] Technical approach defined in plan.md with the eight phases and their checks. Planned: `plan.md` section 4.
- [ ] CHK-003 [P1] Dependencies identified and available: phase 039, the engine at `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, the nine SKILL.md files and the five test files. Planned: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The engine reads the sidecar with no new dependency, and a missing, empty or malformed sidecar returns an empty rule list without throwing. Planned: REQ-002.
- [ ] CHK-011 [P0] No console errors or warnings on any reader path, before or after the move. Planned: proof plan 3 and 4.
- [ ] CHK-012 [P1] Every failure path has one handling: the missing, empty, malformed and object-not-array sidecar cases, and the rule naming an unimplemented `check` id. Planned: `spec.md` edge cases.
- [ ] CHK-013 [P1] The change follows the engine's existing shape, and comments carry no spec path, phase number or requirement id. Planned: REQ-009.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`.
- [ ] CHK-021 [P0] The five suites of `spec.md` section 3 pass at or above their recorded baselines from the final state. Planned: T010.
- [ ] CHK-022 [P1] Edge cases tested: the missing, empty, malformed and object-not-array sidecar, the symlinked SKILL.md path, and a command that triggers no rule. Planned: T005 and T009.
- [ ] CHK-023 [P1] The before-and-after verdict comparison covers every skill and every declared `check` id, with the empty-verdict rows included. Planned: T003 and T009.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Planned: this is a migration, so the classes apply only if the review raises a finding.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the nine SKILL.md producers from `grep -rln '^hard_rules:'`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed reader, its callers, its docs and its tests. Planned: `spec.md` section 3 lists the 10 readers and five test files with their lines.
- [ ] CHK-FIX-004 [P0] Adversarial table tests exist for the moved surface: the four sidecar failure shapes, the symlinked path and the unimplemented `check` id. Planned: T005.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the skill, field, failure, reader, runtime and verdict axes.
- [ ] CHK-FIX-006 [P1] A hostile-tree variant runs where a reader resolves a path: a sidecar replaced by a directory, and a SKILL.md whose sibling is absent. Planned: T005.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Planned: T012 names the build commit and each recording under `V`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret in any changed file, and the sidecar holds rule text only. Planned: REQ-008.
- [ ] CHK-031 [P0] No reader reads a `.env` file, prints an environment value or passes a credential. Planned: NFR-S01.
- [ ] CHK-032 [P1] The sidecar is repo-local and authored, so no new input surface enters the hook path. Planned: NFR-S02.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass.
- [ ] CHK-041 [P1] The sk-doc frontmatter contract and skill template name the sidecar, and no doc claims a result no run printed. Planned: T008.
- [ ] CHK-042 [P2] The Hermes copies' handling of the sidecar is recorded with its evidence, whether or not the sync changes. Planned: T010.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The design note and the comparison script stay in `scratch/` only. Planned: T001 and T003.
- [ ] CHK-051 [P1] The before and after recordings stay under `scratch/verify/` and are removable. Planned: T003 and T009.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending. This phase is Planned, so no row carries observed evidence yet.
<!-- /ANCHOR:summary -->

---
