#!/usr/bin/env python3
"""Rename the skills section, give the hook paragraph its own section, renumber
the sections after it and repoint section references. Byte-exact for moved text.

usage: outline_move.py plan|apply <repo root> <phase scratch dir>
"""
import hashlib
import os
import re
import sys

MODE, ROOT, SCRATCH = sys.argv[1], sys.argv[2], sys.argv[3]
AGENTS = ["ai-council", "code", "context", "debug", "deep-research", "deep-review",
          "design", "markdown", "orchestrate", "prompt-improver", "review"]
# The number the new hook section takes. Sections with this number or higher move up by one.
HOOK_AT = {"ai-council": 18, "code": 4, "context": 3, "debug": 3, "deep-research": 3,
           "deep-review": 3, "design": 3, "orchestrate": 3, "prompt-improver": 3, "review": 4}
HEAD = re.compile(r"^## (\d+)\. (.+)$")
REF = re.compile(r"(§ ?|[Ss]ections? )(\d+)")
HOOK_TITLE = "HOOK-INJECTED CONTEXT ROUTING"


def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()[:16]


def sections(lines):
    return {int(m.group(1)): m.group(2) for m in (HEAD.match(l) for l in lines) if m}


def is_external(line, start):
    before = line[:start].rstrip().rstrip("`").rstrip()
    return before.endswith((".md", "of the mode", "floor table of", "the mode's"))


def find_refs(name, lines):
    refs = []
    for i, line in enumerate(lines):
        if HEAD.match(line):
            continue
        for m in REF.finditer(line):
            refs.append({"line": i, "num": int(m.group(2)), "text": m.group(0),
                         "external": is_external(line, m.start()),
                         "cross": name == "orchestrate" and "`code.md` §" in line[:m.end()] and line[:m.start()].rstrip().endswith("`code.md`")})
    return refs


def hook_paragraph(lines):
    start = next(i for i, l in enumerate(lines) if l.startswith("**Hook-Injected Advisor Context**"))
    end = start
    while lines[end] != "":
        end += 1
    return start, end  # end is the blank line after the paragraph


def bump(match, low, high=None):
    n = int(match.group(2))
    if n >= low and (high is None or n <= high):
        return match.group(1) + str(n + 1)
    return match.group(0)


def transform(name, lines):
    """Returns (new lines, moved block record)."""
    if name == "markdown":
        s = next(i for i, l in enumerate(lines) if l == "## 7. " + HOOK_TITLE)
        e = next(i for i, l in enumerate(lines) if l.startswith("## 8. "))
        block = lines[s:e]  # heading, body, rule, blank
        rest = lines[:s] + lines[e:]
        out = []
        for l in rest:
            m = HEAD.match(l)
            if m and int(m.group(1)) == 2 and m.group(2).upper() == "ROUTING SCAN":
                l = "## 2. CAPABILITY SCAN"
            elif m and 4 <= int(m.group(1)) <= 6:
                l = "## %d. %s" % (int(m.group(1)) + 1, m.group(2))
            elif not m:
                l = rewrite_refs(name, l, 4, 6)
            out.append(l)
        at = next(i for i, l in enumerate(out) if l.startswith("## 5. COMMAND TEMPLATE MAP"))
        moved = ["## 4. " + HOOK_TITLE] + block[1:]
        return out[:at] + moved + out[at:], {"old": (s + 1, e), "body": "\n".join(block[1:]), "new_body": "\n".join(moved[1:])}
    k = HOOK_AT[name]
    ps, pe = hook_paragraph(lines)
    para = lines[ps:pe]
    rest = lines[:ps] + lines[pe + 1:]
    out = []
    for l in rest:
        m = HEAD.match(l)
        if m:
            n, title = int(m.group(1)), m.group(2)
            if title.upper() == "ROUTING SCAN":
                title = "CAPABILITY SCAN"
            if name == "debug" and title == "RESPONSE FORMAT":
                title = "OUTPUT FORMAT"
            if n >= k:
                n += 1
            l = "## %d. %s" % (n, title)
        else:
            l = rewrite_refs(name, l, k, None)
        out.append(l)
    at = next(i for i, l in enumerate(out) if HEAD.match(l) and int(HEAD.match(l).group(1)) == k + 1)
    new = ["## %d. %s" % (k, HOOK_TITLE), ""] + para + ["", "---", ""]
    return out[:at] + new + out[at:], {"old": (ps + 1, pe), "body": "\n".join(para), "new_body": "\n".join(para)}


def rewrite_refs(name, line, low, high):
    def repl(m):
        if is_external(line, m.start()):
            if name == "orchestrate" and line[:m.start()].rstrip().endswith("`code.md`"):
                return bump(m, HOOK_AT["code"])
            return m.group(0)
        return bump(m, low, high)
    return REF.sub(repl, line)


def read(tree, name):
    return open(os.path.join(ROOT, tree, "agents", name + ".md")).read().split("\n")


def norm(title):
    return {"ROUTING SCAN": "CAPABILITY SCAN", "RESPONSE FORMAT": "OUTPUT FORMAT"}.get(title.upper(), title)


parity = ["# Move parity: each block that moves into its own section", "",
          "## Each bullet names the file, the old line range and a hash of the block's text without its heading", ""]
refs_out = ["# Section references in the agent files and what each one points at", "",
            "## Each bullet names the file, the reference as written before the move and the section it meant", ""]
ok = True
for name in AGENTS:
    before = read(".skilled", name)
    after, rec = transform(name, before)
    twin_before = read(".claude", name)
    twin_after, twin_rec = transform(name, twin_before)
    kind = "Hook-Injected section" if name == "markdown" else "Hook-Injected Advisor Context paragraph"
    same = rec["body"] == rec["new_body"] and sha(rec["body"]) == sha(twin_rec["body"])
    result = "pending" if MODE == "plan" else ("identical apart from heading" if same else "DIFFERS")
    ok = ok and same
    parity.append("- `%s.md` lines %d to %d, %s, sha256 %s: %s" % (name, rec["old"][0], rec["old"][1], kind, sha(rec["body"]), result))
    old_secs, new_secs = sections(before), sections(after)
    old_refs, new_refs = find_refs(name, before), find_refs(name, after)
    assert len(old_refs) == len(new_refs), name
    for o, n in zip(old_refs, new_refs):
        if o["external"] and not o["cross"]:
            target, meant, now = "another file", None, None
        elif o["cross"]:
            cb, ca = read(".skilled", "code"), transform("code", read(".skilled", "code"))[0]
            meant, now = sections(cb).get(o["num"]), sections(ca).get(n["num"])
            target = "`code.md` " + str(meant)
        else:
            meant, now = old_secs.get(o["num"]), new_secs.get(n["num"])
            target = "own section " + str(meant)
        if meant is None and target != "another file":
            state = "pending" if MODE == "plan" else "DANGLING"
            ok = ok and MODE == "plan"
        elif target == "another file":
            state = "pending" if MODE == "plan" else "resolves"
            if n["text"] != o["text"]:
                state, ok = "CHANGED AN EXTERNAL REFERENCE", False
        else:
            good = norm(meant) == norm(now)
            ok = ok and good
            state = "pending" if MODE == "plan" else ("resolves" if good else "BROKEN")
        refs_out.append("- `%s.md` line %d, `%s`, %s, written `%s` after the move: %s" % (name, o["line"] + 1, o["text"], target, n["text"], state))
    if MODE == "apply":
        for tree, lines in ((".skilled", after), (".claude", twin_after)):
            open(os.path.join(ROOT, tree, "agents", name + ".md"), "w").write("\n".join(lines))
open(os.path.join(SCRATCH, "move-parity.md"), "w").write("\n".join(parity) + "\n")
open(os.path.join(SCRATCH, "section-refs.md"), "w").write("\n".join(refs_out) + "\n")
print("mode", MODE, "ok", ok, "blocks", len(AGENTS), "refs", len(refs_out) - 4)
sys.exit(0 if ok else 1)
