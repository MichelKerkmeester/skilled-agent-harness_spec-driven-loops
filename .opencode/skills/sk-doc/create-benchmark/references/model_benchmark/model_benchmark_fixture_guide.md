---
title: Model Benchmark Fixture Authoring Guide
description: End-to-end guide for authoring model-benchmark (Lane B) inputs - the tiered code-task oracle fixtures, the pattern/capability evidence contracts, the reviewer-prompt fixtures, and the run profiles that combine them; where each lives and what stays lane-local in deep-improvement.
trigger_phrases:
  - "model benchmark fixture guide"
  - "how to author a model-benchmark fixture"
  - "tiered code-task oracle fixture"
  - "benchmark profile shape"
  - "reviewer-prompt fixture authoring"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Model Benchmark Fixture Authoring Guide

Authoring depth for the model-benchmark (Lane B) inputs. This guide covers what you
WRITE: the fixture families the model under test answers, and the profiles that
drive a run. It does NOT restate how those inputs are scored — the evaluator rubric,
scorer selection, reviewer verdict contract, and repeatability math are the
deep-improvement lane's, and they stay lane-local. Cross-links throughout point at
those normative contracts; where this guide and a contract diverge, the contract
prevails.

---

## 1. OVERVIEW: WHAT A MODEL-BENCHMARK FIXTURE IS

A model-benchmark run scores what a model — or a prompt framework — produces against
a fixed, held-out oracle. Two kinds of authored input drive it:

- a **fixture** — one task the model under test answers, plus the oracle that grades
  the answer; and
- a **profile** — the run config that selects fixtures, executors, frameworks, and
  scoring for a run.

Both are **data only**; nothing in the fixture and profile directories executes. The
Lane B scripts read these files, dispatch the model, score the output, and write
reports to a run-time outputs directory. This guide is about the **authoring inputs**;
running and scoring are the lane's job (see section 8).

### Lane boundary — what stays lane-local

The scoring side is owned by deep-improvement and is **cross-linked, never copied**
into this packet. Author fixtures *to* those contracts; do not re-document them here.

| This guide covers (authoring inputs) | Stays lane-local in deep-improvement (cross-link) |
| --- | --- |
| Fixture shapes: fields, oracle-case shape, tier taxonomy | The five-dimension evaluator rubric and dimension weights |
| Profile shape: selection, sweep matrix, gate keys | Scorer selection, grader fallback, and dispatcher mechanics |
| Reviewer-fixture shape at a glance | The full reviewer schema, verdict contract, and deterministic replay |
| How fixtures and profiles combine | Repeatability tolerance, gate semantics, and promotion rules |

`reviewer_schema.md` and every scorer / evaluator / scoring contract listed in
section 8 are the authorities for the right-hand column. This guide names scorer
families only as wayfinding, so an author knows which fixture shape feeds which
scorer.

---

## 2. WHERE THESE LIVE

All model-benchmark data sits under the deep-improvement mode-packet. Directory names
use underscores.

| Artifact | Location | Role |
| --- | --- | --- |
| Fixtures directory | [`assets/model_benchmark/benchmark_fixtures/`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/README.md) | Task contracts the model under test answers |
| Profiles directory | [`assets/model_benchmark/benchmark_profiles/`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/README.md) | Run configs that select fixtures, models, frameworks, scoring |
| Parent data README | [`assets/model_benchmark/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/README.md) | Directory tree, key-file map, and the fixture-vs-profile flow |
| Reviewer fixture schema | [`benchmark_fixtures/reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/reviewer_schema.md) | Lane-local contract for reviewer-prompt fixtures |
| Evaluator / scoring contracts | [`references/model_benchmark/`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) | Lane-local rubric, scorer mechanics, operator guide |

Run outputs land in each profile's `outputsDir`, never back in the fixtures or
profiles directories — those two stay read-only, hand-authored inputs.

---

## 3. FIXTURE FAMILIES

A fixture is detected by its **shape**, not its filename. Three families exist; each
feeds a different scorer family.

| Family | Shape marker | Oracle | Feeds scorer (wayfinding) |
| --- | --- | --- | --- |
| Code-task oracle (t-tier) | `fn_name` + `tests[]` + `hidden_tests[]` | Function return values per case | Code-task / `5dim` scorer |
| Pattern / capability evidence contract | `requiredHeadings` + `requiredPatterns` + `forbiddenPatterns` | Structure and evidence tokens in an artifact | Pattern scorer |
| Reviewer-prompt | `kind: "reviewer-prompt"` + `expectedVerdict` | A verdict plus required finding tokens | Reviewer scorer |

### 3.1 Code-task oracle fixtures (t-tier)

The model receives a function task and must return the function source; the scorer
extracts the function, runs every oracle case, and returns a correctness fraction, so
"mostly right" separates from "fully right".

| Field | Meaning |
| --- | --- |
| `id` | Stable fixture id a profile references (for example `t3-lower-bound`) |
| `category` | Task class (for example `bug-fix-in-context`, `strict-acceptance`) |
| `tier` | Difficulty tier `T1` through `T4` |
| `fn_name` / `signature` | The function name to extract and its declared signature |
| `task` | The full prompt the model answers, including the edge cases to respect |
| `visibleSpec` | One-line contract restatement shown to the model |
| `scope` | Purity / no-I/O / no-extra-params constraints |
| `tests[]` | Visible calibration cases, each `{ name, args[], expect }` |
| `hidden_tests[]` | Held-out oracle cases in the same shape — the overfit guard |
| `expectedDifficulty` | Author's difficulty estimate (`trivial` … `adversarial`) |
| `saturation` | `{ status }` marker for whether the fixture still discriminates |

Visible `tests` calibrate; `hidden_tests` are the held-out oracle a model cannot see,
so a solution that overfits the visible cases still fails the fixture.

**Tier taxonomy and the saturation lesson.** Tiers let a profile pick a discrimination
level. The design lesson baked into the packs is an authoring rule: raw computational
difficulty saturates frontier models, so the fixtures that actually discriminate are
**invalid-dominant strict validators**, where many adversarial-malformed inputs a
lax-but-plausible solution wrongly accepts.

| Pack | Tier | What it is |
| --- | --- | --- |
| Smoke (`t1_*`) | T1 | Identity / echo — confirms the dispatch and scoring path end to end; expected to saturate |
| Mid (`t3_*`) | T3 | Bug-fix-in-context and strict-acceptance tasks |
| Adversarial (`t4_*`) | T4 | Adversarial single-task cases |
| Hard (`hard_*`) | T4 | Computational partial-credit tasks; tend to saturate frontier models |
| Harder (`harder_*`) | T4 | Confirmed the saturation finding — frontier models ace these too |
| Validation (`validate_*`) | T4 | Invalid-dominant strict validators — the real discriminator |

When authoring a code-task oracle, **generate every oracle value from a verified
reference implementation** (the reference scores a perfect fraction; a lax
implementation scores lower), never hand-author expected values. Capability sweeps
select the T4 packs from this family.

### 3.2 Pattern / capability evidence-contract fixtures

These grade a produced artifact for required structure and evidence, rather than a
function's return values.

| Field | Meaning |
| --- | --- |
| `id` | Stable fixture id a profile references (for example `fixture-baseline`) |
| `title` / `description` | Human labels for the evidence contract |
| `requiredHeadings` | Headings the artifact must contain |
| `requiredPatterns` | Evidence tokens the artifact must contain (for example `candidateId`, `recommendation`) |
| `forbiddenPatterns` | Tokens that must be absent (for example `TBD`, `TODO`, `placeholder`) |
| `content[]` | Reference lines illustrating a passing artifact |

The pattern scorer checks presence of the required headings and patterns and absence
of the forbidden ones. This is the legacy single-pass shape the `default` profile
uses to score a target agent.

### 3.3 Reviewer-prompt fixtures

Reviewer fixtures check whether a reviewer prompt still catches a known bug class. The
oracle is a verdict plus expected finding tokens rather than function outputs.

| Field | Meaning |
| --- | --- |
| `kind` | Must be `reviewer-prompt` (the shape marker) |
| `agent` | Reviewer agent or prompt family under test |
| `prompt_template` | The reviewer prompt, with `{{input}}` / `{{diff}}` / `{{review_focus}}` slots |
| `input_kind` / `input` | The diff or repo-state material carrying the known-buggy case |
| `expectedVerdict` | One of `pass`, `fail`, `block` |
| `expectedFindings` | Token-specific finding expectations |
| `tests[]` / `hidden_tests[]` | Visible and held-out cases, each able to carry a `reviewer_output` for deterministic replay |

> The full reviewer schema, required-field rules, verdict contract, deterministic
> replay field, and the how-to-add steps are the lane-local authority in
> [`reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/reviewer_schema.md).
> Author reviewer fixtures against it; this section is only the shape at a glance.

---

## 4. PROFILE SHAPE

A profile is the run config a Lane B run loads with `--profile <path-or-id>`. It
declares which fixtures to score, where outputs land, the scoring method, and — for
sweep profiles — the matrix of frameworks and models to run.

| Key | Scope | Meaning |
| --- | --- | --- |
| `profileId` / `id` | All | Stable profile identity |
| `version` / `family` | All | Profile version and owning family |
| `fixtureDir` | All | Directory the fixture ids resolve against |
| `fixtures` | All | Fixture ids to score, referenced by `id` |
| `outputsDir` | All | Where run outputs land; carries the `{spec_folder}` run-time token |
| `metrics` | All | Metric columns to report |
| `benchmark` | All | Gate thresholds (aggregate score, per-fixture floor, repeatability tolerance) |
| `mode` | Sweep | one of the validated `KNOWN_MODES`: `framework-bakeoff`, `model-vs-model`, `reasoning-ablation`, `prompt-vs-prompt`, `regression`, `capability-profile` |
| `fixtureSelection` | Sweep | Explicit `include` plus tier `filters` |
| `frameworks` | Sweep | Prompt frameworks to run (for example `rcaf`, `race`, `costar`) |
| `models` | Sweep | Model cells, each naming an executor, a model identity, and a variant |
| `scoring` | Sweep | `scorer` id, `correctnessGate`, and dimension weights |
| `sampling` | Sweep | `samplesPerCell` and a fixed `seed` for repeatable draws |
| `reporting` | Sweep | `groupBy`, `leaderboard`, and `history` |

Profile shapes vary by intent:

- **Legacy single-pass** (no `mode`): scores evidence-contract fixtures with the
  pattern scorer against a target agent (`targetPath`); no sweep matrix.
- **`framework-bakeoff`**: holds one model fixed and sweeps several prompt frameworks
  over the code-task fixtures.
- **`model-vs-model`** (and capability sweeps): holds one framework fixed and sweeps
  several model cells. Groups the leaderboard by model.
- **`reasoning-ablation`**, **`prompt-vs-prompt`**, **`regression`**, **`capability-profile`**: the remaining validated `KNOWN_MODES`; see `MODES.md` for each swept axis.

> **Reviewer-prompt regression is a SEPARATE gated lane family, not a standard profile mode.** It is not one of the validated `KNOWN_MODES` and its profiles are not accepted by `profile-validator.cjs`. Author it through the lane (`scripts/model-benchmark/`), not with this fixture/profile scaffold. This guide covers the standard model-benchmark fixtures and profiles only.

The `benchmark` gate keys and `thresholdDelta` are inputs to the lane's gate
semantics; their meaning (what counts as a pass, how repeatability tolerance is read)
is defined in the lane contracts in section 8, not here.

---

## 5. HOW FIXTURES AND PROFILES COMBINE

A profile references fixtures by `id` and resolves them from its `fixtureDir`. A sweep
profile crosses the selected fixtures with its frameworks and models into cells, draws
`samplesPerCell` at a fixed seed, and reports a grouped leaderboard.

```text
profile.fixtures[] (by id)  ─┐
profile.frameworks[]         ├─► cells = fixtures × frameworks × models
profile.models[]            ─┘        │  samplesPerCell @ seed
                                      ▼
                        scoring.scorer grades each cell
                                      │
                                      ▼
                        report + history in outputsDir
```

The one authoring constraint that ties the two together: **the scorer named in the
profile must match the fixture shape it scores.** Code-task oracle fixtures feed the
code-task / `5dim` scorer, evidence-contract fixtures feed the pattern scorer, and
reviewer-prompt fixtures feed the reviewer scorer. A profile that points a scorer at
the wrong fixture shape has nothing valid to grade. Also keep each id in
`profile.fixtures` matching an on-disk fixture's `id` field, not its filename.

---

## 6. AUTHORING WORKFLOW

Complete these steps in order. This workflow produces inputs; it never runs a
benchmark.

1. **Pick the family and shape.** Decide whether the new fixture is a code-task
   oracle, a pattern / capability evidence contract, or a reviewer-prompt fixture
   (section 3), and copy the closest existing fixture of that shape.
2. **Author a code-task oracle.** Name the function, write the `task`, `visibleSpec`,
   and `scope`, then generate every `tests[]` and `hidden_tests[]` value from a
   verified reference implementation. Split visible calibration cases from held-out
   hidden cases. Set `tier` and `saturation` honestly.
3. **Author a pattern / capability evidence contract.** Declare `requiredHeadings`,
   `requiredPatterns`, and `forbiddenPatterns` that match the real evidence a passing
   artifact carries, and add illustrative `content[]` lines.
4. **Author a reviewer-prompt fixture.** Follow
   [`reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/reviewer_schema.md):
   put the known-buggy input in `input`, add one visible and one hidden case, and keep
   `expectedFindings` token-specific enough to reject vague verdict-only output.
5. **Add or extend a profile.** Reference the fixture `id`, set a `scorer` matching
   the fixture shape, choose the `mode` and sweep matrix, and set `sampling`,
   `metrics`, and the `benchmark` gate.
6. **Parse the JSON.** Validate every authored fixture and profile as JSON (section 7).
7. **Hand off to the lane to run.** The package is the input; the deep-improvement
   lane dispatches the model, scores the output, and files the evidence.

---

## 7. VALIDATION

Fixtures and profiles are JSON; validate that they parse before handing off. Run from
the repository root:

```bash
node -e 'for (const f of process.argv.slice(1)) JSON.parse(require("fs").readFileSync(f,"utf8"))' \
  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/*.json \
  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/*.json && echo OK
```

- Every fixture and profile must parse; the command prints `OK`.
- The runner is the ultimate check — it fails a fixture it cannot parse, or one whose
  fixture shape does not match the profile's scorer.
- Markdown authored in this packet (this guide and the data READMEs) validates with
  the shared document validator:

  ```bash
  python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file>
  ```

---

## 8. RELATED RESOURCES

### Lane-local normative contracts (author to these; do not restate)

| File | What it owns |
| --- | --- |
| [`evaluator_contract.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) | Evaluator inputs, outputs, rubric dimensions, and hard-rejection behavior |
| [`lane_b_mechanics.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/lane_b_mechanics.md) | Entry-point routing, dispatcher, scorer selection, mode-aware promotion |
| [`benchmark_operator_guide.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/benchmark_operator_guide.md) | Running repeatable fixture benchmarks and reading the output layout |
| [`mixed_executor_methodology.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/mixed_executor_methodology.md) | Mixed-executor dispatch and the adjudication-iter false-positive filter |
| [`reviewer_schema.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/reviewer_schema.md) | Full reviewer-prompt fixture schema, verdict contract, deterministic replay |

### Data READMEs

| File | What it holds |
| --- | --- |
| [`model_benchmark/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/README.md) | Directory tree, key-file map, and the fixture-vs-profile flow |
| [`benchmark_fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_fixtures/README.md) | Tiered fixture taxonomy and per-fixture responsibilities |
| [`benchmark_profiles/README.md`](../../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/README.md) | The run profiles and their shared and sweep-only keys |

### Owning skill and sibling family

- [`deep-improvement SKILL.md`](../../../../system-deep-loop/deep-improvement/SKILL.md) — the mode that owns and runs the model benchmark.
- [`behavior_benchmark_guide.md`](../behavior_benchmark/behavior_benchmark_guide.md) — the sibling authoring guide for the behavior-benchmark family.
- [`../SKILL.md`](../../SKILL.md) — the `create-benchmark` packet contract for both benchmark families this packet authors.

---

*End of model benchmark fixture authoring guide — the evaluator rubric, scorer mechanics, and reviewer verdict contract stay lane-local in deep-improvement (section 8).*
