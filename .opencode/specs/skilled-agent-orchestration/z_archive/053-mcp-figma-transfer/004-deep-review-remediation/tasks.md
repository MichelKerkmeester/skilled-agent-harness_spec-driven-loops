---
title: "Tasks: Phase 4 — Deep Review Remediation"
description: "Phase 4 deep-review remediation docs and job reports for 067-mcp-figma-transfer."
trigger_phrases:
  - "067 phase 4 remediation"
  - "deep review remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/004-deep-review-remediation"
    last_updated_at: "2026-05-05T12:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Job3 report authored"
    next_safe_action: "Review phase closeout"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/004-deep-review-remediation/job3-report.md"
    session_dedup:
      fingerprint: "sha256:1d26cb530a73e7b8aa9581c93eb6e9950bbdab75279ec3fcd9963edecc695fdd"
      session_id: "067-004-tasks-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4 — Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

Phase 4 remediation contract section for tasks.md.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

Phase 4 remediation contract section for tasks.md.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

Phase 4 remediation contract section for tasks.md.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

Phase 4 remediation contract section for tasks.md.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Phase 4 remediation contract section for tasks.md.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

Phase 4 remediation contract section for tasks.md.
<!-- /ANCHOR:cross-refs -->

### Original Authored Content

---

### Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |

---

### Phase 4A — P0 Blockers (BLOCKING)

- [ ] **T010 [P0]** R-001: Add TEMPLATE_SOURCE + TEMPLATE_HEADERS + ANCHORS_VALID + FRONTMATTER_MEMORY_BLOCK keys to all child spec docs (3 children × 6 docs = 18 files). Re-run validate.sh --strict and confirm exit 0.
- [ ] **T020 [P0]** R-002: Mark all P0 checklist items `[x]` with EVIDENCE citation across 3 phase children's checklist.md.
- [ ] **T030 [P0]** R-003: Backfill review/deep-review-state.jsonl with 7 iteration records (id, dimension, findingsNew P0/P1/P2 counts, dimensionsCovered, timestamp). Update review/deep-review-strategy.md Completed Dimensions table.

### Phase 4B — P1 Required (must complete or document deferral)

- [ ] **T040 [P1]** R-004: Edit Barter + Public INSTALL_GUIDE.md:341-365 — env var to `${figma_FIGMA_API_KEY}` (currently unprefixed `${FIGMA_API_KEY}`).
- [ ] **T050 [P1]** R-005: Update 3 implementation-summary.md "Cumulative commit ledger" tables with all relevant SHAs (66e1e87, 766206b, b03bf7563, bdb739d97 missing in various phase ledgers).
- [ ] **T060 [P1]** R-006: Add tombstone/supersession to ADR-009 in Phase 2 decision-record.md; update Phase 2 spec.md scope to reflect internal-only; update Phase 2 implementation-summary description + outcome §1-3.
- [ ] **T070 [P1]** R-007: Update Phase 2 decision-record.md Decision Index to include ADR-014.
- [ ] **T080 [P1]** R-008: Insert Commit 5b row (`7307e056d`) in Phase 3 implementation-summary §7 ledger table.
- [ ] **T090 [P1]** R-009: Reconcile `.opencode/skills/README.md` skill counts — line 44 (says 21) and line 54 (says 16) should both report actual count = 17.
- [ ] **T100 [P1]** R-010: Reconcile install_guides counts in both `README.md` (lines 1453, 1464) and `SET-UP - AGENTS.md` (lines 523, 525-532, 975, 1000). Re-derive correct counts.
- [ ] **T110 [P1]** R-011: Rewrite ADR-005 Decision/Consequences body in Phase 1 decision-record.md to match the gitignored-node_modules pattern (currently body still says "Full bundling — node_modules committed").
- [ ] **T120 [P1]** R-012: Update Phase 3 implementation-summary.md (lines 3, 15, 103-111 + frontmatter) to reflect Hook F current state: 295/296 with 1 failure (sk-code drift), not 3 failures. Same in parent spec.md:104.
- [ ] **T130 [P1]** R-013: Delete `.opencode/install_guides/MCP - Figma.md` symlink (target deleted). Remove install_guides/README.md:83 entry.
- [ ] **T140 [P1]** R-014: Remove dead source-skill links (lines 674-677 in both Barter + Public Figma READMEs); same in `Figma - Reference - Combined Workflows - v0.100.md:1068-1070`.
- [ ] **T150 [P1]** R-015: Fix Public Figma INSTALL_GUIDE.md:401-414 cwd path (currently Barter path) to use Public path. Same in `Public/Figma/mcp servers/figma-mcp-stdio/config-snippets.md:112-127`.
- [ ] **T160 [P1]** R-016: Apply user `766206b`'s heading change to Barter Figma AGENTS.md (line 181: `### Step 7 Detail: Figma Operations Pipeline` → `### Figma Operations Pipeline`) so Barter+Public agree byte-equivalently.

### Phase 4C — P2 Optional

- [ ] **T170 [P2]** R-017: s/figd_your_token/figd_your_token_here/ at line 433 of both KB MCP Knowledge docs (Barter + Public).
- [ ] **T180 [P2]** R-018: (Optional) Author parent-level handover.md — defer unless user requests.
- [ ] **T190 [P2]** R-019: (Optional) Telemetry purge — defer; preserve per D2 spirit.
- [ ] **T200 [P2]** R-020: System Prompt KB doc `references/tool_reference.md` orphan ref → replace with `knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md`.
- [ ] **T210 [P2]** R-021: Either update INSTALL_GUIDE.md:606 to match verify.sh actual behavior, or extend verify.sh to actually probe MCP protocol.

### Phase 4D — Verification

- [ ] **T220 [P0]** Run `bash validate.sh --strict` on all 3 children + parent → all exit 0.
- [ ] **T230 [P0]** Re-run deep-review final iteration check → no new findings.
- [ ] **T240 [P0]** `git -C` for each repo → confirm clean main branch + new commits landed.

### Phase 4E — Commits (per repo, scoped)

- [ ] **T250 [P0]** Commit Code_Environment/Public phase-4 spec docs + child fixes + install guide patches + parent map updates → 1 commit.
- [ ] **T260 [P0]** Commit Barter Figma AGENTS.md byte-equivalence + dead-link cleanups → 1 commit.
- [ ] **T270 [P0]** Commit Public Figma INSTALL_GUIDE cwd fix + dead-link cleanups → 1 commit.

---

### Estimated wall-clock

| Phase | Time |
|---|---|
| 4A (P0, 3 tasks) | 30-45 min |
| 4B (P1, 13 tasks) | 60-90 min |
| 4C (P2, 5 tasks) | 15-20 min |
| 4D (verification) | 10 min |
| 4E (3 commits) | 5 min |
| **Total** | **~2-2.5 hours** |
