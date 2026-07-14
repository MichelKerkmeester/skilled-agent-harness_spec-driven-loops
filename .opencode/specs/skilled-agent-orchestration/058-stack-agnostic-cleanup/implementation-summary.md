---
title: "Implementation Summary: Phase 071 Stack-Agnostic Cleanup"
description: "Completed stack-agnostic cleanup for non-sk-code skills, preserving sk-code as the only stack-specific customization layer."
trigger_phrases:
  - "phase 071 complete"
  - "stack agnostic cleanup summary"
  - "non sk-code cleanup complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup"
    last_updated_at: "2026-05-05T19:14:28Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed non-sk-code stack-specific cleanup and verification"
    next_safe_action: "Review final diff and commit Phase 071 if desired"
    blockers: []
    key_files:
      - ".opencode/skills/"
      - "specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/"
    session_dedup:
      fingerprint: "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      session_id: "phase-071-stack-agnostic-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Non-sk-code authored skill content now has zero forbidden-token hits when vendored dependency folders are excluded."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 071 Stack-Agnostic Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup` |
| **Completed** | 2026-05-05 |
| **Level** | 2 |
| **Verdict** | DONE |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 071 made the non-`sk-code` skill layer portable. CLI, MCP, documentation, git, review, and spec workflow skills now use generic service, frontend, code-surface, or `<surface>` examples instead of naming a specific frontend stack, animation library, CMS, or user repo path.

### Agnostic Skill Boundary

`sk-code` remains the only skill that may carry stack-specific standards and routing details. Non-`sk-code` skills now point to `sk-code` as the surface evidence source instead of embedding concrete surface tags or stack examples themselves.

### MCP and CLI Examples

Code Mode examples now use `myservice.myservice_*` patterns and generic external-service wording. CLI dispatch skills now instruct child sessions to let `sk-code` emit the detected surface tag rather than naming internal surface tags in the dispatch prompt.

### Review and Spec Workflow Metadata

`sk-code-review` now documents `sk-code:<surface>` as the generic evidence placeholder. `system-spec-kit` memory examples, structure examples, and advisor graph signals now use frontend/code-surface wording. The generated skill graph was recompiled and then sanitized so the compiled global graph does not leak `sk-code` stack specifics into the non-`sk-code` layer.

### Files Changed

| File Area | Action | Purpose |
|------|--------|---------|
| `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/` | Created/Modified | Phase packet, ADR, inventory, tasks, checklist, summary |
| `.opencode/skills/cli-*` | Modified | Generic `sk-code` surface-evidence dispatch wording |
| `.opencode/skills/mcp-chrome-devtools/` | Modified | Generic Code Mode external-service examples |
| `.opencode/skills/mcp-coco-index/` | Modified | Generic library path-priority example |
| `.opencode/skills/mcp-code-mode/` | Modified/Renamed | Replaced external CMS examples with `myservice` placeholders and renamed the matching manual scenario file |
| `.opencode/skills/sk-doc/` | Modified | Generic MCP and frontend documentation examples |
| `.opencode/skills/sk-git/` | Modified | Generic surface-aware commit standards wording |
| `.opencode/skills/sk-code-review/` | Modified | `<surface>` placeholders and surface-aware review metadata |
| `.opencode/skills/system-spec-kit/` | Modified | Generic memory examples, structure path example, and advisor graph signals |
| `.opencode/skills/README.md` | Modified | Root skill index uses generic surface wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cleanup started with the requested grep and saved the initial inventory in `scratch/initial-inventory.md`. Edits were applied in deterministic order across CLI, MCP, docs, git, review, system-spec-kit, and the larger Code Mode surface. Each touched `SKILL.md` frontmatter was checked after patching.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep stack specifics only in `sk-code` | This gives public-template users one customization layer instead of scattered stack examples |
| Use `myservice` placeholders for Code Mode examples | This preserves concrete API shape without naming a real CMS |
| Exclude vendored `.venv/` and `node_modules/` from authored-content grep | Those dependency files are not skill guidance and include tokenizer/type-map vocabulary |
| Preserve runtime names such as `cli-opencode` and `.opencode/` paths | Those are framework/runtime conventions, not project stack specifics |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Initial requested grep | PASS: raw 368 hits; authored-content scope 363 hits |
| Final authored-content grep | PASS: 0 hits outside `/sk-code/`, `/changelog/`, `.venv/`, and `node_modules/` |
| Raw grep after cleanup | INFO: 5 vendored dependency hits remain under `.venv/` and `node_modules/` |
| Forbidden filename scan | PASS: 0 stack/library-specific filenames outside protected paths |
| Touched `SKILL.md` frontmatter check | PASS: 9/9 touched `SKILL.md` files parsed |
| Skill graph compile | PASS: `skill_graph_compiler.py --export-json --pretty` |
| Skill graph validate-only | PASS: `skill_graph_compiler.py --validate-only` |
| Required 8-prompt routing suite | PASS: 8/8 prompt classes matched expected top skill |
| Additional full advisor regression | INFO: 82/98 pass; pre-existing/stale corpus expectations remain outside Phase 071 scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Raw grep is not zero without dependency exclusions.** Five remaining matches are vendored dependency vocabulary/type-map data under skill-local `.venv/` and `node_modules/`, not authored skill guidance.
2. **A pre-existing `sk-code` diff is present in the workspace.** Phase 071 did not edit `.opencode/skills/sk-code/`, but `git diff --name-only -- .opencode/skills/sk-code` reports an already-dirty manual playbook file.
<!-- /ANCHOR:limitations -->
