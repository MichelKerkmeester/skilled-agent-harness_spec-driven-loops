---
title: "Implementation Summary"
description: "Phase 3 built and reworked after two reviews: bots run with the stop layers, posture and secret refusals, needs-you parking and the hold, the decision marker read from each kind's final answer, receipts under the user-level state root, the result event through the append gateway, and read-only bots on OpenCode (an allowlist checked against the resolved agent) and Mistral Vibe (judged by its export). 194 tests pass. The live codex run and the live OpenCode and Vibe probes passed."
trigger_phrases:
  - "manual runner implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/003-manual-runner"
    last_updated_at: "2026-11-23T06:30:00Z"
    last_updated_by: "phase-builder"
    recent_action: "Recorded the live codex run and the live OpenCode and Vibe probes"
    next_safe_action: "Orchestrator commits the phase"
    blockers:
      - "CHK-120: rollback not run in a copy"
    key_files:
      - ".skilled/bin/bots.cjs"
      - ".skilled/skills/system-skilled-bots/runtime/lib/runner.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/posture.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/switches.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-003-manual-runner"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "spec.md REQ-023 still describes the first build's OpenCode deny list; the build now uses an allowlist (ADR-008 third review)"
    answered_questions:
      - "OpenCode and Mistral Vibe: support read-only now (operator, 2026-11-22, ADR-008)"
      - "Second review: fix all, third review (operator, 2026-11-22, ADR-008 third review)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-manual-runner |
| **Completed** | Not closed: every acceptance row is Met or Superseded and the live run and probes passed; CHK-120 (rollback in a copy) and the docs items CHK-123, CHK-124 and CHK-042 stay open |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots run <id>` now runs one bot from `bots/<id>/BOT.md` once, in the shared checkout, and leaves one run record under the user-level state root. Every stop before dispatch is a refusal with its own exit code and a named cause, a child that asks a question parks the run as a needs-you item, and that open item holds the bot until it is answered or expires.

### Phase 3: manual-runner

The run order is: definition, disable switch, needs-you hold, lease, pause switch, precheck, posture, secret check, result-ledger binding, dispatch, result event, record. The dispatch goes through the deep-loop lineage command builder and the audited runner, so the environment allowlist, the recursion guard and the dispatch receipts are the deep-loop runtime's own. The result event goes through the deep-loop append gateway, so a failed write is retried by re-sending the same event.

### Review rework (2026-11-22)

- **Decision marker per output format.** A Claude Code child runs with `--output-format stream-json`, so its marker sits inside the final `result` event, never at the start of a line. The runner now reads each kind's final answer first: deep-loop's own `readClaudeStreamFinalText` for Claude Code, the `final` event's `text` for the DeepSeek Harness (the shape of the observed capture under `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/`), and the raw output for text kinds. A kind whose format the runner cannot read is refused as `decision-marker-unreadable`; today that only backs up the existing OpenCode refusal, which is unchanged.
- **Hardening.** A refused item write ends the run as `needs-you-item-refused:<reason>`, class `hub`. An item file that does not read holds the bot (`needs-you-unreadable`) unless it still names another bot. A throw inside a run writes one failure record, `runner-error`, classed `environment` for a system call error and `hub` otherwise.
- **Receipts out of the run folder** (operator decision D14, ADR-006): `<state root>/<identity key>/receipts/<run id>/`.
- **Result event through the append gateway** (operator decision D15, ADR-007): `result-ledger.ts` registers the bots mode's event type, allow policy, authority root (`<state root>/authority`) and HEAD binding. `runBot` is async as a result.

### Read-only OpenCode and Mistral Vibe (2026-11-22)

The operator chose "Support read-only now" (ADR-008). Both shared deep-loop builders now carry a read-only tool-narrowing profile, and the posture matrix admits both kinds for read-only only:
- **OpenCode.** A read-only lineage gets `OPENCODE_CONFIG_CONTENT` denying edit, write, bash and task (and external_directory), written after any inherited permission keys. The builder no longer refuses read-only. `opencode debug agents --standalone` on OpenCode 2.3.2 showed those keys translated into `edit`, `shell` and `subagent` denies on the default agent (`scratch/opencode-permission-probe.txt`).
- **Mistral Vibe.** A read-only lineage gets `--enabled-tools read_file --enabled-tools grep`, the two read tools `vibe config schema` lists for Vibe 3.1.2 (`scratch/vibe-tool-names.txt`), and `SPECKIT_DIST_AUTO_REBUILD=0`, so the session-start hook cannot rebuild dist output in the checkout outside any tool. A Vibe config accepts `read-only` as its only sandbox value.
- **Recorded truthfully.** Both are recorded as `sandboxEnforcement: compensating`, never as an OS sandbox, and stay `false` in `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`. workspace-write and danger-full-access build as before.
- **Runner.** The dispatch now forwards the builder's environment and working folder, which carry the OpenCode denies and Vibe's lineage home. A Vibe run gets a private temp lineage folder, removed after the run; only `vibe-export.json` is kept, beside the receipts. OpenCode's `--format json` answer is read from the text parts of its last message, in the shape of a committed real capture.

### Third review (2026-11-22)

The operator answered the second review with "Fix all, third review". Each finding was reproduced first, then fixed at its source (ADR-008, third review):
- **OpenCode read-only is an allowlist.** `"*": "deny"`, then read, grep, glob and list, then the external_directory deny. The old deny list left every unlisted tool, MCP tools included, approved under `--auto` (`scratch/opencode-agent-probe-before.txt`).
- **The agent that runs is the one checked.** The rules are written under `agent.build` too, which OpenCode applies after a project's agent rules, and the lineage passes `--agent build`. The deep-loop builder then resolves the agent with `opencode debug agents --standalone` in the child's folder and environment, no model call, and refuses unless every non-read action ends on a deny. The check sits in the shared builder, so the fan-out and `dispatch-iteration` lineages get it too. The bots runner records it as `read-only-unconfined`.
- **Vibe is judged by its export.** A clean exit goes through deep-loop's `validateVibeCompletion`; an unfinished export fails the run as `vibe-run-unfinished`.
- **The Vibe child is told the checkout.** A kind that starts in a lineage folder gets one prompt line naming the checkout's absolute path, and the live probe now asks by relative path, with an MCP fixture and an agent-override fixture added.
- **Minor findings.** A throw after the seed or the lease ends in one record and releases the lease; a parked run whose result event fails keeps its item id; a needs-you folder that cannot be listed holds the bot.

One deviation: the agent-override fixture was expected to end refused. The probe proved the agent-level rules win, so it is admitted with every non-read action denied; the refusal path is proven with stubbed resolver output and a mutation control.

### Live verification (2026-11-22 and 2026-11-23)

Four operator-approved live results, each run by the orchestrator through the bots runner on a real executor:

- **Codex live run.** A read-only manual bot `hello` ran on `cli-codex` in a scratch consumer with no remote and its identity in `bots/config.json`. It exited 0 and `converged` (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:3`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:53`), records went from 0 to 1 (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:4`), the consumer's `git status --short` was empty before and after (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:5`), the run folder held no receipt and no prompt text, with the receipts under the state root (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:6`), and the child answered correctly (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:7`).
- **The `skilled-tree-is-worktree` finding.** The first codex attempt exited 4, refused before dispatch as `run-folder-refused: skilled-tree-is-worktree`, with no dispatch and no record (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:2`), because the Skilled tree was a linked worktree. A dev checkout that is a worktree must pass `--skilled-tree` naming the primary checkout, as the second attempt did.
- **OpenCode probe.** All three fixtures (plain, MCP, agent-override) passed with bots exit 0, no probe file, the read-only record and the token read by relative path (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:14`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:28`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:43`). The agent-override fixture was admitted, the inline `agent.build` rules winning (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:40`). No edit, write, bash or MCP tool_use event was logged (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:13`), so "no write" may mean the model never tried; the positive proof of the deny is the resolver output (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/opencode-agent-probe-after.txt:37`).
- **Vibe rerun.** After the cleanup fix below, bots exited 0 and `converged`, both writes were denied, the token was read and `enabled_tools` was exactly `read_file` and `grep` (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:3`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:12`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:15`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:17`). The orchestrator saw no lineage folder left in TMPDIR.

The one deviation is the Vibe lineage cleanup, described next: the first Vibe probe proved the narrowing but failed the run on read-only plugin folders, and T052 fixed it before the rerun.

### Live probe deviation: Vibe lineage cleanup (2026-11-23)

The first approved live Vibe probe (`scratch/live-probe-mv-result.txt`) showed the narrowing hold: the token was read by relative path, both writes were denied, and the export reported `outcome: finished`, `exit_code: 0` and `enabled_tools` exactly `read_file` and `grep`. The bots run still ended `runner-error` (class environment) and exit 1. Real Vibe leaves plugin package folders under `VIBE_HOME/logs/session/plugins/packages/` with mode `dr-x------`, so the recursive remove of the lineage folder threw `ENOTEMPTY` after the run was judged, and the throw became the run's outcome. The fix makes every folder under the lineage folder owner-writable through `node:fs` before removing it, and a removal that still fails is a warning on stderr: the folder is private to the user, so a leftover is untidy, not a leak. The probe script printed PASS despite the exit 1; each fixture now fails unless bots exits 0, and only the agent-override fixture may also end 4. The leftover folder from that probe was removed. The operator-approved rerun on 2026-11-23 ended bots exit 0 (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:6`), so AC-025 is Met.

| Exit | Meaning |
|------|---------|
| 0 | Completed |
| 1 | Run failure |
| 2 | Usage |
| 3 | Recursion guard refused |
| 4 | Refused before dispatch |
| 5 | Awaiting a decision |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/bots.cjs` | Create | CLI: `run`, `disable`, `enable`, `pause`, `resume`, `inbox`. Exits 2 on a misspelled option |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Create | Run order, lease, refusal causes, killed-run closing, generation stamp, exit codes |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Create | Prompt, guard environment, run marker, secret-literal detector, decision-marker parser, audited dispatch |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Create | Posture matrix read from the deep-loop executor tables |
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts` | Create | Disable and pause files under the state root |
| `.skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts` | Create | The bots registration with the append gateway and the replaying result send |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Contract change: `receipts` folder, `receiptFolder` and the shared `authority` root |
| `.skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts`, `index.ts`, `authority-selector.ts` | Modify | Shared: `system-skilled-bots` joins the mode type, and `AUTHORITY_CALLER_MODES` and `AUTHORITY_ADMITTED_MODES` are added and exported; the selector admits the latter. The flip order is unchanged (ADR-007) |
| `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` | Modify | Shared: the admission check reads `AUTHORITY_ADMITTED_MODES` (ADR-007) |
| `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md`, `per-mode-authority-flip/README.md` | Modify | Name the admitted-modes check |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modify | Contract change: items carry `prompt` and `specFolder`; listing, hold lookup and resumed prompt added |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | Contract change: optional `exit.refusal` and `request.resumedItemId`, both validated |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | One allowlist entry, `SKILLED_BOT_RUN_ID`, with its comment (shared file, ADR-005) |
| `.skilled/skills/system-skilled-bots/runtime/tests/` | Create/Modify | Runner, kill, hardening, result-ledger, posture, dispatch and switch tests, 14 fixture bots, a stub codex, a stub claude that prints stream-json, and stub opencode and vibe executors. Phase 1 needs-you, run-record and state-root tests extended |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts`, `lib/dispatch.ts` | Modify | Read-only admission for the `permission-config` surface; the builder's environment and working folder forwarded, the Vibe temp lineage folder, and the `opencode-json` reader (ADR-008) |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Shared: the OpenCode read-only refusal removed; read-only profiles for OpenCode and Vibe, recorded as compensating (ADR-008) |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Shared: OpenCode's surface `permission-config`, Vibe's `tool-allowlist`, Vibe's read-only-only `sandboxMode` (ADR-008) |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Shared: `VIBE_HOME` and `SPECKIT_DIST_AUTO_REBUILD` in Vibe's `DISPATCH_ENV_KEYS` (ADR-008) |
| Six deep-loop test files | Modify | The tests that pinned the refusal and Vibe's missing sandbox now assert the profiles (ADR-008) |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Shared, third review: the OpenCode allowlist, the rules under `agent.build`, `--agent build`, the agent resolver and `OpencodeReadOnlyUnconfinedError`, and the exports `OPENCODE_READ_ONLY_UNCONFINED` and `opencodeReadOnlyGap` |
| `fanout-run.vitest.ts`, `dispatch-iteration.vitest.ts`, `executor-adapter-capabilities.vitest.ts`, `combo-matrix.vitest.ts` under `.skilled/skills/system-deep-loop/runtime/tests/unit/` | Modify | Shared, third review: assert the allowlist, the agent-level rules and `--agent build`, give each read-only OpenCode build a stubbed resolver, and cover the refusals |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts`, `lib/runner.ts`, `lib/needs-you.ts`, `lib/run-record.ts`, `.skilled/bin/bots.cjs` | Modify | Third review: the `read-only-unconfined` refusal, the Vibe export verdict, the checkout line, the two run scopes, the parked item id on a failed result send (a contract change in `run-record.ts`), and the unlistable needs-you hold |
| Bots tests and the stub `opencode` and `vibe` | Modify | Third review: seven tests added; the stub `opencode` answers `debug agents`, the stub `vibe` takes `STUB:export-exit` |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts`, the stub `vibe`, `runner.vitest.ts`, `dispatch.vitest.ts`, `scratch/live-probe-readonly.sh` | Modify | Live-probe deviation: `removeLineageFolder` makes folders owner-writable before removing and only warns on failure; the stub `vibe` takes `STUB:readonly-tree`; the probe fails a fixture whose bots exit is not 0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed `/speckit:implement` in autonomous mode in the worktree on branch `system-skilled-bots`, beside the phase 2 builder, whose files were not edited. The orchestrator barred any real executor, so every run in the tests dispatches to a stub `codex` placed first on a PATH that holds nothing else an executor could be found on. The real deep-loop builder, environment filter, recursion guard and receipts still run.

Proof, in the order it ran:
1. Before the allowlist entry, a probe showed `buildExecutorDispatchEnv` dropping `SKILLED_BOT_RUN_ID` (`scratch/allowlist-before.txt`); after it, the key passed (`scratch/allowlist-after.txt`).
2. A clean deep-loop baseline ran with the entry absent: 222 files, 4039 passed, 11 skipped. A first baseline overlapped an early edit, so it is kept apart and not used.
3. The bots suite and the typecheck ran. Removing the allowlist entry made the run-marker test fail; restoring it made it pass.
4. The deep-loop suite reran with the entry: 222 files, 4039 passed, 11 skipped, the same as the baseline.

Rework, in the order it ran:
1. A clean deep-loop baseline ran before any deep-loop edit, with the deep-loop diff hashed before and after the run so no edit could overlap it (the first build's contaminated baseline overlapped an edit): 222 files, 4039 passed, 11 skipped, exit 0 (`scratch/deep-loop-baseline-rework.txt`).
2. A stub `claude` printing stream-json with the marker in its `result` event made the new runner test fail against the old parser (`scratch/negative-control-stream-json.txt`); the fix made it pass.
3. ADR-006 and ADR-007 were written, with every caller of the gateway, the mode order and the registries named, before the deep-loop edit.
4. The bots suite and both typechecks ran; moving the receipt pointer back into the run folder made the argv test fail (`scratch/receipts-mutation-control.txt`).
5. The deep-loop suite reran after the edit: 222 files, 4039 passed, 11 skipped, exit 0, the same as the rework baseline, with the deep-loop diff hash unchanged across the run (`scratch/deep-loop-after-rework.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Decision queue with the hold (ADR-001, Accepted) | Operator D1, D9, D13. A parked run is a record plus one item; no process waits |
| `SKILLED_BOT_RUN_ID` allowlist entry (ADR-005, Accepted) | Operator D7. The runner puts it in the guard environment only, never in its own, so no other dispatch inherits it |
| OpenCode and Mistral Vibe admitted for read-only only (ADR-008, superseding ADR-002's first as-built refusal) | Operator: "Support read-only now". Each narrows its tools for read-only, which is a tool gate, recorded as compensating; neither has a control for a write-capable mode |
| Exit reason keeps the phase 1 convention; a refusal adds `exit.refusal.cause` | `paused` records `userPaused` and the hold records `blockedStop`, while the cause and the holding item id stay readable |
| Lease TTL longer than the longest invocation | The audited spawn blocks the event loop, so no heartbeat lands during dispatch. A shorter TTL would let a second run take a live lease |
| Result event through the gateway, with a caller-mode list in deep-loop (ADR-007, Accepted) | Operator D15. The gateway lets a caller supply its ledger, registry, policy, binding and authority root, but not mode admission; adding the bots mode to the frozen flip order would have broken the CLI routability test, so a separate caller-mode list carries it |
| Receipts under the user-level state root (ADR-006, Accepted) | Operator D14. A receipt records the command line, which is the whole prompt for an argv kind |
| [DEVIATION: `runBot` is async] | The append gateway is async. Phase 5's drain awaits the runner |
| A checkout with no commit is refused before dispatch (`result-ledger-unbound`) | The result event binds the checkout's HEAD commit, as the gateway's binding requires an accountable commit |
| [DEVIATION: the CLI loads the runtime with a global tsx loader] | The namespaced `tsImport` cannot resolve the deep-loop CommonJS scripts the runtime requires |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run --no-coverage` in the runtime | 17 files, 179 passed, vitest exit 0 (`scratch/bots-suite-rework.txt`, includes phase 2's files) |
| `npm run typecheck` in the bots runtime and in the deep-loop runtime | exit 0 both |
| Deep-loop suite before and after the allowlist entry | 4039 passed, 11 skipped, both times |
| Deep-loop suite before and after the rework edit | 4039 passed, 11 skipped, both times (`scratch/deep-loop-baseline-rework.txt`, `scratch/deep-loop-after-rework.txt`) |
| `rg -n 'launchctl\|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` | No match, exit 1 |
| `git check-ignore -v` on a run-folder path | `.gitignore:135:.skilled/skills/.state/*/*` |
| Real `.skilled/skills/.state/system-skilled-bots` and `~/.local/state/system-skilled-bots` | Absent after the suite |
| Time before dispatch (NFR-P01), three runs | 21, 19 and 18 ms |
| Bots suite after the read-only change | 17 files, 184 passed, exit 0 (`scratch/bots-suite-readonly.txt`) |
| Deep-loop suite before and after the read-only change | Before: 222 files, 4039 passed, 11 skipped, exit 0 (`scratch/deep-loop-baseline-readonly.txt`, diff hash `485bdf92ac3e` at start and end). After: 222 files, 4041 passed, 11 skipped, exit 0 (`scratch/deep-loop-after-readonly.txt`, diff hash `ba6a4a573214` at start and end). The two added tests are the Vibe read-only builder test and the not-usage-exit refusal for an unmergeable inherited OpenCode config; the OpenCode refusal tests were rewritten in place |
| OpenCode reader negative control | Answer read raw: the park test fails `expected 'completed' to be 'awaiting-decision'` (`scratch/negative-control-opencode-json.txt`) |
| Live-probe script against stubs only | Plumbing works for both kinds: record posture, absent files and Vibe's export pass; the read-token check fails by design, since the stubs read no file. No model called (`scratch/live-probe-stub-smoke.txt`) |
| Acceptance criteria | 26 Met, 2 Superseded, 0 Unmet |
| Live run on a real executor (CHK-021) | `cli-codex`, 2026-11-22: exit 0, `converged`, records 0 to 1, consumer git status empty before and after (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:3`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:5`) |
| Live read-only probes (AC-024, AC-025) | OpenCode: three fixtures PASS (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:43`). Vibe: the first run ended bots exit 1 from the lineage cleanup (`scratch/live-probe-mv-result.txt`); the rerun after the fix PASS with bots exit 0 (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:17`) |
| Bots suite before and after the third review | Before: 17 files, 184 passed, exit 0 (`scratch/bots-suite-baseline-third-review.txt`). After: 17 files, 191 passed, exit 0, typecheck exit 0 (`scratch/bots-suite-third-review.txt`). Delta +7: the seven new tests |
| Deep-loop suite before and after the third review | Before: 222 files, 4041 passed, 11 skipped, exit 0, diff hash `ba6a4a573214` at start and end (`scratch/deep-loop-baseline-third-review.txt`). After: 222 files, 4041 passed, 11 skipped, exit 0, diff hash `15dd889cfe7b` at start and end (`scratch/deep-loop-after-third-review.txt`). Delta 0: the new deep-loop assertions sit inside existing tests. Deep-loop typecheck exit 0 |
| OpenCode resolver probes (no model call) | `scratch/opencode-agent-probe-before.txt`, `scratch/opencode-agent-probe-after.txt`, `scratch/opencode-builder-probe-after.txt`, `scratch/oc-gate-e2e.txt` |
| Vibe lineage cleanup after the live probe | Negative control first: the new run test failed `expected 'failed' to be 'completed'` (`scratch/negative-control-vibe-cleanup.txt`). After the fix: 17 files, 194 passed, exit 0, typecheck exit 0 (`scratch/bots-suite-cleanup-fix.txt`), delta +3 over 191: the run test and two removal tests |
| Third-review negative controls | `scratch/negative-controls-third-review.txt`: seven new tests fail against the unfixed code, the lease-throw control fails with `EISDIR` escaping the runner, and the refusal test fails with the resolver check switched off |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A result event that cannot be recorded fails the run.** After three sends of the same event the run ends `result-event-unrecorded`, class `hub`. If the run had parked, its item stays open and holds the bot, though the record reads as a failure.
2. **"Out of reach" means out of reach through the checkout.** A child is not told the state root and does not inherit `XDG_STATE_HOME`, but it runs as the same user, so a child that already knows the absolute path could still write there.
3. **Receipts still hold the argv, outside the run folder.** For argv kinds the receipts under `<state root>/<identity key>/receipts/<run id>/` hold the whole prompt. They are owner-only and the child is not told the path, but it runs as the same user.
4. **Child output is stored as written.** `stdout.log` in the run folder holds what the child printed. A child that echoes its prompt or an environment value puts it there; the runner's own files never do.
5. **A SIGTERM during dispatch is not handled.** The audited spawn blocks the event loop. A killed run leaves its lease for the pid rule to reclaim, and its record is closed as `unknown` at the next run of that bot.
6. **One live write-path run, on `cli-codex` only.** The codex run and the read-only OpenCode and Vibe probes ran live; every other path is proven with a stub executor. The Claude Code stream-json and DeepSeek Harness `--json` readers are proven against stubs and the observed DSH capture, not a live run.
7. **The result binding reads the operator's git identity.** `resolveCutoverBinding` reads `user.email` with the process environment, so a run records the committer identity of whoever runs `bots`.
8. **Read-only OpenCode and Vibe are tool gates.** The live probes passed for both. Vibe's token read confirms `--enabled-tools` matches the bare names `read_file` and `grep`. No live OpenCode child attempted a write or MCP call, so OpenCode's deny rests on the resolver output, not on a denied tool call. Lifecycle code in a consumer repository (an OpenCode plugin, an MCP server's own start-up, a Vibe hook) is not narrowed by either profile; the resolver check covers permission rules only.
9. **A read-only Vibe child runs in its temp lineage folder.** It starts outside the checkout and reaches it through the absolute path the prompt now names, under Vibe's `outside_workdir` policy. A real child followed that line in the live rerun, reading the token by relative path.
10. **The OpenCode refusal path has no live fixture.** No OpenCode 2.3.2 config tried here beats the inline agent rules, so the refusal is proven with stubbed resolver output only. `list` is kept in the allowlist for v1 compatibility, though no v2 rule named `list` was seen; a wrong name loses a tool and cannot open one. Each read-only OpenCode build spawns `opencode debug agents` once, 0.86 s measured once.
<!-- /ANCHOR:limitations -->

---
