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
  const message = typeof payload.message === 'string' ? payload.message : '';
  const warnings = Array.isArray(payload.warnings) ? payload.warnings.join('\n') : '';
  const codes = formatCodes(`${message}\n${warnings}`, 'RS');
  const detail = payload.valid
    ? 'Strict package validation passed.'
    : formatCodes(message, 'RS').length > 0
      ? 'Strict package validation found format issues.'
      : firstLine(message) || 'Strict package validation found format issues.';
  return {
    status: payload.valid ? 'PASS' : 'FINDING',
    detail,
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
  const label = 'regenerate-skill-derived.cjs';
  const result = surface.runChild(
    context,
    process.execPath,
    [context.paths.regenerateDerived, '--root', skillRoot, '--dry-run'],
  );
  const mapped = surface.mapValidatorExit(result);
  const payload = surface.parseJsonOutput(result);
  if (!payload || !Array.isArray(payload.results) || payload.results.length === 0) {
    if (mapped.status === 'ERROR') {
      const reason = result && result.error ? result.error : firstLine(result && result.stderr);
      throw new surface.CheckError(
        'VALIDATOR_CANNOT_RUN',
        `${label} could not run${reason ? `: ${reason}` : '.'}`,
      );
    }
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'Derived freshness JSON has no root result.');
  }
  const targetName = path.basename(skillRoot);
  const entry = payload.results.find((row) => row && row.name === targetName)
    || (payload.results.length === 1 ? payload.results[0] : null);
  if (!entry || typeof entry.status !== 'string') {
    throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'Derived freshness JSON omitted this skill result.');
  }
  if (entry.status === 'skipped') {
    return { status: 'INFO', detail: `Not applicable: ${entry.reason || 'derived validation was skipped'}.` };
  }
  if (entry.status === 'error') {
    const reason = Array.isArray(entry.errors) ? firstLine(entry.errors.join('\n')) : firstLine(entry.error);
    return {
      status: 'FINDING',
      detail: `Derived content validation reported an error${reason ? `: ${reason}` : '.'}`,
    };
  }
  if (mapped.status === 'ERROR') {
    const reason = result && result.error ? result.error : firstLine(result && result.stderr);
    throw new surface.CheckError(
      'VALIDATOR_CANNOT_RUN',
      `${label} could not run${reason ? `: ${reason}` : '.'}`,
    );
  }
  if (entry.status === 'would-change' || mapped.status === 'FINDING') {
    return { status: 'FINDING', detail: 'Generated derived content would change.' };
  }
  if (entry.status === 'unchanged' || entry.status === 'written') {
    return { status: 'PASS', detail: 'Generated derived content is current.' };
  }
  throw new surface.CheckError('VALIDATOR_OUTPUT_INVALID', 'Derived freshness JSON has an unrecognized root status.');
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
    const recommendations = payload && Array.isArray(payload.data && payload.data.recommendations)
      ? payload.data.recommendations
      : payload && payload.recommendations;
    return Boolean(Array.isArray(recommendations)
      && recommendations.some((recommendation) => (
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
  const { result } = runValidator(
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
  if (item.status === 'HARD-FAIL') {
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
    .filter((entry) => !surface.isReservedSkillName(entry.name))
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
// 5. HUB GAP REPORT
// ─────────────────────────────────────────────────────────────────────────────

// The eleven surfaces a mode must land on before it is integrated, in the order
// the nested-packet reference lists them.
const HUB_ROW_LABELS = [
  ['H1', 'Packet registration'],
  ['H2', 'Stage-one signals'],
  ['H3', 'Stage-one tie-break'],
  ['H4', 'Stage-two intent'],
  ['H5', 'Stage-two inventory'],
  ['H6', 'Advisor vocabulary'],
  ['H7', 'Human-facing contract'],
  ['H8', 'Doctor metadata'],
  ['H9', 'Leaf manifest'],
  ['H10', 'Projection maps and scorer'],
  ['H11', 'Command mirrors'],
];

// Which surfaces a CI gate covers. The report repeats this so a green result is
// never read as integration: half the table has no gate behind it.
const HUB_GATE_COVERAGE = {
  covered: ['H1', 'H2', 'H3', 'H9', 'H11'],
  nameOnly: ['H7'],
  ungated: ['H4', 'H5', 'H6', 'H8', 'H10'],
};

function addHubRow(rows, row, status, detail, evidence) {
  rows.push({
    row,
    label: HUB_ROW_LABELS.find(([id]) => id === row)[1],
    status,
    detail,
    evidence,
  });
}

// Evidence names either the command a row ran or the file it read, so a reader
// can repeat the probe rather than trust the verdict.
function displayPath(target, context) {
  const relative = path.relative(context.repoRoot, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return target;
  return relative;
}

// A row that folds in a hub-wide checker is only as good as that checker's verdict.
// Its confirming PASS line is the proof the checker reached the invariant; a checker
// that stopped earlier prints no FAIL either, so its silence is unanswered, not green.
function hubInvariantVerdict(parentCheck, patterns, confirmations = []) {
  if (!parentCheck.ran) {
    return {
      status: 'UNKNOWN',
      detail: parentCheck.reason
        ? `parent-skill-check.cjs could not run: ${parentCheck.reason}`
        : 'parent-skill-check.cjs could not run, so this row was not inferred.',
      unresolved: true,
    };
  }
  const failures = surface.invariantFailures(parentCheck.entries, patterns);
  if (failures.length > 0) {
    const [first] = failures;
    const more = failures.length > 1 ? ` (and ${failures.length - 1} more)` : '';
    return { status: 'FINDING', detail: `${first.id}: ${first.message}${more}` };
  }
  const missing = confirmations.filter((pattern) => !surface.invariantPasses(parentCheck.entries, pattern));
  if (missing.length > 0) {
    return {
      status: 'UNKNOWN',
      detail: `parent-skill-check.cjs printed no PASS for ${missing.join(' and ')}, so this row was not confirmed.`,
      unresolved: true,
    };
  }
  return null;
}

function withInvariantFailure(probe, parentCheck, patterns) {
  const failure = hubInvariantVerdict(parentCheck, patterns);
  if (!failure) return probe;
  const detail = probe.status === 'N/A' ? failure.detail : `${failure.detail} ${probe.detail}`;
  return { status: failure.status, detail, unresolved: failure.unresolved };
}

function hubReportSubject(parsed, hub, modes, context) {
  if (parsed.target === null || parsed.target === undefined) return { root: null, name: null };
  const value = String(parsed.target).trim();
  let root = null;
  let workflowMode = null;
  let unresolved = null;
  try {
    root = surface.resolveSkillTarget(value, context);
  } catch (error) {
    unresolved = error;
  }
  if (root === null) {
    // A mode may be named by its workflowMode while its packet folder carries a
    // different name, so the hub registry resolves it before the target fails.
    const bare = !value.includes('/') && !value.includes('\\') && !path.isAbsolute(value);
    const registered = bare
      ? modes.find((entry) => entry.workflowMode === value || entry.packet === value)
      : null;
    const candidate = registered && typeof registered.packet === 'string'
      ? path.join(hub.root, registered.packet)
      : null;
    const candidateSkill = candidate ? surface.readSkillFields(candidate, context.fs) : null;
    root = candidateSkill && candidateSkill.text !== null ? candidate : null;
    if (root === null) throw unresolved;
    // The registry entry decides which mode was asked for. Two modes may register one
    // packet, and the packet name cannot tell them apart.
    if (registered && typeof registered.workflowMode === 'string' && registered.workflowMode) {
      workflowMode = registered.workflowMode;
    }
  }
  if (surface.isReservedSkillName(path.basename(root))) {
    throw new surface.CheckError(
      'PRIVATE_ROOT_REFUSED',
      'A private root is refused because every gate skips the roots carrying its prefix.',
    );
  }
  const skill = surface.readSkillFields(root, context.fs);
  return { root, name: skill.fields.name || path.basename(root), workflowMode };
}

function loadRouterParser(context) {
  try {
    return { parse: require(context.paths.routerReplay).parseRouter, reason: null };
  } catch (error) {
    return { parse: null, reason: firstLine(error && error.message) };
  }
}

function runHubGapReport(parsed, context) {
  const hub = surface.resolveHubTarget(parsed.intoHub, context);
  const hubPath = displayPath(hub.root, context);
  const parentCommand = `node ${displayPath(context.paths.parentSkillCheck, context)} ${hubPath}`;
  const readEvidence = (file, fields) => `read ${displayPath(path.join(hub.root, file), context)} (${fields})`;

  const registry = surface.readJsonFile(path.join(hub.root, 'mode-registry.json'), context.fs);
  const hubRouter = surface.readJsonFile(path.join(hub.root, 'hub-router.json'), context.fs) || {};
  const graphMetadata = surface.readJsonFile(path.join(hub.root, 'graph-metadata.json'), context.fs);
  const description = surface.readJsonFile(path.join(hub.root, 'description.json'), context.fs);
  const leafManifest = surface.readJsonFile(path.join(hub.root, 'leaf-manifest.json'), context.fs);
  const skillDoc = surface.readTextFile(path.join(hub.root, 'SKILL.md'), context.fs);
  const stageTwo = surface.readHubStageTwo(hub.root, context);
  const modes = registry && Array.isArray(registry.modes)
    ? registry.modes.filter((mode) => mode && typeof mode === 'object')
    : [];
  const modeIds = modes.map((mode) => mode.workflowMode).filter((id) => typeof id === 'string' && id);
  const packets = [...new Set(modes.map(surface.modePacketName).filter((packet) => typeof packet === 'string' && packet))];
  const subject = hubReportSubject(parsed, hub, modes, context);
  const mode = subject.name ? surface.findHubMode(modes, subject.workflowMode || subject.name, subject.root) : null;
  const subjectToken = mode ? mode.workflowMode : subject.name;
  const unregistered = Boolean(subjectToken && !mode);
  const hubId = (registry && typeof registry.skill === 'string' && registry.skill)
    || (typeof hubRouter.skill === 'string' && hubRouter.skill)
    || hub.name;
  const vocabulary = mode ? surface.hubModeVocabulary(mode, hubRouter) : null;
  const routingClass = mode && mode.advisorRouting && typeof mode.advisorRouting === 'object'
    ? mode.advisorRouting.routingClass || null
    : null;
  const replayCommand = vocabulary && vocabulary.phrase
    ? `node ${displayPath(context.paths.compiledRoute, context)} --hub ${hubId} --prompt "${vocabulary.phrase}"`
    : null;

  const parentCheck = surface.runParentSkillCheck(hub.root, context);
  const routerParser = loadRouterParser(context);
  const rows = [];
  const unverified = [];

  // H1: the registry entry. An unregistered skill fails here whatever the hub's
  // own invariants say, because nothing routes to a mode the registry omits.
  if (subject.name && !mode) {
    addHubRow(rows, 'H1', 'FINDING',
      `${subject.name} is not registered in mode-registry.json, so nothing routes to it.`,
      readEvidence('mode-registry.json', 'modes'));
  } else {
    const failure = hubInvariantVerdict(parentCheck, ['3*'], ['3a', '3b']);
    if (failure) {
      if (failure.unresolved) unverified.push(failure.detail);
      addHubRow(rows, 'H1', failure.status, failure.detail, parentCommand);
    } else if (mode) {
      const kind = typeof mode.packetKind === 'string' ? mode.packetKind : 'no packetKind';
      addHubRow(rows, 'H1', 'PASS',
        `Registered as ${mode.workflowMode} (${kind}); its packet resolves and the registry invariants pass.`,
        parentCommand);
    } else {
      addHubRow(rows, 'H1', 'PASS',
        `mode-registry.json declares ${modeIds.length} mode(s), and the registry invariants pass.`,
        parentCommand);
    }
  }

  // H2: stage-one selection. The routerSignals entry is a direct read; the
  // compiled replay proves the hub actually selects the mode for its own phrase.
  const signals = hubRouter.routerSignals && typeof hubRouter.routerSignals === 'object'
    ? hubRouter.routerSignals
    : null;
  if (subject.name && !mode) {
    addHubRow(rows, 'H2', 'FINDING',
      `hub-router.json routerSignals has no entry for ${subject.name}; the hub never selects it.`,
      readEvidence('hub-router.json', 'routerSignals'));
  } else if (mode && (!signals || !signals[mode.workflowMode])) {
    addHubRow(rows, 'H2', 'FINDING',
      `hub-router.json routerSignals has no entry for ${mode.workflowMode}; the hub never selects it.`,
      readEvidence('hub-router.json', 'routerSignals'));
  } else {
    const failure = hubInvariantVerdict(parentCheck, ['5a', '5b'], ['5b']);
    if (failure) {
      if (failure.unresolved) unverified.push(failure.detail);
      addHubRow(rows, 'H2', failure.status, failure.detail, parentCommand);
    } else if (!mode) {
      addHubRow(rows, 'H2', 'PASS',
        `routerSignals keys match the registry's ${modeIds.length} mode(s); no phrase was replayed because no mode was named.`,
        parentCommand);
    } else {
      const replay = surface.runCompiledRoute(hubId, vocabulary.phrase, context);
      if (replay.state === 'error') {
        unverified.push(replay.detail);
        addHubRow(rows, 'H2', 'UNKNOWN', replay.detail, replayCommand);
      } else if (replay.state === 'legacy') {
        addHubRow(rows, 'H2', 'UNKNOWN',
          `${replay.detail} The stage-one replay was not inferred from the legacy path.`,
          replayCommand);
      } else {
        const selected = replay.targets.some((target) => target && target.workflowMode === mode.workflowMode);
        if (replay.state === 'route' && selected) {
          addHubRow(rows, 'H2', 'PASS',
            `routerSignals covers ${mode.workflowMode}, and the compiled route selects it for "${vocabulary.phrase}".`,
            replayCommand);
        } else {
          addHubRow(rows, 'H2', 'FINDING',
            `${mode.workflowMode} was not selected for its own phrase "${vocabulary.phrase}" (action: ${replay.state}).`,
            replayCommand);
        }
      }
    }
  }

  // H3: tie-break order. It permutes registered modes, so an unregistered skill
  // has nothing to place yet.
  if (subject.name && !mode) {
    addHubRow(rows, 'H3', 'N/A',
      'The tie-break order permutes registered modes, so it applies once the mode is registered.',
      readEvidence('hub-router.json', 'routerPolicy.tieBreak'));
  } else {
    const failure = hubInvariantVerdict(parentCheck, ['5a', '5e', '5i'], ['5e', '5i']);
    if (failure) {
      if (failure.unresolved) unverified.push(failure.detail);
      addHubRow(rows, 'H3', failure.status, failure.detail, parentCommand);
    } else {
      addHubRow(rows, 'H3', 'PASS',
        `routerPolicy.tieBreak is an exact permutation of the ${modeIds.length} registered mode(s) and orders workflow modes first.`,
        parentCommand);
    }
  }

  // H4: stage two. The document keys must stay equal, and an intent must load the
  // mode's own packet leaves or the selection loads nothing.
  if (unregistered) {
    addHubRow(rows, 'H4', 'N/A',
      'Stage two maps a registered mode to its leaves, so it applies once the mode is registered.',
      readEvidence('ROUTER.md', 'INTENT_SIGNALS, RESOURCE_MAP'));
  } else if (!routerParser.parse) {
    const detail = `The router parser could not load${routerParser.reason ? `: ${routerParser.reason}` : '.'}`;
    unverified.push(detail);
    addHubRow(rows, 'H4', 'UNKNOWN', detail, readEvidence('ROUTER.md', 'INTENT_SIGNALS, RESOURCE_MAP'));
  } else {
    let routerView = null;
    let routerReason = null;
    try {
      routerView = routerParser.parse(null, hub.root);
    } catch (error) {
      routerReason = firstLine(error && error.message);
    }
    if (routerReason) {
      addHubRow(rows, 'H4', 'FINDING', `Router parsing failed: ${routerReason}`,
        readEvidence('ROUTER.md', 'INTENT_SIGNALS, RESOURCE_MAP'));
    } else {
      const probe = surface.stageTwoIntentProbe({ mode, stageTwo, parsedRouter: routerView });
      addHubRow(rows, 'H4', probe.status, probe.detail, readEvidence('ROUTER.md', 'INTENT_SIGNALS, RESOURCE_MAP'));
    }
  }

  // H5: the full-toolkit intent, where the hub declares one.
  const inventory = unregistered
    ? { status: 'N/A', detail: 'FULL_INVENTORY covers a registered mode, so it applies once the mode is registered.' }
    : surface.stageTwoInventoryProbe({ mode, stageTwo });
  addHubRow(rows, 'H5', inventory.status, inventory.detail, readEvidence('ROUTER.md', 'FULL_INVENTORY'));

  // H6: the advisor vocabulary the hub is surfaced on. The vocabulary-parity
  // invariants belong to the same surface.
  const vocabularyProbe = unregistered
    ? { status: 'N/A', detail: 'The hub vocabulary is scoped to a registered mode, so it applies once the mode is registered.' }
    : withInvariantFailure(
      surface.hubVocabularyProbe({ mode, vocabulary, graphMetadata }),
      parentCheck,
      ['5k-*'],
    );
  if (vocabularyProbe.unresolved) unverified.push(vocabularyProbe.detail);
  addHubRow(rows, 'H6', vocabularyProbe.status, vocabularyProbe.detail,
    readEvidence('graph-metadata.json', 'intent_signals, derived.trigger_phrases'));

  // H7: the hub SKILL.md mode table, the runtime's fallback discovery surface.
  const tableProbe = withInvariantFailure(
    surface.hubModeTableProbe({ skillText: skillDoc, modeIds, packets, subject: subjectToken }),
    parentCheck,
    ['6b', '6c'],
  );
  if (tableProbe.unresolved) unverified.push(tableProbe.detail);
  addHubRow(rows, 'H7', tableProbe.status, tableProbe.detail, readEvidence('SKILL.md', 'mode table'));

  // H8: what the hub advertises in doctor metadata.
  const descriptionProbe = withInvariantFailure(
    surface.hubDescriptionProbe({ description, subject: subjectToken }),
    parentCheck,
    ['8a', '8b'],
  );
  if (descriptionProbe.unresolved) unverified.push(descriptionProbe.detail);
  addHubRow(rows, 'H8', descriptionProbe.status, descriptionProbe.detail,
    readEvidence('description.json', 'keywords, description'));

  // H9: the leaf manifest. It is generated, so a missing mode entry is a
  // regeneration, never a hand edit.
  const manifestModes = leafManifest && Array.isArray(leafManifest.modes)
    ? leafManifest.modes.map((entry) => entry && entry.workflowMode).filter(Boolean)
    : [];
  if (!leafManifest) {
    addHubRow(rows, 'H9', 'FINDING',
      'leaf-manifest.json is missing or unreadable; regenerate it rather than hand-editing.',
      readEvidence('leaf-manifest.json', 'modes'));
  } else if (subject.name && !mode) {
    addHubRow(rows, 'H9', 'N/A',
      'The leaf manifest lists registered packets, so it applies once the mode is registered.',
      readEvidence('leaf-manifest.json', 'modes'));
  } else if (mode && !manifestModes.includes(mode.workflowMode)) {
    addHubRow(rows, 'H9', 'FINDING',
      `leaf-manifest.json has no entry for ${mode.workflowMode}; regenerate it rather than hand-editing.`,
      readEvidence('leaf-manifest.json', 'modes'));
  } else {
    const failure = hubInvariantVerdict(parentCheck, ['10*'], ['10a-manifest-source', '10b-byte-drift']);
    if (failure) {
      if (failure.unresolved) unverified.push(failure.detail);
      addHubRow(rows, 'H9', failure.status, failure.detail, parentCommand);
    } else {
      addHubRow(rows, 'H9', 'PASS',
        `leaf-manifest.json covers ${manifestModes.length} mode(s) and its freshness invariants pass.`,
        `${parentCommand}; ${readEvidence('leaf-manifest.json', 'modes')}`);
    }
  }

  // H10: projection maps and the scorer, for a non-metadata mode only.
  if (!mode) {
    addHubRow(rows, 'H10', 'N/A',
      unregistered
        ? 'No registered mode is scoped, so there is no projection entry to check.'
        : 'No skill or mode was named, so no projection entry is scoped.',
      readEvidence('mode-registry.json', 'advisorRouting'));
  } else if (routingClass === 'metadata') {
    addHubRow(rows, 'H10', 'N/A',
      'A metadata-routed mode needs no projection map or scorer entry; the advisor resolves it by hub membership.',
      readEvidence('mode-registry.json', 'advisorRouting.routingClass'));
  } else if (!routingClass) {
    addHubRow(rows, 'H10', 'UNKNOWN',
      `The registry declares no advisorRouting.routingClass for ${mode.workflowMode}, so the projection maps cannot be scoped.`,
      readEvidence('mode-registry.json', 'advisorRouting'));
  } else {
    const advisorCommand = `python3 ${displayPath(context.paths.advisorScorer, context)} "${vocabulary.phrase}" --threshold 0.5`;
    const probe = surface.runAdvisorProjection(vocabulary.phrase, context);
    if (probe.state === 'error') {
      unverified.push(probe.detail);
      addHubRow(rows, 'H10', 'UNKNOWN', probe.detail, advisorCommand);
    } else if (probe.state === 'unavailable') {
      addHubRow(rows, 'H10', 'UNKNOWN', probe.detail, advisorCommand);
    } else {
      const advisorIds = [...new Set([hubId, mode.advisorRouting.legacyAdvisorId].filter(Boolean))];
      const hit = advisorIds.find((id) => probe.ids.has(id));
      if (hit) {
        addHubRow(rows, 'H10', 'PASS',
          `The scorer surfaced ${hit} for "${vocabulary.phrase}" among ${probe.count} recommendation(s).`,
          advisorCommand);
      } else {
        addHubRow(rows, 'H10', 'FINDING',
          `The scorer returned ${probe.count} recommendation(s) and none named ${advisorIds.join(' or ')} for "${vocabulary.phrase}".`,
          advisorCommand);
      }
    }
  }

  // H11: the command mirrors every runtime reads its commands from.
  const mirrors = surface.runMirrorChecks(context);
  const mirrorCommand = [
    `bash ${displayPath(context.paths.commandTreeParity, context)}`,
    `node ${displayPath(context.paths.codexPromptSync, context)} --check`,
    `node ${displayPath(context.paths.piPromptSync, context)} --check`,
  ].join('; ');
  if (mirrors.broken.length) {
    const detail = `A mirror checker could not run: ${mirrors.broken.map((entry) => `${entry.label}${entry.reason ? ` (${entry.reason})` : ''}`).join(', ')}.`;
    unverified.push(detail);
    addHubRow(rows, 'H11', 'UNKNOWN', detail, mirrorCommand);
  } else if (mirrors.drifted.length) {
    addHubRow(rows, 'H11', 'FINDING',
      `Mirror drift: ${mirrors.drifted.map((entry) => entry.label).join(', ')}.`,
      mirrorCommand);
  } else {
    addHubRow(rows, 'H11', 'PASS',
      'Command-tree parity, the Codex prompt mirrors and the Pi prompt mirrors are all in sync.',
      mirrorCommand);
  }

  const findingCount = rows.filter((row) => row.status === 'FINDING').length;
  const unknownCount = rows.filter((row) => row.status === 'UNKNOWN').length;
  const naCount = rows.filter((row) => row.status === 'N/A').length;
  // A checker that could not run leaves the report incomplete, so it outranks a
  // finding: exit 2 says the table is unfinished, never that the hub failed.
  const exitCode = unverified.length ? 2 : findingCount ? 1 : 0;

  return {
    mode: 'hub',
    skill: subjectToken ? displayName(subjectToken, subject.root || hub.root) : null,
    hub: surface.safeSkillName(hub.name),
    hubPath,
    routingClass,
    findingCount,
    unknownCount,
    naCount,
    unverified: [...new Set(unverified)],
    gates: HUB_GATE_COVERAGE,
    exitCode,
    rows,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ARGUMENTS AND RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function parseArguments(argv) {
  const args = { target: null, json: false, intoHub: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--json') {
      if (args.json) throw new surface.CheckError('USAGE', 'Option --json was specified more than once.');
      args.json = true;
    } else if (token === '--into-hub' || token.startsWith('--into-hub=')) {
      if (args.intoHub !== null) throw new surface.CheckError('USAGE', 'Option --into-hub was specified more than once.');
      // The inline form names the hub as its own value, so it consumes no next token.
      const inline = token === '--into-hub' ? null : token.slice('--into-hub='.length);
      const value = inline === null ? argv[index + 1] : inline;
      if (value === undefined || value === '' || value.startsWith('-')) {
        throw new surface.CheckError('USAGE', 'Option --into-hub needs a hub name or path.');
      }
      args.intoHub = value;
      if (inline === null) index += 1;
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

function renderHubText(report) {
  const subject = report.skill || 'hub';
  const classSuffix = report.routingClass ? ` (${report.routingClass})` : '';
  const lines = [`Hub gap report: ${subject} into ${report.hub}${classSuffix}`, ''];
  for (const row of report.rows) {
    lines.push(`${row.row.padEnd(4)}${row.status.padEnd(8)} ${row.label}: ${row.detail}`);
    lines.push(`     Evidence: ${row.evidence}`);
  }
  const passed = report.rows.length - report.findingCount - report.unknownCount - report.naCount;
  lines.push('');
  lines.push(`Rows: ${report.rows.length}; ${passed} pass, ${report.findingCount} finding(s), ${report.unknownCount} unknown, ${report.naCount} n/a`);
  lines.push(
    `A green gate is not integration. No CI gate covers rows ${report.gates.ungated.join(', ')}; ${report.gates.nameOnly.join(', ')} is checked by name only.`,
  );
  // An unfinished table is not a verdict on the hub, so the text names every probe
  // that could not answer and closes on INCOMPLETE, exactly as the JSON does.
  if (report.exitCode === 2) {
    for (const entry of report.unverified) lines.push(`Unverified: ${entry}`);
    lines.push('Result: INCOMPLETE');
  } else {
    lines.push(resultText(report));
  }
  return `${lines.join('\n')}\n`;
}

function runCheck(argv = process.argv.slice(2), options = {}) {
  const context = options.context || surface.createContext(options.contextOptions || {});
  const stdout = options.stdout || context.stdout;
  const stderr = options.stderr || context.stderr;
  try {
    const [command, ...rest] = argv[0] === 'check' ? argv : ['check', ...argv];
    if (command !== 'check') {
      throw new surface.CheckError('USAGE', 'Usage: sk-skill-check.cjs check [<name-or-path>] [--json] [--into-hub <hub>]');
    }
    const parsed = parseArguments(rest);
    const report = parsed.intoHub !== null
      ? runHubGapReport(parsed, context)
      : parsed.target === null
        ? runFleet(context)
        : checkNamedSkill(surface.resolveSkillTarget(parsed.target, context), context);
    if (parsed.json) stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    else if (report.mode === 'hub') stdout.write(renderHubText(report));
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
  renderHubText,
  runCheck,
  runFleet,
  runHubGapReport,
};

if (require.main === module) process.exitCode = main(process.argv.slice(2));
