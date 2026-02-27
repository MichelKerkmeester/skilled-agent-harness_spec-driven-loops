# Wave 1 - A2: sk-code Audit Sprint 2

## Summary
- Files audited: 4
- P0 violations: 8 (2 per file: header format + section header format)
- P1 violations: 10 (systemic JSDoc + AI-intent gaps, 2 bare catch blocks)
- Overall compliance: 44/100

**Systemic issues (affect ALL 4 files):**
1. File headers use ASCII hyphens `-------` instead of Unicode box-drawing `───`
2. Section headers use ASCII hyphens instead of Unicode box-drawing chars
3. All JSDoc blocks on exported functions lack `@param` and `@returns` tags
4. No AI-intent comments (AI-WHY, AI-GUARD, AI-INVARIANT, AI-RISK) on non-obvious logic

---

## File-by-File Findings

### 1. `lib/scoring/composite-scoring.ts` (723 lines)

**P0:**
- [ ] Header — Line 1-3: Uses `// -------` (ASCII hyphens). Must be `// ─── MODULE: Composite Scoring ───`
- [x] No dead code — No commented-out code blocks found
- [x] Naming — camelCase functions, UPPER_SNAKE constants, PascalCase types all correct
- [ ] Section headers — Lines 40, 110, 192, 389, 429, 494, 562, 690: All use `// -------` instead of `// ─── N. SECTION ───`

**P1:**
- [ ] AI-intent comments — Multiple non-obvious logic points lack standard tags
- [ ] JSDoc on exports — Most exports have descriptive JSDoc but none have `@param`/`@returns`
- [ ] Error handling — Two bare `catch {}` blocks

**Specific lines to fix:**

| Line | Issue | Fix |
|------|-------|-----|
| 1-3 | ASCII hyphen header | `// ─── MODULE: Composite Scoring ───` |
| 36 | Bare `catch {}` on dynamic require | `catch (_err: unknown) { /* AI-GUARD: optional dep, fallback to inline FSRS */ }` |
| 40-42 | Section header with hyphens | `// ─── 1. TYPES ───` |
| 110-112 | Section header | `// ─── 2. CONFIGURATION ───` |
| 192-194 | Section header | `// ─── 3. SCORE CALCULATIONS ───` |
| 231 | Missing AI tag | Change to `// AI-GUARD: Return neutral 0.5 when no timestamp (prevents NaN propagation)` |
| 251 | Inline FSRS fallback | Add `// AI-WHY: Inline FSRS power-law formula used when fsrs-scheduler module unavailable` |
| 385 | `calculateRecencyScore` export — no JSDoc | Add `/** @param timestamp ... @param tier ... @returns ... */` |
| 389-391 | Section header | `// ─── 3b. NOVELTY BOOST ───` |
| 410 | `calculateNoveltyBoost` — JSDoc missing @param/@returns | Add `@param createdAt` and `@returns` |
| 424 | `getTierBoost` — no JSDoc | Add `/** Get tier boost value. @param tier ... @returns ... */` |
| 429-431 | Section header | `// ─── 3c. POST-PROCESSING ───` |
| 460-461 | Score cap logic non-obvious | Add `// AI-INVARIANT: N4 novelty-boosted scores capped at 0.95 to prevent score inflation` |
| 489 | Bare `catch {}` in telemetry | `catch (_err: unknown) { /* AI-RISK: fail-safe — telemetry must never affect scoring */ }` |
| 494-496 | Section header | `// ─── 4. COMPOSITE SCORING FUNCTIONS ───` |
| 505 | `calculateFiveFactorScore` missing @param/@returns | Add tags |
| 533 | `calculateCompositeScore` missing @param/@returns | Add tags |
| 562-564 | Section header | `// ─── 5. BATCH OPERATIONS ───` |
| 576 | `applyFiveFactorScoring` missing @param/@returns | Add tags |
| 605 | `applyCompositeScoring` missing @param/@returns | Add tags |
| 635 | `getFiveFactorBreakdown` missing @param/@returns | Add tags |
| 661 | `getScoreBreakdown` missing @param/@returns | Add tags |
| 690-692 | Section header | `// ─── 7. SCORE NORMALIZATION ───` |
| 698 | `isCompositeNormalizationEnabled` missing @returns | Add `@returns boolean` |
| 710 | `normalizeCompositeScores` missing @param/@returns | Add tags |

---

### 2. `lib/cache/embedding-cache.ts` (193 lines)

**P0:**
- [ ] Header — Line 1-4: Uses `// -------` (ASCII hyphens). Must be `// ─── MODULE: Embedding Cache ───`
- [x] No dead code — Clean, no commented-out blocks
- [x] Naming — All conventions correct
- [ ] Section headers — Lines 9, 29, 51, 81, 104, 121, 151, 163, 175: All use `/* ----` hyphens instead of `/* ─── N. SECTION ─── */`

**P1:**
- [x] AI-intent comments — Simple utility module; no highly non-obvious logic
- [ ] JSDoc on exports — All 7 exports have JSDoc descriptions but NONE have `@param`/`@returns`
- [x] Error handling — No try/catch needed (pure DB wrappers; callers handle errors)

**Specific lines to fix:**

| Line | Issue | Fix |
|------|-------|-----|
| 1-4 | ASCII hyphen header | `// ─── MODULE: Embedding Cache ───` |
| 9-11 | Section header | `/* ─── 1. INTERFACES ─── */` |
| 29-31 | Section header | `/* ─── 2. TABLE INITIALIZATION ─── */` |
| 37 | `initEmbeddingCache` missing @param | Add `@param db - SQLite database instance` |
| 51-53 | Section header | `/* ─── 3. CACHE LOOKUP ─── */` |
| 60 | `lookupEmbedding` missing @param/@returns | Add `@param db`, `@param contentHash`, `@param modelId`, `@returns Buffer or null` |
| 81-83 | Section header | `/* ─── 4. CACHE STORE ─── */` |
| 90 | `storeEmbedding` missing @param | Add all 5 params |
| 104-106 | Section header | `/* ─── 5. LRU EVICTION ─── */` |
| 112 | `evictOldEntries` missing @param/@returns | Add `@param db`, `@param maxAgeDays`, `@returns number of evicted entries` |
| 121-123 | Section header | `/* ─── 6. STATISTICS ─── */` |
| 128 | `getCacheStats` missing @param/@returns | Add tags |
| 151-153 | Section header | `/* ─── 7. CLEAR ─── */` |
| 158 | `clearCache` missing @param | Add `@param db` |
| 163-165 | Section header | `/* ─── 8. CONTENT HASHING ─── */` |
| 171 | `computeContentHash` missing @param/@returns | Add `@param content`, `@returns SHA-256 hex digest` |
| 175-177 | Section header | `/* ─── 9. EXPORTS ─── */` |

---

### 3. `lib/search/adaptive-fusion.ts` (377 lines)

**P0:**
- [ ] Header — Line 1-4: Uses `// -------` (ASCII hyphens). Must be `// ─── MODULE: Adaptive Fusion ───`
- [x] No dead code — Clean
- [x] Naming — All conventions correct
- [ ] Section headers — Lines 14, 56, 78, 95, 136, 214, 241, 273: All use hyphens

**P1:**
- [ ] AI-intent comments — Missing tags on constraint logic and fallback paths
- [ ] JSDoc on exports — Descriptive JSDoc present but missing `@param`/`@returns` on most
- [ ] Error handling — Line 208 has bare `catch {}`; lines 309 and 335 properly typed

**Specific lines to fix:**

| Line | Issue | Fix |
|------|-------|-----|
| 1-4 | ASCII hyphen header | `// ─── MODULE: Adaptive Fusion ───` |
| 14-16 | Section header | `/* ─── 1. INTERFACES ─── */` |
| 56-58 | Section header | `/* ─── 2. WEIGHT PROFILES ─── */` |
| 78-80 | Section header | `/* ─── 3. FEATURE FLAG ─── */` |
| 91 | `isAdaptiveFusionEnabled` missing JSDoc | Add `/** Check adaptive fusion flag. @param identity ... @returns boolean */` |
| 95-97 | Section header | `/* ─── 4. WEIGHT COMPUTATION ─── */` |
| 104 | `getAdaptiveWeights` missing @param/@returns | Add tags |
| 111 | Weight constraint comment | Change to `// AI-INVARIANT: Document-type shifts are small (0.1) to keep sum near 1.0` |
| 136-138 | Section header | `/* ─── 5. ADAPTIVE FUSION ─── */` |
| 146 | `adaptiveFuse` missing @param/@returns | Add tags |
| 175 | Recency boost logic | Add `// AI-WHY: Post-fusion recency boost gives freshness advantage to recent items` |
| 208 | Bare `catch {}` | `catch (_err: unknown) { /* AI-GUARD: skip items with unparseable dates */ }` |
| 214-216 | Section header | `/* ─── 6. STANDARD FALLBACK ─── */` |
| 222 | `standardFuse` missing @param/@returns | Add tags |
| 241-243 | Section header | `/* ─── 7. DARK-RUN MODE ─── */` |
| 273-275 | Section header | `/* ─── 8. MAIN ENTRY POINT ─── */` |
| 289 | `hybridAdaptiveFuse` — has @param but missing @returns | Add `@returns AdaptiveFusionResult` |
| 312-320 | Indentation inconsistency in degraded return | Fix indentation (extra leading spaces on `degraded:`) |

---

### 4. `lib/search/intent-classifier.ts` (547 lines)

**P0:**
- [ ] Header — Line 1-4: Uses `// -------` (ASCII hyphens). Must be `// ─── MODULE: Intent Classifier ───`
- [x] No dead code — Clean
- [x] Naming — All conventions correct
- [ ] Section headers — Lines 6, 204, 341, 496: All use hyphens

**P1:**
- [ ] AI-intent comments — Multiple non-obvious algorithms lack standard tags
- [ ] JSDoc on exports — All 13+ exports have JSDoc descriptions but none have `@param`/`@returns`
- [x] Error handling — Pure functions with no I/O; no try/catch needed

**Specific lines to fix:**

| Line | Issue | Fix |
|------|-------|-----|
| 1-4 | ASCII hyphen header | `// ─── MODULE: Intent Classifier ───` |
| 6-8 | Section header | `/* ─── 1. TYPES & CONSTANTS ─── */` |
| 204-206 | Section header | `/* ─── 2. SCORING FUNCTIONS ─── */` |
| 209 | `calculateKeywordScore` missing @param/@returns | Add tags |
| 223-226 | Single-keyword discount logic | Change to `// AI-INVARIANT: Single keyword match discounted 70% to prevent weak classification` |
| 236 | `calculatePatternScore` missing @param/@returns | Add tags |
| 263 | FNV-1a hash explanation | Add `// AI-WHY: FNV-1a hash chosen for fast, uniform distribution in token-to-dimension mapping` |
| 295-296 | Magic number `2166136261` | Add `// AI-WHY: FNV-1a offset basis (2166136261) and prime (16777619) per FNV spec` |
| 335 | `calculateCentroidScore` missing @param/@returns | Add tags |
| 341-343 | Section header | `/* ─── 3. CLASSIFICATION ─── */` |
| 346 | `classifyIntent` missing @param/@returns | Add tags |
| 373 | Negative penalty multiplier | Add `// AI-WHY: 0.3 multiplier (70% penalty) prevents false positives from ambiguous phrasing` |
| 428 | `detectIntent` missing @param/@returns | Add tags |
| 435 | `getIntentWeights` missing @param/@returns | Add tags |
| 442 | `applyIntentWeights` missing @param/@returns | Add tags |
| 461 | `getQueryWeights` missing @param/@returns | Add tags |
| 469 | `isValidIntent` missing @param/@returns | Add tags |
| 476 | `getValidIntents` missing @returns | Add tag |
| 483 | `getIntentDescription` missing @param/@returns | Add tags |
| 496-498 | Section header | `/* ─── 4. EXPORTS ─── */` |

---

## Violation Tally

| Gate | composite-scoring | embedding-cache | adaptive-fusion | intent-classifier | Total |
|------|:-:|:-:|:-:|:-:|:-:|
| **P0: Header** | FAIL | FAIL | FAIL | FAIL | 4 |
| **P0: Dead code** | PASS | PASS | PASS | PASS | 0 |
| **P0: Naming** | PASS | PASS | PASS | PASS | 0 |
| **P0: Section headers** | FAIL | FAIL | FAIL | FAIL | 4 |
| **P1: AI-intent** | FAIL | PASS | FAIL | FAIL | 3 |
| **P1: Comment density** | PASS | PASS | PASS | PASS | 0 |
| **P1: Error handling** | FAIL (2x bare catch) | PASS | FAIL (1x bare catch) | PASS | 2 |
| **P1: JSDoc @param/@returns** | FAIL (14 exports) | FAIL (7 exports) | FAIL (5 exports) | FAIL (13 exports) | 4 |
| | | | | **Totals** | **P0: 8, P1: 9** |

## Remediation Priority

### Batch-fixable (search-and-replace across all 4 files):
1. **Header format** — Replace `// -------...` with `// ─── MODULE: Name ───` (4 files)
2. **Section headers** — Replace `// -------` / `/* -----` delimiters with `─── N. SECTION ───` (25+ instances)

### Systematic (per-export sweep):
3. **JSDoc @param/@returns** — Add to all 39 exported functions across 4 files
4. **AI-intent comments** — Add AI-WHY/AI-GUARD/AI-INVARIANT/AI-RISK tags at ~15 locations

### Targeted fixes:
5. **Bare catch blocks** — 3 instances (composite-scoring lines 36, 489; adaptive-fusion line 208)
6. **Indentation** — adaptive-fusion line 312-320 degraded return block
