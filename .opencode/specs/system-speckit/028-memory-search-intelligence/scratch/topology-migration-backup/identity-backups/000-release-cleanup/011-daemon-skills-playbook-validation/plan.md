---
title: "Implementation Plan: 028 Daemon Skills Playbook Validation [template:level_2/plan.md]"
description: "The harness, dispatch shape, isolation recipe, and scoring method for the daemon-skills playbook validation. Stress suites run directly via vitest. Playbook scenarios run through cli models on disposable clones with per-clone daemon isolation. Status complete and salvaged."
trigger_phrases:
  - "daemon skills playbook validation plan"
  - "028 playbook benchmark harness"
  - "per-clone daemon isolation recipe"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/000-release-cleanup/011-daemon-skills-playbook-validation"
    last_updated_at: "2026-07-04T17:31:28.734Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the harness, isolation recipe, and scoring method"
    next_safe_action: "Operator decides whether to re-run the remaining 249 spec-kit scenarios"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-plan-011-daemon-skills-playbook-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 028 Daemon Skills Playbook Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Read-only validation. Vitest for stress, opencode cli dispatch for playbooks |
| **Framework** | `opencode run --model <M> [--variant medium] --format json --dir <clone>` |
| **Storage** | Raw transcripts plus a results json and two eval logs (insights and remediation) |
| **Testing** | Vitest stress suites run directly. Playbook scenarios scored by critical read |

### Overview
Stress suites are deterministic code so they run directly through vitest, one per skill. Playbook scenarios are model-executed prompts so they run through a small async driver that dispatches each scenario to a cli model on one of three disposable clones, captures the json stream, and classifies the verdict from a forced marker in the final assistant message. Scoring is a separate critical pass, not a verdict-string trust. Findings and remediations are written live during the loop.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Stress suites identified per skill
- [x] Playbook packages enumerated per skill (403 spec-kit, 47 advisor, 21 code-graph)
- [x] Isolation recipe proven before the run

### Definition of Done
- [x] Stress recorded per skill
- [x] Playbook coverage recorded per skill and model for the scenarios that ran
- [x] Findings carry evidence and remediation
- [ ] Full 471 coverage (not met, frozen at 222 by the workspace wipe)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern: isolated model dispatch over disposable clones

The driver dispatches each scenario with a wrapped prompt that appends an instruction to execute autonomously and end with exactly one VERDICT marker. The verdict is parsed from the final assistant message only, not from echoed reasoning. Resume is by scenario index, so a scenario whose transcript already exists is skipped regardless of which model produced it.

### Key Components

| Component | Role |
|-----------|------|
| Stress runner | Runs the three vitest suites directly against real code |
| Dispatch driver | Async pool, concurrency 3, per-model variant, index-resume |
| Worker clones | Three copy-on-write clones, git-reset between scenarios |
| Per-clone isolation | Each clone opencode.json redirects all three daemons clone-local |
| Scorer | Critical per-run read into the insights and remediation logs |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Stress
Run all three vitest stress suites directly. Record pass counts.

### Phase 2: Playbook dispatch (first model pair)
Run the early scenarios through MiMo v2.5 Pro and Kimi k2.7. Kept via index-resume across the later model swap.

### Phase 3: Playbook dispatch (second model pair)
After dropping MiMo per operator directive, run the remaining scenarios through Kimi k2.7 and gpt-5.5 medium fast, split by index parity.

### Phase 4: Scoring and findings
Read each run critically, score it, and write findings plus remediation live.

### Phase 5: Report
Consolidate stress, coverage, cross-model comparison, findings, and isolation caveats.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Stress is the test layer and runs first as a deterministic gate. Playbook scenarios are not pass-fail gates by themselves. Each is scored for whether the model actually executed, whether the verdict is justified against the expected signals, and what insight it surfaced. A PASS string with 0 tools and 98 chars is treated as a non-run, not a pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why |
|------------|-----|
| opencode cli with the three daemon skills | Dispatch surface for the playbook scenarios |
| Two billing-available cli models per phase | opencode-go billing was blocked, so alternates were used |
| Disposable clones plus a killed global daemon | Isolation so the real repo stays clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The validation is read-only against product code, so there is nothing to roll back in the product. The clones are disposable. The only durable artifact is this packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends on |
|-------|-----------|
| 1 Stress | none |
| 2 Dispatch pair 1 | isolation proven |
| 3 Dispatch pair 2 | phase 2 index-resume map |
| 4 Scoring | a run in flight |
| 5 Report | scoring logs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Phase | Estimate |
|-------|----------|
| Stress | Minutes per suite |
| Dispatch | Multi-hour across 471 scenarios at concurrency 3 |
| Scoring | Continuous during the loop |
| Report | One authoring pass |

Actual: the run reached 222 of 471 before the workspace was wiped on a process exit.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK AND RECOVERY

The benchmark scratchpad and the three clones lived under the system temp tree and were cleared when the previous process exited. The driver, raw transcripts, results json, and the live eval logs were lost. Recovery used the surviving 78M session transcript: the two eval logs were reconstructed by replaying every recorded Write and Edit, and the per-scenario verdict lines plus the coverage tallies were parsed back out. The two schema findings were re-confirmed against the live DB read-only. No product state needed recovery because the run never touched it.
<!-- /ANCHOR:enhanced-rollback -->
