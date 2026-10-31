TASK: add the track-narrowing script to the retrieval package README: one tree line, one key-files row, the probe-reader note and the script count. Four literal edits in one file.
F = .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md. Read F first. Change nothing else in it.

1. F:56. Old line:
All five scripts here import shared primitives from lib/ (see lib/README.md).
New line:
All six scripts here import shared primitives from lib/ (see lib/README.md).

2. After F:68 (the line starting `+-- rg-wrapper.mjs`) insert this one line, keeping the `#` in the same column as the lines around it:
+-- score-track-narrowing.mjs     # Offline check: does a model's pick of the spec track beat ripgrep and the lookup

3. F:78. Replace only the first sentence. Old first sentence:
Five fixtures were captured once, when the lexical lanes were accepted, and have no runtime reader: `latency-report.json`, `semantic-probes.json`, `prompt-set.json`, `recipe-execution.json` and `daemon-off-proof.json`.
New first two sentences:
Five fixtures were captured once, when the lexical lanes were accepted: `latency-report.json`, `semantic-probes.json`, `prompt-set.json`, `recipe-execution.json` and `daemon-off-proof.json`. None has a runtime reader except `semantic-probes.json`, whose Latin paraphrase and exact queries `score-track-narrowing.mjs` reads for a report-only probe line, taking each probe's gold from the current index rather than from the captured paths.
The rest of line 78 stays as it is.

4. After F:95 (the row starting "| `rg-wrapper.mjs` |") insert this row:
| `score-track-narrowing.mjs` | Measures offline whether one classifier choice that picks the spec track beats ripgrep and the trigger-index lookup at naming the right track. The default run makes no model call and writes no file: it prints the test-set counts, both baselines on the same rows, the fixed keep rule and whether a 10-point gain still fits. `--deem` and `--jev` each call their backend only behind that backend's own availability check and need `--out <dir>` for `calls.jsonl` and `report.json`. It changes no lookup, index or recipe. |

VERIFY (repo root):
  grep -c "score-track-narrowing" .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md   (expect 3)
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md   (expect exit 0)
Accept when: 1 file changed and nothing else; the grep prints 3; the validator exits 0.
