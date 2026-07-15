# Deep-Review Iteration 003

## Dimension

**security** — Depth focus on permissions-gate default-deny semantics, permissions-matrix schema glob safety, fallback-router quota-pool safety, agent-config backward-compat defaults, budget engine input validation, and error-message leakage.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json`
- `.opencode/skills/cli-devin/assets/agent-config-synthesis.json`
- `.opencode/skills/cli-devin/references/context-budget.md`
- `.opencode/skills/cli-devin/assets/per-model-budgets.json`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`

## Security Checks

### Check 1: permissions-gate.ts default-deny semantics

**Status: PASS** — All code paths correctly implement default-deny semantics.

**Evidence:**
- Line 380-382: Returns `allowed: false` if matrix is malformed, empty, or contains invalid rules <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="380-382" />
- Line 395-397: Catch block returns `allowed: false` with `DEFAULT_DENY_REASON` on any thrown error <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="395-397" />
- Line 356: Returns `allowed: false` with `DEFAULT_DENY_REASON` when no rule matches <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="354-356" />
- Line 308: Returns `allowed: false` for unsupported tools <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="306-308" />
- Line 312: Returns `allowed: false` for missing bash command <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="310-312" />
- Line 319: Returns `allowed: false` for missing file path <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="316-319" />
- Line 322: Returns `allowed: false` if symlink resolution fails <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="321-323" />
- Line 193: Symlink depth check returns null if `MAX_SYMLINK_DEPTH` exceeded, leading to default-deny via pathCandidates <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="186-198" />

**Conclusion:** No reachable code path returns ALLOW when no rule matched or on error conditions. Default-deny semantics are correctly implemented throughout.

### Check 2: permissions-matrix.schema.json glob safety

**Status: P1** — Schema lacks explicit broad-scope annotation requirement and deny-precedence enforcement.

**Finding 1: Missing broad-scope annotation for `**` globs**
- **Claim:** The schema allows `**` globs without requiring an explicit `broadScope: true` annotation, which could lead to accidental overly-permissive rules.
- **Evidence:** The `target_glob` property (lines 37-40) has no pattern restriction or annotation requirement for broad globs <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json" lines="37-40" />
- **Counterevidence sought:** Review existing permissions-matrix instances to verify whether `**` globs are currently used without annotation.
- **Alternative explanation:** Broad globs may be intentionally allowed for legitimate repo-wide patterns; the security risk may be mitigated by operational review rather than schema enforcement.
- **Final severity:** P1 (required hardening) — missing input validation at trust boundary.
- **Confidence:** 0.8
- **Downgrade trigger:** If operational review confirms all `**` usage is audited and documented, downgrade to P2.

**Finding 2: Missing deny-precedence semantic check**
- **Claim:** The schema does not enforce that `deny` rules take precedence over `allow` rules, relying only on runtime specificity ordering.
- **Evidence:** The schema defines `effect` as a simple enum (lines 62-68) with no semantic constraint or precedence field <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json" lines="62-68" />
- **Counterevidence sought:** Verify that runtime specificity ordering in permissions-gate.ts correctly handles deny/allow precedence.
- **Alternative explanation:** Specificity-based ordering may be sufficient if deny rules are always authored with higher specificity than allow rules.
- **Final severity:** P1 (required hardening) — schema gap for security-critical semantic.
- **Confidence:** 0.7
- **Downgrade trigger:** If runtime implementation guarantees deny-precedence through specificity or explicit checks, downgrade to P2.

**Finding 3: No absolute root glob restriction**
- **Claim:** The schema does not prevent absolute `/` root globs that could bypass scope-locking.
- **Evidence:** No pattern restriction on `target_glob` that would reject absolute paths starting with `/` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json" lines="37-40" />
- **Counterevidence sought:** Review whether runtime path normalization in permissions-gate.ts mitigates absolute path risks.
- **Alternative explanation:** Runtime path resolution may normalize absolute paths relative to repo root, reducing the risk.
- **Final severity:** P1 (required hardening) — missing input validation at trust boundary.
- **Confidence:** 0.6
- **Downgrade trigger:** If runtime path normalization effectively constrains absolute paths to repo scope, downgrade to P2.

### Check 3: fallback-router.ts quota-pool safety

**Status: P1** — Missing explicit validation for undefined quota_pool fields.

**Finding: Missing quota_pool undefined check**
- **Claim:** The code does not explicitly handle the case where `quota_pool` is undefined on either source or target model, which could lead to undefined behavior or same-pool fallback bypass.
- **Evidence:** Line 63-68 checks equality of quota_pool values but does not validate they are defined first <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts" lines="63-68" />
- **Counterevidence sought:** Verify whether TypeScript type system enforces quota_pool presence at compile time.
- **Alternative explanation:** The type definition at line 19 marks quota_pool as required, so undefined values should be caught at compile time.
- **Final severity:** P1 (required hardening) — missing input validation at trust boundary.
- **Confidence:** 0.6
- **Downgrade trigger:** If TypeScript strict null checks guarantee quota_pool is never undefined at runtime, downgrade to P2.

**Positive findings:**
- Line 41-46: Returns fail-fast if failedModel is undefined <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts" lines="41-46" />
- Line 48-53: Returns fail-fast if fallback_target is null <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts" lines="48-53" />
- Line 56-61: Returns fail-fast if targetModel is undefined <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts" lines="56-61" />
- Line 63-68: Explicitly rejects same-pool fallback <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts" lines="63-68" />

### Check 4: agent-config recipe backward-compat defaults

**Status: PASS** — All three recipes have correct backward-compat defaults.

**Evidence:**
- `agent-config-deep-research-iter.json` line 13: `verification_enabled: false` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json" lines="13-14" />
- `agent-config-deep-research-iter.json` line 15: `bayesian_scoring_enabled: false` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json" lines="15-16" />
- `agent-config-deep-research-iter.json` line 17: `fallback_chain: []` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json" lines="17-18" />
- `agent-config-deep-review-iter.json` line 13: `verification_enabled: false` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json" lines="13-14" />
- `agent-config-deep-review-iter.json` line 15: `bayesian_scoring_enabled: false` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json" lines="15-16" />
- `agent-config-deep-review-iter.json` line 17: `fallback_chain: []` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json" lines="17-18" />
- `agent-config-synthesis.json` line 13: `verification_enabled: false` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-synthesis.json" lines="13-14" />
- `agent-config-synthesis.json` line 15: `bayesian_scoring_enabled: false` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-synthesis.json" lines="15-16" />
- `agent-config-synthesis.json` line 17: `fallback_chain: []` <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/agent-config-synthesis.json" lines="17-18" />

**Conclusion:** All backward-compat absolute defaults are correctly set across all three recipes.

### Check 5: input validation in budget engine

**Status: P2** — Documentation gap for unknown model handling.

**Finding: Unknown model name behavior not documented**
- **Claim:** The context-budget.md reference does not specify what happens if a model name is unknown (default budget? error?).
- **Evidence:** The reference checklist (lines 304-313) specifies which models to accept or reject but does not document the runtime behavior for unknown model names <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/references/context-budget.md" lines="304-313" />
- **Counterevidence sought:** Verify whether runtime budget lookup code has explicit unknown-model handling.
- **Alternative explanation:** This may be intentional — the reference is advisory until a runtime prompt-pack builder consumes the JSON, as noted in line 266.
- **Final severity:** P2 (advisory) — docs ambiguous about a security property.
- **Confidence:** 0.7
- **Downgrade trigger:** If runtime implementation explicitly handles unknown models with a clear error path, downgrade to deferred.

**Positive findings:**
- `per-model-budgets.json` uses integer values for all numeric fields, no negative integers <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/per-model-budgets.json" lines="1-72" />
- No prototype-pollution-prone keys (e.g., `__proto__`, `constructor`) in the JSON structure <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/per-model-budgets.json" lines="1-72" />
- Optional stubs use `null` for unverified context_length rather than omitting the field <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-devin/assets/per-model-budgets.json" lines="51-70" />

### Check 6: error-message leakage

**Status: P1** — Multiple error messages leak filesystem paths.

**Finding 1: iteration_file_missing includes full path**
- **Claim:** Error message for missing iteration file includes the full filesystem path in the details field.
- **Evidence:** Line 341 returns `reason: 'iteration_file_missing', details: input.iterationFile` with the full path <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts" lines="340-342" />
- **Counterevidence sought:** Determine whether these error messages are user-facing or internal-only logs.
- **Alternative explanation:** If these errors are only logged internally and never exposed to end users, the security impact is reduced.
- **Final severity:** P1 (required hardening) — error message leaking filesystem structure.
- **Confidence:** 0.7
- **Downgrade trigger:** If verified these errors are internal-only and never exposed to users, downgrade to P2.

**Finding 2: iteration_file_empty includes full path**
- **Claim:** Error message for empty iteration file includes the full filesystem path.
- **Evidence:** Line 345 returns `reason: 'iteration_file_empty', details: input.iterationFile` with the full path <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts" lines="344-346" />
- **Counterevidence sought:** Same as Finding 1.
- **Alternative explanation:** Same as Finding 1.
- **Final severity:** P1 (required hardening) — error message leaking filesystem structure.
- **Confidence:** 0.7
- **Downgrade trigger:** Same as Finding 1.

**Finding 3: delta_file_missing includes full path**
- **Claim:** Error message for missing delta file includes the full filesystem path.
- **Evidence:** Line 416 returns `reason: 'delta_file_missing', details: input.deltaFilePath` with the full path <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts" lines="415-417" />
- **Counterevidence sought:** Same as Finding 1.
- **Alternative explanation:** Same as Finding 1.
- **Final severity:** P1 (required hardening) — error message leaking filesystem structure.
- **Confidence:** 0.7
- **Downgrade trigger:** Same as Finding 1.

**Finding 4: delta_file_empty includes full path**
- **Claim:** Error message for empty delta file includes the full filesystem path.
- **Evidence:** Line 419 returns `reason: 'delta_file_empty', details: input.deltaFilePath` with the full path <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts" lines="418-420" />
- **Counterevidence sought:** Same as Finding 1.
- **Alternative explanation:** Same as Finding 1.
- **Final severity:** P1 (required hardening) — error message leaking filesystem structure.
- **Confidence:** 0.7
- **Downgrade trigger:** Same as Finding 1.

**Finding 5: delta_file_missing_iteration_record includes full path**
- **Claim:** Error message for missing iteration record in delta file includes the full filesystem path.
- **Evidence:** Line 427 returns `reason: 'delta_file_missing_iteration_record', details: ${input.deltaFilePath} has no record...` with the full path <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts" lines="424-428" />
- **Counterevidence sought:** Same as Finding 1.
- **Alternative explanation:** Same as Finding 1.
- **Final severity:** P1 (required hardening) — error message leaking filesystem structure.
- **Confidence:** 0.7
- **Downgrade trigger:** Same as Finding 1.

**Positive findings:**
- No `process.env` usage found in any of the reviewed TS files <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="1-417" />
- `bayesian-scorer.ts` throws generic `RangeError` messages without path information <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts" lines="9-32" />
- `permissions-gate.ts` uses `sanitizePathForReason` to strip absolute paths before including them in allow/deny reason messages <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts" lines="162-165" />

## Findings by Severity

### P0 (exploitable defect)
None.

### P1 (required hardening)
1. **permissions-matrix.schema.json** — Missing broad-scope annotation requirement for `**` globs (confidence: 0.8)
2. **permissions-matrix.schema.json** — Missing deny-precedence semantic check in schema (confidence: 0.7)
3. **permissions-matrix.schema.json** — No absolute root glob restriction (confidence: 0.6)
4. **fallback-router.ts** — Missing explicit validation for undefined quota_pool fields (confidence: 0.6)
5. **post-dispatch-validate.ts** — Error message leaks full path for iteration_file_missing (confidence: 0.7)
6. **post-dispatch-validate.ts** — Error message leaks full path for iteration_file_empty (confidence: 0.7)
7. **post-dispatch-validate.ts** — Error message leaks full path for delta_file_missing (confidence: 0.7)
8. **post-dispatch-validate.ts** — Error message leaks full path for delta_file_empty (confidence: 0.7)
9. **post-dispatch-validate.ts** — Error message leaks full path for delta_file_missing_iteration_record (confidence: 0.7)

### P2 (advisory)
1. **context-budget.md** — Unknown model name behavior not documented (confidence: 0.7)

## Traceability Checks

Deferred to traceability dimension iterations.

## Verdict

**CONDITIONAL** — Security dimension identifies 9 P1 findings and 1 P2 advisory across schema validation, input validation, and error-message leakage. The core default-deny semantics in permissions-gate.ts are correctly implemented, and backward-compat defaults in agent-config recipes are correct. However, the permissions-matrix schema lacks explicit broad-scope and deny-precedence guards, fallback-router does not explicitly validate quota_pool is defined, and post-dispatch-validate leaks filesystem paths in error messages.

## Next Dimension

Iteration 4 will focus on **traceability** — verifying that all shipped code, schema, and recipe artifacts have clear provenance links to their originating spec.md requirements and implementation-summary.md entries.
