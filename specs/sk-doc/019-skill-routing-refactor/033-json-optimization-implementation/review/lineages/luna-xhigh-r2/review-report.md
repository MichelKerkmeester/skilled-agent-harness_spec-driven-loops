# Deep Review Report

## Executive Summary

- Overall verdict: CONDITIONAL
- hasAdvisories: false
- Active findings: P0=0, P1=3, P2=4
- Review scope: spec-folder .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation; all configured dimensions reviewed across four max-iteration passes.
- Stop reason: maxIterationsReached. Convergence was telemetry only under the configured max-iterations policy.

## Planning Trigger

speckit:plan is required because active P1 findings remain unresolved. The planning packet is reducer-backed and preserves UNKNOWN where structured evidence was absent.

### Planning Packet

~~~json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "LXR2-001-P1-001",
      "severity": "P1",
      "title": "Parent coordination map is stale against every child phase status",
      "dimension": "correctness",
      "file": ".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129"
    },
    {
      "id": "LXR2-001-P1-002",
      "severity": "P1",
      "title": "Command-metadata phase claims Complete while live-generation acceptance remains unmet",
      "dimension": "correctness",
      "file": ".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41"
    },
    {
      "id": "LXR2-003-P1-001",
      "severity": "P1",
      "title": "Program close is marked Complete while its own close-gate evidence says strict validation remained blocked",
      "dimension": "traceability",
      "file": ".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46"
    },
    {
      "id": "LXR2-001-P2-001",
      "severity": "P2",
      "title": "Child spec continuity frontmatter is stale after completion",
      "dimension": "correctness",
      "file": ".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:25"
    },
    {
      "id": "LXR2-002-P2-001",
      "severity": "P2",
      "title": "Workflow leaves token permissions implicit while npm-fetched tools execute",
      "dimension": "security",
      "file": ".github/workflows/routing-registry-drift.yml:58"
    },
    {
      "id": "LXR2-003-P2-001",
      "severity": "P2",
      "title": "Root feature catalog conflates twelve workflow modes with twelve packets",
      "dimension": "traceability",
      "file": ".opencode/skills/sk-doc/feature-catalog/feature-catalog.md:3"
    },
    {
      "id": "LXR2-004-P2-001",
      "severity": "P2",
      "title": "Deprecated TS-only derived sync writer still advertises a full-object schema path",
      "dimension": "maintainability",
      "file": ".opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:106"
    }
  ],
  "remediationWorkstreams": [
    "P1: reconcile parent/child completion metadata and the strict-validation release gate.",
    "P2: synchronize continuity metadata, CI token permissions, catalog packet counts, and the obsolete derived-writer contract."
  ],
  "specSeed": [
    "Reconcile the parent Phase Documentation Map and completion status with every child phase and the strict validation gate.",
    "Record the phase-011 live command-bridge outcome as delivered or explicitly deferred under an owning phase."
  ],
  "planSeed": [
    "Audit and update parent and child status/continuity metadata with evidence.",
    "Close or formally defer the phase-011 generated-live-bridge acceptance gap.",
    "Add least-privilege workflow permissions and align catalog/derived-writer contracts with live authority."
  ],
  "findingClasses": [
    "matrix/evidence",
    "cross-consumer",
    "UNKNOWN",
    "instance-only"
  ],
  "affectedSurfacesSeed": [
    "routing-registry-drift workflow",
    "GITHUB_TOKEN permission boundary",
    "npm-backed CI tools",
    "derived metadata maintenance",
    "lifecycle/redirect metadata",
    "skill-root freshness gate"
  ],
  "fixCompletenessRequired": true
}
~~~

## Active Finding Registry

### LXR2-001-P1-001 — P1
- Title: Parent coordination map is stale against every child phase status
- Dimension: correctness
- Location: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129
- Evidence: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:140; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:151; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision/spec.md:47; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:49
- Impact / affected surfaces: parent Phase Documentation Map, child phase status metadata, release-readiness routing, resume/coordination readers
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: matrix/evidence
- Scope proof: Direct status sweep over 001 through 012 child spec.md files found all twelve Complete rows, while the parent map keeps all twelve rows Planned.

### LXR2-001-P1-002 — P1
- Title: Command-metadata phase claims Complete while live-generation acceptance remains unmet
- Dimension: correctness
- Location: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41
- Evidence: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:24; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:42; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:77; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:85; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:94; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:103; .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:58; .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2126; .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2219
- Impact / affected surfaces: 011 phase completion metadata, TypeScript command bridge projection, Python command bridge routing, program close gate
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: cross-consumer
- Scope proof: Checked the phase spec, the phase implementation summary, and both named live bridge consumers projection.ts and skill_advisor.py.

### LXR2-003-P1-001 — P1
- Title: Program close is marked Complete while its own close-gate evidence says strict validation remained blocked
- Dimension: traceability
- Location: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46
- Evidence: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:86; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/checklist.md:98; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/results/final-corpus-capture.md:25; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/implementation-summary.md:43; .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/implementation-summary.md:79
- Impact / affected surfaces: parent completion metadata, phase-012 close gate, strict validation gate, release-readiness consumers
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: UNKNOWN
- Scope proof: Reviewed the parent completion requirement, phase-012 docs checklist, phase-012 implementation summary, and named final-corpus evidence; the contradiction is local to the program-close gate.

### LXR2-001-P2-001 — P2
- Title: Child spec continuity frontmatter is stale after completion
- Dimension: correctness
- Location: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:25
- Evidence: UNKNOWN
- Impact / affected surfaces: child spec frontmatter, secondary continuity consumers, status audit tooling
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: matrix/evidence
- Scope proof: Direct completion_pct sweep found 001 and 002 at 100 and 003 through 012 at 0; direct status sweep found every child spec status row Complete.

### LXR2-002-P2-001 — P2
- Title: Workflow leaves token permissions implicit while npm-fetched tools execute
- Dimension: security
- Location: .github/workflows/routing-registry-drift.yml:58
- Evidence: UNKNOWN
- Impact / affected surfaces: routing-registry-drift workflow, GITHUB_TOKEN permission boundary, npm-backed CI tools
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: cross-consumer
- Scope proof: Searched for explicit permissions blocks across the workflow and related target; none exist in routing-registry-drift.yml, while both jobs run dependency-backed commands.

### LXR2-003-P2-001 — P2
- Title: Root feature catalog conflates twelve workflow modes with twelve packets
- Dimension: traceability
- Location: .opencode/skills/sk-doc/feature-catalog/feature-catalog.md:3
- Evidence: UNKNOWN
- Impact / affected surfaces: sk-doc feature catalog, packet-authored routing docs, mode registry readers
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: UNKNOWN
- Scope proof: Compared the root catalog, per-feature catalog page, SKILL.md, and mode-registry.json; sk-create-skill-parent maps to packet sk-create-skill, so modes total twelve while packets total eleven.

### LXR2-004-P2-001 — P2
- Title: Deprecated TS-only derived sync writer still advertises a full-object schema path
- Dimension: maintainability
- Location: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:106
- Evidence: UNKNOWN
- Impact / affected surfaces: derived metadata maintenance, lifecycle/redirect metadata, skill-root freshness gate
- Fix recommendation: UNKNOWN (not present in the structured finding record).
- Disposition: active
- Finding class: instance-only
- Scope proof: Exact search for syncDerivedMetadata found the exported writer and test/stress consumers; the shipped in-scope maintenance path is regenerate-skill-derived.cjs plus ci-skill-derived-freshness.cjs, so the actionable surface is the obsolete exported writer contract, not the whole derived pipeline.

## Remediation Workstreams

### P1 — release-readiness truth

1. Reconcile the parent Phase Documentation Map with all child status rows.
2. Resolve the phase-011 generated-live-bridge acceptance mismatch, or explicitly re-scope it to a new owning phase.
3. Do not retain parent Complete status while the required recursive strict validation gate is recorded as blocked.

### P2 — maintainability and hardening

1. Synchronize stale child continuity frontmatter.
2. Declare least-privilege permissions for the dependency-backed routing workflow.
3. Correct the feature catalog's packet-versus-mode count.
4. Retire or clearly deprecate the obsolete TS-only derived sync writer.

## Spec Seed

- Completion status must be derived from reconciled child status, implementation evidence, and the strict validation gate.
- Phase 011 must distinguish shadow tooling from live generated command-bridge delivery.
- Catalog and generated metadata contracts must name the single authoritative producer and consumer path.

## Plan Seed

- Capture a status matrix for the parent and all twelve child phases.
- Produce passing recursive strict-validation evidence before restoring a Complete release state.
- Add workflow permission boundaries and regression checks.
- Align feature catalog counts with the live mode registry.
- Remove or deprecate the obsolete full-object derived writer and add a caller-level regression check.

## Traceability Status

- Core spec_code: fail — parent completion and strict-validation evidence are contradictory; see the active P1 findings.
- Core checklist_evidence: fail — phase-012 checklist completion reconciliation is not supported by its recorded blocked validation evidence.
- Overlay feature_catalog_code: partial — compiled-routing coverage exists, but the catalog misstates packet count.
- Overlay playbook_capability: pass for the reviewed compiled-routing capability.
- Overlay skill_agent: notApplicable — target is a spec-folder review.
- Overlay agent_cross_runtime: notApplicable — target is a spec-folder review.
- AC_COVERAGE: advisory-shortfall — child checklists and implementation summaries exist, but parent completion truth is not reconciled to the required close gate.

## Deferred Items

- Re-run recursive strict validation after the pi-hook/validation blocker is repaired.
- Verify repository or organization defaults before treating the CI token-permission advisory as resolved.
- Confirm all declared implementation paths after the sk-create-skill relocation is fully reflected in the scope manifest.

## Dimension Expansion Map

- Selected review directions: correctness, security, traceability, maintainability.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Saturated directions: correctness, security, traceability, and maintainability were each reviewed once; convergence did not terminate the loop early.
- Remaining frontier: remediation verification only; no further discovery was permitted by maxIterations.

## Search Ledger

- hasSearchDebt: true
- Required bug classes: completion-gate traceability mismatch, checklist evidence mismatch, feature-catalog code drift, playbook capability gap.
- Covered: completion-gate traceability mismatch, checklist evidence mismatch, feature-catalog code drift; playbook capability gap was ruled out.
- Ruled out: P0 traceability blocker, missing compiled-routing catalog coverage, shell injection, path traversal, prompt-shaped metadata persistence.
- Deferred/search debt: runtime validation re-execution and one reducer-owned search-debt item.
- Graph coverage mode: graphless_fallback; source-ledger evidence was used.

## Audit Appendix

- Iterations: 4 configured passes; iteration 3 required one artifact repair append, and the latest canonical record was used by the verifier/reducer.
- Ratios: 1.0, 0.0833, 0.3333, 0.0526.
- Final active findings: P0=0, P1=3, P2=4.
- Convergence score: 0.9474 (telemetry only under max-iterations).
- Search debt count: 1.
- Corruption count: 0.
- Sources reviewed: iteration narratives, state JSONL, delta JSONL, reducer registry/dashboard/strategy, and the scoped spec/code files named by the review packet.

### Core Protocols

- spec_code: fail — completion metadata is not traceable to a passing strict-validation gate.
- checklist_evidence: fail — checklist completion is contradicted by recorded close evidence.

### Overlay Protocols

- feature_catalog_code: partial — packet count drift remains.
- playbook_capability: pass — compiled-routing capability is represented with pass/fail criteria.
- skill_agent: notApplicable.
- agent_cross_runtime: notApplicable.
