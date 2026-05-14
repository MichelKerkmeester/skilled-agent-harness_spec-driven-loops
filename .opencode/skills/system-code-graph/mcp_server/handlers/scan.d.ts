import * as graphDb from '../lib/code-graph-db.js';
import { type VerifyResult } from '../lib/gold-query-verifier.js';
export interface ScanArgs {
    rootDir?: string;
    includeGlobs?: string[];
    excludeGlobs?: string[];
    incremental?: boolean;
    includeSkills?: boolean | string[];
    includeAgents?: boolean;
    includeCommands?: boolean;
    includeSpecs?: boolean;
    includePlugins?: boolean;
    verify?: boolean;
    persistBaseline?: boolean;
    forceZeroNodeReset?: boolean;
    forceScopeChange?: boolean;
}
export interface ScanResult {
    filesScanned: number;
    filesIndexed: number;
    filesSkipped: number;
    parserSkipListBypassCount: number;
    totalNodes: number;
    totalEdges: number;
    errors: string[];
    durationMs: number;
    fullScanRequested: boolean;
    effectiveIncremental: boolean;
    fullReindexTriggered?: boolean;
    currentGitHead?: string | null;
    previousGitHead?: string | null;
    detectorProvenanceSummary?: graphDb.DetectorProvenanceSummary;
    graphEdgeEnrichmentSummary?: graphDb.GraphEdgeEnrichmentSummary | null;
    parseDiagnostics: graphDb.ParseDiagnosticsSummary;
    parserSkipList: {
        added: number;
        healed: number;
        totalAfterScan: number;
    };
    staleButValidGraphFiles: number;
    failedScan?: graphDb.FailedScanRecord | null;
    warnings: string[];
    capExceeded: {
        maxNodes: boolean;
        depth: boolean;
        gitignoreSize: boolean;
    };
    verification?: VerifyResult;
}
export declare function relativizeScanError(error: string, workspaceRoot: string): string;
/** Handle code_graph_scan tool call */
export declare function handleCodeGraphScan(args: ScanArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=scan.d.ts.map