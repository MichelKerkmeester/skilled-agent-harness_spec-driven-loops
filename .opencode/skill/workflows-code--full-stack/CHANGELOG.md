# Changelog - workflows-code--full-stack

All notable changes to the workflows-code--full-stack skill.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**1.0.0**] - 2026-01-26

Initial release of the multi-stack code implementation skill supporting **5 technology stacks** (Go, Node.js, React, React Native, Swift) with intelligent stack detection, task-based resource routing, and stack-specific patterns.

---

### New

1. **Stack detection via marker files** — Automatic detection based on project files:
   - `go.mod` → Go (backend)
   - `package.json` with "express" → Node.js (backend)
   - `next.config.js` or `package.json` with "react" → React (frontend)
   - `app.json` with "expo" → React Native (mobile)
   - `Package.swift` → Swift (mobile)

2. **Hierarchical resource structure** — Organized by category and stack:
   - `references/{category}/{stack}/` — Standards and documentation
   - `assets/{category}/{stack}/checklists/` — Quality gate checklists
   - `assets/{category}/{stack}/patterns/` — Code patterns and examples

3. **Smart resource routing** — Python pseudocode router in SKILL.md:
   - `STACK_MARKERS` — Marker file detection
   - `STACK_FOLDERS` — Maps stacks to `(category, stack)` tuples
   - `TASK_KEYWORDS` — 7 task categories (VERIFICATION, DEBUGGING, TESTING, DATABASE, API, DEPLOYMENT, IMPLEMENTATION)
   - `LOAD_LEVELS` — 4 levels (MINIMAL, DEBUGGING, FOCUSED, STANDARD)
   - `classify_task()` — Returns task type from user request keywords
   - `route_resources()` — Dynamic resource discovery based on stack + task + load level

4. **3-Phase lifecycle** — Mandatory workflow:
   - Phase 1: Implementation (stack-specific patterns)
   - Phase 2: Testing/Debugging (stack-specific commands)
   - Phase 3: Verification (stack-appropriate checks)

5. **Stack-specific verification commands**:
   - Go: `go test ./...` → `golangci-lint run` → `go build ./...`
   - Node.js: `npm test` → `npm run lint` → `npm run build`
   - React: `npm test` → `npm run lint` → `npm run build`
   - React Native: `npm test` → `npx eslint .` → `npx expo export`
   - Swift: `swift test` → `swiftlint` → `swift build`

6. **References (36 files)** — Standards and patterns across all stacks:
   - `references/backend/go/` — 12 Go standards and patterns
   - `references/backend/nodejs/` — 4 Node.js standards
   - `references/frontend/react/` — 7 React/Next.js standards
   - `references/mobile/react-native/` — 7 React Native standards
   - `references/mobile/swift/` — 6 Swift standards

7. **Assets (42 files)** — Checklists and code pattern examples:
   - 15 checklist files (3 per stack: code quality, debugging, verification)
   - 27 pattern files (TypeScript, Go, Swift code examples)

8. **Documentation standards** — All files follow workflows-documentation conventions: emoji headers on H2 sections (77 headers across React references), consistent divider format in code files, YAML frontmatter with title/description

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
