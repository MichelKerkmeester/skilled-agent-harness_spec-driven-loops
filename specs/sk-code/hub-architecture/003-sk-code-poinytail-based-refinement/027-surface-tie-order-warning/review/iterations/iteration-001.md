# Deep Review - Iteration 001

- Run: sessionId `2026-10-13T15:53:35.000Z`, generation 1, lineageMode new
- Mode: review | Dimension: correctness (D1) | Iteration 1 of 5
- Target: commit a682c06d3d, diff c62d7d1399..a682c06d3d (doctor check 5l, its tests, the README sentence, and the packet docs)

## Dimension

D1 Correctness: logic errors, off-by-one, broken invariants, behavior on the spec's stated shapes, and whether the new tests actually pin what the spec claims. The whole target diff was read; check 5l and its neighbours (5e, 5i, 5j) were read in the live file. `decision-record.md` and the live `.skilled/skills/sk-code/hub-router.json` were not opened this iteration (deferred, recorded in the search ledger).

## Files Reviewed

| File | Locations | What was checked |
|------|-----------|------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | 1019, 1076-1089, 1144-1157, 1159-1177, 1313-1342 | 5l body and message, call order after 5i, tieBreak normalization, 5e/5i interplay, heading range |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | 241-258, 311-322, 478-501 | `addNamedSurfaces`, the three 5l tests, the clean-fixture baseline assertions |
| `README.md` | 1465-1471 (via the target diff) | the new hand-edit sentence |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md` | 1-180 | REQ-001..REQ-004, SC-001/002, NFR-R01, edge cases |

Behavior was walked by hand against four tieBreak shapes: the shipped order, a user surface after the native surface, the examples removed with the user surface ahead, and a workflow mode placed after the native surface.

## Findings by Severity

No P0 and no P1 this iteration, so the claim-adjudication fields are not applicable.

### P0 - Blockers

None.

### P1 - Required

None.

### P2 - Suggestions

#### R1-P2-001 [P2] No test pins 5l's silence on non-sk-code hubs

- Case: a refactor that drops or widens the `ctx.basename !== 'sk-code'` gate makes check 5l print a PASS line on every hub; the suite stays green because the clean-fixture test asserts a fixed list of expected PASS ids plus a global no-FAIL/WARN match, and neither forbids an extra `5l` line.
- File: `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:311-322`
- Evidence: the gate is [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166]; the only global assertion is `assert.doesNotMatch(output, /^(FAIL|WARN): /m)` [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315], and the id loop below it asserts presence, never absence. The spec's edge case says a non-sk-code hub prints nothing [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:158], and NFR-R01 promises every other doctor line is unchanged [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:147].
- User impact: if the gate regresses, the other six hubs gain unexpected doctor output and NFR-R01 fails silently.
- Finding class: matrix/evidence
- Scope proof: all three 5l tests (lines 478-501) and the clean-fixture test were read; no assertion in the file forbids a 5l line on a non-sk-code hub.
- Affected surface hints: ["doctor check 5l", "clean-fixture baseline test"]
- riskScore: 2 (advisory only)
- Recommendation: add `assert.doesNotMatch(output, /: 5l:/m)` to the clean-fixture test, or a dedicated case on a non-sk-code hub.
- confidence: high; downgradeTrigger: a repository-wide convention that the suite never asserts absence of a check line.

#### R1-P2-002 [P2] The 5l FAIL message's two named fixes are not pinned by the tests

- Case: a future edit that trims the 5l FAIL message down to the surface name keeps all three 5l tests green; test 1 asserts only that `sk-code-acme` appears after the id, and neither fix phrase is asserted anywhere.
- File: `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:478-485`
- Evidence: the assertion is `assertLine(output, 'FAIL', '5l', 'sk-code-acme')` [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:482]; the message does name both fixes today [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]. REQ-001 requires the report "with the two fixes named" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:103], and tasks.md CHK-012 repeats it.
- User impact: the check's operator value (telling a hand-editing user how to fix the order) could regress with no red test.
- Finding class: matrix/evidence
- Scope proof: the three 5l tests were read in full; the only message-content assertion is the surface name in test 1.
- Affected surface hints: ["doctor check 5l message", "5l failing-case test"]
- riskScore: 2 (advisory only)
- Recommendation: extend test 1's detail assertion to also match one fix phrase (for example `move them ahead`), or add a regex match covering both fixes.
- confidence: high; downgradeTrigger: a decision that message prose is intentionally unpinned.

## Traceability Checks

- `spec_code`: pass. REQ-001 -> check 5l body and message (`parent-skill-check.cjs:1165-1177`) plus the failing test (`test file:478-485`); REQ-002 -> shipped-order test (`test file:487-493`); REQ-003 -> examples-removed test (`test file:495-501`); REQ-004 -> the basename gate (`parent-skill-check.cjs:1166`) with the global no-FAIL/WARN assertion (`test file:315`). Spec scope items: heading range corrected (`parent-skill-check.cjs:1019`), README sentence added (`README.md:1468`). Parent bookkeeping in the same commit (goal.md PASSED count 27 -> 28, phase table row, graph-metadata child list) is arithmetically consistent with the new packet.
- `checklist_evidence`: partial. The phase is mid-review: tasks.md closure rows (T007-T009, CHK-010 onward) are open by design, and the evidence documents outside the review scope (implementation-summary.md, acceptance-criteria.md) were not opened this iteration. Deferred to the traceability iteration.
- Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): pending; not exercised this iteration.
- Deferred this iteration: the live-hub confirmation of REQ-002/SC-002 (reading `.skilled/skills/sk-code/hub-router.json` or running the doctor) and the decision-record.md ADR-001/002 cross-check. Both are recorded in the search ledger.

## Verdict

No P0 and no P1; two P2 advisories, so this iteration is PASS with advisories. On the read evidence the shipped behavior matches REQ-001..REQ-004 and every stated edge case (native surface absent, workflow mode after it, other hubs): the gate is hub-scoped, the filter is surface-only and strictly-after, the message names the misplaced surfaces and both fixes, malformed input cannot crash the check (`tieBreak` is normalized at `parent-skill-check.cjs:1329`), and a duplicated native entry is already reported by 5e (`parent-skill-check.cjs:1076-1089`). No false-fail or false-pass path was found for the four tieBreak configurations examined. The two P2s are regression-pinning gaps in the tests, not shipped-behavior defects.

## Next Dimension

D2 Security: confirm check 5l adds no new input or execution surface (it reads two already-parsed JSON files, executes nothing, and writes nothing), then D3 Traceability, which picks up the deferred items (ADR-001/002 cross-check, checklist evidence, live-hub confirmation).

Review verdict: PASS
