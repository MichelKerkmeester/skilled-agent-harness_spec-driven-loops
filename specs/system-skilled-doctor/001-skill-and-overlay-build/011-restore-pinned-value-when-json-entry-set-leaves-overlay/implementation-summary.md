---
title: "Implementation Summary"
description: "A set removed from a json-entry overlay source now returns its value to the pin's on the next apply. The engine records each set in sync-state.json. One engine file, eight new tests and one reference paragraph."
trigger_phrases:
  - "restore pinned value json entry set implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay"
    last_updated_at: "2026-11-16T10:58:43Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the restore of a removed set"
    next_safe_action: "Commit the worktree once the operator says yes"
    packet_purpose: "Purpose: After a `set` operation leaves an overlay source, `apply` returns the live value to the pin's value, and removes a key the engine added that the pin does not hold."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay/handover-to-barter.md"
    session_ref:
      runtime: "claude"
      sessionId: "8dafc84b-d965-4347-8887-f936e5033e76"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T10:58:43Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-restore-pinned-value-when-json-entry-set-leaves-overlay |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When you remove a `set` operation from a `json-entry` overlay source, the next `apply` writes the pin's value back into the live file. A key the `set` added is deleted when the pin does not hold it.

The engine now records each `set` it applies in `sync-state.json`, under a `sets` key per destination: the path, the value written and whether the engine added the key. A `set` is recorded whether or not it changed a byte, so the first `apply` under this engine records a value an older engine wrote. Before an entry set runs, `restoreDroppedSets` takes back each recorded `set` the entry set no longer names. It refuses the overlay when the live value was edited after it was recorded, and when the pinned copy cannot be read.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The `onSet` report in `planOperation`, the `sets` record in the state read and write, `restoreDroppedSets` and its call in `applyJsonOperations` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Eight new tests and a fixture with a pinned upstream checkout. One older test keeps its first `set` listed |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | The `sets` record beside `links` and `items`, and `setKeyOnItem` as a known limit |
| `handover-to-barter.md` | Created | What the vendoring project removes, and after which `apply` |
| `scratch/dispatch/`, `scratch/vibe-runs/` | Created | The seven briefs and each run's `export.json` and output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was written and tested once as a prototype, saved as a patch and reverted. It was then cut into seven briefs of literal old and new text, one change per brief. DeepSeek v4.1 flash at max thinking applied each brief through the Mistral Vibe CLI. After each run the edited files were compared byte for byte with the text the brief gave, and the next run started only on a match.

The first brief added the failing test. It printed `pass 21` and `fail 1` before any engine change. The fifth brief added the restore and the same file printed `pass 22` and `fail 0`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record every `set`, changed or not | The vendoring project's two operations state a value the live file already holds. Recording only a changed value would never record them |
| A live value that equals the pin's is left alone before the edit check | After `apply` restores a value, its own second analysis reads the old record against the restored file. Without this order it would call the restore a hand edit |
| Write the pin's own text, not a new serialisation | The file returns to upstream's bytes, which a test asserts |
| Delete a key only when its record says the engine added it | A key the pin does not hold and the engine did not add may be a person's. The engine refuses and names the path |
| Change one older test's setup | It replaced one `set` with another on a fixture with no pinned copy, which the operator's refusal rule now stops first. The test keeps its first `set` listed and no assert line changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests` before the change | `tests 1175`, `pass 1175`, `fail 0` |
| The same command after the change | `tests 1183`, `pass 1183`, `fail 0`, exit 0 |
| `node --test` on `overlay-engine-sync.test.cjs` | `pass 29`, `fail 0` |
| The same file against an engine without the restore step | `pass 23`, `fail 6` |
| `sk-code-setup-check.cjs` | `STATUS=OK legs=9`, exit 0 |
| `quality-gate.cjs --worktree` | `gate=NO_BLOCKER_FOUND`, `findings: 0`, exit 0 |
| `scratch/repro-removed-set.cjs` with a recorded `set` | `after the set is removed: sk-code (equals the pin: true)` |
| The engine at `5e6589083e1` on a state file that carries `sets` | `apply` printed `0 changed`, exit 0 |
| Seven Vibe runs | Each `export.json` records `exit_code` 0 and `outcome` `finished` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A value left behind before this change is not restored.** No record of it exists. Put it back by hand, or keep the `set` until one `apply` has recorded it.
2. **`setKeyOnItem` keeps no record.** A value it wrote stays after the operation leaves the entry set. The operator left it out of this phase.
3. **A key an older engine added is recorded as not added.** Removing that `set` is refused when the pin does not hold the key. Delete the key by hand first.
4. **The restore across a changed pin is tested on the function only.** No test runs a whole `repin` over a dropped `set`.
5. **A restore needs the checkout the manifest's pin names.** Without it `apply` refuses and writes nothing.
<!-- /ANCHOR:limitations -->

---


