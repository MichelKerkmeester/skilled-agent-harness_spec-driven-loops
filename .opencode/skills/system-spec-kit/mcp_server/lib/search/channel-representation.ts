// ───────────────────────────────────────────────────────────────
// MODULE: Channel Representation
// ───────────────────────────────────────────────────────────────
/* --- 1. CONSTANTS --- */

/** Quality floor for raw-RRF-scale relevance scores (~0.01-0.03).
 * Channels below this floor are treated as noise and cannot force a
 * min-representation slot. */

// Feature catalog: Channel min-representation
import { isChannelMinRepEnabled } from './search-flags.js';

export const QUALITY_FLOOR = 0.005;

/* --- 2. INTERFACES --- */

/** A single item that may appear in a top-k result set. */
interface TopKItem {
  id: number | string;
  score: number;
  source: string;
  sources?: string[];
  [key: string]: unknown;
}

/** A promoted item – a TopKItem augmented with the channel name it was lifted from. */
interface PromotedItem {
  id: number | string;
  score: number;
  source: string;
  promotedFrom: string;
  promotedRawScore: number;
  [key: string]: unknown;
}

/** A raw result from a single retrieval channel (no source field required). */
interface ChannelResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

/**
 * Return value of `analyzeChannelRepresentation`.
 *
 * - `topK`                   — original top-k plus any promoted items appended at the end
 * - `promoted`               — items that were promoted from under-represented channels
 * - `underRepresentedChannels` — channel names that had 0 results in topK but did return eligible results
 * - `channelCounts`          — per-channel result counts in the final (enhanced) topK
 */
export interface ChannelRepresentationResult {
  topK: Array<TopKItem>;
  promoted: Array<PromotedItem>;
  underRepresentedChannels: string[];
  channelCounts: Record<string, number>;
}

/* --- 3. CORE FUNCTION --- */

/**
 * Analyse a post-fusion top-k result set and, when the feature flag is
 * enabled, promote the best-scoring result from every channel that
 * contributed eligible results but has zero representation in top-k.
 *
 * Rules:
 *  - Only checks channels with results at or above QUALITY_FLOOR.
 *  - A channel is under-represented when it has 0 results in topK.
 *  - Missing channels promote their best eligible result.
 *  - When the flag is disabled the function returns topK unchanged (no-op).
 *  - The `source` field of each topK item is the authoritative channel label.
 *    Items that carry a `sources` array (multi-channel convergence) are counted
 *    toward each channel listed in that array.
 *
 * @param topK              - Ordered top-k results from RRF fusion.
 * @param allChannelResults - Map of channel name → raw results for that channel.
 * @returns ChannelRepresentationResult with enhanced topK and promotion metadata.
 */
export function analyzeChannelRepresentation(
  topK: Array<TopKItem>,
  allChannelResults: Map<string, Array<ChannelResult>>,
): ChannelRepresentationResult {
  // Feature flag gate — return topK unchanged when disabled.
  if (!isChannelMinRepEnabled()) {
    return {
      topK: [...topK],
      promoted: [],
      underRepresentedChannels: [],
      channelCounts: computeChannelCounts(topK),
    };
  }

  // Edge case: nothing to analyse.
  if (topK.length === 0 || allChannelResults.size === 0) {
    return {
      topK: [...topK],
      promoted: [],
      underRepresentedChannels: [],
      channelCounts: {},
    };
  }

  const eligibleChannelResults = new Map<string, Array<ChannelResult>>();
  for (const [channelName, channelResults] of allChannelResults) {
    const eligibleResults = channelResults.filter(result => result.score >= QUALITY_FLOOR);
    if (eligibleResults.length > 0) {
      eligibleChannelResults.set(channelName, eligibleResults);
    }
  }

  // Compute which channels are represented in the current top-k.
  const representedChannels = new Set<string>();
  for (const item of topK) {
    // Count primary source
    representedChannels.add(item.source);
    // Also count any additional sources (multi-channel convergence)
    if (Array.isArray(item.sources)) {
      for (const s of item.sources) {
        representedChannels.add(s);
      }
    }
  }

  // Identify which eligible channels are missing from top-k.
  const underRepresentedChannels: string[] = [];
  for (const [channelName] of eligibleChannelResults) {
    if (!representedChannels.has(channelName)) {
      underRepresentedChannels.push(channelName);
    }
  }

  // No gaps — nothing to promote.
  if (underRepresentedChannels.length === 0) {
    return {
      topK: [...topK],
      promoted: [],
      underRepresentedChannels: [],
      channelCounts: computeChannelCounts(topK),
    };
  }

  // Padding appends one item per missing channel; the caller reserves top-k slots.
  const promoted: PromotedItem[] = [];
  const enhancedTopK: Array<TopKItem> = [...topK];

  for (const channelName of underRepresentedChannels) {
    const results = eligibleChannelResults.get(channelName) ?? [];

    let best: ChannelResult | null = null;
    for (const r of results) {
      if (best === null || r.score > best.score) {
        best = r;
      }
    }

    if (best === null) continue;

    const promotedItem: PromotedItem = {
      ...best,
      source: channelName,
      promotedFrom: channelName,
      promotedRawScore: best.score,
    };

    promoted.push(promotedItem);
    enhancedTopK.push({ ...promotedItem });
  }

  return {
    topK: enhancedTopK,
    promoted,
    underRepresentedChannels: [...underRepresentedChannels],
    channelCounts: computeChannelCounts(enhancedTopK),
  };
}

/* --- 5. HELPERS --- */

/**
 * Count how many items in an array belong to each channel.
 * Uses the `source` field as the channel identifier.
 *
 * @param items - Array of TopKItem results to tally.
 * @returns Record mapping channel name to item count.
 */
function computeChannelCounts(items: Array<TopKItem>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.source] = (counts[item.source] ?? 0) + 1;
  }
  return counts;
}

export { isChannelMinRepEnabled };
