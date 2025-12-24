# Install Guide Standards - Phase-Based Installation Documentation

Reference for creating clear, reliable, and AI-friendly install guides with validation checkpoints at each phase.

---

## 1. 🎯 PURPOSE

This reference defines standards for install guide documentation. Install guides require special consideration: unclear instructions lead to failed setups, wasted time, and frustrated users.

**Core Philosophy**: "Install once, verify at each step"

**Goals**:
- **Reliability** - Users succeed on first attempt
- **Debuggability** - When issues occur, users can identify and fix them
- **Platform-awareness** - Clear paths for different environments
- **AI-friendly** - Parseable structure with copyable commands

---

## 2. 🧭 CORE PRINCIPLES

### Phase-Based Installation

```
Phase 1: Prerequisites    → Validate: Tools exist
    ↓
Phase 2: Installation     → Validate: Binaries installed
    ↓
Phase 3: Initialization   → Validate: Index/database initialized (if applicable)
    ↓
Phase 4: Configuration    → Validate: Config files created
    ↓
Phase 5: Verification     → Validate: System works end-to-end
```

**Note:** Troubleshooting is a reference section, not a phase.

### Key Rules

- **NEVER** proceed to next phase without validation
- Each phase ends with explicit validation checkpoint
- Failed validation → Troubleshooting section, not next phase
- Commands in fenced code blocks with language tags
- One command per block (for easy copying)
- STOP conditions clearly marked

---

## 3. 📋 REQUIRED SECTIONS

| Section | Required | Purpose |
|---------|----------|---------|
| **Title + Overview** | ✅ Yes | What this installs, time estimate, difficulty |
| **Prerequisites** | ✅ Yes | Required tools, versions, permissions |
| **Installation** | ✅ Yes | Step-by-step install commands |
| **Configuration** | ⚠️ Conditional | Required if config needed post-install |
| **Verification** | ✅ Yes | Prove installation succeeded |
| **Troubleshooting** | ✅ Yes | Common errors and fixes |
| **Next Steps** | ⚠️ Optional | What to do after successful install |

### Section Examples

**Title + Overview**:
```markdown
# Installing MCP Server for OpenCode

**Time**: ~10 minutes | **Difficulty**: Intermediate | **Platform**: macOS/Linux
```

**Prerequisites** (checklist format required):
```markdown
## Prerequisites
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] Terminal access with standard permissions
```

---

## 4. ✅ PHASE VALIDATION PATTERN

### Validation Checkpoint Format

```markdown
### ✅ Phase N Validation

```bash
<validation-command>
```

**Expected output**:
```
<expected-output-pattern>
```

**Checklist**:
- [ ] Output matches expected pattern
- [ ] No error messages displayed

⛔ **STOP if validation fails** → See [Troubleshooting](#troubleshooting)
```

### Requirements

- **Format**: Use `- [ ]` checkbox syntax
- **Criteria**: Specific, verifiable conditions
- **STOP condition**: Always present when validation can fail

---

## 5. 🖥️ PLATFORM CONFIGURATION

### Multi-Platform Instructions

**Option A: Conditional blocks**
```markdown
**macOS/Linux**:
```bash
export MCP_PATH="$HOME/.mcp"
```

**Windows (PowerShell)**:
```powershell
$env:MCP_PATH = "$HOME\.mcp"
```
```

### Tool-Specific Config Patterns

**OpenCode** (`opencode.json`):
```json
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": ["/path/to/binary"],
      "environment": {
        "_NOTE_TOOLS": "Description of what this provides"
      },
      "enabled": true
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@example/server"]
    }
  }
}
```

---

## 6. 🔧 TROUBLESHOOTING STANDARDS

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

## 7. 🏆 QUALITY CRITERIA

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
| Missing validation checkpoints | Add `### ✅ Phase N Validation` |
| Commands without expected output | Add `**Expected output**:` block |
| Vague troubleshooting | Use 3-column table with specific fixes |
| Platform assumptions | Add platform-specific alternatives |
| Missing STOP conditions | Add `⛔ STOP if validation fails` |

---

## 8. 🔗 CROSS-REFERENCES

- **[core_standards.md](./core_standards.md)** - Filename conventions, heading format, emoji rules
- **[validation.md](./validation.md)** - DQI scoring methodology, quality bands
- **[workflows.md](./workflows.md)** - Document creation workflows
- **`assets/install_guide_template.md`** - Template for new install guides

### Pre-Publish Checklist

- [ ] All phases have validation checkpoints
- [ ] Prerequisites testable (commands provided)
- [ ] Troubleshooting table has 5+ entries
- [ ] Platform requirements in overview
- [ ] Time estimate included
- [ ] All code blocks have language tags
- [ ] STOP conditions at each validation
