#!/usr/bin/env python3
"""Turns the crash test's fast and scan logs into a timeline relative to the kill.

Arguments: fast log, scan log, kill time in epoch seconds.
"""
import statistics
import sys

FAST, SCAN, KILL_AT = sys.argv[1], sys.argv[2], float(sys.argv[3])


def rows(path):
    with open(path, encoding="utf-8") as handle:
        lines = [line.rstrip("\n") for line in handle if line.strip() and not line.startswith("#")]
    head = lines[0].split("\t")
    return [dict(zip(head, line.split("\t"))) for line in lines[1:]]


fast = rows(FAST)
scans = rows(SCAN)
after = [r for r in fast if float(r["t"]) >= KILL_AT]


def rel(t):
    return f"+{float(t) - KILL_AT:.2f}s"


def first(pred, label):
    for r in after:
        if pred(r):
            print(f"{label}: {rel(r['t'])}")
            return float(r["t"])
    print(f"{label}: not seen")
    return None


gaps = [float(b["t"]) - float(a["t"]) for a, b in zip(fast, fast[1:])]
print(f"fast samples: {len(fast)}, from {rel(fast[0]['t'])} to {rel(fast[-1]['t'])}")
print(f"sample interval: median {statistics.median(gaps):.3f}s, max {max(gaps):.3f}s")
print(f"scans: {len(scans)}, median length "
      f"{statistics.median(float(s['ended']) - float(s['started']) for s in scans):.3f}s")
before = [r for r in fast if float(r["t"]) < KILL_AT]
if before:
    last = before[-1]
    print(f"last sample before the kill ({rel(last['t'])}): lease={last['lease']} socket={last['sock_files']} "
          f"daemon={last['daemon']} daemon holds: {last['daemon_sandbox_files']}")
print()
t_lease = first(lambda r: r["lease"] == "0" and r["owner"] == "0", "both lease files gone")
t_sock = first(lambda r: r["sock_files"] in ("-", "missing"), "socket folder empty")
t_db = first(lambda r: "skill-graph.sqlite" not in r["daemon_sandbox_files"], "daemon holds no skill-graph.sqlite")
t_none = first(lambda r: r["daemon_sandbox_files"] == "-", "daemon holds no sandbox path")
t_gone = first(lambda r: r["daemon"] == "gone", "daemon gone")
t_old = first(lambda r: r["old_pred"] == "0", "lease-and-socket test says not running")
t_new = first(lambda r: r["new_pred"] == "0", "test with the open-file clause says not running")
for s in scans:
    if float(s["started"]) >= KILL_AT and s["holders"] == "-":
        print(f"first empty open-file scan after the kill: started {rel(s['started'])}, ended {rel(s['ended'])}")
        break
print()
# The daemon's own open files come from the fast thread, so they are direct. The open-file scan result a
# fast sample carries can be up to one scan old, so the scan-based lag below is an upper bound, not a gap.
if t_old is not None and t_none is not None:
    if t_none > t_old:
        print(f"the daemon still held a sandbox path {t_none - t_old:.2f}s after the lease and socket were gone")
    else:
        print(f"no window: the daemon held no sandbox path {t_old - t_none:.2f}s before the lease and socket were gone")
if t_old is not None and t_new is not None:
    print(f"the scan-based test turned false {t_new - t_old:.2f}s after the lease-and-socket test (scan lag)")
if t_sock is not None and t_db is not None:
    order = "before" if t_sock < t_db else ("with" if t_sock == t_db else "after")
    print(f"the socket folder emptied {order} the database closed ({t_sock - t_db:+.2f}s after it)")
print()
changes = []
for r in fast:
    if not changes or changes[-1][1] != r["daemon_sandbox_files"]:
        changes.append((r["t"], r["daemon_sandbox_files"]))
print("what the sandbox daemon held open, each change:")
for t, files in changes:
    print(f"  {rel(t)}  {files}")
print()
lease_pids = sorted({r["live_lease_pid"] for r in fast})
launcher_states = sorted({r["live_launcher"] for r in fast})
daemon_states = sorted({r["live_daemon"] for r in fast})
print(f"live lease pid across all samples: {' '.join(lease_pids)}")
print(f"live launcher across all samples: {' '.join(launcher_states)}; live daemon: {' '.join(daemon_states)}")
