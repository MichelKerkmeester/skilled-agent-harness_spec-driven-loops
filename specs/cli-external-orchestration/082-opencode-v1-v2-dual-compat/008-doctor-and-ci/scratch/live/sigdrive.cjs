const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const [script, root, sig] = process.argv.slice(2);
const tmp = os.tmpdir();
const before = fs.readdirSync(tmp).filter(n => n.startsWith('opencode-battery-'));
const child = spawn(process.execPath, [script, '--family=v2', '--json', `--root=${root}`], { stdio: ['ignore', 'ignore', 'ignore'] });
const kids = () => { try { return execFileSync('pgrep', ['-P', String(child.pid)]).toString().trim().split('\n').filter(Boolean); } catch { return []; } };
const t0 = Date.now();
const poll = setInterval(() => {
  const k = kids().filter(p => { try { return /serve/.test(execFileSync('ps', ['-o', 'command=', '-p', p]).toString()); } catch { return false; } });
  if (k.length) {
    clearInterval(poll);
    const serve = k[0];
    child.on('exit', (code, signal) => setTimeout(() => {
      let alive = true; try { process.kill(Number(serve), 0); } catch { alive = false; }
      const after = fs.readdirSync(tmp).filter(n => n.startsWith('opencode-battery-') && !before.includes(n));
      console.log(`${sig}: battery exit=${code} signal=${signal} serve_pid=${serve} serve_alive_2s_later=${alive} new_battery_folders=${after.length}`);
    }, 2000));
    process.kill(child.pid, sig);
  } else if (Date.now() - t0 > 30000) { clearInterval(poll); console.log(`${sig}: no serve child within 30s`); child.kill('SIGKILL'); }
}, 200);
