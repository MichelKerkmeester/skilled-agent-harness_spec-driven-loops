<!-- SPECKIT_LEVEL: 2 -->

# Tasks — TikTok System Audit Fixes

## Metadata

| Field | Value |
|-------|-------|
| Spec ID | 003-tiktok-audit |
| Total Tasks | 20 |
| Phases | 4 |
| Created | 2026-02-10 |

---

## Phase 1: CRITICAL Fixes

| # | Task | File(s) | Finding | Priority | Status | Checklist |
|---|------|---------|---------|----------|--------|-----------|
| 1.1 | Replace `CONTENT: Z/35` with `CONTENT: Z/37` in Rule 30 | System Prompt §2 | C-01 | P0 | ☐ Pending | CHK-01 |
| 1.2 | Fix Quick Check: Originality from /5 to /7 | System Prompt §11 | C-01 | P0 | ☐ Pending | CHK-01 |
| 1.3 | Fix Quick Check: Total from /35 to /37 | System Prompt §11 | C-01 | P0 | ☐ Pending | CHK-01 |
| 1.4 | Change Interactive Mode header from `TRIGGER` to `ALWAYS` | Interactive Mode header | C-02 | P0 | ☐ Pending | CHK-02 |
| 1.5 | Add base Human Voice Rules to AGENTS.md Step 1 | AGENTS.md | C-03 | P0 | ☐ Pending | CHK-03 |
| 1.6 | Add base Brand Context to AGENTS.md Step 1 | AGENTS.md | C-04 | P0 | ☐ Pending | CHK-03 |
| 1.7 | Create symlink for Canonical Stats Registry | knowledge base/context/ | C-05 | P0 | ☐ Pending | CHK-04 |
| 1.8 | Add Canonical Stats Registry to AGENTS.md loading | AGENTS.md | C-05 | P0 | ☐ Pending | CHK-04 |

**Phase Gate:** All 8 tasks complete → grep verification passes → Proceed to Phase 2

---

## Phase 2: HIGH Priority Fixes

| # | Task | File(s) | Finding | Priority | Status | Checklist |
|---|------|---------|---------|----------|--------|-----------|
| 2.1 | Change "Simple, Scalable, Effective" to "Simple, Empowering, Real" | AGENTS.md §4 | H-01 | P1 | ☐ Pending | CHK-05 |
| 2.2 | Rewrite voice example to remove em dash | System Prompt §2 | H-02 | P1 | ☐ Pending | CHK-06 |
| 2.3 | Fix gen_z_search from "40-74%" to "64% (Adobe Survey, 2024)" | DEPTH Framework state YAML | H-03 | P1 | ☐ Pending | CHK-07 |
| 2.4 | Add "registry takes precedence" note to System Prompt §9 | System Prompt §9 | H-04 | P1 | ☐ Pending | CHK-08 |
| 2.5 | Compare Global Market TikTok data vs local context files | Global Market, Context Platform, Context Strategy | H-05 | P1 | ☐ Pending | CHK-09 |

**Phase Gate:** All 5 tasks complete → stat cross-reference verified → Proceed to Phase 3

---

## Phase 3: MEDIUM Priority Fixes

| # | Task | File(s) | Finding | Priority | Status | Checklist |
|---|------|---------|---------|----------|--------|-----------|
| 3.1 | Reorder processing hierarchy (validate before response) | AGENTS.md §5 | M-01 | P2 | ☐ Pending | CHK-10 |
| 3.2 | Review Brand Extensions v0.100 against v0.110 base | Brand Extensions | M-02/M-06 | P2 | ☐ Pending | CHK-11 |
| 3.3 | Review Human Voice Extensions v0.100 against v0.100 base | HV Extensions | M-02 | P2 | ☐ Pending | CHK-11 |
| 3.4 | Add maintenance note to Semantic Topic Registry | System Prompt §10.3 | M-03 | P2 | ☐ Pending | CHK-12 |
| 3.5 | Add $quick exception to Rule 7 and DEPTH Framework | System Prompt §2, DEPTH Framework §3 | M-04 | P2 | ☐ Pending | CHK-13 |
| 3.6 | Create token budget estimate table | New section or note | M-05 | P2 | ☐ Pending | CHK-14 |

**Phase Gate:** All 6 tasks complete → version review documented → Proceed to Phase 4

---

## Phase 4: LOW Priority Fixes

| # | Task | File(s) | Finding | Priority | Status | Checklist |
|---|------|---------|---------|----------|--------|-----------|
| 4.1 | Document export naming convention (use framework name) | AGENTS.md or System Prompt | L-01 | P3 | ☐ Pending | CHK-15 |
| 4.2 | Make Step 0 conditional on folder content | AGENTS.md Step 0 | L-02 | P3 | ☐ Pending | CHK-16 |
| 4.3 | Add "full specs in Context - Frameworks" note to §6 | System Prompt §6 | L-03 | P3 | ☐ Pending | CHK-17 |
| 4.4 | Document Sequential Thinking vs DEPTH relationship | AGENTS.md §1 | L-04 | P3 | ☐ Pending | CHK-18 |
| 4.5 | Add SCOPE/CONTENT disambiguation note | DEPTH Framework §5 or §8 | L-05 | P3 | ☐ Pending | CHK-19 |

**Phase Gate:** All 5 tasks complete → Phase 4 done

---

## Post-Implementation

| # | Task | File(s) | Priority | Status | Checklist |
|---|------|---------|----------|--------|-----------|
| 5.1 | Version bump all modified files | All modified files | P1 | ☐ Pending | CHK-20 |
| 5.2 | Run full cross-document consistency verification | All TikTok system files | P1 | ☐ Pending | CHK-20 |
| 5.3 | Create implementation-summary.md | specs/005-tiktok-seo/001-system-audit/ | P2 | ☐ Pending | — |

---

## Summary

| Phase | Tasks | Priority | Status |
|-------|:-----:|----------|--------|
| Phase 1: CRITICAL | 8 | P0 | ☐ Not Started |
| Phase 2: HIGH | 5 | P1 | ☐ Not Started |
| Phase 3: MEDIUM | 6 | P2 | ☐ Not Started |
| Phase 4: LOW | 5 | P3 | ☐ Not Started |
| Post-Implementation | 3 | P1-P2 | ☐ Not Started |
| **Total** | **27** | | |
