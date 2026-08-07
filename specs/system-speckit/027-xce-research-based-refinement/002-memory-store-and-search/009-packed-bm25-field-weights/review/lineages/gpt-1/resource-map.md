# Review Resource Map

## Scope
Lineage-local resource map synthesized from converged review deltas. Target packet did not contain a packet-level `resource-map.md` at init, so the formal Resource Map Coverage Gate is not active.

## Reviewed Implementation Surfaces
| Path | Role | Review Outcome |
|------|------|----------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Packed BM25 engine, warmup, scoring, engine routing | Active P0 GPT1-F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts` | Stop-word filter used by packed tokenizer | Evidence for GPT1-F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts` | Lexical engine comparison metrics | No direct finding |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | Budget and relevance fixtures | Active P0 GPT1-F002 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Verification suite | Coverage gap tied to GPT1-F002 |

## Reviewed Packet Surfaces
| Path | Role | Review Outcome |
|------|------|----------------|
| `spec.md` | Requirements and acceptance criteria | Claims conflict with active P0s |
| `plan.md` | Delivery plan and quality gates | Done claims conflict with active P0s |
| `tasks.md` | Task evidence | Budget evidence invalidated by GPT1-F002 |
| `implementation-summary.md` | Shipped evidence | Shipped claim blocked by active P0s |
| `graph-metadata.json` | Derived packet metadata | P2 GPT1-F003 |

## Novel Logic Gaps
| Finding | Gap |
|---------|-----|
| GPT1-F001 | Production async warmup misses finalization after the last non-empty batch. |
| GPT1-F002 | Budget fixture body text is stop-word-only and therefore does not model real body postings memory. |
