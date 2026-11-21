---
title: "Implementation Summary"
description: "The overlay engine now gives every overlay folder README a role, reports missing and invalid READMEs in an advisory docs leg of status --audit, and refuses a layout-link path listed twice before anything is written."
trigger_phrases:
  - "overlay folder readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/014-overlay-folder-readmes"
    last_updated_at: "2026-11-21T00:22:48Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 14 after the fifth review round"
    next_safe_action: "Run the merged-main gates after the merge"
    packet_purpose: "Purpose: Every overlay folder can carry a README with a defined role."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ab8fd8cde8037e546776aeec454ca5df945ce99a57ae8323eb34c40080ca6384"
      session_id: "scaffold-014-overlay-folder-readmes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-overlay-folder-readmes |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now keep a README in every folder of an overlay folder and know what the engine does with it. `status --audit` lists each folder with no README and each README that sk-doc's validator rejects, and none of that changes your status result or exit code. A manifest that lists one layout-link path twice is refused before anything is written.

### Phase 14: engine support for overlay folder READMEs

A README ships when a manifest entry reads it: as a `source`, a marked-section `fragment` or `base`, inside a `directory` entry's folder, or on a path a `skill-root` entry's `replace` names. Every other README is documentation only. Apply, capture, the guard, pre-commit, relayout and `repin --stage` leave it alone. Adopt refuses, and writes nothing, when it would take one over or turn its folder into a directory entry. `README.md` and `README.markdown` both count, because sk-doc reads a `README.md` under a commands folder as a command document.

The docs leg walks the overlay folder. It skips the engine's run folders at the top, dot folders, `node_modules` and links, and skips a folder it cannot read. It spawns `validate_document.py --json` once per README with an argument array and no shell, and prints `DOCS` lines and `docs=<n>` after the `AUDIT` lines, plus a `docs` key in `--json`. Without python3 or the validator it prints one `DOCS     skipped:` line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Section 18, OVERLAY FOLDER READMES (from line 6375): the README classifier, the walk, the validator spawn and the docs report. The adopt refusal (about line 5996). The `docs` key and DOCS lines in `commandStatus` (about line 3878). `duplicateLayoutLinkPath` (line 2889), called first in the layout-link check |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-readmes.test.cjs` | Created | 46 tests, each placement-dependent one run for an in-tree and a sibling overlay folder |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modified | The duplicate layout-link tests, one subtest per spelling, and adopt in the command loop |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs` | Modified | `OVERLAY_ENGINE_UNDER_TEST`, so a test can run against another engine copy, and an env argument for `runEngine` |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | README roles, the docs leg and the duplicate refusal |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`, `doctor-overlay-status.yaml`, `.skilled/commands/doctor/overlay.md` | Modified | Read the DOCS lines as advisory, and the troubleshooting rows |
| `scratch/overlay-readme-contract.md` | Created | The README contract, with two dated amendments |

### Overlay-folder readers checked

Each engine path that reads the overlay folder was checked for a way to name a documentation-only README. Apply's `walkTree`, capture's `captureRecordForPath`, the guard's `destinationCandidates` and `strictWriteRefusal`, pre-commit's `stagedUnownedChanges`, the audit's `auditVendoredTree` and `trackedTreeKeys`, repin's `upstreamLosses`, `managedPathTest` and `writeBackup`, `layoutMoves` and relayout's `planRelayout` read only entry sources, destinations or vendored keys, so none needed a change. Adopt needed the refusal. `copyTreeForStage` copies a sibling overlay folder byte for byte, which the second amendment records.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The contract was written first and shared with the ai-speckit session, which writes Barter's READMEs from it. The engine change landed in two commits on `worktrees/499-overlay-readmes-and-alignment`: `3a9f1567d95` for the docs leg and the guarantee, and `6928c1eabe2` for `README.markdown` and the duplicate refusal. The review's first round led to `bcdf8d95037`: duplicate paths compared after normalization, adopt checking layout links before it writes the manifest, a 30-second validator timeout, every unreadable folder skipped, and a relayout refusal that names a documentation-only README. The second round led to `b4a669a6c87`: on a filesystem that ignores letter case, paths that differ only in case count as one, decided by opening a case-flipped spelling of the tree root. The third round led to `e29e24eb277`: one path key, folded for case where the filesystem ignores it and always to Unicode NFC, now serves the duplicate check, the planned-link map and the written-before test, so `EXT` out of the tree with `ext/planted` below it is refused at plan time with no duplicate entry. That half-apply was already in the engine at `bf6806ad4b3`. The case probe now looks inside the tree root. The fourth round led to `49c109910e1`: case is folded with full Unicode case mapping, because APFS treats `STRASSE` and `straße` as one name, and the probe skips a name whose flipped spelling does not flip back. The fifth and last round found that the capital sharp s `ẞ` still keyed apart from `ß`, and led to `fcc8df4983f`: the key lower-cases before it upper-cases, which the reviewer checked is stable for every code point. The docs landed in `b872197e348`, `494418196cf`, `09999719d31` and `f4a3809f70f`. Each new behavior test was run first against the engine before it, through `OVERLAY_ENGINE_UNDER_TEST`. Against `bf6806ad4b3`, 18 of the first 34 failed: the docs-leg tests and both adopt refusals. Against `3a9f1567d95`, all 8 new runs failed. Against `b872197e348`, 11 of the 13 new runs failed, against `ff969f029fb` the two case rows failed, against `09999719d31` the nested-case and accented-name tests failed, against `e29e24eb277` the sharp-s test failed, and against `96f0d3a98ef` its capital sharp s cases failed with `status` exiting 1. The other 16 are regression guards that pass on both engines by design.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A non-failing severity, not an opt-in manifest field | An existing adopter with no READMEs keeps its status result and exit code with no manifest change, and the operator chose that nothing blocks a commit |
| sk-doc's own validator, spawned per README | The brief requires sk-doc's validator rather than a re-implementation, and spawning it per file keeps the engine free of a Python import path |
| `README.markdown` counts as a folder's README | sk-doc reads a `README.md` under a commands folder as a command document. Barter's eight command folders and Skilled's own use `README.markdown` |
| The duplicate check runs inside the existing layout-link check | It then refuses wherever an outward link is refused, with the same exit code 2, before any write |
| The guard and pre-commit do not check duplicate links | They never refused an outward layout link either. `status` and `apply` do |
| Case folding decided by the filesystem, not the platform | Case-sensitive APFS exists, so `process.platform` would refuse valid manifests there |
| Full case mapping, not `toLowerCase` | APFS folds `ß` and `ẞ` to `ss` and ligatures to their letters. Folding a little more than the disk only adds refusals |
| Two paths through a linked parent folder are not compared | The planner joins layout paths onto the root without resolving their folders, so resolving them for the duplicate check would judge paths differently from the run that writes them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | PASS, 354 of 354 (294 before), exit 0 |
| `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs .skilled/hooks/overlay-guard/tests/*.test.mjs` | PASS, 34 of 34, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | PASS, 9 of 9, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | OK, 32 routes, 11 warnings, unchanged |
| `status --audit --root barter/ai-speckit/skilled`, engine at `bf6806ad4b3` and on the branch | Both `RESULT: PASSED`, exit 0, and every line apart from the DOCS lines identical. After `6928c1eabe2`: `docs=0`, 210 folders, 210 READMEs, 110 shipping, 100 documentation only |
| `validate_document.py` on `overlays.md` and `overlay.md` | 0 blocking errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A LAYOUT line can still name a documentation-only README's path in one case.** When an overlay copy's layout path is the same as a documentation-only README's path, the advisory LAYOUT "belongs at" line names that path, and the relayout refuses with a line that says a documentation-only README sits there. Merge it into the overlay copy or move it.
2. **A skill-root `replace` value with a trailing slash is not matched by capture.** `managedPathTest` keeps the slash too, so strict writes, pre-commit and the audit read those replaced files as unowned. This was already so before this phase.
3. **Case folding is decided once, at the tree root.** A volume with the other case rule mounted below the root is judged by the root's rule. The writer's own check at write time still holds there.
4. **One validator process per README.** Barter's 210 READMEs mean 210 spawns, about 21 seconds, and only under `--audit`.
5. **The last fix had no review round of its own.** The review was capped at five rounds. Round five failed on `ẞ` alone, and its fix in `fcc8df4983f` was checked by a red-first test and the full suite, not by a sixth review.
<!-- /ANCHOR:limitations -->

---


