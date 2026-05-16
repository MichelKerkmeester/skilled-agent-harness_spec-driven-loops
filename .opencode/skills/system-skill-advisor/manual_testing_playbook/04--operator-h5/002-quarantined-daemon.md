---
title: "OP-002 Quarantined Daemon"
description: "H5 operator playbook for malformed SKILL.md quarantine detection, repair and revert."
trigger_phrases:
  - "op-002"
  - "quarantined daemon"
  - "quarantined"
---

# OP-002 Quarantined Daemon

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate the quarantine path for malformed skill metadata without damaging the live repo.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Run in a temporary copy of the repository.
- The daemon watcher is active for that copy.
- The operator can restore the copied malformed file.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
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

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/daemon-status.ts`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Operator H5
- Playbook ID: OP-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 04--operator-h5/002-quarantined-daemon.md

<!-- /ANCHOR:5-source-metadata -->
