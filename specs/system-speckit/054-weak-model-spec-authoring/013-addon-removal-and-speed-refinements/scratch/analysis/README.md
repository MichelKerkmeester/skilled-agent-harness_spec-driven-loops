# Speed-loop analysis evidence

Tables extracted from the 24 runs of the 2026-10-26 speed loop (`../../../011-authoring-speed-research/scratch/speed-loop/results/20261026T050500Z-67716/`).

- `validate-events.tsv`: one row per validate call. 120 calls, 84 with `output` = `piped`. 39 returned FAILED: 30 named only `GENERATED_METADATA_*` rules and 9 were piped so their rules were not captured.
- `author-calls.tsv`, `doc-cost.tsv`: tool calls per authoring run and per document.
- `noise.md`: run-to-run spread.
- `synth.md`: the DeepSeek synthesis. Its line "all 39 were `GENERATED_METADATA_*`" overcounts; the table gives 30 of 39.

Recount: `awk -F'\t' '$4=="FAILED"{print $6}' validate-events.tsv | sort | uniq -c`.
