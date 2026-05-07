# Deep Review Iteration 009 - Adversarial P1 Adjudication

**Session**: 2026-05-07T17:08:57Z  
**Generation**: 1  
**Lineage Mode**: new  
**Dimensions**: correctness, security, traceability, maintainability  
**Focus**: adversarial-pass  
**Verdict**: FAIL (`hasAdvisories=true`)

## Method

This pass did not search for new findings. It re-read the current source anchors for all 13 active P1s, challenged whether each should be advisory-only, and ruled using the `sk-code-review` severity doctrine: P1 means a required correctness, spec mismatch, or gate issue with concrete `file:line` evidence.

## Adjudication

### P1-007 - Checklist Evidence

- **Hunter**: Confirmed. `093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/checklist.md:58-61` and `:106-108` still contain unchecked P0/P1 checklist rows. `098-097-remediation/005-checklist-evidence/implementation-summary.md:125-136` confirms line-by-line CHK evidence was not backfilled, and `:144` records it as a future audit item.
- **Skeptic**: Could be P2 if the packet explicitly changed the completion contract to permit unchecked required rows. It does not; required checklist evidence remains a completion gate.
- **Referee**: CONFIRM_P1. Required completion evidence is still missing in a claimed remediation path.

### P1-015 - `skill_graph_scan` Source

- **Hunter**: Confirmed. `mcp_server/handlers/skill-graph/scan.ts:40` still defaults `skillsRoot` to `.opencode/skill`; `skill_advisor/handlers/advisor-rebuild.ts:84` still indexes `.opencode/skill`.
- **Skeptic**: Could be P2 if this were stale prose only. It is live TypeScript source for scan/rebuild behavior.
- **Referee**: CONFIRM_P1. The feature catalog/code path still points at the obsolete singular skill root.

### P1-016 - `scripts/dist` Stale

- **Hunter**: Confirmed. `scripts/dist/observability/smart-router-measurement.js:14-17` still uses `.opencode/skill/...` defaults for report, JSONL, and live compliance paths.
- **Skeptic**: Generated artifacts are sometimes advisory. Here they are runnable `scripts/dist` outputs used by CLI/observability flows, so stale generated code can execute.
- **Referee**: CONFIRM_P1. Source/dist parity remains broken on a runnable surface.

### P1-017 - 095 Inconsistent Execution

- **Hunter**: Confirmed. `095-sk-code-review-playbook-execution/implementation-summary.md:57-58` says `18 / 18` PASS and `0 / 18` SKIP, while `:112` says CR-016/017/018 were marked SKIP and `:123-126` says `15 dispatched + 3 SKIP`; the packet contains no durable CR-016/017/018 transcript files.
- **Skeptic**: Could be P2 if it were only wording. It changes the reported verification result from partial/skipped to full pass.
- **Referee**: CONFIRM_P1. The execution summary contradicts its own evidence for a verification packet.

### P1-018 - 093 Playbooks Unreachable From Skill

- **Hunter**: Confirmed. The playbook files exist, but `sk-code-review/SKILL.md:66-68` and `:361-366`, plus `sk-git/SKILL.md:78-82` and `:436-440`, do not link or route to their `manual_testing_playbook` directories; direct search for `manual_testing_playbook` or "testing playbook" in those skill files returns no matches.
- **Skeptic**: Could be P2 if playbooks were merely supplemental docs. Packet 093's purpose is to add skill-owned manual testing playbooks, so unreachable playbooks fail the capability surface.
- **Referee**: CONFIRM_P1. The shipped playbooks are not discoverable from the owning skills.

### P1-019 - `spec_folder` Interpolation

- **Hunter**: Confirmed. `spec_kit_deep-review_auto.yaml:118` and `spec_kit_deep-review_confirm.yaml:118` interpolate raw `{spec_folder}` into a `node -e` command. `review-research-paths.cjs:201-204` resolves and joins paths, but does not first reject unresolved placeholders, absolute paths, parent traversal, or non-spec roots.
- **Skeptic**: Could be P2 if all callers prevalidated the token. The YAML is the command-owned workflow surface and performs interpolation before resolver containment.
- **Referee**: CONFIRM_P1. This is a required write-authority and path-containment gate issue.

### P1-020 - `audit_descriptions.py` Zero-Inventory Pass

- **Hunter**: Confirmed. `audit_descriptions.py:421-427` builds inventory and exits JSON mode based only on `payload["exitOver"]`; a zero-inventory repo smoke test exits 0 with `counts.total: 0`.
- **Skeptic**: Could be P2 if zero inventory were explicitly accepted. The audit is supposed to catch missing description coverage, and zero scanned items is a failed audit precondition.
- **Referee**: CONFIRM_P1. The validator can pass while scanning nothing.

### P1-021 - Smart-Router False-Fail On Shared CLI Router

- **Hunter**: Confirmed. `check-smart-router.sh:260-263` checks `skill_dir / resource` only. CLI skills reference existing shared docs through `../system-spec-kit/references/cli/shared_smart_router.md` and `../system-spec-kit/references/cli/memory_handback.md`, which exist, but the local-only resolver cannot accept that shared path.
- **Skeptic**: Could be P2 if the shared references were stylistic. This validator enforces smart-router compliance and currently false-fails valid cross-skill shared resources.
- **Referee**: CONFIRM_P1. A required validator rejects valid documented references.

### P1-022 - 096/004 Anchor Mismatch + Strict Validate Fail

- **Hunter**: Confirmed. `096-rename-opencode-dirs-to-plural/004-symlinks/spec.md:136-152` opens `questions`, then opens/closes `nfr` while closing `reliability`; `:189` closes `questions`. `validate.sh --strict` exits 2 with `ANCHORS_VALID` and `SPEC_DOC_SUFFICIENCY`.
- **Skeptic**: Could be P2 if anchor shape were cosmetic. Strict validation fails, so this is a completion gate failure.
- **Referee**: CONFIRM_P1. The child packet cannot strictly validate.

### P1-023 - Deferred Findings Missing From Continuity Blockers

- **Hunter**: Confirmed. `098-097-remediation/005-checklist-evidence/implementation-summary.md:16` has `blockers: []` while `:125-136` and `:144` carry unresolved/deferred checklist evidence. Prior cited sibling packets follow the same shape for deferred resolver and P2 followups.
- **Skeptic**: Could be P2 if `blockers` were defined as only current phase blockers. In this workflow, continuity blockers are the machine-readable resume surface for unresolved review work.
- **Referee**: CONFIRM_P1. Deferred required work is absent from the continuity field consumers read first.

### P1-024 - 098 Child Packets Fail Strict Validation

- **Hunter**: Confirmed. `098-097-remediation/001-dist-rebuild/checklist.md:39-43` uses a collapsed `required` checklist instead of the Level 2 anchor set, and `tasks.md:54-74` uses non-contract phase headings. Current strict validation exits 2 for all seven 098 child phases.
- **Skeptic**: Could be P2 if the parent alone were the completion artifact. The children are claimed-complete remediation packets and strict validation is the completion gate.
- **Referee**: CONFIRM_P1. Claimed-complete child packets fail required validation.

### P1-025 - Advisor Routing Failure

- **Hunter**: Confirmed. `aliases.ts:19-24` defines aliases under `sk-deep-review`, while native/default advisor calls return `[]` for `deep-review track:skilled-agent-orchestration` at threshold 0.8. The local fallback returns `deep-review` at confidence 0.95.
- **Skeptic**: Could be P2 if the fallback were the only supported route. The default/native route is part of Gate 2 routing and fails an explicit skill trigger.
- **Referee**: CONFIRM_P1. Required skill routing misses the named deep-review workflow.

### P1-026 - Registry/State-Log Mismatch

- **Hunter**: Confirmed. `deep-review-findings-registry.json:8-26` remains `INITIALIZED` with zero open findings and zero P1/P2 counts, while the latest state log entry records 13 P1 and 6 P2 active findings.
- **Skeptic**: Could be P2 if the registry were not authoritative. The prompt lists it as the findings registry for this review, and reducer-owned registry state feeds convergence/synthesis.
- **Referee**: CONFIRM_P1. The canonical registry contradicts the append-only state log.

## Active P2 Spot-Check

No active P2 should be upgraded based on aggregate impact in this pass.

- `P1-005` remains advisory because its containment concern is subsumed by P1-019.
- `P2-002` is a generated/source test-title wording issue; behavior already uses the plural fixture path.
- `P2-004` overlaps target-authority concerns, but the active P1 is P1-019's shared workflow interpolation. The Copilot helper/export drift remains an optional executor-branch followup unless the Copilot branch is made a release gate.
- `P2-008` is stale schema/default text; the actual source behavior is covered by P1-015.
- `P2-009` is stale evidence line ranges.
- `P2-010` is resource-map heading/narrative drift.

## Traceability Status

| Protocol | Result | Notes |
|---|---|---|
| spec_code | fail | P1-015, P1-016, P1-019, P1-020, P1-021, P1-022, P1-024, P1-025, P1-026 remain required fixes. |
| checklist_evidence | fail | P1-007 and P1-023 remain active. |
| skill_agent | mixed | Skill docs exist, but playbook reachability and advisor routing remain broken. |
| agent_cross_runtime | fail | P1-017 remains active. |
| feature_catalog_code | fail | P1-015 and P1-025 remain active. |
| playbook_capability | fail | P1-018 remains active. |

## Verdict

FAIL. All 13 active P1s are confirmed after adversarial severity challenge. Post-adjudication count remains P0=0, P1=13, P2=6. No new findings were introduced and no severity changes were made.
