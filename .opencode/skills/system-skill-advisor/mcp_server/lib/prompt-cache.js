// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Exact Prompt Cache
// ───────────────────────────────────────────────────────────────
import { createHmac, createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { isSpeckitMetricsEnabled, speckitMetrics } from './metrics.js';
export const ADVISOR_PROMPT_CACHE_TTL_MS = 5 * 60 * 1000;
export const ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS = 80;
export const ADVISOR_PROMPT_CACHE_MAX_TOKENS = 120;
export const MAX_CACHE_ENTRIES = 1000;
const SESSION_LAUNCH_TIME = performance.timeOrigin.toFixed(3);
const DEFAULT_SECRET = createHash('sha256')
    .update(`${process.pid}:${SESSION_LAUNCH_TIME}:${Math.random()}`)
    .digest();
function stableThresholdConfig(thresholdConfig) {
    return JSON.stringify({
        confidenceThreshold: thresholdConfig?.confidenceThreshold ?? 0.8,
        uncertaintyThreshold: thresholdConfig?.uncertaintyThreshold ?? 0.35,
        confidenceOnly: thresholdConfig?.confidenceOnly ?? false,
        showRejections: thresholdConfig?.showRejections ?? false,
        includeAttribution: thresholdConfig?.includeAttribution ?? false,
        includeAbstainReasons: thresholdConfig?.includeAbstainReasons ?? false,
    });
}
function normalizeMaxTokens(maxTokens) {
    if (typeof maxTokens !== 'number' || Number.isNaN(maxTokens)) {
        return ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS;
    }
    return Math.min(Math.max(1, Math.floor(maxTokens)), ADVISOR_PROMPT_CACHE_MAX_TOKENS);
}
/** Build an opaque HMAC key for exact prompt-cache lookups. */
export function createAdvisorPromptCacheKey(parts, secret = DEFAULT_SECRET) {
    const payload = [
        parts.canonicalPrompt,
        parts.sourceSignature,
        parts.workspaceRoot ?? '',
        parts.runtime,
        String(normalizeMaxTokens(parts.maxTokens)),
        stableThresholdConfig(parts.thresholdConfig),
    ].join('\u001f');
    return createHmac('sha256', secret).update(payload).digest('hex');
}
/** In-memory exact cache for advisor briefs scoped to one host process. */
export class AdvisorPromptCache {
    ttlMs;
    secret;
    entries = new Map();
    constructor(ttlMs = ADVISOR_PROMPT_CACHE_TTL_MS, secret = DEFAULT_SECRET) {
        this.ttlMs = ttlMs;
        this.secret = secret;
    }
    /** Create an opaque cache key from normalized prompt/runtime/source inputs. */
    makeKey(parts) {
        return createAdvisorPromptCacheKey(parts, this.secret);
    }
    /** Return a live entry, evicting it first when its TTL has expired. */
    get(key, nowMs = performance.now()) {
        const entry = this.entries.get(key);
        if (!entry) {
            if (isSpeckitMetricsEnabled()) {
                speckitMetrics.incrementCounter('spec_kit.scorer.near_dup_cache_miss_total', { cache_layer: 'exact' });
                speckitMetrics.recordPromptCacheOutcome('miss');
            }
            return null;
        }
        if (entry.expiresAtMs <= nowMs) {
            this.entries.delete(key);
            if (isSpeckitMetricsEnabled()) {
                speckitMetrics.incrementCounter('spec_kit.scorer.near_dup_cache_miss_total', { cache_layer: 'exact' });
                speckitMetrics.recordPromptCacheOutcome('miss');
            }
            return null;
        }
        if (isSpeckitMetricsEnabled()) {
            speckitMetrics.recordPromptCacheOutcome('hit');
        }
        return entry;
    }
    /** Insert or replace an entry, sweeping expired rows and evicting oldest overflow. */
    set(args) {
        const createdAtMs = args.nowMs ?? performance.now();
        this.sweepExpired(createdAtMs);
        if (!this.entries.has(args.key)) {
            this.evictOldestUntilBelowLimit();
        }
        const entry = {
            key: args.key,
            sourceSignature: args.sourceSignature,
            value: args.value,
            skillLabels: [...new Set(args.skillLabels)].sort(),
            createdAtMs,
            expiresAtMs: createdAtMs + this.ttlMs,
        };
        this.entries.set(args.key, entry);
        return entry;
    }
    /** Remove a single cache entry by key. */
    invalidate(key) {
        this.entries.delete(key);
    }
    /** Drop entries produced from stale advisor source signatures. */
    invalidateSourceSignatureChange(currentSourceSignature) {
        let dropped = 0;
        for (const [key, entry] of this.entries) {
            if (entry.sourceSignature !== currentSourceSignature) {
                this.entries.delete(key);
                dropped += 1;
            }
        }
        return dropped;
    }
    /** Clear all cache entries, primarily for tests and session teardown. */
    clear() {
        this.entries.clear();
    }
    /** Return the number of live and unswept entries currently retained. */
    size() {
        return this.entries.size;
    }
    sweepExpired(nowMs) {
        for (const [key, entry] of this.entries) {
            if (entry.expiresAtMs <= nowMs) {
                this.entries.delete(key);
            }
        }
    }
    evictOldestUntilBelowLimit() {
        while (this.entries.size >= MAX_CACHE_ENTRIES) {
            const oldestKey = this.entries.keys().next().value;
            if (oldestKey === undefined) {
                return;
            }
            this.entries.delete(oldestKey);
        }
    }
}
export const advisorPromptCache = new AdvisorPromptCache();
//# sourceMappingURL=prompt-cache.js.map