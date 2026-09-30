# 021 session notes (feed session-evidence.md)

- Executors: code c1 to c7 Devin DeepSeek (`deepseek-v4-1-flash-max`), docs d08 to d15b Pi MiMo, each exit 0 with `STATUS: DONE`.
- Session proofs from the final state (`$SP/w4v/021f`), stubs for `jev` and `cli-deem` first on `PATH`:
  - `node leaf-route-replay.cjs --report <dir>` exit 0, stub log never created, `<dir>` holds only `report.json`. Per hub: sk-doc gold 25 tied 2 exact 19 f1 0.8259; mcp-tooling 15/15; system-deep-loop 6/6; cli-external-orchestration 5/5; sk-design 4/4; `hub=sk-code gold=1 unscored=1 surface slice not replayed`; `hub=cli-classifier stage1-only`; `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49`; `router reads: not measured`; `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a`. Same numbers as `../w4-build/replay-run.txt`. The design's proof table expected N=56; the scorer scores 55 because sk-code's one row is unscored.
  - `git status --porcelain` before and after differs only by `?? .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/`, which phase 031's code step created during the run.
  - Key grep exit 1. Comment hygiene checker exit 0 on the script and its test.
  - `node --test .../leaf-route-replay.test.cjs` `tests 33`, `pass 33`, `fail 0`. Whole `scripts/tests/` `tests 80`, `pass 79`, `fail 1`: the failure is `skill-root-metadata-contract.test.cjs`, the baseline's one failure (`../w4-build/baseline/node-test.txt`, 46 pass 1 fail), so +33 tests and no new failure.
- Docs: `validate_document.py` exit 0 (`VALID`) on all nine changed docs (playbook index `--type playbook`, catalog index `--type feature_catalog`).
- Catalog package `--package sk-doc` `WARN tier=warn violations=7`. Against a HEAD extract, one warning is new: `phantom_root_row` at `feature-catalog.md:52`, the new "Leaf Route Replay" block writes `` `ROUTER.md` `` as plain text. To fix in the review round.
- `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` OK; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; `sync-skills-hermes.cjs --check` `DRIFT sk-create-skill` (regenerate before the commit).
- The playbook package validator refuses `sk-create-skill` as a package root (`package does not resolve to a manual-testing-playbook root`), at HEAD too, so no package check runs for it.
- Review: split by family, SHA-1 over the 11 files in `files.txt` `55a6ac43bf44d9e398c270f1b5078b8883894506` before both runs.
