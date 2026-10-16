---
title: "DOC-386 -- Doctor routing environment variables prompt"
description: "Manual scenario validating that a plain environment-variables prompt surfaces the runnable /doctor:env list line as the advisor's top recommendation."
version: 1.0.0.1
id: doctor-commands-doctor-routing-env-prompt
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-386 -- Doctor routing environment variables prompt

## 1. OVERVIEW

This scenario validates that a plain question about environment variables surfaces the runnable `/doctor:env list` line as the advisor's top pick.

The runnable form names `list` because `/doctor:env` with no selector stops at a menu. The scenario runs the advisor brief and the advisor recommend command against the same prompt. Both surfaces must point at the environment command by its runnable name.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the advisor brief shows the runnable `/doctor:env list` line for a plain environment-variables prompt and that the recommend command ranks `command-doctor-env` first.
- Playbook ID: DOC-386.
- Real user request: `check my environment variables`
- Prompt: `check my environment variables`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`).
- Expected execution process: Record the repository state. Run the hook command for the environment-variables prompt and read the advisor brief. Run the recommend command for the same prompt and read the first recommendation. Record the repository state again.
- Expected signals: The first line of the brief matches `^Advisor: (live|stale); use /doctor:env list [0-9.]+/[0-9.]+ pass\.$`. The freshness word is `live` or `stale` and the two numbers vary. The brief shows `/doctor:env list`, not `/doctor:env` alone. The recommend JSON has `data.recommendations[0].skillId` equal to `command-doctor-env`. Both `git status --porcelain` runs print the same output.
- Desired user-visible outcome: A plain environment-variables prompt routes to the runnable `/doctor:env list` line, so the operator can act on the advisor's top pick without landing on the selection menu.
- Pass/fail: PASS if the first line of the brief matches the route pattern, the recommend list ranks `command-doctor-env` first, and `git status --porcelain` is unchanged.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
check my environment variables
```

### Commands

Run every command from the repository root.

1. Record the repository state with `git status --porcelain`.

2. Run the hook command exactly as written. The prompt is `check my environment variables` and the session id is `pb-doc-386`.

```bash
printf '{"prompt":"check my environment variables","session_id":"pb-doc-386","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
```

3. Confirm the first line of the brief matches `^Advisor: (live|stale); use /doctor:env list [0-9.]+/[0-9.]+ pass\.$` and that the brief shows `/doctor:env list`, not `/doctor:env` alone.

4. Run the recommend command exactly as written.

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check my environment variables"}' --format json
```

5. Confirm `data.recommendations[0].skillId` is `command-doctor-env`.

6. Run `git status --porcelain` again and confirm it matches the output recorded in step 1.

### Expected

The hook command prints the advisor brief. Its first line matches `^Advisor: (live|stale); use /doctor:env list [0-9.]+/[0-9.]+ pass\.$`. The freshness word is `live` or `stale` and the two numbers vary. The rest of the brief holds the `Directives:` line and the comment hygiene directive. The brief shows `/doctor:env list`, not `/doctor:env` alone.

The recommend command prints JSON. `data.recommendations` is an ordered list and `data.recommendations[0].skillId` is `command-doctor-env`.

Both `git status --porcelain` runs print the same output, because the scenario only reads.

### Evidence

- The full brief and its first line.
- The recommend JSON and the first recommendation skill id.
- Both `git status --porcelain` outputs.

### Pass / Fail

- **Pass**: All three checks hold. The first line of the brief matches the route pattern with `/doctor:env list`. `data.recommendations[0].skillId` is `command-doctor-env`. Both `git status --porcelain` runs print the same output.
- **Fail**: Any check differs, or the brief shows `/doctor:env` without `list`.

### Failure Triage

If the line shows `/doctor:env` alone, check the `runnable: /doctor:env list` field of the `/doctor:env` standalone entry in `.skilled/commands/doctor/_routes.yaml` and rerun the deriver check. If nothing comes back, check that `command-doctor-env` is listed in `scoring-compatibility.json`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Command entrypoint: [.skilled/commands/doctor/env.md](../../../../commands/doctor/env.md)
- Brief renderer: [.skilled/skills/system-skill-advisor/runtime/lib/render.ts](../../../../skills/system-skill-advisor/runtime/lib/render.ts)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-386
- Feature name: Doctor routing environment variables prompt
- Command mode: advisor brief for a plain prompt (no doctor command is run)
- Mutation boundary: read-only.
- Feature file path: `doctor-commands/doctor-routing-env-prompt.md`
