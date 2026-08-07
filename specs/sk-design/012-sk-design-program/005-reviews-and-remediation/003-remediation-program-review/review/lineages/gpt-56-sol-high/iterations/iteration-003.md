# Deep Review Iteration 003 — Traceability

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `verify`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct reads, exact searches, pinned Git evidence, and executable tests were used.

## Files Reviewed

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/{spec.md,checklist.md,implementation-summary.md}`
- `.opencode/specs/sk-design/015-styles-database-evolution/spec.md`
- `.opencode/specs/sk-design/015-styles-database-evolution/graph-metadata.json`
- `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/{spec.md,implementation-summary.md}`
- `.opencode/specs/sk-design/015-styles-database-evolution/005-library-restructure/{spec.md,checklist.md,implementation-summary.md}`
- `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/{spec.md,checklist.md,implementation-summary.md}`
- `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md`
- `.opencode/skills/sk-design/styles/lib/database/{schema.mjs,generation-manifest.mjs}`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Refinement — published SQLite opens still do not enforce the manifest content digest (`P1-001`)** -- `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343` -- The current production open resolves the publication and compares only the database-owned `generation_hash`; it still does not invoke the manifest helper's available SHA-256 verification. The 69-test database replay passed, including the optional manifest tamper test, but that is counterevidence only for the helper rather than the production open. [SOURCE: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:204-234`]
   - Finding class: cross-consumer
   - Scope proof: Exact search found all production query, hydration, status, and repair consumers funneled through `openPublishedStyleDatabase`; `verifyDigests: true` appears only in manifest tests.
   - Affected surface hints: `["published database open", "persistent query", "persistent hydration", "operator status/repair"]`
   - Recommendation: Bind production opens to the manifest artifact digest or enforce and test an equivalent immutable publication guarantee.
   - Content hash: `sha256:b9ba3149517c5b8648902997375a7f0fd36629b93eba9523849ee381136587b8`

```json
{"findingId":"P1-001","type":"security-integrity","claim":"A published SQLite artifact can be altered without changing its internal generation_hash and production opens will not compare it with the manifest sha256.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/generation-manifest.mjs:204-234",".opencode/skills/sk-design/styles/lib/database/schema.mjs:343-356"],"counterevidenceSought":"Re-read the production open and manifest verifier, searched all consumers and verifyDigests call sites, and reran the 69-test database suite. The optional tamper verifier passes, but no production open calls it.","alternativeExplanation":"The generation-named local artifact may be operationally treated as immutable, but no in-scope read-only guarantee enforces that assumption.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if an enforced filesystem guarantee makes published artifacts immutable or production opens are shown to verify the manifest digest before exposing rows."}
```

2. **The manual testing playbook cannot execute against the restructured styles tree (`P1-002`)** -- `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13` -- The playbook tells operators to run every database and engine scenario against removed `_db/` and `_engine/` paths, including the mandatory DB-02/DB-03 commands and all cited implementation files. Those directories no longer exist; the executable suites now live under `styles/tests/database/` and `styles/tests/engine/`. Consequently the overlay's own release-readiness procedure cannot produce the evidence it requires. [SOURCE: `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-29`] [SOURCE: `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:31-49`]
   - Finding class: matrix/evidence
   - Scope proof: Exact path checks found no files under `styles/_db/**` or `styles/_engine/**`; the pinned-HEAD suites at `styles/tests/database/index.mjs` and `styles/tests/engine/index.mjs` passed 69/69 and 20/20 respectively.
   - Affected surface hints: `["manual release readiness", "database scenarios DB-01..08", "engine regression scenario DB-03", "operator evidence capture"]`
   - Recommendation: Rewrite the playbook paths and commands to the restructured `lib/`, `tests/`, and `database/` surfaces, then replay the non-skippable scenarios.
   - Content hash: `sha256:b9e796f5aa21d6a1ae1168e563d9de97c91cb090b970e3b16d3b0b62a330e066`

```json
{"findingId":"P1-002","type":"traceability-capability","claim":"The required manual release-readiness playbook points to removed pre-restructure paths, so its mandatory database and engine scenarios are not executable as written.","evidenceRefs":[".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-29",".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:31-49"],"counterevidenceSought":"Checked for compatibility directories at styles/_db and styles/_engine and found none; then ran the relocated engine and database aggregators successfully.","alternativeExplanation":"The paths could be historical shorthand, but the playbook explicitly says to run against those on-disk artifacts and supplies commands using them.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if an in-scope resolver or compatibility surface makes every documented command execute against the current tree without operator translation."}
```

3. **The phase-parent map still reports three shipped children as merely planned (`P1-003`)** -- `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:54` -- The governing phase map labels `001-foundation`, `005-library-restructure`, and `006-persistent-db-activation` as Planned and tells the next session to build 005 then 006, while their child packets report COMPLETE/IMPLEMENTED with shipped verification. The parent therefore cannot be used to determine current sequence or remaining work, and its graph metadata has no last-active child to compensate. [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:54-74`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/spec.md:37-49`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/005-library-restructure/implementation-summary.md:37-46`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:37-46`]
   - Finding class: matrix/evidence
   - Scope proof: Replayed the parent map against all three in-scope child status surfaces; `graph-metadata.json:40-44,108-109` remains `in_progress` with `last_active_child_id: null`, so no alternate parent-level state resolves the contradiction.
   - Affected surface hints: `["phase resume routing", "parent phase map", "remaining-work selection", "release status"]`
   - Recommendation: Reconcile the parent phase map and continuity metadata with shipped child states while preserving the explicitly deferred 005 Checkpoint B and 006 human-gated cutover.
   - Content hash: `sha256:0d308b96e596fe10fa93e99ab54b690c444889a3e6ea46aa50f5c10e6c735c09`

```json
{"findingId":"P1-003","type":"traceability-state","claim":"The governing phase-parent map and resume metadata contradict the shipped states of 001, 005, and 006, making current sequence and remaining work unreliable.","evidenceRefs":[".opencode/specs/sk-design/015-styles-database-evolution/spec.md:54-74",".opencode/specs/sk-design/015-styles-database-evolution/graph-metadata.json:40-44",".opencode/specs/sk-design/015-styles-database-evolution/graph-metadata.json:108-109",".opencode/specs/sk-design/015-styles-database-evolution/001-foundation/spec.md:37-49",".opencode/specs/sk-design/015-styles-database-evolution/005-library-restructure/implementation-summary.md:37-46",".opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:37-46"],"counterevidenceSought":"Compared the parent map with each child status and checked parent graph metadata for a last-active-child override; none resolves the contradiction.","alternativeExplanation":"The map may have been intended as an immutable planning snapshot, but it is labeled as the current phase documentation map and governs transition/resume without a historical qualifier.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if another named, current parent authority is proven to supersede this map for resume, release, and remaining-work decisions."}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core): **fail** — shipped/deferred behavior in the child packets is mostly honest and executable tests match the reported 19/20/69 counts, but `P1-001` remains active and the 015 parent contradicts the shipped child states [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:54-74`].
- `checklist_evidence` (core): **partial** — replayed every checklist included in the manifest for 012/008, 015/005, and 015/006; their deferred sentinel, Checkpoint B, relevance, scenario-matrix, and cutover gates remain visibly open, and current suites confirmed 19/19, 20/20, and 69/69. The 015/001 checklist is not in the validated manifest, so its reported 14/15 state could not be independently replayed without violating scope [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:101-112`].
- `playbook_capability` (overlay): **fail** — the required playbook's pre-restructure paths do not exist, so mandatory scenarios cannot run as written [SOURCE: `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md:13-29`].
- `feature_catalog_code` (overlay): **notApplicable** — the validated manifest names no feature catalog.

## Integration Evidence

- Pinned Git evidence: `HEAD` is `7b9d3b6b71`.
- Executable evidence: command contract/surface 19/19, styles engine 20/20, and styles database 69/69 passed at pinned HEAD.
- Exact integration surfaces reviewed: `openPublishedStyleDatabase`, the 015 phase-parent map/graph metadata, and `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md`.

## Edge Cases

- The dispatch requires full `checklist_evidence`, but the validated 118-entry scope omits `015/.../001-foundation/checklist.md`; this is partial evidence, not a silent pass or an out-of-scope read.
- The current prompt explicitly requires replaying `spec_code` and `checklist_evidence`, while stale strategy reducer text marks pending versions of those protocols BLOCKED/do-not-retry. The current iteration prompt governs; the contradiction is preserved for reducer cleanup.
- Deferred gates are not defects by themselves: 012's live include sentinel, 005's Checkpoint B, and 006's human relevance/default cutover are stated consistently in their child docs.

## Confirmed-Clean Surfaces

- Reported executable counts were reproducible: 19 command tests, 20 engine tests, and 69 database tests passed with zero failures.
- Packet 006 keeps the default on `legacy` and marks relevance, the full live scenario matrix, and cutover as open/human-gated [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:61-77`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:104-110`].
- Packet 005 distinguishes the shipped restructure from deferred Checkpoint B [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/005-library-restructure/checklist.md:103-113`].
- Packet 012 keeps the required live include sentinel open and labels the packet IMPLEMENTED rather than Complete [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/checklist.md:43-48`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite/implementation-summary.md:77-87`].

## Ruled Out

- Inflated test-count claims: current pinned-HEAD runs reproduced 19/19, 20/20, and 69/69.
- Premature persistent-default claim: packet 006 explicitly leaves the default legacy and cutover human-gated.
- Treating deferred 005 Checkpoint B or the 012 live sentinel as completed: both remain openly unchecked.

## Next Focus

- Dimension: maintainability
- Focus area: stale references, generated metadata integrity, comments/documentation accuracy, and safe follow-on change cost
- Reason: traceability replay found stale operational and phase-parent authorities; maintainability is the next unchecked dimension
- Rotation status: correctness, security, and traceability completed; rotate to maintainability
- Blocked/productive carry-forward: Code Graph unavailable; direct stale-path searches, focused reads, pinned Git evidence, and executable tests remain productive
- Required evidence: stale-reference closure, path/name consistency, metadata fingerprints, EOF warning follow-up, and consumer-facing documentation

Review verdict: CONDITIONAL
