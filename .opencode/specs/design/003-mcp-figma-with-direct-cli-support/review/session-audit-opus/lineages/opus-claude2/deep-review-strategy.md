# Deep Review Strategy: mcp-figma skill package

**Target**: `design/003-mcp-figma-with-direct-cli-support` (phase-parent spec) + the shipped skill at `.opencode/skills/mcp-figma/`
**Session**: `fanout-opus-claude2-1781464600582-ntawto` (generation 1, new)
**Executor**: cli-claude-code / claude-opus-4-8
**Mode**: review (auto)

## Topic

Release-readiness review of the `mcp-figma` skill (v0.1.0) and its phase-parent spec. The skill teaches an agent to drive Figma Desktop from the terminal via the silships `figma-ds-cli`, with an optional Figma MCP through Code Mode. Phases 001 (research) and 002 (build + registration) are marked Complete.

## Review Dimensions

- [x] D1 Correctness — script logic, connect/daemon flow, install resolution
- [x] D2 Security — token handling, gating of mutating/destructive/arbitrary verbs, patch consent
- [x] D3 Traceability — REQ-001..006 vs shipped artifacts, checklist evidence, reciprocal edges, doc/code drift
- [x] D4 Maintainability — house voice, structure parity, metadata hygiene

## Files Under Review

| File | Type | Notes |
|------|------|-------|
| `.opencode/skills/mcp-figma/SKILL.md` | runtime contract | router, gating, traps |
| `.opencode/skills/mcp-figma/scripts/_common.sh` | script | binary resolution, daemon paths |
| `.opencode/skills/mcp-figma/scripts/install.sh` | script | source selection, version gate |
| `.opencode/skills/mcp-figma/scripts/connect-safe.sh` | script | plugin connect (no patch) |
| `.opencode/skills/mcp-figma/scripts/connect-yolo.sh` | script | gated app.asar patch |
| `.opencode/skills/mcp-figma/scripts/daemon.sh` | script | daemon verb wrapper |
| `.opencode/skills/mcp-figma/scripts/doctor.sh` | script | read-only diagnostics |
| `.opencode/skills/mcp-figma/scripts/unpatch.sh` | script | yolo rollback |
| `.opencode/skills/mcp-figma/scripts/print-utcp-snippets.sh` | script | print-only MCP wiring |
| `.opencode/skills/mcp-figma/references/tool_surface.md` | reference | command gating taxonomy |
| `.opencode/skills/mcp-figma/references/mcp_wiring.md` | reference | optional MCP path |
| `.opencode/skills/mcp-figma/feature_catalog/feature_catalog.md` | catalog | capability inventory |
| `.opencode/skills/mcp-figma/graph-metadata.json` | metadata | schema-2 edges |
| `.../002-skill-build-and-registration/{spec,plan,tasks,checklist,implementation-summary}.md` | spec docs | traceability source |

## Cross-Reference Status

### Core (hard)
- `spec_code` — REQ-001..006 vs shipped artifacts: **pass** (6/6 resolve with evidence)
- `checklist_evidence` — 26 [x] items vs evidence: **partial** (CHK-013 voice-sweep claim is false against the artifact)

### Overlay (advisory)
- `skill_agent` — SKILL.md allowed-tools self-consistency: **pass** (no runtime agent; user-invocable skill)
- `feature_catalog_code` — catalog claims vs documented surface: **pass** (8 areas / 8 per-feature files, hedged as verify-with-help)
- `playbook_capability` — playbook scenarios vs executable verbs: **pass** (scenarios map to figma-ds-cli verbs)
- `agent_cross_runtime` — **N/A** (mcp-figma is a skill, not a runtime agent)

## Known Context

- `resource-map.md not present. Skipping coverage gate.`
- Sibling lineage `deepseek-v4-pro` (session-audit) returned PASS with 9 P2s and did NOT catch the voice-sweep contradiction. This lineage independently re-derived it.
- Parent spec continuity notes "dropped deleted-magicpath refs" but child spec-002 docs still cite mcp-magicpath, which is deleted.

## Review Boundaries

### Non-Goals
- No code or doc modification of the target (observation-only).
- No fixes; findings only.

### Stop Conditions
- All 4 dimensions covered + core protocols run + 1 stabilization pass with no new P0/P1.

## Next Focus

Synthesis complete. Verdict: CONDITIONAL (1 active P1, 5 active P2).
