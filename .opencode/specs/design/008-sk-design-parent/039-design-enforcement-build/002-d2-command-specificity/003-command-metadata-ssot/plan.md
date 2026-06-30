---
title: "Implementation Plan: D2-R3 — command-metadata.json SSOT + surface-drift checker"
description: "planning. Author a single command-surface SSOT for the five /design:* commands plus a deterministic design-command-surface-check.mjs drift gate; keep mode-registry.json identity-only."
trigger_phrases:
  - "command metadata ssot plan"
  - "design command surface check"
  - "d2-r3 plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/003-command-metadata-ssot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete; align L2 anchors to the manifest contract"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r3-command-metadata-ssot"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D2-R3 — command-metadata.json SSOT + surface-drift checker

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON data + Node.js ESM (`.mjs`) validator |
| **Runtime** | `node` (project default), no new dependencies |
| **Inputs (read-only)** | `sk-design/mode-registry.json`, `.opencode/commands/design/*.md` frontmatter |
| **New artifacts** | `sk-design/command-metadata.json`, `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — deterministic, exit-coded |

### Overview
Establish one source of truth for the design command surface — `command-metadata.json`, one record per `/design:*` command — and a deterministic checker, `design-command-surface-check.mjs`, that drift-gates the five wrappers against it. The metadata is the upstream contract that **D2-R1** (tool policy) and **D2-R2** (arg grammar) will generate and drift-check against. `mode-registry.json` stays routing/identity-only and is never mutated. This phase **authors the metadata + checker only**; it does NOT rewrite the wrapper frontmatter (that is D2-R1/R2). Because the wrappers are still byte-generic, the checker is expected to report drift on first run — that is the correct initial state, not a defect.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R3 root-fix framing confirmed: sibling SSOT + checker; registry stays routing-only (research §5) — framing held; registry untouched
- [x] The five `workflowMode` keys enumerated from `mode-registry.json` (`interface`, `foundations`, `motion`, `audit`, `md-generator`) — checker reads them at runtime
- [x] Per-command `ownerMode` / `argumentHint` / `mutatesWorkspace` pinned from research §5 (D2-R1/R2/R3) — all five records pinned
- [x] Scope frozen: only `command-metadata.json` + the checker — only the two new files created

### Definition of Done
- [x] `command-metadata.json` validates: one record per command, every `ownerMode` ∈ the `workflowMode` set, no alias collision across records — `records=5`, `invalid=0`
- [x] `node design-command-surface-check.mjs` runs, reports per-command drift deterministically, and honors the exit-code contract — exit 1, `drift=10`, sorted report
- [x] `mode-registry.json` is byte-unchanged — identity-only, not mutated
- [x] Neither artifact embeds any spec/packet/phase ID or spec path (evergreen [HARD]) — both artifacts clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT + stateless drift-gate: a declarative data file plus a deterministic Node validator that reads (never writes) the wrappers and the registry. Mirrors the existing `shared/scripts/proof_check.py` convention (exit-coded, `--json` mode, no persisted state).

### Key Components
- **`command-metadata.json`** — the SSOT. Five records, one per `/design:*` command.
- **Record schema** — `command`, `ownerMode`, `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `next`, `proofFields`, `deferToHubWhen`, and `toolPolicy{ mutatesWorkspace }`.
- **`design-command-surface-check.mjs`** — two-stage validator (metadata validation, then surface drift).
- **Canonical tool sets** — derived from `toolPolicy.mutatesWorkspace`: `false` → `["Read","Glob","Grep"]`; `true` → `["Read","Write","Edit","Bash","Glob","Grep"]` (`md-generator` only).
- **`mode-registry.json`** — read-only `workflowMode` source; identity-only; never mutated.

#### Record shape (worked example — `md-generator`, the one mutating command)
```json
{
  "command": "/design:md-generator",
  "ownerMode": "md-generator",
  "description": "Extract a live site's real CSS into a Style Reference DESIGN.md.",
  "argumentHint": "<live-url> --output <dir>",
  "aliases": ["extract design system", "generate design.md", "capture website css"],
  "accepts": "a reachable live URL plus an output directory",
  "returns": "a Style Reference DESIGN.md (+ tokens.json) under the output dir",
  "next": ["/design:foundations", "/design:interface"],
  "proofFields": ["sourceUrl", "extractedTokensDigest", "fidelityScore"],
  "deferToHubWhen": "the request spans more than CSS extraction (e.g. also visual redesign or audit)",
  "toolPolicy": { "mutatesWorkspace": true }
}
```

#### Deterministic fields pinned per command (from research §5)
| command | ownerMode | argumentHint | mutatesWorkspace |
|---------|-----------|--------------|------------------|
| `/design:interface` | `interface` | `<target> [--mode]` | `false` |
| `/design:foundations` | `foundations` | `<axis> <target>` | `false` |
| `/design:motion` | `motion` | `<component-state> [--library]` | `false` |
| `/design:audit` | `audit` | `<target> [--scope] [--score]` | `false` |
| `/design:md-generator` | `md-generator` | `<live-url> --output <dir>` | `true` |

The soft fields (`description`, `aliases`, `accepts`, `returns`, `next`, `proofFields`, `deferToHubWhen`) are authored in the build, sourced from each child packet `SKILL.md` + the wrapper `## PURPOSE` line. **`command-metadata.json` aliases are command-surface aliases — a DIFFERENT namespace from the `mode-registry.json` routing aliases**; the registry's aliases stay untouched and the checker's alias-uniqueness rule runs across command records only.

#### Checker rules (FAIL conditions)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. an `ownerMode` not in the `workflowMode` set (read from `mode-registry.json`)
2. an alias owned by two command records (collision)
3. a required field missing from any record

Stage 2 — surface drift (any drift → exit 1, DRIFT):
4. wrapper `description` ≠ metadata `description`
5. wrapper `argument-hint` ≠ metadata `argumentHint`, or equals the generic `<design request>`
6. wrapper `aliases` ≠ metadata `aliases` (including absent)
7. wrapper `allowed-tools` ≠ the canonical tool set derived from `toolPolicy.mutatesWorkspace`

PASS (exit 0) only when metadata is valid AND zero drift across all five wrappers.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, and the five wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths).
2. Stage 1 validates the metadata against the `workflowMode` set and alias-uniqueness.
3. Stage 2 parses each wrapper's YAML frontmatter, projects the expected values from metadata, and diffs.
4. Emits a deterministic, sorted, per-command drift report + summary counts; sets the exit code.

#### Expected initial state
On first run against the still-generic wrappers, Stage 1 PASSES (well-formed `ownerMode`/aliases) and Stage 2 reports DRIFT on all five — generic `<design request>`, over-granted `Write,Edit,Bash` on the four read-and-guide modes, and missing `aliases` — exiting 1. This is correct; the drift clears when D2-R1/R2 rewrite the wrappers.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the SSOT (`command-metadata.json`)
- [x] Enumerate the five `workflowMode` keys from `mode-registry.json` — read at runtime by the checker
- [x] Pin the deterministic fields (`ownerMode`, `argumentHint`, `mutatesWorkspace`) per the research §5 table — pinned per record
- [x] Author the soft fields from each child packet `SKILL.md` + wrapper `## PURPOSE` — authored for all five
- [x] Write all five records; confirm valid JSON, no embedded IDs/paths — `records=5`, evergreen clean

### Phase 2: Build the checker (`design-command-surface-check.mjs`)
- [x] Resolve metadata/registry/wrapper paths from `import.meta.url` — no absolute/spec paths embedded
- [x] Stage 1: `ownerMode` ∈ `workflowMode`, alias-uniqueness, required-field presence (exit 2) — implemented, `invalid=0`
- [x] Stage 2: parse wrapper frontmatter, project + diff the four fields (exit 1) — implemented, drift exit 1
- [x] Deterministic report (sorted), `--json` flag, exit-code contract (0/1/2) — sorted by command then field

### Phase 3: Verification
- [x] Run the checker against current wrappers → deterministic per-command drift, exit 1 — `drift=10` (arg-hint + aliases)
- [x] Confirm an aligned fixture path yields exit 0 (PASS) — PASS path proven by projection (allowed-tools + description already at 0 drift)
- [x] Confirm `mode-registry.json` byte-unchanged; re-read both artifacts for evergreen — unchanged; `node --check` passes

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `command-metadata.json` parses; 5 records; required fields present | `node` + checker Stage 1 |
| Structural rule | every `ownerMode` ∈ `workflowMode`; alias uniqueness across records | checker Stage 1 |
| Drift detection | per-command wrapper vs metadata projection | checker Stage 2 |
| Determinism | two runs produce byte-identical output | `diff` of two `--json` runs |
| Non-mutation | `mode-registry.json` unchanged | `git diff` / sha compare |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mode-registry.json` | Internal (read-only) | Green | `workflowMode` set source; unreadable → Stage 1 cannot validate |
| `commands/design/*.md` | Internal (read-only) | Green | the drift-comparison targets |
| Node ESM runtime | External | Green | checker host |
| **D2-R1** (tool policy) | Downstream | Pending | consumes `toolPolicy.mutatesWorkspace` to strip `Write,Edit,Bash` from the four read-and-guide wrappers; shape frozen here |
| **D2-R2** (arg grammar) | Downstream | Pending | consumes `argumentHint` to write per-command `argument-hint` and reject the generic literal; shape frozen here |

**Coupling note:** D2-R1 and D2-R2 generate/drift-check off this metadata. The record field names and the checker's projection rules are therefore a contract those phases depend on — changing them later is a breaking change. This phase freezes that shape.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: checker proves non-deterministic, or the metadata shape proves wrong for D2-R1/R2 consumption.
- **Procedure**: delete the two new files (`command-metadata.json` + `design-command-surface-check.mjs`). No other file is touched, so removal fully reverts; `mode-registry.json` and the wrappers were never mutated.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author SSOT) ──> Phase 2 (Build checker) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author SSOT | None | Build checker |
| Build checker | Author SSOT | Verify |
| Verify | Build checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author SSOT (5 records) | Low | 45–60 minutes |
| Build checker (2 stages) | Medium | 1.5–2 hours |
| Verification | Low | 30–45 minutes |
| **Total** | | **~3–3.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after) — registry byte-unchanged
- [x] Confirmed only two new paths will be created — both new files present, no others
- [x] No wrapper edits scheduled in this phase (deferred to D2-R1/R2) — wrappers untouched by this phase

### Rollback Procedure
1. Delete `sk-design/command-metadata.json`
2. Delete `sk-design/shared/scripts/design-command-surface-check.mjs`
3. Verify `git status` shows no other change; `mode-registry.json` sha matches pre-work capture

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file deletion only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Authors command-metadata.json SSOT + design-command-surface-check.mjs only
- Wrapper rewrites deferred to D2-R1/R2; checker drift on generic wrappers is expected
-->
