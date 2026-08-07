---
title: "Implementation Plan: Phase 3: verify-and-ship"
description: "Sequential validate.sh -> @review opus dispatch -> generate-context.js refresh -> commit. Bounded remediation loop (max 2 retries)."
trigger_phrases:
  - "068/003 plan"
  - "verify-and-ship plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/003-verify-and-ship"
    last_updated_at: "2026-05-05T08:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 3 plan.md"
    next_safe_action: "Author tasks.md, then execute Phase 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-authoring"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: verify-and-ship

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash + @review agent (Opus 4.7) + sk-code-review skill + generate-context.js (Node) |
| **Framework** | Fresh-context verification gate; deterministic + subjective audit |
| **Storage** | Spec folder docs + graph-metadata.json |
| **Testing** | validate.sh --strict, rg, diff -rq, tomllib parse, 3-file sample read |

### Overview
Phase 3 verifies the reorg is correct via two complementary mechanisms: (a) deterministic checks (validate.sh, rg, diff -rq, tomllib) rerun in fresh shell by @review, and (b) Opus 4.7 fresh-context judgment with Hunter/Skeptic/Referee challenges on the full diff. On PASS, refresh graph metadata and ship.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 (commit ccd73ef55) complete
- [x] Phase 2 commit complete (substring sweep + mirror)
- [x] Final residual rg in active scope returns ZERO hits

### Definition of Done
- [ ] validate.sh --strict on parent 068 exits 0
- [ ] @review (Opus + sk-code-review) returns VERDICT: PASS
- [ ] graph-metadata.json refreshed for parent + 3 children
- [ ] 003 implementation-summary.md authored
- [ ] One terminal commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential gate chain. Each gate must pass before the next runs. Failure at any gate routes to either remediation (max 2 retries via cli-codex) or halt-to-user.

### Key Components
- **`validate.sh --strict`**: 7-rule structural validator on spec folder docs
- **`@review` (Opus 4.7) + `sk-code-review` skill**: fresh-context human-equivalent code reviewer; reruns deterministic checks AND applies subjective Hunter/Skeptic/Referee challenges
- **`generate-context.js`**: refreshes graph-metadata.json + description.json from spec doc state

### Data Flow
```
validate.sh --strict (must exit 0)
    -> @review opus dispatch with verifier prompt
        -> verifier reruns checks in fresh shell
        -> verifier samples 3 files for content drift
        -> verifier returns PASS / FAIL_REMEDIATE / FAIL_HALT
            PASS -> generate-context.js refresh -> commit
            FAIL_REMEDIATE -> cli-codex fixes -> re-verify (≤2 retries)
            FAIL_HALT -> halt to user with diagnostic
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (pre-flight)
- [ ] Confirm on `main` branch
- [ ] Confirm Phase 1 + Phase 2 commits landed
- [ ] Confirm spec folder structure: parent + 3 children with all required files

### Phase 2: Core Implementation (Verification gate)
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <068-folder> --strict` — must exit 0
- [ ] Dispatch `@review` agent with `sk-code-review` skill loaded; verifier prompt instructs:
  - Rerun validate.sh + rg + diff -rq + tomllib parse-check IN FRESH SHELL
  - Apply Hunter/Skeptic/Referee on git diff main...HEAD (last 2 commits)
  - Sample 3 random updated files; confirm path-strings reflect NEW layout
  - Return one of: PASS / FAIL_REMEDIATE_VIA_CODEX / FAIL_HALT_TO_USER
- [ ] On FAIL_REMEDIATE: dispatch cli-codex to remediate (max 2 retry cycles); on FAIL_HALT: halt to user

### Phase 3: Closeout
- [ ] Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` to refresh parent + child graph-metadata.json
- [ ] Author `003-verify-and-ship/implementation-summary.md` with verifier outcomes
- [ ] Author optional `.opencode/skills/sk-doc/changelog/v<next>.md` documenting the reorg
- [ ] Final commit: `feat(sk-doc): verify and ship sk-doc reorg (068/003)`
- [ ] Verify `git branch --show-current` returns `main`; no surviving feature branch
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec folder docs | validate.sh --strict |
| Residual | Cross-runtime stale path detection | rg --no-config --no-ignore-vcs |
| Mirror parity | Byte-identity 3-way + TOML semantic for .gemini | diff -rq, tomllib.loads |
| Subjective audit | Full diff review | @review opus + sk-code-review (Hunter/Skeptic/Referee) |
| Sample drift | 3 random files content check | manual cat + visual confirmation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 commit | Internal | Green | Cannot start Phase 3 |
| @review agent | External | Green | Skip subjective verification; rely on deterministic only (lesser confidence) |
| sk-code-review skill | External | Green | @review uses default review checklist instead |
| generate-context.js | External | Green | Manual jq edit on graph-metadata.json fallback |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verifier returns FAIL_HALT_TO_USER OR validate.sh --strict fails 2+ times
- **Procedure**: `git reset --hard <Phase-2-commit-SHA>` (rolls back Phase 3 commit; Phase 1 + 2 remain)
- **Granularity**: Phase 3 is one terminal commit. Surgical rollback returns repo to post-Phase-2 state.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
