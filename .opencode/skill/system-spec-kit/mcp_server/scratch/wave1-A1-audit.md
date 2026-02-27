# Wave 1 - A1: sk-code Audit Sprint 0+1

## Summary
- Files audited: 6
- P0 violations: 12 (header format across all 6 files)
- P1 violations: 15 (7 bare catch, 4 missing JSDoc, 4 missing AI-intent)
- Overall compliance: 50/100

**Systemic P0 issue:** Every file uses ASCII dashes (`-------`) instead of the required Unicode box-drawing character (`───`) in both file headers and section headers. This is the single largest compliance gap and affects all 6 files uniformly.

**P1 pattern:** Bare `catch {}` blocks appear 7 times across 3 files. Most are intentional "skip on failure" patterns but violate the specific-error-type requirement.

---

## File-by-File Findings

### 1. `lib/search/graph-search-fn.ts` (447 lines)

**P0:**
- [ ] Header: Uses `// ---------------------------------------------------------------` (ASCII dashes). Required: `// ─── MODULE: Unified Graph Search Function ───`
- [x] No dead code: Clean, no commented-out blocks
- [x] Naming: camelCase functions (computeTypedDegree, etc.), UPPER_SNAKE constants (EDGE_TYPE_WEIGHTS, DEGREE_BOOST_CAP), PascalCase interfaces (CausalEdgeRow, SubgraphWeights)
- [ ] Section headers: All 6 sections use `// ---------------------------------------------------------------` instead of `// ─── N. SECTION NAME ───`

**P1:**
- [ ] AI-intent comments: Missing AI-WHY on BM25 weight parameters (10.0, 5.0, 2.0, 1.0) at line 121; missing AI-GUARD on 3 bare catch blocks
- [x] JSDoc on exports: All 11 exported symbols have JSDoc. computeDegreeScores and normalizeDegreeToBoostedScore include @param/@returns
- [ ] Error handling: 3 bare `catch {}` blocks (lines 75, 322, 355). Only line 98 uses `catch (error: unknown)` properly

**Specific lines to fix:**
- Line 1: `// ---------------------------------------------------------------` -> `// ─── MODULE: Unified Graph Search Function ───`
- Lines 11, 27, 50, 61, 235, 396, 430: Section headers need `// ─── N. SECTION NAME ───` format
- Line 75: `catch {` -> `catch (_err: unknown) {` + add AI-GUARD comment
- Line 121: Add `// AI-WHY: BM25 weights tuned for title(10), content(5), triggers(2), folder(1)` or similar
- Line 322: `catch {` -> `catch (_err: unknown) {` + add AI-GUARD comment
- Line 355: `catch {` -> `catch (_err: unknown) {` + add AI-GUARD comment

---

### 2. `lib/parsing/trigger-matcher.ts` (579 lines)

**P0:**
- [ ] Header: Uses `// ---------------------------------------------------------------` (ASCII dashes). Required: `// ─── MODULE: Trigger Matcher ───`
- [x] No dead code: Clean
- [x] Naming: camelCase functions, UPPER_SNAKE constants (CONFIG, CORRECTION_KEYWORDS, PREFERENCE_KEYWORDS, SIGNAL_BOOSTS), PascalCase types (SignalCategory, SignalDetection, TriggerCacheEntry, etc.)
- [ ] Section headers: All 8 sections use ASCII dashes instead of Unicode box-drawing chars. Mix of `//` and `/* */` style (inconsistent but both allowed)

**P1:**
- [ ] AI-intent comments: Line 162-167 has `BUG-026 FIX` comment for Unicode regex but lacks formal AI-WHY tag; signal boost values (0.2, 0.1) on line 344-347 are magic numbers without AI-WHY
- [ ] JSDoc on exports: getCachedRegex() (line 152) exported but missing JSDoc. Most functions have JSDoc but lack @param/@returns tags
- [ ] Error handling: 1 bare `catch { continue; }` at line 224 (JSON parse). Line 252 correctly uses `catch (error: unknown)`

**Specific lines to fix:**
- Line 1: `// ---------------------------------------------------------------` -> `// ─── MODULE: Trigger Matcher ───`
- Lines 8, 98, 112, 141, 277, 317, 413, 551: Section headers need Unicode format
- Line 152: Add JSDoc `/** Get or create a cached regex for the given trigger phrase. */`
- Line 162: Add `// AI-WHY: Unicode-aware boundary avoids false matches on accented characters (BUG-026)`
- Line 224: `catch {` -> `catch (_err: unknown) {` + add `// AI-GUARD: Invalid JSON in trigger_phrases column — skip row`
- Line 344-347: Add `// AI-WHY: Correction boost higher (0.2) than preference (0.1) — corrections indicate stronger intent signal`

---

### 3. `lib/eval/edge-density.ts` (201 lines)

**P0:**
- [ ] Header: Uses `// ---------------------------------------------------------------` (ASCII dashes). Required: `// ─── MODULE: Edge Density (Sprint 1 T003) ───`
- [x] No dead code: Clean
- [x] Naming: camelCase functions (measureEdgeDensity, classifyDensity), UPPER_SNAKE constants (MODERATE_THRESHOLD, DENSE_THRESHOLD), PascalCase types (DensityClassification, EdgeDensityResult)
- [ ] Section headers: All 5 sections use ASCII dashes. Indentation inconsistent — sections 1-2 are not indented inside `/* */`, unlike trigger-matcher.ts

**P1:**
- [x] AI-intent comments: Domain-specific R10/R4 explanations embedded in buildR10Recommendation() are thorough. Could benefit from AI-GUARD on division-by-zero guard at line 99
- [x] JSDoc on exports: measureEdgeDensity and formatDensityReport both have full JSDoc with @param/@returns. Interface fields individually documented
- [ ] Error handling: No try/catch around any database queries. If causal_edges or memory_index tables don't exist, functions will throw unhandled errors

**Specific lines to fix:**
- Line 1: `// ---------------------------------------------------------------` -> `// ─── MODULE: Edge Density (Sprint 1 T003) ───`
- Lines 21, 49, 58, 121, 154: Section headers need Unicode format
- Line 73-118: Wrap DB queries in try/catch — `measureEdgeDensity()` will throw if tables are missing
- Line 99: Add `// AI-GUARD: Division-by-zero protection when graph has edges but nodeCount query returned 0`

---

### 4. `lib/cognitive/co-activation.ts` (417 lines)

**P0:**
- [ ] Header: Uses `// ---------------------------------------------------------------` (ASCII dashes). Required: `// ─── MODULE: Co-Activation ───`
- [x] No dead code: Clean
- [x] Naming: camelCase functions, UPPER_SNAKE constants (CO_ACTIVATION_CONFIG, DEFAULT_COACTIVATION_STRENGTH, RELATED_CACHE_TTL_MS, RELATED_CACHE_MAX_SIZE), PascalCase interfaces (CoActivationEvent, RelatedMemory, SpreadResult)
- [ ] Section headers: All 6 sections use ASCII dashes. Section formatting is INCONSISTENT — uses `/* ----- ... -----*/` with shorter dashes and different indentation than other files

**P1:**
- [ ] AI-intent comments: Line 15-19 has excellent deviation rationale (acts as AI-WHY). Line 112-113 references R17 fan-effect. Missing AI-GUARD on 3 bare catch blocks
- [ ] JSDoc on exports: init() (line 86) and isEnabled() (line 91) are exported but MISSING JSDoc. CO_ACTIVATION_CONFIG missing JSDoc
- [ ] Error handling: 3 bare `catch {}` blocks at lines 152, 173, 287. Lines 182, 235, 293 correctly use `catch (error: unknown)`

**Specific lines to fix:**
- Line 1: `// ---------------------------------------------------------------` -> `// ─── MODULE: Co-Activation ───`
- Lines 8, 32, 59, 82, 95, 395: Section headers need Unicode format
- Line 86: Add JSDoc `/** Initialize the co-activation module with a database connection. @param database - An open better-sqlite3 Database instance. */`
- Line 91: Add JSDoc `/** Check whether co-activation is enabled via SPECKIT_COACTIVATION env var. @returns true if enabled. */`
- Line 112: Add `// AI-WHY: sqrt scaling (fan-effect divisor) prevents hub nodes from accumulating unbounded co-activation boost`
- Line 152: `catch {` -> `catch (_err: unknown) { // AI-GUARD: JSON parse failure — related_memories may be corrupted`
- Line 173: `catch {` -> `catch (_err: unknown) { // AI-GUARD: Individual memory lookup failure — skip this neighbor`
- Line 287: `catch {` -> `catch (_err: unknown) { // AI-GUARD: Individual memory lookup failure — skip this neighbor`

---

### 5. `lib/cognitive/fsrs-scheduler.ts` (397 lines)

**P0:**
- [ ] Header: Uses `// ---------------------------------------------------------------` (ASCII dashes) with an embedded Unicode line (`// ─────────────────────────────────────────────────────`) on line 6 that is decorative, not structural. Required: `// ─── MODULE: Fsrs Scheduler ───`
- [x] No dead code: Clean
- [x] Naming: camelCase functions, UPPER_SNAKE constants (FSRS_FACTOR, FSRS_DECAY, GRADE_AGAIN, etc.), PascalCase interfaces (FsrsParams, ReviewResult)
- [ ] Section headers: All 5 sections use ASCII dashes

**P1:**
- [x] AI-intent comments: Excellent T301 two-domain model documentation in header (lines 5-23). TM-03 NOTE on lines 237-246 is a strong AI-INVARIANT. Line 36 has derived constant reasoning
- [ ] JSDoc on exports: Functions all have JSDoc. Individual constants (FSRS_FACTOR, FSRS_DECAY, GRADE_*, MIN_/MAX_*) use group JSDoc — individual exports lack their own @description. FSRS_HALF_LIFE_FACTOR has inline comment but no formal JSDoc
- [x] Error handling: Pure mathematical functions with input validation via early returns. No try/catch needed — appropriate for the domain

**Specific lines to fix:**
- Line 1: `// ---------------------------------------------------------------` -> `// ─── MODULE: Fsrs Scheduler ───`
- Lines 26, 55, 75, 215, 257: Section headers need Unicode format
- Line 6: Remove decorative Unicode line or integrate into proper header format
- Line 31: Add individual JSDoc `/** FSRS v4 scaling factor: 19/81. Used in retrievability formula. */`
- Line 32: Add individual JSDoc `/** FSRS v4 decay exponent: -0.5 (power-law). */`
- Line 36: Convert inline comment to JSDoc `/** T301: Derived half-life factor = FSRS_FACTOR / 3 (19/243). */`

---

### 6. `lib/search/fsrs.ts` (86 lines)

**P0:**
- [ ] Header: Uses `// ---------------------------------------------------------------` (ASCII dashes). Required: `// ─── MODULE: Temporal-Structural Coherence (FSRS + Graph Centrality) ───`
- [x] No dead code: Clean
- [x] Naming: camelCase functions (computeStructuralFreshness, computeGraphCentrality), PascalCase interface (MemoryGraphLike)
- [ ] Section headers: Both sections use ASCII dashes

**P1:**
- [x] AI-intent comments: Line 83 has a good defensive comment (`guard against unexpected edge-list duplication`) that serves as AI-GUARD
- [x] JSDoc on exports: Both exported functions have full JSDoc with @param/@returns. Formula documented inline
- [x] Error handling: Pure functions with input clamping. No error handling needed

**Specific lines to fix:**
- Line 1: `// ---------------------------------------------------------------` -> `// ─── MODULE: Temporal-Structural Coherence (FSRS + Graph Centrality) ───`
- Lines 7, 24: Section headers need Unicode format

---

## Cross-File Patterns

### Systemic Issues (affect all 6 files)

| Issue | Severity | Count | Fix Effort |
|-------|----------|-------|------------|
| ASCII dash headers instead of Unicode `───` | P0 | 6 file headers + ~30 section headers | Low (search-replace) |
| Bare `catch {}` without error variable | P1 | 7 instances across 3 files | Low |
| Missing AI-intent tags on non-obvious logic | P1 | ~8-10 locations | Medium |
| Exported functions missing JSDoc | P1 | 4 functions | Low |
| JSDoc missing @param/@returns | P1 | ~15 functions | Medium |

### Positive Patterns (already compliant)

| Pattern | Files |
|---------|-------|
| Zero dead/commented-out code | All 6 |
| Correct naming conventions (camelCase, UPPER_SNAKE, PascalCase) | All 6 |
| Numbered section organization | All 6 |
| Typed error handling where used (`catch (error: unknown)`) | graph-search-fn, trigger-matcher, co-activation |
| Rich JSDoc on primary exported functions | All 6 |
| Header MODULE name present (just wrong format) | All 6 |

---

## Remediation Priority

### Phase 1 — P0 Header Fix (all 6 files, ~30 min)
Global search-replace: `// ---------------------------------------------------------------` -> `// ───` pattern.
Each file header: `// ─── MODULE: [Name] ───`
Each section header: `// ─── N. SECTION NAME ───`

### Phase 2 — P1 Bare Catch (3 files, ~15 min)
Replace 7 bare `catch {}` with `catch (_err: unknown) {}` and add AI-GUARD comments.

### Phase 3 — P1 JSDoc + AI-intent (~30 min)
Add JSDoc to 4 exported functions missing it. Add AI-WHY/AI-GUARD tags to ~8 non-obvious logic locations.

### Phase 4 — P1 @param/@returns enrichment (~45 min, lower priority)
Add formal @param/@returns to ~15 JSDoc blocks that currently only have description.
