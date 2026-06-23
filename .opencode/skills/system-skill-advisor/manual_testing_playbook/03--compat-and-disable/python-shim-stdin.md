---
title: "CP-001 Python Shim --stdin Mode"
description: "Manual validation for the pre-027 Python shim stdin regression path."
trigger_phrases:
  - "cp-001"
  - "python shim --stdin mode"
  - "python shim"
  - "python"
version: 0.8.0.13
---

# CP-001 Python Shim --stdin Mode

<!-- sk-doc-template: manual_testing_playbook -->

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

1. Run:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --threshold 0.8
```

2. Repeat with native required:

```bash
printf '%s' "save this conversation context to memory" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin --force-native --threshold 0.8
```

### Expected Signals

- Output is a JSON array.
- Native path entries include `source: "native"` when native is available.
- Top skill for the prompt is `system-spec-kit`.
- Prompt text is not echoed into metadata fields.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Empty stdin ignored | Result routes argv or errors unexpectedly | Check stdin mode parser. |
| Native required fails | JSON error says native unavailable | Run `advisor_status`. If unavailable, record environment blocker. |
| Prompt leak | Prompt literal appears outside expected command transcript | Block release. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/shim.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 03--compat-and-disable/python-shim-stdin.md
