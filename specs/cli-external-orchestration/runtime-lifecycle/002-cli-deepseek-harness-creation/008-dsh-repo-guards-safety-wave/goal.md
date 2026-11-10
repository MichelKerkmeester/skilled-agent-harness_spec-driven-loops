---
title: "Goal: Phase 8: dsh-repo-guards-safety-wave"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh repo guards safety wave goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave"
    last_updated_at: "2026-11-06T07:54:24Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; decision record and current boot remain open."
    next_safe_action: "Record the decision and rerun the current boot."
    blockers: ["decision record missing", "current boot missing"]
    key_files: ["evidence/bundle-node-test-run.txt", "evidence/keyless-guards.stderr.txt", "evidence/negative-control.txt", ".dsh/patches/guards.patch.yml"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-008-dsh-repo-guards-safety-wave"
      parent_session_id: null
    completion_pct: 69
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: dsh-repo-guards-safety-wave

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every dsh dispatch that loads `.dsh/patches/guards.patch.yml` runs the eight repo safety guards through the same shared cores Pi uses, each failing in the direction it declares.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The eight guards are `dispatch-audit`, `dispatch-preflight-lint`, `spec-gate-classify`, `spec-gate-enforce`, `completion-evidence`, `task-dispatch-guard`, `post-edit-quality` and `classifier-injection-screen`. Context, git and MCP guards are out of this phase |
| D2 | Adapters import the shared cores the matching `.pi/extensions/*.ts` imports and hold no copy of policy logic |
| D3 | `spec-gate-enforce` and `dispatch-preflight-lint` fail closed when their core throws. Every other guard's policy is declared in `decision-record.md` and pinned by a test |
| D4 | The bundle loads only through `.dsh/patches/guards.patch.yml`, never from a profile or `$DSH_HOME` |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A keyless `dsh --profile headless` run under a disposable `DSH_HOME` with the route, lineage and `.dsh/patches/guards.patch.yml` patches exits 1 with `MISSING_CREDENTIAL`, and its stderr names no failed plugin and no `startup-*.log` report
- [ ] `node --test` over `.dsh/plugins/repo-guards/` exits 0 with eight verdict-parity cases against `.pi/extensions/*.ts` and eight error-policy throw cases
- [ ] `rg -n -E 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins` exits 1 with no output
- [ ] `decision-record.md` in this folder names the native plugin as chosen and the Claude hook bridge as rejected, citing `hooks-claude-code` absent from the install and its fail-open config parse
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 8 safety guard wave | Built, closure evidence open | The eight adapters and guards patch are present. The bundle suite passes 37 of 37 (`evidence/bundle-node-test-run.txt`). Strict validation prints `RESULT: PASSED` with 0 errors and 0 warnings (`tasks.md:71`). The keyless boot is from 07:18 (`evidence/keyless-guards.stderr.txt`), before the patch and later adapter edits. `decision-record.md` is absent. Details in `implementation-summary.md`. |

### Deviations and findings

| Item | Note |
|------|------|
| Decision record missing | `decision-record.md` is named in `spec.md` and T012, but is absent. AC-005, REQ-005 and T012 stay open. |
| Keyless boot predates the bundle | The recorded run (07:18) predates `guards.patch.yml` (07:37) and the adapter edits at 08:02, 08:04 and 08:18. A rerun is still needed. This closeout did not run dsh. |
| Label scan command | `rg -n -E` exits 2 because ripgrep uses `-E` for encoding. The valid scan, `rg -n 'specs/|packet [0-9]|phase [0-9]' .dsh/plugins/repo-guards`, exited 1 with no matches during this closeout. The command and result are recorded in `implementation-summary.md`. |
| Bundle changed during the closeout | Another process edited adapters and both test files between 08:18:28 and 08:18:55. The counts here come from the 08:19:26 snapshot. |
| Fixes made during the phase | `dispatch-audit` and `dispatch-preflight-lint` now find the checkout from the plugin file, because a lineage cwd outside the repo gave an empty rule tree. `spec-gate-enforce` calls `result.observe()` when its ask verdict delivers the notice. Each fix has a test. |
| Plugin-load detection | The runner checks for `did not activate` in captured stderr after dsh exits. A plugin load failure can therefore leave a run unguarded before the runner reports it (`fanout-run.cjs:3193-3200`). This accepted gap is recorded, not changed here. |
<!-- /ANCHOR:log -->
