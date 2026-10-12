---
title: "Implementation Summary"
description: "Ten-iteration deep research on cli-devin found the root README install path accurate after v4.0.0.4, and ranked 28 wording fixes for stale counts, the ClickUp setup lines and three v4.0.0.4 changes the related READMEs miss."
trigger_phrases:
  - "readme freshness research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research"
    last_updated_at: "2026-10-12T15:34:04Z"
    last_updated_by: "deep-research-orchestrator"
    recent_action: "Ran ten deep-research iterations on cli-devin and wrote the checked synthesis"
    next_safe_action: "Operator decides the hub README version rule, then a fix phase applies F1 to F23"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:21a700f43a866060e2ca6f5ae386af31c0ed9eec5ec829e5558f1efc1819c6b1"
      session_id: "dr-023-readme-freshness-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Hub README version rule: per-doc edition or the SKILL.md version (research/research.md Section 8)"
    answered_questions:
      - "Q1 to Q5, see research/research.md Section 4"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-readme-freshness-research |
| **Completed** | 2026-10-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a ranked, checked list of every README statement that v4.0.0.4 left behind, each with the exact wording that fixes it. The root README install path holds: Node 24, the build steps, `skilled.trustRepoHooks` and the seven runtimes all match the release note. What went stale is the ClickUp setup line, the ClickUp capability list and five counts the retired agent and commands changed.

### Phase 23: readme-freshness-research

`research/research.md` Section 11 lists F1 to F28, grouped per README. F1 and F2 fix the ClickUp lines. F3 to F11 fix counts and the agent mirror list in the root README. F12, F13 and F15 add three v4.0.0.4 changes the related READMEs miss: `surfaceHint`, the skill-authoring pre-commit sub-gate and the mirror checker's new home. F24 to F28 wait on one operator decision, because the parent-skill doctor's README version check contradicts the per-doc version rule. No README or product file changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Checked synthesis with the ranked F1 to F28 fix list and the OK-VERIFIED list |
| `research/` (iterations, deltas, prompts, state, strategy, registry, dashboard, resource map, ledgers, receipts) | Created | The loop's state and ten iterations |
| `spec.md` | Modified | Pre-init research context and the generated findings fence under Open Questions |
| `implementation-summary.md`, `goal.md`, `tasks.md`, `plan.md` | Modified | Outcome, log and task state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sub-orchestrator executed the `/deep:research` auto YAML step by step, as the 020 runs did. Each of the ten iterations went through the YAML's `cli-devin` branch (`buildLineageCommand` plus `runAuditedExecutorCommand`) as `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, with `AI_SESSION_CHILD=1` and stdin closed. Every iteration passed `verify-iteration.cjs` on its first dispatch. The orchestrator then re-ran the counts and re-read the cited lines itself, and corrected seven executor claims (`research/research.md` Section 9).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run on `cli-devin` with `deepseek-v4-1-flash-max` | The operator corrected the executor from cli-pi to cli-devin before any iteration ran; the model is on `DEVIN_SUPPORTED_MODELS` and `devin models list`, and the max effort lives in the id |
| Assign one slice per iteration | The stop policy is max-iterations, so the YAML asks for a broader focus each pass; the slices covered the root README, then the related READMEs, then a re-verification pass |
| Mark F24 to F28 as blocked | `frontmatter-versioning.md:30` and `parent-skill-check.cjs:1806` disagree on what a hub README version means |
| Drop the scenario count from F20 | The sk-git playbook's own counts disagree (46 files, 50 by its category lines) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records in the state log | 10 `"type":"iteration"` records |
| `verify-iteration.cjs` per iteration | Exit 0 for all ten, no redispatch |
| Dispatch receipts | All ten record `devin` with `--model deepseek-v4-1-flash-max` |
| Orchestrator re-counts | 11 agents, 37 commands, 41 rules (7 warn), 20 doctor workflows, 7 advisor options, ClickUp 111 and 35 |
| Parent-skill doctor 13c on five hubs | FAIL on three, WARN on two |
| Goal criteria and strict validation | See `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **F24 to F28 wait on an operator decision.** The two version rules contradict each other.
2. **Three medium-confidence rows.** F18, F20 and F22 rest on a reading of what the line means; `research/research.md` Section 14 names each.
3. **Two workflow steps were simplified.** The single-loop status-ledger heartbeat rows were not written, and the executor audit field was not patched into the state projection, which the gateway rebuilds; both match the 020 precedent and no gate reads them.
4. **The upstream model host is unknown.** Devin reports the model id, not which provider serves it.
<!-- /ANCHOR:limitations -->

---
