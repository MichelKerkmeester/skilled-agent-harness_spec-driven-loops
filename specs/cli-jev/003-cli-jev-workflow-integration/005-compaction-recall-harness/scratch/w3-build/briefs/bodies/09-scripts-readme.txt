TASK: add the compaction-recall census to the scripts README: one sentence, the structure block and the file inventory.
FILE = .skilled/skills/system-spec-kit/runtime/scripts/README.md (the only file you may edit). Read it first.

Edit 1, line 19. Replace exactly this text:
`runtime/scripts/` holds the scripts that `package.json` invokes plus one maintenance tool.
with:
`runtime/scripts/` holds the scripts that `package.json` invokes plus one census an operator runs by hand.
(Only that sentence changes; the rest of line 19 stays byte-identical.)

Edit 2, the structure block. After the line `scripts/` (line 31) insert these two lines, byte for byte:
+-- compaction-recall/
|   `-- score-compaction-recall.mjs  # Zero-call census of what host compactions keep

Edit 3, the File Inventory table. Directly after the separator row `|---|---|---|` insert this one row, byte for byte:
| `compaction-recall/score-compaction-recall.mjs` | Operator-run census of host compactions | Reads only the transcripts named with `--transcripts` and makes no model call. It prints counts, scores and one `stop:` line and writes one JSON report to an `--out` path outside every named transcript directory. |

VERIFY (repo root), report each result and exit code:
grep -c 'compaction-recall' .skilled/skills/system-spec-kit/runtime/scripts/README.md   (expect 3)
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/scripts/README.md   (expect VALID, exit 0)
Accept when: 1 file changed (+3/-1) and nothing else; the grep prints 3; validate_document exits 0.
