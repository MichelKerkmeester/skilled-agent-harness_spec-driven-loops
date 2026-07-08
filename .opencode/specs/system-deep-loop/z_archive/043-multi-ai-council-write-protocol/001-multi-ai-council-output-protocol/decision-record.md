---
title: "Decision Record: Multi-AI Council Output Protocol"
description: "Architecture Decision Records for packet 080: lightweight bound, folder layout, state schema, validator policy."
trigger_phrases:
  - "ai-council adr"
  - "multi-ai-council decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/043-multi-ai-council-write-protocol/001-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T11:30:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Refactored decision-record.md to canonical ADR anchors"
    next_safe_action: "Land Phase 2 implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:507cf9beb5cc36a61743d0c2c6a1e7f2e075cb293052d0a5673f8e99a69c77f1"
      session_id: "decision-080-author"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

# Decision Record: Multi-AI Council Output Protocol

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/080-multi-ai-council-output-protocol` |
| **Date** | 2026-05-06 |
| **Status** | Accepted (design phase) |
| **Scope** | ai-council/ subfolder convention design choices |

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Lightweight Bound — No Dedicated Skill Folder

<!-- ANCHOR:adr-001-context -->
### Context

The multi-ai-council convention could theoretically be packaged as a full skill folder under `.opencode/skills/multi-ai-council/`, mirroring deep-research and deep-review. That would carry a YAML workflow, command surface, iteration mechanics, and convergence math comparable to the deep skills. The user requirement was explicit: keep this lightweight; no dedicated skill folder.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

The multi-ai-council convention will NOT have a dedicated skill folder. All logic stays in the agent body (`.opencode/agents/multi-ai-council.md`) plus 4 reference files under `system-spec-kit/references/multi-ai-council/`.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives

- **Build a full `.opencode/skills/multi-ai-council/`** mirroring deep-research's structure. Rejected: feature creep; non-goal N1 in spec.md §3.
- **Create a `/speckit:council` slash command**. Rejected: non-goal N2; council remains user-invoked via the agent.
- **Hybrid (skill folder without YAML workflow)**. Rejected: still cargo-cult overhead; the lightweight bound is a design value, not a side effect.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Agent body must absorb folder-layout and protocol responsibilities. If the body crosses ~750 LOC, spill detail to references rather than building a skill.
- No advisor/router triggering on the council convention itself; the agent is dispatched explicitly by the user.
- Future iterations of council format don't require skill-folder maintenance — agent body is the single source of truth.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

- **Reversibility**: High — the convention can be retired by reverting the agent body and deleting the references folder.
- **Blast radius**: Low — only the @multi-ai-council agent and validator regression test are affected.
- **Migration cost**: None — there is no prior council output convention to migrate from.
- **Operational risk**: Low — agent retains plan-only permissions; only `ai-council/` artifacts are written.
- **Documentation cost**: Low — 4 short reference files under system-spec-kit.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Pointer

See `plan.md` Phase 2 for the agent body update sequence and reference file authoring.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Folder Layout — Mirror research/ and review/ Patterns

### Context

Operators already know the folder shapes from deep-research (`research/`) and deep-review (`review/`). Building a wholly new convention adds cognitive load with no benefit; reusing the structural pattern reduces friction.

### Decision

The `ai-council/` subfolder mirrors the structural conventions of `research/` and `review/`: a config file, a strategy file, a state log, per-round subfolders, and a final synthesized report.

**Specifically:**
- `ai-council-config.json` <-> `deep-research-config.json`
- `ai-council-strategy.md` <-> `deep-research-strategy.md`
- `ai-council-state.jsonl` <-> `deep-research-state.jsonl`
- `seats/round-NNN/seat-MMM-*.md` <-> research's `iterations/iteration-NNN.md` (per-seat granularity)
- `deliberations/round-NNN.md` <-> research's per-iteration synthesis
- `council-report.md` <-> `research/research.md`

### Alternatives

- **Single flat file `council-output.md`** with all rounds appended. Rejected: doesn't support iteration auditability or per-seat retrieval.
- **Identical-to-research naming** (`iterations/`, `research.md`). Rejected: confuses council with research; council-specific names are clearer.

### Consequences

- Operators who know research/review folders are immediately productive on `ai-council/`.
- Validator regression test pattern (recognize unknown subfolders as free-form) is reusable.
- Per-round folders create more files than a flat append, but enable iteration auditability.

### Implementation Pointer

See `spec.md` §4 for the canonical folder tree.

---

## ADR-003: State Schema — JSONL with Convention-Only Validation

### Context

Iterative council runs need a state log so resume-after-interrupt and convergence detection work deterministically. The schema can be enforced at runtime via a typed validator, or by convention only.

### Decision

`ai-council-state.jsonl` uses an append-only JSONL log with documented event types (`round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`). Schema is enforced by **convention only** for v1, not by a runtime validator.

**Event types (v1):**
- `round_start` — `{round, timestamp, seats[]}`
- `seat_returned` — `{round, seat, timestamp, status, tokens?}`
- `deliberation_synthesized` — `{round, timestamp, convergence_score?}`
- `round_end` — `{round, timestamp, new_findings_count?}`
- `council_complete` — `{timestamp, final_report_path}`

### Alternatives

- **TypeScript-validated schema** with runtime checks. Rejected: premature; v1 should ship before adding tooling.
- **Free-form unstructured log**. Rejected: defeats the iteration / resume goal; a documented schema is needed for deterministic resume.

### Consequences

- Lightweight bound (ADR-001) preserved.
- If drift becomes a problem in practice, formalize a validator in a follow-on packet.
- Schema documented in `references/multi-ai-council/state-format.md` with examples.

### Implementation Pointer

See agent body §State Schema and `references/multi-ai-council/state-format.md`.

---

## ADR-004: Validator Policy — `ai-council/` Free-Form Inside

### Context

The validator (`validate.sh --strict`) checks per-file template structure but does not currently flag unknown subfolders. The question is whether to add explicit recognition of `ai-council/` (with constraints on contents) or keep it fully free-form like `scratch/`.

### Decision

`validate.sh --strict` continues to treat `ai-council/` as a free-form subfolder. It will NOT enforce any specific files inside; treats internal layout as canonical-but-not-enforced. A vitest regression test confirms the validator does not flag `ai-council/` as unknown.

### Alternatives

- **Strict enforcement of internal layout** (council-report.md required, etc.). Rejected: too rigid for in-flight council runs (which have partial state).
- **Flag unknown subfolders by default**. Rejected: would break legacy packets and contradict scratch/ free-form precedent.

### Consequences

- Future iterations of the council format don't require validator changes for routine evolution.
- If the council format genuinely needs schema enforcement later, add it in a follow-on packet with explicit migration support.
- Validator code change is essentially zero (it already accepts unknown subfolders); the regression test prevents future regressions.

### Implementation Pointer

See `plan.md` Phase 3. Vitest test in `system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts`.

---

## Cross-References

- `spec.md` §3 Scope — defines what changes
- `spec.md` §6 Risks — captures lightweight-bound risk and mitigation
- `plan.md` §3 Architecture — describes the lightweight pattern
- `tasks.md` Phase 1-3 — task-level execution
