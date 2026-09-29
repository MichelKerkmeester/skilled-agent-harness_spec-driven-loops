TASK: add one layout row to the hub benchmark README.
File F = .skilled/skills/cli-classifier/benchmark/README.md. Read F first.

STEP 1. F:31 currently reads exactly:
| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |
Insert this new line directly after F:31, so it becomes F:32 and the table keeps both rows:
| [`injection-screen/`](./injection-screen/) | `score-injection-screen.mjs` and its tests: an offline check of whether a Jev or Deem `noul` spots text that tries to instruct an agent. The default run makes zero model calls. `--jev` and `--deem` each run one backend behind that backend's own gate |
Change nothing else in F. Edit no other file.

VERIFY (repo root), paste each result line:
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-classifier/benchmark/README.md   (expect "Total issues: 0" and exit 0)
  grep -c "injection-screen/" .skilled/skills/cli-classifier/benchmark/README.md   (expect 1)
Accept when: 1 file changed (F) with exactly one line added and none removed; the validator exits 0; the grep prints 1.
