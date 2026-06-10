---
title: "Session Handover — 027 + 145 Epic Continuation [template:handover.md]"
description: "Resume handover for the expanded 027 epic: phases 000-010 shipped+reviewed+remediated; new phases 011-015 in build (012/013/014/011-memory done, speckit+create in flight); new packet 145 (advisor/code-graph adoption) scaffolded and queued for implementation; then 5-iter Fable-via-claude2 review + stress/playbook. Branch-only, no main merge."
trigger_phrases:
  - "027 epic resume"
  - "011-015 build status"
  - "145 advisor code-graph adoption"
  - "epic continuation handover"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-10T20:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "New per-parent review /goal; 016 scaffolded; 145 lanes in flight"
    next_safe_action: "Commit 016 + registry; run 011 deep review; finish 145 + 015"
    blockers: []
    key_files:
      - "handover.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-027-epic-continuation"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
# Session Handover — 027 + 145 Epic Continuation

> Replaces the historical turso-revalidation handover (012-015 scaffold; that content is in git history at commit `1d7e7269bf`). This is the live epic-continuation resume artifact.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

## 0. AFTER COMPACTION — DO THIS FIRST

1. Re-read `~/.claude/CLAUDE.md` (compaction protocol) and the project `CLAUDE.md`.
2. Read THIS file fully.
3. **Check the in-flight background lanes** (they may have completed during compaction): tasks `btv07c8at` (011 speckit family) and `bixyvgj0q` (011 create family). For each: extract the final text from `/tmp/impl-011-{speckit,create}.out.json` (node loop over JSON lines, last `type:"text"`), verify files landed (`git status`), confirm no live-DB/daemon touch, run the family `validate.sh --strict`, then **scoped-commit** (`git commit --only -- <paths>`).
4. Do NOT trust the compaction summary's implied next step — verify against this file + `git log`.
5. Continue the epic per §4 order. Work autonomously (the /goal forbids asking unless really needed).

---

## 1. GOVERNING /goal (Stop-hook-enforced, verbatim)

> Complete the entire 027 epic on branch `028-mcp-to-cli-tool-transition` (never merge/push to main). Phases 000-010 are shipped, release-cleaned, deep-reviewed (CONDITIONAL, 0 P0), and remediated. Now also implement the five planned phases (011 command-presentation, 012 causal-traversal BFS, 013 vector read-path resilience, 014 packed BM25, 015 storage adapter ports). For each: expand the scaffold via /speckit:plan, implement with cli-opencode gpt-5.5-fast --variant high, verify with Fable 5 via the claude2 account (switch to native claude when claude2 is usage-limited). Honor each scaffold's gates and the handover execution order: 012 ∥ 014 → 013 (coordinates with 008) → 015 last; 011 independent. At 015 planning, make the recorded phase-split-vs-promote decision. When 011-015 implemented + verified, run a deep review over the new phases (~20-30 iters) and remediate with Fable 5. Finally, validate the complete 000-015 epic through updated stress tests + manual playbook (playbook via cli-opencode MiMo v2.5 Pro / DeepSeek v4 Pro). Only sleep when the whole epic is done, verified, and tested. Autonomous; no main merge; comment hygiene; scoped commits; never touch host daemons.

**Operator amendments after the /goal (cumulative, newest wins):**
- The cross-pollination side-quest **IS in the epic**: scaffold + IMPLEMENT all 10 advisor/code-graph transfers (packet `skilled-agent-orchestration/145`).
- CLI-tooling UX/docs/integration/automation improvements belong **inside 027** as child phase `027/016-cli-tooling-ux` (NOT a track-root packet — operator corrected a proposed 146). Scaffolded from the assessment at `/tmp/cli-tooling-assessment.md`.
- **REVIEW MODEL (latest /goal — supersedes "5-iter Fable-via-claude2"):** every PARENT phase, AFTER completion, gets **≥5 deep-review iterations** via cli-opencode **gpt-5.5-fast --variant high**, **falling back to MiMo v2.5 Pro** if gpt-5.5-high-fast fails, run through `/deep:start-review-loop` to the tee. Then a **FRESH Fable 5 agent reviews the deep-review synthesis + double-checks the findings** (meta-review). **Re-visit release cleanup after every big phase.** Applies per parent phase (011 owed, 145, 016, 015) + the epic. Final: stress + manual playbook (MiMo/DeepSeek). Autonomous until perfection.

## 2. STANDING CONSTRAINTS (do-nots)

- **Branch only** — never merge/push to `main`. Work stays on `028-mcp-to-cli-tool-transition`.
- **Scoped commits** — `git add -- <paths>` then `git commit --only -F <msg> -- <paths>`. The git index is SHARED with a concurrent deep-improvement/143 session + the turso/z_future session. NEVER `git add -A`. Never commit `deep-improvement/**`, `skilled-agent-orchestration/143-**`, or `z_future/**` (other sessions own those).
- **Comment hygiene [HARD]** — no spec-paths / REQ-/CHK-/ADR-/task-ids / packet/phase numbers in CODE comments. Spec-doc prose MAY cite file:line.
- **Never touch/kill host daemons** or the live `mcp_server/database/**` shards. Tests use temp/copy fixtures only.
- **Fable via claude2** for review/remediation; native claude fallback when claude2 is usage-limited.
- **Concurrency discipline** — keep cli-opencode parallel lanes ≤ 2-3. Launching 4+ `opencode run` within ~5ms triggers a launch race (~2 die instantly: 306ms, exit 1, empty stdout). 2 concurrent is proven safe.

## 3. EPIC STATE (HEAD = 30eb36db96)

### Done + committed (newest first)
- `30eb36db96` chore(145): scaffold xce-feature-adoption packet (parent + 9 children, all strict-validated PASSED)
- `059284c35b` feat(027/011): memory command family — presentation/router split + search UX
- `157b95c213` feat(027/013): vector read-path resilience (P0 fault-injection on copy fixture verified; live DB untouched)
- `e78430e7d2` feat(027/014): packed BM25 + BM25F (P0 RSS 111MB/warmup 809ms verified)
- `db38d4b921` feat(027/012): shared BFS traversal (P0 equivalence vs CTE verified; faster)
- `1d7e7269bf` docs(027): parent-doc reconciliation + 012-015 scaffolds + handover (the turso one)
- `7f72ce0f63` docs(027): deep-review synthesis — CONDITIONAL, 0 P0 / 4 P1 (parent-doc drift; review/ packet)
- `04e1cd3f5b` fix(144): macOS identity vars (USER/LOGNAME/__CF_USER_TEXT_ENCODING) in CLI dispatch env
- `adae43d71b` feat(144): per-executor --config-dir override for cli-claude-code
- `ca01a6dab3` before-vs-after.md | `4027b36ea5` root README | `c0b67a5089` Wave B | `2f52299b37` Wave A

(NOTE `455c48d504` is the concurrent 143 deep-improvement session's commit — NOT mine.)

### In flight (verify + commit these first after compaction)
- **`btv07c8at`** — 011 speckit family (commands/speckit/*.md: plan/resume/implement/complete + presentation md; spec 027/011/002-speckit-commands). Output: `/tmp/impl-011-speckit.out.json`.
- **`bixyvgj0q`** — 011 create family (commands/create/*.md: 7 cmds; spec 027/011/003-create-commands). Output: `/tmp/impl-011-create.out.json`.

### Queued (task tracker #33-40)
1. 011 doctor family (#35) — commands/doctor/{mcp,speckit,update}.md. Brief at `/tmp/impl-011-doctor.txt`.
2. 015 storage adapter ports (#36) — 5 per-port slices in mcp_server/lib/storage/ports/; behavior-preserving, golden-eval-gated; adopt 012 (GraphTraversal) + 014 (LexicalSearch). Decision recorded in 015/plan.md (per-port slices, in-epic). LAST code phase.
3. 145 implement (#37) — 9 phases / 10 transfers. Disjoint trees: advisor (system-skill-advisor/mcp_server) + code-graph (system-code-graph). Each child has spec/plan/tasks ready. Source: `/tmp/xce-adoption-analysis.md`.
4. Deep review (#38) — 5 iters Fable-5 via claude2, `/deep:start-review-loop` on the new phases.
5. Remediate (#39) — Fable 5.
6. Final validation (#40) — stress tests + manual playbook (MiMo/DeepSeek) on full 000-015 + 145.

### Uncommitted (mine, defer to final /memory:save)
Scattered `027/**/description.json` + `graph-metadata.json` metadata churn (from generator/backfill runs). Harmless; fold into the final canonical save. Do NOT sweep in 143/z_future.

## 4. RESUME MECHANICS (how to dispatch + verify)

**cli-opencode implementation lane (Gate-3 baked, scoped):**
```
AI_SESSION_CHILD=1 gtimeout -k 60 2400 opencode run --model openai/gpt-5.5-fast --variant high \
  --format json --dir "$PWD" --dangerously-skip-permissions "$(cat /tmp/<brief>.txt)" \
  </dev/null > /tmp/<brief>.out.json 2> /tmp/<brief>.err.log    # run_in_background:true
```
Brief MUST bake: "Spec folder <path> (pre-approved, skip Gate 3)", ALLOWED WRITE PATHS (disjoint), BANNED OPERATIONS, the phase's gate, "read your own scaffold spec/plan/tasks", verify (build + vitest + validate --strict), hygiene HARD, no git, no daemon/live-DB.

**Verify each lane (don't trust its report):** extract final text from out.json (node: loop JSON lines, last `type:"text"` `.part.text`); `git status` files landed; independently re-run the phase's vitest from `mcp_server` (`cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run <files>`); run ONE authoritative `npm run build` after a wave (catches cross-lane composition); hygiene grep; then scoped commit. Read the test to confirm it's genuine (not a stub) for P0 gates.

**Fable-via-claude2 (review/remediation):** `cli-claude-code` executor with `--config-dir=~/.claude-account2` (sets CLAUDE_CONFIG_DIR; env fix landed so it auths under the filtered dispatch env). claude2 was session-limited until ~20:40 UTC 2026-06-10 — check first; native fallback (`claude` default account, drop --config-dir) per the operator PS. Bare `claude` resolves on PATH (real binary).

**Deep review (the command fan-out, "to the tee"):** `/deep:start-review-loop` → `fanout-run.cjs --spec-folder <X> --loop-type review --fanout-config-json '<json>' --base-artifact-dir <X>/review`. Config shape: `{concurrency, executors:[{kind,model,configDir,reasoningEffort,label,count,iterations,timeoutSeconds}]}`. Each lineage = ONE CLI session running the whole loop. cli-opencode lineages now run CONCURRENTLY (async spawn + pool — the spawnSync-serialization is FIXED). Merge: `fanout-merge.cjs --loop-type review --artifact-dir <X>/review` (strongest-restriction). PER-PARENT review (latest /goal): ≥5 iters per parent phase via cli-opencode gpt-5.5-fast --variant high (executor=cli-opencode model=openai/gpt-5.5-fast reasoningEffort=high), **fallback MiMo v2.5 Pro** (xiaomi/mimo-v2.5-pro --variant high) if gpt-5.5-high-fast fails; then a FRESH Fable 5 agent (cli-claude-code via claude2, or native if limited) reviews the synthesis + double-checks findings. See memory `deep-review-command-fanout-cli-gotchas` + `deep-review-parallel-fanout-execution`.

**Stress/playbook:** stress harness in mcp_server; manual playbook scenarios run via cli-opencode MiMo v2.5 Pro (`xiaomi/mimo-v2.5-pro --variant high`) / DeepSeek (`deepseek/deepseek-v4-pro`) — check live `opencode providers list` first (provider ids drift; see memory `xiaomi-token-plan-provider-id`).

## 5. KEY PATHS
- Epic root: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/`
- Review packet (done): `.../027.../review/` (review-report.md CONDITIONAL, merged registry, fanout-attribution.md, 6 lineage dirs)
- New phases: `.../027.../{011-command-presentation-workflow-separation,012-causal-traversal-bfs,013-vector-read-path-resilience,014-packed-bm25-field-weights,015-storage-adapter-ports}/`
- 145 packet: `.opencode/specs/skilled-agent-orchestration/145-xce-feature-adoption-advisor-codegraph/` (parent + 001-009)
- mcp_server: `.opencode/skills/system-spec-kit/mcp_server/` (build: `npm run build`; tests from here)
- Command families: `.opencode/commands/{memory,speckit,create,doctor}/`
- Briefs: `/tmp/impl-011-{speckit,create,doctor}.txt`, `/tmp/xce-adoption-analysis.md`
- deep-loop runtime: `.opencode/skills/deep-loop-runtime/` (fanout-run.cjs, executor-config.ts, executor-audit.ts)
