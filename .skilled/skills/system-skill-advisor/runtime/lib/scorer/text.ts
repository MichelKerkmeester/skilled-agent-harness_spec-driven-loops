// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Text Utilities
// ───────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a', 'about', 'able', 'actually', 'agent', 'all', 'also', 'an', 'and', 'any',
  'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'could', 'did',
  'do', 'does', 'even', 'for', 'from', 'get', 'give', 'go', 'going', 'had',
  'has', 'have', 'he', 'help', 'her', 'him', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'just', 'let', 'like', 'may', 'me', 'might', 'more',
  'most', 'must', 'my', 'need', 'no', 'not', 'now', 'of', 'on', 'only', 'or',
  'other', 'our', 'please', 'really', 'she', 'should', 'skill', 'skills',
  'so', 'some', 'tell', 'that', 'the', 'them', 'then', 'these', 'they',
  'thing', 'things', 'this', 'those', 'to', 'tool', 'try', 'us',
  'used', 'using', 'very', 'want', 'was', 'way', 'we', 'were', 'what', 'when',
  'where', 'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
]);

export function normalizeText(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_./-]+/g, ' ')
    .replace(/[^A-Za-z0-9:/`'". ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function tokenize(value: string, includeStopWords = false): string[] {
  const tokens = Array.from(value.toLowerCase().matchAll(/\b\w+\b/g), (match) => match[0]);
  return includeStopWords
    ? tokens
    : tokens.filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

// A typed slash command such as "/deep:research" or "/speckit:plan".
const SLASH_COMMAND = /(?:^|[^\w/])\/[a-z][\w-]*:[\w-]+/i;
// The execution-mode suffixes the command docs accept after a slash command,
// either attached ("/speckit:plan:auto") or as its own argument (":auto").
// They choose how the command runs, not what it is about, so they are not
// prompt content. The ":with-*" modifiers are left alone: their words name
// extra work (research, phases) and can carry intent.
const COMMAND_MODE_SUFFIX = /:(?:auto|confirm|autopilot|unattended)(?![\w-])/gi;

export function stripCommandModeSuffixes(prompt: string): string {
  const command = SLASH_COMMAND.exec(prompt);
  if (!command) return prompt;
  return prompt.slice(0, command.index) + prompt.slice(command.index).replace(COMMAND_MODE_SUFFIX, ' ');
}

// Tokenize a user prompt. Skill-side text goes through tokenize() unchanged.
export function tokenizePrompt(prompt: string, includeStopWords = false): string[] {
  return tokenize(stripCommandModeSuffixes(prompt), includeStopWords);
}

export function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export function phraseVariants(value: string): string[] {
  const lowered = value.trim().toLowerCase();
  if (!lowered) return [];
  return unique([
    lowered,
    lowered.replace(/-/g, ' '),
    lowered.replace(/_/g, ' '),
    lowered.replace(/-/g, '_'),
    normalizeText(lowered),
  ].filter(Boolean));
}

export function skillNameVariants(skillId: string | null | undefined): string[] {
  if (typeof skillId !== 'string' || skillId.trim().length === 0) return [];
  const base = skillId.toLowerCase();
  return unique([
    base,
    `$${base}`,
    `/${base}`,
    base.replace(/-/g, ' '),
    base.replace(/-/g, '_'),
  ]);
}

export function matchesPhraseBoundary(text: string, phrase: string): boolean {
  const normalizedPhrase = phrase.trim().toLowerCase();
  if (!normalizedPhrase) return false;
  const escaped = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<!\\w)${escaped}(?!\\w)`).test(text);
}

export function phraseSpecificity(phrase: string): number {
  const count = Math.max(1, tokenize(phrase, true).length);
  return Math.min(0.7 + 0.18 * (count - 1), 1);
}

// denominatorBasis lets callers that expand the prompt (e.g. synonym injection)
// normalize by the ORIGINAL prompt-token count, so adding synonyms can only help
// recall and never dilutes a true match's score. Defaults to promptTokens.length
// for callers that pass un-expanded tokens.
export function scoreTokenOverlap(
  promptTokens: readonly string[],
  candidateText: readonly string[],
  denominatorBasis: number = promptTokens.length,
): number {
  const candidateTokens = new Set(candidateText.flatMap((entry) => tokenize(entry)));
  if (candidateTokens.size === 0 || promptTokens.length === 0) return 0;
  let hits = 0;
  for (const token of promptTokens) {
    if (candidateTokens.has(token)) {
      hits += 1;
      continue;
    }
    for (const candidate of candidateTokens) {
      // A short prompt word inside or at the end of "allowlist" ("list") names a different concept.
      // A prompt extension ("regressions") or skill extension ("plan" -> "planning") stays related.
      if (token.length >= 4 && candidate.length >= 4 && (token.includes(candidate) || candidate.startsWith(token))) {
        hits += 0.45;
        break;
      }
    }
  }
  return Math.min(hits / Math.max(3, denominatorBasis), 1);
}

export function isReadOnlyExplainer(promptLower: string): boolean {
  const readOnly = /\b(analyze|explain|inspect|summarize|list|show|tell|compare|decompose)\b/.test(promptLower);
  const skillSurface = /\b(review|audit|deep[- ]research|deep[- ]review|semantic search|figma|clickup|chrome devtools|git worktree|prompt)\b/.test(promptLower);
  const explicitNoWrite = /\b(no edits?|without making changes|do not (change|edit|modify|touch)|read-only only|no edits yet|only; do not|just show|just list)\b/.test(promptLower);
  if (skillSurface) return false;
  if (readOnly && explicitNoWrite) return true;
  if (/^\s*(analyze|explain|inspect|summarize|list|show|tell|compare|decompose)\b/.test(promptLower)
    && !/\b(then|and)\s+(add|build|change|configure|create|edit|fix|generate|implement|modify|move|patch|refactor|rename|replace|run|save|start|update|write)\b/.test(promptLower)) {
    return true;
  }
  const write = /\b(add|build|change|configure|create|disable[sd]?|edit|enable[sd]?|execute|fix|generate|implement|modify|patch|refactor|rename|re-?run|run|save|switch (?:on|off)|turn (?:on|off)|update|write)\b/.test(promptLower);
  return readOnly && !write && !skillSurface;
}
