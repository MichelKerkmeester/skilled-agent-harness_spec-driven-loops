// ───────────────────────────────────────────────────────────────
// MODULE: Memory Triggers
// ───────────────────────────────────────────────────────────────
// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Feature catalog: Trigger phrase matching (memory_match_triggers)
// Feature catalog: BM25 trigger phrase re-index gate
// Feature catalog: Classification-based decay


/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

// Core utilities
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';
import { createFilePathValidator } from '../utils/validators.js';

// Formatters
import { calculateTokenMetrics, estimateTokens, type TokenMetrics } from '../formatters/index.js';

// Lib modules
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import {
  computeSemanticTriggerShadow,
  isSemanticTriggerShadowEnabled,
  loadSemanticTriggerCache,
  lookupCachedQueryEmbedding,
  matchSemanticTriggers,
  type SemanticMatch,
  type SemanticTriggerShadowStats,
} from '../lib/triggers/semantic-trigger-matcher.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as attentionDecay from '../lib/cognitive/attention-decay.js';
import * as tierClassifier from '../lib/cognitive/tier-classifier.js';
import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier.js';
import * as coActivation from '../lib/cognitive/co-activation.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';

// Standardized response structure
import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
// Consumption instrumentation
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger.js';

// Shared handler types
import type { MCPResponse } from './types.js';
// C2 FIX: Import DB access for scope filtering
import { initialize_db } from '../lib/search/vector-index-store.js';
// Import session manager for trusted session validation (IDOR prevention)
import * as sessionManager from '../lib/session/session-manager.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  matchSource?: 'lexical' | 'semantic';
  semanticScore?: number;
  [key: string]: unknown;
}

type SemanticTriggerMode = 'shadow' | 'union';

interface SemanticTriggerUnionStats {
  enabled: true;
  mode: 'union';
  status: 'skipped_shadow_mode' | 'skipped_strong_lexical' | 'skipped_strong_lexical_command' | 'skipped_lexical_sufficient' | 'no_query_embedding' | 'no_trigger_embeddings' | 'computed' | 'failed';
  lexicalCount: number;
  semanticCount: number;
  addedCount: number;
  topScore: number | null;
  latencyMs: number;
  error?: string;
}

interface EnrichedTriggerMatch extends TriggerMatch {
  attentionScore: number;
  tier: string;
  coActivated: boolean;
}

interface FormattedResult {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  tier?: string;
  attentionScore?: number;
  content?: string;
  coActivated?: boolean;
  [key: string]: unknown;
}

interface DecayStats {
  decayedCount: number;
}

interface CoActivatedMemory {
  memoryId: number;
}

interface WorkingMemoryEntry {
  memoryId: number;
  attentionScore: number;
}

interface CognitiveStats {
  enabled: boolean;
  sessionId: string;
  turnNumber: number;
  decayApplied: number;
  memoriesActivated: number;
  coActivations: number;
  tierDistribution: StateStats;
  tokenMetrics: TokenMetrics;
}

interface TriggerArgs {
  prompt: string;
  specFolder?: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
  tenantId?: string;
  userId?: string;
  agentId?: string;
}

/* ───────────────────────────────────────────────────────────────
   2b. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Per-turn decay rate for attention scoring. */
const TURN_DECAY_RATE = 0.98;
const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/* ───────────────────────────────────────────────────────────────
   2c. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/** Fetch full memory records required for FSRS tier classification. */
function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
  const records = new Map<number, TierInput>();
  if (memoryIds.length === 0) return records;

  const db = attentionDecay.getDb();
  if (!db) return records;

  try {
    const stmt = db.prepare(
      'SELECT * FROM memory_index WHERE id = ?'
    );
    for (const id of memoryIds) {
      const row = stmt.get(id) as TierInput | undefined;
      if (row) {
        records.set(row.id as number, row);
      }
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
  }

  return records;
}

function getSemanticTriggerMode(): SemanticTriggerMode {
  return process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE?.trim().toLowerCase() === 'union'
    ? 'union'
    : 'shadow';
}

function isStrongLexicalCommand(prompt: string, matches: readonly TriggerMatch[]): boolean {
  const normalizedPrompt = triggerMatcher.normalizeTriggerText(prompt);
  return matches.some((match) => match.matchedPhrases.some((phrase) => {
    const normalizedPhrase = triggerMatcher.normalizeTriggerText(phrase);
    return normalizedPhrase === normalizedPrompt;
  }));
}

function isExplicitCommandPrompt(prompt: string): boolean {
  return prompt.trim().startsWith('/');
}

function isLexicalStageWeak(matches: readonly TriggerMatch[], limit: number): boolean {
  return matches.length === 0 || matches.length < limit;
}

function semanticMatchToTriggerMatch(match: SemanticMatch): TriggerMatch {
  return {
    memoryId: match.memoryId,
    specFolder: match.specFolder,
    filePath: match.filePath,
    title: match.title,
    matchedPhrases: match.matchedPhrases,
    importanceWeight: match.importanceWeight,
    matchSource: 'semantic',
    semanticScore: match.score,
  };
}

function mergeTriggerResults(lexicalMatches: readonly TriggerMatch[], semanticMatches: readonly SemanticMatch[]): TriggerMatch[] {
  const seen = new Set<number>();
  const merged: TriggerMatch[] = [];
  for (const match of lexicalMatches) {
    seen.add(match.memoryId);
    merged.push({ ...match, matchSource: 'lexical' });
  }
  for (const match of semanticMatches) {
    if (seen.has(match.memoryId)) {
      continue;
    }
    seen.add(match.memoryId);
    merged.push(semanticMatchToTriggerMatch(match));
  }
  return merged;
}

function getTriggerActivationScore(match: TriggerMatch): number {
  if (match.matchSource !== 'semantic') {
    return 1.0;
  }
  const semanticScore = typeof match.semanticScore === 'number' && Number.isFinite(match.semanticScore)
    ? match.semanticScore
    : 0;
  return Math.max(0, Math.min(0.85, semanticScore));
}

function filterSemanticMatchesByScope(
  database: ReturnType<typeof initialize_db>,
  matches: readonly SemanticMatch[],
  args: TriggerArgs,
): SemanticMatch[] {
  const { specFolder, tenantId, userId, agentId } = args;
  if ((!specFolder && !tenantId && !userId && !agentId) || matches.length === 0) {
    return [...matches];
  }

  const placeholders = matches.map(() => '?').join(',');
  const scopeRows = database.prepare(`
    SELECT id, spec_folder, tenant_id, user_id, agent_id
    FROM memory_index WHERE id IN (${placeholders})
  `).all(...matches.map((match) => match.memoryId)) as Array<{
    id: number;
    spec_folder?: string;
    tenant_id?: string;
    user_id?: string;
    agent_id?: string;
  }>;
  const scopeMap = new Map(scopeRows.map((row) => [row.id, row]));
  return matches.filter((match) => {
    const row = scopeMap.get(match.memoryId);
    if (!row) return false;
    if (specFolder && row.spec_folder !== specFolder) return false;
    if (tenantId && row.tenant_id !== tenantId) return false;
    if (userId && row.user_id !== userId) return false;
    if (agentId && row.agent_id !== agentId) return false;
    return true;
  });
}

/** Result shape returned by getTieredContent */
interface TieredContentResult {
  /** Truncated content for MCP output (full for HOT, 150-char summary for WARM, empty for COLD) */
  content: string;
  /**
   * Token count of the complete file before any truncation. Populated for WARM entries
   * so calculateTokenMetrics can use the real file size as the hypothetical baseline
   * rather than scaling up the summary window with a fixed multiplier.
   */
  fullContentTokens: number;
}

/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
async function getTieredContent(
  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
  tier: string
): Promise<TieredContentResult> {
  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return { content: '', fullContentTokens: 0 };
  try {
    const fs = await import('fs');
    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
    const content = fs.readFileSync(canonicalPath, 'utf-8');
    if (tier === 'HOT') return { content, fullContentTokens: estimateTokens(content) };
    // WARM tier: capture full token count before truncating to summary window
    const fullContentTokens = estimateTokens(content);
    const summary = content.substring(0, 150) + (content.length > 150 ? '...' : '');
    return { content: summary, fullContentTokens };
  } catch (_error: unknown) {
    console.warn('[memory-triggers] getTieredContent failed', {
      filePath: memoryInfo.filePath, // server-side only; safe to log
      tier,
      error: _error instanceof Error ? _error.message : String(_error),
    });
    return { content: '', fullContentTokens: 0 };
  }
}

/* ───────────────────────────────────────────────────────────────
   3. MATCH TRIGGERS HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_match_triggers');
  const {
    prompt,
    limit: rawLimit = 3,
    session_id: rawSessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!prompt || typeof prompt !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_match_triggers',
      error: 'prompt is required and must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'prompt' },
      recovery: {
        hint: 'Provide a non-empty string for the prompt parameter'
      }
    });
  }

  // SECURITY: Validate caller-supplied sessionId through server-side session
  // manager to prevent IDOR. Callers cannot read/write working memory for
  // arbitrary sessions — only server-minted or previously tracked sessions.
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId: args.tenantId,
      userId: args.userId,
      agentId: args.agentId,
    });
    if (trustedSession.error) {
      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
      return createMCPErrorResponse({
        tool: 'memory_match_triggers',
        error: trustedSession.error,
        code: 'E_SESSION_SCOPE',
        details: { requestedSessionId: rawSessionId },
        recovery: {
          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
        },
      });
    }
    sessionId = trustedSession.effectiveSessionId;
  }

  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  await checkDatabaseUpdated();

  const startTime = Date.now();

  // Eval logger — capture trigger query at entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: prompt,
      intent: 'trigger_match',
      specFolder: null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }

  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
    try {
      if (_evalRunId && _evalQueryId) {
        logFinalResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          resultMemoryIds: memoryIds,
          scores: memoryIds.map(() => 1.0), // trigger matches are binary
          fusionMethod: 'trigger',
          latencyMs,
        });
      }
    } catch (_error: unknown) {
      /* eval logging must never break triggers handler */
    }
  };

  const useCognitive = includeCognitive &&
    sessionId &&
    workingMemory.isEnabled() &&
    attentionDecay.getDb();

  let decayStats: DecayStats | null = null;
  if (useCognitive) {
    try {
      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory_match_triggers] Decay failed:', message);
    }
  }

  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
  let results: TriggerMatch[] = triggerMatchResult.matches;

  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
  const { specFolder, tenantId, userId, agentId } = args;
  if (specFolder || tenantId || userId || agentId) {
    try {
      const database = initialize_db();
      const memoryIds = results.map(r => r.memoryId);
      if (memoryIds.length > 0) {
        const placeholders = memoryIds.map(() => '?').join(',');
        const scopeRows = database.prepare(`
          SELECT id, spec_folder, tenant_id, user_id, agent_id
          FROM memory_index WHERE id IN (${placeholders})
        `).all(...memoryIds) as Array<{
          id: number;
          spec_folder?: string;
          tenant_id?: string;
          user_id?: string;
          agent_id?: string;
        }>;
        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
        results = results.filter(match => {
          const row = scopeMap.get(match.memoryId);
          if (!row) return false;
          // Scoped requests fail closed so unscoped rows cannot leak into scoped results.
          if (specFolder && row.spec_folder !== specFolder) return false;
          if (tenantId && row.tenant_id !== tenantId) return false;
          if (userId && row.user_id !== userId) return false;
          if (agentId && row.agent_id !== agentId) return false;
          return true;
        });
      }
    } catch (scopeErr: unknown) {
      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
      results = [];
    }
  }
  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
    ? triggerMatchResult.stats.signals
    : [];
  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
  let semanticTriggerShadow: SemanticTriggerShadowStats | null = null;
  let semanticTriggerUnion: SemanticTriggerUnionStats | null = null;
  const semanticTriggersEnabled = isSemanticTriggerShadowEnabled();
  const semanticTriggerMode = getSemanticTriggerMode();
  const strongLexicalMatch = isStrongLexicalCommand(prompt, results);
  const strongLexicalCommandMatch = strongLexicalMatch && isExplicitCommandPrompt(prompt);
  if (semanticTriggersEnabled && semanticTriggerMode === 'union') {
    const unionStartTime = Date.now();
    if (strongLexicalMatch) {
      semanticTriggerUnion = {
        enabled: true,
        mode: 'union',
        status: strongLexicalCommandMatch ? 'skipped_strong_lexical_command' : 'skipped_strong_lexical',
        lexicalCount: results.length,
        semanticCount: 0,
        addedCount: 0,
        topScore: null,
        latencyMs: Date.now() - unionStartTime,
      };
    } else if (!isLexicalStageWeak(results, limit)) {
      semanticTriggerUnion = {
        enabled: true,
        mode: 'union',
        status: 'skipped_lexical_sufficient',
        lexicalCount: results.length,
        semanticCount: 0,
        addedCount: 0,
        topScore: null,
        latencyMs: Date.now() - unionStartTime,
      };
    } else {
      try {
        const semanticDatabase = initialize_db();
        const queryEmbedding = lookupCachedQueryEmbedding(semanticDatabase, prompt);
        if (!queryEmbedding) {
          semanticTriggerUnion = {
            enabled: true,
            mode: 'union',
            status: 'no_query_embedding',
            lexicalCount: results.length,
            semanticCount: 0,
            addedCount: 0,
            topScore: null,
            latencyMs: Date.now() - unionStartTime,
          };
        } else {
          const semanticCache = loadSemanticTriggerCache(semanticDatabase);
          if (semanticCache.length === 0) {
            semanticTriggerUnion = {
              enabled: true,
              mode: 'union',
              status: 'no_trigger_embeddings',
              lexicalCount: results.length,
              semanticCount: 0,
              addedCount: 0,
              topScore: null,
              latencyMs: Date.now() - unionStartTime,
            };
          } else {
            const semanticMatches = filterSemanticMatchesByScope(
              semanticDatabase,
              matchSemanticTriggers(queryEmbedding, semanticCache, { max: limit }),
              args,
            );
            const mergedResults = mergeTriggerResults(results, semanticMatches);
            semanticTriggerUnion = {
              enabled: true,
              mode: 'union',
              status: 'computed',
              lexicalCount: results.length,
              semanticCount: semanticMatches.length,
              addedCount: mergedResults.length - results.length,
              topScore: semanticMatches[0]?.score ?? null,
              latencyMs: Date.now() - unionStartTime,
            };
            results = mergedResults;
          }
        }
      } catch (unionErr: unknown) {
        semanticTriggerUnion = {
          enabled: true,
          mode: 'union',
          status: 'failed',
          lexicalCount: results.length,
          semanticCount: 0,
          addedCount: 0,
          topScore: null,
          latencyMs: Date.now() - unionStartTime,
          error: toErrorMessage(unionErr),
        };
        console.warn('[memory_match_triggers] Semantic trigger union failed:', toErrorMessage(unionErr));
      }
    }
  }
  try {
    if (semanticTriggersEnabled && semanticTriggerMode === 'shadow' && !strongLexicalMatch) {
      const semanticDatabase = initialize_db();
      semanticTriggerShadow = computeSemanticTriggerShadow(
        semanticDatabase,
        prompt,
        results.map((match) => match.memoryId),
      );
      // stderr, not stdout: under stdio transport stdout carries JSON-RPC frames.
      console.error('[memory_match_triggers] Semantic trigger shadow', semanticTriggerShadow);
    }
  } catch (shadowErr: unknown) {
    semanticTriggerShadow = {
      enabled: true,
      status: 'failed',
      lexicalCount: results.length,
      semanticCount: 0,
      overlapCount: 0,
      topScore: null,
      latencyMs: 0,
      error: toErrorMessage(shadowErr),
    };
    console.warn('[memory_match_triggers] Semantic trigger shadow failed:', toErrorMessage(shadowErr));
  }

  if (!results || results.length === 0) {
    const noMatchResponse = createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
        degradedMatching: degradedTriggerMatching,
        triggerSignals: detectedSignals,
        ...(semanticTriggerShadow ? { semanticTriggerShadow } : {}),
        ...(semanticTriggerUnion ? { semanticTriggerUnion } : {}),
        cognitive: useCognitive ? {
          enabled: true,
          sessionId,
          turnNumber: turnNumber,
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content',
        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
      ],
      startTime: startTime
    });

    logFinalTriggerEval([], Date.now() - startTime);
    return noMatchResponse;
  }

  let formattedResults: FormattedResult[];
  let cognitiveStats: CognitiveStats | null = null;

  if (useCognitive) {
    // Activate matched memories.
    const activatedMemories: number[] = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(match.memoryId);
        workingMemory.setAttentionScore(sessionId as string, match.memoryId, getTriggerActivationScore(match));
        activatedMemories.push(match.memoryId);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
      }
    }

    // Step 4: CO-ACTIVATE
    const coActivatedMemories: CoActivatedMemory[] = [];
    if (coActivation.isEnabled()) {
      for (const memoryId of activatedMemories) {
        try {
          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
            .map(r => ({ memoryId: r.id }));
          if (boosted && Array.isArray(boosted)) {
            coActivatedMemories.push(...boosted);
          }
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
        }
      }
    }

    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
    const fullRecords = fetchMemoryRecords(matchedIds);

    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));

    const turnDecayFactor = turnNumber > 1
      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
      : 1.0;

    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
      const fullRecord = fullRecords.get(match.memoryId);
      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);

      let attentionScore: number;
      let tier: string;

      if (fullRecord) {
        const classification = tierClassifier.classifyTier(fullRecord);
        let effectiveRetrievability = classification.retrievability;

        if (wmEntry) {
          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
        } else {
          effectiveRetrievability *= turnDecayFactor;
        }

        attentionScore = effectiveRetrievability;
        tier = tierClassifier.classifyState(effectiveRetrievability);
      } else {
        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
        tier = tierClassifier.classifyState(attentionScore);
      }

      // Clamp to [0,1] — retrievability * decay or wmEntry scores
      // Can drift outside the valid range due to floating-point arithmetic.
      attentionScore = Math.max(0, Math.min(1, attentionScore));

      return {
        ...match,
        attentionScore: attentionScore,
        tier,
        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);

    // Resolve tiered content for each result. getTieredContent returns the display
    // content (truncated for WARM) plus a pre-truncation token count used only for
    // savings% calculation — the latter is never forwarded to MCP output.
    const tieredContent = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) =>
      getTieredContent({ filePath: r.filePath, title: r.title, triggerPhrases: r.matchedPhrases }, r.tier)
    ));

    formattedResults = tieredResults.map((r: EnrichedTriggerMatch, i: number) => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight,
      matchSource: r.matchSource,
      semanticScore: r.semanticScore,
      tier: r.tier,
      attentionScore: r.attentionScore,
      content: tieredContent[i].content,
      coActivated: r.coActivated || false
    }));

    // Metrics-only view: pairs each result with its pre-truncation token count so
    // calculateTokenMetrics can compute accurate savings% for WARM entries.
    const metricsResults = tieredResults.map((r: EnrichedTriggerMatch, i: number) => ({
      tier: r.tier,
      content: tieredContent[i].content,
      fullContentTokens: tieredContent[i].fullContentTokens,
    }));

    cognitiveStats = {
      enabled: true,
      sessionId: sessionId!,
      turnNumber: turnNumber,
      decayApplied: decayStats ? decayStats.decayedCount : 0,
      memoriesActivated: activatedMemories.length,
      coActivations: coActivatedMemories.length,
      tierDistribution: tierClassifier.getStateStats(enrichedResults),
      tokenMetrics: calculateTokenMetrics(results, metricsResults)
    };

  } else {
    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight,
      matchSource: r.matchSource,
      semanticScore: r.semanticScore,
    }));
  }

  const latencyMs = Date.now() - startTime;
  if (latencyMs > 100) {
    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
  }

  const summary = useCognitive
    ? `Matched ${formattedResults.length} memories with cognitive features`
    : `Matched ${formattedResults.length} memories via trigger phrases`;

  const hints: string[] = [];
  if (!useCognitive && sessionId) {
    hints.push('Enable cognitive features with include_cognitive: true');
  }
  const coldCount = cognitiveStats?.tierDistribution?.COLD;
  if (coldCount !== undefined && coldCount > 0) {
    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
  }
  if (detectedSignals.length > 0) {
    hints.push(`Signal vocabulary applied (${detectedSignals.length} category matches)`);
  }

  const _triggersResponse = createMCPSuccessResponse({
    tool: 'memory_match_triggers',
    summary,
    data: {
      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
      count: formattedResults.length,
      results: formattedResults,
      degradedMatching: degradedTriggerMatching,
      cognitive: cognitiveStats
    },
    hints,
    startTime: startTime,
      extraMeta: {
        latencyMs: latencyMs,
        triggerSignals: detectedSignals,
        ...(semanticTriggerShadow ? { semanticTriggerShadow } : {}),
        ...(semanticTriggerUnion ? { semanticTriggerUnion } : {}),
        ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
      }
  });

  // Consumption instrumentation — log triggers event (fail-safe, never throws)
  try {
    const db = attentionDecay.getDb();
    if (db) {
      initConsumptionLog(db);
      const resultIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
      logConsumptionEvent(db, {
        event_type: 'triggers',
        query: prompt,
        result_count: formattedResults.length,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: latencyMs,
      });
    }
  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }

  // Eval logger — capture final trigger results at exit (fail-safe)
  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
  logFinalTriggerEval(triggerMemoryIds, latencyMs);

  return _triggersResponse;
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryMatchTriggers,
};

// Backward-compatible aliases (snake_case)
const handle_memory_match_triggers = handleMemoryMatchTriggers;

export {
  handle_memory_match_triggers,
};
