# Ask-Surface Enforcement: Native Ask Tools and Turn-End Enforcement Across CLI Runtimes

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1794132897320-q8eip1`
**Spec folder:** `specs/hooks-plugins-extensions/027-ask-surface-enforcement`
**Iterations:** 5 of 5 · **Stop reason:** maxIterationsReached

---

## 1. Executive Summary

Every runtime in this repository that has an ask tool names it in a way this repository can
prove, and the tool is gated somewhere: by subagent exclusion on Claude Code and Devin, by
headless mode on DSH, by a feature flag and mode on Codex, and by nothing on OpenCode and Pi
except the installed extension set. Cursor has no evidenced ask tool at all, and Hermes was
removed from the repository in v4.0.2.0.

Enforcement is a different question, and the answer is narrower than the tool matrix. Only two
runtimes expose a turn-end seam that can force another step: **Claude Code** (`Stop` with
`decision: "block"`) and **DSH** (`agent/turn-stopping`). Codex, Cursor and Devin have turn-end
events, but no block contract is documented in this repository, so they are observe-only in
practice. OpenCode and Pi have no turn-end seam at all.

The repository already contains both halves of the detector: `chat-questions.mjs` finds a
closing question with lettered options, and the decision-capture sweeps prove whether an ask
tool ran in a turn for six runtimes. The gap is the option grammar (A-D only) and the missing
negative fixtures, not the parser.

The rule text is the cheapest lever and the one with a real constraint: the `REPO RULES.md`
ask-surface carve-out makes `communication-handoff.md` §5 the only place a tool name may
appear, so `AGENTS.md` Gate 3 must reference §5 rather than name a tool itself.

---

## 2. Method and Evidence Standard

Five iterations, one focus each, every finding carrying a file:line or a documentation URL.
Claims about platform behaviour come from the vendor's own reference (Claude Code hooks and
tools reference) or from the runtime's type declarations and adapter code in this repository.
Where the repository documents less than the platform may support — Codex Stop, Cursor
`afterAgentResponse`, Devin Stop — the finding says "unproven" rather than guessing, and the
implementation plan treats those runtimes as observe-only.

---

## 3. Q1 — Does an ask tool exist, what is it called, and when is it available?

| Runtime | Ask tool (exact) | Availability gate | Evidence |
|---|---|---|---|
| Claude Code | `AskUserQuestion` | Main conversation only. Removed from every subagent's tool pool "even when listed in the `tools` field". No permission prompt. `askUserQuestionTimeout` can auto-close a question. | [tools reference](https://code.claude.com/docs/en/tools-reference.md), [sub-agents](https://code.claude.com/docs/en/sub-agents.md), `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` |
| Codex | `request_user_input` | Gated by mode. Plan mode has it; Default mode only behind `default_mode_request_user_input` (enabled in `.codex/config.toml`); `codex exec` never. Auto-allowed, so it reaches `PreToolUse` while the operator decides. | `.skilled/hooks/decision-capture/bin/sweep-codex.mjs:38`, `.codex/config.toml`, `.skilled/repo-rules/communication-handoff.md:152`, `.../codex-events.ts:114` |
| Pi | `ask_user_question` (from `@juicesharp/rpiv-ask-user-question`) and `question` (from `pi-plan-build`) | No built-in tool. Available when the extension is installed; both are enabled in `.pi/settings.json`. | `.skilled/hooks/decision-capture/bin/sweep-pi.mjs:32`, `.pi/settings.json`, `.pi/PLUGINS.md` |
| OpenCode | `question` | Built in. No mode or flag in this repository removes it; no agent definition sets a `tools:` block. | `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs:46`, `.opencode/agents/code.md` |
| Devin | `ask_user_question` | Not available to subagents. | `cli-devin/references/devin-tools.md:212`, `.skilled/hooks/decision-capture/bin/sweep-devin.mjs:41` |
| Cursor | **None evidenced** | No decision-capture adapter, no question tool in the Cursor tool reference, no ask-tool name anywhere in the Cursor references. | `cli-cursor/references/cursor-tools.md`, `.skilled/hooks/decision-capture/bin/README.md` |
| DSH | `ask_user_question` | Headless runs have no question tool; interactive sessions do. | `.dsh/plugins/repo-guards/README.md:94`, `.skilled/hooks/decision-capture/bin/sweep-dsh.mjs:33` |
| Hermes | **Out of scope** | Removed in v4.0.2.0: `cli-hermes`, `.hermes/` and the launcher are gone; the hub routes seven modes. | `.skilled/changelog/skilled/v4.0.2.0.md:47`, `mode-registry.json` |

**Consequence for fan-out lineages.** Claude Code subagents, DSH headless runs and `codex exec`
cannot ask the operator at all. A rule that demands an ask tool in those contexts is
unsatisfiable; that is why the prose fallback must survive, narrowed.

---

## 4. Q2 — Which event can detect and block a prose-menu turn end?

| Runtime | Turn-end event | Can block? | Notes |
|---|---|---|---|
| Claude Code | `Stop` | **Yes** — `decision: "block"` + `reason`; `last_assistant_message` carries the text; `stop_hook_active` guards re-entry; 8-continuation cap | All three current Stop hooks are `async: true`, so none blocks today |
| DSH | `agent/turn-stopping` | **Yes** — "Force another step before the turn ends" | The repo's completion-evidence adapter uses it with "Log and continue" |
| Codex | `Stop` | **Unproven** — only `UserPromptSubmit` exit 2 blocks; other non-zero exits fail open; Stop stdout is a response envelope | Observe-only in practice |
| Cursor | `afterAgentResponse`, `stop` | **Unproven** — the `permission` envelope gates intercepted actions; the repo's Cursor adapter is advisory and returns nothing | Observe-only in practice |
| Devin | `Stop` | **Unproven** — the block decision lives on `PermissionRequest`, not Stop | Observe-only in practice |
| OpenCode | `event` (`session.idle`) | **No** — subscription only; `tool.execute.before` is the only denying hook | Observe-only |
| Pi | `agent_end`, `message_end` | **No** — `agent_end` has no result type; `message_end` may only replace the message; only `tool_call` blocks | Observe-only |

**The detector must therefore be capability-aware.** On a runtime with no blocking seam, the
adapter can only log an advisory; the rule text is the enforcement. On Claude Code and DSH, the
adapter can re-prompt.

---

## 5. Q3 — The detector heuristic, its false positives, and fixtures

### 5.1 Algorithm

A turn fails the ask-surface rule when all four hold:

1. The last assistant message's closing block contains a **question** — a `?` in prose, after
   fenced code, inline code, quoted text, blockquotes, tables and headings are stripped.
2. The same block, or the block immediately after it, contains **two or more option lines** —
   `A)`–`D)` today; the guard should widen to `A.`/`A)`, `1)`/`1.` and bolded variants.
3. No **ask-tool call** appears in the turn: `AskUserQuestion`, `request_user_input`,
   `question`, `ask_user_question` as appropriate to the runtime, read from the transcript or
   session store.
4. The runtime **has a usable surface** in this session — not a Claude subagent, not a DSH
   headless run, not `codex exec`.

### 5.2 False-positive risk

| Input class | Risk | Why |
|---|---|---|
| Ordinary numbered steps (`1. Read`, `2. Edit`) | **Low** | The option gate requires an `A)`-shaped marker; `1.` does not match |
| Summary ending in a question ("Anything else?") | **Low** | No option list, so the gate fails |
| Summary with four `A)` lines and a question | **Intended fire** | This is the failure the guard exists to catch |
| Fenced code block containing `A)` lines | **Medium** | `prose()` strips fences for the question test, but `isOptionsOnly`/`optionLabelsOf` read raw lines |
| Blockquoted earlier menu | **Medium** | Same asymmetry: quotes are stripped for the question test, not for option extraction |
| A question already asked through the tool | **None if the tool scan runs** | The fourth condition suppresses it |

The two medium risks are fixed in the detector, not in policy: strip fences and quotes before
option extraction, then reuse `chat-questions.mjs` unchanged for the question test.

### 5.3 Test-fixture set

| Fixture | Expected | Purpose |
|---|---|---|
| `prose-menu-lettered.md` | fire | `A)`–`D)` plus a closing question, no tool call |
| `prose-menu-numbered.md` | fire | `1)`–`4)` plus a closing question (current regex misses it) |
| `prose-menu-bold.md` | fire | `**A)**` style, mixed with a question |
| `numbered-steps.md` | pass | `1.`–`5.` plan with no question |
| `summary-question.md` | pass | "Anything else?" with no options |
| `code-block-menu.md` | pass | A fenced `A)`–`D)` sample plus a question |
| `blockquoted-menu.md` | pass | A quoted earlier menu plus a question |
| `single-option.md` | pass | One `A)` line only |
| `tool-asked.md` | pass | The menu was asked through the tool; transcript shows the call |
| `fallback-session.md` | pass | Claude subagent / DSH headless; surface unavailable |
| Existing `claude-chat-questions.jsonl`, `codex-request-user-input.json`, `opencode-question-parts.json`, `pi-ask-user-question.json`, `devin-transcript.json` | pass (positives) | Prove the tool scan still recognizes a real ask |

---

## 6. Q4 — Wiring

### 6.1 Three registration surfaces, not one

`hook-registry.json` is canonical for **claude, codex, cursor, devin**, and verifies **Pi**
symlinks. DSH registers through `.dsh/plugins/repo-guards/index.mjs`; OpenCode through
`.opencode/plugins/`. A complete guard touches all three.

### 6.2 Registry entry sketch

```json
{
  "id": "ask-surface-guard",
  "concern": "Make the agent ask through the runtime's ask tool instead of a prose option menu",
  "bindings": {
    "claude": [{ "event": "Stop", "group": 0, "slot": 2, "matcher": "", "runner": "node",
      "script": ".skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs",
      "timeout": 5, "fallback": "envelope" }],
    "codex": [{ "event": "Stop", "group": 0, "slot": 2, "matcher": null, "runner": "node",
      "script": ".skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs",
      "timeout": 5, "fallback": "envelope" }],
    "cursor": [{ "event": "afterAgentResponse", "group": 0, "slot": 1, "matcher": null,
      "runner": "node", "script": ".skilled/hooks/ask-surface-guard/cursor/ask-surface-response.mjs",
      "timeout": 5, "fallback": "envelope" }],
    "devin": [{ "event": "Stop", "group": 0, "slot": 2, "matcher": "", "runner": "node",
      "script": ".skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs",
      "timeout": 5, "fallback": "none" }]
  },
  "pi": { "extension": "ask-surface-guard.ts" }
}
```

The Claude binding deliberately **omits `async`**: async means "runs in the background without
blocking", and a background Stop hook cannot re-prompt. The other three keep the field absent
too, but their events have no block contract, so they are observe-only regardless.

### 6.3 Layout

```
.skilled/hooks/ask-surface-guard/
  claude/ask-surface-stop.cjs          (real; blocking)
  codex/ask-surface-stop.cjs           (observe-only)
  cursor/ask-surface-response.mjs      (observe-only)
  devin/ask-surface-stop.cjs           (observe-only)
  pi/ask-surface-guard.ts              (real; .pi/extensions/ symlink)
  dsh/ask-surface-guard.mjs            (real; .dsh/plugins/repo-guards/adapters/ symlink)
  lib/ask-surface-core.cjs             (detector + tool-scan + policy)
  fixtures/…                           (the set in §5.3)
.opencode/plugins/ask-surface-guard.js (observe-only, session.idle)
```

### 6.4 Loop guard

- Claude: return immediately when `payload.stop_hook_active === true`.
- All: write a per-session, per-turn marker (hashed session id + turn id) so a second fire in
  the same turn is suppressed. The platform's 8-continuation cap is the backstop, not the
  design.

### 6.5 Sync versus async

| Runtime | Mode | Why |
|---|---|---|
| Claude Code | **sync**, timeout 5s | Only a synchronous Stop hook can block |
| DSH | sync at `agent/turn-stopping` | The seam forces another step |
| Codex, Cursor, Devin | sync or async, advisory | No block contract; prefer async to keep turn end cheap |
| OpenCode, Pi | async / event-driven | Observe-only |

### 6.6 Escape hatch

- `SYSTEM_ASK_SURFACE_DISABLED=1` via `isHookEnabled('ask-surface')`.
- Master `SYSTEM_HOOKS_DISABLED=1` disables the whole layer.
- Environment wins over `hook-flags.env`.
- Capability exemption is automatic: no surface in the session means no fire.

---

## 7. Q5 — Rule-text amendments

### 7.1 `communication-handoff.md` §4

Keep the three-condition test. Replace the opening sentence so the surface is named by
reference, not by prose:

> **Ask as a structured choice through the surface §5 names for this runtime when all three
> hold:** … (conditions unchanged)

### 7.2 `communication-handoff.md` §5

Update the table rows:

| Runtime | Surface |
|---|---|
| Claude Code | `AskUserQuestion` — main conversation only; never available to a subagent |
| Pi | `ask_user_question` (rpiv extension) or `question` (pi-plan-build) |
| OpenCode | `question` |
| Codex | `request_user_input`, only where the turn's tool list names it |
| Devin | `ask_user_question` — not available to a subagent |
| DSH | `ask_user_question` — interactive only; headless runs have none |
| Cursor | No evidenced surface; use the fallback |
| Anything else | No native surface assumed; use the fallback |

Replace the fallback paragraph with:

> **A runtime with no such surface, or a session where the surface is unavailable — a Claude
> subagent, a DSH headless run, a `codex exec` turn — is not exempt.** It falls back to a
> numbered list of named options with the recommendation marked, and says in one line that the
> question could not be asked through the runtime's surface. The fallback is a capability
> statement, never a preference.

### 7.3 `AGENTS.md` Gate 3

Do **not** name a tool here: the carve-out makes §5 the only place a tool name may appear.
Replace the prose-menu instruction with:

> **Ask the question through the surface `communication-handoff.md` §5 names for this
> runtime.** The A/B/C/D lines below are the option labels you pass to that surface; print them
> as prose only when §5's fallback applies, and then say why.

The A/B/C/D definitions stay, because they are the content of the question, not its transport.

### 7.4 Should the prose fallback stay?

**Yes, narrowed.** Three contexts have no usable surface — Claude subagents, DSH headless runs
and `codex exec` — and a rule with no fallback would be unsatisfiable there. The fallback must
be tied to capability, must be announced in one line, and must never be chosen because prose is
easier.

---

## 8. Ranked, Phase-Able Implementation Plan

| Rank | Phase | Change | Why first | Verification |
|---|---|---|---|---|
| **P0** | Rule text | Amend §4, §5, Gate 3 exactly as §7; update the OpenCode row to `question` | Cheapest lever; fixes the always-loaded instruction that teaches the failure | Read the three files; confirm no tool name appears outside §5 |
| **P1** | Detector core | `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs`: widen the option grammar, strip fences/quotes before option extraction, reuse `chat-questions.mjs` for the question test, add the tool scan | Both halves exist; the gap is grammar and stripping | Unit tests over the §5.3 fixture set |
| **P2** | Claude blocking guard | `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs`, registry entry with no `async`, `stop_hook_active` guard, per-turn marker, kill switch | The only runtime where blocking is proven and the failure is observed | `sync-hook-registrations.cjs --check`, then a live Stop with a synthetic prose menu |
| **P3** | DSH blocking guard | `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` at `agent/turn-stopping`, symlinked into the repo-guards bundle | Second proven seam; covers the harness the repo now ships | Adapter fixture test; bundle boot check |
| **P4** | Observe-only adapters | Codex Stop, Cursor `afterAgentResponse`, Devin Stop, OpenCode `session.idle`, Pi `agent_end`; advisory log only | Closes the matrix without pretending to enforce | Each adapter fires once on a fixture and never blocks |
| **P5** | Registry coverage note | Document that DSH and OpenCode are wired outside `hook-registry.json` | Prevents the next hook from being declared complete on a registry entry alone | A line in the hook library README |

**Dependency order:** P0 can ship alone. P1 must precede P2-P4. P2 and P3 are independent of
each other. P4 depends only on P1. P5 is documentation and can ship last.

---

## 9. Eliminated Alternatives

- **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate
  and shipping questions from capture — the opposite polarity. It would silence the guard on
  Gate 3 itself.
- **A pure `last_assistant_message` check.** It cannot prove no ask tool ran.
- **Blocking on OpenCode's `event`, Pi's `agent_end`, Codex Stop, Cursor `afterAgentResponse` or
  Devin Stop.** None has a documented block contract in this repository.
- **Naming the tool in `AGENTS.md`.** Breaches the ask-surface carve-out.
- **Removing the prose fallback.** Unsatisfiable in three real contexts.

## 10. Divergence Map

- Saturated directions: none; each runtime was visited once and closed.
- Pivots: one — the research topic names Hermes, the repository removed it, so the matrix
  closed at seven runtimes plus Cursor's evidenced absence.
- Remaining frontier: upstream Codex/Cursor/Devin hook documentation, which would settle
  whether their turn-end events can block. Until then they stay observe-only.

## 11. Open Questions

1. Does a current Codex release document a `Stop` block decision? The repository's hook
   contract does not, and the upstream search was unavailable in this session.
2. Does Cursor honour a `permission: "deny"` envelope on `afterAgentResponse`? The contract
   documents the envelope, not which post-hoc events honour it.
3. Does Devin's `Stop` accept a block decision? Only `PermissionRequest` is proven.

None of these blocks P0-P3; each would upgrade a P4 adapter from observe-only to blocking.

## 12. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: Devin/Cursor/DSH/Hermes (0.94); run 4: detector and fixtures (0.90); run 5: wiring and rule text (0.85)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## 13. References

- https://code.claude.com/docs/en/tools-reference.md
- https://docs.claude.com/en/docs/claude-code/hooks
- https://code.claude.com/docs/en/sub-agents.md
- `.claude/settings.json`
- `.skilled/hooks/decision-capture/` (all sweeps, `lib/chat-questions.mjs`, `lib/capture-core.mjs`, fixtures)
- `.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,cursor,devin}/completion-evidence-*`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/{hook-registry.json,sync-hook-registrations.cjs}`
- `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/hooks/README.md`
- `.skilled/repo-rules/communication-handoff.md`, `REPO RULES.md`, `AGENTS.md`
- `.pi/types/pi-coding-agent.d.ts`, `.pi/settings.json`, `.pi/PLUGINS.md`
- `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/system-completion-sentinel.js`
- `.dsh/plugins/repo-guards/README.md`
- `.skilled/skills/cli-external-orchestration/{cli-codex,cli-cursor,cli-devin,cli-deepseek-harness}/references/*`
- `.skilled/changelog/skilled/v4.0.2.0.md`

---

## Appendix A — Workflow steps deliberately not run

Two `phase_synthesis` steps write outside this lineage and were therefore skipped under the
dispatched-worker write boundary:

- `step_writeback_spec_findings` edits `{spec_folder}/spec.md`; out of scope.
- `step_validate_post_synthesis_spec_doc` runs `validate.sh` against the spec folder; out of
  scope and explicitly forbidden by the dispatch brief.

Both are recorded here rather than silently omitted. Everything else in `phase_init`,
`phase_main_loop` and `phase_synthesis` that writes inside the lineage was executed.
