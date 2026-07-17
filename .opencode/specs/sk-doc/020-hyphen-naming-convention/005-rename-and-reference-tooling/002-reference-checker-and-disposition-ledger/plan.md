---
title: "Implementation Plan: reference checker and disposition ledger (032 phase 005.002)"
description: "Implementation plan for a read-only whole-repository reference checker: enumerate tracked files and symlinks, resolve code and path-valued references, classify dynamic sites, and validate a complete disposition ledger against the semantic rename map."
trigger_phrases:
  - "reference checker implementation plan"
  - "disposition ledger schema plan"
  - "dynamic reference completeness plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the reference checker implementation plan"
    next_safe_action: "Implement tracked-file enumeration and ledger schema validation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The checker is read-only; reports and ledger output are evidence, not migration writes."
      - "Completeness is proven by reconciling the scanned manifest, map rows, extracted references, and dynamic-site rows."
---
# Implementation Plan: Reference Checker and Disposition Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Whole-repository reference verification and ledger output |
| **Change class** | Read-only resolver and completeness gate |
| **Execution** | Map-aware scan; no production rename or reference rewrite |

### Overview
The checker enumerates the tracked repository and symlink entries, extracts path references, and dispatches them to resolver
adapters for JS/TS modules, Markdown, data/config path values, shell sourcing, registries, and symlink targets. It reconciles
those observations with the semantic rename map and emits a ledger in which every rename row and dynamic site has an explicit
decision, rationale, status, and evidence. A zero-file scan or unresolved/ambiguous/undispositioned result is a failure.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001's semantic map and operation-state fields are stable enough to identify source and target paths.
- [ ] The scan root and tracked-file manifest rules are explicit, including symlink entries and generated/lockfile handling.
- [ ] Resolver coverage is enumerated for JS/TS, Markdown, JSON/YAML/TOML path values, shell, registries, and symlinks.
- [ ] The ledger distinguishes map-entry rows from dynamic-site rows and defines terminal statuses.

### Definition of Done
- [ ] A non-empty scan proves coverage across every supported reference class.
- [ ] Every map entry and dynamic `require`, `source`, and glob site has a valid ledger row.
- [ ] Missing, ambiguous, stale, zero-scan, and invalid-ledger states fail non-zero.
- [ ] The checker does not execute repository code or alter identifiers, keys, frontmatter fields, or production references.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manifest-driven scan with resolver adapters and a ledger completeness gate.

### Key Components
- **Tracked manifest**: enumerates files, symlinks, path modes, and scan exclusions; rejects an empty result.
- **Reference extractor**: emits typed observations with path, line or field location, raw value, and dynamic/static flag.
- **Resolver adapters**: cover JS/TS module resolution, Markdown links, data/config path values, shell sourcing, registries,
  and symlink targets without executing arbitrary code.
- **Map reconciler**: relates source and target paths to map entries and checks pre-rename or post-rename expectations.
- **Dynamic-site classifier**: requires an explicit disposition for dynamic `require`, `source`, and glob expressions.
- **Ledger validator**: enforces unique map rows, complete evidence, terminal statuses, and non-zero failure semantics.

### Data Flow
The manifest is scanned first and becomes the coverage denominator. Extractors produce typed observations, adapters resolve them
against the selected repository state and semantic map, and the reconciler emits map-entry and dynamic-site ledger rows. The
validator rejects any map row or observed dynamic site without a terminal disposition and returns the final gate result.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase 001 semantic map | Rename truth | Consume source, target, class, closure, and operation-state data | Every map entry reconciles to one ledger row |
| JS/TS module graph | Import resolution | Resolve relative, extension, index, and mapped module paths | Missing and ambiguous modules fail |
| JSON/YAML/TOML and frontmatter | Path-valued references | Inspect values that contain filesystem paths; leave keys and fields untouched | Value/key fixtures show the boundary |
| Shell and registries | Runtime entrypoints | Resolve `source`, executable paths, and registry path values | Planted stale paths are reported with location evidence |
| Symlinks and generated/frozen surfaces | Non-regular references and exemptions | Inspect symlink targets and report excluded references without executing or rewriting them | Modes and skip rationale are present in the ledger |
| Dynamic expressions | Incomplete static resolution | Emit a disposition row requiring explicit resolution or rationale | No dynamic site remains undispositioned |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Define the ledger schema, terminal statuses, map-state modes, scan exclusions, and resolver coverage matrix.
- Seed one minimal repository per reference class so the checker cannot pass with a zero or single-surface scan.

### Phase 2: Implementation
- Implement tracked-file and symlink enumeration, typed extraction, resolver adapters, and map reconciliation.
- Implement dynamic-site disposition, ledger validation, zero-scan failure, and unresolved/ambiguous failure semantics.

### Phase 3: Verification
- Run the checker against planted code, docs, configuration, shell, registry, symlink, exemption, and dynamic-site fixtures.
- Compare the ledger row count and statuses with the map and extraction manifest; confirm no tracked file is changed.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Path-value extraction, key/identifier exclusion, ledger schema and status validation | Resolver and ledger test runner |
| Integration | JS/TS, Markdown, data/config, shell, registry, symlink, and dynamic-site resolution | Disposable fixture repositories |
| Failure-mode | Zero scan, missing target, ambiguity, stale source, undispositioned dynamic site | Exit-code assertions and report inspection |
| Non-mutation | Read-only scan against a repository with a clean index | Git status and content hash comparison |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 semantic map and operation report | Internal contract | Planned predecessor | The checker cannot relate references to intended renames |
| Phase 001 policy exemptions | Internal policy | Defined | The checker could misclassify Python, generated, or tool-mandated paths |
| Phase 003 fixture corpus | Internal verification consumer | Planned successor | End-to-end coverage cannot exercise the full resolver matrix |
| Git tracked-file and symlink metadata | Runtime input | Required | Whole-repo completeness cannot be measured |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Resolver implementation changes scan scope, alters path-value/key boundaries, or produces incomplete ledger rows.
- **Procedure**: Revert the checker and report changes in a path-scoped commit, discard generated evidence, and rerun the fixture
  contract. The checker performs no production rename or reference rewrite, so rollback has no data migration component.
<!-- /ANCHOR:rollback -->
