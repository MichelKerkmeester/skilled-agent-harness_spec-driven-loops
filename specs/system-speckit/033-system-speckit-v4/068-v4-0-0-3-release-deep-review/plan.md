---
title: "Implementation Plan: v4.0.0.3 release deep review"
description: "Run the official /deep:review:auto fan-out with three CLI lineages over the v4.0.0.3 release scope, merge the lineage registries, and have a fresh Opus 5.5 high agent write the review report."
trigger_phrases:
  - "v4.0.0.3 review plan"
  - "deep review fan-out plan"
  - "release review lineages"
  - "review synthesis plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4.0.0.3 release deep review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js workflow scripts driving Pi and Devin CLI executors |
| **Framework** | `/deep:review:auto` (`deep-review-auto.yaml`), `fanout-run.cjs`, `fanout-merge.cjs` |
| **Storage** | JSONL state logs and Markdown iteration files under `review/` |
| **Testing** | `check-goal.cjs`, `validate.sh --strict`, iteration counts on disk |

### Overview
The review scope is the set of files added, modified or renamed in `v4.0.0.2..v4.0.0.3`, written to `goal-file-manifest.txt` so the spec-folder scope step reads it. `fanout-run.cjs` runs three CLI lineages in parallel, each to its full iteration count under `--stop-policy=max-iterations`. `fanout-merge.cjs` merges their registries, then a fresh Opus 5.5 high agent writes `review/review-report.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (all three routes answered a smoke prompt on 2026-10-06)

### Definition of Done
- [x] All acceptance criteria met
- [x] Iteration counts on disk match the early stop
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out orchestration: one supervisor process, three independent lineages, one merge.

### Key Components
- **`goal-file-manifest.txt`**: the review scope, one repo-relative path per line.
- **`fanout-run.cjs`**: spawns each lineage in a capped pool (concurrency 3), retries failures, checks artifacts and stop policy.
- **Lineage `steer.md`**: the lead-review file each CLI lineage reads before every iteration; it sets a starting focus area and asks for active expansion.
- **`fanout-merge.cjs`**: merges lineage registries with strongest-restriction (any active P0 means FAIL).
- **Opus 5.5 high synthesis agent**: writes `review/review-report.md` from the merged registry and iteration files.

### Data Flow
Manifest and spec → each lineage's iterations (`review/lineages/<label>/iterations/`) and state log → merged registry → review report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: this phase reports findings and fixes nothing. A remediation packet planned from the report fills this section.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Release files in the manifest | Review target | unchanged | `git status --short` shows no change outside this packet |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fan-out config | `parseFanoutConfig` and `preflightFanoutCapabilities` from `executor-config.ts` |
| Integration | Executor routes | One-turn smoke prompt per route |
| Manual | Run output | Iteration counts, merged registry, report verdict, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi on the ChatGPT sign-in (`openai/gpt-6-luna`) | External | Green | Luna lineage cannot run |
| Pi on OpenCode Go (`opencode-go/deepseek-v4.1-flash`) | External | Green | Switch to `cline-pass/deepseek-v4.1-flash` at `xhigh` |
| Devin (`swe-2-max`) | External | Green | SWE 2 lineage cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lineage writes outside its lineage folder, or the run must start over.
- **Procedure**: delete or archive this packet's `review/` folder; the release files are never touched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Fan-out run) ──► Phase 3 (Synthesis + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Fan-out run |
| Fan-out run | Setup | Synthesis |
| Synthesis + Verify | Fan-out run | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Fan-out run | High | up to 4 hours (the lineage ceiling) |
| Synthesis + Verify | Med | 1 hour |
| **Total** | | **about 5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes: the run writes only review artifacts
- [x] Write containment: `fanout-run.cjs` reports any write outside a lineage folder
- [x] Progress monitored through `review/orchestration-status.log`

### Rollback Procedure
1. Stop the supervisor process by its captured PID.
2. Move `review/` to `review-archive/<timestamp>/`.
3. Confirm `git status --short` shows no change outside this packet.
4. Re-run the fan-out if needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
