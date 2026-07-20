# Iteration 7 — gpt-5.6-terra xhigh — focus: sk-doc-templates

Headline: use `sk-doc` templates for the human-authored catalog leaves, playbook scenarios, and hub benchmark indexes only. Lane C reports are generated; hand-authoring them would break the durable-evidence contract.

| New Markdown artifact | Exact source | Validation / owner |
|---|---|---|
| New catalog feature leaf | `create-feature-catalog/assets/feature-catalog-snippet-template.md:60-132`; add its H3/index link using the root catalog scaffold at `feature-catalog-template.md:119-167`. | `validate_document.py` on root and leaf; CI link guard. Source anchors and root↔leaf parity remain manual checks (`create-feature-catalog/SKILL.md:326-357`). |
| New compiled-routing playbook scenario | `create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md:45-152`; update the existing root summary rather than re-scaffolding the root. | Validate each leaf directly as `playbook_feature`; check links in CI. The current packet documents only root validation and manual leaf review (`create-manual-testing-playbook/SKILL.md:343-376`). |
| New hub `benchmark/README.md` | `create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md:15-41`. Delete the template’s `version` field when copying it, fill the run-label index, and validate as a README. | The template is only for the hub index, not run reports (`create-benchmark/SKILL.md:452-505`). |
| `skill-benchmark-report.md` | No template. | Renderer-owned: `build-report.cjs` is the sole writer from report JSON (`build-report.cjs:8-14`, `:261-270`). A per-run README is optional, not required (`skill-benchmark-storage-guide.md:120-156`). |

The main missing guard is in scenario authoring. The playbook template correctly exposes `id`, `expected_intent`, and `expected_resources` for Lane C (`manual-testing-playbook-snippet-template.md:51-61`), but the frozen loader accepts a file when *any one* of those fields is present (`load-playbook-scenarios.cjs:526-574`). Since the template always has `id`, an incomplete compiled-routing scenario can load without route gold and miss the hard parity denominator. Add an authoring/CI validator outside the frozen loader that requires all gold fields, `stage`, and a parseable exact prompt for every new compiled-routing scenario.

Second, the documented root-playbook command forces `--type reference` (`create-manual-testing-playbook/SKILL.md:343-351`). Automatic detection also intentionally excludes the root and falls through to generic `readme` (`validate_document.py:197-204`, `:223-237`), despite a dedicated `playbook` rule requiring global preconditions, evidence, and command notation (`template-rules.json:418-455`). Correct the command/detection to use `playbook`, then validate every new scenario leaf directly.

For durable parity evidence, extend the renderer rather than adding prose to a run report. The approved benchmark plan already requires `build-report.cjs` to render `report.compiledRouting` (`014-benchmark-alignment/plan.md:113-116`) and requires JSON and Markdown to remain synchronized (`014-benchmark-alignment/spec.md:133-144`).

Ranked actions:

1. P0: Add compiled-routing scenario completeness validation before authoring the eight new root-playbook cases.
2. P0: Implement and fixture-test `compiledRouting` JSON→Markdown rendering; never hand-edit the generated report.
3. P1: Fix root-playbook type selection and add explicit leaf validation to the documented workflow.
4. P2: Align the catalog leaf template’s two-value test-type guidance (`feature-catalog-snippet-template.md:157-159`) with the validator’s twelve accepted types (`template-rules.json:576`).

===FINDINGS-JSON-START===
[
  {"id":"F-7-1","area":"playbooks","finding":"A Lane C scenario can load with only id yet carry no routing gold, because the frozen loader admits any of id, expected_intent, or expected_resources while the standard validator does not require the latter fields.","evidence":".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:526","severity":"P0","actionable":"Add a non-frozen authoring or CI validator requiring id, expected_intent, expected_resources, stage, and a parseable exact prompt on every new compiled-routing scenario.","novelty":"new"},
  {"id":"F-7-2","area":"playbooks","finding":"The documented root-playbook validation bypasses the dedicated playbook contract by forcing generic reference validation.","evidence":".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:350","severity":"P1","actionable":"Validate roots as playbook, make root auto-detection return playbook, and directly validate each newly authored scenario leaf as playbook_feature.","novelty":"new"},
  {"id":"F-7-3","area":"catalogs","finding":"The catalog snippet template says only Automated test and Manual playbook are valid test types, while the validator accepts twelve canonical types.","evidence":".opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-snippet-template.md:157","severity":"P2","actionable":"Align the template guidance and validator taxonomy before authors choose compiled-routing validation anchors.","novelty":"new"},
  {"id":"F-7-4","area":"benchmark","finding":"Compiled-routing parity evidence must be rendered from report JSON because skill-benchmark-report.md has no authoring template and is renderer-owned.","evidence":".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:8","severity":"P0","actionable":"Implement the planned compiledRouting JSON-to-Markdown block in build-report.cjs and cover it with a rendered-report fixture test; do not hand-author per-run reports.","novelty":"refines:F-4-1"}
]
===FINDINGS-JSON-END===

