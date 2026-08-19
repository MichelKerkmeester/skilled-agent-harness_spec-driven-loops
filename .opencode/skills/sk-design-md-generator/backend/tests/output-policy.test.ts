import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import { resolveOutputPath, requireOutputPath, ensureWritableFile, outputPolicyRoots } from '../scripts/output-policy';

const { SKILLS_ROOT, SPECS_ROOT, SANDBOX_PREFIX } = outputPolicyRoots;

describe('resolveOutputPath', () => {
  it('accepts an absolute path inside the spec-folder root', () => {
    const target = path.join(SPECS_ROOT, 'demo-packet', 'output');
    const result = resolveOutputPath(target);
    expect(result.ok).toBe(true);
    expect(result.boundary).toBe('spec-folder');
    expect(result.resolvedPath).toBe(target);
  });

  it('accepts an approved sandbox path', () => {
    const target = `${SANDBOX_PREFIX}test-run/output`;
    const result = resolveOutputPath(target);
    expect(result.ok).toBe(true);
    expect(result.boundary).toBe('sandbox');
  });

  it('rejects a path inside the skills directory', () => {
    const target = path.join(SKILLS_ROOT, 'sk-design', 'design-md-generator', 'output');
    const result = resolveOutputPath(target);
    expect(result.ok).toBe(false);
    expect(result.boundary).toBe(null);
  });

  it('rejects a path outside both the spec-folder root and the sandbox', () => {
    const result = resolveOutputPath('/etc/design-md-generator-output');
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/must be inside a spec folder/);
  });

  it('rejects path traversal that escapes the spec-folder root back toward the skills directory', () => {
    const escapeAttempt = path.join(SPECS_ROOT, 'demo-packet', '..', '..', 'skills', 'sk-design', 'design-md-generator', 'output');
    const result = resolveOutputPath(escapeAttempt);
    expect(result.ok).toBe(false);
  });

  it('rejects a sibling directory that merely starts with the sandbox prefix minus the trailing dash', () => {
    // e.g. os.tmpdir()/skd-evil vs an unrelated os.tmpdir()/skdanger directory
    const lookalike = path.join(os.tmpdir(), 'skdanger', 'output');
    const result = resolveOutputPath(lookalike);
    expect(result.ok).toBe(false);
  });

  it('rejects an empty output path', () => {
    const result = resolveOutputPath('');
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/required/);
  });

  it('resolves a relative path against a supplied cwd', () => {
    const result = resolveOutputPath('output', path.join(SPECS_ROOT, 'demo-packet'));
    expect(result.ok).toBe(true);
    expect(result.resolvedPath).toBe(path.join(SPECS_ROOT, 'demo-packet', 'output'));
  });
});

describe('requireOutputPath', () => {
  it('returns the resolved path when valid', () => {
    const target = path.join(SPECS_ROOT, 'demo-packet', 'output');
    expect(requireOutputPath(target)).toBe(target);
  });

  it('throws when invalid', () => {
    expect(() => requireOutputPath('/etc/nope')).toThrow(/must be inside a spec folder/);
  });
});

describe('ensureWritableFile', () => {
  it('does not throw for a path that does not exist', () => {
    const target = path.join(SPECS_ROOT, 'demo-packet', 'output', 'does-not-exist.html');
    expect(() => ensureWritableFile(target)).not.toThrow();
  });

  it('throws for an existing file without force', () => {
    // this test file itself always exists
    const self = __filename;
    expect(() => ensureWritableFile(self)).toThrow(/refusing to overwrite/);
  });

  it('does not throw for an existing file with force:true', () => {
    const self = __filename;
    expect(() => ensureWritableFile(self, { force: true })).not.toThrow();
  });
});
