---
title: "Implementation Summary"
description: "Two research lineages ran ten iterations each and merged into one synthesis that names the mode cli-deepseek-harness, fixes its headless dispatch contract and ranks phases 002 to 014."
trigger_phrases:
  - "deep research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research"
    last_updated_at: "2026-11-06T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the completed two-lineage research run and its synthesis"
    next_safe_action: "Start phase 002 offline contract pin"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/phase-plan.md"
      - "research/findings-registry.json"
      - "research/orchestration-summary.json"
    session_dedup:
      fingerprint: "sha256:f6e2fc318715d24de4bdb04d35b870d6bb1dc4fc79e69264f44b6caf52c145c2"
      session_id: "spec-085-001-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which OpenCode Go endpoint authenticates for the harness?"
    answered_questions:
      - "Mode id is cli-deepseek-harness, binary dsh, repo folder .dsh/"
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
| **Spec Folder** | 001-deep-research |
| **Completed** | 2026-11-05 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have one evidence-cited answer to how DeepSeek Harness joins this repository as a runtime mode, and a ranked build order to get there. Two research lineages on different executors ran ten iterations each, and their 145 merged findings settle the mode id, the headless contract and the thirteen phases that follow.

### Phase 1: deep-research

The synthesis names the mode `cli-deepseek-harness`, binary `dsh`, folder `.dsh/`, and fixes the dispatch as `dsh --profile headless --patch <route> --patch <lineage> --json --permission-mode <preset> --approval-policy never -` with the prompt on stdin. It keeps a closed two-route roster, LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`, and it lists the questions only a keyed run can answer. The phase plan turns that into phases 002 to 014, each with files, risk, authoring mode, executor and acceptance criteria.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Merged synthesis with conflicts C1 to C12 settled against the source clone |
| `research/phase-plan.md` | Created | Ranked phases 002 to 014 and the parent goal |
| `research/findings-registry.json` | Created | 145 key findings, 11 resolved and 4 open questions |
| `research/orchestration-summary.json` | Created | Fan-out result, 2 of 2 lineages succeeded |
| `research/lineages/luna/**`, `research/lineages/deepseek/**` | Created | Ten iteration files per lineage plus state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`/deep:research` ran as a two-lineage fan-out from the angles in `research-angles.md`. Lineage `luna` ran on `cli-codex` `gpt-6-luna` at `xhigh` and lineage `deepseek` on `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` at `max`. The run stopped at `maxIterationsReached` after 20 iterations. The orchestrating session then merged the registries, checked each load-bearing conflict against the dsh source clone and wrote the synthesis. The state log records `synthesis_complete` at 2026-11-05T23:21:45Z and the config status is `complete`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mode id `cli-deepseek-harness`, not `cli-deepseek` or `cli-dsh` | `deepseek` already names a model family used on three modes, and `dsh` alone is opaque, so it stays an alias |
| Guards ship as a repo-local Cordis plugin, not the Claude hook bridge | The bridge is absent from the install and runs no hooks when its config fails to parse, which fails open |
| A credential-free contract pin comes before any build phase | Patch and stdin behavior are what would invalidate a builder, and they can be observed without a key |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Run summary `node -e` read | PASS: `"succeeded":2,"total":2,"failed":0` |
| Registry metrics | PASS: 20 iterations, 145 key findings, convergence 0.875 |
| Iteration files | PASS: 20 files across `lineages/luna/iterations` and `lineages/deepseek/iterations` |
| Plan coverage | PASS: `rg -c '^### 0' research/phase-plan.md` prints 13 |
| Key-shaped string scan of `research/` | PASS: no file matched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing ran against a provider.** No key was configured, so every behavior that needs a model turn stays `documented, unconfirmed`. Phase `013-dsh-live-contract-pin` answers those once the operator enters a key.
2. **One endpoint stays UNKNOWN.** The OpenCode Go base URL is either `/inference/go/openai/v1` or `/zen/go/v1`, and no source in the clone settles it.
<!-- /ANCHOR:limitations -->

---


