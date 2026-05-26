---
title: "CP-002 Force Local And Force Native Toggles"
description: "Manual validation for Python shim native/local routing controls."
trigger_phrases:
  - "cp-002"
  - "force local and force native toggles"
  - "force local"
  - "force"
---

# CP-002 Force Local And Force Native Toggles

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate `--force-local` and `--force-native` behavior in the compatibility shim.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Python 3 is available.
- MCP server build is current.

---

## 3. TEST EXECUTION

1. Force local:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "help me commit my changes"
```

2. Force native:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "help me commit my changes"
```

3. Invalid combination:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local --force-native "help me commit my changes"
```

### Expected Signals

- `--force-local` returns legacy Python scorer output and does not require native availability.
- `--force-native` returns `source: "native"` or exits nonzero with a prompt-safe native-unavailable error.
- Combined flags exit with code `2` and a JSON error.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| `--force-local` delegates native | Output has `source: "native"` | Check `FORCE_LOCAL_ENV` and CLI flag handling. |
| `--force-native` silently falls back | Output has Python-only reason with exit `0` | Block release. |
| Combined flags accepted | Exit code is `0` | Block release. Parser guard regressed. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 03--compat-and-disable/002-force-local-force-native.md
