# Iteration 16: Depth Pass — Session Catalog Redaction, Retention, Offline Cache

## Focus
Pin the exact metadata surface of the session catalog, the retention tiers, and the offline read-only cache policy (005) with platform-accurate storage rules. Prior art: WebKit ITP storage rules, IndexedDB AES-GCM guidance, OWASP logging vocabulary.

## Findings

### F1. WebKit storage reality for Home Screen web apps
- ITP's 7-day cap on script-writable storage applies to Safari browsing; **Home Screen web apps have their own "days of use" counter** and are exempt from the 7-day cap when actually used ([SOURCE: webkit.org/tracking-prevention/], [SOURCE: webkit.org/blog/11338/cname-cloaking-and-bounce-tracking-defense/]). Historic bug: some iOS versions deleted SW+storage after 7 days even for HS apps (WebKit bug 232302) — treat storage as evictable regardless ([SOURCE: bugs.webkit.org/show_bug.cgi?id=232302]).

### F2. IndexedDB encryption: AES-GCM is sound, the key is everything
- Store only ciphertext in IndexedDB; AES-GCM with a fresh random 12-byte IV per record and authenticated metadata; decrypt fails on any tamper ([SOURCE: w3.org/TR/IndexedDB/], [SOURCE: nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-38d.pdf]).
- Key management: a persisted key is meaningless; derive/unwrap the key after unlock from a non-persisted user secret; keep in memory; clear on logout/inactivity. WebCrypto cannot defend against same-origin script (XSS) — strict CSP is mandatory ([SOURCE: w3.org/TR/2025/WD-WebCryptoAPI-20250422/], [SOURCE: cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html]).

### F3. OWASP logging vocabulary: events, not secrets
- Log lifecycle events with timestamps/outcome/coarse correlation id; never raw session ids, tokens, or bodies; pseudonymous rotated identifiers; document purpose per field; tiered retention by class with periodic secure deletion; encrypt at rest; append-only where possible ([SOURCE: cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html], [SOURCE: cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html]).

## Design: catalog + retention + offline cache

### Session catalog row (server-side, complete field list)
`{sessionOpaqueId, workspaceOpaqueId, status, model, startedAt, lastActiveAt, epochFloor, pendingApprovals, capacityHint}` — nothing else exists server-side. Labels are device-local (axis 5); transcript content lives only in epoch envelopes; the API boundary (004 read-only list) enforces the field list by construction.

### Retention tiers
| Tier | Data | Policy |
|---|---|---|
| Replay envelopes | epoch/seq transcript | Retention floor per 003 config, then snapshot + prune (never silent blending — 005 barrier) |
| Mutation ledger | clientMutationId/digest/outcome | Append-only, metadata-only (006), audit-duration retention |
| Approval/attention metadata | leaseId/digest/class/decidedBy | Metadata-only; short audit window; raw args never enter (006 REQ-006) |
| PWA caches | labels, attention cache, offline transcript | Device-side; bounded size; evictable (ITP reality — never source of truth) |

### Offline read-only cache (005 hardening)
- Contents: redacted transcript projection + session labels + attention records, all classified by 001 redaction classes.
- Encryption: AES-GCM, fresh 12-byte IV per record, `record:${id}:v1` AAD; key derived post-biometric-unlock from a non-persisted secret (or unwrapped per app session), memory-only, cleared on logout/inactivity (F2).
- Staleness: every cached record carries `epochFloor` + fetchedAt; UI shows "cached <time>" and revalidates on connect; retention-miss paths force snapshot barrier (005 REQ-002).
- XSS posture: strict CSP, no inline scripts, dependency control — encryption is defense-in-depth, CSP is the control (F2).

## Sources Consulted
- [SOURCE: https://webkit.org/tracking-prevention/]
- [SOURCE: https://webkit.org/blog/11338/cname-cloaking-and-bounce-tracking-defense/]
- [SOURCE: https://bugs.webkit.org/show_bug.cgi?id=232302]
- [SOURCE: https://www.w3.org/TR/IndexedDB/]
- [SOURCE: https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-38d.pdf]
- [SOURCE: https://www.w3.org/TR/2025/WD-WebCryptoAPI-20250422/]
- [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html]
- [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html]

## Assessment
- newInfoRatio: 0.45
- Novelty justification: complete catalog field list, retention tier table, and AES-GCM cache spec with memory-only key discipline are new consolidations; platform facts are citations.
- Confidence: high; all mechanics documented.

## Reflection
- What worked: separating "what the server may know" (field list) from "what the device caches" (encrypted, evictable) — each side's obligation is now explicit.
- What failed / ruled out: persisting cache keys (meaningless encryption); treating IndexedDB as durable truth (ITP eviction history); raw args in any durable log (006).
- Ruled out: server-side session labels in any form.

## Recommended Next Focus
Adversarial pass: race conditions and edge cases across the design — multi-device decisions, lease expiry UX, replay, TOCTOU, offline approval queue.
