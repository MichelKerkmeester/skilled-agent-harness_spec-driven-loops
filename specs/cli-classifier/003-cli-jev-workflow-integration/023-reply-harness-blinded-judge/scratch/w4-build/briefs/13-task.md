TASK: update one README so it names the new offline judge script and passes the repository's document validator.
F = .skilled/skills/sk-communication/benchmark/reply-harness/README.md (exists; the only file you edit)
Read F in full first. Apply the four edits below exactly, character for character. Change nothing else: every other line stays byte-identical.

EDIT 1. F:3-5 now reads these three lines:
```
Mechanical plumbing for the reply comparison. No script here calls a model, the model step belongs to the operator.

## What each piece does
```
Replace them with these seven lines:
```
## 1. OVERVIEW

Mechanical plumbing for the reply comparison. The default run of every script here calls no model. Only `judge-agreement.mjs` can ask one, and only behind its `--deem` or `--jev` switch, so the model step that feeds the comparison still belongs to the operator.

---

## 2. WHAT EACH PIECE DOES
```

EDIT 2. Insert this one line directly above the line that starts with "- `release-gate.md`." (it follows the `compare.mjs` line):
```
- `judge-agreement.mjs`. Measures offline whether a model judge agrees with the operator's grades of masked replies more often than the mechanical scores of `score.mjs`. Takes `--masked` and `--replies`, each repeatable, plus an optional `--labels` file of operator grades. It joins each masked reply to its reply file by the SHA-256 of the reply text, runs `score.mjs` unchanged for the baseline, counts apart any empty or missing reply it cannot score, and prints the census, the baseline agreement and a label gate that stops below 20 graded distinct replies. The default run calls no model and writes no file. `--deem` asks the local Deem server and `--jev` asks the hosted Jev service, each only after its own check passes and only with `--out <dir>`, where the run writes `report.json` and one `calls.jsonl` line per call. No verdict it prints reaches `compare.mjs` or the release gate.
```

EDIT 3. The line `## Run order` becomes these three lines:
```
---

## 3. RUN ORDER
```

EDIT 4. Insert this one line directly below the line that starts with "5. `node compare.mjs":
```
6. `node judge-agreement.mjs --masked <masked dir> --replies <before replies dir> --replies <after replies dir> --labels <grades file>` when you want to know whether a model judge would grade the masked replies as you would. The grades file holds one JSON line per graded masked file: `masked`, its path from the repository root, and `grades`, each of the seven `rubric.json` dimension ids set to `absent`, `partly met` or `fully met`. Add `--deem --out <dir>` or `--jev --out <dir>` only once at least 20 distinct replies are graded. `--jev` sends reply text to a hosted service, so a masked file that git does not track also needs `--accept-payload`.
```

Accept when: 1 file changed (F), it has exactly 3 lines starting with `## `, and the validator below prints `VALID`.
Checks you run, from the repo root:
- `grep -c "^## " .skilled/skills/sk-communication/benchmark/reply-harness/README.md` (expect 3)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/benchmark/reply-harness/README.md` (expect `VALID` and exit 0)
