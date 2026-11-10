---
title: "Decision Record: Phase 6: deep-loop-single-executor-dispatch"
description: "Decisions taken without an operator while planning and implementing the single-executor dispatch fixes: the dsh single-executor choice, workflow deviations and every worker and review call."
trigger_phrases:
  - "deep loop single executor dispatch decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/006-deep-loop-single-executor-dispatch"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with every worker, review and adjudication recorded"
    next_safe_action: "Start phase 007"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 6: deep-loop-single-executor-dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Refuse single-executor cli-deepseek-harness instead of building a dispatch path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation Orchestrator A (operator unavailable; goal G3 and G7 pre-authorize the call) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`cli-deepseek-harness` is listed in `EXECUTOR_KINDS` (`executor-config.ts:19`), but no single-executor YAML branch exists for it, and the shared builder throws `requires a lineage directory` without one (`fanout-run.cjs:3002`). A note in `deep-research-auto.yaml:1579` still describes a single-executor dsh dispatch. The fan-out launch path gives dsh four things a single-executor branch does not have today: a lineage working directory, a fresh `DSH_HOME` outside the checkout, the `DSH_SPEC_FOLDER` marker re-injected past the env allowlist, and the `validateDshCompletion` check on its JSON event stream (`fanout-run.cjs:3589-3700`, `:4031`).

### Constraints

- Prompt-pack paths are repository-relative, while dsh runs from the lineage directory.
- `buildExecutorDispatchEnv` drops every `DSH_` key, so `runAuditedExecutorCommand` cannot carry `DSH_HOME` without a change to the shared env allowlist.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: an `if_cli_deepseek_harness` branch in both auto YAMLs that exits 2 with a message naming fan-out (`--fanout`) as the supported path, and a corrected note.

**How it works**: the branch prints the refusal to stderr and exits 2 before any dispatch receipt is written, so the run fails closed instead of falling through. The `pre_dispatch_audit` provenance row for the attempted executor is written earlier and remains, which the branch note now says.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fail-closed refusal branch** | Honest, two short branches, no shared-contract change | Single-executor dsh stays unavailable | 8/10 |
| Full single-executor dsh branch | Gives the operator a working fallback | Needs absolute prompt paths, a `DSH_` env allowlist change and the completion validator in the single path; a design of its own with the highest blast radius in this phase | 4/10 |

**Why this one**: the finding is that an admitted kind has no honest single-executor behavior. A refusal closes that with the cheapest move, and the full branch is recorded as an extension for its own packet.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A single-executor run on dsh stops at once with a message, instead of an unexplained throw or a silent fall-through.

**What it costs**:
- The operator's DeepSeek fallback for a single-executor loop remains cli-pi or cli-opencode on `opencode-go/deepseek-v4.1-flash`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller relied on the undefined fall-through | L | No caller can: the builder throws before any dispatch today |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V02 is a verified P1 |
| 2 | **Beyond Local Maxima?** | PASS | The full branch was weighed and its cost named |
| 3 | **Sufficient?** | PASS | The kind can no longer reach the throwing builder from the single path |
| 4 | **Fits Goal?** | PASS | Goal G3 fixes verified findings; this closes V02 |
| 5 | **Open Horizons?** | PASS | The refusal branch is the slot a later full branch replaces |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `if_cli_deepseek_harness` in `deep-research-auto.yaml` and `deep-review-auto.yaml`; the dsh note in `deep-research-auto.yaml`.

**How to roll back**: revert the phase commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:run-decisions -->
## Run Decisions Log

| ID | Decision | Why | Evidence |
|----|----------|-----|----------|
| D-01 | Run `/speckit:plan:auto` step 5 with its inline fallback instead of four parallel `@context` agents | This orchestrator is a leaf and may not dispatch agents; the YAML names the fallback `Use inline planning activities below` | `speckit-plan.yaml` step_5 `inline_parallel_exploration.fallback` |
| D-02 | Skip the per-phase `research/research.md` that plan step 5 lists | The parent synthesis already holds the verified evidence for every finding in scope; a copy would drift | `../research/research.md` sections 2, 3 and 6 |
| D-03 | Use a focused persona summary for `@code` and `@review` in worker briefs | `code.md` is 49 KB and `review.md` 32 KB; the prompt card allows a focused summary for large files | `sk-prompt/assets/cli-prompt-quality-card.md` section 6.3 |
| D-04 | Map an unset opencode sandbox to `danger-full-access` and forward an explicit one | Matches the fan-out mapping; `finalizeLineageCommand` then rejects confinement OpenCode cannot enforce (first pass hardcoded it; changed after review) | `fanout-run.cjs` `finalizeLineageCommand`; review P2-3 |
| D-05 | Workers: cli-codex `gpt-6-luna` high fast for the opencode builder, field drift, dsh refusal, tool cap, persona, contract test and two fix rounds; cli-pi `opencode-go/deepseek-v4.1-flash` max for the copilot deletion and the presentation and note text | Goal G4 tiers; cli-devin `deepseek-v4-1-flash-max` probe returned `resource_exhausted`, so DeepSeek ran through cli-pi | probe output `"cognition.ai/errorKind": "resource_exhausted"` |
| D-06 | Treat the worker-reported `resumes a future checkpoint` failure as a sandbox artifact | The same file passes 175 of 175 outside the codex sandbox; the test uses an 800 ms deadline the sandboxed start misses | `npx vitest run tests/unit/fanout-run.vitest.ts` outside the sandbox: 175 passed |
| D-07 | Review adjudication (DeepSeek reviewer, verdict PASS, 6 P2): fixed dsh note wording, persona order, sandbox forwarding, presentation `type` to `kind`, stdin note plus `input === ''` test; accepted the argv-size P2 as a recorded limitation | Each fixed item was confirmed against the tree; the argv risk is measured headroom, not a failure | `implementation-summary.md` Known Limitations |
| D-08 | Regenerate `compiled/deep-{research,review}.contract.markdown` as the orchestrator, never through a worker | The brief bars workers from generators; the files are digests of the edited sources | dry print diffs clean after `--write` |
| D-09 | Fix two caller tests the first full rerun exposed instead of reverting | `prompt-pack.vitest.ts` renders the template and needed the new variable; `fanout-loop-prompt-in-process.test.ts` matched a line inside the inlined persona; both are direct callers under scope rule section 2, and no expectation was loosened | final runtime run 2853 passed, 0 failed |
| D-11 | Skip the continuity writer (`generate-context.js`) in plan step 6 and implement step 8; continuity frontmatter is refreshed by hand | V28 shows the writer can resolve an unrecognised project root to the shared Skilled checkout, which this orchestrator must not write | `../research/research.md` V28 |
| D-12 | Commit with `SPECKIT_SKIP_SPEC_REMINT=1` after running `repair-derived.cjs --apply` on the parent and this phase under the commit lock | The remint hook refuses any commit staging 047 docs while another child has unstaged edits, and refuses pathspec-narrowed commits; orchestrator B shares the worktree, so its drafts are always unstaged. The lead approved this bypass for the remint check only; every other hook runs. The lead runs one final repair and an unbypassed commit after all phases close | lead message approving option (a); hook output `BLOCKED [gate:spec-remint]` |
| D-10 | Leave the parent phase map's duplicate placeholder rows alone and update only this phase's first row | The parent `spec.md` is shared with orchestrator B; deduplicating it is outside this phase | parent `spec.md` phase map |
<!-- /ANCHOR:run-decisions -->
