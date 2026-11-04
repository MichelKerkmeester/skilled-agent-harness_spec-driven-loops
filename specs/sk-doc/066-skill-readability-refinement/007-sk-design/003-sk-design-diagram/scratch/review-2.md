VERDICT: FIX

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:145 | 1 | The P2 finding was applied only at §11.1: `legend_block_h  = 40` still makes `viewBox_h = 412 + 40 + 24 = 476`, while §11.1 and the shipped `it-state.html` viewBox say 500. | Replace `legend_block_h  = 40` with `legend_block_h  = 64`.

- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:143 | 1 | The P1 finding's fourth field row was not applied: §3.2 still defines three field rows plus a gap, so line 130's "four labeled field rows" and line 78's `access` key have no coordinates, while the shipped `medallion.html` draws `Access` at y=300/306. | Replace lines 143-148 with:
  ```text
  field rows (absolute y):
    tool_label  at 180,    tool_value  at 186 (foreignObject, height 24)
    format_label at 220,   format_value at 226 (foreignObject, height 24)
    writer_label at 260,   writer_value at 266 (foreignObject, height 24)
    access_label at 300,   access_value at 306 (foreignObject, height 24)
    # gap (open whitespace below access row, above the example section)
    example_label_text at 360,  example_line_0 at 374,  example_line_1 at 388
  ```

- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:41-56 | 1 | The same finding's YAML half was not applied: `tiers[i].fields` now promises `access`, but every §2 tier omits it, so the fourth row has no input. | Replace the `tiers:` block with:
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
