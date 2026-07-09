---
title: "AI Council Report: sk-ai-council Shared Runtime Deliberation"
description: "Final synthesized council report. Verdict: HYBRID."
topic: "Should sk-ai-council be refactored from a per-skill helper into a shared runtime, similar to deep-loop-runtime, and would that be useful?"
spec_folder: "skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation"
rounds: 1
council_complete: true
final_ruling: "HYBRID"
convergence_signal: "3-way-split-no-advocate-majority; adjudicator-ruling"
plan_confidence: 88
timestamp: "2026-05-23T05:04:55Z"
---

# AI Council Report - sk-ai-council Shared Runtime Deliberation

## Executive Verdict

**Verdict: HYBRID.** Do not refactor `sk-ai-council` into a full shared runtime now. It would be useful to extract low-level primitives later, but only when active consumers or safety pressure justify the cost.

The practical recommendation is: keep council orchestration, seat authoring, strategy, and packet-local artifact ownership in `sk-ai-council`; define a future `.opencode/skills/ai-council-runtime/` for scoped writes, append-only state helpers, checksums, parser/rendering utilities, and convergence classifiers if trigger criteria are met.

## Convergence Signal

No 2-of-3 advocate majority formed:

| Seat | Position | Recommendation |
|------|----------|----------------|
| Seat 01 | Advocate Extract | EXTRACT |
| Seat 02 | Advocate Keep-Inline | KEEP-INLINE |
| Seat 03 | Advocate Hybrid | HYBRID |
| Seat 04 | Adjudicator | HYBRID |

The configured `two_of_three_advocates_plus_adjudicator` signal was not satisfied. This report records explicit dissent and adopts the adjudicator's HYBRID ruling.

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|---------------|-------------------|------------------|------------|
| seat-001 | Advocate Extract | in-session Codex council seat | Argue for full runtime extraction | 82 |
| seat-002 | Advocate Keep-Inline | in-session Codex council seat | Argue against premature extraction | 86 |
| seat-003 | Advocate Hybrid | in-session Codex council seat | Argue for primitive-only extraction | 91 |
| seat-004 | Adjudicator | in-session Codex council seat | Score claims and rule | 88 |

## Task Classification

Architecture decision, planning-only. This packet creates spec docs and council artifacts; it does not implement code changes.

## Top Findings

1. **`sk-ai-council` is currently a planning skill plus artifact runtime helper.** Its SKILL.md describes multi-seat planning, artifact persistence, convergence checks, and packet-local outputs (`.opencode/skills/sk-ai-council/SKILL.md:3`), and its workflow keeps artifacts under `ai-council/**` while handing implementation away (`.opencode/skills/sk-ai-council/SKILL.md:285`).

2. **The concrete extraction candidates are real but low-level.** `persist-artifacts.js` renders all persisted council artifact payloads and state events (`.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:383`, `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:432`), while `audit-trail.js` owns checksums and append-only JSONL normalization (`.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js:36`, `.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js:96`).

3. **The strongest reason not to fully extract is source-of-truth locality.** Council artifacts live in packet-local `ai-council/**`, and graph rows are derived; if graph rows disagree with artifacts, artifacts win (`.opencode/skills/sk-ai-council/references/graph_support.md:15`, `.opencode/skills/sk-ai-council/references/graph_support.md:31`).

4. **Current consumer count does not match deep-loop-runtime pressure.** The active surfaces are primarily the `@ai-council` agent, orchestrator routing, helper fallback, and documentation examples (`.opencode/agents/ai-council.md:27`, `.opencode/agents/orchestrate.md:97`, `.opencode/agents/orchestrate.md:181`, `.opencode/skills/cli-gemini/SKILL.md:251`).

5. **Deep-loop-runtime is a useful precedent because it had stronger lifecycle and consumer signals.** It owns runtime modules, script entry points, storage, and tests (`.opencode/skills/deep-loop-runtime/SKILL.md:74`, `.opencode/skills/deep-loop-runtime/SKILL.md:142`, `.opencode/skills/deep-loop-runtime/SKILL.md:155`), and 118 explicitly moved scripts, storage, tests, and MCP replacement paths into the peer skill (`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/spec.md:67`, `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/spec.md:79`).

6. **The memory-leak arc points toward primitive extraction, not full orchestration extraction.** Phase 004 introduced locks, JSONL repair, and atomic state because interrupted deep loops could lose provenance or double-dispatch (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:81`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:126`). It explicitly left council-specific adoption as a smaller follow-up if required (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/implementation-summary.md:124`).

7. **Council graph tooling is not enough by itself to justify moving `sk-ai-council`.** The MCP server owns `council_graph_*` tool registration (`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:26`), and its schemas call the graph a derived projection from packet-local artifacts (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:648`, `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:651`).

## Decision Criteria

Extract low-level primitives when at least one condition is true:

1. A third active consumer ships within three months and directly needs council state, artifact writer, parser, or convergence primitives.
2. A council JSONL or scoped-write safety incident occurs.
3. Another skill duplicates council-style artifact persistence or convergence logic.
4. Council graph replay must run from both MCP and non-MCP runtimes.

Do not extract when:

- Only `@ai-council` and its helper fallback need the code.
- The proposed runtime would move seat selection, strategy, or report authorship instead of primitives.
- The migration lacks fixture parity for historical packet artifacts.
- The main argument is symmetry with `deep-loop-runtime` rather than current pressure.

Re-deliberate if:

- A third consumer ships within three months.
- `ai-council-state.jsonl` corruption, scoped-write bypass, or replay inconsistency is observed.
- The council graph MCP surface gains non-MCP script consumers.

## Recommended Plan

1. Keep `sk-ai-council` inline for now.
2. Record HYBRID as the accepted architectural direction.
3. Open a future implementation packet only when the decision criteria are met.

## Implementation Sketch

If HYBRID extraction is later triggered, use a three-phase implementation:

### Phase 1: Primitive Runtime Scaffold

Create `.opencode/skills/ai-council-runtime/` with:

- `SKILL.md`
- `lib/state-jsonl/` for append-only event helpers and JSONL parsing
- `lib/scoped-writes/` for `assertInside`, checksum, and artifact audit helpers
- `lib/report-artifacts/` for parser/rendering utilities
- `tests/fixtures/` with historical `ai-council/**` packet samples

Parity targets:

- `.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js`
- `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js`
- `.opencode/skills/sk-ai-council/references/state_format.md`
- `.opencode/skills/sk-ai-council/references/output_schema.md`

### Phase 2: Consumer Cutover With Adapters

Update `sk-ai-council` helper scripts to import primitives from `ai-council-runtime`, while preserving CLI behavior:

- `.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs`
- `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js`
- `.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js`
- `.opencode/skills/sk-ai-council/scripts/replay-graph-from-artifacts.cjs`

Keep `sk-ai-council` responsible for seat diversity, prompt strategy, output protocol, and packet-local artifact authority.

### Phase 3: Verification and Guardrails

Run parity tests that prove:

- historical council reports parse the same way.
- generated artifact paths are identical.
- `artifact_written` checksums and event shape are unchanged.
- out-of-scope writes still fail before touching the filesystem.
- derived graph replay output remains prompt-safe and namespace-scoped.

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Premature runtime package | High | Require trigger criteria before implementation |
| Existing packet breakage | High | Use historical fixture parity and no schema-breaking state changes |
| Over-extracting orchestration | Medium | ADR-001 allows primitive extraction only |
| Duplicated source-of-truth | High | Keep `ai-council/**` authoritative; graph/runtime projections remain derived |
| Test debt | Medium | Make parity fixtures the first implementation phase |
| Consumer confusion | Medium | Keep `sk-ai-council` as the user-facing skill and document runtime as internal primitive support |

## Deliberation Notes

The real disagreement was not whether code in `sk-ai-council` is reusable. It is. The disagreement was whether current reuse pressure is strong enough to pay for a peer runtime. The adjudicator ruled that the primitive helpers may earn extraction, but the orchestration layer has not.

## Winning Strategy

HYBRID: primitive extraction when triggered; orchestration stays inline.

## Dropped Alternatives

- **Full extraction now**: dropped because current consumer count and source-of-truth locality do not match deep-loop-runtime's extraction pressure.
- **Keep inline forever**: dropped because state, writer, and replay primitives can become cross-consumer safety surfaces.
- **Defer without criteria**: dropped because it would leave the same question unresolved.

## Cross-References

- `ai-council/seats/round-001/seat-01-advocate-extract.md`
- `ai-council/seats/round-001/seat-02-advocate-keep-inline.md`
- `ai-council/seats/round-001/seat-03-advocate-hybrid.md`
- `ai-council/seats/round-001/seat-04-adjudicator.md`
- `decision-record.md`

## Planning-Only Boundary

This packet does not implement `ai-council-runtime/`, modify `sk-ai-council`, change council graph tooling, or touch arc 010. The output is a decision packet and handoff criteria.

## Plan Confidence

88/100. Confidence is high that full extraction is premature and that a primitive-only boundary is the right future shape. Confidence is below 90 because hidden consumers may exist outside the grep-scoped surfaces, and a future implementation packet would need a fresh consumer inventory.

## Commit Handoff

Suggested commit: `council(124): sk-ai-council shared-runtime deliberation — verdict HYBRID`

Changed/created files:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/ai-council-config.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/ai-council-state.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/ai-council-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/council-report.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/deliberations/round-001-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/logs/.gitkeep`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/seats/round-001/seat-01-advocate-extract.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/seats/round-001/seat-02-advocate-keep-inline.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/seats/round-001/seat-03-advocate-hybrid.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/ai-council/seats/round-001/seat-04-adjudicator.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/description.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/graph-metadata.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/scratch/.gitkeep`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/124-sk-ai-council-shared-runtime-deliberation/tasks.md`
