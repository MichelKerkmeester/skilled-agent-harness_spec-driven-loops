---
title: "Feature Specification: CP Stress Scenarios — copilot → opencode Executor Swap (030 Phase 009)"
description: "Swap the 18 copilot-driven CP/discipline stress scenarios across deep-review/deep-research/deep-agent-improvement to cli-opencode (deepseek-direct), restore the pruned deep-agent-improvement fixture, re-run, and flip the 030 SKIPs."
trigger_phrases:
  - "cp copilot to opencode swap"
  - "030 phase 009 copilot swap"
  - "cp stress opencode executor"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/009-cp-copilot-to-opencode-swap"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "18 CP re-run via opencode/deepseek - 13 PASS 5 PARTIAL 0 FAIL"
    next_safe_action: "Validate --strict all touched packets + parent reconcile"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Executor: cli-opencode (deepseek-v4-pro via direct deepseek API provider, NOT opencode-go) — operator 2026-05-27"
      - "deep-agent-improvement fixture: restore pruned 060-stress-test from git → run all 18 — operator 2026-05-27"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: CP Stress Scenarios — copilot → opencode Executor Swap (030 Phase 009)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete — 18 re-run via opencode/deepseek (13 PASS / 5 PARTIAL / 0 FAIL); fixture restored |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (030 phase parent) |
| **Predecessor** | 008-dai-rulecoherence-inline-fallback |
| **Trigger** | 030 release-readiness matrix "path to READY": the 19 SKIPs are copilot-driven, and copilot is org-policy-blocked here |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 030 validation run recorded **19 SKIP** verdicts. 18 of those are copilot-driven CP/discipline stress scenarios — deep-review `07--command-flow-stress-tests` (CP-052..057), deep-research `07--command-flow-stress-tests` (CP-046..051), deep-agent-improvement `08--agent-discipline-stress-tests` (CP-040..045) — that invoke `copilot -p ... --model gpt-5.5`. The `copilot` CLI is org-policy-blocked in this environment ("Third-party MCP servers disabled by org policy"), so they cannot run. CP-040..045 carry a **second** blocker: their setup needs the `060-stress-test` fixture, pruned in checkpoint commit `e917f76347`.

### Purpose
Replace the copilot executor with `cli-opencode` (model `deepseek/deepseek-v4-pro` via the **direct DeepSeek API provider**, not opencode-go) in all 18 scenario files, restore the pruned deep-agent-improvement fixture from git, re-run the scenarios, orchestrator-verify, and flip the 030 ledger SKIPs to their real verdicts. opencode natively owns the `.opencode/` command runtime, so `/deep:*` slash commands execute without the foreign-runtime overhead copilot incurred.

> The 19th SKIP (`DR-032`) is a deep-research `blocked_stop` fixture gap, NOT copilot-driven — explicitly OUT OF SCOPE here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Swap `copilot -p ... --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir ...` → `opencode run ... --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir <sandbox> </dev/null` in 18 scenario files (30 invocations).
- Restore the pruned `060-stress-test` fixture (4 runtime forms) from `e917f76347^` to the deep-agent-improvement skill at the current plural path.
- Re-run the 18 scenarios via opencode, orchestrator-verify the grep-checkable signals, and flip the 030 child ledger SKIPs (CP-040..045 in 005, CP-046..051 in 004, CP-052..057 in 003).
- Update `006-release-readiness-synthesis/release-readiness-matrix.md` tallies + verdict.

### Out of Scope
- `DR-032` (non-copilot `blocked_stop` fixture gap).
- Changing scenario pass/fail criteria, differential A/B structure, or the helper-evidence checks.
- Editing the deep-loop skill runtimes themselves (only fixture restore + scenario-doc executor swap).
- Re-running already-PASS/PARTIAL non-CP scenarios.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/0{52..57}-*.md` | Modify | copilot→opencode (1 call each) |
| `.opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/0{46..51}-*.md` | Modify | copilot→opencode (2 calls each) |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/0{13..18}-*.md` | Modify | copilot→opencode (2 calls each) |
| `.opencode/skills/deep-agent-improvement/test-fixtures/060-stress-test/**` | Restore | recover pruned fixture (4 runtime forms) from git |
| `030-.../00{3,4,5}-*/checklist.md` | Modify | flip CP SKIP verdicts post-rerun |
| `030-.../006-release-readiness-synthesis/release-readiness-matrix.md` | Modify | re-tally + verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R1 | The swap preserves each scenario's differential A/B structure, prompts, sandbox dirs, capture, and grep-checkable verification — only the executor binary + flags change. |
| R2 | Executor = `opencode run --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir <sandbox> </dev/null`. NO `--pure` (it disables the `.opencode/` command runtime these scenarios need). |
| R3 | `--add-dir <sandbox> --add-dir <spec>` collapses to `--dir <sandbox>`; the spec dir is reached by absolute path under skip-permissions (both live under `/tmp`). |
| R4 | The pruned `060-stress-test` fixture is restored to the path the current setup script expects (`.opencode/agents/` plural for the opencode form). |
| R5 | Re-runs are orchestrator-verified (anti-fabrication): the orchestrator inspects the produced sandbox/spec artifacts + diffs, not just the model's transcript. |
| R6 | Blast radius is bounded to `/tmp`: `--dir` points at the `/tmp/cp-*` sandbox, never the repo; the per-scenario git tripwire confirms the repo stays clean. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] All 18 scenario files invoke `opencode run` (deepseek-direct); zero `copilot -p` remain in the 3 CP categories.
- [x] The `060-stress-test` fixture is restored; the deep-agent-improvement setup script runs clean.
- [x] All 18 scenarios re-run via opencode with a recorded PASS/PARTIAL/FAIL verdict + orchestrator evidence.
- [x] The 030 child ledgers (003/004/005) have their CP SKIP rows flipped to real verdicts.
- [x] `release-readiness-matrix.md` re-tallied; SKIP count drops by 18; verdict recomputed.
- [x] `validate.sh --strict` passes for 009 + every touched 030 child + parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| deepseek-v4-pro is a weaker driver than gpt-5.5 → may fumble the `/deep:*` flow, producing model-noise FAILs | Operator chose deepseek-direct knowingly; verdicts annotated "executor=opencode/deepseek"; orchestrator distinguishes model-fumble from skill defect before recording FAIL |
| opencode `run` may not expand a leading `/deep:*` slash command non-interactively | Prototype CP-046 Call B FIRST; if leading-slash isn't expanded, fall back to `--command` flag or natural-language framing before bulk edit |
| `--dangerously-skip-permissions` blast radius (RM-8: 44 files deleted) | `--dir` pinned to `/tmp/cp-*` sandbox (not repo-root); per-scenario git tripwire; repo verified clean after each run |
| Restoring a deliberately-pruned fixture reverses prior cleanup | Operator explicitly approved restore; fixture recovered verbatim from git, scoped to test-fixtures only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- (RESOLVED) Executor → cli-opencode, `deepseek/deepseek-v4-pro` via direct DeepSeek API provider (operator 2026-05-27).
- (RESOLVED) deep-agent-improvement fixture → restore from git, run all 18 (operator 2026-05-27).
- (DEFERRED) DR-032 `blocked_stop` fixture gap — out of scope; remains SKIP.
<!-- /ANCHOR:questions -->
