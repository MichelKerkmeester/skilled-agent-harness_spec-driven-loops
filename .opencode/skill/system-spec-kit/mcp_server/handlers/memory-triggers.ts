// ---------------------------------------------------------------
// MODULE: Memory Triggers
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

// Core utilities
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters';

// Lib modules
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as workingMemory from '../lib/cache/cognitive/working-memory';
import * as attentionDecay from '../lib/cache/cognitive/attention-decay';
import * as tierClassifier from '../lib/cache/cognitive/tier-classifier';
import type { TierInput, StateStats } from '../lib/cache/cognitive/tier-classifier';
import * as coActivation from '../lib/cache/cognitive/co-activation';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPEmptyResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse } from './types';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  [key: string]: unknown;
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
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
}

/* ---------------------------------------------------------------
   2b. CONSTANTS
--------------------------------------------------------------- */

/**
 * T208: Per-turn decay rate for attention scoring.
 * At turnNumber=1, factor=1.0 (no decay).
 * At turnNumber=50, factor≈0.364. At turnNumber=100, factor≈0.133.
 * This ensures memories matched early in a conversation receive
 * progressively less attention weight as the conversation lengthens.
 */
const TURN_DECAY_RATE = 0.98;

/* ---------------------------------------------------------------
   2c. HELPER FUNCTIONS
--------------------------------------------------------------- */

/**
 * T201: Fetch full memory records from the database for a set of memory IDs.
 * Returns a Map<memoryId, TierInput> with all FSRS fields (stability,
 * last_review, importance_tier, etc.) needed for proper tier classification.
 */
function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
  const records = new Map<number, TierInput>();
  if (memoryIds.length === 0) return records;

  const db = attentionDecay.getDb();
  if (!db) return records;

  try {
    // Use individual lookups to avoid SQL injection with dynamic IN clause
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

/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
async function getTieredContent(
  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
  tier: string
): Promise<string> {
  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
  try {
    const fs = await import('fs');
    const content = fs.readFileSync(memoryInfo.filePath, 'utf-8');
    if (tier === 'HOT') return content;
    // WARM: return truncated summary
    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
  } catch {
    return '';
  }
}

/* ---------------------------------------------------------------
   3. MATCH TRIGGERS HANDLER
--------------------------------------------------------------- */

/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    prompt,
    limit: rawLimit = 3,
    session_id: sessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // T120: Validate numeric parameters
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('prompt is required and must be a string');
  }

  const startTime = Date.now();

  // Check if cognitive features are enabled and requested
  const useCognitive = includeCognitive &&
    sessionId &&
    workingMemory.isEnabled() &&
    attentionDecay.getDb();

  // Step 1: DECAY
  let decayStats: DecayStats | null = null;
  if (useCognitive) {
    try {
      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory_match_triggers] Decay failed:', message);
    }
  }

  // Step 2: MATCH
  const results: TriggerMatch[] = triggerMatcher.matchTriggerPhrases(prompt, limit * 2);

  if (!results || results.length === 0) {
    return createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
        cognitive: useCognitive ? {
          enabled: true,
          sessionId,
          turnNumber: turnNumber,
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content'
      ],
      startTime: startTime
    });
  }

  // Step 3-6: Apply cognitive features if enabled
  let formattedResults: FormattedResult[];
  let cognitiveStats: CognitiveStats | null = null;

  if (useCognitive) {
    // Step 3: ACTIVATE
    // T209: Boost attention scores in working memory for matched memories.
    // Both attentionDecay.activateMemory (FSRS-side) and workingMemory.setAttentionScore
    // (session-side) are called so matched memories are promoted in both systems.
    const activatedMemories: number[] = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(match.memoryId);
        // T209: Wire setAttentionScore — boost matched memory to 1.0 in working memory
        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
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

    // Step 5: CLASSIFY
    // T201 FIX: Fetch full memory records from DB for proper FSRS-based classification.
    // Previously, classification used only working-memory attention_score (defaulting to 1.0
    // for untracked memories), causing ALL trigger matches to classify as HOT.
    // Now uses classifyTier() with actual stability, last_review, importance_tier fields.
    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
    const fullRecords = fetchMemoryRecords(matchedIds);

    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));

    // T208: Calculate turn-based decay factor (turnNumber=1 → 1.0, higher → more decay)
    const turnDecayFactor = turnNumber > 1
      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
      : 1.0;

    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
      const fullRecord = fullRecords.get(match.memoryId);
      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);

      let attentionScore: number;
      let tier: string;

      if (fullRecord) {
        // T201: Use FSRS-based classification from full DB record
        const classification = tierClassifier.classifyTier(fullRecord);
        let effectiveRetrievability = classification.retrievability;

        // T208: Apply turn-based decay to retrievability
        effectiveRetrievability *= turnDecayFactor;

        // If memory is in working memory, use the lower of FSRS retrievability
        // and working memory attention (attention can pull DOWN, not UP)
        if (wmEntry) {
          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore * turnDecayFactor);
        }

        attentionScore = effectiveRetrievability;
        tier = tierClassifier.classifyState(effectiveRetrievability);
      } else {
        // Fallback: no DB record found, use working memory or default
        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
        attentionScore = baseScore * turnDecayFactor;
        tier = tierClassifier.classifyState(attentionScore);
      }

      return {
        ...match,
        attentionScore: attentionScore,
        tier,
        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    // Step 6: RETURN - Apply tier filtering and content depth
    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults);

    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
      const content: string = await getTieredContent({
        filePath: r.filePath,
        title: r.title,
        triggerPhrases: r.matchedPhrases
      }, r.tier);

      return {
        memoryId: r.memoryId,
        specFolder: r.specFolder,
        filePath: r.filePath,
        title: r.title,
        matchedPhrases: r.matchedPhrases,
        importanceWeight: r.importanceWeight,
        tier: r.tier,
        attentionScore: r.attentionScore,
        content: content,
        coActivated: r.coActivated || false
      };
    }));

    cognitiveStats = {
      enabled: true,
      sessionId: sessionId!,
      turnNumber: turnNumber,
      decayApplied: decayStats ? decayStats.decayedCount : 0,
      memoriesActivated: activatedMemories.length,
      coActivations: coActivatedMemories.length,
      tierDistribution: tierClassifier.getStateStats(enrichedResults),
      tokenMetrics: calculateTokenMetrics(results, formattedResults)
    };

  } else {
    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight
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

  return createMCPSuccessResponse({
    tool: 'memory_match_triggers',
    summary,
    data: {
      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
      count: formattedResults.length,
      results: formattedResults,
      cognitive: cognitiveStats
    },
    hints,
    startTime: startTime,
    extraMeta: {
      latencyMs: latencyMs
    }
  });
}

/* ---------------------------------------------------------------
   4. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryMatchTriggers,
};

// Backward-compatible aliases (snake_case)
const handle_memory_match_triggers = handleMemoryMatchTriggers;

export {
  handle_memory_match_triggers,
};
