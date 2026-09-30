"""Check that each EDIT's old text is whole lines at the stated line of the current target."""
import pathlib, re, sys
for brief in sys.argv[1:]:
    t = pathlib.Path(brief).read_text()
    target = re.search(r'^FILE \(edit\): (\S+)', t, re.M).group(1)
    lines = pathlib.Path(target).read_text().splitlines()
    for m in re.finditer(r'^EDIT (\d+), starting at line (\d+)\..*?\n~~~~\n(.*?)\n~~~~\nwith exactly this text:\n~~~~\n(.*?)\n~~~~', t, re.M | re.S):
        n, start, old = m.group(1), int(m.group(2)), m.group(3).split('\n')
        ok = lines[start - 1:start - 1 + len(old)] == old
        whole = '\n'.join(lines).count('\n'.join(old))
        print(pathlib.Path(brief).name, 'EDIT', n, 'line', start, 'whole-lines-match' if ok else 'MISMATCH', 'occurrences', whole)
