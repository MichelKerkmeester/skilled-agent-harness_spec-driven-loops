# Iteration 4 — Re-pin, guard and rollback safety

## Focus

Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?

Pin drift (`pin.commit` versus the bytes in the tree) was covered in iteration 3. This iteration examined the guard hook and the recovery path an operator actually reaches after a failed re-pin.

## Actions Taken

1. Read the re-pin and rollback implementation: the backup path set, the stage branch, the pin write, and the restore loop in `.skilled/commands/doctor/scripts/overlay-engine.cjs`.
2. Read the guard core `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` and `.skilled/hooks/overlay-guard/README.md` for the failure policy, timeout and runtime coverage.
3. Read the `/doctor:overlay` router `.skilled/commands/doctor/overlay.md` for the operator-visible plan and rollback wording.
4. Compared what the backup covers with what a re-pin writes, and what rollback reads with what the current tree holds.

## Findings

### f-iter004-001 (P1) — Rollback restores bytes without comparing them to the current tree

`rollbackUnderLock` checks every backup copy against its recorded sha256 before writing, then removes and rewrites every backed-up path. It never hashes the current destination first, so a manual repair made after a failed re-pin — exactly when the rollback line is printed — is silently overwritten. The plan the operator approves is "what that run's folder holds", not a diff against the live tree. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3242] [SOURCE: .skilled/commands/doctor/overlay.md:102]

Recommendation: hash the current destination for each backed-up path and show a per-path diff before restoring; refuse on unexpected content unless `--force` is passed; offer a `--dry-run` plan.

### f-iter004-002 (P1) — The guard stops protecting exactly when the tree is damaged

The core fails open on every judgement error. A spawn error or timeout (`ENGINE_TIMEOUT_MS = 3_000`, per path), a failed `require` of the engine, or an unreadable setting all produce `allow`, with only a stderr note. A partial upgrade that removes or breaks `overlay-engine.cjs` leaves `.skilled-overlays.json` in place: `couldHaveOverlays` passes, `hasManifest` throws, and every write is allowed. A mixed patch also allows its unjudged paths when no path was refused. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:41] [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:90] [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:120] [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:133] [SOURCE: .skilled/hooks/overlay-guard/README.md:125]

Recommendation: when the tree carries an overlay setting or folder, a failed judge should deny with an explicit "guard unavailable: the engine could not judge this write" message, or require an acknowledgement; batch every path of one tool call into a single engine invocation so one slow path cannot silently allow the rest.

### f-iter004-003 (P2) — A green stage is not a rehearsal of the live run

For a stage run, `repinWrites` replaces the manifest with one whose `regenerate` and `verifyGenerated` lists are empty and prints a note, but the router still presents the stage report as the plan. A stage can pass and the live run can fail after the backup, in the generators the stage never ran. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3013] [SOURCE: .skilled/commands/doctor/overlay.md:98]

Recommendation: run the regenerate and verify steps on the stage copy when it is a full tree, or label the plan "copy and overlays only; generators not rehearsed" and name the failure the operator should expect.

### f-iter004-004 (P2) — The guard is a tool-call guard, not a write boundary, and it spawns the engine once per path

Shell writes are not parsed, so an edit made through `Bash`, `exec` or `Shell` reaches an overlay-owned file unguarded and is lost at the next re-pin. A multi-path `apply_patch` costs one engine spawn per path at up to 3 seconds each, and a path that times out is allowed while its siblings are judged. [SOURCE: .skilled/hooks/overlay-guard/README.md:62] [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:126]

Recommendation: accept every path of a call in one `--guard` invocation and cache manifest ownership for the call; document the shell bypass in the overlay and onboarding docs; make an unjudged path visible in the refusal path rather than a stderr note.

### f-iter004-005 (P3) — Successful re-pin runs are never pruned, and no command lists them

The backup is written before every live run, success included, and the run folder stays under `.skilled/repin-runs/`. Only the failure path prints the run id. A user who lost the id has to browse the folder; `status` and `repin` never list runs, and nothing prunes old backups. This extends the iteration-1 interrupted-run finding (discoverability) with lifecycle: growth and no listing or prune command. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3105] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3118] [SOURCE: .skilled/commands/doctor/overlay.md:101]

Recommendation: add `repin --list-runs` and `--prune`, show the newest run and any unfinished run in `status`, and keep a bounded number of successful runs.

### f-iter004-006 (P3) — Runtime coverage is documented only in the hook README, and `/doctor:overlay` never mentions the guard

OpenCode has no adapter, so a repository using it gets no guard. The overlay command's asset table names the engine but not the hook, so a user reading `/doctor:overlay` never learns the guard exists, which runtimes it covers, or how to disable it. [SOURCE: .skilled/hooks/overlay-guard/README.md:66] [SOURCE: .skilled/commands/doctor/overlay.md:26]

Recommendation: cross-link the guard from `overlay.md`, list the runtime coverage and the two kill switches (`SYSTEM_OVERLAY_GUARD_DISABLED`, `SYSTEM_HOOKS_DISABLED`), and state the shell bypass beside the coverage table.

## Questions Answered

- **Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?** The backup design is strong: one touched set drives both the backup and the copy; the manifest, state, layout links and regenerate outputs are included; every backup byte is verified before and after a restore; modes and links are restored. The weak points are recovery safety, not backup coverage: rollback overwrites the current tree without a diff, the guard fails open when the engine cannot judge, a stage plan skips the generators, the guard is bypassed by shell writes and pays one engine spawn per path, and run folders have no listing or prune surface. Ranked by user impact: f-iter004-001, f-iter004-002, f-iter004-003, f-iter004-004, f-iter004-005, f-iter004-006.

Scope note: the `/doctor:update` path (`release-update.cjs`) was not examined; "upgrading" here means moving the vendored tree to a new upstream commit with `repin`.

## Questions Remaining

- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? (partially touched; not answered as a whole)
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact?
- Residual from iteration 3: `pinnedSha256` scope validation for multi-output entries; whether `apply` repairs layout links; `capture` bodies for `json-entry` and `skill-root`.
- Residual from this iteration: the `release-update.cjs` upgrade path; whether each adapter passes a `sessionDir` that makes relative write paths resolve against the tree root rather than the hook process's cwd; whether the guard's per-path spawn is measurably slow on the largest overlay manifests.

## Next Focus

Iteration 5: Q2 and Q5. Check the operator-visible wording and the doc-versus-code claims for the guard, rollback and stage paths found here, and close the two remaining key questions.
