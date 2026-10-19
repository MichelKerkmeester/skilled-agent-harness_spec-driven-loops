---
title: "DOC-387 -- Doctor routing contested prompt second line"
description: "Manual scenario validating that a contested prompt keeps the skill as the advisor brief's first line and appends the runnable /doctor:git setup line as a second line only when the doctor bridge anchors to the wording."
version: 1.0.1.0
id: doctor-commands-doctor-routing-contested-second-line
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-387 -- Doctor routing contested prompt second line

## 1. OVERVIEW

This scenario validates the contested-prompt rule for the advisor brief. When a skill and a doctor command both fit the prompt, the skill keeps first place and the brief adds the runnable doctor command as a second line.

The second line appears only when the doctor bridge anchors to the wording. A prompt that does not carry the doctor phrase produces no doctor line. This is the operator rule for every contested prompt.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that a contested prompt keeps the skill on the brief's first line, adds the runnable `/doctor:git setup` line as the second line, and shows no doctor line when the wording does not anchor to the doctor bridge.
- Playbook ID: DOC-387.
- Real user request: `check my git hooks setup`
- Prompt: `check my git hooks setup`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`).
- Expected execution process: Run the hook command for the contested prompt and read the brief's first two lines. Run the recommend command for the same prompt and compare the two indexes. Run the hook command for the worktree prompt and confirm no doctor line.
- Expected signals: The step 1 brief starts with two lines. The first line matches `^Advisor: (live|stale); use sk-git [0-9.]+/[0-9.]+ pass\.$`. The freshness word is `live` or `stale` and the two numbers vary. The second line is exactly `Also: /doctor:git setup`. In the step 3 JSON, the index of `sk-git` in `data.recommendations` is lower than the index of `command-doctor-git-setup`, even though the doctor bridge has the higher confidence. The step 5 brief has no line that starts with `Also: /doctor:`.
- Desired user-visible outcome: The operator sees the skill first for a contested prompt and a runnable doctor command on the second line, and no doctor line when the wording does not anchor to the doctor surface.
- Pass/fail: PASS if the first line matches the route pattern, the second line is exactly `Also: /doctor:git setup`, the `sk-git` index is lower than the `command-doctor-git-setup` index, and the step 5 brief shows no doctor line.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
check my git hooks setup
```

### Commands

Run every command from the repository root.

1. Run the hook command exactly as written. The prompt is `check my git hooks setup` and the session id is `pb-doc-387`.

```bash
printf '{"prompt":"check my git hooks setup","session_id":"pb-doc-387","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
```

2. Confirm the first line of the brief matches `^Advisor: (live|stale); use sk-git [0-9.]+/[0-9.]+ pass\.$` and the second line is exactly `Also: /doctor:git setup`.

3. Run the recommend command exactly as written.

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check my git hooks setup"}' --format json
```

4. Confirm the index of `sk-git` in `data.recommendations` is lower than the index of `command-doctor-git-setup`.

5. Run the hook command exactly as written. The prompt is `create a git worktree for my feature` and the session id is `pb-doc-387b`.

```bash
printf '{"prompt":"create a git worktree for my feature","session_id":"pb-doc-387b","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
```

6. Confirm the brief has no line that starts with `Also: /doctor:`.

### Expected

The step 1 hook command prints the advisor brief, which starts with two lines. Its first line matches `^Advisor: (live|stale); use sk-git [0-9.]+/[0-9.]+ pass\.$`. The freshness word is `live` or `stale` and the two numbers vary. Its second line is exactly `Also: /doctor:git setup`. The rest of the brief holds the `Directives:` line and the comment hygiene directive.

The step 3 recommend command prints JSON. `data.recommendations` is an ordered list. The index of `sk-git` is lower than the index of `command-doctor-git-setup`, even though the doctor bridge has the higher confidence.

The step 5 hook command prints the advisor brief for the worktree prompt. No line starts with `Also: /doctor:`, because a doctor bridge surfaces only on its own wording.

### Evidence

- The full step 1 brief, with its first and second lines.
- The step 3 recommend JSON, with both indexes.
- The full step 5 brief.

### Pass / Fail

- **Pass**: All three checks hold. The step 1 first line matches the route pattern. The step 1 second line is exactly `Also: /doctor:git setup`. The `sk-git` index is lower than the `command-doctor-git-setup` index. The step 5 brief shows no doctor line.
- **Fail**: The doctor command is the first line of the step 1 brief, the second line is missing or different, or the step 5 brief shows a doctor line.

### Failure Triage

If the doctor command is the first line of the step 1 brief, inspect `keepPassingSkillsAboveDoctorBridges` in `runtime/lib/scorer/fusion.ts`. If the step 5 brief shows a doctor line, inspect `requireDoctorPhraseAnchor` in the same file.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)
- Scorer fusion: [.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts](../../../../skills/system-skill-advisor/runtime/lib/scorer/fusion.ts)
- Brief renderer: [.skilled/skills/system-skill-advisor/runtime/lib/render.ts](../../../../skills/system-skill-advisor/runtime/lib/render.ts)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-387
- Feature name: Doctor routing contested prompt second line
- Command mode: advisor brief for a contested prompt
- Mutation boundary: read-only.
- Feature file path: `doctor-commands/doctor-routing-contested-second-line.md`
