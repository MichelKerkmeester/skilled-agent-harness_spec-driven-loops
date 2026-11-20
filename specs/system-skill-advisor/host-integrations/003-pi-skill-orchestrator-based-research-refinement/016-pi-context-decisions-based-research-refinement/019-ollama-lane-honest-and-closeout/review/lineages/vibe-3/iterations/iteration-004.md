# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-006 (follow-up fixes and answer routing), dimension `security`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by testing whether the routing vocabulary change opens a hole and whether the 227 committed answer rows carry a credential, a private path or a session identifier that grants access.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git diff 2f5fe41bb9e~1 aaaff7dd9df`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/skills/sk-doc/hub-router.json:240-260`, `routerPolicy.defaultMode`, `routerPolicy.tieBreak`
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md:28`
- `specs/**/decision-record.md` (73 files, 227 added answer rows)
- `.skilled/skills/system-spec-kit/runtime/dist/lib/continuity/decision-record-writer.js:400-401`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass -- the router vocabulary and the mode trigger line agree after 571575632a4, and the router's `defaultMode` is `null`, so an unmatched request produces no mode rather than a wrong one.
- `checklist_evidence` -- partial -- the security-relevant part of D3 (no personal data, no credential) was checked against every added line; the remaining criteria stay partial.

## Integration Evidence

- `.skilled/skills/sk-doc/hub-router.json` `routerPolicy.defaultMode` -- `null`, so removing the bare phrase cannot silently route a security-policy request into a mutating mode; the request simply matches no mode.
- `specs/**/decision-record.md` -- a scan of every added line for `sk-`, `ghp_`, `AKIA` and 40-plus-character hex runs returned only the all-zeros fingerprint placeholder, which is written by the decision-record writer itself (`decision-record-writer.js:401`).
- `.skilled/skills/system-spec-kit/runtime/dist/lib/continuity/decision-record-writer.js:400-401` -- the zero fingerprint is the writer's own constant, so it is a marker rather than a leaked digest.

## Edge Cases

- The decision records embed `<!-- source: claude:<session-uuid>:toolu_...:N -->` provenance markers. A session UUID names a local transcript file; it grants no access on its own. Recorded as an accepted provenance cost, not a finding.
- One recorded answer states that `LLMGATEWAY_API_KEY` exists in the operator's shell without quoting its value. The disclosure is the existence of a variable, not a credential. Recorded as an accepted edge case.
- The zero fingerprint appears in 54 of the 73 records. It is the writer's constant, so it cannot distinguish sessions; whether the resume ladder treats it as a real fingerprint is a traceability question and is carried to that dimension.

## Confirmed-Clean Surfaces

- No credential, private path or email address appears in the 227 added answer rows.
- The routing change cannot fall through into a mutating mode, because the router declares no default mode.
- The compiled manifest re-mint touches only the policy hash and the generation, not the serving authority.

## Ruled Out

- "The routing change opens a hole into a mutating mode": ruled out -- `defaultMode` is `null`.
- "A committed answer leaks a credential": ruled out -- the only secret-shaped string is the writer's zero fingerprint.
- "A committed answer leaks a private path": ruled out -- no home-directory path appears in the added lines.

## Next Focus

- Dimension: traceability
- Focus area: frontier node F-1-006, traceability pass over the D3 answer claim and the packet's acceptance criteria
- Reason: security is complete for this node; the remaining risk is a claim that outruns the committed record
- Rotation status: F-1-006 has 2 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- the secret scan and the default-mode check each closed a candidate
- Required evidence: the packet's acceptance criteria against the committed records, and the zero-fingerprint question
- Recovery note: none

Review verdict: PASS
