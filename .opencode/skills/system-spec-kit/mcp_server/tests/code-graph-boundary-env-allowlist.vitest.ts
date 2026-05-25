import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildSubprocessEnv } from '../lib/code-graph-boundary.js';

describe('MCP subprocess env allowlist', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'ghp_secret_should_not_leak';
    process.env.AWS_SECRET_ACCESS_KEY = 'aws-secret-leak';
    process.env.SSH_AUTH_SOCK = '/tmp/ssh-auth-leak';
    process.env.RANDOM_USER_VAR = 'should-not-pass';
    process.env.SPECKIT_TEST_VAR = 'project-namespace-passes';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('drops GITHUB_TOKEN', () => {
    const env = buildSubprocessEnv();
    expect(env.GITHUB_TOKEN).toBeUndefined();
  });

  it('drops AWS_SECRET_ACCESS_KEY', () => {
    const env = buildSubprocessEnv();
    expect(env.AWS_SECRET_ACCESS_KEY).toBeUndefined();
  });

  it('drops SSH_AUTH_SOCK', () => {
    const env = buildSubprocessEnv();
    expect(env.SSH_AUTH_SOCK).toBeUndefined();
  });

  it('drops unknown RANDOM_USER_VAR', () => {
    const env = buildSubprocessEnv();
    expect(env.RANDOM_USER_VAR).toBeUndefined();
  });

  it('passes PATH + HOME (allowlist basics)', () => {
    const env = buildSubprocessEnv();
    expect(env.PATH).toBeTruthy();
    expect(env.HOME).toBeTruthy();
  });

  it('passes SPECKIT_* (project namespace)', () => {
    const env = buildSubprocessEnv();
    expect(env.SPECKIT_TEST_VAR).toBe('project-namespace-passes');
  });

  it('extras override and add', () => {
    const env = buildSubprocessEnv({ MY_EXTRA: 'value', PATH: '/custom/path' });
    expect(env.MY_EXTRA).toBe('value');
    expect(env.PATH).toBe('/custom/path');
  });
});
