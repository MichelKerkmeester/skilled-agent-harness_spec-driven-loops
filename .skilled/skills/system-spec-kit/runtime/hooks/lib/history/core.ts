// ───────────────────────────────────────────────────────────────────
// MODULE: History Lookup Core
// ───────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';

import { projectHistoryEntries, type HistoryEntry, type HistoryProjectionOptions } from './history.js';
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
 * The core owns projection and reply bounds, so no route can reach a raw entry,
 * a transcript path or a store handle after this call returns.
 */
export function createHistoryLookup(
  entries: readonly HistoryEntry[],
  options: HistoryProjectionOptions = {},
): HistoryLookup {
  const items = projectHistoryEntries(entries, options);
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
