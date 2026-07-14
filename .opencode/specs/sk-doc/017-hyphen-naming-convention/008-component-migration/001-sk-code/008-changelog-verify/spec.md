---
title: "Feature Specification: sk-code changelog and version verification (017 phase 008/008)"
description: "Verification-only phase for the sk-code rename set: confirm the append-only changelog entry, the post-migration version bump, the exemption boundary, and the evidence supplied by phases 001-007 without performing any rename."
trigger_phrases:
  - "sk-code changelog verification"
  - "sk-code version bump check"
  - "kebab-case release evidence"
  - "sk-code rename release record"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification docs"
    next_safe_action: "Verify changelog and version evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/changelog/"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/README.md"
      - ".opencode/skills/sk-code/description.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
      - "../001-hub-root-and-shared/checklist.md"
      - "../007-benchmark/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase verifies release evidence only; it performs no filesystem rename."
      - "The changelog must cover the actual 001-007 rename surfaces and the 017 exemption boundary."
      - "The post-migration version must exceed BASE 4.1.0.0 and agree across active version surfaces."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-code changelog and version verification

> Verification phase under the sk-code component parent: predecessor `007-benchmark`; successor `009-skill-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Verification-only phase 008 of the sk-code component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-code subtree can complete its physical path migration while its public release record omits affected surfaces,
reference repair, exemptions, or the version change. The active hub currently reports BASE version `4.1.0.0`, so a
release entry and version bump must be compared with the phase 001-007 evidence rather than accepted from a string alone.

### Purpose

Verify that an append-only sk-code changelog entry records the completed rename set and exemption boundary, that the
post-migration version is greater than BASE and consistent across active version surfaces, and that any discrepancy is
handed to the 009 gate as a blocking finding. This phase performs no filesystem rename or changelog repair.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Inspect `.opencode/skills/sk-code/changelog/` for the new append-only entry for the completed 001-007 rename set.
- Compare the entry with the phase handoffs for hub/shared, code-opencode, code-quality, code-review, code-webflow,
  playbook, and benchmark surfaces.
- Confirm the entry describes kebab-case as canonical and preserves the `.py`, Python package-directory,
  tool-mandated, generated/lockfile, identifier/key/frontmatter, and frozen-history boundaries.
- Compare the candidate version with BASE `4.1.0.0` and with `SKILL.md`, `README.md`, frontmatter, descriptor metadata,
  and any other active version surface that declares the sk-code release.
- Produce a release-evidence matrix and a blocking discrepancy handoff for phase 009 when evidence is missing or
  inconsistent.

### Out of Scope

- Any filesystem rename, path/reference rewrite, code or script change, benchmark rerun, or migration execution.
- Rewriting an existing historical changelog entry or inventing a version/date that is not present in the candidate
  release evidence.
- Repairing a missing changelog entry or metadata mismatch; the verifier records the discrepancy and fails closed.
- Reclassifying code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python names, generated output, lockfiles,
  tool-mandated names, or frozen history as filesystem migration work.

### Files to Inspect

| File Path | Verification |
|-----------|--------------|
| `.opencode/skills/sk-code/changelog/` | Locate the new release entry and distinguish it from frozen history. |
| `.opencode/skills/sk-code/SKILL.md` and `README.md` | Compare active version and public migration summary. |
| `.opencode/skills/sk-code/description.json` and `graph-metadata.json` | Check declared active version metadata when present. |
| `001-sk-code/001-*` through `007-benchmark/` | Reconcile rename surfaces, exemptions, references, and verification receipts. |
| `009-skill-gate/` | Receive the pass/block matrix and unresolved discrepancy handoff. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A new changelog entry covers the complete sk-code rename set | The entry names or links to every 001-007 surface and does not claim a narrower migration. |
| REQ-002 | The entry preserves the policy and exemption boundary | It states kebab-case as canonical and preserves Python `.py`/package, tool-mandated, generated/lockfile, identifier/key/frontmatter, and frozen-history exemptions. |
| REQ-003 | Reference and verification outcomes are represented | The entry matches the phase handoffs for path/reference repair and records the applicable validation, discovery, or parity evidence. |
| REQ-004 | The version bump is coherent | The candidate version is greater than BASE `4.1.0.0` and agrees across the changelog and every active declared version surface. |
| REQ-005 | Historical release records remain append-only | Existing frozen changelog/history files are unchanged, and the candidate evidence identifies the new entry without rewriting old records. |
| REQ-006 | Discrepancies block the rollup gate | A missing entry, incomplete coverage, overclaim, or version mismatch appears in the handoff matrix and blocks 009 sign-off. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The changelog has an evidence-matching entry for all 001-007 sk-code rename surfaces.
- **SC-002**: The release/version surfaces agree on a post-migration version greater than `4.1.0.0`.
- **SC-003**: Missing, stale, or inconsistent evidence produces an explicit blocking handoff to `009-skill-gate`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is treating a historical entry or an isolated version string as proof of the migration. The verifier
mitigates this with a row-by-row comparison against the 001-007 handoffs, an explicit BASE-version comparison, and a
non-mutating diff check. The phase depends on the completed sibling evidence, the pinned BASE metadata, and the release
surfaces exposed by sk-code; it supplies evidence to the 009 rollup gate.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The release date and final version are execution-time values; the verifier must record them from the
candidate evidence and must not infer them from a mismatch.
<!-- /ANCHOR:questions -->
