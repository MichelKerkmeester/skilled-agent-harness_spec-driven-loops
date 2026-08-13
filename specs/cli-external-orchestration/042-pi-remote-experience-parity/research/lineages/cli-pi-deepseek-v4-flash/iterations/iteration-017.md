# Iteration 17: Adversarial Pass — Races, Expiry, Replay, TOCTOU

## Focus
Stress-test the design's concurrency and edge behavior: multi-device decisions, lease expiry vs decision races, TOCTOU between display and execution, replay/duplicates, and offline queues. Prior art: fencing tokens (Kleppmann), CAS-vs-LWW ledger rules, approval-timeout UX guidance.

## Findings

### F1. Fencing tokens: lease for liveness, fence for ownership
- A lease only proves liveness; ownership must be settled by an atomic conditional write with a monotonic **fencing token**; stale holders (paused past expiry) must be rejected permanently by fence comparison, not client-side timestamps; renewal must assert owner+lease+fence; ambiguous responses → stop side effects, reacquire ([SOURCE: martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html], [SOURCE: etcd.io/docs/v3.6/learning/api/]).
- Implication: 006's "first valid authorized responder settles via CAS" is exactly the fencing pattern; the design must add: lease carries the epoch as fence, decision records carry the fence, settlement compares `fence >= current` atomically, and a stale decision (fence < current) is rejected forever.

### F2. CAS vs LWW vs ledger
- CAS detects lost updates and forces re-read/reconcile; LWW silently loses updates — never for workflow transitions; a mutation ledger appends immutable idempotent events (`mutation_id`, expected version) and projects state ([SOURCE: docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_ImplementingVersionControl.html]).
- Implication: lease settlement is CAS-only, recorded in the 003 ledger with the clientMutationId idempotency key; "0 rows updated" is a first-class outcome, not an error.

### F3. Approval-timeout UX (reference-aligned)
- Recommended pattern: visible countdown, expiry → "Approval timed out — no action taken", details preserved for retry/review; **never implicit approval**; auto-mode is an explicit opt-in, not a timeout behavior ([SOURCE: claude.com/blog/auto-mode], [SOURCE: support.claude.com/en/articles/14554922-claude-code-user-faq]).
- Implication: iteration 4's expiry design matches the emerging standard, with the Pi upgrade that expiry is lease-recorded and epoch-invalidating.

## Design: adversarial edge-case resolutions

| Edge case | Resolution |
|---|---|
| Two devices approve same lease simultaneously | 006 CAS: first valid decision settles; losers get `approval.decided {decidedBy}` — displayed as "already decided by <device>", not an error (iteration 4). Ledger write is atomic conditional; no LWW anywhere. |
| Decision arrives after expiry | Fence comparison: `fence < current` or expired → rejected; recorded as `approval.expired` with reason; host timeout policy already applied (never auto-approve). |
| Decision races expiry exactly at the boundary | Single atomic conditional write in the ledger (SQLite transaction): expiry check + settlement in one statement; "0 rows updated" → surface the committed outcome. |
| TOCTOU: args change between display and execution | 006 recomputes the canonical digest at the final boundary; mismatch → deny + `approval.invalidated`; UI flips card to "action changed — needs re-review" (iteration 4). |
| Replay/duplicate attention or decision | Idempotency keys everywhere: `attentionId` dedupes attention events; `clientMutationId` dedupes mutations (003 ledger); duplicate delivery is a no-op replay, never a second settlement. |
| Device offline when attention raised | Attention record persists; PWA fetches on reconnect (007 fetch-on-open; iteration 14 three-path SW handling). **Offline devices can display, never decide**: decisions require live lease validation — no local authority cache. |
| Grant renewal during unattended run | No silent renewal: grants expire per window and the run parks (axis 6); renewal is always a fresh policy decision. |
| Relay crash mid-settlement | Ledger transactionality (003 crash-safety): outcome is recorded or indeterminate — never guessed; replay reconciles on restart; sessions park with error attention. |

## Sources Consulted
- [SOURCE: https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html]
- [SOURCE: https://etcd.io/docs/v3.6/learning/api/]
- [SOURCE: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_ImplementingVersionControl.html]
- [SOURCE: https://claude.com/blog/auto-mode]
- [SOURCE: https://support.claude.com/en/articles/14554922-claude-code-user-faq]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md]

## Assessment
- newInfoRatio: 0.45
- Novelty justification: the fence/expiry/CAS edge table and "offline displays, never decides" rule are new consolidations; fencing and ledger rules are cited prior art.
- Confidence: high; resolutions map onto existing 003/006 contracts without contract changes.

## Reflection
- What worked: mapping Kleppmann's fencing to the 006 epoch/lease — the 041 architecture already chose the right pattern; the design only needed to make the outcomes user-visible.
- What failed / ruled out: LWW for any settlement; offline decision authority; silent grant renewal.
- Ruled out: auto-approve on expiry (matches F3 standard).

## Recommended Next Focus
Gap check pass: audit all 8 axes for under-covered corners before synthesis — fill the weakest axis (likely: token/cost vocabulary depth and transcript search/navigation UX).
