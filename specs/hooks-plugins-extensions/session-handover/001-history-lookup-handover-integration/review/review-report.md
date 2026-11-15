# Deep Review Report: History Lookup Engine Move

## 1. Executive Summary

- **Verdict: CONDITIONAL.** No P0 and no P1 is active. Seven P2 advisories are active, and one search-debt item (SL-510) stays open, which holds the verdict at CONDITIONAL under the search-ledger rule. Without that debt the verdict would be PASS with advisories.
- **hasAdvisories:** true. **hasSearchDebt:** true.
- **Active counts:** P0=0, P1=0, P2=7.
- **The one P1 the loop raised is a false positive.** I1-P1-001 claimed the CI engine step cannot resolve `tsc` on a clean runner. The synthesis self-check found that its premise is wrong. `.opencode/skills` is a tracked symlink (git mode 120000) to `../.skilled/skills`, so the `npm ci` of `.opencode/skills/system-spec-kit` that runs earlier in the same `runtime-vitest` job installs into `.skilled/skills/system-spec-kit/node_modules`. Its lockfile carries `typescript` 5.9.3 as a dev dependency, and the workflow never omits dev dependencies. That is the finding's own downgrade trigger. The claim is resolved from the workflow text: the step has still not run on GitHub.
- **Scope:** the 63 files changed in commits `169da2e8cba..1c7bc3d9d63`. They cover the history lookup engine move into `.skilled/hooks/session-handover/history/`, its callers, CI, provisioning, the freshness registry, docs and the phase 008 plan. There were 10 iterations on DeepSeek V4.1 Flash (LLM Gateway, `deepseek-v4.1-flash-1017`, reasoning effort max) as a single lineage. Stop reason: maxIterationsReached. Stop policy: max-iterations.
- **Operator review focus:** Known residuals to check: (1) a repo-wide sweep for any live reference to the old engine path .skilled/skills/system-spec-kit/runtime/hooks/lib/history/ in code, tests, CI, docs and provisioning; (2) .github/workflows/spec-kit-check.yml engine step has never run on GitHub, so check it would pass as written; (3) .skilled/hooks/shared/tests/session-readers/project.test.mjs turns a missing schema file into a silent skip; (4) the pinned 66-character quoted session-id bound in hook-state.ts must equal the engine bound. The phase 1 harness hop-recall.sh line 18 still naming the old path is already known and owned by phase 008 task T002, so record it as known, not as a new finding.
- **How each residual came out:**
  1. The old-path sweep is clean. Live imports all resolve to the moved engine or the runtime dist. Only historical prose and the known `hop-recall.sh:18` line remain (SL-001).
  2. The engine step should pass as written, once the false-positive P1 is set aside. It does not start for engine-only commits, though (I1-P2-002).
  3. The silent skip is confirmed (I1-P2-003).
  4. The two bounds are equal today at 66 with the same quoting, but only one direction is pinned by a test (I1-P2-004).

## 2. Planning Trigger

`/speckit:plan` is required, because the verdict is CONDITIONAL. All the remediation is P2 hardening and documentation drift. Nothing blocks a release.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "hasSearchDebt": true,
  "activeFindings": [
    {"id": "I1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".github/workflows/spec-kit-check.yml", "line": 6, "findingClass": "matrix/evidence"},
    {"id": "I1-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/shared/tests/session-readers/project.test.mjs", "line": 141, "findingClass": "test-isolation"},
    {"id": "I1-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts", "line": 276, "findingClass": "cross-consumer"},
    {"id": "I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/hooks/session-handover/history/lib/lookup-offer.ts", "line": 70, "findingClass": "cross-consumer"},
    {"id": "I3-P2-001", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md", "line": 185, "findingClass": "instance-only"},
    {"id": "I3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md", "line": 147, "findingClass": "instance-only"},
    {"id": "I3-P2-003", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md", "line": 18, "findingClass": "cross-consumer"}
  ],
  "remediationWorkstreams": ["WS1 CI trigger and test-guard hardening", "WS2 shared-constant pinning and offer quoting", "WS3 playbook refresh", "WS4 deferred memory measurement"],
  "specSeed": ["Engine changes must run the engine suites in CI", "A missing published schema must fail the projection test", "The duplicated 66-character bound must be held equal by a test in both directions", "Every value interpolated into the lookup offer command is quoted or allowlisted", "The playbooks name the moved test paths and all six runtimes"],
  "planSeed": ["Add .skilled/hooks/** to both spec-kit-check.yml path filters", "Replace the schema skip in project.test.mjs with a failing assertion", "Export or test-read the hook-state bound and assert equality with the engine bound", "Quote or allowlist locator.runtime in buildHistoryLookupBody", "Fix the playbook Source Files rows, add Vibe at lines 147 and 166, reconcile hop-recall-conversation.md line 18 with line 22", "Measure navigator.ts eager index memory against a synthetic store"],
  "findingClasses": ["matrix/evidence", "test-isolation", "cross-consumer", "instance-only"],
  "affectedSurfacesSeed": ["spec-kit-check trigger paths", "hook-vitest-suites include glob", "project.test.mjs", "history-entry.schema.json", "hook-state HistoryLocatorSchema", "lookup-offer bound and command template", "manual-testing-playbook handoff lookup", "hop-recall scenario pair"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Seven findings are active. The reducer-generated registry and dashboard still show 2 P1 and 10 P2. The extra five are a duplicate and a false positive:

- Iteration 10 re-minted four findings under new ids. R10-P1-001 duplicates I1-P1-001, R10-P2-001 duplicates I1-P2-002, R10-P2-003 duplicates I1-P2-004 and R10-P2-004 duplicates I2-P2-001. Each has the same title, the same file and a line within three of the original.
- I1-P1-001 itself was resolved as a false positive at synthesis (section 10).

The registry is reducer-owned and was not edited.

1. **I1-P2-002 (P2, correctness): engine-only changes never run the engine vitest suites.** `.github/workflows/spec-kit-check.yml:6-44`.
   - Evidence: neither path filter lists `.skilled/hooks/**`. The always-on `hook-vitest-suites.yml` include glob (`.skilled/hooks/vitest.config.ts:40`) does not match `.vitest.ts`, the only suffix the engine collects (`history/vitest.config.ts:12`).
   - Impact: a commit that changes only engine code runs no suite that imports it.
   - Fix: add `.skilled/hooks/**` to both filters.
   - Scope proof: the only invocation of the engine tests is `spec-kit-check.yml:301-302`.
2. **I1-P2-003 (P2, correctness): the projection schema test skips when the schema file is missing.** `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142`.
   - Evidence: the code reads `if (!existsSync(SCHEMA_PATH))` and then `test('schema: not published', { skip })`.
   - Impact: a later move or delete of `history-entry.schema.json` keeps the suite green.
   - Fix: assert that the schema exists, so a missing file fails the test.
3. **I1-P2-004 (P2, correctness): the duplicated 66-character bound is pinned in one direction only.** `hook-state.ts:276-284` against `lookup-offer.ts:33`.
   - Evidence: both values are 66 with an identical quote transform. The hook-state copy is module-private, and no test reads it. The boundary cases at `history-locator.vitest.ts:154-155` cannot tell 66 from 67.
   - Impact: raising the copy alone lets the schema accept an id the offer refuses.
   - Fix: export or test-read both constants and assert them equal.
4. **I2-P2-001 (P2, security): the lookup offer interpolates the runtime label unquoted.** `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:69-70`.
   - Evidence: the session id and handle pass through `shellQuote`. `locator.runtime` is typed `string` (line 37) and inserted raw.
   - Impact: the exposure is latent. No in-tree producer passes an unsafe label, but one would become shell syntax in the receiving session.
   - Fix: quote it or allowlist the six runtime words.
   - Upgrade trigger: a producer that passes an unvalidated label.
5. **I3-P2-001 (P2, traceability): the handoff-lookup playbook points at retired test paths.** `compaction-history-lookup.md:185-186`.
   - Evidence: both listed paths fail an existence check, while their moved counterparts exist.
   - Fix: update the two Source Files rows.
6. **I3-P2-002 (P2, traceability): two capability lines drop Vibe.** `compaction-history-lookup.md:147,166`.
   - Evidence: lines 26, 30 and 93 of the same file include Vibe.
   - Fix: add Vibe to both lines.
7. **I3-P2-003 (P2, traceability): the hop-recall pair describes a hop that prints no lookup offer.** `hop-recall-conversation.md:18`.
   - Evidence: the offer withholds only when a gate fails (`lookup-offer.ts:137-143`), and the claim-offer rows at line 112 were measured with the section printed.
   - Fix: reconcile line 18 with line 22.

## 4. Remediation Workstreams

There is no P0 or P1 work. All four workstreams are P2 advisories:

1. **WS1 CI and test guards:** I1-P2-002 and I1-P2-003.
2. **WS2 shared constant and offer quoting:** I1-P2-004 and I2-P2-001.
3. **WS3 playbook refresh:** I3-P2-001, I3-P2-002 and I3-P2-003.
4. **WS4 deferred measurement:** SL-510, the eager search-index memory question in `navigator.ts:490-503`.

## 5. Spec Seed

- CI runs the engine suites whenever engine code changes.
- A missing published projection schema fails the reader contract test rather than skipping it.
- The quoted session-id bound has one source, or a test holds both copies equal.
- Every value the lookup offer writes into a shell command is quoted or allowlisted.
- The manual-testing playbooks name the moved engine test paths and all six runtimes.

## 6. Plan Seed

1. Add `.skilled/hooks/**` to the push and pull_request filters of `spec-kit-check.yml`.
2. Replace the schema skip in `project.test.mjs` with a failing existence assertion.
3. Export the hook-state bound, or read it in a test, and assert it equals `HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID`.
4. Pass `locator.runtime` through `shellQuote`, or check it against the runtime allowlist, in `buildHistoryLookupBody`.
5. Refresh the playbook rows and lines named in WS3.
6. Measure peak memory of the eager search index against a synthetic store, and raise a finding only on a measured problem.

## 7. Traceability Status

**Core protocols:**
- `spec_code`: **pass** (iterations 3 and 10). The shipped engine path matches the phase intent. The old path at the parent `spec.md:102` sits in a table that `spec.md:97-98` labels as a summary of the action taken, so it records where the move started rather than a live mismatch.
- `checklist_evidence`: **pass** (iterations 3 and 10). Phase 008 is Draft with T001 to T011 unchecked, so no completion claim exists to falsify. T002's negative check matches `hop-recall.sh:18`, which is the line it is meant to remove.

**Overlay protocols:**
- `skill_agent`: notApplicable, because no skill, command or agent definition is in the target.
- `agent_cross_runtime`: notApplicable, because no runtime mirror is in the target.
- `feature_catalog_code`: **pass**. The cap of 600, the command, the prefix rule and refusal exit 2 match the code.
- `playbook_capability`: **fail**, through I3-P2-001, I3-P2-002 and I3-P2-003.

**Machine-gate note.** `convergence.cjs` reported `dimensionCoverageGate` failing with `traceabilityCovered=false`. That came from a recording-shape gap, not a coverage gap. The leaves wrote `traceability_check` rows keyed `protocol`, plus a status map, so the reducer projected an empty `registry.traceability`. `reviewTraceabilityCovered` looks for `protocolId` entries. At the stop, the orchestrator graded the terminal coverage gate as pass, with reason `core-traceability-pass-unprojected`, from the delta rows of iterations 3 and 10.

**AC_COVERAGE:** exempt. The target is a file list, not a spec-folder target.

## 8. Deferred Items

- **SL-510:** eager search-index memory in `navigator.ts:490-503`. A read-only pass cannot measure peak memory, so no finding was raised.
- **`hop-recall.sh:18`:** the phase 1 harness still names the old engine path. This was already known, and phase 008 task T002 owns it.
- **Engine build path brittleness (advisory, not a finding):**
  - The engine's `build` and `typecheck` scripts reach `tsc` through a cross-package relative path, `../../../skills/system-spec-kit/node_modules/.bin/tsc`.
  - That path resolves in CI only because an install of the symlinked `.opencode/skills/system-spec-kit` runs earlier in the same job. That is the dependency the false-positive P1 misread.
  - A local devDependency or a workspace entry would make it explicit.
- **Tooling, review loop:** the leaf `traceability_check` row shape (`protocol`) and the reducer's expected `protocolId` disagree, so a run with full traceability coverage still fails `dimensionCoverageGate`.
- **Tooling, review loop:** the leaves re-mint finding ids when they re-confirm findings, and the reducer double-counts them (section 3).

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none recorded. Remaining frontier: none recorded.
- The convergence mode was default, so no divergent pivots ran.
- Three stuck-recovery passes ran, at iterations 6, 8 and 10:
  - Iteration 6: change granularity, aimed at correctness.
  - Iteration 8: change granularity, aimed at security.
  - Iteration 10: escalate severity review, aimed at security.
- This section records breadth only and does not alter the verdict.

## 9. Search Ledger

- **searchCoverage:**
  - Graph coverage mode: graphless_fallback.
  - Required bug classes: 9. Eight were covered: dependency path resolution, CI trigger coverage, silent test skip, duplicate constant drift, command interpolation, doc anchor drift, doc capability omission and doc internal contradiction.
  - Ruled out: severity miscalibration.
  - Deferred: none. Blocked: none.
- **candidateCoverage:** 16 candidate classes were covered.
- **searchDebt (hasSearchDebt: true):** SL-510, `unbounded_resource` in `navigator.ts`, deferred because measuring it requires executing the engine.
- **ruledOutCandidates and cleanSearchProof:**
  - SL-001: no stale path is live.
  - SL-202: path traversal. The argv session id is hashed into the state filename.
  - SL-203: trust-boundary spoof. Every gate is checked before a store is read, and ambiguity refuses rather than ranks.
  - Later rows: the transcript path is read-only, and the offer carries no transcript text.
- **Machine gates at the stop:** `candidateCoverageGate` and `graphlessFallbackGate` failed. That is consistent with the open search debt and with no cited fallback ledger rows (`fallbackCoveredBugClasses` was empty).

## 10. Audit Appendix

**Convergence summary.**
- 10 of 10 iterations completed in about 34 minutes of wall-clock time.
- newFindingsRatio by iteration: 1.0, 0.111, 0.25, 0, 0, 0, 0, 0, 0, 0.
- The stuck threshold was reached three times. Each time the loop continued under the max-iterations stop policy, with a recovery focus.
- The final stop decision was STOP with maxIterationsReached. The gates recorded as blocked at that stop were dimensionCoverageGate (the shape gap in section 7), candidateCoverageGate and graphlessFallbackGate.
- The terminal gates (evidence, scope and coverage) all passed, and none failed.

**Coverage summary.**
- All four dimensions are covered, with a coverage age of 6.
- Passes per dimension at the stop: correctness 5, security 4, traceability 6, maintainability 4.

**Adversarial self-check on P0 and P1.**
- *Hunter.* `history/package.json:11` names `../../../skills/system-spec-kit/node_modules/.bin/tsc`. The engine step at `spec-kit-check.yml:296-302` runs in `runtime-vitest`, after `npm-ci-retry.sh .opencode/skills/system-spec-kit`.
- *Skeptic.* The finding assumed `.skilled/skills/system-spec-kit` is never installed. `git ls-files -s .opencode/skills` shows mode 120000, a symlink to `../.skilled/skills`, so that install lands in the same directory.
- *Referee.* I1-P1-001 is resolved_false_positive, and so is its duplicate R10-P1-001. The downgrade trigger the finding stated was met.
- *Residual risk.* The step has never run on GitHub, so the pass is inferred from the workflow text and not observed.

**Ruled-out claims.**
- Live references to the old engine path.
- Path traversal through the session id.
- Trust-boundary spoofing in the lookup gates.
- Transcript text leaking through the offer.

**Sources reviewed.** All 63 files in the target, plus these cross-references:
- `.skilled/package.json`
- `.github/scripts/npm-ci-retry.sh`
- `.skilled/skills/system-spec-kit/package.json` and its lockfile
- `.skilled/hooks/vitest.config.ts`
- The phase 008 `spec.md`, `plan.md` and `tasks.md`

**Run deviations, recorded by the orchestrator:**
- **Run time limit.** `maxDurationMinutes` was raised from the 120 template default to 200, so that ten iterations at the 900-second executor timeout could not be cut short. The run finished in 34 minutes, so the raise turned out to be unnecessary.
- **Restart record.** It names the archived fan-out run `1794748073879-re9m5r` as `archivedLineageId`. The gateway refused the `null` the template would have produced, because the old packet had no top-level config. The prior packet is at `review-archive/20261115T173303Z`.
- **Novelty signal.** The ledger's convergence-signal shape needs a `noveltyRatio` that `convergence.cjs` does not output. The latest iteration's newFindingsRatio stood in for it, and 1 was used before the first iteration.
- **Coverage graph.** Optional leaf graph edges whose endpoints were not nodes in the same upsert batch were dropped: 4 at iteration 5, 3 at iteration 7 and 5 at iteration 8. Iteration 5's first upsert had failed on a foreign key until this filter was added. Canonical dimension and file coverage was kept every time.
- **Recovery strategy.** The change-granularity strategy ran twice, at iterations 6 and 8. The rotation counter did not see the projected `stuckRecovery` event name until iteration 10.

**Core Protocols:** `spec_code` pass, `checklist_evidence` pass.
**Overlay Protocols:** `skill_agent` notApplicable, `agent_cross_runtime` notApplicable, `feature_catalog_code` pass, `playbook_capability` fail.

Resource map: `review/resource-map.md`.
