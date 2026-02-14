---
title: "workflows-code--full-stack"
description: "Stack-agnostic development orchestrator guiding developers through implementation, debugging, and verification phases with automatic stack detection via marker files"
trigger_phrases:
  - "full stack development workflow"
  - "multi-stack code orchestrator"
  - "stack detection marker files"
importance_tier: "normal"
---

# workflows-code--full-stack

> Stack-agnostic development orchestrator guiding developers through implementation, debugging, and verification phases with automatic stack detection via marker files.

---

#### TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [🚀 QUICK START](#2--quick-start)
3. [📁 STRUCTURE](#3--structure)
4. [⚡ FEATURES](#4--features)
5. [⚙️ CONFIGURATION](#5--configuration)
6. [💡 EXAMPLES](#6--examples)
7. [🛠️ TROUBLESHOOTING](#7--troubleshooting)
8. [📚 RELATED](#8--related)

---

## 1. 📖 OVERVIEW

<!-- ANCHOR:overview -->

This skill provides a unified development workflow for any technology stack: **Go**, **Node.js**, **React/Next.js**, **React Native/Expo**, and **Swift**. It automatically detects the active stack via marker files (`go.mod`, `Package.swift`, `app.json`, `package.json`, `next.config.js`) and loads the appropriate standards, checklists, and code patterns.

The core lifecycle is **Implementation -> Debugging (if needed) -> Verification (MANDATORY)**. Every completion claim must be backed by running the stack-specific test, lint, and build commands. This enforces "The Iron Law": no claiming "done" without verification evidence.

The skill uses intelligent task classification (keywords like "implement", "debug", "verify") to load only the resources needed for the current phase, keeping context lean. It integrates with the OpenCode framework via Gate 2 skill routing and Spec Kit Memory for context preservation.

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START

<!-- ANCHOR:quick-start -->

1. **Activation** -- The skill is invoked automatically via Gate 2 (`skill_advisor.py`) when code-related tasks are detected.
2. **Stack detection** -- Marker files in the project root determine which stack resources load.
3. **Work through phases**:
   - **Phase 1**: Implement following stack-specific standards from `references/`
   - **Phase 2**: Debug systematically (one change at a time, trace root cause)
   - **Phase 3**: Run verification commands before claiming completion

```bash
# Example: Go project verification
go test ./... && golangci-lint run && go build ./...

# Example: React project verification
npm test && npx eslint . && npm run build
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE

<!-- ANCHOR:structure -->

```
workflows-code--full-stack/
├── SKILL.md                          # Entry point with routing logic
├── README.md
├── references/
│   ├── backend/
│   │   ├── go/                       # go_standards, api_design, database_patterns, ...
│   │   └── nodejs/                   # nodejs_standards, express_patterns, async_patterns, ...
│   ├── frontend/
│   │   └── react/                    # react_nextjs_standards, state_management, data_fetching, ...
│   └── mobile/
│       ├── react-native/             # react-native-standards, navigation, performance, ...
│       └── swift/                    # swift_standards, swiftui_patterns, mvvm, async, ...
└── assets/
    ├── backend/
    │   ├── go/checklists/ + patterns/
    │   └── nodejs/checklists/ + patterns/
    ├── frontend/
    │   └── react/checklists/ + patterns/
    └── mobile/
        ├── react-native/checklists/ + patterns/
        └── swift/checklists/ + patterns/
```

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES

<!-- ANCHOR:features -->

- **Automatic stack detection** via marker files (`go.mod`, `Package.swift`, `app.json`, `package.json`)
- **3-phase lifecycle**: Implementation, Debugging, Verification (mandatory)
- **Smart resource loading** with 4 load levels: MINIMAL, DEBUGGING, FOCUSED, STANDARD
- **Task classification** routing (verification, debugging, testing, database, API, deployment, implementation)
- **Per-stack checklists**: code quality (P0/P1 items), debugging, and verification
- **Bundled code patterns**: `.go`, `.ts`, `.tsx`, `.swift` templates for each stack
- **Stack-specific rules**: Go context/error handling, Swift optionals, React hooks, Node.js async

<!-- /ANCHOR:features -->

---

## 5. ⚙️ CONFIGURATION

<!-- ANCHOR:configuration -->

| Setting            | Description                                   | Default         |
| ------------------ | --------------------------------------------- | --------------- |
| Stack detection    | First matching marker file wins               | Auto-detected   |
| Load level         | Determined by task classification keywords     | STANDARD        |
| P0 gate            | Any failing P0 checklist item blocks completion | Enabled (hard)  |
| Verification       | Must run test + lint + build before "done"     | Mandatory       |

**Stack detection order** (first match wins):
1. `go.mod` -> Go
2. `Package.swift` -> Swift
3. `app.json` with "expo" -> React Native
4. `package.json` with "react-native" -> React Native
5. `next.config.js` / `next.config.mjs` -> React
6. `package.json` with "react" -> React
7. `package.json` with "express" or "fastify" -> Node.js

**Adding a new stack**: Create `references/{category}/{stack}/` and `assets/{category}/{stack}/` directories, add detection logic to SKILL.md Section 2, and update `STACK_FOLDERS`.

<!-- /ANCHOR:configuration -->

---

## 6. 💡 EXAMPLES

<!-- ANCHOR:examples -->

**Implementing a Go API endpoint:**
```
Detect: go.mod found -> STACK=GO
Load:   references/backend/go/go_standards.md, api_design.md
        assets/backend/go/checklists/code_quality_checklist.md
        assets/backend/go/patterns/api_patterns.go
Verify: go test ./... -> golangci-lint run -> go build ./...
```

**Debugging a React component:**
```
Detect: package.json with "react" -> STACK=REACT
Load:   assets/frontend/react/checklists/debugging_checklist.md
        references/frontend/react/testing_strategy.md
Fix:    One change at a time, trace root cause
Verify: npm test -> npx eslint . -> npm run build
```

**Verifying a Swift feature:**
```
Detect: Package.swift found -> STACK=SWIFT
Load:   assets/mobile/swift/checklists/verification_checklist.md
Verify: swift test -> swiftlint -> swift build
```

<!-- /ANCHOR:examples -->

---

## 7. 🛠️ TROUBLESHOOTING

<!-- ANCHOR:troubleshooting -->

| Issue                        | Cause                                          | Fix                                              |
| ---------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| Wrong stack detected         | Multiple marker files present                  | First match wins; reorder or remove extra markers |
| P0 gate blocking completion  | Failing code quality checklist item            | Fix the P0 item or escalate if blocked            |
| Resources not loading        | Stack folder path mismatch                     | Verify `references/{category}/{stack}/` exists    |
| Tests pass but build fails   | Lint or type errors not caught by tests         | Run full verification chain: test + lint + build  |
| 3+ debug attempts failing    | Wrong hypothesis or symptom-fixing              | Escalate via `/spec_kit:debug` for fresh analysis |

<!-- /ANCHOR:troubleshooting -->

---

## 8. 📚 RELATED

<!-- ANCHOR:related -->

| Resource                         | Relationship                                    |
| -------------------------------- | ----------------------------------------------- |
| `workflows-code--web-dev`        | Single-stack variant for Webflow/vanilla JS     |
| `workflows-documentation`        | Documentation creation and skill authoring      |
| `workflows-git`                  | Git commit hygiene and branch workflows         |
| `workflows-chrome-devtools`      | Browser debugging (CLI-first via bdg)           |
| `system-spec-kit`                | Spec folder management and memory persistence   |

<!-- /ANCHOR:related -->
