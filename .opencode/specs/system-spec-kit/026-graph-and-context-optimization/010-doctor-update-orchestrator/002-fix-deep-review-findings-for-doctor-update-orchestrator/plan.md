---
title: "Implementation Plan: 003 RM-8 013 Remediation"
description: "Four sequential cli-codex (gpt-5.5 high fast) dispatches: Batch A doc honesty, Batch B security hardening, Batch C cross-runtime mirror, Batch D P2 cleanup."
trigger_phrases:
  - "003 plan"
  - "013 remediation plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "010-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator"
    last_updated_at: "2026-05-11T08:05:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored plan from spec.md"
    next_safe_action: "Author tasks.md, then dispatch Batch A"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:003-plan-2026-05-11"
      session_id: "main-003-2026-05-11"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 003 RM-8 013 Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON spec docs; bash + Docker compose for security batch; mixed MD/TOML for runtime mirrors |
| **Framework** | system-spec-kit (templates, validate.sh, generate-context.js) |
| **Storage** | Git on `main` (no feature branches per memory `feedback_stay_on_main_no_feature_branches.md`) |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict`; targeted re-grep per cluster; optional /spec_kit:deep-review re-run post-remediation |
| **Executor** | `cli-codex` with `--model gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast` (per memory `feedback_codex_cli_fast_mode.md`) |

### Overview
Four sequential cli-codex dispatches, each scoped to one finding cluster batch. Each batch ends with a verification step (re-grep / re-validate) before the next dispatches. Main agent owns scaffolding, prompt authoring, verification, and commits; codex owns the mechanical execution (sed/Edit/Write/Bash inside the batch's allowed-write list).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] spec.md scope frozen
- [x] All 60 findings mapped to one of 4 batches
- [x] Codex pre-flight: `which codex` returns valid path

### Definition of Done
- [ ] All 4 batches dispatched + verified
- [ ] `validate.sh --strict` exits 0 on this packet
- [ ] checklist.md marks all P1 + P2 items resolved or formally deferred
- [ ] implementation-summary.md `completion_pct: 100` with batch-by-batch summary
- [ ] Commit on main; memory save
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remediation packet — no new abstractions, no new modules. Pure surgical edits + new runtime mirror files.

### Key Components
- **Batch A driver prompt**: composed by main agent, executed in one codex dispatch. Verifies via `git diff --stat` + targeted re-grep on each cluster.
- **Batch B driver prompt**: bootstrap.sh + docker-compose edits. Verifies via `grep -n` for `--no-audit` absence + `flock` presence + `cap_drop`.
- **Batch C driver prompt**: file scaffolding + frontmatter conversion. Verifies via `find` enumeration.
- **Batch D driver prompt**: scattered small edits. Verifies via per-finding grep.

### Data Flow
1. Main agent writes batch prompt to `/tmp/codex-batch-<A|B|C|D>.md`
2. Main agent runs `codex exec --model gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast --sandbox workspace-write [-c sandbox_workspace_write.network_access=true for A] - < /tmp/codex-batch-X.md`
3. Codex executes edits; main agent verifies via grep/find/validate.sh
4. Commit + move to next batch
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Doc Honesty
- [ ] T-A01 Run `generate-context.js` on 001 child → fixes description.json.specFolder
- [ ] T-A02 Run `generate-context.js` on 002 child → refreshes last_active_child_id
- [ ] T-A03 Manually restore parent graph-metadata.json fields per `feedback_generate_context_regenerates_parent_metadata.md`
- [ ] T-A04 Reconcile 001 implementation-summary.md (title + body + continuity to ~95%)
- [ ] T-A05 Reconcile 002 implementation-summary.md (continuity 70→95)
- [ ] T-A06 Fix 002 spec.md SC-001 (25→23 scenarios)
- [ ] T-A07 Fix parent spec.md Phase Map (21 yamls → 10)
- [ ] T-A08 Bulk PLANNED→OK in 001 + 002 resource-maps for on-disk files
- [ ] T-A09 Drop dead .opencode/skill symlink row from parent resource-map
- [ ] T-A10 Mark 001 + 002 checklist items `[x]` with evidence anchors
- [ ] T-A11 Update 001 tasks.md (T-011..T-046) per evidence
- [ ] T-A12 Fix 4 doc locations in 002 claiming last_active_child_id
- [ ] T-A13 Drop ADR-010-obsolete YAML mentions from 001 implementation-summary.md
- [ ] T-A14 Verify: re-grep each cluster A-F symptom; no hits

### Phase B: Security Hardening
- [ ] T-B01 Drop `--no-audit` from `doctor-runtime-bootstrap.sh`
- [ ] T-B02 Replace mkdir-lock with flock(2) in `doctor-runtime-bootstrap.sh`
- [ ] T-B03 Narrow docker-compose volume mount
- [ ] T-B04 Add `cap_drop: [ALL]` + minimal `cap_add` in sandbox container
- [ ] T-B05 Verify: `grep -n "no-audit\|mkdir.*lock\|cap_drop" <files>`

### Phase C: Cross-Runtime Mirror
- [ ] T-C01 Mirror 5 commands to `.claude/commands/doctor/`
- [ ] T-C02 Mirror 5 commands to `.codex/commands/doctor/` (TOML conversion)
- [ ] T-C03 Mirror 5 commands to `.gemini/commands/doctor/`
- [ ] T-C04 Add `skill_agent` ownership anchor to all 4 runtime copies
- [ ] T-C05 Update root README.md doctor count if applicable
- [ ] T-C06 Verify: `find .opencode .claude .codex .gemini -path '*/commands/doctor/*'` = 20 entries

### Phase D: P2 Cleanup
- [ ] T-D01 Refresh stale continuity blocks (last_updated_at) across 013 packet docs
- [ ] T-D02 Debian-full → slim in sandbox Dockerfile (if applicable)
- [ ] T-D03 Sandbox guard: return SKIP not success
- [ ] T-D04 Relax parent spec REQ-P-001 acceptance criterion
- [ ] T-D05 Fix stale `packet_pointer` in 001 child docs
- [ ] T-D06 Other R9-P2-001..009 small fixes
- [ ] T-D07 Verify: targeted re-grep per P2 finding ID
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict-validate | This packet + 001 + 002 + parent | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict` |
| Re-grep per cluster | Each P1/P2 symptom string | `rg -in <symptom>` (case-insensitive, multiline) |
| Cross-runtime mirror | Doctor commands across 4 runtimes | `find .opencode .claude .codex .gemini -path '*/commands/doctor/*'` |
| Optional re-review | Whole 013 packet | `/spec_kit:deep-review:auto` post-remediation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (`codex` binary) | External | Green | Batches can't dispatch — would need to fall back to direct Edit on main agent |
| `generate-context.js` network access | External | Green w/ flag | Batch A T-A01/T-A02 break silently if `sandbox_workspace_write.network_access=true` omitted |
| Voyage embeddings API | External | Green | generate-context.js needs it; falls back to text-only context if down |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A batch's verification grep fails AND codex's diff is destructive beyond the batch scope.
- **Procedure**: `git restore --source=8d794afad -- <affected paths>` to revert to the post-review baseline. Each batch commits separately so partial rollback is one-commit-back per batch.
- **Recovery baseline**: commit `8d794afad` (013 review packet ship) is the known-good state.
<!-- /ANCHOR:rollback -->

---

<!--
LEVEL 2 NOTES
- Verification testing covered by re-grep + strict-validate, not unit tests (this is doc + config + mirror work)
-->
