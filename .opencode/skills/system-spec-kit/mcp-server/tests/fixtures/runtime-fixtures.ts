// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Fixtures
// ───────────────────────────────────────────────────────────────
// Shared test fixtures for runtime detection and hook availability tests.

/** Runtime fixture describing a specific runtime's hook capabilities */
export interface RuntimeFixture {
  runtime: 'claude-code' | 'copilot-cli';
  hookPolicy: 'enabled' | 'disabled_by_scope' | 'live' | 'partial' | 'unavailable';
  supports: {
    sessionStartHook: boolean;
    preCompactHook: boolean;
    stopHook: boolean;
    toolFallback: boolean;
  };
}

/** Create a runtime fixture for the given runtime */
export function createRuntimeFixture(runtime: RuntimeFixture['runtime']): RuntimeFixture {
  switch (runtime) {
    case 'claude-code':
      return {
        runtime: 'claude-code',
        hookPolicy: 'enabled',
        supports: {
          sessionStartHook: true,
          preCompactHook: true,
          stopHook: true,
          toolFallback: true,
        },
      };
    case 'copilot-cli':
      return {
        runtime: 'copilot-cli',
        hookPolicy: 'enabled',
        supports: {
          sessionStartHook: true,
          preCompactHook: false,
          stopHook: false,
          toolFallback: true,
        },
      };
  }
}

/** Set up environment variables to simulate a specific runtime */
export function setRuntimeEnv(runtime: RuntimeFixture['runtime']): void {
  // Clear all runtime indicators
  delete process.env.CLAUDE_CODE;
  delete process.env.CLAUDE_SESSION_ID;
  delete process.env.MCP_SERVER_NAME;
  delete process.env.COPILOT_CLI;
  delete process.env.GITHUB_COPILOT_TOKEN;

  switch (runtime) {
    case 'claude-code':
      process.env.CLAUDE_CODE = '1';
      break;
    case 'copilot-cli':
      process.env.COPILOT_CLI = '1';
      break;
  }
}

/** Restore original environment (call in afterEach) */
export function clearRuntimeEnv(): void {
  delete process.env.CLAUDE_CODE;
  delete process.env.CLAUDE_SESSION_ID;
  delete process.env.MCP_SERVER_NAME;
  delete process.env.COPILOT_CLI;
  delete process.env.GITHUB_COPILOT_TOKEN;
}
