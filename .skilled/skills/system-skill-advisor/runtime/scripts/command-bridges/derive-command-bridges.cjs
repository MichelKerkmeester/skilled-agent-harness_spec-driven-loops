// ───────────────────────────────────────────────────────────────────
// MODULE: Derive Command Bridges
// ───────────────────────────────────────────────────────────────────

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { existsSync, readFileSync, readdirSync, writeFileSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const COMMAND_BRIDGES_DIR = __dirname;
const REPO_ROOT = resolve(COMMAND_BRIDGES_DIR, '../../../../../..');
const SKILLS_ROOT = join(REPO_ROOT, '.skilled', 'skills');
// One folder per command group, one Markdown file per command: the tree the
// inventory identity check reads.
const COMMANDS_ROOT = join(REPO_ROOT, '.skilled', 'commands');
const DOCTOR_COMMANDS_DIR = join(COMMANDS_ROOT, 'doctor');
const DOCTOR_ROUTES_PATH = join(DOCTOR_COMMANDS_DIR, '_routes.yaml');
const COMPATIBILITY_PATH = join(COMMAND_BRIDGES_DIR, 'scoring-compatibility.json');
const OUTPUT_PATH = join(COMMAND_BRIDGES_DIR, 'command-bridges.generated.json');
const TS_PROJECTION_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'runtime',
  'lib',
  'scorer',
  'projection.ts',
);
const PY_ADVISOR_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'runtime',
  'scripts',
  'skill_advisor.py',
);
const TS_GENERATED_START = '// BEGIN GENERATED COMMAND BRIDGES';
const TS_GENERATED_END = '// END GENERATED COMMAND BRIDGES';
const PY_GENERATED_START = '# BEGIN GENERATED COMMAND BRIDGES';
const PY_GENERATED_END = '# END GENERATED COMMAND BRIDGES';
const DOCTOR_PREFIX = 'command-doctor-';
const DOCTOR_MCP_COMMAND = '/doctor:mcp';

// Closed vocabularies: an unrecognised value has to fail loudly, because a
// silent fallthrough would hand a mutating command the read-only policy (or the
// reverse) and nothing downstream would notice.
const MUTATING_CLASSES = ['read-only', 'add-only', 'mutates'];
const ASK_FIRST_REASONS = ['settings', 'outside-repo', 'spend', 'relaunch'];
const WRITE_SCOPES = ['spec-folder'];
// A command with several routes and no target typed answers for its strictest
// route, because the reader gave the bridge no way to narrow the run.
const POLICY_STRICTNESS = ['run', 'start', 'ask'];
// A lead phrase outranks a passing skill, which is only safe when the prompt asks
// about the state of something. A phrase that names no state or health word could
// outrank the skill on an ordinary task, so it belongs only on a route that
// already asks before it runs.
const LEAD_PHRASE_STATE_WORDS = [
  'check',
  'state',
  'status',
  'report',
  'health',
  'off',
  'on',
  'which',
  'show',
  'list',
  'inventory',
  'drift',
  'stale',
  'missing',
  'failing',
  'broken',
];
const COMMAND_ATTACH_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'runtime',
  'lib',
  'command-attach.ts',
);
const COMMAND_ATTACH_GENERATED_START = '// BEGIN GENERATED MODE COMMANDS';
const COMMAND_ATTACH_GENERATED_END = '// END GENERATED MODE COMMANDS';
const COMMAND_ROWS_GENERATED_START = '// BEGIN GENERATED COMMAND ROWS';
const COMMAND_ROWS_GENERATED_END = '// END GENERATED COMMAND ROWS';

// Manifest-derived runnable strings, trigger phrases and precedence phrases per doctor bridge id.
// The inventory entries keep their five-key shape; the projection merge reads here.
const DOCTOR_DETAILS = new Map();

// Meaning text per command, taken from the metadata record that already states
// what the command does in the words a person uses.
const METADATA_MEANING = new Map();

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`[command-bridges] Failed to read JSON ${filePath}: ${error.message}`);
  }
}

function bridgeId(command) {
  if (!/^\/[a-z][a-z0-9-]*:[a-z0-9-]+$/.test(command)) {
    throw new Error(`[command-bridges] Invalid command id: ${command}`);
  }
  return `command-${command.slice(1).replace(':', '-')}`;
}

function sourcePath(filePath) {
  return relative(REPO_ROOT, filePath).split(sep).join('/');
}

function metadataEntries(skillsRoot = SKILLS_ROOT) {
  METADATA_MEANING.clear();
  const entries = [];
  const skillIds = readdirSync(skillsRoot, { withFileTypes: true })
    // A private skill is local to one checkout and must never reach a tracked bridge file.
    // Only a private skill may be a link, so any other linked folder is not a skill source.
    .filter((entry) => !entry.name.startsWith('local-') && !entry.isSymbolicLink())
    .map((entry) => entry.name)
    .sort();
  for (const skillId of skillIds) {
    const filePath = join(skillsRoot, skillId, 'command-metadata.json');
    if (!existsSync(filePath)) continue;

    // A skill with no mode registry has no hub to route its commands, so its
    // metadata is the whole declaration of what each command reaches.
    const standalone = !existsSync(join(skillsRoot, skillId, 'mode-registry.json'));
    const metadata = readJson(filePath);
    if (!Array.isArray(metadata)) {
      throw new Error(`[command-bridges] ${sourcePath(filePath)} must contain a JSON array`);
    }
    for (const [index, entry] of metadata.entries()) {
      if (!entry || typeof entry !== 'object') {
        throw new Error(`[command-bridges] ${sourcePath(filePath)}[${index}] must be an object`);
      }
      const { command, ownerMode } = entry;
      if (typeof command !== 'string' || typeof ownerMode !== 'string' || !ownerMode) {
        throw new Error(
          `[command-bridges] ${sourcePath(filePath)}[${index}] requires string command and ownerMode`,
        );
      }
      const description = entry.description === undefined ? '' : entry.description;
      if (typeof description !== 'string') {
        throw new Error(
          `[command-bridges] ${sourcePath(filePath)}[${index}] description must be a string`,
        );
      }
      // The phrases a person types instead of the command are declared once, in
      // the metadata, so the bridge reads them here instead of restating them.
      const ownedSignals = entry.userIntent && entry.userIntent.ownedSignals !== undefined
        ? stringArray(
          entry.userIntent.ownedSignals,
          `${sourcePath(filePath)}[${index}].userIntent.ownedSignals`,
        )
        : [];
      // The job is prose about the outcome a person wants, so it describes the
      // command in words none of the identifiers do. An absent job is a record
      // that says less, not a broken one.
      const job = entry.userIntent && typeof entry.userIntent.job === 'string'
        ? entry.userIntent.job
        : '';
      METADATA_MEANING.set(command, { description, job, ownedSignals });
      entries.push({
        id: bridgeId(command),
        command,
        skillId,
        ownerMode,
        description,
        ownedSignals: [...ownedSignals],
        standalone,
        mutating: entry.mutating,
        source: sourcePath(filePath),
      });
    }
  }
  return entries;
}

function doctorSkillAgent(name) {
  const routerPath = join(DOCTOR_COMMANDS_DIR, `${name}.md`);
  const tag = existsSync(routerPath)
    ? /<!--\s*skill_agent:\s*([a-z0-9-]+)\s*-->/.exec(readFileSync(routerPath, 'utf8'))
    : null;
  if (!tag) {
    throw new Error(
      `[command-bridges] ${sourcePath(routerPath)} has no skill_agent tag; `
        + 'a doctor bridge needs its owning skill',
    );
  }
  return tag[1];
}

// A router names its own purpose in the frontmatter sentence a person reads
// before anything else, so the bridge embeds that sentence rather than a second
// copy written for the scorer to drift from.
function doctorCommandDescription(name) {
  const routerPath = join(DOCTOR_COMMANDS_DIR, `${name}.md`);
  const match = existsSync(routerPath)
    ? /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(routerPath, 'utf8'))
    : null;
  // Required lazily for the same reason as the route manifest: an
  // argument-rejecting run must exit before this module needs a YAML parser.
  const YAML = require('yaml');
  let frontmatter = null;
  if (match) {
    try {
      frontmatter = YAML.parse(match[1]);
    } catch (error) {
      throw new Error(
        `[command-bridges] Failed to read the frontmatter of ${sourcePath(routerPath)}: ${error.message}`,
      );
    }
  }
  const description = frontmatter && frontmatter.description;
  if (typeof description !== 'string' || !description.trim()) {
    throw new Error(
      `[command-bridges] ${sourcePath(routerPath)} has no frontmatter description; `
        + 'a doctor bridge needs the sentence it embeds',
    );
  }
  return description.trim();
}

function doctorCommandName(command, label) {
  const match = /^\/doctor:([a-z0-9-]+)$/.exec(command);
  if (!match) {
    throw new Error(`[command-bridges] ${label} has invalid doctor command ${command}`);
  }
  return match[1];
}

function doctorRouteEntries() {
  DOCTOR_DETAILS.clear();
  // Required lazily: an argument-rejecting run must exit before this module
  // ever needs a YAML parser.
  const YAML = require('yaml');
  let manifest;
  try {
    manifest = YAML.parse(readFileSync(DOCTOR_ROUTES_PATH, 'utf8'));
  } catch (error) {
    throw new Error(
      `[command-bridges] Failed to read ${sourcePath(DOCTOR_ROUTES_PATH)}: ${error.message}`,
    );
  }
  const routes = manifest && manifest.routes;
  if (!Array.isArray(routes)) {
    throw new Error('[command-bridges] _routes.yaml routes must be an array');
  }
  const names = routes.map((route, index) => (
    doctorCommandName(route.command, `_routes.yaml routes[${index}]`)
  ));
  const totals = new Map();
  for (const name of names) {
    totals.set(name, (totals.get(name) || 0) + 1);
  }

  const entries = [];
  routes.forEach((route, index) => {
    const label = `_routes.yaml routes[${index}]`;
    if (typeof route.target !== 'string' || !route.target) {
      throw new Error(`[command-bridges] ${label} requires a non-empty string target`);
    }
    // A command with several targets needs one bridge per target; a
    // single-target command takes the command's own id.
    const multiTarget = totals.get(names[index]) > 1;
    const id = multiTarget
      ? `command-doctor-${names[index]}-${route.target}`
      : `command-doctor-${names[index]}`;
    const skillId = doctorSkillAgent(names[index]);
    const phrases = stringArray(route.trigger_phrases, `${label}.trigger_phrases`);
    const leadPhrases = doctorLeadPhrases(route, label, phrases);
    DOCTOR_DETAILS.set(id, {
      runnable: multiTarget ? `${route.command} ${route.target}` : route.command,
      bareCommand: doctorDefaultTarget(route, label, multiTarget),
      description: doctorCommandDescription(names[index]),
      phrases,
      leadPhrases,
      readOnly: isReadOnlyRoute(route),
    });
    entries.push({
      id,
      command: route.command,
      skillId,
      ownerMode: skillId,
      source: sourcePath(DOCTOR_ROUTES_PATH),
    });
  });

  const standalone = manifest.standalone === undefined ? [] : manifest.standalone;
  if (!Array.isArray(standalone)) {
    throw new Error('[command-bridges] _routes.yaml standalone must be an array');
  }
  standalone.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const label = `_routes.yaml standalone[${index}]`;
    const phrases = Object.prototype.hasOwnProperty.call(item, 'trigger_phrases')
      ? stringArray(item.trigger_phrases, `${label}.trigger_phrases`)
      : [];
    const leadPhrases = doctorLeadPhrases(item, label, phrases);
    if (typeof item.command !== 'string') return;
    const name = doctorCommandName(item.command, label);
    const skillId = doctorSkillAgent(name);
    const runnable = typeof item.runnable === 'string' && item.runnable
      ? item.runnable
      : item.command;
    DOCTOR_DETAILS.set(`command-doctor-${name}`, {
      runnable,
      description: doctorCommandDescription(name),
      phrases,
      leadPhrases,
      readOnly: isReadOnlyRoute(item),
    });
    entries.push({
      id: `command-doctor-${name}`,
      command: item.command,
      skillId,
      ownerMode: skillId,
      source: sourcePath(DOCTOR_ROUTES_PATH),
    });
  });

  const mcpSubroutes = manifest.mcp_subroutes === undefined ? [] : manifest.mcp_subroutes;
  if (!Array.isArray(mcpSubroutes)) {
    throw new Error('[command-bridges] _routes.yaml mcp_subroutes must be an array');
  }
  mcpSubroutes.forEach((item, index) => {
    const label = `_routes.yaml mcp_subroutes[${index}]`;
    if (!item || typeof item.sub_action !== 'string' || !item.sub_action) {
      throw new Error(`[command-bridges] ${label} requires a non-empty string sub_action`);
    }
    const commandName = doctorCommandName(DOCTOR_MCP_COMMAND, label);
    const skillId = doctorSkillAgent(commandName);
    const id = `${DOCTOR_PREFIX}${commandName}-${item.sub_action}`;
    const runnable = `${DOCTOR_MCP_COMMAND} ${item.sub_action}`;
    const phrases = stringArray(item.trigger_phrases, `${label}.trigger_phrases`);
    const leadPhrases = doctorLeadPhrases(item, label, phrases);
    DOCTOR_DETAILS.set(id, {
      runnable,
      description: doctorCommandDescription(commandName),
      phrases,
      leadPhrases,
      readOnly: isReadOnlyRoute(item),
    });
    entries.push({
      id,
      command: DOCTOR_MCP_COMMAND,
      skillId,
      ownerMode: skillId,
      source: sourcePath(DOCTOR_ROUTES_PATH),
    });
  });

  return entries;
}

// A command exists when its router file exists: the folder directly under the
// commands root names the group and a Markdown file inside it names the action.
// A README and a .contract.md describe a command instead of being one, a file
// directly in the root names no command at all, and a local- name belongs to a
// single checkout, so none of them count.
function commandTreeNames(commandsRoot = COMMANDS_ROOT) {
  const commands = [];
  const groups = readdirSync(commandsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('local-'))
    .map((entry) => entry.name)
    .sort();
  for (const group of groups) {
    const files = readdirSync(join(commandsRoot, group), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .filter((entry) => (
        entry.name !== 'README.md'
        && !entry.name.endsWith('.contract.md')
        && !entry.name.startsWith('local-')
      ))
      .map((entry) => `/${group}:${entry.name.slice(0, -'.md'.length)}`);
    commands.push(...files);
  }
  return commands.sort();
}

// A hub's mode registry is the only place that pairs a workflow mode with the
// command that runs it, so the reader's reverse lookup is derived from the hubs
// themselves rather than transcribed into the consumer and left to drift.
function modeCommandRecords(skillsRoot = SKILLS_ROOT, commandsRoot = COMMANDS_ROOT) {
  const commandNames = new Set(commandTreeNames(commandsRoot));
  const records = [];
  const hubIds = readdirSync(skillsRoot, { withFileTypes: true })
    // The same skill folders as the bridge metadata, for the same reason: a
    // private skill is local to one checkout and a linked folder is not a skill
    // source.
    .filter((entry) => !entry.name.startsWith('local-') && !entry.isSymbolicLink())
    .map((entry) => entry.name)
    .sort();
  for (const hubId of hubIds) {
    const filePath = join(skillsRoot, hubId, 'mode-registry.json');
    if (!existsSync(filePath)) continue;

    const registry = readJson(filePath);
    const modes = registry && registry.modes;
    if (!Array.isArray(modes)) {
      throw new Error(`[command-bridges] ${sourcePath(filePath)} must contain a modes array`);
    }
    const seen = new Set();
    for (const [index, mode] of modes.entries()) {
      const label = `${sourcePath(filePath)} modes[${index}]`;
      const workflowMode = mode && mode.workflowMode;
      if (typeof workflowMode !== 'string' || !workflowMode) {
        throw new Error(`[command-bridges] ${label} requires a non-empty string workflowMode`);
      }
      // One key per hub: a repeated workflow mode would leave the lookup holding
      // whichever row the table happened to keep, so the registry has to say it
      // once.
      if (seen.has(workflowMode)) {
        throw new Error(
          `[command-bridges] Duplicate workflow mode ${workflowMode} in ${sourcePath(filePath)}`,
        );
      }
      seen.add(workflowMode);

      const { command } = mode;
      // A null command is a mode with no dedicated slash command, which is a
      // declared state rather than a mistake, so it contributes no row.
      if (typeof command !== 'string' || !command) continue;
      // A command with no router file is one the reader cannot type, so naming
      // it here would promise a surface that does not exist.
      if (!commandNames.has(command)) {
        throw new Error(
          `[command-bridges] ${label} names ${command}, which has no command file`,
        );
      }
      records.push({ hubId, workflowMode, command });
    }
  }
  // The generated file is compared byte for byte, so the order has to be total.
  return records.sort((left, right) => (
    left.hubId === right.hubId
      ? left.workflowMode.localeCompare(right.workflowMode)
      : left.hubId.localeCompare(right.hubId)
  ));
}

// The policy ladder reads only these keys, so a wrong value has to fail here
// rather than fall through to a branch that merely looks safe.
function validateRiskKeys(record, label, requireTarget = false) {
  if (!MUTATING_CLASSES.includes(record.mutating)) {
    throw new Error(
      `[command-bridges] ${label} has mutating ${JSON.stringify(record.mutating)}; `
        + `expected one of ${MUTATING_CLASSES.join(', ')}`,
    );
  }
  if (record.ask_first !== undefined) {
    const askFirst = record.ask_first;
    if (!Array.isArray(askFirst) || askFirst.some((value) => !ASK_FIRST_REASONS.includes(value))) {
      throw new Error(
        `[command-bridges] ${label} has ask_first ${JSON.stringify(askFirst)}; `
          + `expected an array of ${ASK_FIRST_REASONS.join(', ')}`,
      );
    }
  }
  if (record.write_scope !== undefined && !WRITE_SCOPES.includes(record.write_scope)) {
    throw new Error(
      `[command-bridges] ${label} has write_scope ${JSON.stringify(record.write_scope)}; `
        + `expected one of ${WRITE_SCOPES.join(', ')}`,
    );
  }
  if (requireTarget && (typeof record.gate3_location !== 'string' || !record.gate3_location)) {
    throw new Error(
      `[command-bridges] ${label} needs a non-empty string gate3_location naming what it writes`,
    );
  }
}

// One policy per command, decided from the risk keys alone so the answer never
// depends on which scorer asks: an ask-first reason always wins, a doctor route
// that mutates asks because its repair is the operator's call, and only a
// read-only route or an add-only route confined to the spec folder may run
// unprompted. Everything else starts as an ordinary task.
function derivePolicy(record) {
  if (Array.isArray(record.ask_first) && record.ask_first.length > 0) return 'ask';
  if (record.doctor === true && record.mutating === 'mutates') return 'ask';
  if (record.mutating === 'read-only') return 'run';
  if (record.mutating === 'add-only' && record.write_scope === 'spec-folder') return 'run';
  return 'start';
}

// The same skill folders as the bridge metadata, for the same reason: a private
// skill is local to a checkout and a linked folder is not a skill source. A
// metadata command is reachable by typing its name, so it must also name where
// its writes land before its policy may be derived.
function metadataRiskRecords(skillsRoot = SKILLS_ROOT) {
  const records = [];
  const skillIds = readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('local-') && !entry.isSymbolicLink())
    .map((entry) => entry.name)
    .sort();
  for (const skillId of skillIds) {
    const filePath = join(skillsRoot, skillId, 'command-metadata.json');
    if (!existsSync(filePath)) continue;
    const metadata = readJson(filePath);
    if (!Array.isArray(metadata)) {
      throw new Error(`[command-bridges] ${sourcePath(filePath)} must contain a JSON array`);
    }
    for (const [index, entry] of metadata.entries()) {
      if (!entry || typeof entry !== 'object') {
        throw new Error(`[command-bridges] ${sourcePath(filePath)}[${index}] must be an object`);
      }
      validateRiskKeys(entry, `${sourcePath(filePath)}[${index}] ${entry.command}`, true);
      records.push({
        command: entry.command,
        route: null,
        mutating: entry.mutating,
        ask_first: entry.ask_first || [],
        write_scope: entry.write_scope,
        doctor: false,
      });
    }
  }
  return records;
}

// The manifest is the doctor half of the same surface. Requiring YAML lazily
// keeps an argument-rejecting run from ever loading a parser.
function doctorRiskRecords(routesPath = DOCTOR_ROUTES_PATH) {
  const YAML = require('yaml');
  let manifest;
  try {
    manifest = YAML.parse(readFileSync(routesPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `[command-bridges] Failed to read ${sourcePath(routesPath)}: ${error.message}`,
    );
  }

  const records = [];
  const addRecord = (fields, label) => {
    const record = {
      command: fields.command,
      route: fields.route,
      mutating: fields.mutating,
      ask_first: fields.ask_first || [],
      write_scope: fields.write_scope,
      doctor: true,
    };
    validateRiskKeys(record, label);
    records.push(record);
  };

  const routes = manifest && manifest.routes;
  if (!Array.isArray(routes)) {
    throw new Error('[command-bridges] _routes.yaml routes must be an array');
  }
  routes.forEach((route, index) => {
    addRecord({
      command: route.command,
      route: route.target,
      mutating: route.mutating,
      ask_first: route.ask_first,
      write_scope: route.write_scope,
    }, `${sourcePath(routesPath)} routes[${index}]`);
  });

  const mcpSubroutes = manifest.mcp_subroutes === undefined ? [] : manifest.mcp_subroutes;
  if (!Array.isArray(mcpSubroutes)) {
    throw new Error('[command-bridges] _routes.yaml mcp_subroutes must be an array');
  }
  mcpSubroutes.forEach((item, index) => {
    addRecord({
      command: DOCTOR_MCP_COMMAND,
      route: item?.sub_action,
      mutating: item?.mutating,
      ask_first: item?.ask_first,
      write_scope: item?.write_scope,
    }, `${sourcePath(routesPath)} mcp_subroutes[${index}]`);
  });

  const standalone = manifest.standalone === undefined ? [] : manifest.standalone;
  if (!Array.isArray(standalone)) {
    throw new Error('[command-bridges] _routes.yaml standalone must be an array');
  }
  standalone.forEach((item, index) => {
    if (!item || typeof item.command !== 'string') return;
    const label = `${sourcePath(routesPath)} standalone[${index}]`;
    const actions = item.actions;
    // One command, several actions: the action carries the class because the
    // bare command name cannot say what the run will do.
    if (actions && typeof actions === 'object' && !Array.isArray(actions)) {
      for (const [action, entry] of Object.entries(actions)) {
        addRecord({
          command: item.command,
          route: action,
          mutating: entry?.mutating,
          ask_first: entry?.ask_first,
          write_scope: entry?.write_scope,
        }, `${label}.actions.${action}`);
      }
      return;
    }
    addRecord({
      command: item.command,
      route: null,
      mutating: item.mutating,
      ask_first: item.ask_first,
      write_scope: item.write_scope,
    }, label);
  });

  return records;
}

// Three views of one surface. A name in the tree that neither declaration
// carries is a command nothing can suggest; a declared name with no file is a
// bridge to a command the operator cannot type. Either way the inventory lies,
// so both directions are reported together.
function identityViolations({ treeCommands, metadataCommands, doctorCommands }) {
  const tree = new Set(treeCommands);
  const declared = new Set([...metadataCommands, ...doctorCommands]);
  const violations = [];
  for (const command of tree) {
    if (!declared.has(command)) {
      violations.push(
        `${command}: command file has no command-metadata.json entry and no doctor route`,
      );
    }
  }
  for (const command of declared) {
    if (!tree.has(command)) {
      violations.push(
        `${command}: declared in command-metadata.json or the doctor manifest but has no command file`,
      );
    }
  }
  return violations.sort();
}

// The generated file is compared byte for byte, so the order has to be total:
// command name first, then the bare route before its named ones.
function commandPolicies(skillsRoot, routesPath) {
  return [...metadataRiskRecords(skillsRoot), ...doctorRiskRecords(routesPath)]
    .map((record) => ({
      command: record.command,
      route: record.route,
      mutating: record.mutating,
      askFirst: record.ask_first,
      policy: derivePolicy(record),
    }))
    .sort((left, right) => {
      if (left.command !== right.command) return left.command.localeCompare(right.command);
      if (left.route === right.route) return 0;
      if (left.route === null) return -1;
      if (right.route === null) return 1;
      return left.route.localeCompare(right.route);
    });
}

function assertUniqueIds(entries) {
  const seen = new Map();
  for (const entry of entries) {
    const previous = seen.get(entry.id);
    if (previous) {
      throw new Error(
        `[command-bridges] Duplicate bridge id ${entry.id}: ${previous.source} and ${entry.source}`,
      );
    }
    seen.set(entry.id, entry);
  }
}

function stringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string' || !entry)) {
    throw new Error(`[command-bridges] ${label} must be an array of non-empty strings`);
  }
  return value;
}

// A vector has to describe the job a command does, so the slash form is dropped
// before the text is built. A name left in would hand the scorer a second copy
// of the token it already matches literally.
function commandEmbeddingText({ description, job, ownedSignals }) {
  // Each part is cleaned before the join: a part that was only a slash command,
  // or one that already ends in a full stop, would otherwise leave stray
  // punctuation in text whose only reader is an embedder.
  // A prompt is written in the asker's voice, and so are the job sentence and
  // the owned phrases. The description is written in the command's voice and
  // carries mode and step notes no asker types, so it stands in only when a
  // record states no job.
  const lead = typeof job === 'string' && job.trim() ? job : description;
  return [lead, ...ownedSignals]
    .filter((part) => typeof part === 'string')
    .map((part) => part
      .replace(/\/?[a-z-]+:[a-z-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.\s]+$/, ''))
    .filter(Boolean)
    .join('. ');
}

// Only a bridge a scorer can offer carries meaning text, and where it comes from
// depends on the row: a metadata row states it in its own record, while a doctor
// row states it in the router sentence and the route phrases it already declares.
function entryMeaning(entryId, command, isDoctor) {
  if (!isDoctor) return METADATA_MEANING.get(command);
  const { description, phrases } = DOCTOR_DETAILS.get(entryId);
  return { description, ownedSignals: phrases };
}

// Only a route the manifest classes as read-only may answer a list or show
// question; add-only and mutating routes keep the read-only confidence floor.
function isReadOnlyRoute(item) {
  return item.mutating === 'read-only';
}

// A command with several targets runs only as `<command> <target>`, yet its router binds one
// target when none is typed. A route marked default_target also answers the bare command, so
// the typed command alone still reaches a bridge.
function doctorDefaultTarget(route, label, multiTarget) {
  if (!Object.prototype.hasOwnProperty.call(route, 'default_target')) return null;
  if (typeof route.default_target !== 'boolean') {
    throw new Error(`[command-bridges] ${label}.default_target must be a boolean`);
  }
  if (!route.default_target) return null;
  if (!multiTarget) {
    throw new Error(
      `[command-bridges] ${label}.default_target is only valid on a command with several targets`,
    );
  }
  return route.command;
}

// A lead phrase is matched against the whole prompt, so the state word has to be
// a word of its own: "on" inside "environment" would clear a phrase that asks
// nothing about state.
function hasStateWord(phrase) {
  return phrase
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .some((word) => LEAD_PHRASE_STATE_WORDS.includes(word));
}

// A route that asks first may lead with a phrase that names no state or health
// word, because the ask already keeps the run behind a decision.
function doctorLeadPhrases(item, label, triggerPhrases) {
  const leadPhrases = Object.prototype.hasOwnProperty.call(item, 'lead_phrases')
    ? stringArray(item.lead_phrases, `${label}.lead_phrases`)
    : [];
  const asksFirst = derivePolicy({
    doctor: true,
    mutating: item.mutating,
    ask_first: item.ask_first,
    write_scope: item.write_scope,
  }) === 'ask';
  for (const phrase of leadPhrases) {
    if (!triggerPhrases.includes(phrase)) {
      throw new Error(
        `[command-bridges] ${label}.lead_phrases entry ${JSON.stringify(phrase)} must also appear in trigger_phrases`,
      );
    }
    if (!asksFirst && !hasStateWord(phrase)) {
      throw new Error(
        `[command-bridges] ${label}.lead_phrases entry ${JSON.stringify(phrase)} needs a state or health word because its route does not ask first`,
      );
    }
  }
  return leadPhrases;
}

function compatibilityByInventoryId(entries, inventoryIds, platform) {
  if (!Array.isArray(entries)) {
    throw new Error(`[command-bridges] scoring-compatibility.json ${platform} must be an array`);
  }
  const byInventoryId = new Map();
  const orders = new Set();
  for (const [index, entry] of entries.entries()) {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[command-bridges] ${platform}[${index}] must be an object`);
    }
    const { inventoryId, order, id, description } = entry;
    if (
      typeof inventoryId !== 'string'
      || !inventoryIds.has(inventoryId)
      || !Number.isInteger(order)
      || order < 0
      || typeof id !== 'string'
      || !id
      || typeof description !== 'string'
    ) {
      throw new Error(
        `[command-bridges] ${platform}[${index}] requires a known inventoryId, ` +
          'non-negative integer order, id, and description',
      );
    }
    if (byInventoryId.has(inventoryId)) {
      throw new Error(`[command-bridges] Duplicate ${platform} inventoryId ${inventoryId}`);
    }
    if (orders.has(order)) {
      throw new Error(`[command-bridges] Duplicate ${platform} order ${order}`);
    }
    const isDoctor = inventoryId.startsWith(DOCTOR_PREFIX);
    if (isDoctor && id !== inventoryId) {
      throw new Error(
        `[command-bridges] ${platform}[${index}] doctor bridge id must equal its inventoryId`,
      );
    }
    if (platform === 'typescript') {
      if (!isDoctor) {
        if (typeof entry.name !== 'string' || !entry.name) {
          throw new Error(`[command-bridges] typescript[${index}] requires name`);
        }
        stringArray(entry.keywords, `typescript[${index}].keywords`);
        stringArray(entry.domains, `typescript[${index}].domains`);
        stringArray(entry.intentSignals, `typescript[${index}].intentSignals`);
      }
    } else {
      if (!isDoctor) {
        stringArray(entry.slashMarkers, `python[${index}].slashMarkers`);
      }
      if ('owningSkill' in entry && (typeof entry.owningSkill !== 'string' || !entry.owningSkill)) {
        throw new Error(`[command-bridges] python[${index}].owningSkill must be a non-empty string`);
      }
      if ('deprecated' in entry && typeof entry.deprecated !== 'boolean') {
        throw new Error(`[command-bridges] python[${index}].deprecated must be boolean`);
      }
    }
    byInventoryId.set(inventoryId, entry);
    orders.add(order);
  }
  return byInventoryId;
}

// A standalone skill has no hub registry, so the only record of what its
// commands reach is its own metadata. The match is by command rather than by id
// because one command can enter the inventory under a row that carries its own
// historical id.
function standaloneCommandRecords(entries, metadata) {
  const byCommand = new Map();
  for (const record of metadata) {
    if (record.standalone) byCommand.set(record.command, record);
  }
  return entries
    .filter((entry) => byCommand.has(entry.command))
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((entry) => ({ entry, record: byCommand.get(entry.command) }));
}

// A generated row is the command's only reach, so one phrase would leave it
// indistinguishable from every other command and the activation would claim a
// surface the scorer cannot actually offer.
function assertPlainChatSignals(records) {
  for (const { entry, record } of records) {
    if (record.ownedSignals.length < 2) {
      throw new Error(
        `[command-bridges] ${entry.command} needs at least two userIntent.ownedSignals `
          + `in ${record.source}, found ${record.ownedSignals.length}`,
      );
    }
  }
}

function commandNamespace(command) {
  return command.slice(1, command.indexOf(':'));
}

// A standalone skill's commands are active by construction: the metadata already
// names the phrases a person types, so a hand row would be a second copy left to
// drift. A hand row still wins where one exists, because a curated row can carry
// phrases the metadata cannot know. Orders start past the highest hand-written
// one so a later hand row never has to renumber a generated one.
function activateStandaloneCommands(byInventoryId, records, platform) {
  let nextOrder = 0;
  for (const row of byInventoryId.values()) {
    nextOrder = Math.max(nextOrder, row.order + 1);
  }
  for (const { entry, record } of records) {
    if (byInventoryId.has(entry.id)) continue;
    byInventoryId.set(entry.id, standaloneRuntimeRow(entry, record, nextOrder, platform));
    nextOrder += 1;
  }
}

function standaloneRuntimeRow(entry, record, order, platform) {
  if (platform === 'typescript') {
    return {
      inventoryId: entry.id,
      order,
      id: entry.id,
      name: entry.id,
      description: record.description,
      keywords: [...record.ownedSignals],
      domains: [commandNamespace(entry.command), 'command'],
      intentSignals: [...record.ownedSignals],
      // The class decides this for every command, not only a doctor route.
      ...(isReadOnlyRoute(record) ? { readOnly: true } : {}),
    };
  }
  return {
    inventoryId: entry.id,
    order,
    id: entry.id,
    description: record.description,
    slashMarkers: [entry.command, entry.command.slice(1)],
    owningSkill: record.skillId,
  };
}

function runtimeCompatibility(entries, metadata) {
  const compatibility = readJson(COMPATIBILITY_PATH);
  if (!compatibility || typeof compatibility !== 'object' || compatibility.schemaVersion !== 1) {
    throw new Error('[command-bridges] scoring-compatibility.json requires schemaVersion 1');
  }
  const inventoryIds = new Set(entries.map((entry) => entry.id));
  const typescript = compatibilityByInventoryId(
    compatibility.typescript,
    inventoryIds,
    'typescript',
  );
  const python = compatibilityByInventoryId(compatibility.python, inventoryIds, 'python');
  const standalone = standaloneCommandRecords(entries, metadata);
  assertPlainChatSignals(standalone);
  activateStandaloneCommands(typescript, standalone, 'typescript');
  activateStandaloneCommands(python, standalone, 'python');
  const pythonOwnerNormalization = compatibility.pythonOwnerNormalization;
  if (
    !pythonOwnerNormalization
    || typeof pythonOwnerNormalization !== 'object'
    || Array.isArray(pythonOwnerNormalization)
    || Object.entries(pythonOwnerNormalization).some(
      ([key, value]) => !key || typeof value !== 'string' || !value,
    )
  ) {
    throw new Error(
      '[command-bridges] scoring-compatibility.json pythonOwnerNormalization must be a string map',
    );
  }
  const activePythonIds = new Set([...python.values()].map((entry) => entry.id));
  for (const runtimeId of Object.keys(pythonOwnerNormalization)) {
    if (!activePythonIds.has(runtimeId)) {
      throw new Error(
        `[command-bridges] pythonOwnerNormalization references inactive bridge ${runtimeId}`,
      );
    }
  }
  return { typescript, python, pythonOwnerNormalization };
}

function tsString(value) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function tsArray(values) {
  return `[${values.map((value) => tsString(value)).join(', ')}]`;
}

function doctorRuntime(entryId, platform, compat) {
  const { runnable, bareCommand, phrases, leadPhrases, readOnly } = DOCTOR_DETAILS.get(entryId);
  if (platform === 'typescript') {
    return {
      ...compat,
      name: runnable,
      keywords: bareCommand ? [...phrases, bareCommand] : [...phrases],
      intentSignals: [runnable],
      ...(leadPhrases.length > 0 ? { leadPhrases: [...leadPhrases] } : {}),
      ...(readOnly ? { readOnly: true } : {}),
      domains: ['doctor', 'command'],
    };
  }
  return {
    ...compat,
    slashMarkers: bareCommand ? [runnable, bareCommand] : [runnable],
    ...(leadPhrases.length > 0 ? { leadPhrases: [...leadPhrases] } : {}),
  };
}

function runtimeOrdered(entries, platform) {
  return [...entries].sort((left, right) => {
    const leftRuntime = left.runtime[platform];
    const rightRuntime = right.runtime[platform];
    if (leftRuntime.enabled !== rightRuntime.enabled) {
      return leftRuntime.enabled ? -1 : 1;
    }
    if (leftRuntime.enabled && rightRuntime.enabled) {
      return leftRuntime.order - rightRuntime.order;
    }
    return left.id.localeCompare(right.id);
  });
}

function renderTypescriptBridge(entry) {
  const runtime = entry.runtime.typescript;
  const active = runtime.enabled;
  const id = active ? runtime.id : entry.id;
  const name = active ? runtime.name : entry.id;
  const description = active ? runtime.description : '';
  const keywords = active ? runtime.keywords : [];
  const domains = active ? runtime.domains : [];
  const intentSignals = active ? runtime.intentSignals : [];
  const lines = [
    '  {',
    `    inventoryId: ${tsString(entry.id)},`,
    `    ownerSkill: ${tsString(entry.skillId)},`,
    `    routingEnabled: ${active},`,
    `    id: ${tsString(id)},`,
    "    kind: 'command',",
    "    family: 'system',",
    "    category: 'command',",
    `    name: ${tsString(name)},`,
    `    description: ${tsString(description)},`,
    `    keywords: ${tsArray(keywords)},`,
    `    domains: ${tsArray(domains)},`,
    `    intentSignals: ${tsArray(intentSignals)},`,
  ];
  if (active && runtime.leadPhrases?.length) {
    lines.push(`    leadPhrases: ${tsArray(runtime.leadPhrases)},`);
  }
  if (active && runtime.readOnly === true) {
    lines.push('    readOnly: true,');
  }
  lines.push(
    '    derivedTriggers: [],',
    '    derivedKeywords: [],',
    '    sourcePath: null,',
    "    lifecycleStatus: 'active',",
    '  },',
  );
  return lines.join('\n');
}

function renderTypescriptProjection(entries) {
  const body = runtimeOrdered(entries, 'typescript').map(renderTypescriptBridge).join('\n');
  return `export const GENERATED_COMMAND_BRIDGES: readonly CommandBridgeProjection[] = [\n${body}\n];`;
}

function pythonString(value) {
  return JSON.stringify(value);
}

function pythonList(values) {
  return `[${values.map((value) => pythonString(value)).join(', ')}]`;
}

function renderPythonBridge(entry) {
  const runtime = entry.runtime.python;
  const active = runtime.enabled;
  const runtimeId = active ? runtime.id : entry.id;
  const description = active ? runtime.description : '';
  const slashMarkers = active ? runtime.slashMarkers : [entry.command];
  const lines = [
    `    ${pythonString(runtimeId)}: {`,
    `        "description": ${pythonString(description)},`,
    `        "slash_markers": ${pythonList(slashMarkers)},`,
  ];
  if (active && runtime.leadPhrases?.length) {
    lines.push(`        "lead_phrases": ${pythonList(runtime.leadPhrases)},`);
  }
  if (active && runtime.deprecated === true) {
    lines.push('        "deprecated": True,');
  }
  if (active && typeof runtime.owningSkill === 'string') {
    lines.push(`        "owning_skill": ${pythonString(runtime.owningSkill)},`);
  }
  lines.push(
    `        "inventory_id": ${pythonString(entry.id)},`,
    `        "command": ${pythonString(entry.command)},`,
    `        "skill_id": ${pythonString(entry.skillId)},`,
    `        "owner_mode": ${pythonString(entry.ownerMode)},`,
    `        "routing_enabled": ${active ? 'True' : 'False'},`,
    '    },',
  );
  return lines.join('\n');
}

function renderPythonProjection(entries, pythonOwnerNormalization) {
  const body = runtimeOrdered(entries, 'python').map(renderPythonBridge).join('\n');
  const normalization = Object.entries(pythonOwnerNormalization)
    .map(([id, owner]) => `    ${pythonString(id)}: ${pythonString(owner)},`)
    .join('\n');
  return [
    'GENERATED_COMMAND_BRIDGES = {',
    body,
    '}',
    '',
    'GENERATED_COMMAND_BRIDGE_OWNER_NORMALIZATION = {',
    normalization,
    '}',
  ].join('\n');
}

function replaceMarkedBlock(content, startMarker, endMarker, replacement, filePath) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start < 0 || end < 0 || end < start) {
    throw new Error(`[command-bridges] Missing generated markers in ${sourcePath(filePath)}`);
  }
  const bodyStart = start + startMarker.length;
  return `${content.slice(0, bodyStart)}\n${replacement}\n${content.slice(end)}`;
}

// The command a reader can type for an entry: a doctor bridge runs under the
// runnable its manifest names, while a metadata command is typed as declared.
function entryRunnable(entry) {
  const doctor = DOCTOR_DETAILS.get(entry.id);
  return doctor ? doctor.runnable : entry.command;
}

// A runnable names its target after the command, so its row is read from the
// same string the reader types. A command typed alone takes its route-null
// record when one exists. A command with several routes and no route-null
// record offers no way to narrow the run, so the strictest route decides. The
// whole record comes back because the class travels with the policy it justifies.
function runnablePolicyRecord(runnable, policies) {
  const space = runnable.indexOf(' ');
  const command = space === -1 ? runnable : runnable.slice(0, space);
  const target = space === -1 ? null : runnable.slice(space + 1);
  const records = policies.filter((record) => record.command === command);
  if (records.length === 0) {
    throw new Error(`[command-bridges] No policy record for ${runnable}`);
  }
  if (target !== null) {
    const match = records.find((record) => record.route === target);
    if (!match) {
      throw new Error(`[command-bridges] No policy record for ${runnable}`);
    }
    return match;
  }
  const bare = records.find((record) => record.route === null);
  if (bare) return bare;
  return records.reduce((strictest, record) => (
    POLICY_STRICTNESS.indexOf(record.policy) > POLICY_STRICTNESS.indexOf(strictest.policy)
      ? record
      : strictest
  ));
}

// Every id a scorer can return gets a row, because the reader sees whichever id
// the active runtime produced. The two runtime ids and the inventory id can all
// differ, so all three are emitted and an id repeated within one entry collapses
// to a single row.
function renderCommandRows(entries, policies) {
  const rows = new Map();
  const runnablePolicies = new Map();
  for (const entry of entries) {
    const { typescript, python } = entry.runtime;
    if (!typescript.enabled && !python.enabled) continue;
    const runnable = entryRunnable(entry);
    const policyRecord = runnablePolicyRecord(runnable, policies);
    runnablePolicies.set(runnable, policyRecord.policy);
    const ids = new Set([entry.id]);
    if (typescript.enabled) ids.add(typescript.id);
    if (python.enabled) ids.add(python.id);
    const row = {
      command: runnable,
      policy: policyRecord.policy,
      // The class travels with the policy that justifies it, so a record that
      // states no class leaves the field out rather than guessing a default.
      ...(policyRecord.mutating ? { mutating: policyRecord.mutating } : {}),
      ownerSkillId: entry.skillId,
    };
    for (const id of ids) {
      const previous = rows.get(id);
      if (previous && previous !== row) {
        throw new Error(`[command-bridges] Duplicate command row id ${id}`);
      }
      rows.set(id, row);
    }
  }
  const rowLines = [...rows.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, row]) => {
      const fields = [
        `command: ${tsString(row.command)}`,
        `policy: ${tsString(row.policy)}`,
      ];
      if (row.mutating) fields.push(`mutating: ${tsString(row.mutating)}`);
      fields.push(`ownerSkillId: ${tsString(row.ownerSkillId)}`);
      return `  ${tsString(id)}: { ${fields.join(', ')} },`;
    });
  const policyLines = [...runnablePolicies.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([runnable, policy]) => `  ${tsString(runnable)}: ${tsString(policy)},`);
  return [
    'export const COMMAND_ROWS: Readonly<Record<string, CommandRow>> = {',
    ...rowLines,
    '};',
    "export const COMMAND_POLICIES: Readonly<Record<string, 'run' | 'start' | 'ask'>> = {",
    ...policyLines,
    '};',
  ].join('\n');
}

// Hub-then-mode nesting so a reader scans one hub's modes together, and the
// records arrive already ordered so the block is byte-identical between runs.
function renderModeCommands(records) {
  const lines = [
    'export const MODE_COMMANDS: Readonly<Record<string, Readonly<Record<string, string>>>> = {',
  ];
  let hubId = null;
  for (const record of records) {
    if (record.hubId !== hubId) {
      if (hubId !== null) lines.push('  },');
      hubId = record.hubId;
      lines.push(`  ${tsString(hubId)}: {`);
    }
    lines.push(`    ${tsString(record.workflowMode)}: ${tsString(record.command)},`);
  }
  if (hubId !== null) lines.push('  },');
  lines.push('};');
  return lines.join('\n');
}

function generatedSources(entries, pythonOwnerNormalization, modeCommands, policies) {
  const typescript = readFileSync(TS_PROJECTION_PATH, 'utf8');
  const python = readFileSync(PY_ADVISOR_PATH, 'utf8');
  const commandAttach = readFileSync(COMMAND_ATTACH_PATH, 'utf8');
  // Two blocks share this file, so the second replacement starts from the first
  // one's output rather than the file on disk, or one block would overwrite the
  // other's fresh render.
  const commandAttachWithRows = replaceMarkedBlock(
    commandAttach,
    COMMAND_ROWS_GENERATED_START,
    COMMAND_ROWS_GENERATED_END,
    renderCommandRows(entries, policies),
    COMMAND_ATTACH_PATH,
  );
  return [
    {
      path: TS_PROJECTION_PATH,
      current: typescript,
      next: replaceMarkedBlock(
        typescript,
        TS_GENERATED_START,
        TS_GENERATED_END,
        renderTypescriptProjection(entries),
        TS_PROJECTION_PATH,
      ),
    },
    {
      path: PY_ADVISOR_PATH,
      current: python,
      next: replaceMarkedBlock(
        python,
        PY_GENERATED_START,
        PY_GENERATED_END,
        renderPythonProjection(entries, pythonOwnerNormalization),
        PY_ADVISOR_PATH,
      ),
    },
    {
      path: COMMAND_ATTACH_PATH,
      current: commandAttach,
      next: replaceMarkedBlock(
        commandAttachWithRows,
        COMMAND_ATTACH_GENERATED_START,
        COMMAND_ATTACH_GENERATED_END,
        renderModeCommands(modeCommands),
        COMMAND_ATTACH_PATH,
      ),
    },
  ];
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function main() {
  // CLI-only rejection: requiring this module (for example from tests) must
  // not exit on arguments belonging to the host process.
  if (require.main === module) {
    const unknownArg = process.argv.slice(2).find((token) => token !== '--check');
    if (unknownArg !== undefined) {
      console.error(`derive-command-bridges.cjs: unknown option: ${unknownArg}`);
      console.error('usage: derive-command-bridges.cjs [--check]');
      process.exit(2);
    }
  }
  const checkOnly = process.argv.includes('--check');
  const metadata = metadataEntries();
  const doctor = doctorRouteEntries();
  const tree = commandTreeNames();
  const metadataRisk = metadataRiskRecords();
  const doctorRisk = doctorRiskRecords();
  const modeCommands = modeCommandRecords();
  const violations = identityViolations({
    treeCommands: tree,
    metadataCommands: metadataRisk.map((record) => record.command),
    doctorCommands: doctorRisk.map((record) => record.command),
  });
  if (violations.length > 0) {
    throw new Error(`[command-bridges] command inventory mismatch:\n${violations.join('\n')}`);
  }
  const inventory = [...metadata, ...doctor]
    .sort((left, right) => left.id.localeCompare(right.id));
  assertUniqueIds(inventory);
  const compatibility = runtimeCompatibility(inventory, metadata);
  const entries = inventory.map((entry) => {
    const isDoctor = entry.id.startsWith(DOCTOR_PREFIX);
    const typescript = compatibility.typescript.get(entry.id);
    const python = compatibility.python.get(entry.id);
    // A command nothing describes has nothing written to embed, so the field
    // appears only where a source sentence exists for it.
    const meaning = typescript ? entryMeaning(entry.id, entry.command, isDoctor) : undefined;
    const runtime = { typescript: { enabled: false }, python: { enabled: false } };
    if (typescript) {
      runtime.typescript = {
        enabled: true,
        ...(isDoctor ? doctorRuntime(entry.id, 'typescript', typescript) : typescript),
      };
    }
    if (python) {
      runtime.python = {
        enabled: true,
        ...(isDoctor ? doctorRuntime(entry.id, 'python', python) : python),
      };
    }
    return {
      ...entry,
      ...(meaning ? { embeddingText: commandEmbeddingText(meaning) } : {}),
      runtime,
    };
  });

  const policies = commandPolicies();
  const projection = {
    schemaVersion: 2,
    generatedBy: 'scripts/command-bridges/derive-command-bridges.cjs',
    counts: {
      commandMetadata: metadata.length,
      doctorRoutes: doctor.length,
      generated: entries.length,
      typescriptActive: compatibility.typescript.size,
      pythonActive: compatibility.python.size,
    },
    entries,
    commandPolicies: policies,
  };
  const output = `${JSON.stringify(projection, null, 2)}\n`;
  const sources = generatedSources(
    entries,
    compatibility.pythonOwnerNormalization,
    modeCommands,
    policies,
  );
  const changed = [
    ...(readFileSync(OUTPUT_PATH, 'utf8') === output ? [] : [OUTPUT_PATH]),
    ...sources.filter(({ current, next }) => current !== next).map(({ path }) => path),
  ];

  if (!checkOnly) {
    writeFileSync(OUTPUT_PATH, output, 'utf8');
    for (const source of sources) {
      if (source.current !== source.next) {
        writeFileSync(source.path, source.next, 'utf8');
      }
    }
  }

  console.log(JSON.stringify({
    status: changed.length === 0 ? 'fresh' : checkOnly ? 'stale' : 'generated',
    counts: projection.counts,
    changed: changed.map(sourcePath),
  }, null, 2));
  if (checkOnly && changed.length > 0) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  metadataEntries,
  commandTreeNames,
  modeCommandRecords,
  validateRiskKeys,
  derivePolicy,
  metadataRiskRecords,
  doctorRiskRecords,
  doctorLeadPhrases,
  identityViolations,
  commandPolicies,
};
