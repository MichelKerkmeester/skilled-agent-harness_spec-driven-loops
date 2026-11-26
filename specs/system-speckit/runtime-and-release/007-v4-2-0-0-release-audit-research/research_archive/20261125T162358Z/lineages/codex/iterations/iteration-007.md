# Iteration 7: Browser Use

## Focus
Audit Browser Use notes against the current browser hub, recent browser-hub packet, and changes after the section was drafted. The focus came from the strategy's Next Focus.

## Findings
1. **MISSING — P2: Own-Chrome attach requests now pass the advisor's read-only floor, but this exception is not described.** Commit `1a350b1512bdabbf861d63fe5c1ca2bf343c8522` added matching for attach/connect requests to the user's own, signed-in, or logged-in Chrome and Chrome DevTools Live. Current advisor logic lifts those requests at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:680-691`; the browser hub skill describes own-Chrome attachment at `.skilled/skills/mcp-browser-use/SKILL.md:60`. The release note only says the advisor sends browser requests to the hub at `.skilled/changelog/skilled/v4.2.0.0.md:697`, without documenting this read-only-floor exception.
2. **MISSING — P2: A prompt that mentions “403 Forbidden” now routes to Chrome DevTools instead of being rejected, but this correction is not described.** Commit `a9a8a878daddcc7f0030ee81dc58c3dd81e82ca5` moved rejection to caller constraints; the current compiled router checks only the constraints at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:113-120`. Its canary expects “debug the 403 Forbidden network requests in chrome devtools” to route to Chrome DevTools at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:263-274`. The Browser Use notes cover general hub routing at `.skilled/changelog/skilled/v4.2.0.0.md:697-700` but omit the change from prompt-text rejection to constraint-only rejection.

## Ruled Out
No distinct additional release-note discrepancy was confirmed for the Core Web Vitals routing cue: the release note already states that browser requests go to the hub (`.skilled/changelog/skilled/v4.2.0.0.md:697`), while the recent packet records that advisor-discovery wording as fixed.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: none; the strategy named the Browser Use section.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `.skilled/changelog/skilled/v4.2.0.0.md:686-724`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:680-691`
- `.skilled/skills/mcp-browser-use/SKILL.md:60`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:113-120`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:263-274`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/018-triage-gen4-p2-findings/implementation-summary.md:48-77`
- Commits `1a350b1512bdabbf861d63fe5c1ca2bf343c8522` and `a9a8a878daddcc7f0030ee81dc58c3dd81e82ca5`
- State, config and strategy read before this iteration; `steer.md` checked and absent.

## Assessment
- New information ratio: 1.0 (two new findings).
- Questions addressed: Browser Use portion of the missing-behavior and recent-packet questions.
- Questions answered: No full audit question is closed yet; the Browser Use notes pass found two omissions and no Browser Use DRIFT or current BUG.

## Reflection
- What worked and why: Reading both the commit rationale and current compiled/runtime code distinguished two user-visible routing changes from the broader hub-routing description.
- What did not work and why: None.
- What I would do differently: Compare the remaining release-note sections against their post-draft commits and packet summaries.

## Recommended Next Focus
Audit Skills and Worktrees notes against linked-worktree behavior, worktree provisioning, and the supplied recent packet summaries.
