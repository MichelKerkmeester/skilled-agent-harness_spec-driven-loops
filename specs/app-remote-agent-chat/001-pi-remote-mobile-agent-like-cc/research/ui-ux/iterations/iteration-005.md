# Iteration 5: Mobile Information Architecture and Return Paths

## Focus

Q2: What information architecture and navigation contract makes Sessions, Session, Review, and Attention coherent under foreground authority, content-free push hints, and warm or cold PWA entry?

## Actions Taken

1. Recovered the externalized strategy, state log, prior compose findings, and research-only scope after iteration 4 failed before producing artifacts.
2. Inspected the current app shell, history writes, popstate handling, surface precedence, Review focus behavior, Attention Inbox opening behavior, and session navigation.
3. Traced the attention client from reauthentication through no-store lookup resolution, including stale-hint handling and foreground reporting.
4. Attempted to consult Apple navigation guidance; the public page exposed only a JavaScript-required shell, so it was not used as evidence.

## Findings

### F-018: Keep two persistent roots and make Session and Review route-addressable details

The coherent mobile model is two persistent roots: `Sessions` for ongoing agent work and `Attention` for items that may require operator awareness. A Session is a detail below Sessions. Review is a contextual detail reached from either a session-level pending action or an Attention item, not a third peer destination. This keeps the primary choice stable while letting an approval retain its originating context. The current header presents Inbox and Review as equal global buttons even though Review already depends on session approvals and can be focused from an attention resolution. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:216-303] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:455-518]

Use a compact persistent root switcher for `Sessions` and `Attention`. Put pending-review counts on the Attention destination and on the relevant session rather than preserving a separate Review root. Root switching should not imply a mutation and remains available while stale; opening a detail may show cached read-only state, but its action controls remain blocked until foreground authority is live.

### F-019: Replace independent booleans with one URL-first route state contract

The current route state can represent contradictory surfaces: `selectedSessionId`, `reviewOpen`, and `inboxOpen` are independent; popstate updates only the session ID; Inbox and Review buttons do not write history; and attention resolution writes `/?review=1&focus=...` even though startup never reads those query parameters. A reload of that Review URL therefore falls back to Sessions, while browser Back cannot reliably reverse Inbox or Review navigation. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:67-75] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:134-165] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:216-265]

Adopt one discriminated route state with canonical URLs: `sessions` at `/`, `attention` at `/attention`, `session` at `/session/:sessionId`, and `review` at `/review/:approvalId` with an optional opaque session identifier when needed for authoritative loading. Parse the route once on startup and on popstate. Render exactly one matching surface. Invalid or unauthorized opaque IDs fall back to their root with an explicit message, not a silent surface change.

History entries should carry only non-sensitive navigation provenance such as `{ returnTo: "/attention" }`; they must not contain prompt, path, tool argument, or notification content. In-app detail opens use `pushState`. Browser Back uses the actual history entry. A cold detail entry with no valid same-app return entry uses a visible fallback: Session returns to Sessions; Review returns to Attention unless it was opened from a known Session route.

### F-020: Treat an attention URL as a resolver, never as the authoritative destination

The existing client correctly reauthenticates before opening a hint, POSTs the opaque lookup ID with `cache: "no-store"`, validates the returned resolution, and maps HTTP 410 to a stale-hint error. This is the correct security boundary: neither a notification payload nor an old client route decides whether current state is a Session or Review. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/attention.ts:23-45] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/attention.ts:102-117]

The complete pipeline should be: receive a content-free lookup; open `/attention/:lookupId`; establish foreground authentication; resolve against current relay state; replace the transient resolver URL with the canonical Session or Review URL; fetch that target's current data; then enable actions only after live authority is established. The resolver should show a bounded `Checking current state` barrier so a cold launch never flashes a stale Session or approval before resolution.

Resolution and target loading are separate states. A valid resolution whose target later fails stays on the canonical target with retry and freshness information. A 410 or invalid resolution returns to `/attention?result=stale`, announces `This signal is no longer active`, refreshes the inbox, and offers no action based on the old hint. The cold-launch catch currently opens the Inbox without transferring the stale error into that surface, which makes the failed resolution appear as an unexplained redirect. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:140-165] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:710-785]

### F-021: Define warm and cold return behavior independently from cached content

Warm navigation may preserve ephemeral interface state per route, including Session transcript scroll position, an in-memory draft, Inbox scroll position, and Review focus. It must not persist private draft or transcript content merely to recreate a navigation stack. Cold restoration starts from the canonical URL, reauthenticates, and fetches current relay state; cached content is only a labeled read-only bridge. The current Session already distinguishes stale cache from live authority and disables prompt submission until live reconciliation, which should become the shared detail-entry rule. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:888-1009] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1326-1332] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/spec.md:52-64]

Use this return matrix:

| Entry | Canonical destination | Back or fallback |
|---|---|---|
| Sessions root taps Session | `/session/:sessionId` | Previous Sessions entry |
| Attention root taps Session signal | `/session/:sessionId` with `returnTo=/attention` | Previous Attention entry |
| Attention root taps approval | `/review/:approvalId` with `returnTo=/attention` | Previous Attention entry |
| Session opens its approval | `/review/:approvalId` with Session `returnTo` | Originating Session |
| Cold Session deep link | `/session/:sessionId` after fresh fetch | Sessions root |
| Cold Review deep link | `/review/:approvalId` after fresh fetch | Attention root |
| Cold content-free hint | transient `/attention/:lookupId`, then replace | Root implied by resolved canonical target |
| Stale hint | `/attention?result=stale` | Attention root remains usable |

Do not auto-open the last warm Session when the operator explicitly selects the Sessions root; the root is the overview and recovery point. Preserve per-route position only within the current warm history stack.

## Questions Answered

- Q2 is answered at the information-architecture and route-contract level: Sessions and Attention are persistent roots; Session and Review are contextual, addressable details.
- Every hint must resolve through foreground authentication and current relay state before choosing a destination or enabling an action.
- Warm returns may restore ephemeral view state, while cold returns reconstruct from canonical URL plus fresh authority and use deterministic root fallbacks.
- Browser history, visible Back controls, deep links, and notification entry should all consume the same route state instead of separate booleans.

## Questions Remaining

- Q6: Define foreground notification suppression windows, server-side unread and settled semantics, stale-item retention, badge counts, and preference defaults.
- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error and usage prominence.
- Q4 implementation validation: determine which privacy-safe scope and impact descriptors can be produced without weakening canonical redaction policy.
- Product-coverage caveat: Termius and Vercel or Netlify remain unvalidated as named comparators.

## Ruled Out Directions

- A third persistent Review root was ruled out because Review is a session-bound or attention-bound task detail, not a durable browsing domain.
- Boolean-only overlays and query strings that are written but not parsed were ruled out because they break reload, Back, and cold notification entry.
- Client-side routing directly from notification class was ruled out because only the foreground relay may resolve current target and action state.
- Persisting private view content to recreate cold navigation was ruled out; canonical URLs and fresh relay state are sufficient.
- The Apple navigation page was not used because the fetched result contained no substantive guidance without JavaScript.

## Assessment

- `newInfoRatio`: 0.71
- Novelty justification: Prior work established the two-root direction; this iteration adds the concrete route union, exposes a cold-Review restoration defect, separates resolver and canonical target states, and defines deterministic warm/cold return behavior.
- Confidence: High for current routing defects and attention resolution behavior from primary source. Medium-high for the proposed route contract; physical installed-PWA Back and notification-click testing remains necessary.

## Next Focus

Q6: Specify foreground suppression, server-owned unread and settled state, stale-hint retention, badge derivation, and notification preferences on top of this route and resolution contract.
