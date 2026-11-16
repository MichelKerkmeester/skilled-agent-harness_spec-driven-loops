---
title: "Handover to Barter: what changes after re-pinning past the phase 022 fixes"
description: "Skilled now accepts a host hook declared under skilled.hostHook, lets apply --adopt take a path under repin.exclude from its overlay copy, and names the regenerate step that rewrote a file an overlay owns."
trigger_phrases:
  - "skilled hostHook host pre-commit"
  - "adopt path under repin exclude"
  - "regenerated line regenerate step overlay"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: what changes after re-pinning past the phase 022 fixes

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use this handover when** a Barter session re-pins to a Skilled commit that holds these three changes, or works on its host `pre-commit`, its hand-written manifest entries under `repin.exclude` or a re-pin that fails after a regenerate step.

**Addressed to:** Barter. Nothing here changes a Barter file. Each step below is Barter's to run after the re-pin.

**Status:** built in Skilled, not yet re-pinned in Barter.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

This answers items 2, 3 and the second half of item 5 of Barter's phase 022 handover. Item 1 and item 4 are handled elsewhere.

**1. A host hook has an accepted form (item 3).**
- `git-setup-check.cjs` now passes an installed hook that the local git config lists under `skilled.hostHook`, one value per hook.
- The passing `hooks` row names it as `pre-commit: host hook by skilled.hostHook`.
- Only local config counts. A value in global config does not pass the row.
- The hook must still be executable. The check cannot tell whether your script runs Skilled's gates, so your script must run the ones you need.

**2. Adopt takes a path under `repin.exclude` (item 5, second half).**
- `apply --adopt <path>` now takes a path under `repin.exclude` when its copy already sits in the overlay folder, at the same path without the leading dot.
- It writes a `file` or `directory` entry with no `pinnedSha256` and applies it.
- With no overlay copy it refuses with `refuse: <path> is under repin.exclude, so adopt takes it only from its overlay copy at <overlay path>, which does not exist`.
- The existing rule still holds: when both the live file and the overlay copy exist, adopt refuses with `both ... exist; keep one, then adopt again`. Skilled has not checked Barter's tree. If your five hand-over hooks under `.opencode/scripts/git-hooks/` exist in both places, remove the live copy first. The apply that adopt runs writes it back from the overlay copy.

**3. A regenerate step that rewrites an owned file is named (item 2).**
- A live re-pin or a plain `apply` that runs the regenerate steps now prints `regenerated <path>  (overlay: <source>)  step: <id>  fix: ...` in place of `upstream-moved` for a file an overlay owns that a step rewrote.
- The line prints only in the run that ran the step. The sync state is not written after a failed run, so a later `status` reports the same file as `upstream-moved` again. Read the failed run's output, or the lines in its `report.json`, for the step's name.
- A stage still skips the regenerate steps. The operator chose this on 2026-11-16, because a stage has no project install behind it. So a stage that ends `RESULT: STAGED` can still fail live on this line. The line now says which step to look at.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

- The engine hashes every overlay destination before and after each regenerate step. A step is named whether or not it lists the file under `outputs`.
- The build is in `.skilled/commands/doctor/scripts/git-setup-check.cjs` and `overlay-engine.cjs`, with tests in the same folder's `tests/`. The references are `system-skilled-doctor/references/overlays.md` and `.skilled/commands/doctor/assets/doctor-git-setup.yaml`.
- Not checked in Barter's tree: whether the hand-over hooks exist both live and in the overlay folder.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

In Barter, after the re-pin:

1. Declare the host hook: `git config --local --add skilled.hostHook pre-commit`.
2. Run `node .skilled/commands/doctor/scripts/git-setup-check.cjs` and read the `hooks` row. It should pass with the note `pre-commit: host hook by skilled.hostHook`.
3. For each hand-written manifest entry under `repin.exclude`, you may drop it and adopt the path instead. Remove the live copy, then run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt <path>`. Keeping the hand-written entries also works.
4. If a live re-pin prints a `regenerated` line, decide whether the step's output is right. If it is, carry it into the overlay copy and run `apply`. If not, change the step.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] `git-setup-check.cjs` passes its `hooks` row in Barter with `skilled.hostHook` set to `pre-commit`.
- [ ] `apply --adopt` on one of the `.opencode/scripts/git-hooks/` paths writes its entry and exits 0.
- [ ] A live re-pin whose regenerate step rewrites an owned file prints a `regenerated` line that names the step. This line was declined for a stage, by the operator's choice.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The operator approved the build on 2026-11-16. The three changes and their tests passed in Skilled's doctor script test folder, `tests 1191, pass 1191, fail 0`.
<!-- /ANCHOR:session-notes -->
