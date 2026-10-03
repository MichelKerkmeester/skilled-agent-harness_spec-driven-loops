# Iteration 3: Making the measurement more trustworthy

## Focus

Audit the measurement itself: corpus construction, label provenance and circularity, baseline choice, statistical power at K=24, instrument provenance, and the natural-miss gap.

## Findings

1. **The corpus is synthetic and built to defeat both zero-call readers; its author is the same model family as this lineage's executor.** All 24 rows are single-paragraph prose (682-816 characters) with zero exact `pass|fail|block` tokens and deliberate inflected near-misses (`fails`, `failed`, `failure`, `blocker`). `results.md` names the author: "24 reviewer reports written by DeepSeek V4.1 Flash, all missed by the verdict regex". The measurement therefore certifies reading prose that no zero-call rule can read, at a miss rate that is 100 percent by construction; it does not estimate how often reviewers write such prose. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: token census over `~/.skilled/.labels/025-outputs.jsonl`] [SOURCE: iteration 1 finding 3]

2. **The labels are the author's intent re-read, and no per-row decisions record exists for 025.** The committed `025-intended.jsonl` cycles `pass`, `fail`, `block` by row id; the measured labels match it on 24 of 24 rows. The 042 labeling card records 025 as blocked ("0 misses ... no miss text exists; the operator must supply it") and 042's rules only admit labels the operator confirmed or an arbiter the operator named; 047 D4 then allowed a fixture built for the scorer to fill the gate. The labeling event's entire provenance in the repository is the one prose row in `results.md`; 047's `scratch/evidence/` holds no other file for 025, so unlike feature 035 there is no decisions log, no blind-draft pair and no per-row arbitration trail. A blind reader recovering prose written to encode a verdict is expected behavior; Jev's 24 of 24 shows the intent is readable, not that the label is externally true. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-025.md] [SOURCE: 042 goal.md D1-D3] [SOURCE: 047 goal.md D1, D4] [SOURCE: results.md:14] [SOURCE: directory listing of 047 `scratch/evidence/`]

3. **The keep's uncertainty is wide: 24 of 24 only rules out accuracy below about 88.3 percent one-sided.** The Clopper-Pearson one-sided 95 percent lower bound for 24/24 is 0.1173, i.e. accuracy of at least 88.27 percent; a Wilson 95 percent interval runs [0.862, 1.000]. Eight rows per class cannot surface a 5 percent per-class error rate at 95 percent probability (about 59 rows would be needed to expect one error at that rate). The sign test needs only 12 of 16 discordant wins, and a balanced all-miss corpus nearly guarantees that for any competent classifier. The keep asserts a direction on this corpus, not a precision claim. [SOURCE: recomputation; .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:44,48-50] [SOURCE: report.json labeled block]

4. **Both baselines sit at their floor by construction, so the margin has no realistic competitor in this run.** The forced 8/8/8 rotation fixes the majority baseline at exactly K/3, and the exact-token avoidance drives the loose rule to 0 — the lowest values each can take. On natural reviewer text both would be stronger (loose would catch some near-miss prose, majority would reflect a pass-heavy distribution). Neither the margin nor the headroom gate was tested against a realistic zero-call competitor. [SOURCE: iteration 1 findings 2-3] [SOURCE: score-verdict-fallback.cjs:294-311,1071-1073]

5. **The report records corpus identity but not instrument identity or corpus provenance.** `report.json` carries the question/options hash and `labels_sha256` plus per-column model/version data, but no repo commit, no scorer or profile version, no run time, no corpus authoring model and no labeling method. The only record of the author model and labeler is the prose row in `results.md`; the committed scratch fixture holds the 24 texts without labels, and the measured labels live in an untracked home file. Re-running the measurement on another machine is impossible without that file, and auditing the corpus requires reading a local untracked artifact. [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/report.json] [SOURCE: results.md:14] [SOURCE: 047 scratch/fixtures/025-outputs.jsonl] [SOURCE: 025 spec.md REQ-003]

6. **Natural-miss prevalence is unmeasured and no instrument produces it yet.** The scorer can count per-report verdict methods through `--reports` (`pattern`, `llm-grader`, `none` per `reviewer-report.json`), but no `reviewer-report.json` exists anywhere in the repository, and a live reviewer run keeps only a 16-character output hash. Feature 025's own open questions record exactly this: collecting regex-miss outputs with their text needs an opt-in output save in the reviewer scorer or an external review session. Until such a corpus exists, every accuracy statement is conditional on a population whose miss rate is 100 percent by construction. [SOURCE: score-verdict-fallback.cjs:244-258,1030-1044] [SOURCE: reviewer-scorer.cjs:203] [SOURCE: 025 spec.md section 7 open questions] [SOURCE: find over the repository for `reviewer-report.json`: none]

7. **The measurement's foundations are otherwise sound and worth keeping.** The binomial tails are exact BigInt arithmetic with the 0.05 comparisons done as integer inequalities; the labels are hashed and the hash is printed; `requalify` fires on provider or model change; every call logs exit code and wall time; the gate stops before any call; `expectedVerdict` is kept but never scored; and no model writes a label inside the scorer. [SOURCE: score-verdict-fallback.cjs:317-357,845-850,758-773,1059-1077,199-203] [SOURCE: report.json]

## Ruled Out

- Treating 24/24 as establishing a usable precision level: the one-sided 95 percent lower bound is 88.3 percent and per-class error rates are unobservable at 8 rows per class. [SOURCE: recomputation]
- Treating the two zero-call baselines as realistic competitors: both are at their floor by construction, so the measured margin is an upper bound on this corpus. [SOURCE: iterations 1-2]
- Treating the labels as independent ground truth: they equal the author's intent on all 24 rows and no per-row decisions record exists for this corpus. [SOURCE: results.md:14; 042 card-025]

## Dead Ends

- Searching for an existing natural-miss artifact: no `reviewer-report.json` exists anywhere in the repo and no 025 decisions file exists under 047's evidence directory. Both absent artifacts are themselves the finding. [SOURCE: repository find and directory listing]

## Edge Cases

- The baseline method is chosen over all labeled rows while `B` is counted only on measured rows; with unmeasured rows the chosen method and the evaluated subset can diverge. On this run M=K=24, so the distinction never surfaced. [SOURCE: score-verdict-fallback.cjs:294-311,405-426]
- Running many 047 features each with its own frozen keep rule creates a program-level selection surface: five keeps out of fifteen measured features. The per-feature inference is not adjusted for that program-level multiplicity, which matters when reading "keep" as a program signal rather than a per-feature result. [SOURCE: results.md: overview row]

## Sources Consulted

- results.md:14 and the 047 goal D1-D4
- 042 card-025.md; 042 goal.md D1-D3
- 025 spec.md (Keep Rule section, REQ-003, section 7 open questions)
- score-verdict-fallback.cjs:44, 48-50, 199-203, 294-311, 317-357, 405-426, 758-773, 845-850, 1030-1044, 1059-1077
- reviewer-scorer.cjs:203; report.json; scratch/fixtures/025-{outputs,intended}.jsonl
- repository find for `reviewer-report.json` (none); 047 scratch/evidence listing (results.md only)
- deep-research-strategy.md (read before iteration 3); steer.md (checked before iteration 3; absent)

## Assessment

- New information ratio: 0.85
- Novelty: the confidence-interval recomputation, the labeling-provenance absence, the both-baselines-at-floor observation, and the instrument-provenance gap are all new to this lineage; the natural-miss instrument gap was previously recorded only as an open question in 025, now tied to the absent reports census.
- Questions addressed: Q3 fully.
- Questions answered: How can the measurement become more trustworthy?
- Confidence: High for the record gaps and arithmetic; the proposal side (what a natural corpus should look like) is marked as recommendation, not measurement.

## Reflection

- What worked and why: checking whether a decisions artifact existed for the labeling event turned an assumption ("the arbiter labeled it") into a documented absence, which is stronger evidence than any single row.
- What did not work and why: nothing blocked; the one-line 047 record is the best available provenance, so some conclusions rest on it alone.
- What I would do differently: request the corpus authoring prompt and the arbiter's raw output before trusting any synthetic-corpus measurement; without them the labels are an artifact of the construction.

## Recommended Next Focus

Iteration 4: locate other `.skilled` judgment points where the same deterministic-extractor-plus-LLM-fallback shape would pay off, ranked by fit and available seam.
