// ───────────────────────────────────────────────────────────────────
// MODULE: Wrapper Runtime Registry
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';
import {
  ClaudeRuntimePaths,
  claudeRuntimeAdapter,
} from '../runtimes/claude.js';
import {
  CodexRuntimePaths,
  codexRuntimeAdapter,
} from '../runtimes/codex.js';
import {
  CursorRuntimePaths,
  cursorRuntimeAdapter,
} from '../runtimes/cursor.js';
import {
  DevinRuntimePaths,
  devinRuntimeAdapter,
} from '../runtimes/devin.js';
import {
  PiRuntimePaths,
  piRuntimeAdapter,
} from '../runtimes/pi.js';

import type { RuntimeId } from '../contracts/common.js';
import type { WrapperLaunchMode, WrapperRuntimeId, WrapperRuntimePlan } from './types.js';

/** Version-pinned, adapter-backed plans for the five wrapper-target runtimes. */
const WRAPPER_RUNTIME_PLANS: Readonly<Record<WrapperRuntimeId, WrapperRuntimePlan>> = deepFreeze({
  claude: {
    runtime: 'claude',
    launchMode: 'headless',
    adapter: claudeRuntimeAdapter,
    pathId: ClaudeRuntimePaths.HEADLESS,
    protocol: 'claude-headless-stream-json',
    runtimeVersion: '2.1.228',
    protocolVersion: '1.0.0',
  },
  codex: {
    runtime: 'codex',
    launchMode: 'stream',
    adapter: codexRuntimeAdapter,
    pathId: CodexRuntimePaths.APP_SERVER,
    protocol: 'codex-app-server-json-rpc',
    runtimeVersion: '0.147.0',
    protocolVersion: '1.0.0',
  },
  cursor: {
    runtime: 'cursor',
    launchMode: 'stream',
    adapter: cursorRuntimeAdapter,
    pathId: CursorRuntimePaths.ACP,
    protocol: 'cursor-agent-client-protocol',
    runtimeVersion: '2026.8.4',
    protocolVersion: '1.0.0',
  },
  devin: {
    runtime: 'devin',
    launchMode: 'stream',
    adapter: devinRuntimeAdapter,
    pathId: DevinRuntimePaths.ACP,
    protocol: 'devin-agent-client-protocol',
    runtimeVersion: '3000.4.16',
    protocolVersion: '1.0.0',
  },
  pi: {
    runtime: 'pi',
    launchMode: 'print',
    adapter: piRuntimeAdapter,
    pathId: PiRuntimePaths.JSON_RPC,
    protocol: 'pi-json-rpc',
    runtimeVersion: '0.84.1',
    protocolVersion: '2.0.0',
  },
});

/** Resolve a wrapper plan for a runtime, or null when the runtime is incapable. */
export function resolveWrapperRuntime(runtimeId: RuntimeId): WrapperRuntimePlan | null {
  if (runtimeId === 'opencode') {
    return null;
  }
  return WRAPPER_RUNTIME_PLANS[runtimeId] ?? null;
}

/** Every wrapper-target runtime id, in registry order. */
export function listWrapperRuntimes(): readonly WrapperRuntimeId[] {
  return Object.freeze(Object.keys(WRAPPER_RUNTIME_PLANS) as WrapperRuntimeId[]);
}

/** The declared launch mode for a runtime, or null when incapable. */
export function resolveWrapperLaunchMode(runtimeId: RuntimeId): WrapperLaunchMode | null {
  return resolveWrapperRuntime(runtimeId)?.launchMode ?? null;
}
