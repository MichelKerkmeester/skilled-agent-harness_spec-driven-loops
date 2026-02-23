---
description: Create and manage constitutional memories — always-surface rules that appear at the top of every search result.
argument-hint: "[rule-description] | list | edit <filename> | remove <filename> | budget"
allowed-tools: Read, Write, Edit, Glob, Bash, spec_kit_memory_memory_save, spec_kit_memory_memory_search, spec_kit_memory_memory_stats, spec_kit_memory_memory_list, spec_kit_memory_memory_delete, spec_kit_memory_memory_index_scan
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Present the user with this question:
        question: "What always-surface rule would you like to create?"
        options:
          - label: "Safety constraint"
            description: "Rule that prevents dangerous actions (e.g., never commit secrets)"
          - label: "Workflow rule"
            description: "Process that must always be followed (e.g., always ask spec folder)"
          - label: "Project constraint"
            description: "Hard limit or requirement (e.g., API rate limit, token budget)"
    → WAIT for user response
    → Use their response as the rule description
    → Only THEN continue with this workflow

IF $ARGUMENTS starts with "edit" and has NO <filename>:
    → STOP IMMEDIATELY
    → Run Glob(".opencode/skill/system-spec-kit/constitutional/*.md")
    → Present available files (exclude README.md)
    → WAIT for user selection

IF $ARGUMENTS starts with "remove" and has NO <filename>:
    → STOP IMMEDIATELY
    → Run Glob(".opencode/skill/system-spec-kit/constitutional/*.md")
    → Present available files (exclude README.md)
    → WAIT for user selection

IF $ARGUMENTS contains recognized input:
    → Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer rule content from conversation context
- **DO NOT** assume what the user wants based on screenshots or open files
- **DO NOT** proceed past this point without explicit input from the user
- The rule MUST come from `$ARGUMENTS` or user's answer to the question above

---

# /memory:learn — Constitutional Memory Manager

Create, list, edit, and remove **constitutional memories** — the highest-tier rules that surface at the top of every search result, never decay, and carry a 3.0x search boost.

---

## 1. PURPOSE

Provide a dedicated command for managing constitutional memories — the most powerful tier in the Spec Kit Memory system. Constitutional memories always appear at the top of every `memory_search()` result, never decay, and are exempt from archival. This command handles the full lifecycle: creation with proper frontmatter and ANCHOR format, budget validation, editing, and removal.

**Key difference from `/memory:save`:**
- `/memory:save` = Session context saved to `specs/*/memory/` (any tier)
- `/memory:learn` = Constitutional rules saved to `constitutional/` (always-surface tier)

---

## 2. CONTRACT

```yaml
role: Constitutional Memory Manager
purpose: Create and manage always-surface rules in the constitutional tier
destination: .opencode/skill/system-spec-kit/constitutional/
```

**Inputs:** `$ARGUMENTS` — Rule description, or subcommand (list, edit, remove, budget)
**Outputs:** `STATUS=<OK|FAIL|CANCELLED> ACTION=<created|listed|edited|removed|budget>`

---

## 3. ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─► Empty (no args)
    │   └─► MANDATORY GATE: Ask user for rule → CREATE (Section 5)
    │
    ├─► First word matches ACTION KEYWORD (case-insensitive)
    │   ├─► "list"                → LIST DASHBOARD (Section 6)
    │   ├─► "edit <filename>"     → EDIT MODE (Section 7)
    │   ├─► "remove <filename>"   → REMOVE MODE (Section 8) [destructive]
    │   └─► "budget"              → BUDGET DASHBOARD (Section 9)
    │
    └─► Any other text (natural language rule)
        └─► CREATE (Section 5) with $ARGUMENTS as rule description
```

---

## 4. REFERENCE: CONSTITUTIONAL TIER

| Property | Constitutional | Critical | Normal |
|----------|---------------|----------|--------|
| Surfaces in | EVERY search | Relevant only | Relevant only |
| Search boost | 3.0x | 2.0x | 1.0x |
| Decays | Never | Never | Yes (90-day) |
| Token budget | ~2000 total | Unlimited | Unlimited |
| Location | `constitutional/` | `specs/*/memory/` | `specs/*/memory/` |

**When NOT constitutional** (suggest `/memory:save` instead):
- Session-specific context
- Rules for one project area only
- Temporary notes or implementation details

---

## 5. INSTRUCTIONS

Execute the action determined by argument routing (Section 3). Each mode below is a self-contained workflow.

### CREATE MODE (Default)

### Step 1: Extract Rule

Use rule text from `$ARGUMENTS` (or user's answer to mandatory gate prompt).

### Step 2: Qualify

Verify this rule belongs in the constitutional tier:

```
Self-check (do NOT prompt user unless ALL are "no"):
  □ Does this rule apply to EVERY interaction? (not just one domain)
  □ Would forgetting it cause significant problems?
  □ Is it a safety constraint or hard requirement?

IF all yes → PROCEED to Step 3
IF any no → Display:

MEMORY:LEARN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ⚠ This rule may not need constitutional tier.
  Constitutional memories appear in EVERY search
  and consume shared budget (~2000 tokens).

─────────────────────────────────────────────────────
[y] proceed anyway    [c] save as critical instead    [n] cancel
```

### Step 3: Structure the Memory

Generate a properly formatted constitutional memory file:

```markdown
---
title: "<RULE_TITLE>"
importanceTier: constitutional
contextType: <decision|implementation|discovery>
triggerPhrases:
  - <keyword1>
  - <keyword2>
  - <keyword3>
---

# <RULE_TITLE>

> <One-line description of what this rule enforces.>

<!-- ANCHOR:rule -->
## Rule

**TRIGGER:** <When this rule activates>

**ACTION:**
1. <Step 1>
2. <Step 2>
3. <Step 3>

**RATIONALE:** <Why this rule exists>
<!-- /ANCHOR:rule -->

*Constitutional Memory — Always surfaces at top of search results*
```

**Structuring guidelines:**
- Title: ALL CAPS descriptor, max 60 chars
- Filename: `kebab-case.md` (e.g., `never-commit-secrets.md`)
- Trigger phrases: 5-20 specific action words. No common words ("the", "a")
- Content: Concise — each file should be <200 tokens
- ANCHOR tags: Wrap main sections for section-level retrieval

**SHOW the generated file to user and WAIT for approval before writing.**

### Step 4: Budget Check

```
1. Glob(".opencode/skill/system-spec-kit/constitutional/*.md")
   → Exclude README.md

2. Read each file, estimate token count (~4 chars per token)

3. Estimate new file token count

4. IF (existing + new) > 2000 tokens:
     Display budget warning (see dashboard below)
     Options: [t]rim existing | [s]horten new | [c]ancel
     WAIT for user decision

5. IF within budget → PROCEED
```

### Step 5: Write, Index, Verify

```
1. WRITE file:
   Write(".opencode/skill/system-spec-kit/constitutional/<filename>.md")

2. INDEX in memory database:
   memory_save({
     filePath: ".opencode/skill/system-spec-kit/constitutional/<filename>.md",
     force: true
   })

3. VERIFY it surfaces:
   memory_search({ query: "<one trigger phrase>", limit: 3 })
   → Confirm isConstitutional: true in results
```

### Step 6: Display Confirmation

```
MEMORY:LEARN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Created     <filename>.md
  Title       <rule_title>
  Tier        constitutional (3.0x boost · no decay)
  Location    .opencode/skill/system-spec-kit/constitutional/

→ Triggers ──────────────────────────────────────────
  <trigger1> · <trigger2> · <trigger3> · <trigger4>

→ Budget ────────────────────────────────────────────
  ██████░░░░  ~<used>/2000 tokens  (<N> files)

─────────────────────────────────────────────────────
[list] view all    [budget] details    [edit] modify

STATUS=OK ACTION=created
```

---

## 6. LIST DASHBOARD

**Trigger:** `/memory:learn list`

### Step 1: Discover Files

```
Glob(".opencode/skill/system-spec-kit/constitutional/*.md")
→ Exclude README.md
```

### Step 2: Read Each File

Extract from frontmatter: title, triggerPhrases. Estimate token count per file.

### Step 3: Display Dashboard

```
MEMORY:LEARN LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Constitutional Memories ───────────── <N> files

  1  <filename1>.md
     "<title1>"
     Triggers: <phrase1> · <phrase2> · <phrase3>
     ~<N> tokens

  2  <filename2>.md
     "<title2>"
     Triggers: <phrase1> · <phrase2>
     ~<N> tokens

→ Budget ────────────────────────────────────────────
  ██████░░░░  ~<used>/2000 tokens  (<pct>%)

─────────────────────────────────────────────────────
[edit <file>] modify    [remove <file>] delete    [budget] details

STATUS=OK ACTION=listed
```

---

## 7. EDIT MODE

**Trigger:** `/memory:learn edit <filename>`

### Step 1: Validate File Exists

```
IF file not found in constitutional/:
  → Display LIST dashboard
  → ASK user to select a file
  → WAIT for response
```

### Step 2: Show Current Content

Read the file and display to user.

### Step 3: Collect Changes

ASK: "What would you like to change?"
- Title / trigger phrases / content / all

### Step 4: Apply Edits

Use Edit tool. Preserve frontmatter structure and ANCHOR tags.

### Step 5: Re-index

```
memory_save({
  filePath: ".opencode/skill/system-spec-kit/constitutional/<filename>",
  force: true
})
```

### Step 6: Display Confirmation

```
MEMORY:LEARN EDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Updated     <filename>.md
  Title       <title>
  Indexed     ✓ re-indexed

→ Budget ────────────────────────────────────────────
  ██████░░░░  ~<used>/2000 tokens  (<N> files)

STATUS=OK ACTION=edited
```

---

## 8. REMOVE MODE (Destructive)

**Trigger:** `/memory:learn remove <filename>`

### Step 1: Validate File Exists

```
IF file not found in constitutional/:
  → Display LIST dashboard
  → ASK user to select a file
  → WAIT for response
```

### Step 2: Show File Content + Confirm

Read the file and display. Then:

```
MEMORY:LEARN REMOVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ⚠ DESTRUCTIVE — This removes a constitutional memory.
  File: <filename>.md
  Title: "<title>"

  This rule will NO LONGER surface in search results.

─────────────────────────────────────────────────────
[y] confirm removal    [n] cancel
```

**HARD STOP:** Do NOT delete until user explicitly confirms.

### Step 3: Delete + Re-index

```
1. Delete file via Bash: rm "<path>"
2. Re-index: memory_index_scan({ force: true })
```

### Step 4: Display Confirmation

```
MEMORY:LEARN REMOVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Removed     <filename>.md
  Re-indexed  ✓

→ Budget ────────────────────────────────────────────
  ████░░░░░░  ~<used>/2000 tokens  (<N> files)

STATUS=OK ACTION=removed
```

---

## 9. BUDGET DASHBOARD

**Trigger:** `/memory:learn budget`

### Step 1: Read All Constitutional Files

```
Glob(".opencode/skill/system-spec-kit/constitutional/*.md")
→ Exclude README.md
→ Read each, estimate tokens (~4 chars per token)
```

### Step 2: Display Dashboard

```
MEMORY:LEARN BUDGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Token Budget ──────────────────────────────────────
  Total budget    ~2000 tokens
  Used            ~<N> tokens
  Available       ~<N> tokens
  Files           <N>

→ Breakdown ─────────────────────────────────────────

  <filename1>.md         ~<N> tokens  ████░░░░░░
  <filename2>.md         ~<N> tokens  ██░░░░░░░░
  <filename3>.md         ~<N> tokens  █░░░░░░░░░

→ Status ────────────────────────────────────────────
  <OK | ⚠ WARNING: over 80% | ⛔ EXCEEDED>

─────────────────────────────────────────────────────
[list] view all    [edit <file>] modify    [remove <file>] delete

STATUS=OK ACTION=budget
```

---

## 10. TOOL SIGNATURES

| Step | Tool | Purpose |
|------|------|---------|
| Discover files | `Glob(".opencode/skill/system-spec-kit/constitutional/*.md")` | Find constitutional files |
| Write new file | `Write("<path>")` | Create constitutional memory |
| Edit existing | `Edit("<path>")` | Modify constitutional memory |
| Index new file | `memory_save({ filePath, force: true })` | Add to search index |
| Verify surfaces | `memory_search({ query })` | Confirm isConstitutional: true |
| Remove from index | `memory_index_scan({ force: true })` | Rebuild index after deletion |
| Check stats | `memory_stats()` | Verify tier breakdown |

---

## 11. ERROR HANDLING

| Condition | Action |
|-----------|--------|
| No rule description | Mandatory gate prompts user |
| Rule doesn't qualify as constitutional | Suggest `/memory:save` with critical tier |
| Token budget exceeded | Warn with dashboard, offer trim/shorten/cancel |
| File already exists with same name | ASK: overwrite or rename |
| File not found (edit/remove) | Show list dashboard, ask user to select |
| `memory_save` fails | Show error, suggest `memory_index_scan({ force: true })` |
| Filename has spaces or uppercase | Auto-convert to kebab-case |

---

## 12. EXAMPLES

### Example 1: Create a Security Rule

```bash
/memory:learn Never commit API keys or secrets to git
```

```
MEMORY:LEARN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Created     never-commit-secrets.md
  Title       NEVER COMMIT SECRETS
  Tier        constitutional (3.0x boost · no decay)
  Location    .opencode/skill/system-spec-kit/constitutional/

→ Triggers ──────────────────────────────────────────
  secret · api key · credential · password · commit

→ Budget ────────────────────────────────────────────
  ██████░░░░  ~520/2000 tokens  (3 files)

STATUS=OK ACTION=created
```

### Example 2: List All Memories

```bash
/memory:learn list
```

### Example 3: Check Budget

```bash
/memory:learn budget
```

---

## 13. RELATED COMMANDS

- `/memory:save` — Save session context (episodic memory, any tier)
- `/memory:context` — Search and retrieve memories
- `/memory:manage` — Database operations (scan, cleanup, tier changes, health)

**Constitutional directory:** `.opencode/skill/system-spec-kit/constitutional/`
**Full documentation:** `.opencode/skill/system-spec-kit/constitutional/README.md`
