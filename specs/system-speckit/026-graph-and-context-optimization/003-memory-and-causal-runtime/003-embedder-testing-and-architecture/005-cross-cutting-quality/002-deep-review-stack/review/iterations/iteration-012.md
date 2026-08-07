# Iteration 012 — MAINTAINABILITY (deep pass)

## P0 Findings

### P0-1: Missing JSDoc on ALL public API functions in reindex.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- **Lines**: 312-406 (startReindex, getJobStatus, getActiveJob, cancelJob, resumeReindexJobs, estimateEta)
- **Issue**: All exported public API functions lack JSDoc documentation. Functions include startReindex (line 312), getJobStatus (line 346), getActiveJob (line 350), cancelJob (line 354), resumeReindexJobs (line 370), and estimateEta (line 387). No parameter descriptions, return types, or usage examples exist. This violates the codebase's documentation standards and makes the embedder reindex API surface opaque to consumers.
- **Repro**:
  1. Open reindex.ts
  2. Check lines 312-406 - all exported functions have no JSDoc comments
  3. Compare to registry.ts which has JSDoc on getManifest (line 143), listManifests (line 152), listSupportedDimensions (line 161), getAdapter (line 170)
  4. No documentation for critical reindex operations
- **Recommendation**: Add comprehensive JSDoc to all public API functions including: parameter descriptions with types, return type documentation, usage examples, and error conditions. Follow the pattern established in registry.ts.

### P0-2: Missing JSDoc on ALL internal helper functions in reindex.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- **Lines**: 94-250 (resolveDb, nowIso, normalizeJob, getBatchSize, tableNameForDim, yieldToEventLoop, ensureJobTable, selectJob, selectActiveJob, setJobStatus, getCancellationStatus, selectMemoryBatch, memoryText, writeVectors, enqueueJob)
- **Issue**: All internal helper functions lack JSDoc documentation. These functions are exposed via __testables (not present in reindex.ts but common pattern) or are critical to the reindex pipeline. Functions include resolveDb (line 94), nowIso (line 98), normalizeJob (line 124), getBatchSize (line 102), tableNameForDim (line 111), yieldToEventLoop (line 118), ensureJobTable (line 139), selectJob (line 143), selectActiveJob (line 154), setJobStatus (line 167), getCancellationStatus (line 192), selectMemoryBatch (line 197), memoryText (line 206), writeVectors (line 216), enqueueJob (line 241). No documentation makes maintenance and testing difficult.
- **Repro**:
  1. Open reindex.ts
  2. Check lines 94-250 - all helper functions have no JSDoc comments
  3. Functions are complex (e.g., writeVectors at line 216 handles batch DB writes)
  4. No documentation for behavior, parameters, or side effects
- **Recommendation**: Add JSDoc to all internal helper functions with: purpose description, parameter documentation, return behavior, and side effect notes. This is critical for maintainability of the complex reindex orchestration logic.

## P1 Findings

### P1-1: Oversized executeStage2 function violates single responsibility principle
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 980-1454 (executeStage2 function, 470+ lines)
- **Issue**: The executeStage2 function is 470+ lines long (lines 980-1454), handling 13 distinct signal application steps in a single monolithic function. This violates single responsibility principle and makes the code difficult to understand, test, and maintain. The function contains deeply nested conditionals for each signal step, making control flow hard to follow. Comments indicate the 13-step order must not be changed, but the monolithic structure makes it risky to modify any individual step.
- **Repro**:
  1. Open stage2-fusion.ts
  2. Check executeStage2 function spanning lines 980-1454
  3. Count lines - 470+ in single function
  4. Observe nested try-catch blocks for each of 13 signal steps
  5. No decomposition despite clear step boundaries documented in comments
- **Recommendation**: Decompose executeStage2 into smaller functions for each signal application step (e.g., applySessionBoostStep, applyRecencyFusionStep, applyCausalBoostStep, etc.). Maintain the 13-step order via orchestration in executeStage2, but extract each step into a testable, single-responsibility function.

### P1-2: Magic numbers throughout stage2-fusion.ts should be extracted as constants
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 126, 131, 135, 166, 268-279, 593, 653, 704
- **Issue**: Multiple magic numbers are hardcoded throughout the file without named constants, making the code difficult to understand and tune. Examples include:
  - Line 126: SPREAD_ACTIVATION_TOP_N = 5 (already a constant, good)
  - Line 131: RECENCY_FUSION_WEIGHT = 0.07 (already a constant, good)
  - Line 135: RECENCY_FUSION_CAP = 0.10 (already a constant, good)
  - Line 166: MAX_LEARNED_BLEND_WEIGHT = 0.05 (already a constant, good)
  - Line 268: qualityFactor = 0.9 + (quality * 0.2) - magic numbers 0.9, 0.2
  - Line 269-271: specLevelBonus calculation with 0.06, 0.02
  - Line 273-277: completionBonus values 0.04, 0.015
  - Line 279: checklistBonus = 0.01
  - Line 593: difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5) - magic numbers 0.9, 0.5
  - Line 653: similarity = similarityRaw / 100 - magic number 100
  - Line 704: boostFactor clamped to [0, 2] - magic number 2
- **Repro**:
  1. Open stage2-fusion.ts
  2. Search for numeric literals in function bodies
  3. Lines 268-279: validation signal scoring uses hardcoded multipliers
  4. Line 593: FSRS difficulty bonus uses 0.9, 0.5
  5. Line 653: similarity normalization uses 100
  6. Line 704: artifact boost clamp uses 2
- **Recommendation**: Extract all magic numbers to named constants at the top of the file with descriptive names and JSDoc explaining their purpose. Group related constants (e.g., VALIDATION_SIGNAL_CONSTANTS, FSRS_CONSTANTS, SIMILARITY_CONSTANTS). Make constants env-tunable where appropriate.

### P1-3: Code duplication in DB error handling in stage2-fusion.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 752-756 (applyFeedbackSignals function)
- **Issue**: The DB error handling at lines 752-756 is duplicated. Lines 752-756 check for Error instance and return results, then lines 755-756 perform the exact same check and return. This is copy-paste error that creates dead code and confusion.
- **Repro**:
  1. Open stage2-fusion.ts to applyFeedbackSignals function (line 741)
  2. Check lines 752-756
  3. Lines 752-754: check if error instanceof Error, return results
  4. Lines 755-756: check if error instanceof Error, return results (identical logic)
  5. Second block is unreachable due to first return
- **Recommendation**: Remove the duplicate error handling block at lines 755-756. Consolidate to a single error check. Consider extracting DB error handling to a shared helper function to prevent future duplication.

### P1-4: Missing JSDoc on internal functions in stage2-fusion.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 149 (clampMultiplier), 156 (isShadowLearningModelLoadEnabled), 187 (resolveLearnedStage2ModelPath)
- **Issue**: Internal helper functions lack JSDoc documentation despite being critical to scoring logic. Functions include clampMultiplier (line 149), isShadowLearningModelLoadEnabled (line 156), and resolveLearnedStage2ModelPath (line 187). These functions are used in scoring paths and their behavior is non-obvious without documentation.
- **Repro**:
  1. Open stage2-fusion.ts
  2. Check line 149: clampMultiplier - no JSDoc, behavior unclear (clamps to [0.8, 1.2])
  3. Check line 156: isShadowLearningModelLoadEnabled - no JSDoc, env var check logic undocumented
  4. Check line 187: resolveLearnedStage2ModelPath - no JSDoc, path resolution logic undocumented
  5. Compare to other functions like applyIntentWeightsToResults (line 640) which have comprehensive JSDoc
- **Recommendation**: Add JSDoc to all internal helper functions including: purpose description, parameter documentation, return behavior, and any side effects. Follow the pattern established by applyIntentWeightsToResults (line 640) which has comprehensive documentation.

## P2 Findings

### P2-1: Missing edge-case tests in dist-freshness.vitest.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts`
- **Lines**: 48-106 (test suites)
- **Issue**: Test coverage is good for happy path (file existence, marker presence, timestamp freshness) but lacks edge-case tests. No tests for: permission errors on dist files, corrupted dist files (invalid JS), concurrent build processes (race conditions), or malformed marker patterns. These edge cases occur in production (CI permission issues, partial builds) but are not tested.
- **Repro**:
  1. Open dist-freshness.vitest.ts
  2. Check test suites - only test file existence, markers, and timestamps
  3. No test for permission denied errors
  4. No test for corrupted dist files (readFileSync would throw)
  5. No test for concurrent build race conditions
- **Recommendation**: Add edge-case test cases: test handling of permission errors (mock existsSync returning false due to permissions), test corrupted dist files (mock readFileSync throwing), test concurrent build scenarios (mock mtime race conditions). Ensure tests fail-open with clear error messages.

### P2-2: Magic numbers in reindex.ts should be named constants
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- **Lines**: 70 (DEFAULT_BATCH_SIZE), 405 (division by 1000)
- **Issue**: Magic numbers are used without named constants. Line 70 defines DEFAULT_BATCH_SIZE = 50 (good, already a constant). Line 405 divides by 1000 for ms-to-seconds conversion without a named constant. This makes the code less self-documenting and harder to tune.
- **Repro**:
  1. Open reindex.ts
  2. Check line 70: DEFAULT_BATCH_SIZE = 50 (already a constant, good)
  3. Check line 405: return Math.ceil((job.total - job.processed) / ratePerMs / 1000)
  4. Magic number 1000 is ms-to-seconds conversion factor
  5. No constant like MS_PER_SECOND = 1000
- **Recommendation**: Extract magic number 1000 to a named constant MS_PER_SECOND at the top of the file with JSDoc explaining its purpose. Consider making DEFAULT_BATCH_SIZE env-tunable if not already.

### P2-3: Complex nested conditionals in stage2-fusion.ts executeStage2
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 1010-1400 (executeStage2 function body)
- **Issue**: The executeStage2 function contains deeply nested conditionals for each of the 13 signal steps. Each step has pattern: if (condition) { try { ... } catch { ... } }. This nesting makes control flow hard to follow and increases cognitive load. The 470-line function with 13 nested try-catch blocks is difficult to reason about.
- **Repro**:
  1. Open stage2-fusion.ts executeStage2 (line 980)
  2. Observe lines 1010-1400: 13 signal steps with nested conditionals
  3. Each step has: if (featureFlag) { try { ... } catch { ... } }
  4. Nesting depth varies, making it hard to track execution flow
  5. No visual separation between steps despite comments
- **Recommendation**: Extract each signal step into a separate function (see P1-1). Use early returns or guard clauses to reduce nesting. Consider using a step registry pattern to map step names to functions, reducing the need for manual sequencing in executeStage2.
