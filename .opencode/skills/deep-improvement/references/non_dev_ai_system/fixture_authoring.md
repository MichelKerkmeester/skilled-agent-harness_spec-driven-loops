---
title: "Lane D Fixture Authoring"
description: "How to author visible, held-out and gold fixtures for a Lane D packaging: deliverable-producing only, dimension-sensitivity, unpublished adversarial seeds, the DELIVERABLE output contract, fixture-lint gating, and N>=3 sampling."
trigger_phrases:
  - "fixture authoring"
  - "lane d fixtures"
  - "held-out fixtures"
  - "gold set fixtures"
  - "visible fixtures"
importance_tier: important
contextType: reference
---

# Lane D Fixture Authoring

How to author the three fixture tiers for a Lane D packaging. Fixtures are the evidence the loop promotes against, and getting them right is the difference between real improvement and reward hacking.

---

## 1. THE THREE FIXTURE TIERS

| Tier | Who sees it | Used for | Rules |
|---|---|---|---|
| Visible | proposer + grader | Gap analysis, iteration targeting | May be discussed in prompts and journals |
| Held-out | grader only | Promotion gates | The proposer NEVER sees ids, prompts or seeds. Promotion requires non-regression here |
| Gold (optional) | humans + grader | Grader calibration | Human-anchored target scores, version-locked, never optimized against |

## 2. DELIVERABLE-PRODUCING ONLY

Every fixture must produce a delimited deliverable (`<DELIVERABLE>` contract). Interactive fixtures that answer with a clarifying question cannot be graded and turn into false gate failures (teaching T6). The `<DELIVERABLE>` output contract text is embedded in the benchmark prompt so the grader can find and score the output deterministically.

Gate all fixture lists with `scripts/shared/fixture-lint.cjs` before any paid dispatch.

## 3. DIMENSION-SENSITIVITY

Prefer held-out fixtures that are maximally sensitive to the dimensions being optimized. The pilot's stat-centric fixture collapsed under a no-stats deficit, which is exactly what made its signal decisive. A fixture that is insensitive to the target dimension will produce noisy or flat grades that cannot drive improvement.

When selecting held-out fixtures, ask: "If the technique doc for dimension X were weakened, would this fixture's score drop?" If the answer is no, pick a different fixture.

## 4. UNPUBLISHED ADVERSARIAL SEEDS

Adversarial seeds and expected answers must not live in files the proposer reads. If a fixture's tricks are enumerated in-repo, it is a visible fixture by definition. The proposer would memorize the answers rather than learn generalizable technique.

Held-out fixture seeds, expected answers and adversarial prompts must live outside any tree the proposer can access during a refine iteration.

## 5. THE DELIVERABLE OUTPUT CONTRACT

Every fixture prompt must instruct the model to produce output wrapped in `<DELIVERABLE>...</DELIVERABLE>` delimiters. The grader parses only content within this region. Output outside the delimiter is ignored.

The benchmark mode instructions in the packaging config embed this contract. Example pattern:

```
BENCHMARK MODE -- do NOT call the Write or Edit tools or save/export ANY file.
Print the COMPLETE deliverable (all variations) plus the MEQT score and HVR
status directly in your chat reply.
```

## 6. FIXTURE-LINT GATING

`scripts/shared/fixture-lint.cjs` validates fixture lists before any paid dispatch. It checks:
- Every held-out fixture has at least one recorded output containing a `<DELIVERABLE>` region (T6).
- Fixture ids match the expected naming convention.
- No held-out fixture id appears in the visible list (prevents leakage).

Run the linter as part of the pre-dispatch sequence. A lint failure halts the loop.

## 7. N>=3 SAMPLING

Single runs are stochastic (teaching T4). Held-out gating uses N >= 3 sample averages with all-samples pass semantics. The `--samples` flag (Lane B) or `LOOP_SAMPLES` env var (Lane D) controls the count.

All-samples pass semantics mean: every individual sample must pass the floor check and HVR lint for the aggregate to count as passing. A single sample failure is a gate failure.

## 8. GOLD SET RULES

A gold set anchors the GRADER, not the proposer. It is a small output set with human-agreed target scores, re-scored whenever the grader model changes.

- Keep gold outputs and target scores version-locked outside any tree a loop can write.
- Disagreement beyond about 2 of 25 (or 8 of 100) means recalibrate before trusting new grades.
- Gold fixtures are never optimized against. They are calibration anchors only.

## 9. FIXTURE CONFIGURATION IN PACKAGING CONFIG

The `packaging_config.schema.json` defines the fixture structure:

```json
{
  "fixtures": {
    "visible": ["T1-write", "T4-improve-adversarial"],
    "held_out": ["T5-quick", "T7-stat"],
    "variants": ["cli", "project"]
  }
}
```

- `visible` -- fixture ids for gap analysis and iteration targeting (env `LOOP_FIXTURES` default).
- `held_out` -- fixture ids for promotion gates (env `LOOP_HELD_OUT` default).
- `variants` -- benchmark variants to run (env `LOOP_VARIANTS` default).

---

## Related Resources

- [loop_contract.md](./loop_contract.md) -- the formal _loop/loop.py contract
- [guardrails_teachings.md](./guardrails_teachings.md) -- T6 (gradeable held-out) and T4 (N-sample averaging)
- [grader_calibration.md](./grader_calibration.md) -- gold-set calibration protocol
- [operator_guide.md](./operator_guide.md) -- conformance checklist and invocation
