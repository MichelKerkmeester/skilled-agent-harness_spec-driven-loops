# Iteration 17 — gpt-5.6-terra xhigh — focus: sk-doc-templates

New compiled-routing playbook MDs are not safely covered by the current sk-doc contract: the template teaches legacy gold, the documented gate does not validate typed topology, and a missing typed oracle can still produce a rendered benchmark report.

- The per-scenario template declares Lane C fields but supplies only `id`, `expected_intent`, and `expected_resources`; manifest-backed topology instead requires `expected_workflow_mode` and `expected_leaf_resources`. `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md:52`, `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:200`

- The create-manual validation recipe checks only the root document and explicitly leaves leaf files to manual review. The generic validator has no playbook-frontmatter schema branch, so it cannot reject missing typed gold. `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:343`, `.opencode/skills/sk-doc/shared/scripts/validate_document.py:1028`

- The topology parser captures quoted typed values literally, while the Lane C loader accepts quoted values. Update the topology parser or mandate unquoted typed values; otherwise a copied YAML style can fail manifest lookup. `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:95`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:270`

- Renderer ownership is real but insufficient as a validation signal: provenance checking short-circuits when there are no gated/excluded rows, and the runner still writes JSON plus rendered Markdown. Missing typed gold can therefore yield archiveable-looking evidence. `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:51`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:292`

Ranked actions:

1. Extend the manual-playbook snippet/template with a manifest-backed Lane C block and require `validate-playbook-topology.cjs --strict` for every benchmarked manifest hub. Keep the frozen loader/scorers unchanged.
2. Make the topology parser quote-tolerant and add quoted/unquoted fixture tests; mirror the loader’s accepted YAML form.
3. Treat `report.compiledRouting` from the planned benchmark alignment as required durable evidence, rendered from JSON. Index it with a kebab-only label such as `compiled-parity-gpt-5-6-luna-high`; new labels must match the documented regex. `.opencode/skills/sk-doc/create-benchmark/SKILL.md:474`

Read-only checks only; no files changed.

===FINDINGS-JSON-START===
[
  {"id":"F-17-1","area":"playbooks","finding":"The standard per-scenario template omits the typed manifest gold required by topology validation, so newly authored compiled-routing scenarios default to legacy-only gold.","evidence":".opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md:52","severity":"P0","actionable":"Add expected_workflow_mode and typed expected_leaf_resources to the manifest-backed Lane C template path and require strict topology validation for benchmarked hubs.","novelty":"new"},
  {"id":"F-17-2","area":"sk-doc-templates","finding":"The topology validator treats quoted typed workflow and leaf values as literal quotes while the Lane C loader accepts quoted YAML, creating a copyable-template failure mode.","evidence":".opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:95","severity":"P1","actionable":"Make topology parsing quote-tolerant, document one canonical typed-gold serialization, and test both quoted and unquoted forms.","novelty":"new"},
  {"id":"F-17-3","area":"benchmark","finding":"A report with no typed-gold exclusions bypasses renderer provenance validation and is still emitted as JSON plus renderer-owned Markdown, so archival output alone cannot prove typed compiled parity ran.","evidence":".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:51","severity":"P1","actionable":"Require populated compiledRouting parity metadata in report JSON before archiving the P4 evidence and render that state into the Markdown report and benchmark index.","novelty":"refines:F-7-4"}
]
===FINDINGS-JSON-END===

