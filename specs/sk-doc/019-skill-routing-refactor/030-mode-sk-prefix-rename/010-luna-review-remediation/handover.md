---
title: "Handover: Autonomous implementation of the LUNA review remediation (packet 010)"
description: "Copy-paste dispatch prompt to implement all three remediation phases autonomously via cli-codex GPT-5.6-SOL high/fast agents."
contextType: "handover"
---

# Goal Prompt — Implement packet 010 autonomously (GPT-5.6-SOL high/fast)

> Paste the block below into a fresh Claude Code session on the `sk-doc/0114-mode-sk-prefix-rename`
> worktree. It is self-contained: pre-resolved Gate 3, named workflow, executor spec, scope, and gates.

---

## ROLE & OBJECTIVE

You are the implementation conductor. Autonomously implement **all three phases** of the approved plan in
`.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/010-luna-review-remediation/`
(`spec.md`, `plan.md`, `tasks.md`, `checklist.md`). Drive the work through the **`/speckit:implement`**
workflow; carry out the code/doc changes with **cli-codex GPT-5.6-SOL, high reasoning, fast tier** agents.

## PRE-APPROVED CONTEXT — do not re-ask

- **Spec folder (Gate 3 pre-resolved, your write authority):**
  `.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/010-luna-review-remediation`
- **Source of truth:** this packet's `plan.md` (three phases + phase deps) and the review at
  `030-mode-sk-prefix-rename/review/review-report.md` (verdict CONDITIONAL; R1-P1, R3-P1, R4-P2).
- **Workspace:** worktree `sk-doc/0114-mode-sk-prefix-rename`.

## EXECUTOR — cli-codex GPT-5.6-SOL high/fast (verbatim)

First `Read .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md`, then `command -v codex` and
`codex login status` (ChatGPT OAuth; if not logged in, stop and ask the operator to run `codex login`).
Prefer `/speckit:implement`'s own executor flags if the command contract supports them
(`--executor=cli-codex --model=gpt-5.6-sol --reasoning-effort=high`); otherwise dispatch each phase directly:

```bash
codex exec --model gpt-5.6-sol \
  -c model_reasoning_effort="high" -c service_tier="fast" \
  -c approval_policy=never --sandbox workspace-write \
  "<phase task>. Spec folder: .opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/010-luna-review-remediation (pre-approved, skip Gate 3). Load sk-code and run its surface verification."
```

Single-dispatch discipline: one codex agent at a time — capture its PID at launch
(`codex exec ... & CODEX_PID=$!`), and after its work returns SIGKILL that PID
(`kill -9 "$CODEX_PID"; pkill -9 -P "$CODEX_PID"`) before the next. Never blanket-kill `codex exec`.

## THE THREE PHASES (respect dependencies)

1. **Catalog Alignment (R1-P1).** Replace the twelve unprefixed `workflowMode` keys with the canonical
   `sk-create-*` keys from `sk-doc/mode-registry.json` in **both** live catalog pages —
   `sk-doc/feature-catalog/feature-catalog.md` **and**
   `sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md`
   — preserving the shared `sk-create-skill-parent`. Add an exact set-parity check (catalog prose vs registry).
   Run the catalog + package validators.
2. **Freshness Hardening (R4-P2).** In `sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`,
   make `findManifestDirs()` return traversal failures instead of swallowing them; fold them into the
   text/JSON output and the exit verdict. Add regression tests for injected `EACCES`, multiple failures,
   excluded-before-descent, and happy-path — restoring mocks in `finally`.
3. **Current-State Verification (R3-P1; depends on 1 + 2).** Rerun the sk-doc route-gold + compiled-routing
   parity + root-metadata + leaf-freshness gates into a packet-local evidence directory. Publish
   `current-state-verification.md` that explicitly supersedes phase 008's snapshot and links the rerun
   outputs; add pointers from the parent, 008, and 009 records **without rewriting** their historical results.

## HARD CONSTRAINTS

- **SCOPE LOCK** — touch only files named in the plan's Affected Surfaces table. Do **not** edit
  `hooks/pi/*.ts` or any hook-runtime files: they are broken by in-flight work in other worktrees
  (`0118-hook-runtime-relocation`, `0120-unify-hooks-tree`) and are out of scope.
- **Stale dist (external, not your regression)** — `.opencode/skills/system-spec-kit/mcp-server` dist is
  stale (v4 pi-hook version skew), so `validate.sh --strict` fails with a rebuild demand. Do **not** rebuild
  it and do **not** fix the pi-hooks. Finalize packet metadata with the working scripts generators
  (`.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js` and
  `.../dist/graph/backfill-graph-metadata.js`, then backfill the parent `030` too). Record the blocked
  `--strict` gate honestly as an external blocker.
- **Comment hygiene** — never embed spec paths, packet/phase numbers, or finding ids in code comments;
  write the durable WHY.
- **Git** — never force-push; never `--no-verify`; conventional commits; do not push to `origin` without a
  fresh explicit go-ahead.
- **Finding = hypothesis** — re-read each cited symptom before and after fixing it.

## VERIFICATION (per phase, then final)

- Phase 1: the twelve-key parity assertion passes on **both** catalog pages; `validate_document.py` and
  `validate_catalog_package.py --strict` clean.
- Phase 2: new tests pass (an injected `EACCES` produces a surfaced failure **and** a nonzero exit); the
  gate stays green on clean input; existing metadata gates unaffected.
- Phase 3: route-gold + metadata gates rerun with captured machine output; `current-state-verification.md`
  present with commands, outputs, results, timestamp, and the supersession statement.
- Final: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <010 path> --strict`
  (expect the external stale-dist block — document it), then mark every `checklist.md` item with evidence.

## AUTONOMY & CLOSE-OUT

Run all three phases to completion without pausing for confirmation once dispatched. Report per-phase status
and a final summary: what changed, tests run + results, R1/R3/R4 disposition, and the documented stale-dist
caveat. Do not claim completion until the checklist is evidenced and the two P1 findings are resolved.
