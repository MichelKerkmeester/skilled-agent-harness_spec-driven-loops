Read-only verification starting. The memory trigger lookup timed out, so I’m proceeding with direct repository evidence only and will not write or modify files.

---

I’m locating the corpus, divergence ledger, scorer script, and test files first, then I’ll read only the relevant slices for line-cited evidence.

---

I found the primary corpus and an adjacent ambiguity JSONL artifact. The old skill slug occurrences in the primary corpus appear in `skill_top_1`, but I’m parsing field paths and counts to verify there are no hidden prompt-text occurrences.

---

The divergence ledger has 25 entries with old deep-loop slugs across `gold`, `nativeTop`, and/or `reason`; I’m now reading the test assertions and scorer argparse to separate rename-only baseline effects from real scoring behavior changes.

---

The ratchet test does not hardcode the main accuracy counts inline; it pins fixture hashes and compares live metrics to `scorer-eval-baseline.json`. I’m reading that baseline file now so the report can include the actual committed numbers.

---

I found the baseline capture script referenced by the ratchet failure message; I’m reading it to verify the re-baseline procedure rather than inferring it.

---

The scorer flag is present in argparse and feeds a threshold-failure list that controls the process exit code. I’m checking the alias/canonicalization table next because that determines whether a pure label rename changes score counts or only fixture hashes/comments.

---

The current scorer code still canonicalizes deep-loop aliases to `deep-loop-workflows`, so a future label-only corpus rename will interact with alias code unless that canonical id changes too. I’m reading the exact alias lines for citations.

---

The parity test is stricter than the ratchet: it compares raw `tsTop`/`pythonTop` to `skill_top_1` with no alias folding. I’m searching for any documented parity re-baseline helper before concluding it is manual from the test’s JSON report.

---

I’m doing one broader read-only sweep for JSONL routing artifacts so the report does not miss a “similar” labeled corpus file such as holdout or ambiguity slices.

---

The JSONL sweep shows exact old deep-loop slugs only in `labeled-prompts.jsonl` and `ambiguity-prompts.jsonl`; `holdout-prompts.jsonl` has no exact `deep-loop-workflows`/`deep-loop-runtime` hit. I’m doing a final field-name search for `expectedSkill`, `gold`, `nativeTop`, and `localTop` references.

---

I also found a non-JSONL scorer fixture with `expectedSkill: 'deep-loop-workflows'`. It is outside `routing-accuracy/` but relevant to the label-field migration risk, so I’m reading the small cited section.

---

**1. Routing Corpus**
Found primary corpus: `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl`.

Result: the exact old slugs `deep-loop-workflows` / `deep-loop-runtime` appear only in `skill_top_1`, not in `prompt` text. Count: 53 rows in `labeled-prompts.jsonl`, all `skill_top_1=deep-loop-workflows`; 0 `deep-loop-runtime`.

Example rows:

```text
.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:18
{"id":"rr-iter2-018",...,"prompt":"Explain the difference between `resume` and `restart` in deep-research lineage.",...,"skill_top_1":"deep-loop-workflows",...}

.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:24
{"id":"rr-iter2-024",...,"prompt":"Resume deep research on the routing-accuracy packet from the active lineage.",...,"skill_top_1":"deep-loop-workflows",...}

.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:41
{"id":"rr-iter2-041",...,"prompt":"Run `/deep:start-research-loop :auto` on the routing-accuracy phase for 15 iterations.",...,"skill_top_1":"deep-loop-workflows",...}
```

Similar routing artifact: `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl`.

Result: 8 rows reference the old slug, again only in `skill_top_1`.

```text
.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl:1
{"id":"rr-iter2-046","prompt":"`/deep:start-review-loop :auto` the current phase folder for 10 iterations.","skill_top_1":"deep-loop-workflows",...}

.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl:20
{"id":"rr-iter3-099","prompt":"Explain why deep-loop prompts belong in the same corpus as ordinary file-write prompts.","skill_top_1":"deep-loop-workflows",...}
```

Additional related non-JSONL fixture found outside `routing-accuracy/`: `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` has 2 `expectedSkill` old-label references, also not in prompt text:

```text
.intent-prompt-corpus.ts:68-70
prompt: 'Use deep-ai-council for a multi-seat planning council with persistent artifacts.',
expectedSkill: 'deep-loop-workflows',

.intent-prompt-corpus.ts:128-130
prompt: 'Compare several planning perspectives, converge on one design, and save the deliberation artifacts.',
expectedSkill: 'deep-loop-workflows',
```

**2. Divergence Ledger**
Found ledger: `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json`.

The 2026-06-15 re-baseline entry shape is:

```json
{
  "id": "harder:4798f04a4216",
  "corpus": "harder",
  "promptHash": "sha256:4798f04a421656a90c29b49d7b311ceb8a335d940e9f353b66fbd3df32baf5e0",
  "gold": "deep-ai-council",
  "localTop": "none",
  "nativeTop": "deep-loop-workflows",
  "reason": "deep-loop merge re-baseline: legacy deep-* skills folded into deep-loop-workflows shifted native top-1; recorded as approved local-vs-native divergence",
  "approvedAt": "2026-06-15"
}
```

Cited at `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:25-32`.

Current count: 25 ledger entries reference `deep-loop-workflows` or `deep-loop-runtime`.

Field distribution from read-only JSON parse:

```text
gold: 18
nativeTop: 21
reason: 21
localTop: 0 exact old-slug hits
deep-loop-runtime: 1 entry, in nativeTop
```

Runtime-specific example:

```text
local-native-approved-divergences.json:515-522
"id": "rr-iter3-113",
...
"gold": "deep-loop-workflows",
"localTop": "none",
"nativeTop": "deep-loop-runtime",
"reason": "deep-loop merge re-baseline: legacy deep-* skills folded into deep-loop-workflows shifted native top-1; recorded as approved local-vs-native divergence",
"approvedAt": "2026-06-15"
```

Manual-risk example: some entries also carry legacy mode ids in `localTop`, even though not the exact old slugs:

```text
local-native-approved-divergences.json:638-642
"gold": "deep-loop-workflows",
"localTop": "deep-research",
"nativeTop": "deep-loop-workflows",
"reason": "deep-loop merge re-baseline: legacy deep-* skills folded into deep-loop-workflows shifted native top-1; recorded as approved local-vs-native divergence",
"approvedAt": "2026-06-15"
```

**3. Baseline Tests**
`scorer-eval-baseline-ratchet.vitest.ts`

Hardcoded floors and slice sizes:

```text
scorer-eval-baseline-ratchet.vitest.ts:29-30
const FULL_CORPUS_FLOOR = 0.75;
const HOLDOUT_FLOOR = 0.725;

scorer-eval-baseline-ratchet.vitest.ts:78-80
const REVIEW_MIN_N = 32;
const MEMORY_SAVE_MIN_N = 32;
const DELEGATION_MIN_N = 11;
```

It asserts exact live metrics against `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json`, plus fixture hashes:

```text
scorer-eval-baseline-ratchet.vitest.ts:219-222
expect(sha256File(CORPUS_PATH), 'corpus changed — re-baseline').toBe(BASELINE.corpusSha256);
expect(sha256File(HOLDOUT_PATH), 'holdout changed — re-baseline').toBe(BASELINE.holdoutSha256);
expect(sha256File(AMBIGUITY_PATH), 'ambiguity slice changed — re-baseline').toBe(BASELINE.ambiguitySha256);
```

Current committed baseline values:

```text
scorer-eval-baseline.json:14-18
full_corpus_top1: correct 147 / total 193 / accuracy 0.7617

scorer-eval-baseline.json:19-24
unknown_count: 10
gold_none_false_fire: 8

scorer-eval-baseline.json:25-35
holdout_top1: 60 / 78 / 0.7692
ambiguity_top1: 15 / 25 / 0.6 / tau 0.03

scorer-eval-baseline.json:36-51
review: 22 / 32 / 0.6875
memory_save: 25 / 32 / 0.7813
delegation: 11 / 11 / 1
```

Re-baseline procedure is script-driven, not manual paste:

```text
capture-scorer-eval-baseline.mjs:16-18
node capture-scorer-eval-baseline.mjs
node capture-scorer-eval-baseline.mjs --write

capture-scorer-eval-baseline.mjs:153-155
if (process.argv.includes('--write')) {
  writeFileSync(OUTPUT_JSON, serialized, 'utf8');
```

A field-only rename will definitely change fixture hashes. Metric counts should not change if scorer alias/canonicalization is updated coherently. Current alias code still canonicalizes folded deep-loop modes to `deep-loop-workflows`:

```text
aliases.ts:109
export const MERGED_DEEP_SKILL_ID = 'deep-loop-workflows';

aliases.ts:159-164
Resolve any deep-loop alias to the merged skill id (deep-loop-workflows)...
return modeForAlias(skillId) !== null ? MERGED_DEEP_SKILL_ID : canonicalSkillId(skillId);
```

`python-ts-parity.vitest.ts`

Hardcoded accepted divergence ids:

```text
python-ts-parity.vitest.ts:33-37
const ACCEPTED_PARITY_REGRESSION_IDS: string[] = [
  'rr-iter2-016',
  'rr-iter2-020',
  'rr-iter2-060',
];
```

Hardcoded metric expectations:

```text
python-ts-parity.vitest.ts:178-189
expect(pythonCorrect).toBe(106);
expect(tsAlsoCorrect).toBe(103);
expect(regressions).toBe(ACCEPTED_PARITY_REGRESSION_IDS.length);
expect(regressionIds).toEqual(ACCEPTED_PARITY_REGRESSION_IDS);
expect(tsAbstainsOnPythonCorrect).toBe(0);
expect(tsCorrect).toBeGreaterThanOrEqual(95);
expect(tsUnknown).toBeLessThanOrEqual(13);
expect(goldNoneFalseFire).toBeLessThanOrEqual(10);
expect(holdoutCorrect).toBeGreaterThanOrEqual(17);
```

This test uses raw equality, not alias folding:

```text
python-ts-parity.vitest.ts:131-140
const gold = goldSkill(row);
const pythonTop = python[index].top;
const tsTop = ts[index].topSkill;
if (tsTop === gold) tsCorrect += 1;
...
if (pythonTop === gold) {
```

It logs the computed report but has no dedicated capture script found:

```text
python-ts-parity.vitest.ts:172
console.log(`advisor-parity-report ${JSON.stringify(report)}`);
```

So the parity re-baseline is manual: run the test, inspect `advisor-parity-report`, then update hardcoded counts / accepted ids / comments if the rename is intentional and behavior-equivalent.

**4. `score-routing-corpus.py --min-advisor-accuracy`**
The flag is real in current argparse:

```text
score-routing-corpus.py:232-237
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
parser.add_argument("--out", type=Path, default=None)
parser.add_argument("--enable-semantic", action="store_true")
parser.add_argument("--min-advisor-accuracy", type=float, default=None)
```

It gates advisor exact-match top-1 accuracy against `skill_top_1`:

```text
score-routing-corpus.py:152-164
gold = str(row.get("skill_top_1") or "none")
...
predicted = str(recommendations[0]["skill"]) if recommendations else "none"
...
if predicted == gold:
    correct += 1
```

It fails the process, not just reports:

```text
score-routing-corpus.py:215-216
if args.min_advisor_accuracy is not None and report["advisor"]["accuracy"] < args.min_advisor_accuracy:
    failures.append("advisor_accuracy")

score-routing-corpus.py:260-269
failures = threshold_failures(report, args)
report["threshold_failures"] = failures
report["overall_pass"] = not failures
...
return 0 if not failures else 1
```

**STAGE I RISK ASSESSMENT**
The plan’s prompt-text assumption is safe for exact old slugs in the routing JSONL corpus: `deep-loop-workflows` / `deep-loop-runtime` appear in label fields, not prompt text. Do not rewrite generic prompt text like `deep-research`, `deep-review`, or `deep-loop prompts`.

The migration is more error-prone than a single field-scoped replacement if it includes all scoring fixtures. Besides `labeled-prompts.jsonl`, `ambiguity-prompts.jsonl` has 8 `skill_top_1` old labels, `intent-prompt-corpus.ts` has 2 `expectedSkill` old labels, and the divergence ledger has 25 nonuniform old-slug entries across `gold`, `nativeTop`, and `reason`.

The divergence ledger re-approval process is manually risky: entries do not all contain the same fields, one uses `nativeTop: deep-loop-runtime`, many reason strings embed the old slug, and some related entries carry legacy mode ids like `localTop: deep-research` / `deep-review`. A safe update needs coordinated per-entry review, not a blind single-field replacement.