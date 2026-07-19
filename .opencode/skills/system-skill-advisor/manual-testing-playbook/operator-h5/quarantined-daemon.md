---
title: "OP-002 Quarantined Daemon"
description: "H5 operator playbook for malformed SKILL.md quarantine detection, repair and revert."
trigger_phrases:
  - "op-002"
  - "quarantined daemon"
  - "quarantined"
version: 0.8.0.12
id: OP-002
category: operator_h5
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/runtime/freshness-contract.md
---

# OP-002 Quarantined Daemon

Prompt: H5 operator playbook for malformed SKILL.md quarantine detection, repair and revert.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the quarantine path for malformed skill metadata without damaging the live repo.

---

## 2. SCENARIO CONTRACT

- Run in a temporary copy of the repository.
- The daemon watcher is active for that copy.
- The operator can restore the copied malformed file.

---

## 3. TEST EXECUTION

1. Copy repo to a temporary workspace.
2. Introduce a malformed `SKILL.md` frontmatter in the temporary copy only.
3. Wait for the watcher debounce window.
4. Detect:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

5. Inspect quarantine table or daemon logs for the offending skill path.
6. Fix or revert the malformed temporary file.
7. Re-run status and confirm quarantine count returns to zero.

### Expected Signals

- Daemon state reports quarantined behavior or explicit malformed-source diagnostics.
- The offending file path is discoverable.
- Reverting the malformed temporary file clears quarantine after re-scan.
- Live repository files remain untouched.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Live repo modified | `git status --short` in real repo shows the malformed change | Restore immediately and mark scenario failed. |
| Quarantine not visible | Malformed file exists but status remains live without diagnostics | Inspect watcher scope and quarantine DB. |
| Quarantine never clears | Repaired file still reported | Run scan, inspect parse error, then restart daemon if needed. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/schemas/daemon-status.ts`

---

## 5. SOURCE METADATA

- Group: Operator H5
- Playbook ID: OP-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: operator-h5/quarantined-daemon.md

---

## 6. EVIDENCE

- Scenario file read in full: `Read` returned `(End of file - total 75 lines)`.
- The file contains no explicit `Preconditions` heading, no explicit `Commands` heading, no existing `Evidence` heading, and no existing `Pass/Fail` heading in lines 1-75.
- Required execution steps observed in the file:

````text
33: 1. Copy repo to a temporary workspace.
34: 2. Introduce a malformed `SKILL.md` frontmatter in the temporary copy only.
35: 3. Wait for the watcher debounce window.
36: 4. Detect:
37: 
38: ```text
39: advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
40: ```
41: 
42: 5. Inspect quarantine table or daemon logs for the offending skill path.
43: 6. Fix or revert the malformed temporary file.
44: 7. Re-run status and confirm quarantine count returns to zero.
````

- Execution was blocked before creating the temporary workspace because the operator instruction for this run says:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
```

- The scenario's own execution step 1 requires creating a temporary workspace, and steps 2 and 6 require modifying a copied `SKILL.md`; those writes are outside the only allowed write path:

```text
.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/quarantined-daemon.md (this file only)
```

## 7. PASS/FAIL

BLOCKED - The scenario requires creating and modifying a temporary repository copy, but this run permits writes only to this scenario file.
