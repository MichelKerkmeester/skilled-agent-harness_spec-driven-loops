# Failed Runs

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live · claude · glm-5.3-flash (llmgateway, --reasoning none) · phase-008-second-pass

No scenario recorded a FAIL verdict across 22 live behaviors (22 PASS) plus 14 hermetic cells recorded SKIP.

Both of the first pass's failures were re-executed here against the landed fixes and now pass:

- `HERMES-009` returned `TEMPLATE_OK` and the canonical command path in 21 s on `-t file,todo`, where the first pass returned zero bytes twice at 115 s and 114 s on `-t search,todo`.
- `HERMES-014` returned the sk-git advisory `[commit-scope-drops-untracked]` appended to the terminal tool result, where the first pass returned no advisory at all.

One observation is worth carrying forward rather than filing as a failure. The superseded `-t search,todo` shape is **intermittently** empty, not reliably so: this pass's control returned a 103-byte mid-work fragment where the first pass saw zero bytes twice, with the same `'read_file' is not a deferrable tool` error in the agent log each time. A gate that tests only for zero bytes would have passed that fragment, so `HERMES-022` tests content as well as byte count.
