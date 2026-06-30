---
title: "Implementation Summary: Phase 003 OpenCode Internals"
description: "Phase 003 rotated active .opencode internals from sk-improve-prompt to sk-prompt and records verification evidence plus rebuild blockers."
trigger_phrases:
  - "082 phase 003 implementation summary"
  - "opencode internals rename summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename/003-opencode-internals"
    last_updated_at: "2026-05-06T11:12:38Z"
    last_updated_by: "codex"
    recent_action: "Phase 003 refs rotated; rebuild blocked"
    next_safe_action: "Resolve rebuild blocker"
    blockers:
      - "advisor_rebuild failed because .opencode/skills/deep-agent-improvement/graph-metadata.json has skill_id sk-improve-agent while the folder is deep-agent-improvement"
      - "The requested broad .opencode grep still finds Phase 005-only files, which this phase was instructed not to touch"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-06-082-003"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Should the deep-agent-improvement skill_id/folder mismatch be fixed in this packet before rerunning advisor_rebuild?"
    answered_questions: []
---
# Implementation Summary: Phase 003 OpenCode Internals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `003-opencode-internals` |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
| **Status** | Source refs updated; rebuild blocked by existing metadata mismatch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 003 rotated the existing `.opencode/` internals that belong to this phase from `sk-improve-prompt` to `sk-prompt`. The command and agent names stayed unchanged, while their body references, advisor scoring literals, fixtures, mirror-card paths, and cross-skill docs now point at the renamed prompt skill.

### Reference Rotation

Updated 25 existing Phase 003 source files and removed 93 old-name references from those files. The requested cli-copilot files are currently absent/deleted in the working tree, so they could not be edited; no cli-copilot old-name hits remain in the filesystem.

### Files Changed

| Area | Files Modified | Ref Count Before | Ref Count After |
|------|----------------|------------------|-----------------|
| Dispatcher + agent bodies | 3 | 21 | 0 |
| Advisor scorer, metadata, sync, fixtures | 8 | 56 | 0 |
| cli-* mirrors and playbooks | 9 existing files | 10 | 0 |
| Cross-skill refs | 5 | 6 | 0 |
| Phase docs | 3 | n/a | n/a |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was a scoped literal rotation after reading the reference shapes. I used a mechanical replacement only across the Phase 003 file list, then verified JSON/JSONL validity, Python syntax, prompt-card sync, Phase 003-owned grep, broad residual grep, advisor rebuild behavior, and the prompt-routing probe.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Left `/prompt` and `@improve-prompt` names unchanged | The parent and phase specs explicitly preserve command and agent names. |
| Did not touch Phase 005 residual grep hits | The user explicitly forbade root docs, install guides, observability, active changelogs, and other Phase 005 surfaces during Phase 003. |
| Did not alter `deep-agent-improvement` `skill_id` | The advisor rebuild blocker is real, but changing `sk-improve-agent` to `deep-agent-improvement` is outside the requested `sk-improve-prompt` to `sk-prompt` literal rename. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 003-owned grep | PASS: explicit file-list grep for `sk-improve-prompt` returned zero hits. |
| Broad scoped grep | BLOCKED BY SCOPE: hits remain only in Phase 005 files that this phase was instructed not to edit. |
| JSON validity | PASS: `jq .` passed for touched `graph-metadata.json` files. |
| JSONL validity | PASS: every line passed `jq .` for touched labeled prompts and regression fixtures. |
| Python syntax | PASS: `PYTHONPYCACHEPREFIX=/tmp/codex-pycache python3 -m py_compile .../skill_advisor.py` passed. |
| Prompt card sync | PASS: `check-prompt-quality-card-sync.sh` printed matching hashes and `SYNC OK`. |
| Advisor rebuild | FAIL: direct handler aborted on `deep-agent-improvement/graph-metadata.json` `skill_id` / folder mismatch; MCP call was cancelled by the tool layer. |
| Advisor probe | PASS: `skill_advisor.py "improve my prompt" --threshold 0.0` returned top-1 `sk-prompt`, confidence `0.82`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor rebuild is not complete.** The local compiled handler fails before indexing because `.opencode/skills/deep-agent-improvement/graph-metadata.json` still declares `skill_id: "sk-improve-agent"` while the folder is `deep-agent-improvement`.
2. **Broad `.opencode/` grep cannot reach zero under Phase 003 constraints.** Remaining old-name hits are Phase 005 files: install guides, active changelog, skill catalog README, system-spec-kit changelog, and observability results/report.
<!-- /ANCHOR:limitations -->
