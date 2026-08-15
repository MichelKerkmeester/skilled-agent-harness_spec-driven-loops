# Iteration 2: Exact-Action Approval and Redaction

## Focus

Q4: How should Pi Remote present approve, deny, accept-edits, and redacted action data so a mobile operator can decide quickly without weakening exact-action authorization?

## Actions Taken

1. Inspected Pi Remote's review component, action hierarchy, host-verification states, accept-edits request, and mobile approval styling.
2. Compared the flow with GitHub's inspect-by-file, progress, stale-review, and submit-review patterns.
3. Applied OWASP transaction-authorization guidance to identify which action data must remain visible and bound to the decision.
4. Applied OWASP sensitive-data handling guidance to define redaction as visible semantic structure rather than an unexplained blanket label.
5. Attempted to consult Apple's alert guidance, but the official page exposed only a JavaScript-required shell and supplied no usable evidence.

## Findings

### F-007: Use a decision synopsis over the canonical payload, not instead of it

OWASP's "What You See Is What You Sign" principle requires the operator to identify and acknowledge significant transaction data. GitHub accelerates review with navigable file units, progress, and a final decision after inspection. Together these support a two-layer card: a compact decision synopsis for scanning, followed by the complete relay-redacted canonical payload or diff for verification. [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html] [SOURCE: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request]

The synopsis should state, in order: exact verb/tool, redacted target, effect or change count, session-safe identity, and time remaining. It may summarize a mutation as "Write 2 files, +18/-4" and group the payload by file/hunk, but it must never replace significant arguments with a generic risk sentence. A persistent "Redacted canonical action" disclosure should expose the full payload that the existing digest binds. Pi Remote already has canonical arguments, digest, revision, epoch, and expiry. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:553-571] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:89-110]

Do not make scroll-to-bottom, a "Viewed" checkbox, or press-and-hold a universal authorization gate. They add ceremony without proving comprehension and create assistive-technology friction. Keep the complete action directly reachable, keep actions visible in a safe-area-aware sticky bar, and use specific text such as "Approve this write" rather than generic "Approve."

### F-008: Exact approval and accept-edits are different authorization products

"Approve once" is bound to one approval ID, epoch, revision, and digest. The accept-edits request instead sends session, epoch, tool class, action count, and a ten-minute TTL; it does not send the current approval ID or digest. The UI presents both controls in one action group, so "Accept next 3 edits" can be read as a broader way to settle the visible action even though the client request does not establish that relationship. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:572-603] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:113-131]

Keep "Deny" and "Approve this action" as the immediate pair. Move accept-edits behind "Allow similar edits..." Its confirmation must state server-enforced scope: allowed tool class, remaining count, expiry, whether the visible action is included, and how to revoke. Keep an active grant persistently visible with count, expiry, and revoke. OWASP treats authorization-method changes and reusable authority as broader operations that must not be confused with one unique transaction authorization. [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html]

The inspected client files do not establish whether grant creation settles, includes, or merely permits a retry of the current action. Product copy must not imply one semantic until that server contract is confirmed.

### F-009: Make redaction typed, structural, and non-revealable

The card says "Relay-redacted canonical input," but does not tell the operator whether a hidden value is a secret, path, identifier, or omitted content. This can make materially different actions look similar. OWASP recommends removing, masking, sanitizing, hashing, or encrypting sensitive values, including source code, tokens, session identifiers, paths, connection strings, and internal network names as applicable. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:565-570] [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html]

Preserve syntax and field position with placeholders such as `[secret redacted]`, `[path redacted]`, or `[identifier masked]`, plus "3 sensitive values hidden by relay." Do not offer reveal, expose raw data in accessible names, notifications, errors, analytics, or local persistence, or recompute a client display from raw input. The digest is an integrity receipt, not a substitute for understandable significant fields.

If redaction hides a field essential to judging the mutation, fail closed with "Cannot safely review this action" and offer Deny or return-to-session rather than approving an opaque payload.

### F-010: Treat stale and submitted states as part of the flow

GitHub can dismiss approval when code changes. Pi Remote already rejects changed, expired, settled, replayed, or wrong-epoch decisions and maps distinct reasons. Reflect those protections in-place rather than in a generic alert. [SOURCE: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:213-224]

After submission, make the bar inert and show "Submitted - verifying at host." A digest/revision mismatch should say "Action changed - review replacement," preserve the old synopsis as a non-actionable receipt where policy permits, and focus the replacement. Expiry removes approval controls. Host acceptance, denial, grant consumption, revocation, and failure each replace controls with a concise state. Never say "Approved" before host verification; the current verifying state correctly preserves that distinction. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:605-613]

### F-011: Optimize the queue for triage, then exact review

For multiple approvals, show collapsed cards with synopsis, age/expiry, and state, while expanding the deep-linked or oldest urgent card. Group an expanded file mutation by file and hunk. Review progress is orientation, not permission. GitHub's per-file patterns reduce re-scanning, while OWASP requires authorization to stay tied to the exact operation. [SOURCE: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request] [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html]

After Deny or verified approval, advance to the next card but preserve the receipt. Deny remains one press because it creates no mutation and should not be styled as destructive red. Exact approval can remain one press when action and state are visible. Only the broader grant needs scoped confirmation.

### Recommended Review Anatomy

1. Queue header: pending count, current position, refresh/authority state.
2. Card header: Protected action, expiry, session-safe identity.
3. Decision synopsis: exact tool/verb, typed-redacted target, effect/change count.
4. Inspectable body: grouped diff or canonical arguments, typed redaction markers, low-prominence digest.
5. Sticky immediate actions: Deny and Approve this action.
6. Separate authority disclosure: Allow similar edits..., scoped confirmation, and persistent revokeable grant status.
7. In-place receipt: submitted, host-verified, denied, expired, changed, consumed, revoked, or failed.

## Questions Answered

- Q4 is answered at the interaction-contract level: synopsis plus exact payload, one-press digest-bound exact approval, separately confirmed reusable authority, typed non-revealable redaction, and in-place lifecycle states.
- Transfer inspectable units, progress, stale-review invalidation, and an explicit decision from review apps. Do not transfer progress as proof of comprehension or blanket auto-apply.

## Questions Remaining

- Q2: Define navigation among Home, Session, Review, and Attention Inbox, including approval counts and return paths.
- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error/usage prominence.
- Q5: Specify touch-keyboard, external-keyboard, steer, queue, retry, and stop behavior.
- Q6: Define foreground suppression, unread state, stale hints, and notification preferences.
- Contract gap: confirm whether accept-edits settles, includes, or only authorizes retry of the visible approval, and confirm the PWA revocation contract.

## Sources Consulted

- Pi Remote `App.tsx`: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:455-620`.
- Pi Remote `relay.ts`: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:74-131` and `:213-224`.
- Pi Remote `style.css`: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:916-1062`.
- GitHub review: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request
- OWASP transaction authorization: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- OWASP logging/redaction: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- Failed retrieval: https://developer.apple.com/design/human-interface-guidelines/alerts returned only a JavaScript-required shell.

## Assessment

- `newInfoRatio`: 0.74
- Novelty justification: Iteration 1 established exact staged review; this iteration adds a two-speed authorization model, typed-redaction semantics, stale-state handling, queue anatomy, and an accept-edits contract gap.
- Confidence: High for exact-action and stale-state recommendations from client, GitHub, and OWASP evidence. Medium for accept-edits copy until server inclusion and revocation semantics are confirmed.

## Reflection

What worked:

- Separating interaction speed from authority scope resolved the apparent safety/friction tradeoff.
- Comparing request bodies exposed a semantic difference that button styling obscures.
- Treating redaction as information architecture was more actionable than another security notice.

What failed or was ruled out:

- Apple's page supplied no usable evidence, so no Apple-specific claim was inferred.
- Universal confirmation, press-and-hold, scroll gates, reveal controls, generic redaction labels, red Deny styling, and peer placement of accept-edits were ruled out.

## Next Focus

Q2: Define a coherent mobile navigation model that makes approvals and attention visible without displacing the active session, including post-decision return paths.

## Recommended Next Focus

Map badges, deep links, and post-decision return behavior across Home, Session, Review, and Attention Inbox, using the exact-action card as the authoritative approval destination.
