# Deep Review - Iteration 002

- Run: sessionId `2026-10-13T15:53:35.000Z`, generation 1, lineageMode new
- Mode: review | Dimension: security (D2) | Iteration 2 of 5
- Target: commit a682c06d3d, diff c62d7d1399..a682c06d3d (doctor check 5l, its tests, the README sentence, and the packet docs)

## Dimension

D2 Security: whether check 5l adds a new input, execution, or output surface, and whether its report text can be abused. Four questions were walked against the live file:

1. New input - none. 5l reads only `tieBreak` and `ctx.modes`, both already parsed in `checkHubRouter` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1324-1329].
2. New execution - none. The body is `indexOf`/`Map`/`slice`/`filter`/`includes`/`join` over already-parsed values [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1165-1177].
3. New filesystem, network, or write effect - none.
4. Output - the FAIL message interpolates raw `tieBreak` entries; the emit helpers print message text verbatim, wrapping only the severity prefix for TTY color [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:171-189]. Recorded as R2-P2-001.

Malformed-input note: `tieBreak` is normalized to an array [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1329], and 5l's `kindByMode` construction is identical to 5i's, which runs first, so 5l adds no new crash surface. The raw-interpolation pattern pre-exists across 5b-5k; 5h is the one neighbour that escapes its value [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1138].

## Files Reviewed

| File | Locations | What was checked |
|------|-----------|------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | 1040-1374 (5b-5l, `checkHubRouter`), 154-189 (output helpers) | 5l body and message, neighbouring interpolation sites, emit-helper filtering, tieBreak normalization, call order |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | 238-258, 475-501 (via the target diff) | `addNamedSurfaces` fixture helper and the three 5l tests |
| `README.md` | 1466-1472 | the new hand-edit sentence |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md` | scope, risks, NFR and edge-case sections (via the target diff) | REQ/SC/NFR/edge-case statements re-read for the security lens |

Search sweep: `stripAnsi|sanitiz|ANSI|001b` over `.skilled/commands/doctor/scripts` returns no sanitizer for this file; the only ANSI matches are an unrelated color helper in `route-validate.py` and a shell comment.

## Findings by Severity

No P0 and no P1 this iteration.

### P0 - Blockers

None.

### P1 - Required

None.

### P2 - Suggestions

#### R2-P2-001 [P2] 5l interpolates raw routerPolicy.tieBreak entries into the doctor report

- Case: a `routerPolicy.tieBreak` entry containing a control character (an ANSI erase-line sequence, a carriage return, or an embedded newline) is printed verbatim by check 5l, so the rendered doctor report can erase or fabricate lines and mislead the reader about which surface is misplaced - or hide the FAIL line entirely.
- File: `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1173`
- Evidence: the FAIL message joins the raw entries (`late.join(', ')` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]); the emit helpers print message text verbatim with no control-character filtering (`pass`/`fail`/`warn`/`info` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:171-184], `softFail` only routes to `fail`/`warn` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:187-189]); a sweep of `.skilled/commands/doctor/scripts` for `stripAnsi|sanitiz|ANSI|001b` finds no sanitizer for this file. The same raw-interpolation pattern pre-exists at lines 1040, 1054, 1071, 1087, 1108, 1152, 1196, while the neighbouring 5h message escapes its value [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1138].
- User impact: a hand-edited or contributed tieBreak value carrying terminal control sequences can make the 5l line (and adjacent report text) render deceptively for the operator and for CI-log readers; the exit status is unaffected, so this is a readability/spoofing hazard, not a gate bypass.
- Finding class: class-of-bug
- Scope proof: grep sweep over `.skilled/commands/doctor/scripts` returns no sanitizer helper; the `join(', ')`-into-message pattern appears at the neighbour lines above, so a central fix in the emit helpers covers the same class.
- Affected surface hints: ["doctor report text", "softFail/pass message sites", "tieBreak-derived strings"]
- riskScore: 2 (advisory only)
- Recommendation: filter C0/C1 control characters when interpolating config-derived strings into report text - centrally in the emit helpers, or at minimum in 5l's FAIL message - and add one adversarial test with a control-character entry.
- confidence: medium-high; counterevidenceSought: `hub-router.json` is repository-owned config at the same trust level as the checker, and the doctor's exit status remains the gate, so no trust boundary is crossed; downgradeTrigger: evidence that a downstream consumer already strips control characters, or a decision that raw passthrough is intended.
- alternativeExplanation: values come only from tooling-written config, so a malformed entry is more likely operator error than attack; that lowers urgency but does not remove the deceptive-rendering failure mode.

## Traceability Checks

- `spec_code`: pass. 5l matches the spec's security-relevant scope: hub-gated [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166], surface-only and strictly-after filter, and both fixes named in the message [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]. SC-001/SC-002, the risks table (PARENT_HUB_CHECK_STRICT=0 downgrades to WARN) and NFR-R01 were re-read in the target diff; the edge-case statements (spec.md:147, spec.md:158) carry iteration-001's verified citations.
- `checklist_evidence`: partial. CHK-030 (no hardcoded secrets) and CHK-031 (the check reads two JSON files it already parses and executes nothing new) were verified against the live code; CHK-032 (no auth surface) is consistent. The closure rows (CHK-010 onward) remain open by design; the traceability iteration picks them up.
- Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): pending; not exercised this iteration.
- Deferred this iteration (recorded in the search ledger): `decision-record.md` ADR-001/002 cross-check and the live-hub confirmation of REQ-002/SC-002.

## Verdict

No P0 and no P1; one new P2 advisory, so this iteration is PASS with advisories (three open P2s total). On the read evidence check 5l adds no new input, execution, filesystem, or write surface: it consumes two already-parsed JSON values, and its only outward effect is report text. The one security-relevant observation is output interpolation without control-character filtering, framed as hardening because hub-router.json is repo-trusted config (no trust boundary crossed) and the doctor's exit status remains the gate. Malformed input cannot crash 5l beyond the crash surface 5i already establishes, and no false-pass path was found.

## Next Dimension

D3 Traceability: the ADR-001/002 cross-check, checklist-evidence closure, and the live-hub confirmation of REQ-002/SC-002 that iteration 1 deferred.

Review verdict: PASS
