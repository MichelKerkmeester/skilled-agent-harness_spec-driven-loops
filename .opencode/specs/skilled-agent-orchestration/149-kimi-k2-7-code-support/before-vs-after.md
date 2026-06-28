# What Changed in 149: Kimi K2.7 Code Support

> Kimi K2.7 Code is now registered, routed, benchmarked, caveated and documented as a first-class small-model option, with `costar` as the empirical default, `tidd-ec` as fallback and `rcaf` retired for this model.

---

## THE UNIFYING PRINCIPLE

This packet treated model support as an evidence pipeline, not a registry edit. A model is not ready because a slug resolves. It is ready when dispatch works, aliases route, prompt advice has a stated confidence level, benchmark evidence can survive a harder test and the operational caveats are visible where users choose the model.

The same rule handled the reversals. Run 006 did not produce a winner, so the registry did not pretend it did. Run 007 separated the frameworks, so the registry changed. A broad-scope dispatch failed in a way that looked like a hang, so the profile and CLI docs gained the caveat instead of hiding the failure as an implementation nuisance.

That rule shaped every section below.

---

## 1. MODEL REGISTRATION AND ROUTING

**Before**

Kimi K2.7 Code existed as a provider capability, but the framework did not treat it as a first-class small model. The small-model registry had the older `kimi-k2.6` entry. The `kimi` alias did not point at Kimi K2.7 Code, the model profile did not exist and `cli-opencode` did not carry the Kimi For Coding login and model-selection guidance.

**After**

`kimi-k2.7-code` was added to `sk-prompt-models/assets/model-profiles.json`, with live provider facts from `opencode models kimi-for-coding`: slug `kimi-for-coding/k2p7`, context 262144, output 32768 and display name `Kimi K2.7 Code`. The new profile landed at `sk-prompt-models/references/models/kimi-k2.7-code.md`. `sk-prompt-models/SKILL.md` gained frontmatter, keywords, triggers, aliases and the §3 dispatch row. `kimi` now resolves to `kimi-k2.7-code`, with `kimi-k2.7`, `kimi-for-coding` and `k2p7` also present. `kimi-k2.6` stayed available but moved to historical status.

**Impact**

Users can ask for Kimi in the natural ways the framework expects and land on the correct small-model profile. The older Kimi entry no longer competes with the active one, but old references do not break.

**Why liveness was not enough**

The phase proved the slug with a real smoke dispatch that returned `pong`, exit 0, cost 0. That confirmed authentication, routing and billing. It did not claim quality. The prompt-framework question was deliberately left `default-unverified` until the bakeoff phases produced evidence.

---

## 2. PROMPT-FRAMEWORK EVIDENCE

**Before**

The profile started with RCAF as a convention default, not as an empirical recommendation. Phase 001 also recorded that `--variant high` was accepted by the CLI, but its quality effect was benchmark-unverified.

**After**

Run `006-kimi-k2.7-prompt-framework` tested five frameworks, `rcaf`, `race`, `cidi`, `tidd-ec` and `costar`, against two real T3 coding fixtures through the deep-loop sweep engine. It completed 30 of 30 real `kimi-for-coding/k2p7` dispatches with no fallback. The output files `aggregate.json`, `results.json` and `synthesis.md` were written, and the secondary `gpt-5.5` judge files were written too.

The verdict was a TIE. Correctness saturated across all five frameworks, `correctness_saturated: true` was surfaced explicitly and the engine fell to efficiency as the ranking key. Phase 003 promoted that result honestly by keeping `primary: rcaf`, `status: default-unverified`, null primary and fallback scores, benchmark `006-kimi-k2.7-prompt-framework` and a low-confidence evidence sample explaining the TIE and saturation.

**Impact**

The framework avoided turning an easy benchmark into false certainty. Phase 003 gave users the truth at that moment: RCAF remained the convention default because the run could not discriminate, not because it won.

**Why the secondary judge stayed advisory**

The standalone `gpt-5.5` judge ranked perceived clarity, not correctness. It flagged some oracle-confirmed-correct code as buggy, which is a known LLM-judge failure mode. That made it useful context but not load-bearing evidence.

---

## 3. DISCRIMINATING BAKEOFF AND FINAL RECOMMENDATION

**Before**

After run 006, the live recommendation still had no empirical winner. The model appeared strong enough that easy fixtures could not separate prompt frameworks.

**After**

Run `007-kimi-k2.7-discriminating` changed the test. The profile `kimi-k2.7-discriminating.json` used invalid-dominant strict validators, five frameworks, `correctnessGate.threshold` 0.0 and 6 samples per cell. The run recovered from an accidental external kill at 52/120, relaunched from saved state, fixed a throttle bug and persisted serial real `kimi-for-coding/k2p7` dispatches. `hard-roman-to-int` was excluded after it stalled under orchestration churn, leaving three fixtures in the final leaderboard.

The result was separable, not saturated. `tidd-ec`, `race` and `costar` scored 1.000, `cidi` scored 0.996 and `rcaf` scored 0.992, with n=18 each. The registry moved to `primary costar`, `fallback tidd-ec`, `avoid rcaf`, `status empirical` and benchmark 007. The model profile §1, §3, §4 and §5 plus `_index.md` mirrored that result.

**Impact**

Kimi K2.7 Code now has model-specific prompt guidance grounded in a stricter test. The important conclusion is not that `costar` decisively beats every other framework. The important conclusion is that `rcaf`, the inherited default, measured weakest, while the perfect tier gave the packet a better empirical default and fallback.

**Why confidence is medium**

The result clearly separates `rcaf` from the perfect tier, but it does not statistically separate `costar`, `tidd-ec` and `race`, each at correctness 1.0 with 90% CI `[0, 0]`. Three fixtures at 6 samples per cell support the recommendation, while a larger fixture set would tighten confidence on within-tier ordering.

---

## 4. FILENAME ALIGNMENT AND LIVE REFERENCE REPAIR

**Before**

`sk-prompt-models` mixed dash-named documentation and asset files with a house underscore convention. The Kimi work touched enough of that surface that the inconsistency became part of the maintenance cost. At the same time, the model-profile files could not simply be renamed, because their dashed paths derive from external model ids.

**After**

Seven `sk-prompt-models` targets moved from dash names to underscore names, including the JSON assets now named `model_profiles.json` and `per_model_budgets.json`. Every live inbound reference was repaired across `sk-prompt-models`, `cli-opencode`, `cli-claude-code`, `cli-codex`, the root `README.md`, the pre-commit hook hint and packet metadata. The drift guard `json.load` path changed to `model_profiles.json`.

The four model-profile files stayed dashed, and that was intentional. `check-prompt-quality-card-sync.sh` couples those filenames to the dashed model ids, and the guard confirmed all four still resolve.

**Impact**

The house filenames now follow the underscore convention where they can, without breaking the model-id contract where they cannot. The live wiring has no stale references to the six unique old dash names, both renamed JSON files parse and the card-sync guard still passes.

**Why archived references stayed old**

About 293 historical spec-doc references across `z_archive`, `026`, `027`, `152` and `154` still name the old dash filenames. They were point-in-time records, and the chosen scope was live wiring. Preserving those records was deliberate.

---

## 5. OPERATIONAL CAVEAT FOR BROAD SCOPE

**Before**

The profile and CLI docs did not warn users about the failure mode seen on a broad or large-repo dispatch. A Kimi run could look hung from the outside because the process emitted no final assistant message before timeout.

**After**

`kimi-k2.7-code.md` now records the broad-scope failure mode in §5 and the `variant_flag` caveat in §6, with a §2 average wall-clock observation. `model_profiles.json` records the over-exploration and timeout weakness. `cli-opencode/SKILL.md` carries the caveat on the `kimi-for-coding/k2p7` line. `cli_reference.md` and `context-budget.md` also repaired stale `kimi-k2.6` references to `kimi-for-coding/k2p7` and `kimi-k2.7-code`, with the 262,144 context recorded.

The caveat is specific. With `--variant high` on broad scope, Kimi can over-explore through many sequential reads and exceed a 600s timeout before emitting. Because `opencode` flushes only the final assistant message to stdout, a killed run yields 0 bytes. The mitigation is a hard read cap in the prompt, a 1200s or longer timeout and optionally omitting `--variant`.

**Impact**

A user who sees a zero-byte timeout now has a documented explanation and a mitigation. The docs no longer present Kimi K2.7 Code as merely high-context and capable while hiding the runtime behavior that affects large-repo use.

**Why it is framed as an observation**

The evidence is two timeouts and one fixed run. That is enough to document the caveat and protect users, but not enough to claim `--variant high` is the sole cause. The parent keeps the controlled A/B as an open question.

---

## CURRENT STATE

Spec 149 is shipped as a completed phase parent with six completed children. Kimi K2.7 Code is registered as `kimi-k2.7-code`, dispatches through `kimi-for-coding/k2p7`, routes from the `kimi` aliases, appears in the active model index and carries empirical prompt guidance from run 007. The live recommendation is `costar` primary, `tidd-ec` fallback, `rcaf` avoided and status `empirical`.

The packet also leaves a clear audit trail. Run 006 remains documented as a correctness-saturated TIE. Run 007 supplies the separable strict-validator evidence. Filename alignment is complete for live wiring, with dashed model-profile paths preserved by contract. The broad-scope timeout caveat is visible in both small-model and `cli-opencode` surfaces. Verification recorded live dispatch, card-sync guard passes, JSON parse checks, strict validation at exit 0 for the phases and task completion counts for all six children.
