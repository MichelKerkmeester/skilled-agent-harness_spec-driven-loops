---
title: "Feature Specification: CLI-executor fan-out parity across every provider and model"
description: "The deep-loop fan-out claims seven executor kinds (native, cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi) but they are not all reachable end-to-end. cli-pi's fan-out lineage builder is a hard stub that throws; cli-devin's default permission mode auto-denies exec; per-mode executor availability is uneven across the deep modes; and nothing tests that each cli/provider/model combination actually dispatches through the fan-out and returns real output. This phased packet audits the full executor/provider/model matrix, wires the gaps, and proves every combination works with an end-to-end test matrix. Phase parent for a six-phase program."
trigger_phrases:
  - "cli executor fanout parity"
  - "every cli provider model combo works"
  - "wire cli-pi into the deep-loop fanout"
  - "buildPiLineageCommand stub"
  - "deep-loop executor matrix audit"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-cli-executor-fanout-parity"
    last_updated_at: "2026-07-29T09:20:00Z"
    last_updated_by: "claude"
    recent_action: "All six phases delivered; packet reconciled to Complete"
    next_safe_action: "Operator ff-merge of the branch to v4 at their discretion"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions:
      - "Which deep modes should expose which executor kinds — is full parity required, or are some modes deliberately single-executor?"
      - "How is cli-devin's exec write path made reliable given accept-edits auto-denies exec?"
    answered_questions:
      - "Placement = a new top-level phased packet under system-deep-loop, separate from 036"
      - "cli-pi's fan-out lineage builder is a hard stub that throws; direct pi -p dispatch works but the fan-out path does not"
      - "codex/claude-code/opencode use pass-through model validation; pi/cursor/devin enforce allowlists"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; the detailed executor/provider/model matrix and gap register live in 001-executor-matrix-audit. -->

# Feature Specification: CLI-Executor Fan-out Parity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/043-cli-executor-fanout-parity |
| **Level** | phase parent (Level 3) |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Owner skill** | system-deep-loop (owns the fan-out runtime and executor config) |
| **Origin** | Operator: "analyze all cli modes on v4 (pi, cursor, devin, codex, claude code) and that fan-out executors work for every cli / provider / model combo" |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop fan-out declares seven executor kinds in `EXECUTOR_KINDS`, but they are not uniformly reachable end-to-end. A
read-only audit on 2026-07-29 found: **cli-pi's `buildPiLineageCommand` is a hard stub that throws** ("command construction is
unavailable until its headless invocation contract is confirmed") even though direct `pi -p` dispatch works; **cli-pi's flag-support
table omits `reasoningEffort`** although pi exposes `--thinking`; **cli-devin's default `accept-edits` permission mode auto-denies
exec and stalls**, so only its read-only path is proven; **per-mode executor availability is uneven** (deep-research/review/alignment
reference many executor branches while ai-council, agent-improvement, and skill-benchmark reference very few); and there is **no
end-to-end test** that dispatches each cli/provider/model combination through the fan-out and asserts real output.

### Purpose
Make the fan-out honest: every executor kind the config advertises must dispatch through the real fan-out for every provider and
model it claims, or be explicitly and enforceably scoped out. Freeze an authoritative support matrix, wire the gaps, and prove the
result with an end-to-end combination test.

### Non-Goals
- New executor kinds beyond the seven already declared.
- Changing model rosters beyond what the CLIs actually support.
- Any deep-loop behavior change unrelated to executor dispatch.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The executor config (`executor-config.ts`): `EXECUTOR_KINDS`, flag-support tables, model rosters/allowlists.
- The fan-out lineage builders (`fanout-run.cjs`) for all seven kinds.
- Per-mode executor availability across the deep modes (research, review, alignment, ai-council, improvement family).
- An end-to-end combination test matrix over (cli, provider, model).

### Out of Scope
- The direct (non-fan-out) CLI dispatch path used by the orchestrator.
- CLI binaries themselves and their upstream provider credentials.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## PHASE MAP & OUTCOMES

| Phase | Child | Kind | Outcome |
|-------|-------|------|---------|
| **001** | `001-executor-matrix-audit` | leaf | Freeze the authoritative (cli × provider × model × mode) support matrix mapping config ↔ fan-out builder ↔ CLI reality; produce a gap register with a disposition for every gap. |
| **002** | `002-cli-pi-fanout-wiring` | leaf | Implement the real `buildPiLineageCommand` (`pi -p --offline --provider/--model --thinking`, output-text not exit code, cwd not `--dir`); add `reasoningEffort`→`--thinking` to the cli-pi flag table; tests. |
| **003** | `003-devin-cursor-exec-hardening` | leaf | Resolve cli-devin's accept-edits exec auto-deny (a reliable write path) and cli-cursor's npm-in-sandbox containment; prove both execute writes through the fan-out. |
| **004** | `004-per-mode-executor-parity` | leaf | Make every deep mode expose the intended executor set (or enforce a documented single-executor scope); close the ai-council / agent-improvement / skill-benchmark coverage gaps. |
| **005** | `005-combo-test-matrix` | leaf | An end-to-end test that dispatches a trivial fan-out leaf for each supported (cli, provider, model) combination and asserts real output — the "works for every combo" proof, with skips logged, never silent. |
| **006** | `006-docs-and-closeout` | leaf | Update executor-config docs and each cli-X SKILL.md cross-reference; reconcile packet metadata; closeout. |

### Sequencing invariants
1. The matrix audit (001) freezes the gap register before any wiring.
2. cli-pi wiring (002) precedes the combo test (005) that must cover it.
3. The combo test (005) runs only after 002-004 close their wiring gaps, and logs every skipped combination explicitly.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. An authoritative support matrix exists: every (cli, provider, model) combination is either proven-reachable through the fan-out or explicitly, enforceably scoped out with a reason.
2. `buildPiLineageCommand` constructs a real headless pi invocation; cli-pi dispatches through the fan-out for every model in its allowlist.
3. cli-devin and cli-cursor execute writes reliably through the fan-out, or their limitation is enforced and documented.
4. Every deep mode's exposed executor set matches its documented intent.
5. The combination test matrix passes for every supported combo and logs every skip; no silent gaps.
6. `validate.sh --strict --recursive` is Errors 0 across the packet.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Provider credentials** — a combo test needs each provider reachable; missing credentials must produce an explicit skip, never a false pass (pi's exit code is not an auth signal).
- **Shared fan-out blast radius** — changes touch the runtime every deep mode uses; each phase re-runs the fan-out test suite as a no-regression gate.
- **Concurrent executor packets** — 041 (cli-devin wiring) and the 034/038/039/042 executor lineage packets touch adjacent surfaces; audit against the current origin tip and avoid write-set collisions.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is full per-mode executor parity required, or are some modes deliberately single-executor (e.g., alignment)?
- What is the reliable cli-devin exec write path given accept-edits auto-denies exec?
- Should the combo test dispatch real (credentialed) provider calls, or a stubbed transport that proves command construction only?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-executor-matrix-audit/ | Authoritative cli×provider×model×mode matrix + gap register | Complete |
| 002 | 002-cli-pi-fanout-wiring/ | Real buildPiLineageCommand + cli-pi flags + tests | Complete |
| 003 | 003-devin-cursor-exec-hardening/ | devin + cursor read-only/workspace flags from live CLI behavior | Complete |
| 004 | 004-per-mode-executor-parity/ | model-benchmark + ai-council parity; skill-benchmark exempt-by-design | Complete |
| 005 | 005-combo-test-matrix/ | Construction-coverage matrix (117 combos) + read-only ambient-config isolation | Complete |
| 006 | 006-docs-and-closeout/ | Docs + closeout; packet reconciled to Complete | Complete |

### Phase Transition Rules
- Each phase MUST pass `validate.sh` independently before the next begins.
- Run `validate.sh --recursive` on this parent to validate all phases as a unit.
- Use `/speckit:resume [parent]/[NNN-phase]/` to resume a phase.
<!-- /ANCHOR:phase-map -->
