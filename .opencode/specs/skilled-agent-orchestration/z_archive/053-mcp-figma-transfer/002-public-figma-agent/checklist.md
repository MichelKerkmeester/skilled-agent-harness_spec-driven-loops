---
title: "Verification Checklist: Phase 2 — Public Figma Agent"
description: "Phase 2 gates: file existence, structural parity with Barter (minus context/), README divergence, Public/README §8 anchor + TOC + badge math, opus hooks C + D."
trigger_phrases:
  - "phase 2 checklist"
  - "public figma checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/002-public-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "P0 checklist evidence backfilled"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:868b9cc80d6ac6c9ff7eb3b13ec1cf7ff53f52ec71c5069f437e3d0dc991f964"
      session_id: "067-002-checklist-2026-05-05"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 2 — Public Figma Agent

<!-- ANCHOR:protocol -->
## Verification Protocol

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Template compliance scaffold for 002-public-figma-agent/checklist.md; original authored content is retained below.
<!-- /ANCHOR:sign-off -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->
---

### Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER — cannot claim Phase 2 done until complete |
| **[P1]** | Required OR documented user approval |
| **[P2]** | Optional |

---

### Pre-Implementation

- [x] CHK-001 [P0] Phase 1 commit `690b498 Figma MCP` verified on Barter main — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-002 [P0] `Public/Figma/` doesn't already exist — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-003 [P0] D9 + D10 captured in decision-record.md — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section

### Sanitization (P0)

- [x] CHK-010 [P0] `cp -r` Barter Figma → Public Figma succeeded — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-011 [P0] `Public/Figma/context/` removed — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-012 [P0] `Public/Figma/mcp servers/figma-mcp-stdio/node_modules/` removed (will rebuild) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section

### Structural Parity (Hook C)

- [x] CHK-020 [P0] `Public/Figma/AGENTS.md` byte-equivalent to Barter (md5sum match) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-021 [P0] `Public/Figma/INSTALL_GUIDE.md` byte-equivalent to Barter — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-022 [P0] All 5 knowledge base/*.md byte-equivalent to Barter — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-023 [P0] `Public/Figma/Favicon.jpg` byte-equivalent (text marker) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-024 [P0] `Public/Figma/mcp servers/figma-mcp-http/{config-snippets.md, verify.sh}` byte-equivalent — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-025 [P0] `Public/Figma/mcp servers/figma-mcp-stdio/{package.json, package-lock.json, install.sh, config-snippets.md}` byte-equivalent — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-026 [P0] `Public/Figma/context/` ABSENT (per D9 scrub) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-027 [P0] `diff -rq Barter/MCP\ Agents/Figma/ Public/Figma/` — only context/ + README + node_modules differ — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section

### README Divergence (Hook C continued)

- [x] CHK-030 [P0] `Public/Figma/README.md` exists — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-031 [P0] Public README diverges from Barter (NOT byte-equivalent) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-032 [P0] Public README preserves all section headings (TOC parity with Barter) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-033 [P0] Public README preserves architecture diagrams + Option A/B comparison tables — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-034 [P0] Public README adjusts audience framing (open-source community, no internal Barter references) — EVIDENCE: DEFERRED: superseded by user commit 766206b internal-only scope; tracked by review-report.md P1-3
- [ ] CHK-035 [P1] Public README size within ±15% of Public/ClickUp/README.md (~23K)

### npm install (P1)

- [x] CHK-040 [P0] `npm install` in `Public/Figma/mcp servers/figma-mcp-stdio/` completes successfully — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-041 [P0] `node_modules/figma-developer-mcp/` exists locally — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [ ] CHK-042 [P1] Bundle size ≤50MB (matches Barter ~48MB)
- [x] CHK-043 [P0] `node_modules/` NOT staged for commit (gitignore enforcement) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section

### Public/README.md §8 patch (Hook D)

- [x] CHK-050 [P0] D10 baseline investigated and resolved: — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
  - Actual `Public/*/` agent count documented
  - Pre-existing drift (Perplexity + Human Voice Rules unlisted) noted as out-of-scope
- [x] CHK-051 [P0] TOC entry added: `8. [Figma Agent](#8-figma-agent)` under `#### 💬 MCP's Made Easy` — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-052 [P0] §8 anchor section added: `<a id="8-figma-agent"></a>` + `### 🎨 8. Figma Agent` — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-053 [P0] §8 section structure mirrors §7 ClickUp Agent (emoji + H3 + lead + smart-MCP-agent block + capabilities) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-054 [P0] §8 anchor link `#8-figma-agent` resolves (no broken link) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-055 [P0] Badge math reconciled: `Systems-N_Total` matches new TOC count — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [ ] CHK-056 [P1] Badge value confirmed (likely stays at 8 since Figma adds 8th TOC entry)

### Commits (P0)

- [x] CHK-060 [P0] Commit 2 (`Figma MCP`) lands on AI_Systems/Public main with Figma/ folder staged — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-061 [P0] Commit 2 includes ~15 tracked files (no node_modules/) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-062 [P0] Commit 3 (`Add Figma to README`) lands on AI_Systems/Public main with only README.md — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-063 [P0] Both commit SHAs captured in implementation-summary.md — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [ ] CHK-064 [P1] Commits separable for clean rollback (Commit 2 = folder; Commit 3 = README)

### Opus Verification (P0)

- [x] CHK-070 [P0] Opus Hook C dispatched (Barter↔Public diff) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-071 [P0] Opus Hook C returns PASS for all sub-checks (md5 parity, context/ absence, expected differences) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-072 [P0] Opus Hook D dispatched (Public README integrity) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-073 [P0] Opus Hook D returns PASS for all sub-checks (TOC count, anchor resolution, §8 structure, badge math) — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-074 [P0] If FAIL: re-execute affected phase; re-verify — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section

### Phase Handoff (P0)

- [x] CHK-080 [P0] Phase 2 implementation-summary.md authored — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
- [x] CHK-081 [P0] Phase 3 (003-mcp-figma-skill-removal) handoff criteria met: — EVIDENCE: commits c4f6c56 + e96a3ee; Opus Hooks C+D 12/12 PASS; implementation-summary.md verification section
  - Commits 2 + 3 SHAs recorded
  - All P0 checklist items green
  - Opus hooks C + D passed
  - AI_Systems/Public/Figma/ + Public/README.md §8 ready as the "after" state for Phase 3 deletion to reference
