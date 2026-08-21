// ───────────────────────────────────────────────────────────────────
// MODULE: Default Provider Transport Public API
// ───────────────────────────────────────────────────────────────────

export {
  createDefaultProviderTransport,
  createHostedHttpTransport,
  createLocalHttpTransport,
  defaultCredentialResolver,
} from './http.js';

export type {
  CredentialResolver,
  HttpFetch,
  HttpFetchInit,
  HttpTransportOptions,
  HttpTransportResponse,
} from './http.js';

export {
  createChildProcessCliRunner,
  createExternalCliTransport,
  defaultChildProcessSpawn,
  defaultComposePrompt,
} from './cli.js';

export { CliEngineIds, defaultModelForEngine, resolveCliEngineCommand } from './cli-engines.js';

export type { CliEngineId } from './cli-engines.js';

export type {
  ChildProcessCliRunnerOptions,
  CliCommandResolver,
  CliCommandSpec,
  CliInvocation,
  CliResult,
  CliRunner,
  ExternalCliTransportOptions,
  SpawnImpl,
  SpawnOutcome,
  SpawnRequest,
} from './cli.js';
