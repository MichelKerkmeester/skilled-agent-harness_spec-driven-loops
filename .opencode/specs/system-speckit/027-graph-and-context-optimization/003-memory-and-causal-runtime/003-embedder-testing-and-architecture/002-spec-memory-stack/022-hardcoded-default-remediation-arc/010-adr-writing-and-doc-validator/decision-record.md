---
title: "Decision Record: 022/010 ADR writing and doc validator"
description: "ADR outcomes for skill-advisor calibration, verification clause amendment, profile.ts scope coverage, and doc-implementation cross-checking mandate."
trigger_phrases:
  - "022/010 ADR"
  - "ADR-A skill-advisor calibration"
  - "ADR-B verification clause"
  - "ADR-C profile.ts scope"
  - "ADR-D doc cross-checking"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator"
    last_updated_at: "2026-05-23T15:17:00Z"
    last_updated_by: "devin"
    recent_action: "Authored 4 ADRs and sk-doc validator script closing 022 arc"
    next_safe_action: "Wire validate-doc-model-refs.js to pre-commit or CI"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002313"
      session_id: "022-010-adr-writing-and-doc-validator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Skill-advisor calibration constants are now centralized in SKILL_ADVISOR_COMPAT_CONTRACT.defaults"
      - "Verification clause for ADR-013/014 now covers inline || fallback patterns"
      - "All 3 spec-memory resolution chains derive from registry.ts"
      - "Doc drift can now be caught by validate-doc-model-refs.js validator"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/.templates/decision-record-core.md | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Decision Record: 022/010 ADR writing and doc validator

Closing the 022 hardcoded-default-remediation arc by authoring 4 ADRs governing what was implemented across packets 022/001, 022/004a, and 022/004b, plus a sk-doc validator that catches future doc-implementation drift early.

<!-- ANCHOR:adr-a -->
## ADR-A: Skill-Advisor Calibration as Contractual Constants

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-23 |
| Decision | CENTRALIZE-CONSTANTS |

**Context:**

Packet 022/004a remediated 14 P0 audit findings that flagged confidence/uncertainty threshold defaults duplicated across 5 production-path files in skill-advisor. The contract file `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` was declared at `compat/contract.ts:5-12` but was unused by production code; only test files imported it. The `RoutingCalibration` interface had 3 missing typed slots. Operators had no env-var override path for tuning thresholds at runtime without editing source code.

**Decision:**

`SKILL_ADVISOR_COMPAT_CONTRACT.defaults` is the canonical source of truth for skill-advisor confidence and uncertainty thresholds in production code. All production consumers MUST import from it (verified by 022/004a). Env-var overrides via `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD`, `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD`, and `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` allow runtime experimentation without compromising the bench-diff audit trail. The contract values stay frozen-by-default for PR review visibility; the JSON-patch override mechanism handles ops tuning.

**Consequence:**

0.8/0.35 default changes now require a single contract.ts edit + a bench-diff. Downstream packets can rely on one source of truth. Future skill-advisor tuning produces a single diff per threshold change rather than N coordinated edits. The 3 missing `RoutingCalibration` interface slots are now typed, preventing future silent mismatches.

**Evidence:**

- `.opencode/skills/system-skill-advisor/compat/contract.ts` (centralized defaults)
- `.opencode/skills/system-skill-advisor/compat/contract.test.ts` (invariant test)
- 022/004a remediation commit logs
<!-- /ANCHOR:adr-a -->

<!-- ANCHOR:adr-b -->
## ADR-B: Verification Clause Amendment for ADR-013 + ADR-014

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-23 |
| Decision | AMEND-VERIFICATION-CLAUSE |

**Context:**

Packet 020's BAAI-default fix grep scanned for `DEFAULT_*` constants and missed `profile.ts:195`'s inline `process.env.HF_EMBEDDINGS_MODEL || 'BAAI/bge-base-en-v1.5'` fallback. The 021 audit caught it as f-iter001-001 (CONFIRMED ACTIVE). ADR-013 and ADR-014 described intended behavior without enumerating implementation surfaces, leaving the grep blind to inline `||` fallback patterns.

**Decision:**

Future model-default audits MUST grep for BOTH `DEFAULT_*` constants AND inline `|| 'literal'` fallback patterns across all `.ts` and `.py` files under `.opencode/skills/system-spec-kit/shared/embeddings/` and `.opencode/skills/mcp-coco-index/`. An invariant test (`profile.test.ts` shipped 022/001 + future similar tests) asserts `profile.ts` and equivalent provider files derive model names from `registry.ts`'s `getCanonicalFallback` helper. No inline string-literal model defaults are permitted in production code outside `registry.ts` itself.

**Consequence:**

Future drift becomes structurally impossible at the grep + invariant-test level. New model defaults require explicit ADR mention of every site impacted. Auditors get a stable contract to verify against. This amendment is also appended to `004-spec-memory-embedder-bake-off/decision-record.md` as section `## AMENDMENT (2026-05-23, per 022/010): Verification clause for ADR-013/014`. Original ADR-013/014 text is unchanged; the amendment adds new requirements without rewriting history.

**Cross-ref:**

Full amendment text in `.../004-spec-memory-embedder-bake-off/decision-record.md`.

**Evidence:**

- `.opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts` (invariant test)
- 022/001 remediation commit logs
- 021 audit f-iter001-001 finding
<!-- /ANCHOR:adr-b -->

<!-- ANCHOR:adr-c -->
## ADR-C: profile.ts Scope Coverage (Parallel Resolution Chains)

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-23 |
| Decision | DOCUMENT-ALL-CHAINS |

**Context:**

Spec-memory has 3 parallel embedder resolution chains: (1) the auto-select cascade (`auto-select.ts`); (2) the active-profile path used by CLI scripts (`profile.ts:resolveActiveProfileModel`); (3) the deferred-resolution path in `embeddings.ts:detectConfiguredModelName`. Packet 020 fixed the cascade but missed (2) and (3); the 021 audit caught both as P0 (f-iter001-001/002/003), shipped 022/001.

**Decision:**

All 3 resolution chains MUST derive model defaults from `registry.ts` (`getCanonicalFallback` for embedders; future `getRerankerFallback` for rerankers per 022/005). Each chain's entry point file has a test enforcing this. The `resolve*` family of functions in spec-memory must NOT inline string literals as fallbacks; canonical fallbacks live in `registry.ts` only.

**Consequence:**

Future maintainers see all 3 chains in one place documented here. Adding a new resolution chain requires a parallel `registry.ts`-derived implementation + invariant test. The 022/001 fixes closed all 3 P0 findings from the 021 audit.

**Evidence:**

- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` (chain 1)
- `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts` (chain 2)
- `.opencode/skills/system-spec-kit/shared/embeddings/embeddings.ts` (chain 3)
- `.opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts` (invariant test)
- 022/001 remediation commit logs
<!-- /ANCHOR:adr-c -->

<!-- ANCHOR:adr-d -->
## ADR-D: Doc-Implementation Cross-Checking Mandate

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-23 |
| Decision | VALIDATE-DOC-REFS |

**Context:**

CocoIndex shipped clean code on 2026-05-19 (nomic + jina-reranker-v3) and 023B (Qwen3-Reranker-0.6B promotion), but 5 doc surfaces continued citing stale defaults for days. The 021 audit caught 5 P0 doc-drift findings. No CI step caught the drift at PR time; only operator-initiated audit surfaces it.

**Decision:**

A new validator script `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` greps every doc under `.opencode/skills/*/` (excluding `changelog/`, `scratch/`, `benchmarks/`, `*archive*`) for model-name strings and cross-references against the canonical model list derived from `registry.ts` (`MANIFESTS` + `CLOUD_CANONICAL` + future `RERANKER_CANONICAL`) and `registered_embedders.py` (`DEFAULT_EMBEDDER_NAME` + `DEFAULT_RERANKER_NAME`). Drift = a doc citing a model name NOT in the canonical list as "current default", "default", "shipped default", or similar wording. The script reports drift with file:line + cited value + canonical value. Exit 0 = no drift; exit 1 = drift found.

**Consequence:**

Doc drift becomes visible at PR time once wired to pre-commit (advisory) or CI (blocking). The 1-shot run after a default-change is the immediate use case; CI wiring is deferred. The script includes `--verbose` flag for debugging and `--help` for usage documentation.

**Evidence:**

- `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` (validator script)
- 021 audit doc-drift findings (5 P0)
- 022/010 implementation commit logs
<!-- /ANCHOR:adr-d -->
