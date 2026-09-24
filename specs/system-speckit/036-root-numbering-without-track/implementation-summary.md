---
title: "Implementation Summary"
description: "A packet made at the specs root without --track now numbers after every folder in that root and every packet branch git already knows, where before each differently named packet started at 001. Scaffolding no longer fetches or prunes remotes."
trigger_phrases:
  - "create.sh root numbering"
  - "duplicate packet number 001"
  - "scaffold prunes remote-tracking refs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-root-numbering-without-track"
    last_updated_at: "2026-09-24T09:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Replaced the per-name, fetching numbering with a ref-only scan of folders and packet branches"
    next_safe_action: "Push the fix and this record"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/git-branch.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-root-numbering-without-track"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-root-numbering-without-track |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two packets made at the same specs root no longer share a number, and making one no longer touches the network or your refs.

### Number create.sh packets at the specs root from the highest existing number

Without `--track`, `create.sh` used to count only the folders and branches that shared the new packet's short name, so each new name started at 001. It now takes the highest numbered folder in the root and, because a root packet's branch shares that numbering, the highest branch named with three digits and a hyphen among your local branches and the remote-tracking refs already present. The next packet gets that number plus one.

The old count also ran `git fetch --all --prune` each time. That made every scaffold wait on the network and deleted any remote-tracking ref the remote had dropped, which is a surprising thing for a scaffolder to do. Nothing is fetched now. A track still numbers from its own folder, exactly as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/lib/git-branch.sh` | Modified | `check_existing_branches` replaced by `highest_branch_number`, which reads refs and fetches nothing |
| `runtime/cli/spec/create.sh` | Modified | Root numbering from the highest folder, plus the highest packet branch when there is no track |
| `runtime/cli/tests/create-root-numbering.vitest.ts` | Created | Five cases, each in a throwaway git repository |

Paths are under `.skilled/skills/system-spec-kit/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect was reproduced first in a throwaway repository: two scaffolds both came out as 001, and one scaffold deleted `refs/remotes/origin/020-remote-work` from a repository whose bare remote lacked it. The test was written against that behaviour and ran red on every case. The first fix counted any leading digits, and a sketch of the limitations showed it would read `2026-09-24-hotfix` as packet 2026. A fifth case caught that red before the pattern was narrowed to three digits. One commit carries the fix and its test, and a second carries this record.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop the fetch and read only the refs git already has | The operator's call. A scaffold should need no network and change no refs, and a fetch beforehand still counts newer branches |
| Count branches only without a track | A track numbers from its own folder, and branch names carry no track |
| Count only names that start with three digits and a hyphen | That is the shape `create.sh` gives its own branches, and it keeps dates and other digit-led names out |
| Isolate the test's fixture commits from global hooks with `core.hooksPath=/dev/null` | A global hook path applied this repository's commit gates to the throwaway one and failed the fixture, not the code under test |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `create-root-numbering.vitest.ts` | PASS, 5 tests. All 5 failed before the fix, the date case against the first version of it |
| Branch count removed on purpose | The two branch cases failed and the folder cases passed, then it was restored |
| `cli` vitest project | PASS, 1472 tests, 19 declared skips |
| `npm run test:legacy` and `npm run test:validation` in `runtime/cli` | PASS, both |
| Track numbering test in `spec-root-writer-autosave.vitest.ts` | PASS, inside the `cli` run |
| Search for `git fetch` and `git ls-remote` in `create.sh` and its libraries | None left |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A branch pushed elsewhere since your last fetch is not counted.** Run `git fetch` before scaffolding at the root if another clone may have used the next number.
2. **A branch from unrelated work that happens to start with three digits and a hyphen still counts.** The number it raises is only skipped, never reused, so no two packets collide.
<!-- /ANCHOR:limitations -->

---
