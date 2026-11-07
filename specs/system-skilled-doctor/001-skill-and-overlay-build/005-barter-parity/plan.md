---
title: "Implementation Plan: Phase 5: barter-parity"
description: "Five engine changes in overlay-engine.cjs with tests, doc and routing changes for adoption, and Barter's adoption of the engine, proven by the upstream status passing on Barter's real tree and the doctor suite matching its baseline."
trigger_phrases:
  - "barter parity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: barter-parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, standard library only |
| **Framework** | None |
| **Storage** | JSON files: the overlay manifest and `sync-state.json` |
| **Testing** | `node --test`, plus vitest for the advisor drift guard |

### Overview
The engine gains a per-entry protected-path block, `.dsh` in its default runtime folders, a not-copied list and a stage-skip line in the re-pin report, and a missing-manifest error that names the setting file. The docs and doctor routes teach adoption, and Barter's tree adopts the engine with a setting file, one `protectedPaths` list and a `repin` block. The proof is the upstream `status` passing on Barter's real tree, a test per behavior that fails without it, and the doctor suite against its baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` fails only the six agents-md tests that fail on the base commit
- [ ] `overlay-engine.cjs status --root barter/ai-speckit/skilled` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single CLI engine.

### Key Components
- **`overlay-engine.cjs`**: plans, classifies, applies and re-pins overlays; every change in this phase lands here.
- **`/doctor:overlay` assets**: the workflow YAML and presentation text that turn engine lines into the operator's plan and results.
- **`_routes.yaml` and the derived advisor bridges**: route a described problem to the command.

### Data Flow
`assertSafeToPlan` now returns the refused entries instead of throwing. `analyze` gives each one a plan stub with no outputs, so nothing reads it, and `runCheck`, `apply` and `repin` already report and refuse a plan with problems. The re-pin computes the not-copied list from one `git diff` between the two commits, after the drift and shape checks and before the backup.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures Barter and the test baseline, Implementation makes the engine, doc and Barter changes, and Verification reruns every gate from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs`, compared with the baseline of 1,065 tests, 1,059 passing and six agents-md failures on the base commit.
- A mutation pass: each new behavior is removed from a copy of the engine in turn, and its test must fail.
- `doctor-phrase-reach.cjs` must print `STATUS=OK`, and the advisor's vitest suite must not regress.
- Live checks on Barter's tree: the upstream `status`, Barter's own `replay.cjs --check` and `sync.cjs --status`, and a staged re-pin onto this branch's commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. The advisor runtime is rebuilt with its own `npm run build` after the bridge files are regenerated.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Skilled: revert the commit. Barter: restore `skilled/barter-overlays/overlay-manifest.json` from the backup in the session scratchpad, whose SHA-256 starts `e9c387e148e4af6c`, and delete `skilled/.skilled-overlays.json`. Barter's fork reads neither change, so it keeps working either way.
<!-- /ANCHOR:rollback -->

---


<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assertSafeToPlan` and `analyze` in `overlay-engine.cjs` | Refuse protected reads | update: per-entry block | `overlay-engine-fixes.test.cjs`, mutation pass |
| `commandGuard` | Answers the guard hook | unchanged: it never calls `analyze` | `overlay-engine.cjs:2399` reads the manifest only |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` | Inert fast path, then the engine | not a consumer of the new messages | it allows on two stats before the engine runs |
| `repinUnderLock` | Re-pin preconditions | update: refuse a refused overlay before the backup | `overlay-engine-repin.test.cjs` |
| `doctor-overlay-presentation.txt` | Renders engine lines | update: plan lines and troubleshooting rows | read-through |
| Barter's `replay.cjs` and `sync.cjs` | Barter's fork | not a consumer: ignores the new keys | both still pass on Barter's tree |

Algorithm invariant: no entry with a protected path has its bytes read or written. Adversarial cases tested: a walked token file in a `directory` and a `skill-root` entry, an unlisted token file beside a listed one, and an exact `file` entry naming a `.env` file.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research synthesis | Implementation |
| Implementation | The measured baseline | Verification |
| Verification | Every implementation task | Commit and push |
<!-- /ANCHOR:phase-deps -->

---
