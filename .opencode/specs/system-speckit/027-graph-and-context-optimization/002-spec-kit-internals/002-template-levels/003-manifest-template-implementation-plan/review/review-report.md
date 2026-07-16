# Deep Review Report: 003-manifest-template-implementation-plan

## Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Stop reason:** maxIterationsReached
- **Iterations:** 5
- **Findings:** P0=0 P1=5 P2=0
- **Review target:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan`
- **Review focus:** implementation code: templates, scripts, skill assets, command YAML, validators, resolver/renderer, and runtime/public-surface mirrors from `resource-map.md`.

## Findings

| Severity | Count |
|----------|------:|
| P0 | 0 |
| P1 | 5 |
| P2 | 0 |

- **DR-001-P1-001 [P1] Phase-parent scaffolding still emits private manifest vocabulary into generated public spec text** (implementation-spec-alignment, iteration 1)
  - File: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123`
  - Evidence: create.sh renders the phase-parent template and substitutes scope rows containing child phase manifest, while the spec requires private vocabulary cleanup and generated public surfaces to remain workflow-invariant.
  - Recommendation: Replace the generated scope text with taxonomy-neutral wording such as child phase list or phase map, and extend workflow-invariance coverage to rendered phase-parent output.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: rg over create.sh, phase-parent template, workflow-invariance test, agents, and command surfaces found this generated-output substitution site.
  - Affected surface hints: `phase-parent scaffold output`, `workflow-invariance test`, `public Level vocabulary`

- **DR-002-P1-001 [P1] Workflow-invariance test path-allowlists the public surfaces it claims to gate** (code-correctness, iteration 2)
  - File: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93`
  - Evidence: collectDefaultSurfaces includes .opencode/command, .opencode/agent, and SKILL.md, but isLegacyPhaseCleanupDebt marks those same public roots allowed and isAllowedHit drops every non-extra hit before the final empty-hit assertion.
  - Recommendation: Remove the broad public-root allowlist or replace it with narrow documented exceptions, then add a default-public-surface sentinel proving banned vocabulary fails inside .opencode/agent or .opencode/commands/spec_kit.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: The allowlist is centralized and applies to all file hits under the listed public roots; extra-path sentinel coverage does not exercise default public paths suppressed by isLegacyPhaseCleanupDebt.
  - Affected surface hints: `workflow-invariance CI`, `agent prompts`, `spec_kit commands`, `root policy docs`, `system-spec-kit SKILL.md`

- **DR-003-P1-001 [P1] Golden scaffold snapshots miss create-time phase-parent rendering regressions** (template-rendering-correctness, iteration 3)
  - File: `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49`
  - Evidence: The snapshot test renders phase-parent.spec.md.tmpl directly and normalizes legacy private-vocabulary strings before comparison, while create.sh renders that template and then injects _scope_rows containing child phase manifest into the public scaffold body. The test therefore passes the template snapshot even when generated phase-parent output violates T-123.
  - Recommendation: Add a golden/sentinel test that executes create.sh phase-parent scaffolding (or the same post-render substitution function) and asserts the rendered spec.md contains no private vocabulary; remove the migration normalization for T-122/T-123 leak strings from the golden path once manifest templates are the source of truth.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: Compared the raw template test path, create.sh post-render substitution path, and workflow-invariance default scan path; only create.sh generated output contains the missed substitution surface.
  - Affected surface hints: `phase-parent scaffold output`, `scaffold golden snapshots`, `workflow-invariance guardrail`, `manifest templates`

- **DR-004-P1-001 [P1] Shell validator rules skip manifest-declared lazy docs** (validator-coverage, iteration 4)
  - File: `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156`
  - Evidence: The manifest declares lazyAddonDocs for handover.md, debug-delegation.md, and research/research.md, but the shell helper docs mode only returns requiredCoreDocs plus requiredAddonDocs. check-template-source.sh, check-template-headers.sh, and check-sections.sh all iterate that reduced list, while MCP collectDocuments includes lazyAddonDocs plus resource-map.md/context-index.md.
  - Recommendation: Split required-presence validation from present-file structure validation: keep check-files on required docs, but let template-source/header/section rules inspect existing manifest-declared lazy/optional docs as well, matching the MCP validator's document set.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: The reduced helper list feeds three shell rules; MCP validation uses a broader resolver-derived document set, so the issue affects shell strict validation and runtime parity rather than one isolated rule.
  - Affected surface hints: `shell strict validation`, `handover.md`, `debug-delegation.md`, `research/research.md`, `MCP validator parity`

- **DR-005-P1-001 [P1] Create agent prompt was missed by the cross-runtime agent vocabulary cleanup** (cross-runtime-mirror-consistency, iteration 5)
  - File: `.opencode/agents/create.md:141`
  - Evidence: The resource map says all AI-facing agent definitions under .opencode/agents/ are in scope for the heading rename, but omits create.md from the enumerated agent cleanup list. AGENTS.md and CLAUDE.md expose @create as a first-class agent, and create.md still contains ## 2. CAPABILITY SCAN while sibling agent prompts use ROUTING SCAN.
  - Recommendation: Rename the create.md section heading to ROUTING SCAN and add .opencode/agents/create.md to the agent cleanup/resource-map coverage so future mirror scans include it.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: Directory-wide heading scan found the old heading in create.md and routing headings in the other sampled agent prompts; root instruction mirrors confirm the missed file is reachable through the same agent surface.
  - Affected surface hints: `@create prompt`, `agent routing docs`, `AGENTS/CLAUDE mirrors`, `workflow-invariance public-surface gate`

## Planning Trigger

`/spec_kit:plan` is required because the review verdict is `CONDITIONAL` and active P1 findings remain.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "DR-001-P1-001",
      "severity": "P1",
      "title": "Phase-parent scaffolding still emits private manifest vocabulary into generated public spec text",
      "file": ".opencode/skills/system-spec-kit/scripts/spec/create.sh:1123",
      "findingClass": "cross-consumer",
      "affectedSurfaceHints": [
        "phase-parent scaffold output",
        "workflow-invariance test",
        "public Level vocabulary"
      ]
    },
    {
      "id": "DR-002-P1-001",
      "severity": "P1",
      "title": "Workflow-invariance test path-allowlists the public surfaces it claims to gate",
      "file": ".opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93",
      "findingClass": "cross-consumer",
      "affectedSurfaceHints": [
        "workflow-invariance CI",
        "agent prompts",
        "spec_kit commands",
        "root policy docs",
        "system-spec-kit SKILL.md"
      ]
    },
    {
      "id": "DR-003-P1-001",
      "severity": "P1",
      "title": "Golden scaffold snapshots miss create-time phase-parent rendering regressions",
      "file": ".opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49",
      "findingClass": "cross-consumer",
      "affectedSurfaceHints": [
        "phase-parent scaffold output",
        "scaffold golden snapshots",
        "workflow-invariance guardrail",
        "manifest templates"
      ]
    },
    {
      "id": "DR-004-P1-001",
      "severity": "P1",
      "title": "Shell validator rules skip manifest-declared lazy docs",
      "file": ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156",
      "findingClass": "cross-consumer",
      "affectedSurfaceHints": [
        "shell strict validation",
        "handover.md",
        "debug-delegation.md",
        "research/research.md",
        "MCP validator parity"
      ]
    },
    {
      "id": "DR-005-P1-001",
      "severity": "P1",
      "title": "Create agent prompt was missed by the cross-runtime agent vocabulary cleanup",
      "file": ".opencode/agents/create.md:141",
      "findingClass": "cross-consumer",
      "affectedSurfaceHints": [
        "@create prompt",
        "agent routing docs",
        "AGENTS/CLAUDE mirrors",
        "workflow-invariance public-surface gate"
      ]
    }
  ],
  "remediationWorkstreams": [
    {
      "severity": "P1",
      "title": "Phase-parent scaffolding still emits private manifest vocabulary into generated public spec text",
      "file": ".opencode/skills/system-spec-kit/scripts/spec/create.sh:1123",
      "recommendation": "Replace the generated scope text with taxonomy-neutral wording such as child phase list or phase map, and extend workflow-invariance coverage to rendered phase-parent output."
    },
    {
      "severity": "P1",
      "title": "Workflow-invariance test path-allowlists the public surfaces it claims to gate",
      "file": ".opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93",
      "recommendation": "Remove the broad public-root allowlist or replace it with narrow documented exceptions, then add a default-public-surface sentinel proving banned vocabulary fails inside .opencode/agent or .opencode/commands/spec_kit."
    },
    {
      "severity": "P1",
      "title": "Golden scaffold snapshots miss create-time phase-parent rendering regressions",
      "file": ".opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49",
      "recommendation": "Add a golden/sentinel test that executes create.sh phase-parent scaffolding (or the same post-render substitution function) and asserts the rendered spec.md contains no private vocabulary; remove the migration normalization for T-122/T-123 leak strings from the golden path once manifest templates are the source of truth."
    },
    {
      "severity": "P1",
      "title": "Shell validator rules skip manifest-declared lazy docs",
      "file": ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156",
      "recommendation": "Split required-presence validation from present-file structure validation: keep check-files on required docs, but let template-source/header/section rules inspect existing manifest-declared lazy/optional docs as well, matching the MCP validator's document set."
    },
    {
      "severity": "P1",
      "title": "Create agent prompt was missed by the cross-runtime agent vocabulary cleanup",
      "file": ".opencode/agents/create.md:141",
      "recommendation": "Rename the create.md section heading to ROUTING SCAN and add .opencode/agents/create.md to the agent cleanup/resource-map coverage so future mirror scans include it."
    }
  ],
  "specSeed": [
    "Tighten workflow-invariance and scaffold validation requirements around generated public surfaces.",
    "Align shell and MCP validator coverage for manifest-declared lazy/optional documents.",
    "Include @create in agent vocabulary cleanup scope."
  ],
  "planSeed": [
    "T-001 Address DR-001-P1-001 at .opencode/skills/system-spec-kit/scripts/spec/create.sh:1123",
    "T-002 Address DR-002-P1-001 at .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93",
    "T-003 Address DR-003-P1-001 at .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49",
    "T-004 Address DR-004-P1-001 at .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156",
    "T-005 Address DR-005-P1-001 at .opencode/agents/create.md:141"
  ],
  "findingClasses": [
    "cross-consumer"
  ],
  "affectedSurfacesSeed": [
    "phase-parent scaffold output",
    "workflow-invariance test",
    "public Level vocabulary",
    "workflow-invariance CI",
    "agent prompts",
    "spec_kit commands",
    "root policy docs",
    "system-spec-kit SKILL.md",
    "scaffold golden snapshots",
    "workflow-invariance guardrail",
    "manifest templates",
    "shell strict validation",
    "handover.md",
    "debug-delegation.md",
    "research/research.md",
    "MCP validator parity",
    "@create prompt",
    "agent routing docs",
    "AGENTS/CLAUDE mirrors",
    "workflow-invariance public-surface gate"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

- **DR-001-P1-001 [P1] Phase-parent scaffolding still emits private manifest vocabulary into generated public spec text** (implementation-spec-alignment, iteration 1)
  - File: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123`
  - Evidence: create.sh renders the phase-parent template and substitutes scope rows containing child phase manifest, while the spec requires private vocabulary cleanup and generated public surfaces to remain workflow-invariant.
  - Recommendation: Replace the generated scope text with taxonomy-neutral wording such as child phase list or phase map, and extend workflow-invariance coverage to rendered phase-parent output.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: rg over create.sh, phase-parent template, workflow-invariance test, agents, and command surfaces found this generated-output substitution site.
  - Affected surface hints: `phase-parent scaffold output`, `workflow-invariance test`, `public Level vocabulary`

- **DR-002-P1-001 [P1] Workflow-invariance test path-allowlists the public surfaces it claims to gate** (code-correctness, iteration 2)
  - File: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93`
  - Evidence: collectDefaultSurfaces includes .opencode/command, .opencode/agent, and SKILL.md, but isLegacyPhaseCleanupDebt marks those same public roots allowed and isAllowedHit drops every non-extra hit before the final empty-hit assertion.
  - Recommendation: Remove the broad public-root allowlist or replace it with narrow documented exceptions, then add a default-public-surface sentinel proving banned vocabulary fails inside .opencode/agent or .opencode/commands/spec_kit.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: The allowlist is centralized and applies to all file hits under the listed public roots; extra-path sentinel coverage does not exercise default public paths suppressed by isLegacyPhaseCleanupDebt.
  - Affected surface hints: `workflow-invariance CI`, `agent prompts`, `spec_kit commands`, `root policy docs`, `system-spec-kit SKILL.md`

- **DR-003-P1-001 [P1] Golden scaffold snapshots miss create-time phase-parent rendering regressions** (template-rendering-correctness, iteration 3)
  - File: `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49`
  - Evidence: The snapshot test renders phase-parent.spec.md.tmpl directly and normalizes legacy private-vocabulary strings before comparison, while create.sh renders that template and then injects _scope_rows containing child phase manifest into the public scaffold body. The test therefore passes the template snapshot even when generated phase-parent output violates T-123.
  - Recommendation: Add a golden/sentinel test that executes create.sh phase-parent scaffolding (or the same post-render substitution function) and asserts the rendered spec.md contains no private vocabulary; remove the migration normalization for T-122/T-123 leak strings from the golden path once manifest templates are the source of truth.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: Compared the raw template test path, create.sh post-render substitution path, and workflow-invariance default scan path; only create.sh generated output contains the missed substitution surface.
  - Affected surface hints: `phase-parent scaffold output`, `scaffold golden snapshots`, `workflow-invariance guardrail`, `manifest templates`

- **DR-004-P1-001 [P1] Shell validator rules skip manifest-declared lazy docs** (validator-coverage, iteration 4)
  - File: `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156`
  - Evidence: The manifest declares lazyAddonDocs for handover.md, debug-delegation.md, and research/research.md, but the shell helper docs mode only returns requiredCoreDocs plus requiredAddonDocs. check-template-source.sh, check-template-headers.sh, and check-sections.sh all iterate that reduced list, while MCP collectDocuments includes lazyAddonDocs plus resource-map.md/context-index.md.
  - Recommendation: Split required-presence validation from present-file structure validation: keep check-files on required docs, but let template-source/header/section rules inspect existing manifest-declared lazy/optional docs as well, matching the MCP validator's document set.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: The reduced helper list feeds three shell rules; MCP validation uses a broader resolver-derived document set, so the issue affects shell strict validation and runtime parity rather than one isolated rule.
  - Affected surface hints: `shell strict validation`, `handover.md`, `debug-delegation.md`, `research/research.md`, `MCP validator parity`

- **DR-005-P1-001 [P1] Create agent prompt was missed by the cross-runtime agent vocabulary cleanup** (cross-runtime-mirror-consistency, iteration 5)
  - File: `.opencode/agents/create.md:141`
  - Evidence: The resource map says all AI-facing agent definitions under .opencode/agents/ are in scope for the heading rename, but omits create.md from the enumerated agent cleanup list. AGENTS.md and CLAUDE.md expose @create as a first-class agent, and create.md still contains ## 2. CAPABILITY SCAN while sibling agent prompts use ROUTING SCAN.
  - Recommendation: Rename the create.md section heading to ROUTING SCAN and add .opencode/agents/create.md to the agent cleanup/resource-map coverage so future mirror scans include it.
  - Disposition: active
  - Finding class: cross-consumer
  - Scope proof: Directory-wide heading scan found the old heading in create.md and routing headings in the other sampled agent prompts; root instruction mirrors confirm the missed file is reachable through the same agent surface.
  - Affected surface hints: `@create prompt`, `agent routing docs`, `AGENTS/CLAUDE mirrors`, `workflow-invariance public-surface gate`

## Remediation Workstreams

1. **P1: Phase-parent scaffolding still emits private manifest vocabulary into generated public spec text** — Fix `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123`; Replace the generated scope text with taxonomy-neutral wording such as child phase list or phase map, and extend workflow-invariance coverage to rendered phase-parent output.
2. **P1: Workflow-invariance test path-allowlists the public surfaces it claims to gate** — Fix `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93`; Remove the broad public-root allowlist or replace it with narrow documented exceptions, then add a default-public-surface sentinel proving banned vocabulary fails inside .opencode/agent or .opencode/commands/spec_kit.
3. **P1: Golden scaffold snapshots miss create-time phase-parent rendering regressions** — Fix `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49`; Add a golden/sentinel test that executes create.sh phase-parent scaffolding (or the same post-render substitution function) and asserts the rendered spec.md contains no private vocabulary; remove the migration normalization for T-122/T-123 leak strings from the golden path once manifest templates are the source of truth.
4. **P1: Shell validator rules skip manifest-declared lazy docs** — Fix `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156`; Split required-presence validation from present-file structure validation: keep check-files on required docs, but let template-source/header/section rules inspect existing manifest-declared lazy/optional docs as well, matching the MCP validator's document set.
5. **P1: Create agent prompt was missed by the cross-runtime agent vocabulary cleanup** — Fix `.opencode/agents/create.md:141`; Rename the create.md section heading to ROUTING SCAN and add .opencode/agents/create.md to the agent cleanup/resource-map coverage so future mirror scans include it.

## Spec Seed

- Require workflow-invariance to scan rendered phase-parent output, not only raw templates or broadly allowlisted paths.
- Require shell validator coverage to include manifest-declared lazy/optional docs when those docs exist in a packet.
- Require AI-facing agent cleanup to cover every exposed agent file, including `.opencode/agents/create.md`.

## Plan Seed

1. Update `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123` or its corresponding test/consumer surface to resolve `DR-001-P1-001`, then add regression evidence that covers same-class paths.
2. Update `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93` or its corresponding test/consumer surface to resolve `DR-002-P1-001`, then add regression evidence that covers same-class paths.
3. Update `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49` or its corresponding test/consumer surface to resolve `DR-003-P1-001`, then add regression evidence that covers same-class paths.
4. Update `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156` or its corresponding test/consumer surface to resolve `DR-004-P1-001`, then add regression evidence that covers same-class paths.
5. Update `.opencode/agents/create.md:141` or its corresponding test/consumer surface to resolve `DR-005-P1-001`, then add regression evidence that covers same-class paths.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | Iterations 001, 003, and 005 found spec/code or declared-surface mismatches. |
| checklist_evidence | partial | Iterations reviewed completed gates against implementation surfaces and found active P1 gaps. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| template_rendering | fail | Iteration 003 found scaffold snapshot coverage misses create-time phase-parent regressions. |
| validator_coverage | fail | Iteration 004 found shell validator coverage skips manifest-declared lazy docs. |
| command_yaml | partial | Iteration 002 found workflow-invariance allowlisting can false-pass public surfaces. |
| skill_assets | partial | Skill/system-spec-kit public surfaces were in scope through resource-map coverage. |
| agent_cross_runtime | fail | Iteration 005 found `.opencode/agents/create.md` still uses legacy heading vocabulary. |

## Resource Map Coverage Gate

- `Entries touched`: 59 reviewed evidence entries across iteration records.
- `Entries not touched`: many ledger paths intentionally sampled by dimension rather than exhaustively read; remaining untouched entries are `expected-by-scope` for this 5-iteration implementation-focused pass unless covered by an active finding above.
- `Implementation paths absent from resource-map`: `UNKNOWN`; no `applied/T-*.md` files were present for a complete target_files-to-resource-map reconciliation in this packet.

## Deferred Items

- P2 advisory count is 0; none were recorded as active advisories in this run.
- Full exhaustive resource-map row-by-row coverage is deferred because the operator requested exactly five iterations and each iteration was pinned to one implementation dimension.

## Audit Appendix

- **Convergence summary:** stopped at maxIterations=5; convergence did not fire early.
- **Dimension coverage:** 5/5 (1.00) — implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage, cross-runtime-mirror-consistency.
- **Iteration artifacts:** `review/iterations/iteration-001.md` through `iteration-005.md`; `review/deltas/iter-001.jsonl` through `iter-005.jsonl`.
- **State log:** `review/deep-review-state.jsonl` contains 5 `type=iteration` records.
- **Generated:** 2026-05-04T08:16:52.908Z
