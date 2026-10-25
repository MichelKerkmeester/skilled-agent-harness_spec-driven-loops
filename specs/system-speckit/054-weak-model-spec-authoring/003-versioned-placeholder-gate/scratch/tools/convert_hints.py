# usage: convert_hints.py <template file>
# Rewrites the file in place and prints how many hints it turned into value tokens.
import re, sys

# A bracketed hint: a letter or slash, then at least two more characters, no nested brackets.
HINT = re.compile(r"\[(?!YOUR_VALUE_HERE)([A-Za-z/][^\]\[]{2,})\](?!\()")
# Text that create.sh replaces or strips at scaffold time must stay as written.
KEEP = ("NAME", "Feature Name", "YYYY-MM-DD", "###-feature-name", "1/2/3/3+")
CODE_SPAN = re.compile(r"`[^`]*`")

def convert_line(line):
    spans = [(m.start(), m.end()) for m in CODE_SPAN.finditer(line)]
    def inside_code(pos):
        return any(a <= pos < b for a, b in spans)
    def repl(m):
        body = m.group(1)
        if inside_code(m.start()) or body in KEEP or body.startswith("template:"):
            return m.group(0)
        counts["converted"] += 1
        return "[YOUR_VALUE_HERE: " + body + "]"
    return HINT.sub(repl, line)

path = sys.argv[1]
counts = {"converted": 0}
out, in_fence = [], False
for line in open(path, encoding="utf-8").read().split("\n"):
    if re.match(r"^\s*(```|~~~)", line):
        in_fence = not in_fence
        out.append(line)
        continue
    out.append(line if in_fence else convert_line(line))
open(path, "w", encoding="utf-8").write("\n".join(out))
print(f"converted {counts['converted']} in {path}")
