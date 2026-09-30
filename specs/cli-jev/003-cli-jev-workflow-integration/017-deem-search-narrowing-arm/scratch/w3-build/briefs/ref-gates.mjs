// Reference copy (read only) of the gate and call helpers from the committed advisor tie-break script at HEAD 64968e9b58.
// Port their behavior; do not import from this file.
/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired.
 * The timer kills the child and resolves at once, without waiting for close:
 * a grandchild can hold the pipes open past the kill. Stdin is closed after
 * the write because the jev CLI reads stdin to EOF and exits 2 on an
 * inherited terminal. A spawn error is code 127 with the message as stderr.
 * @param {string} file
 * @param {string[]} args
 * @param {string} stdinText
 * @param {Record<string, string | undefined>} env
 * @param {number} timeoutMs
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>}
 */
export function spawnCall(file, args, stdinText, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(stdinText);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

/**
 * Append one call record as a JSON line to calls.jsonl under outDir.
 * A missing or empty outDir means the run keeps no records, so nothing is
 * created. One line per call keeps a killed arm's earlier records readable.
 * @param {string|undefined} outDir
 * @param {object} record
 * @returns {void}
 */
export function writeCall(outDir, record) {
  if (typeof outDir === 'string' && outDir !== '') {
    mkdirSync(outDir, { recursive: true });
    appendFileSync(join(outDir, 'calls.jsonl'), `${JSON.stringify(record)}\n`);
  }
}
/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 * @param {string} name
 * @param {{ PATH?: string }} env
 * @returns {string|null}
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(delimiter)) {
    if (dir.length === 0) continue;
    const candidate = join(dir, name);
    try {
      if (statSync(candidate).isFile()) {
        accessSync(candidate, constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Identity line, then the pinned version and a credential check.
 * A miss prints a skip line and leaves the census text already written.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number }} ctx
 * @returns {{ passed: boolean, path: string | null, provider: string }}
 */
export function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    ctx.out('jev arm skipped: jev not on PATH');
    return { passed: false, path, provider };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs,
  };
  const version = spawnSync(path, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    ctx.out('jev arm skipped: version');
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    ctx.out('jev arm skipped: no credential');
    return { passed: false, path, provider };
  }
  return { passed: true, path, provider };
}

/**
 * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
 * @param {{ PATH?: string }} env
 * @returns {string[]}
 */
export function deemCommand(env) {
  const path = which('cli-deem', env);
  if (path !== null) return [path];
  return [process.execPath, REPO_CLI_DEEM];
}

/**
 * One health check. An unreachable binary, a stub backend, or a wrong model
 * is a failed check the caller prints as a skip.
 * @param {string[]} cmd
 * @param {Record<string, string | undefined>} env
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
 */
export function readDeemHealth(cmd, env) {
  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: HEALTH_TIMEOUT_MS,
  });
  let errorText = (result.stderr ?? '').trim();
  try {
    errorText = JSON.parse(errorText).error;
  } catch {
    // Leave the trimmed stderr when it is not JSON.
  }

  if (result.error || result.status === 4) {
    return { ok: false, reason: 'not reachable', found: errorText };
  }
  if (result.status === 3) {
    let reason = 'bad health response';
    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
    return { ok: false, reason, found: errorText };
  }
  if (result.status === 0) {
    const stdoutText = (result.stdout ?? '').trim();
    let body;
    try {
      body = JSON.parse(stdoutText);
    } catch {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    const backend = body?.backend;
    if (typeof backend === 'string' && backend.includes('stub')) {
      return { ok: false, reason: 'stub backend', found: backend };
    }
    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
      return { ok: false, reason: 'bad health response', found: String(backend) };
    }
    const model = body?.model;
    if (model !== DEEM_MODEL) {
      return { ok: false, reason: 'model', found: String(model) };
    }
    const modelCommit = body?.model_commit;
    const sourceCommit = body?.source_commit;
    if (
      body?.ok !== true
      || typeof modelCommit !== 'string'
      || modelCommit === ''
      || typeof sourceCommit !== 'string'
      || sourceCommit === ''
    ) {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    return { ok: true, backend, model, modelCommit, sourceCommit };
  }
  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
}

/**
 * Prints the health line, or a skip line when the check fails.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx
 * @returns {{ passed: boolean, cmd: string[] }}
 */
export function deemGate(ctx) {
  const cmd = deemCommand(ctx.env);
  const health = readDeemHealth(cmd, ctx.env);
  if (health.ok) {
    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
    return { passed: true, cmd, ...health };
  }
  ctx.out(`deem arm skipped: ${health.reason}`);
  if (health.reason === 'model' || health.reason === 'bad health response') {
    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
  }
  return { passed: false, cmd };
}
