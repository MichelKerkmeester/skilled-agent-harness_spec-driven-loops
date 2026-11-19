---
title: "SC-006 Pasted Reply Stripping"
description: "Manual validation that the scorer removes an attributed pasted reply before it scores the task that follows."
trigger_phrases:
  - "sc-006"
  - "pasted reply stripping"
  - "pasted assistant reply"
  - "task marker stripping"
version: 1.0.0.0
id: SC-006
category: scorer_fusion
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/scoring/advisor-scorer.md
---

# SC-006 Pasted Reply Stripping

Prompt: Compare the advisor route for a task alone and after an attributed pasted reply.

---

## 1. OVERVIEW

The scorer removes a recognized earlier reply before it scores the task after the last `Now:` or `Task:` marker. Skill names in the pasted reply therefore do not steer the route for the current task.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the pasted-reply form and the task-only form return the same top recommendation.
- Real user request: `Refactor the session store module to remove duplicated locking code.`
- Prompt: `Compare the advisor route for that task alone and after an earlier reply that names sk-doc and sk-git.`
- Preconditions: Run from the repository root with the advisor runtime built and `jq` available. `advisor_recommend` must return a recommendation for the task-only prompt.
- Expected execution process: Run the same task with and without its attributed reply, then compare the top recommendation.
- Expected signals: Both outputs return the same top recommendation. The earlier `sk-doc` and `sk-git` names do not change the route.
- Desired user-visible outcome: The advisor routes the task the user asked for, even when the prompt begins with a pasted reply about a different task.

---

## 3. TEST EXECUTION

### Prompt

- Pasted form: `Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code`
- Task-only control: `Refactor the session store module to remove duplicated locking code`

### Commands

1. Build the advisor runtime.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

2. Request the route for the pasted form.

```bash
mkdir -p /tmp/skill-advisor-playbook
node .skilled/bin/skill-advisor.cjs advisor_recommend \
  --prompt "Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code" \
  --options '{"topK":3}' --format json \
  > /tmp/skill-advisor-playbook/sc-006-pasted.json
cat /tmp/skill-advisor-playbook/sc-006-pasted.json
```

3. Request the route for the task-only control.

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend \
  --prompt "Refactor the session store module to remove duplicated locking code" \
  --options '{"topK":3}' --format json \
  > /tmp/skill-advisor-playbook/sc-006-clean.json
cat /tmp/skill-advisor-playbook/sc-006-clean.json
```

4. Compare the top recommendation from both outputs.

```bash
PASTED=$(jq -r '.data.recommendations[0].skillId // empty' /tmp/skill-advisor-playbook/sc-006-pasted.json)
CLEAN=$(jq -r '.data.recommendations[0].skillId // empty' /tmp/skill-advisor-playbook/sc-006-clean.json)
printf "pasted: %s\nclean: %s\n" "$PASTED" "$CLEAN"
test -n "$PASTED" && test "$CLEAN" = "$PASTED"
```

### Expected Signals

- Both commands return `status: "ok"` with a non-empty recommendations array.
- The top `skillId` is the same for both prompts.
- Confidence, uncertainty and freshness may change with the advisor state, so compare the route rather than those values.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Pasted form returns no recommendation | `data.recommendations` is empty | Check the runtime build and advisor status before comparing routes. |
| Pasted reply changes the top route | The pasted and task-only `skillId` values differ | Confirm the attribution header and final task marker match the prompt-policy cases, then inspect `stripLeadingPastedReply`. |
| Task-only prompt returns no route | The control output has no recommendation | Check the advisor status before comparing routes. |

### Evidence

Keep both JSON outputs and the printed top-route comparison under `/tmp/skill-advisor-playbook/`.

### Pass/Fail

- **Pass**: both commands return recommendations and their top `skillId` values match.
- **Fail**: the pasted reply changes the top route or either command returns no recommendation.

---

## 4. SOURCE FILES

- Feature [`pasted-reply-stripping.md`](../../feature-catalog/scorer-fusion/pasted-reply-stripping.md).
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: scorer-fusion/pasted-reply-stripping.md
