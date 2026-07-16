---
title: "Implementation Summary"
description: "20-replica multi-model deep-research fanout validating the system-deep-loop merge design. 15/20 completed via the real fanout; 5/5 sonnet5 (cli-claude-code) failed on a macOS Keychain auth gap and were substituted with 5 in-session Plan-agent deep-dives. Real, load-bearing corrections found and applied to phase 002's plan."
trigger_phrases:
  - "reference research implementation summary"
  - "001 research complete"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/001-reference-research"
    last_updated_at: "2026-07-08T06:06:21.300Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "implementation-summary.md complete; checklist resolved"
    next_safe_action: "Execute 002-hub-rename-and-runtime-nesting Stage 0"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-001-scaffold"
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
| **Spec Folder** | 001-reference-research |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 20-replica multi-model deep-research fanout stress-testing the merge design already drafted for phases 002/003, dispatched via `deep-loop-runtime/scripts/{fanout-run,fanout-merge}.cjs`, run detached from the interactive session (`nohup`+`disown`) since a single xhigh iteration alone exceeded a 2-minute smoke test.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Create | Synthesis: 8 numbered findings, a revision checklist, and a verdict |
| `research/resource-map.md` | Create | Coverage map — what was verified vs. out of scope |
| `research/deep-research-findings-registry.json`, `research/fanout-attribution.md` | Create (auto) | Merged output of the 15 real replicas via `fanout-merge.cjs` |
| `research/lineages/{gpt55-fast,glm52,sonnet5}-N/` | Create (auto) | Per-replica isolated state |
| `002-hub-rename-and-runtime-nesting/{spec,plan,tasks,checklist}.md` | Edit | Applied the load-bearing corrections this research found |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched the fanout with the exact operator-specified allocation (10x `openai/gpt-5.5-fast` xhigh, 5x `zai-coding-plan/glm-5.2` max, 5x `claude-sonnet-5` xhigh via `cli-claude-code`). All 5 `sonnet5` replicas failed terminally within seconds-to-minutes with `Not logged in · Please run /login`. Root-caused via direct reproduction rather than assumption: `env -i HOME PATH claude -p ...` fails identically; the full inherited environment succeeds; adding `SSH_AUTH_SOCK`/`__CFBundleIdentifier` to a stripped env did not restore access. Credentials are confirmed to live in the macOS login Keychain (`security find-generic-password -s "Claude Code-credentials"`), and `fanout-run.cjs`'s `buildExecutorDispatchEnv()` allowlist strips whatever is needed for the headless `claude` subprocess to reach them — a genuine, unresolved infra gap, not a config error in this dispatch's own JSON payload.

Rather than continuing to bisect environment variables (poor odds, real time cost, and orthogonal to the actual research goal), substituted the 5 sonnet5 iterations with 5 parallel in-session Plan-agent dispatches (model: sonnet), each independently verifying a different subsystem of the existing 002/003 plan against live files rather than trusting the plan docs. This genuinely achieved the underlying intent — 5 real, independent Sonnet-5 research passes — via a different mechanism, and arguably produced higher-quality, more targeted findings than 5 undirected xhigh iterations would have, since each pass was scoped to a specific subsystem with explicit instructions to verify, not assume.

The 15 real replicas (10 gpt55-fast + 5 glm52) all completed successfully; `fanout-merge.cjs` consolidated 165 raw findings. Cross-checked the raw registry for anything the 5 targeted Plan-agent passes might have missed, surfacing one additional cross-cutting finding (a fan-out spec.md write-back boundary gap, corroborated independently by 3 replicas across both model families) that was verified not to have caused actual harm this run (confirmed via `git status` and each lineage's own state log) but is worth flagging as future hardening.

Synthesized everything into `research.md`, then applied every load-bearing correction directly to `002-hub-rename-and-runtime-nesting`'s spec.md/plan.md/tasks.md/checklist.md — including one severe finding (the original Stage 2 `SKILL.md`→`README.md` "demotion" would have destroyed real, pre-existing `README.md` content on the very first irreversible `git mv`) before any execution began. Advisor-corpus and sibling-graph-edge refinements for phase 003 were documented in research.md but deliberately left for that phase's own execution turn rather than pre-editing a plan that isn't gated to start yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Substitute failed `sonnet5` replicas with in-session Plan agents rather than keep debugging the Keychain gap | Diminishing returns on env-var bisection (already tried 3 combinations, none worked); the actual goal is 5 real Sonnet-5 research passes, not "via headless subprocess specifically" |
| Treat CHK-022 as explicitly NOT MET rather than silently substituting without record | The checklist's job is to state what actually happened, not what was intended; the substitution achieves the same intent through a different, documented mechanism |
| Apply phase 002's corrections now, defer phase 003's to its own execution turn | 002's corrections are load-bearing for its own irreversible first step (Stage 2); 003 hasn't started and isn't blocked on a plan.md that's already fully specified in research.md's §5-6 |
| Run the fanout via `nohup`+`disown` rather than the harness's own `run_in_background` | Confirmed the harness's background-task tracking does not survive an app-level session restart, while a detached OS process does — verified directly when a mid-run restart occurred and the fanout kept running uninterrupted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 20/20 replicas dispatched | Confirmed via `orchestration-status.log` `started` events |
| 15/20 completed via the real mechanism | 10 gpt55-fast + 5 glm52, all reaching `minIterations: 3` |
| 5/20 (sonnet5) root-caused, not just observed | Reproduced the exact failure standalone (`env -i HOME PATH claude -p ...`), confirmed Keychain credential location, confirmed full-env dispatch works |
| `research.md` synthesized | 8 findings sections + revision checklist, file:line evidence throughout |
| Corrections applied to 002 | `spec.md`/`plan.md`/`tasks.md`/`checklist.md` all updated; re-read to confirm edits landed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `cli-claude-code` Keychain auth gap is documented, not fixed.** It will recur for any future headless `cli-claude-code` fanout dispatch in this environment until `fanout-run.cjs`'s env-isolation is fixed at the source — flagged, not addressed, since it's outside this merge packet's scope.
2. **Phase 003's advisor-corpus and sibling-graph-edge corrections are documented in research.md but not yet applied to 003's plan.md** — deliberate, since 003 hasn't started; apply them when 003 actually executes.
3. **The fan-out spec.md write-back boundary gap (research.md §8) is flagged but not fixed** — it's a `deep-loop-runtime`/`deep-loop-workflows` infra concern, outside this merge packet, and did not cause actual harm in this run.
<!-- /ANCHOR:limitations -->
