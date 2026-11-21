---
title: "Implementation Summary"
description: "/local-doc-alignment gains an overlay-layout topic and /local-skilled-alignment an overlays target, both finding a vendored project's overlay folder through .skilled-overlays.json and refusing a folder outside the project."
trigger_phrases:
  - "alignment command overlay targets implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/015-alignment-command-overlay-targets"
    last_updated_at: "2026-11-21T00:25:54Z"
    last_updated_by: "generate-context"
    recent_action: "Wrote the delivered-work description"
    next_safe_action: "Run the merge into local main"
    packet_purpose: "Purpose: Either command, run in a vendored project, finds the overlay folder through `.skilled-overlays.json` and audits it, and a project without that file gets a clean answer instead of an error."
    blockers: []
    key_files:
      - ".skilled/commands/local-skilled-alignment.md"
      - ".skilled/commands/local-doc-alignment.md"
    session_dedup:
      fingerprint: "sha256:3cb598db1437d412f250c882278f266b94ef37855c1d9994ae3476407a41dddf"
      session_id: "scaffold-015-alignment-command-overlay-targets"
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
| **Spec Folder** | 015-alignment-command-overlay-targets |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both alignment commands can now reach a vendored project's overlay folder. `/local-doc-alignment` has an `overlay-layout` topic that takes every README in that folder along with the overlay engine docs. `/local-skilled-alignment` has an `overlays` target that narrows its audit to the folder.

### Phase 15: alignment-command overlay targets

Run either command in a project that vendors Skilled, and it reads `.skilled-overlays.json` at the framework tree root, the folder that holds the real `.skilled`. The folder that file names is resolved by the engine's own exported `resolveOverlayDir`, so both commands apply the engine's checks, and a folder that lands outside the checkout is refused. An existing folder is then read through `fs.realpathSync.native`, so a linked folder, or a setting whose capitalisation differs from the folder on a case-insensitive disk, still lands on the paths git lists. A broken setting is ignored for every other target, with a `note=overlay setting ignored: <message>` on the STATUS line. A project with no setting still gets the engine docs from the topic, with a note and no error. The `overlays` target exits 2 with a `STATUS=ERROR` line, because there is nothing to audit.

The topic's README walk follows the README contract. It takes `README.md` and `README.markdown`, and skips `repin-runs/` and `relayout-runs/` at the top, dot folders, `node_modules`, anything reached through a link and any folder it cannot read. A setting that names a missing folder prints a note. Each scoped doc carries its git working-tree status, so a README not yet committed, or one a `.gitignore` hides, is listed as untracked. The target's overlay files get an `overlay` owner, which fires a new surface, S16, in lane C. S16 runs `overlay-engine.cjs status --audit`, which writes nothing.

### Files Changed

Both commands are gitignored private files (`.gitignore` lines 246 and 247), so none of this is in a commit. The changes were built in real copies in the worktree, and then copied into the private copy in the Skilled checkout.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs` | Modified | `OVERLAY_SETTING` and `resolveOverlayFolder()`, shared by both commands |
| `.skilled/commands/assets/local-skilled-alignment/resolve-scope.cjs` | Modified | The `overlays` kind: checked before path detection, its scope cut down to the overlay folder |
| `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml` | Modified | Surface S16 in lane C |
| `.skilled/commands/assets/local-skilled-alignment/tests/resolve-scope.test.cjs` | Modified | Eight tests for the `overlays` target: setting present, absent, invalid, outside the project, absolute, linked and case-variant |
| `.skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-presentation.txt` | Modified | `overlays` on the `Accepted:` line |
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modified | The `overlay-layout` topic, with `overlayReadmes: true` |
| `.skilled/commands/assets/local-doc-alignment/doc-alignment.cjs` | Modified | The overlay README walk, the overlay folder as a review root, and command docs matched at any depth |
| `.skilled/commands/assets/local-doc-alignment/tests/doc-alignment-overlay-topic.test.cjs` | Created | Ten tests: with a setting, without one, outside the project, this checkout, a linked folder, an unreadable and a missing folder, a case-variant setting, and untracked and gitignored READMEs |
| `.skilled/commands/assets/local-doc-alignment/local-doc-alignment-presentation.txt`, `.skilled/commands/local-doc-alignment.md`, `.skilled/commands/local-skilled-alignment.md` | Modified | List the topic and the target |

### Barter mirror

Barter vendors its own copy of `local-skilled-alignment` and has no `local-doc-alignment`. Its copy has diverged, so the change goes in as hunks, not whole files:
1. `alignment-lib.cjs`: add the `OVERLAY_SETTING` and `OVERLAY_ENGINE` constants and `resolveOverlayFolder()`, and export both names.
2. `resolve-scope.cjs`: add `overlays` to `KINDS`, the usage line and the header comment; add `SUBTREE_KINDS`, the `overlayRoot` variable and the overlay check at the top of `classify`; use `SUBTREE_KINDS` in `emptyScopeNote` and the `base:` line; return early from `detectKind` for `overlays`; add `findOverlayRoot()` and call it in `main`; set `subtree` for the overlays kind.
3. `surface-map.yaml`: lane C becomes `[S5, S6, S13, S16]`, and the S16 block follows S15.
4. The presentation's `Accepted:` line gains `overlays`, and `local-skilled-alignment.md` names it in mode routing step 2, the `--kind` row and workflow step 1.
5. Barter has no `tests/resolve-scope.test.cjs`. Port the Skilled file or skip it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The private assets were copied to `/tmp/ovl-gates/private-backup/` first. Each new test failed before its change: the target tests on `kind=path`, the missing S16 surface and exit 0 where 2 was expected, and the topic tests on `unknown topic`, then on the missing overlay folder and the presentation file a nested tree did not match. The `README.markdown` case failed first too, before the walk took that name. Three @review rounds followed. Round 1 found that a linked overlay folder was read by its spelled path, and round 2 that the same held for a case-variant setting; both were fixed with red-first tests, along with the P2 findings on error paths and untracked files. Round 3 approved, with no P0 or P1. Its two P2s were fixed as well: a README a `.gitignore` hides is now marked untracked, and the command doc says which settings stop the scope. The worktree copies were then copied into the Skilled checkout and compared with `diff -r`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One `overlay-layout` topic | This packet has no phase 013, so no earlier plan named a separate overlay-layout topic to amend, and one topic covers both the READMEs and the engine docs |
| Resolve through the engine's `resolveOverlayDir` | The commands refuse exactly what the engine refuses, with no second copy of its folder rules |
| Command docs matched at any depth | In a project that tracks the framework in a nested folder, the presentation `.txt` was missed, and the other topics' doc counts stay at 85, 47 and 184 |
| Take `README.markdown` as a folder's README | sk-doc reads a `README.md` under a `commands/` path as a command document, so the contract was amended to accept `README.markdown` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/assets/local-skilled-alignment/tests/*.test.cjs` | PASS, 76 of 76 (68 before), exit 0 |
| `node --test .skilled/commands/assets/local-doc-alignment/tests/*.test.cjs` | PASS, 10 of 10, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | OK, 32 routes, 11 warnings, unchanged, exit 0 |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on both command docs | 0 blocking errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not in git.** Both commands are gitignored private files, so their change lives only in the private copy in the Skilled checkout. `/tmp/ovl-gates/private-backup/` holds the copy from before the change.
2. **An invalid setting is quiet outside the `overlays` target.** For any other target, a bad `.skilled-overlays.json` is ignored without a message, so overlay files show as `unowned`.
3. **No setting, no `overlays` target.** A project with no setting is refused the `overlays` target even when an `overlays/` folder exists. `--kind path` still reaches it.
<!-- /ANCHOR:limitations -->

---


