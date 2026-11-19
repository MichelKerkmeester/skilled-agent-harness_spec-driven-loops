---
title: "Implementation Summary"
description: "A fresh Fable 5.2 read finds the advisor's Ollama lane live at weight 0.05 but measured net-negative, its vectors stale and partial, and its daemons with no parent-death check. The top recommendation is to drop the lane from the prompt path."
trigger_phrases:
  - "ollama advisor analysis implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/017-ollama-advisor-analysis"
    last_updated_at: "2026-11-19T12:56:49Z"
    last_updated_by: "generate-context"
    recent_action: "Saved evidence/report.md and confirmed its ranked findings 1 to 4 against the code"
    next_safe_action: "Decide which ranked changes to build in a fix phase"
    packet_purpose: "Purpose: One report says, with sources, what to fix, simplify or drop in the advisor's Ollama path, and how to cut its load and stop daemons from piling up."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts"
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:090cb33819afacf0d4ddb10841655b825bfb53a9dcdb7b2fbc9810b4e492f04c"
      session_id: "scaffold-017-ollama-advisor-analysis"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-19T12:56:49Z"
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
| **Spec Folder** | 017-ollama-advisor-analysis |
| **Completed** | 2026-11-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor's Ollama-backed semantic lane is live at weight 0.05, and the one recorded measurement shows it costs a correct answer: 149 of 193 top-1 with the lane against 150 without. Today it is off by accident: no Ollama process runs, and 7 of 15 skills have no vector anyway. The report's first recommendation is to take the lane off the prompt path.

### Phase 17: ollama-advisor-analysis

`evidence/report.md` answers the five questions with file:line sources. It finds eight bug groups and five overengineered layers, gives load figures and names four daemon-reaping gaps. It ends with five ranked changes. Nothing in the advisor changed: whether to act on any of it is the operator's call, as for phases 015 and 016.

Ranked changes, as the report gives them:
1. Set the semantic lane weight to 0 in `lane-registry.ts`, renormalize and re-baseline.
2. Add a parent-death check to the server and a liveness ping to the launcher.
3. If the lane stays, refresh embeddings from the daemon and gate the lane on full coverage.
4. Add `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS` to the launcher allowlist, and add or delete the three flag-gated scorer paths.
5. Default the hf model-server spawner off and delete the provider cascade and the legacy embedding path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `evidence/report.md` | Created | The analysis, 153 lines, 28 file:line sources |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This phase's docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor recorded the baseline, then ran one dispatch: `claude2 -p --model claude-fable-5-2 --effort medium --permission-mode plan --agent review`, with `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0` and the child preamble. It exited 0 with an empty stderr and a 17,778-byte report. The conductor then read the cited lines for the ranked findings before saving the report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dispatch through `claude2` although cli-claude-code tells a Claude Code session to run the work natively | The operator named `claude2`, a second account. A native subagent would run on this account and share this session's context. The dispatch ran read-only with the child preamble |
| `--agent review` with plan mode | The skill requires a persona, and an audit read fits the review agent; plan mode keeps it from writing |
| Report only | The phase's D2: fixes are a separate operator decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Dispatch | Exit 0, stderr 0 bytes, report 17,778 bytes with sections 1-5, Ranked changes and Not checked |
| SC-001 | `rg -c 'ts:[0-9]+\|cjs:[0-9]+\|mjs:[0-9]+' evidence/report.md` prints 28 |
| SC-002 | `git status --short` after the dispatch shows changes only in this phase and its parent's docs, all written by the conductor |
| Ranked 1, lane weight | Confirmed: `lane-registry.ts` reads `{ id: 'semantic_shadow', defaultWeight: 0.05, defaultShadowWeight: 0.05, live: true }` |
| Ranked 1, recorded ablation | Confirmed: the archived `008-semantic-shadow-prove-or-freeze/implementation-summary.md:46,79` records the FREEZE at 0.05 and a net-negative full-corpus run |
| Ranked 2, parent-death check | Confirmed: `rg -n ppid` over `advisor-server.ts`, `lib/daemon` and `lib/ipc` prints nothing |
| Ranked 3, refresh callers | Confirmed: `refreshSkillEmbeddings(` has one caller, `handlers/skill-graph/scan.ts:54` |
| Ranked 4, Ollama env | Confirmed: `rg -c OLLAMA_` on the launcher prints nothing |
| Load, keep-alive | Confirmed: `rg keep_alive` under `system-spec-kit/shared/embeddings` prints nothing |
| Ranked 5 | Not checked by the conductor: the hf supervision and cascade claims rest on the report alone |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live measurement.** Ollama was down and the dispatch was read-only, so every latency and memory figure is the repository's recorded one. The report's "Not checked" list names the rest, including daemon cold-start time and whether 750 ms fits the hook budget.
2. **Unconfirmed claims.** The report marks B7 and two daemon gaps INFERRED, and the conductor did not check ranked change 5. Treat those as hypotheses until a fix phase confirms them.
<!-- /ANCHOR:limitations -->

---
