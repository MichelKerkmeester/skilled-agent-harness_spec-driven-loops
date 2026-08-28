---
title: "Tasks: Rework four external UI-design skills into one standalone sk-design skill"
description: "Ordered build tasks and the verification checklist for the sk-design skill package, with evidence recorded against each gate."
trigger_phrases:
  - "sk-design skill tasks"
  - "sk-design verification"
  - "standalone skill build tasks"
  - "skill package gate evidence"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rework four external UI-design skills into one standalone sk-design skill

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the Refactoring UI source: `SKILL.md`, three references, `tokens.css`, README (`scratch/`)
- [x] T002 [P] Capture the Web Interface Guidelines corpus, including per-rule detail beyond the one-line rules (`references/interaction-craft.md`)
- [x] T003 [P] Capture the 12 Principles of Animation article plus the timing, easing, physics and staging rule files from its source repository (`references/motion-principles.md`)
- [x] T004 [P] Capture the Rams review skill content, routing around the direct-fetch block (`references/review-checklist.md`)
- [x] T005 Scaffold the class-S root (`.opencode/skills/sk-design/`)
- [x] T006 Rename the root and packet to the final identity once the four-source scope was known (`.opencode/skills/sk-design/`, `specs/sk-design/017-design-skill/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Author `SKILL.md`: scales, procedure, hierarchy, seven-intent router, rules, sources (`SKILL.md`)
- [x] T008 [P] Author the palette construction reference (`references/color-system.md`)
- [x] T009 [P] Author the symptom-to-fix reference, regrouped into five tables (`references/diagnosis-table.md`)
- [x] T010 [P] Author the depth, typography, layout and imagery reference (`references/depth-and-detail.md`)
- [x] T011 [P] Author the interaction-craft reference (`references/interaction-craft.md`)
- [x] T012 [P] Author the motion reference: twelve principles plus the enforceable ruleset (`references/motion-principles.md`)
- [x] T013 [P] Author the review checklist, with the source's promotional footer instruction stripped (`references/review-checklist.md`)
- [x] T014 Carry over the token file verbatim and author its companion document (`assets/`)
- [x] T015 Author root metadata: advisor identity, edges, 31 intent signals, manifest declaration (`graph-metadata.json`, `leaf-manifest.config.json`)
- [x] T016 [P] Author the README, changelog entry and manual-testing playbook (`README.md`, `changelog/v1.0.0.0.md`, `manual-testing-playbook/manual-testing-playbook.md`)
- [x] T017 Document all three cross-source conflicts and the cross-skill tension at their landing points (`references/interaction-craft.md`, `references/motion-principles.md`, `SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Generate the derived metadata pair and confirm class-S conformance fleet-wide (`leaf-manifest.json`, `leaf-aliases.json`)
- [x] T019 Run the skill authoring gate (`scripts/validate_skill_package.py`)
- [x] T020 Run the document validator over every reference, asset and the README (`scripts/validate_document.py`)
- [x] T021 Sweep every relative link in the package for a resolving target (`.opencode/skills/sk-design/`)
- [x] T022 Trim `SKILL.md` back under the word cap and re-run the authoring gate (`SKILL.md`)
- [x] T023 Probe advisor routing with realistic prompts, via the Python advisor after the daemon CLI timed out (`graph-metadata.json`, `SKILL.md`)
- [x] T024 Close the three routing gaps the probe exposed by widening the keyword comment and intent signals (`graph-metadata.json`, `SKILL.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Remediation

- [x] T025 Verify the retired `sk-design` hub name is free before reclaiming it: hub set, activation directories, metadata edges (`compiled-routing-flag.ts`)
- [x] T026 Rename the skill root, identity fields and packet folder to `sk-design` (`.opencode/skills/sk-design/`, `specs/sk-design/017-design-skill/`)
- [x] T027 Correct the stale 7-hub compiled-routing set that still named `sk-design` (`feature-catalog/governance/feature-flag-governance.md`)
- [x] T028 Make the cross-skill reconciliation reciprocal: direction section, boundary, sibling edge, causal summary (`sk-design-md-generator/`)
- [x] T029 Move the seven-step procedure out of `SKILL.md` to restore word headroom (`references/build-procedure.md`)
- [x] T030 Move the hierarchy elaboration out, keeping a four-rule operative core inline (`references/hierarchy.md`)
- [x] T031 Import the Laws of UX category (`references/ux-laws.md`)
- [x] T032 Import the Typography and Visual Design categories, resolving the shadow-color conflict they exposed (`references/depth-and-detail.md`)
- [x] T033 Decide the six declined categories and record the reason for each (`changelog/v1.0.0.0.md`)
- [x] T034 Wire the three new references into the router, loading table, reference list and advisor metadata (`SKILL.md`, `graph-metadata.json`)
- [x] T035 Re-probe routing across all ten intents and close the two remaining gaps (`SKILL.md`, `graph-metadata.json`)
- [x] T036 Rebuild the manual-testing playbook to the operator-scenario contract: root index plus 12 per-feature files in 4 category folders (`manual-testing-playbook/`)
- [x] T037 Execute every grep cited in a scenario and tighten the one that matched an unintended line (`manual-testing-playbook/conflict-handling/project-system-precedence.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining on the P0 path
- [x] Automated gates pass with recorded evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-010
- [x] CHK-002 [P0] Technical approach defined in plan.md — progressive disclosure over one advisor identity
- [x] CHK-003 [P1] Dependencies identified and available — class-S contract green, advisor daemon yellow
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Package gate passes — `validate_skill_package.py`: `package_skill.py --check: PASS (exit 0)`
- [x] CHK-011 [P0] Root metadata gate passes — `ci-skill-root-metadata.cjs`: `checked=14 passed=14 failed=0`, root classified `[S]`
- [x] CHK-012 [P1] Router degrades safely — every path scope-guarded and inventory-checked; low confidence returns a disambiguation checklist
- [x] CHK-013 [P1] Follows project patterns — eight-section `SKILL.md`, five-field reference frontmatter, kebab-case resource names
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-010 verified
- [x] CHK-021 [P0] Document validator clean — six references, one asset and the README each report `Total issues: 0`
- [x] CHK-022 [P1] Link integrity verified — package-wide sweep reports `broken: 0`
- [x] CHK-023 [P1] Advisor routing probed — ten prompts across every intent; the skill is top-ranked for padding (0.95), palette (0.95), procedure (0.92), hierarchy (0.89), diagnose (0.84), depth (0.81) and UX laws (0.63), second behind `sk-code` for accessibility review (0.91) and motion (0.84), and the extraction boundary correctly routes to `sk-design-md-generator` (0.95)
- [x] CHK-024 [P0] Hub-name reclaim verified safe — `COMPILED_ROUTING_HUBS` holds six hubs with no `sk-design`; no activation directory; no metadata edge; one stale prose reference found and corrected
- [x] CHK-025 [P1] Cross-skill reconciliation reciprocal — both skills carry the direction statement and a typed sibling edge with matching weight
- [x] CHK-026 [P1] Word headroom restored — 4,671 of 5,000 after three new references and two imports
- [x] CHK-027 [P0] Playbook operator-scenario contract — `validate-playbook-package.cjs` reports `PASS package=sk-design tier=FAIL_CLOSED scenarios=12 categories=4 operator=12 violations=0 warnings=0`
- [x] CHK-028 [P1] Every scenario command is executable — all 12 cited greps run and resolve; one was tightened after matching an unintended line
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This packet is additive authoring, not a fix: there is no finding to classify, no producer or consumer inventory to take, and no changed helper, policy or schema field.

- [x] CHK-FIX-001 [P0] N/A — no findings; the packet creates a new skill root
- [x] CHK-FIX-002 [P0] N/A — no same-class producers changed
- [x] CHK-FIX-003 [P0] N/A — no helpers, policies, schema fields or response fields changed
- [x] CHK-FIX-004 [P0] N/A — no security, path, parser or redaction code involved
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the package contains markdown, JSON and CSS only
- [x] CHK-031 [P0] Third-party content treated as data — a promotional footer instruction embedded in one source was surfaced to the operator and excluded from the authored artifact
- [x] CHK-032 [P1] No auth surface — the skill has no runtime or network behavior
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized — scope, requirements and phases match the built artifact
- [x] CHK-041 [P1] Source attribution complete — four sources named in `SKILL.md`, README and the changelog
- [x] CHK-042 [P2] README authored and validated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only — captured sources stayed in the session scratchpad, outside the repo
- [x] CHK-052 [P1] No orphaned artifacts from the two renames — no `sk-refactoring-ui`, `sk-design-ui-craft` or `017-ui-craft-skill` path or reference remains
- [x] CHK-051 [P1] No stray files in the skill root — the tree matches the class-S shape
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — six ADRs
- [x] CHK-101 [P1] All ADRs carry a status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented — rollback is deletion plus a gate rerun
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01 met — `SKILL.md` at 4,671 words against a 5,000-word cap, after the procedure and hierarchy elaboration moved to references
- [x] CHK-111 [P1] Load surface bounded — always-loaded content is `SKILL.md` alone; references load on scored intent
- [x] CHK-112 [P2] N/A — no runtime to load-test
- [x] CHK-113 [P2] Benchmark corpus authored; scoring deferred
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback documented — delete the root, rerun the fleet gate
- [x] CHK-121 [P0] N/A — no feature flag; the skill is inert until routed to
- [x] CHK-122 [P1] Monitoring — the fleet metadata gate runs across all roots and would report drift
- [x] CHK-123 [P1] Operator runbook — README Sections 3 and 8
- [x] CHK-124 [P2] Verification commands listed in the README
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Content review completed — no verbatim source text carried over; all four sources attributed
- [x] CHK-131 [P1] License posture recorded — the Refactoring UI source repository is MIT and covers derived notes only, not the book; the other three are public documentation restated rather than copied
- [x] CHK-132 [P2] N/A — no executable surface
- [x] CHK-133 [P2] N/A — no data handling
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] N/A — no API surface
- [x] CHK-142 [P2] User-facing README written in the repo's narrative voice
- [x] CHK-143 [P2] Cross-source conflicts and their resolutions recorded for the next maintainer
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
