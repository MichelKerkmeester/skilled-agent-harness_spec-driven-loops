// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Plugin Bundle
// ───────────────────────────────────────────────────────────────────

import { registerAskSurfaceGuard } from './adapters/ask-surface-guard.mjs';
import { registerCompletionEvidence } from './adapters/completion-evidence.mjs';
import { registerClassifierInjectionScreen } from './adapters/classifier-injection-screen.mjs';
import { registerDecisionCapture } from './adapters/decision-capture.mjs';
import { registerDispatchAudit } from './adapters/dispatch-audit.mjs';
import { registerEnvSecretGuard } from './adapters/env-secret-guard.mjs';
import { registerDispatchPreflightLint } from './adapters/dispatch-preflight-lint.mjs';
import { registerGitMessageGate } from './adapters/git-message-gate.mjs';
import { registerGitPreflightAdvisory } from './adapters/git-preflight-advisory.mjs';
import { registerGoalContext } from './adapters/goal-context.mjs';
import { registerGoalManage } from './adapters/goal-manage.mjs';
import { registerMcpRouteGuard } from './adapters/mcp-route-guard.mjs';
import { registerOverlayGuard } from './adapters/overlay-guard.mjs';
import { registerPostEditQuality } from './adapters/post-edit-quality.mjs';
import { registerPromptAdvisor } from './adapters/prompt-advisor.mjs';
import { registerSessionCompactContext } from './adapters/session-compact-context.mjs';
import { registerSessionStartAdvisories } from './adapters/session-start-advisories.mjs';
import { registerSessionStartContext } from './adapters/session-start-context.mjs';
import { registerSessionStopContext } from './adapters/session-stop-context.mjs';
import { registerSpecGateClassify } from './adapters/spec-gate-classify.mjs';
import { registerSpecGateEnforce } from './adapters/spec-gate-enforce.mjs';
import { registerTaskDispatchGuard } from './adapters/task-dispatch-guard.mjs';

export const name = 'repo-guards';

// A bundle-level `inject` would hold every guard until each named service exists,
// so only the adapters that need a service wait for it. A context without
// `inject`, such as a test fixture, registers them at once.
function withServices(ctx, services, register) {
  if (typeof ctx.inject === 'function') ctx.inject(services, register);
  else register(ctx);
}

/**
 * Register every repo guard adapter on the dsh plugin context.
 *
 * @param {Object} ctx - dsh plugin context with `on`, `commands`, `logger` and, in a real run, `inject`.
 * @param {Object} [config] - Plugin row config; `adapters` holds each adapter's options.
 */
export function apply(ctx, config = {}) {
  const options = config.adapters ?? {};
  registerDispatchAudit(ctx, options.dispatchAudit);
  registerDispatchPreflightLint(ctx, options.dispatchPreflightLint);
  registerGitMessageGate(ctx, options.gitMessageGate);
  registerGitPreflightAdvisory(ctx, options.gitPreflightAdvisory);
  registerGoalContext(ctx, options.goalContext);
  registerMcpRouteGuard(ctx, options.mcpRouteGuard);
  registerSpecGateClassify(ctx, options.specGateClassify);
  registerPromptAdvisor(ctx, { enabled: options.promptAdvisor !== false });
  registerSessionStartContext(ctx, options.sessionStartContext);
  registerSpecGateEnforce(ctx, options.specGateEnforce);
  registerCompletionEvidence(ctx, options.completionEvidence);
  registerAskSurfaceGuard(ctx, options.askSurfaceGuard);
  registerTaskDispatchGuard(ctx, options.taskDispatchGuard);
  registerPostEditQuality(ctx, options.postEditQuality);
  registerClassifierInjectionScreen(ctx, options.classifierInjectionScreen);
  registerOverlayGuard(ctx, options.overlayGuard);
  registerEnvSecretGuard(ctx, options.envSecretGuard);
  registerDecisionCapture(ctx, options.decisionCapture);
  withServices(ctx, ['commands', 'tools'], (scoped) => registerGoalManage(scoped, options.goalManage));
  registerSessionStartAdvisories(ctx, options.sessionStartAdvisories);
  withServices(ctx, ['agents'], (scoped) => registerSessionCompactContext(scoped, {
    getAgent: (id) => scoped.agents?.get(id),
    ...options.sessionCompactContext,
  }));
  registerSessionStopContext(ctx, options.sessionStopContext);
}
