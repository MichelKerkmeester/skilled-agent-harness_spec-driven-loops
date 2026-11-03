# Codex attempts before the passing run

Each folder keeps the failed attempt's stage results and verdict. What each one exposed, and what changed before the next:

1. `main-attempt1-hooktrust`: HOOK_TRUST_OUTSIDE_PROJECT at launch. Codex listed 23 new or changed hooks against the project's 14; the other 9 are the operator's global hooks. The runner refused, and the Codex config was left unchanged. The operator chose to run with hooks untrusted.
2. `main-attempt2-slash`: Codex answered "Unrecognized command '/speckit:save'"; `~/.codex/prompts` holds no `speckit-save.md`. The operator chose a plain save request for every runtime. S6 had also passed on `pending=0` with no save, so S6 and S10 now also count record rows.
3. `main-attempt3-s3chat`: Codex asked the multi-select platforms question in chat on both tries. The S3 send now says a one-choice tool is fine, with the rest typed as a note. Checks Codex cannot meet now skip with the blocker first.
4. `main-attempt4-gate`: the save reached the writer and aborted with INSUFFICIENT_CONTEXT_ABORT, because operator decisions were not counted as evidence. Fixed in `workflow.ts`, with a save-suite case.
5. `main-attempt5-untracked`: Codex asked leave to overwrite untracked packet files before the save. Setup now commits the demo packet.
6. `main-attempt6-recommended`: Codex asked in chat, then labelled "Amber (Recommended)", which the runner's exact label match refuses. Every question send now asks for the tool itself and no recommended mark.
