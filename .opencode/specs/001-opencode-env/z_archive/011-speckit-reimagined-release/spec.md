# Spec: Causal Memory & Command Consolidation (v1.2.0.0)

> Batch public release of 6 specs: 082-085 + 004-style-enforcement

---

## Document Information

| Field | Value |
|-------|-------|
| **Spec ID** | 007-speckit-reimagined-release |
| **Created** | 2026-02-03 |
| **Status** | In Progress |
| **Version** | 1.2.0.0 |
| **Release Type** | Series (new feature theme) |

---

## 1. Problem Statement

Six major specs have been completed in the anobel.com source repo and need to be released to the public OpenCode repo. These changes represent significant memory system enhancements (causal memory graph, session deduplication), command consolidation (9→5 commands), and quality improvements (86 bug fixes).

---

## 2. Source Specs Being Released

| Spec ID | Name | Key Changes |
|---------|------|-------------|
| 082-speckit-reimagined | Core Redesign | 107 tasks, 5 new commands, session management, causal memory graph |
| 083-memory-command-consolidation | Command Cleanup | 9→5 commands (44% reduction), 7 bug fixes |
| 083-speckit-reimagined-bug-fixes | Bug Fixes | 30+ bugs, YAML path corrections |
| 084-speckit-30-agent-audit | Audit | 8 fixes, path standardization |
| 085-speckit-audit-fixes | Audit Follow-up | 34 bugs fixed by 10 agents |
| 004-style-enforcement | Documentation | validate_document.py, template_rules.json |

---

## 3. Scope

### In Scope
- Update global CHANGELOG.md with v1.2.0.0 entry
- Update skill CHANGELOGs (system-spec-kit, workflows-documentation)
- Update README.md with new features
- Git commit and push to public repo
- Create GitHub release with tag v1.2.0.0

### Out of Scope
- Changes to source specs (already complete)
- Code implementation (already synced)

---

## 4. Success Criteria

- [ ] All skill CHANGELOGs updated
- [ ] Global CHANGELOG.md has v1.2.0.0 entry
- [ ] README.md reflects new capabilities
- [ ] Git commit pushed to remote
- [ ] GitHub release created with proper notes

---

## 5. Version Decision

Per PUBLIC_RELEASE.md versioning scheme:
- **Current**: v1.1.0.1
- **New**: v1.2.0.0

**Rationale**: Series bump (MAJOR.MINOR.+1.0) because:
- New feature theme (Causal Memory & Command Consolidation)
- Major memory system changes
- New commands added
- Backward compatible (no breaking changes)

---

## 6. Files to Update

### Public Repo Files
| File | Updates Required |
|------|------------------|
| `CHANGELOG.md` | Add v1.2.0.0 release notes |
| `README.md` | Update feature descriptions |
| `.opencode/skill/system-spec-kit/CHANGELOG.md` | Add v1.2.0.0 entry |
| `.opencode/skill/workflows-documentation/CHANGELOG.md` | Add validate_document.py |

### Source Repo Files (after release)
| File | Updates Required |
|------|------------------|
| `PUBLIC_RELEASE.md` | Update Section 5 Current Release |

---

## 7. Release Notes Structure

Per PUBLIC_RELEASE.md template:
1. Summary with bold stats (specs, bugs fixed, commands)
2. Highlights sections with emoji headers
3. Files Changed section
4. Upgrade instructions
5. Full Changelog link
