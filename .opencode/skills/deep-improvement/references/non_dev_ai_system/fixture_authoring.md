---
title: "Lane D Fixture Authoring"
description: "How to author visible, held-out and gold fixtures for a Lane D packaging: deliverable-producing only, dimension-sensitivity, unpublished adversarial seeds, the DELIVERABLE output contract, fixture-lint gating, and N>=3 sampling."
---

# Lane D Fixture Authoring

How to author the three fixture tiers for a Lane D packaging. Fixtures are the evidence the loop promotes against, and getting them right is the difference between real improvement and reward hacking.

---

## 1. OVERVIEW

### The Three Fixture Tiers

- **Visible** — proposer + grader see it. Used for gap analysis and iteration targeting. May be discussed in prompts and journals.
- **Held-out** — grader only sees it. Used for promotion gates. The proposer NEVER sees ids, prompts or seeds. Promotion requires non-regression here.
- **Gold (optional)** — humans + grader see it. Used for grader calibration. Human-anchored target scores, version-locked, never optimized against.

### When to Use

- Authoring new fixtures for a Lane D packaging
- Validating fixture lists before dispatch
- Selecting held-out fixtures for promotion gates

### Core Principle

Fixtures are the evidence the loop promotes against; getting them right is the difference between real improvement and reward hacking.

---

## 2. DELIVERABLE-PRODUCING ONLY

Every fixture must produce a delimited deliverable (`<DELIVERABLE>` contract). Interactive fixtures that answer with a clarifying question cannot be graded and turn into false gate failures (teaching T6). The `<DELIVERABLE>` output contract text is embedded in the benchmark prompt so the grader can find and score the output deterministically.

Gate all fixture lists with `scripts/shared/fixture-lint.cjs` before any paid dispatch.

---

## 3. DIMENSION-SENSITIVITY

Prefer held-out fixtures that are maximally sensitive to the dimensions being optimized. The pilot's stat-centric fixture collapsed under a no-stats deficit, which is exactly what made its signal decisive. A fixture that is insensitive to the target dimension will produce noisy or flat grades that cannot drive improvement.

When selecting held-out fixtures, ask: "If the technique doc for dimension X were weakened, would this fixture's score drop?" If the answer is no, pick a different fixture.

---

## 4. UNPUBLISHED ADVERSARIAL SEEDS

Adversarial seeds and expected answers must not live in files the proposer reads. If a fixture's tricks are enumerated in-repo, it is a visible fixture by definition. The proposer would memorize the answers rather than learn generalizable technique.

Held-out fixture seeds, expected answers and adversarial prompts must live outside any tree the proposer can access during a refine iteration.

---

## 5. THE DELIVERABLE OUTPUT CONTRACT

Every fixture prompt must instruct the model to produce output wrapped in `<DELIVERABLE>...</DELIVERABLE>` delimiters. The grader parses only content within this region. Output outside the delimiter is ignored.

The benchmark mode instructions in the packaging config embed this contract. Example pattern:

```
BENCHMARK MODE -- do NOT call the Write or Edit tools or save/export ANY file.
Print the COMPLETE deliverable (all variations) plus the MEQT score and HVR
status directly in your chat reply.
```

---

## 6. FIXTURE-LINT GATING

Two layers gate fixtures before paid dispatch:

- Skill-side `scripts/shared/fixture-lint.cjs` classifies each held-out fixture's recorded outputs as `deliverable` / `uncontracted` / `unrecorded` and exits non-zero unless every fixture is `deliverable` (T6). It does NOT check naming conventions and it never sees the visible list - held-out/visible leakage prevention is the OPERATOR'S responsibility when authoring `LOOP_FIXTURES` / `LOOP_HELD_OUT`.
- Packaging-side `lint_held_out()` in `benchmark/_loop/loop.py` runs pre-dispatch inside the loop with an exact-match recording regex; unrecorded fixtures PASS there (the first run records them) - a deliberate difference from the skill-side linter's fail-closed default.

A lint failure halts the loop before any dispatch is paid for.

---

## 7. N>=3 SAMPLING

Single runs are stochastic (teaching T4). Held-out gating uses N >= 3 sample averages with all-samples pass semantics. The `--samples` flag (forwarded to `LOOP_SAMPLES` by the Lane D adapter, also used by Lane B) or the `LOOP_SAMPLES` env var directly controls the count.

All-samples pass semantics mean: every individual sample must pass the floor check and HVR lint for the aggregate to count as passing. A single sample failure is a gate failure.

---

## 8. GOLD SET RULES

A gold set anchors the GRADER, not the proposer. It is a small output set with human-agreed target scores, re-scored whenever the grader model changes.

- Keep gold outputs and target scores version-locked outside any tree a loop can write.
- Disagreement beyond about 2 of 25 (or 8 of 100) means recalibrate before trusting new grades.
- Gold fixtures are never optimized against. They are calibration anchors only.

---

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

- `visible` — fixture ids for gap analysis and iteration targeting (env `LOOP_FIXTURES` default).
- `held_out` — fixture ids for promotion gates (env `LOOP_HELD_OUT` default).
- `variants` — benchmark variants to run (env `LOOP_VARIANTS` default).

---

## 10. RELATED RESOURCES

- [loop_contract.md](./loop_contract.md) — the formal benchmark/_loop/loop.py contract
- [guardrails_teachings.md](./guardrails_teachings.md) — T6 (gradeable held-out) and T4 (N-sample averaging)
- [grader_calibration.md](./grader_calibration.md) — gold-set calibration protocol
- [operator_guide.md](./operator_guide.md) — conformance checklist and invocation
