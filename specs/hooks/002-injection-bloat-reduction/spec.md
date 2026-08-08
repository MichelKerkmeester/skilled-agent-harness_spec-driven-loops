---
title: "Per-Prompt Injection Bloat Reduction"
description: "Phase parent: implement the ranked per-prompt injection reductions from the hooks/001 research — measurement-first, flag-gated, guardrail-preserving, one candidate at a time across all six runtime hook adapters."
status: in_progress
completion_pct: 43
trigger_phrases:
  - "injection bloat reduction"
  - "per-prompt directive reduction"
  - "lifecycle policy capsule"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Deep-review receipt-contract hardening landed; parent phase map reconciled"
    next_safe_action: "Close remaining 001/003 checklist evidence before claiming those phases complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/specs/hooks/001-per-prompt-injection-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:a58b4ac86925ff742eb31020f958426e2574b1086f3f14caab1bccffb6a3fc7a"
      session_id: "2026-08-06-hooks-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Per-Prompt Injection Bloat Reduction

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress (shadow-only; deep-review fixes shipped, activation flags off) |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Research source** | `hooks/001-per-prompt-injection-audit/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `hooks/001` research measured that the three always-on directives (comment-hygiene, governor, proof-over-appearance) are ~763 bytes / ~190 estimated tokens and constitute ~94.7% of the per-turn advisor payload, delivered on nearly every valid turn across Claude Code, Codex, Devin, and OpenCode; Pi adds its own ~554-byte dispatch directive. A representative 10-turn session carries roughly 9,600 bytes of repeated policy text, growing linearly with turns.

### Purpose
Implement the research's ranked reductions to move recurring policy off the per-turn path — full policy once per session/lifecycle epoch, route-only deltas on repeats, edge-triggered Gate relay — cutting the modeled 10-turn payload by ~82% while preserving every guardrail. The program is **measurement-first** (ship receipts before behavior changes), **flag-gated** (one independent candidate at a time, never combined), and **guardrail-preserving** (behavioral negative controls before any activation). Prompt caching is explicitly not a lever: cached reads remain context occupancy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
The seven candidate phase children below (001-007), each an independently shippable candidate from the research's §9 ranked reductions and §11 rollout sequence, plus two follow-on alignment audits: sk-code and README freshness (008) and testing-doc and feature-catalog alignment (009).

### Out of Scope
- Treating provider prompt-cache placement as a context-occupancy saving (research ruled out).
- Unconditional directive removal or no-match/failure silence (breaks the fail-open guardrail contract).
- Any behavior change that lacks a host-delivery receipt or a passing behavioral negative control.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-measurement-and-receipts-foundation/ | Shadow planner beside `render.ts`; canonical block IDs; observed-receipt delivery contract; byte-stable parity fixtures. No output change. | In Progress (open checklist items remain) |
| 2 | 002-opencode-route-line-bounding/ | Bound/digest OpenCode's uncapped compiled-route target list, with an explicit reveal/clarification path. | Planned |
| 3 | 003-opencode-transform-dedup/ | Stable-message-identity dedup with peek/commit and lifecycle session cleanup. | In Progress (open checklist items remain) |
| 4 | 004-full-first-route-only-repeats/ | Full policy on first delivery + route-only repeats; fail-open shadow observers; policy-set completeness gate. Shadow-first, flag-gated. | Complete (shadow-only) |
| 5 | 005-gate3-relay-edge-triggering/ | Gate-3 observed-receipt contract, unknown-session rejection, lifecycle epoch owner, production observer wiring. | Complete (shadow-only) |
| 6 | 006-pi-dispatch-and-compaction/ | Pi shadow receipts keyed per session; inert delivery without observed host receipt. | Complete (shadow-only) |
| 7 | 007-guardrail-controls-and-activation/ | Behavioral negative controls, receipt-bound activation matrix schema, per-runtime rollback. | Complete |
| 8 | 008-sk-code-alignment/ | sk-code opencode-surface alignment audit of the changed surface plus README-freshness corrections (comment hygiene, three READMEs). Docs-only follow-on; frozen behavior unchanged. | Complete |
| 9 | 009-testing-doc-alignment/ | Dual-lineage (gpt-5.6-luna + opencode-go deepseek-v4-flash) repo-wide sweep of manual-testing-playbooks and feature-catalogs; one change-derived stale test count fixed, two adapter-catalog notes added. Docs-only follow-on. | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Phase 001 is a hard prerequisite for 002-007: no behavior-changing candidate activates without its receipts and parity fixtures.
- Candidates 002-006 are independent flags and MUST NOT be combined; each ships shadow → parity → negative-control → activation on its own.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-measurement-and-receipts-foundation | 002-opencode-route-line-bounding | Canonical block IDs, hashes, delivery-receipt fields, and byte-stable parity fixtures land with zero output diff | shadow-only diff is empty; parity fixtures green |
| 002-opencode-route-line-bounding | 003-opencode-transform-dedup | Compiled-route list bounded behind a flag with a working reveal path | route choice/clarification retains required target names |
| 003-opencode-transform-dedup | 004-full-first-route-only-repeats | Same-message dedup keyed on stable message identity; distinct repeats still delivered | multi-transform receipts prove no distinct-message loss |
| 004-full-first-route-only-repeats | 005-gate3-relay-edge-triggering | Full-first + route-only repeats behind a flag; lifecycle/compaction replay resets delivery state | negative controls pass; changed-route delivers ~43 B |
| 005-gate3-relay-edge-triggering | 006-pi-dispatch-and-compaction | Unchanged Gate relay suppressed while open; first/invalid/scope-change/recovery preserved | Gate matrix negative controls pass |
| 006-pi-dispatch-and-compaction | 007-guardrail-controls-and-activation | Pi arbitration is semantic-preserving; dispatch directive retained until native enforcement exists | Pi failure retains dispatch guard |
| 007-guardrail-controls-and-activation | — | Every activated runtime/candidate cell passed delivery and behavioral controls; rollback is per-cell | forbidden-comment reject + unsupported-completion block + governor scenarios green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

| # | Question | Status |
|---|----------|--------|
| 1 | Which runtimes expose host-delivery receipts today vs need a shadow harness first? | Partially resolved — observed-receipt contract enforced; live host adapters remain inert pre-activation (phase 004/005/006) |
| 2 | Is a single 292-char policy capsule the delivery form, or per-directive IDs with lifecycle replay? | Resolved — per-block IDs with lifecycle epoch replay; route-only requires all directive blocks `SUPPRESSED_SAME` |
<!-- /ANCHOR:questions -->
