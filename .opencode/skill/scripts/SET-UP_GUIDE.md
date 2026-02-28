# Skill Advisor Setup Guide

Complete installation and configuration guide for `skill_advisor.py`, a lightweight Python script that analyzes user requests and recommends appropriate skills with confidence scores. Powers Gate 2 in AGENTS.md, enabling intelligent skill routing across 8 specialized skills. Requires only Python 3.6+, no external dependencies.

---

## TABLE OF CONTENTS

0. [AI-FIRST SETUP GUIDE](#0-ai-first-setup-guide)
1. [OVERVIEW](#1-overview)
2. [PREREQUISITES](#2-prerequisites)
3. [INSTALLATION](#3-installation)
4. [CONFIGURATION](#4-configuration)
5. [VERIFICATION](#5-verification)
6. [USAGE](#6-usage)
7. [FEATURES](#7-features)
8. [EXAMPLES](#8-examples)
9. [TROUBLESHOOTING](#9-troubleshooting)
10. [RESOURCES](#10-resources)

---

## 0. AI-FIRST SETUP GUIDE

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
- Verify Python version and script location
- Check script permissions and apply chmod if needed
- Test skill routing for all 8 current skills
- Validate confidence thresholds against the 0.8 gate

**Expected setup time:** 5-10 minutes

---

## 1. OVERVIEW

The Skill Advisor is a lightweight Python script that analyzes incoming user requests and recommends the most appropriate skill with a confidence score, powering the mandatory Gate 2 routing step in AGENTS.md.

### Core Principle

> **Configure once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### What is skill_advisor.py?

The Skill Advisor:
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
│ Action:  Run python .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST"│
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

**Phase 1** focuses on confirming required software and file presence before any further steps.

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
│   ├── sk-doc/
│   └── sk-git/
└── install_guides/
    └── SET-UP - Skill Advisor.md
```

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
python --version                                         # → Python 3.6 or higher
ls -la .opencode/skill/scripts/skill_advisor.py         # → file exists with permissions shown
```

**Checklist:**
- [ ] `python --version` returns 3.6 or higher?
- [ ] `skill_advisor.py` exists at `.opencode/skill/scripts/`?

❌ **STOP if validation fails** - Install Python 3.6+ or restore the script file before continuing.

---

## 3. INSTALLATION

This section covers **Phase 2 (script runs cleanly)** and **Phase 3 (skills are discoverable)**.

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

### Validation: `phase_2_complete`

```bash
# Script runs without import errors:
python .opencode/skill/scripts/skill_advisor.py "test query"    # → valid JSON array
```

**Checklist:**
- [ ] Script runs without `ImportError` or `SyntaxError`?
- [ ] Output is a valid JSON array?

❌ **STOP if validation fails** - Check Python version compatibility or script file integrity.

### Step 3: Verify Skill Discovery

The script auto-discovers skills by scanning `.opencode/skill/` for `SKILL.md` files. Confirm skills are registered:

```bash
# Count discoverable SKILL.md files
ls .opencode/skill/*/SKILL.md
```

Expected: 8 skill files listed (mcp-code-mode, mcp-figma, mcp-chrome-devtools, system-spec-kit, sk-code--web, sk-code--full-stack, sk-git, sk-doc).

### Validation: `phase_3_complete`

```bash
# Skills are registered if routing returns a known skill name:
python .opencode/skill/scripts/skill_advisor.py "save context to memory"
# → JSON with "skill": "system-spec-kit"
```

**Checklist:**
- [ ] At least one skill directory contains a `SKILL.md` file?
- [ ] Output skill name matches a known skill?

❌ **STOP if validation fails** - Confirm `.opencode/skill/` directories exist and each contains a valid `SKILL.md` file.

---

## 4. CONFIGURATION

This section covers threshold tuning and customization (Phase 4).

### How It Works: Processing Pipeline

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

### Confidence Calculation Algorithm

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
- **With intent boost**: Need total score >= 2.0
- **Without intent boost**: Need total score >= 3.67 (very difficult)

### Scoring Components

| Match Type                 | Points    | Example                          |
| -------------------------- | --------- | -------------------------------- |
| Intent Booster             | 0.3 - 2.5 | "figma" → +2.5 for mcp-code-mode |
| Skill Name Match           | +1.5      | "git" matches "sk-git"           |
| Description Match          | +1.0      | "browser" in skill description   |
| Substring Match (4+ chars) | +0.5      | "authen~" partial match          |

### Intent Boosters

Intent boosters are high-confidence keywords that strongly indicate a specific skill. They are checked **before** stop word filtering, allowing question words to contribute.

**Why this matters**: Words like "how", "what", "why", "does", "work" would normally be filtered as stop words, but they are critical signals for certain skills.

Example boost values:

| Keyword          | Target Skill         | Boost |
| ---------------- | -------------------- | ----- |
| `figma`          | mcp-code-mode        | +2.5  |
| `webflow`        | mcp-code-mode        | +2.5  |
| `github`         | sk-git               | +2.0  |
| `worktree`       | sk-git               | +1.2  |
| `browser`        | mcp-chrome-devtools  | +1.2  |

### Multi-Skill Boosters

Some keywords are ambiguous and boost multiple skills:

| Keyword   | Skills Boosted                                |
| --------- | --------------------------------------------- |
| `code`    | sk-code--web (+0.2)                           |
| `context` | system-spec-kit (+0.3)                        |
| `plan`    | system-spec-kit (+0.3), sk-code--web (+0.2)   |

### Threshold Tuning Guide

The confidence threshold (default: 0.8) determines when skill routing becomes mandatory.

| Threshold | Routing Behavior   | False Positives | False Negatives | Use Case               |
| --------- | ------------------ | --------------- | --------------- | ---------------------- |
| **0.6**   | Aggressive         | Higher          | Lower           | Testing, exploration   |
| **0.8**   | Balanced (default) | Low             | Low             | Production use         |
| **0.9**   | Conservative       | Very low        | Higher          | Minimize wrong routing |

**Lower to 0.6** if:
- Skills aren't being triggered when expected
- You want more exploration of skill capabilities
- You're testing new skill patterns

**Raise to 0.9** if:
- Too many false positive skill matches
- Prefer manual tool selection for ambiguous queries
- Critical workflows where wrong skill is costly

Modify the threshold in your AGENTS.md Gate 2 (Skill Routing):

```markdown
│ Logic:   IF confidence > 0.6 → MUST invoke skill  (aggressive)
│ Logic:   IF confidence > 0.8 → MUST invoke skill  (balanced - default)
│ Logic:   IF confidence > 0.9 → MUST invoke skill  (conservative)
```

### Customization

**Adding Intent Boosters**

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

Boost value guidelines:
- **0.3-0.5**: Weak signal, needs other matches
- **0.6-1.0**: Moderate signal
- **1.2-2.0**: Strong signal, likely triggers routing
- **2.5+**: Very strong signal (reserved for definitive keywords like "figma", "clickup")

**Adding Synonyms**

Expand query understanding with synonyms:

```python
SYNONYM_MAP = {
    # Existing entries...

    # Add your synonyms:
    "deploy": ["release", "ship", "publish", "launch"],
    "staging": ["preview", "test", "sandbox"],
}
```

**Adding Multi-Skill Boosters**

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

**Project-Type Optimization**

Frontend Projects (add to INTENT_BOOSTERS):

```python
"responsive": ("mcp-chrome-devtools", 0.5),
"mobile": ("mcp-chrome-devtools", 0.5),
"css": ("mcp-chrome-devtools", 0.4),
```

Backend Projects:

```python
"database": ("sk-code--web", 0.5),
"endpoint": ("sk-code--web", 0.5),
"migration": ("sk-code--web", 0.6),
```

### Validation: `phase_4_complete`

```bash
# Confirm Gate 2 threshold is set in AGENTS.md:
grep "confidence > 0." AGENTS.md    # → shows threshold value (e.g., 0.8)

# Confirm any custom boosters load without error:
python .opencode/skill/scripts/skill_advisor.py "deploy to staging"    # → valid JSON
```

**Checklist:**
- [ ] AGENTS.md Gate 2 references the script with correct threshold?
- [ ] Any custom boosters or synonyms added without syntax errors?

❌ **STOP if validation fails** - Check AGENTS.md Gate 2 syntax or fix Python syntax errors in the script.

---

## 5. VERIFICATION

Verify that routing works end-to-end and Gate 2 integration is functional (Phase 5).

### Step 1: Test High-Confidence Routing

```bash
# Should return sk-git with confidence > 0.8
python .opencode/skill/scripts/skill_advisor.py "create a pull request for my changes"

# Should return system-spec-kit with confidence > 0.8
python .opencode/skill/scripts/skill_advisor.py "save this context to memory"
```

### Step 2: Run Full Skill Routing Validation

```bash
# mcp-code-mode - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "get my Webflow sites"

# system-spec-kit - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "restore the previous checkpoint"

# mcp-chrome-devtools - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "debug in chrome browser"

# sk-code--web or sk-code--full-stack - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "implement the new feature"

# sk-git - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "create a pull request on github"

# sk-doc - should return > 0.8
python .opencode/skill/scripts/skill_advisor.py "create a skill for my workflow"

# No match test - should return empty or low confidence
python .opencode/skill/scripts/skill_advisor.py "hello world"
```

### Step 3: Run Batch Test Script

Save as `test_skill_advisor.sh` and run to verify all skills:

```bash
#!/bin/bash
SCRIPT=".opencode/skill/scripts/skill_advisor.py"
TESTS=(
    "get webflow sites|mcp-code-mode"
    "get the figma design|mcp-figma"
    "save context to memory|system-spec-kit"
    "debug in chrome|mcp-chrome-devtools"
    "implement the feature|sk-code--web"
    "create pull request github|sk-git"
    "create a skill for workflow|sk-doc"
    "validate markdown structure|sk-doc"
)

echo "=== Skill Advisor Batch Test ==="
for test in "${TESTS[@]}"; do
    IFS='|' read -r query expected <<< "$test"
    result=$(python "$SCRIPT" "$query" | head -20)
    skill=$(echo "$result" | grep -o '"skill": "[^"]*"' | head -1 | cut -d'"' -f4)
    conf=$(echo "$result" | grep -o '"confidence": [0-9.]*' | head -1 | awk '{print $2}')

    if [[ "$skill" == "$expected" && $(echo "$conf > 0.8" | bc -l) -eq 1 ]]; then
        echo "PASS: \"$query\" → $skill ($conf)"
    else
        echo "FAIL: \"$query\" → Expected $expected >0.8, got $skill ($conf)"
    fi
done
```

### Success Criteria (`phase_5_complete`)

- [ ] All 8 skills route correctly with known queries
- [ ] High-confidence keywords reach > 0.8 threshold
- [ ] Ambiguous queries return reasonable suggestions
- [ ] Empty or irrelevant queries return low confidence
- [ ] Gate 2 in AGENTS.md routes correctly during an actual AI session

❌ **STOP if validation fails** - Check confidence scores against thresholds, add boosters for keywords that are missing, or lower threshold if routing is too restrictive.

---

## 6. USAGE

### Daily Workflow

The Skill Advisor runs automatically as part of Gate 2 in every AI session. No manual invocation is needed for normal operation.

For manual testing or debugging a specific query:

```bash
# Test any query directly
python .opencode/skill/scripts/skill_advisor.py "your query here"

# Test with a threshold flag (if supported)
python .opencode/skill/scripts/skill_advisor.py "your query" --threshold 0.8
```

### Understanding the Reason Field

The output `reason` field shows which patterns matched:

```json
{
  "skill": "sk-code--web",
  "confidence": 0.65,
  "reason": "Matched: !implement, code(name)"
}
```

Prefix meanings:
- `!keyword` - Intent booster matched
- `keyword(name)` - Matched skill name
- `keyword` - Matched skill description
- `keyword~` - Substring match

### Debugging Why a Skill Was Not Triggered

When a query does not route to the expected skill, analyze step by step:

**Step 1: Check the raw output**

```bash
python .opencode/skill/scripts/skill_advisor.py "your query here"
```

**Step 2: Check if intent boosters exist for your keyword**

```bash
grep -n "your_keyword" .opencode/skill/scripts/skill_advisor.py
```

If not found in `INTENT_BOOSTERS`, the keyword will not get the boost needed for high confidence.

**Step 3: Verify stop words are not filtering critical terms**

```bash
grep "'your_word'" .opencode/skill/scripts/skill_advisor.py | head -5
```

**Step 4: Use a verbose debug snippet**

Add this temporarily to `skill_advisor.py` for tracing:

```python
# Add to skill_advisor.py temporarily for debugging
import sys
if "--debug" in sys.argv:
    print(f"DEBUG: Tokens = {all_tokens}", file=sys.stderr)
    print(f"DEBUG: Intent boosts = {skill_boosts}", file=sys.stderr)
    print(f"DEBUG: After filter = {tokens}", file=sys.stderr)
    print(f"DEBUG: Expanded = {search_terms}", file=sys.stderr)
```

### Common Debugging Scenarios

**Scenario: "fix the login bug" not routing to sk-code--web**

Check:
1. "fix" is in `MULTI_SKILL_BOOSTERS` at sk-code--web +0.3
2. "bug" is in `INTENT_BOOSTERS` at sk-code--web +0.5
3. "login" may boost other skills and create competition
4. Total depends on accumulated boosts per skill

Solution: Add more boosters or rephrase query.

**Scenario: Query returns wrong skill**

Check which skill has higher boosts for your keywords. You may need to:
1. Increase boost value for the correct skill
2. Add more specific keywords
3. Add negative boosters (remove points) for the wrong skill

---

## 7. FEATURES

The Skill Advisor routes to these 8 skills based on trigger keywords:

### mcp-code-mode

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

### system-spec-kit

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

---

### mcp-chrome-devtools

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

### mcp-figma

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

### sk-code--web / sk-code--full-stack

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

### sk-git

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

### sk-doc

**Purpose**: Unified markdown and skill management including document quality enforcement, skill creation workflow, flowchart creation, and install guide creation

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

## 8. EXAMPLES

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

**Result**: `sk-git` with **0.86 confidence** (above 0.8 threshold, routing is mandatory)

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

**Step 5: Skill Matching (for sk-doc)**

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

**Result**: `sk-doc` with **0.40 confidence** (below 0.8, no mandatory routing)

**Why?** No intent boosters matched. To improve, use "document" instead:
- `"help me document the API"` → "document" triggers +0.5 boost

---

## 9. TROUBLESHOOTING

### Script Not Found

**Error message:**

```
python: can't open file '.opencode/skill/scripts/skill_advisor.py': [Errno 2] No such file or directory
```

**Cause**: The scripts directory or the script file is missing from the expected path.

**Fix:**

```bash
# Create the scripts directory if missing
mkdir -p .opencode/skill/scripts

# Verify the path
ls -la .opencode/skill/scripts/

# If script is missing, check if it needs to be restored from version control
git status .opencode/skill/scripts/
```

---

### Permission Denied

**Error message:**

```
-bash: .opencode/skill/scripts/skill_advisor.py: Permission denied
```

**Cause**: The script file exists but is not executable.

**Fix:**

```bash
# Make the script executable
chmod +x .opencode/skill/scripts/skill_advisor.py

# Verify permissions
ls -la .opencode/skill/scripts/skill_advisor.py
# Should show: -rwxr-xr-x
```

---

### Wrong Skill Recommended

**Symptom**: Script recommends an unexpected skill when you expected `sk-code--web` or another specific skill.

**Cause**: A competing skill has higher boost values for the keywords in your query.

**Fix:**

1. Check intent booster values for competing skills
2. Add more specific keywords for your use case
3. Increase boost values for the target skill

```python
# Example: Make "implement" stronger for sk-code--web
INTENT_BOOSTERS = {
    "implement": ("sk-code--web", 1.2),  # Increased from 0.6
}
```

---

### No Skill Recommended (Confidence Too Low)

**Symptom**: Script returns an empty array or very low confidence scores.

**Error output:**

```json
[]
```

**Cause**: No intent boosters matched and keyword scores alone are insufficient to reach the threshold.

**Fix:**

1. Add intent boosters for common query patterns
2. Check if key words are being filtered as stop words
3. Add synonyms for better matching
4. Lower threshold if appropriate (see Section 4)

```python
# Add boosters for your common queries
INTENT_BOOSTERS = {
    "deploy": ("sk-code--web", 0.8),
    "release": ("sk-code--web", 0.7),
}
```

---

### Python Version Error

**Error message:**

```
SyntaxError: invalid syntax
```

**Cause**: Script requires Python 3.6+ but an older version is active.

**Fix:**

```bash
# Check Python version
python --version

# Use Python 3 explicitly if needed
python3 .opencode/skill/scripts/skill_advisor.py "test query"

# Or update the shebang in the script to force Python 3
#!/usr/bin/env python3
```

---

### JSON Output Malformed

**Symptom**: Output is not valid JSON, or contains extra text before or after the JSON array.

**Cause**: Debug or print statements in the script are writing to stdout alongside the JSON output.

**Fix:**

1. Ensure the script only outputs JSON to stdout
2. Redirect any debug or log messages to stderr

```python
# Good: Output only JSON
print(json.dumps(result))

# Good: Debug output goes to stderr, not stdout
print("Processing...", file=sys.stderr)
print(json.dumps(result))

# Bad: Debug output mixed with JSON (breaks JSON parsing)
print("Processing...")
print(json.dumps(result))
```

---

### Skill Not Discovered (Skill Directory Issue)

**Symptom**: A new skill is not appearing in recommendations, or the skill list is empty or incomplete.

**Cause**: The skill directory is missing, or the `SKILL.md` file has missing or malformed frontmatter.

**Fix:**

```bash
# Verify skill directory exists
ls -la .opencode/skill/

# Check skill has SKILL.md with valid frontmatter
head -20 .opencode/skill/your-skill/SKILL.md

# Verify frontmatter format:
# ---
# name: your-skill
# description: "Your skill description"
# ---
```

---

## 10. RESOURCES

### File Locations

| Path                                          | Purpose                        |
| --------------------------------------------- | ------------------------------ |
| `.opencode/skill/scripts/skill_advisor.py`    | Main routing script            |
| `.opencode/skill/*/SKILL.md`                  | Skill definitions (auto-scanned) |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Symlink to this guide   |

### CLI Command Reference

```bash
# Basic routing query
python .opencode/skill/scripts/skill_advisor.py "your query"

# With explicit threshold check
python .opencode/skill/scripts/skill_advisor.py "your query" --threshold 0.8

# Check permissions
ls -la .opencode/skill/scripts/skill_advisor.py

# Make executable
chmod +x .opencode/skill/scripts/skill_advisor.py

# Search for keyword in script
grep -n "your_keyword" .opencode/skill/scripts/skill_advisor.py
```

### Related Guides

- [Master Installation Guide](./README.md)
- [SET-UP - Skill Creation](./SET-UP%20-%20Skill%20Creation.md)
- [MCP - Code Context](./MCP%20-%20Code%20Context.md)
