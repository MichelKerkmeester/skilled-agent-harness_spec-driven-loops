---
title: "DOC-397 -- Doctor agents md mirror loads in Cursor"
description: "Manual scenario settling whether a Cursor window loads the generated .cursor/rules/repo-local.md, which is the one file the Devin mirror writes for a non-empty repository block."
version: 1.0.1.0
id: doctor-commands-doctor-agents-md-cursor-mirror-load
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-397 -- Doctor agents md mirror loads in Cursor

## 1. OVERVIEW

This scenario settles the second claim the design could only infer. When the repository block is not empty, `/doctor:agents-md embed` writes the same block into `.cursor/rules/repo-local.md` with `alwaysApply: true`. The design assumes Cursor loads that file into every request without being asked to.

No engine suite can answer it. The suite proves the file exists exactly when the block has content and that its bytes carry the block. Whether a Cursor window puts those bytes in front of the model is an observation a person with Cursor records, so this scenario records it.

---

## 2. SCENARIO CONTRACT

- Objective: Record whether a Cursor window loads `.cursor/rules/repo-local.md`, so the mirror is either a proven Cursor path or a file nobody reads.
- Playbook ID: DOC-397.
- Real user request: `I ran /doctor:agents-md embed and it wrote a rule file for Cursor. Is Cursor actually reading it?`
- Prompt: `I ran /doctor:agents-md embed and it wrote a rule file for Cursor. Is Cursor actually reading it?`
- Preconditions: A worktree of this repository with a Node runtime, a throwaway folder outside the checkout, and a Cursor window that can be opened on that folder with its agent panel available.
- Expected execution process: Compose the `adopted` fixture into the throwaway folder, plan and apply the embed, confirm `.cursor/rules/repo-local.md` exists and carries the block, open the folder in Cursor and ask the agent to quote a line of the rule file without opening it, then restore the folder and compare it with the pristine copy.
- Expected signals: `.cursor/rules/repo-local.md` exists after the apply and opens with `---`, `alwaysApply: true`, `---`. The Cursor answer either quotes a line the block carries, or reports that no such rule loaded.
- Desired user-visible outcome: One recorded answer naming what the Cursor agent saw, with the quoted line or the reason no answer could be recorded.
- Pass/fail: PASS when the row records the Cursor agent's answer, either a quoted line from the rule file or a statement that no rule loaded, with the Cursor version and the date. FAIL when the row is left empty, or when it records what the file holds instead of what the agent printed.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
I ran /doctor:agents-md embed and it wrote a rule file for Cursor. Is Cursor actually reading it?
```

### Commands

1. `mkdir -p <throwaway>/cursor-mirror && node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs adopted <throwaway>/cursor-mirror`, then copy the composed folder to `<throwaway>/cursor-mirror-pristine`.
2. `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan --root <throwaway>/cursor-mirror` and record the `plan-digest:` line.
3. `node .skilled/commands/doctor/scripts/agents-md-embed.cjs apply --plan-digest <digest> --root <throwaway>/cursor-mirror` and confirm it ends `STATUS=OK`.
4. `head -4 <throwaway>/cursor-mirror/.cursor/rules/repo-local.md` and record the frontmatter block.
5. Open `<throwaway>/cursor-mirror` in a Cursor window, start the agent panel and ask: `Without opening or searching any file, quote the first line under the repository-specific instructions heading in the rules you were given.`
6. Record the answer and the Cursor version, then `node .skilled/commands/doctor/scripts/agents-md-embed.cjs restore --run=<backup> --yes` and `diff -r <throwaway>/cursor-mirror-pristine <throwaway>/cursor-mirror`.

### Expected

The engine guarantees step 4 and no more. An agent that quotes a line only the rule file carries settles the claim: Cursor loads the generated mirror, and the file is the path the block takes into a Cursor session. An agent that reports no rule settles it the other way, and the file is then a cost with no reader.

### Recorded answer

| Field | Value |
|---|---|
| Answer | UNKNOWN |
| Reason | Steps 1 to 4 ran and step 6 restored the tree byte-identical (`diff -r` exit 0), but step 5 could not: `cursor-agent -p` (2026.09.28-64d2043) reported `Your stored authentication is invalid`, which only an operator's `agent login` repairs. The row needs one observation from an authenticated Cursor agent, and a default pass would claim a fact nobody observed. |
| Engine side | Proven, not inferred: the embed suite proves the mirror exists exactly when the block carries content, and every transcript under `scratch/e2e/` shows it written and then restored. |
| Recorded | 2026-10-30 |

An operator answers this row by running steps 1 to 6 with a Cursor window and replacing the table's Answer with the quoted line or with the statement that no rule loaded.

### Evidence

- The plan's `plan-digest:` line and the apply's last line.
- The first four lines of `.cursor/rules/repo-local.md`.
- The Cursor agent's own answer, quoted, with the Cursor version and the date.
- The `diff -r` output after the restore.

### Pass / Fail

- **Pass**: The row carries a dated observation from a Cursor window, either a quoted line from the rule file or a statement that no rule loaded.
- **Fail**: The row is empty, or it records the file's contents rather than the agent's answer.

### Failure Triage

If `.cursor/rules/repo-local.md` is missing after the apply, the block was empty, which is the one case the engine does not write the mirror for. If the agent answers from the root file instead, ask for a line that exists only in the rule file so the two sources cannot be confused. If the restore leaves a `.cursor` folder behind, the run predates the record of the folders it created, or the folder held another file by restore time: a restore removes only the empty folders its own run made.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/agents-md.md](../../../../commands/doctor/agents-md.md)
- Embed workflow: [.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml](../../../../commands/doctor/assets/doctor-agents-md-embed.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt](../../../../commands/doctor/assets/doctor-agents-md-presentation.txt)
- Embed engine: [.skilled/commands/doctor/scripts/agents-md-embed.cjs](../../../../commands/doctor/scripts/agents-md-embed.cjs)
- Fixture composer: [.skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs](../../../../commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:agents-md embed

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-397
- Feature name: Doctor agents md mirror loads in Cursor
- Command mode: `/doctor:agents-md embed`
- YAML asset: `doctor-agents-md-embed.yaml`
- Mutation boundary: the throwaway fixture copy only. The apply writes inside that folder after its plan digest, and the restore puts the copy back before the scenario ends.
- Feature file path: `doctor-commands/doctor-agents-md-cursor-mirror-load.md`
