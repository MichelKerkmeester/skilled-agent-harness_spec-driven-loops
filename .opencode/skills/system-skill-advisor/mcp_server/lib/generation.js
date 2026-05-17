// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Generation Counter
// ───────────────────────────────────────────────────────────────
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { classifyAdvisorException, } from './error-diagnostics.js';
import { getSkillGraphGenerationPath } from './freshness/generation.js';
// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────
const observedGenerations = new Map();
// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────
function workspaceKey(workspaceRoot) {
    return resolve(workspaceRoot);
}
function ok(generation, sourceSignature) {
    return {
        generation,
        sourceSignature,
        status: 'ok',
        reason: null,
        recoveryPath: null,
    };
}
function recovered(generation) {
    return {
        generation,
        sourceSignature: null,
        status: 'recovered',
        reason: 'GENERATION_COUNTER_RECOVERED',
        recoveryPath: 'regenerate',
    };
}
function unavailable(reason, errorDiagnostics) {
    return {
        generation: 0,
        sourceSignature: null,
        status: 'unavailable',
        reason,
        recoveryPath: 'unrecoverable',
        ...(errorDiagnostics ?? {}),
    };
}
function isGenerationFilePayload(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const record = value;
    return typeof record.generation === 'number'
        && Number.isSafeInteger(record.generation)
        && record.generation >= 0
        && typeof record.updatedAt === 'string'
        && (record.sourceSignature === undefined
            || record.sourceSignature === null
            || typeof record.sourceSignature === 'string');
}
function writeGenerationAtomic(filePath, generation, sourceSignature = null) {
    mkdirSync(dirname(filePath), { recursive: true });
    const payload = {
        generation,
        updatedAt: new Date().toISOString(),
        sourceSignature,
        reason: 'LEGACY_ADVISOR_GENERATION_BUMP',
        state: 'live',
    };
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    try {
        writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
        renameSync(tempPath, filePath);
    }
    catch (error) {
        try {
            rmSync(tempPath, { force: true });
        }
        catch {
            // Best-effort temp cleanup; the original write failure is authoritative.
        }
        throw error;
    }
}
function parseGenerationFile(filePath) {
    const raw = readFileSync(filePath, 'utf8');
    const payload = JSON.parse(raw);
    if (!isGenerationFilePayload(payload)) {
        throw new Error(`Invalid generation counter payload at ${filePath}: expected {generation: safe integer >= 0, updatedAt: string}; actual ${typeof payload}.`);
    }
    return {
        ...payload,
        sourceSignature: payload.sourceSignature ?? null,
    };
}
function recoverMalformedCounter(workspaceRoot, filePath) {
    const key = workspaceKey(workspaceRoot);
    const observedGeneration = observedGenerations.get(key) ?? 0;
    const nextGeneration = Math.max(observedGeneration, 1) + 1;
    try {
        writeGenerationAtomic(filePath, nextGeneration);
        observedGenerations.set(key, nextGeneration);
        return recovered(nextGeneration);
    }
    catch (error) {
        return unavailable('GENERATION_COUNTER_CORRUPT', classifyAdvisorException(error));
    }
}
function setGeneration(workspaceRoot, filePath, generation, sourceSignature = null) {
    try {
        writeGenerationAtomic(filePath, generation, sourceSignature);
        observedGenerations.set(workspaceKey(workspaceRoot), generation);
        return ok(generation, sourceSignature);
    }
    catch (error) {
        return unavailable('GENERATION_COUNTER_UNAVAILABLE', classifyAdvisorException(error));
    }
}
// ───────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────
/** Resolve the persistent generation-counter path for a workspace. */
export function getAdvisorGenerationPath(workspaceRoot) {
    return getSkillGraphGenerationPath(resolve(workspaceRoot));
}
/** Read or recover the advisor generation counter for freshness checks. */
export function readAdvisorGeneration(workspaceRoot) {
    const filePath = getAdvisorGenerationPath(workspaceRoot);
    try {
        const payload = parseGenerationFile(filePath);
        observedGenerations.set(workspaceKey(workspaceRoot), payload.generation);
        return ok(payload.generation, payload.sourceSignature ?? null);
    }
    catch (error) {
        const code = error instanceof Error && 'code' in error
            ? String(error.code)
            : null;
        if (code === 'ENOENT') {
            return setGeneration(workspaceRoot, filePath, 0);
        }
        return recoverMalformedCounter(workspaceRoot, filePath);
    }
}
/** Increment the advisor generation counter after source-affecting writes. */
export function incrementAdvisorGeneration(workspaceRoot) {
    const current = readAdvisorGeneration(workspaceRoot);
    if (current.status === 'unavailable') {
        return current;
    }
    const filePath = getAdvisorGenerationPath(workspaceRoot);
    return setGeneration(workspaceRoot, filePath, current.generation + 1);
}
/** Clear process-local generation observations for tests. */
export function clearAdvisorGenerationMemory() {
    observedGenerations.clear();
}
//# sourceMappingURL=generation.js.map