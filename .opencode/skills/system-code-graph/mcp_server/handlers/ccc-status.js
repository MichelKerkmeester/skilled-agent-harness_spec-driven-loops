// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for ccc_status — reports CocoIndex availability and stats.
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import * as graphDb from '../lib/code-graph-db.js';
import { canonicalReadinessFromFreshness } from '../lib/readiness-contract.js';
function buildUnavailableReadiness(reason) {
    return {
        freshness: 'empty',
        action: 'none',
        inlineIndexPerformed: false,
        reason,
        canonicalReadiness: canonicalReadinessFromFreshness('empty'),
        trustState: 'unavailable',
    };
}
/** Handle ccc_status tool call */
export async function handleCccStatus() {
    try {
        const projectRoot = process.cwd();
        const cccBin = resolve(projectRoot, '.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc');
        const indexDir = resolve(projectRoot, '.cocoindex_code');
        const available = existsSync(cccBin);
        let indexSize = null;
        let indexExists = false;
        if (existsSync(indexDir)) {
            indexExists = true;
            try {
                indexSize = statSync(indexDir).size;
            }
            catch { /* ok */ }
        }
        const readiness = buildUnavailableReadiness('readiness_not_applicable');
        const lastPersistedAt = graphDb.getStats().lastScanTimestamp;
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        status: 'ok',
                        data: {
                            available,
                            binaryPath: cccBin,
                            indexExists,
                            indexSize,
                            readiness,
                            canonicalReadiness: readiness.canonicalReadiness,
                            trustState: readiness.trustState,
                            lastPersistedAt,
                            recommendation: !available
                                ? 'Install CocoIndex: bash .opencode/skills/mcp-coco-index/scripts/install.sh'
                                : !indexExists
                                    ? 'Run ccc_reindex to build the initial index'
                                    : 'CocoIndex is ready. Use mcp__cocoindex_code__search for semantic queries.',
                        },
                    }, null, 2),
                }],
        };
    }
    catch (err) {
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        status: 'error',
                        error: `ccc_status failed: ${err instanceof Error ? err.message : String(err)}`,
                    }),
                }],
        };
    }
}
//# sourceMappingURL=ccc-status.js.map