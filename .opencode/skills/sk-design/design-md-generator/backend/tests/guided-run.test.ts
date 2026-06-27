import { describe, it, expect } from 'vitest';
import { buildPlan, parseGuidedRunArgs, runPreflight } from '../scripts/guided-run';

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
});
