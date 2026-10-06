---
title: "Tasks: v4.0.0.3 review remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v4.0.0.3 remediation tasks"
  - "review finding fix tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4.0.0.3 review remediation

<!-- SPECKIT_LEVEL: 3+ -->

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

<!-- ANCHOR:workstreams -->
## Workstream Organization

| Workstream | Tasks | Work package (in `plan.md`) |
|------------|-------|------------------------------|
| W-A Review workflow and ledger | T010-T013, T017, T026, T046 | WP-A |
| W-B Devin write parity | T014-T015 | WP-B |
| W-C Loop lock | T016, T016a, T016b | WP-C, WP-C addendum |
| W-D sk-git | T020-T023 | WP-D |
| W-E Fan-out runner | T018, T024, T040-T044 | WP-E |
| W-F Docs and workflow copies | T019, T025, T027, T045 | WP-F |
| W-G Contract gaps | T030-T037 | WP-G rows G1-G8 |
| W-H Integrator | T001-T003, T038, T047-T053, every commit | WP-H |

Each task line is followed by `agent | deps | touched-files` metadata, so a dispatcher can decide eligibility without asking.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [M0] [W-H]

- [ ] T001 Confirm the worktree is provisioned: deep-loop runtime and spec-kit CLI tests start (`.skilled/skills/system-deep-loop/runtime`, `.skilled/skills/system-spec-kit/runtime/cli`)
  <!-- agent: W-H | deps: [] | touched-files: [] -->
- [ ] T002 Run every suite in `research/research.md` section 3 and every work package's Verify list, and record pass and fail counts as the baseline (`implementation-summary.md`)
  <!-- agent: W-H | deps: [T001] | touched-files: ["implementation-summary.md"] -->
- [ ] T003 Record the guard baselines: `check-rule-copies.js` offsets, `generate-trigger-index.mjs --check`, `sync-hook-registrations.cjs --check`, `check-repo-rules.cjs`, `check-ledger-stem-producers.cjs`, and the NUL counts (SYNC-0)
  <!-- agent: W-H | deps: [T001] | touched-files: ["implementation-summary.md"] -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A: P1s [M1], each test failing first

Wave 1: W-A, W-B and W-C in parallel.

- [ ] T010 [P] Write the failing review emission test and state-contract test (WP-A tests 1 to 3)
  <!-- agent: W-A | deps: [T002] | touched-files: [".skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-bookkeeping-emission.vitest.ts", ".skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-contract.vitest.ts"] -->
- [ ] T011 Widen `DATA_FIELD_RULES` and the types with the additive fields, and update the schema fixtures (WP-A R-01 step 1)
  <!-- agent: W-A | deps: [T010] | touched-files: [".skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts", ".skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts", ".skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts"] -->
- [ ] T012 Add and widen the six projection branches (WP-A R-01 step 6)
  <!-- agent: W-A | deps: [T011] | touched-files: [".skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts"] -->
- [ ] T013 Rewrite the six directives in stem form, move the restart append, flip the census, and add the pins and `bookkeeping_log` keys. T010 passes and `check-ledger-stem-producers.cjs` exits 0 (WP-A R-01 steps 2 to 5)
  <!-- agent: W-A | deps: [T012] | touched-files: [".skilled/commands/deep/assets/deep-review-auto.yaml", ".skilled/commands/deep/assets/deep-review-confirm.yaml", ".skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts"] -->
- [ ] T014 [P] Write the failing Devin `write` tests: two spec-gate cases, the post-edit case, and the registry matcher case (WP-B)
  <!-- agent: W-B | deps: [T002] | touched-files: [".skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs", ".skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs", ".skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts"] -->
- [ ] T015 Map `write` in both Devin adapters, widen the two registry matchers, regenerate `.devin/hooks.v1.json`, and update the four doc lines. T014 passes and `--check` exits 0 (WP-B)
  <!-- agent: W-B | deps: [T014] | touched-files: [".skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs", ".skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs", ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json", ".devin/hooks.v1.json", ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md", ".skilled/skills/system-spec-kit/runtime/hooks/devin/README.md", ".skilled/hooks/post-edit-quality/README.md", ".devin/SYNC.md"] -->
- [ ] T016 [P] Write the failing two-reclaimer and corrupt-file tests, then add the read-back and the link-based restore (R-03, WP-C)
  <!-- agent: W-C | deps: [T002] | touched-files: [".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts", ".skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts"] -->
- [ ] T016a Write the failing "second acquire of a fresh transient lock" CLI test (R-22, WP-C addendum)
  <!-- agent: W-C | deps: [T016] | touched-files: [".skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock-cli.vitest.ts", ".skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts"] -->
- [ ] T016b Add `ownerKind` and the transient staleness rule, and mark CLI acquires without `--owner-pid` as transient. T016a passes and typecheck is clean (SYNC-1)
  <!-- agent: W-C | deps: [T016a] | touched-files: [".skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts", ".skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs"] -->

Wave 1b: these open at SYNC-1.

- [ ] T017 Add `--ttl-ms 1800000`, the per-iteration refresh step and the shared lock note to both review YAMLs, with the YAML assertion test (WP-A R-22 part)
  <!-- agent: W-A | deps: [T013, T016b] | touched-files: [".skilled/commands/deep/assets/deep-review-auto.yaml", ".skilled/commands/deep/assets/deep-review-confirm.yaml", ".skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-stage-skip.vitest.ts"] -->
- [ ] T018 [P] Pass `owner_kind` through `holdsLiveLoopLock`, with a test (WP-E step 7)
  <!-- agent: W-E | deps: [T016b] | touched-files: [".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs", ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"] -->
- [ ] T019 [P] Apply the TTL, the refresh step and the shared note to the four research and council YAMLs and `spec-check-protocol.md`, plus the improvement note wording (WP-F step 3)
  <!-- agent: W-F | deps: [T016b] | touched-files: [".skilled/commands/deep/assets/deep-research-auto.yaml", ".skilled/commands/deep/assets/deep-research-confirm.yaml", ".skilled/commands/deep/assets/deep-ai-council-auto.yaml", ".skilled/commands/deep/assets/deep-ai-council-confirm.yaml", ".skilled/commands/deep/assets/deep-agent-improvement-auto.yaml", ".skilled/commands/deep/assets/deep-agent-improvement-confirm.yaml", ".skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md"] -->
- [ ] T019a W-H verifies and commits Phase A, one commit per package part (SYNC-2)
  <!-- agent: W-H | deps: [T013, T015, T016b, T017, T018, T019] | touched-files: [] -->

### Phase B: sk-git and deep-loop P2s [M2]

Wave 2: W-D, W-F, W-A and W-E in parallel.

- [ ] T020 [P] Add the bundled-flag and arity test rows (WP-D table) and record them failing
  <!-- agent: W-D | deps: [T019a] | touched-files: [".skilled/skills/sk-git/scripts/lib/message-contract.test.mjs", ".skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"] -->
- [ ] T021 Add `COMMIT_OPTION_ARITY`, `expandShortFlags` and the commit `BARE_IN_SUBCOMMAND` entry; route the gate through the expander (R-04, R-08)
  <!-- agent: W-D | deps: [T020] | touched-files: [".skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs", ".skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs"] -->
- [ ] T022 Reject over-cap commit messages and PR bodies with `message.too-long` and `pr.too-long`, and add both template rows in the same change (R-06)
  <!-- agent: W-D | deps: [T020] | touched-files: [".skilled/skills/sk-git/scripts/lib/message-contract.mjs", ".skilled/skills/sk-git/assets/commit-message-template.md", ".skilled/skills/sk-git/assets/pr-template.md"] -->
- [ ] T023 Guard `setFlagsFromString` in the gate and in `validate-message.mjs:45` (R-18)
  <!-- agent: W-D | deps: [T020] | touched-files: [".skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs", ".skilled/skills/sk-git/scripts/validate-message.mjs"] -->
- [ ] T024 [P] Add the advisory comment above `fanout-salvage.cjs:170` (R-05, waived by ADR-005)
  <!-- agent: W-E | deps: [T019a] | touched-files: [".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs"] -->
- [ ] T025 [P] Fix the nine playbook commands (R-15, WP-F step 1)
  <!-- agent: W-F | deps: [T019a] | touched-files: [".skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/*.md", ".skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/*.md"] -->
- [ ] T026 [P] Write the failing drain test, then insert the recovery-baseline drain after the heredoc (R-07, WP-A)
  <!-- agent: W-A | deps: [T019a] | touched-files: [".skilled/commands/deep/assets/deep-review-auto.yaml", ".skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-recovery-baseline-drain.vitest.ts"] -->
- [ ] T027 [P] Name the terminal `status: complete` write as the one permitted config write (R-20 and F7, WP-F step 2)
  <!-- agent: W-F | deps: [T019a] | touched-files: [".skilled/skills/system-deep-loop/deep-review/SKILL.md", ".skilled/skills/system-deep-loop/deep-research/SKILL.md", ".skilled/skills/system-deep-loop/deep-review/references/state/state-format.md"] -->
- [ ] T029 W-H verifies and commits Phase B (SYNC-3)
  <!-- agent: W-H | deps: [T021, T022, T023, T024, T025, T026, T027] | touched-files: [] -->

### Phase C: release-tail and contract-gap P2s [M2]

Wave 3: up to eight agents, one per WP-G row.

- [ ] T030 [P] G7: write the raw NUL bytes as `\u0000`, with no-NUL tests (R-19)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs", ".skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs", ".skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts", ".skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/anti-goodhart.vitest.ts"] -->
- [ ] T031 [P] G1: degrade an unreadable frontmatter list to one warning (R-10)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/skills/sk-doc/shared/scripts/validate_document.py", ".skilled/skills/sk-doc/scripts/tests/test_frontmatter_values.py"] -->
- [ ] T032 [P] G2: scan the evidence before the tail for blockers (R-11)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/hooks/goal/lib/goal-core.cjs", ".skilled/hooks/goal/lib/goal-core.test.cjs"] -->
- [ ] T033 [P] G3: per-section and total caps on fetched text (R-12)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs", ".skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs", ".skilled/hooks/classifier-injection-screen/README.md"] -->
- [ ] T034 [P] G4: validate a numbered child that holds packet docs, and report each skip (R-13)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh", ".skilled/skills/system-spec-kit/runtime/cli/tests/validate-recursive-artifact-skip.vitest.ts"] -->
- [ ] T035 [P] G5: report out-of-range citations in the advise summary (R-16)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs", ".skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs"] -->
- [ ] T036 [P] G6: multi-key session id, and drain the only pending session (R-17)
  <!-- agent: W-G | deps: [T029] | touched-files: [".opencode/plugins/classifier-injection-screen.js", ".opencode/plugins/tests/classifier-injection-screen.test.cjs"] -->
- [ ] T037 [P] G8: let short `ed`/`ing` stems meet, keeping 11/11 on the live corpus (R-21)
  <!-- agent: W-G | deps: [T029] | touched-files: [".skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs", ".skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py"] -->
- [ ] T039 W-H runs `run-script-tests.sh` once, verifies and commits Phase C (SYNC-4)
  <!-- agent: W-H | deps: [T030, T031, T032, T033, T034, T035, T036, T037] | touched-files: [] -->

### Phase D: lineage-prompt fixes [M3]

Wave 4.

- [ ] T040 Write the failing prompt, session-id and `needs_input` tests and update the pinned assertions (WP-E tests)
  <!-- agent: W-E | deps: [T039] | touched-files: [".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts", ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts", ".skilled/skills/system-deep-loop/runtime/tests/unit/cli-guards-needs-input.vitest.ts"] -->
- [ ] T041 F2 preamble, F3 steer lines and F6 `promptDir` in `buildLoopPrompt`
  <!-- agent: W-E | deps: [T040] | touched-files: [".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"] -->
- [ ] T042 F4 `readStoredLineageSessionId` and the call site
  <!-- agent: W-E | deps: [T040] | touched-files: [".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"] -->
- [ ] T043 F8 `needs_input` class, detector, classifier branch, runner wiring and rollup key
  <!-- agent: W-E | deps: [T040] | touched-files: [".skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs"] -->
- [ ] T044 Run the WP-E verify list. T040 passes, and every must-stay-green assertion holds
  <!-- agent: W-E | deps: [T041, T042, T043] | touched-files: [] -->
- [ ] T045 [P] Staging skip in both research YAMLs, and the blast-radius carve-out (WP-F steps 4 and 5)
  <!-- agent: W-F | deps: [T039] | touched-files: [".skilled/commands/deep/assets/deep-research-auto.yaml", ".skilled/commands/deep/assets/deep-research-confirm.yaml", ".skilled/repo-rules/blast-radius.md"] -->
- [ ] T046 [P] Staging skip in both review YAMLs, with its test (WP-A)
  <!-- agent: W-A | deps: [T039] | touched-files: [".skilled/commands/deep/assets/deep-review-auto.yaml", ".skilled/commands/deep/assets/deep-review-confirm.yaml", ".skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-stage-skip.vitest.ts"] -->
- [ ] T047 Apply F1 to `AGENTS.md:61`, `:178` and `:188`, byte-neutral before the Blast-Radius anchor, and confirm `check-rule-copies.js` exits 0 (ADR-001 accepted 2026-10-06)
  <!-- agent: W-H | deps: [T044, ADR-001] | touched-files: ["AGENTS.md"] -->
- [ ] T048 Run the two-iteration Luna lineage smoke (WP-H step 8), record the result, and remove `scratch/luna-smoke/`
  <!-- agent: W-H | deps: [T044, T046, T047] | touched-files: ["implementation-summary.md"] -->
- [ ] T049 W-H verifies and commits Phase D, with F1 in a separate commit (SYNC-5)
  <!-- agent: W-H | deps: [T044, T045, T046, T047, T048] | touched-files: [] -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [M4] [W-H]

- [ ] T038 Regenerate the trigger index after the last doc edit, and confirm `--check` exits 0 (R-09)
  <!-- agent: W-H | deps: [T049] | touched-files: [".skilled/skills/system-spec-kit/runtime/data/trigger-index.json"] -->
- [ ] T050 Rerun every baseline suite and guard, and report the delta (`implementation-summary.md`)
  <!-- agent: W-H | deps: [T038] | touched-files: ["implementation-summary.md"] -->
- [ ] T051 Map each of R-01 to R-22 and F1 to F8 to its commit SHA or ADR (`implementation-summary.md`)
  <!-- agent: W-H | deps: [T050] | touched-files: ["implementation-summary.md"] -->
- [ ] T052 Re-derive this folder and the 033 parent, then require `RESULT: PASSED` from `validate.sh --strict` on both (R-14 closure)
  <!-- agent: W-H | deps: [T051] | touched-files: ["graph-metadata.json", "description.json", "../graph-metadata.json"] -->
- [ ] T053 Mark every `acceptance-criteria.md` row with evidence, and reconcile status across the packet docs
  <!-- agent: W-H | deps: [T052] | touched-files: ["acceptance-criteria.md", "spec.md", "tasks.md", "implementation-summary.md", "goal.md"] -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Gate | Tasks |
|-----------|------|-------|
| M0 | SYNC-0 baseline recorded | T001-T003 |
| M1 | SYNC-2: four P1s closed with failing-first evidence | T010-T019a |
| M2 | SYNC-4: advisories closed or waived | T020-T039 |
| M3 | SYNC-5: lineage fixes and smoke | T040-T049 |
| M4 | Strict validation and acceptance criteria | T038, T050-T053 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row in `acceptance-criteria.md` is Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Research**: See `research/research.md`
- **Work packages and dispatch contract**: See `plan.md` L3+: WORKSTREAM COORDINATION and L3+: WORK PACKAGES
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies available (T001 provisioning; ADR-001 accepted 2026-10-06)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every changed module's existing suite passes
- [ ] CHK-011 [P0] Guards exit 0: `check-rule-copies.js`, `sync-hook-registrations.cjs --check`, `generate-trigger-index.mjs --check`, `check-repo-rules.cjs`
- [ ] CHK-012 [P1] Each fix keeps its module's fail-open or fail-closed posture unless the finding names that posture as the defect
- [ ] CHK-013 [P1] No code comment carries a finding, task or packet id
- [ ] CHK-014 [P0] No implementer changed a file outside its workstream's ownership (`git diff --stat` per accepted return)
- [ ] CHK-015 [P1] Every return was verified by the integrator re-running its work package's Verify list before the commit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The four P1 regression tests (R-01, R-02, R-03, R-22) were each observed failing before their fix
- [ ] CHK-022 [P1] Edge cases from spec.md section 8 are tested
- [ ] CHK-023 [P1] Baseline-to-final delta reported, with no new failures
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] R-02 and R-04 widen enforcement coverage and narrow nothing
- [ ] CHK-032 [P1] F1 confines record-and-continue to the lineage directory
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Feature catalog and playbook entries that describe a changed behavior are updated (for example `jsonl-lock-held-merge.md:28` if R-05 changes)
- [ ] CHK-042 [P2] Changelog refreshed in `../changelog/` at close
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 3/16 |
| P1 Items | 22 | 2/22 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-10-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The R-12 byte cap bounds classifier stdin (NFR-P01)
- [ ] CHK-111 [P1] No suite's runtime grows by more than the new tests it adds
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback is one `git revert` per workstream commit
- [ ] CHK-121 [P0] Pre-commit and CI guards pass on the final tree
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Enforcement changes (R-02, R-04, R-06, F1) reviewed against their guard tests
- [ ] CHK-131 [P1] No dependency added
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] The operator is told to update `~/.claude/CLAUDE.md` if F1 lands
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | ADR-001 acceptance | [x] Approved | 2026-10-06 |
| Operator | ADR-004 (heartbeat, 30-minute TTL) | [x] Approved | 2026-10-06 |
| Operator | Packet close | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
