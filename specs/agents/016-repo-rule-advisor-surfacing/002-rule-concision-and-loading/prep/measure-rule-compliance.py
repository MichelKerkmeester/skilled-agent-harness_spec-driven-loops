#!/usr/bin/env python3
"""Measure how often long assistant replies break five communication-rule prohibitions,
split by whether the governing rule file had been read earlier in the same session.

Reads Claude Code session transcripts (JSONL) and prints aggregates only, so the output
can be shared without carrying any conversation content.

Usage: measure-rule-compliance.py <transcripts-dir> [max-sessions] [since-YYYY-MM-DD]

The since date drops sessions that started earlier, so a rule is only compared across
sessions that ran while it existed.
"""
import glob
import json
import os
import re
import sys

MIN_REPLY_CHARS = 400
TABLE = re.compile(r"^\s*\|.*\|\s*$\n^\s*\|[\s:|-]+\|\s*$", re.M)
FENCE = re.compile(r"```.*?```", re.S)
INLINE = re.compile(r"`[^`\n]*`")
OPENER = re.compile(r"^\s*(great question|let me |i'll now|i will now|sure[,!]|certainly[,!])", re.I)
LABEL_FIRST_LINE = re.compile(r"^\s*(#{1,6}\s|\*\*?[A-Z][^*\n]{0,40}:\*?\*?\s*$|[A-Z][A-Za-z ]{0,30}:\s*$)")

CHECKS = {
    # name: (governing rule file, predicate over the reply text)
    "table": ("communication.md", lambda t, p: bool(TABLE.search(t))),
    "empty_opener": ("communication.md", lambda t, p: bool(OPENER.search(t))),
    "label_first_line": ("communication.md", lambda t, p: bool(LABEL_FIRST_LINE.match(t.strip().splitlines()[0] if t.strip() else ""))),
    "em_dash": ("communication-prose.md", lambda t, p: "—" in p),
    "semicolon": ("communication-prose.md", lambda t, p: ";" in p),
}
DECAY_BUCKETS = [(1, 3), (4, 10), (11, 30), (31, 10**9)]


def prose_only(text):
    return INLINE.sub("", FENCE.sub("", text))


def session_start(path):
    for line in open(path, errors="ignore"):
        try:
            ts = json.loads(line).get("timestamp", "")
        except ValueError:
            continue
        if ts:
            return ts[:10]
    return ""


def reads_rule(block, rule):
    return block.get("type") == "tool_use" and f"repo-rules/{rule}" in json.dumps(block.get("input", {}))


def main():
    root = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    since_day = sys.argv[3] if len(sys.argv) > 3 else None
    files = sorted(glob.glob(os.path.join(root, "*.jsonl")), key=os.path.getmtime, reverse=True)[:limit]
    rules = sorted({rule for rule, _ in CHECKS.values()})
    # stats[check][state] = [replies, violations]; state in before/after/never
    stats = {name: {s: [0, 0] for s in ("before", "after", "never")} for name in CHECKS}
    decay = {name: {b: [0, 0] for b in DECAY_BUCKETS} for name in CHECKS}
    first_day, last_day, sessions = None, None, 0

    for path in files:
        if since_day and session_start(path) < since_day:
            continue
        sessions += 1
        replies = []  # (reply_text, {rule: replies_since_read or None})
        since = {rule: None for rule in rules}
        for line in open(path, errors="ignore"):
            try:
                obj = json.loads(line)
            except ValueError:
                continue
            ts = obj.get("timestamp", "")[:10]
            if ts:
                first_day = min(first_day or ts, ts)
                last_day = max(last_day or ts, ts)
            msg = obj.get("message", {})
            content = msg.get("content")
            if msg.get("role") != "assistant" or not isinstance(content, list):
                continue
            for block in content:
                for rule in rules:
                    if reads_rule(block, rule):
                        since[rule] = 0
            if any(b.get("type") == "tool_use" for b in content):
                continue
            text = "".join(b.get("text", "") for b in content if b.get("type") == "text")
            if len(text) < MIN_REPLY_CHARS:
                continue
            for rule in rules:
                if since[rule] is not None:
                    since[rule] += 1
            replies.append((text, dict(since)))
        ever = {rule: any(s[rule] is not None for _, s in replies) for rule in rules}
        for text, snap in replies:
            prose = prose_only(text)
            for name, (rule, test) in CHECKS.items():
                hit = test(text, prose)
                state = "after" if snap[rule] is not None else ("before" if ever[rule] else "never")
                stats[name][state][0] += 1
                stats[name][state][1] += hit
                if snap[rule] is not None:
                    for lo, hi in DECAY_BUCKETS:
                        if lo <= snap[rule] <= hi:
                            decay[name][(lo, hi)][0] += 1
                            decay[name][(lo, hi)][1] += hit

    pct = lambda n, v: f"{(100 * v / n):.1f}% of {n}" if n else "n/a"
    print(f"sessions={sessions} window={first_day}..{last_day} min_reply_chars={MIN_REPLY_CHARS}")
    for name, (rule, _) in CHECKS.items():
        s = stats[name]
        print(f"{name} [{rule}] before={pct(*s['before'])} after={pct(*s['after'])} never={pct(*s['never'])}")
        print("   decay after read: " + " | ".join(
            f"replies {lo}-{'+' if hi > 10**8 else hi}: {pct(*decay[name][(lo, hi)])}" for lo, hi in DECAY_BUCKETS))


if __name__ == "__main__":
    main()
