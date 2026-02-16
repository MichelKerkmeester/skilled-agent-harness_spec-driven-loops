# Verification Checklist: Task 01 — README Audit & Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## P0 — High-Traffic READMEs

- [ ] CHK-001 [P0] `.opencode/skill/system-spec-kit/README.md` audited for 5-source, 7 intents, schema v13, document-type scoring
- [ ] CHK-002 [P0] `.opencode/skill/system-spec-kit/mcp_server/README.md` audited for same + includeSpecDocs parameter
- [ ] CHK-003 [P0] `.opencode/README.md` statistics table verified (counts accurate)

## P1 — Sub-Directory READMEs

- [ ] CHK-010 [P1] All mcp_server/lib/ READMEs audited (17 files)
- [ ] CHK-011 [P1] All scripts/ READMEs audited (16 files)
- [ ] CHK-012 [P1] All templates/ READMEs audited (10 files)
- [ ] CHK-013 [P1] All shared/ READMEs audited (4 files)
- [ ] CHK-014 [P1] `.opencode/skill/README.md` verified current
- [ ] CHK-015 [P1] `.opencode/install_guides/README.md` verified
- [ ] CHK-016 [P1] All workflow skill READMEs audited (6 files)
- [ ] CHK-017 [P1] All MCP skill READMEs audited (2 files)

## P2 — HVR + Anchor Compliance

- [ ] CHK-020 [P2] All 60+ system-spec-kit READMEs have anchor tag pairs
- [ ] CHK-021 [P2] No HVR violations in any README
- [ ] CHK-022 [P2] YAML frontmatter present on all READMEs

## Output Verification

- [ ] CHK-030 [P0] changes.md populated with all required edits
- [ ] CHK-031 [P0] No placeholder text in changes.md
- [ ] CHK-032 [P1] Each change has before/after text
- [ ] CHK-033 [P1] Each change has priority assignment

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | /5 |
| P1 Items | 10 | /10 |
| P2 Items | 3 | /3 |

**Verification Date**: ____
