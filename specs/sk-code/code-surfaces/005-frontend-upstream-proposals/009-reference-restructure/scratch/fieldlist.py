import re, sys, pathlib
LABELS = ["Rule", "Why", "When not to", "Pitfall", "Support", "See also"]
pat = re.compile(r'^\*\*(' + '|'.join(re.escape(l) for l in LABELS) + r')\.\*\* ?(.*)$')
for p in sys.argv[1:]:
    path = pathlib.Path(p)
    lines = path.read_text().split('\n')
    out = []
    for line in lines:
        m = pat.match(line)
        if m:
            label, text = m.group(1), m.group(2)
            if label == "Support" and out and out[-1].startswith("- **Support:** "):
                out[-1] = out[-1].rstrip() + " " + text
                continue
            out.append(f"- **{label}:** {text}")
            continue
        if line == '---' and out and out[-1].strip() != '' and len(out) > 12:
            out.append('')
        out.append(line)
    path.write_text('\n'.join(out))
    print(p, "ok")
