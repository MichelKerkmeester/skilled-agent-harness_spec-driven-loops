Read `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/residue-census-raw.tsv`.

It is a tab-separated census of this machine, taken after the repository moved its source tree from `.opencode/` to `.skilled/`. `.opencode` is now a symbolic link to `.skilled` in the main checkout, so a path under the old name still resolves. Columns: path, kind, key_or_line, link_target, count.

Write `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/residue-census-classified.tsv`: the same header and rows, with two columns appended, `class` and `reason`.

Use exactly one of these four values for `class`:

- `must-fix` — the row names a path that does not resolve, or a setting that will stop working.
- `expected` — the row already names the new root, or names no source root at all.
- `record` — the row is a saved record of something that happened, not live configuration.
- `none` — the row names the old root, that path still resolves through the link, and nothing needs changing.

Write one sentence per row in `reason`, naming what you read in that row. Change nothing else. Answer with `DONE` and the count of each class.
