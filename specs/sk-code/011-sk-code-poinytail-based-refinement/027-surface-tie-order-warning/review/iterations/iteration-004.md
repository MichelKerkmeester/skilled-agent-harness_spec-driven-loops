# Iteration 004 — Maintainability

## Dimension
`maintainability` — the last uncovered dimension (coverage was 3/4: correctness, security, traceability).

## Files Reviewed
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` — check 5l [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1159-1177], tie-order neighbor 5i [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1142-1157], hub-router call chain [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1332-1341], section heading [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1019]
- `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` — `addNamedSurfaces` [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:241-258], clean-fixture baseline [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:311-322], the three 5l tests [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:478-501]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md` (full read; REQ-001 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:103], edge cases [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:156-158])
- Repo-wide exact-search sweep for producer mirrors and stale heading-range citations (results in the search ledger below).

Not re-opened this iteration (call budget; all verified in iterations 1-3): `README.md:1468`, `decision-record.md`, `goal.md`, `.skilled/skills/sk-code/hub-router.json`.

## Findings by Severity

### P0
None.

### P1
None.

### P2
1. **R4-P2-001 — 5l re-derives the mode-to-packetKind map that 5i already builds in the same call chain**
   - Case: a future edit to how `packetKind` is resolved (normalization, alias fallback) lands in `checkTieBreakOrder` but not `checkNativeSurfaceLast`; 5l then evaluates stale kinds, its surface-only filter misclassifies entries, and the two checks disagree about the same `tieBreak`.
   - File: `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1169` (twin at `:1145`)
   - Evidence: the identical expression `new Map(ctx.modes.map((m) => [m.workflowMode, m.packetKind]))` appears in both checks, which `checkHubRouter` calls back-to-back [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1339-1340].
   - User impact: maintainers must keep two identical derivations in sync; drift surfaces as inconsistent 5i/5l verdicts on the same `hub-router.json`.
   - Finding class: `instance-only`. Scope proof: both occurrences sit in one call chain; no third occurrence in the reviewed window.
   - riskScore: 2 (advisory only).
   - Recommendation: hoist a single derivation — a small helper, or one map computed in `checkHubRouter` and passed to both checks.
   - Counterevidence sought: per-check self-containment is the file's prevailing style (`checkSubworkflowSignals`, `aliasDrift` build their own structures); if that is deliberate policy, this is a note only.

Carried open P2s (not re-adjudicated this iteration): R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001.

## Traceability Checks
| Protocol | Kind | Result | Detail |
| --- | --- | --- | --- |
| `spec_code` | core | pass | Carried from iteration 3 and re-confirmed on the live files: heading reads 5a-5l; constants and function present; call site present; the three tests pin the REQ-001/002/003 orders. |
| `checklist_evidence` | core | partial | Closure rows remain open by design; carried from iteration 3. |
| `skill_agent` | overlay | notApplicable | No SKILL.md or agent artifact in the diff. |
| `agent_cross_runtime` | overlay | notApplicable | No cross-runtime artifact in the diff. |
| `feature_catalog_code` | overlay | deferred | No catalog artifact in the diff. |
| `playbook_capability` | overlay | deferred | No playbook artifact in the diff. |

## Search Ledger Highlights
- `mirror_parity` (deferred since iteration 1): **ruled out** — the repo-wide sweep found exactly one home for the check and its helper; no mirrored producer exists to drift.
- `stale_reference`: **ruled out** — no live citation of the old `5a-5j` range remains; the only mentions are the removed diff line and the spec's own change description.
- Source placement of 5l between 5i and 5j: examined, no action — thematic grouping with its tie-order neighbor; report-line order is not contractual.
- `addNamedSurfaces` vs pre-existing `addSurfaceMode`: deferred — helper body not re-read (budget); call sites serve distinct fixtures.

## Verdict
**PASS** — no P0/P1 findings. One new advisory P2 (R4-P2-001) plus four carried P2s, so advisories are present.

## Next Dimension
None — maintainability completes the coverage matrix (4/4). Iteration 5 is the closure/synthesis pass.

Review verdict: PASS
