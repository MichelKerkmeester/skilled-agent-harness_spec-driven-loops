# Deep Review Report - opus-medium lineage

Review of `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder), fan-out lineage `opus-medium`, session `fanout-opus-medium-1795182837437-sws2tv`, 17 iterations, stop reason `converged` (all_dimensions_clean).

## 1. Executive Summary

- **Overall verdict: FAIL**, as `review-verdict.cjs` computed it from the registry and state log. The only cause is the failed **scope** terminal gate. No P0 or P1 finding is active.
- **Severity-only reading:** with the scope gate set aside, the findings would give PASS with advisories: 0 P0, 0 P1, 9 P2.
- hasAdvisories: false, as the script reports it, because the verdict is not PASS. Nine active P2 advisories remain.
- Counts the verdict used: P0=0, P1=0, P2=9; search debt 4. All four debt rows are frontier nodes that closed exhausted with maintainability unreviewed on the node itself. Iterations 13, 14 and 17 later covered maintainability at run level.
- **Why the scope gate fails (LOGIC-SYNC, recorded rather than asked):** the config's review target is the spec folder, and `reviewScopeFiles` is empty. The terminal scope gate therefore counts only the packet folder as in scope. The operator review focus and all four seeded frontier nodes point the review at `.skilled/commands/doctor/**`, `.skilled/hooks/overlay-guard/**`, `.skilled/skills/system-skilled-doctor/**` and `barter/ai-speckit/**`. As a result, 8 of the 9 findings sit outside the gate's scope by construction. The config is immutable to this lineage. The fix belongs at the dispatcher: give the review target or `reviewScopeFiles` the paths the focus names, or treat the spec-folder scope as covering the code its packet changed.
- Self-check outcomes: no P0/P1 candidate arose, so no Hunter/Skeptic/Referee pass was needed. Iteration 15 re-ran every open P2 against fresh evidence and confirmed all of them. None was raised to P1, because no finding names an in-contract input or a real caller that fails today (review-core.md section 2, reach rule).
- Review scope summary: the Skilled engine change (overlay-engine.cjs, its tests, overlay-guard), the doctor overlay docs, workflows, playbook and v1.2.0.0 release note, Barter's ai-speckit relayout, hook fixes and move to `overlays/`, and the packet's five child phases.
- Operator review focus: Review the whole overlay framework/root layout change end to end: Skilled commits 57c01fb4c11..d42bafc890c, merged as 063daaee2c1 plus 1653734af7d and 10c36989450 on main; and ai-speckit (/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit) commits 64cfee51628..ad3246feba2 (re-pin, relayout, hooks learning both locations, the move to overlays/). Check engine correctness, path safety and hook fail-open or fail-closed behavior, the migration for old-layout consumers, test strength, docs against code, and any leftover reference to the old barter-overlays path.

**Bottom line on the change itself:** the engine's sibling-folder support and the framework/ and root/ layout are correct as far as this review read them. Every path that assumed an in-tree overlay folder has a sibling branch and a test. Each hook fails on its stated side: the edit guards fail open, and the git-write gate fails closed for writes. Old-layout consumers keep working until one `apply --relayout`. Barter is on the new pin, every source is under `framework/` or `root/`, and the only leftover reference to the old path is a temp fixture name.

## 2. Planning Trigger

`/speckit:plan` is **not required for correctness**: there is no P0 or P1. The machine verdict is FAIL only because of the scope-gate configuration conflict above. The P2 advisories can be scheduled as a small follow-up.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "FAIL",
  "verdictCause": "failed required gate: scope (config scope is the spec folder; findings sit in the code the focus names)",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:452"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:3398"},
    {"id": "R3-P2-001", "severity": "P2", "file": "barter/ai-speckit/.gitignore:68"},
    {"id": "R3-P2-002", "severity": "P2", "file": "barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs:64"},
    {"id": "R4-P2-001", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/acceptance-criteria.md:66"},
    {"id": "R12-P2-001", "severity": "P2", "file": "barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:63"},
    {"id": "R13-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4582"},
    {"id": "R13-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4603"},
    {"id": "R14-P2-001", "severity": "P2", "file": "barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52"}
  ],
  "remediationWorkstreams": [
    {"name": "engine path-safety hardening", "findings": ["R1-P2-001"]},
    {"name": "Barter hygiene and test strength", "findings": ["R3-P2-001", "R3-P2-002", "R12-P2-001", "R14-P2-001"]},
    {"name": "engine maintainability", "findings": ["R2-P2-001", "R13-P2-001", "R13-P2-002"]},
    {"name": "packet closure accuracy", "findings": ["R4-P2-001"]}
  ],
  "specSeed": ["Decide whether resolveOverlayDir should refuse a sibling outside the git repository on every command, or keep the pre-commit-only check and reword 001 spec.md:226"],
  "planSeed": ["Ignore overlays/relayout-runs/ in ai-speckit", "Load the real v2-bridge in the Barter plugin tests"],
  "findingClasses": ["path-safety hardening", "stale code comment", "repository hygiene", "leftover reference", "completion-claim drift", "test strength", "duplicated invariant", "readability", "duplicated configuration"],
  "affectedSurfacesSeed": [".skilled/commands/doctor/scripts/overlay-engine.cjs", "barter/ai-speckit/.gitignore", "barter/ai-speckit/overlays/root/opencode/plugins/tests", "barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard", "barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit", "specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/acceptance-criteria.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | file:line | Finding | Fix recommendation | findingClass |
|----|-----|-----------|-----------|---------|--------------------|--------------|
| R1-P2-001 (refined by R5) | P2 | correctness / security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:452` | The sibling branch checks only containment against the tree. A sibling link that resolves anywhere outside the tree passes, and so do special siblings such as `../.git`. Only pre-commit checks the git repository (:5813-5818), while 001 spec.md:226 states the outside-repo refusal in general terms. Case: `../overlays` links to `~/elsewhere`, and `apply --capture` writes there. | Refuse a sibling whose canonical path leaves the repository top level, or a `.git`-named sibling, at resolveOverlayDir; or reword spec.md:226 to "refused by pre-commit". | path-safety hardening |
| R2-P2-001 | P2 | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:3398` | The layoutMoves JSDoc still says a copy is on layout "at its destination path with the leading dot dropped", the old rule the function now reports as off-layout. | Restate the framework/ and root/ rule in the comment. | stale code comment |
| R3-P2-001 | P2 | correctness | `barter/ai-speckit/.gitignore:68` | `/overlays/repin-runs/` is ignored and `overlays/relayout-runs/` is not; `git check-ignore` confirms it. The relayout is the documented upgrade step and writes its backup there. | Add `/overlays/relayout-runs/` and mention it in overlays/README.md:460. | repository hygiene |
| R3-P2-002 | P2 | correctness | `barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs:64` | A temp fixture still names its overlay folder `barter-overlays`. It is the only live reference to the old name, and 005 AC-009 accepted it. | Rename the fixture folder to `overlays`. | leftover reference |
| R4-P2-001 | P2 | traceability (registry: correctness) | `specs/.../005-barter-move-overlays-out-of-tree/acceptance-criteria.md:66` | AC-008 ("all pass"; observed exit 1, 11 baseline failures) and AC-009 (4 lines outside the allowed list) are marked Met with no waiver, while the legend (:74-77) defines Met as verified. | Reword both Then clauses to the baseline-equal bar actually used, or mark them Superseded with a decision record. | completion-claim drift |
| R12-P2-001 | P2 | traceability | `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:63` | Both Barter OpenCode plugin tests write their own `v2-bridge.js` stub (also barter-git-write-gate.test.cjs:84-87), so they cannot catch an upstream bridge rename. That is exactly the `dualPlugin` → `definePlugin` rename that disabled both plugins after the 063daae re-pin, and phase 004's suite stayed at baseline through it. | Load the vendored bridge from the tree in at least one case, or assert that the vendored bridge exports the name the plugins import. | test strength |
| R13-P2-001 | P2 | maintainability (registry: correctness) | `.skilled/commands/doctor/scripts/overlay-engine.cjs:4582` | `!isWithin(root, overlayRoot)` is recomputed in four command paths (:4582, :5228, :5814, :6374) rather than set once by createContext. | Add an `overlayOutside` field to the context. | duplicated invariant |
| R13-P2-002 | P2 | maintainability (registry: correctness) | `.skilled/commands/doctor/scripts/overlay-engine.cjs:4603` | writeBackup nests two `for...of` loops on one line across two areas, and an `if (area) continue` special case hides the asymmetry. | Split the overlay-area pass into its own loop or helper. | readability |
| R14-P2-001 | P2 | maintainability (registry: correctness) | `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52` | The Barter edit guard core, pre-commit (:85-89) and git-write gate (:182) each hard-code `overlays` beside the tree. None reads `.skilled-overlays.json`, which Skilled's own guard follows through the engine. | Resolve the folder through the engine's createContext, or read the setting, in all three. | duplicated configuration |

Disposition for all: active, advisory. Scope proof and affected-surface hints for each are in the iteration files named by the ID's round number.

## 4. Remediation Workstreams

- P0: none.
- P1: none.
- P2 advisories, in suggested order:
  1. Barter hygiene and test strength: R3-P2-001, R12-P2-001, R14-P2-001, R3-P2-002.
  2. Engine path-safety hardening: R1-P2-001.
  3. Engine maintainability: R13-P2-001, R13-P2-002, R2-P2-001.
  4. Packet closure accuracy: R4-P2-001.

## 5. Spec Seed

- Settle the outside-repository rule for a sibling overlay folder: refuse it on every command, or state in 001 spec.md:226 that pre-commit alone refuses it.
- Add `relayout-runs/` to the set of engine run folders a consumer must ignore, beside `repin-runs/`, in the doctor docs and the Barter ignore rules.

## 6. Plan Seed

- ai-speckit: add `/overlays/relayout-runs/` to `.gitignore` and to overlays/README.md.
- ai-speckit: make one plugin test import the vendored `v2-bridge.js`.
- ai-speckit: route the three hooks through the setting file (or the engine context).
- Skilled: put `overlayOutside` on the engine context, update the layoutMoves JSDoc, and split the writeBackup loop.
- Skilled: decide R1-P2-001 (refuse, or reword the spec).
- Packet: correct AC-008/AC-009 status wording in phase 005.

## 7. Traceability Status

Core protocols:
- `spec_code`: pass overall. Phases 001 and 002 REQs were traced to engine lines and named tests (iterations 1, 9), and the doc and release-note claims to engine lines (iteration 2). Barter claims (pin `063daaee2c19...`, 133 overlays, every source under framework/ or root/) hold (iteration 4). One wording drift: 001 spec.md:226 versus the pre-commit-only check (R1-P2-001).
- `checklist_evidence`: partial. The phase 001 and 002 negative-control counts match their captures, and the phase 003 scenario quoting fix is in the docs. But 005 AC-008/AC-009 are marked Met against a deviated bar (R4-P2-001), and phase 004 closed without recording that its re-pin left both Barter OpenCode plugins unloadable (iteration 12).

Overlay protocols:
- `playbook_capability`: pass. SKD-013 signals are reachable, and the scenario is registered in the index, both leaf manifests and the cross-reference row.
- `feature_catalog_code`: notApplicable (no feature catalog for system-skilled-doctor).
- `skill_agent`: notApplicable (no agent touched).
- `agent_cross_runtime`: not run as a separate protocol. The Barter git-write gate's runtime copies were checked in iteration 7: four are links to the core and one is an adapter that imports it.

AC_COVERAGE: advisory, not computed by this lineage (validate.sh is out of this lineage's write and run limits).

## 8. Deferred Items

- The scope-gate configuration conflict, for the dispatcher: align the review target or `reviewScopeFiles` with the focus paths.
- Frontier debt: four depth-1 nodes closed exhausted on their per-node budget before a node-level maintainability pass. Run-level maintainability iterations 13, 14 and 17 covered the engine, the Barter hooks and the fixtures, but the reducer's frontier debt rows remain.
- Edge cases recorded but not raised: sourceRelative checks containment lexically, which predates this change. The Barter pre-commit silently skips the overlay checks with no beside-tree manifest. The doctor repin YAML lists a run folder before the engine validates the run id (read-only, predates the change).

## Dimension Expansion Map

- Swept: correctness, security and traceability across the four frontier nodes F-1-002, F-1-004, F-1-006 and F-1-008. Maintainability ran at run level after the nodes closed.
- Pivots: none. One stuck-recovery entry after iteration 16, with strategy change-granularity on maintainability; its result is iteration 17.
- Remaining frontier: none open. All four nodes are exhausted, and no frontier_proposal was emitted.

## 9. Search Ledger

- hasSearchDebt: true (4 rows, all `frontier:F-1-00N` blocked, from nodes closed exhausted).
- Covered bug classes: path_traversal, doc_code_drift, leftover_reference, repo_hygiene, test_strength, completion_claim, duplicated_invariant, readability, duplicated_configuration.
- Ruled-out classes: state_transition, guard_bypass, fail_open, command_injection, pin_mismatch, playbook_signal, root_detection, secret_exposure, severity_calibration, spec_drift, cross_reference_drift.
- Per-iteration ledgers: `deltas/iter-001.jsonl` .. `deltas/iter-017.jsonl` (searchLedger in each iteration record).

## 10. Audit Appendix

**Convergence summary.** 17 iterations; newFindingsRatio by iteration: 1.0, 0.5, 0.5, 0.2, 0.08, 0, 0, 0, 0, 0, 0, 0.17, 0.25, 0.11, 0, 0, 0. The stop decision was STOP (converged, all_dimensions_clean) at iteration 17. Iteration 15 was BLOCKED on candidateCoverageGate, because its record listed its required class only as ruled out. Iteration 16 entered STUCK_RECOVERY.

**Coverage summary.** dimensionCoverage: correctness, security, traceability and maintainability all true. Terminal gates: evidence pass, coverage pass, scope fail (findings-out-of-scope).

**Ruled-out claims (selection).** Engine paths still keying overlay-folder files tree-relative; relayout overwrite on a shared target; guard bypass through the sibling folder; Barter guard failing closed; runtime gate copies computing the wrong root; Barter pin mismatch; secret leakage in packet evidence; SKD-013 grep miscount.

**Sources reviewed.** Skilled: overlay-engine.cjs; the overlay-engine-*.test.cjs suites and fixtures; overlay-guard lib and tests; doctor overlay.md, _routes.yaml and the apply, repin and update YAML; presentation text; system-skilled-doctor SKILL.md, references/overlays.md, the playbook and changelog v1.2.0.0; packet 007 and children 001-005 with their scratch evidence. ai-speckit: `.skilled-overlays.json`; overlays/ (manifest, README, checks, tests, hooks, plugins); `.gitignore`; init-repository.sh; sync-skilled-specs.mjs; tests/*.sh; the pre-commit hook; the git-write gate copies; the 039 close-out record.

Core Protocols: spec_code (pass with one wording drift), checklist_evidence (partial).
Overlay Protocols: playbook_capability (pass), feature_catalog_code (notApplicable), skill_agent (notApplicable), agent_cross_runtime (spot-checked, not run as a protocol).

**Process deviations, recorded honestly.**
- The six BINDING lines were printed after init writes, not before.
- Init used a `/tmp` temp file for the run-open event (removed). Every later temp file stayed in `.executor-state/`.
- Iterations 1-6 were upserted to the coverage graph without canonical DIMENSION/FILE nodes (iteration 6 exited 3), then backfilled with exit 0.
- The per-iteration `deep_review.graph_convergence_evaluated` bookkeeping event was not appended. The convergence decision itself was computed by convergence.cjs after every iteration.
- `phase_save` (generate-context.js) and `step_stage_artifact_dir` (git add) were skipped, because the dispatch forbids them. `step_fanout_merge` belongs to the parent run.
- The synthesis close-out recorded `deep_review.synthesis_incomplete` at warning severity with the invariant `structured_state_findings_partially_reflected_in_registry`: 10 iteration findings against 9 registry entries. The difference is expected. R5-P2-001 carries `refines: R1-P2-001`, so the reducer folded it into R1-P2-001. No finding is missing from the registry (`missingStructuredFindingCount` 0).
- **This lineage partly caused the scope-gate FAIL.** It built its config by copying the root config, which carries `reviewScopeFiles: []`, instead of running `step_scope_discovery`. For a spec-folder target, that step reads the packet docs and sets the scope to those docs plus every implementation and test file they reference. Here that would have taken in overlay-engine.cjs, the engine tests, the overlay-guard files and the doctor docs. With that list, the Skilled-side findings (R1, R2, R13-001, R13-002) would most likely have counted as in scope. Whether the ai-speckit paths would have counted is UNKNOWN: they sit in a nested repository that the packet docs name, but the step's handling of them was not run. The sibling lineage `deepseek-flash-max` also records `reviewScopeFiles: []`. The config was not rewritten after the fact, so the FAIL stands as computed. A rerun of this lineage's init with scope discovery is what would settle it.
- The narrative files use the persona's section names, "Findings - New" with P0/P1/P2 subsections and "Next Focus", not the prompt pack's "Findings by Severity" and "Next Dimension" headings. Each iteration file still carries the dimension, files reviewed, findings by severity, traceability checks and the final verdict line. The iteration files are write-once, so they were not renamed.
