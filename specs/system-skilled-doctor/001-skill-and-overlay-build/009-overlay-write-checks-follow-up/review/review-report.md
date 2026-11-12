---
title: "Deep Review Synthesis: overlay write checks follow-up"
description: "Synthesis of five deep-review iterations over the overlay engine follow-up, with each P0 and P1 finding checked against the code."
trigger_phrases:
  - "overlay follow up review synthesis"
importance_tier: "important"
contextType: "implementation"
---

# Deep Review Synthesis: overlay write checks follow-up

Target: commits `c57b7e4cef..e97ca56e8d` on `main`, the overlay engine follow-up. Inputs: the `deepseek` lineage (iterations 001 to 003 and its report) and the `opus` lineage (iterations 001 and 002 and its report). HEAD at synthesis time is `edbe66247b`. `git diff --stat e97ca56e8d HEAD` over `.skilled/commands/doctor`, `.skilled/hooks/overlay-guard`, `.skilled/skills/system-skilled-doctor` and `.opencode/plugins/overlay-guard.js` is empty, and those paths have no uncommitted change. Line numbers below therefore hold at HEAD and at `e97ca56e8d`.

## 1. Verdict

**CONDITIONAL.** There is no P0. Three P1 findings are confirmed by running the engine against throwaway fixtures, and all three sit in `apply --relayout`. First, a relayout can leave a live layout link dangling, and the follow-up apply then refuses to repair it. Second, the relayout backup reads token-named files the documented read rule forbids and copies them. Third, a relayout that fails after its moves leaves the overlay folder half-moved, and the apply workflow tells the operator nothing was written. There are nine P2 findings, all confirmed: two by running, seven by reading. Counts by severity and status: P0 0. P1 3 confirmed (3 by running). P2 9 confirmed (2 by running, 7 by reading). Unconfirmed 0. Rejected findings 0. One "confirmed clean" claim from a source is rejected (section 5). I changed two severities from what the sources gave. The legacy-lock finding goes from P1 to P2 (SYN-04). The engine half of the relayout partial-failure finding goes from P2 to P1, because I merged it with its reporting half (SYN-03). The existing suites pass at HEAD: 44 of 44 in the follow-up, strict-writes and contract tests, and 5 of 5 in the OpenCode adapter test. None of them exercises a P1 path.

### Lineage status

`orchestration-summary.json` records 2 lineages, 1 succeeded and 1 failed with failure class `exit`. The failed lineage is **`opus`**. `orchestration-status.log` gives the reason: `lineage opus violated max-iterations stop policy: missing deep-review-state.jsonl for max-iterations stop-policy validation`, with `exit_code 0` and `retry_verdict fatal`. The opus report says why: the session's permission layer refused every `node` call, so the append gateway and the reducer never ran.

Listing of `review/lineages/opus/`: `.executor-state/` (empty), `containment/`, `deep-review-audit-ledger/` (2 frames), `deep-review-config.json`, `deep-review-effect-ledger/`, `deep-review-strategy.md`, `deltas/` (iter-001, iter-002), `gateway-events/` (`build-run-open.cjs`, `iteration-001.json`, `iteration-002.json`, `synthesis.json`), `invocation-metadata.json`, `iterations/` (001, 002), `locks-and-fencing-v1/`, `logs/`, `review-report.md`.

Missing compared with the completed `deepseek` lineage: `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `deep-review-ledger/`, `.legacy-projection-watermarks/`, and any event file under `.executor-state/`. The opus iteration narratives and report do exist, and this synthesis uses them as inputs. Its records were never replayed into the reducer.

## 2. P1 findings

### SYN-01 · `apply --relayout` leaves a dangling layout link that the follow-up apply refuses to retarget

- **Severity:** P1 (both sources say P1, and I agree)
- **Status:** confirmed by running
- **Sources:** deepseek `R1-P1-002`, opus `OPUS-I1-P1-001`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:4740-4742` (relayout leaves the live link alone), `:1701-1707` (the retarget gate), `:1662-1665` (`isRecordedLink`), `:486-488` (a state file with no `links` key loads as no records)
- **What goes wrong:** relayout renames the copy and rewrites the manifest's `layoutLinks[].target`, but it does not touch the live symlink. The plain `apply` that the docs say "retargets the live links" (`overlay.md:108`, `references/overlays.md:91`, `doctor-overlay-apply.yaml:104`) retargets a link only when `sync-state.json` records the link's current target. A state file written by the previous release has no `links` key. So does a tree where no apply has run with this engine since the upgrade, or where the link was made by hand. Every such tree ends with a link pointing at a path that no longer exists, and the apply is blocked with `changed=0`. No engine command repairs it. The link has to be fixed by hand.
- **Evidence (ran, in a `mktemp -d` folder, since deleted):** fixture with a directory entry `custom/bundle -> .skilled/skills/hub/bundle`, the layout link `bundle-view -> skilled-overlays/custom/bundle` made by hand, and no state file.
  ```
  -- apply --relayout
  backup skilled-overlays/relayout-runs/2026-11-11T23-37-18.174Z
  moved custom/bundle -> skilled/skills/hub/bundle
  1 moved
  run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply
    -> exit=0
  -- live link now: skilled-overlays/custom/bundle  (resolves: NO-dangling)
  -- manifest link target: "target":"skilled-overlays/skilled/skills/hub/bundle"
  -- follow-up apply
  BLOCKED  layout: bundle-view exists but is not the link to skilled-overlays/skilled/skills/hub/bundle
  blocked=1 changed=0
    -> exit=1
  ```
  Control: the same tree with one plain `apply` first. That apply records `"links":{"bundle-view":"skilled-overlays/custom/bundle"}` (`:2579-2594` records every link already standing at its target), and the follow-up apply then prints `linked bundle-view -> skilled-overlays/skilled/skills/hub/bundle` and exits 0. So the defect is limited to trees without the record. That includes every project upgrading from `v4.0.2.1` whose first action with the new engine is `status` and then `apply --relayout`, which is the order the `LAYOUT` line suggests.
- **Fix (one change):** in `relayoutUnderLock`, after the renames, retarget each live link whose `readlink` still equals the `from` that `relayoutLinkTargets` returns. Use the same lstat-is-a-link check as `applyLayoutLink`, and leave any other live path alone. Update the comment at `:4740-4741` to match.
- **Test that proves it:** a `overlay-engine-follow-up.test.cjs` case built like the fixture above: no state file and one layout link into the moved folder. Run `apply --relayout`, then `apply`. Both exit 0, and `readlink` equals the rewritten manifest target. This test also closes SYN-09.

### SYN-02 · The relayout backup reads and copies token-named files that the read rule forbids

- **Severity:** P1 (the source says P1, and I agree)
- **Status:** confirmed by running
- **Sources:** deepseek `R2-P1-001`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:4618-4622` (`copyForBackup` skips only `isEnvName` and then `fs.readFileSync`s everything else), `:4724` (its only caller for moved copies), `:1899-1902` (`isProtectedReadPath`, which the relayout path never calls)
- **What goes wrong:** `references/overlays.md:103-106` says a file whose name contains `token` is read only when the manifest names its exact path, and that a `directory` or `skill-root` walk refuses any token-named file its `protectedPaths` does not list. `apply` enforces that rule. `apply --relayout` does not. It reads every non-dotenv file under a moved folder and writes the bytes into `<overlayDir>/relayout-runs/<stamp>/`. No document tells a project to gitignore that folder, so a tree that ignores the original by its exact path gets an unignored duplicate of the secret.
- **Evidence (ran):** directory entry with `protectedPaths: ["assets/tokens.css"]` and an unlisted `assets/api-token.js` holding `SECRET-BYTES-123`.
  ```
  -- apply (expect refusal)
  BLOCKED  hub-bundle: refusing to inspect a protected path: skilled-overlays/custom/bundle/assets/api-token.js; if the overlay owns it, add "assets/api-token.js" to this entry's protectedPaths
  blocked=1 changed=0
    -> exit=1
  -- apply --relayout
  backup skilled-overlays/relayout-runs/2026-11-11T23-37-18.455Z
  moved custom/bundle -> skilled/skills/hub/bundle
  1 moved
    -> exit=0
  -- token-named copies now on disk:
  ./skilled-overlays/relayout-runs/2026-11-11T23-37-18.455Z/skilled-overlays/custom/bundle/assets/api-token.js
  ./skilled-overlays/skilled/skills/hub/bundle/assets/api-token.js
  -- backup copy bytes: SECRET-BYTES-123
  ```
  So the same entry that `apply` refuses is read and duplicated by `apply --relayout`.
- **Fix (one change):** pass `exactManifestPaths(ctx, manifest)` into `copyForBackup` and skip on `isProtectedReadPath(sourcePath, exact)` instead of `isEnvName(sourcePath)`. Print the same `skipped <path>` line. (An equally valid alternative is to refuse, before the first move, any entry whose plan is blocked by a protected path.)
- **Test that proves it:** the fixture above as a follow-up test. Assert that no file under `relayout-runs/` has a basename containing `token`, and that the output carries `skipped custom/bundle/assets/api-token.js`.

### SYN-03 · A relayout that fails after its moves leaves the folder half-moved, and the route reports "nothing was written"

- **Severity:** P1. opus rated the reporting half P1 (`OPUS-I2-P1-005`) and the engine half P2 (`OPUS-I1-P2-004`). I merged them because one change fixes both, and gave the merged finding P1 because I found a deterministic trigger.
- **Status:** confirmed by running
- **Sources:** opus `OPUS-I2-P1-005`, opus `OPUS-I1-P2-004`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:4730-4738` (the renames), `:4742` (manifest rewrite after them), `:4672-4673` and `:4687-4688` (the throws), `:4849-4853` (`main` turns the throw into exit 2 plus an `[overlay-engine]` line on stderr); `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:113`
- **What goes wrong:** `rewriteRelayoutManifest` checks each field only after every copy has been renamed. When the check throws, the copies are already at their layout paths, the manifest still names the old paths, a backup exists, and the engine exits 2. `doctor-overlay-apply.yaml:113` reads exactly that exit as "the manifest changed under the run ... and nothing was written", so the route ends `STATUS=FAIL` and names no restore. The trigger does not need a concurrent hand edit. A manifest with two entries that share an `id` is enough, because `rewriteRelayoutManifest` keys entries by id in a `Map` (`:4662-4666`). Nothing refuses duplicate ids: `loadManifest` has no such check, and no `duplicate` or unique-id test exists in the engine. A `renameSync` failure part-way through the list (EACCES, EXDEV) leaves the same half-moved state.
- **Evidence (ran):** two `file` entries, both `"id":"dup"`, with sources `custom/a.md` and `custom/b.md`.
  ```
  -- apply --relayout
  backup skilled-overlays/relayout-runs/2026-11-11T23-37-18.508Z
  moved custom/a.md -> skilled/a.md
  moved custom/b.md -> skilled/b.md
  [overlay-engine] overlay dup no longer keeps custom/a.md in source
    -> exit=2
  -- overlay folder after:
  ./overlay-manifest.json
  ./skilled/a.md
  ./skilled/b.md
  -- manifest sources after: "source":"custom/a.md" "source":"custom/b.md"
  ```
  The manifest was not edited during the run, yet the engine reports that it changed. Both copies moved, and the manifest still names `custom/`.
- **Fix (one change):** split `rewriteRelayoutManifest` so the edit list and the new manifest text are built and checked before the first `renameSync`, and only the precomputed text is written after the moves. A field mismatch or a duplicate id then refuses with nothing moved, and the YAML's "nothing was written" becomes true. The rename-failure case remains, and the YAML row should name the `relayout-runs/<stamp>/` backup as the restore for it.
- **Test that proves it:** the duplicate-id fixture above. Assert exit 2, no `moved` line, `custom/a.md` and `custom/b.md` still in place, and no `relayout-runs/` folder.

## 3. P2 findings

### SYN-04 · A lock written by the previous release is never taken over

- **Severity:** P2. The source says P1, and I lowered it: the engine fails closed, the refusal already names the file to delete, it happens at most once per project, and the host-less line cannot prove it was written on this host.
- **Status:** confirmed by running
- **Sources:** deepseek `R1-P1-001`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:2235-2237`
- **What goes wrong:** `isLockOwnerGone` returns false unless the line carries both ` pid=` and ` host=`. The released `v4.0.2.1` engine writes `${owner} pid=${process.pid} ${ISO}` with no host (`git show v4.0.2.1:.skilled/commands/doctor/scripts/overlay-engine.cjs` line 1981, the same as at `c57b7e4cef`). A killed run of that release therefore still blocks every later run after the upgrade. Unlike `references/overlays.md:99` and `handover-to-barter.md:20`, which list only a live owner, another host and no pid as refusals, this case is not documented.
- **Evidence (ran):** called the exported `acquireLock` against a temp lock file holding a reaped pid.
  ```
  legacy-format dead-pid lock: isHeld=false ownerLine="overlay-engine apply pid=35788 2026-11-10T09:12:44.001Z"
  current-format dead-pid lock: isHeld=true
  ```
- **Fix (one change):** treat a line with a pid and no ` host=` token as written on this host and probe the pid. Only the earlier engine wrote that shape, and it ran locally. The cost: a host-less lock on a folder shared across machines could be taken from a live run elsewhere. If that is unacceptable, document the one-time hand delete in `references/overlays.md:99` instead.
- **Test that proves it:** a lock test that writes `overlay-engine apply pid=<dead> 2026-01-01T00:00:00.000Z` and expects the `note:` line and exit 0, plus a host-less line with a live pid that still refuses.

### SYN-05 · Stale-lock takeover can delete a lock another run has just taken (the orchestrator's race)

- **Severity:** P2. opus says P2, and I agree. The race is real: it breaks mutual exclusion, which the spec's risk table rates "High: two writers in one overlay folder". It is narrow, though. It needs a dead-owner lock on this host and two runs that both reach the takeover branch inside the gap between one run's read at `:2261` and its unlink at `:2270`. That gap includes a `console.log`.
- **Status:** confirmed by running (a forced interleaving)
- **Sources:** orchestrator; opus `OPUS-I1-P2-002`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:2261-2275`
- **What goes wrong:** run A reads the stale line and judges it dead. Run B does the same, unlinks the file, creates its own lock with `wx` and writes its line. A's `unlinkSync` at `:2270` then removes B's live lock without re-reading it, and A's `openSync(..., 'wx')` succeeds. Both runs return `isHeld: true` and write the destinations and `sync-state.json` at once. B's `release` leaves A's lock in place because the bytes differ, so the double hold leaves no trace afterwards. The comment at `:2267-2268` says this race only makes the retry report the other run's owner. That is true only when B has unlinked but not yet re-created the file. `release` (`:2294-2295`) has the same compare-then-unlink gap, but no other run can take over a live owner on this host, so that gap is negligible.
- **Evidence (ran):** called `acquireLock` with `fs.unlinkSync` wrapped so that, at A's first unlink of the lock path, B's remove-create-write runs first (host name redacted):
  ```
  note: took over the overlay lock of a run that has ended: overlay-engine apply pid=35788 host=<host> 2026-11-10T09:12:44.001Z
    [B] took the lock: run-B pid=99999 host=<host> now
    [A] isHeld=true file now holds: run-A pid=35787 host=<host> 2026-11-11T23:35:14.268Z
    B believes it holds the lock, A believes it holds the lock: both=true
  ```
- **Fix (one change):** serialize the takeover behind a short-lived `<lock>.takeover` file created with `wx`. Inside it, re-read the lock and unlink only when the bytes still equal the line judged stale, then create the new lock and remove `.takeover`. When `.takeover` already exists, refuse and name it.
- **Test that proves it:** the interleaving above as a unit test on the exported `acquireLock`. Assert that A returns `isHeld: false` and that B's line is still in the file.

### SYN-06 · Dropping an entry deletes an identical item that upstream now ships

- **Severity:** P2 (opus says P2, and I agree)
- **Status:** confirmed by reading
- **Sources:** opus `OPUS-I1-P2-003`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:893-903` and `:927` (`wasRecorded` keeps reporting an already-live item as listed), `:1109-1127` (`removeDroppedItems`), `:1060-1071` (`findRecordedIndex`)
- **What goes wrong:** once the engine records an item, the record survives as long as the entry set lists it. That stays true after a re-pin brings an upstream file that holds the same item, because an existing recorded item still calls `reportListed`. If the entry set later drops the item, `removeDroppedItems` finds it by identity, `deepEqual` passes (the bytes match), and the line upstream now ships is deleted. Status then reports in-sync. The existing test at `overlay-engine-follow-up.test.cjs:328` covers only an item upstream held before the overlay added it.
- **Evidence:** the lines above. I did not run it because building the fixture needs a re-pin.
- **Fix (one change):** in `removeDroppedItems`, skip the removal and drop the record when the pinned upstream copy of the destination holds the same item.
- **Test that proves it:** append `"foo"` through an entry, re-pin to an upstream whose list holds `"foo"`, drop it from the entry set, and apply. Assert that `"foo"` remains.

### SYN-07 · The status workflow names `/doctor:overlay relayout`, a target that does not exist

- **Severity:** P2 (both sources say P2, and I agree)
- **Status:** confirmed by reading
- **Sources:** deepseek `R3-P2-001`, opus `OPUS-I2-P2-006`
- **File:line:** `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:58`, and the invariant at `:28`, which says "apply, capture or relayout"
- **What goes wrong:** line 58 tells the route to "name /doctor:overlay relayout beside each LAYOUT line". `relayout` is a flag of `apply`. The engine prints `run ... apply --relayout` (`overlay-engine.cjs:2480`), and every other document names `/doctor:overlay apply --relayout`. An operator who copies the route's form gets the unknown-target failure.
- **Evidence:** the `grep -n relayout` output of the status YAML shows `:58` as quoted above.
- **Fix (one change):** change `:58` to `/doctor:overlay apply --relayout`, and `:28` to `apply --relayout`.
- **Test that proves it:** a contract check in `doctor-overlay-contract.test.cjs` that every `/doctor:overlay <word>` in the overlay assets names a target the router binds.

### SYN-08 · The relayout `skipped` rows name the wrong rule and the wrong outcome

- **Severity:** P2 (the source says P2, and I agree)
- **Status:** confirmed by reading
- **Sources:** deepseek `R2-P2-001`
- **File:line:** `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:540` and `:518`; the same wording at `doctor-overlay-apply.yaml:111`
- **What goes wrong:** `:540` says a `skipped` line means "The file is token-named, so the engine never opened it and left it where it was". The engine skips only a dotenv name (`overlay-engine.cjs:4580`, `:4618`), not a token name (see SYN-02). A dotenv file nested in a moved folder is skipped by the backup, but `:4732` renames the whole folder, so the file moved with it. Following the row, an operator moves a copy by hand that has already moved.
- **Evidence:** the lines above. I did not run it, because the brief bars naming a dotenv file in a shell command.
- **Fix (one change):** reword both rows and the YAML line: a `skipped` line names a credential copy the backup did not copy. A top-level one stayed in place. A nested one moved with its folder.
- **Test that proves it:** none needed for the wording. Once SYN-02 lands, its test also pins the `skipped` line.

### SYN-09 · No test or playbook scenario covers the relayout link rewrite

- **Severity:** P2 (both sources say P2, and I agree)
- **Status:** confirmed by reading
- **Sources:** deepseek `R3-P2-002`, opus `OPUS-I2-P2-009`
- **File:line:** `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:549`; `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md:44` and `:56`
- **What goes wrong:** every relayout fixture sets `layoutLinks: []`. `grep -n "layoutLinks: \["` over both engine test files finds one non-empty list, at `:177`, and that is a plain-apply retarget case. So `relayoutLinkTargets` (`:4633-4648`) and the link half of `rewriteRelayoutManifest` (`:4678-4692`) never run under test, which is how SYN-01 shipped.
- **Fix and test:** the SYN-01 test, plus a playbook step in SKD-009 that carries one layout link.

### SYN-10 · The canonical lock scenario only writes the new owner-line format

- **Severity:** P2 (the source says P2, and I agree)
- **Status:** confirmed by reading
- **Sources:** deepseek `R3-P2-003`
- **File:line:** `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/stale-lock-takeover.md:48` and `:53`
- **What goes wrong:** both lock writes use `pid=%s host=%s %s`. No scenario or test writes the `v4.0.2.1` shape, so SYN-04 cannot be caught.
- **Fix and test:** add one step that writes the host-less shape, with the outcome SYN-04 settles on.

### SYN-11 · The lock docs leave out relayout, rollback and adopt

- **Severity:** P2 (opus says P2, and I agree)
- **Status:** confirmed by reading
- **Sources:** opus `OPUS-I2-P2-008`
- **File:line:** `.skilled/skills/system-skilled-doctor/references/overlays.md:57` and `:99`
- **What goes wrong:** `:57` says `.build-lock` is present only while "an `apply`, a capture, an adopt or a re-pin runs", and `:99` says "`apply` and a capture take" it. The engine also takes the lock for `apply --relayout` (`overlay-engine.cjs:4755`) and the re-pin rollback (`:3864`), and `:99` also omits adopt and re-pin (`:4226`, `:3778`). An operator who sees the lock during a relayout could judge it stale and delete it.
- **Fix:** list every `withLock` caller in both places. No test is needed.

### SYN-12 · Any staged pin change switches the whole commit check off

- **Severity:** P2 (opus says P2, and I agree). This behaviour predates the reviewed range: the `stagedPin`/`headPin` lines are not in `git diff c57b7e4cef^ e97ca56e8d`. It is also documented at `references/overlays.md:159` ("A commit that moves the pin is a re-pin and is not checked").
- **Status:** confirmed by reading
- **Sources:** opus `OPUS-I2-P2-007`
- **File:line:** `.skilled/commands/doctor/scripts/overlay-engine.cjs:4290-4293`
- **What goes wrong:** when the staged manifest's `pin.commit` differs from HEAD's, `stagedUnownedChanges` returns no findings for any staged path. A hand edit of the pin, or a re-pin commit that also stages unrelated vendored edits, passes unchecked.
- **Fix (one change):** on a pin change, still judge staged paths that the old-to-new upstream diff does not touch.
- **Test that proves it:** stage a pin bump plus an unowned edit to a path upstream did not change, and expect exit 1.

## 4. Merged duplicates and severity changes

| Synthesis id | Source ids | Source severity | Mine |
|---|---|---|---|
| SYN-01 | deepseek R1-P1-002, opus OPUS-I1-P1-001 | P1, P1 | P1 |
| SYN-02 | deepseek R2-P1-001 | P1 | P1 |
| SYN-03 | opus OPUS-I2-P1-005, opus OPUS-I1-P2-004 | P1, P2 | P1 |
| SYN-04 | deepseek R1-P1-001 | P1 | P2 |
| SYN-05 | orchestrator, opus OPUS-I1-P2-002 | P2 | P2 |
| SYN-06 | opus OPUS-I1-P2-003 | P2 | P2 |
| SYN-07 | deepseek R3-P2-001, opus OPUS-I2-P2-006 | P2, P2 | P2 |
| SYN-08 | deepseek R2-P2-001 | P2 | P2 |
| SYN-09 | deepseek R3-P2-002, opus OPUS-I2-P2-009 | P2, P2 | P2 |
| SYN-10 | deepseek R3-P2-003 | P2 | P2 |
| SYN-11 | opus OPUS-I2-P2-008 | P2 | P2 |
| SYN-12 | opus OPUS-I2-P2-007 | P2 | P2 |

The table maps ids only. It is not a findings table.

## 5. What the reviews agree is sound

- Dropped-item removal deletes only when the array, the identity and the recorded bytes all match, and it throws on a hand edit (`:1109-1127`). The one gap is SYN-06.
- The link retarget re-checks that the path is still a link before unlinking, so a real file or folder that replaced it is never deleted (`:1737-1739`).
- `loadState` validates the new `links` and `items` shapes, and a missing key means "nothing owned" (`:486-499`).
- Relayout refuses a present target, a missing source, a clash and nested moves before writing anything, and it writes the backup before the first rename. Links are backed up as links (`:4544-4585`, `:4604-4609`, `:4723-4727`).
- `globToRegExp` escapes metacharacters and gives `**/` its segment meaning. `commandGuard` refuses an owned destination before the strict-write test. `isSameText` normalizes only CRLF and treats a NUL byte as binary.
- `status --audit` skips generated, managed and dotenv paths, is read-only, and fails the status as the documents say.
- The OpenCode adapter is a relative symlink to `.opencode/plugins/overlay-guard.js`, confirmed with `ls -la`. Both lineages found its four REQ-013 cases tested, and the test passes at HEAD (5 of 5).
- `USAGE` and `parseArguments` agree, `--audit` is limited to `status` and `--relayout` to `apply`, and `references/overlays.md` carries 8 trigger phrases.

**Rejected "clean" claim:** deepseek iteration 001 lists "The race between `unlinkSync` and the retry `openSync` is handled" as a confirmed-clean surface. SYN-05's reproduction disproves it: the retry is reached only when the other run has not yet re-created the lock.

## 6. Coverage gaps

- No iteration ran a test, a playbook scenario or a validator. The deepseek lineage was barred from writing outside its folder, and the opus lineage could not run `node`. I ran `node --test` over `overlay-engine-follow-up.test.cjs`, `overlay-engine-strict-writes.test.cjs` and `doctor-overlay-contract.test.cjs` (44 tests, 44 pass, exit 0) and over `opencode-overlay-guard.test.mjs` (5 tests, 5 pass, exit 0). `git status --porcelain` was the same before and after. `route-validate.sh`, `sync-runtime-mirrors.cjs --check`, the other overlay suites (`-fixes`, `-repin`, `-replay`, `-sync`) and the five new playbook scenarios were run by nobody.
- `overlay-engine-strict-writes.test.cjs` was never read for content. deepseek did not open it, and opus read test names only.
- Relayout for `skill-root` entries, for a `marked-section` whose `source` differs from its `fragment`, and for a layout link that points into a moved folder's subpath was not checked by anyone. `relayoutLinkTargets` handles the subpath case in code (`:4641-4642`) but has no test.
- Capture, adopt and the re-pin rollback were reviewed only as lock takers. Their interaction with the new `links` and `items` state was not reviewed.
- The OpenCode plugin loads the core with a top-level `require`. Whether a missing core makes OpenCode block or skip the plugin is UNKNOWN (opus deferred item), and it would take a live OpenCode run to settle.
- On a case-insensitive file system, a strict-write check on a new file under a not-yet-existing, differently cased folder keeps the typed case (opus edge case). Nobody tested it.
- The regenerated trigger index and leaf aliases in the range were treated as generator output and not reviewed.
- `tasks.md` T022 to T028 (changelog, skill version `1.1.6.0`, tag republish) are still open by plan and were not judged.

## 7. Closing list

**Confirmed by running**
- SYN-01: relayout leaves a dangling link the follow-up apply refuses (temp fixture, exit 1 and the `BLOCKED layout` line; control case exits 0)
- SYN-02: the relayout backup copies an unlisted token-named file (temp fixture, the file and its bytes found under `relayout-runs/`)
- SYN-03: a duplicate-id manifest makes relayout move both copies, then exit 2 with the manifest unchanged (temp fixture)
- SYN-04: a host-less dead-pid lock returns `isHeld=false` (exported `acquireLock`)
- SYN-05: a forced interleaving leaves both runs with `isHeld=true` (exported `acquireLock`)
- The baseline suites: 44 of 44 and 5 of 5 pass at HEAD

**Confirmed by reading**
- SYN-06, SYN-07, SYN-08, SYN-09, SYN-10, SYN-11, SYN-12

**Not confirmed**
- None of the findings. The two opus deferred items (the OpenCode top-level `require`, and case handling on a case-insensitive file system) remain open questions, not findings.

All fixtures were built in a `mktemp -d` folder outside the repository and deleted afterwards. No repository file other than this report was written.
