# Review Iteration 001

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Mode: review, execution single_review_iteration, state source externalized files
- Session: `fanout-vibe-2-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Iteration: 1 of 5 (stopPolicy `max-iterations`)
- Dimension: correctness
- Operator review focus: correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. This iteration addresses the focus by auditing the guard seam — `lib/hook-io.mjs` and the seven strict `pre_tool` guards — where a fail-open or a broken adapter contract costs the most.
- Sources read: `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `spec-gate.mjs`, `spec-gate-classify.mjs`, `env-secret-guard.mjs`, `dispatch-preflight.mjs`, `overlay-guard.mjs`, `git-message-gate.mjs`, `mcp-route-guard.mjs`, `deep-loop-guard.mjs`, `post-edit-quality.mjs`, `dist-freshness.mjs`, `classifier-injection-screen.mjs`, `session-cleanup.mjs`, `render-home-hooks.cjs`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md`, `023-vibe-review-remediation/implementation-summary.md`.

## Files Reviewed

- `.vibe/plugins/repo-guards/lib/hook-io.mjs:1-106`
- `.vibe/plugins/repo-guards/spec-gate.mjs:1-82`
- `.vibe/plugins/repo-guards/spec-gate-classify.mjs:1-81`
- `.vibe/plugins/repo-guards/env-secret-guard.mjs:1-27`
- `.vibe/plugins/repo-guards/dispatch-preflight.mjs:1-58`
- `.vibe/plugins/repo-guards/overlay-guard.mjs:1-62`
- `.vibe/plugins/repo-guards/git-message-gate.mjs:1-59`
- `.vibe/plugins/repo-guards/mcp-route-guard.mjs:1-64`
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:1-122`
- `.vibe/plugins/repo-guards/post-edit-quality.mjs:1-72`
- `.vibe/plugins/repo-guards/dist-freshness.mjs:1-117`
- `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:1-51`
- `.vibe/plugins/repo-guards/session-cleanup.mjs:1-80`
- `.vibe/plugins/repo-guards/render-home-hooks.cjs:1-127`
- `.vibe/hooks.toml:1-140`

## Findings - New

### P0 Findings

None. No finding in this iteration can cause immediate harm without an operator action or an unverified runtime field.

### P1 Findings

1. **The spec-gate advise path never acknowledges delivery, so the notice repeats on every shell call** -- `.vibe/plugins/repo-guards/spec-gate.mjs:72-78` -- `runEnforceGate` returns an `observe()` callback whose only job is to write the mutation-time delivery marker, and the core's own docstring says the adapter must call it once its envelope is on the wire (`spec-gate-core.mjs:1827-1831`: "The adapter writes its envelope first and calls `observe()` after, so delivery is recorded only once the runtime has the text"). The Vibe adapter writes the `system_message` envelope and returns without calling it. `evaluateMutation` computes `undelivered = !gate3DeliveryMarker(state)` (`spec-gate-core.mjs:1806`), so with no marker the advise branch is re-entered on every subsequent call. All four sibling adapters call it: `claude/spec-gate-enforce.mjs:52`, `codex/spec-gate-enforce.mjs:69`, `cursor/spec-gate-enforce.mjs:50`, `devin/spec-gate-enforce.mjs:54` — the Claude one with the comment "that is what stops the repeat". The Vibe half is the only adapter that breaks the contract.
   Finding class: algorithmic
   Scope proof: the defect is inside the declared target (`.vibe/plugins/repo-guards/spec-gate.mjs`); the core and the four sibling adapters are cited as the contract and the parity reference, not as review targets.
   Affected surface hints: `.vibe/plugins/repo-guards/spec-gate.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, the `spec-gate` binding in `.vibe/hooks.toml:36-40`
   Case: a session whose spec-folder gate is open and whose `spec-gate-classify` half did not deliver the deferral (delivery suppressed, or the gate opened on a turn with a blank prompt). The operator runs any shell command; the hook emits the `system_message` note and writes no marker; the next shell command emits it again, for the rest of the session.

```json
{
  "type": "claim-adjudication",
  "claim": "The Vibe pre_tool spec-gate adapter emits the advise envelope but never calls result.observe(), so the mutation-time delivery marker is never written and the advise branch repeats on every call.",
  "evidenceRefs": [
    ".vibe/plugins/repo-guards/spec-gate.mjs:72-78",
    ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1806",
    ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1827-1831",
    ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1866-1876",
    ".skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs:50-52",
    ".skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs:69",
    ".skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs:50",
    ".skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:54"
  ],
  "counterevidenceSought": "Checked whether the classify half writes the marker on the same session, which would make the pre_tool marker redundant. It does (spec-gate-classify.mjs:77 recordGate3NoticeDelivered with channel 'classify-deferral'), so the repeat only occurs when classify did not deliver. Checked whether the adapter's comment claims a deliberate choice: spec-gate.mjs:73-75 says the note 'is not recorded as a delivered question' because it cannot reach the model — that explains not recording a *question* delivery, but the core's observe() records a *notice* delivery, a different marker, and the comment does not address it.",
  "alternativeExplanation": "The author may have judged that an operator-facing UI note should repeat while the gate is open, as a persistent reminder. The code does not say so, and the four sibling adapters all stop the repeat, so the parity reading is the stronger one.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the Vibe runner is shown to dedupe an identical system_message within a session, or if a maintainer records that the repeat is the intended operator reminder."
}
```

### P2 Findings

1. **`process_start` is keyed by its bare name while every other map key is qualified** -- `.vibe/plugins/repo-guards/lib/hook-io.mjs:32-38` -- `CORE_TOOL_NAMES` maps four qualified names (`file_system.read_file`, `file_system.write_file`, `file_system.edit`, `file_system.bash`) and one bare name (`process_start`). The file's own comment two lines above states the premise the map is built on: "Vibe names its tools with a namespace". The recorded fixture agrees — `fixtures/wire-format/tool-names.md:3` says "`tool_name` is always the qualified name". A payload whose `tool_name` is `process.process_start` misses the map, falls through to the raw-name branch at line 86, and every shell guard then compares an unrecognized name against `'bash'` and allows.
   Finding class: algorithmic
   Scope proof: the inconsistency is visible in the target file alone; the fixture and the doc are cited as the wire-format reference.
   Affected surface hints: `.vibe/plugins/repo-guards/lib/hook-io.mjs`, and through it `spec-gate.mjs:59`, `env-secret-guard.mjs:23`, `dispatch-preflight.mjs:44`, `overlay-guard.mjs:42`, `git-message-gate.mjs:40`, `dist-freshness.mjs:91`
   Case: the model starts a background shell command. If Vibe reports it as `process.process_start`, the five shell guards and the dist-freshness shell check all allow it without judging the command.

2. **The session-cleanup hook imports another runtime's plugin outside the fail-open wrapper** -- `.vibe/plugins/repo-guards/session-cleanup.mjs:16` -- `import sessionCleanupPlugin from '../../../.opencode/plugins/session-cleanup.js'` is a static top-level import, so a load failure throws before `runGuard(main, ...)` at line 80 is ever installed. `runGuard` is the file's whole fail-open guarantee (`hook-io.mjs:94-105`), and it only wraps `main()`. Every other guard imports only from `.skilled/`; this one reaches into `.opencode/`, the tree a Vibe-only or vendored checkout is least likely to carry.
   Finding class: cross-consumer
   Scope proof: the import line is inside the declared target; `.opencode/plugins/session-cleanup.js` is cited as the dependency, not reviewed.
   Affected surface hints: `.vibe/plugins/repo-guards/session-cleanup.mjs`, the `session-cleanup-end` binding in `.vibe/hooks.toml:135-138`, and `session-start.mjs:82-92` which spawns the same script for the startup guards
   Case: a checkout that carries `.skilled/` and `.vibe/` but not `.opencode/`. Every session start silently loses the startup-guard warnings, and every session end loses the cleanup and process sweep, with no diagnostic beyond a module-resolution stack trace.

3. **The dispatch preflight passes the raw payload cwd to the rule engine** -- `.vibe/plugins/repo-guards/dispatch-preflight.mjs:22-25` -- `ruleContext` forwards `payload.cwd` unchanged, while every other guard that needs a directory resolves it through `sessionDirFor` (`hook-io.mjs:25-27`), which anchors a relative cwd to the checkout. The file's own comment at line 20-21 says "The rule checks read the folder the command runs in, which the payload carries", so the value matters to the verdict.
   Finding class: instance-only
   Scope proof: inside the declared target.
   Affected surface hints: `.vibe/plugins/repo-guards/dispatch-preflight.mjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs`
   Case: a fixture or a scratch-cwd run whose payload carries a relative `cwd`. The rule engine resolves it against the hook process's own working directory instead of the checkout, so a rule that depends on the run folder judges a different tree than the one the command runs in.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The recorded wire format in `references/guards-and-hooks.md` §5 matches the adapters' payload reads for `tool_name`, `tool_input.command`, `tool_input.file_path`, `session_id`, `parent_session_id` and `transcript_path`. It does not cover the `pre_tool` advise reply field, which `spec-gate.mjs:76` relies on — recorded as finding R1-P2-001's neighbour in iteration 2. |
| `checklist_evidence` | notApplicable | The review target is a hook and plugin surface with no checklist document of its own; the governing evidence is the wire-format fixture and the playbook verdict table, both cited above. |

## Integration Evidence

- `.vibe/hooks.toml:36-40` — the `spec-gate` binding is `type = "pre_tool"`, `strict = true`, `match = "re:bash|process_start|write_file|edit"`. The `strict` flag is what makes the missing acknowledgement matter: a non-conforming reply on a strict `pre_tool` hook is a failure path, and a failure path is a deny.
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1866-1876` — `runEnforceGate` builds `observe` only for the advise branch and documents the adapter's obligation to call it.
- `.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,cursor,devin}/spec-gate-enforce.mjs` — the four sibling adapters that satisfy the obligation.
- `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md:3` — "`tool_name` is always the qualified name", the premise finding R1-P2-001 tests.

## Edge Cases

- **Unverified `process_start` payload.** No captured `process_start` payload exists in the repository; `tool-names.md` records five tools and mentions `process_start` only in prose. Finding R1-P2-001 is therefore inference from the file's own stated premise plus the fixture's "always qualified" rule, not an observation. It is held at P2 for that reason, with an explicit upgrade trigger: capture one `process_start` payload; if `tool_name` is qualified, the finding becomes P1 because five guards fail open on the background-shell path.
- **`system_message` on `pre_tool` is unverified.** The reference doc records `system_message` only for `session_start` (`guards-and-hooks.md:238`). Whether the `pre_tool` reply schema accepts it is not recorded. This is carried into iteration 2 as its own finding rather than folded into R1-P1-001, because the two have different fixes.
- **Prior-finding overlap checked.** None of the four findings appears in the 29 dispositions in `023-vibe-review-remediation/implementation-summary.md`. The closest, `R4-P2-001--e3447f5b13ad` and `R4-P2-002--c3535226947a`, were documentation fixes in `guards-and-hooks.md`; R1-P1-001 is a code defect in the adapter.

## Confirmed-Clean Surfaces

- `hook-io.mjs:45-58` `readPayload` — decodes across chunk boundaries, rejects a non-object and an array, and returns null on a parse error.
- `hook-io.mjs:66-69` `deny` — writes the exact `{"decision":"deny","reason":...}` shape the wire fixture recorded, and exits 0.
- `hook-io.mjs:78-87` `toCoreCall` — carries only the fields a core judges, so a write's `content` is never mistaken for a path.
- `spec-gate-classify.mjs:59` and `spec-gate.mjs:65` — both halves key gate state on the same session id; `resolveSessionKey` and `sessionStateKey` both fall back to `UNKNOWN_SESSION_ID`, so a payload with no `session_id` still lands on one shared state file.
- `spec-gate-classify.mjs:78` — the classify half does call `result.observe()`, so the deferral delivery is recorded.
- `env-secret-guard.mjs:23` — overrides the core call's cwd with `sessionDirFor(payload.cwd)`, which is the correct resolution for a path guard.
- `overlay-guard.mjs:35-37` — judges both the session tree and the checkout, de-duplicated.
- `git-message-gate.mjs:25-33` — blanks `process.argv[1]` around the core import so the core's own CLI entry cannot start.
- `mcp-route-guard.mjs:33-40` — rejects an empty server segment and a trailing separator before repacking.
- `deep-loop-guard.mjs:105` — `tool_input.config_name` is the real Vibe field, confirmed by `guards-and-hooks.md:126` and live scenario VIB-HK-024.
- `render-home-hooks.cjs:32,36,84-99` — refuses a checkout path with a quote, backslash, dollar, backtick, CR or LF, and refuses a rendered command that still holds a substitution.
- `render-home-hooks.cjs:61-66` — refuses the operator's own `~/.vibe`.

## Ruled Out

- **Journal segment ordering in the session reader.** `session-readers/vibe.mjs:66` sorts journal file names with a default lexicographic `.sort()`, which would misorder `10.jsonl` before `2.jsonl`. Ruled out: the live journal names are zero-padded to 16 digits (`journal/0000000000000234.jsonl`, recorded in `.skilled/logs/cli-dispatch-audit.log:163`), so lexicographic order equals numeric order. Recorded in the strategy as a BLOCKED approach.
- **`deep-loop-guard.mjs` reading the wrong subagent field.** `tool_input.config_name` is confirmed as the Vibe field by `guards-and-hooks.md:126` and by live scenario VIB-HK-024, which asserts the spawn carries `"config_name":"prompt-improver"`.
- **`toCoreCall` reading the wrong write path field.** `tool_input.file_path` is confirmed for `file_system.write_file` and `file_system.edit` by `fixtures/wire-format/tool-names.md:8-9`.
- **`spec-gate.mjs` and `spec-gate-classify.mjs` keying different state files.** Both resolve to the same key; see Confirmed-Clean Surfaces.
- **`git-message-gate.mjs` having no kill switch.** Documented as deliberate at lines 8-9: "The contract has no bypass on any surface, so this hook has no kill switch either."

## Next Focus

- Dimension: security
- Focus area: `.vibe/hooks.toml` binding set, the `system_message` reply on a strict `pre_tool` hook, and the kill-switch coverage of every composer part
- Reason: iteration 1 established that the guard seam is sound except for the acknowledgement gap; the next highest-value question is whether a strict binding can turn a non-blocking note into a deny, and whether every part of the composers can be switched off.
- Rotation status: correctness opened; security next.
- Blocked/productive carry-forward: the `process_start` upgrade trigger is carried forward as required evidence; the journal-ordering direction is BLOCKED and must not be retried.
- Required evidence: the recorded `pre_tool` reply schema, and the switch table in `.skilled/hooks/session-lifecycle/vibe/README.md:29`.

Review verdict: CONDITIONAL
