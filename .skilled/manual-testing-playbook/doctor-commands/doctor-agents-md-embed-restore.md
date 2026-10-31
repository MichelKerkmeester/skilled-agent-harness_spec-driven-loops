---
title: "DOC-405 -- Doctor agents md embed and restore"
description: "Manual scenario validating that /doctor:agents-md embed shows a plan and a digest on a scratch copy, writes only against that digest after one yes, carries the repository's own lines into the block, and that the undo the apply printed puts the copy back byte-identical."
version: 1.0.0.0
id: doctor-commands-doctor-agents-md-embed-restore
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-405 -- Doctor agents md embed and restore

## 1. OVERVIEW

This scenario validates the two writing targets of `/doctor:agents-md` in one round trip, on a composed fixture under a temporary folder. `embed --dry-run` shows the plan, the diff, the block, the budget, the survival ledger, the backup folder and the plan digest, and stops without asking and without writing. `embed` shows the same plan and the same digest, asks once, and writes only after that yes and only against the digest the operator read. The undo the apply prints is the engine's own `restore` call, and running it puts the copy back as it was.

The fixture is the `adopted` case: a repository block with content, a divergent `CLAUDE.md` whose lines have to survive, and no router. That gives the plan four targets, gives the apply one removal and one carried-lines section, and gives the restore four paths to put back. Nothing runs against the repository: the fixture is composed into the scratch folder, the run writes there, the backup lands outside the repository because the copy is not a git repository, and the restore is compared against a pristine copy taken before the first write.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the dry run prints the plan and the digest and writes nothing, that the embed writes only against that digest after one yes while keeping every repository line, and that the printed undo puts the copy back byte-identical.
- Playbook ID: DOC-405.
- Real user request: `Bring this repository's AGENTS.md up to the shipped template, then put it back the way it was.`
- Prompt: `Bring this repository's AGENTS.md up to the shipped template, then put it back the way it was.`
- Preconditions: The Skilled checkout with `.skilled/commands/doctor/agents-md.md`, `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`, its presentation contract, `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` and `.skilled/commands/doctor/assets/agents-md-manifest.json` in place, and a runtime that can execute `/doctor:agents-md` with Bash access. Node and git available. A scratch folder under a temporary directory, and write access to the operating system's temporary directory for the backup. No network access needed; a missing binary is a valid reason to record `SKIP`.
- Expected execution process: Compose the `adopted` fixture into the scratch folder and copy it to a pristine sibling. Run the route's dry run with `--root` and capture the plan, the digest, the dry-run lines and whether any question appeared. Run the engine's own plan on the same folder and compare the two digests. Run the route's embed with `--root`, read the digest, answer yes, and capture the apply's lines and its undo block. Inspect the folder: `CLAUDE.md` gone, its lines inside the block, the mirror rewritten. Run the undo with `--dry-run` and confirm nothing was removed. Run the undo for real and capture its lines. Compare the folder with the pristine copy.
- Expected signals: The plan opens `[agents-md-embed] plan for <root> (state: adopted)` and carries four target lines — `target AGENTS.md: replace`, `target REPO RULES.md: absent`, `target .cursor/rules/repo-local.md: replace`, `target CLAUDE.md: remove` — one `note:` line about the missing router, a `diff` per written path, the block between `block:` and `block-end:`, the `budget:` line, `preservation: kept <n>, carried <n>, shipped-replaced <n>, dropped 0`, a `backup:` folder outside the repository beside a `backup-fallback:` line saying why, the `undo:` command, and a `plan-digest:` line of 64 lowercase hex characters. The dry run adds the engine's own `dry-run: nothing was written` and the route's `Dry run: nothing was written and nothing was asked.`, `Changed: none` and `STATUS=OK`, and no question appears. The engine's own plan prints the same digest. The embed repeats that digest above its question, asks `Embed these files now? [yes/no]` once, and after the yes prints `wrote AGENTS.md`, `wrote .cursor/rules/repo-local.md`, `removed CLAUDE.md (backed up first)`, a `pointer-sync:` line, `preservation:` with `dropped 0`, `check-after:`, the same `backup:` and `undo:` lines, one `cp` line per overwritten file and `STATUS=OK`. The undo's dry run prints one `restore <path>: put back` line per recorded path and `dry-run: nothing was written`, and removes nothing. The real undo prints the same plan, then `restore: <n> path(s) put back, the backup at <dir> is kept` and `STATUS=OK`. `diff -r` between the pristine copy and the target exits 0.
- Desired user-visible outcome: A plan and one digest the operator can read, one yes that authorises exactly those bytes, a folder brought up to the template with its own lines still in it, and an undo that leaves the folder as it was found.
- Pass/fail: PASS if the dry run prints the plan and a 64-hex digest, asks nothing and writes nothing, the embed repeats that digest, asks once, writes the plan's paths, keeps every repository line with `dropped 0`, names its backup outside the repository and ends `STATUS=OK`, the undo's dry run writes nothing, the real undo restores the recorded paths and keeps the backup, and the pristine comparison exits 0. FAIL if the dry run writes, the digest differs between the plan and the apply, the embed writes against a digest the operator did not see, a repository line is missing from the block, the restore leaves a path behind, or the copy does not return byte-identical.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Bring this repository's AGENTS.md up to the shipped template, then put it back the way it was.
```

### Commands

1. Confirm the checkout assets exist: `.skilled/commands/doctor/agents-md.md`, `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`, `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`, `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` and `.skilled/commands/doctor/assets/agents-md-manifest.json`. A missing path ends the run before it starts.

2. Compose the fixture and keep a pristine copy:
   ```bash
   SCRATCH="$(mktemp -d)/embed-restore"
   node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs adopted "$SCRATCH/embed-target"
   cp -R "$SCRATCH/embed-target" "$SCRATCH/embed-target-pristine"
   ls -A "$SCRATCH/embed-target"
   ```
   The composer refuses a folder that already holds anything, so the target path must be absent before this step.

3. Run `/doctor:agents-md embed --root "$SCRATCH/embed-target" --dry-run` through the real runtime. Capture the setup panel, the plan, the `backup-fallback:` line, the `undo:` line, the full `plan-digest:` line, the engine's dry-run line and the route's dry-run result. Confirm no question appeared, then confirm the folder is unchanged:
   ```bash
   diff -r "$SCRATCH/embed-target-pristine" "$SCRATCH/embed-target"
   ```

4. Run the engine's own plan on the same folder and compare the digest with step 3:
   ```bash
   node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan --root "$SCRATCH/embed-target" | sed -n 's/^plan-digest: //p'
   ```
   The two digests must be identical, because nothing on disk changed between them.

5. Run `/doctor:agents-md embed --root "$SCRATCH/embed-target"`. Read the plan and the `plan-digest:` line, confirm it equals step 3's digest, then answer `yes`. Capture every line the apply printed and the whole undo block.

6. Inspect what the apply wrote:
   ```bash
   ls -A "$SCRATCH/embed-target"
   tail -n 12 "$SCRATCH/embed-target/AGENTS.md"
   head -12 "$SCRATCH/embed-target/.cursor/rules/repo-local.md"
   test -f "$SCRATCH/embed-target/CLAUDE.md" || echo "CLAUDE.md removed"
   ```

7. Run the undo the apply printed with `--dry-run` first:
   ```bash
   node .skilled/commands/doctor/scripts/agents-md-embed.cjs restore --run=<the backup the apply printed> --root "$SCRATCH/embed-target" --dry-run
   diff -r "$SCRATCH/embed-target-pristine" "$SCRATCH/embed-target"
   ```
   The plan must name a path per recorded file and the `diff` must still show the embed's changes, because a dry run removes nothing.

8. Run the same undo for real, and then compare:
   ```bash
   node .skilled/commands/doctor/scripts/agents-md-embed.cjs restore --run=<the backup the apply printed> --root "$SCRATCH/embed-target" --yes
   diff -r "$SCRATCH/embed-target-pristine" "$SCRATCH/embed-target"
   echo "diff-exit=$?"
   ```
   The comparison must exit 0, and the backup directory must still hold its `manifest.json`.

### Expected

The dry run is the plan the operator approves, minus the write. The engine composes every target in memory and prints what it would do: `AGENTS.md` replaced with the shipped sections plus the composed block, the missing router left absent with a note explaining that a repository rule cannot load without it, the Cursor mirror of the block replaced, and the divergent `CLAUDE.md` removed after its lines are carried into the block. The ledger line ends `dropped 0`, which is the claim the whole route rests on: every line the repository wrote is still somewhere. The digest is printed in full, and the dry run then prints its own line and `STATUS=OK` without asking anything at all, so the digest the operator has just read is the one the next run repeats above its question.

The embed repeats that digest before its single question. The yes authorises the plan on screen and nothing else, and the apply recomposes before it writes, so a tree that moved between the two calls is refused instead of written. After the yes the apply names each path it wrote and each path it removed, runs the pointer generator, proves the composition against the bytes now on disk, re-reads the folder through the check engine, and closes on `STATUS=OK` with the backup, the undo command and one `cp` line per overwritten file. The block now carries the `CLAUDE.md` lines under their own carried section, so the file could be removed without losing them.

The backup sits outside the repository, and the `backup-fallback:` line says why: the composed fixture is not a git repository, so nothing can answer whether the backup path is ignored, and a backup inside a published path is a backup the next commit publishes. That folder is the only place the restore reads.

The undo is the engine's own restore call, exactly as the apply printed it, which is why the run passes the record's own root. Its dry run names one path to put back per recorded file and writes nothing. The real run writes each recorded file back from its copy, measures it against its recorded hash, prints the count and `STATUS=OK`, and keeps the backup, so the way back from the way back still exists. The pristine comparison then exits 0, because every path the embed touched has its recorded bytes again.

### Evidence

- The fixture listing and the pristine copy path from step 2.
- The dry-run plan with its target lines, `preservation:` line, `backup:`, `backup-fallback:`, `undo:` and full `plan-digest:` line, plus the route's dry-run lines.
- The `diff -r` from step 3 that shows nothing was written, and the engine plan's digest from step 4.
- The embed output: the repeated digest, every `wrote` and `removed` line, the `pointer-sync:` line, `preservation:` and `check-after:`, the `backup:` and `undo:` lines, every `cp` line and `STATUS=OK`.
- The folder listing, the tail of `AGENTS.md` and the head of `.cursor/rules/repo-local.md` from step 6.
- The undo's dry-run plan and the `diff -r` that follows it.
- The real undo's output and the final `diff -r` exit 0, plus the kept `manifest.json`.

### Pass / Fail

- **Pass**: The dry run prints the plan and a 64-hex digest, asks nothing and writes nothing; the embed repeats that digest, asks once, writes exactly the plan's paths, keeps every repository line with `dropped 0`, names a backup outside the repository, and ends `STATUS=OK`; the undo's dry run writes nothing; the real undo restores the recorded paths and keeps the backup; and the pristine comparison exits 0.
- **Fail**: The dry run writes, the plan and the apply print different digests, the embed writes against a digest the operator never saw, a line the repository wrote is missing from the block, the restore leaves a path or an empty folder behind, the backup is missing, or the copy does not return byte-identical.

### Failure Triage

If the apply reports that the plan digest does not match the composition now, the tree changed between the plan and the apply, nothing was written, and the plan has to be run again against the tree in front of the operator. If it reports that the digest names a backup an earlier run already holds, the plan was replayed, and a fresh plan gets a directory of its own. If the plan prints `NOTHING TO DO`, the folder already matches the template, so compose a fresh fixture rather than reading that as a pass. If the composer refuses the folder, it already holds something. If the line reads `pointer-sync: exit 1` with `missing`, the folder has no `.cursor/rules/skill-routing.md`, and the generator rewrites an existing file but never creates a missing one: the presentation's `A10` row names the file to create before that mirror can be written. If the undo reports that the record names another root, the `--root` it needs is the root the record names, in the spaced form. If the router refuses `--root` for the restore target, that is the route's own limitation rather than a scenario error: the restore target accepts `--run`, `--yes` and `--dry-run` only, while the record of a scratch folder names a root that is not this repository, so the undo command the apply prints is the form that reaches it and the router gap is the finding to report. If a restore reports a hash that does not match, nothing was written and the backup is kept, and the copy or the record changed since the run.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/agents-md.md](../../commands/doctor/agents-md.md)
- Matching YAML assets: [doctor-agents-md-embed.yaml](../../commands/doctor/assets/doctor-agents-md-embed.yaml) and [doctor-agents-md-restore.yaml](../../commands/doctor/assets/doctor-agents-md-restore.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt](../../commands/doctor/assets/doctor-agents-md-presentation.txt)
- Embed and restore engine: [.skilled/commands/doctor/scripts/agents-md-embed.cjs](../../commands/doctor/scripts/agents-md-embed.cjs)
- Check engine: [.skilled/commands/doctor/scripts/agents-md-check.cjs](../../commands/doctor/scripts/agents-md-check.cjs)
- Template manifest: [.skilled/commands/doctor/assets/agents-md-manifest.json](../../commands/doctor/assets/agents-md-manifest.json)
- Fixture composer: [.skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs](../../commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:agents-md embed and restore

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-405
- Feature name: Doctor agents md embed and restore
- Command mode: `/doctor:agents-md embed`, `/doctor:agents-md restore`
- YAML asset: `doctor-agents-md-embed.yaml`, `doctor-agents-md-restore.yaml`
- Mutation boundary: the composed fixture copy under a temporary folder only, never the repository. The dry run writes nothing, the embed writes inside that folder after its plan digest, the backup lands in the operating system's temporary directory because the copy is not a git repository, and the undo reads that record and puts the copy back before the scenario ends. The repository is read only.
- Feature file path: `doctor-commands/doctor-agents-md-embed-restore.md`
