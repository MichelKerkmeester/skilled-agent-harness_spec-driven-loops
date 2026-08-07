# Deep Research Iteration 017

> Audited changelog: `changelog-019-001-implement-ledger-v2-schema-and-identity-verified-pid.md`
> Executor: cli-opencode openai/gpt-5.5-fast (high) --pure | exit=0 | 2026-06-04T14:59:17.000Z

## Finding

VERDICT: MAJOR-DRIFT
DRIFT: Files Changed paths do not exist on disk: `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`, `tests/test_sidecar_ledger.py`, `tests/fixtures/reaper-ledger-cases.json`, `tests/__init__.py`; packet docs also carry stale/internal paths under `013-...`/commit-created `016-...` while changelog points to `003-memory-and-causal-runtime/...`.
NOTE: Changelog spec folder exists and is Level 2; `3788c7f807` is a real commit, but the shipped-file and verification claims are not currently auditable against disk.
