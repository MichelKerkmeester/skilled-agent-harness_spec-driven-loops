---
title: "Iteration 7: D1/D3 Correctness and traceability — shared engine, templates and payload parity"
trigger_phrases: []
---

# Iteration 7: D1/D3 Correctness and traceability — shared engine, templates and payload parity

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Focus

This pivot rotates into the surviving system-spec-kit engine and its Level 2 documentation contract. It reads the canonical context envelope, the advisor-local duplicate, discovery and retrieval boundaries, templates/examples, and packet cross-reference guidance. The main adversarial check is whether the two payload validators and the decommission packet's checklist vocabulary still describe one interoperable contract. Database-path symlink handling and deterministic trigger-index publication were rechecked as negative controls. Convergence remains telemetry only under `stopPolicy=max-iterations`.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 19
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 19 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- None newly opened. F001, F003, F004, F006 and F007 remain active; the shared-engine and template reads did not change their severity.

### P2, Advisory

- **F009 — Advisor-local shared payload retains producer values absent from the canonical context contract.** `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:291-299]` The preserved advisor duplicate accepts `startup_brief` and `session_snapshot` in `SHARED_PAYLOAD_PRODUCER_VALUES`. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts:258-264]` The canonical context validator accepts only `compact_merger`, `hook_cache` and `advisor`; its README says runtime producers import this folder instead of redefining payload shapes `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/context/README.md:17-24,100-115]`. The current advisor brief emits only `producer: 'advisor'` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:273-291]`, and an exact source search found no current producer for either extra value, so this is a latent contract/residue risk rather than a demonstrated live failure. If an advisor-local envelope is passed to a canonical consumer, a value locally accepted by `createSharedPayloadEnvelope` can be rejected by the canonical validator; if the duplicate is intentionally isolated, the extra values are undocumented stale surface. Severity is P2 because no current producer or live cross-boundary path was found.
  - Recommendation: remove the unused producer values or document them as explicitly local-only, and add a parity/interoperability fixture that asserts the intended producer vocabulary and rejection behavior.

## Claim adjudication

```json
[
  {
    "findingId": "F009",
    "claim": "The advisor-local shared payload producer enum is wider than the canonical context envelope enum.",
    "evidenceRefs": [
      ".opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:291-299",
      ".opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts:258-264",
      ".opencode/skills/system-spec-kit/mcp-server/lib/context/README.md:17-24,100-115"
    ],
    "counterevidenceSought": "Compared both producer arrays, traced the advisor envelope producer, and searched the preserved runtime for startup_brief and session_snapshot literals.",
    "alternativeExplanation": "The local file is intentionally duplicated for skill isolation, and current advisor production emits only advisor; the defect is therefore latent interoperability or residue risk, not a current runtime failure.",
    "finalSeverity": "P2",
    "confidence": 0.88,
    "downgradeTrigger": "If an explicit isolation contract proves local envelopes never cross into canonical context validation and the extra values are documented as local-only, downgrade to maintenance-only residue.",
    "transitions": [
      { "iteration": 7, "from": null, "to": "P2", "reason": "The duplicate validator accepts two producer values rejected by the canonical validator, with no current producer found for them." }
    ]
  }
]
```

## Search and ruled-out checks

- The Level 2 task template embeds its verification checklist in `tasks.md` `[SOURCE: .opencode/skills/system-spec-kit/templates/core/tasks.md.tmpl:107-118,143-164]`, while the Level 2 example still says `Checklist.md fully verified` `[SOURCE: .opencode/skills/system-spec-kit/templates/examples/level-2/tasks.md:103-122]`. This is the same missing-artifact/evidence-link family as F004, not a second finding; the packet's actual acceptance rows remain the authoritative unresolved evidence `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/acceptance-criteria.md:33-35,55-60]`.
- The canonical context README explicitly makes `shared-payload.ts` the owner of payload vocabulary and says producers import it rather than redefining shapes `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/context/README.md:17-24,109-115]`. The local advisor copy is a deliberate isolation seam, so the enum mismatch was recorded at P2 rather than escalated to P1 without a live interchange path.
- The corpus walker sorts directory entries and canonical paths and deduplicates by real path `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:118-144,154-204,208-240]`; the generator sorts phrases, paths and diagnostics before publication `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:180-232]`, and the scoped trigger-index test asserts canonical serialized ordering `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:166-183]`. Ranking determinism across all lanes remains deferred, but no new publication-order finding was supported.
- The folder-discovery path resolves real paths, tracks visited canonical folders, skips dot directories and configured archive/scratch names, and bounds recursion `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:157-167,445-525]`. The shared path helper's lexical checks were not promoted to a finding because the scoped database-boundary test exercises the actual config consumer's outside-root symlink rejection `[SOURCE: .opencode/skills/system-spec-kit/shared/paths.ts:100-120]` `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/memory-roadmap-flags.vitest.ts:59-69]`.
- The template and workflow references still describe the manual context-save command and required Level 2 artifacts `[SOURCE: .opencode/skills/system-spec-kit/references/workflows/quick-reference.md:160-195]`; these are surviving spec-kit workflows, not evidence that the retired memory server is registered. Authoritative residue, validation, and trigger-index commands were not run because they would write outside this lineage.

## Traceability result

- `spec_code`: partial. F009 adds a canonical/local payload vocabulary drift; F001, F003, F004, F006, F007 and F008 remain unresolved.
- `checklist_evidence`: blocked. The packet has checklist-like material in `tasks.md`, but no root `checklist.md`; the authoritative validator and generators remain intentionally unrun under the lineage-only boundary.

## Iteration handoff

- New active registry: P0=0, P1=5, P2=4, open=9.
- Next angle: command and hook registration/residue boundaries, followed by a broad adversarial replay of all active findings.
- Stop policy: continue through iteration 10 even if convergence telemetry rises.

Review verdict: CONDITIONAL
