import sys, dis, itertools, asyncio, contextvars
mon = sys.monitoring; TOOL = 3
src = '''
def dec(a, b, c):
    if a and (b or c):
        return 1
    return 0

def rec(n, b):
    if (n > 0 and rec(n - 1, not b)) or b:
        return True
    return False

async def slow(v):
    await asyncio.sleep(0)
    return v

async def adec(a, b):
    if await slow(a) and await slow(b):
        return 1
    return 0
'''
ns = {"asyncio": asyncio}; exec(compile(src, "vec.py", "exec"), ns)
dec, rec, adec = ns["dec"], ns["rec"], ns["adec"]
# manifest: decision -> [(line, col, end_col, polarity_not_count)]
manifest = {
    "dec":  [(3, 7, 8, 0), (3, 14, 15, 0), (3, 19, 20, 0)],
    "rec":  [(8, 8, 13, 0), (8, 18, 36, 0), (8, 40, 41, 0)],
    "adec": [(17, 7, 20, 0), (17, 25, 38, 0)],
}
# Build per-code tables: offset -> (cond index, opcode_jumps_if_true, fallthrough, target); region offsets per cond.
tables = {}
for fn in (dec, rec, adec):
    co = fn.__code__; conds = manifest[co.co_name]
    regions = [set() for _ in conds]
    jumps = {}
    branch = {b[0]: b for b in co.co_branches()}
    for ins in dis.get_instructions(co):
        p = ins.positions
        for i, (l, c0, c1, _) in enumerate(conds):
            if p.lineno == l and c0 <= p.col_offset and p.end_col_offset <= c1:
                regions[i].add(ins.offset)
                if ins.offset in branch:
                    _, left, right = branch[ins.offset]
                    jumps[ins.offset] = (i, ins.opname.endswith("TRUE"), left, right)
    tables[id(co)] = (co.co_name, conds, regions, jumps)
ctx_stack = contextvars.ContextVar("stack")
vectors = []
def region_of(regions, dest):
    for j, r in enumerate(regions):
        if dest in r: return j
    return None
def cb(code, offset, dest):
    t = tables.get(id(code))
    if t is None: return
    name, conds, regions, jumps = t
    j = jumps.get(offset)
    if j is None: return
    index, jumps_if_true, left, right = j
    # fallthrough is whichever successor is the next instruction; 'left' is documented as such in co_branches ordering? infer by min offset > offset
    fallthrough = min(x for x in (left, right) if x > offset) if any(x > offset for x in (left, right)) else None
    taken = dest != fallthrough
    value = (jumps_if_true == taken) ^ bool(conds[index][3])
    try: stack = ctx_stack.get()
    except LookupError: stack = []; ctx_stack.set(stack)
    if not stack or stack[-1][0] is not code or index <= stack[-1][1]:
        stack.append([code, -1, [None]*len(conds)])
    frame = stack[-1]; frame[1] = index; frame[2][index] = value
    if region_of(regions, dest) is None:  # left the decision
        stack.pop(); vectors.append((name, tuple(frame[2])))
mon.use_tool_id(TOOL, "spike")
mon.register_callback(TOOL, mon.events.BRANCH_LEFT, cb)
mon.register_callback(TOOL, mon.events.BRANCH_RIGHT, cb)
mon.set_events(TOOL, mon.events.BRANCH_LEFT | mon.events.BRANCH_RIGHT)
for a, b, c in itertools.product([False, True], repeat=3):
    assert dec(a, b, c) == int(bool(a and (b or c)))
rec(2, False)
async def main():
    await asyncio.gather(adec(True, False), adec(True, True), adec(False, True))
asyncio.run(main())
mon.set_events(TOOL, 0); mon.free_tool_id(TOOL)
for v in vectors: print(v)
