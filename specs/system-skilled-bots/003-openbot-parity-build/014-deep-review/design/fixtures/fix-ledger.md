# Fix ledger

One row per finding the fix pass owns, in `openFindings` order. The row count equals `openFindings.length` in `deep-review-findings-registry.json`. A row reads `pass` when the fix landed and its verify command printed what the row says, and `deferred` when it did not land and the `Fix` cell carries the reason.

| Finding | File | Fix | Verify | Status |
|---------|------|-----|--------|--------|
| F001 (P0) | `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Derive the scope before the write and write the grant from the derived value, so a reject stores `deny`. Class: cross-consumer | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts` | pass |
| F002 (P1) | `.skilled/bin/bots.cjs` | Print the object envelope with `version`, `conversationId` and `messages` on the transcript verb. Class: class-of-bug | `node .skilled/bin/bots.cjs chat hello --transcript --json` | pass |
| F003 (P1) | `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Filter the listing on the item id shape as well as the `.json` suffix. Class: instance-only | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts` | pass |
| F004 (P2) | `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Deferred: the README is a documentation surface no phase of this build owns, and rewriting it is a documentation change rather than a fix to a defect the review named. Class: matrix/evidence | `rg -c 'module' .skilled/skills/system-skilled-bots/runtime/lib/README.md` | deferred |
