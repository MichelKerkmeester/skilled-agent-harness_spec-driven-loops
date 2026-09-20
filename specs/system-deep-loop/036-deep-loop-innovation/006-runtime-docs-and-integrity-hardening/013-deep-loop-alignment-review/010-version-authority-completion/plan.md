---
title: "Implementation Plan: Phase 10: version-authority-completion"
description: "Resolve the sk-doc release question, raise both deferred hubs' followers to their authority, record the packet-version independence, and re-mint the manifests the edits stale."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: version-authority-completion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, YAML frontmatter and Markdown; no runtime code |
| **Framework** | None |
| **Storage** | Git working tree, compiled activation manifests |
| **Testing** | Vitest plus the compiled route guard and the document validators |

### Overview
Two hubs carry four and three disagreeing versions across five routing artifacts each. Phase 003 fixed three hubs with the same defect and deferred these two, so the rule and the re-mint procedure already exist and this phase repeats them. `sk-doc` adds one question the earlier hubs did not raise: its `SKILL.md` claims a version its changelog does not name, which undermines the rule that made `SKILL.md` the authority. That question is settled first, from git history, because aligning anything to a fictional release would propagate the error to four more files.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One declared authority, derived followers

### Key Components
- **`SKILL.md`**: Release authority, tied to the newest changelog entry
- **Four routing artifacts**: Carry the authority's version
- **Activation manifests**: Re-minted for the new policy hash, runtime and authored copies

### Data Flow
Changelog to `SKILL.md` version to the four followers; the three SHA-input files to the compiled policy hash to the activation manifests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Ten routing artifacts | Four and three disagreeing values | update | one value per hub, five artifacts each |
| `sk-doc` changelog | Missing the entry its version names | create | newest entry equals `SKILL.md` |
| `sk-code` packet versions | Suspected drift | record | independence documented; no version moved |
| Compiled policy | Staled by the edits | re-mint | route guard reports every hub fresh |

Required inventories:
- Same-class producers: five artifacts per hub across two hubs, the same class phase 003 closed for three.
- Consumers measured: the compiled policy hash reads `SKILL.md`, `hub-router.json` and `mode-registry.json` as raw bytes; nothing reads the version semantically.
- Out of scope, same defect: none remaining after this phase.
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
| Gate | Compiled route guard across five hubs | node |
| Metadata | Skill-root metadata across thirteen roots | node |
| Document | The new changelog entry and the edited reference, against their templates | validate_document.py |
| Corpus | Frontmatter version gate across all in-scope docs | check-frontmatter-versions.sh |
| Suite | Whole runtime | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The re-mint procedure phase 003 established | Internal | Green | - |
| Git history for the `sk-doc` question | Internal | Green | The authority would have to stay ambiguous |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hub serves legacy after the change, or the authored and runtime manifests diverge
- **Procedure**: Revert this phase's commit, which carries the artifacts, the changelog entry and the manifests together
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
| Setup | Med | git archaeology across the two hubs |
| Core Implementation | Low | ten artifacts, two reference docs, one entry |
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
