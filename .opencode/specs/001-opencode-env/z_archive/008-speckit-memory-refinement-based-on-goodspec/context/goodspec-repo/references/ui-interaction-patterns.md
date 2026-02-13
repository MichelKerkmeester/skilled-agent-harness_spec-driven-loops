# UI Interaction Patterns

**GoopSpec Voice:** Clean, Consistent, Terminal-First.

Our UI communicates reliability and structured thinking. It distinguishes between *information*, *questions*, and *gates*.

## Visual Language

*   **Hexagon (`⬢`):** The GoopSpec anchor. Use for system messages and prompts.
*   **Borders:** Use for Gates and Checkpoints to arrest attention.
*   **Indentation:** Hierarchy is meaning.
*   **Colors:** (Implicit)
    *   **Blue/Cyan:** Info & Progress
    *   **Green:** Success & Memory Recall
    *   **Yellow:** Warning & Checkpoints
    *   **Red:** Errors & Blockers

---

## Interaction Primitives

### 1. The Inline Notice
*For status updates, memory recalls, and skill activations.*

**Format:** `⬢ [Category] Message`

```text
⬢ Memory: Using preference "TypeScript Strict Mode"
⬢ Skill: Loading "octocode-research"...
⬢ Status: Analyzing dependency tree...
```

### 2. The Structured Prompt
*For standard questions and choices.*

**Format:** Question followed by clear options.

```text
⬢ Decision Required: Database Selection
  
  1. PostgreSQL (Recommended based on project)
  2. SQLite (Simpler setup)
  
  ► Select [1-2]: 
```

### 3. The Gate (Boxed)
*For critical stops: Contract, Checkpoint, Acceptance.*

**Format:** ASCII Box with Title and Action.

```text
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🔒 CONTRACT GATE                                  │
│                                                    │
│  Summary: Login Feature                            │
│  • Auth Provider: Auth0                            │
│  • MFA: Required                                   │
│                                                    │
│  ► Type "confirm" to Lock Spec and Plan.           │
│                                                    │
╰────────────────────────────────────────────────────╯
```

---

## Patterns

### The "Recall & Confirm"
*Don't just apply memory silently; validate it lightly.*

```text
⬢ Memory: I see you use Tailwind in other projects.
  Apply Tailwind to this project too? [Y/n]
```

### The "Skill Injection"
*Show that an agent is doing deep work.*

```text
⬢ Researching: "Best state management for Svelte 5"
  └─ ⚡ Found 3 relevant libraries
  └─ ⚡ Analyzed GitHub stars & issues
  
  Recommendation: Runes (Native)
```

### The "Progressive Drill-Down"
*Handle complexity without overwhelm.*

**Step 1 (High Level):**
```text
⬢ Strategy: I recommend a "Feature Folder" structure.
  Proceed? [Y/n/details]
```

**Step 2 (If 'details' selected):**
```text
⬢ Feature Folder Structure:
  src/features/auth/
    ├── components/
    ├── api/
    └── types.ts
  
  Pros: Scalable, self-contained.
  Cons: More initial boilerplate.
  
  ► Confirm structure? [Y/n]
```

---

## Anti-Patterns (Don't Do This)

*   **The Wall of Text:** unstructured paragraphs mixing info and questions.
*   **The Hidden Question:** burying a question in the middle of a log.
*   **The "Double Ask":** asking for info, then asking for confirmation of the info in the same turn.
*   **The "Fake Choice":** offering options that are clearly bad/wrong.

---

## Checklist: UI Audit

- [ ] **Is the Hexagon present?** (Brand anchor)
- [ ] **Is the hierarchy clear?** (Indentation)
- [ ] **Are options numbered or binary?** (Ease of input)
- [ ] **Is the critical info boxed?** (Gates)
- [ ] **Did I acknowledge memory/skills?** (Show intelligence)

---

**Goal:** The user should be able to scan the output and know exactly *where they are* and *what they need to do*.
