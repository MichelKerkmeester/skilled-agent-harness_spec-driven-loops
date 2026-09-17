import { describe, expect, it } from 'vitest';

import { scrubWorkflowSavePayloadTextFields } from '../core/workflow.js';
import type { CollectedDataFull } from '../extractors/collect-session-data.js';
import type { SessionData } from '../types/session-types.js';

const AWS_ACCESS_KEY = 'AKIA1234567890ABCDEF';
const GITHUB_PAT = 'github_pat_11ABCDEFG0abcdefghijklmnop';

describe('workflow durable save secret scrub', () => {
  it('removes raw AWS and GitHub tokens before fields are persisted', () => {
    const warnings: string[] = [];
    const scrubbed = scrubWorkflowSavePayloadTextFields({
      contentSlug: `save-${AWS_ACCESS_KEY}`,
      rawCtxFilename: `2026-06-12_10-00-00__save-${GITHUB_PAT}.md`,
      memoryTitle: `Captured ${AWS_ACCESS_KEY}`,
      memoryDescription: `Captured ${GITHUB_PAT}`,
      sessionData: {
        TITLE: `Title ${AWS_ACCESS_KEY}`,
        QUICK_SUMMARY: `Quick ${GITHUB_PAT}`,
        SUMMARY: `Summary ${AWS_ACCESS_KEY} ${GITHUB_PAT}`,
        TECHNICAL_CONTEXT: [
          { KEY: `aws ${AWS_ACCESS_KEY}`, VALUE: `pat ${GITHUB_PAT}` },
        ],
      } as unknown as SessionData,
      collectedData: {
        SUMMARY: `Collected ${AWS_ACCESS_KEY}`,
        TECHNICAL_CONTEXT: [
          { KEY: 'tokens', VALUE: `${AWS_ACCESS_KEY} ${GITHUB_PAT}` },
        ],
        recentContext: [
          { request: `request ${AWS_ACCESS_KEY}`, learning: `learning ${GITHUB_PAT}` },
        ],
      } as unknown as CollectedDataFull,
    }, (message) => warnings.push(message));

    const persistedFields = JSON.stringify(scrubbed);
    expect(persistedFields).not.toContain(AWS_ACCESS_KEY);
    expect(persistedFields).not.toContain(GITHUB_PAT);
    expect(warnings.length).toBeGreaterThan(0);
  });
});
