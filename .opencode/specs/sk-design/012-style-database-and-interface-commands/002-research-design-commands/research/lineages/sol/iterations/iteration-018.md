# Iteration 18: Proof and Output Contract

## Focus
Make command usefulness, authority, and verification visible rather than implicit in prose.

## Findings
1. **Common envelope:** every command returns `Route Proof`, `Resolved Brief`, `Context Manifest`, `Grounding Record`, `Creation/Remediation Artifact`, `Critique or Validation`, `Evidence Ledger`, and `Next Action/Handoff`. Command-specific labels may refine these blocks but cannot omit them.
2. **Evidence levels:** `authored` (specified but not executed), `observed` (direct inspection), `measured` (tool-produced metric), `validated` (deterministic schema/static gate), `verified` (acceptance scenario passed), `blocked` (required proof unavailable), and `not-applicable`. Do not collapse these into one boolean.
3. **Evidence item schema:** `{claim, level, method, sourceOrCommand, artifact, scenario, expected, observed, timestamp, limitations}`. A claim cannot use a stronger level than its method supports; missing runtime transport yields `authored` or `blocked`, not `verified`.
4. **Per-command proof:** design requires anti-default critique plus optional render inspection; foundations requires contrast/readability/responsive/theme validation; motion requires state continuity, input/reversal, reduced-motion, and runtime quality when built; audit requires reproducible findings and matched baseline/re-test for delta; design-reference requires schema validation, provenance, and capture coverage.
5. **Template tests:** assert canonical route/mode, all common blocks, normalized grounding fields or explicit no-fit, assumption ledger, no embedded taste presets, no direct app-code mutation, accepted handoff schema, and evidence-level consistency. Alias tests additionally assert argument and output parity.

## Proof Matrix
| Command | Deterministic minimum | Runtime upgrade |
|---|---|---|
| design | brief + critique + handoff schema | representative render inspection |
| foundations | token/schema + static contrast/layout checks | browser viewport/theme checks |
| motion | state/choreography/reduced-motion contract | interaction and frame-quality scenarios |
| audit | evidence ledger + severity/confidence | matched baseline/re-test delta |
| design-reference | DESIGN.md schema + provenance | sampled visual coverage |

## Ruled Out
- Universal `verified: true`.
- Evidence-free completion prose.
- Requiring runtime proof for advisory-only outputs while failing to label the ceiling.

## Assessment
- New information ratio: 0.43
- Novelty justification: Establishes seven evidence levels, a normalized evidence schema, per-command gates, and template assertions.

## Recommended Next Focus
Test cross-command composition so design, foundations, motion, audit, and reference extraction form one coherent lifecycle without hidden recursion.
