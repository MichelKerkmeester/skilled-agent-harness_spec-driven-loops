# Review Iteration 001

## Dimension

Correctness: delivery confirmation and first-delivery state transitions.

## Files Reviewed

- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:149-169`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:214-263`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:485-515`
- `.opencode/plugins/mk-skill-advisor.js:640-653,952-961`
- Phase 001 `spec.md:103-114`
- Phase 003 `spec.md:99-113`

## Findings by Severity

### P1

- **F001 — Delivery state is marked confirmed from session identity alone.** The Claude adapter sets `deliveryConfirmed` from a present, non-ambiguous session ID, and the OpenCode observer defaults the same signal to `true`; `render.ts` then records delivery even when no host receipt is observed. That can seed `DELIVERED` and contaminate future route-only activation evidence. Phase 001 explicitly keeps configured-but-unobserved lanes distinct from observed lanes.
- **F002 — OpenCode identity keys collide when an identity component contains U+001F.** `normalizeIdentityPart` accepts the separator, while `identityKey` joins session, message, and ordinal with that same separator. A read-only Node probe produced equal keys for two distinct `(sessionId,messageId,ordinal)` tuples, so the dedup flag could suppress a distinct message.

### P2

- None in this pass.

## Typed Claim Adjudication

```json
{"findingId":"F001","claim":"The Claude adapter and OpenCode observer can mark shadow delivery confirmed without a host receipt or pinned behavioral probe, so the state machine can seed DELIVERED from identity presence alone.","evidenceRefs":[".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:153-168",".opencode/plugins/mk-skill-advisor.js:640-653",".opencode/plugins/mk-skill-advisor.js:952-961",".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:229-240",".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:485-510"],"counterevidenceSought":"Read the delivery-state producer and consumer paths, searched for host receipt call sites, and checked policy-plan negative controls; the controls explicitly pass deliveryConfirmed=true and do not cover configured or unobserved adapter lanes.","alternativeExplanation":"A runtime session ID might be intended as a pinned behavioral probe, but neither adapter labels it as a probe and Phase 001 requires configured and observed delivery lanes to remain distinct.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if every production adapter supplies hostReceiptStatus configured/observed or an explicitly named pinned behavioral probe before recordDelivery.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Direct producer-consumer trace and Phase 001 REQ-006"}]}
```

```json
{"findingId":"F002","claim":"OpenCode dedup identity keys collide when an accepted identity component contains the U+001F join separator, allowing distinct messages to share delivery state.","evidenceRefs":[".opencode/plugins/lib/opencode-message-identity.js:22",".opencode/plugins/lib/opencode-message-identity.js:37-45",".opencode/plugins/lib/opencode-message-identity.js:149-164",".opencode/plugins/lib/opencode-message-identity.js:205-207",".opencode/specs/hooks/002-injection-bloat-reduction/003-opencode-transform-dedup/spec.md:103-106"],"counterevidenceSought":"Ran a read-only Node probe with separator-bearing sessionId and messageId values and searched the identity tests for delimiter adversarial cases; the probe returned equal keys and no such negative control was present.","alternativeExplanation":"OpenCode may guarantee IDs never contain U+001F, but the resolver accepts arbitrary strings and does not enforce or encode that boundary, so the invariant is not protected at this API.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if the resolver rejects/escapes the separator and a regression test proves distinct separator-bearing identities cannot collide.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Executable collision probe plus Phase 003 REQ-002"}]}
```

## Traceability Checks

- `spec_code`: partial — F001 conflicts with Phase 001 REQ-006 and F002 conflicts with Phase 003 REQ-002.
- `checklist_evidence`: partial — existing tests cover positive confirmation and ordinary distinct messages, not the unobserved adapter lane or separator collision.
- `agent_cross_runtime`: partial — the OpenCode and Claude producers use different confirmation defaults.

## Next Dimension

Security: hostile identity and receipt inputs, then Gate-3 state boundaries.

Review verdict: CONDITIONAL
