# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model `deepseek-flash`
- Iteration: 2 of 5
- Dimension: security
- Operator review focus: every Vibe hook and plugin binding, its fail-open behaviour, wire-format and payload edge cases, ordering and kill-switch gaps, and parity against the OpenCode plugins. Only new or still-open issues; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are excluded.

### How this iteration addressed the operator focus

The focus names security, fail-open behaviour and kill-switch gaps. This iteration took the trust boundaries the guards enforce and asked two questions of each: what does the hook do with a payload field it does not control, and can an operator turn it off. The first question produced finding 1, a still-open instance of a class the previous review already fixed once: `compaction-context.mjs` refuses to create a directory tree at a payload-named path, and three sibling adapters still do exactly that, one of them followed by an `unlinkSync`. The second question produced finding 2, the one binding in the census that consults no kill switch at all while its own sibling part in the same process does. Finding 3 is the path-safety refusal in the home renderer, which inspects only `command =` lines and so cannot see a substitution that a multi-line TOML string puts on a continuation line. The `env-secret-guard` coverage question the previous iteration deferred to this pass was answered clean and is recorded under Ruled Out rather than as a finding.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:50-127` — `pendingAdvisoryPath`, `writePendingAdvisory`, the `payload.cwd` binding at `:110`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:44-72` — `pendingCompletionAdvisoryPart`, the read and the `unlinkSync` at `:64`
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:70-92,350-381` — `stateDirFor`, `existingDirectory`, `buildPostToolPart`
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:1-86` — the whole binding
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:60-75` — the `isHookEnabled` gate at `:70`
- `.vibe/hooks.toml:120-140` — the `compaction-post-tool` and `decision-capture-ask` bindings
- `.vibe/plugins/repo-guards/render-home-hooks.cjs:88-104` — `resolveReal`, `assertNotOperatorHome`, the leftover-substitution check
- `.vibe/plugins/repo-guards/env-secret-guard.mjs:1-27` and `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:32-40,770-798,843-846` — tool coverage and the environment-only kill switch
- `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs:30-55` — `projectDirFor`
- `.skilled/hooks/decision-capture/lib/capture-core.mjs:242-282,346-352` — `canonicalRoot`, `queueDir`, `appendRecords`
- `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:95-110` — `markerDir` and `recordFire`
- `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:176-215` — `markTurn`, `recordFire`
- `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:1-51` and `.skilled/hooks/classifier-injection/lib/classifier-injection-advisory.mjs:45-101` — `fetchedText`, `screenAdvisory`
- `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:1-122` — kill-switch delegation to `completion-evidence-post-agent.cjs`
- `.vibe/plugins/repo-guards/git-message-gate.mjs:1-59` — the documented no-kill-switch decision at `:9`

Context evidence (read-only, not review targets): `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` sections 2-5, `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md` (the 29 dispositioned findings), `.skilled/hooks/injection-contract.md`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Three adapters still create a directory tree at a payload-named path, and one of them then deletes a file there** -- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:62-66` -- `writePendingAdvisory` calls `mkdirSync(dirname(target), { recursive: true, mode: 0o700 })` and then `writeFileSync`, where `target` is `join(projectDir, PENDING_ADVISORY_RELATIVE_PATH)` and `projectDir` is `payload.cwd` taken verbatim at `:110`. The matching reader, `turn-start.mjs:50-68`, builds the same path from `payload.cwd` and calls `unlinkSync(target)` at `:64`. Neither site checks that the path is absolute or that the parent already exists as a directory. `compaction-context.mjs:76-88` added exactly that guard for exactly this class, and its comment at `:72-77` states the rule: "The folder must already exist as a directory, so a payload cannot make the detector create a directory tree anywhere it names." The previous review dispositioned this class as `R3-P2-001--4cabe1421439` and `R3-P2-002--a2160734b6d7`, both marked Fixed, so this is a still-open instance rather than a new class. `ask-capture-post-tool.mjs:41-45` reaches `appendRecords` → `queueDir` → `mkdirSync(..., { recursive: true, mode: 0o700 })` (`capture-core.mjs:274-277,350`) on the same unguarded `payload.cwd`, and `ask-surface-core.cjs:205-215` `recordFire` does the same at `join(projectDir, '.skilled', 'skills', '.state', CONCERN)`.
   Finding class: unguarded-payload-path
   Scope proof: `completion-evidence-post-agent.cjs:110`, `turn-start.mjs:52`, `ask-capture-post-tool.mjs:41-45` and `ask-surface-post-agent.mjs:105` are the complete set of Vibe adapters that derive a filesystem root from `payload.cwd`; `compaction-context.mjs:76-88` is the only one that guards it.
   Affected surface hints: `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs`, `.skilled/hooks/decision-capture/lib/capture-core.mjs`, `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`
   Case: a session whose `payload.cwd` names a directory that does not exist, or names a path outside the checkout. The completion sentinel creates the tree and writes the advisory file there, and the next turn start reads it back and unlinks it, so the hook pair writes and then deletes a file at a location the payload chose.

2. **`compaction-post-tool` fires on every tool call and its compaction half consults no kill switch, while the hand-over half in the same process does** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:350-380` -- The binding at `hooks.toml:124-128` declares no `match`, so it runs after every tool call. `buildPostToolPart` goes straight from the payload checks at `:360-366` to `journalSize` and `detect` with no `isHookEnabled` call anywhere in the function or in `compaction-context.mjs` (zero occurrences in the file). The same process then dynamically imports `handover-parts.mjs`, which does gate itself at `:70` with `isHookEnabled(CONCERN, env, config, { runtime: 'vibe' })`. Every other Vibe adapter in the census checks a switch: `spec-gate-classify.mjs`, `turn-start.mjs`, `spec-gate.mjs`, `dispatch-preflight.mjs`, `overlay-guard.mjs`, `mcp-route-guard.mjs`, `deep-loop-guard.mjs`, `post-edit-quality.mjs`, `dist-freshness.mjs`, `classifier-injection-screen.mjs`, `ask-capture-post-tool.mjs`, `session-start.mjs`, `session-cleanup.mjs`, `ask-surface-post-agent.mjs`, `completion-evidence-post-agent.cjs` and `prompt-advisor.mjs` all call `isHookEnabled`, and `env-secret-guard.mjs:19` calls `guardCore.isGuardEnabled()`. `git-message-gate.mjs:9` documents its own missing switch deliberately; `compaction-post-tool.mjs` documents nothing.
   Finding class: kill-switch-gap
   Scope proof: `compaction-post-tool.mjs` is the only bound script with neither an `isHookEnabled` nor an `isGuardEnabled` call in itself or in its delegate chain; the census above is the full 18-binding set plus the four unbound adapters.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.vibe/hooks.toml`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`
   Case: an operator disables the session-lifecycle concern to stop the compaction injections. The hand-over nudge stops, the compaction injection keeps arriving after every tool call, and the only remaining way to stop it is to edit `hooks.toml`.

3. **The home renderer's leftover-substitution check inspects only `command =` lines, so a multi-line TOML string hides a substitution on a continuation line** -- `.vibe/plugins/repo-guards/render-home-hooks.cjs:94-99` -- After substituting `TOPLEVEL_EXPRESSION` with `root`, the check splits the rendered text on newlines and keeps only lines matching `/^\s*command\s*=/` before testing `LEFTOVER_SUBSTITUTION`. A TOML multi-line basic string (`command = """` … `"""`) puts the command body on continuation lines that never match that pattern, so a `$(...)` or backtick left in the body passes the check and is written into the rendered `hooks.toml` at `:103`. The refusal exists to keep a shell substitution out of the home file; the line filter narrows it to the single-line form.
   Finding class: incomplete-refusal-check
   Scope proof: `:94-99` is the only leftover-substitution check in the file, and `:103` is the only write of the rendered text.
   Affected surface hints: `.vibe/plugins/repo-guards/render-home-hooks.cjs`, `.vibe/hooks.toml`
   Case: a `hooks.toml` entry written as a multi-line basic string whose body still holds a `$(git rev-parse --show-toplevel)` that the substitution did not cover. The renderer writes the file, and the substitution is evaluated by the shell when Vibe runs the hook.

## Traceability Checks

- **Binding census against the reference.** `hooks.toml` holds 18 `[[hooks]]` entries: 2 `pre_agent`, 7 strict `pre_tool`, 6 `post_tool`, 1 `post_agent`, 1 `session_start`, 1 `session_end`. `guards-and-hooks.md:37` gives the same totals but describes all six `post_tool` entries as non-strict, while `hooks.toml:93` declares `post-edit-quality` `strict = true`. The document is wrong, not the binding. Recorded here as a traceability observation; it is carried into the traceability pass as a candidate finding rather than raised now, because this iteration's dimension is security.
- **Kill-switch coverage across the census.** Verified by direct grep for `isHookEnabled` and `isGuardEnabled` over all 18 bound scripts plus the four unbound adapters. Sixteen bound scripts gate themselves or delegate to a gated module; `env-secret-guard.mjs` uses the core's own switch; `git-message-gate.mjs` documents the absence; `compaction-post-tool.mjs` is the one unexplained gap, reported as finding 2.
- **`env-secret-guard` tool coverage against the binding.** `hooks.toml:45` matches `re:bash|process_start|read_file|write_file|edit`. `env-secret-guard.cjs:32-35` lists `read_file`, `write`, `edit` in `FILE_TOOLS` and `:40` lists `bash` in `SHELL_TOOLS`, and `evaluateToolCall` at `:770-798` checks shell commands, wrapped code-mode commands and file paths. The binding and the core agree on every tool name.
- **Payload-derived state roots against the documented rule.** `compaction-context.mjs:72-77` states the rule and enforces it at `:76-88`; the three adapters in finding 1 do not. Checked against the dispositioned findings in `023-vibe-review-remediation/implementation-summary.md`, where the same class is marked Fixed for the compaction detector only.

## Integration Evidence

- `.vibe/hooks.toml` — the binding table read as the registration surface for every finding in this iteration: `:124-128` for finding 2, `:36-38` and `:93` for the census check.
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` — the `post_agent` delegate reached from `turn-end.mjs:32`, and the writer half of finding 1.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` — the `pre_agent` binding at `hooks.toml:15-20`, and the reader-and-unlink half of finding 1.
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs` — the module `compaction-post-tool.mjs:68` imports dynamically, and the counterexample for finding 2.
- `.vibe/plugins/repo-guards/render-home-hooks.cjs` — the renderer that produces the home `hooks.toml` the runtime actually loads.

## Edge Cases

- **Severity of finding 1 held at P2, not raised to P1.** `payload.cwd` is set by the runtime and by the dispatch recipe, not by the model, and the relative path is a fixed constant, so the write and the delete cannot be aimed at an arbitrary file. The class is real and the repo already treats it as worth fixing, but the reachable impact is a stray directory tree and a self-inflicted unlink. Recorded as P2 with the class named so the merge can weigh it against the two Fixed dispositions.
- **Finding 2 is a control-plane gap, not a fail-open.** The hook still exits 0 on every failure path (`compaction-post-tool.mjs:63-65,71-73,83-85`), so the missing switch cannot blank a tool result. The impact is that an operator's disable does not take effect for one of the two parts.
- **Finding 3 depends on a `hooks.toml` form the file does not currently use.** Every entry today is a single-line `command = "..."`, so the check is complete for the current file. The finding is about the check's coverage, not about a live substitution, which is why it stays P2.
- **`ask-surface-post-agent.mjs` marker path is not part of finding 1.** `markTurn` is called with `markerDir`, which is `undefined` in production, so the default parameter `baseDir = tmpdir()` applies and the marker lands in the temp directory. Only `recordFire` at `ask-surface-core.cjs:205-215` writes under `payload.cwd`, and it swallows its own failure.
- **`canonicalRoot` can throw before `appendRecords` writes.** `capture-core.mjs:242-252` runs `git rev-parse --show-toplevel` with `cwd: input`, so a `payload.cwd` that does not exist raises before any `mkdirSync`. That narrows finding 1's decision-capture instance to an existing directory, which is why the finding cites it as a same-class site rather than an equal one.

## Confirmed-Clean Surfaces

- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:76-88` `stateDirFor`/`existingDirectory` — requires `isAbsolute` and `statSync().isDirectory()` before using a payload path, and falls back to the workspace otherwise.
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:139-160` `writeWatermark` — creates its directory only under the guarded root, writes through a temp file and a rename, and uses mode `0o700`/`0o600`.
- `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:843-846` — reads the kill switch from the environment only, deliberately, because a flags file in the checkout is agent-writable.
- `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:770-798` `evaluateToolCall` — covers shell commands, wrapped code-mode commands and file paths, so the binding's five-tool match has no uncovered tool.
- `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:176-188` `markTurn` — defaults `baseDir` to `tmpdir()` and uses `flag: 'wx'`, so the marker is neither payload-rooted nor overwritable.
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:70` — gates the hand-over part on `isHookEnabled` with the runtime passed through.
- `.vibe/plugins/repo-guards/render-home-hooks.cjs:89-90` — resolves the home with `resolveReal` and refuses the operator home before any write.
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:107-116` — wraps the pending-advisory write in a try/catch, so a failed write cannot cost the advisory log line.

## Ruled Out

- **`env-secret-guard` missing a tool the binding matches.** Ruled out: `env-secret-guard.cjs:32-35` covers `read_file`/`write`/`edit` and `:40` covers `bash`, and `evaluateToolCall` at `:770-798` dispatches on all of them. The binding at `hooks.toml:45` adds `process_start`, which reaches the same shell branch through `hook-io.mjs:37`; that mapping's unverified `tool_input` key is already finding 1 of iteration 1 and is not re-reported here.
- **A self-injection loop through the completion sentinel.** Ruled out: the `detail` written by `writePendingAdvisory` is built from fixed strings plus `specFolder` (`completion-evidence-sentinel.cjs:260,309,595`) and never from the model's claim text, so the advisory cannot carry model output back into the next turn's context.
- **`spec-gate`'s `AI_SESSION_CHILD` exemption as a security defect.** Ruled out as a defect: the exemption is the documented child-dispatch contract, and the gate still records the decision. It is a deliberate trade-off, not a bypass.
- **`classifier-injection-screen` lacking a size cap on the fetched text.** Ruled out as a Vibe-adapter finding: `classifier-injection-advisory.mjs:45-54` and `:91-101` bound the text through the shared `screenText` helper, and the absence of a `timeout` in `hooks.toml:115-119` leaves the documented 60 s default, which the non-strict binding turns into a no-op rather than a block. The cap belongs to the shared core, outside this review target.
- **`turn-end.mjs` lacking its own kill switch.** Ruled out: it delegates to `completion-evidence-post-agent.cjs`, which calls `isHookEnabled` twice, so the switch is reachable through the delegate.
- **`git-message-gate.mjs` lacking a kill switch.** Ruled out: `:9` documents the absence as deliberate, with the reason stated in the file.
- **`prompt-advisor.mjs`'s receipt directory as a payload-rooted write.** Ruled out: `headReceiptDir` resolves from `tmpdir()` or a configured environment path, never from the payload.

## Next Focus

- Dimension: traceability
- Focus area: parity between each Vibe adapter and its OpenCode counterpart, and the reference documents that describe the Vibe bindings — `guards-and-hooks.md` section 5's reply table and its binding census, `fixtures/wire-format/tool-names.md`, and the `injection-contract.md` field list.
- Reason: iterations 1 and 2 covered the payload seam and the trust boundaries. The remaining unverified surface is whether the documents that describe these bindings still match them, and the census mismatch already noted under Traceability Checks is the first instance.
- Rotation status: correctness complete, security complete, traceability next.
- Blocked/productive carry-forward: productive — grepping the census for a single helper name found the one binding with no kill switch in one pass.
- Required evidence: the exact document line beside the exact binding line for every parity claim, and the OpenCode counterpart's path when the claim is about parity rather than documentation.

Review verdict: CONDITIONAL
