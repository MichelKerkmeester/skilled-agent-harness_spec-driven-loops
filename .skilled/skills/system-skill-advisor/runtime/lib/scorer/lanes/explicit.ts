// ───────────────────────────────────────────────────────────────
// MODULE: Explicit Author Lane
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
import type { AdvisorProjection, LaneMatch } from '../types.js';
import { phraseSpecificity, skillNameVariants, tokenize, tokenizePrompt } from '../text.js';
import { MODE_CUES } from '../../command-attach.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────
interface ExplicitLaneOptions {
  readonly includeProducerIdentity?: boolean;
}

interface ExplicitScoreEntry {
  score: number;
  readonly evidence: string[];
  readonly producerSkillIds: Set<string>;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────
const TOKEN_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  audit: [['sk-code', 0.75]],
  branch: [['sk-git', 0.45]],
  checklist: [['system-spec-kit', 0.55]],
  chrome: [['mcp-browser-use', 0.95]],
  commit: [['sk-git', 0.65]],
  commonjs: [['sk-code', 0.75]],
  context: [['system-spec-kit', 0.65]],
  corpus: [['system-spec-kit', 0.45]],
  dashboard: [['sk-code', 0.35]],
  debug: [['sk-code', 0.25]],
  devtools: [['mcp-browser-use', 1]],
  docs: [['sk-doc', 0.8]],
  documentation: [['sk-doc', 0.85]],
  frontend: [['sk-code', 0.7]],
  git: [['sk-git', 1]],
  github: [['sk-git', 0.95]],
  gitkraken: [['sk-git', 0.9]],
  har: [['mcp-browser-use', 0.75]],
  javascript: [['sk-code', 0.65]],
  json: [['sk-code', 0.4]],
  jsonl: [['sk-code', 0.45], ['system-spec-kit', 0.35]],
  mcp: [['sk-code', 0.65], ['mcp-code-mode', 0.45]],
  memory: [['system-spec-kit', 0.95]],
  packet: [['system-spec-kit', 0.55]],
  playbook: [['sk-doc', 0.75]],
  pr: [['sk-code', 0.5], ['sk-git', 0.35]],
  prompt: [['sk-prompt', 0.75]],
  prompts: [['sk-prompt', 0.75]],
  python: [['sk-code', 0.7]],
  readme: [['sk-doc', 0.95]],
  rebase: [['sk-git', 0.85]],
  reducer: [['sk-code', 0.35]],
  regression: [['sk-code', 0.55]],
  responsive: [['sk-code', 0.55]],
  review: [['sk-code', 0.85]],
  reviewer: [],
  routing: [['system-spec-kit', 0.25]],
  save: [['system-spec-kit', 0.6]],
  shell: [['sk-code', 0.55]],
  staging: [['mcp-browser-use', 0.35]],
  style: [['sk-code', 0.4]],
  taxonomy: [['sk-doc', 0.45]],
  tests: [['sk-code', 0.35]],
  typescript: [['sk-code', 0.75]],
  vitest: [['sk-code', 0.85]],
  vscode: [['sk-code', 0.75]],
  worktree: [['sk-git', 1]],
  delete: [['system-spec-kit', 0.45]],
  scratch: [['system-spec-kit', 0.45]],
  // sk-code surface keywords: system-code surfaces.
  classifier: [['sk-code', 0.45]],
  fixture: [['sk-code', 0.55]],
  'gate-3-classifier': [['sk-code', 0.95]],
  'negative-trigger': [['sk-code', 0.8]],
};
// Every PHRASE_BOOSTS amount must lie in the closed interval [-1.0, 2.0], the
// same range the doctor skill-advisor proposal validator enforces
// (`phrase_boost_range` in .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml).
// Negative values are allowed for suppressive disambiguation, and the lane still
// clamps each emitted score to at most 1.
export const PHRASE_BOOST_BOUND = { min: -1.0, max: 2.0 } as const;

export const PHRASE_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  '/create:agent': [['create:agent', 1.6], ['sk-doc', 0.45]],
  '/create:manual-testing-playbook': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],
  '/memory:save': [['command-speckit-save', 1.6], ['system-spec-kit', 0.45]],
  '/speckit:save': [['command-speckit-save', 1.6], ['system-spec-kit', 0.45]],
  '/deep:research': [['system-deep-loop', 1.6]],
  '/deep:review': [['system-deep-loop', 1.6]],
  '/speckit:resume': [['system-spec-kit', 0.9], ['command-speckit-resume', 0.75]],
  'auto review release readiness': [['system-deep-loop', 1]],
  // Colon-command syntax (":review:auto") is a deep-review LOOP invocation,
  // distinct from natural-language "auto review this PR" (which routes to
  // sk-code's code-review mode). Strong direct-evidence anchor + a bounded
  // penalty on the single-pass skill so the loop skill wins the rank.
  ':review:auto': [['system-deep-loop', 1.6], ['sk-code', -0.6]],
  ':review:confirm': [['system-deep-loop', 1.6], ['sk-code', -0.6]],
  // Domain phrase anchors (multi-token, so they lift confidence via the direct
  // lane without firing on single tokens like "cms").
  'webflow cms': [['mcp-code-mode', 1.5], ['sk-code', -0.5]],
  'cms collection': [['mcp-code-mode', 1.4]],
  'chrome devtools': [['mcp-browser-use', 1]],
  'gitlens launchpad': [['sk-git', 0.85]],
  'staging url': [['mcp-browser-use', 0.65]],
  'staging site': [['mcp-browser-use', 0.65]],
  'staging website': [['mcp-browser-use', 0.65]],
  'live site': [['mcp-browser-use', 0.65]],
  'live website': [['mcp-browser-use', 0.65]],
  'live url': [['mcp-browser-use', 0.65]],
  'production site': [['mcp-browser-use', 0.65]],
  'production website': [['mcp-browser-use', 0.65]],
  'production url': [['mcp-browser-use', 0.65]],
  'browser console': [['mcp-browser-use', 0.75]],
  // The bare `mcp` and `context` token boosts outweigh a hub that declares the
  // exact two-word phrase, so these anchors hand the phrase back to its owner.
  'figma mcp': [['mcp-tooling', 0.65], ['sk-code', -0.5]],
  'browser automation': [['mcp-browser-use', 1], ['sk-code', -0.5]],
  // A browser automation test is test code to write or fix, so the anchor above
  // must not take it from the code skill.
  'automation test': [['sk-code', 1], ['mcp-browser-use', -1]],
  'ruleset context': [['sk-code', 0.65], ['system-spec-kit', -0.5]],
  'cleaner prompt': [['sk-prompt', 1]],
  'code review': [['sk-code', 1]],
  'review the routing': [['sk-code', 0.6]],
  'review the taxonomy': [['sk-code', 0.6]],
  'review the routing taxonomy': [['sk-code', 1.1], ['sk-doc', -0.4]],
  'review the packet docs': [['sk-code', 1.2]],
  'audit packet docs': [['sk-code', 1.2]],
  'audit whether': [['sk-code', 1.2]],
  'audit the': [['sk-code', 1.0]],
  'documented consistently': [['sk-code', 1]],
  'scoped correctly': [['sk-code', 1]],
  'iteration is scoped': [['sk-code', 1]],
  'classifier vocabulary': [['sk-code', 0.9]],
  'commonjs helper': [['sk-code', 1]],
  'create a prompt': [['sk-prompt', 0.95]],
  'deep research': [['system-deep-loop', 1]],
  // A deep review of a branch is a review loop, not git work, so the word
  // branch must not let the git skill tie the phrase.
  'deep review': [['system-deep-loop', 1], ['sk-git', -0.5]],
  'deep-research': [['system-deep-loop', 1.3]],
  'deep-review': [['system-deep-loop', 1.3]],
  // Asking about the council names the council command; the word review in the
  // same question is the comparison, not a code review request.
  'ai council': [['command-speckit-ai-council', 1], ['sk-code', -0.6]],
  // Plain wording for a deep run: the phrase names the convergence a review loop stops on.
  'findings stop changing': [['system-deep-loop', 1.2], ['sk-code', -0.6]],
  'gate 3': [['system-spec-kit', 0.35], ['sk-code', 0.25]],
  'gate-3-classifier': [['sk-code', 1]],
  'generate implementation-summary': [['system-spec-kit', 1]],
  'implementation-summary.md': [['system-spec-kit', 0.8]],
  'continuation prompts': [['system-spec-kit', 0.9]],
  'first-100 predictions': [['system-spec-kit', 0.8]],
  'improve my prompt': [['sk-prompt', 1]],
  'manual testing playbook': [['sk-doc', 1]],
  'negative-trigger whitelist': [['sk-code', 0.9]],
  'list any mismatches': [['sk-code', 0.8]],
  'pull request': [['sk-code', 0.45], ['sk-git', 0.45]],
  'resume deep research': [['system-deep-loop', 1]],
  'resume deep review': [['system-deep-loop', 1]],
  'resume the phase folder': [['system-spec-kit', 1]],
  'phase folder': [['system-spec-kit', 0.75]],
  'routing dashboard': [['sk-code', 0.35]],
  'routing study config': [['system-spec-kit', 0.85]],
  'css layout': [['sk-code', 0.85]],
  'create a new agent': [['create:agent', 1.6], ['sk-doc', 0.45]],
  'create a test playbook': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'create a testing playbook': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'create new agent': [['create:agent', 1.6], ['sk-doc', 0.45]],
  'create test playbook': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'create testing playbook': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],
  // Plain wording for three create modes whose rival skills share their words.
  'prompt shortcut': [['sk-doc', 1]],
  'intent file': [['sk-doc', 1]],
  'test script package': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'save context': [['command-speckit-save', 1.6], ['system-spec-kit', 0.45]],
  'save memory': [['command-speckit-save', 1.6], ['system-spec-kit', 0.45]],
  'source-type mix': [['system-spec-kit', 0.35]],
  'system prompt': [['sk-prompt', 0.8]],
  'prompt variant': [['sk-prompt', 1]],
  'user prompt': [['sk-prompt', 0.9]],
  'cleaner user prompt': [['sk-prompt', 1]],
  // "OpenCode Go" is a provider route, not a code surface: the code hub's OpenCode
  // vocabulary is the authoring nouns below. Only the two-word phrase routes, so a
  // bare runtime mention still reaches the code hub through its own author keyword
  // at reduced weight, and the provider route reaches the hub that dispatches it.
  'opencode go': [['cli-external-orchestration', 1]],
  // sk-code phrases: system-code surfaces.
  'opencode skill': [['sk-code', 0.95]],
  'opencode agent': [['sk-code', 0.85]],
  'opencode command': [['sk-code', 0.85]],
  'opencode plugin': [['sk-code', 0.85]],
  'smart router': [['sk-code', 0.65]],
  'language standards': [['sk-code', 0.6]],
  'typescript helper': [['sk-code', 0.75]],
  'python script': [['sk-code', 0.75]],
  'shell script': [['sk-code', 0.7]],
  'parallel routes': [['sk-code', 0.85]],
  'route handler': [['sk-code', 0.7]],
  'metadata api': [['sk-code', 0.65]],
  // The overlay engine's manifest is the doctor skill's file, so the `json` in
  // its name names no code to write.
  '.skilled-overlays.json': [['system-skilled-doctor', 1.2], ['sk-code', -0.6]],
  'overlay status': [['system-skilled-doctor', 1]],
};

const WRITE_VERB_WORDS = ['add', 'build', 'change', 'configure', 'create', 'edit', 'fix', 'generate', 'implement', 'modify', 'patch', 'refactor', 'rename', 'replace', 'run', 'update', 'write'];
const WRITE_VERBS = new RegExp(`\\b(${WRITE_VERB_WORDS.join('|')})\\b`);
// A write verb that the prompt negates ("don't write anything back", "do not edit
// files") forbids the write rather than asking for it, so it must not award a
// write-surface boost. Both apostrophe forms are matched because prompts arrive
// with typographic quotes as often as straight ones.
const NEGATED_WRITE = /\b(?:don['’]t|do not|never|without)\s+(?:\w+\s+){0,2}?(?:add|build|chang|configur|creat|edit|fix|generat|implement|modif|patch|refactor|renam|replac|run|updat|writ|wrot)\w*\b/g;
// A release request is git work only when the prompt also names a tag. The bare
// word `release` stays out of sk-git's vocabulary, because an update, a release
// note or a dependency release is not a git release. A tag counts only as a git
// tag, a tag push or a version number, never a label on subscribers or posts.
const RELEASE_ACTION = /\b(?:cut|tag|publish|ship)\s+(?:a|an|the)?\s*(?:new\s+)?release\b(?!\s+(?:notes?|blog|post|party|announcement|newsletter))/;
const TAG_CONTEXT = /\b(?:git\s+tag|(?:push|create)\s+(?:the\s+|a\s+|an\s+(?:annotated\s+)?)?tags?|tag\s+(?:it|the\s+(?:version|release|commit))|v\d+(?:\.\d+)+|tagged|tagging)\b/;
// A README check across overlay folders is the docs leg of the overlay status
// audit. Writing a README stays doc work, so the rule holds only when no verb
// authors one; running the audit is not a README write.
// The doc penalty outweighs the README token plus its author phrase, which both fire here.
// The match anchors on Skilled overlay vocabulary, because a bare "overlay" is
// as often a UI modal or tooltip whose README is plain doc work.
const OVERLAY_README_CHECK = /(?:\bskilled[\s-]overlays?\b|\boverlays?\s+(?:folders?|status|manifest|audit|roots?)\b)(?:\s+[\w-]+){0,6}?\s+(?:a\s+|the\s+)?readme\b/;
// Every write verb authors a README except `run`, which runs the audit, plus the
// verbs that only ever reword prose.
const README_AUTHORING_WORDS = [...WRITE_VERB_WORDS.filter((verb) => verb !== 'run'), 'draft', 'improve', 'polish', 'revise', 'rewrite'];
const README_AUTHORING = new RegExp(`\\b(?:${README_AUTHORING_WORDS.join('|')})\\b`);
const MEMORY_PRESERVATION_SESSION_INTENT = /\b(preserve|remember|capture|keep|store)\b.*\b(next|future|later)\s+session\b|\b(next|future|later)\s+session\b.*\b(lose|lost|preserve|remember|capture|keep|store)\b/;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────
function push(
  scores: Map<string, ExplicitScoreEntry>,
  skillId: string,
  amount: number,
  evidence: string,
  producerSkillId?: string,
): void {
  const current = scores.get(skillId) ?? { score: 0, evidence: [], producerSkillIds: new Set<string>() };
  current.score += amount;
  current.evidence.push(evidence);
  if (producerSkillId) {
    current.producerSkillIds.add(producerSkillId);
  }
  scores.set(skillId, current);
}

const TRACKER_STATUS_REVIEW = /\b(?:in|to|into)\s+review\b|\bstatus\b[^.?!]*\breview\b/;
const TRACKER_ITEM = /\b(?:ticket|tickets|issue|issues|task|tasks|card|story|clickup|jira|linear|kanban|column)\b/;
// The design tools the MCP transports read. A dashboard pulled from one is a design
// fetch, so the word names no code to write.
const DESIGN_TOOL_SOURCE = /\b(?:figma|refero|mobbin)\b/;
// A read verb ahead of one of those tools, such as "get the dashboard design
// from figma" or "grab the figma frame".
const DESIGN_TOOL_READ = /\b(?:get|fetch|pull|grab|read|download|export|copy|open|inspect)\b.{0,60}?\b(?:figma|refero|mobbin)\b/;
const WORD_CHAR = /\w/;
const WHITESPACE_CHAR = /\s/;
// `changelog` alone names sk-doc's changelog mode; only its file forms count as
// a doc-file target. The `(?!\w)` bound keeps `readme` from matching `readmes`;
// a `changelog/` path is followed by a file name, so it carries no bound.
const DOC_FILE_SUFFIX = /^\s*(?:(?:skill\.md|router\.md|readme(?:\.md)?|changelog\.md)(?!\w)|changelog\/)/;

// A skill name or author phrase inside a path or beside a doc filename names a location, not a request to use the skill.
function hasPlainMention(text: string, phrase: string): boolean {
  const normalized = phrase.trim().toLowerCase();
  if (!normalized) return false;
  const skipPathRule = normalized.includes('/');
  // A plain word joined to another by a hyphen is part of a compound name, such as
  // a repository called `ai-speckit`, so it names that thing, not this phrase.
  const plainWord = /^\w+$/.test(normalized);
  let index = text.indexOf(normalized);
  while (index !== -1) {
    const before = text[index - 1] ?? '';
    const after = text[index + normalized.length] ?? '';
    const joinedBefore = plainWord && before === '-' && WORD_CHAR.test(text[index - 2] ?? '');
    const joinedAfter = plainWord && after === '-'
      && WORD_CHAR.test(text[index + normalized.length + 1] ?? '');
    const bounded = (before === '' || !WORD_CHAR.test(before)) && (after === '' || !WORD_CHAR.test(after))
      && !joinedBefore && !joinedAfter;
    if (bounded && !DOC_FILE_SUFFIX.test(text.slice(index + normalized.length))) {
      if (skipPathRule) return true;
      let tokenStart = index;
      while (tokenStart > 0 && !WHITESPACE_CHAR.test(text[tokenStart - 1] ?? '')) tokenStart -= 1;
      let tokenEnd = index + normalized.length;
      while (tokenEnd < text.length && !WHITESPACE_CHAR.test(text[tokenEnd] ?? '')) tokenEnd += 1;
      const token = text.slice(tokenStart, tokenEnd);
      if (token.indexOf('/', 1) === -1) return true;
    }
    index = text.indexOf(normalized, index + 1);
  }
  return false;
}

// A command phrase written with other small words between its own still names
// that command: "re-pin the vendored skilled tree" asks for "re-pin my vendored
// skilled". Only phrases of three or more content words qualify, and those words
// must sit close together in the prompt, so a long prompt that happens to use
// them apart does not match. The match scores below an exact one.
const NEAR_PHRASE_MIN_WORDS = 3;
const NEAR_PHRASE_EXTRA_WORDS = 2;
const NEAR_PHRASE_FACTOR = 0.85;

function hasCloseContentWords(promptContent: readonly string[], phrase: string, promptWords: ReadonlySet<string>): boolean {
  const phraseContent = [...new Set(tokenize(phrase))];
  if (phraseContent.length < NEAR_PHRASE_MIN_WORDS) return false;
  // The leading word carries the phrase's verb or question ("which ... are stale"),
  // so a prompt that only shares the later words is about something else.
  const [leadingWord] = tokenize(phrase, true);
  if (!leadingWord || !promptWords.has(leadingWord)) return false;
  const window = phraseContent.length + NEAR_PHRASE_EXTRA_WORDS;
  for (let start = 0; start < promptContent.length; start += 1) {
    const slice = new Set(promptContent.slice(start, start + window));
    if (phraseContent.every((word) => slice.has(word))) return true;
  }
  return false;
}

const SLASH_TARGET_PHRASE = /^\/\S+\s+\S/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A typed `<command> <target>` names that target, so the bare command inside it must not also
// match the command's default target. Each known command-and-target phrase is blanked before a
// bare slash command is tested, which leaves a bare command typed alone, or before another word,
// still matching.
function maskSlashTargets(text: string, targetPhrases: readonly string[]): string {
  let masked = text;
  for (const phrase of targetPhrases) {
    masked = masked.replace(new RegExp(`${escapeRegExp(phrase)}(?!\\w)`, 'g'), (match) => ' '.repeat(match.length));
  }
  return masked;
}

// The prompt with every negated write phrase blanked, so a write-surface test
// sees only the writes the prompt actually asks for.
function affirmedWriteText(text: string): string {
  return text.replace(NEGATED_WRITE, (match) => ' '.repeat(match.length));
}

function targetsOwnDocFile(text: string, skillId: string): boolean {
  if (!WRITE_VERBS.test(text)) return false;
  for (const variant of skillNameVariants(skillId)) {
    let index = text.indexOf(variant);
    while (index !== -1) {
      const before = text[index - 1] ?? '';
      if ((before === '' || !WORD_CHAR.test(before)) && DOC_FILE_SUFFIX.test(text.slice(index + variant.length))) {
        return true;
      }
      index = text.indexOf(variant, index + 1);
    }
  }
  return false;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────
export function scoreExplicitLane(
  prompt: string,
  projection: AdvisorProjection,
  options: ExplicitLaneOptions = {},
): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = tokenizePrompt(prompt, true);
  const scores = new Map<string, ExplicitScoreEntry>();

  for (const [phrase, boosts] of Object.entries(PHRASE_BOOSTS)) {
    if (!lower.includes(phrase)) continue;
    for (const [skillId, amount] of boosts) {
      push(scores, skillId, amount, `phrase:${phrase}`);
    }
  }

  // "In review" on a ticket or card is a tracker column, not a request to review code.
  const reviewIsStatus = TRACKER_STATUS_REVIEW.test(lower) && TRACKER_ITEM.test(lower);
  const dashboardIsDesign = DESIGN_TOOL_SOURCE.test(lower);
  for (const token of tokens) {
    if (token === 'review' && reviewIsStatus) continue;
    if (token === 'dashboard' && dashboardIsDesign) continue;
    for (const [skillId, amount] of TOKEN_BOOSTS[token] ?? []) {
      push(scores, skillId, amount, `token:${token}`);
    }
  }

  const writes = WRITE_VERBS.test(affirmedWriteText(lower));
  // Taking a frame out of a design tool is the MCP transport's read, so the
  // code skill's design-to-code phrases ("from figma") do not claim it. A build
  // verb makes it design-to-code work again.
  if (!writes && DESIGN_TOOL_READ.test(lower)) {
    push(scores, 'mcp-tooling', 0.9, 'design-tool-read');
    push(scores, 'sk-code', -0.5, 'design-tool-read');
  }
  const overlayReadmeCheck = OVERLAY_README_CHECK.test(lower) && !README_AUTHORING.test(affirmedWriteText(lower));
  if (overlayReadmeCheck) {
    push(scores, 'system-skilled-doctor', 1, 'overlay-readme-check');
    push(scores, 'sk-doc', -1.5, 'overlay-readme-check');
  }
  if (writes && !overlayReadmeCheck && /\b(readme|docs|documentation|playbook|taxonomy|markdown|feature_catalog|skill\.md|router\.md)\b/.test(lower)) {
    push(scores, 'sk-doc', 0.7, 'write-doc-surface');
  }
  if (writes && /\b(classifier|helper|fixture|json|jsonl|vitest|typescript|python|script|skill_advisor\.py|mcp\.json|commonjs)\b/.test(lower)) {
    push(scores, 'sk-code', 0.7, 'write-system-code-surface');
  }
  if (writes && /\b(error classes|trigger gap|reporter|mismatches?|bucket|gate 3)\b/.test(lower)) {
    push(scores, 'sk-code', 0.6, 'write-routing-tool-surface');
  }
  if (RELEASE_ACTION.test(lower) && TAG_CONTEXT.test(lower)) {
    push(scores, 'sk-git', 0.9, 'tagged-release-intent');
  }
  if (MEMORY_PRESERVATION_SESSION_INTENT.test(lower)) {
    push(scores, 'command-speckit-save', 1.2, 'memory-preservation-session-intent');
    push(scores, 'system-spec-kit', 0.3, 'memory-preservation-session-intent');
  }
  if (lower.includes('/speckit:resume')) {
    push(scores, 'system-spec-kit', 0.4, 'speckit-resume-skill-disambiguation');
    push(scores, 'command-speckit-resume', -1.0, 'speckit-resume-skill-disambiguation');
  }
  // Review-plus-write intent. When the prompt contains the word `review`
  // AND an explicit write/edit verb (`update|edit|fix|modify`), the request
  // is implementation work; anchor the explicit lane firmly on `sk-code` so
  // the code hub wins the skill selection (its router then selects the
  // implement mode rather than the code-review mode). The lane's emit clamps
  // with `Math.min(value.score, 1)`, so the wide magnitude only guarantees
  // the anchor; it cannot overshoot.
  if (/\breview\b/.test(lower) && /\b(update|edit|fix|modify)\b/.test(lower)) {
    push(scores, 'sk-code', 3.0, 'review-plus-write-disambiguation');
  }
  const researchLoop = /\b(continue|resume|launch|kick off|overnight|convergence|iterations?|iterative(?:ly)?|multi-pass|loop)\b/.test(lower) && /\bresearch\b/.test(lower);
  if (researchLoop) {
    push(scores, 'system-deep-loop', 0.85, 'research-loop');
  }
  // A loop verb counts only when it governs the review ("resume the active
  // deep-review"); a resume or start elsewhere in a review prompt is a topic.
  const reviewLoop = /\b(continue|resume|launch|start)(?:\s+[\w-]+){0,3}?\s+(?:deep[- ])?review\b|\b(convergence|iterations?|iterative(?:ly)?|multi-pass|loop)\b/.test(lower) && /\breview\b/.test(lower);
  if (reviewLoop) {
    push(scores, 'system-deep-loop', 0.85, 'review-loop');
    // An iteration count or a request for several passes asks for the loop
    // itself, so it outweighs the single-pass code review sk-code would run.
    if (/\b(audit|spec folder|packet|convergence|iterations|(?:multiple|several|many) passes)\b|\b\d+\s+(?:[\w-]+\s+){0,2}?iterations?\b/.test(lower)) {
      push(scores, 'sk-code', -0.6, 'iterative-review-vs-pr-disambiguation');
    }
  }
  // The two rules above read the literal words research and review. A prompt
  // that asks for the loop by iterations or passes and says investigate, look
  // into or audit instead asks for the same run. Depth wording such as
  // thorough asks for care inside one pass, so it is not read here.
  if (!researchLoop && !reviewLoop
    && /\b(iterations?|iterative(?:ly)?|multi-pass|(?:multiple|several|many) passes)\b/.test(lower)) {
    if (MODE_CUES.research.test(lower)) push(scores, 'system-deep-loop', 0.85, 'research-loop-wording');
    else if (MODE_CUES.review.test(lower)) push(scores, 'system-deep-loop', 0.85, 'review-loop-wording');
  }
  if (/\b(figure out|find|diagnose|debug)\b.{0,40}\b(wrong|broken|failing|bug|issue)\b.{0,40}\bcode\b|\b(wrong|broken|failing)\b.{0,30}\bcode\b/.test(lower)) {
    push(scores, 'sk-code', 0.9, 'ambiguous-code-problem');
    push(scores, 'system-deep-loop', 0.45, 'ambiguous-code-problem');
  }

  const promptContent = tokenize(lower);
  const promptWords = new Set(tokenize(lower, true));
  const slashTargetPhrases = [...new Set(projection.skills.flatMap((skill) => [...skill.intentSignals, ...skill.keywords])
    .map((phrase) => phrase.trim().toLowerCase())
    .filter((phrase) => SLASH_TARGET_PHRASE.test(phrase)))];
  const slashMasked = slashTargetPhrases.length > 0 ? maskSlashTargets(lower, slashTargetPhrases) : lower;

  for (const skill of projection.skills) {
    const skillId: unknown = skill.id;
    if (typeof skillId !== 'string' || skillId.trim().length === 0) continue;
    // A write verb aimed at a skill's own doc file makes it the edit location, not the tool doing the work.
    const docTarget = targetsOwnDocFile(lower, skillId);
    for (const variant of skillNameVariants(skillId)) {
      if (hasPlainMention(lower, variant)) {
        push(scores, skillId, 1, `explicit:${variant}`);
      }
    }
    if (docTarget) continue;
    // A bare word declared both as an intent signal and as a keyword counts once.
    // Scoring it once per field let a generic word such as `css` reach the lane
    // cap and outrank a skill that declares the exact phrase the prompt typed.
    // A multi-word phrase declared in both fields keeps both counts: it is
    // specific, and shipped routes rest on that weight.
    const scoredSingleWords = new Set<string>();
    for (const phrase of [...skill.intentSignals, ...skill.keywords]) {
      const normalized = phrase.trim().toLowerCase();
      if (tokenize(normalized, true).length <= 1) {
        if (scoredSingleWords.has(normalized)) continue;
        scoredSingleWords.add(normalized);
      }
      const bareSlash = normalized.startsWith('/') && !/\s/.test(normalized);
      if (hasPlainMention(bareSlash ? slashMasked : lower, phrase)) {
        push(
          scores,
          skillId,
          phraseSpecificity(phrase),
          `author:${phrase}`,
          options.includeProducerIdentity ? skillId : undefined,
        );
      } else if (skill.kind === 'command' && !bareSlash && hasCloseContentWords(promptContent, normalized, promptWords)) {
        push(
          scores,
          skillId,
          phraseSpecificity(phrase) * NEAR_PHRASE_FACTOR,
          `author~:${phrase}`,
          options.includeProducerIdentity ? skillId : undefined,
        );
      }
    }
  }

  return [...scores.entries()].map(([skillId, value]) => {
    const producerSkillIds = [...value.producerSkillIds].sort();
    return {
      skillId,
      lane: 'explicit_author' as const,
      score: Math.min(value.score, 1),
      evidence: value.evidence.slice(0, 6),
      ...(producerSkillIds.length > 0 ? { producerSkillIds } : {}),
    };
  });
}
