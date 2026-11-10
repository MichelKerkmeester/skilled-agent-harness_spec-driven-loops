---
title: "Implementation Plan: Phase 4: dsh-runtime-folder-and-patches"
description: "Promote the phase 002 draft patches into .dsh/patches with sk-code through cli-codex gpt-6-luna xhigh fast, write SYNC.md and README.md with sk-create-readme in the orchestrating Claude session, and prove composition with --dump-config under a disposable DSH_HOME."
trigger_phrases:
  - "dsh runtime folder and patches plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: dsh-runtime-folder-and-patches

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML Cordis patches, Markdown, `.gitignore` |
| **Framework** | `dsh` 0.2.2-rc.1 patch grammar (`id`, `disabled`, `config`, `insert`) |
| **Storage** | None |
| **Testing** | `dsh --dump-config` under a temp `DSH_HOME`, `rg`, `git check-ignore` |

### Overview
The three YAML patches are authored with `sk-code` `sk-code-skilled` by `cli-codex gpt-6-luna xhigh fast`, starting from the drafts phase 002 proved. `SYNC.md` and `README.md` are authored with `sk-doc` `sk-create-readme` by the orchestrating Claude session. Composition is proved per route with `--dump-config` and a stderr scan for unmatched targets. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/phase-plan.md:103-118]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 `evidence/dump-config-*.txt` files exist and phase 003 acceptance rows are Met
- [ ] `ls .dsh` reports no such directory
- [ ] The `cli-codex` packet `SKILL.md` was read before the dispatch brief was written

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both `--dump-config` runs show the expected provider and model and `rg -c -i 'unmatched' <stderr>` prints 0
- [ ] `validate.sh <phase folder> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: layered composition patches.

### Key Components
- **Route patches**: each replaces the `agent-default-model` row and supplies one `llm-pi-ai` provider row with `apiKeyEnv`.
- **Lineage patch**: turns telemetry to `DISABLED` and disables `session-log-deepseek`, `goal-round-driver` and `plan-mode`.
- **`SYNC.md`**: inventory of every `.dsh/` entry with its mechanism and source.

### Data Flow
A dispatch passes `--patch <route>` then `--patch lineage.patch.yml`. The harness composes bundle patches, the profile patch, `$DSH_HOME/cordis.patch.yml` and then each `--patch` in order, and the last layer wins per row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase fixes no reported finding. The one shared file it touches, `.gitignore`, gains a single new line and no existing rule changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup reads the phase 002 drafts. Implementation writes the patches, the docs and the ignore rule. Verification composes each route and runs the scans.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Secret scan over the patches | `rg -n -i 'api_?key\|secret\|token' .dsh/patches` |
| Integration | Route plus lineage composition per route | `DSH_HOME=$(mktemp -d) dsh --profile headless --patch ... --dump-config </dev/null` |
| Manual | `SYNC.md` coverage and the ignore rule | `ls .dsh` against `rg` over `SYNC.md`, `git check-ignore -q .dsh/skills/local-probe` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 evidence and drafts | Internal | Red (phase 002 not started) | Row ids are unverified |
| Phase 003 packet references | Internal | Red (phase 003 not started) | `SYNC.md` has no packet reference to match |
| `cli-codex gpt-6-luna xhigh fast` | External | Green | The orchestrating session writes the patches instead and records the deviation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a route patch composes to the wrong provider or model, or the secret scan finds a key value.
- **Procedure**: remove `.dsh/` and the `/.dsh/skills/local-*` line from `.gitignore`. No other file reads `.dsh/` until phase 005.
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
| Setup (read drafts) | Phases 002 and 003 closed | Implementation |
| Implementation (patches, docs, ignore rule) | Setup | Verification |
| Verification (compose, scan) | Implementation | Phases 005, 006, 008 and 010 |
<!-- /ANCHOR:phase-deps -->

---

