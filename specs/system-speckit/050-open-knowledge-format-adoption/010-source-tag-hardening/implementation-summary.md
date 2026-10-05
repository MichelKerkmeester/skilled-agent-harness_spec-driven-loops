---
title: "Implementation Summary: Phase 10: source-tag-hardening"
description: "SOURCE_TAGS now reads a tag's path whole and gives gitignored material one result wherever it runs: 754 false warnings gone on the 20 comparison packets, 100% planted recall, and moved, past end and gone measured at 98%, 100% and 100%."
trigger_phrases:
  - "source tag hardening summary"
  - "planted recall result"
  - "ignored folder result"
  - "two checkout comparison"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening"
    last_updated_at: "2026-10-04T18:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed tag paths and ignored folders; measured"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files:
      - "measurement-protocol.md"
      - "scratch/samples/accuracy.json"
      - "scratch/planted-result.json"
      - "scratch/two-checkout-diff.json"
      - "scratch/runtime-guard-final.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 10: source-tag-hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-source-tag-hardening |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `[SOURCE:]` tag that cites `REPO RULES.md:88` now passes, and a tag pointing into a gitignored folder no longer passes in the main checkout and warns in a worktree. On the 20 comparison packets, 754 warnings disappeared and no new one appeared; every removed warning was a gone or guessed tag that was a spaced path or ignored material.

### Phase 10: source-tag-hardening

`check-source-tags-helper.mjs` splits a tag on commas and semicolons and hands each citation the words before it, cut after any backtick, quote or bracket, as a lead the shared resolver joins into a spaced path. A tag whose resolver result leaves room for an untracked file is asked of `git check-ignore` once per distinct path; any ignored candidate settles it as ignored, which is counted on an `IGNORED` line and never warns. Candidates that pass through a symlinked directory are dropped first, because git refuses them with a fatal error.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Modified | Whole-tag leads, ignored-folder result, symlink filter, deduplicated `check-ignore` input, `IGNORED` count |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Modified | Eight tests: three lead cases, the semicolon and backtick case, ignored present and absent, a gone path outside any ignored folder, a symlinked folder, and an end-to-end `REPO RULES.md:88` pass |
| `measurement-protocol.md` | Created | Sizes, seed 20261004, planted classes and thresholds, fixed at 2026-10-04T12:22Z |
| `scratch/` | Created | Baseline helper copy, per-packet runs, row harness, samples, planted fixture, checkout diff, run-time guard |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six changes, each written by SWE 2 max and checked here before the next one went out: whole-tag leads, ignored folders, the symlink filter, semicolons and backticks, deduplication, and the end-to-end test. Measurement found two of them. The symlink fatal surfaced when the first ignored-folder build exited 2 on 9 of the 20 packets; the deduplication came from the run-time guard.

**Before and after** (20 packets, cutoff lifted, `scratch/baseline-runs/` and `scratch/final-runs/`):

| | Checked | Moved | Gone | Guessed | Past end | Ignored |
|---|---|---|---|---|---|---|
| Baseline helper | 5,860 | 1,748 | 1,575 | 1,040 | 44 | — |
| Current helper | 5,860 | 1,748 | 989 | 872 | 44 | 708 |

Of the 754 removed warnings, 47 now resolve to `REPO RULES.md`, all in range, matching the 47 the spec counted. 659 tags are ignored by their plain path and 49 only through a spaced form; 42 of those 49 name a file that exists in the main checkout, 3 point at an absent file inside the ignored `specs/**/context/` folder, and 4 are home-folder paths (`~/.local/lib/node_modules/@ …`) that the unanchored `node_modules/` pattern matches. An independent harness (`scratch/tag-rows.mjs`) reproduces the helper's warning set exactly.

**Accuracy** (`scratch/sample-and-check.py`, seed 20261004, pool = the helper's warnings):

| Class | Pool | Sample | Right | Accuracy | Wilson 95% | Threshold |
|---|---|---|---|---|---|---|
| Moved | 1,748 | 50 | 49 | 98% | 89.5–99.6% | 95% |
| Past end | 44 | 44 (all) | 44 | 100% | 92.0–100% | 95% |
| Gone | 989 | 50 | 50 | 100% | 92.9–100% | 90% |

Each point estimate meets its threshold; the moved lower bound, 89.5%, does not. Gone by cause over all 989: deleted 582, renamed without a redirect rule 245, never existed 162. Guessed (50 rows, labeled with phase 009's rows): both labelers called 9 intended (9.8–30.8%) and 11 not intended, and the rest split; the disputed rows sit in phase 009's operator file.

**Planted recall** (`python3 scratch/planted.py <repo>`): 10 tags per bad class, recall 100% for moved, gone, past end and guessed (Wilson 72.2–100% each). No warning on 10 controls, 5 of them `REPO RULES.md:88`, or on 10 ignored tags, 5 present and 5 absent. The baseline helper on the same fixture warned on all 5 `REPO RULES.md:88` controls and on the 5 absent ignored tags.

**Two checkouts at one commit.** The operator chose a temporary detached worktree at main's commit `93a83a466b0b`, which holds no gitignored material, as the counterpart to the main checkout, which does. The fixed helper ran read-only over the 20 packets in both: 5,860 checked, 708 ignored and the same warnings line for line (`scratch/onecommit-tempwt/`, `scratch/onecommit-main/`). The baseline helper on the same pair gave 366 more gone warnings in the checkout without the material, 1,602 against 1,236. The 749 shared artifact files are byte-identical; main also holds 8 gitignored copies under 062's `containment/baseline/` with no `[SOURCE:]` tag. The temporary worktree was removed and pruned afterwards. An earlier run against this worktree's own commit, 38 commits behind main, showed 27 differences, each citing one of 7 files that four commits on main deleted (`scratch/two-checkout-diff.json`).

**Default cutoff.** All 20 packets give the same output before and after, each a SKIP.

**Run time** (`scratch/runtime-guard-final.json`, accepted by `decision-record.md` ADR-001, median of three interleaved runs per packet): the 20 packets together went from 24.13 s to 26.01 s, +7.8%, and the median packet grew 6.3%. Two packets exceed the protocol's 20% per packet: `037-graph-engineering/003-graph-arch` +30.9% (1.32 s to 1.73 s) and `027-xce-research-based-refinement` +22.7% (1.31 s to 1.61 s). Before deduplication the total was +26.7% and the worst packet +169%.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split on semicolons too, and cut the lead at quotes and brackets | Real tags read `` [SOURCE: `README.md:20-30`; `REPO RULES.md:36-50`] ``; the protocol names commas only, so this widens its rule, and it was made before any sample was drawn |
| Drop symlinked candidates instead of falling back per path | A single fatal path fails the whole batch; a dropped candidate counts as not ignored, the same as before the change |
| Keep every lead suffix in the ignore check | Sending only the whole-lead form would cut the cost further but change which tags count as ignored after the samples were drawn |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Protocol precedes data | PASS. sha256 `553e93dce30dcfb7…` unchanged; file time 12:22:56Z precedes every result file |
| Helper tests | PASS. `check-source-tags.vitest.ts` 17 passed (baseline 9); `vitest --project cli` on the final state: 160 files, 1,671 passed, 0 failed, 19 skipped |
| Accuracy thresholds | Point estimates PASS for all three; moved lower bound 89.5% < 95% |
| Planted recall | PASS. 100% per class, 0 warnings on controls and ignored |
| Two checkouts at one commit | PASS. Identical output at `93a83a466b0b`; baseline differs by 366 warnings |
| Default cutoff | PASS. 20/20 identical |
| Run time per packet | 2 of 20 packets over the 20% cap, total +7.8%; accepted by ADR-001 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Unanchored ignore patterns can match prose.** A spaced form built from prose words can hit a pattern such as `node_modules/`; 4 home-folder tags count as ignored this way.
2. **Two packets run more than 20% slower.** The cost is `git check-ignore` at about 0.8 ms per distinct path on this repository's `.gitignore`.
3. **The comparison used a temporary worktree, not this branch.** This branch is still 38 commits behind main, and main rewrote `cite-drift-scan.mjs` in `d29f0d1c57`; merging is the operator's call under D4.
<!-- /ANCHOR:limitations -->
