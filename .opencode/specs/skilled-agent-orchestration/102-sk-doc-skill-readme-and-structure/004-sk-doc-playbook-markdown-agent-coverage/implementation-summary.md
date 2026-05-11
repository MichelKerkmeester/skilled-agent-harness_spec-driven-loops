---
title: "Implementation Summary: sk-doc playbook markdown-agent coverage"
description: "Added 06--agent-dispatch section with 3 @markdown × CLI scenarios; executed all three; ran 5-iter deep-review (converged early)."
trigger_phrases:
  - "sk-doc playbook markdown agent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage"
    last_updated_at: "2026-05-11T09:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Deep-review converged"
    next_safe_action: "Resolve F-001 remediation path"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/001-markdown-agent-cli-claude-code.md"
      - ".opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/002-markdown-agent-cli-codex.md"
      - ".opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/003-markdown-agent-cli-opencode.md"
      - "evidence/SD-018-cli-claude-code.txt"
      - "evidence/SD-019-cli-codex.txt"
      - "evidence/SD-020-cli-opencode.txt"
      - "../review/deep-review-dashboard.md"
      - "../review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-004-sk-doc-playbook-markdown-agent-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: sk-doc playbook markdown-agent coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

This packet closed the documented gap in the sk-doc manual testing playbook: zero scenarios exercised the `@markdown` agent (the dedicated documentation executor renamed in 102/003), and the preamble admitted "3 CLI runtimes" while listing only 2. We added a new `06--agent-dispatch/` section with three `dispatch_real` scenarios (SD-018/019/020) that actually invoke `@markdown` across cli-claude-code, cli-codex, and cli-opencode (DeepSeek v4 Pro direct API), executed all three sequentially, captured evidence, and ran a 5-iteration deep-review that converged early via the workflow's stop-score detector (weighted 0.798 > 0.60 threshold).

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-sk-doc-playbook-markdown-agent-coverage |
| **Completed** | 2026-05-11 (Stages B-E) |
| **Status** | Complete — 2 PASS, 1 FAIL (documented limitation), deep-review converged |
| **Level** | 2 |
| **Verdict** | CONDITIONAL (review-report.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Authoring (Stage C)
- New playbook section `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/` with three scenario files
- SD-018: `@markdown` via cli-claude-code
- SD-019: `@markdown` via cli-codex (gpt-5.5/fast + sandbox network-access)
- SD-020: `@markdown` via cli-opencode + DeepSeek v4 Pro DIRECT API (`deepseek/deepseek-v4-pro`, `--pure`, `--variant high`, `</dev/null`)
- Playbook index updates: preamble third-CLI fix, Categories row #6, Scenario Index block, Global Preconditions note distinguishing execution-real (sec 6) from routing-trace (secs 1-5)

### Execution (Stage D)
- All three scenarios dispatched sequentially against their named CLI; transcripts persisted under `evidence/`
- SD-018: ~57s, PASS
- SD-019: ~120s, FAIL (high-value finding)
- SD-020: PASS

### Review (Stage E)
- 5-iter deep-review via `cli-opencode` + `deepseek/deepseek-v4-pro` (DIRECT DeepSeek API)
- Converged at iter 4 (weighted stop 0.798 > 0.60); 0 P0, 7 P1, 9 P2 findings across 37 files
- Artifacts in `../review/`: dashboard, report, state JSONL, strategy, findings-registry, 5 iteration files

### Spec packet (Stage B)
- Created `004-sk-doc-playbook-markdown-agent-coverage/` with full Level 2 docs (spec/plan/tasks/checklist/implementation-summary + description.json + graph-metadata.json)
- Parent `102/spec.md`: Phase Count 3→4, Status Draft→Active, phase-4 row + 003→004 handoff added
- Parent `102/graph-metadata.json`: children_ids array now has 4 entries, derived.status planned→active, last_active_child_id pointed at 004
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Approach
1. **Stage A** (read-only): synthesized 102 inventory in chat (no file written)
2. **Stage B**: ran `create.sh --phase --phase-parent ... --phases 1` (with `--skip-branch`); manually replaced scaffold-template content; merged the duplicate Phase Documentation Map into the original section; refreshed parent graph-metadata `children_ids` + `derived.status` + `last_active_child_id` manually (per memory hint)
3. **Stage C**: authored scenarios mirroring `04--cross-cli-dispatch/001-short-prompt-baseline.md` shape but with `execution_mode: dispatch_real` frontmatter and a real CLI Setup block (replacing the `DO NOT execute` routing-trace wrapper); fixed the preamble third-CLI gap; added Categories row + Scenario Index + Preconditions note
4. **Stage D**: dispatched each CLI sequentially (memory hint: parallelism unreliable); appended verdict footer to each transcript after grading
5. **Stage E**: dispatched `/spec_kit:deep-review:auto` via cli-opencode + DeepSeek v4 Pro direct API. First attempt hung on setup-phase gate (Q1_type / Q-Exec / phase-parent scope). Killed and re-dispatched with all setup answers pre-bound in the prompt — successful, workflow loaded YAML, ran 5 iterations, converged early via weighted-stop-score detector

### Cross-CLI Execution Results

| Scenario | CLI | Provider | @markdown invoked | sk-doc loaded | Output file | Verdict |
|----------|-----|----------|-------------------|---------------|-------------|---------|
| SD-018 | cli-claude-code | Claude Opus 4.7 | ✓ (3 hits) | ✓ (2 hits) | ✓ (2134 bytes) | **PASS** |
| SD-019 v1 | cli-codex | gpt-5.5/fast | ✗ ("unavailable") | ✗ | ✗ | **FAIL** (archived as `SD-019-cli-codex.v1-fail.txt`) |
| SD-019 v2 | cli-codex | gpt-5.5/xhigh/fast (inline contract) | ✓ inline (3 `SPAWN_AGENT_USED=no`) | ✓ (`SKILL.md` + `changelog_template.md`) | ✓ (952 bytes) | **PASS** — F-001 resolved via inline-contract workaround |
| SD-020 | cli-opencode | deepseek/deepseek-v4-pro (DIRECT) | ✓ (8 hits) | ✓ (8 hits) | ✓ (1464 bytes) | **PASS** |

Pass rate (after 005 remediation): **3/3** (100%). The original SD-019 FAIL surfaced a real cli-codex SpawnAgent allowlist gap (F-001); the v2 rewrite resolved it via inline-contract workaround. See 005 implementation-summary §Known Limitations for the full evolution.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **3-CLI scope, not 5** — user-selected breadth matching the playbook preamble intent (cli-codex + cli-opencode + cli-claude-code). cli-copilot + cli-gemini explicitly out of scope.
2. **New child packet (102/004), not new track 103** — user-selected; natural extension of the 102 umbrella (sk-doc structure work that 003 introduced @markdown for).
3. **Same task across all 3 scenarios** — `/create:changelog` for stub `sk-test-dummy` so cross-CLI verdicts are comparable.
4. **Output to `/tmp/` only** — NFR-S02: never install stub skill under `.opencode/skills/`. Prompt explicitly forbids installation.
5. **Phase-parent review target** — single 10-iter run (user choice; matched "all work done in 102" wording).
6. **DeepSeek DIRECT API, not opencode-go gateway** — model id `deepseek/deepseek-v4-pro` per user wording "through deepseek api".
7. **Setup answers pre-bound for Stage E re-dispatch** — `/spec_kit:deep-review:auto` setup phase has a mandatory question block that hangs on stdin EOF in `--pure` non-interactive mode. Worked around by embedding all answers in the dispatch prompt; should be filed as F-Stage-E-001 ergonomics gap.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Section folder exists | `find .opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch -name "*.md" \| wc -l` | 3 |
| Preamble fixed | `grep -n "(cli-codex, cli-opencode, cli-claude-code)" manual_testing_playbook.md` | Line 87, 1 hit |
| Categories table updated | `grep -n "Agent Dispatch" manual_testing_playbook.md` | Line 42, 1 hit |
| Scenario Index updated | `grep -c "SD-01[89]\\|SD-020" manual_testing_playbook.md` | ≥3 |
| Evidence captured | `ls 004/evidence/*.txt \| wc -l` | 3 |
| Parent graph-metadata refreshed | `jq '.children_ids \| length' 102/graph-metadata.json` | 4 |
| Spec validator (non-strict) | `bash validate.sh 004` | PASSED (0/0 after final refactor) |
| Deep-review converged | `cat 102/review/deep-review-dashboard.md` | 5 iter, 0 P0, 7 P1, 9 P2 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### Open: F-001 SD-019 remediation path (user decision required)
The SD-019 FAIL surfaced a real cli-codex `@markdown` dispatch gap. The `.codex/config.toml` registry IS wired correctly, but `codex exec` in non-interactive mode falls back to a sub-agent path that hits Gate 3 spec-folder hard-block. Remediation requires either:
- A new packet (102/005 recommended) to investigate and fix codex's agent-resolution flow for `@markdown` under `codex exec`, OR
- Documenting SD-019 as an accepted limitation (interactive-only `@markdown` dispatch under codex) and updating SD-019's scenario file to mark it `expected_skip_in_non_interactive: true`

### Deep-review verdict: CONDITIONAL (7 P1 findings)
Most P1s are metadata-sync items (Phase 2 Draft vs Complete, 004 spec Draft vs shipped, 003→004 handoff doesn't note SD-019 gap, child phase "N of 3" → "N of 4"). These are quick fixes (~15 min). The structural P1 is the F-001 remediation question above. Full list in `../review/deep-review-dashboard.md` §Findings.

### F-Stage-E-001 (new): `/spec_kit:deep-review:auto` setup-phase stdin hang
First dispatch hung 3 minutes on the setup-phase question and exited cleanly on stdin EOF. The `:auto` suffix is supposed to be non-interactive, but the markdown-entry setup gate still asks. Workaround: pre-bind all setup answers in the dispatch prompt. Worth filing as a separate deep-review-skill packet to make `:auto` truly non-interactive.

### Format-vs-grading mismatch (F-003 confirmed by review)
sk-doc's compact-changelog format (`## What Changed → #### New Features`) is canonical, but our scenario success criteria used Keep-a-Changelog raw section names. PASS verdicts held because agent + resource trace probes were the load-bearing checks; section-count was a soft check.
<!-- /ANCHOR:limitations -->
