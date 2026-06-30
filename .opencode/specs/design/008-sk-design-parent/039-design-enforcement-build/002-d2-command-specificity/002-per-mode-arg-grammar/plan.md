---
title: "Implementation Plan: Per-mode arg grammar for /design:* wrappers"
description: "Replace the identical generic argument-hint with a real per-mode argumentHint sourced from command-metadata.json and drift-checked against the five /design:* wrappers."
trigger_phrases:
  - "arg grammar plan"
  - "per-mode argument hint"
  - "design command arg grammar"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/002-per-mode-arg-grammar"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete; align L2 anchors to the manifest contract"
    next_safe_action: "Run the D2 invocation-example and return-contract phase next"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r2-per-mode-arg-grammar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Per-mode arg grammar for /design:* wrappers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md` frontmatter `argument-hint` (5 lines) + the `argumentHint` field in `sk-design/command-metadata.json` |
| **Source of truth** | `command-metadata.json` `argumentHint` per command (created by the command-metadata SSOT phase, D2-R3); wrappers project from it |
| **Drift gate** | `design-command-surface-check.mjs` arg-grammar presence check (also delivered by D2-R3) |
| **Edit class** | Frontmatter-line + JSON-field edits only; no logic, no script behavior change |

### Overview
All five `/design:*` wrappers ship the identical placeholder `argument-hint: "<design request>"`, which tells the caller nothing about the inputs each mode actually consumes. This phase sets a real, mode-specific `argumentHint` in `command-metadata.json` for each of the five commands — grounded in what that command's body and its mode `SKILL.md` genuinely read — then projects each value into the matching wrapper's `argument-hint` line so they are byte-identical. The drift checker then passes its arg-grammar presence rule: no wrapper retains the generic `<design request>`, and every wrapper `argument-hint` equals its metadata `argumentHint`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The command-metadata SSOT phase (D2-R3) has landed: `command-metadata.json` exists with an `argumentHint` key per command and `design-command-surface-check.mjs` runs. — sibling 003-command-metadata-ssot landed both.
- [x] The five mode `SKILL.md` files and command bodies are read so each grammar is grounded in real inputs, not invented. — grammar table §3 traced to each mode.
- [x] The per-command grammar table (Section 3) is reviewed against each mode's actual positional/flag inputs. — reviewed and reconciled to the shipped values.

### Definition of Done
- [x] No wrapper `argument-hint` equals the generic `<design request>`. — grep over all five wrappers returns nothing.
- [x] Each wrapper `argument-hint` is byte-equal to its `command-metadata.json` `argumentHint`. — all five match the SSOT verbatim.
- [x] `design-command-surface-check.mjs` passes its arg-grammar presence + wrapper-equals-metadata checks. — `STATUS=PASS invalid=0 drift=0`.
- [x] One example invocation per command tokenizes cleanly against its declared grammar. — five-row parse table (§5).
- [x] Every `argumentHint` value is evergreen (no spec/packet/phase IDs or spec paths). — grep of the five values + wrapper lines is clean.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source-of-truth projection: `command-metadata.json` holds the canonical `argumentHint`; each wrapper carries a projected copy; the checker drift-gates the copy against the source.

### Per-Command Grammar (grounded in real inputs)

| Command | `argumentHint` (SSOT value, shipped) | Positional + flags it actually consumes | Grounding evidence |
|---------|--------------------------------------|------------------------------------------|--------------------|
| **md-generator** | `<live-url> --output <dir>` | `extract.ts` takes a positional live URL and a **required** `--output <dir>` | `design-md-generator/SKILL.md` §3 Invocation (`extract.ts <url> --output <dir>`, `--output` REQUIRED) |
| **audit** | `<target> [--scope] [--score]` | Resolves one target (file, URL, screenshot, or design plan); `--scope` narrows the audit; `--score` requests the `/20` score | `design-audit/SKILL.md` §1 (target kinds) + §3 (five-dimension `/20` score) |
| **motion** | `<component-state> [--library]` | A component or interaction state to choreograph; `--library` pins the implementation mechanism / stack boundary | `design-motion/SKILL.md` §1 (hover/focus/active, loading motion) + §3 handoff stack-boundary field (CSS transitions, motion/react, GSAP) |
| **foundations** | `<axis> <target>` | Routes by static `axis` (color \| type \| layout); `target` is the system or surface to build or fix | `design-foundations/SKILL.md` §2 Primary Detection Signal (route by the static axis) |
| **interface** | `<target> [--mode]` | The UI/page/component to design or reshape; `--mode` selects a lane (build \| redesign \| variations \| preflight) | `design-interface/SKILL.md` §1 (build / reshape / N variations) + §2 intent lanes (variation, redesign, preflight) |

> Shipped forms drop the inner flag arguments (`--scope <area>` → `[--scope]`, `--mode <variant>` → `[--mode]`) and the optional `[--validate]` so the hint names the slots a caller fills without flag-argument noise. Each shipped value matches `command-metadata.json` verbatim.

### Data Flow
1. Read each command body + matching mode `SKILL.md` to confirm the real inputs.
2. Set `argumentHint` per command in `command-metadata.json` to the grounded value above.
3. Project the same value into each wrapper's frontmatter `argument-hint` line.
4. Run `design-command-surface-check.mjs`; resolve any drift until the arg-grammar presence + equality checks pass.
5. Tokenize one example invocation per command against its declared grammar as a final confirmation.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground & Populate SSOT
- [x] Confirm D2-R3 landed (`command-metadata.json` + checker present). — both present under `sk-design/`.
- [x] Re-read the five command bodies and mode `SKILL.md` files; confirm the grammar table matches real inputs. — grammar §3 traced to each mode.
- [x] Set `argumentHint` per command in `command-metadata.json` to the grounded value. — five values set as the SSOT.

### Phase 2: Project to Wrappers
- [x] Replace each wrapper's `argument-hint: "<design request>"` with the matching metadata `argumentHint` (byte-equal). — all five projected verbatim.
- [x] Leave every other frontmatter key untouched (notably `allowed-tools`, owned by D2-R1). — only the `argument-hint` line changed per wrapper.

### Phase 3: Verification
- [x] Run `design-command-surface-check.mjs`; arg-grammar presence + wrapper-equals-metadata checks pass. — `STATUS=PASS invalid=0 drift=0`.
- [x] Confirm no wrapper retains `<design request>`. — grep returns nothing.
- [x] Tokenize one example invocation per command against its grammar. — five-row parse table (§5) parses clean.
- [x] Confirm every `argumentHint` is evergreen (no spec/packet/phase IDs or paths). — grep of the five values + wrapper lines is clean.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Mechanism |
|-----------|-------|-----------|
| Drift gate | Wrapper `argument-hint` == metadata `argumentHint`; no surviving `<design request>` | `node design-command-surface-check.mjs` |
| Grounding review | Each grammar maps to a real positional/flag the mode consumes | Manual read of command body + mode `SKILL.md` |
| Example parse | One invocation per command tokenizes against its grammar slots | Manual tokenization table (Phase 3) |
| Evergreen lint | No spec/packet/phase IDs or paths inside any `argumentHint` | Grep the five values + metadata field |

### Example invocations (must parse against grammar)
- `/design:md-generator https://stripe.com --output .../output` → `<live-url>` + `--output <dir>`
- `/design:audit ./components/Pricing.tsx --scope --score` → `<target>` + `[--scope]` + `[--score]`
- `/design:motion "card hover state" --library` → `<component-state>` + `[--library]`
- `/design:foundations color "dashboard theme tokens"` → `<axis>` + `<target>`
- `/design:interface "pricing page hero" --mode` → `<target>` + `[--mode]`

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Command-metadata SSOT phase (D2-R3) | Internal (sibling phase) | **Hard precedence** | `argumentHint` field + checker do not exist; this phase cannot set the SSOT or drift-check. Sequence AFTER D2-R3. |
| Tool-policy phase (D2-R1) | Internal (sibling phase) | Coordinate | D2-R1 edits `allowed-tools` on the same five wrapper files. Sequential, not parallel — whichever runs second rebases onto the other's frontmatter edit and never clobbers it. |
| Five mode `SKILL.md` files | Internal (read-only) | Green | Source of the grounded grammar; if a mode's inputs change, the grammar must be re-derived. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The checker fails after projection, or a grammar is found ungrounded.
- **Procedure**: Revert the `argumentHint` field in `command-metadata.json` and the five wrapper `argument-hint` lines to their prior values; re-derive the grammar from the mode `SKILL.md` before retrying.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
D2-R3 (command-metadata SSOT + checker) ──> THIS PHASE (populate argumentHint + project to wrappers)
D2-R1 (tool-policy / allowed-tools) ─── sequential on the same wrapper files (no parallel edit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Ground & Populate SSOT | D2-R3 landed | Project to Wrappers |
| Project to Wrappers | Populate SSOT; coordinate with D2-R1 | Verification |
| Verification | Project to Wrappers | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Ground & Populate SSOT | Low | 30-45 minutes |
| Project to Wrappers | Low | 15-20 minutes |
| Verification | Low | 20-30 minutes |
| **Total** | | **~1-1.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Prior `argument-hint` values captured before edit (all five read identical: `<design request>`). — baseline captured.
- [x] Prior `argumentHint` field state in `command-metadata.json` captured. — captured before populating.
- [x] D2-R1 frontmatter state noted to avoid clobbering `allowed-tools`. — `allowed-tools` left exactly as D2-R1 set it.

### Rollback Procedure
1. Restore the five wrapper `argument-hint` lines to `<design request>`.
2. Restore the `argumentHint` field in `command-metadata.json` to its prior state.
3. Re-run `design-command-surface-check.mjs` to confirm the prior baseline.
4. Re-derive grammar from mode `SKILL.md` before a second attempt.

### Data Reversal
- **Has data migrations?** No — frontmatter-line and JSON-field edits only.
- **Reversal procedure**: Git revert of the five wrappers + `command-metadata.json`.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Per-command grammar grounded in real mode inputs
- Hard precedence on the command-metadata SSOT phase (D2-R3); sequential with D2-R1
-->
