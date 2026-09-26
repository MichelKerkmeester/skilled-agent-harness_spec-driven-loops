import sys, time, json, dataclasses
mon = sys.monitoring; TOOL = 3; N = 1_000_000
@dataclasses.dataclass
class Item:
    name: str; qty: int; tags: list
def realistic(n):
    items = [Item(f"n{i}", i % 7, ["x", "y"] if i % 3 else []) for i in range(200)]
    out = 0
    for _ in range(n // 200):
        for it in items:
            if it.qty > 3 and (it.tags or it.name.endswith("0")):
                out += len(json.dumps(dataclasses.asdict(it)))
            else:
                out += it.qty
    return out
def branchy(n):
    total = 0
    for i in range(n):
        a = i & 1; b = i & 2; c = i & 4
        if a and (b or c): total += 1
        elif not a or c: total -= 1
    return total
def timeit(fn, label):
    t = time.perf_counter(); fn(N); d = time.perf_counter() - t
    return d
for fn in (realistic, branchy):
    base = timeit(fn, "")
    print(f"== {fn.__name__}: base {base*1000:.0f} ms")
    co = fn.__code__
    # per-offset list table: offset -> small int or None
    table = [None] * (len(co.co_code) + 2)
    for b in co.co_branches(): table[b[0]] = b[0]
    tables = {id(co): table}
    state = {}
    def cb_list(code, offset, dest):
        t = tables.get(id(code))
        if t is None: return
        j = t[offset]
        if j is None: return
        state[j] = dest
    mon.use_tool_id(TOOL, "b")
    BR = mon.events.BRANCH_LEFT | mon.events.BRANCH_RIGHT
    mon.register_callback(TOOL, mon.events.BRANCH_LEFT, cb_list); mon.register_callback(TOOL, mon.events.BRANCH_RIGHT, cb_list)
    mon.set_events(TOOL, BR); d = timeit(fn, ""); mon.set_events(TOOL, 0)
    print(f"  global BRANCH, list lookup            x{d/base:.2f}")
    mon.set_local_events(TOOL, co, BR); d = timeit(fn, ""); mon.set_local_events(TOOL, co, 0)
    print(f"  local BRANCH on this code only        x{d/base:.2f}")
    # exhaustion: DISABLE each location after it has been seen 8 times (stand-in for 'all paths observed')
    counts = {}
    def cb_exhaust(code, offset, dest):
        t = tables.get(id(code))
        if t is None: return
        k = (id(code), offset, dest); c = counts.get(k, 0) + 1; counts[k] = c
        if c >= 8: return mon.DISABLE
    mon.register_callback(TOOL, mon.events.BRANCH_LEFT, cb_exhaust); mon.register_callback(TOOL, mon.events.BRANCH_RIGHT, cb_exhaust)
    mon.set_local_events(TOOL, co, BR); d = timeit(fn, ""); mon.set_local_events(TOOL, co, 0)
    print(f"  local BRANCH + DISABLE after exhaustion x{d/base:.2f}")
    mon.free_tool_id(TOOL)
