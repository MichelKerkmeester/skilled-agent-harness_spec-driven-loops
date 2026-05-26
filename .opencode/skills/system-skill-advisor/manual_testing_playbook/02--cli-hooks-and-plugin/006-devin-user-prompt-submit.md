---
title: "CL-006 Devin CLI UserPromptSubmit Hook"
description: "Manual validation for the Devin CLI prompt-time skill advisor hook routed through the advisor-owned compiled hook."
trigger_phrases:
  - "cl-006"
  - "devin cli userpromptsubmit hook"
  - "devin hook"
  - "devin"
  - "mk-skill-advisor devin"
---

# CL-006 Devin CLI UserPromptSubmit Hook

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the Devin CLI `UserPromptSubmit` hook returns `hookSpecificOutput.additionalContext` for substantive prompts, returns `{}` for advisor-skipped prompts, fails open on errors and is correctly registered in `.devin/hooks.v1.json`.

Architecturally Devin invokes the advisor implementation directly at `.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/devin/user-prompt-submit.js`. Legacy system-spec-kit shims still forward to that path, but `.devin/hooks.v1.json` should point at the advisor-owned artifact.

---

## 2. SCENARIO CONTRACT

- `devin` binary is installed and authenticated (`devin auth status` shows "Logged in").
- Advisor MCP server build is current.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_HOOK_DISABLED` are unset.
- `.devin/hooks.v1.json` exists with a `UserPromptSubmit` entry pointing at the advisor hook path.
- `.devin/config.json` `read_config_from.claude` setting is at its default (= true), Devin will read `.claude/settings.local.json` too. Explicit Devin registration takes precedence.
- Self-invocation guard from cli-devin SKILL.md §2 must be satisfied (no `DEVIN_*` env, no `devin` in process ancestry).

---

## 3. TEST EXECUTION

1. Verify dist artifacts exist:

```bash
ls .opencode/skills/system-skill-advisor/mcp_server/dist/hooks/devin/user-prompt-submit.js
```

2. Verify `.devin/hooks.v1.json` registration:

```bash
jq '.UserPromptSubmit[0].hooks[0].command' .devin/hooks.v1.json
```

Expect a string containing `system-skill-advisor/mcp_server/dist/hooks/devin/user-prompt-submit.js`.

3. Smoke-test substantive prompt (expect full advisor brief):

```bash
mkdir -p /tmp/devin-hook-playbook
printf '%s' '{"prompt":"implement OAuth login flow with refresh tokens and CSRF protection","cwd":"'"$PWD"'","session_id":"cl-006","hook_event_name":"UserPromptSubmit"}' \
  | node .opencode/skills/system-skill-advisor/mcp_server/dist/hooks/devin/user-prompt-submit.js \
  > /tmp/devin-hook-playbook/cl-006-substantive.stdout.json 2> /tmp/devin-hook-playbook/cl-006-substantive.stderr
echo "Exit: $?"
```

4. Smoke-test short prompt (expect advisor skip `{}`, designed behavior):

```bash
printf '%s' '{"prompt":"hi","cwd":"'"$PWD"'","session_id":"cl-006","hook_event_name":"UserPromptSubmit"}' \
  | node .opencode/skills/system-skill-advisor/mcp_server/dist/hooks/devin/user-prompt-submit.js \
  > /tmp/devin-hook-playbook/cl-006-skip.stdout.json 2> /tmp/devin-hook-playbook/cl-006-skip.stderr
echo "Exit: $?"
```

5. Fail-open test (force advisor child to fail by passing malformed stdin):

```bash
printf '%s' 'not-json' \
  | node .opencode/skills/system-skill-advisor/mcp_server/dist/hooks/devin/user-prompt-submit.js \
  > /tmp/devin-hook-playbook/cl-006-malformed.stdout.json 2> /tmp/devin-hook-playbook/cl-006-malformed.stderr
echo "Exit: $?"
```

6. Live Devin TUI verification (optional, manual):

```bash
devin --permission-mode auto
# Inside Devin TUI:
#   /hooks
# Expect: UserPromptSubmit entry loaded from .devin/hooks.v1.json
#   <type a substantive prompt and observe advisor context surfaces in model context>
```

### Scenario Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CL-006 | Devin UserPromptSubmit hook | Confirm Devin prompt-time hook surfaces advisor brief directly, skips short prompts and fails open on malformed input | `Role: Devin operator. Context: Devin CLI installed and authenticated, .devin/hooks.v1.json registered. Action: pipe three payloads (substantive, short, malformed) through the advisor hook and inspect stdout/stderr. Format: PASS or FAIL per payload with advisor skip handling and fail-open envelope.` | 1. `bash: ls <advisor dist path>` -> 2. `bash: jq '.UserPromptSubmit[0].hooks[0].command' .devin/hooks.v1.json` -> 3. `bash: printf '%s' '{"prompt":"implement OAuth...","cwd":"'"$PWD"'"}' \| node <advisor-hook> > /tmp/.../cl-006-substantive.stdout.json 2> /tmp/.../cl-006-substantive.stderr` -> 4. Repeat with short prompt -> 5. Repeat with malformed `not-json` payload | Exit code 0 in all three runs. Substantive output contains `hookSpecificOutput.additionalContext` starting with `Advisor:`. Short-prompt output is `{}`. Malformed-stdin output is `{}`. Advisor stderr (when not fail-open) carries `runtime: "devin"`. Raw prompt literal absent from stderr | Captured stdout/stderr/exit transcripts for all three payloads, plus `.devin/hooks.v1.json` jq output | PASS if (a) all three runs exit 0, (b) substantive run emits `hookSpecificOutput.additionalContext` starting `Advisor:`, (c) short-prompt + malformed runs both emit `{}`, (d) registration cites the advisor hook path. FAIL otherwise | 1. Verify advisor dist artifact exists (rebuild advisor if missing); 2. Check `read_config_from.claude` for double-fire interference; 3. Run `advisor_status` MCP tool; 4. Inspect cli-devin self-invocation env vars; 5. Confirm `MK_SKILL_ADVISOR_HOOK_DISABLED` / `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` are unset |

### Expected Signals

- All three smoke runs exit `0`.
- Substantive-prompt stdout: parseable JSON with `hookSpecificOutput.hookEventName == "UserPromptSubmit"` and `hookSpecificOutput.additionalContext` starting with `Advisor:`.
- Short-prompt stdout: literal `{}` (advisor's policy-driven skip, correct, designed behavior. Not a defect).
- Malformed-stdin stdout: literal `{}` (advisor hook fail-open when stdin is malformed).
- Devin `/hooks` slash command lists `UserPromptSubmit` loaded from `.devin/hooks.v1.json`.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Advisor hook missing | `ls` of advisor hook path returns "No such file" | Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` and re-verify path. |
| Advisor dist missing | `ls` of advisor dist returns "No such file" | Run `cd .opencode/skills/system-skill-advisor/mcp_server && npx tsc -p tsconfig.build.json`. |
| Substantive prompt returns `{}` | Inspect stderr for `status: "skipped"` or freshness staleness | Run `advisor_status` MCP tool. Inspect `freshness` field. Run `advisor_rebuild` if stale. |
| Devin double-fires hook | `/hooks` shows two UserPromptSubmit entries (one from `.devin/hooks.v1.json`, one inherited from `.claude/settings.local.json`) | Either disable `read_config_from.claude` in `.devin/config.json` OR rely on Devin's own dedup (verify behavior). |
| Prompt text in stderr | Grep captured stderr for prompt literal | Treat as privacy failure. Inspect advisor diagnostic JSONL schema. |
| Self-invocation guard fires | Any `DEVIN_*` env var set / `devin` in ancestry | Run from a non-Devin shell. Clear `DEVIN_*` env before retest. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` (advisor implementation source)
- `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.ts` (legacy shim source)
- `.devin/hooks.v1.json` (registration)
- Internal design notes (ADR-001 hybrid strategy, ADR-003 bridge migration)

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-006
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/006-devin-user-prompt-submit.md
