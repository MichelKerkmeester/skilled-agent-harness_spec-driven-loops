---
title: "Implementation Summary: Fork Attribution and Changelog"
description: "Both vendored extensions now disclose their fork status in-README, backed by a fact-checked CHANGES-FROM-UPSTREAM.md per fork; the stale zh-CN README was removed; a stray-artifact gap in an earlier verification pass was found and closed."
trigger_phrases:
  - "fork attribution implementation"
  - "pi-cache-optimizer changes from upstream"
  - "deep-pi changes from upstream"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/009-fork-attribution-and-changelog"
    last_updated_at: "2026-08-11T06:43:18.894Z"
    last_updated_by: "spec-author"
    recent_action: "Applied fact-checked fork docs; found and cleaned a stray-artifact gap"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: new child 009 under 039 — distinct workstream, not a reopen of Complete 008."
      - "Fact-checking the GPT draft found 2 inaccuracies from fact-sheet gaps, both corrected before applying."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-fork-attribution-and-changelog |
| **Completed** | 2026-08-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both vendored Pi extensions now disclose in their own README that they are forks, with a link to a standalone `CHANGES-FROM-UPSTREAM.md` documenting exactly what changed and why. `pi-cache-optimizer`'s stale, never-updated `README.zh-CN.md` is removed. Every claim in both new documents is checked line-by-line against the already-verified evidence from phases 003, 006, and 008 — nothing was re-investigated from scratch, and nothing unverifiable was added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/pi-cache-optimizer/README.zh-CN.md` | Deleted | Stale translated README, never updated for the fork's own patch |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modified | Added a "Fork" section (+ `## Contents` entry) disclosing the `jiangge/pi-cache-optimizer` v2.8.0 → `MichelKerkmeester/pi-cache-optimizer` fork and linking to the changes document |
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Created | Fork identity, the exact patch (predicate + 6 hook guards + 1 test + a later test-file addition), why, and verification evidence |
| `.pi/extensions/deep-pi/README.md` | Modified | Added a "Fork" section directly after the existing "## Attribution" section, disclosing that the local copy has diverged from the vendored `christopherarter/deep-pi` commit and that the README's own install command installs the unmodified original |
| `.pi/extensions/deep-pi/CHANGES-FROM-UPSTREAM.md` | Created | Upstream identity plus three rounds of local changes (diagnostics fixes, correctness floor, observability/economics/maintainability) and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The user directed using GPT. All ground truth — fork identities, commits, and the complete verified change list for both forks — was gathered first by reading `vendored-fork-provenance.json` and the implementation-summary.md files of phases `003-fork-and-guard-cache-optimizer`, `006-fork-and-improve-deep-pi/{001,002,003}`, and `008-implement-fork-improvements/{001,002,003}`. That fact sheet was handed to a `gpt-5.6-sol` dispatch (cli-codex, high reasoning, fast tier, workspace-write sandbox scoped to a scratch directory) with an explicit instruction not to invent or embellish beyond the given facts and not to run any npm/git/pi command.

The draft was not trusted at face value. Fact-checking against the same source phase evidence found 2 real inaccuracies — both traceable to gaps in the fact sheet I supplied, not to the drafting model:

1. The deep-pi draft implied the `pi-cache-optimizer` ownership guard was added as part of the same round that added the combined-host composition test. The guard itself was added earlier, in that fork's own patch (phase 003); the later round added test coverage exercising it, not the guard.
2. The `pi-cache-optimizer` draft omitted two test files (`tests/ownership-composition.test.ts`, `tests/hook-guards.test.ts`) that were actually added to that fork's own tree alongside the `package.json` test-runner change.

Both were corrected in the scratch files before anything was applied to the real README/changelog locations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegate drafting to GPT, not the fact-gathering | The user directed using GPT; drafting from an already-fixed, already-verified fact sheet is a safe delegation because every sentence is checked against that same fact sheet before being applied — the drafting model cannot introduce an error the verification pass won't catch |
| Place the deep-pi "Fork" section after, not instead of, "## Attribution" | The existing Attribution section correctly credits the two-hop upstream lineage (`jrimmer/pi-deepseek-optimized` → `christopherarter/deep-pi`); this phase's job is the narrower, different claim that the copy in this repo has since diverged from `christopherarter/deep-pi` itself, not to restate or alter the existing credit |
| Name the documents `CHANGES-FROM-UPSTREAM.md`, not `CHANGELOG.md` | A plain `CHANGELOG.md` reads as a release history; the actual content is a diff-against-upstream narrative, which the more explicit name signals correctly |
| Use only "Round 1/2/3" labels in deep-pi's changes document | Comment-hygiene discipline: internal phase/packet identifiers are ephemeral and don't belong in a document meant to be read by someone unfamiliar with this repo's own spec-folder structure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fact-check of both `CHANGES-FROM-UPSTREAM.md` documents against phase 003/006/008 evidence | PASS — 2 inaccuracies found and corrected before applying (see How It Was Delivered) |
| deep-pi's existing "## Attribution" section unchanged | PASS — re-read after edit, text identical; "## Fork" appended immediately after |
| pi-cache-optimizer's `## Contents`/anchors resolve | PASS — `[Fork](#fork)` added as the first entry; all 13 anchors resolve |
| `README.zh-CN.md` removed | PASS — file absent, `git status` shows it deleted |
| Secret scan on all 4 new/changed documents | PASS — zero matches |
| pi-cache-optimizer `npm test` (unaffected by doc-only change) | PASS — 34/34, 8 suites |
| deep-pi `npm test` (unaffected by doc-only change) | PASS — 81/81, 11 files |
| `git status --porcelain` scope, both extension directories | PASS — exactly the 5 intended file changes after cleanup (see below) |
| `validate.sh --strict` on this folder | PASS — 0 errors, 0 warnings |
| `validate.sh --recursive --strict` on the whole `039` packet | PASS — 0 errors, 0 warnings across all 10 folders |

### Stray-artifact gap found and closed

The first `git status` scope check used an exclusion filter left over from the previous session's cleanup (`grep -v "^?? \.pi/extensions/"`), which unintentionally hid any stray path nested under `.pi/extensions/` — including exactly the kind of artifact it was meant to catch. Re-running without that filter found `.pi/extensions/deep-pi/.pi/{deep-pi-stats.json,deep-pi-report.json}` and repo-root `.pi/deep-pi-stats.json` plus its `.tmp` sibling, all stale all-zero test byproducts (`updatedAt` timestamps of `2026-08-08T09:45:36Z`/`09:57:42Z`, identical content to what a prior session's cleanup pass had already removed once). Removed again; re-ran the full deep-pi suite (81/81) and confirmed with `find .pi/extensions -type d -name ".pi"` that no test run recreates them — the earlier fix to `tests/fake-pi.ts`'s default `cwd` holds. Final sweep across the whole repo, not filtered to any one extension, is clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`CHANGES-FROM-UPSTREAM.md` is a point-in-time document, not a live changelog.** If either fork's source changes again without a corresponding update to its changes document, the two will silently drift — there is no automated check tying them together (unlike the separate `check-vendored-fork-provenance.mjs` script, which only verifies file-content hashes, not documentation accuracy).
2. **pi-cache-optimizer's fork is not upstreamed.** Same limitation phase 003 already recorded: pulling future fixes from `jiangge/pi-cache-optimizer` still requires a manual diff-and-reapply against the vendored copy.
<!-- /ANCHOR:limitations -->
