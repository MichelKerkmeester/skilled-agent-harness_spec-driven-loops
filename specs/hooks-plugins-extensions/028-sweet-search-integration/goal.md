---
title: "Goal: Sweet-search integration and retrieval improvements"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration"
    last_updated_at: "2026-11-09T18:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Sweet-search integration and retrieval improvements

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Ship three lexical retrieval improvements learned from sweet-search into system-spec-kit, each aligned with sk-code and sk-doc, documented, covered by a playbook scenario and proven by a before and after benchmark.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No embeddings, vector or BM25 fusion, MCP, daemon or new persistent index. |
| D2 | Build 004, 005, 006 in order from phase 3's designs; features 4 and 5 stay deferred. |
| D3 | Build in an sk-git worktree from `worktree-naming.sh create sweet-search-retrieval-build`; one local commit per phase after its gates; merge and push only on an operator yes. |
| D4 | Workers: cli-codex `gpt-6-luna` xhigh fast. Complex work and testing: cli-devin `deepseek-v4-1-flash-max`. Fallback: Luna, devin DeepSeek, cli-pi `opencode-go/deepseek-v4.1-flash` max. Luna never uses another provider. |
| D5 | Workers never commit or run the suite; the conductor reruns every final gate itself. |
| D6 | A phase closes only when its alignment recheck shows 0 open P0 and P1 and its benchmark is filled. |
| D7 | Never pause between phases. Stop only for a hard blocker (auth, every route down, a decision that cannot hold) and report it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-sweet-search-research | `001-sweet-search-research/goal.md` |
| 002-retrieval-lessons-research | `002-retrieval-lessons-research/goal.md` |
| 003-retrieval-feature-design-research | `003-retrieval-feature-design-research/goal.md` |
| 004-total-candidate-count | `004-total-candidate-count/goal.md` |
| 005-stale-index-fallback | `005-stale-index-fallback/goal.md` |
| 006-rg-flood-control | `006-rg-flood-control/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `validate.sh --recursive --strict` on `028-sweet-search-integration` prints `RESULT: PASSED` for it and its six children
- [ ] The system-spec-kit vitest suite has no failure absent from `004-total-candidate-count/scratch/baseline.txt`
- [ ] `lookup-trigger-index.mjs --limit 2 --json` reports `totalCandidates`, finds an uncommitted spec doc's phrase without a rebuild, and `rg-wrapper.mjs structured` lists one row per file
- [ ] Cold-lookup p95 over `runtime/cli/retrieval/fixtures/prompt-set.json` is at or under 200 ms
- [ ] Scenarios 489, 490 and 491 and three retrieval catalog entries exist, and both package validators exit 0
- [ ] `/local-skilled-alignment` recheck from the pre-004 commit to the 006 commit shows 0 open P0 and P1 findings
- [ ] `006-rg-flood-control/benchmark/summary.md` holds before and after tables for phases 004, 005 and 006 with measured values
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phases 001-003 | Done | Research committed in `24fef5fdf5` |
| Phase 004 | Done | `fcab2a3c33` in worktree 335 |
| Phase 005 | Done | `214ad8b5cb` in worktree 335 |
| Phase 006 | Done | `0b783907d3` in worktree 335 |
| Criterion: recursive validate | Met | Parent and six children each print `RESULT: PASSED` |
| Criterion: suite | Met | 4110 passed, 0 failed (baseline 4071 passed, 0 failed) |
| Criterion: lookup and wrapper | Met | `--limit 2` on "trigger index": `totalCandidates` 801; an untracked temp spec doc's phrase found via `staleFallback` without a rebuild; "iteration" over the phase 2 research folder: 14 rows, 14 files, schema 2 |
| Criterion: latency | Met | Prompt-set p95 151.7 ms at HEAD (max 195.7); `measure-cold-lookup.mjs` exit 0 |
| Criterion: scenarios and catalog | Met | 489, 490, 491 and three retrieval catalog entries; both validators exit 0 |
| Criterion: alignment | Met | Battery over `3378c36a06..HEAD` (104 files): 73 pass, 1 fail (S9, environment); final rechecks of all three phase runs: 0 open P0 and P1 (`006-rg-flood-control/alignment/final-recheck.md`) |
| Criterion: benchmark summary | Met | `006-rg-flood-control/benchmark/summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 005 discovery | `git status` measured 0.8-1.1 s, so discovery diffs a `specs/` walk against the index paths (phase 5 spec section 10) |
| `/speckit:search` | Runs the raw ripgrep recipe, so it does not get one row per file; its presentation says so. Routing it through the wrapper is a follow-up outside this packet |
| Open P2s | S9 (gitignored SQLite absent from a fresh worktree), CR-3 (`AGENTS.md` Gate 1 wording), C-002 (`SPECKIT_RG_BIN` env docs), all pre-existing or out of scope |
| Tool defect | `recheck.cjs:90` tests a literal fix's old text before its new text, so a fix whose new text contains the old stays open; amendment: test `fix.new` first when it contains `fix.old` |
<!-- /ANCHOR:log -->
