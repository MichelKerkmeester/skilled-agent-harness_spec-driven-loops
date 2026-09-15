---
title: "Implementation Plan: Phase 2: version-authority"
description: "Declare SKILL.md the authority per hub, raise the other four artifacts to it, define the schema field once, and re-mint the manifests the edits stale."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: version-authority

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL state and status ledgers |
| **Testing** | Vitest |

### Overview
SKILL.md is the release authority because its version already matches the newest changelog entry in every skill root and already agrees with description.json in five of six hubs. Each SKILL.md now says so. The other four artifacts carry that version, and the compiled activation manifests are re-minted because three of the edited files are raw-byte inputs to the policy hash.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One declared authority, derived followers

### Key Components
- **SKILL.md**: Release authority, tied to the changelog
- **Four routing artifacts**: Carry the authority's version
- **Activation manifests**: Re-minted for the new policy hash

### Data Flow
Changelog to SKILL.md version to the four artifacts; the three SHA-input files to the compiled policy hash to the activation manifests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Fifteen routing artifacts | Six disagreeing values | update | three values, one per hub |
| Schema doc | Two meanings in one sentence | update | one meaning, stated |
| Compiled policy | Staled by the edits | re-mint | route guard reports every hub fresh |

Required inventories:
- Same-class producers: five artifacts per hub across three hubs.
- Consumers measured: the compiled policy hash reads SKILL.md, hub-router.json and mode-registry.json as raw bytes.
- Out of scope, same defect: mcp-tooling and sk-doc registry/router pairs.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Gate | Route guard, route status, parent-skill-check, leaf-manifest and derived freshness | node |
| Metadata | Skill-root metadata across thirteen roots | node |
| Suite | Whole runtime | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The repository's re-mint procedure | Internal | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hub serves legacy after the change
- **Procedure**: Revert this phase's commit, which carries both the artifacts and their manifests
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | full suite run |
| **Total** | | **one dispatch plus one suite run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

