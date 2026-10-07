---
title: "Implementation Summary: system-memory Rename"
description: "The workflows-memory skill was renamed to system-memory and all 165+ active references were updated across the skill, AGENTS files, commands, other skills and configuration."
trigger_phrases:
  - "system memory rename summary"
  - "workflows memory rename results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/z_archive/001-fix-command-dispatch/z_archive/025-system-memory-rename"
    last_updated_at: "2026-10-07T00:00:00Z"
    last_updated_by: "packet-reconstruction"
    recent_action: "No continuity update was recorded"
    next_safe_action: "None, the packet is archived"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-reconstruction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Summary: system-memory Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-system-memory-rename |
| **Completed** | 2024-12-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `workflows-memory` skill was renamed to `system-memory` to align with the naming convention established by the `workflows-spec-kit` → `system-spec-kit` rename. The "system-" prefix reflects that this is core infrastructure rather than a domain workflow. The directory rename plus 152 replacements across 25+ agents brought the active corpus to zero matches for `workflows-memory` outside historical `specs/` references.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/workflows-memory/` → `.opencode/skills/system-memory/` | Renamed | Single atomic directory rename |
| `SKILL.md` | Modified | 6 references updated |
| `README.md` | Modified | 12 references updated |
| `config.jsonc` | Modified | 2 references updated |
| `templates/context_template.md` | Modified | 2 references updated |
| `mcp_server/INSTALL_GUIDE.md` | Modified | 18 references updated |
| `mcp_server/lib/vector-index.js` | Modified | 2 critical path references updated |
| `scripts/lib/vector-index.js` | Modified | 2 critical path references updated |
| `scripts/generate-context.js` | Modified | 3 references updated |
| `scripts/setup.sh` | Modified | 2 references updated |
| `scripts/package.json`, `scripts/package-lock.json` | Modified | Package names updated |
| `references/execution_methods.md` | Modified | 9 references updated |
| `references/semantic_memory.md` | Modified | 6 references updated |
| `references/alignment_scoring.md` | Modified | 3 references updated |
| `references/troubleshooting.md`, `references/spec_folder_detection.md` | Modified | 2 references updated |
| `AGENTS.md` | Modified | 6 references updated |
| `AGENTS (Universal).md` | Modified | 3 references updated |
| `opencode.json` | Modified | 2 absolute paths updated |
| `commands/memory/*`, `commands/spec_kit/assets/*.yaml`, `commands/create/*` | Modified | Command and YAML references updated |
| `system-spec-kit`, `sk-doc`, `cli-codex`, `cli-gemini` skill docs | Modified | Cross-skill references updated |
| `.opencode/agents/orchestrator.md` | Modified | 4 references updated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five phases: (1) blocking directory rename by the orchestrator; (2) internal skill updates by 14 parallel agents; (3) external reference updates by 11 parallel agents; (4) verification by 3 parallel agents; (5) documentation and cleanup. Verification greped internal and external references, tested the MCP server, commands, skill invocation and database connectivity. The spec records 25+ agents and 152 replacements in total.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rename the directory first, then fan out updates | Phase 2 and 3 depend on the new directory existing |
| Preserve `/memory:*` command names | The command namespace is separate from skill naming |
| Preserve `semantic_memory` and `semantic-memory-mcp` names | MCP server and npm package names are a different concept from the skill name |
| Preserve historical references in `specs/` | They reflect the state at the time of writing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Old directory gone | PASS |
| New directory exists | PASS |
| Grep text files for `workflows-memory` | PASS, 0 matches |
| Symlink fixed | PASS |
| Key files verified | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Binary SQLite database files** contain historical `workflows-memory` strings. This is expected; they update naturally as new memories are created.
2. **Historical references in `specs/`** were preserved as intended.
<!-- /ANCHOR:limitations -->
