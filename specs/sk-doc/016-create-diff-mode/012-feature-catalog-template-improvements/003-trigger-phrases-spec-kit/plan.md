---
title: "Plan: Phase 003 — Trigger Phrases, system-spec-kit"
description: "Execution plan for adding trigger_phrases to 313 spec-kit snippets via parallel category-scoped AI agents."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 003 — Trigger Phrases, system-spec-kit

---

## 1. DERIVATION ALGORITHM

For each snippet, an agent derives trigger_phrases using this priority order:

```
1. Canonical name:    Extract H3 heading from root catalog for this feature
                      → always phrase #1 (verbatim)
2. Tool name:         Extract parenthetical from H1: "# Name (tool_name)"
                      → phrase #2 if different from #1
3. Verb form:         If feature is an action (e.g., "memory indexing"), add verb form
                      ("index memory") → phrase #3
4. Description words: Pull 1-2 distinctive noun phrases from frontmatter description
                      → phrases #4-5
5. Category context:  Add category-qualified phrase if disambiguation needed
                      (e.g., "retrieval pipeline" not just "pipeline")
```

**Floor**: 3 phrases minimum. **Ceiling**: 6 phrases maximum (diminishing returns above this).

**Quality rules**:
- Do NOT include generic terms ("memory", "spec kit", "feature") alone — too broad
- DO include the exact tool function name as it appears in code (`memory_save`, `memory_search`)
- DO include the natural-language phrase a user would type to invoke this feature

---

## 2. EXECUTION MODEL

### Agent scope per batch
Each agent handles ONE category directory:
- Reads: root catalog section covering this category's features (H3 headings)
- Reads: all snippet files in the category
- Writes: `trigger_phrases:` block to each snippet's frontmatter
- Reports: list of files updated + phrases added

### Batching strategy
- Categories with ≤15 files: single agent pass
- Categories with 16-30 files: two agent passes (split by file number)
- Categories with 31+ files (16--tooling-and-scripts: 47 files): three passes

### Parallel execution
Up to 8 category agents can run concurrently (stay within context limits).

---

## 3. EXECUTION ORDER

Categories ordered by size (smallest first to validate approach before large batches):

```
Pass 1 (small, validate approach):
  23--doctor-commands (3 files)
  07--evaluation (4 files)
  20--remediation-revalidation (5 files)
  04--maintenance (6 files)

Pass 2 (medium):
  17--governance (7 files)
  03--discovery (9 files)
  05--lifecycle (10 files)
  06--analysis (10 files)

Pass 3 (medium-large):
  12--query-intelligence (13 files)
  02--mutation (13 files)
  19--feature-flag-reference (14 files)
  01--retrieval (17 files)
  09--evaluation-and-measurement (17 files)
  15--retrieval-enhancements (17 files)

Pass 4 (large):
  08--bug-fixes-and-data-integrity (15 files)
  18--ux-hooks (21 files)
  10--graph-signal-activation (20 files)
  22--context-preservation (21 files)

Pass 5 (largest):
  11--scoring-and-calibration (23 files)
  14--pipeline-architecture (28 files)
  13--memory-quality-and-indexing (30 files)
  16--tooling-and-scripts (47 files — split into 3 sub-batches)
```

---

## 4. AGENT PROMPT TEMPLATE

```
You are adding trigger_phrases to feature catalog snippet files in the
system-spec-kit skill, category: {CATEGORY_NAME}.

CONTEXT:
- Root catalog section for this category: [pasted H3 headings + descriptions]
- Files in this category: {LIST}

TASK: For each file in this category:
1. Read the file's frontmatter (title, description) and H1 heading
2. Match it to its H3 entry in the root catalog to get the canonical feature name
3. Derive 3-6 trigger_phrases using this algorithm:
   - Phrase 1: canonical H3 feature name (verbatim)
   - Phrase 2: tool/command name from H1 parens if present
   - Phrase 3: verb form of the feature name if it's an action noun
   - Phrases 4-5: key noun phrases from description
4. Add trigger_phrases block to frontmatter, AFTER description, BEFORE any other fields
5. If file already has trigger_phrases with ≥3 phrases: verify quality, improve if weak

Do NOT change any other content. Only frontmatter trigger_phrases.
```

---

## 5. VERIFICATION

After each category pass:
```bash
# Count snippets still missing trigger_phrases in this category
grep -rL "trigger_phrases" \
  .opencode/skills/system-spec-kit/feature_catalog/{CATEGORY}/ | wc -l
# Expected: 0
```

After all passes:
```bash
# Total gap remaining
grep -rL "trigger_phrases" \
  .opencode/skills/system-spec-kit/feature_catalog/[0-9]*/ | wc -l
# Expected: 0

# Minimum phrase count check (files with fewer than 3 phrases)
python3 -c "
import re
from pathlib import Path
low = []
for f in Path('.opencode/skills/system-spec-kit/feature_catalog').rglob('*.md'):
    if f.name == 'feature_catalog.md': continue
    t = f.read_text()
    m = re.findall(r'trigger_phrases:.*?(?=\n\S|\Z)', t, re.DOTALL)
    if m:
        count = t[t.find('trigger_phrases:'):].split('\n')[1:5]
        phrases = [l for l in count if l.strip().startswith('-')]
        if len(phrases) < 3: low.append(f)
print(f'{len(low)} files with < 3 phrases')
"
```
