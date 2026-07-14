---
title: "Implementation Plan: 095 - sk-code-review playbook execution"
description: "Sequential dispatch of 18 sk-code-review scenarios via opencode + deepseek; per-scenario log capture + aggregated results."
trigger_phrases:
  - "095 plan"
importance_tier: "normal"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution"
    last_updated_at: "2026-05-07T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Dispatch loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 095 - sk-code-review playbook execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Bash + opencode CLI |
| **Provider** | DeepSeek (via `deepseek/<model>` in opencode) |
| **Storage** | Per-scenario logs in `/tmp/095-CR-NNN.log` |
| **Output** | Aggregated results table to user |

### Overview
For each of the 18 sk-code-review playbook scenarios, build a self-contained prompt that loads the sk-code-review baseline + targets a small synthetic diff, dispatch via `opencode run --model deepseek/deepseek-chat`, capture stdout, then orchestrator reads the transcript and assigns a verdict per the playbook's pass/fail criteria. Sequential dispatch (per memory rule about parallel CLI unreliability).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec docs authored
- [x] opencode + deepseek availability verified
- [x] sk-code-review playbook structure understood

### Definition of Done
- [ ] 18 scenarios dispatched
- [ ] 18 transcripts captured
- [ ] Aggregated results table delivered
- [ ] implementation-summary.md filled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bash dispatch loop → per-scenario log → orchestrator-side verdict assignment → aggregated table.

### Per-scenario prompt skeleton
For each CR-NNN scenario, the prompt sent to opencode + deepseek includes:
1. The exact prompt from the scenario's SCENARIO CONTRACT line.
2. A reference to the sk-code-review SKILL.md baseline (loaded by opencode's plugin/skill runtime).
3. A synthetic target (small diff, snippet, or scenario-specific input) appropriate to the scenario.
4. Instruction to return findings-first review per sk-code-review references.

For sandbox-bound scenarios (e.g., scenarios that test agent boundaries or live cross-CLI coordination), opencode + deepseek cannot fully reproduce the contract — those are marked SKIP with reason.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold packet 095
- [x] Verify opencode + deepseek availability
- [x] Read sk-code-review playbook scenarios

### Phase 2: Core Implementation
- [ ] Build dispatch script that loops 18 scenarios sequentially
- [ ] Each dispatch uses `--format json` for clean parseable output
- [ ] Capture per-scenario log to `/tmp/095-CR-NNN.log`

### Phase 3: Verification
- [ ] Orchestrator reviews each transcript against playbook pass/fail criteria
- [ ] Assign verdict (PASS / PARTIAL / FAIL / SKIP)
- [ ] Aggregate into results table
- [ ] Update graph-metadata + write implementation-summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Per-scenario verdict assignment | Orchestrator reads transcript against pass/fail criteria |
| Aggregation | Final results table | Markdown table, sorted by category and CR-ID |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| opencode CLI 1.14.39 | External | Green (verified) |
| DeepSeek API auth | External | Green (configured) |
| sk-code-review playbook | Internal | Green (just shipped) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: opencode + deepseek pipeline produces unusable output (session pollution, auth failure, rate limits).
- **Procedure**: Mark all 18 scenarios as SKIP with the failure reason; document blockers; close packet without execution baseline.
<!-- /ANCHOR:rollback -->
