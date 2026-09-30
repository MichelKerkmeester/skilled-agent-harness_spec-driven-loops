#!/usr/bin/env python3
"""Tool-output byte buckets by producer class. Numbers only.

Buckets serialized toolUseResult payloads by: tool name, Read path class, and
Bash command class (load-command on a skill/reference path vs other). Answers
which share of tool-output bytes is skill/reference content. Cut-off applied.
"""

import json, glob, os
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'
LOAD_CMDS = ('cat ', 'sed -n', 'head ', 'tail ', 'less ')


def path_class(p):
    if not isinstance(p, str):
        return 'none'
    base = p.rsplit('/', 1)[-1]
    if base == 'SKILL.md':
        return 'SKILL.md'
    if base == 'ROUTER.md':
        return 'ROUTER.md'
    if '/references/' in p or p.startswith('references/'):
        return 'references'
    if base.endswith('.md'):
        return 'other-md'
    return 'other-file'


def main():
    by_tool = defaultdict(int)
    read_by_class = defaultdict(int)
    bash_by_class = defaultdict(int)
    files = sorted(glob.glob(os.path.join(TX, '*.jsonl'))) + \
        sorted(glob.glob(os.path.join(TX, '*', 'subagents', '*.jsonl')))
    # Map tool_use_id -> (tool name, class) then match tool_result payloads.
    for fp in files:
        tool_meta = {}
        with open(fp) as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    continue
                ts = rec.get('timestamp') or ''
                if ts and ts > CUTOFF:
                    continue
                msg = rec.get('message')
                if not isinstance(msg, dict):
                    continue
                if rec.get('type') == 'assistant':
                    for block in (msg.get('content') or []):
                        if isinstance(block, dict) and block.get('type') == 'tool_use':
                            inp = block.get('input') or {}
                            name = block.get('name', '')
                            cls = 'other-tool'
                            if name == 'Read':
                                cls = 'read-' + path_class(inp.get('file_path'))
                            elif name == 'Bash':
                                cmd = inp.get('command')
                                cmd = cmd if isinstance(cmd, str) else ''
                                if any(c in cmd for c in LOAD_CMDS):
                                    if 'SKILL.md' in cmd:
                                        cls = 'bash-load-SKILL.md'
                                    elif 'ROUTER.md' in cmd:
                                        cls = 'bash-load-ROUTER.md'
                                    elif '/references/' in cmd or 'references' in cmd:
                                        cls = 'bash-load-references'
                                    else:
                                        cls = 'bash-load-other'
                                else:
                                    cls = 'bash-other'
                            tool_meta[block.get('id')] = (name, cls)
                elif rec.get('type') == 'user':
                    for block in (msg.get('content') or []):
                        if isinstance(block, dict) and block.get('type') == 'tool_result':
                            tid = block.get('tool_use_id')
                            payload = block.get('content')
                            try:
                                n = len(json.dumps(payload))
                            except (TypeError, ValueError):
                                n = 0
                            name, cls = tool_meta.get(tid, ('unknown', 'unmatched'))
                            by_tool[name] += n
                            if cls.startswith('read-'):
                                read_by_class[cls] += n
                            if cls.startswith('bash-'):
                                bash_by_class[cls] += n
    total = sum(by_tool.values())
    print('== tool_result payload bytes by tool name')
    for k, v in sorted(by_tool.items(), key=lambda kv: -kv[1]):
        print(f"tool_{k}={v}")
    print(f"tool_total={total}")
    print('== Read result bytes by path class')
    for k, v in sorted(read_by_class.items(), key=lambda kv: -kv[1]):
        print(f"{k}={v}")
    skill_ref = sum(v for k, v in read_by_class.items()
                    if k in ('read-SKILL.md', 'read-ROUTER.md', 'read-references'))
    print(f"read_skill_reference_total={skill_ref}")
    print('== Bash result bytes by command class')
    for k, v in sorted(bash_by_class.items(), key=lambda kv: -kv[1]):
        print(f"{k}={v}")
    bash_load_skill = sum(v for k, v in bash_by_class.items()
                          if k in ('bash-load-SKILL.md', 'bash-load-ROUTER.md',
                                   'bash-load-references'))
    print(f"bash_load_skill_reference_total={bash_load_skill}")


if __name__ == '__main__':
    main()
