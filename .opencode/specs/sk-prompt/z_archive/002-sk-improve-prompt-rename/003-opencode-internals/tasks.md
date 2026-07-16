---
title: "Tasks: Phase 003 OpenCode Internals"
description: "Task list and verification evidence for rotating Phase 003 .opencode internals from sk-improve-prompt to sk-prompt."
trigger_phrases:
  - "082 phase 003 tasks"
  - "opencode internals rename tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/003-opencode-internals"
    last_updated_at: "2026-05-06T11:12:38Z"
    last_updated_by: "codex"
    recent_action: "Phase 003 source refs rotated; rebuild blocker documented"
    next_safe_action: "Resolve advisor metadata mismatch or proceed to Phase 004 with rebuild caveat"
    blockers:
      - ".opencode/skills/deep-agent-improvement/graph-metadata.json has skill_id sk-improve-agent while folder is deep-agent-improvement; advisor_rebuild aborts before indexing"
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-06-082-003"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Should Phase 003 also fix the deep-agent-improvement graph metadata skill_id mismatch, or should that remain with the agent rename packet?"
    answered_questions: []
---
# Tasks: Phase 003 OpenCode Internals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read parent spec, resource map, Phase 003 spec, and Phase 001 inventory. Evidence: `sed`/`rg` reads confirmed Phase 003 path ledger and counts.
- [x] T002 Confirm branch constraint. Evidence: `git branch --show-current` returned `main`.
- [x] T003 Read target reference shapes before editing. Evidence: `rg -n 'sk-improve-prompt|\\.opencode/skills/sk-improve-prompt/'` over the Phase 003 targets showed markdown, Python, TypeScript, JSON, shell, and JSONL literal refs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update dispatcher and OpenCode agent body refs. Evidence: `.opencode/agents/improve-prompt.md`, `.opencode/commands/prompt.md`, and `.opencode/commands/README.txt` now use `sk-prompt` for the prompt skill.
- [x] T005 Update advisor scoring code and fixtures. Evidence: `skill_advisor.py`, `explicit.ts`, `lexical.ts`, `fusion.ts`, advisor `graph-metadata.json`, sync script, labeled prompts JSONL, and regression JSONL have zero Phase 003-owned old-name hits.
- [x] T006 Update cli-* prompt quality mirrors in existing Phase 003 scope. Evidence: cli-claude-code, cli-codex, cli-gemini, and cli-opencode mirror refs now use `sk-prompt`; cli-copilot files are absent/deleted in the working tree, so no content update was possible.
- [x] T007 Update cross-skill refs. Evidence: `deep-agent-improvement` peer reference and sk-code advisor docs now use `sk-prompt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run Phase 003-owned grep. Evidence: explicit `rg -n 'sk-improve-prompt' <Phase 003 file list>` returned zero hits.
- [x] T009 Run broad scoped grep and classify residuals. Evidence: `rg -n 'sk-improve-prompt' .opencode/ --glob '!**/specs/**' --glob '!**/sk-prompt/**'` returns only Phase 005 files: install guides, active changelog, skill README, system-spec-kit changelog, and observability outputs.
- [x] T010 Validate JSON and JSONL syntax. Evidence: `jq .` passed for both touched JSON files; every line passed `jq .` for both touched JSONL files.
- [x] T011 Validate Python syntax. Evidence: `PYTHONPYCACHEPREFIX=/tmp/codex-pycache python3 -m py_compile .../skill_advisor.py` passed.
- [x] T012 Verify prompt-card mirror sync. Evidence: `check-prompt-quality-card-sync.sh` printed matching hashes and `SYNC OK`.
- [x] T013 Run advisor rebuild attempt. Evidence: MCP rebuild was cancelled by the tool layer; direct compiled handler failed before indexing because `deep-agent-improvement/graph-metadata.json` has `skill_id "sk-improve-agent"` while its folder is `deep-agent-improvement`.
- [x] T014 Run advisor probe sanity check. Evidence: `python3 .../skill_advisor.py "improve my prompt" --threshold 0.0 | head -5` returned top-1 `sk-prompt` with confidence `0.82`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 003-owned references are rotated from `sk-improve-prompt` to `sk-prompt`.
- [x] JSON, JSONL, Python syntax, and prompt-card sync checks passed.
- [x] Advisor probe top-1 is `sk-prompt`.
- [x] Remaining blockers are documented with exact evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
