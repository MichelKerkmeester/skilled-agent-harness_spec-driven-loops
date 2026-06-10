// TEST: SECRET SCRUBBER
// Covers pre-index secret redaction: typed markers per secret kind,
// conservative false-positive guards, fail-closed behavior on scrubber
// error, parse-path integration (scrub BEFORE content-hash), and the
// redaction count surfaced through memory_health.
import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach, vi } from 'vitest';

import {
  scrubSecrets,
  scrubSecretsDetailed,
  getRedactionStats,
  resetRedactionStats,
  SecretScrubberError,
  __secretScrubberTestables,
  type SecretPattern,
} from '../lib/parsing/secret-scrubber';
import { parseMemoryContent, computeContentHash } from '../lib/parsing/memory-parser';
import * as handler from '../handlers/memory-crud';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';

const GITHUB_TOKEN = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef0123';
const ANTHROPIC_KEY = 'sk-ant-api03-AbCdEf123456_-GhIjKl789012';
const OPENAI_KEY = 'sk-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8';
const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';

describe('secret scrubber', () => {
  beforeEach(() => {
    resetRedactionStats();
    __secretScrubberTestables.setPatternsForTest(null);
  });

  describe('pattern coverage', () => {
    it('redacts GitHub tokens with a typed marker', () => {
      const result = scrubSecretsDetailed(`token is ${GITHUB_TOKEN} here`);
      expect(result.text).toBe('token is [REDACTED:github-token] here');
      expect(result.redactions).toBe(1);
      expect(result.kinds).toEqual(['github-token']);
    });

    it('redacts fine-grained GitHub PATs', () => {
      const result = scrubSecretsDetailed('github_pat_11ABCDEFG0abcdefghijklmnop');
      expect(result.text).toBe('[REDACTED:github-token]');
    });

    it('redacts Anthropic API keys with the anthropic kind, not openai', () => {
      const result = scrubSecretsDetailed(`key: ${ANTHROPIC_KEY}`);
      expect(result.text).toContain('[REDACTED:anthropic-api-key]');
      expect(result.text).not.toContain('sk-ant');
      expect(result.kinds).toEqual(['anthropic-api-key']);
    });

    it('redacts OpenAI-style sk- keys', () => {
      const result = scrubSecretsDetailed(`OPENAI_API_KEY=${OPENAI_KEY}`);
      expect(result.text).toContain('[REDACTED:openai-api-key]');
      expect(result.text).not.toContain(OPENAI_KEY);
    });

    it('redacts AWS access key ids', () => {
      const result = scrubSecretsDetailed(`aws key ${AWS_ACCESS_KEY} in text`);
      expect(result.text).toBe('aws key [REDACTED:aws-access-key-id] in text');
    });

    it('redacts AWS secret access keys but keeps the assignment context', () => {
      const result = scrubSecretsDetailed('aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
      expect(result.text).toBe('aws_secret_access_key = [REDACTED:aws-secret-access-key]');
    });

    it('redacts JWTs', () => {
      const result = scrubSecretsDetailed(`session ${JWT_TOKEN} expired`);
      expect(result.text).toBe('session [REDACTED:jwt] expired');
    });

    it('redacts bearer tokens but keeps the Bearer prefix', () => {
      const result = scrubSecretsDetailed('Authorization: Bearer abc123DEF456ghi789JKL012mno345');
      expect(result.text).toBe('Authorization: Bearer [REDACTED:bearer-token]');
    });

    it('redacts Slack tokens', () => {
      const result = scrubSecretsDetailed('xoxb-123456789012-abcdefABCDEF123456');
      expect(result.text).toBe('[REDACTED:slack-token]');
    });

    it('redacts Google API keys', () => {
      const result = scrubSecretsDetailed('AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q');
      expect(result.text).toBe('[REDACTED:google-api-key]');
    });

    it('redacts private key blocks', () => {
      const block = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAfoo\nbar\n-----END RSA PRIVATE KEY-----';
      const result = scrubSecretsDetailed(`before\n${block}\nafter`);
      expect(result.text).toBe('before\n[REDACTED:private-key]\nafter');
      expect(result.text).not.toContain('MIIEowIBAAKCAQEA');
    });

    it('redacts generic credential assignments while keeping the key name', () => {
      const result = scrubSecretsDetailed('api_key: "Abc123def456ghi789jkl0mn"');
      expect(result.text).toBe('api_key: "[REDACTED:credential-assignment]"');
    });

    it('redacts multiple secrets across kinds and counts each one', () => {
      const result = scrubSecretsDetailed(`${GITHUB_TOKEN} and ${AWS_ACCESS_KEY} and ${JWT_TOKEN}`);
      expect(result.redactions).toBe(3);
      expect(result.kinds).toEqual(
        expect.arrayContaining(['github-token', 'aws-access-key-id', 'jwt']),
      );
    });
  });

  describe('conservative non-matches', () => {
    it('passes clean prose through unchanged with zero redactions', () => {
      const text = 'The retention sweep protects constitutional rows from TTL-only deletion.';
      const result = scrubSecretsDetailed(text);
      expect(result.text).toBe(text);
      expect(result.redactions).toBe(0);
      expect(result.kinds).toEqual([]);
    });

    it('does not redact sk- prefixed skill slugs', () => {
      const text = 'Route through sk-bartender-endpoint-interpreter and sk-prompt-small-model first.';
      expect(scrubSecrets(text)).toBe(text);
    });

    it('does not redact placeholder credential values without digits', () => {
      const text = 'api_key: "your-api-key-goes-here-now"';
      expect(scrubSecrets(text)).toBe(text);
    });

    it('does not redact prose mentioning bearer tokens', () => {
      const text = 'Send the Bearer token in the Authorization header.';
      expect(scrubSecrets(text)).toBe(text);
    });

    it('does not redact env var references in assignments', () => {
      const text = 'api_key: ${OPENAI_API_KEY}';
      expect(scrubSecrets(text)).toBe(text);
    });

    it('handles empty and non-string-ish input without errors', () => {
      expect(scrubSecretsDetailed('').redactions).toBe(0);
      expect(scrubSecretsDetailed('').text).toBe('');
    });
  });

  describe('redaction stats', () => {
    it('accumulates total and per-kind counts across calls', () => {
      scrubSecrets(`a ${GITHUB_TOKEN}`);
      scrubSecrets(`b ${GITHUB_TOKEN} c ${AWS_ACCESS_KEY}`);

      const stats = getRedactionStats();
      expect(stats.totalRedactions).toBe(3);
      expect(stats.byKind['github-token']).toBe(2);
      expect(stats.byKind['aws-access-key-id']).toBe(1);
      expect(stats.lastRedactionAt).toEqual(expect.any(String));
    });

    it('does not count clean scrubs', () => {
      scrubSecrets('completely clean text');
      const stats = getRedactionStats();
      expect(stats.totalRedactions).toBe(0);
      expect(stats.lastRedactionAt).toBeNull();
    });

    it('resets counters for test isolation', () => {
      scrubSecrets(`a ${GITHUB_TOKEN}`);
      resetRedactionStats();
      expect(getRedactionStats()).toEqual({
        totalRedactions: 0,
        byKind: {},
        lastRedactionAt: null,
      });
    });
  });

  describe('fail-closed behavior', () => {
    const brokenPattern = {
      kind: 'boom',
      get regex(): RegExp {
        throw new Error('pattern exploded');
      },
    } as unknown as SecretPattern;

    it('throws SecretScrubberError when the scrubber itself fails', () => {
      __secretScrubberTestables.setPatternsForTest([brokenPattern]);
      expect(() => scrubSecretsDetailed('any content')).toThrow(SecretScrubberError);
      expect(() => scrubSecretsDetailed('any content')).toThrow(/refusing to persist/);
    });

    it('refuses the parse-path write when the scrubber fails', () => {
      __secretScrubberTestables.setPatternsForTest([brokenPattern]);
      expect(() => parseMemoryContent('/tmp/specs/test-scrub/spec.md', '# Title\n\nbody'))
        .toThrow(SecretScrubberError);
    });

    it('does not refuse normal clean writes', () => {
      const parsed = parseMemoryContent('/tmp/specs/test-scrub/spec.md', '# Clean Title\n\nClean body text.');
      expect(parsed.content).toContain('Clean body text.');
    });
  });

  describe('parse-path integration (scrub before content-hash)', () => {
    it('scrubs secrets from all parsed fields before the content hash is computed', () => {
      const rawContent = [
        `# Deploy notes ${GITHUB_TOKEN}`,
        '',
        'trigger_phrases: ["deploy", "release"]',
        '',
        `The pipeline failed because ${AWS_ACCESS_KEY} was rotated.`,
        `Authorization used: Bearer abc123DEF456ghi789JKL012mno345`,
      ].join('\n');

      const parsed = parseMemoryContent('/tmp/specs/test-scrub/spec.md', rawContent);
      const serialized = JSON.stringify(parsed);

      expect(serialized).not.toContain(GITHUB_TOKEN);
      expect(serialized).not.toContain(AWS_ACCESS_KEY);
      expect(parsed.content).toContain('[REDACTED:github-token]');
      expect(parsed.content).toContain('[REDACTED:aws-access-key-id]');

      const expectedScrubbed = scrubSecrets(rawContent);
      expect(parsed.contentHash).toBe(computeContentHash(expectedScrubbed));
      expect(parsed.contentHash).not.toBe(computeContentHash(rawContent));
    });
  });
});

describe('memory_health redaction surface', () => {
  beforeAll(() => {
    vectorIndex.closeDb();
    vectorIndex.initializeDb(':memory:');
  });

  afterAll(() => {
    vectorIndex.closeDb();
  });

  beforeEach(() => {
    resetRedactionStats();
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('surfaces the redaction counters in memory_health full report data', async () => {
    scrubSecrets(`leak ${GITHUB_TOKEN}`);

    const result = await handler.handleMemoryHealth({ reportMode: 'full' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.redaction).toMatchObject({
      totalRedactions: 1,
      byKind: { 'github-token': 1 },
    });
    expect(parsed.data.redaction.lastRedactionAt).toEqual(expect.any(String));
  });
});
