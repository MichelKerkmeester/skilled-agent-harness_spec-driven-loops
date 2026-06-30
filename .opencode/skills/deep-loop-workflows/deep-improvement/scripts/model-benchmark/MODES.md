# A–F Modes — Operator Guide

Six situational benchmark modes, all driven by **the profile alone**. The rig code (`sweep-benchmark.cjs` + `lib/*`) never branches on the mode: it always does *expand matrix → render framework prompt → dispatch each cell → score each row → reduce by `groupBy`*. A "mode" is a thin selector that sets sensible defaults; **the only thing that changes between situations is the swept axis in the profile.** Pick the mode whose swept axis matches the question you are asking.

> **What "swept axis" means.** Any profile array (`models[]`, `frameworks[]`, `variants[]`) with more than one entry is a swept axis; every other axis collapses to a singleton. The matrix is `models × variants × frameworks × fixtures × samples`. You do not need a different mode to get a different sweep — you need a different array to carry more than one value. `mode` only documents intent and picks defaults (default `groupBy`, default scorer, default leaderboard).

The `mode` string is validated against a fixed enum in `lib/profile-validator.cjs` (`KNOWN_MODES`). The six valid values are exactly the six below. An unknown mode is rejected before any dispatch.

| Letter | `mode` value | Swept axis | Fixed | Default `reporting.groupBy` |
|--------|--------------|-----------|-------|-----------------------------|
| **A** | `model-vs-model` | `models[]` | prompt (one framework) + fixtures + variant | `model` |
| **B** | `framework-bakeoff` | `frameworks[]` | model + fixtures + variant | `framework` |
| **C** | `reasoning-ablation` | `variants[]` (high/med/low) | model + prompt + fixtures | `variant` |
| **D** | `prompt-vs-prompt` | two candidate prompts (frameworks) | model + fixtures + variant | `framework` |
| **E** | `regression` | run-label (before/after) | profile + fixtures + model + prompt | `run_label` |
| **F** | `capability-profile` | full tiered fixture taxonomy | one model + one prompt | `fixture` (often `category` × `tier`) |

Everything below is the **profile delta** for each mode. Shared keys (`fixtureDir`, `scoring`, `sampling`, `benchmark`, `outputsDir`) are the same shape as the shipped example profiles in `../../assets/model_benchmark/benchmark-profiles/`. The two shipped examples — `framework-bakeoff.json` (mode B) and `model-vs-model.json` (mode A) — are runnable references; the C–F snippets follow the same contract.

---

## A — model-vs-model

**Question:** which model is best at a fixed task, holding the prompt constant?

**Swept axis:** `models[]` (2+ entries). **Fixed:** one framework, the fixture set, the variant. **`groupBy`:** `model`.

```json
{
  "profileId": "model-vs-model",
  "id": "model-vs-model",
  "version": "1.0",
  "family": "deep-improvement",
  "mode": "model-vs-model",
  "fixtureDir": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["t3-lower-bound", "t3-compare-versions"],
  "frameworks": ["rcaf"],
  "models": [
    { "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7", "variant": "high" },
    { "executor": "cli-opencode", "provider": "deepseek", "model_slug": "DeepSeek-V4-Pro", "variant": "high" },
    { "executor": "cli-claude-code", "provider": "anthropic", "model_slug": "claude-opus", "variant": "high" }
  ],
  "scoring": { "scorer": "5dim", "correctnessGate": { "threshold": 1.0 } },
  "sampling": { "samplesPerCell": 3, "seed": 1729 },
  "reporting": { "groupBy": "model", "leaderboard": true, "history": true }
}
```

---

## B — framework bake-off

**Question:** which prompt framework gets the most out of a fixed model? (This is the situation that historically needed its own rig.)

**Swept axis:** `frameworks[]` (2+ entries from the registry). **Fixed:** one model, the fixture set, the variant. **`groupBy`:** `framework`.

```json
{
  "profileId": "framework-bakeoff",
  "id": "framework-bakeoff",
  "version": "1.0",
  "family": "deep-improvement",
  "mode": "framework-bakeoff",
  "fixtureDir": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["t3-lower-bound", "t3-compare-versions"],
  "frameworks": ["rcaf", "race", "cidi", "tidd-ec", "costar"],
  "models": [
    { "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7", "variant": "high" }
  ],
  "scoring": { "scorer": "5dim", "correctnessGate": { "threshold": 1.0 } },
  "sampling": { "samplesPerCell": 3, "seed": 1729 },
  "reporting": { "groupBy": "framework", "leaderboard": true, "history": true }
}
```

---

## C — reasoning-effort ablation

**Question:** does more reasoning effort actually help, holding model and prompt constant? `variant` is already forwarded to each supported executor (`--variant` for OpenCode, `--effort` for Claude), so this is pure config.

**Swept axis:** `variants[]` (e.g. `high` / `medium` / `low`). **Fixed:** one model, one framework, the fixture set. **`groupBy`:** `variant`.

```json
{
  "profileId": "reasoning-ablation-minimax",
  "id": "reasoning-ablation-minimax",
  "version": "1.0",
  "family": "deep-improvement",
  "mode": "reasoning-ablation",
  "fixtureDir": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["t3-lower-bound", "t3-compare-versions"],
  "frameworks": ["tidd-ec"],
  "models": [
    { "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7" }
  ],
  "variants": ["high", "medium", "low"],
  "scoring": { "scorer": "5dim", "correctnessGate": { "threshold": 1.0 } },
  "sampling": { "samplesPerCell": 3, "seed": 1729 },
  "reporting": { "groupBy": "variant", "leaderboard": true, "history": true }
}
```

---

## D — prompt-vs-prompt

**Question:** is candidate prompt B better than candidate prompt A for a fixed model? This is a two-entry framework sweep where the two "frameworks" are your two candidate prompts (registry ids, or inline framework definitions). It reuses the same scoring path as B with exactly two competitors.

**Swept axis:** two candidate prompts. **Fixed:** one model, the fixture set, the variant. **`groupBy`:** `framework`.

```json
{
  "profileId": "prompt-vs-prompt-candidate",
  "id": "prompt-vs-prompt-candidate",
  "version": "1.0",
  "family": "deep-improvement",
  "mode": "prompt-vs-prompt",
  "fixtureDir": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["t3-lower-bound", "t3-compare-versions"],
  "frameworks": ["rcaf", "costar"],
  "models": [
    { "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7", "variant": "high" }
  ],
  "scoring": { "scorer": "5dim", "correctnessGate": { "threshold": 1.0 } },
  "sampling": { "samplesPerCell": 5, "seed": 1729 },
  "reporting": { "groupBy": "framework", "leaderboard": true, "history": true }
}
```

> Swap the two `frameworks` entries for your own candidate prompt ids. With only two competitors, the trust verdict (WINNER / TIE / INCONCLUSIVE) is the whole point: a 2-way tie inside the noise floor means the prompt change did not move the needle.

---

## E — skill-change regression

**Question:** did a change to a skill/agent/prompt make a fixed configuration better or worse over time? This is the mode closest to the existing Lane B agent-improvement substrate: the swept axis is a **run label** (before vs after), and the reducer compares the labelled runs using the immutable report-history snapshots.

**Swept axis:** run-label (before/after). **Fixed:** the whole profile (model, prompt, fixtures) — only the run label and the underlying target change. **`groupBy`:** `run_label`.

```json
{
  "profileId": "regression-skill-change",
  "id": "regression-skill-change",
  "version": "1.0",
  "family": "deep-improvement",
  "mode": "regression",
  "fixtureDir": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["t1-echo", "t3-lower-bound", "t3-compare-versions"],
  "frameworks": ["rcaf"],
  "models": [
    { "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7", "variant": "high" }
  ],
  "scoring": { "scorer": "5dim", "correctnessGate": { "threshold": 1.0 } },
  "sampling": { "samplesPerCell": 3, "seed": 1729 },
  "reporting": { "groupBy": "run_label", "leaderboard": false, "history": true }
}
```

> Run the same profile twice with different `--out-dir` / label (before the skill change, then after). The history snapshots + `git_sha` / `profile_hash` in the reproducibility block are what make the before/after diff trustworthy. `leaderboard: false` because the comparison is a regression delta, not a ranking.

---

## F — capability profiling

**Question:** where is a single model weak, even when the easy fixtures are saturated? Sweep the **full tiered fixture taxonomy** against one model and read the per-category × per-tier × per-dimension breakdown. This is the anti-saturation payoff: a frontier model can ace every T1 smoke fixture and still show a clear weakness on a T4 adversarial fixture, and the gate keeps a saturated easy fixture from ever crowning a "winner."

**Swept axis:** the fixture taxonomy (T1 → T4 across categories). **Fixed:** one model, one framework. **`groupBy`:** `fixture` (read it as `category` × `tier`).

```json
{
  "profileId": "capability-profile-minimax",
  "id": "capability-profile-minimax",
  "version": "1.0",
  "family": "deep-improvement",
  "mode": "capability-profile",
  "fixtureDir": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-fixtures",
  "fixtures": ["t1-echo", "t3-lower-bound", "t3-compare-versions", "t4-tokenize-expr"],
  "fixtureSelection": {
    "filters": { "tier": ["T1", "T3", "T4"] }
  },
  "frameworks": ["tidd-ec"],
  "models": [
    { "executor": "cli-opencode", "provider": "minimax-coding-plan", "model_slug": "MiniMax-M2.7", "variant": "high" }
  ],
  "scoring": { "scorer": "5dim", "correctnessGate": { "threshold": 1.0 } },
  "sampling": { "samplesPerCell": 3, "seed": 1729 },
  "reporting": { "groupBy": "fixture", "leaderboard": true, "history": true }
}
```

> The fixtures above span tiers on purpose: `t1-echo` (T1 smoke / demote-class) confirms the harness end-to-end and is expected to saturate; the two T3 fixtures separate on real algorithmic correctness; `t4-tokenize-expr` (T4 adversarial, strict-acceptance with a malformed-input sentinel branch) is the one frontier models genuinely vary on. Reading the per-fixture verdict together is the capability radar.

---

## Notes that apply to every mode

- **Validation first.** `lib/profile-validator.cjs` rejects an unknown `mode`, an unknown `models[].executor`, dimension weights that do not sum to `1.0`, a `correctnessGate.threshold` outside `[0,1]`, and a non-positive `samplesPerCell` — before any dispatch. Keep the example shapes above and the validator stays green.
- **Correctness is a GATE in every mode.** `scoring.correctnessGate.threshold` (default `1.0`) decides who is *eligible* to be ranked; once correctness saturates it leaves the ranking, and the leaderboard ranks survivors on efficiency / format / reasoning. No mode can produce a correctness WINNER off a saturated fixture.
- **Read the verdict before the leaderboard.** Every mode's `synthesis.md` prints `## Trust verdict` and `## Saturation status` before `## Leaderboard`. A WINNER requires enough samples and a margin above the noise floor; otherwise the verdict is TIE or INCONCLUSIVE.
- **Frameworks are data.** Adding or swapping a framework (modes B and D) is a registry entry in `../../../sk-prompt/assets/framework-registry.json` plus a template — never a code change.

See `SWEEP.md` for how to run a profile and what the outputs mean.
