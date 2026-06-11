// ───────────────────────────────────────────────────────────────
// MODULE: Skill Doc Frontmatter Harvest
// ───────────────────────────────────────────────────────────────
// Parses the canonical reference/asset frontmatter contract
// (title, description, trigger_phrases, importance_tier, contextType)
// so per-doc trigger phrases can feed advisor routing as doc-level
// signal. The Spec Kit Memory system deliberately never indexes these
// files; the advisor is their only runtime consumer.

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface ParsedDocFrontmatter {
  readonly title: string;
  readonly description: string;
  readonly triggerPhrases: readonly string[];
  readonly importanceTier: string;
  readonly contextType: string;
}

/** Opt-in gate for the whole doc-harvest path. Default off. */
export function isDocTriggerHarvestEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SPECKIT_ADVISOR_DOC_TRIGGERS?.trim().toLowerCase() === 'true';
}

// Mirrors the spec-kit importance vocabulary so doc authors reuse one
// tier language. Values dampen routing contribution, never boost above
// the skill's own curated signal.
const DOC_TIER_WEIGHTS: Readonly<Record<string, number>> = {
  constitutional: 1.0,
  critical: 1.0,
  important: 0.85,
  normal: 0.7,
  temporary: 0.4,
  deprecated: 0.2,
};

const DEFAULT_TIER = 'normal';

export function docTierWeight(tier: string | null | undefined): number {
  const normalized = (tier ?? DEFAULT_TIER).trim().toLowerCase();
  return DOC_TIER_WEIGHTS[normalized] ?? DOC_TIER_WEIGHTS[DEFAULT_TIER];
}

const SURROUNDING_QUOTES = /^["']|["']$/g;
const KEY_LINE = /^([A-Za-z0-9_-]+):\s*(.*)$/;
const LIST_ITEM = /^\s+-\s+(.*)$/;
const MAX_PHRASES_PER_DOC = 12;
const MAX_FIELD_LENGTH = 300;

function cleanScalar(raw: string): string {
  return raw.trim().replace(SURROUNDING_QUOTES, '').trim().slice(0, MAX_FIELD_LENGTH);
}

/**
 * Parse the YAML-ish frontmatter block of a skill reference/asset doc.
 *
 * Returns null when the doc has no frontmatter fence or no
 * `trigger_phrases` entries — docs without the detailed contract carry
 * no doc-level routing signal and are skipped, not errored.
 */
export function parseDocFrontmatter(raw: string): ParsedDocFrontmatter | null {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end <= 3) return null;
  const block = raw.slice(raw.indexOf('\n') + 1, end);

  const scalars: Record<string, string> = {};
  const phrases: string[] = [];
  let inPhraseList = false;

  for (const line of block.split(/\r?\n/)) {
    const listMatch = LIST_ITEM.exec(line);
    if (listMatch) {
      if (inPhraseList && phrases.length < MAX_PHRASES_PER_DOC) {
        const phrase = cleanScalar(listMatch[1]);
        if (phrase) phrases.push(phrase);
      }
      continue;
    }

    const keyMatch = KEY_LINE.exec(line);
    if (!keyMatch) continue;
    const key = keyMatch[1];
    const value = keyMatch[2].trim();
    inPhraseList = key === 'trigger_phrases';

    if (key === 'trigger_phrases' && value.startsWith('[')) {
      // Inline list form: trigger_phrases: ["a", "b"]
      const inner = value.replace(/^\[|\]$/g, '');
      for (const entry of inner.split(',')) {
        if (phrases.length >= MAX_PHRASES_PER_DOC) break;
        const phrase = cleanScalar(entry);
        if (phrase) phrases.push(phrase);
      }
      inPhraseList = false;
      continue;
    }

    if (value) scalars[key] = cleanScalar(value);
  }

  if (phrases.length === 0) return null;

  return {
    title: scalars.title ?? '',
    description: scalars.description ?? '',
    triggerPhrases: phrases,
    importanceTier: (scalars.importance_tier ?? DEFAULT_TIER).toLowerCase(),
    contextType: (scalars.contextType ?? scalars.context_type ?? 'general').toLowerCase(),
  };
}

const HARVEST_SUBDIRS = ['references', 'assets'] as const;
const MAX_WALK_DEPTH = 6;
const MAX_DOCS_PER_SKILL = 200;

function isHarvestableMarkdown(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.md') && lower !== 'readme.md';
}

function walkDocsDir(dir: string, depth: number, collected: string[]): void {
  if (depth > MAX_WALK_DEPTH || collected.length >= MAX_DOCS_PER_SKILL) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (collected.length >= MAX_DOCS_PER_SKILL) return;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDocsDir(fullPath, depth + 1, collected);
      continue;
    }
    if (!entry.isFile() || !isHarvestableMarkdown(entry.name)) continue;
    collected.push(fullPath);
  }
}

/**
 * List harvestable doc files (references/assets markdown, READMEs
 * excluded) for one skill directory. Paths are absolute and sorted for
 * deterministic indexing.
 */
export function listSkillDocFiles(skillDir: string): string[] {
  const collected: string[] = [];
  for (const subdir of HARVEST_SUBDIRS) {
    const root = join(skillDir, subdir);
    try {
      if (!statSync(root).isDirectory()) continue;
    } catch {
      continue;
    }
    walkDocsDir(root, 0, collected);
  }
  return collected.sort();
}
