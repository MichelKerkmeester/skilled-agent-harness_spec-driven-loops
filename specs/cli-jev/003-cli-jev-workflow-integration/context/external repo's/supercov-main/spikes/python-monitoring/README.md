# Python `sys.monitoring` spike

Development-only scripts behind
`progress/python-sys-monitoring-spike-2026-09-02.md`. They need no third-party
packages. Run each against the interpreters under study:

```sh
for py in python3.14 python3.13 python3.12; do $py spikes/python-monitoring/positions_comprehensions.py; done
python3.14 spikes/python-monitoring/vectors.py
python3.14 spikes/python-monitoring/overhead.py
```

| Script | Question it answers |
| --- | --- |
| `positions.py` | Which source span does each conditional jump carry for boolean decisions, loops, match, assert, comprehensions? |
| `positions_control_flow.py` | Same for `elif`, `while/else`, walrus, ternary-in-condition, `in`/`is not None`, De Morgan `not (a and b)`. |
| `positions_comprehensions.py` | Inlined-comprehension filter jump positions across 3.12, 3.13, 3.14 (3.13+ stamp the element's span). |
| `vectors.py` | Exact MC/DC vector reconstruction from `BRANCH_LEFT/RIGHT` destination offsets, including recursion inside a condition and interleaved asyncio tasks. |
| `overhead.py` | Cost of always-on branch callbacks versus per-code-object local events and DISABLE after path exhaustion. |
| `branch_event_312.py` | 3.12/3.13 single `BRANCH` event plus `dis`-derived branch enumeration in place of `co_branches()`. |
| `line_granularity.py` | `LINE` events per statement on shared lines, visibility of `exec` code, and `-X no_debug_ranges`. |

These are exploration scripts, not conformance gates. The manifests inside
`vectors.py` are hand-written stand-ins for the Ruff-derived manifest.
