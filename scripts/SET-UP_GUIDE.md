# Skill Advisor - Setup Guide

> AI-First customization guide for adapting skill_advisor.py to your project's skill set. Every project has different skills, synonyms, and intent patterns - this guide helps you configure them.

---

## 🤖 AI-FIRST SETUP GUIDE

**Copy and paste this prompt to your AI assistant to get customization help:**

```
I need to customize skill_advisor.py for my project. The script is located at:
.opencode/scripts/skill_advisor.py

Please help me:
1. Inventory my project's skills by scanning .opencode/skills/*/SKILL.md
2. Analyze each skill's purpose and identify key trigger words
3. Create custom SYNONYM_MAP entries for my domain vocabulary
4. Create custom INTENT_BOOSTERS for high-confidence keyword mappings
5. Add any project-specific command bridges
6. Test the configuration with sample queries

My project domain is: [describe your project - e.g., "e-commerce platform", "developer tools", "data pipeline"]

Key workflows in my project include: [list your main workflows]

Guide me through each phase with validation checkpoints.
```

**What the AI will do:**
- Scan your `.opencode/skills/` directory for available skills
- Extract key terms from each skill's description
- Suggest domain-specific synonyms
- Create intent booster mappings
- Test configuration with sample queries

**Expected setup time:** 15-30 minutes

---

## 📋 TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📋 PREREQUISITES](#2--prerequisites)
- [3. 📥 PHASE 1: SKILLS INVENTORY](#3--phase-1-skills-inventory)
- [4. 🔧 PHASE 2: SYNONYM MAP CUSTOMIZATION](#4--phase-2-synonym-map-customization)
- [5. ⚡ PHASE 3: INTENT BOOSTERS CUSTOMIZATION](#5--phase-3-intent-boosters-customization)
- [6. ✅ PHASE 4: TESTING & VALIDATION](#6--phase-4-testing--validation)
- [7. 🛠️ TROUBLESHOOTING](#7-️-troubleshooting)
- [8. 📚 RESOURCES](#8--resources)

---

## 1. 📖 OVERVIEW

### Why Customization is Required

The `skill_advisor.py` script ships with default mappings designed for a specific project. Your project likely has:
- Different skills with different names
- Domain-specific vocabulary
- Unique workflow patterns
- Custom slash commands

Without customization, the script will:
- Fail to find your skills (different SKILLS_DIR)
- Miss user intent (missing synonyms)
- Return low confidence scores (missing intent boosters)

### What You'll Customize

| Component | Purpose | Effort |
|-----------|---------|--------|
| **SKILLS_DIR** | Path to your skills | 1 minute |
| **SYNONYM_MAP** | Domain vocabulary expansion | 10-15 minutes |
| **INTENT_BOOSTERS** | High-confidence keyword mappings | 10-15 minutes |
| **Command Bridges** | Slash commands as pseudo-skills | 5 minutes |

### Core Principle

> **Match user vocabulary to skill capabilities.** Users say "fix the bug" but your skill description says "debug and verification". The mappings bridge this gap.

---

## 2. 📋 PREREQUISITES

### Required

- Python 3.6+ installed
- Project with `.opencode/skills/` directory
- At least one skill with SKILL.md containing frontmatter

### Verify Python

```bash
python3 --version
# Expected: Python 3.6 or higher
```

### Verify Skills Directory

```bash
ls -la .opencode/skills/
# Should list skill folders

find .opencode/skills -name "SKILL.md" | head -5
# Should show SKILL.md files
```

### Verify SKILL.md Format

```bash
head -10 .opencode/skills/*/SKILL.md | grep -A3 "^---"
# Should show frontmatter with name: and description:
```

**Expected format:**
```yaml
---
name: skill-name
description: Brief description of what the skill does
---
```

### Validation: `phase_0_complete`

```bash
# All commands should succeed:
python3 --version                              # → Python 3.6+
ls .opencode/skills/                           # → Skill folders listed
find .opencode/skills -name "SKILL.md" | wc -l # → At least 1
```

**Checklist:**
- [ ] Python 3.6+ installed?
- [ ] `.opencode/skills/` directory exists?
- [ ] At least one SKILL.md file present?
- [ ] SKILL.md files have proper frontmatter?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. 📥 PHASE 1: SKILLS INVENTORY

### Step 1: List Your Skills

```bash
# List all skills in your project
for f in .opencode/skills/*/SKILL.md; do
  echo "=== $f ==="
  grep -A1 "^name:" "$f" | head -2
  grep -A1 "^description:" "$f" | head -2
  echo ""
done
```

### Step 2: Create Skills Inventory Table

Document your skills in a table:

| Skill Name | Description (abbreviated) | Key Terms |
|------------|---------------------------|-----------|
| `workflows-git` | Git workflow orchestrator | git, commit, branch, merge |
| `workflows-code` | Code implementation guide | code, implement, debug, fix |
| `mcp-leann` | Semantic code search | search, find, semantic |
| ... | ... | ... |

### Step 3: Identify Key Terms

For each skill, extract 3-5 key terms from:
1. The skill name (split by `-`)
2. The description
3. What users might say when they need this skill

**Example:**
```
Skill: workflows-documentation
Description: "Unified markdown and skill management specialist providing document 
              quality enforcement, content optimization, skill creation workflow, 
              ASCII flowchart creation"

Key Terms:
- documentation, docs, doc (from name)
- markdown, readme, guide (from description)
- flowchart, diagram, ascii (from description)
- write, create, document (user vocabulary)
```

### Validation: `phase_1_complete`

```bash
# Verify skills are discoverable
python3 -c "
import os, glob
skills_dir = '.opencode/skills'
skills = glob.glob(os.path.join(skills_dir, '*/SKILL.md'))
print(f'Found {len(skills)} skills')
for s in skills[:5]:
    print(f'  - {s}')
"
```

**Checklist:**
- [ ] Listed all skills in your project?
- [ ] Created inventory table with key terms?
- [ ] Identified 3-5 key terms per skill?

❌ **STOP if validation fails** - Complete skills inventory before continuing.

---

## 4. 🔧 PHASE 2: SYNONYM MAP CUSTOMIZATION

### Understanding SYNONYM_MAP

The `SYNONYM_MAP` expands user vocabulary to match technical terms in skill descriptions.

```python
SYNONYM_MAP = {
    # User says "fix" → matches skills with these terms
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    
    # Bidirectional: also expands "debug" to include "fix"
}
```

### Step 1: Identify Domain Vocabulary

List terms users might say vs. terms in your skill descriptions:

| Users Say | Skills Say |
|-----------|------------|
| "fix", "repair" | "debug", "resolve", "correct" |
| "make", "build" | "create", "implement", "generate" |
| "find", "look for" | "search", "locate", "query" |
| "deploy" | "release", "publish", "ship" |

### Step 2: Add Your Synonyms

Open `skill_advisor.py` and find the `SYNONYM_MAP` dictionary (around line 50-100).

**Add your domain-specific synonyms:**

```python
SYNONYM_MAP = {
    # === EXISTING MAPPINGS (keep or modify) ===
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    # ...
    
    # === YOUR CUSTOM MAPPINGS ===
    # E-commerce domain
    "order": ["purchase", "transaction", "checkout", "cart"],
    "product": ["item", "sku", "inventory", "catalog"],
    "customer": ["user", "buyer", "account", "profile"],
    
    # DevOps domain
    "deploy": ["release", "publish", "ship", "launch", "rollout"],
    "container": ["docker", "kubernetes", "k8s", "pod"],
    "pipeline": ["ci", "cd", "workflow", "automation"],
    
    # Data domain
    "query": ["sql", "select", "fetch", "retrieve", "database"],
    "transform": ["etl", "process", "convert", "map", "clean"],
}
```

### Step 3: Add Reverse Mappings

For important terms, add reverse mappings so both directions work:

```python
# Forward: user says "deploy" → expand to technical terms
"deploy": ["release", "publish", "ship", "launch"],

# Reverse: user says "kubernetes" → connect to container concepts
"kubernetes": ["container", "docker", "k8s", "orchestration"],
"k8s": ["kubernetes", "container", "pod", "deployment"],
```

### Validation: `phase_2_complete`

```bash
# Test synonym expansion
python3 -c "
# Paste your SYNONYM_MAP here and test
SYNONYM_MAP = {
    'deploy': ['release', 'publish', 'ship'],
    # ... your mappings
}

test_words = ['deploy', 'fix', 'create']  # Add your test words
for word in test_words:
    if word in SYNONYM_MAP:
        print(f'{word} → {SYNONYM_MAP[word]}')
    else:
        print(f'{word} → (no expansion)')
"
```

**Checklist:**
- [ ] Identified domain-specific vocabulary?
- [ ] Added synonyms for user vocabulary → technical terms?
- [ ] Added reverse mappings for key technical terms?
- [ ] Tested synonym expansion?

❌ **STOP if validation fails** - Complete synonym customization before continuing.

---

## 5. ⚡ PHASE 3: INTENT BOOSTERS CUSTOMIZATION

### Understanding INTENT_BOOSTERS

Intent boosters provide direct, high-confidence mappings from keywords to skills. When a user says a booster keyword, the associated skill gets a score boost.

```python
INTENT_BOOSTERS = {
    # Format: "keyword": ("skill-name", boost_amount)
    "commit": ("workflows-git", 0.5),      # Moderate boost
    "worktree": ("workflows-git", 1.2),    # Strong boost (very specific)
    "devtools": ("workflows-chrome", 1.0), # Strong boost
}
```

### Boost Value Guidelines

| Boost Value | Confidence Impact | Use When |
|-------------|-------------------|----------|
| 0.3 - 0.4 | Low | General terms that suggest but don't confirm |
| 0.5 - 0.6 | Moderate | Clear indicators of skill need |
| 0.7 - 0.8 | High | Specific terms strongly associated with skill |
| 1.0 - 1.2 | Very High | Unique/definitive terms (only one skill matches) |

### Step 1: Map Keywords to Skills

For each skill, identify unique or strongly-associated keywords:

| Skill | Unique Keywords | Boost |
|-------|-----------------|-------|
| `workflows-git` | worktree, rebase, stash, merge | 0.8-1.2 |
| `workflows-git` | commit, push, branch | 0.5-0.6 |
| `mcp-leann` | leann, embeddings, rag, semantic | 0.6-1.0 |
| `system-memory` | checkpoint, remember, context | 0.5-0.6 |

### Step 2: Add Your Intent Boosters

Open `skill_advisor.py` and find the `INTENT_BOOSTERS` dictionary (around line 105).

**Add your domain-specific boosters:**

```python
INTENT_BOOSTERS = {
    # === EXISTING BOOSTERS (keep or modify) ===
    "commit": ("workflows-git", 0.5),
    "worktree": ("workflows-git", 1.2),
    # ...
    
    # === YOUR CUSTOM BOOSTERS ===
    # E-commerce skills
    "checkout": ("ecommerce-checkout", 0.8),
    "payment": ("ecommerce-payment", 0.7),
    "stripe": ("ecommerce-payment", 1.0),  # Very specific
    "inventory": ("ecommerce-catalog", 0.6),
    
    # DevOps skills
    "terraform": ("devops-infrastructure", 1.0),
    "ansible": ("devops-configuration", 1.0),
    "helm": ("devops-kubernetes", 0.8),
    "dockerfile": ("devops-containers", 0.9),
    
    # Data skills
    "pandas": ("data-analysis", 0.9),
    "spark": ("data-processing", 1.0),
    "airflow": ("data-orchestration", 1.0),
}
```

### Step 3: Add Command Bridge Boosters

If you have slash commands, add boosters for their keywords:

```python
# Command-related boosters
"spec": ("command-spec-kit", 0.5),
"specification": ("system-spec-kit", 0.5),
"checklist": ("system-spec-kit", 0.5),
```

#### 3b. MULTI_SKILL_BOOSTERS Configuration

For keywords that should boost multiple skills simultaneously:

```python
MULTI_SKILL_BOOSTERS = {
    "ambiguous_keyword": [
        ("skill-1", boost_1),
        ("skill-2", boost_2),
    ],
}
```

**When to use MULTI_SKILL_BOOSTERS:**
- Keyword genuinely applies to multiple skills (e.g., "search" → both semantic and structural)
- Context alone cannot determine the best skill
- You want both skills to compete based on other signals

**Boost values for multi-skill:**
- Use lower values (0.1-0.3) since multiple skills receive the boost
- Let other keywords break the tie

### Validation: `phase_3_complete`

```bash
# Test intent boosters
python3 -c "
INTENT_BOOSTERS = {
    'terraform': ('devops-infrastructure', 1.0),
    'commit': ('workflows-git', 0.5),
    # ... your boosters
}

test_keywords = ['terraform', 'commit', 'deploy']
for kw in test_keywords:
    if kw in INTENT_BOOSTERS:
        skill, boost = INTENT_BOOSTERS[kw]
        print(f'{kw} → {skill} (+{boost})')
    else:
        print(f'{kw} → (no booster)')
"
```

**Checklist:**
- [ ] Identified unique keywords for each skill?
- [ ] Assigned appropriate boost values?
- [ ] Added boosters for slash commands?
- [ ] Configured MULTI_SKILL_BOOSTERS for ambiguous keywords?
- [ ] Tested intent booster lookups?

❌ **STOP if validation fails** - Complete intent booster customization before continuing.

---

## 6. ✅ PHASE 4: TESTING & VALIDATION

### Step 1: Basic Functionality Test

```bash
# Test the script runs
python3 .opencode/scripts/skill_advisor.py "test query"
# Expected: JSON array (may be empty)
```

### Step 2: Test Skill Discovery

```bash
# Verify skills are found
python3 -c "
import sys
sys.path.insert(0, '.opencode/scripts')
from skill_advisor import get_skills
skills = get_skills()
print(f'Found {len(skills)} skills:')
for name in sorted(skills.keys())[:10]:
    print(f'  - {name}')
"
```

### Step 3: Test Sample Queries

Create a test matrix with expected results:

```bash
# Test each skill with specific queries
python3 .opencode/scripts/skill_advisor.py "help me commit my changes"
# Expected: workflows-git with high confidence

python3 .opencode/scripts/skill_advisor.py "create documentation with flowchart"
# Expected: workflows-documentation with high confidence

python3 .opencode/scripts/skill_advisor.py "search for authentication code"
# Expected: mcp-leann or similar search skill
```

### Step 4: Test Domain-Specific Queries

Test your custom mappings:

```bash
# Test your domain vocabulary
python3 .opencode/scripts/skill_advisor.py "deploy the application to kubernetes"
# Expected: Your devops/deployment skill

python3 .opencode/scripts/skill_advisor.py "process customer orders"
# Expected: Your e-commerce skill
```

### Step 5: Confidence Threshold Test

Verify that strong matches exceed 0.8 confidence:

```bash
# Test confidence thresholds
python3 -c "
import subprocess
import json

queries = [
    ('commit changes', 'workflows-git', 0.8),
    ('create flowchart', 'workflows-documentation', 0.7),
    ('hello world', None, 0.5),  # Should be low/no match
]

for query, expected_skill, min_confidence in queries:
    result = subprocess.run(
        ['python3', '.opencode/scripts/skill_advisor.py', query],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    
    if not data:
        print(f'✗ \"{query}\" → No matches')
        continue
        
    top = data[0]
    status = '✓' if top['confidence'] >= min_confidence else '✗'
    match_status = '✓' if expected_skill is None or top['skill'] == expected_skill else '?'
    
    print(f'{status}{match_status} \"{query}\" → {top[\"skill\"]} ({top[\"confidence\"]:.2f})')
"
```

### Validation: `phase_4_complete`

**Checklist:**
- [ ] Script runs without errors?
- [ ] All skills are discovered?
- [ ] Sample queries return expected skills?
- [ ] High-confidence keywords achieve > 0.8 confidence?
- [ ] Domain-specific vocabulary works?

❌ **STOP if validation fails** - Adjust mappings and retest.

### Success Criteria

| Test | Pass Criteria |
|------|---------------|
| Script execution | No Python errors |
| Skill discovery | All skills in `.opencode/skills/` found |
| High-confidence matches | Unique keywords → > 0.8 confidence |
| Low-confidence matches | Generic queries → < 0.5 or empty |
| Domain vocabulary | Custom synonyms expand correctly |

---

## 7. 🛠️ TROUBLESHOOTING

### Skills Not Found

**Symptom:** `Found 0 skills` or only command bridges appear

**Causes:**
1. `SKILLS_DIR` path is wrong
2. Running script from wrong directory
3. SKILL.md files missing or malformed

**Fix:**
```bash
# Check you're in project root
pwd
# Should be: /path/to/your/project

# Check SKILLS_DIR in script
grep "SKILLS_DIR" .opencode/scripts/skill_advisor.py
# Should point to your skills location

# Verify SKILL.md files
ls .opencode/skills/*/SKILL.md
```

### Low Confidence for Known Keywords

**Symptom:** Specific keywords return < 0.8 confidence

**Causes:**
1. Missing intent booster for keyword
2. Boost value too low
3. Keyword in STOP_WORDS list

**Fix:**
```python
# Add or increase intent booster
INTENT_BOOSTERS = {
    "your_keyword": ("your-skill", 0.8),  # Increase from 0.5 to 0.8
}

# Check STOP_WORDS doesn't include your keyword
if "your_keyword" in STOP_WORDS:
    STOP_WORDS.remove("your_keyword")
```

### Wrong Skill Recommended

**Symptom:** Query returns unexpected skill at top

**Causes:**
1. Another skill has matching terms in description
2. Intent booster pointing to wrong skill
3. Synonym expansion causing unintended matches

**Fix:**
1. Review skill descriptions for overlapping terms
2. Add more specific intent booster for correct skill
3. Remove or narrow problematic synonyms

### JSON Parse Error

**Symptom:** Output is not valid JSON

**Fix:**
```bash
# Check for print statements or errors
python3 .opencode/scripts/skill_advisor.py "test" 2>&1

# Redirect stderr to see errors separately
python3 .opencode/scripts/skill_advisor.py "test" 2>/dev/null
```

---

## 8. 📚 RESOURCES

### Files Reference

| File | Purpose |
|------|---------|
| `.opencode/scripts/skill_advisor.py` | Main script to customize |
| `.opencode/scripts/README.md` | Script documentation |
| `.opencode/skills/*/SKILL.md` | Skill definitions (parsed by script) |
| `AGENTS.md` | Gate 2 integration reference |

### Key Lines in skill_advisor.py

| Line Range | Component | Purpose |
|------------|-----------|---------|
| 16-17 | `SKILLS_DIR` | Path configuration |
| 21-47 | `STOP_WORDS` | Filtered words |
| 50-100 | `SYNONYM_MAP` | Vocabulary expansion |
| 105-223 | `INTENT_BOOSTERS` | Direct skill mappings |
| 227-239 | `MULTI_SKILL_BOOSTERS` | Keywords that boost multiple skills |
| 175-199 | `get_skills()` | Skill discovery + command bridges |
| 211-292 | `analyze_request()` | Main matching logic |

### Customization Checklist Summary

```markdown
□ Phase 0: Prerequisites
  □ Python 3.6+ installed
  □ Skills directory exists
  □ SKILL.md files have frontmatter

□ Phase 1: Skills Inventory
  □ Listed all skills
  □ Identified key terms per skill

□ Phase 2: Synonym Map
  □ Added domain synonyms
  □ Added reverse mappings

□ Phase 3: Intent Boosters
  □ Added unique keyword boosters
  □ Assigned appropriate boost values
  □ Added command bridge boosters

□ Phase 4: Testing
  □ Script runs without errors
  □ All skills discovered
  □ Sample queries work
  □ High confidence achieved for specific terms
```

---

**Setup Complete!**

Your skill_advisor.py is now customized for your project. The script will:
- Discover your skills automatically
- Expand user vocabulary with your synonyms
- Boost confidence for your domain keywords
- Route requests to the appropriate skills

Test periodically as you add new skills or discover new user vocabulary patterns.
