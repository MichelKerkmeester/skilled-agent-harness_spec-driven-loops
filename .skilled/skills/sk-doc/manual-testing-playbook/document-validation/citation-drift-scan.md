---
title: "SD-021 -- Citation drift scan"
description: "This scenario validates the citation drift scan for `SD-021`. It focuses on the default run printing the count lines, the dead citations and the label-gate stop with zero model calls, then a `--deem` run whose stub backend is refused at the health check and writes no file."
version: 2.2.0.0
---

# SD-021 -- Citation drift scan

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SD-021`.

---

## 1. OVERVIEW

This scenario validates the citation drift scan for `SD-021`. It focuses on the default run printing the count lines, the dead citations and the label-gate stop with zero model calls, then a `--deem` run whose stub backend is refused at the health check and writes no file.

### Why This Matters

A skill doc that cites `file.ext:line` claims something about a line of another file, and the claim goes stale the moment that file moves or shrinks. `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` counts every such citation in the prose of the tracked skill docs, resolves each against the tracked files and prints the dead ones, where the target is missing on disk or the cited line sits past the file's last line. It makes zero model calls by default and it changes no citation, no validator and no cited file. `--jev` and `--deem` each run one backend and need `--out <dir>` so every call is recorded. The scenario holds each switch to its own gate: the default run shows that nothing is called, and the `--deem` run shows that a stub backend is refused at the health check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SD-021` and confirm the expected signals without contradictory evidence.

- Objective: prove the default run prints every count line, the dead citations and the label-gate stop while both stub logs stay empty, and a `--deem` run with a stub backend prints its skip line after one health call, exits 0 and writes no file
- Real user request: `Before I trust these skill docs, can you check whether their file-and-line citations still point at the right lines, and do it without calling a model?`
- Prompt: `Run the citation drift scan with the two stubs first on PATH, once with no backend switch and once with --deem, and tell me what it printed, which citations are dead and whether anything left the machine.`
- Expected execution process: the orchestrator writes two logging stub binaries first on PATH, runs the scan against the repository with `--labels` at a scratch path that holds no rows and reads both stub logs, then runs it again with `--deem --out` and diffs the two outputs
- Expected signals: step 4 prints one `skill <skill>: citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> dead=<n>` line per skill folder, then `citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> refused=<n> dead=<n> commit=<sha12>`, one `cite dead: <doc>:<line> -> <target>:<line>` line per dead citation (or none), `margin: 0.10`, the `keep rule:` line and `stop: fewer than 40 labeled rows`, and it ends with `exit=0`. Step 5 reports zero lines for both stub logs. Step 6 prints the same lines plus `deem arm skipped: stub backend` and ends with `exit=0`. Step 7 finds one `health` line in the Deem stub log, no line in the Jev stub log and no file under `out`. Step 8 shows one added line and nothing else
- Desired user-visible outcome: the author sees every dead citation named by its citing and cited line, and sees the scan call no backend by default and refuse a stub backend without measuring anything
- Pass/fail: PASS if every expected signal appears and both runs end with `exit=0`. FAIL if a run exits non-zero, the `stop:` line is missing, a stub log holds a call beyond the one `health` line, a file appears under `out` or the diff shows more than the added skip line

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the citation drift scan with the two stubs first on PATH, once with no backend switch and once with --deem, and tell me what it printed, which citations are dead and whether anything left the machine.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-021 | Citation drift scan | Print the count lines and the dead citations with zero calls, stop at the label gate and skip a stub backend | `Run the citation drift scan with the two stubs first on PATH, once with no backend switch and once with --deem, and tell me what it printed, which citations are dead and whether anything left the machine.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/cite-drift-scan.XXXXXX); mkdir -p "$SCRATCH/bin" "$SCRATCH/out"` -> 2. `agent: write the two stub binaries below to $SCRATCH/bin/cli-deem and $SCRATCH/bin/jev exactly as given` -> 3. `bash: chmod +x "$SCRATCH/bin/cli-deem" "$SCRATCH/bin/jev"; : > "$SCRATCH/bin/cli-deem.log"; : > "$SCRATCH/bin/jev.log"` -> 4. `bash: PATH="$SCRATCH/bin:$PATH" node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/default.txt"; code=$?; cat "$SCRATCH/default.txt"; echo "exit=$code"` -> 5. `bash: wc -l "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"` -> 6. `bash: PATH="$SCRATCH/bin:$PATH" node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --deem --out "$SCRATCH/out" --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/deem.txt"; code=$?; cat "$SCRATCH/deem.txt"; echo "exit=$code"` -> 7. `bash: cat "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"; find "$SCRATCH/out" -type f` -> 8. `bash: diff "$SCRATCH/default.txt" "$SCRATCH/deem.txt" > "$SCRATCH/diff.txt"; cat "$SCRATCH/diff.txt"` -> 9. `bash: rm -rf "$SCRATCH"` | Step 4 prints one `skill <skill>: citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> dead=<n>` line per skill folder, the totals line with its `commit`, one `cite dead: <doc>:<line> -> <target>:<line>` line per dead citation (or none), `margin: 0.10`, the `keep rule:` line and `stop: fewer than 40 labeled rows`, then `exit=0`. Step 5 reports zero lines for both stub logs. Step 6 prints the same lines plus `deem arm skipped: stub backend` and `exit=0`. Step 7 finds one `health` line in the Deem stub log, no line in the Jev stub log and no file under `out`. Step 8 shows one added line | The prompt, the reply text and the full output of steps 4 to 8 with each exit line, both stub logs and the `find` result | PASS if every signal appears and both runs end with `exit=0`. FAIL if a run exits non-zero, the `stop:` line is missing, a stub log holds a call beyond the one `health` line, a file appears under `out` or the diff shows more than the added skip line | 1. A missing `stop: fewer than 40 labeled rows` line means the run read a labels file that holds rows, since the commands point `--labels` at a scratch path that must not exist. 2. A stub log line after step 4 means the default run spawned a backend, since only `--jev` and `--deem` may spawn anything. 3. A diff beyond the added skip line is either a changed `commit=` value, meaning the repository moved between the two runs, or a health reply the script does not read as a stub backend |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/cite-drift-scan.XXXXXX); mkdir -p "$SCRATCH/bin" "$SCRATCH/out"`
2. `agent: write the two stub binaries below to $SCRATCH/bin/cli-deem and $SCRATCH/bin/jev exactly as given`
3. `bash: chmod +x "$SCRATCH/bin/cli-deem" "$SCRATCH/bin/jev"; : > "$SCRATCH/bin/cli-deem.log"; : > "$SCRATCH/bin/jev.log"`
4. `bash: PATH="$SCRATCH/bin:$PATH" node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/default.txt"; code=$?; cat "$SCRATCH/default.txt"; echo "exit=$code"`
5. `bash: wc -l "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"`
6. `bash: PATH="$SCRATCH/bin:$PATH" node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --deem --out "$SCRATCH/out" --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/deem.txt"; code=$?; cat "$SCRATCH/deem.txt"; echo "exit=$code"`
7. `bash: cat "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"; find "$SCRATCH/out" -type f`
8. `bash: diff "$SCRATCH/default.txt" "$SCRATCH/deem.txt" > "$SCRATCH/diff.txt"; cat "$SCRATCH/diff.txt"`
9. `bash: rm -rf "$SCRATCH"`

### Stub binaries

Step 2 writes these two files, with these exact bytes.

`$SCRATCH/bin/cli-deem`:

```sh
#!/bin/sh
echo "$@" >> "$(dirname "$0")/cli-deem.log"
if [ "$1" = "health" ]; then
  echo stub >&2
  exit 3
fi
exit 3
```

`$SCRATCH/bin/jev`:

```sh
#!/bin/sh
echo "$@" >> "$(dirname "$0")/jev.log"
if [ "$1" = "--version" ]; then
  echo 'jev 0.6.2'
  exit 0
fi
exit 3
```

> **Note on the stubs**: the root playbook's line against mocks and stubs binds the routing scenarios. The stub `cli-deem` here is a `PATH` stub that refuses at the Deem gate, not a mocked model, and the stub `jev` answers only `--version`. No model is imitated and no model answer is faked. The stubs exist so the run can show that nothing is called and that a stub backend is refused.

### Expected

Step 4 reads every tracked skill doc at `HEAD`, takes its citations from prose only, and prints one `skill` line per skill folder with the per-skill counts, then the totals line with the `commit` it read at. A resolved target that is missing on disk, or cited past its last line, is dead and prints as `cite dead: <doc>:<line> -> <target>:<line>`. The scratch labels file holds no rows, so after `margin: 0.10` and `keep rule: coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M` the run prints `stop: fewer than 40 labeled rows` and stops the summary there, and step 4 spawns nothing. Step 5 finds both stub logs empty. Step 6 prints the same lines and adds `deem arm skipped: stub backend`, because the gate runs `cli-deem health` once and reads `stub` on its stderr as a stub backend. Step 7 finds one `health` line in the Deem stub log and nothing else, because the call log is written on the first call and `report.json` only after the arms when the summary gate passed. Step 8 shows that one added line and nothing else, because both runs read the same `HEAD`.

### Evidence

Capture the prompt and reply text and the complete output of steps 4 to 8, including every `skill` line, each `cite dead:` line, the `stop:` line, both stub logs, the `find` result and each `exit=` line.

### Pass / Fail

- **Pass**: every expected signal appears, both runs end with `exit=0`, step 5 finds both stub logs empty, step 7 finds only the one `health` line and no file under `out`, and the diff shows only the added skip line.
- **Fail**: a run exits non-zero, the `stop:` line is missing, a stub log holds a call the run should not have made, a file appears under `out` or the diff shows more than the added skip line.

### Failure Triage

1. A missing `stop: fewer than 40 labeled rows` line means the run read a labels file that holds rows. The commands point `--labels` at a scratch path that must not exist before step 4.
2. Any line in a stub log after step 4 means the default run spawned a backend. Only `--jev` and `--deem` may spawn anything.
3. A diff that shows more than the added `deem arm skipped: stub backend` line is either a `commit=` value that changed, meaning the repository moved between the two runs and both must be re-run at the same `HEAD`, or a health reply the script does not read as a stub backend.

### Optional Supplemental Checks

Repeat step 6 with `JEV_PROVIDER=official` set and `--jev --out "$SCRATCH/out-jev"` in place of `--deem --out "$SCRATCH/out"`, and confirm the run adds `jev: path=<path> provider=official` and then `jev arm skipped: no credential`, that the Jev stub log holds `--version` and `auth status --provider official`, and that no file is written.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/document-validation/citation-drift-scan.md`](../../feature-catalog/document-validation/citation-drift-scan.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../shared/scripts/cite-drift-scan.mjs`](../../shared/scripts/cite-drift-scan.mjs) | The counts, the resolution, the label gate and the backend gates |
| [`../../scripts/tests/test-cite-drift-scan.mjs`](../../scripts/tests/test-cite-drift-scan.mjs) | The extraction, resolution, gate and arm cases on a fixture repository with stub backends |

---

## 5. SOURCE METADATA

- Group: DOCUMENT VALIDATION
- Playbook ID: SD-021
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `document-validation/citation-drift-scan.md`
