# Iteration 5: Wiring, escape hatch and rule-text amendments

## Focus

Turn the runtime matrix and the detector into an implementation design: where the hook lives,
how it is registered and rendered, how it avoids a re-prompt loop, how an operator turns it
off, and what exact words change in `communication-handoff.md` §4/§5 and `AGENTS.md` Gate 3
without breaking the `REPO RULES.md` ask-surface carve-out.

## Actions Taken

- Read the hook registry's runtime map and the synchronizer's render and verify paths.
- Read the fallback-envelope grammar and the async rendering rule.
- Read the hook library's layout convention for Claude, Pi and DSH adapters.
- Read the kill-switch resolver's master and per-concern flags.
- Re-read the ask-surface carve-out in `REPO RULES.md` and the exact §4/§5 sentences it
  governs.

## Findings

1. **`hook-registry.json` is the canonical set for four runtimes plus Pi, not for every runtime.** The synchronizer renders `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`, and verifies Pi extensions as symlinks. DSH registers through `.dsh/plugins/repo-guards/index.mjs` and OpenCode through `.opencode/plugins/`, so a complete ask-surface guard needs three registration surfaces, not one. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:30] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:1] [SOURCE: .dsh/plugins/repo-guards/README.md:9]
2. **A new hook is one registry entry with per-runtime bindings, and the generated files must never be hand-edited.** Each binding carries `event`, `group`, `slot`, `matcher`, `runner`, `script`, `timeout` and `fallback`; the synchronizer owns the rendered files and `--check` reports drift. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:158]
3. **Blocking is the absence of `async`, and async is defined as running in the background without blocking.** The renderer emits `hook.async = true` only when the binding sets it, so the Claude binding for an enforcing guard must omit `async` and carry a short timeout. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:160] [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]
4. **The `fallback` field is where per-runtime drift behaviour is encoded.** `envelope` prints a hook-shaped message so a broken adapter cannot break the host, and the grammar differs by runtime: Codex rejects unknown `hookSpecificOutput` keys on Stop and takes a plain `systemMessage`, while Cursor's envelope is `{permission: "allow", agent_message, mkHookDrift}`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:63] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:107]
5. **The adapter layout is `.skilled/hooks/<concern>/<runtime>/`, with Pi and DSH as real files behind symlinks.** Pi's `.ts` file is the real implementation and `.pi/extensions/` symlinks to it; DSH's `.mjs` file is real and `.dsh/plugins/repo-guards/adapters/` symlinks to it. A new `ask-surface-guard` concern follows the same shape. [SOURCE: .skilled/hooks/README.md:135]
6. **The loop guard is `stop_hook_active` plus a per-turn marker.** Claude sets `stop_hook_active` on a continuation caused by a Stop block and caps consecutive continuations at 8, so the adapter must approve immediately when it is true; a small per-session, per-turn marker file makes the guard block at most once per turn even if the model repeats the menu. [SOURCE: https://docs.claude.com/en/docs/claude-code/hooks]
7. **The escape hatch already exists as the concern kill switch.** `isHookEnabled('ask-surface')` resolves `SYSTEM_ASK_SURFACE_DISABLED`, the master `SYSTEM_HOOKS_DISABLED` disables every hook, the environment wins over `hook-flags.env`, and a hook is enabled by default. No new switch mechanism is needed. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:27]
8. **Naming a tool in `AGENTS.md` Gate 3 would breach the ask-surface carve-out.** The carve-out says `communication-handoff.md` "is the one rule on this side of that line, its §5 is the only place a tool name appears". Gate 3 lives in `AGENTS.md`, not in a rule file, so the safe amendment has Gate 3 *reference* §5's surface and keep the A/B/C/D text only as option labels. [SOURCE: REPO RULES.md:103]
9. **§5 is stale in two places and permissive in a third.** Its OpenCode row says "a built-in equivalent — Operator-reported, name not recorded here" when the name is `question`, and its fallback sentence makes a prose numbered list the sanctioned answer for "anything else", which is the exact behavior this research is meant to end. [SOURCE: .skilled/repo-rules/communication-handoff.md:148] [SOURCE: .skilled/repo-rules/communication-handoff.md:156]
10. **The amendment set that satisfies all four constraints.** §4: keep the three-condition test and add "ask it through the surface §5 names for this runtime". §5: update the OpenCode row to `question`, add Devin `ask_user_question`, add DSH `ask_user_question` with the headless exception, mark Cursor as no evidenced surface, and replace the fallback sentence with "only when the runtime has no surface, or the surface is unavailable in this session". Gate 3: "Ask through the surface `communication-handoff.md` §5 names for this runtime; the A/B/C/D lines below are the option labels you pass to it, printed as prose only under §5's fallback." [INFERENCE: composed from findings 1-9 and the carve-out text]

## Ruled Out

- **A blocking guard on every runtime.** Only Claude Code and DSH expose a turn-end seam; the
  other runtimes get an observe-only adapter plus the rule text, and the guard must not
  pretend otherwise.
- **Naming the tool in `AGENTS.md`.** It would breach the carve-out and duplicate a table that
  §5 already owns.
- **Removing the prose fallback entirely.** Claude subagents, DSH headless runs and
  `codex exec` have no ask tool, so a rule with no fallback would be unsatisfiable there.

## Dead Ends

- None. The wiring surface is fully mapped.

## Edge Cases

- Ambiguous input: whether the guard should fire on a *sanctioned* prose fallback. Decided no:
  the guard is capability-aware and only runs where a surface exists.
- Contradictory evidence: `AGENTS.md` Gate 3 teaches the prose menu while the carve-out forbids
  naming a tool outside §5. Resolved by reference rather than duplication, and recorded here
  because it is the one place the amendment could overreach.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json
- .skilled/hooks/README.md
- .skilled/hooks/shared/hook-flags.cjs
- .skilled/repo-rules/communication-handoff.md
- REPO RULES.md
- .dsh/plugins/repo-guards/README.md
- https://docs.claude.com/en/docs/claude-code/hooks

## Assessment

- New information ratio: 0.85
- Questions addressed: Q2, Q4, Q5
- Questions answered: Q4 and Q5 in full; Q2 completed by classifying the remaining runtimes as
  observe-only.

## Reflection

- What worked and why: the carve-out sentence is the binding constraint, and reading it beside
  Gate 3 produced the only amendment shape that does not overreach.
- What did not work and why: nothing failed. The registry's runtime coverage was the one
  surprise, and it changes the plan from one registry entry to three surfaces.
- What I would do differently: read the carve-out before drafting rule text, not after; it
  decides where a tool name may appear.

## Recommended Next Focus

Synthesis. Rank the implementation phases by evidence strength: Claude Code and DSH blocking
guards first, the shared detector second, the observe-only adapters third, the rule-text
amendment fourth, and the registry coverage gap last.
