---
title: "Implementation Plan: 118/006 — Collateral /doctor + Playbook Update"
description: "Plan for swapping mcp__mk_spec_memory__deep_loop_graph_* MCP tool references for direct deep-loop-runtime .cjs script invocations across 4 collateral files."
trigger_phrases:
  - "phase 006 plan"
  - "doctor collateral plan"
  - "system-code-graph playbook plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/007-collateral-doctor-playbook"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded plan.md"
    next_safe_action: "Execute T001-T005 after 005 merges"
    blockers:
      - "phase 005 must complete first"
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180061180061180061180061180061180061180061180061180061180060001"
      session_id: "118-006-plan-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 118/006 — Collateral /doctor + Playbook Update

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML collateral (no runtime code edits) |
| **Framework** | OpenCode command system + manual_testing_playbook layout |
| **Storage** | n/a (collateral docs only) |
| **Testing** | Manual `/doctor deep-loop` invocation + grep-based zero-match assertions |

### Overview

Phase 006 is a small documentation cutover. Four collateral files still cite the four removed `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools (status, refresh, prune, deep-loop convergence). Replace each citation with the canonical script invocation `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs --health-check`. Output JSON shape is preserved by phase 003, so downstream assertions in the playbook scenario remain valid; only the dispatch path changes.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 (YAML workflow update) is complete and merged
- [ ] Phase 003 scripts exist at `.opencode/skills/deep-loop-runtime/scripts/*.cjs`
- [ ] JSON shape of `--health-check` stdout matches the legacy MCP tool response shape
- [ ] Scope of 4 files frozen — no other collateral in this phase

### Definition of Done
- [ ] All 4 files modified per the Files to Change table in `spec.md`
- [ ] Zero `mcp__mk_spec_memory__deep_loop_graph_` matches across the 4 files
- [ ] Manual `/doctor deep-loop` invocation succeeds and emits expected JSON
- [ ] Playbook scenario 009 dispatch line cites the new script path
- [ ] `validate.sh --strict` exits 0
- [ ] `checklist.md` items all `[x]` with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Citation swap** — collateral cites the script path, not the implementation. The pattern is identical across all 4 files: replace `mcp__mk_spec_memory__deep_loop_graph_<X>` with `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs --health-check`.

### Key Files

- **`.opencode/commands/doctor.md`** — top-level `/doctor` command body; ~1-2 deep-loop health-check references
- **`.opencode/commands/doctor/_routes.yaml`** — argv-positional route manifest; deep-loop diagnostic target rows
- **`.opencode/commands/doctor/update.md`** — `/doctor:update` sub-action narrative referencing deep-loop refresh ops
- **`.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md`** — test scenario with one dispatch line citing the old tool ID

### Data Flow

1. User invokes `/doctor deep-loop`
2. Router reads `_routes.yaml` and resolves the deep-loop target
3. Router shells out via `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs --health-check`
4. Script writes JSON to stdout (same shape as legacy MCP tool response)
5. `/doctor` body or playbook scenario asserts against that JSON

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify phase 005 (YAML workflow) is merged
- [ ] Verify `.opencode/skills/deep-loop-runtime/scripts/*.cjs` exist
- [ ] Snapshot pre-edit grep counts: `grep -c 'mcp__mk_spec_memory__deep_loop_graph_'` per file
- [ ] Snapshot legacy JSON response shape from phase-003 test fixtures
- [ ] Inventory the exact line numbers in each of the 4 files where MCP tool refs appear

### Phase 2: Implementation
- [ ] Edit `.opencode/commands/doctor.md` — swap deep-loop health-check tool refs for script invocations
- [ ] Edit `.opencode/commands/doctor/_routes.yaml` — update deep-loop route manifest target paths
- [ ] Edit `.opencode/commands/doctor/update.md` — swap refresh-op tool refs for script invocations
- [ ] Edit `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md` — update dispatch line + expected stdout snippet if needed
- [ ] Re-validate YAML parses (`_routes.yaml`)
- [ ] Re-validate markdown frontmatter integrity on the 3 .md files

### Phase 3: Verification
- [ ] Grep zero-match assertion across all 4 files
- [ ] Manual `/doctor deep-loop` smoke test (read-only health check)
- [ ] Manual playbook scenario 009 dry-run (read the file, confirm dispatch line and assertion line are consistent)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` exits 0
- [ ] All `checklist.md` P0/P1 items marked with evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Zero-grep assertion across 4 files | `grep -c 'mcp__mk_spec_memory__deep_loop_graph_'` |
| Static | YAML/markdown parse integrity | `yq` for `_routes.yaml`; `python3 -c 'import yaml; yaml.safe_load(...)'` for frontmatter |
| Manual | `/doctor deep-loop` health check | Direct CLI invocation in repo root |
| Manual | Playbook scenario 009 dispatch line | Read + visual confirmation against script-shim contract |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 (YAML workflow update) | Internal arc | Pending | Cannot start 006 — ordering violation |
| Phase 003 (script shim + DB relocation) | Internal arc | Pending | Scripts must exist before collateral cites them |
| Phase 004 (MCP tool surface removal) | Internal arc | Pending | Legacy tool surface must be removed before grep zero-match is meaningful |
| `_routes.yaml` schema (route manifest) | OpenCode internal | Green | Edits must preserve mutation-class annotations |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/doctor deep-loop` health check fails after collateral edit, or playbook scenario 009 fails on the next test run
- **Procedure**: `git revert <commit-sha>` for the phase-006 commit; collateral reverts to citing the (now-deleted) MCP tools and operators see a clean error pointing back to the script path

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
118/003 (script shim) ─┐
118/004 (mcp removal) ─┼─> 118/005 (yaml) ─> 118/006 (collateral, THIS PHASE) ─> 118/007 (tests)
                       │
118/002 (lib runtime) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 005 merged, 003 scripts exist | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 007 (test migration) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Implementation (4 file edits) | Low | 30 minutes |
| Verification (grep + manual smoke + validate) | Low | 15 minutes |
| **Total** | | **1 hour** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup state recorded (pre-edit grep counts captured in handover)
- [ ] No feature flag — collateral edits land directly on main
- [ ] Manual smoke-test plan recorded in this plan

### Rollback Procedure
1. **Immediate**: `git revert <phase-006-commit-sha>`
2. **Verify**: re-run zero-match grep; expect non-zero counts (back to pre-edit state)
3. **Notify**: Update 118 phase-parent `_memory.continuity` to flag 006 as blocked
4. **Re-plan**: Identify root cause (likely a JSON shape drift from phase 003) and re-open 006 after upstream fix

### Data Reversal
- **Has data migrations?** No (docs only)
- **Reversal procedure**: n/a

<!-- /ANCHOR:enhanced-rollback -->
