# Critique — Round 002 (of round-1 plan)

**Subject**: round-1 council recommendation (option (b), helper-script orchestrator-mediated persistence)
**Critique date**: 2026-05-06T13:32:00.000Z
**Critique outcome**: AMENDMENT REQUIRED (not REVERSAL)

## Critique prompts (round-2 mandate)

1. Convergence integrity: Was round-1 convergence genuine or premature? Two seats agreed; one (Analytical) flipped under attack. Could a different framing have produced different convergence?
2. Missed failure modes: What did F1-F7 miss? Look for unexpected interactions, backward-compat, circular dependencies.
3. Hidden assumptions: Round-1 assumed callers are concentrated (`/spec_kit:*`). Is that empirically true?
4. Roadmap risk: Round-1 claimed "purely additive". Are there integration risks with packet 081 sequencing?

## New findings (severity-rated)

| ID | Finding | Source Seat | Severity | Mitigation |
|----|---------|-------------|----------|-----------|
| F8 | Helper script as Depth-1 circular dependency: at Depth >= 1, the LEAF cannot invoke the helper; the dispatching parent must. | Seat 1 (Critical) | LOW (post-mitigation) | ADD-4 §17 wording: "dispatching parent owns helper invocation post-return" |
| F9 | Backward-compat for legacy ad-hoc council outputs in pre-080 packets unspecified. | Seat 1 (Critical), refined by Seat 3 | LOW | ADD-5 scope clarification: "forward-only; legacy outputs remain in original location" |
| F10 | Per-runtime parser dialect risk if §8 phrasing diverges across `.opencode`/`.claude`/`.gemini`/`.codex` mirrors. | Seat 1 (Critical), challenged by Seat 2 | LOW (downgraded post-critique) | Existing mirror discipline (`feedback_new_agent_mirror_all_runtimes.md`) sufficient |
| F-GAP-§8 | §8 OUTPUT FORMAT evolution silently breaks helper if no shared schema artifact. | Seat 2 (Holistic) | MEDIUM | ADD-3: promote §8 to `output-schema.md` referenced by both agent body and helper |
| F-GAP-DEGRAD | Helper round-1 spec ("parse §-headers") too imprecise; needs strict-required vs optional contract. | Seat 2 (Holistic) | MEDIUM | ADD-2: graceful-degradation contract with `--strict-output` flag |
| F-FALSIFIED-CALLER | Round-1's "callers concentrated to `/spec_kit:*`" assumption FALSE per grep. Actual dispatchers: top-level Task, `@orchestrate`, CLI-skill playbooks (4 runtimes). | Seat 3 (Research) | HIGH (round-1 architecture-level miss) | ADD-1: replace assumption with explicit 4-caller-pattern enumeration in §17 |
| F-FORWARD-COMPAT | Future "deep-council" loops may need multi-iteration helper modes round-1 doesn't support. | Seat 2 (Holistic) | LOW (speculative) | Optional `--iteration NNN` / `--loop-mode` flag in helper |
| F-SEQUENCING | If packet 081 lands while `/spec_kit:*` commands are not yet wired, helper must be standalone-usable. | Seat 2 + Seat 3 | LOW | ADD-6: sequence packet 081 so helper is standalone-usable from Step 1, YAML wiring is Step 3 (convenience, not requirement) |

## Severity-weighted impact on round-1 plan

- **HIGH severity (1 finding)**: F-FALSIFIED-CALLER. Round-1's central assumption is empirically wrong. This drives ADD-1.
- **MEDIUM severity (2 findings)**: F-GAP-§8, F-GAP-DEGRAD. Both close real implementation gaps. Drive ADD-2 and ADD-3.
- **LOW severity (5 findings)**: F8, F9, F10, F-FORWARD-COMPAT, F-SEQUENCING. Documentation/scoping refinements. Drive ADD-4 through ADD-6.

## Does the critique block round-1's recommendation?

**NO.** All findings are about *implementation specification*, not *direction*. Round-1's option-(b) recommendation is confirmed directionally. The amendment tightens the spec without reversing the choice.

## Decision rule applied

- Round-1 direction confirmed by all 3 round-2 seats (independently, via different evidence paths) → convergence is genuine.
- Round-2 found gaps that round-1 missed → amendment is justified.
- Round-2 did NOT find a defect in option (b) itself → reversal is not justified.

**Outcome**: AMENDMENT REQUIRED, NOT REVERSAL.

## Cross-references

- Round-1 deliberation: `../deliberations/round-001.md`
- Round-1 plan (council-report): `../council-report.md` (now updated with amendment)
- Round-2 deliberation: `../deliberations/round-002.md`
- Round-2 seats: `../seats/round-002/seat-{001,002,003}-*.md`
- Memory: `feedback_new_agent_mirror_all_runtimes.md` (referenced for F10 mitigation)
