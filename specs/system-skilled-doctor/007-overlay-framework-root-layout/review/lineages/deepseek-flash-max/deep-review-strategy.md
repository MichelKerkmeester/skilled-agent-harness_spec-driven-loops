# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER

- Target: `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder, five phases 001-005)
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: convergence threshold 0.10 on the severity-weighted new-findings ratio, or maxIterations 24, whichever comes first
- Success criteria: every configured dimension covered at least once, both core traceability protocols recorded, no unexamined P0 left active
- Operator review focus: the whole overlay framework/root layout change end to end (Skilled `57c01fb4c11..d42bafc890c` merged as `063daaee2c1` plus `1653734af7d` and `10c36989450`; ai-speckit `64cfee51628..ad3246feba2`), covering engine correctness, path safety, hook fail-open/fail-closed behavior, the old-layout migration, test strength, docs against code, and leftover `barter-overlays` references.

---

## 2. TOPIC

Review of the overlay framework/root source layout change: moving a consumer's overlays out of the vendored tree into a sibling `overlays/` folder with `framework/` and `root/` source roots, and Barter's migration onto that layout.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Removing old-layout or in-tree overlay support (explicitly out of scope per decision D6)
- Overlay content changes beyond paths
- Spec history under `ai-speckit/specs/`
- Line-by-line review of every vendored file in the Barter re-pin; the parity check is limited to engine-relevant files

---

## 5. STOP CONDITIONS

- Convergence: severity-weighted new-findings ratio below 0.10 after the minimum iteration floor
- maxIterations 24 reached
- Three consecutive failed iterations
- Frontier drained with every dimension covered

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading a function's own comment for the invariant it claims, then checking every statement that must uphold it: found the relayout rollback gap at `overlay-engine.cjs:6358-6360` against `:6384-6392` (iteration 1)
- Comparing two sibling diagnostic lines that share a remedy decision: found the LAYOUT overflow line's unconditional advice at `:3659` against the branching per-line remedy at `:3652-3655` (iteration 1)
- Grepping the whole repository for the retired path name and classifying each hit rather than counting them: cleared `barter-overlays` in four fixture lines (iteration 1)
- Byte-comparing each overlay source against its vendored copy with `diff`: proved all four hook files agree and closed the copy-drift question in one call (iteration 2)
- Reading a hook's skip branch as a behavior rather than as a guard: found the commit gate's silent `HAS_OVERLAYS=0` path at `pre-commit:89-92` (iteration 2)

---

## 9. WHAT FAILED
- Attempting to settle the `overlayDir`-outside-the-git-repository question from decision D2 alone: D2's summary is looser than the child spec, so the decision text cannot decide it and the child spec has to be read (iteration 1)
- Searching for a pre-commit hook test by name: `find` and `rg` both return only the hook, so the absence had to be proven by searching for the hook's own variable name across the repository (iteration 2)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and `.skilled/hooks/overlay-guard/vibe/overlay-guard.mjs` differ from the pin.** Checked and ruled out: both are symlinks at the pin (mode 120000) and on disk, and a plain `diff` follows them. Their targets match exactly (`../../../../.opencode/plugins/overlay-guard.js` and `../../../../.vibe/plugins/repo-guards/overlay-guard.mjs`). The apparent difference was an artifact of the comparison, not drift. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and `.skilled/hooks/overlay-guard/vibe/overlay-guard.mjs` differ from the pin.** Checked and ruled out: both are symlinks at the pin (mode 120000) and on disk, and a plain `diff` follows them. Their targets match exactly (`../../../../.opencode/plugins/overlay-guard.js` and `../../../../.vibe/plugins/repo-guards/overlay-guard.mjs`). The apparent difference was an artifact of the comparison, not drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and `.skilled/hooks/overlay-guard/vibe/overlay-guard.mjs` differ from the pin.** Checked and ruled out: both are symlinks at the pin (mode 120000) and on disk, and a plain `diff` follows them. Their targets match exactly (`../../../../.opencode/plugins/overlay-guard.js` and `../../../../.vibe/plugins/repo-guards/overlay-guard.mjs`). The apparent difference was an artifact of the comparison, not drift.

### **`aiSpeckitRoot` resolves to different roots for the applied and overlay-source copies.** Checked and ruled out: both sit five levels below their anchor and both probe the same sibling manifest. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`aiSpeckitRoot` resolves to different roots for the applied and overlay-source copies.** Checked and ruled out: both sit five levels below their anchor and both probe the same sibling manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`aiSpeckitRoot` resolves to different roots for the applied and overlay-source copies.** Checked and ruled out: both sit five levels below their anchor and both probe the same sibling manifest.

### **`apply --relayout` has a plan mode the presentation asset denies.** Checked and ruled out: `isRelayout` has one routing site and no dry-run branch. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **`apply --relayout` has a plan mode the presentation asset denies.** Checked and ruled out: `isRelayout` has one routing site and no dry-run branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`apply --relayout` has a plan mode the presentation asset denies.** Checked and ruled out: `isRelayout` has one routing site and no dry-run branch.

### **`overlayDir` outside the git repository is not refused by `resolveOverlayDir`.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:132,226` scopes that refusal to `pre-commit`, and `overlay-engine.cjs:5814-5819` implements it there. Decision D2's summary is looser than the child spec, and the child spec outranks it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`overlayDir` outside the git repository is not refused by `resolveOverlayDir`.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:132,226` scopes that refusal to `pre-commit`, and `overlay-engine.cjs:5814-5819` implements it there. Decision D2's summary is looser than the child spec, and the child spec outranks it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`overlayDir` outside the git repository is not refused by `resolveOverlayDir`.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:132,226` scopes that refusal to `pre-commit`, and `overlay-engine.cjs:5814-5819` implements it there. Decision D2's summary is looser than the child spec, and the child spec outranks it.

### **`repin --stage` can be aimed inside the tree or inside the overlay folder.** Checked and ruled out: `stageFolderProblem` tests both spellings of both boundaries. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`repin --stage` can be aimed inside the tree or inside the overlay folder.** Checked and ruled out: `stageFolderProblem` tests both spellings of both boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`repin --stage` can be aimed inside the tree or inside the overlay folder.** Checked and ruled out: `stageFolderProblem` tests both spellings of both boundaries.

### **`repin --stage` copies `relayout-runs/` and `repin-runs/` into the stage.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:183` records the extra overlay-folder copy as an accepted cost under NFR-P01. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`repin --stage` copies `relayout-runs/` and `repin-runs/` into the stage.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:183` records the extra overlay-folder copy as an accepted cost under NFR-P01.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`repin --stage` copies `relayout-runs/` and `repin-runs/` into the stage.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:183` records the extra overlay-folder copy as an accepted cost under NFR-P01.

### **`status` fails after a relayout until a follow-up `apply` runs.** Checked and ruled out: `state.files` holds applied hashes only (`:2908`), and `retargetRelayoutLinks` (`:6310-6328`) moves the live link while `planRelayoutManifest` (`:6280-6288`) rewrites the manifest target, so `planLayoutLinks` (`:2473-2479`) sees `current === link.target`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`status` fails after a relayout until a follow-up `apply` runs.** Checked and ruled out: `state.files` holds applied hashes only (`:2908`), and `retargetRelayoutLinks` (`:6310-6328`) moves the live link while `planRelayoutManifest` (`:6280-6288`) rewrites the manifest target, so `planLayoutLinks` (`:2473-2479`) sees `current === link.target`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`status` fails after a relayout until a follow-up `apply` runs.** Checked and ruled out: `state.files` holds applied hashes only (`:2908`), and `retargetRelayoutLinks` (`:6310-6328`) moves the live link while `planRelayoutManifest` (`:6280-6288`) rewrites the manifest target, so `planLayoutLinks` (`:2473-2479`) sees `current === link.target`.

### **`sync-state.json` still records a pre-move link target.** Checked and ruled out: no value in the `files` map contains `barter-overlays`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **`sync-state.json` still records a pre-move link target.** Checked and ruled out: no value in the `files` map contains `barter-overlays`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`sync-state.json` still records a pre-move link target.** Checked and ruled out: no value in the `files` map contains `barter-overlays`.

### **A `marked-section` entry whose `source` differs from its `fragment` keeps a permanent LAYOUT line.** Checked and ruled out: `layoutMoves` (`:3420-3424`) skips that `source`, and `status` prints from the same function, so no line is emitted for it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A `marked-section` entry whose `source` differs from its `fragment` keeps a permanent LAYOUT line.** Checked and ruled out: `layoutMoves` (`:3420-3424`) skips that `source`, and `status` prints from the same function, so no line is emitted for it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `marked-section` entry whose `source` differs from its `fragment` keeps a permanent LAYOUT line.** Checked and ruled out: `layoutMoves` (`:3420-3424`) skips that `source`, and `status` prints from the same function, so no line is emitted for it.

### **A manifest `source`, `fragment` or `base` can escape the overlay folder.** Checked and ruled out: `containedOverlayPath` routes every one through `sourceRelative`, which throws on an escape, and `planRelayout` turns the throw into a `refuse:` problem before any write. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A manifest `source`, `fragment` or `base` can escape the overlay folder.** Checked and ruled out: `containedOverlayPath` routes every one through `sourceRelative`, which throws on an escape, and `planRelayout` turns the throw into a `refuse:` problem before any write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A manifest `source`, `fragment` or `base` can escape the overlay folder.** Checked and ruled out: `containedOverlayPath` routes every one through `sourceRelative`, which throws on an escape, and `planRelayout` turns the throw into a `refuse:` problem before any write.

### **A planted `overlays` folder can steer the guard core at a different manifest.** Checked and ruled out: `matchLayout` requires the folder to be exactly `<parent>/overlays`, the tree to hold the engine and the folder to hold the manifest, and `findBarterOverlays` tries only the two anchors its own realpath implies. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A planted `overlays` folder can steer the guard core at a different manifest.** Checked and ruled out: `matchLayout` requires the folder to be exactly `<parent>/overlays`, the tree to hold the engine and the folder to hold the manifest, and `findBarterOverlays` tries only the two anchors its own realpath implies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A planted `overlays` folder can steer the guard core at a different manifest.** Checked and ruled out: `matchLayout` requires the folder to be exactly `<parent>/overlays`, the tree to hold the engine and the folder to hold the manifest, and `findBarterOverlays` tries only the two anchors its own realpath implies.

### **A sibling `overlayDir` can point the engine at a folder outside the git repository.** Checked and ruled out as documented behavior: `references/overlays.md:51` scopes the same-repository rule to the commit check, `001-engine-out-of-tree-overlay-folder/spec.md:132` states it as REQ-008 for pre-commit, and `spec.md:226` records the operator resolution in those words. The engine refuses it at `:5810-5818` with the documented line. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A sibling `overlayDir` can point the engine at a folder outside the git repository.** Checked and ruled out as documented behavior: `references/overlays.md:51` scopes the same-repository rule to the commit check, `001-engine-out-of-tree-overlay-folder/spec.md:132` states it as REQ-008 for pre-commit, and `spec.md:226` records the operator resolution in those words. The engine refuses it at `:5810-5818` with the documented line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A sibling `overlayDir` can point the engine at a folder outside the git repository.** Checked and ruled out as documented behavior: `references/overlays.md:51` scopes the same-repository rule to the commit check, `001-engine-out-of-tree-overlay-folder/spec.md:132` states it as REQ-008 for pre-commit, and `spec.md:226` records the operator resolution in those words. The engine refuses it at `:5810-5818` with the documented line.

### **A stale `overlays/skilled` path survives the move.** Checked and ruled out: the directory does not exist. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A stale `overlays/skilled` path survives the move.** Checked and ruled out: the directory does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale `overlays/skilled` path survives the move.** Checked and ruled out: the directory does not exist.

### **A symlinked parent can carry a removal outside the tree.** Checked and ruled out: `:229` compares the canonical parent, not just the lexical path. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A symlinked parent can carry a removal outside the tree.** Checked and ruled out: `:229` compares the canonical parent, not just the lexical path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A symlinked parent can carry a removal outside the tree.** Checked and ruled out: `:229` compares the canonical parent, not just the lexical path.

### **An old `barter-overlays` path survives in a doc, test or script.** Checked and ruled out: the REQ-008 grep returns zero lines outside the exempt areas. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **An old `barter-overlays` path survives in a doc, test or script.** Checked and ruled out: the REQ-008 grep returns zero lines outside the exempt areas.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An old `barter-overlays` path survives in a doc, test or script.** Checked and ruled out: the REQ-008 grep returns zero lines outside the exempt areas.

### **Criterion 4 fails on the tree as it stands.** Checked and ruled out: `status --json` reports `PASSED` with `offLayout: []`. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Criterion 4 fails on the tree as it stands.** Checked and ruled out: `status --json` reports `PASSED` with `offLayout: []`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Criterion 4 fails on the tree as it stands.** Checked and ruled out: `status --json` reports `PASSED` with `offLayout: []`.

### **Criterion 5 fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Criterion 5 fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Criterion 5 fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.

### **REQ-001's rule is not what the code does.** Checked and ruled out: `adoptSource` at `:5484-5488` matches the requirement branch for branch. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **REQ-001's rule is not what the code does.** Checked and ruled out: `adoptSource` at `:5484-5488` matches the requirement branch for branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **REQ-001's rule is not what the code does.** Checked and ruled out: `adoptSource` at `:5484-5488` matches the requirement branch for branch.

### **The `--guard` criterion fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **The `--guard` criterion fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `--guard` criterion fails.** Checked and ruled out: the guard exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.

### **The `overlayDir` key is read anywhere but the setting reader.** Checked and ruled out: the engine-wide scan in `overlay-engine-fixes.test.cjs:193-205` asserts every occurrence sits inside `resolveOverlayDir`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `overlayDir` key is read anywhere but the setting reader.** Checked and ruled out: the engine-wide scan in `overlay-engine-fixes.test.cjs:193-205` asserts every occurrence sits inside `resolveOverlayDir`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `overlayDir` key is read anywhere but the setting reader.** Checked and ruled out: the engine-wide scan in `overlay-engine-fixes.test.cjs:193-205` asserts every occurrence sits inside `resolveOverlayDir`.

### **The `root/skilled` refusal is missing from one of the three paths.** Checked and ruled out: the manifest check, the adopt refusal and the relayout refusal all route through `isUnderRootSkilled`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The `root/skilled` refusal is missing from one of the three paths.** Checked and ruled out: the manifest check, the adopt refusal and the relayout refusal all route through `isUnderRootSkilled`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `root/skilled` refusal is missing from one of the three paths.** Checked and ruled out: the manifest check, the adopt refusal and the relayout refusal all route through `isUnderRootSkilled`.

### **The changelog claims a Skilled release the pin does not carry.** Checked and ruled out: `.skilled/changelog/skilled/v4.1.0.0.md` exists and the pin is the commit the changelog names. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The changelog claims a Skilled release the pin does not carry.** Checked and ruled out: `.skilled/changelog/skilled/v4.1.0.0.md` exists and the pin is the commit the changelog names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The changelog claims a Skilled release the pin does not carry.** Checked and ruled out: `.skilled/changelog/skilled/v4.1.0.0.md` exists and the pin is the commit the changelog names.

### **The changelog split leaves the sk-git changelogs unreachable.** Checked and ruled out: they live under `framework/skills/sk-git/sk-git-skilled/changelog`, the `sk-git-root` entry carries them, and `.skilled/changelog/sk-git-skilled` resolves to that folder. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The changelog split leaves the sk-git changelogs unreachable.** Checked and ruled out: they live under `framework/skills/sk-git/sk-git-skilled/changelog`, the `sk-git-root` entry carries them, and `.skilled/changelog/sk-git-skilled` resolves to that folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The changelog split leaves the sk-git changelogs unreachable.** Checked and ruled out: they live under `framework/skills/sk-git/sk-git-skilled/changelog`, the `sk-git-root` entry carries them, and `.skilled/changelog/sk-git-skilled` resolves to that folder.

### **The doctor skill version and its changelog disagree.** Checked and ruled out: both are `1.2.0.0`. -- BLOCKED (iteration 12, 2 attempts)
- What was tried: **The doctor skill version and its changelog disagree.** Checked and ruled out: both are `1.2.0.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor skill version and its changelog disagree.** Checked and ruled out: both are `1.2.0.0`.

### **The documented overflow-line wording differs from the engine's.** Checked and ruled out: both quote the same string, and `:3659` prints it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The documented overflow-line wording differs from the engine's.** Checked and ruled out: both quote the same string, and `:3659` prints it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The documented overflow-line wording differs from the engine's.** Checked and ruled out: both quote the same string, and `:3659` prints it.

### **The guard core's fail-open is silent.** Checked and ruled out: `warnCoreFailure` writes a named stderr line, and `barter-overlay-guard.test.cjs:121-155` asserts exactly one stderr line and no throw. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The guard core's fail-open is silent.** Checked and ruled out: `warnCoreFailure` writes a named stderr line, and `barter-overlay-guard.test.cjs:121-155` asserts exactly one stderr line and no throw.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The guard core's fail-open is silent.** Checked and ruled out: `warnCoreFailure` writes a named stderr line, and `barter-overlay-guard.test.cjs:121-155` asserts exactly one stderr line and no throw.

### **The guard's fail-open on a missing overlay folder is a defect.** Checked and ruled out: `barter-overlay-guard.js:19-23` documents the choice, `barter-overlay-guard.test.cjs:121-155` pins it, and `005-barter-move-overlays-out-of-tree/spec.md:64` records it as the pre-existing behavior the phase preserves. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The guard's fail-open on a missing overlay folder is a defect.** Checked and ruled out: `barter-overlay-guard.js:19-23` documents the choice, `barter-overlay-guard.test.cjs:121-155` pins it, and `005-barter-move-overlays-out-of-tree/spec.md:64` records it as the pre-existing behavior the phase preserves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The guard's fail-open on a missing overlay folder is a defect.** Checked and ruled out: `barter-overlay-guard.js:19-23` documents the choice, `barter-overlay-guard.test.cjs:121-155` pins it, and `005-barter-move-overlays-out-of-tree/spec.md:64` records it as the pre-existing behavior the phase preserves.

### **The layout-link list and the sync-state link map disagree.** Checked and ruled out: 19 entries each, every target matching. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **The layout-link list and the sync-state link map disagree.** Checked and ruled out: 19 entries each, every target matching.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The layout-link list and the sync-state link map disagree.** Checked and ruled out: 19 entries each, every target matching.

### **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: `ls -d` exits 1. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: `ls -d` exits 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: `ls -d` exits 1.

### **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: the path does not exist. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: the path does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The old `barter-overlays` folder survives in the vendored tree.** Checked and ruled out: the path does not exist.

### **The phase closed over an unrecorded blocker.** Checked and ruled out: T014 is recorded in five places with the operator named as the next safe action. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The phase closed over an unrecorded blocker.** Checked and ruled out: T014 is recorded in five places with the operator named as the next safe action.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The phase closed over an unrecorded blocker.** Checked and ruled out: T014 is recorded in five places with the operator named as the next safe action.

### **The pin block lacks a field a later re-pin needs.** Checked and ruled out: `upstream`, `commit` and `checkout` are all present. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **The pin block lacks a field a later re-pin needs.** Checked and ruled out: `upstream`, `commit` and `checkout` are all present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The pin block lacks a field a later re-pin needs.** Checked and ruled out: `upstream`, `commit` and `checkout` are all present.

### **The plugin's `sessionDir` can steer the guard at a path outside the tree.** Checked and ruled out: `guard` passes an absolute target and canonicalizes it before the containment test. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The plugin's `sessionDir` can steer the guard at a path outside the tree.** Checked and ruled out: `guard` passes an absolute target and canonicalizes it before the containment test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The plugin's `sessionDir` can steer the guard at a path outside the tree.** Checked and ruled out: `guard` passes an absolute target and canonicalizes it before the containment test.

### **The pre-commit hook's repo-root branch mis-resolves the tree.** Checked and ruled out: at `ai-speckit/.opencode/scripts/git-hooks` the probe at `:85` finds `ai-speckit/overlays/overlay-manifest.json` and rewrites `TREE_ROOT` to `ai-speckit/skilled`, after which `:89` finds the manifest beside it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The pre-commit hook's repo-root branch mis-resolves the tree.** Checked and ruled out: at `ai-speckit/.opencode/scripts/git-hooks` the probe at `:85` finds `ai-speckit/overlays/overlay-manifest.json` and rewrites `TREE_ROOT` to `ai-speckit/skilled`, after which `:89` finds the manifest beside it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The pre-commit hook's repo-root branch mis-resolves the tree.** Checked and ruled out: at `ai-speckit/.opencode/scripts/git-hooks` the probe at `:85` finds `ai-speckit/overlays/overlay-manifest.json` and rewrites `TREE_ROOT` to `ai-speckit/skilled`, after which `:89` finds the manifest beside it.

### **The pre-commit rewrite block can be steered into skipping the overlay gate.** Checked and ruled out: a rewrite that lands on a folder without the engine exits 1 with `BLOCKED`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The pre-commit rewrite block can be steered into skipping the overlay gate.** Checked and ruled out: a rewrite that lands on a folder without the engine exits 1 with `BLOCKED`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The pre-commit rewrite block can be steered into skipping the overlay gate.** Checked and ruled out: a rewrite that lands on a folder without the engine exits 1 with `BLOCKED`.

### **The re-pin's task lines claim results without naming the artifact.** Checked and ruled out: each names a run id, a commit id, or a printed count. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The re-pin's task lines claim results without naming the artifact.** Checked and ruled out: each names a run id, a commit id, or a printed count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The re-pin's task lines claim results without naming the artifact.** Checked and ruled out: each names a run id, a commit id, or a printed count.

### **The README asserts a default folder name that differs from the engine's.** Checked and ruled out: it asserts none. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The README asserts a default folder name that differs from the engine's.** Checked and ruled out: it asserts none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README asserts a default folder name that differs from the engine's.** Checked and ruled out: it asserts none.

### **The README names a guard core path the plugin does not use.** Checked and ruled out: `:52` names `framework/hooks/barter-overlay-guard/`, which is the overlay-source anchor. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The README names a guard core path the plugin does not use.** Checked and ruled out: `:52` names `framework/hooks/barter-overlay-guard/`, which is the overlay-source anchor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README names a guard core path the plugin does not use.** Checked and ruled out: `:52` names `framework/hooks/barter-overlay-guard/`, which is the overlay-source anchor.

### **The README's adopt examples use the old dot-dropped rule.** Checked and ruled out: both use `framework/` and `root/`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The README's adopt examples use the old dot-dropped rule.** Checked and ruled out: both use `framework/` and `root/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README's adopt examples use the old dot-dropped rule.** Checked and ruled out: both use `framework/` and `root/`.

### **The README's folder tree is stale after the move.** Checked and ruled out: both `framework/` and `root/` listings match entry for entry. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The README's folder tree is stale after the move.** Checked and ruled out: both `framework/` and `root/` listings match entry for entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README's folder tree is stale after the move.** Checked and ruled out: both `framework/` and `root/` listings match entry for entry.

### **The README's layout rule differs from the engine's.** Checked and ruled out: `:8` and `:55` match `adoptSource` and the setting file on disk. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The README's layout rule differs from the engine's.** Checked and ruled out: `:8` and `:55` match `adoptSource` and the setting file on disk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The README's layout rule differs from the engine's.** Checked and ruled out: `:8` and `:55` match `adoptSource` and the setting file on disk.

### **The reference describes a sibling rule the engine does not implement.** Checked and ruled out: `references/overlays.md:51` matches `resolveOverlayDir` branch for branch. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The reference describes a sibling rule the engine does not implement.** Checked and ruled out: `references/overlays.md:51` matches `resolveOverlayDir` branch for branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The reference describes a sibling rule the engine does not implement.** Checked and ruled out: `references/overlays.md:51` matches `resolveOverlayDir` branch for branch.

### **The relayout derives its targets from a different rule than adopt.** Checked and ruled out: `layoutMoves` calls the same `adoptSource` at `:3415`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The relayout derives its targets from a different rule than adopt.** Checked and ruled out: `layoutMoves` calls the same `adoptSource` at `:3415`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The relayout derives its targets from a different rule than adopt.** Checked and ruled out: `layoutMoves` calls the same `adoptSource` at `:3415`.

### **The release entry is missing required frontmatter.** Checked and ruled out: title, description, trigger phrases, importance tier and context type are all present. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **The release entry is missing required frontmatter.** Checked and ruled out: title, description, trigger phrases, importance tier and context type are all present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The release entry is missing required frontmatter.** Checked and ruled out: title, description, trigger phrases, importance tier and context type are all present.

### **The release notes do not name the migration command.** Checked and ruled out: `apply --relayout` appears three times, including the runbook step at `:57`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The release notes do not name the migration command.** Checked and ruled out: `apply --relayout` appears three times, including the runbook step at `:57`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The release notes do not name the migration command.** Checked and ruled out: `apply --relayout` appears three times, including the runbook step at `:57`.

### **The setting file names a folder other than `../overlays`.** Checked and ruled out: it prints `{ "overlayDir": "../overlays" }`. -- BLOCKED (iteration 12, 2 attempts)
- What was tried: **The setting file names a folder other than `../overlays`.** Checked and ruled out: it prints `{ "overlayDir": "../overlays" }`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The setting file names a folder other than `../overlays`.** Checked and ruled out: it prints `{ "overlayDir": "../overlays" }`.

### **The skill version line and the changelog filename disagree.** Checked and ruled out: both are `1.2.0.0`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The skill version line and the changelog filename disagree.** Checked and ruled out: both are `1.2.0.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The skill version line and the changelog filename disagree.** Checked and ruled out: both are `1.2.0.0`.

### **The stale pointers mean the phase was never implemented.** Checked and ruled out: every cited behaviour exists, at a different line. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The stale pointers mean the phase was never implemented.** Checked and ruled out: every cited behaviour exists, at a different line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The stale pointers mean the phase was never implemented.** Checked and ruled out: every cited behaviour exists, at a different line.

### **The sync-state record carries a pre-move link target.** Checked and ruled out: no value in `links` contains `barter-overlays`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **The sync-state record carries a pre-move link target.** Checked and ruled out: no value in `links` contains `barter-overlays`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The sync-state record carries a pre-move link target.** Checked and ruled out: no value in `links` contains `barter-overlays`.

### **The two overlay-owned changelog links are hand-maintained.** Checked and ruled out: `layoutLinks` declares both and `sync-state.links` records both, so the engine writes them. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **The two overlay-owned changelog links are hand-maintained.** Checked and ruled out: `layoutLinks` declares both and `sync-state.links` records both, so the engine writes them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The two overlay-owned changelog links are hand-maintained.** Checked and ruled out: `layoutLinks` declares both and `sync-state.links` records both, so the engine writes them.

### **The vendored and overlay copies of the four hook files disagree.** Checked and ruled out: all four `diff` runs are empty. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The vendored and overlay copies of the four hook files disagree.** Checked and ruled out: all four `diff` runs are empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The vendored and overlay copies of the four hook files disagree.** Checked and ruled out: all four `diff` runs are empty.

### **The vendored tree has drifted from Skilled `063daaee2c1`.** Checked and ruled out: 317 files compare SAME, 0 are missing, and all 6 differences are declared overlay entries. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The vendored tree has drifted from Skilled `063daaee2c1`.** Checked and ruled out: 317 files compare SAME, 0 are missing, and all 6 differences are declared overlay entries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The vendored tree has drifted from Skilled `063daaee2c1`.** Checked and ruled out: 317 files compare SAME, 0 are missing, and all 6 differences are declared overlay entries.

### **Two destinations collapsing onto one source path** (`.claude/settings.json` and `claude/settings.json` both to `root/claude/settings.json`). Checked and ruled out: `planRelayout`'s `claimed` map (`:6152-6156`) refuses with both source paths named. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Two destinations collapsing onto one source path** (`.claude/settings.json` and `claude/settings.json` both to `root/claude/settings.json`). Checked and ruled out: `planRelayout`'s `claimed` map (`:6152-6156`) refuses with both source paths named.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Two destinations collapsing onto one source path** (`.claude/settings.json` and `claude/settings.json` both to `root/claude/settings.json`). Checked and ruled out: `planRelayout`'s `claimed` map (`:6152-6156`) refuses with both source paths named.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- `overlayDir` outside the git repository is not refused by `resolveOverlayDir`: the refusal is scoped to `pre-commit` by `001-engine-out-of-tree-overlay-folder/spec.md:132,226` and implemented at `overlay-engine.cjs:5814-5819`; decision D2's summary is looser than the child spec (iteration 1, evidence: `overlay-engine.cjs:5814-5819`)
- `repin --stage` copying `relayout-runs/` and `repin-runs/` into the stage: recorded as an accepted cost under NFR-P01 in `001-engine-out-of-tree-overlay-folder/spec.md:183` (iteration 1, evidence: `overlay-engine.cjs:5244-5249`)
- A `marked-section` entry whose `source` differs from its `fragment` keeping a permanent LAYOUT line: `layoutMoves` skips that `source` and `status` prints from the same function (iteration 1, evidence: `overlay-engine.cjs:3420-3424`)
- `status` failing after a relayout until a follow-up `apply`: `state.files` holds applied hashes only and both the live link and the manifest target move together (iteration 1, evidence: `overlay-engine.cjs:2908,6310-6328,6280-6288`)
- Two destinations collapsing onto one source path (`.claude/settings.json` and `claude/settings.json`): `planRelayout`'s `claimed` map refuses with both source paths named (iteration 1, evidence: `overlay-engine.cjs:6152-6156`)
- The guard's fail-open on a missing overlay folder is a defect: documented at `barter-overlay-guard.js:19-23`, pinned by `barter-overlay-guard.test.cjs:121-155`, recorded as pre-existing at `005-barter-move-overlays-out-of-tree/spec.md:64` (iteration 2, evidence: `barter-overlay-guard.js:19-23`)
- The vendored and overlay copies of the four hook files disagree: all four `diff` runs are empty (iteration 2, evidence: `barter-overlay-guard-core.cjs:1-169`)
- The pre-commit repo-root branch mis-resolves the tree: the probe at `:85` rewrites `TREE_ROOT` to `ai-speckit/skilled` and `:89` then finds the manifest beside it (iteration 2, evidence: `pre-commit:85-92`)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: cross-reference - Focus area: synthesis -- group the seven open findings by root cause and state the verdict the registry supports - Reason: the frontier is drained, all four dimensions are covered, and both core traceability protocols now pass on executed evidence, so no review work remains inside the loop - Rotation status: all three nodes answered on all four dimensions; consolidation pass complete - Blocked/productive carry-forward: productive -- executing the criteria rather than reading about them is what closed `checklist_evidence`, and it is the same move that found `R11-P2-001` in iteration 11 - Required evidence: the findings registry, the seven open findings, and the strategy's exhausted-approach list Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs`, `.skilled/skills/system-skilled-doctor/SKILL.md`, `changelog/v1.2.0.0.md`, `barter/ai-speckit/overlays/`, `barter/ai-speckit/skilled/.skilled-overlays.json`, `barter/ai-speckit/skilled/.opencode/`, `barter/ai-speckit/skilled/.skilled/skills/sk-git/`
- Behavior claims: `framework/` names `.skilled` content and `root/` names everything else; `overlayDir` may name only a direct sibling `../<name>`; `repin --stage <dir>` writes nothing live; old-layout trees keep applying with a capped LAYOUT notice until one `apply --relayout`
- Reuse and conventions: the doctor overlay engine's existing source-resolution and guard contracts; the `sk-code-review` severity doctrine
- Review risks and gaps: the Barter repository is nested at `barter/ai-speckit`, so its history must be read with `git -C barter/ai-speckit`; `resource-map.md` is absent, so the coverage gate is skipped

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-flash-max-1795182837437-sws2tv, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-20T13:55:21.745Z
<!-- MACHINE-OWNED: END -->
