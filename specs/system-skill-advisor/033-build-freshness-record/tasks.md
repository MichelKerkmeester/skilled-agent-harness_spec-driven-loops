---
title: "Tasks: Record the advisor runtime dist build so a fresh build writes its own freshness attestation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "build freshness record tasks"
  - "advisor prebuild record-build tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Record the advisor runtime dist build so a fresh build writes its own freshness attestation

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

`P` is `.skilled/skills/system-skill-advisor/runtime/package.json`. `T` is `.skilled/skills/system-skill-advisor/runtime/tests/dist-build-record-contract.vitest.ts`. `D` is `.skilled/skills/system-skill-advisor/runtime/dist/runtime`. `K` is `.skilled/skills/system-skill-advisor/SKILL.md`. `CL` is `.skilled/skills/system-skill-advisor/changelog`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the spec-kit runtime build that already attests (`package.json` and `scripts/finalize-dist.mjs`). Verify: `rg -n 'prepare-build|finalize-dist' .skilled/skills/system-spec-kit/runtime/package.json` prints both, and `finalize-dist.mjs` calls `recordPackageBuild`.
- [x] T002 Record the pre-change reading (`D`). Verify: with the records deleted, one probe run creates `.dist-freshness-system-skill-advisor-runtime-81f52b7e00ae.json` carrying `"origin":"checker"`, and the quality suite's snapshot helper reports `the run changed files on disk` naming it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `prebuild` step for both entries (`P`). Verify: `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` prints `dist build preparation recorded` twice.
- [x] T004 Extend `postbuild` with `record-build` for both entries and a checker-cache fallback (`P`). Verify: the same build prints `dist build attestation recorded` twice and exits 0.
- [x] T005 Add the registry contract test (`T`). Verify: `./node_modules/.bin/vitest run tests/dist-build-record-contract.vitest.ts` in the runtime prints `Tests 2 passed`.
- [x] T006 Bump the skill version (`K`). Verify: `rg -n '^version: 0\.17\.29\.0$' .skilled/skills/system-skill-advisor/SKILL.md` prints one line.
- [x] T007 Write the release note (`CL`). Verify: `ls .skilled/skills/system-skill-advisor/changelog/v0.17.29.0.md` prints the path and `rg -n '^version: 0\.17\.29\.0$'` on it prints one line.
- [x] T008 Regenerate the Hermes copy (`.hermes/skills/system-skill-advisor/SKILL.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` exits 0 and `rg -n '^version: 0\.17\.29\.0$' .hermes/skills/system-skill-advisor/SKILL.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Delete both records and rebuild (`D`). Verify: both `.dist-freshness-system-skill-advisor-runtime-*.json` files exist and each parses to `"origin":"build"`.
- [x] T010 Run the doctor suite as the first command after that build (`.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` prints `pass 20` and exits 0.
- [x] T011 Run every doctor suite (`.skilled/commands/doctor/scripts/tests/run-all.sh`). Verify: the run prints `7 suite(s) passed, 0 failed` and exits 0, and both records are byte-identical afterwards.
- [x] T012 Prove the contract test discriminates (`T`). Verify: with one entry removed from `prebuild`, the test fails on `prebuild`; restored, it prints `Tests 2 passed`.
- [x] T013 Validate the packet (`specs/system-skill-advisor/040-build-freshness-record`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/040-build-freshness-record --strict` prints `RESULT: PASSED`.
- [x] T014 Scan the packet for unfilled placeholders (`specs/system-skill-advisor/040-build-freshness-record`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/system-skill-advisor/040-build-freshness-record` prints `PASS`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: a build writes both records with `origin: "build"`, and the doctor suite after it writes nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
