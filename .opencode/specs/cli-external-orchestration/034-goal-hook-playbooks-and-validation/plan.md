---
title: "Implementation Plan: Goal-Hook Playbooks and Live Cross-Runtime Validation"
description: "Author goal-hook playbook scenarios by reference across 5 CLI skill trees, then capture live validation evidence per runtime using canary-token + transcript-grep proof, isolated via MK_GOAL_STATE_DIR."
trigger_phrases:
  - "goal hook playbook plan"
  - "goal hook validation plan"
  - "cross runtime goal hook proof method"
  - "name"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/034-goal-hook-playbooks-and-validation"
    last_updated_at: "2026-07-29T09:38:42Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/checklist/summary for the goal-hook tracker"
    next_safe_action: "Run generate-description.js, backfill, and validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md"
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/pi-injection-excerpt.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hook-playbooks-and-validation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Goal-Hook Playbooks and Live Cross-Runtime Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (manual-testing-playbook docs) + shell/CLI live-model runs |
| **Framework** | sk-doc `create-manual-testing-playbook` template, system-spec-kit manifest templates |
| **Storage** | None — evidence is captured as flat `.txt` files under `evidence/` |
| **Testing** | Live model runs via cli-devin, cli-cursor, cli-pi, and `opencode run`; `validate.sh --strict` for the tracker docs |

### Overview
This packet has two halves: (1) name and reference the 6 goal-hook playbook docs that belong in each CLI skill's `manual-testing-playbook/` tree, and (2) actually run the goal hook live against cheap/free models per runtime, grep the raw transcript for a per-run canary token and the `[active_goal]` marker, and record an honest verdict. No goal-hook implementation code changes here — packet 032 already shipped and closed that work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — packet 032 closed with no playbook/live-proof coverage, this packet's `spec.md` §2-3
- [x] Success criteria measurable — `spec.md` SC-001..SC-003
- [x] Dependencies identified — packet 032 confirmed `completion_pct: 100` before this packet started

### Definition of Done
- [x] All acceptance criteria met — REQ-001..REQ-005 satisfied, see `checklist.md`
- [x] Tests passing (if applicable) — live validation runs captured, honest verdicts recorded
- [x] Docs updated (spec/plan/tasks) — all 5 tracker docs authored together in this pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-authoring + live-validation pattern (no application architecture; this is a tracking packet).

### Key Components
- **Goal-hook playbooks**: `goal-hook.md` manual-testing-playbook scenarios owned by each CLI skill tree (`DV/CU/PI/CO/CC-###` ids), plus the shared `goal-manage-cli.md`
- **Live validation harness**: canary-token + raw-transcript-grep methodology, run per runtime with a mandatory `MK_GOAL_STATE_DIR` isolation directory so no run mutates shared/default goal state

### Data Flow
A seeded active-goal state carries a unique canary string (e.g. `GOALCANARY-PI-2603128151`) inside its objective. The runtime's input/context transform injects an `[active_goal]` block containing that canary into the model turn. The raw transcript (or model reply) is grepped for the canary and the `[active_goal]` marker; occurrence counts and quoted excerpts become the evidence, and the verdict (PASS / RECORDED-EVIDENCE / SKIP) is recorded honestly per runtime's actual delivery channel.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this packet documents and validates the goal-hook code that packet 032 already shipped; no code fix or diff is authored here. No producer/consumer inventory is required.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed packet 032 (goal-hook implementation) shipped `completion_pct: 100` before authoring playbooks
- [x] Packet `034-goal-hook-playbooks-and-validation` folder plus `evidence/` subdir created
- [x] Read the sk-doc manual-testing-playbook template and each CLI skill's existing playbook conventions

### Phase 2: Core Implementation
- [x] Named the 5 per-runtime `goal-hook.md` playbook scenarios (by path, authored in the CLI skill trees)
- [x] Named the shared `goal-manage-cli.md` playbook (by path, authored under `manual-testing-playbook/plugins-and-hooks/`)
- [x] Ran live validation for Pi, Devin, and Cursor; attempted live validation for OpenCode mk-goal and documented the finding

### Phase 3: Verification
- [x] Manual testing complete — 4 live runs executed (Pi, Devin, Cursor, OpenCode mk-goal attempt), evidence captured for each
- [x] Edge cases handled — Cursor's model-invisible injection and mk-goal's headless-tool-exposure gap both recorded honestly, not glossed over
- [x] Documentation updated — spec/plan/tasks/checklist/implementation-summary authored together, cross-referencing packet 032 and `evidence/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable — no code authored by this packet | N/A |
| Integration | Goal-hook injection reaching the model turn, per runtime | cli-devin, cli-cursor, cli-pi, `opencode run` |
| Manual | Canary-token + raw-transcript-grep verification per runtime | Direct CLI invocation + `grep` against captured transcripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet `032-goal-hooks-cross-runtime` | Internal | Green — shipped, `completion_pct: 100` | Without it there is nothing to validate live |
| cli-devin, cli-cursor, cli-pi runtimes | External | Green — all reachable this session | A blocked runtime would downgrade its verdict to SKIP, as done for mk-goal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A playbook scenario or verdict recorded here is later found inaccurate against the actual runtime behavior
- **Procedure**: Revise the scenario text or verdict tier in the affected `goal-hook.md` / `checklist.md`; no implementation code needs reverting since none was touched
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Author + Validate) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Packet 032 shipped | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~15 min |
| Core Implementation | Medium | ~2-3 hours (4 live runs + 6 playbook path decisions) |
| Verification | Low | ~30 min (validate.sh iterate to Errors: 0) |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — not applicable, no data migrations
- [x] Feature flag configured — not applicable, doc-only packet
- [x] Monitoring alerts set — not applicable

### Rollback Procedure
1. Revert or edit the affected tracker doc(s) in this packet
2. No code revert needed — no implementation files were touched
3. Re-run `validate.sh --strict` to confirm the tracker is still clean
4. Not user-facing — no stakeholder notification required

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
