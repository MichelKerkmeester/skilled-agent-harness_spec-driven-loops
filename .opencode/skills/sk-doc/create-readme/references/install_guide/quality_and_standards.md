---
title: Install Guide Quality and Standards
description: Troubleshooting standards, DQI weighting, minimum requirements, common issues and the pre-publish checklist for install guides.
trigger_phrases:
  - "install guide troubleshooting standards"
  - "install guide dqi"
  - "install guide quality criteria"
  - "install guide pre-publish checklist"
  - "install guide error table"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Install Guide Quality and Standards

Overflow detail behind `SKILL.md` Sections 7 and 8 (install-guide workflow and validation). Use it while writing the troubleshooting section or reviewing a guide before delivery. `SKILL.md` carries the short troubleshooting format and pre-publish checks; this file carries the error categories, quality weighting and the full itemized checklist.

---

## 1. OVERVIEW

An install guide is judged on whether users succeed on the first attempt and can debug themselves when they do not. Troubleshooting quality and per-phase completeness carry the score.

**Core Principle**: A fix a reader cannot act on is not a fix. Every troubleshooting row names a cause and a concrete action.

**When to Use**:
- Writing the troubleshooting section
- Scoring a drafted install guide before delivery

---

## 2. TROUBLESHOOTING STANDARDS

### Error Table Format (3-column required)

```markdown
| Error | Cause | Fix |
|-------|-------|-----|
| `command not found: mcp-server` | Not in PATH | Run `npm install -g` again, check PATH |
| `EACCES: permission denied` | Missing permissions | Use `sudo` or fix npm permissions |
| `Connection refused` | Server not running | Start server: `mcp-server start` |
| `Invalid configuration` | Malformed JSON | Validate JSON syntax, check quotes |
```

### Error Categories

1. **Installation Errors** - Package manager failures, permission issues
2. **Configuration Errors** - Invalid JSON, missing files, wrong paths
3. **Runtime Errors** - Connection failures, version mismatches
4. **Environment Errors** - Missing variables, PATH issues

### Fix Quality

**Bad** (vague): `Fix: Check your configuration`

**Good** (actionable): `Fix: Open opencode.json, verify "command" path exists: which npx`

---

## 3. QUALITY CRITERIA

### DQI Components for Install Guides

| Component | Weight | What It Measures |
|-----------|--------|------------------|
| **Structure** | 40% | Phase organization, validation checkpoints |
| **Content** | 35% | Commands complete, expected outputs, platform coverage |
| **Style** | 25% | Copyable commands, STOP conditions, consistent format |

### Minimum Requirements

| Section | Requirements |
|---------|-------------|
| **Prerequisites** | Checklist format, version requirements, validation commands |
| **Installation** | Numbered steps, one command per block, validation checkpoint |
| **Configuration** | File paths explicit, example configs complete |
| **Verification** | End-to-end test, expected output, success criteria |
| **Troubleshooting** | 5+ errors, 3-column table, actionable fixes |

### Common Issues

| Issue | Fix |
|-------|-----|
| Missing validation checkpoints | Add `### Validation: \`phase_N_complete\`` |
| Commands without expected output | Add `**Expected output**:` block |
| Vague troubleshooting | Use 3-column table with specific fixes |
| Platform assumptions | Add platform-specific alternatives |
| Missing STOP conditions | Add `❌ **STOP if validation fails**` |

---

## 4. PRE-PUBLISH CHECKLIST

- [ ] All 11 sections present (0-10, with 7 and 8 optional)
- [ ] Core Principle blockquote in Section 1 (Overview)
- [ ] All phases have validation checkpoints
- [ ] 5+ STOP blocks after validation checkpoints
- [ ] Prerequisites testable (commands provided)
- [ ] Troubleshooting table has 5+ entries
- [ ] Platform requirements in overview
- [ ] Time estimate included
- [ ] All code blocks have language tags

---

## 5. CROSS-REFERENCES

- [section_examples.md](section_examples.md) - Section and configuration examples
- [install_guide_template.md](../../assets/readme/install_guide_template.md) - Full install-guide scaffold
- [validation.md](../../../shared/references/validation.md) - DQI scoring methodology
- [core_standards.md](../../../shared/references/core_standards.md) - Document formatting rules
