'use strict';

// This router scores directly against the routingModel that registry-compiler.cjs
// builds from hub-router.json. It does not go through the generic
// destinationGraph detector and selector evaluator, because the authored routing
// contract is the weighted vocabulary scorer in hub-router.json: a prompt scores
// each mode by its distinct keyword matches times the mode's weight, near-ties
// within ambiguityDelta route together in tie-break order, and a prompt that
// matches no mode defers because the hub declares no default mode. The generic
// policy is still compiled and hashed for the policy card and provenance.

const {
  computeRequestFactsHash,
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecision,
} = require('../../../005-decision-evaluator/lib/decision-contract.cjs');

function normalize(value) {
  return String(value).trim().toLowerCase();
}

// A hyphenated and a spaced prompt name the same thing, so both sides fold
// hyphen runs to one space and collapse whitespace before comparing.
function spaced(value) {
  return String(value).replace(/-+/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsSignal(text, value) {
  return spaced(text).includes(spaced(normalize(value)));
}

// A keyword that opens with ORDERED_KEYWORD_PREFIX names whole words that must
// appear in the prompt in the order given, each at most MAX_ORDERED_GAP words
// after the one before. A contiguous phrase cannot reach a request that names
// its bot in the middle ("pause the triage bot"), and a whole-word test keeps
// "bot" from matching inside "robot". A plain keyword keeps the contiguous test.
const ORDERED_KEYWORD_PREFIX = '~';
const MAX_ORDERED_GAP = 3;

function isOrderedKeyword(value) {
  return normalize(value).startsWith(ORDERED_KEYWORD_PREFIX);
}

// Bot names are kebab-case, so a hyphenated token such as "release-notes"
// counts as one word here. Otherwise a two-part name would use up two of the
// words allowed between "run" and "bot". An apostrophe inside a word stays in
// it for the same reason, so "michel's" is one word rather than two, and a
// possessive "'s" or trailing "'" is then dropped so "bot's" still reads as
// "bot" and "robot's" as "robot". A curly apostrophe counts as a straight one.
// Only ordered keywords split this way; the contiguous test still folds
// hyphens to spaces. The compiler counts an ordered keyword's words with this
// same function, so a keyword it accepts is the keyword the router serves.
function promptWords(value) {
  return normalize(value)
    .replace(/[‘’]/g, "'")
    .split(/[^\p{L}\p{N}'-]+/u)
    .map((word) => word
      .replace(/-+/g, '-')
      .replace(/^['-]+|['-]+$/g, '')
      .replace(/'s$/, ''))
    .filter(Boolean);
}

function orderedWordsFrom(words, wanted, index, start, end) {
  if (index === wanted.length) return true;
  const stop = Math.min(end, words.length);
  for (let position = start; position < stop; position += 1) {
    if (words[position] === wanted[index]
      && orderedWordsFrom(words, wanted, index + 1, position + 1, position + 2 + MAX_ORDERED_GAP)) {
      return true;
    }
  }
  return false;
}

function containsOrderedWords(text, value) {
  const wanted = promptWords(normalize(value).slice(ORDERED_KEYWORD_PREFIX.length));
  return wanted.length > 0 && orderedWordsFrom(promptWords(text), wanted, 0, 0, Infinity);
}

function requestFor(snapshot, input) {
  const request = {
    evidence: [],
    observations: [{ kind: 'intent', value: input.prompt || '' }],
    pinnedActivationGeneration: snapshot.policy.activationGeneration,
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function negative(action, payload) {
  return parseRouteDecision({ action, [action]: { ...payload, authority: 'Withheld' }, schemaVersion: 'V1' });
}

function route(snapshot, selectionKind, modes) {
  const byMode = new Map(snapshot.policy.destinations.map((destination) => (
    [destination.id.workflowMode, destination]
  )));
  return parseRouteDecision({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence: [],
      selectionKind,
      targets: modes.map((mode) => target(byMode.get(mode))),
    },
    schemaVersion: 'V1',
  }, snapshot.policy);
}

// A vocabulary that lists both spellings of one phrase names it once, so the
// fold-deduped count keeps a single mention worth one hit rather than two.
// Ordered keywords are a fallback for a prompt no plain keyword reached in any
// mode. Every prompt a plain keyword already matches for "run the bot" also
// matches "~run bot", so counting both would double that mode's score. Counting
// an ordered match beside another mode's plain match would tie that plain match
// and turn a single route ("start a new bot") into a bundle. Scoring every mode's
// plain keywords first and reaching for ordered keywords only when all of them
// scored zero keeps every decision a plain keyword produces exactly as it was.
// A prompt about writing a bot ("start writing the bot") carries the same verb
// and noun as a request to run one, so ordered keywords also stay out when the
// prompt holds one of the hub's orderedKeywordBlockers. That prompt then defers
// instead of reaching run, the mode that starts an executor.
function matchedKeywords(keywords, matches) {
  return new Set(keywords.filter(matches).map((keyword) => spaced(normalize(keyword))));
}

function scoreModes(routingModel, text) {
  const plainScores = routingModel.modes.map((mode) => ({
    mode,
    matched: matchedKeywords(
      mode.keywords.filter((keyword) => !isOrderedKeyword(keyword)),
      (keyword) => containsSignal(text, keyword),
    ),
  }));
  const anyPlain = plainScores.some((entry) => entry.matched.size > 0);
  const blockers = new Set(routingModel.orderedKeywordBlockers);
  const blocked = promptWords(text).some((word) => blockers.has(word));
  return plainScores.map(({ mode, matched }) => {
    const counted = anyPlain || blocked ? matched : matchedKeywords(
      mode.keywords.filter(isOrderedKeyword),
      (keyword) => containsOrderedWords(text, keyword),
    );
    return { mode: mode.workflowMode, score: counted.size * mode.weight };
  }).filter((entry) => entry.score > 0);
}

// Keep every mode within ambiguityDelta of the top score. The hub's outcomes
// declare single, orderedBundle and defer only, so a near-tie routes every tied
// mode as a bundle rather than asking for clarification.
function selectNearTiedModes(scores, ambiguityDelta) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

function exactBundle(routingModel, orderedModes) {
  const candidate = orderedModes.join(' ');
  return routingModel.bundleRules.find((rule) => (
    rule.targetWorkflowModes.join(' ') === candidate
  )) || null;
}

function evaluateRoute(snapshot, input) {
  const request = requestFor(snapshot, input);
  const text = normalize(input.prompt || '');
  const constraints = new Set((input.constraints || []).map(normalize));
  let decision;
  let scores = [];
  // A reject comes only from the caller's constraints. Prompt text is user content, and a
  // request that merely mentions the word, such as a 403 Forbidden debugging task, is routable.
  if (constraints.has('forbidden')) {
    decision = negative('reject', { reason: 'forbidden' });
  } else if (constraints.has('dependency-failure')) {
    decision = negative('defer', { reason: 'dependency-failure', recovery: ['defer'] });
  } else {
    scores = scoreModes(snapshot.routingModel, text);
    const order = new Map(snapshot.routingModel.tieBreak.map((mode, index) => [mode, index]));
    scores.sort((left, right) => (
      right.score - left.score || order.get(left.mode) - order.get(right.mode)
    ));
    const selected = selectNearTiedModes(scores, snapshot.routingModel.ambiguityDelta);
    if (selected.length === 0) {
      decision = snapshot.routingModel.defaultMode == null
        ? negative('defer', { reason: 'no-match', recovery: ['defer'] })
        : route(snapshot, 'single', [snapshot.routingModel.defaultMode]);
    } else if (selected.length === 1) {
      decision = route(snapshot, 'single', selected);
    } else {
      const ordered = [...selected].sort((left, right) => order.get(left) - order.get(right));
      const bundle = exactBundle(snapshot.routingModel, ordered);
      decision = route(snapshot, bundle ? bundle.kind : 'orderedBundle', ordered);
    }
  }
  return {
    decision,
    request,
    trace: {
      matchedScores: scores,
      outcome: decision.action === 'route' ? decision.route.selectionKind : decision.action,
    },
  };
}

function advisorContribution(snapshot, advisor) {
  if (!advisor || advisor.state === 'absent' || advisor.state === 'unavailable') {
    return { contributes: false, reason: 'advisor-zero-evidence' };
  }
  if (advisor.state !== 'live') return { contributes: false, reason: 'advisor-annotation-only' };
  if (advisor.effectivePolicyHash !== snapshot.policy.effectivePolicyHash
    || advisor.projectionHash !== snapshot.advisorProjection.projectionHash) {
    return { contributes: false, reason: 'advisor-drift-annotation-only' };
  }
  return { contributes: true, reason: 'advisor-live-identity-match' };
}

module.exports = {
  ORDERED_KEYWORD_PREFIX,
  advisorContribution,
  evaluateRoute,
  promptWords,
};
