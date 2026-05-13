---
title: "Plan: Local-LLM legacy and outdated-docs/config-drift review (post-014)"
description: "Execution plan for a 20-iteration /spec_kit:deep-review:auto run scoped to local-LLM/embedding-default residue. Executor: cli-codex gpt-5.5 reasoning=high service_tier=fast. Convergence 0.05."
trigger_phrases:
  - "local-llm legacy review plan"
  - "015 review plan"
  - "post-014 review plan"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Local-LLM legacy and outdated-docs/config-drift review (post-014)

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. APPROACH

A single autonomous `/spec_kit:deep-review:auto` run is dispatched against this packet, with cli-codex (gpt-5.5, reasoning=high, service_tier=fast) as the per-iteration executor. The skill's built-in state machine handles iteration looping, convergence detection, and the read-only prompt-pack constraints; this plan documents the dispatch contract and the post-run verification.

The pre-flight scan (Phase 1 of session planning) identified ~147 active-file residue surface concentrated in:
- `shared/embeddings/{factory,voyage,openai,hf-local}.ts` and surrounding tests
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` (outdated voyage-4 precedence claim)
- `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` + `references/settings_reference.md` (voyage-code-3 still listed primary)
- `.opencode/install_guides/README.md` (text-embedding-3-small default export wording)
- Per-packet `description.json` / `graph-metadata.json` files with possibly stale model strings

Convergence tightened to `0.05` (vs default 0.10) to prevent premature stop on the wide-shallow surface — residue hunts produce many low-finding-rate iterations early.

---

## 2. DISPATCH CONTRACT

### Slash command

```text
/spec_kit:deep-review:auto "Hunt residue from the local-LLM/embedding-default migration (packet 014-local-embeddings-setup-a + 18 sub-phases). Treat post-014 defaults as canonical: EmbeddingGemma-300m hf-local q8 (Memory), google/embeddinggemma-300m sentence-transformers (CocoIndex), llama-cpp opt-in. Flag any code/doc/config claiming a different default. Scope surfaces (read-only): (1) code .ts/.py/.cjs under shared/, .opencode/skills/, scripts/, mcp_server/, cocoindex_code/; (2) markdown .md/SKILL.md/README/INSTALL_GUIDE under .opencode/skills/**, .opencode/install_guides/, root; (3) JSON/configs description.json, graph-metadata.json, package.json, .utcp_config.json, .claude/mcp.json, .mcp.json, opencode.json, _routes.yaml, .codex/config.toml, .gemini/settings.json, pyproject.toml, requirements*.txt; (4) assets/config_templates.md, prompt packs, fixtures; (5) .opencode/skills/**/references/**. Known stale anchors to validate as P1 on iter-1: ENV_REFERENCE.md voyage-4 precedence claim; embedding_resilience.md 1024-dim cache key; mcp-coco-index INSTALL_GUIDE voyage-code-3 primary; install_guides/README.md text-embedding-3-small default. Discriminate true residue (auto-flag) vs intentional historical context (014/* migration narrative, factory fallback chain, doctor provider detection — note but DO NOT flag as residue)." --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review --max-iterations=20 --convergence=0.05 --executor=cli-codex --model=gpt-5.5 --reasoning-effort=high --service-tier=fast --executor-timeout=900
```

### PRE-BOUND SETUP ANSWERS (inline body)

```yaml
PRE-BOUND SETUP ANSWERS:
  review_target_type: files
  review_dimensions: correctness,traceability,maintainability
  spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review
  execution_mode: AUTONOMOUS
  maxIterations: 20
  convergenceThreshold: 0.05
  executor: cli-codex
  executor_model: gpt-5.5
  executor_reasoning: high
  executor_service_tier: fast
  executor_timeout: 900
  resource_map_emit: true
```

### Flag rationale
- `--max-iterations=20` — user-specified; gives margin for a broad shallow surface
- `--convergence=0.05` — tighter than default 0.10; prevents premature stop on a wide-shallow hunt
- `--service-tier=fast` — required per standing memory rule (maps to codex `-c service_tier="fast"`)
- `--reasoning-effort=high` — user-specified
- Dimensions trimmed to 3 (security excluded — minimal signal for this hunt); `correctness` covers dead-code + config-drift, `traceability` covers stale-docs + outdated-defaults, `maintainability` covers fixture-rot + asset-rot

---

## 3. RM-8 / DESTRUCTIVE-SCOPE GUARD

| Layer | Status | Notes |
|-------|--------|-------|
| 1 — Prompt-pack BANNED OPERATIONS | Built-in | `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` bans `rm`, `git rm`, `mv`, `sed -i`, `rmdir` |
| 2 — Worktree isolation | Optional, skipped | Review is read-only against external surfaces; only writes within `015-*/review/` |
| 3 — Commit baseline | `5e7095d3336510b5756ba5cac383a8e08d1d79db` | Recovery anchor captured |
| 4 — Model fallback | N/A | cli-codex + gpt-5.5 high fast is the chosen executor |

---

## 4. WORKFLOW OVERVIEW

| Step | Owner | Action | Output |
|------|-------|--------|--------|
| 1 | Main agent | Capture recovery anchor SHA | shell scrollback record |
| 2 | Main agent | Scaffold packet 015 (L2) | this packet's files |
| 3 | Main agent | Fill packet content (spec/plan/tasks/checklist) | scoped review-packet content |
| 4 | `/spec_kit:deep-review:auto` skill | Setup resolution + state-machine init | `review/deep-review-state.jsonl` header |
| 5 | cli-codex (×20 iters) | Execute iteration prompts; emit findings | `review/iterations/iteration-NNN.md` + JSONL records |
| 6 | Skill | Convergence detection + synthesis | `review/review-report.md` |
| 7 | Main agent | Verify report; hand-validate ≥3 P1 findings | verification annotations |
| 8 | Main agent | Update `implementation-summary.md` with verdict + next-step | continuity refresh |

---

## 5. POST-RUN VERIFICATION

- `review/review-report.md` exists and non-empty
- `review/deep-review-state.jsonl` contains 20 iteration records (or fewer if converged earlier — actual count recorded)
- Verdict ∈ {PASS, CONDITIONAL, FAIL}
- ≥3 P1 findings hand-validated against source (file:line evidence is real)
- `git status --porcelain` shows no surprise mutations outside `021-local-llm-legacy-review/`
- Recovery anchor SHA `5e7095d3336510b5756ba5cac383a8e08d1d79db` is still HEAD or ancestor of HEAD

---

## 6. NEXT STEPS (CONDITIONAL ON VERDICT)

| Verdict | Recommended Next Step |
|---------|----------------------|
| PASS | Close 015 packet; no remediation needed |
| CONDITIONAL (P1 advisories) | Scaffold `022-local-llm-legacy-remediation/` per `013/003` precedent (cli-codex gpt-5.5 high fast batched dispatch) |
| FAIL (P0 found) | Halt; surface P0 findings to user before any remediation |
