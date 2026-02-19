// ---------------------------------------------------------------
// MODULE: Skill Reference Config
// ---------------------------------------------------------------
// Loads section 12 (skillReferenceIndexing) from config.jsonc.
// Controls which workflows-code--* skill references/assets are indexed.
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import { SERVER_DIR } from '../../core/config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

export interface SkillRefConfig {
  enabled: boolean;
  indexedSkills: string[];
  fileExtensions: string[];
  indexDirs: string[];
}

/* ---------------------------------------------------------------
   2. DEFAULTS
   --------------------------------------------------------------- */

const DEFAULT_CONFIG: SkillRefConfig = {
  enabled: true,
  indexedSkills: [],    // Empty by default — must be configured by user
  fileExtensions: ['.md'],
  indexDirs: ['references', 'assets'],
};

const DISABLED_CONFIG: SkillRefConfig = {
  ...DEFAULT_CONFIG,
  enabled: false,
  indexedSkills: [],
};

const SKILL_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*(?:--[A-Za-z0-9._-]+)*$/;

function isSafeSkillName(value: unknown): value is string {
  return typeof value === 'string' && !value.includes('/') && !value.includes('\\') && SKILL_NAME_PATTERN.test(value);
}

function normalizeExtension(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;

  const normalized = trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
  // Keep extension format simple and safe: .md, .txt, .rst
  if (!/^\.[a-z0-9]+$/.test(normalized)) return null;
  return normalized;
}

function normalizeIndexDir(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Reject absolute paths before normalization (POSIX + Windows drive-letter)
  if (path.isAbsolute(trimmed) || /^[A-Za-z]:[\\/]/.test(trimmed)) return null;

  const normalized = trimmed
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');

  if (!normalized) return null;
  if (normalized.startsWith('.')) return null;
  if (path.isAbsolute(normalized)) return null;

  const segments = normalized.split('/');
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return null;
  }

  return normalized;
}

function parseSkillRefSection(rawSection: unknown): SkillRefConfig {
  if (rawSection === undefined) {
    return DEFAULT_CONFIG;
  }

  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    console.warn('[skill-ref-config] Invalid skillReferenceIndexing section: expected object; disabling feature');
    return DISABLED_CONFIG;
  }

  const section = rawSection as Record<string, unknown>;

  if (section.enabled !== undefined && typeof section.enabled !== 'boolean') {
    console.warn('[skill-ref-config] Invalid skillReferenceIndexing.enabled: expected boolean; disabling feature');
    return DISABLED_CONFIG;
  }
  if (section.indexedSkills !== undefined && !Array.isArray(section.indexedSkills)) {
    console.warn('[skill-ref-config] Invalid skillReferenceIndexing.indexedSkills: expected array; disabling feature');
    return DISABLED_CONFIG;
  }
  if (section.fileExtensions !== undefined && !Array.isArray(section.fileExtensions)) {
    console.warn('[skill-ref-config] Invalid skillReferenceIndexing.fileExtensions: expected array; disabling feature');
    return DISABLED_CONFIG;
  }
  if (section.indexDirs !== undefined && !Array.isArray(section.indexDirs)) {
    console.warn('[skill-ref-config] Invalid skillReferenceIndexing.indexDirs: expected array; disabling feature');
    return DISABLED_CONFIG;
  }

  const indexedSkills = (section.indexedSkills ?? DEFAULT_CONFIG.indexedSkills)
    .filter(isSafeSkillName);

  if (Array.isArray(section.indexedSkills) && indexedSkills.length !== section.indexedSkills.length) {
    console.warn('[skill-ref-config] Dropped invalid skill names from skillReferenceIndexing.indexedSkills');
  }

  const fileExtensions = (section.fileExtensions ?? DEFAULT_CONFIG.fileExtensions)
    .map(normalizeExtension)
    .filter((ext): ext is string => ext !== null);

  const indexDirs = (section.indexDirs ?? DEFAULT_CONFIG.indexDirs)
    .map(normalizeIndexDir)
    .filter((dir): dir is string => dir !== null);

  return {
    enabled: section.enabled ?? DEFAULT_CONFIG.enabled,
    indexedSkills,
    fileExtensions: fileExtensions.length > 0 ? fileExtensions : DEFAULT_CONFIG.fileExtensions,
    indexDirs: indexDirs.length > 0 ? indexDirs : DEFAULT_CONFIG.indexDirs,
  };
}

/* ---------------------------------------------------------------
   3. CONFIG LOADER
   --------------------------------------------------------------- */

/** In-memory process cache to avoid repeated config file reads. */
let cachedConfig: SkillRefConfig | null = null;

function getConfigPathCandidates(): string[] {
  return Array.from(
    new Set([
      path.resolve(SERVER_DIR, '..', 'config', 'config.jsonc'),
      path.resolve(SERVER_DIR, '..', '..', 'config', 'config.jsonc'),
    ])
  );
}

function readConfigFile(): string {
  const candidates = getConfigPathCandidates();
  let lastError: unknown = null;

  for (const configPath of candidates) {
    try {
      return fs.readFileSync(configPath, 'utf-8');
    } catch (err: unknown) {
      lastError = err;
    }
  }

  throw lastError ?? new Error('[skill-ref-config] No config path candidates available');
}

/** Load skill reference indexing config from config.jsonc section 12 */
export function loadSkillRefConfig(): SkillRefConfig {
  if (cachedConfig) return cachedConfig;

  try {
    const raw = readConfigFile();
    // Strip JS-style comments (// and /* */)
    const stripped = raw
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const parsed = JSON.parse(stripped);

    cachedConfig = parseSkillRefSection(parsed.skillReferenceIndexing);
  } catch (err: unknown) {
    console.warn('[skill-ref-config] Failed to load config, disabling feature:', err);
    cachedConfig = DISABLED_CONFIG;
  }

  return cachedConfig ?? DISABLED_CONFIG;
}

/** Clear cached config (for testing) */
export function clearSkillRefConfigCache(): void {
  cachedConfig = null;
}
