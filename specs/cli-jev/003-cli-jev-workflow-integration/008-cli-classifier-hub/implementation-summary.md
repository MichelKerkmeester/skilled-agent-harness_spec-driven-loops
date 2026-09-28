---
title: "Implementation Summary: cli-classifier Hub with the cli-deem Client (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe a new cli-classifier hub (proposed) whose first mode, cli-deem (proposed), is a Node standard-library client for the local Deem server, and no code or result exists."
trigger_phrases:
  - "cli-classifier hub summary"
  - "cli-deem status"
  - "cli-deem planned"
  - "deem client results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub"
    last_updated_at: "2026-09-28T10:00:00Z"
    last_updated_by: "spec-pass-leaf"
    recent_action: "Amended the planning documents for parent D5 and D6"
    next_safe_action: "Reopen the Deem seams, then write cli-deem.mjs and its fake-server tests"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How does a hook caller select the 500 ms health budget"
      - "Does the new hub need compiled-route admission for stage 2"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: cli-classifier Hub with the cli-deem Client (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cli-classifier-hub |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no code, hub file or measurement exists for it.

### Phase 8: cli-classifier-hub

The plan mints `.skilled/skills/cli-classifier/` (proposed) with one transport mode, `cli-deem` (proposed). Its script, `cli-deem.mjs` (proposed), takes `jev`-like flags, posts Deem's own request shape to the local server at `127.0.0.1:8300` and prints `jev-cli`'s answer shape, so an arm written for `jev` output reads Deem output unchanged. `cli-deem health` refuses the stub backend and any model other than `deem-0.8-v1`, then prints the commit pair every Deem record must carry. The packet documents `deem-ctl` for start, status, update and rollback, and never reimplements it. `cli-jev` stays in place until phase 009. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-27 from `../007-classifier-deep-research/research/research.md`: section 14's record for this phase, section 12's R23 record and shared two-backend gate contract, and section 3's wire table, Deem check and lifecycle. The parent goal's D2 requires the hub and `cli-deem`. The goal log lists every point where this phase reads past the synthesis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A Node client, not the `jev --provider custom` wrapper or a translator | The wrapper cannot serve `choice` or `score` and needs a key the dispatch guard refuses. A translator forks a pinned package or adds a second daemon for four field renames (What Not To Build rows 75 and 76) |
| Answers in `jev-cli`'s shape | Every Planned arm already parses `jev` output, so one reader serves both backends |
| `health` pins the model and refuses the stub | The stub answers `status` `ok` with a `noul` of 0.5 for everything, and a server launched without `DEEM_MODEL_ID` reports `deem-1.5` |
| The client never touches the lifecycle | `deem-ctl` already proves an update with one real decision and holds a rejected release on rollback. A second copy would drift |
| The hub has no switch | It is a transport. Each caller keeps its own `--deem` switch (proposed), as the shared gate contract says |
| `cli-jev` moves in 009, not here | The move touches 81 files under the hub and 48 that name it, and it waits on a pre-fixed Deem `keep` in 002 or 017 (D4 of the parent goal) |
| CLI executors build from single-change briefs | D5 of the parent goal: a fresh Opus 5.5 xhigh build orchestrator briefs Devin, Pi on Cline and Cursor by Bash, and the orchestrator session verifies, gets a cross-family review and commits |
| Docs through sk-doc, code through `sk-code-opencode` | D6 of the parent goal. The hub gains a feature catalog in `cli-deem/`, where `cli-jev` keeps its transport's catalog |
| The generated Hermes copies and, after any compiled-route admission, the activation manifests are in scope | The repository's own generators write them for a new hub, so a scope check that left them out would fail on a correct build |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and smoke | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder after the authoring pass. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No Deem accuracy exists.** The client carries judgments and measures none. Deem's accuracy on this repository's labels stays UNKNOWN until R21's Deem half and R1's Deem column run.
2. **The server is open to local pages.** It sends `Access-Control-Allow-Origin: *` with no authentication, which exposes compute, not data. Closing it is the operator's call (question 44).
3. **One request at a time.** The server holds one lock around inference, so an offline batch delays any other call. Each caller sets its own timeout and skips when it expires.
<!-- /ANCHOR:limitations -->

---
