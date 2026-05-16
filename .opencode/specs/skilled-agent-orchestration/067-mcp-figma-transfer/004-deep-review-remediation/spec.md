---
title: "Feature Specification: Phase 4 — Deep Review Remediation"
description: "Phase 4 deep-review remediation docs and job reports for 067-mcp-figma-transfer."
trigger_phrases:
  - "067 phase 4 remediation"
  - "deep review remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/067-mcp-figma-transfer/004-deep-review-remediation"
    last_updated_at: "2026-05-05T12:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Job3 report authored"
    next_safe_action: "Review phase closeout"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/067-mcp-figma-transfer/004-deep-review-remediation/job3-report.md"
    session_dedup:
      fingerprint: "sha256:3e802f990a3100550e63791b5845b7f0af289757de303a1deacef1a7a35e7832"
      session_id: "067-004-spec-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Phase 4 remediation contract section for spec.md.
<!-- /ANCHOR:questions -->

### Original Authored Content

---

### 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-mcp-figma-skill-removal |
| **Successor** | None (final closeout) |
| **Handoff Criteria** | All P0 (R-001/002/003) resolved + all P1 (R-004 through R-016) resolved + child --strict validators exit 0 |
---

### Phase Context

This is **Phase 4** — remediation for findings from the 7-iteration deep review documented in `../review/review-report.md`. The review surfaced 3 P0, 13 P1, and 5 P2 findings — most being documentation drift after the user's manual scope-revert commit `766206b` and post-Phase-3 follow-up commits not back-propagated into formal phase docs.

**Scope Boundary:** Documentation hygiene + dead-link cleanup + child spec validator compliance. NO new feature work; NO advisor scoring changes; NO cross-repo restructuring.

**Source of truth:** `../review/review-report.md` §3 (P0), §4 (P1), §5 (P2), §8 (R-001 through R-021).
---

### 2. PROBLEM & PURPOSE

### Problem Statement
The 067-mcp-figma-transfer packet shipped 7 commits across 3 repos with functional implementation work, but follow-up commits (`66e1e87`, `766206b`, `b03bf7563`, `bdb739d97`) introduced state changes that were not propagated into formal phase docs. The deep review's adversarial pass also surfaced dead cross-references created when the mcp-figma skill was deleted.

### Purpose
Bring all formal Phase 1/2/3 docs into alignment with the actual repo state, fix the 3 child --strict validator failures, restore checked-state P0 checklist items with evidence, and clean up dead links + symlinks created by the skill deletion.
---

### 3. SCOPE

### In Scope
- Child --strict validator compliance (all 3 phase children → exit 0)
- P0 checklist evidence (mark `[x]` with concrete citations)
- `review/deep-review-state.jsonl` + `review/deep-review-strategy.md` backfill
- Install guide env var prefix fix (× 2 repos)
- Implementation-summary commit ledger updates (× 3 phases)
- D9 supersession formalization in Phase 2
- ADR Decision Index sync (Phase 2 → Phase 3 ADR-014)
- Skill index + install_guides count reconciliation
- ADR-005 body rewrite to match revised state
- Hook F status update (1 failure not 3)
- Broken symlink + dead link cleanup
- Public Figma INSTALL_GUIDE cwd path fix
- Barter+Public AGENTS.md byte-equivalence restore

### Out of Scope
- New features
- Re-tuning advisor scoring (already done)
- 069-sk-code-motion-dev sk-code `kind: "reference-category"` fix (that packet's territory)
- Telemetry purge (P2 optional, may defer)

### Files to Change

See `../review/review-report.md` §3-5 for full per-finding affected file list. Roughly:

- 3 children × 6 spec docs = 18 files (P0-1 + P0-2 + P0-3 work)
- 2 INSTALL_GUIDE.md (P1-1)
- 3 implementation-summary.md (P1-2, P1-5, P1-9)
- Phase 2 spec.md, decision-record.md, implementation-summary.md (P1-3, P1-4)
- `.opencode/skills/README.md` (P1-6)
- `.opencode/install_guides/README.md, SET-UP - AGENTS.md` (P1-7)
- Phase 1 decision-record.md ADR-005 body (P1-8)
- 2 Figma READMEs + 2 Combined Workflows KB docs (P1-11)
- `.opencode/install_guides/MCP - Figma.md` symlink (P1-10)
- Public Figma INSTALL_GUIDE.md, config-snippets.md (P1-12)
- Barter Figma AGENTS.md (P1-13 — apply 766206b's change)
- 2 KB MCP Knowledge docs (P2-1)
- 2 System Prompt KB docs (P2-4)

**Roughly 30-35 files touched. Mostly small edits.**
---

### 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Child --strict validators exit 0 | `bash .../validate.sh <child> --strict` exits 0 for all 3 phase children |
| REQ-002 | P0 checklist items `[x]` with evidence | All P0 items in 3 children's checklist.md marked `[x]` with file:line or command output evidence |
| REQ-003 | review/deep-review-state.jsonl backfilled | 7 iteration records appended with proper findingsNew/dimensionsCovered fields; strategy.md Completed Dimensions table populated |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Install-guide env var prefix correct | `${figma_FIGMA_API_KEY}` in lines 341-365 of both repos' INSTALL_GUIDE.md |
| REQ-005 | Implementation-summary ledgers complete | All 3 phases list every relevant commit SHA |
| REQ-006 | D9 supersession formalized | ADR-009 marked superseded; Phase 2 spec.md + implementation-summary scope reflects internal-only |
| REQ-007 | Phase 2 ADR Decision Index includes ADR-014 | Table at decision-record.md updated |
| REQ-008 | Phase 3 ledger has Commit 5b row | `7307e056d` listed |
| REQ-009 | Skill index counts reconciled | Both line 44 and line 54 show same correct count |
| REQ-010 | install_guides counts reconciled | All count occurrences across 2 files match actual |
| REQ-011 | ADR-005 body matches revised state | Decision/Consequences sections describe gitignored-pattern, not committed node_modules |
| REQ-012 | Hook F status updated | Phase 3 implementation-summary + parent map say 1 failure, not 3 |
| REQ-013 | Broken symlink removed | `.opencode/install_guides/MCP - Figma.md` deleted; install_guides/README.md:83 cleaned |
| REQ-014 | Dead source-skill links removed | Both Figma READMEs (line 674-677) + Combined Workflows KB don't reference deleted mcp-figma |
| REQ-015 | Public Figma INSTALL_GUIDE cwd correct | Public path, not Barter path, in lines 401-414 |
| REQ-016 | Barter+Public AGENTS.md byte-equivalent | `cmp -s` on both files exits 0 |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-017 | Token placeholder canonical | `figd_your_token_here` (not `figd_your_token`) in 2 KB MCP Knowledge docs |
| REQ-018 | Optional handover.md for parent | If user requests; otherwise defer |
| REQ-019 | Telemetry retention decision | Final answer documented; purge optional |
| REQ-020 | System Prompt KB orphan reference fix | Replace `references/tool_reference.md` with correct path |
| REQ-021 | verify.sh + INSTALL_GUIDE alignment | Either restate script's actual behavior in install guide OR extend script |
---

### 5. SUCCESS CRITERIA

- **SC-001:** All 3 P0 requirements met → all child --strict validators green
- **SC-002:** All 13 P1 requirements met → no stale formal docs
- **SC-003:** Spec packet validates --strict (recursive) exits 0
- **SC-004:** Re-running deep-review iteration 7 (sanity check) finds no new findings
- **SC-005:** Cross-repo state aligned: Barter+Public Figma byte-equivalent for AGENTS.md; INSTALL_GUIDE paths correct in each repo's context
---

### RELATED DOCUMENTS

- **Source of remediation list:** `../review/review-report.md`
- **Parent spec:** `../spec.md`
- **Plan:** `./plan.md`
- **Tasks:** `./tasks.md`
- **Checklist:** `./checklist.md`
