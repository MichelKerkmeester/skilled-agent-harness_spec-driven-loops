<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist — TikTok System Audit

## Metadata

| Field | Value |
|-------|-------|
| Spec ID | 003-tiktok-audit |
| Total Checks | 20 |
| Created | 2026-02-10 |

---

## P0 — CRITICAL Checks

### CHK-01: CONTENT Scoring Consistency (C-01)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | System Prompt Rule 30 says `Z/37` (not Z/35) | Screenshot or grep of line | ☐ |
| 2 | System Prompt §11 Quick Check shows Originality as `/7` | Screenshot or grep of line | ☐ |
| 3 | System Prompt §11 Quick Check total shows `__/37` | Screenshot or grep of line | ☐ |
| 4 | `grep -r "/35" "knowledge base/system/"` returns 0 results | Command output | ☐ |
| 5 | DEPTH Framework §8 still says 37 (no regression) | Content verification | ☐ |

### CHK-02: Interactive Mode Loading Condition (C-02)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Interactive Mode file header says `Loading Condition: ALWAYS` | File header content | ☐ |
| 2 | Matches System Prompt §4 loading table | Cross-reference | ☐ |

### CHK-03: AGENTS.md Step 1 Completeness (C-03, C-04)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | AGENTS.md Step 1 lists `TikTok - Context - Brand` | Line in AGENTS.md | ☐ |
| 2 | AGENTS.md Step 1 lists `TikTok - Rules - Human Voice` | Line in AGENTS.md | ☐ |
| 3 | All 5 ALWAYS docs from System Prompt §4 appear in AGENTS.md Step 1 | Cross-reference table | ☐ |
| 4 | Symlinks resolve correctly: `ls -la "knowledge base/context/TikTok - Context - Brand"` | Command output | ☐ |
| 5 | Symlinks resolve correctly: `ls -la "knowledge base/rules/TikTok - Rules - Human Voice"` | Command output | ☐ |

### CHK-04: Canonical Stats Registry Integration (C-05)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Symlink exists: `knowledge base/context/TikTok - Context - Canonical Stats Registry - v0.110.md` | `ls -la` output | ☐ |
| 2 | Symlink resolves to Global registry file | Symlink target verification | ☐ |
| 3 | AGENTS.md references registry in loading instructions | Line in AGENTS.md | ☐ |
| 4 | System Prompt §9 has "registry takes precedence" note | Content verification | ☐ |

---

## P1 — HIGH Checks

### CHK-05: Brand Voice Alignment (H-01)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | AGENTS.md contains "Simple, Empowering, Real" | Grep result | ☐ |
| 2 | No occurrence of "Simple, Scalable, Effective" remains | Grep result (0 matches) | ☐ |
| 3 | Values match Global Brand Context §7 | Cross-reference | ☐ |

### CHK-06: Em Dash Removal (H-02)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | No em dashes (—) in System Prompt voice examples | Grep result | ☐ |
| 2 | Replacement sentence reads naturally | Content review | ☐ |
| 3 | `grep -r "—" "knowledge base/system/"` returns 0 in example sections | Command output | ☐ |

### CHK-07: Gen Z Search Stat (H-03)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | DEPTH Framework state YAML says `64% (Adobe Survey, 2024)` | Content verification | ☐ |
| 2 | No occurrence of "40-74%" remains in DEPTH Framework | Grep result | ☐ |
| 3 | Value matches Canonical Stats Registry | Cross-reference | ☐ |

### CHK-08: Registry Precedence Note (H-04)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | System Prompt §9 has note about registry taking precedence | Content verification | ☐ |
| 2 | DEPTH Framework state YAML has note about registry as canonical source | Content verification | ☐ |

### CHK-09: Global Market Cross-Reference (H-05)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Comparison document created or decision recorded | Document or decision record | ☐ |
| 2 | No conflicting data between Global Market and TikTok context files | Comparison evidence | ☐ |

---

## P2 — MEDIUM Checks

### CHK-10: Processing Hierarchy Order (M-01)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | AGENTS.md §5 shows Validation before Response | Content verification | ☐ |
| 2 | Order matches DEPTH Framework pre-delivery requirements | Cross-reference | ☐ |

### CHK-11: Extension Version Review (M-02, M-06)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Brand Extensions reviewed against v0.110 base | Review notes | ☐ |
| 2 | Human Voice Extensions reviewed against v0.100 base | Review notes | ☐ |
| 3 | Stale references identified and updated | Change list | ☐ |
| 4 | Version numbers bumped if content updated | Version number in files | ☐ |

### CHK-12: Semantic Topic Registry Note (M-03)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Maintenance note added to System Prompt §10.3 | Content verification | ☐ |

### CHK-13: $quick Perspective Exception (M-04)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | System Prompt Rule 7 mentions $quick exception | Content verification | ☐ |
| 2 | DEPTH Framework perspective rules mention $quick exception | Content verification | ☐ |
| 3 | No contradiction between Rules 4 and 7 | Cross-reference | ☐ |

### CHK-14: Token Budget Table (M-05)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Token budget estimates documented for ALWAYS-load documents | Table or document | ☐ |
| 2 | Total estimated token cost for Step 1 loading documented | Calculation | ☐ |

---

## P3 — LOW Checks

### CHK-15: Export Naming Convention (L-01)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Convention documented (use lowercase framework name) | Documentation location | ☐ |

### CHK-16: Step 0 Conditional Check (L-02)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Step 0 only triggers when context/ has non-README content | AGENTS.md content | ☐ |

### CHK-17: Framework Canonical Source Note (L-03)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | System Prompt §6 references Context - Frameworks as canonical | Content verification | ☐ |

### CHK-18: Sequential Thinking Documentation (L-04)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Relationship between Sequential Thinking MCP and DEPTH documented | Content verification | ☐ |

### CHK-19: SCOPE/CONTENT Disambiguation (L-05)

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | Disambiguation note present in DEPTH Framework | Content verification | ☐ |

---

## Post-Implementation Checks

### CHK-20: Version Bumps and Final Verification

| # | Check | Evidence Required | Status |
|---|-------|-------------------|--------|
| 1 | System Prompt version bumped to v0.122 | File header | ☐ |
| 2 | DEPTH Framework version bumped to v0.112 | File header | ☐ |
| 3 | Interactive Mode version bumped to v0.111 | File header | ☐ |
| 4 | All modified extension files version bumped | File headers | ☐ |
| 5 | Full grep verification passes (no /35, no stale stats, no em dashes in examples) | Command outputs | ☐ |
| 6 | All symlinks resolve correctly | `ls -la` outputs | ☐ |
| 7 | implementation-summary.md created | File exists | ☐ |

---

## Summary

| Priority | Checks | Items | Status |
|----------|:------:|:-----:|--------|
| P0 (CRITICAL) | CHK-01 to CHK-04 | 16 | ☐ Not Started |
| P1 (HIGH) | CHK-05 to CHK-09 | 12 | ☐ Not Started |
| P2 (MEDIUM) | CHK-10 to CHK-14 | 10 | ☐ Not Started |
| P3 (LOW) | CHK-15 to CHK-19 | 5 | ☐ Not Started |
| Post-Implementation | CHK-20 | 7 | ☐ Not Started |
| **Total** | **20 checks** | **50 items** | |
