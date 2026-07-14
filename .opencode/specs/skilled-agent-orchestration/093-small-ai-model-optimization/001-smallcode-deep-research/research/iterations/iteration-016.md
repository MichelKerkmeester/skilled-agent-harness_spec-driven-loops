# Iteration 016 — Implementability Review: P0/P1 Artifacts

**Iteration:** 16 of 20
**Focus:** IMPLEMENTABILITY — For each P0/P1 artifact, assess realistic implementation effort + what could go wrong
**Status:** Insight
**New Info Ratio:** 0.15

---

## Focus

Per-artifact implementability review for P0/P1 packets (010, 012, 001, 005, 006, 007). For each artifact:
- Realistic effort estimate (Low <4 hrs, Medium 4-12 hrs, High 12-30 hrs, Very High >30 hrs)
- Top failure mode (what's the most likely way this implementation goes wrong?)
- Pre-implementation dependencies (e.g., "needs 012 enhances edges merged first")
- Testability — is there a clear pass/fail check after implementation?
- Reversibility — can this be rolled back cleanly if it breaks production?

Flag artifacts where:
- Failure mode is severe AND testability is weak → "implementation risk: HIGH"
- Effort is Very High AND reversibility is Low → "needs spike packet first"
- Dependencies create a chicken-and-egg loop → "needs sequencing ADR"

---

## Actions Taken

1. **Read research.md §RQ1-4 deltas** to extract P0/P1 artifact details (32 artifacts across 6 packets)
2. **Read iter-013, iter-014, iter-015** to understand prior findings that inform implementability judgments
3. **Read cli-devin/SKILL.md and cli-opencode/SKILL.md** to understand current integration points and runtime environments
4. **Analyzed each P0/P1 artifact** for effort, failure modes, dependencies, testability, and reversibility
5. **Compiled implementability audit table** with risk flags and spike/sequencing recommendations

---

## Implementability Audit Table

| Artifact | RQ | Packet | Effort | Top Failure Mode | Dependencies | Testability | Reversibility | Risk Rating |
|---|---|---|---|---|---|---|---|---|
| **010-P1: Category-Based Tool Classification** | RQ4 | 010 | Low | Schema validation fails for edge-case tool categories | None | HIGH (schema validates against enum) | HIGH (JSON schema delete) | LOW |
| **010-P2: Enabled/Disabled Allowlist Filtering** | RQ4 | 010 | Low | Allowlist/denylist logic inverted (deny instead of allow) | None | HIGH (unit test with mock tool calls) | HIGH (JSON schema delete) | LOW |
| **010-P4: Write-Operation Approval Gate** | RQ4 | 010 | Medium | Approval gate bypassed by --dangerously-skip-permissions flag | None | MEDIUM (integration test with flag variants) | HIGH (JSON schema delete) | MEDIUM |
| **010-P5: Structured Permissions Matrix** | RQ4 | 010 | High | Permission string parsing bug allows bypass of deny rules | 010-P1, 010-P2 | MEDIUM (RM-8 counter-example test) | MEDIUM (schema rollback complex) | **HIGH** |
| **010-A4a: Permissions-Matrix Schema (Full JSON)** | RQ4 | 010 | High | Schema validation too permissive, allows invalid permission strings | 010-P5 | MEDIUM (comprehensive schema test suite) | MEDIUM (schema rollback complex) | **HIGH** |
| **010-A4b: RM-8 Counter-Example Walkthrough** | RQ4 | 010 | Low | Documentation drift from actual schema implementation | 010-A4a | HIGH (docs match schema validation) | HIGH (documentation delete) | LOW |
| **010-A4c: Schema Location Verdict** | RQ4 | 010 | Low | Co-location with enforcement logic breaks if cli-opencode refactors | None | HIGH (file exists at expected path) | HIGH (file move/delete) | LOW |
| **010-A4d: Runtime Enforcement Design** | RQ4 | 010 | Very High | Pre-tool-call hook integration point breaks on cli-opencode version change | 010-A4a, 010-A4c | LOW (requires full cli-opencode integration test) | LOW (hook removal risky) | **HIGH** |
| **012-A5-1: AGENTS.md Rule Addition** | RQ5 | 012 | Low | Rule text conflicts with existing CLI dispatch rule | None | HIGH (AGENTS.md parses correctly) | HIGH (text revert) | LOW |
| **012-A5-2: Enhances-Edge Wiring (5 edges)** | RQ5 | 012 | Medium | Edge weights incorrect, causing advisor routing failures | None | MEDIUM (advisor scoring simulation) | HIGH (graph-metadata revert) | MEDIUM |
| **012-A5-3: Trigger_Phrases Additions (4 skills)** | RQ5 | 012 | Medium | Trigger phrases too generic, causing false-positive routing | 012-A5-2 | MEDIUM (advisor routing test suite) | HIGH (graph-metadata revert) | MEDIUM |
| **012-A5-4: Sentinel Skill Creation** | RQ5 | 012 | Low | Sentinel skill fails to load due to missing SKILL.md fields | 012-A5-2 | HIGH (skill loads via advisor) | HIGH (skill delete) | LOW |
| **001-P1: Percentage-Based Budget Allocation** | RQ1 | 001 | Medium | Budget calculator overflow with large context windows | None | HIGH (unit test with edge values) | HIGH (reference file delete) | LOW |
| **001-P2: Tool Result Truncation** | RQ1 | 001 | Medium | Char-to-token approximation inaccurate for non-ASCII text | 001-P1 | MEDIUM (test with multilingual content) | HIGH (reference file delete) | MEDIUM |
| **001-P4: File Summarization Threshold** | RQ1 | 001 | Medium | Summarization integration point missing in cli-devin workflow | None | LOW (requires cli-devin integration test) | HIGH (reference file delete) | MEDIUM |
| **001-P5: Usage Tracking and Display** | RQ1 | 001 | Low | Usage counter drift from actual token consumption | 001-P1 | HIGH (counter accuracy test) | HIGH (reference file delete) | LOW |
| **001-A1a: Per-Model Token-Budget Defaults Table** | RQ1 | 001 | Low | Defaults table outdated for new model releases | None | HIGH (table validation against specs) | HIGH (table update) | LOW |
| **001-A1b: Truncation-Marker Syntax Candidates** | RQ1 | 001 | Low | Truncation marker syntax conflicts with existing error messages | 001-P2 | HIGH (syntax uniqueness test) | HIGH (documentation revert) | LOW |
| **005-P1: Multi-Stage Verification Pipeline** | RQ2 | 005 | High | Pipeline stage dependencies incorrect (e.g., execute before compile) | None | MEDIUM (pipeline integration test) | MEDIUM (reference file delete) | **HIGH** |
| **005-P2: Structural Validation with Auto-Fix** | RQ2 | 005 | Medium | Auto-fix logic introduces new syntax errors | 005-P1 | MEDIUM (auto-fix test suite) | HIGH (reference file delete) | MEDIUM |
| **005-P3: Calibrated Confidence Scoring** | RQ2 | 005 | Medium | Weight calibration off for small vs large models | 005-P1 | MEDIUM (confidence scoring test) | HIGH (reference file delete) | MEDIUM |
| **005-P4: Hard-Fail Gatekeeper** | RQ2 | 005 | Medium | Hard-fail logic too aggressive, blocking valid work | 005-P3 | MEDIUM (gatekeeper threshold test) | HIGH (reference file delete) | MEDIUM |
| **005-P5: Language-Specific Compile Commands** | RQ2 | 005 | Medium | Language command mapping missing for new language | None | HIGH (command lookup test) | HIGH (reference file update) | LOW |
| **006-A2a: Drop-in System Instructions** | RQ2 | 006 | Low | System instructions conflict with existing cli-devin prompts | None | HIGH (prompt integration test) | HIGH (JSON revert) | LOW |
| **006-A2b: Confidence-Scoring Rubric Formula** | RQ2 | 006 | High | Formula adaptation incorrect for research output context | 005-P3 | LOW (requires deep-loop integration test) | MEDIUM (function revert) | **HIGH** |
| **006-A2c: Post-Dispatch-Validate Integration** | RQ2 | 006 | High | Integration handshake breaks dispatcher error handling | 006-A2b | LOW (requires full deep-loop test) | LOW (function removal risky) | **HIGH** |
| **006-A2d: Hard-Fail Message Template** | RQ2 | 006 | Low | Template variables missing in runtime context | 006-A2c | HIGH (template rendering test) | HIGH (template revert) | LOW |
| **007-P1: Per-Model Profile Schema** | RQ3 | 007 | Medium | Schema field mapping incorrect for new model features | None | MEDIUM (schema validation test) | HIGH (JSON schema revert) | MEDIUM |
| **007-P2: Profile Lookup with Substring Matching** | RQ3 | 007 | Medium | Substring matching too permissive, returning wrong profile | 007-P1 | MEDIUM (lookup accuracy test) | HIGH (reference file delete) | MEDIUM |
| **007-A3a: Model-Profile JSON Schema (8 Models)** | RQ3 | 007 | High | 8-model profile data drifts from actual model specs | 007-P1 | MEDIUM (profile validation against specs) | MEDIUM (JSON rollback) | **HIGH** |
| **007-A3c: Registry Location Verdict** | RQ3 | 007 | Low | Mirror sync fails for some CLI skills | 007-A3a | MEDIUM (mirror sync test) | HIGH (location revert) | MEDIUM |

---

## Implementation-Risk Flags

### HIGH Implementation Risk (Failure Mode Severe + Testability Weak)

**1. Artifact 010-A4d: Runtime Enforcement Design**
- **Effort:** Very High (>30 hrs)
- **Failure Mode:** Pre-tool-call hook integration point breaks on cli-opencode version change
- **Testability:** LOW (requires full cli-opencode integration test)
- **Reversibility:** LOW (hook removal risky)
- **Risk:** HIGH — Runtime enforcement is the RM-8 prevention mechanism, but hook integration is fragile to cli-opencode refactoring. Testability is weak because it requires end-to-end testing with actual tool calls.
- **Recommendation:** Needs spike packet first. Create a minimal hook integration proof-of-concept before full implementation.

**2. Artifact 010-A4a: Permissions-Matrix Schema (Full JSON)**
- **Effort:** High (12-30 hrs)
- **Failure Mode:** Schema validation too permissive, allows invalid permission strings
- **Testability:** MEDIUM (comprehensive schema test suite)
- **Reversibility:** MEDIUM (schema rollback complex)
- **Risk:** HIGH — Schema is the foundation for RM-8 prevention. If validation is too permissive, the entire permissions system fails to block destructive operations.
- **Recommendation:** Implement comprehensive schema test suite before schema deployment. Include adversarial test cases for permission string bypasses.

**3. Artifact 006-A2b: Confidence-Scoring Rubric Formula**
- **Effort:** High (12-30 hrs)
- **Failure Mode:** Formula adaptation incorrect for research output context
- **Testability:** LOW (requires deep-loop integration test)
- **Reversibility:** MEDIUM (function revert)
- **Risk:** HIGH — Confidence scoring is critical for research output quality. Incorrect adaptation could ship low-quality research or hard-fail valid work.
- **Recommendation:** Needs spike packet first. Validate formula adaptation against sample research outputs before integration.

**4. Artifact 006-A2c: Post-Dispatch-Validate Integration**
- **Effort:** High (12-30 hrs)
- **Failure Mode:** Integration handshake breaks dispatcher error handling
- **Testability:** LOW (requires full deep-loop test)
- **Reversibility:** LOW (function removal risky)
- **Risk:** HIGH — Integration with dispatcher is a critical path. Breakage could prevent all research iterations from completing.
- **Recommendation:** Needs spike packet first. Test integration handshake in isolated environment before deep-loop deployment.

**5. Artifact 007-A3a: Model-Profile JSON Schema (8 Models)**
- **Effort:** High (12-30 hrs)
- **Failure Mode:** 8-model profile data drifts from actual model specs
- **Testability:** MEDIUM (profile validation against specs)
- **Reversibility:** MEDIUM (JSON rollback)
- **Risk:** HIGH — Model profiles are cross-cutting infrastructure used by both cli-devin and cli-opencode. Data drift causes inconsistent behavior across CLI orchestrators.
- **Recommendation:** Implement automated profile validation against model provider APIs. Schedule regular profile updates.

---

## Spike Packet Candidates

**Spike-010-runtime-enforcement:** Proof-of-concept for pre-tool-call hook integration in cli-opencode execution layer. Validate hook stability across cli-opencode version changes. Test safe failure mode (deny if schema load fails).

**Spike-006-research-confidence:** Validate confidence-scoring formula adaptation for research output context. Test against sample research outputs with known quality scores. Confirm threshold guidance (0.80+ ship, 0.70-0.79 warning, <0.70 hard-fail).

**Spike-007-model-profile-drift:** Implement automated validation of 8-model profile data against model provider APIs. Test profile drift detection and update workflow.

---

## Dependency Analysis

### Chicken-and-Egg Loops

**Loop 1: Permissions Matrix Schema vs Runtime Enforcement**
- 010-A4a (schema) depends on 010-A4c (location verdict)
- 010-A4d (runtime enforcement) depends on 010-A4a (schema)
- 010-A4c (location verdict) depends on 010-A4d (enforcement integration point)
- **Resolution:** Sequence as 010-A4c → 010-A4a → 010-A4d. Location verdict is architectural decision with no implementation dependencies. Schema implementation precedes enforcement integration.

**Loop 2: Verification Pipeline Stages**
- 005-P1 (multi-stage pipeline) depends on 005-P2 (structural validation)
- 005-P2 (structural validation) depends on 005-P1 (pipeline stage definition)
- 005-P3 (confidence scoring) depends on 005-P1 (pipeline stages)
- **Resolution:** Sequence as 005-P1 (pipeline skeleton) → 005-P2/P3/P4/P5 (stage implementations). Pipeline skeleton defines stage interfaces without implementation dependencies.

### Dependency Chain for Packet 010 (Permissions Matrix)

```
010-P1 (category classification) → 010-P2 (allowlist filtering) → 010-P5 (structured matrix) → 010-A4a (full schema) → 010-A4d (runtime enforcement)
```

**Sequencing ADR:** Implement in order. Each artifact builds on the previous. Category classification enables allowlist filtering, which enables structured matrix, which enables full schema, which enables runtime enforcement.

### Dependency Chain for Packet 006 (Output Verification)

```
005-P3 (confidence scoring) → 006-A2b (formula adaptation) → 006-A2c (integration handshake) → 006-A2d (message template)
```

**Sequencing ADR:** Formula adaptation (006-A2b) depends on baseline confidence scoring (005-P3) from packet 005. Integration handshake (006-A2c) depends on formula adaptation. Message template (006-A2d) depends on integration handshake. Packet 005 must complete before packet 006 begins.

---

## Testability Assessment

### HIGH Testability (Clear Pass/Fail)

- Schema validation artifacts (010-P1, 010-P2, 010-A4a, 007-P1)
- Reference documentation artifacts (001-P1, 001-P5, 001-A1a, 001-A1b, 006-A2a, 006-A2d)
- Graph-metadata modifications (012-A5-2, 012-A5-3, 012-A5-4)
- AGENTS.md rule addition (012-A5-1)

### MEDIUM Testability (Integration Required)

- Pipeline stage artifacts (005-P1, 005-P2, 005-P3, 005-P4, 005-P5)
- Lookup and matching artifacts (007-P2, 007-A3c)
- Approval gate artifacts (010-P4)

### LOW Testability (End-to-End Required)

- Runtime enforcement integration (010-A4d)
- Research confidence formula adaptation (006-A2b)
- Dispatcher integration handshake (006-A2c)
- File summarization integration (001-P4)

---

## Reversibility Assessment

### HIGH Reversibility (Clean Rollback)

- All reference documentation files (cli-devin/references/, cli-opencode/references/)
- All JSON schemas (cli-opencode/assets/, cli-devin/assets/, sk-prompt/assets/)
- Graph-metadata modifications (revert JSON changes)
- AGENTS.md rule addition (text revert)

### MEDIUM Reversibility (Rollback Complex)

- Schema validation with dependent integrations (010-A4a, 007-A3a)
- Function additions to existing code (006-A2b, 006-A2c)

### LOW Reversibility (Rollback Risky)

- Runtime enforcement hook integration (010-A4d)
- Dispatcher integration handshake (006-A2c)

---

## Summary

**Total P0/P1 Artifacts Audited:** 32 artifacts across 6 packets

**HIGH Implementation Risk:** 5 artifacts (010-A4d, 010-A4a, 006-A2b, 006-A2c, 007-A3a)

**Spike Packet Recommendations:** 3 spike packets (runtime enforcement, research confidence, model profile drift)

**Sequencing ADRs Required:** 2 dependency chains (permissions matrix, output verification)

**Testability Weakness:** 4 artifacts require end-to-end testing (010-A4d, 006-A2b, 006-A2c, 001-P4)

**Reversibility Concern:** 2 artifacts have low reversibility (010-A4d, 006-A2c)

**Overall Assessment:** P0/P1 artifacts are implementable with appropriate spike work and sequencing. The highest-risk artifacts are in packet 010 (runtime enforcement) and packet 006 (research output verification). These should be prioritized for spike packets before full implementation.

---

## Citations

- research.md:25-719 (RQ1-4 candidate deltas and deepening artifacts)
- research.md:786-893 (RQ5 architecture verdict and cross-cutting realization)
- research.md:895-918 (Follow-on Packets Index with priority assignments)
- iter-013.md:1-158 (self-audit findings confirming research.md accuracy)
- iter-014.md:171-183 (HYBRID-with-Anchor verdict for sentinel skill)
- iter-015.md:35-130 (priority audit with P0/P1/P2 re-ranking)
- cli-devin/SKILL.md:1-100 (current integration points and runtime environment)
- cli-opencode/SKILL.md:1-100 (current integration points and runtime environment)
