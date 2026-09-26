import { describe, expect, it } from 'vitest';
import {
  MalformedAnswerError,
  MissingApiKeyError,
  TypeSafeJev,
} from '../src/infrastructure/typesafe-jev.js';
import type { QuestionMap } from '../src/domain/question.js';

interface Captured {
  readonly url: string;
  readonly headers: Record<string, string>;
  readonly body: unknown;
}

function client(payload: unknown, captured: Captured[] = []): {
  readonly jev: TypeSafeJev;
  readonly captured: Captured[];
} {
  const jev = new TypeSafeJev({
    apiKey: 'test-key',
    model: 'jev-latest',
    fetch: async (url, init) => {
      captured.push({
        url,
        headers: Object.fromEntries(new Headers(init?.headers).entries()),
        body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
      });
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    },
  });
  return { jev, captured };
}

const QUESTIONS: QuestionMap = {
  is_urgent: {
    type: 'noul',
    instructions: 'Does this convey urgency?',
    criteria: { true: 'Explicitly time-sensitive' },
  },
  department: {
    type: 'choice',
    instructions: 'Which team should handle this?',
    criteria: { billing: 'Payments', technical: null },
  },
  frustration: {
    type: 'score',
    instructions: 'How frustrated is the customer?',
    criteria: ['Calm', 'Frustrated', 'Very angry'],
  },
};

const PAYLOAD = {
  model: 'jev-1.13.0',
  answers: {
    is_urgent: { type: 'noul', noul: 0.92 },
    department: {
      type: 'choice',
      choice: 'technical',
      probabilities: { billing: 0.15, technical: 0.85 },
      confidence: 0.82,
    },
    frustration: {
      type: 'score',
      score: 1.6,
      legend: { 0: 'Calm', 1: 'Frustrated', 2: 'Very angry' },
      probabilities: { 0: 0.05, 1: 0.3, 2: 0.65 },
      confidence: 0.78,
    },
  },
  usage: { input_tokens: 312, output_tokens: 48 },
};

describe('TypeSafeJev', () => {
  it('posts state and questions in the documented shape', async () => {
    const { jev, captured } = client(PAYLOAD);
    await jev.ask({ ticket: 'payouts failing' }, QUESTIONS);
    const request = captured[0];
    expect(request?.url).toBe('https://api.typesafe.ai/v1/systemone');
    expect(request?.headers['authorization']).toBe('Bearer test-key');
    expect(request?.body).toEqual({
      model: 'jev-latest',
      state: { ticket: 'payouts failing' },
      questions: {
        is_urgent: {
          type: 'noul',
          instructions: 'Does this convey urgency?',
          criteria: { true: 'Explicitly time-sensitive' },
        },
        department: {
          type: 'choice',
          instructions: 'Which team should handle this?',
          criteria: { billing: 'Payments', technical: null },
        },
        frustration: {
          type: 'score',
          instructions: 'How frustrated is the customer?',
          criteria: ['Calm', 'Frustrated', 'Very angry'],
        },
      },
    });
  });

  it('maps every answer type and the usage onto the domain shape', async () => {
    const { jev } = client(PAYLOAD);
    const reply = await jev.ask('state', QUESTIONS);
    expect(reply.model).toBe('jev-1.13.0');
    expect(reply.usage).toEqual({ inputTokens: 312, outputTokens: 48 });
    expect(reply.answers['is_urgent']).toEqual({ type: 'noul', noul: 0.92 });
    expect(reply.answers['department']).toEqual({
      type: 'choice',
      choice: 'technical',
      confidence: 0.82,
      probabilities: { billing: 0.15, technical: 0.85 },
    });
    expect(reply.answers['frustration']).toEqual({
      type: 'score',
      score: 1.6,
      confidence: 0.78,
      legend: { 0: 'Calm', 1: 'Frustrated', 2: 'Very angry' },
      probabilities: { 0: 0.05, 1: 0.3, 2: 0.65 },
    });
  });

  it('leaves the criteria out of a noul question that has none', async () => {
    const { jev, captured } = client({
      model: 'jev-1.13.0',
      answers: { plain: { type: 'noul', noul: 0.5 } },
      usage: { input_tokens: 1, output_tokens: 0 },
    });
    await jev.ask('state', { plain: { type: 'noul', instructions: 'Is it fine?' } });
    expect(captured[0]?.body).toMatchObject({
      questions: { plain: { type: 'noul', instructions: 'Is it fine?' } },
    });
    expect(captured[0]?.body).not.toHaveProperty('questions.plain.criteria');
  });

  it('rejects an answer that matches no known type', async () => {
    const { jev } = client({
      model: 'jev-1.13.0',
      answers: { q: { type: 'noul', verdict: 'maybe' } },
      usage: { input_tokens: 1, output_tokens: 0 },
    });
    await expect(jev.ask('state', { q: { type: 'noul', instructions: 'Is it fine?' } })).rejects.toThrow(
      MalformedAnswerError,
    );
  });

  it('explains a missing API key instead of calling out', async () => {
    const jev = new TypeSafeJev({ apiKey: '', model: 'jev-latest' });
    await expect(jev.ask('state', { q: { type: 'noul', instructions: 'Is it fine?' } })).rejects.toThrow(
      MissingApiKeyError,
    );
  });

  it('refuses a score question with fewer than two levels', async () => {
    const { jev } = client(PAYLOAD);
    await expect(
      jev.ask('state', { q: { type: 'score', instructions: 'Rate it', criteria: ['only one'] } }),
    ).rejects.toThrow('at least two levels');
  });
});
