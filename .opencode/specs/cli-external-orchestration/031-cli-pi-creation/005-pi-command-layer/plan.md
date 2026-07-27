---
title: "Implementation Plan: Phase 5: pi-command-layer"
description: "Plan for flattening the 36 invokable .opencode/commands/*.md files into .pi/prompts/*.md and translating $ARGUMENTS/argument-hint/allowed-tools conventions to Pi's $1/$2/$@/${1:-default} syntax."
trigger_phrases:
  - "pi command layer plan"
  - "flattening convention"
  - "argument translation table"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/005-pi-command-layer"
    last_updated_at: "2026-07-27T10:01:30Z"
    last_updated_by: "claude-code"
    recent_action: "Worklist re-derived live, zero drift; dependency table refreshed"
    next_safe_action: "Commit; phase 006 proceeds with the Task-dependency list"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: pi-command-layer

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (Claude-Code-style command frontmatter + `$ARGUMENTS`) → Markdown (Pi prompt-template frontmatter + `$1`/`$2`/`$@`/`${1:-default}` substitution) |
| **Framework** | Claude Code thin-router command pattern (Markdown entry point + owned YAML workflow / presentation `.txt` assets) vs. Pi's native prompt-templates loader |
| **Storage** | Filesystem only — `.opencode/commands/**/*.md` (source, nested, 49 files) → `.pi/prompts/*.md` (target, flat, 36 planned files) |
| **Testing** | Manual/live `pi` session dispatch per ported command, deferred to execution; this phase authors the plan only (no code, no live test) |

### Overview
Classify all 49 `.opencode/commands/**/*.md` files into 36 invokable commands (uniform `description`+`argument-hint`+`allowed-tools` frontmatter) and 13 non-command supporting files (developer READMEs, compiled contracts, legacy router bodies), then design a collision-free `<group>-<name>.md` flattening convention and a pattern-based `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table that a future execution pass can apply mechanically to produce `.pi/prompts/*.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Real `.opencode/commands/` tree read directly (`find`/`grep`, not assumed from the phase brief alone) — 49 files, 36 invokable / 13 supporting confirmed
- [x] pi.dev docs findings for prompt-templates incorporated with explicit UNCONFIRMED flags where live behavior is not yet verified

### Definition of Done
- [x] Flattening convention covers all 36 commands with zero name collisions
- [x] Translation table covers every argument-hint pattern observed in the 36 commands
- [x] Frontmatter-key gap has a stated disposition per key
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 005-pi-command-layer --strict` passes `Errors: 0`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Static mapping/translation doctrine, not runtime code — this phase produces planning documentation only. No software is installed or executed (Hard Constraints, packet-wide).

### Key Components

**A. Classification rule.** A file under `.opencode/commands/**/*.md` is an *invokable command* iff it carries all three of `description:`, `argument-hint:`, and `allowed-tools:` frontmatter keys (confirmed uniform across exactly 36 files via `grep -rl "^argument-hint:" .opencode/commands --include="*.md" | wc -l` → 36). The remaining 13 files (`grep -rL` complement) are developer-reference/generated-artifact files using a `title:`/`trigger_phrases:` frontmatter shape instead: 5 READMEs (`deep/assets/compiled/README.md`, `deep/assets/legacy/README.md`, `doctor/scripts/README.md`, `scripts/README.md`, `scripts/fixtures/README.md`), 4 compiled command contracts (`deep/assets/compiled/deep-{ai-council,alignment,research,review}.contract.md`), and 4 legacy router bodies (`deep/assets/legacy/deep-{ai-council,alignment,research,review}.body.md`). None of the 13 are user-invokable — they are internal plumbing consumed by the `deep/` command family's own injection/compilation tooling — so they are explicitly excluded from Pi porting.

**B. Flattening / naming convention.** For the 34 nested commands (grouped under `create/`, `deep/`, `doctor/`, `interface/`, `memory/`, `prompt/`, `speckit/`), flatten `<group>/<name>.md` → `.pi/prompts/<group>-<name>.md`, invoked as `/<group>-<name>` — the direct hyphenated analog of Claude's colon-namespaced `/<group>:<name>`. For the 2 already-flat top-level files (`agent-router.md`, `goal-opencode.md`), keep the basename unchanged: `.pi/prompts/agent-router.md` → `/agent-router`; `.pi/prompts/goal-opencode.md` → `/goal-opencode` (note: `goal-opencode.md`'s own body titles itself "`# /goal`", a pre-existing inconsistency with the file-path-derived name — preserved as-is per spec.md §7, not reconciled by this phase). This convention places all 36 files in one flat directory with no subfolders, satisfying Pi's documented non-recursive discovery constraint by construction rather than by a special case. See the full 36-row worklist below for the collision check (verified: zero duplicate flattened names).

**C. `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table.** Every one of the 36 commands' `argument-hint` lines was read directly (not sampled) and falls into one of 5 patterns:

| # | Claude pattern | Observed example | Pi equivalent | Rationale / caveat |
|---|---|---|---|---|
| 1 | Whole-string self-parsing router: the command's own "MODE ROUTING" prose instructs the agent to parse flags/mode-suffixes out of `$ARGUMENTS` itself | `deep/research.md` (`<topic> [:auto\|:confirm] [--spec-folder=PATH] [--max-iterations=N] ...`, a dozen optional GNU flags), `create/skill.md`, `speckit/complete.md` | `$@` (all arguments as one raw string) | Preserves the existing agent-side parsing logic verbatim — only the token `$ARGUMENTS` needs replacing with `$@` in the ported prompt body; behaviorally closest to current semantics. Majority pattern (≈28 of 36 commands). |
| 2 | Single required positional token, no flags | `memory/save.md` (`<spec-folder>`) | `$1` | Clean 1:1 mapping. Caveat: Pi's `$1` is whitespace-delimited like a shell arg — breaks if the value legitimately contains spaces (e.g. a path with spaces); Claude's `$ARGUMENTS` has the same practical limitation today, so this is not a regression. |
| 3 | Sub-action enum as the first token, followed by its own flags | `doctor/mcp.md` (`<install\|debug> [--server <name>] [--runtime <name>] [--fix]`) | `$1` for the sub-action, `$@` (or a documented remainder) for the flags | UNCONFIRMED whether Pi exposes a "`$@` minus `$1`" remainder primitive; until verified, the safer translation keeps the whole string as `$@` and lets the router's existing "sub-action is positional and must be parsed before flags" prose (already present in `doctor/mcp.md`) do the split, unchanged. |
| 4 | `:auto`/`:confirm` mode suffix appended to the argument string | Every `deep/*`, `create/*`, `speckit/*` command | Kept inside `$@` as literal trailing text | Pi's substitution model has no documented "suffix flag" concept distinct from positional args; the router's own text-scanning logic (already documented per-command) continues to scan the substituted string for the `:auto`/`:confirm` token, unchanged. |
| 5 | `[optional-flag]` with one obvious default value | None of the 36 commands use a bare positional optional with a single obvious default — all optional inputs are `--flag=value`/`--flag value` GNU-style pairs, not positional | `${1:-default}` — documented as available, but has no direct match in this repo's current 36 commands | Recorded for completeness per the pi.dev docs; not exercised by this phase's worklist. A future command authored Pi-natively could use it; none of the ported ones need it today. |

**Default translation rule**: unless a command matches pattern 2 or 3 exactly, translate `$ARGUMENTS` → `$@` uniformly. This is the low-risk default because it is behavior-preserving (the router keeps parsing the same raw string it always did) and avoids the ambiguity risk named in spec.md §6 (`${1:-default}` cannot distinguish "arg omitted" from "arg equals the literal default value"). Positional-slot translation ($1/$2) is an optional, per-command micro-optimization for a future execution pass to evaluate case by case — not mandatory for this phase's doctrine.

**D. Frontmatter-key disposition.** All 36 commands carry `description:`, `argument-hint:`, `allowed-tools:`; 2 also carry `skill:` (`deep/command-benchmark.md`, `deep/skill-benchmark.md` — OpenCode skill-advisor routing hints); 1 carries `title:` (`deep/ai-council.md`); 1 carries `version:` (`agent-router.md`). None of these 4 keys have a confirmed Pi prompt-template frontmatter analog per the pi.dev findings supplied to this phase (the docs describe only filename→command-name mapping and `$1`/`$2`/`$@`/`${1:-default}` body substitution — no frontmatter schema is documented at all).

| Key | Commands affected | Disposition |
|---|---|---|
| `allowed-tools` | 36/36 | Drop from frontmatter (no Pi analog); document as a named risk (spec.md §6) that ported prompts lose Claude's per-command tool-allowlist tightening and inherit whatever tool access the top-level Pi session/agent already has — broader effective scope, not equivalent. |
| `argument-hint` | 36/36 | Fold a short one-line usage summary into the ported prompt's own body text (Pi has no documented autocomplete-hint UI surface to target instead) — a discoverability mitigation, not a full replacement. |
| `skill` | 2/36 | Drop — OpenCode-specific skill-advisor routing metadata with no Pi equivalent; the routing behavior it hints at is out of this phase's scope entirely. |
| `title` / `version` | 1/36 each | Drop from frontmatter; if the information is load-bearing for the command's own body text (e.g. `agent-router.md`'s `version: "5.0 (Dynamic Discovery)"` describing its own routing logic generation), fold it into the body prose instead of the frontmatter block. |
| `description` | 36/36 | UNCONFIRMED whether Pi's loader recognizes/displays a `description` frontmatter key at all (docs only confirm filename→command-name mapping) — keep it in the ported frontmatter defensively (harmless if ignored) pending phase-1 confirmation of the loader's tolerance for unrecognized keys. |

**E. Task-tool / subagent-dispatch dependency.** 14 of the 36 commands list `Task` in `allowed-tools`, meaning their body text (or the YAML workflow they route to) dispatches subagents: all 8 `deep/*` commands (`agent-improvement`, `ai-council`, `alignment`, `command-benchmark`, `model-benchmark`, `research`, `review`, `skill-benchmark`), plus `memory/save.md`, `prompt/improve.md`, and all 4 `speckit/*` commands (`complete`, `implement`, `plan`, `resume`). These 14 will flatten and register as `/name` prompts mechanically under this phase's convention, but Pi's native toolset (per the pi.dev findings supplied) documents no built-in Task/subagent-dispatch tool — that capability is the third-party `pi-subagents` package, sequenced as phase 006 (after this phase). This mirrors the precedented, accepted sequencing gap from 029 (`cli-devin` was routable before `fanout-run.cjs` could dispatch it) — acceptable as long as it is documented, not silently implied to work end-to-end. This phase documents the gap; it does not resolve it.

### Data Flow
`.opencode/commands/**/*.md` (49 files, nested, read-only) → classify (component A) → 36 invokable pass through the flattening convention (component B) → each command's frontmatter and `$ARGUMENTS` usage pass through the translation table and key-disposition table (components C, D) → planned output `.pi/prompts/*.md` (36 files, flat). The 13 supporting files never enter this pipeline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix — included for completeness per the precedent phases' convention of using this table to track planned file-level surfaces even for non-fix work.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/**/*.md` (36 invokable files) | Existing Claude/OpenCode-native command source | Read-only reference | Not modified by this phase or by a future execution pass |
| `.pi/prompts/*.md` (36 planned files) | (new) Pi-native flattened prompt templates | Create — future execution only | Filename collision check + full worklist below |
| `cli-pi/references/pi-command-layer.md` (planned, path TBD) | (new) persisted naming/translation doctrine | Create — future execution only, location deferred (spec.md §7) | Cross-referenced from this plan |
| `.opencode/commands/deep/assets/{compiled,legacy}/*.md`, 5 READMEs (13 files) | Internal command-injection plumbing | Not a consumer of this phase's changes | Excluded by the classification rule (component A) |

**Same-class producer inventory**: `grep -rl "^argument-hint:" .opencode/commands --include="*.md"` → the 36-file invokable set (component A).
**Consumer inventory**: none — this phase creates new planning doctrine; it does not modify a shared symbol, helper, or public field that existing code consumes.
**Matrix axes**: 8 command groups × 5 argument-hint patterns × 2 Task-dependency states = the worklist's column set below (36 rows, not a combinatorial matrix — every command is a single concrete row).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate all 49 `.opencode/commands/**/*.md` files directly (`find` + `grep`), not assumed from the phase brief alone
- [x] Classify into 36 invokable + 13 supporting via the frontmatter triad rule
- [x] Cross-read the pi.dev prompt-templates docs findings against the real argument-hint grammar of all 36 commands

### Phase 2: Core Implementation (this phase's own deliverable — documentation, not code)
- [x] Draft the flattening/naming convention (component B) and confirm zero collisions across all 36 flattened names (worklist below)
- [x] Draft the `$ARGUMENTS` → `$1`/`$2`/`$@`/`${1:-default}` translation table (component C, 5 pattern rows)
- [x] Draft the frontmatter-key disposition table (component D, 5 keys)
- [x] Enumerate the 14 Task-dependent commands and record the phase-006 sequencing gap (component E)
- [x] Produce the full 36-row per-group worklist (below)

### Phase 3: Verification
- [x] Re-run `grep -rl "^argument-hint:" .opencode/commands --include="*.md" | wc -l` at execution time and confirm 36 still holds (the tree may have changed since authoring) — re-ran during closeout, still 36
- [x] Manually re-derive all 36 flattened names from the stated convention and diff against the worklist below for drift — re-derived, zero drift
- [x] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 005-pi-command-layer --strict` — see `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

## FULL 36-ROW PER-GROUP WORKLIST

| Group | Source Path | Flattened `.pi/prompts/` Filename | Invocation | Task-Dep |
|---|---|---|---|---|
| top-level | `agent-router.md` | `agent-router.md` | `/agent-router` | no |
| top-level | `goal-opencode.md` | `goal-opencode.md` | `/goal-opencode` | no |
| create | `create/agent.md` | `create-agent.md` | `/create-agent` | no |
| create | `create/benchmark.md` | `create-benchmark.md` | `/create-benchmark` | no |
| create | `create/changelog.md` | `create-changelog.md` | `/create-changelog` | no |
| create | `create/command.md` | `create-command.md` | `/create-command` | no |
| create | `create/diff.md` | `create-diff.md` | `/create-diff` | no |
| create | `create/feature-catalog.md` | `create-feature-catalog.md` | `/create-feature-catalog` | no |
| create | `create/flowchart.md` | `create-flowchart.md` | `/create-flowchart` | no |
| create | `create/manual-testing-playbook.md` | `create-manual-testing-playbook.md` | `/create-manual-testing-playbook` | no |
| create | `create/readme.md` | `create-readme.md` | `/create-readme` | no |
| create | `create/skill-parent.md` | `create-skill-parent.md` | `/create-skill-parent` | no |
| create | `create/skill.md` | `create-skill.md` | `/create-skill` | no |
| deep | `deep/agent-improvement.md` | `deep-agent-improvement.md` | `/deep-agent-improvement` | yes |
| deep | `deep/ai-council.md` | `deep-ai-council.md` | `/deep-ai-council` | yes |
| deep | `deep/alignment.md` | `deep-alignment.md` | `/deep-alignment` | yes |
| deep | `deep/command-benchmark.md` | `deep-command-benchmark.md` | `/deep-command-benchmark` | yes |
| deep | `deep/model-benchmark.md` | `deep-model-benchmark.md` | `/deep-model-benchmark` | yes |
| deep | `deep/research.md` | `deep-research.md` | `/deep-research` | yes |
| deep | `deep/review.md` | `deep-review.md` | `/deep-review` | yes |
| deep | `deep/skill-benchmark.md` | `deep-skill-benchmark.md` | `/deep-skill-benchmark` | yes |
| doctor | `doctor/mcp.md` | `doctor-mcp.md` | `/doctor-mcp` | no |
| doctor | `doctor/speckit.md` | `doctor-speckit.md` | `/doctor-speckit` | no |
| doctor | `doctor/update.md` | `doctor-update.md` | `/doctor-update` | no |
| interface | `interface/design-reference.md` | `interface-design-reference.md` | `/interface-design-reference` | no |
| interface | `interface/design.md` | `interface-design.md` | `/interface-design` | no |
| interface | `interface/motion.md` | `interface-motion.md` | `/interface-motion` | no |
| memory | `memory/learn.md` | `memory-learn.md` | `/memory-learn` | no |
| memory | `memory/manage.md` | `memory-manage.md` | `/memory-manage` | no |
| memory | `memory/save.md` | `memory-save.md` | `/memory-save` | yes |
| memory | `memory/search.md` | `memory-search.md` | `/memory-search` | no |
| prompt | `prompt/improve.md` | `prompt-improve.md` | `/prompt-improve` | yes |
| speckit | `speckit/complete.md` | `speckit-complete.md` | `/speckit-complete` | yes |
| speckit | `speckit/implement.md` | `speckit-implement.md` | `/speckit-implement` | yes |
| speckit | `speckit/plan.md` | `speckit-plan.md` | `/speckit-plan` | yes |
| speckit | `speckit/resume.md` | `speckit-resume.md` | `/speckit-resume` | yes |

Collision check: 36 rows, 36 unique values in the "Flattened Filename" column — verified by inspection, no two rows share a name. Task-dependency count: 14 `yes` rows (8 `deep/*` + `memory/save` + `prompt/improve` + 4 `speckit/*`), matching REQ-006's acceptance criterion.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static/manual | Naming collision check across the 36 planned filenames | Manual sort+uniq re-derivation at execution time |
| Static/manual | Argument-hint grammar coverage against the translation table | Manual cross-reference, one row per command (done during authoring — see worklist) |
| Live (deferred) | Actual Pi prompt-template dispatch + `$1`/`$2`/`$@` substitution behavior, including the unconfirmed frontmatter-tolerance and `${1:-default}` semantics | Real `pi` session — deferred to phase 001 or a future execution of this phase, NOT part of this planning pass |
| Doc gate | Spec-kit structural validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `pi-contract-pin` (live Pi install + prompt-template live verification) | Internal | Complete — Pi CLI 0.82.1 installed; substitution-syntax live verification still blocked on provider credentials | Every substitution-syntax claim in this phase's docs stays UNCONFIRMED until credentials exist |
| Phase 004 `pi-skill-discovery-bridge` | Internal | Complete — Candidate A accepted with a re-verification trigger; live discovery-shape confirmation also blocked on the same credential gap | Confirms whether `.pi/`-pointed discovery patterns behave as this phase assumes for `.pi/prompts/` |
| Phase 006 `pi-agent-bridge` (`pi-subagents`) | Internal | Not started | The 14 Task-dependent ported commands stay functionally inert for subagent dispatch until this lands |
| Phase 003 `cli-pi-skill-packet` (`references/` dir) | Internal | Complete — `cli-pi/references/` exists as the hub's 6th mode | Persisted doctrine file's target directory now exists; exact filename still an open question (spec.md §7) |
| pi.dev docs (`prompt-templates` page) | External | Live-fetched, docs-only (not live-CLI-verified) | Naming/discovery assumptions rest on documented, not confirmed, behavior |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The naming convention is found to collide with a Pi-reserved command name, or `${1:-default}`/`$@` substitution is proven not to work as documented once phase 001 runs a live session.
- **Procedure**: This phase produces documentation only — no source files are created. Rollback is `git checkout` of this phase's 4 docs. Any future execution pass's actual `.pi/prompts/*.md` files are purely additive and can be deleted individually without touching `.opencode/commands/` — the Claude/OpenCode-native source stays untouched throughout this phase and any execution derived from it.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../004-pi-skill-discovery-bridge/`, `../006-pi-agent-bridge/`, `../003-cli-pi-skill-packet/`
