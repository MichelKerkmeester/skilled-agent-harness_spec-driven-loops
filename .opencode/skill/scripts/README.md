---
title: "Scripts"
description: "Shell and Python automation scripts for the OpenCode framework, including the skill routing engine used by Gate 2 in AGENTS.md."
trigger_phrases:
  - "scripts"
  - "automation"
  - "skill advisor"
  - "skill routing"
  - "gate 2"
---

# Scripts

> Automation scripts for the OpenCode framework: skill routing, build tooling, developer utilities and project automation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. 🚀 QUICK START](#3--quick-start)
- [4. ⚡ SKILL ADVISOR](#4--skill-advisor)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. ❓ FAQ](#8--faq)
- [9. 📚 RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is this directory?

`.opencode/skill/scripts/` contains automation scripts used by the OpenCode framework. The primary script is `skill_advisor.py`, the routing engine that powers Gate 2 in AGENTS.md. It analyzes user requests and recommends the most appropriate skill with a confidence score.

### Scripts Inventory

| Script | Language | Purpose |
|--------|----------|---------|
| `skill_advisor.py` | Python 3.6+ | Analyzes user requests, recommends skills via keyword matching, synonym expansion, intent detection and confidence scoring. Powers Gate 2. |
| `agents/activate-provider.sh` | Bash | Activates `copilot` or `chatgpt` profile into `.opencode/agent/*.md` with backup, verification and rollback. |
| `agents/provider-status.sh` | Bash | Reports active provider state by comparing runtime agent files against profile folders. |

### Supporting Files

| File | Purpose |
|------|---------|
| `agents/README.md` | Detailed operator guide for provider switching logic and rollback behavior |
| `SET-UP_GUIDE.md` | Customization guide for adapting `skill_advisor.py` to your project |
| `README.md` | This documentation |

### Key Statistics

| Component | Count | Description |
|-----------|-------|-------------|
| Stop Words | ~60 | Filtered from queries for cleaner matching |
| Synonym Mappings | ~25 | Expand user intent to technical terms |
| Intent Boosters | ~80 | Direct keyword-to-skill mappings |
| Command Bridges | 2 | Slash commands exposed as pseudo-skills |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Python | 3.6+ | 3.10+ |
| `.opencode/skill/` | At least 1 SKILL.md | All project skills installed |

<!-- /ANCHOR:overview -->

---

## 2. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
.opencode/skill/scripts/
├── skill_advisor.py          # Skill routing engine (Gate 2)
├── SET-UP_GUIDE.md           # Customization guide
└── README.md                 # This file
```

### How It Fits in the Framework

```
.opencode/
└── skill/
    ├── scripts/
    │   └── skill_advisor.py     ← This directory
    ├── workflows-git/
    │   └── SKILL.md         # Parsed for name/description
    ├── workflows-code--web-dev/
    │   └── SKILL.md
    ├── system-spec-kit/
    │   └── SKILL.md
    └── ...
```

<!-- /ANCHOR:structure -->

---

## 3. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. Verify Python is installed
python3 --version
# Expected: Python 3.6+

# 2. Test skill advisor from project root
python3 .opencode/skill/scripts/skill_advisor.py "test"
# Expected: JSON array (may be empty for generic queries)

# 3. Analyze a real request
python3 .opencode/skill/scripts/skill_advisor.py "help me commit my changes"
# Expected: JSON with workflows-git at ~0.92 confidence
```

### Verify Installation

```bash
# Check that skill discovery works
python3 .opencode/skill/scripts/skill_advisor.py "help me commit my changes"

# Expected output:
# [
#   {
#     "skill": "workflows-git",
#     "confidence": 0.92,
#     "reason": "Matched: !commit, git(name)"
#   }
# ]
```

### Integration with AI Agents

In your AI agent workflow (e.g., AGENTS.md Gate 2):

```bash
# Run skill advisor and capture output
RESULT=$(python .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST")

# Parse first recommendation
SKILL=$(echo $RESULT | python -c "import sys,json; r=json.load(sys.stdin); print(r[0]['skill'] if r else '')")
CONFIDENCE=$(echo $RESULT | python -c "import sys,json; r=json.load(sys.stdin); print(r[0]['confidence'] if r else 0)")

# Route based on confidence
if (( $(echo "$CONFIDENCE > 0.8" | bc -l) )); then
    echo "Invoking skill: $SKILL"
fi
```

<!-- /ANCHOR:quick-start -->

---

## 4. ⚡ SKILL ADVISOR
<!-- ANCHOR:skill-advisor -->

### How It Integrates with AGENTS.md

```
┌──────────────────────────────────────────────────────────────────┐
│                         GATE 2                                   │
│               Skill Routing (MANDATORY)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Request: "help me commit my changes"                       │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────┐                     │
│  │ python skill_advisor.py "$USER_REQUEST" │                     │
│  └────────────────────┬────────────────────┘                     │
│                       │                                          │
│                       ▼                                          │
│  ┌─────────────────────────────────────────┐                     │
│  │ [                                       │                     │
│  │   {                                     │                     │
│  │     "skill": "workflows-git",           │                      │
│  │     "confidence": 0.92,                 │                      │
│  │     "reason": "Matched: !commit, git"   │                     │
│  │   }                                     │                     │
│  │ ]                                       │                     │
│  └────────────────────┬────────────────────┘                     │
│                       │                                          │
│                       ▼                                          │
│  IF confidence > 0.8 → MUST invoke skill                          │
│  ELSE → Proceed with manual tool selection                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                      skill_advisor.py                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐    │
│  │ STOP_WORDS  │    │ SYNONYM_MAP │    │  INTENT_BOOSTERS    │    │
│  │ (~60 words) │    │ (~25 maps)  │    │  (~80 mappings)     │    │
│  └──────┬──────┘    └──────┬──────┘    └──────────┬──────────┘    │
│         │                  │                      │               │
│         └──────────────────┼──────────────────────┘               │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                   analyze_request()                          │ │
│  │                                                              │ │
│  │  1. Tokenize user input                                      │ │
│  │  2. Filter stop words                                        │ │
│  │  3. Expand with synonyms                                     │ │
│  │  4. Apply intent boosters                                    │ │
│  │  5. Score against skill descriptions                         │ │
│  │  6. Calculate confidence                                      │ │
│  │  7. Return sorted recommendations                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    get_skills()                              │ │
│  │                                                              │ │
│  │  • Scans .opencode/skill/*/SKILL.md                          │ │
│  │  • Parses YAML frontmatter (name, description)               │ │
│  │  • Adds hardcoded command bridges                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Matching Algorithm Flow

```
User Input: "help me fix the authentication bug"
         │
         ▼
┌─────────────────────────────────────┐
│ 1. TOKENIZE                         │
│    ["help", "me", "fix", "the",      │
│     "authentication", "bug"]        │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 2. FILTER STOP WORDS                │
│    Remove: "help", "me", "the"      │
│    Keep: ["fix", "authentication",   │
│           "bug"]                    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 3. EXPAND SYNONYMS                  │
│    "fix" → ["debug", "correct",      │
│             "resolve", "code"]      │
│    "bug" → ["debug", "error",       │
│             "issue", "defect"]      │
│                                     │
│    Expanded: ["fix", "authentication │
│    "bug", "debug", "correct",       │
│    "resolve", "code", "error",      │
│    "issue", "defect", ...]          │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 4. APPLY INTENT BOOSTERS            │
│    "debug" → workflows-chrome-       │
│              devtools (+0.5)        │
│                                     │
│    Pre-calculated boost for         │
│    workflows-chrome-devtools: 0.5    │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 5. SCORE AGAINST SKILLS             │
│                                     │
│    For each skill:                  │
│    • Name match: +1.5               │
│    • Description match: +1.0        │
│    • Substring match (4+ chars):    │
│      +0.5                           │
│    • Intent booster: +boost_amount  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 6. CALCULATE CONFIDENCE             │
│                                     │
│    Two-tiered formula:              │
│                                     │
│    IF intent boost matched:         │
│      confidence = min(0.50 + score   │
│                       * 0.15, 0.95) │
│    ELSE (corpus only):              │
│      confidence = min(0.25 + score   │
│                       * 0.15, 0.95) │
│                                     │
│    • With boost: score=2 → 0.80     │
│    • Without: score=2 → 0.55        │
│    • Cap: 0.95                      │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ 7. RETURN SORTED RECOMMENDATIONS    │
│                                     │
│    [                                │
│      { "skill": "workflows-code",    │
│        "confidence": 0.85,           │
│        "reason": "Matched: debug,   │
│                   code, fix" }       │
│    ]                                │
└─────────────────────────────────────┘
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Dynamic Skill Discovery** | Automatically scans `.opencode/skill/` for available skills |
| **Synonym Expansion** | Maps user language to technical terms |
| **Intent Boosting** | High-confidence keywords directly map to specific skills |
| **Multi-Skill Boosters** | Ambiguous keywords boost multiple skills simultaneously |
| **Confidence Scoring** | Returns 0-0.95 confidence score for each recommendation |
| **Command Bridges** | Slash commands exposed as pseudo-skills for routing |
| **JSON Output** | Machine-readable output for automation |

### Dynamic Skill Discovery

The script automatically discovers skills by scanning the `.opencode/skill/` directory:

```python
for skill_file in glob.glob(os.path.join(SKILLS_DIR, "*/SKILL.md")):
    meta = parse_frontmatter(skill_file)
    if meta and 'name' in meta:
        skills[meta['name']] = {
            "description": meta.get('description', ''),
            "weight": 1.0
        }
```

**SKILL.md Frontmatter Format:**
```yaml
---
name: workflows-git
description: Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion
---
```

### Synonym Expansion

Maps user-friendly terms to technical vocabulary:

| User Says | Expands To |
|-----------|------------|
| "fix" | debug, correct, resolve, code, implementation |
| "create" | implement, build, generate, new, add, scaffold |
| "doc" / "docs" | documentation, explain, describe, markdown |
| "commit" | git, version, push, branch, changes |
| "search" | find, locate, explore, query, lookup |

### Intent Boosters

High-confidence keywords that directly map to specific skills:

| Keyword | Skill | Boost |
|---------|-------|-------|
| `worktree` | workflows-git | +1.2 |
| `devtools` | workflows-chrome-devtools | +1.0 |
| `rebase` | workflows-git | +0.8 |
| `flowchart` | workflows-documentation | +0.7 |
| `checkpoint` | system-spec-kit | +0.6 |

### Multi-Skill Boosters

For ambiguous keywords that could apply to multiple skills:

```python
MULTI_SKILL_BOOSTERS = {
    "code": [("workflows-code", 0.2)],
    "changes": [("workflows-git", 0.4), ("system-spec-kit", 0.2)],
    ...
}
```

These boost multiple skills simultaneously when the keyword is detected. The `(multi)` suffix appears in the reason output to indicate multi-skill boosting was applied.

### Confidence Scoring

The script uses a **two-tiered confidence formula** based on whether intent boosters matched:

| Condition | Formula | Purpose |
|-----------|---------|---------|
| Intent booster matched | `min(0.50 + score * 0.15, 0.95)` | Higher confidence for explicit signals |
| No intent booster | `min(0.25 + score * 0.15, 0.95)` | Conservative for corpus-only matches |

**Score to confidence mapping (with intent boost):**

| Score | Confidence | Meaning |
|-------|------------|---------|
| 1.0 | 0.65 | Single keyword match |
| 2.0 | 0.80 | Threshold for auto-invoke |
| 3.0 | 0.95 | Strong multi-keyword match |

**Confidence thresholds:**

| Score Range | Meaning | Action |
|-------------|---------|--------|
| 0.80 - 0.95 | High confidence | MUST invoke skill |
| 0.50 - 0.79 | Medium confidence | Consider skill, may proceed manually |
| 0.25 - 0.49 | Low confidence | Skill might be relevant |
| < 0.25 | No match | No recommendation |

### Command Bridges

Slash commands exposed as pseudo-skills for routing:

| Command Bridge | Description |
|----------------|-------------|
| `command-spec-kit` | Create specifications using `/spec_kit` slash command |
| `command-memory-save` | Save conversation context using `/memory:save` |

<!-- /ANCHOR:skill-advisor -->

---

## 5. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

### Customization Points

The script requires customization for each project. See [SET-UP_GUIDE.md](./SET-UP_GUIDE.md) for detailed instructions.

| Component | Location | Purpose |
|-----------|----------|---------|
| `SKILLS_DIR` | Line 17 | Path to skills directory |
| `STOP_WORDS` | Lines 21-47 | Words filtered from queries |
| `SYNONYM_MAP` | Lines 50-100 | User intent to technical terms |
| `INTENT_BOOSTERS` | Lines 108-252 | Keyword to skill direct mappings |
| `MULTI_SKILL_BOOSTERS` | Lines 255-270 | Ambiguous keyword to multi-skill |
| `parse_frontmatter` | Line 273 | YAML frontmatter parser |
| `get_skills` | Line 292 | Skill discovery function |
| `analyze_request` | Line 328 | Main analysis function |

### SKILLS_DIR Configuration

```python
# Default: relative to current working directory
PROJECT_ROOT = os.getcwd()
SKILLS_DIR = os.path.join(PROJECT_ROOT, ".opencode/skill")
```

**Note:** The script expects to be run from the project root directory.

### Adding Custom Synonyms

```python
SYNONYM_MAP = {
    # Add your domain-specific synonyms
    "deploy": ["release", "publish", "ship", "launch"],
    "api": ["endpoint", "route", "rest", "graphql"],
    # ...
}
```

### Adding Custom Intent Boosters

```python
INTENT_BOOSTERS = {
    # Format: "keyword": ("skill-name", boost_amount)
    "kubernetes": ("devops-k8s", 0.8),
    "docker": ("devops-containers", 0.7),
    # ...
}
```

### Adding Command Bridges

```python
# In get_skills() function
skills["command-deploy"] = {
    "description": "Deploy application using /deploy slash command.",
    "weight": 1.0
}
```

<!-- /ANCHOR:configuration -->

---

## 6. 💡 USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Git Operations

```bash
$ python skill_advisor.py "help me commit my changes and push to remote"

[
  {
    "skill": "workflows-git",
    "confidence": 0.92,
    "reason": "Matched: !commit, !push, git(name), changes"
  }
]
```

### Example 2: Documentation

```bash
$ python skill_advisor.py "create a flowchart for the authentication process"

[
  {
    "skill": "workflows-documentation",
    "confidence": 0.88,
    "reason": "Matched: !flowchart, documentation(name), create"
  }
]
```

### Example 3: Code Search

```bash
$ python skill_advisor.py "search for how authentication works in the codebase"

[
  {
    "skill": "workflows-code",
    "confidence": 0.72,
    "reason": "Matched: !implement, code(multi)"
  }
]
```

### Example 4: Memory Operations

```bash
$ python skill_advisor.py "save this conversation context for later"

[
  {
    "skill": "system-spec-kit",
    "confidence": 0.85,
    "reason": "Matched: !session, context, save"
  },
  {
    "skill": "command-memory-save",
    "confidence": 0.62,
    "reason": "Matched: save, context"
  }
]
```

### Example 5: No Strong Match

```bash
$ python skill_advisor.py "hello"

[]
```

### Example 6: External MCP Tools

```bash
$ python skill_advisor.py "use webflow to update site"
# → mcp-code-mode (0.95) - !webflow + !site + !update(multi) boost

$ python skill_advisor.py "call figma api"
# → mcp-code-mode (0.95) - !figma + api(multi) boost
```

### Common Patterns

| User Intent | Expected Skill | Key Terms |
|-------------|----------------|-----------|
| Git operations | workflows-git | commit, push, branch, merge, worktree, github, pr, issue |
| Browser debugging | workflows-chrome-devtools | devtools, chrome, browser, debug, console |
| Documentation | workflows-documentation | markdown, flowchart, diagram, readme |
| Code implementation | workflows-code | implement, fix, bug, refactor, verification |
| Memory/context | system-spec-kit | remember, save, context, checkpoint |
| Specifications | system-spec-kit | spec, checklist, plan, specification |
| External MCP tools | mcp-code-mode | webflow, figma, clickup, notion |

<!-- /ANCHOR:usage-examples -->

---

## 7. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### No Skills Found

**Symptom:** Empty array returned for all queries

**Causes:**
1. `SKILLS_DIR` path is incorrect
2. No SKILL.md files in skills directory
3. SKILL.md files missing frontmatter

**Solution:**
```bash
# Check SKILLS_DIR exists
ls -la .opencode/skill/

# Verify SKILL.md files exist
find .opencode/skill -name "SKILL.md"

# Check frontmatter format
head -10 .opencode/skill/workflows-git/SKILL.md
# Should show:
# ---
# name: workflows-git
# description: ...
# ---
```

### Low Confidence Scores

**Symptom:** Correct skill recommended but confidence < 0.8

**Causes:**
1. Missing synonyms for user's vocabulary
2. Missing intent booster for key terms
3. Skill description doesn't contain relevant keywords

**Solution:**
1. Add synonyms to `SYNONYM_MAP`
2. Add intent boosters for domain-specific terms
3. Update skill descriptions in SKILL.md files

### Wrong Skill Recommended

**Symptom:** Incorrect skill has highest confidence

**Causes:**
1. Overly broad synonyms causing false matches
2. Intent booster boost value too high
3. Multiple skills with overlapping descriptions

**Solution:**
1. Make synonyms more specific
2. Adjust boost values (0.3-0.5 for moderate, 0.6-1.0 for strong)
3. Differentiate skill descriptions

### Script Not Found

**Symptom:** `No such file or directory: skill_advisor.py`

**Solution:**
```bash
# Run from project root
cd /path/to/project
python .opencode/skill/scripts/skill_advisor.py "test"
```

### JSON Parse Errors

**Symptom:** Output is not valid JSON

**Causes:**
1. Python print statements in the script
2. Error messages mixed with output

**Solution:** Ensure only JSON is printed to stdout. Errors should go to stderr.

<!-- /ANCHOR:troubleshooting -->

---

## 8. ❓ FAQ
<!-- ANCHOR:faq -->

### General Questions

**Q: What happens if no skill matches?**

A: An empty array `[]` is returned. The AI agent should proceed with manual tool selection.

---

**Q: Can I have multiple skills recommended?**

A: Yes, the script returns all matching skills sorted by confidence. The AI agent typically uses the top recommendation if confidence > 0.8.

---

**Q: How do I add a new skill?**

A: Create a new folder in `.opencode/skill/` with a SKILL.md file containing proper frontmatter. The script will automatically discover it.

---

### Technical Questions

**Q: Why is the confidence capped at 0.95?**

A: To maintain uncertainty and prevent over-confidence. Even the best matches should allow for human judgment.

---

**Q: What's the difference between synonyms and intent boosters?**

A:
- **Synonyms** expand the query vocabulary (bidirectional, used in matching)
- **Intent boosters** directly increase a skill's score when specific keywords appear (unidirectional, bypass matching)

---

**Q: How do I debug the matching logic?**

A: Add debug output to the script:
```python
# In analyze_request(), after line 230
print(f"DEBUG: tokens={tokens}, expanded={search_terms}", file=sys.stderr)
```

---

**Q: Can I use regex in queries?**

A: No, the script uses word tokenization. Regex patterns will be treated as literal text.

<!-- /ANCHOR:faq -->

---

## 9. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related-documents -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [agents/README.md](./agents/README.md) | Detailed activation, rollback and status behavior for provider switching |
| [SET-UP_GUIDE.md](./SET-UP_GUIDE.md) | Step-by-step customization guide for `skill_advisor.py` |
| [Changelog](../changelog/02--skill-advisor/) | Version history and changes |
| [AGENTS.md](../../AGENTS.md) | Framework rules including Gate 2 skill routing |

### Skill System

| Resource | Purpose |
|----------|---------|
| `.opencode/skill/*/SKILL.md` | Individual skill definitions parsed by the advisor |
| [system-spec-kit README](../skill/system-spec-kit/README.md) | Documentation and memory framework |
| [workflows-documentation SKILL.md](../skill/workflows-documentation/SKILL.md) | Documentation standards and templates |

<!-- /ANCHOR:related-documents -->
