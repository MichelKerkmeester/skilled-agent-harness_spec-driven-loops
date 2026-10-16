---
title: "DOC-390 -- Doctor routing no hint on an unrelated prompt"
description: "Manual scenario validating that an unrelated prompt which matches no skill gets the plain no-match advisor line and no doctor hint."
version: 1.0.0.1
id: doctor-commands-doctor-routing-no-hint-unrelated
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-390 -- Doctor routing no hint on an unrelated prompt

## 1. OVERVIEW

This scenario validates the advisor brief for an unrelated prompt that matches no skill. The brief points to no route and offers no follow-up.

The hook must stay silent about doctor commands here. A no-match prompt is not a routing problem, so it must not advertise `/doctor:`. Unrelated misses carry no extra text.

---

## 2. SCENARIO CONTRACT

- Objective: Prove an unrelated prompt gets the exact no-match line with no doctor hint.
- Playbook ID: DOC-390.
- Real user request: `describe how photosynthesis turns sunlight into sugar in plants`
- Prompt: `describe how photosynthesis turns sunlight into sugar in plants`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`).
- Expected execution process: Run the hook command once from the repository root and read the brief it prints.
- Expected signals: The first line is exactly `Advisor: no skill matched.`. The second line is exactly `Directives:`. The rest of the brief is the comment hygiene directive, and `/doctor:` appears nowhere in the output.
- Desired user-visible outcome: An unrelated prompt gets the plain no-match brief. No doctor hint appears.
- Pass/fail: PASS if both lines match exactly and no `/doctor:` text appears. FAIL if a hint or a doctor line appears.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
describe how photosynthesis turns sunlight into sugar in plants
```

### Commands

1. From the repository root, run the UserPromptSubmit hook with the scenario prompt and the session id `pb-doc-390`:

```bash
printf '{"prompt":"describe how photosynthesis turns sunlight into sugar in plants","session_id":"pb-doc-390","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
```

2. Read the exit status and the output. Check the first two lines against the expected text and search the whole output for `/doctor:`.

### Expected

The command prints the advisor brief and exits 0. The first line is exactly `Advisor: no skill matched.` and the second line is exactly `Directives:`. The third line is the comment hygiene directive. No other line appears.

The no-match line carries no freshness word and no scores, so both lines are checked as exact text. `/doctor:` appears nowhere in the output, so the miss carries no doctor hint.

### Evidence

- The full hook output and its exit status.
- The first two output lines, copied exactly.
- The result of a search of the full output for `/doctor:`.

### Pass / Fail

- **Pass**: The first line is exactly `Advisor: no skill matched.`, the second line is exactly `Directives:`, and `/doctor:` appears nowhere in the output.
- **Fail**: A hint or a doctor line appears, or either expected line differs.

### Failure Triage

If the hint appears, check that `SETUP_WORDING` in `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` does not match the prompt. If a skill matched, record the brief, because the prompt no longer reaches the no-match path.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)
- Hook entrypoint: [.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts](../../../../skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts)
- Brief rendering: [.skilled/skills/system-skill-advisor/runtime/lib/render.ts](../../../../skills/system-skill-advisor/runtime/lib/render.ts)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-390
- Feature name: Doctor routing no hint on an unrelated prompt
- Command mode: advisor fallback text (no doctor command is run)
- Mutation boundary: read-only
- Feature file path: `doctor-commands/doctor-routing-no-hint-unrelated.md`
