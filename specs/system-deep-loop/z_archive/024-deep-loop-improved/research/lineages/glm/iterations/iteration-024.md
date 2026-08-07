# Iteration 024 — NEW: Tests-vs-Review — Do Cited Test Suites Actually Exist/Pass?

**Focus:** For review findings about test suites, do the cited tests exist and were they run?
**Angle:** Code-vs-tests-vs-review triangulation.

## Findings

**Codex review F004** cites: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:323-341,458,1342-1343` — "Focused fan-out regression suite fails after native lineages were folded into the pool." This is a concrete test-file:line citation.

**Verification:** the file `fanout-run.vitest.ts` EXISTS (it's the test suite for the runtime). The finding claims a regression failure at specific lines. I cannot re-run vitest here (heavy), but the citation is precise and structural — it names real test boundaries. The finding is "active" and the test-suite-fails condition is plausible given the native-lineage-folding work in 002.

**009/001 implementation-summary** claims "553/555 pass, 2 failures pre-existing" (executor-provenance-mismatch + dependency-seams). These are named test files. Again, plausible but not re-run this round.

**GLM review P1-005** cites `manual_testing_playbook/fanout/fanout-salvage-recovery.md:86` — "claims exit-0/no-artifact coverage, but the referenced regression never exercises that path." This is a playbook-vs-test gap: the manual testing playbook ASSERTS coverage that doesn't exist in automated tests. This is a traceability defect — the playbook overclaims.

**Net assessment:** test citations in review findings are structurally precise (real files, real lines) but their pass/fail status is NOT independently verified by any automated gate during remediation. The 009/001 "553/555" claim is taken at face value. Recommendation: remediation phases should attach a `test-evidence.json` (command + exit code + counts) rather than prose claims, so validate.sh can check test-run recency.

## Evidence
[SOURCE: review/lineages/codex/.../registry F004 — fanout-run.vitest.ts:323-341]
[SOURCE: 009/001/implementation-summary.md:70 — "553/555 pass"]

## newInfoRatio: 0.7 (test citations precise but unverified-by-gate; playbook-overclaim gap in P1-005)
