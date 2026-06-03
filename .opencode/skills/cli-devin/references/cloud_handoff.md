---
title: "Devin CLI — Local-to-Cloud Handoff"
description: "Devin's headline capability: hand a live local session off to a cloud-hosted Devin VM that keeps working asynchronously and returns a PR. cli-devin enforces an operator-confirmation gate before any dispatch that surfaces handoff phrasing."
---

# Devin CLI — Local-to-Cloud Handoff

The cli-* family's only async cloud-execution capability. Devin can migrate a live local session to a Cognition-hosted cloud VM that keeps working after the operator closes the laptop and returns a PR. This file documents when, why, how, who confirms, and how the calling AI integrates the returned artifact.

---

## 1. OVERVIEW

This reference documents Devin's local-to-cloud handoff — the cli-* family's only async cloud-execution capability — and the 5-check operator-confirmation gate that cli-devin enforces before any handoff dispatch. Sections 2-9 cover what cloud handoff is, when to use it, the gate, the handoff flow, prompt templates, PR integration, failure modes, future work, and related resources.

### What It Is

Devin's cloud handoff is an asynchronous escalation: a running `devin` session, paused at a well-defined state, is migrated to a Cognition-hosted cloud agent that owns its own VM. The cloud agent continues the work using the same prompt, same model, and same goal. When the work is done (or the cloud agent hits a defined stopping condition), the result returns as a pull request URL plus a summary of changes.

### Why It Matters

Other cli-* family members are local-only. cli-codex has a `codex cloud` subcommand for remote task execution but lacks Devin's autonomous-agent loop in the cloud. cli-opencode supports `--attach <url>` to remote OpenCode servers but those are operator-managed instances, not async clouds. Devin's cloud handoff is purpose-built for the "close the laptop, come back to a PR" workflow.

### Why It's Gated

Cloud sessions transmit local repo state (or its initial snapshot) to Cognition's cloud sandbox. They consume Devin units (paid). They produce changes (a PR) without the operator at the keyboard. All three properties make this a deliberate operator decision, not an autonomous one.

---

## 2. WHEN TO USE

- The work is long-running (multi-hour) AND the operator wants to disconnect.
- The acceptance criteria are well-enough defined that an asynchronous agent can know it's done.
- The operator has a Devin account provisioned for cloud sessions.
- The operator has explicitly confirmed cloud handoff IN THE SAME TURN as the dispatch (no inferred consent from prior turns).

### When NOT to Use

- The work needs operator-in-the-loop decisions (architectural choices, ambiguous requirements).
- The repo contains secrets that the operator hasn't reviewed for cloud-transmission safety.
- The Devin account is on a tier that doesn't include cloud sessions.
- The operator is exploring options, not committing — handoff initiation is an escalation, not exploration.

---

## 3. OPERATOR-CONFIRMATION GATE (REQUIRED)

**The cli-devin skill MUST NOT initiate a cloud-handoff dispatch without operator confirmation in the same turn.** The gate has 5 checks. Each must be satisfied before the calling AI proceeds.

### CHK-CH-1: Explicit Operator Phrase
The operator's request MUST contain at least one explicit cloud-handoff phrase in the current turn:
- "cloud handoff"
- "hand off to cloud"
- "devin cloud"
- "cloud agent"
- "close laptop / close my laptop"
- "long-running PR"
- "devin VM"

If only the calling AI proposes cloud handoff, the gate is NOT satisfied. The operator must affirm.

### CHK-CH-2: Account Provisioning Confirmation
The operator MUST confirm (or have confirmed in a memory entry the AI can cite) that their Devin account is provisioned for cloud sessions. The skill does NOT probe billing-tier APIs. Surface the question:

> "Cloud handoff consumes Devin units. Is your account provisioned for cloud sessions?"

### CHK-CH-3: Repo-State Review
The operator MUST acknowledge that local repo state will be transmitted to Cognition's cloud sandbox. The skill MUST surface:

> "The cloud agent receives the repo state at the handoff point. Have you reviewed for secrets, credentials, or files you would not want in Cognition's cloud sandbox?"

### CHK-CH-4: Acceptance-Criteria Sufficiency
The operator MUST confirm the prompt has clear-enough acceptance criteria for an async agent to self-evaluate completion. Cloud agents don't have an operator-in-the-loop fallback — they need to know when they're done.

### CHK-CH-5: Permission-Mode Selection
The operator MUST select the cloud session's permission mode (`auto` / `dangerous`). Cloud sessions in `dangerous` mode operate without confirmations; the choice is operator-explicit.

### Gate Output
If ALL 5 checks pass, the calling AI proceeds with the dispatch. The cli-devin SKILL.md §3 Default Invocation block applies; the operator initiates the handoff inside the live `devin` TUI per Devin's documented procedure.

If ANY check fails, the calling AI surfaces the gap and waits. NO inferred consent.

---

## 4. THE HANDOFF FLOW

```text
1. Operator + Calling AI define the cloud-suitable task.
2. Calling AI runs the 5-check gate. Operator confirms each.
3. Calling AI composes a tight prompt (acceptance criteria, repo state, permission mode).
4. Calling AI launches `devin --prompt-file <path> --model <id> --permission-mode <mode>` interactively.
5. Inside the live TUI, the OPERATOR initiates cloud handoff per Devin's documented procedure.
   (The skill does NOT auto-trigger this — it's an operator action.)
6. The local `devin` session ends. The cloud agent picks up.
7. Operator closes the laptop / disconnects. Cloud agent runs asynchronously.
8. When done (or stopped), the cloud agent emails / surfaces a PR URL + summary.
9. Operator + Calling AI review the PR in a later turn.
```

**Key boundary:** steps 5–7 are operator-driven. The calling AI's role is to compose the prompt, run the gate, and prepare the operator for the in-TUI handoff. The calling AI does NOT automate the handoff trigger.

---

## 5. PROMPT TEMPLATE FOR CLOUD HANDOFF

```
<context>
This dispatch will be handed off to a Devin cloud agent after operator confirmation.
The cloud agent runs asynchronously. No operator-in-the-loop fallback.
Operator confirmed cloud handoff in turn <N>: <verbatim operator phrase>.
Operator confirmed account provisioning: <yes/at <timestamp>>.
Operator confirmed repo-state review: <yes>.
Operator selected permission mode: <auto/dangerous>.
Repo state at handoff: branch=<name>, commit=<sha>, dirty=<true/false>.
</context>

<task>
<one-line goal>
<concrete acceptance criteria — bullet list>
<verification commands the cloud agent should run before reporting done>
</task>

<termination>
The cloud agent should report DONE when:
- All acceptance criteria are met.
- Verification commands pass.
- A PR is opened against branch <target>.

The cloud agent should report BLOCKED when:
- It encounters an ambiguous requirement that needs operator input.
- It encounters a security-sensitive change it cannot make safely.
- Verification fails after <N> retry attempts.
</termination>

<return>
On DONE: PR URL + 5-bullet summary + verification log.
On BLOCKED: state of work + the specific ambiguity + recommended next operator action.
</return>
```

---

## 6. INTEGRATING THE RETURNED PR

When the cloud agent returns a PR, the operator's next session uses the calling AI to integrate it.

### Step-by-step
1. **Verify PR origin**: confirm the PR is from the operator's expected Devin cloud session id.
2. **Read the summary**: the cloud agent's summary describes WHAT was done. Review for scope drift.
3. **Read the diff**: apply normal code-review discipline (`@review` agent, `sk-code-review` baseline, surface-specific lint/test).
4. **Run verification commands locally**: don't trust the cloud agent's verification log; rerun in the operator's environment.
5. **Merge OR comment-and-iterate**: standard PR workflow.

### Watch For
- **Scope drift**: cloud agents in `dangerous` mode can do more than asked. Diff carefully.
- **Secret leakage in commits**: cloud agents may have included files the operator did not intend to transmit. Check for env files, credentials, lock files with secrets.
- **Test coverage gaps**: cloud agents may have lowered coverage to pass verification. Compare coverage before/after.
- **Style violations**: cloud agent may have used different conventions than the surface's `sk-code` standards. Run the surface-specific lint.

---

## 7. FAILURE MODES

| Mode | Detection | Recovery |
|------|-----------|----------|
| Cloud handoff refused — no entitlement | Devin TUI reports tier mismatch | Operator upgrades Devin account or uses local-only dispatch |
| Cloud session timeout (no return) | No PR after expected window | Operator checks Devin web UI for session state; may resume with `devin --resume <cloud-session-id>` if exposed |
| Cloud agent reports BLOCKED | Returned summary indicates ambiguity | Operator addresses ambiguity in a new local turn; may dispatch a follow-up with refined prompt |
| Cloud agent over-stepped scope | Diff shows changes beyond acceptance criteria | Standard PR comments; iterate or close PR + redispatch with tighter scope |
| Secret leakage detected | Diff contains files/values that shouldn't be in the cloud | Close PR; rotate credentials if exposed; review CHK-CH-3 process for the operator |

---

## 8. FUTURE WORK (not in scope for v1.0)

- Skill-side check of Devin account tier (would require auth-bearer API call; out of scope).
- Skill-side `:cloud` invocation modifier (would make cloud handoff a first-class one-shot operation). Considered for a future minor version after first real-world use.
- Automated PR-integration helper (lint + test + diff review pipeline triggered on PR arrival).

---

## 9. RELATED RESOURCES

- [SKILL.md](../SKILL.md) — Default Invocation, RULES (the `dangerous` operator-approval gate also applies to cloud sessions)
- [cli_reference.md](./cli_reference.md) — Top-level command surface
- [integration_patterns.md](./integration_patterns.md) — Use Case 3 (cloud-handoff initiation)
- [devin_tools.md](./devin_tools.md) — Cross-CLI comparison (Devin is the only family member with this capability)
- External: [Cognition blog — Devin for Terminal](https://cognition.ai/blog/devin-for-terminal) — handoff narrative
