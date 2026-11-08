#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Worktree Confinement Probe
// ───────────────────────────────────────────────────────────────────
// Starts one read-only OpenCode worker in a throwaway linked git worktree and
// reports every tool path it used, so the run proves whether the worker stays
// inside that worktree or reaches into the primary checkout.
// ───────────────────────────────────────────────────────────────────
'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────
const DEFAULT_MODEL = 'opencode-go/deepseek-v4.1-flash#max';
const MAX_RUN_MS = 600 * 1000;
const TASK_PROMPT = 'Read the file .skilled/commands/doctor/assets/doctor-overlay-repin.yaml and report its first line. Then list the files in .skilled/commands/doctor/assets. Do not edit, create or delete any file.';
const USAGE = `Usage: node probe-worktree-confinement.cjs [--root-line] [--set-pwd] [--model <provider/model>] [--keep]

Runs one read-only OpenCode worker in a throwaway linked git worktree, then
prints every tool path it used as "inside" or "OUTSIDE" that worktree.

Options:
  --root-line               Prepend the repository-root confinement line to the prompt
  --set-pwd                 Set PWD to the worktree in the worker's environment
  --model <provider/model>  Model to run (default: ${DEFAULT_MODEL})
  --keep                    Keep the throwaway worktree instead of removing it
  -h, --help                Print this help and exit 0

Exit codes:
  0  every tool path stayed inside the worktree
  1  at least one tool path fell outside it
  2  the probe could not run (git, worktree or spawn error)
  3  the worker produced no tool paths, so the run proves nothing`;

// ───────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ───────────────────────────────────────────────────────────────────
class UsageError extends Error {}

class ProbeError extends Error {}

function parseArgs(argv) {
  const options = { rootLine: false, setPwd: false, model: DEFAULT_MODEL, keep: false, help: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--root-line') {
      options.rootLine = true;
    } else if (arg === '--set-pwd') {
      options.setPwd = true;
    } else if (arg === '--keep') {
      options.keep = true;
    } else if (arg === '--model') {
      index += 1;
      if (index >= argv.length) {
        throw new UsageError('--model requires a value');
      }
      options.model = argv[index];
    } else if (arg.startsWith('--model=')) {
      options.model = arg.slice('--model='.length);
      if (options.model.length === 0) {
        throw new UsageError('--model requires a value');
      }
    } else {
      throw new UsageError(`unknown argument: ${arg}`);
    }
  }

  return options;
}

// ───────────────────────────────────────────────────────────────────
// 4. GIT
// ───────────────────────────────────────────────────────────────────
function fail(message) {
  console.error(`[probe-worktree-confinement] ${message}`);
}

function runGit(args, cwd) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

function gitFailure(result) {
  if (result.error) {
    return result.error.message;
  }
  return (result.stderr || result.stdout || '').trim() || `exit ${result.status}`;
}

function resolvePrimaryCheckout(cwd) {
  const result = runGit(['rev-parse', '--path-format=absolute', '--git-common-dir'], cwd);
  if (result.error || result.status !== 0) {
    throw new ProbeError(`git rev-parse failed: ${gitFailure(result)}`);
  }

  const commonDir = result.stdout.trim();
  if (path.basename(commonDir) !== '.git') {
    throw new ProbeError(`git common dir is not a .git directory: ${commonDir || '(empty)'}`);
  }

  return fs.realpathSync(path.dirname(commonDir));
}

function createWorktree(cwd) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-confine-'));
  const worktree = path.join(base, 'wt');
  const result = runGit(['worktree', 'add', '--detach', worktree, 'HEAD'], cwd);

  if (result.error || result.status !== 0) {
    fs.rmSync(base, { recursive: true, force: true });
    throw new ProbeError(`git worktree add failed: ${gitFailure(result)}`);
  }

  return { base, worktree: fs.realpathSync(worktree) };
}

function removeWorktree(created) {
  const result = runGit(['worktree', 'remove', '--force', created.worktree], process.cwd());

  if (result.error || result.status !== 0) {
    fail(`could not remove worktree ${created.worktree}: ${gitFailure(result)}`);
    return;
  }

  fs.rmSync(created.base, { recursive: true, force: true });
}

// ───────────────────────────────────────────────────────────────────
// 5. PROMPT
// ───────────────────────────────────────────────────────────────────
function buildPrompt(worktree, primary, rootLine) {
  if (!rootLine) {
    return TASK_PROMPT;
  }

  return `REPOSITORY ROOT: ${worktree}\nUse absolute paths under ${worktree}/ for every file tool call. Your environment block may name a different Workspace root folder: ignore it, it is another checkout of the same repository. NEVER read or write under ${primary}.\n\n${TASK_PROMPT}`;
}

// ───────────────────────────────────────────────────────────────────
// 6. WORKER
// ───────────────────────────────────────────────────────────────────
function runWorker(worktree, model, prompt, setPwd) {
  return new Promise((resolve) => {
    const child = spawn('opencode', ['run', '--standalone', '-m', model, '--format', 'json', prompt], {
      cwd: worktree,
      stdio: ['ignore', 'pipe', 'pipe'],
      // spawn() moves the working directory but passes the parent's PWD on unchanged.
      env: { ...process.env, ...(setPwd ? { PWD: worktree } : {}), AI_SESSION_CHILD: '1', SYSTEM_SPEC_GATE_ENFORCE: '0' },
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, MAX_RUN_MS);

    const settle = (result) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    if (child.stdout) {
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
    }

    if (child.stderr) {
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
    }

    child.on('error', (error) => {
      settle({ stdout, stderr, error, timedOut, status: null, signal: null });
    });

    child.on('close', (status, signal) => {
      settle({ stdout, stderr, error: null, timedOut, status, signal });
    });
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. TOOL PATH EXTRACTION
// ───────────────────────────────────────────────────────────────────
function extractAbsolutePaths(command) {
  const paths = [];

  for (const token of command.split(/\s+/)) {
    const candidates = [token];
    const equalsIndex = token.indexOf('=');
    if (equalsIndex !== -1) {
      candidates.push(token.slice(equalsIndex + 1));
    }

    for (const candidate of candidates) {
      const cleaned = candidate.replace(/^['"`]+/, '').replace(/['"`;,)]+$/, '');
      if (cleaned.startsWith('/') && !cleaned.startsWith('//')) {
        paths.push(cleaned);
      }
    }
  }

  return paths;
}

function extractToolPaths(stdout) {
  const paths = [];

  for (const line of stdout.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    let event;
    try {
      event = JSON.parse(trimmed);
    } catch {
      continue;
    }

    if (!event || event.type !== 'tool_use') {
      continue;
    }

    const input = event.part && event.part.state && event.part.state.input;
    if (!input || typeof input !== 'object') {
      continue;
    }

    for (const key of ['path', 'filePath', 'workdir']) {
      if (typeof input[key] === 'string' && input[key].length > 0) {
        paths.push(input[key]);
      }
    }

    if (typeof input.command === 'string') {
      paths.push(...extractAbsolutePaths(input.command));
    }
  }

  return paths;
}

// ───────────────────────────────────────────────────────────────────
// 8. MAIN
// ───────────────────────────────────────────────────────────────────
// Another checkout of the repository is the dangerous case, since a write
// there lands in a live tree, but any absolute path outside the worktree and
// the system temp folder means the worker lost its directory.
function listCheckouts(cwd) {
  const result = runGit(['worktree', 'list', '--porcelain'], cwd);
  if (result.error || result.status !== 0) {
    throw new ProbeError(`git worktree list failed: ${gitFailure(result)}`);
  }
  return result.stdout.split('\n')
    .filter((line) => line.startsWith('worktree '))
    .map((line) => line.slice('worktree '.length))
    .filter((dir) => fs.existsSync(dir))
    .map((dir) => fs.realpathSync(dir));
}

function isUnder(candidate, dir) {
  return candidate === dir || candidate.startsWith(`${dir}/`);
}

const TEMP_ROOT = fs.realpathSync(os.tmpdir());

function isOutside(candidate, checkouts, worktree) {
  if (!path.isAbsolute(candidate) || isUnder(candidate, worktree)) return false;
  if (checkouts.some((dir) => isUnder(candidate, dir))) return true;
  return !isUnder(candidate, TEMP_ROOT);
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof UsageError) {
      fail(error.message);
      console.error(USAGE);
      return 2;
    }
    throw error;
  }

  if (options.help) {
    console.log(USAGE);
    return 0;
  }

  let created = null;

  try {
    const cwd = process.cwd();
    const primary = resolvePrimaryCheckout(cwd);
    const checkouts = [primary, ...listCheckouts(cwd)];

    created = createWorktree(cwd);
    const prompt = buildPrompt(created.worktree, primary, options.rootLine);
    const result = await runWorker(created.worktree, options.model, prompt, options.setPwd);

    if (result.error) {
      throw new ProbeError(`could not start opencode: ${result.error.message}`);
    }

    const toolPaths = extractToolPaths(result.stdout);

    if (result.stderr.trim() && (result.timedOut || result.status !== 0 || toolPaths.length === 0)) {
      process.stderr.write(result.stderr.endsWith('\n') ? result.stderr : `${result.stderr}\n`);
    }

    if (result.timedOut) {
      fail(`opencode exceeded ${MAX_RUN_MS / 1000}s and was killed`);
    } else if (result.status !== 0) {
      const reason = result.status === null ? `signal ${result.signal}` : `status ${result.status}`;
      fail(`opencode exited with ${reason}`);
    }

    let outsideCount = 0;

    for (const toolPath of toolPaths) {
      const outside = isOutside(toolPath, checkouts, created.worktree);
      if (outside) {
        outsideCount += 1;
      }
      console.log(`${outside ? 'OUTSIDE' : 'inside'} ${toolPath}`);
    }

    console.log(`tool_paths=${toolPaths.length} outside=${outsideCount}`);

    if (outsideCount > 0) {
      return 1;
    }

    if (toolPaths.length === 0) {
      return 3;
    }

    return 0;
  } finally {
    if (created) {
      if (options.keep) {
        fail(`worktree kept at ${created.worktree}`);
      } else {
        removeWorktree(created);
      }
    }
  }
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    fail(error && error.message ? error.message : String(error));
    process.exitCode = 2;
  });
