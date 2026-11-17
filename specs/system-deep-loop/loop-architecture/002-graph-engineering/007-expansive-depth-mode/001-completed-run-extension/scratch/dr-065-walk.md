# DR-065 live walk, 2026-11-17

Walked in a throwaway detached worktree cut from integration tip `b5fb87abad8`, fixture spec folder `specs/z_scratch/999-extend-walk-fixture`, research executor cli-pi on `llmgateway/deepseek-v4.1-flash-1017` at max thinking. The orchestrator followed `.skilled/commands/deep/research.md` and `deep-research.yaml` by hand; the extension step command was copied verbatim from the YAML. The ledger frames and dispatch receipts are the evidence that does not depend on that orchestrator.

- First run: `--max-iterations=2 --stop-policy=max-iterations` ended `status: complete`, stop reason `maxIterationsReached`, `research/research.md` written, lock released.
- Extension step output: `{"continuedFromRun":2,"newMaxIterations":5,"newMaxDurationMinutes":240,"warning":null}`.
- Iteration files 2 then 5; iteration rows runs 1-2 then runs 1-5, all complete. Dispatch receipts: one intent/completion pair per iteration i1-i5 at generation 1, none duplicated. The extension dispatched exactly 3 iterations (i3, i4, i5).
- `run_extended`: 0 then 1, ledger frame `0000000000000010`, receipt `deep-research.ledger.run-extended` sequence 10, projected as one state-log row `{"type":"event","event":"extended",...}`. `rg -c '"event":"extended"'` on the state log prints `1`.
- `resumed` rows: 0 then 0.
- `.lineage` before: sessionId `2026-11-17T21:05:53.000Z`, generation 1, maxIterations 2, lineageMode `new`. After: same sessionId, generation 1, maxIterations 5, lineageMode `completed-continue`, continuedFromRun 2, maxDurationMinutes 240.
- Snapshot `research/synthesis-v1-r2.md`; its sha256 (`cc19d695...`) equals the pre-extension `research.md`, and the current `research.md` differs (`68fb3435...`), so the snapshot was not overwritten.
- `--extend=0`: the extension step command prints `--extend needs a positive integer, and got "0".` and exits 2; config hash, state-log hash and ledger listing unchanged, no lock file.

Playbook fix from this walk: DR-065 command 5 counted `"run_extended"` in the state log (the stem lives in the ledger) and command 6 read top-level lineage fields (research nests them under `.lineage`). Both are corrected; DRV-070 command 5 had the same fault and is corrected, and its command 6 is right because review keeps lineage fields flat.
