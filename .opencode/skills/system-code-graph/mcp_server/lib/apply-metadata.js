// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Apply Metadata                                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

import * as graphDb from './code-graph-db.js';
export const APPLY_METADATA_KEY = 'last_apply';
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
export function persistApplyMetadata(result) {
    graphDb.setCodeGraphMetadata(APPLY_METADATA_KEY, JSON.stringify({
        lastRunAt: result.now().toISOString(),
        lastResult: result.status,
        batteryPassRate: result.batteryPassRate,
    }));
}
export function getLastApplyMetadata() {
    const raw = graphDb.getCodeGraphMetadata(APPLY_METADATA_KEY);
    if (!raw) {
        return { lastRunAt: null, lastResult: null, batteryPassRate: null };
    }
    try {
        const parsed = JSON.parse(raw);
        if (!isRecord(parsed)) {
            return { lastRunAt: null, lastResult: null, batteryPassRate: null };
        }
        return {
            lastRunAt: typeof parsed.lastRunAt === 'string' ? parsed.lastRunAt : null,
            lastResult: typeof parsed.lastResult === 'string' ? parsed.lastResult : null,
            batteryPassRate: typeof parsed.batteryPassRate === 'number' ? parsed.batteryPassRate : null,
        };
    }
    catch {
        return { lastRunAt: null, lastResult: null, batteryPassRate: null };
    }
}
//# sourceMappingURL=apply-metadata.js.map