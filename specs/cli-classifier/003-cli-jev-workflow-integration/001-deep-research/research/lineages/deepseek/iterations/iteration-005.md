---
title: "Iteration 5: Finding triage and dispatch guards"
trigger_phrases: []
---
# Iteration 5: Finding triage and dispatch guards

**Angle:** deepseek-05 · **Lens:** integration engineer · **Wave 2** · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

Which of deep-review severity replay, fan-out duplicate collapse and the dispatch guards can take a Jev call inside their deadlines, and which cannot? Hand-off target: the triage seam with the cleanest wiring, its LOC, and the guard seams ruled out with the reason from code.

## Sibling check (required from wave 2)

Read `research/lineages/grok/iterations/iteration-007.md` (newest existing sibling; mimo still has no iterations). Grok kept a severity `choice` as a survivor and dropped supercov smells and new hub modes on published near-chance / single-mode grounds. It also reported my lineage as ending at iteration 2, which was true when it read; iterations 3-4 have since landed. Agreement: a severity second opinion is worth keeping (grok: survivor; here: next with the H14 binding named). I push past grok by naming the concrete reviewer-blind service and its deep-review adapter as the seam, and by ruling the guards out on deadline plus repository-fact grounds.

## Actions Taken (opened this iteration)

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:320-365`, callers `:486`, `:523`, `:539`
- `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:40-95`, `:510-590`
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:100-120`, `:250-275`
- `.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/README.md:1-60`
- `.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts` (grep: deep-review binding at `:63`)
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:55-82`

## Per-Idea Records

### Idea 5.1 — A Jev severity second opinion on P0 findings, through the existing blinded adjudication service

| Field | Content |
|---|---|
| **Idea** | `choice` with keys `P0`, `P1`, `P2`, `not_a_finding` over a finding's evidence, replayed beside the reviewer's severity call. |
| **Value** | Every P0 must survive an adversarial self-check or be downgraded (`completion-criteria.md:63`), and the verdict is computed from severity counts (`:75`). An independent severity read gives the adversarial step a second lens that is not the same agent checking itself. |
| **Seam** | The service is already built: `blinded-adjudication/README.md:12` (counterfactual verdict, candidate identity hidden), `:26` (deep-review validity and severity adapter), `mode-adapters.ts:63` (the binding). Severity contract: `completion-criteria.md:61` (P0/P1/P2 required), `:63` (adversarial replay), `:75` (verdict logic). |
| **Metric, baseline, harness** | H14 (blinded adjudication) as the harness; gold = archived deep-review findings with the final adjudicated severity, per the gap row "Finding triage agreement". Baseline: none recorded; the first slice must extract and freeze the gold set from archived `review/` findings. |
| **Cost, latency, privacy** | Offline review loop, no deadline. One call per P0 (not per finding), because only P0s carry the adversarial gate; state sent = finding evidence text. |
| **Opt-in and no key** | Offline arm in the review loop (env `SYSTEM_DEEP_LOOP_*`-family switch, or an explicit replay flag); with no key the adversarial self-check runs exactly as today and the replay reports the arm skipped. A Jev answer is recorded beside, never substituted. |
| **Complexity** | ~80-120 LOC: a replay runner over archived findings plus the adapter call; no change to the review protocol itself. |
| **Verdict** | **next** — the only triage seam where the comparison infrastructure, the gold source and the no-deadline budget all already exist; it is a measurement play first. |
| **Confidence** | Confirmed from code: adjudication service, adapter, severity contract, verdict logic. Inferred: severity agreement >= the reviewer's own replay; would be confirmed by the archived replay. |

### Idea 5.2 — A Jev same-point check for fan-out duplicate collapse

| Field | Content |
|---|---|
| **Idea** | `noul` "do these two findings make the same point" for pairs near the 0.15 title-overlap line and for cross-lineage pairs whose bodies differ. |
| **Value** | The current rule collapses only when the body content key matches *and* titles overlap at least 0.15 (`fanout-merge.cjs:341-351`). Same-point findings with different bodies are never compared at all; near-threshold pairs are decided by a calibrated constant. |
| **Seam** | `nearDuplicateMatches` `:348-351`; callers `:486`, `:523`, `:539`; title rule `:325-332`; constant `:341`. |
| **Metric, baseline, harness** | No harness for collapse correctness. Gap: a gold set of pairs (same-point / distinct) extracted from archived merges; baseline UNKNOWN. |
| **Cost, latency, privacy** | Offline merge step, no deadline; one call per candidate pair near the line (bounded by bucketing). |
| **Opt-in and no key** | A shadow pass that records candidate pairs and suggested collapses, never actually merging them until a threshold is measured; with no key the pass is skipped and merges stay byte-identical and reproducible. |
| **Complexity** | ~60-100 LOC plus gold extraction; the merge script is deterministic today, so any live adoption changes reproducibility and needs its own decision. |
| **Verdict** | **later** — no gold pair set exists, and the current rule is a deliberate calibrated contract; the shadow record is the honest first slice. |
| **Confidence** | Confirmed from code: rule, callers, deterministic construction. Inferred: that a Jev same-point call agrees with the intended collapse set; needs the gold. |

### Idea 5.3 — A Jev judgment inside the dispatch guard or the dispatch linter

| Field | Content |
|---|---|
| **Idea** | `noul` "is this repeated dispatch a hand-rolled loop" at the warn level of `evaluateDispatch`. |
| **Deadline** | task-dispatch guard hook 5 s and dispatch preflight lint 5 s (digest, `.claude/settings.json:67-68`, `:47-48`). `evaluateDispatch` is a pure synchronous function whose contract is `allow|warn|reject` with fail-open on any internal error (`dispatch-guard.cjs:526-579`); the loop count it uses is recorded state plus `WARN_AT_COUNT 2` / `BLOCK_AT_COUNT 3` (`:80-81`). |
| **Why it does not fit** | (a) The 5 s budget cannot be shown to hold a 60 s-timeout subprocess with no measured latency; a slow call inside a guard that must decide now is worse than the count. (b) The guard's evidence is repository facts (mode registry contents `:87-95`, recorded dispatch counts, the command-driven marker). The transport contract says a judgment that a repository fact can answer is a guess in JSON clothing (`integration-patterns.md:136`), and a `noul` on the same facts invites it. (c) The guard must be auditable and deterministic; a model answer makes an enforcement decision non-reproducible. |
| **Also drop** | The Jev-specific lint rules in `dispatch-rule-checks.mjs:107-117`, `:258-273` (stdin boundedness, choice/score cardinality) are already the correct surface for Jev mistakes and must not be replaced by a Jev call; S13's MCP route guard is a manifest lookup (digest). |
| **Verdict** | **drop**. |

## Findings

1. **The triage seam with the cleanest wiring is severity replay.** The blinded-adjudication service is explicitly built for "a counterfactual verdict comparing a baseline judgment with a policy-linked intervention, without exposing candidate identity" and ships a deep-review adapter for "validity and severity comparisons" (`blinded-adjudication/README.md:12`, `:26`). A Jev severity choice is exactly a baseline-vs-intervention comparison; the harness is not hypothetical.
2. **The review protocol already wants an independent adversarial step, and it is currently self-administered.** Every P0 must survive an adversarial self-check or be downgraded with rationale (`completion-criteria.md:63`); the verdict is then computed from severity counts (`:75`). A second lens here changes who checked, not what the rule is.
3. **Fan-out collapse is deterministic and blind to cross-body same-point pairs.** `nearDuplicateMatches` gates on an exact body-content key first (`fanout-merge.cjs:349`), so findings that make the same point with different bodies are never candidates; within matched bodies, the 0.15 title overlap (`:341`) decides. Both blind spots are measurable only with a labeled pair set that does not exist.
4. **Guard seams fail on both deadline and evidence type.** `evaluateDispatch` is synchronous, fail-open, and runs under a 5 s hook (digest); its inputs are repository facts. Adding a network judgment to it trades determinism and deadline safety for a guess about facts the code already has.
5. **The repo's own lint surface for Jev is already the dispatch linter** (`dispatch-rule-checks.mjs:107-117`, `:258-273`): bounded stdin, choice and score cardinality. This is the correct place for Jev rules to live, and it needs no Jev call to work.

## Ruled Out

- **Jev in the dispatch guard or dispatch linter** (5.3): 5 s deadline, repository-fact evidence, determinism required.
- **Jev as the actual merge decision in fan-out**: the merge is deterministic and replayable today; a model decision would need its own reproducibility story and a gold set first.
- **Jev as the reviewer's own adversarial check** (rather than beside it): the protocol's self-check is the reviewer's own lens; substituting a model keeps one lens while removing the author of the finding from the loop.

## Questions Answered

- Which triage seam is cleanest: deep-review severity replay through H14 (offline, service exists, gold source exists in archived findings).
- Which guards cannot take a call: task-dispatch guard and dispatch linter (5 s deadline, repository facts, determinism).
- Fan-out collapse: deadline-free but gold-less; shadow record first, later verdict.

## Questions Remaining

- Does a Jev severity call agree with the final adjudicated severity often enough to save a human pass? (H14 replay)
- How many archived P0 findings carry a final adjudicated severity that can serve as gold? (gold extraction; UNKNOWN)
- For fan-out: are there archived merge reports with human-confirmed distinct/collapsed pairs? (unopened; likely partial)

## Hand-off (for iteration 6 and later)

- Triage shortlist for wave 2 (wiring cost, cheapest first): severity replay via H14 (offline, service exists), then fan-out shadow pair record (needs gold), then nothing in the guards.
- A Jev severity answer is a second lens beside the reviewer, never the recorded severity; the adjudication service already enforces the blindness.
- Next iteration (deepseek-06) closes wave 2 with validation triage, routing clarify/defer and playbook verdicts; watch the same three tests: deadline, repository-fact evidence, frozen contract.

## Assessment

- `newInfoRatio`: `0.7`
- Novelty justification: Named the concrete H14 binding for severity replay, documented both blind spots of the deterministic near-dup rule, and ruled the guard seams out on evidence type in addition to deadline.
- Confidence: high for the adjudication service and the guard contracts; medium for the fan-out blind spots (a labeled pair set is unopened); UNKNOWN for archived gold sizes.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`
- `.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/README.md` and `mode-adapters.ts`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md`
- Sibling: `research/lineages/grok/iterations/iteration-007.md`
- Digest claims (not reopened): `context/seam-map.md` (S11-S13, S17, S18), `context/measurement-digest.md` (H14, gaps)
