# Multi-AI Council Report: Packet 089 persistence helper

## Task Classification

- **Type**: Architecture / implementation planning
- **Council Seats Dispatched**: 3: Analytical / cli-opencode, Critical / cli-claude-code, Pragmatic / native
- **Dispatch Mode**: Sequential Depth 1
- **Vantage Integrity**: Simulated external vantage lenses, labeled

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Analytical | cli-opencode | Verify parser and artifact shape against packet scope | 86 |
| seat-002 | Critical | cli-claude-code | Attack path-scoping, idempotency, and missing-section behavior | 88 |
| seat-003 | Pragmatic | native | Keep the helper small enough for maintenance | 82 |

### Seat 001 - Analytical / cli-opencode

#### Proposed Plan

Create the helper as a CommonJS module with exported parse, render, write, and state-line functions.

#### Reasoning

The parser should treat the council report as markdown with tolerant heading aliases. The renderer should produce deterministic files so re-running the same round has byte-identical output.

#### Risks & Trade-offs

The parser is intentionally shallow. It reads headings and tables rather than constructing a full markdown AST.

#### Assumptions and Evidence Gaps

- The report keeps the four strict-required sections.
- Optional sections may drift and should not block persistence.

#### Alternative Challenged

Using JSON Schema was rejected because the report is narrative markdown, not structured JSON.

#### Confidence

86: the approach matches sibling reducer scripts without inheriting their heavier machinery.

### Seat 002 - Critical / cli-claude-code

#### Proposed Plan

Fail closed before any writes when strict-required sections are missing. Resolve all output paths under `<packet>/ai-council` and reject traversal.

#### Reasoning

The failure mode to avoid is partial persistence outside the packet. Path resolution and pre-write parsing neutralize that risk.

#### Risks & Trade-offs

Strict path-scoping needs explicit tests and a simple implementation. The helper should not write secrets or large state payloads into JSONL.

#### Assumptions and Evidence Gaps

- Callers provide the full council report.
- Dispatching parents, not the council LEAF, invoke the helper.

#### Alternative Challenged

Letting the LEAF self-persist was rejected because the agent keeps `write: deny`.

#### Confidence

88: the safety boundary is straightforward and testable.

### Seat 003 - Pragmatic / cli-opencode

#### Proposed Plan

Ship the helper first, then add the agent body caller protocol and mirror parity test.

#### Reasoning

Manual invocation must work before command YAML integration. That keeps the packet valuable even before future wiring.

#### Risks & Trade-offs

The first helper should not attempt dashboards, graph events, or convergence math.

#### Assumptions and Evidence Gaps

- Future packets can add advisory checks after the helper exists.

#### Alternative Challenged

Building a dedicated skill folder was rejected as maintenance overhead.

#### Confidence

82: the plan is small and additive.

## Strategy Comparison

| Dimension | Weight | Seat 1 | Seat 2 | Seat 3 |
| --- | --- | --- | --- | --- |
| Correctness | 30% | 27 | 28 | 25 |
| Completeness | 20% | 17 | 18 | 15 |
| Elegance | 15% | 13 | 12 | 14 |
| Robustness | 20% | 16 | 18 | 14 |
| Integration | 15% | 14 | 14 | 13 |
| Pre-Critique Total | 100% | 87 | 90 | 81 |
| Post-Critique Adjustment | +/-10 | -1 | -2 | +1 |
| Final Total | 100% | 86 | 88 | 82 |

## Deliberation Notes

- **Round 1 Independent Findings**: All seats agree helper-first sequencing is necessary.
- **Round 2 Cross-Critique**: Seat 2 forced path-scoping and no-write-before-parse behavior.
- **Round 3 Reconciliation**: Seat 1's deterministic renderer and Seat 3's small-scope rule were merged.

## Winning Strategy

- **Leader**: seat-002, Score: 88/100
- **Key Strength**: Fail-closed persistence boundary.
- **Complementary Elements**: Deterministic render from seat-001 and helper-first sequencing from seat-003.

## Recommended Plan

Implement `persist-artifacts.cjs` as a parse-and-write helper under `system-spec-kit/scripts/ai-council/`. Add the markdown schema reference and fixture-driven tests. Then update the agent body and runtime mirrors with a caller-owned persistence protocol.

## Implementation Steps

1. **Helper**: create the CJS module and tests. (Source: seat-001)
2. **Schema**: document required and optional sections. (Source: seat-002)
3. **Mirrors**: update all four runtime agent bodies and add parity coverage. (Source: seat-003)

## Prerequisites

- Packet 080 output protocol exists.
- Packet 089 spec folder is established.
- The Multi-AI Council remains planning-only.

## Plan Confidence

- **Overall**: 86%
- **Strategy Agreement**: strong
- **Consensus Quality**: strong, with explicit failure-mode critique
- **Risk Level**: low

## Cross-References

- `.opencode/agents/ai-council.md` §8
- `.opencode/skills/system-spec-kit/references/ai-council/output-schema.md`

## Dropped Alternatives

- **Dedicated skill folder** (Score: 48/100): rejected because ADR-001 keeps the agent lightweight.
- **LEAF self-persistence** (Score: 40/100): rejected because write/edit/bash/patch stay denied.

## Risks & Mitigations

- Parser drift: mitigate with output-schema.md lockstep and fixtures.
- Mirror drift: mitigate with mirror parity test.
- Caller confusion: mitigate with §16 caller recipes.

## Planning-Only Boundary

No files were modified by the Multi-AI Council. The dispatching parent persists artifacts after the LEAF returns.
