# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-003 (daemon and launcher liveness), dimension `traceability`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by checking each D1 claim the reviewed commits make against the code path that implements it, and by reading the packet's acceptance criteria for an unmet row.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 31ffd18beab`, `git show 1ccbb3283c6`, the owning packet's `acceptance-criteria.md` and `implementation-summary.md`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md:1-45`
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:426-450`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:491-520`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1325-1432`, `:1588-1615`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:140-155`, `:325-420`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13`
- `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:301-304`
- `specs/system-skill-advisor/.../019-ollama-lane-honest-and-closeout/acceptance-criteria.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass -- every D1 claim resolves to a code path: startup refresh at `advisor-server.ts:439` after `startIpcSocketServer` at `:426`, watcher refresh at `watcher.ts:496`, no lane-weight gate in `refreshEmbeddingsInBackground` (`skill-graph-db.ts:1435-1480`), stale-vector retention at `:1588-1592`, coverage gate at `semantic-shadow.ts:392`, prompt-embed drop-out at `:151`, default weight 0 at `lane-registry.ts:13`.
- `checklist_evidence` -- pass -- `acceptance-criteria.md` carries no `Unmet` row (the only occurrences of the word are the legend at `:75` and `:81`), and the D1 rows it does carry match the code paths above.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md:19-27` -- the doc's four claims (startup after IPC ready, watcher after reindex, any lane weight, complete coverage skips network work) each match the code, including the "command-only index remains incomplete" sentence against `complete: skills.total > 0 && incompleteIds.length === 0` (`skill-graph-db.ts:1429`).
- `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:304` -- the doctor reports `STATUS=OK` only when `coverageComplete` is true and the backend is reachable, and `STATUS=DEGRADED` otherwise, which is the claim the commit message makes.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13` -- `semantic_shadow` keeps `defaultWeight: 0` with `defaultShadowWeight: 0.05`, so the ablation's fail result is what ships.

## Edge Cases

- The owning packet's `implementation-summary.md:3` states that 581 unrecorded operator answers were recorded or settled, while decision D3 names 231 and the ten docs commits add 227 rows. The three numbers are not reconciled in the packet. This is an answer-routing claim, so it is carried to the F-1-006 traceability pass rather than raised under this node.
- The doc says the refresh runs "at any semantic lane weight". The code has no weight gate, but the refresh is also skipped when `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` is `off`; the doc names that opt-out on its own line, so the two statements do not conflict.

## Confirmed-Clean Surfaces

- Every D1 claim in the reviewed commit message has a matching code path.
- The acceptance criteria carry no unmet row.
- The doctor presentation's status rule matches the handler's `coverageComplete` field.

## Ruled Out

- "The startup refresh runs before the IPC socket is ready": ruled out -- it is started after `startIpcSocketServer` resolves.
- "The refresh is gated on the semantic lane weight": ruled out -- no weight check exists in the refresh path.
- "The ablation's fail result was overridden by a later default change": ruled out -- the registry still ships weight 0.

## Next Focus

- Dimension: traceability
- Focus area: frontier node F-1-006, traceability pass over the D3 answer claim, the 581-versus-231 discrepancy and the zero fingerprint
- Reason: F-1-003 traceability is complete; the unreconciled answer count belongs to the answer-routing node
- Rotation status: F-1-003 has 3 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- the claim-by-claim check closed every D1 claim
- Required evidence: the packet's own numbers against the committed rows, and the resume ladder's treatment of the zero fingerprint
- Recovery note: none

Review verdict: PASS
