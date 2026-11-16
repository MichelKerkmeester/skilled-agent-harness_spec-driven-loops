---
title: "Handover to Skilled: what stopped Barter's re-pin to d0fc9d719b"
description: "The alignment guard fix holds in Barter. Four engine limits stopped or failed the re-pin and were worked around by hand, the new vocabulary mirror guard has no setting for a host with its own vocabulary, and three items from the earlier handover are still open."
trigger_phrases:
  - "repin link replaced by folder"
  - "directory overlay upstream-moved after rebase"
  - "vocabulary mirrors host opt out"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Skilled: what stopped Barter's re-pin to d0fc9d719b

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use this handover when** a Skilled session works on the overlay engine's re-pin, the router-sync vocabulary guard or the history lookup package's build, or a Barter session re-pins after Skilled changes one of them.

**Addressed to:** Skilled. Every file named below is vendored and held at upstream bytes in Barter unless an overlay is named.

**Status:** open. Nothing below has been started in Skilled.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

Barter re-pinned from `edf921316c` to `d0fc9d719b` on 2026-11-16 and added `.vibe` to its runtime folders. The alignment guard fix holds: `sk-code-setup-check.cjs` ends `STATUS=OK legs=9` in Barter, where it failed on `drift-guards` at the old pin.

**1. A path that turns from a link into a folder cannot be re-pinned (observed, both ways).**
- `.skilled/changelog/system-deep-loop/deep-ai-council` is a link at `edf921316c` and a folder with 21 files at `d0fc9d719b`.
- With the link in place, `repin --stage` printed `refuse: unowned .skilled/changelog/system-deep-loop/deep-ai-council/v1.0.0.0.md is not in the old pin, and the tree holds its own copy there` for 18 files. The link's target folder supplied those files.
- With the link removed, it printed `refuse: unowned .skilled/changelog/system-deep-loop/deep-ai-council differs from the old pin (missing from the tree)`.
- Barter listed the path in `repin.exclude` for the run, wrote the 21 files from the checkout afterwards and removed the entry.

**2. A folder overlay cannot record that it was rebased (observed on 29 paths).**
- A `directory` or `skill-root` entry carries no upstream hash. After the copy, each file upstream changed under it reads `upstream-moved`, whatever the overlay source holds, and each file upstream added reads `live-edited`.
- The live run copied 3,385 paths, set the pin, printed 29 `blocked` lines and ended `RESULT: FAILED`. Its apply and its verify steps did not run.
- Barter put its own copy back on 18 paths and deleted 11 upstream-only files with a script, then ran `apply` twice and `status`, which printed `RESULT: PASSED`.
- A stage reports the same 29 lines and ends `RESULT: STAGED`, so the stage passes where the live run fails. This is the earlier handover's second item again, with a different cause.

**3. A `set` on a key the new pin adds blocks the re-pin before it starts (observed).**
- Barter added `set ["vocabularyMirrors"]` to its `hub-router.json` overlay. The key exists at `d0fc9d719b` and not at `edf921316c`.
- `status` at the old pin printed `cannot apply the entry set to .skilled/skills/sk-code/hub-router.json: missing key "vocabularyMirrors"`, the destination read `both-changed`, and `repin` refused with `status shows 1 live or conflicting destination(s)`.
- Barter held the operation back, ran the re-pin and added it afterwards.

**4. A generator-written field in an unowned file is refused as an edit (observed).**
- `.skilled/skills/system-skill-advisor/graph-metadata.json` held an `intent_signals_generated` field the old pin lacks. `generate-router-intent-signals.cjs --write`, one of the manifest's regenerate steps, writes it.
- `repin --stage` printed `refuse: unowned … differs from the old pin (different bytes)`. Barter restored the file from the old pin, and the regenerate step wrote the field again after the re-pin.

**5. The vocabulary mirror guard has no form for a host that curates its own keywords (measured).**
- `hub-router.json` now names `"vocabularyMirrors": ["sk-code-frontend", "sk-code-ci"]`, and router-sync check 2 fails when a mirrored surface's hub keywords and its `ROUTER.md` intent keywords differ.
- Barter's frontend surface has 26 intents and a shorter hub keyword list by design. Check 2 reported 308 problems, all on `sk-code-frontend`.
- Barter overlays the value to `["sk-code-ci"]`. The setting is there to be edited, so this may be the intended use; Skilled should say so or offer another.

**6. The history lookup package is built by no install path (confirmed by search).**
- `.skilled/hooks/session-handover/history` has its own `build` script. At `d0fc9d719b` only `.github/workflows/spec-kit-check.yml` runs it; `INSTALL-SKILLED.md` and the spec-kit root build do not.
- `worktree-provision-paths.txt` says that without its output a handover prints no lookup section and the printed command refuses with `core_unavailable`.
- Barter's `install.sh` now runs that build and warns when it fails.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

- Evidence in this phase's `scratch/`: `stage1.log`, `stage2.log` and `stage3.log` (the three stage runs), `live.log` (the live run), `settle-owned.cjs` and `council-path.cjs` (the two workarounds), `after/` (the checks at the new pin).
- Still open from the handover in `../022-repin-edf921316c/handover.md`: a host's own `pre-commit` has no accepted form in `git-setup-check.cjs` (its item 3), captured fixtures differ in a host (item 4, now three baseline rows and their totals), and `apply --adopt` refuses a path under `repin.exclude` (item 5).
- Not confirmed for item 2: whether `protectedPaths` or another existing field can already mark a folder file as rebased. Barter found none in `references/overlays.md`.
- Not Skilled's: Barter kept its own frontend packet rather than merge upstream's v1.2.0.0, so plain frontend requests defer in Barter.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

Proposed to Skilled:

1. **Let a re-pin replace a link with a folder**, and a folder with a link, when the old pin holds the one and the new pin the other.
2. **Give a folder overlay a way to say a file was rebased**, such as a per-path upstream hash the entry may carry, so the live run can apply instead of stopping after its copy. Failing that, have the stage end in a result other than `RESULT: STAGED` when it prints a `blocked` line.
3. **Let a `json-entry` `set` wait for a key the target pin adds**, or check the operation against the new pin's file during a re-pin.
4. **Treat a file a regenerate step writes as generated** when the manifest's own step is the writer, or let a regenerate step list such outputs.
5. **State what `vocabularyMirrors` means for a host**, and whether removing a surface from it is the supported opt-out.
6. **Build the history lookup package where the runtime is built**, or name the step in `INSTALL-SKILLED.md`.

In Barter, after Skilled ships any of these: re-pin and drop the matching workaround script.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] A re-pin across a link-to-folder change ends `RESULT: PASSED` with no `repin.exclude` entry for the path.
- [ ] A re-pin whose stage ends `RESULT: STAGED` ends `RESULT: PASSED` live when upstream changed a file under a `directory` overlay.
- [ ] `status` at the old pin does not read `both-changed` for a `set` on a key only the new pin has.
- [ ] A stage does not refuse a file the manifest's own regenerate step wrote.
- [ ] A fresh install has `.skilled/hooks/session-handover/history/dist/cli.js`.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

Written after the re-pin of 2026-11-16. Barter changed no vendored file for items 1 to 4 and 6; item 5 is one `json-entry` operation.
<!-- /ANCHOR:session-notes -->
