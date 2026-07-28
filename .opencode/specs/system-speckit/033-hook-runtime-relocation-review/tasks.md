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
    last_updated_at: "2026-07-28T14:09:19Z"
    last_updated_by: "claude"
    recent_action: "Implemented Phase 6 (T017-T024): all 6 P1 findings fixed + re-verified"
    next_safe_action: "Re-run /deep:review before the merge/push/leave-local decision"
    blockers:
      - "Re-review not yet run; merge/push/leave-local decision still pending."
    key_files:
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Deep-review result: CONDITIONAL, P0=0 P1=6 P2=4."
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

- [ ] All tasks marked `[x]` (T025, the re-review, is the sole remaining item)
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
- [ ] T025 Re-review (or re-verify) the remediated diff, then resolve the merge/push/leave-local decision. Out of scope for `/speckit:implement` (which terminates before another review pass); the next step is a fresh `/deep:review` dispatch over the remediated diff.
