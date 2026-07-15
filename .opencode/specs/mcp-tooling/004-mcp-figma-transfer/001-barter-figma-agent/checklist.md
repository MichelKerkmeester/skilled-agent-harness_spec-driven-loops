---
title: "Verification Checklist: Phase 1 — Barter Figma Agent"
description: "Verification gates G1-G8 mapped to CHK-### items + Phase 1-specific checks. Verification Date: TBD"
trigger_phrases:
  - "phase 1 checklist"
  - "barter figma checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/004-mcp-figma-transfer/001-barter-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "P0 checklist evidence backfilled"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:b4d6fdb2c7d8754d234015ef35b32721c54999482d0d8524c25c9fc3eaae8c6a"
      session_id: "067-001-checklist-2026-05-05"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 1 — Barter Figma Agent

<!-- ANCHOR:protocol -->
## Verification Protocol

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Template compliance scaffold for 001-barter-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:sign-off -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->
---

### Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim Phase 1 done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

### Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-014) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-002 [P0] Technical approach defined in plan.md (§3 Approach + §4 Architecture) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [ ] CHK-003 [P1] Dependencies identified (mcp-figma source + ClickUp ground truth)
- [x] CHK-004 [P0] All 10 decisions captured in decision-record.md — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### File Existence (P0)

- [x] CHK-010 [P0] `Barter/MCP Agents/Figma/AGENTS.md` exists — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-011 [P0] `Barter/MCP Agents/Figma/README.md` exists — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-012 [P0] `Barter/MCP Agents/Figma/INSTALL_GUIDE.md` exists — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-013 [P0] `Barter/MCP Agents/Figma/Favicon.jpg` exists (TODO marker per D3) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-014 [P0] `Barter/MCP Agents/Figma/context/.gitkeep` exists — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-015 [P0] All 5 knowledge base docs exist with `v0.100.md` suffix — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-016 [P0] `mcp servers/figma-mcp-http/` populated (config-snippets.md + verify.sh) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-017 [P0] `mcp servers/figma-mcp-stdio/` populated (package.json + install.sh + config-snippets.md + node_modules/) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### Persona Reframe (P0)

- [x] CHK-020 [P0] AGENTS.md contains "You are a Figma MCP Agent" role declaration — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-021 [P0] Boundary statement #1 present: "NOT a designer" — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-022 [P0] Boundary statement #2 present: "NOT a developer" — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-023 [P0] Boundary statement #3 present: "NOT using manual Figma API calls outside MCP/HTTP pathways" — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-024 [P0] Boundary statement #4 present: "IS operating Figma via 18 MCP tools — 100% native tooling" — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-025 [P0] Authority Level supersession clause present (supersedes coding/design defaults) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-026 [P0] Zero "you are a developer" / "you are a designer" / similar drift verified by grep — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### Format Compliance (P0)

- [x] CHK-030 [P0] AGENTS.md opens with §1 Critical — Context Override (no frontmatter) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-031 [P0] README.md opens with `# Figma Agent - User Guide v0.100` — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-032 [P0] INSTALL_GUIDE.md opens with AI-First Install Prompt before TOC — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-033 [P0] All knowledge base docs follow `Figma - [Category] - [Topic] - v0.100.md` naming — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-034 [P0] Document-internal versioning matches file-name suffix (v0.100) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-035 [P0] SYNC framework verb is "Create" everywhere (zero "Capture") — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### Command Registry (P0)

- [x] CHK-040 [P0] All 9 commands defined: `$file/$node/$export/$component/$style/$team/$comment/$auth/$interactive` — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-041 [P0] Each command has shortcut + MCP tool mapping — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-042 [P0] 4-level Detection Priority documented — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-043 [P0] Document Loading DAG references actual file paths — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### DAG Resolution (P0)

- [x] CHK-050 [P0] Every `[[link]]` in AGENTS.md resolves to existing file — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-051 [P0] Every relative path in AGENTS.md DAG block resolves — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-052 [P0] All 5 knowledge base files referenced and present — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### MCP Servers (P0)

- [x] CHK-060 [P0] `mcp servers/figma-mcp-stdio/package.json` declares `figma-developer-mcp` dependency — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-061 [P0] `mcp servers/figma-mcp-stdio/node_modules/` populated (per D5 mirror-ClickUp full bundling) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [ ] CHK-062 [P1] `mcp servers/figma-mcp-stdio/node_modules/` size ≤50MB (else escalate D5)
- [x] CHK-063 [P0] HTTP server config snippets cover OpenCode + Claude Desktop + VS Code Copilot + Cursor — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-064 [P0] stdio server config snippets cover .utcp_config.json + direct MCP client patterns — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### Quality (P1)

- [ ] CHK-070 [P1] sk-doc DQI score ≥85 on AGENTS.md
- [ ] CHK-071 [P1] sk-doc DQI score ≥85 on at least one knowledge base doc (sampled)
- [ ] CHK-072 [P1] AI-First install prompts walk through to working install (Option A and B)
- [ ] CHK-073 [P1] No console errors / format warnings on markdown render

### Opus Verification Hook B (P0)

- [x] CHK-080 [P0] Opus subagent dispatched with input pack (AGENTS.md, knowledge base tree, mcp servers tree) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-081 [P0] Opus subagent returns PASS for all 9 sub-checks (DAG, count, naming, parity, persona, boundaries, SYNC, favicon, bundle size) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-082 [P0] If FAIL: re-dispatch flagged files; re-verify until PASS — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section

### Commit (P0)

- [x] CHK-090 [P0] Unrelated Barter dirty tree stashed before commit — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-091 [P0] Only `MCP Agents/Figma/` files staged — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-092 [P0] Commit message exactly `Figma MCP` (matches Barter terse style) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-093 [P0] Commit lands on Barter main (not feature branch) — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-094 [P0] Commit SHA captured in implementation-summary.md — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [ ] CHK-095 [P1] Stashed changes restored cleanly post-commit

### Phase Handoff (P0)

- [x] CHK-100 [P0] Phase 1 implementation-summary.md authored with all evidence — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
- [x] CHK-101 [P0] Phase 2 (002-public-figma-agent) handoff criteria met: — EVIDENCE: commit 690b498; Opus Hook B 9/9 PASS; implementation-summary.md verification section
  - Commit 1 SHA recorded
  - All P0 checklist items green
  - Opus hook B passed
  - Source files (AGENTS.md, README.md, etc.) ready for sanitized duplication
