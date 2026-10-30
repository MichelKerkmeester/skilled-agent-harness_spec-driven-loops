#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Convert
// ───────────────────────────────────────────────────────────────────
'use strict';

const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const surface = require('./lib/sk-skill-surface.cjs');
const transforms = require('./lib/sk-skill-convert-transforms.cjs');
const checker = require('./sk-skill-check.cjs');

const SCRIPT_DIR = __dirname;
const USAGE = [
  'Usage: sk-skill-convert.cjs plan <skill-name-or-path>',
  '       sk-skill-convert.cjs apply <skill-name-or-path> [--apply]',
  '',
  'plan is read-only. apply prints the same plan and writes only when --apply is present.',
].join('\n');

class ConvertError extends Error {
  constructor(code, message, exitCode = 1) {
    super(message);
    this.name = 'ConvertError';
    this.code = code;
    this.exitCode = exitCode;
  }
}

function parseArguments(argv) {
  const args = [...argv];
  let command = 'plan';
  if (args[0] === 'plan' || args[0] === 'apply') command = args.shift();
  let target = null;
  let apply = false;
  for (const token of args) {
    if (token === '--apply') {
      if (apply) throw new ConvertError('USAGE', 'Option --apply was specified more than once.', 2);
      apply = true;
    } else if (token.startsWith('-')) {
      throw new ConvertError('USAGE', `Unknown option: ${token}`, 2);
    } else if (target === null) target = token;
    else throw new ConvertError('USAGE', 'Only one skill name or path may be converted.', 2);
  }
  if (!target) throw new ConvertError('USAGE', USAGE, 2);
  if (command !== 'apply' && apply) throw new ConvertError('USAGE', '--apply is valid only with the apply subcommand.', 2);
  return { command, target, apply };
}

function createContext(options = {}) {
  if (options.context) return options.context;
  const repoRoot = path.resolve(options.repoRoot || surface.findRepoRoot(SCRIPT_DIR));
  return surface.createContext({
    repoRoot,
    skillsDir: options.skillsDir,
    cwd: options.cwd || process.cwd(),
    python: options.python,
    paths: options.paths,
    env: options.env,
    fs: options.fs,
    runCommand: options.runCommand,
    moduleResolver: options.moduleResolver,
    skipPreflight: options.skipPreflight,
  });
}

function firstLine(value) {
  return String(value || 'unknown error').split(/\r?\n/, 1)[0];
}

function runCheck(skillRoot, context) {
  let stdout = '';
  let stderr = '';
  const exitCode = checker.runCheck(['check', skillRoot, '--json'], {
    context,
    stdout: { write: (chunk) => { stdout += chunk; } },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });
  if (exitCode > 1) {
    throw new ConvertError('CHECK_UNAVAILABLE', `The existing skill check could not run: ${firstLine(stderr)}`, 2);
  }
  let report;
  try {
    report = JSON.parse(stdout);
  } catch {
    throw new ConvertError('CHECK_OUTPUT_INVALID', 'The existing skill check did not return its JSON report.', 2);
  }
  return report;
}

function refuse(message, code = 'PREFLIGHT_REFUSED', details = null) {
  const error = new ConvertError(code, message, 1);
  if (Array.isArray(details) && details.length) error.details = details;
  throw error;
}

function readText(fileSystem, file) {
  try {
    return String(fileSystem.readFileSync(file, 'utf8'));
  } catch (error) {
    return `(unreadable: ${firstLine(error.message)})`;
  }
}

function backupBaseFor(context, name) {
  return path.join(context.skillsDir, '.state', 'doctor-sk-skill', name);
}

function routerSemantics(parsed) {
  return {
    intentSignals: parsed.intentSignals,
    resourceMap: parsed.resourceMap,
    defaultResource: parsed.defaultResource,
    defaultResourceSemantics: parsed.defaultResourceSemantics,
    parseable: parsed.parseable,
  };
}

function parseRouter(context, skillMdText, skillRoot) {
  let parse;
  try {
    parse = context.routerParser || require(context.paths.routerReplay).parseRouter;
  } catch (error) {
    throw new ConvertError('ROUTER_PARSER_MISSING', `The router parser could not load: ${firstLine(error.message)}`, 2);
  }
  try {
    return parse(skillMdText, skillRoot);
  } catch (error) {
    throw new ConvertError('ROUTER_PARSE_FAILED', `The router parser failed: ${firstLine(error.message)}`, 2);
  }
}

function findNestedSkillFile(skillRoot, fileSystem) {
  const root = path.resolve(skillRoot);
  const pending = [root];
  const visited = new Set();
  while (pending.length) {
    const directory = pending.pop();
    const realDirectory = fileSystem.realpathSync(directory);
    if (visited.has(realDirectory)) continue;
    visited.add(realDirectory);
    for (const entry of fileSystem.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const candidate = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        pending.push(candidate);
        continue;
      }
      if (entry.isSymbolicLink()) {
        let target;
        try {
          target = fileSystem.statSync(candidate);
        } catch (error) {
          if (error.code === 'ENOENT' || error.code === 'ELOOP') continue;
          throw error;
        }
        if (target.isDirectory()) {
          pending.push(candidate);
          continue;
        }
        if (target.isFile() && entry.name === 'SKILL.md' && path.resolve(directory) !== root) return candidate;
        continue;
      }
      if (entry.isFile() && entry.name === 'SKILL.md' && path.resolve(directory) !== root) return candidate;
    }
  }
  return null;
}

function frontmatterPlanSteps(transformed, skillFile) {
  const steps = [];
  if (transformed.versionChanged) {
    const detail = transformed.versionInserted
      ? `Add version: ${transformed.version}.`
      : `Pad version ${transformed.originalVersion} to ${transformed.version}.`;
    steps.push({ kind: 'overwrite', file: skillFile, detail });
  }
  if (transformed.allowedToolsChanged) {
    steps.push({ kind: 'overwrite', file: skillFile, detail: 'Normalize allowed-tools as a YAML sequence.' });
  }
  return steps;
}

function planFollowUps(template, skillMd, routerMd) {
  const followUps = [];
  if (template && routerMd) {
    for (const line of template.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (/\[TODO:[^\]]+\]/.test(trimmed) && routerMd.includes(trimmed)) {
        followUps.push(`ROUTER.md retains template placeholder: ${trimmed}`);
      }
    }
  }
  const paragraphs = skillMd.split(/\r?\n\s*\r?\n/);
  for (const paragraph of paragraphs) {
    const sentence = paragraph.replace(/\r?\n/g, ' ').trim();
    if (/\b(?:router|pseudocode)\b/i.test(sentence)
        && /\b(?:this file|this document|this skill|here|below|above)\b/i.test(sentence)) {
      followUps.push(`Review SKILL.md wording: ${sentence}`);
    }
  }
  return followUps;
}

function buildPlan(target, context) {
  const { fs: fileSystem, skillsDir, paths } = context;
  let skillRoot;
  try {
    skillRoot = surface.resolveSkillTarget(target, context);
  } catch (error) {
    throw new ConvertError(error.code || 'SKILL_NOT_FOUND', error.message, 1);
  }
  const location = surface.classifyLocation(skillRoot, skillsDir, fileSystem);
  // This converter writes in place; staging or copying outside the skills root belongs to another route.
  if (location.kind !== 'direct') refuse('Only a direct child of .skilled/skills can be converted.', 'NOT_DIRECT_CHILD');
  // The private prefix is checked before reading so private skill content never enters the conversion path.
  if (surface.isReservedSkillName(path.basename(skillRoot))) {
    refuse('A local- prefixed skill is filtered by the format and advisor gates.', 'RESERVED_PREFIX');
  }

  const skillFile = path.join(skillRoot, 'SKILL.md');
  const routerFile = path.join(skillRoot, 'ROUTER.md');
  const skill = surface.readSkillFields(skillRoot, fileSystem);
  if (typeof skill.text !== 'string') refuse('SKILL.md could not be read.', 'SKILL_UNREADABLE');
  const name = skill.fields.name || path.basename(skillRoot);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    refuse('The declared skill name is not a lowercase kebab-case name.', 'NAME_NOT_KEBAB');
  }
  if (typeof skill.fields.description !== 'string' || skill.fields.description.length === 0) {
    refuse('SKILL.md must declare a description before conversion.', 'DESCRIPTION_MISSING');
  }

  if (findNestedSkillFile(skillRoot, fileSystem)) {
    refuse('Nested SKILL.md packets make this a hub candidate.', 'NESTED_PACKETS');
  }
  for (const declaration of ['mode-registry.json', 'hub-router.json']) {
    if (fileSystem.existsSync(path.join(skillRoot, declaration))) {
      refuse(`Hub declaration ${declaration} is present; conversion does not modify hubs.`, 'HUB_DECLARATION');
    }
  }

  let resolver;
  try {
    resolver = require(paths.resolver).resolveMachineRouter;
  } catch (error) {
    throw new ConvertError('ROUTER_RESOLVER_MISSING', `The machine-router resolver could not load: ${firstLine(error.message)}`, 2);
  }
  const resolved = resolver({ skillRoot, skillMdText: skill.text });
  if (resolved.verdict === 'dual-declaration') {
    refuse('Resolver verdict dual-declaration: both SKILL.md and ROUTER.md declare a machine router.', 'DUAL_DECLARATION');
  }
  if (resolved.verdict !== 'router-md' && resolved.verdict !== 'skill-md') {
    refuse(`Expected a Skilled skill with a machine router; resolver verdict was ${resolved.verdict}.`, 'NO_MACHINE_ROUTER');
  }

  const collisions = surface.inspectCollisions(name, skillRoot, skillsDir, fileSystem);
  if (collisions.status === 'FINDING') {
    const findings = collisions.findings || [];
    if (findings.includes('reserved name prefix')) {
      refuse('A local- prefixed skill is filtered by the format and advisor gates.', 'RESERVED_PREFIX');
    }
    if (findings.includes('runtime persona prefix')) {
      refuse('An agent- prefixed skill collides with runtime persona mirrors.', 'PERSONA_PREFIX');
    }
    refuse(`Skill name collision: ${findings.join('; ')}.`, 'NAME_COLLISION');
  }

  if (resolved.verdict === 'router-md') {
    const descriptionLength = skill.fields.description.length;
    if (descriptionLength > 130) {
      refuse(`The description is ${descriptionLength} characters; the 130-character limit needs a separately approved trim.`, 'DESCRIPTION_TOO_LONG');
    }
    let transformedFrontmatter;
    try {
      transformedFrontmatter = transforms.normalizeSkillFrontmatter(skill.text);
    } catch (error) {
      throw new ConvertError(error.code || 'TRANSFORM_FAILED', error.message, 1);
    }
    const steps = frontmatterPlanSteps(transformedFrontmatter, skillFile);
    const skillChanged = transformedFrontmatter.text !== skill.text;
    return {
      skillRoot,
      skillFile,
      routerFile,
      name,
      backupBase: backupBaseFor(context, name),
      noop: !skillChanged,
      frontmatterOnly: true,
      originalSkill: skill.text,
      nextSkill: transformedFrontmatter.text,
      steps,
      followUps: planFollowUps(null, transformedFrontmatter.text, null),
      message: skillChanged
        ? `Normalized frontmatter for ${name}; ROUTER.md is already in place.`
        : 'SKILL.md frontmatter is already normalized; no conversion is needed.',
    };
  }

  if (fileSystem.existsSync(routerFile)) {
    // Two declarations that disagree is a fault to report, and the report is only useful
    // when the operator can compare both sides without opening the files by hand.
    refuse(
      'ROUTER.md already exists but declares no machine router while SKILL.md does; it will not be replaced.',
      'ROUTER_EXISTS',
      [
        `ROUTER.md (${routerFile}):`,
        readText(fileSystem, routerFile),
        `SKILL.md machine router section (${skillFile}):`,
        String(resolved.text),
      ],
    );
  }

  const report = runCheck(skillRoot, context);
  if (report.inputKind === 'hub' || report.inputKind === 'hub-packet') {
    refuse(`The existing check classified this input as ${report.inputKind}; hub conversion is out of scope.`, 'HUB_DECLARATION');
  }
  if (report.inputKind !== 'older-skilled') {
    refuse(`The existing check classified this input as ${report.inputKind || 'unknown'}; only older Skilled skills are in scope.`, 'INPUT_KIND_UNSUPPORTED');
  }
  const descriptionRow = Array.isArray(report.rows) ? report.rows.find((row) => row.row === 'C11') : null;
  const descriptionLength = Number.isInteger(descriptionRow && descriptionRow.length)
    ? descriptionRow.length
    : skill.fields.description.length;
  if (descriptionLength > 130) {
    // Descriptions drive native routing, so trimming requires a separate approved change.
    refuse(`The description is ${descriptionLength} characters; the 130-character limit needs a separately approved trim.`, 'DESCRIPTION_TOO_LONG');
  }

  let transformedFrontmatter;
  try {
    transformedFrontmatter = transforms.normalizeSkillFrontmatter(skill.text);
  } catch (error) {
    throw new ConvertError(error.code || 'TRANSFORM_FAILED', error.message, 1);
  }
  let template;
  try {
    template = fileSystem.readFileSync(path.join(
      context.repoRoot,
      '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'assets', 'skill', 'skill-router-template.md',
    ), 'utf8');
  } catch (error) {
    throw new ConvertError('ROUTER_TEMPLATE_MISSING', `The router template could not be read: ${firstLine(error.message)}`, 2);
  }
  let moved;
  try {
    moved = transforms.moveLegacyRouter(transformedFrontmatter.text, template, name, resolved.text);
  } catch (error) {
    throw new ConvertError(error.code || 'TRANSFORM_FAILED', error.message, 1);
  }
  const skillChanged = moved.skillMd !== skill.text;
  const steps = frontmatterPlanSteps(transformedFrontmatter, skillFile);
  if (skillChanged) {
    steps.push({ kind: 'overwrite', file: skillFile, detail: 'Remove inline machine router and link to ROUTER.md.' });
  }
  steps.push({ kind: 'create', file: routerFile, detail: 'Create sibling ROUTER.md from the router template.' });
  return {
    skillRoot,
    skillFile,
    routerFile,
    name,
    backupBase: backupBaseFor(context, name),
    noop: false,
    frontmatterOnly: false,
    originalSkill: skill.text,
    nextSkill: moved.skillMd,
    nextRouter: moved.routerMd,
    steps,
    followUps: planFollowUps(template, moved.skillMd, moved.routerMd),
  };
}
function makeBackupDirectory(context, name) {
  const base = backupBaseFor(context, name);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  context.fs.mkdirSync(base, { recursive: true });
  let suffix = 0;
  while (true) {
    const directory = path.join(base, suffix ? `${timestamp}-${suffix}` : timestamp);
    try {
      context.fs.mkdirSync(directory);
      return directory;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      suffix += 1;
    }
  }
}

function ensureInside(parent, candidate) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new ConvertError('SNAPSHOT_PATH_INVALID', 'The router proof snapshot path is outside its backup directory.', 2);
  }
}

function snapshotRouterInputs(skillRoot, snapshotDirectory, fileSystem) {
  fileSystem.mkdirSync(snapshotDirectory, { recursive: true });
  for (const name of ['SKILL.md', 'ROUTER.md']) {
    const source = path.join(skillRoot, name);
    if (!fileSystem.existsSync(source)) continue;
    fileSystem.copyFileSync(source, path.join(snapshotDirectory, name), fileSystem.constants.COPYFILE_EXCL);
  }
}

function removeUnwrittenBackup(fileSystem, backupDirectory, backupBase, backupBaseExisted) {
  fileSystem.rmSync(backupDirectory, { recursive: true, force: true });
  if (backupBaseExisted) return;
  try {
    if (fileSystem.readdirSync(backupBase).length === 0) fileSystem.rmdirSync(backupBase);
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTEMPTY') throw error;
  }
}

function applyPlan(plan, context) {
  if (plan.noop) return { changed: false, message: plan.message };
  const fileSystem = context.fs;
  const currentSkill = fileSystem.readFileSync(plan.skillFile, 'utf8');
  if (currentSkill !== plan.originalSkill) {
    throw new ConvertError('STALE_PLAN', 'SKILL.md changed after planning; no files were written.', 1);
  }
  if (!plan.frontmatterOnly && fileSystem.existsSync(plan.routerFile)) {
    throw new ConvertError('ROUTER_EXISTS', 'ROUTER.md appeared after planning; refusing to replace it.', 1);
  }

  const backupBase = plan.backupBase;
  const backupBaseExisted = fileSystem.existsSync(backupBase);
  const backupDirectory = makeBackupDirectory(context, plan.name);
  const backupFile = path.join(backupDirectory, 'SKILL.md');
  const snapshotDirectory = path.join(backupDirectory, 'before');
  let writesStarted = false;
  let createdRouter = false;
  try {
    fileSystem.copyFileSync(plan.skillFile, backupFile, fileSystem.constants.COPYFILE_EXCL);
    ensureInside(backupDirectory, snapshotDirectory);
    snapshotRouterInputs(plan.skillRoot, snapshotDirectory, fileSystem);

    const snapshotSkill = fileSystem.readFileSync(path.join(snapshotDirectory, 'SKILL.md'), 'utf8');
    const before = parseRouter(context, null, snapshotDirectory);
    const beforeSemantics = routerSemantics(before);
    const beforeContent = plan.frontmatterOnly
      ? parseRouter(context, snapshotSkill, snapshotDirectory)
      : parseRouter(context, snapshotSkill, null);
    const afterContent = plan.frontmatterOnly
      ? parseRouter(context, plan.nextSkill, snapshotDirectory)
      : parseRouter(context, plan.nextRouter, null);
    if (!isDeepStrictEqual(beforeContent, afterContent)) {
      throw new ConvertError('ROUTER_CONTENT_CHANGED', 'parseRouter content output changed; no target files were written.', 1);
    }

    if (plan.frontmatterOnly) {
      writesStarted = true;
      fileSystem.writeFileSync(plan.skillFile, plan.nextSkill, 'utf8');
    } else {
      const descriptor = fileSystem.openSync(plan.routerFile, 'wx');
      createdRouter = true;
      writesStarted = true;
      try {
        fileSystem.writeFileSync(descriptor, plan.nextRouter, 'utf8');
      } finally {
        fileSystem.closeSync(descriptor);
      }
      fileSystem.writeFileSync(plan.skillFile, plan.nextSkill, 'utf8');
    }

    const after = parseRouter(context, null, plan.skillRoot);
    if (!isDeepStrictEqual(beforeSemantics, routerSemantics(after))) {
      throw new ConvertError('ROUTER_SEMANTICS_CHANGED', 'parseRouter semantics changed after the move; restoring the original skill files.', 1);
    }
    return {
      changed: true,
      backupDirectory,
      backedUpFiles: [backupFile],
      createdFiles: plan.frontmatterOnly ? [] : [plan.routerFile],
      message: plan.frontmatterOnly
        ? `Normalized ${plan.name}; router semantics match the snapshot.`
        : `Converted ${plan.name}; router semantics match the snapshot.`,
      provenance: `${before.routerSource || 'unknown'} -> ${after.routerSource || 'unknown'}`,
    };
  } catch (error) {
    try {
      if (writesStarted) {
        fileSystem.writeFileSync(plan.skillFile, fileSystem.readFileSync(backupFile));
        if (createdRouter && fileSystem.existsSync(plan.routerFile)) fileSystem.unlinkSync(plan.routerFile);
      } else {
        removeUnwrittenBackup(fileSystem, backupDirectory, backupBase, backupBaseExisted);
      }
    } catch (rollbackError) {
      throw new ConvertError('ROLLBACK_FAILED', `Conversion rollback failed: ${firstLine(rollbackError.message)}. Backup retained at ${backupDirectory}.`, 1);
    }
    if (error instanceof ConvertError) throw error;
    throw new ConvertError('APPLY_FAILED', `Conversion rolled back: ${firstLine(error.message)}`, 1);
  }
}
function renderPlan(plan) {
  const lines = [`Conversion plan: ${plan.name}`];
  if (plan.noop) {
    lines.push(plan.message, 'Writes: none');
  } else {
    for (const [index, step] of plan.steps.entries()) {
      lines.push(`${index + 1}. ${step.detail} ${step.kind === 'overwrite' ? 'Overwrite' : 'Create'}: ${step.file}`);
    }
    lines.push(`Backup existing files under: ${path.join(plan.backupBase, '<timestamp>')}`);
  }
  if (plan.followUps && plan.followUps.length) {
    lines.push('Follow-up items:');
    for (const followUp of plan.followUps) lines.push(`- ${followUp}`);
  }
  return `${lines.join('\n')}\n`;
}

function quoteArgument(value) {
  return JSON.stringify(String(value));
}

// A write is only finished when the operator can undo it without remembering which files
// the run touched, so each backup and each created file gets its own command beside the
// check that proves the result.
function renderUndo(result, plan) {
  const lines = ['Undo:'];
  for (const backup of result.backedUpFiles || []) {
    lines.push(`  cp ${quoteArgument(backup)} ${quoteArgument(path.join(plan.skillRoot, path.basename(backup)))}`);
  }
  for (const created of result.createdFiles || []) {
    lines.push(`  rm ${quoteArgument(created)}`);
  }
  const checkScript = path.join(SCRIPT_DIR, 'sk-skill-check.cjs');
  lines.push(`Check: node ${quoteArgument(checkScript)} check ${quoteArgument(plan.skillRoot)}`);
  return `${lines.join('\n')}\n`;
}

function runConvert(argv = process.argv.slice(2), options = {}) {
  const context = createContext(options);
  const stdout = options.stdout || context.stdout || process.stdout;
  const stderr = options.stderr || context.stderr || process.stderr;
  try {
    const { command, target, apply } = parseArguments(argv);
    const plan = buildPlan(target, context);
    stdout.write(renderPlan(plan));
    if (plan.noop) return 0;
    if (command !== 'apply' || !apply) {
      if (command === 'apply') stdout.write('Apply gate: no writes without --apply.\n');
      return 0;
    }
    const result = applyPlan(plan, context);
    stdout.write(`${result.message}\n`);
    if (result.backupDirectory) stdout.write(`Backup: ${result.backupDirectory}\n`);
    if (result.provenance) stdout.write(`Router source: ${result.provenance}\n`);
    // The undo block closes the run, so its check command is the last thing the operator reads.
    if (result.backupDirectory) stdout.write(renderUndo(result, plan));
    return 0;
  } catch (error) {
    const code = error instanceof ConvertError ? error.code : 'CONVERT_ERROR';
    const exitCode = error instanceof ConvertError ? error.exitCode : 2;
    if (code === 'USAGE') {
      const detail = error.message === USAGE ? 'Invalid invocation.' : firstLine(error.message);
      stderr.write(`USAGE: ${detail}\n${USAGE}\n`);
    } else {
      stderr.write(`${code}: ${firstLine(error.message)}\n`);
      // A refusal that compares two documents prints both whole: half a declaration is
      // not the side the operator needs to read.
      for (const detail of error.details || []) stderr.write(`${String(detail).replace(/\s+$/, '')}\n`);
    }
    return exitCode;
  }
}

function main(argv = process.argv.slice(2)) {
  return runConvert(argv);
}

module.exports = {
  applyPlan,
  buildPlan,
  main,
  parseArguments,
  renderPlan,
  runConvert,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));
