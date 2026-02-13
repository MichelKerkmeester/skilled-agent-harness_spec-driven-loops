<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — TikTok System Audit Fixes

## Metadata

| Field | Value |
|-------|-------|
| Spec ID | 003-tiktok-audit |
| Phase | Implementation |
| Created | 2026-02-10 |

---

## Phase 1: CRITICAL Fixes (Scoring & Loading)

**Goal:** Eliminate all CRITICAL cross-document contradictions.
**Estimated effort:** 1-2 hours

### 1.1 Fix CONTENT Scoring (C-01)

**File:** `knowledge base/system/TikTok - System - Prompt - v0.121.md`

| Location | Current | Change To |
|----------|---------|-----------|
| Section 2 Rule 30 | `CONTENT: Z/35` | `CONTENT: Z/37` |
| Section 11 Quick Check: Originality | `/5` | `/7` |
| Section 11 Quick Check: Total | `__/35` | `__/37` |

**Verification:** `grep -r "/35" "knowledge base/system/"` should return 0 matches after fix.

### 1.2 Fix Interactive Mode Loading Condition (C-02)

**File:** `knowledge base/system/TikTok - System - Interactive Mode - v0.110.md`

| Location | Current | Change To |
|----------|---------|-----------|
| File header, Loading Condition | `TRIGGER` | `ALWAYS` |

**Verification:** Loading Condition in header matches System Prompt Section 4 table.

### 1.3 Add Missing Base Documents to AGENTS.md (C-03, C-04)

**File:** `AGENTS.md` Step 1

Add to the mandatory reading list:
```
- `knowledge base/context/TikTok - Context - Brand - v0.110.md` - Core brand identity (symlink to Global)
- `knowledge base/rules/TikTok - Rules - Human Voice - v0.110.md` - Base Human Voice Rules (symlink to Global)
```

**Verification:** AGENTS.md Step 1 list matches System Prompt Section 4 "ALWAYS" documents.

### 1.4 Integrate Canonical Stats Registry (C-05)

**Actions:**
1. Create symlink: `knowledge base/context/TikTok - Context - Canonical Stats Registry - v0.110.md` → `../../../0. Global (Shared)/context/Context - Canonical Stats Registry - v0.110.md`
2. Add to AGENTS.md Step 1 or Step 2 loading instructions
3. Add note to System Prompt Section 9: "Canonical values maintained in Context - Canonical Stats Registry. Local table is a subset for quick reference."

**Verification:** `ls -la "knowledge base/context/"` shows symlink. Registry referenced in AGENTS.md.

---

## Phase 2: HIGH Priority Fixes

**Goal:** Fix brand alignment, rule violations, and data conflicts.
**Estimated effort:** 1 hour

### 2.1 Fix Brand Voice Values (H-01)

**File:** `AGENTS.md` Section 4

| Current | Change To |
|---------|-----------|
| "Match Barter voice: Simple, Scalable, Effective" | "Match Barter voice: Simple, Empowering, Real" |

### 2.2 Fix Em Dash in Voice Example (H-02)

**File:** `knowledge base/system/TikTok - System - Prompt - v0.121.md` Section 2

| Current | Change To |
|---------|-----------|
| `"Creator content outperforms brand content by 159%—and most brands are ignoring this."` | `"Creator content outperforms brand content by 159%. And most brands are ignoring this."` |

### 2.3 Fix Gen Z Search Stat (H-03)

**File:** `knowledge base/system/TikTok - Thinking - DEPTH Framework - v0.111.md`

| Current (state YAML) | Change To |
|----------------------|-----------|
| `gen_z_search: "40-74% use TikTok for search"` | `gen_z_search: "64% (Adobe Survey, 2024)"` |

### 2.4 Add Stat Source Notes (H-04)

**Files:** System Prompt Section 9, DEPTH Framework state YAML

Add header note to System Prompt Section 9:
> "Quick-reference subset. Canonical source: `Context - Canonical Stats Registry - v0.110.md`. If discrepancy exists, the registry takes precedence."

### 2.5 Cross-Reference Global Market Data (H-05)

**Action:** Compare TikTok-specific sections in Global Market file against Context - Platform and Context - Strategy. Document any unique data in Market not present in TikTok files. Decision needed: symlink or manual cross-reference.

---

## Phase 3: MEDIUM Priority Fixes

**Goal:** Fix validation ordering, version drift, and fragile references.
**Estimated effort:** 1-2 hours

### 3.1 Fix Processing Hierarchy (M-01)

**File:** `AGENTS.md` Section 5

Reorder:
```
5. Create Deliverable
6. Validate Output (run validation checklist)
7. EXPORT (BLOCKING)
8. Response
```

### 3.2 Version Review of v0.100 Files (M-02, M-06)

**Files:** Brand Extensions v0.100, Human Voice Extensions v0.100

- Review content against current v0.110 base documents
- Check for stale references, outdated overrides
- Bump version to v0.110 if content is current or after updates

### 3.3 Semantic Topic Registry Note (M-03)

**File:** System Prompt Section 10.3

Add maintenance note:
> "Section IDs are based on document structure as of v0.110. When target documents are restructured, update IDs here."

### 3.4 $quick Perspective Exception (M-04)

**Files:** System Prompt Rule 7, DEPTH Framework perspective rules

Add to Rule 7: "(Exception: $quick mode requires 1-2 perspectives; see Rule 4)"
Add to DEPTH Framework perspective section: "Note: $quick mode waives the 3-perspective blocking requirement. 1-2 perspectives are sufficient for abbreviated output."

### 3.5 Token Budget Documentation (M-05)

**Action:** Create a token budget estimate table for ALWAYS-load documents:

| Document | Estimated Tokens | Notes |
|----------|:---:|-------|
| System Prompt v0.121 | ~12,000 | Largest file (49KB) |
| DEPTH Framework v0.111 | ~8,500 | Second largest (34KB) |
| Interactive Mode v0.110 | ~5,300 | |
| Context - Brand (Global) | ~3,000 | Via symlink |
| Rules - Human Voice (Global) | ~4,000 | Via symlink |
| **Total Step 1** | **~32,800** | Before any command-specific loading |

---

## Phase 4: LOW Priority Fixes

**Goal:** Standardise conventions and improve UX.
**Estimated effort:** 30 minutes

### 4.1 Export Naming Convention (L-01)

Document standard: Use lowercase framework name (insight, trend, guide, news) not command name. Existing files grandfathered.

### 4.2 Step 0 Context Folder Check (L-02)

Make conditional: "IF context/ folder contains files other than README.md, THEN ask user."

### 4.3 Framework Definition Canonicalisation (L-03)

Add note to System Prompt Section 6: "Summary definitions. Full framework specifications in Context - Frameworks."

### 4.4 Sequential Thinking Documentation (L-04)

Add note to AGENTS.md: "Sequential Thinking MCP is for complex multi-step planning. DEPTH methodology is for content creation. Use Sequential Thinking for strategy/planning tasks, DEPTH for content generation."

### 4.5 SCOPE/CONTENT Disambiguation (L-05)

Add note to DEPTH Framework: "SCOPE-Context = structural layers (platform, audience, competitive). CONTENT-Context = terminology correctness and platform-native language."

---

## Version Bump Strategy

After all fixes applied:

| File | Current | New Version | Reason |
|------|---------|-------------|--------|
| AGENTS.md | (none) | Add v0.110 | Add version tracking |
| System Prompt | v0.121 | v0.122 | Scoring fix, em dash fix |
| DEPTH Framework | v0.111 | v0.112 | Stat fix, $quick exception |
| Interactive Mode | v0.110 | v0.111 | Loading condition fix |
| Brand Extensions | v0.100 | v0.110 | Post-review alignment |
| HV Extensions | v0.100 | v0.110 | Post-review alignment |

---

## Rollback Plan

All changes are to markdown documentation files. Rollback approach:
1. Git revert to pre-fix commit
2. No database/API/infrastructure dependencies
3. No deployment pipeline — changes take effect on next AI session

---

## Testing Strategy

### Cross-Document Consistency Verification

After each phase, run:
1. `grep -r "/35" "4. TikTok SEO & Creative Strategy/"` — should return 0 (Phase 1)
2. Verify all ALWAYS docs in System Prompt §4 appear in AGENTS.md Step 1
3. Verify symlinks: `ls -la "knowledge base/context/" "knowledge base/rules/"`
4. Cross-check stats between System Prompt §9, DEPTH Framework state YAML, and Canonical Stats Registry
5. Search for em dashes: `grep -r "—" "knowledge base/system/"` — voice examples should be clean

### Functional Verification

After all phases:
1. Start fresh AI session with TikTok system
2. Verify all Step 1 documents load without error
3. Run `$blog` command and verify CONTENT scoring uses /37
4. Run `$quick` command and verify 1-2 perspective requirement
5. Check artifact export naming follows convention
