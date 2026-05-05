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
    packet_pointer: "skilled-agent-orchestration/067-mcp-figma-transfer/002-public-figma-agent"
    last_updated_at: "2026-05-05T10:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Author decision-record.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:phase2-checklist-2026-05-05"
      session_id: "067-002-checklist-2026-05-05"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 2 — Public Figma Agent

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER — cannot claim Phase 2 done until complete |
| **[P1]** | Required OR documented user approval |
| **[P2]** | Optional |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Phase 1 commit `690b498 Figma MCP` verified on Barter main
- [ ] CHK-002 [P0] `Public/Figma/` doesn't already exist
- [ ] CHK-003 [P0] D9 + D10 captured in decision-record.md

## Sanitization (P0)

- [ ] CHK-010 [P0] `cp -r` Barter Figma → Public Figma succeeded
- [ ] CHK-011 [P0] `Public/Figma/context/` removed
- [ ] CHK-012 [P0] `Public/Figma/mcp servers/figma-mcp-stdio/node_modules/` removed (will rebuild)

## Structural Parity (Hook C)

- [ ] CHK-020 [P0] `Public/Figma/AGENTS.md` byte-equivalent to Barter (md5sum match)
- [ ] CHK-021 [P0] `Public/Figma/INSTALL_GUIDE.md` byte-equivalent to Barter
- [ ] CHK-022 [P0] All 5 knowledge base/*.md byte-equivalent to Barter
- [ ] CHK-023 [P0] `Public/Figma/Favicon.jpg` byte-equivalent (text marker)
- [ ] CHK-024 [P0] `Public/Figma/mcp servers/figma-mcp-http/{config-snippets.md, verify.sh}` byte-equivalent
- [ ] CHK-025 [P0] `Public/Figma/mcp servers/figma-mcp-stdio/{package.json, package-lock.json, install.sh, config-snippets.md}` byte-equivalent
- [ ] CHK-026 [P0] `Public/Figma/context/` ABSENT (per D9 scrub)
- [ ] CHK-027 [P0] `diff -rq Barter/MCP\ Agents/Figma/ Public/Figma/` — only context/ + README + node_modules differ

## README Divergence (Hook C continued)

- [ ] CHK-030 [P0] `Public/Figma/README.md` exists
- [ ] CHK-031 [P0] Public README diverges from Barter (NOT byte-equivalent)
- [ ] CHK-032 [P0] Public README preserves all section headings (TOC parity with Barter)
- [ ] CHK-033 [P0] Public README preserves architecture diagrams + Option A/B comparison tables
- [ ] CHK-034 [P0] Public README adjusts audience framing (open-source community, no internal Barter references)
- [ ] CHK-035 [P1] Public README size within ±15% of Public/ClickUp/README.md (~23K)

## npm install (P1)

- [ ] CHK-040 [P0] `npm install` in `Public/Figma/mcp servers/figma-mcp-stdio/` completes successfully
- [ ] CHK-041 [P0] `node_modules/figma-developer-mcp/` exists locally
- [ ] CHK-042 [P1] Bundle size ≤50MB (matches Barter ~48MB)
- [ ] CHK-043 [P0] `node_modules/` NOT staged for commit (gitignore enforcement)

## Public/README.md §8 patch (Hook D)

- [ ] CHK-050 [P0] D10 baseline investigated and resolved:
  - Actual `Public/*/` agent count documented
  - Pre-existing drift (Perplexity + Human Voice Rules unlisted) noted as out-of-scope
- [ ] CHK-051 [P0] TOC entry added: `8. [Figma Agent](#8-figma-agent)` under `#### 💬 MCP's Made Easy`
- [ ] CHK-052 [P0] §8 anchor section added: `<a id="8-figma-agent"></a>` + `### 🎨 8. Figma Agent`
- [ ] CHK-053 [P0] §8 section structure mirrors §7 ClickUp Agent (emoji + H3 + lead + smart-MCP-agent block + capabilities)
- [ ] CHK-054 [P0] §8 anchor link `#8-figma-agent` resolves (no broken link)
- [ ] CHK-055 [P0] Badge math reconciled: `Systems-N_Total` matches new TOC count
- [ ] CHK-056 [P1] Badge value confirmed (likely stays at 8 since Figma adds 8th TOC entry)

## Commits (P0)

- [ ] CHK-060 [P0] Commit 2 (`Figma MCP`) lands on AI_Systems/Public main with Figma/ folder staged
- [ ] CHK-061 [P0] Commit 2 includes ~15 tracked files (no node_modules/)
- [ ] CHK-062 [P0] Commit 3 (`Add Figma to README`) lands on AI_Systems/Public main with only README.md
- [ ] CHK-063 [P0] Both commit SHAs captured in implementation-summary.md
- [ ] CHK-064 [P1] Commits separable for clean rollback (Commit 2 = folder; Commit 3 = README)

## Opus Verification (P0)

- [ ] CHK-070 [P0] Opus Hook C dispatched (Barter↔Public diff)
- [ ] CHK-071 [P0] Opus Hook C returns PASS for all sub-checks (md5 parity, context/ absence, expected differences)
- [ ] CHK-072 [P0] Opus Hook D dispatched (Public README integrity)
- [ ] CHK-073 [P0] Opus Hook D returns PASS for all sub-checks (TOC count, anchor resolution, §8 structure, badge math)
- [ ] CHK-074 [P0] If FAIL: re-execute affected phase; re-verify

## Phase Handoff (P0)

- [ ] CHK-080 [P0] Phase 2 implementation-summary.md authored
- [ ] CHK-081 [P0] Phase 3 (003-mcp-figma-skill-removal) handoff criteria met:
  - Commits 2 + 3 SHAs recorded
  - All P0 checklist items green
  - Opus hooks C + D passed
  - AI_Systems/Public/Figma/ + Public/README.md §8 ready as the "after" state for Phase 3 deletion to reference
