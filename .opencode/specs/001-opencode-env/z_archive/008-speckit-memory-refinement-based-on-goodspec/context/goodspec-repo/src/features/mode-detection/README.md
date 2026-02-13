# Task Mode Detection

Analyzes user requests to suggest appropriate task modes for GoopSpec workflows.

## Task Modes

- **quick**: Small fixes, single file changes, typos
- **standard**: Normal feature development, components, API endpoints
- **comprehensive**: Large-scale refactors, system changes, migrations
- **milestone**: Release-oriented work, MVPs, multi-phase projects

## Usage

```typescript
import { detectTaskMode, shouldPromptForMode } from "./features/mode-detection";

// Detect mode from user request
const result = detectTaskMode("Fix typo in README");

console.log(result);
// {
//   suggestedMode: "quick",
//   confidence: 0.85,
//   signals: [
//     "Short request (4 words) suggests quick fix",
//     "Quick fix keywords",
//     "Trivial changes"
//   ],
//   alternatives: []
// }

// Check if we should prompt user to confirm
if (shouldPromptForMode(result)) {
  // Low confidence or multiple alternatives - ask user
  console.log(`Suggested: ${result.suggestedMode}`);
  console.log(`Alternatives: ${result.alternatives.join(", ")}`);
} else {
  // High confidence - proceed with suggested mode
  console.log(`Using mode: ${result.suggestedMode}`);
}
```

## Detection Algorithm

1. **Word Count Heuristics**: Shorter requests → quick, longer → comprehensive
2. **Pattern Matching**: Keywords and phrases that indicate mode
3. **Weighted Scoring**: Each signal contributes to mode scores
4. **Confidence Calculation**: Based on top score and margin from alternatives

## Examples

### Quick Mode
```typescript
detectTaskMode("Fix typo in README");
// → quick (high confidence)

detectTaskMode("Update single file with new import");
// → quick (high confidence)
```

### Standard Mode
```typescript
detectTaskMode("Add new user profile component");
// → standard (high confidence)

detectTaskMode("Create API endpoint for authentication");
// → standard (high confidence)
```

### Comprehensive Mode
```typescript
detectTaskMode("Refactor entire auth system across all endpoints");
// → comprehensive (high confidence)

detectTaskMode("Migrate codebase from JavaScript to TypeScript");
// → comprehensive (high confidence)
```

### Milestone Mode
```typescript
detectTaskMode("Build MVP with auth, profiles, and dashboard for beta launch");
// → milestone (high confidence)

detectTaskMode("Plan v2.0 release with multiple phases");
// → milestone (high confidence)
```

## Configuration

```typescript
const result = detectTaskMode(userRequest, {
  defaultMode: "standard",      // Fallback if detection fails
  confidenceThreshold: 0.6,     // Below this, consider ambiguous
});
```

## Confidence Levels

- **0.8 - 1.0**: Very confident - proceed automatically
- **0.6 - 0.8**: Confident - may want to confirm
- **0.4 - 0.6**: Uncertain - should prompt user
- **0.0 - 0.4**: Very uncertain - definitely prompt user

## Extending Heuristics

Add new signals in `heuristics.ts`:

```typescript
export const CUSTOM_SIGNALS: HeuristicSignal[] = [
  {
    pattern: /\b(your|custom|keywords)\b/i,
    mode: "standard",
    weight: 0.7,
    description: "Custom signal description",
  },
];
```

## Testing

```bash
bun test src/features/mode-detection/detector.test.ts
```
