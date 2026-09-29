TASK: add the scorer's navigation row and the new release row to the hub README.
File F = .skilled/skills/cli-classifier/README.md. Read F first.

STEP 1. F:73 currently reads exactly:
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the references a mode loads |
Insert this new line directly after it:
| [`benchmark/injection-screen/`](./benchmark/injection-screen/) | The offline injection screen scorer and its tests | Its default run makes zero model calls. `--jev` and `--deem` each add one backend behind that backend's own gate |
STEP 2. The CHANGELOG table's first data row currently reads exactly (it follows the `| Release | Entry |` header and its `|---|---|` line):
| v1.1.0.0 | [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) |
Insert this new line directly before it, so the newest release is listed first:
| v1.2.0.0 | [`changelog/v1.2.0.0.md`](./changelog/v1.2.0.0.md) |
Keep the frontmatter, including `version: 1.1.0.0`, byte-identical. Change nothing else in F. Edit no other file.

VERIFY (repo root), paste each result line:
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-classifier/README.md --type readme   (expect "Total issues: 0"; the v1.2.0.0 link target is created by a sibling brief, so a broken-link note for it alone is expected if it appears)
  grep -c "benchmark/injection-screen/\|changelog/v1.2.0.0.md" .skilled/skills/cli-classifier/README.md   (expect 2)
Accept when: 1 file changed (F) with exactly 2 lines added and none removed; the grep prints 2.
