---
title: Trigger Configuration
description: Complete configuration guide for memory trigger phrases and the fast trigger matching system.
trigger_phrases:
  - "trigger phrase configuration"
  - "fast trigger matching"
  - "trigger detection logic"
  - "trigger sanitization rules"
  - "manual save triggers"
importance_tier: normal
contextType: implementation
version: 3.6.0.25
---

# Trigger Configuration - Keywords and Manual Save Settings

Complete configuration guide for memory trigger phrases and the fast trigger matching system.

---

## 1. OVERVIEW

**Core Principle:** Trigger detection must be fast (<50ms) and reliable, using optimized phrase matching to surface relevant spec-doc records without impacting conversation flow.

The spec-doc record workflow supports manual activation mechanisms:
1. **Command Trigger** - `/speckit:save` command for explicit saves
2. **Phrase Triggers** - User phrases that directly invoke memory operations

> **OpenCode Note:** Automatic interval-based saves (e.g., "every 20 messages") are NOT supported in OpenCode because OpenCode lacks the hooks system required to count messages and trigger saves automatically. All context preservation must be manually triggered.

This reference covers trigger phrase configuration, the committed trigger index that matches those phrases, and best practices for custom trigger design.

### Key Components

| Component | Purpose | Performance Target |
|-----------|---------|-------------------|
| `/speckit:save` Command | Primary save trigger | Immediate |
| Trigger Phrases | Explicit memory activation | <50ms detection |
| `lookup-trigger-index.mjs` | Fast phrase matching over the committed index | <50ms response |
| Custom Config | Project-specific triggers | Configurable |

---

## 2. TRIGGER PHRASES

The following phrases activate memory operations (case-insensitive matching):

### Primary Triggers

| Category | Primary Phrase | Alternatives |
|----------|----------------|--------------|
| **Save** | "save context" | "save conversation", "save session" |
| **Document** | "document this" | "preserve context", "save this discussion" |
| **Remember** | "remember this" | "store this", "keep this context" |
| **Checkpoint** | "checkpoint" | "save checkpoint", "create checkpoint" |

### Detection Logic

```typescript
const TRIGGER_PHRASES: readonly string[] = [
  // Save category
  'save context',
  'save conversation',
  'save session',
  'save this discussion',

  // Document category
  'document this',
  'preserve context',

  // Remember category
  'remember this',
  'store this',
  'keep this context',

  // Checkpoint category
  'checkpoint',
  'save checkpoint',
  'create checkpoint'
] as const;

function detectTrigger(userMessage: string): boolean {
  const normalized = userMessage.toLowerCase();
  return TRIGGER_PHRASES.some(phrase => normalized.includes(phrase));
}
```

### Trigger Index Lookup

Trigger matching is a keyed lookup over the generated index. It runs from a cold Node process, needs no service and no embeddings:

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs \
  --json -- "I want to save context for this session"
```

The result carries the matched paths, the phrases that matched and a match class. Exit `0` means candidates were found, `1` means none were, `2` means a bad invocation or an unreadable index. Regenerate the index with `scripts/retrieval/generate-trigger-index.mjs` after frontmatter changes.

**Usage Scenarios:**
- Gate 1 prompt matching against author-declared phrases
- Surfacing the packets whose authors claimed a topic
- A first pass before the free-text ripgrep lane in `../retrieval/retrieval-conventions.md`

This lane matches declared phrases only. It has no semantic fallback: a paraphrase an author never wrote down does not match, and the honest answer is a no-hit rather than an approximation.

### Gate 3 Enforcement Triggers

The Gate 3 enforcement trigger set uses 33 trigger phrases to detect file modification intent:

| Category | Trigger Phrases |
|----------|-----------------|
| **Create** | `create`, `add`, `generate`, `build`, `implement`, `write` |
| **Modify** | `modify`, `edit`, `update`, `change`, `refactor`, `fix` |
| **Delete** | `delete`, `remove`, `cleanup` |
| **Move** | `rename`, `move`, `migrate` |
| **Scale Indicators** | `comprehensive`, `all bugs`, `multiple files`, `codebase`, `entire`, `full`, `everything` |
| **Agent Patterns** | `parallel agents`, `15 agents`, `10 agents`, `dispatch agents`, `opus agents` |
| **Compound Actions** | `analyze and fix`, `find and fix`, `fix all`, `update all`, `modify all`, `check and fix` |
| **Gate Keywords** | `spec folder`, `gate 3`, `file modification` |

**How Gate 3 Trigger Matching Works:**

1. AI runs the trigger index lookup on the user message
2. If the prompt matches any Gate 3 trigger, the Gate 3 spec-folder check is signaled
3. AI sees reminder to ask spec folder question before file modifications

**Example:**

```bash
# User says: "refactor the authentication module"
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs \
  --json -- "refactor the authentication module"
# Returns: Gate 3 file-modification trigger match, phrases: ["refactor"]
# AI then asks: "Spec Folder (required): A) Existing | B) New | C) Update related | D) Skip"
```

**Trigger Design Guidelines for Enforcement Trigger Sets:**

| Guideline | Description |
|-----------|-------------|
| **Cover action verbs** | Include all verbs that indicate file modification intent |
| **Include scale words** | Words like "comprehensive", "all", "entire" suggest large changes |
| **Add domain terms** | Include project-specific terms for your enforcement use case |
| **Test coverage** | Verify triggers match common user phrases |
| **Limit count** | 20-40 triggers recommended for an enforcement trigger set |

---

### Signal Vocabulary Expansion

Beyond the default trigger phrases, the system recognizes expanded signal types for contextual trigger matching:

| Signal | Purpose | Example Phrases |
|--------|---------|----------------|
| `CORRECTION` | Tracks when a spec-doc record is corrected or superseded | "actually", "correction", "that was wrong", "update previous" |
| `PREFERENCE` | Captures user preference signals | "I prefer", "use this instead", "default to", "always do" |
| `REINFORCEMENT` | Positive validation of existing spec-doc records | "that's right", "confirmed", "keep this" |

These signals were detected during trigger-match processing on the retired server, where they influenced save-time arbitration and correction tracking. The index lookup does not classify signals: it returns matched phrases and nothing else, so a caller that needs this must read it from the documents themselves.

### Trigger Sanitization (026 Remediation)

Save-time trigger validation now applies sanitization rules to prevent low-quality triggers from degrading retrieval precision:

| Rule | Behavior |
|------|----------|
| **Single-word filter** | Overly generic single-word triggers (e.g., "code", "fix", "error") are stripped during save-time validation to reduce false-positive surfacing |
| **Duplicate detection** | Triggers that duplicate existing high-importance memory triggers are flagged and removed |
| **Length minimum** | Trigger phrases shorter than 3 characters are rejected |
| **Stopword filter** | Common stopwords used alone as triggers are rejected |

**Post-save quality review** checks trigger_phrases in the saved memory and reports HIGH-severity issues when triggers are overly broad or likely to cause false matches. The AI must patch these manually via Edit tool when flagged.

**Filter behavior:**
- The index lookup applies a candidate gate and a match class before returning results, reducing noise from weak partial matches
- Content-similarity deduplication is gone with the store it ran against; the lookup returns every path whose declared phrases matched, and the caller dedupes

---

## 3. MANUAL SAVE METHODS

### Primary Method: Command

```
/speckit:save
```

This is the most reliable way to save context in OpenCode.

### Alternative: Trigger Phrases

Include any of these phrases in your message:
- "save context"
- "save conversation" 
- "please save this session"
- "checkpoint"

### When to Save Context

| Scenario | Recommendation |
|----------|----------------|
| Feature complete | Save after implementation milestones |
| Complex discussion | Save after major architectural decisions |
| Team sharing | Save before handoff to colleagues |
| Session ending | Save at end of work session |
| Research findings | Save valuable discoveries immediately |

### Save Location

- **Save path:** `/speckit:save` targets the selected spec folder and routes continuity into canonical packet docs such as `implementation-summary.md`, `decision-record.md`, and `handover.md`.

**Continuity home:** packet-local canonical docs plus `_memory.continuity`, not a standalone `{spec_folder}/memory/*.md` note.

---

## 4. CUSTOMIZATION

### Adding Custom Triggers

Create or modify `config.jsonc` in your project root:

```jsonc
{
  "memory": {
    "triggers": {
      // Add custom trigger phrases
      "custom": [
        "my custom phrase",
        "another trigger",
        "project-specific term"
      ],
      
      // Disable default triggers (optional)
      "disableDefaults": false,
      
      // Case sensitivity (default: false)
      "caseSensitive": false
    }
  }
}
```

### Custom Trigger Function

```typescript
// Extended detection with custom triggers
interface TriggerResult {
  matched: boolean;
  source: 'default' | 'custom' | null;
}

const CUSTOM_TRIGGERS: readonly string[] = [
  'my custom phrase',
  'another trigger',
  'project-specific term'
] as const;

function detectCustomTrigger(userMessage: string, customPhrases: readonly string[] = CUSTOM_TRIGGERS): TriggerResult {
  const normalized = userMessage.toLowerCase();

  // Check default triggers first
  if (TRIGGER_PHRASES.some(phrase => normalized.includes(phrase))) {
    return { matched: true, source: 'default' };
  }

  // Check custom triggers
  if (customPhrases.some(phrase => normalized.includes(phrase))) {
    return { matched: true, source: 'custom' };
  }

  return { matched: false, source: null };
}
```

### Per-Project Configuration

Packet-local continuity no longer uses `memory/config.md`. Customize continuity through canonical docs and save input instead:

```markdown
<!-- implementation-summary.md frontmatter -->
_memory:
  continuity:
    recent_action: "Completed implementation milestone"
    next_safe_action: "Run strict validation and save handoff state"
```

---

## 5. PERFORMANCE TARGETS

### Trigger Matching Performance

| Operation | Target | Acceptable | Degraded |
|-----------|--------|------------|----------|
| Phrase detection | <10ms | <50ms | >100ms |
| Trigger-index lookup | <50ms | <100ms | >200ms |
| Custom trigger check | <20ms | <50ms | >100ms |

### Optimization Strategies

```typescript
// Pre-compile regex for frequently-used triggers
interface CompiledTrigger {
  phrase: string;
  regex: RegExp;
}

const COMPILED_TRIGGERS: readonly CompiledTrigger[] = TRIGGER_PHRASES.map(phrase => ({
  phrase,
  regex: new RegExp(phrase.replace(/\s+/g, '\\s+'), 'i')
}));

function optimizedDetection(userMessage: string): CompiledTrigger | undefined {
  // Use pre-compiled regex for faster matching
  return COMPILED_TRIGGERS.find(t => t.regex.test(userMessage));
}
```

---

## 6. BEST PRACTICES

### Good vs Bad Trigger Phrases

| Category | Good Example | Bad Example | Reason |
|----------|--------------|-------------|--------|
| Specificity | "save this debug context" | "save" | Too generic causes false positives |
| Clarity | "checkpoint: auth complete" | "done" | Clear intent vs ambiguous |
| Action-oriented | "remember the API decision" | "this is important" | Explicit action vs vague |
| Scoped | "document the fix for #123" | "document" | Context-aware vs generic |

### Trigger Phrase Design Guidelines

1. **Be Specific** - Use action verbs with context
   - ✅ "save context for the auth refactor"
   - ❌ "save this"

2. **Avoid Common Words** - Prevent false positives
   - ✅ "checkpoint session"
   - ❌ "save" (too common)

3. **Include Context Type** - Help categorization
   - ✅ "document decision: chose JWT over sessions"
   - ❌ "document this"

4. **Use Consistent Patterns** - Establish team conventions
   - ✅ "memory: [type] - [description]"
   - ❌ Ad-hoc phrases per person

### When to Save (Manual Guidelines)

```markdown
## Save More Frequently When:
- Complex multi-file refactoring
- Debugging sessions with many iterations
- Research with valuable discoveries
- Architecture decisions in progress

## Save Less Frequently When:
- Simple, repetitive tasks
- Well-understood changes
- Batch file operations
```

### Integration Checklist

Before deploying custom triggers:

- [ ] Test trigger phrases don't conflict with common conversation
- [ ] Verify `lookup-trigger-index.mjs` response times meet <50ms target
- [ ] Document custom triggers in project README
- [ ] Establish team convention for save frequency

---

## 7. RELATED RESOURCES

### Reference Files
- [SKILL.md](../../SKILL.md) - Main workflow-memory skill documentation

### Scripts
- [generate-context.ts](../../scripts/memory/generate-context.ts) - Context generation script

### Related Skills
- `system-skill-advisor` - Skill routing over its own advisor metadata

---

