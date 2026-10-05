---
title: "Implementation Summary: Phase 9: census-hardening"
description: "The census now resolves paths with spaces, runs in 29% of its old time and can rebuild its redirect table byte for byte; moved, past end and gone measured 98%, 100% and 100% on samples drawn after a dated protocol."
trigger_phrases:
  - "census hardening summary"
  - "citation accuracy result"
  - "spaced path fix"
  - "redirect table rebuild"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/009-census-hardening"
    last_updated_at: "2026-10-05T06:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "A three-family panel settled 33 of the 40 disputed guessed rows"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "measurement-protocol.md"
      - "scratch/samples/accuracy.json"
      - "scratch/labels/agreement.json"
      - "scratch/labels/panel/panel-scored.json"
      - "decision-record.md"
      - "scratch/timing/timing.log"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 9: census-hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-census-hardening |
| **Completed** | 2026-10-05 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The citation census now reads `REPO RULES.md:88` as the file it names, finishes a full run in about 3.6 minutes instead of 12, and can rebuild its redirect table from git history to the byte. Each class it prints carries a measured accuracy: moved 98%, past end 100% and gone 100%, from samples drawn after the protocol was fixed.

### Phase 9: census-hardening

Three changes landed in `cite-drift-scan.mjs`, each written by SWE 2 max and checked here before the next one went out. A citation now borrows up to three words before it on the line, and a spaced path counts only when the whole joined name is a tracked file. The census reads committed docs through `git cat-file --batch` in chunks of 1,000 paths instead of one `git show` per doc. And `--rebuild-redirects <out>` regenerates the redirect table.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modified | Spaced-path lead and resolution, batched committed reads, `--rebuild-redirects` |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modified | Five tests: spaced path, spaced prose negative, prefetch with a multi-byte doc, rebuild writes a loadable table, rebuild outside a repo returns 2 |
| `measurement-protocol.md` | Created | Sizes, seed 20261004, ground-truth rules and thresholds, fixed at 2026-10-04T12:22Z |
| `scratch/` | Created | Baseline scanner copy, row-level census, samples, labels, timing |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Baseline.** A copy of the unchanged scanner in `scratch/baseline-scanner/` differs from the original only in three absolute paths. Its census at `5285608745fe` matches an earlier run of the original scanner on every line but one, a worktree file whose line count changed between the two runs.

**Spaced paths.** `scratch/census-rows.mjs` gives one row per citation with the module's own resolver, and its totals equal the census total line. After the fix, 439 citations moved from unresolved to in range, all of them `REPO RULES.md`, 4 of them `REPO RULES.md:88` (`scratch/space-fix-delta.jsonl`). No other status changed.

**Accuracy.** `python3 scratch/sample-and-check.py <repo> scratch/rows-after.jsonl scratch/samples` draws the protocol samples with seed 20261004 and checks each row against git: rename history for moved, line counts for past end, and presence, ignore rules and history for gone.

| Class | Pool | Sample | Right | Accuracy | Wilson 95% | Threshold |
|---|---|---|---|---|---|---|
| Moved | 27,320 | 100 | 98 | 98% | 93.0–99.4% | 95% |
| Past end | 677 | 100 | 100 | 100% | 96.3–100% | 95% |
| Gone | 45,338 | 100 | 100 | 100% | 96.3–100% | 90% |

Each point estimate meets its threshold. The moved interval's lower bound, 93.0%, sits below 95%, so the sample cannot rule out a true rate a little under the threshold. The two wrong moved rows: one cites `sk-prompt/prompt-improve/README.md` and lands on the hub `README.md`, a different file; the other reaches the right consolidated `tasks.md` from a `.opencode/specs/…` path that never existed in history, which the protocol's rename rule counts as wrong.

**Gone by cause**, over the whole class of 45,338: never existed 28,610, deleted 14,330, renamed with no redirect rule 2,349, under an ignored folder 48, and one row tracked in the index but missing from the worktree. No row is a parser miss. The 2,349 renamed rows are files that moved without a rule wide enough to cover them; by the protocol's definition they are correctly gone, and they are the census's largest blind spot.

**Guessed.** Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max each labeled the same rows from the citing line, two lines either side and the candidate paths. DeepSeek ran through cli-devin `deepseek-v4-1-flash-max`, because the cli-opencode Go route returned "requires Global regions" and the Cline route carries no max tier. On the 100 census rows, both labelers called the guess intended for 62 (52.2–70.9%): 46 of 50 `basename_only` rows (81.2–96.8%) and 16 of 50 `ambiguous` rows (20.8–45.8%). Over all 150 guessed rows, with phase 010's 50 included, Cohen's kappa is 0.31 and observed agreement 60%; most disagreement is Luna answering can't tell where DeepSeek answers intended (43 rows). Kappa below 0.6 raised the operator cap to 40 rows, written to `scratch/labels/operator-rows.md`.

**Guessed, panel verdict.** At the operator's request, ADR-001 in `decision-record.md` replaced the operator labels with a panel of three families that never saw these rows: SWE 2 max, GLM 5.3 Flash max and Gemini 3.8 Flash high. Each labeled the 40 rows blind. `python3 scratch/labels/score-panel.py` settles a row on two matching labels, and an `intended` majority on an ambiguous row also needs a matching path. The panel settled 33 of 40: 15 intended, 12 not intended, 6 can't tell, with 7 unsettled. Five of the 7 are ambiguous rows where SWE and GLM both answered intended but named different files. The three models agree less than Luna and DeepSeek did: SWE and GLM agree on 18 of 40 labels, GLM and Gemini on 18 and SWE and Gemini on 12. SWE called 34 of the 40 intended, GLM 20 and Gemini 8; Gemini called 26 not intended.

Each panel verdict replaces the disputed row's label, and every other guessed row keeps the label Luna and DeepSeek share. That puts the census's guessed class at 75 intended of 93 settled rows, **80.6% (71.5–87.4%)**, with 7 rows unsettled; over all 100 rows, unsettled counted as not intended, it is 75% (65.7–82.5%). This is a panel verdict, what three models agree the author meant, not a ground truth, and the protocol sets no threshold for this class (`scratch/labels/panel/panel-scored.json`).

**Timing** (`bash scratch/timing.sh <repo>`), three runs per arm, interleaved at one commit and worktree state:

| Arm | Runs (s) | Median |
|---|---|---|
| Baseline copy | 735.6, 742.5, 728.4 | 735.6 s |
| Current scanner | 206.9, 217.7, 214.9 | 214.9 s |

The current median is 29% of the baseline median; the target was at most 50%. Each arm gave the same sha256 on all three runs, and the two outputs differ on exactly 7 lines: five track lines, the specs family line and the total line, each with `in_range` +n and `unresolved` −n, summing to the 439 spaced-path rows. No current-scanner run wrote a file (`git status` and a newer-than-marker sweep before and after each run).

**Rebuild.** `node cite-drift-scan.mjs --rebuild-redirects scratch/rebuilt-redirects.json` at `5285608745fe`, the commit the table records, wrote 455,348 records and 701 rules in 137 s, with sha256 `6ef622e2…` equal to the committed table.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read in chunks of 1,000 paths, not one batched read | The corpus is 32,037 docs and 250 MB, near the scanner's 256 MB buffer; 33 chunks keep each reply about 8 MB. This departs from the protocol's wording "one batched read" |
| Cap the lead at three words in the census, but not in the resolver | Prose rarely needs more, and phase 010 passes a tag's whole path span through the same resolver |
| Route DeepSeek through cli-devin | The Go route refused the model and the Cline route lacks a max tier; the operator named Devin as a DeepSeek route |
| Label in batches of 10 and 5 | At max effort DeepSeek ran out of output tokens on 150, 50 and 25 rows; every row was labeled in the end |
| Settle the disputed rows by a model panel, not operator labels | The operator asked for models, then swapped DeepSeek for Gemini so no panelist re-judges rows it labeled (ADR-001) |
| Move GLM from cli-pi to cli-devin, then to LLM Gateway | Go-route calls stalled, Devin truncated 5-row calls and then ran out of daily quota; each move kept the model and the brief, and `scratch/labels/panel/runs.log` records every call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Protocol precedes data | PASS. sha256 `8afc427486f599ac…` unchanged; file time 12:22:56Z, first result file 14:24:09 local (12:24Z) |
| Scanner tests | PASS. `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`: 50 passed, 0 failed (baseline 45); 61 passed, 0 failed after the merge with main, rerun 2026-10-05 |
| Accuracy thresholds | Point estimates PASS for all three; moved lower bound 93.0% < 95% |
| Timing | PASS. 214.9 s against 735.6 s, 29% |
| Output identity | PASS. Only the 7 spaced-delta lines differ |
| Default run writes nothing | PASS. 0 files written on three current-scanner runs |
| Rebuild | PASS. sha256 identical |
| Disputed guessed rows | PANEL VERDICT. 40 of 40 rows carry three votes; 33 settled, 7 unsettled (`scratch/labels/panel/panel-scored.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The guessed class rests on model judgment.** Kappa 0.31 between Luna and DeepSeek and 12 to 18 matches out of 40 between panelists show the same evidence reads differently to different models. The 80.6% is a panel verdict with 7 rows unsettled, and operator labels can still override any row.
2. **Renamed files without a rule read as gone.** 2,349 gone rows point at files git shows were renamed; a narrower rule set or a file-level rename map would turn many of them into moved.
3. **The lower bound on moved is below 95%.** A larger sample would narrow it; the protocol fixed 100.
<!-- /ANCHOR:limitations -->
