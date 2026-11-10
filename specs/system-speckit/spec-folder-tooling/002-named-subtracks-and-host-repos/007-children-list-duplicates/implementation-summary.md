---
title: "Implementation Summary: Children List Duplicates"
description: "A packet named twice in a track root's children_ids now counts as drift: the sweep names it and exits 1, and the writer removes the repeat. Skilled's specs root no longer lists two deleted packets, and the Barter host's 17 repeats are cleared."
trigger_phrases:
  - "children list duplicates implementation summary"
  - "declared more than once fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/007-children-list-duplicates"
    last_updated_at: "2026-11-09T20:38:20Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed six alignment findings; track-root tests 28 of 28 pass"
    next_safe_action: "Commit the worktree changes"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts"
      - "specs/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:394ff6f52b748a4c7fdb258ac791862a61a0dbb36bcbd66172c8e99675a48c14"
      session_id: "scaffold-007-children-list-duplicates"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-children-list-duplicates |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A track root whose `children_ids` names one packet twice now fails the sweep, and so the pre-push gate. Before, the list still matched because the reader compared it as a set, so the sweep exited 0 and the writer called it up to date.

### Phase 7: children-list-duplicates

`compareTrackChildren` now returns a sorted `duplicates` list, holds each name once in `declared` and sets `matches` to false when a name repeats. The sweep prints `    declared more than once: <names>` for such a root and counts it as drifted. The writer's dry run says `drop duplicate <names>`, and `--apply` writes the list back with each packet once. List order is still not drift, so an unsorted list that names each packet once matches as before.

Skilled's own `specs/graph-metadata.json` now has an empty `children_ids`. It listed two deleted packets, and a host that mirrors Skilled's specs read them as foreign entries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Modified | `compareTrackChildren` reports repeats and fails `matches` on one |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` | Modified | Prints the `declared more than once` line and counts the root as drifted |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs` | Modified | The dry run names the repeats to drop |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` | Modified | Three new tests: a repeat is reported, the writer removes it, and an unsorted list still matches |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` | Modified | One sentence in section 2 |
| `specs/graph-metadata.json` | Modified | Empty `children_ids`, and `last_active_child_id` no longer names a deleted packet |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | The sweep and writer rows describe the repeat check |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/README.md` | Modified | The reader row names `duplicates` |
| `.skilled/skills/system-spec-kit/changelog/v2.12.39.0.md` | Created | The release entry for this change |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Version `2.12.39.0` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The orchestrator first recorded the baseline: the track-root test file passed 25 of 25, and the `--rev HEAD` sweep over the Barter host exited 0 while printing `backend-system/partners-billing: declared=12 actual=11`.

DeepSeek V4.1 Flash at max effort wrote the five Skilled code and doc files in one dispatch through OpenCode 2.2.5 on the opencode-go route. Its diff touched exactly those five files. The orchestrator edited `specs/graph-metadata.json` by hand. An alignment run then sent three review lanes and a critic on the same model over the change. They found two stale README files, a missing changelog entry, an unbumped catalog version, a dangling pointer in the specs-root metadata and a missing unsorted-list test. The orchestrator fixed all six. It also ran the test file, a wider run over six track files, the pre-push hook tests, `node --check`, an unsorted-list fixture and four direct calls to `compareTrackChildren`.

The Barter follow-through is evidence only, because Barter is a separate repository the operator commits. The fixed writer's dry run named 17 repeats in seven sub-tracks, and `--apply --track <each>` wrote all seven. A second dispatch of the same model added `description.json` and `graph-metadata.json` to `specs/skilled-barter-overlays/`, which the track reader had skipped for lack of metadata. Nothing is committed. The evidence is pinned to base commit `3378c36a06` plus the uncommitted diff of the six files above.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| A repeat is drift, but list order is not | A repeat is a defect in the list. Order carries no meaning, and 15 Barter lists are unsorted with nothing wrong in them |
| The check lives in `compareTrackChildren` only | The sweep and the writer both read `result.duplicates`, so they cannot disagree about what a repeat is |
| Emptied Skilled's specs-root list instead of filling it | Nothing inside Skilled reads that file as a track, and the two entries named packets that no longer exist |
| Left Barter's `skilled` mirror unedited | It is a generated copy of Barter's pinned Skilled commit, so a hand edit would be overwritten on the next sync |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Track-root test file before the change | 25 passed of 25 |
| Track-root test file after the change | PASS: `Tests 28 passed (28)`, exit 0. The three new tests are `reports a packet declared more than once`, `drops a repeated entry on --apply and leaves the sweep clean` and `passes an unsorted list that names each packet once`. A rerun at close gave the same totals |
| Wider run over six files (track-roots, create-track-refresh, archive-track, create-track-containment, validate-subtrack, subtrack-predicate-parity) | PASS: `Tests 141 passed (141)`, exit 0 |
| `bash .skilled/scripts/git-hooks/tests/pre-push.test.sh` | PASS: `pre-push tests: PASS=50 FAIL=0`, exit 0 |
| `node --check` on the three `.mjs` files | PASS: exit 0 for each |
| Unsorted list, two packets in reverse order | PASS: sweep `demo: declared=2 actual=2`, exit 0. Writer `demo: up to date`, exit 0 |
| `compareTrackChildren` cases | PASS: empty list matches. Four repeats of one packet give `duplicates:["001-a"]` and `matches:false`. Unsorted without a repeat matches. A repeat plus a missing packet does not match |
| Barter working-tree sweep after `--apply` | No `declared more than once` line. `backend-system/partners-billing: declared=11 actual=11`, `fe-backoffice-app/auth-access: declared=6 actual=6`, `skilled-barter-overlays: declared=4 actual=4` |
| Strict validation of this phase | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The Barter working-tree sweep still exits 1.** One root causes it: the git-ignored mirror `skilled`, which prints `skilled: declared=0 actual=0 foreign=2` for `999-test-sandbox` and `999-playbook-test-memory-mcp-validation`. The mirror copies Barter's pinned Skilled commit, which still holds the old specs-root list. It clears once this phase merges and Barter re-pins and re-syncs.
2. **A repository with an existing repeat is blocked on its next push.** The pre-push gate runs the same sweep. Its message already names the writer, and one `refresh-track-roots.mjs --apply` run clears it. Skilled's own 26 roots were swept on 2026-11-09 with no count mismatch.
<!-- /ANCHOR:limitations -->

---
