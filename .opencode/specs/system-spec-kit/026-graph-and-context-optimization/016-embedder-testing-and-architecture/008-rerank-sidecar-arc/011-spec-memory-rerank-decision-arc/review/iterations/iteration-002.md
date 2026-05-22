# Iteration 002: Security Dimension Review

**Iteration:** 2 of 10  
**Dimension:** security  
**Status:** complete  
**Mode:** review  

---

## Dimension: Security

This iteration reviewed security aspects of the spec-memory rerank decision arc implementation, focusing on API key handling, environment variable security, opt-in semantics, and sidecar HTTP endpoint security considerations.

---

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/spec.md` - Parent arc specification
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/spec.md` - Phase 1 specification
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/spec.md` - Phase 2 specification
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/spec.md` - Phase 3 specification
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit/spec.md` - Retrieval audit specification
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/spec.md` - Closure specification
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126` - Cross-encoder flag implementation
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:25-28,256-262` - Confidence scoring with reranker penalty
- `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:1-108` - Opt-in semantics test coverage
- `.opencode/skills/system-spec-kit/SKILL.md:1-100` - Spec-kit skill documentation
- `.opencode/skills/system-rerank-sidecar/SKILL.md:1-100` - Sidecar skill documentation

---

## Findings by Severity

### P1 Findings

#### P1-001: Insufficient API key validation in opt-in detection
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:105-106,121-122`
- **Evidence:** The `isCrossEncoderEnabled()` and `isRerankerExpected()` functions read `VOYAGE_API_KEY` and `COHERE_API_KEY` environment variables with only `.trim()` for validation. No format validation, length checks, or prefix validation are performed. This could accept invalid or malformed keys as valid opt-in signals.
- **Finding class:** class-of-bug
- **Scope proof:** Grep for `VOYAGE_API_KEY|COHERE_API_KEY` shows these are the only two sites where these keys are read for opt-in detection
- **Affected surface hints:** ["API key validation", "opt-in detection", "environment variable security"]
- **Recommendation:** Add basic format validation (e.g., minimum length check, known prefix validation) for API keys before treating them as valid opt-in signals. Consider adding a separate validation function that both `isCrossEncoderEnabled()` and `isRerankerExpected()` can use.

### P2 Findings

#### P2-001: Code duplication between isCrossEncoderEnabled() and isRerankerExpected()
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:103-126`
- **Evidence:** The `isCrossEncoderEnabled()` function (lines 103-109) and `isRerankerExpected()` function (lines 120-126) contain nearly identical logic for checking environment variables and API keys. This duplication creates security policy drift risk where opt-in logic could diverge between the two functions.
- **Finding class:** class-of-bug
- **Scope proof:** Both functions check the same four conditions (SPECKIT_CROSS_ENCODER, VOYAGE_API_KEY, COHERE_API_KEY, RERANKER_LOCAL) with identical logic
- **Affected surface hints:** ["code duplication", "security policy consistency", "maintainability"]
- **Recommendation:** Refactor to extract the common opt-in detection logic into a shared helper function that both `isCrossEncoderEnabled()` and `isRerankerExpected()` can call, ensuring security policy consistency.

#### P2-002: Environment variable manipulation risk in opt-in security model
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:103-126`
- **Evidence:** The entire opt-in security model depends on environment variable presence (`SPECKIT_CROSS_ENCODER`, `RERANKER_LOCAL`, `VOYAGE_API_KEY`, `COHERE_API_KEY`) without additional validation or authentication. An attacker with process environment access could manipulate these variables to enable or disable reranking unexpectedly.
- **Finding class:** cross-consumer
- **Scope proof:** These environment variables are used across the search pipeline for feature flag control
- **Affected surface hints:** ["environment variable security", "process security", "feature flag security"]
- **Recommendation:** Consider adding a secondary validation mechanism (e.g., a configuration file validation, startup-time integrity check) to prevent runtime environment manipulation from changing security-sensitive opt-in behavior.

#### P2-003: Missing security documentation in skill files
- **File:** `.opencode/skills/system-spec-kit/SKILL.md:1-100`, `.opencode/skills/system-rerank-sidecar/SKILL.md:1-100`
- **Evidence:** Neither the system-spec-kit SKILL.md nor the system-rerank-sidecar SKILL.md documents security considerations for API key handling, environment variable security, or HTTP endpoint security. The sidecar SKILL.md mentions HTTP endpoints but does not address security considerations for the localhost:8765 service.
- **Finding class:** cross-consumer
- **Scope proof:** Search for "security" in both SKILL.md files returns no matches
- **Affected surface hints:** ["documentation", "security awareness", "operational security"]
- **Recommendation:** Add security sections to both SKILL.md files covering: API key handling best practices, environment variable security considerations, HTTP endpoint security (even for localhost), and operational security guidelines for running the sidecar service.

---

## Traceability Checks

### spec_code traceability
- ✅ Specification 005/opt-in-only-closure correctly identifies the security boundary changes (SPECKIT_CROSS_ENCODER default flip, isRerankerExpected() helper)
- ✅ Implementation in search-flags.ts matches the specification requirements for opt-in detection
- ✅ Test coverage in scoring-opt-in.vitest.ts validates the three security cases (no opt-in, local opt-in, cloud opt-in)

### checklist_evidence traceability
- ✅ Security requirements from 005/spec.md REQ-002 (isRerankerExpected helper) are implemented
- ✅ Test requirements from 005/spec.md REQ-004 (vitest coverage) are satisfied
- ⚠️ Security documentation requirements are not explicitly specified in specs, explaining the missing security documentation in skill files

---

## Verdict

**CONDITIONAL** with security advisories

The security dimension review identified one P1 finding (insufficient API key validation) that should be addressed before considering the implementation fully secure. The three P2 findings are important for security hardening but do not block the current opt-in-only closure implementation.

**Rationale:** The core security model of opt-in reranking is sound, but the API key validation weakness (P1-001) represents a genuine security gap that could lead to incorrect opt-in detection. The code duplication (P2-001) and environment manipulation risk (P2-002) are important for long-term security maintenance. The missing security documentation (P2-003) is an operational security gap.

---

## Next Dimension

**traceability** - Review the traceability between specifications, implementation, and tests across the rerank decision arc, focusing on requirement coverage and evidence linkage.