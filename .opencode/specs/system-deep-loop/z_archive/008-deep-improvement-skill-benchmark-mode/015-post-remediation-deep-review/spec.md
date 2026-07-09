---
title: "Feature Specification: Post-Remediation Dual-Pass Deep Review (skill:deep-improvement)"
description: "Independent dual-pass deep review of the v1.11.1.0 remediated deep-improvement skill: two 5-iteration cli-opencode loops with MiMo-v2.5-pro (two fresh, independent passes) over skill:deep-improvement, to catch regressions or new issues introduced by the 28-finding remediation and to gauge run-to-run finding stability. Diagnostic (read-only); each pass writes its own review packet, then the two are compared. No source mutation. (Originally planned MiMo + MiniMax-M3; the MiniMax pass was aborted and replaced with a second MiMo pass.)"
trigger_phrases:
  - "post-remediation deep review"
  - "dual-model deep review deep-improvement"
  - "mimo minimax deep review"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/015-post-remediation-deep-review"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Both MiMo passes done; run-to-run comparison synthesized; read-only confirmed"
    next_safe_action: "Optional follow-up packet for the 3 stable findings; else complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs"
      - ".opencode/skills/deep-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-remediation-deep-review"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: Post-Remediation Dual-Pass Deep Review (skill:deep-improvement)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

After the v1.11.1.0 remediation closed all 28 findings from the prior MiMo review (phase `014`), this phase runs a fresh, independent deep review of `skill:deep-improvement` with **two 5-iteration MiMo-v2.5-pro passes** via cli-opencode, to catch any regression or new issue introduced by the fixes and to gauge run-to-run finding stability (does a fresh pass surface the same things?). The review is diagnostic and read-only: neither pass mutates the skill; each writes its own ranked review packet, then the two are compared into a combined verdict. (A MiniMax-M3 pass was originally planned as the second reviewer but was aborted and replaced with a second MiMo pass.)

**Critical Dependencies**: the remediated deep-improvement skill at HEAD (v1.11.1.0, suite 358/0 + drift 4/4 green at review start), the cli-opencode dispatch contract (omit `--agent`, closed stdin, `--pure` to stay MCP-independent), the authed Xiaomi Token Plan + MiniMax Token Plan providers, and the deep-review packet conventions (config/state/registry/deltas/iterations/dashboard/report).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete — both MiMo passes done (0 P0 each); reports + run-to-run comparison synthesized; read-only confirmed |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v1.11.1.0 remediation made substantial changes to the grader (dimension-awareness, `--append-system-prompt`), the live executor (truncation cap, brace-balanced scan), and refactored `scoreScenario`. The remediation claims behavior-preserving and the suite is green, but an independent review across two different model lenses raises confidence that no regression or new issue slipped through.

### Purpose
Run two independent 5-iteration deep reviews (MiMo-v2.5-pro, MiniMax-M3) over the remediated skill, with extra scrutiny on the changed files, and produce a per-model ranked report plus a cross-model comparison of what each surfaced.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Two cli-opencode deep-review loops over `skill:deep-improvement` (5 iterations each), both MiMo-v2.5-pro: run 1 → `review-mimo-v25pro/`, run 2 → `review-mimo-v25pro-run2/`.
- Per-pass ranked review-report.md + the canonical packet (config/state/registry/deltas/iterations/dashboard).
- A run-to-run comparison (overlap, pass-unique findings, verdict) in this phase's implementation-summary.

### Out of Scope
- Any source mutation of the deep-improvement skill (the review is read-only/diagnostic).
- Applying the findings (a separate remediation packet if any P0/P1 emerge).
- Re-reviewing sk-code (this phase targets deep-improvement only, per the operator's scope choice).
- The originally-planned MiniMax-M3 pass (aborted by the operator; replaced with MiMo run 2).

### Files to Change (this phase writes only review artifacts)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `015-.../review-mimo-v25pro/` | Create | MiMo-v2.5-pro run 1 — 5-iteration review packet + report |
| `015-.../review-mimo-v25pro-run2/` | Create | MiMo-v2.5-pro run 2 — 5-iteration review packet + report |
| `015-.../implementation-summary.md` | Create | Run-to-run comparison + combined verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both passes complete | Each MiMo pass runs its iterations and writes a packet + a synthesized review-report.md |
| REQ-002 | Read-only | Neither pass mutates the deep-improvement skill; `git status` shows only `015/` review artifacts |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Extra scrutiny on the remediation | Iteration prompts focus the changed v1.11.1.0 files (grader, live-executor, score-skill-benchmark, docs) |
| REQ-004 | Run-to-run comparison | A combined synthesis records overlap, pass-unique findings, and a verdict per pass + overall |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two ranked review-reports exist (one per model), each with a verdict + findings list with `file:line` evidence.
- **SC-002**: A run-to-run comparison identifies which findings both passes agree on (stable/high-confidence) vs pass-unique, and whether any new P0/P1 emerged post-remediation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Smaller-model shallow review | Medium | Two passes × 5 iters; expect strong structural/consistency findings, set depth expectations |
| Risk | cli-opencode dispatch hang | Medium | `--pure` (MCP-independent), closed stdin, 15-min per-iteration timeout, per-iteration logs |
| Risk | Single-model blind spot (both passes MiMo) | Medium | Run-to-run stability still catches non-determinism; a frontier or different-model pass remains a future option |
| Risk | Provider quota/auth failure | Low | Xiaomi Token Plan pre-flight-confirmed authed (both passes share it; run sequentially-ish to avoid quota spikes) |
| Dependency | Remediated skill at HEAD | — | Review runs against the committed v1.11.1.0 state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will a fresh MiMo pass surface the same findings as the first (stable), or drift run-to-run? (Answered by the run-to-run comparison.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-iteration timeout 15 min; both passes share the Xiaomi provider, so run-2 follows run-1 to avoid quota spikes.

### Security
- **NFR-S01**: Read-only review; `--dangerously-skip-permissions` dispatch is acceptable because the loop only reads + writes its own `015/review-*/` packet (no worktree needed for a read-only review).

### Reliability
- **NFR-R01**: Each iteration's stdout/stderr is logged under `raw-logs/`; a dispatch error on one iteration is recorded and the loop continues.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A model that returns no parseable iteration record: the driver logs an `iteration_error` event and continues; the dashboard shows the gap.

### Error Scenarios
- A loop interrupted mid-run (session gap): the written iterations/deltas persist; the report is synthesized from whatever the registry holds, with the gap noted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | two read-only review loops + a comparison |
| Risk | 10/25 | read-only; main risk is dispatch reliability + shallow-model depth |
| Research | 12/20 | the review IS the work, outsourced to two models |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
