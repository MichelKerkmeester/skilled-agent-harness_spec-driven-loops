// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Wire Adapters
// ───────────────────────────────────────────────────────────────────

import { isRecord } from '../contracts/validator-utils.js';
import { validateProviderModelRecord } from './registry.js';
import { compilePromptControls } from './controls.js';
import { ProviderFamilies } from './types.js';

import type { JsonValue } from '../contracts/common.js';
import type {
  MutableJsonObject,
  ParsedProviderFailure,
  ParsedProviderResponse,
  ProviderAdapter,
  ProviderFamily,
  ProviderPreparationInput,
  ProviderRequestPreparation,
  ProviderWireResponse,
} from './types.js';

const openCodeGoAdapter = createOpenAiChatAdapter(ProviderFamilies.OPENCODE_GO);
const genericHostedAdapter = createOpenAiChatAdapter(ProviderFamilies.GENERIC_HOSTED);
const llamaCppAdapter = createOpenAiChatAdapter(ProviderFamilies.LLAMA_CPP);
const ollamaAdapter: ProviderAdapter = Object.freeze({
  family: ProviderFamilies.OLLAMA,
  prepare(input: ProviderPreparationInput): ProviderRequestPreparation {
    return prepare(input, ProviderFamilies.OLLAMA, {
      model: input.record.provider.modelId,
      messages: messages(input),
      stream: false,
    });
  },
  parse: parseOllamaResponse,
});

/** Return the adapter with wire semantics matching one validated family. */
export function getProviderAdapter(family: ProviderFamily): ProviderAdapter {
  switch (family) {
    case ProviderFamilies.OPENCODE_GO:
      return openCodeGoAdapter;
    case ProviderFamilies.GENERIC_HOSTED:
      return genericHostedAdapter;
    case ProviderFamilies.LLAMA_CPP:
      return llamaCppAdapter;
    case ProviderFamilies.OLLAMA:
      return ollamaAdapter;
  }
}

function createOpenAiChatAdapter(family: ProviderFamily): ProviderAdapter {
  return Object.freeze({
    family,
    prepare(input: ProviderPreparationInput): ProviderRequestPreparation {
      return prepare(input, family, {
        model: input.record.provider.modelId,
        messages: messages(input),
        stream: false,
      });
    },
    parse: parseOpenAiChatResponse,
  });
}

function prepare(
  input: ProviderPreparationInput,
  family: ProviderFamily,
  baseBody: MutableJsonObject,
): ProviderRequestPreparation {
  const recordResult = validateProviderModelRecord(input.record);
  if (!recordResult.success || input.record.family !== family) {
    return Object.freeze({
      status: 'unsupported',
      reasonCode: 'invalid-provider',
      control: null,
    });
  }
  const controls = compilePromptControls(input.record, input.prompt, baseBody, input.now);
  if (controls.status === 'unsupported') {
    return controls;
  }
  return Object.freeze({
    status: 'prepared',
    request: Object.freeze({
      endpoint: input.record.provider.endpoint,
      providerId: input.record.provider.providerId,
      modelId: input.record.provider.modelId,
      protocol: input.record.provider.protocol,
      credentialReference: input.record.provider.credentialReference,
      body: controls.body,
      signal: input.signal,
    }),
  });
}

function messages(input: ProviderPreparationInput): JsonValue {
  return [
    { role: 'system', content: input.prompt.systemInstruction },
    { role: 'user', content: input.document.encodedText },
  ];
}

function parseOpenAiChatResponse(response: ProviderWireResponse): ParsedProviderResponse {
  if (!isSuccessfulStatus(response.status)) {
    return failure('provider-error', 'error');
  }
  if (!isRecord(response.body) || !Array.isArray(response.body.choices)) {
    return failure('invalid-response', 'error');
  }
  const choice = response.body.choices[0];
  if (!isRecord(choice)) {
    return failure('invalid-response', 'error');
  }
  if (choice.finish_reason === 'length') {
    return failure('truncated', 'truncated');
  }
  if (!isRecord(choice.message) || typeof choice.message.content !== 'string') {
    return failure('invalid-response', 'error');
  }
  return candidate(choice.message.content);
}

function parseOllamaResponse(response: ProviderWireResponse): ParsedProviderResponse {
  if (!isSuccessfulStatus(response.status)) {
    return failure('provider-error', 'error');
  }
  if (!isRecord(response.body) || response.body.done !== true) {
    return response.body !== null
      && isRecord(response.body)
      && response.body.done === false
      ? failure('truncated', 'truncated')
      : failure('invalid-response', 'error');
  }
  if (!isRecord(response.body.message) || typeof response.body.message.content !== 'string') {
    return failure('invalid-response', 'error');
  }
  return candidate(response.body.message.content);
}

function candidate(text: string): ParsedProviderResponse {
  if (text.trim().length === 0) {
    return failure('empty-output', 'error');
  }
  return Object.freeze({
    status: 'candidate',
    text,
    outputByteCount: new TextEncoder().encode(text).byteLength,
  });
}

function failure(
  reasonCode: ParsedProviderFailure['reasonCode'],
  terminal: ParsedProviderFailure['terminal'],
): ParsedProviderFailure {
  return Object.freeze({ status: 'failure', reasonCode, terminal });
}

function isSuccessfulStatus(status: number): boolean {
  return Number.isInteger(status) && status >= 200 && status < 300;
}
