---
title: "DOC-406 -- Doctor routing hands a reworded problem to /doctor:helper"
description: "Manual scenario validating that a doctor problem worded unlike any bridge phrase reaches /doctor:helper, and that an ordinary request sharing doctor words gets no doctor line."
version: 1.1.0.0
id: doctor-commands-doctor-routing-helper-handoff
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-406 -- Doctor routing hands a reworded problem to /doctor:helper

## 1. OVERVIEW

This scenario validates the advisor's hand-off to `/doctor:helper`. A doctor bridge passes only on its own phrases, so a doctor problem in other words used to reach no doctor command. When no bridge passes, the scorer offers `/doctor:helper` on one of two paths. A prompt that names a problem goes to the helper's own ranker, and a prompt with a problem cue whose ranker score is high enough gets the hand-off. A prompt that asks for a repair route without naming a problem, with the exact phrase "repair path" or "I have a problem", gets the hand-off through the generic repair cue when no skill passes, even though the ranker finds no match. The helper then names the command.

The scenario runs three prompts:

- **A request for a repair route that no skill or bridge matches.** The brief's first line names `/doctor:helper`.
- **A doctor problem beside a passing skill.** The skill stays first and `/doctor:helper` is the second line.
- **An ordinary request that shares doctor words.** It gets no doctor line at all.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that a request for a repair route reaches `/doctor:helper` through the generic repair cue as the top line when no skill matches, that a reworded doctor problem reaches it through the ranker as the second line beside a passing skill, and that an ordinary deep-loop request gets no doctor line. Prompts that a doctor bridge now catches, such as an out-of-date AGENTS.md or a deep-research run that never converges, route to that bridge and no longer test the hand-off.
- Playbook ID: DOC-406.
- Real user request: `I have a problem and want the right repair path suggested with reasons`
- Prompt: `I have a problem and want the right repair path suggested with reasons`
- All three prompts: `I have a problem and want the right repair path suggested with reasons`, `Code Mode tools aren't showing up in my session` and `Use the deep-research workflow, not a manual loop, to investigate routing drift.`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`).
- Expected execution process: Run the hook command once per prompt from the repository root and read the first two lines of each brief.
- Expected signals:
  - The first brief starts `Advisor: live; use system-skilled-doctor → /doctor:helper (run)`.
  - The second brief starts `Advisor: live; use mcp-code-mode`, and its second line is exactly `Also: /doctor:helper (run)`.
  - The third brief starts `Advisor: live; use system-deep-loop`, and `/doctor:` appears nowhere in it.
- Desired user-visible outcome: A doctor problem in the operator's own words points to `/doctor:helper`, and an ordinary request gets no doctor line.
- Pass/fail: PASS if all three briefs match. FAIL if the first brief does not name `/doctor:helper`, the second has no `Also: /doctor:helper (run)` line, or the third prints any `/doctor:` text.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompts

```
I have a problem and want the right repair path suggested with reasons
Code Mode tools aren't showing up in my session
Use the deep-research workflow, not a manual loop, to investigate routing drift.
```

### Commands

1. From the repository root, run the UserPromptSubmit hook once per prompt, with the session ids `pb-doc-406a`, `pb-doc-406b` and `pb-doc-406c`:

```bash
for pair in "pb-doc-406a|I have a problem and want the right repair path suggested with reasons" "pb-doc-406b|Code Mode tools aren't showing up in my session" "pb-doc-406c|Use the deep-research workflow, not a manual loop, to investigate routing drift."; do
  id="${pair%%|*}"; prompt="${pair#*|}"
  echo "== $id"
  printf '{"prompt":"%s","session_id":"%s","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$prompt" "$id" "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
done
```

2. Read the exit status and each brief. Check the first two lines of each against the expected text, and search the third brief for `/doctor:`.

### Expected

Each hook run prints a brief and exits 0. The scores in the first line vary with the checkout, so only the text before the scores is compared.

- `pb-doc-406a` starts `Advisor: live; use system-skilled-doctor → /doctor:helper (run)`, because no skill or bridge matches and "repair path" is a request for a repair route, which the helper answers by listing every route with its reason.
- `pb-doc-406b` starts `Advisor: live; use mcp-code-mode` and its second line is exactly `Also: /doctor:helper (run)`. "Aren't showing up" names a wrong state and no doctor bridge passes, so the hand-off shows beside the passing skill.
- `pb-doc-406c` starts `Advisor: live; use system-deep-loop` and prints no `/doctor:` text. "Drift" is a bare problem word, which does not count beside a passing skill.

### Evidence

- The three hook outputs and their exit statuses.
- The first two lines of each brief, copied exactly.
- The result of a search of the third brief for `/doctor:`.

### Pass / Fail

- **Pass**: The first brief names `/doctor:helper` on its first line, the second brief keeps `mcp-code-mode` first with `Also: /doctor:helper (run)` on the second line, and the third brief keeps `system-deep-loop` first with no `/doctor:` text.
- **Fail**: The first brief does not name `/doctor:helper`, the second brief has no `Also: /doctor:helper (run)` line, or the third brief prints a doctor line.

### Failure Triage

If the first brief has no `/doctor:helper`, the ranker is not the cause, because it prints `"status": "no_match"` for that prompt. Check `GENERIC_REPAIR_CUE` in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts`, and check that no skill passes for the prompt. If the second brief has no `/doctor:helper`, run `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=1 -- "<prompt>"`. A score under 6 means the helper's ranker no longer reads the prompt as a doctor problem. If the third brief prints a doctor line, check the strong cue list in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts`, because a bare problem word must not count beside a passing skill.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../../system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md)
- Hand-off module: [.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts](../../../system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts)
- Helper ranker: [.skilled/commands/doctor/scripts/doctor-helper-match.cjs](../../../../commands/doctor/scripts/doctor-helper-match.cjs)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-406
- Feature name: Doctor routing hands a reworded problem to /doctor:helper
- Command mode: advisor hook brief (no doctor command is run)
- Mutation boundary: read-only
- Feature file path: `doctor-commands/doctor-routing-helper-handoff.md`

Provenance: manual only - advisor hook brief (no doctor command is run)
