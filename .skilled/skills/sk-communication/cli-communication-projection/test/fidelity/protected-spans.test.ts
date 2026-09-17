// ───────────────────────────────────────────────────────────────────
// MODULE: Protected Span Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  FidelityReasonCodes,
  ProtectedMarkdownDialect,
  ProtectedSpanKinds,
  decodeExactOriginal,
  restoreProtectedSpans,
} from '../../src/index.js';
import { createProtectedDocument } from './helpers.js';

describe('protected Markdown spans', () => {
  it('pins one dialect and restores adversarial technical content byte for byte', () => {
    const source = [
      '# Deploy `apiServer`',
      '',
      '- Run `npm run check -- --watch=false` from /srv/app.',
      '- Keep [the guide](https://example.test/docs?q=1) unchanged.',
      '',
      '| Name | Value |',
      '| --- | ---: |',
      '| replicas | 3 |',
      '',
      '```ts',
      'const digest = "sha256:abcdef0123456789";',
      '```',
      '',
      '<details><summary>Exact HTML</summary></details>',
      'Set $DEPLOY_ENV to "production" for DeepSeek V4 Flash.',
    ].join('\n');
    const document = createProtectedDocument(source, ['DeepSeek V4 Flash']);

    expect(document.dialect).toEqual(ProtectedMarkdownDialect);
    expect(new Set(document.spans.map((span) => span.token)).size).toBe(document.spans.length);
    expect(document.spans.length).toBeGreaterThanOrEqual(10);
    for (const span of document.spans) {
      expect(source).not.toContain(span.token);
      expect(span.byteEnd).toBeGreaterThan(span.byteStart);
    }

    const restored = restoreProtectedSpans(document, document.encodedText);
    expect(restored.status).toBe('restored');
    if (restored.status !== 'restored') {
      return;
    }
    expect(restored.text).toBe(source);
    expect(Buffer.from(restored.bytes).equals(Buffer.from(document.exactOriginal.bytesBase64, 'base64')))
      .toBe(true);
  });

  it('avoids source-token collisions and remains deterministic', () => {
    const source = 'Literal token shape ⟦pcp:v1:deadbeef:0:abcdef⟧ and `codeValue`.';
    const first = createProtectedDocument(source);
    const second = createProtectedDocument(source);

    expect(first).toEqual(second);
    expect(first.spans.every((span) => !source.includes(span.token))).toBe(true);
    expect(first.namespace).not.toBe('deadbeef');

    const restored = restoreProtectedSpans(first, first.encodedText);
    expect(restored.status).toBe('restored');
    if (restored.status === 'restored') {
      expect(restored.text).toBe(source);
    }
  });

  it('round trips a deterministic generated corpus including unmatched fences', () => {
    const fragments = [
      'plain prose',
      '`inline-${index}`',
      '/tmp/path-${index}.json',
      '--flag-${index}',
      'https://example.test/${index}',
      '值-${index}-🙂',
      '```sh\necho ${index}',
    ];

    for (let index = 0; index < 128; index += 1) {
      const source = fragments
        .map((fragment) => fragment.replaceAll('${index}', String(index)))
        .join(index % 2 === 0 ? '\n' : ' | ');
      const document = createProtectedDocument(source);
      const restored = restoreProtectedSpans(document, document.encodedText);
      expect(restored.status, `generated case ${index}`).toBe('restored');
      if (restored.status === 'restored') {
        expect(restored.text).toBe(source);
      }
    }
  });

  it('names missing, duplicate, reordered, changed, and unexpected placeholders', () => {
    const document = createProtectedDocument('Use `alpha` at /srv/alpha and `beta` at /srv/beta.');
    expect(document.spans.length).toBeGreaterThanOrEqual(4);
    const first = document.spans[0]?.token;
    const second = document.spans[1]?.token;
    if (first === undefined || second === undefined) {
      throw new Error('Expected at least two protected tokens.');
    }

    const missing = restoreProtectedSpans(document, document.encodedText.replace(first, ''));
    expect(missing).toMatchObject({
      status: 'rejected',
      reasonCode: FidelityReasonCodes.PLACEHOLDER_MISSING,
    });

    const duplicate = restoreProtectedSpans(document, `${document.encodedText}${first}`);
    expect(duplicate).toMatchObject({
      status: 'rejected',
      reasonCode: FidelityReasonCodes.PLACEHOLDER_DUPLICATE,
    });

    const reorderedText = document.encodedText
      .replace(first, '__TOKEN_SWAP__')
      .replace(second, first)
      .replace('__TOKEN_SWAP__', second);
    const reordered = restoreProtectedSpans(document, reorderedText);
    expect(reordered).toMatchObject({
      status: 'rejected',
      reasonCode: FidelityReasonCodes.PLACEHOLDER_REORDERED,
    });

    const changed = restoreProtectedSpans(
      document,
      document.encodedText.replace(first, first.replace(/.$/u, first.endsWith('a') ? 'b' : 'a')),
    );
    expect(changed).toMatchObject({
      status: 'rejected',
      reasonCode: FidelityReasonCodes.PLACEHOLDER_CHANGED,
    });

    const unexpected = restoreProtectedSpans(
      document,
      `${document.encodedText} ⟦pcp:v1:unexpected:999:000000000000⟧`,
    );
    expect(unexpected).toMatchObject({
      status: 'rejected',
      reasonCode: FidelityReasonCodes.PLACEHOLDER_UNEXPECTED,
    });
  });

  it('protects nested and unmatched fences plus duplicate identifier occurrences', () => {
    const source = [
      '````markdown',
      '```ts',
      'const apiServer = 3;',
      '```',
      '````',
      '',
      'Use DeepSeek V4 Flash with apiServer, then verify apiServer.',
      '',
      '```sh',
      'echo still-open',
    ].join('\n');
    const document = createProtectedDocument(source);
    const identifiers = document.spans.filter((span) =>
      span.kind === ProtectedSpanKinds.IDENTIFIER
      && source.slice(span.charStart, span.charEnd) === 'apiServer');

    expect(identifiers).toHaveLength(2);
    expect(identifiers[0]?.token).not.toBe(identifiers[1]?.token);
    expect(identifiers[0]?.byteStart).not.toBe(identifiers[1]?.byteStart);
    expect(document.spans.some((span) =>
      source.slice(span.charStart, span.charEnd).includes('DeepSeek V4 Flash'))).toBe(true);
    const restored = restoreProtectedSpans(document, document.encodedText);
    expect(restored.status).toBe('restored');
    if (restored.status === 'restored') {
      expect(restored.text).toBe(source);
    }
  });

  it('rejects a reordered table replacement and keeps canonical bytes independent', () => {
    const source = '| Name | Value |\n| --- | ---: |\n| alpha | 3 |\n| beta | 4 |';
    const document = createProtectedDocument(source);
    const table = document.spans.find((span) => span.kind === ProtectedSpanKinds.TABLE);
    if (table === undefined) {
      throw new Error('Expected the table to be protected as one structural span.');
    }
    const reordered = document.encodedText.replace(
      table.token,
      '| Value | Name |\n| ---: | --- |\n| 3 | alpha |\n| 4 | beta |',
    );
    expect(restoreProtectedSpans(document, reordered)).toMatchObject({
      status: 'rejected',
      reasonCode: FidelityReasonCodes.PLACEHOLDER_MISSING,
    });

    const restored = restoreProtectedSpans(document, document.encodedText);
    if (restored.status !== 'restored') {
      throw new Error('Expected exact restoration before mutation isolation check.');
    }
    restored.bytes[0] = 0;
    expect(Buffer.from(decodeExactOriginal(document.exactOriginal)).toString('utf8')).toBe(source);
  });
});
