---
title: "Implementation Summary"
description: "A fresh Fable 5.2 high read confirms 6 of 10 epic claims and finds 4 true only in part, including that Pi stores no route receipt. It names 1 P1, a heartbeat watchdog that can kill a healthy daemon after sleep, and 10 P2s."
trigger_phrases:
  - "epic verification implementation summary"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/021-epic-verification"
    last_updated_at: "2026-11-20T14:59:24Z"
    last_updated_by: "generate-context"
    recent_action: "Saved the Fable 5.2 high verification report and confirmed its four partial verdicts and the P1"
    next_safe_action: "Run a fix phase for the P1 watchdog and chosen P2s if the operator approves"
    packet_purpose: "Purpose: One independent report says which claims hold, which hold only in part and which do not, with sources, and names any defect the earlier checks missed."
    blockers: []
    key_files:
      - "evidence/report.md"
      - "implementation-summary.md"
      - "scratch/prompt.md"
    session_dedup:
      fingerprint: "sha256:7f600e7f8509875481b33fa67a3d5eebefd75e2b71526c4890fb8f7dc6b376ff"
      session_id: "scaffold-021-epic-verification"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-20T14:59:24Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-epic-verification |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The epic's main claims mostly hold. Six of ten are CONFIRMED and four are PARTIAL, and none is REFUTED. The review found no P0. It found one P1: the launcher's heartbeat watchdog can kill a healthy daemon after the machine sleeps. Nothing in the advisor changed.

### Phase 21: epic-verification

`evidence/report.md` gives each claim a verdict with file:line, then 11 ranked defects and an answer on the Ollama cost.

The four PARTIAL verdicts:
1. O3: the exact rerank path `scoreSemanticShadowExactSubset` has no coverage gate, and inside the daemon the coverage read uses the daemon's own read-write handle, which is the designed behavior.
2. O5: the legacy `skill_nodes.embedding` column is no longer written but is still read by `advisor_status` and the projection summary.
3. O6: the parent watch is armed only after startup work, so a launcher that dies during startup leaves an orphan until the idle timeout.
4. S4: Pi stores no route receipt because it sends no session id. Phase 011 recorded this gap, so the code matches its plan and the epic summary overstated it.

Ollama cost: at weight 0 no prompt is embedded, but the background refresh still fills every vector, and only the `advisor_status` count reads them. The report calls the cost small and off the prompt path, and suggests skipping the refresh at weight 0 if nobody plans to raise the weight.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `evidence/report.md` | Created | The verification report, 30 file:line sources |
| `scratch/prompt.md` | Created | The dispatch brief |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Created | This phase's docs |
| `../spec.md`, `../goal.md` | Modified | Phase map rows 20 and 21, D1 order and the 021 binding row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor recorded the baseline, then ran one dispatch: `claude2 -p --model claude-fable-5-2 --effort high --permission-mode plan --agent review`, with `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0` and the child preamble. It exited 0 with an empty stderr and a 15,130-byte report. The conductor read the cited lines for every PARTIAL verdict and for the P1 before saving the report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dispatch through `claude2` although cli-claude-code tells a Claude Code session to run the work natively | The operator named `claude2`, a second account. A native subagent would run on this account and share this session's context |
| A claim list rather than an open read | The epic's summaries make specific claims, and a verdict per claim says which ones hold |
| Report only | The phase's D2: fixes are a separate operator decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Dispatch | Exit 0, stderr 0 bytes, report 15,130 bytes |
| SC-001 | `rg -c '^- \*\*[OS][1-6] ' evidence/report.md` prints 10; `rg -c 'ts:[0-9]+\|cjs:[0-9]+\|py:[0-9]+'` prints 30 |
| SC-002 | `git status --short` after the dispatch shows no new change outside this phase and the parent's `spec.md`, `goal.md` and `graph-metadata.json`, all written by the conductor |
| O3 PARTIAL | Confirmed: `semantic-shadow.ts:253-262` checks only projection staleness, and `embeddingCoverage` is called only at 399; `getDbReadOnly` returns `db` first at `skill-graph-db.ts:580` |
| O5 PARTIAL | Confirmed: `advisor-status.ts:193` counts `skill_nodes.embedding` when no vector table exists, and `projection.ts:1574-1585` reads `embedding_model_id` from `skill_nodes` |
| O6 PARTIAL | Confirmed: `advisor-server.ts` awaits `startupSkillGraphScan`, the watch factory and the daemon start before `startParentWatch` at 432, and `liveness.ts:67` captures the parent pid when called |
| S4 PARTIAL | Confirmed: `hooks/pi/prompt-advisor.ts:289-298` passes no `session_id`, `receiptSessionId` returns null without one (`user-prompt-submit.ts:339-346`), and `011-route-receipts-build/implementation-summary.md:103` records Pi as out |
| P1 watchdog after sleep | Confirmed by reading, not reproduced: `heartbeatVerdict` compares `nowMs - mtimeMs` against a 180 s limit from one read, with no check on the watchdog's own tick gap (launcher 1571-1630, 60 s check, 15 s heartbeat at `liveness.ts:16`) |
| P2-7 queued request on throw | Confirmed: the `finally` at `skill-graph-db.ts:1464-1469` clears `backgroundEmbeddingRefreshRequested` when a pass throws |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live run.** No suite ran and Ollama was not started, so every verdict rests on reading code. The P1 was not reproduced on a sleeping machine, and its one-in-eight frequency is the reviewer's estimate.
2. **P2s mostly unchecked.** The conductor checked P2-7 and the lines behind P2-3; the other P2s rest on the report alone.
<!-- /ANCHOR:limitations -->

---
