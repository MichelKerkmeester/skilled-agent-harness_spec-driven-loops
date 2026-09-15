---
title: "Iteration 4: Cursor Parity — Live preToolUse Surface and the Smallest Adapter"
trigger_phrases: []
---
# Iteration 4: Cursor Parity — Live preToolUse Surface and the Smallest Adapter

## Focus
What pre-execution hook surface does the Cursor runtime actually expose in this repo, what does its existing post-tool-use file do, can a preflight adapter exist there, what is the smallest one that reuses the shared check library unchanged, and what is the cost of the next-best enforcement point if it cannot.

## Findings

1. **Cursor exposes a pre-execution surface and this repo already uses it.** `.cursor/hooks.json` declares a `preToolUse` array with a `matcher` field and three wired adapters: `spec-gate-enforce.mjs` (no matcher — every tool), `task-dispatch-guard.mjs` (`"matcher": "Task"`), and `git-preflight-advisory.mjs` (`"matcher": "Shell"`). The dispatch concern's statement that Cursor "carries only a post-tool-use file" is true of the dispatch *adapters*, but it is a wiring gap, not a platform limit: the runtime surface a dispatch preflight needs is already live and confirmed ("STATUS: confirmed live-firing under cursor-agent 2026.07.23-e383d2b"). [SOURCE: .cursor/hooks.json (preToolUse array)] [SOURCE: .opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs:3-10]

2. **What the existing post-tool-use file does**: `cursor/post-tool-use.mjs` (symlink into system-spec-kit) is a multiplexed proxy that never blocks — `Shell` payloads are normalized and spanwed into the Claude dispatch-audit adapter (`dispatch-audit-posttooluse.mjs`) for the audit trail, `Write` payloads into the post-edit-quality core. It emits `{permission:'allow'}` and fails open. So dispatch enforcement on Cursor today is detection *after* the run, and for a hung dispatch (the primary failure class) there is no post event at all. [SOURCE: .opencode/hooks/dispatch/cursor/post-tool-use.mjs:1-40,56-64]

3. **The smallest preflight adapter is a proven pattern, not a new design: a translation shim around the Claude adapter.** `task-dispatch-guard.mjs` spawns its Claude core, parses the Claude `hookSpecificOutput` envelope (`permissionDecision: 'deny'` + `permissionDecisionReason`, or `additionalContext`), and translates it into Cursor's permission envelope — `{permission:'deny', user_message, agent_message}` with exit 2 for a block, `{permission:'allow', agent_message}` for an advisory. A Cursor dispatch preflight can do exactly the same with the 106-line `claude/dispatch-preflight-lint.mjs` as the core: normalize Cursor's payload to `{tool_name:'Bash', tool_input:{command}, cwd: workspace_roots[0]}` (or set `CLAUDE_PROJECT_DIR`), spawn it, translate the reply. The shared check library and `DISPATCH_SHAPES` are reused unchanged; the only Cursor-specific code is the payload/output translation, roughly the size of the existing shim. [SOURCE: .opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs:104-124] [SOURCE: .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs:1-106]

4. **Cursor's block and advisory output shapes are both live-confirmed in-repo, and the native shape should be preferred.** Block: `{"permission":"deny","user_message":<reason>,"agent_message":<reason>}` + `process.exit(2)` (spec-gate-enforce, task-dispatch-guard). Advisory: `{"permission":"allow","agent_message":<text>}` (goal-inject, spec-gate-enforce). `hookSpecificOutput.additionalContext` is also used by repo adapters (`git-preflight-advisory.mjs:142-146`) and parsed by `runtime/hooks/cursor/shared.ts:192`, but the two dispatch-relevant shims chose explicit translation rather than emitting the Claude envelope raw — so emitting the Cursor-native `permission/agent_message` shape (as `task-dispatch-guard.mjs` does) is the lower-uncertainty choice. Open question: whether a plain `.mjs` preToolUse hook emitting raw `hookSpecificOutput` is honored on Cursor without the translation step. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs:32-49] [SOURCE: .opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs:109-124] [SOURCE: .opencode/hooks/goal/cursor/goal-inject.mjs:43,89]

5. **NEW DEFECT — the codex dispatch shape in the shared registry cannot match a real codex dispatch.** `DISPATCH_SHAPES` declares codex as `/\bcodex\s+exec\b[^\n;&|]*\s(-p|--print)\b/`, but `codex exec` has no `-p`/`--print` flag; the packet's documented shape is `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" ... - </dev/null`. Empirically verified against the live module: both the documented dispatch and a minimal `codex exec --sandbox workspace-write -` produce **NO-MATCH**, while every other runtime's documented shape matches. Consequences: the Claude/Codex/Devin preflights resolve no skill for codex dispatches, so codex's `hard_rules` — including its `error`-severity availability rule — never fire; and the post-tool audit writes no line for a codex dispatch. The stdin check uses a *different* shape list (`HEADLESS_DISPATCH_SHAPES`, `/\bcodex\s+exec\b/` — correct) so the same command is a dispatch for one concern and invisible to the other, contradicting the registry comment that the before-lint and after-audit "can never disagree". [SOURCE: .opencode/hooks/dispatch/lib/dispatch-audit.mjs:27-41] [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:78-89] [SOURCE: probe: node import of DISPATCH_SHAPES over 8 documented shapes, 2026-09-15]

6. **Cost comparison of enforcement points on Cursor.**

| Point | Exists today | Detection latency | Prevents | Covers hangs? |
|---|---|---|---|---|
| postToolUse audit (`post-tool-use.mjs`) | yes (dispatch half: audit only) | after the full dispatch completes | nothing | no — a hung run produces no post event |
| preToolUse `Shell` preflight | no (surface and template exist) | zero — before spawn | the whole dispatch | yes |

7. **The `git-preflight-advisory.mjs` adapter is the cheapest proof that the shared engine runs on Cursor.** It imports `evaluate` and `readHardRules` straight from `hooks/dispatch/lib/dispatch-rule-checks.mjs`, reads the same `hard_rules:` frontmatter the dispatch preflight reads, accepts Claude/Codex/Devin/Cursor payloads in one body (`tool === 'bash' | 'exec' | 'shell'`), and resolves the Cursor project root from `payload.workspace_roots[0]`. The dispatch preflight on Cursor needs no new library, only the wiring. [SOURCE: .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:28-33,95-101,140-147]

## Ruled Out
- Treating "Cursor carries only a post-tool-use file" as an absence of pre-execution capability: three preToolUse adapters are wired in `.cursor/hooks.json` today, one of them a Shell-matcher advisory built on the same hard-rule engine. The parity item is wiring, not platform. [SOURCE: .cursor/hooks.json]
- Proposing a Cursor-only reimplementation of dispatch-shape detection or severity mapping: the git advisory demonstrates that the shared engine runs unmodified; a second copy would be a second thing to drift. [SOURCE: .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:28-33]

## Dead Ends
- Reading the dispatch README as the authority on Cursor capability: it documents Cursor as "audit only (no preflight)" and does not mention `preToolUse` at all; the runtime wiring in `.cursor/hooks.json` contradicts it. [SOURCE: .opencode/hooks/dispatch/README.md §3 table]

## Edge Cases
- Contradictory evidence: the codex shape in `DISPATCH_SHAPES` versus the codex shape in `HEADLESS_DISPATCH_SHAPES` — both are "the" registry; the command matching one and not the other is the contradiction, resolved empirically in favor of the stdin list (the real codex invocation has no print flag). [SOURCE: both files cited in finding 5]
- Partial success: cursor payload normalization is confirmed for `Shell` in two adapters, but whether Cursor's preToolUse passes `workspace_roots` on every invocation (vs only some) is not proven here; the task-dispatch shim and spec-gate both read it, so the field is at least reliable in practice. [INFERENCE: based on two live adapters reading it]
- Missing dependencies: none — the adapter can spawn the existing Claude preflight with no new library.

## Sources Consulted
- .cursor/hooks.json
- .cursor/hooks/README.md
- .opencode/hooks/dispatch/cursor/post-tool-use.mjs
- .opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs
- .opencode/hooks/dispatch/lib/dispatch-audit.mjs
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
- .opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs
- .opencode/hooks/goal/cursor/goal-inject.mjs
- .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs
- .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
