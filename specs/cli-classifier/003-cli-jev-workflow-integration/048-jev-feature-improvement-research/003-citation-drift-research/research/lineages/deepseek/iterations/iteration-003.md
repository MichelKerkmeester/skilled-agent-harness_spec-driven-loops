# Iteration 3: Making the measurement more trustworthy

**Focus:** Q3 — what a careful reader can and cannot verify about the keep, where the residual uncertainty actually sits, and what the record should carry.

## Findings

### F3-01 — The headline p is dominated by the constructed half; the verdict survives either half alone
Splitting the standard replay by row kind settles where the sign test's 22 wins come from: live rows W=6 L=0 (p=0.015625), constructed rows W=16 L=0 (p=1.526e-5), pooled W=22 L=0 (p=2.384e-7). The comparator is right on 13 of 20 live rows and 0 of 20 constructed rows, so 16 of the 22 winning disagreements come from the engineered half. Re-scoring each half alone under the full keep rule: live-only (K=20 M=20 A=19 B=13 W=6 L=0 TP=10 FP=0 F=0) and constructed-only (K=20 M=20 A=16 B=0 W=16 L=0 TP=16 FP=0 F=3) each pass all five checks, so the verdict is not an artifact of either half. What overstates the live evidence is the published p, not the decision. [SOURCE: replay over ~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl + labels with windows reconstructed at row commits; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:700-708]

### F3-02 — Label reliability is computable from committed files, and it is good
The blinded rater drafts and the split table are committed under the 042 scratch (`scratch/drafts/032-luna.jsonl`, `032-swe.jsonl`, `032-arbiter.jsonl`, `032-idmap.json`, `scratch/compare/032-split.jsonl`). Computed from them: three-class agreement Luna-SWE 29/40 (the decisions note's number), Luna-arbiter 29/40, SWE-arbiter 38/40. On the binary scale the measurement actually uses (supports vs anything else): agreement 37/40 (92.5%), Cohen's kappa 0.793 Luna-SWE and Luna-arbiter, 1.000 SWE-arbiter; the three binary splits are R13, R22 and R33, and in all three the arbiter sides with SWE while the decisions note records Luna's error (wrong citation on R13/R33, wrong facts on R22). The committed labels file hashes to `2cbfddfc199d…`, byte-identical to the sha the report recorded. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/drafts/032-*.jsonl; .../compare/032-split.jsonl; .../evidence/labels/032-decisions.md; shasum of .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl]

### F3-03 — The model's two doubtful live answers sit exactly on the two live label splits
Jev's live-side doubt (live-17 at p 0.76-0.78 "shows"; live-18 at 0.50/0.50/0.52) lands on R13 and R22 — two of the three rows where the blind raters split, and in both the arbiter overruled the rater Jev agreed with. Model noise and label noise are not independent here: the residual uncertainty concentrates on the same frontier rows. That does not move the keep (both rows' binary labels are settled at contradicted/supported with the arbiter siding with SWE, and the live-only rule passes either way), but it means any second measurement should pre-register what happens on rows where two blind raters disagree. [SOURCE: replay over calls.jsonl + labels; 042 scratch `032-idmap.json`, `032-split.jsonl`; .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl]

### F3-04 — The comparator cannot see same-file moved windows, which is why B=0 constructed
The identifier-overlap comparator flags only when none of the sentence's backticked tokens appear anywhere in the window. Reconstructing the windows shows the moved windows still contain at least one of the sentence's tokens in 20 of 20 constructed rows (live: 16 of 20), so the comparator never fires where drift was engineered. The 22-win sign test is therefore substantially a statement about a weak syntactic comparator on rows built to defeat it, not a statement about drift detection in general. [SOURCE: window + token reconstruction at row commit ebcc68e8edb4; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:540-564]

### F3-05 — The run record is replayable today, but only because calls.jsonl survived
`report.json` carries the census totals, labels hash, comparators, the column, and the verdict line; the instruction hash and the payload estimate (`estimated input tokens: 40717`) exist only on stdout, the per-skill census lines likewise, and per-row outcomes exist only in `calls.jsonl`, which lives outside the repository by design (it holds doc text). A third party re-derives every count only with all three; with `report.json` alone, per-row error analysis (which rows, which kind) is impossible. The fix is a per-row outcome file in the out dir (id, kind, verdict, three probabilities, final flag) plus the instruction hash, payload estimate, and per-kind columns in `report.json`. [SOURCE: ~/.skilled/.labels/runs/032-jev-20261001/report.json; ~/.skilled/.labels/runs/032-jev.stdout.txt; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:924-948,1374-1391]

### F3-06 — The zero-call half currently reports only sandboxed fixture noise
The two dead citations in the run are both in `manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md` — a SANDBOXED CP-050 scenario doc. One is a range that overshoots the current `SKILL.md` by one line (`:450-459` against 458 lines), the other points past `commands/deep/research.md`. No live guidance document carries a dead citation. The feature's actionable output is therefore entirely the model half; the dead-citation scan, as a product surface, currently has nothing to report. [SOURCE: ~/.skilled/.labels/runs/032-jev.stdout.txt (both `cite dead:` lines); .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md; wc -l .skilled/skills/system-deep-loop/deep-research/SKILL.md = 458]

### F3-07 — The accuracy-critical machinery is untested, and one census defect is live
The test file covers the keep/kill/coverage/margin verdicts and requalification, but at HEAD there is no test for `stop (sign test)`, `stop (flips)`, or a row whose reruns disagree — precisely the paths that decide near-threshold rows. The run stdout also shows the known `.state` defect live: the census prints `skill .state: citations=0 …` because `doc.split('/')[2]` counts every folder under `.skilled/skills/` as a skill. [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs (test roster); ~/.skilled/.labels/runs/032-jev.stdout.txt line 1; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:262]

## Sources Consulted

- 042 committed label evidence: `scratch/drafts/032-luna.jsonl`, `032-swe.jsonl`, `032-arbiter.jsonl`, `032-idmap.json`, `scratch/compare/032-split.jsonl`, `scratch/evidence/labels/032-decisions.md`, `gates.md`
- `~/.skilled/.labels/runs/032-jev.stdout.txt` (full run output: per-skill lines, dead citations, instruction hash, payload estimate)
- Replays over `~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl` + `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`, windows at commit `ebcc68e8edb4`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (`:262`, `:540-564`, `:700-708`, `:924-948`, `:1374-1391`)
- `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`; `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md`

## Assessment

- **newInfoRatio:** 0.9
- **Novelty justification:** The per-kind W/L split, the kappa computation from the committed rater drafts, the frontier-row coincidence, the 20/20 token-presence check, and the recording-gap inventory are all new to this trail.
- **Confidence:** High for F3-01..F3-04 and F3-06 (computed from committed artifacts); high for F3-05/F3-07 (direct reads of the run output and test roster).

## Reflection

- **What worked:** Computing reliability from the actual rater drafts instead of trusting the decisions note; splitting the sign test by kind, which cleanly separates "verdict robust" from "p overstated".
- **What failed:** Nothing attempted failed.
- **Ruled out:** "The keep is an artifact of the constructed half" — ruled out: the live-only half passes all five checks (F3-01). "The blind labels are unreliable" — ruled out on the binary scale (kappa 0.79-1.00; all splits resolved against the documented Luna errors) (F3-02).

## Recommended Next Focus

Q4: Where else in .skilled would the same judgment pay off? Use the census scope (skills only), the 8,667-doc read cost, the existing weaker neighbors (`check-ac-coverage.sh`, `validate_catalog_package.py`), and the corpora that carry `file:line` citations outside the skills tree.
