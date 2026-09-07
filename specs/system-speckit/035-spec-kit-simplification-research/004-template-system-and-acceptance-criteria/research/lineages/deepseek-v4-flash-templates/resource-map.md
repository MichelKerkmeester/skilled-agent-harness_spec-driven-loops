# Resource map — lineage deepseek-v4-flash-templates (round two post-remediation audit)

Evidence ledger extracted from the lineage deltas (`deltas/iter-*.jsonl`); every entry below is a file this lane cited with a finding, a ruled-out direction, or a confirmation.

## Environment

- Ground truth files (manifest / scaffolder / rules / validators / templates):
  - `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` — manifest: versions{} :4-22, privateTaxonomy :24-58, documents[] :60-158, levels :163-2467 (lazyAddonDocs :175/558/1053/1608/2169/2311/2429)
  - `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh` — 1880 lines: flags :53-54,:153-158,:285-289; scaffold_contract_docs :450-475; requested_lazy_addon_docs :395-406; contract_lists_optional_addon :408-418; requested_lazy_addon_doc :420-430; phase paths :763,:1458; summary :1855-1867; sharded block :1722-1762
  - `.opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts` — RenderLevel :15-18
  - `.opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh` — wrapper
  - `.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh` — copy_template :67-107; _manifest_template_path :201-226; _inline_gate_renderer_path :233
  - `.opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js` — getContractDocs :190-194 (required only); decision-record contract :470-487; resolveTemplatePath :365-390
  - `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh` — 363 lines (numeric level :24-25; cutoff :43-45; completion-claim gate :345-361)
  - `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` — 403 lines (has_file_line :215,:262; canonical analyzer :195-247; enforce :381-396)
  - `.opencode/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh` — 105 lines (docs set :52-55; example :78-93)
  - `.opencode/skills/system-spec-kit/runtime/cli/rules/check-toc-policy.sh` — :25-31 (7-doc list)
  - `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` — 39 rules
  - `.opencode/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` — :65 manifest path; :67-91 spec-only compare; :159-171 auto-upgrade 5-doc set
  - `.opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh` — :132,:441 tasks.md
  - `.opencode/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` — :52-64 addendum comments + 5-doc template_for_doc
  - `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` — FREEFORM :196-200; OPTIONAL_CONTINUITY_DOCS :202-213; LAZY_DOCS_WITH_STATIC_ANCHORS :214; collectDocuments :221-247; continuityRequired :667-668; anchor enforcement :1011-1022
  - `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` — OPTIONAL_CONTINUITY_DOCS :82-91; validationDocsForLevel :503-519
  - `.opencode/skills/system-spec-kit/runtime/lib/config/spec-doc-paths.ts` — :17-29 (11 entries)
  - `.opencode/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts` — templateVersions :264,288
  - `.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs` — evaluateCompletionEvidence checklist.md gate; verdictFromImplementationSummary
  - `.opencode/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs` — :31,:141 check-completion spawn
  - `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` :166-170; `.env.example` :137
- Template surfaces:
  - `.opencode/skills/system-spec-kit/templates/core/*.tmpl` (4) — markers v2.2
  - `.opencode/skills/system-spec-kit/templates/addons/*.tmpl` (10) — acceptance-criteria/before-after/decision-record/goal/roadmap/timeline v2.2; debug-delegation/handover/research v1.0; resource-map v1.1
  - `.opencode/skills/system-spec-kit/templates/packet-types/*.tmpl` (2) — v2.2
  - `.opencode/skills/system-spec-kit/templates/changelog/{root,phase}.md` — v1.0 markers, unversioned in the manifest
  - `.opencode/skills/system-spec-kit/templates/stress-test/` — findings-rubric.* (no consumer)
  - `.opencode/skills/system-spec-kit/templates/examples/` — rendered examples (level-1..level-3+)
## Claims surfaces (prose under test)

- Repo-root `README.md` — :144-160 level table; :160-165 machine-contract paragraph; :168-173 tree + resource-map paragraph; :178-189 trigger table; :199 completion-gate paragraph
- `.opencode/skills/system-spec-kit/SKILL.md` — :61 gate list; :65 resource-map; :196; :494 ToC list
- `.opencode/skills/system-spec-kit/templates/README.md` — :103-116 tree; :138-143 KEY FILES
- `.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md` — :29-47 field semantics + flag set
- `.opencode/skills/system-spec-kit/templates/CONTRACT.md` — :25-45 key files; :35-38 taxonomy boundary
- `.opencode/skills/system-spec-kit/templates/MIGRATION.md` — :12-14 co-location comment
- `.opencode/skills/system-spec-kit/references/templates/template-guide.md` — :178,:182-200,:225,:758,:1168
- `.opencode/skills/system-spec-kit/references/templates/template-style-guide.md` — :42-45
- `.opencode/skills/system-spec-kit/references/templates/level-selection-guide.md` — :205
- `.opencode/skills/system-spec-kit/references/templates/level-specifications.md` — :741-748, :843
- `.opencode/skills/system-spec-kit/references/structure/folder-structure.md` — :124,:140-141
- `.opencode/skills/system-spec-kit/references/structure/phase-definitions.md` — :99,:119
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` — :85-99
- `.opencode/skills/system-spec-kit/references/workflows/rename-pattern.md` — :49 (historical list)
- `.opencode/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` — exists (different doc from the retired checklist.md)
- `.opencode/skills/system-spec-kit/runtime/lib/hooks/README.md` — :12,:27
- Tests: `.opencode/skills/system-spec-kit/runtime/cli/tests/template-version-parity.vitest.ts` (4 assertions); `scaffold-golden-snapshots.vitest.ts:76-118` (lazy-4 only, no goal); `level-contract-resolver.vitest.ts:94-104` (templateVersions consumer)
## Live evidence surfaces (specs/, recounted 2026-09-07)

- `specs/system-speckit/010-template-contract-alignment/acceptance-criteria.md:22-28` — the showcase packet: 6 rows, 0 file:line citations → 0/6 covered, 6 malformed under check-ac-coverage.sh
- `specs/system-speckit/035-spec-kit-simplification-research/goal.md:70-96` — parent binding table, 12/12 child goal files exist
- Census: 157 acceptance-criteria.md files; 138 with Met rows; 31 with any file:line citation; 88 goal.md files; 26 with ANCHOR:binding
- Reference lineage (round one): `research/lineages/glm-5-3-flash-templates/` (research.md, confirmed-findings.md at packet research/)
- Remediation record: `specs/system-speckit/035-spec-kit-simplification-research/010-template-contract-alignment/implementation-summary.md` + tasks.md

## Coverage notes

- Every finding cites its source path:line in the finding table (research.md §2) and the per-iteration files.
- Sources NOT consulted (out of the lane's cite set or outside the write scope): deep-review/deep-research YAML workflows, runtime adapters' hook wiring, generated dist/, git history, review-report consumers.
