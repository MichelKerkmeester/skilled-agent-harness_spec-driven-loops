# Iteration 007 — Content-free attention push

## Question

How can a phone know that a Pi session needs attention without putting project, tool, path, decision, or transcript content into a notification?

## Evidence

Claude Remote Control pushes when a long task finishes or a decision is needed, but documents only a broad on/off policy ([docs](https://code.claude.com/docs/en/remote-control)). The Web Push service worker receives arbitrary data and can open a URL on click ([MDN PushEvent data](https://developer.mozilla.org/en-US/docs/Web/API/PushEvent/data)); MDN recommends timely, permissioned, opt-out notifications and warns against noisy engagement ([best practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)). 041 already requires generic push hints and authenticated fetch-on-open at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md.

## Findings

The contradiction dissolves when push is defined as a lossy wake-up signal, not a transport for the decision:

~~~json
{"kind":"attention.changed","sessionId":"ses_opaque","epoch":8,"seq":701,"payload":{"attentionId":"att_opaque","class":"needs_input","state":"open","generation":3,"resourceRef":"apr_opaque","expiresAt":"2026-08-12T14:00:00Z"}}
{"push":{"v":1,"kind":"attention","attentionId":"att_opaque","sessionRef":"ses_opaque","class":"needs_input","generation":3,"hintNonce":"nonce_opaque","route":"/s/ses_opaque/a/att_opaque"}}
~~~

Allowed classes are bounded to needs_input, finished, and error. The OS-visible title/body is generic: “Pi session needs your attention,” “Pi session finished,” or “Pi session encountered an error.” It contains no session title, project, path, tool, arguments, prompt, diff, error text, approval choice, digest, or result.

On click, the PWA authenticates over the tailnet and pulls the authoritative attention record using opaque IDs and a one-time nonce. The server returns current state or expired/cleared; it may return a redacted approval card only after authorization. A duplicate push collapses by attentionId/generation. A stale notification opens the session list with a “no longer current” banner, never a later decision.

The PWA shows an attention inbox with class, age, and generic state before the fetch, then deep-links to the fetched approval/result. If push is unavailable, the same inbox works through reconnect and polling while the app is open. This exceeds Claude's broad push decision by making payload policy, bounded classes, deduplication, and fetch semantics explicit and testable.

## Security mechanism

Store only opaque references and a random hint nonce in the push payload. Bind the fetch to device capability, session authorization, nonce, and current epoch. Treat push delivery as unauthenticated and replayable; never accept it as a command or state transition.

## Assessment

New information ratio: 0.93. Q3 is resolved at the contract level: content-free push remains useful because authenticated pull carries the decision after wake-up.
