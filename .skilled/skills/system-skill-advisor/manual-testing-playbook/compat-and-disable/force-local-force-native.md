---
title: "CP-002 Force Local And Force Native Toggles"
description: "Manual validation for Python shim native/local routing controls."
trigger_phrases:
  - "cp-002"
  - "force local and force native toggles"
  - "force local"
  - "force"
version: 0.8.1.0
id: CP-002
category: compat_and_disable
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# CP-002 Force Local And Force Native Toggles

Prompt: Manual validation for Python shim native/local routing controls.


---

## 1. OVERVIEW

Validate `--force-local` and `--force-native` behavior in the compatibility shim.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Python 3 is available.
- Advisor runtime build is current.

---

## 3. TEST EXECUTION

### Commands

1. Force local:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "help me commit my changes"
```

2. Force native:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-native "help me commit my changes"
```

3. Invalid combination:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local --force-native "help me commit my changes"
```

### Expected Signals

- `--force-local` returns legacy Python scorer output and does not require native availability.
- `--force-native` returns `source: "native"` or exits nonzero with a prompt-safe native-unavailable error.
- Combined flags exit with code `2` and a JSON error.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| `--force-local` delegates native | Output has `source: "native"` | Check `FORCE_LOCAL_ENV` and CLI flag handling. |
| `--force-native` silently falls back | Output has Python-only reason with exit `0` | Block release. |
| Combined flags accepted | Exit code is `0` | Block release. Parser guard regressed. |

### Evidence

- Capture the output and exit status for each of the three commands.
- Record whether force-local returns legacy Python scorer output without native availability.
- Record whether force-native returns source native or exits nonzero with a prompt-safe native-unavailable error.
- Record whether the combined flags exit with code 2 and return a JSON error.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any signal differs.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: compat-and-disable/force-local-force-native.md
