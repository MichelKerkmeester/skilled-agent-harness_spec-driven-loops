---
title: "Research: session relaunch loop after phase 008"
description: "Merged fan-out research (DeepSeek V4.1 Flash max and GPT-6 Luna max fast, five iterations each) on drift, latent bugs, architecture and sk-code-skilled and sk-doc alignment, with orchestrator verification of every finding."
trigger_phrases:
  - "session relaunch research"
  - "session relaunch architecture"
importance_tier: normal
contextType: research
---
# Research: Session Relaunch Loop After Phase 008

Two lineages researched the loop after phase 008 on 2026-10-19 from `e474943f8f`. Per-lineage syntheses: `lineages/deepseek/research.md` and `lineages/luna/research.md`. Attribution: `fanout-attribution.md`.

| Lineage | Executor | Iterations | Runner status |
|---|---|---|---|
| deepseek | cli-opencode, `llmgateway/deepseek-v4.1-flash`, variant max | 5 | fulfilled |
| luna | cli-codex, `gpt-6-luna`, effort max, tier fast | 5 | rejected by the runner: the append gateway refused to project iterations 2 to 5 (`Projection replace would drop keys from the existing config row`). All five iteration files and its synthesis are on disk |

## 1. Verified Findings

The orchestrator read each cited location before accepting a finding. "Confirmed" means the code or record shows the defect. "Plausible" means the code path exists but the triggering condition was not reproduced.

### Bugs

| ID | Finding | Verdict | What was read |
|---|---|---|---|
| A1 | Claude `stop-arm` falls back to `process.ppid`, the `bash -c` hook shell, when `CLAUDE_PID` is unset; Codex already walks to the loop's direct child | Confirmed | `claude/stop-arm.mjs:131`; `.claude/settings.json:192` wraps the hook in `bash -c` |
| B4 | The Claude background-task guard runs only for a pending record, so an armed record whose killer died can be re-armed over live tasks | Confirmed | `claude/stop-arm.mjs:108-112` |
| C1 | `handoffText` writes the spec-folder value into the note frontmatter unvalidated; a newline adds keys | Confirmed | `lib/nudge.cjs:76-94` |
| D2 | `parseHandoff` accepts `status : open`, but `updateFrontmatter` matches only `status:`, appends a duplicate, and the next parse throws | Confirmed | `lib/relaunch-core.cjs:119` against `:194-201` |
| D3 | `consume`'s fallback parse marks a valid `spec_folder: none` invalid on an unrelated parse error | Confirmed | `bin/session-relaunch.cjs:520-533` |
| L3 | `consume` deletes the relaunch record and reports success when the note is missing or unreadable, so the wrapper launches a claim that cannot succeed | Confirmed | `bin/session-relaunch.cjs:504-550` |
| L1 | A symlinked handoffs directory passes containment, since both real paths resolve under the symlink target; phase 008's owner-only claim holds only for a real directory | Confirmed, low reach | `bin/session-relaunch.cjs:128-190`; `lib/nudge.cjs` `ensureHandoffDir` |
| D1 | `shouldRelaunch` approves an armed record with no handoff, and the wrapper then exits 1, discarding the runtime's exit code | Confirmed, low reach | `lib/relaunch-core.cjs` `shouldRelaunch`; `.skilled/bin/skilled-loop:420-430` |
| L2 | A failed `consume` leaves the seed without its spec-folder suffix, so the receiver asks Gate 3 again | Plausible | `.skilled/bin/skilled-loop:456-465` |
| B1 | The OpenCode plugin treats an existing note as written outside a loop, but an unreadable note as open in the seed path | Confirmed, outside-loop only | `.opencode/plugins/session-relaunch.js:58-80` |
| E1 | `resolveWindow` reads `.claude/settings*.json` only under the session cwd, so a session started in a subdirectory may fall to 200000 | Plausible: depends on whether Claude Code reports the subdirectory as cwd | `lib/context-usage.cjs:173-183` |

### Drift (two introduced by phase 008)

| ID | Finding | Verdict |
|---|---|---|
| G1 | `/speckit:handoff` says `prepare` leaves open notes unchanged; phase 008 made it complete this session's open notes. The README names only the claimed half | Confirmed, phase 008 drift (`handoff.md:133`, `README.md:141`) |
| C3 | The env reference says Claude and Codex take `spec_folder` from the hook payload; no host sends that field, only tests set it. The note is the real carrier | Confirmed, phase 008 drift (`ENV-REFERENCE.md:113`) |
| G3 | `CLAUDE_PID` has no env-reference row | Confirmed |
| G4 | The README record table calls every arm event a Stop event; Pi, OpenCode and Hermes arm on other events | Confirmed (`README.md:127`) |
| G5 | The command saves continuity before the note; the nudge text writes the note first | Confirmed |
| G7 | The tests README omits the OpenCode plugin suite | Confirmed |
| L4 | The parent spec Branch field and goal D6 still name worktree 142 | Confirmed (`spec.md:34`, `goal.md:52`) |
| G2 | Three docs say `CLAUDE_PID` serves only the shell-child check; `stop-arm` also uses it as the kill target | Confirmed (`handoff.md:21`) |
| C2 | The nudge's "exact shape" example prints a placeholder that `prepare` rejects | Confirmed (`lib/nudge.cjs:76-78`) |
| G6 | Phase 002 still lists the OpenCode `session.idle` capture as a limitation that later runs closed | Not verified |

### Architecture

Both lineages independently recommend the same shape: if two adapters need the same decision, it belongs in the core. Candidates are kill-target resolution (A3: five adapters, four strategies), note-state classification (B1), spec-folder normalization (C1), and the constants each adapter copies (F1: CLI path, section names, seed phrase). Each adapter keeps host-event parsing and delivery. A table-driven conformance suite over all five adapters (B3) should land first, so it records current behavior and then proves the move changed nothing. This is a design recommendation, not a defect.

### Standards alignment

- sk-code-skilled: no P0 or P1 checklist violation in the reviewed files (headers, strict mode, naming, quoting, constants). The gaps are DRY (F1) and the canonical-path and symlink item in the universal checklist (L1).
- sk-doc: the README and command meet their templates. The gaps are accuracy (G1 to G7, C3).

## 2. Outside This Packet

The deep-loop append gateway refused Luna's iterations 2 to 5: a projection would drop keys from the config row, and the dispatcher requires a `findingsCount` field the deep-research delta contract omits (`runtime/lib/legacy-projections/shadow-projection-store.ts:204-233`, `deep-research-deltas-contract.ts:78-83`). The runner then rejected a lineage whose research completed. This belongs to system-deep-loop, not the relaunch loop.

## 3. Recommended Order

1. Bugs A1, B4, C1, D2, D3 and L3, each with a failing-first test.
2. The phase 008 drift G1 and C3, then G2 to G5, G7, C2 and L4 in one docs pass.
3. L1 and D1, the low-reach hardening.
4. The conformance suite, then the core consolidation (A3, F1).
