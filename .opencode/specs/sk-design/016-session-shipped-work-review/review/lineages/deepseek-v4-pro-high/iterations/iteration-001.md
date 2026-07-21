# Iteration 001: Correctness — 015 Phase-0 generation manifest atomicity + command-namespace dedup consistency

## Focus

D1 Correctness across two high-priority commits:
- `bf0986cecd` (015 Phase-0 styles-DB foundation): generation-manifest atomicity, stage-telemetry residency honesty, differential oracle parity
- `9a42aedae4` (command-namespace dedup): `commands/design/` deletion consistency, registry agreement, stale doc claims

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 12
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1, Required

- **F001**: `writeManifestPointer` has a partial-atomicity gap when `afterRename` throws after the rename, `generation-manifest.mjs:259-260`, The atomic rename succeeds (`rename` is durable on most filesystems), but if the `afterRename` callback throws on line 260, the directory fsync on line 261-265 is skipped (control jumps to the finally block). The finally block only cleans up the temp file (already renamed, so a no-op). The caller sees an error but the pointer has already flipped — the published state transitioned without the caller's knowledge. This is exercised by the test at `__tests__/manifest.test.mjs:139-148` which asserts `assert.ok(['sha256:gen1', 'sha256:gen2'].includes(manifest.generationHash))`, acknowledging the non-deterministic outcome. For buildStyleDatabase (caller at `indexer.mjs:1110-1115`), when `afterRename` throws, the generation file is on disk under its immutable name, the pointer may or may not point to it, and the caller's catch block cannot deterministically roll back the pointer flip. Category: correctness. [SOURCE: generation-manifest.mjs:249-271]

- **F002**: Stale doc claims across feature-catalog docs reference the deleted `commands/design/` directory as still active. The command-dedup commit `9a42aedae4` deleted `commands/design/` (5 wrappers + 15 assets) and updated SKILL.md/README.md to say "the former `/design:*` alias namespace is retired," but three files still claim the aliases "remain":
  - `feature-catalog/creation-command-surface/interface-creation-commands.md:43` — table row lists `.opencode/commands/design/*.md` as "Compatibility routers" that "Preserves the five `/design:*` aliases"
  - `feature-catalog/creation-command-surface/interface-creation-commands.md:20` — "The former `/design:*` commands remain thin compatibility aliases"
  - `feature-catalog/feature-catalog.md:201` — "The corresponding `/design:*` commands remain thin compatibility aliases"
  Category: correctness/traceability. [SOURCE: feature-catalog/creation-command-surface/interface-creation-commands.md:20,43; feature-catalog/feature-catalog.md:201]

### P2, Suggestion

- **F003**: `styles/manual-testing-playbook.md:29` — Table row for scenario "CMD-03" cites `commands/design/*.md` as the target path for alias resolution testing, but the directory has been deleted. The test scenario cannot execute as documented. Category: maintainability. [SOURCE: styles/manual-testing-playbook.md:29]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:56-58 vs generation-manifest.mjs:249-271 | REQ-001 atomicity verified; gap found with afterRename failure mode |
| checklist_evidence | n/a | hard | — | No checklist.md present in spec folder |

## Claim Adjudication

### F001

```json
{
  "findingId": "F001",
  "claim": "writeManifestPointer has a partial-atomicity gap: if afterRename throws, the pointer has already been atomically renamed but directory fsync is skipped, and the caller cannot determine whether the publish succeeded.",
  "evidenceRefs": [
    "generation-manifest.mjs:249-271",
    "__tests__/manifest.test.mjs:139-148"
  ],
  "counterevidenceSought": "Grepped for error-handling paths that undo the rename; checked buildStyleDatabase in indexer.mjs for rollback logic after a failed writeGenerationPointer; verified the test at manifest.test.mjs:139-148 explicitly acknowledges the non-deterministic outcome.",
  "alternativeExplanation": "The directory fsync is a durability improvement, not a correctness requirement — on crash/corruption the rename itself is durable. The afterRename hook is exclusively used by tests (failureInjector) and the production hook in buildStyleDatabase does nothing besides logging.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "If it can be shown that the production afterRename callback (at indexer.mjs:1114-1116) is a no-op when failureInjector is absent AND that rename-without-directory-fsync is equally durable on all target filesystems (including network mounts), downgrade to P2 advisory.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: atomicity gap is non-deterministic and caller-visible but production callback is defensive." }
  ]
}
```

### F002

```json
{
  "findingId": "F002",
  "claim": "Feature-catalog docs still claim /design:* aliases 'remain' and reference the deleted commands/design/ directory as active compatibility routers.",
  "evidenceRefs": [
    "feature-catalog/creation-command-surface/interface-creation-commands.md:20,43",
    "feature-catalog/feature-catalog.md:201"
  ],
  "counterevidenceSought": "Checked SKILL.md and README.md — both correctly updated to say aliases are 'retired.' Checked that commands/design/ is confirmed deleted. Grepped for any other /design: references in sk-design/ tree — found 13 hits, but most are in changelog (historical records).",
  "alternativeExplanation": "The feature-catalog docs could be intentionally deferred for a follow-up update, or the catalog may be considered aspirational rather than operational. However, the catalog file explicitly references the deleted paths as active, which is materially false.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If a follow-up commit is queued to update the feature-catalog docs to match the retired state, downgrade to resolved.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: stale doc claims contradict shipped state." }
  ]
}
```

## Assessment

- New findings ratio: 0.55 (3 new findings across 12 files, weighted by severity: (2*5.0 + 1*1.0)/20 = 0.55)
- Dimensions addressed: correctness
- Novelty justification: The generation-manifest atomicity gap is a real design concern in a foundation module. The stale doc claims are a direct consequence of the command-dedup deletion not propagating to feature-catalog documentation.

## Ruled Out

- **Torn-read in readManifest → resolvePublishedTarget**: `resolvePublishedTarget` reads the pointer with `readFileSync` (not atomic), but the manifest is a single JSON blob and `rename` is atomic on the filesystem. A reader either sees the old file (before rename) or the new file (after rename), never a torn mixture. Confirmed correct.
- **Retention prunes the current or sole rollback generation**: `pruneStyleDatabaseGenerations` in `operator.mjs:129-155` always keeps `currentGenerationPath` and `rollbackGenerationPath` in the `keep` set. REQ-004's retention concern is addressed.
- **Stage-telemetry residency faking**: The `assertResidency` guard at `stage-telemetry.mjs:26-29` prevents recording spans with invalid residency. The `summary()` function computes `unattributedMs` as `max(0, elapsedMs - total)`, making inter-span gaps visible. The test at telemetry.test.mjs:71-86 demonstrates 120ms unattributed cost. Confirmed honest.

## Dead Ends

None.

## Recommended Next Focus

D2 Security — audit `generation-manifest.mjs` for path-traversal in `resolvePublishedTarget`/`resolveManifestArtifacts`, check `buildStyleDatabase` temp-file races and symlink attacks, verify the `isContained` implementation correctly prevents directory escapes, and audit the validity patterns in `retrieval.mjs` (cursor tampering, query-vector bounds, SQL injection vectors in FTS queries).

Review verdict: CONDITIONAL
