---
title: "Implementation Plan: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout"
description: "Make apply --relayout restore the overlay folder on a mid-run failure, refuse a sibling overlay folder outside the git repository when the context is built, branch two remedies on the case they serve, and correct the packet record. Every engine change is proven by the engine suite, with a fault-injection test for the relayout."
trigger_phrases:
  - "review remediation plan"
  - "relayout rollback design"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, built-ins only |
| **Framework** | None, the doctor overlay engine `overlay-engine.cjs` |
| **Storage** | Files: the overlay manifest, the overlay folder, `relayout-runs/<stamp>/` backups |
| **Testing** | `node --test` over `overlay-engine-*.test.cjs`, the overlay guard suite and the doctor overlay contract test |

### Overview
The engine changes land on the worktree branch `worktrees/481-overlay-framework-root-layout`, one worker at a time, in three passes: the relayout rollback, the outside-repository refusal with `overlayOutside` on the context, then the two remedies with the JSDoc and the `writeBackup` split. The docs pass runs beside the engine passes against the exact wording fixed below. The packet records are corrected on main, and phase 002's pointers are re-derived last, after the review approves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every Skilled finding confirmed against the code at `7ee80c87364` (review report §3, engine lines quoted in spec.md)
- [x] Every design choice below decided, so no worker picks one
- [x] Baseline recorded: engine 250/250, guard 20/20, contract 9/9, `route-validate` exit 0 with 32 routes

### Definition of Done
- [x] Every REQ in spec.md met with its test or inspection
- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with more than 250 tests, on the branch and on main after the merge
- [x] The guard suite, the contract test and `route-validate` exit 0 on the branch and on main
- [x] `@review` approves the code diff
- [x] Docs updated (spec/plan/tasks), and `validate.sh --strict` prints `RESULT: PASSED` for this phase, 002, 005 and the parent recursively
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-module fixes. Every engine change stays inside `overlay-engine.cjs`, and no file, option or dependency is added.

### Key Components
- **`relayoutUnderLock`**: the rename loop, the manifest write and the link retargets run inside one guard that undoes what it did.
- **`resolveOverlayDir`**: refuses a sibling outside the repository once, so every command inherits the refusal through `createContext`.
- **`createContext`**: carries `overlayOutside`, read by the four command paths that computed it.
- **The status report and `strictWriteRefusal`**: name a remedy that works for the case at hand.

### Data Flow
`main` builds the context once, through `resolveOverlayDir`, then runs one command against it. A relayout reads the manifest, plans every edit, backs up every copy it will move, moves them, writes the manifest and retargets links. On failure it reverses those steps from its in-memory record.

### Decisions

**D1. Relayout failure contract (`R1-P1-001`).**
- The guard covers every step after the backup: each `mkdir` and rename, the manifest write and `retargetRelayoutLinks`. Link retargets are inside it because a failure between the manifest write and the last retarget leaves live links naming paths that no longer exist.
- `pruneEmptyParents` for the moved-from paths moves out of the loop and runs once after every step succeeds, so a rollback never has to recreate a folder it pruned.
- Before each `mkdir`, the run records the ancestors of `move.to` that do not exist yet. Rollback removes exactly those, deepest first, when they are empty.
- Rollback order: re-point each retargeted link at the target it named before; restore the manifest from the original bytes held in memory, only when this run wrote it; rename each completed move back, in reverse order; remove the folders this run created.
- After a full rollback the run removes its own backup folder `relayout-runs/<stamp>/`, and `relayout-runs/` too when this run created it, so the overlay folder is identical to before. The backup is redundant once every copy is back.
- On failure it prints one line to stdout and returns exit 2:
  `error: relayout failed while <step>: <message>; every moved copy, the manifest and the links are back as they were`, where `<step>` is `moving <from>`, `writing the manifest` or `relinking <path>`.
- When a rollback step itself fails, it keeps the backup and prints:
  `error: relayout failed while <step>: <message>; the restore also failed at <path>: <message>; the backup at <label>/relayout-runs/<stamp> holds every moved copy and the manifest as it was`, and exits 2.
- `relayoutUnderLock` returns `EXIT_OK` on success. Today it returns `undefined`, and `main` lets that through as exit 0.
- The fault-injection test runs in-process: it replaces `fs.renameSync` so that the second call throws, calls `engine.commandRelayout(engine.createContext(tree))`, and compares a snapshot of every path under the overlay folder (type, mode, file bytes, link target, folders included) taken before and after. It adds no fault switch to the engine.

**D2. Outside-repository refusal (`R1-P2-001--6d7230d0ece0`).**
- Inside the sibling branch of `resolveOverlayDir`, after the containment check passes and only then, the engine runs `git rev-parse --show-toplevel` from the tree root. In-tree overlay folders start no git process.
- When git prints a top level, both sides are canonicalized (`/tmp` resolves to `/private/tmp` on macOS). The sibling is refused when its resolved path is outside the top level, or when the first segment of its path relative to the top level is `.git`.
- Message: `.skilled-overlays.json names a folder outside the git repository at <top>: <value>`. It keeps the words `outside the git repository`, which the existing pre-commit test matches.
- No top level (no repository, or git fails) keeps today's behaviour.
- The pre-commit check stays as a second line of defence for a context built before the setting changed, and reads `ctx.overlayOutside`.
- The overlay guard builds a context through the engine and already allows with a note when that throws, so the guard fails open on this setting error as on the others.

**D3. `overlayOutside` on the context (`R13-P2-001`).** `createContext` sets `overlayOutside: !isWithin(absoluteRoot, overlayRoot)`. `writeBackup`, the repin stage path, `commandPreCommit` and `relayoutUnderLock` read it instead of recomputing.

**D4. LAYOUT overflow remedy (`R1-P2-001--4f4ffdfd250a`).** The hidden tail is `offLayout.slice(20)`. With `B` of its `N` moves under `root/skilled` and `M = N - B`:
- `B = 0`: `LAYOUT   … N more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout` (unchanged)
- `M = 0`: `LAYOUT   … N more under root/skilled; change the destination or remove the entry`
- both: `LAYOUT   … N more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout for M, and change the destination or remove the entry for the B under root/skilled`

**D5. Strict-write remedy for a removed path (`R11-P2-001`).** In the managed branch of `strictWriteRefusal`, when the holder is a `skill-root` entry and `holder.relative` equals or sits under a path `R` on its `remove` list, the line reads:
`refuse: <key> is under <R>, which overlay <id> removes on every apply; take <R> off that entry's remove list, add <relative> to its replace list, keep its copy at <overlay>/<source>/<relative>, then run <engine> apply`.
A path on the `replace` list keeps today's line.

**D6. JSDoc and readability (`R2-P2-001--4e5c79954247`, `R13-P2-002`).** The `layoutMoves` JSDoc states the rule: a `.skilled/X` destination lays out at `framework/X`, any other `X` at `root/` plus `X` with its leading dots dropped. `writeBackup` loops over the tree area and the overlay area in two plain passes through one helper, so the `if (area) continue` asymmetry reads as a branch of the tree pass. No behaviour changes.

**D7. Docs (`R8-P2-001`).** The presentation contract's LAYOUT row and example, and `references/overlays.md`, state both per-line remedies (`run … apply --relayout` and `change the destination or remove the entry`) and the D4 overflow forms. `references/overlays.md` also states the D1 failure contract beside the relayout backup, and the D2 refusal in place of the pre-commit-only sentence.

**D8. Record corrections.** Phase 005 AC-008 and AC-009 are reworded to the bar actually measured, no failure beyond the baseline set of 11 pre-existing failures, with the deviation named, and stay Met against that reworded bar. Phase 004's implementation summary records that the re-pin left both Barter OpenCode plugins unloadable until ai-speckit `a954fc956ce`. Phase 002's spec line pointers and caller count are re-derived from the merged code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms each finding at `7ee80c87364` and records the four baseline gates. Implementation lands D1, then D2 with D3, then D4 to D6 in `overlay-engine.cjs` one worker at a time, with D7 and D8 alongside. Verification reruns the four gates on the branch, takes an `@review` approval, merges into main and reruns every gate and strict validation there. `tasks.md` holds the ordered tasks and their state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` must exit 0 with the new tests: the relayout fault-injection test (D1), outside-repository refusals for a sibling link and for `../.git` plus the no-repository case (D2), the mixed overflow line (D4) and the removed-path remedy (D5).
- `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` must stay 20/20, since the guard builds a context through the engine.
- `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` must pass after D7, and `bash .skilled/commands/doctor/scripts/route-validate.sh` must exit 0 with 32 routes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `git` binary, already used by the engine's pre-commit and repin paths. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an engine gate fails on main after the merge. Revert the merge commit with `git revert -m 1 <merge>` on main; the packet doc commits stand on their own.
<!-- /ANCHOR:rollback -->

---
