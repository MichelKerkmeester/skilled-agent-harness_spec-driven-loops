# Resource Map — lineage glm-5-3-flash-templates

Emitted from this lineage's deltas (`deltas/iter-*.jsonl`) at synthesis. Lists the sources this research actually read and cited. Note: this is the deep-loop's research-coverage resource map at the lineage root — a different artifact from `templates/addons/resource-map.md.tmpl` (the packet path-ledger template; see f-iter002-003).

## Ground truth (enforcement side)

| Path | Read for |
|---|---|
| .opencode/skills/system-spec-kit/templates/spec-kit-docs.json | angles 1-8: documents[] (:61-164), versions (:4-22), levels 1/2/3/3+/phase/review/research (:165-2467), sectionGates (goal :521; AC :998,1552,2121; compliance-verify :1310,1873) |
| .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh | angles 1-3: --level/--with-lazy-addons parsing (:33,53,83-102,153-155), help (:273-326), requested_lazy_addon_docs (:389-402), scaffold_contract_docs (:421-437), copy calls (:736,937,1431,1647) |
| .opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh | angle 1: copy_template (:67-111), _manifest_template_path (:201-226), resolve_level_contract (:244-260), level_contract_docs_from_json (:295-313) |
| .opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh | angle 4: full read (cutoff :43-57, parser :104-167, ADRs :169-187, fail branches :247-358) |
| .opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh | angle 4: full read (floor :30-48, lifecycle :61-93, canonical analyzer :195-247, advisory :368-377) |
| .opencode/skills/system-spec-kit/runtime/cli/rules/check-files.sh | angle 5: FILE_EXISTS scope (:20-33,41-59,65-86) |
| .opencode/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh | angle 7: presence-only check (:35-66,78-93) |
| .opencode/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh | angle 9: inverse advisory warn (:222-223) |
| .opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json | angles 4-5, 7: 39 rules, severities, flags |
| .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | angles 1-2, 7: docsForLevel/validationDocsForLevel (:473,500-514), TEMPLATE_SOURCE (:664-672) |
| .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts | angles 2, 8: FREEFORM (:200), collectDocuments hardcoded extras (:216-226) |
| .opencode/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts | angles 1, 7: contract shape (:28-40), templateVersions (:34,65,264,288) |
| .opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh | angles 4-5: Completion Verification Rule (:48,69,124-144,441-452) |
| .opencode/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh | angle 7: dead default manifest path (:60-71,110-118,140-169) |
| .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh | angles 4-5: registry delegation (:8-10) |
| .opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js | angle 9: `docs 3` = spec/plan/tasks only |
| .opencode/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs | angle 5: level inference (:45), checklist spawn (:141,160,241) |
| .opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs | angle 5: spawn (:160-188), L1 fallback (:227-229), stale comments (:7,217) |
| .opencode/skills/system-spec-kit/runtime/lib/config/spec-doc-paths.ts | angle 5: SPEC_DOCUMENT_FILENAMES (:17-29) |
| .opencode/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts | angle 2: discovery list (:139-145) |
| .opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts | angle 6: RenderLevel (:15), gate grammar (:32-48) |
| .opencode/skills/system-spec-kit/runtime/README.md | angles 2, 5: discovery claims (:154) |
| .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md | angle 5: flag catalog (:166-167) |
| .opencode/skills/system-spec-kit/runtime/cli/spec/README.md · runtime/README.md:154 | discovery claim context |
| .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | angle 2: loop resource-map emission (:14,1536-1538,1660) |
| .opencode/commands/deep/assets/deep-research-confirm.yaml · deep-review-auto.yaml | angle 2: resource_map_output bindings (:187; :161) |
| .opencode/plugins/opencode-goal.js | angle 6: session-goal plugin (:1-6,27-29,3060,3072) |
| .opencode/plugins/system-speckit-completion.js · bin/speckit-completion.cjs | angle 5: completion exposer (:7,58; :53-56) |
| .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs · opencode-goal-tool-path.test.cjs | angles 6, 8: pinned goal offers (:20-41,71-81; :40) |
| .opencode/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts | angles 3, 8: golden coverage + checklist retirement pin (:45-62,65-74,76-84,100-121,126-134,136-147) |
| .opencode/commands/speckit/assets/speckit-plan-auto.yaml (+7 sibling YAMLs) | angle 6: goal_prompt_choice wiring (:98-99,123-137) |

## Templates (shipped, marker-censused)

| Path | Self-marker |
|---|---|
| templates/core/spec.md.tmpl | spec-core \| v2.2 (:36; composed variants :39,:43) |
| templates/core/plan.md.tmpl / tasks.md.tmpl / implementation-summary.md.tmpl | v2.2 |
| templates/addons/acceptance-criteria.md.tmpl | v2.2 (:31) |
| templates/addons/before-after.md.tmpl / timeline.md.tmpl / roadmap.md.tmpl / decision-record.md.tmpl / goal.md.tmpl (:31) | v2.2 |
| templates/addons/research.md.tmpl (:16) · handover.md.tmpl (:17) · debug-delegation.md.tmpl (:18) | **v1.0 (drift)** |
| templates/addons/resource-map.md.tmpl (:17) | **v1.1 (drift)** |
| templates/packet-types/phase-parent.spec.md.tmpl · review.spec.md.tmpl | v2.2 |
| templates/packet-types/context-index.md.tmpl (:15) | **v1.0 (drift)** |

## Prose (claims under test)

| Path | Read for |
|---|---|
| README.md (repo root) | angle 2: level table (:148-151), hard-requirements (:154), tree (:165-168), loop emission (:173), trigger table (:182-185), completion gates (:198) |
| .opencode/skills/system-spec-kit/SKILL.md | angle 2: template gate (:61), resource-map (:65), ToC list (:494) |
| .opencode/skills/system-spec-kit/references/structure/folder-structure.md | angles 2-3: level trees + AC-warn/decision-record claims (:125,141-142), goal tree listings (:36-37,328,359) |
| .opencode/skills/system-spec-kit/references/structure/phase-definitions.md | angle 9: thresholds (:59-62) — clean |
| .opencode/skills/system-spec-kit/references/templates/template-style-guide.md | angle 3: ladder inventory (:39-45) |
| .opencode/skills/system-spec-kit/references/templates/template-guide.md | angles 3, 6, 9: renderer example (:195-200), ladder (:27-29,1166-1170), decision-record hard-block claim (:178,225), handover row (:555) |
| .opencode/skills/system-spec-kit/references/templates/level-specifications.md | angle 3: resource-map rows (:103,194,311,395,742,749,844) |
| .opencode/skills/system-spec-kit/references/templates/level-selection-guide.md | angle 3: ladder + phantom checklist row (:203-206) |
| .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md | angles 1, 6: set-string shape + binding (:20,27-31,91-93) |
| .opencode/skills/system-spec-kit/references/validation/validation-rules.md | angle 5: ENFORCE reserved wording |
| .opencode/skills/system-spec-kit/templates/README.md · CONTRACT.md · EXTENSION-GUIDE.md · MIGRATION.md | angles 1, 3, 7, 9: addon descriptions (:139-142), contract flow (:41), field definitions (:28-39,46-56), legacy policy (:24-27,46-47) + phantom co-location (:14) |
| .opencode/skills/system-spec-kit/runtime/lib/hooks/README.md | angle 5: phantom checklist.md input (:12) |

## Live evidence surfaces (specs/, read-only)

- specs/system-speckit/035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria/acceptance-criteria.md (:53-58 — self-referential AC rows) + spec.md (Created/Status rows)
- 035 siblings 001/002/003/005 (authored-but-Unmet AC tables, Level 2, post-cutoff)
- specs/mcp-tooling/019-official-obsidian-cli/ (parent goal.md WITH binding :60,75,109 + child goal; Met-row AC sample)
- specs/system-speckit/033-system-speckit-v4/ (parent WITHOUT goal.md; child 010-goal-file-addon with one)
- specs/sk-design/018-sk-design-parent-v2/ + specs/mcp-tooling/013-mcp-obsidian/ (freeform goal.md samples)
- Corpus censuses: 144 acceptance-criteria.md under specs/; 75 goal.md (15 with ANCHOR:binding); 0 checklist.md; 4340×v2.2 + 32×v1.0 spec.md markers (14 live v1.0)
