#!/usr/bin/env python3
"""Two-version plugin load oracle.

Usage: oracle.py <v1|v2> <checkout-root> <out-json> <db-dir>

v1: starts a private `opencode serve` on a throwaway database, reads the
    plugin-registered tool ids from GET /experimental/tool/ids, and stops it.
v2: starts a private `opencode2 serve` on a throwaway database, reads the
    server password from its log (never printed or written), polls
    GET /api/plugin for the checkout until the entries settle, keeps only the
    entries whose source path sits under <checkout-root>/.opencode/plugins,
    and stops it.
Neither touches the shared v2 background service.
"""
import json
import os
import re
import signal
import socket
import subprocess
import sys
import time
import urllib.request


def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def start(cmd, env, cwd, log_path):
    log = open(log_path, 'w')
    proc = subprocess.Popen(cmd, env=env, cwd=cwd, stdin=subprocess.DEVNULL,
                            stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
    return proc, log


def stop(proc):
    try:
        os.killpg(proc.pid, signal.SIGTERM)
        proc.wait(timeout=10)
    except Exception:
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except Exception:
            pass


def wait_for(pattern, log_path, timeout=60):
    deadline = time.time() + timeout
    while time.time() < deadline:
        text = open(log_path, errors='replace').read()
        m = re.search(pattern, text)
        if m:
            return m
        time.sleep(0.5)
    raise SystemExit(f'timed out waiting for {pattern!r} in {log_path}')


def v1(root, out, db_dir):
    port = free_port()
    env = dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'oracle-v1.db'))
    log_path = os.path.join(db_dir, 'oracle-v1-serve.log')
    proc, log = start(['opencode', 'serve', '--port', str(port)], env, root, log_path)
    try:
        ids = None
        deadline = time.time() + 90
        while time.time() < deadline:
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}/experimental/tool/ids', timeout=30) as r:
                    ids = json.load(r)
                break
            except Exception:
                time.sleep(1)
        if ids is None:
            raise SystemExit('v1 serve never answered /experimental/tool/ids')
        json.dump({'version': 'v1', 'tool_ids': ids}, open(out, 'w'), indent=1)
        print(json.dumps({'version': 'v1', 'tool_ids': len(ids)}))
    finally:
        stop(proc)
        log.close()


def v2(root, out, db_dir):
    port = free_port()
    env = dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'oracle-v2.db'))
    log_path = os.path.join(db_dir, 'oracle-v2-serve.log')
    extra = os.environ.get('ORACLE_V2_SERVE_ARGS', '').split()
    proc, log = start(['opencode2', *extra, 'serve', '--port', str(port)], env, root, log_path)
    try:
        password = wait_for(r'server password (\S+)', log_path).group(1)
        api_env = dict(os.environ, OPENCODE_PASSWORD=password)
        prefix = os.path.join(os.path.realpath(root), '.opencode', 'plugins') + os.sep
        mine, last, stable = [], None, 0
        deadline = time.time() + 180
        while time.time() < deadline:
            res = subprocess.run(
                ['opencode2', 'api', '--server', f'http://127.0.0.1:{port}', 'GET',
                 f'/api/plugin?location[directory]={root}'],
                env=api_env, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=60)
            try:
                data = json.loads(res.stdout).get('data', [])
            except Exception:
                data = []
            mine = [e for e in data if os.path.abspath(e.get('source', {}).get('path', '') or '/').startswith(prefix)]
            sig = sorted((e['source']['path'], e.get('state', {}).get('status')) for e in mine)
            settled = mine and not any(e.get('state', {}).get('status') in ('loading', 'pending') for e in mine)
            stable = stable + 1 if settled and sig == last else 0
            last = sig
            if stable >= 2:
                break
            time.sleep(2)
        rows = [{'name': os.path.basename(e['source']['path']).removesuffix('.js'),
                 'status': e.get('state', {}).get('status'),
                 'error': e.get('state', {}).get('error')} for e in mine]
        rows.sort(key=lambda r: r['name'])
        json.dump({'version': 'v2', 'plugins': rows}, open(out, 'w'), indent=1)
        counts = {}
        for r in rows:
            counts[r['status']] = counts.get(r['status'], 0) + 1
        print(json.dumps({'version': 'v2', 'entries': len(rows), 'by_status': counts}))
    finally:
        stop(proc)
        log.close()


if __name__ == '__main__':
    mode, root, out, db_dir = sys.argv[1:5]
    os.makedirs(db_dir, exist_ok=True)
    {'v1': v1, 'v2': v2}[mode](os.path.realpath(root), out, db_dir)
