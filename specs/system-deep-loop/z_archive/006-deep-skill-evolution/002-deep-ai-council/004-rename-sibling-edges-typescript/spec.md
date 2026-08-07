---
title: "Feature Specification: 115/004 — cross-skill edges + TypeScript code/tests"
description: "Parallel-after-001: update 4 sibling skill graph-metadata.json edges + 2 TypeScript files (explicit.ts scorer constants + multi-ai-council-runtime-parity.vitest.ts assertions)."
trigger_phrases: ["115 004", "cross-skill edges", "typescript rename"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/004-rename-sibling-edges-typescript"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/004 spec.md"
    next_safe_action: "Author 115/004 plan.md"
    blockers: []
    key_files: [".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115004"
      session_id: "115-004-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 115/004 — cross-skill edges + TypeScript

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (parallel after 001) |
| **Status** | Planned |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 6 |
| **Predecessor** | 001 |
| **Handoff Criteria** | 4 sibling skill graph metadata + 2 TS files updated; vitest parity passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
Phase 4 of 6. Parallel-eligible with 002/003/005 after 001 emits rename-plan.json.

**Scope**: 4 sibling skill `graph-metadata.json` (`enhances`/`siblings`/`related_to` edges) + 2 TypeScript files (string constants in advisor scorer + parity vitest assertions).

**Deliverables**:
- `deep-research/graph-metadata.json`, `deep-agent-improvement/graph-metadata.json`, `system-spec-kit/graph-metadata.json`, `system-skill-advisor/graph-metadata.json` — update edge targets
- `system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` — update routing string constants
- `system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` — update assertion expectations
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
After 002/003 rename, sibling skill graph metadata + advisor-scorer code + parity test still reference the OLD names.
### Purpose
Update these live routing surfaces so the advisor + tests work with the renamed skill/agent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- 4 sibling skill graph-metadata.json files
- 2 TypeScript files

### Out of Scope
- Skill body (002), agent files (003), root docs (005), reindex (006)

### Files to Change
| File | Action |
|------|--------|
| `.opencode/skills/deep-research/graph-metadata.json` | Update edge targets |
| `.opencode/skills/deep-agent-improvement/graph-metadata.json` | Same |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Same |
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Same |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Update string constants |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Update assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | 4 sibling graph-metadata.json edges updated | jq on each |
| REQ-002 | explicit.ts string constants updated | rg = 0 |
| REQ-003 | vitest parity test passes | `npx vitest run` exit 0 |
| REQ-004 | rg "deep-ai-council" on these 6 files = 0 | rg verification |

### P1
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-005 | validate.sh --strict on 004 exit 0 | validator |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: vitest parity test passes against renamed agent.
- **SC-002**: 004 strict validate exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Mitigation |
|------|------|------------|
| Risk | explicit.ts string constant is regex source elsewhere | Grep across scorer/+lanes/ before edit |
| Risk | vitest assertions need both old AND new name in fixtures | Read test before edit; verify expectation shape |
| Dependency | 001 + 002 + 003 renames landed | 004 reads post-rename paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
(see parent §10)
<!-- /ANCHOR:questions -->
