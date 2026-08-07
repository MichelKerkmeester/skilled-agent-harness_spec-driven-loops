# Iteration 017: validate.sh Gap Analysis + Expansion Recommendations

## Focus
- Scope: What systemic gaps allow these drift patterns to persist? What validate.sh checks are missing?
- Question: What validation improvements would prevent recurrence?

## Findings

### F-017: Six missing validate.sh checks that would have caught every drift pattern in this research

**Severity: High (preventive — these gaps allowed all 16 prior findings to ship)**

Every finding in this research (F-001 through F-016) represents a drift pattern that validate.sh did NOT catch. Six targeted validation rules would prevent recurrence:

**V-1: Phase Documentation Map status consistency check**
- Rule: For each Phase Documentation Map row, the Status column MUST match the child folder's implementation-summary.md completion_pct (100→Complete, 0→Draft)
- Would have caught: F-001 (40 Draft rows under Complete parents)

**V-2: Cross-file completion_pct consistency check**
- Rule: Within a single folder, all _memory.continuity.completion_pct values across spec.md, plan.md, tasks.md, implementation-summary.md MUST agree (±5%)
- Would have caught: F-003 (50+ files at 0 vs implementation-summary at 100), F-010, F-015

**V-3: Template-default detection**
- Rule: Flag any doc under a Complete-status folder containing template markers (`[Opening hook:`, `T001 Create project structure`, `[Implement core feature`, `Replace template defaults`)
- Would have caught: F-010 (3 template-default plan.md), F-015 (008 tasks.md/implementation-summary.md)

**V-4: Packet-id reference consistency**
- Rule: All references to the packet's own ID (in Parent Spec, Successor, prose) MUST match the current `spec_folder` path slug. Flag any reference to a different `NNN-name` pattern.
- Would have caught: F-011 (14 references to `123-agent-loops-improved`)

**V-5: ADR folder completeness**
- Rule: Folders matching `*-adr/` MUST contain `decision-record.md`
- Would have caught: F-008 (2 of 3 ADR phases missing decision-record.md)

**V-6: Comment-hygiene lint for YAML/markdown**
- Rule: Flag `F-\d+-\w+-\d+`, `REQ-\d+`, `ADR-\d+`, `T0\d+` patterns inside comments (`#`, `<!-- -->`) in `.yaml` and `.md` files outside of spec folders
- Would have caught: F-002 (6 ephemeral finding-ID markers)

**Implementation approach:**
These checks should be added as `--strict` mode rules in `validate.sh`, NOT as soft warnings. They represent constitutional invariants (Iron Law, comment hygiene, scope lock) that should be hard blockers.

**Meta-finding:** The absence of these checks is itself a systemic issue. The validation suite validates structure (required files exist, frontmatter is valid YAML) but not semantic consistency (do the claims match the evidence?). A "semantic validation" layer is missing.

**Recommendation:**
1. Implement V-1 through V-6 as validate.sh `--strict` rules
2. Add a `validate.sh --semantic` flag that runs cross-file consistency checks (completion_pct agreement, packet-id references, phase-map status)
3. Run `validate.sh --strict --semantic --recursive` as a gate before any `speckit:complete` claim

## Novelty Justification
This is a meta-analysis that synthesizes all 16 prior findings into 6 concrete validation rules. No prior review iteration proposed this systematic "what validation would have prevented ALL of these" framing.

## What Was Tried and Failed
- Checked if any of these checks already exist in validate.sh (they do not — current validate.sh checks file presence and frontmatter structure only)

## Ruled-Out Directions
- These checks should NOT be warnings only — they represent constitutional invariants
