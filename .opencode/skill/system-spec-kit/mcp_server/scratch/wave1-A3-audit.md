# Wave 1 - A3: sk-code Audit Sprint 3

## Summary
- Files audited: 6
- P0 violations: 12 (2 per file -- systematic header format issue)
- P1 violations: 19 (missing AI-intent x6, bare catch x7, incomplete JSDoc x6)
- Overall compliance: 55/100

### Systemic Issues
1. **ALL 6 files** use ASCII hyphens (`-------`) in file headers and section headers instead of the required Unicode box-drawing character `───`. This is a find-and-replace fix across all files.
2. **ALL 6 files** are missing AI-intent comment tags (AI-WHY, AI-GUARD, AI-INVARIANT, AI-RISK) on non-obvious logic.
3. **2 of 6 files** contain bare `catch {}` blocks without specific error types.
4. **4 of 6 files** have exported functions with JSDoc descriptions but missing `@param`/`@returns` tags.

### What Is Done Well
- P0-2 (no dead code): PASS across all files -- clean, no commented-out blocks.
- P0-3 (naming conventions): PASS across all files -- consistent camelCase functions, UPPER_SNAKE constants, PascalCase types.
- P1-2 (comment density): PASS across all files -- well-balanced, not over-commented.
- Code structure: All files follow a consistent numbered-section pattern with clear separation of concerns.

---

## File-by-File Findings

### 1. query-classifier.ts (209 lines)

**P0:**
- [ ] Header -- Line 1-4: Uses `// -------` (ASCII hyphens) instead of `// ─── MODULE: Query Complexity Classifier ───`
- [x] No dead code -- Clean, no commented-out blocks
- [x] Naming -- camelCase functions, UPPER_SNAKE constants, PascalCase types
- [ ] Section headers -- Lines 6-8, 39-41, 52-54, 82-84, 187-189: Use `/* ------` instead of `/* ─── N. SECTION NAME ─── */`

**P1:**
- [ ] AI-intent comments -- No AI-WHY/AI-GUARD/AI-INVARIANT tags present
- [ ] JSDoc on exports -- Missing `@param`/`@returns` on all exported functions
- [ ] Error handling -- Line 181: bare `catch {}` without error type

**Specific lines to fix:**
- Line 1-4: Replace `// -------...` with `// ─── MODULE: Query Complexity Classifier ───`
- Lines 6-8: Replace `/* ---...` with `/* ─── 1. TYPES & CONSTANTS ─── */`
- Lines 39-41: Replace with `/* ─── 2. FEATURE FLAG ─── */`
- Lines 52-54: Replace with `/* ─── 3. FEATURE EXTRACTION ─── */`
- Lines 82-84: Replace with `/* ─── 4. CLASSIFICATION ─── */`
- Lines 187-189: Replace with `/* ─── 5. EXPORTS ─── */`
- Line 97-98: Add `// AI-WHY: Trigger match is strongest signal for simplicity`
- Line 161-167: Add `// AI-INVARIANT: triggerMatch always overrides term count for simple tier`
- Line 176-177: Add `// AI-WHY: Round to 3 decimal places to avoid floating point noise in outputs`
- Line 181: Change `catch {` to `catch (_error: unknown) {` or `catch (error) {`
- Line 57-60: Add `@param query` and `@returns` to JSDoc
- Line 63-68: Add `@param terms` and `@returns` to JSDoc
- Line 73-76: Add `@param query @param triggerPhrases` and `@returns` to JSDoc
- Lines 117-128: Add `@param query @param triggerPhrases` and `@returns ClassificationResult` to JSDoc

---

### 2. rsf-fusion.ts (405 lines)

**P0:**
- [ ] Header -- Line 1-6: Uses ASCII hyphens instead of Unicode `───`
- [x] No dead code -- Clean
- [x] Naming -- All conventions followed correctly
- [ ] Section headers -- Lines 10-12, 24-26, 63-65, 167-169, 267-269, 377-379, 389-391: ASCII hyphens

**P1:**
- [ ] AI-intent comments -- No AI-WHY/AI-GUARD tags on magic numbers or algorithm choices
- [ ] JSDoc on exports -- 5 of 7 exported functions missing `@param`/`@returns` tags
- [x] Error handling -- Pure computation functions; no bare catch blocks

**Specific lines to fix:**
- Line 1-6: Replace header with `// ─── MODULE: RSF Fusion (Relative Score Fusion) ───`
- All section headers: Replace ASCII `---` with Unicode `───`
- Line 40-42: Add `// AI-WHY: Rank-based fallback ensures items without explicit scores still participate in fusion`
- Line 50: Add `// AI-WHY: When all scores are identical, normalized value is 1.0 (not 0/0) — all items are equally relevant`
- Line 74: Add `// AI-WHY: Single-source penalty 0.5 ensures items confirmed by both sources rank above single-source items`
- Line 139: Add `// AI-WHY: 0.5 penalty for single-source items prevents them from outranking dual-confirmed results`
- Line 250: Add `// AI-WHY: Proportional penalty (countPresent/totalSources) penalizes items missing from more sources more heavily`
- Line 287: Add `// AI-WHY: 0.10 cross-variant bonus rewards convergence — items found across multiple query interpretations are more likely relevant`
- Line 28-32 (extractScore): Add `@param item @param rank @param total` and `@returns`
- Line 46-48 (minMaxNormalize): Add `@param value @param min @param max` and `@returns`
- Line 55-56 (clamp01): Add `@param value` and `@returns`
- Line 67-77 (fuseResultsRsf): Add `@param listA @param listB` and `@returns`
- Line 171-181 (fuseResultsRsfMulti): Add `@param lists` and `@returns`

---

### 3. channel-representation.ts (207 lines)

**P0:**
- [ ] Header -- Line 1-7: ASCII hyphens
- [x] No dead code -- Clean
- [x] Naming -- All conventions correct
- [ ] Section headers -- Lines 9-11, 22-24, 66-68, 79-81, 193-195: ASCII hyphens

**P1:**
- [ ] AI-intent comments -- Missing AI-WHY on QUALITY_FLOOR magic number; NOTE on line 15-16 should use AI-RISK tag
- [x] JSDoc on exports -- `analyzeChannelRepresentation` has full @param/@returns; other exports are constants/interfaces
- [x] Error handling -- No try/catch needed; pure computation with defensive checks

**Specific lines to fix:**
- Line 1-7: Replace header with `// ─── MODULE: Channel Representation (T003a) ───`
- All section headers: Replace ASCII `---` with Unicode `───`
- Line 13-16: Change `NOTE:` to `// AI-RISK: Raw RRF scores (~0.01-0.03) will never reach QUALITY_FLOOR of 0.2...`
- Line 17: Add `// AI-WHY: 0.2 quality floor prevents low-confidence results from being promoted as representatives`

---

### 4. confidence-truncation.ts (228 lines)

**P0:**
- [ ] Header -- Line 1-4: ASCII hyphens
- [x] No dead code -- Clean
- [x] Naming -- All conventions correct
- [ ] Section headers -- Lines 6-8, 41-43, 54-56, 88-90, 207-209: ASCII hyphens

**P1:**
- [ ] AI-intent comments -- No AI-WHY/AI-GUARD/AI-INVARIANT tags
- [ ] JSDoc on exports -- 4 exported functions missing `@param`/`@returns` tags
- [x] Error handling -- No try/catch needed; defensive filtering of NaN/Infinity on line 115

**Specific lines to fix:**
- Line 1-4: Replace header with `// ─── MODULE: Confidence-Based Result Truncation ───`
- All section headers: Replace ASCII `---` with Unicode `───`
- Line 39: Add `// AI-WHY: 2x multiplier chosen to detect "significant" gaps — gaps must be notably larger than typical variation`
- Line 117-118: Add `// AI-GUARD: Defensive sort ensures correct behavior even if caller forgot to pre-sort`
- Line 153-154: Add `// AI-INVARIANT: Zero median gap means all scores are identical — no meaningful truncation point exists`
- Line 58-63 (computeGaps): Add `@param scores` and `@returns`
- Line 74-77 (computeMedian): Add `@param values` and `@returns`
- Line 92-107 (truncateByConfidence): Add `@param results @param options` and `@returns`
- Line 45-48 (isConfidenceTruncationEnabled): Add `@returns`

---

### 5. dynamic-token-budget.ts (113 lines)

**P0:**
- [ ] Header -- Line 1-4: ASCII hyphens
- [x] No dead code -- Clean
- [x] Naming -- All conventions correct
- [ ] Section headers -- Lines 8-10, 42-44, 55-57, 97-99: ASCII hyphens

**P1:**
- [ ] AI-intent comments -- No AI-WHY tags on budget values
- [x] JSDoc on exports -- `getDynamicTokenBudget` has full @param/@returns (PASS); only `isDynamicTokenBudgetEnabled` missing @returns
- [x] Error handling -- Simple mapping function; no error-prone logic

**Specific lines to fix:**
- Line 1-4: Replace header with `// ─── MODULE: Dynamic Token Budget Allocation ───`
- All section headers: Replace ASCII `---` with Unicode `───`
- Line 33: Add `// AI-WHY: 4000 matches the complex tier budget — safe fallback ensures no context is lost when feature is disabled`
- Line 37-40: Add `// AI-WHY: Budget tiers (1500/2500/4000) are based on typical memory file sizes per complexity tier`
- Line 46-48 (isDynamicTokenBudgetEnabled): Add `@returns boolean`

---

### 6. folder-discovery.ts (397 lines)

**P0:**
- [ ] Header -- Line 1-7: ASCII hyphens
- [x] No dead code -- Clean
- [x] Naming -- Mostly correct; minor note: `_processSpecFolder` uses underscore-prefix convention (acceptable for internal helpers but non-standard)
- [ ] Section headers -- Lines 11-13, 36-41, 57-59, 132-134, 170-172, 237-239, 359-361: ASCII hyphens

**P1:**
- [ ] AI-intent comments -- No AI-WHY on regex patterns (lines 99, 153) or extraction strategy
- [x] JSDoc on exports -- All 6 exported functions have full @param/@returns. Best JSDoc coverage of all audited files.
- [ ] Error handling -- 6 bare `catch {}` blocks (lines 267, 277, 295, 305, 342, 379)

**Specific lines to fix:**
- Line 1-7: Replace header with `// ─── MODULE: Description-Based Spec Folder Discovery (PI-B3) ───`
- All section headers: Replace ASCII `---` with Unicode `───`
- Line 99: Add `// AI-WHY: Regex matches common spec section headings: "Problem Statement", "Problem & Purpose", "Purpose", "Overview"`
- Line 153: Add `// AI-WHY: Regex extracts words 3+ chars, including hyphenated terms, to capture meaningful technical keywords`
- Line 267: Change `catch {` to `catch (_error: unknown) {` -- readdir failure
- Line 277: Change `catch {` to `catch (_error: unknown) {` -- stat failure
- Line 295: Change `catch {` to `catch (_error: unknown) {` -- readdir on subfolder
- Line 305: Change `catch {` to `catch (_error: unknown) {` -- stat on subfolder
- Line 342: Change `catch {` to `catch (_error: unknown) {` -- readFile failure
- Line 379: Change `catch {` to `catch (_error: unknown) {` -- JSON parse failure

---

## Remediation Priority

### Batch 1: P0 Header Format (all 6 files)
**Effort:** Low (find-and-replace)
**Impact:** Fixes 12 P0 violations

Replace all ASCII hyphen headers:
```
// ---------------------------------------------------------------
// MODULE: ...
// ---------------------------------------------------------------
```
With Unicode box-drawing format:
```
// ─── MODULE: ... ───
```

Replace all ASCII section headers:
```
/* -----------------------------------------------------------
   N. SECTION NAME
----------------------------------------------------------------*/
```
With:
```
/* ─── N. SECTION NAME ─── */
```

### Batch 2: P1 Bare Catch Blocks (2 files, 7 instances)
**Effort:** Low
**Impact:** Fixes 7 P1 violations
- `query-classifier.ts` line 181
- `folder-discovery.ts` lines 267, 277, 295, 305, 342, 379

### Batch 3: P1 JSDoc @param/@returns (4 files)
**Effort:** Medium
**Impact:** Fixes 6 P1 violations
- `query-classifier.ts`: 4 functions need tags
- `rsf-fusion.ts`: 5 functions need tags
- `confidence-truncation.ts`: 4 functions need tags
- `dynamic-token-budget.ts`: 1 function needs @returns

### Batch 4: P1 AI-Intent Comments (all 6 files)
**Effort:** Medium
**Impact:** Fixes 6 P1 violations
Add AI-WHY/AI-GUARD/AI-INVARIANT/AI-RISK tags on magic numbers, non-obvious algorithm decisions, and defensive code patterns.
