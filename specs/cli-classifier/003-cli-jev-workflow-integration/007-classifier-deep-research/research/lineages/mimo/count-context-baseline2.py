#!/usr/bin/env python3
"""Counted context baseline v2 over the operator's Claude Code transcripts.

Corrections over v1: tool_use blocks are counted across ALL records and
deduplicated by tool_use id (not by message.id); subagent transcripts under
<session>/subagents/ are walked and reported apart; attachment bytes are
bucketed by attachment.type so hook injection is a measured surface; Bash file
loads and path-class mentions are counted separately from Read tool calls.

Prints numbers and record-type names only. Honors the cut-off 2026-09-27T06:22Z.
"""

import json, glob, os
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'
MAIN_TOOLS = ('Read', 'Grep', 'Glob', 'Bash')
LOAD_CMDS = ('cat ', 'sed -n', 'head ', 'tail ', 'less ')


def pct(values, q):
    if not values:
        return 0
    s = sorted(values)
    idx = min(len(s) - 1, int(round(q * (len(s) - 1))))
    return s[idx]


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


class Tally:
    def __init__(self):
        self.files = 0
        self.records = 0
        self.records_after_cutoff = 0
        self.usage = defaultdict(list)
        self.seen_msg_ids = set()
        self.tool_use = defaultdict(int)          # name -> unique tool_use ids
        self.seen_tool_use_ids = set()
        self.read_classes = defaultdict(int)
        self.read_total = 0
        self.reread = 0
        self.session_read_seen = {}
        self.human_prompts = 0
        self.per_human_turn = []
        self.attachment_bytes = defaultdict(int)  # attachment.type -> bytes
        self.attachment_count = defaultdict(int)
        self.bash_mentions = defaultdict(int)     # path-class keyword mention
        self.bash_loads = defaultdict(int)        # cat/sed/head on a class
        self.timestamps = []


def handle(t, fp):
    pending = 0
    read_seen = t.session_read_seen.setdefault(fp, set())
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
                t.records_after_cutoff += 1
                continue
            if ts:
                t.timestamps.append(ts)
            t.records += 1
            if rec.get('type') == 'attachment':
                att = rec.get('attachment')
                atype = (att or {}).get('type', 'unknown') if isinstance(att, dict) else 'unknown'
                t.attachment_count[atype] += 1
                try:
                    t.attachment_bytes[atype] += len(json.dumps(att))
                except (TypeError, ValueError):
                    pass
            msg = rec.get('message')
            if not isinstance(msg, dict):
                continue
            if rec.get('type') == 'assistant':
                mid = msg.get('id')
                u = msg.get('usage')
                if isinstance(u, dict) and mid and mid not in t.seen_msg_ids:
                    t.seen_msg_ids.add(mid)
                    for field in ('input_tokens', 'cache_read_input_tokens',
                                  'cache_creation_input_tokens', 'output_tokens'):
                        v = u.get(field)
                        if isinstance(v, (int, float)):
                            t.usage[field].append(v)
                for block in (msg.get('content') or []):
                    if not (isinstance(block, dict) and block.get('type') == 'tool_use'):
                        continue
                    tuid = block.get('id')
                    if tuid is not None:
                        if tuid in t.seen_tool_use_ids:
                            continue
                        t.seen_tool_use_ids.add(tuid)
                    name = block.get('name', 'unknown')
                    t.tool_use[name] += 1
                    if name in MAIN_TOOLS:
                        pending += 1
                        if t.per_human_turn:
                            t.per_human_turn[-1] += 1
                    if name == 'Read':
                        t.read_total += 1
                        p = (block.get('input') or {}).get('file_path')
                        t.read_classes[path_class(p)] += 1
                        if isinstance(p, str):
                            if p in read_seen:
                                t.reread += 1
                            else:
                                read_seen.add(p)
                    if name == 'Bash':
                        cmd = (block.get('input') or {}).get('command')
                        if isinstance(cmd, str):
                            for cls, key in (('SKILL.md', 'SKILL.md'),
                                             ('ROUTER.md', 'ROUTER.md'),
                                             ('references', '/references/')):
                                if key in cmd:
                                    t.bash_mentions[cls] += 1
                                    if any(c in cmd for c in LOAD_CMDS):
                                        t.bash_loads[cls] += 1
            elif rec.get('type') == 'user':
                content = msg.get('content')
                blocks = content if isinstance(content, list) else []
                has_tool_result = any(
                    isinstance(b, dict) and b.get('type') == 'tool_result' for b in blocks)
                is_human = not has_tool_result and rec.get('toolUseResult') is None
                if is_human:
                    t.human_prompts += 1
                    t.per_human_turn.append(0)


def main():
    t = Tally()
    files = sorted(glob.glob(os.path.join(TX, '*.jsonl')))
    sub_files = sorted(glob.glob(os.path.join(TX, '*', 'subagents', '*.jsonl')))
    nested_other = sorted(glob.glob(os.path.join(TX, '*', '*.jsonl')))
    for fp in files:
        t.files += 1
        handle(t, fp)
    sub_t = Tally()
    for fp in sub_files:
        sub_t.files += 1
        handle(sub_t, fp)

    def emit(t, tag):
        out.append(f'== corpus {tag}')
        out.append(f"files={t.files}")
        out.append(f"records_in_scope={t.records}")
        out.append(f"records_excluded_after_cutoff={t.records_after_cutoff}")
        out.append('date_min=' + (min(t.timestamps) if t.timestamps else 'none'))
        out.append('date_max=' + (max(t.timestamps) if t.timestamps else 'none'))
        out.append(f"unique_message_ids={len(t.seen_msg_ids)}")
        out.append('== per-assistant-turn usage (deduped by message.id)')
        for field in ('input_tokens', 'cache_read_input_tokens',
                      'cache_creation_input_tokens', 'output_tokens'):
            vals = t.usage[field]
            out.append(f"{field}: n={len(vals)} p50={pct(vals, 0.5)} p95={pct(vals, 0.95)}"
                       f" max={max(vals) if vals else 0} sum={sum(vals)}")
        out.append('== tool_use blocks (deduped by tool_use id, all records)')
        for name, n in sorted(t.tool_use.items(), key=lambda kv: -kv[1]):
            out.append(f"tool_use_{name}={n}")
        out.append('== tool calls per human prompt')
        out.append(f"human_prompts={t.human_prompts}")
        h = t.per_human_turn
        out.append(f"per_human_turn: n={len(h)} p50={pct(h, 0.5)} p95={pct(h, 0.95)}"
                   f" max={max(h) if h else 0} sum={sum(h)}")
        out.append('== Read targets by class')
        out.append(f"read_total={t.read_total}")
        for cls, n in sorted(t.read_classes.items(), key=lambda kv: -kv[1]):
            out.append(f"read_class_{cls}={n}")
        out.append('== re-reads within one session file')
        out.append(f"reread_of_path_already_read={t.reread}")
        out.append('== attachment bytes by type')
        for k, v in sorted(t.attachment_bytes.items(), key=lambda kv: -kv[1]):
            out.append(f"attachment_{k}: count={t.attachment_count[k]} bytes={v}")
        out.append('== Bash path-class mentions and loads (mentions != proven reads)')
        for cls in ('SKILL.md', 'ROUTER.md', 'references'):
            out.append(f"{cls}: bash_mentions={t.bash_mentions[cls]} bash_loadcmds={t.bash_loads[cls]}")

    out = []
    emit(t, 'main-session top-level files')
    emit(sub_t, 'subagent files under <session>/subagents/')
    out.append(f"nested_non_subagent_jsonl={len(nested_other) - len(sub_files)}")
    print('\n'.join(out))


if __name__ == '__main__':
    main()
