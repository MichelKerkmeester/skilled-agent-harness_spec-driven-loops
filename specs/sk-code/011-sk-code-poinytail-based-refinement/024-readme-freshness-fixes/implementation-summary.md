---
title: "Implementation Summary: README freshness fixes"
description: "All 23 README fixes from the 023 research are applied after a recount, and doctor check 13c is retired so a hub README keeps its own version."
trigger_phrases:
  - "readme freshness fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes"
    last_updated_at: "2026-10-12T17:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built the phase, ran a five-iteration review and fixed its findings"
    next_safe_action: "Orchestrator merges the branch and writes the release notes"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: README freshness fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-readme-freshness-fixes |
| **Completed** | 2026-10-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The root README and eleven related docs now state what the tree holds after v4.0.0.4. The root README counts 11 agents, 37 commands, 41 validation rules of which seven only warn, and 20 doctor workflows. Its ClickUp lines name the `cupt auth` sign-in and the hosted server's real tools. The related docs gained the advisor's seventh option, the tenth pre-commit sub-gate, the mirror checker's home in `.skilled/bin` and the missing `lib/` modules, and lost a wrong Hermes probe and a stale install guide version.

The parent-skill doctor no longer compares a hub README's version with SKILL.md. That check, 13c, contradicted the rule that every doc other than SKILL.md carries its own version. With it gone, the five hubs print no README version line, and every other line of their doctor output is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | F1 to F11 |
| `.skilled/skills/system-skill-advisor/README.md` | Modified | F12 |
| `.skilled/scripts/git-hooks/README.md` | Modified | F13 |
| `.skilled/skills/cli-external-orchestration/README.md` | Modified | F14 |
| `.skilled/bin/README.md`, `.skilled/bin/lib/README.md` | Modified | F15 to F17 |
| `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md` | Modified | F18, F19 |
| `.skilled/skills/sk-git/README.md` | Modified | F20 |
| `.skilled/skills/sk-doc/README.md` | Modified | F21 |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` | Modified | F22 |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modified | F23 |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Check 13c removed |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | Two 13c tests replaced by one |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modified | Stopped naming the retired check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator reran every research claim against the tree, then wrote each fix as an exact old and new string. DeepSeek V4.1 Flash at max effort, through cli-devin as `deepseek-v4-1-flash-max`, applied each group. A checker then compared every touched file byte for byte with HEAD plus the briefed replacements: 15 files across six dispatches, all matching, with no other file changed.

Commits: `6e8564ff92` README fixes, `0e2b905e9f` doctor change, `0861a11c6f` git hooks overview line, `3ec902274c` versioning standard line, `bcbf72fc4d` ledger, then the review and closeout commit. The pre-commit hook raised each changed skill doc's own version.

A five-iteration `/deep:review :auto` then ran over `0725425d46..bcbf72fc4d` on cli-devin with `deepseek-v4-1-flash-max`. It found no P0 or P1 and two P2, both in this phase's spec docs, and both reproduced and fixed. The reducer recorded two search-debt items, so the report's verdict is CONDITIONAL; the orchestrator closed both with observed runs after synthesis. Its artifacts are in `review/`.

### Ledger

| ID | Outcome | Proof or reason |
|----|---------|-----------------|
| F1 | Fixed | `grep -c 'CLICKUP_API_KEY' README.md` prints 0 and `grep -c 'cupt auth' README.md` prints 1; the line now matches `.env.example:48` and `mcp-click-up/SKILL.md:271`. The key text sat only at `README.md:1435`, inside the mcp-tooling bullet |
| F2 | Fixed | `grep -c '111-feature catalog + 35-scenario playbook' README.md` prints 1; the per-folder catalog counts sum to 50 cupt plus 61 MCP files, and the playbook holds 42 files of which 7 are the routing holdout, so 35 scenarios |
| F3 | Fixed | `ls .skilled/agents/*.md \| wc -l` prints 11; `grep -cE '11 Specialized\|Eleven specialized\|11 specialized\|11 custom' README.md` prints 5, covering `:24` and the same count at `:98` and `:125` |
| F4 | Fixed | `grep -c 'Eleven specialized agents own' README.md` prints 1 |
| F5 | Fixed | `grep -c '11 custom specialist agents' README.md` prints 1 |
| F6 | Fixed | `find .skilled/commands -name '*.md' -not -path '*/assets/*' -not -path '*/legacy/*' -not -path '*/compiled/*' -not -name README.md \| wc -l` prints 37 |
| F7 | Fixed | The same `find` with `-mindepth 2` prints 34; `grep -c '37 command entry points' README.md` prints 2 |
| F8 | Fixed | `validator-registry.json` holds 41 rules, 7 with severity warn; `orchestrator.ts:1206` passes a run on `summary.errors === 0`, so warnings never fail it. The sentence now reads "Seven of them only warn and never fail a run, among them these two" |
| F9 | Fixed | `grep -cE '41 rules\|41 validation' README.md` prints 4, covering `:426` and the same count at `:147` and `:785` |
| F10 | Fixed | `grep -l operating_mode .skilled/commands/doctor/assets/*.yaml \| wc -l` prints 20; the 21st file is the mutation-class manifest |
| F11 | Fixed | `ls -d .codex/agents .cursor/agents .devin/agents .pi/agents \| wc -l` prints 4 and `readlink .hermes/agents .opencode/agents` prints `../.skilled/agents` twice. The proposed "OpenCode and Hermes read `.opencode/agents/`" was wrong for Hermes, so the line names both directories |
| F12 | Fixed | `node .skilled/bin/skill-advisor.cjs list-tools` lists seven `advisor_recommend` options ending in `surfaceHint`; `grep -c 'surfaceHint' .skilled/skills/system-skill-advisor/README.md` prints 2 |
| F13 | Fixed | `grep -c '^# --- ' .skilled/scripts/git-hooks/pre-commit` prints 11, one an empty header (RM-2), so ten gates; `grep -cE 'nine blocking\|Eight carry\|8 blocking\|nine named' .skilled/scripts/git-hooks/README.md` prints 0, covering `:20`, `:24`, `:44`, `:73` and `:121` |
| F14 | Fixed | `grep -c 'hermes config get providers.llmgateway.base_url' .skilled/skills/cli-external-orchestration/README.md` prints 1, matching `cli-hermes/SKILL.md:47` |
| F15 | Fixed | `grep -c 'check-agent-mirror-sync.cjs' .skilled/bin/README.md` prints 2 |
| F16 | Fixed | Every `lib/*.cjs` requires only Node core modules or a sibling; the line now says "Every module here", since "All four" would undercount the tree F17 extends |
| F17 | Fixed | `ls .skilled/bin/lib/*.cjs \| wc -l` prints 10 and the tree now lists all 10 |
| F18 | Fixed | `.skilled/skills/system-spec-kit/runtime/cli/package.json:8` needs `>=22.12.0`; `grep -c 'Node.js 22.12 or newer' .skilled/skills/system-spec-kit/README.md` prints 1 |
| F19 | Fixed | `ls -d .skilled/skills/system-spec-kit/runtime/hooks/opencode` exists; `grep -c 'Devin, OpenCode, and Pi' .skilled/skills/system-spec-kit/runtime/README.md` prints 1 |
| F20 | Fixed | `ls -d .skilled/skills/sk-git/manual-testing-playbook/*/ \| wc -l` prints 9; `grep -c '8 categories' .skilled/skills/sk-git/README.md` prints 0. The scenario number is dropped because the playbook keeps no count (`manual-testing-playbook.md:33`) |
| F21 | Fixed | `ls .skilled/skills/sk-design/sk-design-chart/assets/templates/ \| wc -l` prints 29; `grep -c 'twenty-nine forms' .skilled/skills/sk-doc/README.md` prints 1 |
| F22 | Fixed | `grep -c 'Version:\*\* 2.0.0' .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` prints 0; it was the only install guide with a body version line |
| F23 | Fixed | `grep -c '├── changelog/' .skilled/skills/system-deep-loop/runtime/README.md` prints 1 |

### Check 13c

| ID | Outcome | Proof or reason |
|----|---------|-----------------|
| DC-1 | Fixed | `for h in system-spec-kit system-skill-advisor sk-git sk-doc system-deep-loop; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h; done 2>&1 \| grep -c 13c-readme-version` prints 0 (baseline: 3 FAIL, 2 WARN). Each hub's other lines are unchanged, and its failure count drops by exactly one |
| DC-2 | Fixed | `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` passes 97 of 97 (baseline 98, minus two 13c tests, plus one); with the check restored the new test fails |
| DC-3 | Fixed | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints 7 suites passed, 0 failed |
| R4-P2-001 | Fixed | `grep -c 'eleven related docs' spec.md` prints 1 in this folder; the research's twelve included the deep-loop hub README, whose only row was a version row this phase leaves alone |
| R4-P2-002 | Fixed | `grep -c '^- \[ \] T' tasks.md` prints 0 in this folder; T007 and T008 carry evidence before the completion block is ticked |
| DC-4 | Fixed | `frontmatter-versioning.md:122` named "the parent-skill doctor's README check"; it now names the remaining version check |

### Remaining

| ID | Item | Why it stays |
|----|------|--------------|
| RM-1 | `node .skilled/bin/skill-advisor.cjs list-tools --bogus-flag` prints `ERROR: Unknown command: list-tools` | Out of scope per the brief: the message names the wrong token, but no README claims otherwise |
| RM-2 | `.skilled/scripts/git-hooks/pre-commit:919` carries the header `# --- Tool ownership map gate (blocking) ---` with no gate body before `exit 0` | A stale comment outside the README scope; the README's ten-gate count is right |
| RM-3 | Check 13a requires a hub `ROUTER.md` version to equal SKILL.md, while `frontmatter-versioning.md:30` lists `ROUTER.md` among the docs that carry their own edition, and `frontmatter-version.mjs` raises it on a body edit | The same conflict 13c had, but the operator ruling covered hub READMEs only; it needs an operator decision |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repeats of a stale claim folded into its row | The root README said 12 agents at `:98` and `:125` and 42 rules at `:147` and `:785`, and the git hooks README said nine sub-gates at `:20` and `:121`; leaving them would keep the same wrong claim in the same file |
| Check 13c removed, not relaxed to warn | A warning still reports a README that follows the per-doc rule; the rule needs no README comparison at all |
| Builders ran with `accept-edits` | The session refused `--permission-mode dangerous`, which cli-devin reserves for a task the user approved it for; edits with no shell were enough for literal replacements, and the orchestrator ran every check |
| No changelog entry and no skill release | README and reference wording is doc maintenance recorded by each doc's own version; the doctor scripts have no version or changelog of their own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Byte-for-byte check of every dispatch | 15 files equal HEAD plus the briefed replacements |
| `parent-skill-check-invariants.test.cjs` | 97 of 97 pass; the new test fails with 13c restored |
| Doctor `run-all.sh` | 7 suites passed, 0 failed |
| Five hubs | No `13c-readme-version` line |
| `/deep:review :auto`, 5 iterations | CONDITIONAL from two search-debt items closed afterwards; 0 P0, 0 P1, 2 P2, both fixed. See `review/review-report.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **RM-3 is open.** Until the operator rules on hub `ROUTER.md` versions, a body edit to a hub `ROUTER.md` will fail check 13a after the hook raises its version.
<!-- /ANCHOR:limitations -->
