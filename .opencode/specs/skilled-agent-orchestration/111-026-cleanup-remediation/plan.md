---
title: "Implementation Plan: 111 026 cleanup remediation"
description: "Sequenced 7-wave execution plan with cli-devin SWE-1.6 at 3 dispatch points and main agent for mechanical renumbers."
trigger_phrases:
  - "111 plan"
  - "026 cleanup wave 3 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/111-026-cleanup-remediation"
    last_updated_at: "2026-05-16T11:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Rewrote plan.md against canonical L1 template"
    next_safe_action: "Backfill implementation-summary"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000112"
      session_id: "111-plan-rewrite"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 111 026 cleanup remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language | Bash + jq + sed (rename mechanics) |
| Author | cli-devin SWE-1.6 (W3.A, W3.E, W3.F) + main agent (W3.B/C/D/G) |
| Storage | git-tracked spec dirs under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` |
| Testing | `validate.sh --strict` + filesystem listing match + orphan-ref grep |

### Overview

Remediate 4 cleanup gaps surfaced post-107/109 restructure: 11 missing sub-phase base files, 86 sub-phase + 22 parent children needing sequential renumber, 2 014 dup-prefix pairs, ~25 verbose names. Per-operation atomic commit, per-wave HEAD baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit complete: 4 gaps surfaced and re-verified
- [x] Plan approved by user (plan-mode exit)
- [x] cli-devin v1.0.4.1 recipe in place

### Definition of Done
- [ ] All 11 sub-phases have spec.md + description.json + graph-metadata.json
- [ ] All 11 sub-phases have sequential 001..N children
- [ ] 007/013/014 children sequential; zero dup-prefix pairs under 014
- [ ] 17 phase-parent children_ids match filesystem
- [ ] 0 orphan references on active surface
- [ ] strict-validate exits 0 on 026 phase parent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequenced sub-waves W3.A through W3.G on main; per-rename atomic commit; cli-devin SWE-1.6 at substantive-judgment dispatch points; main agent mechanical for git mv + sed sweeps.

### Key Components
- cli-devin SWE-1.6: Authors W3.A base files, scores W3.E verbose names, syncs W3.F parent docs.
- Apply scripts: Mechanical git mv + sed cross-ref sweep + atomic commit.
- Validator: validate.sh --strict --recursive runs in W3.G.

### Data Flow
README + parent spec.md → cli-devin authoring → 33 base files. Filesystem listing → main agent rename plan → atomic git mv + sed sweep → parent doc sync → strict-validate gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### W3.A — Author 33 sub-phase base files (cli-devin × 11)
Each agent reads its sub-phase README + parent + golden reference → emits spec.md + description.json + graph-metadata.json. 11 commits.

### W3.B — Renumber 86 sub-phase children (main agent)
Per-rename atomic: rg-capture refs → sed sweep → git mv → stage outside refs → commit. 86 commits.

### W3.C — Renumber 22 children in 007/013/014 (main agent)
Same protocol as W3.B; 007 sparse to 001-018; 013 missing 002 to 001-004; 014 simple gap fixes only. 20 commits actual.

### W3.D — Resolve 014 dup-prefix pairs (main agent, 2-pass)
014 has 2 dup pairs at 026 and 040. Pass-A renames affected entries to _NNN- temp; pass-B strips underscore. 24 commits (12 pass-A + 12 pass-B).

### W3.E — Verbose name cleanup (cli-devin scorer + main agent apply)
cli-devin scores 88 verbose names with L/R/G/I rubric, emits evidence/proposed-renames.md. Main agent applies threshold >= 5 renames (~14 actual). 15 commits.

### W3.F — Sync 17 phase-parent docs (cli-devin + main agent)
cli-devin re-derives children_ids + PHASE CHILDREN tables for sub-phases + grandparents. Main agent syncs remaining 4 parents (007/013/014/root) via jq. 2 commits.

### W3.G — Final validation gate (main agent)
strict-validate + orphan-ref check + backfill implementation-summary. 0-5 commits.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Per-rename: sed cross-ref sweep on captured rg listing; git mv handles the rename + content; outside-ref files staged explicitly.
- Per-sub-phase: validate_document.py exit 0 on the 3 base files.
- Per-wave: count check (commits since baseline).
- Final: validate.sh --strict --recursive on 026 phase parent; orphan-ref grep returns 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 107 (Wave 1) and 109 (Wave 2): structural restructure complete.
- cli-devin v1.0.4.1 recipe with sequential_thinking mandate and narrow Write scopes.
- validate.sh v3.0.0 in .opencode/skills/system-spec-kit/scripts/spec/.
- jq, rg, sed, git on PATH.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-wave HEAD baselines captured in evidence/per-wave-baselines.txt. Each rename is one atomic commit; rollback is git revert <commit> or git reset --hard <baseline> for a whole wave (operator-driven; never auto). Cross-ref sed sweeps are recorded in their commit diff so single-commit revert is safe.
<!-- /ANCHOR:rollback -->
