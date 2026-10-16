---
title: "DOC-388 -- Doctor routing typed command in the Python fallback"
description: "Manual scenario validating that the Python fallback scorer ranks a doctor bridge first only for the typed `/doctor:git setup` command and surfaces no doctor bridge for the plain git hooks wording."
version: 1.0.0.1
id: doctor-commands-doctor-routing-python-typed-command
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-388 -- Doctor routing typed command in the Python fallback

## 1. OVERVIEW

This scenario validates the Python fallback scorer for the typed doctor command `/doctor:git setup`. The Python scorer matches a doctor bridge only on a typed slash command, by design. The typed command ranks the doctor bridge first. The plain git hooks wording surfaces no doctor bridge in Python.

The scenario runs the Python fallback scorer three times. Steps 1 and 3 force the local scorer with `--force-local`. Step 5 uses the native advisor when the daemon answers. Each run prints a JSON array of objects with `skill` and `kind`.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that the Python fallback scorer ranks `command-doctor-git-setup` first for the typed command, surfaces no doctor bridge for the plain git hooks wording, and keeps `sk-git` above any doctor bridge in the native advisor path.
- Playbook ID: DOC-388.
- Real user request: `/doctor:git setup`
- Prompt: `/doctor:git setup`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`).
- Expected execution process: Run the forced-local scorer for the typed command and read the first element. Run the forced-local scorer for the plain git hooks wording and read the whole array. Run the scorer without a flag for the same wording and read the element order.
- Expected signals: In step 1, the first element has `"skill": "command-doctor-git-setup"` and `"kind": "command"`. In step 3, no element has a `skill` that starts with `command-doctor-`, and the first element is `sk-git`. In step 5, when any element has a `skill` that starts with `command-doctor-`, the `sk-git` element comes before every doctor element. All three commands exit 0 and print a JSON array on stdout.
- Desired user-visible outcome: A typed doctor command routes to its doctor bridge in the Python fallback, and plain wording does not, so the operator can trust the fallback scorer to require a typed command.
- Pass/fail: PASS if the step 1 first element is the doctor bridge with `kind` `command`, step 3 holds no `command-doctor-` element and starts with `sk-git`, and step 5 keeps `sk-git` before any `command-doctor-` element.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
/doctor:git setup
```

### Commands

Run every command from the repository root.

1. Run the forced-local scorer for the typed command exactly as written.

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "/doctor:git setup"
```

2. Confirm the first element of the array has `"skill": "command-doctor-git-setup"` and `"kind": "command"`.

3. Run the forced-local scorer for the plain git hooks wording exactly as written.

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --force-local "check my git hooks setup"
```

4. Confirm no element has a `skill` that starts with `command-doctor-` and the first element is `sk-git`.

5. Run the scorer for the same wording with no flag exactly as written. No flag means the run uses the native advisor when the daemon answers and the local scorer otherwise.

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "check my git hooks setup"
```

6. Confirm that when any element has a `skill` that starts with `command-doctor-`, the `sk-git` element comes before every doctor element.

### Expected

The step 1 run prints a JSON array on stdout. Its first element carries `"skill": "command-doctor-git-setup"` and `"kind": "command"`.

The step 3 run prints a JSON array on stdout. No element carries a `skill` that starts with `command-doctor-`. Its first element is `sk-git`.

The step 5 run prints a JSON array on stdout. When the array carries a `command-doctor-` element, the `sk-git` element comes before it. When the native advisor is unavailable, the run falls back to the local scorer and the array carries no doctor bridge, so the ordering rule holds with no doctor element to order.

All three commands exit 0.

### Evidence

- The step 1 JSON array, with its first element.
- The step 3 JSON array.
- The step 5 JSON array, with the index of `sk-git` and the index of any `command-doctor-` element.

### Pass / Fail

- **Pass**: All three checks hold. The step 1 first element is `command-doctor-git-setup` with `kind` `command`. The step 3 array holds no `command-doctor-` element and starts with `sk-git`. The step 5 array keeps `sk-git` before any `command-doctor-` element.
- **Fail**: Any check differs. The step 1 first element is not the doctor bridge. The step 3 array holds a `command-doctor-` element. The step 5 array puts a `command-doctor-` element before `sk-git`.

### Failure Triage

If step 1 does not rank the doctor bridge first, check the generated Python block in `runtime/scripts/skill_advisor.py` for `"slash_markers": ["/doctor:git setup"]` and `"routing_enabled": True`. If step 5 puts the doctor bridge first, inspect the sort in `recommend_with_native_advisor` in the same file.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)
- Python fallback scorer: [.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py](../../../../skills/system-skill-advisor/runtime/scripts/skill_advisor.py)
- Bridge projection deriver: [.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs](../../../../skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-388
- Feature name: Doctor routing typed command in the Python fallback
- Command mode: Python fallback scorer
- Mutation boundary: read-only.
- Feature file path: `doctor-commands/doctor-routing-python-typed-command.md`
