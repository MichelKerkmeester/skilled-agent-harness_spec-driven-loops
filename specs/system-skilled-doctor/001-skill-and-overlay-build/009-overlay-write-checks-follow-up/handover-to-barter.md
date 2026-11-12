---
title: "Handover to Barter: after the overlay engine follow-up"
description: "What a Barter session does once Skilled's overlay engine follow-up lands: re-pin, drop Barter's own OpenCode guard, settle five missing links and one unignored lock, and two risks Skilled left as they are."
trigger_phrases:
  - "handover to barter overlay follow up"
  - "barter re-pin after engine fixes"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: after the overlay engine follow-up

Skilled's session may not write under `barter/ai-speckit`. This file holds the work only a Barter session can do. Paths are relative to the `ai-speckit` root unless they start with `.skilled`.

---

## 1. WHAT SKILLED SHIPPED

Each item answers one point of Barter's handover at Barter commit `12f3cd4d4`, or one defect a fresh review found.

- **Stale lock.** `apply` takes over a lock whose owner has ended on this host and prints `note: took over the overlay lock of a run that has ended`. The lock line now carries `host=<name>`. A live owner, another host and a lock with no pid still refuse. `repin --stage` reads a dead run's lock, prints a `note:` line and stages, where it used to refuse.
- **Own layout link.** `sync-state.json` records each layout link target under `links`. A link whose current target is the recorded one is retargeted when the manifest changes it.
- **Dropped appended item.** `sync-state.json` records the items each `json-entry` overlay added under `items`. A dropped item is removed when the live item still equals what the engine wrote. A hand-edited one blocks the apply with a line that names it.
- **Layout.** `status` prints a `LAYOUT` line for each off-layout source, and `apply --relayout` moves them. Barter's handover asked for a `relayout` target. It is a flag of `apply` instead, like `--adopt`, because a new target needs a route and an advisor bridge of its own.
- **OpenCode.** `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` is the seventh adapter.
- **Root files.** `status` prints a `STALE    root-file` line and fails when upstream changed a `repin.rootFiles` overlay's file.
- **Glob.** `**/` in a `generated` glob matches whole path segments only.
- **Excluded folders.** A path under `repin.exclude` is no longer judged by the strict guard or the commit check.
- **Line endings.** The commit check passes a staged file whose content equals upstream's once CRLF is read as LF.
- **Audit.** `status --audit` lists vendored paths that differ from upstream, are missing or are extra, when no overlay owns them.
- **Pi adapters.** Pi 1.5.1 and newer load a linked extension from the file the link points at, and 16 adapters then failed to load. Each entry under `.pi/extensions/` is now a one-line file that re-exports the adapter, and each adapter imports relative to its own folder. Pi 1.5.0 and Pi 1.5.2 both load all 22.

---

## 2. WHAT BARTER DOES NEXT

In this order.

1. **Push the handover commit.** The review found `skilled/v4.0.2.1` one commit ahead of origin at `12f3cd4d4`. Done when `git status -sb` shows no `ahead`.
2. **Re-pin** `skilled/` to the Skilled commit the republished `v4.0.2.1` tag names, through `/doctor:overlay repin`. Rebase whatever the stage report blocks.
3. **Expect two first-apply effects.**
   - The old state file has no `links` and no `items`. The first apply records them. Nothing is retargeted or removed before that, so the two hook entries Barter dropped earlier stay gone only because Barter reset the registry by hand.
   - A glob that relied on the old over-match stops matching. Run `status` and the commit check once and read any new refusal as a real unowned path.
4. **Drop Barter's OpenCode guard.** Delete `skilled/barter-overlays/opencode/plugins/barter-overlay-guard.js`, its test and `skilled/barter-overlays/skilled/hooks/barter-overlay-guard/`, with their two manifest entries. Register the upstream adapter, then confirm a refused write in an OpenCode session.
5. **Settle the five missing links.** The review found five upstream links absent from the tree under `skilled/.skilled/hooks/dist-freshness/`: four `check-dist-staleness.sh` links and one OpenCode plugin link. Run `status --audit` to list them. Restore each, or add a removal row for it in `skilled/barter-overlays/overlay-manifest.json`. Until then the next re-pin refuses as soon as upstream changes one.
6. **Ignore the lock file.** `skilled/barter-overlays/.build-lock` is not in `.gitignore`. Add it. Done when `git check-ignore` matches it. Add `skilled/barter-overlays/.build-lock.takeover`, `skilled/barter-overlays/.build-lock*.claim` and `skilled/barter-overlays/relayout-runs/` at the same time. A `.claim` file is what a run killed in the middle of a takeover leaves, and it is safe to delete.
7. **Run `status`** and confirm `RESULT: PASSED` with no `LAYOUT` and no `STALE` line.
8. **Expect 22 entries under `skilled/.pi/extensions/` to change from a link to a file.** The re-pin brings them, because `.pi` links to `skilled/.pi`. No Pi update is needed. Done when a Pi session in the tree starts with no `Failed to load extension` line.

---

## 3. RISKS SKILLED LEFT AS THEY ARE

- **The edit hook fails open.** An engine error or a timeout allows the write with one note on stderr. A malformed `strictWrites` value therefore switches the edit-time check off. The commit check still blocks. Fail-open is the hook's stated contract on every runtime, so changing it is a separate decision. Keep Barter's commit hook running `pre-commit` as it does now.
- **A commit that moves the pin skips the commit check.** That is by design: a re-pin commit carries upstream's own changes. Barter's conversion commit moved the pin and carried 727 files unchecked. Run `status --audit` after any commit that moves the pin.
- **A lock takeover is safe for two runs, not for four.** Two runs that find the same dead lock were tested over 41,680 schedules and never both held it. Four runs at once, with a takeover marker more than a minute old, can still end with two holders. Do not start more than two overlay commands on one tree at the same moment.
- **A takeover can refuse for up to a minute.** A marker that outlives its run makes the next takeover print `another run is taking the overlay lock over` and `run it again in a minute`. Do that. Do not delete the lock.

---

## 4. WHAT WAS NOT VERIFIED IN BARTER

- Nothing in Skilled's follow-up was run against Barter's tree. The review ran read-only guard probes there before these changes.
- Whether the five missing links break Barter's dist-freshness hook is unknown. Read Barter's hook registry entries for it.
