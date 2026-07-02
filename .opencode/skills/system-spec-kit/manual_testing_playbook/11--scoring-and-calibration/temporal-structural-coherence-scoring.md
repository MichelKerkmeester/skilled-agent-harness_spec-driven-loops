---
title: "198 -- Temporal-structural coherence scoring"
description: "This scenario validates temporal-structural coherence scoring for `198`. It focuses on confirming structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop."
audited_post_018: true
version: 3.6.0.12
---

# 198 -- Temporal-structural coherence scoring

## 1. OVERVIEW

This scenario validates temporal-structural coherence scoring for `198`. It focuses on confirming structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop.
- Real user request: `Please validate Temporal-structural coherence scoring against the documented validation surface and tell me whether the expected signals are present: structural checks evaluate non-empty content, minimum-length thresholds, and Markdown heading presence; future-dated completion claims reduce coherence; self-referential or unresolved causal links reduce coherence; sufficiently low coherence can trigger quality-loop rejection; verify-fix-verify retries remain immediate with no backoff and stay within the configured retry limit.`
- Prompt: `Validate temporal-structural coherence scoring, including bounded deductions and retry behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: structural checks evaluate non-empty content, minimum-length thresholds, and Markdown heading presence; future-dated completion claims reduce coherence; self-referential or unresolved causal links reduce coherence; sufficiently low coherence can trigger quality-loop rejection; verify-fix-verify retries remain immediate with no backoff and stay within the configured retry limit
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: flawed variants receive the expected coherence penalties and rejection or downgrade behavior while retries stay immediate and bounded; FAIL: structural defects do not affect coherence, temporal or causal-link issues are ignored, or retry behavior contradicts the documented bounded immediate cycle

---

## 3. TEST EXECUTION

### Prompt

```
Validate temporal-structural coherence scoring, including bounded deductions and retry behavior.
```

### Commands

1. Prepare a well-formed control memory plus flawed variants covering short or heading-less content, future-dated completion claims, and broken causal-link metadata
2. Run the quality loop or ingest path for each case
3. Inspect the coherence score breakdown and quality-loop decision for control vs flawed variants
4. Confirm penalties apply to temporal and causal-link issues without inventing broader chronology logic
5. For an auto-fixable case, capture the retry cycle and confirm retries occur immediately with no backoff and stop within the configured limit

### Expected

Structural checks evaluate content presence, minimum length, and headings; future-dated completion claims reduce coherence; self-referential or unresolved causal links reduce coherence; low-coherence variants are rejected or downgraded; retry attempts are immediate and bounded

### Evidence

Command: `npx vitest run tests/quality-loop.vitest.ts` from `.opencode/skills/system-spec-kit/mcp_server`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  53 passed (53)
   Start at  11:25:53
   Duration  489ms (transform 306ms, setup 14ms, import 396ms, tests 12ms, environment 0ms)
```

Direct quality-loop probe using the real `handlers/quality-loop.ts` function bodies with eval metrics disabled:

```text
SCORES
{"name":"control","score":{"total":1,"breakdown":{"triggers":1,"anchors":1,"budget":1,"coherence":1},"issues":[]},"loop":{"passed":true,"rejected":false,"attempts":1,"fixes":[],"rejectionReason":null}}
{"name":"headingless","score":{"total":0.788,"breakdown":{"triggers":1,"anchors":0.5,"budget":1,"coherence":0.75},"issues":["No section headings found"]},"loop":{"passed":true,"rejected":false,"attempts":1,"fixes":[],"rejectionReason":null}}
{"name":"future-dated","score":{"total":0.819,"breakdown":{"triggers":1,"anchors":0.5,"budget":1,"coherence":0.875},"issues":["Future-dated completion claims found: 2099-01-01"]},"loop":{"passed":true,"rejected":false,"attempts":1,"fixes":[],"rejectionReason":null}}
{"name":"causal-broken","score":{"total":0.788,"breakdown":{"triggers":1,"anchors":0.5,"budget":1,"coherence":0.75},"issues":["Self-referential causal links found: Causal Variant","Unresolved causal link references: missing-memory"]},"loop":{"passed":true,"rejected":false,"attempts":1,"fixes":[],"rejectionReason":null}}
{"name":"low-quality","score":{"total":0.413,"breakdown":{"triggers":0,"anchors":0.5,"budget":1,"coherence":0.25},"issues":["No trigger phrases found","Content is very short (<50 chars)","No section headings found","Content lacks substance (<200 chars)"]},"loop":{"passed":false,"rejected":true,"attempts":2,"fixes":[],"rejectionReason":"Quality score 0.413 below threshold 0.6 after 1 auto-fix attempt(s). Issues: No trigger phrases found; Content is very short (<50 chars); No section headings found; Content lacks substance (<200 chars)"}}
RETRY
{"elapsedMs":0.162,"result":{"passed":true,"rejected":false,"attempts":2,"fixes":["Re-extracted 4 trigger phrases from content"],"fixedTriggerPhrases":["important sprint documentation","overview of the sprint","implementation details","quality metrics"],"score":{"total":0.85,"breakdown":{"triggers":1,"anchors":0.5,"budget":1,"coherence":1},"issues":[]}}}
```

### Pass / Fail

- **PASS**: coherence penalties appeared for heading-less, future-dated, self-referential, and unresolved-causal-link variants; the low-quality case was rejected at score `0.413` after `2` attempts; the auto-fix retry completed in `0.162ms` with `2` attempts and no observed backoff or unbounded looping.

### Failure Triage

Verify control content satisfies structural checks -> Inspect coherence penalty branches for future-dated claims and causal links -> Confirm rejection threshold or downgrade path -> Check retry loop configuration and attempt count -> Ensure broader chronology analysis was not assumed in the verdict

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/temporal-structural-coherence-scoring.md](../../feature_catalog/11--scoring-and-calibration/temporal-structural-coherence-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 198
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/temporal-structural-coherence-scoring.md`
