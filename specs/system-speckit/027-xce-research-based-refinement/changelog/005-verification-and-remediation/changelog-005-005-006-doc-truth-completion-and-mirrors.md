---
title: "Doc-Truth, Completion-Claim and Runtime-Mirror Reconciliation"
description: "Forty-two doc-truth, completion-claim and runtime-mirror findings across the 027 epic: 35 fixed or refuted-with-reason here and 7 code-class findings deferred to the sibling code phases. Includes the 37 to 39 tool-count correction, Gate B amendment, dead asset links and runtime-mirror path fixes. Strict validation green on every touched folder."
trigger_phrases:
  - "005/005/006 doc-truth completion mirrors changelog"
  - "tool count 37 to 39 catalog fix"
  - "runtime mirror path convention reconciliation"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This sub-phase reconciled doc-truth, completion-claim and runtime-mirror drift across the 027 epic. Each of the 42 findings was re-verified against the live repo before action: true findings were fixed, false ones refuted with corrected coordinates and code-class findings deferred to the sibling code phases. Result: 35 resolved here, 7 deferred. This is the work that documents how the existing 027 spec folders were corrected, so the reconciliation of those folders is captured here rather than in a per-folder changelog.

### Added

- `reviewer-regression.json` deep-improvement profile plus an MB-R01 scenario file, both referenced and fixture-resolved.
- An agent-io-contract evidence-group representation note (section 7).

### Changed

- Completion-claim drift corrected across tracks: 000-release-cleanup phase map, root and 001-research-and-doctrine track statuses to Complete, 005 parent rows 002 and 004 to Complete, 002-tri-system spec status and Spec Folder pointer, 004-residual frontmatter to 90%, the 009 RSS pass marked superseded, 013 and 014 final gate evidence recorded and the 001-finding-remediation downgrade census corrected so the P1 column sums to 132.
- Catalog and playbook: feature_catalog tool count 37 to 39 across the cited docs, dead `spec_kit_*` asset links corrected to `speckit_*`, playbook scenario count corrected and the PARTIAL taxonomy reconciled aggregate-only.
- Doctrine and contract: CONTINUITY_FRESHNESS warn-versus-block wording corrected, Gate B REQ-005 amended to orchestrator-and-contract-owned (resolving two findings), reviewer-benchmark stale paths corrected and the RSS headline normalized.
- Runtime mirrors: `.claude/agents` deep-review and review Path Convention corrected to `.claude`, and a `.codex` orchestrate self-reference corrected to its own extension.
- Comment hygiene: a phase-id label removed from doctor_update.yaml (logic unchanged).

### Fixed

- A fabricated `sha256:1111...` fingerprint replaced with the canonical zero sentinel, and the parent before-vs-after and timeline allowlist carve-out applied.

### Refuted (kept as corrected docs)

- T014 (run-benchmark reviewer scorer warns-then-falls-back by design) and the three research P0s T016, T017, T018 (source-kind guards and the scrubber already exist in live code; research.md section 1 records the refutation with corrected coordinates).

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on every touched folder | Green (this sub-phase, epic root, 000, 001 and children, 002-store 009/010/013/014, 005 and children) |
| Runtime mirror parity | Confirmed by diffing the path-convention and self-reference lines against each runtime's own path |
| reviewer-regression profile | JSON-validated; four fixtures resolve |
| doctor_update.yaml | Re-parses as valid YAML after the comment edit |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Track and phase spec docs across 000, 001, 002, 005 | Modified | Completion-claim and status reconciliation |
| feature_catalog and manual_testing_playbook docs | Modified | 37 to 39 tool count, scenario count, dead-link and taxonomy fixes |
| gem-team Gate B spec and reviewer-benchmark docs | Modified | REQ-005 amendment plus stale-path corrections |
| `.claude/agents/deep-review.md`, `review.md`; `.codex/agents/orchestrate.toml` | Modified | Runtime-mirror path and self-reference fixes |
| reviewer-regression.json, MB-R01 scenario, agent-io-contract | Created/Modified | New profile, scenario and evidence-group note |

### Follow-Ups

- Seven code-class findings (T022, T024, T025, T026, T027, T031, T032) plus T042 optional wiring were deferred to sibling code phases 001-004 and are resolved there.
- Around twelve other scenario files still phrase a per-scenario PARTIAL and are a noted follow-up sweep (the root taxonomy is now self-consistent).
- Where a fixed markdown status implies a derived-status JSON update, that refresh is a metadata follow-on (the canonical markdown is now correct).
