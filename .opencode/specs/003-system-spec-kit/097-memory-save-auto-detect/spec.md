# Spec: 097 — Memory Save Auto-Detect Spec Folder

## Overview
Prevent the AI agent from asking "Which spec folder should the context be saved to?" when the answer is already known from Gate 3.

## Problem Statement
When saving memory context at end of session, the AI agent asks the user to specify the spec folder — even though Gate 3 already established it earlier in the conversation. The MEMORY SAVE RULE in AGENTS.md instructs "If NO folder argument → HARD BLOCK → Ask user", which doesn't account for the Gate 3 answer being available.

## Scope
- **In scope:** Fix AGENTS.md MEMORY SAVE RULE; add session learning DB fallback to folder-detector.ts
- **Out of scope:** MCP server active session state, new MCP tools

## Files Modified
| File | Changes |
|---|---|
| `AGENTS.md` | Update MEMORY SAVE RULE to reuse Gate 3 spec folder |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Add Priority 2.5: session_learning DB lookup |

## Success Criteria
- [x] AGENTS.md MEMORY SAVE RULE includes Gate 3 reuse step — Lines 214-219 updated with Priority 0 step
- [x] folder-detector.ts has session_learning fallback before interactive prompt — Priority 2.5 at lines 138-163
- [x] TypeScript compiles with 0 errors — Clean compile confirmed
- [x] generate-context.js auto-detects spec folder from session_learning when no arg provided — Verified with test record; positive case returns correct path, negative cases (missing folder, empty table) fall through silently
