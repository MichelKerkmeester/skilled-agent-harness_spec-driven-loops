#!/usr/bin/env bash
# Assemble a brief from its template by pasting the verbatim shared blocks.
set -eu
D="$(cd "$(dirname "$0")" && pwd)"
tpl="$1"; outf="${tpl%.tpl.md}.md"
python3 - "$D" "$tpl" "$outf" <<'PY'
import sys, pathlib
d, tpl, outf = sys.argv[1:]
b = lambda n: pathlib.Path(d, '_blocks', n).read_text().rstrip('\n')
t = pathlib.Path(tpl).read_text()
for k, n in [('@@PREAMBLE_CODE@@', 'preamble-code.txt'), ('@@PREAMBLE_MD@@', 'preamble-md.txt'), ('@@TAIL@@', 'tail.txt'), ('@@TAIL_CODE@@', 'tail.txt'), ('@@HANDBACK@@', 'handback.txt')]:
    t = t.replace(k, b(n))
assert '@@' not in t, 'unfilled marker'
pathlib.Path(outf).write_text(t)
print(outf, len(t.splitlines()), 'lines')
PY
