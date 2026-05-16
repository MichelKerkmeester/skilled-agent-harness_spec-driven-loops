# Iter 047 — Track 11: phase lifecycle governance

## Why governance now
- Without a lifecycle policy, 026 will drift again because the observed failure mode was not bad naming; it was unchecked phase accumulation.
- Iter 027 found 42 completed-unreferenced packets, mostly referenced only by research iteration files, not by current code, docs, or active packets.
- Iter 028 found supersession chains where later work replaced earlier outputs, but the older packets stayed beside the current truth.
- Iter 029 was intended to classify orphans, but the output file is missing; that absence itself is a governance signal: orphan detection was scoped but not completed.
- Iter 030 consolidated 55 delete candidates, including high-confidence stale/superseded packets and placeholders with no `description.json`.
- Iter 035 proposes reducing 026 from roughly 132 total packets to about 37, but that is a one-time cleanup unless retirement rules become normal operating procedure.

## Lifecycle policy

### Stages
- **Active:** Work is in progress or expected to change. Signals: `spec.md` status is planned/in-progress, `graph-metadata.derived.status` is planned/in_progress, commits or file changes in the last 30 days, open checklist items, or active handover/current-task fields. Duration norm: 0-30 days without explicit renewal.
- **Stable:** Work shipped and remains referenced by current code, docs, tests, runtime config, or active spec dependencies. Signals: status complete, references outside research/archive folders, validation evidence present, no open follow-up blockers. Duration norm: indefinite, but reviewed every 90 days.
- **Stale:** Work completed, has no recent commits, and has zero current references outside historical research/archive material. Signals: status complete, 90 days no commits, `rg` reference count excluding `research/iterations`, `z_archive`, and the packet itself is 0. Duration norm: one sweep cycle before deletion review.
- **Superseded:** Later work replaced the packet's output. Signals: `manual.supersedes`, explicit supersession in graph metadata, later packet describes replacement, or current code/docs match the later packet and not the older one. Duration norm: delete by default unless it has durable design/audit value.
- **Orphan:** Packet was created but never became real work, or experimental work was never closed. Signals: missing or tiny `spec.md`, no `implementation-summary.md`, no `description.json`, no graph metadata, status draft/abandoned, empty checklist, no commits for 30 days. Duration norm: delete after 30 days unless an operator reactivates it.

### Transitions
- **Active → Stable:** Triggered when work ships and validation evidence exists. Automation should update `graph-metadata.derived.status=complete`, require `spec.md` status reconciliation, and check implementation-summary continuity. Operator role: confirm shipped state and resolve any checklist ambiguity.
- **Stable → Stale:** Triggered by 90 days with no commits plus 0 current references. Automation can compute age and reference count. Operator role: confirm that references are not hidden in external docs or human workflows.
- **Stale → Delete:** Triggered after stale sweep review. Automation should produce a delete plan, size estimate, and reference report. Operator role: approve deletion; default posture is delete, not archive.
- **Stable/Superseded → Superseded:** Triggered when a later packet ships a replacement. Automation can infer candidates from `manual.supersedes`, `related_to`, renamed phase maps, and direct textual supersession notes. Operator role: decide whether historic design/audit value warrants archive.
- **Superseded → Archive vs Delete:** Triggered during sweep. Archive only when the packet contains durable decision history, security/audit evidence, or migration context not preserved elsewhere. Otherwise delete.
- **Orphan → Delete:** Triggered by 30 days no commits plus missing/empty packet body. Automation can detect missing files, tiny `spec.md`, absent metadata, and no git activity. Operator role: only rescue if there is an active owner and immediate next task.
- **Orphan → Active:** Triggered only by explicit owner action: populate minimum Level 1 docs, create metadata, set status planned/in-progress, and add a current task.

### Automation
- Automatable:
  - Derive `derived.lifecycle_stage` from status, commit age, reference count, and required-file presence.
  - Detect 30/90-day age thresholds from git history.
  - Count current references while excluding research iteration outputs, archived specs, and self-references.
  - Flag missing `description.json` / `graph-metadata.json`.
  - Flag near-empty `spec.md` and absent `implementation-summary.md`.
  - Detect duplicate packet numbers under one parent.
  - Detect supersession edges from `manual.supersedes`.
  - Produce sweep reports with recommended transition and confidence.
  - Block new child creation when the parent already has unresolved stale/orphan candidates unless explicitly overridden.

- Requires operator:
  - Deciding whether superseded material has durable historical value.
  - Confirming deletion of packets with ambiguous external references.
  - Resolving merge-vs-delete for low-confidence packets.
  - Reclassifying active work that has gone quiet but still has a real owner.
  - Approving final delete plans.

- Tooling needed:
  - `phase-lifecycle-sweep` script under `.opencode/skills/system-spec-kit/scripts/`.
  - Reference scanner with configurable exclusions.
  - Git-age scanner per packet folder.
  - Metadata updater for `graph-metadata.derived.lifecycle_stage`.
  - Pre-commit or pre-save warning when a packet is created without metadata/docs.
  - Optional cron/doctor route: `/doctor phase-lifecycle <spec-folder>` read-only by default, apply mode only after Gate 3.

## Application to current 026 restructure
- Day-1 stage assignment for each current packet:
  - `000-release-cleanup`: Active. The current tree shows many recent cleanup children; do not freeze until release cleanup closes.
  - `001-research-and-baseline`: Stable. Foundational historical baseline; preserve if referenced by the root narrative.
  - `002-resource-map-template`: Superseded/Stable transition. Iter 035 says rename/merge into `002-resource-map-and-deep-loop-fix`; preserve current value under the renamed stable phase.
  - `003-continuity-memory-runtime`: Stable, with active child history. Keep as Phase 2 constituent.
  - `004-runtime-executor-hardening`: Stable or merge candidate. Iter 035 keeps it separate pending the iter 002 merge decision; operator review required.
  - `005-memory-indexer-invariants`: Stable. Keep as Phase 2 constituent.
  - `006-graph-impact-and-affordance-uplift`: Superseded by clearer target identity. Rename to `006-external-project-adoption`, then Stable.
  - `007-code-graph`: Stable phase parent after internal cleanup. Nested stale/superseded packets transition to Delete or Archive per iter 030.
  - `008-skill-advisor`: Active/Stable mixed phase parent. Keep as a current capability phase; internal children need lifecycle sweep after the 026 restructure.
  - `009-hook-parity`: Stable phase parent after consolidation to 3 internal phases.
  - `010-template-levels`: Active or Stable but missing from iter 035's proposed phase list; operator must decide whether it joins Release Cleanup, Phase 1, or remains a separate phase.
  - `011-cocoindex-daemon-resilience`: Stable. Load-bearing standalone infrastructure packet.
  - `012-causal-graph-channel-routing`: Stable. Load-bearing standalone infrastructure packet.
  - `013-doctor-update-orchestrator`: Stable phase parent after superseded `001`/`002` are merged or archived and router phases remain current.
  - `014-local-llama-cpp`: Stable phase parent after rename to `014-local-embeddings-setup-a`; many nested children transition to Delete.
  - `015-global-security-sweep-and-supply-chain-audit`: Stable after rename to `015-tanstack-security-audit`.
  - `999-spec-026-restructure-research`: Active until restructure execution is complete; then Archive or Delete depending on whether its research outputs are summarized into the final ADR.

- Which packets transition where as part of the restructure:
  - Iter 030 HIGH confidence candidates: transition Stale/Superseded → Delete.
  - Iter 030 MEDIUM confidence candidates: transition Superseded → operator review, default Delete.
  - Iter 030 LOW confidence candidates: transition Superseded → Archive vs Delete review.
  - `014/045-session-deep-review-2026-05-14` and `014/048-deep-review-cocoindex-wiring`: Orphan → Delete because they are placeholders with no `description.json`.
  - `013/001-doctor-commands` and `013/002-sandbox-testing-playbook`: Superseded → Archive/Merge review because iter 027 excluded them from pure delete.
  - `007/016`-`020`: Superseded by code-graph extraction → Delete unless their migration record is not summarized in the retained phase parent.
  - `014/054`-`059`: Superseded documentation/deep-loop consolidation packets → Delete after their durable decisions are captured in the retained parent.
  - Current renamed top-level phases from iter 035: Active/Superseded → Stable once graph metadata and `spec.md` status are reconciled.

## Recommended additions to the restructure
- Add a `phase-lifecycle.md` ADR? **Yes.** This should be a governance ADR, not a narrative appendix. It should define stages, thresholds, exclusions, and operator review rules.
- Add a graph-metadata `derived.lifecycle_stage` field? **Yes.** Keep `derived.status` for work state and add `derived.lifecycle_stage` for retention state. They answer different questions.
- Add a cron / sweep script under `.opencode/skills/system-spec-kit/scripts/` that surfaces lifecycle transitions? **Yes.** Make the first version read-only: report candidates, confidence, evidence, and proposed transition. Apply/delete mode should be a separate explicit route.

## JSONL delta row
{"iter_id": "047", "timestamp_utc": "2026-05-16T03:54:25Z", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "stages_defined": 5, "automatable_checks": 9, "primary_evidence_files": ["iter-027/028/029/030/035"]}