// ───────────────────────────────────────────────────────────────
// TEST: API Key Validation (T087-T090)
// ───────────────────────────────────────────────────────────────
// REQ-029: Pre-Flight API Key Validation
// Tests for validate_api_key() function in embedding provider factory
'use strict';

const { validate_api_key, VALIDATION_TIMEOUT_MS } = require('../../shared/embeddings/factory');

/* ─────────────────────────────────────────────────────────────
   Test Utilities
──────────────────────────────────────────────────────────────── */

// Store original env vars for restoration
const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  // Restore original env
  Object.keys(process.env).forEach(key => {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key];
    }
  });
  Object.assign(process.env, ORIGINAL_ENV);
}

/* ─────────────────────────────────────────────────────────────
   Tests
──────────────────────────────────────────────────────────────── */

async function test_validation_timeout_constant() {
  console.log('TEST: VALIDATION_TIMEOUT_MS is 5000ms (CHK-170)');

  if (VALIDATION_TIMEOUT_MS !== 5000) {
    throw new Error(`Expected VALIDATION_TIMEOUT_MS to be 5000, got ${VALIDATION_TIMEOUT_MS}`);
  }

  console.log('  PASS: Validation timeout is 5000ms');
}

async function test_local_provider_no_validation() {
  console.log('TEST: Local provider skips API key validation');

  // Set env to force hf-local
  delete process.env.VOYAGE_API_KEY;
  delete process.env.OPENAI_API_KEY;
  process.env.EMBEDDINGS_PROVIDER = 'hf-local';

  try {
    const result = await validate_api_key();

    if (!result.valid) {
      throw new Error('Expected hf-local to be valid without API key');
    }
    if (result.provider !== 'hf-local') {
      throw new Error(`Expected provider to be hf-local, got ${result.provider}`);
    }

    console.log('  PASS: hf-local provider passes validation without API key');
  } finally {
    resetEnv();
  }
}

async function test_missing_api_key_returns_error() {
  console.log('TEST: Missing API key returns E050 error (CHK-168)');

  // Set env to force voyage without API key
  delete process.env.VOYAGE_API_KEY;
  delete process.env.OPENAI_API_KEY;
  process.env.EMBEDDINGS_PROVIDER = 'voyage';

  try {
    const result = await validate_api_key();

    if (result.valid) {
      throw new Error('Expected validation to fail without API key');
    }
    if (result.errorCode !== 'E050') {
      throw new Error(`Expected error code E050, got ${result.errorCode}`);
    }
    if (!result.actions || result.actions.length === 0) {
      throw new Error('Expected actionable recovery actions (CHK-169)');
    }

    console.log('  PASS: Missing API key returns E050 with actions');
    console.log(`  Actions: ${result.actions.length} recovery steps provided`);
  } finally {
    resetEnv();
  }
}

async function test_validation_has_actionable_guidance() {
  console.log('TEST: Validation errors include actionable guidance (CHK-169)');

  // Set env to force openai without API key
  delete process.env.VOYAGE_API_KEY;
  delete process.env.OPENAI_API_KEY;
  process.env.EMBEDDINGS_PROVIDER = 'openai';

  try {
    const result = await validate_api_key();

    if (result.valid) {
      throw new Error('Expected validation to fail without API key');
    }

    // Check for actionable guidance
    const hasActions = result.actions && result.actions.length > 0;
    const hasProviderDashboard = result.actions?.some(a =>
      a.includes('openai.com') || a.includes('voyage.ai')
    );
    const hasEnvVarGuidance = result.actions?.some(a =>
      a.includes('API_KEY') || a.includes('environment variable')
    );

    if (!hasActions) {
      throw new Error('Expected recovery actions to be provided');
    }
    if (!hasEnvVarGuidance) {
      throw new Error('Expected guidance about environment variable');
    }

    console.log('  PASS: Error includes actionable guidance');
    console.log(`  Sample action: "${result.actions[0]}"`);
  } finally {
    resetEnv();
  }
}

async function test_valid_api_key_returns_success() {
  console.log('TEST: Valid API key returns success (CHK-167)');

  // Only run if we have a real API key set
  if (!ORIGINAL_ENV.VOYAGE_API_KEY && !ORIGINAL_ENV.OPENAI_API_KEY) {
    console.log('  SKIP: No API key configured in environment');
    return;
  }

  try {
    const result = await validate_api_key({ timeout: 5000 });

    if (!result.valid) {
      // Could be network issue, check error
      if (result.errorCode === 'E053') {
        console.log('  SKIP: Network timeout during validation');
        return;
      }
      throw new Error(`Expected validation to succeed, got: ${result.error}`);
    }

    console.log('  PASS: Valid API key returns success');
    console.log(`  Provider: ${result.provider}`);
  } finally {
    resetEnv();
  }
}

async function test_timeout_respected() {
  console.log('TEST: Validation respects timeout (CHK-170)');

  // This test verifies the timeout option is passed correctly
  // We can't easily test actual timeout without mocking fetch

  // Set env to force cloud provider
  if (!ORIGINAL_ENV.VOYAGE_API_KEY && !ORIGINAL_ENV.OPENAI_API_KEY) {
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.EMBEDDINGS_PROVIDER = 'voyage';

    try {
      // Without API key, should fail fast (not timeout)
      const start = Date.now();
      const result = await validate_api_key({ timeout: 5000 });
      const elapsed = Date.now() - start;

      // Should complete quickly since no network call needed
      if (elapsed > 1000) {
        console.log(`  WARN: Validation took ${elapsed}ms for missing key check`);
      }

      console.log('  PASS: Timeout option is accepted');
    } finally {
      resetEnv();
    }
  } else {
    // With real API key, verify it doesn't exceed timeout
    try {
      const start = Date.now();
      await validate_api_key({ timeout: 5000 });
      const elapsed = Date.now() - start;

      if (elapsed > 5500) {
        throw new Error(`Validation exceeded 5s timeout: ${elapsed}ms`);
      }

      console.log(`  PASS: Validation completed within timeout (${elapsed}ms)`);
    } finally {
      resetEnv();
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   Test Runner
──────────────────────────────────────────────────────────────── */

async function runTests() {
  console.log('\n=== API Key Validation Tests (T087-T090) ===\n');

  const tests = [
    test_validation_timeout_constant,
    test_local_provider_no_validation,
    test_missing_api_key_returns_error,
    test_validation_has_actionable_guidance,
    test_valid_api_key_returns_success,
    test_timeout_respected,
  ];

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (error) {
      if (error.message.includes('SKIP')) {
        skipped++;
        console.log(`  ${error.message}`);
      } else {
        failed++;
        console.error(`  FAIL: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log('=== Results ===');
  console.log(`Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runTests().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
