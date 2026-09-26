import dis, sys
src = '''def h(xs, c, a, b):
    ys = [x for x in xs if x and c]
    zs = {k: v for k, v in xs if k or c}
    if not (a and b):
        return 1
    if not (a < b < c):
        return 2
    g = lambda q: q or c
    return 0
'''
code = compile(src, "c.py", "exec")
lines = src.splitlines()
def walk(co):
    br = {b[0]: b for b in co.co_branches()} if hasattr(co, "co_branches") else {}
    for ins in dis.get_instructions(co):
        if ins.opname.startswith("POP_JUMP") or ins.opname == "FOR_ITER" or ins.opname.startswith("JUMP_IF"):
            p = ins.positions
            seg = lines[p.lineno-1].encode()[p.col_offset:p.end_col_offset].decode() if p.lineno == p.end_lineno else "?"
            print(f"{co.co_name:8} {ins.offset:4} {ins.opname:20} L{p.lineno}:{p.col_offset}-{p.end_col_offset} {seg!r} {br.get(ins.offset, ('','','no-co_branches'))[1:]}")
    for k in co.co_consts:
        if hasattr(k, "co_code"): walk(k)
print(sys.version.split()[0]); walk([c for c in code.co_consts if hasattr(c, "co_code")][0])
