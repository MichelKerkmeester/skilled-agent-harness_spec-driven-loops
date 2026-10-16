---
title: "DOC-389 -- Doctor routing setup hint on a no-match"
description: "Manual scenario validating that a no-match advisor brief for a prompt with setup wording adds the /doctor:setup hint line and leaves the directive block unchanged."
version: 1.0.2.0
id: doctor-commands-doctor-routing-setup-hint
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-389 -- Doctor routing setup hint on a no-match

## 1. OVERVIEW

This scenario validates the advisor fallback hint for setup wording. When no skill matches, the fallback adds one sentence naming `/doctor:setup` for prompts that use set up, set-up or setup wording, install or reinstall wording including installation and installer, configure or configuration wording or `check` followed within three words by environment, env, config, hooks, tools, tooling, toolchain or skilled.

The hint sits above the directive block. The directive block below it is unchanged, and the scenario checks the first three lines of the brief.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that a no-match brief for a prompt with install wording prints the setup hint line, then the `Directives:` label, then the comment hygiene directive.
- Playbook ID: DOC-389.
- Real user request: `install the frobnicator widget`
- Prompt: `install the frobnicator widget`
- Preconditions: The advisor runtime is built and the bridge projection is fresh. From the repository root, `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0 and `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`.
- Expected execution process: Run the hook command once with the install-wording prompt and the recorded session id, then read the first three lines of the brief.
- Expected signals: The first line is exactly `Advisor: no skill matched. For setup or health checks, run /doctor:setup.`. The second line is exactly `Directives:`. The third line starts with `- Comment hygiene [HARD BLOCK]:`.
- Desired user-visible outcome: A no-match brief that names the runnable `/doctor:setup` line for setup wording, with the directive block unchanged.
- Pass/fail: PASS if all three lines match. FAIL if the hint is missing, worded differently, or the directive block changed.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
install the frobnicator widget
```

### Commands

Run every command from the repository root.

1. Run the hook command exactly as written. The prompt is `install the frobnicator widget` and the session id is `pb-doc-389`.

```bash
printf '{"prompt":"install the frobnicator widget","session_id":"pb-doc-389","hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
```

2. Confirm the first line is exactly `Advisor: no skill matched. For setup or health checks, run /doctor:setup.`, the second line is exactly `Directives:`, and the third line starts with `- Comment hygiene [HARD BLOCK]:`. Then confirm the brief has exactly three lines, the same count an unrelated no-match prompt prints in DOC-390, so the hint adds no line to the directive block.

### Expected

The hook command prints the advisor brief. The first line is exactly `Advisor: no skill matched. For setup or health checks, run /doctor:setup.`. The second line is exactly `Directives:`. The third line starts with `- Comment hygiene [HARD BLOCK]:` and the brief has exactly three lines, so the hint leaves the directive block as it is.

### Evidence

- The full advisor brief from the hook command.
- The first three lines of the brief.
- The line count of the brief.

### Pass / Fail

- **Pass**: All three lines match. The first line is exactly `Advisor: no skill matched. For setup or health checks, run /doctor:setup.`, the second line is exactly `Directives:`, and the third line starts with `- Comment hygiene [HARD BLOCK]:`. The brief has exactly three lines.
- **Fail**: The hint is missing, worded differently, or the directive block changed.

### Failure Triage

If the hint is missing, check `SETUP_WORDING` and the `setupWording` render option in `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, then `SETUP_HINT` in `runtime/lib/render.ts`, and rebuild the runtime. If a skill matched instead, record the brief and pick a prompt with install wording and no skill vocabulary.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)
- Hook entrypoint: [.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts](../../../../skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts)
- Brief renderer: [.skilled/skills/system-skill-advisor/runtime/lib/render.ts](../../../../skills/system-skill-advisor/runtime/lib/render.ts)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-389
- Feature name: Doctor routing setup hint on a no-match
- Command mode: advisor fallback text (no doctor command is run).
- Mutation boundary: read-only.
- Feature file path: `doctor-commands/doctor-routing-setup-hint.md`
