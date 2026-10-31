# Deep Review Report: Weak Model Spec Authoring

## Executive Summary

Overall verdict: **CONDITIONAL**. Active findings: P0=0, P1=3, P2=1. The P1 findings require fixes; the P2 item is advisory.

The three inline iterations covered correctness, security, traceability and maintainability at the requested commit. They compared the 22 phase records with selected shipped templates, validator and CLI paths, advisor source, sk-git provisioning and documentation. The 22 phase specs and implementation summaries exist and declare Complete. This was a read-only source review, not a fresh full test run.

Operator review focus: All work packet 054 shipped in phases 001-022, now on main at 558570a83e: the spec-kit templates, validator, authoring card, CLI scripts and their tests, the advisor scorer and its phrases, the sk-git provisioning step, the docs and the phase records. Check the shipped code and docs against what each phase spec claims.

Stop reason: `maxIterationsReached`. The final pass found no new P0 or P1, but the stop policy required all three iterations.

## Planning Trigger

`/speckit:plan` is required for the three P1 findings. The documentation finding can travel with that work or remain an advisory.

Planning Packet
```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "SOL-001",
      "severity": "P1",
      "title": "Symlinked track writes a new packet outside specs",
      "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138",
      "case": "An existing specs/linked symlink points to another directory and create.sh runs with --track linked.",
      "findingClass": "cross-consumer",
      "scopeProof": "Phase requirement specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/spec.md:139; implementation .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138; current test .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts:118.",
      "affectedSurfaceHints": [
        "create.sh --track",
        "create-track-containment test",
        "phase 010 acceptance"
      ]
    },
    {
      "id": "SOL-002",
      "severity": "P1",
      "title": "Mixed fence markers hide a later unfilled value token",
      "file": ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814",
      "case": "A v2.3 Complete doc contains ~~~md, then a literal ``` line inside that fence, then ~~~ closing it, then an unfilled value token in prose.",
      "findingClass": "cross-consumer",
      "scopeProof": "Orchestrator .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814 and shell helper .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:74 share the toggle; the phase 003/010 token guarantee covers both.",
      "affectedSurfaceHints": [
        "orchestrator placeholder rule",
        "shell placeholder rule",
        "placeholder token matrix"
      ]
    },
    {
      "id": "SOL-003",
      "severity": "P1",
      "title": "Existing symlink at an explicit scaffold target bypasses repo containment",
      "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240",
      "case": "A repo-relative --path names an existing symlink directly under the repository whose target is outside the repository.",
      "findingClass": "class-of-bug",
      "scopeProof": "The --path resolver at .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240 checks only the parent; the first writes are at .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2103; template rendering is rooted in that destination at .skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:181.",
      "affectedSurfaceHints": [
        "create.sh --path",
        "template-utils destination check",
        "explicit-path tests"
      ]
    },
    {
      "id": "SOL-004",
      "severity": "P2",
      "title": "Parent scope and completion metadata still describe the earlier phase set",
      "file": "specs/system-speckit/054-weak-model-spec-authoring/goal.md:47",
      "case": "A reader uses the parent goal to bind a phase after 012 or uses the parent spec handoff criteria to decide whether the 22-phase packet is complete.",
      "findingClass": "matrix/evidence",
      "scopeProof": "Parent goal specs/system-speckit/054-weak-model-spec-authoring/goal.md:47 and binding specs/system-speckit/054-weak-model-spec-authoring/goal.md:79; parent spec handoff specs/system-speckit/054-weak-model-spec-authoring/spec.md:57 and phase map specs/system-speckit/054-weak-model-spec-authoring/spec.md:152. A 22-phase inventory found each phase spec and implementation summary, with all phase statuses Complete.",
      "affectedSurfaceHints": [
        "parent goal directive and binding",
        "parent spec metadata",
        "phase closeout"
      ]
    }
  ],
  "remediationWorkstreams": [
    {
      "name": "Scaffold path containment",
      "priority": "P1",
      "findings": [
        "SOL-001",
        "SOL-003"
      ],
      "action": "Resolve the complete destination before any mkdir or touch, then cover track and explicit-path symlink cases without allowing escape."
    },
    {
      "name": "Placeholder fence parity",
      "priority": "P1",
      "findings": [
        "SOL-002"
      ],
      "action": "Track fence delimiter and length in both scanners; add the mixed-fence negative case."
    },
    {
      "name": "Parent packet alignment",
      "priority": "P2",
      "findings": [
        "SOL-004"
      ],
      "action": "Amend the parent goal binding and reconcile status and handoff metadata after the behavior fixes."
    }
  ],
  "specSeed": [
    "Require physical containment for --track and repo-relative --path targets before writes.",
    "Define matching Markdown fence delimiters for placeholder scanning.",
    "Reconcile the parent goal and phase metadata with the full 22-phase record."
  ],
  "planSeed": [
    "Add failing symlink cases for --track and --path, then fix create.sh containment.",
    "Add a mixed-fence fixture to the placeholder parity matrix, then update both scanners.",
    "Amend the parent packet metadata and rerun scoped checks."
  ],
  "findingClasses": [
    "cross-consumer",
    "class-of-bug",
    "matrix/evidence"
  ],
  "affectedSurfacesSeed": [
    "create.sh --track",
    "create-track-containment test",
    "phase 010 acceptance",
    "orchestrator placeholder rule",
    "shell placeholder rule",
    "placeholder token matrix",
    "create.sh --path",
    "template-utils destination check",
    "explicit-path tests",
    "parent goal directive and binding",
    "parent spec metadata",
    "phase closeout"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### SOL-001 [P1] Symlinked track writes a new packet outside specs

- Dimension: correctness. Location: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138].
- Case: An existing specs/linked symlink points to another directory and create.sh runs with --track linked.
- Evidence: validate_track_value checks the spelling only, then mkdir uses the symlinked path; the shipped test asserts creation in the outside target.
- Impact: A scaffold can write outside the required specs root and phase 010 containment is unfulfilled.
- Recommendation: Resolve the track root before mkdir and reject targets outside the resolved specs root; update the symlink test.
- Disposition: active. Class: cross-consumer. Scope proof: Phase requirement specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/spec.md:139; implementation .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138; current test .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts:118.
- Affected surfaces: create.sh --track, create-track-containment test, phase 010 acceptance.

### SOL-002 [P1] Mixed fence markers hide a later unfilled value token

- Dimension: correctness. Location: [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814].
- Case: A v2.3 Complete doc contains ~~~md, then a literal ``` line inside that fence, then ~~~ closing it, then an unfilled value token in prose.
- Evidence: Both scanners toggle fence state on either marker without matching the opener. The shell helper returned no marker for this sequence, while it reported 1 token for the same prose line alone.
- Impact: A Complete packet can pass the placeholder gate with an unfilled value token.
- Recommendation: Track fence delimiter and length, closing only on a matching Markdown fence; add the mixed-fence negative case to the parity test.
- Disposition: active. Class: cross-consumer. Scope proof: Orchestrator .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814 and shell helper .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:74 share the toggle; the phase 003/010 token guarantee covers both.
- Affected surfaces: orchestrator placeholder rule, shell placeholder rule, placeholder token matrix.

### SOL-003 [P1] Existing symlink at an explicit scaffold target bypasses repo containment

- Dimension: security. Location: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240].
- Case: A repo-relative --path names an existing symlink directly under the repository whose target is outside the repository.
- Evidence: resolve_and_validate_create_target resolves the parent but appends the final basename without resolving it. Later mkdir and touch use that final path, so they follow the symlink.
- Impact: A caller expecting the documented repo-relative boundary can create or replace packet files in the symlink target.
- Recommendation: Reject an existing symlink target that resolves beyond the allowed repo root, before any mkdir or touch; test the final-component symlink case.
- Disposition: active. Class: class-of-bug. Scope proof: The --path resolver at .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240 checks only the parent; the first writes are at .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2103; template rendering is rooted in that destination at .skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:181.
- Affected surfaces: create.sh --path, template-utils destination check, explicit-path tests.

### SOL-004 [P2] Parent scope and completion metadata still describe the earlier phase set

- Dimension: traceability. Location: [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/goal.md:47].
- Case: A reader uses the parent goal to bind a phase after 012 or uses the parent spec handoff criteria to decide whether the 22-phase packet is complete.
- Evidence: The frozen D1 row names phases 001-012, the goal binding table ends at 12, and the parent spec still says All nine phases with Status In Progress even though its own map lists phases 1-22 Complete.
- Impact: Future operators can use an outdated scope and goal precedence when continuing or auditing the packet.
- Recommendation: Amend the parent directive and child-goal binding through phase 022, then reconcile parent status and handoff criteria with the intended final state.
- Disposition: active. Class: matrix/evidence. Scope proof: Parent goal specs/system-speckit/054-weak-model-spec-authoring/goal.md:47 and binding specs/system-speckit/054-weak-model-spec-authoring/goal.md:79; parent spec handoff specs/system-speckit/054-weak-model-spec-authoring/spec.md:57 and phase map specs/system-speckit/054-weak-model-spec-authoring/spec.md:152. A 22-phase inventory found each phase spec and implementation summary, with all phase statuses Complete.
- Affected surfaces: parent goal directive and binding, parent spec metadata, phase closeout.

## Remediation Workstreams

1. **P1 Scaffold path containment** (SOL-001, SOL-003): Resolve the complete destination before any mkdir or touch, then cover track and explicit-path symlink cases without allowing escape.
2. **P1 Placeholder fence parity** (SOL-002): Track fence delimiter and length in both scanners; add the mixed-fence negative case.
3. **P2 Parent packet alignment** (SOL-004): Amend the parent goal binding and reconcile status and handoff metadata after the behavior fixes.

## Spec Seed

- Require physical containment for --track and repo-relative --path targets before writes.
- Define matching Markdown fence delimiters for placeholder scanning.
- Reconcile the parent goal and phase metadata with the full 22-phase record.

## Plan Seed

- Add failing symlink cases for --track and --path, then fix create.sh containment.
- Add a mixed-fence fixture to the placeholder parity matrix, then update both scanners.
- Amend the parent packet metadata and rerun scoped checks.

A complete fix should check every affected producer and consumer, including both scaffold entry paths and both placeholder scanners. The phase 010 acceptance row needs to cover the symlink case that its current test endorses.

## Traceability Status

- Core `spec_code`: **fail**. Phase 010 requires resolved track containment, but the current test asserts creation outside specs through a symlink. The v2.3 placeholder gate can miss a token after mixed fence markers.
- Core `checklist_evidence`: **fail**. Phase 010 AC-001 reads Met after testing traversal, while the shipped test permits a symlink escape.
- Overlay `feature_catalog_code`: **partial**. Selected claims and source paths were checked; the catalog validator did not run.
- Overlay `playbook_capability`: **partial**. Selected scenarios and the authoring card were read; scenarios were not executed.
- `skill_agent` and `agent_cross_runtime`: not applicable to a spec-folder target.
- `AC_COVERAGE`: exempt for the parent because it has no acceptance-criteria.md. Child acceptance rows were inventoried; three Level 1 phases have no acceptance file as allowed. Phase 013 AC-003 is Superseded with ADR-001 and AC-010 is Met.
- Resource Map Coverage Gate: skipped because no root resource-map.md existed at initialization. A lineage resource map was emitted from the review deltas for provenance only.

## Deferred Items

- SOL-004 is a P2 documentation alignment task.
- Dynamic advisor rankings, full validation, playbook execution and test suites were not run. These commands can write caches or fixtures outside the assigned lineage. The saved phase summaries are historical evidence, not fresh proof from this review.

## Dimension Expansion Map

- Iteration 1: correctness of scaffold containment and placeholder visibility.
- Iteration 2: security of explicit-path containment, Draft repair, CI annotation handling and private command provisioning.
- Iteration 3: traceability and maintainability across the phase record inventory, key source presence and parent directive.
- No saturation pivot or override was needed. The remaining frontier is dynamic routing and full scoped test execution under an authorized write surface.

## Search Ledger

- Candidate coverage: path containment, marker visibility, parent scope drift and selected security guard cases were checked with direct reads, exact searches, a producer-consumer trace and a read-only shell helper probe.
- Search debt: 1 blocked obligation. Live advisor ranking proof was not executed because the tool may write outside this lineage.
- Graph coverage: graphless fallback with cited search ledger rows. Packet-keyed graph upsert was skipped because its output might leave the assigned lineage.

## Audit Appendix

- Session: `fanout-sol-1793081281038-z2aj1o`. Target HEAD: `558570a83edd4d82f935fdeb2df7c451d5d91d12`.
- Three iteration narratives and deltas exist. Every iteration and claim adjudication record passed through the append gateway, and the reducer refreshed the registry after each pass.
- Registry: 4 active findings with P0=0, P1=3, P2=1. Dimension coverage: 4/4. Search debt: 1.
- The shell helper probe returned `1 token` for a bare value token and no marker for the valid tilde-fence sequence with a literal backtick delimiter inside followed by the same token in prose. Both probes exited 0.
- Source presence: 22 selected shipped code, test and documentation paths existed; the add-on directory had seven templates and the three removed template names were absent. This is a presence check, not a suite result.

### Core Protocols

- `spec_code`: fail with file and line evidence in SOL-001 through SOL-003.
- `checklist_evidence`: fail at phase 010 AC-001 as explained above.

### Overlay Protocols

- `feature_catalog_code`: partial. `playbook_capability`: partial. `skill_agent` and `agent_cross_runtime`: not applicable.

### Adversarial self-check

- SOL-001: re-read the deliberate symlink test. It confirms the mismatch rather than explaining it away.
- SOL-002: re-read both fence toggles and compared a bare-token positive control with the mixed-fence case. P1 remains justified because a required gate misses an unfilled token.
- SOL-003: re-read the final-component path construction and first writes. The full scaffold was not executed under the write boundary, so the conclusion is based on source control flow; a scoped symlink fixture would confirm the end-to-end effect.

