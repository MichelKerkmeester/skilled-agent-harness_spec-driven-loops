# Archive System

The archive system manages completed milestones and quick tasks, extracting learnings and maintaining a searchable history.

## Features

- **Milestone Archiving**: Move completed milestones to archive with retrospectives
- **Learnings Extraction**: Automatically extract patterns, decisions, and gotchas
- **Quick Task History**: Track quick mode tasks with summaries
- **Archive Index**: Maintain a searchable index of all archived work

## Directory Structure

```
.goopspec/
├── milestones/          # Active milestones
│   └── v1.0-feature/
│       ├── SPEC.md
│       └── CHRONICLE.md
├── quick/               # Quick task history
│   └── 001-task-name/
│       └── SUMMARY.md
└── archive/             # Completed milestones
    ├── v0.9-setup/
    │   ├── SPEC.md
    │   ├── CHRONICLE.md
    │   ├── RETROSPECTIVE.md
    │   └── LEARNINGS.md
    └── index.md         # Archive index
```

## Usage

### Archive a Milestone

```typescript
import { createArchiveManager } from "./features/archive";

const manager = createArchiveManager("/path/to/project");

// Archive with custom retrospective
const entry = await manager.archiveMilestone(
  "v1.0-feature",
  `# Retrospective

## What Went Well
- TDD approach worked great
- Atomic commits helped debugging

## Challenges
- Type errors in third-party library
- Authentication flow complexity

## Key Decisions
- Chose PostgreSQL for better JSON support
- Used TypeScript for type safety
`
);

console.log("Archived:", entry.id);
console.log("Learnings:", entry.learningsPath);
```

### Archive a Quick Task

```typescript
const taskPath = await manager.archiveQuickTask(
  "fix-login-bug",
  "Fixed null pointer exception in login flow by adding proper validation"
);

console.log("Task archived:", taskPath);
// Output: .goopspec/quick/001-fix-login-bug
```

### List Archived Milestones

```typescript
const archived = manager.listArchived();

for (const entry of archived) {
  console.log(`${entry.name} - Archived: ${entry.archivedAt}`);
}
```

### Get Specific Archive

```typescript
const entry = manager.getArchivedMilestone("v1.0-feature");

if (entry) {
  console.log("Retrospective:", entry.retrospectivePath);
  console.log("Learnings:", entry.learningsPath);
}
```

### Generate Archive Index

```typescript
const index = manager.generateArchiveIndex();
console.log(index);
```

## Learnings Extraction

The system automatically extracts learnings from milestone documents:

### Patterns
Extracted from retrospective using keywords:
- "pattern", "approach", "worked well", "success"

### Decisions
Extracted from SPEC and retrospective using keywords:
- "decision", "chose", "selected", "using"

### Gotchas
Extracted from retrospective using keywords:
- "gotcha", "issue", "problem", "challenge", "tripped", "struggled"

### Metrics
Automatically calculated from CHRONICLE:
- Task count (number of completed tasks)
- Wave count (number of execution waves)
- Duration (days from start to completion)

## Integration with Memory System

When archiving a milestone, the learnings should be saved to the memory system for future reference:

```typescript
import { createArchiveManager } from "./features/archive";
import { MemoryClient } from "./features/memory";

const archiveManager = createArchiveManager(projectDir);
const memoryClient = new MemoryClient(projectDir);

// Archive milestone
const entry = await archiveManager.archiveMilestone("v1.0-feature", retrospective);

// Read learnings
const learningsContent = readFileSync(entry.learningsPath, "utf-8");

// Save to memory for future retrieval
await memoryClient.save({
  title: `Learnings from ${entry.name}`,
  content: learningsContent,
  type: "observation",
  importance: 8,
  concepts: ["learnings", "milestone", entry.name],
  sourceFiles: [entry.learningsPath],
});
```

## Retrospective Template

When no retrospective is provided, a template is generated:

```markdown
# Retrospective: {milestone-id}

**Completed:** {timestamp}

## What Went Well

- [Add what worked well]

## What Could Be Improved

- [Add areas for improvement]

## Key Decisions

- [Add important decisions made]

## Challenges Faced

- [Add challenges and how they were resolved]

## Learnings for Next Time

- [Add learnings to apply in future phases]
```

## Best Practices

1. **Write detailed retrospectives**: The more detail you provide, the better the learnings extraction
2. **Use consistent keywords**: Use "Pattern:", "Decision:", "Gotcha:" for better extraction
3. **Archive regularly**: Don't let completed milestones pile up
4. **Review learnings**: Periodically review archived learnings to improve future work
5. **Save to memory**: Always save learnings to the memory system for cross-session retrieval

## API Reference

### ArchiveManager

```typescript
interface ArchiveManager {
  // Archive a completed milestone
  archiveMilestone(milestoneId: string, retrospective: string): Promise<ArchiveEntry>;
  
  // Archive a quick task
  archiveQuickTask(taskName: string, summary: string): Promise<string>;
  
  // List all archived milestones
  listArchived(): ArchiveEntry[];
  
  // Get specific archived milestone
  getArchivedMilestone(id: string): ArchiveEntry | null;
  
  // Generate archive index
  generateArchiveIndex(): string;
}
```

### ArchiveEntry

```typescript
interface ArchiveEntry {
  id: string;                    // Milestone ID
  name: string;                  // Display name
  archivedAt: string;            // ISO timestamp
  retrospectivePath: string;     // Path to RETROSPECTIVE.md
  learningsPath: string;         // Path to LEARNINGS.md
}
```

### ExtractedLearning

```typescript
interface ExtractedLearning {
  patterns: string[];            // What worked well
  decisions: string[];           // Key choices made
  gotchas: string[];            // Challenges faced
  metrics: {
    taskCount: number;           // Number of tasks
    waveCount: number;           // Number of waves
    durationDays: number;        // Days from start to finish
  };
}
```
