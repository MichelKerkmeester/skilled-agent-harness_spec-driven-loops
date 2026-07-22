---
title: "Implementation Plan: Align the sk-design README Set to the create-readme Standard"
description: "Plan for one uniform Level 3 sweep that classifies, authors and quality-gates twelve sk-design styles READMEs against the sk-doc create-readme templates, with no code, test or bundle-data changes."
trigger_phrases:
  - "styles readme alignment plan"
  - "create-readme sweep plan sk-design"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/008-styles-readme-create-readme-alignment"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L3 alignment plan"
    next_safe_action: "Execute Phase 1 classification"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-readme/assets/readme-template.md"
      - ".opencode/skills/sk-doc/create-readme/assets/readme-code-template.md"
      - ".opencode/skills/sk-design/styles/lib/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-008-readme-alignment-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Align the sk-design README Set to the create-readme Standard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact** | Twelve `README.md` files under `.opencode/skills/sk-design/` |
| **Standard** | sk-doc `create-readme` templates and quality gate |
| **Templates** | `readme-template.md` (skill/general), `readme-code-template.md` (code folder) |
| **Change type** | Documentation only — no code, tests or bundle data |

### Overview

This plan runs one uniform sweep over the twelve READMEs the operator listed. Each README is first classified by folder type, mapped to the matching create-readme template, then authored from a live reading of its folder, and finally checked against the sk-doc quality gate. Two already-substantial READMEs (`styles/lib/database/`, `styles/scripts/`) are aligned and de-drifted rather than discarded, and the skill-root README's stale backend path references are reconciled.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Twelve target READMEs and their folders read from the current tree
- [ ] create-readme templates confirmed present under `sk-doc/create-readme/assets/`
- [ ] README type decided per folder (skill, code folder, data folder)
- [ ] Drift findings recorded (root README paths, scripts `_harness/` tree)

### Definition of Done
- [ ] All twelve READMEs conform to their create-readme template
- [ ] Every named path and link resolves on disk
- [ ] HVR passes on all twelve
- [ ] `git diff` touches only the twelve README files
- [ ] Checklist items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation alignment pipeline: classify by folder type, map to template, author from evidence, then quality-gate.

### Key Components
- **Classifier**: decides skill README vs code-folder README vs data-folder README per target.
- **Template map**: `readme-template.md` for the skill root, `readme-code-template.md` for code folders, a trimmed data-README shape for data folders.
- **Authoring pass**: rewrites each README from a live folder listing and nearby docs.
- **Quality gate**: create-quality-control checks (structure, links, HVR, DQI) plus a `git diff` scope check.

### Data Flow

```text
Folder listing → Classify type → Select template → Author current-state README → Quality gate
```

### Component Diagram

```text
┌──────────────────────────────────────────────────────────────┐
│                  README Alignment Sweep                       │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────┐   ┌────────────┐   ┌────────────┐            │
│  │ Skill root │   │ Code folder│   │ Data folder│            │
│  │ (1 README) │   │ (5 READMEs)│   │ (4 READMEs)│            │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘            │
│        │                │                │                    │
│        ▼                ▼                ▼                    │
│  ┌────────────┐   ┌───────────────┐   ┌──────────────┐       │
│  │ readme-    │   │ readme-code-  │   │ trimmed data │       │
│  │ template   │   │ template      │   │ README shape │       │
│  └─────┬──────┘   └───────┬───────┘   └──────┬───────┘       │
│        └────────────────┬─┴──────────────────┘               │
│                         ▼                                    │
│              ┌────────────────────────┐                      │
│              │ create-quality-control │                      │
│              │  + git diff scope check│                      │
│              └────────────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

Note: the skill-root README plus the two `scripts` and `lib/database` code READMEs sum with the thinner folder READMEs to the twelve in scope.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Classify and Template-Map
- [ ] Read each of the twelve folders and its current README from the live tree
- [ ] Classify each README type: skill root, code folder, data folder
- [ ] Record drift findings (root README `_engine`/`_db` paths, scripts `_harness/` tree, spec-packet citation)
- [ ] Confirm the exact `library/bundles/` count from a live listing

### Phase 2: Author
- [ ] Author the skill-root README to the skill shape and reconcile backend paths
- [ ] Author the `lib` tree code READMEs (`lib`, `lib/engine`, `lib/database`)
- [ ] Author the `library` data READMEs (`library`, `library/bundles`, `library/manifests`)
- [ ] Author the `scripts` README, correcting the directory tree and dropping the packet citation
- [ ] Author the `tests` code READMEs (`tests/database`, `tests/engine`, `tests/oracle`)
- [ ] Author the `tests/oracle/golden` data README

### Phase 3: Quality Review
- [ ] Run create-quality-control structure and DQI checks per README
- [ ] Resolve every local link and named path
- [ ] Run HVR checks
- [ ] Confirm `git diff` touches only the twelve README files

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method | Target |
|-----------|-------|--------|--------|
| Structure | Template conformance | create-quality-control / extract_structure | 12/12 conform |
| Links | Local links and named paths | Resolve each against the tree | 0 broken |
| HVR | Human Voice Rules | HVR check | 12/12 clean |
| Scope | No code or data touched | `git diff --name-only` | Only 12 README paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `readme-template.md` | Internal | Present | Cannot classify skill/general READMEs |
| `readme-code-template.md` | Internal | Present | Cannot classify code-folder READMEs |
| Live folder listings | Internal | Available | Cannot author current-state content |
| HVR reference | Internal | Present | Cannot verify voice rules |
| Sibling packet `009` | Internal | Separate | Owns the playbook and `styles/database/README.md`; must not overlap |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A README documents a nonexistent path, or an edit strays outside the twelve files.
- **Procedure**: Revert the offending README edit. Because the sweep is documentation only, reverting a README restores the prior state with no code or data impact.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Classify) ──> Phase 2 (Author) ──> Phase 3 (Quality Review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Classify | None | Author |
| Author | Classify | Quality Review |
| Quality Review | Author | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Classify and Template-Map | Low | 1 hour |
| Author | Medium | 4 hours |
| Quality Review | Low | 1 hour |
| **Total** | | **~6 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-authoring Checklist
- [ ] Current README contents captured for each of the twelve files
- [ ] Working tree clean before the sweep so `git diff` is a true delta

### Rollback Procedure
1. **Identify**: Use `git diff --name-only` to list changed files.
2. **Revert**: `git checkout -- <readme-path>` for any file that should not have changed.
3. **Verify**: Re-run the scope check so only intended README paths remain.

### Data Reversal
- **Has data migrations?** No. This is documentation only, no data or schema changes.

<!-- /ANCHOR:l2-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌─────────────────┐
│  Classify +     │
│  Template-Map   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Author skill    │     │ Author code     │     │ Author data     │
│ root (1)        │     │ folders (5)     │     │ folders (4)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         └───────────────┬───────┴────────────────┬──────┘
                         ▼                         │
              ┌─────────────────┐                  │
              │ Author scripts  │ ◄────────────────┘
              │ (drift fix)     │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │ Quality gate    │
              │ (links, HVR,    │
              │  DQI, scope)    │
              └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Classify | None | Type map, drift findings | All authoring |
| Skill-root README | Classify | 1 aligned README | Quality gate |
| Code-folder READMEs | Classify | 5 aligned READMEs | Quality gate |
| Data-folder READMEs | Classify | 4 aligned READMEs | Quality gate |
| Scripts README | Classify | 1 de-drifted README | Quality gate |
| Quality gate | All authoring | Verified doc set | Completion claim |

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Classify and Template-Map** - 1 hour - CRITICAL
2. **Author code folders** - 2 hours - CRITICAL (the densest content, includes `lib/database` and `scripts` de-drift)
3. **Author data and skill-root READMEs** - 1.5 hours
4. **Quality gate** - 1 hour - CRITICAL

**Total Critical Path**: ~4 hours

**Parallel Opportunities**:
- Skill-root, code-folder and data-folder authoring can proceed in any order once classification is done.
- Link resolution can be drafted per README during authoring, then confirmed together in the gate.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Classification complete | Twelve types mapped, drift findings recorded | Phase 1 end |
| M2 | Authoring complete | All twelve READMEs drafted to template | Phase 2 end |
| M3 | Quality passed | Links, HVR, DQI and scope all green | Phase 3 end |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Level 3 monolithic sweep, not phased | Twelve small uniform edits share one workflow; phase children would add overhead |
| ADR-002 | Skill shape for root, folder/code shape for the rest | README type must match folder type per create-readme |
| ADR-003 | One data-README for `library/bundles/` | ~1,290 regenerated data folders should not get per-bundle docs |

<!-- /ANCHOR:l3-adr-summary -->
