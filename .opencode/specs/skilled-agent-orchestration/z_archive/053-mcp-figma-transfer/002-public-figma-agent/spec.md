---
title: "Feature Specification: Phase 2 — Dual-publish Figma agent to AI_Systems/Public"
description: "Sanitized duplicate of Phase 1's Barter Figma agent into AI_Systems/Public/Figma/ (root level). Drop context/ per ClickUp scrub pattern. Scope Public/Figma for internal Barter use, dual-published to Public AI Systems for cross-team visibility. Patch Public/README.md to add §8 Figma Agent anchor + TOC entry."
trigger_phrases:
  - "public-figma-agent"
  - "phase 2 figma"
  - "AI_Systems Public Figma"
  - "Public README §8"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/002-public-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files:
      - "AI_Systems/Public/Figma/README.md"
      - "AI_Systems/Public/README.md"
    session_dedup:
      fingerprint: "sha256:c2c0cfa452b21cd689583bb63f0458cfa7493c906522451e70cbe949414c08b2"
      session_id: "067-002-spec-2026-05-05"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "D9 (Public duplicate scrub): drop context/, allow README divergence — confirmed by ClickUp Barter↔Public diff"
      - "D10 (Public README badge): pre-existing folder/TOC drift left out of scope; Figma becomes 8th TOC entry; badge stays at 8"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Dual-publish Figma agent to AI_Systems/Public

## EXECUTIVE SUMMARY

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

<!-- ANCHOR:metadata -->
## 1. METADATA

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:risks -->

## 7. NON-FUNCTIONAL REQUIREMENTS

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

## 8. EDGE CASES

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

## 9. COMPLEXITY ASSESSMENT

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

## 10. RISK MATRIX

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

## 11. USER STORIES

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

Template compliance scaffold for 002-public-figma-agent/spec.md; original authored content is retained below.

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-barter-figma-agent (commit 690b498 on Barter main) |
| **Successor** | 003-mcp-figma-skill-removal |
| **Handoff Criteria** | Public Figma folder mirrors Barter (minus context/); Public README §8 anchor resolves; opus hooks C+D pass; 2 commits on AI_Systems/Public main |

---

### 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 produced an internal-team-framed Barter Figma agent (commit 690b498 with 16 files, ~234K markdown). The `AI_Systems/Public` repo needs a parallel agent for internal Barter scope, dual-published for cross-team visibility. The two repos diverge on the `context/` folder (Barter ships user-specific assets; Public doesn't), while Public/Figma should preserve internal Barter positioning after user commit `766206b`. The Public AI Systems index `README.md` needs a §8 entry to register the new agent in the shared internal catalog.

### Purpose
Stand up a sanitized internal Barter-scope duplicate of the Barter Figma agent at `AI_Systems/Public/Figma/` (root level — no `MCP Agents/` parent, matching Public's flat agent layout) and register it in `AI_Systems/Public/README.md` so cross-team users discover + install + use the Figma MCP Agent.

---

### 3. SCOPE

### In Scope
- `cp -r` Barter Figma → Public Figma (excluding `context/`)
- Scope Public Figma `README.md` for internal Barter use, dual-published to Public AI Systems for cross-team visibility
- Run `npm install` in Public Figma's `figma-mcp-stdio/` (gitignored, per Phase 1 ADR-005 revised)
- Patch `AI_Systems/Public/README.md`: add §8 Figma Agent anchor + TOC entry
- Two commits on AI_Systems/Public main: `Figma MCP` + `Add Figma to README`

### Out of Scope
- Phase 1 Barter authoring (already complete: commit 690b498)
- Phase 3 skill deletion + cross-ref patches in Code_Environment/Public
- Pre-existing Public folder/TOC drift (Perplexity + Human Voice Rules unlisted) — per D10
- Public/Figma's `Favicon.jpg` real image — D3 defer carries forward
- Public/Figma's `context/` — DROPPED per D9 ClickUp scrub pattern

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AI_Systems/Public/Figma/AGENTS.md` | Create | Byte-equivalent to Barter |
| `AI_Systems/Public/Figma/README.md` | Create | Scoped for internal Barter use, dual-published to Public AI Systems for cross-team visibility |
| `AI_Systems/Public/Figma/INSTALL_GUIDE.md` | Create | Byte-equivalent to Barter |
| `AI_Systems/Public/Figma/Favicon.jpg` | Create | TODO marker (matches Barter state) |
| `AI_Systems/Public/Figma/knowledge base/system/*.md` | Create | 3 docs, byte-equivalent |
| `AI_Systems/Public/Figma/knowledge base/integrations/*.md` | Create | 1 doc, byte-equivalent |
| `AI_Systems/Public/Figma/knowledge base/reference/*.md` | Create | 1 doc, byte-equivalent |
| `AI_Systems/Public/Figma/mcp servers/figma-mcp-http/*` | Create | 2 files, byte-equivalent |
| `AI_Systems/Public/Figma/mcp servers/figma-mcp-stdio/{package.json,package-lock.json,install.sh,config-snippets.md}` | Create | Byte-equivalent (no node_modules per gitignore) |
| `AI_Systems/Public/README.md` | Modify | Add §8 Figma Agent anchor + TOC entry |

**EXPLICITLY ABSENT from Public:** `context/` folder.

---

### 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Public Figma folder structure mirrors Barter Figma minus `context/` | `diff -rq` shows only `context/` absent + README diverges + node_modules absent |
| REQ-002 | Public Figma `README.md` scoped for internal Barter use, dual-published to Public AI Systems for cross-team visibility | Internal-only scope is explicit; no public release positioning remains |
| REQ-003 | All knowledge base + AGENTS + INSTALL_GUIDE byte-equivalent | md5sum matches Barter |
| REQ-004 | Public/README.md §8 Figma Agent anchor section added | Mirrors §7 ClickUp Agent format |
| REQ-005 | Public/README.md TOC entry added | `8. [Figma Agent](#8-figma-agent)` under "💬 MCP's Made Easy" |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Public README badge math reconciled | Badge = TOC count after Figma added |
| REQ-011 | Pre-existing folder/TOC drift documented | Note in implementation-summary.md; recommend separate cleanup packet |
| REQ-012 | npm install completes for Public/Figma/figma-mcp-stdio/ | 131 packages, ~48MB, NOT committed |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Update existing Public anchor numbering if shifts | Only if §8 insertion shifts existing — likely not |

---

### 5. SUCCESS CRITERIA

- **SC-001**: `Public/Figma/` exists with all expected files
- **SC-002**: AGENTS/INSTALL_GUIDE/knowledge base/mcp servers files BYTE-EQUIVALENT to Barter (`md5sum` match)
- **SC-003**: Public Figma README diverges intentionally for internal Barter scope, dual-published to Public AI Systems for cross-team visibility
- **SC-004**: Public/README.md TOC count = badge count after patch
- **SC-005**: §8 Figma Agent anchor link `#8-figma-agent` resolves
- **SC-006**: Two commits on AI_Systems/Public main (`Figma MCP` + `Add Figma to README`)
- **SC-007**: Opus hooks C + D pass

---

### 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 Barter commit 690b498 | If reverted, Public diverges | Read from Barter working tree, not commit |
| Risk | cli-codex README rewrite over-strips | Loses Option A/B nuance | Constrain prompt: preserve sections + diagrams |
| Risk | Badge investigation surfaces deeper drift | Scope creep | Per D10, leave pre-existing drift OUT OF SCOPE |
| Dependency | AI_Systems/Public separate git repo | Commits run from Public's tree | Use `git -C "/Users/.../AI_Systems/Public"` |
| Risk | npm install drift vs Barter | Different package versions | Copy package-lock.json from Barter |

---

### 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| **Performance** | Public/README.md remains <100K (8K + ~1K for §8) |
| **Maintainability** | Public Figma README diverges minimally from Barter |
| **Compatibility** | Same as Phase 1 — Claude Desktop / OpenCode / VS Code Copilot / Cursor |
| **Internal Barter scope** | Public/Figma keeps internal-only positioning while remaining dual-published to Public AI Systems for cross-team visibility |

---

### 8. EDGE CASES

| Scenario | Expected Behavior |
|----------|-------------------|
| `cp -r` overwrites existing Public/Figma/ | Should not happen — verify folder doesn't exist before cp |
| Public/Figma/Favicon.jpg already binary | Replace with text marker |
| Public/README.md line-ending issues | Preserve LF/CRLF as-is; only modify TOC + new section |
| Anchor numbering collision | §8 is next after §7; no collision |

---

### 9. COMPLEXITY ASSESSMENT

| Dimension | Score (0-3) | Note |
|-----------|-------------|------|
| Domain Count | 1 | Public AI Systems repo only |
| File Count | 2 | ~15 files copy + 1 README patch |
| LOC Estimate | 1 | Mostly cp + 1 README rewrite |
| Parallel Opportunity | 1 | cp sequential; README single cli-codex |
| Task Type | 1 | Trivial duplication + minor rewrite |
| **Total** | **6/15** | Lower than Phase 1 |

---

### 10. EFFORT ESTIMATION

| Activity | Estimate |
|----------|----------|
| Spec docs authoring | ~15 min |
| cp + sanitize | ~5 min |
| cli-codex README rewrite | ~5-10 min |
| npm install | ~2 min |
| Public/README §8 patch | ~10 min |
| Opus hooks C + D | ~10 min |
| Commits ×2 | ~5 min |
| **Total** | **~50-60 min** |

---

### 11. OPEN QUESTIONS

(D9 + D10 resolved at parent level. No blocking questions.)

---

### RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Phase 1 implementation summary**: `../001-barter-figma-agent/implementation-summary.md`
- **Phase 1 commit**: AI_Systems/Barter `690b498 Figma MCP`
- **Plan**: `./plan.md`
- **Tasks**: `./tasks.md`
- **Checklist**: `./checklist.md`
- **Decision Record**: `./decision-record.md`
