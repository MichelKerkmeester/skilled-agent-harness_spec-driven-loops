---
title: "Feature Specification: Relocate + consolidate fully-portable hook guard cores into .opencode/hooks/"
description: "Physically relocate the dispatch, mcp-route-guard, post-edit-quality, and task-dispatch guard cores + per-runtime adapters out of their owning skills, then fold the pre-existing git commit-hooks installer in and rename the whole tree to .opencode/hooks/, one root for every hook concept in the repo. Two forced deep-review rounds gate the merge decision."
trigger_phrases:
  - "hook runtime relocation"
  - "hooks tree consolidation"
  - "fully-portable guard cores"
  - "hook relocation deep review"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T17:45:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 7 hooks-tree consolidation complete, verified this pass"
    next_safe_action: "Await merge/push/leave-local decision from operator"
    blockers:
      - "Merge/push/leave-local decision still pending, operator call."
    key_files:
      - ".opencode/hooks/README.md"
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 98
    open_questions:
      - "Merge into skilled/v4.0.0.0 now, push the branch only, or leave local."
    answered_questions:
      - "Relocation scope: fully-portable set only (dispatch, mcp-route-guard, post-edit-quality, task-dispatch)."
      - "Worktree vs branch: isolated worktree, each phase."
      - "Deep-review round 1: CONDITIONAL P0=0/P1=6/P2=4, remediated."
      - "Re-review round 2 (fan-out glm+luna): FAIL P0=4/P1=4/P2=1, remediated."
      - "Hooks-tree consolidation: git/ folded in, tree renamed to .opencode/hooks/."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Relocate + consolidate fully-portable hook guard cores into .opencode/hooks/

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress — Phase 7 hooks-tree consolidation |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/0120-unify-hooks-tree` (worktree `.worktrees/0120-skilled-unify-hooks-tree`, from `skilled/v4.0.0.0`; supersedes the merged `skilled/0118-hook-runtime-relocation` branch for Phase 7 only) |
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

### Remediation Scope (added after the CONDITIONAL review verdict)

The 5-iteration review (see `review/review-report.md`) returned CONDITIONAL: P0=0, P1=6, P2=4. Per operator direction, all 6 active P1s are remediated within this same packet rather than split into a separate follow-up:

- **R2-P1-001** (pre-existing bug, surfaced not caused by this move): `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs`'s `firstPatchPath()` uses a single (non-global) regex match, so a Codex multi-file `apply_patch` only ever gets its first file checked for post-edit quality.
- **R3-P1-001** (pre-existing bug): `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs`'s `isCommandDrivenIteration()` accepts any prompt text containing an "iteration N of M" marker with no structural/cryptographic binding to the real dispatch context, so the marker can be forged to defeat loop-repeat rejection.
- **R3-P1-002** (pre-existing bug): `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs`'s `SECRET_PATTERNS` is a curated allowlist (flag/env/bearer/known-prefix forms); credential-shaped text in any other shape (e.g. a bare PEM block, an unrecognized token format) is not redacted before being persisted to the audit log.
- **R4-P1-001** (gap introduced by this session's own retroactive documentation): 2 manual-testing-playbook files (`cli-dispatch-audit-trail.md`, `codex-hook-parity.md`) still carry executable commands pointing at pre-relocation, skill-owned paths; `checklist.md`'s CHK-011/CHK-041 rows currently overstate these as already fixed.
- **R4-P1-002** (gap introduced by this session's own retroactive documentation): `implementation-summary.md` claims verification "across 6 runtimes" but this session only live-smoke-tested Pi and OpenCode; Claude/Cursor/Devin/Codex were only confirmed via config/symlink/test-suite checks, not live post-move smoke tests.
- **R5-P1-001** (design gap, not a regression): 5 relocated adapters (Claude+Devin task-dispatch, Claude+Codex+Devin mcp-route-guard) hard-import `system-spec-kit/runtime/lib/hook-adapter-shared.cjs` (confirmed: exactly 24 lines, zero external dependencies of its own); `.opencode/runtime-hooks/README.md` currently frames this as equivalent to relying on a Node builtin, which is not accurate for these 5 files.

### Consolidation Scope (Phase 7 — hooks-tree unification)

Operator direction: fold the pre-existing git commit-hooks installer folder (`.opencode/hooks/`) into the runtime-hooks tree as a `git/` subfolder, then rename the whole tree from `.opencode/runtime-hooks/` to `.opencode/hooks/` — one root for every "hook" concept in the repo, resolving the naming collision the original relocation deliberately worked around by choosing the `runtime-hooks` name.

- `git mv .opencode/hooks/{install-hooks.sh,README.md,pre-commit}` into `.opencode/runtime-hooks/git/`, then `git mv .opencode/runtime-hooks .opencode/hooks`.
- **Critical discovery, not previously known**: `.opencode/hooks/pre-commit` is chain-called by the repo's *actual* installed `.git/hooks/pre-commit` (`.opencode/scripts/git-hooks/pre-commit`) as its comment-hygiene sub-gate, via a hardcoded `HYGIENE_HOOK` path. Missing this fix would silently disable comment-hygiene and agent-mirror-sync enforcement repo-wide with no error surfaced.
- Cascading the rename across the same reference surface as the original relocation: 4 runtime configs, 17 runtime discovery symlinks (re-linked and verified resolving to real files), Pi/OpenCode import paths, cross-adapter hardcoded spawn constants, and ~35 documentation files (confirmed via a repo-wide grep for the literal string `runtime-hooks`).
- Fixing 2 stale references (`.opencode/skills/.loop-guard-state/README.md`, `cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md`) that predate even the original relocation — missed by every prior sweep (relocation, both review rounds, both remediation rounds) because none scoped a true repo-wide grep for the `task-dispatch-guard.cjs`/`.mjs` old paths specifically.
- A live git-commit smoke test of the actual hygiene-gate chain (not just a path grep), since this pass's blast radius includes the repo's own commit-time enforcement mechanism.

### Spec-Kit Hook Consolidation Scope (Phase 8)

Operator direction: fold `system-spec-kit`'s remaining second hook home (`runtime/` — the spec-gate enforce/classify/prebind adapters, permission-request-policy, and their `lib/`) into `mcp-server/hooks/`, so all spec-kit hooks live in one place; give every concern folder under `.opencode/hooks/` its own README; and delete the 12 ghost README-only folders left behind at pre-relocation hook locations (plus a rewrite of sk-code's partially-stale hooks README, whose folder still holds a real legacy file).

- `runtime/hooks/{claude,codex,cursor,devin}/*.mjs` merged file-by-file into the existing `mcp-server/hooks/<runtime>/` folders; `runtime/lib/` became `mcp-server/hooks/lib/` (spec-gate core + workspace/repo-root + the ESM `hook-adapter-shared.mjs`). The dead CommonJS twin `hook-adapter-shared.cjs` (zero importers after the earlier dependency-removal) was deleted. Each old per-runtime README's spec-gate content was merged into the existing lifecycle README rather than overwriting it.
- 37 external reference sites repointed: 12 config command strings across all 4 runtime configs, 10 discovery symlinks, 5 code imports (2 OpenCode plugins for `repo-root.mjs`, `mk-spec-gate.js`, 2 Pi extensions), and the live docs/playbooks. Relative-depth imports inside moved files verified with `os.path.normpath` before editing; `spec-gate-core.mjs`'s `shared/dist/gate-3-classifier.js` import gained one level, while prebind's and permission-request-policy's cross-tree imports kept identical depth by construction.
- Five new concern READMEs (`dispatch/`, `mcp-route-guard/`, `post-edit-quality/`, `task-dispatch/`, `shared/`) authored from verified file-header content, linked from the root tree README.

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
| REQ-002 | Zero functional regression across all 6 runtimes, with evidence scoped honestly to what was actually verified. | Every moved/affected test suite passes post-move for all 6 runtimes; live post-move smoke tests are recorded for Pi and OpenCode; Claude, Cursor, Devin, and Codex are verified via config/symlink resolution checks plus their own test suites (not claimed as live-smoke-tested unless a commit-pinned live run is actually recorded). |
| REQ-003 | No stale path reference survives the move. | A repo-wide grep for every old path string returns zero hits outside git history, including manual-testing-playbook executable command blocks. |
| REQ-004 | Subject the relocation to a forced, non-early-converging deep review. | `/deep:review:auto` runs exactly 5 iterations (`stop_policy=max-iterations`) with executor `cli-opencode`, model `gpt-5.6-sol`, reasoning `high`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve git history on every relocated file. | Relocations use `git mv`, confirmed via `git show --stat` on the relocation commit. |
| REQ-006 | Keep documentation in sync with the new tree. | All touched/new README and manual-testing-playbook files pass `validate_document.py` with 0 issues, and every executable command block in those files targets a currently-real path. |
| REQ-007 | Confirm pre-existing, unrelated hub failures are not attributed to this work. | `parent-skill-check.cjs` run against the unmodified main tree reproduces the identical failure list for `mcp-code-mode`. |

### P1 - Remediation (from the CONDITIONAL deep-review verdict)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Fix Codex multi-file post-edit-quality coverage (R2-P1-001). | `firstPatchPath()`-equivalent logic checks every file target in a multi-file `apply_patch`, not only the first; a regression test with a 2+ file patch confirms all targets are checked. |
| REQ-009 | Harden the deep-loop dispatch-guard command-driven exemption against forgery (R3-P1-001). | `isCommandDrivenIteration()` no longer trusts a bare text-pattern match alone; a regression test proves a forged "iteration N of M" marker in free-text prompt content no longer satisfies the exemption unless backed by the real structural dispatch context. |
| REQ-010 | Close the credential-redaction allowlist gap in the dispatch audit log (R3-P1-002). | Credential-shaped text outside the current `SECRET_PATTERNS` allowlist (e.g. unrecognized token/key shapes) is either redacted by a broadened pattern set or never persisted; a regression test with an out-of-allowlist secret-shaped string confirms it does not reach the audit log verbatim. |
| REQ-011 | Fix the 2 stale manual-testing-playbook paths and correct their checklist evidence (R4-P1-001). | `cli-dispatch-audit-trail.md` and `codex-hook-parity.md` point only at real, current paths; `checklist.md` CHK-011/CHK-041 evidence lines reflect the actual state, not an overstated claim. |
| REQ-012 | Resolve the "verified across 6 runtimes" overclaim (R4-P1-002). | `implementation-summary.md` either carries real commit-pinned live smoke evidence for Claude, Cursor, Devin, and Codex, or explicitly states that only Pi and OpenCode were live-smoke-tested and the other 4 were verified via config/symlink/test-suite checks. |
| REQ-013 | Resolve or accurately frame the system-spec-kit dependency in 5 relocated adapters (R5-P1-001). | Either the 5 adapters no longer import `system-spec-kit/runtime/lib/hook-adapter-shared.cjs` (e.g. via a duplicated dependency-free helper inside `runtime-hooks/`), or `runtime-hooks/README.md` states plainly that `system-spec-kit` is a required runtime dependency for those 5 adapters, dropping the Node-builtin-equivalence framing. |
| REQ-014 | Fold `.opencode/hooks/` (git commit-hooks installer) into the runtime-hooks tree as `git/`, then rename the whole tree to `.opencode/hooks/`. | `git mv` history preserved on all 3 git-hooks files and all runtime-hooks-tree files; final tree is `.opencode/hooks/{README.md,dispatch,mcp-route-guard,post-edit-quality,task-dispatch,shared,git}`; zero live references to the literal string `runtime-hooks` or the old bare `.opencode/hooks/{pre-commit,install-hooks.sh,README.md}` paths remain outside git history. |
| REQ-015 | Keep the real git-hooks chain working after the move. | `.opencode/scripts/git-hooks/pre-commit`'s `HYGIENE_HOOK` path points at `.opencode/hooks/git/pre-commit`; a direct invocation of the real installed hook script with a staged forbidden-comment-pattern file blocks (exit 1) and a clean file passes (exit 0). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Relocation commit `40d5f0d2b3` contains 25 real `git mv` renames, 58 modifications, 1 addition, with zero unrelated files touched.
- **SC-002**: All directly affected test suites pass post-move (`dispatch-rule-checks.test.mjs` 6/6, `mcp-route-guard.test.cjs` 1/1, `mk-post-edit-quality.test.cjs` + `mk-deep-loop-guard.test.cjs` + `claude-task-dispatch-guard.test.cjs` combined 40/40, `test-root-name-consumer-matrix.cjs` 17/17, `dispatch-audit.test.mjs` 38/38 via its own documented `npx vitest run` invocation).
- **SC-003**: A live Pi session and a live OpenCode session both load all touched extensions/plugins with zero errors.
- **SC-004**: The forced 5-iteration deep review completes with a synthesized verdict (PASS/CONDITIONAL/FAIL) and no unresolved P0 findings before merge. **Result: CONDITIONAL, P0=0, P1=6, P2=4** -- see `review/review-report.md`.
- **SC-005**: All 6 active P1s from the review (REQ-008 through REQ-013) are resolved and a re-review confirms no regressions before the merge/push/leave-local decision.
- **SC-006**: The Phase 7 hooks-tree consolidation (REQ-014, REQ-015) lands with the live hygiene-gate chain proven working via direct script invocation, not just a path grep.

### Acceptance Scenarios

- **Given** the 4 candidate guard-core families, **When** their import graphs are traced, **Then** only cores importing solely Node builtins (or an unmoved checker via `spawnSync`) are relocated.
- **Given** a hardcoded cross-adapter `spawnSync` path constant, **When** the target file moves, **Then** the constant is updated and the adapter still resolves the child process correctly.
- **Given** the 5 test files with stale relative-path constants, **When** each is fixed, **Then** re-running that file's own documented test runner passes.
- **Given** the completed relocation, **When** `/deep:review` runs 5 forced iterations, **Then** each iteration broadens its review angle (per `stop_policy=max-iterations`) rather than synthesizing early.
- **Given** the git-hooks folder is moved into the runtime-hooks tree, **When** the real installed `.git/hooks/pre-commit` (`.opencode/scripts/git-hooks/pre-commit`) runs, **Then** its `HYGIENE_HOOK` chain-call still finds and executes the moved comment-hygiene gate at its new path.
- **Given** a repo-wide session-level `core.hooksPath` override to a `.no-hooks` sentinel (confirmed pre-existing, shared across worktrees, not caused by this work), **When** the native git-commit trigger itself cannot be exercised, **Then** the hook script's own logic is verified directly instead, and the untestable native-trigger gap is disclosed rather than assumed passing.
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

- **NFR-R01**: No runtime's hook wiring may regress; each of the 6 runtimes must be independently verifiable post-move, either via a recorded commit-pinned live smoke test (Pi, OpenCode) or via config-resolution plus that runtime's own test-suite checks (Claude, Cursor, Devin, Codex) -- claims of "live-verified" must not extend beyond what was actually run live.
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
| Scope | 20/25 | 5 concern folders (incl. `git/`), ~140 files touched across 6 runtimes plus the repo's own git-hook chain. |
| Risk | 19/25 | Live hook wiring for concurrent multi-runtime, multi-session use, now including the repo's own commit-time enforcement mechanism. |
| Research | 12/20 | Import-dependency portability analysis per candidate hook, plus discovering the live git-hooks chain-call dependency. |
| **Total** | **51/70** | **Level 2 verification packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Merge into `skilled/v4.0.0.0` now, push the branch only, or leave local — now includes the Phase 7 hooks-tree consolidation; pending operator decision.
- Whether to independently re-verify the native git-hook trigger (not just the script logic) once the shared `core.hooksPath` `.no-hooks` override is no longer active for this session — flagged, not resolved, since changing that override could affect other concurrent sessions.
<!-- /ANCHOR:questions -->
