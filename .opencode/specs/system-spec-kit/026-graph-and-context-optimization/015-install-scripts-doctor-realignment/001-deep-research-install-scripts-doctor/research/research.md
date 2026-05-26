---
title: "Deep Research — Install guides / scripts / doctor realignment (post-CocoIndex + 116 impact)"
description: "Canonical synthesis: 45 findings across install guides, scripts, /doctor (+ .claude mirror), and adjacent 116-rename casualties; authoritative DB-path table; rework phasing."
status: complete
iterations: 7
executor: cli-codex/gpt-5.5/high/fast (+ orchestrator logic-sync pass, iter 7)
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor"
    last_updated_at: "2026-05-26T08:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed the 7-iteration deep-research loop and synthesis"
    next_safe_action: "Scaffold rework phases 015/002 install-guide and 015/003 doctor realignment"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "70859d71-f191-429c-96cd-6b73bb9745d8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Deep Research Synthesis

## 1. Executive Summary

The install guides, setup scripts, and `/doctor` command surface carry **substantial post-CocoIndex-deprecation AND post-116-deep-skill-evolution drift**. Seven iterations (cli-codex gpt-5.5/high/fast for discovery; an orchestrator source-of-truth pass for the DB-path logic-sync) cataloged **45 findings** (clean delta count; ~9 P1, ~11 P2/P3 distinct + cross-runtime mirror duplicates) and **26 ruled-out** confirmations.

**The drift is two-rooted:**
1. **CocoIndex/rerank deprecation residue** in operator-facing text: install-guide "cross-encoder reranking enabled by default", `install.sh --help` capability text, a `/doctor` menu option "6) Debug Code Graph (semantic search daemon)", and a `mcp-doctor.sh` "11 graph tools" claim (current: 8).
2. **116-rename / relocation casualties**: `sk-ai-council` → `deep-ai-council` and `sk-deep-*` → `deep-*` renames, the `deep-loop-runtime` relocation, and the skill-advisor extraction to `mk_skill_advisor` left stale skill names, DB paths, and MCP tool-ownership in scripts, doctor routes, and (adjacent) advisor/optimizer/test infra.

**Highest-value outcome — a resolved DB-path logic-sync:** three competing code-graph DB paths and three deep-loop DB paths were floating across docs/configs/doctor. Reading the actual DB-open source settled them (§3) and **inverted earlier executor classifications**: the doctor route manifest's `system-code-graph/database/` path — which iters 3/5 treated as the canonical fix-target — is *itself stale*. Without this pass the rework would have "corrected" the install guide to another wrong path.

**Scope segmentation:** findings split into **CORE** (install guides + scripts + `/doctor`, including its full `.claude` mirror — this packet's rework remit) and **ADJACENT-116** (advisor fixtures, routing corpus, optimizer manifest, contract-parity tests, `.gemini` deep command — real 116 casualties but a distinct surface; recommend a sibling phase, with the 2 advisor P1s prioritized since they are live correctness bugs).

---

## 2. Method & Convergence

| Iter | Focus | Ratio | Net result |
|------|-------|-------|-----------|
| 1 | Q1 install guides | 0.72 | 1 P1 (cross-encoder claim); coco/ccc install residue ruled out (5 guides) |
| 2 | Q2 scripts | 0.66 | P2 install.sh help + P1 test-council-matrix sk-ai-council; coco/sidecar/8765 ruled out |
| 3 | Q3 /doctor | 0.61 | 4 P1 + 2 P2 (DB paths, advisor ownership, semantic-daemon menu, route-validate, sk-* glob) |
| 4 | Q4 systematic 116 | 0.68 | advisor fixture + routing corpus (P1, live inputs), optimizer + contract tests (P2); deep-loop DB double-relocation |
| 5 | Q5 4-runtime mirror | 0.74 | `.claude` = full doctor mirror (SHARED-STALE); mcp-doctor 11-tools; codex/gemini drift; topology mapped |
| 6 | long-tail closeout | 0.31 | 13 net-new tail (install-guide DB rows + .bak boundaries + .claude dups); 9 tokens ruled clean |
| 7 | DB-path logic-sync (orchestrator) | 0.10 | resolved code-graph + deep-loop canonical paths from source; retracted 1 finding |

Convergence path: ratio peaked at 0.74 (each new surface yielded findings), then **0.74 → 0.31 → 0.10** once consolidation + verification passes ran. **STOP criterion met = "all 5 key questions answered with evidence"** (strategy §5), at iteration 7 of 10.

---

## 3. Authoritative current-truth path/identity table

> Verified from source in iteration 7. THIS is the fix-target reference for the rework phases.

| Thing | ✅ Current-truth value | ❌ Stale values seen in surfaces |
|-------|----------------------|-------------------------------|
| **code-graph DB** | `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` (`readiness-marker.ts:20`, `mcp_server/README.md:173`, `.codex/config.toml:89`) | `mcp_server/database/code-graph.sqlite` (install guide); `system-code-graph/database/code-graph.sqlite` (doctor `_routes.yaml:71`) |
| **deep-loop DB** | `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite` (`coverage-graph-db.ts`, `lib/coverage-graph/README.md:37`, `SKILL.md:80`, `README.md:66`) | `mcp_server/database/deep-loop-graph.sqlite` (pre-116); `deep-loop-runtime/storage/deep-loop-graph.sqlite` (post-relocation, also stale) |
| **mk_code_index tools** | **8** | "11 graph tools" (`mcp-doctor.sh:61`) |
| **mk-spec-memory tools** | **35** | (no live 39/64 hits in these surfaces — ruled clean) |
| **advisor MCP tools** | `mcp__mk_skill_advisor__advisor_*` | `mcp__mk_spec_memory__advisor_*` (`doctor/update.md:4`) |
| **council skill** | `deep-ai-council` | `sk-ai-council` (`test-council-matrix.sh:14`) |
| **deep loop skills** | `deep-research`, `deep-review`, `deep-agent-improvement` | `sk-deep-research/review/agent-improvement` |
| **Stage-3 rerank** | algorithmic MMR diversity + MPAB (no cross-encoder) | "cross-encoder reranking enabled by default" |

⚠️ **Adjacent latent**: `system-code-graph/mcp_server/core/config.ts:14` computes `defaultDir = mcp_server/database`, disagreeing with the documented `.spec-kit/code-graph/database` default. The documented path governs only when `SPECKIT_CODE_GRAPH_DB_DIR` is set. This config-vs-docs mismatch is an adjacent system-code-graph concern (flag for sibling follow-up), NOT install/scripts/doctor core.

---

## 4. CORE findings (this packet's rework remit)

### 4A. Install guides (Q1)

| ID | Sev | File:line | Issue → Fix |
|----|-----|-----------|-------------|
| C-01 | P1 | `system-spec-kit/mcp_server/INSTALL_GUIDE.md:718-720` | "### Cross-Encoder Reranking ... enabled by default" → rewrite to Stage-3 MMR diversity reranking + MPAB chunk collapse |
| C-02 | P1 | `…/INSTALL_GUIDE.md:83` | architecture diagram `mcp_server/database/code-graph.sqlite` → `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` |
| C-03 | P1 | `…/INSTALL_GUIDE.md:114` | canonical-paths table `mcp_server/database/code-graph.sqlite` → `.spec-kit/code-graph/database/…` |
| C-04 | P1 | `…/INSTALL_GUIDE.md:1113` | troubleshooting file table `mcp_server/database/code-graph.sqlite` → `.spec-kit/code-graph/database/…` |
| C-05 | P3-keep | `…/INSTALL_GUIDE.md:1197` | VERSION HISTORY cross-encoder row — HISTORICAL, **keep** (changelog) |

### 4B. Scripts (Q2)

| ID | Sev | File:line | Issue → Fix |
|----|-----|-----------|-------------|
| C-06 | P2 | `system-spec-kit/scripts/setup/install.sh:280` | `--help` text "Structural authority propagation (cross-encoder reranking)" → drop/replace the cross-encoder phrase |
| C-07 | P1 | `system-spec-kit/scripts/test-council-matrix.sh:14` | invokes `quick_validate.py .opencode/skills/sk-ai-council` (absent) → **DECISION**: repoint to `deep-ai-council`, OR delete the script (it was the now-deleted pre-push-council hook's matrix runner — likely orphaned) |

### 4C. /doctor — `.opencode` AND `.claude` (Q3, SHARED-STALE unless noted)

| ID | Sev | File:line (×.opencode +.claude mirror) | Issue → Fix |
|----|-----|-----------|-------------|
| C-08 | P1 | `doctor/_routes.yaml:71` | code-graph `system-code-graph/database/code-graph.sqlite` (stale per iter-7) → `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` |
| C-09 | P1 | `doctor/_routes.yaml:92` + `speckit.md:47` + `update.md:219,270` | deep-loop `…/storage/deep-loop-graph.sqlite` → `…/deep-loop-runtime/database/deep-loop-graph.sqlite` |
| C-10 | P1 | `doctor/assets/doctor_deep-loop.yaml:78,162` (+ .bak :79) | `mcp_server/database/deep-loop-graph.sqlite` → `deep-loop-runtime/database/…` |
| C-11 | P1 | `doctor/assets/doctor_update.yaml:100,106` (+ .bak :101,107) | `mcp_server/database/{code-graph,deep-loop-graph}.sqlite` → code-graph `.spec-kit/…`, deep-loop `deep-loop-runtime/database/…` |
| C-12 | P1 | `doctor/update.md:4` | frontmatter `mcp__mk_spec_memory__advisor_{recommend,status,validate,rebuild}` → `mcp__mk_skill_advisor__advisor_*` |
| C-13 | P1 | `doctor/speckit.md:101,133-134` | menu "6) Debug Code Graph (semantic search daemon)" + symptom map → remove/replace (no semantic daemon; code-graph is structural) |
| C-14 | P2 | `doctor/scripts/mcp-doctor.sh:61` | "structural AST + 11 graph tools" → "8 tools" |
| C-15 | P2 | `doctor/scripts/route-validate.sh:30` | `ROUTER_FILE` defaults to missing `doctor.md` → `speckit.md` (currently skips the F2 tool-subset check → why drift went uncaught) |
| C-16 | P2 | `doctor/assets/doctor_code-graph.yaml:158` | includeSkills globs only `.opencode/skills/sk-*` → include `deep-*` (else granular scope undercounts renamed skills) |

**Note:** C-08…C-16 exist in BOTH `.opencode/commands/doctor/` and `.claude/commands/doctor/` (full text mirror). `.codex` has no doctor mirror (config/agents only); `.gemini` doctor is thin TOML wrappers (no stale body text). Rework must patch **both** `.opencode` + `.claude`.

---

## 5. ADJACENT-116 findings (recommend sibling phase; advisor P1s are live correctness bugs)

| ID | Sev | File:line | Issue → Fix |
|----|-----|-----------|-------------|
| A-01 | P1 | `system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:17-45` | gold ids `sk-deep-research/review/agent-improvement`; loaded by `advisor-validate.ts:187` as **live validation input** → advisor validates against renamed-away skills. Fix → `deep-*` |
| A-02 | P1 | `system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` | gold labels `sk-deep-*`; default corpus for `score-routing-corpus.py` → scores canonical `deep-*` output as wrong. Fix → `deep-*` |
| A-03 | P2 | `system-spec-kit/scripts/optimizer/optimizer-manifest.json:15-38` | `configPaths` → `sk-deep-research/review` asset dirs; loaded by `optimizer/search.cjs`. Fix → `deep-*` |
| A-04 | P2 | `system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` + `graph-aware-stop.vitest.ts:17` | probe `sk-deep-research` paths (gone) → tests silently skip. Fix → `deep-research` |
| A-05 | P2 | `system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | probe `sk-deep-review` (describe.skip) → skips current parity. Fix → `deep-review` |
| A-06 | P1 | `.gemini/commands/deep/start-research-loop.toml:2` | references `.opencode/skills/sk-deep-research/...` → `deep-research` |
| A-07 | P3 | `system-code-graph/mcp_server/core/config.ts:14` | `defaultDir = mcp_server/database` vs documented `.spec-kit/code-graph/database` (latent) |

---

## 6. Ruled-out / confirmed-clean (no action)

- No `INSTALL_GUIDE.md` instructs installing CocoIndex / `ccc` / coco-daemon / `.venv` / `.cocoindex_code` (5 guides).
- No live `cocoindex` / `ccc` / coco-daemon / rerank-sidecar / port-8765 / `cross-encoder` in scripts or doctor execution paths.
- No surviving `doctor:cocoindex` / `doctor-cocoindex-daemon` route or playbook.
- Deleted `pre-push-council.sh` hook is fully dereferenced (installer + hook templates clean).
- `copy-skill-advisor-dist-data.sh` copies only advisor JSON (no removed embedder/sidecar artifacts).
- No `39 tools` / `64 tools` claims in the doctor/install/.codex surfaces.
- advisor `skill-graph.json` (database copy) uses current `deep-*` ids.
- `.codex/config.toml` tool counts (35 / 8) + advisor ownership in both doctor route manifests are CORRECT/in-sync.
- **RETRACTED**: iter-5 f-iter005-005 (`.codex/config.toml:89` code-graph DB "drift") — `.spec-kit/code-graph/database/` is the *correct* current default.

---

## 7. Recommended rework phasing (015/002+)

- **015/002 — Install-guide realignment** (CORE 4A + C-06): `system-spec-kit/mcp_server/INSTALL_GUIDE.md` cross-encoder section → MMR; 3 code-graph DB rows → `.spec-kit/code-graph/database/`; `install.sh:280` help text. Small, low-risk; cli-codex or direct edits.
- **015/003 — /doctor realignment (×2 runtimes)** (CORE 4C, C-08…C-16): the largest surface — DB paths (code-graph → `.spec-kit/…`, deep-loop → `deep-loop-runtime/database/…`), advisor MCP ownership, semantic-daemon menu option 6, `mcp-doctor` 11→8 tools, `route-validate.sh` ROUTER_FILE, code-graph `sk-*`→`deep-*` glob — applied to BOTH `.opencode` + `.claude`. Fix `route-validate.sh` first so its F2 check guards the rest. cli-devin swe-1.6 viable for the mechanical mirror edits; verify with the (fixed) route validator.
- **015/004 — 116 script casualties + adjacent (optional/sibling)** (A-01…A-07): prioritize A-01/A-02 (live advisor-validation correctness bugs) + the `test-council-matrix.sh` decision (C-07); A-03…A-06 are test/optimizer/gemini hygiene. May spin to a sibling packet if 015 should stay strictly install/scripts/doctor.

**Verification per phase:** edit → `validate.sh <phase> --strict` → for doctor, run `route-validate.sh` (after C-15 fix) + confirm no residual stale tokens via the iter-6 token sweep → reconcile completion metadata.

---

## 8. Provenance

7 iterations; deltas in `research/deltas/iter-00{1..7}.jsonl`; narratives in `research/iterations/iteration-00{1..7}.md`; state log `research/deep-research-state.jsonl`. Discovery executor: cli-codex `gpt-5.5` reasoning=high service_tier=fast (iters 1-6); iteration 7 = orchestrator source-of-truth logic-sync pass. One-at-a-time dispatch with SIGKILL + RSS check between iterations.

<!-- ANCHOR:citations -->
## 9. Citations

- source: `research/iterations/iteration-001.md` (Q1 install guides)
- source: `research/iterations/iteration-002.md` (Q2 scripts)
- source: `research/iterations/iteration-003.md` (Q3 /doctor)
- source: `research/iterations/iteration-004.md` (Q4 systematic 116 sweep)
- source: `research/iterations/iteration-005.md` (Q5 4-runtime mirror)
- source: `research/iterations/iteration-006.md` (long-tail closeout)
- source: `research/iterations/iteration-007.md` (DB-path logic-sync)
- source: code-of-record `system-code-graph/mcp_server/lib/readiness-marker.ts:20`, `lib/code-graph-db.ts:264`, `deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:238`
<!-- /ANCHOR:citations -->
