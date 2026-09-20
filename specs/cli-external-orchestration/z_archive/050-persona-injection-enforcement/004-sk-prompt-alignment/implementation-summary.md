---
title: "Implementation Summary: sk-prompt Persona-Injection Alignment"
description: "Installed the canonical Persona Injection section into the CLI Prompt Quality Card via a pre-written cli-devin build, verified tool-free by cline/DeepSeek (APPROVE 96/100); sk-prompt-improve audited and needs no edit."
trigger_phrases:
  - "sk-prompt alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/004-sk-prompt-alignment"
    last_updated_at: "2026-08-19T11:31:00Z"
    last_updated_by: "claude"
    recent_action: "Canonical section installed; cline APPROVE 96/100; Devin-path note reconciled"
    next_safe_action: "Author P5 verification sweep (005-verification)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-004-skprompt"
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
| **Spec Folder** | 004-sk-prompt-alignment |
| **Completed** | 2026-08-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A canonical `## 6. PERSONA INJECTION` section added to `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` — the single home every cli-* mode SKILL persona rule references. `64 insertions(+)`, `3 deletions(-)` (the deletions are the three trailing headers renumbered). Four subsections:

- **§6.1 Resolution** — runtime-aware agent-dir table (AGENTS.md §7, "never hardcode one runtime") for all six runtimes (Devin's path correctly `.devin/agents/<name>/AGENT.md`), plus the subtask→persona map.
- **§6.2 Mechanism** — native-surface-vs-inline per mode: claude-code NATIVE `--agent`, cursor NATIVE name-the-subagent, devin NATIVE `run_subagent`, opencode PARTIAL via `--agent orchestrate`, codex/pi INLINE mandatory, fanout INLINE.
- **§6.3 Inline block** — copyable `=== BEGIN/END AGENT PERSONA ===` block reusing the `DESIGN_DISPATCH_MANIFEST` inline-payload rationale (with a Devin `<name>/AGENT.md` note from reconciliation).
- **§6.4 Guard + exceptions** — consistency guard + the three declared exceptions; "silence is never an exception".

Sections renumbered: `COMMON CLI PROMPT FAILURE PATTERNS` 6→7, `MIRROR SYNC` 7→8, `RELATED RESOURCES` 8→9.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` | Modify | Add canonical §6 Persona Injection; renumber trailing sections |
| `.opencode/skills/sk-prompt/sk-prompt-improve/**` | Audit only | No persona-owning dispatch-packaging ref; no edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Same dual-executor, dogfooded pattern as P3. The orchestrator pre-wrote the section from the P2 contract. `cli-devin` (Gemini 3.7 Flash @ high, `markdown` persona inlined) applied three anchored edits (insert §6 + renumber the two remaining trailing headers) and returned `STATUS=OK DQI=95` with a verified section-order confirmation. An independent `cli-opencode`/cline dispatch (DeepSeek V4 Flash @ xhigh, `review` persona, tool-free) verified the section against the contract (C1–C7). The orchestrator reconciled the one actionable P2 (Devin-path note in §6.3) and audited `sk-prompt-improve` — its dispatch-related matches are a routing keyword, the prompt-improver's ENHANCED_PROMPT return description, and a test payload, none of which owns persona injection, so no edit was made (scope-locked).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Canonical section lives in the card, renumber trailing sections | The card is already the single CLI prompt-craft source all cards + SKILLs reference; correct doc structure over append-at-end |
| No `sk-prompt-improve` edit | Its dispatch-related refs describe the prompt-improver's OUTPUT, not persona attachment; adding the step there would be scope creep |
| Leave the `MIRROR SYNC` drift untouched | The "three cards"/duplicate-`cli-opencode` inaccuracy is unrelated to persona injection; SCOPE LOCK forbids adjacent cleanup — flagged for the operator instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Card diff is insertion + renumber only | PASS — `64 insertions(+)`, `3 deletions(-)` (renumbered headers) |
| Section order correct | PASS — `rg "^## [0-9]"`: 1-5, `6 PERSONA INJECTION`, 7, 8, 9 |
| Section matches the contract | PASS — independent cline/DeepSeek review, C1–C6 PASS |
| Devin path correct in §6.1 | PASS — `.devin/agents/<name>/AGENT.md` (C2) |
| Independent tool-free review | PASS — APPROVE, 96/100, zero P0/P1, one P2 reconciled |
| `validate.sh --strict` | see below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing MIRROR SYNC drift left for the operator.** The card's MIRROR SYNC section (now §8) says "All three cli-* cards" and lists `cli-opencode` twice, though six real thin cards exist. This is a pre-existing inaccuracy unrelated to persona injection; SCOPE LOCK kept it untouched. Recommended as a separate small cleanup.
2. **Verifier's external-count caveat.** The tool-free review could not confirm the "13 agents" roster count or the exact `orchestrate.md` quote from within its transport. Both were confirmed earlier in the packet (P1/P2): the roster is 13 agents and `orchestrate.md` carries the "Agent Loading Protocol (MANDATORY)".
<!-- /ANCHOR:limitations -->
