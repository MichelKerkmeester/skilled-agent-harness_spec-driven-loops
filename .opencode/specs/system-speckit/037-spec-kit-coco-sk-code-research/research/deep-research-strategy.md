---
title: Deep Research Strategy — 077 system-spec-kit + mcp-coco-index + sk-code OpenCode audit
description: Per-session strategy file tracking research focus, what worked, what failed, and where to focus next across iterations.
---

# Deep Research Strategy — 077 system-spec-kit + mcp-coco-index + sk-code OpenCode audit

## 1. OVERVIEW

Per-session "persistent brain" for the 077 deep-research run. Sections 7-11 are reducer-owned (machine-managed across iterations); sections 2-6, 12-13 are human-set at init.

---

## 2. TOPIC

Deep research on three intertwined surfaces:

1. **system-spec-kit** — skill + MCP server. Health, drift between docs and code, places where templates/scripts have grown organically and now contradict, gaps in test coverage on the spec-folder validator and graph-metadata backfill, MCP tool surface coverage vs docs, performance hotspots, concrete improvement targets.

2. **mcp-coco-index** — skill + MCP server. Semantic-search effectiveness, indexing freshness/staleness behavior, CLI vs MCP parity, query routing decisions vs documented decision tree, embedding-provider abstraction, concrete improvement targets.

3. **sk-code OpenCode side** — `.opencode/skills/sk-code/references/opencode/` and `.opencode/skills/sk-code/assets/opencode/`. Audit: do they need updating, refining, or extra files? Look for staleness vs current `.opencode/` patterns, coverage gaps (missing language-sub-detection docs, missing verification recipes, missing checklists for skills/agents/commands authoring), drift between declared `resource_map` paths and on-disk structure, concrete add/refine/remove targets.

**Cross-cutting questions:**

- How does sk-code's smart router interact with system-spec-kit's spec-folder writes? (e.g., do `/speckit:complete` flows correctly load sk-code resources when implementing in `.opencode/`?)
- How does mcp-coco-index ingest sk-code assets/references and is its semantic indexing surfacing them effectively?
- Are there missed integration points where one of these three surfaces could be leveraged from another?

---

## 3. KEY QUESTIONS (remaining)

- [ ] Q1 — Where does system-spec-kit have the greatest doc/code drift right now (validator, templates, manifest, MCP tools)?
- [ ] Q2 — Are there test-coverage gaps in `validate.sh --strict`, `graph-metadata-backfill`, `generate-context.js`, or anchor/template-headers checks that mask real bugs?
- [ ] Q3 — Does mcp-coco-index's CLI/MCP routing match the documented decision tree, and is its index freshness behavior reliable across edits?
- [ ] Q4 — Is mcp-coco-index actually ingesting `.opencode/skills/sk-code/` resources? Are queries surfacing them with usable rank?
- [ ] Q5 — What concrete OpenCode references/assets are missing from `sk-code/references/opencode/` and `sk-code/assets/opencode/` that the smart router would benefit from?
- [ ] Q6 — Does the sk-code router's `STACK_FOLDERS` contract match on-disk structure today (post-069 motion_dev integration, post-068 sk-doc reorg)?
- [ ] Q7 — When `/speckit:complete` writes inside `.opencode/`, is sk-code's OpenCode surface correctly loaded (smart-router cross-skill integration)?

---

## 4. NON-GOALS

- Webflow stack changes (out of scope)
- motion_dev directory work (just shipped in 069 / v3.1.0.0; immutable for this packet)
- barter/coder/ mirror tree (separate sync)
- z_archive/ historical records
- cli-* (codex/copilot/opencode/gemini/claude-code) skill audits (not in scope; focus is the three named surfaces)
- Code rewrites or implementation — research-only

---

## 5. STOP CONDITIONS

- Convergence: 2 consecutive iterations report no new P0/P1 findings (convergenceThreshold = 0.10)
- Max iterations: 10
- Hard wall-clock cap: 120 minutes total
- Per-iteration cap: 10 minutes wall-clock + 12 tool calls

---

## 6. ANSWERED QUESTIONS

[None yet — populated as iterations resolve questions]

---

<!-- MACHINE-OWNED: START -->

## 7. WHAT WORKED

[First iteration — populated after iteration 1 completes]

---

## 8. WHAT FAILED

[First iteration — populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]

---

## 11. NEXT FOCUS

For iteration 11: No further research iteration is recommended unless the run is manually extended. Move to final synthesis with zero P0s and four P1 remediation clusters in dependency order: (1) add authoring-time `sk-code` OpenCode resource loading to system-spec-kit implement/complete workflows, (2) create a machine-readable sk-code OpenCode resource manifest plus first-class spec-folder/skill/agent/command authoring resources, (3) resolve mcp-coco-index maintenance ownership and refresh/telemetry parity, then add rank smoke tests after canonical resources exist, and (4) harden default validator/graph-metadata coverage for malformed metadata and phase-parent rule drift.

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

Prior packets in this track:

- **068 sk-doc-organization** — relocated `assets/agents/` templates and `assets/documentation/{feature_catalog,testing_playbook}/` to `assets/` root. May affect sk-code references that point to old paths.
- **069 sk-code-motion-dev-and-playbook** (just shipped as v3.1.0.0) — added cross-stack `motion_dev/` peer category. SKILL.md already updated; references and assets populated.
- **071 sk-doc-router-stress-test** — 15 scenarios, 3 CLIs, baseline matrix.
- **072 sk-doc-router-rerun-refined-extraction** — extractor v2; surfaced cli-copilot hallucination as P1-072-001.
- **073 test-and-toolchain-cleanup** — fixed telemetry schema drift validator bug.
- **074 test-alignment-validator-esm-migration** — ESM rewrite of validator test.
- **075 cli-copilot-hallucination-caveat** — caveat shipped in cli-copilot/SKILL.md + sk-doc/SKILL.md.
- **076 sk-doc-router-coverage-v3** — extended matrix to 17 scenarios (added OPTIMIZATION + INSTALL_GUIDE), bullet-aware v3 extractor.

Validator paths to inspect:

- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js`
- `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`
- `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`

mcp-coco-index entry points:

- `.opencode/skills/mcp-coco-index/SKILL.md` (+ scripts/)
- MCP server folder (under `mcp-servers/coco-index/` or similar)

sk-code OpenCode resources:

- `.opencode/skills/sk-code/references/opencode/`
- `.opencode/skills/sk-code/assets/opencode/`
- `.opencode/skills/sk-code/SKILL.md` (smart router + STACK_FOLDERS)

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex (gpt-5.5/high/fast, sandbox=workspace-write, timeout=900s)
- Current generation: 1
- Started: 2026-05-05T16:28:50Z
