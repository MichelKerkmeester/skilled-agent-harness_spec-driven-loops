---
title: "Implementation Plan: Phase 3 package-baseline-gates"
description: "Finalize the Pi package manifest, provenance, and baseline verification gates."
trigger_phrases:
  - "package-baseline-gates plan"
  - "raw TypeScript extension package"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/003-package-baseline-gates"
    last_updated_at: "2026-08-16T14:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Package gates green: tsc 0, 57 tests, pack 9 files, provenance added"
    next_safe_action: "Hand off to the 002-subagent-handoff workstream"
    blockers: []
    key_files: ["../../context/pi-openai-fast-mode/package.json", "../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 3 package-baseline-gates

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, raw `.ts` |
| **Framework** | Pi package/extension loader |
| **Storage** | Package manifest and lockfile |
| **Testing** | `tsc --noEmit`, Vitest, npm pack |

### Overview
Use the source and compatibility children as inputs. Finalize `pi.extensions`, `files`, peer dependencies, keywords, scripts, README provenance, and license inclusion, then run the no-emit/type/test/pack matrix. Do not install or publish here.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source and compatibility children define the implementation boundary.
- [x] Research names raw TypeScript, peers, provenance, and package checks.

### Definition of Done
- [x] Manifest loads the raw extension entry.
- [x] License and provenance checks pass.
- [x] Typecheck, Vitest, and pack dry-run pass.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-first raw source package.

### Key Components
- `package.json`: Pi manifest, metadata, peers, and scripts.
- `README.md`/`LICENSE`: user contract and attribution.
- `tsconfig.json`: strict no-emit gate.

### Data Flow
Package metadata → Pi loader resolves `./src/index.ts` → tests/typecheck → pack artifact.

**Evidence anchors**
- Raw `.ts` entry plus manifest/peer contract: installed Pi docs `packages.md:106-135` (extension manifest) and `packages.md:150,169-186` (Pi core bundles as `peerDependencies`).
- Raw `.ts` loading via jiti: loader `loader.js:2,14,358,368,468,491-492`.
- Packaging decision context: `research.md` Section 9.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pi.extensions` | Raw extension entry | Keep explicit and relative | Manifest path check |
| Pi core dependencies | Runtime-provided API | Keep as peers | Manifest diff |
| License/provenance | Attribution boundary | Preserve and document | Byte/hash and README grep |
| Settings/install | Runtime consumer | Unchanged here | Scope grep |

Peer-dependency and raw-source expectations cite `packages.md:106-135,150,169-186` and the jiti loader path `loader.js:2,14,358,368,468,491-492`; see `research.md` Section 9.

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Review the earlier child outputs and upstream package manifest.
- [x] Define expected pack file list: `package.json`, `README.md`, `LICENSE`, and `src/*.ts` (raw TypeScript; `tsconfig.json` and `tests/` are dev-only, excluded by the `files` allowlist; no `dist/`).

### Phase 2: Core Implementation
- [x] Apply package identity, keywords, `pi.extensions`, peers, and scripts.
- [x] Update README with provenance and raw-source install expectations.
- [x] Preserve MIT LICENSE and no-emit TypeScript configuration.

### Phase 3: Verification
- [x] Run `npm install` only in the fork package if needed.
- [x] Run typecheck, upstream Vitest, identity grep, and `npm pack --dry-run`.
- [x] Record output before handing off to subagent-handoff.

**Toolchain evidence**: record the Node version used (repo baseline `node >=22.19`) and confirm a lockfile is present, as part of the reproducible gate.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Manifest, license, provenance, identity | `node`, `rg`, `cmp` |
| Unit/regression | Upstream suite after earlier changes | Vitest |
| Package | Tarball name and file list | `npm pack --dry-run` |
| Type | No compiled output and strict source types | `npm run typecheck` |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-source-baseline/` | Internal | Green | No package source |
| `002-identity-config-compat/` | Internal | Green | Manifest would hide unverified engine changes |
| Node.js >=22.19 | Toolchain | Green | Gates cannot run |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Package gate fails or manifest includes compiled/stray files.
- **Procedure**: Revert this child’s manifest/docs, keep the source and compatibility children intact, and rerun the pack inventory.
<!-- /ANCHOR:rollback -->
