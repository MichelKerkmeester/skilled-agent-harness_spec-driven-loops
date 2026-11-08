# Iteration 001 — Overlay Engine Correctness and Safety (Q1)

## Focus

Q1: Where is `overlay-engine.cjs` (`status`/`apply`/`capture`/`repin`/`rollback`) incorrect or unsafe against its own docs and tests, for example manifest drift, `protectedPaths` and `repin.exclude` handling, the not-copied list, partial failure and rollback?

Scope of this pass: the re-pin and capture safety surfaces the question names explicitly — `protectedPaths`, `repin.exclude`, the not-copied list, and partial-failure/rollback. `status`/`apply`/`capture` classification depth and manifest-drift detection were not exhaustively exercised and are carried forward.

## Actions Taken

1. Ran the Gate 1 trigger lookup; it surfaced `specs/system-skilled-doctor/001-skill-and-overlay-build/002-overlay-engine/spec.md` as prior context, so prior packets were treated as already-decided background rather than new findings.
2. Mapped the engine's function layout and grepped the exact terms Q1 names (`protectedPaths`, `repin.exclude`, not-copied, rollback, partial).
3. Read four targeted regions: protected-path validation and planning (1580–1759), re-pin settings/drift/touched-path computation (2480–2759), not-copied reporting and `repinWrites` (2930–3149), plus `resolveOverlayDir`, `isEnvName`/`isTokenName`, and rollback (3242–3345).
4. Read the re-pin/rollback backup implementation (`writeBackup`, `writePin`) to test the hypothesis that `--rollback` leaves the pin advanced.
5. Cross-read the authoritative docs (`references/overlays.md`, `commands/doctor/overlay.md`) and the re-pin/sync/fixes test titles to check code-versus-doc and code-versus-test coverage.

## Findings

### f-iter001-001 (P1) — `.env`-prefix heuristic permanently blocks legitimate template files

`isEnvName` treats any basename starting with `.env` as a secret: `path.basename(filePath).toLowerCase().startsWith('.env')` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1566]. That catches `.env.example` and `.envrc`, neither of which is a dotenv secret; `.env.example` is a committed template and `.envrc` is direnv's shell config.

There is no escape hatch. `protectedPathsFor` refuses a `.env` name outright, so the entry cannot whitelist it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1618]. `exactManifestPaths` only collects source/base/fragment/destination/paths/protectedPaths, so a directory entry cannot name the file exactly either [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1580]. The walk then refuses the whole entry [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1729], and the printed remedy is "a .env file is never read, so move it out of the overlay" [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1679] — impossible when the file belongs to the upstream folder being overlaid.

Impact: any external repository that overlays a directory containing `.env.example` (very common in Node/Python repos) cannot `apply` that entry at all, and the message offers no workable next step. The docs describe the rule but not this false-positive class [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:105].

### f-iter001-002 (P2) — A re-pin refuses when an upstream-deleted file is already missing locally

The delete set requires the path to exist in the old pin and be absent from the new one [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2599]. `unownedDrift` then compares every touched delete path with the old blob, and `blobDifference` reports an absent file as `missing from the tree` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2656]. That becomes a refusal line [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2685], and the run stops with the generic remedy "move each edit into an overlay, list the path in repin.exclude, or restore it from <oldPin>" [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3084].

None of those three remedies is right when the desired end state is that the file is gone. The user must restore a file from the old pin purely so the re-pin can delete it again. This is a correctness gap in the drift check, not a deliberate guard: the guard exists to stop silent reversion of local edits, and an already-absent path has no edit to protect.

Impact: blocks an otherwise clean upgrade, with misleading remediation. A repo that deleted a file upstream also deleted (or never had it, e.g. a sparse checkout) hits this.

### f-iter001-003 (P2) — The not-copied list silently drops upstream additions at top-level paths the tree does not hold

The docs promise: "What a re-pin leaves out, it lists" [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:127]. The implementation gates the report on `holdsRealTopLevel`, which returns `false` when the top-level component does not exist in the destination tree [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2953]. The filter then only keeps paths under `exclude` or outside the copied roots whose top-level entry is real [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2961].

The asymmetry: an upstream *edit* or *deletion* under an existing top-level file/folder is reported, but an upstream *addition* of a brand-new top-level file is invisible — it is neither copied nor listed. For the external-repo audience this is the exact class of change they need to see (new or renamed root docs such as `INSTALL-SKILLED.md`, a new AGENTS template, a new top-level config).

Impact: silent loss of upstream guidance on upgrade. The run reports a clean result while a root-level file the project should adopt never appears.

### f-iter001-004 (P2) — Not-copied findings are ephemeral; `status` never re-surfaces them

`notCopiedChanges` diffs only `oldCommit..newCommit` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2961], and the result is printed and written only into that run's `report.json` at the end of the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3089], [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3121]. Nothing persists the excluded paths' upstream state into the sync state or the manifest.

Consequence: a change excluded at pin N→N+1 and untouched at N+1→N+2 is shown once, in a terminal, at upgrade time, and never again. `status` cannot tell a deliberately kept path from a stale one, so a repo that missed the one-time line has no later way to discover the drift. `repin.exclude` therefore trades a hard failure for a permanent, silent divergence — with no durable record beyond a run folder the CLI cannot list.

Impact: medium for external repos that rely on `repin.exclude` to keep project-owned folders; drift accumulates invisibly across pins.

### f-iter001-005 (P2) — An interrupted re-pin leaves no durable run status and no discoverable rollback pointer

The run folder is created before the backup [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3097], but `report.json` is written only after the run finishes [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3121]. The rollback line is printed only from the in-process catch/failure path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3118]. If the process is killed (Ctrl-C, OOM, CI timeout) during the delete/copy/apply window, the tree is half-migrated, the pin may or may not have moved, and nothing durable says a run is in flight or which run id to roll back.

There is also no command to enumerate runs: the usage surface exposes only `repin --rollback <run-id>` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:85], and `REPIN_VALUE_FLAGS` has no list/inspect option [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:78]. Recovery depends on the operator having kept the printed line or hand-listing `<overlayDir>/repin-runs/`.

Impact: an interrupted upgrade is the highest-anxiety state for a vendored tree, and the engine's recovery story depends on scrollback.

### f-iter001-006 (P3) — The not-copied summary appends AGENTS.md guidance to unrelated paths

Every not-copied summary ends with "(AGENTS.md sections: /doctor:agents-md)" regardless of what the paths are [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2970]. A `README.md`, `.github/workflows/ci.yml` or `docs/` change is told to consult the AGENTS.md merge route. The parenthetical is useful only for the AGENTS.md case and adds noise to the rest.

## Verified Strengths (hypotheses tested and refuted)

- **Rollback restores the pin.** I hypothesized that `--rollback` restores file bytes but leaves `pin.commit` at the new value. Refuted: `writeBackup` adds `ctx.manifestPath` and `ctx.statePath` to `enginePaths` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2820], so the manifest carrying `pin.commit` is backed up before `writePin` runs [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3008] and restored by `rollbackUnderLock` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3242]. The repin rollback test asserts the byte-for-byte outcome [SOURCE: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:319].
- **Backup and copy share one list.** `touchedPaths` is computed once and drives both the backup groups and the writes, matching the three reversibility rules stated in the engine's own header comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2484].
- **Rollback is fail-closed.** Any backup entry whose sha256 does not match aborts the rollback before restoring anything [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3266].

## Questions Answered

- Q1 (partial, marked answered for run progression): the named surfaces — `protectedPaths`, `repin.exclude`, not-copied list, partial failure and rollback — each yielded at least one concrete, code-cited gap (f-001 through f-005). Residual: `status`/`apply`/`capture` classification depth and manifest-drift detection were not exhaustively tested; carried forward.

## Questions Remaining

- Carried forward: Are `status`/`apply`/`capture` classifications correct for every `skill-root` and `json-entry` shape, and does the engine detect a manifest `pin.commit` that disagrees with the bytes actually in the tree?
- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step?
- Q3: What onboarding friction does a brand-new external repository hit from `INSTALL-SKILLED.md` through `/doctor:install`, `/doctor:symlink` and `/doctor:setup`?
- Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact?

## Next Focus

Q2 — command messages, prompts and outputs, with f-iter001-001, f-iter001-002 and f-iter001-005 as concrete message-level evidence to carry into that pass. If the reducer keeps Q1 open instead, the residual to close is classification depth plus manifest-drift detection.
