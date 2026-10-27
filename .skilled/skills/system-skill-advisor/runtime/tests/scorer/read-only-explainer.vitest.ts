// ───────────────────────────────────────────────────────────────
// MODULE: Read-Only Explainer Classification Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { isReadOnlyExplainer } from '../../lib/scorer/text.js';

// A prompt classified as a read-only explainer is held at the explainer floor and
// abstains. A request that also runs or switches something off is write work, even
// when it ends by asking to be shown or told the result.
describe('isReadOnlyExplainer', () => {
  it.each([
    'run the quality gate on this repository and tell me which checks fail',
    'turn off the nightly ci workflow and then show me what still runs',
    'disable the release workflow switch and tell me what changed',
    'turn on the nightly ci workflow again, then show me what i enabled',
    'enable the nightly ci switch and tell me what it starts',
    'execute the quality gate on my files and tell me which checks fail',
    'switch off the nightly ci workflow, then show me what stopped',
    'rerun the failing checks and tell me which still fail',
  ])('treats a run or switch-off request as write work: %s', (prompt) => {
    expect(isReadOnlyExplainer(prompt)).toBe(false);
  });

  it('still treats a plain explain request as read-only', () => {
    expect(isReadOnlyExplainer('explain how the quality gate picks its checks')).toBe(true);
  });

  it('does not match a run verb inside another word', () => {
    expect(isReadOnlyExplainer('tell me about the runtime lanes')).toBe(true);
  });
});
