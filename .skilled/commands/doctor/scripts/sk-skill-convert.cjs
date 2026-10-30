#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Convert
// ───────────────────────────────────────────────────────────────────
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { isDeepStrictEqual } = require('node:util');

const surface = require('./lib/sk-skill-surface.cjs');
const transforms = require('./lib/sk-skill-convert-transforms.cjs');
const checker = require('./sk-skill-check.cjs');
const integrate = require('./lib/sk-skill-integrate.cjs');

const SCRIPT_DIR = __dirname;
const USAGE = [
  'Usage: sk-skill-convert.cjs plan <skill-name-or-path>',
  '       sk-skill-convert.cjs apply <skill-name-or-path> [--approved-phrase <text>] [--allowed-tool <tool>] [--allowed-tools <comma list>] [--description-trim <text>] [--agent-output <path>] [--apply]',
  '       sk-skill-convert.cjs preserve --snapshot <dir> [<skill-dir>]',
  '',
  'plan is read-only. apply prints the plan and writes only when --apply is present.',
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
  if (['plan', 'apply', 'preserve'].includes(args[0])) command = args.shift();
  let target = null;
  let apply = false;
  let snapshot = null;
  let agentOutput = null;
  let descriptionTrim = null;
  const approvedPhrases = [];
  const allowedTools = [];
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--apply') {
      if (apply) throw new ConvertError('USAGE', 'Option --apply was specified more than once.', 2);
      apply = true;
    } else if (['--snapshot', '--agent-output', '--description-trim', '--approved-phrase', '--allowed-tool', '--allowed-tools'].includes(token)) {
      const value = args[index + 1];
      if (typeof value !== 'string' || value.startsWith('--')) {
        throw new ConvertError('USAGE', `${token} requires a value.`, 2);
      }
      index += 1;
      if (token === '--snapshot') {
        if (snapshot !== null) throw new ConvertError('USAGE', 'Option --snapshot was specified more than once.', 2);
        snapshot = value;
      } else if (token === '--agent-output') {
        if (agentOutput !== null) throw new ConvertError('USAGE', 'Option --agent-output was specified more than once.', 2);
        agentOutput = value;
      } else if (token === '--description-trim') {
        if (descriptionTrim !== null) throw new ConvertError('USAGE', 'Option --description-trim was specified more than once.', 2);
        descriptionTrim = value;
      } else if (token === '--approved-phrase') approvedPhrases.push(value);
      // The comma list is the same approval the repeated flag carries, so both
      // spell one list and a run may use either without reordering its tools.
      else allowedTools.push(...value.split(','));
    } else if (token.startsWith('-')) {
      throw new ConvertError('USAGE', `Unknown option: ${token}`, 2);
    } else if (target === null) target = token;
    else throw new ConvertError('USAGE', 'Only one skill name or path may be converted.', 2);
  }
  if (command === 'preserve') {
    if (!snapshot) throw new ConvertError('USAGE', 'preserve requires --snapshot <dir>.', 2);
    if (apply || agentOutput || descriptionTrim || approvedPhrases.length || allowedTools.length) {
      throw new ConvertError('USAGE', 'preserve accepts only --snapshot and an optional skill directory.', 2);
    }
  } else {
    if (!target) throw new ConvertError('USAGE', USAGE, 2);
    if (command !== 'apply' && apply) throw new ConvertError('USAGE', '--apply is valid only with the apply subcommand.', 2);
    if (snapshot) throw new ConvertError('USAGE', '--snapshot is valid only with the preserve subcommand.', 2);
  }
  return { command, target, apply, snapshot, agentOutput, descriptionTrim, approvedPhrases, allowedTools };
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

// Each approved field gets its own printed line: the operator approves a value,
// not a diff they have to reconstruct from the file the workflow rewrites.
function frontmatterPlanSteps(transformed, skillFile, approvals = {}) {
  const steps = [];
  if (transformed.versionChanged) {
    const detail = transformed.versionInserted
      ? `Add version: ${transformed.version}.`
      : `Pad version ${transformed.originalVersion} to ${transformed.version}.`;
    steps.push({ kind: 'overwrite', file: skillFile, detail });
  }
  if (approvals.descriptionTrim) {
    steps.push({
      kind: 'overwrite',
      file: skillFile,
      detail: `Set description: ${JSON.stringify(approvals.descriptionTrim)} (the approved trim, within the 130-character limit).`,
    });
  }
  if (Array.isArray(approvals.allowedTools) && approvals.allowedTools.length) {
    steps.push({
      kind: 'overwrite',
      file: skillFile,
      detail: `Set allowed-tools: ${JSON.stringify(approvals.allowedTools)} (the approved list).`,
    });
  } else if (transformed.allowedToolsChanged) {
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

function uniqueValues(values) {
  const result = [];
  const seen = new Set();
  for (const candidate of values || []) {
    if (typeof candidate !== 'string') continue;
    const value = candidate.trim();
    const key = value.toLocaleLowerCase();
    if (!value || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function sourceDescriptionTrim(description, maxLength = 130) {
  const points = Array.from(description);
  if (points.length <= maxLength) return null;
  const clipped = points.slice(0, maxLength - 1).join('');
  const lastSpace = clipped.lastIndexOf(' ');
  const stem = lastSpace > Math.floor(maxLength * 0.55) ? clipped.slice(0, lastSpace) : clipped;
  return `${stem.trimEnd()}…`;
}

function collectResourceMarkdown(root, fileSystem, relativeDirectory = '') {
  const base = path.join(root, ...relativeDirectory.split('/').filter(Boolean));
  let entries;
  try {
    entries = fileSystem.readdirSync(base, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const found = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relative = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) found.push(...collectResourceMarkdown(root, fileSystem, relative));
    else if (entry.isFile() && entry.name.endsWith('.md')) found.push(relative);
  }
  return found;
}

function getAgentSkillText(agentOutput, context) {
  if (!agentOutput) return null;
  const candidate = path.resolve(context.cwd, agentOutput);
  let skillFile = candidate;
  try {
    if (context.fs.statSync(candidate).isDirectory()) skillFile = path.join(candidate, 'SKILL.md');
    return context.fs.readFileSync(skillFile, 'utf8');
  } catch (error) {
    refuse(`The workflow agent output could not be read: ${firstLine(error.message)}`, 'AGENT_OUTPUT_MISSING');
  }
}

function reshapeBody(originalSkill, agentSkill) {
  const original = originalSkill.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  const reshaped = agentSkill.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!original || !reshaped) refuse('Both source and workflow agent output need closed frontmatter.', 'FRONTMATTER_INVALID');
  return `${original[0]}${agentSkill.slice(reshaped[0].length)}`;
}

function buildPlainPlan(skillRoot, skill, context, decisions) {
  const { fs: fileSystem, skillsDir, paths } = context;
  const name = skill.fields.name;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name || '')) {
    refuse('The declared skill name is not a lowercase kebab-case name.', 'NAME_NOT_KEBAB');
  }
  if (surface.isReservedSkillName(name)) {
    refuse('A local- prefixed skill is filtered by the format and advisor gates.', 'RESERVED_PREFIX');
  }
  if (typeof skill.fields.description !== 'string' || skill.fields.description.length === 0) {
    refuse('SKILL.md must declare a description before conversion.');
  }
  // A copied tree reproduces a symlink as a link, so a later write lands in the
  // file outside the source. The tree is checked before anything is staged.
  refuseSymlink(skillRoot, fileSystem);
  if (findNestedSkillFile(skillRoot, fileSystem)) {
    refuse('Nested SKILL.md packets make this a hub candidate.', 'NESTED_PACKETS');
  }
  for (const declaration of ['mode-registry.json', 'hub-router.json']) {
    if (fileSystem.existsSync(path.join(skillRoot, declaration))) {
      refuse(`Hub declaration ${declaration} is present; conversion does not modify hubs.`, 'HUB_DECLARATION');
    }
  }
  const report = runCheck(skillRoot, { ...context, python: pythonExecutable(context) });
  if (report.inputKind !== 'plain') {
    refuse(`The existing check classified this outside-root input as ${report.inputKind || 'unknown'}; only plain skills are in scope.`, 'NOT_PLAIN_SKILL');
  }

  const targetRoot = path.join(skillsDir, name);
  if (fileSystem.existsSync(targetRoot)) {
    refuse(`The target skill folder already exists: ${targetRoot}`, 'TARGET_EXISTS');
  }
  const collisions = inspectSkillNameCollisions(name, skillRoot, skillsDir, fileSystem);
  if (collisions.status === 'FINDING') {
    const findings = collisions.findings || [];
    if (findings.includes('reserved name prefix')) refuse('A local- prefixed skill is filtered by the format and advisor gates.', 'RESERVED_PREFIX');
    if (findings.includes('runtime persona prefix')) refuse('An agent- prefixed skill collides with runtime persona mirrors.', 'PERSONA_PREFIX');
    refuse(`Skill name collision: ${findings.join('; ')}.`, 'NAME_COLLISION');
  }

  const phrases = uniqueValues(decisions.approvedPhrases);
  const suggestedPhrases = transforms.proposeIntentPhrases(skill.text);
  if (phrases.length < 8) {
    refuse(`Only ${phrases.length} approved intent phrase(s) were supplied; at least 8 are required. Suggested phrases: ${JSON.stringify(suggestedPhrases)}. Pass repeated --approved-phrase values.`, 'INTENT_SIGNALS_BELOW_FLOOR');
  }
  const tools = uniqueValues(decisions.allowedTools);
  const proposedTools = ['Read', 'Grep', 'Glob'];
  if (fileSystem.existsSync(path.join(skillRoot, 'scripts'))) proposedTools.push('Bash');
  const descriptionTrim = decisions.descriptionTrim === null
    ? null
    : String(decisions.descriptionTrim).trim();
  if (descriptionTrim !== null) {
    if (!descriptionTrim) {
      refuse('An approved description trim must be a non-empty string.', 'DESCRIPTION_TRIM_INVALID');
    }
    const trimLength = Array.from(descriptionTrim).length;
    if (trimLength > 130) {
      refuse(`The approved description trim is ${trimLength} characters; the limit is 130.`, 'DESCRIPTION_TOO_LONG');
    }
  }
  const proposedTrim = sourceDescriptionTrim(skill.fields.description);
  const agentSkill = getAgentSkillText(decisions.agentOutput, context);
  const nextBodySource = agentSkill ? reshapeBody(skill.text, agentSkill) : skill.text;
  let template;
  try {
    template = fileSystem.readFileSync(path.resolve(
      skillCreatorDirectory(context), '..', 'assets', 'skill', 'skill-router-template.md',
    ), 'utf8');
  } catch (error) {
    throw new ConvertError('ROUTER_TEMPLATE_MISSING', `The router template could not be read: ${firstLine(error.message)}`, 2);
  }

  const resourceDocs = collectResourceMarkdown(skillRoot, fileSystem)
    .filter((relative) => /^(?:references|assets)\//.test(relative));
  const renames = transforms.resourceRenameMap(resourceDocs);
  for (const [oldPath, newPath] of renames) {
    const collision = path.join(skillRoot, ...newPath.split('/'));
    if (fileSystem.existsSync(collision) && oldPath !== newPath) {
      refuse(`Resource rename ${oldPath} -> ${newPath} would replace an existing file.`, 'RESOURCE_RENAME_COLLISION');
    }
  }
  const sourceLinks = transforms.harvestReferenceLinks(nextBodySource);
  const mapResources = uniqueValues(sourceLinks.map((relative) => renames.get(relative) || relative));
  for (const relative of sourceLinks) {
    if (fileSystem.existsSync(path.join(skillRoot, ...relative.split('/')))) continue;
    // The workflow agent may already name the planned kebab path. That is the
    // same document once the rename lands, so it is resolved through the map
    // before the link is called missing.
    const sourceName = [...renames].find(([, nextPath]) => nextPath === relative);
    if (sourceName && fileSystem.existsSync(path.join(skillRoot, ...sourceName[0].split('/')))) continue;
    refuse(`SKILL.md links to a missing reference document: ${relative}`, 'RESOURCE_LINK_MISSING');
  }

  const targetSkillFile = path.join(targetRoot, 'SKILL.md');
  const targetRouterFile = path.join(targetRoot, 'ROUTER.md');
  const steps = [
    { kind: 'copy', file: skillRoot, destination: targetRoot, detail: `Copy the source under frontmatter name ${name}; source remains unchanged.` },
    { kind: 'create', file: targetRouterFile, detail: `Render ROUTER.md with PRIMARY keywords ${JSON.stringify(phrases)} and RESOURCE_MAP ${JSON.stringify(mapResources)} in body order.` },
    { kind: 'agent', file: targetSkillFile, detail: decisions.agentOutput ? `Use workflow agent prose from ${path.resolve(context.cwd, decisions.agentOutput)}.` : 'Workflow agent must reshape SKILL.md, then provide --agent-output before apply.' },
    { kind: 'preserve', file: targetSkillFile, detail: 'Snapshot the source body and require every non-heading line to survive in SKILL.md, ROUTER.md, or references/.' },
  ];
  for (const relative of resourceDocs) {
    const nextPath = renames.get(relative) || relative;
    steps.push({
      kind: nextPath === relative ? 'overwrite' : 'rename',
      file: path.join(targetRoot, ...relative.split('/')),
      destination: path.join(targetRoot, ...nextPath.split('/')),
      detail: nextPath === relative
        ? `Add resource frontmatter and rewrite links in ${relative}.`
        : `Rename ${relative} to ${nextPath}, add resource frontmatter, and rewrite links.`,
    });
  }
  steps.push(
    { kind: 'scaffold', file: path.join(targetRoot, 'graph-metadata.json'), detail: 'Run init_skill.py into os.tmpdir() and copy only absent metadata and scaffold files; write the approved phrases.' },
    { kind: 'command', file: paths.rootMetadata, detail: `Run ci-skill-root-metadata.cjs --fix --skills-dir ${skillsDir} --skill ${name}.` },
    { kind: 'command', file: paths.regenerateDerived, detail: `Run regenerate-skill-derived.cjs --root ${targetRoot} --write.` },
    { kind: 'gate', file: paths.packageSkill, detail: `Run package_skill.py ${targetRoot} --check --strict, then validate_skill_package.py ${targetRoot}.` },
  );
  const defaultResource = mapResources[0] || 'manual-testing-playbook/manual-testing-playbook.md';
  const nextRouter = transforms.renderPlainRouter(
    template,
    name,
    transforms.skillTitle(skill.text, name),
    phrases,
    mapResources,
    defaultResource,
  );
  const versionMatch = /^version\s*:\s*["']?(\d+(?:\.\d+){0,3})["']?\s*$/m.exec(skill.text);
  const version = versionMatch ? versionMatch[1] : '1.0.0.0';
  // The integration rows are what a format-valid skill still needs before it can
  // be reached, so they are planned beside the conversion and run only after the
  // format gates pass.
  const integrationPlan = planIntegrationRows(context, {
    skillRoot: targetRoot,
    name,
    version,
    description: descriptionTrim || skill.fields.description,
    phrases,
  });
  return {
    kind: 'plain',
    skillRoot,
    sourceRoot: skillRoot,
    targetRoot,
    skillFile: targetSkillFile,
    routerFile: targetRouterFile,
    name,
    originalSkill: skill.text,
    originalSourceHash: null,
    reshapedSource: nextBodySource,
    agentOutput: decisions.agentOutput ? path.resolve(context.cwd, decisions.agentOutput) : null,
    description: skill.fields.description,
    descriptionTrim,
    proposedTrim,
    approvedPhrases: phrases,
    suggestedPhrases,
    proposedTools,
    allowedTools: tools,
    resourceDocs,
    renames: [...renames.entries()],
    mapResources,
    nextRouter,
    version,
    integrationPlan: integrationPlan.lines,
    integrationWrites: integrationPlan.writes,
    steps,
    backupBase: path.join(skillsDir, '.state', 'doctor-sk-skill', name),
    followUps: proposedTrim && !descriptionTrim
      ? [`Description trim needs approval before the format gate: ${JSON.stringify(proposedTrim)}; approve with --description-trim.`]
      : [],
  };
}

function inspectSkillNameCollisions(name, skillRoot, skillsDir, fileSystem) {
  const collisionFileSystem = Object.create(fileSystem);
  collisionFileSystem.readdirSync = (directory, options) => {
    const entries = fileSystem.readdirSync(directory, options);
    // Converter backups are state records, not candidate skill roots.
    if (path.resolve(directory) !== path.resolve(skillsDir)) return entries;
    return entries.filter((entry) => entry.name !== '.state');
  };
  return surface.inspectCollisions(name, skillRoot, skillsDir, collisionFileSystem);
}

function buildPlan(target, context, decisions = {}) {
  const { fs: fileSystem, skillsDir, paths } = context;
  let skillRoot;
  try {
    skillRoot = surface.resolveSkillTarget(target, context);
  } catch (error) {
    throw new ConvertError(error.code || 'SKILL_NOT_FOUND', error.message, 1);
  }
  const location = surface.classifyLocation(skillRoot, skillsDir, fileSystem);
  if (location.kind === 'outside') {
    const plainSkill = surface.readSkillFields(skillRoot, fileSystem);
    if (typeof plainSkill.text !== 'string') refuse('SKILL.md could not be read.');
    return buildPlainPlan(skillRoot, plainSkill, context, decisions);
  }
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

  const approvedTools = uniqueValues(decisions.allowedTools);
  const descriptionTrim = decisions.descriptionTrim === null
    ? null
    : String(decisions.descriptionTrim).trim();
  if (descriptionTrim !== null) {
    if (!descriptionTrim) refuse('An approved description trim must be a non-empty string.', 'DESCRIPTION_TRIM_INVALID');
    const trimLength = Array.from(descriptionTrim).length;
    if (trimLength > 130) {
      refuse(`The approved description trim is ${trimLength} characters; the limit is 130.`, 'DESCRIPTION_TOO_LONG');
    }
  }
  const approvals = { allowedTools: approvedTools, descriptionTrim };
  // A field the operator approved is a field write this run owns, so it is
  // applied before the router move and lands in the same backup.
  const approvedText = transforms.applyFrontmatterApprovals(skill.text, approvals);

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
    if (descriptionLength > 130 && descriptionTrim === null) {
      refuse(`The description is ${descriptionLength} characters; the 130-character limit needs a separately approved trim.`, 'DESCRIPTION_TOO_LONG');
    }
    let transformedFrontmatter;
    try {
      transformedFrontmatter = transforms.normalizeSkillFrontmatter(approvedText);
    } catch (error) {
      throw new ConvertError(error.code || 'TRANSFORM_FAILED', error.message, 1);
    }
    const steps = frontmatterPlanSteps(transformedFrontmatter, skillFile, approvals);
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
  if (descriptionLength > 130 && descriptionTrim === null) {
    // Descriptions drive native routing, so trimming requires a separate approved change.
    refuse(`The description is ${descriptionLength} characters; the 130-character limit needs a separately approved trim.`, 'DESCRIPTION_TOO_LONG');
  }

  let transformedFrontmatter;
  try {
    transformedFrontmatter = transforms.normalizeSkillFrontmatter(approvedText);
  } catch (error) {
    throw new ConvertError(error.code || 'TRANSFORM_FAILED', error.message, 1);
  }
  let template;
  try {
    template = fileSystem.readFileSync(path.resolve(
      skillCreatorDirectory(context), '..', 'assets', 'skill', 'skill-router-template.md',
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
  const steps = frontmatterPlanSteps(transformedFrontmatter, skillFile, approvals);
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

function listMarkdownFiles(root, fileSystem, relativeDirectory = '') {
  const directory = path.join(root, ...relativeDirectory.split('/').filter(Boolean));
  let entries;
  try {
    entries = fileSystem.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relative = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...listMarkdownFiles(root, fileSystem, relative));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(relative);
  }
  return files;
}

function preservationKey(entry) {
  return `${entry.kind}\u0000${entry.line}`;
}

function countPreservedLines(pool, text, renames) {
  for (const entry of transforms.preservationLines(text, renames)) {
    const key = preservationKey(entry);
    pool.set(key, (pool.get(key) || 0) + 1);
  }
}

function subtractPreservedLines(pool, text, renames) {
  for (const entry of transforms.preservationLines(text, renames)) {
    const key = preservationKey(entry);
    const count = pool.get(key) || 0;
    if (count <= 1) pool.delete(key);
    else pool.set(key, count - 1);
  }
}

function takePreservedLine(pool, key) {
  const count = pool.get(key) || 0;
  if (count === 0) return false;
  if (count === 1) pool.delete(key);
  else pool.set(key, count - 1);
  return true;
}

// A line survives when a line of the same kind carries it. The source's own
// reference documents are subtracted first: a reference copied into the staged
// tree already held its lines, so it is not a second home for a line the agent
// dropped out of SKILL.md.
function verifyPreservation(snapshotDirectory, skillRoot, fileSystem, renames = new Map()) {
  const originalFile = path.join(snapshotDirectory, 'SKILL.md');
  if (!fileSystem.existsSync(originalFile)) {
    throw new ConvertError('SNAPSHOT_INVALID', `The snapshot has no SKILL.md: ${snapshotDirectory}`, 1);
  }
  const originalLines = transforms.preservationLines(fileSystem.readFileSync(originalFile, 'utf8'), renames);
  const prosePool = new Map();
  const referencePool = new Map();
  for (const candidate of [path.join(skillRoot, 'SKILL.md'), path.join(skillRoot, 'ROUTER.md')]) {
    if (!fileSystem.existsSync(candidate)) continue;
    countPreservedLines(prosePool, fileSystem.readFileSync(candidate, 'utf8'), renames);
  }
  const stagedReferences = path.join(skillRoot, 'references');
  for (const relative of listMarkdownFiles(stagedReferences, fileSystem)) {
    countPreservedLines(referencePool, fileSystem.readFileSync(path.join(stagedReferences, relative), 'utf8'), renames);
  }
  const snapshotReferences = path.join(snapshotDirectory, 'references');
  for (const relative of listMarkdownFiles(snapshotReferences, fileSystem)) {
    subtractPreservedLines(referencePool, fileSystem.readFileSync(path.join(snapshotReferences, relative), 'utf8'), renames);
  }
  const missing = [];
  for (const entry of originalLines) {
    const key = preservationKey(entry);
    if (takePreservedLine(prosePool, key)) continue;
    if (takePreservedLine(referencePool, key)) continue;
    missing.push(entry.line);
  }
  return { ok: missing.length === 0, missing, originalLineCount: originalLines.length };
}

// A rename is only finished when the old name is gone from the staged tree. The
// forms the rewriter knows cover links, definitions, attributes and code spans;
// a bare path in prose is text the operator still reads, so it still names a
// dead file and the run stops rather than shipping it.
function stagedTextFiles(root, fileSystem, relativeDirectory = '') {
  const directory = path.join(root, ...relativeDirectory.split('/').filter(Boolean));
  let entries;
  try {
    entries = fileSystem.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relative = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...stagedTextFiles(root, fileSystem, relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

function assertNoStaleRenameKeys(plan, fileSystem) {
  const keys = plan.renames.map(([oldPath]) => oldPath);
  if (keys.length === 0) return;
  for (const relative of stagedTextFiles(plan.targetRoot, fileSystem)) {
    const text = fileSystem.readFileSync(path.join(plan.targetRoot, ...relative.split('/')), 'utf8');
    for (const key of keys) {
      const encoded = key.split('/').map(encodeURIComponent).join('/');
      if (text.includes(key) || (encoded !== key && text.includes(encoded))) {
        throw new ConvertError(
          'RESOURCE_LINK_STALE',
          `The staged ${relative} still names ${key} after the resource rename.`,
          1,
        );
      }
    }
  }
}

function writeExclusive(fileSystem, filePath, content) {
  fileSystem.mkdirSync(path.dirname(filePath), { recursive: true });
  const descriptor = fileSystem.openSync(filePath, 'wx');
  try {
    fileSystem.writeFileSync(descriptor, content, 'utf8');
  } finally {
    fileSystem.closeSync(descriptor);
  }
}

function copyAbsentTree(source, destination, fileSystem) {
  const entries = fileSystem.readdirSync(source, { withFileTypes: true });
  fileSystem.mkdirSync(destination, { recursive: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) copyAbsentTree(sourcePath, destinationPath, fileSystem);
    else if (entry.isFile() && !fileSystem.existsSync(destinationPath)) {
      fileSystem.mkdirSync(path.dirname(destinationPath), { recursive: true });
      fileSystem.copyFileSync(sourcePath, destinationPath, fileSystem.constants.COPYFILE_EXCL);
    }
  }
}

function runStep(context, code, command, args, label, options = {}) {
  const result = surface.runChild(context, command, args, options);
  if (!result || result.code !== 0 || result.error) {
    const output = (result && (result.stderr || result.stdout)) || (result && result.error) || 'no command output';
    const detail = output.trim().split(/\r?\n/).slice(-8).join(' | ') || 'no command output';
    throw new ConvertError(code, `${label} failed: ${detail}`, 1);
  }
  return { command: [command, ...args], stdout: result.stdout, stderr: result.stderr, exitCode: result.code };
}

function updateGraphMetadata(skillRoot, plan, fileSystem) {
  const metadataFile = path.join(skillRoot, 'graph-metadata.json');
  let metadata;
  try {
    metadata = JSON.parse(fileSystem.readFileSync(metadataFile, 'utf8'));
  } catch (error) {
    throw new ConvertError('GRAPH_METADATA_INVALID', `The scaffold step could not read graph-metadata.json: ${firstLine(error.message)}`, 1);
  }
  metadata.intent_signals = plan.approvedPhrases;
  const derived = metadata.derived && typeof metadata.derived === 'object' ? metadata.derived : {};
  derived.trigger_phrases = plan.approvedPhrases;
  derived.key_topics = plan.approvedPhrases;
  derived.key_files = [`.skilled/skills/${plan.name}/SKILL.md`];
  derived.entities = [{
    name: plan.name,
    kind: 'skill',
    path: `.skilled/skills/${plan.name}/SKILL.md`,
    source: 'derived',
  }];
  derived.source_docs = ['SKILL.md', 'leaf-manifest.config.json'];
  derived.causal_summary = plan.descriptionTrim || plan.description;
  metadata.derived = derived;
  fileSystem.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
}

function pythonExecutable(context) {
  // The scaffolder and both validators are plain Python 3; an operator-set
  // interpreter wins so a repo can pin one, and PATH discovery keeps this
  // working off macOS, where an absolute Homebrew path does not exist.
  return context.python || 'python3';
}

// The scaffolder, both validators and the router template ship as one folder, so
// the package-skill path the context resolved anchors all of them. A test that
// runs against a temporary repository overrides that one path rather than every
// file it implies.
function skillCreatorDirectory(context) {
  return path.dirname(context.paths.packageSkill);
}

// A copied tree reproduces a symlink as a link, so writing the staged SKILL.md
// would write the file outside the source. Every entry is checked, not only the
// ones this run opens, because the copy is what carries the link along.
function firstSymlinkInTree(root, fileSystem) {
  const pending = [path.resolve(root)];
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of fileSystem.readdirSync(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) return candidate;
      if (entry.isDirectory()) pending.push(candidate);
    }
  }
  return null;
}

function refuseSymlink(root, fileSystem, code = 'SOURCE_SYMLINK') {
  const link = firstSymlinkInTree(root, fileSystem);
  if (!link) return;
  refuse(
    `The source tree contains a symlink (${link}); a copy would write through it, so it is not converted.`,
    code,
  );
}

// The integration rows report their own failures row by row, so a failure to
// even plan them is the only case that reaches this wrapper.
function planIntegrationRows(context, options) {
  try {
    return integrate.planIntegration({ context, ...options });
  } catch (error) {
    if (error instanceof integrate.IntegrationError) {
      throw new ConvertError(error.code, error.message, 1);
    }
    throw error;
  }
}

function runScaffoldStep(plan, context) {
  const fileSystem = context.fs;
  const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-convert-'));
  const scaffoldRoot = path.join(tempParent, plan.name);
  const initScript = path.join(skillCreatorDirectory(context), 'init_skill.py');
  try {
    runStep(context, 'INIT_SKILL_FAILED', pythonExecutable(context), [initScript, plan.name, '--path', tempParent], 'init_skill.py');
    const absentFiles = ['graph-metadata.json', 'leaf-manifest.config.json'];
    for (const relative of absentFiles) {
      const source = path.join(scaffoldRoot, relative);
      const destination = path.join(plan.targetRoot, relative);
      if (!fileSystem.existsSync(destination)) {
        fileSystem.copyFileSync(source, destination, fileSystem.constants.COPYFILE_EXCL);
      }
    }
    for (const relative of ['manual-testing-playbook', 'benchmark']) {
      const source = path.join(scaffoldRoot, relative);
      if (fileSystem.existsSync(source)) {
        copyAbsentTree(source, path.join(plan.targetRoot, relative), fileSystem);
      }
    }
    updateGraphMetadata(plan.targetRoot, plan, fileSystem);
  } finally {
    fs.rmSync(tempParent, { recursive: true, force: true });
  }
}

function applyPlainResources(plan, context, nextSkill) {
  const fileSystem = context.fs;
  const renames = new Map(plan.renames);
  const transformed = [];
  for (const relative of plan.resourceDocs) {
    const sourcePath = path.join(plan.targetRoot, ...relative.split('/'));
    const nextRelative = renames.get(relative) || relative;
    let text = fileSystem.readFileSync(sourcePath, 'utf8');
    text = transforms.addResourceFrontmatter(text, nextRelative, plan.approvedPhrases);
    text = transforms.rewriteResourceLinks(text, renames, relative);
    transformed.push({ relative, nextRelative, text });
  }
  let rewrittenSkill = transforms.rewriteResourceLinks(nextSkill, renames, 'SKILL.md');
  if (rewrittenSkill !== nextSkill) fileSystem.writeFileSync(plan.skillFile, rewrittenSkill, 'utf8');

  for (const item of transformed) {
    const destination = path.join(plan.targetRoot, ...item.nextRelative.split('/'));
    if (item.nextRelative === item.relative) fileSystem.writeFileSync(destination, item.text, 'utf8');
    else writeExclusive(fileSystem, destination, item.text);
  }
  for (const item of transformed) {
    if (item.nextRelative !== item.relative) {
      fileSystem.unlinkSync(path.join(plan.targetRoot, ...item.relative.split('/')));
    }
  }
}

function applyPlainPlan(plan, context) {
  if (plan.allowedTools.length === 0) {
    throw new ConvertError(
      'ALLOWED_TOOLS_APPROVAL_REQUIRED',
      `The plan proposes ${JSON.stringify(plan.proposedTools)}; pass repeated --allowed-tool values, or one --allowed-tools list, to approve the permission grant.`,
      1,
    );
  }
  if (plan.proposedTrim && !plan.descriptionTrim) {
    throw new ConvertError(
      'DESCRIPTION_TRIM_REQUIRED',
      `The description exceeds 130 characters; approve the planned trim ${JSON.stringify(plan.proposedTrim)} before the format gate.`,
      1,
    );
  }
  if (!plan.agentOutput) {
    throw new ConvertError('AGENT_RESHAPE_REQUIRED', 'Provide the workflow agent output with --agent-output before applying the plain-skill plan.', 1);
  }

  const fileSystem = context.fs;
  if (fileSystem.readFileSync(path.join(plan.sourceRoot, 'SKILL.md'), 'utf8') !== plan.originalSkill) {
    throw new ConvertError('STALE_PLAN', 'The source SKILL.md changed after planning; no files were written.', 1);
  }
  if (fileSystem.existsSync(plan.targetRoot)) {
    throw new ConvertError('TARGET_EXISTS', `The target skill folder appeared after planning: ${plan.targetRoot}`, 1);
  }
  fileSystem.mkdirSync(plan.skillsDir || context.skillsDir, { recursive: true });
  const backupDirectory = makeBackupDirectory(context, plan.name);
  const snapshotDirectory = path.join(backupDirectory, 'before');
  let targetCreated = false;
  const commandResults = [];
  try {
    // The check runs again here: a link can appear between the plan and the
    // first write, and a link is copied as a link.
    refuseSymlink(plan.sourceRoot, fileSystem);
    fileSystem.mkdirSync(plan.targetRoot);
    targetCreated = true;
    try {
      fileSystem.cpSync(plan.sourceRoot, plan.targetRoot, { recursive: true, force: false, errorOnExist: true });
    } catch (error) {
      throw new ConvertError('SOURCE_COPY_FAILED', `The source copy could not be created: ${firstLine(error.message)}`, 1);
    }
    fileSystem.mkdirSync(snapshotDirectory, { recursive: true });
    fileSystem.copyFileSync(
      path.join(plan.sourceRoot, 'SKILL.md'),
      path.join(snapshotDirectory, 'SKILL.md'),
      fileSystem.constants.COPYFILE_EXCL,
    );
    // The snapshot carries the source references too, so the check can tell a
    // line the agent wrote from a line a copied reference already held.
    const sourceReferences = path.join(plan.sourceRoot, 'references');
    if (fileSystem.existsSync(sourceReferences)) {
      fileSystem.cpSync(sourceReferences, path.join(snapshotDirectory, 'references'), {
        recursive: true, force: false, errorOnExist: true,
      });
    }

    const normalizedSkill = transforms.normalizePlainSkillFrontmatter(
      plan.reshapedSource,
      plan.allowedTools,
      plan.descriptionTrim,
    );
    fileSystem.writeFileSync(plan.skillFile, normalizedSkill, 'utf8');
    writeExclusive(fileSystem, plan.routerFile, plan.nextRouter);

    const preservation = verifyPreservation(snapshotDirectory, plan.targetRoot, fileSystem, new Map(plan.renames));
    if (!preservation.ok) {
      throw new ConvertError(
        'PRESERVATION_FAILED',
        `Original body line is missing from SKILL.md, ROUTER.md and references/: ${JSON.stringify(preservation.missing[0])}`,
        1,
      );
    }

    applyPlainResources(plan, context, normalizedSkill);
    assertNoStaleRenameKeys(plan, fileSystem);
    runScaffoldStep(plan, context);

    commandResults.push(runStep(
      context,
      'ROOT_METADATA_FAILED',
      'node',
      [context.paths.rootMetadata, '--fix', '--skills-dir', context.skillsDir, '--skill', plan.name],
      'ci-skill-root-metadata.cjs',
    ));
    commandResults.push(runStep(
      context,
      'DERIVED_FILES_FAILED',
      'node',
      [context.paths.regenerateDerived, '--root', plan.targetRoot, '--write'],
      'regenerate-skill-derived.cjs',
    ));

    const packageScript = context.paths.packageSkill;
    const validateScript = path.join(skillCreatorDirectory(context), 'validate_skill_package.py');
    const packageResult = runStep(
      context,
      'STRICT_PACKAGE_FAILED',
      pythonExecutable(context),
      [packageScript, plan.targetRoot, '--check', '--strict'],
      'package_skill.py --check --strict',
    );
    if (!/Result:\s*PASS/i.test(packageResult.stdout)) {
      throw new ConvertError('STRICT_PACKAGE_FAILED', 'package_skill.py did not report Result: PASS.', 1);
    }
    commandResults.push(packageResult);
    commandResults.push(runStep(
      context,
      'VALIDATE_PACKAGE_FAILED',
      pythonExecutable(context),
      [validateScript, plan.targetRoot],
      'validate_skill_package.py',
    ));

    // Only a format-valid skill is worth wiring: a skill the gates refuse would
    // put reach and changelog rows around a root that cannot be packaged.
    const integration = integrate.applyIntegration({
      context,
      skillRoot: plan.targetRoot,
      name: plan.name,
      version: plan.version,
      description: plan.descriptionTrim || plan.description,
      phrases: plan.approvedPhrases,
      apply: true,
    });
    return {
      changed: true,
      targetRoot: plan.targetRoot,
      backupDirectory,
      snapshotDirectory,
      preservation,
      commandResults,
      integration,
      integrationWrites: integration.writes,
      message: `Converted ${plan.name}; preservation and the format gates passed, and ${integration.results.length} integration row(s) ran.`,
    };
  } catch (error) {
    // The staged tree is wholly this run's creation: both the plan and the
    // pre-write check refuse a pre-existing target. Removing it on failure leaves
    // the skills root as the run found it, and the snapshot beside the backup
    // keeps the original for inspection.
    if (targetCreated) {
      try { fileSystem.rmSync(plan.targetRoot, { recursive: true, force: true }); } catch {}
    }
    if (error instanceof ConvertError) throw error;
    throw new ConvertError('PLAIN_APPLY_FAILED', `Plain conversion stopped: ${firstLine(error.message)}`, 1);
  }
}

function runPreserve(snapshot, target, context) {
  const snapshotDirectory = path.resolve(context.cwd, snapshot);
  const skillRoot = path.resolve(context.cwd, target || '.');
  const result = verifyPreservation(snapshotDirectory, skillRoot, context.fs);
  if (!result.ok) {
    const lines = result.missing.map((line) => JSON.stringify(line));
    throw new ConvertError('PRESERVATION_FAILED', `Original body lines missing from SKILL.md, ROUTER.md and references/: ${lines.join('; ')}`, 1);
  }
  return result;
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
      if (step.kind === 'copy') lines.push(`${index + 1}. ${step.detail} Copy: ${step.file} -> ${step.destination}`);
      else if (step.kind === 'rename') lines.push(`${index + 1}. ${step.detail}`);
      else if (step.kind === 'agent' || step.kind === 'preserve' || step.kind === 'scaffold' || step.kind === 'command' || step.kind === 'gate') {
        lines.push(`${index + 1}. ${step.detail}`);
      } else lines.push(`${index + 1}. ${step.detail} ${step.kind === 'overwrite' ? 'Overwrite' : 'Create'}: ${step.file}`);
    }
    lines.push(`Backup existing files under: ${path.join(plan.backupBase, '<timestamp>')}`);
  }
  if (plan.kind === 'plain') {
    lines.push(`Approved intent phrases (${plan.approvedPhrases.length}): ${JSON.stringify(plan.approvedPhrases)}`);
    if (plan.suggestedPhrases.length) lines.push(`Suggested intent phrases (approve with repeated --approved-phrase values): ${JSON.stringify(plan.suggestedPhrases)}`);
    lines.push(`allowed-tools: ${plan.allowedTools.length ? JSON.stringify(plan.allowedTools) : `approval required; propose ${JSON.stringify(plan.proposedTools)}`}`);
    if (!plan.allowedTools.length) lines.push('No allowed-tools field will be written until approved with repeated --allowed-tool values or one --allowed-tools list.');
    if (plan.proposedTrim) {
      lines.push(`Proposed description trim (approve with --description-trim): ${JSON.stringify(plan.proposedTrim)}`);
    }
    if (plan.descriptionTrim) lines.push(`Approved description trim: ${JSON.stringify(plan.descriptionTrim)}`);
    lines.push(`RESOURCE_MAP order: ${JSON.stringify(plan.mapResources)}`);
  }
  // The integration rows are planned here and run after the format gates, so the
  // plan the operator approves covers the reach writes as well as the file copy.
  if (plan.integrationPlan && plan.integrationPlan.length) {
    lines.push(...plan.integrationPlan);
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
  // Integration writes are recorded by the row that made them. A created file is
  // removed; a tracked file the row overwrote is restored from version control.
  for (const write of result.integrationWrites || []) {
    if (write.kind === 'create') lines.push(`  rm ${quoteArgument(write.file)}`);
    else lines.push(`  git -c core.fsmonitor=false restore -- ${quoteArgument(write.file)}`);
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
    const parsed = parseArguments(argv);
    const { command, target, apply } = parsed;
    if (command === 'preserve') {
      const result = runPreserve(parsed.snapshot, target, context);
      stdout.write(`Preservation PASS: ${result.originalLineCount} original body line(s) found.\n`);
      return 0;
    }
    const plan = buildPlan(target, context, parsed);
    stdout.write(renderPlan(plan));
    if (plan.noop) return 0;
    if (command !== 'apply' || !apply) {
      if (command === 'apply') stdout.write('Apply gate: no writes without --apply.\n');
      return 0;
    }
    const result = plan.kind === 'plain' ? applyPlainPlan(plan, context) : applyPlan(plan, context);
    stdout.write(`${result.message}\n`);
    if (result.backupDirectory) stdout.write(`Backup: ${result.backupDirectory}\n`);
    if (result.snapshotDirectory) stdout.write(`Snapshot: ${result.snapshotDirectory}\n`);
    if (result.provenance) stdout.write(`Router source: ${result.provenance}\n`);
    if (result.targetRoot) stdout.write(`Converted skill: ${result.targetRoot}\n`);
    if (result.preservation) stdout.write(`Preservation PASS: ${result.preservation.originalLineCount} original body line(s) found.\n`);
    for (const item of result.commandResults || []) {
      stdout.write(`${item.command.join(' ')} (exit ${item.exitCode})\n`);
      if (item.stdout) stdout.write(item.stdout);
    }
    for (const row of result.integration ? result.integration.results : []) {
      for (const line of row.lines) stdout.write(`${line}\n`);
    }
    // The undo block closes the run, so its check command is the last thing the operator reads.
    if (result.backupDirectory) stdout.write(renderUndo(result, plan));
    // A conversion the gates accept but the integration rows cannot wire is not
    // a finished conversion, so the run reports it without hiding the undo list.
    if (result.integration && !result.integration.ok) return 1;
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
  runPreserve,
  runConvert,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));
