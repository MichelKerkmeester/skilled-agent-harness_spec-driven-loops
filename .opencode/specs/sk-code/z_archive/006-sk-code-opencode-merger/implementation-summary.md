---
title: "Implementation Summary: sk-code-opencode-merger"
description: "Implementation summary for the sk-code-opencode merger packet. The standalone OpenCode code skill was merged into sk-code as the OPENCODE surface."
trigger_phrases:
  - "sk-code-opencode merger summary"
  - "planning only summary"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/006-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T17:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Merged OpenCode standards into sk-code"
    next_safe_action: "Review final diff and decide whether to commit"
    blockers: []
    key_files:
      - ".opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/spec.md"
      - ".opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/plan.md"
      - ".opencode/specs/sk-code/z_archive/006-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660665"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime implementation completed after user approved continuation."
      - "Historical changelogs: DELETE (13 files)."
      - "Telemetry JSONL: REWRITE/REGENERATE."
      - "Route name: 'opencode' (folder) / 'OPENCODE' (identifier)."
      - "Two-axis detection: Code Surface (Webflow/OpenCode) → Intent Classification → Resource Loading."
      - "Language sub-detection within OPENCODE surface."
      - "Barter sk-code comparison: context-aware CWD detection replaces git-remote project routing."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 066-sk-code-opencode-merger |
| **Completed** | 2026-05-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This implementation merged the standalone OpenCode system-code standards into `sk-code` as the `OPENCODE` surface route, preserving Webflow frontend routing as `WEBFLOW` and leaving unsupported stacks as `UNKNOWN`.

### Planning Packet

The packet now contains a Level 3 specification with completed tasks, verification evidence, ADR with resolved route name, and resource map.

### Deep Analysis Session (2026-05-03)

A deep-analysis session using Sequential Thinking compared three models:
1. **Current sk-code**: stack-detection-first (marker files → WEBFLOW/GO/NEXTJS → intent → resources)
2. **Current sk-code-opencode**: language-detection-first (file extension → JS/TS/Python/Shell/Config → standards)
3. **Barter sk-code**: two-step detection (git remote → project knowledge; marker files → verification commands only)

The delivered design uses **two-axis context-aware detection**: Code Surface (first gate, from CWD + changed files) -> Intent Classification (second gate, weighted keyword scoring) -> Per-surface resource loading with language sub-detection for OpenCode.

### Runtime Changes

| Area | Delivered |
|------|-----------|
| `sk-code` | Rewritten as the single code-work skill with `WEBFLOW`, `OPENCODE`, and `UNKNOWN` surfaces. |
| OpenCode standards | Moved into `.opencode/skills/sk-code/references/opencode/` and `.opencode/skills/sk-code/assets/opencode/checklists/`. |
| Verifier | Moved to `.opencode/skills/sk-code/scripts/verify_alignment_drift.py`. |
| Removed branches | Deleted Go and NextJS placeholder branches plus `cross_stack_pairing.md`. |
| Review/CLI/docs | Updated `sk-code-review`, CLI dispatch guidance, agents, commands, repo docs, and install guides to the single-skill model. |
| Advisor/tests | Updated scorer lanes, fixtures, hook expectations, telemetry, and generated graph artifacts to route OpenCode system code to `sk-code`. |
| Obsolete skill | Deleted `.opencode/skills/sk-code-opencode/` after live references were clean. |

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Two-axis detection | Single axis can't distinguish Webflow frontend work from OpenCode system work in the same repo |
| CWD + changed files for surface detection | Unlike Barter's git-remote approach, our repo contains both surfaces |
| Language sub-detection within OpenCode | Preserves sk-code-opencode's file-extension routing inside the unified router |
| Full 5-phase lifecycle for OpenCode | Currently OpenCode has only "apply standards"; deserves Implementation→Debug→Verify phases |
| Folder name "opencode" / identifier "OPENCODE" | Matches existing "webflow"/"WEBFLOW" convention |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation used exact reference searches, direct file inspection, focused patches, advisor graph regeneration, smart-router measurement regeneration, skill graph scan/rebuild, and targeted vitest/verification commands. Remaining old-skill strings are intentionally historical/spec-folder identifiers only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Implement after continuation approval | The user instructed to continue if next steps were clear |
| Use Level 3 documentation | The change spans skills, agents, commands, advisor code, tests, docs, and metadata |
| Design two-axis detection | Single-axis stack detection can't distinguish Webflow frontend from OpenCode system code in the same repository |
| Route name `opencode` / `OPENCODE` | Matches existing `webflow` / `WEBFLOW` convention |
| Language sub-detection within OpenCode | Preserves sk-code-opencode's extension-based routing; absorbed as second-level routing |
| Delete obsolete skill directory | The merger absorbs OpenCode standards into `sk-code`; old changelogs were removed with the directory |
| Regenerate telemetry JSONL | Generated data; regeneration is cleaner than manual patching |
| Barter comparison | Barter uses git-remote for project routing; we use CWD+changed-files because same repo has both surfaces |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused advisor/router vitest suite | PASS, 11 files / 185 tests |
| Alignment fixture preservation test | PASS, 1 file / 2 tests |
| Alignment verifier | PASS, `python3 .opencode/skills/sk-code/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/skill_advisor` |
| Advisor graph compile | PASS, 19 skills; warning only for 4631-byte graph exceeding 4KB target |
| Skill graph scan/status | PASS, 19 skills, 68 edges, healthy, no stale skill IDs |
| Smart-router measurement | PASS, regenerated with 130/197 advisor label accuracy and no removed-skill labels |
| Exact live reference search | PASS, only historical/spec-folder identifiers remain |
| Spec validation | PASS, `validate.sh ... --strict`, 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Generated advisor graph size warning remains.** `skill_graph_compiler.py --export-json` reports `WARNING: Output exceeds 4KB target (4631 bytes)`, but validation passes.
2. **Historical references remain intentionally.** Old skill strings remain only in spec-folder identifiers or historical changelog text.
3. **No packaged release was created.** This was a repository refactor/metadata update, not a release workflow.

---

<!-- ANCHOR:runbook -->
## Runbook

If this needs rollback, restore `.opencode/skills/sk-code-opencode/` and the previous advisor graph/telemetry from git, then rerun `skill_graph_scan` and advisor rebuild. If continuing forward, use `sk-code` for both Webflow frontend and `.opencode/` system-code work, and use `sk-code-review` only for findings-first review output.
<!-- /ANCHOR:runbook -->
<!-- /ANCHOR:limitations -->
