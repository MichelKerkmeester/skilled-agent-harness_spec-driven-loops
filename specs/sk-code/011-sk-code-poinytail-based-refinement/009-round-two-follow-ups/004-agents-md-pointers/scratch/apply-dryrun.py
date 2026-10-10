# Applies the planned edits to the tree rooted at argv[1] and fails when any
# old string is missing or ambiguous, so it doubles as an executable copy of the
# exact edit text.
import sys, pathlib
root = pathlib.Path(sys.argv[1])

def sub(path, old, new):
    p = root / path
    s = p.read_text(encoding='utf8')
    assert s.count(old) == 1, (path, s.count(old), old[:60])
    p.write_text(s.replace(old, new), encoding='utf8')

# AGENTS.md section 10
sub('AGENTS.md',
"- **Close substantive turns with honest status:** what ran and what it returned, what is inferred, what only the operator can verify, and edited versus committed versus pushed versus dirty. Then name the one thing that is the operator's to do, or say nothing is.",
"- **Close substantive turns with honest status.** Then name the one thing that is the operator's to do, or say nothing is. What the status holds is listed in `.skilled/repo-rules/communication-handoff.md` §1, which Gate 6 loads before a turn ends.")

H = '.skilled/repo-rules/communication-handoff.md'
sub(H,
"The status `AGENTS.md` §10 and [`evidence-and-proof.md`](evidence-and-proof.md) §10 require\nreports what happened. The handback reports what happens next, and it is a different document.\n",
"""Every substantive turn ends with an honest status, a read-only turn included. `AGENTS.md` §10
requires it and this section lists what it holds. Say each part briefly:

1. **What ran or was read, and what it returned**, with the receipts from
   [`evidence-and-proof.md`](evidence-and-proof.md) §1.
2. **What is inferred** rather than observed.
3. **What only the operator can verify.**
4. **The state of the work:** edited / committed / pushed / dirty, and which branch.
5. **Known residual risk.** Any risk the operator must weigh before relying on the work, such as an untested path or a state that could not be checked. Write "none known" when there is none.

What was not done belongs in the status as well, and [`evidence-and-proof.md`](evidence-and-proof.md) §10
says how to report it. The status reports what happened. The handback reports what happens next,
and it is a different document.
""")
sub(H, "- [ ] The turn ends by naming what is the operator's to do, or by saying nothing is.\n",
"- [ ] The status names what ran, what is inferred, what only the operator can verify, the state of the work and any known residual risk. It says \"none known\" when there is none.\n- [ ] The turn ends by naming what is the operator's to do, or by saying nothing is.\n")
sub(H, "version: 1.6.0.4\n", "version: 1.6.0.5\n")

E = '.skilled/repo-rules/evidence-and-proof.md'
sub(E,
"""Every substantive turn ends with an honest status. Five things, briefly:

1. **What ran or was read, and what it returned**, with the receipts from §1.
2. **What is inferred** rather than observed.
3. **What only the operator can verify.**
4. **The state of the work:** edited / committed / pushed / dirty, and which branch.
5. **Known residual risk.** Any risk the operator must weigh before relying on the work, such as an untested path or a state that could not be checked. Write "none known" when there is none.
""",
"""Every substantive turn ends with an honest status. What it holds is listed once, in
[`communication-handoff.md`](communication-handoff.md) §1.
""")
sub(E, "version: 1.1.1.3\n", "version: 1.1.1.4\n")
print("applied")
