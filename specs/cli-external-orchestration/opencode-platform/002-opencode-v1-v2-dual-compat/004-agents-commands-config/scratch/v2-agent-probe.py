#!/usr/bin/env python3
"""Dump v2 GET /api/agent for a checkout, model-free.

Usage: v2-agent-probe.py <root> <db-dir> <out-json>
Starts a private `opencode2 serve` on a throwaway OPENCODE_DB, boots the location
with one GET /api/plugin (v2 boots a location lazily on its first request, and an
earlier first request to /api/agent can return an empty list), waits for the agent
and provider services, then writes the /api/agent data list to <out-json>. The
server password is read from the log and never printed. The shared v2 background
service is not touched.
"""
import json, os, re, signal, socket, subprocess, sys, time
root, db_dir, out = sys.argv[1:4]
os.makedirs(db_dir, exist_ok=True)
with socket.socket() as s:
    s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]
log_path = os.path.join(db_dir, 'serve.log'); log = open(log_path, 'w')
proc = subprocess.Popen(['opencode2', 'serve', '--port', str(port)], cwd=root,
    env=dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'v2.db')), stdin=subprocess.DEVNULL,
    stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
def get(path, env):
    r = subprocess.run(['opencode2', 'api', '--server', f'http://127.0.0.1:{port}', 'GET', f'{path}?location[directory]={root}'],
        env=env, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=60)
    try: return json.loads(r.stdout).get('data', [])
    except Exception: return []
try:
    pw = None
    for _ in range(120):
        m = re.search(r'server password (\S+)', open(log_path, errors='replace').read())
        if m: pw = m.group(1); break
        time.sleep(0.5)
    env = dict(os.environ, OPENCODE_PASSWORD=pw)
    get('/api/plugin', env)
    agents = []
    for _ in range(30):
        time.sleep(3)
        agents = get('/api/agent', env)
        if agents: break
    json.dump(agents, open(out, 'w'), indent=1)
    print(len(agents))
finally:
    try: os.killpg(proc.pid, signal.SIGTERM); proc.wait(timeout=10)
    except Exception: os.killpg(proc.pid, signal.SIGKILL)
    log.close()
