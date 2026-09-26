import dis, sys
src = '''def k(a, b, c, xs, f):
    if a:
        r = 1
    elif b and c:
        r = 2
    else:
        r = 3
    while a:
        a = f()
    else:
        r = 4
    if (m := f()) and m.x:
        r = 5
    if (a if b else c):
        r = 6
    if a in xs and b is not None:
        r = 7
    if not (a and b):
        r = 8
    x = 1 if a else 2
    if a: r = 9
    return r
'''
code = compile(src, "p.py", "exec"); lines = src.splitlines()
co = [c for c in code.co_consts if hasattr(c, "co_code")][0]
br = {b[0]: b for b in co.co_branches()}
for ins in dis.get_instructions(co):
    if ins.offset in br:
        p = ins.positions
        seg = lines[p.lineno-1].encode()[p.col_offset:p.end_col_offset].decode() if p.lineno == p.end_lineno else "?"
        print(f"{ins.offset:4} {ins.opname:20} L{p.lineno}:{p.col_offset}-{p.end_col_offset} {seg!r} -> {br[ins.offset][1:]}")
