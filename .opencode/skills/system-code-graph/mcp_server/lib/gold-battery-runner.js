// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Gold Battery Runner
// ───────────────────────────────────────────────────────────────
// Apply-mode wrapper around the existing gold-query verifier.
import { DEFAULT_GOLD_BATTERY_PATH, executeBattery, loadGoldBattery, } from './gold-query-verifier.js';
import { handleCodeGraphQuery } from '../handlers/query.js';
function parseFloor(value) {
    if (value === undefined || value.trim().length === 0) {
        return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : null;
}
export function resolveEffectivePassPolicy(defaults, env = process.env) {
    const overallOverride = parseFloor(env.SPECKIT_CODE_GRAPH_BATTERY_OVERALL_FLOOR);
    const edgeOverride = parseFloor(env.SPECKIT_CODE_GRAPH_BATTERY_EDGE_FLOOR);
    return {
        overall_pass_rate: Math.max(defaults.overall_pass_rate, overallOverride ?? defaults.overall_pass_rate),
        edge_focus_pass_rate: Math.max(defaults.edge_focus_pass_rate, edgeOverride ?? defaults.edge_focus_pass_rate),
    };
}
export async function runGoldBattery(options = {}) {
    const batteryPath = options.batteryPath ?? DEFAULT_GOLD_BATTERY_PATH;
    const battery = loadGoldBattery(batteryPath);
    const defaultPassPolicy = { ...battery.pass_policy };
    const effectivePassPolicy = resolveEffectivePassPolicy(defaultPassPolicy, options.env);
    const effectiveBattery = {
        ...battery,
        pass_policy: effectivePassPolicy,
    };
    const result = await executeBattery(effectiveBattery, options.query ?? handleCodeGraphQuery, {
        failFast: options.failFast,
        includeDetails: options.includeDetails,
    });
    return {
        ...result,
        batteryPath,
        defaultPassPolicy,
        effectivePassPolicy,
    };
}
//# sourceMappingURL=gold-battery-runner.js.map