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
  '                 list open and expired needs-you items, each with the kind of',
  '                 action it approves, the rung that made the bot ask and the',
  '                 scope granted; --all adds the answered ones, --json prints one document',
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
  '                 answer a needs-you item and queue the run that continues it, or',
  '                 confirm or reject a memory or skill proposal; --as records who answered',
  '                 and needs a tty unless it is you; --scope records what the',
  '                 answer grants, once or deny, and a NO with no --scope records',
  '                 deny; always and conversation are refused grant-scope-unsupported',
  '                 because no rule store lands',
  '  skill propose <run-id> [--name <skill-name>]',
  '                 write a draft SKILL.md and a proposal.json from one finished run',
  '                 into the state root and raise one review item to answer with',
  '                 confirm or reject; --name defaults to the run\'s bot id, and you',
  '                 move a confirmed draft into .skilled/skills/<name>/ yourself',
  '  chat <id> [--message <text> | --transcript [--json]] [--conversation <name>]',
  '                 talk to a bot: each message is one run, and its reply is the next',
  '                 line of the conversation file. With neither option it opens a loop',
  '                 that /exit or /quit leaves. --message - reads the text from stdin,',
  '                 and a message that starts with @<bot-id> goes to that bot',
  '  remember <fact> [--bot <id>] [--type <type>] [--as <name>]',
  '                 add one fact to the shared memory file, or with --bot to that',
  '                 bot\'s own; --type is user, general, feedback or reference',
  '  remember --list [--bot <id>] [--json]',
  '                 list the facts with their ids; --json prints one document',
  '  remember --forget <entry-id> [--bot <id>]',
  '                 remove the fact whose id --list printed',
  '  channel link <channel> [--secret <name>] [--as <name>]',
  '                 print a one-time code that a chat sends back to link itself to',
  '                 you, or with --as to a roster member, which needs a tty unless',
  '                 it is you; the channel is telegram, slack, signal or whatsapp and',
  '                 --secret names the vault secret it reads, the channel name by default',
  '  channel unlink <channel>',
  '                 switch a channel off and remove its linked chats',
  '  channel roster add <name> [--role owner|member]',
  '  channel roster remove <name>',
  '  channel roster list',
  '                 the only way to write operators.json, who may answer from a chat;',
  '                 --role defaults to member and an owner add replaces the owner',
  '  channel list [--json]',
  '                 each configured channel with its linked chats and queued sends,',
  '                 then one notApprover line per actor a chat refused; --json prints one document',
  '  channel send <channel> <conversation> <text>',
  '                 queue one test message to a linked chat and send it now',
  '  channel drain',
  '                 send every due queued message once; exits 1 when one failed or may',
  '                 have landed, and never resends a message that may have landed',
  '  secret set <name> [--store keychain|file]',
  '                 store one secret in the vault, read from a prompt with echo off,',
  '                 or one piped line, and never from an argument; --store picks',
  '                 the keychain or a 0600 file, the keychain by default when the host has one',
  '  secret list    print each stored name, its store and when it was set, never a value',
  '  secret forget <name>',
  '                 remove a secret from the vault and from both stores',
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
  '  ui [--ascii]   open the terminal screen; the binary is built from .skilled/crates/bots-tui',
  '                 with cargo build --release, NO_COLOR draws it without colour and',
  '                 --ascii draws plain ASCII glyphs',
  '',
  'exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision',
  '',
  'approvals: a bot asks before an action in this order, and the first answer wins:',
  '  1. a kind of action: pay, credentials, delete, send, share or post',
  '  2. a rule, 3. auto-review, 4. extra vigilant',
  'rungs 2 to 4 are not implemented in this phase, because no store supplies them.',
].join('\n');

const COMMON_OPTIONS = ['repo', 'skilled-tree'];
// Options that are switches and take no value.
const FLAG_OPTIONS = new Set(['scheduled', 'rebuild', 'json', 'all', 'full-access', 'ascii', 'list', 'transcript']);
const SCHEDULE_ACTIONS = ['install', 'uninstall'];
const SKILL_ACTIONS = ['propose'];
// The name grammar a skill folder must match, mirroring SKILL_NAME_PATTERN in the runtime's skills
// module. The pattern is repeated here because these refusals run before the runtime loads.
const SKILL_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const ENQUEUE_OPTIONS = ['source', 'event-id', 'key', 'prompt', 'origin', 'fired-slot', 'git-commit'];
const STATUS_OPTIONS = ['rebuild', 'json', 'all', 'unregister'];
const REMEMBER_OPTIONS = ['bot', 'type', 'as', 'list', 'json', 'forget'];
// The transports a channel verb can name, mirroring CONFIGURED_CHANNELS in the runtime's channel
// module. The list is repeated here because these refusals run before the runtime loads.
const CHANNEL_NAMES = ['telegram', 'slack', 'signal', 'whatsapp'];
const ROSTER_ROLES = ['owner', 'member'];
// The name grammar a stored secret must match, mirroring SECRET_NAME_PATTERN in the runtime's
// secrets module. The pattern is repeated here because these refusals run before the runtime loads.
const SECRET_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const SECRET_NAME_MAX = 64;
// The stores a set may name, mirroring SecretBackend in the runtime's secrets module.
const SECRET_STORES = ['keychain', 'file'];
// The longest value a set accepts, counted in code points. The longest piped line it reads before
// refusing. Both mirror the bounds the runtime's secrets module refuses at.
const SECRET_VALUE_MAX_CODE_POINTS = 16_384;
const SECRET_PIPE_MAX_BYTES = 65_536;
// The set refusals that mean the request itself was written wrong, as opposed to a store that broke.
const SECRET_USAGE_REASONS = new Set(['secret-name-invalid', 'secret-empty', 'secret-too-long', 'secret-keychain-unavailable']);
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
  chat: { ids: 1, options: ['message', 'transcript', 'conversation', 'json'] },
  remember: { ids: 1, options: REMEMBER_OPTIONS },
  channel: { ids: 0, options: ['role', 'secret', 'as', 'json'] },
  secret: { ids: 0, options: ['store'] },
  skill: { ids: 2, options: ['name'] },
  schedule: { ids: 2, options: ['full-access'] },
  status: { ids: 0, options: STATUS_OPTIONS },
  activity: { ids: 0, options: ['json'] },
  routines: { ids: 0, options: ['json'] },
  ui: { ids: 0, options: ['ascii'] },
};
// Verbs whose id is a bot, so identity and the state root come from that bot's installed job first.
const ON_ONE_BOT = new Set(['run', 'enable', 'disable', 'pause', 'resume']);
const KNOWN_OPTIONS = new Set([...COMMON_OPTIONS, ...ENQUEUE_OPTIONS, ...STATUS_OPTIONS, 'schedule-index', 'as', 'scope', 'bot', 'type', 'forget', 'role', 'secret', 'store', 'name', 'message', 'conversation', ...FLAG_OPTIONS]);
// The marker a bot schedule's job file sets, the renderer's SCHEDULED_FIRE_ENV. A schedule index
// moves the schedule's slot accounting, so only the installed job may pass one.
const SCHEDULED_FIRE_ENV = 'SKILLED_BOTS_SCHEDULED_FIRE';
// The names an actor may take, mirroring ACTOR_PATTERN in the runtime's actor module. The pattern
// is repeated here because these refusals run before the runtime loads.
const ACTOR_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
// The entry types a memory line may name, mirroring MEMORY_TYPES in the runtime's memory module.
// The list is repeated here because these refusals run before the runtime loads.
const MEMORY_TYPES = ['user', 'general', 'feedback', 'reference'];
// The operator pinned into a job at install time, the runtime's PINNED_OPERATOR_ENV.
const PINNED_OPERATOR_ENV = 'SKILLED_BOTS_OPERATOR';
// Scopes that would grant more than one answer, which this command cannot record.
const UNSUPPORTED_SCOPES = new Set(['always', 'conversation']);
// The scopes an answer may record.
const ANSWER_SCOPES = new Set(['once', 'deny']);
// The write verbs a bot child may not run. Each later write verb joins this list.
const CHILD_REFUSED_VERBS = new Set(['answer', 'enable', 'skill']);
// Free text a person types: a prompt such as "- fix the lint warnings" may start with a dash, and
// a chat message is free text too. A value that is itself one of this CLI's flags still means the
// value was left out.
const FREE_TEXT_OPTIONS = new Set(['prompt', 'origin', 'key', 'message']);
// A terminal wraps a pasted block in these two sequences once bracketed paste is on, so the chat
// loop can tell a paste from a person pressing Enter on each line.
const PASTE_START = '\x1b[200~';
const PASTE_END = '\x1b[201~';

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
    // The refusal stays a parse refusal at exit 2, and its detail says why a standing allow cannot be recorded.
    if (UNSUPPORTED_SCOPES.has(options.scope)) return { message: 'grant-scope-unsupported: no rule store lands in this phase' };
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

// The refusals a remember request gets before any file is read. They run here, before the runtime
// loads, so a malformed request never reaches a memory file.
function checkRemember(parsed) {
  const { options } = parsed;
  const fact = parsed.args[0];
  const list = options.list === true;
  const forget = options.forget !== undefined;
  if (list && forget) return 'remember takes --list or --forget, not both';
  if (list && fact !== undefined) return 'remember --list takes no fact';
  if (forget && fact !== undefined) return 'remember --forget takes no fact';
  if (!list && !forget && (fact === undefined || fact.trim() === '')) return 'remember needs a fact';
  if (options.json === true && !list) return '--json needs --list';
  if (options.type !== undefined && !MEMORY_TYPES.includes(options.type)) return '--type takes user, general, feedback or reference';
  if (forget && !/^[0-9a-f]{8}$/.test(options.forget)) return '--forget takes an entry id';
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

// The refusals a chat request gets before any file is read. They run here, before the runtime
// loads, so a malformed chat request never reaches a conversation file.
function checkChat(ids, options) {
  if (ids.length === 0) return 'chat needs a bot id';
  if (ids.length > 1) return `unexpected argument: ${ids[1]}`;
  if (options.message !== undefined && options.transcript === true) return 'chat takes --message or --transcript, not both';
  if (options.json === true && options.transcript !== true) return '--json needs --transcript';
  if (options.message !== undefined && options.message !== '-' && options.message.trim() === '') return 'chat needs a message';
  return null;
}

// --message - reads the draft from stdin, so a pasted token never sits in a process table. One
// trailing line feed is the end of the line and not part of the message.
function readStdinText() {
  const text = require('node:fs').readFileSync(0, 'utf8');
  return text.replace(/\r?\n$/, '');
}

// The channel group takes a subverb and its operands, so its argv is checked here rather than by
// the id count every other verb uses.
function parseChannel(verb, ids, options) {
  const [sub, ...rest] = ids;
  if (!sub) return { error: 'channel needs link, unlink, roster, list, send or drain' };
  if (options.json !== undefined && sub !== 'list') return { error: `channel ${sub} takes no --json` };
  if (sub === 'link' || sub === 'unlink') {
    if (rest.length === 0) return { error: `channel ${sub} needs a channel: ${CHANNEL_NAMES.join(', ')}` };
    if (rest.length > 1) return { error: `unexpected argument: ${rest[1]}` };
    if (!CHANNEL_NAMES.includes(rest[0])) return { error: `channel ${sub} takes ${CHANNEL_NAMES.join(', ')}` };
    if (options.role !== undefined) return { error: `channel ${sub} takes no --role` };
    if (sub === 'unlink' && options.secret !== undefined) return { error: 'channel unlink takes no --secret' };
    if (sub === 'unlink' && options.as !== undefined) return { error: 'channel unlink takes no --as' };
    return { verb, id: undefined, args: [sub, rest[0]], options };
  }
  if (sub === 'roster') {
    const [action, ...names] = rest;
    if (!action) return { error: 'channel roster needs add, remove or list' };
    if (!['add', 'remove', 'list'].includes(action)) return { error: `unknown channel roster verb: ${action}` };
    if (options.secret !== undefined) return { error: 'channel roster takes no --secret' };
    if (options.as !== undefined) return { error: 'channel roster takes no --as' };
    if (action !== 'add' && options.role !== undefined) return { error: `channel roster ${action} takes no --role` };
    if (action === 'list') {
      if (names.length > 0) return { error: `unexpected argument: ${names[0]}` };
      return { verb, id: undefined, args: ['roster', 'list'], options };
    }
    if (names.length === 0) return { error: `channel roster ${action} needs a name` };
    if (names.length > 1) return { error: `unexpected argument: ${names[1]}` };
    const name = names[0].trim();
    if (!ACTOR_PATTERN.test(name)) return { error: 'channel roster takes a name' };
    if (options.role !== undefined && !ROSTER_ROLES.includes(options.role)) return { error: '--role takes owner or member' };
    return { verb, id: undefined, args: ['roster', action, name], options };
  }
  if (sub === 'list') {
    if (rest.length > 0) return { error: `unexpected argument: ${rest[0]}` };
    const given = ['role', 'secret', 'as'].find((name) => options[name] !== undefined);
    if (given) return { error: `channel list takes no --${given}` };
    return { verb, id: undefined, args: ['list'], options };
  }
  if (sub === 'send') {
    const given = ['role', 'secret', 'as'].find((name) => options[name] !== undefined);
    if (given) return { error: `channel send takes no --${given}` };
    if (rest.length < 3 || rest[1].trim() === '') return { error: 'channel send needs a channel, a conversation and the text' };
    if (rest.length > 3) return { error: `unexpected argument: ${rest[3]}` };
    if (!CHANNEL_NAMES.includes(rest[0])) return { error: `channel send takes ${CHANNEL_NAMES.join(', ')}` };
    if (rest[2].trim() === '') return { error: 'channel send needs the text' };
    return { verb, id: undefined, args: ['send', rest[0], rest[1].trim(), rest[2]], options };
  }
  if (sub === 'drain') {
    if (rest.length > 0) return { error: `unexpected argument: ${rest[0]}` };
    const given = ['role', 'secret', 'as'].find((name) => options[name] !== undefined);
    if (given) return { error: `channel drain takes no --${given}` };
    return { verb, id: undefined, args: ['drain'], options };
  }
  return { error: `unknown channel verb: ${sub}` };
}

// The secret group takes a subverb and its operands, so its argv is checked here rather than by the
// id count every other verb uses. The name grammar is checked later, beside the store, so a name
// that fails it is refused with the reason the store itself would give.
function parseSecret(verb, ids, options) {
  const [sub, ...rest] = ids;
  if (!sub) return { error: 'secret needs set, list or forget' };
  if (!['set', 'list', 'forget'].includes(sub)) return { error: `unknown secret verb: ${sub}` };
  if (sub === 'list') {
    if (rest.length > 0) return { error: `unexpected argument: ${rest[0]}` };
    if (options.store !== undefined) return { error: 'secret list takes no --store' };
    return { verb, id: undefined, args: ['list'], options };
  }
  if (sub === 'forget' && options.store !== undefined) return { error: 'secret forget takes no --store' };
  if (rest.length === 0) return { error: `secret ${sub} needs a name` };
  if (rest.length > 1) return { error: `unexpected argument: ${rest[1]}` };
  if (sub === 'set' && options.store !== undefined && !SECRET_STORES.includes(options.store)) {
    return { error: '--store takes keychain or file' };
  }
  return { verb, id: undefined, args: [sub, rest[0]], options };
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
  if (verb === 'chat') {
    const problem = checkChat(ids, options);
    if (problem) return { error: problem };
    return { verb, id: ids[0], args: [], options };
  }
  if (verb === 'schedule') {
    if (ids.length === 0 || !SCHEDULE_ACTIONS.includes(ids[0])) return { error: `schedule needs ${SCHEDULE_ACTIONS.join(' or ')}` };
    if (!ids[1]) return { error: `schedule ${ids[0]} needs a bot id, or drain` };
    if (ids.length > 2) return { error: `unexpected argument: ${ids[2]}` };
    return { verb, id: ids[1], args: [ids[0]], options };
  }
  if (verb === 'skill') {
    if (ids.length === 0) return { error: `skill needs ${SKILL_ACTIONS.join(' or ')}` };
    if (!SKILL_ACTIONS.includes(ids[0])) return { error: `unknown action: ${ids[0]}` };
    if (!ids[1]) return { error: `skill ${ids[0]} needs a run id` };
    if (ids.length > 2) return { error: `unexpected argument: ${ids[2]}` };
    if (options.name !== undefined && !SKILL_NAME_PATTERN.test(options.name)) return { error: '--name takes a skill name' };
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
  if (verb === 'channel') return parseChannel(verb, ids, options);
  if (verb === 'secret') return parseSecret(verb, ids, options);
  if (verb === 'remember') {
    if (ids.length > 1) return { error: `unexpected argument: ${ids[1]}` };
    return { verb, id: undefined, args: ids.slice(0, 1), options };
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

async function loadRuntimeOnce() {
  // A global loader, not a namespaced import: the runtime requires the deep-loop
  // CommonJS scripts, which a namespaced loader cannot resolve.
  const { register } = require(require.resolve('tsx/esm/api', { paths: [RUNTIME] }));
  register();
  const load = runtimeModule;
  const [runner, switches, needsYou, queue, drain, answer, installer, memory, actor, dispatch, repoConfig, stateRoot, identity, secrets, skillProposal, conversation] = await Promise.all([
    load('runner'),
    load('switches'),
    load('needs-you'),
    load('request-queue'),
    load('request-drain'),
    load('answer'),
    load('installer'),
    load('memory'),
    load('actor'),
    load('dispatch'),
    load('repo-config'),
    load('state-root'),
    load('identity'),
    load('secrets'),
    load('skill-proposal'),
    load('conversation'),
  ]);
  return { runner, switches, needsYou, queue, drain, answer, installer, memory, actor, dispatch, repoConfig, stateRoot, identity, secrets, skillProposal, conversation };
}

// One process registers the TypeScript loader once, however many verbs it runs.
let runtimeLoad = null;
function loadRuntime() {
  if (runtimeLoad === null) runtimeLoad = loadRuntimeOnce();
  return runtimeLoad;
}

// The payload contract the screen binary must speak. It is read from the runtime
// module rather than repeated here, so the verb and the binary cannot drift apart
// on a number this file would have to remember.
async function readPayloadContract() {
  const { register } = require(require.resolve('tsx/esm/api', { paths: [RUNTIME] }));
  register();
  const contract = await runtimeModule('contract');
  return contract.PAYLOAD_CONTRACT;
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

function answerVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv) {
  const result = rt.answer.answerItem({
    checkoutRoot,
    skilledTree,
    itemId: parsed.id,
    text: parsed.args[0],
    env: process.env,
    resolveEnv,
    surface: 'terminal',
    actor: parsed.options.as === undefined ? undefined : parsed.options.as.trim(),
    scope: parsed.options.scope,
  });
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { status, requestId, itemId } = result.value;
  // A review item settles in place and queues no resume, so it reports the kind that settled it.
  if (status === 'reviewed') {
    process.stdout.write(`bots: item ${itemId} answered; ${result.value.kind ?? 'decision'} review recorded\n`);
    return 0;
  }
  const sent = status === 'duplicate' ? 'duplicate: already queued' : 'enqueued';
  process.stdout.write(`bots: item ${itemId} answered; resume request ${requestId} ${sent}\n`);
  return 0;
}

// A proposal is written under the state root the drain job reads, so the review item lands in the
// inbox the scheduled jobs see. Nothing is created before the run record reads, so a refusal writes nothing.
function skillVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv) {
  const context = rt.runner.resolveBotContext({ checkoutRoot, skilledTree, env: resolveEnv });
  if (!context.ok) {
    process.stderr.write(`${describeRefusal(context)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { stateRoot, identity, config } = context.value;
  const result = rt.skillProposal.writeProposal({
    stateRoot,
    identity,
    checkoutRoot,
    skilledTree,
    runId: parsed.id,
    name: parsed.options.name ?? null,
    expiryDays: config.needsYou.expiryDays,
    env: process.env,
  });
  if (!result.ok) {
    process.stderr.write(`${describeRefusal(result)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  process.stdout.write(`bots: proposal for skill ${result.value.name} written at proposals/${parsed.id}\n`);
  return 0;
}

// Stdout carries only the conversation, so a piped session holds the messages and nothing else. A message that
// holds line feeds prints each later line on a line of its own, indented four spaces.
function printMessageLine(stream, head, text) {
  const [first, ...rest] = text.split('\n');
  stream.write(`${head}${first}\n`);
  for (const line of rest) stream.write(`    ${line}\n`);
}

// One message is one run. The message is appended first and then exactly that request is drained, so the
// reply printed here answers this message and never another conversation's.
async function chatVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv) {
  const conversationId = parsed.options.conversation ?? parsed.id;
  if (!rt.stateRoot.isSafeSegment(conversationId)) return usageExit('--conversation takes a safe name');
  const context = rt.runner.resolveBotContext({ checkoutRoot, skilledTree, env: resolveEnv });
  if (!context.ok) {
    process.stderr.write(`${describeRefusal(context)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  // The positional bot is checked before the loop starts or a message is read, and printed with its control characters dropped.
  if (!rt.conversation.botDefined(checkoutRoot, parsed.id)) {
    process.stderr.write(`bots: bot-unknown: ${rt.conversation.cleanMessageText(parsed.id)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { stateRoot, identity } = context.value;
  const file = rt.conversation.conversationFile(stateRoot, identity, conversationId);
  if (!file.ok) return usageExit('--conversation takes a safe name');
  const chat = { rt, checkoutRoot, skilledTree, resolveEnv, stateRoot, identity, conversationId, defaultBot: parsed.id, path: file.value };
  if (parsed.options.transcript === true) return transcriptVerb(chat, parsed.options.json === true);
  if (parsed.options.message !== undefined) {
    const text = parsed.options.message === '-' ? readStdinText() : parsed.options.message;
    return sendMessage(chat, text, false);
  }
  return chatLoop(chat);
}

// The transcript prints what is stored, verbatim, so an injection attempt reads back exactly as it was
// typed and never as something this verb made of it. A missing file prints the empty shape and creates
// nothing, because a read is never a write.
function transcriptVerb(chat, json) {
  const read = chat.rt.conversation.readConversation(chat.path);
  if (read.skippedLines > 0) {
    const torn = read.torn ? ', the last one torn' : '';
    process.stderr.write(`bots: ${read.skippedLines} line(s) of ${chat.path} did not parse and were skipped${torn}\n`);
  }
  if (json) {
    process.stdout.write(`${JSON.stringify({ version: 1, conversationId: chat.conversationId, messages: read.messages }, null, 2)}\n`);
    return 0;
  }
  const unanswered = chat.rt.conversation.unansweredIds(read.messages);
  for (const message of read.messages) {
    const at = message.at.replace(/\.\d+Z$/, 'Z');
    const head = message.role === 'human' ? `${at} ${message.by} → ${message.botId}: ` : `${at} ${message.botId} › `;
    const text = message.role === 'human' && unanswered.has(message.id) ? `${message.text} (no reply yet)` : message.text;
    printMessageLine(process.stdout, head, text);
  }
  return 0;
}

// The loop keeps one conversation open at a terminal: readline holds the history and completes the
// commands and the bot addresses, and every line is classified before it is dispatched, so a command
// never reaches a run. Its exit is 0 however its runs ended, because each run's outcome is already a
// message in the file.
async function chatLoop(chat) {
  const readline = require('node:readline');
  const tty = process.stdin.isTTY === true;
  const bots = chat.rt.conversation.listBots(chat.checkoutRoot);
  const commands = ['/exit', '/quit', '/help'];
  // The completer sees the whole line, so a command completes only while the line is still that
  // command and an address completes only until the first space.
  const completer = (line) => {
    const lead = line.replace(/^\s+/, '');
    if (lead.startsWith('/')) return [commands.filter((c) => c.startsWith(lead)), lead];
    if (lead.startsWith('@') && !/\s/.test(lead)) return [bots.map((b) => `@${b} `).filter((c) => c.startsWith(lead)), lead];
    return [[], line];
  };
  // The opening line and the prompt are drawn only for a person at a terminal, so a piped session
  // holds the messages and nothing else.
  if (tty) {
    const count = chat.rt.conversation.readConversation(chat.path).messages.length;
    process.stderr.write(`bots: chat ${chat.defaultBot} · conversation ${chat.conversationId} · ${count} messages · /help lists the commands\n`);
  }
  const rl = readline.createInterface({ input: process.stdin, output: tty ? process.stdout : undefined, terminal: tty, historySize: 1000, completer, prompt: `[${chat.defaultBot}] > ` });
  // Bracketed paste is on only at a terminal, so a pasted block arrives as one draft instead of one
  // line per Enter, and it is turned off in a finally so a failed run never leaves it on.
  if (tty) process.stdout.write('\x1b[?2004h');
  // Ctrl+C at an empty prompt leaves with exit 0, and inside a draft it clears the line instead, so a
  // half-typed message is never lost to a stray interrupt.
  rl.on('SIGINT', () => {
    if (rl.line === '') {
      rl.close();
    } else {
      rl.write(null, { ctrl: true, name: 'u' });
      rl.prompt();
    }
  });
  let keyPasting = false;
  let markerPasting = false;
  let draft = [];
  // The tag is taken when readline emits the line, because the loop body runs later than that, and by
  // then a short paste has already ended and the flag is back to false.
  const pasteTags = [];
  // readline swallows the two sequences at a terminal and emits each pasted line on its own, so the
  // keys are the only place the loop can see where a paste starts and where it ends.
  if (tty) {
    process.stdin.on('keypress', (_text, key) => {
      if (key && key.name === 'paste-start') keyPasting = true;
      else if (key && key.name === 'paste-end') keyPasting = false;
    });
    rl.on('line', () => { pasteTags.push(keyPasting); });
  }
  if (tty) rl.prompt();
  try {
    for await (const raw of rl) {
      // A paste is one draft: the bytes between the two sequences keep their line feeds, and the
      // Enter after them sends the whole block as one message, so a pasted stack trace starts one
      // run and not one run per line. The handling follows a reference under another licence by
      // design only and copies no code.
      const keyPasted = tty ? pasteTags.shift() === true : false;
      let line = raw;
      if (line.includes(PASTE_START)) { markerPasting = true; line = line.split(PASTE_START).join(''); }
      if (line.includes(PASTE_END)) { markerPasting = false; line = line.split(PASTE_END).join(''); }
      if (keyPasted || markerPasting) { draft.push(line); continue; }
      const text = [...draft, line].join('\n').replace(/\n+$/, '');
      draft = [];
      const command = chatCommand(text);
      if (command === 'exit') break;
      if (command === 'help') {
        const help = [
          '/exit or /quit leaves, and so do Ctrl+D and Ctrl+C at an empty prompt',
          '/help prints this list',
          'a line that starts with @<bot-id> sends that one message to that bot',
          'a line that starts with / is a command, so send such a message with --message',
        ];
        for (const line of help) process.stderr.write(`bots: ${line}\n`);
      } else if (command === 'unknown') {
        process.stderr.write(`bots: unknown command: ${chat.rt.conversation.cleanMessageText(text.trim().split(/\s/)[0])}\n`);
      } else if (command === 'send') {
        // A run takes the terminal out of raw mode, so Ctrl+C reaches the whole foreground group as it
        // does for bots run, and the mode comes back in a finally so a failed run never leaves it off.
        if (tty) process.stdin.setRawMode(false);
        try {
          await sendMessage(chat, text, true);
        } finally {
          if (tty) process.stdin.setRawMode(true);
        }
      }
      if (tty) rl.prompt();
    }
  } finally {
    if (tty) process.stdout.write('\x1b[?2004l');
  }
  rl.close();
  return 0;
}

// A line is classified before it is dispatched, so a command never reaches a run and a message that has
// to start with a slash is sent with --message instead.
function chatCommand(text) {
  const trimmed = text.trim();
  if (trimmed === '') return 'skip';
  if (!trimmed.startsWith('/')) return 'send';
  const word = trimmed.split(/\s/)[0].toLowerCase();
  if (word === '/exit' || word === '/quit') return 'exit';
  if (word === '/help') return 'help';
  return 'unknown';
}

// The append is the commit point, so every refusal runs before it and a refused message leaves no line and
// starts no run. From the append on, a failure still leaves the human message in the file, which the
// transcript reports as unanswered rather than dispatching it a second time.
async function sendMessage(chat, rawText, inLoop) {
  const known = chat.rt.dispatch.collectAllKnownSecrets(process.env, chat.checkoutRoot, chat.stateRoot, chat.identity);
  if (!known.ok) {
    process.stderr.write(`${describeRefusal(known)}\n`);
    return chat.rt.runner.EXIT_CODES.refused;
  }
  const actor = chat.rt.actor.resolveActor({ env: process.env, scheduled: false });
  const by = actor.ok && actor.value !== null ? actor.value : 'unknown';
  const prepared = chat.rt.conversation.prepareHumanMessage({
    checkoutRoot: chat.checkoutRoot,
    stateRoot: chat.stateRoot,
    identity: chat.identity,
    conversationId: chat.conversationId,
    defaultBot: chat.defaultBot,
    text: rawText,
    by,
    known: known.value,
    stamp: chat.rt.runner.newRunId(),
  });
  if (!prepared.ok) {
    if (prepared.reason === 'message-empty') {
      if (inLoop) return 0;
      return usageExit('chat needs a message');
    }
    if (prepared.reason === 'address-without-message') {
      const line = `chat needs a message after ${prepared.detail}`;
      if (inLoop) {
        process.stderr.write(`bots: ${line}\n`);
        return chat.rt.runner.EXIT_CODES.usage;
      }
      return usageExit(line);
    }
    if (prepared.reason === 'bot-unknown') {
      process.stderr.write(`bots: bot-unknown: ${prepared.detail}\n`);
      return chat.rt.runner.EXIT_CODES.refused;
    }
    process.stderr.write(`${describeRefusal(prepared)}\n`);
    return chat.rt.runner.EXIT_CODES.refused;
  }
  const { path: conversationPath, message, block, botId } = prepared.value;
  const appended = chat.rt.conversation.appendMessage(conversationPath, message);
  if (!appended.ok) {
    process.stderr.write(`${describeRefusal(appended)}\n`);
    return chat.rt.runner.EXIT_CODES.runFailure;
  }
  const queued = chat.rt.queue.enqueueFromCheckout(chat.checkoutRoot, {
    kind: 'run',
    workflowId: botId,
    source: chat.rt.conversation.CHAT_SOURCE,
    eventId: message.id,
    prompt: block,
    origin: `conversation ${chat.conversationId}`,
    conversationId: chat.conversationId,
  }, chat.resolveEnv);
  if (!queued.ok) {
    process.stderr.write(`${describeRefusal(queued)}\n`);
    return chat.rt.runner.EXIT_CODES.runFailure;
  }
  const requestId = queued.value.requestId;
  if (queued.value.status === 'duplicate') {
    process.stderr.write(`bots: ${requestId} duplicate\n`);
    return chat.rt.runner.EXIT_CODES.runFailure;
  }
  process.stderr.write(`· ${botId} · working…\n`);
  const drained = await chat.rt.drain.drainQueue({
    checkoutRoot: chat.checkoutRoot,
    skilledTree: chat.skilledTree,
    env: process.env,
    resolveEnv: chat.resolveEnv,
    requestIds: [requestId],
  });
  if (!drained.ok) {
    process.stderr.write(`${describeRefusal(drained)}\n`);
    return chat.rt.runner.EXIT_CODES.runFailure;
  }
  const line = drained.value.lines.find((entry) => entry.requestId === requestId);
  if (line === undefined) {
    process.stderr.write(`bots: ${requestId} was not drained, the next drain runs it\n`);
    return chat.rt.runner.EXIT_CODES.runFailure;
  }
  if (line.outcome === 'lost-claim') {
    process.stderr.write(`bots: ${requestId} lost-claim\n`);
    return chat.rt.runner.EXIT_CODES.runFailure;
  }
  if (line.reply !== null) printMessageLine(process.stdout, `${line.reply.botId} › `, line.reply.text);
  if (line.outcome === 'ran' && line.run !== null) {
    if (line.run.kind === 'completed') return chat.rt.runner.EXIT_CODES.completed;
    if (line.run.kind === 'awaiting-decision') {
      process.stderr.write(`bots: answer it with: bots answer ${line.run.itemId} <text>\n`);
      return chat.rt.runner.EXIT_CODES.awaitingDecision;
    }
  }
  return chat.rt.runner.EXIT_CODES.runFailure;
}

// The memory verb writes where a confirmed proposal writes, so it resolves the state root under the
// drain job's environment. A shared fact needs no identity, because the shared file sits beside the
// identity folders and a checkout with no identity can still keep shared memory.
async function rememberVerb(rt, parsed, checkoutRoot, resolveEnv) {
  const { options } = parsed;
  const bot = options.bot;
  if (bot !== undefined && !rt.stateRoot.isSafeSegment(bot)) {
    process.stderr.write(`bots: bot-id-invalid: ${bot}\n`);
    return 2;
  }
  const list = options.list === true;
  const forget = options.forget !== undefined;
  // The length check runs before any file is read, so an oversized fact costs no read.
  const fact = list || forget ? null : rt.memory.collapseText(parsed.args[0]);
  if (fact !== null && fact.length > rt.memory.MEMORY_LIMITS.text) {
    process.stderr.write(`bots: memory-entry-too-long: ${fact.length}\n`);
    return 2;
  }
  const config = rt.repoConfig.readRepoConfig(checkoutRoot);
  if (!config.ok) {
    process.stderr.write(`${describeRefusal(config)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const stateRoot = rt.stateRoot.userStateRoot(config.value, resolveEnv);
  let path;
  // The vault belongs to the identity, so a checkout with no identity has none and shared memory
  // still works. A --bot run resolves the identity anyway, and reusing that answer keeps one lookup.
  let vaultIdentity = null;
  if (bot === undefined) {
    path = rt.memory.sharedMemoryFile(stateRoot);
  } else {
    const identity = rt.identity.resolveIdentity({ checkoutRoot, config: config.value, env: resolveEnv });
    if (!identity.ok) {
      process.stderr.write(`${describeRefusal(identity)}\n`);
      return rt.runner.EXIT_CODES.refused;
    }
    vaultIdentity = identity.value.identity;
    const file = rt.memory.botMemoryFile(stateRoot, identity.value.identity, bot);
    if (!file.ok) {
      process.stderr.write(`bots: bot-id-invalid: ${bot}\n`);
      return 2;
    }
    path = file.value;
  }
  const limits = rt.memory.MEMORY_LIMITS;
  try {
    if (list) {
      const read = rt.memory.readMemoryFile(path);
      if (options.json === true) {
        const entries = read.entries.map(({ index, id, type, date, actor, source, text }) => ({ index, id, type, date, actor, source, text }));
        const document = {
          version: 1,
          botId: bot ?? null,
          path,
          entries,
          entryCount: read.entries.length,
          byteCount: read.byteCount,
          skippedLines: read.skippedLines,
        };
        process.stdout.write(`${JSON.stringify(document)}\n`);
        return 0;
      }
      if (!require('node:fs').existsSync(path)) {
        process.stdout.write(`bots: no memory in ${path}\n`);
        return 0;
      }
      const skipped = read.skippedLines === 0 ? '' : read.skippedLines === 1 ? ', 1 line skipped' : `, ${read.skippedLines} lines skipped`;
      process.stdout.write(`bots: ${path} (${read.entries.length} of ${limits.entries} entries, ${read.byteCount} of ${limits.bytes} bytes${skipped})\n`);
      for (const entry of read.entries) {
        process.stdout.write(`\t${[entry.id, entry.type, entry.date, entry.actor, entry.source, entry.text].join('\t')}\n`);
      }
      return 0;
    }
    if (forget) {
      const id = options.forget;
      const result = rt.memory.forgetMemoryEntry(path, id);
      if (!result.ok) {
        if (result.reason === 'memory-entry-unknown') {
          process.stderr.write(`bots: memory-entry-unknown: ${id}\n`);
          return 2;
        }
        process.stderr.write(`${describeRefusal(result)}\n`);
        return rt.runner.EXIT_CODES.refused;
      }
      const { entryCount, byteCount } = result.value;
      process.stdout.write(`bots: entry ${id} forgotten from ${path} (${entryCount} of ${limits.entries} entries, ${byteCount} of ${limits.bytes} bytes)\n`);
      return 0;
    }
    const actor = rt.actor.resolveActor({
      as: options.as === undefined ? null : options.as.trim(),
      env: process.env,
      scheduled: false,
    });
    if (!actor.ok) {
      process.stderr.write(`${describeRefusal(actor)}\n`);
      return 2;
    }
    // A fact is checked against every value the vault holds, not only the environment's, because a
    // stored key would otherwise reach a prompt through the memory file. A vault that cannot be read
    // refuses the write, since a check that dropped it would pass the very value it exists to stop.
    if (vaultIdentity === null) {
      const vault = rt.identity.resolveIdentity({ checkoutRoot, config: config.value, env: resolveEnv });
      vaultIdentity = vault.ok ? vault.value.identity : null;
    }
    const allKnown = rt.dispatch.collectAllKnownSecrets(process.env, checkoutRoot, stateRoot, vaultIdentity);
    if (!allKnown.ok) {
      process.stderr.write(`bots: secret-store-unreadable: ${allKnown.detail}\n`);
      return rt.runner.EXIT_CODES.refused;
    }
    const match = rt.dispatch.findSecretLiteral(fact, allKnown.value);
    if (match !== null) {
      process.stderr.write(`bots: memory-secret: ${match.name}\n`);
      return rt.runner.EXIT_CODES.refused;
    }
    const result = rt.memory.appendMemoryEntry(path, {
      type: options.type ?? 'general',
      date: new Date().toISOString().slice(0, 10),
      actor: actor.value ?? 'unknown',
      source: 'bots remember',
      text: fact,
    }, { botId: bot ?? null });
    if (!result.ok) {
      process.stderr.write(`${describeRefusal(result)}\n`);
      return rt.runner.EXIT_CODES.refused;
    }
    const { index, entryCount, byteCount } = result.value;
    process.stdout.write(`bots: entry ${index} in ${path} (${entryCount} of ${limits.entries} entries, ${byteCount} of ${limits.bytes} bytes)\n`);
    return 0;
  } catch (error) {
    process.stderr.write(`bots: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

// The transport table the channel verbs send through, keyed by channel name. Each transport adds its
// own entry here, and until one does, a queued message for its channel stays queued.
const CHANNEL_TRANSPORTS = Object.freeze({});

// The channel verbs write the roster, the channel config and the link record under the drain job's
// environment, the same place the answer path reads the roster from, so the two never disagree.
async function channelVerb(rt, parsed, checkoutRoot, resolveEnv, transports, io) {
  const context = rt.queue.queueContext(checkoutRoot, resolveEnv);
  if (!context.ok) {
    io.stderr.write(`${describeRefusal(context)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const { identity, stateRoot } = context.value;
  const [channel, link, queue, approval] = await Promise.all([runtimeModule('channel'), runtimeModule('channel-link'), runtimeModule('channel-queue'), runtimeModule('channel-approval')]);
  const [sub, first, second] = parsed.args;
  const refused = rt.runner.EXIT_CODES.refused;
  let result;
  if (sub === 'list') {
    const config = channel.readChannelConfig(stateRoot, identity);
    if (!config.ok) {
      io.stderr.write(`${describeRefusal(config)}\n`);
      return refused;
    }
    const links = link.readLinks(stateRoot, identity);
    if (!links.ok) {
      io.stderr.write(`${describeRefusal(links)}\n`);
      return refused;
    }
    const index = approval.readApprovalIndex(stateRoot, identity);
    if (!index.ok) {
      io.stderr.write(`${describeRefusal(index)}\n`);
      return refused;
    }
    const entries = queue.listQueueEntries(stateRoot, identity);
    const rows = Object.keys(config.value.channels).sort().map((name) => {
      const entry = config.value.channels[name];
      const linkedChats = Object.values(links.value.links).filter((record) => record.channel === name).length;
      const queueDepth = entries.filter((queued) => queued.channel === name && (queued.state === 'queued' || queued.state === 'sending')).length;
      return { name, enabled: entry.enabled, secret: entry.secret, linkedChats, queueDepth };
    });
    if (parsed.options.json === true) {
      io.stdout.write(`${JSON.stringify({ version: 1, channels: rows })}\n`);
      return 0;
    }
    if (rows.length === 0) io.stderr.write('bots: no channel configured\n');
    for (const row of rows) {
      io.stdout.write(`${row.name} ${row.enabled ? 'enabled' : 'disabled'} secret ${row.secret} linked ${row.linkedChats} queued ${row.queueDepth}\n`);
    }
    const notApprover = index.value.index.notApprover;
    for (const actor of Object.keys(notApprover).sort()) {
      const { failures } = notApprover[actor];
      if (failures > 0) io.stdout.write(`notApprover ${actor} ${failures}\n`);
    }
    return 0;
  }
  if (sub === 'drain') {
    const report = await queue.drainQueue({ stateRoot, identity, transports, hooks: drainHooks(approval, stateRoot, identity) });
    for (const line of report.lines) {
      const note = line.note === null ? '' : ` (${line.note})`;
      io.stdout.write(`bots: channel ${line.channel}: ${line.key} ${line.state}${note}\n`);
    }
    for (const entry of report.unknown) io.stderr.write(`${queue.m21Line(entry)}\n`);
    if (report.refusal !== null) {
      io.stderr.write(`bots: ${report.refusal.reason}: ${report.refusal.detail}\n`);
      return refused;
    }
    // An entry that merely stays queued changes no exit code.
    return report.failed > 0 || report.unknown.length > 0 ? 1 : 0;
  }
  if (sub === 'send') {
    const [name, conversation, text] = parsed.args.slice(1);
    const links = link.readLinks(stateRoot, identity);
    if (!links.ok) {
      io.stderr.write(`${describeRefusal(links)}\n`);
      return refused;
    }
    if (links.value.links[link.linkKey(name, conversation)] === undefined) {
      io.stderr.write(`bots: channel-unlinked: ${name}:${conversation}\n`);
      return refused;
    }
    const known = rt.dispatch.collectAllKnownSecrets(io.env, checkoutRoot, stateRoot, identity);
    if (!known.ok) {
      io.stderr.write(`${describeRefusal(known)}\n`);
      return refused;
    }
    const hit = rt.dispatch.findSecretLiteral(text, known.value);
    if (hit !== null) {
      io.stderr.write(`bots: channel-send-secret: the text holds a literal of ${hit.kind} ${hit.name}\n`);
      return refused;
    }
    const now = new Date();
    const key = queue.sendKey(name, conversation, text, now);
    const queued = queue.enqueueChannel({ stateRoot, identity, key, channel: name, conversationId: conversation, text, now });
    if (!queued.ok) {
      io.stderr.write(`${describeRefusal(queued)}\n`);
      return refused;
    }
    const report = await queue.drainQueue({ stateRoot, identity, transports, only: key, now, hooks: drainHooks(approval, stateRoot, identity) });
    for (const entry of report.unknown) io.stderr.write(`${queue.m21Line(entry)}\n`);
    if (report.refusal !== null) {
      io.stderr.write(`bots: ${report.refusal.reason}: ${report.refusal.detail}\n`);
      return refused;
    }
    const final = queue.readQueueEntry(stateRoot, identity, key);
    const state = final.ok ? final.value.state : 'unknown';
    io.stdout.write(`bots: channel ${name}: ${key} ${state}\n`);
    // A second send inside one minute is the same key, so it enqueues nothing and sends nothing again.
    return state === 'delivered' ? 0 : 1;
  }
  if (sub === 'link') {
    const actor = rt.actor.resolveActor({
      as: parsed.options.as === undefined ? null : parsed.options.as.trim(),
      env: io.env,
      scheduled: false,
    });
    if (!actor.ok) {
      io.stderr.write(`${describeRefusal(actor)}\n`);
      return 2;
    }
    result = link.startLink({ stateRoot, identity, channel: first, actor: actor.value, secret: parsed.options.secret ?? null });
    if (result.ok) io.stdout.write(`${channel.REPLIES.M09({ channel: first, code: result.value.code })}\n`);
  } else if (sub === 'unlink') {
    result = link.unlinkChannel(stateRoot, identity, first);
  } else if (first === 'list') {
    const roster = link.readRoster(stateRoot, identity);
    if (roster === null) {
      io.stderr.write('bots: no roster\n');
      return 0;
    }
    io.stdout.write(`owner ${roster.owner}\n`);
    for (const member of roster.members) io.stdout.write(`member ${member}\n`);
    return 0;
  } else if (first === 'add') {
    result = link.rosterAdd(stateRoot, identity, second, parsed.options.role ?? 'member');
  } else {
    result = link.rosterRemove(stateRoot, identity, second);
    if (result.ok && !result.value.removed) io.stderr.write(`bots: ${second} is not on the roster\n`);
  }
  if (!result.ok) {
    io.stderr.write(`${describeRefusal(result)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  return 0;
}

// The drain writes a prompt's approval index entry before it goes sending and removes it when the send fails, because the queue module may not import the approval module.
function drainHooks(approval, stateRoot, identity) {
  return {
    beforeSend: (entry) => {
      const written = approval.writePromptEntry({ stateRoot, identity, itemId: entry.itemId, channel: entry.channel, conversation: entry.conversationId });
      return written.ok ? { ok: true, value: { choices: written.value.choices } } : written;
    },
    afterFailed: (entry) => { approval.removePromptEntry(stateRoot, identity, entry.itemId); },
  };
}

// The body of every channel verb. It takes the transport table and writes only to the streams it is
// given, so this file passes the real table and a test passes a fake one without spawning the CLI.
async function runChannelVerb(argv, transports, io = {}) {
  const env = io.env ?? process.env;
  const stdout = io.stdout ?? process.stdout;
  const stderr = io.stderr ?? process.stderr;
  const parsed = parseArgs(argv);
  if (parsed.help) { stdout.write(`${USAGE}\n`); return 0; }
  const problem = parsed.error ?? (parsed.verb === 'channel' ? null : 'runChannelVerb takes the channel verb');
  if (problem) { stderr.write(`bots: ${problem}\n`); stderr.write(`${USAGE}\n`); return 2; }
  // A bot child that linked a chat or wrote the roster could answer its own questions, so the
  // channel group writes nothing inside a bot run. Listing the roster is a read and stays open.
  const read = (parsed.args[0] === 'roster' && parsed.args[1] === 'list') || parsed.args[0] === 'list';
  if (!read && isBotChild(env)) { stderr.write('bots: child-write-refused: channel runs no write inside a bot run\n'); return 2; }
  const actorProblem = checkActorOptions(parsed);
  if (actorProblem) { stderr.write(`bots: ${actorProblem.message}\n`); stderr.write(`${USAGE}\n`); return 2; }
  const rt = await loadRuntime();
  const checkoutRoot = checkoutRootFrom(parsed.options.repo);
  const resolveEnv = rt.installer.jobEnv({ checkoutRoot, botId: rt.installer.DRAIN_ID, env });
  try {
    return await channelVerb(rt, parsed, checkoutRoot, resolveEnv, transports, { env, stdout, stderr });
  } catch (error) {
    stderr.write(`bots: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

// The secret verbs read and write the vault under the drain job's environment, the same state root
// the run path resolves, so a value set here is the value a run is given. No line any verb prints
// holds a value: a name, a store and a timestamp are all a listing shows.
function secretVerb(rt, parsed, checkoutRoot, resolveEnv) {
  const [sub, name] = parsed.args;
  if (sub !== 'list' && (!SECRET_NAME_PATTERN.test(name) || name.length > SECRET_NAME_MAX)) {
    process.stderr.write(`bots: secret-name-invalid: ${name}\n`);
    return 2;
  }
  const config = rt.repoConfig.readRepoConfig(checkoutRoot);
  if (!config.ok) {
    process.stderr.write(`${describeRefusal(config)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const stateRoot = rt.stateRoot.userStateRoot(config.value, resolveEnv);
  const identity = rt.identity.resolveIdentity({ checkoutRoot, config: config.value, env: resolveEnv });
  if (!identity.ok) {
    process.stderr.write(`${describeRefusal(identity)}\n`);
    return rt.runner.EXIT_CODES.refused;
  }
  const id = identity.value.identity;
  rt.stateRoot.ensureIdentityState(stateRoot, id);
  // The keychain program is looked up in the shell's environment, because the operator's PATH is
  // where the program lives and the job's PATH is the bare one launchd hands a fire.
  const storeOptions = { env: process.env };
  if (sub === 'list') {
    const r = rt.secrets.listSecrets(stateRoot, id);
    if (!r.ok) {
      process.stderr.write(`bots: ${r.reason}: ${r.detail}\n`);
      return 4;
    }
    if (r.value.length === 0) {
      process.stdout.write('bots: no secrets stored\n');
      return 0;
    }
    for (const entry of r.value) {
      process.stdout.write(`${entry.name} ${entry.backend} ${entry.createdAt} ${entry.updatedAt}\n`);
    }
    return 0;
  }
  if (sub === 'set') {
    // The host is checked before the value is read, so a store that cannot exist costs no prompt.
    if (parsed.options.store === 'keychain' && rt.secrets.hostKeychainProgram(storeOptions) === null) {
      process.stderr.write('bots: --store keychain: no keychain program on this host\n');
      return 2;
    }
    const read = readSecretValue(name);
    if (read.refusal !== undefined) {
      process.stderr.write(`${read.refusal}\n`);
      return 2;
    }
    const actor = rt.actor.resolveActor({ as: null, env: process.env, scheduled: false });
    const setBy = actor.ok ? actor.value : null;
    const r = rt.secrets.setSecret({ stateRoot, identity: id, name, value: read.value, store: parsed.options.store, setBy, ...storeOptions });
    if (!r.ok) {
      process.stderr.write(`bots: ${r.reason}: ${r.detail}\n`);
      return SECRET_USAGE_REASONS.has(r.reason) ? 2 : 4;
    }
    if (r.value.warning !== null) process.stderr.write(`${r.value.warning}\n`);
    process.stdout.write(`bots: secret ${name} stored (${r.value.backend})\n`);
    return 0;
  }
  const r = rt.secrets.forgetSecret({ stateRoot, identity: id, name, ...storeOptions });
  if (!r.ok) {
    process.stderr.write(`bots: ${r.reason}: ${r.detail}\n`);
    return r.reason === 'secret-name-invalid' ? 2 : 4;
  }
  if (r.value.leftover !== null) {
    const { backend, reason } = r.value.leftover;
    process.stderr.write(`bots: secret forget: ${name} left the index, its ${backend} value was not removed (${reason}), run forget again\n`);
    return 1;
  }
  process.stdout.write(r.value.held ? `bots: secret ${name} forgotten\n` : `bots: secret ${name} was not held\n`);
  return 0;
}

// The value is read once, from a prompt with echo off or from one piped line. It is never read from
// an argument, so it never enters the shell's history or another process's argv. Nothing here echoes
// a byte of it, and every refusal names the secret and never the value.
function readSecretValue(name) {
  if (process.stdin.isTTY === true) return readSecretFromPrompt(name);
  return readSecretFromPipe(name);
}

// A prompt with echo off, read one byte at a time so a backspace can drop a character the terminal
// never shows. The mode is restored in a finally, so a failed read never leaves the terminal raw.
function readSecretFromPrompt(name) {
  const fs = require('node:fs');
  process.stderr.write(`secret value for ${name}: `);
  const bytes = [];
  let stopped = false;
  process.stdin.setRawMode(true);
  try {
    const one = Buffer.alloc(1);
    for (;;) {
      const read = fs.readSync(0, one, 0, 1, null);
      if (read === 0) {
        stopped = true;
        break;
      }
      const byte = one[0];
      if (byte === 0x0d || byte === 0x0a) break;
      if (byte === 0x7f || byte === 0x08) {
        bytes.pop();
        continue;
      }
      if ((byte === 0x03 || byte === 0x04) && bytes.length === 0) {
        stopped = true;
        break;
      }
      bytes.push(byte);
    }
  } finally {
    process.stdin.setRawMode(false);
    process.stderr.write('\n');
  }
  if (stopped) return { refusal: `bots: secret-no-input: ${name}` };
  return normalizeSecretValue(name, Buffer.from(bytes));
}

// One piped line, so a script can hand over a value without a tty. A read that throws EAGAIN is
// retried after a short pause, because a non-blocking pipe reports an empty buffer that way.
function readSecretFromPipe(name) {
  const fs = require('node:fs');
  const chunks = [];
  let total = 0;
  let ended = false;
  const chunk = Buffer.alloc(4096);
  for (;;) {
    let read;
    try {
      read = fs.readSync(0, chunk, 0, chunk.length, null);
    } catch (error) {
      if (error !== null && typeof error === 'object' && error.code === 'EAGAIN') {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
        continue;
      }
      throw error;
    }
    if (read === 0) {
      ended = true;
      break;
    }
    const slice = chunk.subarray(0, read);
    const newline = slice.indexOf(0x0a);
    if (newline !== -1) {
      chunks.push(Buffer.from(slice.subarray(0, newline)));
      total += newline;
      break;
    }
    chunks.push(Buffer.from(slice));
    total += read;
    if (total >= SECRET_PIPE_MAX_BYTES) {
      return { refusal: `bots: secret-too-long: ${SECRET_PIPE_MAX_BYTES} piped bytes hold no newline` };
    }
  }
  if (ended && total === 0) return { refusal: `bots: secret-no-input: ${name}` };
  return normalizeSecretValue(name, Buffer.concat(chunks));
}

// One trailing carriage return is dropped so a CRLF line reads the same as a bare newline, and the
// surrounding whitespace is trimmed because a pasted value carries it. The length is counted in code
// points, so a multi-byte character counts once.
function normalizeSecretValue(name, bytes) {
  let text = bytes.toString('utf8');
  if (text.endsWith('\r')) text = text.slice(0, -1);
  const value = text.trim();
  if (value === '') return { refusal: `bots: secret-empty: ${name}` };
  if ([...value].length > SECRET_VALUE_MAX_CODE_POINTS) {
    return { refusal: `bots: secret-too-long: the value is longer than ${SECRET_VALUE_MAX_CODE_POINTS} characters` };
  }
  return { value };
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
  let contract;
  try {
    [definition, routineModule, routineState, contract] = await Promise.all([
      runtimeModule('definition'),
      runtimeModule('routine'),
      runtimeModule('routine-state'),
      runtimeModule('contract'),
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
    process.stdout.write(`${JSON.stringify({ version: contract.PAYLOAD_CONTRACT, routines: rows }, null, 2)}\n`);
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

// The screen is a separate binary, so this verb resolves it, refuses when it is
// missing or speaks another payload contract, and only then hands over the
// terminal. It never loads the runtime: a screen that cannot start must not
// depend on the modules a run needs.
async function uiVerb(parsed) {
  const fs = require('node:fs');
  const checkoutRoot = checkoutRootFrom(parsed.options.repo);
  const skilledTree = path.resolve(parsed.options['skilled-tree'] || DEFAULT_SKILLED_TREE);
  // A test seam only: the shipped path resolves the binary from the skilled tree.
  const override = process.env.BOTS_UI_BIN;
  let bin;
  if (typeof override === 'string' && override !== '') {
    bin = path.resolve(override);
  } else {
    const crateDir = path.join(skilledTree, '.skilled', 'crates', 'bots-tui');
    if (!fs.existsSync(crateDir)) {
      process.stderr.write(`bots: ui-unavailable: no .skilled/crates/bots-tui in ${skilledTree}. The screen ships only in a source checkout, so build it with cargo build --release --manifest-path .skilled/crates/bots-tui/Cargo.toml\n`);
      return 4;
    }
    bin = path.join(crateDir, 'target', 'release', 'bots-ui');
    if (!fs.existsSync(bin)) {
      process.stderr.write(`bots: ui-not-built: no bots-ui binary at ${bin}. Build it with cargo build --release --manifest-path .skilled/crates/bots-tui/Cargo.toml\n`);
      return 4;
    }
  }
  const contract = await readPayloadContract();
  const version = spawnSync(bin, ['--version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10000 });
  const firstLine = typeof version.stdout === 'string' ? version.stdout.split('\n')[0] : '';
  const match = /\scontract (\d+)\s*$/.exec(firstLine);
  const speaks = version.error !== undefined || firstLine === '' || match === null ? 'unknown' : match[1];
  if (speaks !== String(contract)) {
    process.stderr.write(`bots: ui-contract-mismatch: ${bin} speaks contract ${speaks}, this verb speaks contract ${contract}. Rebuild it with cargo build --release --manifest-path .skilled/crates/bots-tui/Cargo.toml\n`);
    return 4;
  }
  // The binary reads no environment variable of its own, so the two display
  // choices travel as flags.
  const args = ['--repo', checkoutRoot, '--skilled-tree', skilledTree];
  const noColor = process.env.NO_COLOR;
  if (typeof noColor === 'string' && noColor !== '') args.push('--mono');
  if (parsed.options.ascii === true) args.push('--ascii');
  const run = spawnSync(bin, args, { stdio: 'inherit' });
  if (run.error) {
    process.stderr.write(`bots: ui did not start: ${run.error.message}\n`);
    return 1;
  }
  if (run.signal) return 128 + require('node:os').constants.signals[run.signal];
  return run.status;
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
  // The screen starts a separate binary and reads no bot state, so it runs before
  // the child refusals and before the runtime loads.
  if (parsed.verb === 'ui') return uiVerb(parsed);
  if (parsed.verb === 'channel') return runChannelVerb(argv, CHANNEL_TRANSPORTS);
  if (parsed.verb === 'remember') {
    const problem = checkRemember(parsed);
    if (problem) return usageExit(problem);
    // The write forms run no write inside a bot run: a child that appended a fact would write a
    // line every later prompt reads as one an operator confirmed. --list is a read and stays open.
    const writes = parsed.options.list !== true;
    if (writes && isBotChild(process.env)) {
      process.stderr.write('bots: child-write-refused: remember runs no write inside a bot run\n');
      return 2;
    }
  }
  // A refusal that reads the run marker for answer and enable belongs here, before any
  // runtime work, so a bot's own child cannot answer or re-enable itself.
  if (CHILD_REFUSED_VERBS.has(parsed.verb) && isBotChild(process.env)) {
    process.stderr.write('bots: child-write-refused\n');
    return 2;
  }
  // A bot child that set a secret could replace the value another bot is given, so the secret group
  // writes nothing inside a bot run. Listing is a read and stays open.
  if (parsed.verb === 'secret' && parsed.args[0] !== 'list' && isBotChild(process.env)) {
    process.stderr.write('bots: child-write-refused: secret runs no write inside a bot run\n');
    return 2;
  }
  if (parsed.verb === 'run' && parsed.options['schedule-index'] !== undefined && process.env[SCHEDULED_FIRE_ENV] !== '1') {
    return usageExit('--schedule-index is passed only by the installed schedule; run the bot without it');
  }
  if (parsed.verb === 'answer' || parsed.verb === 'run' || parsed.verb === 'remember') {
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
  if (parsed.verb === 'answer') return answerVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv);
  if (parsed.verb === 'skill') return skillVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv);
  if (parsed.verb === 'remember') return rememberVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'secret') return secretVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'status') return statusVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'activity') return activityVerb(rt, parsed, checkoutRoot, resolveEnv);
  if (parsed.verb === 'routines') return routinesVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv);
  if (parsed.verb === 'chat') return chatVerb(rt, parsed, checkoutRoot, skilledTree, resolveEnv);

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
        grants: item.grants ?? null,
      }));
      process.stdout.write(`${JSON.stringify({ version: 1, items: payload }, null, 2)}\n`);
    } else {
      if (shown.length === 0) process.stdout.write(all ? 'bots: no needs-you items\n' : 'bots: no open or expired needs-you items\n');
      for (const { item, state } of shown) {
        // The grant sits after the bot id, so a field search still finds a bot's items and the next one finds a kind's.
        const grant = item.grants ?? null;
        const grantKind = grant === null ? '-' : grant.kind;
        const grantRung = grant === null ? '-' : grant.rung;
        const grantScope = grant === null || grant.scope === null ? '-' : grant.scope;
        process.stdout.write(`${state}\t${item.id}\t${item.botId}\t${grantKind}\t${grantRung}\t${grantScope}\tcreated ${item.createdAt}\texpires ${item.expiresAt}\n`);
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
        surface: 'terminal',
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

module.exports = { parseArgs, USAGE, runChannelVerb, CHANNEL_TRANSPORTS };
