import { type CodeGraphQueryResponse } from './query-result-adapter.js';
/**
 * Canonical on-disk path to the v1 gold battery shipped under the 007 research
 * assets folder. Re-exported so handlers do not redeclare the relative path.
 *
 * REQ-014: keep in sync if the asset moves under the 007 research packet.
 */
export declare const DEFAULT_GOLD_BATTERY_PATH: string;
interface GoldQueryProbe {
    operation: string;
    subject: string;
    expectedSymbolsPath: string;
}
export interface GoldQuery {
    id: string;
    category: string;
    query: string;
    source_file: string;
    source_line?: number;
    expected_top_K_symbols: string[];
    probe?: GoldQueryProbe;
}
export interface GoldBattery {
    schema_version: 1;
    pass_policy: {
        overall_pass_rate: number;
        edge_focus_pass_rate: number;
    };
    queries: GoldQuery[];
}
export interface ProbeResult {
    queryId: string;
    category: string;
    query: string;
    sourceFile: string;
    sourceLine?: number;
    expectedTopK: string[];
    probe: {
        operation: string;
        subject: string;
        expectedSymbolsPath?: string;
        limit?: number;
    };
    matchedSymbols: string[];
    missingSymbols: string[];
    status: 'passed' | 'failed' | 'blocked' | 'error';
    reason?: string;
}
export interface VerifyResult {
    batteryPath: string;
    queryCount: number;
    pass_policy: GoldBattery['pass_policy'];
    overall_pass_rate: number;
    edge_focus_pass_rate: number;
    overallPassRate: number;
    categoryPassRates: Record<string, number>;
    missingSymbols: string[];
    unexpectedErrors: string[];
    passed: boolean;
    probes: ProbeResult[];
}
interface OutlineProbe {
    operation: 'outline';
    subject: string;
    limit: number;
}
interface BatteryExecutionOptions {
    failFast?: boolean;
    includeDetails?: boolean;
}
export declare function executeBattery(battery: GoldBattery, query: (args: OutlineProbe) => Promise<CodeGraphQueryResponse>, opts?: BatteryExecutionOptions): Promise<VerifyResult>;
export declare function loadGoldBattery(path: string): GoldBattery;
export {};
//# sourceMappingURL=gold-query-verifier.d.ts.map