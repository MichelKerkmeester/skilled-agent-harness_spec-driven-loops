The three fix rounds share one cause: `json-entry` is the only overlay scope whose target bytes are computed from the live file instead of from a source. The restore code therefore has to guess what the overlay wrote earlier, and each round patched one more guess. I read the code and ran none of it, so CONFIRMED below means read in the code, not reproduced.

Plan mode asked for a plan file. I wrote none, because you said to create no file.

## Top five

**1. Hardening. The json-entry result depends on the live file's history.**
- Problem: `planJsonOverlay` feeds the live text into `applyJsonOperations` (`overlay-engine.cjs:1741`), while a `file` overlay takes its bytes straight from the source (`overlay-engine.cjs:1551`). That is why `sets` and `items` records exist, and why the two known silent cases can exist at all.
- Smallest change: when the pinned copy is readable, also apply the entry set to the pinned text and compare the two results. Report a difference as a status line. A re-pin always has the pinned copy, so this covers the path where all three rounds of bugs sat.
- Follow-on: make that rebuild the write path and keep the record path only as the no-checkout fallback. The cost below covers only the comparison.
- Cost: medium.
- INFERRED. The difference between the scopes is confirmed. That the comparison catches every silent case is my reasoning, and a test with a dropped `setKeyOnItem` would confirm it.

**2. Hardening. A failed apply loses the record of items it added, for good.**
- Problem: apply writes destinations at `overlay-engine.cjs:3138` and records state only at `:3209`. A regenerate failure returns at `:3159` and an unresolved check returns at `:3179`, both before the record. On the next run the item is already live, and an existing item is reported only if it was already recorded (`:974`, and `:948` for scalars). So the item is never recorded, and dropping it later leaves it in the file with no message.
- Smallest change: write `files`, `items` and `sets` right after the destination writes, before regenerate runs.
- Cost: small.
- CONFIRMED.

**3. UX. "Rerun apply" does not rerun a failed generator.**
- Problem: the presentation says to fix the step and rerun apply (`doctor-overlay-presentation.txt:564`). Regenerate runs only when something was written or the caller forces it (`overlay-engine.cjs:3147`). After the failed run every destination is already in sync, so the rerun prints `0 changed`, exits 0 and regenerates nothing. The verify steps are skipped too (`:3213`).
- Smallest change: treat a destination whose live bytes match the overlay but whose recorded hash does not as written, so regenerate runs. If item 2 lands first, store a "regenerate pending" flag in the state instead.
- Cost: small.
- CONFIRMED.

**4. UX. A status can pass because the upstream checkout is missing, and says nothing.**
- Problem: `staleRootFiles` returns an empty list with no checkout (`overlay-engine.cjs:3711`), so no `STALE` line prints and the status can pass. The presentation calls that line the only place this drift shows (`doctor-overlay-presentation.txt:113`). Only `--audit` prints a "skipped" line (`:3084`). Separately, `pin.checkout` is tested as given (`:3600`), so a relative path resolves against the shell's directory and not the tree root. The engine reads no environment variable, so a team cannot set the path per machine.
- Smallest change: print one `NOTE` line when the checkout is unreadable, naming what was not checked. Resolve `pin.checkout` against the tree root.
- Cost: small.
- CONFIRMED.

**5. UX. One malformed entry-set file stops the whole status and does not name the file.**
- Problem: `JSON.parse` of the entry set at `overlay-engine.cjs:1719` sits outside the `try` at `:1740`. The error reaches `main` (`:5585`), which prints the parser message alone and exits 2. Every other overlay goes unreported. A secret-file refusal, by contrast, blocks only its own entry (`overlays.md:123`).
- Smallest change: catch the parse error and push a problem that names `entry.source`.
- Cost: small.
- CONFIRMED.

## Next five

**6. UX. The operator approves a json-entry apply without seeing what it removes.**
- Problem: the plan is the status report (`doctor-overlay-presentation.txt:163`), which shows one `overlay-edited` line per file. The apply behind that line can delete keys (`overlay-engine.cjs:1485`) and remove items (`:1202`).
- Smallest change: have status print one line per pending removal or restore for a json-entry destination. The engine already computes them while planning.
- Cost: medium.
- CONFIRMED that the plan shows no such line.

**7. Hardening. The `added` flag is recorded and never read.**
- Problem: it is written at `overlay-engine.cjs:867` and `:1757`. The restore at `:1475-1485` ignores it and deletes any key the pin lacks, including one a person added before a `set` named it (`overlays.md:62` documents this). The lookup at `:870` also still uses `deepEqual`, so a path spelled `1` and `"1"` loses the flag.
- Smallest change: switch `:870` to `samePath`. Then refuse instead of delete when the flag is false and the pin lacks the key.
- Trade-off: keys written by an older engine carry a false flag, so they would be refused once.
- Cost: small.
- CONFIRMED.

**8. Hardening. The state file's shape grew while its version stayed at 1.**
- Problem: `links`, `items` and `sets` were added under the same `schemaVersion` (`overlay-engine.cjs:79`, `:486`). The reference invites a project to keep its old replay script running on the same folder (`overlays.md:235`). If that script rewrites the state file without the new keys, the loader reads the missing keys as "nothing recorded" (`:499`, `:506`), and every later drop goes silent. Record contents are also unchecked beyond "is an array" (`:501`, `:508`).
- Smallest change: validate each record's `path`, and have status print a note when a manifest holds json-entry sets or items while the state has no such key.
- Cost: small.
- CONFIRMED for the loader. INFERRED for what a legacy script writes.

**9. UX. Nothing warns when an entry set uses a form the engine cannot track.**
- Problem: a `set` path through an array index is accepted without comment, and `setKeyOnItem` and `insertObjectKeys` report nothing to the state (`overlay-engine.cjs:898-923`, `:999-1045`). The author learns of the limit only from one paragraph in the reference.
- Smallest change: a non-failing `NOTE` line in status per such operation, in the style of the `LAYOUT` line.
- Cost: small.
- CONFIRMED.

**10. Hardening. State and manifest writes are not atomic.**
- Problem: `sync-state.json` and the manifest are written in place (`overlay-engine.cjs:562`, `:4050`, `:4780`). A kill mid-write leaves invalid JSON, after which every command exits 2 with "is not valid JSON" (`:484`) and no fix.
- Smallest change: write to a temporary file and rename it. Name the fix in that error.
- Cost: small.
- CONFIRMED for the writes. INFERRED for the torn file.

I held back two lower-ranked items: missing guidance on which overlay-folder files to commit, and the pre-backup re-pin check covering only json-entry files the copy leaves in place.

## Status

- Read only. No file was edited or created, and no test was run.
- The trigger-index lookup ran and exited 0 with one hit, the overlay-engine spec.
- Residual risk: items 2 and 3 rest on my reading of `applyUnderLock`. A test that fails a regenerate step, reruns apply and then drops the added item would settle both.

Your one decision: whether item 1 becomes the next packet's direction or the fourth pass stays on the record-based restore.

FILES READ:
- `.skilled/skills/system-skilled-doctor/references/overlays.md`
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`
- `.skilled/commands/doctor/overlay.md`
- `.skilled/commands/doctor/assets/doctor-overlay-status.yaml`
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml`
- `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs` (lines 463-567, 857-1056, 1185-1534, 1548-1585, 1706-1785, 1978-2035, 2499-2698, 2916-3230, 3559-3602, 3696-3725, 3956-4015, 4169-4538, 5560-5631, plus a function outline and one grep)
- `.skilled/repo-rules/communication.md`
- `.skilled/repo-rules/communication-handoff.md` (lines 1-129)
- `.claude/skills/sk-code/SKILL.md` (loaded by the skill router)
