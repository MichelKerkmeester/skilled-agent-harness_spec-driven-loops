# Skill Advisor Setup Guide

The Skill Advisor is a Python script that analyzes user requests and recommends appropriate skills with confidence scores. It powers Gate 2 in AGENTS.md, enabling intelligent skill routing.

> **Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.

---

## TABLE OF CONTENTS

0. [🤖 AI INSTALL GUIDE](#0--ai-install-guide)
1. [📖 OVERVIEW](#1--overview)
2. [📋 PREREQUISITES](#2--prerequisites)
3. [✅ INSTALLATION VERIFICATION](#3--installation-verification)
4. [⚙️ HOW IT WORKS](#4--how-it-works)
5. [🎯 CURRENT SKILLS REFERENCE](#5--current-skills-reference)
6. [📊 THRESHOLD TUNING GUIDE](#6--threshold-tuning-guide)
7. [🧮 EXAMPLE CALCULATIONS](#7--example-calculations)
8. [🔧 CUSTOMIZATION](#8--customization)
9. [🧪 TESTING](#9--testing)
10. [🐛 DEBUGGING](#10--debugging)
11. [🔧 TROUBLESHOOTING](#11--troubleshooting)

---

## 0. 🤖 AI INSTALL GUIDE

**Copy and paste this prompt to your AI assistant:**

```
I want to set up the Skill Advisor for my OpenCode project.

Please help me:
1. Verify Python 3.10+ is installed
2. Check the skill_advisor.py script exists at .opencode/scripts/
3. Make the script executable
4. Test the advisor with sample queries
5. Verify all 9 skills are routing correctly

My project is at: [your project path]

Guide me through each step.
```

**What the AI will do:**
- Verify Python version
- Check script location and permissions
- Test skill routing for all 9 current skills
- Validate confidence thresholds

**Expected setup time:** 5-10 minutes

---

## 1. 📖 OVERVIEW

### What is skill_advisor.py?

The Skill Advisor is a lightweight Python script that:
- Analyzes incoming user requests via tokenization and pattern matching
- Applies intent boosters for high-confidence keyword detection
- Expands queries with synonyms for better matching
- Returns confidence-scored recommendations using a two-tiered formula
- Enables automatic skill routing in AI agent workflows

### Location

```
.opencode/scripts/skill_advisor.py
```

### Integration with AGENTS.md

Gate 2 in AGENTS.md invokes the Skill Advisor:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 2: SKILL ROUTING [MANDATORY]                                           │
│ Action:  Run python .opencode/scripts/skill_advisor.py "$USER_REQUEST"      │
│ Logic:   IF confidence > 0.8 → MUST invoke skill (read SKILL.md directly)   │
│          ELSE → Proceed with manual tool selection                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Confidence Thresholds

| Range       | Action                         | Agent Behavior                     |
| ----------- | ------------------------------ | ---------------------------------- |
| **>0.8**    | **MUST** use recommended skill | Mandatory skill invocation         |
| **0.5-0.8** | MAY use skill                  | Optional, agent decides            |
| **<0.5**    | No recommendation              | Proceed with manual tool selection |

---

## 2. 📋 PREREQUISITES

### System Requirements

| Requirement | Version | Check Command                  |
| ----------- | ------- | ------------------------------ |
| Python      | 3.10+   | `python --version`             |
| AGENTS.md   | Current | Check Gate 2 references script |

### File Permissions

The script must be executable:

```bash
# Check current permissions
ls -la .opencode/scripts/skill_advisor.py

# Make executable if needed
chmod +x .opencode/scripts/skill_advisor.py
```

### Directory Structure

```
.opencode/
├── scripts/
│   └── skill_advisor.py    # This script
├── skill/                   # Skills to match against
│   ├── mcp-code-context/
│   ├── mcp-code-mode/
│   ├── mcp-leann/
│   ├── system-memory/
│   ├── system-spec-kit/
│   ├── workflows-chrome-devtools/
│   ├── workflows-code/
│   ├── workflows-documentation/
│   └── workflows-git/
└── install_guides/
    └── SET-UP - Skill Advisor.md
```

---

## 3. ✅ INSTALLATION VERIFICATION

### Step 1: Verify Script Exists

```bash
ls -la .opencode/scripts/skill_advisor.py
```

Expected output:
```
-rwxr-xr-x  1 user  staff  12345 Dec 23 10:00 skill_advisor.py
```

### Step 2: Test Basic Invocation

```bash
python .opencode/scripts/skill_advisor.py "how does authentication work"
```

### Expected Output Format

```json
[
  {
    "skill": "mcp-leann",
    "confidence": 0.95,
    "reason": "Matched: !how, !authentication, !does, !work"
  }
]
```

### Step 3: Verify High-Confidence Routing

Test that key phrases trigger their expected skills above 0.8 threshold:

```bash
# Should return mcp-leann with confidence > 0.8
python .opencode/scripts/skill_advisor.py "explain how the login system works"

# Should return workflows-git with confidence > 0.8
python .opencode/scripts/skill_advisor.py "create a pull request for my changes"
```

### Validation Checkpoint

```
□ Script exists at .opencode/scripts/skill_advisor.py
□ Script is executable (chmod +x applied)
□ Returns valid JSON array
□ High-confidence queries return > 0.8 confidence
□ All 9 skills are discoverable
```

---

## 4. ⚙️ HOW IT WORKS

### 4.1 Processing Pipeline

```
User Request
    │
    ▼
┌─────────────────────────────────────────┐
│ 1. TOKENIZE                             │
│    Extract all words from request       │
│    "how does auth work" → ["how",       │
│    "does", "auth", "work"]              │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ 2. INTENT BOOSTERS (Pre-Filter)         │
│    Check INTENT_BOOSTERS map BEFORE     │
│    stop word removal. This captures     │
│    question words: how, what, why       │
│    and action words: does, work         │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ 3. STOP WORD FILTERING                  │
│    Remove common words: help, want,     │
│    the, is, a, etc. (~100 words)        │
│    Also remove tokens < 3 characters    │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ 4. SYNONYM EXPANSION                    │
│    "bug" → ["debug", "error", "issue",  │
│    "defect", "verification"]            │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ 5. SKILL MATCHING                       │
│    For each skill:                      │
│    - Add pre-calculated intent boost    │
│    - Score name matches (+1.5)          │
│    - Score description matches (+1.0)   │
│    - Score substring matches (+0.5)     │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ 6. CONFIDENCE CALCULATION               │
│    Apply two-tiered formula based on    │
│    whether intent boosters matched      │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ 7. RANK & RETURN                        │
│    Sort by confidence descending        │
│    Return JSON array of recommendations │
└─────────────────────────────────────────┘
```

### 4.2 Confidence Calculation Algorithm

The actual algorithm from `skill_advisor.py`:

```python
def calculate_confidence(score, has_intent_boost):
    """
    Two-tiered confidence formula.
    
    With intent boost (strong domain signal):
        - Higher base confidence (0.50)
        - score=2.0 → 0.80 threshold
        - score=3.0 → 0.95 (capped)
    
    Without intent boost (corpus matches only):
        - Lower base confidence (0.25)
        - score=3.67 → 0.80 threshold
        - Much harder to reach without boosters
    """
    if has_intent_boost:
        confidence = min(0.50 + score * 0.15, 0.95)
    else:
        confidence = min(0.25 + score * 0.15, 0.95)
    
    return round(confidence, 2)
```

**Key Insight**: To reach the 0.8 mandatory threshold:
- **With intent boost**: Need total score ≥ 2.0
- **Without intent boost**: Need total score ≥ 3.67 (very difficult)

### 4.3 Scoring Components

| Match Type                 | Points    | Example                          |
| -------------------------- | --------- | -------------------------------- |
| Intent Booster             | 0.3 - 2.5 | "figma" → +2.5 for mcp-code-mode |
| Skill Name Match           | +1.5      | "git" matches "workflows-git"    |
| Description Match          | +1.0      | "browser" in skill description   |
| Substring Match (4+ chars) | +0.5      | "authen~" partial match          |

### 4.4 Intent Boosters

Intent boosters are high-confidence keywords that strongly indicate a specific skill. They are checked **before** stop word filtering, allowing question words to contribute.

**Why this matters**: Words like "how", "what", "why", "does", "work" would normally be filtered as stop words, but they are critical signals for semantic search (mcp-leann).

Example boost values:

| Keyword          | Target Skill              | Boost |
| ---------------- | ------------------------- | ----- |
| `explain`        | mcp-leann                 | +3.5  |
| `figma`          | mcp-code-mode             | +2.5  |
| `webflow`        | mcp-code-mode             | +2.5  |
| `github`         | workflows-git             | +2.0  |
| `authentication` | mcp-leann                 | +1.8  |
| `understand`     | mcp-leann                 | +1.5  |
| `why`            | mcp-leann                 | +1.5  |
| `how`            | mcp-leann                 | +1.2  |
| `worktree`       | workflows-git             | +1.2  |
| `browser`        | workflows-chrome-devtools | +1.2  |

### 4.5 Multi-Skill Boosters

Some keywords are ambiguous and boost multiple skills:

| Keyword   | Skills Boosted                                                    |
| --------- | ----------------------------------------------------------------- |
| `code`    | workflows-code (+0.2), mcp-code-context (+0.15), mcp-leann (+0.1) |
| `context` | system-memory (+0.3), mcp-code-context (+0.2)                     |
| `search`  | mcp-leann (+0.2), mcp-code-context (+0.2)                         |
| `api`     | mcp-code-mode (+0.3), mcp-leann (+0.2)                            |
| `plan`    | system-spec-kit (+0.3), workflows-code (+0.2)                     |

---

## 5. 🎯 CURRENT SKILLS REFERENCE

The Skill Advisor routes to these 9 skills based on trigger keywords:

### 5.1 mcp-code-context

**Purpose**: Structural code queries using Tree-sitter AST analysis

**Trigger Keywords** (Intent Boosters):
```
ast, classes, definitions, exports, functions, imports, list,
methods, navigate, outline, structure, symbols, tree, treesitter
```

**Example Queries**:
- "list all functions in this file"
- "show the class structure"
- "what symbols are exported"

---

### 5.2 mcp-code-mode

**Purpose**: External MCP tool integration (ClickUp, Notion, Figma, Webflow)

**Trigger Keywords** (Intent Boosters):
```
clickup, cms, component, external, figma, notion, page, pages,
site, sites, typescript, utcp, webflow
```

**Example Queries**:
- "get my Webflow sites"
- "fetch the Figma design"
- "update the ClickUp task"

---

### 5.3 mcp-leann

**Purpose**: Semantic code search - finds code by meaning/intent

**Trigger Keywords** (Intent Boosters):
```
ask, auth, authentication, does, embeddings, explain, how, index,
leann, login, logout, password, query, rag, semantic, understand,
vector, what, why, work, works
```

**Example Queries**:
- "how does authentication work"
- "explain the login flow"
- "what does this function do"

---

### 5.4 system-memory

**Purpose**: Context preservation and semantic memory search

**Trigger Keywords** (Intent Boosters):
```
checkpoint, history, memory, recall, remember, restore
```

**Example Queries**:
- "save this context to memory"
- "recall what we discussed about auth"
- "restore the previous checkpoint"

---

### 5.5 system-spec-kit

**Purpose**: Specification and planning workflow

**Trigger Keywords** (Intent Boosters):
```
checklist, folder, spec, specification
```

**Example Queries**:
- "create a spec for this feature"
- "set up a new spec folder"

---

### 5.6 workflows-chrome-devtools

**Purpose**: Browser debugging and Chrome DevTools integration

**Trigger Keywords** (Intent Boosters):
```
bdg, browser, chrome, console, css, debug, debugger, devtools,
dom, inspect, network, screenshot
```

**Example Queries**:
- "take a screenshot of the page"
- "debug the console errors"
- "inspect the network requests"

---

### 5.7 workflows-code

**Purpose**: Implementation, debugging, and verification lifecycle

**Trigger Keywords** (Intent Boosters):
```
bug, implement, refactor, verification
```

**Example Queries**:
- "implement the new feature"
- "fix this bug"
- "refactor the auth module"

---

### 5.8 workflows-git

**Purpose**: Git operations, branching, and GitHub integration

**Trigger Keywords** (Intent Boosters):
```
branch, checkout, commit, diff, gh, github, issue, log, merge,
pr, pull, push, rebase, repo, review, stash, worktree
```

**Example Queries**:
- "create a pull request"
- "commit my changes"
- "set up a git worktree"

---

### 5.9 workflows-documentation

**Purpose**: Unified markdown and skill management - document quality enforcement, skill creation workflow, flowchart creation, and install guide creation

**Trigger Keywords** (Intent Boosters):
```
ascii, checklist, dqi, document, documentation, flowchart, guide, install,
markdown, quality, skill, structure, style, template, validation, visualize
```

**Example Queries**:
- "create a skill for my workflow"
- "validate the markdown structure"
- "create a flowchart for this process"
- "help me write documentation"
- "check the DQI score"

---

## 6. 📊 THRESHOLD TUNING GUIDE

### Understanding the Threshold

The confidence threshold (default: 0.8) determines when skill routing becomes mandatory.

| Threshold | Routing Behavior   | False Positives | False Negatives | Use Case               |
| --------- | ------------------ | --------------- | --------------- | ---------------------- |
| **0.6**   | Aggressive         | Higher          | Lower           | Testing, exploration   |
| **0.8**   | Balanced (default) | Low             | Low             | Production use         |
| **0.9**   | Conservative       | Very low        | Higher          | Minimize wrong routing |

### When to Adjust

**Lower to 0.6** if:
- Skills aren't being triggered when expected
- You want more exploration of skill capabilities
- You're testing new skill patterns

**Raise to 0.9** if:
- Too many false positive skill matches
- Prefer manual tool selection for ambiguous queries
- Critical workflows where wrong skill is costly

### How to Change

Modify the threshold in your AGENTS.md Gate 2:

```markdown
│ Logic:   IF confidence > 0.6 → MUST invoke skill  (aggressive)
│ Logic:   IF confidence > 0.8 → MUST invoke skill  (balanced - default)
│ Logic:   IF confidence > 0.9 → MUST invoke skill  (conservative)
```

### Validation Checkpoint

```
□ Threshold aligns with project needs
□ High-value queries reach threshold consistently
□ False positives are at acceptable level
□ Agent can still manually select tools when appropriate
```

---

## 7. 🧮 EXAMPLE CALCULATIONS

### Example 1: High-Confidence Match (mcp-leann)

**Request**: `"how does authentication work"`

**Step 1: Tokenization**
```
Tokens: ["how", "does", "authentication", "work"]
```

**Step 2: Intent Boosters (before stop word filter)**
```
"how" → mcp-leann +1.2
"does" → mcp-leann +0.6
"authentication" → mcp-leann +1.8
"work" → mcp-leann +1.0
─────────────────────────────
Total intent boost: 4.6
```

**Step 3: Stop Word Filter**
```
After filter: ["authentication"]
(how, does, work are in STOP_WORDS but already counted in boosters)
```

**Step 4: Confidence Calculation**
```python
has_intent_boost = True  # 4.6 > 0
score = 4.6
confidence = min(0.50 + 4.6 * 0.15, 0.95)
confidence = min(1.19, 0.95) = 0.95
```

**Result**: `mcp-leann` with **0.95 confidence** ✅ (> 0.8 threshold)

---

### Example 2: Medium-Confidence Match

**Request**: `"help me write documentation for the API"`

**Step 1: Tokenization**
```
Tokens: ["help", "me", "write", "documentation", "for", "the", "api"]
```

**Step 2: Intent Boosters**
```
"api" → MULTI_SKILL_BOOSTERS:
  - mcp-code-mode +0.3
  - mcp-leann +0.2
```

**Step 3: Stop Word Filter**
```
Filtered: ["write", "documentation", "api"]
(help, me, for, the removed)
```

**Step 4: Synonym Expansion**
```
"write" → ["documentation", "create", "generate"]
Final search terms: ["write", "documentation", "api", "create", "generate"]
```

**Step 5: Skill Matching (for workflows-documentation)**
```
Intent boost: 0 (no boosters matched)
"documentation" in description: +1.0
"write" synonyms expand to "documentation": already counted
─────────────────────────────
Total score: 1.0
```

**Step 6: Confidence Calculation**
```python
has_intent_boost = False  # 0 boost
score = 1.0
confidence = min(0.25 + 1.0 * 0.15, 0.95)
confidence = min(0.40, 0.95) = 0.40
```

**Result**: `workflows-documentation` with **0.40 confidence** ❌ (below 0.8)

**Why?** No intent boosters matched. To improve, add "document" keyword:
- `"help me document the API"` → "document" triggers +0.5 boost

---

### Example 3: Git Workflow Match

**Request**: `"create a pull request for my changes"`

**Step 1: Tokenization**
```
Tokens: ["create", "a", "pull", "request", "for", "my", "changes"]
```

**Step 2: Intent Boosters**
```
"pull" → workflows-git +0.5
"changes" → MULTI_SKILL_BOOSTERS:
  - workflows-git +0.4
  - system-memory +0.2
─────────────────────────────
workflows-git total: 0.9
```

**Step 3: Stop Word Filter**
```
Filtered: ["create", "pull", "request", "changes"]
```

**Step 4: Synonym Expansion**
```
"create" → ["implement", "build", "generate", "new", "add", "scaffold"]
```

**Step 5: Skill Matching (for workflows-git)**
```
Intent boost: 0.9
"pull" in name parts: +1.5
─────────────────────────────
Total score: 2.4
```

**Step 6: Confidence Calculation**
```python
has_intent_boost = True  # 0.9 > 0
score = 2.4
confidence = min(0.50 + 2.4 * 0.15, 0.95)
confidence = min(0.86, 0.95) = 0.86
```

**Result**: `workflows-git` with **0.86 confidence** ✅ (> 0.8 threshold)

---

## 8. 🔧 CUSTOMIZATION

### 8.1 Adding Intent Boosters

Add high-confidence keywords to `INTENT_BOOSTERS` in the script:

```python
INTENT_BOOSTERS = {
    # Existing entries...
    
    # Add your custom boosters:
    "deploy": ("workflows-code", 0.8),
    "staging": ("workflows-code", 0.6),
    "production": ("workflows-code", 0.7),
}
```

**Boost value guidelines**:
- **0.3-0.5**: Weak signal, needs other matches
- **0.6-1.0**: Moderate signal
- **1.2-2.0**: Strong signal, likely triggers routing
- **2.5+**: Very strong signal (reserved for definitive keywords like "figma", "clickup")

### 8.2 Adding Synonyms

Expand query understanding with synonyms:

```python
SYNONYM_MAP = {
    # Existing entries...
    
    # Add your synonyms:
    "deploy": ["release", "ship", "publish", "launch"],
    "staging": ["preview", "test", "sandbox"],
}
```

### 8.3 Adding Multi-Skill Boosters

For ambiguous keywords that should boost multiple skills:

```python
MULTI_SKILL_BOOSTERS = {
    # Existing entries...
    
    "deploy": [
        ("workflows-code", 0.4),
        ("workflows-git", 0.3),
    ],
}
```

### 8.4 Project-Type Optimization

Boost certain skills based on project type:

**Frontend Projects** (add to INTENT_BOOSTERS):
```python
"responsive": ("workflows-chrome-devtools", 0.5),
"mobile": ("workflows-chrome-devtools", 0.5),
"css": ("workflows-chrome-devtools", 0.4),
```

**Backend Projects**:
```python
"database": ("mcp-leann", 0.5),
"endpoint": ("workflows-code", 0.5),
"migration": ("workflows-code", 0.6),
```

---

## 9. 🧪 TESTING

### Quick Validation Tests

Run these commands to verify each skill routes correctly:

```bash
# mcp-code-context - should return > 0.8
python .opencode/scripts/skill_advisor.py "list all functions in the file"
python .opencode/scripts/skill_advisor.py "show the class structure"

# mcp-code-mode - should return > 0.8
python .opencode/scripts/skill_advisor.py "get my Webflow sites"
python .opencode/scripts/skill_advisor.py "fetch the Figma design"

# mcp-leann - should return > 0.8
python .opencode/scripts/skill_advisor.py "how does authentication work"
python .opencode/scripts/skill_advisor.py "explain the login flow"

# system-memory - should return > 0.8
python .opencode/scripts/skill_advisor.py "save this context to memory"
python .opencode/scripts/skill_advisor.py "restore the previous checkpoint"

# workflows-chrome-devtools - should return > 0.8
python .opencode/scripts/skill_advisor.py "debug in chrome browser"
python .opencode/scripts/skill_advisor.py "take a screenshot of the page"

# workflows-code - should return > 0.8
python .opencode/scripts/skill_advisor.py "implement the new feature"
python .opencode/scripts/skill_advisor.py "fix the bug and verify"

# workflows-git - should return > 0.8
python .opencode/scripts/skill_advisor.py "create a pull request on github"
python .opencode/scripts/skill_advisor.py "commit my changes and push"

# workflows-documentation - should return > 0.8
python .opencode/scripts/skill_advisor.py "create a skill for my workflow"
python .opencode/scripts/skill_advisor.py "validate the markdown structure"

# No match test - should return empty or low confidence
python .opencode/scripts/skill_advisor.py "hello world"
```

### Batch Testing Script

```bash
#!/bin/bash
# Save as test_skill_advisor.sh

SCRIPT=".opencode/scripts/skill_advisor.py"
TESTS=(
    "how does authentication work|mcp-leann"
    "list all functions|mcp-code-context"
    "get webflow sites|mcp-code-mode"
    "save context to memory|system-memory"
    "debug in chrome|workflows-chrome-devtools"
    "implement the feature|workflows-code"
    "create pull request github|workflows-git"
    "create a skill for workflow|workflows-documentation"
    "validate markdown structure|workflows-documentation"
)

echo "=== Skill Advisor Batch Test ==="
for test in "${TESTS[@]}"; do
    IFS='|' read -r query expected <<< "$test"
    result=$(python "$SCRIPT" "$query" | head -20)
    skill=$(echo "$result" | grep -o '"skill": "[^"]*"' | head -1 | cut -d'"' -f4)
    conf=$(echo "$result" | grep -o '"confidence": [0-9.]*' | head -1 | awk '{print $2}')
    
    if [[ "$skill" == "$expected" && $(echo "$conf > 0.8" | bc -l) -eq 1 ]]; then
        echo "✅ PASS: \"$query\" → $skill ($conf)"
    else
        echo "❌ FAIL: \"$query\" → Expected $expected >0.8, got $skill ($conf)"
    fi
done
```

### Validation Checkpoint

```
□ All 9 skills route correctly with known queries
□ High-confidence keywords reach > 0.8 threshold
□ Ambiguous queries return reasonable suggestions
□ Empty/irrelevant queries return low confidence
□ No unexpected skill matches (false positives)
```

---

## 10. 🐛 DEBUGGING

### Understanding Why a Skill Wasn't Triggered

When a query doesn't route to the expected skill, analyze step-by-step:

**Step 1: Check the raw output**
```bash
python .opencode/scripts/skill_advisor.py "your query here"
```

**Step 2: Examine the "reason" field**
The output shows which patterns matched:
```json
{
  "skill": "mcp-leann",
  "confidence": 0.65,
  "reason": "Matched: !how, search(name)"
}
```

Prefix meanings:
- `!keyword` → Intent booster matched
- `keyword(name)` → Matched skill name
- `keyword` → Matched skill description
- `keyword~` → Substring match

**Step 3: Check if intent boosters exist**

Search the script for your keyword:
```bash
grep -n "your_keyword" .opencode/scripts/skill_advisor.py
```

If not found in `INTENT_BOOSTERS`, the keyword won't get the boost needed for high confidence.

**Step 4: Verify stop words aren't filtering critical terms**

Check if your important word is in `STOP_WORDS`:
```bash
grep "'your_word'" .opencode/scripts/skill_advisor.py | head -5
```

### Common Debugging Scenarios

**Scenario: "fix the login bug" not routing to workflows-code**

Check:
1. "fix" is in `MULTI_SKILL_BOOSTERS` → workflows-code +0.3
2. "bug" is in `INTENT_BOOSTERS` → workflows-code +0.5
3. Total: 0.8 boost → confidence = min(0.50 + 0.8 * 0.15, 0.95) = 0.62

**Solution**: Add more boosters or rephrase query

**Scenario: Query returns wrong skill**

Check which skill has higher boosts for your keywords. You may need to:
1. Increase boost value for correct skill
2. Add more specific keywords
3. Add negative boosters (remove points) for wrong skill

### Verbose Output Workaround

Until `--debug` flag is added, use this Python snippet to trace scoring:

```python
# Add to skill_advisor.py temporarily for debugging
import sys
if "--debug" in sys.argv:
    # Print intermediate steps
    print(f"DEBUG: Tokens = {all_tokens}", file=sys.stderr)
    print(f"DEBUG: Intent boosts = {skill_boosts}", file=sys.stderr)
    print(f"DEBUG: After filter = {tokens}", file=sys.stderr)
    print(f"DEBUG: Expanded = {search_terms}", file=sys.stderr)
```

---

## 11. 🔧 TROUBLESHOOTING

<details>
<summary><strong>Script not found</strong></summary>

**Symptoms:**
```
python: can't open file '.opencode/scripts/skill_advisor.py': [Errno 2] No such file or directory
```

**Solution:**
```bash
# Create the scripts directory if missing
mkdir -p .opencode/scripts

# Verify the path
ls -la .opencode/scripts/

# If script is missing, check if it needs to be created or restored
```

</details>

<details>
<summary><strong>Permission denied</strong></summary>

**Symptoms:**
```
-bash: .opencode/scripts/skill_advisor.py: Permission denied
```

**Solution:**
```bash
# Make the script executable
chmod +x .opencode/scripts/skill_advisor.py

# Verify permissions
ls -la .opencode/scripts/skill_advisor.py
# Should show: -rwxr-xr-x
```

</details>

<details>
<summary><strong>Wrong skill recommended</strong></summary>

**Symptoms:**
- Script recommends `mcp-leann` when you wanted `workflows-code`

**Solution:**
1. Check intent booster values for competing skills
2. Add more specific keywords for your use case
3. Increase boost values for target skill

```python
# Example: Make "implement" stronger for workflows-code
INTENT_BOOSTERS = {
    "implement": ("workflows-code", 1.2),  # Increased from 0.6
}
```

</details>

<details>
<summary><strong>No skill recommended (confidence too low)</strong></summary>

**Symptoms:**
```json
[]
```
or very low confidence scores

**Solution:**
1. Add intent boosters for common query patterns
2. Check if key words are being filtered as stop words
3. Add synonyms for better matching
4. Lower threshold if appropriate (see Section 6)

```python
# Add boosters for your common queries
INTENT_BOOSTERS = {
    "deploy": ("workflows-code", 0.8),
    "release": ("workflows-code", 0.7),
}
```

</details>

<details>
<summary><strong>Python version error</strong></summary>

**Symptoms:**
```
SyntaxError: invalid syntax
```

**Solution:**
```bash
# Check Python version
python --version

# Use Python 3 explicitly if needed
python3 .opencode/scripts/skill_advisor.py "test query"

# Or update the shebang in the script
#!/usr/bin/env python3
```

</details>

<details>
<summary><strong>JSON output malformed</strong></summary>

**Symptoms:**
- Output is not valid JSON
- Extra text before or after JSON

**Solution:**
1. Ensure script only outputs JSON to stdout
2. Redirect debug/log messages to stderr

```python
# Good: Output only JSON
print(json.dumps(result))

# Good: Debug to stderr
print("Processing...", file=sys.stderr)
print(json.dumps(result))

# Bad: Debug output mixed with JSON
print("Processing...")  # This breaks JSON parsing
print(json.dumps(result))
```

</details>

<details>
<summary><strong>Skill not discovered (skill directory issue)</strong></summary>

**Symptoms:**
- New skill not appearing in recommendations
- Empty or incomplete skill list

**Solution:**
```bash
# Verify skill directory exists
ls -la .opencode/skill/

# Check skill has SKILL.md with valid frontmatter
cat .opencode/skill/your-skill/SKILL.md | head -20

# Verify frontmatter format
# ---
# name: your-skill
# description: "Your skill description"
# ---
```

</details>

---

## Related Guides

- [Master Installation Guide](./README.md)
- [SET-UP - Skill Creation](./SET-UP%20-%20Skill%20Creation.md)
- [MCP - Code Context](./MCP/MCP%20-%20Code%20Context.md)
- [MCP - LEANN](./MCP/MCP%20-%20LEANN.md)
