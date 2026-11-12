# Review Iteration 001 — Correctness of the data-loss and safety paths

## Dispatcher

- Mode: `review` · target agent `deep-review` · resolved route `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-1794439428470-vyb51k`, generation 1, lineageMode `new`
- Executor: this process (detached fan-out lineage `cli-pi model=deepseek-v4.1-flash-1017`); no nested dispatch
- Budget profile: `verify` (11-13 calls)
- Bindings: `BINDING: target=commits c57b7e4cef..e97ca56e8d on main` · `BINDING: maxIterations=3` · `BINDING: convergence=0.1` · `BINDING: mode=review` · `BINDING: dimensions=correctness,security,traceability,maintainability` · `BINDING: specFolder=specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up`
- Sources read this iteration (including the lead channel): `steer.md` (absent — no lead ruling to apply), `spec.md`, `tasks.md`, `deep-review-strategy.md`, `deep-review-config.json`, `references/overlays.md`, `overlay.md`, `assets/doctor-overlay-apply.yaml`, `assets/doctor-overlay-status.yaml`, `assets/doctor-overlay-presentation.txt`, `_routes.yaml`, `overlay-engine.cjs` (lock, layout-link, json-entry, apply, relayout, status, audit, CLI sections), `tests/overlay-engine-follow-up.test.cjs`, and `git diff c57b7e4cef..e97ca56e8d` for `overlay-engine.cjs`.

## Dimension

**Correctness** — whether the four paths the operator focus names first do what their own contract says when they go wrong: lock takeover, layout-link retarget, removal of a dropped `json-entry` item, and the `apply --relayout` moves and backups. Operator review focus addressed by reading each of the four paths end to end, then checking each against the promise the command documents make about it.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:118-160` (path helpers), `:461-548` (state load/write), `:798-838` (record identity), `:888-950` (item listing), `:1043-1160` (dropped-item removal), `:1329-1380` (json overlay plan), `:1626-1754` (layout links), `:2052-2180` (classification/analysis), `:2234-2345` (lock), `:2399-2612` (status/apply), `:4501-4760` (relayout), `:4770-4895` (CLI/entry)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:107-232` (lock and link cases), `:287-340` (item cases), `:532-720` (relayout cases), `:787` (audit)
- `.skilled/commands/doctor/overlay.md:35-70,106-118`
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:34-122`
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:86-118,266-284,518-546`
- `.skilled/commands/doctor/_routes.yaml:631-668`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:57,89-99,103-120`
- `git diff c57b7e4cef..e97ca56e8d -- .skilled/commands/doctor/scripts/overlay-engine.cjs` (the `acquireLock` hunk in particular)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Legacy lock is never taken over** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2236` -- `isLockOwnerGone` requires both a `pid=` and a `host=` token, but the owner line this engine wrote *before* this commit carried only `pid=`; a lock left by a killed run of the previous release therefore returns `false` and blocks every later run, which is the defect REQ-002 exists to remove.
   Finding class: producer-branch gap (one producer of the lock line, two formats in the wild)
   Scope proof: `acquireLock` is the only writer of `.build-lock` (`:2255`) and `isLockOwnerGone` is its only reader (`:2234`); `git show c57b7e4cef:.skilled/commands/doctor/scripts/overlay-engine.cjs` line 1981 shows the old line format `${owner} pid=${pid} ${ISO}` with no host token.
   Affected surface hints: `.build-lock` in every vendoring project that ran the previous engine version, the `apply`/`capture`/`adopt`/`relayout` entry paths that call `withLock`, the refusal text at `:2321-2323`, `references/overlays.md:99`, and the lock tests at `overlay-engine-follow-up.test.cjs:107-148`.
   Case: a project ran `node overlay-engine.cjs apply` on the previous release and the process was killed, leaving `.skilled-overlays/.build-lock` holding `overlay-engine apply pid=4711 2026-11-10T09:12:44.001Z`. After upgrading, `apply` prints `refuse: the overlay lock is held: overlay-engine apply pid=4711 2026-11-10T09:12:44.001Z` and exits 2 for a pid that no longer exists; the operator still deletes the file by hand, so the upgrade does not deliver the fix REQ-002 promises.
   ```json
   {"type":"claim_adjudication","claim":"A lock written by the previous engine release is refused forever, because the takeover gate requires a host token that format never wrote.","evidenceRefs":["overlay-engine.cjs:2236","overlay-engine.cjs:2235","overlay-engine.cjs:2255","c57b7e4cef:.skilled/commands/doctor/scripts/overlay-engine.cjs:1981","references/overlays.md:99","overlay-engine-follow-up.test.cjs:136"],"counterevidenceSought":"Looked for a migration that rewrites or ignores a host-less lock: the takeover retry at :2262-2280 re-reads the same file, and no other code path writes or normalizes the lock line. Searched the tests: 136 covers a lock with no pid, 148 a lock from another host, none a lock with a pid and no host.","alternativeExplanation":"Refusing an unverifiable owner could be deliberate: a lock with no host cannot be proven local, so failing closed is the safe choice. It is still a gap against the documented promise (references/overlays.md:99 names only a live owner, another host, and a missing pid as refusals) and against the stated purpose of the takes-over branch, and the cost of closing it is one condition.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Downgrade to P2 if a release note or the upgrade path documents that a pre-upgrade .build-lock must be deleted by hand once, which makes the gap a documented migration step rather than a silent one."}
   ```

2. **`apply --relayout` leaves a live layout link dangling and the documented follow-up apply cannot retarget it** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4740-4742` -- relayout rewrites a layout link's `target` in the manifest but never touches the live link, and the follow-up `apply` retargets only a link whose current target the state already records (`:1662-1664`, `:1701`); with a state file that has no link records — which `loadState` treats as "every link on disk is someone else's" (`:486-489`) — the link is reported as a stranger and the apply refuses.
   Finding class: cross-command state gap (relayout produces state the retarget gate rejects)
   Scope proof: `relayoutUnderLock:4740` states the live link is left alone and `:4742` passes `relayoutLinkTargets` output only into `rewriteRelayoutManifest`, which writes `ctx.manifestPath`; no relayout path calls `ensureSymlink` or `writeStateIfChanged`. The retarget gate is `isRecordedLink:1662` alone; `applyLayoutLink` refuses a non-link (`:1734-1736`) and `planLayoutLinks:1703` reports any unrecorded differing link as a problem, which `applyUnderLock:2509-2516` turns into exit 1.
   Affected surface hints: `sync-state.json` written by any engine before this release, hand-made layout links, `overlay.md:108`, `references/overlays.md:91`, `apply.yaml:104`, `_routes.yaml:664`, `presentation.txt:113` (which promises the tree is not broken), and `relayoutLinkTargets:4633` with no test (every relayout fixture sets `layoutLinks: []`, `overlay-engine-follow-up.test.cjs:549`).
   Case: a project vendors a copy at `skilled-overlays/.skilled/skills/hub/x.md`, has a layout link `skills/hub -> ../skilled-overlays/.skilled/skills/hub`, and its `sync-state.json` predates the link records. `apply --relayout` moves the copy to `skilled-overlays/skills/hub` and rewrites the manifest's link target, leaving the live link pointing at a path that no longer exists. The follow-up `apply` then prints `BLOCKED layout: skills/hub exists but is not the link to ../skilled-overlays/skills/hub` and exits 1: the routing is broken by the tool's own action, no engine command repairs it, and the documented outcome ("The apply that follows retargets the live links") is unreachable.
   ```json
   {"type":"claim_adjudication","claim":"Relayout can leave a dangling layout link that the follow-up apply refuses to retarget, because the retarget gate depends on a state record relayout never writes.","evidenceRefs":["overlay-engine.cjs:4740","overlay-engine.cjs:4742","overlay-engine.cjs:1662","overlay-engine.cjs:1701","overlay-engine.cjs:1703","overlay-engine.cjs:488","overlay-engine.cjs:4633","overlay.md:108","references/overlays.md:91","overlay-engine-follow-up.test.cjs:549"],"counterevidenceSought":"Checked whether relayout records the link or the state: it writes only the manifest. Checked whether the retarget could happen without a record: `planLayoutLinks` needs `current === link.target` or a record, and after a move `current` is the old target. Checked the tests: relayout fixtures carry `layoutLinks: []`, so `relayoutLinkTargets` and the link branch of `rewriteRelayoutManifest` are untested.","alternativeExplanation":"The gate is required by REQ-003 (any other existing path stays a problem), so the apply side is behaving as specified; the defect is that relayout creates the unrecorded-plus-moved combination the gate cannot pass. A user could delete the link by hand, which is why this is not P0.","finalSeverity":"P1","confidence":0.82,"downgradeTrigger":"Downgrade to P2 if relayout is shown to run only on trees whose links were all engine-recorded by a prior apply of this release, which removes the unrecorded-state case from reach."}
   ```

### P2 Findings

None this iteration.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | fail | REQ-002 is only partly met: `:2234-2246` takes over a dead pid, but not for a lock line in the format the previous release wrote (finding 1). REQ-003 holds for the apply path. REQ-004 holds: `reportListed` records only items the engine wrote or already recorded (`:888-896`), an upstream item is never recorded (`overlay-engine-follow-up.test.cjs:328`), and a hand-edited dropped item is refused (`:300`). REQ-011 is partly met: the moves, the backup and the field rewrite are there, but the layout-link retarget the requirement and both documents promise is delegated to an apply that cannot perform it (finding 2). |
| `checklist_evidence` | core | partial | `tasks.md` T005, T006 and T013 are marked `[x]`; T005's verify ("tests for a dead pid, a live pid, no pid and a malformed lock pass") is satisfied by `overlay-engine-follow-up.test.cjs:107-148` for the four named cases and says nothing about a legacy line, which is the gap in finding 1. T013's verify names five moves and a present-target refusal, and the tests at `:602-705` cover exactly those; no verify line names a link retarget, matching the untested path in finding 2. |

## Integration Evidence

- `.skilled/commands/doctor/overlay.md:108` (route step 11) promises the follow-up apply retargets the live links — checked against `relayoutUnderLock` and `planLayoutLinks`.
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:104` tells the workflow to run `apply --relayout` and then `apply` "because a move leaves each live link naming the old target until an apply retargets it" — same promise, same gap.
- `.skilled/commands/doctor/_routes.yaml:664` (apply route `description`) repeats it: "then names the apply that retargets the live link".
- `.skilled/skills/system-skilled-doctor/references/overlays.md:91` and `:99` are the reference doc's own statements of both promises.
- No runtime mirror was read or needed for this dimension.

## Edge Cases

- **Ambiguity (lock, resolved conservatively):** the host token could be absent because the lock names another host or because the format predates it. The engine cannot tell them apart, so it refuses both; recorded here as the ambiguity behind finding 1, with the safest in-scope reading (a refusal is safe, only costly).
- **Contradiction (relayout):** `overlay-engine.cjs:4740` says the live link is deliberately left alone, while `overlay.md:108`, `apply.yaml:104`, `_routes.yaml:664` and `references/overlays.md:91` say the follow-up apply retargets it. Both sides cite the same steps; the contradiction is adjudicated in finding 2 rather than resolved silently.
- **Missing dependency:** `route-validate.sh` and `node --test` cannot run from this lineage (writes outside the review packet are forbidden), so every claim above rests on direct reads of the code, its tests and the git history. Test *execution* is therefore unverified for this iteration; test *existence and content* is verified.
- **Partial success:** the item-removal path (REQ-004) and the layout-link retarget on the plain apply path (REQ-003) were read end to end and are clean; only the relayout combination is defective.

## Confirmed-Clean Surfaces

- **Lock takeover for a current-format lock** (`:2234-2296`): only `ESRCH` for a pid on this host returns true; `EPERM`, a live pid, a missing pid, a missing host and a malformed line all refuse. The race between `unlinkSync` and the retry `openSync` is handled by re-reading the file and reporting the winner's owner line. `lock.release` removes only a lock whose bytes still equal this run's owner line (`:2288-2292`). NFR-S02 holds: the only signal ever sent is 0.
- **Dropped-item removal** (`:1043-1160`): an item is removed only when the array is still an array at the recorded path, the entry's identity still matches, and the live value deep-equals the value the engine wrote; every other case either skips (already gone) or throws into a plan problem that blocks the apply. `removalEdit` keeps the document parseable in all three positions, and `applyJsonOperations` re-parses the output before it can be written (`:1160-1162`).
- **Recorded-item provenance** (`:888-950`): `reportListed` fires for a pending item and for an item the state already recorded, never for an item that was merely already live; `overlay-engine-follow-up.test.cjs:328` proves an upstream item the entry stops listing is left alone.
- **`sync-state.json` compatibility** (`:473-548`): a state file without `links` or `items` loads with empty maps, a malformed or out-of-shape state file throws instead of being repaired silently, and `writeStateIfChanged` omits a key whose map is empty so an overlay-only tree does not churn.
- **`relayout` refusals before the first move** (`:4536-4586`): a present target, a missing source, two copies at one path, two copies one inside the other and a path outside the overlay folder each refuse with nothing written; the backup loop (`:4725-4732`) runs before the first `renameSync`, and it backs up the manifest too.
- **Backup fidelity** (`:4595-4625`): a link is backed up as a link rather than followed, a folder recurses, and `.env`-named files are skipped by name instead of opened (NFR-S01).
- **Uncaught throws** from `analyze`/`planRelayout` reach `main`'s catch (`:4853-4860`), which prints `[overlay-engine] <message>` and returns exit 2 rather than a stack trace.

## Ruled Out

- **Backup read after a move:** dismissed. The whole backup loop completes before the first `renameSync`, so a move can never race its own backup.
- **Midway `relayout` rename leaving no recoverable copy:** dismissed as a finding. The stated mitigation (refuse before the first move, back up each path first, work under the lock) is implemented, and the backup folder is named on stdout before the first move.
- **Dropped-item removal deleting a person's item that shares the recorded identity but not the value:** dismissed. `deepEqual(live, record.item)` gates the delete and the mismatch case throws; the identical-bytes case is genuinely indistinguishable from the engine's own item.
- **`acquireLock` empty-file window:** observed (create with `wx`, then write the owner line) but ruled out as a finding — the window is microseconds, a concurrent reader refuses rather than steals, and the refuse message names the file.
- **`items` key loss on a throwing plan:** dismissed. A throwing plan yields a problem and `both-changed`, which blocks the apply before any state write.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was created, modified or deleted.

## Next Focus

- Dimension: security
- Focus area: `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and its test; `strictWriteRefusal` (`:4033`), `stagedUnownedChanges` (`:4271`), `isProtectedReadPath`/`isCaptureRestricted` (`:1899-1965`), `auditVendoredTree` (`:4405`), and `copyForBackup`/`planRelayout` credential handling
- Reason: the operator focus puts the strict write checks, the commit check, `status --audit` and the OpenCode adapter next; `references/overlays.md:103-106` and `presentation.txt:540` make the token-named read contract explicit, and relayout's backup path reads every file under a moved folder
- Rotation status: correctness → security (first rotation, D1 carried forward as CONDITIONAL for synthesis)
- Blocked/productive carry-forward: productive — direct read of a named function against its documented promise found both P1s; keep that pairing for the strict-write surface
- Required evidence: the exact line that reads a token-named file on a path the manifest does not name, and the exact line of the promise it contradicts
- Recovery note: not applicable

Review verdict: CONDITIONAL
