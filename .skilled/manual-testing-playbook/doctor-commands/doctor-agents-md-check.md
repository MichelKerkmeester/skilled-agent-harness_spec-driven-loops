---
title: "DOC-404 -- Doctor agents md check"
description: "Manual scenario validating that /doctor:agents-md check reports one repository's root instruction files as twelve rows, names the repair for every finding, and writes nothing on either the repository or a composed fixture."
version: 1.0.0.0
id: doctor-commands-doctor-agents-md-check
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-404 -- Doctor agents md check

## 1. OVERVIEW

This scenario validates the read-only `check` target of `/doctor:agents-md` on two trees. The route runs one engine, `agents-md-check.cjs`, which reports twelve rows — A1 install state through A12 template purity — each with its own status and detail, then the counts of findings and unknown rows. A1 is read first, because it says which state the repository is in and every other row is a detail of that state.

The first tree is the repository itself, which is the route's default root. The second is a composed fixture in a temporary folder, because a check of a healthy repository reports no finding and the repair half of the route then has nothing to read. The fixture carries a repository block, a divergent `CLAUDE.md` and no router, so its report holds the two rows a real repair names, and it does so without an edit to any real file.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the report reaches twelve rows in order for two different states, that A1 names each state, that every finding is quoted with the repair it needs, and that neither run writes a byte.
- Playbook ID: DOC-404.
- Real user request: `Does my root AGENTS.md still match what Skilled ships?`
- Prompt: `Does my root AGENTS.md still match what Skilled ships?`
- Preconditions: The Skilled checkout with `.skilled/commands/doctor/agents-md.md`, `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml`, its presentation contract, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` and `.skilled/commands/doctor/assets/agents-md-manifest.json` in place, and a runtime that can execute `/doctor:agents-md` with Bash access. Node and git available, because the delivery-budget and router rows start the shipped canary and the repo-rules checker. A scratch folder under a temporary directory that the operator can create and delete. No network access needed; a missing binary is a valid reason to record `SKIP`.
- Expected execution process: Record the repository's `git status --porcelain` and the checksums of `AGENTS.md`, `REPO RULES.md` and `.cursor/rules/skill-routing.md`. Run check with no flags and capture the twelve rows, the engine's closing line, the summary and the status line. Compose the `adopted` fixture into the scratch folder and capture its file list. Run check with `--root` on that folder and capture the twelve rows, the closing line and the exit code. Compare the repository and the fixture folder with the baseline.
- Expected signals: Both reports carry twelve rows, A1 to A12, in that order, each with its own status and detail. The repository run reads `A1 install state: pure` with its own detail line, reports every remaining row at `PASS`, and closes `STATUS=OK rows=12 findings=0 unknown=0` with engine exit 0; the route renders `Status: OK`, `Mutation class: read-only`, `Recommendation: none` and `STATUS=OK`. The fixture run reads `A1 install state: adopted`, reports `A10` at `FINDING` naming `CLAUDE.md` as a divergent copy and how many lines only that file carries, and `A11` at `FINDING` reading `absent` with `no REPO RULES.md: no repository rule can load`; `A12` reports `INFO` because template purity runs only in the source repository. It closes `STATUS=FINDINGS rows=12 findings=2 unknown=0` with engine exit 1, and the route ends `Status: FINDINGS` with `STATUS=FINDINGS` and a recommendation naming a repair for each of the two findings.
- Desired user-visible outcome: A row-by-row verdict for the repository, the same twelve rows read against a tree that is not this repository, the two findings quoted with what fixes each one, and no file touched.
- Pass/fail: PASS if both runs report the twelve rows in order with their own statuses, A1 names the state each tree is in, each route status matches its engine's exit code, the fixture's A10 and A11 findings are quoted in full with one repair each, no `UNKNOWN` row is presented as a pass, and the repository's status and the counted checksums are unchanged. FAIL if a row is missing or out of order, a status disagrees with the exit code, a finding is reported without its repair, or any counted file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Does my root AGENTS.md still match what Skilled ships?
```

### Commands

1. Confirm the checkout assets exist: `.skilled/commands/doctor/agents-md.md`, `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml`, `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` and `.skilled/commands/doctor/assets/agents-md-manifest.json`. A missing path ends the run before it starts.

2. Record the baseline:
   ```bash
   git status --porcelain
   shasum -a 256 AGENTS.md "REPO RULES.md" .cursor/rules/skill-routing.md
   ```

3. Run `/doctor:agents-md check` through the real runtime with no flags, which reads the repository it runs in. Capture the twelve rows, the engine's closing line, the `DOCTOR DIAGNOSTIC RESULT` summary and the status line.

4. Run the same check through the engine and record the exit code:
   ```bash
   node .skilled/commands/doctor/scripts/agents-md-check.cjs
   echo "exit=$?"
   ```

5. Compose the fixture and record what it holds:
   ```bash
   SCRATCH="$(mktemp -d)/agents-md-check"
   node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs adopted "$SCRATCH"
   ls -A "$SCRATCH"
   ```
   The composer refuses a folder that already holds anything, so the path must be absent before this step.

6. Run `/doctor:agents-md check --root "$SCRATCH"` and capture the twelve rows, the closing line and the status line.

7. Run the same fixture check through the engine and record the exit code, then read the finding rows in full:
   ```bash
   node .skilled/commands/doctor/scripts/agents-md-check.cjs --root "$SCRATCH"
   echo "exit=$?"
   ```

8. Compare with the baseline from step 2, and confirm the fixture folder's listing still matches step 5:
   ```bash
   git status --porcelain
   shasum -a 256 AGENTS.md "REPO RULES.md" .cursor/rules/skill-routing.md
   ls -A "$SCRATCH"
   ```

### Expected

The repository run reports what the repository holds. A1 reads the state that tree is in — `pure` when its shipped sections are current and its repository block carries nothing — and the remaining rows report what each one probes: the sections that survived, their order, the pins each tooling consumer greps for, the delivery budget, the block's own size, the runtime copies, the router, and template purity. When no row finds anything the engine exits 0, and the route ends `STATUS=OK` with its recommendation reading `none`; a row that does find something is a real finding about the repository, quoted with the repair it names, and the route ends `STATUS=FINDINGS` to match that exit code. A row that reports `INFO` is a fact the row does not grade, and an `UNKNOWN` row names what it could not answer rather than something it passed.

The fixture run is the same engine on a tree that is not this repository. A1 reads `adopted`, because the composed block carries content. A10 finds the divergent `CLAUDE.md`: it is one of the runtime copies the manifest expects, and the lines only it carries are the difference an operator has to decide about. A11 finds the missing router, and its detail says plainly that no repository rule can load, which is the whole reason the row exists. A12 reports `INFO` and says template purity runs only in the source repository, because the fixture has another origin. The engine exits 1 with two findings and no unknown row, so the route ends `Status: FINDINGS` with the two rows quoted in full and one repair named for each.

The repairs are the routes the presentation names. A divergent copy is folded into the block and removed by an embed, or the lines only it carries are deleted if they are noise. A missing router is created from the shipped rows by an embed with `--create-router`. Neither repair is run here: this route prints and never writes, so the whole run leaves the repository's status and the three counted checksums exactly as step 2 recorded them, and the fixture folder exactly as the composer left it.

### Evidence

- The baseline `git status --porcelain` and the three checksums from step 2, and the same values from step 8.
- The repository report: twelve rows, the engine's closing line and the route's summary and status.
- The fixture listing from step 5 and the same listing from step 8.
- The fixture report: twelve rows with A10 and A11 in full, the engine's `STATUS=FINDINGS rows=12 findings=2 unknown=0` line and the exit code.
- The two repairs written beside A10 and A11.

### Pass / Fail

- **Pass**: Both runs report the twelve rows in order with their own statuses, A1 names the state the repository is in and `adopted` for the fixture, each route status matches its engine's exit code, A10 and A11 are quoted in full with one repair each, no `UNKNOWN` row is presented as a pass, and every counted value is unchanged.
- **Fail**: A row is missing or out of order, a status disagrees with the exit code, a finding is reported without its repair, an `UNKNOWN` row is read as a pass, a finding is claimed that the engine never printed, or a counted file changes.

### Failure Triage

If the engine exits 2, quote its message and the accepted invocation `/doctor:agents-md check [--json] [--root <dir>]`: a missing manifest, a symlinked root document or one block marker without the other stops the run before any row. If the fixture's A1 does not read `adopted`, the compose step failed or the folder was not empty, and the composer refuses both. If A12 reports `INFO` on the repository itself, template purity compares the tree against the origin remote, so check that the checkout's origin is the source repository. If A2 or A4 reports `stale` on the repository, the shipped template moved after the root file was last embedded, which is a real finding and the repair is an embed. If a row reports `UNKNOWN`, the probe behind it could not answer, so name that row and the precondition it is missing and rerun when it is back. If `git status --porcelain` gains a line or a checksum moves, the run wrote into the repository, and the new line is what to inspect.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/agents-md.md](../../commands/doctor/agents-md.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-agents-md-check.yaml](../../commands/doctor/assets/doctor-agents-md-check.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt](../../commands/doctor/assets/doctor-agents-md-presentation.txt)
- Check engine: [.skilled/commands/doctor/scripts/agents-md-check.cjs](../../commands/doctor/scripts/agents-md-check.cjs)
- Section library: [.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs](../../commands/doctor/scripts/lib/agents-md-sections.cjs)
- Template manifest: [.skilled/commands/doctor/assets/agents-md-manifest.json](../../commands/doctor/assets/agents-md-manifest.json)
- Fixture composer: [.skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs](../../commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:agents-md check

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-404
- Feature name: Doctor agents md check
- Command mode: `/doctor:agents-md check [--json] [--root <dir>]`
- YAML asset: `doctor-agents-md-check.yaml`
- Mutation boundary: read-only. The route runs the check engine only and never the embed engine's plan, apply or restore, and every child it starts is a read-only mode of that tool. The repository is read, and the fixture is composed into a temporary folder so its rows describe a tree that is not this repository; the fixture is read and never written.
- Feature file path: `doctor-commands/doctor-agents-md-check.md`
