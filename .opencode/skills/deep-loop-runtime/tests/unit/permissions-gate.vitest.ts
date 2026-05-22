import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  evaluatePreDispatchToolCalls,
  evaluateToolCall,
  type PermissionsMatrix,
} from '../../lib/deep-loop/permissions-gate.js';

function baseMatrix(rules: PermissionsMatrix['rules']): PermissionsMatrix {
  return {
    version: '1.0',
    description: 'test matrix',
    rules,
  };
}

function withTempDir(run: (tempDir: string) => void): void {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'permissions-gate-'));
  try {
    run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('permissions-gate', () => {
  it('allows a read tool call when an allow rule matches', () => {
    withTempDir((tempDir) => {
      const resolvedTempDir = realpathSync.native(tempDir);
      const filePath = path.join(tempDir, 'note.md');
      writeFileSync(filePath, 'read me\n', 'utf8');
      const matrix = baseMatrix([
        {
          target_glob: `${resolvedTempDir}/**`,
          operation_class: 'read',
          scope: 'repo-wide',
          effect: 'allow',
          rationale: 'test read allow',
        },
      ]);

      expect(evaluateToolCall('Read', { file_path: filePath }, matrix)).toMatchObject({
        allowed: true,
        ruleId: 'rule-1',
      });
    });
  });

  it('denies a write tool call and cites the matched rule rationale', () => {
    withTempDir((tempDir) => {
      const resolvedTempDir = realpathSync.native(tempDir);
      const filePath = path.join(tempDir, 'blocked.md');
      const matrix = baseMatrix([
        {
          target_glob: `${resolvedTempDir}/**`,
          operation_class: 'write',
          scope: 'repo-wide',
          effect: 'deny',
          rationale: 'writes blocked in readonly tests',
        },
      ]);

      const result = evaluateToolCall('Write', { file_path: filePath }, matrix);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain(`target_glob=${resolvedTempDir}/**`);
      expect(result.reason).toContain('writes blocked in readonly tests');
    });
  });

  it('uses the most-specific glob over a broad deny for dotfiles and parent traversal', () => {
    withTempDir((tempDir) => {
      const resolvedTempDir = realpathSync.native(tempDir);
      const packetDir = path.join(tempDir, 'packet');
      const nestedDir = path.join(packetDir, 'nested');
      const hiddenPath = path.join(nestedDir, '..', '.state.json');
      const resolvedPacketDir = path.join(resolvedTempDir, 'packet');
      const matrix = baseMatrix([
        {
          target_glob: `${resolvedTempDir}/**`,
          operation_class: 'write',
          scope: 'repo-wide',
          effect: 'deny',
          rationale: 'deny outside packet',
        },
        {
          target_glob: `${resolvedPacketDir}/**`,
          operation_class: 'write',
          scope: 'packet-local',
          effect: 'allow',
          rationale: 'allow packet writes',
        },
      ]);

      mkdirSync(packetDir);
      writeFileSync(path.join(packetDir, '.keep'), 'x', 'utf8');

      const result = evaluateToolCall('Write', { file_path: hiddenPath }, matrix);

      expect(result.allowed).toBe(true);
      expect(result.ruleId).toBe('rule-2');
    });
  });

  it('resolves symlinks before matching so a linked packet path cannot escape scope', () => {
    withTempDir((tempDir) => {
      const resolvedTempDir = realpathSync.native(tempDir);
      const outsideDir = path.join(tempDir, 'outside');
      const linkPath = path.join(tempDir, 'packet-link');
      mkdirSync(outsideDir);
      const resolvedOutsideDir = path.join(resolvedTempDir, 'outside');
      symlinkSync(outsideDir, linkPath);
      const targetPath = path.join(linkPath, 'escaped.md');
      const matrix = baseMatrix([
        {
          target_glob: `${linkPath}/**`,
          operation_class: 'write',
          scope: 'packet-local',
          effect: 'allow',
          rationale: 'lexical link path should not be enough',
        },
        {
          target_glob: `${resolvedOutsideDir}/**`,
          operation_class: 'write',
          scope: 'external',
          effect: 'deny',
          rationale: 'resolved outside target is denied',
        },
      ]);

      const result = evaluateToolCall('Write', { file_path: targetPath }, matrix);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('resolved outside target is denied');
    });
  });

  it('default-denies an empty matrix', () => {
    const matrix = baseMatrix([]);

    expect(evaluateToolCall('Read', { file_path: new URL(import.meta.url).pathname }, matrix)).toEqual({
      allowed: false,
      reason: 'default-deny (matrix empty or malformed)',
    });
  });

  it('uses first-in-array when specificity ties exactly', () => {
    withTempDir((tempDir) => {
      const resolvedTempDir = realpathSync.native(tempDir);
      const filePath = path.join(tempDir, 'tie.md');
      const matrix = baseMatrix([
        {
          target_glob: `${resolvedTempDir}/tie.md`,
          operation_class: 'write',
          scope: 'repo-wide',
          effect: 'deny',
          rationale: 'first tie wins',
        },
        {
          target_glob: `${resolvedTempDir}/tie.md`,
          operation_class: 'write',
          scope: 'repo-wide',
          effect: 'allow',
          rationale: 'second tie loses',
        },
      ]);

      const result = evaluateToolCall('Write', { file_path: filePath }, matrix);

      expect(result.allowed).toBe(false);
      expect(result.ruleId).toBe('rule-1');
    });
  });

  it('denies symlink chains deeper than the cap', () => {
    withTempDir((tempDir) => {
      const resolvedTempDir = realpathSync.native(tempDir);
      const finalFile = path.join(tempDir, 'final.md');
      writeFileSync(finalFile, 'target\n', 'utf8');
      let previous = finalFile;
      for (let index = 11; index >= 0; index -= 1) {
        const linkPath = path.join(tempDir, `link-${index}`);
        symlinkSync(previous, linkPath);
        previous = linkPath;
      }

      const matrix = baseMatrix([
        {
          target_glob: `${resolvedTempDir}/**`,
          operation_class: 'read',
          scope: 'repo-wide',
          effect: 'allow',
          rationale: 'would allow if resolution were shallow',
        },
      ]);

      expect(evaluateToolCall('Read', { file_path: previous }, matrix)).toEqual({
        allowed: false,
        reason: 'symlink resolution failed',
      });
    });
  });

  it('denies destructive Bash commands even when read-only shell commands are allowed', () => {
    const matrix = baseMatrix([
      {
        target_glob: 'Exec(rg)',
        operation_class: 'execute',
        scope: 'repo-wide',
        effect: 'allow',
        rationale: 'allow search',
      },
      {
        target_glob: 'Exec(rm*)',
        operation_class: 'execute',
        scope: 'repo-wide',
        effect: 'deny',
        rationale: 'rm blocked',
      },
    ]);

    const result = evaluateToolCall('Bash', { command: 'rg permissions && rm -rf old-spec' }, matrix);

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('rm blocked');
  });

  it('allows the legacy fallback path when no matrix is configured', () => {
    expect(evaluatePreDispatchToolCalls([{ toolName: 'Write', args: { file_path: 'x.md' } }], null)).toEqual({
      allowed: true,
      reason: 'legacy fallback: no permissions-matrix configured; use RM-8 four-layer prose mitigation',
    });
  });
});
