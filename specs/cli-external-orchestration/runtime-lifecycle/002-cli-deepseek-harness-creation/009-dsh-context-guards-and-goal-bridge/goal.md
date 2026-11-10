---
title: "Goal: Phase 9: dsh-context-guards-and-goal-bridge"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh context guards and goal bridge goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge"
    last_updated_at: "2026-11-06T07:54:24Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; SYNC.md deferrals and parity checks remain open."
    next_safe_action: "Update SYNC.md and complete the open parity checks."
    blockers: ["phase 008 open", "SYNC.md incomplete", "parity checks open"]
    key_files: [".dsh/plugins/repo-guards/adapters/goal-context.mjs", ".dsh/plugins/repo-guards/adapters/session-start-context.mjs", ".dsh/plugins/repo-guards/README.md", ".dsh/patches/guards.patch.yml"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-009-dsh-context-guards-and-goal-bridge"
      parent_session_id: null
    completion_pct: 43
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: dsh-context-guards-and-goal-bridge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every dsh session started with the guards patch receives the bound packet goal slice and session-start context through the repo-guards bundle.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `goal-context` injects only the `chat_slice` that `goal.cjs packet` prints, never the raw `goal.md` or its frontmatter |
| D2 | `goal-context` and `session-start-context` are required. `prompt-advisor` ships switched off in `.dsh/patches/lineage.patch.yml` |
| D3 | Each of `session-compact-context`, `session-stop-context`, `session-start-advisories`, `git-preflight-advisory`, `git-message-gate` and `decision-capture` ships with a fixture test or is recorded as deferred with its reason in `.dsh/SYNC.md` |
| D4 | Context adapters log and continue when their core throws. None of them blocks a tool call |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A `node --test` case over `.dsh/plugins/repo-guards/` feeds a fixture packet `goal.md` and passes only when the injected context equals the `chat_slice` from `goal.cjs packet` and holds no frontmatter line
- [ ] A `node --test` case on an `agent/created` fixture passes for `session-start-context`
- [ ] A `compaction/summary` fixture case passes, or `rg -n 'session-compact-context.*deferred' .dsh/SYNC.md` matches
- [ ] A keyless `dsh --profile headless` run with the extended `.dsh/patches/guards.patch.yml` under a disposable `DSH_HOME` exits 1 with `MISSING_CREDENTIAL` and names no failed plugin on stderr
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
| Phase 9 context guard wave | Built, verification open | `goal-context`, `session-start-context`, `prompt-advisor` (off by default), `git-preflight-advisory` and `git-message-gate` are in the bundle. The goal-slice case passes. Strict validation prints `RESULT: PASSED` with 0 errors and 0 warnings (`tasks.md:74`). Four deferrals have reasons in the bundle README, but `.dsh/SYNC.md` does not list them all with reasons. The keyless boot (07:53) predates the current bundle. Evidence: `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs`, `.dsh/plugins/repo-guards/README.md`, `evidence/keyless-guards-boot.txt`, `evidence/message-contract-run.txt`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| prompt-advisor switch location | The spec (D2) and T006 put the off switch in `.dsh/patches/lineage.patch.yml`. It sits in `.dsh/patches/guards.patch.yml` as `promptAdvisor: false`, which the bundle reads. The lineage patch is unchanged. The default-off test covers the behavior. T006 stays open. |
| Session-start test stubs its core | The test at line 497 proves the injection path and the call arguments. It does not prove parity with the Pi extension's output for the same workspace. AC-002 stays open. |
| Git gate tested on two messages | The bundle test feeds two messages to the gate. The 38 contract cases pass on their own. AC-005 and T008 stay open. |
| Deferrals not in SYNC.md | The bundle README section 7 names all four deferrals with reasons, which satisfies AC-004. `.dsh/SYNC.md` names only one, without a reason, so AC-006 and T007 stay open. |
| Shared loader for the message module | Adapters call `loadDshLlm()` from `adapters/dsh-llm.mjs`. A bare import of `@deepseek-ai/dsh-llm` did not resolve from this checkout, and the loader falls back to the running dsh binary. A bundle test pins that no adapter imports the module directly. |
| Bundle changed during the closeout | Another process edited six adapters and both test files between 08:18:28 and 08:18:55. The counts in this phase come from the 08:19:26 snapshot. The keyless boot must be rerun after that work lands. |
<!-- /ANCHOR:log -->
