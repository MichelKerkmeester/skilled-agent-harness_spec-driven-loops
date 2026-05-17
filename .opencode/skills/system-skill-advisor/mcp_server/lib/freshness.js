// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Freshness
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, } from 'node:fs';
import { join, resolve } from 'node:path';
import { ADVISOR_SOURCE_CACHE_TTL_MS, getOrCompute, } from './source-cache.js';
import { readAdvisorGeneration, } from './generation.js';
import { classifyAdvisorException, } from './error-diagnostics.js';
// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────
const SKILL_ROOT_RELATIVE_PATH = join('.opencode', 'skills');
const ADVISOR_SCRIPT_ROOT_RELATIVE_PATH = join(SKILL_ROOT_RELATIVE_PATH, 'system-skill-advisor', 'mcp_server', 'scripts');
const SQLITE_ARTIFACT_RELATIVE_PATH = join(SKILL_ROOT_RELATIVE_PATH, 'system-skill-advisor', 'mcp_server', 'database', 'skill-graph.sqlite');
const JSON_ARTIFACT_RELATIVE_PATH = join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill-graph.json');
const REQUIRED_SCRIPT_RELATIVE_PATHS = [
    join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_advisor.py'),
    join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_advisor_runtime.py'),
    join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_graph_compiler.py'),
];
// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────
function fileProbe(filePath) {
    if (!existsSync(filePath)) {
        return null;
    }
    const stats = statSync(filePath);
    if (!stats.isFile()) {
        throw new Error(`Expected file but found non-file path: ${filePath}`);
    }
    const contentHash = createHash('sha256').update(readFileSync(filePath)).digest('hex');
    return {
        path: filePath,
        mtimeMs: stats.mtimeMs,
        size: stats.size,
        contentHash,
    };
}
function addSignaturePart(hash, label, probe) {
    if (!probe) {
        hash.update(`${label}:missing\n`);
        return;
    }
    hash.update(`${label}:${probe.path}:${probe.mtimeMs}:${probe.size}:${probe.contentHash}\n`);
}
function listSkillSlugs(skillRoot) {
    if (!existsSync(skillRoot)) {
        return [];
    }
    return readdirSync(skillRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => entry.name)
        .sort((left, right) => left.localeCompare(right));
}
function buildSourceSnapshot(workspaceRoot) {
    const root = resolve(workspaceRoot);
    const skillRoot = join(root, SKILL_ROOT_RELATIVE_PATH);
    const missingSources = [];
    const hash = createHash('sha256');
    const skillFingerprints = new Map();
    let maxSourceMtimeMs = 0;
    const skillSlugs = listSkillSlugs(skillRoot);
    for (const skillSlug of skillSlugs) {
        const skillDirectory = join(skillRoot, skillSlug);
        const skillMd = fileProbe(join(skillDirectory, 'SKILL.md'));
        if (!skillMd) {
            continue;
        }
        const graphMetadata = fileProbe(join(skillDirectory, 'graph-metadata.json'));
        maxSourceMtimeMs = Math.max(maxSourceMtimeMs, skillMd.mtimeMs, graphMetadata?.mtimeMs ?? 0);
        skillFingerprints.set(skillSlug, {
            skillMdMtime: skillMd.mtimeMs,
            skillMdSize: skillMd.size,
            skillMdHash: skillMd.contentHash,
            graphMetaMtime: graphMetadata?.mtimeMs ?? null,
            graphMetaHash: graphMetadata?.contentHash ?? null,
        });
        addSignaturePart(hash, `skill:${skillSlug}:SKILL.md`, skillMd);
        addSignaturePart(hash, `skill:${skillSlug}:graph-metadata.json`, graphMetadata);
    }
    if (skillSlugs.length === 0 || skillFingerprints.size === 0) {
        missingSources.push(SKILL_ROOT_RELATIVE_PATH);
    }
    for (const relativePath of REQUIRED_SCRIPT_RELATIVE_PATHS) {
        const probe = fileProbe(join(root, relativePath));
        if (!probe) {
            missingSources.push(relativePath);
        }
        else {
            maxSourceMtimeMs = Math.max(maxSourceMtimeMs, probe.mtimeMs);
        }
        addSignaturePart(hash, relativePath, probe);
    }
    const sqliteArtifact = fileProbe(join(root, SQLITE_ARTIFACT_RELATIVE_PATH));
    const jsonArtifact = fileProbe(join(root, JSON_ARTIFACT_RELATIVE_PATH));
    addSignaturePart(hash, SQLITE_ARTIFACT_RELATIVE_PATH, sqliteArtifact);
    addSignaturePart(hash, JSON_ARTIFACT_RELATIVE_PATH, jsonArtifact);
    return {
        sourceSignature: hash.digest('hex'),
        skillFingerprints,
        maxSourceMtimeMs,
        sqliteArtifact,
        jsonArtifact,
        missingSources,
    };
}
export function computeAdvisorSourceSignature(workspaceRoot) {
    return buildSourceSnapshot(workspaceRoot).sourceSignature;
}
function nonLiveDiagnostics(reason, missingSources = [], recoveryPath, errorDiagnostics) {
    return {
        reason,
        ...(missingSources.length > 0 ? { missingSources } : {}),
        ...(recoveryPath ? { recoveryPath } : {}),
        ...(errorDiagnostics ?? {}),
    };
}
function resultFromSnapshot(snapshot, generation, state, fallbackMode, diagnostics) {
    return {
        state,
        generation,
        sourceSignature: snapshot.sourceSignature,
        skillFingerprints: snapshot.skillFingerprints,
        fallbackMode,
        probedAt: new Date().toISOString(),
        diagnostics,
    };
}
function deriveFreshness(snapshot, generation) {
    const generationNumber = generation.generation;
    if (snapshot.missingSources.length > 0) {
        return resultFromSnapshot(snapshot, generationNumber, 'absent', snapshot.sqliteArtifact ? 'sqlite' : snapshot.jsonArtifact ? 'json' : 'none', nonLiveDiagnostics('ADVISOR_SOURCE_MISSING', snapshot.missingSources));
    }
    if (!snapshot.sqliteArtifact) {
        if (snapshot.jsonArtifact) {
            return resultFromSnapshot(snapshot, generationNumber, 'stale', 'json', nonLiveDiagnostics('JSON_FALLBACK_ONLY', [SQLITE_ARTIFACT_RELATIVE_PATH]));
        }
        return resultFromSnapshot(snapshot, generationNumber, 'absent', 'none', nonLiveDiagnostics('SKILL_GRAPH_SQLITE_MISSING', [SQLITE_ARTIFACT_RELATIVE_PATH]));
    }
    if (generation.sourceSignature) {
        return generation.sourceSignature === snapshot.sourceSignature
            ? resultFromSnapshot(snapshot, generationNumber, 'live', 'sqlite', null)
            : resultFromSnapshot(snapshot, generationNumber, 'stale', 'sqlite', nonLiveDiagnostics('SOURCE_NEWER_THAN_SKILL_GRAPH'));
    }
    if (snapshot.maxSourceMtimeMs > snapshot.sqliteArtifact.mtimeMs) {
        return resultFromSnapshot(snapshot, generationNumber, 'stale', 'sqlite', nonLiveDiagnostics('SOURCE_NEWER_THAN_SKILL_GRAPH'));
    }
    return resultFromSnapshot(snapshot, generationNumber, 'live', 'sqlite', null);
}
function unavailableResult(workspaceRoot, reason, recoveryPath, errorDiagnostics) {
    return {
        state: 'unavailable',
        generation: 0,
        sourceSignature: createHash('sha256')
            .update(resolve(workspaceRoot))
            .update(reason)
            .digest('hex'),
        skillFingerprints: new Map(),
        fallbackMode: 'none',
        probedAt: new Date().toISOString(),
        diagnostics: nonLiveDiagnostics(reason, [], recoveryPath, errorDiagnostics),
    };
}
function degradeRecoveredGeneration(result) {
    return {
        ...result,
        state: result.state === 'live' ? 'stale' : result.state,
        diagnostics: nonLiveDiagnostics('GENERATION_COUNTER_RECOVERED', [], 'regenerate'),
    };
}
// ───────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────
export function getAdvisorFreshness(workspaceRoot) {
    let snapshot;
    try {
        snapshot = buildSourceSnapshot(workspaceRoot);
    }
    catch (error) {
        return unavailableResult(workspaceRoot, 'ADVISOR_FRESHNESS_PROBE_FAILED', undefined, classifyAdvisorException(error));
    }
    const generation = readAdvisorGeneration(workspaceRoot);
    if (generation.status === 'unavailable') {
        return {
            ...resultFromSnapshot(snapshot, 0, 'unavailable', snapshot.sqliteArtifact ? 'sqlite' : snapshot.jsonArtifact ? 'json' : 'none', nonLiveDiagnostics(generation.reason ?? 'GENERATION_COUNTER_CORRUPT', [], generation.recoveryPath ?? undefined, generation.errorClass
                ? {
                    errorClass: generation.errorClass,
                    ...(generation.errorMessage ? { errorMessage: generation.errorMessage } : {}),
                }
                : undefined)),
        };
    }
    if (generation.status === 'recovered') {
        return degradeRecoveredGeneration(deriveFreshness(snapshot, generation));
    }
    const cacheKey = `${resolve(workspaceRoot)}:${snapshot.sourceSignature}:${generation.generation}`;
    return getOrCompute(cacheKey, ADVISOR_SOURCE_CACHE_TTL_MS, () => deriveFreshness(snapshot, generation));
}
//# sourceMappingURL=freshness.js.map