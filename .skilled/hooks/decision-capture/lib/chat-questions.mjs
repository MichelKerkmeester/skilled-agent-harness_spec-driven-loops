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
// 4. CANDIDATE DETECTION
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
