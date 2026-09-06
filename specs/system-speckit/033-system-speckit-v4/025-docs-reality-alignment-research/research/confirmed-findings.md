# Confirmed findings: docs versus runtime

Reproduced in the orchestrating session on 2026-09-06 by opening every cited doc line and the runtime file or command it names. Rows marked dropped did not reproduce and are excluded from remediation. The remediation child is `027-doc-path-strict-mode-and-retired-capability-fixes`.

| ID | Sev | Doc | Claim | Actual | Verdict |
|----|-----|-----|-------|--------|---------|
| F3-01 | P1 | `references/validation/validation-rules.md:38-44` | Under `--strict` warnings exit as validation errors | `runtime/lib/validation/orchestrator.ts:984-989` passes on `errors === 0`; `validate.sh:71` help still says "Warnings as errors" | Confirmed |
| F3-02 | P1 | `references/validation/validation-rules.md:122-127` | A stale freshness warn already fails `--strict`; ENFORCE only relabels | A warn passes; `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` escalates it to an error, which fails | Confirmed |
| F1-01 | P1 | `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:196` | Build runs `node runtime/cli/finalize-dist.mjs` | File lives at `runtime/scripts/finalize-dist.mjs` | Confirmed |
| F2-01 | P1 | `feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:19` | Descriptions short-circuit full-corpus vector search | Same doc line 44 says that consumer is gone; `generate-description.ts` has no vector code | Confirmed |
| F4-01, F6-02 | P1 | `feature-catalog/doctor-commands/category-overview.md:27`, `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19` | Five or seven routes including memory, causal-graph, code-graph | `_routes.yaml` has nine targets, none of those three | Confirmed |
| F7-01 | P1 | `README.md:413,434` | Tree lists `runtime/cli/memory/` and `constitutional/` | Neither exists; continuity lives at `runtime/cli/continuity/` | Confirmed |
| F7-02 | P2 | `README.md:415-417,432` | 17 core, 12 extractor, 20 util modules, 27 reference files | 29, 13, 19 TypeScript modules and 41 markdown files | Confirmed |
| F8-01 | P1 | `references/structure/phase-definitions.md:236` | `./scripts/spec/validate.sh` | Path is `runtime/cli/spec/validate.sh` | Confirmed |
| F10-01 | P1 | `phase-definitions.md:119`, `feature-catalog/tooling-and-scripts/template-composition-system.md:51`, `references/templates/level-selection-guide.md:167-171,191`, playbook `template-compliance-contract-enforcement-blocks-non-compliant.md:153,161` | Rule scripts check-anchors, check-section-counts, check-template-headers, check-sections | None exist under `runtime/cli/rules/`; anchors are the native `ANCHORS_VALID` rule, headers are `check-template-source.sh` | Confirmed |
| F9-01 | P1 | `references/workflows/execution-methods.md:234-237` | Save steps 11 and 12 re-index a vector database and drain an embedding retry queue | `generate-context.ts` has no such step; no database exists | Confirmed |
| F2-02 | P2 | `feature-catalog/feature-flag-reference/runtime-config-contract.md:41-63` | `semanticSearch`, `memoryIndex`, `memoryDecay`, `hybridSearch`, `checkpoints` sections retained in `config/config.jsonc` | The file has none of those keys | Confirmed, wider than reported |
| F5-01 | P2 | `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:79` | `rules/check-links.sh` is an orchestrator rule | It is the standalone `runtime/cli/check-links.sh` and is not in the registry | Confirmed |
| F6-01 | P2 | `references/cli/memory-handback.md:3,16,22` | Three cli siblings, `cli-opencode` listed twice | Six cli-* skills | Confirmed |
| F6-03 | P2 | `references/config/environment-variables.md:36` | `MEMORY_BASE_PATH` is used for path validation | `runtime/ENV-REFERENCE.md:138`: nothing imports the constant | Confirmed |
| F8-03 | P2 | `references/templates/level-specifications.md:78` | `check-completion.sh` is missing | It exists at `runtime/cli/spec/check-completion.sh` | Dropped |
| F8-02 | P2 | `level-selection-guide.md:191` | duplicate of F10-01 | folded into F10-01 | Merged |
