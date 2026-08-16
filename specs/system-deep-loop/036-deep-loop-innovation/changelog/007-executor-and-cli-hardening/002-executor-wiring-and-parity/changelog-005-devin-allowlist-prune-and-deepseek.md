---
title: "Changelog: devin allowlist prune, DeepSeek gap, and mirror parity [007-executor-and-cli-hardening/002-executor-wiring-and-parity/005-devin-allowlist-prune-and-deepseek]"
description: "Prune curated-out cli-devin aliases, add the missing DeepSeek ids, and convert the CJS allowlist mirror drift into a test failure."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/005-devin-allowlist-prune-and-deepseek` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity`

### Summary

After the additive parity packet, three gaps remained: nine curated-out aliases (`adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `gemini`, `codex`, `swe-1-6`) were still dispatchable via devin fan-out; the catalog-featured DeepSeek family had no id in the devin allowlist at all, so a `deepseek-v4-pro` dispatch was hard-rejected; and the duplicated CJS allowlist in `fanout-run.cjs` could silently drift from the TS source. This phase makes the enforced devin dispatch surface exactly the curated four-family scope (GLM-5.2, SWE-1.7, Grok 4.5, DeepSeek) and converts mirror drift from a silent risk into a test failure via a parity guard. The spec records its status as Complete.
