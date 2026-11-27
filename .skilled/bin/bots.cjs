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
  '  run <id> [--schedule-index <n>] [--as <name>]',
  '                 run one bot now, in the shared checkout or, for a worktree',
  '                 bot, in its own worktree; only the installed schedule passes',
  '                 --schedule-index, so the run records the slot it fired for',
  '  disable <id>   stop every run of a bot until enabled, and its installed schedule',
  '  enable <id>    lift a disable; for an installed schedule, recheck it and let it fire',
  '  pause <id>     hold a bot\'s runs after the lease until resumed',
  '  resume <id>    lift a pause (not the resume of a parked run)',
  '  inbox [--json] [--all]',
  '                 list open and expired needs-you items; --all adds the answered',
  '                 ones, --json prints one document',
  '  enqueue <id> --source <name> (--event-id <id> | --key <key>)',
  '                 [--prompt <text>] [--origin <text>] [--fired-slot <slot>]',
  '                 queue one run request; an event sent twice is a duplicate',
  '  enqueue --git-commit <sha>',
  '                 queue one request per bot with a git-hook trigger, when',
  '                 bots/config.json sets gitHookTrigger (the post-commit hook)',
  '  drain [--scheduled]',
  '                 claim every queued request once, run it, and route the outcome;',
  '                 --scheduled backs off after a setup fault (the drain job uses it)',
  '  schedule install <id> [--full-access]',
  '                 install a cron bot\'s schedule, held disabled until bots enable;',
  '                 the id drain installs this repository\'s queue-drain job',
  '                 --full-access lets a definition\'s danger-full-access sandbox run',
  '                 and needs a tty',
  '  schedule uninstall <id>',
  '                 remove a schedule and sweep this repository\'s orphaned ones',
  '  answer <item-id> <text> [--as <name>] [--scope once|deny]',
  '                 answer a needs-you item and queue the run that continues it;',
  '                 --as records who answered and needs a tty unless it is you,',
  '                 and --scope deny records a denial',
  '  status [--json] [--rebuild] [--all] [--unregister <owner/name>]',
  '                 show every installed bot, its last run and delivery, and open',
  '                 needs-you items, from the status index; --rebuild rebuilds the',
  '                 index from run records, --unregister hides an identity\'s rows',
  '                 and deletes nothing, --all shows hidden identities too',
  '  activity [--json]',
  '                 what every bot is doing, grouped: needs you, working, scheduled,',
  '                 done, stopped, failed and recurring, and --json prints one document',
  '  routines [--json]',
  '                 every bot with a routine block: its start, what it does, its',
  '                 outcome, the switch it reads as and its failure streak',
  '',
  'exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision',
].join('\n');

const COMMON_OPTIONS = ['repo', 'skilled-tree'];
// Options that are switches and take no value.
const FLAG_OPTIONS = new Set(['scheduled', 'rebuild', 'json', 'all', 'full-access']);
const SCHEDULE_ACTIONS = ['install', 'uninstall'];
const ENQUEUE_OPTIONS = ['source', 'event-id', 'key', 'prompt', 'origin', 'fired-slot', 'git-commit'];
const STATUS_OPTIONS = ['rebuild', 'json', 'all', 'unregister'];
// How many positional arguments each verb takes, and the options it accepts beyond the common ones.
const VERB_SPECS = {
  run: { ids: 1, options: ['schedule-index', 'as'] },
  disable: { ids: 1, options: [] },
  enable: { ids: 1, options: [] },
  pause: { ids: 1, options: [] },
  resume: { ids: 1, options: [] },
  inbox: { ids: 0, options: ['json', 'all'] },
  enqueue: { ids: 1, options: ENQUEUE_OPTIONS },
  drain: { ids: 0, options: ['scheduled'] },
  answer: { ids: 2, options: ['as', 'scope'] },
  schedule: { ids: 2, options: ['full-access'] },
  status: { ids: 0, options: STATUS_OPTIONS },
  activity: { ids: 0, options: ['json'] },
  routines: { ids: 0, options: ['json'] },
};
// Verbs whose id is a bot, so identity and the state root come from that bot's installed job first.
const ON_ONE_BOT = new Set(['run', 'enable', 'disable', 'pause', 'resume']);
const KNOWN_OPTIONS = new Set([...COMMON_OPTIONS, ...ENQUEUE_OPTIONS, ...STATUS_OPTIONS, 'schedule-index', 'as', 'scope', ...FLAG_OPTIONS]);
// The marker a bot schedule's job file sets, the renderer's SCHEDULED_FIRE_ENV. A schedule index
// moves the schedule's slot accounting, so only the installed job may pass one.
const SCHEDULED_FIRE_ENV = 'SKILLED_BOTS_SCHEDULED_FIRE';
// The names an actor may take, mirroring ACTOR_PATTERN in the runtime's actor module. The pattern
// is repeated here because these refusals run before the runtime loads.
const ACTOR_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
// The operator pinned into a job at install time, the runtime's PINNED_OPERATOR_ENV.
const PINNED_OPERATOR_ENV = 'SKILLED_BOTS_OPERATOR';
// Scopes that would grant more than one answer, which this command cannot record.
const UNSUPPORTED_SCOPES = new Set(['always', 'conversation']);
// The scopes an answer may record.
const ANSWER_SCOPES = new Set(['once', 'deny']);
// The write verbs a bot child may not run. Each later write verb joins this list.
const CHILD_REFUSED_VERBS = new Set(['answer', 'enable']);
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

// The OS user's name, or null when the lookup fails, so a name that cannot be read never matches.
function osUser() {
  try {
    return require('node:os').userInfo().username;
  } catch {
    return null;
  }
}

// Whether this process is a bot's own child, which the dispatcher marks with a run id and a
// dispatched session marks with the child flag. A child runs as the same OS user as the operator,
// so the marker is the only thing that tells them apart. It is a bar against the ordinary case and
// not an authentication: a child that clears the marker is not stopped by it.
function isBotChild(env) {
  const runId = env.SKILLED_BOT_RUN_ID;
  if (typeof runId === 'string' && runId !== '') return true;
  return env.AI_SESSION_CHILD === '1';
}

// The refusals that keep a script from claiming another person's name. They run here, before the
// runtime loads, so no caller reaches the answer or the run with a borrowed name.
function checkActorOptions(parsed) {
  const { options } = parsed;
  const isAnswer = parsed.verb === 'answer';
  const given = options.as !== undefined;
  const actor = given ? options.as.trim() : '';
  if (given && actor === '') return { message: 'option --as needs a value' };
  if (given && !ACTOR_PATTERN.test(actor)) return { message: '--as takes a name' };
  if (isAnswer && options.scope !== undefined) {
    if (UNSUPPORTED_SCOPES.has(options.scope)) return { message: 'grant-scope-unsupported' };
    if (!ANSWER_SCOPES.has(options.scope)) return { message: '--scope takes once or deny' };
  }
  const me = osUser();
  const tty = process.stdin.isTTY === true;
  if (given && !(me !== null && actor === me.trim()) && !tty) return { message: '--as needs a tty' };
  if (isAnswer && !given) {
    const pinned = process.env[PINNED_OPERATOR_ENV];
    const name = pinned === undefined ? '' : pinned.trim();
    const mine = me !== null && name === me.trim();
    if (ACTOR_PATTERN.test(name) && process.env[SCHEDULED_FIRE_ENV] !== '1' && !mine && !tty) {
      return { message: '--as needs a tty' };
    }
  }
  return null;
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
      if (FLAG_OPTIONS.has(name)) {
        options[name] = true;
        continue;
      }
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
  if (verb === 'schedule') {
    if (ids.length === 0 || !SCHEDULE_ACTIONS.includes(ids[0])) return { error: `schedule needs ${SCHEDULE_ACTIONS.join(' or ')}` };
    if (!ids[1]) return { error: `schedule ${ids[0]} needs a bot id, or drain` };
    if (ids.length > 2) return { error: `unexpected argument: ${ids[2]}` };
    return { verb, id: ids[1], args: [ids[0]], options };
  }
  if (options['schedule-index'] !== undefined && !/^(?:0|[1-9]\d*)$/.test(options['schedule-index'])) {
    return { error: '--schedule-index takes a whole number' };
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

function runtimeModule(name) {
  return import(pathToFileURL(path.join(RUNTIME, 'lib', `${name}.ts`)).href);
}

async function loadRuntime() {
  // A global loader, not a namespaced import: the runtime requires the deep-loop
  // CommonJS scripts, which a namespaced loader cannot resolve.
  const { register } = require(require.resolve('tsx/esm/api', { paths: [RUNTIME] }));
  register();
  const load = runtimeModule;
  const [runner, switches, needsYou, queue, drain, answer, installer] = await Promise.all([
    load('runner'),
    load('switches'),
    load('needs-you'),
    load('request-queue'),
    load('request-drain'),
    load('answer'),
    load('installer'),
  ]);
  return { runner, switches, needsYou, queue, drain, answer, installer };
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

function enqueueVerb(rt, parsed, checkoutRoot, resolveEnv) {
  const { options } = parsed;
  if (options['git-commit'] !== undefined) {
    const result = rt.queue.enqueueCommit(checkoutRoot, options['git-commit'], resolveEnv);
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
  }, resolveEnv);
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return REQUEST_SHAPE_REASONS.has(result.reason) ? 2 : rt.runner.EXIT_CODES.refused;
  }
  printEnqueued('', result);
  return 0;
}

async function drainVerb(rt, checkoutRoot, skilledTree, scheduled, resolveEnv) {
  let result;
  if (scheduled) {
    // The scheduled pass builds the job's environment itself.
    const outcome = await rt.installer.scheduledDrain({ checkoutRoot, skilledTree, env: process.env });
    if (outcome.kind === 'backing-off') {
      process.stderr.write(`bots: drain backing off until ${outcome.until} after: ${outcome.reason}\n`);
      return 0;
    }
    if (outcome.kind === 'refused' && outcome.backoffUntil !== null) {
      process.stderr.write(`bots: drain backs off until ${outcome.backoffUntil}\n`);
    }
    result = outcome.kind === 'drained'
      ? { ok: true, value: outcome.report }
      : { ok: false, reason: outcome.reason, ...(outcome.detail !== null ? { detail: outcome.detail } : {}) };
  } else {
    result = await rt.drain.drainQueue({ checkoutRoot, skilledTree, env: process.env, resolveEnv });
  }
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

function answerVerb(rt, parsed, checkoutRoot, resolveEnv) {
  const result = rt.answer.answerItem({
    checkoutRoot,
    itemId: parsed.id,
    text: parsed.args[0],
    env: process.env,
    resolveEnv,
    actor: parsed.options.as === undefined ? undefined : parsed.options.as.trim(),
    scope: parsed.options.scope,
  });
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { status, requestId, itemId } = result.value;
  const sent = status === 'duplicate' ? 'duplicate: already queued' : 'enqueued';
  process.stdout.write(`bots: item ${itemId} answered; resume request ${requestId} ${sent}\n`);
  return 0;
}

function printSteps(steps) {
  for (const { step, status, detail } of steps) {
    process.stdout.write(`  ${step}\t${status === null ? '-' : status}${detail ? `\t${detail}` : ''}\n`);
  }
}

function installerRefusal(rt, result) {
  process.stderr.write(`${describeRefusal(result)}\n`);
  return result.reason === rt.installer.INSTALL_STEP_FAILED ? rt.runner.EXIT_CODES.runFailure : rt.runner.EXIT_CODES.refused;
}

function scheduleVerb(rt, parsed, checkoutRoot, skilledTree) {
  const input = { checkoutRoot, skilledTree, botId: parsed.id };
  if (parsed.args[0] === 'uninstall') {
    const result = rt.installer.uninstallSchedule(input);
    if (!result.ok) return installerRefusal(rt, result);
    const { removed, swept, leftDisabled, steps } = result.value;
    printSteps(steps);
    process.stdout.write(`bots: removed ${removed.join(', ')}\n`);
    if (swept.length > 0) process.stdout.write(`bots: swept orphaned ${swept.join(', ')}\n`);
    for (const label of leftDisabled) process.stdout.write(`bots: ${label} stays in the scheduler's disabled list (harmless with no job file)\n`);
    process.stdout.write('bots: run folders and run records were left in place\n');
    return 0;
  }
  const result = rt.installer.installSchedule({ ...input, fullAccess: parsed.options['full-access'] === true });
  if (!result.ok) return installerRefusal(rt, result);
  if (result.value.recordedOnly !== undefined) {
    process.stdout.write(`bots: ${parsed.id} has a ${result.value.recordedOnly.triggerKind} trigger, so full access is recorded and no schedule is installed\n`);
    return 0;
  }
  const { labels, plistPaths, hold, loaded, steps, nextFire, check } = result.value;
  printSteps(steps);
  process.stdout.write(`bots: installed ${labels.join(', ')} at ${plistPaths.join(', ')}\n`);
  if (hold !== null) {
    process.stdout.write(`bots: held disabled (${hold}); nothing fires until: bots enable ${parsed.id}\n`);
  } else {
    process.stdout.write(`bots: enabled and ${loaded ? 'loaded' : 'not loaded'}\n`);
  }
  process.stdout.write(`bots: next fire: ${nextFire}\n`);
  process.stdout.write(`bots: check: ${check.status}${check.reasons.length > 0 ? ` (${check.reasons.join(', ')})` : ''}\n`);
  return 0;
}

// The status modules are loaded here and nowhere else, so a native SQLite binding
// that fails to load can only break status, never a kill switch such as disable.
async function statusVerb(rt, parsed, checkoutRoot, resolveEnv) {
  const { options } = parsed;
  let status;
  let repoConfig;
  let stateRootModule;
  try {
    [status, repoConfig, stateRootModule] = await Promise.all([runtimeModule('status'), runtimeModule('repo-config'), runtimeModule('state-root')]);
  } catch (error) {
    process.stderr.write(`bots: the status modules did not load: ${error instanceof Error ? error.message : String(error)}\n`);
    return rt.runner.EXIT_CODES.runFailure;
  }
  const config = repoConfig.readRepoConfig(checkoutRoot);
  if (!config.ok) {
    process.stderr.write(`${describeRefusal(config)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  // The state root the installed jobs use, resolved under the job's environment like every other verb.
  const stateRoot = stateRootModule.userStateRoot(config.value, resolveEnv);
  const input = { stateRoot, env: process.env, includeRetired: options.all === true };
  const indexFailure = (result) => {
    process.stderr.write(`bots: ${result.reason}${result.detail ? `: ${result.detail}` : ''}\n`);
    return rt.runner.EXIT_CODES.runFailure;
  };
  if (options.unregister !== undefined) {
    const result = status.unregisterIdentity({ ...input, identity: options.unregister });
    if (!result.ok) return result.reason === 'identity-invalid' ? usageExit(`--unregister takes owner/name: ${options.unregister}`) : indexFailure(result);
    const { identity, createdFile } = result.value;
    process.stdout.write(`bots: ${identity} unregistered: its rows are hidden from status; nothing was deleted\n`);
    if (createdFile) process.stdout.write('bots: no registered-roots file existed, so this wrote the first one\n');
    return 0;
  }
  const info = options.json === true ? process.stderr : process.stdout;
  if (options.rebuild === true) {
    const built = status.rebuildStatusIndex(input);
    if (!built.ok) return indexFailure(built);
    const { runs, items, skipped } = built.value;
    info.write(`bots: rebuilt ${built.value.path}: ${runs} run row(s), ${items} item row(s)\n`);
    for (const file of skipped) process.stderr.write(`bots: ${file} did not read and was left out\n`);
  }
  const report = status.statusReport(input);
  if (!report.ok) return indexFailure(report);
  if (options.json === true) {
    process.stdout.write(`${JSON.stringify(report.value, null, 2)}\n`);
  } else {
    for (const line of status.formatStatus(report.value)) process.stdout.write(`${line}\n`);
  }
  return 0;
}

// The activity read reads the same index status builds, so it loads the status
// modules the same way and formats through the pure activity module, which keeps
// the grouping rules out of this file.
async function activityVerb(rt, parsed, checkoutRoot, resolveEnv) {
  const { options } = parsed;
  let status;
  let repoConfig;
  let stateRootModule;
  let activityModule;
  try {
    [status, repoConfig, stateRootModule, activityModule] = await Promise.all([
      runtimeModule('status'),
      runtimeModule('repo-config'),
      runtimeModule('state-root'),
      runtimeModule('activity'),
    ]);
  } catch (error) {
    process.stderr.write(`bots: the status modules did not load: ${error instanceof Error ? error.message : String(error)}\n`);
    return rt.runner.EXIT_CODES.runFailure;
  }
  const config = repoConfig.readRepoConfig(checkoutRoot);
  if (!config.ok) {
    process.stderr.write(`${describeRefusal(config)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  // The state root the installed jobs use, resolved under the job's environment like every other verb.
  const stateRoot = stateRootModule.userStateRoot(config.value, resolveEnv);
  const report = status.activityReport({ stateRoot, env: process.env });
  if (!report.ok) {
    process.stderr.write(`bots: ${report.reason}${report.detail ? `: ${report.detail}` : ''}\n`);
    return rt.runner.EXIT_CODES.runFailure;
  }
  if (options.json === true) {
    process.stdout.write(`${JSON.stringify(report.value, null, 2)}\n`);
    return 0;
  }
  const lines = activityModule.formatActivity(report.value);
  if (lines.length === 0) {
    process.stdout.write('bots: no activity\n');
    return 0;
  }
  for (const line of lines) process.stdout.write(`${line}\n`);
  return 0;
}

// The routine read loads the definition, routine and routine-state modules
// itself, so a routine that does not read can only break this verb. It reads
// the state root and never creates one: a bot with no state yet is a bot whose
// routine has not run, which is a row and not an error.
async function routinesVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv) {
  const { options } = parsed;
  const fs = require('node:fs');
  let definition;
  let routineModule;
  let routineState;
  try {
    [definition, routineModule, routineState] = await Promise.all([
      runtimeModule('definition'),
      runtimeModule('routine'),
      runtimeModule('routine-state'),
    ]);
  } catch (error) {
    process.stderr.write(`bots: the routine modules did not load: ${error instanceof Error ? error.message : String(error)}\n`);
    return rt.runner.EXIT_CODES.runFailure;
  }
  const context = rt.runner.resolveBotContext({ checkoutRoot, skilledTree, env: resolveEnv });
  if (!context.ok) {
    process.stderr.write(`${describeRefusal(context)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { stateRoot, identity } = context.value;
  let names;
  try {
    names = fs.readdirSync(path.join(checkoutRoot, 'bots'));
  } catch {
    names = [];
  }
  const botIds = names.filter((name) => fs.existsSync(rt.runner.definitionPath(checkoutRoot, name))).sort();
  const rows = [];
  for (const botId of botIds) {
    const read = definition.readDefinition(rt.runner.definitionPath(checkoutRoot, botId));
    if (!read.ok) {
      process.stderr.write(`bots: ${botId} did not read: ${read.reason}\n`);
      continue;
    }
    const routine = read.value.routine;
    if (routine === null) continue;
    // A damaged file reads as every field null, so its row shows the switches
    // alone and never claims an outcome was reached.
    const { state, damaged } = routineState.readRoutineState(stateRoot, identity, botId);
    if (damaged) process.stderr.write(`bots: routine state ${botId} did not read\n`);
    rows.push({
      botId,
      what: routine.what,
      starts: routine.starts.map((start) => ({ ...start, summary: routineModule.describeStart(start) })),
      does: routine.does,
      until: routine.until,
      untilMetAt: state.untilMetAt,
      failureStreak: routineState.failureStreak(stateRoot, identity, botId),
      switch: routineState.routineSwitch(stateRoot, identity, botId, state),
    });
  }
  if (options.json === true) {
    process.stdout.write(`${JSON.stringify({ version: 1, routines: rows }, null, 2)}\n`);
    return 0;
  }
  if (rows.length === 0) {
    process.stdout.write('bots: no routines\n');
    return 0;
  }
  for (const row of rows) {
    const fields = [row.botId, row.starts[0].summary ?? '-', row.does, row.until ?? '-', row.untilMetAt ?? '-', row.switch, `streak ${row.failureStreak}`];
    process.stdout.write(`${fields.join('\t')}\n`);
  }
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
  // A refusal that reads the run marker for answer and enable belongs here, before any
  // runtime work, so a bot's own child cannot answer or re-enable itself.
  if (CHILD_REFUSED_VERBS.has(parsed.verb) && isBotChild(process.env)) {
    process.stderr.write('bots: child-write-refused\n');
    return 2;
  }
  if (parsed.verb === 'run' && parsed.options['schedule-index'] !== undefined && process.env[SCHEDULED_FIRE_ENV] !== '1') {
    return usageExit('--schedule-index is passed only by the installed schedule; run the bot without it');
  }
  if (parsed.verb === 'answer' || parsed.verb === 'run') {
    const actorProblem = checkActorOptions(parsed);
    if (actorProblem) return usageExit(actorProblem.message);
  }
  if (parsed.verb === 'schedule' && parsed.args[0] === 'uninstall' && parsed.options['full-access'] === true) {
    return usageExit('schedule uninstall takes no --full-access');
  }
  if (parsed.verb === 'schedule' && parsed.args[0] === 'install' && parsed.options['full-access'] === true && process.stdin.isTTY !== true) {
    return usageExit('--full-access needs a tty');
  }

  const rt = await loadRuntime();
  const { runner, switches, needsYou } = rt;
  const checkoutRoot = checkoutRootFrom(parsed.options.repo);
  const skilledTree = path.resolve(parsed.options['skilled-tree'] || DEFAULT_SKILLED_TREE);

  // Install compares what the shell and the job's environment resolve, and refuses when they differ.
  if (parsed.verb === 'schedule') return scheduleVerb(rt, parsed, checkoutRoot, skilledTree);
  // Every other verb resolves identity and the state root under the environment launchd gives the
  // job, never the shell's, so the switches it writes, the records it reads and the requests it
  // queues are the ones the jobs see. A verb on one bot reads that bot's job first; the rest read
  // the drain job's, which consumes the queue. A run still executes under the shell's environment.
  const resolveEnv = rt.installer.jobEnv({ checkoutRoot, botId: ON_ONE_BOT.has(parsed.verb) ? parsed.id : rt.installer.DRAIN_ID });
  const env = process.env;
  if (parsed.verb === 'enqueue') return enqueueVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'drain') return drainVerb(rt, checkoutRoot, skilledTree, parsed.options.scheduled === true, resolveEnv);
  if (parsed.verb === 'answer') return answerVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'status') return statusVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'activity') return activityVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'routines') return routinesVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv);

  if (parsed.verb === 'run') {
    const index = parsed.options['schedule-index'];
    const request = index === undefined ? undefined : { kind: 'scheduled', scheduleIndex: Number(index) };
    // launchd starts the job with a bare PATH, so a fire takes the executor path pinned at install.
    const runEnv = request ? rt.installer.scheduledRunEnv({ checkoutRoot, botId: parsed.id, env }) : env;
    const outcome = await runner.runBot({
      checkoutRoot,
      skilledTree,
      botId: parsed.id,
      env: runEnv,
      resolveEnv,
      actor: parsed.options.as === undefined ? undefined : parsed.options.as.trim(),
      ...(request ? { request } : {}),
    });
    const line = describeOutcome(parsed.id, outcome);
    (outcome.kind === 'completed' || outcome.kind === 'awaiting-decision' ? process.stdout : process.stderr).write(`${line}\n`);
    return runner.exitCodeFor(outcome);
  }

  const context = runner.resolveBotContext({ checkoutRoot, skilledTree, env: resolveEnv });
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
    const all = parsed.options.all === true;
    const shown = items.filter((listing) => listing.state !== 'answered' || all);
    if (parsed.options.json === true) {
      // One document, grouped by state: what still needs a person, then what lapsed,
      // then what was answered. Newest first inside a group, so the top row is the
      // one to act on, and the id breaks a tie so the order never depends on the
      // order the folder was listed.
      const newestFirst = (left, right) => {
        if (left.item.createdAt !== right.item.createdAt) return left.item.createdAt < right.item.createdAt ? 1 : -1;
        if (left.item.id === right.item.id) return 0;
        return left.item.id < right.item.id ? -1 : 1;
      };
      const inState = (state) => shown.filter((listing) => listing.state === state).sort(newestFirst);
      const ordered = [...inState('open'), ...inState('expired'), ...(all ? inState('answered') : [])];
      const payload = ordered.map(({ item, state }) => ({
        id: item.id,
        botId: item.botId,
        kind: item.kind ?? null,
        question: item.question,
        state,
        at: item.createdAt,
        options: item.options,
        createdAt: item.createdAt,
        expiresAt: item.expiresAt,
        answer: item.answer,
      }));
      process.stdout.write(`${JSON.stringify({ version: 1, items: payload }, null, 2)}\n`);
    } else {
      if (shown.length === 0) process.stdout.write(all ? 'bots: no needs-you items\n' : 'bots: no open or expired needs-you items\n');
      for (const { item, state } of shown) {
        process.stdout.write(`${state}\t${item.id}\t${item.botId}\tcreated ${item.createdAt}\texpires ${item.expiresAt}\n`);
        process.stdout.write(`\t${item.question}\n`);
        for (const option of item.options ?? []) process.stdout.write(`\t- ${option}\n`);
        if (state === 'answered') process.stdout.write(`\tanswered ${item.answer.answeredAt} by ${item.answer.by ?? '-'} scope ${item.answer.scope}\n`);
      }
    }
    for (const id of unreadable) process.stderr.write(`bots: item ${id} did not read\n`);
    return 0;
  }

  const isDrainJob = parsed.id === rt.installer.DRAIN_ID;
  if ((parsed.verb === 'enable' || parsed.verb === 'disable') && isDrainJob) {
    const result = parsed.verb === 'enable'
      ? rt.installer.enableSchedule({ checkoutRoot, skilledTree, botId: parsed.id, env })
      : rt.installer.disableSchedule({ checkoutRoot, botId: parsed.id, env });
    if (!result.ok) return installerRefusal(rt, result);
    if (!result.value.installed) {
      process.stderr.write('bots: no drain job is installed; run bots schedule install drain\n');
      return runner.EXIT_CODES.refused;
    }
    printSteps(result.value.steps);
    process.stdout.write(`bots: drain ${parsed.verb}d\n`);
    return 0;
  }
  if (!require('node:fs').existsSync(runner.definitionPath(checkoutRoot, parsed.id))) {
    process.stderr.write(`bots: no bot ${parsed.id} at ${runner.definitionPath(checkoutRoot, parsed.id)}\n`);
    if (parsed.verb !== 'disable') return runner.EXIT_CODES.refused;
    // A schedule can outlive its definition, and stopping it must not depend on the file
    // that is gone: only the run-layer switch, which names a bot, is skipped.
    const scheduled = rt.installer.disableSchedule({ checkoutRoot, botId: parsed.id, env });
    if (!scheduled.ok) return installerRefusal(rt, scheduled);
    printSteps(scheduled.value.steps);
    if (!scheduled.value.installed) return runner.EXIT_CODES.refused;
    process.stdout.write(`bots: ${parsed.id} schedule disabled; no run-layer switch was set\n`);
    return 0;
  }
  const kind = parsed.verb === 'disable' || parsed.verb === 'enable' ? 'disabled' : 'paused';
  const set = parsed.verb === 'disable' || parsed.verb === 'pause';
  // An installed schedule is checked again before it may fire, so a failed
  // check leaves the run-layer switch set as well.
  if (parsed.verb === 'enable') {
    const scheduled = rt.installer.enableSchedule({ checkoutRoot, skilledTree, botId: parsed.id, env });
    if (!scheduled.ok) return installerRefusal(rt, scheduled);
    printSteps(scheduled.value.steps);
    if (!scheduled.value.installed) noScheduleWarning(parsed.id);
    // The notice first, then the streak restart, then the switches: a stop
    // between them leaves the bot still stopped, and the restart lands before
    // the switch clears so the old failures are never counted again.
    const routineState = await runtimeModule('routine-state');
    const { state } = routineState.readRoutineState(stateRoot, identity, parsed.id);
    if (state.fatigueItemId !== null) {
      const answered = rt.answer.answerItem({
        checkoutRoot,
        itemId: state.fatigueItemId,
        text: 'enabled',
        env: process.env,
        resolveEnv,
        resume: false,
      });
      if (!answered.ok && answered.reason !== 'item-expired' && answered.reason !== 'item-unknown') {
        process.stderr.write(`${describeRefusal(answered)}\n`);
        return runner.EXIT_CODES.refused;
      }
      if (!answered.ok) process.stderr.write(`bots: item ${state.fatigueItemId} expired; not answered\n`);
    }
    const enabled = routineState.recordEnable(stateRoot, identity, parsed.id);
    if (!enabled.ok) {
      process.stderr.write(`bots: ${enabled.reason}\n`);
      return runner.EXIT_CODES.refused;
    }
  }
  const result = set
    ? switches.setSwitch(stateRoot, identity, parsed.id, kind)
    : switches.clearSwitch(stateRoot, identity, parsed.id, kind);
  if (!result.ok) {
    process.stderr.write(`bots: ${result.reason}\n`);
    return runner.EXIT_CODES.refused;
  }
  process.stdout.write(`bots: ${parsed.id} ${set ? kind : `no longer ${kind}`}\n`);
  if (parsed.verb === 'enable') {
    const cleared = switches.clearSwitch(stateRoot, identity, parsed.id, 'completed');
    if (!cleared.ok) {
      process.stderr.write(`bots: ${cleared.reason}\n`);
      return runner.EXIT_CODES.refused;
    }
  }
  // The run-layer switch is already set, so a scheduler step that fails still leaves the bot stopped.
  if (parsed.verb === 'disable') {
    const scheduled = rt.installer.disableSchedule({ checkoutRoot, botId: parsed.id, env });
    if (!scheduled.ok) return installerRefusal(rt, scheduled);
    printSteps(scheduled.value.steps);
    if (!scheduled.value.installed) noScheduleWarning(parsed.id);
  }
  return 0;
}

// A bot with no schedule is still stopped by the run-layer switch, so the verb
// succeeds; the warning says the scheduler had nothing to stop, so a schedule
// installed under another state root is never taken for stopped in silence.
function noScheduleWarning(id) {
  process.stderr.write(`bots: warning: no installed schedule found for ${id}; only the run-layer switch applies. If a schedule should exist, check bots/config.json stateRoot and XDG_STATE_HOME\n`);
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
