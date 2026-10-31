---
title: "Iteration 2: Active skill-advisor recommendations, the wiring"
trigger_phrases: []
---
# Iteration 2: Active skill-advisor recommendations, the wiring

**Angle:** deepseek-02 · **Lens:** integration engineer · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

Can a Jev tie-break live inside the 2500 ms advisor child, or only as a shadow lane or an offline precompute, and what does each shape cost in code? Hand-off target: the feasible shape (live, shadow or offline), the flag name pattern it would copy, and the files a shadow lane touches.

## Actions Taken (opened this iteration)

- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:1-230`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:40-120`, `:760-870`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:1-80`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:1-90`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:1-80`
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:70-160`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:100-140`

## Per-Idea Records

### Idea 2.1 — Offline Jev tie-break arm on the routing-accuracy eval (feasible first shape)

| Field | Content |
|---|---|
| **Idea** | `choice` over the top 2-3 skill candidates for prompts whose top-two margin is inside the ambiguity window; run offline over the labeled corpus, not in the hook. |
| **Value** | Tests whether a different-family judge settles the near-tie cases the numeric scorer cannot, before any live wiring exists. Operator-visible payoff comes later; this is the proof gate. |
| **Seam** | `score-outcome-rerank.mjs:127-133` (baseline arm vs rerank arm on the same split; metrics at `:107-111`); cluster definition at `ambiguity.ts:22-36`; the cluster is exactly a small explicit option map (`ambiguity.ts:47-57`). |
| **Metric, baseline, harness** | H2 (MRR, right@1, right@3) and H1 (ratchet; ambiguity slice + holdout). Digest baselines: H1 full 152/195 = 0.7795, holdout 53/70 = 0.7571, ambiguity 18/24 = 0.75 (digest claim, not rerun). H2 baseline is UNKNOWN until the first run. Design: replace `outcomeWeightedRerank` with a `jev choice` arm on the same deterministic 50/50 split (`score-outcome-rerank.mjs:118-121`); never write into the ratchet baseline, because the Jev arm is network-dependent. |
| **Cost, latency, privacy** | One billed call per near-tie row, offline (no deadline). State sent: prompt plus candidate ids and descriptions; forwarded verbatim (digest claim). |
| **Opt-in and no key** | Script-level arm (`--arm jev` or an env flag in the eval script family, `SPECKIT_ADVISOR_*` convention at `fusion.ts:50-52`, `:69`); with no key the script skips the arm and reports "skipped, no key", leaving the baseline arm's numbers intact. |
| **Complexity** | ~40-80 LOC in the eval script plus a thin `jev` spawn helper; no runtime file touched; no hook deadline involved. |
| **Verdict** | **next** — the only shape that fits today, and it produces the number that decides whether any live shape is worth building. |
| **Confidence** | Confirmed from code: arm pattern, split, metrics, cluster definition. Inferred: that Jev beats the scorer on near-ties (that is the question being measured). UNKNOWN: H2 baseline, Jev latency, cost. |

### Idea 2.2 — Cached Jev shadow lane (only after 2.1 shows headroom)

| Field | Content |
|---|---|
| **Idea** | A `nev_shadow` lane (or `jev_shadow`) that reads a precomputed answer cache keyed by prompt hash and records Jev-vs-live deltas; never fused. |
| **Value** | Collects live disagreement data with zero routing risk, exactly how the BM25 shadow lane and the semantic shadow lane already behave. |
| **Seam** | Lane definition `lane-registry.ts:21-29` (`live: false`, `defaultShadowWeight`, per-lane `envFlag`); shadow weight channel `:38`; delta sink `shadow-sink.ts:86-89`, `:151-155` with workspace-bounded path `:93-98`. |
| **Metric, baseline, harness** | H5 (shadow sink) scored offline by H1. Disagreement rate is the first number; it becomes accuracy only with gold. |
| **Cost, latency, privacy** | Zero in-child calls if the cache is precomputed; the cache producer is a separate out-of-band step. |
| **Opt-in and no key** | `SPECKIT_ADVISOR_JEV_SHADOW` (inferred name, to verify live) plus the cache path; lane reports a `disabledReason` when the cache is absent, mirroring `semantic-shadow.ts:15-29`. |
| **Complexity** | ~120-200 LOC across `lane-registry.ts`, a new `lanes/jev-shadow.ts`, fusion plumbing and the cache producer; no daemon exists today, so the producer is new machinery. |
| **Verdict** | **later** — blocked on 2.1's result and on a cache/producer decision; building it before the offline number exists is machinery ahead of demand. |
| **Confidence** | Confirmed: lane and sink patterns. Inferred: that the lane can stay in budget from the cache; would be confirmed by a measured replay. |

### Idea 2.3 — Live in-child tie-break

| Field | Content |
|---|---|
| **Idea** | `choice` inside the advisor child while the scorer runs, before the `passes_threshold` decision. |
| **Deadline** | Child timeout 2500 ms minus 300 ms startup margin = 2200 ms effective (`user-prompt-submit.ts:22-24`, `:105-117`); timeout is SIGKILL (`:116`) and the shim then returns `{}` (`:121`), losing the whole advisory, not just the tie-break. Hook window 3 s per the seam map (`.claude/settings.json:109-110`). Python `jev` client timeout is 60 s per the digest; no latency is measured in-repo; vendor pages claim ~150 ms per answer (vendor claim, not reproduced). |
| **Verdict** | **drop** — an unmeasured-latency subprocess under a hard 2200 ms kill is a mechanism that converts a slow network call into total recommendation loss. It can be revisited only after the gap row "Jev latency and cost per call" has a measured p95 that fits with margin. |
| **Confidence** | Confirmed from code: margin, SIGKILL, `{}` fail-open. Confirmed from digests: client timeout, absence of measured latency. |

## Findings

1. **The advisor budget is tighter than the seam map's 2500 ms suggests.** The shim reserves 300 ms and passes `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS = 2200` to the child (`user-prompt-submit.ts:107`), then SIGKILLs at 2500 ms (`:114-116`) and fails open to `{}` (`:118-122`). Any added process must fit inside a budget that also covers the scorer itself.
2. **The cluster is already an option map.** `ambiguousCluster` unions the 0.05 score-margin and 0.05 confidence-margin groups (`ambiguity.ts:22-36`), and `applyAmbiguity` labels every member with `ambiguousWith` (`:44-57`). A `choice` over 2-4 members with each skill's description as the option text needs no new data model.
3. **The repo already has the shadow pattern and the delta sink.** `SHADOW_SCORER_LANE_DEFINITIONS` carries `live: false`, a `defaultShadowWeight` and a per-lane `envFlag` (`lane-registry.ts:21-29`); shadow weights live in their own channel (`:33-38`); the sink is opt-in and appends JSONL (`shadow-sink.ts:86-89`, `:120-124`, `:151-155`).
4. **The rerank script is the template for an offline arm.** Baseline order and rerank order are scored on the same deterministic split (`score-outcome-rerank.mjs:118-133`) and reported as MRR/right@1/right@3 (`:107-111`). Replacing only the rerank function with a `jev choice` keeps the comparison clean.
5. **Flag names to copy (verified in code):** opt-in booleans use `SPECKIT_ADVISOR_*` with `TRUE_FLAG_VALUES` and default false (`fusion.ts:50-52`, `:69`, `:111-114`). A repo-side Jev switch belongs in this family; `JEV_*` names belong to the transport's own provider selection (`JEV_PROVIDER`, `JEV_MODEL`).
6. **No daemon exists.** The advisor child is `spawnSync` per prompt (`user-prompt-submit.ts:109-117`); a cross-prompt Jev cache would be the first persistent component between prompts the advisor has ever had. That is why 2.2 is machinery, and why 2.1 (offline) is the honest first step.

## Ruled Out

- **Live in-child Jev call** (2.3): SIGKILL at 2500 ms turns a slow call into total advisory loss; no measured latency exists to bound it.
- **Jev as a fused live lane**: `passes_threshold` is code-owned (`fusion.ts:785-787`) and a Jev answer is one lens; fusing it would make a model answer a routing verdict.
- **Calling `jev` from the hook shim itself**: the shim is a thin process boundary that only resolves and spawns the advisor target (`user-prompt-submit.ts:5-6`, `:97-145`); adding a second spawn there would duplicate the budget and bypass the scorer's data.

## Questions Answered

- Feasible shape: offline eval arm first; cached shadow lane second; live in-child dropped on deadline grounds.
- Flag pattern: `SPECKIT_ADVISOR_*` boolean, default off; shadow lane carries its own env flag.
- Files a shadow lane touches: `lane-registry.ts`, new `lanes/jev-shadow.ts`, fusion plumbing, shadow-sink path config, plus a cache producer.

## Questions Remaining

- Does Jev beat the similarity order on near-tie rows (right@1/MRR)? Needs the 2.1 arm run with a key.
- Is the measured Jev p95 small enough for any in-child use? Needs the latency/cost gap row filled.
- Which option text (skill id, description, or both) moves accuracy? An arm variant, measurable offline.

## Hand-off (for iteration 3 and later)

- Any live advisor proposal must budget against 2200 ms, not 2500 ms, and must survive a SIGKILL-returns-`{}` failure.
- The offline arm measures against the H1 ambiguity slice and holdout; it must never write the ratchet baseline.
- Next iteration (deepseek-03) moves to the goal hook and compaction; watch the same pattern there: hook deadline first, judgment second, degrade path third.

## Assessment

- `newInfoRatio`: `0.8`
- Novelty justification: First pass that pinned the real advisor budget (2200 ms effective, SIGKILL to `{}`), classified the three wiring shapes, and identified the offline arm as the only deadline-free shape with an existing template.
- Confidence: high for the child budget and fail-open behavior; medium for the vendor latency claim; UNKNOWN for Jev accuracy on this corpus.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs`
- Digest claims (not reopened): `context/seam-map.md` (S01-S05, hook deadlines), `context/measurement-digest.md` (H1, H2, H5)
