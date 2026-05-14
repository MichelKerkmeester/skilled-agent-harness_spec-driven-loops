// ───────────────────────────────────────────────────────────────
// MODULE: Gold Query Verifier
// ───────────────────────────────────────────────────────────────
// Loads and validates the code-graph gold query battery.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from '../../../system-spec-kit/mcp_server/lib/utils/logger.js';
import { isRecord, parseOutlineQueryResult, } from './query-result-adapter.js';
const logger = createLogger('GoldQueryVerifier');
/** Path inside the workspace, anchored at the project root, to the v1 gold battery. */
const GOLD_BATTERY_RELATIVE_PATH = '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/code-graph-gold-queries.json';
/**
 * Resolve the project root by walking up from this module's directory until
 * a folder containing the `.opencode/specs/` semantic anchor is found.
 *
 * Anchored on `.opencode/specs/` (rather than just `.opencode/`) because a
 * stray `mcp_server/.opencode/` test artifact otherwise short-circuits the
 * walk one level too early. The stray contains only `skill/`, not `specs/`,
 * so this stricter marker correctly skips it and lands at the real
 * workspace root.
 *
 * Behaves identically whether the module is loaded from
 * `mcp_server/lib/` (TS source under vitest) or
 * `mcp_server/dist/lib/` (compiled MCP runtime). The legacy
 * hardcoded `../../../../../` relative path was correct for the TS source
 * location but produced a phantom `.opencode/skills/specs/...` path when
 * loaded from `dist/`, breaking `code_graph_verify({})` at runtime.
 */
function resolveProjectRoot() {
    const moduleDir = dirname(fileURLToPath(import.meta.url));
    let current = moduleDir;
    for (let i = 0; i < 12; i++) {
        if (existsSync(resolve(current, '.opencode', 'specs'))) {
            return current;
        }
        const parent = dirname(current);
        if (parent === current)
            break; // filesystem root
        current = parent;
    }
    // Fallback — should not happen in normal deployments
    return process.cwd();
}
/**
 * Canonical on-disk path to the v1 gold battery shipped under the 007 research
 * assets folder. Re-exported so handlers do not redeclare the relative path.
 *
 * REQ-014: keep in sync if the asset moves under the 007 research packet.
 */
export const DEFAULT_GOLD_BATTERY_PATH = resolve(resolveProjectRoot(), GOLD_BATTERY_RELATIVE_PATH);
const EDGE_FOCUS_CATEGORIES = new Set([
    'cross-module',
    'exported-type',
    'regression-detection',
]);
function getRequiredString(record, fieldName, context) {
    const value = record[fieldName];
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`${context} must include a non-empty string "${fieldName}"`);
    }
    return value;
}
function getOptionalProbe(record, context) {
    const probe = record.probe;
    if (probe === undefined) {
        return undefined;
    }
    if (!isRecord(probe)) {
        throw new Error(`${context}.probe must be an object when present`);
    }
    return {
        operation: getRequiredString(probe, 'operation', `${context}.probe`),
        subject: getRequiredString(probe, 'subject', `${context}.probe`),
        expectedSymbolsPath: getRequiredString(probe, 'expectedSymbolsPath', `${context}.probe`),
    };
}
function getRequiredStringArray(record, fieldName, context) {
    const value = record[fieldName];
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`${context} must include a non-empty array "${fieldName}"`);
    }
    const normalized = value.map((entry, index) => {
        if (typeof entry !== 'string' || entry.trim().length === 0) {
            throw new Error(`${context}.${fieldName}[${index}] must be a non-empty string`);
        }
        return entry;
    });
    return normalized;
}
function getRequiredRate(record, keys, context) {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
            if (value < 0 || value > 1) {
                throw new Error(`${context}.${key} must be between 0 and 1`);
            }
            return value;
        }
    }
    throw new Error(`${context} must include one of: ${keys.join(', ')}`);
}
function parseSourceLocation(queryRecord, context) {
    const rawSourceFile = queryRecord.source_file;
    if (typeof rawSourceFile === 'string' && rawSourceFile.trim().length > 0) {
        return { source_file: rawSourceFile };
    }
    const rawSourceFileLine = queryRecord['source_file:line'];
    if (typeof rawSourceFileLine !== 'string' || rawSourceFileLine.trim().length === 0) {
        throw new Error(`${context} must include "source_file" or "source_file:line"`);
    }
    const match = /^(.*):(\d+)$/.exec(rawSourceFileLine);
    if (!match) {
        throw new Error(`${context} has invalid "source_file:line" format: ${rawSourceFileLine}`);
    }
    const sourceFile = match[1];
    const sourceLine = Number.parseInt(match[2], 10);
    if (sourceFile.trim().length === 0 || !Number.isInteger(sourceLine) || sourceLine < 1) {
        throw new Error(`${context} has invalid "source_file:line" value: ${rawSourceFileLine}`);
    }
    return {
        source_file: sourceFile,
        source_line: sourceLine,
    };
}
function parseQuery(record, index) {
    const context = `gold battery query at index ${index}`;
    if (!isRecord(record)) {
        throw new Error(`${context} must be an object`);
    }
    const sourceLocation = parseSourceLocation(record, context);
    const probe = getOptionalProbe(record, context);
    if (probe) {
        logger.warn('Ignoring unsupported v2 probe hook in v1 gold battery query', {
            queryId: record.id,
            operation: probe.operation,
            subject: probe.subject,
            expectedSymbolsPath: probe.expectedSymbolsPath,
        });
    }
    return {
        id: getRequiredString(record, 'id', context),
        category: getRequiredString(record, 'category', context),
        query: getRequiredString(record, 'query', context),
        source_file: sourceLocation.source_file,
        ...(sourceLocation.source_line !== undefined ? { source_line: sourceLocation.source_line } : {}),
        expected_top_K_symbols: getRequiredStringArray(record, 'expected_top_K_symbols', context),
        ...(probe ? { probe } : {}),
    };
}
function normalizeSymbol(value) {
    return value.trim();
}
function buildProbeResult(goldQuery, probe, matchedSymbols, missingSymbols, status, reason, includeDetails) {
    const baseResult = {
        queryId: goldQuery.id,
        category: goldQuery.category,
        query: goldQuery.query,
        sourceFile: goldQuery.source_file,
        ...(goldQuery.source_line !== undefined ? { sourceLine: goldQuery.source_line } : {}),
        expectedTopK: [...goldQuery.expected_top_K_symbols],
        probe,
        matchedSymbols,
        missingSymbols,
        status,
        ...(reason ? { reason } : {}),
    };
    if (includeDetails || status !== 'passed') {
        return baseResult;
    }
    return {
        ...baseResult,
        matchedSymbols: [],
        missingSymbols: [],
    };
}
export async function executeBattery(battery, query, opts) {
    const failFast = opts?.failFast ?? false;
    const includeDetails = opts?.includeDetails ?? false;
    const probes = [];
    const missingSymbols = new Set();
    const unexpectedErrors = [];
    const categoryTotals = new Map();
    let passedCount = 0;
    let edgeFocusPassedCount = 0;
    let edgeFocusTotalCount = 0;
    for (const goldQuery of battery.queries) {
        const probe = {
            operation: 'outline',
            subject: goldQuery.source_file,
            limit: 200,
        };
        const categoryCounter = categoryTotals.get(goldQuery.category) ?? { total: 0, passed: 0 };
        categoryCounter.total += 1;
        categoryTotals.set(goldQuery.category, categoryCounter);
        if (EDGE_FOCUS_CATEGORIES.has(goldQuery.category)) {
            edgeFocusTotalCount += 1;
        }
        try {
            const rawResponse = await query(probe);
            const parsed = parseOutlineQueryResult(rawResponse);
            if (parsed.status !== 'ok') {
                const status = parsed.status;
                const reason = parsed.reason ?? `Query returned status "${status}"`;
                probes.push(buildProbeResult(goldQuery, probe, [], [...goldQuery.expected_top_K_symbols], status, reason, includeDetails));
                unexpectedErrors.push(`${goldQuery.id}: ${reason}`);
                goldQuery.expected_top_K_symbols.forEach(symbol => missingSymbols.add(symbol));
                if (failFast) {
                    break;
                }
                continue;
            }
            const discoveredSymbols = new Set();
            for (const node of parsed.data.nodes) {
                if (node.name) {
                    discoveredSymbols.add(normalizeSymbol(node.name));
                }
                if (node.fqName) {
                    discoveredSymbols.add(normalizeSymbol(node.fqName));
                }
            }
            const matched = [];
            const missing = [];
            for (const expectedSymbol of goldQuery.expected_top_K_symbols) {
                if (discoveredSymbols.has(normalizeSymbol(expectedSymbol))) {
                    matched.push(expectedSymbol);
                }
                else {
                    missing.push(expectedSymbol);
                    missingSymbols.add(expectedSymbol);
                }
            }
            const status = missing.length === 0 ? 'passed' : 'failed';
            const reason = missing.length === 0
                ? undefined
                : `Missing expected symbols: ${missing.join(', ')}`;
            if (status === 'passed') {
                passedCount += 1;
                categoryCounter.passed += 1;
                if (EDGE_FOCUS_CATEGORIES.has(goldQuery.category)) {
                    edgeFocusPassedCount += 1;
                }
            }
            probes.push(buildProbeResult(goldQuery, probe, matched, missing, status, reason, includeDetails));
            if (failFast && status !== 'passed') {
                break;
            }
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            probes.push(buildProbeResult(goldQuery, probe, [], [...goldQuery.expected_top_K_symbols], 'error', reason, includeDetails));
            unexpectedErrors.push(`${goldQuery.id}: ${reason}`);
            goldQuery.expected_top_K_symbols.forEach(symbol => missingSymbols.add(symbol));
            if (failFast) {
                break;
            }
        }
    }
    const queryCount = battery.queries.length;
    const overallPassRate = queryCount === 0 ? 0 : passedCount / queryCount;
    const edgeFocusPassRate = edgeFocusTotalCount === 0 ? overallPassRate : edgeFocusPassedCount / edgeFocusTotalCount;
    const categoryPassRates = Object.fromEntries([...categoryTotals.entries()].map(([category, counts]) => [
        category,
        counts.total === 0 ? 0 : counts.passed / counts.total,
    ]));
    return {
        batteryPath: '<in-memory>',
        queryCount,
        pass_policy: battery.pass_policy,
        overall_pass_rate: overallPassRate,
        edge_focus_pass_rate: edgeFocusPassRate,
        overallPassRate,
        categoryPassRates,
        missingSymbols: [...missingSymbols],
        unexpectedErrors,
        passed: overallPassRate >= battery.pass_policy.overall_pass_rate
            && edgeFocusPassRate >= battery.pass_policy.edge_focus_pass_rate,
        probes,
    };
}
export function loadGoldBattery(path) {
    const raw = readFileSync(path, 'utf8');
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch (error) {
        throw new Error(`Failed to parse gold battery JSON at ${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!isRecord(parsed)) {
        throw new Error(`Gold battery at ${path} must be a JSON object`);
    }
    if (parsed.schema_version !== 1) {
        throw new Error(`Gold battery at ${path} must declare schema_version === 1`);
    }
    const passPolicyValue = parsed.pass_policy;
    if (!isRecord(passPolicyValue)) {
        throw new Error(`Gold battery at ${path} must include an object "pass_policy"`);
    }
    const queriesValue = parsed.queries;
    if (!Array.isArray(queriesValue)) {
        throw new Error(`Gold battery at ${path} must include an array "queries"`);
    }
    return {
        schema_version: 1,
        pass_policy: {
            overall_pass_rate: getRequiredRate(passPolicyValue, ['overall_pass_rate', 'overall_top_k_symbol_pass_floor'], 'pass_policy'),
            edge_focus_pass_rate: getRequiredRate(passPolicyValue, ['edge_focus_pass_rate', 'edge_focus_pass_floor'], 'pass_policy'),
        },
        queries: queriesValue.map((query, index) => parseQuery(query, index)),
    };
}
//# sourceMappingURL=gold-query-verifier.js.map