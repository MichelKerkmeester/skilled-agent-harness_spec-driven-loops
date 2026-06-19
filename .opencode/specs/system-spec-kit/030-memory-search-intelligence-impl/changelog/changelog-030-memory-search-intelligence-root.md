# Changelog Rollup, Packet 030: Memory Search Intelligence Implementation (Wave-0)

> Spec folder: `.opencode/specs/system-spec-kit/030-memory-search-intelligence-impl` (Level 3, flat packet)

Top rollup for packet 030, the Wave-0 implementation of packet 028's memory-search-intelligence research roadmap. The packet is flat with no phase children, so the changelog units are the four touched subsystems. Each row links to that subsystem's changelog. The candidate truth table lives in `../spec.md` section 14 and the closeout narrative lives in `../implementation-summary.md`.

## What shipped

Eleven Wave-0 candidates shipped across four subsystems as small, independently reversible, individually tested commits on the `system-speckit/028-memory-search-intelligence` branch. Two candidates were deliberately deferred to Wave-1 with evidence, both in the memory store and hygiene subsystem. Every shipped candidate keeps the default path byte-identical unless it explicitly and provably changes the default. No candidate carries a measured before-and-after benefit number. The ship gate was correctness, reversibility and default-order stability, not a promised delta.

## Included Units

| Subsystem | Changelog | Shipped candidates | Deferred |
|-----------|-----------|--------------------|----------|
| Memory search and ranking | [changelog-memory-search-ranking.md](./changelog-memory-search-ranking.md) | 2, 3, 4, 5 | none |
| Memory store and hygiene | [changelog-memory-store-hygiene.md](./changelog-memory-store-hygiene.md) | 7, 8, 9, 10 | 6, 11 |
| Code Graph | [changelog-code-graph.md](./changelog-code-graph.md) | 13 | none |
| Deep Loop | [changelog-deep-loop.md](./changelog-deep-loop.md) | 1, 12 | none |

## Deferred candidates

Both deferrals are documented in the memory store and hygiene changelog and in `../decision-record.md`.

- **Candidate 6, C4-A idempotency-receipts default-on.** Default flip breaks 11 `handleMemoryUpdate` tests. Deferred to Wave-1 pending save and update-path scoping.
- **Candidate 11, M-system-kind-exclusion.** Live-DB review proved `source_kind='system'` is 9,592 canonical spec-docs including 29 constitutional rules, not substrate noise. Deferred to Wave-1 pending a true substrate signal plus a constitutional and spec-doc short-circuit.

## Verification at closeout

The combination of all nine code commits is green on the touched-subsystem suites: 666 memory tests, 80 code-graph tests and 58 deep-loop tests pass. The broad Memory MCP suite stays red from historical IPC, launcher and fixture drift, confirmed pre-existing on baseline `1ecc531431` with no 030 candidate-seam failure. Strict packet validation passes with 0 errors and 0 warnings.
