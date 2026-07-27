import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { buildPlan, parseGuidedRunArgs, runGuided, runPreflight } from '../scripts/guided-run';
import { outputPolicyRoots } from '../scripts/output-policy';

describe('guided-run wrapper', () => {
  it('parses required output, optional DESIGN.md and mode flags', () => {
    const options = parseGuidedRunArgs(['node', 'guided-run', 'https://example.com', '--output', '.opencode/specs/demo/output', '--design-md', '.opencode/specs/demo/output/DESIGN.md', '--fast', '--report']);
    expect(options.url).toBe('https://example.com');
    expect(options.output).toBe('.opencode/specs/demo/output');
    expect(options.designMd).toBe('.opencode/specs/demo/output/DESIGN.md');
    expect(options.fast).toBe(true);
    expect(options.report).toBe(true);
  });

  it('plans extract and write prompt without auto-authoring DESIGN.md', () => {
    const plan = buildPlan({ url: 'https://example.com', output: '.opencode/specs/demo/output', fast: true, report: false, dryRun: true });
    expect(plan.map((step) => step.label)).toEqual(['extract', 'write-prompt', 'write-prompt-output']);
    expect(plan.some((step) => step.args.includes('DESIGN.md'))).toBe(false);
  });

  it('plans validation and report only when DESIGN.md is supplied', () => {
    const plan = buildPlan({ url: 'https://example.com', output: '.opencode/specs/demo/output', designMd: '.opencode/specs/demo/output/DESIGN.md', fast: false, report: true, dryRun: true });
    expect(plan.map((step) => step.label)).toContain('validate');
    expect(plan.map((step) => step.label)).toContain('report');
  });

  it('reports output paths inside the skill as unsafe', () => {
    const checks = runPreflight({ url: 'https://example.com', output: '.opencode/skills/sk-design/design-md-generator/output', fast: false, report: false, dryRun: true });
    const outputCheck = checks.find((check) => check.name === 'output-path');
    expect(outputCheck?.ok).toBe(false);
  });

  it('reports a real spec-folder output path as safe (shared output-policy resolver)', () => {
    const target = path.join(outputPolicyRoots.SPECS_ROOT, 'demo-packet', 'output');
    const checks = runPreflight({ url: 'https://example.com', output: target, fast: false, report: false, dryRun: true });
    const outputCheck = checks.find((check) => check.name === 'output-path');
    expect(outputCheck?.ok).toBe(true);
  });

  it('reports an output path outside the spec-folder root and sandbox as unsafe', () => {
    const checks = runPreflight({ url: 'https://example.com', output: '/etc/design-md-generator-output', fast: false, report: false, dryRun: true });
    const outputCheck = checks.find((check) => check.name === 'output-path');
    expect(outputCheck?.ok).toBe(false);
  });

  it('threads an absolute output path verbatim into the extract/report step args (guards the guided-run cwd-mismatch fix: runGuided resolves output to absolute before calling buildPlan, so a child process spawned with a different cwd cannot re-resolve a relative path to a different location)', () => {
    const absoluteOutput = path.join(outputPolicyRoots.SPECS_ROOT, 'demo-packet', 'output');
    const absoluteDesignMd = path.join(absoluteOutput, 'DESIGN.md');
    const plan = buildPlan({ url: 'https://example.com', output: absoluteOutput, designMd: absoluteDesignMd, fast: false, report: true, dryRun: true });
    const extractStep = plan.find((s) => s.label === 'extract');
    expect(extractStep?.args).toContain(absoluteOutput);
    const reportStep = plan.find((s) => s.label === 'report');
    expect(reportStep?.args).toContain(absoluteOutput);
    expect(reportStep?.args).toContain(absoluteDesignMd);
  });

  it('reports an unsafe --design-md path outside the output-policy allowlist as unsafe', () => {
    const checks = runPreflight({
      url: 'https://example.com',
      output: path.join(outputPolicyRoots.SPECS_ROOT, 'demo-packet', 'output'),
      designMd: '/etc/design-md-generator-target.md',
      fast: false,
      report: false,
      dryRun: true,
    });
    const designMdCheck = checks.find((check) => check.name === 'design-md-path');
    expect(designMdCheck?.ok).toBe(false);
  });

  it('fails closed for an unsafe --design-md path before the STUDY leak-retry branch can delete/rewrite it', () => {
    const unsafeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'guided-run-unsafe-'));
    const unsafeDesignMd = path.join(unsafeDir, 'DESIGN.md');
    fs.writeFileSync(unsafeDesignMd, '# operator-authored content\n');
    const output = path.join(outputPolicyRoots.SPECS_ROOT, 'demo-packet', 'output');

    try {
      let executeCommandCalls = 0;
      expect(() => runGuided(
        {
          url: 'https://example.com',
          output,
          designMd: unsafeDesignMd,
          fast: false,
          report: false,
          dryRun: false,
          study: true,
        },
        { executeCommand: () => { executeCommandCalls += 1; return ''; } },
      )).toThrow(/Preflight failed/);

      // The STUDY leak-retry branch (rmSync + rewrite) never runs: preflight
      // rejects the unsafe path before any command executes and before the
      // operator-named file is touched.
      expect(executeCommandCalls).toBe(0);
      expect(fs.existsSync(unsafeDesignMd)).toBe(true);
      expect(fs.readFileSync(unsafeDesignMd, 'utf-8')).toBe('# operator-authored content\n');
    } finally {
      fs.rmSync(unsafeDir, { recursive: true, force: true });
    }
  });
});
