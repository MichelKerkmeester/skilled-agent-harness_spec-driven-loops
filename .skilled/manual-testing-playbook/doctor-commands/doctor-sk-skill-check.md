---
title: "DOC-402 -- Doctor sk-skill check"
description: "Manual scenario validating that /doctor:sk-skill check reports one skill as rows C1 to C13, quotes every row that finds something with the repair it needs, and writes nothing, on a scratch copy whose two findings belong to the copy alone."
version: 1.0.0.0
id: doctor-commands-doctor-sk-skill-check
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-402 -- Doctor sk-skill check

## 1. OVERVIEW

This scenario validates the `check` target of `/doctor:sk-skill` on one skill root. The route runs one engine, `sk-skill-check.cjs`, which reports thirteen rows — C1 location through C13 regression coverage — each with its own status and detail, then a result line. Every row that reports `FINDING` is quoted in the reply together with the repair that row needs.

The target is a scratch copy of a real skill, taken into a temporary folder. A check of the real root alone reports rows and nothing to repair; the copy reports two findings that belong to the copy and to nothing else. Its changelog index link resolves to the original's changelog, and its declared name is a name another root already holds. That gives the repair half of the route a case to read without editing a real skill, and the run stays read-only for the repository and for the copy.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the report reaches one skill root, that each of the thirteen rows carries its own status, that every finding is quoted with the repair it needs, and that the run writes nothing.
- Playbook ID: DOC-402.
- Real user request: `How far is this skill from the Skilled format?`
- Prompt: `How far is this skill from the Skilled format?`
- Preconditions: The Skilled checkout with `.skilled/commands/doctor/sk-skill.md`, `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml`, its presentation contract, `.skilled/commands/doctor/scripts/sk-skill-check.cjs` and `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` in place, and a runtime that can execute `/doctor:sk-skill` with Bash access. Node, Python and PyYAML available, because the format, root-metadata and derived rows run the skill's own validators and checkers. One skill under `.skilled/skills` that carries a `changelog/` folder with its versioned entry, which this scenario uses as `sk-prompt`. A scratch folder under a temporary directory that the operator can create and delete. No network access needed; a missing interpreter is a valid reason to record `SKIP`.
- Expected execution process: Confirm the assets, then copy the one skill into the scratch folder and record the copy's checksum and the repository's `git status --porcelain`. Run check on the copy through the route and capture every row, the result line, the summary and the status line. Run the same check through the engine and record the exit code. Read each row whose status is not `PASS` and write the repair beside it. Run check on the original skill by name and compare the two reports row by row. Compare the copy's checksum and `git status --porcelain` with the baseline.
- Expected signals: The copy's report opens `Skill check: <name> (<inputKind>)`, then one line per row C1 to C13 in that order, each with its own status and detail, then `Result: FINDINGS (2)`. `C1` reports `INFO` and says the root stands outside the skills root. `C10` reports `FINDING` with `The changelog index link points elsewhere.`, because that index link resolves to the original skill's changelog. `C12` reports `FINDING` and names the original as another `SKILL.md` declaring the same name and another root already using it. The engine exits 1, and the route ends `STATUS=FINDINGS` with a `Recommendation:` line naming one repair per finding. The by-name run reports the same thirteen rows for the real root with `C10` and `C12` at `PASS`, and its own status matches its engine's exit code. The copy's checksum and `git status --porcelain` are unchanged.
- Desired user-visible outcome: One table of thirteen rows, the two rows that find something quoted with the fix each one needs, and no file touched.
- Pass/fail: PASS if both runs report the thirteen rows in order, the copy's report ends `Result: FINDINGS (2)` with C10 and C12 as the two findings, the reply quotes those two rows and names one repair for each, the by-name run reads C10 and C12 at `PASS`, each route status matches its engine's exit code, and nothing is written. FAIL if a row is missing or out of order, a finding is reported without its repair, an `UNKNOWN` row is reported as a pass, a finding is claimed that the engine never printed, or any file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
How far is this skill from the Skilled format?
```

### Commands

1. Confirm the checkout assets exist: `.skilled/commands/doctor/sk-skill.md`, `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml`, `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`, `.skilled/commands/doctor/scripts/sk-skill-check.cjs` and `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs`. A missing path ends the run before it starts.

2. Create the scratch copy and record the baseline:
   ```bash
   SCRATCH="$(mktemp -d)/skill-check"
   mkdir -p "$SCRATCH"
   cp -R .skilled/skills/sk-prompt "$SCRATCH/sk-prompt-copy"
   find "$SCRATCH/sk-prompt-copy" -type f -exec shasum -a 256 {} \; | sort | shasum -a 256
   git status --porcelain
   ```
   Keep the checksum and the status output. `sk-prompt` is one skill that carries a `changelog/` folder and its versioned entry; a skill without one reports C10 as a missing changelog directory instead of a misplaced index link.

3. Run `/doctor:sk-skill check "$SCRATCH/sk-prompt-copy"` through the real runtime. Capture every row line, the `Result:` line, the `DOCTOR DIAGNOSTIC RESULT` summary and the status line.

4. Run the same check through the engine and record the exit code:
   ```bash
   node .skilled/commands/doctor/scripts/sk-skill-check.cjs "$SCRATCH/sk-prompt-copy"
   echo "exit=$?"
   ```

5. Read every row whose status is not `PASS` and write the repair beside it. `PASS` holds, `FINDING` fails, `UNKNOWN` means the row could not be answered, `INFO` reports a fact the row does not grade, and `N/A` means the row does not apply, so none of those three is a finding.

6. Run `/doctor:sk-skill check sk-prompt` and capture the same thirteen rows, the result line and the status line.

7. Compare the two reports row by row, and record where the same row differs between the copy and the real root.

8. Compare with the baseline from step 2:
   ```bash
   find "$SCRATCH/sk-prompt-copy" -type f -exec shasum -a 256 {} \; | sort | shasum -a 256
   git status --porcelain
   ```
   Both must equal the values step 2 recorded.

### Expected

The route runs one engine and renders its table as printed, so the copy's report carries thirteen rows in the engine's own order and wording. The two findings are the copy's own: C10 reads that the changelog index link points elsewhere because the link under `.skilled/changelog/` resolves to the original skill's changelog, and C12 reads that another `SKILL.md` declares the same name because the original still does. The route leads its reply with those two rows, quotes each line rather than paraphrasing it, and names the repair each one needs: one root per name, so the copy either takes a name of its own or the question is answered against the original; and the index link has to resolve to this root's own changelog.

The engine exits 1 on a finding, so the route ends `STATUS=FINDINGS`, and its `Recommendation:` line carries the repair for each finding rather than a single sentence for the run. The `Evidence:` line counts the rows it read, and an `UNKNOWN` row is named as unanswered rather than counted as a pass.

The by-name run reads the real root: the same thirteen rows, with C10 and C12 at `PASS`, because that root's index link resolves to its own changelog and no other root claims its name. Its status is `OK` when the engine exits 0 and `FINDINGS` when it exits 1, and a row that still finds something there is quoted with its repair like any other.

Nothing is written on either run, so the copy's checksum and the repository's `git status --porcelain` match the values recorded before the first check.

### Evidence

- The asset check naming the five paths, and the scratch path used.
- The copy's checksum and the repository's `git status --porcelain` from step 2, and the same two values from step 8.
- The copy's full report: thirteen row lines, the `Result:` line, the summary and `STATUS=FINDINGS`.
- The engine's exit code from step 4.
- The repair written beside C10 and beside C12.
- The by-name report with its C10 and C12 rows and its own status line.

### Pass / Fail

- **Pass**: Both runs report the thirteen rows in order, the copy ends `Result: FINDINGS (2)` with C10 and C12 as the findings, each of those two rows is quoted with a repair, the by-name run reads C10 and C12 at `PASS`, each route status matches its engine's exit code, and no file changed.
- **Fail**: A row is missing or out of order, a finding is reported without its repair, an `UNKNOWN` row is presented as a pass, a finding is claimed that the engine never printed, a status disagrees with the exit code, or the copy or the repository changed.

### Failure Triage

If the copy reports no C10 finding, the copied skill has no `changelog/` folder or no versioned entry, and the row says so in its own words; copy a skill that carries both. If the copy reports no C12 finding, the copy was not taken from a skill inside `.skilled/skills`, because the collision is with the root the copy came from. If the engine exits 2, quote its code, its message and its `Provision:` line: `PYTHON_MISSING` and `PYYAML_MISSING` name the interpreter or the package to install, and `SHARED_NOT_BUILT` names the provision command. If a row reports `UNKNOWN`, the probe behind it could not answer, so name that row and its precondition and rerun when it is back. If the copy's checksum changes, a checker wrote into the copy, which breaks the read-only invariant and is the finding to report. If `git status --porcelain` gains a line, the run wrote into the repository, and the new line is what to inspect.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/sk-skill.md](../../commands/doctor/sk-skill.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml](../../commands/doctor/assets/doctor-sk-skill-check.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt](../../commands/doctor/assets/doctor-sk-skill-presentation.txt)
- Check engine: [.skilled/commands/doctor/scripts/sk-skill-check.cjs](../../commands/doctor/scripts/sk-skill-check.cjs)
- Shared surface library: [.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs](../../commands/doctor/scripts/lib/sk-skill-surface.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:sk-skill check

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-402
- Feature name: Doctor sk-skill check
- Command mode: `/doctor:sk-skill check [<name-or-path>]`
- YAML asset: `doctor-sk-skill-check.yaml`
- Mutation boundary: read-only, and the single target is a scratch copy under a temporary folder. Every validator runs in its check-only or dry-run form, and a repair is the operator's own action rather than a side effect of the diagnostic. The repository is only read, and the copy is only read: it exists so the two findings belong to the copy instead of to a real skill.
- Feature file path: `doctor-commands/doctor-sk-skill-check.md`
