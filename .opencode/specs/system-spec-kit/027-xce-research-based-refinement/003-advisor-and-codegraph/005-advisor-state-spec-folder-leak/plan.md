---
title: "Implementation Plan: Stop skill-advisor state from leaking into spec folders [template:level_2/plan.md]"
description: "Add a pure path-math guard to the skill-advisor workspace-root resolver so the sentinel-not-found fallback can never return a path inside a specs/ subtree, mirror it in the schema's detectRepoRoot twin, cover it with a regression test, rebuild dist, and remove the 23 existing strays."
trigger_phrases:
  - "advisor state leak plan"
  - "workspace root hoist plan"
  - "hoistAboveSpecsTree"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/005-advisor-state-spec-folder-leak"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "Plan finalized; fix + test + cleanup implemented and verified"
    next_safe_action: "None — complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts"
    session_dedup:
      fingerprint: "sha256:e322e697d42c775584dc643e7d09d5899712c6dbffb4429b7ebbd6b18889744f"
      session_id: "027-003-005-advisor-state-spec-folder-leak"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Stop skill-advisor state from leaking into spec folders

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM), compiled to `dist` via `tsc` |
| **Component** | `system-skill-advisor/mcp_server` |
| **Testing** | vitest (`tests/**/*.vitest.ts`) |
| **Activation** | dist rebuild + fresh session / `/mcp` reconnect |

### Overview
The resolver already uses a strict file sentinel to avoid bare-directory self-perpetuation, but its terminal fallback still returned `start`, which can sit deep inside a `specs/` packet. The fix adds a small pure helper, `hoistAboveSpecsTree`, that detects a `specs/` boundary in the path and returns the directory that contains that tree (the workspace root). The fallback returns the hoisted root when available, otherwise the prior `resolve(start)`. The schema's inlined `detectRepoRoot` gets the same guard to keep the workspaceRoot allowlist in lockstep.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed (fallback returns `start`; 23 strays enumerated)
- [x] Symlink relationship (`specs` → `.opencode/specs`) understood
- [x] Lockstep partner (`detectRepoRoot`) identified

### Definition of Done
- [x] Fallback hardened and mirrored
- [x] Regression test passing
- [x] dist rebuilt with the fix
- [x] 23 strays removed; vendored clones intact


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure-function guard on a cold fallback branch; no behavior change on the hot path.

### Key Components
- **`hoistAboveSpecsTree(dir)`**: returns the directory above the deepest `.opencode/specs` boundary, else above a bare `specs`, else `null`.
- **`findAdvisorWorkspaceRoot`**: unchanged walk-up; terminal `return hoistAboveSpecsTree(start) ?? resolve(start)`.
- **`detectRepoRoot`** (schema): inlined twin of the helper + same terminal guard.

### Data Flow
1. Caller passes `start` (often `process.cwd()`).
2. Walk up to `maxDepth` looking for the sentinel; return on hit (unchanged).
3. On miss, hoist above any `specs/` boundary; return that root, else `resolve(start)`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate and snapshot the 23 stray `.advisor-state` dirs to `scratch/`
- [x] Confirm sibling conventions (Level 2) and the live template contract

### Phase 2: Core Implementation
- [x] Add `hoistAboveSpecsTree` + change the fallback in `workspace-root.ts`
- [x] Apply the lockstep guard in `detectRepoRoot`
- [x] Add the regression test
- [x] Delete the 23 strays (snapshot-driven, `rmdir` wrappers only when empty)

### Phase 3: Verification
- [x] `npm run typecheck` clean
- [x] New test 5/5 green
- [x] Baseline stash to prove parity failures are pre-existing
- [x] Rebuild dist; confirm `hoistAboveSpecsTree` present
- [x] Re-sweep: 0 strays; vendored clones intact


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fallback hoist (happy path, canonical, bare alias, property, non-specs) | vitest |
| Regression baseline | Stash my edits, re-run parity to attribute failures | git stash + vitest |
| Manual | Filesystem re-sweep for stray `.advisor-state` | find |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tsc` build chain | Internal | Green | Cannot refresh dist |
| vitest | Internal | Green | Cannot run regression test |
| Live reload | Internal | Pending user | Fix inert until fresh session / `/mcp` reconnect |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Resolver returns an unexpected root in production.
- **Procedure**: Revert the two source edits and the test, rebuild dist. The deleted strays are gitignored runtime state and regenerate on demand, so the cleanup needs no rollback.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |


<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 45 minutes |
| Verification | Medium | 45 minutes |
| **Total** | | **~1.75 hours** |


<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Stray list snapshotted to `scratch/stray-advisor-state-before.txt`
- [x] Baseline captured (parity failures attributed to pre-existing drift)
- [ ] Feature flag (N/A — pure fallback hardening)

### Rollback Procedure
1. `git checkout -- lib/utils/workspace-root.ts schemas/advisor-tool-schemas.ts`
2. Remove `tests/utils/workspace-root.vitest.ts`
3. `npm run build`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None — deleted strays are gitignored and self-regenerating

<!-- /ANCHOR:enhanced-rollback -->
