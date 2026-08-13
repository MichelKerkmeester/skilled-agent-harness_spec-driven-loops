# Iteration 014 — PWA information architecture and accessibility

## Question

What PWA shape turns a protocol-rich relay into a calm, fast remote-control experience rather than a terminal squeezed onto a phone?

## Evidence

Cursor documents PWA installation as a native-feeling web/mobile surface ([Web and Mobile](https://docs.cursor.com/en/background-agent/web-and-mobile)). WCAG 2.2 adds target-size and focus-appearance guidance ([W3C](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)). MDN documents PWA service-worker/offline/background constraints ([offline/background](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)). 041 defines a PWA session view, reconnect, and offline read-only behavior.

## Findings

The relay needs a small capability event so the PWA can choose safe surfaces:

~~~json
{"kind":"client.capabilities.snapshot","sessionId":"ses_opaque","epoch":8,"seq":730,"payload":{"eventSchema":1,"features":{"richTranscript":true,"diffs":true,"approval":true,"policyGrant":true,"pushAttention":true,"offlineReadOnly":true},"limits":{"maxVisibleDiffBytes":64000,"maxOutputTailBytes":12000,"maxSessionsPerView":50},"redactionPolicyVersion":"r1"}}
~~~

Use three primary surfaces: Home (opaque session catalog plus attention inbox), Session (plan rail, transcript cards, tools, diffs, usage, connection/epoch status), and Review (approval/policy sheet with exact scope and submitted/verifying state). A bottom navigation or browser back stack keeps the phone one gesture away from Home; deep links land in Review only after authenticated pull.

Render streaming text in a single aria-live region with coarse block announcements, not every delta. Give every approval and diff action a large target, visible focus ring, keyboard path, color-independent status, reduced-motion mode, and restoration of focus after a drawer closes. Use virtualized lists and event coalescing for long sessions. Offline banners say read-only and show last synced time; no cached push body exists.

The superiority proof is task-time plus comprehension: a user can reach a pending approval from Home in two gestures, identify exact scope without reading a terminal, and recover after a dropped network without duplicated cards. Accessibility automation checks focus, target size, screen-reader status, and reduced motion.

## Prior-art comparison

Cursor proves a PWA can feel native; Claude proves cross-surface session continuation. The proposed information architecture makes replay, redaction, attention class, and authority state first-class instead of hidden transport details.

## Assessment

New information ratio: 0.81. Q10 gains a concrete mobile IA and accessibility proof; threat and prior-art synthesis remain.
