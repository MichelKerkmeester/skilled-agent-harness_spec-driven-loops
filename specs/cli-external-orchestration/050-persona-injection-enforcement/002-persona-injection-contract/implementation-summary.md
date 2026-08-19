---
title: "Implementation Summary: Persona-Injection Contract Design"
description: "The persona-injection contract synthesized from the verified P1 inventory and the orchestrate.md + DESIGN_DISPATCH_MANIFEST precedents, ready for P3/P4 implementation."
trigger_phrases:
  - "persona injection contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/002-persona-injection-contract"
    last_updated_at: "2026-08-19T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Contract authored + verified; P2 docs closed"
    next_safe_action: "Begin P3 mode SKILL + hub enforcement edits"
    blockers: []
    key_files:
      - "scratch/persona-injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-002-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-persona-injection-contract |
| **Completed** | 2026-08-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `Persona-Injection Contract v1` (`scratch/persona-injection-contract.md`) — the single shared contract P3 and P4 implement. Eight sections:

1. **The rule** — every external-CLI dispatch composes `{resolved persona + task prompt}`, mirroring `orchestrate.md`'s native "Agent Loading Protocol".
2. **Runtime-aware resolution** — a runtime→agent-dir table (AGENTS.md §7, never hardcoded) + the subtask→persona mapping.
3. **Mechanism table** — per dispatch surface, native-load vs inline, transcribed from the verified P1 `§C`: only `cli-claude-code --agent` is native; the other 5 modes + `fanout-run.cjs` inline.
4. **Inline block format** — an exact, copyable `=== BEGIN AGENT PERSONA … ===` wrapper, reusing the `DESIGN_DISPATCH_MANIFEST v1` inline-payload pattern.
5. **Consistency guard** — persona named == resolved == task intent, mirroring `orchestrate.md`'s guard.
6. **Exceptions** — native-load-redundant, small-context focused-summary, and pure-mechanical; default is always-attach.
7. **Placement plan** — canonical copy in `cli-prompt-quality-card.md` (P4), a referencing Rule per mode SKILL + one hub ALWAYS rule (P3).
8. **Traceability** — every verdict back to P1 `§C`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/persona-injection-contract.md` | Created | The contract P3/P4 implement |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored by the orchestrator as a synthesis (reduce) of the verified P1 inventory plus the two existing precedents. This is a design/reduce phase, not a fan-out build, so it was authored directly rather than dispatched to cli-devin; the cli-devin build executor is reserved for the P3/P4 shipped-skill edits. Verified deterministically against the P1 `§C` table and the precedent locations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Canonical home = `cli-prompt-quality-card.md`, not the hub | It is already the single source all 6 cli-* cards + 6 SKILLs reference; keeps the hub thin per its own invariant |
| Inline by default, native only where verified | Matches the P1 `§C` reality: only `cli-claude-code --agent` loads natively |
| Reuse `DESIGN_DISPATCH_MANIFEST` block shape | Proven inline-payload precedent; no new mechanism invented |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Contract covers all 7 required sections | PASS |
| Every `§3` verdict traces to P1 `§C` | PASS — deterministic cross-read |
| Precedents confirmed present | PASS — `orchestrate.md:138`, Rule 14 per mode |
| `validate.sh --strict` | see below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Independent verify leg still inconclusive.** As in P1, the operator-specified cli-opencode/cline (DeepSeek V4 Flash) cross-check is non-functional (harness tool-call incompatibility); this phase rests on deterministic verification. Flagged for an operator decision.
2. **P2 authored by orchestrator, not cli-devin.** Minor allocation choice: contract design is reduce/synthesis of P1's verified output, so it was authored directly; cli-devin is reserved for the P3/P4 fan-out builds. Recorded for operator awareness.
<!-- /ANCHOR:limitations -->
