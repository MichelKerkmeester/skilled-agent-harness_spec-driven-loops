---
title: "Implementation Plan: Legacy-era report and detection"
description: "A read-only packet classifier and era report module that walks the spec tree once, categorizes each packet by pre-v4 signals, and feeds the report into doctor check and upgrade-legacy preflight."
trigger_phrases:
  - "legacy era report plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Legacy-era report and detection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, JavaScript (ES modules) |
| **Framework** | None (plain modules) |
| **Storage** | File system walk, in-memory analysis |
| **Testing** | Vitest with fixture packets |

### Overview
A new `repo-era.mjs` module walks the spec tree once and categorizes each folder by packet type and pre-v4 signals. An exclusion list filters research lineages, scratch, changelog, and git-ignored paths. Header aliases normalize drifting document spellings. The classifier feeds signal counts into `/doctor:update check` and `upgrade-legacy` preflight.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

### Pattern
Module decomposition: read-only analyzer with no side effects.

### Key Components
- **PacketClassifier**: walks specs/ tree once, applies exclusion patterns, categorizes each folder as packet, non-packet, or excluded.
- **Signal detectors** (five independent functions):
  - Layout: v3 `.opencode/specs` vs v4 `specs/`
  - Frontmatter: presence/absence of frontmatter block in documents
  - Template marker: presence/version of `SPECKIT_TEMPLATE_SOURCE` comment
  - Generated metadata: presence of `graph-metadata.json`
  - Level match: document set matches the packet's declared level
- **Header alias map**: normalize drifting spellings (`impl-summary-core` -> `implementation-summary`).
- **EraReport class**: summarize findings by signal into counts and classification matrix.

### Data Flow
1. Caller invokes `classifyRepo(specsRoot)`.
2. PacketClassifier walks the tree using existing `lib/corpus.mjs` filtering.
3. Each folder is categorized and excluded folders are skipped.
4. Signal detectors run independently on non-excluded packets.
5. EraReport aggregates counts by signal.
6. Caller reads report properties (layout, frontmatters, markers, metadata, levels) and counts.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/corpus.mjs` | Provides git-ignore filtering | Reuse `gitIgnoredPaths` and `isExcludedDirectory` helpers for path filtering | Verify classifier and corpus.mjs agree on excluded paths |
| `upgrade-legacy.mjs` | Validates and repairs failing packets; contains `collectSpecFolders` packet walker | Use `collectSpecFolders` walk or build packet walker with same exclusion policy (research/review/context trees, z_archive/00-changelog pattern); packet walk includes z_archive unlike corpus.mjs | Test that era report covers full corpus including archived packets and agrees with collectSpecFolders |
| `/doctor:update check` workflow and presentation | Shows release compatibility | Add era report section before repair summary | Manual verification: doctor check shows layout and signal counts |
| Weekly corpus validation sweep | Reports corpus health | Call era report to add signal context as part of the sweep output | Weekly sweep includes era signal counts in the report |
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 3. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Classifier walk, exclusion filtering, signal detectors, header alias normalization | Vitest with fixture packets |
| Integration | Era report called from upgrade-legacy and doctor check | Manual verification with real repo |
| Performance | Corpus walk speed and memory usage | Time and memory profiling on 4,000+ packet corpus |
<!-- /ANCHOR:testing -->

### Test Coverage
- **Classifier walk**: Fixture with 20 test packets covering v3 layout, v4 layout, non-packets, and excluded folders.
- **Signal detectors**: Separate fixture per signal (frontmatter missing, legacy marker, no metadata, level mismatch).
- **Exclusions**: Lineages, scratch, changelog, git-ignored paths all pass through walk without being counted as packets.
- **Header aliases**: Document with `impl-summary-core` header resolves to canonical `implementation-summary` name.
- **Report generation**: Counts in summary match individual signal tallies across all test packets.

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 14 research findings | Internal | Green | Classification rules and exclusion categories |
| `lib/corpus.mjs` path walk | Internal | Green | Reuse existing, stable filtering |
| Vitest test framework | Internal | Green | Write fixture packets and signal detectors |
| Node.js ES modules | External | Green | Standard runtime, no new setup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK PLAN

- **Trigger**: Classifier produces incorrect counts or misses packets.
- **Procedure**: Revert the commit. `/doctor:update check` shows only layout. `upgrade-legacy` preflight uses fallback (no era report). Cached reports are invalidated.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (define exclusions and aliases) | Low | 1-2 hours |
| Core (classifier, detectors, report) | Med | 4-6 hours |
| Verification (integration, tests) | Med | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Era report read-only (no mutations)
- [ ] Classifier tested on 4,371 packet corpus
- [ ] No data migrations (pure analysis)

### Rollback Procedure
1. Revert the commit.
2. Clear any cached era reports from the working tree.
3. `/doctor:update check` falls back to existing layout detection only.
4. `upgrade-legacy` preflight skips the era report (still works, just less informative).

### Data Reversal
- Has data migrations? No. This is a read-only analysis module with no persistent side effects.
<!-- /ANCHOR:enhanced-rollback -->

---

