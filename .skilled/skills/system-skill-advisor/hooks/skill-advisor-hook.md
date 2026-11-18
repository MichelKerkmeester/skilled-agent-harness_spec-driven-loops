---
title: "Skill Advisor: Prompt Routing Context"
description: "Adds skill-routing context to prompts for the runtimes that register the advisor."
trigger_phrases:
  - "skill advisor hook reference"
  - "native-first advisor hooks"
  - "advisor hook runtime matrix"
  - "opencode plugin bridge"
  - "advisor hook smoke tests"
  - "skill advisor claude hook"
  - "claude user prompt submit"
  - "advisor shim resolution"
  - "skill advisor codex hook"
  - "codex user prompt submit"
  - "codex advisor adapter"
  - "skill advisor cursor hook"
  - "cursor before submit prompt"
  - "cursor advisor adapter"
  - "skill advisor devin hook"
  - "devin user prompt submit"
  - "devin advisor adapter"
  - "skill advisor dsh hook"
  - "dsh prompt advisor"
  - "dsh advisor adapter"
  - "skill advisor opencode plugin"
  - "opencode system transform advisor"
  - "opencode advisor status tool"
  - "skill advisor pi hook"
  - "pi prompt advisor"
  - "pi advisor extension"
  - "skill advisor vibe hook"
  - "vibe prompt advisor"
  - "vibe advisor adapter"
importance_tier: normal
contextType: reference
version: 3.6.23.0
---

# Skill Advisor: Prompt Routing Context

---

## 1. OVERVIEW

`.skilled/hooks/skill-advisor/` adds routing context to a prompt when the advisor has a recommendation. The brief names a skill or command for the work.

The shared handler is the [Claude prompt handler](claude/user-prompt-submit.ts). It builds and renders the brief for the native prompt adapters. OpenCode uses its own prompt transform.

The concern key is `skill-advisor`. Its switch is `SYSTEM_SKILL_ADVISOR_DISABLED`. `SYSTEM_HOOKS_DISABLED` disables all repository hooks.

---

## 2. HOW IT WORKS

The exported `handleClaudeUserPromptSubmit` accepts a prompt payload. It checks `skippedAdvisorResultFor` before calling `buildSkillAdvisorBriefFromCli`. `renderAdvisorBrief` formats a recommendation. `renderAdvisorFallbackDirective` supplies context when no brief is available.

`decideDirectiveLifecycleDelivery` reduces repeated context for a known session. It keeps the brief head and drops the repeated `Directives:` block. The handler returns `hookSpecificOutput.additionalContext`. It returns `{}` when its switch is off. It also returns `{}` when input is invalid. When its own code throws, it returns the outage fallback, or the skipped fallback for a skipped prompt, and returns `{}` only if that fallback cannot be rendered.

Pi calls the shared handler from its input extension. DSH calls it from the repo-guards adapter. Vibe's turn-start composer calls `buildAdvisorPart`. The OpenCode plugin handles its own `experimental.chat.system.transform` event.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| **Claude** | `UserPromptSubmit` | `.skilled/hooks/skill-advisor/claude/user-prompt-submit.js`, the compiled adapter the runtime runs | [Claude source shim, compiled to `dist/`](../../system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts) | `Advisor:` text in `hookSpecificOutput.additionalContext`, or `{}` when disabled or on error. |
| **Codex** | `UserPromptSubmit` | `.skilled/hooks/skill-advisor/codex/user-prompt-submit.js`, the compiled adapter the runtime runs | [Codex source shim, compiled to `dist/`](../../system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts) | Advisor context in the hook response. No response is emitted when the child has no output. |
| **Cursor** | `beforeSubmitPrompt` | `.skilled/hooks/skill-advisor/cursor/user-prompt-submit.js`, the compiled adapter the runtime runs | [Cursor source shim, compiled to `dist/`](../../system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts) | Advisor context in Cursor's response when the hook fires. Missing context returns `permission: allow`. Delivery is unconfirmed, because `beforeSubmitPrompt` did not fire under the tested Cursor CLI build. |
| **Devin** | `UserPromptSubmit` | `.skilled/hooks/skill-advisor/devin/user-prompt-submit.js`, the compiled adapter the runtime runs | [Devin source shim, compiled to `dist/`](../../system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts) | Advisor context in `hookSpecificOutput.additionalContext`. Invalid child output adds no context. |
| **OpenCode** | `experimental.chat.system.transform` | [OpenCode plugin entry](../../../hooks/skill-advisor/opencode/system-skill-advisor.js) | [OpenCode plugin file](../../../../.opencode/plugins/system-skill-advisor.js) | Appends the advisor brief to `output.system`. A caught error adds a fallback directive when enabled. |
| **Pi** | `input` | [Pi extension entry](../../../hooks/skill-advisor/pi/prompt-advisor.ts) | [Pi extension file](pi/prompt-advisor.ts) | Transforms the input to add advisor context. Without context the input stays unchanged, unless `SPECKIT_PI_ADVISOR_DEBUG` is on and adds its debug block. |
| **DSH** | `agent/pre-step` | [DSH adapter entry](../../../hooks/skill-advisor/dsh/prompt-advisor.mjs) | [DSH adapter file](dsh/prompt-advisor.mjs) | Adds an advisor message to the step. An adapter error keeps the downstream result. |
| **Vibe** | `pre_agent` | [Vibe adapter entry](../../../hooks/skill-advisor/vibe/prompt-advisor.mjs) | [Vibe adapter file](vibe/prompt-advisor.mjs) | Adds advisor text to `additional_context`. A failed part adds no text. |

Claude registers the compiled adapter in [Claude settings](../../../../.claude/settings.json). The event is `UserPromptSubmit` with an empty matcher. The timeout is 3 seconds. It runs `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`.

Codex registers the compiled adapter in [Codex hooks](../../../../.codex/hooks.json). It uses `UserPromptSubmit` with a 3-second timeout. It runs `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js`.

Cursor registers the adapter in [Cursor hooks](../../../../.cursor/hooks.json). It uses `beforeSubmitPrompt` with a 10-second timeout. It runs `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js`.

Devin registers the compiled adapter in [Devin hooks](../../../../.devin/hooks.v1.json). The event is `UserPromptSubmit` with an empty matcher. The timeout is 10 seconds. It runs `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js`.

The `.opencode/plugins/` glob loads the plugin's default export from `.opencode/plugins/system-skill-advisor.js`. Pi loads [the Pi extension entry](../../../../.pi/extensions/prompt-advisor.ts), which re-exports the advisor adapter.

The DSH bundle registers its adapter from `.dsh/plugins/repo-guards/index.mjs`. It skips registration only when the `promptAdvisor` option is `false`. Vibe registers `turn-start` in [.vibe/hooks.toml](../../../../.vibe/hooks.toml). The turn-start composer calls `buildAdvisorPart`.

---

## 4. DIRECTORY TREE

```text
.skilled/hooks/skill-advisor/
+-- README.md
+-- claude/
+-- codex/
+-- cursor/
+-- devin/
+-- dsh/
+-- opencode/
+-- pi/
`-- vibe/
```

`README.md` is a symlink to `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`. The runtime folders index their adapter files with symlinks.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `claude/user-prompt-submit.ts` | Shared prompt handler. |
| `lib/skill-advisor-cli-fallback.ts` | Calls the advisor CLI for the shared handler. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the concern switch and the master switch. |
| `.opencode/plugins/system-skill-advisor.js` | Adds advisor context through OpenCode's system transform. |
| `.pi/extensions/prompt-advisor.ts` | Re-exports the Pi advisor extension. |
| `.dsh/plugins/repo-guards/index.mjs` | Registers the DSH adapter. |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Calls the Vibe advisor part. |

---

## 6. CONFIGURATION

The advisor is enabled by default. Set one of these switches to disable it.

| Switch | Effect |
|---|---|
| `SYSTEM_SKILL_ADVISOR_DISABLED=1` | Disables the skill advisor across runtimes. |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disables the shared handler through a supported alias. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables all repository hooks. |

The resolver treats `1`, `true`, `yes` and `on` as active values, in any letter case. Set a switch in the environment or in `.skilled/hooks/hook-flags.env`. The environment takes precedence.

---

## 7. VALIDATION

Run these focused hook checks from the repository root.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime test -- tests/hooks/advisor-runtime-list-parity.vitest.ts
```

Expected result: Vitest exits 0 and reports no runtime-list gaps.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime test -- tests/hooks/claude-user-prompt-submit-hook.vitest.ts -t 'AS4 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer'
```

Expected result: the switch smoke test passes. The hook returns `{}` and does not call the producer.

---

## 8. RELATED

- [Validation playbook](skill-advisor-hook-validation.md): broader checks for the advisor hook.
- [Hooks tree index](../../../hooks/README.md): the hook folder map and switch index.

