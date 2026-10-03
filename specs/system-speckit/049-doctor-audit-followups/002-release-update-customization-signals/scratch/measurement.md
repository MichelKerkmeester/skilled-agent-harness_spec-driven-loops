# Generated-only measurement over the local units

Command (read-only): `node .skilled/commands/doctor/scripts/release-update.cjs check --json` on this checkout, once before the engine change and once after. The two reports were kept outside the packet (21 MB each) and compared with a `node -e` pass that counts unit statuses, lists every file with class `generated`, and lists each `local` unit that carries generated files.

| Measure | Before | After |
|---------|--------|-------|
| Report status | current (release v4.0.0.2, upstream known) | current |
| Unit statuses | local 54, current 30 | local 54, current 30 |
| File classes | same 15,957, local-only 2,489 | same 15,955, local-only 2,483, generated 8 |
| Local units whose every changed file is generated | n/a | 0 |
| Local units carrying some generated files | n/a | 5 |

The small file-count drift between the two runs is other packets editing the tree in the same build.

The eight generated files: four `leaf-manifest.json` (cli-classifier, sk-doc, sk-git, system-skill-advisor) and the trigger index with its three sidecars. The five units that carry them: cli-classifier (1 of 50 changed files), sk-doc (1 of 30), sk-git (1 of 46), system-skill-advisor (1 of 161), system-spec-kit (4 of 830).

Rule that decided each file: the `GENERATED_ARTIFACTS` list in `release-update.cjs`. A whole-file artifact is generated when its class would be local-only, or a conflict with the file present in the release. A `graph-metadata.json` is generated only when its JSON outside `derived` equals the base. Every changed `graph-metadata.json` here (cli-classifier, cli-external-orchestration, cli-jev, sk-communication) differs outside `derived`, so all stay authored. `cli-jev/leaf-manifest.json` stays local-only because it was deleted locally, and a deletion is authored.

Result: on this checkout no local unit is generated-only. Generated files are a small share of each local unit's drift, so the classifier fixes the class of those files without changing any unit's status here. The planning run's "54 local units" are authored work since v4.0.0.2, which is expected in the upstream repository itself.
