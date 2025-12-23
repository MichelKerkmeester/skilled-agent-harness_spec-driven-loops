# Sequential Thinking MCP Server Installation Guide

A comprehensive guide to installing, configuring, and using the Sequential Thinking MCP server for structured problem-solving.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the Sequential Thinking MCP server from https://github.com/arben-adm/mcp-sequential-thinking

Please help me:
1. Check if I have Python 3.10+ and UV package manager installed
2. Clone the repository to ~/CloudStorage/MCP Servers/mcp-sequential-thinking
3. Create a virtual environment and install dependencies with UV
4. Configure the MCP server for my environment (I'm using: [OpenCode / VS Code Copilot / Claude Desktop])
5. Test that the installation is working

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**
- Verify Python 3.10+ is available on your system
- Install UV package manager if needed
- Clone the repository to the correct location
- Set up virtual environment with proper Python version
- Install all dependencies using UV
- Configure MCP server for your specific AI platform (OpenCode/VS Code/Claude Desktop)
- Test the three available tools: `process_thought`, `generate_summary`, `clear_history`
- Show you how to use the 5 cognitive stages effectively

**Expected setup time:** 5-10 minutes

---

#### 📋 TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [📥 INSTALLATION](#3--installation)
4. [⚙️ CONFIGURATION](#4-️-configuration)
5. [✅ VERIFICATION](#5--verification)
6. [🚀 USAGE](#6--usage)
7. [🎯 FEATURES](#7--features)
8. [💡 EXAMPLES](#8--examples)
9. [🔧 TROUBLESHOOTING](#9--troubleshooting)
10. [📚 RESOURCES](#10--resources)

---

## 1. 📖 OVERVIEW

Sequential Thinking is a Model Context Protocol (MCP) server that facilitates structured, progressive thinking through defined cognitive stages. It helps break down complex problems into sequential thoughts, track the progression of your thinking process, and generate summaries.

### Key Features

- **Structured Thinking Framework**: Organizes thoughts through 5 standard cognitive stages
- **Thought Tracking**: Records and manages sequential thoughts with metadata
- **Related Thought Analysis**: Identifies connections between similar thoughts
- **Progress Monitoring**: Tracks your position in the overall thinking sequence
- **Summary Generation**: Creates concise overviews of the entire thought process
- **Persistent Storage**: Automatically saves thinking sessions with thread-safety
- **Type Safety**: Comprehensive type annotations and validation

### The 5 Cognitive Stages

| Stage | Purpose | Example |
|-------|---------|---------|
| **Problem Definition** | Frame the issue clearly | "Define scope of authentication system redesign" |
| **Research** | Gather relevant information | "Survey existing auth patterns, compare JWT vs sessions" |
| **Analysis** | Examine data and patterns | "Analyze security trade-offs, performance implications" |
| **Synthesis** | Combine insights | "Integrate findings into cohesive approach" |
| **Conclusion** | Reach decisions | "Recommend hybrid approach with specific implementation" |

---

## 2. 📋 PREREQUISITES

Before installing Sequential Thinking MCP, ensure you have:

### Required

- **Python 3.10 or higher**
  ```bash
  python3 --version
  # Should show 3.10.x or higher
  ```

- **UV package manager** ([Install Guide](https://github.com/astral-sh/uv))
  ```bash
  # Install UV if not present
  curl -LsSf https://astral.sh/uv/install.sh | sh

  # Verify installation
  uv --version
  ```

- **OpenCode CLI** or **VS Code with GitHub Copilot** or **Claude Desktop**
  ```bash
  # For OpenCode
  which opencode

  # For VS Code
  code --version
  ```

### Optional but Recommended

- **Git** for cloning the repository
- **Bash 4.0+** for running installation scripts

---

## 3. 📥 INSTALLATION

### Step 1: Choose Installation Location

Create a dedicated directory for MCP servers:

```bash
# Create MCP Servers directory
mkdir -p ~/CloudStorage/MCP\ Servers
cd ~/CloudStorage/MCP\ Servers
```

### Step 2: Clone Repository

```bash
# Clone the Sequential Thinking repository
git clone https://github.com/arben-adm/mcp-sequential-thinking.git
cd mcp-sequential-thinking
```

### Step 3: Create Virtual Environment

```bash
# Create virtual environment using Python 3.10+
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate
```

### Step 4: Install Dependencies

```bash
# Install the package with UV
uv pip install -e .

# For development (optional):
uv pip install -e ".[dev]"

# For all features (optional):
uv pip install -e ".[all]"
```

### Step 5: Verify Installation

```bash
# Check that the command is available
which mcp-sequential-thinking

# Expected output:
# ~/CloudStorage/MCP Servers/mcp-sequential-thinking/.venv/bin/mcp-sequential-thinking
```

### Installed Dependencies

The installation includes:
- **Pydantic** (2.12.5) - Data validation and serialization
- **Portalocker** - Thread-safe file operations
- **FastMCP** - Model Context Protocol integration
- **Rich** (14.2.0) - Enhanced console output
- **PyYAML** (6.0.3) - Configuration management
- **httpx** (0.28.1) - HTTP client
- 32 additional supporting packages

---

## 4. ⚙️ CONFIGURATION

Sequential Thinking MCP can be configured for different AI platforms:

### Option A: Configure for OpenCode

Add to `opencode.json` in your project root:

```json
{
  "mcp": {
    "sequential-thinking": {
      "type": "local",
      "command": [
        "/Users/YOUR_NAME/MCP Servers/mcp-sequential-thinking/.venv/bin/python3.12",
        "-m",
        "mcp_sequential_thinking.server"
      ]
    }
  }
}
```

**Replace** `/Users/YOUR_NAME/` with your actual path.

### Option B: Configure for VS Code Copilot

#### Method 1: Workspace Configuration

Create `.vscode/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "/Users/YOUR_NAME/MCP Servers/mcp-sequential-thinking/.venv/bin/python3.12",
      "args": ["-m", "mcp_sequential_thinking.server"]
    }
  }
}
```

#### Method 2: User Settings

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "sequential-thinking": {
      "command": "/Users/YOUR_NAME/MCP Servers/mcp-sequential-thinking/.venv/bin/python3.12",
      "args": ["-m", "mcp_sequential_thinking.server"]
    }
  }
}
```

### Option C: Configure for Claude Desktop

Add to `claude_desktop_config.json`:

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "/Users/YOUR_NAME/MCP Servers/mcp-sequential-thinking/.venv/bin/python3.12",
      "args": ["-m", "mcp_sequential_thinking.server"]
    }
  }
}
```

**Alternative** (using installed script):

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "mcp-sequential-thinking"
    }
  }
}
```

---

## 5. ✅ VERIFICATION

### Check 1: Test Server Directly

```bash
# Activate virtual environment
cd ~/CloudStorage/MCP\ Servers/mcp-sequential-thinking
source .venv/bin/activate

# Run server
mcp-sequential-thinking

# Expected: Server starts without errors
```

### Check 2: Verify in OpenCode

```bash
# Start OpenCode session
opencode

# Check MCP servers
> List available MCP tools

# Expected: sequential-thinking tools should appear
```

### Check 3: Verify in VS Code Copilot

1. Open VS Code in configured workspace
2. Open Copilot Chat (Cmd+I / Ctrl+I)
3. Select **Agent Mode** from popup menu
4. Click **tools icon** (top left)
5. Look for `sequential-thinking` tools

### Check 4: Run Test Commands

```bash
# Test thought processing
# In your AI chat:
Use the process_thought tool to record: "Testing sequential thinking setup"
```

Expected response should show thought recorded successfully.

---

## 6. 🚀 USAGE

### Basic Usage Pattern

Sequential Thinking works best when you:
1. **Start with Problem Definition** - Clearly frame what you're solving
2. **Move through Research** - Gather relevant information
3. **Progress to Analysis** - Examine patterns and data
4. **Synthesize insights** - Combine findings
5. **Reach Conclusions** - Make final decisions

### Explicit Tool Invocation

```
Use sequential thinking to work through [problem description]
```

### Natural Language Patterns

The tools activate when you express thinking needs:

```
Help me think through this systematically:
[Your complex problem here]
```

```
I need to break down this decision about [topic]
```

```
Let's analyze this step by step using the sequential thinking approach
```

---

## 7. 🎯 FEATURES

### 7.1 process_thought

Records and analyzes a new thought in your sequential thinking process.

**Parameters**:
- `thought` (string) - Content of your thought
- `thought_number` (integer) - Position in sequence (1, 2, 3...)
- `total_thoughts` (integer) - Expected total thoughts
- `next_thought_needed` (boolean) - Whether more thoughts follow
- `stage` (string) - One of: Problem Definition, Research, Analysis, Synthesis, Conclusion
- `tags` (list, optional) - Keywords or categories
- `axioms_used` (list, optional) - Principles applied
- `assumptions_challenged` (list, optional) - Assumptions questioned

**Example**:
```python
process_thought(
    thought="Authentication requires balancing security and user experience",
    thought_number=1,
    total_thoughts=5,
    next_thought_needed=True,
    stage="Problem Definition",
    tags=["authentication", "security", "ux"],
    axioms_used=["Security by design"],
    assumptions_challenged=["Passwords are sufficient"]
)
```

### 7.2 generate_summary

Generates a summary of your entire thinking process.

**Returns**:
- Total thoughts recorded
- Distribution across stages
- Timeline of progression
- Key insights

**Example**:
```
generate_summary()
```

**Output**:
```json
{
  "summary": {
    "totalThoughts": 5,
    "stages": {
      "Problem Definition": 1,
      "Research": 1,
      "Analysis": 1,
      "Synthesis": 1,
      "Conclusion": 1
    },
    "timeline": [...]
  }
}
```

### 7.3 clear_history

Resets the thinking process by clearing all recorded thoughts.

**Example**:
```
clear_history()
```

Use this when starting a completely new problem or after completing a thinking session.

---

## 8. 💡 EXAMPLES

### Example 1: Deciding on Authentication Strategy

```
Problem: Choose authentication approach for new API

Use sequential thinking to work through this:

Thought 1 (Problem Definition):
- Need secure, scalable authentication for REST API
- Users: internal team + external partners
- Requirements: SSO support, API keys, rate limiting

Thought 2 (Research):
- JWT tokens: stateless, scalable, but token revocation complex
- Session-based: easier revocation, but requires shared state
- OAuth2: industry standard, but implementation complexity
- API keys: simple for machine-to-machine

Thought 3 (Analysis):
- SSO requirement points to OAuth2 or JWT
- Mixed user types suggest tiered approach
- Scalability concerns favor stateless
- Security needs require revocation capability

Thought 4 (Synthesis):
- Hybrid approach: OAuth2 for human users, API keys for services
- JWT with short expiration + refresh tokens
- Redis for token blacklist (revocation)
- Rate limiting at gateway level

Thought 5 (Conclusion):
- Implement OAuth2 with JWT access tokens (15min expiry)
- Refresh tokens (7 days, stored securely)
- API keys for service accounts
- Redis blacklist for emergency revocation
- Start with Auth0 for faster implementation
```

### Example 2: Performance Optimization Decision

```
Use process_thought to analyze page load performance

Thought 1 (Problem Definition):
"Homepage loads in 4.5 seconds, target is under 2 seconds"
Stage: Problem Definition
Tags: performance, optimization, frontend

Thought 2 (Research):
"Waterfall analysis shows: large bundle (850KB), 12 separate API calls, unoptimized images"
Stage: Research

Thought 3 (Analysis):
"Bundle size from unused dependencies, API calls not parallelized, images not lazy-loaded"
Stage: Analysis

Thought 4 (Synthesis):
"Combine: code splitting, parallel API with Promise.all, lazy load images below fold"
Stage: Synthesis

Thought 5 (Conclusion):
"Priority order: 1) Remove unused deps (500KB saved), 2) Parallel APIs (1.2s saved), 3) Lazy images (0.8s saved) = Target achieved"
Stage: Conclusion
```

### Example 3: Architecture Decision

```
Help me think through microservices vs monolith for e-commerce platform

[AI will guide through 5 stages using process_thought tool]

Stage 1 - Problem Definition:
- Team size: 5 developers
- Expected scale: 10K daily active users
- Timeline: 3 months to MVP
- Budget: limited

Stage 2 - Research:
- Microservices: better scalability, deployment complexity
- Monolith: faster development, harder to scale later
- Hybrid: start monolith, extract services later

[Continue through Analysis, Synthesis, Conclusion]

generate_summary()
[View complete thinking progression]
```

---

## 9. 🔧 TROUBLESHOOTING

### Server Not Starting

**Problem**: MCP server fails to start

**Solutions**:
1. Verify Python version is 3.10+
   ```bash
   python3 --version
   ```

2. Check virtual environment is activated
   ```bash
   which python3
   # Should point to .venv/bin/python3
   ```

3. Reinstall dependencies
   ```bash
   cd ~/CloudStorage/MCP\ Servers/mcp-sequential-thinking
   source .venv/bin/activate
   uv pip install -e . --force-reinstall
   ```

4. Check for port conflicts
   ```bash
   # Sequential Thinking uses stdio, not ports, but check anyway
   lsof -i :3000
   ```

### Tools Not Appearing

**Problem**: Sequential thinking tools don't show in AI client

**Solutions**:
1. Restart your AI client (OpenCode, VS Code, Claude Desktop)

2. Verify configuration path is correct
   ```bash
   # Check actual path
   ls -la ~/CloudStorage/MCP\ Servers/mcp-sequential-thinking/.venv/bin/python3.12
   ```

3. Check configuration file syntax (valid JSON)
   ```bash
   # Validate JSON
   python3 -m json.tool < opencode.json
   python3 -m json.tool < .vscode/mcp.json
   ```

4. Review logs for errors
   ```bash
   # OpenCode logs
   tail -f ~/.opencode/logs/*.log

   # VS Code Developer Tools: Help > Toggle Developer Tools > Console
   ```

### Thoughts Not Persisting

**Problem**: Thoughts disappear between sessions

**Solutions**:
1. Check storage location has write permissions
   ```bash
   # Default storage in project directory
   ls -la ./sequential_thinking_history.json
   ```

2. Verify no file locks preventing writes
   ```bash
   lsof | grep sequential_thinking_history.json
   ```

3. Check disk space
   ```bash
   df -h .
   ```

### Invalid Stage Errors

**Problem**: Error about invalid thinking stage

**Solutions**:
1. Use exact stage names (case-sensitive):
   - "Problem Definition" ✅
   - "problem definition" ❌
   - "Research" ✅
   - "research" ❌

2. Check for typos in stage parameter

3. Verify stage is one of the 5 allowed values

---

## 10. 📚 RESOURCES

### Documentation

- **GitHub Repository**: https://github.com/arben-adm/mcp-sequential-thinking
- **README**: `~/CloudStorage/MCP Servers/mcp-sequential-thinking/README.md`
- **Customization Examples**: `~/CloudStorage/MCP Servers/mcp-sequential-thinking/example.md`
- **Changelog**: `~/CloudStorage/MCP Servers/mcp-sequential-thinking/CHANGELOG.md`

### MCP Protocol

- **MCP Documentation**: https://modelcontextprotocol.io
- **MCP Specification**: https://spec.modelcontextprotocol.io
- **MCP GitHub**: https://github.com/modelcontextprotocol

### Practical Applications

Sequential Thinking MCP is useful for:

- **Decision Making**: Work through important decisions methodically
- **Problem Solving**: Break complex problems into manageable components
- **Research Planning**: Structure your research approach with clear stages
- **Writing Organization**: Develop ideas progressively before writing
- **Project Analysis**: Evaluate projects through defined analytical stages
- **Architecture Decisions**: Document reasoning for technical choices
- **Code Review**: Think through changes systematically
- **Debugging**: Analyze issues from multiple angles

### Helper Commands

```bash
# View thinking history
cat sequential_thinking_history.json | python3 -m json.tool

# Backup thinking sessions
cp sequential_thinking_history.json backups/session-$(date +%Y%m%d).json

# Test MCP connection
cd ~/CloudStorage/MCP\ Servers/mcp-sequential-thinking
python3 debug_mcp_connection.py

# Run test suite
pytest tests/
```

### Project Structure

```
mcp-sequential-thinking/
├── mcp_sequential_thinking/
│   ├── server.py       # Main server implementation
│   ├── models.py       # Pydantic data models
│   ├── storage.py      # Thread-safe persistence
│   ├── analysis.py     # Thought analysis
│   └── utils.py        # Helper functions
├── tests/              # Test suite
├── .venv/              # Virtual environment
├── README.md           # Documentation
├── example.md          # Customization examples
└── pyproject.toml      # Dependencies
```

---

## Quick Reference

### Essential Commands

```bash
# Install
cd ~/CloudStorage/MCP\ Servers
git clone https://github.com/arben-adm/mcp-sequential-thinking.git
cd mcp-sequential-thinking
python3 -m venv .venv
source .venv/bin/activate
uv pip install -e .

# Test
mcp-sequential-thinking

# Update
git pull origin main
uv pip install -e . --force-reinstall
```

### Configuration Paths

- **OpenCode**: `opencode.json` → `mcp.sequential-thinking`
- **VS Code**: `.vscode/mcp.json` or `.vscode/settings.json`
- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Common Usage Patterns

**Start Thinking Session**:
```
Use sequential thinking to analyze [problem]
```

**Record Thought**:
```
process_thought(
  thought="[your thought]",
  stage="[Problem Definition|Research|Analysis|Synthesis|Conclusion]",
  thought_number=N,
  total_thoughts=M
)
```

**View Summary**:
```
generate_summary()
```

**Reset Session**:
```
clear_history()
```

---

**Installation Complete!**

You now have Sequential Thinking MCP installed and configured. Start using it to break down complex problems, make better decisions, and document your reasoning systematically.

For more information, refer to the GitHub repository and example.md for advanced customization options.
