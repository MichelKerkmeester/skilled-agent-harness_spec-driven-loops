---
title: "DOC-398 -- Doctor symlink"
description: "Manual scenario validating that /doctor:symlink check reports every framework entry in a scratch repo, that link prints a plan and a digest and writes nothing on a dry run, that the digest-carrying link merges a real .claude folder while keeping the repo's own file and adding the ignore lines, and that the printed unlink command returns the scratch repo to its starting state."
version: 1.0.0.0
id: doctor-commands-doctor-symlink
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-398 -- Doctor symlink

## 1. OVERVIEW

This scenario validates the three targets of `/doctor:symlink` against one scratch git repository under a temporary folder. `check` reads a project repo and reports one line per framework entry with that entry's status. `link` prints a plan with every action it would take, the ignore lines it would add and the plan digest, asks once, and writes only after a yes. `unlink` reads the run record that apply wrote and removes exactly the links that record created.

The scratch repository starts with one real file inside a real `.claude` folder and nothing linked. The scenario proves that check reports the entries as missing, that a dry run shows the plan and the digest and writes nothing, that apply builds the links inside the real folder instead of replacing it, that the repo's own file survives untouched, that the ignore lines land in `.git/info/exclude`, and that the printed undo returns the scratch repository to its baseline. Every command runs against the scratch folder, never against a real project, because the engine refuses a root that is the checkout, sits inside it, or holds it.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that check reports the entries of a scratch repo without writing, that a link dry run prints the actions and the digest and writes nothing, that a link with the digest merges the real `.claude` folder while keeping the repo's local file and adding the exclude lines, and that unlink puts the scratch repo back as it was.
- Playbook ID: DOC-398.
- Real user request: `Link Skilled into this project so my runtimes load it, then undo it.`
- Prompt: `Link Skilled into this project so my runtimes load it, then undo it.`
- Preconditions: The Skilled checkout on the current branch with `.skilled/commands/doctor/scripts/symlink-engine.cjs`, `.skilled/commands/doctor/assets/symlink-manifest.json` and the three `doctor-symlink-*.yaml` workflows in place, plus a runtime that can execute `/doctor:symlink` with Bash access. Node and git available. A scratch folder the operator can create and delete under a temporary directory, holding a git work tree and nothing else. No network access needed.
- Expected execution process: Create the scratch git repository with one real file inside a real `.claude` folder and record the baseline. Run check through the runtime and directly through the engine. Run link with `--dry-run` and capture the plan and the digest. Run the same plan directly and compare the digest. Run link without `--dry-run`, read the digest and answer yes. Inspect the folder, the local file and the exclude file. Run check again. Run the undo command the apply printed, first with `--dry-run`, then for real. Compare the scratch repository with the baseline.
- Expected signals: Preflight confirms the engine, the manifest and the three workflows exist, and confirms the scratch path sits outside the Skilled checkout. The first check prints `missing`, `core`, `.skilled`; `partial-merge`, `claude`, `.claude` with one `missing child:` line per manifest entry the real folder lacks; and `missing`, `claude`, `.mcp.json`, then exits 0 because missing children in a partial merge are install work, and the router ends `STATUS=OK` with `Status: OK`. The dry run prints one `link`, `mkdir` or `ignore-add` line per planned action, one `ignore-add .git/info/exclude: <lines>` line, and a `PLAN DIGEST: <64 lowercase hex>` line, followed by `Dry run: nothing was written and nothing was asked.` and `STATUS=OK`; the scratch folder is unchanged and no question is asked. The direct `plan` run with the same flags prints the same digest, because the digest is the lowercase hex sha256 of the composed plan. The apply prints `run record: <the checkout>/.skilled/output/doctor-symlink/<first 16 hex of the digest>/manifest.json` and `undo: node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink --run <that run directory> --dry-run`, then its own post-apply check summary. After the apply `.claude` is still a real directory holding one link per merged entry, `.claude/local-notes.md` still holds its original text, `.skilled` is one whole-folder link, `.mcp.json` is the relative link `.claude/mcp.json`, and `.git/info/exclude` gained `/.skilled`, `/.mcp.json` and one `/.claude/<name>` line per link created inside the folder, skipping the lines git already ignores. The second check reads `linked-whole` for `.skilled` and `.mcp.json` and `linked-merge` for `.claude`, and the router ends `STATUS=OK` with `Status: OK`. The unlink dry run prints one `remove link` line per recorded link and `remove recorded ignore lines from .git/info/exclude`, then `dry-run: nothing was written`, and removes nothing. The real unlink prints one `unlinked:` line per recorded path and `run directory kept`. The baseline comparison after the undo matches the first check: the same three entry lines, the same empty folder apart from `.claude`, the same local file text, the same exclude file content, and the same `git status --porcelain` of `?? .claude/`.
- Desired user-visible outcome: A plan the operator can read, one digest the apply repeats, a merged folder that keeps the repo's own file, ignore lines that keep the absolute links out of git, and an undo command that leaves the repository as it was before the run.
- Pass/fail: PASS if the first check reports the three entries and exits 0, the dry run prints the actions and a 64-hex digest and writes nothing, the apply merges the real folder with the local file kept and the exclude lines added, the post-apply check reports `linked-whole` and `linked-merge`, and the unlink restores the baseline with the run directory kept. FAIL if the dry run writes, a real file or folder is replaced, the local file is missing or changed, the ignore lines land in `.gitignore` on the default run, the printed digest does not match the plan the operator approved, or the scratch repository does not return to its baseline.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Link Skilled into this project so my runtimes load it, then undo it.
```

### Commands

1. Confirm the checkout assets exist: `.skilled/commands/doctor/scripts/symlink-engine.cjs`, `.skilled/commands/doctor/assets/symlink-manifest.json`, `.skilled/commands/doctor/assets/doctor-symlink-check.yaml`, `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` and `.skilled/commands/doctor/assets/doctor-symlink-unlink.yaml`. Confirm the checkout root, and keep it in hand to check that every link points into it.

2. Create the scratch repository and record the baseline:
   ```bash
   SCRATCH="$(mktemp -d)/scratch-repo"
   mkdir -p "$SCRATCH/.claude"
   git -C "$SCRATCH" init --quiet
   printf 'this file belongs to the repo\n' > "$SCRATCH/.claude/local-notes.md"
   git -C "$SCRATCH" status --porcelain
   ls -A "$SCRATCH"
   ls -A "$SCRATCH/.claude"
   cat "$SCRATCH/.git/info/exclude"
   ```
   Confirm the scratch path is not the Skilled checkout, does not sit inside it and does not hold it.

3. Run `/doctor:symlink check --root "$SCRATCH" --runtimes claude` through the real runtime. Capture every entry line, every indented detail line, the check summary and the status line.

4. Run the same check through the engine and record the exit code:
   ```bash
   node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "$SCRATCH" --runtimes claude
   ```

5. Run `/doctor:symlink link --root "$SCRATCH" --runtimes claude --dry-run`. Capture the plan, the `ignore-add` line, the full `PLAN DIGEST:` line and the dry-run line. Confirm no question is asked, then confirm with `ls -A "$SCRATCH"` and `git -C "$SCRATCH" status --porcelain` that nothing was written.

6. Capture the same plan through the engine and compare the digest with step 5:
   ```bash
   node .skilled/commands/doctor/scripts/symlink-engine.cjs plan --root "$SCRATCH" --runtimes claude
   ```
   The two digests must be identical, and the scratch folder must still be unchanged.

7. Run `/doctor:symlink link --root "$SCRATCH" --runtimes claude`. Read the plan and the digest, then answer `yes`. Capture the post-apply check summary, the `run record:` line, the `undo:` line and the status line.

8. Inspect what the apply wrote:
   ```bash
   ls -lA "$SCRATCH"
   ls -lA "$SCRATCH/.claude"
   cat "$SCRATCH/.claude/local-notes.md"
   tail -n +1 "$SCRATCH/.git/info/exclude"
   git -C "$SCRATCH" status --porcelain
   ```

9. Run `/doctor:symlink check --root "$SCRATCH" --runtimes claude` a second time and capture the entry lines and the summary.

10. Run the printed undo command with `--dry-run` first: `/doctor:symlink unlink --run <the run directory step 7 printed> --dry-run`. Capture the plan and confirm that nothing was removed yet with `ls -lA "$SCRATCH"`.

11. Run `/doctor:symlink unlink --run <the same run directory>` and answer `yes`. Capture every `unlinked:` line, the `run directory kept` line and the status line.

12. Compare with the baseline from step 2:
   ```bash
   git -C "$SCRATCH" status --porcelain
   ls -A "$SCRATCH"
   ls -A "$SCRATCH/.claude"
   cat "$SCRATCH/.claude/local-notes.md"
   cat "$SCRATCH/.git/info/exclude"
   test -f "<the run directory>/manifest.json" && echo kept
   ```

### Expected

The first check reports the scratch repository as unlinked: `.skilled` is `missing`, `.claude` is `partial-merge` with one `missing child:` line for each manifest entry the real folder does not hold, and `.mcp.json` is `missing`. The engine exits 0 because missing children in a partial merge are work for `/doctor:install` step 1, and the router ends `STATUS=OK` with `Status: OK`.

The dry run prints the plan in the engine's order, one line per action, then the `ignore-add` line naming `.git/info/exclude` and its lines, then the plan digest as 64 lowercase hex characters, then the dry-run line and `STATUS=OK`. No question is asked and nothing is written. The direct plan run in step 6 prints the same digest, because the digest is the sha256 of the composed plan over the source, the root and the actions, and nothing on disk changed between the two runs.

The apply repeats that digest before it writes anything, then prints the run record path, the undo line and its own post-apply check. `.claude` stays a real directory: one link per merged entry points into the checkout, and `.claude/local-notes.md` keeps its original text because a real file with no source counterpart is local and is never touched. `.skilled` becomes one whole-folder link, `.mcp.json` becomes the relative link `.claude/mcp.json`, and `.git/info/exclude` gains `/.skilled`, `/.mcp.json` and one `/.claude/<name>` line per link created inside the folder. `git status --porcelain` still reports only `?? .claude/`, because the merged links are covered by the exclude lines and the repo's own file is the untracked path.

The second check reads `linked-whole` for `.skilled` and `.mcp.json` and `linked-merge` for `.claude`, with no broken link into the checkout, and the router ends `STATUS=OK` with `Status: OK`. Those two statuses are the only pass values.

The unlink dry run is the plan the router shows before its question: one `remove link` line per recorded link in reverse apply order, one `remove recorded ignore lines from .git/info/exclude`, and the dry-run line, with the folder untouched. The real unlink prints `unlinked:` for each recorded path, drops exactly the recorded exclude lines, and prints `run directory kept`, so the record outlives the removal.

The baseline comparison matches step 2 on every count: the same three entry lines from the first check, no `.skilled` and no `.mcp.json` in the folder, `.claude` holding only `local-notes.md` with its original text, the exclude file at its original content, and the run directory still holding `manifest.json`.

### Evidence

- The preflight observations for the engine, the manifest, the three workflows and the scratch path.
- The first check, with the `missing` and `partial-merge` entry lines and the engine exit code.
- The dry-run plan with every action line, the `ignore-add` line, the `PLAN DIGEST:` line and the dry-run line, plus the unchanged folder listing and `git status --porcelain` that follow it.
- The direct plan digest and the observation that it equals the dry run's digest.
- The apply output with the repeated digest, the `run record:` path and the `undo:` line.
- The listing of the scratch folder and of `.claude`, the text of `.claude/local-notes.md` and the added lines in `.git/info/exclude`.
- The second check with its `linked-whole` and `linked-merge` lines.
- The unlink dry-run plan and the folder listing that shows it removed nothing.
- The unlink output with every `unlinked:` line and `run directory kept`.
- The baseline comparison from step 12, including the kept `manifest.json`.

### Pass / Fail

- **Pass**: The first check reports the entries and exits 0, the dry run prints the actions and a 64-hex digest and writes nothing, the direct plan digest equals the dry run's, the apply merges the real folder with the local file kept and the exclude lines added, the post-apply check reports `linked-whole` and `linked-merge`, and the unlink restores the baseline with the run directory kept.
- **Fail**: The dry run writes a link, an ignore line or a folder, a real file or folder is replaced, the repo's own file is missing or changed, the ignore lines land in `.gitignore` on a default run, the apply writes against a digest other than the one the plan printed, or the scratch repository does not return to its baseline.

### Failure Triage

If the engine exits 2 with `ERROR:` on the first check, the scratch path is absent, is the checkout, sits inside it or holds it, and the run has not started. If the first check reports `foreign-link` or `broken` instead of `missing`, the scratch folder was reused and holds a link from an earlier run, so recreate it. If the dry run prints `NOTHING TO DO`, the scratch repository is already linked as asked, so recreate it rather than read that run as a pass. If the two digests differ, something wrote to the scratch folder between steps 5 and 6. If the apply exits 3 with `DIGEST MISMATCH`, the tree changed between the plan and the apply, and nothing was written. If a real file or folder was replaced, the merge walk crossed its safety rule, which is a failure of the apply boundary rather than a scenario error. If the undo line names a run directory that does not exist, the run record was not written under the checkout's `.skilled/output/doctor-symlink/`. If the unlink reports a path as `changed since apply`, the recorded state no longer matches what sits there, and the scenario removed or replaced that path between steps 8 and 10.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/symlink.md](../../commands/doctor/symlink.md)
- Matching YAML assets: [doctor-symlink-check.yaml](../../commands/doctor/assets/doctor-symlink-check.yaml), [doctor-symlink-link.yaml](../../commands/doctor/assets/doctor-symlink-link.yaml) and [doctor-symlink-unlink.yaml](../../commands/doctor/assets/doctor-symlink-unlink.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-symlink-presentation.txt](../../commands/doctor/assets/doctor-symlink-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/symlink-engine.cjs](../../commands/doctor/scripts/symlink-engine.cjs)
- Entry manifest: [.skilled/commands/doctor/assets/symlink-manifest.json](../../commands/doctor/assets/symlink-manifest.json)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:symlink check, link and unlink

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-398
- Feature name: Doctor symlink
- Command mode: `/doctor:symlink check`, `/doctor:symlink link`, `/doctor:symlink unlink`
- YAML asset: `doctor-symlink-check.yaml`, `doctor-symlink-link.yaml`, `doctor-symlink-unlink.yaml`
- Mutation boundary: A scratch repository under a temporary folder only, never a real project. `check` and both `--dry-run` forms write nothing. The apply writes the links, the merged folders and the exclude lines in the scratch repository, and the run record under the checkout's `.skilled/output/doctor-symlink/<digest prefix>/manifest.json`. No real file and no real folder is overwritten, and only broken links whose text points into the checkout are ever replaced or removed. The unlink removes exactly what one record lists and keeps the run directory.
- Feature file path: `doctor-commands/doctor-symlink.md`
