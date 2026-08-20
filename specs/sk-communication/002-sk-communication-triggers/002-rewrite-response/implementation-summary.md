---
title: "Implementation Summary: Phase 2: rewrite-response command"
description: "The /rewrite-response command shipped and verified: in-context self-rewrite, no LLM, display-only, mirrored across runtimes."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/002-rewrite-response"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Command 1 shipped and verified"
    next_safe_action: "Proceed to phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-rewrite-response"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 2: rewrite-response command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 2 of 5 |
| **Completed** | 2026-08-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/rewrite-response`, a root OpenCode slash command at `.opencode/commands/rewrite-response.md`. It instructs the active AI to re-render its own most recent reply into sk-communication plain English, entirely in-context.

- No local or external LLM, CLI dispatch, or provider; no `allowed-tools`.
- Display-only: no file writes, canonical transcript history unchanged.
- Preserves protected spans (code, paths, commands, URLs, numbers, identifiers, quoted values) byte-for-byte.
- Optional `--show-original` flag; structured `OK` / `NOOP` / `FAIL` status.
- Mirrored into `.claude/commands/rewrite-response.md` and `.cursor/commands/rewrite-response.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored by a cli-devin Gemini 3.7 Flash HIGH agent under the markdown persona, following the sk-create-command template. The self-contained rubric was distilled from the package constant `COPY_EDITING_INSTRUCTION` and the sk-communication plain-English standard. The orchestrator verified the result independently and created the runtime mirrors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Command 1 is engine-independent and applies the rubric in-context; it never calls a model. This keeps it distinct from command 2 and free of the projection package.
- Default output is the rewrite only, briefly labeled; `--show-original` shows the original above it.
- `.codex/prompts/` uses generated stubs, not symlinks, so that mirror is deferred to the integration phase.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `check_authored_name_kebab.py .opencode/commands/rewrite-response.md` → exit 0: `PASS: authored artifact name is kebab-case`.
- `validate_document.py .opencode/commands/rewrite-response.md --type command` → exit 0: `VALID`, Document type: command, Total issues: 0. Re-run independently by the orchestrator.
- `.claude` and `.cursor` symlink mirrors both resolve to the canonical file.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The `.codex/prompts/` mirror is not yet created (different stub mechanism), tracked for the integration phase.
- The command relies on the active AI to honor the rubric; it has no runtime enforcement, which is inherent to an in-context prompt command.
<!-- /ANCHOR:limitations -->
