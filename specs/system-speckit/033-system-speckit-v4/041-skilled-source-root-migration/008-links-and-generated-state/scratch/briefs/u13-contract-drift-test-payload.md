## Edit 1

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`

OLD:

~~~~text
const COMMAND = 'deep/review';
const REVIEW_CONFIG_SOURCE = '.opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json';
const COUNCIL_COMMAND = 'deep/ai-council';
const COUNCIL_PATTERN_SOURCE = '.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md';

function realContract(command = COMMAND): string {
~~~~

NEW:

~~~~text
const COMMAND = 'deep/review';
const REVIEW_CONFIG_SOURCE = '.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json';
const COUNCIL_COMMAND = 'deep/ai-council';
const COUNCIL_PATTERN_SOURCE = '.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md';

function realContract(command = COMMAND): string {
~~~~

## Edit 2

File: `.skilled/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`

OLD:

~~~~text
  // so recorded and referenced sources must compare the same whichever name they spell.
  it('accepts recorded source digests spelled under .skilled on a tree that holds them under .opencode', () => {
    const contract = withHeader(realContract(), (header) => {
      for (const digest of header.sourceDigests) digest.path = digest.path.replace(/^\.opencode\//, '.skilled/');
    });
~~~~

NEW:

~~~~text
  // so recorded and referenced sources must compare the same whichever name they spell.
  it('accepts recorded source digests spelled under .opencode on a tree that holds them under .skilled', () => {
    const contract = withHeader(realContract(), (header) => {
      for (const digest of header.sourceDigests) digest.path = digest.path.replace(/^\.skilled\//, '.opencode/');
    });
~~~~
