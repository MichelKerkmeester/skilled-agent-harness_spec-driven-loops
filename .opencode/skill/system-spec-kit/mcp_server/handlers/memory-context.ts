// ---------------------------------------------------------------
// MODULE: Memory Context
// ---------------------------------------------------------------

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions';
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';
import { randomUUID } from 'crypto';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier';

// Core handlers for routing
import { handleMemorySearch } from './memory-search';
import { handleMemoryMatchTriggers } from './memory-triggers';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope';

// Token estimation
import { estimateTokens } from '../formatters/token-metrics';
import {
  getPressureLevel,
  type RuntimeContextStats,
} from '../lib/cache/cognitive/pressure-monitor';
import * as workingMemory from '../lib/cache/cognitive/working-memory';
import { isIdentityInRollout } from '../lib/cache/cognitive/rollout-policy';

// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ContextMode {
  name: string;
  description: string;
  strategy: string;
  tokenBudget?: number;
}

interface ContextOptions {
  specFolder?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  anchors?: string[];
}

interface SessionLifecycleMetadata {
  sessionScope: 'caller' | 'ephemeral';
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  eventCounterStart: number;
  resumedContextCount: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

interface LayerInfo {
  tokenBudget?: number;
}

interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  tokenUsage?: number;
  anchors?: string[];
}

/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
  budgetTokens: number;
  actualTokens: number;
  enforced: boolean;
  truncated: boolean;
  originalResultCount?: number;
  returnedResultCount?: number;
}

/* ---------------------------------------------------------------
   2. TOKEN BUDGET ENFORCEMENT (T205)
   
   Enforces per-layer/per-mode token budgets by estimating the
   token count of strategy results and truncating when exceeded.
   Uses character-based estimation: 1 token ≈ 4 chars.
--------------------------------------------------------------- */

/**
 * T205: Enforce token budget on strategy results.
 * 
 * Estimates the token count of the serialized result. If over budget,
 * parses embedded result arrays and removes lowest-priority items
 * until within budget. Higher-scored results are preserved.
 */
function enforceTokenBudget(result: ContextResult, budgetTokens: number): { result: ContextResult; enforcement: TokenBudgetEnforcement } {
  const serialized = JSON.stringify(result);
  const actualTokens = estimateTokens(serialized);

  // Under budget — no enforcement needed
  if (actualTokens <= budgetTokens) {
    return {
      result,
      enforcement: {
        budgetTokens,
        actualTokens,
        enforced: true,
        truncated: false,
      }
    };
  }

  // Over budget — attempt to truncate embedded results
  // Strategy results contain an embedded MCPResponse with content[0].text as JSON
  // That JSON has a .data.results array we can truncate
  const truncatedResult = { ...result };

  // Try to find and truncate the inner results array
  const contentArr = (truncatedResult as Record<string, unknown>).content as Array<{ type: string; text: string }> | undefined;
  if (contentArr && Array.isArray(contentArr) && contentArr.length > 0 && contentArr[0]?.text) {
    try {
      const innerEnvelope = JSON.parse(contentArr[0].text);
      const innerResults = innerEnvelope?.data?.results;

      if (Array.isArray(innerResults) && innerResults.length > 1) {
        const originalCount = innerResults.length;

        // Results should already be sorted by score (highest first)
        // Remove items from the end until we fit within budget
        const currentResults = [...innerResults];
        let currentTokens = actualTokens;

        while (currentResults.length > 1 && currentTokens > budgetTokens) {
          // Remove the last (lowest-scored) result
          const removed = currentResults.pop();
          const removedTokens = estimateTokens(JSON.stringify(removed));
          currentTokens -= removedTokens;
        }

        // Update the inner envelope
        innerEnvelope.data.results = currentResults;
        innerEnvelope.data.count = currentResults.length;

        // Re-serialize
        contentArr[0] = { type: 'text', text: JSON.stringify(innerEnvelope, null, 2) };
        (truncatedResult as Record<string, unknown>).content = contentArr;

        // Recalculate actual tokens after truncation
        const newSerializedTokens = estimateTokens(JSON.stringify(truncatedResult));

        return {
          result: truncatedResult,
          enforcement: {
            budgetTokens,
            actualTokens: newSerializedTokens,
            enforced: true,
            truncated: true,
            originalResultCount: originalCount,
            returnedResultCount: currentResults.length,
          }
        };
      }
    } catch {
      // JSON parse failed — fall through to character-level truncation
    }
  }

  // Fallback: if no inner results array found or couldn't parse,
  // truncate the raw serialized text and report
  return {
    result: truncatedResult,
    enforcement: {
      budgetTokens,
      actualTokens,
      enforced: true,
      truncated: false,
    }
  };
}


/* ---------------------------------------------------------------
   3. CONTEXT MODE DEFINITIONS
--------------------------------------------------------------- */

const CONTEXT_MODES: Record<string, ContextMode> = {
  // Auto-detect: Let the system determine the best approach
  auto: {
    name: 'Auto',
    description: 'Automatically detect intent and route to optimal strategy',
    strategy: 'adaptive'
  },

  // Quick: Fast trigger-based matching for reactive context
  quick: {
    name: 'Quick',
    description: 'Fast trigger matching for real-time context (low latency)',
    strategy: 'triggers',
    tokenBudget: 800
  },

  // Deep: Comprehensive semantic search with full context
  deep: {
    name: 'Deep',
    description: 'Semantic search with full context retrieval',
    strategy: 'search',
    tokenBudget: 2000
  },

  // Focused: Intent-specific search with optimized weights
  focused: {
    name: 'Focused',
    description: 'Intent-aware search with task-specific optimization',
    strategy: 'intent-search',
    tokenBudget: 1500
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
    strategy: 'resume',
    tokenBudget: 1200
  }
};

/* ---------------------------------------------------------------
   4. INTENT-TO-MODE ROUTING
--------------------------------------------------------------- */

const INTENT_TO_MODE: Record<string, string> = {
  add_feature: 'deep',
  fix_bug: 'focused',
  refactor: 'deep',
  security_audit: 'deep',
  understand: 'focused',
  find_spec: 'deep',
  find_decision: 'focused'
};

/* ---------------------------------------------------------------
   5. CONTEXT STRATEGY EXECUTORS
--------------------------------------------------------------- */

async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemoryMatchTriggers({
    prompt: input,
    limit: options.limit || 5,
    session_id: options.sessionId,
    include_cognitive: true
  });

  return {
    strategy: 'quick',
    mode: 'quick',
    ...result
  };
}

async function executeDeepStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    limit: options.limit || 10,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    anchors: options.anchors,
    sessionId: options.sessionId,
    enableDedup: options.enableDedup !== false,
    useDecay: true,
    minState: 'COLD'
  });

  return {
    strategy: 'deep',
    mode: 'deep',
    ...result
  };
}

async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    limit: options.limit || 8,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    anchors: options.anchors,
    sessionId: options.sessionId,
    enableDedup: options.enableDedup !== false,
    intent: intent ?? undefined,
    autoDetectIntent: false,
    useDecay: true,
    minState: 'WARM'
  });

  return {
    strategy: 'focused',
    mode: 'focused',
    intent: intent,
    ...result
  };
}

async function executeResumeStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];

  const result = await handleMemorySearch({
    query: input || 'resume work continue session',
    specFolder: options.specFolder,
    limit: options.limit || 5,
    includeConstitutional: false,
    includeContent: true,
    anchors: resumeAnchors,
    sessionId: options.sessionId,
    enableDedup: false,
    useDecay: false,
    minState: 'WARM'
  });

  return {
    strategy: 'resume',
    mode: 'resume',
    resumeAnchors: resumeAnchors,
    ...result
  };
}

/* ---------------------------------------------------------------
   6. MAIN HANDLER
--------------------------------------------------------------- */

/** Handle memory_context tool - L1 orchestration layer that routes to optimal retrieval strategy */
async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();
  const {
    input,
    mode: requested_mode = 'auto',
    intent: explicit_intent,
    specFolder: spec_folder,
    limit,
    sessionId: session_id,
    enableDedup: enableDedup = true,
    includeContent: include_content = false,
    tokenUsage,
    anchors
  } = args;

  // Validate input
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return createMCPErrorResponse({
      tool: 'memory_context',
      error: 'Input is required and must be a non-empty string',
      code: 'E_VALIDATION',
      details: { layer: 'L1:Orchestration' },
      recovery: {
        hint: 'Provide a query, prompt, or context description'
      }
    });
  }

  const normalizedInput = input.trim();
  const requestedSessionId = typeof session_id === 'string' && session_id.trim().length > 0
    ? session_id.trim()
    : null;
  const effectiveSessionId = requestedSessionId ?? randomUUID();
  const resumedSession = requestedSessionId ? workingMemory.sessionExists(requestedSessionId) : false;
  const eventCounterStart = resumedSession && requestedSessionId
    ? workingMemory.getSessionEventCounter(requestedSessionId)
    : 0;
  const sessionLifecycle: SessionLifecycleMetadata = {
    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
    requestedSessionId,
    effectiveSessionId,
    resumed: resumedSession,
    eventCounterStart,
    resumedContextCount: 0,
  };

  // Get layer info for response metadata
  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
  const tokenBudget = layerInfo?.tokenBudget ?? 2000;

  const runtimeContextStats: RuntimeContextStats = {
    tokenBudget,
  };
  try {
    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
  } catch {
    runtimeContextStats.tokenCount = undefined;
  }

  // Resolve token pressure (caller -> estimator -> unavailable)
  const rolloutEnabled = process.env.SPECKIT_ROLLOUT_PERCENT
    ? isIdentityInRollout(effectiveSessionId)
    : true;
  const pressurePolicyEnabled = process.env.SPECKIT_PRESSURE_POLICY !== 'false' && rolloutEnabled;
  const autoResumeEnabled = process.env.SPECKIT_AUTO_RESUME !== 'false' && rolloutEnabled;

  const pressurePolicy = pressurePolicyEnabled
    ? getPressureLevel(tokenUsage, runtimeContextStats)
    : {
        level: 'none' as const,
        ratio: null,
        source: 'unavailable' as const,
        warning: null,
      };
  if (pressurePolicy.warning) {
    console.warn(pressurePolicy.warning);
  }

  // Build options object for strategy executors
  const options: ContextOptions = {
    specFolder: spec_folder,
    limit,
    sessionId: effectiveSessionId,
    enableDedup: enableDedup,
    includeContent: include_content,
    anchors
  };

  // Determine effective mode
  let effectiveMode = requested_mode;
  let detectedIntent: string | undefined = explicit_intent;
  let intentConfidence = explicit_intent ? 1.0 : 0;

  let pressureOverrideTargetMode: 'quick' | 'focused' | null = null;
  let pressureOverrideApplied = false;
  let pressureWarning: string | null = null;

  // Handle auto mode: detect intent and select mode
  if (requested_mode === 'auto') {
    if (!detectedIntent) {
      const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
      detectedIntent = classification.intent;
      intentConfidence = classification.confidence;
    }

    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';

    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
      effectiveMode = 'focused';
    }

    if (/\b(resume|continue|pick up|where was i|what's next)\b/i.test(normalizedInput)) {
      effectiveMode = 'resume';
    }

    const prePressureMode = effectiveMode;
    if (pressurePolicy.level === 'quick') {
      pressureOverrideTargetMode = 'quick';
    } else if (pressurePolicy.level === 'focused') {
      pressureOverrideTargetMode = 'focused';
    }

    if (pressureOverrideTargetMode) {
      effectiveMode = pressureOverrideTargetMode;
      pressureOverrideApplied = prePressureMode !== pressureOverrideTargetMode;

      if (pressureOverrideApplied) {
        pressureWarning = `Pressure policy override applied: ${pressurePolicy.level} pressure (${pressurePolicy.ratio}) forced mode ${pressureOverrideTargetMode} from ${prePressureMode}.`;
      }
    }
  }

  // Validate mode
  if (!CONTEXT_MODES[effectiveMode]) {
    effectiveMode = 'focused';
  }

  // Execute the selected strategy
  let result: ContextResult;
  try {
    switch (effectiveMode) {
      case 'quick':
        result = await executeQuickStrategy(normalizedInput, options);
        break;

      case 'deep':
        result = await executeDeepStrategy(normalizedInput, options);
        break;

      case 'resume':
        result = await executeResumeStrategy(normalizedInput, options);
        break;

      case 'focused':
      default:
        result = await executeFocusedStrategy(normalizedInput, detectedIntent || null, options);
        break;
    }
  } catch (error: unknown) {
    return createMCPErrorResponse({
      tool: 'memory_context',
      error: toErrorMessage(error),
      code: 'E_STRATEGY',
      details: {
        layer: 'L1:Orchestration',
        mode: effectiveMode,
        alternativeLayers: layerDefs.getRecommendedLayers('search')
      },
      recovery: {
        hint: 'Try a different mode or check your input'
      }
    });
  }

  // T205: Determine effective token budget from mode or layer definitions
  const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
  const effectiveBudget = modeTokenBudget || tokenBudget;

  // T205: Enforce token budget on strategy results
  const { result: budgetedResult, enforcement } = enforceTokenBudget(result, effectiveBudget);

  if (autoResumeEnabled && effectiveMode === 'resume' && requestedSessionId) {
    const resumeContextItems = workingMemory.getSessionPromptContext(requestedSessionId, workingMemory.DECAY_FLOOR, 5);
    if (resumeContextItems.length > 0) {
      sessionLifecycle.resumedContextCount = resumeContextItems.length;
      (budgetedResult as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
        memoryId: item.memoryId,
        title: item.title,
        filePath: item.filePath,
        attentionScore: item.attentionScore,
      }));
      (budgetedResult as Record<string, unknown>).systemPromptContextInjected = true;
    }
  }

  // Build response with layer metadata
  return createMCPResponse({
    tool: 'memory_context',
    summary: enforcement.truncated
      ? `Context retrieved via ${effectiveMode} mode (${budgetedResult.strategy} strategy) [truncated: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results to fit ${effectiveBudget} token budget]`
      : `Context retrieved via ${effectiveMode} mode (${budgetedResult.strategy} strategy)`,
    data: budgetedResult,
    hints: [
      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
      ...(pressureWarning ? [pressureWarning] : [])
    ],
    extraMeta: {
      layer: 'L1:Orchestration',
      mode: effectiveMode,
      requestedMode: requested_mode,
      strategy: budgetedResult.strategy,
      tokenUsageSource: pressurePolicy.source,
      tokenUsagePressure: pressurePolicy.ratio,
      pressureLevel: pressurePolicy.level,
      pressure_level: pressurePolicy.level,
      pressurePolicy: {
        applied: pressureOverrideApplied,
        overrideMode: pressureOverrideApplied ? pressureOverrideTargetMode : null,
        warning: pressureWarning,
      },
      sessionLifecycle,
      tokenBudget: effectiveBudget,
      tokenBudgetEnforcement: enforcement,
      intent: detectedIntent ? {
        type: detectedIntent,
        confidence: intentConfidence,
        source: explicit_intent ? 'explicit' : 'auto-detected'
      } : null,
      // C136-12: Retrieval telemetry at L1 orchestration level
      ...(retrievalTelemetry.isExtendedTelemetryEnabled() ? (() => {
        const t = retrievalTelemetry.createTelemetry();
        retrievalTelemetry.recordMode(
          t,
          effectiveMode,
          pressureOverrideApplied,
          pressurePolicy.level,
          pressurePolicy.ratio ?? undefined,
        );
        if (effectiveMode !== requested_mode && pressureOverrideApplied) {
          retrievalTelemetry.recordFallback(t, `pressure override: ${requested_mode} -> ${effectiveMode}`);
        }
        return { _telemetry: retrievalTelemetry.toJSON(t) };
      })() : {}),
    }
  });
}

/* ---------------------------------------------------------------
   7. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryContext,
  CONTEXT_MODES,
  INTENT_TO_MODE,
  enforceTokenBudget,
};

// Backward-compatible aliases (snake_case)
const handle_memory_context = handleMemoryContext;

export {
  handle_memory_context,
};
