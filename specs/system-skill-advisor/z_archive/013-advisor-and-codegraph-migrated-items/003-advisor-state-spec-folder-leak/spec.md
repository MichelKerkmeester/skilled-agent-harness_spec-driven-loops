---
title: "Feature Specification: Stop skill-advisor state from leaking into spec folders"
description: "The skill-advisor resolves its workspace root by walking up for a canonical SKILL.md sentinel and, on failure, fell back to the start directory. Advisor-bearing processes dispatched with a cwd inside a specs/ packet subtree therefore wrote a stray .opencode/skills/.advisor-state/ tree into the packet on every run — 23 such strays accumulated. This packet hardens the fallback so it can never return a path inside a specs/ subtree, adds a regression test, and removes the 23 existing strays."
trigger_phrases:
  - "advisor state spec folder leak"
  - "stray .advisor-state directories"
  - "findAdvisorWorkspaceRoot fallback"
  - "skill-graph-generation.json in specs"
  - "workspace root hoist above specs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/003-advisor-state-spec-folder-leak"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "Hardened workspace-root fallback + cleaned 23 stray advisor-state dirs"
    next_safe_action: "Fresh session or /mcp reconnect to activate the dist fix live"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/utils/workspace-root.vitest.ts"
    session_dedup:
      fingerprint: "sha256:b7a0829f2a0f51726b0e14725e4c982ba1c139004857bbea3fa7d265f38af192"
      session_id: "027-003-005-advisor-state-spec-folder-leak"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Stop skill-advisor state from leaking into spec folders

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-18 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill-advisor resolves where to write its runtime state via `findAdvisorWorkspaceRoot(start)` (`lib/utils/workspace-root.ts`), which walks up parent directories looking for the canonical sentinel `.opencode/skills/system-spec-kit/SKILL.md`. When the sentinel is not found within the depth cap, the function fell back to returning `start` itself. The advisor then joins its state path onto that root and `mkdirSync`s it, so an advisor-bearing process whose cwd is inside a `specs/` packet subtree — deep-loop fan-out seats (`context/seats/iter-NNN/`), deep-research iteration dirs (`research/`), prompt/asset working dirs — materialized a stray `.opencode/skills/.advisor-state/skill-graph-generation.json` inside that packet on every run.

A sweep of `.opencode/specs/` found **23** such stray `.advisor-state` directories. They are gitignored (`.gitignore` `**/.advisor-state/`) and harmless, but they clutter the spec tree, appear with no commit trail ("random folders"), and a bare `.opencode/skills` directory can re-anchor a future walk-up.

The `specs/` directory at the repo root is a symlink to `.opencode/specs`, so `specs/<pkt>/.opencode` and `.opencode/specs/<pkt>/.opencode` are the same on-disk location.

### Purpose
Make the resolver's sentinel-not-found fallback structurally incapable of returning a path inside a `specs/` subtree, keep the schema's `detectRepoRoot` twin in lockstep, prove it with a regression test, and remove the 23 existing strays.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Harden `findAdvisorWorkspaceRoot` so the fallback hoists above any `specs/` (canonical `.opencode/specs/` or bare-symlink alias) segment to the workspace root.
- Apply the same guard to `detectRepoRoot` in `schemas/advisor-tool-schemas.ts` (the in-file lockstep contract requires both to agree on the workspace root).
- Add a dedicated regression unit test for the fallback.
- Rebuild the advisor `dist`.
- Delete the 23 stray `.opencode/skills/.advisor-state/` directories under `.opencode/specs/`.

### Out of Scope
- The heavier opencode-plugin spillage (`.opencode/node_modules`, `package.json`) found in two research dirs — a related but distinct artifact class, flagged for follow-up.
- Pre-existing advisor parity failures (`rr-iter2-060` corpus drift and the divergence-ledger drift) — confirmed unrelated to this change via a stash baseline.
- Changing the depth cap or the sentinel string itself.
- Forcing a live daemon recycle (activation is a fresh session / `/mcp` reconnect).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts | Modify | Add `hoistAboveSpecsTree` helper; fallback returns the hoisted root instead of `start` |
| .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts | Modify | Inlined lockstep twin of the guard in `detectRepoRoot` |
| .opencode/skills/system-skill-advisor/mcp_server/tests/utils/workspace-root.vitest.ts | Create | Regression test for the hardened fallback |
| .opencode/skills/system-skill-advisor/mcp_server/dist/** | Modify | Rebuilt compiled output |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fallback never returns a specs-subtree path | For any `start` inside `.opencode/specs/` or bare `specs/` with no reachable sentinel, the resolved root contains no `specs` path segment |
| REQ-002 | Happy path unchanged | When the sentinel IS reachable from `start`, the resolver returns the sentinel-holding directory exactly as before |
| REQ-003 | Existing strays removed | Zero `.advisor-state` directories remain under `.opencode/specs/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Schema twin in lockstep | `detectRepoRoot` applies the same hoist so the workspaceRoot allowlist is never anchored on a spec subdir |
| REQ-005 | Non-specs paths preserved | An ordinary path with no sentinel and no `specs` segment still falls back to `resolve(start)` |
| REQ-006 | Regression guarded by a test | A vitest covers happy-path, canonical hoist, bare-alias hoist, no-specs-segment property, and the non-specs fallback |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run typecheck` exits 0 and the advisor `dist` contains `hoistAboveSpecsTree`.
- **SC-002**: The new resolver test passes (5/5) with no regressions in resolver-adjacent suites attributable to this change.
- **SC-003**: A re-sweep of `.opencode/specs/` reports 0 stray `.advisor-state` directories while real vendored `external/` `.opencode` clones remain intact.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad deletion harms a real vendored `.opencode` clone | Loss of cloned-repo files | Delete only `.advisor-state` leaves; `rmdir` wrappers only when empty; verified `external/` clones survived |
| Risk | Fallback change alters a real resolution path | Wrong workspace root in production | Change only fires when the sentinel is unreachable; happy path returns early and is covered by a test |
| Dependency | Live activation | Fix not effective until reload | Rebuild dist; fresh session or `/mcp` reconnect (advisor launcher does not transparently recycle) |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The hoist is a single path `split`/scan executed only on the cold fallback branch; no measurable cost on the hot happy path.

### Reliability
- **NFR-R01**: The hoist is deterministic and pure (path math only); it performs no filesystem writes and never throws on a normal absolute path.

### Maintainability
- **NFR-M01**: The schema-side twin carries a comment naming its lockstep partner so the duplication is discoverable.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Path Boundaries
- **Canonical `.opencode/specs/<pkt>/seat`**: hoists to the directory above `.opencode` (the workspace root).
- **Bare `specs/<pkt>/seat`** (symlink alias, `resolve()` does not follow it): hoists to the directory above `specs`.
- **Deeply nested packet** (`.opencode/specs/track/nnn/research/iter`): resolved root contains no `specs` segment.
- **`start` at/above the repo root** (no `specs` segment): unchanged, returns `resolve(start)`.

### Error Scenarios
- **Sentinel reachable**: fallback is never entered; behavior identical to prior.
- **`start` outside any repo (tmp dir)**: no `specs` segment → prior fallback preserved (harmless, not in a spec tree).


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Blast radius | Low | Pure path-math guard on a cold fallback branch; deletions are gitignored runtime state |
| Reversibility | High | Two-file revert + rebuild; strays regenerate on demand |
| Coordination | None | No API/contract change; nothing downstream speaks an old contract |


<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Why do post-fix-era processes still reach the fallback from inside a spec tree? **PARTIALLY RESOLVED: dispatched `opencode run` seats run under their own runtime/root; the defense-in-depth hoist makes the exact dispatch path moot for this leak. Reproducing a dispatch to confirm the precise cause is deferred.**
- Should the related `.opencode/node_modules` plugin spillage be cleaned the same way? **DEFERRED: distinct artifact class, tracked as a follow-up.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
