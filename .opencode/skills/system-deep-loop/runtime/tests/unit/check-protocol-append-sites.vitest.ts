// ┌──────────────────────────────────────────────────────────────────────────┐
// │ MODULE: check-protocol-append-sites conformance                          │
// │ Each case writes a real fixture YAML file and asserts the real process    │
// │ exit code of the checker script, so a pass is a statement about the      │
// │ checker itself rather than about a mock of it.                            │
// └──────────────────────────────────────────────────────────────────────────┘

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'check-protocol-append-sites.cjs');

const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  dirs.length = 0;
});

function runWithFixture(files: Record<string, string>): {
  status: number | null;
  stdout: string;
  stderr: string;
  payload: any;
} {
  const dir = mkdtempSync(join(tmpdir(), 'cpas-'));
  dirs.push(dir);
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content);
  }
  const result = spawnSync(process.execPath, [CLI_PATH, '--dir', dir], {
    encoding: 'utf8',
  });
  let payload: any = null;
  try {
    payload = JSON.parse(result.stdout.trim());
  } catch {
    payload = null;
  }
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    payload,
  };
}

describe('check-protocol-append-sites', () => {
  it('case 1: compliant — append directive plus append-gateway mechanism -> status 0', () => {
    const yaml = [
      'name: compliant',
      'steps:',
      '  - append_to_jsonl: state/deltas/d1.jsonl',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '',
    ].join('\n');
    const r = runWithFixture({ 'compliant.yaml': yaml });
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.violations).toEqual([]);
  });

  it('case 2: append directive, no protocol block -> status 2, UNDECLARED_APPEND_MECHANISM', () => {
    const yaml = [
      'name: no-protocol',
      'steps:',
      '  - append_to_jsonl: state/deltas/d1.jsonl',
      '',
    ].join('\n');
    const r = runWithFixture({ 'no-protocol.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_APPEND_MECHANISM');
    expect(r.payload.violations[0].file).toBe('no-protocol.yaml');
  });

  it('case 3: append directive + protocol block with mechanism "direct-write" -> status 2', () => {
    const yaml = [
      'name: direct-write',
      'steps:',
      '  - append_to_jsonl: state/deltas/d1.jsonl',
      'state_write_protocol:',
      '  mechanism: direct-write',
      '',
    ].join('\n');
    const r = runWithFixture({ 'direct-write.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_APPEND_MECHANISM');
  });

  it('case 4: literal shell append into state_log, no migration_exception -> status 2, UNDECLARED_DIRECT_APPEND', () => {
    const yaml = [
      'name: literal-append',
      'steps:',
      "  - run: printf '{}' >> {state_paths.state_log}",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '',
    ].join('\n');
    const r = runWithFixture({ 'literal-append.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_DIRECT_APPEND');
  });

  it('case 5: literal shell append + migration_exception + exempt_append_sites -> status 0', () => {
    const yaml = [
      'name: legacy-one-shot',
      'steps:',
      "  - run: printf '{}' >> {state_paths.state_log}",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '  migration_exception: "legacy one-shot"',
      '  exempt_append_sites: 1',
      '',
    ].join('\n');
    const r = runWithFixture({ 'legacy-one-shot.yaml': yaml });
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.violations).toEqual([]);
  });

  it('case 6: protocol block, no append directive -> status 0, info non-empty', () => {
    const yaml = [
      'name: protocol-only',
      'steps:',
      '  - run: echo hello',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '',
    ].join('\n');
    const r = runWithFixture({ 'protocol-only.yaml': yaml });
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.violations).toEqual([]);
    expect(r.payload.info.length).toBeGreaterThan(0);
    expect(r.payload.info[0].file).toBe('protocol-only.yaml');
  });

  it('case 7: two bad files in one dir -> status 2, two violations, stably sorted', () => {
    const a = [
      'name: bad-a',
      'steps:',
      '  - append_to_jsonl: state/deltas/d1.jsonl',
      '',
    ].join('\n');
    const b = [
      'name: bad-b',
      'steps:',
      "  - run: printf '{}' >> {state_paths.state_log}",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '',
    ].join('\n');
    const r = runWithFixture({ 'bad-a.yaml': a, 'bad-b.yaml': b });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(2);
    // Stable sort by file then rule: bad-a before bad-b.
    expect(r.payload.violations[0].file).toBe('bad-a.yaml');
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_APPEND_MECHANISM');
    expect(r.payload.violations[1].file).toBe('bad-b.yaml');
    expect(r.payload.violations[1].rule).toBe('UNDECLARED_DIRECT_APPEND');
  });

  it('case 8: embedded appendFileSync to stateLog, no migration_exception -> status 2, UNDECLARED_DIRECT_APPEND', () => {
    const yaml = [
      'name: js-append',
      'steps:',
      '  - run: node script.js',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      "            appendFileSync(paths.stateLog, JSON.stringify(e) + '\\n', 'utf8');",
      '',
    ].join('\n');
    const r = runWithFixture({ 'js-append.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_DIRECT_APPEND');
    expect(r.payload.violations[0].file).toBe('js-append.yaml');
  });

  it('case 9: embedded appendFileSync to stateLog + migration_exception + exempt_append_sites -> status 0', () => {
    const yaml = [
      'name: js-append-legacy',
      'steps:',
      '  - run: node script.js',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '  migration_exception: "legacy one-shot"',
      '  exempt_append_sites: 1',
      "            appendFileSync(paths.stateLog, JSON.stringify(e) + '\\n', 'utf8');",
      '',
    ].join('\n');
    const r = runWithFixture({ 'js-append-legacy.yaml': yaml });
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.violations).toEqual([]);
  });

  it('case 10: multi-line appendFileSync call to stateLog, no migration_exception -> status 2, UNDECLARED_DIRECT_APPEND', () => {
    const yaml = [
      'name: js-append-multiline',
      'steps:',
      '  - run: node script.js',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '            appendFileSync(',
      '              paths.stateLog,',
      '              payload,',
      '            );',
      '',
    ].join('\n');
    const r = runWithFixture({ 'js-append-multiline.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_DIRECT_APPEND');
    expect(r.payload.violations[0].file).toBe('js-append-multiline.yaml');
  });

  it('case 11: import naming appendFileSync without any call -> status 0 (import alone is not flagged)', () => {
    const yaml = [
      'name: import-only',
      'steps:',
      '  - run: node script.js',
      "import { appendFileSync } from 'node:fs';",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '',
    ].join('\n');
    const r = runWithFixture({ 'import-only.yaml': yaml });
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.violations).toEqual([]);
  });

  it('case 12: migration_exception present, exempt_append_sites missing -> status 2, UNCOUNTED_EXEMPTION', () => {
    const yaml = [
      'name: uncounted',
      'steps:',
      "  - run: printf '{}' >> {state_paths.state_log}",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '  migration_exception: "legacy one-shot"',
      '',
    ].join('\n');
    const r = runWithFixture({ 'uncounted.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNCOUNTED_EXEMPTION');
    expect(r.payload.violations[0].file).toBe('uncounted.yaml');
  });

  it('case 13: exempt_append_sites: 1 but two append sites present -> status 2, EXEMPTION_COUNT_MISMATCH', () => {
    const yaml = [
      'name: mismatch',
      'steps:',
      "  - run: printf '{}' >> {state_paths.state_log}",
      "  - run: printf '{}' >> {state_paths.state_log}",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '  migration_exception: "legacy one-shot"',
      '  exempt_append_sites: 1',
      '',
    ].join('\n');
    const r = runWithFixture({ 'mismatch.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('EXEMPTION_COUNT_MISMATCH');
    expect(r.payload.violations[0].file).toBe('mismatch.yaml');
  });

  it('case 14: exempt_append_sites matching the real count -> status 0', () => {
    const yaml = [
      'name: counted',
      'steps:',
      "  - run: printf '{}' >> {state_paths.state_log}",
      'state_write_protocol:',
      '  mechanism: append-gateway',
      '  migration_exception: "legacy one-shot"',
      '  exempt_append_sites: 1',
      '',
    ].join('\n');
    const r = runWithFixture({ 'counted.yaml': yaml });
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.violations).toEqual([]);
  });

  it('case 15: appendFileSync to a non-log target, no exception -> status 2, UNDECLARED_DIRECT_APPEND (target-independent)', () => {
    const yaml = [
      'name: non-log-target',
      'steps:',
      '  - run: node script.js',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      "            appendFileSync('/tmp/scratch.txt', data);",
      '',
    ].join('\n');
    const r = runWithFixture({ 'non-log-target.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_DIRECT_APPEND');
    expect(r.payload.violations[0].file).toBe('non-log-target.yaml');
  });

  it('case 16: helper wrapper calling appendFileSync, no exception -> status 2, UNDECLARED_DIRECT_APPEND', () => {
    const yaml = [
      'name: helper-wrapper',
      'steps:',
      '  - run: node script.js',
      'state_write_protocol:',
      '  mechanism: append-gateway',
      "            function write(p, d) { appendFileSync(p, d); }",
      '',
    ].join('\n');
    const r = runWithFixture({ 'helper-wrapper.yaml': yaml });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('UNDECLARED_DIRECT_APPEND');
    expect(r.payload.violations[0].file).toBe('helper-wrapper.yaml');
  });
});
