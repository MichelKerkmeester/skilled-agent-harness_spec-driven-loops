#!/usr/bin/env python3
"""Validator residue v2: invocations only, edits under the validated folder.

Corrections over count-validator-residue.py (the lead's defects): the validator
regex matches an actual invocation (a program path ending in a validator script
name at a command boundary), not any Bash command that mentions one; and a
follow-up edit only counts when its .md path sits under a folder the validator
command named. Numbers only.

Window: the next 6 assistant records after a passing (non-error) run.
"""

import json, glob, os, re
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'

INVOKE_RE = re.compile(
    r'(?:^|[;&|]\s*)(?:sudo\s+)?(?:node|npx|python3?|bash|sh)?\s*'
    r'\S*/?(?:validate\.sh|check-goal\.cjs|hvr_scan\.py|validate_document\.py|'
    r'extract_structure\.py|quick_validate\.py|validate_skill_package\.py)'
    r'(?:\s|$)')
FOLDER_RE = re.compile(r'(?:^|\s)(specs/\S+|\./\S+|\S+/\S+/)(?=\s|$)')
PATH_TOKEN_RE = re.compile(r'(specs/[^\s\'"`)<>]+|[.][^\s\'"`)<>]+/[^\s\'"`)<>]+)')


def main():
    runs = 0
    runs_with_folder = 0
    passes = 0
    pass_then_edit_under_folder = 0
    edits_any_md = 0
    files = sorted(glob.glob(os.path.join(TX, '*.jsonl'))) + \
        sorted(glob.glob(os.path.join(TX, '*', 'subagents', '*.jsonl')))
    for fp in files:
        pending = []
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
                rtype = rec.get('type')
                if rtype == 'assistant':
                    for p in pending:
                        p['left'] -= 1
                    pending = [p for p in pending if p['left'] > 0]
                    for block in (msg.get('content') or []):
                        if not (isinstance(block, dict) and block.get('type') == 'tool_use'):
                            continue
                        name = block.get('name', '')
                        inp = block.get('input') or {}
                        if name == 'Bash' and isinstance(inp.get('command'), str):
                            cmd = inp['command']
                            if INVOKE_RE.search(cmd):
                                runs += 1
                                tokens = PATH_TOKEN_RE.findall(cmd)
                                folders = [t.rstrip('/') for t in tokens]
                                if folders:
                                    runs_with_folder += 1
                                pending.append({'id': block.get('id'), 'left': 6,
                                                'folders': folders, 'passed': False})
                        if name in ('Edit', 'Write'):
                            fp_in = inp.get('file_path')
                            if isinstance(fp_in, str) and fp_in.endswith('.md'):
                                for p in pending:
                                    if p.get('passed') and not p.get('edited'):
                                        if any(fp_in.startswith(f + '/') or fp_in == f
                                               for f in p['folders']):
                                            p['edited'] = True
                                            pass_then_edit_under_folder += 1
                                        else:
                                            edits_any_md += 1
                                        break
                elif rtype == 'user':
                    for block in (msg.get('content') or []):
                        if isinstance(block, dict) and block.get('type') == 'tool_result':
                            tid = block.get('tool_use_id')
                            for p in pending:
                                if p.get('id') == tid:
                                    if block.get('is_error') is not True:
                                        passes += 1
                                        p['passed'] = True
                                    else:
                                        p['left'] = 0
    print('== validator residue v2 (invocations only, edits under validated folder)')
    print(f"validator_invocations={runs}")
    print(f"invocations_with_folder_token={runs_with_folder}")
    print(f"passing_invocations={passes}")
    print(f"passing_followed_by_md_edit_under_validated_folder={pass_then_edit_under_folder}")
    print(f"passing_followed_by_md_edit_elsewhere={edits_any_md}")


if __name__ == '__main__':
    main()
