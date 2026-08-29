# Iteration 2: Runtime goal systems and speckit goal_prompting

## Focus

How Claude Code native goal and the local OpenCode/Pi/Cursor goal surfaces differ, and whether the speckit `goal_prompting` contract should become runtime-neutral given `opencode_goal` has no Claude adapter.

## Actions Taken

1. Read `.opencode/hooks/goal/README.md` runtime matrix and `.opencode/hooks/goal/goal-plugin.md` OpenCode plugin contract.
2. Read `.opencode/plugins/opencode-goal.js` (`experimental.chat.system.transform`, `opencode_goal` tools) and `.opencode/hooks/goal/lib/goal-core.cjs` 4000-char caps.
3. Read Cursor `goal-inject.mjs` (sessionStart-only; `stop` never fires on the tested CLI) and confirmed no `.opencode/hooks/goal/claude` directory.
4. Read cli-claude-code playbook `CC-029` / `goal-hook.md` and counted `goal` mentions under `.opencode/commands/speckit`.
5. Read all eight speckit workflow YAMLs' `goal_prompting` blocks, presentation offer line, and `speckit-goal-offer-contract.test.cjs`.

## Findings

### F8. There are three in-repo goal systems, not two — and Claude is a hole, not an adapter

| Surface | What it is | When the condition is evaluated | Char cap | Management |
|---------|------------|--------------------------------|----------|------------|
| OpenCode plugin `.opencode/plugins/opencode-goal.js` | Native plugin; `experimental.chat.system.transform` injects `[active_goal:]` every transform; idle heuristic/LLM verifier | Every turn (injection) + `session.idle` verify | 4000 objective, 4000 goalPrompt, 4800 injection | `opencode_goal` / `/goal-opencode` |
| Sibling core `.opencode/hooks/goal/lib/goal-core.cjs` | Runtime-neutral port of the plugin state machine; adapters bind identity | Pi: per-turn `input` transform + `turn_end` heuristic. Cursor: `sessionStart` once | Same 4000 defaults in core | Pi `/goal-pi` via `bin/goal.cjs`. Cursor: none (injection-only) |
| Claude | **No adapter directory, no command, no registration** | Unknown in this repo | Unknown in this repo | None |

[SOURCE: file:.opencode/hooks/goal/README.md:60-73] [SOURCE: file:.opencode/hooks/goal/goal-plugin.md:31-65] [SOURCE: file:.opencode/plugins/opencode-goal.js:29-31] [SOURCE: file:.opencode/plugins/opencode-goal.js:3053-3078] [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:60-62]

The OpenCode plugin does **not** import the sibling core. They share kill switch and state-directory contract only. [SOURCE: file:.opencode/hooks/goal/README.md:25]

Cursor adapter comment: `stop` never fires under the tested CLI build, so there is no verify/continue; sessionStart is the only adapter. [SOURCE: file:.opencode/hooks/goal/cursor/goal-inject.mjs:4-12]

Claude row in the matrix is explicit `by-design` empty. Playbook CC-029: the runtime-neutral core registers no Claude Code adapter; `.claude/commands/goal-opencode.md` is absent; this does **not** prove whether a live Claude product exposes a separate native goal feature. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md:11-40] Confirmed on disk: `test ! -e .opencode/hooks/goal/claude` → no adapter dir.

The research topic's claim that "Claude Code's native goal is a session-scoped Stop hook holding a frozen condition string evaluated at stop time" is **not evidenced in this repository**. The in-repo position is "live native capability unverified." Treat Stop-hook freeze/evaluate-at-stop as an **operator-supplied design constraint** for nested-goal wording, not as a confirmed local implementation. Goal-plugin.md even lists Claude as "Outside this contract." [SOURCE: file:.opencode/hooks/goal/goal-plugin.md:144]

The playbook cites `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` as "runtime routing authority." That path is **absent** (glob 0 files). Routing authority in-repo is the hooks README matrix plus CC-029. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md:48]

### F9. The 4000-char cap is real and is why a nested parent pointer exists

`DEFAULT_MAX_OBJECTIVE_CHARS = 4000` and `DEFAULT_MAX_GOAL_PROMPT_CHARS = 4000` in both the plugin and `goal-core.cjs`. Env overrides `OPENCODE_GOAL_MAX_OBJECTIVE_CHARS` / `OPENCODE_GOAL_MAX_GOAL_PROMPT_CHARS`; values above 4000 for the prompt cap are clamped per goal-plugin.md. Injection is separately capped at 4800, with a compact fallback when the full block would exceed budget. [SOURCE: file:.opencode/hooks/goal/goal-plugin.md:62-64] [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:60-62] [SOURCE: file:.opencode/hooks/goal/README.md:33]

Packet 033's `goal.md` is **15028 bytes** (204 lines) — 3.7× the 4000-char objective cap. A `/goal set` of that file's body would truncate. [SOURCE: file:specs/system-speckit/033-spec-kit-template-optimization/goal.md] (`wc -c` = 15028)

### F10. Speckit `goal_prompting` is OpenCode-tool-shaped and confined to eight YAMLs

`rg -c goal` under `.opencode/commands/speckit` totals **94** mentions (research topic said ~96; 94 confirmed).

`goal_prompt_choice` is confined to the eight workflow YAML assets (plan/complete/implement/resume × auto/confirm). Tests freeze that list. [SOURCE: file:.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:77-84]

Canonical block (plan-auto):

- default `offer`
- `offer`: render the optional session-goal offer; do **not** call `opencode_goal`
- `skip`: suppress; do not call
- `set`: `opencode_goal({ action: "set", objective: goal_objective })` requiring `goal_objective`
- `status_tool: opencode_goal_status`

[SOURCE: file:.opencode/commands/speckit/assets/speckit-plan-auto.yaml:98-132]

Resume is already a partial runtime-neutral exception: `set` records `goal_objective` for handoff only; "resume does not call `opencode_goal`." [SOURCE: file:.opencode/commands/speckit/assets/speckit-resume-auto.yaml:28-44]

Routers: plan/complete/implement `allowed-tools` include `opencode_goal` and `opencode_goal_status`. Resume allows status only. Tests pin that. Those tool names are OpenCode plugin tools; they have no Claude/Cursor registration. [SOURCE: file:.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:86-100] [SOURCE: file:.opencode/commands/speckit/plan.md:4]

Presentation offer line (frozen): `Session Goal (optional): A) Offer or reference a session goal for this workflow  B) Set goal: <objective>  C) Skip` — no mention of `goal.md`, and tests **forbid** the string `goal.md` in touched command files as a stale command filename. [SOURCE: file:.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:16] [SOURCE: file:.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:102-106] [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan-presentation.txt:81]

**Implication for the addon:** the packet document may still be named `goal.md` (033 already uses that name), but speckit command markdown must not mention that basename. Offer copy should say "session goal" / "packet goal file" without the `.md` token, or the stale-filename test must be narrowed to `commands/goal.md` / `goal-opencode.md`.

### F11. Decision: the contract should become runtime-neutral; do not add a Claude adapter to the sibling core

**Do** make `goal_prompting` runtime-neutral. **Do not** implement a Claude adapter under `.opencode/hooks/goal/claude` — CC-029 treats that as a contract change requiring native identity, management, and tests, and the matrix is `by-design` empty.

Runtime-neutral shape:

1. Keep `offer | skip | set` as operator UX. Keep default `offer`.
2. Replace hardcoded `tool: opencode_goal` with a **dispatch table**:
   - OpenCode → `opencode_goal({ action: "set", objective })` (current)
   - Pi → `bin/goal.cjs set --runtime pi --session <native> --workspace <root>` (identity-bound)
   - Cursor → cannot manage from speckit (injection-only, no native identity on prompt commands). `set` should instruct the operator to use a short objective the sessionStart hook will pick up **if** state was written with matching identity; otherwise treat `set` as "record objective for handoff" like resume.
   - Claude → **do not call `opencode_goal`**. If the operator's live Claude product has a Goal/Stop-hook command, the offer text should tell the agent to use **that native command** with the short parent pointer. Repo must not claim the Stop hook exists. If native goal is unavailable, `set` degrades to the same handoff-only behavior as resume.
3. `offer` on Claude/Cursor should still render — it is prose, not a tool call. That is how the existing offer fires in OpenCode (`offer` already does not call the tool). The gap is `set`, not `offer`.
4. For nested-goal, `goal_objective` on `set` must be the **short pointer string** (under 4000, ideally far under Cursor/Claude freeze budgets), never the body of `goal.md`.

The "offer does not fire where native goal lives" is only true if the agent **requires** `opencode_goal` to show the offer. YAML says offer does **not** call the tool. Confirm-mode presentation always includes Q9. The real Claude gap is: even if the agent shows the offer, **choice B cannot set a Claude-native Stop condition** because no adapter exists. Runtime-neutral `set` dispatch is the fix; showing the offer was never the blocker.

## Questions Answered

- Q2 (two/three runtimes, caps, no Claude adapter): answered. Native Claude Stop-hook mechanics remain operator-asserted, not repo-proven.
- Q3 (runtime-neutral contract): answered — yes, via a dispatch table; do not add a Claude sibling adapter.

## Questions Remaining

- Q4 binding wording / precedence / path validation
- Q5 AC_CLOSURE vs stop-evaluator
- Q6 durable vs log split and parent size cap

## Dead Ends

- **Porting `opencode_goal` into Claude via a new `hooks/goal/claude` adapter:** forbidden by CC-029 / matrix `by-design` empty until a native identity+management surface exists. Ruled out.
- **Treating OpenCode plugin and sibling core as one system:** they do not import each other. Ruled out.
- **Unifying Cursor `stop` with OpenCode idle verify:** Cursor `stop` does not fire on the tested CLI. Ruled out.

## Assessment

- newInfoRatio: 0.85
- noveltyJustification: Runtime matrix, 94 speckit mentions, 4000-cap vs 15028-byte 033 file, and the offer-vs-set distinction were new relative to iteration 1.
- confidence: high on in-repo surfaces; low on live Claude Stop-hook internals.

## Reflection

The research brief collapsed "Claude native Stop hook" with "repo goal systems." The repo's actual claim is the opposite of a Claude adapter: it carefully refuses to describe live Claude goal. Nested-goal design must still assume a frozen short string if the operator uses Claude's product feature, but implementation in this repo cannot call a tool that does not exist.

## Recommended Next Focus

Q4–Q6: binding as prompt convention, parent-over-child precedence, stop-gate asymmetry vs AC_CLOSURE, and splitting 033-style goal.md into durable directive vs volatile log with a parent size cap.

## SCOPE VIOLATIONS

None.
