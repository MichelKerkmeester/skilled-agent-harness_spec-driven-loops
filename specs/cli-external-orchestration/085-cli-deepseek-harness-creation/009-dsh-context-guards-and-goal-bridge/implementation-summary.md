---
title: "Implementation Summary"
description: "Phase 9 added the goal-context, session-start-context, prompt-advisor and two git adapters to the repo-guards bundle. The goal slice test passes and the README deferral satisfies AC-004. Session-start parity, SYNC.md deferrals and the current keyless rerun remain open."
trigger_phrases:
  - "dsh context guards and goal bridge implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge"
    last_updated_at: "2026-11-06T14:31:13Z"
    last_updated_by: "generate-context"
    recent_action: "AC-004 met from README; parity, SYNC and keyless rerun stay open."
    next_safe_action: "Complete the SYNC deferrals and parity checks."
    blockers:
      - "Phase 008 open"
      - "SYNC.md incomplete"
      - "Parity and keyless rerun open"
    key_files:
      - "009-dsh-context-guards-and-goal-bridge/goal.md"
      - ".dsh/plugins/repo-guards/README.md"
      - ".dsh/SYNC.md"
      - "009-dsh-context-guards-and-goal-bridge/evidence/keyless-guards-boot.txt"
      - "009-dsh-context-guards-and-goal-bridge/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-009-dsh-context-guards-and-goal-bridge"
      parent_session_id: null
    completion_pct: 43
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
| **Spec Folder** | 009-dsh-context-guards-and-goal-bridge |
| **Status** | In Progress: built, verification open |
| **Completed** | Not yet |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dsh session started with the guards patch now gets the bound packet's goal slice and the session-start context, through the same bundle that phase 008 created. Five adapters were added, and a shared loader for the harness message module. Four optional adapters are deferred, and each deferral has a reason in the bundle README.

| Adapter | dsh event | Scope | Shared core or module | Error policy |
|---------|-----------|-------|------------------------|--------------|
| `goal-context` | `agent/created` | Chat slice of the packet named by `DSH_SPEC_FOLDER` | `.skilled/hooks/goal/lib/goal-core.cjs` | fail-open, log and continue |
| `session-start-context` | `agent/created` | Output of `session-prime.js`, run as a child process | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` | fail-open, log and continue |
| `prompt-advisor` | `agent/pre-step` | Latest user message | `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`, loaded dynamically | fail-open, log and continue. Off by default |
| `git-preflight-advisory` | `tools/post-execute` | Bash git commands | `.skilled/skills/sk-git/scripts/lib/git-context.mjs`, `git-rule-checks.mjs` and `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | fail-open, adds advisory context |
| `git-message-gate` | `tools/pre-execute` | Bash commands the message contract covers | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` and `scripts/lib/message-contract.mjs` | fail-open on unexpected errors, deny on `ContractError` |

`adapters/dsh-llm.mjs` is the shared loader for `@deepseek-ai/dsh-llm`. Every message-building adapter calls `loadDshLlm()`. The loader tries a bare import first and then resolves the module from the running dsh binary. The fallback exists because the phase found that a bare import does not resolve from this checkout (probe result: `ERR_MODULE_NOT_FOUND`). A bundle test pins that no adapter imports the module directly.

The guards patch sets `promptAdvisor: false`. The adapter registers only when a row sets that flag to `true`.

Deferred adapters, with reasons from `.dsh/plugins/repo-guards/README.md` section 7:

- `session-compact-context`: `compaction/summary` is UNKNOWN in the source event index, which lists only `compaction/summary-error`.
- `session-stop-context`: `agent/disposed` exists, but its source contract does not confirm session shutdown semantics.
- `session-start-advisories`: the Pi implementation runs several scripts, not one plain shared function.
- `decision-capture`: `agent/turn-stopping` exists, but the DSH answer-channel semantics are UNKNOWN.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/plugins/repo-guards/adapters/goal-context.mjs`, `session-start-context.mjs`, `prompt-advisor.mjs`, `git-preflight-advisory.mjs`, `git-message-gate.mjs` | Created in this phase | The five adapters above |
| `.dsh/plugins/repo-guards/adapters/dsh-llm.mjs` | Created in this phase | Shared loader for the harness message module |
| `.dsh/plugins/repo-guards/index.mjs` and `tests/repo-guards.test.mjs` | Modified in this phase | Registers the adapters, adds their cases |
| `.dsh/plugins/repo-guards/README.md` | Updated for this phase | Adapter inventory, error policies and the deferral section |
| `.dsh/patches/guards.patch.yml` | Modified in this phase | Sets `promptAdvisor: false` |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` | Modified in this phase | Seam map for the second wave |
| `.dsh/SYNC.md` | Not updated | Does not yet name goal-context or the four deferrals with reasons |
| `evidence/keyless-guards-boot.txt`, `evidence/message-contract-run.txt` | Created | Boot and contract evidence. `message-contract-run.txt` was saved during the closeout pass |
| `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md` (LOG and continuity only) | Edited in the closeout pass | Status and evidence for this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In the order the checks ran:

1. Keyless boot with the full route, lineage and guards patches (captured 07:53). Exit 1, one `MISSING_CREDENTIAL` line, and zero `did not activate` lines. Evidence: `evidence/keyless-guards-boot.txt`. The run predates the adapter edits at 08:02 to 08:18.
2. Goal slice test. The bundle test at `tests/repo-guards.test.mjs` line 420 passes. It runs `goal.cjs packet` on a fixture, asserts that the injected text equals the printed `chat_slice`, and rejects a `---` line.
3. Bundle suite at the 08:19:26 snapshot: `node --test .dsh/plugins/repo-guards/tests/` exited 0 with 37 pass and 0 fail. Evidence: `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt`.
4. Git message contract suite: `node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` exited 0 with 38 pass and 0 fail. Evidence: `evidence/message-contract-run.txt`. This suite is not run through the gate (see Known Limitations).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `goal-context` injects only the `chat_slice` | The test asserts equality with the `goal.cjs packet` output, so frontmatter cannot reach the model unnoticed. |
| Context adapters log and continue | Missing context must not block a dispatch. The four context adapters never return a deny. |
| `prompt-advisor` is off by default through the guards patch | The phase planned the switch in the lineage patch, but the implementation keeps it in `guards.patch.yml`, where the bundle reads it. The lineage patch is unchanged. See `goal.md` section 4. |
| Four optional adapters are deferred, not built | Each one has an unconfirmed seam contract or no single shared function to call, as the bundle README records. Each deferral carries its reason there. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal slice test (`tests/repo-guards.test.mjs` line 420) | Passes in the 37/0 suite run |
| Session-start case (line 497) | Passes, with the session-prime core stubbed |
| Prompt advisor default-off case (line 544) | Passes |
| Context adapters never return a deny | `rg` for a deny return in `goal-context.mjs`, `session-start-context.mjs`, `prompt-advisor.mjs` and `git-preflight-advisory.mjs` returns no match |
| Key names in the bundle | `rg -n -i 'api_?key' .dsh/plugins/repo-guards` returns no match |
| Label scan `rg -n 'specs/\|packet [0-9]\|phase [0-9]' .dsh/plugins` | Exit 1, no output, 08:19 snapshot |
| Git message contract suite | Exit 0, 38 pass, 0 fail (`evidence/message-contract-run.txt`) |
| Keyless boot | Recorded at 07:53. Predates the adapter edits at 08:02 to 08:18, so a rerun on the current bundle is needed |
| Strict validation | `RESULT: PASSED`, 0 errors and 0 warnings after the final closeout edits |

Concurrent change: another process edited several adapters and both test files between 08:18:28 and 08:18:55, during this closeout. The counts above describe the 08:19:26 snapshot.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Seams proven on fixtures only. Phase 013's keyed runs saved no record of the compaction or disposal seams firing, so whether they fire in a short headless run stays UNKNOWN.
2. The session-start test stubs the session-prime core. The adapter's output has not been compared with the Pi extension's output for the same workspace (AC-002).
3. The git message gate has two bundle cases. The 38 contract cases pass on their own, and the gate is not run through them (AC-005).
4. `.dsh/SYNC.md` does not name goal-context or the four deferrals with reasons. The bundle README does (AC-006). SYNC.md is outside this closeout's write scope.
5. The keyless boot has not been rerun on the current bundle (AC-003).
6. **Why the status stays In Progress.** T001, T003 and T006 to T013 stay open, with CHK-003, CHK-010, CHK-011, CHK-020, CHK-022 and CHK-042. The spec stays In Progress because the open rows above have no saved evidence in this folder, and a baseline taken before an edit cannot be recaptured afterwards. Each row closes only with a new run. The parent goal's completion criteria are met by phase 013 evidence and the final gate, so these rows do not block the packet goal. The repo-guards plugin and patches these rows name are being extended by the separate DSH hook-parity work, which re-verifies them there.
<!-- /ANCHOR:limitations -->

---
