# Review Report — arena-config pass six

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** — five active P2 findings, no active P0 or P1.
- **P0/P1/P2 counts: 0 / 0 / 5** — the counts `review-verdict.cjs` derived from the lineage registry and state log, which are the counts this report uses.
- **Review scope**: the three paths `review/review-scope-6.txt` assigns to the `arena-config` area, diffed with the scope file's per-area command over `ddb12a6852c..85550ee946e`: `prepare-behaviour-arena.mjs`, `command-behaviour-guards.vitest.ts` and `vitest.config.ts` (62 insertions, 1 deletion).
- **Adversarial self-check**: all five findings are P2, so the tiered contract required evidence review only. Each cites a file:line and a concrete input; none was downgraded or called a false positive, and none was raised above P2. Two directions that looked like P1 candidates were ruled out with reproduction rather than confidence: the buffer overflow (reproduced `ENOBUFS` at the default cap and success at 512 MiB) and an arena fix closed without a build (T043 records the `ok:true` build).
- **Operator review focus** (config.reviewFocus, verbatim): Review pass six. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-6.txt and follow it: it names your area by lineage label, the scope file review/review-scope-6.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this lineage: the verdict is PASS and every open finding is an advisory that can be scheduled or fixed in place. It becomes required if any advisory is promoted after a new input shows a live failure, which the downgrade triggers below name.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "AC6-P2-001", "severity": "P2", "title": "The per-run temp folder is removed on a clean exit only", "file": ".skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16", "dimension": "correctness", "findingClass": "instance-only"},
    {"id": "AC6-P2-002", "severity": "P2", "title": "The suite isolation sets only the variable POSIX reads", "file": ".skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14", "dimension": "correctness", "findingClass": "instance-only"},
    {"id": "AC6-P2-003", "severity": "P2", "title": "The isolation lever reaches one of the two suite configs", "file": ".skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14", "dimension": "traceability", "findingClass": "class-of-bug"},
    {"id": "AC6-P2-004", "severity": "P2", "title": "The buffer regression test never asserts the premise it guards", "file": ".skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:755", "dimension": "maintainability", "findingClass": "instance-only"},
    {"id": "AC6-P2-005", "severity": "P2", "title": "A listing above the cap is still reported as a spawn failure", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:150", "dimension": "maintainability", "findingClass": "instance-only"}
  ],
  "remediationWorkstreams": [],
  "specSeed": [
    "Say in phase 035 which suite configs the per-run temp folder covers, or extend it to both.",
    "State in phase 032 that an over-cap listing still reports as spawn_failed, or give it its own code."
  ],
  "planSeed": [
    "Copy the eight-line TMPDIR block into vitest.stress.config.ts.",
    "Assert the >1 MiB listing inside the 6,000-file regression test.",
    "Branch on ENOBUFS in the builder's git() and throw listing_too_large."
  ],
  "findingClasses": ["instance-only", "class-of-bug"],
  "affectedSurfacesSeed": ["vitest.config.ts: per-run TMPDIR", "lib/metrics.ts durable root", "CI cancellation", "Windows runtime support", "vitest.stress.config.ts", "skill-advisor-stress workflow", "command-behaviour-guards arena builder block", "prepare-behaviour-arena git buffer", "regression coverage", "arena builder failure codes", "operator diagnosis"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Finding class | Disposition |
|----|----------|-------|-----------|-----------|---------------|-------------|
| AC6-P2-001 | P2 | The per-run temp folder is removed on a clean exit only | correctness | `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16` | instance-only | active, advisory |
| AC6-P2-002 | P2 | The suite isolation sets only the variable POSIX reads | correctness | `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14` | instance-only | active, advisory |
| AC6-P2-003 | P2 | The isolation lever reaches one of the two suite configs | traceability | `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14` | class-of-bug | active, advisory |
| AC6-P2-004 | P2 | The buffer regression test never asserts the premise it guards | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:755` | instance-only | active, advisory |
| AC6-P2-005 | P2 | A listing above the cap is still reported as a spawn failure | maintainability | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:150` | instance-only | active, advisory |

Evidence and fix-completeness detail for each row is in the iteration narrative that raised it: `iterations/iteration-001.md` (AC6-P2-001, AC6-P2-002), `iteration-002.md` (AC6-P2-003) and `iteration-003.md` (AC6-P2-004, AC6-P2-005). The reducer owns `deep-review-findings-registry.json`; its `dimension` field falls back to the first reviewed dimension for every row, so the dimension column above follows the iteration that raised each finding instead.

## 4. Remediation Workstreams

P0: none.

P1: none.

P2 advisories, ordered by cost:

1. **Cover the second suite config** (AC6-P2-003) — copy the TMPDIR block into `vitest.stress.config.ts`, or move it into a helper both configs import. This is the only advisory whose absence re-opens a closed phase's invariant.
2. **Make the exit path complete or honest** (AC6-P2-001) — add `SIGINT`/`SIGTERM` cleanup that re-raises, or state in the comment that a cancelled run leaves the folder.
3. **Set the temp variables together** (AC6-P2-002) — assign `TMPDIR`, `TMP` and `TEMP` the way the spec-kit test setup already does.
4. **Assert the test premise** (AC6-P2-004) — measure the listing and assert it passes 1 MiB before building.
5. **Name the ceiling** (AC6-P2-005) — map `ENOBUFS` to a `listing_too_large` failure code.

## 5. Spec Seed

- Phase 035: say the isolation covers `vitest.config.ts` only, or widen it to `vitest.stress.config.ts` and restate the handoff criterion as covering both suite entry points.
- Phase 035: note that a signal-terminated run leaves its per-run folder, since the handoff criterion is about a completed run.
- Phase 032: record that a listing above the raised cap still reports `spawn_failed`, so the next ceiling raise does not re-run the T043 investigation.

## 6. Plan Seed

- Task: copy the per-run temp block into `vitest.stress.config.ts`; verify with `rg -n "TMPDIR" runtime/vitest*.config.ts` returning both files and with one stress test asserting `os.tmpdir()` is inside a `sav-` folder.
- Task: add a signal path to the temp cleanup; verify with a killed child process and a temp-folder listing.
- Task: set `TMPDIR`, `TMP` and `TEMP` in the config; verify with `node -p "require('os').tmpdir()"` under each platform variable.
- Task: assert the listing size in the 6,000-file test; verify the assertion fails when the loop count is halved.
- Task: throw `listing_too_large` on `ENOBUFS`; verify with a stubbed `spawnSync` result carrying `error.code = 'ENOBUFS'`.

## 7. Traceability Status

Core protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Phase 035's REQ-001 and AC-001 name `vitest.config.ts` and a per-run temp folder, and `vitest.config.ts:14-15` does exactly that. Phase 032's T053 names a raised buffer in the builder's git helper, and `prepare-behaviour-arena.mjs:144-152` carries it. |
| `checklist_evidence` | pass | 035/T002 records the failing-then-passing run and "0 sav- folders left after"; AC-001 records `SUITE 2325 passed` with unchanged shared counts; AC-005 records the removed folder. 032/T053 records the failing first run and a 52-test pass; T043 records the `ok:true` arena build at `0173020dfc2` with 22 copied trees. |

Overlay protocols: `playbook_capability` notApplicable (the playbook inspects the metrics folder after a manual hook run, which no suite config changes); `skill_agent`, `agent_cross_runtime` and `feature_catalog_code` notApplicable (no skill, agent or catalog surface is in this area's diff).

`AC_COVERAGE`: **exempt**. The review target `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` carries no `acceptance-criteria.md` or `implementation-summary.md` at its root; the phase children that own checklists are outside this lineage's declared scope.

## 8. Deferred Items

- Running the vitest suites or an arena build from this lineage: both write outside the lineage folder, so every claim was verified by reading the code, the recorded rows and a direct `spawnSync`/`mkdtemp` probe. A live suite run would add no evidence the reproduction does not already give for these two behaviours.
- The Windows reach of `TMPDIR` (AC6-P2-002): out of the project's tested platforms (`rg -n "win32"` over the runtime returns nothing and no workflow runs on Windows).
- The 512 MiB ceiling itself (AC6-P2-005): not reproducible here; the finding is about the diagnosis, not about a run above the cap.
- Phase 032's T053 verify clause that accepts "a refusal that is not `spawn_failed`": not reported, because T043 records the stronger `ok:true` build.

## Dimension Expansion Map

- Saturated directions: correctness, traceability, maintainability, plus a security read of the two boundaries the diff touches.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Selected review directions: the per-run temp folder and its exit path; the git buffer and its listing consumers; the regression test's premise; the failure code above the cap; the packet claims behind both changes.
- Remaining frontier: none recorded; the loop stopped at `maxIterations=3` with no active P0 or P1.

## 9. Search Ledger

- `searchCoverage`: covered `resource_lifecycle`, `platform_env_variable`, `claim_scope_drift`, `test_premise_not_asserted`, `failure_code_diagnosis`; ruled out `input_size_overflow`, `socket_path_length`, `second_entry_point`, `checklist_evidence_gap`, `private_temp_mode`, `dotenv_copy_filter`; blocked `buffer_ceiling_reproduction`; deferred none.
- `candidateCoverage`: 11 bug classes seen across three iterations; 5 carried findings, 5 ruled out, 1 blocked.
- `searchDebt`: none (`searchDebtCount` 0 from the reducer). The blocked ceiling reproduction is a stated limit, not debt: no repository fixture can reach 512 MiB of paths.
- `ruledOutCandidates`: unchanged listing truncation, socket-path overflow from a longer temp path, an arena fix closed without an arena build, a second suite entry point that already carries the lever, a private-mode regression, a dotenv leak through the larger read.
- `cleanSearchProof`: `git()` throws on `result.error`, so an overflow cannot be read as a short listing; `mkdtempSync` creates mode `0700`; the copy filter is untouched by the diff.

## Audit Appendix

- **Convergence summary**: 3 iterations, stop reason `maxIterationsReached`; newFindingsRatio 1.0 → 0.3333 → 0.4; reducer convergenceScore 0.6; threshold 0.1 not reached, so the loop stopped at the configured ceiling rather than claiming convergence.
- **Coverage summary**: configured dimensions covered per the reducer (`correctness`, `security`, `traceability`, `maintainability`); files reviewed 3 of 3 scope paths plus 5 integration surfaces.
- **Ruled-out claims**: see the Search Ledger and `ruledOut` rows in `deltas/iter-001.jsonl`, `iter-002.jsonl` and `iter-003.jsonl`.
- **Sources reviewed**: `review/review-brief-6.txt`, `review/review-scope-6.txt`, the three scope diffs, the three files at `85550ee946e`, `runtime/lib/metrics.ts`, `.skilled/bin/lib/launcher-ipc-bridge.cjs`, both vitest configs, `runtime/package.json`, `.github/workflows/skill-advisor-stress.yml`, `035-suite-metrics-and-start-shape/*`, `032-review-pass-five-remediation/{tasks.md,acceptance-criteria.md}`, and the `.opencode` mirror of both configs and the builder.
- **Core Protocols**: `spec_code` pass, `checklist_evidence` pass.
- **Overlay Protocols**: `playbook_capability` notApplicable, `skill_agent` notApplicable, `agent_cross_runtime` notApplicable, `feature_catalog_code` notApplicable.
- **Cross-reference integrity**: every `[SOURCE: …]` path in the three iteration narratives was read in this session; no path was inferred.
- **Known limit**: the reducer's `dimension` field on the registry rows falls back to the first reviewed dimension; the report's registry table uses the true dimension per finding.

Review verdict: PASS
