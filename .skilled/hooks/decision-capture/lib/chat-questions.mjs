// ───────────────────────────────────────────────────────────────────
// MODULE: Chat Question Detection
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import { chatSourceKey, isProcessQuestion } from './capture-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CHAT_CANDIDATES_PER_MESSAGE = 3;
const CHAT_CANDIDATES_PER_SWEEP = 20;

// A paragraph ends at a blank line, and a run of blank lines is still one break.
const PARAGRAPH_BREAK = /(?:\r?\n[ \t]*){2,}/;
// The gate rules offer lettered choices; those letters are what the process
// filter reads, so the detector hands them over the way the tool would.
const OPTION_LINE = /^\s*(?:[-*]\s+)?(?:\*\*)?[A-D]\)/;
const OPTION_MARKER = /^\s*(?:[-*]\s+)?(?:\*\*)?/;

// A reply is read as lowercased words, and a word is a run of these characters.
const WORD = /[a-z0-9']+/g;
// Inline code can hold one side of a choice ("`blue` or `amber`"), so the type
// check folds it into a neutral word rather than letting its own punctuation act
// as a sentence break.
const INLINE_CODE = /\x60[^\x60\n]*\x60/g;
const CODE_PLACEHOLDER = 'code';
// An ask sentence runs from the previous sentence break up to a question mark.
const ASK_SENTENCE = /(?:^|[.!:\n])([^.!:\n?]*)\?/g;
const OR_WORD = /\bor\b/;
// A numbered question asks several numbered things, not several lettered ones.
const NUMBERED_LINE = /^\s*(?:\*\*)?\d+[.)]/;
// A reply can restate the numbering it answers without opening on a marker word.
const LIST_MARKER = /^\s*\d+\s*[:.)]\s*/;
const TOPIC_SHIFT_WINDOW = 5;

// Words that carry no subject matter, so sharing one says nothing about intent.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'so', 'of', 'to', 'in',
  'on', 'at', 'by', 'for', 'with', 'from', 'as', 'into', 'about', 'over', 'this',
  'that', 'these', 'those', 'it', 'its', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'am', 'do', 'does', 'did', 'done', 'doing', 'have', 'has',
  'had', 'having', 'will', 'would', 'shall', 'should', 'can', 'could', 'may',
  'might', 'must', 'not', 'no', 'yes', 'yeah', 'yep', 'ok', 'okay', 'sure',
  'please', 'i', 'me', 'my', 'we', 'our', 'us', 'you', 'your', 'he', 'she',
  'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'when', 'where',
  'why', 'how', 'all', 'any', 'each', 'some', 'more', 'most', 'other', 'such',
  'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also', 'there', 'here',
  'now', 'out', 'off', 'again', 'once', 'one', 'two', 'three', 'wasn', 'isn',
  'aren', 'don', 'doesn', 'didn', 'won', 'wouldn', 'shouldn', 'couldn',
  // Choice verbs sit on both sides of a choice without carrying it: "use
  // `Skilled`" and "use the darker one" share the verb, not the answer.
  'use', 'keep', 'make', 'pick', 'choose', 'take', 'want', 'need', 'like', 'try',
  'get', 'go', 'let',
]);

// Verbs that ask for new work rather than approve the action a question names.
// A trailing * marks a stem, so a misspelt "Analyxe" still reads as "analyse".
const IMPERATIVE_VERBS = [
  'analy*', 'ask', 'audit', 'check', 'debug', 'do', 'explain', 'fix',
  'investigat*', 'look', 'research', 'review', 'run', 'summari*',
];

// Politeness and sequence words a reply can open on before it gets to its verb.
const FILLERS = new Set([
  'please', 'ok', 'okay', 'so', 'now', 'then', 'actually', 'first', 'just',
  'also', 'and',
]);

// An imperative on one of these answers the question's own action: "Do it".
const ANAPHORS = new Set(['it', 'that', 'this', 'so', 'them']);

// A reply that announces a different subject is not answering the question. A
// bare "first" stays out: "First, make it blue" is a valid answer.
const SHIFT_PHRASES = [
  'actually', 'instead', 'let\'s', 'lets', 'let us', 'by the way', 'btw',
  'never mind', 'nevermind', 'forget that', 'forget it', 'unrelated',
];

const AUXILIARIES = new Set([
  'is', 'are', 'was', 'were', 'do', 'does', 'did', 'should', 'shall', 'can',
  'could', 'will', 'would', 'may', 'might', 'has', 'have', 'had',
]);

const YES_NO = new Set([
  'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'no', 'nope', 'correct', 'right',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEXT ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

function nonEmptyString(value) {
  return typeof value === 'string' && value !== '';
}

function paragraphsOf(text) {
  return text
    .split(PARAGRAPH_BREAK)
    .filter((paragraph) => paragraph.trim() !== '');
}

// The closing paragraph keeps its byte-exact candidate, while earlier paragraphs
// are scanned because a reply can answer a question asked above.
function lastParagraph(text) {
  return paragraphsOf(text).at(-1) ?? '';
}

// Code and quotations can contain question marks without asking the operator anything.
function prose(paragraph) {
  return paragraph
    .replace(/\x60{3}[\s\S]*?\x60{3}/g, '')
    .replace(/\x60[^\x60\n]*\x60/g, '')
    .replace(/"[^"\n]*"/g, '')
    .replace(/“[^”\n]*”/g, '')
    .split('\n')
    .filter((line) => !/^\s*(>|\||#)/.test(line))
    .join('\n');
}

function asks(paragraph) {
  return /[^.!?\n]{4,}\?/.test(prose(paragraph));
}

function isOptionsOnly(paragraph) {
  return paragraph
    .split('\n')
    .filter((line) => line.trim() !== '')
    .every((line) => OPTION_LINE.test(line));
}

function optionLabelsOf(paragraph) {
  return paragraph
    .split('\n')
    .filter((line) => OPTION_LINE.test(line))
    .map((line) => line.replace(OPTION_MARKER, ''));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWER EVIDENCE
// ─────────────────────────────────────────────────────────────────────────────

function wordsOf(text) {
  return text.toLowerCase().match(WORD) ?? [];
}

function contentWordsOf(text) {
  return new Set(
    wordsOf(text)
      // A possessive or a contraction never changes which word was meant.
      .map((word) => word.split("'")[0])
      .filter((word) => word.length >= 3 && !STOPWORDS.has(word)),
  );
}

function askSentences(text) {
  return [...text.matchAll(ASK_SENTENCE)].map((match) => match[1]);
}

// "Keep `Code Environment`, or use `Skilled`" offers both sides, so a reply that
// repeats a word from either side named an option without using its letter.
function orSidesOf(question) {
  return askSentences(question).flatMap((sentence) => sentence.split(OR_WORD));
}

function isImperativeVerb(word) {
  return IMPERATIVE_VERBS.some((entry) => (
    entry.endsWith('*') ? word.startsWith(entry.slice(0, -1)) : word === entry
  ));
}

function questionTypeOf(question, options) {
  const numberedLines = question
    .split('\n')
    .filter((line) => NUMBERED_LINE.test(line)).length;
  if (numberedLines >= 2 && question.includes('?')) return 'numbered_list';

  const sentences = askSentences(question.replace(INLINE_CODE, CODE_PLACEHOLDER));
  if (options.length > 0) return 'alternative';
  if (sentences.some((sentence) => wordsOf(sentence).includes('or'))) return 'alternative';
  if (sentences.some((sentence) => AUXILIARIES.has(wordsOf(sentence)[0]))) return 'yes_no';
  return 'open_value';
}

function optionMatchOf(question, options, answer, questionType) {
  if (questionType === 'numbered_list' || questionType === 'open_value') {
    return 'not_applicable';
  }

  if (questionType === 'yes_no') return YES_NO.has(wordsOf(answer)[0]);

  const lone = answer.trim().toUpperCase();
  if (/^[A-D]$/.test(lone) && options.length > lone.charCodeAt(0) - 65) return true;

  const shared = contentWordsOf(answer);
  const offered = [...options, ...orSidesOf(question)];
  return offered.some((option) => [...contentWordsOf(option)].some((word) => shared.has(word)));
}

function contentOverlapOf(question, answer) {
  const inAnswer = contentWordsOf(answer);
  return [...contentWordsOf(question)].filter((word) => inAnswer.has(word)).length;
}

function imperativeOpeningOf(answer) {
  const words = wordsOf(answer.replace(LIST_MARKER, ''));
  let index = 0;
  while (FILLERS.has(words[index])) index += 1;

  const verb = words[index];
  if (verb === undefined || !isImperativeVerb(verb)) return false;
  return !ANAPHORS.has(words[index + 1]);
}

function topicShiftOf(answer) {
  const opening = ' ' + wordsOf(answer).slice(0, TOPIC_SHIFT_WINDOW).join(' ') + ' ';
  return SHIFT_PHRASES.some((phrase) => opening.includes(' ' + phrase + ' '));
}

/**
 * Describes how a reply relates to the question it followed.
 *
 * The values inform the save model's judgment and never replace it: nothing here
 * accepts or rejects a candidate, because a lone candidate can be off-topic.
 *
 * @param {string} question
 * @param {Array<string>} options
 * @param {string|null} answer
 * @returns {{ questionType: string, optionMatch: (boolean|'not_applicable'),
 *   contentOverlap: number, imperativeOpening: boolean, topicShift: boolean }|null}
 */
export function answerEvidence(question, options, answer) {
  if (typeof answer !== 'string') return null;

  const questionType = questionTypeOf(question, options);
  return {
    questionType,
    optionMatch: optionMatchOf(question, options, answer, questionType),
    contentOverlap: contentOverlapOf(question, answer),
    imperativeOpening: imperativeOpeningOf(answer),
    topicShift: topicShiftOf(answer),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CANDIDATE DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function chatCandidates({ runtime, sessionId, lastText, answer, answerTurnId, consumed }) {
  const paragraphs = paragraphsOf(lastText.text);
  const closingParagraph = lastParagraph(lastText.text);
  const candidates = [];
  const repeatedQuestions = new Map();

  for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex += 1) {
    const closing = paragraphIndex === paragraphs.length - 1;
    const paragraph = closing ? closingParagraph : paragraphs[paragraphIndex];
    if (closing ? !prose(paragraph).includes('?') : !asks(paragraph)) continue;

    const following = paragraphs[paragraphIndex + 1];
    const question = !closing && following && isOptionsOnly(following)
      ? paragraph + '\n\n' + following
      : paragraph;
    const options = optionLabelsOf(question);
    if (isProcessQuestion({ question, header: '', options })) continue;

    let key = null;
    if (answerTurnId) {
      if (closing) {
        key = chatSourceKey(runtime, sessionId, lastText.uuid, answerTurnId);
      } else {
        const repeatCount = (repeatedQuestions.get(question) ?? 0) + 1;
        repeatedQuestions.set(question, repeatCount);
        const digest = createHash('sha256').update(question).digest('hex').slice(0, 12);
        const repeatSuffix = repeatCount > 1 ? '-' + repeatCount : '';
        // Text-derived keys remain stable, and their suffix distinguishes repeats.
        key = chatSourceKey(
          runtime,
          sessionId,
          lastText.uuid,
          answerTurnId,
          'p' + digest + repeatSuffix,
        );
      }
    }
    if (key && consumed.has(key)) continue;

    candidates.push({
      candidate: {
        key,
        kind: 'chat',
        question,
        answer,
        question_turn_id: lastText.uuid,
        answer_turn_id: answerTurnId,
        evidence: answerEvidence(question, options, answer),
      },
      closing,
      hasOptions: options.length > 0,
      paragraphIndex,
    });
  }

  // The closing ask and explicit choices are likelier to match the reply.
  // Later text breaks ties when the cap cannot keep every candidate.
  const kept = candidates
    .sort((left, right) => (
      Number(right.closing) - Number(left.closing)
      || Number(right.hasOptions) - Number(left.hasOptions)
      || right.paragraphIndex - left.paragraphIndex
    ))
    .slice(0, CHAT_CANDIDATES_PER_MESSAGE)
    .sort((left, right) => left.paragraphIndex - right.paragraphIndex)
    .map(({ candidate }) => candidate);
  return { kept, dropped: candidates.length - kept.length };
}

/**
 * Builds bounded chat-question candidates from ordered runtime-neutral turns.
 *
 * @param {object} input
 * @param {string} input.runtime
 * @param {string} input.sessionId
 * @param {Array<object>} input.turns
 * @param {Set<string>} input.consumed
 * @returns {{ candidates: Array<object>, dropped: number }}
 */
export function chatCandidatesFromTurns({ runtime, sessionId, turns, consumed }) {
  const allCandidates = [];
  let droppedPerMessage = 0;
  let lastText = null;

  // Both caps report what they cut, so a save can say candidates were left out.
  const collect = (input) => {
    const { kept, dropped } = chatCandidates(input);
    allCandidates.push(...kept);
    droppedPerMessage += dropped;
  };

  for (const turn of turns) {
    if (turn.kind === 'tool') {
      lastText = null;
      continue;
    }

    if (turn.kind === 'assistant') {
      // A turn without its own id cannot carry a stable key. It still closes the
      // turn, so no earlier text may stand in for it.
      lastText = nonEmptyString(turn.id)
        ? { uuid: turn.id, text: turn.text }
        : null;
      continue;
    }

    if (turn.kind !== 'prompt') continue;

    if (lastText && nonEmptyString(turn.id)) {
      collect({
        runtime,
        sessionId,
        lastText,
        answer: turn.text,
        answerTurnId: turn.id,
        consumed,
      });
    }
    lastText = null;
  }

  if (lastText) {
    collect({
      runtime,
      sessionId,
      lastText,
      answer: null,
      answerTurnId: null,
      consumed,
    });
  }

  const dropped = droppedPerMessage
    + Math.max(0, allCandidates.length - CHAT_CANDIDATES_PER_SWEEP);
  return {
    candidates: allCandidates.slice(-CHAT_CANDIDATES_PER_SWEEP),
    dropped,
  };
}
