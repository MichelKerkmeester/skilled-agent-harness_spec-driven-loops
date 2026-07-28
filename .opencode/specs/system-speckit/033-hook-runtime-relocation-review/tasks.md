---
title: "Tasks: Relocate fully-portable runtime-hook guard cores"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook relocation tasks"
importance_tier: "normal"
contextType: "implementation"
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
      - "review/review-report.md"
      - ".opencode/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "Deep-review round 1: CONDITIONAL P0=0/P1=6/P2=4, remediated."
      - "Re-review round 2 (fan-out): FAIL P0=4/P1=4/P2=1, remediated."
---
# Tasks: Relocate fully-portable runtime-hook guard cores

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace import dependencies for dispatch, mcp-route-guard, post-edit-quality, task-dispatch, fable-subagent-guard. [evidence: `rg -n "require|import" .opencode/runtime-hooks` import-graph trace]
- [x] T002 Trace import dependencies for spec-gate, session-lifecycle, skill-advisor brief, git-preflight-advisory; confirm each fails the portability test. [evidence: `rg -n "require|import" .opencode/skills/system-spec-kit` import-graph trace]
- [x] T003 Create isolated worktree `.worktrees/0118-skilled-hook-runtime-relocation` on branch `skilled/0118-hook-runtime-relocation`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv` dispatch/mcp-route-guard/post-edit-quality/task-dispatch cores + adapters into `.opencode/runtime-hooks/{concern}/` (`.opencode/runtime-hooks/README.md`).
- [x] T005 Repoint 4 runtime config files and re-`ln -s` all affected discovery mirror symlinks.
- [x] T006 Fix `.pi/extensions/*.ts` and `.opencode/plugins/mk-*.js` import/require paths, including a concurrent session's new `git-preflight-advisory.ts`.
- [x] T007 [P] Second grep sweep for hardcoded (non-import) path-string constants; fix cross-adapter `spawnSync` targets (Cursor adapters, `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fix and re-verify 5 test files with stale relative-path constants (`dispatch-rule-checks.test.mjs`, `mcp-route-guard.test.cjs`, `mk-post-edit-quality.test.cjs`, `claude-task-dispatch-guard.test.cjs`, `test-root-name-consumer-matrix.cjs`).
- [x] T009 Re-verify `dispatch-audit.test.mjs` via its own documented `npx vitest run` invocation (false-alarm avoided).
- [x] T010 Batch-fix ~20 documentation files; manually recompute relative-depth math for 2 files where the first sed pass was wrong. [evidence: `/tmp/hook-relocation-sed.sh` + Python `os.path.normpath` verification, this session]
- [x] T011 Run `validate_document.py` on every touched/new documentation file.
- [x] T012 Confirm `mcp-code-mode` `parent-skill-check.cjs` failures are pre-existing (identical run against the unmodified main tree).
- [x] T013 Commit relocation as `40d5f0d2b3` (25 `git mv`, 58 modified, 1 added).
- [x] T014 Author this Level 2 review-hosting packet (spec/plan/tasks/checklist/implementation-summary). [evidence: `description.json`/`graph-metadata.json` generated, this session]
- [x] T015 Dispatch `/deep:review:auto`: 5 forced iterations, `stop_policy=max-iterations`, executor `cli-opencode` `gpt-5.6-sol` reasoning `high`.
- [x] T016 Synthesize the review verdict: CONDITIONAL, P0=0 P1=6 P2=4 (`review/review-report.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001-T034 complete; the merge/push/leave-local decision is an operator call, not a task)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (live git-commit hygiene-chain smoke test, all affected test suites, `validate_document.py`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Phase 6: P1 Remediation (packet extension -- all 6 active review findings)

- [x] T017 [P] Fix Codex multi-file post-edit-quality coverage (REQ-008 / R2-P1-001) in `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs` + regression test. [evidence: `patchPaths()`/`filePathsFrom()` now collect every `*** Add/Update/Delete File:` header via `matchAll`, not just the first; new test "Codex hook checks every file named in a multi-file apply_patch" in `mk-post-edit-quality.test.cjs`, 39/39 pass]
- [x] T018 [P] Harden the deep-loop dispatch-guard command-driven exemption against forgery (REQ-009 / R3-P1-001) in `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs` + regression test. [evidence: `isCommandDrivenIteration()` now requires the iteration marker to co-occur with a `Config:` path that resolves to a real, on-disk deep-loop config (mode + maxIterations present); 4 new/updated forgery-regression cases across `claude-task-dispatch-guard.test.cjs` and `mk-deep-loop-guard.test.cjs`, both suites pass]
- [x] T019 [P] Close the credential-redaction allowlist gap (REQ-010 / R3-P1-002) in `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs` + regression test. [evidence: added a bare-PEM-block pattern and a bare-JWT pattern to `SECRET_PATTERNS`; 2 new tests in `dispatch-audit.test.mjs`, 40/40 pass]
- [x] T020 [P] Fix the 2 stale manual-testing-playbook paths (REQ-011 / R4-P1-001): `cli-dispatch-audit-trail.md`, `codex-hook-parity.md`. [evidence: `npx vitest run --root .opencode/runtime-hooks/dispatch/lib dispatch-audit.test.mjs` re-run clean at the corrected path (40/40); codex-hook-parity.md's 2 stale table rows repointed to `.opencode/runtime-hooks/dispatch/codex/...`]
- [x] T021 Correct CHK-011/CHK-041 evidence rows in `checklist.md` to match the actual verification state (REQ-011). [evidence: `checklist.md` CHK-011/CHK-041 updated with the R4-P1-001 finding + T020 fix]
- [x] T022 Resolve the "verified across 6 runtimes" overclaim in `implementation-summary.md` (REQ-012 / R4-P1-002): narrow the claim or add real commit-pinned live evidence for Claude/Cursor/Devin/Codex. [evidence: frontmatter `description` and Verification table narrowed to match `spec.md` REQ-002/NFR-R01's framing; Known Limitations reconciled with the actual CONDITIONAL review outcome]
- [x] T023 Resolve or accurately frame the `hook-adapter-shared.cjs` dependency in the 5 affected adapters (REQ-013 / R5-P1-001), updating `.opencode/runtime-hooks/README.md` accordingly. [evidence: new `.opencode/runtime-hooks/shared/hook-adapter-shared.cjs`; all 5 adapters repointed to it (zero remaining `system-spec-kit` import from this tree, confirmed via `rg`); README's dependency framing corrected]
- [x] T024 Re-run all affected test suites and `validate_document.py` after the Phase 6 fixes. [evidence: combined `node --test` 48/48, `vitest` 40/40, `test-root-name-consumer-matrix.cjs` 17/17, `validate_document.py` 0 issues on all 5 touched docs, this session]
- [x] T025 Re-review the remediated diff: fan-out `/deep:review:auto` (`cli-devin`/`glm-5-2` + `cli-pi`/`gpt-5.6-luna`, 3 iters each, `stop_policy=max-iterations`, `lineage_mode=restart`). [evidence: FAIL, P0=4 P1=4 P2=1, all from `glm` (`luna` never dispatched -- pre-existing `fanout-run.cjs` cli-pi stub, not a config error); all 7 findings independently re-verified via direct grep/module-resolution checks and fixed this pass (4 broken imports in system-spec-kit/sk-git, 3 stale doc references); `review/review-report.md`]

## Phase 7: Hooks-Tree Consolidation (REQ-014, REQ-015)

- [x] T026 `git mv` the git-hooks trio into `.opencode/runtime-hooks/git/`, then `git mv .opencode/runtime-hooks .opencode/hooks`. [evidence: caught and corrected a nesting mistake mid-move before anything was committed; final tree verified via `find .opencode/hooks -maxdepth 2`]
- [x] T027 Fix the critical live-wiring line: `.opencode/scripts/git-hooks/pre-commit`'s `HYGIENE_HOOK` path -> `.opencode/hooks/git/pre-commit`. [evidence: this was a previously-undiscovered dependency -- `.opencode/hooks/pre-commit` is chain-called by the repo's actual installed hook, not standalone]
- [x] T028 Fix `.opencode/hooks/git/install-hooks.sh`'s own `HOOKS_SRC`/`REPO_ROOT` self-reference (new directory is 1 level deeper) and add a primary-installer clarification note.
- [x] T029 Cascade-fix ~11 doc references to the old bare `.opencode/hooks/{pre-commit,install-hooks.sh,README.md}` paths, and ~54 files containing the literal string `runtime-hooks`. [evidence: repo-wide grep sweep before/after, 0 remaining live hits]
- [x] T030 [P] Re-point 17 runtime discovery mirror symlinks (`.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.codex/hooks/`); verify each resolves to a real file.
- [x] T031 [P] Second-sweep grep beyond the mechanical substitution found 2 stale references predating even the original relocation, missed by every prior sweep: `.opencode/skills/.loop-guard-state/README.md`, `cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md` (both cited pre-relocation `task-dispatch-guard.cjs`/`.mjs` paths). Fixed.
- [x] T032 Rewrite `.opencode/hooks/README.md`'s OVERVIEW and directory-tree diagram for the unified scope (old collision-explanation prose no longer applies).
- [x] T033 Live git-commit smoke test of the hygiene-gate chain via direct script invocation (staged forbidden-comment file blocked exit 1; clean file passed exit 0). [evidence: native git-hook trigger untestable this session -- a shared, repo-wide `core.hooksPath` override to a `.no-hooks` sentinel in the common `.git/config` predates this work and was not changed, since it could affect concurrent sessions]
- [x] T034 Re-run all directly affected test suites and `validate_document.py` on all 35 touched docs. [evidence: 73/74 `node --test` real passes (1 pre-existing "dist not built in fresh worktree" environment gap, unrelated to this move); `vitest` 40/40; `validate_document.py` 0 issues]

## Phase 8: Spec-Kit Hook Consolidation + README Coverage + Ghost Cleanup

- [x] T035 Merge `system-spec-kit/runtime/` into `mcp-server/hooks/` (per-runtime files file-by-file, `lib/` as `mcp-server/hooks/lib/`); delete the zero-importer `hook-adapter-shared.cjs`; remove the empty `runtime/` tree. [evidence: `git status` renames; empty-dir check]
- [x] T036 Merge each old per-runtime README's spec-gate content into the existing `mcp-server/hooks/<runtime>/README.md` as a new SPEC-GATE section, then remove the old README. [evidence: 4 merged READMEs, all `validate_document.py` clean]
- [x] T037 Fix in-tree relative imports (verified with `os.path.normpath` before editing) and module-resolution-smoke every moved `.mjs`. [evidence: 10/10 OK; `spec-gate-core.mjs` and its test gained one `../` on the `shared/dist` import; prebind and permission-request-policy depths unchanged by construction]
- [x] T038 Repoint 37 external reference sites: 12 config command strings (4 files, JSON re-validated), 10 symlinks (re-linked, resolution verified, zero broken links across all 4 mirrors), 5 code imports, live docs/playbooks. [evidence: repo-wide grep for `system-spec-kit/runtime` -> 0 live hits]
- [x] T039 [P] Author 5 concern READMEs (`dispatch/`, `mcp-route-guard/`, `post-edit-quality/`, `task-dispatch/`, `shared/`) and link from the root tree README. [evidence: `validate_document.py` 0 issues each]
- [x] T040 [P] Delete 12 ghost README-only folders; rewrite `sk-code/code-quality/scripts/hooks/README.md` around its one remaining legacy file; post-deletion dangling-link sweep fixed 2 stale narration sites (cursor task-dispatch adapter comment, `.opencode/hooks/README.md` helper-twin claim corrected to the `.mjs` sibling). [evidence: grep sweep; git rm list]
- [x] T041 Verification: 172/175 `node --test` pass (0 fail, 3 suite-internal skips), 3 plugin import smokes OK, live Pi smoke exit 0, spec-gate replay at new path returns sane allow, 17 touched docs validate clean.
