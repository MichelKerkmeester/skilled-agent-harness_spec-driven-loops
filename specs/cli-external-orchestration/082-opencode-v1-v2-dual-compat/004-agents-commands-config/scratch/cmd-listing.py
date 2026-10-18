#!/usr/bin/env python3
"""Command listing on both hosts, model-free.

Usage: cmd-listing.py <root> <out> <db-dir>
v1: `opencode debug config` on a throwaway OPENCODE_DB; prints the command keys.
v2: a private `opencode2 serve` on a throwaway OPENCODE_DB; GET /api/command for
    the root; prints each command name. The server password is read from the log
    and never printed. Neither touches the shared v2 background service.
"""
import json, os, re, signal, socket, subprocess, sys, time

root, out, db_dir = sys.argv[1:4]
os.makedirs(db_dir, exist_ok=True)
lines = []

env1 = dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'v1.db'))
cfg_path = os.path.join(db_dir, 'v1-config.json')
with open(cfg_path, 'w') as fh:
    r = subprocess.run(['opencode', 'debug', 'config'], cwd=root, env=env1, stdin=subprocess.DEVNULL,
                       stdout=fh, stderr=subprocess.DEVNULL, timeout=180)
t = open(cfg_path).read()
cfg, _ = json.JSONDecoder().raw_decode(t[t.find('{'):])
v1 = sorted((cfg.get('command') or {}).keys())
lines += [f'## v1 opencode debug config: exit {r.returncode}, {len(v1)} commands'] + v1

with socket.socket() as s:
    s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]
env2 = dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'v2.db'))
log_path = os.path.join(db_dir, 'v2-serve.log')
log = open(log_path, 'w')
proc = subprocess.Popen(['opencode2', 'serve', '--port', str(port)], cwd=root, env=env2,
                        stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
try:
    pw = None
    for _ in range(120):
        m = re.search(r'server password (\S+)', open(log_path, errors='replace').read())
        if m: pw = m.group(1); break
        time.sleep(0.5)
    if not pw: raise SystemExit('v2 serve printed no password')
    api_env = dict(os.environ, OPENCODE_PASSWORD=pw)
    names, last, stable = [], None, 0
    for _ in range(60):
        res = subprocess.run(['opencode2', 'api', '--server', f'http://127.0.0.1:{port}', 'GET',
                              f'/api/command?location[directory]={root}'],
                             env=api_env, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=60)
        try:
            data = json.loads(res.stdout)
            data = data.get('data', data) if isinstance(data, dict) else data
            names = sorted(str(c.get('name') or c.get('id')) for c in data)
        except Exception:
            names = []
        stable = stable + 1 if names and names == last else 0
        last = names
        if stable >= 2: break
        time.sleep(2)
    lines += [f'## v2 GET /api/command: {len(names)} commands'] + names
finally:
    try: os.killpg(proc.pid, signal.SIGTERM); proc.wait(timeout=10)
    except Exception:
        try: os.killpg(proc.pid, signal.SIGKILL)
        except Exception: pass
    log.close()
open(out, 'w').write('\n'.join(lines) + '\n')
print(len(v1), len(names))
