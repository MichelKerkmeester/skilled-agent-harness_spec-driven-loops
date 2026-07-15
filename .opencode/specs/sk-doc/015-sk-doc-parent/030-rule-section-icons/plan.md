---
title: "Implementation Plan: Rule-section icon standardization across SKILL.md files"
description: "Apply ✅/⛔/⚠️ icons to ALWAYS/NEVER/ESCALATE IF headers across every SKILL.md via one idempotent sweep script, unify pre-existing ❌ to ⛔, and re-validate the sk-doc packaging sweep plus every affected parent hub."
trigger_phrases:
  - "rule section icons plan"
  - "014 sk-doc phase 030 plan"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/030-rule-section-icons"
    last_updated_at: "2026-07-14T17:24:30.985Z"
    last_updated_by: "claude-opus"
    recent_action: "Sweep applied and validated"
    next_safe_action: "Ship with the sk-doc router commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rule-section icon standardization across SKILL.md files

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Rule sections (`## RULES` → `### ALWAYS / ### NEVER / ### ESCALATE IF`) recur across the SKILL.md fleet. 13 files already carried `✅/❌/⚠️`; the rest were plain. A single idempotent Python sweep normalizes every rule header to `✅ ALWAYS · ⛔ NEVER · ⚠️ ESCALATE IF`, converting the stray `❌` to `⛔`.

### Overview
Match only headers whose text IS the rule keyword (plus `… Rules` / combined `ALWAYS / NEVER (…)` variants); leave incidental prose headers alone. Re-validate that icons on H3 headers do not disturb H2 section detection.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Glyph set + scope confirmed with operator (✅/⛔/⚠️, no shield on RULES; all SKILL.md).

### Definition of Done
- Sweep applied idempotently; sk-doc sweep 11/11 PASS; every affected parent hub passes `parent-skill-check.cjs` STRICT.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A header-only transform, anchored so only rule-keyword headers match:
- `ALWAYS` (+ optional `Rules`) → `✅`; `NEVER` (+ optional `Rules`) → `⛔`; `ESCALATE`(+`IF`) → `⚠️`.
- Combined `ALWAYS / NEVER (…)` → `✅ ALWAYS / ⛔ NEVER (…)`.
- Existing leading glyphs are stripped and re-applied, making the sweep idempotent and unifying `❌`→`⛔`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory rule-header patterns across all SKILL.md; author the idempotent sweep script.

### Phase 2: Core Implementation
- Dry-run, then apply the sweep; re-trim create-benchmark to stay under the word cap.

### Phase 3: Verification
- Idempotency re-run (0 changes); sk-doc packaging sweep; `parent-skill-check.cjs` on affected hubs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Idempotency: re-run the sweep, expect 0 changes.
- sk-doc: `package_skill.py <pkt> --check --strict` for all 11 packets.
- Parent hubs: `parent-skill-check.cjs <hub>` STRICT on sk-doc, sk-design, sk-prompt, system-deep-loop.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `package_skill.py` (sk-doc packaging) and `parent-skill-check.cjs` (hub contract) as regression gates.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Header-only cosmetic change confined to SKILL.md files in an isolated worktree; `git restore` the affected files to revert. No runtime or data impact.
<!-- /ANCHOR:rollback -->
