---
title: Universal Code Quality Standards
description: Stack-agnostic P0/P1/P2 severity model for the Phase 1.5 Code Quality Gate.
trigger_phrases:
  - "universal code quality standards"
  - "p0 p1 p2 severity tiers"
  - "code quality gate severity"
  - "stack agnostic quality contract"
importance_tier: important
contextType: implementation
version: 3.5.0.10
---

# Universal Code Quality Standards

Surface-agnostic severity tiers used by the Phase 1.5 Code Quality Gate across WEBFLOW and OPENCODE.

---

## 1. OVERVIEW

### Purpose

Defines the severity contract that wraps every surface code quality checklist in `sk-code`. P0 blocks completion; P1 requires explicit deferral approval; P2 is tracked but non-blocking. Surface rules (snake_case for WEBFLOW JS, OPENCODE TypeScript/Python/Shell/Config standards) live in each surface's checklist; this doc captures the universal contract those checklists implement.

### Core Principle

Severity tiers exist so reviewers and authors agree on what blocks "done". A rule's severity is a stable contract: the bar doesn't move per-PR, per-author, or per-deadline.

### When to Use

- Before claiming Phase 1 (Implementation) complete — the Phase 1.5 Code Quality Gate.
- When authoring or reviewing surface quality checklists.
- When deciding whether a finding blocks merge or can ship as a follow-up.
- When `sk-code-review` produces severity-ranked findings — the contract here aligns those tiers.

### Key Sources

- Surface checklists: `assets/webflow/checklists/code_quality_checklist.md` and `assets/opencode/checklists/`.
- Findings-first review baseline: `sk-code-review` skill (severity model and review output contract).

### Design Restraint Ladder (pre-write)

Before writing NEW code for an implementation task, stop at the first rung that holds. This runs AFTER surface + intent routing, so the rung vocabulary matches the detected surface, and it is a POST-READ reflex — rungs 2-4 require reading what already exists, which reinforces read-first.

1. **Does this need to exist at all? (YAGNI)** — if the requirement looks unnecessary, surface a scope-amendment recommendation in the same response; NEVER silently cut scope (SCOPE-LOCK / Logic-Sync HALT still apply).
2. **Standard library / language built-in?**
3. **Native platform or runtime feature?** — surface-flavored: CSS-over-JS or a DB/HTML constraint for WEBFLOW; a stdlib/native API for OPENCODE.
4. **An already-installed dependency?** — never add a new dependency for what a few lines do.
5. **Can it be one line?**
6. **Only then: the minimum code that works.**

The ladder consumes the detected surface; it does NOT change surface precedence (OPENCODE > WEBFLOW > UNKNOWN) or the Iron Law (Phase 3 verification is still required). For the over-engineering, gold-plating, and scope-creep detectors, see the repo `CLAUDE.md` "ANTI-PATTERNS" table.

---

## 2. SEVERITY TIERS

The Code Quality Gate categorizes every quality rule into one of three tiers:

| Tier   | Handling      | Completion Impact                              |
| ------ | ------------- | ---------------------------------------------- |
| **P0** | HARD BLOCKER  | Cannot claim done until fixed                  |
| **P1** | Required      | Must fix OR get user approval to defer         |
| **P2** | Optional      | Can defer with documented reason; non-blocking |

**Gate rule**: if ANY P0 item fails, completion is BLOCKED until fixed. P1 violations need explicit deferral approval. P2 violations are tracked but don't block.

---

## 3. P0 CATEGORIES (universal — apply across stacks)

P0 covers issues that have caused production incidents or reviewer-author confusion in the past:

1. **Initialization safety** — components must guard against double-initialization, race conditions, and partial loads.
2. **Input validation** — all external inputs (function parameters, API responses, file contents, env vars) validated at boundaries.
3. **No commented-out code** — delete it; commented code rots and confuses readers.
4. **No silent failures** — exceptions either surface to the caller or are logged with enough context to debug.
5. **Naming convention adherence** — surface-specific (snake_case for WEBFLOW JS, camelCase for OPENCODE TypeScript, snake_case for OPENCODE Python/Shell, etc.).
6. **No hardcoded secrets** — credentials, API keys, tokens never inline; always env vars or secret stores.
7. **No ephemeral-artifact pointers in comments** — comments must not name a spec folder/number, packet/phase/task/checklist/requirement id (`T###`, `CHK-###`, `REQ-###`), feature-catalog entry, ADR id, or ticket id; these get renamed or archived and rot into dangling pointers. Keep the durable WHY. See `code_style_guide.md` §4 "No ephemeral-artifact pointers" for the allowed-vs-forbidden contract.

---

## 4. P1 CATEGORIES (universal)

P1 covers issues that degrade maintainability or reliability:

1. **Documentation completeness** — public APIs, exported types, complex algorithms have docstrings or comments explaining WHY.
2. **Test coverage at boundaries** — happy path plus at least one edge case per public surface.
3. **Error message quality** — every error includes enough context for the operator to act.
4. **Resource cleanup** — file handles, network connections, subscriptions, observers, timers all closed or canceled deterministically.
5. **Type-safety enforcement** — language-appropriate (TypeScript strict mode, no `any`/`Any`, type hints on public functions).

---

## 5. P2 CATEGORIES (universal)

P2 covers issues that improve quality but don't affect correctness or maintainability:

1. **Idiomatic refinements** — code follows community style guides and project conventions.
2. **Performance polish** — optimization beyond meeting NFR targets.
3. **Test coverage beyond boundaries** — additional edge cases, fuzz tests, property tests.
4. **Documentation completeness for internal helpers** — even private functions get explained.

---

## 6. SURFACE-SPECIFIC CHECKLISTS

Each surface has quality checklists that add surface-specific rules to these universal tiers:

| Surface  | Checklist                                          | Notes                                                                |
| -------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| WEBFLOW  | `assets/webflow/checklists/code_quality_checklist.md` | LIVE — JS sections (snake_case, file headers, CDN-safe init); CSS sections (semantic prefixes, BEM, GPU-only animation, `i` flag on data-attribute selectors) |
| OPENCODE | `assets/opencode/checklists/`                     | LIVE — JavaScript/CommonJS, TypeScript, Python, Shell, JSON/JSONC, and shared rules |
| UNKNOWN  | n/a                                                | sk-code does not own Go, React/Next.js, generic Node.js, React Native, or Swift; surface a disambiguation prompt |

The surface checklist assigns specific severity (P0/P1/P2) to specific rules. This universal doc is the contract and the surface checklists are the implementations.

---

## 7. WORKFLOW

When you reach Phase 1.5 Code Quality Gate:

1. Identify the file type and code surface (the smart router does this; or check via the surface-detection block in SKILL.md §2).
2. Run the comment-hygiene checker on each modified file before committing:
   ```bash
   .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>
   ```
   Zero violations required. To suppress a specific line that is a known false-positive, append `// hygiene-ok` to that line.

   The same check is enforced automatically at three gates — manual invocation here is early feedback, not the only safety net:
   - **Write-time** (Claude Code only): `claude-posttooluse.sh` fires on every Write/Edit tool call and warns inline before the next AI turn
   - **Commit-time**: `.opencode/hooks/pre-commit` blocks any commit with violations; bypass with `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`
   - **CI**: `.github/workflows/comment-hygiene.yml` re-validates on every PR to main; cannot be bypassed with `--no-verify`

3. Load the matching surface checklist (see §6).
4. Validate every P0 item — fix any failures before proceeding.
5. Validate every P1 item — fix or document approved deferral.
6. Validate every P2 item — track for follow-up; non-blocking.
7. Mark checklist items `[x]` with evidence (the actual code passing the rule, or the test that proves it).
8. Then proceed to Phase 2 (Debugging) if issues, or Phase 3 (Verification).

---

## 8. RELATIONSHIP TO `sk-code-review`

This skill (`sk-code`) produces **surface compliance evidence** at Phase 1.5. The formal **findings-first review output** (severity-ranked findings list, security/correctness/test minimums, risk reporting) belongs to `sk-code-review`.

Use `sk-code-review` when:

- A PR needs a structured review report.
- Stakeholders need a severity-ranked findings list.
- Security or correctness minimums need to be audited.

Use this skill (`sk-code`) when:

- You are the author validating your own implementation against the quality bar before claiming done.
- You need surface-specific quality rules applied during development.

The two skills compose: `sk-code` surface evidence + `sk-code-review` baseline = full quality story.

---

## 9. RELATED RESOURCES

- `references/universal/code_style_guide.md` - language-agnostic naming, formatting, and structure principles.
- `references/universal/error_recovery.md` - decision tree when a quality gate failure can't be resolved in-place.
- `assets/universal/checklists/debugging_checklist.md` - applies after Phase 1.5 fails and you need root-cause analysis.
- `assets/universal/checklists/verification_checklist.md` - runs after Phase 1.5 clears, before any "done" claim.
- `references/phase_detection.md` - Phase 1.5 position in the sk-code lifecycle.
- Surface quality checklists under `assets/webflow/checklists/` and `assets/opencode/checklists/`.
