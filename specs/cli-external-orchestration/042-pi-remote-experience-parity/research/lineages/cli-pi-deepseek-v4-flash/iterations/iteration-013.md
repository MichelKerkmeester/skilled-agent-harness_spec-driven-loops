# Iteration 13: Verification Pass — Reference Freshness + Notification Mechanics

## Focus
Confirm iteration-1 claims about Claude Code Remote Control against the current (Aug 2026) docs, check whether session/conversation naming exists anywhere in the Claude ecosystem, and validate the notification tag strategy with Web Push semantics.

## Findings

### F1. Remote Control is a research preview — with two notification toggles and no per-event config
- As of 2026-08-12 the reference product is still labeled **research preview**; Pro/Max/Team/Enterprise only; Team/Enterprise admin toggle ([SOURCE: code.claude.com/docs/en/remote-control]).
- Notification control is coarse: OS permission prompt + two `/config` toggles — "proactive pushes when Claude decides" and "pushes for permission prompts/questions". **No per-event notification configuration** ([SOURCE: code.claude.com/docs/en/remote-control]).
- Remote approval modes are Manual / Accept edits / Plan only — Auto and Bypass are not exposed to the remote app ([SOURCE: code.claude.com/docs/en/permission-modes]); a known bug (issue #29214) shows prompts even with `--dangerously-skip-permissions` on WSL.
- Implication: the reference's notification surface is binary (two toggles); the Pi design's bounded attention classes (axis 3) with per-class and per-session granularity is strictly finer-grained. Research-preview status also means the "exceed" bar is a moving target — the design should be versioned against the reference's *documented* surface, not its bugs.

### F2. Naming exists in the chat app but not the Code session list
- The Claude mobile app supports deleting/renaming **conversations** (support article 8230524) and managing active sessions ([SOURCE: support.claude.com/en/articles/8230524...], [SOURCE: support.claude.com/en/articles/13124001-managing-your-active-sessions]).
- Claude Code itself remains resume-by-id with no documented session naming (iteration 7 confirmed).
- Implication: chat-conversation rename is consumer-ecosystem UX; the *code session* naming layer stays unclaimed — axis 5's client-local label map remains the differentiator.

### F3. Web Push tag semantics validate the axis-3 coalescing design
- `tag` is a slot key: same tag replaces the current notification; replacement is silent unless `renotify: true` (which requires a non-empty tag); use stable per-entity tags (`order:${id}`, `chat:${threadId}`); avoid one global tag; aggregate meaningful counts via `getNotifications()` + notification `data` ([SOURCE: web.dev/articles/push-notifications-notification-behaviour], [SOURCE: web.dev/articles/push-notifications-common-notification-patterns]).
- Implication: the iteration-5 tag strategy (`tag = ${sessionOpaqueId}:${class}`) maps exactly onto documented semantics: stable slot per (session, class); `renotify: true` only on class *transitions* (new needs_input or error), `false` for status refreshes (still-waiting updates); body aggregates `pendingCount` from local cache when available.

## Design deltas from verification
1. Attention granularity: expose per-class notification preferences (needs_input/finished/error independently toggleable) — strictly finer than the reference's two toggles, and consistent with 007's preference storage.
2. Tag discipline: `tag: "${s}:${c}"`, renotify only on transition; count aggregation in body; documented as replacement semantics, not OS grouping guarantees (MDN caveat).
3. Versioning: the parity claim must be dated ("as of reference docs 2026-08-12") since the reference is a research preview.

## Sources Consulted
- [SOURCE: https://code.claude.com/docs/en/remote-control]
- [SOURCE: https://code.claude.com/docs/en/permission-modes]
- [SOURCE: https://github.com/anthropics/claude-code/issues/29214]
- [SOURCE: https://support.claude.com/en/articles/8230524-comment-puis-je-supprimer-ou-renommer-une-conversation]
- [SOURCE: https://support.claude.com/en/articles/13124001-managing-your-active-sessions]
- [SOURCE: https://web.dev/articles/push-notifications-notification-behaviour]
- [SOURCE: https://web.dev/articles/push-notifications-common-notification-patterns]

## Assessment
- newInfoRatio: 0.50
- Novelty justification: research-preview status, two-toggle notification surface, conversation-rename distinction, and tag-semantics validation are new; design deltas are small but load-bearing.
- Confidence: high; all facts are current vendor/standard docs.

## Reflection
- What worked: freshness check against the live docs — the reference is explicitly a research preview, which strengthens the "exceed now" case.
- What failed / ruled out: nothing ruled out; iteration-1 claims held (v2.1.x requirements, QR pairing, approval prompts, dialog expiry).
- Ruled out: per-event notification config in the reference (doesn't exist — our per-class model is the upgrade).

## Recommended Next Focus
Depth pass: iOS vs Android PWA notification/background constraints audit — harden the axis-3/6 design per-platform (007 platform rows).
