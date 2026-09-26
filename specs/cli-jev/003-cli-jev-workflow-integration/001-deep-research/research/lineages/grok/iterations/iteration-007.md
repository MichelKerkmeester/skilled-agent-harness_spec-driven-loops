# Iteration 7: grok-07 — New surfaces, the case against a second mode

## Focus

Whether vendored surfaces earn a new skill mode or command. Focus Area is `grok-07`. At most two bold surfaces, each with a kill criterion. Iteration 6 already kept an offline routing `choice` and a fail-closed injection `noul`. This iteration asks what else the catalogues offer, and why the hub should stay one mode.

Sibling check: DeepSeek still ends at `iteration-002.md`. MiMo still has no iteration file.

## Actions Taken

Opened claude-jev's hypothesis questions, `noulOf`, supercov's smell list, the pi-jev README's egress warning, and this repo's `cli-jev` hub router. No live `jev` call.

## Findings

The hub registers one mode. `defaultMode` is null. `ambiguityDelta` is 1. The tie break is `cli-usage`. The ordered-bundle outcome says it is unreachable while the hub registers one mode: a request that pairs a judgment with an edit still routes single to `cli-usage`, and the caller takes the edit to the hub that owns it. [SOURCE: .skilled/skills/cli-jev/hub-router.json:4-14]

A second mode for "screen" or "hypothesize" would be a new routing surface. The fitness checklist's question 13 says a registered mode is not a routed mode, and a new alias has to be replayed against an out-of-domain phrase. That cost is not earned by a catalogue that `cli-usage` can already ask as `noul` and `choice`.

claude-jev ranks a hypothesis in code. `readHypothesis` multiplies `explains` by 0.6 and `supported` by 0.4. `noulOf` throws `MissingAnswerError` when the answer is missing or not finite. It does not coerce to 0. The `next_check` question is a `choice` among `read_code`, `run_test`, `reproduce`, and `instrument`. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:17-45] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:58-69] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/question.ts:76-81]

That throw is the pattern iteration 6 said `runScreen` lacks. The weights are a cookbook. The choice is the part that could be a suggestion. This repository already has a debug skill with a fixed phase order. A rank that skips a phase would replace that workflow.

supercov's smell questions publish their own ceilings. `deep_nesting` asks the model to count levels of control flow, and its evidence line says 72.0% alone. `god_class` is 52.3%. `duplicated_logic` is 50.8%, "near chance on size-matched pairs." Counting is on the jaggedness list from iteration 4. A smell near chance is not a command. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json:17-22] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json:4-7] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json:38-42]

pi-jev's README states the privacy fact in the operator's voice: candidate history, tool arguments, text results, and excerpts go to `https://api.typesafe.ai/v1/systemone`, and no request is made while disabled. `enabled` defaults to false. An API error pauses judging, and previously saved pruning still applies. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/README.md:37] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/README.md:85-87]

The announcement is worth copying onto any later call. The prune-on-error behavior is the opposite of iteration 3's keep-prior-behavior rule, because saved pruning remains after the call fails.

### Idea: a `next_check` choice logged beside a debug hypothesis

| Field | Content |
|---|---|
| **Idea** | Python `jev-cli` `choice` with the four `NEXT_CHECK_OPTIONS`. Code prints the key. It does not reorder the debug phases and it does not compute the 0.6/0.4 rank. |
| **Value** | A cheapest-next-step suggestion when a person is already comparing hypotheses. |
| **Seam** | The outside question is `hypotheses.ts:41-44`. The local router that must not grow a mode for it is `hub-router.json:7`. There is no debug-phase function opened in this iteration, so the caller is not named beyond the existing debug skill. |
| **Metric, baseline, harness** | How often the choice matches the check a person actually ran next, on a set of past debug notes. Baseline UNKNOWN. No harness exists. |
| **Cost, latency, privacy** | One `choice` per hypothesis. The symptom and the cited code leave the machine. The pi-jev sentence has to be printed before the first call. |
| **Opt-in and no key** | Default off, inside a debug session the operator asked for. No key: `noulOf`'s throw, adapted, means print nothing and continue the phase list. Do not copy `runScreen`'s 0. |
| **Complexity** | About 40 lines in a debug helper, zero hub changes. |
| **Verdict** | later. The choice is well shaped and the missing-answer behavior throws. There is no labeled set of "what we did next," so the suggestion has nowhere to lose. |
| **Confidence** | Confirmed for the throw and the weights. Usefulness is inferred. |
| **Kill criterion** | The choice is wired into phase order, the 0.6/0.4 rank is shown as a verdict, or a labeled replay matches the person's next check no more often than "always read_code." |

### Idea: a smell command, or a second hub mode

| Field | Content |
|---|---|
| **Idea** | Register `cli-jev` modes for screen, smells, or hypotheses, or ship supercov's twelve questions as a command. |
| **Value** | A named surface operators can route to. |
| **Seam** | `.skilled/skills/cli-jev/hub-router.json:11` says the bundle is unreachable on purpose. Smell evidence is `properties.json:42`. |
| **Metric, baseline, harness** | `duplicated_logic` at 50.8% is already below a coin-flip-plus-noise bar. `deep_nesting` asks for a count. |
| **Cost, latency, privacy** | A new mode pays the alias-replay cost in question 13 of the fitness checklist before it pays for a single useful call. |
| **Opt-in and no key** | A mode that routes on "smell" or "screen" will catch unrelated prompts. No key would then have to no-op a misroute. |
| **Complexity** | Hub, aliases, replay fixtures, and a command. Far past one caller. |
| **Verdict** | drop. |
| **Confidence** | Confirmed from the hub file and the published smell rates. |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/question.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/README.md`
- `.skilled/skills/cli-jev/hub-router.json`

## Assessment

newInfoRatio: 0.52

Novelty justification: The hub's single-mode sentence, `noulOf`'s throw, and the published near-chance smell rates are new. The "do not add a surface without a caller" posture is not.

Convergence telemetry: ratios through 0.52. Mode is off. One iteration remains in this wave, then the contest and the checklist.

## Reflection

What worked: the smell file argues against itself. 50.8% is a published reason not to build.

What failed: looking for a new command. The hub already says the edit goes to another hub.

Ruled out: a second `cli-jev` mode, and a smell command.

## Recommended Next Focus

`grok-08`: reread the other lineages and contest anything this lineage ranked higher than their code supports.

## Hand-off

- Bold surface kept: a `next_check` `choice` that cannot reorder work, later, kill if it loses to "always read_code."
- Bold surface dropped: any new hub mode, and supercov smells, especially counts and near-chance questions.
- Copy `noulOf`'s throw. Do not copy `runScreen`'s 0. Copy pi-jev's "data leaves the machine" sentence. Do not copy "saved pruning still applies" after an error.
- Survivors entering the contest: offline routing `choice`, shadow D4 `noul`, non-authoritative stop shadow, severity `choice`, fail-closed screen, `next_check` `choice`, goal `noul`.
