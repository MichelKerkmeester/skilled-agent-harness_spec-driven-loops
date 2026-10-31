# Iteration 3: Adjacent Judgments and Default-On Contract

## Focus

Compare nearby `.skilled` judgment surfaces and map the conditions, architecture, costs, and risks for a future default-on clarify suggestion.

## Actions Taken

- Compared 021 leaf-route replay, 022 alignment suggestion, and 031 debug-next-check code and recorded results.
- Traced the front door and compiled runtime output contract.
- Drafted a minimal suggestion contract that preserves the existing clarification and user authority.

## Findings

1. **021 leaf-route replay is the closest adjacent evaluation surface, but it shows the same data scarcity.** It asks Jev to choose among candidate leaf intents and uses three option rotations; its fixed gate requires five improvable ties. The 047 results report only 2 tied rows among 58 scored playbook rows, so it stopped before any model call. It is the best next related evaluation once more replay-verified ties exist, not a positive Jev result today. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:32-46`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:11`]

2. **022 alignment suggestion is a nearby, higher-impact destination choice, but its keep is not clean evidence of choosing the right destination.** Its scorer measures below-50 alignment events and asks Jev to choose a listed spec folder. The 047 report says the 40-row fixture made the target wrong on every row; Jev's 39/40 is therefore compared with the top alternative (30/40), not with the true target. It merits a better-grounded follow-up fixture, especially because choosing the wrong spec destination can misplace work. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:5-7,58-67,1115-1140`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:12`]

3. **031 debug-next-check is another cost-sensitive judgment, but its recorded Jev run loses to the deterministic baseline.** The task is to choose the cheapest next check for a debug hypothesis. Jev scored 27/36 against `read_code` at 29/36, with W=6 and L=8; the run stopped on margin. This is a useful negative result: a semantic suggestion does not automatically save investigation time. [SOURCE: `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs:5-8,68-84`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:19`]

4. **The current output contract cannot support a mode suggestion, and the 020 spec explicitly leaves that integration out of scope.** The runtime wrapper evaluates the hub but returns only `hubId`, `action`, selection kind, targets, policy hash, and generation; the front door serializes that output and catches resolver failures by returning a legacy sentinel. The feature spec says its keep serves nothing, keeps a live judgment and output change out of scope, and says the router owner must add a seam before any serving decision. [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:26-51`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,150-166,212-214`]

5. **A safe future contract is a validated optional suggestion attached to `action: clarify`, never an automatic route.** The runtime should expose the exact mode alternatives on a supported clarify, and an optional `suggestedMode` should be accepted only if it is one of those alternatives and is bound to the same hub, policy hash, and generation. Keep the action/authority as clarify/withheld and let the user confirm. `none_of_these`, a malformed or uncalibrated answer, provider failure, timeout, missing credentials, or a changed policy must leave the original clarification unchanged. The current keep includes 12 `none_of_these` answers, which cannot be preselected modes, and the 020 scope says the model must not replace the deterministic router. [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:38-51`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,150-166`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json:5-18`]

6. **A default-on rollout first needs a corrected holdout, an eligibility gate, and a later scope amendment.** Eligibility must require a compiled `action: clarify`, at least two valid mode alternatives, and an enabled hub whose choices are mode routes (not mcp bundles or checklist items). Before default-on, test actual mode-selection lift separately from abstention, by hub and on held-out replay-verified rows, then run a shadow period that measures user acceptance and overrides. The existing feature spec excludes a live judgment, changed response contract, shared client/global switch, and dollar figure, so this requires an owner-approved follow-up phase rather than treating the current keep as authorization. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:70,88-104,150-166`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:106-155`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10-12`]

7. **Default-on financial and latency cost are still unknown; the benchmark provides only a sizing point.** Current data is 3 serial Jev choices per row, about 19,446 estimated input tokens per 54 rows, and about 0.98 seconds for three median calls per prompt (an inference from the 327.5 ms per-call median, not measured end-to-end latency). A useful cost model is eligible clarifications per month × choices per clarification × measured input/output tokens × the configured provider tariff, plus fixed service overhead. The 90-second benchmark timeout is not suitable as a user-facing latency budget by itself. The spec says real clarify rate is not measured and transcript text needs payload acceptance/redaction; any default-on path must measure volume, enforce a short deadline and call budget, avoid logging prompt text, and preserve the existing clarification on failure. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt:9-12`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl:1-163`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:47-54,1006-1053`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:89,97-104,198-204,212`]

## Questions Answered

- **Where else would this judgment pay off?** 021 leaf-route replay is closest to parent-hub routing but has only 2/58 eligible ties; revisit with more data. 022 spec-folder alignment is a related destination choice but its fixture's target is wrong on all rows, so repair its truth labels first. 031 debug-next-check is a cost-sensitive decision with a negative result and should not be enabled on current evidence.
- **What would default-on require?** A feature-phase scope amendment; route output with validated mode alternatives and an additive suggestion field; only eligible clarify calls; same-hub and generation binding; user confirmation; calibrated quality on a replay-verified holdout; low-latency fail-open behavior; provider/credential/cost budgets; privacy acceptance and redaction; aggregate acceptance, override, error, and latency telemetry; compatibility checks for current stdout consumers.
- **What does it cost and risk?** For the benchmark, 3 serialized calls per candidate and estimated 19,446 input tokens for 54 rows; production call volume, actual billed tokens, tariff, and end-to-end latency are unknown. Risks include wrong-mode anchoring, sending sensitive prompts to a provider, latency/credential failure, stale suggestions, and breaking consumers if the output schema changes.

## Questions Remaining

- Does a replay-verified held-out population contain enough eligible clarifications across supported hubs to measure mode-selection lift?
- Which single-call or other lower-cost strategy preserves performance against the 3-rotation reference?
- What provider tariff, real event volume, and user latency budget apply to a candidate integration?
- Which router owner will approve and own the output contract and runtime service dependency?

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
- `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
- `.skilled/bin/compiled-route.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`
- Prompt pack: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/lineages/luna/prompts/iteration-003.md`

## Assessment

- `newInfoRatio`: 0.71
- Novelty: evaluated three distinct `.skilled` judgment seams and derived a minimal output/authority contract plus the variables missing from a production cost estimate.
- Confidence: high for current contracts and recorded adjacent results; medium for prioritization because the adjacent candidate fixtures also have sample limitations; low for default-on monetary cost and user impact until live volume and pricing are measured.
- Convergence telemetry: the new information ratio remains above 0.05. The user-set maximum of 3 iterations is reached after this pass; synthesize now with `stopReason=maxIterationsReached`.

## Reflection

The nearest adjacent router experiment is blocked by tie scarcity, and the strongest adjacent keep result has a flawed target baseline. Those results support a research pipeline that verifies the decision population before spending on a model call. The current 020 keep is not enough evidence to move a model suggestion into the live route contract.

## Recommended Next Focus

Synthesis: rank the measurement repair first, then a scoped suggestion-only integration design; retain unresolved label provenance, population, production cost, and router-owner questions.
