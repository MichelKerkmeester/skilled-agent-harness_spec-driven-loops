---
title: "DOC-406 -- Doctor routing hands a reworded problem to /doctor:helper"
description: "Manual scenario validating that a doctor problem worded unlike any bridge phrase reaches /doctor:helper, and that an ordinary request sharing doctor words gets no doctor line."
version: 1.0.0.0
id: doctor-commands-doctor-routing-helper-handoff
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-406 -- Doctor routing hands a reworded problem to /doctor:helper

## 1. OVERVIEW

This scenario validates the advisor's hand-off to `/doctor:helper`. A doctor bridge passes only on its own phrases, so a doctor problem in other words used to reach no doctor command. When no bridge passes, the scorer now asks `/doctor:helper`'s own ranker whether the prompt describes a doctor problem. If the ranker says yes, the brief offers `/doctor:helper`, and the helper then names the command.

The scenario runs three prompts:

- **A doctor problem that no skill matches.** The brief's first line names `/doctor:helper`.
- **A doctor problem beside a passing skill.** The skill stays first and `/doctor:helper` is the second line.
- **An ordinary request that shares doctor words.** It gets no doctor line at all.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that a reworded doctor problem reaches `/doctor:helper`, as the top line when no skill matches and as the second line beside a passing skill, and that an ordinary deep-loop request gets no doctor line.
- Playbook ID: DOC-406.
- Real user request: `my AGENTS.md is out of date with the template`
- Prompts: `my AGENTS.md is out of date with the template`, `my deep research run never converges` and `Use the deep-research workflow, not a manual loop, to investigate routing drift.`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`).
- Expected execution process: Run the hook command once per prompt from the repository root and read the first two lines of each brief.
- Expected signals:
  - The first brief starts `Advisor: live; use /doctor:helper`.
  - The second brief starts `Advisor: live; use system-deep-loop`, and its second line is exactly `Also: /doctor:helper`.
  - The third brief starts `Advisor: live; use system-deep-loop`, and `/doctor:` appears nowhere in it.
- Desired user-visible outcome: A doctor problem in the operator's own words points to `/doctor:helper`, and an ordinary request gets no doctor line.
- Pass/fail: PASS if all three briefs match. FAIL if the first brief names no doctor command, the second has no `Also: /doctor:helper` line, or the third prints any `/doctor:` text.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompts

```
my AGENTS.md is out of date with the template
my deep research run never converges
Use the deep-research workflow, not a manual loop, to investigate routing drift.
```

### Commands

1. From the repository root, run the UserPromptSubmit hook once per prompt, with the session ids `pb-doc-406a`, `pb-doc-406b` and `pb-doc-406c`:

```bash
for pair in "pb-doc-406a|my AGENTS.md is out of date with the template" "pb-doc-406b|my deep research run never converges" "pb-doc-406c|Use the deep-research workflow, not a manual loop, to investigate routing drift."; do
  id="${pair%%|*}"; prompt="${pair#*|}"
  echo "== $id"
  printf '{"prompt":"%s","session_id":"%s","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$prompt" "$id" "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
done
```

2. Read the exit status and each brief. Check the first two lines of each against the expected text, and search the third brief for `/doctor:`.

### Expected

Each hook run prints a brief and exits 0. The scores in the first line vary with the checkout, so only the text before the scores is compared.

- `pb-doc-406a` starts `Advisor: live; use /doctor:helper`, because no skill matches and the helper's ranker reads the prompt as an `/doctor:agents-md` problem.
- `pb-doc-406b` starts `Advisor: live; use system-deep-loop` and its second line is exactly `Also: /doctor:helper`. "Never converges" names a wrong state, so the hand-off shows beside the passing skill.
- `pb-doc-406c` starts `Advisor: live; use system-deep-loop` and prints no `/doctor:` text. "Drift" is a bare problem word, which does not count beside a passing skill.

### Evidence

- The three hook outputs and their exit statuses.
- The first two lines of each brief, copied exactly.
- The result of a search of the third brief for `/doctor:`.

### Pass / Fail

- **Pass**: The first brief names `/doctor:helper` on its first line, the second brief keeps `system-deep-loop` first with `Also: /doctor:helper` on the second line, and the third brief keeps `system-deep-loop` first with no `/doctor:` text.
- **Fail**: The first brief names no doctor command, the second brief has no `Also: /doctor:helper` line, or the third brief prints a doctor line.

### Failure Triage

If the first or second brief has no `/doctor:helper`, run `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=1 -- "<prompt>"`. A score under 6 means the helper's ranker no longer reads the prompt as a doctor problem. If the third brief prints a doctor line, check the strong cue list in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts`, because a bare problem word must not count beside a passing skill.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md)
- Hand-off module: [.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts](../../skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts)
- Helper ranker: [.skilled/commands/doctor/scripts/doctor-helper-match.cjs](../../commands/doctor/scripts/doctor-helper-match.cjs)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-406
- Feature name: Doctor routing hands a reworded problem to /doctor:helper
- Command mode: advisor hook brief (no doctor command is run)
- Mutation boundary: read-only
- Feature file path: `doctor-commands/doctor-routing-helper-handoff.md`

Provenance: manual only - advisor hook brief (no doctor command is run)
