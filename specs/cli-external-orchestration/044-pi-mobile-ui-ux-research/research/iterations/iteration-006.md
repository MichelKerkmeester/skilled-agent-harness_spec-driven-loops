# Iteration 6: Privacy-Safe Approval Descriptors

## Focus

Q4 implementation validation: determine which host-produced scope and impact descriptors can accelerate mutation review without weakening canonical redaction or overstating execution effects.

## Actions Taken

1. Re-read the prior Q4 interaction findings and isolated the unresolved implementation claim behind synopsis text such as "creates one file" and "changes 14 lines."
2. Traced the approval action, lease creation, redaction, card DTO, and PWA review rendering from raw host action to displayed canonical arguments.
3. Compared immutable action-derived descriptors with descriptors that depend on mutable filesystem state.
4. Audited the redaction tests and security contract to identify which metadata exists at the relay boundary and which metadata is discarded.

## Findings

### F-019: The current wire contract cannot carry trustworthy scope or impact descriptors

`ApprovalAction.arguments` is deliberately generic `JsonValue`. Lease creation computes the authorization digest from the complete raw action, then stores only `canonicalizeJson(redactJson(action.arguments))` in an in-memory display map. `ApprovalCardDto` exposes the tool and one redacted canonical string, but no typed target cardinality, operation class, redaction count, redaction reasons, preflight state, or impact fields. The PWA therefore cannot reconstruct a reliable "creates one file" or line-change synopsis without parsing presentation text or receiving raw values; both would create a second, weaker disclosure path. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:291-297] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:458-495] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:324-352]

The canonical redactor internally counts redactions and records the reason classes `path`, `secret`, and `private-text` for envelopes, but `redactJson` returns only the transformed value. Approval publication then declares zero envelope-level redactions because its payload is already redacted. Even "3 sensitive values hidden" is unavailable accurately on approval cards today. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/store/redaction.ts:19-44] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:578-605]

### F-020: Use an explicit allowlist of non-content descriptor types

The host can safely produce a small descriptor object before dropping raw values, provided every field is enumerated and no generic key/value metadata is accepted. The minimum useful allowlist is:

- `operationClass`: a server-owned enum such as `edit`, `write`, `process`, or `network`, derived from the admitted tool family rather than user text.
- `targetCount`: a validated integer or bounded bucket such as `1`, `2-9`, or `10+`; use exact small counts only when the tool schema proves target cardinality.
- `targetRelation`: `workspace`, `outside-workspace`, or `unknown`; outside-workspace remains a denial condition, not an approvable badge.
- `targetStateAtReview`: `existing-file`, `missing-target`, `non-file`, or `unknown`, explicitly labeled as an observation unless execution enforces it as a precondition.
- `changeShape`: validated added/removed line counts only for a normalized patch whose application semantics and base-state precondition are known; otherwise omit it.
- `redactionSummary`: count plus reason enums emitted by the same canonical redaction pass, with no original keys, values, path fragments, or offsets.

These fields reveal category and cardinality, not raw path, source, prompt, command, identifier, or secret content. The security policy already forbids raw paths and private action arguments but does not prohibit bounded aggregate metadata; an allowlist is required because arbitrary derived labels can encode the hidden input. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:100-106] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/store/redaction.ts:7-17]

Recommended current-safe copy is therefore modest: "Write request · 1 target · workspace" or "Edit request · 1 existing workspace file at review." It must not include basenames, extensions, directory depth, package names, command fragments, byte sizes, line previews, raw error text, or free-form host labels. Those values are either directly redacted classes or high-bandwidth side channels around the canonical policy.

### F-021: Separate action facts from host-state observations

Tool, admitted family, and schema-validated target cardinality are deterministic action facts. "Existing workspace file" requires path resolution and filesystem inspection. "Creates one file" predicts a future effect from a point-in-time absence check. "Changes 14 lines" requires tool-specific patch semantics and a known base state. These claims can become false between review and execution even when the raw action digest remains unchanged, because the current digest binds action data but not filesystem state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:66-74] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/approval/approval-service.ts:498-514]

Use labels that preserve this distinction:

- Action fact: "Writes 1 target."
- Observation: "At review: target does not exist in workspace."
- Enforced impact: "Creates 1 workspace file" only when lease consumption revalidates a non-existence and containment precondition and rejects or reissues the approval when it changed.
- Enforced change shape: "+14/-3 lines" only when the host computes it from the exact normalized patch and binds the base-state fingerprint or equivalent precondition to the approval lifecycle.

Descriptors should be stored as typed lease/card data with a descriptor schema version. Deterministic action facts must derive from the same validated action used for the digest. Mutable observations need an internal preflight fingerprint and revision invalidation or must remain visibly advisory. The phone must never recompute descriptors from `canonicalArguments`.

### F-022: Redaction metadata should come from one pass, not a second scan

The redactor already has the correct count and reason set while transforming raw arguments. Returning a structured result such as `{ value, metadata }` from that one pass would let the host publish "3 values hidden: path, secret" without retaining or retransmitting raw values. A later scan of placeholder strings is weaker because it can double-count literal placeholder text, lose the distinction between fields and pattern matches, and drift from policy changes. The existing tests prove recursive removal and typed reason collection for envelopes, but approval-card coverage is absent. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/store/redaction.ts:24-44] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/tests/redaction.test.ts:29-59]

Required implementation validation should cover no raw-value leakage in JSON, logs, accessible names, errors, replay, or persistence; descriptor stability across object-key ordering; rejection of unknown descriptor fields; path-containment and symlink cases; stale preflight invalidation; and parity between displayed descriptor, digest-bound action, and final host execution.

## Questions Answered

- Q4 is now answered at the implementation-descriptor level: host-side bounded enums and cardinalities are compatible with canonical redaction; client parsing and free-form derived labels are not.
- "Writes 1 target" can be derived from a typed action schema without revealing raw values. The current generic action schema does not yet prove that cardinality.
- "Existing workspace file" is safe only as a clearly time-qualified host observation unless final execution revalidates it.
- "Creates one file" and exact line deltas are safe as asserted impacts only after typed tool validation plus a digest/revision-bound base-state precondition.
- A redaction count and reason summary can be privacy-safe, but the approval path must preserve metadata from the canonical redaction pass first.

## Questions Remaining

- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error and usage prominence.
- Q6: Define foreground suppression, unread state, stale hints, and notification preference behavior.
- Q4 implementation detail: choose the exact typed descriptor schema and preflight invalidation mechanism during planning; the current `ApprovalAction` and `ApprovalCardDto` contracts do not contain them.
- Accept-edits inclusion and revocation semantics remain a separate contract gap from descriptor safety.
- Product-coverage caveat: Termius and Vercel or Netlify remain unvalidated as named comparators.

## Ruled Out Directions

- Parsing `canonicalArguments` in the PWA to infer file counts, path scope, or line impact: presentation text is not a typed contract and intentionally omits raw evidence.
- Publishing arbitrary host-generated summary strings: a free-form field can leak the values redaction removed.
- Calling a point-in-time filesystem observation an execution effect without a matching final precondition.
- Counting placeholder strings in a second pass to recover redaction metadata.
- Showing basename, extension, command fragments, byte counts, line previews, or raw host errors as supposedly safe context.

## Assessment

- `newInfoRatio`: 0.68
- Novelty justification: prior Q4 work proposed synopsis descriptors; this iteration establishes the current contract gap, a bounded safe descriptor vocabulary, the action-fact versus mutable-observation distinction, and the preconditions required before predictive impact wording is truthful.
- Confidence: high for the current contract and redaction-flow findings from source; medium-high for the proposed allowlist pending tool-specific argument schemas and live filesystem race validation.

## Next Focus

Q3 implementation validation: inspect the typed transcript projector and current mobile renderer to define block hierarchy, live-edge behavior, collapse defaults, and error/usage prominence without exposing redacted content.
