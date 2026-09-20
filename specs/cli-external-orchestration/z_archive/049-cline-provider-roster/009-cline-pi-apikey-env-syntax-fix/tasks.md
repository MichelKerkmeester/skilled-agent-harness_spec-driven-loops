---
title: "Tasks: Fix the cline-pass apiKey placeholder so dispatched pi sessions authenticate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline apiKey syntax tasks"
  - "pi env placeholder tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/009-cline-pi-apikey-env-syntax-fix"
    last_updated_at: "2026-08-25T05:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase; operator commits and pushes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix the cline-pass apiKey placeholder so dispatched pi sessions authenticate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce both reported symptoms against a disposable `PI_CODING_AGENT_DIR`: `401 Unauthorized` with the provider block present, and `No models available. Use /login...` from `pi --list-models` without it
- [x] T002 Read pi's supported config-value syntax from its own `docs/custom-provider.md` (`$VAR`, `${VAR}`, `!command`, `$$`, `$!` — no `{env:...}`)
- [x] T003 Confirm `CLINE_API_KEY` was absent from every shell and startup file, so the documented environment route had never run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the cline-pass `apiKey` with `${CLINE_API_KEY}` (`.pi/models.json`)
- [x] T005 Export `CLINE_API_KEY` from `~/.zshenv` and restrict that file to mode 600
- [x] T006 Correct the credential section and the verify expectations (`.pi/custom-providers.md`)
- [x] T007 Add the credential gotcha to the cline-pass section (`.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Negative control: isolated agent directory, empty auth store, key exported, `{env:CLINE_API_KEY}` returns 401
- [x] T009 Positive control: identical conditions with `${CLINE_API_KEY}` returns the requested token
- [x] T010 End-to-end: production `.pi/models.json` plus an empty auth store, dispatched through a fresh non-interactive zsh, returns the requested token
- [x] T011 `.pi/models.json` parses; `pi --list-models` still lists all three cline-pass rows
- [x] T012 `validate.sh --strict` exit 0; probe directories removed and the working tree carries only the intended changes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Environment-only authentication proven against an empty auth store
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
