---
title: Outliner File-Layer Troubleshooting
description: "Failure modes for the Outliner plugin and their fixes: settings not applied, fold blocked, drag and drop inert, zoom inactive, IME skips, legacy values, corrupt data and hotkey gaps."
trigger_phrases:
  - "outliner troubleshooting"
  - "outliner settings not working"
  - "outliner fold disabled"
  - "outliner drag and drop broken"
  - "outliner zoom not working"
  - "outliner hotkey conflict"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Outliner File-Layer Troubleshooting

Each section names a symptom, a likely cause, a check and a fix. Validation checkpoints are named so the mode can prove each repair.

---

## 1. OVERVIEW

This reference diagnoses common Outliner plugin failures at the file and in-app boundaries. It pairs each symptom with a check, a scoped fix, and a validation checkpoint.

---

## 2. FAILURE MODE: SETTINGS NOT APPLIED

Symptom: toggled settings show no behavior change.

Likely cause: Obsidian has not reloaded the plugin, or the file was written with unknown keys.

Check: confirm `data.json` parses and its keys match the schema.

Fix: reload Obsidian or disable and re-enable the plugin, then re-run the validation workflow.

Prevent: re-read `data.json` before every merge and write the smallest scoped diff.

Checkpoint: VALIDATE-SETTINGS passes and the plugin reloads.

---

## 3. FAILURE MODE: FOLD COMMAND BLOCKED

Symptom: fold or unfold shows a notice that folding is disabled.

Likely cause: the core editor setting "Fold indent" is off.

Check: ask the user to confirm the core setting state (VERIFY in-app).

Fix: enable the Obsidian editor setting "Fold indent". No file-layer change can fix this.

Prevent: check the core setting before recommending fold-based workflows.

Checkpoint: the core setting is on and the fold notice disappears.

---

## 4. FAILURE MODE: DRAG AND DROP INERT

Symptom: list items do not drag.

Likely cause: `dnd` is false in `data.json`.

Check: read `data.json` and confirm the `dnd` value.

Fix: set `dnd: true` with backup discipline, or confirm the user disabled it deliberately.

Prevent: never assume drag and drop is on. Read the file first.

Checkpoint: VALIDATE-SETTINGS passes with `dnd: true`.

---

## 5. FAILURE MODE: ZOOM DOES NOTHING

Symptom: the zoom-in click action has no effect.

Likely cause: the Zoom plugin is not installed.

Check: read `community-plugins.json` for the Zoom plugin (VERIFY per vault).

Fix: either install the Zoom plugin or keep `listLineAction: "toggle-folding"`.

Prevent: gate every zoom claim on a live dependency check.

Checkpoint: the dependency check passes, or the action value matches an available feature.

---

## 6. FAILURE MODE: TAB OR ENTER ENHANCEMENTS SKIPPED

Symptom: Tab and Enter behave like default Obsidian during typing.

Likely cause: an input method editor is composing text, and the plugin skips both overrides then.

Check: confirm whether an IME is active (VERIFY in-app).

Fix: finish composition and retry. This is expected behavior, not a defect.

Prevent: mention the IME pause when users report Enter or Tab surprises.

Checkpoint: a retry after composition yields the enhanced behavior.

---

## 7. FAILURE MODE: STALE OR LEGACY SETTINGS

Symptom: old boolean values for `stickCursor` appear in `data.json`.

Likely cause: settings written by an older plugin version.

Check: read `stickCursor` and compare it to the documented enum.

Fix: the plugin maps `true` to `bullet-and-checkbox` and `false` to `never`, so behavior is defined. Optionally normalize the value on the next write.

Prevent: normalize enum values whenever a merge touches the file.

Checkpoint: VALIDATE-SETTINGS accepts the value.

---

## 8. FAILURE MODE: CORRUPT OR PARTIAL DATA.JSON

Symptom: the plugin loads with all defaults, or the JSON fails to parse.

Likely cause: a bad write or a manual edit.

Check: parse the file and diff it against the newest backup.

Fix: restore from the newest `data.json.bak-*`, or delete the file to fall back to defaults.

Prevent: always keep a backup from the previous successful state.

Checkpoint: RESTORE-FROM-BACKUP passes and the file parses.

---

## 9. FAILURE MODE: HOTKEY CONFLICTS OR MISSING COMMANDS

Symptom: a listed command does not run, or another action fires instead.

Likely cause: the user rebinding hotkeys in Obsidian settings, or a conflict with another plugin.

Check: ask the user to verify the hotkey in Obsidian hotkey settings (VERIFY in-app).

Fix: no file-layer change. Rebind the hotkey in Obsidian settings.

Prevent: always present the defaults as defaults, never as fixed bindings.

Checkpoint: the user confirms the bound hotkey matches intent.

---

## 10. EXPECTED BEHAVIOR VS DEFECT

Some reports are expected behavior. Confirm these before treating them as defects.

- Zoom without the Zoom plugin is expected to do nothing.
- Tab and Enter pauses during IME composition are deliberate.
- Settings changes take effect only after a plugin reload.
- A missing `data.json` means defaults apply, which is not an error.
- `previousRelease` is bookkeeping and must never be edited.

If the behavior matches one of these, explain it and close the case without a fix.

---

## 11. QUICK TRIAGE

Follow this order when a report arrives.

1. Does `data.json` exist? If no, defaults apply and there is no settings bug.
2. Does the file parse as JSON? If no, restore the newest backup.
3. Are all keys known and enums valid? If no, normalize per the schema.
4. Is the behavior zoom? If yes, check the Zoom plugin presence.
5. Is the behavior fold? If yes, check the core "Fold indent" setting.
6. Was the file changed recently? If yes, ask for a plugin reload and retest.
7. Still failing? Escalate per section 12.

Each step ends with a checkpoint name from section 11.

---

## 12. VALIDATION CHECKPOINTS

| Checkpoint | Pass condition |
| --- | --- |
| VALIDATE-SETTINGS | All keys known, all enums valid, JSON parses |
| BACKUP-EXISTS | A timestamped backup sits next to `data.json` |
| DIFF-SCOPED | Only intended keys changed |
| DEPENDENCY-CHECK | Zoom claims only with the Zoom plugin present |
| FOLDER-CLEAN | No stray temp files in the plugin folder |
| RESTORE-FROM-BACKUP | Restored file parses and matches the backup |

---

## 13. ESCALATION

- If a behavior contradicts this reference set, verify against `main.js` in the installed plugin folder.
- If the plugin folder is missing, confirm enablement and reinstall through Obsidian community plugins.
- If `data.json` is missing, defaults apply and no restore is needed.
- When in doubt, restore the newest backup and report the diff.
- If a fix needs an in-app action, hand it to the user with a precise step and wait for confirmation.

---

## 14. RELATED RESOURCES

- [Outliner data model](data-model.md)
- [Outliner workflows](./workflows.md)
- [Outliner reference overview](./outliner.md)
