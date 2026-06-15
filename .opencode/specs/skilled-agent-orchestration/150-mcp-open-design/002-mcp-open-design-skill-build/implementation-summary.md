---
title: "Implementation Summary: mcp-open-design skill build"
description: "Built the mcp-open-design skill v1.0.0 to drive the installed Open Design app from the terminal: od mcp wiring, the gated ~18-tool MCP surface, and the headless od verbs, modeled on mcp-magicpath. Shipped as commit 0508518ac9."
trigger_phrases:
  - "mcp-open-design build summary"
  - "open design skill build outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-mcp-open-design/002-mcp-open-design-skill-build"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "mcp-open-design v1.0.0 shipped in commit 0508518ac9, record authored"
    next_safe_action: "Operator reviews the record, then phase 003 de-vendor follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ba89fb599db4ce49b48cb8d3e92be434ecd4ad46ea173d95587ce46661552e08"
      session_id: "session-150-002-mcp-open-design-skill-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/150-mcp-open-design/002-mcp-open-design-skill-build |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
| **Commit** | `0508518ac9` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet records the build of the `mcp-open-design` skill, which lets an agent drive the installed Open Design desktop app from the terminal. It shipped as commit `0508518ac9` (twenty files, the full skill package) and the deliverable lives at `.opencode/skills/mcp-open-design/`. This is a retroactive record of completed work and does not re-do the build or edit the skill.

### Terminal control of Open Design
The skill carries three directions. The wire direction registers Open Design's stdio MCP server into the agent with `od mcp install opencode` or `od mcp install claude`, using the local `node "$OD_BIN"` invocation form. The read direction calls the read-only tools (`list_projects`, `get_active_context`, `get_project`, `get_file`, `search_files`, and the rest) and reads registered design systems. The run direction commissions headless generation runs.

### The gated tool surface
The `od mcp --help` text lists only a documentation subset of tools, but the running server registers roughly eighteen, including mutating verbs (`write_file`, `create_project`, `start_run`) and destructive ones (`delete_file`, `delete_project`). The skill records this and enforces a surface, gate, and omit policy: read-only verbs surface freely, mutating verbs are gated behind explicit confirmation, and destructive verbs are kept off the default path. It requires verifying the live `tools/list` before promising any tool exists or is read-only.

### Modeled on mcp-magicpath
The package follows the `mcp-magicpath` shape: a SKILL.md runtime contract, three references (`mcp_wiring.md`, `tool_surface.md`, `od_cli_reference.md`), a feature catalog, a manual testing playbook, a README, and a v1.0.0.0 changelog. A reciprocal graph edge to `mcp-magicpath` was added so the two skills are linked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SKILL.md` | Created | Runtime contract: wire, read, run directions, the surface/gate/omit policy, and the ALWAYS/NEVER rules |
| `references/mcp_wiring.md` | Created | `od mcp install` wiring, config shape, socket-discovery transport |
| `references/tool_surface.md` | Created | The ~18 MCP tools and the surface/gate/omit policy |
| `references/od_cli_reference.md` | Created | The headless `od` verbs and transport |
| `feature_catalog/` (root plus five sections) | Created | Capability inventory: wiring, reading, grounding, runs, transport |
| `manual_testing_playbook/` (root plus four sections) | Created | Operator scenarios: wiring, reading, gated runs, failure paths |
| `README.md` | Created | Narrative overview, troubleshooting, FAQ |
| `changelog/v1.0.0.0.md` | Created | Initial release changelog |
| `graph-metadata.json` | Created | Skill graph topics, edges, source docs |
| `mcp-magicpath/graph-metadata.json` | Modified | Reciprocal edge to the new skill |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file | Created | Packet control docs (this retroactive record) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A model-on-sibling skill build. The phase 001 research fleet supplied the source of truth for Open Design's terminal surface, the tool tiers, and the transport, and the `mcp-magicpath` package supplied the structural template. The skill was authored in that shape with the wire, read, and run directions and a strict surface, gate, and omit policy, then checked with `package_skill.py --check` and shipped as commit `0508518ac9`. A later deep review (recorded in phase 004) and a generation-flow correction (phase 007) refined the run direction and reference accuracy after this build landed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Model the skill on `mcp-magicpath` | A consistent house shape across the terminal-control skills, and a proven package structure |
| Gate every mutating verb, omit every destructive one | The running server registers verbs the help text hides, so the policy keeps them off the default path |
| Require live `tools/list` verification | The help text undercounts the real surface, so a tool's name or read-only status must be confirmed live |
| Drive Open Design via MCP plus headless `od` verbs | The stdio server and CLI cover wiring, reading, and generation without the in-app chat UI |
| Use the local `node "$OD_BIN"` form | The upstream install script is not in the bundle, so its contents are unverified, and the local form is confirmed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS, skill valid, no word-count warning |
| Tool policy coverage | PASS, every verb classified surface, gate, or omit |
| Structure parity with mcp-magicpath | PASS, same SKILL.md, references, catalog, playbook, README, changelog shape |
| Voice sweep | PASS, no em dashes, no new prose semicolons |
| Shipped | PASS, commit `0508518ac9` (twenty files) |
| `validate.sh --strict` (this packet) | PASS, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Built from research and reverse-engineering, not a live wire.** The v1.0.0 build applied the phase 001 ground-truth. The live `od mcp install opencode` wire against a running daemon is carried into phase 004.
2. **The generation flow was later corrected.** v1.0.0 described generation as a one-shot `start_run`, and phase 007 corrected it to the live-verified multi-turn flow after a live test. This record describes the v1.0.0 state as shipped.
3. **Some transport facts were inferred.** Daemon lifecycle and per-verb auth were tagged inferred at build time and carried forward for live confirmation.
<!-- /ANCHOR:limitations -->
