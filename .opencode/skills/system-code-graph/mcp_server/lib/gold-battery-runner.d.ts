import { type VerifyResult } from './gold-query-verifier.js';
import type { CodeGraphQueryResponse } from './query-result-adapter.js';
interface OutlineProbe {
    operation: 'outline';
    subject: string;
    limit: number;
}
export interface GoldBatteryRunnerOptions {
    batteryPath?: string;
    query?: (args: OutlineProbe) => Promise<CodeGraphQueryResponse>;
    failFast?: boolean;
    includeDetails?: boolean;
    env?: NodeJS.ProcessEnv;
}
export interface GoldBatteryRunResult extends VerifyResult {
    batteryPath: string;
    defaultPassPolicy: VerifyResult['pass_policy'];
    effectivePassPolicy: VerifyResult['pass_policy'];
}
export declare function resolveEffectivePassPolicy(defaults: VerifyResult['pass_policy'], env?: NodeJS.ProcessEnv): VerifyResult['pass_policy'];
export declare function runGoldBattery(options?: GoldBatteryRunnerOptions): Promise<GoldBatteryRunResult>;
export {};
//# sourceMappingURL=gold-battery-runner.d.ts.map