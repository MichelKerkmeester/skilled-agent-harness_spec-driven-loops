# Implementation Plan: Command Alignment (Post JS-to-TS Migration)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (.md), YAML (.yaml) |
| **Framework** | OpenCode command system |
| **Storage** | N/A |
| **Testing** | grep-based path validation |

### Overview

Update all command and asset files in `.opencode/command/` to replace broken `scripts/memory/generate-context.js` paths with the correct `scripts/dist/memory/generate-context.js` post-migration path. Also fix 4 stale `create-spec-folder.sh` references to `scripts/spec/create.sh`.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (grep returns 0 results for old paths)
- [x] Dependencies identified (none)

### Definition of Done
- [ ] All `scripts/memory/generate-context.js` references updated to `scripts/dist/memory/generate-context.js`
- [ ] All `create-spec-folder.sh` references updated to `scripts/spec/create.sh`
- [ ] Validation grep confirms zero remaining broken paths
- [ ] `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help` succeeds

---

## 3. ARCHITECTURE

### Pattern
Documentation path correction — no architectural changes.

### Key Components
- **Command .md files**: Natural-language workflow instructions that invoke scripts via `node` commands
- **YAML asset files**: Structured workflow automation configs with `script_path` fields and activity descriptions

### Data Flow
Commands reference scripts by path → Agent reads path → Agent executes `node [path]` → Script runs. The broken link is at the "reference" step.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Fix generate-context.js Paths in Command .md Files

Target: 6 `.md` files with direct `node` invocation paths.

- [ ] `command/spec_kit/complete.md` — 1 path fix
- [ ] `command/spec_kit/handover.md` — 1 path fix
- [ ] `command/spec_kit/plan.md` — 2 path fixes
- [ ] `command/spec_kit/research.md` — 4 path fixes (includes 1 bare path on line 624)
- [ ] `command/create/agent.md` — 1 path fix
- [ ] `command/memory/save.md` — 8 path fixes

### Phase 2: Fix generate-context.js Paths in YAML Asset Files

Target: 6 `.yaml` files with `script_path` fields.

- [ ] `spec_kit/assets/spec_kit_research_auto.yaml` — 1 path fix
- [ ] `spec_kit/assets/spec_kit_research_confirm.yaml` — 1 path fix
- [ ] `spec_kit/assets/spec_kit_complete_auto.yaml` — 1 path fix
- [ ] `spec_kit/assets/spec_kit_complete_confirm.yaml` — 1 path fix
- [ ] `spec_kit/assets/spec_kit_implement_auto.yaml` — 1 path fix
- [ ] `spec_kit/assets/spec_kit_implement_confirm.yaml` — 1 path fix
- [ ] `create/assets/create_agent.yaml` — 1 path fix

### Phase 3: Fix create-spec-folder.sh References

Target: 4 `.yaml` files with stale script name.

- [ ] `spec_kit/assets/spec_kit_complete_auto.yaml` — 1 reference fix
- [ ] `spec_kit/assets/spec_kit_complete_confirm.yaml` — 1 reference fix
- [ ] `spec_kit/assets/spec_kit_plan_auto.yaml` — 1 reference fix
- [ ] `spec_kit/assets/spec_kit_plan_confirm.yaml` — 1 reference fix

### Phase 4: Verification

- [ ] Run grep to confirm zero remaining `scripts/memory/generate-context.js` references
- [ ] Run grep to confirm zero remaining `create-spec-folder.sh` references
- [ ] Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help` to confirm runtime works
- [ ] Verify clean file list (no unintended changes)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep validation | All command files for old paths | `grep -r` |
| Runtime smoke | generate-context.js --help | `node` |
| Diff review | All changed files | `git diff` |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | — |

---

## 7. ROLLBACK PLAN

- **Trigger**: Incorrect path replacement breaks a workflow
- **Procedure**: `git checkout -- .opencode/command/` to restore all command files

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Command .md) ─┐
                        ├──► Phase 4 (Verification)
Phase 2 (YAML assets) ─┤
                        │
Phase 3 (create-spec)  ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 4 |
| Phase 2 | None | Phase 4 |
| Phase 3 | None | Phase 4 |
| Phase 4 | 1, 2, 3 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Command .md fixes | Low | Search-and-replace across 6 files |
| Phase 2: YAML asset fixes | Low | Search-and-replace across 7 files |
| Phase 3: create-spec-folder fix | Low | 4 targeted replacements |
| Phase 4: Verification | Low | grep + node --help |
| **Total** | **Low** | **Single session** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No uncommitted changes in `.opencode/command/`
- [ ] git status clean before starting

### Rollback Procedure
1. `git checkout -- .opencode/command/` (immediate revert)
2. Verify command files restored (git diff should be empty)
3. No data reversal needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

---

## L3: DEPENDENCY GRAPH

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Phase 1    │  │   Phase 2    │  │   Phase 3    │
│ .md files    │  │ .yaml files  │  │ create-spec  │
│ (6 files)    │  │ (7 files)    │  │ (4 files)    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
         ┌──────▼─────────────────▼──────┐
         │          Phase 4              │
         │       Verification            │
         │  (grep + runtime + diff)      │
         └───────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 | None | Fixed .md files | Phase 4 |
| Phase 2 | None | Fixed .yaml files | Phase 4 |
| Phase 3 | None | Fixed script refs | Phase 4 |
| Phase 4 | 1, 2, 3 | Validation report | None |

---

## L3: CRITICAL PATH

1. **Phase 1-3** — Parallel — All path fixes
2. **Phase 4** — Sequential — Validation

**Total Critical Path**: Phases 1-3 (parallel) + Phase 4

**Parallel Opportunities**:
- Phase 1, 2, and 3 are fully independent
- Could be executed by parallel agents

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | All .md fixes applied | grep returns 0 for old paths in .md | Phase 1 |
| M2 | All .yaml fixes applied | grep returns 0 for old paths in .yaml | Phase 2 |
| M3 | Full validation pass | All checklist P0 items verified | Phase 4 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Replace Path vs Add Shim

**Status**: Accepted

**Context**: The compiled JS is at `dist/memory/generate-context.js` but commands reference `memory/generate-context.js`. We could either (A) update all references or (B) add a shim `.js` file at the old path that delegates to `dist/`.

**Decision**: Update all references (Option A). A shim adds unnecessary complexity, a runtime indirection, and masks the actual file structure.

**Consequences**:
- Positive: All paths accurately reflect actual file locations
- Positive: No hidden delegation layer
- Negative: Must update 15+ files — but this is a one-time mechanical operation

**Alternatives Rejected**:
- Shim at old path: Hides the real structure, adds maintenance burden, masks the TS migration impact
