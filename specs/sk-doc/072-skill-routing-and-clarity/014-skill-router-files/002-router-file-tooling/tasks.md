---
title: "Tasks: Phase 2: router-file-tooling"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "router file tooling tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: router-file-tooling

<!-- SPECKIT_LEVEL: 1 -->

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

`RS` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts`. `RT` is `.skilled/skills/sk-code/sk-code-skilled/scripts/tests`. `AD` is `.skilled/skills/system-skill-advisor/runtime`. `HM` is `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the source probe baseline. Verify: the `node -e` probe in `spec.md` section 2 prints `{"hub-router.json":7,"inline":6}`.
- [ ] T002 Capture the guard baselines. Verify: `node $RS/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, and `python3 $RS/verify_alignment_drift.py --root .skilled/skills --check-router` prints `Findings: 0` over 5419 files.
- [ ] T003 [P] Capture the suite baselines. Verify: `node --test $RT/verify-router-sync.test.cjs` prints `pass 9`, `python3 $RS/test_verify_alignment_drift.py` prints `Ran 30 tests` and `OK`, and `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` prints `pass 42`.
- [ ] T004 [P] Confirm the heading grammar against real files. Verify: `grep -rl "MACHINE ROUTER" --include=SKILL.md .skilled/skills | wc -l` prints 54, `grep -l "MACHINE ROUTER" .skilled/skills/*/ROUTER.md | wc -l` prints 0, and `grep -rn "^## .*MACHINE-READABLE ROUTER" .skilled/skills/*/ROUTER.md | wc -l` prints 7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create the resolver with the heading grammar, the two candidate documents and the three verdicts (`$RS/router-file-resolver.cjs`). Verify: `node -e 'require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs")'` exits 0.
- [ ] T006 Add the resolver unit set, one case per verdict plus one for a file with no heading (`$RT/router-file-resolver.test.cjs`). Verify: `node --test $RT/router-file-resolver.test.cjs` prints `pass 4`.
- [ ] T007 Point `parseRouter` at the resolver and keep its return shape (`$RS/router-replay-lib.cjs`). Verify: the source probe still prints `{"hub-router.json":7,"inline":6}`.
- [ ] T008 Add a router-in-`ROUTER.md` case and a dual-declaration case to the sync suite (`$RT/verify-router-sync.test.cjs`). Verify: `node --test $RT/verify-router-sync.test.cjs` prints `pass 11`.
- [ ] T009 Point `readSkillRouter` at the resolver instead of reading `SKILL.md` itself (`$RS/verify-router-sync.cjs`). Verify: `node $RS/verify-router-sync.cjs` prints `5/5 checks passed`.
- [ ] T010 Read declarations from `ROUTER.md` when it holds a machine-router section, and keep paths rooted at the skill (`$RS/verify_alignment_drift.py`). Verify: the scan over `.skilled/skills` still prints `Findings: 0`.
- [ ] T011 Add a `ROUTER.md` case and a dual-declaration case to the scan suite (`$RS/test_verify_alignment_drift.py`). Verify: `python3 $RS/test_verify_alignment_drift.py` prints `Ran 32 tests` and `OK`.
- [ ] T012 Carry `ROUTER.md` into each generated copy and check it for drift (`$HM`). Verify: `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` prints `pass 6` today and one more passing case for the copied file.
- [ ] T013 Add the `ROUTER.md` probe to `buildSourceSnapshot` (`$AD/lib/freshness.ts`). Verify: `cd $AD && node_modules/.bin/vitest run tests/legacy/advisor-freshness.vitest.ts` prints `Tests 12 passed`.
- [ ] T014 Add the same probe to `advisorSourceSignature` (`.opencode/plugins/system-skill-advisor.js`). Verify: `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` prints `pass 42`.
- [ ] T015 Add the `router-md` reason and the target discovery (`$AD/lib/daemon/watcher.ts`), with one case in the watcher suite (`$AD/tests/daemon-watcher-new-root-ingestion.vitest.ts`). Verify: `cd $AD && node_modules/.bin/vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` prints no failing case.
- [ ] T016 Write the parity suite, one case per document in the fixture skill (`$AD/tests/parity/router-signature-parity.vitest.ts`). Verify: it passes, and deleting the plugin probe makes it fail.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run the resolver and scan suites together (`$RT`, `$RS`). Verify: `node --test $RT/router-file-resolver.test.cjs $RT/verify-router-sync.test.cjs` exits 0, and the Python suite prints `OK`.
- [ ] T018 Run both guards over the live tree. Verify: `5/5 checks passed` and `Findings: 0` over 5419 files.
- [ ] T019 Run the advisor suites. Verify: freshness prints `Tests 12 passed`, and the watcher and parity suites print no failing case.
- [ ] T020 Run the phase gate. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling --strict` prints `RESULT: PASSED`.
- [ ] T021 Record the observed counts in `acceptance-criteria.md` and move each row that now passes to `Met`. Verify: every `Met` row names a command and the output the run printed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The source probe still prints `{"hub-router.json":7,"inline":6}`, so no live skill changed its router source in this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance gate**: See `acceptance-criteria.md`
- **Research findings**: See `../001-deep-research/research/research.md` sections 4, 5 and 9
<!-- /ANCHOR:cross-refs -->

---
