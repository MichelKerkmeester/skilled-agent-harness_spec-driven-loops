# Iteration 004 — Security Dimension Adjudication

## Dimension

Security (2/4, adjudication pass)

## Files Reviewed

- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-repo-wide.json`
- `.opencode/skills/cli-opencode/references/permissions-matrix.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json`
- `.opencode/skills/system-spec-kit/tsconfig.json`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`

## Adjudication Results

### F1: schema lacks `**` glob annotation

**Test result:** PASS

**Evidence:**
- All 3 example matrices use `**` (example-readonly.json: lines 6, 153, 160, 167; example-packet-local.json: lines 6, 237, 244, 251; example-repo-wide.json: line 6)
- Reference doc `permissions-matrix.md` §9 (lines 276-295) explicitly documents `**` glob smell warning
- Section 9 distinguishes acceptable vs risky shapes and mentions "Phase 003 logs broad-glob warnings as a smoke check"

**Verdict:** DOWNGRADE to P2 — `**` usage is documented in reference doc with rationale and smoke-check logging. Defense-in-depth: operational guidance exists even if schema lacks annotation requirement.

---

### F2: schema lacks deny-precedence semantic check

**Test result:** FAIL

**Evidence:**
- `permissions-gate.ts:326-352` (`findBestRule` function): rule selection relies on specificity comparison (line 345-348) and array order for ties
- Line 346: `if (specificityDelta > 0 || (specificityDelta === 0 && match.index < bestMatch.index))` — first-in-array wins ties
- No explicit deny-precedence check; if allow and deny rules have identical specificity, array order determines winner
- Example risk: `**` with effect:allow before `**` with effect:deny would incorrectly allow

**Verdict:** CONFIRM P1 — runtime does not guarantee deny-precedence. First-match-wins with tiebreaker by array order allows misconfiguration where deny rules are incorrectly placed after allow rules of identical specificity.

---

### F3: no absolute root glob restriction

**Test result:** FAIL

**Evidence:**
- `permissions-gate.ts:200-221` (`resolvePathTarget` function): line 201 calls `path.resolve(expandHome(rawPath))` which accepts absolute paths verbatim
- Line 227-243 (`pathCandidates` function): generates multiple candidate formats (absolute, relative, repo-relative, opencode-relative) but does NOT reject paths outside repoRoot
- Line 232-235: only adds repo-relative path `if (repoRoot && resolved.startsWith(repoRoot))` — this is for matching convenience, not a security constraint
- No check that absolute paths resolve within repoRoot; `/etc/passwd` would pass through to glob matching

**Verdict:** CONFIRM P1 — runtime path normalization does not constrain absolute paths to repo scope. Absolute paths outside repository are accepted and matched against globs, enabling filesystem escape.

---

### F4: fallback-router quota_pool undefined check

**Test result:** PASS

**Evidence:**
- `fallback-router.ts:17-21` (`ModelProfile` type): line 19 declares `readonly quota_pool: string` — required, non-nullable
- `system-spec-kit/tsconfig.json:6` has `"strict": true` which enables strictNullChecks automatically
- TypeScript compile-time enforcement guarantees `quota_pool` is never undefined at runtime

**Verdict:** DOWNGRADE to P2 — defense-in-depth: runtime check is missing but TypeScript type system with strict mode guarantees the field is always defined. Compile-time enforcement catches missing quota_pool.

---

### F5: error message leaks full path for iteration_file_missing

**Test result:** PASS

**Evidence:**
- `post-dispatch-validate.ts:340-342`: returns `{ ok: false, reason: 'iteration_file_missing', details: input.iterationFile }`
- Error details flow to internal state log (JSONL) for deep-loop workflow orchestration
- This is post-dispatch validation (internal gate after agent completes work), not user-facing output
- YAML recipes (e.g., `spec_kit_deep-review_auto.yaml:889-898`) list these as `failure_reasons` for internal classification
- Errors are structured for machine processing in deep-loop reducer, not CLI user output

**Verdict:** DOWNGRADE to P2 — defense-in-depth: path leakage in internal state logs is acceptable. Errors are part of internal workflow orchestration, not exposed to end users. Post-dispatch validation runs after agent completion; paths in logs aid debugging without user exposure.

---

### F6: error message leaks full path for iteration_file_empty

**Test result:** PASS

**Evidence:**
- `post-dispatch-validate.ts:344-346`: returns `{ ok: false, reason: 'iteration_file_empty', details: input.iterationFile }`
- Same context as F5: internal state log for deep-loop orchestration, not user-facing
- Structured error for machine processing in reducer workflow

**Verdict:** DOWNGRADE to P2 — same rationale as F5. Path leakage in internal state logs is acceptable for debugging workflow failures.

---

### F7: error message leaks full path for delta_file_missing

**Test result:** PASS

**Evidence:**
- `post-dispatch-validate.ts:415-417`: returns `{ ok: false, reason: 'delta_file_missing', details: input.deltaFilePath }`
- Same context as F5-F6: internal state log, not user-facing output

**Verdict:** DOWNGRADE to P2 — same rationale as F5-F6. Path leakage in internal state logs is acceptable.

---

### F8: error message leaks full path for delta_file_empty

**Test result:** PASS

**Evidence:**
- `post-dispatch-validate.ts:418-420`: returns `{ ok: false, reason: 'delta_file_empty', details: input.deltaFilePath }`
- Same context as F5-F7: internal state log, not user-facing output

**Verdict:** DOWNGRADE to P2 — same rationale as F5-F7. Path leakage in internal state logs is acceptable.

---

### F9: error message leaks full path for delta_file_missing_iteration_record

**Test result:** PASS

**Evidence:**
- `post-dispatch-validate.ts:424-428`: returns `{ ok: false, reason: 'delta_file_missing_iteration_record', details: \`\${input.deltaFilePath} has no record with type='\${CANONICAL_ITERATION_TYPE}'\` }`
- Same context as F5-F8: internal state log, not user-facing output

**Verdict:** DOWNGRADE to P2 — same rationale as F5-F8. Path leakage in internal state logs is acceptable.

## Net Finding Counts (after adjudication)

- P0: 0 (no change)
- P1: 2 (downgraded from 9)
- P2: 8 (upgraded from 1)

**Summary:** Adjudication confirmed 2 P1 findings (F2, F3) and downgraded 7 findings to P2 (F1, F4-F9). Core security concerns remain in permissions-gate.ts: lack of deny-precedence guarantee and no absolute path constraint to repo scope.

## Verdict (per-iter)

**CONDITIONAL** — Security dimension adjudication reduces 9 P1 to 2 P1. Two confirmed P1 findings represent genuine security gaps in permissions-gate.ts that could allow misconfiguration-based authorization bypass or filesystem escape. Seven downgraded findings represent defense-in-depth gaps where operational controls (documentation, type system, internal-only logging) provide adequate mitigation.

## Next Dimension

Proceed to **correctness** dimension (3/4) — focus on logic errors, incorrect algorithmic implementations, and data integrity issues.
