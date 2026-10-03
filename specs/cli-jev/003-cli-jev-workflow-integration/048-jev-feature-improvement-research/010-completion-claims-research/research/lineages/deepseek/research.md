# Research synthesis: Jev completion-claim audit (cli-jev feature 026)

- Lineage: deepseek (fan-out of 010-completion-claims-research), cli-pi deepseek-v4.1-flash reasoning max
- Session: fanout-deepseek-1790988399286-wm20q1
- Stop: max iterations reached (5 of 5); convergence before the cap was telemetry only
- Questions answered: 5 of 5. Findings: 40 (8 per iteration), each with file:line or recorded-artifact evidence
- Method: no live model calls. The measured run was reproduced locally (census + regex counts, exit 0) and its recorded artifacts (`calls.jsonl`, `report.json`) were replayed for the cost, threshold and per-row analyses.

---

## 1. Verdict in one paragraph

The measured `stop (margin)` is a gate-vocabulary failure, not a judge failure. The detector has **zero recall and zero precision on the 110-row corpus**: all 10 labeled claims are silent because none of the ten pattern words occurs in their tails, and all 7 fires are false (checklists, tables, variable names, mid-process narration). The judge is decidedly better (102/110 correct, 13 wins to 4 losses, p_win 0.02452) but its 9-net-win gain is two wins short of the 0.10 margin (11 needed). The strongest cheap fix is not the judge: adding `complete` alone catches 3 claims for free, and closing-position anchoring cuts false fires from 7 to 3 with no recall loss. The judge's honest roles today are offline scoring, shadow mode and adjudication behind a fixed gate — not a default-on replacement.

## 2. Answers to the five questions

### Q1 - What drove the result (iteration 1)

- **0/10 recall**: all labeled claims are silent; the scorer's attribution prints "by word: none" because no pattern word appears in any missed tail. The 10 tails end with phrases like "The goal is complete", "everything is committed and pushed", "Validation passes: 43 PASSED and 0 FAILED", "Nothing remains to build".
- **0/7 precision**: every fire is a false fire — "Deployed to staging" (unchecked checklist item), a "Status | Complete | Completed: Not completed" table, `resolved-root=`/`resolved-target=` variable names, a "re-verifying ... RESULT: FAILED" report, a requirement statement, an open question, and mid-reasoning.
- **Margin math**: A-B=9 versus the 11 needed (10*(A-B) >= M=110). `decideVerdict` orders coverage, kill, margin, sign test, flips; the sign test never decides because margin fails first. p_win = 3214/131072 = 0.02452, p_loss = 130238/131072, both exact in BigInt.
- **A miss disables the sentinel**: `evaluateCompletionEvidence` returns early unless the regex fires, so 0 recall also skips every evidence check — the detector's failure silently removes the whole feature.
- Corpus asymmetry: 110 rows = 50 Pi + 60 Claude; all 10 positives are Claude.

### Q2 - Raise accuracy or lower cost (iteration 2)

Ranked by measured effect per unit of risk:

1. **Closing-position anchor** (free): score the match in only the last 160 chars -> false fires 7->3, recall unchanged, accuracy 0.8455->0.8818.
2. **One added word** (free): + `complete` -> TP 0->3, no new false fire, accuracy -> 0.8727. The pattern has `completed` but not `complete`.
3. **Threshold** (free, needs pre-registration): replaying the recorded 331 calls at modal threshold 0.7 gives A=104, L=1, A-B=11 -> margin passes at equality, pWin=0.001709, F=0: the verdict flips to keep on the same calls. 0.6/0.65 still fail (A-B=10).
4. **Vocabulary, gated by context**: a broad list reaches TP 9/10 but FP 18 (precision 9/27) — only with context filters.
5. **Judge reality check**: 102/110 correct; yes on 6/10 claims, 4/100 non-claims. Its 13 wins split 7 false-fire rejections + 6 claims caught; losses are boundary rows.
6. **Rerun policy**: F=0 across 110 rows means one call per row would reproduce the column at 1/3 the calls; keep reruns for near-threshold scores only.
7. **Measured cost**: 331 calls, all measured; mean 329 ms, p50 320, p95 391; Pi/Claude parity; 24,735 estimated input tokens (~75 per judgment).
8. **No row batching**: `run` is one state with many questions; call count per row is unchanged.

### Q3 - Make the measurement trustworthy (iteration 3)

Strong already: byte-for-byte replay (rowsSha256, labelsSha256, all 331 calls, exact BigInt tails) and a pre-registered keep rule.

Weak and fixable:

- One runtime supplies every positive (10/10 Claude; the Pi draw held 0 yes). 1:10 balance means every claim metric moves in 10-point steps.
- Labels are arbiter-decided under 042 ADR-001 (Opus 5.5 medium, digest + veto), not per-row operator-confirmed, and the label file stores only `{id, claim}` — no labeler, rubric, timestamp or confidence.
- Corpus-vs-consumer input is not pinned: the scorer reads `raw_text`; hooks read the last assistant message; no extractor exists in the repo.
- Tuning risk: threshold and vocabulary are not pre-registered, and the keep at 0.7 is exact-margin post-hoc.
- No held-out set or live-corpus canary; the vitest suite is synthetic with a stub jev.
- Cost sits beside the rule, not inside it.

### Q4 - Where else the same judgment pays off (iteration 4)

- **Five wired surfaces, one core**: Claude Stop, Codex Stop, Devin Stop, Pi turn_end, OpenCode session.idle — a single improvement multiplies 5x.
- **Cursor adapter exists but is unwired** (`.cursor/hooks.json` has no entry): cheapest coverage win.
- **A second un-scored regex in the same core**: `SPEC_FOLDER_TEXT_PATTERN` / `resolveSpecFolderFromText` picks the packet; wrong picks cause false advisories. The same 110-row corpus can score it.
- **Spec-gate classify/enforce** is the next high-volume decision surface.
- **The run-scope twin** already exists: the fan-out runner refuses self-reported completion without evidence — same policy, same lesson.
- The template is already replicated 30+ times; the gap is targeting un-scored gates, not tooling.

### Q5 - Default-on integration: needs, cost, risk (iteration 5)

- **Role first**: replacement gate (~3 calls + ~1s serial per turn), adjudicator behind the gate (~3 calls per firing turn; 6.4% fire rate here), or shadow (offline, no user effect). 047 only adjudicates replacement.
- **Budgets**: Claude Stop async 10s; codex/devin Stop 10s; Pi advisory next-turn (non-blocking); OpenCode session.idle blocks its host. Do not carry the 90s scorer timeout; the sentinel's own check budget is 1.2s.
- **Pins**: jev 0.6.2 + model identity + requalify on change; `auth status` gate; unavailable -> regex-only.
- **Privacy**: the tail is forwarded verbatim; needs consent + stripping (audit precedent: accept-payload, no secrets, 0-match scan).
- **Cost**: ~3 calls/turn in replacement mode (~3,000 calls per 1,000 turns); advisory dedup exists, a text-hash judgment cache does not.
- **Gate**: no default-on until a pre-registered threshold/role passes a held-out keep with cost inside the rule.
- **Failure semantics**: inherit fail-open, advisory-only, kill switches, bounded logs; add per-call timeout and a circuit breaker.

## 3. Ranked recommendations (the deliverable)

| Rank | Action | Why (evidence) | Cost/risk |
|---|---|---|---|
| R1 | Expand the claim vocabulary under context gating: add `complete`, `done`, `committed`, `passed`/`passes`, `green`, `clean`, `verified`, `nothing left`/`remains`, `ready` | 10/10 misses use no pattern word; +complete alone is TP 0->3 free (F1-05, F2-02, F2-04) | free offline; needs the R2 context rules to protect precision |
| R2 | Anchor to the closing statement (~last 160 chars) and strip checklist items, tables, code/path text and variable assignments | false fires 7->3, no recall loss; all 7 false fires share those shapes (F1-06, F2-03) | free offline; verify with canaries in the vitest suite |
| R3 | Pre-register the call threshold and validate 0.7 on a held-out split | same calls flip to keep at 0.7 (A-B=11 at equality); post-hoc today (F2-01, F3-06) | free; needs a corpus split before trust |
| R4 | Strengthen the corpus: stratified Pi+Claude positives (30+), extraction provenance pinned, a second independent labeler with an agreement stat, labels carrying labeler/rubric | 10/10 positives are Claude; labels lack provenance; input source unpinned (F3-01..F3-05, F3-07) | offline effort; the main trust upgrade |
| R5 | Put cost inside the keep rule; default to single rerun with reruns only near the threshold band | F=0 makes reruns unearned here; latency/tokens are recorded but unused (F2-06, F3-08, F5-05) | free rule change; needs pre-registration |
| R6 | Score the sibling judgments with the same machinery: spec-folder resolution first, then spec-gate classify | both are un-scored regex gates; the corpus is reusable (F4-03, F4-05, F4-07) | offline; spec-gate inputs are more sensitive than claim tails |
| R7 | Wire the existing Cursor adapter | adapter present, no hooks.json entry (F4-02) | one wiring change; coverage +1 runtime |
| R8 | Keep the judge offline/shadow; adopt default-on only as a pre-registered, held-out keep with cost in the rule; if adopted, inherit fail-open/advisory/kill-switch, pin identity, add consent+stripping, per-call timeout, circuit breaker, cache | role-specific cost/latency/privacy analysis (F5-01..F5-08) | highest risk item; do last |

## 4. What would overturn this

- A stratified corpus where Pi turns contain positives changes the recall story (F3-01).
- A held-out split where the 0.7 threshold fails would kill R3 (F3-06, F5-07).
- A recorded hook payload showing the corpus tails differ from production text would weaken every recall number in Q1-Q2 (F3-05).

## 5. Limitations

- No live `jev` calls were made in this lineage; judge claims come from replay of the recorded 047 artifacts.
- Threshold and vocabulary figures are measured on the same 110 rows they would be tuned on; treat them as hypotheses until a held-out run exists.
- Turn-frequency telemetry was not collected, so per-day cost is an arithmetic model, not a measurement.
- The Cursor "unwired" statement reflects this checkout's `.cursor/hooks.json` only.

## 6. References

- Scorer: `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs`; README in the same folder
- Detector: `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`
- Adapters: `.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,devin,cursor,pi}/`; `.opencode/plugins/system-completion-sentinel.js`
- Wiring: `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json`, `.pi/extensions/`
- Measured row: `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:15`; 047 `spec.md`
- Label method: `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md` (ADR-001), `implementation-summary.md`
- Recorded run: `~/.skilled/.labels/runs/047-026-jev-20261002/{report.json,calls.jsonl}`, `047-026-jev.stdout.txt`; corpus `~/.skilled/.labels/026-rows.jsonl`, `026-labels-047.jsonl`
- Iteration evidence: `iterations/iteration-001.md` .. `iteration-005.md`, `deltas/iter-001.jsonl` .. `iter-005.jsonl`
