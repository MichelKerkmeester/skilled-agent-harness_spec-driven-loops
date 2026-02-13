# Plan: Phase 17 — workflows-code--opencode Alignment

## Audit Results Summary

### Aggregate Violation Counts

| Agent | Domain | Files | P0 | P1 | P2 | Total |
|-------|--------|-------|-----|-----|-----|-------|
| 01 | mcp_server TS | 62 | 99 | ~195 | ~15 | ~309 |
| 02 | mcp_server handlers TS | 10 | 10 | 47 | 7 | 64 |
| 03 | mcp_server lib JS | 1 | 2 | 5 | 1 | 8 |
| 04 | shared/embeddings TS | 6 | 11 | 48 | 5 | 64 |
| 05 | shared/ other TS | 6 | 10 | 13 | 7 | 30 |
| 06 | scripts/ JS | 13 | 13 | 38 | 13 | 64 |
| 07 | scripts/ Shell | 27 | 18 | 41 | 27 | 86 |
| 08 | scripts/ Python | 1 | 2 | 3 | 2 | 7 |
| 09 | Config/JSON | 10 | 1 | 8 | 4 | 13 |
| 10 | Skill gap analysis | — | — | — | — | — |
| **TOTAL** | | **136** | **166** | **398** | **81** | **645** |

### Skill Gap Analysis (Agent 10)

- **9 undocumented code patterns** (skill doesn't cover them)
- **25+ stale/broken evidence citations** (reference `.js` files that are now `.ts`)
- **3 critical skill updates** needed immediately

---

## Two-Track Remediation Plan

### Track A: Skill Updates (workflows-code--opencode)

Priority order — all edits in Public repo `.opencode/skill/workflows-code--opencode/`.

#### A1. Update TypeScript Header Template (P0)

**File**: `references/typescript/style_guide.md` Section 1

**Current** (wrong):
```typescript
// ============================================================================
// MODULE: [Module Name]
// ============================================================================
```

**Should be** (matching all 62+ TS files):
```typescript
// ---------------------------------------------------------------
// MODULE: [Module Name]
// ---------------------------------------------------------------
```

Rationale: Zero files in the codebase use the `====` format. The `----` format is the established convention. Changing 62+ files to match the skill is backwards.

#### A2. Fix All JavaScript Evidence Citations (P0)

**Files**:
- `references/javascript/style_guide.md` — 6+ citations
- `references/javascript/quality_standards.md` — 6+ citations
- `references/shared/code_organization.md` — 4+ citations
- `references/shared/universal_patterns.md` — 4+ citations

All references to `.js` files that have been migrated to `.ts` must be updated. Key renames:
- `context-server.js` → `context-server.ts`
- `config.js` → still `.js` (verify)
- `memory-search.js` → `memory-search.ts`
- `core.js` → `core.ts`

Also update line number references (migration may have shifted them).

#### A3. Update SKILL.md File Counts and Evidence Files (P0)

**File**: `SKILL.md` Section 3

- "206 files" for JavaScript → update to actual count (~65 JS, ~341 TS)
- Evidence files table: update file extensions
- Add note about mixed JS/TS transitional state

#### A4. Update MCP Server Structure Diagram (P1)

**File**: `references/shared/code_organization.md` Section 3

The directory tree shows all `.js` extensions. Update to `.ts` and add the 12+ missing directories:
`formatters/`, `lib/cognitive/`, `lib/cache/`, `lib/session/`, `lib/scoring/`, `lib/config/`, `lib/response/`, `lib/validation/`, `lib/architecture/`, `lib/parsing/`, `lib/providers/`, `scripts/`

#### A5. Document snake_case Exception for DB-Mapped Properties (P1)

**File**: `references/typescript/style_guide.md` Section 4 (new subsection)

Add exception guidance: TypeScript interfaces that mirror SQLite column names MAY use snake_case properties with a justification comment. Recommend a mapping layer pattern for new code.

#### A6. Document Block-Comment Section Divider Pattern (P1)

**File**: `references/typescript/style_guide.md` Section 3

Document that `/* --- N. SECTION --- */` block-comment format is acceptable alongside `// ---` line-comment format. 27+ files use this pattern.

#### A7. Add Test File Exemption Tier (P1)

**File**: `references/javascript/quality_standards.md` (new section)

CLI-only test runners and setup scripts are exempt from:
- `module.exports` requirement
- Guard clause requirement
- `[module-name]` error prefix requirement

#### A8. Document Mixed JS/TS Coexistence (P2)

**File**: `references/typescript/style_guide.md` (new section)

Document patterns for:
- TypeScript files importing JavaScript modules
- Dynamic `require()` with try-catch for optional dependencies
- `'use strict'` only in `.js` files, never in `.ts`
- Backward-compatible export aliases during migration

#### A9. Update tsconfig outDir Documentation (P2)

**File**: `references/typescript/quality_standards.md` Section 9

Update baseline from `"outDir": "."` to `"outDir": "./dist"` to match actual workspace configurations.

---

### Track B: Code Fixes (system-spec-kit)

#### B1. Remove `'use strict'` from All .ts Files (P0 — Mechanical)

**Scope**: 37+ TypeScript files retain the JavaScript-era `'use strict'` directive
**Fix**: Automated removal (codemod or batch sed)
**Risk**: None — tsconfig `"strict": true` handles this

#### B2. snake_case → camelCase Interface Migration (P1 — Cross-Cutting)

**Scope**: `IEmbeddingProvider` interface + 3 provider classes + all callers
**Properties**: `model_name` → `modelName`, `is_healthy` → `isHealthy`, `request_count` → `requestCount`
**Methods**: `embed_document` → `embedDocument`, `embed_query` → `embedQuery`, `get_metadata` → `getMetadata`, `get_profile` → `getProfile`, `health_check` → `healthCheck`, `make_request` → `makeRequest`
**Risk**: HIGH — affects mcp_server callers. Needs dedicated spec folder (Phase 18+).

#### B3. Create shared/index.ts Barrel File (P1)

**Scope**: Missing centralized export surface for shared/
**Fix**: Create `shared/index.ts` with re-exports from types, embeddings, utils, scoring

#### B4. Fix Shell Strict Mode (P1)

**Scope**: 7 shell scripts with incomplete `set -euo pipefail`
**Fix**: Add `-u` flag or document the bash 3.2 empty-array compatibility reason

#### B5. Fix filters.jsonc snake_case Keys (P2)

**Scope**: 6 property keys in `config/filters.jsonc`
**Fix**: Rename to camelCase + update all code reading these keys

#### B6. Fix TS File Headers to Consistent Format (P2 — Depends on A1)

**Scope**: After skill standard is finalized (A1), verify all TS file headers match
**Note**: Currently all 62+ files are consistent with EACH OTHER, just not with the (wrong) skill template

---

## Execution Priority

| Phase | Items | Effort | Dependency |
|-------|-------|--------|------------|
| **Immediate** | A1, A2, A3 | Medium | None — skill-only changes |
| **Short-term** | A4-A7, B1, B3, B4 | Medium | A1 must complete first for B6 |
| **Deferred** | A8, A9, B2, B5, B6 | High | B2 needs dedicated Phase 18 spec |

## Decision Record

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Skill adapts to code (not vice versa) for header format | 62+ files use `----` consistently; changing all files is wasteful |
| D2 | snake_case rename is Phase 18+, not Phase 17 | Cross-cutting change affecting interface contracts needs isolation |
| D3 | `'use strict'` removal is mechanical, safe to batch | tsconfig `strict: true` provides compiler-level enforcement |
| D4 | Test file exemption tier is additive, not breaking | Adds coverage for patterns the skill never addressed |
| D5 | outDir `./dist` is the de facto standard | All 3 workspace tsconfigs use it; skill should document reality |
