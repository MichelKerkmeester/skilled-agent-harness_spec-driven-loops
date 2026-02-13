# Plan: Causal Memory & Command Consolidation (v1.2.0.0)

> Release workflow for batching 6 specs into public repo

---

## Phase 1: Verification (Read-Only)

### 1.1 Check Skill CHANGELOGs
- Read all 8 skill CHANGELOGs in public repo
- Identify which need updates for v1.2.0.0
- Primary targets: system-spec-kit, workflows-documentation

### 1.2 Verify Sync Status
- Confirm files already synced from source to public
- Check git status in public repo

---

## Phase 2: Documentation Updates

### 2.1 Global CHANGELOG.md
Create v1.2.0.0 entry with:
- Summary: 6 specs, 170+ bugs fixed, 5 new commands
- Highlights: Memory System, Command Consolidation, Quality
- Files Changed: Comprehensive list
- Upgrade: No breaking changes

### 2.2 Skill CHANGELOGs
Update:
- system-spec-kit/CHANGELOG.md (memory, commands, bugs)
- workflows-documentation/CHANGELOG.md (validate_document.py)

### 2.3 README.md
Review and update if needed:
- Memory command table (9→5)
- New features mentioned
- Tool counts accurate

---

## Phase 3: Review

### 3.1 Git Status
- Show pending changes
- Present diff summary

### 3.2 User Approval
- HARD STOP before commit
- Wait for explicit approval

---

## Phase 4: Commit

### 4.1 Stage and Commit
```bash
git add -A
git commit -m "v1.2.0.0: Causal Memory & Command Consolidation"
```

### 4.2 Push
```bash
git push origin main
```

---

## Phase 5: Publish

### 5.1 Create Tag
```bash
git tag -a v1.2.0.0 -m "Causal Memory & Command Consolidation"
git push origin v1.2.0.0
```

### 5.2 GitHub Release
```bash
gh release create v1.2.0.0 --title "v1.2.0.0 - Causal Memory & Command Consolidation" --notes "..."
```

### 5.3 Update PUBLIC_RELEASE.md
Update Section 5 with new version info

---

## Parallel Agent Delegation

Per orchestrate.md, delegate to:

**Opus Agents (10 max)**
1. Analyze spec 082 implementation-summary
2. Analyze spec 083 (consolidation) implementation-summary
3. Analyze spec 083 (bug-fixes) implementation-summary
4. Analyze spec 084 implementation-summary
5. Analyze spec 085 checklist
6. Analyze spec 004 implementation-summary
7. Draft global CHANGELOG entry
8. Draft system-spec-kit CHANGELOG entry
9. Draft workflows-documentation CHANGELOG entry
10. Draft release notes for GitHub

**Sonnet Agents (10 max)**
1. Read system-spec-kit CHANGELOG
2. Read workflows-documentation CHANGELOG
3. Read mcp-code-mode CHANGELOG
4. Read mcp-figma CHANGELOG
5. Read mcp-narsil CHANGELOG
6. Read workflows-code--web-dev CHANGELOG
7. Read workflows-code--full-stack CHANGELOG
8. Read workflows-chrome-devtools CHANGELOG
9. Read workflows-git CHANGELOG
10. Check git status in public repo

---

## Dependencies

```
Phase 1 (Read) → Phase 2 (Write) → Phase 3 (Review) → Phase 4 (Commit) → Phase 5 (Publish)
     ↓
All parallel agents complete
```
