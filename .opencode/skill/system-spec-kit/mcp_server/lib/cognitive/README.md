# Cognitive Subsystem

Research-backed memory decay, retrieval, and consolidation engine for the Spec Kit Memory MCP server.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🧠 KEY CONCEPTS](#2--key-concepts)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. ❓ FAQ](#7--faq)
- [8. 🔗 RELATED RESOURCES](#8--related-resources)

---

## 1. 📖 OVERVIEW

The cognitive subsystem implements human memory principles to manage conversation context intelligently. It models how memories decay, strengthen through use, and consolidate from short-term episodic experiences into long-term semantic knowledge.

### What is the Cognitive Subsystem?

The cognitive subsystem is the "brain" of the memory system. It determines which memories stay active, which fade, and which consolidate into permanent knowledge. Unlike simple time-based caching, it uses research-validated algorithms from cognitive science and spaced repetition systems.

### Key Statistics

| Component      | Modules | Lines  | Purpose                                              |
| -------------- | ------- | ------ | ---------------------------------------------------- |
| Decay          | 3       | ~70KB  | Memory forgetting curves (FSRS, attention, archival) |
| Classification | 2       | ~46KB  | 5-state memory model + duplicate detection           |
| Consolidation  | 2       | ~48KB  | Long-term memory formation + spreading activation    |
| Total          | 11      | ~200KB | Complete cognitive memory lifecycle                  |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [New Memory]                                                   │
│       ↓                                                         │
│  FSRS Scheduler ────→ Initial Stability = 1.0 day               │
│       ↓                                                         │
│  Tier Classifier ───→ State = HOT (R > 0.80)                     │
│       ↓                                                         │
│  Working Memory ────→ Attention Score = 1.0                     │
│       ↓                                                         │
│  [Time Passes]                                                  │
│       ↓                                                         │
│  Attention Decay ───→ R(t,S) = (1 + 0.235×t/S)^(-0.5)           │
│       ↓                                                         │
│  Tier Classifier ───→ State = WARM → COLD → DORMANT              │
│       ↓                                                         │
│  Archival Manager ──→ After 90 days → ARCHIVED                  │
│       ↓                                                         │
│  [Access Event]                                                 │
│       ↓                                                         │
│  Co-Activation ─────→ Spread to Related (+0.35)                 │
│       ↓                                                         │
│  FSRS Testing ──────→ Update Stability (harder = stronger)      │
│       ↓                                                         │
│  [Pattern Detected]                                             │
│       ↓                                                         │
│  Consolidation ─────→ Episodic → Semantic (5 phases)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature                    | Implementation                                                         | Benefit                              |
| -------------------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| **Power-Law Decay**        | FSRS v4 formula validated on 100M+ users                               | More accurate than exponential decay |
| **5-State Model**          | HOT/WARM/COLD/DORMANT/ARCHIVED with thresholds                         | Progressive memory transitions       |
| **Duplicate Prevention**   | 4-tier similarity detection (95/90/70/50%)                             | Prevents redundant context           |
| **Spreading Activation**   | Boost related memories (+0.35 on access)                               | Maintains semantic coherence         |
| **Type-Specific Decay**    | Constitutional (none), Critical (none), Episodic (60d), Temporary (1d) | Memory importance = retention time   |
| **Consolidation Pipeline** | REPLAY → ABSTRACT → INTEGRATE → PRUNE → STRENGTHEN                     | Episodic → Semantic transformation   |
| **Testing Effect**         | Low retrievability = greater boost on success                          | Harder recalls strengthen more       |
| **Automatic Archival**     | 90-day threshold with background job                                   | Lifecycle management                 |

### Requirements

| Requirement    | Minimum | Recommended |
| -------------- | ------- | ----------- |
| Node.js        | 16+     | 20+         |
| better-sqlite3 | 8.0+    | Latest      |
| Memory (RAM)   | 256MB   | 1GB+        |

---

## 2. 🧠 KEY CONCEPTS

### The FSRS Formula

**Why power-law beats exponential:**

Traditional exponential decay: `R(t) = e^(-t/τ)`
- Decays too fast initially, too slow later
- Not validated on real human memory data

FSRS power-law decay: `R(t,S) = (1 + 0.235 × t/S)^(-0.5)`
- `R` = Retrievability (0.0 to 1.0)
- `t` = Time elapsed (days)
- `S` = Stability (days until 90% retrievability)
- `0.235` = FSRS factor (19/81)
- `-0.5` = FSRS decay exponent

**Example:**
```javascript
// After 10 days with stability = 5 days:
R(10, 5) = (1 + 0.235 × 10/5)^(-0.5)
         = (1 + 0.47)^(-0.5)
         = 1.47^(-0.5)
         = 0.825  // 82.5% retrievable

// Exponential would give: e^(-10/5) = 0.135 (13.5%) - too harsh!
```

### The 5-State Memory Model

Memories transition through states based on retrievability:

| State        | Threshold            | Meaning           | Content       | Typical Age |
| ------------ | -------------------- | ----------------- | ------------- | ----------- |
| **HOT**      | R ≥ 0.80             | Recently accessed | Full content  | 0-2 days    |
| **WARM**     | R ≥ 0.25             | Recently relevant | Summary only  | 3-14 days   |
| **COLD**     | R ≥ 0.05             | Fading            | Metadata only | 15-60 days  |
| **DORMANT**  | R ≥ 0.02             | Nearly forgotten  | Metadata only | 60-90 days  |
| **ARCHIVED** | R < 0.02 OR 90+ days | Long-term storage | Not loaded    | 90+ days    |

**State Transitions:**
```
NEW MEMORY → HOT (R = 1.0)
    ↓ time passes
  WARM (R = 0.60)
    ↓ time passes
  COLD (R = 0.15)
    ↓ time passes
  DORMANT (R = 0.03)
    ↓ 90 days threshold
  ARCHIVED

  ↑ access event
[Any state] → HOT (R = 1.0) + Stability boost
```

### Prediction Error Gating

Prevents duplicate memories using similarity thresholds:

| Threshold    | Action                      | Logic                             |
| ------------ | --------------------------- | --------------------------------- |
| ≥ 0.95 (95%) | **REINFORCE**               | Exact duplicate - boost existing  |
| ≥ 0.90 (90%) | **UPDATE** or **SUPERSEDE** | High match - check contradiction  |
| ≥ 0.70 (70%) | **CREATE_LINKED**           | Medium match - new with relations |
| < 0.50 (50%) | **CREATE**                  | Low match - fully new memory      |

**Contradiction Detection:**
- Patterns: `always ↔ never`, `must ↔ must not`, `enable ↔ disable`
- Triggers: SUPERSEDE action to replace contradictory memory
- Audit: Logs to `memory_conflicts` table for review

### Multi-Factor Decay (5-Factor Model)

Attention score = weighted combination of 5 factors:

| Factor         | Weight | Measures               | Formula                                       |
| -------------- | ------ | ---------------------- | --------------------------------------------- |
| **Temporal**   | 0.45   | FSRS retrievability    | `R(t,S) = (1 + 0.235×t/S)^(-0.5)`             |
| **Usage**      | 0.20   | Access frequency       | `min(1, access_count / 50)`                   |
| **Importance** | 0.20   | Memory tier weight     | Constitutional=1.0, Normal=0.5, Temporary=0.2 |
| **Pattern**    | 0.10   | Query/anchor alignment | Jaccard similarity with matched phrases       |
| **Citation**   | 0.05   | Recency of citation    | Days since last citation                      |

**Composite Score:**
```javascript
attention = (0.45 × temporal) + (0.20 × usage) + (0.20 × importance)
          + (0.10 × pattern) + (0.05 × citation)
```

**Decay Rates by Tier:**
```javascript
constitutional: 1.0  // No decay
critical:       1.0  // No decay
important:      1.0  // No decay
normal:         0.80 // 80% per turn
temporary:      0.60 // 60% per turn
deprecated:     1.0  // No decay (frozen)
```

### Type-Specific Half-Lives

Different memory types decay at different rates:

| Memory Type        | Half-Life | Rationale                         |
| ------------------ | --------- | --------------------------------- |
| **Constitutional** | None (∞)  | Permanent rules and principles    |
| **Critical**       | None (∞)  | Essential architectural decisions |
| **Semantic**       | 180 days  | Long-term knowledge               |
| **Procedural**     | 120 days  | Learned processes                 |
| **Declarative**    | 60 days   | Facts and information             |
| **Episodic**       | 60 days   | Session-specific events           |
| **Temporary**      | 1 day     | Short-term context                |

**Half-Life to Stability Conversion:**
```javascript
// FSRS stability = time for R to reach 90%
// Half-life = time for R to reach 50%
// For FSRS: stability ≈ half_life (1:1 scaling)

half_life = 60 days → stability = 60 days
```

### Consolidation Pipeline

Transforms episodic memories into semantic knowledge:

| Phase             | Trigger                | Action                     | Output                     |
| ----------------- | ---------------------- | -------------------------- | -------------------------- |
| **1. REPLAY**     | 7+ days old            | Select episodic candidates | Array of episodic memories |
| **2. ABSTRACT**   | 2+ occurrences         | Extract recurring patterns | Pattern groups             |
| **3. INTEGRATE**  | Pattern strength ≥ 0.6 | Create semantic memories   | New semantic entries       |
| **4. PRUNE**      | After integration      | Archive redundant episodes | Marked as deprecated       |
| **5. STRENGTHEN** | Access count ≥ 5       | Boost high-use memories    | Stability × 1.3            |

**Pattern Detection:**
```javascript
// Exact duplicates (hash match)
content_hash === existing_hash → Exact Duplicate Pattern

// Trigger similarity (Jaccard)
jaccard(triggers1, triggers2) ≥ 0.75 → Trigger Pattern

// Title similarity (word overlap)
jaccard(words1, words2) ≥ 0.75 → Title Pattern
```

**Safety Mechanisms (R14 Mitigation):**
- Dry-run mode by default (no accidental deletions)
- Automatic backup before PRUNE phase
- Preserve at least 1 representative per pattern

---

## 3. 📁 STRUCTURE

```
cognitive/
├── fsrs-scheduler.js           # FSRS v4 power-law decay
├── prediction-error-gate.js    # Duplicate detection (4 thresholds)
├── tier-classifier.js          # 5-state model classifier
├── attention-decay.js          # Multi-factor attention decay
├── co-activation.js            # Spreading activation
├── working-memory.js           # Session-scoped activation
├── temporal-contiguity.js      # Time-based memory linking
├── summary-generator.js        # Auto-summary generation
├── archival-manager.js         # 90-day archival lifecycle
├── consolidation.js            # 5-phase consolidation pipeline
├── index.js                    # Module aggregator
└── README.md                   # This file
```

### Key Modules

| Module                     | Purpose                    | Key Functions                                         |
| -------------------------- | -------------------------- | ----------------------------------------------------- |
| `fsrs-scheduler.js`        | FSRS v4 implementation     | `calculate_retrievability`, `update_stability`        |
| `tier-classifier.js`       | State classification       | `classify_state`, `calculate_retrievability`          |
| `attention-decay.js`       | Multi-factor decay         | `apply_fsrs_decay`, `calculate_composite_attention`   |
| `prediction-error-gate.js` | Conflict detection         | `evaluate_memory`, `detect_contradiction`             |
| `consolidation.js`         | Long-term memory formation | `run_consolidation`, `replay_phase`, `abstract_phase` |
| `archival-manager.js`      | Lifecycle management       | `run_archival_scan`, `archive_memory`                 |
| `co-activation.js`         | Semantic spreading         | `spread_activation`, `populate_related_memories`      |

---

## 4. ⚡ FEATURES

### FSRS Power-Law Decay

**Purpose**: Research-validated memory forgetting curve

**Usage**:
```javascript
const fsrs = require('./fsrs-scheduler');

// Calculate retrievability
const stability = 5.0;  // 5 days until 90% retrievable
const elapsed = 10;     // 10 days passed
const R = fsrs.calculate_retrievability(stability, elapsed);
// R ≈ 0.825 (82.5% retrievable)

// Update stability after successful recall
const difficulty = 5.0;
const grade = fsrs.GRADE_GOOD;  // 3 = successful recall
const newStability = fsrs.update_stability(stability, difficulty, R, grade);
// newStability ≈ 7.5 days (increased due to successful testing)

// Optimal review interval
const interval = fsrs.calculate_optimal_interval(newStability, 0.9);
// interval ≈ 11 days (next review time for 90% target)
```

**FSRS Grades:**
- `GRADE_AGAIN (1)`: Failed recall → Stability × 0.5
- `GRADE_HARD (2)`: Difficult recall → Stability × 0.8
- `GRADE_GOOD (3)`: Successful recall → Stability × 1.5
- `GRADE_EASY (4)`: Easy recall → Stability × 2.0

**Testing Effect:**
Lower retrievability = greater boost on success (desirable difficulty)
```javascript
R = 0.3 (hard) + GRADE_GOOD → Boost factor: 1.85×
R = 0.8 (easy) + GRADE_GOOD → Boost factor: 1.60×
```

### 5-State Classification

**Purpose**: Progressive memory state transitions

**Usage**:
```javascript
const classifier = require('./tier-classifier');

// Classify memory state
const memory = {
  stability: 5.0,
  last_review: '2025-01-15T10:00:00Z',
  importance_tier: 'normal'
};
const state = classifier.classify_state(memory);
// state = 'WARM' or 'HOT' or 'COLD' etc.

// Get content based on state
const content = classifier.get_state_content(memory, state);
// HOT: full content, WARM: summary, COLD/DORMANT/ARCHIVED: null

// Filter and limit by state
const memories = [...]; // Array of memories
const active = classifier.filter_and_limit_by_state(memories);
// Returns max 5 HOT + max 10 WARM
```

**State Thresholds (configurable via env vars):**
```bash
HOT_THRESHOLD=0.80      # Default: 0.80
WARM_THRESHOLD=0.25     # Default: 0.25
COLD_THRESHOLD=0.05     # Default: 0.05
ARCHIVED_DAYS_THRESHOLD=90  # Default: 90 days
```

### Prediction Error Gating

**Purpose**: Prevent duplicate memories with conflict detection

**Usage**:
```javascript
const gate = require('./prediction-error-gate');
gate.init(db);

// Evaluate similarity candidates
const candidates = [
  { id: 42, similarity: 0.92, content: 'Use React for UI' },
  { id: 58, similarity: 0.88, content: 'React is the UI framework' }
];
const newContent = 'Always use React for frontend';

const decision = gate.evaluate_memory(candidates, newContent, {
  check_contradictions: true
});

// decision = {
//   action: 'UPDATE',  // or REINFORCE, SUPERSEDE, CREATE, CREATE_LINKED
//   reason: 'Similarity 92.0% in high-match range (90%-95%)',
//   candidate: { id: 42, ... },
//   similarity: 0.92,
//   contradiction: { found: false, ... }
// }

// Log decision
gate.log_conflict(decision, newMemoryId, newContent, existingContent, specFolder);
```

**Actions by Threshold:**
```javascript
similarity >= 0.95 → REINFORCE (boost existing score)
similarity >= 0.90 → UPDATE or SUPERSEDE (if contradiction)
similarity >= 0.70 → CREATE_LINKED (new with related_ids)
similarity <  0.50 → CREATE (fully new)
```

### Multi-Factor Attention Decay

**Purpose**: Composite scoring with 5 factors

**Usage**:
```javascript
const decay = require('./attention-decay');
decay.init(db);

// Apply FSRS-based decay to session
const result = decay.apply_fsrs_decay(sessionId);
// result = { decayedCount: 15, updated: [...] }

// Calculate composite attention score
const memory = {
  stability: 7.5,
  last_review: '2025-01-20T10:00:00Z',
  access_count: 12,
  importance_tier: 'normal',
  memory_type: 'semantic'
};
const score = decay.calculate_composite_attention(memory, {
  query: 'React patterns',
  anchors: ['implementation', 'best-practices']
});
// score = 0.68 (composite of 5 factors)

// Get factor breakdown
const breakdown = decay.get_attention_breakdown(memory, { query: 'React' });
// breakdown = {
//   factors: {
//     temporal: { value: 0.75, weight: 0.45, contribution: 0.34 },
//     usage: { value: 0.24, weight: 0.20, contribution: 0.05 },
//     importance: { value: 0.50, weight: 0.20, contribution: 0.10 },
//     pattern: { value: 0.80, weight: 0.10, contribution: 0.08 },
//     citation: { value: 0.20, weight: 0.05, contribution: 0.01 }
//   },
//   total: 0.58,
//   model: '5-factor'
// }
```

### Spreading Activation

**Purpose**: Boost related memories when primary memory is accessed

**Usage**:
```javascript
const coActivation = require('./co-activation');
coActivation.init(db);

// Spread activation from primary memory
const sessionId = 'session-123';
const primaryMemoryId = 42;
const turnNumber = 5;

const boosted = coActivation.spread_activation(sessionId, primaryMemoryId, turnNumber);
// boosted = [
//   { memoryId: 58, oldScore: 0.20, newScore: 0.55, wasAdded: false },
//   { memoryId: 71, oldScore: 0, newScore: 0.35, wasAdded: true }
// ]

// Populate related memories (using vector search)
const relatedIds = await coActivation.populate_related_memories(
  primaryMemoryId,
  async (query, options) => {
    // Your vector search implementation
    return await vectorIndex.search(query, options);
  }
);
// relatedIds = [58, 71, 84] (top 5 similar memories)
```

**Boost Configuration:**
```javascript
ENABLE_CO_ACTIVATION=true  # Default: true
CO_ACTIVATION_BOOST=0.35   # Default: 0.35
MAX_RELATED_MEMORIES=5     # Default: 5
```

### Consolidation Pipeline

**Purpose**: Transform episodic → semantic memories

**Usage**:
```javascript
const consolidation = require('./consolidation');
consolidation.init(db);

// Run full 5-phase pipeline
const results = consolidation.run_consolidation({
  dryRun: false,            // Set true to preview changes
  createBackup: true,       // Backup before pruning
  specFolder: 'specs/042'   // Optional: filter by folder
});

// results = {
//   success: true,
//   dryRun: false,
//   phases: {
//     replay: { candidateCount: 28, ... },
//     abstract: { patternCount: 5, ... },
//     integrate: { integratedCount: 3, ... },
//     prune: { prunedCount: 12, backupId: '...', ... },
//     strengthen: { strengthenedCount: 8, ... }
//   },
//   summary: {
//     replayed: 28,
//     patterns: 5,
//     integrated: 3,
//     pruned: 12,
//     strengthened: 8
//   },
//   durationMs: 245
// }

// Run individual phases
const replayResult = consolidation.replay_phase({ minAgeDays: 7 });
const patterns = consolidation.abstract_phase(replayResult.candidates);
const integrated = consolidation.integrate_phase(patterns.patterns);
```

**Phase Configuration:**
```javascript
REPLAY_MIN_AGE_DAYS=7           # Default: 7 days
ABSTRACT_MIN_OCCURRENCES=2      # Default: 2+ occurrences
INTEGRATE_MIN_STRENGTH=0.6      # Default: 0.6
STRENGTHEN_MIN_ACCESS_COUNT=5   # Default: 5 accesses
```

### Automatic Archival

**Purpose**: Lifecycle management for 90+ day inactive memories

**Usage**:
```javascript
const archival = require('./archival-manager');
archival.init(db);

// Start background job (scans every hour)
archival.start_background_job();
// { started: true, interval_ms: 3600000 }

// Manual scan
const scanResult = archival.run_archival_scan();
// { scanned: 15, archived: 12, failed: 0, duration_ms: 42 }

// Check specific memory
const status = archival.check_memory_archival_status(memoryId);
// {
//   shouldArchive: true,
//   memory: { id: 42, ... },
//   reason: 'Inactive for 95 days (threshold: 90)'
// }

// Unarchive (restore)
archival.unarchive_memory(memoryId);

// Get statistics
const stats = archival.get_stats();
// {
//   scans_completed: 42,
//   total_archived: 156,
//   current_archived_count: 203,
//   background_job_active: true,
//   config: { ... }
// }
```

**Archival Configuration:**
```bash
ARCHIVAL_ENABLED=true               # Default: true
ARCHIVAL_SCAN_INTERVAL_MS=3600000   # Default: 1 hour
ARCHIVAL_BATCH_SIZE=50              # Default: 50 per scan
ARCHIVAL_ACTION=mark                # mark | soft_delete | log_only
ARCHIVED_DAYS_THRESHOLD=90          # Default: 90 days
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Initialize Cognitive System

```javascript
const db = require('better-sqlite3')('memory.db');
const fsrs = require('./cognitive/fsrs-scheduler');
const classifier = require('./cognitive/tier-classifier');
const decay = require('./cognitive/attention-decay');
const gate = require('./cognitive/prediction-error-gate');
const consolidation = require('./cognitive/consolidation');
const archival = require('./cognitive/archival-manager');

// Initialize modules
decay.init(db);
gate.init(db);
consolidation.init(db);
archival.init(db);

// Start background jobs
archival.start_background_job();
consolidation.schedule_consolidation(24 * 60 * 60 * 1000, { dryRun: false });
```

### Example 2: Memory Access with FSRS Testing

```javascript
// Memory was accessed - apply testing effect
const sessionId = 'session-abc';
const memoryId = 42;
const turnNumber = 8;

// Activate with FSRS testing effect
const result = decay.activate_memory_with_fsrs(sessionId, memoryId, turnNumber, {
  similarity: 0.88  // From search result
});

// result = {
//   success: true,
//   stability_updated: true,
//   new_stability: 8.2  // Increased from 5.0 due to testing effect
// }

// Spread activation to related memories
const coActivation = require('./cognitive/co-activation');
const boosted = coActivation.spread_activation(sessionId, memoryId, turnNumber);
// boosted = [{ memoryId: 58, newScore: 0.55, ... }, ...]
```

### Example 3: Detect and Handle Duplicates

```javascript
const gate = require('./cognitive/prediction-error-gate');

// Before saving new memory, check for duplicates
const vectorIndex = require('../search/vector-index');
const candidates = await vectorIndex.search(newMemoryContent, { limit: 5 });

const decision = gate.evaluate_memory(
  candidates,
  newMemoryContent,
  { check_contradictions: true }
);

switch (decision.action) {
  case 'REINFORCE':
    // Boost existing memory instead of creating new
    decay.activate_memory(sessionId, decision.candidate.id, turnNumber);
    console.log(`Reinforced existing memory ${decision.candidate.id}`);
    break;

  case 'SUPERSEDE':
    // Contradiction detected - mark old as deprecated
    db.prepare('UPDATE memory_index SET importance_tier = ? WHERE id = ?')
      .run('deprecated', decision.candidate.id);
    // Create new memory with updated information
    createNewMemory(newMemoryContent);
    console.log(`Superseded memory ${decision.candidate.id} due to: ${decision.contradiction.pattern}`);
    break;

  case 'UPDATE':
    // High similarity but no contradiction - append
    appendToMemory(decision.candidate.id, newMemoryContent);
    break;

  case 'CREATE_LINKED':
    // Medium similarity - create with related IDs
    createNewMemory(newMemoryContent, { related_ids: decision.related_ids });
    break;

  case 'CREATE':
    // Low similarity - create independent
    createNewMemory(newMemoryContent);
    break;
}

// Log decision for audit
gate.log_conflict(decision, newMemoryId, newMemoryContent, existingContent, specFolder);
```

### Example 4: Consolidation Workflow

```javascript
const consolidation = require('./cognitive/consolidation');

// Dry-run first (preview changes)
const preview = consolidation.run_consolidation({ dryRun: true });
console.log('Consolidation Preview:');
console.log(`- Would replay: ${preview.summary.replayed} episodic memories`);
console.log(`- Would extract: ${preview.summary.patterns} patterns`);
console.log(`- Would integrate: ${preview.summary.integrated} semantic memories`);
console.log(`- Would prune: ${preview.summary.pruned} redundant episodes`);

// Review patterns
for (const pattern of preview.phases.abstract.patterns) {
  console.log(`\nPattern: ${pattern.pattern_id}`);
  console.log(`  Type: ${pattern.type}`);
  console.log(`  Occurrences: ${pattern.occurrences}`);
  console.log(`  Strength: ${pattern.strength.toFixed(2)}`);
  console.log(`  Representative: ${pattern.representative.title}`);
}

// If satisfied, run for real
const results = consolidation.run_consolidation({
  dryRun: false,
  createBackup: true
});

if (results.success) {
  console.log(`Consolidation complete in ${results.durationMs}ms`);
  console.log(`Created ${results.summary.integrated} semantic memories`);
  console.log(`Archived ${results.summary.pruned} redundant episodes`);
  if (results.phases.prune.backupId) {
    console.log(`Backup checkpoint: ${results.phases.prune.backupId}`);
  }
}
```

### Example 5: Composite Attention Scoring

```javascript
const decay = require('./cognitive/attention-decay');

// Get all memories with composite scores
const sessionId = 'session-abc';
const activeMemories = decay.get_active_memories(sessionId);

// Score each memory with composite model
const scoredMemories = activeMemories.map(memory => {
  const score = decay.calculate_composite_attention(memory, {
    query: 'React best practices',
    anchors: ['implementation', 'patterns']
  });

  const breakdown = decay.get_attention_breakdown(memory, {
    query: 'React best practices'
  });

  return {
    ...memory,
    composite_score: score,
    factors: breakdown.factors
  };
});

// Sort by composite score
scoredMemories.sort((a, b) => b.composite_score - a.composite_score);

// Top memory analysis
const top = scoredMemories[0];
console.log(`\nTop Memory: ${top.title}`);
console.log(`Composite Score: ${top.composite_score.toFixed(3)}`);
console.log('Factor Breakdown:');
for (const [name, factor] of Object.entries(top.factors)) {
  console.log(`  ${name}: ${factor.value.toFixed(3)} × ${factor.weight} = ${factor.contribution.toFixed(3)}`);
  console.log(`    ${factor.description}`);
}
```

### Common Patterns

| Pattern           | Use Case                             | Key Functions                                    |
| ----------------- | ------------------------------------ | ------------------------------------------------ |
| **Memory Save**   | New memory → Check duplicates → Save | `evaluate_memory`, `activate_memory_with_fsrs`   |
| **Memory Access** | Search hit → Boost + spread          | `activate_memory_with_fsrs`, `spread_activation` |
| **Session Decay** | Turn end → Apply decay               | `apply_fsrs_decay` or `apply_composite_decay`    |
| **State Check**   | Context selection → Filter by state  | `classify_state`, `filter_and_limit_by_state`    |
| **Nightly Jobs**  | Background → Archive + consolidate   | `run_archival_scan`, `run_consolidation`         |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Memories Not Decaying

**Symptom**: Attention scores stay at 1.0 after multiple turns

**Cause**: Decay not being applied at turn boundaries

**Solution**:
```javascript
// Apply decay at EVERY turn
const result = decay.apply_fsrs_decay(sessionId);
console.log(`Decayed ${result.decayedCount} memories`);

// Check decay config
console.log('Decay rates:', decay.DECAY_CONFIG.decayRateByTier);
// constitutional: 1.0 = no decay (expected)
// normal: 0.80 = 80% retention per turn
```

#### High Memory Usage

**Symptom**: Memory consumption grows over time

**Cause**: Not archiving old memories, or archival job not running

**Solution**:
```javascript
// Check archival stats
const stats = archival.get_stats();
console.log('Archived count:', stats.current_archived_count);
console.log('Background job:', stats.background_job_active);

// Start background job if not running
if (!stats.background_job_active) {
  archival.start_background_job();
}

// Manual cleanup
const scanResult = archival.run_archival_scan();
console.log(`Archived ${scanResult.archived} old memories`);
```

#### Duplicate Memories

**Symptom**: Multiple similar memories with same content

**Cause**: Not using prediction error gate before saving

**Solution**:
```javascript
// ALWAYS check before saving new memory
const candidates = await vectorSearch(newContent, { limit: 5 });
const decision = gate.evaluate_memory(candidates, newContent);

if (decision.action === 'REINFORCE') {
  // Don't create new - boost existing
  decay.activate_memory(sessionId, decision.candidate.id, turnNumber);
  console.log('Boosted existing memory instead of creating duplicate');
  return decision.candidate.id;
}

// Check conflict logs
const conflicts = gate.get_recent_conflicts(20);
console.log('Recent conflict decisions:', conflicts);
```

#### Incorrect State Classification

**Symptom**: Memory shows COLD but was recently accessed

**Cause**: `last_review` not being updated on access

**Solution**:
```javascript
// Use activate_memory_with_fsrs (updates last_review)
const result = decay.activate_memory_with_fsrs(sessionId, memoryId, turnNumber);

// Verify state after activation
const memory = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId);
const state = classifier.classify_state(memory);
console.log(`State after activation: ${state}`);  // Should be HOT

// Check retrievability
const R = classifier.calculate_retrievability(memory);
console.log(`Retrievability: ${R.toFixed(3)}`);  // Should be ~1.0
```

#### Consolidation Not Finding Patterns

**Symptom**: ABSTRACT phase returns 0 patterns

**Cause**: Not enough episodic memories, or memories too young

**Solution**:
```javascript
// Check episodic memory count
const episodicCount = db.prepare(`
  SELECT COUNT(*) as count FROM memory_index
  WHERE memory_type = 'episodic' AND created_at < datetime('now', '-7 days')
`).get().count;
console.log(`Episodic memories older than 7 days: ${episodicCount}`);

// Lower thresholds for testing
const results = consolidation.run_consolidation({
  dryRun: true,
  minAgeDays: 1,           // Lower from 7
  minOccurrences: 2        // Keep at 2
});
console.log('Patterns found:', results.phases.abstract?.patternCount || 0);

// Check pattern types
if (results.phases.abstract?.patterns) {
  results.phases.abstract.patterns.forEach(p => {
    console.log(`Pattern: ${p.type}, Occurrences: ${p.occurrences}, Strength: ${p.strength}`);
  });
}
```

### Quick Fixes

| Problem              | Quick Fix                                                                              |
| -------------------- | -------------------------------------------------------------------------------------- |
| Decay not working    | Call `apply_fsrs_decay(sessionId)` at turn end                                         |
| Memory leak          | Enable archival: `archival.start_background_job()`                                     |
| Duplicate prevention | Use `gate.evaluate_memory()` before save                                               |
| State always COLD    | Use `activate_memory_with_fsrs()` not `activate_memory()`                              |
| No consolidation     | Lower `minAgeDays` or check episodic count                                             |
| Slow queries         | Create index: `CREATE INDEX idx_memory_state ON memory_index(memory_type, created_at)` |

### Diagnostic Commands

```javascript
// Check cognitive system status
const diagnostics = {
  // Decay status
  decay: {
    sessionMemories: decay.get_active_memories(sessionId),
    config: decay.DECAY_CONFIG
  },

  // State distribution
  states: classifier.get_state_stats(allMemories),

  // Archival status
  archival: archival.get_stats(),

  // Conflict log
  conflicts: gate.get_conflict_stats(),

  // Consolidation readiness
  consolidation: {
    episodic: db.prepare(`SELECT COUNT(*) as c FROM memory_index WHERE memory_type = 'episodic' AND created_at < datetime('now', '-7 days')`).get().c,
    lastRun: consolidation.is_scheduled() ? 'Scheduled' : 'Manual only'
  }
};

console.log(JSON.stringify(diagnostics, null, 2));
```

---

## 7. ❓ FAQ

### General Questions

**Q: Why use FSRS instead of simple exponential decay?**

A: FSRS is validated on 100M+ real human memory data from Anki. Exponential decay (e^(-t/τ)) decays too fast initially and too slow later. FSRS power-law decay `(1 + 0.235×t/S)^(-0.5)` matches how human memory actually works, with a "desirable difficulty" effect where harder recalls strengthen memories more.

---

**Q: What's the difference between attention score and retrievability?**

A: **Retrievability** (R) is the FSRS-calculated probability of recall (0.0 to 1.0). **Attention score** is the session-specific activation level in working_memory. They're related: attention starts at 1.0 on access, then decays toward current retrievability over turns.

---

**Q: Why do constitutional memories never decay?**

A: Constitutional memories are permanent rules and principles (like coding standards, architectural decisions). They should ALWAYS be available, so `decay_rate = 1.0` (100% retention = no decay).

---

### Technical Questions

**Q: How does spreading activation work?**

A: When memory A is accessed:
1. Get `related_memories` array for A
2. For each related memory B:
   - If B is in working_memory: boost by +0.35
   - If B is not in working_memory: add with score 0.35
3. This keeps semantically-related memories active together

---

**Q: What's the difference between PRUNE and ARCHIVED?**

A: **PRUNE** (consolidation phase 4) marks redundant *episodic* memories as `deprecated` after creating a consolidated semantic memory. **ARCHIVED** (archival-manager) marks *any* memory inactive for 90+ days as `is_archived = 1` for lifecycle management. PRUNE is content-driven, ARCHIVED is time-driven.

---

**Q: Can I disable automatic archival?**

A: Yes, set `ARCHIVAL_ENABLED=false` in environment or:
```javascript
archival.stop_background_job();
```
But you'll need to manually manage old memories to prevent database growth.

---

**Q: How do I tune consolidation aggressiveness?**

A: Lower thresholds = more consolidation:
```javascript
consolidation.run_consolidation({
  minAgeDays: 3,          // Down from 7
  minOccurrences: 2,      // Keep at 2 (REQ-022)
  similarityThreshold: 0.60  // Down from 0.75
});
```
Or increase for less consolidation:
```javascript
consolidation.run_consolidation({
  minAgeDays: 14,         // Up from 7
  minOccurrences: 3,      // Up from 2
  similarityThreshold: 0.85  // Up from 0.75
});
```

---

**Q: What happens if I restore from a consolidation backup?**

A: Backups are created before PRUNE phase. To restore:
```javascript
const checkpoints = require('../storage/checkpoints');
checkpoints.init(db);

// List backups
const backups = checkpoints.list('consolidation-backup-');

// Restore (WARNING: overwrites current state)
const restored = checkpoints.restore(backupId);
console.log('Restored from:', restored.name);
```
This will undo the pruning and restore redundant episodic memories.

---

## 8. 🔗 RELATED RESOURCES

### Internal Modules

| Module                                                             | Purpose                                   |
| ------------------------------------------------------------------ | ----------------------------------------- |
| [../search/vector-index.js](../search/vector-index.js)             | Semantic search using voyageai embeddings |
| [../scoring/composite-scoring.js](../scoring/composite-scoring.js) | 5-factor scoring implementation           |
| [../storage/checkpoints.js](../storage/checkpoints.js)             | Backup/restore for consolidation          |
| [../config/memory-types.js](../config/memory-types.js)             | Memory type definitions and half-lives    |

### External Research

| Resource                                                                        | Description                                                   |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [FSRS Paper](https://github.com/open-spaced-repetition/fsrs4anki)               | Free Spaced Repetition Scheduler algorithm                    |
| [Anki Research](https://faqs.ankiweb.net/what-spaced-repetition-algorithm.html) | Spaced repetition validation dataset                          |
| [ACT-R](http://act-r.psy.cmu.edu/)                                              | Adaptive Control of Thought - Rational cognitive architecture |

### Configuration Reference

| Environment Variable       | Default | Purpose                                   |
| -------------------------- | ------- | ----------------------------------------- |
| `HOT_THRESHOLD`            | 0.80    | Retrievability threshold for HOT state    |
| `WARM_THRESHOLD`           | 0.25    | Retrievability threshold for WARM state   |
| `COLD_THRESHOLD`           | 0.05    | Retrievability threshold for COLD state   |
| `ARCHIVED_DAYS_THRESHOLD`  | 90      | Days inactive before archival             |
| `ENABLE_CO_ACTIVATION`     | true    | Enable spreading activation               |
| `ARCHIVAL_ENABLED`         | true    | Enable background archival job            |
| `REPLAY_MIN_AGE_DAYS`      | 7       | Consolidation replay phase threshold      |
| `ABSTRACT_MIN_OCCURRENCES` | 2       | Pattern extraction occurrence requirement |

*Cognitive Subsystem v1.2.0 - Research-Backed Memory Management*
