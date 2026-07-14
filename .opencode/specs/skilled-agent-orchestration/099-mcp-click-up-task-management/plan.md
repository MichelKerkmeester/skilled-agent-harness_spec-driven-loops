---
title: "Implementation Plan: mcp-click-up Skill"
description: "Technical plan for creating the mcp-click-up skill — cupt CLI primary, official ClickUp MCP secondary, modeled on mcp-chrome-devtools."
trigger_phrases:
  - "mcp-click-up plan"
  - "clickup skill implementation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/099-mcp-click-up-task-management"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "speckit-complete"
    recent_action: "Wrote plan.md for mcp-click-up skill creation"
    next_safe_action: "Implement skill files per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/SKILL.md"
      - ".opencode/skills/mcp-click-up/scripts/install.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000002"
      session_id: "speckit-124-mcp-click-up"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Which CLI? cupt (Python)"
      - "Which MCP? Official clickup-mcp-server"
      - "Routing model? Operation-based"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: mcp-click-up Skill

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash (skill files), Python (cupt) |
| **Framework** | OpenCode Skill framework |
| **Storage** | None (skill = files only) |
| **Testing** | validate.sh --strict + skill_advisor.py |

### Overview

Create `.opencode/skills/mcp-click-up/` by authoring all skill files directly. Content is fully known from planning. Approach: write each file, validate spec folder + skill discoverability. Structure mirrors `mcp-chrome-devtools` exactly; content adapted for cupt + official MCP.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (spec.md SC-001 through SC-004)
- [x] Dependencies identified (cupt-main, mcp-chrome-devtools, Barter MCP knowledge)

### Definition of Done
- [x] All acceptance criteria met (all skill files created)
- [x] validate.sh exits 0
- [x] skill_advisor.py returns mcp-click-up for "clickup task management"

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Skill-as-documentation. The `mcp-click-up` skill is a set of markdown files following the OpenCode skill contract. No runtime code is compiled — it's loaded by the skill router at dispatch time.

### Key Components

- **SKILL.md**: Core routing definition. 8 sections. SMART ROUTING pseudocode routes by intent signal scoring.
- **scripts/install.sh**: Bash script that installs cupt and prints MCP config snippet.
- **references/**: On-demand markdown files loaded by the routing pseudocode.

### Operation-Based Routing

| Operation | Tool | Why |
|-----------|------|-----|
| Daily task ops | cupt | Better date/tag filters, --offline, dry-run |
| Documents/Goals/Bulk | Official MCP | cupt cannot access these surfaces |

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — this is an `add_feature` (new skill creation), not a bug fix. No existing surfaces are modified.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: SETUP
- [x] Create skill directory structure (.opencode/skills/mcp-click-up/)
- [x] Write scripts/install.sh (cupt install + MCP config snippet)

### Phase 2: IMPLEMENTATION
- [x] Write SKILL.md (8 sections + routing pseudocode + operation table)
- [x] Write README.md (overview + quick-start + feature table)
- [x] Write INSTALL_GUIDE.md (AI-first install block + validation gates)
- [x] Write graph-metadata.json (skill graph registration)
- [x] Write references/cupt_commands.md (full cupt reference + agent patterns)
- [x] Write references/mcp_tools.md (46 MCP tools + invocation)
- [x] Write references/troubleshooting.md (auth, status, MCP errors)
- [x] Write examples/ (README + 2 shell scripts)
- [x] Write manual_testing_playbook/ (5 phases, 16 test files)
- [x] Write changelog/v1.0.0.0.md

### Phase 3: VERIFICATION
- [x] validate.sh --strict passes
- [x] skill_advisor.py confirms discoverability
- [x] shellcheck scripts/install.sh passes
- [x] All P0/P1 checklist items verified

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec folder docs | `validate.sh --strict` |
| Discoverability | Skill advisor routing | `skill_advisor.py "clickup task management"` |
| Shell quality | install.sh, example scripts | `shellcheck` |
| Manual | Operation table, routing logic | Human review |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cupt v0.7.1 docs (external/cupt-main/) | Internal reference | Green | cupt_commands.md incomplete |
| cupt bundled skill (external/cupt-main/skill/) | Internal reference | Green | Agent invariants unavailable |
| mcp-chrome-devtools skill | Internal template | Green | Structure would need to be improvised |
| Official ClickUp MCP docs | External | Green | mcp_tools.md incomplete |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill creates problems with skill advisor routing
- **Procedure**: `rm -rf .opencode/skills/mcp-click-up/` — all changes are additive (new directory only)

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup/scripts) ──► Phase 2 (All skill files) ──► Phase 3 (Validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Done |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-----------------|
| Setup (dirs + install.sh) | Medium | 30 min |
| Core skill files (SKILL.md, README, INSTALL_GUIDE) | High | 90 min |
| References (3 files) | High | 60 min |
| Examples + playbook | Medium | 60 min |
| Validation | Low | 15 min |
| **Total** | | **~4.5 hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All skill files are new (no existing files modified)
- [x] No config files are auto-modified by install.sh

### Rollback Procedure
1. `rm -rf .opencode/skills/mcp-click-up/` — removes the skill entirely
2. Verify: `ls .opencode/skills/` — mcp-click-up no longer present
3. Skill advisor will no longer route to this skill

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
external/cupt-main/ ────────────────────────────────► SKILL.md §4 Rules
external/cupt-main/skill/ ──────────────────────────► references/cupt_commands.md
mcp-chrome-devtools/SKILL.md ───────────────────────► SKILL.md structure
Barter MCP knowledge ───────────────────────────────► references/mcp_tools.md
                                                        │
All of the above ───────────────────────────────────► .opencode/skills/mcp-click-up/
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| scripts/install.sh | Python/pipx docs | cupt install | nothing else |
| SKILL.md | mcp-chrome-devtools template | Routing definition | Skill router |
| references/ | cupt-main + MCP docs | Reference content | SKILL.md §8 |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **SKILL.md** — Core deliverable; all routing depends on it — CRITICAL
2. **graph-metadata.json** — Skill discoverability; must match intent signals — CRITICAL
3. **scripts/install.sh** — Embedded install; user-facing requirement — CRITICAL

**Total Critical Path**: 3 files, ~2 hours

**Parallel Opportunities**:
- references/, examples/, and playbook can be written in any order after SKILL.md

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-----------------|--------|
| M1 | Core skill files | SKILL.md + install.sh + graph-metadata.json complete | Phase 1-2 |
| M2 | References complete | 3 reference files written | Phase 2 |
| M3 | Validation passes | validate.sh exit 0 + skill_advisor.py match | Phase 3 |

<!-- /ANCHOR:milestones -->
