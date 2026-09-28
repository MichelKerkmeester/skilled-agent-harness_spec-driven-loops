#!/usr/bin/env python3
"""Samples a sandbox advisor whose launcher crashed, until its daemon exits.

The fast thread samples every 0.1 seconds: the sandbox lease files, the sandbox socket folder, whether the
sandbox daemon is alive, which sandbox paths the daemon holds open, the pid the live lease names and whether
the live launcher and daemon are alive. The scan thread runs `lsof -t +D` over the sandbox back to back, which
is the teardown's open-file clause and takes longer than 0.1 seconds. Both only read. Neither sends a signal.

Arguments: sandbox, sandbox daemon pid, live lease path, live launcher pid, live daemon pid, fast log, scan log.
"""
import json
import os
import subprocess
import sys
import threading
import time

SANDBOX, DAEMON, LIVE_LEASE, LIVE_LAUNCHER, LIVE_DAEMON, FAST_LOG, SCAN_LOG = sys.argv[1:8]
REAL = os.path.realpath(SANDBOX)
LEASE = os.path.join(SANDBOX, "db", ".system-skill-advisor-launcher.json")
OWNER = os.path.join(SANDBOX, "db", ".skill-advisor-owner.json")
SOCK = os.path.join(SANDBOX, "sock")
INTERVAL = 0.1
AFTER_EXIT = 3.0
CAP = 150.0

stop = threading.Event()
last_scan = {"pids": None, "done_at": None}
lock = threading.Lock()


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def alive(pids):
    return set(run(["ps", "-p", ",".join(pids), "-o", "pid="]).split())


def daemon_paths():
    names = run(["lsof", "-a", "-p", DAEMON, "-Fn"]).splitlines()
    held = {n[1:] for n in names if n.startswith("n") and n[1:].startswith(REAL + "/")}
    return sorted(p[len(REAL) + 1:] for p in held)


def live_lease_pid():
    try:
        with open(LIVE_LEASE, encoding="utf-8") as handle:
            return str(json.load(handle).get("pid", "-"))
    except (OSError, ValueError):
        return "none"


def scan_loop():
    own = str(os.getpid())
    with open(SCAN_LOG, "w", encoding="utf-8") as log:
        log.write("started\tended\tholders\n")
        while not stop.is_set():
            started = time.time()
            pids = [p for p in run(["lsof", "-t", "+D", SANDBOX]).split() if p != own]
            ended = time.time()
            labels = []
            for pid in pids:
                cmd = run(["ps", "-o", "command=", "-p", pid]).strip()
                labels.append(f"{pid}:{'daemon' if pid == DAEMON else cmd[:60]}")
            with lock:
                last_scan["pids"] = pids
                last_scan["done_at"] = ended
            log.write(f"{started:.2f}\t{ended:.2f}\t{' '.join(labels) or '-'}\n")
            log.flush()


def fast_loop():
    exit_seen = None
    begun = time.time()
    with open(FAST_LOG, "w", encoding="utf-8") as log:
        log.write("t\tlease\towner\tsock_files\tdaemon\tdaemon_sandbox_files\tscan_holders\told_pred\tnew_pred"
                  "\tlive_lease_pid\tlive_launcher\tlive_daemon\n")
        while True:
            t = time.time()
            lease = os.path.exists(LEASE)
            owner = os.path.exists(OWNER)
            try:
                sock_files = sorted(os.listdir(SOCK))
            except OSError:
                sock_files = None
            up = alive([DAEMON, LIVE_LAUNCHER, LIVE_DAEMON])
            daemon_up = DAEMON in up
            files = daemon_paths() if daemon_up else []
            with lock:
                scan = last_scan["pids"]
            old = lease or bool(sock_files)
            new = old or bool(scan)
            log.write("\t".join([
                f"{t:.2f}", str(int(lease)), str(int(owner)),
                "missing" if sock_files is None else (",".join(sock_files) or "-"),
                "alive" if daemon_up else "gone",
                ",".join(files) or "-",
                "pending" if scan is None else (" ".join(scan) or "-"),
                str(int(old)), str(int(new)), live_lease_pid(),
                "alive" if LIVE_LAUNCHER in up else "gone",
                "alive" if LIVE_DAEMON in up else "gone",
            ]) + "\n")
            log.flush()
            if not daemon_up and exit_seen is None:
                exit_seen = t
            if exit_seen is not None and t - exit_seen >= AFTER_EXIT:
                break
            if t - begun >= CAP:
                log.write(f"# stopped at the {CAP:.0f}-second cap with the daemon still alive\n")
                break
            time.sleep(max(0.0, INTERVAL - (time.time() - t)))
    stop.set()


scanner = threading.Thread(target=scan_loop, daemon=True)
scanner.start()
fast_loop()
scanner.join(timeout=5)
