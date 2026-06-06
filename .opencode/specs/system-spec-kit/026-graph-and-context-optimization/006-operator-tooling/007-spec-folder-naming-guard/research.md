---
title: "Feature Research: Spec-Folder Naming-Convention Guard - Cross-Runtime Feasibility [template:research.md]"
description: "Feasibility study and recommended design for a cross-runtime guard preventing badly-named or mis-located spec folders at creation time. Verdict: PARTIAL."
trigger_phrases:
  - "naming guard research"
  - "naming guard feasibility"
  - "cross runtime naming enforcement"
  - "spec folder mis-location"
  - "creation time naming gate"
importance_tier: "important"
contextType: "research"
---
# Feature Research: Spec-Folder Naming-Convention Guard - Cross-Runtime Feasibility

Feasibility study and recommended design for a guard that prevents badly-named or mis-located spec folders (such as a top-level `028-026-program-research` that should have been a phase child) at creation time, consistently across Claude Code, Codex, OpenCode, and Gemini.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## Table of Contents

1. Metadata
2. Investigation Report
3. The Naming Convention (with evidence)
4. The Creation-Time Enforcement Gap
5. Hook-Parity Audit
6. Feasibility Verdict
7. Recommended Design
8. Constraints & Limitations
9. Risks
10. Open Questions

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-007
- **Feature/Spec**: ./spec.md (Spec-Folder Naming-Convention Guard)
- **Status**: Complete
- **Date Started**: 2026-06-06
- **Date Completed**: 2026-06-06
- **Researcher(s)**: claude-opus-4-8 (research agent)
- **Reviewers**: Operator (pending)
- **Last Updated**: 2026-06-06

**Related Documents**:
- Spec: ./spec.md
- Plan: ./plan.md
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
Can a cross-runtime hook or shared module GUARANTEE spec-folder naming-convention quality at creation time, preventing mis-located or badly-named folders across all four runtimes? The operator just hit this defect: `.opencode/specs/system-spec-kit/028-026-program-research` was created at the track root when its slug embeds another packet's number (`026`), signalling it should have been a phase child of `026-graph-and-context-optimization`.

### Current Behavior
- Spec folders are created mainly through `create.sh`, which validates only the basename SYNTAX.
- `validate.sh` runs a `FOLDER_NAMING` rule, but it too is purely syntactic.
- The naming-quality guidance that would catch a mis-located/embedded-number slug is documentation-only (`CLAUDE.md` ALWAYS #20) and is never executed.
- Result: a folder can be syntactically valid yet semantically wrong, and no layer blocks it.

### Key Findings
1. **The defect passes every existing layer**: `028-026-program-research` satisfies both the `create.sh` basename regex and the `validate.sh` `FOLDER_NAMING` rule, so it was never flagged. Confirmed via `find .opencode/specs -maxdepth 3 -type d -name "028-*"`.
2. **Creation location is flag-driven, never semantic**: `create.sh` decides top-level vs phase-child purely from `--phase` / `--parent` / `--subfolder` / `--track` flags. No tool reasons about where a folder SHOULD live based on its slug.
3. **Pre-write interception parity is uneven**: the only working pre-write deny hook today is Codex's `pre-tool-use.ts`; Claude supports `PreToolUse` in the schema but has only `PostToolUse` registered; Gemini has no checked-in project hook at all.

### Recommendations
**Primary Recommendation**: Build a shared naming-validation module and make `create.sh` the single GUARANTEE point (hard gate), backed by a new `validate.sh` semantic rule (catch-later). Treat per-runtime pre-write hooks as best-effort, with a degraded-runtime fallback to the prompt-time advisor.

**Alternative Approaches**:
- Pure prompt-time advisor reminder only — rejected: advisory, non-blocking, no guarantee, and zero coverage for raw `mkdir`.
- A single universal pre-write hook — rejected: parity gaps (no Gemini hook, Claude PreToolUse unregistered) and raw `mkdir`/`Write` bypass make a uniform guarantee impossible.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:the-naming-convention -->
## 3. THE NAMING CONVENTION (WITH EVIDENCE)

### Phase-child pattern (the strict canonical form)
The phase-child regex is `^[0-9]{3}-[a-z0-9][a-z0-9-]*$`, defined identically in two mirrored places:
- TypeScript: `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:8` (`PHASE_CHILD_REGEX`)
- Shell: `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh:57`

### Phase-parent detection
A folder is a phase parent when it has at least one direct `NNN-name` child whose folder contains `spec.md` OR `description.json`:
- `isPhaseParent()` — `is-phase-parent.ts:24-53`
- `is_phase_parent()` — `shell-common.sh:48-67`
The two implementations are deliberately kept in agreement (comment at `is-phase-parent.ts:10-14`). This dual-impl is the model to reuse for the guard.

### Top-level vs phase-child rules
- Top-level (track-root) folders use the looser create-time basename regex `^[0-9]{3}-[A-Za-z0-9._-]+$` (`create.sh:683`, `validate_spec_folder_basename`), which permits uppercase, dots, and underscores that the phase-child regex forbids.
- Whether a folder lands at the track root or under a parent is decided ONLY by the invocation flags (`--phase`, `--parent` / `--phase-parent`, `--subfolder`, `--track`) — see the mode branches in `create.sh` (subfolder mode ~line 827, phase mode ~line 978). There is no semantic check that the slug belongs under an existing parent.

### Post-hoc validator
`validate.sh`'s `FOLDER_NAMING` rule (documented at `validation_rules.md:586`) enforces 3-digit prefix, lowercase, hyphens-only, no spaces. It is the only automated naming check, and it is syntactic, so `028-026-program-research` passes it.
<!-- /ANCHOR:the-naming-convention -->

---

<!-- ANCHOR:enforcement-gap -->
## 4. THE CREATION-TIME ENFORCEMENT GAP

| Layer | When | What it checks | Catches the defect? |
|-------|------|----------------|---------------------|
| `create.sh` basename regex (`create.sh:683`) | Creation | Syntax only (`^[0-9]{3}-[A-Za-z0-9._-]+$`) | No |
| `create.sh` location decision | Creation | Flag-driven only | No |
| `CLAUDE.md` ALWAYS #20 literal-naming rule | N/A (doc-only) | Not executed | No |
| `validate.sh` `FOLDER_NAMING` | After creation | Syntax only | No |

The gap: there is no executable check, at creation time OR later, for slug SEMANTICS (embedded sibling packet numbers, wrong location, generic remediation slugs). The defect slipped through because every existing layer is either syntactic or non-executable.
<!-- /ANCHOR:enforcement-gap -->

---

<!-- ANCHOR:hook-parity-audit -->
## 5. HOOK-PARITY AUDIT

Source: `references/config/hook_system.md` §8 runtime matrix, cross-checked against live config and hook source.

| Runtime | Prompt-time hook | Pre-write deny hook | SessionStart | Parity status |
|---------|------------------|---------------------|--------------|---------------|
| Claude | yes (`UserPromptSubmit`) | NO (`PreToolUse` supported but unregistered; only `PostToolUse` is wired in `.claude/settings.local.json`) | yes | Full lifecycle, no pre-write deny today |
| Codex | yes (`UserPromptSubmit`) | YES (`hooks/codex/pre-tool-use.ts` returns `{decision:'deny', reason}`) but Bash-only today, and live only when `codex_hooks=true` + `hooks.json` | conditional | Only working pre-write interception, gated on config |
| OpenCode | yes (`experimental.chat.system.transform`) | possible via plugin `event` handlers | yes | Full via plugin bridge |
| Gemini | no checked-in project hook | NO | no checked-in project hook | Degraded — external CLI only |
| Copilot | next-prompt-only writer | NO | yes (writer) | Degraded — next-prompt freshness, no in-turn deny |

Key facts:
- The Codex `pre-tool-use.ts` is the existing proof-of-concept for pre-write denial. It already parses tool input and returns `{decision:'deny', reason}` (`pre-tool-use.ts:51-56, 206-237`). It is currently scoped to Bash destructive commands only (`DEFAULT_CODEX_BASH_DENYLIST`, `pre-tool-use.ts:63-82`), but the deny SHAPE is exactly what a folder-name guard would emit.
- Claude has `PostToolUse` registered (runs after the write) but NOT `PreToolUse`, so there is no in-turn block point on Claude today.
- Gemini and Copilot are the degraded runtimes: Gemini has no checked-in project hook (`hook_system.md` §8 row: "External CLI only"); Copilot is next-prompt freshness, so the current prompt only sees the PRIOR turn's brief.
<!-- /ANCHOR:hook-parity-audit -->

---

<!-- ANCHOR:feasibility-verdict -->
## 6. FEASIBILITY VERDICT

**VERDICT: PARTIAL.**

A shared naming-validation module is feasible and is the right design. But a single cross-runtime pre-write hook CANNOT guarantee naming quality with uniform strength, for two structural reasons:

1. **Pre-write interception parity is uneven.** Only Codex has a working pre-write deny hook today, and it is Bash-only and config-gated. Claude's `PreToolUse` is supported but unregistered; Gemini has no project hook at all. A hook-only strategy therefore cannot enforce uniformly across the four runtimes.
2. **Raw `mkdir` / `Write` bypasses any hook.** Folders created directly (not through `create.sh`) may never trigger a pre-write or prompt-time hook, so no prompt-time mechanism can be a hard guarantee.

The realistic guarantee point is `create.sh` itself — the canonical creation path — hardened with the shared module so it deterministically blocks high-confidence violations. Everything else (per-runtime hooks, prompt-time advisor) is best-effort, and `validate.sh` provides the catch-later safety net for anything that bypasses the canonical path. Under this layered design the SPECIFIC defect that prompted this packet (a top-level slug embedding a sibling packet number) IS preventable deterministically on the canonical path and detectable everywhere else.
<!-- /ANCHOR:feasibility-verdict -->

---

<!-- ANCHOR:recommended-design -->
## 7. RECOMMENDED DESIGN

### Architecture Diagram

```
                ┌──────────────────────────────────────────┐
                │  shared module: spec-folder-naming        │
                │  classifyProposedSpecFolder(targetPath)   │
                │  -> { ok, severity, reason,               │
                │       suggestedLocation }                 │
                │  (reuses isPhaseParent + phase-child rgx) │
                └──────────────────────────────────────────┘
                   ▲            ▲              ▲           ▲
   GUARANTEE ──────┘            │              │           └────── CATCH-LATER
   create.sh hard gate    per-runtime      prompt-time      validate.sh
   (block on disk)        pre-write hook   advisor brief    SEMANTIC_NAMING
   before mkdir           (best-effort)    (degraded RTs)   rule (after disk)
```

### Component 1: shared `spec-folder-naming` module (single source of truth)
**Purpose**: One function, `classifyProposedSpecFolder(targetPath)`, returning `{ ok, severity, reason, suggestedLocation }`.

**Responsibilities**:
- Reconcile to the strict phase-child regex `^[0-9]{3}-[a-z0-9][a-z0-9-]*$`.
- Detect high-confidence mis-location: a track-root slug whose body contains a second `NNN` token that matches an existing sibling packet number (the `028-026-...` case) → recommend it as a phase child of that parent.
- Detect generic/forbidden standalone slugs (`remediation`, `cleanup`, `fix`, `phase-N`, `round-N`).

**Dependencies**: `is-phase-parent.ts` / `shell-common.sh` (reuse, do not re-derive). Mirror the existing TS-authoritative + shell-shim dual-impl so shell and runtime callers agree (`NFR-R01`).

### Component 2: `create.sh` creation-path gate (the GUARANTEE)
- Call the module before `mkdir` in every create mode.
- HARD-BLOCK on high-confidence severity (embedded sibling number, wrong location); WARN-and-proceed otherwise.
- Fail OPEN on the guard's own error (`NFR-S02`) so creation is never wholly broken.

### Component 3: per-runtime pre-write hook (best-effort)
- Codex: extend `pre-tool-use.ts` beyond Bash to deny `mkdir`/Write of a mis-located folder, emitting the same `{decision:'deny', reason}` shape.
- Claude: register a `PreToolUse` hook (currently absent) routed through the shared module.
- OpenCode: deny via plugin `event` handlers / `experimental` transform.

### Component 4: `validate.sh` SEMANTIC_NAMING rule (CATCH-LATER)
- A new rule that runs the same module against existing folder names so anything created outside `create.sh` (raw `mkdir`, Gemini, hand edits) is flagged on the next validate.

### Degraded-runtime fallback
- Gemini (no project hook) and Copilot (next-prompt-only): no pre-write deny. They are covered by (a) the `create.sh` gate whenever the canonical path is used, (b) the `validate.sh` catch-later rule, and (c) a prompt-time advisor reminder. This is the documented fallback for runtimes lacking in-turn interception.
<!-- /ANCHOR:recommended-design -->

---

<!-- ANCHOR:constraints-limitations -->
## 8. CONSTRAINTS & LIMITATIONS

### Platform Limitations
- **No pre-write deny on Gemini**: the platform has no checked-in project hook; only `create.sh` + `validate.sh` cover it.
- **Codex pre-write is config-gated**: requires `codex_hooks=true` and `hooks.json`; absent that, Codex degrades to the same fallback.

### Performance Boundaries
- **NFR-P01**: creation-time check must stay < 50ms (single parent-dir read).
- **NFR-P02**: any pre-write hook must stay within the 1800ms hook budget (`hook_system.md` §7).

### Security Restrictions
- Folder names are untrusted strings: regex-match only, never eval (`NFR-S01`).
- Guard must fail open on internal error to avoid blocking all spec creation (`NFR-S02`).
<!-- /ANCHOR:constraints-limitations -->

---

<!-- ANCHOR:risks -->
## 9. RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Raw `mkdir`/`Write` bypasses hooks | A creation-path gate alone misses hand-made folders | Pair with `validate.sh` SEMANTIC_NAMING (catch-later) |
| Uneven pre-write parity | No uniform hook guarantee | `create.sh` is the guarantee; hooks are best-effort |
| Heuristic semantic checks | False positives could block valid names | Severity tiers: hard-block only high-confidence rules; warn otherwise |
| Drift between shell + TS impls | Inconsistent enforcement | Reuse the `is-phase-parent` dual-impl agreement pattern |
| Guard self-error | Could block all creation | Fail open (allow + warn) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- Should `create.sh` HARD-BLOCK or warn on high-confidence mis-location? **RESOLVED**: hard-block at `create.sh` for high-confidence rules; warn elsewhere.
- Can one shared module serve shell + all four runtimes? **RESOLVED**: yes, via the existing dual-impl pattern.
- Will Gemini ever get a pre-write hook? **OPEN**: no checked-in Gemini project hook today; tracked as a parity follow-on, not a blocker for this design.
- Should the existing `028-026-program-research` folder be relocated as part of the future implementation packet, or in a separate remediation packet? **OPEN**: out of scope here; flagged for the operator.
<!-- /ANCHOR:open-questions -->
