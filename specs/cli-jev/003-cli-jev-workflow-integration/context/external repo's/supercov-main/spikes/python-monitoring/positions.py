import dis, sys, textwrap
print(sys.version)
src = textwrap.dedent('''
def f(a, b, c, xs):
    if a and (b or c):
        r = 1
    else:
        r = 2
    if not a:
        r += 1
    if a < b < c:
        r += 1
    v = a or b
    w = a if b else c
    while a and b:
        a = False
    for x in xs:
        if x and b:
            pass
    ys = [x for x in xs if x and c]
    assert a or b, "m"
    match a:
        case True if b and c:
            pass
        case _:
            pass
    return r
''')
code = compile(src, "spike.py", "exec")
fn = None
for c in code.co_consts:
    if hasattr(c, "co_code") and c.co_name == "f":
        fn = c
lines = src.splitlines()
print("co_branches:", hasattr(fn, "co_branches"))
branches = {b[0]: b for b in fn.co_branches()} if hasattr(fn, "co_branches") else {}
for ins in dis.get_instructions(fn):
    if ins.offset in branches:
        p = ins.positions
        seg = ""
        if p and p.lineno and p.col_offset is not None:
            line = lines[p.lineno-1]
            seg = line.encode()[p.col_offset:p.end_col_offset].decode() if p.end_lineno == p.lineno else line.encode()[p.col_offset:].decode()+"..."
        print(f"{ins.offset:4} {ins.opname:24} L{p.lineno}:{p.col_offset}-{p.end_col_offset}  {seg!r}  -> {branches[ins.offset][1:]}")
