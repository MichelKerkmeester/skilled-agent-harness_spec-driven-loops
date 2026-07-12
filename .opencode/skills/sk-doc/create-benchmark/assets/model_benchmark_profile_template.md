---
title: "Model Benchmark Profile Template"
description: "Fillable scaffold for a Lane B model-benchmark profile — the JSON config that tells run-benchmark.cjs and sweep-benchmark.cjs which fixtures, models, frameworks, scoring, sampling, and gate to run for one benchmark question."
trigger_phrases:
  - "model benchmark profile template"
  - "benchmark profile scaffold"
  - "model-vs-model profile template"
  - "Lane B profile json scaffold"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE Lane B model-benchmark PROFILE:
  system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/<your-profile>.json

Usage:
  1. Pick a lowercase-hyphen profile id, then cp this file to that path, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/model_benchmark_profile_template.md \
        .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/my-profile.json
  2. The shipped artifact is a JSON file, NOT markdown: it carries NO frontmatter and NO
     prose. Keep ONLY the contents of the fenced json block below, drop this whole .md
     wrapper (frontmatter, this comment, the prose sections, and the field-guidance comment).
  3. Fill every {{PLACEHOLDER}} and delete every field your mode does not use (see the
     field-guidance comment for which keys each mode carries).
  4. Validate the produced JSON before running it (see VALIDATION in section 1).

The field set, mode enum, swept axes, and per-mode defaults are NOT restated here — they are
normative in:
  .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md          (A–F mode enum, swept axis, defaults)
  .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs  (the hard validation rules)
  .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/README.md (shared vs sweep-only keys, shipped examples)
-->

## 1. OVERVIEW

A model-benchmark profile is the single JSON config a Lane B run loads with
`run-benchmark.cjs --profile <path-or-id>` (single-pass) or through
`sweep-benchmark.cjs` / the `loop-host.cjs` router (matrix sweeps). It declares the
fixtures to score, where outputs land, the scoring method, and — for a sweep — the matrix
of models, frameworks, and variants to run and the gate that decides eligibility. Pick the
`mode` whose swept axis matches the question you are asking (which model, which framework,
which reasoning effort, prompt A vs B, before vs after, or where one model is weak); the rig
never branches on the mode, so the swept axis is just the profile array carrying more than
one entry.

This template is a scaffold, not a normative contract. The authoritative field set, the
`mode` enum, the per-mode swept axis and defaults, and the hard validation rules
(executor enum, dimension weights that must sum to `1.0`, `correctnessGate.threshold` in
`[0,1]`, positive `samplesPerCell`) live in the sources named in the usage comment above and
in section 3 — do not re-derive them here.

**Validation.** Run from the repository root after filling the scaffold:

```bash
node -e "const {validateProfile}=require('./.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs');const p=require('./<path-to>/my-profile.json');const r=validateProfile(p);console.log(r.valid?'VALID '+p.profileId:'INVALID: '+r.errors.join('; '))"
```

Expected result: the profile parses as JSON and prints `VALID <profileId>`. A non-empty
error list means a field violates the validator contract — fix it before dispatch.

## 2. PROFILE SCAFFOLD

```json
{
  "profileId": "{{PROFILE_ID}}",
  "id": "{{PROFILE_ID}}",
  "version": "{{PROFILE_SCHEMA_VERSION}}",
  "family": "deep-improvement",
  "mode": "{{MODE}}",
  "fixtureDir": "{{FIXTURE_DIR_PATH}}",
  "fixtures": ["{{FIXTURE_ID_1}}", "{{FIXTURE_ID_2}}"],
  "fixtureSelection": {
    "include": ["{{FIXTURE_ID_1}}", "{{FIXTURE_ID_2}}"],
    "filters": { "tier": ["{{TIER_OR_DELETE_FILTERS}}"] }
  },
  "frameworks": ["{{FRAMEWORK_ID}}"],
  "models": [
    {
      "executor": "{{EXECUTOR}}",
      "provider": "{{PROVIDER}}",
      "model_slug": "{{MODEL_SLUG}}",
      "variant": "{{VARIANT}}"
    }
  ],
  "scoring": {
    "scorer": "{{SCORER}}",
    "correctnessGate": { "threshold": {{CORRECTNESS_THRESHOLD}} },
    "dimensions": [
      { "id": "D1", "weight": {{D1_WEIGHT}} },
      { "id": "D2", "weight": {{D2_WEIGHT}} },
      { "id": "D3", "weight": {{D3_WEIGHT}} },
      { "id": "D4", "weight": {{D4_WEIGHT}} },
      { "id": "D5", "weight": {{D5_WEIGHT}} }
    ]
  },
  "sampling": { "samplesPerCell": {{SAMPLES_PER_CELL}}, "seed": {{SEED}} },
  "reporting": { "groupBy": "{{GROUP_BY}}", "leaderboard": {{TRUE_OR_FALSE}}, "history": {{TRUE_OR_FALSE}} },
  "outputsDir": "{{OUTPUTS_DIR_WITH_SPEC_FOLDER_TOKEN}}",
  "metrics": ["{{METRIC_1}}", "{{METRIC_2}}"],
  "thresholdDelta": {{THRESHOLD_DELTA}},
  "benchmark": {
    "requiredAggregateScore": {{REQUIRED_AGGREGATE_SCORE}},
    "minimumFixtureScore": {{MINIMUM_FIXTURE_SCORE}},
    "repeatabilityTolerance": {{REPEATABILITY_TOLERANCE}}
  }
}
```

<!--
Field guidance (the enums and hard rules are authoritative in MODES.md and profile-validator.cjs):

  profileId / id      : stable lowercase-hyphen identifier; keep both equal. Used by --profile <id> and stamped into outputs.
  version             : the PROFILE schema version string (e.g. "1.0"), NOT this template's doc version.
  family              : "deep-improvement" for Lane B profiles.
  mode                : one of the six A–F values validated against KNOWN_MODES — model-vs-model | framework-bakeoff |
                        reasoning-ablation | prompt-vs-prompt | regression | capability-profile. OMIT the whole key for a
                        legacy single-pass profile (validator leaves a mode-less profile alone; it needs no sweep block).
  fixtureDir          : path to the fixtures folder the ids in "fixtures" resolve against.
  fixtures            : the fixture ids to score. Keep them in sync with fixtureSelection.include when both are present.
  fixtureSelection    : OPTIONAL sweep filter. "include" narrows the fixture set; "filters.tier" keeps only listed tiers
                        (e.g. ["T3"], ["T1","T3","T4"]). DELETE the whole object if you score the full "fixtures" list unfiltered.
  frameworks          : prompt-framework registry ids. One entry = fixed framework; 2+ entries = the swept axis for
                        framework-bakeoff / prompt-vs-prompt. Framework ids are data in sk-prompt's framework-registry.json.
  models              : one object per model cell. executor MUST be in KNOWN_EXECUTORS (cli-opencode | cli-claude-code).
                        Identify the model as provider + model_slug (preferred) OR a single "model": "provider/slug" key.
                        "variant" is the reasoning effort (e.g. high | medium | low | default). 2+ entries = the swept axis
                        for model-vs-model.
  variants            : OPTIONAL top-level array (e.g. ["high","medium","low"]) — the swept axis ONLY for reasoning-ablation.
                        When present, drop per-model "variant" and give models exactly one cell. OMIT this key for every other mode.
  scoring.scorer      : "5dim" (opt-in five-dimension scorer) | "pattern" (default heading/pattern matcher) — the ONLY two
                        scorers profile-validator.cjs accepts (KNOWN_SCORERS). OMIT the whole scoring block for the legacy
                        default pattern path. NOTE: the reviewer-prompt regression is a SEPARATE gated lane family, not a
                        standard profile scorer or one of the validated modes (KNOWN_MODES); it is not validated by
                        profile-validator.cjs — author it through the lane, not this profile scaffold.
  correctnessGate     : threshold in [0,1] (default 1.0). Correctness is a GATE, not a rank — a saturated fixture never crowns a winner.
  dimensions          : five weighted dims required by the 5dim scorer; the weights MUST sum to exactly 1.0. Canonical split is
                        D1 0.25, D2 0.30, D3 0.20, D4 0.15, D5 0.10. OMIT this block when scorer is not 5dim.
  sampling            : samplesPerCell is a positive integer (3 is typical; 5 for a tight prompt-vs-prompt call); seed pins reproducibility.
  reporting.groupBy   : the reducer axis — model | framework | variant | run_label | fixture. Match it to the mode's swept axis.
  reporting.leaderboard / history : booleans. leaderboard:false for regression (a delta, not a ranking); history:true keeps snapshots.
  outputsDir          : where reports land. Use the "{spec_folder}" (and/or "{run_label}") token — the runtime expands it at
                        dispatch time. Never hard-code a spec-folder path here.
  metrics             : the metric ids reported (e.g. score | delta | pass_rate).
  thresholdDelta      : OPTIONAL score-fraction below which a delta is a tie, not an improvement.
  benchmark           : the promotion gate. requiredAggregateScore and minimumFixtureScore are 0–100 score thresholds;
                        repeatabilityTolerance is the noise floor (0 asserts perfectly repeatable scoring). An optional
                        "repeatabilityCalibration" { basis, note } or "note" string may document the chosen tolerance.

  Legacy-only key (single-pass, mode omitted): "targetPath" names the single artifact scored — omit it for every sweep mode.
-->

## 3. RELATED RESOURCES

- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md`](../../../system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md) — the A–F mode operator guide: mode enum, swept axis, and per-mode `groupBy` / scorer defaults with a runnable profile delta for each.
- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs`](../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs) — the hard validation contract (`validateProfile`): mode enum, executor enum, dimension-weight sum, threshold range, positive sample count.
- [`../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/README.md`](../../../system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/README.md) — the shipped profiles, the shared-vs-sweep-only key split, and the `{spec_folder}` token policy.
- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/README.md`](../../../system-deep-loop/deep-improvement/scripts/model-benchmark/README.md) — the `run-benchmark.cjs` / `dispatch-model.cjs` entrypoints that consume a profile, and [`SWEEP.md`](../../../system-deep-loop/deep-improvement/scripts/model-benchmark/SWEEP.md) for how a sweep runs and what the outputs mean.
- The scorer/evaluator and reviewer scoring contracts stay lane-local in `system-deep-loop/deep-improvement`; cross-link them from there, never copy them into this package.
