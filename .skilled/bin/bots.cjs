#!/usr/bin/env node
'use strict';

// Front door for file-defined bots.
//
// A thin CLI over the bots runtime: it parses one verb and one id, refuses a
// misspelled option loudly, and hands the work to the runtime modules, which
// hold every rule. Run outcomes map to distinct exit codes, so a caller can
// tell a run that was refused before dispatch from one that broke and from
// one that parked a question for the operator.

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const RUNTIME = path.resolve(__dirname, '..', 'skills', 'system-skilled-bots', 'runtime');
const DEFAULT_SKILLED_TREE = path.resolve(__dirname, '..', '..');

const USAGE = [
  'usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]',
  '',
  'verbs:',
  '  run <id>       run one bot now, in the shared checkout',
  '  disable <id>   stop every run of a bot until enabled',
  '  enable <id>    lift a disable',
  '  pause <id>     hold a bot\'s runs after the lease until resumed',
  '  resume <id>    lift a pause (not the resume of a parked run)',
  '  inbox          list open and expired needs-you items',
  '',
  'exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision',
].join('\n');

const VERBS_WITH_ID = new Set(['run', 'disable', 'enable', 'pause', 'resume']);
const VERBS = new Set([...VERBS_WITH_ID, 'inbox']);
const OPTIONS_WITH_VALUE = new Set(['--repo', '--skilled-tree']);

function usageExit(message) {
  if (message) process.stderr.write(`bots: ${message}\n`);
  process.stderr.write(`${USAGE}\n`);
  return 2;
}

function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--help' || token === '-h') return { help: true };
    if (OPTIONS_WITH_VALUE.has(token)) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('-')) return { error: `option ${token} needs a value` };
      options[token.slice(2)] = value;
      i += 1;
      continue;
    }
    if (token.startsWith('-')) return { error: `unknown option: ${token}` };
    positional.push(token);
  }
  const [verb, id, ...extra] = positional;
  if (!verb) return { error: 'no verb given' };
  if (!VERBS.has(verb)) return { error: `unknown verb: ${verb}` };
  if (VERBS_WITH_ID.has(verb) && !id) return { error: `${verb} needs a bot id` };
  if (!VERBS_WITH_ID.has(verb) && id) return { error: `${verb} takes no id` };
  if (extra.length > 0) return { error: `unexpected argument: ${extra[0]}` };
  return { verb, id, options };
}

function checkoutRootFrom(repoOption) {
  const start = path.resolve(repoOption || process.cwd());
  const top = spawnSync('git', ['-C', start, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  return top.status === 0 ? top.stdout.trim() : start;
}

async function loadRuntime() {
  // A global loader, not a namespaced import: the runtime requires the deep-loop
  // CommonJS scripts, which a namespaced loader cannot resolve.
  const { register } = require(require.resolve('tsx/esm/api', { paths: [RUNTIME] }));
  register();
  const load = (name) => import(pathToFileURL(path.join(RUNTIME, 'lib', `${name}.ts`)).href);
  const [runner, switches, needsYou] = await Promise.all([load('runner'), load('switches'), load('needs-you')]);
  return { runner, switches, needsYou };
}

function describeOutcome(id, outcome) {
  switch (outcome.kind) {
    case 'completed':
      return `bots: ${id} run ${outcome.runId} completed`;
    case 'failed':
      return `bots: ${id} run ${outcome.runId} failed: ${outcome.reason} (class ${outcome.class ?? 'none'})`;
    case 'awaiting-decision':
      return `bots: ${id} run ${outcome.runId} is waiting on a decision: item ${outcome.itemId}. See bots inbox.`;
    case 'refused': {
      const detail = outcome.detail ? `: ${outcome.detail}` : '';
      return `bots: ${id} refused before dispatch (${outcome.cause})${detail}`;
    }
    default:
      return `bots: ${id} ended`;
  }
}

async function main(argv) {
  const parsed = parseArgs(argv);
  if (parsed.help) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }
  if (parsed.error) return usageExit(parsed.error);

  const { runner, switches, needsYou } = await loadRuntime();
  const checkoutRoot = checkoutRootFrom(parsed.options.repo);
  const skilledTree = path.resolve(parsed.options['skilled-tree'] || DEFAULT_SKILLED_TREE);

  if (parsed.verb === 'run') {
    const outcome = await runner.runBot({ checkoutRoot, skilledTree, botId: parsed.id });
    const line = describeOutcome(parsed.id, outcome);
    (outcome.kind === 'completed' || outcome.kind === 'awaiting-decision' ? process.stdout : process.stderr).write(`${line}\n`);
    return runner.exitCodeFor(outcome);
  }

  const context = runner.resolveBotContext({ checkoutRoot, skilledTree });
  if (!context.ok) {
    process.stderr.write(`bots: ${context.reason}${context.detail ? `: ${context.detail}` : ''}\n`);
    return runner.EXIT_CODES.refused;
  }
  const { stateRoot, identity } = context.value;

  if (parsed.verb === 'inbox') {
    const { items, unreadable, listError } = needsYou.listNeedsYouItems(stateRoot, identity);
    // An inbox that cannot be listed is not an empty inbox: it may hide open items.
    if (listError !== null) {
      process.stderr.write(`bots: the needs-you folder could not be listed (${listError}); open items may be hidden\n`);
      return runner.EXIT_CODES.runFailure;
    }
    const shown = items.filter((listing) => listing.state !== 'answered');
    if (shown.length === 0) process.stdout.write('bots: no open or expired needs-you items\n');
    for (const { item, state } of shown) {
      process.stdout.write(`${state}\t${item.id}\t${item.botId}\tcreated ${item.createdAt}\texpires ${item.expiresAt}\n`);
      process.stdout.write(`\t${item.question}\n`);
      for (const option of item.options ?? []) process.stdout.write(`\t- ${option}\n`);
    }
    for (const id of unreadable) process.stderr.write(`bots: item ${id} did not read\n`);
    return 0;
  }

  if (!require('node:fs').existsSync(runner.definitionPath(checkoutRoot, parsed.id))) {
    process.stderr.write(`bots: no bot ${parsed.id} at ${runner.definitionPath(checkoutRoot, parsed.id)}\n`);
    return runner.EXIT_CODES.refused;
  }
  const kind = parsed.verb === 'disable' || parsed.verb === 'enable' ? 'disabled' : 'paused';
  const set = parsed.verb === 'disable' || parsed.verb === 'pause';
  const result = set
    ? switches.setSwitch(stateRoot, identity, parsed.id, kind)
    : switches.clearSwitch(stateRoot, identity, parsed.id, kind);
  if (!result.ok) {
    process.stderr.write(`bots: ${result.reason}\n`);
    return runner.EXIT_CODES.refused;
  }
  process.stdout.write(`bots: ${parsed.id} ${set ? kind : `no longer ${kind}`}\n`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`bots: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    },
  );
}

module.exports = { parseArgs, USAGE };
