---
title: "Implementation Summary — Phase 2 — Headless notesmd-cli scenarios"
description: "Recorded results for Phase 2 — Headless notesmd-cli scenarios of the mcp-obsidian playbook validation run."
trigger_phrases:
  - "002-headless-cli-scenarios results"
  - "playbook validation results"
  - "mcp-obsidian scenario results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation/002-headless-cli-scenarios"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran the 8 headless scenarios via cli-pi deepseek: 7/8 PASS"
    next_safe_action: "Reconcile the 010 packet formal completion once the spec-memory backend accepts a save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation-002-headless-cli-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary — Phase 2 — Headless notesmd-cli scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-headless-cli-scenarios |
| **Completed** | 2026-08-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Executor: deepseek-v4-flash via cli-pi. **7/8 PASS.**

| Scenario | Result |
|---|---|
| vault-preflight, vault-registration | PASS, PASS |
| create-and-read, daily-note, move-note, delete-note, frontmatter | all PASS |
| search-notes | **FAIL** |

Finding: notesmd-cli v0.3.6 `search` (title search) is broken headlessly — no positional/query flag exists and every form returns "Cannot find note in vault" even for on-disk notes; `search-content` (body search) works. The mode's search-notes scenario + SKILL.md command reference should switch to `search-content` or document the limitation.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Scenarios ran against a live throwaway environment (a real vault used with `_pbtest-` throwaway artifacts, cleaned up after each run) by deepseek-v4-flash dispatched through the CLI named per phase. Every verdict is grounded in real command output or HTTP responses.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:verification -->
## Verification

The results table above is the verification record; each row cites the exact call and the observed-vs-expected outcome.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Formal packet completion (completion_pct + content fingerprint) is pending: the spec-memory backend currently times out on save, so this record is captured but not yet memory-saved.
<!-- /ANCHOR:limitations -->
