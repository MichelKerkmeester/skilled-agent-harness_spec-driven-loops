# Iteration 4: Staging and Rollback Retention

## Focus
Q4: argue both sides of retaining staging + rollback for a single-operator git-backed build tool, given the former live-runtime `rmSync` hazard.

## Findings
1. **Historical hazard is real and confirmed:** the P0 foundation build did `fs.rmSync(RUNTIME_ROOT, { recursive: true, force: true })` then copied into the live root — a crash mid-copy leaves serving half-deleted. [SOURCE: git show 4153cbebd8 .opencode/bin/compiled-route-sync.cjs (rmSync at historical +169)]
2. **Current publication path eliminates live-root wipe:** build writes a sibling staging tree, verifies staging, `renameSync`s prior runtime → rollback sibling, `renameSync`s staging → runtime, verifies post-publish, **retains** rollback until explicit `--finalize` / `--revert`. Comments state deleting rollback early would make exact rollback unrecoverable for post-publish gates. [SOURCE: .opencode/bin/compiled-route-sync.cjs:746] [SOURCE: .opencode/bin/compiled-route-sync.cjs:817] [SOURCE: .opencode/bin/compiled-route-sync.cjs:821] [SOURCE: .opencode/bin/compiled-route-sync.cjs:888]
3. **Case FOR retaining staging + rollback (recommended):**
   - Directory rename is closer to atomic than copy-over-live; avoids the rmSync window.
   - Post-publish gates (status/parity/kill-switch/scorer) need a recoverable prior closure; git checkout does not restore an uncommitted mid-flight tree or an already-swapped runtime that other processes may be reading.
   - `finalize`/`revert` plus publication-state phases (`finalize-cleanup`, `revert-cleanup`) and lock binding provide crash-resume semantics beyond "git reset". [SOURCE: .opencode/bin/compiled-route-sync.cjs:924] [SOURCE: .opencode/bin/compiled-route-sync.cjs:938] [SOURCE: .opencode/bin/compiled-route-sync.cjs:311]
4. **Case AGAINST full complexity:**
   - Runtime closure is git-tracked (`git ls-files` shows sync tool + serving-closure + ~74 compiled-routing paths), so a completed bad promote can often be undone with git for **committed** state.
   - Single-operator local use rarely needs multi-writer leases; nested rename recovery is exercised mainly via `_testFailRename` injection. [SOURCE: command: git ls-files compiled-routing | wc -l → 74] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:870]
   - Packet is oversized (sync tool ~1086 lines; tests ~1372); speculative three-way external-manifest reconciliation was already trimmed in `19b87f67a1`. [SOURCE: wc -l] [SOURCE: git show 19b87f67a1 commit message / diff notes]
5. **Balanced recommendation:** **Keep staging + atomic rename + retained rollback + SHA-256 publication binding + finalize/revert cleanup.** Treat nested multi-rename recovery branches that exist only for `_testFailRename` as prune candidates after lifecycle tests can run (blocked today by Q2 compile failures). Do **not** return to live-root `rmSync`. [INFERENCE: prune size ~100 lines per operator baseline; exact line count of test-only recovery not re-measured beyond injection call sites]
6. **Git is complementary, not a substitute for mid-publish recovery:** git restores last committed tree; staging/rollback protect the window between "old runtime moved aside" and "new runtime verified / finalized." [INFERENCE: from rename sequence at :817–:895]

## Ruled Out
- Direct live-root `rmSync` + copy publication: historically present; unsafe. [SOURCE: 4153cbebd8 rmSync]
- Git revert as the *only* operational rollback for in-flight publish: does not cover the rename window or retained prior closure for post-publish gates. [SOURCE: .opencode/bin/compiled-route-sync.cjs:888]
- Keeping every nested rename recovery branch as the minimum next move: not required for safety recommendation; prune after tests green. [SOURCE: test _testFailRename sites]

## Dead Ends
Repo-wide "rollback" grep hits unrelated systems; narrowing to `compiled-route-sync.cjs` + its tests + git history worked.

## Edge Cases
- UNVERIFIED: whether production operators actually run the post-publish gate script sequence before `--finalize` today (comment implies they should).
- Partial success: lifecycle tests cannot currently validate rename recovery because `--check`/build fail earlier on unresolved hubs (Q2).

## Sources Consulted
- compiled-route-sync.cjs build/finalize/revert
- git history 4153cbebd8, 19b87f67a1
- compiled-route-manifest.test.cjs _testFailRename
- git ls-files counts

## Assessment
- New information ratio: 1.00
- Answer: retain staging/rename/rollback/finalize; prune test-only nested recovery later; never restore live rmSync.

## Recommended Next Focus
Q5: minimum sequenced work for reproducibility, self-reporting, unattended safety — safe-now vs wait-for-sk-design.
