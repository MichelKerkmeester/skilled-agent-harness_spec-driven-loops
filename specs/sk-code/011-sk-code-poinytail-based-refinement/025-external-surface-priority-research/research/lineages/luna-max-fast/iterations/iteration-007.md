# Iteration 7: Operator configuration and shipped defaults

## Focus

Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)? The dispatch selects Q4. I checked whether operator order is separate configuration or the same hub data consumed by release/update tooling, and whether installed packet presence supplies order.

## Actions Taken

- Read config, six-record state, strategy, registry, dashboard, and prior iterations. Q4 remained open; no exhausted approach covered this updater probe.
- Read the current hub router and mode registry, compiled registry projection, doctor update workflows, and release-update unit enumeration, generated-artifact rules, classifier, and base recorder.
- Built the authorized throwaway copy at /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i7.GwNu. record-base for synthetic v4.0.0.4 printed ok=true, dryRun=false, units=[skill:sk-code]. A copy-only edit swapped the first two tieBreak values. The scoped check emitted no output before the 30-second tool yield; exit_code was undefined, so its classification is unresolved.
- A broad rg attempt included nonexistent .skilled/commands/install and returned exit 2; I narrowed the search to actual update files. No repository source was changed by the search.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| ORDER | The operator order is authored configuration: hub-router.json lists quality, review, OpenCode, Obsidian, Webflow; mode-registry.json registers those surfaces without an example or shipped marker. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-7]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20,61-114] | P1 |
| OK | /doctor:update enumerates all .skilled/skills/sk-code files into one release unit, without a per-surface inclusion switch. The copy record-base output also named skill:sk-code. | [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:520-561]; copy output: record-base printed ok=true and units=[skill:sk-code] | P1 |
| OK | The updater classifies authored files against base, local, and release versions. Upstream-only edits are taken, local-only edits retained, and concurrent text edits become merge/conflict proposals for align. | [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:681-701]; [SOURCE: .skilled/commands/doctor/assets/doctor-update-align.yaml:17-23] | P1 |
| OK | Leaf manifests, graph-metadata derived blocks, trigger-index files, and compiled-route activation manifests are generated. hub-router.json and mode-registry.json are not in that list and remain authored; apply checks or refreshes generated outputs. | [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:74-114]; [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:125-127]; [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:148-165] | P1 |
| DOC | The inspected updater does not create an example-free default. record-base records a named release tree; compat handles spec-folder layout migration. INFERENCE: another publisher or installer may exist outside the inspected paths. | [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:71-72,2268-2359]; [SOURCE: .skilled/commands/doctor/update.md:70-91]; [SOURCE: .skilled/release/.gitignore:1-3] | P2 |

### Options and recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Recommended: retain the operator registry/router as repository configuration and publish a separate example-free starter registry/router; regenerate derived manifests from the selected configuration. | Separate starter values from .skilled/skills/sk-code/mode-registry.json:16-20,61-114 and hub-router.json:4-7; updater handles the parent as one unit at release-update.cjs:520-561. | Medium: maintain a starter configuration boundary and regenerate existing outputs. | Starter and operator values can drift. | Cheaper: ship the same registry and tell users to delete only example directories. It fails because registry and tieBreak still reference those packet ids and updater handles the whole skill unit. |
| Derive precedence from installed directories. | Replace authored tieBreak at hub-router.json:4-7; compiler copies it into routingModel.tieBreak at registry-compiler.cjs:247-266. | Low initial cost, with implicit ordering behavior. | Presence does not select preference among multiple custom surfaces. | Cheaper: keep the explicit tieBreak; it already supplies persistent order and the compiler consumes it directly. |
| Use record-base or compat as the operator-versus-starter split. | record-base records the release baseline at release-update.cjs:2268-2359; compat is described at doctor/update.md:78-91. | Low to try. | Conflates release history or spec migration with surface configuration. | Cheaper: separate the two configuration inputs. These actions record a baseline and move spec folders; neither omits surface registrations. |

## Questions Answered

- Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)? The checked-in operator order is authored data consumed by the compiled router. The updater treats the hub as one release unit and distinguishes generated output from authored configuration. No in-repository mechanism for a different example-free starter was found; publisher behavior remains unverified.

## Questions Remaining

- Q1: complete order/presence inventory across advisor, doctor, install guides, canaries, runtime, and release notes.
- Q5: doctor/onboarding guidance for example replacement and surface scaffolding.
- Q6: full rejected-ideas pass across the research topic.
- Follow-up: inspect the publish/install workflow to confirm whether it selects a starter configuration outside /doctor:update.

## Next Focus

Q5: determine the smallest doctor and documentation guidance for examples and the parent-skill scaffold path. Include the publishing-workflow check if available.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-code/hub-router.json:4-7]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20,61-114]
- [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-266]
- [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:74-114,520-561,681-701,2268-2359]
- [SOURCE: .skilled/commands/doctor/update.md:68-91]
- [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:125-127]
- [SOURCE: .skilled/commands/doctor/assets/doctor-update-align.yaml:17-23]
- [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:148-165]
- [SOURCE: .skilled/release/.gitignore:1-3]
- Copy: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i7.GwNu. The final check did not return within the tool yield.

## Assessment

- New information ratio: 0.90 (four findings add update evidence; one extends the earlier explicit-order finding).
- Questions addressed and answered: Q4 for the inspected in-repository updater path.
- Questions remaining: Q1, Q5, Q6, and external publisher behavior.

## Reflection

- What worked: reading the release engine beside its doctor contracts separated authored configuration from generated outputs.
- What did not: the copy check did not return within 30 seconds, so its local-edit classification was not observed; the source classifier gives the model but a complete copy run would confirm it. The first broad search included a nonexistent path.
- Next adjustment: inspect the publisher entrypoint first, then run a bounded local-edit check against that distribution path.

## Recommended Next Focus

Q5: finish doctor/onboarding guidance and locate the publisher boundary before claiming an example-free default is already shipped.
