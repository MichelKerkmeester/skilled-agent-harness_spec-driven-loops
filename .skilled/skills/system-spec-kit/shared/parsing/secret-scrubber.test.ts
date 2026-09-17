// Script-style assertions for the secret scrubber, mirroring the colocated
// *.test.ts convention in shared/parsing. Run directly (tsx/node type
// stripping); throws on the first failing assertion.

import { scrubSecrets, scrubSecretsDetailed } from './secret-scrubber.js';

function assert(condition: boolean, label: string): void {
  if (!condition) throw new Error(`${label} failed`);
}

const withKey = 'token AKIAIOSFODNN7EXAMPLE and key sk-ant-api03-abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJ';
const scrubbed = scrubSecrets(withKey);
assert(!scrubbed.includes('AKIAIOSFODNN7EXAMPLE'), 'an AWS access key id is redacted');
assert(!scrubbed.includes('sk-ant-api03-'), 'an Anthropic api key is redacted');

const detailed = scrubSecretsDetailed(withKey);
assert(detailed.redactions >= 2, 'detailed scrub counts every redaction');

assert(scrubSecrets('') === '', 'an empty string passes through');
assert(scrubSecrets('plain prose with no credentials') === 'plain prose with no credentials', 'prose without secrets is unchanged');

process.stdout.write('secret scrubber ok\n');
