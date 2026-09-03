---
title: "Implementation Summary: Phase 1: research and contracts"
description: "Verified the activation gate, entrypoint, providers, rubric, cli roster, authoring standard, mirror model, and dispatch contract; recorded in research/research.md."
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/001-research-contracts"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded verified contracts"
    next_safe_action: "Author the commands from the contracts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-contracts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 1: research and contracts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 1 of 10 |
| **Completed** | 2026-08-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A verified, file-anchored research and contracts record at `research/research.md`. It establishes:

- **Activation**: projection is OFF by default; `isProjectionEnabled()` gates it on `COMMUNICATION_PROJECTION_ENABLED` (truthy `1|true|on`) or a git-ignored `enablement.local.json` (`src/config/enablement.ts`).
- **Runnable entrypoint**: `cli-output-wrapper` (`bin/cli-output-wrapper.mjs`), shape `cli-output-wrapper <runtime> [-- <command...>]`, needs a built `dist/`.
- **Providers**: local (ollama, llama.cpp) and hosted (OpenCode Go DeepSeek V4 Flash); no cli-* provider exists.
- **Rubric**: `COPY_EDITING_INSTRUCTION` in `src/config/local-provider.ts`, scope `assistant-message-only`, protected-spans/1.0.0.
- **cli roster**: six skills — cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-opencode, cli-pi.
- **Authoring standard**: sk-create-command; canonical location `.opencode/commands/`.
- **Mirror model**: `.claude` and `.cursor` use symlinks; `.codex/prompts/` uses generated stubs.
- **Dispatch**: cli-devin `gemini-3-7-flash-high` (fallback `glm-5-2`); personas travel in the prompt.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator read the shipped package and skill, the sk-create-command standard, and the cli-devin dispatch contract directly, ran the devin pre-flight, and recorded the findings with file:line anchors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Command 1 needs no package dependency: its rubric is distilled from `COPY_EDITING_INSTRUCTION` and embedded in the command.
- Command 2's "external AI via a cli-* skill" is a design fork, because no cli-* provider exists in the package today.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `isProjectionEnabled()` and `PROJECTION_ENABLE_ENV` read from `src/config/enablement.ts`.
- `cli-output-wrapper` bin read from `package.json` and `bin/cli-output-wrapper.mjs`.
- `gemini-3-7-flash-high` confirmed in the runtime model allowlist; `devin auth status` reported logged in.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Facts reflect the package state at authoring time and should be re-verified if the package changes.
<!-- /ANCHOR:limitations -->
