// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders — core A
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { PACKET, sandbox, copy, runUpgrade, validate, validateJson, downgradeRows, manifest, upgradeManifestPath, clearUpgradeManifest, resetSandbox, commitChanges, writeLegacyPacket, nestedQuestionsSpec, setupSandbox, teardownSandbox } from './helpers/upgrade-legacy-harness';

beforeAll(setupSandbox, 180_000);
afterAll(teardownSandbox);

describe('upgrade-legacy', () => {
  afterEach(resetSandbox);

  it('exits 0 on an empty specs tree and says it found nothing', () => {
    const result = runUpgrade([]);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('no spec folders found');
  }, 180_000);

  it('dirty-tree-unwritable-manifest', () => {
    writeLegacyPacket();
    const realGit = (process.env.PATH || '').split(path.delimiter)
      .map((directory) => path.join(directory, 'git'))
      .find((candidate) => fs.existsSync(candidate));
    expect(realGit).toBeDefined();
    const shimDirectory = path.join(sandbox, 'git-shim');
    fs.mkdirSync(shimDirectory, { recursive: true });
    const gitShim = path.join(shimDirectory, 'git');
    fs.writeFileSync(gitShim, [
      '#!/bin/sh',
      'if [ "$1" = "-C" ] && [ "$3" = "rev-parse" ] && [ "$4" = "--absolute-git-dir" ]; then',
      '  printf "/dev/null\\n"',
      '  exit 0',
      'fi',
      'exec "$UPGRADE_REAL_GIT" "$@"',
      '',
    ].join('\n'));
    fs.chmodSync(gitShim, 0o755);
    const before = manifest(PACKET);
    try {
      const result = runUpgrade(['--apply', '--roots', PACKET], {
        PATH: `${shimDirectory}${path.delimiter}${process.env.PATH || ''}`,
        UPGRADE_REAL_GIT: realGit,
      });
      expect(result.status, result.stdout + result.stderr).toBe(2);
      expect(`${result.stdout}${result.stderr}`).toContain('/dev/null/upgrade-legacy.manifest.json');
      expect(`${result.stdout}${result.stderr}`).toContain('could not write reversibility manifest');
      expect(manifest(PACKET)).toBe(before);
    } finally {
      fs.rmSync(shimDirectory, { force: true, recursive: true });
    }
  }, 180_000);

  it('reports a failing legacy packet on a dry run and writes nothing', () => {
    writeLegacyPacket();
    const before = manifest();
    const result = runUpgrade([]);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stdout, result.stdout + result.stderr).toContain(`failing ${PACKET}`);
    expect(result.stdout, result.stdout + result.stderr).toContain('\nDowngrades:\n');
    expect(result.stdout, result.stdout + result.stderr).toContain('error -> warning');
    expect(manifest()).toBe(before);
  }, 180_000);

  it('dry run repairs a symlinked packet document only inside the preview', () => {
    const folder = 'specs/symlink-preview/001-packet';
    fs.rmSync(upgradeManifestPath(), { force: true });
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const specFile = path.join(packetFolder, 'spec.md');
    const outsideTarget = path.join(sandbox, 'outside-preview-target.md');
    const targetBytes = fs.readFileSync(specFile);
    fs.writeFileSync(outsideTarget, targetBytes);
    fs.rmSync(specFile);
    fs.symlinkSync(outsideTarget, specFile);

    try {
      const result = runUpgrade(['--roots', folder]);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(fs.readFileSync(outsideTarget)).toEqual(targetBytes);
      expect(fs.readlinkSync(specFile)).toBe(outsideTarget);
    } finally {
      fs.rmSync(packetFolder, { recursive: true, force: true });
      fs.rmSync(outsideTarget, { force: true });
    }
  }, 180_000);

  it('previews a packet whose link points at its own ancestor without following it', () => {
    const folder = 'specs/link-loop/001-packet';
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const loopLink = path.join(packetFolder, 'research/lineages/sol/.reducer-spec/research');
    fs.mkdirSync(path.dirname(loopLink), { recursive: true });
    fs.symlinkSync('..', loopLink);
    const outsideTarget = path.join(sandbox, 'outside-preview-target.md');
    const outsideBytes = 'bytes outside the packet\n';
    fs.writeFileSync(outsideTarget, outsideBytes);
    const outsideLink = path.join(packetFolder, 'research/outside-link.md');
    fs.symlinkSync(outsideTarget, outsideLink);

    try {
      const result = runUpgrade(['--roots', folder]);
      // A copy that followed the link would recurse until ENAMETOOLONG and stop
      // the whole dry run, and a copy that followed the outside link would read
      // a file the packet does not own.
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(fs.readlinkSync(loopLink)).toBe('..');
      expect(fs.readlinkSync(outsideLink)).toBe(outsideTarget);
      expect(fs.readFileSync(outsideTarget, 'utf8')).toBe(outsideBytes);
      expect(`${result.stdout}${result.stderr}`).toContain('symbolic link, not followed');
    } finally {
      fs.rmSync(packetFolder, { recursive: true, force: true });
      fs.rmSync(outsideTarget, { force: true });
    }
  }, 180_000);

  // A relative link inside the packet is content the packet owns, so the
  // preview materializes its target; a link whose target contains the link
  // itself is still refused without following it.
  it('keeps an in-packet relative link in the preview and still refuses a self-referential one', () => {
    const folder = 'specs/preview-links/001-packet';
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const source = path.join(packetFolder, 'sources', 'plan-source.md');
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.renameSync(path.join(packetFolder, 'plan.md'), source);
    const relativeLink = path.join('sources', 'plan-source.md');
    fs.symlinkSync(relativeLink, path.join(packetFolder, 'plan.md'));
    const loopLink = path.join(packetFolder, 'research', 'self');
    fs.mkdirSync(path.dirname(loopLink), { recursive: true });
    fs.symlinkSync('..', loopLink);
    const sourceBytes = fs.readFileSync(source);

    try {
      const result = runUpgrade(['--roots', folder]);
      const output = result.stdout + result.stderr;
      expect(result.status, output).toBe(1);
      expect(output).not.toContain('plan.md: symbolic link, not followed');
      expect(output).toContain('research/self: symbolic link, not followed');
      expect(fs.readlinkSync(path.join(packetFolder, 'plan.md'))).toBe(relativeLink);
      expect(fs.readFileSync(source)).toEqual(sourceBytes);
    } finally {
      fs.rmSync(packetFolder, { recursive: true, force: true });
    }
  }, 180_000);

  it('dry-run Downgrades match the baseline recorded by apply', () => {
    writeLegacyPacket();
    const specFile = path.join(sandbox, PACKET, 'spec.md');
    fs.appendFileSync(specFile, '\nSee [missing preview target](./preview-missing.md).\n');
    const before = validateJson(PACKET);
    expect(before.stdout, before.stdout + before.stderr).not.toBe('');
    const beforeReport = JSON.parse(before.stdout);
    expect(beforeReport.summary.errors).toBeGreaterThan(0);
    const dryRun = runUpgrade(['--roots', PACKET]);
    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(1);

    const applied = runUpgrade(['--apply', '--roots', PACKET]);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    const baseline = JSON.parse(fs.readFileSync(path.join(sandbox, PACKET, 'upgrade-baseline.json'), 'utf8'));
    const expectedRows = baseline.findings.map((finding: { rule: string; detail: string }) =>
      `${PACKET} | ${finding.rule} | error -> warning${finding.detail ? ` | ${finding.detail.replace(/\s+/gu, ' ').trim()}` : ''}`,
    ).sort();
    expect(downgradeRows(dryRun.stdout)).toEqual(expectedRows);

    const beforeErrors = beforeReport.entries
      .filter((entry: { status: string }) => entry.status === 'error')
      .flatMap((entry: { rule: string; details: string[]; message: string }) =>
        (entry.details.length > 0 ? entry.details : [entry.message]).map((detail) => ({ rule: entry.rule, detail })),
      );
    const baselineKeys = new Set(baseline.findings.map((finding: { rule: string; detail: string }) => `${finding.rule}\0${finding.detail}`));
    const filledFrontmatterErrors = beforeErrors.filter(({ rule, detail }: { rule: string; detail: string }) =>
      rule === 'GREP_CONVENTION' && /path=(?:plan|tasks)\.md/u.test(detail),
    );
    expect(filledFrontmatterErrors.length).toBeGreaterThan(0);
    expect(filledFrontmatterErrors.every(({ rule, detail }: { rule: string; detail: string }) =>
      !baselineKeys.has(`${rule}\0${detail}`),
    )).toBe(true);
    expect(beforeErrors.some(({ rule, detail }: { rule: string; detail: string }) =>
      detail.includes('preview-missing.md') && baselineKeys.has(`${rule}\0${detail}`),
    )).toBe(true);
  }, 180_000);

  it('repairs with --apply, records what remains and leaves the packet passing', () => {
    writeLegacyPacket();
    const result = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit/001-legacy-packet']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('after=1/1');

    const baseline = JSON.parse(fs.readFileSync(path.join(sandbox, PACKET, 'upgrade-baseline.json'), 'utf8'));
    expect(baseline.schema).toBe(1);
    expect(baseline.findings.length).toBeGreaterThanOrEqual(1);
    // A finding the validator never downgrades in an active packet would only
    // mislead in the baseline, so the recorder must leave it out.
    expect(baseline.findings.map((finding: { rule: string }) => finding.rule)).not.toContain('GENERATED_METADATA_INTEGRITY');

    const check = validate(PACKET);
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  it('still fails validation on a fresh mistake beside recorded findings', () => {
    writeLegacyPacket();
    const applied = runUpgrade(['--apply', '--roots', PACKET]);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    fs.appendFileSync(path.join(sandbox, PACKET, 'spec.md'), '\nSee [missing](./does-not-exist.md).\n');
    const check = validate(PACKET);
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: FAILED');
    expect(check.stdout, check.stdout + check.stderr).toMatch(/^x SPEC_DOC_INTEGRITY/m);
  }, 180_000);

  it('refuses a root outside the repository', () => {
    const result = runUpgrade(['--roots', os.tmpdir()]);
    expect(result.status, result.stdout + result.stderr).toBe(2);
  }, 180_000);

  it('refuses a --roots argument with a ".." segment, before it resolves, and writes nothing', () => {
    writeLegacyPacket();
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    fs.mkdirSync(path.join(outsideDir, 'deep'));
    fs.symlinkSync(path.join(outsideDir, 'deep'), path.join(sandbox, 'linkOut'), 'dir');
    const before = manifest();

    try {
      const result = runUpgrade(['--apply', '--roots', 'linkOut/../specs']);
      const output = result.stdout + result.stderr;
      expect(output).toContain('".." segment');
      expect(result.status, output).toBe(2);
      expect(manifest()).toBe(before);
    } finally {
      fs.rmSync(path.join(sandbox, 'linkOut'), { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  it('fills missing frontmatter keys and keeps an authored title as written', () => {
    clearUpgradeManifest();
    const folder = 'specs/fm-track/001-authored';
    writeLegacyPacket(folder);
    const authored = '---\ntitle: "Authored Title Kept As Written"\ndescription: "An authored description."\n';
    const body = '# Authored Title Kept As Written\n\nOld packet written before the v4 contract.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'spec.md'), `${authored}---\n${body}`);
    const goalAuthored = '---\ntitle: "Authored Goal"\ndescription: "An authored goal."\n';
    const goalBody = '# Goal: Authored\n\nOne line of authored prose.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'goal.md'), `${goalAuthored}---\n${goalBody}`);
    const tasksAuthored = '---\ntitle: "Authored Tasks"\ndescription: "An authored task list."\nimportance_tier: "critical"\n';
    const tasksBody = '# Tasks\n\n- [ ] T001 Authored task\n';
    fs.writeFileSync(path.join(sandbox, folder, 'tasks.md'), `${tasksAuthored}---\n${tasksBody}`);
    // The addon docs arrive in different states: one with no block at all and
    // one whose block already carries an authored tier, so the fill has to
    // supply a whole block for the first and only the missing key for the second.
    const acceptanceBody = '# Acceptance Criteria\n\nLegacy criteria written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'acceptance-criteria.md'), acceptanceBody);
    // The spec-doc classes below carry only title and description, so the fill
    // has to supply both managed value keys from each class's template.
    const summaryAuthored = '---\ntitle: "Authored Implementation Summary"\ndescription: "An authored implementation summary."\n';
    const summaryBody = '# Implementation Summary\n\nLegacy summary written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'implementation-summary.md'), `${summaryAuthored}---\n${summaryBody}`);
    const decisionAuthored = '---\ntitle: "Authored Decision Record"\ndescription: "An authored decision record."\n';
    const decisionBody = '# Decision Record\n\nLegacy decision written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'decision-record.md'), `${decisionAuthored}---\n${decisionBody}`);
    const researchAuthored = '---\ntitle: "Authored Research"\ndescription: "An authored investigation."\n';
    const researchBody = '# Research\n\nLegacy research written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'research.md'), `${researchAuthored}---\n${researchBody}`);
    const handoverAuthored = '---\ntitle: "Authored Handover"\ndescription: "An authored handover."\n';
    const handoverBody = '# Handover\n\nLegacy handover written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'handover.md'), `${handoverAuthored}---\n${handoverBody}`);
    // resource-map.md is a legacy packet-root document the spec-doc set does not hold and no
    // template maps, so the fill passes it over; the whole-file comparison below is what pins
    // that rather than a rewritten key.
    const resourceMapAuthored = '---\ntitle: "Authored Resource Map"\ndescription: "An authored resource map."\nimportance_tier: "critical"\n';
    const resourceMapBody = '# Resource Map\n\nLegacy map written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'resource-map.md'), `${resourceMapAuthored}---\n${resourceMapBody}`);
    // A missing key takes the value its document class's template declares, so
    // the expectations are read from the copied templates; the literal checks
    // fail here first if a template's defaults change.
    const templateDefaults = (relative: string) => {
      const lines = fs.readFileSync(path.join(copy, 'templates', relative), 'utf8').replace(/\r/g, '').split('\n');
      const opening = lines.findIndex((line) => line.trim() === '---');
      const closing = lines.findIndex((line, index) => index > opening && line.trim() === '---');
      const frontmatter = lines.slice(opening + 1, closing);
      const value = (key: string): string => {
        const match = frontmatter.find((line) => line.trim().startsWith(`${key}:`))?.match(/:\s*"([^"]*)"/u);
        expect(match, `${relative} ${key}`).not.toBeNull();
        return match?.[1] ?? '';
      };
      return { importance_tier: value('importance_tier'), contextType: value('contextType') };
    };
    const specDefaults = templateDefaults('core/spec.md.tmpl');
    const planDefaults = templateDefaults('core/plan.md.tmpl');
    const tasksDefaults = templateDefaults('core/tasks.md.tmpl');
    const goalDefaults = templateDefaults('addons/goal.md.tmpl');
    const acceptanceDefaults = templateDefaults('addons/acceptance-criteria.md.tmpl');
    const summaryDefaults = templateDefaults('core/implementation-summary.md.tmpl');
    const decisionDefaults = templateDefaults('addons/decision-record.md.tmpl');
    const researchDefaults = templateDefaults('addons/research.md.tmpl');
    const handoverDefaults = templateDefaults('addons/handover.md.tmpl');
    expect(specDefaults.importance_tier).toBe('normal');
    expect(specDefaults.contextType).toBe('general');
    expect(planDefaults.importance_tier).toBe('normal');
    expect(planDefaults.contextType).toBe('general');
    expect(tasksDefaults.contextType).toBe('general');
    expect(goalDefaults.importance_tier).toBe('important');
    expect(goalDefaults.contextType).toBe('planning');
    expect(acceptanceDefaults.importance_tier).toBe('important');
    expect(acceptanceDefaults.contextType).toBe('implementation');
    expect(summaryDefaults.importance_tier).toBe('normal');
    expect(summaryDefaults.contextType).toBe('general');
    // The fill follows each class's template literal even where the
    // document-class tables disagree with it: implementation-summary and
    // research differ on the context type, the decision record on both values.
    expect(decisionDefaults.importance_tier).toBe('normal');
    expect(decisionDefaults.contextType).toBe('general');
    expect(researchDefaults.importance_tier).toBe('normal');
    expect(researchDefaults.contextType).toBe('general');
    expect(handoverDefaults.importance_tier).toBe('normal');
    expect(handoverDefaults.contextType).toBe('general');
    const result = runUpgrade(['--apply', '--roots', 'specs/fm-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    const spec = fs.readFileSync(path.join(sandbox, folder, 'spec.md'), 'utf8');
    expect(spec.startsWith(authored), spec).toBe(true);
    expect(spec, spec).toContain('importance_tier:');
    expect(spec, spec).toContain(`importance_tier: "${specDefaults.importance_tier}"`);
    expect(spec, spec).toContain(`contextType: "${specDefaults.contextType}"`);
    expect(spec.endsWith(body), spec).toBe(true);
    const plan = fs.readFileSync(path.join(sandbox, folder, 'plan.md'), 'utf8');
    expect(plan.startsWith('---\ntitle: '), plan).toBe(true);
    expect(plan, plan).toContain(`importance_tier: "${planDefaults.importance_tier}"`);
    expect(plan, plan).toContain(`contextType: "${planDefaults.contextType}"`);
    const goal = fs.readFileSync(path.join(sandbox, folder, 'goal.md'), 'utf8');
    expect(goal.startsWith(goalAuthored), goal).toBe(true);
    expect(goal, goal).toContain(`importance_tier: "${goalDefaults.importance_tier}"`);
    expect(goal, goal).toContain(`contextType: "${goalDefaults.contextType}"`);
    const tasks = fs.readFileSync(path.join(sandbox, folder, 'tasks.md'), 'utf8');
    // "critical" is a canonical tier, so the authored value survives the fill as written.
    expect(tasks.match(/importance_tier: "critical"/gu)?.length, tasks).toBe(1);
    expect(tasks, tasks).toContain(`contextType: "${tasksDefaults.contextType}"`);
    const acceptance = fs.readFileSync(path.join(sandbox, folder, 'acceptance-criteria.md'), 'utf8');
    expect(acceptance.startsWith('---\ntitle: '), acceptance).toBe(true);
    expect(acceptance, acceptance).toContain(`importance_tier: "${acceptanceDefaults.importance_tier}"`);
    expect(acceptance, acceptance).toContain(`contextType: "${acceptanceDefaults.contextType}"`);
    expect(acceptance.endsWith(acceptanceBody), acceptance).toBe(true);
    const summary = fs.readFileSync(path.join(sandbox, folder, 'implementation-summary.md'), 'utf8');
    expect(summary.startsWith(summaryAuthored), summary).toBe(true);
    expect(summary, summary).toContain(`importance_tier: "${summaryDefaults.importance_tier}"`);
    expect(summary, summary).toContain(`contextType: "${summaryDefaults.contextType}"`);
    expect(summary.endsWith(summaryBody), summary).toBe(true);
    const decision = fs.readFileSync(path.join(sandbox, folder, 'decision-record.md'), 'utf8');
    expect(decision.startsWith(decisionAuthored), decision).toBe(true);
    expect(decision, decision).toContain(`importance_tier: "${decisionDefaults.importance_tier}"`);
    expect(decision, decision).toContain(`contextType: "${decisionDefaults.contextType}"`);
    expect(decision.endsWith(decisionBody), decision).toBe(true);
    const research = fs.readFileSync(path.join(sandbox, folder, 'research.md'), 'utf8');
    expect(research.startsWith(researchAuthored), research).toBe(true);
    expect(research, research).toContain(`importance_tier: "${researchDefaults.importance_tier}"`);
    expect(research, research).toContain(`contextType: "${researchDefaults.contextType}"`);
    expect(research.endsWith(researchBody), research).toBe(true);
    const handover = fs.readFileSync(path.join(sandbox, folder, 'handover.md'), 'utf8');
    expect(handover.startsWith(handoverAuthored), handover).toBe(true);
    expect(handover, handover).toContain(`importance_tier: "${handoverDefaults.importance_tier}"`);
    expect(handover, handover).toContain(`contextType: "${handoverDefaults.contextType}"`);
    expect(handover.endsWith(handoverBody), handover).toBe(true);
    const resourceMap = fs.readFileSync(path.join(sandbox, folder, 'resource-map.md'), 'utf8');
    // No fill reaches this document, so the run leaves it byte-identical: the
    // authored block survives as written, its critical tier stays single, and no
    // contextType appears because no template literal supplies one.
    expect(resourceMap.startsWith(resourceMapAuthored), resourceMap).toBe(true);
    expect(resourceMap.match(/importance_tier: "critical"/gu)?.length, resourceMap).toBe(1);
    expect(resourceMap.endsWith(resourceMapBody), resourceMap).toBe(true);
    expect(resourceMap, resourceMap).not.toContain('contextType');
    expect(resourceMap, resourceMap).toBe(`${resourceMapAuthored}---\n${resourceMapBody}`);
  }, 180_000);

  // A template the fill cannot read must not fail the run and must leave the
  // document-class defaults in charge of the missing keys. Each fresh run
  // starts with an empty literal cache, and the defaults pinned here disagree
  // with the hidden template, so a cached read could not satisfy this case.
  it('fills from the class defaults when a template cannot be read', () => {
    clearUpgradeManifest();
    const folder = 'specs/fm-fallback/001-unreadable-template';
    const packetFolder = path.join(sandbox, folder);
    try {
      writeLegacyPacket(folder);
      const authored = '---\ntitle: "Authored Decision Record"\ndescription: "An authored decision record."\n';
      const body = '# Decision Record\n\nLegacy decision written before v4.\n';
      fs.writeFileSync(path.join(sandbox, folder, 'decision-record.md'), `${authored}---\n${body}`);

      // The template is renamed rather than deleted, so the copy is restored
      // even if the run throws.
      const template = path.join(copy, 'templates/addons/decision-record.md.tmpl');
      const hidden = `${template}.hidden`;
      fs.renameSync(template, hidden);
      const applied = (() => {
        try {
          return runUpgrade(['--apply', '--roots', 'specs/fm-fallback']);
        } finally {
          fs.renameSync(hidden, template);
        }
      })();
      expect(applied.status, applied.stdout + applied.stderr).toBe(0);

      const decision = fs.readFileSync(path.join(sandbox, folder, 'decision-record.md'), 'utf8');
      expect(decision.startsWith(authored), decision).toBe(true);
      expect(decision, decision).toContain('importance_tier: "important"');
      expect(decision, decision).toContain('contextType: "planning"');
      expect(decision.endsWith(body), decision).toBe(true);
    } finally {
      // The packet is removed because it was repaired while its template was
      // hidden, so a later whole-tree run would still find work in it.
      fs.rmSync(packetFolder, { recursive: true, force: true });
      clearUpgradeManifest();
    }
  }, 180_000);

  it('groups each failing packet\'s errors by rule with a detail count', () => {
    clearUpgradeManifest();
    const folder = 'specs/grouped-track/001-two-links';
    writeLegacyPacket(folder);
    fs.appendFileSync(
      path.join(sandbox, folder, 'spec.md'),
      '\nSee [a](./grouped-missing-a.md).\nSee [b](./grouped-missing-b.md).\n',
    );

    // The headings are rebuilt from the validator's own report, so a rule
    // rename or a changed detail count flows through instead of failing here.
    const report = JSON.parse(validateJson(folder).stdout) as {
      entries: { rule: string; status: string; details: string[] }[];
    };
    const detailsByRule = new Map<string, number>();
    for (const entry of report.entries) {
      if (entry.status !== 'error') continue;
      const count = entry.details.length > 0 ? entry.details.length : 1;
      detailsByRule.set(entry.rule, (detailsByRule.get(entry.rule) ?? 0) + count);
    }
    expect(detailsByRule.size, JSON.stringify(report.entries)).toBeGreaterThan(0);
    const headings = [...detailsByRule.keys()]
      .sort()
      .map((rule) => `### ${folder} / x ${rule} (${detailsByRule.get(rule)})`);

    const dryRun = runUpgrade(['--roots', 'specs/grouped-track']);
    const applied = runUpgrade(['--apply', '--roots', 'specs/grouped-track']);
    try {
      const dryOutput = dryRun.stdout + dryRun.stderr;
      expect(dryRun.status, dryOutput).toBe(1);
      const groupedAt = dryRun.stdout.indexOf('grouped detail:');
      const downgradesAt = dryRun.stdout.indexOf('\nDowngrades:\n');
      expect(groupedAt, dryOutput).toBeGreaterThanOrEqual(0);
      expect(downgradesAt, dryOutput).toBeGreaterThan(groupedAt);
      const groupedSection = dryRun.stdout.slice(groupedAt, downgradesAt);

      const positions = headings.map((heading) => {
        const first = groupedSection.indexOf(heading);
        expect(first, dryOutput).toBeGreaterThanOrEqual(0);
        expect(groupedSection.lastIndexOf(heading), dryOutput).toBe(first);
        return first;
      });
      expect(positions, dryOutput).toEqual([...positions].sort((a, b) => a - b));

      // A heading owns the detail lines that follow it, so both missing links
      // must land under one rule rather than merely somewhere in the output.
      const blocks: string[][] = [];
      for (const line of groupedSection.split('\n')) {
        if (line.startsWith('### ')) blocks.push([]);
        else if (blocks.length > 0) blocks[blocks.length - 1].push(line);
      }
      expect(blocks.length, dryOutput).toBe(headings.length);
      expect(blocks.some((block) => block.some((line) => line.includes('grouped-missing-a.md'))
        && block.some((line) => line.includes('grouped-missing-b.md'))), dryOutput).toBe(true);

      // The grouped lines sit before the Downgrades section, so its row parser
      // must never mistake one of them for a downgraded finding.
      expect(downgradeRows(dryRun.stdout).some((line) => line.startsWith('###') || line.startsWith('- ')), dryOutput).toBe(false);

      const applyOutput = applied.stdout + applied.stderr;
      expect(applied.status, applyOutput).toBe(0);
      expect(applied.stdout.slice(applied.stdout.lastIndexOf('grouped detail:')), applyOutput)
        .toBe('grouped detail:\n  none\n');
    } finally {
      fs.rmSync(path.join(sandbox, 'specs/grouped-track'), { recursive: true, force: true });
      clearUpgradeManifest();
    }
  }, 180_000);

  it('repairs a failing parent without touching its passing child', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/nest-track/001-parent');
    writeLegacyPacket('specs/nest-track/001-parent/001-child');
    const first = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(first.status, first.stdout + first.stderr).toBe(0);
    expect(first.stdout, first.stdout + first.stderr).toContain('after=2/2');

    const child = manifest('specs/nest-track/001-parent/001-child');
    fs.appendFileSync(path.join(sandbox, 'specs/nest-track/001-parent/spec.md'), '\nA note added after the upgrade.\n');
    clearUpgradeManifest();
    const second = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(manifest('specs/nest-track/001-parent/001-child')).toBe(child);
  }, 180_000);

  it('lists a packet once when the given roots overlap', () => {
    writeLegacyPacket('specs/nest-track/001-parent');
    writeLegacyPacket('specs/nest-track/001-parent/001-child');
    const settled = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(settled.status, settled.stdout + settled.stderr).toBe(0);
    const result = runUpgrade(['--roots', 'specs/nest-track', '--roots', 'specs/nest-track/001-parent']);
    expect(result.stdout, result.stdout + result.stderr).toContain('inspected=2 ');
  }, 180_000);

  it('leaves a spec folder copy inside a research tree untouched', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/research-track/001-host');
    const snapshot = 'specs/research-track/001-host/research/snapshots/001-copy';
    writeLegacyPacket(snapshot);
    const before = manifest(snapshot);
    const result = runUpgrade(['--apply', '--roots', 'specs/research-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('inspected=1 active=1');
    expect(manifest(snapshot)).toBe(before);
  }, 180_000);

  it('leaves a root inside z_archive alone unless --include-archive is given', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/z_archive/001-frozen');
    const before = manifest('specs/z_archive');
    const result = runUpgrade(['--apply', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('no spec folders found');
    expect(manifest('specs/z_archive')).toBe(before);
  }, 180_000);

  // An archived packet records where it lives now, so its derived files may be
  // written. Its prose is history and stays as written; the questions opener is
  // a marker line, so moving it above its heading un-nests the anchor without
  // changing a word of the prose.
  it('un-nests only the questions anchor in an archived packet and leaves every prose line as written', () => {
    clearUpgradeManifest();
    const folder = path.join(sandbox, 'specs/z_archive/001-frozen');
    writeLegacyPacket('specs/z_archive/001-frozen');
    fs.writeFileSync(path.join(folder, 'spec.md'), [
      '---',
      'title: "Legacy Packet"',
      'description: "A packet written before v4."',
      '---',
      '# Legacy Packet',
      '',
      'Old packet written before the v4 contract.',
      '',
      '<!-- ANCHOR:notes -->',
      'First notes paragraph.',
      '<!-- /ANCHOR:notes -->',
      '',
      '<!-- ANCHOR:notes -->',
      'Second notes paragraph.',
      '<!-- /ANCHOR:notes -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: EDGE CASES',
      'Boundary notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'));

    const markerLine = /^\s*<!--\s*\/?ANCHOR:[a-z0-9-]+\s*-->\s*$/;
    const markerLines = (text: string) => text.split('\n').filter((line) => markerLine.test(line)).sort();
    const proseLines = (text: string) => text.split('\n').filter((line) => !markerLine.test(line));
    const before = fs.readFileSync(path.join(folder, 'spec.md'), 'utf8');
    const names = fs.readdirSync(folder).filter((name) => name.endsWith('.md')).sort();
    const others = Object.fromEntries(fs.readdirSync(folder).filter((name) => name.endsWith('.md') && name !== 'spec.md').map((name) => [name, fs.readFileSync(path.join(folder, name), 'utf8')]));

    const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain('step anchor-unnest (archived): ok');
    expect(result.stdout).toContain('step repair-derived (archived): ok');

    const after = fs.readFileSync(path.join(folder, 'spec.md'), 'utf8');
    expect(after, after).not.toBe(before);
    const afterLines = after.split('\n');
    const heading = afterLines.indexOf('## 10. OPEN QUESTIONS');
    expect(heading, after).toBeGreaterThan(0);
    expect(afterLines[heading - 1]).toBe('<!-- ANCHOR:questions -->');
    expect(proseLines(after)).toEqual(proseLines(before));
    expect(markerLines(after)).toEqual(markerLines(before));
    expect(after.match(/<!-- ANCHOR:notes -->/g)?.length, after).toBe(2);
    expect(after.includes('notes-2'), after).toBe(false);

    expect(fs.readdirSync(folder).filter((name) => name.endsWith('.md')).sort()).toEqual(names);
    for (const [name, content] of Object.entries(others)) {
      expect(fs.readFileSync(path.join(folder, name), 'utf8'), name).toBe(content);
    }

    const check = validate('specs/z_archive/001-frozen');
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  // openSync's mode argument is masked by the umask, so the archived un-nesting
  // has to re-apply the document's own bits; without that a restrictive umask
  // silently strips them from a file the run only meant to un-nest.
  it('keeps an archived document mode under a restrictive umask', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/z_archive/002-mode');
    const specFile = path.join(sandbox, 'specs/z_archive/002-mode/spec.md');
    fs.writeFileSync(specFile, nestedQuestionsSpec());
    fs.chmodSync(specFile, 0o664);

    const previousUmask = process.umask(0o077);
    try {
      const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
      expect(result.status, result.stdout + result.stderr).toBe(0);
      expect(result.stdout).toContain('step anchor-unnest (archived): ok');
    } finally {
      process.umask(previousUmask);
    }

    // The mode only proves anything if the write path ran, so the moved opener
    // is asserted beside it.
    const lines = fs.readFileSync(specFile, 'utf8').split('\n');
    const heading = lines.indexOf('## 10. OPEN QUESTIONS');
    expect(heading, lines.join('\n')).toBeGreaterThan(0);
    expect(lines[heading - 1]).toBe('<!-- ANCHOR:questions -->');
    expect(fs.statSync(specFile).mode & 0o777).toBe(0o664);
  }, 180_000);

  it('repairs a nested questions anchor on apply and shows it on the dry run', () => {
    clearUpgradeManifest();
    const folder = 'specs/anchor-track/001-nested';
    writeLegacyPacket(folder);
    // A fresh specs/ tree is hidden by the machine's global excludes, so the
    // packet is force-committed first and the overwrite below is then a
    // visible dirty edit the run can capture a before-image for.
    commitChanges('committed nested questions packet', [folder]);
    const specFile = path.join(sandbox, folder, 'spec.md');
    fs.writeFileSync(specFile, nestedQuestionsSpec());
    const nested = fs.readFileSync(specFile);
    const before = manifest('specs/anchor-track');

    const dryRun = runUpgrade(['--roots', 'specs/anchor-track']);
    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(1);
    expect(dryRun.stdout, dryRun.stdout + dryRun.stderr).toContain(`would repair ${folder}/spec.md: moved questions opener`);
    expect(manifest('specs/anchor-track')).toBe(before);

    const applied = runUpgrade(['--apply', '--roots', 'specs/anchor-track']);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout, applied.stdout + applied.stderr).toContain('step anchor-repair: ok');

    const lines = fs.readFileSync(specFile, 'utf8').split('\n');
    const heading = lines.indexOf('## 10. OPEN QUESTIONS');
    expect(heading, lines.join('\n')).toBeGreaterThan(0);
    expect(lines[heading - 1]).toBe('<!-- ANCHOR:questions -->');

    const body = JSON.parse(fs.readFileSync(upgradeManifestPath(), 'utf8'));
    const image = body.beforeImages.find((entry: { path: string }) => entry.path === `${folder}/spec.md`);
    expect(image, JSON.stringify(body.beforeImages)).toBeDefined();
    const saved = fs.readFileSync(path.join(path.dirname(upgradeManifestPath()), image.beforeImage.sidecar));
    expect(saved).toEqual(nested);
  }, 180_000);
});
