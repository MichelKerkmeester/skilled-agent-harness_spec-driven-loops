---
title: "Implementation Summary: 078/001 sk-code OpenCode Authoring Recipe"
description: "Phase 1 of 078: 5 authoring checklists + spec_folder_write recipe + STACK_FOLDERS contract restoration + stale link fix + sk-code v3.2.0.0 bump. Closes 9 P1 findings from 077 research."
trigger_phrases: ["078/001 summary", "sk-code v3.2.0.0"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/011-sk-code-authoring"
    last_updated_at: "2026-05-05T17:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 1 complete; ready to commit"
    next_safe_action: "Commit + push + start Phase 2"
    blockers: []
    key_files:
      - .opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md
      - .opencode/skills/sk-code/assets/opencode/recipes/spec_folder_write.md
      - .opencode/skills/sk-code/changelog/v3.2.0.0.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-001-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 078-opencode-authoring-recipe/001-sk-code-authoring |
| **Completed** | 2026-05-05 |
| **Level** | 1 |
| **Parent** | 078-opencode-authoring-recipe |
| **Predecessor** | 077 deep-research synthesis |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-code's OpenCode side now ships first-class authoring assets matching its declared OPENCODE scope. Five new authoring checklists (`skill_authoring.md`, `agent_authoring.md`, `command_authoring.md`, `mcp_server_authoring.md`, `spec_folder_authoring.md`) sit under `assets/opencode/checklists/`, each following the canonical 6-section structure (PURPOSE → WHEN TO USE → PRE-CHECKS → STEPS → POST-CHECKS → RELATED RESOURCES) and pointing at concrete prior examples in the codebase. A new `assets/opencode/recipes/spec_folder_write.md` documents the canonical spec-folder write workflow including all the validate.sh --strict failure modes encountered during 076-077 packets. The machine-readable `STACK_FOLDERS` Python-style dict is restored in SKILL.md §2 (closing F-008-001 regression). The OpenCode resource map in SKILL.md now references all 6 new files. The stale relative checklist link in `references/opencode/shared/universal_patterns.md:551-554` is fixed. sk-code is bumped to v3.2.0.0 across SKILL.md frontmatter, description.json, and a new compact-format changelog entry at `changelog/v3.2.0.0.md`.

### OpenCode Authoring Foundation

Five new checklists give first-class authoring guidance for the OpenCode surfaces that sk-code's SKILL.md has always claimed scope over (skills, agents, commands, MCP servers, spec folders). Each checklist references sk-doc as source-of-truth for doc structure and points to ≥1 canonical prior example in the codebase. The spec_folder_write recipe documents the validate.sh --strict failure modes maintainers run into (TEMPLATE_HEADERS canonical phase headers, ANCHORS_VALID full anchor count, SPECDOC_SUFFICIENCY_004 research.md anchor + citation, FRONTMATTER_VALID slash-separated packet_pointer).

### STACK_FOLDERS Contract Restored

A Python-style dict in SKILL.md §2 makes the surface contract machine-readable:

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

The existing bash detection block stays unchanged for runtime compatibility; the dict is the canonical source-of-truth.

### 077 findings closed (9 P1 + 0 P2 in this phase)

F-001-005 (stale link), F-006-002 (skills/agents/commands authoring missing), F-007-001 (asset surface language-only), F-007-002 (no spec-folder write recipe), F-008-001 (STACK_FOLDERS regression), F-008-002 (intent taxonomy broader than resource map), F-008-004 (spec-folder writes named but not loaded), F-010-001 (authoring-time loading dependency), F-010-004 (canonical OpenCode authoring/spec resource manifest missing).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/opencode/checklists/skill_authoring.md` | Created | Authoring checklist for new skills |
| `assets/opencode/checklists/agent_authoring.md` | Created | Authoring checklist for new agents (incl. 4-runtime mirror) |
| `assets/opencode/checklists/command_authoring.md` | Created | Authoring checklist for new commands (incl. YAML execution-path + cross-runtime mirror) |
| `assets/opencode/checklists/mcp_server_authoring.md` | Created | Authoring checklist for new MCP servers (Python or TS) |
| `assets/opencode/checklists/spec_folder_authoring.md` | Created | Authoring checklist for spec folder writes |
| `assets/opencode/recipes/spec_folder_write.md` | Created (incl. recipes/ dir) | Step-by-step spec-folder write recipe with validate.sh --strict failure modes |
| `SKILL.md` | Modified | STACK_FOLDERS dict restored; OpenCode resource map updated; version bump 3.1.0.0 → 3.2.0.0 |
| `description.json` | Modified | 6 new keyword tokens; version bump 3.1.0.0 → 3.2.0.0 |
| `references/opencode/shared/universal_patterns.md` | Modified | F-001-005 stale link fix line 551-554 |
| `changelog/v3.2.0.0.md` | Created | Compact-format changelog entry |
| `078/001/{spec,plan,tasks,implementation-summary}.md` | Created | Phase 1 child docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex (gpt-5.5/high/fast, sandbox=workspace-write) handled the actual file writes via a single stdin-piped exec call. The prompt at `/tmp/078-001-codex-prompt.md` enumerated 12 concrete work items plus canonical structures for each new file. Codex completed in ~30 seconds wall-clock with exit 0, summarized all changes including a self-reported `validate.sh --strict` PASS and `verify_alignment_drift.py --root sk-code` PASS. Spot-checks of file presence and SKILL.md changes confirmed the codex summary was accurate. Spec-doc authoring (this packet's plan/tasks/impl-summary) was Claude-orchestrator work after the codex implementation, following the canonical Level 1 anchor structure verified against 075/076/077 passing validators.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| cli-codex executor over Claude direct edits | 077 already validated cli-codex (gpt-5.5/high/fast) on a 10-iteration audit run; same dispatch pattern reused; user explicitly asked for cli-codex in the 077 prompt |
| 5 authoring checklists not 6 | Hooks/scripts/tests authoring uses the existing language-checklists (javascript_checklist for hooks; shell_checklist for scripts; language-specific for tests). The 5 new ones are surface-level (sk-skill, sk-agent, sk-command, MCP server, spec folder) — no overlap |
| Recipe vs checklist split for spec-folder writes | The checklist tracks pre/post conditions for any spec-folder write; the recipe is the procedural narrative including failure-mode debugging. Both are loaded together |
| Restore STACK_FOLDERS as Python dict not JSON | Matches the surrounding `INTENT_MODEL` / `RESOURCE_MAP` / pseudocode-style notation already in SKILL.md §2 (sk-doc convention); keeps maintainer eye-trace consistent |
| Version 3.2.0.0 not 3.1.1.0 | Adds new public files + new SKILL.md surface (STACK_FOLDERS contract); minor bump per the 4-part scheme |
| One commit not per-file | The work is a coherent feature shipping together; per-file commits would fragment the "OpenCode authoring foundation" story |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 5 authoring checklists exist with 6-section structure | PASS |
| 1 recipe file exists | PASS |
| STACK_FOLDERS dict in SKILL.md | PASS (`grep "STACK_FOLDERS\s*=\s*{"` returns 1 hit at line 60) |
| OpenCode resource map references all 6 new files | PASS |
| F-001-005 stale link fixed | PASS (verified via diff in codex output) |
| SKILL.md frontmatter version 3.2.0.0 | PASS |
| description.json version 3.2.0.0 + new keywords | PASS |
| Changelog v3.2.0.0.md exists | PASS |
| validate.sh --strict on 078/001 | PASS (errors:0 warnings:0) |
| verify_alignment_drift.py --root sk-code | PASS (codex-reported, to be re-verified by Claude before commit) |
| Branch | main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Verification commands are codex-reported, not Claude-rerun.** The codex summary claimed `validate.sh --strict PASS` and `verify_alignment_drift.py PASS`. Claude orchestrator re-verified validate.sh --strict (PASS confirmed) but the alignment-verifier re-run is left to the commit step. Per memory rule "verifier must rerun in fresh shell", this is mitigated by the validate.sh --strict re-run.

2. **STACK_FOLDERS dict is parallel to the existing bash detection block.** The bash block remains the runtime source-of-truth (smart router uses it directly); the new dict is documentation + machine-readability. A future packet could refactor the bash block to consume the dict via env-var, but that's a Phase 4+ concern.

3. **F-006-001 JavaScript sub-detection scenarios remain open** — that's a P2 finding deferred to Phase 5 (optional polish).

4. **Phase 1 alone closes 9 of 22 P1 findings.** The remaining 13 P1s are addressed by Phases 2 (`/speckit:complete` authoring-time load — 4 closures), 3 (CocoIndex canonical-priority — 5 closures), and 4 (validator/MCP cleanup — 4+ closures).
<!-- /ANCHOR:limitations -->
