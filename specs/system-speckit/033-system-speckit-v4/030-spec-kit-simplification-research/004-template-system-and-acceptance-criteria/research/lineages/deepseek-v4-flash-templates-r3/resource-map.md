# Resource Map — deepseek-v4-flash-templates-r3

Sources read across the five iterations (checked-in source only; dist/ untracked and stale, not consulted).

## system-spec-kit templates

- `templates/spec-kit-docs.json` — levels rows (1/2/3/3+/phase/review/research), versions map, documents map (depth-2 dump)
- `templates/core/`: spec.md.tmpl, plan.md.tmpl, tasks.md.tmpl, implementation-summary.md.tmpl
- `templates/addons/`: acceptance-criteria.md.tmpl, goal.md.tmpl, handover.md.tmpl, timeline.md.tmpl, roadmap.md.tmpl, decision-record.md.tmpl, before-after.md.tmpl, research.md.tmpl, resource-map.md.tmpl, debug-delegation.md.tmpl
- `templates/packet-types/`: phase-parent.spec.md.tmpl, review.spec.md.tmpl

## system-spec-kit runtime (cli)

- `runtime/cli/spec/create.sh` — level flag validation, scaffold_contract_docs, finalize_scaffold_templates (perl substitution list), SCAFFOLD_VALIDATION_COUNTS / SCAFFOLD_AI_PROTOCOL_MARKERS appends, phase validation child
- `runtime/cli/spec/upgrade-level.sh` — template_for_doc, derive_addendum_fragment, create_new_files, main orchestration
- `runtime/cli/lib/template-utils.sh` — copy_template, copy_templates_batch, _manifest_template_path, resolve_level_contract
- `runtime/cli/templates/inline-gate-renderer.ts` — CLI parsing, out-dir output naming
- `runtime/cli/utils/template-structure.js` — VALID_LEVELS, DOC_TEMPLATE_NAMES, resolveTemplatePath, docs/template-docs/lifecycle-docs subcommands
- `runtime/cli/rules/check-files.sh` — FILE_EXISTS (phase branch, lifecycle gating)
- `runtime/cli/rules/check-template-source.sh` — TEMPLATE_SOURCE
- `runtime/cli/rules/check-placeholders.sh` — pattern block (YOUR_VALUE_HERE / NEEDS_CLARIFICATION)

## sk-doc

- `sk-doc/sk-create-with-human-voice/references/hvr-rules.md` — read in full (514 lines)
- `sk-doc/scripts/tests/valid-spec.md`, `sk-doc/scripts/tests/specs/auto-detect-spec.md` — validator fixtures
- sk-doc template inventory (`*.tmpl` / `*template*` / `*templates*` names) — listed; no spec-kit document templates

## Packet context

- `research/confirmed-findings.md` (census) — read once in iteration 1
- Prior syntheses (lineages/glm-5-3-flash-templates/research.md, lineages/deepseek-v4-flash-templates/research.md) — consulted via the census only, per mandate
