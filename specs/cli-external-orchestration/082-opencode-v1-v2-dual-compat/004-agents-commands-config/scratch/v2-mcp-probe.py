import json, os, re, signal, socket, subprocess, sys, time
root, db_dir = sys.argv[1:3]
os.makedirs(db_dir, exist_ok=True)
with socket.socket() as s:
    s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]
log_path = os.path.join(db_dir, 'serve.log'); log = open(log_path, 'w')
proc = subprocess.Popen(['opencode2', 'serve', '--port', str(port)], cwd=root,
    env=dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'v2.db')), stdin=subprocess.DEVNULL,
    stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
def get(p, env):
    r = subprocess.run(['opencode2', 'api', '--server', f'http://127.0.0.1:{port}', 'GET', f'{p}?location[directory]={root}'],
        env=env, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=60)
    try: return json.loads(r.stdout).get('data', [])
    except Exception: return None
try:
    pw = None
    for _ in range(120):
        m = re.search(r'server password (\S+)', open(log_path, errors='replace').read())
        if m: pw = m.group(1); break
        time.sleep(0.5)
    env = dict(os.environ, OPENCODE_PASSWORD=pw)
    t0 = time.time()
    while time.time() - t0 < 150:
        plugins = get('/api/plugin', env) or []
        mcp = get('/api/mcp', env)
        active = sum(1 for e in plugins if e.get('state', {}).get('status') == 'active')
        print(f't={int(time.time()-t0)}s plugins={len(plugins)} active={active} mcp={json.dumps(mcp)[:400]}', flush=True)
        if active >= 16 and mcp: break
        time.sleep(5)
finally:
    try: os.killpg(proc.pid, signal.SIGTERM); proc.wait(timeout=10)
    except Exception: os.killpg(proc.pid, signal.SIGKILL)
    log.close()
