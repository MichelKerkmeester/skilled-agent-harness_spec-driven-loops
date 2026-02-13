---
id: "093"
title: "Memory Index Failures Investigation"
level: 3
status: complete
created: 2026-02-08
---

# 🎯 Spec: Memory Index Failures Investigation

## Objective
Investigate and fix 129 memory files that persistently fail to index with Voyage embeddings during `memory_index_scan` operations.

## Problem Statement
During force re-indexing of the memory database, 129 out of 244 memory files consistently fail with "An unexpected error occurred. Please try again." The same files fail across multiple scan attempts, indicating a structural or code issue rather than transient API failures.

## Root Causes (FOUND — 2 Bugs)

**Bug A (Session 1):** Argument order mismatch in `evaluateMemory()` call at `memory-save.ts:560`. The PE gate function expects `(contentHash, content, candidates, options)` but was called with `(candidates, content, options)` — causing a crash when `.filter()` is called on the options object instead of the candidates array. Error was masked by `userFriendlyError()` which replaced the real error with a generic message.

**Bug B (Session 2):** Missing `import path from 'path'` in `memory-save.ts`. The file uses `path.basename()` at 4 locations (warning/error logging paths) but never imported the `path` module. Files that triggered validation warnings or embedding failures would crash with `ReferenceError: path is not defined`, also masked by `userFriendlyError()`.

## Scope
### In Scope
- Root cause analysis of indexing failures ✅
- Deep dive into system-spec-kit indexing code path ✅
- Analysis of Voyage embedding generation and error handling ✅
- File format analysis (failing vs succeeding files) ✅
- Fix implementation for all failing files ✅
- Re-indexing verification ✅ (245 scanned, 240 indexed/updated, 5 expected failures)

### Out of Scope
- Memory system feature additions
- Database schema changes
- Voyage model upgrades

## Success Criteria
- [x] Root cause identified with evidence (2 bugs found)
- [x] All 129+ failing files can be indexed successfully — verified: 240/245 succeed, 5 expected failures (old format/test fixtures)
- [x] No regression in currently-indexed files — verified: 230 updated, 10 newly indexed
- [x] Documentation of findings for future prevention

## Constraints
- Must not break existing indexed memories
- Must preserve original memory content
- Fixes should be systematic, not per-file manual edits
