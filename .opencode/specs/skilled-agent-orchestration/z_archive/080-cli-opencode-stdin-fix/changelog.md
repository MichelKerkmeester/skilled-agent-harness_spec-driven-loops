---
title: "Changelog: 097 — cli-opencode `</dev/null` stdin-redirect fix"
description: "Per-packet change history. The fix appends `</dev/null` to all non-interactive `opencode run` invocations to work around opencode v1.14.39's stdin-startup-read bug that hangs background dispatches at 0% CPU after the +60s snapshot prune cleanup log line."
trigger_phrases:
  - "097 changelog"
  - "stdin fix changelog"
  - "cli-opencode dev null history"
importance_tier: "important"
contextType: "fix-history"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix"
    last_updated_at: "2026-05-08T14:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored packet changelog"
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
# Changelog: 097 — cli-opencode `</dev/null` stdin-redirect fix

---

## v1.0.0 — 2026-05-08

### Added
- **`</dev/null` stdin redirect** to the `if_cli_opencode` block in 4 deep-research/deep-review YAML workflow files:
  - `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` line 728
  - `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` line 660
  - `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` line 792
  - `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` line 769
  Each YAML also gets a new entry in the `notes:` block referencing the fix rationale + cli-opencode SKILL.md §4 rule 5 + memory `feedback_opencode_run_requires_dev_null_stdin.md`.
- **New "Stdin handling" subsection in cli-opencode `references/cli_reference.md` §4** documenting the position rule and the canonical example.
- **Top-of-file warning** in `.opencode/skills/cli-opencode/assets/prompt_templates.md` flagging the rule for any template adapted into automation.
- **New §5 "Background / Automation Dispatch (REQUIRES `</dev/null`)"** in `.opencode/skills/cli-opencode/README.md` Quick Start section.
- **New dedicated changelog file** `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md` — 8 sections, ~270 lines (separate from `CHANGELOG-2026-05-08-tool-name-regex-fix.md` which the user kept scoped to its original 2 fixes).
- **Memory entry** `feedback_opencode_run_requires_dev_null_stdin.md` indexed in `MEMORY.md`.
- **Spec-folder docs** at `specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix/`: spec.md, plan.md, tasks.md, checklist.md, description.json, graph-metadata.json, implementation-summary.md, resource-map.md, changelog.md (this file).

### Changed
- **`.opencode/skills/cli-opencode/SKILL.md` §4 ALWAYS rule 5** rewritten from the `while read` loop narrow scope to all non-interactive `opencode run` callsites that redirect stdout/stderr or run inside loops. Rule now includes rationale, position-in-command guidance, and cross-references to `references/integration_patterns.md` §6 + memory + dedicated CHANGELOG.
- **`.opencode/skills/cli-opencode/references/integration_patterns.md` §6** retitled "STDIN HANDLING — `</dev/null` IS REQUIRED FOR ALL NON-INTERACTIVE DISPATCH"; expanded from 1 failure pattern + 1 fix to 3 failure patterns + 4 fix patterns + hang-symptom diagnostic + position rule + canonical automation invocation. Includes upstream-fix recommendation.
- **`barter/.opencode/skill/cli-opencode/SKILL.md`** — same rule 5 rewrite (sibling-repo mirror).
- **`barter/.opencode/skill/cli-opencode/references/integration_patterns.md`** — same §6 rewrite (sibling-repo mirror).

### Verified (no change required)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh` — already had `</dev/null` on line 49 from its original packet.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh` — same.

### Validation
- 4 YAMLs all parse with `python3 -c "import yaml; yaml.safe_load(...)"` — OK.
- PONG smoke test through the canonical patched pattern: 5 bytes stdout in 16 seconds (was 0 bytes / 12+ min hang pre-fix).
- Real-world: 027-xce-research-based-refinement deep-research iter-15 attempt-15 succeeded in 4 m 36 s using the fix. All 10 iterations + synthesis of the 027 run completed within budget after the patch landed.

### Strict validate
**FAILED** with 3 errors / 3 warnings on cosmetic structural-template conformance (TEMPLATE_HEADERS, ANCHORS_VALID, PRIORITY_TAGS, FRONTMATTER_VALID, FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_SUFFICIENCY). Required files present (FILE_EXISTS+); placeholders filled (PLACEHOLDER_FILLED+); template source headers present (TEMPLATE_SOURCE+); section presence covered by manifest anchors (SECTIONS_PRESENT+); graph metadata present (GRAPH_METADATA_PRESENT+).

The functional fix is verified working in production. Strict-validate cosmetic cleanups (rewrite docs to match system-spec-kit Level 2 manifest exactly) are tracked as deferred follow-on work — they do not block the deployed fix.

### Discovery
Identified by **GPT-5.5 multi-AI council deliberation** via `codex exec --model gpt-5.5 -c model_reasoning_effort=xhigh -c service_tier=fast` after 14 dispatch attempts hung silently across ~3 hours. The council's Hypothesis #2 (TTY/stdin read before session creation) was confirmed by the cheapest stdio discriminator test in 90 seconds: `opencode run ... </dev/null > out 2> err` produced 13 real tool calls vs 0-byte hang from the same command without `</dev/null`.

### Out of scope (deferred)
- Modifying opencode-ai/opencode source itself.
- Filing the upstream issue at `https://github.com/opencode-ai/opencode/issues` (recommended follow-up).
- Pre-commit lint check that flags `opencode run` invocations missing `</dev/null` when stdout is also redirected (REQ-009 P2 deferred to a future packet).
- Updating cli-opencode SKILL.md rule 1 stale baseline reference ("v1.3.17"; current is v1.14.39).
- Updating cli-opencode SKILL.md NEVER rule 4 about `--pure` (the rule is contradicted by the validated requirement, but addressing it is out of scope for this packet).

### Sibling
This is the third independent root cause discovered during the 2026-05-08 cli-opencode reliability investigation. The first two are documented in `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md` (opencode-skills plugin recursion + `@github/copilot-sdk` phantom dep).

---

## Future versions

Reserved space for follow-on packets that re-touch this surface.

- v1.0.1 (anticipated) — strict-validate cleanup: rewrite spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md sections to match system-spec-kit Level 2 template manifest exactly (TEMPLATE_HEADERS + ANCHORS_VALID + PRIORITY_TAGS green).
- v2.0.0 (when upstream fixes the bug) — remove the `</dev/null` redirects from all 4 YAMLs + simplify SKILL.md rule 5 / integration_patterns.md §6 references to "previously required workaround for opencode v<X.Y.Z>".
