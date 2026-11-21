# Deep Review Report: overlay framework/root layout (fan-out root)

Review of `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder), depth mode `expansive`, fan-out of two lineages: `opus-medium` (cli-claude-code, claude-opus-5-5, reasoning medium, danger-full-access) and `deepseek-flash-max` (cli-mistral-vibe, deepseek-flash). 29 iterations in total (17 + 12). Both lineages stopped on `converged`. Merge run `1795182837437-sws2tv`.

## 1. Executive Summary

- **Overall verdict: FAIL**, from `review-verdict.cjs` on the merged counts: `--active-p0 0 --active-p1 2 --active-p2 14 --search-debt 4 --failed-gate-ids ["scope"]`.
- **hasAdvisories: false**, because the verdict is not PASS.
- **P0/P1/P2 counts the verdict used: 0 / 2 / 14**, with search debt 4. These are the merged lineage counts, which the contract makes the authority on a fan-out root.
- **What drives the FAIL.** No P0 drives it. The required `scope` terminal gate failed in both lineages with `findings-out-of-scope`. `terminal-gates.cjs:168-179` builds the scope from `reviewScopeFiles` plus the spec folder. On this fan-out run `reviewScopeFiles` is `[]` in the root config, because `deep-review.yaml:434` hard-codes it, and it is also `[]` in both lineage configs. `step_scope_discovery` (`deep-review.yaml:713-745`) runs only in `phase_init`, which fan-out skips. Every finding in `.skilled/` or `barter/ai-speckit/` therefore counts as out of scope by construction, even though the operator focus asks for exactly those paths. This is a defect in the deep-review workflow, not in the reviewed change (see Deferred Items, D-1).
- **Findings-only reading.** With the scope gate set aside and the root self-check below applied, the counts are P0=0, P1=1, P2=15 with search debt 4. That gives **CONDITIONAL**.
- **Self-check outcomes (root Referee, recorded here only; a fan-out root appends no adjudication rows):**
  - `R1-P1-001`: **confirmed P1.** A re-read of `overlay-engine.cjs:6340-6396` shows the `try`/`catch` covers only `planRelayoutManifest` (`:6362-6367`). The rename loop (`:6384-6389`) and `writeRelayoutManifest` (`:6391`) are unguarded. The comment at `:6356-6358` names the half-moved state as "a folder nobody can read", and `references/overlays.md:96` documents no restore path from `relayout-runs/`.
  - `R2-P1-001`: **downgraded to P2.** A re-read of `pre-commit:83-118` confirms the silent skip: `HAS_OVERLAYS=0` and exit 0 with no output when `../overlays/overlay-manifest.json` is absent. The behaviour itself existed before this change. `git -C barter/ai-speckit show a954fc956ce^:skilled/.opencode/scripts/git-hooks/pre-commit`, lines 89-112, gated the whole overlay block on `[ -d "$TREE_ROOT/barter-overlays" ]` and fell through to `exit 0` with no output when that folder was absent. The lineage's Skeptic cited `005 spec.md:64`, but that line names the skip as what the move would cause if the hooks were not updated. Phase 005 fixed that trigger, since the hook now finds `../overlays`. No Barter checkout fails today. The `opus-medium` lineage read the same branch and ruled `fail_open` out (its report, Deferred Items). It remains a worthwhile hardening item, together with `R2-P2-001` (untested skip branch) and `R14-P2-001` (hard-coded folder name).
- **Review scope summary.** Skilled:
  - `d2d2e839456`: sibling overlay folder.
  - `5913aebc267`: framework/ and root/ layout and `apply --relayout`.
  - `d42bafc890c`: docs and the 1.2.0.0 release.
  - Merge `063daaee2c1`, pruned as `merge-no-own-diff`.
  - Packet commits `1653734af7d` and `10c36989450`.

  ai-speckit:
  - `c8cd005b173` and `fd6dd18b66d`: re-pin.
  - `51e218edf2e`: relayout.
  - `a954fc956ce`: hooks learn both locations.
  - `2a8f454c8d1`: move to `overlays/`.
  - `ad3246feba2`: close-out.

  The two sk-create-goal commits inside the Skilled range (`a3b5ce327da`, `a78ba6b834a`) are off-topic and were excluded from the frontier.
- **Operator review focus:** Review the whole overlay framework/root layout change end to end: Skilled commits 57c01fb4c11..d42bafc890c, merged as 063daaee2c1 plus 1653734af7d and 10c36989450 on main; and ai-speckit (/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit) commits 64cfee51628..ad3246feba2 (re-pin, relayout, hooks learning both locations, the move to overlays/). Check engine correctness, path safety and hook fail-open or fail-closed behavior, the migration for old-layout consumers, test strength, docs against code, and any leftover reference to the old barter-overlays path.

**Bottom line on the change.**
- **Engine:** the sibling-folder support and the framework/ and root/ layout hold up under both lineages. Every engine path that assumed an in-tree overlay folder has a sibling branch and a test.
- **Hooks:** the edit guards fail open and the git-write gate fails closed for writes, as designed.
- **Migration:** old-layout consumers keep applying until one `apply --relayout`. That relayout is the one real correctness gap: it is not atomic once a rename succeeds (`R1-P1-001`).
- **Barter:** it is on pin `063daae`, every source sits under `framework/` or `root/`, and the only live leftover `barter-overlays` reference is a temp fixture name (`R3-P2-002`). A root sweep confirmed this: `rg barter-overlays` outside spec history and changelogs finds only that fixture and Skilled's own engine test, which uses the name on purpose as a custom setting value.

## 2. Planning Trigger

`/speckit:plan` is required. The machine verdict is FAIL, and one P1 stays confirmed after the self-check (`R1-P1-001`). The scope-gate part of the FAIL is a workflow defect, and a remediation plan for this packet should not try to fix it. It belongs to the system-deep-loop owners (D-1).

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "verdictCause": "failed required gate: scope (fan-out root and lineage configs carry reviewScopeFiles: [] so code findings count as out of scope); one confirmed P1",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6384", "lineage": "deepseek-flash-max", "selfCheck": "confirmed"},
    {"id": "R2-P1-001", "severity": "P1", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85", "lineage": "deepseek-flash-max", "selfCheck": "downgraded-to-P2"},
    {"id": "R1-P2-001--6d7230d0ece0", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:452"},
    {"id": "R1-P2-001--4f4ffdfd250a", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:3658"},
    {"id": "R2-P2-001--4e5c79954247", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:3398"},
    {"id": "R2-P2-001--e1e7b8a500f3", "severity": "P2", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85"},
    {"id": "R3-P2-001", "severity": "P2", "file": "barter/ai-speckit/.gitignore:68"},
    {"id": "R3-P2-002", "severity": "P2", "file": "barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs:64"},
    {"id": "R4-P2-001", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/acceptance-criteria.md:66"},
    {"id": "R6-P2-001", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:109"},
    {"id": "R8-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87"},
    {"id": "R11-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:5552"},
    {"id": "R12-P2-001", "severity": "P2", "file": "barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:63"},
    {"id": "R13-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4582"},
    {"id": "R13-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4603"},
    {"id": "R14-P2-001", "severity": "P2", "file": "barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52"}
  ],
  "remediationWorkstreams": [
    {"name": "relayout atomicity", "findings": ["R1-P1-001"]},
    {"name": "Barter commit-gate and hook hardening", "findings": ["R2-P1-001", "R2-P2-001--e1e7b8a500f3", "R14-P2-001", "R12-P2-001"]},
    {"name": "engine remedies and path safety", "findings": ["R1-P2-001--4f4ffdfd250a", "R8-P2-001", "R11-P2-001", "R1-P2-001--6d7230d0ece0"]},
    {"name": "Barter hygiene", "findings": ["R3-P2-001", "R3-P2-002"]},
    {"name": "engine maintainability", "findings": ["R2-P2-001--4e5c79954247", "R13-P2-001", "R13-P2-002"]},
    {"name": "packet closure accuracy", "findings": ["R4-P2-001", "R6-P2-001"]}
  ],
  "specSeed": [
    "State the relayout's failure contract: either it restores moved copies on a mid-run failure, or the docs name the relayout-runs/ restore step",
    "Decide whether resolveOverlayDir refuses a sibling outside the git repository on every command, or reword 001 spec.md:226 to the pre-commit-only check",
    "Decide whether the Barter commit gate fails closed, or prints a skip line, when no overlay manifest is found"
  ],
  "planSeed": [
    "Guard the relayout rename loop and manifest write, restoring moved copies on failure, with a test that injects a mid-loop rename failure",
    "Add a Barter pre-commit test for the lookup, skip and refusal branches, and make the skip visible",
    "Branch the LAYOUT overflow remedy and the strict-write remedy the way the per-line remedy already does; document both remedies in doctor-overlay-presentation.txt",
    "Ignore overlays/relayout-runs/ in ai-speckit; rename the barter-overlays fixture folder",
    "Re-derive phase 002 evidence pointers; correct phase 005 AC-008/AC-009 status wording"
  ],
  "findingClasses": ["partial-failure", "fail-open-without-signal", "path-safety hardening", "misleading-remedy", "docs-code-drift", "test-gap", "test strength", "repository hygiene", "leftover reference", "stale code comment", "duplicated invariant", "readability", "duplicated configuration", "stale-evidence-pointer", "completion-claim drift"],
  "affectedSurfacesSeed": [
    ".skilled/commands/doctor/scripts/overlay-engine.cjs",
    ".skilled/commands/doctor/scripts/tests",
    ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt",
    ".skilled/skills/system-skilled-doctor/references/overlays.md",
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit",
    "barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard",
    "barter/ai-speckit/overlays/root/opencode/plugins/tests",
    "barter/ai-speckit/.gitignore",
    "barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Merged from `deep-review-findings-registry.json` (16 open findings). Full evidence, scope proof and affected-surface hints for each are in the owning lineage's `review-report.md` and `iterations/`.

| ID | Sev | Lineage | Dimension | file:line | Finding | Fix recommendation | findingClass |
|----|-----|---------|-----------|-----------|---------|--------------------|--------------|
| R1-P1-001 | P1 | deepseek-flash-max | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6384` | Relayout leaves a half-moved overlay folder when a rename or the manifest write fails after the first move. Only `planRelayoutManifest` is guarded (`:6362-6367`), and `main` turns the throw into exit 2 (`:6497-6502`). | Guard the rename loop and `writeRelayoutManifest`, roll back the moved copies on failure, and add a mid-loop failure test. | partial-failure |
| R2-P1-001 | P1, root self-check P2 | deepseek-flash-max | correctness | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85` | The commit gate skips every overlay check, with exit 0 and no message, when `../overlays/overlay-manifest.json` is absent. | Fail closed, or print a skip line naming the path looked for. | fail-open-without-signal |
| R1-P2-001--6d7230d0ece0 | P2 | opus-medium | correctness / security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:452` | The sibling check tests only containment against the tree, so `../.git` or a sibling link that resolves outside the repository passes. Only pre-commit checks the repository (`:5813-5818`), while 001 `spec.md:226` states the refusal generally. | Refuse at `resolveOverlayDir`, or reword the spec. | path-safety hardening |
| R1-P2-001--4f4ffdfd250a | P2 | deepseek-flash-max | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:3658` | The LAYOUT overflow line always advises `apply --relayout`, even for `root/skilled` entries that relayout refuses. | Branch on `isUnderRootSkilled`, as `:3652-3655` does. | misleading-remedy |
| R11-P2-001 | P2 | deepseek-flash-max | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:5552` | The strict-write refusal tells the operator to create an overlay copy for a path on the entry's `remove` list, which `apply` never installs. | Branch the remedy on `replace` vs `remove`. | misleading-remedy |
| R8-P2-001 | P2 | deepseek-flash-max | maintainability | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87` | Documents only one of the two LAYOUT remedies the engine emits. | Document both. | docs-code-drift |
| R2-P2-001--e1e7b8a500f3 | P2 | deepseek-flash-max | correctness | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85` | No test covers the hook's overlay lookup or its skip branch. | Add a hook test for lookup, skip and refusal. | test-gap |
| R14-P2-001 | P2 | opus-medium | maintainability | `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52` | The edit guard core, pre-commit (`:85-89`) and git-write gate (`:182`) each hard-code `overlays` beside the tree and never read `.skilled-overlays.json`. | Resolve the folder through the setting or the engine context. | duplicated configuration |
| R12-P2-001 | P2 | opus-medium | traceability | `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:63` | The plugin tests stub `v2-bridge.js`, so they could not catch the `dualPlugin` → `definePlugin` rename that disabled both plugins after the re-pin. | Load the vendored bridge in at least one case. | test strength |
| R3-P2-001 | P2 | opus-medium | correctness | `barter/ai-speckit/.gitignore:68` | `/overlays/repin-runs/` is ignored, but `overlays/relayout-runs/` (the relayout backup) is not. | Add the ignore rule and mention it in `overlays/README.md`. | repository hygiene |
| R3-P2-002 | P2 | opus-medium | correctness | `barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs:64` | A temp fixture still names its overlay folder `barter-overlays`. It is the only live leftover reference. | Rename it to `overlays`. | leftover reference |
| R2-P2-001--4e5c79954247 | P2 | opus-medium | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:3398` | The `layoutMoves` JSDoc still describes the old dot-dropped layout. | Restate the framework/ and root/ rule. | stale code comment |
| R13-P2-001 | P2 | opus-medium | maintainability | `.skilled/commands/doctor/scripts/overlay-engine.cjs:4582` | `!isWithin(root, overlayRoot)` is recomputed in four command paths (`:4582`, `:5228`, `:5814`, `:6374`). | Put `overlayOutside` on the context. | duplicated invariant |
| R13-P2-002 | P2 | opus-medium | maintainability | `.skilled/commands/doctor/scripts/overlay-engine.cjs:4603` | `writeBackup` nests two loops on one line, and an `if (area) continue` hides the asymmetry. | Split the overlay-area pass out. | readability |
| R6-P2-001 | P2 | deepseek-flash-max | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:109` | The `adoptSource`, `layoutMoves` and strict-write line pointers are stale, and the caller count is six where `rg` finds eight. | Re-derive the pointers and the count. | stale-evidence-pointer |
| R4-P2-001 | P2 | opus-medium | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/acceptance-criteria.md:66` | AC-008 and AC-009 are marked Met while their cells record a deviation from the Then clause. | Reword them to the baseline-equal bar, or mark them Superseded with a decision. | completion-claim drift |

Disposition: all active. `R2-P1-001` is carried at P1 in the merged counts and called P2 by the root self-check.

## 4. Remediation Workstreams

1. **P1: relayout atomicity** (`R1-P1-001`). Fix this first. It is the one migration step every old-layout consumer runs.
2. **Barter commit-gate and hook hardening** (`R2-P1-001`, `R2-P2-001--e1e7b8a500f3`, `R14-P2-001`, `R12-P2-001`).
3. **Engine remedies and path safety**, P2 (`R1-P2-001--4f4ffdfd250a`, `R8-P2-001`, `R11-P2-001`, `R1-P2-001--6d7230d0ece0`).
4. **Barter hygiene**, P2 (`R3-P2-001`, `R3-P2-002`).
5. **Engine maintainability**, P2 (`R2-P2-001--4e5c79954247`, `R13-P2-001`, `R13-P2-002`).
6. **Packet closure accuracy**, P2 (`R4-P2-001`, `R6-P2-001`).

## 5. Spec Seed

- Write down the relayout's failure contract (rollback, or a documented restore from `relayout-runs/<stamp>/`).
- Settle the outside-repository rule for a sibling overlay folder (every command, or pre-commit only).
- Settle the Barter commit gate's behaviour when no overlay manifest is found (fail closed, or a visible skip).
- Add `relayout-runs/` beside `repin-runs/` as an engine run folder a consumer must ignore.

## 6. Plan Seed

- Skilled: wrap the relayout rename loop and manifest write, restore the moved copies on error, and add a fault-injection test.
- Skilled: branch the LAYOUT overflow and strict-write remedies, update `doctor-overlay-presentation.txt`, fix the `layoutMoves` JSDoc, add `overlayOutside` to the context and split `writeBackup`.
- ai-speckit: make the pre-commit skip visible or fail closed, add its test, route the three hooks through `.skilled-overlays.json`, load the vendored bridge in one plugin test, ignore `overlays/relayout-runs/` and rename the fixture folder.
- Packet: re-derive phase 002 evidence pointers and correct phase 005 AC-008/AC-009.

## 7. Traceability Status

Core protocols:
- `spec_code`: pass, with drift.
  - Phase 001-002 REQs trace to engine lines and named tests. Doc and release-note claims trace to engine lines. Barter's pin (`063daaee2c1`), the source layout and the overlay count hold.
  - Drift: 001 `spec.md:226` against the pre-commit-only repository check (`R1-P2-001--6d7230d0ece0`), and the stale phase 002 pointers (`R6-P2-001`).
- `checklist_evidence`: partial.
  - Both live criteria re-executed in the deepseek lineage passed: `status --json` reports PASSED with an empty `offLayout`, and `--guard` exits 1 naming `../overlays/framework/...`.
  - Phase 005 AC-008/AC-009 are marked Met against a deviated bar (`R4-P2-001`).
  - Phase 004 closed without recording that the re-pin left both Barter OpenCode plugins unloadable until `a954fc956ce` (opus iteration 12).

Overlay protocols:
- `playbook_capability`: pass (SKD-013 is reachable and registered).
- `feature_catalog_code`: not applicable.
- `skill_agent`: not applicable.
- `agent_cross_runtime`: spot-checked. The git-write gate's runtime copies resolve to one core.

AC_COVERAGE: advisory, not computed. `validate.sh` was outside this run's write and run limits.

## 8. Deferred Items

- **D-1, a deep-review workflow defect, not in this packet's scope.** A fan-out run over a spec-folder target never records `reviewScopeFiles`:
  - `step_fanout_root_config` populates `reviewScopeFiles: []` (`.skilled/commands/deep/assets/deep-review.yaml:434`).
  - Each lineage copies it.
  - `step_scope_discovery` lives only in `phase_init`.

  So the `scope` terminal gate (`.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs:168-179`) fails on any finding outside the packet folder. Any fan-out review of a spec folder whose code lives elsewhere gets a forced FAIL. Suggested fix: run scope discovery once at the fan-out root and pass the list to each lineage, or seed `reviewScopeFiles` from the admitted frontier scopes.
- **Search debt (4 rows).** Frontier nodes F-1-002, F-1-004, F-1-006 and F-1-008 (opus-medium) closed exhausted on their per-node budget before a node-level maintainability pass. Maintainability was covered at run level (opus iterations 13, 14 and 17).
- **Edge cases recorded but not raised** (opus-medium):
  - `sourceRelative` checks containment lexically, which predates this change.
  - The doctor repin YAML lists a run folder before the engine validates the run id. It is read-only and predates the change.

## Dimension Expansion Map

- Seeded frontier: 8 depth-1 sub-targets. F-1-001 (merge `063daaee2c1`) was pruned as `merge-no-own-diff`. The other 7 were admitted and split round-robin across the lineages:
  - opus-medium: F-1-002, F-1-004, F-1-006, F-1-008.
  - deepseek-flash-max: F-1-003, F-1-005, F-1-007.
- deepseek-flash-max: all 3 nodes answered with all four dimensions.
- opus-medium: all 4 nodes exhausted with correctness, security and traceability. Maintainability ran at run level. One stuck-recovery after iteration 16 (strategy change-granularity), resolved by iteration 17.
- Pivots: none. Remaining frontier: none open. No frontier_proposal was emitted.
- Partition guard: passed (`frontier_partition_guard.passed: true`, none missing).

## 9. Search Ledger

- hasSearchDebt: true, with 4 rows, all `frontier:F-1-00N` blocked, from the opus nodes that closed exhausted. The verdict counts them. If the scope gate and the P1 were cleared, they alone would keep it CONDITIONAL. The next step for them is another `/deep:review` over the maintainability of those nodes, not `/speckit:plan`.
- Covered bug classes, combined: path_traversal, partial-failure, fail-open, doc_code_drift, misleading-remedy, leftover_reference, repo_hygiene, test_strength, test-gap, completion_claim, stale-evidence-pointer, duplicated_invariant, readability, duplicated_configuration.
- Ruled out (opus-medium): state_transition, guard_bypass, command_injection, pin_mismatch, playbook_signal, root_detection, secret_exposure, severity_calibration, spec_drift, cross_reference_drift. opus-medium also ruled fail_open out, while deepseek-flash-max raised it as `R2-P1-001`. The root self-check sided with P2.
- Per-iteration ledgers: `lineages/*/deltas/iter-NNN.jsonl`.

## 10. Audit Appendix

**Convergence summary.**
- opus-medium: 17 iterations, newFindingsRatio 1.0 → 0. STOP converged (all_dimensions_clean) at iteration 17.
- deepseek-flash-max: 12 of 24 iterations. STOP converged (composite_converged, graph decision STOP_ALLOWED).
- Terminal gates in both: evidence pass, coverage pass, scope fail (`findings-out-of-scope`).

**Coverage summary.** dimensionCoverage: correctness, security, traceability and maintainability all true in the merged registry.

**Route proof.** Every iteration record in both lineage state logs (17 + 12) carries:
- `target_agent: "deep-review"`
- `resolved_route: "Resolved route: mode=review target_agent=deep-review"`
- `agent_definition_loaded: true`
- `mode: "review"`

None was missing.

**Sources reviewed.**
- Skilled:
  - `overlay-engine.cjs`, the `overlay-engine-*.test.cjs` suites and fixtures, and the overlay-guard lib and tests.
  - Doctor `overlay.md`, `_routes.yaml`, the apply, repin and update YAML, and the presentation text.
  - system-skilled-doctor `SKILL.md`, `references/overlays.md`, the playbook and `changelog/v1.2.0.0.md`.
  - Packet 007 and children 001-005 with their scratch evidence.
- ai-speckit:
  - `.skilled-overlays.json` and `overlays/` (manifest, README, checks, tests, hooks, plugins).
  - `.gitignore`, `init-repository.sh` and `tests/*.sh`.
  - The pre-commit hook and the git-write gate copies.
  - The re-pin, relayout, hooks, move and close-out commits.
- Root sweep: `rg barter-overlays` across both repos.

Core Protocols: spec_code (pass with drift), checklist_evidence (partial).
Overlay Protocols: playbook_capability (pass), feature_catalog_code (not applicable), skill_agent (not applicable), agent_cross_runtime (spot-checked).

**Process deviations, recorded honestly.**
- **Seed re-run.** The first `frontier-admit.cjs seed` pruned the relayout and move node on `relevance`, because its question ran to 518 characters against the 500 limit. The node store had been written seconds earlier from that input and nothing had read it. It was removed, the question was shortened to 418 characters, and the seed ran again: 7 admitted, 1 pruned.
- **Detached runner.** `fanout-run.cjs` ran detached (`nohup`), with its log in `fanout-run.log` and exit code 0 in `fanout-run.exit`, because two 24-iteration lineages could outlast the Bash tool ceiling.
- **Lineage synthesis warning.** The opus-medium closeout recorded `deep_review.synthesis_incomplete` at warning severity: 10 iteration findings against 9 registry entries. R5-P2-001 refines R1-P2-001 and was folded into it, so `missingStructuredFindingCount` is 0.
- **Skipped by dispatch limits.** These steps are skipped because the dispatch allows writes only under `review/` and forbids git writes:
  - `step_stage_artifact_dir` (`git add`).
  - `phase_save` (`generate-context.js --full-auto`, which writes outside `review/`).
  - `step_release_lock`, since a fan-out root takes no lock.
- **Skipped by the workflow on a fan-out root:** `step_emit_resource_map` and `step_refresh_completed_dashboard`. The lineage map is at `lineages/opus-medium/resource-map.md`.
- **Root closeout warning.** `synthesis-closeout.cjs` recorded `deep_review.synthesis_incomplete` at warning severity in the root state log, with invariant `structured_state_findings_missing_from_registry`: 17 iteration findings against 16 merged registry entries, `missingStructuredFindingCount` 1. The one missing is opus `R5-P2-001`, which carries `refines: R1-P2-001` and was folded into `R1-P2-001--6d7230d0ece0`, so no finding is lost. The root config status was then set to `complete`.
- **Containment gap for the nested repository.** The runner's containment baseline (`lineages/*/containment/baseline/`) covers only the Skilled checkout. The nested `barter/ai-speckit` repository was not watched. Both lineages could have written there: opus-medium ran under `bypassPermissions`, and cli-mistral-vibe has no sandbox enforcement. After the run, `git -C barter/ai-speckit status` showed:
  - tracked deletions under `specs/clickup-cli/`;
  - untracked `specs/*/z_archive/` folders, `specs/gaia-services/.gitkeep` and `specs/skilled-barter-overlays/006-sk-git-releases/`.

  None of these is attributed to this run:
  - The untracked paths were created on Nov 13, or on Nov 20 at 09:53 local time.
  - The last change to `specs/` was at 14:01:30 local, which is 13:01 UTC, 52 minutes before the runner started at 13:53:57 UTC.
  - No lineage artifact names `clickup-cli`, `gaia-services` or `006-sk-git-releases`. An unfiltered `rg -il` over `lineages/` returns nothing.

  Nothing in ai-speckit was touched.
- **Root self-check.** It downgraded `R2-P1-001` in this report only. On a fan-out root the contract keeps the merged lineage counts as the verdict's input.
