---
title: "Devin CLI — Integration Patterns"
description: "Three documented use cases for calling AIs to dispatch into Devin: external dispatch (cli-X → cli-devin), ACP bridge, and cloud-handoff initiation. Each pattern has a prompt template + copy-paste invocation."
---

# Devin CLI — Integration Patterns

How calling AIs (Claude Code, Codex, Gemini, OpenCode, raw shell) dispatch work into a Devin session. Three patterns cover the practical surface.

---

## 1. OVERVIEW

The cli-devin skill exposes three documented use cases:

1. **External runtime → local devin dispatch** — most common. Calling AI hands a coding task to a local `devin` session and integrates the output.
2. **Devin as ACP bridge** — calling AI embeds Devin as an Agent Client Protocol server (`devin acp`) inside its own workflow.
3. **Cloud-handoff initiation** — calling AI runs a local dispatch that explicitly initiates a Devin cloud-VM handoff. Operator confirmation required.

Each use case has a smart-router signal (`DEVIN_LOCAL_DISPATCH`, `DEVIN_ACP_BRIDGE`, `DEVIN_CLOUD_HANDOFF` — see SKILL.md §2), a prompt template, and a copy-paste invocation shape.

---

## 2. USE CASE 1 — EXTERNAL RUNTIME TO LOCAL DEVIN

### When to Use
- Calling AI is Claude Code / Codex / Gemini / OpenCode / raw shell, AND the task fits Devin's preset coverage: SWE-1.6 for context gathering / tool use / simple-to-medium well-defined tasks; DeepSeek v4 for complex tasks (primary); GLM 5.1 or Kimi k2.6 as complex-task fallbacks.
- The task is local-only (no cloud handoff intended).
- The operator has not asked for a different sibling cli-* skill.

### Smart-Router Signal
`DEVIN_LOCAL_DISPATCH` — keywords: `devin cli`, `devin exec`, `delegate to devin`, `swe-1.6`, `from <runtime> to devin`.

### Prompt Template

```
<context>
Calling AI: <e.g. Claude Code session in /path/to/repo>
Spec folder (if any): <path> (pre-approved, skip Gate 3)
Active surface: <stack detected by sk-code>
</context>

<task>
<one-line goal>
<concrete acceptance criteria, file paths, verification commands>
</task>

<constraints>
- Honor the surface's verification commands.
- Do not modify files outside scope.
- Permission mode: normal (escalate to operator if destructive ops required).
</constraints>

<memory_handback>
<MEMORY_HANDBACK section if continuity update needed>
</memory_handback>
```

### Invocation Shape

```bash
# Write the prompt to a file (preferred for >2KB or programmatic dispatch)
cat > /tmp/devin-prompt.md <<'EOF'
<context>
Calling AI: cli-codex (gpt-5.5 medium) running in /repo
Spec folder: <spec-folder> (pre-approved, skip Gate 3)
Active surface: typescript-react (sk-code detection)
</context>

<task>
Refactor src/auth/* to extract token-validation into a single tested module. Keep behavior identical. Run `npm test -- --filter auth` after.
</task>

<constraints>
- Permission mode: normal.
- Do not touch files outside src/auth/.
</constraints>
EOF

devin --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  2>&1 </dev/null | tee /tmp/devin-output.log
```

### Why It Matters
The calling AI gets Devin's autonomous loop + coding-specialized model without losing control. The calling AI parses `/tmp/devin-output.log` and applies the family's "validate then integrate" protocol.

---

## 3. USE CASE 2 — DEVIN AS ACP BRIDGE

### When to Use
- The calling AI's runtime supports Agent Client Protocol (ACP) clients, AND
- The operator wants a Devin agent embedded as an ACP server endpoint reachable from other tools, OR
- The calling AI is building an integration that needs a long-lived Devin endpoint rather than one-shot dispatches.

### Smart-Router Signal
`DEVIN_ACP_BRIDGE` — keywords: `acp server`, `devin acp`, `agent client protocol`, `embed devin`.

### Prerequisites
- `devin auth status` succeeds.
- The calling AI's ACP client is configured to point at the local `devin acp` endpoint (host/port — see Devin docs for the current default).

### Invocation Shape

```bash
# Start the Devin ACP server (foreground or backgrounded)
devin acp 2>&1 | tee /tmp/devin-acp.log &
ACP_PID=$!

# Calling AI connects to the ACP endpoint via its own client
# (e.g. opencode --attach <acp-url>, or a custom integration)

# When done:
kill $ACP_PID
```

### Why It Matters
Devin becomes a peer ACP endpoint alongside OpenCode's `acp` mode and any other ACP-capable runtime. The calling AI orchestrates without spawning a new `devin` process per task.

### Considerations
- ACP traffic is host-local; do not expose without explicit operator approval.
- Token rotation / session state is owned by the long-lived `devin acp` process.

---

## 4. USE CASE 3 — CLOUD-HANDOFF INITIATION

### When to Use
- The work is long-running (multi-hour) and the operator wants to close the laptop.
- The operator has explicitly confirmed cloud handoff in the same turn.
- The operator has a Devin account provisioned for cloud sessions.

### Smart-Router Signal
`DEVIN_CLOUD_HANDOFF` — keywords: `cloud handoff`, `hand off to cloud`, `devin cloud`, `cloud agent`, `close laptop`, `long-running pr`, `devin vm`.

### Operator-Confirmation Gate (REQUIRED)
**The skill MUST NOT proceed with a cloud-handoff dispatch without explicit operator confirmation in the same turn.** See `cloud_handoff.md` for the full gate checklist.

### Prompt Template

```
<context>
This dispatch initiates a Devin cloud handoff after operator confirmation in turn N (cite confirmation).
Local session will start the work; cloud agent continues asynchronously and returns a PR.
</context>

<task>
<one-line goal that justifies a multi-hour cloud session>
<acceptance criteria the cloud agent will use to know it's done>
<repo state at handoff: branch name, commit sha>
</task>

<constraints>
- Operator confirmed cloud handoff at <timestamp>.
- Devin account: <handle/tier> (operator confirmed entitlement).
- Permission mode for the cloud session: <auto/dangerous — operator-approved>.
- Return: PR URL + summary of changes.
</constraints>
```

### Invocation Shape

Cloud handoff is initiated from inside a live `devin` TUI session (not from a one-shot `devin --prompt-file` dispatch). The calling AI's role is:

1. Compose the operator-confirmation gate.
2. Wait for explicit operator approval.
3. Launch `devin` interactively with the prompt seeded.
4. Surface the in-TUI handoff command to the operator.
5. After handoff is initiated by the operator, the calling AI receives the cloud session id and tracks the PR-return state.

```bash
# Step 1: confirm gate (see cloud_handoff.md)
# Step 2: operator approves
# Step 3: launch with seed
devin --model swe-1.6 --permission-mode auto --prompt-file /tmp/cloud-handoff-seed.md

# Inside the TUI, the operator triggers cloud handoff per Devin's documented procedure.
# The skill does NOT autoclick this step.
```

### Why It Matters
Cloud handoff is Devin's headline differentiator. No other cli-* family member offers this. The skill documents the pattern AND enforces the operator-confirmation gate; it does not handle billing tier checks (out of scope).

---

## 5. SELF-INVOCATION GUARD

Same as SKILL.md §2. Each use case respects the guard:
- Use case 1 — refused if the calling AI IS a local `devin` session
- Use case 2 — `devin acp` from inside a `devin` session is also self-invocation; refused
- Use case 3 — cloud handoff is the documented exception; it MUST be initiated explicitly, with operator confirmation

---

## 6. CROSS-CLI INTEGRATION PATTERNS

When dispatching cli-devin from another cli-* runtime, honor the calling CLI's conventions:

### From cli-codex
- Pass `--sandbox workspace-write` in the codex invocation so it can write `/tmp/devin-prompt.md` before dispatching `devin`.
- Per memory `feedback_codex_sandbox_blocks_network.md`, if cloud handoff is involved, codex sub-processes need `-c sandbox_workspace_write.network_access=true` for any network-bound calls.

### From cli-claude-code
- Use the Claude Code Bash tool to dispatch `devin`; Read tool to parse `/tmp/devin-output.log` after.

### From cli-opencode
- Dispatch `devin` from inside the OpenCode session's shell — does NOT count as self-invocation (cli-opencode is a different runtime). Standard `devin --prompt-file ... 2>&1 </dev/null` pattern.

---

## 7. RELATED RESOURCES

- [SKILL.md](../SKILL.md)
- [cli_reference.md](./cli_reference.md)
- [devin_tools.md](./devin_tools.md)
- [agent_delegation.md](./agent_delegation.md)
- [cloud_handoff.md](./cloud_handoff.md)
- [prompt_templates.md](../assets/prompt_templates.md)
