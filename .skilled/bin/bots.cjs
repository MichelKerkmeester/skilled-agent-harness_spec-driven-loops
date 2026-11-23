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
  '  enqueue <id> --source <name> (--event-id <id> | --key <key>)',
  '                 [--prompt <text>] [--origin <text>] [--fired-slot <slot>]',
  '                 queue one run request; an event sent twice is a duplicate',
  '  enqueue --git-commit <sha>',
  '                 queue one request per bot with a git-hook trigger, when',
  '                 bots/config.json sets gitHookTrigger (the post-commit hook)',
  '  drain          claim every queued request once, run it, and route the outcome',
  '  answer <item-id> <text>',
  '                 answer a needs-you item and queue the run that continues it',
  '',
  'exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision',
].join('\n');

const COMMON_OPTIONS = ['repo', 'skilled-tree'];
const ENQUEUE_OPTIONS = ['source', 'event-id', 'key', 'prompt', 'origin', 'fired-slot', 'git-commit'];
// How many positional arguments each verb takes, and the options it accepts beyond the common ones.
const VERB_SPECS = {
  run: { ids: 1, options: [] },
  disable: { ids: 1, options: [] },
  enable: { ids: 1, options: [] },
  pause: { ids: 1, options: [] },
  resume: { ids: 1, options: [] },
  inbox: { ids: 0, options: [] },
  enqueue: { ids: 1, options: ENQUEUE_OPTIONS },
  drain: { ids: 0, options: [] },
  answer: { ids: 2, options: [] },
};
const KNOWN_OPTIONS = new Set([...COMMON_OPTIONS, ...ENQUEUE_OPTIONS]);
// Free text a person types: a prompt such as "- fix the lint warnings" may start with a dash.
// A value that is itself one of this CLI's flags still means the value was left out.
const FREE_TEXT_OPTIONS = new Set(['prompt', 'origin', 'key']);

function missingValue(name, value) {
  if (value === undefined) return true;
  if (!value.startsWith('-')) return false;
  if (!FREE_TEXT_OPTIONS.has(name)) return true;
  return value === '--' || value === '-h' || value === '--help' || (value.startsWith('--') && KNOWN_OPTIONS.has(value.slice(2)));
}

function usageExit(message) {
  if (message) process.stderr.write(`bots: ${message}\n`);
  process.stderr.write(`${USAGE}\n`);
  return 2;
}

function checkEnqueue(options, ids) {
  if (options['git-commit'] !== undefined) {
    const extra = ENQUEUE_OPTIONS.find((name) => name !== 'git-commit' && options[name] !== undefined);
    if (extra) return `--git-commit takes no --${extra}`;
    if (ids.length > 0) return 'enqueue --git-commit takes no bot id';
    return null;
  }
  if (ids.length !== 1) return 'enqueue needs a bot id';
  if (options.source === undefined) return 'enqueue needs --source';
  if (options['event-id'] === undefined && options.key === undefined) return 'enqueue needs --event-id or --key';
  return null;
}

function parseArgs(argv) {
  const options = {};
  const positional = [];
  let optionsDone = false;
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!optionsDone && token === '--') {
      optionsDone = true;
      continue;
    }
    if (!optionsDone && (token === '--help' || token === '-h')) return { help: true };
    if (!optionsDone && token.startsWith('-')) {
      const name = token.startsWith('--') ? token.slice(2) : '';
      if (!KNOWN_OPTIONS.has(name)) return { error: `unknown option: ${token}` };
      const value = argv[i + 1];
      if (missingValue(name, value)) return { error: `option ${token} needs a value` };
      options[name] = value;
      i += 1;
      continue;
    }
    positional.push(token);
  }
  const [verb, ...ids] = positional;
  if (!verb) return { error: 'no verb given' };
  const spec = VERB_SPECS[verb];
  if (!spec) return { error: `unknown verb: ${verb}` };
  const misplaced = Object.keys(options).find((name) => !COMMON_OPTIONS.includes(name) && !spec.options.includes(name));
  if (misplaced) return { error: `${verb} takes no --${misplaced}` };
  if (verb === 'enqueue') {
    const problem = checkEnqueue(options, ids);
    if (problem) return { error: problem };
    return { verb, id: ids[0], args: ids.slice(1), options };
  }
  if (verb === 'answer') {
    if (ids.length === 0) return { error: 'answer needs an item id and the answer text' };
    if (ids.length === 1 || ids[1].trim() === '') return { error: 'answer needs the answer text' };
    if (ids.length > 2) return { error: `unexpected argument: ${ids[2]}` };
    return { verb, id: ids[0], args: [ids[1]], options };
  }
  if (spec.ids === 1 && !ids[0]) return { error: `${verb} needs a bot id` };
  if (spec.ids === 0 && ids.length > 0) return { error: `${verb} takes no id` };
  if (ids.length > spec.ids) return { error: `unexpected argument: ${ids[spec.ids]}` };
  return { verb, id: ids[0], args: [], options };
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
  const [runner, switches, needsYou, queue, drain, answer] = await Promise.all([
    load('runner'),
    load('switches'),
    load('needs-you'),
    load('request-queue'),
    load('request-drain'),
    load('answer'),
  ]);
  return { runner, switches, needsYou, queue, drain, answer };
}

// Refusals that mean the request itself was written wrong, as opposed to a repository that cannot enqueue.
const REQUEST_SHAPE_REASONS = new Set([
  'event-id-missing',
  'source-invalid',
  'workflow-id-invalid',
  'request-field-invalid',
  'request-kind-invalid',
]);

function describeRefusal(result) {
  const detail = result.detail ? `: ${result.detail}` : '';
  if (result.reason === 'identity-unknown') {
    return `bots: identity-unknown: this repository has no identity; set "identity": "owner/name" in bots/config.json, or add an origin remote`;
  }
  return `bots: ${result.reason}${detail}`;
}

function printEnqueued(prefix, result) {
  const { status, requestId } = result.value;
  process.stdout.write(`bots: ${prefix}${status === 'duplicate' ? 'duplicate' : 'enqueued'} ${requestId}\n`);
}

function enqueueVerb(rt, parsed, checkoutRoot) {
  const { options } = parsed;
  if (options['git-commit'] !== undefined) {
    const result = rt.queue.enqueueCommit(checkoutRoot, options['git-commit']);
    if (!result.ok) {
      process.stderr.write(`${describeRefusal(result)}\n`);
      return rt.runner.EXIT_CODES.refused;
    }
    let refused = false;
    for (const { botId, result: one } of result.value) {
      if (one.ok) {
        printEnqueued(`${botId} `, one);
      } else {
        refused = true;
        process.stderr.write(`${describeRefusal(one)} (${botId})\n`);
      }
    }
    return refused ? rt.runner.EXIT_CODES.refused : 0;
  }
  const result = rt.queue.enqueueFromCheckout(checkoutRoot, {
    kind: 'run',
    workflowId: parsed.id,
    source: options.source,
    eventId: options['event-id'] ?? null,
    key: options.key ?? null,
    prompt: options.prompt ?? '',
    origin: options.origin ?? null,
    firedSlot: options['fired-slot'] ?? null,
  });
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return REQUEST_SHAPE_REASONS.has(result.reason) ? 2 : rt.runner.EXIT_CODES.refused;
  }
  printEnqueued('', result);
  return 0;
}

async function drainVerb(rt, checkoutRoot, skilledTree) {
  const result = await rt.drain.drainQueue({ checkoutRoot, skilledTree });
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return result.reason === 'drain-stopped' ? rt.runner.EXIT_CODES.runFailure : rt.runner.EXIT_CODES.refused;
  }
  const { lines, claimedAtStart, remaining } = result.value;
  for (const name of claimedAtStart) {
    process.stderr.write(`bots: ${name} was already claimed when this pass began; it is not redispatched\n`);
  }
  for (const line of lines) process.stdout.write(`${rt.drain.formatDrainLine(line)}\n`);
  if (remaining > 0) {
    process.stderr.write(`bots: ${remaining} request(s) remain in the watched folder for the next pass\n`);
    return rt.runner.EXIT_CODES.runFailure;
  }
  return 0;
}

function answerVerb(rt, parsed, checkoutRoot) {
  const result = rt.answer.answerItem({ checkoutRoot, itemId: parsed.id, text: parsed.args[0] });
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { status, requestId, itemId } = result.value;
  const sent = status === 'duplicate' ? 'duplicate: already queued' : 'enqueued';
  process.stdout.write(`bots: item ${itemId} answered; resume request ${requestId} ${sent}\n`);
  return 0;
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

  const rt = await loadRuntime();
  const { runner, switches, needsYou } = rt;
  const checkoutRoot = checkoutRootFrom(parsed.options.repo);
  const skilledTree = path.resolve(parsed.options['skilled-tree'] || DEFAULT_SKILLED_TREE);

  if (parsed.verb === 'enqueue') return enqueueVerb(rt, parsed, checkoutRoot);
  if (parsed.verb === 'drain') return drainVerb(rt, checkoutRoot, skilledTree);
  if (parsed.verb === 'answer') return answerVerb(rt, parsed, checkoutRoot);

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
