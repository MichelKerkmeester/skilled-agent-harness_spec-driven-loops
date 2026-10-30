#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const surface = require('./lib/sk-skill-surface.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND CHILD PROCESS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const ROW_LABELS = [
  ['C1', 'Location'],
  ['C2', 'Input kind'],
  ['C3', 'Format'],
  ['C4', 'Root metadata'],
  ['C5', 'Intent signals'],
  ['C6', 'Derived freshness'],
  ['C7', 'Router equivalence'],
  ['C8', 'Advisor home'],
  ['C9', 'Runtime mirrors'],
  ['C10', 'Changelog'],
  ['C11', 'Description budget'],
  ['C12', 'Collisions'],
  ['C13', 'Regression coverage'],
];

function firstLine(value) {
  return String(value || '').split(/\r?\n/).find((line) => line.trim()) || '';
}

function runValidator(context, label, command, args, options = {}) {
  const result = surface.runChild(context, command, args, options);
  const mapped = surface.mapValidatorExit(result, options.exitMap || {});
  if (mapped.status === 'ERROR') {
    const reason = result && result.error ? result.error : firstLine(result && result.stderr);
    throw new surface.CheckError(
      'VALIDATOR_CANNOT_RUN',
      `${label} could not run${reason ? `: ${reason}` : '.'}`,
      options.provision || null,
    );
  }
  return { result, mapped };
}

function requireJson(label, result) {
  const payload = surface.parseJsonOutput(result);
  if (!payload || typeof payload !== 'object') {
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', `${label} returned invalid JSON.`);
  }
  return payload;
}

function addRow(rows, row, status, detail, data = {}) {
  rows.push({ row, label: ROW_LABELS.find(([id]) => id === row)[1], status, detail, ...data });
}

function statusForOverall(rows) {
  return rows.some((row) => row.status === 'FINDING') ? 1 : 0;
}

function countRows(rows) {
  return {
    findingCount: rows.filter((row) => row.status === 'FINDING').length,
    unknownCount: rows.filter((row) => row.status === 'UNKNOWN').length,
  };
}

function resultText(report) {
  if (report.findingCount > 0) return `Result: FINDINGS (${report.findingCount})`;
  if (report.unknownCount > 0) return `Result: NO FINDINGS (${report.unknownCount} UNKNOWN)`;
  return 'Result: PASS';
}

function formatCodes(values, prefix) {
  const matches = String(values || '').match(new RegExp(`${prefix}-\\d{3}`, 'g')) || [];
  return [...new Set(matches)].sort();
}

function displayName(skillName, skillRoot) {
  if (surface.isReservedSkillName(path.basename(skillRoot))) return '[private skill]';
  return surface.safeSkillName(skillName) || surface.safeSkillName(path.basename(skillRoot)) || 'unknown';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NAMED SKILL REPORT
// ─────────────────────────────────────────────────────────────────────────────

function runPackageCheck(skillRoot, context) {
  const { result, mapped } = runValidator(
    context,
    'package_skill.py',
    context.python,
    [context.paths.packageSkill, skillRoot, '--check', '--strict', '--json'],
  );
  const payload = requireJson('package_skill.py', result);
  if (mapped.code === 1 && payload.valid !== false) {
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'package_skill.py returned a finding without a valid JSON verdict.');
  }
  if (typeof payload.valid !== 'boolean') {
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'package_skill.py JSON is missing its valid verdict.');
  }
  const codes = formatCodes(JSON.stringify(payload), 'RS');
  return {
    status: payload.valid ? 'PASS' : 'FINDING',
    detail: payload.valid ? 'Strict package validation passed.' : 'Strict package validation found format issues.',
    codes,
  };
}

function runMetadataCheck(skillRoot, location, context) {
  const subject = location.kind === 'nested' ? 'Parent hub metadata' : 'Root metadata';
  const invocation = surface.rootMetadataInvocation(skillRoot, location, context);
  const { result, mapped } = runValidator(
    context,
    'ci-skill-root-metadata.cjs',
    process.execPath,
    invocation.args,
  );
  const payload = requireJson('ci-skill-root-metadata.cjs', result);
  const metadata = surface.extractRootMetadata(payload, invocation.name);
  if (!metadata || !metadata.result) {
    if (mapped.code === 1) {
      return { status: 'FINDING', detail: `${subject} validation did not classify this skill.`, metadataClass: null, codes: [] };
    }
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'Root metadata JSON did not include the requested skill.');
  }
  const codes = [...new Set((metadata.result.violations || []).map((entry) => entry.code).filter(Boolean))].sort();
  const isPass = metadata.result.status === 'pass' && mapped.status === 'PASS';
  return {
    status: isPass ? 'PASS' : 'FINDING',
    detail: isPass ? `${subject} contract passed.` : `${subject} contract has violations.`,
    metadataClass: metadata.skillClass,
    codes,
  };
}

function checkDerived(skillRoot, context) {
  const { result, mapped } = runValidator(
    context,
    'regenerate-skill-derived.cjs',
    process.execPath,
    [context.paths.regenerateDerived, '--root', skillRoot, '--dry-run'],
  );
  const payload = requireJson('regenerate-skill-derived.cjs', result);
  if (!Array.isArray(payload.results) || payload.results.length === 0) {
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'Derived freshness JSON has no root result.');
  }
  const errored = payload.results.some((entry) => entry.status === 'error');
  const changed = payload.results.some((entry) => entry.status === 'would-change');
  if (errored || mapped.status === 'FINDING') {
    throw new surface.CheckError('DERIVED_VALIDATION_FAILED', 'Derived freshness validator reported an error.');
  }
  return changed
    ? { status: 'FINDING', detail: 'Generated derived content would change.' }
    : { status: 'PASS', detail: 'Generated derived content is current.' };
}

function checkRouter(skillRoot, context) {
  let parser;
  try {
    parser = require(context.paths.routerReplay).parseRouter;
  } catch (error) {
    throw new surface.CheckError('ROUTER_PARSER_MISSING', `The router parser could not load: ${firstLine(error.message)}`);
  }
  let parsed;
  try {
    parsed = parser(null, skillRoot);
  } catch (error) {
    return { status: 'FINDING', detail: `Router parsing failed: ${firstLine(error.message)}` };
  }
  const intentCount = parsed.intentSignals && typeof parsed.intentSignals === 'object'
    ? Object.keys(parsed.intentSignals).length
    : 0;
  const resourceCount = parsed.resourceMap && typeof parsed.resourceMap === 'object'
    ? Object.keys(parsed.resourceMap).length
    : 0;
  return {
    status: parsed.parseable ? 'PASS' : 'FINDING',
    detail: parsed.parseable
      ? `Parsed ${intentCount} intent signal groups and ${resourceCount} resource-map entries.`
      : 'The declared router is not parseable.',
    intentCount,
    resourceCount,
    routerSource: parsed.routerSource || 'none',
  };
}

function runAdvisorQuery(context, signal) {
  return runValidator(
    context,
    'advisor_recommend --warm-only',
    process.execPath,
    [
      context.paths.advisor,
      'advisor_recommend',
      '--json',
      JSON.stringify({ prompt: signal }),
      '--warm-only',
      '--format',
      'json',
    ],
    { timeoutMs: surface.ADVISOR_TIMEOUT_MS, exitMap: { findingCodes: [1], unknownCodes: [75] } },
  );
}

function checkAdvisorHome(skillName, graphMetadata, context) {
  const savedSignals = graphMetadata && Array.isArray(graphMetadata.intent_signals)
    ? graphMetadata.intent_signals
    : [];
  const signals = savedSignals.slice(0, 3);
  if (signals.length === 0) signals.push(skillName);

  const results = signals.map((signal) => ({ signal, ...runAdvisorQuery(context, signal) }));
  const unavailable = results.some(({ mapped }) => mapped.code === 75);
  const failed = results.some(({ mapped }) => mapped.status === 'FINDING');
  const allUnavailable = results.every(({ mapped }) => mapped.code === 75);
  const hits = results.filter(({ result }) => {
    const payload = surface.parseJsonOutput(result);
    return Boolean(payload && Array.isArray(payload.recommendations)
      && payload.recommendations.some((recommendation) => (
        recommendation && typeof recommendation === 'object' && recommendation.skillId === skillName
      )));
  }).length;
  if (failed) {
    return { status: 'FINDING', detail: `Advisor query failed for ${signals.length} signal(s).`, queries: signals.length, hits };
  }
  if (unavailable) {
    return {
      status: 'UNKNOWN',
      detail: allUnavailable
        ? 'Advisor backend is unavailable; no recommendation verdict was inferred.'
        : 'At least one advisor query was unavailable; no pass was inferred.',
      queries: signals.length,
      hits,
    };
  }
  return {
    status: 'INFO',
    detail: `Advisor queries completed; the skill appeared in ${hits} of ${signals.length} result(s).`,
    queries: signals.length,
    hits,
  };
}

function checkGraphValidators(context) {
  const compiler = runValidator(
    context,
    'skill_graph_compiler.py --validate-only',
    context.python,
    [context.paths.skillGraphCompiler, '--validate-only'],
  );
  const freshness = runValidator(
    context,
    'skill-graph-freshness.cjs --strict',
    process.execPath,
    [context.paths.graphFreshness, '--strict'],
  );
  const problems = [];
  if (compiler.mapped.status === 'FINDING') problems.push('skill graph compilation has validation findings');
  if (freshness.mapped.status === 'FINDING') problems.push('compiled skill graph is stale');
  return {
    status: problems.length ? 'FINDING' : 'PASS',
    detail: problems.length ? problems.join('; ') : 'Skill graph validates and its compiled view is fresh.',
  };
}

function checkAdvisor(skillName, graphMetadata, context) {
  const validators = checkGraphValidators(context);
  const advisor = checkAdvisorHome(skillName, graphMetadata, context);
  const status = validators.status === 'FINDING'
    ? 'FINDING'
    : advisor.status;
  return {
    status,
    detail: `${validators.detail} ${advisor.detail}`,
    queries: advisor.queries,
    hits: advisor.hits,
  };
}

function checkRuntimeMirrors(skillName, location, context) {
  const runtimes = [
    ['Claude', path.join(context.repoRoot, '.claude', 'skills')],
    ['OpenCode', path.join(context.repoRoot, '.opencode', 'skills')],
    ['Pi', path.join(context.repoRoot, '.pi', 'skills')],
    ['Devin', path.join(context.repoRoot, '.devin', 'skills')],
  ];
  if (location.kind === 'outside') {
    const mirrors = [...runtimes.map(([name]) => `${name}:not-included`), 'Hermes:not-included', 'Codex:not-included', 'Cursor:not-included'];
    return {
      status: 'INFO',
      detail: `Runtime mirror status: ${mirrors.join(', ')}.`,
      mirrors,
    };
  }
  const checked = [];
  const findings = [];
  for (const [name, target] of runtimes) {
    if (!context.fs.existsSync(target)) {
      checked.push(`${name}:n/a`);
      continue;
    }
    try {
      const targetRoot = context.fs.realpathSync(target);
      const skillsRoot = context.fs.realpathSync(context.skillsDir);
      if (targetRoot === skillsRoot) checked.push(`${name}:pass`);
      else {
        checked.push(`${name}:finding`);
        findings.push(name);
      }
    } catch {
      checked.push(`${name}:finding`);
      findings.push(name);
    }
  }

  const hermes = runValidator(
    context,
    'sync-skills-hermes.cjs --check',
    process.execPath,
    [context.paths.hermesSync, '--check'],
  );
  const hermesHasTargetIssue = String(hermes.result.stdout || '').split(/\r?\n/).some((line) => {
    const match = line.match(/^(?:DRIFT|STALE)\s+(.+)$/);
    return match && match[1] === skillName;
  });
  if (hermesHasTargetIssue) findings.push('Hermes');
  checked.push(`Hermes:${hermesHasTargetIssue ? 'finding' : 'pass'}`);
  checked.push('Codex:n/a', 'Cursor:n/a');
  return {
    status: findings.length ? 'FINDING' : 'PASS',
    detail: `Runtime mirror status: ${checked.join(', ')}.`,
    mirrors: checked,
  };
}

function checkDescription(skillName, context, location, description) {
  if (location.kind === 'outside') {
    if (typeof description !== 'string') {
      return { status: 'N/A', detail: 'Outside-root description is unavailable.' };
    }
    const length = Array.from(description).length;
    const contract = surface.readJsonFile(
      path.join(context.repoRoot, '.skilled', 'skills', 'sk-doc', 'shared', 'assets', 'skill-contract.json'),
      context.fs,
    );
    const budget = contract && contract.descriptionBudget;
    const softTarget = budget && budget.skill && Number.isInteger(budget.skill.softMax)
      ? budget.skill.softMax
      : 130;
    const hardCap = budget && Number.isInteger(budget.hardCap) ? budget.hardCap : 1536;
    if (length > hardCap) {
      return { status: 'FINDING', detail: `Outside-root description is ${length} characters, over the ${hardCap}-character hard cap.`, length };
    }
    if (length > softTarget) {
      return { status: 'INFO', detail: `Outside-root description is ${length} characters, above the ${softTarget}-character soft target.`, length };
    }
    return { status: 'PASS', detail: `Outside-root description is ${length} characters, within the ${softTarget}-character soft target.`, length };
  }
  const { result, mapped } = runValidator(
    context,
    'audit_descriptions.py',
    context.python,
    [context.paths.auditDescriptions, '--repo-root', context.repoRoot, '--json'],
  );
  const payload = requireJson('audit_descriptions.py', result);
  const item = Array.isArray(payload.items)
    ? payload.items.find((entry) => entry.surface === 'skill' && entry.name === skillName)
    : null;
  if (!item) return { status: 'N/A', detail: 'This skill is not part of the repository description audit.' };
  if (item.status === 'HARD-FAIL' || mapped.status === 'FINDING') {
    return { status: 'FINDING', detail: `Description is ${item.status} at ${item.length} characters.`, length: item.length };
  }
  return { status: item.status === 'OVER-SOFT' ? 'INFO' : 'PASS', detail: `Description is ${item.status} at ${item.length} characters.`, length: item.length };
}

function checkNamedSkill(skillRoot, context) {
  if (!context.skipPreflight) surface.ensurePreconditions(context);
  const location = surface.classifyLocation(skillRoot, context.skillsDir, context.fs);
  const skill = surface.readSkillFields(skillRoot, context.fs);
  const skillName = skill.fields.name || path.basename(skillRoot);
  const safeName = displayName(skillName, skillRoot);
  const filteredRoot = surface.isReservedSkillName(path.basename(skillRoot));
  const resolver = require(context.paths.resolver).resolveMachineRouter;
  const resolverResult = resolver({ skillRoot, skillMdText: skill.text || undefined });
  const graphMetadata = surface.readJsonFile(path.join(skillRoot, 'graph-metadata.json'), context.fs);
  // These validators deliberately filter reserved roots, so their absence stays UNKNOWN.
  const metadata = filteredRoot
    ? { status: 'UNKNOWN', detail: 'The root metadata validator filters this reserved root.', metadataClass: null, codes: [] }
    : runMetadataCheck(skillRoot, location, context);
  const metadataClass = metadata.metadataClass;

  const rows = [];
  const inputKind = surface.classifyInput({
    location,
    fields: skill.fields,
    resolverVerdict: resolverResult.verdict,
    metadataClass,
  });
  const locationStatus = location.kind === 'outside'
    ? 'INFO'
    : inputKind === 'hub' || inputKind === 'hub-packet'
      ? 'INFO'
      : location.kind === 'direct' ? 'PASS' : 'FINDING';
  const locationDetail = location.kind === 'outside'
    ? 'Outside the skills root; advisor discovery does not include it.'
    : inputKind === 'hub'
      ? 'Direct hub root.'
      : inputKind === 'hub-packet'
        ? 'Hub packet nested under its parent hub.'
        : location.kind === 'direct' ? 'Direct child of the skills root.' : 'Nested under a hub packet.';
  addRow(rows, 'C1', locationStatus, locationDetail, { location: location.kind, inputKind });

  const kindStatus = ['dual-declaration', 'unclassified'].includes(inputKind)
    ? 'FINDING'
    : ['hub', 'hub-packet'].includes(inputKind) ? 'INFO' : 'PASS';
  addRow(rows, 'C2', kindStatus, `Resolver verdict: ${resolverResult.verdict}; input kind: ${inputKind}.`, {
    inputKind,
    resolverVerdict: resolverResult.verdict,
    metadataClass,
  });

  // Strict package validation owns the format rules and their machine-readable codes.
  const format = runPackageCheck(skillRoot, context);
  addRow(rows, 'C3', format.status, format.detail, { codes: format.codes });

  // Root metadata validation owns class, router contract, and intent-floor requirements.
  addRow(rows, 'C4', metadata.status, metadata.detail, { metadataClass, codes: metadata.codes });

  // Scaffold defaults provide no skill-specific routing intent.
  const slug = surface.checkSlugDefaults(skillName, graphMetadata);
  addRow(rows, 'C5', slug.status, slug.detail, {
    expectedCount: slug.expectedCount,
    actualCount: slug.actualCount,
  });

  // A dry-run exposes stale generated content without applying repairs.
  const derived = filteredRoot
    ? { status: 'UNKNOWN', detail: 'The derived-content validator filters this reserved root.' }
    : checkDerived(skillRoot, context);
  addRow(rows, 'C6', derived.status, derived.detail);

  // The shared parser confirms the selected router can still be replayed.
  const router = checkRouter(skillRoot, context);
  addRow(rows, 'C7', router.status, router.detail, {
    intentCount: router.intentCount,
    resourceCount: router.resourceCount,
    routerSource: router.routerSource,
  });

  // Compiler, freshness, and warm-only queries show whether the advisor can discover the skill.
  const advisor = location.kind === 'outside'
    ? { status: 'INFO', detail: 'Not in the repository advisor or corpus.' }
    : checkAdvisor(skillName, graphMetadata, context);
  addRow(rows, 'C8', advisor.status, advisor.detail, {
    ...(advisor.queries === undefined ? {} : { queries: advisor.queries }),
    ...(advisor.hits === undefined ? {} : { hits: advisor.hits }),
  });

  // Runtime mirrors must point at the canonical tree or pass their own read-only check.
  const mirrors = checkRuntimeMirrors(skillName, location, context);
  addRow(rows, 'C9', mirrors.status, mirrors.detail, { mirrors: mirrors.mirrors });

  // The local changelog entry and shared index link are separate package requirements.
  const changelog = surface.changelogStatus(
    skillRoot,
    skillName,
    skill.fields.version,
    context.repoRoot,
    context.fs,
    { location, inputKind, skillsDir: context.skillsDir },
  );
  addRow(rows, 'C10', changelog.status, changelog.detail);

  // Native runtimes impose a hard description cap even when package validation passes.
  const description = checkDescription(skillName, context, location, skill.fields.description);
  addRow(rows, 'C11', description.status, description.detail, { length: description.length });

  // Duplicate names, runtime persona names, and filtered prefixes can hide an otherwise valid root.
  const collisions = surface.inspectCollisions(skillName, skillRoot, context.skillsDir, context.fs);
  const collisionNames = collisions.findings || [];
  addRow(rows, 'C12', collisions.status, collisionNames.length
    ? `Collision checks found ${collisionNames.join('; ')}.`
    : 'No duplicate, reserved-prefix or runtime-persona collision found.', {
    collisionCount: collisions.collisionCount || 0,
    findings: collisionNames,
  });

  // Existing corpora provide a count of regression coverage without changing either corpus.
  const coverage = location.kind === 'outside'
    ? { status: 'INFO', detail: 'Not in the repository advisor or corpus.' }
    : surface.countRegressionCases(skillName, context.paths, context.fs);
  const coverageDetail = coverage.detail || (coverage.status === 'INFO'
    ? `Regression corpus contains ${coverage.total} matching cases.`
    : 'Regression corpus counts are unavailable.');
  addRow(rows, 'C13', coverage.status, coverageDetail, {
    ...(coverage.counts === undefined ? {} : { counts: coverage.counts || null }),
    ...(coverage.total === undefined ? {} : { total: coverage.total || null }),
  });

  const counts = countRows(rows);

  return {
    mode: 'deep',
    skill: safeName,
    inputKind,
    ...counts,
    exitCode: statusForOverall(rows),
    rows,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FLEET REPORT
// ─────────────────────────────────────────────────────────────────────────────

function directSkillRoots(skillsDir, fileSystem = fs) {
  let entries;
  try {
    entries = fileSystem.readdirSync(skillsDir, { withFileTypes: true });
  } catch (error) {
    throw new surface.CheckError('SKILLS_DIR_UNAVAILABLE', `The skills root cannot be read: ${firstLine(error.message)}`);
  }
  return entries
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .filter((entry) => !entry.name.startsWith(['lo', 'cal', String.fromCharCode(45)].join('')))
    .map((entry) => path.join(skillsDir, entry.name))
    .filter((root) => fileSystem.existsSync(path.join(root, 'SKILL.md')))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right)));
}

function runFleet(context) {
  surface.ensurePreconditions(context, { requireRouter: false });
  const roots = directSkillRoots(context.skillsDir, context.fs);
  const metadata = runValidator(
    context,
    'ci-skill-root-metadata.cjs',
    process.execPath,
    [context.paths.rootMetadata, '--skills-dir', context.skillsDir, '--format', 'json'],
  );
  const metadataPayload = requireJson('ci-skill-root-metadata.cjs', metadata.result);
  const metadataByName = new Map((metadataPayload.results || []).map((entry) => [entry.skill, entry]));
  const results = roots.map((root) => {
    const name = path.basename(root);
    const format = runPackageCheck(root, context);
    const rootMetadata = metadataByName.get(name);
    if (!rootMetadata) {
      throw new surface.CheckError('ROOT_METADATA_MISSING', `Root metadata validator omitted shipped skill ${name}.`);
    }
    const metadataStatus = rootMetadata.status === 'pass' ? 'PASS' : 'FINDING';
    const status = format.status === 'PASS' && metadataStatus === 'PASS' ? 'PASS' : 'FINDING';
    const metadataCodes = (rootMetadata.violations || []).map((entry) => entry.code).filter(Boolean);
    return {
      skill: surface.safeSkillName(name),
      status,
      packageStatus: format.status,
      formatCodes: format.codes,
      metadataStatus,
      metadataClass: rootMetadata.skillClass || null,
      metadataCodes,
      codes: [...new Set([...format.codes, ...metadataCodes])].sort(),
    };
  });
  const counts = countRows(results);
  const report = {
    mode: 'fleet',
    count: results.length,
    ...counts,
    exitCode: statusForOverall(results),
    roots: results,
  };
  return report;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ARGUMENTS AND RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function parseArguments(argv) {
  const args = { target: null, json: false };
  for (const token of argv) {
    if (token === '--json') {
      if (args.json) throw new surface.CheckError('USAGE', 'Option --json was specified more than once.');
      args.json = true;
    } else if (token.startsWith('-')) {
      throw new surface.CheckError('USAGE', `Unknown option: ${token}`);
    } else if (args.target === null) {
      args.target = token;
    } else {
      throw new surface.CheckError('USAGE', 'Only one skill name or path may be checked.');
    }
  }
  return args;
}

function renderDeepText(report) {
  const lines = [`Skill check: ${report.skill} (${report.inputKind})`, ''];
  for (const row of report.rows) {
    const codes = Array.isArray(row.codes) && row.codes.length ? ` Codes: ${row.codes.join(', ')}.` : '';
    lines.push(`${row.row.padEnd(4)}${row.status.padEnd(7)} ${row.label}: ${row.detail}${codes}`);
  }
  lines.push('', resultText(report));
  return `${lines.join('\n')}\n`;
}

function renderFleetText(report) {
  const nameWidth = Math.max('Skill'.length, ...report.roots.map((row) => row.skill.length));
  const codeWidth = Math.max('Codes'.length, ...report.roots.map((row) => row.codes.join(', ').length));
  const lines = [
    'Skill fleet check',
    `${'Skill'.padEnd(nameWidth)}  ${'Format'.padEnd(8)}  ${'Metadata'.padEnd(8)}  ${'Codes'.padEnd(codeWidth)}  Verdict`,
  ];
  for (const row of report.roots) {
    lines.push(`${row.skill.padEnd(nameWidth)}  ${row.packageStatus.padEnd(8)}  ${row.metadataStatus.padEnd(8)}  ${row.codes.join(', ').padEnd(codeWidth)}  ${row.status}`);
  }
  lines.push('', `Roots: ${report.count}; ${resultText(report).replace('Result:', 'result:')}`);
  return `${lines.join('\n')}\n`;
}

function runCheck(argv = process.argv.slice(2), options = {}) {
  const context = options.context || surface.createContext(options.contextOptions || {});
  const stdout = options.stdout || context.stdout;
  const stderr = options.stderr || context.stderr;
  try {
    const [command, ...rest] = argv[0] === 'check' ? argv : ['check', ...argv];
    if (command !== 'check') throw new surface.CheckError('USAGE', 'Usage: sk-skill-check.cjs check [<name-or-path>] [--json]');
    const parsed = parseArguments(rest);
    const report = parsed.target === null
      ? runFleet(context)
      : checkNamedSkill(surface.resolveSkillTarget(parsed.target, context), context);
    if (parsed.json) stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    else stdout.write(report.mode === 'fleet' ? renderFleetText(report) : renderDeepText(report));
    return report.exitCode;
  } catch (error) {
    if (error instanceof surface.CheckError) {
      stderr.write(`${error.code}: ${error.message}\n`);
      if (error.provision) stderr.write(`Provision: ${error.provision}\n`);
      return 2;
    }
    stderr.write(`CHECK_ERROR: ${firstLine(error && error.message)}\n`);
    return 2;
  }
}

function main(argv = process.argv.slice(2)) {
  return runCheck(argv);
}

module.exports = {
  checkNamedSkill,
  directSkillRoots,
  main,
  parseArguments,
  renderFleetText,
  runCheck,
  runFleet,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));
