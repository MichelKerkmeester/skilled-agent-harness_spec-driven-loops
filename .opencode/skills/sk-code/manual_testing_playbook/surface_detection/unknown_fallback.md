---
title: "SD-003: UNKNOWN Surface Fallback"
description: "Verify sk-code asks for runtime/verification disambiguation when the prompt targets an unsupported stack (Go, Swift, React Native, generic Node.js)."
version: 3.5.0.4
---

# SD-003: UNKNOWN Surface Fallback

## 1. OVERVIEW

This scenario verifies that sk-code DOES NOT silently proceed when the prompt targets an unsupported stack. Per AGENTS.md "Multi-Repository Architecture" table, supported stacks are WEBFLOW (vanilla HTML/CSS/JS) and OPENCODE (`.opencode/` system code). Everything else — Go, Swift, React Native, generic React/Next.js, generic Node.js — is UNKNOWN and MUST trigger a disambiguation question.

The disambiguation question MUST ask for:
1. The explicit runtime surface (which stack are you on?).
2. Verification commands appropriate to the stack (how do we know it works?).

## 2. SCENARIO CONTRACT

**Realistic user request**: A backend developer on a Go HTTP server asks the AI to add a request-ID middleware.

**Exact prompt**:
```
Add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.
```

**Expected detection**:
- Surface: `UNKNOWN` (no WEBFLOW or OPENCODE markers; `cmd/api/main.go` is not a recognized marker path; `.go` extension is not in OPENCODE sub-language tables).

**Expected behavior**: sk-code recognizes the absence of supported markers and asks for explicit runtime/verification disambiguation.

**Expected references loaded**:
- `references/stack_detection.md` (always loaded for router decision)
- `references/smart_routing.md`
- `references/universal/code_quality_standards.md` (universal baseline ALWAYS loads)

**Expected NOT loaded**: any `code-webflow/references/*`, any `code-opencode/references/*`, any `code-webflow/assets/*`, any `code-opencode/assets/*`. Only universal-tier resources are permitted.

**Expected agent dispatch**: NONE. sk-code MUST NOT dispatch `@code` for an unsupported stack.

**Desired user-visible outcome**: The AI replies with a disambiguation question along the lines of: "I don't have stack-specific guidance for Go. To proceed safely, please confirm: (1) what is the runtime surface (Go modules, version, framework like chi/echo/gorilla)? (2) what verification commands should I run after the edit (`go test ./...`? `go vet`? a specific lint config)?"

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/sk-code/SKILL.md` is at HEAD-of-main and the "Unsupported / Unknown" row in the Multi-Repository Architecture table is intact.
2. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header." --threshold 0.8 > /tmp/skc-SD003-advisor.txt
   ```
2. **Verify advisor result**: sk-code MAY win (the prompt mentions "middleware" and "HTTP server" which align with code work generally) but SHOULD have a low confidence (closer to 0.50 than 0.90), OR another skill may win. EITHER outcome is acceptable for this scenario — what matters is the sk-code BEHAVIOR after invocation.
3. **Invoke sk-code** with the prompt.
4. **Capture surface decision**: must be `SURFACE: UNKNOWN`.
5. **Capture AI response**: must contain an explicit disambiguation question for runtime + verification commands.
6. **Capture loaded refs**: must NOT include any webflow/* or opencode/* paths.
7. **Persist evidence** to `/tmp/skc-SD003-response.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor returns a result (sk-code may or may not win — both are acceptable). |
| 4 | sk-code emits `SURFACE: UNKNOWN`. |
| 5 | AI response contains both "what runtime" AND "what verification commands" (or semantically equivalent). |
| 6 | No surface-specific refs loaded; only `references/*` and `references/universal/code_quality_standards.md`. |

### Pass/Fail Criteria

- **PASS** iff: surface == UNKNOWN AND AI explicitly asks for runtime AND verification commands AND no surface-specific refs loaded AND no `@code` dispatch.
- **PARTIAL** iff: surface == UNKNOWN AND AI asks for clarification but only partially (e.g. asks for runtime but not verification commands).
- **FAIL** iff: surface != UNKNOWN, OR AI silently proceeds with the edit, OR `@code` is dispatched, OR any surface-specific ref is loaded.

### Failure Triage

1. If sk-code silently proceeds (worst case): re-read SKILL.md "Unsupported / Unknown" row in the Multi-Repository Architecture table. The expected behavior is documented as "Ask for explicit runtime surface and verification commands".
2. If `code-webflow/references/*` is incorrectly loaded: the router is matching some marker. Check whether `motion`, `gsap`, or `lenis` substrings exist in the prompt unintentionally (they don't here, but always verify).
3. If `code-opencode/references/*` is incorrectly loaded: the CWD probably contains `/.opencode/` — but this prompt explicitly targets `cmd/api/main.go` (Go path). Check whether the CWD-based detection is overriding target-path detection (it should not).

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` — Multi-Repository Architecture table with "Unsupported / Unknown" row.
- `.opencode/skills/sk-code/shared/references/stack_detection.md` — Marker definitions (none should match Go).
- `AGENTS.md` (project root) — Multi-Repository Architecture table cross-reference.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: Yes
- **Destructive**: No (the AI MUST NOT edit anything — this scenario tests refusal-to-proceed)
- **Sandbox**: not needed (no fixture file required)
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
