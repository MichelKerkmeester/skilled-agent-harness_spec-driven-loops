---
title: "Implementation Summary: Mobbin and Refero design-reference integration"
description: "sk-interface-design can now name the real-world shipped-UI default for a category and deviate from it deliberately, reading Mobbin and Refero live through Code Mode under strict no-chooser, never-copy rules. Two MCPs are wired into Code Mode and a new critique-against reference plus SKILL.md routing carry the discipline."
trigger_phrases:
  - "mobbin refero integration result"
  - "design references mcp summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/009-mobbin-refero-design-reference-integration"
    last_updated_at: "2026-06-15T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wired both MCPs and integrated them into sk-interface-design"
    next_safe_action: "User OAuth plus Code Mode reload, then verify the tools resolve"
    blockers: []
    key_files:
      - ".utcp_config.json"
      - ".opencode/skills/sk-interface-design/references/design_references_mcp.md"
      - ".opencode/skills/sk-interface-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-009-mobbin-refero-design-reference-integration"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 009-mobbin-refero-design-reference-integration |
| **Completed** | 2026-06-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-interface-design now has a live window onto the real-world shipped-UI median. Before this, the only "default" the skill could name and deviate from came from a design system read via `mcp-open-design` or its built-in AI-default calibration. You can now resolve one real-world reference for a category through Mobbin or Refero, name the expected look in a line, and push off it deliberately, without the skill ever becoming a gallery to pick from or a trend to copy.

### Mobbin and Refero wired into Code Mode

Two `mcp` manuals were added to `.utcp_config.json` (`mobbin`, `refero`), each bridging the remote OAuth endpoint to stdio through `npx -y mcp-remote <url>`. Code Mode reaches them the same way it reaches the other manuals. The endpoints are confirmed live (both answer an auth challenge), and `mcp-remote` handles the browser OAuth on first connect.

### A critique-against reference in the skill

A new `references/design_references_mcp.md` defines exactly how these references are used: resolve one reference, name the real-world default, deviate from it, honor a convention only where it serves the user. It draws the line that these are never reuse-ground and never a copy source, because they are third-party records of other companies' shipped products. SKILL.md routes to it (an ON_DEMAND row, a references entry, a Related Skills bullet, and a loading note), and `design_inventory.md` carries a cross-pointer so the design-system and real-world critique-against paths sit side by side. Two tool catalogs, `references/mobbin_tools.md` and `references/refero_tools.md`, document each MCP's tools, the verified Code Mode call convention, and result shapes (Mobbin's content array vs Refero's `{pagination, records}`), modeled on a dedicated MCP skill's tooling reference. The references were then reorganized into 3 domain subfolders (`design-process/`, `design-grounding/`, `mcp-tooling/`) per the sk-doc standard, so their current paths carry that prefix (for example `references/mcp-tooling/mobbin_tools.md`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.utcp_config.json` | Modified | Added the `mobbin` and `refero` mcp-remote stdio manuals |
| `.opencode/skills/sk-interface-design/references/design_references_mcp.md` | Created | The critique-against use and the hard rules |
| `.opencode/skills/sk-interface-design/references/mobbin_tools.md` | Created | Mobbin MCP tool catalog (search_screens, search_flows) |
| `.opencode/skills/sk-interface-design/references/refero_tools.md` | Created | Refero MCP tool catalog (8 tools: styles, screens, flows) |
| `.opencode/skills/sk-interface-design/SKILL.md` | Modified | ON_DEMAND row, references entry, Related Skills bullet, loading note |
| `.opencode/skills/sk-interface-design/references/design_inventory.md` | Modified | Cross-pointer to the new reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The config was validated by JSON parse and a `POST` liveness probe to each endpoint (both returned HTTP 401, confirming the URLs exist and require auth), and `mcp-remote` was confirmed runnable via npx. The skill was verified with `package_skill --check` (PASS), an em-dash sweep (clean), and a word-count check (1964 words, under the 3000 cap). Live tool resolution in Code Mode is the one piece that needs the user's browser OAuth and a Code Mode reload, since stdio manuals load at startup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bridge both with `mcp-remote` | Both are remote HTTP MCPs behind OAuth, and `mcp-remote` is the standard way to wrap a remote OAuth MCP as a stdio manual that Code Mode can load |
| Critique-against only, never reuse-ground | Mobbin and Refero are third-party records of other companies' products, so reusing them would be both the trend by definition and a licensing problem |
| Mirror the `mcp-open-design` integration shape | Keeping the same ON_DEMAND/references/Related-Skills pattern means the skill reads consistently and the no-chooser discipline transfers directly |
| Leave live verification to the user | Code Mode loads stdio manuals at startup and the endpoints need the user's paid OAuth, so an honest Review status beats a fabricated pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.utcp_config.json` parses; both manuals present | PASS |
| Endpoint liveness (Mobbin, Refero) | PASS (both HTTP 401, auth required) |
| `package_skill --check` (sk-interface-design) | PASS |
| Em-dash sweep + SKILL.md word count | PASS (clean, 1964 words) |
| Live `mobbin.*` / `refero.*` resolution in Code Mode | PASS (all 10 tools resolve with full schemas after reload + OAuth) |
| First live tool invocation via `call_tool_chain` | PASS - `mobbin_search_screens` returns real screen data once Code Mode runs on Node 24 (see the separate isolated-vm fix) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fully verified after a Code Mode infra fix.** Tools resolve and invoke: a live `mobbin_search_screens` call returns real screen data (a Substack pricing screen plus a webp image). The first invocation attempts had dropped the Code Mode connection, root-caused to an unrelated pre-existing bug (isolated-vm 6.0.2 segfaults under Node 25), fixed by pinning the Code Mode launcher to Node 24 (committed separately). Tools are called synchronously (no top-level await) and return the MCP content array.
2. **Refero auth model assumed to be OAuth.** Both manuals use plain `mcp-remote` OAuth. If Refero turns out to require a static Bearer, add `--header "Authorization: Bearer ${REFERO_TOKEN}"` to its args and a `REFERO_TOKEN` entry in `.env`.
3. **No reuse-ground path.** By design, these references are critique-against only; there is no token or component reuse from them (that path stays with `mcp-open-design` design systems).
<!-- /ANCHOR:limitations -->
