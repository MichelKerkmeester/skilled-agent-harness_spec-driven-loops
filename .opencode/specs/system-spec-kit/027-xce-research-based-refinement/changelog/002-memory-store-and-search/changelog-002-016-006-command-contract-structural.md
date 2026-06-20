---
title: "Command-Contract Structural: Deterministic Arg Handling and Salience Inversion"
description: "The /memory:search command stopped letting weak models drop the query and ask the startup question. A deterministic shell header now emits ARGS_PRESENT and a properly joined QUERY before the model reads policy, the execute path comes first, the startup question is gated behind an explicit ARGS_PRESENT=false guard, and a no-ask guard binds execution to the resolved query."
trigger_phrases:
  - "002/016/006 command contract structural changelog"
  - "deterministic arg resolution header memory search"
  - "salience inversion startup question gated"
  - "weak model drops query fix"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/006-command-contract-structural` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Weak models (Kimi always, MiMo intermittently) dropped the query and asked the startup question, because the contract made ask-when-empty the first and most salient instruction and required the model to actively negate an empty-guard to do its job. This phase fixes it structurally rather than by re-wording. A deterministic shell header at the top of `search.md` computes and emits `ARGS_PRESENT=true|false` and a properly joined `QUERY` before the model reads any policy, so the query is resolved by the shell rather than inferred by the model. The contract is then salience-inverted: the retrieval and execute path comes first, and the startup-question section is gated behind an explicit `ONLY IF ARGS_PRESENT=false` guard, so a populated query never reaches the ask path. An imperative no-ask guard binds execution to the resolved query: when `ARGS_PRESENT=true` the model must execute retrieval on `QUERY` and must not ask the startup question. The header also joins argv itself so the query is one string rather than word-split by `"$@"`. The bare-to-ask behavior is preserved, just gated correctly. The output field set and scoring scale were left untouched, since the next phase owns those.

### Added

- A deterministic `ARGUMENT RESOLUTION` shell header in `search.md` emitting `ARGS_PRESENT` and a joined `QUERY`

### Changed

- `commands/memory/search.md` - execute path moved ahead of the startup question, the startup section gated behind `ARGS_PRESENT=false`, and a no-ask guard bound to the resolved query
- `commands/memory/assets/search_presentation.txt` - the startup-question section now applies only when `ARGS_PRESENT=false`

### Fixed

- A populated query no longer reaches the ask path, so a weak model stops dropping the query and asking the startup question
- The query is joined into one string rather than word-split by `"$@"`

### Verification

| Check | Result |
|-------|--------|
| Shell header | PASS: standalone runs with populated and empty `$ARGUMENTS` emit the correct `ARGS_PRESENT` and `QUERY` |
| Contract consistency | PASS: execute path precedes the gated startup section, the no-ask guard references `ARGS_PRESENT` and `QUERY`, the arg echo remains |
| Strict validate | PASS: `validate.sh --strict` on the phase folder |
| Live execute-rate A/B | DEFERRED: a `--command` run on Kimi and MiMo measuring execute-rate is the documented follow-up |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/commands/memory/search.md` | Modified |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modified |

### Follow-Ups

- The live confirmation (an A/B `--command` run on Kimi and MiMo measuring execute-rate under the new structure) is the documented follow-up and cannot be run from the implementing session.
