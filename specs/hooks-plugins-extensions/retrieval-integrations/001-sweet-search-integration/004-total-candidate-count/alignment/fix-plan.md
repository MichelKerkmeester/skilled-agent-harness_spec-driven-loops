# Fix plan

Target: HEAD; head: 3378c36a064da59e1ec6da406da1d2b999e671e8

## In scope

### spec:specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration

- [ ] E-3 P2 specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/benchmark/run.mjs:222 The new benchmark harness shells out to a plain `git status --porcelain`. In this checkout a plain git call can block for minutes when `core.fsmonitor` is enabled (this review ran every git command wi
  fix: const status = spawnSync('git', ['status', '--porcelain'], { -> const status = spawnSync('git', ['-c', 'core.fsmonitor=false', 'status', '--porcelain'], {
- [ ] BAT-02 P0 specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count:- S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count (exit 1).
- [ ] BAT-03 P0 specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback:- S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/005-stale-index-fallback (exit 1).
- [ ] BAT-04 P0 specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control:- S14-packet-validate failed for specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control (exit 1).
- [ ] E-2 P1 specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/acceptance-criteria.md:90 The packet that defines this change still records it as unstarted: every acceptance row is `Unmet` and the closure says `Closeable: No` and 'Nothing is built yet' (`acceptance-criteria.md:90-92`); the
- [ ] E-4 P2 specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count/scenario-489/matrix.md:1 The scenario run tree is untracked at the packet root (`scenario-489/` with `result.json`, `actions.jsonl`, `checkpoints.tsv`, `tmux.conf` and the turn's `screen/check/history`). The packet's own file

### unowned

- [ ] E-1 P1 .skilled/commands/speckit/assets/search-presentation.txt:62 The /speckit:search trigger lane still maps only `results.length` to `CANDIDATES` and never renders `totalCandidates` or `truncated`. The lookup defaults to a 20-result limit (`lookup-trigger-index.mj
  fix: | `results.length` | `CANDIDATES=<count>` | -> | `results.length` | `CANDIDATES=<count>` | | `totalCandidates`, `truncated` | `TOTAL=<total>` and `TRUNCATED=<true/fals
- [ ] BAT-01 P0 -:- S3-catalog-package failed (exit 1).

### skill:.skilled/skills/system-spec-kit

- [ ] B-1 P2 .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md:62 The check passes if the omitted count appears anywhere after the prompt, without confirming the response describes it as omitted. For example, if the CLI reports 1,936 total candidates and the respons

## Pre-existing or outside the scope

### unowned

- [ ] C-1 P2 README.md:796 An operator reading the root README’s system-spec-kit summary learns that it owns the trigger index, but not that lookup reports the full candidate count or marks truncated results. The skill README d (reason unknown)
  fix: The mandatory orchestrator for all file modifications. It activates automatically for any code file change. It creates n -> The mandatory orchestrator for all file modifications. It activates automatically for any code file change. It creates n
- [ ] B-2 P2 .skilled/skills/cli-external-orchestration/feature-catalog/deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md:3 The reported S3 catalog-package failure predates this change. The baseline leaf description does not match the root catalog H3 “DeepSeek Harness Dispatch Mode”; both package files are unchanged from t (pre-existing (critic))

