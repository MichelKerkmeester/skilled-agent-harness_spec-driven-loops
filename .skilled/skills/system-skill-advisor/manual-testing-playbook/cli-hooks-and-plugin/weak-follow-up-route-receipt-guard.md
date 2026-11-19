---
title: "CL-011 Weak Follow-Up Route-Receipt Guard"
description: "Manual validation that the Claude hook suppresses a weak follow-up route that conflicts with the session's current route receipt."
trigger_phrases:
  - "cl-011"
  - "weak follow-up route receipt"
  - "route-receipt guard"
  - "session route receipt"
version: 1.0.0.0
id: CL-011
category: cli_hooks_and_plugin
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: hooks/skill-advisor-hook.md
---

# CL-011 Weak Follow-Up Route-Receipt Guard

Prompt: Start a Claude hook session with a clear README task, follow it with `fix that too`, then send a new code task.

---

## 1. OVERVIEW

The Claude hook records a delivered, non-floored route for a confirmed session. It suppresses a later confidence-floored work route only when the prompt is a weak follow-up to a different skill and the saved receipt still matches the session lifecycle clock.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a current `sk-doc` route receipt suppresses a conflicting weak `sk-code` follow-up while a detailed code task still receives its route.
- Real user request: `Update the advisor README to document the new corpus file layout, then fix that too.`
- Prompt: `Start a Claude hook session with the README task, follow it with “fix that too”, then send a detailed session-store refactor task.`
- Preconditions: Run from the repository root with the advisor runtime built. The skill-advisor hook and directive-lifecycle receipt tracking are enabled. The advisor can return a non-degraded `sk-doc` route for the seed prompt.
- Expected execution process: Send three prompt payloads through the compiled Claude hook with the same session id and isolated lifecycle state directory. Inspect the route receipt and each hook response.
- Expected signals: The first turn writes a receipt for `sk-doc`. The weak follow-up returns `Advisor: prompt skipped.`. The detailed refactor task returns a brief for `sk-code`.
- Desired user-visible outcome: A short follow-up does not replace the route that still frames the session, while a detailed new task routes on its own wording.

---

## 3. TEST EXECUTION

### Prompt

- Seed turn: `Update the advisor README to document the new corpus file layout`
- Weak follow-up: `fix that too`
- Detailed task: `Refactor the session store module to remove duplicated locking code`

### Commands

1. Build the advisor runtime.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

2. Run the three turns through the compiled hook with the same session state. The first hook response must leave a route receipt before the second turn runs.

```bash
set -e
mkdir -p /tmp/skill-advisor-playbook
T=$(mktemp -d /tmp/cl-011.XXXXXX)
mkdir -m 700 "$T/state"

printf '%s' '{"prompt":"Update the advisor README to document the new corpus file layout","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-011-session"}' \
  | env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_DISABLED -u SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED \
      TMPDIR="$T" SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR="$T/state" \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      > /tmp/skill-advisor-playbook/cl-011-seed.json 2> /tmp/skill-advisor-playbook/cl-011-seed.stderr
cp "$T/state/route-receipts/"*.json /tmp/skill-advisor-playbook/cl-011-route-receipt.json

printf '%s' '{"prompt":"fix that too","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-011-session"}' \
  | env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_DISABLED -u SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED \
      TMPDIR="$T" SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR="$T/state" \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      > /tmp/skill-advisor-playbook/cl-011-weak-follow-up.json 2> /tmp/skill-advisor-playbook/cl-011-weak-follow-up.stderr
grep -F '"skill":"sk-doc"' "$T/state/route-receipts/"*.json

printf '%s' '{"prompt":"Refactor the session store module to remove duplicated locking code","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-011-session"}' \
  | env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_DISABLED -u SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED \
      TMPDIR="$T" SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR="$T/state" \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      > /tmp/skill-advisor-playbook/cl-011-detailed-task.json 2> /tmp/skill-advisor-playbook/cl-011-detailed-task.stderr

cat /tmp/skill-advisor-playbook/cl-011-seed.json
cat /tmp/skill-advisor-playbook/cl-011-route-receipt.json
cat /tmp/skill-advisor-playbook/cl-011-weak-follow-up.json
cat /tmp/skill-advisor-playbook/cl-011-detailed-task.json
grep -F '"skill":"sk-doc"' /tmp/skill-advisor-playbook/cl-011-route-receipt.json
grep -F 'Advisor: prompt skipped.' /tmp/skill-advisor-playbook/cl-011-weak-follow-up.json
grep -F 'use sk-code' /tmp/skill-advisor-playbook/cl-011-detailed-task.json
rm -rf "$T"
```

### Exact Prompt Table

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CL-011 | Weak follow-up route-receipt guard | Confirm a current `sk-doc` receipt suppresses a conflicting weak follow-up while detailed new work still receives its route | `Start a Claude hook session with the README task, follow it with “fix that too”, then send a detailed session-store refactor task.` | Commands 1 to 2 above | Seed receipt has `skill: "sk-doc"`; weak turn says `Advisor: prompt skipped.`; detailed turn contains `use sk-code` | The four JSON files, three stderr files and terminal transcript under `/tmp/skill-advisor-playbook/` | PASS if all three signals match. FAIL if the receipt is absent, the weak turn routes elsewhere or the detailed task is suppressed | See Failure Triage |

### Expected

- The seed response contains an `Advisor:` brief using `sk-doc`, and the route-receipt file records `"skill":"sk-doc"` for `cl-011-session`.
- The `fix that too` response contains `Advisor: prompt skipped.` while the same receipt remains current.
- The detailed refactor response contains `use sk-code`, because it names its own work instead of relying on the earlier turn.
- Read the freshness and confidence values, but do not assert them beyond the receipt and route behavior.

### Evidence

Keep the three JSON responses, their stderr files, the copied route-receipt JSON and terminal transcript in `/tmp/skill-advisor-playbook/`.

### Pass / Fail

- **Pass**: the seed writes the `sk-doc` receipt, the weak follow-up is skipped and the detailed task routes to `sk-code`.
- **Fail**: no current receipt is written, the weak follow-up delivers a conflicting route or the detailed task is suppressed.
- **Skip**: the advisor is unavailable or degraded before the seed turn can write a valid route receipt. Record the blocking status and diagnostic.

### Failure Triage

1. No receipt is written: confirm both hook disable flags are unset, directive-lifecycle tracking is enabled and the same state directory is used for all turns.
2. The weak follow-up delivers a route: inspect the receipt session id, lifecycle clock, top recommendation's confidence-floor state and `isWeakFollowUp` decision.
3. The detailed task is suppressed: confirm the prompt reaches the hook unchanged and inspect the follow-up guard's work-intent and weak-follow-up checks.
4. Any hook response is an outage: rebuild the advisor runtime and check advisor status before repeating the scenario.

---

## 4. SOURCE FILES

- Feature [`weak-follow-up-route-receipt-guard.md`](../../feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md).
- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: cli-hooks-and-plugin/weak-follow-up-route-receipt-guard.md
