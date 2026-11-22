---
title: "Implementation Plan: Official Obsidian CLI agent-usage support in mcp-obsidian"
description: "Measure the installed binary's real behavior, write the agent-facing usage layer from that evidence, wire it into the skill's router, and correct every claim the binary contradicts. No install step, because the CLI is already registered."
trigger_phrases:
  - "official obsidian cli plan"
  - "obsidian cli measurement"
  - "app-backed cli wiring"
  - "obsidian cli doctor probe"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Official Obsidian CLI agent-usage support in mcp-obsidian

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation plus Bash diagnostics |
| **Framework** | `mcp-obsidian` mode packet under the `mcp-tooling` parent hub |
| **Storage** | None. The skill writes no state |
| **Testing** | Direct probes of the `obsidian` binary, `bash -n`, execution of the skill's own router, and `validate.sh --strict` |

### Overview

The official CLI is already on PATH, so nothing is installed. The work is to measure what the binary actually does, write the agent-facing layer from that evidence, and remove the claims that contradict it. Measurement comes first because the existing documentation was written from the vendor page and is wrong in ways that would otherwise be copied forward.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: negative and positive control for both touched scripts, router executed against test prompts
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence first, then documentation, then wiring. Every behavioral sentence traces to a command whose output and exit status were read.

### Key Components

- **`references/official-cli-agent-usage.md`**: the agent contract. Preflight, result handling, syntax, surface selection, command surface, safety invariants, vendor disagreements, verification status.
- **`SKILL.md` `OFFICIAL_CLI` intent**: the router entry that makes the reference reachable. The skill's router only resolves `.md` files under `references/`, so the usage layer had to live there to be loadable at all.
- **`scripts/doctor.sh` probe**: converts a PATH check into a liveness check, which is the difference between "a binary exists" and "the surface can answer".
- **`examples/official-cli-workflow.sh`**: the executable form of the contract, and the artifact that tests it.

### Data Flow

A request mentioning the app-backed CLI scores against `INTENT_SIGNALS`, resolves to `OFFICIAL_CLI`, and `RESOURCE_MAP` loads the usage reference plus the profile-comparison reference. An agent then preflights with `obsidian version`, and routes each result through a stdout check rather than an exit status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The false auto-launch claim behaved like a shared contract: it was stated in nine files, and correcting one while leaving the others would have left the skill contradicting itself.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/obsidian-cli-commands.md` | Profile reference, held the claim as `Confirmed behavior` | update | `grep -rn "launches it if not\|can launch it when"` returns nothing outside `changelog/` |
| `SKILL.md` | Router, surface tables, quick reference | update | `OFFICIAL_CLI` resolves when the router is executed |
| `references/troubleshooting.md` | Failure diagnosis, had no app-down section | update | §5b and §5c present |
| `scripts/doctor.sh`, `scripts/install.sh`, `mcp-servers/obsidian-cli/setup.sh` | Operator-facing scripts repeating the claim | update | `bash -n` clean; doctor run in both app states |
| `feature-catalog/` (index + 3 cli cards) | Capability inventory, all official cards were `VERIFY` stubs | update | claims replaced with confirmed command forms |
| `manual-testing-playbook/` (root + 2 official scenarios) | Test procedures built on `obsidian --help` | update | scenarios now preflight with `obsidian version` |
| `INSTALL-GUIDE.md`, `README.md`, `examples/README.md` | Operator entry points | update | app-down row added to both troubleshooting tables |
| `changelog/v0.1.0.0.md` | Historical record | **unchanged** | Rewriting a shipped changelog would falsify the record; noted in `v0.23.0.0.md` §4 |

Inventories run:
- `grep -rn "obsidian --help"` across the packet, excluding `notesmd-cli --help`, which is correct since that binary does take POSIX flags.
- `grep -rn "launch"` filtered to official-CLI context.
- `grep -rn 'obsidian "TEST_TARGET"\|obsidian "<vault'` for positional-argument examples.
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
| Unit | Shell syntax of every touched script | `bash -n` |
| Integration | Router intent resolution, including no-regression on six existing intents | Extract and execute `SKILL.md`'s `route_obsidian_resources` |
| Manual | `doctor.sh` and `official-cli-workflow.sh` in both the app-down and app-up conditions | Direct execution, with the app quit and relaunched to produce each condition |
| Negative control | Reproduce the exact failing symptom before trusting a check | Run `doctor.sh` with the app down and confirm the old green check became a warning |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Obsidian desktop 1.13.7 (installer 1.13.4) | External | Green | Without a running app the CLI cannot be measured at all |
| CLI registration symlink `/usr/local/bin/obsidian` | External | Green | Present before this packet started; no install performed |
| Operator's live vault | External | Green | Used read-mostly; one scratch note created and permanently deleted |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the documented contract proves wrong on another machine, or the router change misroutes existing intents.
- **Procedure**: `git checkout -- .opencode/skills/mcp-tooling/mcp-obsidian/` restores every modified file, and the three added files (`references/official-cli-agent-usage.md`, `examples/official-cli-workflow.sh`, `changelog/v0.23.0.0.md`) are removed with `git rm --cached` plus deletion. Nothing outside the skill and this packet was touched, and no environment state was changed: the Obsidian app was down before this work and is left down.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:decisions -->
## 8. DECISIONS TAKEN AUTONOMOUSLY

Recorded here because the operator asked for decisions to be made rather than escalated.

1. **No install step.** The binary was already registered, so installing would mutate the environment to reach a state that already held. Verified with `readlink -f /usr/local/bin/obsidian`.
2. **One new reference file, not two.** The preflight doctrine and the command surface are one topic, how to drive this CLI, and the router loads one resource rather than two. The exhaustive per-command parameter list is deliberately left to `obsidian help`, since transcribing 106 command signatures creates a second source of truth that goes stale against the binary.
3. **No new feature-catalog cards.** The three existing official cards were false rather than missing, so they were corrected. Adding cards would renumber the index sections and change the counts the catalog asserts, for no requirement that exists today.
4. **Historical changelogs left unedited.** A changelog records what was believed at a release. Correcting `v0.1.0.0.md` retroactively would destroy that record.
5. **The launch-claim sweep was treated as in scope, not adjacent.** The operator scoped the whole skill directory, and the claim directly contradicts the surface this packet documents. Leaving it would have shipped a skill that says both "the app launches automatically" and "the app must already be running".
6. **`OFFICIAL_CLI` given weight 6.** `NOTES_CLI` at weight 5 already owns the shared verbs (`open`, `search`, `create`, `delete`, `vault`). At equal weight, official-CLI questions lose the tie and load the notesmd-centric reference. Verified by executing the router: no existing intent changed.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Measure the binary) ──► Phase 2 (Author the usage layer) ──► Phase 3 (Wire + correct) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure | None | Author, Wire |
| Author | Measure | Wire |
| Wire and correct | Measure, Author | Verify |
| Verify | Wire and correct | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure the binary | Med | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — not applicable; every modified file is tracked, and the one vault note created was deleted
- [x] Feature flag configured — not applicable; documentation and a read-only diagnostic
- [x] Monitoring alerts set — not applicable

### Rollback Procedure
1. `git checkout -- .opencode/skills/mcp-tooling/mcp-obsidian/` to revert the 20 modified files.
2. Delete the 3 added files and unstage them.
3. Re-run `bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh` to confirm the prior behavior returned.
4. No stakeholder notification needed. Nothing was published, deployed or sent.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The single scratch note created during verification was permanently deleted and the vault's markdown file count was reconciled to its pre-change baseline of 233.
<!-- /ANCHOR:enhanced-rollback -->

---
