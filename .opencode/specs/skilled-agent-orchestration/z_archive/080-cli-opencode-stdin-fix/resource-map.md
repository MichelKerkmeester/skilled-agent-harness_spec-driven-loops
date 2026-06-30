---
title: "Resource Map: 097 — cli-opencode `</dev/null` stdin-redirect fix"
description: "Path ledger for the 097 fix: 4 YAML workflow files + cli-opencode skill assets/references/SKILL.md/README + 1 new dedicated CHANGELOG + Barter sibling mirror + 2 verified-already-correct stress scripts. Documents which files were read (research input) and which were written (fix output), so future maintainers can audit the fix surface area at a glance."
trigger_phrases:
  - "097 resource map"
  - "cli-opencode stdin fix paths"
  - "dev null fix file ledger"
importance_tier: "important"
contextType: "infrastructure-fix"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix"
    last_updated_at: "2026-05-08T14:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored resource map"
    next_safe_action: "Spec complete; cosmetic strict-validate cleanup deferred"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08-097"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map: 097 — cli-opencode `</dev/null` stdin-redirect fix

Path ledger for every file the 097 packet touched, read, or referenced. Use this to audit the fix surface area and to scope any future packet that needs to revisit the same code paths.

---

## 1. INPUTS — Files read (research / context)

### Discovery sources

| Path | Why read |
|------|----------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/logs/iter-1-stdout.log` (and similar iter-N-stdout.log files) | Empirical evidence: 14 dispatch attempts hung at 0% CPU |
| `~/.local/share/opencode/log/2026-05-08T*.log` | opencode internal log: identified `+60s snapshot prune cleanup` as the last log entry before hang |
| `/Users/.../codex-council-output.log` | GPT-5.5 multi-AI council deliberation that proposed Hypothesis #2 (TTY/stdin read) |

### Files inspected for fix-target identification

| Path | Why read |
|------|----------|
| `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` (lines ~717–739) | Located `if_cli_opencode` block — the canonical dispatch shape |
| `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` (lines ~649–671) | Same |
| `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` (lines ~781–803) | Same |
| `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` (lines ~758–780) | Same |
| `.opencode/skills/cli-opencode/SKILL.md` (§4 ALWAYS list, lines 277–293) | Located rule 5 — narrow scope to generalize |
| `.opencode/skills/cli-opencode/references/integration_patterns.md` (§6, lines 261–286) | Located while-read narrow scope to broaden |
| `.opencode/skills/cli-opencode/references/cli_reference.md` (§4 flag reference) | Located insertion point for new "Stdin handling" subsection |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Located template index for top-of-file warning insertion |
| `.opencode/skills/cli-opencode/README.md` (§2 Quick Start) | Located insertion point for new §5 Background Dispatch |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/{010-stress-test-rerun-v1-0-2,001-search-intelligence-stress-test/001-scenario-design}/scripts/dispatch-cli-opencode.sh` | Verified already had `</dev/null` from prior packets |
| `barter/.opencode/skill/cli-opencode/SKILL.md` (§4 rule 5) | Mirror target |
| `barter/.opencode/skill/cli-opencode/references/integration_patterns.md` (§6) | Mirror target |

---

## 2. OUTPUTS — Files written / modified

### Spec-folder docs (this packet)

| Path | Lines | Purpose |
|------|------:|---------|
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/spec.md` | 198 | Level 2 specification |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/plan.md` | 113 | Phased implementation plan |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/tasks.md` | 36 | Per-file task list (T1–T18) |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/checklist.md` | 53 | QA validation checklist |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/description.json` | 24 | Packet metadata |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/graph-metadata.json` | 16 | Graph metadata |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/implementation-summary.md` | ~190 | Summary, verification, follow-ups |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/resource-map.md` | (this file) | Path ledger |
| `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/changelog.md` | ~70 | Change history |

### YAML workflow patches

| Path | Lines changed |
|------|--------------:|
| `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` | +2 (line 728: `</dev/null`) +1 note (line 741) |
| `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` | +2 (line 660) +1 note (line 673) |
| `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` | +2 (line 792) +1 note (line 805) |
| `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` | +2 (line 769) +1 note (line 782) |

### cli-opencode skill updates (main repo)

| Path | Change |
|------|--------|
| `.opencode/skills/cli-opencode/SKILL.md` | §4 ALWAYS rule 5: rewritten from `while read` narrow to all non-interactive callsites |
| `.opencode/skills/cli-opencode/references/integration_patterns.md` | §6: retitled "STDIN HANDLING — `</dev/null` IS REQUIRED FOR ALL NON-INTERACTIVE DISPATCH"; 4 fix patterns + position rule + automation invocation |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | §4: new "Stdin handling — `</dev/null` is required for non-interactive dispatch" subsection |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Top-of-file warning callout |
| `.opencode/skills/cli-opencode/README.md` | §2 Quick Start: new §5 "Background / Automation Dispatch (REQUIRES `</dev/null`)" |
| `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md` | NEW FILE — dedicated 8-section changelog (~270 lines) |

### Barter sibling mirror

| Path | Change |
|------|--------|
| `barter/.opencode/skill/cli-opencode/SKILL.md` | §4 rule 5 mirrored |
| `barter/.opencode/skill/cli-opencode/references/integration_patterns.md` | §6 mirrored |

### Verified-already-correct (no change)

| Path | Status |
|------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh` | Line 49 already has `</dev/null` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh` | Line 49 already has `</dev/null` |

### Memory entries (auto-memory)

| Path | Status |
|------|--------|
| `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/feedback_opencode_run_requires_dev_null_stdin.md` | Authored 2026-05-08 |
| `~/.claude/.../memory/MEMORY.md` (index entry) | Updated 2026-05-08 |

---

## 3. EXTERNAL REFERENCES

### Provider regex specs (no URLs from external/ — this is a fix, not research)

- DeepSeek API spec: `tools[N].function.name` validated against `^[a-zA-Z0-9_-]+$` (provider-side; visible in 400 error message)
- OpenAI Codex CLI: used via `codex exec --model gpt-5.5 -c model_reasoning_effort=xhigh -c service_tier=fast` for the council deliberation
- opencode CLI v1.14.39: `/opt/homebrew/lib/node_modules/opencode-ai/bin/.opencode` (Bun-compiled Mach-O ARM64)

### Upstream filing target

- `https://github.com/opencode-ai/opencode/issues` (recommended follow-up, out of scope for 097)

---

## 4. CROSS-PACKET DEPENDENCIES

| Packet | Relationship |
|--------|--------------|
| `027-xce-research-based-refinement` (`.opencode/specs/system-spec-kit/`) | Discovered the bug during iter-1 dispatch hangs; provides the production validation that the fix works (10-iter run completed post-fix) |
| `096-rename-opencode-dirs-to-plural` (`specs/skilled-agent-orchestration/`) | Sibling packet on cli-opencode infrastructure; predecessor in numbering |
| Future `028-code-graph-hld-lld` through `032-code-graph-adoption-eval` (proposed in 027 sub-packet-proposals.md) | Will rely on the cli-opencode dispatch path being reliable; this fix unblocks them |

---

## 5. NON-DISPATCH AUTOMATION REVIEWED (NOT TOUCHED)

Surveyed but determined out-of-scope for 097 (no `opencode run` calls inside or already correctly written):

- All `*.sh` scripts under `.opencode/skills/system-spec-kit/scripts/` — no `opencode run` calls
- All `*.cjs`/`*.ts` files under `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` — Node-side dispatch logic that delegates to YAML workflows
- All `Bash` tool invocations from agent definitions — not packaged automation, runtime composition

If a future packet adds new automation that calls `opencode run`, the SKILL.md §4 rule 5 (now generalized) is the canonical reference.

---

## 6. AUDIT TRAIL

```bash
# Verify all 4 YAMLs have </dev/null in their if_cli_opencode block
$ grep -c "</dev/null" .opencode/commands/speckit/assets/speckit_deep-{research,review}_{auto,confirm}.yaml
.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:2
.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:2
.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:2
.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:2

# Verify cli-opencode skill rule 5 documents the requirement
$ grep -c "non-interactive.*opencode run" .opencode/skills/cli-opencode/SKILL.md
1

# Verify barter mirror
$ grep -c "non-interactive.*opencode run" barter/.opencode/skill/cli-opencode/SKILL.md
1

# Verify dedicated changelog file exists
$ test -f .opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md && echo present
present

# Verify stress-test scripts already correct
$ grep -c "</dev/null" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/{010-stress-test-rerun-v1-0-2,001-search-intelligence-stress-test/001-scenario-design}/scripts/dispatch-cli-opencode.sh
.../010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh:1
.../001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh:1
```

---

## 7. POSITION-IN-TIMELINE

This packet was authored on 2026-05-08 in parallel with the active 027-xce-research-based-refinement deep-research run. The 027 run discovered the stdin-deadlock as a side-effect of trying to dispatch its 10 research iterations. iter-15 attempt-15 (using `</dev/null`) became the production validation: it succeeded in 4 m 36 s and unblocked the remaining 9 iterations + synthesis, which all completed successfully. Total fix-to-validation feedback loop: ~3 hours of debugging + 30 minutes of mechanical edits + 50 minutes of validating against the live deep-research run.
