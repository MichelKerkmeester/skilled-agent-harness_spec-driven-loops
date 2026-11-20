---
title: cli-pi
description: "Cross-AI dispatcher for Pi's terminal coding agent with guarded print, JSON event, RPC and community-extension workflows."
trigger_phrases:
  - "pi cli"
  - "pi agent"
  - "pi.dev cli"
  - "delegate to pi"
  - "pi coding agent"
version: 1.5.8.0
---

# cli-pi

> Hand one bounded task to a headless coding agent, then judge the result from the text it returned and the files it touched, not from the exit code.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | One guarded headless dispatch: a print answer, a JSON event stream, an RPC session or a read-only review |
| **Invoke with** | "pi cli", "pi agent", "pi.dev cli", "delegate to pi" or "pi coding agent" |
| **Works on** | A machine with the `pi` binary on PATH and an authenticated provider from the packet roster |
| **Produces** | The answer text, a JSONL event stream, RPC responses and any workspace change the run made |

### What It Does

cli-pi is the routing point for a Pi dispatch. The hub sends a request here when it names Pi or pi.dev. It also answers a request that needs Pi's JSON event stream, an RPC client, a code review or an independent second opinion. The packet fixes the command shape, names the roster a model must come from and states how to read the result. The [runtime instructions](./SKILL.md) hold the contract. The [machine router](./ROUTER.md) maps a request to the file that answers it.

The packet owns prompt construction and the availability probe. The provider choice sits here too. The shared deep-loop runtime owns process construction and execution. This skill builds no second adapter: a research or review lineage runs through the runtime's `cli-pi` executor kind. A single build or doc dispatch uses the child envelope in the [provider roster](./references/providers-and-models.md).

### Why This Skill Exists

A Pi run can look clean and still be wrong. The contract pin saw the same unauthenticated print dispatch return exit 0 on its first run, then exit 1 on later runs. Print mode also buffers until completion, so a run stuck on an inherited stdin prints nothing and reads exactly like a slow model. The packet turns both traps into checks you run before the command leaves your session.

### Headless Surfaces

Pi answers in more than one shape. Pick the shape your consumer can parse, because print mode returns only the final message while RPC keeps one process alive.

| Surface | Invocation | What comes back |
|---|---|---|
| **Print** | `pi -p` or `pi --print` | the final assistant message only |
| **JSON** | `pi --mode json` | one JSON object per line, opening with a session header |
| **RPC** | `pi --mode rpc` | a persistent stdin/stdout JSONL protocol over one live process |
| **Read-only review** | print mode plus `--tools read,grep,find,ls` | findings from a run limited to four read-only tools, a caller choice rather than a Pi mode |

---

## 2. QUICK START

**Step 1: Find the binary.**

```bash
command -v pi
```

Expect one resolved path, such as `/Users/you/.local/bin/pi`. No output means the binary is absent, so stop before you build a command. The packet runs this probe before every dispatch.

**Step 2: Record the installed release.**

```bash
pi --version
```

Expect one version string. This machine printed `1.5.2`. Record what yours prints, because the flag set moves with the release and the [CLI reference](./references/cli-reference.md) is written against a captured help.

**Step 3: Dispatch a read-only review in print mode.**

```bash
PI_BLACKHOLE_PASSIVE=true \
  pi -p "Review src/auth/session.ts for injection risks. Do not edit files. Return findings with file and line evidence." \
  --model opencode-go/deepseek-v4.1-flash \
  --thinking max --mode text --offline --tools read,grep,find,ls \
  </dev/null > stdout.log 2> stderr.log
```

Expect `stdout.log` to hold the findings as the final assistant message. Read `stderr.log` for startup or extension errors before you trust the run. If `stdout.log` says `No API key found for the selected model`, the run never reached a model, whatever the exit code reported. Swap the model for another id on the roster when the task needs one.

**Step 4: Switch the output contract only when the consumer is ready.**

```bash
pi --mode json "Summarize the changed files" \
  --model opencode-go/deepseek-v4.1-flash \
  --thinking max --offline </dev/null
```

Expect one JSON object per line on stdout. The first record is a session header, then agent, turn, message and tool events arrive in order. Parse one line at a time. For a long-lived integration, run `pi --mode rpc --no-session` with a client that owns the process lifecycle, as the [integration patterns](./references/integration-patterns.md) describe.

---

## 3. HOW IT WORKS

A dispatch runs in one direction. The caller probes the binary, picks the output contract, composes a scoped prompt and names a model from the roster. The shared runtime launches the command. The caller reads the output text, checks the diff, runs the tests and records the result.

```text
  ┌──────────────────────┐
  │ A request that       │
  │ names Pi             │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐           no path           ┌──────────────────────┐
  │ command -v pi        ├────────────────────────────▶│ Stop and name the    │
  └──────────┬───────────┘                             │ missing binary       │
             │ path                                    └──────────────────────┘
             ▼
  ┌──────────────────────┐
  │ Pick print, JSON,    │
  │ RPC or a             │
  │ read-only review     │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ Name a roster model  │
  │ and an effort tier   │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐
  │ The shared runtime   │
  │ launches the         │
  │ guarded command      │
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐  provider error in the text ┌──────────────────────┐
  │ Read stdout and      ├────────────────────────────▶│ Report the failure,  │
  │ stderr               │                             │ with the exit code   │
  └──────────┬───────────┘                             │ as a weak signal     │
             │ answer                                  └──────────────────────┘
             ▼
  ┌──────────────────────┐
  │ Check the diff and   │
  │ run the tests        │
  └──────────────────────┘
```

### The Guarded Dispatch Line

Four preflight checks sit in [`hard-rules.json`](./hard-rules.json), each at severity `error`. The dispatch preflight reads them as fail-closed rules. A hand-written dispatch needs the same lines.

| Rule id | What it prevents |
|---|---|
| `stdin-redirect-required` | `pi -p` inheriting the parent terminal's stdin and hanging with no output at all |
| `pi-availability-required` | building a command on a machine where `command -v pi` fails |
| `pi-offline-required` | startup network probes that outlast the dispatch timeout |
| `pi-provider-qualified-model` | a bare model id resolving against Pi's default provider, so a different model answers |

### The Exit Code Is Not A Verdict

The pin saw exit 0 on its first unauthenticated print run and exit 1 on later identical runs. Every guard in the packet therefore reads the output text, where a missing credential says `No API key found for the selected model`. A zero exit is also what a failed provider call returned, so the number alone settles nothing.

An invalid extension fails the whole session rather than that one extension. Pi requires every `.pi/extensions/*.ts` entry to export a factory function. A broken entry blocks the dispatch with `Extension does not export a valid factory function`. Repair or remove the entry before the next run.

### The Runtime Owns The Process

The shared deep-loop runtime is the process adapter. Its `cli-pi` executor kind accepts only the `research` and `review` loop types, so a lineage that needs a second opinion dispatches through it with a provider-qualified model and an effort tier. A single build or doc dispatch uses the child envelope in the [provider roster](./references/providers-and-models.md) instead. The packet never adds a local wrapper, because a second adapter carries a second set of failure semantics.

### The Closed Roster

The roster is closed and per provider. Only the ids in [the provider reference](./references/providers-and-models.md) may be dispatched. A provider's live catalog is not a licence to try a neighbouring id. A fan-out lineage rejects any id outside its enforced allowlist before launch. That allowlist also keeps two OpenRouter ids the direct roster leaves out. The `pi` binary itself is a pass-through with no allowlist, so a direct dispatch follows the roster as a discipline rule.

### What Loads In The Child

A dispatched child inherits the operator's Pi packages. One of them, pi-blackhole, can replace what the child has read with a structural summary mid-run at its `compactAfterTokens` threshold, which is 272,000 here. A child still reading when that fires can start again and loop without editing. Set `PI_BLACKHOLE_PASSIVE=true` in the child's environment to switch off the package's background workers and auto-compaction. The fan-out's cli-pi environment filter passes that variable and the `LLMGATEWAY_` variables through, and strips every variable outside its allowlist. Pi's own compaction is off in `.pi/settings.json`, so the child keeps its full context window.

### What Is In The Packet

| File | What it holds |
|---|---|
| [`SKILL.md`](./SKILL.md) | The activation triggers, the dispatch rules and the success criteria |
| [`ROUTER.md`](./ROUTER.md) | The intent map, the resource map and the loading levels |
| [`hard-rules.json`](./hard-rules.json) | The four preflight rules at severity `error` |
| [`references/cli-reference.md`](./references/cli-reference.md) | The flags, the headless modes, auth failure handling and a safe invocation checklist |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | The closed roster, the `--thinking` ladder and the child dispatch envelope |
| [`references/pi-tools.md`](./references/pi-tools.md) | The surfaces with no sibling analog, plus the capability comparison |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | The conductor lifecycle, the validation pipeline and the anti-patterns |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | The built-in tool boundary and the child handback shape |
| [`references/native-skills-and-extensions.md`](./references/native-skills-and-extensions.md) | Native discovery with its confidence labels |
| [`references/mcp-and-third-party-packages.md`](./references/mcp-and-third-party-packages.md) | The MCP and community package boundaries |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | The prompt-quality delegator and its two-tier rule |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-ready templates for each dispatch shape |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The operator scenarios, indexed by category |
| [`benchmark/README.md`](./benchmark/README.md) | The index of archived validation reports |
| [`changelog/`](./changelog/) | One release note per version |

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Use cli-pi when the request names Pi or asks for its JSON event stream. Use it for a read-only review whose tool allowlist the model cannot widen. Use it too for an RPC client that must keep one process alive across requests. An independent second opinion fits when the caller wants an answer from a different provider than its own.

### When Not To Use It

Skip the packet when `command -v pi` fails. Skip it too for a small edit the caller already understands. Skip it for a request that names another CLI. A task that needs the project's whole runtime belongs to cli-opencode. A task that needs spec-folder continuity goes through system-spec-kit rather than through a Pi prompt.

### Sibling Boundaries

Each sibling dispatches to its own CLI. A request that names one of them routes there, never here.

| Skill | What it dispatches |
|---|---|
| `cli-opencode` | OpenCode, with the project's plugins, skills, MCP servers and instruction file loaded |
| `cli-claude-code` | Claude Code, for deep reasoning, diff-based edits and structured output |
| `cli-codex` | Codex, for sandboxed coding, repo analysis, PR review and web research |
| `cli-cursor` | Cursor, for Composer work and read-only plan or ask exploration |
| `cli-devin` | Devin, for multi-model coding, subagents and cloud handoff |
| `cli-deepseek-harness` | DeepSeek Harness, with a pinned binary and a closed two-route roster |
| `cli-mistral-vibe` | Mistral Vibe print mode, with the outcome read from `export.json` |

### Related Skills

| Skill | Relationship |
|---|---|
| `system-deep-loop` | Owns the runtime that launches a Pi lineage, including the model allowlist |
| `sk-code` | Owns code standards and the tests that judge what Pi returns |
| `system-spec-kit` | Owns spec folders, the session gate and continuity |
| `sk-prompt` | Owns the canonical prompt card that the packet's prompt asset delegates to |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command -v pi` prints nothing | The binary is absent from PATH | Install `@earendil-works/pi-coding-agent`, refresh PATH and rerun the probe |
| The run hangs with an empty log | `pi -p` inherited a terminal stdin | Append `</dev/null` after the prompt and before any redirect |
| A run stalls for minutes before any output | Startup network probes with no reachable path, which `--offline` skips | Pass `--offline` on every automated dispatch |
| `No API key found for the selected model` | The named provider has no credential | Configure provider auth outside the prompt and rerun. Never read the exit code as a pass |
| A different model answers than the one named | A bare `--model` id resolved against Pi's default provider | Write `--model provider/id` |
| `Extension does not export a valid factory function` | An invalid `.pi/extensions/*.ts` entry fails the session | Repair or remove the entry, then rerun |
| `pi install` or `pi list` act as if no package exists | The project trust gate covers reads as well as writes | Add `--approve` after you review the package |
| A child keeps rereading and never edits | pi-blackhole compacted the child mid-run | Set `PI_BLACKHOLE_PASSIVE=true` in the child's environment |
| A JSON consumer misparses the stream | JSON mode is line-delimited, not one document | Read one line at a time and keep RPC on a persistent client |

---

## 6. FAQ

### Is RPC mode a JSON version of print mode?

No. Print mode returns the final assistant message and exits. RPC keeps one process alive and frames requests and responses as newline-delimited JSON on stdin and stdout. A client that treats RPC as a one-shot call has no lifecycle owner for timeouts, backpressure, stderr capture or cleanup, so it should stay on print mode.

### Why must `--model` carry its provider?

A bare id resolves against Pi's own default provider, so the run silently uses a model you did not choose instead of failing. The provider-qualified form names one route. The enforcement guard refuses the split `--provider` plus bare `--model` form before launch.

### Does the packet prove that Pi flattens nested skills?

No. Skill discovery stays documented but unconfirmed in this packet. Prompt templates under `.pi/prompts/` and project-local extensions under `.pi/extensions/` are confirmed for the locations this repository populates. The confidence boundary is in [the native resource reference](./references/native-skills-and-extensions.md).

### Is `pi-mcp-extension` a Pi feature?

No. It is a community package, not part of the Pi CLI. Its stdio transport connected in a recorded test, while streamable HTTP and SSE remain documented only. The [package reference](./references/mcp-and-third-party-packages.md) holds the trust and rollback rules.

---

## 7. VERIFICATION

| Check | Result |
|---|---|
| Dispatch rules | The rule check below prints `4` with the four rule ids |
| Availability | `command -v pi` prints one path |
| Installed release | `pi --version` prints one version string |
| README structure | The validator check below reports `Total issues: 0` |
| Operator scenarios | The [manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) indexes the scenario files by category |

**Check the rule sidecar.**

```bash
node -e "const rules=require('./.skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json')
console.log(rules.length, rules.map((rule)=>rule.id).join(' '))"
```

Expected output: `4 stdin-redirect-required pi-availability-required pi-offline-required pi-provider-qualified-model`.

**Check this document.**

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-pi/README.md --type readme
```

Expected output: `Document type: readme` followed by `Total issues: 0`. The command exits 0.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and the hard rules |
| [`ROUTER.md`](./ROUTER.md) | Machine router: the intent map, the resource map and the loading levels |
| [`hard-rules.json`](./hard-rules.json) | The four preflight rules at severity `error` |
| [`references/cli-reference.md`](./references/cli-reference.md) | The flags, the headless modes, auth failures and the safe invocation checklist |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | The closed roster, the effort ladder and the child envelope |
| [`references/pi-tools.md`](./references/pi-tools.md) | The surfaces with no sibling analog |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | The conductor lifecycle, the validation pipeline and the anti-patterns |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | The built-in tool boundary and the delegation handback |
| [`references/native-skills-and-extensions.md`](./references/native-skills-and-extensions.md) | Native discovery with its confidence labels |
| [`references/mcp-and-third-party-packages.md`](./references/mcp-and-third-party-packages.md) | The MCP and community package boundaries |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | The prompt-quality delegator and the two-tier rule |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-ready dispatch templates |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios by category |
| [`benchmark/README.md`](./benchmark/README.md) | The index of archived validation reports |
| [`changelog/`](./changelog/) | One release note per version |

<!-- readme-check
allow-ref /Users/you/.local/bin/pi | sample output of `command -v pi`, which prints an absolute path on the reader's machine
-->
