---
title: "Implementation Plan: Phase 8: overlay-first-write-checks"
description: "Port Barter's four vendored-tree write checks into the overlay engine behind one manifest key, reusing the engine's own ownership test, and add a root-file line to the re-pin report. The guard hook needs no code change because it already forwards every path to the engine."
trigger_phrases:
  - "overlay first write checks plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: overlay-first-write-checks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS, Node standard library only |
| **Framework** | None |
| **Storage** | The overlay manifest and `sync-state.json` in the overlay folder |
| **Testing** | `node --test` |

### Overview
The engine gains one section, "Strict Writes", that holds the new checks. `commandGuard` calls it after its existing ownership loop, so a manifest without the key takes the old path untouched. Ownership comes from the engine's existing `managedPathTest`, which the re-pin's drift scan already uses, so the edit-time check and the re-pin check agree on what an overlay owns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test` over the overlay engine tests, the contract test and the hook test prints `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One command-line script with a section per concern. The guard hook stays a thin caller of that script.

### Key Components
- **`strictWriteRefusal`**: returns one refusal line for a write under a vendored root that no overlay owns, or null. It is the only new call in `commandGuard`.
- **`writeCheckSettings`**: reads the vendored roots and `repin.rootFiles` through `repinSettings`, and compiles the `generated` globs.
- **`adoptUnderLock`**: resolves the path, refuses what it cannot own, copies it into the overlay folder, appends the entry through `appendOverlayEntry` and calls `applyUnderLock`.
- **`appendOverlayEntry`**: inserts the entry after the last element of `overlays` in the manifest text, so every other byte of the file stays.
- **`stagedUnownedChanges`**: reads `git diff --cached` and filters it through `managedPathTest`, the `generated` globs and upstream's blobs.
- **`rootFileChanges`**: lists the `repin.rootFiles` paths upstream changed between the two commits of a re-pin.

### Data Flow
A write reaches the `overlay-guard` hook, which runs `overlay-engine.cjs --guard <path>`. The engine loads the manifest, runs its existing ownership loop, and then `strictWriteRefusal`. Exit 1 with a `refuse:` line makes the hook deny. A refused path is brought under an overlay with `apply --adopt <path>`, after which the existing loop owns it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches a shared contract, the engine's `--guard` answer, so its callers are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `overlay-engine.cjs` `commandGuard` | Owns the `--guard` answer | Update: one call added before `allow` | The pre-existing engine tests pass unchanged |
| `overlay-guard/lib/overlay-guard.cjs` `guardOne` | Reads exit 1 plus a `refuse:` line as deny | Unchanged | One new hook test denies on a strict refusal |
| `doctor-overlay-apply.yaml`, `_routes.yaml`, `overlay.md`, presentation | Describe the apply route's flags and engine calls | Update | `doctor-overlay-contract.test.cjs` and `route-validate.sh` |
| `command-contract.json` | Carries the overlay hint and loader lines | Update | The contract test's last case |
| Runtime command mirrors | Mirror `overlay.md` | Unchanged by hand | `sync-runtime-mirrors.cjs --check` |

Required inventories:
- Callers of `--guard`: `rg -n "'--guard'" .skilled --glob '*.cjs' --glob '*.mjs' --glob '*.ts'` names the hook core and the tests.
- Documents naming the apply flags: `rg -l 'capture <path>' .skilled README.md`.
- Matrix axes for the guard: setting on or off, path existing or new, path owned, unowned, generated or git-ignored, and path under `.skilled`, a runtime folder, a named root file or elsewhere.
- Invariant: with the setting off, the guard's output for any path equals its output before the change.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None separate. The engine is tested through its command line | `node --test` |
| Integration | The guard, adopt, the commit check and a staged re-pin, each against a throwaway upstream repository and a vendored tree that is its own git repository | `node --test`, `git` |
| Contract | The route manifest, router, presentation and workflow against the engine's parser | `doctor-overlay-contract.test.cjs`, `route-validate.sh` |
| Manual | The two `--guard` calls in the spec, on the engine before and after the change | `node` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` on the PATH | External | Green | The ignore test, the commit check and the upstream read all call it. The engine already needs it for a re-pin |
| The engine's `managedPathTest` and `repinSettings` | Internal | Green | The new checks would need their own ownership test |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A vendoring project reports the guard refusing a write it must allow, and the `generated` list cannot express it.
- **Procedure**: Remove `strictWrites` from that project's manifest, which turns every new check off. To remove the code, revert the commit that carries this phase. Nothing is migrated and no stored format changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The handover and Barter's `sync.cjs` read in full | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing the packet |
<!-- /ANCHOR:phase-deps -->

---
