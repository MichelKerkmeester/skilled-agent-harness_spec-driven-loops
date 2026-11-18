---
title: "Post-Edit Quality: Warn-Only Checker Router"
description: "Routes edited paths to a checker and returns warnings through eight runtime adapters."
trigger_phrases:
  - "post edit quality"
  - "comment hygiene hook"
  - "dist staleness hook"
  - "cursor post edit quality"
  - "cursor post tool use"
  - "cursor quality proxy"
  - "opencode post edit quality"
  - "opencode quality plugin"
  - "opencode system context findings"
importance_tier: "normal"
contextType: "reference"
---

# Post-Edit Quality: Warn-Only Checker Router

---

## 1. OVERVIEW

`post-edit-quality/` routes file edits to a quality checker and sends any finding back as a warning.

The shared core is `lib/post-edit-router.cjs`. Every runtime uses it through an adapter. The concern key is `post-edit-quality`, with the `SK_CODE_POST_EDIT_QUALITY_DISABLED` switch. `SYSTEM_HOOKS_DISABLED=1` is the master switch for concerns using the shared resolver.

---

## 2. HOW IT WORKS

`resolveDispatch()` reads the edited path and the environment. It returns zero or one checker entry. The checks cover comment hygiene, flowcharts, skill frontmatter versions, spec placeholders and wikilinks. The wikilinks check runs only when `SPECKIT_VALIDATE_LINKS=true`.

`runChecks()` starts the selected checker under a shared deadline. It returns bounded findings after redacting secret-shaped values. A missing checker returns one `quality-notice` finding. A spawn error or timeout returns no finding. An exit code outside 0 or 1 does the same.

`runDistStalenessCheck()` runs as a separate check for the edited file. It returns a warning banner or `null`. Claude, Codex, Devin, Pi, DSH and Vibe call it. Cursor sends `Write` to Claude's adapter. OpenCode has a separate freshness guard in `.opencode/plugins/system-dist-freshness-guard.js`.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse` (`Write|Edit`) | `claude/post-edit-quality.cjs` | `.skilled/hooks/post-edit-quality/claude/post-edit-quality.cjs` | Findings as `hookSpecificOutput.additionalContext` JSON on stdout. Errors are swallowed and exit 0. |
| Codex | `PostToolUse` (`apply_patch|edit`) | `codex/post-edit-quality.cjs` | `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` | Finding text on stdout. Errors are swallowed and exit 0. |
| Cursor | `postToolUse` (`Write`) | `cursor/post-tool-use.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | Allows the call and returns Claude's output as `agent_message`. A top-level error writes to stderr before approval. |
| Devin | `PostToolUse` (`^(edit|write)$`) | `devin/post-edit-quality.cjs` | `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | Findings as `hookSpecificOutput.additionalContext` JSON on stdout. Errors are swallowed and exit 0. |
| OpenCode | Tool execution and system transform | `opencode/sk-code-post-edit-quality.js` | `.opencode/plugins/sk-code-post-edit-quality.js` | Buffers findings for the next system transform and writes a log. Hook errors are swallowed. |
| Pi | `tool_result` (`edit|write`) | `pi/post-edit-quality.ts` | `.skilled/hooks/post-edit-quality/pi/post-edit-quality.ts` | Appends finding text to the tool result. Errors leave the result unchanged. |
| DSH | `tools/post-execute` | `dsh/post-edit-quality.mjs` | `.skilled/hooks/post-edit-quality/dsh/post-edit-quality.mjs` | Adds context to accepted results. It logs errors and returns the downstream result. |
| Vibe | `post_tool` (`write_file|edit`) | `vibe/post-edit-quality.mjs` | `.vibe/plugins/repo-guards/post-edit-quality.mjs` | Adds findings as `hook_specific_output.additional_context`. Errors go to stderr and exit 0. |

OpenCode stashes the edited path on `tool.execute.before` and checks it on `tool.execute.after`. It drains findings through `experimental.chat.system.transform`.

Claude registers its `PostToolUse` command for `Write|Edit` in `.claude/settings.json`. Codex registers `PostToolUse` for `apply_patch|edit` in `.codex/hooks.json`. Devin registers `PostToolUse` for `^(edit|write)$` in `.devin/hooks.v1.json`. These command entries use a 10-second timeout.

Cursor registers the proxy under `postToolUse` in `.cursor/hooks.json` with a 10-second timeout. OpenCode loads plugins through the flat `.opencode/plugins/*.js` glob. Pi loads `.pi/extensions/post-edit-quality.ts`, which imports the adapter. The DSH guard bundle registers it through `.dsh/plugins/repo-guards/index.mjs`. Vibe registers `post_tool` in `.vibe/hooks.toml`.

---

## 4. DIRECTORY TREE

```text
post-edit-quality/
+-- lib/post-edit-router.cjs
+-- claude/post-edit-quality.cjs
+-- codex/post-edit-quality.cjs
+-- cursor/post-tool-use.mjs (symlink to ../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs)
+-- devin/post-edit-quality.cjs
+-- dsh/post-edit-quality.mjs
+-- opencode/sk-code-post-edit-quality.js (symlink to ../../../../.opencode/plugins/sk-code-post-edit-quality.js)
+-- pi/post-edit-quality.ts
+-- tests/
|   +-- post-edit-router.test.cjs
|   +-- codex-post-edit-quality.test.cjs
|   +-- devin-post-edit-quality.test.cjs
|   `-- dsh-post-edit-quality.test.mjs
`-- vibe/post-edit-quality.mjs (symlink to ../../../../.vibe/plugins/repo-guards/post-edit-quality.mjs)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/post-edit-router.cjs` | Selects a checker and shapes its findings. |
| `../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Checks code comments for ephemeral-artifact pointers. |
| `../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Checks the compiled output for the edited file's package. |
| `../../skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh` | Checks Markdown flowcharts. |
| `../../skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` | Checks version metadata in skill docs. |
| `../../skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh` | Scans a spec folder for placeholder markers. |
| `../../skills/system-spec-kit/runtime/cli/rules/check-links.sh` | Checks wikilinks in a skill tree. |
| `../shared/hook-flags.cjs` | Resolves the concern and master switches, including supported aliases. |
| `.opencode/plugins/system-dist-freshness-guard.js` | Checks package freshness for OpenCode sessions and risky Bash commands. |

---

## 6. CONFIGURATION

The concern is on by default. The disable switches accept `1`, `true`, `yes` or `on`, in any case.

| Switch | Concern key | Effect |
|---|---|---|
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | `post-edit-quality` | Turns off this concern across the runtime adapters. |
| `SYSTEM_HOOKS_DISABLED=1` | All hooks using the shared resolver | Turns off every concern wired to the shared resolver. |
| `SPECKIT_VALIDATE_LINKS=true` | `post-edit-quality` | Enables the wikilinks check for eligible skill Markdown. |

`MK_POST_EDIT_QUALITY_DISABLED` is an accepted alias. The resolver reads the optional gitignored `.skilled/hooks/hook-flags.env` file. Copy `.skilled/hooks/hook-flags.env.example` to persist a setting. The environment wins over the file.

---

## 7. VALIDATION

Run these commands from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/*.test.cjs
```

Expected output includes `pass 13` and `fail 0`. The command exits 0.

```bash
node --test .skilled/hooks/post-edit-quality/tests/dsh-post-edit-quality.test.mjs
```

Expected output includes `pass 2` and `fail 0`. The command exits 0.

```bash
node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs
```

Expected output includes `pass 51` and `fail 0`. The command exits 0.

```bash
SK_CODE_POST_EDIT_QUALITY_DISABLED=1 node .skilled/hooks/post-edit-quality/claude/post-edit-quality.cjs < /dev/null
```

Expected result: no stdout or stderr and exit status 0.

---

## 8. RELATED

- [Hooks overview](../README.md): the runtime coverage matrix and switch index.
- [Shared hook helpers](../shared/README.md): the switch resolver and adapter helpers.
