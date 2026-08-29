#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ magicpath-utcp-manual — Emit the UTCP manual for the MagicPath CLI       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// The CLI transport registers a manual by EXECUTING a command and parsing its
// stdout as a UTCP manual; a call template carries no inline tool list. So the
// tool definitions have to come from something that prints them, and this is
// that something. It writes the manual to stdout and nothing else.
//
// Only read-only commands are described here. The CLI can also write `.tsx`
// files into the calling project, install npm packages, and create remote
// projects and component revisions. Those stay unreachable from a tool call
// until someone decides otherwise, because an agent picking a tool should not
// be able to reach the destructive half by accident.

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const UTCP_VERSION = '1.0.0';
const MANUAL_VERSION = '1.0.0';

// Every command goes through the wrapper rather than straight to the binary.
// The transport substitutes a literal MISSING_ARG_<name> token for any unset
// optional instead of dropping the flag, and a filter flag carrying that token
// returns an empty result that reads as a real answer. The wrapper strips them.
// Resolved relative to this file so the manual does not pin one machine's paths.
const path = require('node:path');
const CLI = `node ${path.join(__dirname, 'magicpath-utcp-exec.cjs')}`;

const TAGS = Object.freeze(['magicpath', 'design', 'components', 'read-only']);

// ─────────────────────────────────────────────────────────────────────────────
// 2. TOOL DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

// Each entry is one read-only command. `args` name the placeholders the
// transport substitutes; every command requests JSON so results parse instead
// of arriving as prose a caller has to scrape.
const READ_ONLY_COMMANDS = Object.freeze([
  {
    name: 'info',
    command: 'info',
    description: 'Authentication state, the signed-in user, their teams and projects, and the CLI version. Answers without credentials, so it is the cheapest way to check whether MagicPath is reachable and set up.',
  },
  {
    name: 'whoami',
    command: 'whoami',
    description: 'The currently authenticated MagicPath user. Fails when no credential is present.',
  },
  {
    name: 'search_components',
    command: 'search',
    description: 'Search component names across every accessible project, personal and team. Use this first when looking for a component by name.',
    args: [
      { name: 'query', type: 'string', required: true, positional: true, description: 'Text to match against component names.' },
      { name: 'limit', type: 'string', required: false, flag: '--limit', description: 'Maximum results. Defaults to 20.' },
      { name: 'team', type: 'string', required: false, flag: '--team', description: 'Restrict the search to one team, by name or id.' },
    ],
  },
  {
    name: 'inspect_component',
    command: 'inspect',
    description: "Read a component's source, dependencies and import information without installing anything. Writes no files and needs no package manifest, so it is the safe way to read a component, and the only way to read one into a non-React project.",
    args: [
      { name: 'generated_name', type: 'string', required: true, positional: true, description: 'The component generated name, such as wispy-river-5234.' },
    ],
  },
  {
    name: 'list_projects',
    command: 'list-projects',
    description: 'List projects across the personal workspace and every team the user belongs to.',
    args: [
      { name: 'team', type: 'string', required: false, flag: '--team', description: 'Restrict to one team, by name or id.' },
      { name: 'limit', type: 'string', required: false, flag: '--limit', description: 'Maximum results.' },
    ],
  },
  {
    name: 'list_components',
    command: 'list-components',
    description: 'List the components inside one project. Paginates by cursor: pass the previous page last id as `after`.',
    args: [
      { name: 'project_id', type: 'string', required: true, positional: true, description: 'The project id.' },
      { name: 'limit', type: 'string', required: false, flag: '--limit', description: 'Maximum results per page. Defaults to 100.' },
      { name: 'after', type: 'string', required: false, flag: '--after', description: 'Fetch components after this id.' },
    ],
  },
  {
    name: 'list_teams',
    command: 'list-teams',
    description: "The teams the current user belongs to, with their role in each.",
  },
  {
    name: 'list_members',
    command: 'list-members',
    description: 'The members of one team.',
    args: [
      { name: 'team', type: 'string', required: true, flag: '--team', description: 'Team name or id.' },
    ],
  },
  {
    name: 'list_themes',
    command: 'list-themes',
    description: 'List design systems available to the user, or to one team.',
    args: [
      { name: 'team', type: 'string', required: false, flag: '--team', description: 'Restrict to one team, by name or id.' },
    ],
  },
  {
    name: 'get_theme',
    command: 'get-theme',
    description: "Fetch a design system's CSS variables, fonts and styling prompt. Use this to match generated UI to an existing brand rather than inventing values.",
    args: [
      { name: 'theme', type: 'string', required: true, positional: true, description: 'Theme id or name.' },
      { name: 'team', type: 'string', required: false, flag: '--team', description: 'Look the theme up within one team.' },
    ],
  },
  {
    name: 'list_installed',
    command: 'list-installed',
    description: 'List MagicPath components already present in the current project directory.',
    args: [
      { name: 'path', type: 'string', required: false, flag: '--path', description: 'Directory to scan. Defaults to the conventional component path.' },
    ],
  },
  {
    name: 'selection',
    command: 'selection',
    description: 'The components and images currently selected on the MagicPath web canvas, plus the projects the user has open. Returns empty collections when nothing is selected or no canvas is open, so it is safe to call speculatively.',
  },
  {
    name: 'active_project',
    command: 'active-project',
    description: 'The projects the user currently has open in the MagicPath web app. Lighter than a selection lookup when only the project context is needed.',
  },
  {
    name: 'share_link',
    command: 'share',
    description: 'Print a shareable URL for a component or project on stdout without opening a browser. Use this when a link has to be presented in conversation.',
    args: [
      { name: 'identifier', type: 'string', required: true, positional: true, description: 'A component generated name, or a numeric project id.' },
    ],
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. MANUAL CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────

// The transport replaces this marker with the caller's value, or with a
// MISSING_ARG_<name> token when the caller supplied none. Optional flags are
// therefore always written into the command, and the wrapper removes the ones
// that came back unfilled.
function placeholder(argumentName) {
  return `UTCP_ARG_${argumentName}_UTCP_END`;
}

function buildCommand(definition) {
  const parts = [CLI, definition.command];

  for (const argument of definition.args ?? []) {
    if (argument.positional) {
      parts.push(placeholder(argument.name));
    } else {
      parts.push(argument.flag, placeholder(argument.name));
    }
  }

  parts.push('-o', 'json');
  return parts.join(' ');
}

function buildInputs(definition) {
  const properties = {};
  const required = [];

  for (const argument of definition.args ?? []) {
    properties[argument.name] = {
      type: argument.type,
      description: argument.description,
    };
    if (argument.required) required.push(argument.name);
  }

  const inputs = { type: 'object', properties };
  if (required.length > 0) inputs.required = required;
  return inputs;
}

function buildTool(definition) {
  return {
    name: definition.name,
    description: definition.description,
    inputs: buildInputs(definition),
    outputs: { type: 'object', properties: {} },
    tags: [...TAGS],
    tool_call_template: {
      name: definition.name,
      call_template_type: 'cli',
      commands: [{ command: buildCommand(definition), append_to_final_output: true }],
    },
  };
}

function buildManual() {
  return {
    utcp_version: UTCP_VERSION,
    manual_version: MANUAL_VERSION,
    tools: READ_ONLY_COMMANDS.map(buildTool),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(buildManual(), null, 2)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { buildManual, READ_ONLY_COMMANDS };
