---
title: "DOC-385 -- Doctor routing setup onboarding prompt"
description: "Manual scenario validating that a plain onboarding prompt with no skill match surfaces the runnable /doctor:setup line as the advisor's top recommendation."
version: 1.0.0.0
id: doctor-commands-doctor-routing-setup-onboarding
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-385 -- Doctor routing setup onboarding prompt

## 1. OVERVIEW

This scenario validates that a plain onboarding prompt with no skill match surfaces the runnable `/doctor:setup` line as the advisor's top pick. Before this feature the advisor returned nothing for it.

The scenario runs the advisor brief and the advisor recommend command against the same prompt. Both surfaces must point at the setup command by its runnable name, and the brief must not show a raw `command-doctor-` id.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the advisor brief shows the runnable `/doctor:setup` line for a plain onboarding prompt and that the recommend command ranks `command-doctor-setup` first, with no raw `command-doctor-` id in the brief.
- Playbook ID: DOC-385.
- Real user request: `Help me set up skilled`
- Prompt: `Help me set up skilled`
- Preconditions: The advisor runtime is built and the bridge projection is fresh. From the repository root, `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0 and `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`.
- Expected execution process: Record the repository state. Run the hook command for the onboarding prompt and read the advisor brief. Run the recommend command for the same prompt and read the first recommendation. Record the repository state again.
- Expected signals: The first line of the brief matches `^Advisor: (live|stale); use /doctor:setup [0-9.]+/[0-9.]+ pass\.$`. The freshness word is `live` or `stale` and the two numbers vary. The brief output never contains `command-doctor-`. The recommend JSON has `data.recommendations[0].skillId` equal to `command-doctor-setup`. Both `git status --porcelain` runs print the same output.
- Desired user-visible outcome: A plain onboarding prompt routes to the runnable `/doctor:setup` line, so the operator can act on the advisor's top pick without seeing a raw command id.
- Pass/fail: PASS if the first line of the brief matches the route pattern, the recommend list ranks `command-doctor-setup` first, the brief shows no raw `command-doctor-` id, and `git status --porcelain` is unchanged.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Help me set up skilled
```

### Commands

Run every command from the repository root.

1. Record the repository state with `git status --porcelain`.

2. Run the hook command exactly as written. The prompt is `Help me set up skilled` and the session id is `pb-doc-385`.

```bash
printf '{"prompt":"Help me set up skilled","session_id":"pb-doc-385","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
```

3. Confirm the first line of the brief matches `^Advisor: (live|stale); use /doctor:setup [0-9.]+/[0-9.]+ pass\.$` and that the brief never contains `command-doctor-`.

4. Run the recommend command exactly as written.

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Help me set up skilled"}' --format json
```

5. Confirm `data.recommendations[0].skillId` is `command-doctor-setup`.

6. Run `git status --porcelain` again and confirm it matches the output recorded in step 1.

### Expected

The hook command prints the advisor brief. Its first line matches `^Advisor: (live|stale); use /doctor:setup [0-9.]+/[0-9.]+ pass\.$`. The freshness word is `live` or `stale` and the two numbers vary. The rest of the brief holds the `Directives:` line and the comment hygiene directive. The brief never contains `command-doctor-`.

The recommend command prints JSON. `data.recommendations` is an ordered list and `data.recommendations[0].skillId` is `command-doctor-setup`.

Both `git status --porcelain` runs print the same output, because the scenario only reads.

### Evidence

- The full brief and its first line.
- The recommend JSON and the first recommendation skill id.
- Both `git status --porcelain` outputs.

### Pass / Fail

- **Pass**: All three checks hold. The first line of the brief matches the route pattern and the brief shows no raw `command-doctor-` id. `data.recommendations[0].skillId` is `command-doctor-setup`. Both `git status --porcelain` runs print the same output.
- **Fail**: Any check differs, or the brief shows a raw `command-doctor-` id.

### Failure Triage

If no recommendation comes back, check that `command-doctor-setup` is listed in `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` and that the deriver check prints `"status": "fresh"`. If the brief shows a raw id, inspect the generated doctor lookup in `runtime/lib/render.ts`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Command entrypoint: [.skilled/commands/doctor/setup.md](../../../../commands/doctor/setup.md)
- Bridge deriver: [.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs](../../../../skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs)
- Brief renderer: [.skilled/skills/system-skill-advisor/runtime/lib/render.ts](../../../../skills/system-skill-advisor/runtime/lib/render.ts)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-385
- Feature name: Doctor routing setup onboarding prompt
- Command mode: advisor brief for a plain prompt (no doctor command is run)
- Mutation boundary: read-only.
- Feature file path: `doctor-commands/doctor-routing-setup-onboarding.md`
