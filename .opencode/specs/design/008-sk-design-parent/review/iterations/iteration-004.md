# Deep Review Iteration 004 — Maintainability

## Dispatcher

- **Run:** 1
- **Session ID:** 2026-06-30T06:07:52.070Z
- **Generation:** 1
- **Dimension:** maintainability
- **Focus:** Pattern consistency, documentation quality, naming conventions, stale references
- **Budget profile:** scan (planned 9-11; executed 16 total — budget exceeded)
- **Timestamp:** 2026-06-30T06:45:00.000Z
- **Duration:** ~15m

## Files Reviewed

| Phase | File | Scope |
|-------|------|-------|
| 001-corpus-research | spec.md (frontmatter) | Template structure, stale artifacts |
| 003-scaffold-parent | spec.md (metadata) | Scaffold-named phase verification |
| 016-register-loader-contract | spec.md (frontmatter) | Planned-phase template consistency |
| 022-mifb-design-research | spec.md (frontmatter) | Complete-phase template consistency |
| 035-design-context-benchmark | spec.md (frontmatter) | Complete-phase template consistency |
| 040-design-playbook-filename-denumbering | spec.md (frontmatter), implementation-summary.md | Scaffold artifact in complete phase |
| 041-design-command-upgrade | spec.md (metadata) | Already-known scaffold (P1-006) |
| 042-design-work-deep-review | directory listing | Empty scaffold (P1-005, confirmed) |
| 043-design-review-remediation | spec.md (frontmatter) | Complete-phase template consistency |
| All 43 phases | spec.md (grep: placeholders, statuses, naming, broken refs) | Pattern sweep |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

**1. Stale scaffold session_id in completed phase 040 spec.md**
- **Severity:** P2 — documentation artifact, no functional impact.
- **File:** `040-design-playbook-filename-denumbering/spec.md:21`
- **Evidence:** The `session_dedup.session_id` field reads `"scaffold-session/040-design-playbook-filename-denumbering"` (line 21) even though the phase is 100% complete (`completion_pct: 100`, line 23). The corresponding implementation-summary.md line 19 correctly uses `"remediation/040-design-playbook-filename-denumbering"`. The scaffold session_id was never updated when the phase transitioned from scaffold to implementation.
- **Finding class:** instance-only
- **Scope proof:** `rg -n "session_id.*scaffold" 040-design-playbook-filename-denumbering/spec.md` confirms the single instance at line 21. No other completed phases show this pattern.
- **Affected surface hints:** ["040 spec.md frontmatter", "session_dedup.session_id field"]
- **Recommendation:** Update `session_id` in 040/spec.md from `"scaffold-session/040-..."` to match the implementation-summary.md value `"remediation/040-..."` .

**2. 043 spec.md missing SPECKIT_TEMPLATE_SOURCE marker comment**
- **Severity:** P2 — minor template inconsistency, no functional impact.
- **File:** `043-design-review-remediation/spec.md:32`
- **Evidence:** All other sampled spec.md files include an HTML comment on the heading line identifying the template source (e.g., `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->` at 001:27, 016:30, 022:34, 035:33, 040:27). 043 line 32 is bare: `# Feature Specification: design-review remediation (042 findings)` with no template-source comment. This is the only phase in the 6 sampled that omits this marker.
- **Finding class:** instance-only
- **Scope proof:** `rg "^# Feature Specification" 043-*/spec.md` followed by visual inspection confirms the missing comment. All other sampled phases (001, 016, 022, 035, 040) include it.
- **Affected surface hints:** ["043 spec.md heading", "template provenance tracking"]
- **Recommendation:** Add `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->` (or appropriate template) to line 32 of 043/spec.md, matching the template-source convention of the other completed phases.

## Traceability Checks

Maintainability dimension does not require new traceability protocol checks. Existing traceability findings (P1-010 handoff criteria, P1-011 children_ids gaps, P2-012 ordering, P2-013 duplicate ambiguity) remain active from iteration 3.

## Integration Evidence

None reviewed. Maintainability dimension is spec-doc internal; no external integration surfaces were inspected.

## Edge Cases

- **040 scaffold session_id vs complete status:** The spec.md frontmatter retains `scaffold-session` in session_id, but the phase has 100% completion and a substantive implementation-summary.md. The spec.md content itself (beyond the frontmatter) is thorough and accurate. The session_id field is a metadata artifact only — the spec body correctly documents the denumbering work. Downgraded to P2 because the spec is substantively complete and accurate despite the stale metadata.
- **Template source versioning:** All sampled phases use `v2.2` of templates. The template ecosystem appears stable across this track — no v1.x or v3.x template drift detected.
- **016 HVR_REFERENCE unique:** 016 includes `<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->` on line 34, which no other sampled phase includes. This is intentional — 016 is Level 2 and references the HVR rules for its checklist. Not a finding.

## Confirmed-Clean Surfaces

- **Naming convention adherence:** All 43 phase folder slugs follow the `NNN-descriptive-slug` pattern. No "phase-N", "generic", "placeholder", "temp", "scratch", or "unnamed" slugs found (excluding the two known duplicate-number phases 037 and 041).
- **Status field consistency:** No spec.md files contain `Status: Draft`, `Status: In Progress`, or `Status: Not Started` in their body prose. All phases use the structured `completion_pct` YAML field for lifecycle state.
- **Broken cross-references:** No references to phases 044+ or nonexistent phase numbers found in any spec.md. All internal phase references stay within the 001-043 range.
- **Frontmatter structure uniformity:** All 6 sampled phases (001, 016, 022, 035, 040, 043) share identical YAML frontmatter field ordering: `title` → `description` → `trigger_phrases` → `importance_tier` → `contextType` → `_memory.continuity.{packet_pointer, last_updated_at, last_updated_by, recent_action, next_safe_action, blockers, key_files, session_dedup.{fingerprint, session_id, parent_session_id}, completion_pct, open_questions, answered_questions}`. All 17 fields present in consistent order.
- **importance_tier uniformity:** All sampled phases use `importance_tier: "important"`. No `constitutional`, `critical`, `temporary`, or `deprecated` outliers.
- **contextType uniformity:** All sampled phases use `contextType: "implementation"`. Consistent across phases.

## Ruled Out

- **003 "scaffold" in packet_pointer as a finding:** `003-scaffold-parent` has `packet_pointer: ".../003-scaffold-parent"` (line 14). This is the phase's actual name, not a scaffolding artifact — "scaffold" is part of the descriptive slug describing the parent-scaffolding work. Ruled out.
- **016 HVR_REFERENCE as template drift:** 016 includes a unique HVR_REFERENCE comment (line 34). This is intentional for its Level 2 checklist and matches the sk-doc HVR rules reference pattern. Not a finding.
- **Template source comment variations as inconsistency:** 022 uses `spec-core + level2-verify + level3-arch | v2.2` while most phases use `spec-core | v2.2`. This correctly reflects the Phase Level (022 is Level 3). Acceptable variation.
- **040 session_id mismatch as P1:** The spec.md content is substantively complete and accurate. The stale scaffold session_id is a metadata-only artifact with no downstream impact. Downgraded from potential P1 to P2.

## Next Focus

- **Dimension:** maintainability
- **Focus area:** Cross-dimension synthesis (all 4 dimensions complete)
- **Reason:** Maintainability is the final dimension. Coverage is now 4/4. Two new P2 findings (stale scaffold session_id in 040, missing SPECKIT_TEMPLATE_SOURCE in 043). No new P0/P1 — severity-weighted signal is low.
- **Rotation status:** All dimensions complete — convergence check recommended.
- **Blocked/Productive carry-forward:** Productive: batch grep + parallel reads for pattern sweeps. Blocked: budget discipline (4/4 iterations over budget).
- **Required evidence:** Run convergence check. Cross-reference remaining P0/P1 findings for remediation priority.
- **Recovery note:** Budget exceeded (16 calls vs 12 max). But all required outputs produced. Batch reads in 6-parallel was efficient; the overrun came from follow-up checks (040 impl-summary read + broken-ref grep).

---

**Review verdict: CONDITIONAL** — No new P0/P1 findings in maintainability. Overall track status remains FAIL due to 2 active P0 from iteration 1 (duplicate phase numbers 037, 041). Maintainability is clean aside from 2 minor P2 documentation artifacts.

Review verdict: CONDITIONAL
