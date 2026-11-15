# Lineage posture: approval and spec-gate options with evidence

The operator decides two axes in T005. This file gives each option the evidence it needs, so the decision is one answer rather than a comparison run.

Three tiers of claim appear below. **Observed** means this session ran the command or read the line cited. **Recorded** means an earlier phase in this packet observed it, quoted with its source and not re-verified here. **Derived** means it follows from a line cited here, and section 6 names the derived claims nothing has confirmed.

---

## 1. What a Vibe lineage does today

`buildVibeLineageCommand` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3154-3253`) refuses to start unless `.vibe/config.toml` (line 3198) and `.vibe/hooks.toml` (line 3203) exist, then:

- Reads the repository config into a disposable home and renders the guards into it: `renderHomeHooks({ vibeHome, repoRoot })` at line 3228. The renderer replaces `$(git rev-parse --show-toplevel)` with the resolved checkout root, so the home copy works from any cwd.
- Runs `vibe` with `--prompt-file`, `--output-dir`, `--trust`, `--model` and `--auto-approve` (lines 3230-3236).
- Sets `VIBE_HOME` to the lineage's own home (line 3245).
- Records no sandbox: "Vibe exposes no confinement flag", so `resolvedSandbox: null` (lines 3250-3252).

The child environment adds `SYSTEM_SPEC_GATE_DISABLED: '1'` (line 3891), `AI_SESSION_CHILD: '1'` (line 3892), and for this kind only `VIBE_SPEC_FOLDER` plus `SPECKIT_DIST_AUTO_REBUILD: '0'` (line 3909).

The guards a lineage runs are the twelve `.vibe/hooks.toml` entries (`rg -c '^\[\[hooks\]\]' .vibe/hooks.toml` prints 12):

- one `pre_agent`: `spec-gate-classify`
- seven strict `pre_tool`: `spec-gate`, `env-secret-guard`, `dispatch-preflight`, `overlay-guard`, `mcp-route-guard`, `git-message-gate`, `deep-loop-guard`
- two `post_tool`: `post-edit-quality` (strict) and `classifier-injection-screen`
- one `session_start`: `session-start`
- one `session_end`: `session-cleanup-end`

Recorded, not re-verified here: phase 011's keyed scratch-cwd run recorded in `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` section 1 that the journal's `pre_tool_call` and `post_tool_call` requests name the `user:` guard bindings, so the home copy is what runs and not a copy nobody loads.

Two guards sit outside the hook file and both matter to this decision:

- **Write containment** diffs the working tree after a dispatch and reports writes outside the lineage dir. Its default remedy is `preserve`, not restore (`fanout-run.cjs:3554`, `'preserve'` fallback), so it reports after the fact and leaves the bytes. It is not a boundary.
- **The tool approval layer** is the axis Option A keeps and Option C changes. Under `--auto-approve` it approves everything and never runs its own per-call rules, which section 3 pins.

---

## 2. What a research and a review iteration call

The strongest available evidence is the captured keyed lineage run at `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/vibe-output/`. Observed there:

- The tool catalog offered to the run, read from `payload.request.model_input.tool_catalog.tools` in `session/journal/0000000000000001.jsonl`, is exactly ten tools: `todo`, `unified_harness_scratchpad`, `search_tool_functions`, `run_typescript`, `wait`, `read_file`, `write_file`, `edit`, `bash`, `skill`. No `grep`, no `task`, no web tool, and no `ask_user_question`.
- The 68 tool calls it made, counted from the journal's `tool_call` parts: 59 `bash`, 6 `write_file`, 3 `todo`. It read files through `bash` (`cat`, `ls`) rather than `read_file`, and it made no `edit` call.
- The effective config it ran with, from `vibe-output/export.json`: `enabled_tools` empty, `disabled_tools` `["ask_user_question","cron"]`, `outside_workdir` `"ask"`, `enable_auto_approve` true, `default_agent` `"accept-edits"`, and `allowed_models` closed to the two roster names.
- Every tool call carried `_meta.approval` with `approvalSource: "bypass"`, so the flag and not the permission model decided each call.

What the iteration contracts require, which fixes the tools a tightening may not remove:

- Both iteration templates run the append gateway every iteration with `node .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (deep-research template line 74, deep-review template line 147), and both call skipping it a failed iteration. The runner then runs the reducer, also with `node`.
- Both write the iteration file, its delta and the strategy file, which is `write_file` and `edit` work.
- Deep research targets "3-5 research actions. Max {max_tool_calls_per_iteration} tool calls total" (template line 36). Deep review targets "8-11 tool calls per iteration (max 12)" (`deep-review/SKILL.md:246`).
- A review iteration reads the reviewed code and diffs before it can name a finding, and the observed research iteration spent 59 of its 68 calls on `bash` for exactly that.

`bash` is therefore not removable: without it an iteration cannot run the gateway or the reducer, and both are mandatory. Any allowlist that keeps `bash` keeps a full shell, which is the fact the whole approval axis turns on.

---

## 3. What each lever restricts

### `--enabled-tools`

Help text, captured at `../001-deep-research/research/evidence/vibe-help.txt:54-57`: "Enable specific tools (headless: disables all others). Repeat the flag", and `--disabled-tools` filters "after `--enabled-tools` filtering".

It removes tools from the catalog. It does not constrain the tools that stay, so an allowlist of `bash`, `write_file`, `edit`, `read_file`, `todo` and `skill` yields exactly the surface the observed run already had and confines nothing.

Cost of getting it wrong: a name the allowlist omits is a tool the iteration silently lacks. `wait`, `search_tool_functions` and `unified_harness_scratchpad` are harness internals whose removal nobody has tested. Omitting `skill` drops the skill tool the repository's skills mirror depends on.

### `--add-dir`

Help text, same capture line 62: "Additional working directory for file access. Repeat the flag".

Two effects, and the second is not obvious:

- Allowlisted paths, `--add-dir` directories and the scratchpad are "never refused" by the outside-workdir policy (`vibe/plugins/builtins/vibe/skills/vibe/SKILL.md:489-490`, relative to the installed package root `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/`).
- An add-dir root contributes its own `.vibe/hooks.toml`. `project_roots` is the trusted cwd plus every add-dir, and `hook_files` builds `root/.vibe/hooks.toml` for each root plus `VIBE_HOME/hooks.toml` (`vibe/core/config/harness_files/_harness_manager.py:120-144`).

So `--add-dir <checkout>` would load the checkout's `.vibe/hooks.toml` in addition to the rendered home copy, and the twelve guards would run twice per call. That is a latency and double-state cost to pay deliberately, or the home render would have to become the only copy.

### `--agent`

Help text, same capture line 46: builtin `ask`, `accept-edits`, `smart-approve`, `auto-approve`, or a custom profile, defaulting to the `default_agent` config setting.

`--agent` is a whole-mode switch, not a per-tool allowlist, and in headless mode every mode that asks degrades to a denial rather than a refusal. The run cannot prompt (`ask_user_question` is even in `disabled_tools`), and the exit taxonomy in section 6 of the cli reference has no denial member, so a denied tool is a tool result and the run can still finish with exit 0. A tightened `--agent` therefore stalls an iteration quietly and reports success, which is the failure mode REQ-005's Vibe suite run is there to catch.

### `--auto-approve` and the permission model

This is the decisive pair, and it is why `--enabled-tools` and `outside_workdir` cannot be combined into confinement while `--auto-approve` stays. Observed in the installed package:

- `--auto-approve` resolves the tool gate to `BYPASS`: `bypass_approval = (requested or config.bypass_tool_permissions) and config.enable_auto_approve` (`vibe/app_server/_runtime.py:2957-2968`), and under `BYPASS` every present builtin is set to `allow` and the per-call resolver is retired (`_runtime.py:3106-3117`).
- The package states the consequence itself at `vibe/plugins/builtins/vibe/skills/vibe/SKILL.md:499`: "Auto-approve skips the check, like the denylists."

So under today's flags, `outside_workdir = "deny"` and every per-tool permission row are inert. The only guards left standing are the twelve hooks and the after-the-fact write containment.

`--smart-approve` is the one lever that keeps the permission model alive: it resolves to the `CLASSIFIER` gate, which "runs the resolver first and only classifies its `ask` residue" (`vibe/app_server/_runtime.py:3096-3142`). That is what makes `outside_workdir = "deny"` meaningful, at the cost of a utility-model call per residue and a denial whenever the classifier says no to a call nobody can re-ask.

---

## 4. The spec-gate axis

`SYSTEM_SPEC_GATE_DISABLED=1` sits at `fanout-run.cjs:3891` beside `AI_SESSION_CHILD=1` at line 3892, and the comment above them (lines 3876-3884) gives the reason: "ENFORCE=0 alone is NOT enough -- that only stops the deny, while an unbound child could still open the gate and meet the mutation-time notice instead of doing its work."

Reading the core, that reason no longer describes the code. Observed in `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`:

- `classifyIntent` returns `{ status: 'closed', question: null }` for a child before any classification (line 1630).
- `evaluateMutation` returns a complete `allow` with `detail: null` for a child before it reads gate state (line 1775).
- The three delivery checks short-circuit on a child (lines 418, 443, 466).
- `bindGate3Answer` rejects with `child_session` (line 492).
- `gate3EmissionBlocked` reads only `SYSTEM_SPEC_GATE_DISABLED` (lines 401-403).

So `AI_SESSION_CHILD=1` alone already makes Gate 3 inert at every entry point, including the notice path the comment worries about, and `SYSTEM_SPEC_GATE_DISABLED=1` is a second, redundant layer that happens to be checked first. Removing it changes nothing while `AI_SESSION_CHILD=1` stays. The two must move together: Vibe's `spec-gate` hook supplies `SYSTEM_SPEC_GATE_ENFORCE=1` whenever the operator has not set it (`.vibe/plugins/repo-guards/spec-gate.mjs:62`), so a lineage that loses `AI_SESSION_CHILD` while keeping the gate enabled would deny every write and edit against an open gate.

Independently of the gate, `VIBE_SPEC_FOLDER` (line 3909) is what binds the packet: the `session-start` hook names it in the goal slice. Lifting the gate does not unbind the packet.

---

## 5. The options

Each option names both axes, because T005 records both.

### Option A: keep the flags, record the compensating guards

Approval stays `--auto-approve`, the spec gate stays `SYSTEM_SPEC_GATE_DISABLED=1`.

What that rests on: twelve hooks, seven of them strict `pre_tool` over `bash`, `process_start`, `write_file`, `edit` and `read_file` (`env-secret-guard` refuses a dotenv read or write, `dispatch-preflight` refuses a dispatch that breaks a target CLI's hard rules, `overlay-guard` protects vendored trees, `mcp-route-guard` and `git-message-gate` refuse routed and message violations, `deep-loop-guard` refuses a mode-mismatched subagent spawn), plus `post-edit-quality` and the injection screen after the call, plus write containment after the run.

What it does not buy: any boundary on where a tool reaches. `--auto-approve` retires the permission model, so an iteration can write anywhere the process can, and write containment reports that afterwards without undoing it.

Cost: one short decision record, no code change, no re-run risk.

### Option B: tighten the tool surface only

Keep `--auto-approve` and the spec gate, add `--enabled-tools` for the ten names the observed catalog offered, minus `run_typescript` unless a lineage names `code_mode`.

What it buys: the tool catalog can no longer grow by config drift, and a tool nobody listed is absent. The `export.json` `config.enabled_tools` field makes the effective set readable per run.

What it does not buy: `bash` is on the list, so confinement is unchanged. The restriction is about which tools exist, not what one may do.

Cost: the allowlist must name the harness internals nobody has tested, and a future mode that needs a new tool fails at dispatch rather than at review. REQ-005's Vibe unit and stress cases are the check.

### Option C: move confinement into the permission model

Replace `--auto-approve` with `--smart-approve`, set `outside_workdir = "deny"` in the lineage's home config, and pass `--add-dir <checkout>` so the gateway, the reducer and the reviewed tree stay reachable.

What it buys: the first boundary in this list. Added dirs are never refused (`vibe/plugins/builtins/vibe/skills/vibe/SKILL.md:489-490`), everything else is, and the resolver runs again because `CLASSIFIER` keeps it (`vibe/app_server/_runtime.py:3096-3142`).

What it costs: a utility-model call per `ask` residue, a denial wherever the classifier says no to a call that cannot re-ask, and the duplicate hook load that `--add-dir <checkout>` brings (`_harness_manager.py:120-144`). It needs a runner change to write `outside_workdir` into the home config, because the home copy is the repository config verbatim. The package's note on the same page says a shell that must stay inside should not be `always`, and Vibe only checks paths it can read statically, so interpreter code and `cd` chains remain outside the check.

### Option D: lift `SYSTEM_SPEC_GATE_DISABLED`, keep `AI_SESSION_CHILD`

Drop line 3891, leave line 3892.

What it buys: one less redundant switch, and a lineage env that says only what it means. Behavior is unchanged, per section 4.

What it costs: the second layer disappears. If a later change drops `AI_SESSION_CHILD`, Gate 3 wakes up inside a headless child with no one to answer it, and the failure is a denial on every write rather than a loud configuration error. The comment at lines 3876-3884 would also need rewriting, because its stated reason no longer matches the core.

This axis is independent of the approval axis, so it can be combined with A, B or C.

---

## 6. What is not established

- **UNKNOWN:** whether the ten-tool catalog is the same for a review lineage as for the observed research one. Both run the same adapter and the same repo config, and no review lineage under `cli-mistral-vibe` has been captured. What would settle it: one keyed review lineage, then read `tool_catalog.tools` from its journal.
- **UNKNOWN:** the cost of a `--smart-approve` residue call for this roster. No run has priced one.
- **Not verified here:** that the twelve guards keep blocking under `--auto-approve` in a *Vibe* session. Section 1 quotes phase 011's keyed run for that, and the strict-hook behavior itself is a source reading of the harness, not something this session exercised.

---

## 7. What was applied

The operator chose **Option A** on the approval axis and **keep both switches** on the spec-gate axis (Q004 and Q005 in the parent `decision-record.md`, both approved 2026-11-14).

- **Approval:** no lineage flag changed. `rg -n "'--auto-approve'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` still matches (line 3268, moved from 3236 by later edits). The compensating guards are the twelve rendered hooks and the after-the-fact write containment recorded in section 1.
- **Spec gate:** no runner env changed. `SYSTEM_SPEC_GATE_DISABLED=1` and `AI_SESSION_CHILD=1` both stay beside each other.
- **Deep-loop rerun:** not applicable: posture kept. No lineage flag changed, so the Vibe unit and stress cases rerun no changed behavior.
