---
title: "Decision Record: Multi-AI Council write authority [skilled-agent-orchestration/098-multi-ai-council-write-authority/decision-record]"
description: "Three ADRs governing the council's write-authority flip: write-permission model, audit-trail schema, rollback semantics. Each ADR captures context, decision, alternatives considered, consequences, and reversal cost."
trigger_phrases:
  - "council write authority ADRs"
  - "council permission model decision"
  - "council audit trail schema decision"
  - "council rollback semantics decision"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/098-multi-ai-council-write-authority"
    last_updated_at: "2026-05-08T21:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 3 ADRs (write-permission model, audit-trail schema, rollback semantics)"
    next_safe_action: "Implementation phase — cli-codex dispatch"
    blockers: []
    key_files:
      - "spec.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-write-authority-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Multi-AI Council write authority

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Path-scoped write-permission model


<!-- ANCHOR:adr-001-context -->
### Context

The multi-ai-council agent currently operates planning-only: its YAML carries `write: deny / edit: deny / bash: deny / patch: deny` across all 4 runtime mirrors. Today the helper script `persist-artifacts.cjs` reads the council's chat output and writes the artifact tree on the council's behalf. The split has three observable costs documented in `spec.md` §2: operator latency, in-round iteration friction, and architectural fragility (the parent owns persistence rule).

Packet 089's lightweight-bound GO/NO-GO (`research.md`, §13) explicitly listed "LEAF council write files" as a NO-GO blocker condition, deferred to v1.2+ pending an ADR + explicit user approval to flip the §0 invariant.

Precedent agents `@deep-research` and `@deep-review` already operate with `write: allow / edit: allow` permission, scoped to `research/` and `review/` respectively. They are LEAF agents like the council; the precedent shape is direct.


<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives considered

- **A. Full write/edit/bash/patch flip** — broadest grant. Lets the council perform recovery shell operations and directly patch sibling code. Rejected as too broad: bash and patch are not needed for the artifact-write use case, and they expand the security surface meaningfully.
- **B. Write only (no edit)** — narrower than the chosen scope. Lets the council create new artifacts but not modify existing ones. Rejected: deliberation rounds may need to update `ai-council-config.json` (e.g., to record round count) or append to `ai-council-state.jsonl`. Edit is necessary for the use case.
- **C. Write + edit, scoped to `ai-council/**`** (CHOSEN) — the minimum grant that supports the artifact-write use case, with bash and patch staying denied.
- **D. Write + edit, broader scope (e.g., spec folder root)** — rejected. Council artifacts live in `ai-council/` by design; broader scope would let the council mutate the parent packet's spec docs, violating the LEAF separation.
- **E. Time-limited write authority (token expiry, write-window)** — rejected. Adds complexity without clear benefit for the v1.2 use case; can be revisited in v1.3+ if specific abuse patterns emerge.


<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Flip the council's permission YAML to:

```yaml
permission:
  write: allow
  edit: allow
  bash: deny
  patch: deny
```

Apply the flip across all 4 runtime mirrors (`.opencode`, `.claude`, `.codex`, `.gemini`) atomically. The 4-runtime mirror parity test from packet 080 extends to cover the new permission shape.

> **OpenCode schema note (corrected 2026-05-09):** the original draft of this ADR proposed `write: { mode: allow, paths: ["ai-council/**"] }` as the YAML. OpenCode's permission schema does not accept a `paths` array on `PermissionActionConfig` — the valid forms are the simple action strings (`allow` | `ask` | `deny`) or a glob-keyed map. Loading the path-array form fails with `Expected PermissionActionConfig, got ["ai-council/**"] permission.write.paths`. The shipped form is the simple `allow` shown above; **path-scope is enforced at the writer-library layer** (`scripts/multi-ai-council/lib/persist-artifacts.js` throws `OUT_OF_SCOPE_WRITE` for any target outside `ai-council/**`). Defense-in-depth via the lib check; the YAML is the runtime permission, not the path firewall.


<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Council writes its own artifact tree. No helper-invocation step needed.
- Mid-round artifact iteration becomes possible (e.g., council can update its own `ai-council-state.jsonl` after each seat returns).
- LEAF separation preserved: council still cannot touch parent packet's spec docs.
- Precedent-aligned with `@deep-research` and `@deep-review`.

**Negative**:
- Permission surface expanded beyond planning-only. Mitigated by path-scope enforcement + validator regression test.
- 4-runtime parity is now a permission-correctness concern (was always a presence concern). Mitigated by parity test.


<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The ADR closes an explicit packet 089 blocker. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were documented before choosing. |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest scope that satisfies the requirement. |
| 4 | **Fits Goal?** | PASS | It is directly on the critical path for scoped council writes. |
| 5 | **Open Horizons?** | PASS | Reversal cost remains low and additive schema keeps readers compatible. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Reversal cost

Low. To revert, set `write: deny / edit: deny` in all 4 runtime mirrors, and re-instate the helper-invocation step in the dispatching command. Existing v1.2 audit events stay readable by v1 readers (additive schema).


---
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Additive audit-trail schema (v1.1 → v1.2)

<!-- ANCHOR:adr-002-context -->
### Context

The council's `ai-council-state.jsonl` currently records 5 event types: `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`. v1.1 added optional metadata (`schema_version`, `protocol`, `producer`) to existing events. Council write-authority introduces a 6th event type: `artifact_written` (and a 7th, `rollback`, for round failure recovery).

Per `references/multi-ai-council/state-format.md` §additive-schema-policy, schema evolution is additive only — new event types and fields can be added; existing events cannot have their semantics changed. v1 readers MUST continue parsing v1.2 files without errors.


<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives considered

- **A. Promote audit trail to a separate file** (`ai-council-audit.jsonl`) — cleaner separation, but introduces a second source of truth. Rejected: makes operator inspection harder and breaks the single-state-log invariant from packet 080.
- **B. Embed audit events as nested fields in existing event types** — e.g., `seat_returned` carries an `artifacts_written: [...]` array. Rejected: violates "one event = one fact" principle; complicates event-record parsing.
- **C. New event types `artifact_written` and `rollback` appended to the same JSONL** (CHOSEN) — additive, single-source-of-truth, v1-reader-tolerant.


<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

Add two new event types to `ai-council-state.jsonl`:

```jsonl
{"event": "artifact_written", "path": "<relative path under ai-council/>", "bytes": <int>, "checksum": "<sha256:hex>", "timestamp": "<ISO 8601>", "seat_id": "<seat>", "round_id": "<round-NNN>"}
{"event": "rollback", "round_id": "<round-NNN>", "reason": "<seat error message>", "timestamp": "<ISO 8601>", "supersedes": ["<artifact_written event ids>"]}
```

Both events follow the existing schema-evolution policy. Schema version bumps from v1.1 to v1.2; v1 and v1.1 readers ignore unknown event types per existing tolerance contract.


<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Single source of truth for council state.
- v1-reader-tolerant; backward compatible.
- Audit trail is operator-readable (one event per write) and tooling-readable (well-formed JSON).

**Negative**:
- Audit trail can grow large for long-running councils. Mitigated by REQ-015 rotating-file backup at 10 MB.


<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The ADR closes an explicit packet 089 blocker. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were documented before choosing. |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest scope that satisfies the requirement. |
| 4 | **Fits Goal?** | PASS | It is directly on the critical path for scoped council writes. |
| 5 | **Open Horizons?** | PASS | Reversal cost remains low and additive schema keeps readers compatible. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Reversal cost

Low. Strip the new event types out of writers; downgrade schema_version. Existing v1.2 files remain readable as long as v1 reader-tolerance holds.



---
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Round-NNN rollback semantics

<!-- ANCHOR:adr-003-context -->
### Context

Council rounds can fail in three ways: (a) a seat returns an error or times out, (b) convergence isn't reached within max iterations, (c) the operator aborts mid-round. Today, with the helper-owned write model, the dispatcher can simply not invoke the helper for a failed round — the artifact tree never gains the failed round's data.

When the council writes its own artifacts mid-round, the failure mode changes: artifacts may already be on disk by the time the failure surfaces. The rollback unit must be defined.


<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives considered

- **A. File-level rollback** — each `artifact_written` event has a corresponding `artifact_pruned` event on rollback; dispatcher walks the audit trail to delete files. Rejected: too granular; complicates the audit trail; doesn't compose cleanly when multiple files are written per round.
- **B. Whole-`ai-council/`-tree rollback** — abort = delete the entire `ai-council/` tree. Rejected: too coarse; loses history from completed rounds; operator can't compare across rounds for forensic analysis.
- **C. Round-NNN folder rollback** (CHOSEN) — round-NNN is the natural unit of work; rollback prunes the round's directory; failed artifacts preserved in `failed/round-NNN/` for forensic inspection.


<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

Round-NNN folder is the rollback unit. On any seat error, convergence failure, or operator abort:

1. Council (or runtime) writes a `{"event": "rollback", "round_id": "<round-NNN>", ...}` event to `ai-council-state.jsonl`.
2. Dispatcher (or council, in v1.2) MOVES (not deletes) `round-NNN/` to `failed/round-NNN-<timestamp>/`.
3. Each `artifact_written` event for the round is followed by a `{"event": "artifact_superseded", "original_path": "...", "rollback_event_id": "..."}` marker so audit-trail consumers can tell completed-and-then-rolled-back from completed-and-still-canonical.
4. Subsequent round dispatches start fresh from round-NNN+1 (no in-place retry; retries are a separate dispatch).

`failed/round-NNN-<timestamp>/` is preserved indefinitely for forensic inspection; cleanup is a future operator action.


<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Failed rounds don't pollute canonical artifact tree.
- Forensic preservation of failed state.
- Audit trail records both the write and the rollback, with explicit linkage.
- Idempotent: repeated rollback of the same round is a no-op (the supersede markers are already there).

**Negative**:
- `failed/` directory grows over time; manual cleanup needed eventually. Acceptable for v1.2; cleanup tooling is a future packet.
- Round retry requires a new dispatch (not an in-place resume). Acceptable trade-off given the council is non-deterministic across runs anyway (seat AI models vary).


<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The ADR closes an explicit packet 089 blocker. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were documented before choosing. |
| 3 | **Sufficient?** | PASS | The chosen option is the smallest scope that satisfies the requirement. |
| 4 | **Fits Goal?** | PASS | It is directly on the critical path for scoped council writes. |
| 5 | **Open Horizons?** | PASS | Reversal cost remains low and additive schema keeps readers compatible. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Reversal cost

Low. To revert: switch back to whole-tree-rollback (alternative B) by changing the rollback handler in `lib/rollback.js`. Existing `failed/` directories stay valid forensic data.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
