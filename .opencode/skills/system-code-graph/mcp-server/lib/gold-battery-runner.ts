// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Gold Battery Runner
// ───────────────────────────────────────────────────────────────
// Apply-mode wrapper around the existing gold-query verifier.

import {
  DEFAULT_GOLD_BATTERY_PATH,
  executeBattery,
  loadGoldBattery,
  type GoldQueryOutlineArgs,
  type VerifyResult,
} from './gold-query-verifier.js';
import type { CodeGraphQueryResponse } from './query-result-adapter.js';
import { handleCodeGraphQuery } from '../handlers/query.js';

export interface GoldBatteryRunnerOptions {
  batteryPath?: string;
  query?: (args: GoldQueryOutlineArgs) => Promise<CodeGraphQueryResponse>;
  failFast?: boolean;
  includeDetails?: boolean;
  env?: NodeJS.ProcessEnv;
}

export interface GoldBatteryRunResult extends VerifyResult {
  batteryPath: string;
  defaultPassPolicy: VerifyResult['pass_policy'];
  effectivePassPolicy: VerifyResult['pass_policy'];
}

function parseFloor(value: string | undefined): number | null {
  if (value === undefined || value.trim().length === 0) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : null;
}

export function resolveEffectivePassPolicy(
  defaults: VerifyResult['pass_policy'],
  env: NodeJS.ProcessEnv = process.env,
): VerifyResult['pass_policy'] {
  const overallOverride = parseFloor(env.SPECKIT_CODE_GRAPH_BATTERY_OVERALL_FLOOR);
  const edgeOverride = parseFloor(env.SPECKIT_CODE_GRAPH_BATTERY_EDGE_FLOOR);

  return {
    overall_pass_rate: Math.max(defaults.overall_pass_rate, overallOverride ?? defaults.overall_pass_rate),
    edge_focus_pass_rate: Math.max(defaults.edge_focus_pass_rate, edgeOverride ?? defaults.edge_focus_pass_rate),
  };
}

export async function runGoldBattery(
  options: GoldBatteryRunnerOptions = {},
): Promise<GoldBatteryRunResult> {
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
