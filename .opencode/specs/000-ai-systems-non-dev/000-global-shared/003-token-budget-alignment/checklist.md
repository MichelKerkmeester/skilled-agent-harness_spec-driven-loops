# Checklist: Global Shared Files & Token Budget Alignment

**Spec:** `./spec.md` | **Plan:** `./plan.md`

---

## Phase 1: Symlink Needs Assessment

- [x] Decision matrix completed (which agents need which Global files)
- [x] Prompt Improver confirmed as intentionally self-contained (0 Global symlinks)
- [x] Product Owner scoped to Brand + Human Voice only

## Phase 2: Create Missing Symlinks

- [ ] TikTok: Create `TikTok - Context - Industry - v0.110.md` symlink
- [ ] Copywriter: Create `Copywriter - Context - Industry - v0.110.md` symlink
- [ ] Copywriter: Create `Copywriter - Context - Canonical Stats Registry - v0.110.md` symlink
- [ ] Product Owner: Create `Owner - Context - Brand - v0.110.md` symlink
- [ ] Verify all 4 new symlinks resolve (not broken)
- [ ] Verify all pre-existing symlinks still resolve (regression check)

## Phase 3: ALWAYS-Load Audit

- [ ] Nigel de Lange: Confirm demotion candidates (Content Standards, Platform Strategy, Engagement, Interactive Mode)
- [ ] Pieter Bertram: Confirm demotion candidates (same 4 files)
- [ ] TikTok: Confirm demotion candidates (Stats Registry, Brand, Audience, Frameworks)
- [ ] Copywriter: Confirm demotion candidates (Brand, Frameworks)
- [ ] Verify post-demotion ALWAYS sizes: Nigel <=130, Pieter <=121, TikTok <=117, Copywriter <=126

## Phase 4: Loading Condition Sync

### AGENTS.md Updates
- [ ] Nigel AGENTS.md: Update DAG, add DEPTH Framework, demote 4 files
- [ ] Pieter AGENTS.md: Update DAG, add DEPTH Framework, demote 4 files
- [ ] TikTok AGENTS.md: Demote 4 files, add Industry symlink reference
- [ ] Copywriter AGENTS.md: Demote 2 files, add Industry + Stats Registry references

### System Prompt Updates
- [ ] Nigel System Prompt v0.201: Update loading tier table (Section 3.2)
- [ ] Pieter System Prompt v0.201: Update loading tier table (Section 3.2)
- [ ] TikTok System Prompt v0.200: Update ALWAYS_LOAD and ON_COMMAND tables
- [ ] Copywriter System Prompt v0.901: Update Section S2 + loading table

### Alignment Verification
- [ ] Zero mismatches: AGENTS.md vs System Prompt for Nigel
- [ ] Zero mismatches: AGENTS.md vs System Prompt for Pieter
- [ ] Zero mismatches: AGENTS.md vs System Prompt for TikTok
- [ ] Zero mismatches: AGENTS.md vs System Prompt for Copywriter
- [ ] Zero mismatches: AGENTS.md vs System Prompt for Barter Deals
- [ ] Zero mismatches: AGENTS.md vs System Prompt for Product Owner
- [ ] Zero mismatches: AGENTS.md vs System Prompt for Prompt Improver

## Phase 5: Extension Pattern Fill

- [ ] Create `TikTok - Context - Industry Extensions - v0.100.md`
- [ ] Create `Copywriter - Context - Industry Extensions - v0.100.md`
- [ ] Create `Copywriter - Context - Canonical Stats Registry Extensions - v0.100.md`
- [ ] Create `Owner - Context - Brand Extensions - v0.100.md`
- [ ] Create `Nigel de Lange - Context - Market Extensions - v0.100.md`
- [ ] Create `Pieter Bertram - Context - Market Extensions - v0.100.md`

## Phase 6: Delete Token Budget

- [ ] Delete `0. Global (Shared)/system/System - Token Budget - v0.100.md`
- [ ] Remove `<!-- Token Budget Reference: ... -->` from Copywriter AGENTS.md
- [ ] Remove `<!-- Token Budget Reference: ... -->` from Barter deals AGENTS.md
- [ ] Remove `<!-- Token Budget Reference: ... -->` from Nigel de Lange AGENTS.md
- [ ] Remove `<!-- Token Budget Reference: ... -->` from Pieter Bertram AGENTS.md
- [ ] Remove `<!-- Token Budget Reference: ... -->` from TikTok AGENTS.md
- [ ] Remove `<!-- Token Budget Reference: ... -->` from Product Owner AGENTS.md
- [ ] Remove `<!-- Token Budget Reference: ... -->` from Prompt Improver AGENTS.md
- [ ] Remove Token Budget reference from Copywriter System Prompt Section S2
- [ ] Update parent `../spec.md` Shared Files table (remove Token Budget row)

## Phase 7: Validation & Index

- [ ] Run full symlink integrity check (all agents)
- [ ] Verify Token Budget file deleted and no references remain (`grep -r "Token Budget"`)
- [ ] Run loading condition alignment check (all 7 agents: AGENTS.md vs System Prompt)
- [ ] Run ALWAYS-load ceiling check (all 7 agents <= 130 KB)
- [ ] Run extension completeness check (symlink -> Extensions file exists)
- [ ] Update parent `../spec.md` Sub-Folder Index

---

## Final Verification

- [ ] All acceptance criteria from spec.md met
- [ ] No broken symlinks across entire system
- [ ] Token Budget v0.100 deleted, zero stale references
- [ ] Parent spec.md index updated
