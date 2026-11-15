---
title: "Implementation Summary"
description: "The cli-external-orchestration hub now routes a request to delegate to Mistral Vibe to the cli-mistral-vibe mode at both routing stages, and the compiled router serves a fresh manifest."
trigger_phrases:
  - "hub registration and routing implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/010-hub-registration-and-routing"
    last_updated_at: "2026-11-14T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Registered cli-mistral-vibe as the eighth hub mode"
    next_safe_action: "Phase 011 adds the goal bridge and dist-freshness hooks"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/mode-registry.json"
      - ".skilled/skills/cli-external-orchestration/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 006 ships sync-agents-vibe.cjs --check"
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
| **Spec Folder** | 010-hub-registration-and-routing |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt like "delegate to vibe" now reaches the `cli-mistral-vibe` mode. Stage one picks the hub, and stage two picks the mode. A prompt that names cli-opencode with a Mistral model stays on cli-opencode, and a design prompt that uses the word "vibe" routes nowhere near the mode.

### Phase 10: hub-registration-and-routing

The mode is the hub's eighth. Its aliases are `mistral vibe`, `vibe -p` and `delegate to vibe`, with no bare `vibe`, and it sits last in the tie-break order. The compiled routing artifacts were rebuilt and the authored activation manifest was pinned to the new policy hash, so the router serves compiled routing again instead of falling back to legacy on a stale manifest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Modified | The eighth mode, its router signals, tie-break place and stage-one vocabulary |
| `.skilled/skills/cli-external-orchestration/SKILL.md`, `README.md`, `description.json`, `leaf-manifest.json`, `changelog/` | Modified | Mode row, count of eight, regenerated leaf manifest and hub v2.1.0.0 |
| `.skilled/skills/cli-external-orchestration/{cli-opencode,cli-pi,cli-deepseek-harness}/changelog/` | Created | Entries for the version bumps phases 002 and 003 made, which the per-hub gate requires |
| `.skilled/bin/lib/compiled-routing/` and the authored archive tree | Modified | Packet source entry, three canaries, rebuilt artifacts and the activation manifest pinned to `3bc7c5fe...` |
| `.skilled/skills/system-skill-advisor/runtime/` | Modified | Card-sync list, skill graph, executor-delegation cases and scorer assertions |
| `.skilled/skills/sk-prompt/`, `.skilled/agents/orchestrate.md`, `prompt-improver.md` and their mirrors | Modified | Model, card and executor table rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

OpenCode dispatches on `mistral/deepseek-v4-1-flash-1017#max` made the registration, advisor and table edits, each worker on its own files. The orchestrator rebuilt the compiled artifacts, pinned the manifest, ran the sync and its finalize step, and replayed both stages itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No bare `vibe` alias | "vibe" is common in design prompts; the landing-page canary proves the narrower aliases stay out of them |
| Pin only the authored activation manifest | The precedent remint changed only the two `manifest.json` files; the sync copies the authored one into the runtime tree |
| Add the three missing packet changelog entries here | The per-hub gate is this phase's exit check, and the bumps that broke it came from this packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stage two replays | PASS: `cli-mistral-vibe`, `cli-opencode`, and `defer` for the landing-page prompt (`scratch/replays.txt`) |
| Stage one replay | PASS: hub at 0.95, `passes_threshold: true`; landing-page prompt returns `[]` |
| Compiled routing | PASS: sync and finalize exit 0; manifest tests 48/48; status `"fresh":true` |
| Per-hub gate | PASS: exit 0, 8 modes, 0 failures |
| Advisor suites | PASS: card-sync exit 0; executor-delegation 42/42 (baseline 38); scorer 367 passed, 0 failed (baseline 1 failed) |
| Mirrors | PASS: agent mirror sync OK; three `.vibe` `--check` commands exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scorer baseline failure.** The one scorer test that failed before this phase now passes, and the cause of that change was not traced.
2. **Advisor graph.** The mode is `routingClass: "metadata"`, so stage one scores the hub, never the mode; stage two alone decides the mode.
<!-- /ANCHOR:limitations -->
