# Iteration 015 - Recovery: traceability protocol replay and registry repair (traceability)

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Trigger: the stop check after iteration 14 returned BLOCKED on dimensionCoverageGate because core protocol spec_code was last recorded as partial, which the gate reads as unfinished. Recovery strategy "Traceability protocol replay: re-run unresolved core checks" applies.
- Second trigger, found while preparing this replay: the reducer folds a refinement into its target and takes the refinement's severity and title. Iteration 9's R9-P2-001 (a P2 test gap with refines R5-P1-001) therefore lowered R5-P1-001 to P2 in the registry and replaced its title. Iteration 10's R10-P2-001 and iteration 2's R2-P2-002 likewise replaced the titles of R2-P2-001 and R1-P2-001. Nothing in the evidence changed; the severity drop is a recording error by this lineage.
- Review focus addressed: consolidate the two core protocols over the whole packet and restore the registry to the evidence.
- Sources: steer.md absent; strategy; registry; conv-014 stop decision.

## Files Reviewed

- Registry open findings (11 entries) against iterations 1-14
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5864`, `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164`, `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858-872` (re-read for the P1 restatement)
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563, 595`, `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:58`, `.skilled/commands/doctor/scripts/overlay-engine.cjs:6534`, `.skilled/skills/system-skilled-doctor/references/overlays.md:96` (re-read for the two P2 restatements)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The engine's commit check allows every unowned vendored change when git runs it from a hook in a linked worktree, and no test runs pre-commit under that environment** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:5864 -- Restates R5-P1-001 at its adjudicated severity, folding in R9-P2-001's test gap. stagedUnownedChanges probes the top level with the hook's GIT_DIR (`.skilled/commands/doctor/scripts/overlay-engine.cjs:5864` through runGit), which in a linked worktree reports the tree subfolder as the top level, so no staged name matches a vendored key and the check prints allow. Reproduced at iteration 5 (exit 1 refuse without GIT_DIR, exit 0 allow with it), status also passes under it (iteration 6), and worktrees are a documented ai-speckit workspace with a shared core.hooksPath (iteration 13). The only hook-environment test runs status, never pre-commit (`.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858-872`).
   - Finding class: fail-open-gate (refines R5-P1-001; restores its severity)
   - Scope proof: stagedUnownedChanges is the commit path's only hook-environment top-level probe; trackedTreeKeys shares the pattern on the status path.
   - Affected surface hints: overlay-engine.cjs stagedUnownedChanges and trackedTreeKeys; Barter pre-commit hook; strict-writes hook-environment test; 006 Known Limitation 1.
   - Case: in a linked worktree of ai-speckit, stage an edit to skilled/.skilled/skills/sk-code/SKILL.md that no overlay owns and run git commit; the hook prints allow and the commit lands.

```json
{"type":"fail-open-gate","claim":"Under a hook-exported GIT_DIR, overlay-engine pre-commit returns allow for a staged unowned vendored change in a tree below the git top level, and no test covers that environment for pre-commit","evidenceRefs":[".skilled/commands/doctor/scripts/overlay-engine.cjs:5864","barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164",".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:868"],"counterevidenceSought":"Barter hook does not clear GIT_DIR; status also exits 0 under it; main checkout unaffected; worktrees documented in ai-speckit AGENTS.md:222","alternativeExplanation":"Unreachable only if ai-speckit never commits from a linked worktree, which its own workspace rule contradicts","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"The hook or engine clears GIT_DIR before the probe, or ai-speckit forbids commits from linked worktrees"}
```

### P2 Findings

1. **Generic LAYOUT guidance sends root/skilled lines to relayout in both the presentation's next-step rows and the status workflow** -- .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563 -- Restates R2-P2-001 with R10-P2-001's executable case: `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563, 595` and `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:58` name apply --relayout for every LAYOUT line, while the engine prints "change the destination or remove the entry" for a target under root/skilled and relayout refuses it.
   - Finding class: doc-contradiction (refines R2-P2-001)
   - Scope proof: the three generic statements; every quoted LAYOUT form is correct.
   - Affected surface hints: doctor-overlay-presentation.txt rows 563 and 595; doctor-overlay-status.yaml render rule.
   - Case: a root/skilled LAYOUT line rendered by the status workflow gets an apply --relayout suggestion that exits 2.

2. **The restore-failed relayout line and references/overlays.md both say the kept backup holds every moved copy, but the backup skips token-named files** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:6534 -- Restates R1-P2-001 with R2-P2-002's doc copy: the engine line (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6534-6535`) and `.skilled/skills/system-skilled-doctor/references/overlays.md:96` overclaim, while copyForBackup skips token-named files not named exactly (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6278-6281`).
   - Finding class: message-contract drift (refines R1-P2-001)
   - Scope proof: only the restore-failed branch and its doc sentence.
   - Affected surface hints: relayoutUnderLock catch block; overlays.md relayout paragraph; apply YAML line 116.
   - Case: a moved folder holding assets/api-token.js, a failed relink and a failed restore; the operator restores from a backup without the token file.

## Traceability Protocol Replay

- spec_code: fail (terminal). Run across all four nodes (iterations 1-14). Engine behavior matches phase 006 REQ-001..REQ-008 and the 007 and 039 records, and the docs quote the engine's lines exactly, but four doc-code mismatches stay active: R2-P2-001 (`.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563`, `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:58`), R6-P2-001 (`.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560`), R1-P2-001 (`.skilled/skills/system-skilled-doctor/references/overlays.md:96`) and R14-P2-001 (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6554` against the apply workflow).
- checklist_evidence: fail (terminal). Test counts, push, pin and status numbers all reproduce (iterations 4, 8), but two record lines contradict git or each other: R4-P2-001 (`specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:115`) and R4-P2-002 (`specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:91`).

## Traceability Checks

- spec_code: fail, as above.
- checklist_evidence: fail, as above.

## Edge Cases

- Recording lesson for the synthesis: a refines row must carry the target's severity, or it rewrites the target's severity in the registry.

## Confirmed-Clean Surfaces

- None new.

## Ruled Out

- A real change in R5-P1-001's evidence between iterations 5 and 9: none; the drop was a recording artifact.

## Next Focus

- Dimension: none
- Focus area: synthesis if the stop decision allows it
- Reason: core protocols terminal, registry repaired, frontier answered
- Rotation status: complete
- Required evidence: stop decision after this iteration

Review verdict: CONDITIONAL
