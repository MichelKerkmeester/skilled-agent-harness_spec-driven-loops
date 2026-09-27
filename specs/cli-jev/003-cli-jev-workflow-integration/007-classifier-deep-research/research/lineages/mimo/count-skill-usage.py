#!/usr/bin/env python3
"""Skill/command usage counts over the transcripts. Command and skill NAMES only.

Counts tool_use invocations and command-name occurrences for the sk-prompt and
sk-design families. Never prints prompt text, reply text, or any content; a
pattern is counted, never echoed. Cut-off applied. Main-session and subagent
files are reported apart.
"""

import json, glob, os, re
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'

PATTERNS = {
    'prompt-improve-cmd': '/prompt:improve',
    'prompt-family-cmd': '/prompt:',
    'prompt-improver-name': 'prompt-improver',
    'sk-prompt-name': 'sk-prompt',
    'design-cmd': '/design',
    'sk-design-name': 'sk-design',
    'TEXT-ENHANCE-name': 'TEXT_ENHANCE',
}


def scan(fp, t):
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
            rtype = rec.get('type')
            msg = rec.get('message')
            if rtype == 'assistant' and isinstance(msg, dict):
                for block in (msg.get('content') or []):
                    if isinstance(block, dict) and block.get('type') == 'tool_use':
                        t['tool_use_total'] += 1
                        name = block.get('name', '')
                        inp = block.get('input') or {}
                        if name == 'Skill':
                            sname = str(inp.get('skill', inp.get('skillName', '')))
                            for key, pat in PATTERNS.items():
                                if pat in sname:
                                    t['skill_tool_' + key] += 1
                        if name == 'Bash':
                            cmd = str(inp.get('command', ''))
                            for key, pat in PATTERNS.items():
                                if pat in cmd:
                                    t['bash_cmd_' + key] += 1
            elif rtype == 'user' and isinstance(msg, dict):
                content = msg.get('content')
                text = content if isinstance(content, str) else json.dumps(content or '')
                for key, pat in PATTERNS.items():
                    n = text.count(pat)
                    if n:
                        t['user_mentions_' + key] += n
                        t['user_records_' + key] += 1


def main():
    main_t = defaultdict(int)
    sub_t = defaultdict(int)
    main_files = sorted(glob.glob(os.path.join(TX, '*.jsonl')))
    sub_files = sorted(glob.glob(os.path.join(TX, '*', 'subagents', '*.jsonl')))
    for fp in main_files:
        scan(fp, main_t)
    for fp in sub_files:
        scan(fp, sub_t)
    for tag, t in (('main', main_t), ('subagent', sub_t)):
        print(f'== {tag} (files={len(main_files) if tag == "main" else len(sub_files)})')
        print(f"tool_use_total={t['tool_use_total']}")
        for key in PATTERNS:
            print(f"{key}: skill_tool={t['skill_tool_' + key]}"
                  f" bash_cmd={t['bash_cmd_' + key]}"
                  f" user_mentions={t['user_mentions_' + key]}"
                  f" user_records={t['user_records_' + key]}")


if __name__ == '__main__':
    main()
