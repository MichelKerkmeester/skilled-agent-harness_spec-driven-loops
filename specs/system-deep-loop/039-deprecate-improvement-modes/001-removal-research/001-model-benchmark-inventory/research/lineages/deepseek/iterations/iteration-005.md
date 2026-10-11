# Iteration 5: `sk-doc` surfaces (incl. `sk-create-benchmark`)

## Focus

The doc-authoring surfaces that reference the mode: the `sk-create-benchmark` family packet (its model-benchmark family), the `sk-doc` hub registries/routers/manifests, the `/create:benchmark` command presentation, sk-create-command's contract asset, sk-doc test manifests and token baseline, plus the family changelogs and benchmark reports.

## Actions Taken

- Read `sk-create-benchmark/SKILL.md` family router, keyword lists, RESOURCE_MAP, §10 and the reference/§11/§12 cross-links; read the family README and playbook scenario rows.
- Swept the sk-doc hub files (`SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `leaf-manifest.json`) for family rows.
- Checked test manifests, token baseline, `create-benchmark-presentation.txt`, `command-contract.json`; discovered and recorded a regex false positive in `cite-drift-redirects.json`.

## Findings

1. `sk-create-benchmark/SKILL.md` is a four-family skill; the model-benchmark family appears at lines 3, 8, 16, 32, 35, 93, 108, 117, 139-146, 227, 472-530 (§10 whole section), 546 (§11), 558-560 (§12). **EDIT** — remove the family; §10 is a section deletion and its lane cross-links (`evaluator-contract.md`, `reviewer-schema.md`) must go with the mode [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:472-530]
2. Family-only files: `assets/model-benchmark/model-benchmark-code-task-fixture-template.md`, `model-benchmark-pattern-fixture-template.md`, `model-benchmark-profile-template.md`, `references/model-benchmark/model-benchmark-fixture-guide.md`, `manual-testing-playbook/benchmark-families/match-lane-b-fixture.md`. **DELETE** all five [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:139-146]
3. `references/shared/README.md` lists the fixture guide, the three templates, and the family in its coverage table. **EDIT** lines 41, 44, 59-61 [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/references/shared/README.md:41,59-61]
4. `sk-create-benchmark/README.md` carries the family in its trigger list, invoke row, family description, family table, parity sentence, and reference table. **EDIT** lines 7, 22, 36, 44, 78, 151 [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/README.md:44]
5. `changelog/v1.2.0.0.md` and `changelog/v1.3.0.0.md` mention the mode. **KEEP-AS-HISTORY** [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/changelog/v1.3.0.0.md]
6. `manual-testing-playbook/manual-testing-playbook.md` carries the family in its description, intro, BMR-005 "Match a Lane B fixture to its scorer" scenario and evidence section. **EDIT** lines 3, 9, 94-96, 102, 118 [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/manual-testing-playbook.md:94-96]
7. sk-doc hub rows: `SKILL.md:33` family table row, `ROUTER.md:107-108,168` prose + intent keyword, `ROUTER.md:289-291,296` RESOURCE_MAP leaf paths, `hub-router.json:312` and `mode-registry.json:306` family keyword rows, `graph-metadata.json:222` keyword, `leaf-manifest.json:19-21,26` template/guide leaves. **EDIT** all [SOURCE: .skilled/skills/sk-doc/ROUTER.md:289-296]
8. `scripts/tests/code-folder/durable-directory-manifest.json` lists the deep-improvement model-benchmark assets/scripts dirs and the runtime `model-benchmark-*` schema dirs as durable. **EDIT** lines 532-533, 543-549, 600-602 so the manifest tracks the post-deletion tree [SOURCE: .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:532-533,600-602]
9. `.skilled/commands/create/assets/create-benchmark-presentation.txt:86` offers `model_benchmark` as family option C. **EDIT** the option list [SOURCE: .skilled/commands/create/assets/create-benchmark-presentation.txt:86]
10. `sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md` pins the family leaves in its max-load manifest and `workflow_mode: sk-create-benchmark` rows. **EDIT** lines 16-18, 23, 152-156, 166 and regenerate the baseline if it is a measured artifact [SOURCE: .skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md:16-18]
11. `sk-create-command/assets/command-contract.json:304` lists `/deep:model-benchmark` in the deep-command invocation aliases example. **EDIT** [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:304]
12. Methodology correction: `sk-doc/shared/scripts/cite-drift-redirects.json:366` matched the earlier sweep only because `.` in `model.benchmark` matched the `/` in the unrelated path `sk-prompt-small-model/benchmarks/...`. This is a false positive; iteration 10 re-scans the master list with the strict `model[-_ ]benchmark` pattern to purge any sibling false positives [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:366]

## Ruled Out

- Treating the whole `sk-create-benchmark` skill as DELETE: it is a four-family skill; only the model-benchmark family is removed and the shared/other families stay.
- Treating `cite-drift-redirects.json` as an in-scope reference: verified false positive from the dot wildcard.

## Dead Ends

- `benchmark/reports/compiled-routing/**` under sk-doc: historical benchmark reports, KEEP-AS-HISTORY, no edit needed.

## Edge Cases

- Ambiguous input: whether sk-create-benchmark's family is "about the mode" or a generic model benchmark authoring surface — resolved as mode-coupled: the family's stated inputs live in `deep-improvement/assets/model-benchmark/` and its evidence contract is the Lane B evaluator.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md
- .skilled/skills/sk-doc/sk-create-benchmark/README.md
- .skilled/skills/sk-doc/sk-create-benchmark/references/shared/README.md
- .skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-doc/SKILL.md
- .skilled/skills/sk-doc/ROUTER.md
- .skilled/skills/sk-doc/hub-router.json
- .skilled/skills/sk-doc/mode-registry.json
- .skilled/skills/sk-doc/graph-metadata.json
- .skilled/skills/sk-doc/leaf-manifest.json
- .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json
- .skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md
- .skilled/commands/create/assets/create-benchmark-presentation.txt
- .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ3 (sk-doc half)
- Questions answered: KQ3

## Reflection

- What worked and why: reading the family router first exposed that sk-create-benchmark is four families, preventing a wrong whole-skill deletion call; the false-positive catch shows the value of exact-pattern re-verification, now scheduled for iteration 10.
- What did not work and why: the initial dot-wildcard sweep over-counted by one file; correction recorded.
- What I would do differently: use the strict alternation pattern in every sweep instead of `model.benchmark`.

## Recommended Next Focus

Iteration 6: `cli-external-orchestration` and remaining skill surfaces — its benchmark README and changelog, `cli-classifier` (feature-catalog + README mentions), `sk-code`/`sk-prompt` benchmark report mentions, `.skilled/bin/` and other repo-level tooling outside skills.
