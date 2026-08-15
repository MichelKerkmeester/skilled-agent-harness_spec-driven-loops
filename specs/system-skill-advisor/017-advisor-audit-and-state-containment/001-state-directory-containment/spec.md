---
title: "Feature Specification: Stray State-Directory Containment"
description: "The advisor's state writers resolved their root from raw cwd instead of the already-shipped anchored resolver, so a session inside a specs/<packet> dir planted a stray .advisor-state tree. Fixed by routing every writer through the anchored resolver."
trigger_phrases:
  - "stray opencode directory"
  - "nested opencode state leak"
  - "advisor state containment"
  - "spec gate state leak"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-08-15T13:30:28Z"
    last_updated_by: "claude-code"
    recent_action: "Advisor consumer routing fixed and verified"
    next_safe_action: "Close 001; 002 surface-audit remains"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Anchor strategy: repo-marker sentinel walk-up via findAdvisorWorkspaceRoot, not a deny-list."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Stray State-Directory Containment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 001 of 002 |
| **Successor** | ../002-advisor-surface-audit/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor's state writers resolved their root from the current working directory instead of the repository root. A session whose cwd was inside a `specs/<packet>` directory therefore planted a stray `.opencode/skills/.advisor-state/` tree there on the next generation bump.

The shared resolver was **not** the defect — `mcp-server/lib/utils/workspace-root.ts` already anchors structurally (`findAdvisorWorkspaceRoot` walks up to a repo sentinel and `hoistAboveOpencodeTree` can never return a path inside an `.opencode` tree; shipped 2026-07-27). The remaining live leak was that the advisor's **consumers bypassed that resolver** and passed a raw cwd: the hook entry `workspaceRootFor`, the generation-counter path, the skill-graph DB dir, the scan handler, the daemon fallback, and a schema-allowlist twin that had drifted out of lockstep onto the old specs-only shape.

The original spec (2026-07-27) framed this as a broken deny-list resolver and a repo-wide "40 directories / 160 committed files" leak across many writers. A later deep-research pass and this implementation corrected both: the resolver was already fixed, the other named writers were already anchored or gone, and exactly **three** advisor strays existed under `specs/`.

### Purpose

Route every advisor state writer through the already-anchored resolver so a subdir cwd can no longer materialize a nested state tree, prove it with a boundary regression test, and remove the existing strays.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The advisor writers that resolved a state root from raw cwd, routed through the shared anchored resolver.
- A boundary regression test that fails on a leak into any subtree, not an enumerated set.
- Removal of the existing advisor strays under `specs/`.

### Out of Scope

- The advisor's own surface audit, which phase 002 owns.
- Non-advisor writers (spec-gate, cli-dispatch-audit, launcher): verified already-anchored or non-existent at HEAD — see Verified Evidence.
- Changing what state these writers persist; only where it lands.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Anchor `workspaceRootFor` (primary leak entry) |
| `system-skill-advisor/mcp-server/lib/freshness/generation.ts` | Modify | Anchor the `.advisor-state` generation path |
| `system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts` | Modify | Anchor the skill-graph DB dir default |
| `system-skill-advisor/mcp-server/handlers/skill-graph/scan.ts` | Modify | Anchor the scan cwd |
| `system-skill-advisor/mcp-server/advisor-server.ts` | Modify | Anchor the daemon root fallback |
| `system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts` | Modify | Realign the allowlist twin to `hoistAboveOpencodeTree` |
| `system-skill-advisor/mcp-server/tests/state-containment.vitest.ts` | Create | Boundary regression test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:evidence -->
## 4. VERIFIED EVIDENCE

All claims re-verified against the advisor tree during implementation.

### The shared resolver was already anchored

`mcp-server/lib/utils/workspace-root.ts:46,94` — `findAdvisorWorkspaceRoot` walks up to the sentinel `.opencode/skills/system-spec-kit/SKILL.md` and falls back to `hoistAboveOpencodeTree`, which hoists above the outermost `.opencode` segment and can never return a path inside one. This is the structural boundary the original spec asked for; it shipped before this packet.

### The advisor consumers bypassed it

`hooks/claude/user-prompt-submit.ts:138` returned `input.cwd ?? process.cwd()` with no anchoring; `lib/freshness/generation.ts:29` and `lib/skill-graph/skill-graph-db.ts:269` joined the state paths onto that raw root; `handlers/skill-graph/scan.ts:39` used `process.cwd()`; `advisor-server.ts` fell back to `process.cwd()`. Each is now routed through `findAdvisorWorkspaceRoot`.

### The non-advisor writers were already anchored or gone

- `plugins/mk-cli-dispatch-audit.js:55` — already anchors via `findRepoRoot`.
- `plugins/mk-spec-gate.js:166` → `spec-gate-core.mjs:560 resolveGuardPaths` — anchors internally via `findRepoRoot`.
- `bin/mk-skill-advisor-launcher.cjs`, `legacy-projection-manifest.ts` — no cwd-derived state root.
- `cli-opencode/scripts/lib/dispatch-audit.mjs`, `system-code-graph/.../freshness-core.cjs`, `system-deep-loop/.../dispatch-guard.cjs` — no longer exist at their cited paths.

### Leak scope was over-counted

Three advisor strays existed under `specs/` (`mcp-tooling/013…`, `hooks/008…`, `system-deep-loop/z_archive/026…`), not the spec's original "40 directories / 160 committed files"; the remaining nested `.opencode` dirs are test fixtures, `.worktrees/`, and vendored clones.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Advisor state resolution is anchored to the repo root, not cwd | No advisor writer derives a state root from `process.cwd()` without routing through `findAdvisorWorkspaceRoot` |
| REQ-002 | The anchor forbids every nested location, not an enumerated set | The resolver hoists above the outermost `.opencode`; a leak from any subtree resolves to the repo root |
| REQ-003 | A regression test pins the boundary rather than one subtree | `state-containment.vitest.ts` fails if a specs/ cwd resolves state under the packet dir |
| REQ-004 | Every writer named in the evidence is confirmed at its cited line | Each writer re-verified against the advisor tree before edit or dismissal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The existing advisor strays are removed | `find specs -type d -name .advisor-state` returns zero |
| REQ-006 | One shared helper owns the anchoring so a new writer inherits it | Every converted call site routes through `findAdvisorWorkspaceRoot`; no raw-cwd idiom remains in the advisor writers |
| REQ-007 | Superseded: a `.gitignore` backstop for nested `.opencode` | Retired — the structural resolver makes recurrence impossible for the advisor writers, so a deny-pattern backstop is not required. Non-advisor writers are out of scope (already anchored). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Zero nested `.advisor-state` directories exist under `specs/`, and a writer run from inside a spec folder resolves state to the repo root. (Met — `find` returns zero; regression test green.)
- **SC-002**: The regression test fails when a specs/ cwd would leak state into the packet dir. (Met — reproduced red, then green.)
- **SC-003**: Every advisor writer resolves its state root through the one shared anchored helper. (Met — six writers routed through `findAdvisorWorkspaceRoot`.)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Anchoring the shared path functions changes behavior for temp-root tests | Medium | Verified: `findAdvisorWorkspaceRoot` returns temp dirs (no sentinel, no `.opencode`) unchanged; generation/stress suites stay green |
| Risk | Deleting stray state files breaks a daemon holding a lease | Low | Strays were untracked single files; the daemon recreates state at the correct root |
| Risk | The daemon fallback is rarely hit but still raw cwd | Low | Fallback routed through `findAdvisorWorkspaceRoot` |
| Dependency | The anchored resolver `findAdvisorWorkspaceRoot` | Green | Shipped 2026-07-27; unchanged by this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None. The anchor question is resolved: repo-marker sentinel walk-up via `findAdvisorWorkspaceRoot`, with a structural `hoistAboveOpencodeTree` fallback — not a git-toplevel call or a launcher env var.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Handover**: `../handover.md`
- **Phase parent**: `../spec.md`
- **Research provenance**: `system-speckit/000-release/003-deep-research-synthesis/advisor-state-containment/research/research.md`
