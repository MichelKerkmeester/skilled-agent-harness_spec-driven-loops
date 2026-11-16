// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup Core
// ───────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';

import { scrubSecrets } from '../../../../skills/system-spec-kit/shared/dist/parsing/secret-scrubber.js';
import {
  projectHistoryEntries,
  type HistoryContentBlock,
  type HistoryEntry,
  type HistoryProjectionOptions,
} from './history.js';
import { HistoryNavigator, type HistoryBrowseInput, type HistorySearchInput } from './navigator.js';
import { boundedHistoryReply, type BoundedHistoryReply } from './loads.js';
import {
  HistoryPageError,
  describeHistoryPart,
  historyPageTexts,
  historyPartsPage,
  publicHistoryItem,
  readHistoryTextPage,
  selectHistoryImage,
  validateHandleLengths,
  type HistoryImageAttachment,
  type HistoryPageInput,
} from './pages.js';
import {
  HistoryResponseError,
  MAXIMUM_RECOVERY_REPLY_BYTES,
  recoveryResponse,
  recoveryTextReply,
  type HistoryTextReply,
} from './response.js';

export type HistoryPageReply = Omit<HistoryTextReply, 'content'> & {
  content: (HistoryTextReply['content'][number] | HistoryImageAttachment)[];
};

/** The four read-only operations an adapter can call. */
export type HistoryLookup = {
  search(input: HistorySearchInput): BoundedHistoryReply;
  browse(input: HistoryBrowseInput): BoundedHistoryReply;
  load(historyIds: readonly string[]): BoundedHistoryReply;
  page(input: HistoryPageInput): HistoryPageReply;
};

// The shared scrubber covers vendor keys, tokens, JWTs, bearer values, private
// keys and key=value credentials. A password inside a URL and a non-bearer
// Authorization value carry no vendor shape, so the lookup adds both here.
const URL_PASSWORD = /\b([a-z][a-z0-9+.-]*:\/\/[^\s:/?#@]*:)([^\s/?#]+)@/gi;
const AUTHORIZATION_VALUE =
  /\b((?:proxy-)?authorization["']?\s*[:=]\s*["']?(?:(?:basic|bearer|token|digest|bot|negotiate)\s+)?)(?!\[REDACTED)(?!\$)([^\s"',;]{8,})/gi;
// An argument under one of these names is a credential whatever its shape,
// which a scan of the bare string value cannot see once the key is gone.
// The name is matched on its last words, so a header such as `x-api-key`, a camel-case
// `xAuthToken` and a plural `api_keys` count, while `max_tokens` stays a plain setting.
const SECRET_ARGUMENT_KEY =
  /(?:^|_)(?:(?:api|access|auth|client|refresh|secret|private)_?(?:keys?|tokens?|secrets?)|apikeys?|password|passwd|passphrase|token|secret|authorization|credentials?)$/;

function isSecretArgumentKey(key: string): boolean {
  const words = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
  return SECRET_ARGUMENT_KEY.test(words);
}

/** A header value is a credential when it has a digit or mixed case, never a plain word. */
function looksLikeCredential(value: string): boolean {
  return /\d/.test(value) || (/[a-z]/.test(value) && /[A-Z]/.test(value));
}

function redactText(text: string): string {
  return scrubSecrets(text)
    .replace(URL_PASSWORD, '$1[REDACTED:url-password]@')
    .replace(AUTHORIZATION_VALUE, (match: string, prefix: string, value: string) =>
      (looksLikeCredential(value) ? `${prefix}[REDACTED:authorization]` : match));
}

function redactArgument(value: unknown, key?: string): unknown {
  if (typeof value === 'string') {
    // A shell variable reference names a secret without holding it.
    if (key !== undefined && isSecretArgumentKey(key) && value.length > 0 && !value.startsWith('$')) {
      return '[REDACTED:credential-argument]';
    }
    return redactText(value);
  }
  // Items under a credential name are credentials too, so the name travels into the array.
  if (Array.isArray(value)) return value.map((item) => redactArgument(item, key));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([name, child]) => [name, redactArgument(child, name)]));
  }
  return value;
}

function redactBlock(block: HistoryContentBlock): HistoryContentBlock {
  if (block.type === 'text') return { ...block, text: redactText(block.text) };
  if (block.type === 'thinking') return { ...block, thinking: redactText(block.thinking) };
  if (block.type === 'toolCall') return { ...block, arguments: redactArgument(block.arguments) };
  // Image bytes are base64, where a pattern hit would corrupt the image.
  return block;
}

/**
 * Remove secret-shaped values from every readable string before projection.
 *
 * Redacting here, once, means search cannot match a secret, and every byte
 * bound, part list and page offset is computed on the text a caller receives.
 * Ids, tool names and ordering stay untouched so pairing still validates.
 */
function redactHistoryEntries(entries: readonly HistoryEntry[]): HistoryEntry[] {
  return entries.map((entry) => ({ ...entry, content: entry.content.map(redactBlock) }));
}

function readImagePage(items: ReturnType<typeof projectHistoryEntries>, input: HistoryPageInput): HistoryPageReply {
  if (input.part === undefined || input.offset !== undefined || input.limit !== undefined) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Image mode requires a part handle without text-page bounds.');
  }
  const item = publicHistoryItem(items, input.historyId);
  const image = selectHistoryImage(item, input.part);
  const metadata = describeHistoryPart(item, { part: input.part, value: image });
  const reply = recoveryResponse(metadata);
  const withImage: HistoryPageReply = {
    ...reply,
    content: [...reply.content, { type: 'image' as const, data: image.data, mimeType: image.mimeType }],
  };
  // The metadata alone was measured above. The attachment is what makes an
  // image reply large, so the whole reply is measured again against the cap.
  if (Buffer.byteLength(JSON.stringify(withImage), 'utf8') > MAXIMUM_RECOVERY_REPLY_BYTES) {
    throw new HistoryResponseError('HISTORY_REPLY_TOO_LARGE', 'The image does not fit the reply size cap.');
  }
  return withImage;
}

/**
 * Build the four-operation lookup over an adapter-supplied entry list.
 *
 * The core owns redaction, projection and reply bounds, so no route can reach a
 * raw entry, a secret it held, a transcript path or a store handle after this
 * call returns.
 */
export function createHistoryLookup(
  entries: readonly HistoryEntry[],
  options: HistoryProjectionOptions = {},
): HistoryLookup {
  const items = projectHistoryEntries(redactHistoryEntries(entries), options);
  const navigator = new HistoryNavigator(items);

  return {
    search(input: HistorySearchInput): BoundedHistoryReply {
      return boundedHistoryReply(undefined, navigator.search(input));
    },

    browse(input: HistoryBrowseInput): BoundedHistoryReply {
      return boundedHistoryReply(undefined, navigator.browse(input));
    },

    load(historyIds: readonly string[]): BoundedHistoryReply {
      return boundedHistoryReply(navigator.load(historyIds));
    },

    page(input: HistoryPageInput): HistoryPageReply {
      const mode = input.mode ?? 'text';
      validateHandleLengths(input);

      if (mode === 'text') {
        return recoveryTextReply(historyPageTexts(readHistoryTextPage(items, input)));
      }
      if (mode === 'parts') {
        if (input.part !== undefined) {
          throw new HistoryPageError('INVALID_PAGE_INPUT', 'Part-list mode does not accept a part selector.');
        }
        const item = publicHistoryItem(items, input.historyId);
        return recoveryResponse(historyPartsPage(item, input.offset, input.limit));
      }
      if (mode === 'image') return readImagePage(items, input);

      throw new HistoryPageError('INVALID_PAGE_INPUT', 'Unknown history read mode.');
    },
  };
}
