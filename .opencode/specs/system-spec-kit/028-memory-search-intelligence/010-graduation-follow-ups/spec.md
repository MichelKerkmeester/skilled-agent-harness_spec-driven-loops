---
title: "Spec: Dark Flag Graduation Follow-Ups"
description: "Implements the production-readiness follow-ups the 009 pre-graduation validation identified, so each dark-flag winner can earn its flip on evidence rather than on a conditional verdict. The code-graph track sets a sensible degree-cap default and wires the bitemporal close-and-insert writer into the reindex path with a live integration test. The deep-loop track sets production defaults for the lag ceiling and progress heartbeat and proves they inform without flooding, plus a scale-test for the finding dedup beyond its 17 synthetic records. The search track adds an append-exempt path so tail-appended rows survive the response-serialization token budget, and a density probe for the true-citation ledger. The advisor track documents and tests the implicit self-recommendation penalty that the cut guard relied on. Every change stays behind its existing default-off flag, with the lone deliberate exception of the deep-loop gauge defaults, which become active and are flood-tested. Testing runs through a cli executor."
trigger_phrases:
  - "dark flag graduation follow-ups"
  - "production readiness for the graduated flags"
  - "wire the bitemporal writer"
  - "set the degree cap and gauge defaults"
  - "append-exempt serializer and citation density probe"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
---
# Spec: Dark Flag Graduation Follow-Ups

## 1. METADATA

Phase-parent for the production-readiness work that clears the conditions the 009 validation set on the dark-flag winners. Four sub-phase children, one per subsystem. Every change lands behind the feature's existing default-off flag and is verified by a cli test pass.

## 2. PROBLEM & PURPOSE

The 009 validation confirmed the winners are correct and byte-identical when off, but qualified the graduate-ready posture: the bitemporal writer is unwired, the staleness degree cap and the deep-loop gauges default to off, the dedup was only proven on synthetic records, and the cut self-recommendation guard left an undocumented implicit penalty as the sole defense. This packet closes each gap so a flip decision rests on evidence.

## 3. SCOPE

### In Scope

- **Code graph:** a non-zero degree-cap default, and the bitemporal close-and-insert writer wired into the reindex edge-replacement path behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`, with a live integration test.
- **Deep loop:** production defaults for the lag ceiling and the progress heartbeat that inform without flooding under concurrent pools, and a scale-test for the finding dedup.
- **Search:** an append-exempt path so tail-appended rows survive the response-serialization token budget, and a density probe for the true-citation ledger.
- **Advisor:** a documented, tested contract for the implicit `auditRecsAdvisorPenalty` so a future refactor cannot silently remove the sole self-recommendation defense.

### Out of Scope

- Flipping any production default to on (the graduation decision stays separate, except the gauge defaults which this packet deliberately activates and flood-tests).
- The multihop production reader-depth measurement (needs production telemetry, deferred).
- The advisor RRF fusion, which 009 cleared with no change required.

## 4. REQUIREMENTS

- Every change behind a flag stays byte-identical when the flag is off, proven.
- The bitemporal wiring passes a live integration test (close an edge at one generation, reopen at the next, confirm the as-of query).
- The gauge defaults are flood-tested under concurrent pools before they are accepted as production values.
- The dedup scale-test runs a realistically larger and free-text-varied finding set and reports the false-collapse rate.
- All work is verified through a cli test pass, evidence recorded, before any completion claim.

## 5. SUCCESS CRITERIA

Each follow-up lands with passing tests run through the cli executor, the byte-identity or flood-safety proof recorded, and the per-feature graduation condition from 009 cleared or explicitly re-deferred with a reason.
