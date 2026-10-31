---
title: "DOC-403 -- Doctor sk-skill convert"
description: "Manual scenario validating that /doctor:sk-skill convert <skill> --dry-run prints the plan, or the pending follow-up in its place, and ends without asking a single question and without writing a byte."
version: 1.0.0.0
id: doctor-commands-doctor-sk-skill-convert
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-403 -- Doctor sk-skill convert

## 1. OVERVIEW

This scenario validates the `--dry-run` form of `/doctor:sk-skill convert`, which is the route's one read-only window onto a conversion. The dry run runs the same plan call a real conversion runs, shows the plan and the field values it proposes, and stops before the first question. The conversion question, the intent-phrase question, the description trim, the allowed-tools list and the edge are all left unasked and unanswered.

The target is a plain skill written by hand in a temporary folder, so nothing in the repository is a candidate for a write. A plain skill's first plan cannot print until the engine has eight approved intent phrases, so the dry run on it shows the documented pending-follow-up form: the message the next question would answer, in place of the plan lines. The same target then shows the plan form through the engine's own plan-with-flags call, which also ends on its write gate, so both dry-run shapes are read on one target and neither writes.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a dry run shows the plan or the pending follow-up, asks nothing, writes nothing, and that the same target's engine plan with the approved flags prints the numbered plan and closes on its own write gate.
- Playbook ID: DOC-403.
- Real user request: `Convert this skill to the Skilled format, but show me the plan first and change nothing.`
- Prompt: `Convert this skill to the Skilled format, but show me the plan first and change nothing.`
- Preconditions: The Skilled checkout with `.skilled/commands/doctor/sk-skill.md`, `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml`, its presentation contract, `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` with its three libraries, `.skilled/commands/doctor/scripts/sk-skill-check.cjs` and the skill-router template in place, and a runtime that can execute `/doctor:sk-skill` with Bash access. Node, Python and PyYAML available, because the plan classifies its target by running the check engine. A scratch folder under a temporary directory holding one plain skill written by hand: a `SKILL.md` with a `name`, a `description` and a body, no `allowed-tools` field, no `version` field and no machine-router section. No network access needed; a missing interpreter or package is a valid reason to record `SKIP`.
- Expected execution process: Write the scratch plain skill and record the folder checksum, the contents of `.skilled/skills` and `git status --porcelain`. Run the route's dry run and capture the plan form it prints, the closing lines and whether any question appeared. Run the engine's plan directly and record its exit code and message. Run the engine's plan form with eight approved phrases and an allowed-tools list, still without the write switch, and capture the plan and the gate line. Run the engine's plan form with an approved edge as well and confirm the edges line became the write it records. Compare the scratch folder, the skills root and the repository with the baseline.
- Expected signals: The route's dry run prints `DOCTOR DRY RUN`, `Target: convert`, `Skill: <name-or-path>`, then either the plan lines or, on this target, the pending follow-up `INTENT_SIGNALS_BELOW_FLOOR: Only 0 approved intent phrase(s) were supplied; at least 8 are required.` with its suggested-phrase list, then `Dry run: nothing was written and nothing was asked.`, `Changed: none` and `STATUS=OK`. No `Convert this skill now? [yes/no]` line and no field question appears anywhere in the run. The engine's own `plan` exits 1 with the same code and writes nothing. The plan-with-flags call prints `Conversion plan: <name>`, its numbered steps with the `Copy:` step naming the staged root `.skilled/skills/<name>`, a `Backup existing files under:` line, `Approved intent phrases (8):`, `allowed-tools: ["Read","Write"]`, `edges: approval required; propose enhances -> <skill>` with its other candidates, the integration rows, and closes on `Apply gate: no writes without --apply.` With an approved edge the same line reads `edges: enhances -> <skill> (the approved edge, weight 0.3)`. The scratch folder's checksum is unchanged, `.skilled/skills/<name>` is absent, and `.skilled/skills/.state/doctor-sk-skill/<name>` is absent.
- Desired user-visible outcome: The plan on screen with the fields it would write, the questions untouched, and not a file changed anywhere.
- Pass/fail: PASS if the route's dry run shows the plan or the pending follow-up and closes on the dry-run line and `STATUS=OK` without asking a question, the engine's plan exits with its own follow-up or plan, the plan-with-flags call prints the numbered plan and closes on `Apply gate: no writes without --apply.`, and no file is created in the scratch folder, the skills root or the scratch state root. FAIL if a question is asked, a file is written, the staged root appears, or the route reports a write that it did not make.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Convert this skill to the Skilled format, but show me the plan first and change nothing.
```

### Commands

1. Confirm the checkout assets exist: `.skilled/commands/doctor/sk-skill.md`, `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml`, `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`, `.skilled/commands/doctor/scripts/sk-skill-convert.cjs`, its `lib/` companions, `.skilled/commands/doctor/scripts/sk-skill-check.cjs` and `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md`. A missing path ends the run before it starts.

2. Write the scratch plain skill and record the baseline:
   ```bash
   SCRATCH="$(mktemp -d)/convert-dry-run"
   mkdir -p "$SCRATCH/plain-notes/references"
   cat > "$SCRATCH/plain-notes/SKILL.md" <<'SKILL'
---
name: plain-notes
description: "Write and read short plain-text notes in one folder, with a dated heading per note and no database."
---

# Plain Notes

This skill writes one note per day into a folder and reads them back.

### Workflow

1. Pick the folder the notes live in.
2. Write the note under a dated heading.
3. Read the note back to confirm the heading and the body.
SKILL
   printf '# Notes\n\nKeep the folder flat.\n' > "$SCRATCH/plain-notes/references/notes.md"
   head -4 "$SCRATCH/plain-notes/SKILL.md"
   find "$SCRATCH/plain-notes" -type f -exec shasum -a 256 {} \; | sort | shasum -a 256
   ls .skilled/skills
   git status --porcelain
   ```
   The three frontmatter fields are what make this a plain skill: an `allowed-tools` field or a `version` field classifies it as something else, and a machine-router section makes it an older Skilled skill, which a path outside the skills root may not be.

3. Run `/doctor:sk-skill convert "$SCRATCH/plain-notes" --dry-run` through the real runtime. Capture the whole output, and note whether any question line appeared.

4. Run the engine's plan on the same target and record the exit code:
   ```bash
   node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan "$SCRATCH/plain-notes"
   echo "exit=$?"
   ```

5. Run the engine's plan form with the flags a rerun would carry, and no write switch. Replace the phrases with eight distinct phrases of three or more words each that the operator approves:
   ```bash
   node .skilled/commands/doctor/scripts/sk-skill-convert.cjs apply "$SCRATCH/plain-notes" \
     --approved-phrase "write a plain text note" \
     --approved-phrase "read a note back" \
     --approved-phrase "notes in one folder" \
     --approved-phrase "dated heading per note" \
     --approved-phrase "one note per day" \
     --approved-phrase "keep the notes flat" \
     --approved-phrase "no index file for notes" \
     --approved-phrase "folder for daily notes" \
     --allowed-tools "Read,Write"
   ```
   Capture the plan, the `edges:` line and the last line of the output.

6. Rerun step 5 with `--edge enhances:<one of the names the edges line proposes>` added, and capture the same lines. The edges line becomes the write it records, and the gate line still closes the run.

7. Compare with the baseline from step 2:
   ```bash
   find "$SCRATCH/plain-notes" -type f -exec shasum -a 256 {} \; | sort | shasum -a 256
   ls .skilled/skills
   ls .skilled/skills/.state/doctor-sk-skill 2>&1
   git status --porcelain
   ```
   The checksum, the skills listing and the repository status must equal step 2, and the state root must not exist.

### Expected

The route's dry run is a read-only window: it runs the plan call, prints what that call printed, and then prints the dry-run line and `STATUS=OK`. On this target the plan call refuses before printing any plan, because a plain skill's plan needs eight approved intent phrases and no flag has been supplied, so the dry run carries that message as the pending follow-up in place of the plan lines. The route asks nothing at all, which is the whole point of the flag: no question is shown, so no answer can be taken, and `Changed:` reads `none`.

The plan form is what the operator would otherwise approve. With eight phrases and an allowed-tools list, the same target prints `Conversion plan:` followed by the numbered steps, and the steps name the staged root under the skills root rather than the scratch folder, because a plain skill is copied to its own root and its source is left as it was. The `allowed-tools:` line holds the approved list, the `edges:` line says approval is required and proposes the skill the advisor ranks highest, and the run closes on the engine's own gate line rather than on a written field. With an approved edge, that same line becomes the single edge the engine will write, and the gate line still closes the run.

Every write the plan describes is a write this run does not perform. The scratch folder keeps its checksum, the skills root gains no folder, the scratch state root is never created, and the repository's status is unchanged.

### Evidence

- The asset check naming the paths, and the scratch path used.
- The scratch folder's checksum, the skills listing and `git status --porcelain` from step 2, and the same values from step 7.
- The route's dry-run output, including the pending follow-up and the observation that no question line appeared.
- The engine plan's exit code and its message from step 4.
- The plan-with-flags output from step 5, with the numbered steps, the `allowed-tools:` line, the `edges:` line and `Apply gate: no writes without --apply.`
- The edges line and the gate line from step 6.

### Pass / Fail

- **Pass**: The dry run prints the pending follow-up or the plan, then the dry-run line, `Changed: none` and `STATUS=OK`, and asks nothing; the engine plan exits with its own follow-up message; the plan-with-flags call prints the numbered plan and closes on the write gate; and nothing is created in the scratch folder, the skills root or the scratch state root.
- **Fail**: A question is asked, a field is written, the staged root or the scratch state root appears, the dry run ends on anything other than `STATUS=OK`, or the route reports a write it did not make.

### Failure Triage

If the engine refuses with `NOT_PLAIN_SKILL`, the scratch `SKILL.md` carries an `allowed-tools` or `version` field, or a machine-router section, and one of those has to go before the target is a plain skill. If it refuses with `NAME_NOT_KEBAB` or `NAME_COLLISION`, the declared name is not a lowercase kebab-case name, or another root already uses it, so rename the scratch skill. If it refuses with `TARGET_EXISTS`, a folder of that name already sits under the skills root from an earlier run: choose another scratch name rather than deleting anything under the skills root. If it refuses with `SOURCE_SYMLINK`, the scratch tree holds a symlink, which a copy would write through. If `INTENT_SIGNALS_BELOW_FLOOR` arrives, that is the documented follow-up rather than a failure, and the suggested list it prints is a suggestion: the operator supplies at least eight distinct phrases of three or more words each. If the engine prints `USAGE:` with its usage block, the invocation named an option the parser does not take, and the route never passes one, so re-read the two documented calls. If a later step writes anything, stop: a plan call that writes is the defect this scenario exists to catch.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/sk-skill.md](../../commands/doctor/sk-skill.md)
- Matching YAML assets: [doctor-sk-skill-convert.yaml](../../commands/doctor/assets/doctor-sk-skill-convert.yaml) and [doctor-sk-skill-check.yaml](../../commands/doctor/assets/doctor-sk-skill-check.yaml), which the plan runs to classify its target
- Presentation contract: [.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt](../../commands/doctor/assets/doctor-sk-skill-presentation.txt)
- Convert engine: [.skilled/commands/doctor/scripts/sk-skill-convert.cjs](../../commands/doctor/scripts/sk-skill-convert.cjs)
- Check engine: [.skilled/commands/doctor/scripts/sk-skill-check.cjs](../../commands/doctor/scripts/sk-skill-check.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:sk-skill convert

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-403
- Feature name: Doctor sk-skill convert
- Command mode: `/doctor:sk-skill convert <name-or-path> --dry-run`
- YAML asset: `doctor-sk-skill-convert.yaml`, `doctor-sk-skill-check.yaml`
- Mutation boundary: nothing in this scenario writes. The dry run ends before every question and before the agent step, and the engine's plan form writes nothing by its own gate. The only paths named are the scratch folder under a temporary directory, which the operator writes by hand, and the staged root and scratch state root the plan proposes and never creates. The repository is read only, and a run that writes has failed.
- Feature file path: `doctor-commands/doctor-sk-skill-convert.md`
