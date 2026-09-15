---
title: "Implementation Summary"
description: "The repo-root .hermes folder exists with an agents link, generated markdown-only copies of all 56 skills and 12 agent personas, 33 generated prompt templates, the project plugin, the playbook symlink and a sync manifest; a live session reached a repo skill and ran a command template end to end."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder"
    last_updated_at: "2026-09-14T20:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Skills surface regenerated as markdown-only copies of all 56 skills; live preload proven; earlier: redesigned to per-skill links"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".hermes/SYNC.md"
      - ".opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-005-hermes-runtime-folder"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-hermes-runtime-folder |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Hermes session started in this repository now has a `.hermes/` folder shaped like the sibling dotfolders, carrying only what Hermes reads from a project.

### Phase 5: hermes runtime folder

You get `skills/<name>/SKILL.md` as a generated markdown-only copy of every canonical skill (56, flat by frontmatter name, from `sync-skills-hermes.cjs`; a symlinked directory is scanned in full by Hermes, so the whole-tree link took ten minutes and quarantined every hub, and a single linked skill was quarantined on its scripts and references), 33 generated prompt templates under `prompts/` that point at the canonical commands and are carried by `--query-file`, the `plugins/repo-guards/` slot phase 006 fills, the playbook symlink, and a `SYNC.md` that lists the four operator steps Hermes keeps user-level.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.hermes/skills/<name>/SKILL.md` | Generated (56 + 12 `agent-<name>`) | markdown-only copies naming their canonical source |
| `.hermes/agents` | Created (symlink) | `../.opencode/agents`, the authored agent files |
| `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Created | generator with `--check`; 3 node tests |
| `.hermes/manual-testing-playbook` | Created (symlink) | `../.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook` |
| `.hermes/prompts/*.md` | Generated | 33 pointer stubs, one per canonical command |
| `.hermes/SYNC.md` | Created | Surface inventory, operator steps, sync workflow, plugin hook map |
| `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs` | Created | The generator, modelled on the Pi one; write mode prunes, `--check` detects drift |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Symlinks were created with the same relative targets the Pi and Devin folders use. The generator reuses the command-scope exclusion helper and writes pointer stubs rather than copies, so a command edit never leaves a stale template. A `.gitkeep` from an earlier session already held the folder's place.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No `agents/` surface | Hermes has no flag that loads an agent file; personas are inlined per the packet |
| Pointer stubs, not command copies | The same rule as Pi and Codex; nothing duplicates the canonical text |
| Operator steps listed in `SYNC.md` | Provider, trust, plugin opt-in and MCP are user-level; the folder must not pretend otherwise |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls -la .hermes` | Symlinks resolve; `prompts/`, `plugins/`, `SYNC.md` present |
| `sync-prompts-hermes.cjs` then `--check` | Wrote 33 of 33; PASS, 33 in sync |
| Duplicate content | None; stubs point at canonical files |
| Live skill reach with the repo trusted | `-s cli-hermes` quoted `stdin-redirect-required`; `hermes skills list` enumerates 61 of the 68 copies as `local` rows, the seven absences being the quarantined ones (2026-09-15) |
| One template dispatched end to end | `agent-router` template via `--query-file`: `PERSONA=markdown`, exit 0, 91 s |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Seven copies are quarantined by Hermes's prose scanner** (`cli-cursor`, `cli-devin`, `cli-opencode`, `deep-research`, `mcp-aside-devtools`, `mcp-magicpath`, `sk-create-repo-rule`) on patterns in their own text; they still preload with `-s`, and Hermes has no knob for it. A new skill appears after re-running the generator under `skills/`; a dispatch that needs any other skill names it by path.
2. **`hermes skills trust` is user-level.** Done 2026-09-14 under operator authorization; a fresh machine needs it again.
<!-- /ANCHOR:limitations -->

---
