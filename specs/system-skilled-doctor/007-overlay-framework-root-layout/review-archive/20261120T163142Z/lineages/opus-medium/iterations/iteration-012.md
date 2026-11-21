# Iteration 012 - Frontier node F-1-008: traceability

## Dispatcher
- Lineage opus-medium, iteration 12 (11 prior iteration records). steer.md absent. Node F-1-008, dimension traceability.
- Review focus addressed: the parent packet's phase map and handoff criteria against the five children, and the ai-speckit close-out record (specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout, committed in ad3246feba2) against the commits and runs it cites. Test strength of the Barter hook tests was followed up where the record names a regression the tests missed.

## Files Reviewed
- specs/system-skilled-doctor/007-overlay-framework-root-layout/spec.md:48,78-82,116-164
- barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:14,54-62,96,106-113
- specs/.../004-barter-repin-and-relayout/implementation-summary.md:70, tasks.md:51,77-78,100
- specs/.../005-barter-move-overlays-out-of-tree/implementation-summary.md:65,94; spec.md:172,210,243,248
- barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:6-7,50
- barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:39-80

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The Barter OpenCode plugin tests stub the upstream bridge, so they cannot catch the bridge rename that disabled both plugins** -- barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:63 -- The fixture writes its own `.opencode/plugins/lib/v2-bridge.js` exporting `definePlugin` (:63-66) instead of loading the vendored bridge. The plugin imports `definePlugin` from that bridge (barter-overlay-guard.js:6). The ai-speckit close-out record (implementation-summary.md:96) and 005 implementation-summary.md:94 both say the re-pin to 063daae renamed the bridge export, both Barter OpenCode plugins stopped loading, and the edit guard did not run in OpenCode sessions. Phase 004's verification still reported its overlay tests at the baseline (122 tests, 11 known failures, no new one), so this suite stayed green through that regression, and it would stay green through the next rename too.
   Finding class: test strength
   Scope proof: the guard plugin test and its git-write-gate sibling are the only tests that load the plugin modules; the guard test builds the bridge stub itself, and phase 004's suite run shows no new failure after the breaking re-pin.
   Affected surface hints: overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs, barter-git-write-gate.test.cjs fixtures
   Case: the next re-pin renames `definePlugin` in the vendored v2-bridge.js; both plugins fail to load in OpenCode, every plugin test still passes, and the edit guard is off until someone notices by hand.

## Traceability Checks
- spec_code (pass): the parent phase map (spec.md:78-82) matches what each child delivered, and the close-out record's five commits (implementation-summary.md:58-62) match `git log 64cfee51628..ad3246feba2` in ai-speckit.
- checklist_evidence (partial): phase 004 closed Complete without noting that its re-pin left both Barter OpenCode plugins unloadable; the regression appears only in 005 and the ai-speckit record. The finding above covers the test gap that let it pass.

## Integration Evidence
- OpenCode plugin barter-overlay-guard.js imports `./lib/v2-bridge.js` (upstream-owned) and the guard core by relative path.

## Edge Cases
- Parent spec.md:79 says "root/X with the leading dot dropped" while the engine drops every leading dot (`replace(/^\.+/, '')`); the release note says "leading dots". Wording only; not raised.

## Confirmed-Clean Surfaces
- Handoff rows (spec.md:136-139) each name a command whose result the next phase records (pin line, offLayout=0, in-sync=487).

## Ruled Out
- Close-out commit list mismatch with git history.

## Next Focus
- Dimension: maintainability
- Focus area: F-1-002 engine code shape after the change
- Reason: traceability done on all four nodes

Review verdict: PASS
