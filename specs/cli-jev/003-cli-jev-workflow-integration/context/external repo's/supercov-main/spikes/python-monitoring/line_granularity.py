import sys
mon = sys.monitoring; TOOL = 3
src = "def s(a):\n    if a: return 1\n    x = 1; y = 2\n    return x + y\n"
ns = {}; exec(compile(src, "line.py", "exec"), ns)
ev = []
mon.use_tool_id(TOOL, "l"); mon.register_callback(TOOL, mon.events.LINE, lambda code, line: ev.append((code.co_name, line)))
mon.set_events(TOOL, mon.events.LINE)
ns["s"](True); ns["s"](False)
exec("def dyn():\n    if 1:\n        pass\ndyn()", {})
mon.set_events(TOOL, 0); mon.free_tool_id(TOOL)
print("LINE events:", ev)
print("positions present:", next(iter(ns["s"].__code__.co_positions())))
