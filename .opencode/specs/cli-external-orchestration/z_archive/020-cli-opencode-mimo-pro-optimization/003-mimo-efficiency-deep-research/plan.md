---
title: "Implementation Plan: MiMo-V2.5-Pro efficiency deep-research"
description: "Run a focused efficiency research synthesis on MiMo-V2.5-Pro via cli-opencode and produce research.md + a prioritized delta list for the registry and skill docs."
trigger_phrases:
  - "mimo efficiency research plan"
  - "mimo deep-research loop"
  - "mimo-v2.5-pro research executor"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/003-mimo-efficiency-deep-research"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-003 plan (focused research synthesis)"
    next_safe_action: "Run the focused efficiency research synthesis and write research.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: mimo-efficiency-deep-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | research synthesis (markdown + structured JSONL deltas) |
| **Framework** | focused web/metadata research (WebSearch + live opencode provider metadata + on-machine probe) |
| **Storage** | `research/` packet-local outputs (research.md, deltas/deltas.jsonl) |
| **Testing** | research.md existence + deltas presence + confirmed-only registry backfill + strict validate |

### Overview
Determine how to best use and maximize the efficiency of `xiaomi-token-plan-ams/mimo-v2.5-pro` when driven headless through `opencode run`, mirroring the intent of `120/002`. cli-codex `gpt-5.5` (high/fast) was the intended research executor per the 120/002 precedent, but codex-cli 0.135.0 does NOT support the `--search` flag, so that dispatch was aborted. Research facts were instead gathered via the built-in WebSearch tool (current 2026 sources) plus live `opencode models xiaomi-token-plan-ams --verbose` provider metadata and an on-machine one-shot probe. This is a FOCUSED research synthesis, NOT a 10-iteration `/deep:start-research-loop` run — `research/iterations/` is intentionally empty. The synthesis produces an 8-section `research/research.md` with confidence tags + sources and a prioritized delta list; structured deltas land in `research/deltas/deltas.jsonl`. A full deep-research loop (now that MiMo is a wired executor) is available as a deeper follow-up.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Focused research synthesis — a single research pass over current public sources plus live on-machine evidence, consolidated into one canonical `research.md` and a structured delta stream. No iterative externalized-state loop this phase (deferred to a possible full `/deep:start-research-loop` follow-up).

### Key Components
- **Evidence inputs**: WebSearch (current 2026 sources), `opencode models xiaomi-token-plan-ams --verbose` (live provider metadata), on-machine one-shot probe to `xiaomi-token-plan-ams/mimo-v2.5-pro`
- **Synthesis**: 8-section `research.md` with HIGH/MEDIUM/LOW/UNKNOWN confidence tags + sources + a Prioritized Deltas section
- **State**: `research/research.md`, `research/deltas/deltas.jsonl` (`research/iterations/` intentionally empty)

### Data Flow
Scope charter → gather facts from web + live provider metadata + probe → tag each finding with a confidence level → consolidate into research.md → extract a prioritized P0/P1/P2 delta list → apply confirmed deltas to `model-profiles.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

N/A — this phase is research-only (`research_intent` is investigation, not `fix_bug`). It produces findings and a delta list; the only mutation it authorizes is the confirmed-delta registry backfill to `model-profiles.json`. The affected-surface inventory applies to the follow-on prompt-framework benchmark packet (126/004) that acts on these findings, not here.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001 merged (`mimo-v2.5-pro` provider registered for the research to reference)
- [ ] Attempt cli-codex `gpt-5.5` (high/fast) as the research executor per the 120/002 precedent; confirm `--search` availability

### Phase 2: Core Implementation (research)
- [ ] On `--search` unavailability in codex-cli 0.135.0, abort the cli-codex dispatch and switch to the built-in WebSearch tool + live provider metadata + on-machine probe
- [ ] Gather facts on: identity/provenance, context window + active budget, `--variant`/reasoning behavior, tool-calling style, output-verification heuristics, quota/rate-limit semantics, routing heuristics (MiMo vs MiniMax vs DeepSeek), and 126/004 prompt-framework hypotheses
- [ ] Synthesize the 8-section `research.md` with confidence tags + sources
- [ ] Extract the prioritized P0/P1/P2 delta list into `research/deltas/deltas.jsonl`

### Phase 3: Verification
- [ ] `research/research.md` exists, answers the in-scope questions, and ends with a Prioritized Deltas section
- [ ] `research/deltas/deltas.jsonl` holds the structured deltas with confidence + target file + evidence
- [ ] Registry backfill applied to `model-profiles.json` is limited to confirmed deltas (unverified items stay flagged)
- [ ] `validate.sh --strict` on this folder passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Delta integrity | Delta records well-formed (confidence + target + evidence) | `jq` over `deltas/deltas.jsonl` |
| Output presence | `research/research.md` exists with a delta list | file checks |
| Registry validity | `model-profiles.json` parses + confirmed-only edits | `jq` over `model-profiles.json` |
| Spec gate | Folder docs valid | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (MiMo provider integration) | Internal | Green | Research references a missing provider config |
| cli-codex `gpt-5.5` `--search` | External | Red | Not available in codex-cli 0.135.0; aborted, switched to WebSearch + live metadata + probe |
| WebSearch + current 2026 MiMo sources | External | Green | Primary evidence path; live provider metadata + probe corroborate |
| `opencode models xiaomi-token-plan-ams --verbose` | External | Green | Live provider metadata (endpoint, cost 0/0) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research yields no usable findings, or the registry backfill is later found to be wrong
- **Procedure**: Research outputs are additive (only `research/` plus the confirmed `model-profiles.json` delta). Revert the `model-profiles.json` backfill via git if a finding is invalidated; the `research/` artifacts can be regenerated by a full `/deep:start-research-loop` follow-up. No production runtime changes to revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
