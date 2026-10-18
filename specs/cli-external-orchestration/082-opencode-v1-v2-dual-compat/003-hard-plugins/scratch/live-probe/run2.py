import json, os, re, signal, socket, subprocess, sys, time
D = sys.argv[1]; ws = os.path.join(D, 'ws')
with socket.socket() as s: s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]
env = dict(os.environ, OPENCODE_DB=os.path.join(D, 'run2.db'), AI_SESSION_CHILD='1')
log = open(os.path.join(D, 'run2-serve.log'), 'w')
p = subprocess.Popen(['opencode2', 'serve', '--port', str(port)], cwd=ws, env=env, stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
url = f'http://127.0.0.1:{port}'
def api(*args, timeout=180):
    r = subprocess.run(['opencode2', 'api', '--server', url, *args], cwd=ws, env=aenv, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr
try:
    pw = None
    for _ in range(120):
        m = re.search(r'server password (\S+)', open(log.name).read())
        if m: pw = m.group(1); break
        time.sleep(0.5)
    aenv = dict(env, OPENCODE_PASSWORD=pw)
    r = subprocess.run(['opencode2', 'run', '--server', url, '-m', 'llmgateway/deepseek-v4.1-flash', 'Reply with the single word ok.'], cwd=ws, env=aenv, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=240)
    print('run exit', r.returncode, r.stdout.strip()[-80:])
    rc, out, err = api('GET', f'/api/session?location[directory]={ws}')
    data = json.loads(out).get('data', []) if rc == 0 else []
    print('sessions', rc, len(data))
    sid = data[0]['id'] if data else None
    print('session', sid)
    for args in (['session.compact', '--param', f'sessionID={sid}', '--param', f'location[directory]={ws}'],
                 ['POST', f'/api/session/{sid}/compact?location[directory]={ws}', '-d', '{}']):
        rc, out, err = api(*args, timeout=240)
        print('compact via', args[0], 'exit', rc, (out or err).strip()[:300])
        if rc == 0: break
    time.sleep(5)
finally:
    os.killpg(p.pid, signal.SIGTERM); p.wait(timeout=15); log.close()
