#!/usr/bin/env python3
"""Log every change to the live advisor's generation file while the scenario reruns go.

Read-only. Every 0.2 seconds it reads the generation file. On a change it records the new content and
every file the live daemon watches that was written in the 10 seconds before, so a CHANGED line in a
tester's teardown can be matched to its trigger.

Usage: gen-monitor.py <watched-files list> <output file> <stop file> [max minutes]
The watched-files list holds one absolute path per line, taken from the live daemon's open files.
"""
import datetime
import json
import os
import sys
import time

REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public'
GEN = os.path.join(REPO, '.skilled/skills/.state/advisor/skill-graph-generation.json')


def utc(ts):
    return datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).strftime('%H:%M:%S.%f')[:-3] + 'Z'


def read_gen():
    try:
        with open(GEN, encoding='utf-8') as fh:
            return fh.read()
    except OSError as exc:
        return f'unreadable: {exc}'


def main():
    watched_list, out_path, stop_path = sys.argv[1:4]
    max_minutes = float(sys.argv[4]) if len(sys.argv) > 4 else 60.0
    watched = [p for p in open(watched_list, encoding='utf-8').read().split('\n') if p and 'runtime/database' not in p]
    deadline = time.time() + max_minutes * 60
    last = read_gen()
    with open(out_path, 'a', encoding='utf-8') as out:
        out.write(f'# monitor start {utc(time.time())}, {len(watched)} watched source files\n')
        out.write(f'{utc(time.time())} baseline {json.dumps(json.loads(last)) if last.startswith("{") else last}\n')
        out.flush()
        while time.time() < deadline and not os.path.exists(stop_path):
            time.sleep(0.2)
            now_content = read_gen()
            if now_content == last:
                continue
            seen = time.time()
            last = now_content
            out.write(f'{utc(seen)} changed {json.dumps(json.loads(now_content)) if now_content.startswith("{") else now_content}\n')
            for path in watched:
                try:
                    mtime = os.stat(path).st_mtime
                except OSError:
                    continue
                if seen - 10 <= mtime <= seen:
                    out.write(f'    watched file written {utc(mtime)} {path.replace(REPO + "/", "")}\n')
            out.flush()
        out.write(f'# monitor stop {utc(time.time())}\n')


if __name__ == '__main__':
    main()
