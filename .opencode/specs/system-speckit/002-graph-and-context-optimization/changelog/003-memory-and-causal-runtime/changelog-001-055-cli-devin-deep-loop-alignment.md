---
title: "059: cli-devin deep-loop alignment across 6 surfaces"
description: "cli-devin promoted to first-class deep-loop executor. Six modified files updated executor enums, YAML dispatch and agent iter contracts. Six new files provide the deep-loop iter contract, agent-config recipes, iter-template asset and three SWE-1.6-locked JSON profiles."
trigger_phrases:
  - "cli-devin deep-loop alignment"
  - "deep-loop executor cli-devin"
  - "agent-config-deep-research-iter"
  - "SWE-1.6 iter contract cli-devin"
  - "deep-research executor enum"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/055-cli-devin-deep-loop-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Packets 056 and 058 dispatched roughly 40 cli-devin SWE-1.6 iterations through custom orchestration because the deep-research and deep-review commands did not list cli-devin in their executor enums, the two LEAF agents had no SWE-1.6 iter contract and no agent-config JSON recipes existed to lock model and tool surface declaratively.

Six files were modified and six new files were created across five execution phases on 2026-05-15. The executor enum strings in both command docs now list all six validator-accepted kinds. Both YAML dispatch assets wire the `if_cli_devin:` branch with `--agent-config` substitution. Both LEAF agents carry a scoped SWE-1.6 Iter Contract subsection that binds the seven retrospective lessons from 056 and 058. The cli-devin SKILL.md gained a deep-loop contract pointer and two new reference entries. Three agent-config JSON profiles (research-iter, review-iter, synthesis) cover the full loop lifecycle. Future packets can dispatch through the standard command path without custom orchestration.

### Added

- `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` (NEW): full iter contract covering recipe selection, prompt body shape, dispatch shape and versioning policy across 11 sections
- `.opencode/skills/cli-devin/references/agent-config-recipes.md` (NEW): Devin schema reference with per-recipe wording, substitution placeholders, copy-paste invocations and verification procedure across 9 sections
- `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` (NEW): per-iter prompt template with three named skeletons for research, review and synthesis
- `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (NEW): SWE-1.6 read-only research profile with Read, Grep, Glob, Bash and Exec inspection allowlist
- `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json` (NEW): SWE-1.6 read-only review profile with narrower tool surface
- `.opencode/skills/cli-devin/assets/agent-config-synthesis.json` (NEW): SWE-1.6 scoped-write synthesis profile covering the final synthesis pass

### Changed

- `.opencode/commands/deep/start-research-loop.md`: executor enum strings updated to list all six validator-accepted kinds (`native | cli-codex | cli-gemini | cli-claude-code | cli-opencode | cli-devin`) at lines 79, 124 and the option list
- `.opencode/commands/deep/start-review-loop.md`: same enum-string updates at parallel locations
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`: `if_cli_devin:` branch ported from the review YAML and wired with `--agent-config` inline `sed` substitution pointing at the research-iter recipe
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`: existing `if_cli_devin:` branch wired with `--agent-config` dispatch using the same `sed` pattern pointing at the review-iter recipe
- `.opencode/agents/deep-research.md`: SWE-1.6 Iter Contract subsection added inside the Routing Scan anchor (+16 lines, total 579 lines)
- `.opencode/agents/deep-review.md`: same subsection added between Runtime Mirror Awareness and the Review Contract anchor (+18 lines, total 559 lines)
- `.opencode/skills/cli-devin/SKILL.md`: ALWAYS rule 13 (Deep-Loop Iter Contract pointer) added plus two new entries in the References section. Version bumped to 1.0.3.0 (471 lines, under 500 cap)

### Fixed

- `deep_start-research-loop_auto.yaml` had no `if_cli_devin:` executor branch, forcing 056 and 058 to use custom dispatch. Branch now present and wired.
- Both command docs omitted cli-devin and cli-opencode from the executor enum even though `executor-config.ts` accepted both. Enum now matches the validator.
- agent-config JSON shape was unverified against the devin runtime. Live probe iterated through schema-mismatch errors to confirm the canonical key set (`system_instructions`, `allowed_tools`, `permissions.allow/deny/ask`, `mcp_servers`, `extensions`) with `Exec(cmd)` scope expressions. All three JSON profiles now parse and dispatch cleanly.

### Verification

| Check | Result | Command |
|-------|--------|---------|
| Touched files sk-doc validate | PASS (0 errors across 4 new/modified docs. Pre-existing non-sequential-numbering warnings on commands and agents unaffected by this packet's edits) | `validate_document.py` |
| JSON parse on agent-config files | PASS (3/3) | `python3 -c "import json; json.load(open(...))"` |
| Devin strict-parse smoke-test | PASS (3/3 recipes substituted and dispatched cleanly) | `devin -p --agent-config <substituted.json> --model swe-1.6 --permission-mode auto -- "say ok then stop"` |
| Strict-validate packet | PASS (0 errors, 0 warnings) | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| gpt-5.5 scaffold review | DONE (REVISE verdict. Scope corrected pre-execution) | `codex exec --model gpt-5.5 -c model_reasoning_effort=xhigh -c service_tier=fast` |
| gpt-5.5 Phase 4 review | DONE (JSON shape recommendations and 3rd synthesis recipe confirmed) | same codex command, focused prompt |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/deep/start-research-loop.md` | Modified | Executor enum and YAML dispatch updated to include cli-devin and cli-opencode |
| `.opencode/commands/deep/start-review-loop.md` | Modified | Same executor enum and YAML dispatch updates at parallel locations |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | `if_cli_devin:` branch added. `--agent-config` wired via inline sed substitution |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Existing `if_cli_devin:` branch wired with `--agent-config` dispatch |
| `.opencode/agents/deep-research.md` | Modified | SWE-1.6 Iter Contract subsection added (+16 lines) inside Routing Scan anchor |
| `.opencode/agents/deep-review.md` | Modified | SWE-1.6 Iter Contract subsection added (+18 lines) between Runtime Mirror Awareness and Review Contract |
| `.opencode/skills/cli-devin/SKILL.md` | Modified | ALWAYS rule 13 and two reference entries added. Version 1.0.3.0. 471 lines total |
| `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` | Created (NEW) | Full deep-loop iter contract across 11 sections |
| `.opencode/skills/cli-devin/references/agent-config-recipes.md` | Created (NEW) | Agent-config schema reference and copy-paste invocations across 9 sections |
| `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` | Created (NEW) | Per-iter prompt template with research, review and synthesis skeletons |
| `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` | Created (NEW) | SWE-1.6 read-only research profile |
| `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json` | Created (NEW) | SWE-1.6 read-only review profile with narrower tool surface |
| `.opencode/skills/cli-devin/assets/agent-config-synthesis.json` | Created (NEW) | SWE-1.6 scoped-write synthesis profile |

### Follow-Ups

- Author `research/retrospective.md` consolidating lessons from packets 056 and 058 (planned but deferred from this packet).
- Verify the `<repo-root>` substitution in both YAML `if_cli_devin:` branches is stable across machines where `$PWD` differs from the original authoring path.
- Update `cli-opencode` deep-loop references if a parallel alignment packet is planned for that executor.
- Resync agent-config JSON recipes if a future devin CLI version changes accepted schema keys or tightens validation.
