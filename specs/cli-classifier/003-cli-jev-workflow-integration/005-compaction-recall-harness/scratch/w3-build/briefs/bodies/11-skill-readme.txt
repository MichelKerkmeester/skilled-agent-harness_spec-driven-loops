TASK: add one paragraph about the compaction recall census to the system-spec-kit README.
FILE = .skilled/skills/system-spec-kit/README.md (the only file you may edit). Read it first.

Find the paragraph that ends with the line `index or recipe.` (line 311, the last line before the blank line and the `---`
that close section 4). Directly after that line insert one empty line and then these five lines, byte for byte
(the file wraps prose at 100 columns, so keep these line breaks exactly):
`runtime/scripts/compaction-recall/score-compaction-recall.mjs` measures what a host compaction
keeps. It reads only the transcripts an operator names, makes no model call and prints counts,
scores and one stop line: whether the stock summary and the recovered-context brief keep what the
work after the compaction uses, and whether the vendored staged fit can hold the session at all. It
changes no hook, setting or transcript.

The existing blank line and `---` after it stay as they are. Do not touch any other line.

VERIFY (repo root), report each result and exit code:
grep -c 'score-compaction-recall.mjs' .skilled/skills/system-spec-kit/README.md   (expect 1)
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/README.md   (expect VALID, exit 0)
Accept when: 1 file changed (+6/-0) and nothing else; the grep prints 1; validate_document exits 0.
