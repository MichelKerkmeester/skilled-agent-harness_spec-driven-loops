---
title: "Feature Specification: Vendor and Repoint deep-pi"
description: "Vendor the patched deep-pi fork in-repo at .pi/extensions/deep-pi/ and repoint .pi/settings.json to it, applying phase 003's own established mechanism from the start instead of hosting externally first."
trigger_phrases:
  - "deep-pi vendor"
  - "deep-pi repoint"
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
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 003's own vendored copy (.pi/extensions/pi-cache-optimizer/) is currently untracked in git — confirmed via git ls-files/git status. Vendoring alone doesn't fully deliver 'survives a fresh checkout' until committed; that's a separate, standing operator decision (commit only when asked), not something this phase completes unilaterally. This phase's own vendored copy at .pi/extensions/deep-pi/ is in the same untracked state."
      - "REQ-011/012/013/014 all confirmed with real commands: diff -rq on extensions/ and tests/ both exit 0, direct diff on the two patched files exit 0, no node_modules/.git vendored, pi list resolves the local path with no duplicate npm entry."
      - "A HANDOFF gpt-5.6-sol review of phase 1's work found 4 confirmed gaps after this phase's first vendoring pass had already run. Once phase 1 fixed them, this phase re-vendored a second time (same copy mechanism, same files) and re-confirmed diff -rq -- extensions/ and diff -rq -- tests/ both still exit 0 against the corrected fork — the vendored copy did not silently diverge."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Vendor and Repoint deep-pi

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-fix-and-test-deep-pi |
| **Successor** | 003-live-verification-and-closeout |
| **Handoff Criteria** | Patched fork's runtime files copied into `.pi/extensions/deep-pi/`, byte-identical diff confirmed, `.pi/settings.json` repointed, `pi list` confirms resolution — met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the 006 "Fork and Improve deep-pi" work — moving the patched fork from phase 1's working clone into this repo's live, resolvable configuration.

**Scope Boundary**: Touches only this repo's `.pi/extensions/deep-pi/` (new) and `.pi/settings.json` (the `@arter/deep-pi` package entry). Does not touch the fork's own source further (phase 1 already finished patching it) or run any live Pi session (phase 3).

**Dependencies**:
- Phase 1 (`001-fix-and-test-deep-pi`) complete — a patched, tested fork must exist before it can be vendored
- Phase 003's established local-package-source mechanism (`003-fork-and-guard-cache-optimizer/spec.md` §7, "Delivery mechanism update") — this phase applies the same approach from the start, not retrofitted after an external-hosting detour

**Deliverables**:
- `.pi/extensions/deep-pi/` containing the patched fork's runtime files
- `.pi/settings.json`'s `@arter/deep-pi` entry repointed from `npm:@arter/deep-pi@1.0.0` to the local vendored path
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 produces a patched fork in a working clone outside this repo. Left there, it's not what Pi actually loads — the installed `npm:@arter/deep-pi@1.0.0` package (unpatched) stays active until `.pi/settings.json` points somewhere else. Phase 003 already worked through this exact problem for `pi-cache-optimizer`: it initially hosted its fork externally on GitHub, then migrated to an in-repo vendored copy at operator request, documenting the mechanism and the lesson. This phase applies that established mechanism from the start.

### Purpose
Get the patched fork's runtime files into `.pi/extensions/deep-pi/`, tracked by this repo like the project's other `.pi/extensions/*` entries, and repoint `.pi/settings.json` so Pi actually loads it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Copy the patched fork's runtime-needed files (`extensions/`, `package.json`, `tsconfig.json`, `LICENSE`, `README.md`, and the relevant `tests/` for future re-verification) into `.pi/extensions/deep-pi/`
- Confirm the vendored copy is byte-identical to the patched fork via `diff`
- Update `.pi/settings.json`'s `packages` entry for `@arter/deep-pi` from `npm:@arter/deep-pi@1.0.0` to the bare local path (Pi's `local` package-source type — no `npm:`/`git:` prefix), matching `003-fork-and-guard-cache-optimizer`'s `extensions/pi-cache-optimizer` entry exactly in form
- Confirm via `pi list` that the local source resolves to the vendored path

### Out of Scope
- Patching the fork further — phase 1's job, already done by the time this phase starts
- Live Pi sessions or behavioral verification — phase 3
- Committing the vendored copy to git — a separate, standing operator decision (commit only when asked); this phase can only get the files onto disk and configured, not guarantee they survive a fresh checkout until committed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/deep-pi/` | Create | Vendored copy of the patched fork's runtime files |
| `.pi/settings.json` | Modify | Repoint `@arter/deep-pi` from `npm:@arter/deep-pi@1.0.0` to the local vendored path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Patched fork vendored in-repo, not externally hosted | `.pi/settings.json`'s `packages` array resolves `@arter/deep-pi` via a bare local path (Pi's `local` source type), matching the mechanism `003-fork-and-guard-cache-optimizer` uses today. Non-deferrable — this is a stated deliverable and success criterion, not an optional nicety |
| REQ-011 | Vendored copy is byte-identical to the patched fork | `diff` between `.pi/extensions/deep-pi/extensions/` and the patched fork's `extensions/` shows zero differences |
| REQ-012 | `pi list` confirms resolution to the vendored path, no duplicate npm entry | `pi list` output shows `@arter/deep-pi` resolved to `<repo>/.pi/extensions/deep-pi`, and no `npm:@arter/deep-pi@1.0.0` entry remains active |
| REQ-013 | Only the intended runtime files are vendored, nothing extra | `.pi/extensions/deep-pi/` contains exactly `extensions/`, `package.json`, `tsconfig.json`, `LICENSE`, `README.md`, `tests/` — no working-clone artifacts (`.git/`, `node_modules/`, build output) copied in by mistake |

### P2 - Optional (defer or cut without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-014 | Vendored copy's diff against the pinned commit matches phase 1's approved diff exactly | Vendoring relocates the patch, it doesn't re-scope it — a mismatch here would mean the vendored copy silently diverged from what phase 1 actually tested |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The patched fork lives in-repo with no external-hosting detour
- **SC-002**: `pi list` resolves `@arter/deep-pi` to the in-repo vendored path, not npm
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 (`001-fix-and-test-deep-pi`) complete | Vendoring an unpatched or untested fork just relocates the same problems | This phase's Predecessor field enforces the sequence; the handoff criteria require phase 1's full test suite green first |
| Dependency | Phase 003's in-repo vendoring precedent | Phase 003's own vendored copy is currently untracked in git — "survives a fresh checkout" isn't fully proven until committed | Both phases share the same `.pi/extensions/` convention and the same pending-commit state; a commit decision covers both, per standing operator policy (commit only when asked) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — the vendoring mechanism is already established and proven by phase 003; this phase is a straightforward application of it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../001-fix-and-test-deep-pi/spec.md`
- **Successor**: `../003-live-verification-and-closeout/spec.md`
- **Related**: `../../003-fork-and-guard-cache-optimizer/spec.md` §7 (the established mechanism this phase applies)
