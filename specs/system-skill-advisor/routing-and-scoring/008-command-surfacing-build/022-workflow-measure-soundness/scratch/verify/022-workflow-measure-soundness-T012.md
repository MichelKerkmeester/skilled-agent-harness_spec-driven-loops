VERDICT: PASS

Task T012, phase 022-workflow-measure-soundness, base 47577daa6f.

1. Diff scope
- command-offer.mjs hunks: `@@ -41,28` and `@@ -78,7` are T011 (verified). `@@ -139,12 ... contentHasBrief` is T012: recordsHaveBrief now requires `record?.role !== 'toolResult'` before the BRIEF_PATTERN test, and the comment above it opens with "A brief arrives as session input, so a tool that printed a document quoting a head delivered nothing."
- command-offer.vitest.ts: inside describe('briefDelivered'), the two cases with the exact names, inputs (runtime pi, locator {}, the given records, injected []) and expectations (false, true).
- Worker log tool calls: 2 edits (CO, COT), 4 reads, tasks.md only read. score-command-transcripts.mjs and command-transcript-score.vitest.ts in git status belong to lane S. tasks.md (T001/T002 ticked) and the scratch files are coordinator work.
- Note, accepted: the task said "replace the comment". The worker put the required sentence first and kept the three old lines that explain why the whole record is serialized. That code is unchanged, so the kept lines are still true. Not a defect.

2. Test first
- Worker log first run: `FAIL tests/command-offer.vitest.ts > briefDelivered > does not count a head quoted inside a tool result`, `expected true to be false`, `Tests 1 failed | 28 passed (29)`. This is the reason the task names.
- Worker log passing run: `Tests 29 passed (29)`.
- My run: `VX tests/command-offer.vitest.ts` -> `Tests 29 passed (29)`. `npm run typecheck` exit 0.

3. Hygiene
The added comment names no spec path, phase, task, finding, ADR or REQ id. No em dash, no semicolon.

4. Correctness
The neutral record schema (.skilled/hooks/shared/session-readers/project.mjs validates `role` and special-cases `toolResult`; pi.mjs and opencode.mjs emit `role: 'toolResult'`) uses one name for tool output on every runtime, so the single role check covers pi, devin, dsh and the codex path that share recordsHaveBrief. User and assistant records still count, and injectedHasBrief is untouched. Residual, out of scope: a head quoted inside an assistant tool_use input would still count.
