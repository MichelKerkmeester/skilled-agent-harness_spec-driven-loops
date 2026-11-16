# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model `deepseek-flash`
- Iteration: 1 of 5
- Dimension: correctness
- Operator review focus: every Vibe hook and plugin binding, its fail-open behaviour, wire-format and payload edge cases, ordering and kill-switch gaps, and parity against the OpenCode plugins. Only new or still-open issues; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are excluded.

### How this iteration addressed the operator focus

The focus asks for correctness and fail-open defects plus wire-format and payload edge cases. This iteration read the 18 `[[hooks]]` bindings against the shared `lib/hook-io.mjs` seam and against the documented wire format in `guards-and-hooks.md` section 5, then followed each binding into its script to check that the payload field the script reads is a field the payload actually carries. That is where the one P1 came from: `process_start` is mapped onto the shell shape but no capture or document records its `tool_input` key, so every shell guard's judgement of a background command rests on an unverified assumption. The remaining P2s are the payload and cwd edge cases the same pass surfaced.

## Files Reviewed

- `.vibe/hooks.toml:1-150` — all 18 bindings, their `type`, `match`, `strict` and `timeout` fields
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:1-106` — `REPO_ROOT`, `sessionDirFor`, `CORE_TOOL_NAMES`, `readPayload`, `allow`, `deny`, `toCoreCall`, `runGuard`
- `.vibe/plugins/repo-guards/spec-gate.mjs:1-82`
- `.vibe/plugins/repo-guards/spec-gate-classify.mjs:1-81`
- `.vibe/plugins/repo-guards/env-secret-guard.mjs:1-27`
- `.vibe/plugins/repo-guards/dispatch-preflight.mjs:1-58`
- `.vibe/plugins/repo-guards/overlay-guard.mjs:1-62`
- `.vibe/plugins/repo-guards/mcp-route-guard.mjs:1-64`
- `.vibe/plugins/repo-guards/git-message-gate.mjs:1-59`
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:1-122`
- `.vibe/plugins/repo-guards/post-edit-quality.mjs:1-72`
- `.vibe/plugins/repo-guards/dist-freshness.mjs:1-118`
- `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:1-51`
- `.vibe/plugins/repo-guards/session-cleanup.mjs:1-80`
- `.vibe/plugins/repo-guards/render-home-hooks.cjs:1-127`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:1-172`
- `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:1-122`
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-148`
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:1-86`
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:1-381`
- `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:1-110`
- `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs:1-88`
- `.skilled/hooks/goal/vibe/goal-inject.mjs:1-42`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:1-454`
- `.skilled/hooks/shared/session-readers/vibe.mjs:1-497`
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:1-193`
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:1-127`

Context evidence (read-only, not review targets): `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` sections 2-5, `.vibe/plugins/README.md` sections 4-5, `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md`, `.skilled/hooks/injection-contract.md:30,238`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1735-1815`, `.opencode/plugins/session-cleanup.js:112-375`, `.opencode/plugins/lib/v2-bridge.js:300-340`, `.opencode/plugins/overlay-guard.js:80-125`.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **`process_start` is mapped onto the shell shape without a recorded `tool_input` key, so every shell guard fails open on a background command** -- `.vibe/plugins/repo-guards/lib/hook-io.mjs:37` -- `CORE_TOOL_NAMES` maps `process_start` to `bash`, and `toCoreCall` then builds the core call from `input.command` alone (`hook-io.mjs:82`). No capture and no reference document records which key a `process_start` payload actually carries: `fixtures/wire-format/tool-names.md:13` names `process_start` as a shell tool but lists `tool_input` keys only for the five captured tools, and `guards-and-hooks.md:234` pins only the `re:bash|process_start` match selector. If the key is anything other than `command`, `call.input.command` is `undefined`, and `spec-gate.mjs:59`, `env-secret-guard.mjs:23`, `dispatch-preflight.mjs:46`, `overlay-guard.mjs:42`, `git-message-gate.mjs:42` and `dist-freshness.mjs:93` each take their empty-command allow branch. A background shell command would then reach the shell with no dotenv guard, no dispatch hard-rule check, no git-message check and no spec gate.
   Finding class: fail-open-on-unverified-payload
   Scope proof: the mapping is the single seam every shell-shaped guard reads; the six call sites above are the complete set of consumers of `call.input.command`.
   Affected surface hints: `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.vibe/plugins/repo-guards/spec-gate.mjs`, `.vibe/plugins/repo-guards/env-secret-guard.mjs`, `.vibe/plugins/repo-guards/dispatch-preflight.mjs`, `.vibe/plugins/repo-guards/overlay-guard.mjs`, `.vibe/plugins/repo-guards/git-message-gate.mjs`, `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/fixtures/wire-format/`
   Case: a session runs `process_start` with a command that reads `.env` or dispatches a CLI. The hook fires because `match = "re:bash|process_start"` selects it, `toCoreCall` yields `{tool:'bash', input:{command: undefined}}`, and the guard returns allow because the command is not a string.

```json
{
  "type": "claim",
  "claim": "process_start is mapped to the bash core shape but its tool_input key is unrecorded, so a non-command key silently disables every shell guard for background commands.",
  "evidenceRefs": [
    ".vibe/plugins/repo-guards/lib/hook-io.mjs:37",
    ".vibe/plugins/repo-guards/lib/hook-io.mjs:82",
    ".vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:13",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:234",
    ".vibe/plugins/repo-guards/env-secret-guard.mjs:23",
    ".vibe/plugins/repo-guards/dispatch-preflight.mjs:46"
  ],
  "counterevidenceSought": "Searched the wire-format fixture folder, the guards-and-hooks reference, the plugins README and the dist-freshness README for a captured process_start payload or a documented tool_input key. None exists; every mention names only the match selector. Vibe's convention of an unqualified tool name for process_start is consistent with a top-level tool whose argument is command, which is why the assumption is plausible rather than obviously wrong.",
  "alternativeExplanation": "Vibe may reuse the bash argument schema for process_start, in which case the mapping is correct and the only defect is the missing capture that would prove it.",
  "finalSeverity": "P1",
  "confidence": "medium",
  "downgradeTrigger": "A captured process_start payload whose tool_input carries command, or a reference-document line recording that key, downgrades this to P2 (missing fixture) or closes it."
}
```

### P2 Findings

2. **The spec gate's advisory reply uses a field the reference documents only for `session_start`, on a hook declared `strict`** -- `.vibe/plugins/repo-guards/spec-gate.mjs:76` -- On an `advise` decision the hook prints `{"system_message": <detail>}`. `guards-and-hooks.md:238` attributes `system_message` to `session_start` only, and the reply table at `guards-and-hooks.md:205-212` lists "a schema mismatch" as a failure path that `strict = true` turns into a block. `hooks.toml:36` declares this hook strict. The core returns `advise` for a `bash` call whenever the gate is open and the notice is undelivered (`spec-gate-core.mjs:1810`), and `spec-gate-deny.md:105` states that "a shell write is advised, never refused". So the two possible outcomes are both wrong in one direction: either Vibe ignores the field and the operator never sees the note, or Vibe treats it as a schema mismatch and the strict hook denies a call the core judged advisory.
   Finding class: unverified-reply-channel
   Scope proof: `spec-gate.mjs:72-78` is the only `advise` branch in the bundle; no other Vibe hook prints `system_message`.
   Affected surface hints: `.vibe/plugins/repo-guards/spec-gate.mjs`, `.vibe/hooks.toml`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/spec-gate-deny.md`
   Case: a main session's gate is open and unanswered, and the model runs a shell command. The core returns `advise`, the hook prints `system_message`, and the shell call is either silently unannotated or refused outright.

```json
{
  "type": "claim",
  "claim": "The spec gate's advise branch prints system_message from a strict pre_tool hook, a field the reference documents only for session_start, so the note is either lost or becomes a deny.",
  "evidenceRefs": [
    ".vibe/plugins/repo-guards/spec-gate.mjs:76",
    ".vibe/hooks.toml:36",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:205",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:238",
    ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1810",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/spec-gate-deny.md:105"
  ],
  "counterevidenceSought": "Checked whether any live scenario exercises the advise branch. VIB-HK-002's prompt explicitly asks for the file-writing tool rather than a shell command, so the advise path has no live verdict. Checked whether a strict hook tolerates a non-deny reply: VIB-HK-016 passed live with post-edit-quality, also strict, returning hook_specific_output.additional_context, which shows Vibe accepts at least one non-deny object shape. That weakens the deny hazard but does not establish that system_message is honoured on pre_tool.",
  "alternativeExplanation": "Vibe may accept any JSON object on a hook reply and surface system_message as a UI note on pre_tool as the code comment asserts, in which case the note reaches the operator and nothing is lost.",
  "finalSeverity": "P2",
  "confidence": "low",
  "downgradeTrigger": "Already at P2. A live run showing a bash call allowed while the gate is open and the hook printed system_message closes the deny hazard; a run showing the note in the operator UI closes the finding."
}
```

3. **The compaction post-tool binding injects the operator's goal slice into subagent sessions, while the hand-over part in the same hook excludes them** -- `.vibe/hooks.toml:124-128` -- The `compaction-post-tool` entry declares no `match`, so it fires for every `post_tool` call in every session, subagents included. `compaction-post-tool.mjs:61` runs `buildPostToolPart`, which reaches `buildCompactionPart` and then `goalSlice({env, workspace})` (`compaction-context.mjs:283-288`), and `renderVibeGoalSlice` reads the inherited `VIBE_SPEC_FOLDER` (`goal-inject.mjs:33`). The second part of the same hook, `buildHandoverContextPart`, explicitly returns early for a subagent (`handover-parts.mjs:236`). `guards-and-hooks.md:37` records the deliberate exclusion: "It fires for a main session, not a subagent, so a Vibe subagent starts without the slice."
   Finding class: inconsistent-subagent-scope
   Scope proof: `compaction-post-tool.mjs` is the only binding with no `match` that composes a context part; the two parts inside it disagree on subagent scope.
   Affected surface hints: `.vibe/hooks.toml`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`
   Case: a subagent spawned by a main session compacts mid-task. Its next tool result carries the operator's packet goal slice, which the session_start seam deliberately withholds from subagents.

4. **Two cwd conventions split the adapters, so a relative payload cwd resolves differently depending on which hook reads it** -- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-27` -- `sessionDirFor` resolves a relative `cwd` against `REPO_ROOT`, and the guard scripts use it (`spec-gate.mjs:66`, `env-secret-guard.mjs:23`, `overlay-guard.mjs:47`, `post-edit-quality.mjs:53`, `dist-freshness.mjs:53-55`). The context adapters instead use `payload.cwd` raw: `turn-start.mjs:52`, `turn-start.mjs:80`, `ask-surface-post-agent.mjs:105`, `ask-capture-post-tool.mjs:41-45`, `completion-evidence-post-agent.cjs:110`, `dispatch-preflight.mjs:23`. A relative cwd therefore names the checkout for a guard and the hook process's own directory for a context part, so the same payload writes state to two different trees.
   Finding class: inconsistent-path-resolution
   Scope proof: the two groups are exhaustive over the 27 reviewed files; no adapter uses both conventions for the same purpose.
   Affected surface hints: `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`, `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`, `.vibe/plugins/repo-guards/dispatch-preflight.mjs`
   Case: a fixture or a scratch dispatch sends `cwd: "scratch/project"`. The spec gate reads and writes gate state under `<checkout>/scratch/project`, while the completion advisory writes its pending file under `<hook-process-cwd>/scratch/project`, so the next turn-start reads a different file than the one written.

5. **The Vibe session-cleanup hook imports the OpenCode plugin module directly, contradicting the documented re-expression and coupling a Vibe binding to a mirror surface** -- `.vibe/plugins/repo-guards/session-cleanup.mjs:16` -- The hook imports `sessionCleanupPlugin` from `../../../.opencode/plugins/session-cleanup.js` and calls `sessionCleanupPlugin.server({ worktree: projectDir })` (`session-cleanup.mjs:48,57`). `guards-and-hooks.md:37` states that "Vibe never imports or evaluates OpenCode's JavaScript or TypeScript plugins" and that every plugin "is re-expressed as a hook, a skill or nothing". The import also depends on two undocumented internals: the `dualPlugin` wrapper's `.server` property (`.opencode/plugins/lib/v2-bridge.js:310`) and the inner server's `input.worktree || input.directory` contract (`.opencode/plugins/session-cleanup.js:130`). A change to either silently empties the startup-guard warnings, because `session-start.mjs:82-92` drops the part on any failure.
   Finding class: cross-runtime-coupling
   Scope proof: `session-cleanup.mjs:16` is the only import of a `.opencode/` module anywhere in the 27 reviewed files.
   Affected surface hints: `.vibe/plugins/repo-guards/session-cleanup.mjs`, `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.opencode/plugins/session-cleanup.js`, `.opencode/plugins/lib/v2-bridge.js`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`
   Case: the OpenCode plugin renames its context field from `worktree` to `directory` and drops the fallback. The Vibe hook still calls `.server({ worktree })`, the plugin falls back to its own `REPO_ROOT`, and the startup guards run against the wrong tree with no error.

6. **`overlay-guard` is registered for `bash` and `process_start` but its own tool filter allows both, so the binding costs a process spawn per shell call and guards nothing** -- `.vibe/hooks.toml:61` -- The entry's `match` is `re:bash|process_start|write_file|edit`, while `overlay-guard.mjs:26` sets `WRITE_TOOLS = new Set(['write','edit'])` and line 42 returns allow for anything else. The header comment at `overlay-guard.mjs:24-25` states the intent ("a shell command's arguments are not a path the core can trust"), so the filter is deliberate and the `match` is the part that disagrees with it. The same mismatch makes the binding read as shell coverage in `guards-and-hooks.md:37`'s count of "seven strict guards on `pre_tool`".
   Finding class: dead-binding
   Scope proof: `overlay-guard.mjs` is the only strict `pre_tool` guard whose `match` names a tool its own filter rejects.
   Affected surface hints: `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/overlay-guard.mjs`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`
   Case: the model runs any shell command. Vibe spawns `overlay-guard.mjs`, which reads stdin, maps the tool, and returns allow without consulting the overlay engine.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `.vibe/hooks.toml:7-150`, `guards-and-hooks.md:37` | The documented binding census matches the file exactly: 2 `pre_agent`, 7 strict `pre_tool`, 6 `post_tool`, 1 `post_agent`, 1 `session_start`, 1 `session_end`, 18 total. The strict set matches the documented three strict-capable types. |
| `checklist_evidence` | notApplicable | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md` | The declared target is a file set, not a spec folder with a checklist; the only checklist-shaped evidence is the remediation disposition table, which this lineage treats as an exclusion list rather than a checklist to verify. |

## Integration Evidence

- `.vibe/hooks.toml` — the 18 bindings, read in full; the census and strict set were checked against `guards-and-hooks.md:37`.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs` — the shared seam; `toCoreCall`'s five-entry `CORE_TOOL_NAMES` map and its three input projections were checked against `fixtures/wire-format/tool-names.md`.
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` — sections 2-5, the reply table and the documented payload fields.
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1735-1815` — `evaluateMutation`, to confirm the `advise` branch is reachable for `bash`.
- `.opencode/plugins/session-cleanup.js:112-375` and `.opencode/plugins/lib/v2-bridge.js:300-340` — the imported module's `dualPlugin` shape and `input.worktree` contract.
- `.opencode/plugins/overlay-guard.js:80-125` — parity reference for the overlay guard's write-only tool filter.

## Edge Cases

- **Documented rather than observed payloads.** Only `pre_tool` and `post_agent` were captured (`guards-and-hooks.md:196`). Every finding that rests on a `post_tool` or `pre_agent` field cites the documentation, not a capture, and is worded accordingly.
- **`process_start` has neither a capture nor a documented key.** Finding 1 keeps the lower of the two supported severities for an unverified assumption and carries an explicit `downgradeTrigger`.
- **The advise branch has no live verdict.** `spec-gate-deny.md:105` asserts the behaviour but VIB-HK-002's prompt routes around it, so finding 2 is recorded at P2 with `confidence: low`.
- **`resource-map.md` is absent** for this packet, so the Resource Map Coverage Gate is skipped rather than reported as a gap.
- **The 29 dispositioned findings were treated as an exclusion list.** `R3-P2-001--09922ec53397` (the `arm` cwd) and `R3-P2-002--26cf29d2e12e` (`ensureStateDir`) were re-read and left alone.

## Confirmed-Clean Surfaces

- `hook-io.mjs:94-105` `runGuard` — a thrown guard error writes stderr and sets exit 0, so a strict hook's failure path is never reached by a guard bug.
- `hook-io.mjs:61-69` `allow`/`deny` — the deny object is the documented `{"decision":"deny","reason":...}` shape and `allow` prints nothing, matching the reply table's pass row.
- `hook-io.mjs:45-58` `readPayload` — decodes across chunk boundaries, rejects arrays and non-objects, and returns null on malformed JSON, which every caller turns into allow.
- `git-message-gate.mjs:25-33` `loadCore` — blanks `process.argv[1]` for the import and restores it in a `finally`, so the core's own CLI entry cannot start.
- `deep-loop-guard.mjs:97` — lowercases the payload tool name before the `SPAWN_TOOLS` lookup, so a case difference cannot skip the guard.
- `mcp-route-guard.mjs:33-40` `coreToolNameFor` — rejects an empty server name and a trailing dot, and repacks into the core's reserved `__` delimiter.
- `render-home-hooks.cjs:32,36,84-99` — refuses a checkout path holding a quote, backslash, dollar, backtick, CR or LF, and refuses a rendered `command =` line that still holds a substitution.
- `render-home-hooks.cjs:61-66` `assertNotOperatorHome` — refuses the operator's own `~/.vibe`, so the guards cannot reach every Vibe session on the machine.
- `compaction-context.mjs:326-336` `measureJournal` — sums only numbered segments, so a lock or temp file beside them cannot mask a compaction.
- `compaction-context.mjs:139-160` `writeWatermark` — writes through a temp file and a rename, and every id in a catch-up joins the seen list.
- `session-readers/vibe.mjs:116-124` `withSnapshot` — drops a projection delta at or below the snapshot sequence, so replaying the snapshot cannot put an older entry state back.
- `session-readers/vibe.mjs:176-178` — refuses a journal whose recorded session id disagrees with the payload's, so one session cannot read another's reply.
- `prompt-advisor.mjs:85-93` `evictOldestReceipts` — bounds the receipt folder at 64 files.
- `turn-start.mjs:135-149` `composeTurnStart` — each part runs in its own try/catch, so one failing part cannot drop the others.
- `turn-end.mjs:86-99` `composeTurnEnd` — returns the first deny and never throws, matching the documented `post_agent` retry seam.

## Ruled Out

- **`payload.tool_status` absent from the `post_tool` payload.** Ruled out: `guards-and-hooks.md:196` lists `tool_status` among the documented `post_tool` fields, so the failed-tool guard at `post-edit-quality.mjs:45`, `dist-freshness.mjs:106` and `classifier-injection-screen.mjs:41` reads a documented field.
- **A strict `post_tool` hook's `hook_specific_output.additional_context` blanking the tool result.** Ruled out by live evidence: VIB-HK-016 passed with the advisory present in the journal `post_tool_call` result and the tool output intact.
- **`env-secret-guard` lacking an `isHookEnabled` kill switch.** Ruled out: `env-secret-guard.cjs:843-846` reads the switch from the environment only, deliberately, because a flags file in the checkout is agent-writable.
- **`overlay-guard` not judging `bash` as a parity defect.** Ruled out: `.opencode/plugins/overlay-guard.js:101-103` also restricts itself to write/edit/patch tools. Only the `match` mismatch is reported, as finding 6.
- **`session-cleanup.mjs` calling the OpenCode plugin with a partial context.** Ruled out as a runtime break: `session-cleanup.js:130` reads `input.worktree || input.directory || REPO_ROOT`, so `{ worktree }` is sufficient today. The coupling itself is reported as finding 5.
- **`session-cleanup.mjs`'s `session_start` branch being dead code.** Ruled out: `session-start.mjs:82-86` spawns the same script with the same stdin, so the branch is reachable.
- **`readVibeUsage` reading the whole journal on every `post_tool` call.** Ruled out: `context-usage.cjs:368-384` reads a bounded tail and grows it only until a counted model call is found, capped at `MAX_TAIL_BYTES`.
- **`prompt-advisor.mjs`'s `headReceiptDir` reading `process.env` instead of the injected `env`.** Ruled out as a production defect: the injected `env` is only used for the child-session check, and `process.env` is the live environment in every real invocation. Left as a test-isolation note for the maintainability pass.

## Next Focus

- Dimension: security
- Focus area: the trust boundaries the guards enforce — `env-secret-guard`'s path and shell coverage, `render-home-hooks.cjs`'s path-safety refusals, `spec-gate`'s child-session exemption, and the state directories the context adapters create.
- Reason: iteration 1 established that the payload seam is sound except for `process_start`; the next risk is whether the guards that do receive a well-formed call judge it correctly.
- Rotation status: correctness complete, security next.
- Blocked/productive carry-forward: productive — reading each binding against the documented wire format found the P1 in one pass.
- Required evidence: `file:line` plus the core's own decision branch for every claim about what a guard allows or refuses.

Review verdict: CONDITIONAL
