#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Scaffold Template Renderer
// ───────────────────────────────────────────────────────────────────
'use strict';

// Renders the sk-code-ci workflow or job template from the repository CI profile and
// prints it. /doctor:ci scaffold starts every new workflow from this output, so the
// branches, the switch condition, the path twins, the setup action and the README step
// come from the repository's own profile and never from this repository's defaults.
// It writes nothing: the route shows the file, asks, and creates it itself.
//
// The template language is small on purpose, and every directive sits in a YAML
// comment or a plain scalar, so the template itself still parses as YAML. <<name>> is a
// value, a line holding only #<<#name>> or #<<^name>> opens a block kept when the value
// is set or unset, #<</name>> closes it, <<#name>>text<</name>> keeps or drops text
// inside one line, a line holding only #<<=name>> or #<<=name:width>> expands to
// several lines, and a line that starts with #<<! is a note for the template's reader
// that never reaches the output.
//
// Usage: ci-scaffold.cjs [--job | --protected] [--group=<NAME>] [--profile <path>]
//   --job             render the job block template instead of the workflow template
//   --protected       print the profile's protected workflow file names, one per line
//   --group=<NAME>    the switch group the job reads, by full name or by its suffix
//   --profile <path>  read the CI profile from this file instead of discovering it
// Exit codes: 0 rendered, 2 bad argument or unknown group, 3 the CI profile is missing
// or invalid, 4 the template names a slot the renderer does not fill

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { ProfileError, loadProfile } = require('./lib/ci-profile.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../../../..');
const ASSETS = path.join(REPO_ROOT, '.skilled/skills/sk-code/sk-code-ci/assets');
const TEMPLATES = { workflow: 'workflow-template.yml', job: 'job-block-template.yml' };
const USAGE = 'Usage: node .skilled/commands/doctor/scripts/ci-scaffold.cjs [--job | --protected] [--group=<NAME>] [--profile <path>]';

const PLAIN_SCALAR = /^[A-Za-z0-9._/-]+$/;
const NOTE_LINE = '#<<!';
const SECTION_LINE = /^\s*#<<([#^/])([A-Za-z][A-Za-z0-9]*)>>\s*$/;
const BLOCK_LINE = /^(\s*)#<<=([A-Za-z][A-Za-z0-9]*)(?::(\d+))?>>\s*$/;
const INLINE_SECTION = /<<([#^])([A-Za-z][A-Za-z0-9]*)>>(.*?)<<\/\2>>/g;
const VALUE_SLOT = /<<([A-Za-z][A-Za-z0-9]*)>>/g;

class TemplateError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { job: false, protectedList: false, group: null, profile: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--job') options.job = true;
    else if (arg === '--protected') options.protectedList = true;
    else if (arg.startsWith('--group=')) options.group = arg.slice('--group='.length);
    else if (arg === '--profile' || arg.startsWith('--profile=')) {
      const value = arg === '--profile' ? argv[(index += 1)] : arg.slice('--profile='.length);
      if (!value) throw new Error('--profile needs a path');
      options.profile = value;
    } else throw new Error(`unknown argument: ${arg}`);
  }
  if (options.job && options.protectedList) throw new Error('--job and --protected cannot be combined');
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALUES FROM THE PROFILE
// ─────────────────────────────────────────────────────────────────────────────

function yamlScalar(value) {
  return PLAIN_SCALAR.test(value) ? value : `'${value.replace(/'/g, "''")}'`;
}

function joinWithOr(items) {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}`;
}

// A group named with the master's prefix is shown by its suffix, the way the job-shape
// rules name the groups.
function groupLabel(group, master) {
  return master && group.startsWith(`${master}_`) ? group.slice(master.length + 1) : group;
}

function pickGroup(profile, wanted) {
  const { master, groups } = profile.switch;
  if (!wanted) return groups[0] || null;
  const found = groups.find((group) => group === wanted || groupLabel(group, master) === wanted);
  if (!found) throw new Error(`--group=${wanted} is not a switch group in the CI profile (${groups.join(', ') || 'none'})`);
  return found;
}

function switchCondition(master, group) {
  return [master, group].filter(Boolean).map((name) => `vars.${name} != 'off'`).join(' && ');
}

/**
 * Every value the templates read, derived from one normalized profile. A value that is
 * null, false or an empty list leaves its block out.
 *
 * @param {Object} profile - A normalized CI profile.
 * @param {string|null} wantedGroup - The --group value.
 * @returns {Object} The slot values.
 */
function slotValues(profile, wantedGroup) {
  const { master, groups } = profile.switch;
  const group = pickGroup(profile, wantedGroup);
  const readme = profile.workflowsReadme;
  const tables = readme ? readme.rowTables : [];
  const setup = profile.setupAction;
  const setupWith = setup ? Object.entries(setup.with).map(([key, value]) => `${key}: '${value.replace(/'/g, "''")}'`) : [];
  return {
    readme: Boolean(readme),
    readmeStep: readme
      ? `Required last step: add one row for this workflow to ${readme.path}${tables.length > 0 ? `, in ${tables.join(' and in ')}` : ''}.`
      : null,
    integrationBranches: profile.integrationBranches.length > 0 ? `[${profile.integrationBranches.map(yamlScalar).join(', ')}]` : null,
    pathTwins: profile.pathTwins.length > 0,
    twinRoots: profile.pathTwins.map((pair) => pair[0]).join(' or '),
    twinPartners: profile.pathTwins.map((pair) => pair[1]).join(' or '),
    defaultBranch: profile.defaultBranch ? yamlScalar(profile.defaultBranch) : null,
    defaultBranchLabel: profile.defaultBranch || 'the default branch',
    switch: Boolean(master || group),
    groups: groups.length > 0,
    groupList: joinWithOr(groups.map((name) => groupLabel(name, master))),
    switchCondition: switchCondition(master, group),
    timeoutFloor: String(profile.timeoutFloorMinutes),
    setupAction: Boolean(setup),
    setupComment: setup ? `Provision the dependency trees through the composite action.${setup.note ? ` ${setup.note}` : ''}` : null,
    setupUses: setup ? setup.uses : null,
    setupWith: setupWith.length > 0 ? setupWith : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function isSet(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function valueOf(values, name) {
  if (!(name in values)) throw new TemplateError(`the template names ${name}, which the renderer does not fill`);
  return values[name];
}

// Greedy wrap: each line takes as many words as fit in the width, counted with its
// indent and comment marker.
function wrapComment(text, indent, width) {
  const prefix = `${indent}# `;
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && prefix.length + next.length > width) {
      lines.push(prefix + line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(prefix + line);
  return lines;
}

function expandBlock(match, values) {
  const [, indent, name, width] = match;
  const value = valueOf(values, name);
  if (Array.isArray(value)) return value.map((line) => indent + line);
  if (!width) throw new TemplateError(`#<<=${name}>> holds text, so it needs a wrap width`);
  return wrapComment(String(value), indent, Number(width));
}

function fillLine(line, values) {
  return line
    .replace(INLINE_SECTION, (whole, kind, name, text) => (isSet(valueOf(values, name)) === (kind === '#') ? text : ''))
    .replace(VALUE_SLOT, (whole, name) => String(valueOf(values, name)));
}

/**
 * Render a template against the slot values.
 *
 * @param {string} template - The template text.
 * @param {Object} values - The slot values.
 * @returns {string} The rendered file.
 */
function render(template, values) {
  const out = [];
  const open = [];
  for (const line of template.split('\n')) {
    if (line.startsWith(NOTE_LINE)) continue;
    const section = line.match(SECTION_LINE);
    if (section) {
      const [, kind, name] = section;
      if (kind === '/') {
        if (open.length === 0 || open[open.length - 1].name !== name) throw new TemplateError(`#<</${name}>> closes no open block`);
        open.pop();
      } else {
        open.push({ name, keep: isSet(valueOf(values, name)) === (kind === '#') });
      }
      continue;
    }
    if (open.some((block) => !block.keep)) continue;
    const block = line.match(BLOCK_LINE);
    if (block) out.push(...expandBlock(block, values));
    else out.push(fillLine(line, values));
  }
  if (open.length > 0) throw new TemplateError(`#<<#${open[open.length - 1].name}>> is never closed`);
  return out.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n${USAGE}\n`);
    return 2;
  }
  let loaded;
  try {
    loaded = loadProfile({ cliPath: options.profile, root: REPO_ROOT });
  } catch (error) {
    if (!(error instanceof ProfileError)) throw error;
    process.stderr.write(`ERROR: ${error.message}\n`);
    return 3;
  }
  if (loaded.errors.length > 0) {
    for (const fault of loaded.errors) process.stderr.write(`ERROR: CI profile ${loaded.display}: ${fault.message}\n`);
    return 3;
  }
  if (options.protectedList) {
    const files = loaded.profile.protected.map((entry) => entry.file);
    process.stdout.write(files.length > 0 ? `${files.join('\n')}\n` : '');
    return 0;
  }
  let values;
  try {
    values = slotValues(loaded.profile, options.group);
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n`);
    return 2;
  }
  const template = fs.readFileSync(path.join(ASSETS, options.job ? TEMPLATES.job : TEMPLATES.workflow), 'utf8');
  try {
    process.stdout.write(render(template, values));
  } catch (error) {
    if (!(error instanceof TemplateError)) throw error;
    process.stderr.write(`ERROR: ${error.message}\n`);
    return 4;
  }
  return 0;
}

module.exports = { render, slotValues };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
