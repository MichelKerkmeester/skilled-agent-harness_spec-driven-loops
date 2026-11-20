# Iteration 005 - Frontier node F-1-002: security

## Dispatcher
- Lineage opus-medium, iteration 5 (4 prior iteration records). steer.md absent. Node F-1-002 (already active), dimension security.
- Review focus addressed: path safety and hook fail-open/fail-closed behavior for the sibling overlay folder: the setting-file trust boundary, the strict-write guard and owned-destination guard with a folder outside the tree, the stage folder checks, the overlay-area rollback, and relayout containment.

## Files Reviewed
- .skilled/commands/doctor/scripts/overlay-engine.cjs:426-470 (resolveOverlayDir sibling branch)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:4128-4165 (commandGuard)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5528-5562 (strictWriteRefusal)
- sourceRelative (lexical containment under overlayRoot)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5136-5150 (stageFolderProblem), :5266-5330 (rollback areas)
- .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:61-130

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The sibling check also accepts `../.git` and other non-overlay siblings** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:452 -- Refines R1-P2-001. The sibling branch rejects only '', '.', '..', a nested path and the tree's own name. When the tree sits in a repository subfolder, as Barter's skilled/ does beside ai-speckit/.git, `{"overlayDir":"../.git"}` passes, because .git neither contains nor sits inside the tree. Every overlay-folder write (state file, capture, adopt copy, relayout move, repin-runs backup) would then land inside the repository's git directory. The setting file is repository-controlled, so this needs a mistaken or hostile commit, which keeps it P2 hardening.
   Finding class: path-safety hardening
   Scope proof: the only name checks are at :452-453; no denylist of special sibling names exists.
   Affected surface hints: resolveOverlayDir sibling branch
   Case: a setting file naming `../.git` in barter/ai-speckit/skilled; `apply --capture <owned path>` writes a source file under ai-speckit/.git/.

## Traceability Checks
- spec_code (pass): 001 spec NFR-S02 (every backup write lands inside its run folder) holds: overlay-area entries are confined by relativeKey(base, ...) and normalizedRelative, and stored under <run>/overlay-backup/.

## Integration Evidence
- Skilled overlay-guard hook (.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:101-130): only an engine exit 1 with a `refuse:` line denies; every error, timeout or unreadable setting allows with a note. A sibling-folder misconfiguration therefore fails open, which is the documented policy.
- Engine --guard: a path inside the sibling folder falls outside canonical root, so strictWriteRefusal returns null (:5531) and commandGuard prints allow; owned destinations are matched canonically (:4148).

## Edge Cases
- sourceRelative checks containment lexically, not through links; a link inside the overlay folder pointing out would pass. This predates the change and applies equally to an in-tree folder; not raised.

## Confirmed-Clean Surfaces
- Stage folder inside the sibling folder refused (:5143-5145); a stage folder holding both folders is refused as non-empty.
- Rollback refuses an unknown area value and confines each entry to its base.

## Ruled Out
- Guard bypass by writing through the sibling folder into the tree: candidates are canonicalized before the containment test (:4131, :5531).

## Next Focus
- Dimension: security
- Focus area: F-1-004 docs (no secrets, safe commands in playbook and workflow YAML)
- Reason: frontier rotation

Review verdict: PASS
