#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Bot Definition Checker
// ───────────────────────────────────────────────────────────────────
//
// A bad BOT.md would otherwise fail only at its first unattended fire, when
// nobody is watching. This checker audits a repository's bots/ folder
// before anything installs it, and it imports the very predicates the
// runner and installer use: the definition parser, the config reader, the
// identity resolver, the executor bounds, the cron translator, the label
// grammar, the worktree shared-path resolver and the delivery channel list.
// It restates no field rule, so it cannot pass a file the runtime would
// refuse. It only reads.
//
// Usage:
//   node bot-check.cjs <checkout-root> [--strict]
//
// Output: one `PASS|FAIL|WARN|INFO: <id>: <message>` line per finding.
// Exit 0 when every hard invariant passes, 1 on any failure, 2 when the
// target is missing or the audit cannot finish. `--strict` turns advisory
// findings from WARN into FAIL; it never changes a hard failure.

'use strict';

const { existsSync, readdirSync, statSync } = require('node:fs');
const { createRequire } = require('node:module');
const { join, relative, resolve } = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 1. INVARIANTS
// ───────────────────────────────────────────────────────────────────

/**
 * Hard invariant ids that have their own defect fixture. A parse or config
 * refusal reports as `definition.<reason>` or `config.<reason>`, and a cron
 * refusal reports under the translator's own id, so every refusal the
 * runtime can return is named even when it is not listed here.
 */
const HARD_INVARIANTS = Object.freeze([
  'definition.missing-id',
  'duplicate-id',
  'definition.missing-trigger',
  'definition.trigger-kind-invalid',
  'definition.empty-body',
  'runtime-kind-unknown',
  'definition.budget.maxIterations-invalid',
  'budget.timeoutSeconds-out-of-bounds',
  'cron-reboot',
  'identity-missing',
  'config.identity-invalid',
  'isolation-undeclared',
  'definition.isolation-invalid',
  'worktree-shared-paths-unresolved',
  'delivery-channel-unknown',
  'reserved-id',
  'executor-kind-native',
  'posture-unhonorable',
]);

/**
 * Advisory invariant ids: WARN by default, FAIL under --strict. None is defined
 * now: a folder whose name differs from its id is a hard failure, because the
 * runner and the installer refuse that definition.
 */
const ADVISORY_INVARIANTS = Object.freeze([]);

const DEFINITION_FILE = 'BOT.md';
const RUNTIME_DIR = resolve(__dirname, '..', 'runtime');

// ───────────────────────────────────────────────────────────────────
// 2. LOADING
// ───────────────────────────────────────────────────────────────────

/** Load the runtime's TypeScript modules through the runtime's own tsx. */
async function loadRuntime() {
  const runtimeRequire = createRequire(join(RUNTIME_DIR, 'package.json'));
  const { tsImport } = runtimeRequire('tsx/esm/api');
  const lib = (name) => tsImport(join(RUNTIME_DIR, 'lib', `${name}.ts`), __filename);
  const [definition, repoConfig, identity, translator, label, isolation, delivery, posture] = await Promise.all([
    lib('definition'),
    lib('repo-config'),
    lib('identity'),
    lib('cron-translator'),
    lib('label'),
    lib('isolation'),
    lib('delivery'),
    lib('posture'),
  ]);
  return { definition, repoConfig, identity, translator, label, isolation, delivery, posture };
}

// ───────────────────────────────────────────────────────────────────
// 3. AUDIT
// ───────────────────────────────────────────────────────────────────

/**
 * Audit one checkout's bots/ folder.
 *
 * @param {string} checkoutRoot - The repository checkout that holds bots/.
 * @param {{strict?: boolean, env?: NodeJS.ProcessEnv}} options
 * @returns {Promise<{lines: string[], exitCode: 0|1|2}>}
 */
async function runCheck(checkoutRoot, options = {}) {
  const strict = options.strict === true;
  const env = options.env ?? process.env;
  const lines = [];
  let failed = false;
  const pass = (id, message) => lines.push(`PASS: ${id}: ${message}`);
  const info = (id, message) => lines.push(`INFO: ${id}: ${message}`);
  const fail = (id, message) => {
    failed = true;
    lines.push(`FAIL: ${id}: ${message}`);
  };
  const advise = (id, message) => {
    if (strict) fail(id, message);
    else lines.push(`WARN: ${id}: ${message}`);
  };
  const stop = (id, message) => ({ lines: [...lines, `FAIL: ${id}: ${message}`], exitCode: 2 });

  const root = resolve(checkoutRoot);
  if (!existsSync(root) || !statSync(root).isDirectory()) return stop('target-missing', `${root} is not a folder`);
  const botsDir = join(root, 'bots');
  if (!existsSync(botsDir) || !statSync(botsDir).isDirectory()) {
    return stop('definitions-missing', `${botsDir} is not a folder`);
  }

  const runtime = await loadRuntime();

  // Repository policy and identity come first: every label depends on them.
  const config = runtime.repoConfig.readRepoConfig(root);
  if (!config.ok) {
    fail(`config.${config.reason}`, describe('bots/config.json', config));
  } else {
    pass('config', 'bots/config.json reads cleanly');
  }

  // A declared shared-path list is policy every worktree run would link, so
  // it must resolve even before any bot asks for a worktree.
  if (config.ok && config.value.worktreeSharedPaths !== undefined) {
    const shared = runtime.isolation.resolveSharedPaths({ checkoutRoot: root, config: config.value, env });
    if (shared.ok) pass('worktree-shared-paths', `bots/config.json lists ${shared.value.paths.length} shared paths`);
    else fail(shared.reason, describe('bots/config.json', shared));
  }

  let identity = null;
  if (config.ok) {
    const resolved = runtime.identity.resolveIdentity({ checkoutRoot: root, config: config.value, env });
    if (resolved.ok) {
      identity = resolved.value.identity;
      pass('identity', `${identity} (from ${resolved.value.source})`);
    } else {
      fail('identity-missing', 'the repository has no remote and bots/config.json declares no identity; set "identity": "owner/name"');
    }
  }

  let folders;
  try {
    folders = readdirSync(botsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  } catch (error) {
    return stop('definitions-unreadable', `${botsDir}: ${error && error.code ? error.code : 'read failed'}`);
  }

  const definitions = folders
    .map((folder) => join(botsDir, folder, DEFINITION_FILE))
    .filter((path) => existsSync(path));
  if (definitions.length === 0) {
    info('no-definitions', `no bots/<id>/${DEFINITION_FILE} under ${relative(process.cwd(), botsDir) || botsDir}`);
    return { lines, exitCode: failed ? 1 : 0 };
  }

  const seen = new Map();
  for (const path of definitions) {
    const shown = relative(root, path);
    const folder = relative(botsDir, path).split(/[\\/]/)[0];
    const parsed = runtime.definition.readDefinition(path);
    if (!parsed.ok) {
      fail(`definition.${parsed.reason}`, describe(shown, parsed));
      continue;
    }
    const bot = parsed.value;
    pass('definition', `${shown} parses as ${bot.id}`);

    if (seen.has(bot.id)) {
      fail('duplicate-id', `${shown} reuses id ${bot.id} from ${seen.get(bot.id)}`);
    } else {
      seen.set(bot.id, shown);
    }
    if (runtime.label.RESERVED_BOT_IDS.includes(bot.id)) {
      fail('reserved-id', `${shown}: id ${bot.id} is reserved for the repository's own agent`);
    }
    if (folder !== bot.id) fail('folder-id-mismatch', `${shown}: folder ${folder} differs from id ${bot.id}`);

    const bounds = runtime.definition.checkExecutorBounds(bot);
    if (bounds.ok) pass('executor-bounds', `${shown}: runtime ${bot.runtime.kind} within the executor's bounds`);
    else fail(bounds.reason, describe(shown, bounds));

    if (config.ok) {
      const isolation = runtime.definition.resolveIsolation(bot, config.value);
      if (isolation.ok) pass('isolation', `${shown}: ${isolation.value}`);
      else fail(isolation.reason, `${shown}: declare isolation in BOT.md or defaultIsolation in bots/config.json`);
      if (isolation.ok && bounds.ok) {
        // The runner's own posture check, so a kind or sandbox it refuses at
        // dispatch never passes here.
        const verdict = runtime.posture.validatePosture(bot, config.value);
        if (verdict.ok) pass('posture', `${shown}: ${bot.runtime.kind} honors sandbox ${verdict.value.posture.sandbox}`);
        else fail(verdict.reason, describe(shown, verdict));
      }
      if (isolation.ok && isolation.value === 'worktree') {
        const shared = runtime.isolation.resolveSharedPaths({ checkoutRoot: root, config: config.value, env });
        if (shared.ok) pass('worktree-shared-paths', `${shown}: links ${shared.value.paths.length} shared paths from ${shared.value.source}`);
        else fail(shared.reason, describe(shown, shared));
      }
    }

    if (bot.delivery.mode === 'targets') {
      const targets = [...bot.delivery.targets, ...(bot.delivery.onFailure ?? [])];
      const unknown = targets.filter((target) => !runtime.delivery.parseTarget(target).known);
      if (unknown.length > 0) {
        fail('delivery-channel-unknown', `${shown}: ${unknown.join(', ')} names no channel; known: ${runtime.delivery.DELIVERY_CHANNELS.join(', ')}`);
      } else if (targets.length > 0) {
        pass('delivery', `${shown}: ${targets.length} target(s) on known channels`);
      }
    }

    if (bot.trigger.kind === 'cron') {
      const translation = runtime.translator.translateCron(bot.trigger.expression);
      if (!translation.ok) {
        fail(translation.reason, describe(`${shown}: "${bot.trigger.expression}"`, translation));
      } else {
        const shape = translation.value.kind === 'interval'
          ? `StartInterval ${translation.value.startInterval}`
          : `${translation.value.entries.length} calendar dictionaries`;
        pass('schedule', `${shown}: "${bot.trigger.expression}" translates to ${shape}`);
        if (identity !== null && !runtime.label.RESERVED_BOT_IDS.includes(bot.id)) {
          const built = runtime.label.buildBotLabel(identity, bot.id, 0);
          if (built.ok) pass('label', `${shown}: ${built.value}`);
          else fail(`label.${built.reason}`, describe(shown, built));
        }
      }
    }
  }

  return { lines, exitCode: failed ? 1 : 0 };
}

function describe(subject, refusal) {
  return refusal.detail === undefined ? `${subject}: ${refusal.reason}` : `${subject}: ${refusal.reason} (${refusal.detail})`;
}

// ───────────────────────────────────────────────────────────────────
// 4. CLI
// ───────────────────────────────────────────────────────────────────

async function main(argv) {
  const args = argv.filter((arg) => arg !== '--strict');
  const strict = args.length !== argv.length;
  const unknown = args.find((arg) => arg.startsWith('-'));
  if (args.length !== 1 || unknown !== undefined) {
    console.log(`FAIL: usage: node bot-check.cjs <checkout-root> [--strict]${unknown ? ` (unknown option ${unknown})` : ''}`);
    return 2;
  }
  try {
    const result = await runCheck(args[0], { strict });
    for (const line of result.lines) console.log(line);
    return result.exitCode;
  } catch (error) {
    console.log(`FAIL: checker-error: ${error && error.message ? error.message : String(error)}`);
    return 2;
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

module.exports = { ADVISORY_INVARIANTS, HARD_INVARIANTS, runCheck };
