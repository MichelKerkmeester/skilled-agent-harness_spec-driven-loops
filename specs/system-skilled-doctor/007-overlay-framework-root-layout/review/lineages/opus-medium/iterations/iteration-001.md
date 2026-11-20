# Iteration 001 - Frontier node F-1-002: correctness

## Dispatcher
- Lineage: opus-medium, session fanout-opus-medium-1795182837437-sws2tv, generation 1, lineageMode new.
- Iteration number derived from state log (0 prior iteration records) = 1.
- steer.md: absent at init and before this iteration.
- Node F-1-002, dimension correctness. FRONTIER block printed with frontier-admit.cjs block.
- Review focus addressed: engine correctness and path safety of the sibling overlay folder across apply, status, adopt, repin (live, stage, rollback), relayout, pre-commit and the guard, plus the strength of the new tests (Skilled commits d2d2e839456 and 5913aebc267 inside 57c01fb4c11..d42bafc890c).

## Files Reviewed
- .skilled/commands/doctor/scripts/overlay-engine.cjs:426-493 (resolveOverlayDir, createContext)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:4577-4640 (writeBackup areas)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5060-5135 (repinUnderLock)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5136-5260 (stageFolderProblem, repinRun stage)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5266-5330 (rollbackUnderLock areas)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5808-5820 (stagedUnownedChanges outside-repo refusal)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:6369-6383 (relayout backup base)
- .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:61-130 (fail-open policy)
- .skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:116-190, strict-writes:677-762, repin:1151-1334, follow-up:1208, sync:1738-1770
- specs/.../001-engine-out-of-tree-overlay-folder/spec.md:125-141,225-229
- specs/.../001-engine-out-of-tree-overlay-folder/scratch/evidence/negative-control-engine-suite.txt

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **A sibling link that resolves anywhere outside the tree is accepted, and only pre-commit checks the git repository** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:452 -- resolveOverlayDir accepts `../<name>` when the resolved target neither contains nor sits inside the tree (:463-465). A sibling that is a link to an arbitrary folder (another repository, a home folder) passes, and apply --capture, adopt, relayout and repin then write into that folder. The only same-repository check is in stagedUnownedChanges (:5813-5818), so the operator resolution in the phase spec ("an overlay folder outside the git repository that holds the tree is refused", 001 spec.md:226) holds for pre-commit alone. overlays.md:51 scopes it correctly ("For the commit check"), so this is hardening plus a spec wording gap, not a broken promise.
   Finding class: path-safety hardening
   Scope proof: resolveOverlayDir is the only reader of the setting (fixes test "only the setting reader in the engine mentions the overlayDir key"); grep for "outside the git repository" finds only :5817-5818.
   Affected surface hints: overlay-engine.cjs resolveOverlayDir; 001 spec.md:226 wording
   Case: `.skilled-overlays.json` names `../overlays` and `../overlays` is a link to `~/elsewhere`; `apply --capture` writes the live edit into `~/elsewhere` with no refusal.

## Traceability Checks
- spec_code (partial): REQ-001, REQ-004..REQ-010 each have a matching code path and a named test; spec.md:226 states a general outside-repo refusal that the code enforces only at pre-commit (REQ-008 itself is scoped to pre-commit).
- checklist_evidence (pass): implementation-summary.md:90 claims 17 new sibling tests failed against the unchanged engine; negative-control-engine-suite.txt lists exactly 17 distinct failing sibling tests.

## Integration Evidence
- .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:107-130: the guard only denies on an engine exit 1 with a `refuse:` line and allows (with a note) on every error, so a sibling folder misconfiguration fails open, as documented at :101-104.

## Edge Cases
- BINDING lines were printed after init writes rather than before; recorded here once.
- The negative control ran against the unchanged engine, where every sibling test fails at resolveOverlayDir first. That proves the tests need the setting change, not that each downstream fix (backup area, stage refusal) is individually load-bearing. By reading: without the area split, writeBackup's relativeKey(root, manifestPath) (:4588) throws "destination escapes the sync root", and without the overlayRoot stage check the stage-inside-overlay test (repin:1245) passes the refusal step, so the downstream tests do discriminate. Not raised as a finding.

## Confirmed-Clean Surfaces
- writeBackup overlay area: manifest and state keyed from overlayRoot, stored under overlay-backup/; `if (area) continue` skipping createdDirs is safe because the overlay-area entries are files directly in the overlay root, which always exists during a run.
- rollbackUnderLock: unknown area throws; each entry is confined by relativeKey(base, ...).
- repinRun stage: stagedRoot and the overlay copy sit side by side under their own basenames, and resolveOverlayDir refuses a sibling named after the tree, so the two never collide.
- relayout backup base switches to overlayRoot for a sibling folder.

## Ruled Out
- Engine paths still keyed tree-relative against the overlay folder: grep for relativeKey/relative(root, overlayRoot|manifestPath|statePath|lockPath) finds only :503 (display), :4588 (in-tree branch only), :5813 (guarded by the sibling branch) and :6382 (in-tree branch only).
- Missing createdDirs for the overlay area in rollback: ruled out as above.

## Next Focus
- Dimension: correctness
- Focus area: F-1-004 doctor overlay docs, YAML assets, playbook and release note against engine behavior
- Reason: frontier rotation, one node per iteration
- Rotation status: F-1-002 correctness done
- Required evidence: doc line vs engine line pairs

Review verdict: PASS
