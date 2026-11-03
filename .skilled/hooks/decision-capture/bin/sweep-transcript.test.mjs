// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Transcript Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// Every test writes its own transcript into a throwaway project directory, so
// the sweep reads a fixture and the queue lands where the test can inspect it.
// Nothing here reads a real Claude transcript. The CLI test is the only one that
// spawns a process: it proves the entry point reads the transcript argument and
// prints the same result the function returns.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  appendRecords,
  chatSourceKey,
  normalizeAskUserQuestion,
  queueDir,
  queueFile,
  readQueue,
} from '../lib/capture-core.mjs';
import { chatCandidatesFromTurns } from '../lib/chat-questions.mjs';
import { sweepTranscript } from './sweep-transcript.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-transcript.mjs');
const SESSION = 'session-1';
const NOW = '2026-11-01T12:00:00.000Z';

const BADGE_QUESTION = 'Which colour should the badge use?';
const OWNER_QUESTION = 'Which store owns the delivery queue?';
const NUDGE_QUESTION = 'Where should the nudge land?';

const ROUND_ONE = [
  {
    question: BADGE_QUESTION,
    header: 'Badge',
    options: [{ label: 'Amber' }, { label: 'Teal' }],
    multiSelect: false,
  },
  {
    question: OWNER_QUESTION,
    header: 'Owner',
    options: [{ label: 'core' }, { label: 'cli' }],
    multiSelect: false,
  },
];
const ROUND_ONE_ANSWERS = { [BADGE_QUESTION]: 'Amber', [OWNER_QUESTION]: 'core' };

const ROUND_TWO = [
  {
    question: NUDGE_QUESTION,
    header: 'Nudge',
    options: [{ label: 'Stop' }, { label: 'Save' }],
    multiSelect: false,
  },
];
const ROUND_TWO_ANSWERS = { [NUDGE_QUESTION]: 'Stop' };

function withProject(run) {
  const projectDir = mkdtempSync(join(tmpdir(), 'decision-sweep-'));
  try {
    return run(projectDir);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

function writeTranscript(projectDir, name, entries) {
  const filePath = join(projectDir, name);
  const body = entries.map((entry) => JSON.stringify(entry)).join('\n');
  writeFileSync(filePath, `${body}\n`);
  return filePath;
}

function assistantText(uuid, text) {
  return {
    type: 'assistant',
    uuid,
    sessionId: SESSION,
    message: { role: 'assistant', content: [{ type: 'text', text }] },
  };
}

function assistantToolUse(uuid, toolUseId, questions) {
  return {
    type: 'assistant',
    uuid,
    sessionId: SESSION,
    message: {
      role: 'assistant',
      content: [{ type: 'tool_use', id: toolUseId, name: 'AskUserQuestion', input: { questions } }],
    },
  };
}

function toolResult(uuid, toolUseId, answers) {
  return {
    type: 'user',
    uuid,
    sessionId: SESSION,
    message: {
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUseId, content: 'Answered' }],
    },
    toolUseResult: { answers },
  };
}

function userPrompt(uuid, text) {
  return {
    type: 'user',
    uuid,
    sessionId: SESSION,
    message: { role: 'user', content: text },
  };
}

function twoRounds() {
  return [
    assistantToolUse('a1', 't1', ROUND_ONE),
    toolResult('u1', 't1', ROUND_ONE_ANSWERS),
    assistantToolUse('a2', 't2', ROUND_TWO),
    toolResult('u2', 't2', ROUND_TWO_ANSWERS),
  ];
}

test('two answered question rounds are recovered and stay pending', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'session-1.jsonl', twoRounds());

    const first = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(first.transcript, transcriptPath);
    assert.equal(first.session_id, SESSION);
    assert.equal(first.recovered, 3);
    assert.equal(first.pending.length, 3);
    assert.equal(first.chat_candidates.length, 0);
    assert.ok(first.pending.every((record) => record.source === 'transcript'));

    const second = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(second.recovered, 0);
    assert.equal(second.pending.length, 3);
    assert.equal(readQueue(projectDir, SESSION).length, 3);
  });
});

test('a record the hook already queued is not appended again', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'session-1.jsonl', twoRounds());

    appendRecords(projectDir, SESSION, normalizeAskUserQuestion({
      runtime: 'claude',
      sessionId: SESSION,
      toolUseId: 't1',
      toolInput: { questions: ROUND_ONE },
      toolResponse: { answers: ROUND_ONE_ANSWERS },
      source: 'hook',
      now: NOW,
    }));

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.recovered, 1);
    assert.equal(result.pending.length, 3);
    assert.deepEqual(
      readQueue(projectDir, SESSION).map((record) => record.source),
      ['hook', 'hook', 'transcript'],
    );
  });
});

test('an answered chat question is offered with its exact wording', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'chat.jsonl', [
      assistantText('a1', 'The badge needs a colour.\n\nShould the badge be blue or green?'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.recovered, 0);
    assert.deepEqual(result.chat_candidates, [
      {
        key: chatSourceKey('claude', SESSION, 'a1', 'u1'),
        kind: 'chat',
        question: 'Should the badge be blue or green?',
        answer: 'Blue, please.',
        question_turn_id: 'a1',
        answer_turn_id: 'u1',
        evidence: {
          questionType: 'alternative',
          optionMatch: true,
          contentOverlap: 1,
          imperativeOpening: false,
          topicShift: false,
        },
      },
    ]);
  });
});

test('a closing question with no reply stays an unanswered candidate', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'open.jsonl', [
      assistantText('a1', 'Here is the plan.\n\nShould the badge be blue or green?'),
    ]);

    const [candidate] = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.equal(candidate.question, 'Should the badge be blue or green?');
    assert.equal(candidate.answer, null);
    assert.equal(candidate.answer_turn_id, null);
    assert.equal(candidate.key, null);
  });
});

test('text followed by a tool call is not a chat question', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'tool.jsonl', [
      assistantText('a1', 'Should the badge be blue or green?'),
      assistantToolUse('a2', 't1', ROUND_TWO),
      userPrompt('u1', 'Blue, please.'),
    ]);

    assert.deepEqual(
      sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
      [],
    );
  });
});

test('a consumed chat key is not offered again', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'consumed.jsonl', [
      assistantText('a1', 'Should the badge be blue or green?'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    mkdirSync(queueDir(projectDir), { recursive: true, mode: 0o700 });
    writeFileSync(
      join(queueDir(projectDir), 'consumed.jsonl'),
      `${JSON.stringify({
        key: chatSourceKey('claude', SESSION, 'a1', 'u1'),
        packet: 'demo-packet',
        id: 'Q001',
        at: NOW,
      })}\n`,
    );

    assert.deepEqual(
      sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
      [],
    );
  });
});

// The first block is the literal gate wording. The second adds a question mark,
// because without one the paragraph is rejected as a non-question before the
// process filter ever runs, and the filter is what this test has to prove.
test('a documentation-scope question is not a chat candidate', () => {
  withProject((projectDir) => {
    const literal = writeTranscript(projectDir, 'gate.jsonl', [
      assistantText('a1', 'Before I proceed, I need to ask about documentation:\nA) Existing\nD) Skip'),
      userPrompt('u1', 'A) Existing'),
    ]);
    const withMark = writeTranscript(projectDir, 'gate-question.jsonl', [
      assistantText(
        'a1',
        'Before I proceed, I need to ask about documentation: which folder?\nA) Existing\nD) Skip',
      ),
      userPrompt('u1', 'A) Existing'),
    ]);

    assert.deepEqual(sweepTranscript({ projectDir, transcriptPath: literal, now: NOW }).chat_candidates, []);
    assert.deepEqual(
      sweepTranscript({ projectDir, transcriptPath: withMark, now: NOW }).chat_candidates,
      [],
    );
  });
});

test('sidechain lines are ignored', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'sidechain.jsonl', [
      { ...assistantText('a1', 'Should the badge be blue or green?'), isSidechain: true },
      { ...userPrompt('u1', 'Blue, please.'), isSidechain: true },
      { ...assistantToolUse('a2', 't1', ROUND_TWO), isSidechain: true },
      { ...toolResult('u2', 't1', ROUND_TWO_ANSWERS), isSidechain: true },
    ]);

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.recovered, 0);
    assert.equal(result.session_id, 'sidechain');
    assert.deepEqual(result.chat_candidates, []);
  });
});

test('the CLI prints the sweep result for the given transcript', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'cli.jsonl', twoRounds());

    const run = spawnSync(process.execPath, [SCRIPT, '--transcript', transcriptPath], {
      cwd: projectDir,
      encoding: 'utf8',
      timeout: 20000,
    });

    assert.equal(run.status, 0);
    const result = JSON.parse(run.stdout);
    assert.equal(result.recovered, 3);
    assert.equal(result.session_id, SESSION);
    assert.equal(result.pending.length, 3);
    assert.equal(readFileSync(queueFile(projectDir, SESSION), 'utf8').trim().split('\n').length, 3);
  });
});

test('the CLI reports an unreadable transcript and exits 1', () => {
  withProject((projectDir) => {
    const run = spawnSync(
      process.execPath,
      [SCRIPT, '--transcript', join(projectDir, 'missing.jsonl')],
      { cwd: projectDir, encoding: 'utf8', timeout: 20000 },
    );

    assert.equal(run.status, 1);
    assert.ok(JSON.parse(run.stdout).error);
  });
});

// `/work/foo-bar` and `/work/foo/bar` flatten to the same transcript directory,
// so a newer transcript from the other project must not be picked.
test('the CLI skips a newer transcript recorded for another project', () => {
  withProject((projectDir) => {
    const homeDir = join(projectDir, 'home');
    const realProject = realpathSync(projectDir);
    const transcriptDir = join(homeDir, '.claude', 'projects', realProject.replace(/[^A-Za-z0-9]/g, '-'));
    mkdirSync(transcriptDir, { recursive: true });

    const ownPath = writeTranscript(transcriptDir, 'own.jsonl', [
      { ...userPrompt('u0', 'start'), cwd: realProject },
    ]);
    const otherPath = writeTranscript(transcriptDir, 'other.jsonl', [
      { ...userPrompt('u0', 'start'), cwd: join(realProject, 'other-project') },
    ]);
    utimesSync(ownPath, new Date('2026-11-01T00:00:00Z'), new Date('2026-11-01T00:00:00Z'));
    utimesSync(otherPath, new Date('2026-11-02T00:00:00Z'), new Date('2026-11-02T00:00:00Z'));

    const run = spawnSync(process.execPath, [SCRIPT], {
      cwd: projectDir,
      encoding: 'utf8',
      env: { ...process.env, HOME: homeDir },
      timeout: 20000,
    });

    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).transcript, ownPath);
  });
});

test('question marks inside code or quoted text do not qualify earlier paragraphs', () => {
  withProject((projectDir) => {
    const backtick = String.fromCharCode(96);
    const fence = backtick.repeat(3);
    const codeParagraph = 'Example:\n' + fence + '\nShould the badge be blue or green?\n' + fence;
    const cases = [
      ['code', codeParagraph],
      ['quoted', 'The note says "Should the badge be blue or green?"'],
    ];

    for (const [name, paragraph] of cases) {
      const transcriptPath = writeTranscript(projectDir, name + '.jsonl', [
        assistantText('a1', paragraph + '\n\nStatus is ready.'),
        userPrompt('u1', 'Continue.'),
      ]);
      assert.deepEqual(
        sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
        [],
      );
    }
  });
});

test('a closing paragraph whose only question mark is in code or a quote does not ask', () => {
  withProject((projectDir) => {
    const backtick = String.fromCharCode(96);
    const fence = backtick.repeat(3);
    const cases = [
      ['closing-code', 'Done. The guard now reads:\n\n' + fence + '\nconst label = ready ? "on" : "off";\n' + fence],
      ['closing-quoted', 'Done.\n\nThe old banner said "Ready to ship?"'],
    ];

    for (const [name, text] of cases) {
      const transcriptPath = writeTranscript(projectDir, name + '.jsonl', [
        assistantText('a1', text),
        userPrompt('u1', 'Continue.'),
      ]);
      assert.deepEqual(
        sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
        [],
      );
    }
  });
});

test('table rows, headings and plain statements in earlier paragraphs do not ask', () => {
  withProject((projectDir) => {
    const cases = [
      ['table', '| Option | Should the badge be blue? |\n| --- | --- |\n| A | yes |'],
      ['heading', '## Why does the badge change?\nThe palette moved.'],
      ['statement', 'The badge is blue.'],
    ];

    for (const [name, paragraph] of cases) {
      const transcriptPath = writeTranscript(projectDir, name + '.jsonl', [
        assistantText('a1', paragraph + '\n\nStatus is ready.'),
        userPrompt('u1', 'Continue.'),
      ]);
      assert.deepEqual(
        sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
        [],
      );
    }
  });
});

test('a run of blank lines separates an earlier question from the closing paragraph', () => {
  withProject((projectDir) => {
    const question = 'Should the badge be blue or green?';
    const transcriptPath = writeTranscript(projectDir, 'blanks.jsonl', [
      assistantText('a1', question + '\n\n\n\nStatus is ready.'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    const candidates = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.deepEqual(candidates.map((candidate) => candidate.question), [question]);
  });
});

test('malformed turns yield no chat candidate and do not throw', () => {
  withProject((projectDir) => {
    const question = 'Status is ready.\n\nShould the badge be blue or green?';
    const withoutId = (entry) => {
      const copy = { ...entry };
      delete copy.uuid;
      return copy;
    };
    const cases = [
      ['non-string', [
        {
          type: 'assistant',
          uuid: 'a1',
          sessionId: SESSION,
          message: { role: 'assistant', content: [{ type: 'text', text: 42 }] },
        },
        userPrompt('u1', 'Blue, please.'),
      ]],
      ['question-without-id', [withoutId(assistantText('a1', question)), userPrompt('u1', 'Blue.')]],
      ['reply-without-id', [assistantText('a1', question), withoutId(userPrompt('u1', 'Blue.'))]],
    ];

    for (const [name, entries] of cases) {
      const transcriptPath = writeTranscript(projectDir, name + '.jsonl', entries);
      assert.deepEqual(
        sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
        [],
        name,
      );
    }
  });
});

test('a torn final line is skipped and earlier lines still sweep', () => {
  withProject((projectDir) => {
    const transcriptPath = join(projectDir, 'torn.jsonl');
    writeFileSync(transcriptPath, [
      JSON.stringify(assistantText('a1', 'Status is ready.\n\nShould the badge be blue or green?')),
      JSON.stringify(userPrompt('u1', 'Blue, please.')),
      '{"type":"assistant","uuid":"a2","mess',
    ].join('\n'));

    const candidates = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.deepEqual(candidates.map((candidate) => candidate.key), [
      chatSourceKey('claude', SESSION, 'a1', 'u1'),
    ]);
  });
});

test('an earlier question keeps lettered options written inside its own paragraph', () => {
  withProject((projectDir) => {
    const question = 'Which badge colour should ship?\nA) Blue\nB) Green';
    const transcriptPath = writeTranscript(projectDir, 'inline-options.jsonl', [
      assistantText('a1', question + '\n\nStatus is ready.'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    const candidates = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.deepEqual(candidates.map((candidate) => candidate.question), [question]);
  });
});

test('an earlier question includes its following lettered options', () => {
  withProject((projectDir) => {
    const question = 'Should the badge be blue or green?';
    const optionParagraph = 'A) Blue\nB) Green\nC) Amber\nD) Teal';
    const transcriptPath = writeTranscript(projectDir, 'options.jsonl', [
      assistantText('a1', question + '\n\n' + optionParagraph + '\n\nThe palette is ready.'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    const candidates = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].question, question + '\n\n' + optionParagraph);
  });
});

test('five asking paragraphs keep the ranked three in message order', () => {
  withProject((projectDir) => {
    const questions = [
      'Should the intro use a short title?',
      'Should the example use a badge?',
      'Should the prompt include choices?',
      'Should the saved answer use a label?',
      'Should the closing line mention status?',
    ];
    const options = 'A) Short\nB) Detailed\nC) Both\nD) Neither';
    const transcriptPath = writeTranscript(projectDir, 'ranked.jsonl', [
      assistantText(
        'a1',
        [questions[0], questions[1], questions[2], options, questions[3], questions[4]].join(
          '\n\n',
        ),
      ),
      userPrompt('u1', 'Use a short title and include choices.'),
    ]);

    const candidates = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    assert.equal(candidates.length, 3);
    assert.deepEqual(candidates.map((candidate) => candidate.question), [
      questions[2] + '\n\n' + options,
      questions[3],
      questions[4],
    ]);
  });
});

test('process questions in earlier paragraphs are filtered', () => {
  withProject((projectDir) => {
    const cases = [
      ['shipping', 'May I commit and push these changes?'],
      [
        'scope',
        'Should this change use the existing folder?\nA) Existing\nB) New\nC) Related\nD) Skip',
      ],
    ];

    for (const [name, question] of cases) {
      const transcriptPath = writeTranscript(projectDir, name + '.jsonl', [
        assistantText('a1', question + '\n\nThe branch is ready.'),
        userPrompt('u1', 'The branch looks good.'),
      ]);
      assert.deepEqual(
        sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates,
        [],
      );
    }
  });
});

test('the sweep keeps the newest twenty chat candidates and reports the cut count', () => {
  withProject((projectDir) => {
    const entries = [];
    for (let index = 0; index < 25; index += 1) {
      entries.push(assistantText('a' + index, 'Should choice ' + index + ' be used?'));
      entries.push(userPrompt('u' + index, 'Use choice ' + index + '.'));
    }
    const transcriptPath = writeTranscript(projectDir, 'many.jsonl', entries);

    const result = sweepTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(result.chat_candidates.length, 20);
    assert.equal(result.chat_candidates_dropped, 5);
    assert.equal(result.chat_candidates[0].question_turn_id, 'a5');
    assert.equal(result.chat_candidates.at(-1).question_turn_id, 'a24');
  });
});

test('earlier question keys stay stable and consumed keys are dropped', () => {
  withProject((projectDir) => {
    const transcriptPath = writeTranscript(projectDir, 'stable.jsonl', [
      assistantText(
        'a1',
        'Should the badge be blue or green?\n\nShould the icon be round or square?\n\nStatus is ready.',
      ),
      userPrompt('u1', 'Blue and round.'),
    ]);

    const first = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    const second = sweepTranscript({ projectDir, transcriptPath, now: NOW }).chat_candidates;
    const keys = first.map((candidate) => candidate.key);
    assert.deepEqual(second.map((candidate) => candidate.key), keys);
    assert.ok(keys.every((key) => /^[A-Za-z0-9:._-]+$/.test(key)));

    mkdirSync(queueDir(projectDir), { recursive: true, mode: 0o700 });
    writeFileSync(
      join(queueDir(projectDir), 'consumed.jsonl'),
      JSON.stringify({ key: keys[0] }) + '\n',
    );
    const afterConsumption = sweepTranscript({
      projectDir,
      transcriptPath,
      now: NOW,
    }).chat_candidates;
    assert.ok(afterConsumption.every((candidate) => candidate.key !== keys[0]));
  });
});

test('repeated earlier questions receive distinct key suffixes', () => {
  withProject((projectDir) => {
    const question = 'Should the badge be blue or green?';
    const transcriptPath = writeTranscript(projectDir, 'repeated.jsonl', [
      assistantText('a1', question + '\n\n' + question + '\n\nStatus is ready.'),
      userPrompt('u1', 'Blue, please.'),
    ]);

    const keys = sweepTranscript({ projectDir, transcriptPath, now: NOW })
      .chat_candidates
      .map((candidate) => candidate.key);
    assert.equal(keys.length, 2);
    assert.match(keys[0], /:p[0-9a-f]{12}$/);
    assert.equal(keys[1], keys[0] + '-2');
  });
});

test('the Claude chat fixture yields four candidates outside labelled process pairs', () => {
  withProject((projectDir) => {
    const transcriptPath = join(HERE, 'fixtures', 'claude-chat-questions.jsonl');
    const labels = JSON.parse(readFileSync(
      join(HERE, 'fixtures', 'claude-chat-questions.labels.json'),
      'utf8',
    ));
    const run = spawnSync(process.execPath, [SCRIPT, '--transcript', transcriptPath], {
      cwd: projectDir,
      encoding: 'utf8',
      timeout: 20000,
    });

    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.chat_candidates.length, 4);
    assert.equal(result.chat_candidates_dropped, 0);
    const processTurns = new Set(
      labels.filter((pair) => pair.process).map((pair) => pair.question_turn),
    );
    assert.ok(result.chat_candidates.every(
      (candidate) => !processTurns.has(candidate.question_turn_id),
    ));
    const earlierPair = labels.find((pair) => pair.answers_earlier);
    assert.ok(result.chat_candidates.some((candidate) => (
      candidate.question_turn_id === earlierPair.question_turn
      && candidate.answer_turn_id === earlierPair.reply_turn
    )));

    // The evidence is the cue the save model reads before judging. The fixture pins
    // it: the replies that open on new work share no word with their question, and
    // the one numbered reply that answers in place shares three.
    const evidenceByPair = Object.fromEntries(result.chat_candidates.map((candidate) => [
      labels.find((pair) => pair.question_turn === candidate.question_turn_id).pair,
      candidate.evidence,
    ]));
    assert.deepEqual(evidenceByPair, {
      1: {
        questionType: 'yes_no',
        optionMatch: false,
        contentOverlap: 0,
        imperativeOpening: true,
        topicShift: false,
      },
      3: {
        questionType: 'alternative',
        optionMatch: false,
        contentOverlap: 0,
        imperativeOpening: true,
        topicShift: false,
      },
      6: {
        questionType: 'numbered_list',
        optionMatch: 'not_applicable',
        contentOverlap: 3,
        imperativeOpening: false,
        topicShift: false,
      },
      7: {
        questionType: 'numbered_list',
        optionMatch: 'not_applicable',
        contentOverlap: 0,
        imperativeOpening: true,
        topicShift: false,
      },
    });
  });
});

// The extended fixture is the labelled set a save model is judged against, so the
// test pins the shape it must always have rather than the labels themselves, which
// remain a judgement call. It prints every label beside its evidence for a reader
// to compare.
function turnsFromChatFixture(entries) {
  const turns = [];
  for (const entry of entries) {
    const content = entry?.message?.content;
    if (entry?.type === 'assistant') {
      const parts = Array.isArray(content)
        ? content.filter((block) => block?.type === 'text' && typeof block.text === 'string')
        : [];
      if (parts.length > 0) {
        turns.push({ kind: 'assistant', id: entry.uuid, text: parts.map((block) => block.text).join('\n') });
      }
      continue;
    }
    if (typeof content === 'string' && content !== '') {
      turns.push({ kind: 'prompt', id: entry.uuid, text: content });
    }
  }
  return turns;
}

test('the extended Claude chat fixture yields one candidate per labelled pair', () => {
  const entries = readFileSync(
    join(HERE, 'fixtures', 'claude-chat-answers-extended.jsonl'),
    'utf8',
  )
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line));
  const labels = JSON.parse(readFileSync(
    join(HERE, 'fixtures', 'claude-chat-answers-extended.labels.json'),
    'utf8',
  ));

  const { candidates } = chatCandidatesFromTurns({
    runtime: 'claude',
    sessionId: 'synthetic-session',
    turns: turnsFromChatFixture(entries),
    consumed: new Set(),
  });

  assert.equal(candidates.length, labels.length);
  for (const candidate of candidates) {
    assert.deepEqual(Object.keys(candidate.evidence).sort(), [
      'contentOverlap',
      'imperativeOpening',
      'optionMatch',
      'questionType',
      'topicShift',
    ]);
  }

  for (const label of labels) {
    const candidate = candidates.find((item) => item.question_turn_id === label.question_turn);
    console.log(`pair ${label.pair} answers=${label.answers} evidence=${JSON.stringify(candidate?.evidence)}`);
  }
});
