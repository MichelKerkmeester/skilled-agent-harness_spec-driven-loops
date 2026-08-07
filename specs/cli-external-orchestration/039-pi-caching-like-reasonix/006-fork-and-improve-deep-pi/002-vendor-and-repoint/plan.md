---
title: "Implementation Plan: Vendor and Repoint deep-pi"
description: "Copy the patched deep-pi fork into .pi/extensions/deep-pi/, confirm byte-identical, and repoint .pi/settings.json to the local path."
trigger_phrases:
  - "deep-pi vendor plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/002-vendor-and-repoint"
    last_updated_at: "2026-08-07T20:22:03Z"
    last_updated_by: "spec-author"
    recent_action: "Re-vendored after HANDOFF fixes; diff -rq still exits 0"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Vendor and Repoint deep-pi

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension), JSON config |
| **Framework** | Pi coding-agent local package-source mechanism |
| **Storage** | Filesystem copy under `.pi/extensions/deep-pi/` |
| **Testing** | `diff` for byte-identity; `pi list` for resolution |

### Overview
Copy phase 1's patched fork into `.pi/extensions/deep-pi/`, confirm the copy is byte-identical via `diff`, and repoint `.pi/settings.json`'s `@arter/deep-pi` package entry from `npm:@arter/deep-pi@1.0.0` to the bare local path. This is the exact same mechanism `003-fork-and-guard-cache-optimizer` uses for `pi-cache-optimizer` today, applied from the start rather than after an external-hosting detour.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 complete: patched fork exists with a green test suite (60/60, final — 57/57 at this phase's first pass, re-confirmed 60/60 after the HANDOFF review's fixes and this phase's second vendoring pass)

### Definition of Done
- [x] `.pi/extensions/deep-pi/` contains the patched fork's runtime files
- [x] `diff` confirms the vendored copy is byte-identical to the patched fork
- [x] `.pi/settings.json` repointed; `pi list` confirms resolution to the local path
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local package-source vendoring, identical to `003-fork-and-guard-cache-optimizer`'s established mechanism: a bare path (no `npm:`/`git:` prefix) in `.pi/settings.json`'s `packages` array is parsed by Pi's `package-manager.js` as its `local` source type, resolved directly against the project's `.pi/` directory — no clone, no copy, no network involved at resolution time.

### Key Components
- **`.pi/extensions/deep-pi/`**: the vendored copy — `extensions/`, `package.json` (carries the `pi.extensions` field Pi reads to find the entry file), `tsconfig.json`, `LICENSE`, `README.md`, `tests/`
- **`.pi/settings.json`**: the `packages` array entry, changed from `npm:@arter/deep-pi@1.0.0` to `extensions/deep-pi` (bare path, resolved relative to `.pi/`)

### Data Flow
Pi reads `.pi/settings.json`'s `packages` array at startup → resolves each entry via `parseSource()` → a bare path resolves as `local` type → `getInstalledPath()` resolves it directly against `.pi/` with no clone/copy step → Pi loads `extensions/deeppi.ts` per the vendored `package.json`'s `pi.extensions` field.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 1 (`001-fix-and-test-deep-pi`) is Complete before proceeding

### Phase 2: Core Implementation
- [x] Copied the patched fork's runtime files into `.pi/extensions/deep-pi/` (`extensions/`, `package.json`, `tsconfig.json`, `LICENSE`, `README.md`, `tests/`)
- [x] Updated `.pi/settings.json`'s `packages` entry from `npm:@arter/deep-pi@1.0.0` to `extensions/deep-pi`

### Phase 3: Verification
- [x] `diff -rq` on the vendored `extensions/` and `tests/` trees against the patched fork both exit 0; direct file `diff` on the two patched files also exit 0
- [x] `pi list` confirms `extensions/deep-pi` resolves to `<repo>/.pi/extensions/deep-pi`, no duplicate npm entry
- [x] Re-vendored a second time after the HANDOFF review's 4 confirmed findings were fixed in phase 1 (copied the corrected `deeppi.ts`, `telemetry.ts`, and all of `tests/`); `diff -rq` re-run and still exits 0 against the corrected fork — the vendored copy did not silently diverge across the two passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Diff-based | Vendored copy matches the patched fork exactly | `diff` |
| Resolution | `.pi/settings.json` resolves to the vendored path, not npm | `pi list` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (`001-fix-and-test-deep-pi`) complete | Internal (this packet) | Green (Complete, confirmed before this phase's own work began) | Vendoring an unpatched or untested fork just relocates the same problems |
| Phase 003's local-source mechanism, already proven | Internal (parent packet) | Green (Complete) | Nothing new to invent — direct application |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The vendored copy doesn't resolve correctly, or diverges from the patched fork
- **Procedure**: Revert `.pi/settings.json`'s `packages` entry back to `npm:@arter/deep-pi@1.0.0` (the unpatched, currently-installed version). No data migration needed — `deep-pi` keeps no persistent state file.
<!-- /ANCHOR:rollback -->
