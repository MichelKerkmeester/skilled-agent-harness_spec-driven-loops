---
title: Deep Review Strategy - 007 overlay framework/root layout (deepseek-flash-max lineage)
description: Runtime strategy for the fan-out lineage deepseek-flash-max reviewing the overlay framework/root layout change after remediation.
trigger_phrases:
  - "deep review strategy"
  - "overlay framework root layout review"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the `deepseek-flash-max` fan-out lineage. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** populated from the lineage config and the prior generation's archived report.
- **Per iteration:** the agent reads Next Focus, reviews the assigned dimension and frontier node, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** mutable, updated by the iteration agent.

---

## 2. TOPIC

Follow-up review round after remediation of `specs/system-skilled-doctor/007-overlay-framework-root-layout`. The previous generation (archived at `review-archive/20261120T163142Z/`) raised 1 P1 and 15 P2 findings across two lineages. This round verifies each of those findings is fixed, checks the fixes introduced no regression, and reviews the whole change again.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Removing old-layout or in-tree overlay support (D6).
- Non-path overlay content changes (D6).
- Spec history under `ai-speckit/specs/` (D6).
- The deep-review workflow's own fan-out scope-gate defect (prior D-1). It is recorded as an edge case, not a finding against this packet.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` under 0.10 with all four dimensions covered.
- Hard ceiling: 24 iterations.
- Any active P0 keeps the verdict at FAIL regardless of convergence.

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
- P1 (Required): 0
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Re-verifying each prior finding against the current tree instead of the remediation commit message: it separated the eight genuinely fixed engine findings from the one branch the fix did not cover. (iteration 1)
- Reading the rollback tests' assertions rather than their names: the snapshot-before/snapshot-after deep equality is what proves the restore, and it is present. (iteration 1)
- Comparing the same gate across its two entrypoints: the git write gate refuses through the OpenCode wrapper and allows through its CLI hook, and only the side-by-side read made that visible. (iteration 5)
- Reading all four upstream overlay-guard adapters before calling the OpenCode fail-open a divergence: they all warn and approve, so the behaviour is a design decision rather than a defect. (iteration 5)
- Grepping for a hardening flag rather than reading every git call: one `--end-of-options` hit in a 6600-line engine located the one reader that omits it. (iteration 6)
- Reading the state file for machine-specific data before reading the engine: zero absolute paths settled the leak question in one search. (iteration 6)
- Grepping the hook for one command shape instead of reading it top to bottom: three `git diff --cached` hits with two different flag sets exposed the filter inconsistency in one search. (iteration 8)
- Re-checking the prior maintainability findings by their anchors rather than their commit: the `layoutMoves` JSDoc and the `writeBackup` split are both still in place. (iteration 8)
- Reading the fixture helper before accepting an unexecuted criterion: `overlay-engine-fixtures.cjs:63` builds every fixture under `os.tmpdir()`, which turned criterion 1 from an eight-iteration limit into 262 executed passing tests. (iteration 9)
- Running the packet's own criteria instead of re-reading the phase-003 one: five of six executed clean and the sixth exposed a stale phase count that no prose read had caught. (iteration 9)
- Checking `git status --porcelain` over the three reviewed trees after executing the suites: an empty result is what proves the execution left no residue, and it is cheaper than auditing each fixture. (iteration 9)

---

## 9. WHAT FAILED

- Reading the remediation commit message as evidence: it names the `layoutMoves` JSDoc and the `overlayOutside` context field, and both are real, but a message cannot show whether a branch is reachable. Direct reads were needed for every claim. (iteration 1)
- Treating a `catch` arm as dead code from its shape alone: `barter-git-write-gate.js:56` looks like a redundant prefix check until `evaluateCommand` is read and the prefixed returns at `:1732`, `:1737` and `:2018` show it is live. (iteration 5)
- Reading `$?` after `VAR="$(cmd)"` as clobbered: bash propagates the command substitution status through the assignment, so the pre-commit engine checks are sound and the suspicion was wrong. (iteration 5)
- Assuming the vendored copy might ship the engine without its suites: all six `overlay-engine-*.test.cjs` files are present, so the supply-chain question closed on a listing rather than a finding. (iteration 6)
- Treating the duplicated three-line session-directory fallback in the two plugins as a finding: it is real duplication but carries no behavioural divergence, so it was recorded as an edge case instead. (iteration 8)
- Carrying criterion 1 as an unexecuted limit for eight iterations: the suites were assumed to write inside the repository, and one read of the fixture helper would have shown they do not. (iteration 9)
- Expecting the coverage gate to close once the criteria were executed: `checklist_evidence` stays `partial` because the phase-003 tick still does not reproduce, and that cause is a one-line amendment outside this lineage's write surface. (iteration 9)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`$?` clobbered by the assignment.** Considered that `STATUS_OUT="$(...)"` resets `$?` before the test. It does not: bash propagates the command substitution's status through the assignment, so the check is sound. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`$?` clobbered by the assignment.** Considered that `STATUS_OUT="$(...)"` resets `$?` before the test. It does not: bash propagates the command substitution's status through the assignment, so the check is sound.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`$?` clobbered by the assignment.** Considered that `STATUS_OUT="$(...)"` resets `$?` before the test. It does not: bash propagates the command substitution's status through the assignment, so the check is sound.

### **`INTERESTING_GIT` too narrow to catch a refused command.** Considered that `barter-git-write-gate.js:57` would swallow a refusal for a command the pattern misses. `INTERESTING_GIT` is `/\b(?:git|gh)\b/` (`barter-git-write-gate.mjs:169`), and every refusal `evaluateCommand` returns is already prefixed and re-thrown at `:56`, so the generic arm is only reached for a thrown error. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`INTERESTING_GIT` too narrow to catch a refused command.** Considered that `barter-git-write-gate.js:57` would swallow a refusal for a command the pattern misses. `INTERESTING_GIT` is `/\b(?:git|gh)\b/` (`barter-git-write-gate.mjs:169`), and every refusal `evaluateCommand` returns is already prefixed and re-thrown at `:56`, so the generic arm is only reached for a thrown error.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`INTERESTING_GIT` too narrow to catch a refused command.** Considered that `barter-git-write-gate.js:57` would swallow a refusal for a command the pattern misses. `INTERESTING_GIT` is `/\b(?:git|gh)\b/` (`barter-git-write-gate.mjs:169`), and every refusal `evaluateCommand` returns is already prefixed and re-thrown at `:56`, so the generic arm is only reached for a thrown error.

### **`overlayDir` can name the repository's own `.git`.** Ruled out: `:472` refuses a target whose first segment under the top level is `.git`, and `overlay-engine-strict-writes.test.cjs:820-830` covers it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`overlayDir` can name the repository's own `.git`.** Ruled out: `:472` refuses a target whose first segment under the top level is `.git`, and `overlay-engine-strict-writes.test.cjs:820-830` covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`overlayDir` can name the repository's own `.git`.** Ruled out: `:472` refuses a target whose first segment under the top level is `.git`, and `overlay-engine-strict-writes.test.cjs:820-830` covers it.

### **`overlayOutside` is stale after a setting change mid-run.** Ruled out: `createContext` is the only producer and every command builds one context per run. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`overlayOutside` is stale after a setting change mid-run.** Ruled out: `createContext` is the only producer and every command builds one context per run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`overlayOutside` is stale after a setting change mid-run.** Ruled out: `createContext` is the only producer and every command builds one context per run.

### **`pre-commit` fails open silently.** Ruled out: the only fail-open branch prints `allow: strictWrites is off in the overlay manifest, so nothing was checked` (`:6124`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`pre-commit` fails open silently.** Ruled out: the only fail-open branch prints `allow: strictWrites is off in the overlay manifest, so nothing was checked` (`:6124`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`pre-commit` fails open silently.** Ruled out: the only fail-open branch prints `allow: strictWrites is off in the overlay manifest, so nothing was checked` (`:6124`).

### **`sync-state.json` leaks an absolute path.** Ruled out by exact search: zero `/Users/` hits. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`sync-state.json` leaks an absolute path.** Ruled out by exact search: zero `/Users/` hits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`sync-state.json` leaks an absolute path.** Ruled out by exact search: zero `/Users/` hits.

### **A `GIT_DIR` exported by a hook defeats the repository check.** Ruled out: `gitTopLevelOrNull` deletes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX` from the child environment (`:499-500`), and `overlay-engine-strict-writes.test.cjs:866-870` covers it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `GIT_DIR` exported by a hook defeats the repository check.** Ruled out: `gitTopLevelOrNull` deletes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX` from the child environment (`:499-500`), and `overlay-engine-strict-writes.test.cjs:866-870` covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `GIT_DIR` exported by a hook defeats the repository check.** Ruled out: `gitTopLevelOrNull` deletes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX` from the child environment (`:499-500`), and `overlay-engine-strict-writes.test.cjs:866-870` covers it.

### **A live `barter-overlays` path reference survives.** Ruled out: every remaining hit is the spec track name `skilled-barter-overlays`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A live `barter-overlays` path reference survives.** Ruled out: every remaining hit is the spec track name `skilled-barter-overlays`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live `barter-overlays` path reference survives.** Ruled out: every remaining hit is the spec track name `skilled-barter-overlays`.

### **A manifest can make the engine read a credential file through `protectedPaths`.** Ruled out: `protectedPathsFor` (`:2730-2748`) refuses a `.env` value and a value outside the entry, and `isProtectedReadPath` still refuses every token-named path the entry does not name exactly. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A manifest can make the engine read a credential file through `protectedPaths`.** Ruled out: `protectedPathsFor` (`:2730-2748`) refuses a `.env` value and a value outside the entry, and `isProtectedReadPath` still refuses every token-named path the entry does not name exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A manifest can make the engine read a credential file through `protectedPaths`.** Ruled out: `protectedPathsFor` (`:2730-2748`) refuses a `.env` value and a value outside the entry, and `isProtectedReadPath` still refuses every token-named path the entry does not name exactly.

### **A manifest can make the engine read a credential file.** Ruled out in iteration 2: `protectedPathsFor` refuses a dotenv value and a value outside the entry. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A manifest can make the engine read a credential file.** Ruled out in iteration 2: `protectedPathsFor` refuses a dotenv value and a value outside the entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A manifest can make the engine read a credential file.** Ruled out in iteration 2: `protectedPathsFor` refuses a dotenv value and a value outside the entry.

### **A non-ASCII vendored path slips past the staged scan.** Ruled out: the scan reads `git diff --cached --name-only -z` (`:127`) and `pre-commit.test.cjs:107-116` stages `café.md`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A non-ASCII vendored path slips past the staged scan.** Ruled out: the scan reads `git diff --cached --name-only -z` (`:127`) and `pre-commit.test.cjs:107-116` stages `café.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A non-ASCII vendored path slips past the staged scan.** Ruled out: the scan reads `git diff --cached --name-only -z` (`:127`) and `pre-commit.test.cjs:107-116` stages `café.md`.

### **Criterion 4 regressed since iteration 8.** Ruled out by re-execution: `status --json` still reports `PASSED` with an empty `offLayout`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Criterion 4 regressed since iteration 8.** Ruled out by re-execution: `status --json` still reports `PASSED` with an empty `offLayout`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Criterion 4 regressed since iteration 8.** Ruled out by re-execution: `status --json` still reports `PASSED` with an empty `offLayout`.

### **Criterion 5's refusal names the wrong source root.** Ruled out: the refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`, which is the `framework/` root D1 froze. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Criterion 5's refusal names the wrong source root.** Ruled out: the refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`, which is the `framework/` root D1 froze.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Criterion 5's refusal names the wrong source root.** Ruled out: the refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`, which is the `framework/` root D1 froze.

### **Engine refusal prefix mismatch.** Considered that `barter-overlay-guard.js:175` matches `/^refuse:/im` while the engine might print another prefix. Executed the guard read-only and the engine prints `refuse: ...`, so the match holds. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Engine refusal prefix mismatch.** Considered that `barter-overlay-guard.js:175` matches `/^refuse:/im` while the engine might print another prefix. Executed the guard read-only and the engine prints `refuse: ...`, so the match holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Engine refusal prefix mismatch.** Considered that `barter-overlay-guard.js:175` matches `/^refuse:/im` while the engine might print another prefix. Executed the guard read-only and the engine prints `refuse: ...`, so the match holds.

### **Relayout can still leave a half-moved folder.** Ruled out: every mutating step is inside the `try` at `:6534-6560`, and the only steps outside it are the backup copies, which run before the first rename. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Relayout can still leave a half-moved folder.** Ruled out: every mutating step is inside the `try` at `:6534-6560`, and the only steps outside it are the backup copies, which run before the first rename.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Relayout can still leave a half-moved folder.** Ruled out: every mutating step is inside the `try` at `:6534-6560`, and the only steps outside it are the backup copies, which run before the first rename.

### **The applied hook copies drifted from their overlay sources.** Ruled out: `diff -q` reports all three pairs identical. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The applied hook copies drifted from their overlay sources.** Ruled out: `diff -q` reports all three pairs identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The applied hook copies drifted from their overlay sources.** Ruled out: `diff -q` reports all three pairs identical.

### **The changelog overstates the relayout backup location.** Ruled out: `:6491` builds the path from the overlay root, which is what the changelog says. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The changelog overstates the relayout backup location.** Ruled out: `:6491` builds the path from the overlay root, which is what the changelog says.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The changelog overstates the relayout backup location.** Ruled out: `:6491` builds the path from the overlay root, which is what the changelog says.

### **The commit gate still skips silently when no manifest is found.** Ruled out: `pre-commit:120-146` refuses with exit 1 when a vendored path is staged and prints a skip line otherwise. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The commit gate still skips silently when no manifest is found.** Ruled out: `pre-commit:120-146` refuses with exit 1 when a vendored path is staged and prints a skip line otherwise.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The commit gate still skips silently when no manifest is found.** Ruled out: `pre-commit:120-146` refuses with exit 1 when a vendored path is staged and prints a skip line otherwise.

### **The docs claim an exit code the engine does not use.** Considered that `overlays.md:51` says `pre-commit` exits 2 while the engine throws. Ruled out: `:6665` returns `EXIT_ERROR`, defined as 2 at `:91`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The docs claim an exit code the engine does not use.** Considered that `overlays.md:51` says `pre-commit` exits 2 while the engine throws. Ruled out: `:6665` returns `EXIT_ERROR`, defined as 2 at `:91`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The docs claim an exit code the engine does not use.** Considered that `overlays.md:51` says `pre-commit` exits 2 while the engine throws. Ruled out: `:6665` returns `EXIT_ERROR`, defined as 2 at `:91`.

### **The engine suites write inside the repository.** Ruled out: `overlay-engine-fixtures.cjs:63` uses `os.tmpdir()`, and the post-run `git status --porcelain` over the three reviewed trees is empty. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The engine suites write inside the repository.** Ruled out: `overlay-engine-fixtures.cjs:63` uses `os.tmpdir()`, and the post-run `git status --porcelain` over the three reviewed trees is empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The engine suites write inside the repository.** Ruled out: `overlay-engine-fixtures.cjs:63` uses `os.tmpdir()`, and the post-run `git status --porcelain` over the three reviewed trees is empty.

### **The guard core can be steered by a stray manifest elsewhere.** Ruled out: `matchLayout` requires the tree's own setting to name the folder before it is accepted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The guard core can be steered by a stray manifest elsewhere.** Ruled out: `matchLayout` requires the tree's own setting to name the folder before it is accepted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The guard core can be steered by a stray manifest elsewhere.** Ruled out: `matchLayout` requires the tree's own setting to name the folder before it is accepted.

### **The LAYOUT overflow line advises relayout for a blocked move.** Ruled out: `:3700-3707` partitions the hidden moves into `blocked` and `movable` and names each remedy for its own count. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The LAYOUT overflow line advises relayout for a blocked move.** Ruled out: `:3700-3707` partitions the hidden moves into `blocked` and `movable` and names each remedy for its own count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The LAYOUT overflow line advises relayout for a blocked move.** Ruled out: `:3700-3707` partitions the hidden moves into `blocked` and `movable` and names each remedy for its own count.

### **The LAYOUT overflow line can advise relayout for a blocked move.** Ruled out: `:3700-3710` partitions `hidden` into `blocked` and `movable` and names each remedy for its own count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The LAYOUT overflow line can advise relayout for a blocked move.** Ruled out: `:3700-3710` partitions `hidden` into `blocked` and `movable` and names each remedy for its own count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The LAYOUT overflow line can advise relayout for a blocked move.** Ruled out: `:3700-3710` partitions `hidden` into `blocked` and `movable` and names each remedy for its own count.

### **The outside-repository refusal can be bypassed with a case variant or a link.** Ruled out: the sibling name is compared against `path.basename(path.resolve(root))` and the resolved target is compared with `canonicalPath`, so both spellings land on the same refusal. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The outside-repository refusal can be bypassed with a case variant or a link.** Ruled out: the sibling name is compared against `path.basename(path.resolve(root))` and the resolved target is compared with `canonicalPath`, so both spellings land on the same refusal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The outside-repository refusal can be bypassed with a case variant or a link.** Ruled out: the sibling name is compared against `path.basename(path.resolve(root))` and the resolved target is compared with `canonicalPath`, so both spellings land on the same refusal.

### **The outside-repository refusal is bypassable through a symlink.** Ruled out: `canonicalPath` resolves the longest existing prefix (`:384-400`), and the test at `overlay-engine-strict-writes.test.cjs:838-850` covers a link pointing outside the repository. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The outside-repository refusal is bypassable through a symlink.** Ruled out: `canonicalPath` resolves the longest existing prefix (`:384-400`), and the test at `overlay-engine-strict-writes.test.cjs:838-850` covers a link pointing outside the repository.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The outside-repository refusal is bypassable through a symlink.** Ruled out: `canonicalPath` resolves the longest existing prefix (`:384-400`), and the test at `overlay-engine-strict-writes.test.cjs:838-850` covers a link pointing outside the repository.

### **The overlay source is missing the bridge its plugins import.** Ruled out: `v2-bridge.js` is upstream content that lands beside the plugins in the applied tree, and both tests supply it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The overlay source is missing the bridge its plugins import.** Ruled out: `v2-bridge.js` is upstream content that lands beside the plugins in the applied tree, and both tests supply it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The overlay source is missing the bridge its plugins import.** Ruled out: `v2-bridge.js` is upstream content that lands beside the plugins in the applied tree, and both tests supply it.

### **The overlays no longer apply on the new pin.** Ruled out: `status --json` reports PASSED with an empty `offLayout`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The overlays no longer apply on the new pin.** Ruled out: `status --json` reports PASSED with an empty `offLayout`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The overlays no longer apply on the new pin.** Ruled out: `status --json` reports PASSED with an empty `offLayout`.

### **The packet's criteria are ticked and therefore claim completion.** Ruled out: all six read `- [ ]`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The packet's criteria are ticked and therefore claim completion.** Ruled out: all six read `- [ ]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The packet's criteria are ticked and therefore claim completion.** Ruled out: all six read `- [ ]`.

### **The phase-003 criterion now reproduces.** Ruled out by re-running its own command verbatim: it still prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **The phase-003 criterion now reproduces.** Ruled out by re-running its own command verbatim: it still prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The phase-003 criterion now reproduces.** Ruled out by re-running its own command verbatim: it still prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`.

### **The pin is recorded inconsistently.** Ruled out: `overlay-manifest.json:6` and `sync-state.json:3` name the same commit. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The pin is recorded inconsistently.** Ruled out: `overlay-manifest.json:6` and `sync-state.json:3` name the same commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The pin is recorded inconsistently.** Ruled out: `overlay-manifest.json:6` and `sync-state.json:3` name the same commit.

### **The plugin test still stubs the bridge it is meant to guard.** Ruled out: `barter-overlay-guard.test.cjs:157-170` imports the applied plugin and asserts the real `definePlugin` shape. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The plugin test still stubs the bridge it is meant to guard.** Ruled out: `barter-overlay-guard.test.cjs:157-170` imports the applied plugin and asserts the real `definePlugin` shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The plugin test still stubs the bridge it is meant to guard.** Ruled out: `barter-overlay-guard.test.cjs:157-170` imports the applied plugin and asserts the real `definePlugin` shape.

### **The prior `layoutMoves` JSDoc finding regressed.** Ruled out by direct read at `:3435-3443`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The prior `layoutMoves` JSDoc finding regressed.** Ruled out by direct read at `:3435-3443`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The prior `layoutMoves` JSDoc finding regressed.** Ruled out by direct read at `:3435-3443`.

### **The prior `writeBackup` readability finding regressed.** Ruled out by direct read at `:4624-4628`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The prior `writeBackup` readability finding regressed.** Ruled out by direct read at `:4624-4628`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The prior `writeBackup` readability finding regressed.** Ruled out by direct read at `:4624-4628`.

### **The re-pin dropped the engine remediation.** Ruled out: the vendored engine is byte-identical to `b5a630c6efa`, which carries `3aab896957e`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The re-pin dropped the engine remediation.** Ruled out: the vendored engine is byte-identical to `b5a630c6efa`, which carries `3aab896957e`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The re-pin dropped the engine remediation.** Ruled out: the vendored engine is byte-identical to `b5a630c6efa`, which carries `3aab896957e`.

### **The relayout section is missing from the reference doc.** Ruled out: the heading is present once at `overlays.md:261` and the section names all three required terms. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The relayout section is missing from the reference doc.** Ruled out: the heading is present once at `overlays.md:261` and the section names all three required terms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The relayout section is missing from the reference doc.** Ruled out: the heading is present once at `overlays.md:261` and the section names all three required terms.

### **The release version did not reach the vendored copy.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The release version did not reach the vendored copy.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The release version did not reach the vendored copy.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`.

### **The strict-writes `allow:` branch is reachable here.** Ruled out: `overlay-manifest.json:9` sets `strictWrites: true`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The strict-writes `allow:` branch is reachable here.** Ruled out: `overlay-manifest.json:9` sets `strictWrites: true`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The strict-writes `allow:` branch is reachable here.** Ruled out: `overlay-manifest.json:9` sets `strictWrites: true`.

### **The three scans are one scan written three times with identical flags.** Ruled out: the flags differ at `:45`, `:71` and `:132`, which is the finding rather than a refutation of it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The three scans are one scan written three times with identical flags.** Ruled out: the flags differ at `:45`, `:71` and `:132`, which is the finding rather than a refutation of it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The three scans are one scan written three times with identical flags.** Ruled out: the flags differ at `:45`, `:71` and `:132`, which is the finding rather than a refutation of it.

### **The vendored copy omits the engine tests.** Ruled out by listing the tests folder: all six `overlay-engine-*.test.cjs` files are present. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The vendored copy omits the engine tests.** Ruled out by listing the tests folder: all six `overlay-engine-*.test.cjs` files are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The vendored copy omits the engine tests.** Ruled out by listing the tests folder: all six `overlay-engine-*.test.cjs` files are present.

### **The vendored engine diverges from the pin in a security-relevant way.** Ruled out in iteration 4 by byte diff against `b5a630c6efa`; re-confirmed here by reading the same reader functions in the vendored copy. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The vendored engine diverges from the pin in a security-relevant way.** Ruled out in iteration 4 by byte diff against `b5a630c6efa`; re-confirmed here by reading the same reader functions in the vendored copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The vendored engine diverges from the pin in a security-relevant way.** Ruled out in iteration 4 by byte diff against `b5a630c6efa`; re-confirmed here by reading the same reader functions in the vendored copy.

### **The version bump did not reach the skill file.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The version bump did not reach the skill file.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The version bump did not reach the skill file.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`.

### **Unvalidated `overlayDir` steering the manifest probe.** Considered that `pre-commit:106` resolves `overlayDir` without validation. The engine validates the same setting and refuses a bad value, so the probe can only pick a manifest the engine would then reject. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Unvalidated `overlayDir` steering the manifest probe.** Considered that `pre-commit:106` resolves `overlayDir` without validation. The engine validates the same setting and refuses a bad value, so the probe can only pick a manifest the engine would then reject.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Unvalidated `overlayDir` steering the manifest probe.** Considered that `pre-commit:106` resolves `overlayDir` without validation. The engine validates the same setting and refuses a bad value, so the probe can only pick a manifest the engine would then reject.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
BLOCKED on: coverage
Recovery: Amend 003-engine-docs-and-release/goal.md:62 so its third clause excludes assets/ or anchors the opt-in pattern to the layout rule, which makes the tick reproducible and closes checklist_evidence; then re-run /deep:review. The second cause is an authority limit: validate.sh --recursive --strict is outside this lineage's write surface.
Address the blocking gates before the next iteration.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:**
  - `.skilled/commands/doctor/scripts/overlay-engine.cjs` (the overlay engine, ~6.5k lines).
  - `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` (the engine suites).
  - `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` and `.skilled/skills/system-skilled-doctor/references/overlays.md` (docs).
  - `barter/ai-speckit/overlays/` (the consumer's overlay folder), `barter/ai-speckit/skilled/.skilled-overlays.json` (the setting).
  - Packet `specs/system-skilled-doctor/007-overlay-framework-root-layout` and children 001-008.
- **Behavior claims to verify:**
  - D1: `framework/` + `root/` is every consumer's default; old-layout trees keep applying with a capped LAYOUT notice until one `apply --relayout`.
  - D2: `overlayDir` may name only `../<name>`; deeper paths and a folder outside the git repository are refused.
  - D3: `repin --stage <dir>` holds `<dir>/<tree>` and `<dir>/<overlays>`, writing nothing live.
  - D4: `ai-speckit/skilled/.skilled-overlays.json` stays inside the vendored copy and names `../overlays`.
- **Reuse and conventions:** the engine's per-line remedy branching (`overlay-engine.cjs:3652-3655`) is the pattern the LAYOUT and strict-write remedies were asked to follow.
- **Review risks and gaps:**
  - The prior generation's findings are the baseline; each must be re-verified against the current tree, not against the remediation commit message.
  - `barter/ai-speckit` is a nested repository and is read-only for this run.
  - The prior generation's scope gate failed because a fan-out lineage never records `reviewScopeFiles`. This lineage seeds it in `deep-review-config.json` so the gate can judge the findings it actually raised.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | D2 sibling-only rule and outside-repository refusal enforced at the setting reader; D1 framework/root rule stated and implemented |
| `checklist_evidence` | core | pass | 4 | Four of six completion criteria executed read-only and all four pass; the two Skilled-side criteria are scheduled for the maintainability iteration |
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
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | D1, D2 | 2 | 0 P0, 0 P1, 2 P2 | partial |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | D2 | 2 | 0 P0, 0 P1, 0 P2 | partial |
| `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` | D1 | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` | D1 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` | D1 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs` | D1 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/overlays/overlay-manifest.json` | D1, D3 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| `barter/ai-speckit/overlays/sync-state.json` | D1, D3 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` | D1, D3 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js` | D1 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js` | D1 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` | D1, D2 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` | D1 | 5 | 0 P0, 0 P1, 1 P2 | partial |
| `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` | D1 | 5 | 0 P0, 0 P1, 1 P2 | partial |
| `barter/ai-speckit/skilled/.skilled/hooks/overlay-guard/{claude,codex,devin,cursor}/overlay-guard.*` | D1 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` | D1, D3 | 6 | 0 P0, 0 P1, 1 P2 | partial |
| `barter/ai-speckit/overlays/sync-state.json` | D1, D3 | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | D1, D3 | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` | D1 | 8 | 0 P0, 0 P1, 1 P2 | partial |
| `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` | D1 | 8 | 0 P0, 0 P1, 0 P2 | complete |
| `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` | D1 | 8 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-flash-max-1795192401900-xpt66n, parentSessionId=2026-11-20T16:33:02.758Z, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-20T16:34:32.390Z
<!-- MACHINE-OWNED: END -->
