---
title: "Implementation Summary"
description: "Phase 8 built the repo-guards plugin bundle: eight safety adapters on the shared guard cores, the guards patch and the parity and throw tests. The bundle suite passes. The keyless boot needs a rerun on the final bundle, and the decision record is not written."
trigger_phrases:
  - "dsh repo guards safety wave implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave"
    last_updated_at: "2026-11-06T07:51:36Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; current boot and decision record remain open."
    next_safe_action: "Record the decision and rerun the current keyless boot."
    blockers: ["decision record missing", "current keyless boot missing"]
    key_files: ["evidence/bundle-node-test-run.txt", "evidence/keyless-guards.stderr.txt", "evidence/negative-control.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-008-dsh-repo-guards-safety-wave"
      parent_session_id: null
    completion_pct: 69
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-dsh-repo-guards-safety-wave |
| **Status** | In Progress: built, verification open |
| **Completed** | Not yet |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repo-guards bundle at `.dsh/plugins/repo-guards/` registers eight safety adapters from `index.mjs`. Each adapter turns a dsh event into a call on the shared guard core that the matching `.pi/extensions/*.ts` file imports. The adapters hold no copy of the policy.

| Adapter | dsh event | Scope | Shared core | Error policy |
|---------|-----------|-------|-------------|--------------|
| `dispatch-audit` | `tools/post-execute` | `bash` | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | fail-open, log |
| `dispatch-preflight-lint` | `tools/pre-execute` | `bash` | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | fail-closed, deny |
| `spec-gate-classify` | `agent/pre-step` | latest user message | `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | fail-open, log |
| `spec-gate-enforce` | `tools/pre-execute` | `write`, `edit`, `apply_patch`, `bash` | the same `spec-gate-core.mjs` | fail-closed, deny |
| `completion-evidence` | `agent/turn-stopping` | current assistant turn | `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | fail-open, log |
| `task-dispatch-guard` | `tools/pre-execute` | `subagent`, `subagent_fork` | `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` | fail-open, log |
| `post-edit-quality` | `tools/post-execute` | `write`, `edit`, `apply_patch` | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | fail-open, log |
| `classifier-injection-screen` | `tools/post-execute` | `web_fetch`, `web_search`, `mcp__*` | `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs` | fail-open, log |

The policies come from each adapter's exported `ERROR_POLICY` (observed by `rg`), and they match decision D3: only `spec-gate-enforce` and `dispatch-preflight-lint` fail closed. The guards patch `.dsh/patches/guards.patch.yml` inserts the bundle by the relative path `../plugins/repo-guards/index.mjs`.

Later work in phases 009 and 010 added six more adapters to the same bundle, and this phase's cases still run in the shared suite.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/plugins/repo-guards/index.mjs` | Created in this phase | Registers the adapters on their seams |
| `.dsh/plugins/repo-guards/adapters/*.mjs` (eight guard adapters) | Created in this phase | One adapter per guard, each calling its shared core |
| `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs` | Created in this phase | Parity and throw cases for the eight guards |
| `.dsh/patches/guards.patch.yml` | Created in this phase | Inserts the bundle by relative path |
| `.dsh/SYNC.md` and `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` | Modified in this phase | Name the bundle, its patch and the seam map |
| `evidence/bundle-node-test-run.txt`, `evidence/keyless-guards.stderr.txt`, `evidence/keyless-guards.stdout.jsonl`, `evidence/negative-control.txt` | Created in this phase | Test and boot evidence |
| `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md` (LOG and continuity only) | Edited in the closeout pass | Status and evidence for this phase |
| `decision-record.md` | Not created | Named in the spec, still missing |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In the order the checks ran:

1. Keyless guarded boot (captured 07:18). The run exited 1 with `MISSING_CREDENTIAL`. Its stderr holds one error line, and a case-insensitive search for `plugin` or `startup-` returns nothing. Evidence: `evidence/keyless-guards.stderr.txt` and `evidence/keyless-guards.stdout.jsonl`. The composed patch list is not recorded in these files, and the run predates the current bundle (see Verification).
2. Negative control. A patch that names a missing module makes the boot print `dsh: warning: 1 entry did not activate` and name `repo-guards`. This shows the stderr check catches a failed plugin. Evidence: `evidence/negative-control.txt`.
3. Bundle suite at the 08:19:26 snapshot: `node --test .dsh/plugins/repo-guards/tests/` exited 0 with 37 pass and 0 fail. Evidence: `evidence/bundle-node-test-run.txt`. Eight parity cases and eight throw cases of this phase are among them.
4. Label scan: `rg -n 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins` exited 1 with no output at the same snapshot.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Native relative Cordis plugin, not the Claude hook bridge | The research found the bridge package absent from the install, and it runs no hooks when its config fails to parse, which fails open for every guard. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:220-225]. The decision record that would hold this choice is not written yet. |
| Adapters import the shared cores and copy no policy | Decision D2. Each adapter imports the same core module that its Pi extension imports. |
| Only `spec-gate-enforce` and `dispatch-preflight-lint` fail closed | Decision D3. The other six log and continue. |
| `dispatch-audit` and `dispatch-preflight-lint` locate the checkout from the plugin file | A dsh session runs in a lineage folder, where a cwd-relative rule tree is empty, so the lint allowed every command. A test denies a dispatch from a cwd outside the repository. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bundle suite, `node --test .dsh/plugins/repo-guards/tests/` | Exit 0, 37 pass, 0 fail, snapshot 08:19:26. Evidence `evidence/bundle-node-test-run.txt` |
| Eight parity cases and eight throw cases of this phase | Pass in the same run (counted by name) |
| Error policies | `ERROR_POLICY` matches D3 in all eight adapters (observed) |
| Label scan `rg -n 'specs/\|packet [0-9]\|phase [0-9]' .dsh/plugins` | Exit 1, no output, snapshot 08:19. The criterion's `-E` form exits 2 under ripgrep |
| Keyless guarded boot | Recorded at 07:18 with exit 1 and a clean stderr. Not valid for the current bundle, because `guards.patch.yml` changed at 07:37 and the adapters changed at 08:02, 08:04 and 08:18. A rerun is needed |
| Documentation names the bundle | `rg -l 'repo-guards'` lists `.dsh/SYNC.md` and `guards-and-hooks.md` |
| Strict validation | `RESULT: PASSED`, 0 errors and 0 warnings after the final closeout edits |

Concurrent change: another process edited several adapters and both test files between 08:18:28 and 08:18:55, during this closeout. The counts above describe the 08:19:26 snapshot, and the keyless boot should be rerun after that work lands.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Fixture proof only. Phase 013's keyed runs loaded the bundle with no `did not activate` line, but no run asked for a tool call a guard should deny. Whether the adapters deny and allow on real model tool calls stays UNKNOWN.
2. The parity cases compare each adapter with the shared core that the matching Pi extension imports. They do not run the `.pi/extensions/*.ts` files, and `scratch/pi-verdicts.md` was never written.
3. `decision-record.md` is not written, so the native-plugin choice has no record yet.
4. The keyless boot has not been rerun on the current bundle, so the closure criterion AC-001 stays open.
5. The runner checks for `did not activate` in captured stderr after dsh exits. A plugin load failure can leave a run unguarded before the runner reports it (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3193-3200`). This accepted gap is recorded, not changed in this phase.
6. **Why the status stays In Progress.** T003, T011, T012, T013, CHK-010, CHK-011, CHK-020, CHK-022 and CHK-030 stay open. The spec stays In Progress because the open rows above have no saved evidence in this folder, and a baseline taken before an edit cannot be recaptured afterwards. Each row closes only with a new run. The parent goal's completion criteria are met by phase 013 evidence and the final gate, so these rows do not block the packet goal. The repo-guards plugin and patches these rows name are being extended by the separate DSH hook-parity work, which re-verifies them there.
<!-- /ANCHOR:limitations -->

---
