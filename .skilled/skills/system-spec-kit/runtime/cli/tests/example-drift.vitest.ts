import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '../spec/check-example-drift.sh');

describe('example drift guard', () => {
  it('passes on the shipped examples', () => {
    const args: string[] = [];
    args.push(SCRIPT);
    const output = execFileSync('bash', args, { encoding: 'utf8' });
    expect(output.trim()).toBe('EXAMPLE_DRIFT_OK');
  });
});
