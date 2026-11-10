#!/usr/bin/env python3
"""Per-agent browser, subagent and chrome_devtools rules from a v2 GET /api/agent dump.

Usage: v2-agent-extract.py <agents.json> <title line>
"""
import json, sys
d = json.load(open(sys.argv[1]))
print(sys.argv[2])
print('# Per agent: rule count, then the index and effect of each browser, subagent and chrome_devtools rule.')
for a in d:
    n = a.get('name') or a.get('id'); rules = a.get('permissions') or []
    pick = lambda act: [(i, r.get('effect')) for i, r in enumerate(rules) if r.get('action') == act]
    print(f"{n:16} rules={len(rules):3} browser={pick('browser')} subagent={pick('subagent')} chrome_devtools={pick('chrome_devtools')}")
