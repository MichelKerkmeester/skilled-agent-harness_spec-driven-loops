---
title: "Research: Multi-AI Council write authority [system-deep-loop/z_archive/022-multi-ai-council-write-protocol/004-multi-ai-council-write-authority/research]"
description: "Lightweight design research covering precedent agents (deep-research, deep-review), the §0 invariant flip rationale, audit-trail schema options, and path-scope enforcement strategies."
trigger_phrases:
  - "council write authority research"
  - "council permission flip rationale"
  - "council precedent agents"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/004-multi-ai-council-write-authority"
    last_updated_at: "2026-05-08T21:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored design research summarizing precedent agents + decision rationale"
    next_safe_action: "Implementation phase"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-write-authority-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Research: Multi-AI Council write authority

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research-core | v2.2 -->

---

## Scope

This packet flips the multi-ai-council agent from planning-only (`write: deny`) to scoped-write (`write: allow (ai-council/)`). The decision is greenfield: no prior packet attempted the flip; packet 089 explicitly listed it as a NO-GO blocker condition pending design. This document captures the design research behind ADR-001 / ADR-002 / ADR-003 in `decision-record.md`.

The research is lightweight by design. Two precedent agents already operate with the target permission shape, so the design space is bounded: the question is not "how do we let an LLM write files safely" (already answered by existing infrastructure), but "what is the minimum permission grant that supports the council's artifact-write use case while preserving its LEAF guarantees."

---

## Precedent agents

### @deep-research

- **Permission**: `write: allow (research/)`, `edit: allow (research/)`, `bash: deny`, `patch: deny`.
- **Role**: Iterative research loop with externalized state. Writes per-iteration markdown to `research/iterations/iteration-NNN.md` and mutates `research/deep-research-state.jsonl`.
- **Path scope**: `research/` subtree under the spec folder.
- **Concurrent dispatch handling**: keyed by `(spec_folder, loop_type, session_id)` per packet 026/006's coverage-graph work — concurrent runs in different packets do not collide.
- **Audit trail**: state.jsonl records `iteration_started`, `iteration_completed`, `convergence_detected`, `stop` events.

### @deep-review

- **Permission**: `write: allow (review/)`, `edit: allow (review/)`, `bash: deny`, `patch: deny`.
- **Role**: Iterative review loop with P0/P1/P2 finding registry. Writes per-iteration findings to `review/iterations/iteration-NNN.md` and mutates `review/deep-review-state.jsonl`.
- **Path scope**: `review/` subtree under the spec folder.
- **Audit trail**: state.jsonl records iteration events + finding events; `deltas/iter-NNN.jsonl` carries structured-finding records.

### Pattern derived from precedent

Both agents:
- Write to a single subtree (`research/` or `review/`).
- Maintain an externalized state JSONL.
- Have bash and patch denied.
- Are LEAF agents (no sub-dispatch).

The council's pattern slots in directly:
- Subtree: `ai-council/`.
- State JSONL: `ai-council-state.jsonl` (already exists — v1.0 in packet 080, v1.1 in packet 089).
- Bash and patch: stay denied.
- LEAF: already enforced by §0 ILLEGAL NESTING in the agent body.

---

## §0 invariant flip rationale

The current §0 of the council agent body declares planning-only as a HARD invariant:

> **PLANNING-ONLY**: This agent does not write, edit, run shell commands, or patch files. The dispatching parent or helper script is the writer of record.

Packet 089's lightweight-bound GO/NO-GO (research.md §13) lists "LEAF council write files" as a NO-GO blocker condition. The blocker is procedural, not technical: it requires explicit ADR + user approval before flipping.

ADR-001 in `decision-record.md` is the explicit decision. The user approval came in the form of the dispatching prompt for packet 098 (this packet). The §0 text in the council body needs corresponding update:

**OLD** (planning-only):
> **PLANNING-ONLY**: This agent does not write, edit, run shell commands, or patch files. The dispatching parent or helper script is the writer of record.

**NEW** (scoped-write):
> **SCOPED-WRITE**: This agent writes and edits files ONLY within `ai-council/**`. It does not run shell commands and does not patch files outside `ai-council/`. The path-scope is enforced by the runtime; writes outside `ai-council/` are rejected with `OUT_OF_SCOPE_WRITE`. The previous helper-owned write model is preserved as a fallback for non-council callers.

The flip is documented across all 4 runtime mirrors atomically. Per-mirror divergence is caught by the 4-runtime parity test (packet 080's pattern, extended).

---

## Audit-trail schema options

The schema-evolution policy from packet 089 (referenced in `references/multi-ai-council/state-format.md` §additive-schema-policy) constrains the design space:

- New event types may be added.
- New optional fields may be added to existing events.
- Existing event semantics may not change.
- v1 readers MUST tolerate unknown event types (ignore them).

Three schema options were considered (see ADR-002 §Alternatives):

| Option | Pros | Cons | Decision |
|---|---|---|---|
| A. Separate audit file | Clean separation | Two sources of truth | Rejected |
| B. Embed in existing events | No new file types | Violates "one event = one fact" | Rejected |
| C. New event types in same JSONL | Single source of truth, additive | Audit trail grows; needs rotation policy at large scale | **Chosen** |

Option C aligns with the existing pattern from packet 089 (`schema_version`, `protocol`, `producer` fields added without disruption). The rotating-file backup at 10 MB (REQ-015) is a P2 refinement that keeps the audit trail bounded for long-running councils.

---

## Path-scope enforcement

The runtime path-resolver is the security boundary. The validator regression test (REQ-002, REQ-011) is the regression guard.

The runtime path-resolver lives in the agent runtime infrastructure (per agent definition's `permission.write.paths` constraint). When the council attempts a write, the runtime evaluates the target path against the allowed paths glob (`ai-council/**`). Writes outside the glob are rejected with `OUT_OF_SCOPE_WRITE` before any filesystem operation.

The validator regression test asserts the resolver actually enforces the glob — not just declares it. Test fixture: dispatch the council in a sandbox; instruct it to write to `../sibling-spec/`. Assert the write is rejected; assert the council's state-jsonl carries an error event but no `artifact_written` event for the rejected path.

---

## Concurrent dispatch handling

Council dispatches in different packets do not collide because each writes to a different `ai-council/` subtree (each packet has its own). Council dispatches in the SAME packet are an unusual case — `COUNCIL_IN_FLIGHT` lock-file fail-fast (per spec.md §Edge Cases) is the safety net.

The pattern parallels CocoIndex daemon's atomic PID-file lock (packet 026/011) — single-writer-lease semantics. The council doesn't run a daemon, but the dispatch coordinator can hold a `.council-in-flight` lock file in `ai-council/` for the duration of the dispatch.

---

## Open follow-ons

- **Cleanup tooling for `failed/`**: `failed/round-NNN-<timestamp>/` directories accumulate over time. A future packet can ship a `/doctor:multi-ai-council-cleanup` command that prunes `failed/` directories older than N days.
- **In-place round retry**: spec.md §Out of Scope. Could be a v1.3 enhancement if operators report friction.
- **Cross-packet artifact moves**: spec.md §Out of Scope. Would require a separate ADR on cross-packet permission-scope policy.

---

## References

- `decision-record.md` — ADR-001 (write-permission model), ADR-002 (audit-trail schema), ADR-003 (rollback semantics).
- `spec.md` §3 SCOPE — full file-path table for the implementation.
- `../080-multi-ai-council-output-protocol/decision-record.md` — initial council protocol decisions.
- `../089-multi-ai-council-persistence/research.md` §13 — the lightweight-bound GO/NO-GO that listed "LEAF council write files" as a blocker.
- `../092-multi-ai-council-deferrals/implementation-summary.md` §Limitations — where this packet's open status was recorded.
