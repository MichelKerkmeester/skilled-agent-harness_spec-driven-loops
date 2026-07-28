---
title: "Feature Specification: Relocate fully-portable runtime-hook guard cores into .opencode/runtime-hooks/"
description: "Physically relocate the dispatch, mcp-route-guard, post-edit-quality, and task-dispatch guard cores + per-runtime adapters out of their owning skills into a new .opencode/runtime-hooks/ tree, decoupling hook enforcement from skill knowledge, then run a forced 5-iteration deep-review before merge."
trigger_phrases:
  - "hook runtime relocation"
  - "runtime-hooks tree"
  - "fully-portable guard cores"
  - "hook relocation deep review"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored retroactive Level 2 packet for the already-committed hook relocation; initiating forced 5-iteration deep-review before merge"
    next_safe_action: "Run /deep:review:auto (cli-opencode, gpt-5.6-sol, high, stop_policy=max-iterations, maxIterations=5) over the worktree diff"
    blockers: []
    key_files:
      - ".opencode/runtime-hooks/README.md"
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Merge into skilled/v4.0.0.0 now, push the branch only, or leave local, pending deep-review results."
    answered_questions:
      - "Relocation scope: fully-portable set only (dispatch, mcp-route-guard, post-edit-quality, task-dispatch)."
      - "Worktree vs branch: isolated worktree."
      - "Deep-review setup: new packet, force all 5 iterations regardless of early convergence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Relocate fully-portable runtime-hook guard cores into .opencode/runtime-hooks/

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Relocation complete; deep-review pending |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/0118-hook-runtime-relocation` (worktree `.worktrees/0118-skilled-hook-runtime-relocation`, from `skilled/v4.0.0.0`) |
| **Workflow** | Claude plan-mode implementation, followed by `/deep:review:auto` |
| **Authority** | Cross-cutting: `cli-external-orchestration`, `mcp-tooling` (mcp-code-mode), `sk-code`, `system-deep-loop`, `system-spec-kit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

While documenting every lifecycle hook's injections (`injection-contract.md`), the operator asked whether hook implementations should live outside `.opencode/skills/` entirely, since a user might want a skill's knowledge without its enforcement hooks (or vice versa). Before this work, every hook's real source file lived inside the skill tree it enforced, entangling skill knowledge with hook enforcement, and the six runtime mirror directories only held discovery symlinks back into that tree.

### Purpose

Relocate only the guard cores that are genuinely fully-portable (import nothing but Node builtins, or shell out to an unmoved checker by project-root-relative path) into a new `.opencode/runtime-hooks/` tree organized by concern, leaving skill-entangled hooks (spec-gate, session-lifecycle, skill-advisor brief, git-preflight-advisory) in place. Then subject the relocation to a forced 5-iteration `/deep:review` before any merge decision, since the work was done via Claude plan-mode rather than spec-kit and has no prior spec-folder record.

### User Story 1: Hook/skill decoupling

As an operator, I need the fully-portable enforcement hooks to live independently of the skills that happen to reference them, so I can adopt a skill's guidance without necessarily running its hooks, or vice versa.

### User Story 2: Zero functional regression

As an operator running six AI-runtime integrations (Claude, Cursor, Devin, Codex, Pi, OpenCode) concurrently, I need every relocated hook to keep firing identically after the move, with no stale path left behind in config, code, tests, or docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Relocating 4 guard-core families (`dispatch`, `mcp-route-guard`, `post-edit-quality`, `task-dispatch`) + their per-runtime adapters into `.opencode/runtime-hooks/{concern}/{lib,claude,cursor,devin,codex}/`.
- Updating 4 runtime wiring configs (`.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.codex/hooks.json`) and all runtime discovery mirror symlinks.
- Fixing every import/require path in `.pi/extensions/*.ts` and `.opencode/plugins/mk-*.js` that pointed at a moved core.
- Fixing hardcoded cross-adapter subprocess-spawn path constants (Cursor adapters spawning Claude's adapters; `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs`).
- Fixing 5 test files with hardcoded relative-path constants computed for the old directory depth.
- Updating ~20 documentation files (`injection-contract.md`, 4 runtime hook README mirrors, `.opencode/plugins/README.md`, manual-testing-playbook files) to the new paths.
- A forced 5-iteration `/deep:review` (executor `cli-opencode`, model `gpt-5.6-sol`, reasoning `high`, `stop_policy=max-iterations`) over the full diff before any merge.

### Out of Scope

- Spec-gate, session-lifecycle, and skill-advisor-brief hooks — these are genuinely part of their owning skill's own engine (`spec-gate-core.mjs` depends on system-spec-kit's own `gate-3-classifier.js`; the advisor brief IS system-skill-advisor's core deliverable) and were confirmed NOT fully-portable.
- `git-preflight-advisory.mjs` (sk-git) — depends on sk-git's own `git-context.mjs`/`git-rule-checks.mjs`, its real rule engine.
- Moving Pi's or OpenCode's adapter files themselves — both runtimes auto-discover adapters from their own fixed directories (`.pi/extensions/*.ts`, `.opencode/plugins/*.js`), so only their import paths change, not their location.
- Merging the worktree branch into `skilled/v4.0.0.0` — gated on this packet's deep-review outcome and a separate operator go-ahead.

### Surfaces Changed

| Surface | Change Type | Description |
|---------|-------------|-------------|
| `.opencode/runtime-hooks/` (new) | Added | New tree hosting 4 relocated guard-core families + adapters + README. |
| `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `system-deep-loop` skill trees | Modified | Guard cores/adapters removed via `git mv`; skill content otherwise untouched. |
| 4 runtime config files | Modified | Command-string paths repointed. |
| 4 runtime hook mirror dirs (`.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.codex/hooks/`) | Modified | Symlinks re-pointed to new targets. |
| `.pi/extensions/*.ts`, `.opencode/plugins/mk-*.js` | Modified | Import/require paths updated; files stay in place. |
| 5 test files | Modified | Hardcoded relative-path constants corrected. |
| ~20 documentation files | Modified | Path references and cross-links updated. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Relocate only genuinely fully-portable guard cores. | Each moved core imports nothing but Node builtins or an unmoved checker via project-root-relative `spawnSync`. |
| REQ-002 | Zero functional regression across all 6 runtimes. | Every moved/affected test suite passes post-move; live spawn/smoke tests confirm each adapter still fires. |
| REQ-003 | No stale path reference survives the move. | A repo-wide grep for every old path string returns zero hits outside git history. |
| REQ-004 | Subject the relocation to a forced, non-early-converging deep review. | `/deep:review:auto` runs exactly 5 iterations (`stop_policy=max-iterations`) with executor `cli-opencode`, model `gpt-5.6-sol`, reasoning `high`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve git history on every relocated file. | Relocations use `git mv`, confirmed via `git show --stat` on the relocation commit. |
| REQ-006 | Keep documentation in sync with the new tree. | All touched/new README and manual-testing-playbook files pass `validate_document.py` with 0 issues. |
| REQ-007 | Confirm pre-existing, unrelated hub failures are not attributed to this work. | `parent-skill-check.cjs` run against the unmodified main tree reproduces the identical failure list for `mcp-code-mode`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Relocation commit `40d5f0d2b3` contains 25 real `git mv` renames, 58 modifications, 1 addition, with zero unrelated files touched.
- **SC-002**: All directly affected test suites pass post-move (`dispatch-rule-checks.test.mjs` 6/6, `mcp-route-guard.test.cjs` 1/1, `mk-post-edit-quality.test.cjs` + `mk-deep-loop-guard.test.cjs` + `claude-task-dispatch-guard.test.cjs` combined 40/40, `test-root-name-consumer-matrix.cjs` 17/17, `dispatch-audit.test.mjs` 38/38 via its own documented `npx vitest run` invocation).
- **SC-003**: A live Pi session and a live OpenCode session both load all touched extensions/plugins with zero errors.
- **SC-004**: The forced 5-iteration deep review completes with a synthesized verdict (PASS/CONDITIONAL/FAIL) and no unresolved P0 findings before merge.

### Acceptance Scenarios

- **Given** the 4 candidate guard-core families, **When** their import graphs are traced, **Then** only cores importing solely Node builtins (or an unmoved checker via `spawnSync`) are relocated.
- **Given** a hardcoded cross-adapter `spawnSync` path constant, **When** the target file moves, **Then** the constant is updated and the adapter still resolves the child process correctly.
- **Given** the 5 test files with stale relative-path constants, **When** each is fixed, **Then** re-running that file's own documented test runner passes.
- **Given** the completed relocation, **When** `/deep:review` runs 5 forced iterations, **Then** each iteration broadens its review angle (per `stop_policy=max-iterations`) rather than synthesizing early.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Live hook wiring touched across 6 runtimes under heavy concurrent repo use. | A missed path could silently break enforcement for another concurrent session. | Isolated worktree; repo-wide grep sweep; live smoke tests per runtime. |
| Risk | Hardcoded path strings invisible to import-statement greps. | Cross-adapter subprocess-spawn constants could be missed. | Dedicated hardcoded-string sweep (separate from the import-only grep), which did find 5 additional instances. |
| Dependency | `/deep:review` command contract (router + auto YAML). | Review must follow the router's own setup-resolution and dispatch-only rules. | Setup fully resolved via consolidated question before YAML load; no inline review performed by the router. |
| Dependency | Concurrent sessions editing `.pi/extensions/` and the shared main tree. | A concurrent new file (`git-preflight-advisory.ts`) was found only mid-relocation. | Re-swept for concurrent additions before closing; fixed its import path too. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: Every relocated core must remain dependency-free of its former owning skill's other internals.
- **NFR-Q02**: Every touched/new documentation file must pass `validate_document.py` with 0 issues.

### Traceability

- **NFR-T01**: The relocation commit and this review packet must together account for every file touched (no orphaned changes outside the documented surfaces list).

### Reliability

- **NFR-R01**: No runtime's hook wiring may regress; each of the 6 runtimes must be independently verifiable post-move.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Policy Boundaries

- A core that shells out to an unmoved checker script by project-root-relative path (never a static import) still counts as fully-portable — the router/plugin files (`mk-mcp-route-guard.js` etc.) fall in this category and were relocated.
- A core that imports even one sibling file from its owning skill's own engine disqualifies it from this pass (spec-gate, skill-advisor brief, git-preflight-advisory).

### State Transitions

- Deep-review CONDITIONAL/FAIL on P0/P1 findings routes back to `/speckit:plan` → `/speckit:implement` before any merge, per the standard review-path convention.
- Deep-review PASS with no P0/P1 permits proceeding to the (still-open) merge/push/leave-local decision.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 4 concern folders, ~85 files touched across 6 runtimes. |
| Risk | 16/25 | Live hook wiring for concurrent multi-runtime, multi-session use. |
| Research | 10/20 | Import-dependency portability analysis per candidate hook. |
| **Total** | **44/70** | **Level 2 verification packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Merge into `skilled/v4.0.0.0` now, push the branch only, or leave local — deferred until the forced 5-iteration deep review completes.
<!-- /ANCHOR:questions -->
