---
title: "Devin CLI Orchestrator"
description: "Cross-AI task delegation to Cognition AI's Devin for Terminal, autonomous coding work with optional local-to-cloud handoff."
trigger_phrases:
  - "devin cli"
  - "devin for terminal"
  - "delegate to devin"
  - "swe-1.6"
  - "cli-devin"
---

# Devin CLI Orchestrator

> Delegate tasks from any AI assistant to Cognition's "Devin for Terminal", autonomous coding agent, four-model preset (SWE-1.6 default for context gathering / tool use / simple-medium tasks; DeepSeek v4 for complex work; GLM 5.1 and Kimi k2.6 as complex-task fallbacks), permission-mode taxonomy, and the family's only local-to-cloud handoff.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 FEATURE HIGHLIGHTS](#31--feature-highlights)
  - [3.2 FEATURE REFERENCE](#32--feature-reference)
  - [3.3 CLI COMPARISON](#33--cli-comparison)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
  - [5.1 KEY STATISTICS](#51--key-statistics)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

This skill lets any AI assistant invoke Cognition AI's official "Devin for Terminal" Rust CLI (`devin`) for tasks that benefit from Devin's autonomous coding loop, its coding-specialized SWE-1.6 model, or its unique local-to-cloud handoff. The calling AI stays the conductor, selecting (model, permission-mode, prompt-file), running the dispatch, validating Devin's output, and integrating the result.

Three capabilities distinguish Devin in the cli-* family. **Local-to-cloud handoff** is the headline. When work outgrows the laptop, operators can migrate the live session to a Devin cloud VM that keeps working after the laptop closes and returns a PR. No other family member has this. **Permission modes** (`auto` / `dangerous`) give the calling AI explicit risk-tier control mirroring Codex's `--sandbox` levels. **The four-model preset** (SWE-1.6 default for context gathering, tool use, and simple-to-medium well-defined tasks; DeepSeek v4 as the primary pick for complex work; GLM 5.1 and Kimi k2.6 as documented complex-task fallbacks) lets a single skill invocation cover most workloads.

The skill includes a self-invocation guard, if the calling AI is itself a local `devin` session, the skill refuses to load (matching the family pattern). The single legitimate exception is an explicit cloud-handoff request that spawns a separate Devin cloud sandbox.

### Key Features at a Glance

- **Cloud Handoff**: Migrate the live session to a Devin cloud VM; returns a PR while you close the laptop
- **Permission Modes**: `auto` (default, auto-approves read-only tools), `dangerous` (auto-approves all tools, explicit operator approval required)
- **Four-Model Preset**: SWE-1.6 (default, context gathering / tool use / simple-medium tasks), DeepSeek v4 (primary for complex work), GLM 5.1 + Kimi k2.6 (complex-task fallbacks)
- **MCP integration**: `devin mcp add <name>` + OAuth via `devin mcp login`
- **ACP server**: Run Devin as an Agent Client Protocol server, embeddable in other tools
- **Session continuity**: `devin --continue` / `--resume <id>` / `devin list`
- **Self-invocation guard**: Refuses to load when the calling AI is itself a local `devin` session (cloud handoff is the documented exception)
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Prerequisites
- `devin` binary installed (`command -v devin`); see install commands below.
- Authenticated session (`devin auth status` succeeds).
- The calling AI is NOT a local `devin` session (self-invocation guard).

### Install
```bash
# macOS / Linux
curl -fsSL https://cli.devin.ai/install.sh | bash

# Windows (PowerShell)
irm https://static.devin.ai/cli/setup.ps1 | iex
```

### First Auth
```bash
devin setup            # interactive wizard
# OR
devin auth login       # paste token from https://app.devin.ai
devin auth status      # verify
```

### Smoke Test (from a calling AI session)
```bash
printf 'List the files in the current directory and explain what this project does.\n' > /tmp/devin-smoke.md
devin --prompt-file /tmp/devin-smoke.md --model swe-1.6 --permission-mode auto 2>&1 </dev/null
```

If `devin auth status` succeeds and the smoke test returns a coherent response, the skill is ready for dispatch.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

**Local-to-cloud handoff (the differentiator).** When local work outgrows the laptop, hand the session off to a cloud-hosted Devin VM. The cloud agent keeps working asynchronously and returns a PR. The skill enforces an operator-confirmation gate before any handoff because cloud sessions transmit local repo state to Cognition's sandbox and consume Devin units.

**Permission modes mapped to family risk taxonomy.** `auto` = default (confirms risky ops; analog of Codex `--ask-for-approval on-request`). `dangerous` = mostly auto (analog of Codex `--full-auto`). `dangerous` = full auto (analog of `--dangerously-skip-permissions` / `--sandbox danger-full-access`). The skill requires explicit operator approval before escalating beyond `auto`.

**Four-model preset.** SWE-1.6 is Cognition's coding-specialized model and the natural default for context gathering, tool use, and simple-to-medium well-defined tasks. DeepSeek v4 is the primary pick for complex work. GLM 5.1 and Kimi k2.6 are documented complex-task fallbacks, pick GLM 5.1 for agentic / tool-use-heavy complex work, Kimi k2.6 when the complex task needs unusually large context. Switch via `--model <id>` per dispatch or `/model <name>` mid-session.

**MCP + skills + rules.** Devin's `devin mcp` / `devin skills` / `devin rules` subcommands give the dispatched session access to MCP servers, custom skills, and behavioral rules, the same kind of runtime extension that `cli-opencode` exposes via `--agent <slug>`.

**Session continuity.** `devin --continue` resumes the last session; `--resume <id>` targets a specific session; `devin list` enumerates them. Combined with `/fork [step]` and `/revert <step>` inside the TUI, this gives the family's most fine-grained session-history surface.

### 3.2 FEATURE REFERENCE

- **Default Invocation**: `devin --prompt-file <path> --model swe-1.6 --permission-mode auto 2>&1 </dev/null`
- **Complex tasks (primary)**: `--model deepseek-v4`
- **Complex-task fallback (agentic / tool-use)**: `--model glm-5.1`
- **Complex-task fallback (large context)**: `--model kimi-k2.6`
- **Resume**: `devin --continue` or `devin --resume <id>`
- **Background dispatch**: append ` &` and capture stdout/stderr to a log
- **Interactive slash commands**: `/mode`, `/plan` (read-only mode), `/clear`, `/fork`, `/revert`, `/steps`, `/ask`, `/model`, `/context`, `/help`
- **MCP**: `devin mcp {add,list,login}`
- **Rules / skills**: `devin rules list`, `devin skills {list, show}`
- **ACP server**: `devin acp`
- **Shell integration**: `devin shell setup`
- **Version + update**: `devin version`, `devin update [--force]`

See [references/cli_reference.md](./references/cli_reference.md) for the complete surface.

### 3.3 CLI COMPARISON

| Capability | Claude Code CLI | Codex CLI | Gemini CLI | OpenCode CLI | Devin CLI |
|------------|-----------------|-----------|------------|--------------|-----------|
| **Web search** | No | `--search` | Google Search | Via project plugins | No (Devin's strength is execution, not search) |
| **Code review** | Agent-based | `/review` diff-aware | Manual prompt | `@review` agent | Built-in agent loop |
| **Sandbox / permission control** | Permission modes | 3 sandbox modes + approval policies | `--yolo` flag | Permission system | 2 permission modes (`auto`/`dangerous`) |
| **Image input** | No | `--image` | No | No | No |
| **Session management** | Continue / resume | Resume / fork / history | Memory tool | Continue / session id / fork / share URL | `--continue` / `--resume <id>` / `list` |
| **Cloud execution** | No | `codex cloud` | No | Via `--attach <url>` | **Local-to-cloud handoff (async PR return)** |
| **MCP support** | Native | `codex mcp` | No | Native | `devin mcp add` + OAuth login |
| **ACP (Agent Client Protocol)** | No | No | No | `acp` mode | `devin acp` |
| **Custom skills / rules** | Skills surface | Profiles | GEMINI.md | Project skills | `devin skills` + `devin rules` |
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
cli-devin/
├── SKILL.md                          # Entry point, 8 family sections
├── README.md                         # This file
├── graph-metadata.json               # Skill-advisor metadata + sibling edges
├── changelog/
│   └── v1.0.0.0.md                   # Initial release notes
├── references/
│   ├── cli_reference.md              # Command/flag/slash-command surface
│   ├── integration_patterns.md       # 3 use cases for calling AIs
│   ├── agent_delegation.md           # (model, permission-mode, prompt-file) routing
│   ├── devin_tools.md                # Unique capabilities + cross-CLI comparison
│   └── cloud_handoff.md              # Devin-only, local→cloud narrative + gate
├── assets/
│   ├── prompt_quality_card.md        # CLEAR 5-check, framework selection
│   └── prompt_templates.md           # Copy-paste templates per dispatch type
└── manual_testing_playbook/
    ├── manual_testing_playbook.md    # Root playbook, 25 scenarios across 9 categories
    ├── 01--cli-invocation/           # 4 scenarios
    ├── 02--permission-modes/         # 3 scenarios
    ├── 03--model-presets/            # 3 scenarios
    ├── 04--devin-surfaces/           # 3 scenarios
    ├── 05--session-continuity/       # 3 scenarios
    ├── 06--cloud-handoff/            # 2 scenarios (5-check gate + live round trip)
    ├── 07--self-invocation-guard/    # 2 scenarios
    ├── 08--cross-ai-dispatch/        # 4 scenarios (one per sibling cli-* runtime)
    └── 09--acp-bridge/               # 1 scenario (devin acp lifecycle)
```

Family parity, this 7-entry directory shape matches `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode`. Per-version changelog files (`v{MAJOR}.{MINOR}.{PATCH}.{BUILD}.md`) and the root `manual_testing_playbook.md` follow the family canonical shape.
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### 5.1 KEY STATISTICS

- **Models**: 4 (Cognition SWE-1.6 default, DeepSeek v4, Kimi k2.6, GLM 5.1)
- **Default Dispatch**: `swe-1.6` · `auto` permission (Zero-input default; operator can override explicitly)
- **Permission Modes**: 2 (auto, dangerous)
- **Slash Commands**: 10 (verified) + extras via in-TUI `/help` (`/mode`, `/plan`, `/clear`, `/fork`, `/revert`, `/steps`, `/ask`, `/model`, `/context`, `/help`)
- **References**: 5 (cli_reference, integration_patterns, agent_delegation, devin_tools, cloud_handoff)
- **Version**: 1.0.2.0 (2026-05-15, wave-2 SKIP promotions (8 of 13 SKIPs now PASS) + 6 doc corrections (stdin rule, session-id slugs, --format json, mcp full lifecycle, cloud drs, mcp add separator))

### Profiles
Devin stores profiles at `~/.config/devin/config.json`. Each profile holds the API token, default model, and per-profile settings. Override the config path with `--config <path>`.

### Models
- `swe-1.6` (default, context gathering, tool use, simple-to-medium well-defined code tasks)
- `deepseek-v4` (primary for complex tasks, ambiguous, multi-step, reasoning-bound)
- `glm-5.1` (complex-task fallback, agentic / tool-use, MCP chains)
- `kimi-k2.6` (complex-task fallback, large-context, long files / sprawling diffs)

### Permission Modes
- `auto` (default, auto-approves read-only tools, prompts on write/exec)
- `dangerous` (auto-approves all tools, explicit operator approval required)

### MCP Servers
`devin mcp add <name>` to register; `devin mcp login <name>` for OAuth.

### Skill Configuration
This skill itself reads no configuration from disk, it composes invocations from operator phrasing + the §3 SKILL.md routing table. No per-skill config file is required.
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Default coding dispatch (from cli-codex session)
```bash
# Calling AI is in a Codex session; needs Devin for an autonomous refactor pass
printf 'Refactor src/auth/* to extract the token-validation logic into a single tested module. Keep behavior identical. Run tests after.\n' > /tmp/devin-prompt.md
devin --prompt-file /tmp/devin-prompt.md --model swe-1.6 --permission-mode auto 2>&1 </dev/null | tee /tmp/devin.log
```

### Example 2: Complex review (from cli-claude-code session, DeepSeek v4 primary)
```bash
printf 'Review the architecture of the payment-flow module. Identify race conditions, security issues, and missing error paths. Cite line numbers.\n' > /tmp/devin-review.md
devin --prompt-file /tmp/devin-review.md --model deepseek-v4 --permission-mode auto 2>&1 </dev/null
```

### Example 3: Cloud handoff (operator-confirmed)
See [references/cloud_handoff.md](./references/cloud_handoff.md) for the full operator-confirmation gate. The skill does NOT auto-dispatch cloud handoffs, they require explicit operator confirmation in the same turn.

### Example 4: Resume a prior session
```bash
devin --resume 019e2a5a-ee4f-7da0-9d65-bed3476c5256
```

### Example 5: Inspect available rules and skills
```bash
devin rules list
devin skills list
devin skills show repo-aware-refactor
```

### Example 6: Background dispatch with log capture
```bash
devin --prompt-file /tmp/long-task.md --model swe-1.6 --permission-mode auto \
  > /tmp/devin-$(date +%s).log 2>&1 </dev/null &
echo "Dispatched: PID=$!"
```

More patterns in [references/integration_patterns.md](./references/integration_patterns.md) and [assets/prompt_templates.md](./assets/prompt_templates.md).
<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `command not found: devin` | Binary not installed | Run install command from §2 |
| `Not authenticated` | Missing or expired token | `devin auth login` (token from `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge)) |
| Dispatch hangs at 0% CPU after launch | Missing `</dev/null` in background invocation | Append `</dev/null` to the command |
| Task ran but no files changed | `--permission-mode auto` paused for confirmation in non-interactive mode | Re-dispatch with `dangerous` or `dangerous` (operator-approved) or run interactively |
| Self-invocation guard error | The calling AI IS a local `devin` session | Use a sibling cli-* skill, or restate with explicit cloud-handoff keywords |
| `--model <id>` rejected | Model name typo | Use one of: `swe-1.6`, `deepseek-v4`, `kimi-k2.6`, `glm-5.1` |
| Cloud handoff refused | Account lacks cloud entitlement, or operator did not confirm | See `references/cloud_handoff.md` |
| Auth pre-flight passes but dispatch errors with auth message | Token rotated mid-session | Invalidate cache, rerun `devin auth status`, re-dispatch |
| Unexpected output format | Output-format flag drift; official `--json` flag is unverified | Treat Devin output as free-form text until `--json` is confirmed on the installed version |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General

**Q: Which model should I default to?**
A: `swe-1.6`. It is the right choice for context gathering, tool use, and simple-to-medium code tasks that are clearly defined beforehand. For complex tasks (ambiguous, multi-step, reasoning-bound, broad in scope), the primary pick is `deepseek-v4`. If DeepSeek v4 doesn't fit or doesn't deliver, fall back to `glm-5.1` (agentic / tool-use shape) or `kimi-k2.6` (large-context shape).

**Q: When should I use cloud handoff?**
A: When the work is long-running (multi-hour), the operator wants to disconnect, AND the operator has explicitly confirmed cloud-handoff in the same turn. The skill enforces an operator-confirmation gate because cloud sessions transmit repo state and consume Devin units. See `references/cloud_handoff.md`.

**Q: Why isn't there a `--sandbox` flag like Codex has?**
A: Devin uses `--permission-mode` instead. `auto` ≈ `--ask-for-approval on-request`; `dangerous` ≈ `--full-auto`; `dangerous` ≈ `--sandbox danger-full-access`. See `references/devin_tools.md` for the full cross-CLI permission-mode map.

### Self-Invocation Guard

**Q: How does the self-invocation guard work?**
A: Three layers. Layer 1 checks for any `DEVIN_*` env var. Layer 2 walks the process ancestry looking for `devin`. Layer 3 probes `~/.config/devin/sessions/<id>/lock` (speculative, verify on first real install). ANY positive trips the guard. The router then refuses unless the prompt has explicit cloud-handoff keywords.

**Q: What's the only legitimate exception?**
A: An explicit cloud handoff. A local `devin` session can initiate a handoff to a separate Devin cloud sandbox, that's a different session id, different sandbox, not self-invocation. The prompt MUST include cloud-handoff keywords AND operator confirmation in the same turn.

### Permission Modes

**Q: Can the calling AI auto-escalate permission modes?**
A: No. Escalation from `auto` to `dangerous` requires explicit operator approval, recorded in the dispatch log. The skill body's RULES section enforces this; the calling AI MUST surface the request to the operator and wait.

### Sessions

**Q: How do I share session state between dispatches?**
A: `devin --continue` resumes the last session; `devin --resume <id>` targets a specific one. Use the interactive `/fork [step]` and `/revert <step>` slash commands inside the TUI for fine-grained branching.

### Cross-AI

**Q: Can `cli-devin` be called from inside an OpenCode session?**
A: Yes, that's the family pattern. The self-invocation guard only refuses when the calling AI is itself a `devin` session.

**Q: Does the unofficial PyPI `devin-cli` work with this skill?**
A: No. The skill targets only the official Cognition Rust `devin` binary (installed from `cli.devin.ai/install.sh`). The unofficial PyPI package is noted in `references/cli_reference.md` for completeness but is explicitly out of scope.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md): Skill definition, smart router, self-invocation guard
- [cli_reference.md](./references/cli_reference.md): Subcommands, flags, slash commands
- [integration_patterns.md](./references/integration_patterns.md): 3 use cases for calling AIs
- [devin_tools.md](./references/devin_tools.md): Unique capabilities + cross-CLI comparison
- [agent_delegation.md](./references/agent_delegation.md): (model, permission-mode, prompt-file) routing analog
- [cloud_handoff.md](./references/cloud_handoff.md): Local→cloud handoff narrative + gate
- [prompt_templates.md](./assets/prompt_templates.md): Copy-paste templates
- [prompt_quality_card.md](./assets/prompt_quality_card.md): Framework selection, CLEAR 5-check

### Related Skills
- [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
- [cli-codex](../cli-codex/): OpenAI Codex CLI orchestrator
- [cli-gemini](../cli-gemini/): Google Gemini CLI orchestrator
- [cli-opencode](../cli-opencode/): OpenCode CLI orchestrator (full plugin/skill/MCP runtime)
- [sk-code](../sk-code/): Surface-aware code quality contracts
- [mcp-code-mode](../mcp-code-mode/): External MCP work
- [system-spec-kit](../system-spec-kit/): Spec folder workflow + Spec Kit Memory

<!-- /ANCHOR:related-documents -->
