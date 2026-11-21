# Iteration 006 - Frontier node F-1-003: security

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-003 (doctor docs against the engine), dimension security (taken from the registry frontier: F-1-003 next dimension security)
- Review focus addressed: path safety as documented. Checked what references/overlays.md and the presentation contract promise about the overlay-folder containment refusals, the commit check's refusals and the protected-file rules, against the engine.
- Sources: steer.md absent; strategy; registry frontier; frontier block F-1-003.

## Files Reviewed

- `.skilled/skills/system-skilled-doctor/references/overlays.md:51` (overlayDir rules), `.skilled/skills/system-skilled-doctor/references/overlays.md:140-155` (protected reads), `.skilled/skills/system-skilled-doctor/references/overlays.md:195`
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:258, 377, 556, 560`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:426-482` (resolveOverlayDir), `.skilled/commands/doctor/scripts/overlay-engine.cjs:517-526` (createContext), `.skilled/commands/doctor/scripts/overlay-engine.cjs:5862-5890` (stagedUnownedChanges)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:786-815` (outside-repository tests)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The docs attribute the outside-repository refusal to a pre-commit check that never prints it** -- .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560 -- The presentation's fix row says a folder outside the tree's git repository "is refused by pre-commit with exit 2: the overlay folder must sit inside the same git repository as the tree", and `.skilled/skills/system-skilled-doctor/references/overlays.md:51` adds that "pre-commit keeps its own check, which exits 2" for a tree in no git repository. In the engine, createContext calls resolveOverlayDir before any command (`.skilled/commands/doctor/scripts/overlay-engine.cjs:519`), and that refuses an outside sibling for every command, pre-commit included, with "names a folder outside the git repository at <top>" (`.skilled/commands/doctor/scripts/overlay-engine.cjs:474`). The stagedUnownedChanges throw (`.skilled/commands/doctor/scripts/overlay-engine.cjs:5886-5888`) is reached only after a non-empty change list, and for a tree in no git repository the function returns allow at `.skilled/commands/doctor/scripts/overlay-engine.cjs:5865`. The test at `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:794-795` matches only /outside the git repository/, which both messages contain, so it cannot tell which refusal fired. An operator who greps the printed line for the documented text finds no match, and the doc's "exits 2" for a tree in no repository describes a refusal the code does not make.
   - Finding class: doc-code-drift
   - Scope proof: two doc sentences; the engine has one reachable outside-repository message on the common path.
   - Affected surface hints: doctor-overlay-presentation.txt setting-refused row; overlays.md overlayDir paragraph; strict-writes test assertion pattern.
   - Case: skilled/.skilled-overlays.json names ../outside where ../outside is beyond the git top level; pre-commit exits 2 printing "names a folder outside the git repository at ...", not the line the presentation quotes.

## Prior-Finding Verification

- No prior finding targets this node's security dimension. The token-named backup gap (R1-P2-001, refined at iteration 2) remains the one security-relevant doc overclaim on this node.

## Traceability Checks

- spec_code: partial. overlayDir rules (`.skilled/skills/system-skilled-doctor/references/overlays.md:51`) match resolveOverlayDir's refusals for absolute, backslash, deep and dangling values; the pre-commit refusal sentence does not (finding 1).

## Integration Evidence

- Barter's printed bypass SPECKIT_SKIP_OVERLAY_SYNC=1 and the engine's protected-read rules for dotenv-named and token-named files (`.skilled/skills/system-skilled-doctor/references/overlays.md:140-155`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:258`) agree with isProtectedReadPath (`.skilled/commands/doctor/scripts/overlay-engine.cjs:2755-2758`).

## Edge Cases

- Write-once slip: after writing iteration-005.md this lineage corrected its line citations in place (a sed edit and a scripted replace) before recording it through the gateway. The recorded content matches the file; the rewrite is noted because the prompt pack bans in-place edits of iteration files.
- The R5-P1-001 counter-check ran this iteration: under the same GIT_DIR the hook's first step, status, also exits 0 (RESULT: PASSED), so the full hook sequence passes the unowned change and R5-P1-001 stands. Under GIT_DIR, status also drops its unowned-drift NOTE line, consistent with trackedTreeKeys using the same probe.

## Confirmed-Clean Surfaces

- Protected-read rules (dotenv-named never read, token-named only by exact path or protectedPaths) are documented as implemented.

## Ruled Out

- Docs recommending an unsafe bypass: bypasses are printed only beside the refusal and name the variable exactly.

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-005 (Barter hooks: edit guard and git-write gate posture on lookup failure)
- Reason: registry frontier next node
- Rotation status: F-1-003 correctness and security done
- Required evidence: barter-overlay-guard-core.cjs error path and the OpenCode plugin's handling; git-write gate aiSpeckitRoot null branch

Review verdict: CONDITIONAL
