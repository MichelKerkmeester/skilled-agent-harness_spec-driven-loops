# Skill Advisor Setup Guide

The Skill Advisor is a Python script that analyzes user requests and recommends appropriate skills with confidence scores. It powers Gate 2 in AGENTS.md, enabling intelligent skill routing.

> **Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.
> **Scope**: .opencode/skill/scripts/skill_advisor.py

---

## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [PREREQUISITES](#2--prerequisites)
3. [INSTALLATION VERIFICATION](#3--installation-verification)
4. [HOW IT WORKS](#4--how-it-works)
5. [CURRENT SKILLS REFERENCE](#5--current-skills-reference)
6. [THRESHOLD TUNING GUIDE](#6--threshold-tuning-guide)
7. [EXAMPLE CALCULATIONS](#7--example-calculations)
8. [CUSTOMIZATION](#8--customization)
9. [TESTING](#9--testing)
10. [DEBUGGING](#10--debugging)
11. [TROUBLESHOOTING](#11--troubleshooting)

---

## AI SET-UP GUIDE

**Copy and paste this prompt to your AI assistant:**

```
I want to set up the Skill Advisor for my OpenCode project.

Please help me:
1. Verify Python 3.6+ is installed
2. Check the skill_advisor.py script exists at .opencode/skill/scripts/
3. Make the script executable
4. Test the advisor with sample queries
5. Verify all 8 skills are routing correctly

My project is at: [your project path]

Guide me through each step.
```

**What the AI will do:**
- Verify Python version
- Check script location and permissions
- Test skill routing for all 8 current skills
- Validate confidence thresholds

**Expected setup time:** 5-10 minutes

---

## 1. OVERVIEW

### What is skill_advisor.py?

The Skill Advisor is a lightweight Python script that:
- Analyzes incoming user requests via tokenization and pattern matching
- Applies intent boosters for high-confidence keyword detection
- Expands queries with synonyms for better matching
- Returns confidence-scored recommendations using a two-tiered formula
- Enables automatic skill routing in AI agent workflows

### Location

```
.opencode/skill/scripts/skill_advisor.py
```

### Integration with AGENTS.md

Gate 2 in AGENTS.md invokes the Skill Advisor:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 2: SKILL ROUTING [MANDATORY]                                           │
│ Action:  Run python .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST"      │
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

## 2. PREREQUISITES

### System Requirements

| Requirement | Version | Check Command                  |
| ----------- | ------- | ------------------------------ |
| Python      | 3.6+    | `python --version`             |
| AGENTS.md   | Current | Check Gate 2 references script |

### File Permissions

The script must be executable:

```bash
# Check current permissions
ls -la .opencode/skill/scripts/skill_advisor.py

# Make executable if needed
chmod +x .opencode/skill/scripts/skill_advisor.py
```

### Directory Structure

```
.opencode/
├── skill/                   # Skills to match against
│   ├── scripts/
│   │   └── skill_advisor.py    # This script
│   ├── mcp-code-mode/
│   ├── mcp-figma/
│   ├── system-spec-kit/
│   ├── mcp-chrome-devtools/
│   ├── sk-code--full-stack/
│   ├── sk-code--web/
│   ├── sk-documentation/
│   └── sk-git/
└── install_guides/
    └── SET-UP - Skill Advisor.md
```

---

## 3. INSTALLATION VERIFICATION

### Step 1: Verify Script Exists

```bash
ls -la .opencode/skill/scripts/skill_advisor.py
```

Expected output:
```
-rwxr-xr-x  1 user  staff  12345 Dec 23 10:00 skill_advisor.py
```

### Step 2: Test Basic Invocation

```bash
python .opencode/skill/scripts/skill_advisor.py "how does authentication work"
```

### Expected Output Format

```json
[
  {
    "skill": "sk-git",
    "confidence": 0.92,
    "reason": "Matched: !commit, git(name)"
  }
]
```

### Step 3: Verify High-Confidence Routing

Test that key phrases trigger their expected skills above 0.8 threshold:

```bash
# Should return sk-git with confidence > 0.8
python .opencode/skill/scripts/skill_advisor.py "create a pull request for my changes"

# Should return system-spec-kit with confidence > 0.8
python .opencode/skill/scripts/skill_advisor.py "save this context to memory"
```

### Validation Checkpoint

```
□ Script exists at .opencode/skill/scripts/skill_advisor.py
□ Script is executable (chmod +x applied)
□ Returns valid JSON array
□ High-confidence queries return > 0.8 confidence
□ All 8 skills are discoverable
```

---

## 4. HOW IT WORKS

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
| Skill Name Match           | +1.5      | "git" matches "sk-git"    |
| Description Match          | +1.0      | "browser" in skill description   |
| Substring Match (4+ chars) | +0.5      | "authen~" partial match          |

### 4.4 Intent Boosters

Intent boosters are high-confidence keywords that strongly indicate a specific skill. They are checked **before** stop word filtering, allowing question words to contribute.

**Why this matters**: Words like "how", "what", "why", "does", "work" would normally be filtered as stop words, but they are critical signals for certain skills.

Example boost values:

| Keyword          | Target Skill              | Boost |
| ---------------- | ------------------------- | ----- |
| `figma`          | mcp-code-mode             | +2.5  |
| `webflow`        | mcp-code-mode             | +2.5  |
| `github`         | sk-git             | +2.0  |
| `worktree`       | sk-git             | +1.2  |
| `browser`        | mcp-chrome-devtools | +1.2  |

### 4.5 Multi-Skill Boosters

Some keywords are ambiguous and boost multiple skills:

| Keyword   | Skills Boosted                                |
| --------- | --------------------------------------------- |
| `code`    | sk-code--web (+0.2)                         |
| `context` | system-spec-kit (+0.3)                        |
| `plan`    | system-spec-kit (+0.3), sk-code--web (+0.2) |

---

## 5. CURRENT SKILLS REFERENCE

The Skill Advisor routes to these 8 skills based on trigger keywords:

### 5.1 mcp-code-mode

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

### 5.2 system-spec-kit

**Purpose**: Spec folder management, context preservation and semantic memory search

**Trigger Keywords** (Intent Boosters):
```
checkpoint, history, memory, recall, remember, restore, spec, template
```

**Example Queries**:
- "save this context to memory"
- "recall what we discussed about auth"
- "restore the previous checkpoint"
- "create a spec folder for this feature"
- "create a spec for this feature"

---

### 5.3 mcp-chrome-devtools

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

### 5.4 mcp-figma

**Purpose**: Figma design integration and component extraction

**Trigger Keywords** (Intent Boosters):
```
figma, design, component, export, frame, node
```

**Example Queries**:
- "get the Figma design"
- "export components from Figma"
- "fetch the Figma frame"

---

### 5.5 sk-code--web / sk-code--full-stack

**Purpose**: Implementation, debugging, and verification lifecycle for web development and full-stack projects

**Trigger Keywords** (Intent Boosters):
```
bug, implement, refactor, verification, error
```

**Example Queries**:
- "implement the new feature"
- "fix this bug"
- "refactor the auth module"

---

### 5.6 sk-git

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

### 5.7 sk-documentation

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

## 6. THRESHOLD TUNING GUIDE

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

Modify the threshold in your AGENTS.md Gate 2 (Skill Routing):

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

## 7. EXAMPLE CALCULATIONS

### Example 1: High-Confidence Match (sk-git)

**Request**: `"create a pull request for my changes"`

**Step 1: Tokenization**
```
Tokens: ["create", "a", "pull", "request", "for", "my", "changes"]
```

**Step 2: Intent Boosters (before stop word filter)**
```
"pull" → sk-git +0.5
"changes" → MULTI_SKILL_BOOSTERS:
  - sk-git +0.4
  - system-spec-kit +0.2
─────────────────────────────
sk-git total: 0.9
```

**Step 3: Stop Word Filter**
```
After filter: ["create", "pull", "request", "changes"]
(a, for, my are in STOP_WORDS but already counted in boosters)
```

**Step 4: Confidence Calculation**
```python
has_intent_boost = True  # 0.9 > 0
score = 2.4  # including name match for "pull" → +1.5
confidence = min(0.50 + 2.4 * 0.15, 0.95)
confidence = min(0.86, 0.95) = 0.86
```

**Result**: `sk-git` with **0.86 confidence** ✅ (> 0.8 threshold)

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

**Step 5: Skill Matching (for sk-documentation)**
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

**Result**: `sk-documentation` with **0.40 confidence** ❌ (below 0.8)

**Why?** No intent boosters matched. To improve, add "document" keyword:
- `"help me document the API"` → "document" triggers +0.5 boost

---

## 8. CUSTOMIZATION

### 8.1 Adding Intent Boosters

Add high-confidence keywords to `INTENT_BOOSTERS` in the script:

```python
INTENT_BOOSTERS = {
    # Existing entries...
    
    # Add your custom boosters:
    "deploy": ("sk-code--web", 0.8),
    "staging": ("sk-code--web", 0.6),
    "production": ("sk-code--web", 0.7),
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
        ("sk-code--web", 0.4),
        ("sk-git", 0.3),
    ],
}
```

### 8.4 Project-Type Optimization

Boost certain skills based on project type:

**Frontend Projects** (add to INTENT_BOOSTERS):
```python
"responsive": ("mcp-chrome-devtools", 0.5),
"mobile": ("mcp-chrome-devtools", 0.5),
"css": ("mcp-chrome-devtools", 0.4),
```

**Backend Projects**:
```python
"database": ("sk-code--web", 0.5),
"endpoint": ("sk-code--web", 0.5),
"migration": ("sk-code--web", 0.6),
```

---

## 9. TESTING

### Quick Validation Tests

Run these commands to verify each skill routes correctly:

```bash
# mcp-code-mode - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "get my Webflow sites"
python .opencode/skill/scripts/skill_advisor.py "fetch the Figma design"

# system-spec-kit - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "save this context to memory"
python .opencode/skill/scripts/skill_advisor.py "restore the previous checkpoint"

# mcp-chrome-devtools - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "debug in chrome browser"
python .opencode/skill/scripts/skill_advisor.py "take a screenshot of the page"

# sk-code--web or sk-code--full-stack - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "implement the new feature"
python .opencode/skill/scripts/skill_advisor.py "fix the bug and verify"

# sk-git - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "create a pull request on github"
python .opencode/skill/scripts/skill_advisor.py "commit my changes and push"

# sk-documentation - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "create a skill for my workflow"
python .opencode/skill/scripts/skill_advisor.py "validate the markdown structure"

# No match test - should return empty or low confidence
python .opencode/skill/scripts/skill_advisor.py "hello world"
```

### Batch Testing Script

```bash
#!/bin/bash
# Save as test_skill_advisor.sh

SCRIPT=".opencode/skill/scripts/skill_advisor.py"
TESTS=(
    "get webflow sites|mcp-code-mode"
    "get the figma design|mcp-figma"
    "save context to memory|system-spec-kit"
    "debug in chrome|mcp-chrome-devtools"
    "implement the feature|sk-code--web"
    "create pull request github|sk-git"
    "create a skill for workflow|sk-documentation"
    "validate markdown structure|sk-documentation"
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
□ All 8 skills route correctly with known queries
□ High-confidence keywords reach > 0.8 threshold
□ Ambiguous queries return reasonable suggestions
□ Empty/irrelevant queries return low confidence
□ No unexpected skill matches (false positives)
```

---

## 10. DEBUGGING

### Understanding Why a Skill Wasn't Triggered

When a query doesn't route to the expected skill, analyze step-by-step:

**Step 1: Check the raw output**
```bash
python .opencode/skill/scripts/skill_advisor.py "your query here"
```

**Step 2: Examine the "reason" field**
The output shows which patterns matched:
```json
{
  "skill": "sk-code--web",
  "confidence": 0.65,
  "reason": "Matched: !implement, code(name)"
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
grep -n "your_keyword" .opencode/skill/scripts/skill_advisor.py
```

If not found in `INTENT_BOOSTERS`, the keyword won't get the boost needed for high confidence.

**Step 4: Verify stop words aren't filtering critical terms**

Check if your important word is in `STOP_WORDS`:
```bash
grep "'your_word'" .opencode/skill/scripts/skill_advisor.py | head -5
```

### Common Debugging Scenarios

**Scenario: "fix the login bug" not routing to sk-code--web**

Check:
1. "fix" is in `MULTI_SKILL_BOOSTERS` → sk-code--web +0.3
2. "bug" is in `INTENT_BOOSTERS` → sk-code--web +0.5
3. "login" may boost other skills (may compete)
4. Total: depends on accumulated boosts per skill

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

## 11. TROUBLESHOOTING

<details>
<summary><strong>Script not found</strong></summary>

**Symptoms:**
```
python: can't open file '.opencode/skill/scripts/skill_advisor.py': [Errno 2] No such file or directory
```

**Solution:**
```bash
# Create the scripts directory if missing
mkdir -p .opencode/skill/scripts

# Verify the path
ls -la .opencode/skill/scripts/

# If script is missing, check if it needs to be created or restored
```

</details>

<details>
<summary><strong>Permission denied</strong></summary>

**Symptoms:**
```
-bash: .opencode/skill/scripts/skill_advisor.py: Permission denied
```

**Solution:**
```bash
# Make the script executable
chmod +x .opencode/skill/scripts/skill_advisor.py

# Verify permissions
ls -la .opencode/skill/scripts/skill_advisor.py
# Should show: -rwxr-xr-x
```

</details>

<details>
<summary><strong>Wrong skill recommended</strong></summary>

**Symptoms:**
- Script recommends an unexpected skill when you wanted `sk-code--web`

**Solution:**
1. Check intent booster values for competing skills
2. Add more specific keywords for your use case
3. Increase boost values for target skill

```python
# Example: Make "implement" stronger for sk-code--web
INTENT_BOOSTERS = {
    "implement": ("sk-code--web", 1.2),  # Increased from 0.6
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
    "deploy": ("sk-code--web", 0.8),
    "release": ("sk-code--web", 0.7),
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
python3 .opencode/skill/scripts/skill_advisor.py "test query"

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
- [MCP - Code Context](./MCP%20-%20Code%20Context.md)
