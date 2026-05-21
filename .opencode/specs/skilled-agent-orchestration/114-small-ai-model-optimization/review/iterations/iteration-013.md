# Iteration 13 — Schema-Layer Defense-in-Depth

**Review Iteration:** 13 of 20
**Mode:** review
**Dimension:** schema-layer defense-in-depth
**Running:** P0=0, P1=2, P2=13

## Check 1: Schema Enforcement of Deny-Precedence

### Evidence

Read `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` (lines 1-79):

- **No `uniqueItems` constraint** on the `rules` array (line 22-26)
- **No semantic constraint** on rule ordering or deny-before-allow precedence
- Schema only enforces structural constraints: types, required fields, enum values
- The description mentions "first-in-array breaks equal-specificity ties" (line 24) but this is documentation, not a schema constraint

### Example Matrix Analysis

Read three example matrices:

1. `permissions-matrix.example-readonly.json` (lines 1-174)
2. `permissions-matrix.example-packet-local.json` (lines 1-258)  
3. `permissions-matrix.example-repo-wide.json` (lines 1-237)

**Finding:** All three examples follow deny-before-allow convention for same-specificity rules:
- Example-readonly: Denies `sed -i*`, `rm*`, `mv`, `cp`, package managers, then allows broader patterns
- Example-packet-local: Same pattern - specific denies before broader allows
- Example-repo-wide: Denies `.git/**`, `node_modules/**`, `~/.config/**` before allowing `.opencode/**`

**However:** This is convention only, NOT schema-enforced. A malicious matrix could reverse the order and the schema would accept it.

### Verdict

**Schema does NOT enforce deny-precedence.** The JSON Schema is purely structural and cannot express semantic ordering constraints. This is a known limitation of JSON Schema.

**Security Implication:** P1-F2 (allow-before-deny ordering bypass) remains exploitable at the schema layer. The schema cannot catch this bug.

---

## Check 2: Schema Enforcement of Absolute-Path Globs

### Evidence

Schema `target_glob` definition (lines 37-41):

```json
"target_glob": {
  "type": "string",
  "minLength": 1,
  "description": "Glob for the tool target. File operations use path globs; Bash operations use Exec(<command>) targets such as Exec(rg) or Exec(rm)."
}
```

**Finding:** 
- **No `pattern` constraint** on `target_glob`
- No regex pattern to reject paths starting with `/`
- No constraint to enforce repo-relative paths

### Example Matrix Analysis

All example matrices use repo-relative globs:
- `.opencode/**`, `.git/**`, `node_modules/**`, `~/.config/**`
- No examples use absolute paths starting with `/`

**However:** Again, this is convention only. The schema would accept `/etc/passwd` as a valid `target_glob`.

### Verdict

**Schema does NOT reject absolute-path globs.** No pattern constraint exists to prevent paths starting with `/`.

**Security Implication:** P1-F3 (absolute-path escape) remains exploitable at the schema layer. The schema cannot catch this bug.

---

## Check 3: Validator Layer Between Schema and Runtime

### Evidence

Searched for Ajv/validator usage in cli-opencode and system-spec-kit:

**cli-opencode:**
- `permissions-matrix.md` (lines 272, 302-304) documents manual Ajv validation:
  ```bash
  npx ajv validate -s permissions-matrix.schema.json -d <matrix>
  ```
- This is a **manual documentation step**, not an automated runtime gate

**system-spec-kit:**
- `package-lock.json` includes Ajv as a dependency (13 matches)
- No imports of Ajv in `permissions-gate.ts`
- `permissions-gate.ts` only has runtime TypeScript type guards:
  - `isPermissionsMatrix()` (lines 58-62)
  - `isPermissionRule()` (lines 64-74)
  - These check structure, not semantic constraints

**Integration Status:**
- `permissions-gate.ts` is **NOT imported** anywhere in the codebase except its test file
- Grep for `evaluatePreDispatchToolCalls` found only the definition in permissions-gate.ts and test usage
- The permissions gate is **not yet integrated** into the deep-loop dispatch pipeline

### Verdict

**No automated validator layer exists.** Schema validation is a manual documentation step, not an enforced gate. The permissions gate itself is not yet integrated into the runtime.

**Security Implication:** Both P1s remain exploitable because:
1. Schema is permissive (no semantic constraints)
2. No automated validator enforces schema before runtime
3. Permissions gate is not integrated into the dispatch pipeline

---

## Check 4: Runtime Mitigation Paths

### Evidence

Since `permissions-gate.ts` is not integrated, there are no real callers to analyze. However, examining the gate implementation itself:

**Path Normalization in permissions-gate.ts:**
- `normalizeSeparators()` (lines 80-82) - converts `\` to `/`
- `expandHome()` (lines 84-88) - expands `~` to home directory
- `pathCandidates()` (lines 223-243) - generates multiple path representations:
  - Absolute path
  - Relative to CWD
  - Relative to repo root
  - Relative to `.opencode/` index

**Critical Gap:** No function rejects absolute paths in `target_glob` matching. The `globMatches()` function (lines 142-144) will match any glob against any target, including absolute paths.

**No Call-Site Normalization:** Since the gate is not integrated, there are no call sites that normalize paths before dispatch.

### Verdict

**No runtime mitigation exists.** The permissions-gate.ts implementation does not reject absolute-path globs, and since it's not integrated, there are no call-site mitigations.

**Security Implication:** P1-F3 (absolute-path escape) has no mitigation at the call-site layer.

---

## Overall Verdict

### Schema-Layer Defense Assessment

| Check | Result | Security Impact |
|-------|--------|-----------------|
| Deny-precedence enforcement | ❌ Not possible in JSON Schema | P1-F2 remains exploitable |
| Absolute-path rejection | ❌ No pattern constraint | P1-F3 remains exploitable |
| Automated validator | ❌ Manual documentation only | Both P1s remain exploitable |
| Runtime integration | ❌ Gate not integrated | Both P1s remain exploitable |

### Root Cause Analysis

1. **JSON Schema limitation:** JSON Schema cannot express semantic ordering constraints (deny-before-allow precedence)
2. **Schema permissiveness:** No pattern constraints on `target_glob` to reject absolute paths
3. **Missing validator layer:** Ajv validation is documented as a manual step, not automated
4. **Incomplete integration:** permissions-gate.ts exists but is not imported into the deep-loop pipeline

### Confidence

**High confidence (95%)** that schema-layer defense-in-depth does NOT mitigate either P1:
- Schema structure is clear and permissive
- Documentation confirms manual-only validation
- Code search confirms permissions-gate.ts is not integrated
- Runtime code analysis shows no absolute-path rejection

### Downgrade Triggers

**None.** Both P1s remain at current severity because:
- No schema constraint can catch F2 (JSON Schema limitation)
- No schema constraint exists for F3 (missing pattern constraint)
- No automated validator enforces the schema
- Permissions gate is not integrated into runtime

### Next Focus

**Iteration 14:** Test the permissions-gate.ts integration hypothesis. If the gate is meant to be integrated but isn't, this is a P0 deployment gap. Investigate:
- Is there an open spec/issue tracking permissions-gate integration?
- Should the gate be integrated into deep-loop dispatch?
- If integration is planned, what's the timeline?
- If integration is NOT planned, why does the code exist?

This will determine whether we have a P0 deployment gap (security code written but not deployed) or whether the P1s are accepted risks pending future integration.