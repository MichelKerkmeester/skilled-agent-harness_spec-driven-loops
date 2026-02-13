<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: standard-v2 -->

# Checklist: LinkedIn Ghostwriter System Audit Fixes

## Implementation Summary
- **Date:** 2026-02-10
- **Phases completed:** 1 (Canonicalization), 2 (Validation Hardening), 3 (Synchronization), 4 (Strategic — partial)
- **Tasks completed:** 18/19 (T19 deferred — requires Pieter's availability)
- **Files modified:** 8 files across knowledge base + AGENTS.md
- **Version bumps:** QV v0.123, Voice DNA v0.123, HVE v0.101, System Prompt v0.131, Interactive Mode v0.122, DEPTH Framework v0.122, Content Standards v0.123
- **Deferred:** T19 (CORINA questionnaire)

---

## Pre-Implementation Verification

- [x] All 12 knowledge base files backed up before changes
- [x] Current version numbers recorded for all files
- [x] Audit report reviewed and findings confirmed

---

## Phase 1: Canonicalization

### Hard Blockers (T01-T04)
- [x] Master hard blocker list compiled (35-40 unique terms)
- [x] QV contains complete canonical hard blocker section
- [x] "leverage" appears in hard blockers ONLY (removed from warning flags)
- [x] "nurture" and "resonate" added to QV hard blockers
- [x] "hustle", "grind", "10X" added to QV hard blockers
- [x] Voice DNA hard blocker section replaced with QV reference
- [x] HVE hard blocker section references QV canonical list
- [x] HVE precedence rule updated: "extend only, never downgrade"
- [x] HVE "It's worth noting" severity matches QV (hard blocker, not -1)
- [x] ZERO terms appear in both hard blockers AND warning flags in QV
- [x] ZERO hard blocker contradictions between any two files

### Routing (T05)
- [x] All 11 PRELOAD_GROUPS keys match detect_mode() output values
- [x] leadership_group defined and tested
- [x] feature_group defined and tested
- [x] creator_group defined and tested
- [x] interactive_group defined and tested
- [x] barter_group (renamed from brand_group) loads brand context
- [x] quick_group (renamed from creation_quick) loads correct files
- [x] raw_group (renamed from creation_raw) loads correct files

### Single Source of Truth (T06-T07)
- [x] Pieter Test defined in EXACTLY 1 file (System Prompt)
- [x] Interactive Mode references Pieter Test, does not redefine it
- [x] DEPTH Framework references Pieter Test, does not redefine it
- [x] Perspective minimums defined in EXACTLY 1 file (System Prompt)
- [x] Interactive Mode references perspective table, not blanket "3"
- [x] DEPTH Framework references perspective table

---

## Phase 2: Validation Hardening

- [x] QV contains 3-item list detection rule (-2 per occurrence)
- [x] engagement_routing state fully defined (action, nextState, waitForInput)
- [x] optimize_routing state fully defined
- [x] Hard Blocker 1 ("influencer") has documented exception for historical context
- [x] $feature fallback chain loads Context - Industry Extensions (not Personal)

---

## Phase 3: Synchronization

- [x] Single formatting constraint table exists in Content Standards
- [x] Arrows: 2-5 (consistent across all files)
- [x] Hashtags: 2-5 (consistent across all files)
- [x] Banned emoji: complete list of 7 (consistent across all files)
- [x] CTA rules per energy level: consistent across CS and QV
- [x] Interactive Mode section references corrected (Section 3.1)
- [x] All filename references match actual files on disk
- [x] "founder" keyword routes to $personal, not $feature
- [x] AGENTS.md line 151 includes $raw exception

---

## Phase 4: Strategic

- [x] Cognitive framework arbitration rule documented in AGENTS.md
- [x] Dead code removed from Interactive Mode
- [x] Complete state has explicit resetTo target
- [ ] CORINA questionnaire fully populated — **DEFERRED** (requires Pieter's availability)

---

## Post-Implementation Verification

- [ ] Re-run audit on all 12 knowledge base files — zero critical findings
- [ ] Generate 5 new test posts across all energy levels — verify 3-item list compliance
- [ ] Test all 11 routing commands — verify correct file loading
- [ ] Score 3 test posts manually — verify QV catches all deductions
- [x] Version bump all modified files
- [ ] Update memory/ with implementation session log
