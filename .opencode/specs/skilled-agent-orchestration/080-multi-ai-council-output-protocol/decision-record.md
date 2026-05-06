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
    packet_pointer: "skilled-agent-orchestration/080-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T10:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 4 ADRs"
    next_safe_action: "Strict validation + commit"
    blockers: []
    completion_pct: 95
---

# Decision Record: Multi-AI Council Output Protocol

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/080-multi-ai-council-output-protocol` |
| **Date** | 2026-05-06 |
| **Status** | Accepted (design phase) |
| **Scope** | ai-council/ subfolder convention design choices |

---

## ADR-001: Lightweight Bound — No Dedicated Skill Folder

**Decision**: ACCEPTED.

The multi-ai-council convention will NOT have a dedicated skill folder at `.opencode/skill/multi-ai-council/`. All logic stays in the agent body (`.opencode/agent/multi-ai-council.md`) plus 4 reference files under `system-spec-kit/references/multi-ai-council/`.

**Rationale**: User requirement. Compared to deep-research and deep-review (which have dedicated skills with YAML workflows, command surfaces, and complex iteration mechanics), the council protocol is intentionally simpler. The agent itself is plan-only and read-mostly; it doesn't justify the same governance overhead. A dedicated skill folder would be cargo-cult.

**Alternatives rejected**:
- Build a full `.opencode/skill/multi-ai-council/` mirroring deep-research's structure. Rejected: feature creep; non-goal N1.
- Create a `/spec_kit:council` slash command. Rejected: non-goal N2; council remains user-invoked via the agent.

**Implication**: Agent body must absorb folder-layout and protocol responsibilities. If the body crosses ~750 LOC, spill detail to references rather than building a skill.

---

## ADR-002: Folder Layout — Mirror research/ and review/ Patterns

**Decision**: ACCEPTED.

The `ai-council/` subfolder mirrors the structural conventions of `research/` (deep-research) and `review/` (deep-review): a config file, a strategy file, a state log, per-round subfolders, and a final synthesized report.

**Rationale**: Operators already know these patterns from the deep skills. Reusing the structure reduces cognitive load. The names (config / strategy / state / round-NNN / final-report) are self-documenting.

**Specifically:**
- `ai-council-config.json` ↔ `deep-research-config.json`
- `ai-council-strategy.md` ↔ `deep-research-strategy.md`
- `ai-council-state.jsonl` ↔ `deep-research-state.jsonl`
- `seats/round-NNN/seat-MMM-*.md` ↔ research's `iterations/iteration-NNN.md` (but per-seat granularity)
- `deliberations/round-NNN.md` ↔ research's per-iteration synthesis
- `council-report.md` ↔ `research/research.md`

**Alternatives rejected**:
- Single flat file `council-output.md` with all rounds appended. Rejected: doesn't support iteration auditability or per-seat retrieval.
- Identical-to-research naming (`iterations/`, `research.md`). Rejected: confuses council with research; better to use council-specific names.

---

## ADR-003: State Schema — JSONL with Convention-Only Validation

**Decision**: ACCEPTED.

`ai-council-state.jsonl` uses an append-only JSONL log with documented event types (`round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`). Schema is enforced by **convention only** for v1, not by a runtime validator.

**Event types (v1):**
- `round_start` — `{round, timestamp, seats[]}`
- `seat_returned` — `{round, seat, timestamp, status, tokens?}`
- `deliberation_synthesized` — `{round, timestamp, convergence_score?}`
- `round_end` — `{round, timestamp, new_findings_count?}`
- `council_complete` — `{timestamp, final_report_path}`

**Rationale**: Lightweight bound (ADR-001) argues against building a dedicated validator. Document the schema in `references/multi-ai-council/state-format.md`; if drift becomes a problem in practice, formalize a validator in a follow-on packet.

**Alternatives rejected**:
- TypeScript-validated schema with runtime checks. Rejected: premature; v1 should ship before adding tooling.
- Free-form unstructured log. Rejected: defeats the iteration / resume goal; a documented schema is needed for deterministic resume.

---

## ADR-004: Validator Policy — Recognize `ai-council/` as Known-Optional, Free-Form Inside

**Decision**: ACCEPTED.

`validate.sh --strict` will recognize `ai-council/` as a known-optional subfolder (alongside `scratch/`, `research/`, `review/`). It will NOT enforce any specific files inside the folder; treats internal layout as free-form.

**Rationale**: Three reasons:
1. The folder is OPTIONAL — packets that never run a council shouldn't fail validation.
2. The internal layout is canonical-but-not-enforced (per ADR-003 convention-only).
3. Future iterations of the council format should not require validator changes for routine evolution.

**Alternatives rejected**:
- Strict enforcement of internal layout (council-report.md required, etc.). Rejected: too rigid for in-flight council runs (which have partial state).
- Treat `ai-council/` as unknown (current default). Rejected: noisy false positives on every council packet.

**Implication**: If the council format genuinely needs schema enforcement later, add it in a follow-on packet with explicit migration support.

---

## Cross-References

- `spec.md` §4 Proposed Design
- `spec.md` §6 Scope Boundaries (lightweight bound)
- `plan.md` §3 Implementation Phases
- `tasks.md` Phase 1-3 task lists
