---
title: "Pi CLI - Complete Command Reference"
description: "Confirmed Pi CLI flags, headless modes, provider failure handling, environment variables, and safe dispatch patterns."
trigger_phrases:
  - "pi cli flags"
  - "pi help"
  - "pi print mode"
  - "pi json mode"
  - "pi rpc mode"
  - "pi api key"
importance_tier: important
contextType: implementation
version: 1.2.0.0
---

# Pi CLI - Complete Command Reference

This reference records the Pi contract observed in the local live pin. It is the baseline for cli-pi dispatch composition.

Source of confirmed behavior: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md). The exact option names below were also checked against the installed pi --help output.

## 1. OVERVIEW

Pi is a terminal coding assistant with read, bash, edit, write, grep, find, and ls tools. The pinned install reported version 0.82.1 and a default provider of google. The default config directory was observed as ~/.pi/agent, with PI_CODING_AGENT_DIR as the override. See the local contract pin for evidence.

This packet separates three headless contracts:

| Contract | Invocation | Output |
|---|---|---|
| Print | pi -p or pi --print | Final assistant message only |
| JSON | pi --mode json | JSONL event stream |
| RPC | pi --mode rpc | Persistent JSONL protocol over stdin/stdout |

The JSON and RPC distinctions are confirmed by the local pin and the [JSON documentation](https://pi.dev/docs/latest/json) and [RPC documentation](https://pi.dev/docs/latest/rpc).

## 2. INSTALLATION AND VERSION

The pinned contract installed Pi with:

~~~bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi --version
~~~

The observed version was 0.82.1. The current Pi documentation describes the same npm package and install family at [pi.dev](https://pi.dev/docs/latest).

Before every orchestrated dispatch:

~~~bash
command -v pi
~~~

No path means no dispatch. The availability probe is a hard rule, not an installation suggestion.

## 3. COMMANDS

| Command | Purpose | Dispatch note |
|---|---|---|
| pi | Start interactive mode | Not the default orchestrated path |
| pi -p message | Process a prompt and exit | Use for one-shot dispatch |
| pi install source | Install an extension source and update settings | Review trust implications |
| pi remove source | Remove an extension source | Confirm project scope |
| pi uninstall source | Alias for remove | Treat as a mutation |
| pi update | Update Pi, extensions, or model catalogs | Operator approval required |
| pi list | List installed extensions from settings | Project trust can affect reads |
| pi config | Open the TUI package configuration | Not a headless automation path |
| pi --list-models | List available models | No-auth run returned no models |
| pi --export file | Export a session to HTML and exit | Use only with a known session path |
| pi --help | Print the CLI help | Use to detect version drift |
| pi --version | Print the installed version | Capture before contract changes |

## 4. HEADLESS OPTIONS

| Option | Meaning |
|---|---|
| --print, -p | Non-interactive mode that processes the prompt and exits |
| --mode text | Text output, the default mode |
| --mode json | JSON event stream |
| --mode rpc | RPC mode over stdin/stdout |
| --provider name | Select a provider |
| --model pattern | Select a model pattern or provider/model ID |
| --api-key key | Pass an API key directly |
| --system-prompt text | Replace the default system prompt |
| --append-system-prompt text | Append text or file contents |
| --session path or id | Select a session |
| --continue, -c | Continue the previous session |
| --resume, -r | Select a session to resume |
| --session-dir dir | Select session storage |
| --session-id id | Select or create an exact project session ID |
| --fork path or id | Fork a session |
| --no-session | Disable session persistence |
| --name, -n name | Set a session display name |

These names came from the installed help capture. Check pi --help again if the installed version changes.

## 5. TOOL BOUNDARIES

| Option | Meaning |
|---|---|
| --no-tools, -nt | Disable all tools |
| --no-builtin-tools, -nbt | Disable built-in tools but keep extensions |
| --tools, -t tools | Comma-separated allowlist |
| --exclude-tools, -xt tools | Comma-separated denylist |
| --thinking level | Set off, minimal, low, medium, high, xhigh, or max |

For a read-only review, the live help gives this pattern:

~~~bash
pi --tools read,grep,find,ls -p "Review the code"
~~~

This is a caller-selected tool restriction. It is not evidence that Pi has a built-in plan mode.

## 6. RESOURCE OPTIONS

| Option | Meaning |
|---|---|
| --extension, -e path | Load an extension file, repeatable |
| --no-extensions, -ne | Disable extension discovery |
| --skill path | Load a skill file or directory, repeatable |
| --no-skills, -ns | Disable skill discovery |
| --prompt-template path | Load a prompt template file or directory |
| --no-prompt-templates, -np | Disable prompt-template discovery |
| --theme path | Load a theme file or directory |
| --no-themes | Disable theme discovery |
| --no-context-files, -nc | Disable AGENTS.md and CLAUDE.md discovery |

Per Pi docs, unconfirmed for this packet: the exact flattening and precedence behavior of all resource locations. Read [native-skills-and-extensions.md](./native-skills-and-extensions.md) before relying on it.

## 7. TRUST AND NETWORK OPTIONS

| Option | Meaning |
|---|---|
| --approve, -a | Trust project-local files for this run |
| --no-approve, -na | Ignore project-local files for this run |
| --offline | Disable startup network operations |
| --verbose | Force verbose startup |
| --help, -h | Show help |
| --version, -v | Show version |

The local pin confirmed that an unapproved project-local package install fails and that adding --approve permits the install. It also observed that --verbose without --offline can hang when no network path is available.

## 8. PROVIDER AUTHENTICATION

The help output lists provider variables including ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, GROQ_API_KEY, XAI_API_KEY, MISTRAL_API_KEY, MINIMAX_API_KEY, KIMI_API_KEY, QWEN_TOKEN_PLAN_API_KEY, and AWS credentials. The full installed list is the source of truth for that version.

The pin observed this unauthenticated output:

~~~text
No API key found for the selected model. Use /login to log into a provider via OAuth or API key.
~~~

Do not put keys in prompts. Configure the provider outside the dispatch payload.

## 9. FAILURE HANDLING

The first unauthenticated print attempt returned exit 0. Later equivalent attempts returned exit 1. That inconsistency is confirmed by the pin. Therefore:

1. Capture stdout and stderr.
2. Search output for auth, trust, extension, and usage failures.
3. Treat output text as authoritative for failure classification.
4. Use the exit code only as an additional signal.
5. Do not claim a model ran because the process exited 0.

## 10. JSON MODE

The pin confirmed JSON mode as a JSONL event stream. The first record is a session header, followed by agent, turn, message, and tool execution events. Consumers should read one line at a time and preserve event order.

Print mode surfaces only the final assistant message. Any leaf that needs structured output, intermediate messages, or tool events must use `--mode json`, never `-p`/`--print`.

For `cli-pi`, captured stdout is hard-capped at 20 MB and truncated or killed beyond that limit by the fanout runner (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2390`). A structured-output leaf must keep its output bounded; do not dump large tool output into the captured stream. Consume JSONL incrementally, extracting records line by line.

~~~bash
pi --mode json "Summarize the work"
~~~

Use the [JSON documentation](https://pi.dev/docs/latest/json) for event names when writing a new parser. The local packet does not treat the current event schema as permanent across Pi versions.

## 11. RPC MODE

The pin confirmed RPC mode as a persistent stdin/stdout JSONL protocol. It is architecturally different from one-shot print mode. The RPC documentation is the source for request and response framing: [pi.dev/docs/latest/rpc](https://pi.dev/docs/latest/rpc).

~~~bash
pi --mode rpc --no-session
~~~

The shared runtime must keep the process alive, write newline-delimited JSON requests, and read newline-delimited JSON responses. Do not route RPC through a print-mode adapter. See [pi-tools.md](./pi-tools.md) §2 for how RPC compares to every sibling CLI's own session-continuity model.

## 12. SAFE INVOCATION CHECKLIST

- [ ] command -v pi succeeds.
- [ ] Self-invocation guard returns no signal.
- [ ] Provider and model are explicit when required.
- [ ] Print, JSON, or RPC is selected deliberately.
- [ ] Tool allowlist is least permissive.
- [ ] Project-local trust is explicit.
- [ ] Output is captured with stderr.
- [ ] Auth and extension errors are checked in text.
- [ ] Changes are verified by the calling workflow.

## 13. MODEL SELECTION

Pi is a multi-provider passthrough with no enforced allowlist at this layer and no fixed default model. Pi's own `--provider` default is `google`, which is not authenticated here, so every real dispatch names its provider and model explicitly. Select models with `--provider <name>` plus `--model <pattern>`, or a single `--model provider/id` form; `--model` also accepts an inline thinking suffix (`--model sonnet:high`).

Reasoning effort is a first-class flag independent of the model id: `--thinking off|minimal|low|medium|high|xhigh|max` (installed help, confirmed live). Unlike `cli-cursor`/`cli-devin`, no effort tier is baked into any model id. Codex's config-level `-c model_reasoning_effort=...` and `-c service_tier=...` forms are Codex-specific syntax and must NOT be copied into a Pi invocation; Pi has no confirmed service-tier control surface.

**Full authenticated provider/model roster, the `--thinking` scale, and the GPT-5.6 ceiling cross-map → [providers-and-models.md](./providers-and-models.md).**
