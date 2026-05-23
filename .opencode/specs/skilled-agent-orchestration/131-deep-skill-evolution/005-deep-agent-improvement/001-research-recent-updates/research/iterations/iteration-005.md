# RCAF DEEP RESEARCH — ITERATION 5 — ADVERSARIAL SWEEP ON DEEP-AGENT-IMPROVEMENT

## ROLE
Adversarial reviewer. Probe deep-agent-improvement's actual code + docs + asset templates for hidden defects. P0/P1/P2 with file:line evidence.

## CONTEXT

Iter 5 of 10. Prior:
- Iter-1..3: cataloged 36 patterns; 8 APPLY + 4 ALREADY-DONE-confirmed
- Iter-4: 7 DAI-specific gaps (DAI-001..007)

Cumulative actionable: ~13-15 items pending adversarial sweep + adjudication.

This iter focuses on **adversarial review of actual deep-agent-improvement code/docs** to find defects iters 1-4's mapping/gap surveys wouldn't catch.

## FINDINGS

### DAI-008: Stale MCP tool references in SKILL.md (P1)

**File:** `.opencode/skills/deep-agent-improvement/SKILL.md`
**Lines:** 287-299 (Journal Wiring Contract section)

**Defect:** The SKILL.md documents the CLI contract for `improvement-journal.cjs` but contains no actual MCP tool references from arc 118. However, the documentation describes the CLI interface as if it were the primary interface, when in fact the YAML workflows should be using direct script invocation rather than MCP tools.

**Evidence:**
```markdown
## Journal Wiring Contract

Journal emission is orchestrator-only. The target agent being evaluated never writes journal rows directly; only the visible YAML workflow or an operator-side wrapper invokes `scripts/improvement-journal.cjs`.

The CLI contract is:

```bash
node .opencode/skills/deep-agent-improvement/scripts/improvement-journal.cjs --emit <eventType> --journal <journal_path> --details '<json>'
```
```

**Impact:** The documentation is technically correct but misleading - it emphasizes CLI usage when the primary path is YAML workflow script invocation. This could confuse operators trying to understand the integration path.

**Recommendation:** Add a note clarifying that YAML workflows use direct script invocation via bash commands, and the CLI interface is primarily for manual testing or operator-side scripts.

---

### DAI-009: Missing error handling in score-candidate.cjs profile generation (P0)

**File:** `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs`
**Lines:** 342-358

**Defect:** When `generate-profile.cjs` fails, the script exits with a generic error but doesn't distinguish between different failure modes (file not found vs parse error vs profile generation error). This makes debugging difficult.

**Evidence:**
```javascript
const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
if (!profile || !profile.id) {
  const failure = {
    status: 'infra_failure',
    evaluationMode: 'dynamic-5d',
    target: targetPath,
    candidate: candidatePath,
    error: 'Failed to generate dynamic profile',
    failureModes: ['profile-generation-failure'],
  };
  // ... exit
}
```

**Impact:** Operators cannot distinguish between:
- Agent file not found
- Agent file unreadable
- Profile generation script crashed
- Profile generation returned invalid JSON

**Recommendation:** Propagate the actual error from `runScript` or check file existence before invoking the profile generator.

---

### DAI-010: Silent NaN fallback in 5-dimension scoring (P1)

**File:** `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs`
**Lines:** 112-125 (scoreDimStructural)

**Defect:** When `derivedChecks.structural` is empty, the function returns `score: 100` with `maxPossible: 0`. This creates a division-by-zero risk in the weighted score calculation and produces misleading scores.

**Evidence:**
```javascript
function scoreDimStructural(profile, content) {
  const checks = profile.derivedChecks?.structural || [];
  if (checks.length === 0) { return { score: 100, details: [], maxPossible: 0 }; }
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  // ...
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}
```

**Impact:** 
- Returns perfect score (100) when no checks exist
- `maxPossible: 0` makes the score meaningless
- Weighted calculation may produce NaN if not guarded

**Recommendation:** Return `score: 0` or `null` when no checks exist, and ensure the weighted score calculation handles null/undefined dimension scores.

---

### DAI-011: Hardcoded timeout in script execution (P2)

**File:** `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs`
**Lines:** 102-110

**Defect:** The `runScript` function has a hardcoded 15-second timeout for all script invocations, which may be insufficient for complex agents or slow filesystems.

**Evidence:**
```javascript
function runScript(scriptName, args) {
  const scriptPath = path.join(__dirname, scriptName);
  try {
    const out = execFileSync('node', [scriptPath, ...args], { encoding: 'utf8', timeout: 15000 });
    return JSON.parse(out);
  } catch (_err) {
    return null;
  }
}
```

**Impact:** 
- Profile generation for complex agents may timeout
- Integration scanning on large repos may timeout
- Silent failure (returns null) masks timeout errors

**Recommendation:** Make timeout configurable via environment variable or command-line flag, and log timeout errors explicitly.

---

### DAI-012: Missing validation in mutation-coverage signature dedup (P1)

**File:** `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs`
**Lines:** 71-88

**Defect:** The `computeMutationSignature` function does not validate input fields before computing the signature. Missing or null fields could produce identical signatures for different mutations.

**Evidence:**
```javascript
function computeMutationSignature(mutation) {
  const dimension = (mutation.dimension || '').trim();
  const mutationType = (mutation.mutationType || '').trim();
  const targetSection = (mutation.targetSection || '').trim();
  const rawBody = (mutation.body || '').trim();
  const normalizedBody64 = rawBody.replace(/\s+/g, ' ').toLowerCase().slice(0, 64);

  return crypto
    .createHash('sha256')
    .update(dimension)
    .update('\u001f')
    .update(mutationType)
    .update('\u001f')
    .update(targetSection)
    .update('\u001f')
    .update(normalizedBody64)
    .digest('hex');
}
```

**Impact:**
- Empty strings for all fields produce the same signature
- Different mutations with missing fields could collide
- No validation that required fields are present

**Recommendation:** Add validation that required fields (dimension, mutationType) are non-empty before computing signature, or return a sentinel value for invalid inputs.

---

### DAI-013: Inconsistent stop reason enum usage (P0)

**File:** `.opencode/skills/deep-agent-improvement/SKILL.md`
**Lines:** 389-392 (Frozen Helper Enums section)

**Defect:** The SKILL.md documents that `plateau` is NOT a valid stop reason and must reconcile to canonical reasons, but the README.md (line 158) mentions `plateau` as a dedicated stop reason.

**Evidence in SKILL.md:**
```markdown
Labels such as `convergedImprovement`, `plateau`, `benchmarkPlateau`, `rejected`, `deferred`, `blocked`, or `errored` are not accepted by the current CLI validator.
```

**Evidence in README.md:**
```markdown
### 3.9 PLATEAU STOP REASON

The stop-reason taxonomy includes a dedicated `plateau` reason so plateau exits are recorded truthfully instead of being falsified as `converged`.
```

**Impact:** Documentation contradiction creates confusion about valid stop reasons. Operators may implement plateau detection incorrectly.

**Recommendation:** Reconcile the documentation - either add `plateau` to the canonical enum in `improvement-journal.cjs` or remove references to it from README.md.

---

### DAI-014: YAML workflow uses incorrect manifest path (P1)

**File:** `.opencode/commands/improve/assets/improve_deep-agent-improvement_auto.yaml`
**Lines:** 106, 165

**Defect:** The YAML workflows reference `target-manifest.jsonc` but the actual file in the skill assets is named `target_manifest.jsonc` (underscore vs hyphen).

**Evidence in YAML:**
```yaml
manifest: "{spec_folder}/improvement/target-manifest.jsonc"
```

**Evidence in skill structure:**
```
.opencode/skills/deep-agent-improvement/assets/target_manifest.jsonc
```

**Impact:** The workflow will fail to find the manifest file, causing initialization failures.

**Recommendation:** Update YAML workflows to use `target_manifest.jsonc` (underscore) to match the actual asset filename.

---

### DAI-015: Missing test coverage for promotion gate boundaries (P2)

**File:** `.opencode/skills/deep-agent-improvement/scripts/tests/` (directory scan)

**Defect:** No test files exist for `promote-candidate.cjs` to verify boundary conditions:
- Threshold delta boundary (exactly at threshold vs below)
- Config validation edge cases
- Manifest canonical target validation

**Evidence:** Directory contains tests for `benchmark-stability`, `candidate-lineage`, `improvement-journal`, `mutation-coverage`, `trade-off-detector` but no `promote-candidate.vitest.ts`.

**Impact:** Promotion logic has complex validation gates but no automated test coverage, increasing risk of promotion bugs.

**Recommendation:** Add test coverage for `promote-candidate.cjs` covering all validation gates and boundary conditions.

---

### DAI-016: Integration scanner path hardcoding (P2)

**File:** `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs`
**Lines:** 114, 134, 150

**Defect:** The scanner hardcodes `.opencode/command` as the command directory path, but the actual structure is `.opencode/commands` (plural).

**Evidence:**
```javascript
function scanFilesByExt(repoRoot, agentName, ext, patternFn) {
  const files = collectFiles(path.join(repoRoot, '.opencode/command'));
  // ...
}
```

**Impact:** Command scanning will fail to find any command files, producing empty command coverage results.

**Recommendation:** Update path to `.opencode/commands` (plural) to match actual directory structure.

---

## SUMMARY

**Total Findings:** 9 defects
- P0: 2 (DAI-009, DAI-013)
- P1: 5 (DAI-008, DAI-010, DAI-012, DAI-014, DAI-016)
- P2: 2 (DAI-011, DAI-015)

**Key Issues:**
1. **Silent failures in scoring** - NaN risks and empty check handling
2. **Documentation contradictions** - stop reason enum mismatch
3. **Path mismatches** - manifest filename and command directory
4. **Missing validation** - signature dedup and promotion gates
5. **Hardcoded timeouts** - no configurability for different environments

## NEXT STEPS

1. Adjudicate findings with deep-agent-improvement maintainer
2. Prioritize P0 fixes for immediate remediation
3. Create follow-up tickets for P1/P2 items
4. Update test coverage for promotion logic
5. Reconcile documentation contradictions
