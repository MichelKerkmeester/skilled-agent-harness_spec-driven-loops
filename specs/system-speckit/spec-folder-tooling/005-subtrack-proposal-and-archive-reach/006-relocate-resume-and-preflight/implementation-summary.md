---
title: "Implementation Summary"
description: "A rerun of relocate.mjs now finishes whatever step stopped the first run, and the preflight refuses an unproven move and two spellings of one folder."
trigger_phrases:
  - "relocate resume and preflight implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/006-relocate-resume-and-preflight"
    last_updated_at: "2026-11-14T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built and verified all six requirements, committed 5e9f6f83be"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-relocate-resume-and-preflight"
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
| **Spec Folder** | 006-relocate-resume-and-preflight |
| **Completed** | 2026-11-14, commit `5e9f6f83be` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A rerun of the same relocation map now finishes the step that stopped the first run, instead of finding nothing to do. The preflight also refuses a move nothing records, and two spellings of one folder on a volume that folds case.

### Phase 6: relocate-resume-and-preflight

- **Late steps.** The redirect table, the trigger index and the close's sweep each mark the ledger batch when they pass (`markLateStep`, `pendingLateSteps`). The work check counts any step not yet marked, so a rerun runs it again. A moved packet's own failing validation is printed by every run that reaches the close and never keeps the map open.
- **Half-finished move step.** The dirty-tree refusal skips files inside a folder the same map already moved. Any other uncommitted file the run would rewrite is still refused.
- **Identity step.** The stale-identity check reads `parentChain` in `description.json` (`parentChainOf`, `sameChain`), so a failed migrate step is retried on the rerun. A chain that differed before the move is not reported.
- **Missing source.** A missing source counts as moved only when the ledger holds that move or git shows a tracked move not yet committed (`recordedMove`). Otherwise the preflight refuses and tells the operator to move the folder back and rerun.
- **Two spellings.** Sources and targets are compared by device and inode (`folderIdentity`). A path that does not exist yet uses its longest existing prefix plus a rest lower-cased when a probe shows the volume folds case (`volumeFoldsCase`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Modified | The five changes above |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Modified | Eleven cases, each seen failing before its fix |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five briefs, one change each, went to DeepSeek V4.1 Flash at max reasoning through the `dsh` harness. Each brief wrote its failing cases first, then the fix. The orchestrator reran the relocate and archive suites after every brief and the full CLI suite at the end, then committed. The worker reports, with each failing run, are in `scratch/build-evidence.md`.

The planned `reproduce.txt` and `after.txt` were not written as separate files. Each finding was reproduced as a failing test before its fix and passes after it, which `tasks.md` records as a deviation on T001 and T014.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record completion in the ledger batch the tool already writes | `relocate.mjs` is the only reader of the ledger (`scratch/ledger-readers.txt`), so a `steps` record there has no other reader to break, and no second state file is needed |
| A moved packet's own validation verdict never keeps a map open | A packet that fails strict validation for its own reasons would otherwise keep every rerun open forever |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relocate and archive suites before any change | PASS: 77 passed, exit 0 (`scratch/baseline.txt`) |
| The same suites after each brief | 80, 82, 83, 86, 88 passed, exit 0 |
| Full CLI `npm test` after the phase | PASS: 211 files, 2580 passed, 0 failed, exit 0 |
| Added code comments | No spec path, packet number or finding id |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Edits inside a moved folder.** An operator's own uncommitted edit inside a folder the same map already moved cannot be told apart from the move, so that folder is exempt from the dirty-tree check.
2. **Old ledger batches.** A batch written before this change has no `steps` record. A rerun of such a map runs the late steps once more and then marks them.
3. **Renumber resume.** A stopped `--renumber` run leaves no map to rerun, because the map is derived from the live tree. Rerun with an explicit `--map` that names the remaining moves.
4. **Untracked stop before the ledger.** An untracked packet, one git does not track, stopped after its move and before the ledger step leaves neither git nor the ledger recording the move. The rerun refuses it and asks for the folder to be moved back to its source path, then the map runs again. A tracked packet or a move the ledger already holds is finished by the rerun.
<!-- /ANCHOR:limitations -->

---
