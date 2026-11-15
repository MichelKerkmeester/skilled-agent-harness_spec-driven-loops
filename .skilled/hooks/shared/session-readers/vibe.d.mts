/**
 * Read one Vibe session journal from the session root a hook receives.
 * @param {{ transcriptPath?: string, sessionId?: string }} [options] - The
 *   hook payload's `transcript_path` (the session storage root), and the session
 *   id to prove when the caller has one.
 * @returns {{ ok: true, source: object, records: Array<object>, entries: Array<object>,
 *   journalRecords: Array<object>, turn: string | null }
 *   | { ok: false, code: string }}
 */
export function loadVibeSession({ transcriptPath, sessionId }?: {
    transcriptPath?: string;
    sessionId?: string;
}): {
    ok: true;
    source: object;
    records: Array<object>;
    entries: Array<object>;
    journalRecords: Array<object>;
    turn: string | null;
} | {
    ok: false;
    code: string;
};
/**
 * The reply of the session's current turn. The completion record is preferred
 * over the projection message because Vibe runs a `post_agent` hook before it
 * appends that message, so at hook time only the completion carries the reply.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @returns {string | null} The reply text, or null when the turn has none.
 */
export function lastAssistantText(input: object): string | null;
/**
 * The current turn's tool calls, in the order they started.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @returns {Array<{ id: string, name: string, input: object, status: string | null,
 *   outputText: string | null }>}
 */
export function turnToolCalls(input: object): Array<{
    id: string;
    name: string;
    input: object;
    status: string | null;
    outputText: string | null;
}>;
/**
 * The compactions recorded after a journal watermark.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @param {number} [watermark] - The `sequence` of the last compaction already seen.
 * @returns {Array<{ compactionId: string, trigger: string | null, attempt: number | null,
 *   summaryLength: number | null, turnId: string | null, status: string | null,
 *   sequence: number }>}
 */
export function compactionsSince(input: object, watermark?: number): Array<{
    compactionId: string;
    trigger: string | null;
    attempt: number | null;
    summaryLength: number | null;
    turnId: string | null;
    status: string | null;
    sequence: number;
}>;
/**
 * The session's current turn id. A retry keeps it, so it is the key a
 * once-per-turn rule can hold across the retries Vibe counts for one turn.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @returns {string | null}
 */
export function turnId(input: object): string | null;
//# sourceMappingURL=vibe.d.mts.map