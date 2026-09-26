import sys, dis
mon = sys.monitoring; TOOL = 3
def dec(a, b, c):
    if a and (b or c):
        return 1
    return 0
co = dec.__code__
# enumerate branch instructions with dis on 3.12/3.13 (no co_branches)
ins_list = list(dis.get_instructions(co))
for k, ins in enumerate(ins_list):
    if ins.opname.startswith("POP_JUMP") or ins.opname == "FOR_ITER":
        nxt = ins_list[k+1].offset
        target = ins.argval
        p = ins.positions
        print(f"{ins.offset:4} {ins.opname:20} L{p.lineno}:{p.col_offset}-{p.end_col_offset} fallthrough={nxt} target={target}")
events = []
def cb(code, offset, dest): events.append((offset, dest))
mon.use_tool_id(TOOL, "s"); mon.register_callback(TOOL, mon.events.BRANCH, cb); mon.set_events(TOOL, mon.events.BRANCH)
dec(True, False, True); dec(False, True, True)
mon.set_events(TOOL, 0); mon.free_tool_id(TOOL)
print(sys.version.split()[0], "BRANCH events (offset,dest):", events)
