# Deep Review — Iteration 005

**Mode:** review · **Iteration:** 5 of 5 (final) · **Dimension:** correctness · **Target:** commit a682c06d3d (diff c62d7d1399..a682c06d3d), doctor check 5l

## Dimension
correctness. Final iteration; all four dimensions were already covered (correctness 1, security 2, traceability 3, maintainability 4). This pass re-verified 5l's spec mapping and took one fresh direction the prior iterations did not enter: the fidelity of the new `addNamedSurfaces` fixture helper. The directions recorded as exhausted (the prior `spec_code`/`checklist_evidence` passes, the deferred ADR/live-hub confirmation) were not re-entered.

## Files Reviewed
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1019, 1092-1116, 1159-1177`
- `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:1-220, 243-258, 311-322, 352-443, 478-501`
- `README.md:1466-1472`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:75-158`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:32-220`
- `goal.md` was not re-opened this iteration; its criteria were verified in the traceability iteration.

## Findings by Severity

### P0 (Blockers)
None.

### P1 (Required)
None.

### P2 (Suggestions)

**New this iteration**

**R5-P2-001 — `addNamedSurfaces` leaves the 5l fixtures non-canon-clean** — correctness, confidence high.
- **Claim**: The new helper registers the named surfaces (registry, signals, tieBreak, packets) but, unlike its two sibling helpers, never sets `routerPolicy.outcomes.surfaceBundle`, never extends the fixture's description keywords or the `demo` vocabulary class, and never calls `regenerateManifest`. Every 5l run therefore carries unrelated drift: the leaf-manifest goes stale once the packets are written (the same mechanism the 10b case pins [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:418]), the 5k alias and packet legs report each added surface [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1217-1249], and `outcomes.surfaceBundle` stays unset, the field 5f requires once a hub has surface packets [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1113-1114].
- **Evidence**: helper body [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:243-258]; sibling `addSurfaceMode` sets keywords, `surfaceBundle` and regenerates [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:189-213]; sibling `addTransportMode` regenerates [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:216-238].
- **Counterevidence sought**: Tests 2 and 3 assert only `5l` lines, so the drift does not invalidate the pins; the sk-code fixture is already red by design (5k-canary), so exit codes were never the discriminating evidence — which explains why the drift went unnoticed.
- **Alternative explanation**: The helper may deliberately stay minimal because only 5l's lines matter; that explains tests 2 and 3, but not the divergence from both siblings' canon-clean discipline, and test 1's `status === 1` assertion [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:484] cannot discriminate 5l's FAIL from the drift.
- **Final severity**: P2. **Downgrade trigger**: if the fixtures are documented as intentionally red, this becomes a note; if the assertions are tightened to require an otherwise-green run, re-score to P1.
- **Recommendation**: mirror `addSurfaceMode`: set `outcomes.surfaceBundle`, extend `description.json` keywords and the `demo` class, and call `regenerateManifest` after writing the packets.

**Still active from prior iterations** (all P2, all correctness; none was fixed inside the commit under review, which is the commit the findings were raised against):
- R1-P2-001 — no test pins 5l silence on non-sk-code hubs.
- R1-P2-002 — the 5l FAIL message's two named fixes are not pinned by the tests.
- R2-P2-001 — 5l interpolates raw `routerPolicy.tieBreak` entries into the doctor report.
- R3-P2-001 — the spec's 5l edge-case silence statements are unpinned by the shipped tests.
- R4-P2-001 — 5l re-derives the mode-to-packetKind map that 5i already builds.

## Traceability Checks
- **spec_code: pass.** REQ-001 → the FAIL message names both fixes [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]; REQ-002 → the shipped-order test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:487-493] plus the PASS line [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1176]; REQ-003 → the examples-removed test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:495-501]; REQ-004 → the basename gate [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] with the global no-FAIL/WARN assertion [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315]. The three edge-case clauses [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:156-158] were re-read against the return paths [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1168] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171] and match. ADR-001's constants and ADR-002's `softFail` choice [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:62-64] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:158-160] are what the code does; the heading [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1019] and the README sentence [SOURCE: README.md:1468] are in place.
- **checklist_evidence: partial.** Carried from iteration 2 (CHK-030..032); the closure rows stay open by design mid-phase.
- **Overlays** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not exercised; pending as recorded.

## Verdict
PASS with advisories (`hasAdvisories=true`): no P0 or P1 this iteration; one new P2 plus five carried P2s remain open. The commit's stated behavior holds on every claim re-checked: hub-gated, surface-only, strictly-after filtering with the two-name exemption, both fixes named, heading range `5a-5l`, README sentence, and the three tests pinning fail/pass/pass.

## Next Dimension
None — iteration 5 of 5 is complete; synthesis and the release decision follow.

Review verdict: PASS
