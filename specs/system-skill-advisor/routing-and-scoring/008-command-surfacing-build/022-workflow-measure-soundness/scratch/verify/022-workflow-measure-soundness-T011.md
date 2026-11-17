VERDICT: PASS

Task T011, phase 022-workflow-measure-soundness, base 47577daa6f.

1. Diff scope
- command-offer.mjs: failedOffer gains `offeredAs: null`. parseOffer returns `offeredAs: null` on no match, `'partner'` when `text.slice(0, match.index).includes(' vs ')`, else `'head'`. Jsdoc names the field with the reason (an ambiguous head names two paths and only one of them leads). replayOffer @returns updated to carry the field. Nothing else.
- command-offer.vitest.ts: the three existing parseOffer toEqual cases carry offeredAs ('head' for OFFERED_HEAD as the plain head, 'head' for AMBIGUOUS_HEAD whose command sits before vs, null for NO_COMMAND_HEAD as the head with no command). Two new cases with the exact names and inputs from the task line. The replayOffer hook_missing toEqual also gains `offeredAs: null`, which is the forced consequence of the failedOffer change the task asks for, not an extra behaviour.
- git status --short: CO and COT are T011's. tests/command-transcript-score.vitest.ts belongs to lane S. tasks.md and the scratch files (before.txt, den-*.txt, repro-before.txt, workflow-before-*.json) belong to T001/T002 coordinator work.

2. Test first
- Worker log first run: `Tests  6 failed | 21 passed (27)`, failing cases: the five parseOffer cases and replayOffer "reports a checkout without the prompt hook instead of throwing", all for the missing offeredAs field.
- Worker log passing run: `Tests  27 passed (27)`, guards `Tests  13 passed (13)`.
- My runs: `VX tests/command-offer.vitest.ts` -> `Test Files 1 passed (1)`, `Tests 27 passed (27)`. `VX tests/command-behaviour-guards.vitest.ts` -> `Tests 13 passed (13)`. `npm run typecheck` exit 0.

3. Hygiene
Added comment prose names no spec path, phase, task, finding, ADR or REQ id. No em dash, no semicolon.

4. Correctness
The partner test checks only text before the first command match, so a command in the head clause of an ambiguous head stays 'head' even though ` vs ` follows it (covered by AMBIGUOUS_HEAD and the new /create:agent case). A plain head has no ` vs `. No realistic misclassification found. Note, not a defect: the two literal offer objects in the run loop (no_checkout, untrusted_checkout) and the written line fields do not carry offeredAs. The task did not ask for that, and later tasks or T014 may.
