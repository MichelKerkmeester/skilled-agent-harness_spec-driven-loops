---
title: "Implementation Plan: Phase 4: Remediate Agent Files (Both Runtimes)"
description: "Fixes 9 confirmed AGT findings in dependency order: the S4 frontmatter-schema root cause (AGT-03/AGT-08) lands first in create-agent's authoring skill so it stops generating AGT-02-class bugs, then the one miswired instance (AGT-02) and the validator enforcement (AGT-09) that depend on it, then the 5 independent instance-level findings, with AGT-05 recorded as an operator-gated deferral."
trigger_phrases:
  - "implementation"
  - "plan"
  - "agent frontmatter schema"
  - "remediation agents"
  - "plan core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/004-remediation-agents"
    last_updated_at: "2026-07-11T08:49:20Z"
    last_updated_by: "fable-5"
    recent_action: "Authored ordered fix plan for 9 AGT findings; bumped to Level 2"
    next_safe_action: "Execute Phase 1 (AGT-03+AGT-08) per L2 Phase Dependencies"
    blockers:
      - "AGT-05 fix is gated on an operator design decision (.codex/agents restore vs remove)"
    key_files:
      - ".opencode/skills/sk-doc/create-agent/SKILL.md"
      - ".opencode/skills/sk-doc/create-agent/assets/agent_template.md"
      - ".claude/agents/deep-improvement.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 4: Remediate Agent Files (Both Runtimes)

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Markdown + YAML frontmatter (agent definitions), Python 3 (`validate_document.py`) |
| **Framework** | None — agent definition files and an authoring skill, not application code |
| **Storage** | None |
| **Testing** | Manual `grep` assertion per finding (spec.md SC-001..SC-009), `validate_document.py --type agent` self-test, `validate.sh --strict` on this spec folder |

### Overview
Apply 9 confirmed, pre-researched findings (AGT-01..AGT-09) in dependency order. The S4 root cause — `create-agent` emitting only OpenCode's `permission:` schema for both runtimes — is fixed first (AGT-03, bundled with the wording fix AGT-08) so the one downstream miswired instance (AGT-02) and the new validator enforcement (AGT-09) have a finalized schema rule to apply. The remaining 5 findings (AGT-01, AGT-04, AGT-06, AGT-07, and the AGT-05 deferral) are independent and execute in any order after Phase 1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2, §3 — 9 findings with exact file:line evidence, re-verified against research.md)
- [x] Success criteria measurable (spec.md §5 SC-001..SC-009, each a grep or validate.sh assertion)
- [x] Dependencies identified (AGT-03 blocks AGT-02/AGT-09; AGT-05 blocked on operator decision)
- [x] NFRs defined with targets (spec.md §"L2: NON-FUNCTIONAL REQUIREMENTS")

### Definition of Done
- [ ] All P1 acceptance criteria met (REQ-001..REQ-004 / SC-001..SC-004)
- [ ] All P2 acceptance criteria met or explicitly deferred (REQ-005..REQ-009 / SC-005..SC-008)
- [ ] Docs updated (spec/plan/tasks/checklist all reflect final state)
- [ ] Checklist items verified (`checklist.md` P0/P1 rows evidenced)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config/documentation remediation (dual-runtime mirror + authoring-contract fix) — not an application architecture pattern.

### Key Components
- **`create-agent/SKILL.md`**: authoring contract that dictates the frontmatter schema every future `/create:agent` run emits (AGT-03, AGT-08 fix this).
- **`create-agent/assets/agent_template.md`**: the literal scaffold copied when authoring a new agent; must match SKILL.md's schema guidance (AGT-03).
- **`.claude/agents/*.md` (12 files)**: Claude Code runtime mirror; enforces `tools:` frontmatter only.
- **`.opencode/agents/*.md` (12 files)**: OpenCode runtime mirror; enforces `permission:` frontmatter only.
- **`validate_document.py`**: the QA gate that currently has zero agent-frontmatter schema awareness (AGT-09 adds it).

### Data Flow
`create-agent/SKILL.md` + `agent_template.md` define the frontmatter schema an author copies into a new `.claude/agents/*.md` or `.opencode/agents/*.md` file → the runtime (Claude Code or OpenCode) reads that file's frontmatter directly at dispatch time and enforces ONLY its own schema (`tools:` or `permission:` respectively; the other key is silently ignored, not merged) → `validate_document.py` runs as a structural QA gate over the file but today never inspects the frontmatter schema, so a runtime-wrong schema ships silently. This phase fixes the producer (SKILL.md/template), the one existing bad instance (deep-improvement.md), and adds the missing QA gate (validate_document.py) so the defect class cannot recur undetected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies here: AGT-02/AGT-03/AGT-08/AGT-09 form the systemic S4 finding cluster (a schema-authority defect touching a producer, an instance, and a QA gate) — this is `class_of_bug`, not `instance-only`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create-agent/SKILL.md:71-96` | Producer — canonical frontmatter authoring contract | Update: add runtime-branch (`tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/`) | `grep -n "tools:" .opencode/skills/sk-doc/create-agent/SKILL.md` shows a documented Claude branch |
| `create-agent/assets/agent_template.md:34` | Producer — literal scaffold table | Update: add both-schema row | `grep -n "tools" .opencode/skills/sk-doc/create-agent/assets/agent_template.md` |
| `create-agent/SKILL.md:105,177` | Producer — wording ("deprecated" claim) | Update: "deprecated" → "runtime-specific" | `grep -c "deprecated" .opencode/skills/sk-doc/create-agent/SKILL.md` = 0 |
| `.claude/agents/deep-improvement.md` | Consumer — one existing instance generated from the pre-fix template | Update: normalize to `tools:` | `grep -c '^tools:' .claude/agents/deep-improvement.md` = 1 |
| Other 11 `.claude/agents/*.md` files | Consumer — pre-existing instances, already correct | Not a consumer of this fix — verify unaffected | `grep -L '^tools:' .claude/agents/*.md` returns only `deep-improvement.md` pre-fix, zero files post-fix |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Consumer/QA gate — currently blind to frontmatter schema | Update: add `--type agent` schema pass | Running it against `.claude/agents/deep-improvement.md` reports pass post-fix, would have warned pre-fix |
| Future `/create:agent` runs | Consumer — any agent authored after this fix | Not directly testable this phase (no new agent authored) | Documented in checklist.md as a forward-looking QA note |

Required inventories:
- Same-class producers: `rg -n 'permission:' .claude/agents/` — confirms `deep-improvement.md` is the ONLY Claude agent using the wrong schema (instance-only within the S4 class; the root cause is the shared producer, not repeated independent mistakes).
- Consumers of changed symbols: `rg -n 'tools:|permission:' .opencode/skills/sk-doc/create-agent/` and `rg -n 'tools:|permission:' .claude/agents/ .opencode/agents/ --glob '*.md'` — enumerates every frontmatter block the schema-branch decision touches.
- Matrix axes: runtime (`.claude` / `.opencode`) × frontmatter schema (`tools:` / `permission:`) × 12 agents = 24 cells; only 1 cell (`.claude/agents/deep-improvement.md`) is currently wrong.
- Algorithm invariant (path-resolution class, covers AGT-01/AGT-09): an agent's self-referencing path line and its frontmatter schema must always match the runtime directory the file itself physically lives under — never the sibling runtime's convention. Adversarial cases: a file moved between directories without updating its self-reference (AGT-01's exact defect); a schema check applied to the wrong directory (AGT-09 must gate on the file's own path, not a global default).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — S4 root-cause schema branch (AGT-03 + AGT-08)
- [ ] `create-agent/SKILL.md:71-96` gains a runtime-detection branch: `tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/`
- [ ] `create-agent/assets/agent_template.md:34` gains a dual-schema comparison row
- [ ] `create-agent/SKILL.md:105` and `:177` "deprecated" wording replaced with "runtime-specific" + decision rule
- [ ] Verified: `grep -c "deprecated" .opencode/skills/sk-doc/create-agent/SKILL.md` = 0; both files document both schemas

### Phase 2: Implementation — dependent + independent findings
- [ ] AGT-02 (depends on Phase 1): `.claude/agents/deep-improvement.md:4-19` normalized to `tools: Read, Write, Edit, Bash, Grep, Glob`
- [ ] AGT-09 (depends on Phase 1): `validate_document.py` gains a `--type agent` frontmatter schema pass
- [ ] AGT-01 (independent): `.claude/agents/deep-research.md:11` and `.claude/agents/markdown.md:11` path self-references localized
- [ ] AGT-04 (independent): `research/deltas/iter-NNN.jsonl` added to the deep-research write-allowlist in both runtimes
- [ ] AGT-06 (independent): `ai-council.md` gains a Path Convention line in both runtimes
- [ ] AGT-07 (independent, operator-flagged default): OpenCode `orchestrate.md` mirror gains the canonical-source provenance clause
- [ ] AGT-05 (deferred, not executed): deferral recorded in spec.md §7; zero source diff to the 6 cited sites

### Phase 3: Verification
- [ ] All spec.md SC-001..SC-009 grep/validate assertions re-run and recorded
- [ ] Frontmatter-stripped, path-normalized diff confirms zero unintended drift outside the cited AGT lines
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0
- [ ] checklist.md P0/P1 rows marked with evidence; spec.md Status updated once P1s are closed and P2s are closed or deferred
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep assertion | Per-finding evidence (SC-001..SC-008) | `rg`/`grep -n` against exact cited file:line ranges |
| Script self-test | AGT-09's new `--type agent` check | `python3 validate_document.py <file> --type agent` against a compliant fixture (post-fix `deep-improvement.md`) and a deliberately non-compliant fixture (a copy with the wrong schema) |
| Diff review | Cross-runtime body-sync (no unintended drift) | Frontmatter-stripped, path-normalized `diff` per agent pair touched this phase |
| Spec-folder validation | This packet's own docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (AGT-03+AGT-08) completing before AGT-02/AGT-09 | Internal (in-packet sequencing) | Green | AGT-02/AGT-09 would apply against an undefined schema rule and need redoing |
| Operator answer on `.codex/agents` design question | External (human decision) | Yellow | Only blocks AGT-05; all other 8 findings proceed independently |
| `001-conformance-deep-research/research/research.md` | Internal (source of scope) | Green | Findings already confirmed 2026-07-10; no new discovery needed |
| Phases 002/003 (concurrent siblings) | Internal (workstream) | Green | Zero file-path overlap with this phase's scope (spec.md §3) |
| Phase 005 (README/roster ownership) | Internal (workstream) | Green | `.claude/agents/README.txt` / `.opencode/agents/README.txt` explicitly excluded from this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix causes a frontmatter parse failure, an agent to lose an intended capability, or `validate_document.py`'s new check to false-positive against a known-good pre-existing agent.
- **Procedure**: `git revert` the specific finding's commit(s); each AGT fix is an isolated, plain-text diff with no generated-artifact or database side effects, so reverts are independent per finding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: AGT-03+AGT-08) ──┬──> AGT-02 ──┐
                                  └──> AGT-09 ──┤
                                                ├──> Phase 3 (Verify)
AGT-01, AGT-04, AGT-06, AGT-07 (independent) ───┤
AGT-05 (deferred; no execution edge) ───────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (AGT-03+AGT-08) | None | AGT-02, AGT-09 |
| AGT-02 | Phase 1 | Phase 3 |
| AGT-09 | Phase 1 | Phase 3 |
| AGT-01, AGT-04, AGT-06, AGT-07 | None | Phase 3 |
| AGT-05 | Operator design decision (external) | Nothing else — deferral does not block Phase 3 |
| Phase 3 (Verify) | Phase 1 + AGT-02 + AGT-09 + the 4 independent findings | Phase closure |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (AGT-03+AGT-08 schema branch + wording) | Low-Medium | 45-60 minutes |
| AGT-02 (normalize deep-improvement.md) | Low | 15-20 minutes |
| AGT-09 (validator agent-frontmatter pass) | Medium | 30-45 minutes |
| AGT-01, AGT-04, AGT-06, AGT-07 (4 independent findings) | Low | 45-60 minutes combined |
| AGT-05 (deferral documentation only) | Trivial | 10 minutes |
| Phase 3 (verification sweep + validate.sh --strict) | Low | 20-30 minutes |
| **Total** | | **~2.5-3.5 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [x] All 9 findings' file:line citations spot-verified against the current working tree before planning (this pass)
- [x] Sequencing dependency (AGT-03 before AGT-02/AGT-09) recorded in both plan.md and tasks.md
- [ ] Operator has been asked the AGT-05 and AGT-07 open questions (spec.md §7) before their tasks execute

### Rollback Procedure
1. **Immediate**: if a fix breaks frontmatter parsing, `git checkout -- <file>` the single affected file — fixes are isolated per finding, not batched.
2. **Revert code**: `git revert <commit-sha>` for the specific finding's commit.
3. **Re-verify**: re-run the finding's spec.md SC-### grep assertion to confirm the revert restored the pre-fix (known) state.
4. **No data layer**: this phase has no database, generated-artifact, or index side effects — reverts are plain-text and complete.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — all changes are markdown/YAML frontmatter and one Python script; `git revert` is sufficient and complete.
<!-- /ANCHOR:l2-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

