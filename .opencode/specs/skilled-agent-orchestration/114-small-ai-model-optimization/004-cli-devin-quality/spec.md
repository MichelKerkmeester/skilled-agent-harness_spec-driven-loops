---
title: "Feature Specification: cli-devin quality optimization — context budget engine + output verification pipeline"
description: "Phase C of 114 follow-on roadmap. Ship per-model token-budget engine + output-verification pipeline (compile/run/test/lint + hard-fail gate) for cli-devin SWE-1.6 dispatches."
trigger_phrases:
  - "cli-devin context budget"
  - "cli-devin output verification"
  - "swe-1.6 budget engine"
  - "verification pipeline cli-devin"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/004-cli-devin-quality"
    last_updated_at: "2026-05-18T14:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 004 spec.md L3"
    next_safe_action: "Author 004 plan.md"
    blockers: []
    key_files:
      - "../001-research-smallcode/research/research.md"
      - ".opencode/skills/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000013"
      session_id: "114-004-spec-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Per-model token-budget defaults for Opus/Sonnet (research only covered SWE-1.6/DeepSeek/Kimi/Qwen/GLM)"
    answered_questions:
      - "Budget engine: smallcode-derived percentage + fit-to-budget + eviction patterns"
      - "Verification: compile→execute→smoke-test→lint + hard-fail gate"
---

# Feature Specification: cli-devin quality optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase C of 114 follow-on roadmap. Ship two related improvements to cli-devin SWE-1.6 dispatches: (1) per-model token-budget engine adapted from smallcode-master src/context/budget.ms — token allocation defaults, fit-to-budget truncation with `[... N tokens cut]` markers, priority eviction; (2) output-verification pipeline adapted from smallcode src/governor/verifier.ms + hard_fail.ms — compile→execute→smoke-test→lint with confidence scoring, refuse-to-ship gate on hard-fail. Effort: ~28 hours across 3 internal sub-packets. Daily quality lift on the most-used dispatch surface.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
| **Predecessor** | 002-foundation-routing (must ship first) |
| **Successor** | 005-shared-intelligence (consumes the model-profile pattern that emerges here) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

SWE-1.6 dispatches today have NO context-budget awareness — every iter sends prompts up to the model's window with no truncation hints, no eviction priority. When budgets are exceeded, the model silently drops context. Separately, cli-devin has NO output verification — when SWE-1.6 produces code, it ships untested. Both gaps are documented in research.md §RQ1 + §RQ2 with 9 candidate patterns each from smallcode-master.

### Purpose

Adopt smallcode's context budget engine (token allocation, truncation, eviction) and output verification pipeline (compile/execute/test/lint + hard-fail) into cli-devin's agent-config-iter recipes + supporting reference docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New ref doc `cli-devin/references/context-budget.md` (smallcode-derived patterns + integration)
- New asset `cli-devin/assets/per-model-budgets.json` (token defaults — slim scope per 2026-05-18 user direction: SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6 required; Claude Haiku + Gemini Flash optional if/when adopted; GLM-5.1, gpt-5.5, Opus, Sonnet dropped from scope to avoid bloat)
- Update `cli-devin/assets/prompt_templates.md` with truncation marker syntax
- New ref doc `cli-devin/references/output-verification.md` (compile/run/test/lint pipeline)
- New asset `cli-devin/assets/confidence-scoring-rubric.md` (smallcode formula adapted for research output)
- Update 3 agent-config recipes (research-iter, review-iter, synthesis) `system_instructions` with verification block
- Extend `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` with optional verification-pass gate
- Update `cli-devin/SKILL.md` §3 Model Selection to cross-reference budget asset
- Add `sk-small-model/references/pattern-index.md` rows for both new doc paths

### Out of Scope

- cli-opencode budget/verification (Phase E covers cli-opencode eviction propagation)
- Model profile registry (Phase D)
- Bayesian tool scoring (Phase D)
- Escalation engine (Phase D)
- CI checks (Phase F deleted 2026-05-18; out of scope)

### Files to Change

| File Path | Change Type |
|-----------|-------------|
| `cli-devin/references/context-budget.md` | Create |
| `cli-devin/references/output-verification.md` | Create |
| `cli-devin/assets/per-model-budgets.json` | Create |
| `cli-devin/assets/confidence-scoring-rubric.md` | Create |
| `cli-devin/assets/prompt_templates.md` | Modify |
| `cli-devin/assets/agent-config-deep-research-iter.json` | Modify |
| `cli-devin/assets/agent-config-deep-review-iter.json` | Modify |
| `cli-devin/assets/agent-config-synthesis.json` | Modify |
| `cli-devin/SKILL.md` | Modify |
| `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Modify |
| `system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` | Modify |
| `sk-small-model/references/pattern-index.md` | Modify |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | per-model-budgets.json covers the 4 in-scope models (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6) with fields: context_length, max_budget_pct, working_memory_tokens, summary_threshold. Optional: Haiku, Gemini Flash if user opts in | jq audit shows all 4 required entries populated |
| REQ-002 | Truncation marker syntax adopted in prompt_templates.md §2 (SWE-1.6 dispatch template) | grep `[... truncated N tokens]` in templates |
| REQ-003 | confidence-scoring-rubric.md defines compile/execute/test/lint weights + threshold | manual review confirms rubric matches smallcode adapted form |
| REQ-004 | 3 agent-config recipes have new system_instructions block enabling verification pass when applicable | jq audit confirms additions |
| REQ-005 | post-dispatch-validate.ts has new optional verification-pass step that reads rubric + scores | TS compile + unit test pass |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Reference docs cite research.md §RQ1 + §RQ2 + iter-006 + iter-007 with line refs | grep audit |
| REQ-007 | sk-small-model/references/pattern-index.md has 2 new rows (context-budget + output-verification) | grep audit |
| REQ-008 | cli-devin SKILL.md §3 Model Selection table cross-references per-model-budgets.json | grep confirms link |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A test cli-devin SWE-1.6 dispatch with budget engine active shows the truncation marker when context >70% of window
- **SC-002**: A test iter where SWE-1.6 hallucinates a syntax error gets caught by verification pipeline (confidence < threshold) and is marked degraded in JSONL
- **SC-003**: Existing deep-research / deep-review packets pass with verification OFF by default (backward compat)
- **SC-004**: Per-model budget defaults match the values empirically observed in 001-research-smallcode loop (where applicable)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-aggressive verification causes iter false-fail | iters get retried unnecessarily; cost goes up | Tune threshold conservatively; ship verification OFF by default |
| Risk | Budget engine miscalculates token counts (4-char heuristic) | Premature truncation drops important context | Compare with tokenizer counts on sample iters before locking defaults |
| Dependency | post-dispatch-validate.ts surface | Existing validator must extend cleanly | Read current implementation; sibling-step pattern |
| Dependency | 002-foundation-routing shipped | sk-small-model needs to exist for pattern-index updates | Block 004 start until 002 merged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Budget engine evaluation < 10ms per prompt composition
- **NFR-P02**: Verification pass < 60s per iter (compile/run/test/lint timeouts capped)

### Reliability

- **NFR-R01**: Verification OFF by default for backward compat
- **NFR-R02**: Verification failure on a single artifact downgrades iter, not the whole loop
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Iter prompt fits within budget: no truncation, no markers
- Tool result exceeds total budget: truncate with marker; do NOT silently drop
- Verification pass when no code is produced (research-iter): skip verification, mark as N/A
- Multi-language code in one iter: run each language's verifier independently; score each
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 11 files modified/created; 3 recipes + validator |
| Risk | 14/25 | Verification gate could destabilize iters if too aggressive |
| Research | 8/20 | Done in 001 iter-006/iter-007 |
| Coordination | 14/25 | Touches cli-devin + system-spec-kit |
| Reversibility | 12/15 | Verification OFF by default; rollback easy |
| **Total** | **66/110** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Likelihood | Impact | Mitigation | Owner |
|---------|-------------|-----------|--------|------------|-------|
| R-001 | Over-aggressive verification false-fails iters | M | M | Conservative threshold; OFF by default | implementer |
| R-002 | Budget defaults wrong for some model | M | L | Empirically validate against 001 loop data | implementer |
| R-003 | Token-count heuristic miscalibrated for SWE-1.6 | L | M | Spot-check via tokenizer on sample prompts | implementer |
| R-004 | post-dispatch-validate.ts breakage | L | H | Sibling-step pattern; existing function unmodified | implementer |
| R-005 | Recipe edits conflict with parallel work | L | L | Coordinate with anyone touching cli-devin/assets | reviewer |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001 — As an SWE-1.6 dispatcher**, I want my prompts to truncate cleanly when budget is exceeded so the model knows context was cut, not missing.
- **US-002 — As a deep-research operator**, I want hallucinated code to be caught by verification before synthesis, so research.md doesn't propagate broken patterns.
- **US-003 — As a cli-devin maintainer**, I want budget defaults documented per model so I don't have to re-derive them from smallcode every time.
- **US-004 — As a packet author**, I want verification to be opt-in so my existing iters keep working unchanged.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Verification threshold: research mentions 0.5 but smallcode uses different mix (compile=0.35 weight). Confirm value before locking.
- Per-language verifier commands (compile/lint) — hardcode in confidence-scoring-rubric.md or auto-detect from file extension at runtime?
- Whether to ship empty placeholders for Haiku + Gemini Flash now or wait until they're actually adopted (lean: wait).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Predecessor**: `../002-foundation-routing/spec.md`
- **Research**: `../001-research-smallcode/research/research.md` §RQ1 + §RQ2 (research) + iter-006 + iter-007 (deepening)
- **Sibling docs**: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
