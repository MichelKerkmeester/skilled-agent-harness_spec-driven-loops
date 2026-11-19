---
title: "Implementation Summary"
description: "No advisor prompt waits on Ollama any more, and an advisor server now exits when its launcher dies or reaps itself through the launcher when it wedges. Every suite passes, and the labeled corpus routes the same with no embeddings."
trigger_phrases:
  - "ollama lane off and daemon liveness implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/018-ollama-lane-off-and-daemon-liveness"
    last_updated_at: "2026-11-19T14:42:56Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-ollama-lane-off-and-daemon-liveness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-ollama-lane-off-and-daemon-liveness |
| **Completed** | 2026-11-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An advisor prompt no longer calls Ollama: the semantic lane's default weight is 0, and a guard skips the embed at that weight. `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}'` turns it back on. An advisor server whose launcher is killed now exits within seconds, and a launcher reaps a server whose heartbeat stops.

### Phase 18: ollama-lane-off-and-daemon-liveness

You get the same routes with less waiting and fewer stray processes. The daemon resolves its embedder pointer to the one model it can use without probing four backends. A scan with no pointer no longer writes vectors that nothing reads. The launcher leaves the hf model server off unless `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1`. `advisor_status` names a lane switched off by configuration as `lane_weight_zero`, and a recommend call does not warn about it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/scorer/lane-registry.ts`, `runtime/lib/scorer/lanes/semantic-shadow.ts` | Modified | Weight 0 and the zero-weight guard |
| `runtime/handlers/advisor-status.ts`, `runtime/handlers/advisor-recommend.ts` | Modified | `lane_weight_zero` reason, no warning |
| `runtime/lib/embedders/schema.ts` | Modified | Pointer resolves to the one manifest, no cascade |
| `runtime/lib/skill-graph/skill-graph-db.ts` | Modified | Legacy embedding refresh and read removed |
| `runtime/lib/daemon/liveness.ts` | Created | Parent-pid watch and heartbeat writer |
| `runtime/advisor-server.ts` | Modified | Starts and stops both timers, corrected comment |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | hf spawner off by default, heartbeat watchdog |
| `runtime/database/.gitignore` | Modified | Ignores the runtime heartbeat file |
| 3 new and 11 changed test files, 3 recaptured fixtures | Created/Modified | Each change behind a test, pins re-baselined |
| 12 advisor docs, ENV-REFERENCE, `SKILL.md`, `changelog/v1.2.0.0.md`, the v4.1.0.0 release entry | Modified/Created | New weight and defaults, version 1.2.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna `xhigh` `fast` wrote every code, test and doc change as a leaf through cli-codex in worktree 479. The conductor recorded baselines on main first and ran each new test with the source change reverted before the fix. Each failed: guard 1 of 2, pointer 3 of 5, legacy 3 of 8, status 8 of 40, hf 5 of 13 and watchdog 7 of 7. Each passed with the fix. The conductor then recaptured the three baseline fixtures and ran every suite on the final tree. It also proved both liveness paths on a live worktree daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard plus weight 0, keeping the lane live | Weight 0 alone still embedded every prompt, because the wrapper never read the weight. Keeping it live leaves the env lever working |
| Heartbeat-file watchdog instead of a socket ping | Every IPC frame resets the 30-minute idle timer, so a ping would keep every daemon alive forever. The operator approved the swap |
| Parent check compares `process.ppid` with its start value | No new env key reaches the daemon, and pid reuse cannot fool it |
| Shared cascade left alone | An sk-doc validator and spec-kit suites read it |
| Shadow weight stays 0.05 | Shadow scoring is telemetry; moving it re-baselines fixtures for no routing change |
| One new module, `lib/daemon/liveness.ts` | Its timers take injected clocks and writes, so a test drives them without starting the daemon |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime suite | Baseline 2533 passed, 8 skipped. Final 2537 passed, 8 skipped, 192 of 192 files |
| Python suite | Baseline 122. Final 122 passed, 0 failed. One earlier run printed 121 and 1 failed and did not repeat in two reruns |
| Bin suite | Baseline 79. Final 86, the 7 new watchdog tests |
| Spec-kit launcher and embedder suites | 202 passed, 2 skipped, before and after |
| DSH extension | 18 passed, before and after |
| Build | `npm run build` exit 0 |
| REQ-005, none-gold fires | 5 at weight 0.05 and 5 at 0, in both the CI stand-in and the no-embedding regime |
| Labeled corpus, no embeddings | 159 of 196 at weight 0.05, 0 and the new default; no row changes |
| Labeled corpus, CI stand-in | 161 falls to 159. `rr-iter3-070` moves sk-code to system-spec-kit and `rr-iter3-114` moves command-speckit-save to system-spec-kit. Both gains came from the token-overlap stand-in that production never had |
| Recaptured fixtures | Eval baseline 161 to 159. One ledger entry, `harder:ce0726a9d0f5`, native sk-doc to sk-code, with its reason rewritten. One must-not-start command row, `mns-d3-04`, unscored top sk-git to sk-code, still not offered. The same ledger capture on main today shows no change, so the date is not the cause |
| Shared cascade | `git diff --stat -- .skilled/skills/system-spec-kit/shared` prints nothing |
| Live parent-death check | SIGKILL of worktree launcher 53046: server 53060 exited after 6 s and removed its heartbeat file |
| Live watchdog | SIGSTOP of worktree server 97969 at 17:04:03: the launcher reaped it after 245 s and then exited. The bound is 180 s stale, plus at most one 60 s check, plus the 5 s kill grace |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The lane is off, not fixed.** Turning it back on needs the re-enable checklist in `plan.md`: full coverage, outage as degraded, `OLLAMA_*` forwarding and a fresh ablation.
2. **The watchdog only arms after a heartbeat newer than the spawn.** A server that never writes one, for example one that wedges during its startup scan, is not reaped by the watchdog. The parent check still covers a dead launcher.
3. **The launcher and the server resolve the database directory separately.** If they ever disagree, the watchdog never arms, which fails safe.
<!-- /ANCHOR:limitations -->

---
