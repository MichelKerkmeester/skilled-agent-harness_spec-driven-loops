#!/usr/bin/env python3
"""Validator residue counts for the mimo lineage. Numbers and label names only.

Part 1 (transcripts): validator command runs and doc edits that follow a passing
run. Bounded method: every Bash tool_use whose command matches the validator
command set below; pass = the matching tool_result carries no error; window =
the next 6 assistant records in the same transcript file; an edit is a Write or
Edit tool_use whose file_path ends in .md.

Part 2 (review corpus): findings rows by Dimension cell, structural counting
(rows of a findings table with a severity cell), not phrase matching. Bounded
corpus: every *.md under specs/ whose path contains /review/ or /ai-council/,
excluding any path containing /context/ (vendored material) or /scratch/
(fixtures). Row shape: | ID | Severity | Dimension | Title | Evidence |.
"""

import json, glob, os, re, sys
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'
SPECS = 'specs'
VALIDATOR_RE = re.compile(r'validate\.sh|check-goal\.cjs|hvr_scan\.py|validate_document|extract_structure')
SEV_ROW_RE = re.compile(r'^\|\s*[^|]*\|\s*(P[0-2])\s*\|\s*([^|]*?)\s*\|')
MIMO_CATS = {
    'template-alignment': ('template', 'frontmatter', 'structure', 'alignment', 'format'),
    'voice': ('voice', 'tone', 'style', 'prose'),
    'factual-drift': ('factual', 'accuracy', 'drift', 'correctness', 'consistency'),
    'scope': ('scope', 'coverage', 'traceability'),
    'placeholders': ('placeholder', 'completeness', 'completeness'),
}


def part1():
    runs = 0
    runs_by_cmd = defaultdict(int)
    passes = 0
    pass_then_edit = 0
    edit_events = 0
    sessions_with_pattern = 0
    files = sorted(glob.glob(os.path.join(TX, '*.jsonl'))) + \
        sorted(glob.glob(os.path.join(TX, '*', 'subagents', '*.jsonl')))
    for fp in files:
        pending = []          # in-flight validator runs with a 5-assistant-record window
        found_any = False
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
                    blocks = msg.get('content') or []
                    for p in pending:
                        p['left'] -= 1
                    pending = [p for p in pending if p['left'] > 0]
                    for block in blocks:
                        if not isinstance(block, dict):
                            continue
                        if block.get('type') == 'tool_use':
                            name = block.get('name', '')
                            inp = block.get('input') or {}
                            if name == 'Bash' and isinstance(inp.get('command'), str):
                                cmd = inp['command']
                                if VALIDATOR_RE.search(cmd):
                                    runs += 1
                                    found_any = True
                                    label = ('validate.sh' if 'validate.sh' in cmd else
                                             'check-goal.cjs' if 'check-goal.cjs' in cmd else
                                             'hvr_scan.py' if 'hvr_scan' in cmd else
                                             'other-validator')
                                    runs_by_cmd[label] += 1
                                    pending.append({'id': block.get('id'), 'left': 6,
                                                    'label': label})
                            if name in ('Edit', 'Write'):
                                fp_in = inp.get('file_path')
                                if isinstance(fp_in, str) and fp_in.endswith('.md'):
                                    for p in pending:
                                        if p.get('passed') and not p.get('edited'):
                                            p['edited'] = True
                                            pass_then_edit += 1
                                            edit_events += 1
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
        if found_any:
            sessions_with_pattern += 1
    print('== part1 validator runs in transcripts (command names and pass flags only)')
    print(f"validator_runs={runs}")
    for k, v in sorted(runs_by_cmd.items(), key=lambda kv: -kv[1]):
        print(f"runs_{k}={v}")
    print(f"runs_passing={passes}")
    print(f"passing_runs_followed_by_md_edit_within_5_assistant_records={pass_then_edit}")
    print(f"md_edits_counted_in_window={edit_events}")
    print(f"transcript_files_containing_a_validator_run={sessions_with_pattern}")


def part2():
    files = []
    for root, _dirs, names in os.walk(SPECS):
        if '/context/' in root + '/' or '/scratch/' in root + '/':
            continue
        if '/review/' in root + '/' or '/ai-council/' in root + '/':
            for n in names:
                if n.endswith('.md'):
                    files.append(os.path.join(root, n))
    dims = defaultdict(int)
    sev = defaultdict(int)
    rows = 0
    for fp in files:
        with open(fp, errors='replace') as fh:
            for line in fh:
                m = SEV_ROW_RE.match(line)
                if m:
                    rows += 1
                    sev[m.group(1)] += 1
                    dims[m.group(2).lower() or 'none'] += 1
    print('== part2 review-corpus findings rows by Dimension cell')
    print(f"corpus_files={len(files)}")
    print(f"findings_rows={rows}")
    for k, v in sorted(sev.items()):
        print(f"severity_{k}={v}")
    for k, v in sorted(dims.items(), key=lambda kv: -kv[1]):
        print(f"dimension_{k}={v}")
    print('== mimo category rollup (dimension-name groups)')
    for cat, needles in MIMO_CATS.items():
        total = sum(v for k, v in dims.items() if any(n in k for n in needles))
        print(f"category_{cat}={total}")


if __name__ == '__main__':
    part1()
    part2()
