# Iteration 017 — Risk Audit: Post-Implementation Failure Modes

**Iteration:** 17 of 20
**Focus:** RISK AUDIT — Post-implementation failure modes for P0/P1 artifacts
**Status:** Insight
**New Info Ratio:** 0.15

---

## Focus

Per-artifact risk audit focused on POST-IMPLEMENTATION failure modes (what goes wrong AFTER the delta lands in production). For each P0/P1 artifact (focus 10-15 most-impactful), assess:
- Worst-case failure mode AFTER implementation
- Detection latency (immediate exception, next iter, user feedback, silent forever)
- Blast radius (single-user / single-session / single-skill / cross-skill / repo-wide)
- Existing mitigations available (memory rules, validator checks, sk-code patterns)
- New mitigations recommended (CI checks, schema validation, monitoring hooks)

Cross-cutting concerns:
- Does the HYBRID-with-Anchor sentinel skill introduce new failure modes (e.g. stale pattern-index when actual patterns move)?
- Does the permissions-matrix schema have any escape hatch that could re-enable RM-8 class incidents?
- Does the model-profile registry create a SPOF for cli-* skills if the registry has a typo?

---

## Actions Taken

1. **Read research.md §RQ1-4 deltas** to understand artifact scope and integration points
2. **Read iter-016 implementability table** to identify 32 P0/P1 artifacts and 5 HIGH-risk candidates
3. **Read RM-8 incident document** (destructive_scope_violations.md) to understand failure-pattern precedent
4. **Read cli-devin/SKILL.md** to understand existing ALWAYS rules and constraint surface
5. **Analyzed each HIGH-risk artifact** for post-implementation failure modes, detection latency, blast radius, and mitigations
6. **Compiled risk audit table** with risk scores (1-10) and mitigation recommendations

---

## Risk Audit Table

| Artifact | RQ | Packet | Worst-Case Failure Mode | Detection Latency | Blast Radius | Existing Mitigations | New Mitigations | Risk Score (1-10) |
|---|---|---|---|---|---|---|---|---|
| **010-A4d: Runtime Enforcement Design** | RQ4 | 010 | Pre-tool-call hook silently fails to load, allowing destructive operations without blocking | Silent until user reports data loss | Cross-skill (all cli-opencode dispatches) | RM-8 Layers 1-3 (prompt hardening, worktree isolation, commit safety) | CI hook-load check + production monitoring for hook failures | **9** |
| **010-A4a: Permissions-Matrix Schema** | RQ4 | 010 | Schema validation too permissive, allows permission strings that bypass deny rules | Next iter (when invalid perm string used) | Cross-skill (all cli-opencode dispatches) | RM-8 Layer 1 (BANNED OPERATIONS prompt guard) | Adversarial schema test suite + runtime perm-string validation | **8** |
| **006-A2c: Post-Dispatch-Validate Integration** | RQ2 | 006 | Integration handshake breaks dispatcher error handling, preventing all research iterations from completing | Immediate (next research dispatch fails) | Cross-skill (all deep-loop workflows) | Existing dispatcher error handling | Integration handshake health check + fallback to no-op mode | **8** |
| **006-A2b: Confidence-Scoring Rubric Formula** | RQ2 | 006 | Formula adaptation incorrect, ships low-quality research or hard-fails valid work | User feedback (research quality complaints) | Cross-skill (all deep-loop research outputs) | Existing manual review process | Formula validation against sample outputs + threshold monitoring | **7** |
| **007-A3a: Model-Profile JSON Schema** | RQ3 | 007 | 8-model profile data drifts from actual model specs, causing inconsistent behavior across CLI skills | User feedback (model behavior mismatches) | Cross-skill (cli-devin + cli-opencode) | Manual profile updates | Automated profile validation against provider APIs + drift alerts | **7** |
| **010-P5: Structured Permissions Matrix** | RQ4 | 010 | Permission string parsing bug allows bypass of deny rules | Next iter (when bypass triggered) | Cross-skill (all cli-opencode dispatches) | RM-8 Layer 1 (BANNED OPERATIONS prompt guard) | Perm-string parser unit tests + adversarial injection tests | **7** |
| **005-P1: Multi-Stage Verification Pipeline** | RQ2 | 005 | Pipeline stage dependencies incorrect (e.g., execute before compile), causing false positives | Immediate (pipeline integration test) | Single-skill (cli-devin verification) | Existing sk-code verification patterns | Pipeline dependency validation + stage ordering tests | **6** |
| **005-P4: Hard-Fail Gatekeeper** | RQ2 | 005 | Hard-fail logic too aggressive, blocking valid work | User feedback (work blocked incorrectly) | Single-skill (cli-devin deep-loop) | Existing deep-loop iter contract | Gatekeeper threshold tuning + override mechanism | **6** |
| **012-A5-4: Sentinel Skill Creation** | RQ5 | 012 | Sentinel skill fails to load due to missing SKILL.md fields, breaking advisor routing | Immediate (advisor routing fails) | Cross-skill (all skills using advisor) | Advisor skill loading validation | Sentinel skill health check + fallback routing | **6** |
| **001-P4: File Summarization Threshold** | RQ1 | 001 | Summarization integration point missing in cli-devin workflow, threshold never triggers | Silent (no summarization occurs) | Single-skill (cli-devin) | Existing file read patterns | Integration point smoke test + summarization coverage check | **5** |
| **010-P4: Write-Operation Approval Gate** | RQ4 | 010 | Approval gate bypassed by --dangerously-skip-permissions flag | Immediate (flag usage detected) | Cross-skill (all cli-opencode dispatches) | RM-8 Layer 2 (worktree isolation) | Flag-usage monitoring + approval-gate enforcement audit | **5** |
| **007-P2: Profile Lookup with Substring Matching** | RQ3 | 007 | Substring matching too permissive, returning wrong profile | User feedback (wrong model behavior) | Single-session (specific dispatch) | Profile lookup tests | Lookup accuracy tests + substring-match strictness validation | **5** |
| **001-P2: Tool Result Truncation** | RQ1 | 001 | Char-to-token approximation inaccurate for non-ASCII text, causing context budget violations | Next iter (context overflow) | Single-session (specific dispatch) | Existing context budget patterns | Multilingual truncation tests + token-count validation | **4** |
| **005-P2: Structural Validation with Auto-Fix** | RQ2 | 005 | Auto-fix logic introduces new syntax errors | Immediate (validation fails) | Single-skill (cli-opencode) | Existing anti-hallucination patterns | Auto-fix test suite + rollback on validation failure | **4** |
| **012-A5-2: Enhances-Edge Wiring** | RQ5 | 012 | Edge weights incorrect, causing advisor routing failures | User feedback (routing incorrect) | Cross-skill (all skills using advisor) | Advisor scoring simulation | Edge-weight validation + advisor routing test suite | **4** |

---

## Cross-Cutting Concerns

### HYBRID-with-Anchor Sentinel Skill Staleness

**Concern:** The sentinel skill (012-A5-4) serves as the HYBRID-with-Anchor pattern for routing to small-model pattern references. If the pattern-index becomes stale (actual patterns move but sentinel skill references old paths), advisor routing breaks.

**Worst-Case Failure:** Sentinel skill references outdated paths, causing all small-model pattern lookups to fail silently or return 404s. Users lose access to context-budget, verification, and permissions patterns.

**Detection Latency:** User feedback (pattern lookup fails) or advisor routing health check.

**Blast Radius:** Cross-skill (all CLI skills using advisor for small-model pattern routing).

**Existing Mitigations:** Advisor skill loading validation (skill loads via advisor), graph-metadata enhances-edge verification.

**New Mitigations:**
- CI check: Validate all paths in sentinel skill SKILL.md exist at reference-time
- Monitoring hook: Advisor routing health check with 404 detection
- Schema validation: Sentinel skill SKILL.md must include path-verification section

**Risk Score:** 6 (medium-high impact, medium detection latency)

---

### Permissions-Matrix Schema Escape Hatches

**Concern:** The permissions-matrix schema (010-A4a) is the foundation for RM-8 prevention. If the schema has escape hatches (e.g., wildcard permissions, overly permissive regex patterns), RM-8 class incidents could re-emerge.

**Worst-Case Failure:** Schema allows permission string like "*" or ".*" that bypasses all deny rules, enabling destructive operations without blocking. This recreates the RM-8 incident condition.

**Detection Latency:** Silent until destructive operation occurs (data loss).

**Blast Radius:** Cross-skill (all cli-opencode dispatches with permissions matrix).

**Existing Mitigations:** RM-8 Layers 1-3 (prompt hardening, worktree isolation, commit safety), schema validation tests.

**New Mitigations:**
- Adversarial schema test suite: Include test cases for wildcard, regex, and bypass patterns
- Runtime permission-string validation: Block known escape patterns at runtime
- Schema lint rule: CI check for forbidden patterns in schema definitions
- Monitoring hook: Alert on permission-string usage patterns that match escape hatches

**Risk Score:** 8 (high impact, silent failure, cross-skill blast radius)

---

### Model-Profile Registry SPOF

**Concern:** The model-profile registry (007-A3a) is cross-cutting infrastructure used by both cli-devin and cli-opencode. If the registry has a typo (e.g., wrong context window, incorrect feature flags), both CLI skills inherit incorrect behavior.

**Worst-Case Failure:** Registry typo causes wrong context window for SWE-1.6 (e.g., 8192 instead of 200k), leading to aggressive truncation and poor model performance. Or wrong permission flags for DeepSeek-v4, causing permission bypass.

**Detection Latency:** User feedback (model performance degradation) or profile validation alert.

**Blast Radius:** Cross-skill (cli-devin + cli-opencode).

**Existing Mitigations:** Manual profile updates, profile validation against specs.

**New Mitigations:**
- Automated profile validation: CI check against model provider APIs before merge
- Profile versioning: Schema includes version field for rollback capability
- Drift detection: Monitoring hook comparing registry values against provider APIs weekly
- Registry health check: Startup validation in cli-devin/cli-opencode loading

**Risk Score:** 7 (high impact, medium detection latency, cross-skill blast radius)

---

## Recommended Pre-Implementation Checks

### CI Validators

1. **Schema Validation Lint Rule**
   - Check: All JSON schemas validate against strict JSON Schema Draft 7
   - Check: No wildcard patterns ("*", ".*") in permission strings
   - Check: All paths in reference docs exist at file-system level
   - Implementation: Add to .opencode/skills/system-spec-kit/scripts/spec/validate.sh

2. **Profile Validation Check**
   - Check: Model-profile registry validates against provider APIs
   - Check: Context windows match current provider specs
   - Check: Feature flags match current model capabilities
   - Implementation: Add to packet 007 as 007-A3b (automated validation)

3. **Hook Load Validation**
   - Check: Runtime enforcement hook loads successfully in cli-opencode
   - Check: Hook failure mode is deny-by-default
   - Check: Hook integration point stable across cli-opencode versions
   - Implementation: Add to packet 010 as 010-A4e (hook load validation)

### Schema Validation

1. **Adversarial Schema Test Suite**
   - Test: Permission string bypass patterns (wildcards, regex, injection)
   - Test: Edge-case tool categories not in enum
   - Test: Invalid permission strings that should fail validation
   - Implementation: Add to packet 010 as 010-A4f (adversarial schema tests)

2. **Pipeline Dependency Validation**
   - Test: Stage ordering enforced (compile before execute)
   - Test: Conditional execution dependencies correct
   - Test: Hard-fail triggers at appropriate confidence thresholds
   - Implementation: Add to packet 005 as 005-P6 (pipeline validation tests)

### Monitoring Hooks

1. **Advisor Routing Health Check**
   - Monitor: 404 rate on pattern lookups via sentinel skill
   - Monitor: Advisor routing success/failure rate
   - Monitor: Edge-weight distribution anomalies
   - Implementation: Add to system-skill-advisor as monitoring hook

2. **Permission-String Usage Monitoring**
   - Monitor: Permission strings matching escape patterns
   - Monitor: Permission-string validation failure rate
   - Monitor: Approval-gate bypass attempts
   - Implementation: Add to cli-opencode as runtime monitoring

3. **Profile Drift Detection**
   - Monitor: Weekly comparison of registry values vs provider APIs
   - Monitor: Context window changes in provider specs
   - Monitor: Feature flag changes in model capabilities
   - Implementation: Add to packet 007 as 007-A3d (drift detection)

---

## Summary

**Total P0/P1 Artifacts Audited:** 15 most-impactful artifacts from 32 total

**Highest Risk Scores (8-9):**
- 010-A4d: Runtime Enforcement Design (9)
- 010-A4a: Permissions-Matrix Schema (8)
- 006-A2c: Post-Dispatch-Validate Integration (8)

**High Risk Scores (7):**
- 006-A2b: Confidence-Scoring Rubric Formula (7)
- 007-A3a: Model-Profile JSON Schema (7)
- 010-P5: Structured Permissions Matrix (7)

**Cross-Cutting Risk Scores:**
- HYBRID-with-Anchor staleness: 6
- Permissions-matrix escape hatches: 8
- Model-profile registry SPOF: 7

**Critical Mitigation Priorities:**
1. Runtime enforcement hook load validation (010-A4e)
2. Adversarial schema test suite (010-A4f)
3. Profile drift detection (007-A3d)
4. Advisor routing health check
5. Permission-string usage monitoring

**Overall Assessment:** The highest-risk artifacts are in packet 010 (runtime enforcement and permissions matrix) and packet 006 (research output verification). These require CI validators, schema validation, and monitoring hooks before implementation. Cross-cutting concerns (sentinel staleness, permissions escape hatches, profile SPOF) need monitoring hooks and automated validation to prevent silent failures.

---

## Citations

- research.md:25-719 (RQ1-4 candidate deltas and deepening artifacts)
- research.md:786-893 (RQ5 architecture verdict and cross-cutting realization)
- iter-016.md:36-71 (implementability audit table with 32 P0/P1 artifacts)
- iter-016.md:74-117 (implementation-risk flags for HIGH-risk artifacts)
- destructive_scope_violations.md:12-56 (RM-8 incident: 44 files deleted, root cause analysis)
- destructive_scope_violations.md:60-100 (RM-8 prevention: Layers 1-4 mitigation strategy)
- cli-devin/SKILL.md:12-17 (CRITICAL: Self-invocation prohibition)
- cli-devin/SKILL.md:188-193 (SWE-1.6 prompt-quality contract)
- cli-devin/SKILL.md:230-233 (Permission-mode taxonomy: auto vs dangerous)
