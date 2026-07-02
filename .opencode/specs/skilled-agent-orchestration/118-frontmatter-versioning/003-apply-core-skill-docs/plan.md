---
title: "Implementation Plan: Phase 3 - Apply Core Skill Docs"
description: "Phase 3 planned the manifest-driven versioning pass for core skill docs, including SKILL.md normalization, README/reference/asset updates, and deterministic verification. The phase is complete with 457 core docs verified."
trigger_phrases:
  - "apply core skill docs plan"
  - "SKILL.md version normalize plan"
  - "core docs verify plan"
  - "manifest core apply plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/003-apply-core-skill-docs"
    last_updated_at: "2026-07-02T05:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold frontmatter with authored phase plan"
    next_safe_action: "Run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/*/SKILL.md"
      - ".opencode/skills/*/README.md"
      - ".opencode/skills/*/references"
      - ".opencode/skills/*/assets"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediated-003-apply-core-skill-docs-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "MiMo audits read-only; the deterministic engine writes and verifies every result."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 - Apply Core Skill Docs

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node engine over Markdown frontmatter |
| **Framework** | sk-doc versioning engine; cli-opencode for a read-only audit |
| **Storage** | None (files on disk; a precomputed manifest) |
| **Testing** | Engine verify and gate modes; the unit suite; a read-only model audit |

### Overview
This phase applied the engine's computed version to the core slice of the corpus, the SKILL.md, README, references, and assets under every skill. The approach was to compute the whole corpus once into a manifest, then apply only the core slice straight from that manifest with no further git so the apply was instant, with the deterministic engine as the sole writer and a read-only model pass plus the gate mode as the second check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (core docs carry no consistent version; some SKILL.md are 3-part or stale)
- [x] Success criteria measurable (verify reports zero mismatches; no SKILL.md remains 3-part)
- [x] Dependencies identified (phase 2 engine and dry-run manifest; phase 1 standard)

### Definition of Done
- [x] All acceptance criteria met (core docs versioned; SKILL.md normalized and reconciled; frontmatter intact)
- [x] Tests passing (verify and gate exit 0; unit suite green; read-only audit confirmed)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Compute-once, apply-from-manifest: the expensive git compute runs once for the whole corpus, and each phase applies its slice from the stored manifest with the engine as ground-truth writer.

### Key Components
- **Core-slice apply**: the engine inserts or normalizes the 4-part version across SKILL.md, README, references, and assets under every skill, reading values from the precomputed manifest rather than re-running git.
- **SKILL.md reconciliation**: stale files move up to their changelog anchor and the 3-part files are canonicalized to 4-part; frontmatter-less docs are skipped because a versioning pass never synthesizes a frontmatter block.
- **Two-pass check**: deterministic verify and gate confirm every value, and a read-only model audit reviews a skill's docs as an in-the-loop second pass without writing anything.

### Data Flow
The engine reads each core doc's computed version from the manifest, inserts or normalizes it line-wise, then verify and gate re-read every file; the read-only audit observes a sample and reports, but only the engine mutates files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Computed the full corpus once into a manifest (the heavy git pass), then scoped the apply to the core classes
- [x] Confirmed the read-only audit transport, keeping the model out of the write path

### Phase 2: Core Implementation
- [x] Applied the core slice from the manifest: inserted version on fresh docs, normalized 3-part files, reconciled stale SKILL.md to the changelog anchor
- [x] Skipped frontmatter-less core docs rather than synthesizing a block
- [x] Fixed a normalization skip bug where a 3-part value was being treated as already equal after normalization, leaving the malformed value on disk

### Phase 3: Verification
- [x] Ran verify and gate over the core classes to confirm every value and surface the skip set
- [x] Ran the unit suite, adding a 3-part-normalization regression case
- [x] Ran a read-only model audit on one skill to confirm asset, reference, and README values were correct, 4-part, last-key, with the trigger array intact
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Engine compute/insert/normalize, including the 3-part regression | Fixture harness (Node) |
| Integration | verify and gate over the core-class slice | Engine verify and gate modes |
| Manual | Read-only model audit of one skill's versioned docs | cli-opencode (read-only) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 engine and manifest | Internal | Green | Supplies the computed values and the apply/verify/gate modes |
| Phase 1 standard | Internal | Green | Defines the 4-part format and the changelog anchor |
| Read-only model transport | External | Green | In-the-loop reviewer only; never writes, so a failure does not risk the corpus |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: verify or gate reports a mismatch or corrupted frontmatter after apply.
- **Procedure**: Re-run the engine from the manifest to reconcile, or revert the touched docs by git; insertion is line-wise and idempotent, so an over-apply backs out by removing the single inserted line. The normalization fix was re-applied and re-gated to green this way.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
