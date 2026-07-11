---
title: "Implementation Summary: Unified Post-Edit Quality Router (planning stub)"
description: "Planning stub for the post-edit quality router. The phase is planned and not yet implemented; this file lists intended deliverables and makes no completion claims."
trigger_phrases:
  - "post-edit router implementation summary"
  - "post-edit-router planning stub"
  - "post-edit quality router status"
  - "post-edit-router intended deliverables"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/003-post-edit-quality-router"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored planning stub; phase upgraded Level 1 to Level 3, not yet implemented"
    next_safe_action: "Begin T001 once the L3 plan is approved; then fill this stub after work lands"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/plugins/mk-post-edit-quality.js"
      - ".opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-post-edit-quality-router"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Shared deadline value (ms) and per-child timeout carve for the OpenCode after-hook"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Unified Post-Edit Quality Router

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **PLANNING STUB.** This phase is planned and not yet implemented. No code has been written. This file makes no completion claims and will be filled in after the work lands.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-post-edit-quality-router |
| **Status** | Planned (not yet implemented) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The plan is to build one deadline-bounded, warn-only post-edit router that maps each edited path to the right quality checker(s) and surfaces violations as advisories across Claude and OpenCode.

### Intended Deliverables

- `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs`: the shared runtime-neutral core (`resolveDispatch` + `runChecks`, dispatch table, three-way scope resolver).
- `.opencode/plugins/mk-post-edit-quality.js`: the OpenCode default-export-only adapter (before/after callID correlation + `chat.system.transform` surfacing).
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs`: the Claude thin `.cjs` adapter over the shared core.
- `.claude/settings.json`: swap the PostToolUse `Write|Edit` command from `python3 …` to `node …`.
- `.opencode/plugins/README.md`: one entrypoint-table row for the new plugin.
- `.opencode/plugins/tests/mk-post-edit-quality.test.cjs`: the table-driven `resolveDispatch` unit plus the before/after correlation test.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended verification path is the resolveDispatch table test, the OpenCode before/after correlation test, the fail-open and deadline-exhaustion cases, and a dual-workspace smoke of the `.cjs` hook (Public root and Barter symlink) before the legacy Python hook is removed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared `.cjs` core plus two thin adapters | Removes the dispatch-logic drift between the Claude and OpenCode runtimes. See ADR-001. |
| Warn-only, fail-open, no enforce mode in v1 | A per-edit hook must never block or stall a session. See ADR-002. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Planning-stage verification only. The command below was run against this folder to validate the L3 documents:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/132-plugin-hook-implementation/003-post-edit-quality-router --strict
```

| Check | Result |
|-------|--------|
| `validate.sh --strict` on the L3 planning docs | Anchors, placeholders, frontmatter, level, and section counts pass; the 2 remaining errors are `graph-metadata.json`/`description.json` regeneration owned by the central metadata pass |
| Implementation | Not started |
| Tests | Not written |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a planning stub; all tasks in `tasks.md` and items in `checklist.md` are unchecked. No runtime evidence exists yet.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
