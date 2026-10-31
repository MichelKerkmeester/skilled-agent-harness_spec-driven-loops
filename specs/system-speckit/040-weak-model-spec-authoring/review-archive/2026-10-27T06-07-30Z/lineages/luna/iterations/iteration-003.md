# Review Iteration 3 — Security: scaffold track input and write containment

## Dispatcher

- Session: fanout-luna-1792949481267-fym7sk, generation 1, lineage mode new.
- Focus: trace the authoring card's documented --track argument through destination construction and its track-root side effect.
- Review target: specs/system-speckit/054-weak-model-spec-authoring.
- Route proof: Resolved route: mode=review target_agent=deep-review.
- Sources include the phase 005 scope and acceptance evidence, the card, create.sh, refresh-track-roots.mjs, the spec README, severity rules, and the absent steer.md noted below.
- This was a static review. No tests or scaffold commands were run.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **--track can route scaffold writes above the repository root** — .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1291-1294

   - Case: the documented command receives --track ../../outside. SPECS_DIR becomes REPO_ROOT/specs/../../outside; mkdir -p creates a directory above the repository. FEATURE_DIR appends the generated packet name, and the scaffold path creates the folder and copies templates there.
   - Evidence: the parser checks for a value and assigns TRACK directly at create.sh:137-148. The destination is formed at lines 1290-1294. Lines 2096-2111 derive and create FEATURE_DIR. This branch bypasses resolve_and_validate_create_target.
   - User impact: a malformed or adversarial track value makes the scaffold write beyond the repository's specs tree.
   - Recommendation: resolve the track and final scaffold destination before the first mkdir, and stop unless the canonical destination remains beneath REPO_ROOT/specs.
   - Finding class: path-containment.
   - Scope proof: the phase 005 card tells the author to run create.sh with --track and sets the allowed authoring writes to the packet and scratch folders.
   - Affected surfaces: authoring-card scaffold path, specs-tree containment, template writes.

#### P1 Claim Adjudication

- Hunter: the raw track value flows from argument parsing into SPECS_DIR, then into the packet destination and mkdir/template-copy path.
- Skeptic: the tool is locally invoked, so this evidence does not establish remote exploitation or privilege escalation. The explicit --path resolver is a separate path and does not validate --track. The slash check in refresh_track_root runs after scaffold destination creation.
- Referee: retain P1. This is a required containment fix in the documented scaffold path, with the impact limited to unintended local writes.

~~~json
{
  "type": "security",
  "findingId": "R3-P1-001",
  "claim": "The documented --track argument can escape REPO_ROOT and cause create.sh to create directories and scaffold files above the repository root because TRACK is accepted verbatim and joined into SPECS_DIR.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:137-148",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1290-1294",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2096-2111"
  ],
  "counterevidenceSought": "The explicit --path flow does use resolve_and_validate_create_target, but --track does not call it. refresh_track_root skips slash-containing track values only after SPECS_DIR and FEATURE_DIR have already been used for mkdir and template writes.",
  "alternativeExplanation": "The command is locally invoked and this evidence does not show remote input or privilege escalation. The impact is an unintended write outside the repository through the supported scaffold interface.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade to P2 if the track and final scaffold paths are canonically resolved and proven to remain beneath REPO_ROOT/specs before any directory or template write."
}
~~~

### P2 Findings

2. **The authoring card omits the tracked scaffold metadata write** — .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20-25

   - Case: a valid track containing graph-metadata.json is passed to the documented create.sh command. After creating the packet, the command refreshes children_ids in the track root metadata file outside the new packet folder.
   - Evidence: the card lists packet and scratch as allowed write locations at lines 20-25 and directs the reader to use --track at lines 49-57. create.sh calls refresh-track-roots.mjs with --apply at lines 1031-1042. That utility writes graph-metadata.json at lines 103-105. The spec README documents the side effect at lines 91 and 105.
   - User impact: authors and reviewers may interpret a normal tracked scaffold as exceeding the card's write boundary.
   - Recommendation: name the script-managed track-root metadata update as an explicit scaffold exception in the card, or change the scaffold flow so its writes match the card boundary.
   - Finding class: contract-implementation-mismatch.
   - Scope proof: the card is the phase 005 deliverable and defines the authoring write boundary for the tracked scaffold command.
   - Affected surfaces: authoring-card write boundary, track-root graph-metadata.json, scaffold command effects.

## Traceability Checks

- Phase 005 scope to card deliverable: PASS. The card is listed as the phase's primary artifact.
- Card allowed-write statement to tracked scaffold behavior: PARTIAL. The command-managed track-root metadata update is documented in the CLI README but not in the card.
- Track destination containment: FAIL. The raw track value reaches directory creation without canonical containment validation.

## Review Depth and Search Ledger

- Scope class: complex; strict review-depth enforcement.
- Coverage mode: graphless_fallback. The lineage graph is unavailable; direct reads, exact search, and producer-consumer tracing supplied the evidence.
- Required and covered bug classes: track_path_containment; tracked_write_scope.
- Deferred or blocked classes: none.
- SL-001: track_path_containment — finding R3-P1-001. Direct reads and producer-consumer tracing followed TRACK through SPECS_DIR, FEATURE_DIR, mkdir, and template copying.
- SL-002: tracked_write_scope — finding R3-P2-001. Direct reads and producer-consumer tracing confirmed the card boundary and the metadata writer.

## Edge Cases

- refresh_track_root skips values containing a slash, but it executes after path construction and scaffold writes, so it does not contain the track destination.
- The track-root metadata side effect requires an existing single-segment track with graph-metadata.json.
- Severity adjudication considered that the CLI is locally invoked; the finding reports unintended local writes and makes no remote-exploit claim.
- No tests or scaffold commands were run because the review is based on source tracing.

## Files Reviewed

- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20-25,49-57
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:137-148,1031-1042,1225-1255,1290-1294,2096-2111,2164
- .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs:103-105
- .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:91,105
- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/spec.md:86-119
- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md:54-62
- .skilled/skills/sk-code/sk-code-review/references/review-core.md:48-51,92-107
- .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/severity-classification.md:17-25
- .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/claim-adjudication.md:19-27
- specs/system-speckit/054-weak-model-spec-authoring/review/lineages/luna/steer.md: absent at iteration start

Review verdict: CONDITIONAL
