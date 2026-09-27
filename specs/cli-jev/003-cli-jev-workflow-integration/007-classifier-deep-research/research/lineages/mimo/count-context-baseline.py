#!/usr/bin/env python3
"""Counted context baseline over the operator's Claude Code transcripts.

Prints numbers and record-type names only. Never prints transcript content,
prompt text, reply text, tool arguments beyond file-path class labels, or any
private string. Deduplicates usage by message.id (usage repeats on every
content block of an assistant message). Classifies files as main-session or
subagent by the presence of isSidechain records. Honors the cut-off
2026-09-27T06:22Z: every record after it is excluded.
"""

import json, glob, os, sys
from collections import defaultdict

TX = os.path.expanduser(
    '~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public')
CUTOFF = '2026-09-27T06:22:00Z'
MAIN_TOOLS = ('Read', 'Grep', 'Glob', 'Bash')


def pct(values, q):
    if not values:
        return 0
    s = sorted(values)
    idx = min(len(s) - 1, int(round(q * (len(s) - 1))))
    return s[idx]


def path_class(p):
    """Classify a read path into a small label set; never returns the path."""
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
    """Mutable counters so the per-record handler can update plain ints."""

    def __init__(self):
        self.files_total = 0
        self.files_main = 0
        self.files_sub = 0
        self.records = 0
        self.records_after_cutoff = 0
        self.records_by_type = defaultdict(int)
        self.usage = defaultdict(list)
        self.tool_use_by_name = defaultdict(int)
        self.tool_calls_per_human_turn = []
        self.human_prompts = 0
        self.read_classes = defaultdict(int)
        self.read_count_total = 0
        self.reread_count = 0
        self.session_read_seen = {}
        self.bytes_tool_outputs = 0
        self.bytes_hook_context = 0
        self.bytes_system_content = 0
        self.bytes_attachment = 0
        self.hook_context_events = 0
        self.system_subtypes = defaultdict(int)
        self.assistant_records = 0
        self.unique_message_ids = 0
        self.seen_msg_ids = set()
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
            rtype = rec.get('type', 'unknown')
            t.records_by_type[rtype] += 1
            if rtype == 'system':
                t.system_subtypes[rec.get('subtype', 'none')] += 1
                c = rec.get('content')
                if isinstance(c, str):
                    t.bytes_system_content += len(c)
            if rtype == 'attachment':
                try:
                    t.bytes_attachment += len(json.dumps(rec.get('attachment')))
                except (TypeError, ValueError):
                    pass
            hc = rec.get('hookAdditionalContext')
            if isinstance(hc, str) and hc:
                t.hook_context_events += 1
                t.bytes_hook_context += len(hc)
            msg = rec.get('message')
            if not isinstance(msg, dict):
                continue
            if rtype == 'assistant':
                mid = msg.get('id')
                u = msg.get('usage')
                if isinstance(u, dict) and mid and mid not in t.seen_msg_ids:
                    t.seen_msg_ids.add(mid)
                    t.unique_message_ids += 1
                    for field in ('input_tokens', 'cache_read_input_tokens',
                                  'cache_creation_input_tokens', 'output_tokens'):
                        v = u.get(field)
                        if isinstance(v, (int, float)):
                            t.usage[field].append(v)
                    for block in (msg.get('content') or []):
                        if isinstance(block, dict) and block.get('type') == 'tool_use':
                            name = block.get('name', 'unknown')
                            t.tool_use_by_name[name] += 1
                            if name in MAIN_TOOLS:
                                pending += 1
                                if t.tool_calls_per_human_turn:
                                    t.tool_calls_per_human_turn[-1] += 1
                            if name == 'Read':
                                t.read_count_total += 1
                                p = (block.get('input') or {}).get('file_path')
                                t.read_classes[path_class(p)] += 1
                                if isinstance(p, str):
                                    if p in read_seen:
                                        t.reread_count += 1
                                    else:
                                        read_seen.add(p)
                else:
                    t.assistant_records += 1
            elif rtype == 'user':
                content = msg.get('content')
                blocks = content if isinstance(content, list) else []
                has_tool_result = any(
                    isinstance(b, dict) and b.get('type') == 'tool_result' for b in blocks)
                is_human = not has_tool_result and rec.get('toolUseResult') is None
                if is_human:
                    t.human_prompts += 1
                    t.tool_calls_per_human_turn.append(0)
                tr = rec.get('toolUseResult')
                if tr is not None:
                    try:
                        t.bytes_tool_outputs += len(json.dumps(tr))
                    except (TypeError, ValueError):
                        pass


def main():
    t = Tally()
    files = sorted(glob.glob(os.path.join(TX, '*.jsonl')))
    for fp in files:
        t.files_total += 1
        is_sub = False
        with open(fp) as fh:
            for line in fh:
                if '"isSidechain":true' in line or '"isSidechain": true' in line:
                    is_sub = True
                    break
        if is_sub:
            t.files_sub += 1
        else:
            t.files_main += 1
        handle(t, fp)

    out = []
    out.append('== corpus')
    out.append(f"files_total={t.files_total}")
    out.append(f"files_main_session={t.files_main}")
    out.append(f"files_subagent={t.files_sub}")
    out.append(f"records_in_scope={t.records}")
    out.append(f"records_excluded_after_cutoff={t.records_after_cutoff}")
    out.append('date_range_min=' + (min(t.timestamps) if t.timestamps else 'none'))
    out.append('date_range_max=' + (max(t.timestamps) if t.timestamps else 'none'))
    out.append('record_types=' + ','.join(
        f'{k}:{v}' for k, v in sorted(t.records_by_type.items())))
    out.append('== usage dedupe')
    out.append(f"assistant_records_seen={t.assistant_records + t.unique_message_ids}")
    out.append(f"unique_message_ids={t.unique_message_ids}")
    out.append('== per-assistant-turn token usage (deduped by message.id)')
    for field in ('input_tokens', 'cache_read_input_tokens',
                  'cache_creation_input_tokens', 'output_tokens'):
        vals = t.usage[field]
        out.append(f"{field}: n={len(vals)} p50={pct(vals, 0.5)} p95={pct(vals, 0.95)}"
                   f" max={max(vals) if vals else 0} sum={sum(vals)}")
    out.append('== tool calls')
    for name, n in sorted(t.tool_use_by_name.items(), key=lambda kv: -kv[1]):
        out.append(f"tool_use_{name}={n}")
    out.append('== tool calls per human prompt (Read/Grep/Glob/Bash until next human prompt)')
    out.append(f"human_prompts={t.human_prompts}")
    h = t.tool_calls_per_human_turn
    out.append(f"per_human_turn: n={len(h)} p50={pct(h, 0.5)} p95={pct(h, 0.95)}"
               f" max={max(h) if h else 0} sum={sum(h)}")
    out.append('== Read targets by class')
    out.append(f"read_total={t.read_count_total}")
    for cls, n in sorted(t.read_classes.items(), key=lambda kv: -kv[1]):
        out.append(f"read_class_{cls}={n}")
    out.append('== re-reads within one session file')
    out.append(f"reread_of_path_already_read={t.reread_count}")
    out.append('== system records by subtype')
    for k, v in sorted(t.system_subtypes.items(), key=lambda kv: -kv[1]):
        out.append(f"system_subtype_{k}={v}")
    out.append('== context byte shares by surface (serialized payload lengths)')
    surfaces = {
        'tool-outputs': t.bytes_tool_outputs,
        'hook-injected-context': t.bytes_hook_context,
        'system-record-content': t.bytes_system_content,
        'attachment-payloads': t.bytes_attachment,
    }
    total = sum(surfaces.values())
    for k, v in sorted(surfaces.items(), key=lambda kv: -kv[1]):
        share = (100.0 * v / total) if total else 0.0
        out.append(f"{k}: bytes={v} share_pct={share:.1f}")
    out.append(f"total_measured_bytes={total}")
    out.append(f"hook_context_events={t.hook_context_events}")
    print('\n'.join(out))


if __name__ == '__main__':
    main()
