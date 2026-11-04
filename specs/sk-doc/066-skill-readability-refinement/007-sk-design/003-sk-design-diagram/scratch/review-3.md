VERDICT: FIX

- [P2] `.skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:145` | 1 | The `viewBox_h` repair is still half-applied: the §3 code block sets `legend_block_h  = 40`, so `viewBox_h = content_bottom + legend_block_h + 24` yields 476, while §11.1 states `52 + 360 + 64 + 24 = 500` and the shipped `it-state.html` uses `viewBox="0 0 960 500"`. | Replace `legend_block_h  = 40` with `legend_block_h  = 64`.

- [P1] `.skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:143-148` | 1 | The four-row field fix is still half-applied: the schema at :78 and the prose at :130 now say four field rows, but the coordinate block defines three plus a gap, so a renderer following the block drops the Access row the shipped `medallion.html` draws at y=300/306. | Replace lines 143-148 with:
  ```text
  field rows (absolute y):
    tool_label  at 180,    tool_value  at 186 (foreignObject, height 24)
    format_label at 220,   format_value at 226 (foreignObject, height 24)
    writer_label at 260,   writer_value at 266 (foreignObject, height 24)
    access_label at 300,   access_value at 306 (foreignObject, height 24)
    # gap (open whitespace below access row, above the example section)
    example_label_text at 360,  example_line_0 at 374,  example_line_1 at 388
  ```

- [P1] `.skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:41-56` | 1 | The same finding's YAML half is still unapplied: `tiers[i].fields` promises `access`, but every §2 tier omits it, so the fourth row has no input. | Replace the `tiers:` block with:
  ```yaml
  tiers:                                # 3..6 tier columns, ordered left → right
    - { name: "Raw",        bucket: "raw-bucket",        style: "outer",
        fields: { tool: "NiFi · raw write",          format: "CSV · Parquet · JSON", writer: "Data Engineer",
                  access: "platform-read · eng-write",
                  example: ["Q1 dump · w/ PII", "verbatim CAPI export"] } }
    - { name: "Anonymized", bucket: "anon-bucket",       style: "default",
        fields: { tool: "Trino INSERT",              format: "Iceberg · partitioned", writer: "Data Engineer",
                  access: "analyst-read · eng-write",
                  example: ["no name · address", "stable household ID"] } }
    - { name: "Staging",    bucket: "staging-bucket",    style: "default",  color: "#c9a23a",   # warm yellow — analytical working zone
        fields: { tool: "Trino · JupyterHub",        format: "Iceberg · cleaned",     writer: "Data Scientist",
                  access: "analyst-read · sci-write",
                  example: ["weighted records", "harmonised codings"] } }
    - { name: "Aggregated", bucket: "aggregated-bucket", style: "focal",  focal: true,
        fields: { tool: "Trino INSERT · SAS JDBC",   format: "Iceberg · indicators",  writer: "Data Scientist",
                  access: "consumer-read · sci-write",
                  example: ["unemployment rate", "labour participation"] } }
    - { name: "Archive",    bucket: "archive-bucket",    style: "cold",
        fields: { tool: "MinIO lifecycle",           format: "cold tier · immutable", writer: "Data Administrator",
                  access: "audit-read · eng-write",
                  example: ["historical Q1–Q4 sets", "5+ years retained"] } }
  ```

All three replacements land inside fenced blocks. `fix-3.log` reports them applied, but `diff-3.patch` is byte-identical to `diff-2.patch` and the files still carry HEAD's blocks because `code-blocks.py --restore` reverts any fenced block not listed in `scratch/approved-blocks.md`; those three blocks need an approval entry or the next fix round will be reverted again.
