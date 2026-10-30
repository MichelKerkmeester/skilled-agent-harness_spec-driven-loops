---
title: "DOC-396 -- Doctor agents md block reaches a live Devin session"
description: "Manual scenario settling the claim the Cursor mirror is built on: that a live Devin session can read the repository block that embed writes into the root instruction file."
version: 1.0.2.0
id: doctor-commands-doctor-agents-md-block-devin-quote
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-396 -- Doctor agents md block reaches a live Devin session

## 1. OVERVIEW

This scenario settles one claim the design could only infer. `/doctor:agents-md embed` writes the repository's own lines into one marked block at the end of `AGENTS.md` and also mirrors a non-empty block into `.cursor/rules/repo-local.md`. That mirror exists because the design assumes a Devin session never reads past the delivery prefix of the root file, so the block at the end would otherwise be invisible to it.

The claim is not settled by any engine suite. The suite proves the bytes are written and the mirror matches. Whether a live Devin session receives the block is an observation only a person with a Devin session can make, so this scenario records that observation instead of assuming it.

---

## 2. SCENARIO CONTRACT

- Objective: Record whether a live Devin session can quote the last line inside the repository block, which decides whether the mirror is load-bearing or pure cost.
- Playbook ID: DOC-396.
- Real user request: `My Devin session does not seem to know our repository rules. Does the block /doctor:agents-md writes reach it?`
- Prompt: `My Devin session does not seem to know our repository rules. Does the block /doctor:agents-md writes reach it?`
- Preconditions: A worktree of this repository with a Node runtime, a throwaway folder outside the checkout, and a live Devin session that can be opened on that folder. No Devin session is reachable from an automated run, so the observation is recorded by an operator.
- Expected execution process: Compose the `adopted` fixture into the throwaway folder, plan and apply the embed with the digest the plan printed, confirm the block's last line on disk, open a Devin session on that folder and ask it to quote the last line of the repository block, then restore the folder and compare it with the pristine copy.
- Expected signals: The plan prints `plan-digest: <digest>` and `preservation: ... dropped 0`. The apply ends `STATUS=OK`. The last line between the two block markers is known before the question is asked. The Devin answer either quotes that exact line, or reports that the repository block is not part of its instructions.
- Desired user-visible outcome: One recorded answer naming what the session saw, with the quoted line or the reason no answer could be recorded.
- Pass/fail: PASS when the row records the session's answer, either the quoted last line or a statement that the block was not visible, together with the date and the runtime version. FAIL when the row is left empty, or when it records an inference rather than what a session actually printed.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
My Devin session does not seem to know our repository rules. Does the block /doctor:agents-md writes reach it?
```

### Commands

1. `mkdir -p <throwaway>/devin-block && node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs adopted <throwaway>/devin-block`, then copy the composed folder to `<throwaway>/devin-block-pristine`.
2. `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan --root <throwaway>/devin-block` and record the `plan-digest:` line.
3. `node .skilled/commands/doctor/scripts/agents-md-embed.cjs apply --plan-digest <digest> --root <throwaway>/devin-block` and confirm it ends `STATUS=OK`.
4. `awk '/skilled:repo-local:start/,/skilled:repo-local:end/' <throwaway>/devin-block/AGENTS.md | tail -2` and record the last line before the end marker.
5. Open a Devin session rooted at `<throwaway>/devin-block` and ask: `Without opening any file, quote the last line of the repository-specific instructions block in your AGENTS.md instructions.`
6. Record the answer, the Devin runtime version and the date, then `node .skilled/commands/doctor/scripts/agents-md-embed.cjs restore --run=<backup> --root <throwaway>/devin-block --yes` and `diff -r <throwaway>/devin-block-pristine <throwaway>/devin-block`.

### Expected

The plan and the apply behave as the engine suites already prove, so the only unproven part is step 5. A session that quotes the exact line the awk read from disk settles the claim: the block reaches Devin, and the mirror in `.cursor/rules/repo-local.md` is not what carries it. A session that reports no such block settles it the other way, and the mirror is the only path the block takes to a Devin session.

### Recorded answer

| Field | Value |
|---|---|
| Answer | UNKNOWN |
| Reason | Steps 1 to 4 ran and step 6 restored the tree byte-identical (`diff -r` exit 0), but step 5 could not: `devin -p` (devin 3000.11.234) refused with `resource_exhausted`, the account's weekly usage quota. The row needs one observation from a Devin session with quota, and a default pass would claim a fact nobody observed. |
| Engine side | Proven, not inferred: every transcript under `scratch/e2e/` shows the block written and the restore returning the tree byte-identical. |
| Recorded | 2026-10-30 |

An operator answers this row by running steps 1 to 6 with a live session and replacing the table's Answer with the quoted line or with the statement that the block was not visible.

### Evidence

- The plan's `plan-digest:` line and the apply's last line.
- The awk output naming the last line inside the block.
- The Devin session's own answer, quoted, with the runtime version and the date.
- The `diff -r` output after the restore.

### Pass / Fail

- **Pass**: The row carries a dated observation from a live session, either the quoted last line or a statement that the block was not part of its instructions.
- **Fail**: The row is empty, or it records what the engine prints rather than what a session printed.

### Failure Triage

If the apply refuses the digest, the folder changed between the plan and the apply, so re-plan and use the new digest. If the session answers from the wrong file, confirm it was rooted at `<throwaway>/devin-block` and not at the checkout this scenario runs from. If the restore leaves a `.cursor` folder behind, the run predates the record of the folders it created, or the folder held another file by restore time: a restore removes only the empty folders its own run made.

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
- Playbook ID: DOC-396
- Feature name: Doctor agents md block reaches a live Devin session
- Command mode: `/doctor:agents-md embed`
- YAML asset: `doctor-agents-md-embed.yaml`
- Mutation boundary: the throwaway fixture copy only. The apply writes inside that folder after its plan digest, the backup lands in the OS temp folder because the copy is not a git repository, and the restore puts the copy back before the scenario ends.
- Feature file path: `doctor-commands/doctor-agents-md-block-devin-quote.md`
