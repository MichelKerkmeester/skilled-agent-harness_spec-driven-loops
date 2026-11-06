---
title: "Tasks: Phase 8: dsh-repo-guards-safety-wave"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh repo guards safety wave tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: dsh-repo-guards-safety-wave

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`G` is `.dsh/plugins/repo-guards/`. `GP` is `.dsh/patches/guards.patch.yml`. Authoring mode for every code task is `sk-code` `sk-code-skilled` (TypeScript and JavaScript runtime plugin plus tests). Executor for T004 to T012 is `cli-codex gpt-6-luna xhigh fast`. The orchestrating Claude session runs setup, verification and the docs.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the relative-plugin boot proof from phase 002 (`002-dsh-offline-contract-pin/evidence/plugin-boot.txt`). Verify: `ls ../002-dsh-offline-contract-pin/evidence/plugin-boot.txt` prints the path. Evidence: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/plugin-boot.txt`.
- [x] T002 Confirm the route and lineage patches from phase 004 (`.dsh/patches/`). Verify: `ls .dsh/patches/lineage.patch.yml .dsh/patches/route-llmgateway-deepseek.patch.yml` lists both. Evidence: `.dsh/patches/lineage.patch.yml`, `.dsh/patches/route-llmgateway-deepseek.patch.yml`.
- [ ] T003 [P] Record the Pi verdict per guard for each fixture input by reading the eight `.pi/extensions/*.ts` bindings and their shared cores (`scratch/pi-verdicts.md`). Verify: `rg -c '^\| ' scratch/pi-verdicts.md` prints at least 9.
  - Open: `scratch/pi-verdicts.md` does not exist. The parity cases check each adapter against the shared core that the matching Pi extension imports, so the verdict table was never written.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the bundle entry with the per-guard error policy table (`G` entry module). Verify: the entry lists eight guard ids, `rg -c 'dispatch-audit|dispatch-preflight-lint|spec-gate-classify|spec-gate-enforce|completion-evidence|task-dispatch-guard|post-edit-quality|classifier-injection-screen' G` prints at least 8. Evidence: `.dsh/plugins/repo-guards/index.mjs`.
- [x] T005 [P] Write the `dispatch-audit` and `dispatch-preflight-lint` adapters on `tools/post-execute` and `tools/pre-execute` for `bash`, calling `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and `dispatch-rule-checks.mjs` (`G`). Verify: their parity tests pass. Evidence: `.dsh/plugins/repo-guards/adapters/dispatch-audit.mjs`, `.dsh/plugins/repo-guards/adapters/dispatch-preflight-lint.mjs`, `evidence/bundle-node-test-run.txt`.
- [x] T006 [P] Write the `spec-gate-classify` adapter on `agent/pre-step` and the `spec-gate-enforce` adapter on `tools/pre-execute` for `write`, `edit`, `apply_patch` and `bash`, calling `spec-gate-core.mjs` (`G`). Verify: their parity tests pass. Evidence: `.dsh/plugins/repo-guards/adapters/spec-gate-classify.mjs`, `.dsh/plugins/repo-guards/adapters/spec-gate-enforce.mjs`, `evidence/bundle-node-test-run.txt`.
- [x] T007 [P] Write the `completion-evidence` adapter on `agent/turn-stopping`, calling `completion-evidence-sentinel.cjs` (`G`). Verify: its parity test passes. Evidence: `.dsh/plugins/repo-guards/adapters/completion-evidence.mjs`, `evidence/bundle-node-test-run.txt`.
- [x] T008 [P] Write the `task-dispatch-guard` adapter on `tools/pre-execute` for `subagent` and `subagent_fork`, mapping the harness payload to `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` (`G`). Verify: its parity test passes. Evidence: `.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs`, `evidence/bundle-node-test-run.txt`.
- [x] T009 [P] Write the `post-edit-quality` and `classifier-injection-screen` adapters on `tools/post-execute`, calling `post-edit-router.cjs` and `classifier-injection-advisory.mjs` (`G`). Verify: their parity tests pass. Evidence: `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`, `.dsh/plugins/repo-guards/adapters/classifier-injection-screen.mjs`, `evidence/bundle-node-test-run.txt`.
- [x] T010 Write the parity fixtures and the eight throw tests beside the bundle (`G` tests). Verify: `node --test` over `G` exits 0 with 16 passing cases.
  - Done with a note: the suite now holds 37 cases because phases 009 and 010 added theirs. The eight parity and eight throw cases of this phase pass in `evidence/bundle-node-test-run.txt` (37 pass, 0 fail).
- [ ] T011 Write the guards patch that inserts the relative plugin rows (`GP`). Verify: `--dump-config` with `GP` under a disposable `DSH_HOME` shows the `repo-guards` plugin row.
  - Open: `.dsh/patches/guards.patch.yml` exists, but no dump-config output naming `repo-guards` is saved in evidence, and dsh was not run for this closeout.
- [ ] T012 Write the decision record for native plugin versus the Claude hook bridge (`decision-record.md`). Verify: `rg -n 'hooks-claude-code|fail-open' decision-record.md` prints at least 2 lines.
  - Open: `decision-record.md` is not in this folder.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the keyless guarded boot with no key in env (`GP`). Verify: exit 1, stderr holds `MISSING_CREDENTIAL` and `grep -c -i 'plugin\|startup-' stderr.txt` prints 0.
  - Open: the only recorded run (`evidence/keyless-guards.stderr.txt`, 07:18) predates `guards.patch.yml` (07:37) and the adapter edits at 08:02, 08:04 and 08:18. Its stderr is clean, but it does not cover the current bundle. A rerun is needed, and dsh was not run for this closeout.
- [x] T014 Run the label hygiene scan (`G`). Verify: `rg -n -E 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins` exits 1 with no output. Evidence: `implementation-summary.md` records the valid scan and result. The scanned bundle is `.dsh/plugins/repo-guards/`.
  - Note: the `-E` form exits 2 under ripgrep (`-E` is `--encoding`). The scan ran as `rg -n 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins` and exited 1 with no output at the 08:19 snapshot.
- [x] T015 Update `.dsh/SYNC.md` and the packet's `references/guards-and-hooks.md` with the seam map and error policies (`sk-doc` for the reference). Verify: `rg -n 'repo-guards' .dsh/SYNC.md .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` matches both files. Evidence: `.dsh/SYNC.md`, `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md`.
- [x] T016 Validate the phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: `tasks.md:71` records the final strict run, which printed `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no task row marked `[B]`.
- [ ] Manual verification passed: the keyless guarded run's stderr is saved beside the decision record
  - Open: the stderr is saved in `evidence/`, not beside a decision record, because no decision record exists. The run also needs a rerun on the current bundle (T013).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason in `goal.md` section 4 and keeps its priority.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available: the phase 002 boot proof and the phase 004 patches exist. Evidence: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/plugin-boot.txt`, `.dsh/patches/lineage.patch.yml`, `.dsh/patches/route-llmgateway-deepseek.patch.yml`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The bundle passes the `sk-code-skilled` lint and format checks
  - Open: no lint or format run is recorded for the bundle.
- [ ] CHK-011 [P0] The keyless boot stderr holds no warning other than `MISSING_CREDENTIAL`
  - Open: the recorded stderr is clean, but the run predates the current bundle (T013).
- [x] CHK-012 [P1] Each adapter applies its declared error policy when its core throws. Evidence: `.dsh/plugins/repo-guards/adapters/`, `evidence/bundle-node-test-run.txt`.
- [x] CHK-013 [P1] Adapters import shared cores and copy no policy logic, shown by `rg` for the core paths in `G`. Evidence: `.dsh/plugins/repo-guards/adapters/`, `evidence/bundle-node-test-run.txt`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
  - Open: AC-001 (keyless rerun) and AC-005 (decision record) are unmet. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] The keyless guarded boot run is recorded. Evidence: `evidence/keyless-guards.stderr.txt` and `evidence/keyless-guards.stdout.jsonl`. This run predates the current bundle and does not satisfy AC-001.
- [ ] CHK-022 [P1] Edge cases tested: empty tool input and a chained `bash` dispatch
  - Open: no test in the bundle covers an empty tool input or a chained `bash` command.
- [x] CHK-023 [P1] Error scenarios validated: one throw test per adapter. Evidence: `evidence/bundle-node-test-run.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase builds new behavior and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No adapter reads or logs a provider key, shown by `rg -n -i 'api_?key|\.env' G` printing nothing
  - Open: the literal command prints three lines, all `env` default parameters in the phase 009 and 010 adapters (`options.env`, `env = process.env`). A search for key names alone (`rg -n -i 'api_?key' G`) prints nothing.
- [x] CHK-031 [P0] `spec-gate-enforce` and `dispatch-preflight-lint` deny when their core throws. Evidence: `.dsh/plugins/repo-guards/adapters/spec-gate-enforce.mjs`, `.dsh/plugins/repo-guards/adapters/dispatch-preflight-lint.mjs`, `evidence/bundle-node-test-run.txt`.
- [x] CHK-032 [P1] Auth and authz: N/A, the bundle holds no credential and grants nothing. Evidence: `.dsh/plugins/repo-guards/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same eight guards. Evidence: `spec.md`, `plan.md`, `tasks.md`.
- [x] CHK-041 [P1] Code comments carry the durable reason and no ephemeral label. Evidence: `.dsh/plugins/repo-guards/`, `implementation-summary.md` (label-scan result).
- [x] CHK-042 [P2] `.dsh/SYNC.md` and `references/guards-and-hooks.md` name the bundle. Evidence: `.dsh/SYNC.md`, `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: `ls -la scratch/` showed only the placeholder `scratch/.gitkeep`.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls -la scratch/` showed only the placeholder `scratch/.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 4/8 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06 (closeout pass, bundle snapshot 08:19). Open items are listed above and in `implementation-summary.md`.
<!-- /ANCHOR:summary -->

---
