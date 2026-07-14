---
title: "Feature Specification: sk-doc Packet Smart Routing Conformance"
description: "Normalize the 8 non-conformant sk-doc packet SKILL.md files so each passes the canonical create-skill section contract (package_skill.py --check): split the merged 'WHEN TO USE + SMART_ROUTING' header into separate WHEN TO USE and SMART ROUTING H2s, ensure a REFERENCES H2, add missing keyword-trigger and SUCCESS CRITERIA content, renumber, version-bump, and changelog. Fix the files, not the validator."
trigger_phrases:
  - "sk-doc smart routing conformance"
  - "package_skill.py check sk-doc packets"
  - "sk-doc SKILL.md section contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/009-packet-smart-routing-conformance"
    last_updated_at: "2026-07-14T08:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "7/7 packets normalized + verified PASS; committed on the goal worktree branch"
    next_safe_action: "create-benchmark normalization completes in 016; then terminal gates"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-doc Packet Smart Routing Conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/015-sk-doc-router-alignment` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The canonical nested-packet SKILL.md contract is defined by `.opencode/skills/sk-doc/create-skill/SKILL.md` and enforced by its machine checker `create-skill/scripts/package_skill.py` (REQUIRED_SECTIONS: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES; matched by case-insensitive substring on H2 text after stripping a leading `N.`). Baseline `package_skill.py --check` confirms 8 of 10 packets FAIL: create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-benchmark, create-changelog, create-quality-control merge the header as `## N. WHEN TO USE + SMART_ROUTING` — the underscore means the string "SMART ROUTING" (space) is never present, so the SMART ROUTING requirement fails; create-flowchart lacks a REFERENCES H2. Only create-skill and create-readme pass.

**Purpose:** bring all 10 packets to `--check` PASS by normalizing the files to the canon, not by weakening the checker.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the 7 non-benchmark failing packet SKILL.md files (create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-changelog, create-quality-control, create-flowchart) plus their packet-local changelogs and version bumps. create-benchmark's SKILL.md normalization is executed together with 016 (which rewrites the same file) but its `--check` PASS is a success criterion here too.

**Out of scope:** the checker `package_skill.py` (do NOT alias the merged header); `mode-registry.json` / `hub-router.json` / `description.json` advisor vocabulary (ratchet-guarded); the parent `sk-doc/SKILL.md` router logic beyond a stale-layout prose fix; any non-sk-doc skill.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: Each failing packet's merged header is split into `## N. WHEN TO USE` and `## N+1. SMART ROUTING`; existing decision rules / routing tables move under SMART ROUTING.
- R2: Each packet carries an H2 whose text contains "REFERENCES" (promote/rename OVERFLOW REFERENCES, RESOURCES FOR DEEP DETAIL, or a prose pointer).
- R3: Add missing `Keyword triggers:` lines (create-agent, create-manual-testing-playbook) and SUCCESS CRITERIA where absent, to clear recommended-section warnings.
- R4: H2s renumbered contiguously; RULES keeps ALWAYS/NEVER/ESCALATE; each packet's 4-part version bumped and a packet changelog entry added.
- R5: No inbound `SKILL.md#anchor` links break from renumbering (verified by the link checker).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py <packet> --check` PASS for all 10 packets.
- `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` clean.
- `validate_document.py` passes on every edited SKILL.md.
- No advisor registry/router/description.json change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Renumbering H2s could break inbound anchor links — mitigated by the markdown-link checker gate.
- create-benchmark/SKILL.md is co-edited by 016; sequence 016's rewrite to also satisfy R1/R2 so the file is normalized once.
- Advisor vocab must stay untouched (concurrent tuning + ratchet).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Fix-files-not-checker decision is set by the goal; the substring-match root cause is confirmed against `package_skill.py:232-241`.
<!-- /ANCHOR:questions -->
