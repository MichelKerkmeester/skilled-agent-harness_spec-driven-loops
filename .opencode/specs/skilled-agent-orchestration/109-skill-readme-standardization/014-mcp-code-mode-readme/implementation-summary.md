---
title: "Implementation Summary: mcp-code-mode README"
description: "The mcp-code-mode README now reads in the narrative voice and leads with the Code Mode execution engine (progressive disclosure, ~98% context reduction, the naming translation rule) the other mcp-* skills consume."
trigger_phrases:
  - "mcp-code-mode readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/014-mcp-code-mode-readme"
    last_updated_at: "2026-06-07T13:05:42Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped mcp-code-mode README; Batch C complete"
    next_safe_action: "Begin phase 015 (sk-code-review README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 8 cited paths and 2 cited playbook subdirs resolve; code-form call confirmed (no array form); naming translation rule documented; version line and contested counts dropped; one prose typo (Code Graph) fixed"
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
| **Spec Folder** | 014-mcp-code-mode-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mcp-code-mode README now opens with a human pitch and an at-a-glance table, explains the upfront-tool-schema-load problem before the mechanism, and leads with the distinctive value: the Code Mode execution engine that lets an agent call hundreds of external MCP tools by writing TypeScript in one execution, discovering schemas on demand so the context stays flat (roughly 98% smaller) regardless of how many servers are configured.

### Narrative rewrite

HOW IT WORKS covers the four core tools, progressive disclosure, the naming translation rule (the documented number-one error), state persistence and error handling, and the `.env` prefix rule. QUICK START shows the four-step workflow (search_tools, tool_info, then a `call_tool_chain({ code })` block, then a multi-tool chain). INTEGRATION states that Code Mode only reaches `.utcp_config.json` tools and that the consumer mcp-* skills build on it. The table of contents is gone. It is 201 lines and HVR-clean in prose.

### Drift dropped, gotcha added

The old README pinned a version line (the docs disagree across 1.0.7.0, 1.0.9 and 2.0.0), a "5 manuals" count (the install guide says 6), and an unverified "60% faster execution" claim. The rewrite drops all three. It adds the naming translation rule the old README omitted: `list_tools()` returns dotted names, but a call uses the dot-then-underscore form, and `tool_info()` shows the correct syntax.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-code-mode/README.md` | Modified | Narrative-voice rewrite of the Code Mode engine README |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Both confirmed the code-form `call_tool_chain` is canonical for this skill (the opposite of the click-up array form), the four-step progressive-disclosure workflow, the naming translation rule and the seven-tool runtime surface, which matches the runtime tool registry. DeepSeek's draft was the stronger base. The host verified all 8 cited paths and the two cited playbook subdirectories resolve, fixed one prose typo (Code Graph), and confirmed the draft uses the code form with no array-form calls.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the code-form `call_tool_chain({ code })` | It is the canonical form documented throughout this engine skill |
| Document the naming translation rule | It is the number-one error, and the old README omitted it |
| Drop the version, the manual count and the perf claim | The docs disagree on the first two and the third is unverified |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean |
| Code-form call confirmed (no array form); naming rule present; no version leak | PASS |
| All 8 cited paths and 2 cited playbook subdirs resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cross-skill call-form inconsistency persists at the source.** This engine documents the code-form `call_tool_chain({ code })`, while the consumer `mcp-click-up` SKILL.md documents the array form. Both are valid Code Mode invocations, and each README now matches its own skill's authority, but reconciling the two SKILL.md conventions is out of scope for a docs-only README phase; note it for a later packet.
<!-- /ANCHOR:limitations -->
