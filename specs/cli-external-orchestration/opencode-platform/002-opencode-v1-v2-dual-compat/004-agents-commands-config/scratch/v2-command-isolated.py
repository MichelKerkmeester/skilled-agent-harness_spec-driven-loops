import json, os, re, signal, socket, subprocess, sys, time
root, db_dir = sys.argv[1:3]
os.makedirs(db_dir, exist_ok=True)
with socket.socket() as s:
    s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]
log_path = os.path.join(db_dir, 'serve.log'); log = open(log_path, 'w')
proc = subprocess.Popen(['opencode2', 'serve', '--port', str(port)], cwd=root,
    env=dict(os.environ, OPENCODE_DB=os.path.join(db_dir, 'v2.db')), stdin=subprocess.DEVNULL,
    stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
try:
    pw = None
    for _ in range(120):
        m = re.search(r'server password (\S+)', open(log_path, errors='replace').read())
        if m: pw = m.group(1); break
        time.sleep(0.5)
    env = dict(os.environ, OPENCODE_PASSWORD=pw)
    last, stable, names = None, 0, []
    for _ in range(40):
        r = subprocess.run(['opencode2', 'api', '--server', f'http://127.0.0.1:{port}', 'GET', f'/api/command?location[directory]={root}'],
            env=env, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=60)
        try: names = sorted(str(c.get('name')) for c in json.loads(r.stdout).get('data', []))
        except Exception: names = []
        stable = stable + 1 if names and names == last else 0
        last = names
        if stable >= 2: break
        time.sleep(2)
    print(json.dumps(names))
finally:
    try: os.killpg(proc.pid, signal.SIGTERM); proc.wait(timeout=10)
    except Exception: os.killpg(proc.pid, signal.SIGKILL)
    log.close()
