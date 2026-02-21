---
description: "Core development lifecycle: Implementation, Testing/Debugging, and Verification phases"
---
# How It Works

Describes the universal development lifecycle that all stacks follow through three phases.

## Development Lifecycle

All stacks follow the same execution flow:

```
Implementation -> Testing/Debugging (if issues) -> Verification (MANDATORY)
```

## Phase 1: Implementation (Stack-Specific)

Implementation patterns are loaded from `references/{category}/{stack}/` based on detected stack.

| Stack         | Key Patterns                                               | Naming                                      |
| ------------- | ---------------------------------------------------------- | ------------------------------------------- |
| Go            | Domain layers, DI, repository patterns, table-driven tests | `snake_case` files, `PascalCase` exports    |
| Node.js       | Service layering, async flow, middleware composition       | `camelCase` for symbols                     |
| React/Next.js | Component architecture, state boundaries, data fetching    | `kebab-case` files, `PascalCase` components |
| React Native  | Hooks extraction, navigation flow, responsive behavior     | `kebab-case` files, `PascalCase` components |
| Swift         | MVVM separation, SwiftUI composition, async handling       | `PascalCase` types, `camelCase` members     |

## Phase 2: Testing/Debugging

**Systematic debugging workflow:**

1. **Root Cause Investigation**
   - Read full error output
   - Reproduce consistently
   - Check recent changes (`git diff`)
   - Trace symptom to source

2. **Pattern Analysis**
   - Compare against known good patterns in stack references
   - Identify mismatches in architecture, types, or flow

3. **Hypothesis and Testing**
   - Form a single hypothesis
   - Apply one change at a time
   - Re-test after each change

4. **Implementation**
   - Apply root-cause fix
   - Re-run stack checks

**Stack-specific testing commands:**

| Stack         | Test Command    | Coverage             | Lint                |
| ------------- | --------------- | -------------------- | ------------------- |
| Go            | `go test ./...` | `go test -cover`     | `golangci-lint run` |
| Node.js       | `npm test`      | Jest/Vitest coverage | `npx eslint .`      |
| React/Next.js | `npm test`      | Jest/Vitest coverage | `npx eslint .`      |
| React Native  | `npm test`      | Jest coverage        | `npx eslint .`      |
| Swift         | `swift test`    | Xcode coverage       | `swiftlint`         |

## Phase 3: Verification (MANDATORY)

**The gate function before completion claims:**

1. **IDENTIFY** what command proves the claim
2. **RUN** stack-specific test/lint/build commands
3. **VERIFY** outputs are clean
4. **RECORD** exactly what was verified
5. **ONLY THEN** claim completion

**Stack-specific verification commands:**

| Stack         | Test            | Lint                | Build             |
| ------------- | --------------- | ------------------- | ----------------- |
| Go            | `go test ./...` | `golangci-lint run` | `go build ./...`  |
| Node.js       | `npm test`      | `npx eslint .`      | `npm run build`   |
| React/Next.js | `npm test`      | `npx eslint .`      | `npm run build`   |
| React Native  | `npm test`      | `npx eslint .`      | `npx expo export` |
| Swift         | `swift test`    | `swiftlint`         | `swift build`     |

## Cross References
- [[when-to-use]] - Phase overview and activation triggers
- [[smart-routing]] - Stack detection and resource routing
- [[rules]] - ALWAYS/NEVER/ESCALATE per phase
- [[success-criteria]] - Quality gates per phase