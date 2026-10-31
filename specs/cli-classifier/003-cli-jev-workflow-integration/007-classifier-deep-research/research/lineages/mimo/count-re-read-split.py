#!/usr/bin/env python3
"""Re-read split and per-turn durations. Numbers only.

The steer requires re-reads be split before pricing: edit-preceding (the read
must precede an edit of the same file), post-compaction (a compact boundary sat
between the two reads of the same path), partial (the read carries offset or
limit), and remainder (waste candidates). Also extracts turn-duration stats
from system records carrying a duration field.
"""

import json, glob, os
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'


def pct(values, q):
    if not values:
        return 0
    s = sorted(values)
    idx = min(len(s) - 1, int(round(q * (len(s) - 1))))
    return s[idx]


def scan(fp):
    seen = {}            # path -> {'read_idx': i, 'compact_after': False, 'edited_later': False}
    edited_paths = defaultdict(list)
    reads = []           # (idx, path, partial)
    compact_at = []
    durations = []
    idx = 0
    records = []
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
            records.append(rec)
    for rec in records:
        idx += 1
        if rec.get('type') == 'system' and rec.get('subtype') == 'compact_boundary':
            compact_at.append(idx)
        if rec.get('type') == 'system':
            for key in ('durationMs', 'duration_ms', 'totalDuration'):
                v = rec.get(key)
                if isinstance(v, (int, float)) and v > 0:
                    durations.append(v)
                    break
        msg = rec.get('message')
        if not isinstance(msg, dict) or rec.get('type') != 'assistant':
            continue
        for block in (msg.get('content') or []):
            if not (isinstance(block, dict) and block.get('type') == 'tool_use'):
                continue
            name = block.get('name', '')
            inp = block.get('input') or {}
            if name == 'Read' and isinstance(inp.get('file_path'), str):
                partial = ('offset' in inp) or ('limit' in inp)
                reads.append((idx, inp['file_path'], partial))
            if name in ('Edit', 'Write') and isinstance(inp.get('file_path'), str):
                edited_paths[inp['file_path']].append(idx)
    out = defaultdict(int)
    for i, (ridx, path, partial) in enumerate(reads):
        prev = seen.get(path)
        if prev is None:
            seen[path] = {'read_idx': ridx, 'compact_between': False}
            continue
        # this is a re-read of path
        if partial:
            out['reread_partial'] += 1
        if any(prev['read_idx'] < c < ridx for c in compact_at):
            out['reread_post_compaction'] += 1
        edited_later = any(e > ridx for e in edited_paths.get(path, []))
        if edited_later:
            out['reread_edit_preceding'] += 1
        if not partial and not any(prev['read_idx'] < c < ridx for c in compact_at) \
                and not edited_later:
            out['reread_remainder'] += 1
        out['reread_total'] += 1
        seen[path] = {'read_idx': ridx, 'compact_between': False}
    return out, durations


def main():
    total = defaultdict(int)
    all_durations = []
    files = sorted(glob.glob(os.path.join(TX, '*.jsonl'))) + \
        sorted(glob.glob(os.path.join(TX, '*', 'subagents', '*.jsonl')))
    for fp in files:
        out, durations = scan(fp)
        for k, v in out.items():
            total[k] += v
        all_durations.extend(durations)
    print('== re-read split (main + subagent files combined)')
    for k in ('reread_total', 'reread_partial', 'reread_post_compaction',
              'reread_edit_preceding', 'reread_remainder'):
        print(f"{k}={total[k]}")
    print('== turn/system durations in ms')
    print(f"durations_n={len(all_durations)} p50={pct(all_durations, 0.5)}"
          f" p95={pct(all_durations, 0.95)} max={max(all_durations) if all_durations else 0}")


if __name__ == '__main__':
    main()
