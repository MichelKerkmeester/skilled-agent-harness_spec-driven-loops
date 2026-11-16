# Deep Review Report: Mistral Vibe hooks and plugins (packet 004, second round)

<!-- MACHINE-OWNED: fan-out synthesis of lineages vibe-1 and vibe-2; registry at deep-review-findings-registry.json -->

## 1. Executive Summary

- **Verdict: CONDITIONAL**
- **hasAdvisories:** false (the verdict is CONDITIONAL, not PASS)
- **The counts the verdict used:** P0 0, P1 2, P2 30. These come from `fanout-merge.cjs` (`deep-review-findings-registry.json`: `activeP0` 0, `activeP1` 2, `activeP2` 30, `openFindingsCount` 32) and `review-verdict.cjs` (`mergedVerdict` CONDITIONAL). They are left as computed.
- **Synthesis reviewer's judgment, on verified findings alone:** the two lineages reported 32 raw findings, which dedupe to 26 distinct ones. After every one was read against the current tree, 20 survive: 18 confirmed at their stated severity (seven of them narrowed in scope) and 2 real but at a different severity. 5 are false positives and 1 repeats a finding 023 already dispositioned. The verified severities are P0 0, P1 1, P2 19. One P1 survives, so the verdict on verified findings alone would still be **CONDITIONAL**. The surviving P1 is not either of the two P1s the lineages raised: it is a P2 both lineages filed (`process_start` keyed by its bare name), raised to P1 here because the installed Vibe 3.1.2 names the background-shell tool `process.start` in every hook payload, so every shell guard allows a background command. A payload test reproduced it.
- **Self-check outcomes** (synthesis ids V01 to V26; source ids in section 3):
  - V01 `process.start` misses the shell-tool map: CONFIRMED, **UPGRADED P2 to P1** (repro: `env-secret-guard` allows `cat .env` and `git-message-gate` allows a bad commit when `tool_name` is `process.start`).
  - V02 `process_start` carries an unrecorded `tool_input` key (vibe-1's P1): **FALSE POSITIVE**. Vibe reads `command` for `process.start` and passes the arguments to hooks untranslated. The fail-open it predicted is real, but through V01's route.
  - V03 spec-gate advise never calls `observe()` (vibe-2's P1): real, **DOWNGRADED P1 to P2**. A normal session never reaches the repeat, because the classify half writes the shared marker first. The fix the finding implies would record a delivery the model never got.
  - V04 `system_message` on a strict `pre_tool` hook denies or is lost: **FALSE POSITIVE**. Vibe continues on any non-deny object and shows `system_message` as a notice.
  - V05, V06, V07, V08, V09, V11, V12, V13, V14, V15, V16, V18, V19, V21, V22, V23, V25, V26: CONFIRMED at P2. V06, V07, V13, V14, V16, V19 and V26 are narrowed (section 3 says how).
  - V10 compaction part has no kill switch: **PRIOR-DISPOSITIONED** (023's R4-P2-003--8f1aef762f06; README:29 documents it, and that disposition holds).
  - V17 session-start has no test and no scenario: **FALSE POSITIVE** (`goal-vibe.test.mjs` spawns it; VIB-HK-022 checks its binding).
  - V20 the hand-over part re-parses the whole journal on every tool call: **FALSE POSITIVE** (bounded tail read, newest segment first, and the concern is off on Vibe by default).
  - V24 `tool_status` value unobserved: **FALSE POSITIVE** (Vibe 3.1.2 sets exactly `"failure"` or `"success"`).
- **Scope:** 27 files (`reviewScopeFiles`, identical in both lineages): `.vibe/hooks.toml`, the 13 repo-guards scripts plus `lib/hook-io.mjs` and `render-home-hooks.cjs`, the five session-lifecycle Vibe modules, the goal, hand-over, ask-surface and decision-capture Vibe adapters, the Vibe session reader, the skill-advisor Vibe adapter and the completion post-agent adapter. The `.skilled/hooks/*/vibe/*.mjs` symlinks into `.vibe/plugins/repo-guards/` were treated as one file with their target. Ten iterations: two `cli-mistral-vibe` lineages on `deepseek-flash` (thinking `max`), five each, stop policy `max-iterations`.
- **Operator review focus:** Every Mistral Vibe hook and plugin: the bindings in .vibe/hooks.toml, the repo-guards plugins and lib/hook-io.mjs, render-home-hooks.cjs, the session-lifecycle composers (turn-start, turn-end, session-start, compaction), the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters, and the Vibe session reader. Find correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. 29 findings from the previous review are dispositioned in specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md: report only new or still-open issues, each with file:line evidence.
- **How the runtime claims were settled:** several findings turned on what Vibe puts in a payload or accepts in a reply, which the reference documents record as unobserved. Those were settled by reading the installed Vibe 3.1.2 tool environment (`~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/`, cited below by package-relative path), not by running the CLI.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL on active P1 findings, and one P1 survives verification.

The workstreams below hold only findings that survived verification: the 18 confirmed ones and the 2 whose severity changed. The 5 false positives and the 1 prior-dispositioned finding appear nowhere in the packet. `activeFindings` carries the counts the verdict used; `verifiedFindings` carries the synthesis reviewer's counts. `findingClasses` lists the classes the delta JSONL records; the delta records for vibe-1 iteration 1 and all of vibe-2 carry no `findingClass`, so those are `UNKNOWN`.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 2, "P2": 30 },
  "verifiedFindings": { "P0": 0, "P1": 1, "P2": 19, "falsePositive": 5, "priorDispositioned": 1 },
  "remediationWorkstreams": [
    "WS1 (P1) background shell commands bypass every shell guard (V01): add 'process.start' to CORE_TOOL_NAMES in .vibe/plugins/repo-guards/lib/hook-io.mjs (keep 'process_start'); add a process.start payload case to .vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs and spec-gate.test.mjs and a git-message-gate and dispatch-preflight case; correct the spelling in .vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:13 and .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:234",
    "WS2 (P2) spec-gate operator note repeats when classify did not deliver (V03): in .vibe/plugins/repo-guards/spec-gate.mjs either dedupe the system_message note with a pre_tool-only marker or record the repeat as intended in the code comment; do not call result.observe(), which writes the marker the classify deferral reads",
    "WS3 (P2) binding scope and delivery (V05, V08, V18, V21): skip the compaction part for a post_tool payload with parent_session_id in .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs buildPostToolPart; drop bash|process_start from the overlay-guard match in .vibe/hooks.toml:61; give startupGuardsPart headroom over the inner 8000 ms plus grace in .skilled/hooks/session-lifecycle/vibe/session-start.mjs:42; return '' from the commitNudge catch in .skilled/hooks/session-handover/vibe/handover-parts.mjs:311-313",
    "WS4 (P2) payload cwd handling (V06, V09, V25): resolve payload.cwd through one shared helper in .skilled/hooks/session-lifecycle/vibe/turn-start.mjs:52,80, .vibe/plugins/repo-guards/dispatch-preflight.mjs:22-25 and .skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:110; require an existing directory before mkdir in completion-evidence-post-agent.cjs:62-66 as compaction-context.mjs:76-88 does; import sessionDirFor in .vibe/plugins/repo-guards/dist-freshness.mjs instead of the local copy at :53-55",
    "WS5 (P2) hardening (V07, V11): load the OpenCode session-cleanup module inside runGuard in .vibe/plugins/repo-guards/session-cleanup.mjs:16; test the whole rendered text, not only command = lines, in .vibe/plugins/repo-guards/render-home-hooks.cjs:94-96",
    "WS6 (P2) reference and README drift (V12, V13, V19, V26): fix 'six non-strict checks on post_tool' in guards-and-hooks.md:37; list the allow-with-fields replies (hook_specific_output.additional_context, system_message on pre_tool, hook_specific_output.tool_input) in the reply table at guards-and-hooks.md:206-207; note the dropped tool registrations in the env-secret-guard.js and system-skill-advisor.js rows at :122 and :131; name OPENCODE_GOAL_DISABLED for the goal part in .skilled/hooks/session-lifecycle/vibe/README.md:29",
    "WS7 (P2) testability (V14, V15, V16, V22, V23): IS_CLI_ENTRY guard and exports in .skilled/hooks/session-lifecycle/vibe/session-start.mjs:145; a node test for .vibe/plugins/repo-guards/deep-loop-guard.mjs; one shared readStdin and reply writer for the four session-lifecycle entry points; read STATE_DIR_ENV from the injected env in .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64-68; pass env to enabled() in .skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:86 and completion-evidence-post-agent.cjs:93"
  ],
  "specSeed": "Background shell commands reach the same Vibe guards as foreground ones, and the Vibe guard docs record the reply and tool-name formats Vibe 3.1.2 actually uses",
  "planSeed": "WS1 first with its payload tests, since it is the only P1; WS3 to WS5 next; WS2, WS6 and WS7 after",
  "findingClasses": [
    "unguarded-payload-path",
    "incomplete-refusal-check",
    "stale-document-claim",
    "incomplete-reply-contract",
    "unhedged-name-mapping",
    "untestable-entry-point",
    "duplicated-contract",
    "untested-adapter-layer",
    "UNKNOWN"
  ],
  "affectedSurfacesSeed": [
    ".vibe/plugins/repo-guards/lib/hook-io.mjs",
    ".vibe/plugins/repo-guards/spec-gate.mjs",
    ".vibe/plugins/repo-guards/dispatch-preflight.mjs",
    ".vibe/plugins/repo-guards/dist-freshness.mjs",
    ".vibe/plugins/repo-guards/session-cleanup.mjs",
    ".vibe/plugins/repo-guards/render-home-hooks.cjs",
    ".vibe/plugins/repo-guards/deep-loop-guard.mjs",
    ".vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md",
    ".vibe/hooks.toml",
    ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs",
    ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
    ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
    ".skilled/hooks/session-lifecycle/vibe/README.md",
    ".skilled/hooks/session-handover/vibe/handover-parts.mjs",
    ".skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs",
    ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs",
    ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Every finding below was read in the current tree (branch HEAD `810afb9b32f`; none of the reviewed files has an uncommitted change). "Sources" lists the merged-registry ids; `vibe-1`/`vibe-2` and the iteration number name where each lineage raised it. Line numbers are the ones read during synthesis.

### P1 after verification

#### V01: Background shell commands bypass every shell guard because the map keys `process_start` and Vibe sends `process.start`

- **Severity:** registry P2, verified **P1** (UPGRADED). Dimension: correctness/security.
- **Sources:** `R3-P2-003--36e5aaac682b` (vibe-1 iteration 3), `R1-P2-001--7c34c7795970` (vibe-2 iteration 1).
- **File:line:** `.vibe/plugins/repo-guards/lib/hook-io.mjs:32-38`, `:81`.
- **Evidence:** `CORE_TOOL_NAMES` holds `['process_start', 'bash']` and four `file_system.*` keys, and `toCoreCall` falls through with `CORE_TOOL_NAMES.get(name) ?? name` (`hook-io.mjs:81`). In Vibe 3.1.2 the builtin is literally `"process.start"` (`mistralai_vibe_local_harness/protocol.py:40`), the `pre_tool` payload sets `"tool_name": qualified_tool_name(tool_call.call)` (`mistralai_vibe_local_harness/vibe/_foreign_hooks.py:187`), and `process_start` exists only as a `match` alias (`_hook_matcher.py:68`, `"process.start": ("process_start",)`, used by `candidate_names` at `:126`). So `match = "re:bash|process_start"` fires the hook, the map misses, `tool` becomes `process.start`, and each guard's `bash` check allows: `spec-gate.mjs:59`, `dispatch-preflight.mjs:44`, `git-message-gate.mjs:40`, `dist-freshness.mjs:91`, and the env-secret core through `env-secret-guard.mjs:23`.
- **Reproduction (read-only, payloads on stdin):** `env-secret-guard.mjs` with `tool_input.command = "cat .env"` returned `{"decision":"deny",...}` for `tool_name` `file_system.bash` and for `process_start`, and printed nothing (allow) for `process.start`. `git-message-gate.mjs` with `git commit -m 'stuff'` denied for `file_system.bash` and allowed for `process.start`. `spec-gate.mjs` with an open, undelivered gate (temp cwd) advised for `process_start` and printed nothing for `process.start`.
- **Impact:** a model that starts a command in the background reads a dotenv file, dispatches a CLI against its hard rules, or commits a non-conforming message with no guard judging it. Read and write tools are unaffected.
- **Fix:** add `['process.start', 'bash']` to the map (keep the bare key); add a `process.start` payload case to the repo-guards tests; correct `tool-names.md:13` and `guards-and-hooks.md:234`, which spell the payload name `process_start`. The lineages' guessed spelling, `process.process_start`, is wrong; the real one is `process.start`.
- **Disposition:** CONFIRMED, upgraded. findingClass: unhedged-name-mapping. scopeProof: `hook-io.mjs` is the only tool-name map; every shell guard reads `toCoreCall`. affectedSurfaceHints: `hook-io.mjs`, the six shell-matching bindings in `.vibe/hooks.toml`, `fixtures/wire-format/tool-names.md`, `guards-and-hooks.md`.

### Severity changed: real, but not at the reported severity

#### V03: The spec-gate advise path never calls `observe()`, so the operator note repeats while the marker is absent

- **Severity:** registry P1, verified **P2** (DOWNGRADED). Dimension: correctness. Source: `R1-P1-001--6ea721edde06` (vibe-2 iteration 1).
- **File:line:** `.vibe/plugins/repo-guards/spec-gate.mjs:72-77`.
- **Evidence:** the advise branch writes `{"system_message": result.detail}` and returns without calling `result.observe()`. `evaluateMutation` advises a `bash` call only while `!gate3DeliveryMarker(state)` (`spec-gate-core.mjs:1801,1807-1810`). But the classify half writes that same marker on the turn that opens the gate: `spec-gate-classify.mjs:74-78` calls `recordGate3NoticeDelivered(... channel: 'classify-deferral')`, which writes `questionDeliveredAtMs` (`spec-gate-core.mjs:386-393,439-451`), the field `gate3DeliveryMarker` reads (`:374-383`). Reproduction in a temp cwd: after a real classify pass the state held `"questionDeliveredChannel":"classify-deferral"` and the next `bash` call printed nothing; only after the marker was stripped by hand did three `bash` calls print three notes, and the marker stayed absent.
- **Why P2:** the repeat needs a gate that is open with no marker, which in practice means the classify hook failed or timed out on the opening turn, or the operator set the emit-always value. The note reaches the operator UI only (`_foreign_hooks.py:378-379`), never the model, and each advise also appends a warning-log line (`spec-gate-core.mjs:1877-1885`, the `appendWarningLog` call at `:1879`).
- **Where the finding is wrong:** its counterevidence says `observe()` records "a different marker". It does not: `runEnforceGate`'s `observe` calls `recordGate3NoticeDelivered` (`spec-gate-core.mjs:1868-1871`), the same writer and fields. The code comment at `spec-gate.mjs:73-75` is the reason the call is absent: calling it would make `shouldDeliverGate3Deferral` (`:422`) return false, so the model would never get the deferral. The four sibling adapters can call it because their advise reaches the model; Vibe's does not.
- **Fix:** dedupe the operator note with a pre_tool-only record, or state in the comment that the note repeats until a model-facing delivery lands. Do not copy the siblings' `observe()` call.
- **Disposition:** real, downgraded. findingClass: UNKNOWN (no delta class). affectedSurfaceHints: `spec-gate.mjs`, `spec-gate-core.mjs`.

### P2 confirmed

#### V05: The compaction part injects the operator's goal slice into a subagent's tool results

- **Source:** `R1-P2-002--b9623910ca43` (vibe-1 iteration 1). Dimension: correctness.
- **File:line:** `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:350-381` (`buildPostToolPart`), binding `.vibe/hooks.toml:124-128`.
- **Evidence:** the binding has no `match`, so it runs after every tool call in any session. `buildPostToolPart` checks only the event, the session id and the transcript path; `parent_session_id` appears nowhere in `compaction-context.mjs` (grep). The hand-over part in the same process returns early for a subagent at `handover-parts.mjs:246`, and its comment at `:80-82` says the unscoped `post_tool` hook is exactly where that check is needed. `guards-and-hooks.md:157` (the lineage cited `:37`) records that "a Vibe subagent starts without the slice".
- **Impact:** a subagent that compacts gets the parent packet's goal slice and handoff pointer, which the `session_start` seam withholds from subagents by design.
- **Fix:** return '' from `buildPostToolPart` when `parent_session_id` is set.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V06: Two cwd conventions split the adapters

- **Sources:** `R1-P2-003--12c54b966444` (vibe-1 iteration 1), `R1-P2-003--40d4a73fed81` (vibe-2 iteration 1, `dispatch-preflight.mjs`), `R3-P2-003--f5d3cfa3a9c9` (vibe-2 iteration 3, `turn-start.mjs`). Dimension: correctness/maintainability.
- **File:line:** `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-27` against `turn-start.mjs:52,80`, `dispatch-preflight.mjs:22-25`, `completion-evidence-post-agent.cjs:110`, `ask-surface-post-agent.mjs:105`, `ask-capture-post-tool.mjs:41-45`.
- **Evidence:** `sessionDirFor` resolves a relative cwd against the checkout; the listed adapters use `payload.cwd` raw.
- **Narrowed:** the lineages' case, an advisory written in one tree and read from another, does not happen: the writer (`completion-evidence-post-agent.cjs:110`) and the reader (`turn-start.mjs:52`) both use the raw value, so they agree. A live payload's cwd is `str(context.config.workspace.cwd)` (`_foreign_hooks.py:283`) with `cwd: Path = field(default_factory=Path.cwd)` (`_runtime_config.py:296`), so it is absolute in a live session. That is inferred from source; a captured payload would confirm it. The impact is limited to fixtures and to the two fallbacks that differ (`process.cwd()` in the completion writer, the checkout in the turn-start reader) when a payload carries no cwd at all.
- **Fix:** one shared resolver for every adapter.
- **Disposition:** CONFIRMED (narrowed). findingClass: UNKNOWN.

#### V07: session-cleanup imports the OpenCode plugin statically, outside the fail-open wrapper

- **Sources:** `R1-P2-004` (vibe-1 iteration 1), `R1-P2-002--665b1ec14aec` (vibe-2 iteration 1). Dimension: correctness/maintainability.
- **File:line:** `.vibe/plugins/repo-guards/session-cleanup.mjs:16`.
- **Evidence:** `import sessionCleanupPlugin from '../../../.opencode/plugins/session-cleanup.js'` is a top-level import, while `runGuard(main, 'session-cleanup')` at `:80` wraps only `main`. A load failure exits non-zero with a stack trace; `session-start.mjs:82-92` then drops the startup-guard part, and the `session_end` run loses the cleanup and sweep. The hook also depends on the plugin's `.server({ worktree })` shape (`:48,57`).
- **Narrowed:** vibe-1's "contradicts the documented re-expression" reading does not hold. `guards-and-hooks.md:116` says Vibe, the runtime, never loads OpenCode plugins; the port map row at `:129` ports `session-cleanup.js` as a hook, and reusing its module is how that hook is built. Both lifecycle hooks are non-strict, so nothing blocks.
- **Fix:** import the module dynamically inside `main`.
- **Disposition:** CONFIRMED (narrowed). findingClass: UNKNOWN.

#### V08: overlay-guard is bound to shell tools its own filter ignores

- **Source:** `R1-P2-005` (vibe-1 iteration 1). Dimension: correctness.
- **File:line:** `.vibe/hooks.toml:61` (`match = "re:bash|process_start|write_file|edit"`); `.vibe/plugins/repo-guards/overlay-guard.mjs:26` (`WRITE_TOOLS = new Set(['write', 'edit'])`) and `:42` (allow for anything else).
- **Impact:** one strict node spawn per shell call that can only allow; a timeout there would be a strict failure, which Vibe turns into a deny (`_foreign_hooks.py:14`).
- **Fix:** `match = "re:write_file|edit"`.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V09: The completion sentinel creates a directory tree at the payload's cwd, and the next turn deletes a file there

- **Source:** `R2-P2-001--8cd00cc5964d` (vibe-1 iteration 2). Dimension: security.
- **File:line:** `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:62-66,110`; reader and `unlinkSync` at `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:50-68`.
- **Evidence:** `mkdirSync(dirname(target), { recursive: true, mode: 0o700 })` under `payload.cwd` with no existence or absoluteness check, while `compaction-context.mjs:76-88` requires an existing absolute directory for the same class. `ask-surface-core.cjs` `recordFire` (`mkdirSync(dir, { recursive: true })` under `projectDir`) is the same shape.
- **Not a repeat of 023:** 023 fixed this class in `compaction-context.mjs` only (R3-P2-001--4cabe1421439, R3-P2-002--a2160734b6d7). These are different files. The archived report's note still applies: Vibe builds the payload itself, so this is defense in depth.
- **Fix:** apply the `existingDirectory` rule before the write.
- **Disposition:** CONFIRMED. findingClass: unguarded-payload-path.

#### V11: The home renderer's substitution check skips continuation lines of a multi-line string

- **Source:** `R2-P2-003--935a20128368` (vibe-1 iteration 2). Dimension: security.
- **File:line:** `.vibe/plugins/repo-guards/render-home-hooks.cjs:94-96`.
- **Evidence:** the check keeps only lines matching `/^\s*command\s*=/`. Reproduction: a scratch `hooks.toml` with `command = """` and `node $(whoami)/guard.mjs` on the next line was written to the home without a refusal.
- **Impact:** latent; every current entry is a single-line string.
- **Fix:** test the whole rendered text, or parse the TOML and test each `command` value.
- **Disposition:** CONFIRMED. findingClass: incomplete-refusal-check.

#### V12: The reference calls all six `post_tool` bindings non-strict

- **Source:** `R3-P2-001--4cf2e2e9ec3e` (vibe-1 iteration 3). Dimension: traceability.
- **File:line:** `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:37` ("six non-strict checks on `post_tool`") against `.vibe/hooks.toml:91` (`post-edit-quality`, `strict = true`).
- **Evidence:** the document's own type table (`:65`) and port-map row (`:127`) say `post_tool` (strict), and Vibe blanks the result on a strict `post_tool` failure (`_foreign_hooks.py:15`, `:646-656`).
- **Note:** this sentence is in the paragraph 023 rewrote for R4-P2-001--e3447f5b13ad. That fix corrected the count but carried a wrong adjective, so it is new drift from that fix, not the old finding coming back.
- **Fix:** "six checks on `post_tool`, one of them strict".
- **Disposition:** CONFIRMED. findingClass: stale-document-claim.

#### V13: The reply table omits the allow-with-fields replies the bundle and Vibe use

- **Source:** `R3-P2-002--76e1c4f13d6f` (vibe-1 iteration 3). Dimension: traceability.
- **File:line:** `guards-and-hooks.md:206-207`.
- **Evidence:** the table gives deny as the only example of a conforming object and calls "a schema mismatch" a failure path. In Vibe 3.1.2 a reply fails only when it is not JSON or not an object; any other object continues, `hook_specific_output.tool_input` rewrites the call, and `system_message` becomes a notice (`_foreign_hooks.py:357-379`); on `post_tool`, `hook_specific_output.additional_context` is appended (`:682-724`).
- **Narrowed:** the table's second row already says "act on its fields", so it does not call `additional_context` a failure in so many words. What is missing is the list of fields. This also absorbs the documentation half of V04: `:238` records `system_message` only for `session_start`, while `spec-gate.mjs:76` relies on it for `pre_tool`.
- **Fix:** add the four reply shapes and per-type behavior to the table.
- **Disposition:** CONFIRMED (narrowed). findingClass: incomplete-reply-contract.

#### V14: session-start runs `main()` at import, so its parts can only be tested through a subprocess

- **Sources:** `R4-P2-001--924d76e47d90` (vibe-1 iteration 4), `R3-P2-002--8b6b60541456` (vibe-2 iteration 3). Dimension: maintainability.
- **File:line:** `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:145-147`, with no `export` in the file.
- **Evidence:** the three sibling entry points gate `main()` on `IS_CLI_ENTRY` (`turn-start.mjs`, `turn-end.mjs:28`, `compaction-post-tool.mjs:26-28,82-86`).
- **Narrowed:** both lineages say the file has no test. It does: `.skilled/hooks/goal/vibe/goal-vibe.test.mjs:22` points `HOOK_PATH` at it, and five tests spawn it and assert on its reply (`:89-166`). Those tests switch the other three parts off (`:61-69`), so only the goal part and malformed input are covered.
- **Fix:** add the guard, export `main` or the part builders, and cover the session-prime, startup-guard and dist parts.
- **Disposition:** CONFIRMED (narrowed). findingClass: untestable-entry-point.

#### V15: The stdin read and the context reply are hand-rolled in each entry point

- **Source:** `R4-P2-002--129febd934e1` (vibe-1 iteration 4). Dimension: maintainability.
- **File:line:** `readStdin` copies at `turn-start.mjs:117`, `turn-end.mjs:68`, `session-start.mjs:50`, `compaction-post-tool.mjs:38`; reply writes at `post-edit-quality.mjs:36`, `dist-freshness.mjs:112`, `classifier-injection-screen.mjs:32`, `session-cleanup.mjs:29`, `spec-gate-classify.mjs:47`, `compaction-post-tool.mjs:79`, `session-start.mjs:142` and `turn-start.mjs:165`.
- **Evidence:** a shared `readStdin` already exists and is used by `ask-capture-post-tool.mjs:28` (`../../shared/hook-adapter-shared.cjs`).
- **Fix:** one reader and one context-reply writer.
- **Disposition:** CONFIRMED. findingClass: duplicated-contract.

#### V16: deep-loop-guard has no automated test

- **Source:** `R4-P2-003--c07b28a05163` (vibe-1 iteration 4). Dimension: maintainability.
- **File:line:** `.vibe/plugins/repo-guards/deep-loop-guard.mjs`.
- **Evidence:** no `*.test.*` file under `.skilled` or `.vibe` names it; only the fixture pair under `fixtures/deep-loop-guard/` and live VIB-HK-015 cover it.
- **Narrowed:** the finding names two more adapters, and both are tested. `turn-end.test.mjs:37,159` spawns `turn-end.mjs`, which runs `ask-surface-post-agent.mjs` (fires asserted at `:195-212`) and `completion-evidence-post-agent.cjs` (pending advisory asserted at `:277-307`).
- **Fix:** a node test driving `deep-loop-guard.mjs` with an `agents.spawn` payload.
- **Disposition:** CONFIRMED (narrowed to one file). findingClass: untested-adapter-layer.

#### V18: The startup-guard spawn budget equals the inner guard budget

- **Source:** `R2-P2-002--502f345d2fe4` (vibe-2 iteration 2). Dimension: correctness.
- **File:line:** `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:42,82-86`.
- **Evidence:** the outer spawn of `session-cleanup.mjs` gets 8000 ms. Inside, the plugin runs every guard script in parallel, each bounded at `PROCESS_TIMEOUT_MS = 8000` plus a 250 ms kill grace (`.opencode/plugins/session-cleanup.js:46-47,255,260-299`). One slow guard lets the outer kill fire first, `runNode` returns empty stdout (`session-start.mjs:65`), and every guard's warning is lost, not just the slow one's.
- **Fix:** an outer budget above the inner one, within the binding's default timeout.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V19: The goal part's switch is missing from the README switch list

- **Source:** `R2-P2-003--65b8b4fcc71f` (vibe-2 iteration 2). Dimension: correctness/traceability.
- **File:line:** `.skilled/hooks/session-lifecycle/vibe/README.md:29`.
- **Narrowed:** the code half is false. `goalPart` (`session-start.mjs:68-70`) does not check a flag itself, but `describePacketGoal` throws `PLUGIN_DISABLED` when the `goal` concern is off (`.skilled/hooks/goal/lib/goal-core.cjs:160-161,1287`), and `renderVibeGoalSlice` turns the throw into '' (`goal-inject.mjs:39-41`). Run against the real core, `OPENCODE_GOAL_DISABLED=1` produced `PLUGIN_DISABLED`. The README lists six switches and the hand-over and compaction parts but not this one, so 023's fix for R4-P2-003--8f1aef762f06 did not fully hold for the goal part.
- **Fix:** name `OPENCODE_GOAL_DISABLED` for the goal part in README:29.
- **Disposition:** CONFIRMED (narrowed to the README). findingClass: UNKNOWN.

#### V21: A throw inside the nudge commit still delivers the nudge

- **Source:** `R4-P2-001--f1bf65be671e` (vibe-2 iteration 4). Dimension: correctness.
- **File:line:** `.skilled/hooks/session-handover/vibe/handover-parts.mjs:301-313`.
- **Evidence:** the comment says only the claim holder delivers. The `try` returns '' only for `committed === null`; the `catch` logs and falls through to `nudge.handoffText(...)` at `:315`. `commitNudge` releases the claim in a `finally` (`nudge.cjs:877-889`).
- **Impact:** at most a duplicated nudge in a parallel batch, and only if `nudgeDecision` or `persistState` throws under the claim. `claimNudge` itself fails open to delivery (`nudge.cjs:836-845`), so the throw path is consistent with that choice but contradicts the comment.
- **Fix:** return '' in the catch, or reword the comment.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V22: The advisor's head-receipt directory ignores the injected env

- **Source:** `R4-P2-002--02d259c77bdf` (vibe-2 iteration 4). Dimension: maintainability.
- **File:line:** `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64-68`.
- **Evidence:** `headReceiptDir()` reads `process.env[STATE_DIR_ENV]`, while `buildAdvisorPart` takes `env` (`:162`) and uses it for the child check only (`:169`). It is a test-isolation issue only: in a live hook `env` is `process.env`, and tests can already inject `read`/`write`.
- **Fix:** thread `env` into `headReceiptDir`.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V23: Two adapters call the kill switch without the injected env

- **Source:** `R4-P2-003--d1043d78635f` (vibe-2 iteration 4). Dimension: maintainability.
- **File:line:** `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:86`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:93`.
- **Evidence:** both call `enabled(CONCERN)` with one argument, so `isHookEnabled` reads `process.env` and the config file. It is a test-isolation issue only: each adapter already accepts an injectable `enabled`.
- **Fix:** `enabled(CONCERN, env)`.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V25: dist-freshness keeps a private copy of `sessionDirFor`

- **Source:** `R5-P2-002` (vibe-2 iteration 5). Dimension: maintainability.
- **File:line:** `.vibe/plugins/repo-guards/dist-freshness.mjs:53-55`, the same body as `lib/hook-io.mjs:25-27`, while `:18` already imports `toCoreCall` and `REPO_ROOT` from that module.
- **Fix:** import it.
- **Disposition:** CONFIRMED. findingClass: UNKNOWN.

#### V26: The port map does not say the dotenv inspection tools and the advisor status tool are not ported

- **Source:** `R5-P2-003` (vibe-2 iteration 5). Dimension: traceability.
- **File:line:** `guards-and-hooks.md:122` and `:131`.
- **Evidence:** the `env-secret-guard.js` row says it "registers three value-free dotenv inspection tools" and the `system-skill-advisor.js` row says it "exposes the advisor status tool"; both give a plain `hook` verdict. The registrations are real (`.opencode/plugins/env-secret-guard.js:122,129,136`; `.opencode/plugins/system-skill-advisor.js:1704`, `spec_kit_skill_advisor_status`). The `:139` row records the same loss for another plugin ("Vibe has no plugin tool registry").
- **Narrowed:** the dotenv capability survives as a CLI, which the guard's own deny reason names (`node .skilled/hooks/env-secret-guard/cli/env-secret.cjs keys|validate|fingerprint`).
- **Fix:** one clause per row.
- **Disposition:** CONFIRMED (narrowed). findingClass: UNKNOWN.

### False positives

| ID | Sources | Claim | Refuting line |
|---|---|---|---|
| V02 | `R1-P1-001--aaf37d04c63a` (vibe-1 iteration 1, P1) | `process_start` carries an unrecorded `tool_input` key, so `input.command` is undefined and the shell guards allow | Vibe requires `command` for `process.start`: `_process_actions.py:281` `command = _required_string("process.start", arguments, "command")`, and hooks get the arguments untranslated (`_foreign_hooks.py:259-263`; only `read_file`, `write_file` and `bash` are renamed, `:220-228`). The fail-open it predicted is real, but by the name route in V01. |
| V04 | `R1-P2-001--930ebd6b790d` (vibe-1 iteration 1), `R2-P2-001--e6fdf207290f` (vibe-2 iteration 2) | `system_message` on a strict `pre_tool` hook is either ignored or a schema mismatch that denies the shell call | `_foreign_hooks.py:357-379`: any non-deny object continues, and `if system_message: return _continue(original_arguments), _HookNotice(system_message, "ok")`. The note reaches the operator and the call runs. The undocumented field is folded into V13. |
| V17 | `R5-P2-001--0290e12fb3a9` (vibe-1 iteration 5) | session-start has no scenario and no unit test, so nothing verifies it | `.skilled/hooks/goal/vibe/goal-vibe.test.mjs:22,73` spawns it and asserts on `hook_specific_output.additional_context` (`:105`, `:125`); VIB-HK-022 checks the `builtin:session_start_context` binding (`hook-scenarios/render-home-hooks.md:31`). The narrower true gap is in V14. |
| V20 | `R3-P2-001--a0a6f37ee0f3` (vibe-2 iteration 3) | the hand-over part re-reads and re-parses the whole journal on every tool call, quadratic in turn length | `context-usage.cjs:368-394`: `vibeFillTokens` reads the newest segment first and returns at the first counted model call, from a tail of `DEFAULT_TAIL_BYTES = 262144` (`:18`) grown only when nothing is found, capped at `:21`. The concern is also off on Vibe unless opted in (`hook-flags.cjs:121` lists `claude` only; `handover-parts.mjs:242` returns first). |
| V24 | `R5-P2-001--31be4c6537e7` (vibe-2 iteration 5) | three hooks gate on a `tool_status` value the reference records as unobserved, so a build that says `ok` would silence them | `_foreign_hooks.py:622`: `"tool_status": "failure" if is_failure else "success"`, the exact value `post-edit-quality.mjs:45`, `dist-freshness.mjs:106` and `classifier-injection-screen.mjs:41` compare against. |

### Prior-dispositioned

| ID | Source | Claim | 023 disposition, and why it holds |
|---|---|---|---|
| V10 | `R2-P2-002--995f0e0df49f` (vibe-1 iteration 2) | the compaction half of `compaction-post-tool` consults no kill switch | 023 dispositioned R4-P2-003--8f1aef762f06 as "Fixed: the README names each part's switch, and that the compaction parts have none". `.skilled/hooks/session-lifecycle/vibe/README.md:29` still ends "The compaction parts have no switch of their own", and `compaction-context.mjs` still has no `isHookEnabled` call, so the documented-by-design state is unchanged. |

## 4. Remediation Workstreams

1. **WS1, P1 (V01):** map `process.start` in `hook-io.mjs`, add `process.start` payload tests, and fix the spelling in `tool-names.md:13` and `guards-and-hooks.md:234`. This is the only change that closes a guard bypass.
2. **WS3, P2 (V05, V08, V18, V21):** subagent skip in the compaction part, overlay-guard `match`, startup-guard budget, nudge catch.
3. **WS4, P2 (V06, V09, V25):** one cwd resolver and the existing-directory rule for the completion and ask-surface writes.
4. **WS5, P2 (V07, V11):** dynamic import in `session-cleanup.mjs`, whole-text substitution check in the renderer.
5. **WS2, P2 (V03):** decide the operator-note repeat; do not call `observe()`.
6. **WS6, P2 advisories (V12, V13, V19, V26):** reference and README drift.
7. **WS7, P2 advisories (V14, V15, V16, V22, V23):** testability and duplication.

## 5. Spec Seed

- A background command started through Vibe's `process.start` tool is judged by `env-secret-guard`, `dispatch-preflight`, `git-message-gate` and `spec-gate` exactly as a `file_system.bash` call is, with a payload test per guard.
- The Vibe guard reference records the payload tool names and reply shapes Vibe 3.1.2 actually uses: `process.start`, the allow-with-fields replies and `system_message` on `pre_tool`.
- The compaction part, like the hand-over part, stays out of subagent sessions.

## 6. Plan Seed

- Add `['process.start', 'bash']` to `CORE_TOOL_NAMES` and a `process.start` case to `env-secret-guard.test.mjs` and `spec-gate.test.mjs`, plus new cases for `git-message-gate` and `dispatch-preflight`.
- Correct `tool-names.md:13`, `guards-and-hooks.md:37`, `:122`, `:131`, `:206-207` and `:234`, and README:29.
- Add the subagent check to `buildPostToolPart` with a unit case in `compaction-context.test.mjs`.
- Narrow the overlay-guard `match`; raise the startup-guard budget; return '' from the nudge catch.
- Add the `IS_CLI_ENTRY` guard to `session-start.mjs` and a `deep-loop-guard` test.

## 7. Traceability Status

- **Core protocols.** `spec_code`: the 18-binding census in `guards-and-hooks.md:37` matches `.vibe/hooks.toml` by count and event, with one wrong adjective (V12). The documented payload name `process_start` (`tool-names.md:13`, `guards-and-hooks.md:234`) does not match Vibe 3.1.2's `process.start`, which is the root of V01. `checklist_evidence`: not applicable; the target is a file set, and 023's disposition table served as the exclusion list.
- **Overlay protocols.** `agent_cross_runtime`: the port map classifies all 21 OpenCode plugins; two rows omit a dropped tool registration (V26). The four sibling spec-gate adapters call `observe()` and Vibe's does not, deliberately (V03). `playbook_capability`: `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` holds 27 `VIB-HK` rows, all PASS; 17 of the 18 bindings have a row named for them (001 to 021 and 028). `session-start` has only a binding check (VIB-HK-022) and a subprocess unit test, not a content scenario. No live scenario exercises a `process.start` call, which is how V01 went unseen. `skill_agent`: advisor uptake passed live (VIB-HK-003, VIB-HK-028).
- **AC_COVERAGE:** exempt. The review target is a hook and plugin file set, not a lifecycle-active spec folder with `acceptance-criteria.md`.

## 8. Deferred Items

- The `spec-gate` operator note (V03) needs a product decision, not only code: keep a reminder the operator sees on every shell call while the gate is unanswered, or dedupe it.
- V06 and V09 rest on payload fields Vibe builds itself. As the archived report noted for the same class, they are defense in depth until a threat model says who else can supply a payload.
- No `post_tool`, `session_start` or `process.start` payload has been captured; the claims about them here rest on the installed source. A captured `process.start` payload would confirm V01's tool name directly.
- V18's fix depends on the default timeout Vibe gives a `session_start` host hook that declares none, which this synthesis did not read.
- Not checked: whether Vibe's deprecated `file_system.search_replace` can still reach a write. `protocol.py` lists it as deprecated and says restored actions with it are failed, so it was not pursued.

## Dimension Expansion Map

- vibe-1 ran one pass per dimension: correctness, security, traceability, maintainability, then a residual sweep it labeled `cross-reference`.
- vibe-2 ran correctness three times (guard seam, composers and reader, adapters), security once, and one combined traceability and maintainability pass.
- Reducer-owned `divergence` is empty in both lineage registries: no saturated directions, pivots, overrides or Council artifacts, and no remaining frontier recorded.

## 9. Search Ledger

- `searchDebt`: empty in the merged registry and in both lineage registries, so hasSearchDebt: false.
- vibe-1 `searchCoverage`: required bug classes `unverified_binding`, `stale_finding`, `stale_verdict`, `misdeclared_binding`, `uncovered_dimension`, all covered; four ruled out. `candidateCoverage` lists 25 covered classes and 21 ruled out, none deferred or blocked. 10 `ruledOutCandidates` with clean-search proof (SL-003, SL-009, SL-010, SL-014, SL-015, SL-019, SL-020, SL-022, SL-023, SL-024).
- Synthesis note: three of those ruled-out candidates do not hold. SL-009 cleared `tool_coverage_gap` on the env-secret binding because "the binding and the core agree on every tool name", which is the class V01 falls in: the binding fires for `process.start` and the map does not know that name. SL-015 ("no new parity gap") missed V26. SL-022 ("no carried finding was fixed or invalidated") is contradicted by this synthesis, which refutes three vibe-1 findings (V02, V04, V17). vibe-1's `kill_switch_gap` appears both as covered and ruled out because V10 was raised and the other switches cleared.
- vibe-2: *No search-depth state captured (legacy v1 record)*; its registry arrays are empty, although its iteration files carry "Ruled Out" sections.

## 10. Audit Appendix

- **Convergence:** stop policy `max-iterations`; both lineages ran 5 of 5 and exited 0 (`orchestration-summary.json`: 2 succeeded, 0 failed). `fanout-attribution.md` records convergence 0.875 for vibe-1 and 0 for vibe-2, telemetry only under this stop policy.
- **Coverage:** 2 lineages, 10 iterations, 27 scope files; 32 merged open findings, 0 resolved; 26 after synthesis dedupe.
- **Ruled-out claims (synthesis):** V02, V04, V17, V20 and V24 (section 3). Also, the registry pairs `R4-P2-001--f1bf65be671e` with `R4-P2-001--924d76e47d90` and others as `CONTRADICTS` peers. That is an id collision between lineages (`same-id-different-content`), not a disagreement about one defect.
- **Sources reviewed:** every `lineages/*/iterations/iteration-00{1..5}.md` and `lineages/*/deltas/iter-00{1..5}.jsonl`, `deep-review-findings-registry.json`, `fanout-attribution.md`, `orchestration-summary.json`, both lineage configs and state logs, 023's `implementation-summary.md` and the archived report `review-archive/2026-11-16T05-57-42Z/review-report.md`, every file cited in section 3, and the installed Vibe 3.1.2 sources `mistralai_vibe_local_harness/protocol.py`, `vibe/_foreign_hooks.py`, `vibe/_hook_matcher.py`, `vibe/_process_actions.py`, `vibe/_runtime_config.py`.
- **Commands run (read-only):** `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs .vibe/plugins/repo-guards/tests/ .skilled/hooks/goal/vibe/goal-vibe.test.mjs`: 58 pass, 0 fail, exit 0. Payload repros for V01 and V03 ran the guard scripts with a temp-dir or checkout cwd; a `find -newer` sweep afterwards showed no file in the checkout changed by them. The unit-test run appended to two gitignored runtime files, `.skilled/logs/completion-sentinel-advisories.log` and `.skilled/skills/.state/completion-sentinel/advisory-dedup.json`. The V11 repro rendered into a scratch home that was then removed. The goal switch was checked with `node -e` against `goal-core.cjs`. The Vibe CLI was not run.

### Run notes

- **vibe-1's state log carries invented timestamps.** The lineage window in `orchestration-summary.json` is `2026-11-16T05:57:52.537Z` to `06:10:43.626Z`, and the lineage's stop event is at `06:10:06.109Z`. Its iteration records 2 to 5 are stamped `07:20:00Z`, `07:40:00Z`, `08:00:00Z` and `08:20:00Z`, after the window. `orchestration-summary.json` flags the same 4 records as `after_window` anomalies. Iteration 1's `06:12:00Z` is also past the window end, but inside the 120 s tolerance, which is why the count is 4 and not 5. The round, evenly spaced values show the model wrote the timestamps instead of reading a clock.
- **vibe-1 iteration 5 used a dimension label outside the configured set:** `"dimensions": ["cross-reference"]` (state log), while the config declares `correctness`, `security`, `traceability`, `maintainability`.
- **vibe-2 never ran a maintainability-only pass.** Its state log records `correctness`, `security`, `correctness`, `correctness`, then `["traceability", "maintainability"]` for iteration 5. Its maintainability coverage is the half of one combined pass, which produced V25 only.
- vibe-2's iteration 1 record (`06:04:21Z`) precedes its own config record (`06:04:40.424Z`), and all five vibe-2 iterations are stamped within 2 min 51 s. They fall inside the lineage window, so the merge did not flag them.

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| Spec to code (binding census) | Pass, one adjective wrong | `guards-and-hooks.md:37` against `.vibe/hooks.toml` (V12) |
| Spec to code (payload tool names) | Drift | `tool-names.md:13`, `guards-and-hooks.md:234` against Vibe `protocol.py:40` (V01) |
| Checklist evidence | Not applicable | file-set target |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| Cross-runtime parity | Two documented gaps, one deliberate divergence | V26; V03 |
| Playbook capability | 17 of 18 bindings have a PASS row, session-start binding-only, no `process.start` scenario | `022-.../scratch/verdicts.md` (27 rows), VIB-HK-022, V01 |
| Lineage resource maps | Not present at the fan-out root; Resource Map Coverage Gate omitted | `lineages/*/` |
