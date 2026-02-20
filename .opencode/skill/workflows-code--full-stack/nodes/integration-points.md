---
description: "Knowledge base structure, naming conventions, tool usage, external resources, and related skills"
---
# Integration Points

Covers bundled knowledge layout, naming conventions, tooling, external documentation, and related skills.

## Knowledge Base Integration (Bundled)

All stack knowledge is bundled directly in this skill:

```
workflows-code--full-stack/
├── references/
│   ├── backend/go/
│   ├── backend/nodejs/
│   ├── frontend/react/
│   └── mobile/{react-native,swift}/
├── assets/
│   └── {category}/{stack}/{checklists,patterns}/
└── SKILL.md
```

## Stack Resource Paths

| Stack Domain        | Reference Paths                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Backend Go          | `references/backend/go/`                                                                          |
| Backend Node.js     | `references/backend/nodejs/`                                                                      |
| Frontend React      | `references/frontend/react/` (`api_patterns.md`, `component_architecture.md`, `data_fetching.md`) |
| Mobile React Native | `references/mobile/react-native/`                                                                 |
| Mobile Swift        | `references/mobile/swift/`                                                                        |

## Naming Conventions (Stack-Specific)

| Stack         | Files        | Variables   | Functions/Types         |
| ------------- | ------------ | ----------- | ----------------------- |
| Go            | `snake_case` | `camelCase` | `PascalCase` exports    |
| Node.js       | `kebab-case` | `camelCase` | `camelCase`             |
| React/Next.js | `kebab-case` | `camelCase` | `PascalCase` components |
| React Native  | `kebab-case` | `camelCase` | `PascalCase` components |
| Swift         | `PascalCase` | `camelCase` | `PascalCase` types      |

## Tool Usage Guidelines

- `Bash`: run stack CLI, test/lint/build commands
- `Read`: inspect source and references
- `Grep`: locate patterns and symbols
- `Glob`: discover files and stack markers

## External Tools

- Go: `go`, `golangci-lint`
- Node.js/React: `npm`, `npx eslint`
- React Native: `expo`, `npm`
- Swift: `swift`, `swiftlint`

## Official Documentation

| Stack        | Documentation                                               |
| ------------ | ----------------------------------------------------------- |
| Go           | [go.dev/doc](https://go.dev/doc/)                           |
| Node.js      | [nodejs.org/docs](https://nodejs.org/en/docs/)              |
| React        | [react.dev](https://react.dev/)                             |
| Next.js      | [nextjs.org/docs](https://nextjs.org/docs)                  |
| React Native | [reactnative.dev](https://reactnative.dev/)                 |
| Expo         | [docs.expo.dev](https://docs.expo.dev/)                     |
| Swift        | [swift.org/documentation](https://swift.org/documentation/) |

## Testing Frameworks

| Stack        | Frameworks      | Documentation                                                           |
| ------------ | --------------- | ----------------------------------------------------------------------- |
| Go           | testing/testify | [pkg.go.dev/testing](https://pkg.go.dev/testing)                        |
| Node.js      | Jest/Vitest     | [jestjs.io](https://jestjs.io/)                                         |
| React        | RTL/Jest/Vitest | [testing-library.com](https://testing-library.com/)                     |
| React Native | Jest/Detox      | [jestjs.io](https://jestjs.io/)                                         |
| Swift        | XCTest          | [developer.apple.com](https://developer.apple.com/documentation/xctest) |

## Related Skills

| Skill                         | Use For                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| **workflows-documentation**   | Documentation quality, skill creation, markdown validation  |
| **workflows-git**             | Git workflows, commit hygiene, PR creation                  |
| **system-spec-kit**           | Spec folder management, memory system, context preservation |
| **mcp-code-mode**             | Token-efficient MCP orchestration and tool chaining         |
| **mcp-figma**                 | Figma file/component access and design extraction workflows |
| **workflows-chrome-devtools** | Browser debugging, screenshots, console access              |

## Navigation Guide

**For Implementation Tasks:**
1. Confirm applicability in [[when-to-use]]
2. Detect stack from markers in [[smart-routing]]
3. Load `references/{category}/{stack}/` patterns
4. Follow Phase 1 workflow from [[how-it-works]]

**For Debugging Tasks:**
1. Load `assets/{category}/{stack}/checklists/debugging_checklist.md`
2. Load stack testing references (for example `testing_strategy.md`)
3. Follow systematic debugging flow

**For Verification Tasks:**
1. Load `assets/{category}/{stack}/checklists/verification_checklist.md`
2. Run stack verification commands
3. Claim completion only with command evidence

## Cross References
- [[how-it-works]] - Development lifecycle and phase details
- [[smart-routing]] - Resource routing and stack detection
- [[success-criteria]] - Quality gates and verification checklist