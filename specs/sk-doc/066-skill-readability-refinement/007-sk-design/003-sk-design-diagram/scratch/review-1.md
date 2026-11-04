VERDICT: FIX

- [P1] `.skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:143` | 1 | The four-row field fix is only half applied: the schema at :78 and the prose at :130 now say four field rows, but the coordinate block at :143-148 still defines three and the §2 YAML carries no `access:` input, so a renderer following the block drops the Access row. | Replace lines 143-148 with:
  ```text
  field rows (absolute y):
    tool_label  at 180,    tool_value  at 186 (foreignObject, height 24)
    format_label at 220,   format_value at 226 (foreignObject, height 24)
    writer_label at 260,   writer_value at 266 (foreignObject, height 24)
    access_label at 300,   access_value at 306 (foreignObject, height 24)
    # gap (open whitespace below access row, above the example section)
    example_label_text at 360,  example_line_0 at 374,  example_line_1 at 388
  ```
  and add `access:` to each tier's `fields` map in §2, using the values the shipped `medallion.html` draws: Raw `platform-read · eng-write`, Anonymized `analyst-read · eng-write`, Staging `analyst-read · sci-write`, Aggregated `consumer-read · sci-write`, Archive `audit-read · eng-write`.

- [P2] `.skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:145` | 1 | The first half of the `viewBox_h` fix is missing: the code block still sets `legend_block_h = 40`, so `viewBox_h = content_bottom + legend_block_h + 24` yields 476, while §11.1 at :469 now states `52 + 360 + 64 + 24 = 500`. | Replace line 145 with `legend_block_h  = 64`.
