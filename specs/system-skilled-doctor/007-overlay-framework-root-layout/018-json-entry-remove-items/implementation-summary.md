---
title: "Implementation Summary"
description: "A json-entry overlay can remove array items with removeItems, byte-stably and idempotently, so Barter can drop its whole-file .utcp_config.json overlay. The review ends APPROVED with no P0 or P1."
trigger_phrases:
  - "json entry remove items implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/018-json-entry-remove-items"
    last_updated_at: "2026-11-25T18:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Committed removeItems and its review fixes on worktrees/544-upstream-overlay-mechanisms"
    next_safe_action: "The operator merges the branch into Skilled main and pushes it"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-remove-items.test.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "json-entry-remove-items"
      parent_session_id: null
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
| **Spec Folder** | 018-json-entry-remove-items |
| **Completed** | 2026-11-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A json-entry overlay can now delete items from an array in an upstream JSON file and leave every other byte alone. Barter can replace its whole-file `.utcp_config.json` overlay with one operation that removes four manuals.

### Phase 18: json-entry removeItems

The consumer writes `{"op":"removeItems","path":["manual_call_templates"],"identityKey":"name","items":["notion","obsidian","gitkraken","webflow"]}`. With `identityKey`, each name picks the object whose key holds it. Without it, `items` lists plain values. Each item leaves with its comma, the file keeps its indent and EOL, and an emptied array becomes `[]`. A second apply finds nothing to remove and changes nothing, and status and `status --audit` agree after apply.

A name the live file no longer holds is checked against the pin. If the pin holds it, nothing is printed. If the pin lacks it too, status and re-pin print a `NOTE`, and apply still runs. A dropped `removeItems` is not undone: the cross-check `NOTE` names the difference, and a re-pin restores the item. The engine refuses a non-array path, object items in `items`, a keyed op meeting a non-object live item, a duplicate live name, an `insertItems`, `appendItems` or `setKeyOnItem` on the same item, and an insert anchored on a removed item.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The `removeItems` planner, its refusals and the pin cross-check, in the path apply, status and audit share |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-remove-items.test.cjs` | Created | 25 tests: layout in LF and CRLF files, idempotence, missing names, a dropped op and each refusal |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Lists `removeItems` with the other json-entry operations and states its lifecycle |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/removed-items-leave-the-file.md` | Created | Scenario SKD-014 |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` | Modified | Indexes SKD-014 |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | Names `removeItems` among the operations |
| `.skilled/skills/system-skilled-doctor/leaf-manifest.json` | Modified | Registers the new playbook leaf |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each unit was red first, then committed on `worktrees/544-upstream-overlay-mechanisms`:
1. `85e9f28d788`: the operation, its docs and SKD-014. Before it, all 23 new tests failed on `unknown operation "removeItems"`.
2. `7ce755013bb`: this phase's review P2 fixes. A pinned array holding a plain value beside the objects a keyed `removeItems` names no longer makes status throw, and an insert anchored on a removed item now refuses at validation instead of landing at the end of the array.

One `@review` pass covered this phase and the router unification program's data-driven hub registry together. It returned APPROVED with no P0 or P1 and four P2s, all fixed: this phase's in `7ce755013bb`, the hub registry's in `bf022a67b20`.

**Final verdict: APPROVED, no P0, no P1.**
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not undo a dropped `removeItems` | A `removeItems` keeps no record in `sync-state.json`, and the take-back contract already lists not-undone cases with a `NOTE`. The item comes back by hand from the pinned copy, or by a re-pin that copies the file |
| Judge a missing name against the pin, not the live file alone | A name the pin holds was removed by this overlay or a sibling op and needs no output. Only a name the pin lacks too is news to the consumer |
| Refuse an add or set on an item the same entry set removes | An item an entry set both writes and removes has no one state the file can hold, so the engine refuses and names the two operations |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New test file on the unchanged engine | 23 of 23 failed on `unknown operation "removeItems"` (`/tmp/upstream-544/engine-red.txt`) |
| New test file on the final branch | 25 of 25, exit 0 |
| Engine suite | 573 pass, 0 fail (548 before) |
| Overlay guard suite | 21 of 21, exit 0 |
| `@review` | APPROVED, no P0 or P1, four P2s fixed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A dropped op leaves the item removed.** Put it back by hand from the pinned copy, or re-pin; the cross-check `NOTE` in status names the difference until then.
2. **The branch is not merged.** The four commits sit on `worktrees/544-upstream-overlay-mechanisms`, and Barter keeps its file overlay until Skilled main carries them.
<!-- /ANCHOR:limitations -->

---
