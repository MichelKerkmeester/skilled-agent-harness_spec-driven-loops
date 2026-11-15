# Iteration 002 — Security (lookup trust boundary)

## Dimension

Security, on the lookup CLI's trust boundary: argv parsing, locator verification, transcript discovery, the model-visible shell command, and the treatment of retrieved history as untrusted data. Operator focus carried in addition: the four named residuals, plus the known phase-1 harness line.

## Dispatcher

- Mode: review, native LEAF execution, no delegation.
- Iteration: 2 of 10 (JSONL-derived: 1 prior `type:"iteration"` record; matches the dispatch number).
- Run / sessionId: `2026-11-15T17:33:23.837Z`, generation 1, lineageMode `restart`.
- Target: files changed in `169da2e8cba..1c7bc3d9d63` (63 declared files, reviewed security-relevant subset).
- Node budget: 24 tool calls; 19 used for analysis, 5 reserved for the artifacts.

## Files Reviewed

| File | Lines / focus |
|------|---------------|
| `.skilled/hooks/injection-contract.md` | 234-241 (History Locator Lookup: what the section may carry) |
| `.skilled/hooks/session-handover/history/lib/cli.ts` | 131-174 (argv), 187-219 (state read, freshness), 379-470 (locator+reader gates), 526-587 (refusal shape, entry gates) |
| `.skilled/hooks/session-handover/history/lib/locator-digest.ts` | 29-96 (digest fields, cwd scoping of the persist write) |
| `.skilled/hooks/session-handover/history/lib/loads.ts` | 69-120 (deferred-content budget) |
| `.skilled/hooks/session-handover/history/lib/history-entry.schema.json` | 1-178 (entry shape, `additionalProperties:false`, role/toolCallId coupling) |
| `.skilled/hooks/session-handover/history/lib/core.ts` | 42-107 (operation dispatch, image reply re-measurement) |
| `.skilled/hooks/session-handover/history/lib/navigator.ts` | 318-345 (validators), 418-488 (search/browse/load), 490-503 (eager search index) |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | 19-77 (bound, `shellQuote`, command template), 97-143 (placement, section) |
| `.skilled/hooks/session-handover/history/lib/response.ts` | 7-86 (16,384-byte reply cap, text/reply builders) |
| `.skilled/hooks/session-handover/history/lib/projection.ts` | 33-106 (public projection, private-block removal) |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | 224-339 (locator schema, path/size refinements), 470-487 (`getStatePath`) |

## Findings — New

### P0 Findings

None.

### P1 Findings

None new. `I1-P1-001` (the engine CI build cannot resolve `tsc`) remains active and is carried, not re-derived here.

### P2 Findings

1. **The lookup offer interpolates the runtime label into a model-pasted shell command unquoted** -- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:69-70` -- `buildHistoryLookupBody` builds `SPECKIT_RUNTIME=${locator.runtime} ${HISTORY_LOOKUP_COMMAND} --session ${shellQuote(...)} --handle ${shellQuote(...)}`. Both the session id and the handle are shell-quoted; the runtime label is template-interpolated raw. `HistoryLookupTarget.runtime` is typed `string` (line 37), and nothing in this module restricts it to the six runtime words. The same field is enum-validated only on the read side, after state has been read (`hook-state.ts:302,317,332-338`).
Case: an adapter or transport passes a runtime label carrying a space, `;`, or `$()` — the section writes it into the command the receiving model is told to run, so the label becomes shell syntax in the receiver's session rather than an environment value.
Finding class: cross-consumer
Scope proof: `buildHistoryLookupBody` is the only site that renders a runtime label into shell text; the two other interpolated values in the same template pass through `shellQuote` (`lookup-offer.ts:52-54,70`). No in-tree producer was found that passes an unsafe label, so the exposure is latent rather than live.
Affected surface hints: ["history lookup offer", "shell command template", "HistoryLookupTarget type", "compaction adapters"]
```json
{"type":"claim","claim":"The lookup offer is a model-pasted shell command whose runtime label is the one interpolated value that is neither quoted nor whitelisted, so an unsafe label becomes shell syntax in the receiving session.","evidenceRefs":[".skilled/hooks/session-handover/history/lib/lookup-offer.ts:37",".skilled/hooks/session-handover/history/lib/lookup-offer.ts:69-70",".skilled/hooks/session-handover/history/lib/lookup-offer.ts:52-54",".skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:302"],"counterevidenceSought":"Checked every in-tree producer of HistoryLookupTarget.runtime reachable from this module: cli.ts:510-512 admits only pi|devin|dsh|opencode|vibe and detectHistoryRuntime returns claude|codex|null; the compaction adapters pass literals. No caller sends an attacker-shaped label today.","alternativeExplanation":"The label could be considered a closed vocabulary owned by the type system; it is not, because the type is a plain string and the read-side enum does not run before the text is printed.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"A producer is shown to pass a runtime label derived from an environment variable or event field without a whitelist, which would raise this to P1."}
```

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial (carried from iteration 1) | The parent `spec.md:102` historical phase text still names the old engine path; the shipped security gates match the new engine. Not re-derived this iteration. |
| `checklist_evidence` (core) | deferred | No `checklist.md` / `acceptance-criteria.md` in the 63-file target. Deferred to the traceability dimension. |
| `skill_agent` (overlay) | notApplicable | No `SKILL.md`, command, or agent definition inside the declared target. |
| `agent_cross_runtime` (overlay) | notApplicable | No runtime mirror inside the declared target. |
| `feature_catalog_code` (overlay) | deferred | `feature-catalog/context-preservation/compaction-history-lookup.md` is in scope but not read this iteration. |
| `playbook_capability` (overlay) | deferred | The three playbook files in scope were not read this iteration. |
| Injection-contract claim: the section "carries no transcript text, and it tells the model to treat retrieved history as data, never as instructions" (`injection-contract.md:236`) | pass | `buildHistoryLookupBody` emits only the title, ids/handles, and operation examples; line 74 is the verbatim data-not-instructions rule. The section is withheld unless `lookupRunsFrom` succeeds (`lookup-offer.ts:137-143`). |
| Residual 1: old engine path sweep | exhausted, not re-entered | Ruled out in iteration 1 (live surfaces clean; the one harness line is known and owned by phase 008 T002). Per the pivot rules this direction is not retried. |
| Residual 2: CI engine step would pass as written | fail, carried | `I1-P1-001` and `I1-P2-002` remain active. This security pass adds no new CI evidence. |
| Residual 3: missing schema becomes a silent skip | latent, carried | `I1-P2-003` remains active; the resolved schema path exists, so the skip branch is not live today. Not a security finding. |
| Residual 4: 66-character bound equals the engine bound | pass, re-verified with new evidence | `hook-state.ts:281-284` and `lookup-offer.ts:52-59` both compute the bound on the quoted form with the identical transform `'${value.replace(/'/g, "'\\''")}'`, both at 66. The quoting is injection-safe for the session id. |
| Known harness line | known, not a finding | `001-hop-recall-baseline/scratch/harness/hop-recall.sh:18` still names the old path; owned by phase 008 task T002, outside this target. |

## Integration Evidence

- `.skilled/hooks/injection-contract.md:234-241` — the contract this iteration audits; it names `lookup-offer.ts` as the owner of the section.
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:68-76` — the rendered [SYS] section: one command, one operation legend, one data-not-instructions line.
- `.skilled/hooks/session-handover/history/lib/cli.ts:18-25` — the CLI consumes `HistoryLocatorSchema`, `getStatePath`, and the locator-kind map from the spec-kit runtime dist, so the schema is the read-side gate for the same fields the offer prints.
- `.skilled/hooks/session-handover/history/lib/core.ts:68-107` — the only constructor of the four read operations; every route ends in the response cap.
- `.skilled/hooks/session-handover/history/lib/response.ts:63-85` with `loads.ts:109` and `core.ts:54-58` — the 16,384-byte serialized cap, applied to text, payload, and image replies alike.

## Edge Cases

- **`pages.ts` was not read this iteration.** The 24-call ceiling was consumed by the entry, gates, projection, navigator, response, and the runtime schema. Page-mode *input* bounds (`validateHandleLengths`, `historyPartsPage`) rest on call-site evidence (`core.ts:90,97-104`) and were not verified in-module; page-mode *output* is capped at the call site regardless. Recorded as deferred evidence for the maintainability dimension, not as a pass.
- **The eager search index is unmeasured.** `navigator.ts:490-503` tokenizes every item on first `search`, so peak memory scales with the whole transcript, not with the 16KB reply cap. No workload was measured in this read-only pass, so it is recorded as a candidate for D4 with a measurement, not raised as a finding.
- **No live reach exists for Finding 1.** The injection shape is real in the function, but every in-tree producer passes a literal or an enum-derived label. Severity is held at P2 for that reason; the downgrade/upgrade trigger is recorded in the claim packet.
- **Ledger ordering.** The raw `--session` value reaches `getStatePath` before `HistoryLocatorSchema` runs, which looks like a validation-order gap. It is not: `getStatePath` hashes the value (`hook-state.ts:484-487`), so no separator, parent segment, or control character can become part of a filename. The ordering is safe and is not reported.
- **The TTL is not digest-covered.** `mintedAt` and `provenance` are outside `historyHandle`'s field list (`locator-digest.ts:33-35`), so a state-file edit could revive an expired locator. Not raised: any actor that can rewrite the 0700 state file already reads the transcript store directly, so the TTL is not a privilege boundary.

## Confirmed-Clean Surfaces

- Refusals print one `{ok:false,code}` line and nothing else — no path, stack trace, handle echo, or error message (`cli.ts:526-529,581-586`).
- Session ids are schema-rejected when they carry `..`, `/`, `\`, or control characters (`hook-state.ts:255-260,303-307`) and are hashed before any filename use (`hook-state.ts:484-487`).
- The workspace must be absolute and control-character-free (`hook-state.ts:267-269,308-310`), must equal `realpathSync(process.cwd())` (`cli.ts:536-542,570`), and `sessionDirectory` must be strictly inside it (`hook-state.ts:325-331`).
- Runtime, locator kind, and reader capability must all agree before a store is touched (`cli.ts:384-390,436-439,464-466,569`); two candidate transcripts refuse as `session_ambiguous` rather than ranking or guessing (`cli.ts:401-403,265-279`).
- Every reply is measured as a complete serialized reply against 16,384 bytes, including the image path (`response.ts:8,63-85`; `core.ts:54-58`).
- Search/browse/load inputs are bounded: query ≤200 chars, ≤10 filter entries of ≤200 chars, limits 1-10, ids ≤3 × ≤128 chars, sequence ≤1,000,000 (`navigator.ts:32-36,322-344,418-425,453-466,477-481`).
- Private reasoning is removed before any reply: `thinking`, `signature`, `redacted`, images, and provider signatures never enter the public projection (`projection.ts:39-49,89-98`).
- A future `mintedAt` is treated as stale rather than fresh (`cli.ts:214-219`).
- Untrusted transcript content is only JSON-serialized, NFKC-normalized, and sliced into fixed-size previews (`navigator.ts:254-291`, `loads.ts:92`); it never reaches a shell, an eval, or a path.
- The offer's session id and handle are POSIX-quoted, and the bound is computed on the quoted form, so an apostrophe cannot break out (`lookup-offer.ts:52-59`).

## Ruled Out

- **Path traversal through the argv session id** — `getStatePath` hashes the id to 16 hex characters before joining the state directory; no traversal segment survives.
- **Prompt injection from retrieved content into a command** — history text is JSON-serialized and sliced; the offer carries no transcript text and states the data-not-instructions rule.
- **Handle timing/replay as an auth boundary** — the digest is not a bearer secret, the caller must already hold it, and it is 128 bits; a constant-time compare would not change what it protects.
- **TTL bypass by editing `mintedAt`** — the actor able to edit the state file already has the user's own read access to the transcript store.
- **Symlink swap of a transcript path** — the digest binds the path string, not the inode, but substitution requires write access to the same user's store directory, which is not a privilege crossing.
- **World-readable state in the OS temp dir** — the directory is created with mode `0o700` and the id is hashed (`hook-state.ts:479-492`).
- **Duplicate 66-character bound drift** — re-verified equal, same transform, same quoted-form arithmetic in both copies.
- **Unvalidated `load` id element types** — `cli.ts:480-484` casts the array, but `navigator.ts:477-481` re-validates each id as a string of ≤128 characters before the map lookup.

## Next Focus

- Dimension: traceability.
- Focus area: `spec_code` against the parent and phase-008 specs, `checklist_evidence` (phase-008 `tasks.md` completion claims), and the four overlay protocols — specifically `feature_catalog_code` (`compaction-history-lookup.md` vs the shipped offer/CLI) and `playbook_capability` (the three playbook documents vs the commands they assert).
- Reason: security is covered and carries one latent P2 plus one carried P1; traceability is the largest remaining uncovered dimension and the only one that can still falsify the phase-008 completion claims.
- Rotation status: D1 correctness and D2 security reviewed; D3 traceability next; D4 maintainability remains.
- Carry-forward: `I1-P1-001`, `I1-P2-002`, `I1-P2-003`, `I1-P2-004` and new `I2-P2-001` stay active. Finding 1's upgrade trigger is a producer passing an unvalidated runtime label.
- Required evidence: parent `spec.md` phase table, `008-wider-hop-recall-measurement/{spec,tasks,plan}.md`, the feature-catalog entry, and the three playbook files in the target.
- Recovery note: none; no approach is exhausted for traceability.

## Verdict

One new P2 (latent shell-injection shape in the offer's runtime label) and no new P0/P1. The carried `I1-P1-001` remains active, so the iteration verdict is CONDITIONAL. `hasAdvisories` is true (five active P2s).

Review verdict: CONDITIONAL
