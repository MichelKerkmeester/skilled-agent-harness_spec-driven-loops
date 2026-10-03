# Iteration 2: Raising accuracy and lowering cost

**Focus:** Q2 — where the run's accuracy and cost actually come from, and which levers move either without breaking the pre-registered keep rule.

## Findings

### F2-01 — The model arm is cheap; cost is dominated by the git-heavy census, not by Jev
Replaying `calls.jsonl`: 121 calls (120 row calls + 1 auth test), all exit 0, total wall 40.9s, mean 338ms, p50 326ms, p95 423ms, max 650ms; the auth test alone is 650ms so model time is 40.2s. Reconstructing the payload from the labels' recorded commit (`ebcc68e8edb4`) gives 40 ready rows, 54,289 chars of state+instruction per pass, ~40,717 planned input tokens across the 3 reruns (~13.5k per pass), avg state 1,357 chars/row, max 4,709. By contrast the recorded wall times in 032 are ~171s for the zero-call default census and ~381s for the draw. [SOURCE: ~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl; payload reconstruction over squeezed label rows at commit ebcc68e8edb4; specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/implementation-summary.md:61,72]

### F2-02 — The census reads 8,667 documents to find citations in 82 of them
`buildCensus` walks every tracked `.md` under `.skilled/skills/` and spawns one `git show HEAD:<doc>` per doc (`cite-drift-scan.mjs:251-261`). At HEAD this set is 8,667 files; reading them from the worktree and applying the script's own citation regex outside fences finds citations in only 82 documents (0.95%), 465 occurrences, concentrated in `system-spec-kit/runtime` (159), the three sk-code surfaces (95 combined), `system-skill-advisor/references` (30), `sk-design/benchmark` (27). ~99% of the doc-read work buys nothing. The draw re-reads the same tree through `inRangePools` (`:371-390`) and then per-window `readCommittedLines`, so the cost is paid twice. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:251-261,371-390; worktree scan of `git ls-files .skilled/skills` run by this iteration]

### F2-03 — Accuracy improves substantially with zero extra model calls by changing the aggregation
The scorer's rule is "flag when the modal flag over 3 reruns is true" (`:1161-1167`). Re-scoring the same 120 recorded answers under alternative aggregations: `min(reruns) < 0.5` (yes on any dissenting rerun) moves TP 26→27, FP stays 0, acc 0.875→0.900; `mean(reruns) < 0.6` gives TP=29, FP=1, FN=2 (acc 0.925, precision 0.967, recall 0.935); `mean < 0.65` gives TP=30, FP=1, FN=1 (acc 0.950). The keep rule's precision check tolerates FP up to about TP/4 ≈ 7 (`5*TP >= 4*(TP+FP)`), so all these variants still keep comfortably. The current first-rerun-only scoring would be acc 0.850, so the reruns do earn their keep — but their aggregation is leaving 3-4 caught drifts on the table. [SOURCE: re-scoring replay over ~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl + labels; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:700-708,1157-1174]

### F2-04 — One miss is a payload flaw: the judgment unit is one line, and some lines carry no claim
The state sent per row is `{sentence, target, window}` where `sentence` is only the trimmed line carrying the citation (`:160`, `:1030`). live-17's sentence is `**Evidence**: `.skilled/.../validate.sh:74-77`, `...:340-343`` — a bare evidence pointer inside a style-guide section; the claim lives in the surrounding section, which the model never sees. 3 of the 20 live rows are bare-evidence lines and 4 more are table rows. Jev answered 0.76-0.78 ("still shows") and was scored a false negative; at every threshold up to mean<0.75 it stays missed. Sending the enclosing paragraph/block (nearest preceding prose line plus the citation line) is the fix; excluding claim-less lines from the live draw is the cheap alternative. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl row live-17; committed content at ebcc68e8edb4 read by this iteration (.skilled/skills/sk-code/sk-code-opencode/references/shell/style-guide/overview-structure-and-naming.md:109-131); .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:160,1030]

### F2-05 — The threshold's false-positive risk is real and concentrated at exactly 0.5
Under mean<0.6 the single new false positive is live-18 (supports; reruns 0.50/0.50/0.52). Its cited window does contain the claim's subject — the `unit-grid`/`unit-ring` substitution at line 129 of the cited luna research file, inside the 113-133 window — so the label is defensible and the model is genuinely borderline. The same file's closest supports call sits at exactly 0.5, and the strict `<` in `FLAG_THRESHOLD` (`:76`) is what keeps it clean; one step more conservative (or one more rerun) flips it. Any threshold change must be evaluated against rows like this. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl row live-18; committed content at ebcc68e8edb4 (luna research.md:123-133) read by this iteration; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:76]

### F2-06 — Reruns can be adaptive; the flip signal only exists near the threshold
F=3 comes from three rows with a dissenting rerun, all within 0.06 of 0.5 (iteration 1). Across all 40 rows, 12 have any rerun in [0.35, 0.65] and 26 are fully confident (all reruns outside 0.3..0.7). A one-rerun screen with a second and third call only for rows in the band would have used roughly 65 calls instead of 121 (≈46% fewer) while keeping every vote that changed an answer; scoring from the first rerun alone would have cost acc 0.850. The cost cut is real but the value is bounded — the cheapest accuracy win is the aggregation, not call removal. [SOURCE: replay over ~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:962,1148-1175]

### F2-07 — The instruction and row set are pre-registered gates, so "improve the prompt" is a requalification event
The fixed instruction is hashed into the planned gate line (`:662`) and every call carries it verbatim (`:1081`), while `requalifyNotice` only watches provider and model identity (`:719-726`). Changing the question, the window radius, or the draw composition silently changes what the keep rule measured without triggering requalification. Any accuracy change must either re-run the labeled set under the new configuration or be declared a new qualification. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:662,719-726,1081; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:76-96]

## Sources Consulted

- `~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl` (latency, aggregation sweep, band counts, replay)
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` and committed row content at `ebcc68e8edb4` (`git show`, read-only)
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (`:76`, `:160`, `:251-261`, `:371-390`, `:662`, `:700-708`, `:719-726`, `:962`, `:1030`, `:1081`, `:1148-1175`)
- `git ls-files .skilled/skills` + worktree citation scan (8,667 docs, 82 with citations)
- `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/implementation-summary.md:61,72` (recorded wall times)

## Assessment

- **newInfoRatio:** 0.9
- **Novelty justification:** The aggregation sweep, the 8,667→82 doc-reader ratio, the adaptive-rerun arithmetic, and the bare-evidence payload flaw are all new; F2-01 and F2-03 extend iteration 1's counts with cost and counterfactual scoring.
- **Confidence:** High for F2-01..F2-03 and F2-06 (replayed from recorded answers); high for F2-04/F2-05 (committed content read directly at the recorded commit); medium for F2-07 (a reading of the gate/requalification mechanism, not an executed experiment).

## Reflection

- **What worked:** Re-scoring under alternative rules from the recorded answers, which separates "changes that need new model calls" from "changes that are free". The doc-by-doc citation census exposed that the expensive part of the pipeline is wasteful by construction.
- **What failed:** The initial payload reconstruction crashed on a misplaced `.join` (fixed) — no research impact.
- **Ruled out:** "Fewer reruns will fix the misses" — first-rerun-only scoring is worse (acc 0.850 vs 0.875). "The misses are pure model error" — live-17 is a payload flaw. "Lowering the threshold is too risky" — the one new false positive at 0.6 is a genuine borderline row and the rule tolerates several more.

## Recommended Next Focus

Q3: How can the measurement be made more trustworthy? Start from the two borderline rows (live-17 payload flaw, live-18 threshold-adjacent label), the label provenance and agreement record, and what the report does and does not record.
