# Review Report: Changelog Completeness & Accuracy (v3.4.2.0 -> v3.5.0.0 + nested 026)

- **Date:** 2026-06-05
- **Reviewer:** deep-review (10 iterations), executor `cli-opencode openai/gpt-5.5-fast --variant high`, plus deterministic cross-reference + round-2 adversarial verification by the orchestrating agent (Opus).
- **Mode:** READ-ONLY. Findings only, no fixes applied.
- **HEAD:** `06e884ed48`
- **Scope (user-chosen):** full range `v3.4.2.0 changelog (0e23f5e481) -> HEAD` (258 commits), checking whether `.opencode/changelog/system-spec-kit/v3.5.0.0.md` plus the nested 026 changelog tree captured all work since `v3.4.2.0.md`, accurately.

---

## Verdict

**Yes, the work is captured. No fabrication, no missing substantive content.** The release changelog is exact and accurate for its window; the nested 026 leaf changelogs cover the shipped work. The defects found are concentrated in two narrow places: (1) a small number of **post-window commits** documented only in nested changelogs (or not at all), and (2) **stale per-track ROOT ROLLUP index files** left behind by the changelog-tree flatten reorg.

- **0 P0** (nothing false or invented).
- **5 P1** (confirmed by adversarial re-verification).
- **5 P2** (minor wording / house-voice / link drift).
- **2 UNCERTAIN** (1 resolved in the changelog's favor; 1 left open).

---

## Deterministic verification (orchestrator, ground truth)

Every quantitative claim in `v3.5.0.0.md` was checked against the repo. **All matched.**

| v3.5.0.0 claim | Verified value | Result |
|---|---|---|
| 240 commits in `0e23f5e481..9f1a90fdca` | 240 | EXACT |
| Commit ledger contains every in-window hash exactly once | 240/240, 0 stray | EXACT |
| 8,259 files, +810,759 / -2,132,728 (range diff) | 8259 / +810759 / -2132728 | EXACT |
| Type breakdown 97 docs / 61 fix / 39 feat / 18 chore / 15 refactor / 5 test / 5 merge | identical | EXACT |
| MCP serverInfo 1.7.2 -> 1.8.0 (`159b08708a`) | package.json = 1.8.0 | VERIFIED |
| checkpoint schema v29 (`966a75c3be`) -> v30 (`203fb19cbc`) | commits present, match | VERIFIED |
| causal coverage 39.91% -> 43.59%, `caused` 3 -> 103 (`bb61e8864e`) | sourced in `changelog-026-relation-backfill-review-remediation.md` (not commit body) | VERIFIED (see UNCERTAIN-1) |
| 694 changelogs centralized (`ba30de499c`) vs current 763 | +69 from later backfills/authoring | RECONCILABLE |
| 77 stale paths (`7c8da37a76`) + 92 remapped (`addb8cce9f`) | commits exist with exact subjects | VERIFIED |
| timeline section D link index non-empty | 695 changelog links | VERIFIED |

**Bottom line on the release changelog itself: clean.** Its window (`0e23f5e481..9f1a90fdca`) is internally complete and every metric is honest.

---

## P1 findings (confirmed)

### P1-1 — Post-window docs/config drift remediation has no changelog
- **Evidence:** commit `a8e180a222` (25 files: runtime configs, READMEs, feature catalog, playbook). The only matching changelog is `changelog-000-015-docs-drift-review.md`, which is the read-only *review* and states the reviewed docs were left untouched. `a8e180a222` is referenced in no changelog body.
- **Why it matters:** the actual remediation work is undocumented. Post-window (this session), so legitimately absent from v3.5.0.0, but it has no nested changelog either.
- **Confidence:** 0.92.

### P1-2 — Gemini runtime-surface removal has no dedicated changelog
- **Evidence:** commit `8683890935` deletes 291 checked-in `.gemini` surface files (+27 config edits). No changelog references `8683890935`; nested files only mention gemini in passing (doctor/install docs).
- **Why it matters:** material operator-surface removal with no record. Post-window chore work.
- **Confidence:** 0.90.

### P1-3 (DOWNGRADED to P2/exempt) — 027 research packet shows `(none)` in timeline section D
- **Evidence:** timeline line 878 lists `003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation` with `(none)` changelog. Created by `6c462c5a51`.
- **Re-verification:** `6c462c5a51` is a **deep-research** packet. Per the distributed-governance rule, workflow-owned research markdown is changelog-exempt, and the code it produced (`3d1667dd68`) IS covered by `changelog-006-015-socket-server-reconvergence-and-hardening.md`. **Expected, not a defect.**

### P1-4 — 006 operator-tooling ROOT ROLLUP is stale with broken links
- **Evidence:** `changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:21,30-31`. The summary claims coverage "2026-04-23 to 2026-05-26", and links child groups 004/005 to pre-flatten paths `./../004-runtime-agnostic-session-lifecycle-scripts/changelog/` and `./../005-worktree-per-session-automation/changelog/` that no longer exist after the tree was flattened. The real files are flat in-dir (`changelog-006-004-*`, `changelog-006-005-*`, dated 2026-06-01/06-03).
- **Why it matters:** the authoritative operator-tooling index points at dead directories and understates the coverage window. Leaf content exists; the index is wrong.
- **Confidence:** 0.93.

### P1-5 — 007 daemon-reliability ROOT ROLLUP omits the 014/015 child rollups
- **Evidence:** `changelog/007-mcp-daemon-reliability/changelog-007-mcp-daemon-reliability-root.md` mentions neither `014` nor `015`, yet `changelog-014-infra-memory-db-and-graph-churn-root.md`, `changelog-015-infra-followup-hardening-root.md` and 8 child files exist in the same directory (2026-06-01 daemon-lifecycle, substrate, worktree child-marker, SessionStart-guard work).
- **Why it matters:** the root index claims an authoritative child inventory through 2026-05-31 but is missing shipped follow-up rollups.
- **Confidence:** 0.95.

### P1-6 — Stale `TBD` validation verdict in a nested leaf changelog
- **Evidence:** `changelog/003-memory-and-causal-runtime/changelog-016-004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity.md:63` shows `strict validation | TBD | Pending final packet validation`. Commit `3e92f88627` body records `validate.sh phase 010/002/004 --strict: PASSED (0 errors, 0 warnings)`.
- **Why it matters:** the changelog says validation is pending when it actually passed. Single-cell content inaccuracy.
- **Confidence:** 0.95.

---

## P2 findings (minor)

- **P2-1 (`v3.5.0.0.md:63`):** "single 605-line change in the checkpoint storage layer" uses total insertions; `f86a80ca65` numstat shows the storage file at 413+/25- plus a separate 192-line suite. Wording, not a factual error. (i03, 0.92)
- **P2-2 (`v3.5.0.0.md:124`):** "`75a1cc00b7 / 01a3063ca8` ... 12 cli-*/sk-* skills" over-compresses scope; `01a3063ca8` specifically covers skill-advisor, ai-council, mcp-click-up. Work exists; narrative slightly imprecise. (i04, 0.86)
- **P2-3 (002 root rollup):** `changelog-002-spec-kit-internals-root.md:30-32` links 004/005/006 child groups to pre-flatten `../*/changelog/` dirs that do not exist (same class as P1-4, smaller blast radius). (i07, 0.96)
- **P2-4 (020-026 cohort house voice):** `changelog-020-lease-socket-path.md:24`, `changelog-023-semantic-relation-inference.md:33`, `changelog-026-relation-backfill-review-remediation.md:26` retain Oxford-comma constructions against the no-serial-comma house voice. (i09, 0.90)
- **P2-5 (`v3.5.0.0.md:148`):** quotes the marker as "later-removed" (hyphenated); the 12 nested sidecar notes use "later removed" (no hyphen). Substantively covered, wording mismatch. (i10, 0.95)

---

## UNCERTAIN

- **UNCERTAIN-1 (resolved in changelog's favor):** `v3.5.0.0.md:44` attributes `39.91% -> 43.59%` and `caused 3 -> 103` to `bb61e8864e`, whose commit body does not contain those numbers. The orchestrator confirmed the figures are recorded in `changelog-026-relation-backfill-review-remediation.md` (the executed production backfill). The claim is true; only the in-changelog attribution-to-commit is loose. No action required beyond optional citation tightening.
- **UNCERTAIN-2 (open):** `changelog-026-relation-backfill-review-remediation.md:56` cross-model triple-verification claim could not be confirmed from `bb61e8864e` stat or the packet markdown the executor read. Worth a spot-check if the 020-026 cohort is revisited.

---

## Systemic theme (the one thing worth fixing)

P1-4, P1-5, and P2-3 are the same root cause: **the per-track ROOT ROLLUP index files were not refreshed when the 026 changelog tree was flattened to one-subdir-level / flat-files-per-track.** They still link to the old `../NNN/changelog/` nested directory shape and stop at pre-flatten dates, so they under-report and mis-link the (complete, present) leaf changelogs. The leaf layer is healthy; the index layer drifted. A single regeneration pass over the `*-root.md` rollups in tracks 002 / 006 / 007 would clear all three plus P2-3.

---

## Recommendations (not applied — read-only review)

1. **Highest value:** regenerate the stale per-track root rollups (002, 006, 007) so their dates, child inventories, and links match the post-flatten flat-file layout. Clears P1-4, P1-5, P2-3.
2. Fix the one stale `TBD` cell in `changelog-016-004-*` to `PASSED` per `3e92f88627` (P1-6).
3. Decide on the post-window commits: either author nested changelogs for `a8e180a222` (drift remediation) and `8683890935` (gemini removal), or fold them into a follow-up release rollup. (P1-1, P1-2)
4. Optional polish: P2-1/P2-2/P2-4/P2-5 wording + Oxford-comma sweep on the 020-026 cohort.

**Release-level judgment (from i01, endorsed):** do not extend v3.5.0.0 — its range is fixed at `0e23f5e481..9f1a90fdca`. The ~17 post-window commits belong in a separate follow-up release changelog when one is cut.

---

## Iteration coverage

| Iter | Angle | Result |
|---|---|---|
| 01 | Post-window coverage judgment | 3 raw P1 (P1-1, P1-2 confirmed; P1-3 downgraded) + release judgment |
| 02 | At-a-Glance / metrics accuracy | clean (1 UNCERTAIN, resolved) |
| 03 | Narrative accuracy pt1 (checkpoint/index/proxy) | 1 P2 |
| 04 | Narrative accuracy pt2 (enrichment/causal/embedding/worktree/prompt) | 1 P2 |
| 05 | Narrative accuracy pt3 (program/reorg/bugfix/upgrade/verification) | CLEAN |
| 06 | Nested coverage tracks 003 + 000 | CLEAN |
| 07 | Nested coverage tracks 002 + 004 | 1 P2 |
| 08 | Nested coverage tracks 001 + 005 + 006 + 007 | 2 P1 (P1-4, P1-5) |
| 09 | Nested changelog accuracy spot-check (AI-authored risk) | 1 P1 (P1-6) + 1 P2 + 1 UNCERTAIN |
| 10 | Root <-> nested <-> timeline reconciliation | 1 P2 |

Raw executor outputs preserved under `iterations/`.
