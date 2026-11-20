# Deep Review Report — 007-overlay-framework-root-layout

- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash
- Artifact directory: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Iterations: 12 of 24
- Stop: `converged` (`composite_converged`, graph decision `STOP_ALLOWED`, all nine legal-stop gates pass)

## 1. Executive Summary

**Overall verdict: FAIL**

**hasAdvisories: false**

**P0/P1/P2 counts: 0 / 2 / 5** — these are the counts the verdict used, read from the reducer-owned findings registry by `review-verdict.cjs`.

The FAIL is not driven by a P0. It is driven by the terminal `scope` gate, which `terminal-gates.cjs` reports as `fail` with reasonCode `findings-out-of-scope`. The cause is a scope-declaration mismatch, not a code defect: this lineage's immutable config declares `reviewTargetType: "spec-folder"` with `reviewTarget: "specs/system-skilled-doctor/007-overlay-framework-root-layout"` and an empty `reviewScopeFiles`, so the only scope entry the gate can build is the packet folder itself. Six of the seven open findings sit on the code the packet describes — `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` and `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` — which is exactly where the dispatch's `review_focus` points the review. The seventh, `R6-P2-001`, is inside the packet folder. Every finding is inside the review scope the dispatch declared; none is inside the scope the config recorded. The gate is reported as it computed, not relabelled.

**Self-check outcomes.** The adversarial self-check re-read both active P1 findings against source and confirmed both at P1. No finding was downgraded and none was called a false positive, so `selfcheck_adjudications` is empty and no `claim_adjudication` row was appended.

- `R1-P1-001` — Hunter: re-read `overlay-engine.cjs:6340-6396`. The `try`/`catch` covers only `planRelayoutManifest` (`:6362-6367`); the rename loop (`:6384-6389`) and `writeRelayoutManifest` (`:6391`) are unguarded. Skeptic: could the backup in `relayout-runs/` make this P2? No — the backup restores bytes, not the invariant the code's own comment at `:6356-6358` states, and the operator is left with a folder whose manifest names paths that no longer exist. Referee: confirmed P1.
- `R2-P1-001` — Hunter: re-read `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:83-118`. `HAS_OVERLAYS=0` at `:85`, set to 1 only when `$TREE_ROOT/../overlays/overlay-manifest.json` exists (`:86-88`); the whole overlay block (`:95-116`) is gated on it and the hook exits 0 at `:118` with no output. Skeptic: is a missing folder an operator error the hook need not catch? No — `005-barter-move-overlays-out-of-tree/spec.md:64` names this exact silent skip as the defect the phase exists to fix. Referee: confirmed P1.

**Review scope summary.** Twelve iterations over four dimensions (correctness, security, traceability, maintainability) and three frontier nodes, all answered. The review covered the overlay engine's `framework/` + `root/` source layout and its `apply --relayout` migration, the sibling `overlayDir` gate, the Barter hooks that learn both overlay locations, the Barter re-pin parity against Skilled `063daaee2c1`, and the packet's own six completion criteria. Two criteria were executed live this run: `status --json` reports `PASSED` with an empty `offLayout`, and `--guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 naming `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.

**Operator review focus.** Review the whole overlay framework/root layout change end to end: Skilled commits 57c01fb4c11..d42bafc890c, merged as 063daaee2c1 plus 1653734af7d and 10c36989450 on main; and ai-speckit (/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit) commits 64cfee51628..ad3246feba2 (re-pin, relayout, hooks learning both locations, the move to overlays/). Check engine correctness, path safety and hook fail-open or fail-closed behavior, the migration for old-layout consumers, test strength, docs against code, and any leftover reference to the old barter-overlays path.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL and two P1 findings remain active.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "R1-P1-001",
      "severity": "P1",
      "title": "Relayout leaves a half-moved overlay folder when a rename or the manifest write fails after the first move",
      "dimension": "correctness",
      "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs",
      "line": 6384,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    },
    {
      "id": "R2-P1-001",
      "severity": "P1",
      "title": "The commit gate silently skips every overlay check when the overlay folder is not found",
      "dimension": "correctness",
      "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit",
      "line": 85,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    },
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "title": "The LAYOUT overflow line advises apply --relayout even when the entries it counts are ones relayout refuses",
      "dimension": "correctness",
      "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs",
      "line": 3658,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    },
    {
      "id": "R2-P2-001",
      "severity": "P2",
      "title": "No test covers the pre-commit git hook overlay lookup or its skip branch",
      "dimension": "correctness",
      "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit",
      "line": 85,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    },
    {
      "id": "R6-P2-001",
      "severity": "P2",
      "title": "The phase 002 spec's adoptSource evidence pointers no longer resolve, and its caller count is stale",
      "dimension": "traceability",
      "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md",
      "line": 109,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    },
    {
      "id": "R8-P2-001",
      "severity": "P2",
      "title": "The doctor overlay presentation asset documents only one of the two LAYOUT remedies the engine emits",
      "dimension": "maintainability",
      "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt",
      "line": 87,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    },
    {
      "id": "R11-P2-001",
      "severity": "P2",
      "title": "The strict-write refusal tells an operator to create a copy for a path the overlay removes, and apply never installs it",
      "dimension": "correctness",
      "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs",
      "line": 5552,
      "findingClass": "UNKNOWN",
      "scopeProof": "UNKNOWN",
      "affectedSurfaceHints": "UNKNOWN"
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "severity": "P1",
      "findingIds": ["R1-P1-001"],
      "action": "Extend the relayout guard so a rename or manifest-write failure after the first move restores the moved copies and leaves the manifest naming the old paths, or refuses before the first rename."
    },
    {
      "order": 2,
      "severity": "P1",
      "findingIds": ["R2-P1-001"],
      "action": "Make the pre-commit hook fail closed when the overlay folder is absent, or print an explicit skip line naming the missing path, so a misconfigured checkout cannot commit silently."
    },
    {
      "order": 3,
      "severity": "P2",
      "findingIds": ["R1-P2-001", "R8-P2-001"],
      "action": "Make the LAYOUT overflow line and the doctor presentation asset name both remedies the engine emits, including the root/skilled case."
    },
    {
      "order": 4,
      "severity": "P2",
      "findingIds": ["R11-P2-001"],
      "action": "Stop offering the create-it-as remedy for a path on an entry's remove list, and name the remove list instead."
    },
    {
      "order": 5,
      "severity": "P2",
      "findingIds": ["R2-P2-001"],
      "action": "Add a test that exercises the pre-commit hook's overlay lookup, its skip branch and its refusal branch."
    },
    {
      "order": 6,
      "severity": "P2",
      "findingIds": ["R6-P2-001"],
      "action": "Refresh the phase 002 spec's adoptSource line pointers and its caller count."
    }
  ],
  "specSeed": [
    "Record the relayout failure contract: which failures refuse before the first rename and which restore after it.",
    "Record the pre-commit hook's behaviour when the overlay folder is absent, as a stated fail-closed or announced-skip rule.",
    "State the two LAYOUT remedies in the spec's diagnostic section so the asset and the engine cannot drift apart.",
    "Correct the phase 002 spec's adoptSource pointers and caller count."
  ],
  "planSeed": [
    "Wrap the relayout rename loop and manifest write in the same guard the planning failure already uses, and add a test that injects a rename failure.",
    "Change the pre-commit hook's HAS_OVERLAYS branch to fail closed or print an explicit skip line, and add a hook test.",
    "Emit the root/skilled remedy from the LAYOUT overflow line and document both forms in doctor-overlay-presentation.txt.",
    "Branch strictWriteRefusal on whether the matched path is on the entry's replace or remove list.",
    "Re-derive the phase 002 spec's adoptSource line numbers and caller count from the current engine."
  ],
  "findingClasses": ["UNKNOWN"],
  "findingClassesNote": "The reducer-owned registry carries findingClass: null for all seven open findings and the delta finding rows carry no class field, so the packet marks the field UNKNOWN rather than inferring it. The iteration narratives record the classes: R1-P1-001 partial-failure, R2-P1-001 fail-open-without-signal, R1-P2-001 misleading-remedy, R2-P2-001 test-gap, R6-P2-001 stale-evidence-pointer, R8-P2-001 docs-code-drift, R11-P2-001 misleading-remedy.",
  "affectedSurfacesSeed": ["UNKNOWN"],
  "affectedSurfacesSeedNote": "The reducer-owned registry carries affectedSurfaceHints: [] for all seven open findings, so the packet marks the field UNKNOWN. The iteration narratives name the surfaces per finding.",
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

The reducer-owned registry carries `findingClass: null`, `scopeProof: null` and `affectedSurfaceHints: []` for every open finding. The values below are quoted from the iteration narratives that raised them and are marked as narrative evidence, not reducer state.

### P1

**R1-P1-001 — Relayout leaves a half-moved overlay folder when a rename or the manifest write fails after the first move**

- Dimension: correctness
- Location: `.skilled/commands/doctor/scripts/overlay-engine.cjs:6384-6392`
- Evidence: the `try`/`catch` at `:6362-6367` wraps only `planRelayoutManifest`. The rename loop at `:6384-6389` (`fs.mkdirSync` then `fs.renameSync`) and `writeRelayoutManifest` at `:6391` are unguarded. `main`'s catch at `:6497-6502` prints the error and returns 2.
- Impact: an EACCES, ENOSPC or EIO during the rename loop leaves some copies at their layout paths while the manifest still names the old ones. The code's own comment at `:6356-6358` states the invariant that this must not happen; it is enforced only for the planning failure.
- Fix: extend the guard to the rename loop and the manifest write, restoring the moved copies on failure, or refuse before the first rename when the destination is not writable.
- Disposition: active
- Finding class (narrative): `partial-failure`
- Scope proof (narrative): inside the declared review target's engine; names the exact guard, the exact unguarded statements and the exact catch that swallows the failure.
- Affected surface hints (narrative): `overlay-engine.cjs:6356-6367,6384-6392,6497-6502`; `relayout-runs/` backup records; `references/overlays.md`.

**R2-P1-001 — The commit gate silently skips every overlay check when the overlay folder is not found**

- Dimension: correctness
- Location: `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-92`
- Evidence: `HAS_OVERLAYS=0` at `:85`, set to 1 only when `$TREE_ROOT/../overlays/overlay-manifest.json` exists (`:86-88`). The overlay block at `:95-116` is gated on `HAS_OVERLAYS -eq 1`, and the hook exits 0 at `:118` with no output.
- Impact: a checkout whose overlay folder is missing, moved or misnamed commits with no overlay check and no message. `005-barter-move-overlays-out-of-tree/spec.md:64` names this exact behaviour as the defect the phase exists to fix, and `overlays/README.md:47` never mentions it.
- Fix: fail closed when the folder is absent, or print an explicit skip line naming the path that was looked for.
- Disposition: active
- Finding class (narrative): `fail-open-without-signal`
- Scope proof (narrative): inside the declared review target's Barter hook; names the exact variable, the exact gate and the exact exit.
- Affected surface hints (narrative): `pre-commit:83-118`; `overlays/README.md:47`; `005-barter-move-overlays-out-of-tree/spec.md:64,111`.

### P2

**R1-P2-001 — The LAYOUT overflow line advises `apply --relayout` even when the entries it counts are ones relayout refuses**

- Dimension: correctness
- Location: `.skilled/commands/doctor/scripts/overlay-engine.cjs:3658-3660`
- Evidence: the overflow line at `:3659` always says `run apply --relayout`, while the per-line remedy at `:3652-3655` branches on `isUnderRootSkilled`.
- Impact: a tail of `root/skilled` entries sends the operator to a command that refuses the whole run.
- Fix: branch the overflow line the same way the per-line remedy does.
- Disposition: active
- Finding class (narrative): `misleading-remedy`
- Scope proof (narrative): inside the declared review target's engine; names the exact line and the branch it ignores.
- Affected surface hints (narrative): `overlay-engine.cjs:3652-3660`; `assets/doctor-overlay-presentation.txt:87,115`.

**R2-P2-001 — No test covers the pre-commit git hook overlay lookup or its skip branch**

- Dimension: correctness
- Location: `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85`
- Evidence: `rg -l "HAS_OVERLAYS"` over `barter/ai-speckit` outside `specs/` and `repin-runs/` returns only the hook. The spec's hook-test row at `005-barter-move-overlays-out-of-tree/spec.md:111` lists four test files, none exercising it.
- Impact: the skip branch that `R2-P1-001` reports is untested, so a fix has no regression guard.
- Fix: add a hook test covering the lookup, the skip branch and the refusal branch.
- Disposition: active
- Finding class (narrative): `test-gap`
- Scope proof (narrative): inside the declared review target's Barter hook and its test surface.
- Affected surface hints (narrative): `pre-commit`; `005-barter-move-overlays-out-of-tree/spec.md:111`.

**R6-P2-001 — The phase 002 spec's `adoptSource` evidence pointers no longer resolve, and its caller count is stale**

- Dimension: traceability
- Location: `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:109`
- Evidence: `spec.md:63,109` place `adoptSource` at `:5399-5401`; it is at `:5484-5488`. `layoutMoves` at `:3371` is now `:3406` (call at `:3415`). Strict-write hints at `:5465`/`:5469` are now `:5558`/`:5562`. `hasOverlayCopy` at `:5544` is now `:5639`. `plan.md:43,62` repeat the same numbers. Spec and `implementation-summary.md:64` say six callers; `rg -n 'adoptSource\('` returns eight call sites.
- Impact: a reader following the spec's evidence lands on unrelated code, and the caller count understates the change's blast radius.
- Fix: re-derive the pointers and the caller count from the current engine.
- Disposition: active
- Finding class (narrative): `stale-evidence-pointer`
- Scope proof (narrative): inside the declared review target's packet; names every stale pointer and the current line.
- Affected surface hints (narrative): `002-engine-framework-root-source-layout/spec.md:63,109`; `plan.md:43,62`; `implementation-summary.md:64`.

**R8-P2-001 — The doctor overlay presentation asset documents only one of the two LAYOUT remedies the engine emits**

- Dimension: maintainability
- Location: `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87,115`
- Evidence: the asset documents only `run ... apply --relayout`. `grep -n "root/skilled\|change the destination"` over the asset returns nothing, while `references/overlays.md:96` and `changelog/v1.2.0.0.md:31` document the second form the engine emits at `overlay-engine.cjs:3652-3655`.
- Impact: an operator reading the presentation asset learns one of two remedies. Shares a root cause with `R1-P2-001` but is a separate artifact.
- Fix: document both remedies in the asset.
- Disposition: active
- Finding class (narrative): `docs-code-drift`
- Scope proof (narrative): inside the declared review target's doctor assets; names the exact lines and the code they omit.
- Affected surface hints (narrative): `assets/doctor-overlay-presentation.txt:87,115`; `references/overlays.md:96`; `changelog/v1.2.0.0.md:31`.

**R11-P2-001 — The strict-write refusal tells an operator to create a copy for a path the overlay removes, and `apply` never installs it**

- Dimension: correctness
- Location: `.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556`
- Evidence: `managedPathTest` (`:4385-4388`) pushes both `replace` and `remove` relative paths into managed prefixes for a `skill-root` entry. `strictWriteRefusal` then prints `refuse: <key> is a new file inside overlay <id>; create it as <overlay>/<source>/<relative>, then run <engine> apply`. The `sk-git-root` manifest entry lists `sk-git-skilled` under `remove`, not `replace`, and the file does not exist in the tree.
- Impact: the packet's own `--guard` criterion reaches this branch. An operator who follows the printed remedy creates an overlay copy that `apply` never installs, and the next write is refused again.
- Fix: branch the remedy on whether the matched path is on the entry's `replace` or `remove` list.
- Disposition: active
- Finding class (narrative): `misleading-remedy`
- Scope proof (narrative): inside the declared review target's engine; names the exact branch, the exact manifest entry and the exact criterion that reaches it.
- Affected surface hints (narrative): `overlay-engine.cjs:4385-4388,5552-5556`; `overlay-manifest.json` `sk-git-root` entry; `references/overlays.md:51`.

## 4. Remediation Workstreams

**P1 — blocking**

1. **Relayout atomicity** (`R1-P1-001`). Extend the guard that already protects `planRelayoutManifest` to the rename loop and the manifest write. Either restore the moved copies on failure or refuse before the first rename. Add a test that injects a rename failure mid-loop.
2. **Pre-commit fail-open** (`R2-P1-001`). Make the hook fail closed when the overlay folder is absent, or print an explicit skip line naming the path it looked for. The phase 005 spec already names this behaviour as the defect to fix, so the fix is a spec-alignment change, not a new decision.

**P2 — advisories**

3. **LAYOUT remedy consistency** (`R1-P2-001`, `R8-P2-001`). Branch the overflow line on `isUnderRootSkilled` the way the per-line remedy already does, and document both forms in `doctor-overlay-presentation.txt`.
4. **Strict-write remedy** (`R11-P2-001`). Branch the remedy on the entry's `replace` versus `remove` list.
5. **Hook test** (`R2-P2-001`). Cover the lookup, the skip branch and the refusal branch.
6. **Phase 002 spec refresh** (`R6-P2-001`). Re-derive the `adoptSource` pointers and the caller count.

## 5. Spec Seed

- Record the relayout failure contract: which failures refuse before the first rename, which restore after it, and what the operator sees.
- Record the pre-commit hook's behaviour when the overlay folder is absent as a stated rule — fail closed, or skip with a named path.
- State both LAYOUT remedies in the spec's diagnostic section so the asset and the engine cannot drift apart.
- Correct the phase 002 spec's `adoptSource` pointers and its caller count from the current engine.

## 6. Plan Seed

- Wrap the relayout rename loop and manifest write in the guard the planning failure already uses; add a failure-injection test.
- Change the pre-commit `HAS_OVERLAYS` branch to fail closed or announce the skip; add a hook test.
- Emit the `root/skilled` remedy from the LAYOUT overflow line and document both forms in the presentation asset.
- Branch `strictWriteRefusal` on the matched entry's `replace` versus `remove` list.
- Re-derive the phase 002 spec's line pointers and caller count.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` | pass | `barter/ai-speckit/skilled/.skilled-overlays.json`; `barter/ai-speckit/skilled/barter-overlays`; `.skilled/skills/system-skilled-doctor/SKILL.md:5`; `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md` | None. Criteria 2, 3 and 5 hold on the tree as it stands. |
| `checklist_evidence` | pass | `.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556`; `barter/ai-speckit/overlays/overlay-manifest.json`; `barter/ai-speckit/skilled/.skilled-overlays.json` | Criterion 4 executed: `status --json` reports `PASSED` with `offLayout: []` and `check` 135/135. Criterion 5 executed: `--guard` exits 1 naming `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`. The remedy wording on that line is wrong and is carried as `R11-P2-001`. |

`unfinishedCoreProtocols: []`. `gatingFailures: 0`.

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `skill_agent` | pass | `barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:1-11` | None. The release entry carries the frontmatter the changelog convention requires. |
| `agent_cross_runtime` | not run | — | Not applicable to this target: the change ships no agent definition. |
| `feature_catalog_code` | not run | — | Not applicable: the change ships no feature catalog entry. |
| `playbook_capability` | not run | — | Not applicable: the change ships no playbook. |

### AC_COVERAGE

`exempt` — the target is a spec-folder packet whose acceptance criteria live in the phase specs, not in an `acceptance-criteria.md`; the six completion criteria in the durable directive were traced instead, and two of them were executed live this run.

## 8. Deferred Items

- **Engine suite exit code (criterion 1).** `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` was not run: the suite writes to OS temp directories, outside this lineage's write surface. Test strength was judged from the suite source and the recorded evidence under the phases' `scratch/evidence/`.
- **`validate.sh --recursive --strict` (criterion 6).** Forbidden by the dispatch, which names it as an out-of-scope write.
- **`agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.** Not applicable to this target; recorded rather than silently omitted.
- **Terminal `scope` gate.** Fails on the config's empty `reviewScopeFiles` plus a `spec-folder` review target. The config is immutable after init, so the gate is reported as computed. A future run of this packet should declare the code paths in `reviewScopeFiles` at init.

## Dimension Expansion Map

- Saturated directions: none recorded (`divergence.saturatedDirections: []`).
- Completed pivots: none (`divergence.completed: []`).
- Failed pivots: none (`divergence.failed: []`).
- Audited overrides: none (`divergence.overrides: []`).
- Council artifact references: none.
- Selected review directions: correctness, security, traceability, maintainability — all four covered (`dimensionCoverage` all true).
- Remaining frontier: none. `F-1-003`, `F-1-005` and `F-1-007` are all `answered`; `frontierOpen: 0`, `frontierTotal: 3`, `frontierAnswered: 3`.

This section records breadth only and does not alter the verdict, `hasAdvisories`, the finding registry or the self-check results.

## 9. Search Ledger

**searchCoverage**

- `requiredBugClasses`: `misleading_remedy`, `criterion_failure`, `stale_setting_file`
- `covered`: `misleading_remedy`, `criterion_failure`, `stale_setting_file`
- `ruledOut`: `criterion_failure`, `stale_setting_file`
- `deferred`: `engine suite exit code`, `validate.sh --recursive --strict`
- `blocked`: none
- `graphCoverageMode`: `graphless_fallback`

**candidateCoverage**: 31 bug classes covered, 23 ruled out, 0 deferred, 0 blocked. The covered set includes `copy_drift`, `dangling_symlink`, `diagnostic_consistency`, `docs_code_drift`, `fail_open_on_missing_input`, `fail_open_without_signal`, `guard_scope_mismatch`, `hand_maintained_link`, `link_map_disagreement`, `misleading_remedy`, `partial_failure`, `path_traversal`, `pin_record_disagreement`, `record_shape_gap`, `requirement_code_mismatch`, `stale_caller_count`, `stale_command_reference`, `stale_evidence_pointer`, `stale_folder_tree`, `stale_old_layout_path`, `stale_setting_file`, `symlink_escape`, `test_gap`, `undocumented_default`, `undocumented_output_form`, `unrecorded_blocker`, `unsupported_release_claim`, and the three frontier ids.

**searchDebt**: none. `hasSearchDebt: false`.

**ruledOutCandidates**: 37 rows across twelve iterations, each with a bug class, a rationale and `path:line` evidence. They include the path-containment scope question (`SL-003`), relayout state transitions (`SL-004`), overlay copy drift (`SL-007`), guard path resolution (`SL-008`), the vendored parity set (`SL-009`), the changelog link ownership correction (`SL-039`), and the setting-file and criterion checks (`SL-041`, `SL-042`, `SL-043`).

**cleanSearchProof**: the same 37 ruled-out rows, each carrying a `proof` field naming the evidence that closed it.

## 10. Audit Appendix

### Convergence Summary

- Iterations: 12 of 24. `minIterations: 2` satisfied.
- Stop: `converged`, reasonDetail `composite_converged`, `weightedStopScore` 0.7, `stuckCount` 1, `consecutiveFailureCount` 0.
- Graph decision: `STOP_ALLOWED`. Graph: 104 nodes, 113 edges. Signals: `dimensionCoverage` 1, `findingStability` 1, `p0ResolutionRate` 1, `evidenceDensity` 1, `hotspotSaturation` 1, `score` 1.
- All nine legal-stop gates pass: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, `graphlessFallbackGate`.
- Terminal gates: `evidence` pass (`all-findings-cited`), `scope` **fail** (`findings-out-of-scope`), `coverage` pass (`coverage-complete`). `failedRequiredGateIds: ["scope"]`.
- Release readiness state: `in-progress` (no active P0, but the verdict is not PASS or CONDITIONAL).

### Coverage Summary

| Dimension | Covered | Iterations |
|-----------|---------|------------|
| correctness | yes | 1, 2, 3 |
| security | yes | 4, 5 |
| traceability | yes | 6, 7, 12 |
| maintainability | yes | 8, 9, 10 |

Iterations 11 and 12 were recovery and consolidation passes: 11 verified the packet's completion criteria and found `R11-P2-001`; 12 executed criteria 4 and 5 live and closed `checklist_evidence` on executed evidence.

### Ruled-Out Claims

The 37 `ruledOutCandidates` rows are the ruled-out set. The load-bearing ones:

- **The sibling `overlayDir` gate is bypassable.** Ruled out: `resolveOverlayDir` is symlink-aware and tested with 5 accepted and 8 refused spellings plus 5 link cases.
- **The guard passes an uncanonicalised target.** Ruled out: `guard` passes an absolute canonical target.
- **The Barter re-pin drifted from Skilled `063daaee2c1`.** Ruled out: symlink-aware parity over the four engine-relevant trees gives same=317, diff=6, missing=0, and all six diffs are declared overlay-owned.
- **A leftover reference to the old `barter-overlays` path survives.** Ruled out: `grep -rnP "(?<!-)barter-overlays"` over `barter/ai-speckit` excluding `specs/`, `.index/`, `node_modules/`, `dist/`, `repin-runs/`, `.git/` and changelogs returns zero lines.
- **The two changelog links are hand-maintained.** Ruled out and corrected: `layoutLinks` (19) equals `sync-state.links` (19) and every target matches, so both links are engine-managed. This corrects iteration 3's edge case.
- **The setting file names a folder other than `../overlays`.** Ruled out: it holds exactly `{ "overlayDir": "../overlays" }`.
- **Criteria 4 and 5 fail.** Ruled out by execution: `status --json` reports `PASSED` with `offLayout: []`; `--guard` exits 1 naming a source under `../overlays/framework/`.

### Sources Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs` (6544 lines) and `.skilled/commands/doctor/scripts/tests/`
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`
- `.skilled/skills/system-skilled-doctor/SKILL.md`, `changelog/v1.2.0.0.md`, `references/overlays.md`
- `barter/ai-speckit/overlays/` — `overlay-manifest.json`, `sync-state.json`, `README.md`, `framework/`, `root/`, `checks/`, `tests/`
- `barter/ai-speckit/skilled/.skilled-overlays.json`, `barter/ai-speckit/skilled/.skilled/commands/doctor`, `barter/ai-speckit/skilled/.opencode`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/` — the packet and its five phase specs, plans and implementation summaries
- Git history read-only: Skilled `57c01fb4c11..d42bafc890c`, `063daaee2c1`, `1653734af7d`, `10c36989450`; `git -C barter/ai-speckit` `64cfee51628..ad3246feba2`

### Cross-Reference Appendix

**Core Protocols**

- `spec_code` — pass. The packet's decisions D1–D6 and the six completion criteria were traced to the artifacts that satisfy them.
- `checklist_evidence` — pass. Criteria 2, 3, 4 and 5 were verified; 4 and 5 were executed live. Criteria 1 and 6 are deferred with reasons.

**Overlay Protocols**

- `skill_agent` — pass. The `v4.1.0.0` release entry carries the required frontmatter.
- `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` — not applicable to this target.

### Run Integrity Notes

- Every state record went through `append-mode-event.cjs`; the ledger holds 15 events (1 config row, 12 iteration rows, 1 graph-convergence row, 1 terminal-gates row). The `deep-review-state.jsonl` projection was never written directly.
- The coverage graph was seeded late: `step_graph_upsert` had not run for iterations 1–11, so `hotspotSaturationGate` could not evaluate until iteration 12 backfilled the graph from each iteration's own record. Recorded because a graphless review run otherwise reaches its iteration cap with that gate permanently blocked.
- No file outside `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max` was created, modified or deleted. `generate-context.js`, `validate.sh` and every git write command were not run.
