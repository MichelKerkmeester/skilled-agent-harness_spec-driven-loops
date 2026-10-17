---
title: "CP-001 Python Shim --stdin Mode"
description: "Manual validation for the pre-027 Python shim stdin regression path."
trigger_phrases:
  - "cp-001"
  - "python shim --stdin mode"
  - "python shim"
  - "python"
version: 0.8.1.0
id: CP-001
category: compat_and_disable
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# CP-001 Python Shim --stdin Mode

Prompt: Manual validation for the pre-027 Python shim stdin regression path.


---

## 1. OVERVIEW

Validate that `skill_advisor.py --stdin` reads exactly one prompt from stdin and still routes through native-first compatibility.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Python 3 is available.
- Native build exists. Fallback is acceptable only when native status is unavailable.

---

## 3. TEST EXECUTION

### Commands

1. Run:

```bash
printf '%s' "save this conversation context to memory" | python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Repeat with native required:

```bash
printf '%s' "save this conversation context to memory" | python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --stdin --force-native --threshold 0.8
```

### Expected Signals

- Output is a JSON array.
- Native path entries include `source: "native"` when native is available.
- Top skill for the prompt is `system-spec-kit`.
- Prompt text is not echoed into metadata fields.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Empty stdin ignored | Result routes argv or errors unexpectedly | Check stdin mode parser. |
| Native required fails | JSON error says native unavailable | Run `advisor_status`. If unavailable, record environment blocker. |
| Prompt leak | Prompt literal appears outside expected command transcript | Block release. |

### Evidence

- Capture the output and exit status for each of the two commands.
- Record whether command 1 returns a JSON array.
- When native is available, record whether native path entries report source native.
- Record whether system-spec-kit is the top skill and the prompt text stays out of metadata fields.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any signal differs.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-001
- Canonical root source: manual-testing-playbook.md
- Feature file path: compat-and-disable/python-shim-stdin.md
