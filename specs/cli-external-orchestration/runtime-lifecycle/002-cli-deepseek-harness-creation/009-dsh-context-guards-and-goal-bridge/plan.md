---
title: "Implementation Plan: Phase 9: dsh-context-guards-and-goal-bridge"
description: "Extend the repo-guards bundle with goal-context and session-start-context adapters that call the goal core and the session-prime adapter, ship prompt-advisor off in the lineage patch and ship or defer each later-wave guard, proven by fixture tests and the phase 008 keyless boot."
trigger_phrases:
  - "dsh context guards and goal bridge plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: dsh-context-guards-and-goal-bridge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and JavaScript ES modules loaded by the dsh Cordis plugin loader |
| **Framework** | The phase 008 repo-guards Cordis bundle on dsh `@deepseek-ai/dsh@0.2.2-rc.1` seams |
| **Storage** | None. Context is read from the packet `goal.md` through `goal-core.cjs` |
| **Testing** | `node --test` suites beside the bundle, the sk-git message-contract fixtures and the phase 008 keyless boot run |

### Overview
This phase adds context adapters to the existing `.dsh/plugins/repo-guards/` bundle. The required pair injects the packet goal slice and session-start context, and the optional later-wave adapters ship only where a fixture proves their seam. Authoring is `sk-code` `sk-code-skilled` and the executor is `cli-codex gpt-6-luna xhigh fast`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: phase 008 `acceptance-criteria.md` rows are Met

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test` over `.dsh/plugins/repo-guards/` exits 0 with the phase 008 cases unchanged and the new context cases added
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin context adapters. Each adapter reads through a shared core and attaches text to the session, never blocking a tool call.

### Key Components
- **`goal-context`**: resolves the bound packet with `.skilled/hooks/goal/lib/goal-core.cjs` and attaches the `chat_slice` at `agent/pre-step` or system-prompt assembly.
- **`session-start-context`**: runs `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` at `agent/created`, as the Pi extension does.
- **Optional adapters**: `session-compact-context` on `compaction/summary`, `session-stop-context` on `agent/disposed`, `session-start-advisories` on `agent/created`, `git-preflight-advisory` and `git-message-gate` on `bash` git calls through `.skilled/skills/sk-git/scripts/lib/`, `decision-capture` through `.skilled/hooks/decision-capture/lib/capture-core.mjs`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:239-248]

### Data Flow
At session creation the bundle resolves the workspace's bound packet once. On each eligible seam event the adapter attaches the cached slice or the session-prime text. Advisory adapters log and continue when their core throws.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds new context adapters and fixes no reported finding. The phase 008 safety adapters are unchanged and their tests are rerun as the regression check.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the phase 008 test baseline and a fixture packet. Implementation builds the required pair and then each optional adapter or its deferral. Verification reruns the bundle suite and the keyless boot.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Goal slice equality against `goal.cjs packet`, session-start text, compaction restore, git message contract | `node --test` over the bundle and the cases in `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` |
| Integration | Keyless boot with the extended guards patch under a disposable `DSH_HOME`, no key in env | `dsh` 0.2.2-rc.1, stderr captured |
| Manual | Deferral reasons in `.dsh/SYNC.md` read against research section 9.6 | `rg -n 'deferred' .dsh/SYNC.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `008-dsh-repo-guards-safety-wave` | Internal | Yellow, planned | No bundle to extend |
| `.skilled/hooks/goal/bin/goal.cjs` and `goal-core.cjs` | Internal | Green, present | No slice to inject |
| `dsh` 0.2.2-rc.1 installed | External | Green | The keyless boot run cannot execute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The keyless boot names a failed plugin, or a phase 008 safety test fails after the extension.
- **Procedure**: Revert the phase commit, which restores the phase 008 `guards.patch.yml` and removes the new adapters. The safety wave keeps working because it never depended on them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 complete | Implementation |
| Implementation | Baseline and fixture packet captured | Verification |
| Verification | Required pair present, each optional adapter shipped or deferred | Phase 013 live check of goal context |
<!-- /ANCHOR:phase-deps -->

---
