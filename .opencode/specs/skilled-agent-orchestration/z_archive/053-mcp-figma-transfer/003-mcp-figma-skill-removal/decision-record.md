---
title: "Decision Record: Phase 3 — Remove mcp-figma skill"
description: "Phase 3-specific ADRs: D1 (Code Mode keep+strip), D2 (spec history preserved), D6 (advisor cleanup atomicity), D8 (re-grep at execution start)."
trigger_phrases:
  - "phase 3 decisions"
  - "mcp-figma removal adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/003-mcp-figma-skill-removal"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Decision doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0fc79ded0edf02315d76f4eff24b70f5815a5c80aa219b4944b99f07b68addec"
      session_id: "067-003-dr-2026-05-05"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "D1 captured as ADR-011"
      - "D2 captured as ADR-012"
      - "D6 captured as ADR-013"
      - "D8 captured as ADR-014"
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 3 — Remove mcp-figma skill

<!-- ANCHOR:adr-001 -->
## ADR-001: Template Compliance Record

<!-- ANCHOR:adr-001-context -->
### Context

Phase 4 normalized this decision record to the active v2.2 template contract while preserving authored ADR content below.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Keep the original phase decisions intact and add the required retrieval anchors for strict validation.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Leaving the document unanchored was rejected because child strict validation is a P0 release gate.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

The document now has validator-compatible anchors; original ADR numbering remains in the preserved content below.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

- Clarity: Template contract is explicit.
- Systems: No implementation behavior changes.
- Bias: Historical ADR content is preserved.
- Sustainability: Future strict validation can locate anchors.
- Scope: Phase 4 only remediates P0 documentation gates.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

Applied during Phase 4 Job 3 for 003-mcp-figma-skill-removal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->
> Phase 3 owns D1 + D2 + D6 + D8. Cross-cutting ADRs from Phase 1 + Phase 2 are referenced; full ADR set in `../001-barter-figma-agent/decision-record.md` and `../002-public-figma-agent/decision-record.md`.

---

### ADR-011: Code Mode keeps figma-developer-mcp tool refs; strip 4 skill-name refs (D1)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
The `mcp-code-mode` skill at `Code_Environment/Public/.opencode/skills/mcp-code-mode/` is a separate skill that orchestrates external MCP tools via Code Mode. It uses Figma as a worked example throughout — 127 references to `figma-developer-mcp` (the npm package), `figma.figma_<tool>` invocation patterns, OAuth/HTTP `mcp.figma.com` configs, `FIGMA_API_KEY` env wiring, etc. These are LEGITIMATE — they document Code Mode's capability to integrate Figma MCP, not the mcp-figma skill itself.

Separately, mcp-code-mode has 4 references to the `mcp-figma` SKILL by name:
1. `SKILL.md:476` — "Related skills: `mcp-figma` for Figma access through Code Mode..."
2. `README.md:451` — `| [mcp-figma](../mcp-figma/SKILL.md) | Figma design file access via Code Mode |`
3. `references/architecture.md:514` — `- `mcp-figma` - Figma design file access (via Code Mode)`
4. `manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md:88` — `| `.opencode/skills/mcp-figma/SKILL.md` | Figma MCP tool catalog |`

These 4 break when the mcp-figma skill is deleted. They must be stripped.

### Constraints
- User direction: "Code Mode can still reference Figma MCP, just don't let it mention the skill we are transferring"
- Code Mode's pedagogical value depends on having a real worked example (Figma is the most concrete)
- Skill advisor tests must remain green (avoid breaking Code Mode's signal scoring)

### Decision
**We chose**: KEEP all 127 figma-developer-mcp tool/server/invocation/env-var references; STRIP the 4 skill-name references.

**How it works**:
1. Use Edit tool with exact line-number targeting on each of the 4 strip lines
2. Verify post-edit: grep `figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY` returns ≥120 hits (preserves KEEP set)
3. Verify post-edit: grep `mcp-figma` (literal skill-name) in mcp-code-mode/ returns 0 hits

### Alternatives Considered
- (a) Strip ALL Figma references in mcp-code-mode → rejected: kills Code Mode's worked example
- (b) Genericize examples (replace Figma with placeholder provider) → rejected: less concrete, less educational
- (c) Keep skill-name refs and update them to point to AI_Systems/ → rejected: creates cross-repo coupling; AI_Systems is a separate repo

### Consequences
- mcp-code-mode docs continue to reference Figma as a primary worked example
- Future readers see "use figma" examples without confusion about which skill provides the agent (Code Mode IS the orchestration; the agent persona moved to AI_Systems)
- Maintenance: if Figma MCP API surface changes, mcp-code-mode examples need updating (separate work)

---

### ADR-012: Spec history preserved (D2)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester (memory rule), Claude |

### Context
Many spec folders under `.opencode/specs/**` and `system-spec-kit/z_archive/**` contain historical references to `mcp-figma` (e.g., research iterations, review reports, scratch notes from past work). Per memory rule "audit-packet pattern" + "spec-history-preservation": these are immutable historical record.

### Constraints
- Memory rule: NEVER rewrite spec history
- Audit-packet pattern requires historical preservation for traceability
- z_archive/ and z_future/ are conventionally untouched

### Decision
**We chose**: KEEP all spec-folder mentions of `mcp-figma`. Phase 3 does NOT touch:
- `.opencode/specs/**/*.md` (live + archived)
- `.opencode/skills/system-spec-kit/z_archive/**`
- `.opencode/specs/z_future/**`

### Alternatives Considered
- (a) Strip ALL mcp-figma mentions to "clean" the repo — rejected: violates spec-history-preservation rule
- (b) Add deprecation banner to spec folders — rejected: adds noise; spec docs are already historical record

### Consequences
- `grep -rn "mcp-figma" Code_Environment/Public/` will continue to return hits in spec folders (~25-30 hits)
- These are explicitly EXCLUDED from G1 grep cleanliness check
- Future readers can trace the mcp-figma → Figma MCP Agent migration through spec history

---

### ADR-013: Two-commit advisor cleanup atomicity (D6)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
Phase 3 produces two distinct change types:
1. Manual edits (14 files + skill folder deletion) — surgical, well-mapped
2. Advisor regen output (`doctor:skill-advisor :auto`) — auto-generated, potentially large diff

If both commit together, reviewer can't easily separate "what was hand-removed" from "what advisor regenerated". If something goes wrong with the regen (unexpected scoring shifts in OTHER skills), rollback would also revert the manual edits.

### Constraints
- Need clean review: humans can verify each separately
- Need clean rollback: revert one without affecting the other

### Decision
**We chose**: TWO COMMITS.
- Commit 4: `chore: remove mcp-figma skill and patch cross-references` — manual edits + skill rm -rf
- Commit 5: `chore: regenerate skill advisor graph` — output of `doctor:skill-advisor :auto`

### How it works
1. Apply all 14 file edits + rm -rf
2. `git add` selectively
3. Commit 4
4. Run `Skill: doctor:skill-advisor :auto`
5. `git diff` — review regen output
6. `git add` only advisor-related files
7. Commit 5

### Alternatives Considered
- (a) Single combined commit — rejected: harder to review/rollback
- (b) Three commits (deletion + cross-refs + regen) — rejected: deletion + cross-refs are atomically related (test fixtures must match live skill state)

### Consequences
- 2 commits to track in implementation-summary.md
- Slightly more git overhead, but separable rollback paths

---

### ADR-014: Re-grep at execution start (D8)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
Explore Agent 1 mapped 31 hits across 9 files (skill advisor scoring + observability + READMEs) plus 4 strips in mcp-code-mode. This was at the start of Phase 1 (~2 hours before Phase 3 starts). The repo is active — other tracks (parallel sessions, automated tools) may have modified files between mapping and execution.

### Constraints
- Memory rule: "Worktree cleanliness is never a blocker" — but unexpected drift in MAPPED files would break Edit tool's exact-match requirement
- Need confidence that line numbers + surrounding text still match before Edit

### Decision
**We chose**: RE-GREP at Phase 3 execution start. Compare current hit count + locations against Explore Agent 1 mapping. If drift detected, update task list before applying edits.

### Alternatives Considered
- (a) Trust the brief — rejected: brittle if any file changed
- (b) Use full-file scans for every edit — rejected: slow

### Consequences
- ~5 min added to Phase 3A
- Catches drift early, before edit-tool errors

---

### Cross-references

- **ADR-001 through ADR-007** (Phase 1 cross-cutting): see `../001-barter-figma-agent/decision-record.md`
- **ADR-009 + ADR-010** (Phase 2): see `../002-public-figma-agent/decision-record.md`
- **ADR-011 through ADR-014** (this file): D1 + D2 + D6 + D8 in Phase 3

---

### Decision Index (full set)

| ID | Topic | Status | Owner Phase |
|---|---|---|---|
| ADR-001 | Persona reframe | Accepted | Phase 1 |
| ADR-002 | Mirror ClickUp structure | Accepted | Phase 1 |
| ADR-003 | SYNC verb = Create (D4) | Accepted | Phase 1 |
| ADR-004 | Favicon TODO defer (D3) | Accepted | Phase 1 |
| ADR-005 | Bundling (D5) | Accepted (revised) | Phase 1 |
| ADR-006 | cli-codex primary (D7) | Accepted | Cross-cutting |
| ADR-007 | Stay on main | Accepted | Cross-cutting |
| ADR-009 | Public duplicate scrub (D9) | Accepted | Phase 2 |
| ADR-010 | Public README badge math (D10) | Accepted | Phase 2 |
| **ADR-011** | **Code Mode keep+strip (D1)** | **Accepted** | **Phase 3** |
| **ADR-012** | **Spec history preserved (D2)** | **Accepted** | **Phase 3** |
| **ADR-013** | **Two-commit advisor cleanup (D6)** | **Accepted** | **Phase 3** |
| **ADR-014** | **Re-grep at execution start (D8)** | **Accepted** | **Phase 3** |
