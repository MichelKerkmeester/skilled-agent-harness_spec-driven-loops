---
title: "Verification Checklist: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Verification checklist for the Pi MCP-host integration phase (pi-mcp-extension, third-party package)."
trigger_phrases:
  - "pi mcp host integration checklist"
  - "pi-mcp-extension checklist"
  - "pi mcp.json verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T08:35:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored verification checklist; all items unchecked, phase Planned"
    next_safe_action: "Work through items in order once 001-pi-contract-pin resolves and pi-mcp-extension is installed"
    blockers: ["stdio transport support in pi-mcp-extension is unconfirmed from docs; this phase's primary go/no-go gate"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-007-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi MCP-host integration (pi-mcp-extension, third-party)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements (REQ-001 through REQ-008), success criteria (SC-001 through SC-005), and the third-party-package flag are documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach (two-tier deny-by-default design, Phase 1-3 structure gated on REQ-002) defined in `plan.md`
- [ ] CHK-003 [P0] `001-pi-contract-pin`'s live headless/session contract is confirmed available, and `006-pi-agent-bridge`'s status is confirmed (sequencing-only predecessor, no functional coupling) before any task in this phase starts
- [ ] CHK-004 [P1] pi-mcp-extension's package docs page (https://pi.dev/packages/pi-mcp-extension) is re-read live before authoring any config, since the docs snapshot informing this planning pass may have drifted by execution time
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Any authored `.pi/mcp.json` is valid JSON (`jq empty` or equivalent passes)
- [ ] CHK-011 [P0] No server carrying a known mutation tool (`mk_skill_advisor`'s `advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances`; `code_mode`'s `register_manual`/`deregister_manual`/`call_tool_chain`) receives an unrestricted default allow in the committed Tier 1 config
- [ ] CHK-012 [P1] `code_mode`'s machine-specific absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`, per `.mcp.json`'s current entry) is carried forward as a documented pre-existing portability risk, not silently rewritten
- [ ] CHK-013 [P1] Every translated `.pi/mcp.json` entry's `command`/`args`/`env` is diffed against `.mcp.json`'s real current shape (re-read live, not reconstructed from memory)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001: pi-mcp-extension installs and loads without error in a live Pi session; the exact observed install syntax is recorded verbatim (it may not match the inferred `pi install npm:pi-mcp-extension`)
- [ ] CHK-021 [P0] REQ-002 (PRIMARY go/no-go): the single-entry `sequential_thinking` stdio probe either connects with its tool callable via `/mcp` (or equivalent discovery surface), or the exact rejection/error is recorded verbatim — an ambiguous or skipped result is not an acceptable outcome for this item
- [ ] CHK-022 [P0] REQ-003/REQ-004: if CHK-021 confirms stdio support, all 5 native servers (`sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`) appear connected in a live `/mcp` (or equivalent) discovery listing
- [ ] CHK-023 [P0] REQ-005: the deny-by-default enforcement point (pi-mcp-extension's own permission surface, Pi's core Security/tool-approval settings, or neither) is live-confirmed and recorded as evidence in this phase's own findings, not asserted from Devin's differently-shaped precedent
- [ ] CHK-024 [P0] Mutation-tool inventory for the 4 non-`sequential_thinking` servers is enumerated from a live discovery call (`tools/list` or equivalent), not source/`.mcp.json`-comment inspection alone
- [ ] CHK-025 [P1] REQ-007: `code_mode`'s `call_tool_chain` policy decision is live-exercised — at least one attempted dispatch through an unapproved external UTCP manual is denied/asked by default, not silently allowed
- [ ] CHK-026 [P1] Rollback test: removing/disabling the `.pi/mcp.json` config touches no repository database or source file outside `.pi/` (`git status`/`git diff` clean)
- [ ] CHK-027 [P2] Cold-bootstrap timing for native modules (`better-sqlite3`, `sqlite-vec`, tree-sitter/WASM) inside `mk-spec-memory`/`mk_code_index` under Pi's spawn is captured as evidence timing, not just pass/fail, mirroring `029/009`'s identical R-002 discipline
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — this phase is new host-integration planning (installing pi-mcp-extension and designing a `.pi/mcp.json` translation), not a bug fix to existing behavior.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No provider API key, token, or credential ever appears as a literal value in a committed `.pi/mcp.json` entry — only as an env-var reference (e.g. `${CLICKUP_API_KEY}`), mirroring how `.utcp_config.json` already handles ClickUp/Figma auth
- [ ] CHK-031 [P0] `grep -r "MK_SKILL_ADVISOR_TRUST_DEFAULT" .pi/mcp.json` (once authored) returns zero literal-value matches — passthrough env reference only, never a hardcoded `"trusted"` grant baked into a committed file
- [ ] CHK-032 [P0] No `mcp__<server>__*` or blanket wildcard tool grant anywhere in the committed Tier 1 config
- [ ] CHK-033 [P1] If REQ-006 confirms Tier 2 needs a project-local file (rather than the maintainer's own global `~/.pi/agent/mcp.json`), that file is added to `.gitignore` and confirmed gitignored via `git status` before any real secret-bearing entry is ever written to it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Every claim sourced from pi.dev documentation rather than confirmed live Pi behavior is explicitly marked as such in `spec.md`/`plan.md` — no documented-only claim is stated as if it were already verified
- [ ] CHK-041 [P1] `spec.md`/`tasks.md` name the future target path `.opencode/skills/cli-external-orchestration/cli-pi/references/mcp-host-integration.md`, even though the doc itself is not authored until `003-cli-pi-skill-packet` exists
- [ ] CHK-042 [P1] REQ-002's outcome (stdio supported vs. unsupported) is recorded plainly enough that `008-pi-hook-extension-layer` and `009-pi-model-registry-and-routing` can consume it without re-deriving it
- [ ] CHK-043 [P2] The community-maintained/version-drift risk for pi-mcp-extension (no Pi-core guarantee; treat every behavior claim as needing re-verification on upgrade) is recorded in `spec.md`'s risk log
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] This authoring pass modifies no file outside `007-pi-mcp-host-integration/`, confirmed via `git status`/`git diff` scoped to this folder
- [ ] CHK-051 [P1] `description.json` and `graph-metadata.json` in this folder, and the parent `spec.md`, are left untouched by this pass — reserved for the separate metadata backfill pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not yet started — phase is Planned; no live verification has occurred. CHK-021 (the primary stdio-transport go/no-go gate) is the first item any future execution pass must resolve.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

