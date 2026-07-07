---
title: "Implementation Plan: Multi-AI Council main-agent write enforcement [system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement/plan]"
description: "Sequenced plan for adding the missing enforcement gates to the Multi-AI Council agent body across all 4 runtime mirrors. Phase 1 audits the current body for the exact insertion points and confirms the parity-test coverage. Phase 2 authors the enforcement edits in a single mirror as the canonical reference. Phase 3 propagates to the other 3 mirrors and updates reference docs. Phase 4 runs the sandbox smoke + parity test."
trigger_phrases:
  - "100 plan"
  - "council main agent enforcement plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement"
    last_updated_at: "2026-05-09T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted 4-phase plan"
    next_safe_action: "Author tasks.md with bullet-level work items"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-main-agent-enforcement-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Multi-AI Council main-agent write enforcement

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

This plan implements the enforcement gates defined in `spec.md` §3 SCOPE. The work is body-text edits to a single agent file (and reference docs), then mirror propagation. There is no library code to write, no schema migration, no permission change. The risk surface is narrow: parity drift across the 4 runtime mirrors and the §9 SELF-CHECK actually being honored by the agent at runtime.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- 4-runtime parity test (from packet 098) MUST pass after body changes.
- `validate.sh ... --strict` MUST exit 0 on this packet's spec folder.
- Sandbox Smoke A and B (defined in `tasks.md` T-4.3 and T-4.4) MUST match expected behavior.
- §9 SELF-CHECK Q11 MUST be answerable YES at completion.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Body-only edits in 4 mirrored agent files plus 2 reference docs. No new modules, no schema changes, no permission changes. The enforcement lives entirely in the agent's reasoning loop (instruction text the LLM reads on dispatch) backed by the existing `lib/persist-artifacts.js` writer surface from packet 098.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit & Confirm Insertion Points

**Goal**: Lock down WHERE the new language lives in each mirror before authoring. Confirm the parity test from packet 098 actually checks the body sections we are touching; if not, plan a parity-test extension.

**Steps**:

1. Read the current `.opencode/agents/multi-ai-council.md` §1 (workflow), §7 (rules), §9 (verification), §12 (output protocol), §13 (invocation contract) — confirm line ranges for each section.
2. Diff against `.claude/agents/multi-ai-council.md` and `.gemini/agents/multi-ai-council.md` to confirm the 3 markdown mirrors have IDENTICAL body text (modulo frontmatter). If they diverge, document the divergence and sync first.
3. Read `.codex/agents/multi-ai-council.toml` and confirm how the body content is encoded (likely as multi-line TOML strings under `[body]` keys). Map the 5 sections to their TOML keys.
4. Locate the parity test from packet 098: `find .opencode/skills/system-spec-kit -name 'multi-ai-council-runtime-parity*'`. Read it. Confirm whether it checks frontmatter only, or body text too.
5. If the parity test only checks frontmatter, draft the extension scope (will be a new task in `tasks.md`).
6. Confirm the `lib/persist-artifacts.js` exports list matches what the new §13 numbered sequence references. Read the file.

**Exit criteria**: Section line ranges documented per mirror. Parity-test coverage confirmed. Library exports list confirmed.

### Phase 2: Author Canonical Edits in `.opencode` Mirror

**Goal**: Produce the single canonical reference version of the body changes. Other mirrors copy from this.

**Steps**:

1. Edit `.opencode/agents/multi-ai-council.md` §1: insert Step 0 RESOLVE before step 1 RECEIVE. Use the 4-stage resolution rule from `spec.md` §3 In Scope.
2. Edit §7 ALWAYS: append the hard write-or-fail rule. Edit §7 NEVER: append the mirror constraint.
3. Edit §9 OUTPUT VERIFICATION: append the PERSISTENCE VERIFICATION block. Update the SELF-CHECK 10-question list to 11 questions. Update the failure-handler line.
4. Edit §12 OUTPUT PROTOCOL: replace the conditional opening with the unconditional version. Cite Step 0 RESOLVE.
5. Edit §13 INVOCATION CONTRACT: restructure the first-call paragraph as a numbered checklist with explicit writer-function calls. Each step ends with "(emit artifact_written)" except the dispatch step.
6. Run a self-read of the file, end-to-end, looking for stale references to "planning-only" or "When invoked with a spec_folder" that the edits missed.

**Exit criteria**: `.opencode/agents/multi-ai-council.md` carries all 5 enforcement edits. No stale conditional language remains.

### Phase 3: Propagate to Mirrors + Update References

**Goal**: Sync the canonical edits to the 3 other runtime mirrors and the 2 reference docs.

**Steps**:

1. Apply the same edits to `.claude/agents/multi-ai-council.md` byte-for-byte.
2. Apply the same edits to `.gemini/agents/multi-ai-council.md` byte-for-byte.
3. Apply the equivalent edits to `.codex/agents/multi-ai-council.toml`, encoded into the appropriate TOML body keys.
4. Edit `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md`: prepend the persistence-mandatory paragraph; cite the new §1 Step 0 RESOLVE.
5. Edit `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`: append the council_complete-required paragraph.

**Exit criteria**: 4 agent files + 2 reference docs all carry the new language. Manual diff confirms parity.

### Phase 4: Verify

**Goal**: Run the parity test, the spec validator, and a sandbox smoke.

**Steps**:

1. Run the existing 4-runtime parity test from packet 098. If it fails because it now covers body changes that didn't propagate, fix the missed propagation and re-run.
2. If Phase 1 found the parity test does NOT cover body sections, extend it to cover §1, §7, §9, §12, §13 byte-equivalence (modulo the runtime-specific frontmatter prelude).
3. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement --strict`. Expect exit 0.
4. Sandbox smoke A: dispatch the council against a small planning question via opencode main-agent slot WITHOUT naming a spec folder. Expected behavior: the agent HALTs at Step 0 RESOLVE and emits the question. No `ai-council/` directory anywhere.
5. Sandbox smoke B: re-dispatch naming this packet (`skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement`) as the spec_folder. Expected behavior: the canonical artifact set materializes under `<packet>/ai-council/`, ending with `council_complete` event in the state log.
6. Author `implementation-summary.md` with the actual results of smokes A and B and the parity-test outcome.

**Exit criteria**: Parity test passes. Validator passes strict. Both smoke runs match expected behavior. `implementation-summary.md` filled (no `[###-feature-name]` placeholders) and continuity frontmatter updated to `completion_pct: 100`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two sandbox smoke tests cover the user-facing behavior change:
- **Smoke A** (negative path): no-packet invocation must HALT-and-ASK; no `ai-council/` directory created anywhere.
- **Smoke B** (positive path): packet-named invocation must produce the canonical artifact set ending with `council_complete` event.

The 4-runtime parity test from packet 098 covers the structural regression risk. If that test only checked frontmatter pre-100, T-3.6 extends it to body sections §1, §7, §9, §12, §13.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 098 scoped-write permissions (already shipped, all 4 mirrors).
- `lib/persist-artifacts.js` named exports (already shipped per packet 098).
- Existing 4-runtime parity test (extend if needed).
- No external library, schema, or runtime dependencies.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Body-only changes are easily reverted via `git checkout`. If the new enforcement causes any agent to fail-loop on Step 0 RESOLVE because of a resolution-rule bug, revert the §1 edit in all 4 mirrors as the first action; the other 4 sections are independently safe to keep.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (audit) gates Phase 2 (canonical edit) — line ranges and section maps are inputs.
Phase 2 gates Phase 3 (mirror propagation) — the canonical reference must exist before copying.
Phase 3 gates Phase 4 (verify) — parity test fails on partial propagation.
T-3.6 (parity-test extension) is conditional on T-1.5 (parity-test coverage audit).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

- Phase 1: 30 min (audit + line-range map).
- Phase 2: 60 min (canonical edit + self-review).
- Phase 3: 45 min (mirror propagation + 2 reference doc edits).
- Phase 4: 30 min (parity + validator + 2 smokes + summary).
- Total: ~3 hours wall-clock for a single-agent dispatch with no parallelism.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If the §1 Step 0 RESOLVE wording introduces a resolution bug that loops the agent, revert by section in this order:
1. Revert §1 Step 0 across all 4 mirrors (highest-leverage rollback; restores prior unrooted behavior).
2. If §9 PERSISTENCE VERIFICATION self-check causes false-NO loops, revert §9 across all 4 mirrors.
3. The §7, §12, §13 edits are independently safe and can stay even if §1 / §9 are reverted.
4. Reference doc edits (folder-layout.md, state-format.md) are documentation-only and never need revert.

Per-section revert keeps the partial-fix value of edits that are independently sound.
<!-- /ANCHOR:enhanced-rollback -->

## Open Questions Routed from `spec.md`

- Q1 (HALT-and-ASK vs auto-staging) — resolved during Phase 2 by the wording chosen for Step 0 sub-step 4. If user pushes back during smoke testing, revisit.
- Q2 (Read-after-Write verification) — resolved during Phase 2 by NOT adding the Read item. Existing checksum is the authority.
- Q3 (--no-persist flag) — explicitly deferred to a follow-on packet if needed.
