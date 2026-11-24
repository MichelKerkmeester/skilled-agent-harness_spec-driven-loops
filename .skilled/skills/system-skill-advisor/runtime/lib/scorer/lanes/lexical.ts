// ───────────────────────────────────────────────────────────────
// MODULE: Lexical Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { SCORING_CALIBRATION } from '../scoring-constants.js';
import { matchesPhraseBoundary, scoreTokenOverlap, tokenize, tokenizePrompt } from '../text.js';
import { scoreBm25LexicalShadowLane, type AdvisorBm25Match } from './bm25.js';

const SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  branch: ['git', 'worktree', 'merge'],
  commit: ['git', 'changes'],
  context: ['memory', 'session', 'save'],
  docs: ['documentation', 'readme', 'markdown'],
  document: ['documentation', 'markdown'],
  find: ['search', 'locate'],
  fix: ['debug', 'correct', 'patch'],
  prompt: ['improve', 'enhance', 'optimize'],
  review: ['audit', 'findings', 'regression'],
  save: ['memory', 'context', 'preserve'],
  search: ['find', 'locate', 'semantic'],
  spec: ['plan', 'packet', 'tasks', 'checklist'],
  test: ['vitest', 'verify'],
  write: ['create', 'generate', 'documentation'],
};

const CATEGORY_HINTS: Readonly<Record<string, readonly string[]>> = {
  'sk-doc': ['readme', 'feature catalog', 'playbook', 'taxonomy', 'documentation', 'docs', 'manual testing'],
  'system-spec-kit': ['spec folder', 'packet', 'plan', 'tasks', 'checklist', 'memory save', 'handover', 'implementation summary', 'corpus'],
  'system-deep-loop': ['deep research', 'deep-research', 'research loop', 'overnight research', 'delta record', 'state log', 'lineage', 'deep review', 'deep-review', 'review loop', 'release readiness', 'canonical jsonl', 'convergence tracked', 'iterative review', 'iterative review loop', 'spec folder audit', 'iterative audit', 'multi-pass review', 'review iteration', 'convergence detection', 'review packet', 'spec folder review'],
  'mcp-browser-use': ['chrome devtools', 'console errors'],
  'sk-prompt': ['better prompt', 'cleaner prompt', 'prompt package', 'system prompt', 'prompt variant'],
  'sk-git': ['git worktree', 'experiment branch', 'clean branch'],
  // 'browser' and 'layout' were removed as bare tokens: a single word here grants
  // +0.38 to every prompt containing it, which handed sk-code phrases that other hubs
  // declare verbatim — browser debug, browser agent, review this layout. A hint is for
  // a phrase that belongs to this hub, not a word that merely appears in its domain.
  'sk-code': ['javascript', 'opencode', 'classifier', 'helper', 'fixture', 'vitest', 'commonjs', 'typescript', 'python', 'script', 'mcp json', 'gate3 baseline'],
};

const BM25_SHADOW_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'shadow', 'experimental']);

export function isBm25LexicalShadowEnabled(): boolean {
  const value = process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW?.trim().toLowerCase();
  return value ? BM25_SHADOW_ENABLED_VALUES.has(value) : false;
}

function expandedTokens(prompt: string): string[] {
  const tokens = tokenizePrompt(prompt);
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const synonym of SYNONYMS[token] ?? []) {
      expanded.add(synonym);
    }
  }
  return [...expanded];
}

type ProjectedSkill = AdvisorProjection['skills'][number];

function lexicalCandidates(skill: ProjectedSkill): string[] {
  return [
    skill.id.replace(/-/g, ' '),
    skill.name,
    skill.description,
    ...skill.domains,
    ...skill.intentSignals,
    ...skill.keywords,
  ];
}

const vocabularyBySkill = new WeakMap<ProjectedSkill, Set<string>>();

/** The words a skill's own metadata holds, which the lexical lane scores against. */
export function lexicalVocabulary(skill: ProjectedSkill): Set<string> {
  const cached = vocabularyBySkill.get(skill);
  if (cached) return cached;
  const vocabulary = new Set(lexicalCandidates(skill).flatMap((entry) => tokenize(entry)));
  vocabularyBySkill.set(skill, vocabulary);
  return vocabulary;
}

const haystackBySkill = new WeakMap<ProjectedSkill, string>();

/** The skill's lexical text as one lowercase string, which the lane's evidence matches within. */
export function lexicalHaystack(skill: ProjectedSkill): string {
  const cached = haystackBySkill.get(skill);
  if (cached !== undefined) return cached;
  const haystack = lexicalCandidates(skill).join(' ').toLowerCase();
  haystackBySkill.set(skill, haystack);
  return haystack;
}

const sharingSkillsByProjection = new WeakMap<AdvisorProjection, Map<string, number>>();

function sharingSkillCounts(projection: AdvisorProjection): Map<string, number> {
  const cached = sharingSkillsByProjection.get(projection);
  if (cached) return cached;
  const counts = new Map<string, number>();
  for (const skill of projection.skills) {
    if (skill.kind !== 'skill') continue;
    for (const token of lexicalVocabulary(skill)) counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  sharingSkillsByProjection.set(projection, counts);
  return counts;
}

// A lexical score names a skill for the confidence floor only when the prompt
// holds one of the skill's words that few skills list. Synonyms widen recall for
// ranking, and "run", "check" or "mode" sit in many skills' metadata, so a prompt
// carrying only those names none of them. Command entries are left out of the
// count, because each one repeats its owner's words.
export function promptHoldsDistinctiveWord(prompt: string, skill: ProjectedSkill, projection: AdvisorProjection): boolean {
  const counts = sharingSkillCounts(projection);
  const skillCount = projection.skills.filter((entry) => entry.kind === 'skill').length;
  const maxSharing = Math.max(1, Math.floor(skillCount * SCORING_CALIBRATION.confidence.lexicalAnchorMaxSkillShare));
  const vocabulary = lexicalVocabulary(skill);
  return tokenizePrompt(prompt).some((token) => vocabulary.has(token) && (counts.get(token) ?? 0) <= maxSharing);
}

export function scoreLexicalLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = expandedTokens(prompt);
  // Normalize against the un-expanded prompt length so injected synonyms only add
  // recall and never enlarge the denominator against a literally-matching skill.
  const originalTokenCount = tokenizePrompt(prompt).length;
  const matches: LaneMatch[] = [];

  for (const skill of projection.skills) {
    const evidence: string[] = [];
    const candidates = lexicalCandidates(skill);
    let score = scoreTokenOverlap(tokens, candidates, originalTokenCount);

    for (const hint of CATEGORY_HINTS[skill.id] ?? []) {
      if (matchesPhraseBoundary(lower, hint)) {
        score += 0.38;
        evidence.push(`hint:${hint}`);
      }
    }

    // Evidence is harvested from the SAME candidate set the score was computed
    // over. Harvesting from a subset of it let a skill match on an intent signal or
    // a keyword, score well enough to clear the confidence floor, and still carry no
    // evidence at all — which takes the no-evidence uncertainty default and is then
    // dropped by the surfacing gate. The candidate was confident and invisible at
    // the same time, and nothing in the output said why.
    const haystack = lexicalHaystack(skill);
    const tokenHits = tokens.filter((token) => haystack.includes(token)).slice(0, 5);
    evidence.push(...tokenHits.map((token) => `token:${token}`));

    if (score <= 0.05) continue;
    matches.push({
      skillId: skill.id,
      lane: 'lexical',
      score: Math.min(score, 1),
      evidence: evidence.slice(0, 6),
    });
  }

  return matches;
}

export function scoreLexicalShadowLanes(
  prompt: string,
  projection: AdvisorProjection,
): { lexical: LaneMatch[]; bm25: AdvisorBm25Match[] } {
  const lexical = scoreLexicalLane(prompt, projection);
  return {
    lexical,
    bm25: isBm25LexicalShadowEnabled() ? scoreBm25LexicalShadowLane(prompt, projection) : [],
  };
}
