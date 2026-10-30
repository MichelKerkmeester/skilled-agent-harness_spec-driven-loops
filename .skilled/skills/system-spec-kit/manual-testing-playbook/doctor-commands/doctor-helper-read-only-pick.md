---
title: "DOC-393 -- Doctor helper ranks a problem and runs a read-only pick"
description: "Manual scenario validating that /doctor:helper turns a described problem into a ranked list, and that a read-only pick runs in place under its own command while nothing is written."
version: 1.0.0.0
id: doctor-commands-doctor-helper-read-only-pick
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-393 -- Doctor helper ranks a problem and runs a read-only pick

## 1. OVERVIEW

This scenario validates `/doctor:helper` on the happy path. The command reads the route manifest, ranks the doctor commands against a problem stated in plain words and shows at most three candidates, each with its mutation class and the phrase it matched. Choosing a read-only candidate runs that command in place, under its own router and presentation.

On this path the ranking is repeatable, the class column matches the manifest, and the target's own output follows, with no write from the helper itself.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a described problem reaches the right doctor command, and that a read-only pick runs without the helper holding any write authority.
- Playbook ID: DOC-393.
- Real user request: `Which doctor command tells me whether my git hooks are set up correctly?`
- Prompt: `Which doctor command tells me whether my git hooks are set up correctly?`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, and a Node runtime that resolves the `yaml` package from the repository root.
- Expected execution process: Record the working tree state, run `/doctor:helper` with the problem, capture the ranked list, choose the read-only candidate, capture the target's own output, and compare the working tree state.
- Expected signals: The ranked list shows at most three lines, each in the form `<n>) <runnable> <class> matches "<phrase>" (<terms>)`, and the git setup route appears on one of them with the class `read-only`. The status line reads `STATUS=OK MATCHES=<n>`. Choosing the read-only candidate produces `/doctor:git setup`'s own presentation and result line, not a second helper rendering. The `git status --porcelain` output is unchanged.
- Desired user-visible outcome: One short list that names the command, says why it matched and runs the read-only one immediately.
- Pass/fail: PASS if the git setup route is ranked with its class, the target's own result follows the read-only pick, and the working tree is unchanged. FAIL if the ranking names no such route, the helper renders the target's result itself, or any file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Which doctor command tells me whether my git hooks are set up correctly?
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. Record `git status --porcelain`.
3. Run `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json -- "which doctor command tells me whether my git hooks are set up correctly"` and capture the candidates.
4. Run `/doctor:helper which doctor command tells me whether my git hooks are set up correctly` through the real runtime, and capture the rendered list and its status line.
5. Choose the read-only candidate, and capture that command's own output, including its own status line.
6. Compare the class shown on every line with that route's `mutating` value in the route manifest.
7. Record `git status --porcelain` again and compare it with step 2.

### Expected

The matcher returns one candidate per ranked route, each carrying its runnable line, its class, its score and the manifest phrase it matched with the terms that matched. The rendered list shows the same three at most, and the status line reads `STATUS=OK MATCHES=<n>`.

The read-only candidate runs in place: the target's own presentation contract and workflow produce the output, so the result is that command's result and not a second helper summary. Nothing is written, so the working tree is byte-identical after the run.

### Evidence

- The baseline and final `git status --porcelain` outputs.
- The matcher's JSON candidates with their `runnable`, `mutating`, `score`, `matchedPhrase` and `matchedTerms` fields.
- The rendered ranked list and its `STATUS=OK MATCHES=` line.
- The target command's own output after the read-only pick.

### Pass / Fail

- **Pass**: The git setup route is ranked with the manifest's class, the read-only pick runs under that command's own router, and the working tree is unchanged.
- **Fail**: No such route is ranked, the class differs from the manifest, the helper renders a target result itself, or any file changes.

### Failure Triage

If no route is ranked, read the JSON: an empty candidate list means the phrases in the route manifest carry none of the problem's words, which is a manifest addition and never a change to the matcher's scoring. If the class differs from the manifest, the route row and the presentation disagree, so run `bash .skilled/commands/doctor/scripts/route-validate.sh`. If the working tree changes, inspect the route's read-only invariant.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/helper.md](../../../../commands/doctor/helper.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-helper.yaml](../../../../commands/doctor/assets/doctor-helper.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-helper-presentation.txt](../../../../commands/doctor/assets/doctor-helper-presentation.txt)
- Matcher: [.skilled/commands/doctor/scripts/doctor-helper-match.cjs](../../../../commands/doctor/scripts/doctor-helper-match.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:helper

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-393
- Feature name: Doctor helper ranks a problem and runs a read-only pick
- Command mode: `/doctor:helper <problem in plain words>`
- YAML asset: `doctor-helper.yaml`
- Mutation boundary: read-only at the helper. It ranks the manifest and runs a read-only pick under that command's own router, which keeps its own contract.
- Feature file path: `doctor-commands/doctor-helper-read-only-pick.md`
