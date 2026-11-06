// ───────────────────────────────────────────────────────────────────
// MODULE: Repo Guards Plugin Bundle
// ───────────────────────────────────────────────────────────────────

import { registerCompletionEvidence } from './adapters/completion-evidence.mjs';
import { registerClassifierInjectionScreen } from './adapters/classifier-injection-screen.mjs';
import { registerDispatchAudit } from './adapters/dispatch-audit.mjs';
import { registerDispatchPreflightLint } from './adapters/dispatch-preflight-lint.mjs';
import { registerGitMessageGate } from './adapters/git-message-gate.mjs';
import { registerGitPreflightAdvisory } from './adapters/git-preflight-advisory.mjs';
import { registerGoalContext } from './adapters/goal-context.mjs';
import { registerMcpRouteGuard } from './adapters/mcp-route-guard.mjs';
import { registerPostEditQuality } from './adapters/post-edit-quality.mjs';
import { registerPromptAdvisor } from './adapters/prompt-advisor.mjs';
import { registerSessionStartContext } from './adapters/session-start-context.mjs';
import { registerSpecGateClassify } from './adapters/spec-gate-classify.mjs';
import { registerSpecGateEnforce } from './adapters/spec-gate-enforce.mjs';
import { registerTaskDispatchGuard } from './adapters/task-dispatch-guard.mjs';

export const name = 'repo-guards';

export function apply(ctx, config = {}) {
  const options = config.adapters ?? {};
  registerDispatchAudit(ctx, options.dispatchAudit);
  registerDispatchPreflightLint(ctx, options.dispatchPreflightLint);
  registerGitMessageGate(ctx, options.gitMessageGate);
  registerGitPreflightAdvisory(ctx, options.gitPreflightAdvisory);
  registerGoalContext(ctx, options.goalContext);
  registerMcpRouteGuard(ctx, options.mcpRouteGuard);
  registerSpecGateClassify(ctx, options.specGateClassify);
  registerPromptAdvisor(ctx, { enabled: options.promptAdvisor === true });
  registerSessionStartContext(ctx, options.sessionStartContext);
  registerSpecGateEnforce(ctx, options.specGateEnforce);
  registerCompletionEvidence(ctx, options.completionEvidence);
  registerTaskDispatchGuard(ctx, options.taskDispatchGuard);
  registerPostEditQuality(ctx, options.postEditQuality);
  registerClassifierInjectionScreen(ctx, options.classifierInjectionScreen);
}
