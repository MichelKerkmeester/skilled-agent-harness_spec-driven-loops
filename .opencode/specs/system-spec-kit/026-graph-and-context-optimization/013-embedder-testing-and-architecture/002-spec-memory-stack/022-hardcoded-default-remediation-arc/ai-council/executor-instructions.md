# AI Council Executor Instructions — Next 3 Phases

**Council verdict:** Execute phases 002b → 003 → 004 in sequence, per the OPERATIONAL ordering adopted by convergence. These are the momentum phases + the first heavy phase.

---

## Phase 002b: CocoIndex Reranker Doc Prose Fix

| Field | Value |
|---|---|
| **Phase slug** | `002b-cocoindex-reranker-doc-prose` |
| **Executor** | main-agent (direct Edit, no cli-X dispatch) |
| **Framework** | RCAF (simplified — docs-only, no code) |
| **Estimated wall-clock** | 30–60 min |
| **Findings to close** | 4 P0 reranker prose corrections: 007-reranker-opt-in.md (121-line scenario), manual_testing_playbook.md:402+407, benchmarks/README.md:202 |

### Pre-Dispatch Checklist

1. **[MANDATORY] Qwen3-Reranker-0.6B footprint verification:**
   - Read the Qwen3 model directory to verify disk footprint size (expected ~1.2GB per HuggingFace cache)
   - Read the daemon log to verify the model load identifier string (the exact string CocoIndex daemon logs when loading the reranker)
   - Use this verified identifier in doc prose replacements
2. **Read target files** before editing:
   - `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md` — 121-line scenario referencing ~2.3GB BGE model and BGE cross-encoder load activity
   - `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:402,407`
   - `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md:202`
3. **Verify canonical reranker name:** Read `registered_embedders.py:256` to confirm `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` is still the live default.

### Edits Required

| File | Change | Verification |
|---|---|---|
| `007-reranker-opt-in.md` (entire file, ~121 lines) | Replace `BAAI/bge-reranker-v2-m3` → `Qwen/Qwen3-Reranker-0.6B`; replace BGE size prose (~2.3GB) with Qwen3 actual footprint; replace BGE cross-encoder load log prose with Qwen3 daemon-log identifier | `rg "BAAI/bge-reranker-v2-m3\|BGE.*cross-encoder" <file>` → 0 hits |
| `manual_testing_playbook.md:402,407` | Same model name swap | `rg "BAAI/bge-reranker-v2-m3" <file>` → 0 hits |
| `benchmarks/README.md:202` | Same model name swap | `rg "BAAI/bge-reranker-v2-m3" <file>` → 0 hits |

### Verification Gate

- `rg "BAAI/bge-reranker-v2-m3" .opencode/skills/mcp-coco-index/manual_testing_playbook/ .opencode/skills/mcp-coco-index/mcp_server/benchmarks/` → 0 hits
- `rg "Qwen/Qwen3-Reranker-0.6B"` → ≥ 3 new hits across the 3 files
- `bash validate.sh 002b-cocoindex-reranker-doc-prose --strict` → exit 0

### Abort Signal

- Qwen3 footprint cannot be verified (model directory missing, daemon not running) → defer 002b again, note in phase 002 implementation-summary, move to 003
- Edit makes wrong model name due to footprint confusion → revert, re-verify, re-edit

### Commit Handoff Skeleton

```
docs(022/002b): resync CocoIndex reranker doc prose to Qwen/Qwen3-Reranker-0.6B canonical

Closes 4 P0 audit findings from packet 021 (reranker side, deferred from phase 002):
- 007-reranker-opt-in.md: 121-line scenario BAAI/bge-reranker-v2-m3 → Qwen/Qwen3-Reranker-0.6B
- manual_testing_playbook.md:402,407 + benchmarks/README.md:202 same swap

Verified Qwen3-0.6B disk footprint (~1.2GB) + daemon-log identifier before editing.
```

---

## Phase 003: Codex Agents Mirror Fill

| Field | Value |
|---|---|
| **Phase slug** | `003-codex-agents-mirror-fill` |
| **Executor** | main-agent (direct Write + Edit, no cli-X dispatch) |
| **Framework** | RCAF (simplified — investigation gate + template population) |
| **Estimated wall-clock** | 30–60 min |
| **Findings to close** | 1 P0 (.codex/agents/ empty) + 1 P1 (stale (proposed) qualifier) |

### Pre-Dispatch Investigation (MANDATORY — resolves scope)

1. **Read `.codex/config.toml`** — determine whether Codex CLI expects `.codex/agents/*.toml` definitions
2. **Read `.codex/agents/` directory** — check for README.txt or any config indicating intentional emptiness
3. **Resolution:**
   - If Codex expects agent TOML files: proceed with mirror population (full scope)
   - If empty is intentional (documented in config): downgrade P0 to P2, document in phase 003 implementation-summary, skip mirror population, ONLY remove (proposed) qualifier from `.opencode/agents/`
4. **Read `.opencode/agents/` directory** — list all agent markdown files to mirror

### Files to Create (if mirror needed)

For each `.opencode/agents/*.md`, create `.codex/agents/*.toml` with Codex-appropriate frontmatter. Reference: memory `feedback_new_agent_mirror_all_runtimes.md` — Codex uses TOML format with workspace-write sandbox.

Agent files to mirror:
- `ai-council.toml`
- `code.toml`
- `context.toml`
- `debug.toml`
- `deep-agent-improvement.toml`
- `deep-research.toml`
- `deep-review.toml`
- `explore.toml`
- `general.toml`
- `markdown.toml`
- `prompt-improver.toml`
- `review.toml`

### Qualifier Removal

| File | Change |
|---|---|
| `.opencode/agents/deep-research.md:51` | Remove `(proposed)` qualifier from deep-ai-council reference |
| `.opencode/agents/deep-review.md:45` | Remove `(proposed)` qualifier from deep-ai-council reference |

The rename arc (116-deep-skill-evolution) has shipped — `deep-ai-council` is the canonical name.

### Verification Gate

- `ls .codex/agents/*.toml | wc -l` → matches `.opencode/agents/*.md` count (or documented as intentionally empty)
- `rg "deep-ai-council \(proposed\)" .opencode/agents/` → 0 hits
- `bash validate.sh 003-codex-agents-mirror-fill --strict` → exit 0

### Abort Signal

- Investigation reveals `.codex/agents/` empty is INTENTIONAL → document finding, skip mirror, proceed with qualifier removal only
- Codex TOML format is unknown/unclear → escalate to operator, defer 003 until format is clarified

### Commit Handoff Skeleton

```
feat(022/003): populate .codex/agents/ mirror + remove (proposed) qualifier

Closes 2 audit findings from packet 021:
- P0: .codex/agents/ empty → populated with 12 TOML agent definitions mirroring .opencode/agents/
- P1: (proposed) qualifier removed from deep-research.md:51 + deep-review.md:45

Codex TOML format per memory feedback_new_agent_mirror_all_runtimes.md.
Investigation confirmed .codex/config.toml expects agent definitions.
```

---

## Phase 004: Skill-Advisor Threshold Consolidation (4 WAVES)

| Field | Value |
|---|---|
| **Phase slug** | `004-skill-advisor-threshold-consolidation` |
| **Executor** | cli-opencode + deepseek-v4-pro (`--variant high`) |
| **Framework** | CRAFT (4-wave structured refactor) |
| **Estimated wall-clock** | 2–4 hours |
| **Findings to close** | 14 P0 + 9 P1 + 2 P2 (largest cluster) |

### Pre-Dispatch Checklist (10 steps — ALL MANDATORY)

1. **[MANDATORY] Kill zombie opencode-go processes:**
   ```bash
   pkill -f opencode-go || true
   sleep 2
   ps aux | grep opencode-go  # expect 0 results
   ```
2. **[MANDATORY] Verify Mac memory:**
   ```bash
   ps aux | awk '{sum+=$6} END {printf "%.0f MB RSS\n", sum/1024}'
   # FLAG if > 8192 MB. If flagged: kill non-essential daemons (CocoIndex, rerank-sidecar)
   ```
3. **[MANDATORY] Verify opencode credit:**
   ```bash
   opencode providers list
   # Confirm deepseek-v4-pro is available and workspace has credit
   ```
4. **Clear /tmp artifacts from prior phases:**
   ```bash
   rm -f /tmp/004-prompt.md /tmp/004-out.log
   ```
5. **Read `cli-opencode/SKILL.md` §4** — refresh prompt-quality contract
6. **Read current SKILL_ADVISOR_COMPAT_CONTRACT:**
   - `.opencode/skills/system-skill-advisor/mcp_server/lib/policy/contract.ts:10-11`
   - Note exact export shape (property names, types) for import statements
7. **Read ENV_REFERENCE.md existing env vars** — ensure `SPECKIT_ADVISOR_*` naming aligns with existing `SPECKIT_*` conventions
8. **[MANDATORY] Baseline typecheck:**
   ```bash
   cd .opencode/skills/system-spec-kit && npm run typecheck:root
   # Must exit 0 before dispatch
   ```
9. **sequential_thinking ≥ 5 thoughts** before composing the dispatch prompt
10. **Compose prompt via sk-prompt (CRAFT), CLEAR ≥ 40/50**

### Dispatch Prompt Contract (CRAFT Framework)

```
CONTEXT: skill-advisor has 14 P0 hardcoded-default findings concentrated in 8 files. 0.8/0.35
confidence/uncertainty thresholds appear inline in 6 sites with no env-var override.
SKILL_ADVISOR_COMPAT_CONTRACT is declared but only test files import it. RoutingCalibration
interface has gaps (3 missing bonus/penalty pairs). prompt-policy is fully hardcoded
(5 linguistic sets + 5 fire/no-fire thresholds).

ROLE: Senior TypeScript maintainer; multi-file refactor with typed contract + env-var wiring.

ACTION (4 waves, execute in order, HALT if any wave fails):

WAVE 1: Consolidate 6 inline 0.8/0.35 sites to import from SKILL_ADVISOR_COMPAT_CONTRACT.
  Files: fusion.ts:41-42, lanes/calibration.ts:8-9, routing/routing-decision.ts:97-99,
  prompt-cache.ts:48-49, subprocess.ts:81-82, render.ts:127-131.
  Pattern: replace inline literal with:
    import { SKILL_ADVISOR_COMPAT_CONTRACT } from '../policy/contract.js';
    ... ?? SKILL_ADVISOR_COMPAT_CONTRACT.confidenceThreshold ?? 0.8

WAVE 2: Expand RoutingCalibration interface with 3 missing bonus/penalty pairs.
  Add: memory:save (currently inline 0.55/-0.25/-0.18), create:agent (0.65/-0.3/-0.2),
  testing-playbook (currently inline). Wire fusion.ts:281-291 to read from typed interface.

WAVE 3: Wire env-var overrides:
  - SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON (Partial<SkillAdvisorCalibration>)
  - SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD + SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD
  - SPECKIT_ADVISOR_LANE_WEIGHTS_JSON (lane-registry.ts:7-13)
  Parse at startup, merge with defaults.

WAVE 4: Externalize prompt-policy:
  - prompt-policy.ts:16-86 5 hardcoded linguistic sets → JSON at SPECKIT_ADVISOR_PROMPT_POLICY_PATH
  - prompt-policy.ts:162-214 5 fire/no-fire thresholds → 5 SPECKIT_ADVISOR_PROMPT_* env vars

FORMAT: Edit files in place; create 3 new vitest files (scorer-threshold-invariants,
routing-calibration-completeness, calibration-override). No scope creep beyond skill-advisor.

AFTER EACH WAVE, RUN AND REPORT:
1. npm run typecheck → exit code
2. npx vitest run scorer/ routing/ policy/ prompt-cache.ts subprocess.ts → pass/fail count
3. rg -n "['\"]?? *0\.8|['\"]?? *0\.35" scorer/ routing/ policy/ prompt-cache.ts subprocess.ts
   → hit count (must reach 0 by end of wave 1)

HALT if any wave fails verification. Do NOT proceed to next wave on failure.
Report per-wave results clearly: "WAVE 1: typecheck exit 0, vitest 5/5 pass, ban-list 0 hits ✓"

BUNDLE GATE (after all 4 waves):
- typecheck exit 0
- All vitest pass (existing + new)
- Ban-list grep returns 0 hits in production paths
- New test files: scorer-threshold-invariants.test.ts, routing-calibration-completeness.test.ts,
  calibration-override.test.ts — all pass
```

### Dispatch Command

```bash
opencode run \
  --model deepseek/deepseek-v4-pro \
  --variant high \
  --agent general \
  --format json \
  --dangerously-skip-permissions \
  --dir "$(pwd)" \
  "$(cat /tmp/004-prompt.md)" \
  </dev/null > /tmp/004-out.log 2>&1 &
```

**Note PID: `echo $!`** — set a 3hr timer. If no output after 3hr: check process status, review partial output log.

### Post-Dispatch Ingest & Verification

1. **Wait for completion** — check `/tmp/004-out.log` for "BUNDLE GATE PASSED" or "HALT" message
2. **Read output log** — verify per-wave verification results:
   - Wave 1: typecheck exit 0, vitest pass, ban-list 0 hits
   - Wave 2: typecheck exit 0, vitest pass
   - Wave 3: typecheck exit 0, vitest pass
   - Wave 4: typecheck exit 0, vitest pass
3. **[MANDATORY] Run git diff --stat:**
   ```bash
   git diff --stat
   ```
   Expected files changed (must match, no extra files):
   - `system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
   - `system-skill-advisor/mcp_server/lib/scorer/lanes/calibration.ts`
   - `system-skill-advisor/mcp_server/lib/routing/routing-decision.ts`
   - `system-skill-advisor/mcp_server/lib/policy/prompt-cache.ts`
   - `system-skill-advisor/mcp_server/lib/subprocess.ts`
   - `system-skill-advisor/mcp_server/lib/render.ts`
   - `system-skill-advisor/mcp_server/lib/policy/prompt-policy.ts`
   - `system-skill-advisor/mcp_server/lib/policy/contract.ts` (may extend)
   - `system-skill-advisor/mcp_server/lib/scorer/lanes/lane-registry.ts` (wave 3 env vars)
   - `system-skill-advisor/mcp_server/tests/scorer-threshold-invariants.vitest.ts` (NEW)
   - `system-skill-advisor/mcp_server/tests/routing-calibration-completeness.vitest.ts` (NEW)
   - `system-skill-advisor/mcp_server/tests/calibration-override.vitest.ts` (NEW)
4. **[MANDATORY] Run verification gate:**
   ```bash
   npm run typecheck:root  # must exit 0
   npx vitest run scorer/ routing/ policy/ prompt-cache.ts subprocess.ts  # all pass
   rg -n "['\"]?? *0\.8|['\"]?? *0\.35" scorer/ routing/ policy/ prompt-cache.ts subprocess.ts  # 0 hits
   ```
5. **If any gate fails:** RED ALERT — do NOT proceed to phase 005
6. **Author phase 004 spec docs** (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) post-execution
7. **Strict-validate:** `bash validate.sh 004-skill-advisor-threshold-consolidation --strict` → exit 0

### Abort & Recovery Signals

| Signal | Action |
|---|---|
| git diff shows 0 files changed | Silent revert / nothing done. Read `/tmp/004-out.log`. If executor reported success but no files changed: RED ALERT — opencode-go may have reverted. Kill zombie processes, re-dispatch. |
| git diff shows files outside expected list | Hallucination / scope creep. Identify extra files. If harmless (comments only): accept. If code change: `git restore <extra-file>`, report to operator. |
| Wave N reports typecheck failure | Read output log. Identify which wave failed and why. `git diff --stat` to see what's on disk. Restore failing wave's files, adjust prompt, redispatch from that wave. |
| Wave 3 silently reverts wave 1's changes | Detection: ban-list grep after phase shows hits. Recovery: `git restore` on reverted files, adjust prompt to emphasize "preserve all previous waves' changes", redispatch wave 3. |
| opencode-go OOM / process killed | Kill zombie processes, verify RSS, clear /tmp, redispatch from last successful wave. |
| Credit exhausted mid-dispatch | Switch to cli-devin `--model deepseek-v4-pro` (DeepSeek API direct, separate billing). |

### Wave Split Fallback

If wave 2 causes scope creep (e.g., RoutingCalibration interface expansion requires more than 3 pairs):
1. **Commit wave 1's changes as 004a:** `git add` + commit with message "feat(022/004a): consolidate 6 inline 0.8/0.35 sites to SKILL_ADVISOR_COMPAT_CONTRACT import"
2. **Adjust plan:** Rename remaining waves 2-4 to phase `004b-skill-advisor-interface-expansion`
3. **Redispatch 004b** with adjusted prompt — same waves 2-4, but prompt starts with "Wave 1 already shipped. Work from current state."
4. **004b verification gate MUST re-run 004a's ban-list test:** `rg` for inline `0.8`/`0.35` in production paths → 0 hits

---

## Cross-Phase Check: Before Phase 005 Dispatch

After phase 004 ships (or 004a if split), BEFORE phase 005:

1. Re-run phase 001's ban-list grep: `rg "BAAI/bge-base-en|jina-embeddings-v3" shared/embeddings/profile.ts shared/embeddings.ts` → 0 hits outside comments/dim-lookups
2. Re-run phase 002/002b's ban-list grep: `rg "embeddinggemma-300m|BAAI/bge-reranker-v2-m3" .opencode/skills/mcp-coco-index/` → 0 hits
3. Run `npm run typecheck:root` → exit 0 (ensures phase 004 changes haven't broken cross-subsystem imports)

---

## Operator Advice

- **Phase 002b + 003 can be executed in a single session (~1.5 hours).** Both are main-agent direct — no cli-X dispatch overhead.
- **Phase 004 requires a fresh session with verified Mac health.** Morning dispatch recommended (clean state, no zombie processes, max available memory).
- **If phase 004 takes >3 hours:** check `/tmp/004-out.log` for progress. Deepseek-v4-pro may be rate-limited or the prompt may be too complex for one call. Consider splitting into 004a+004b at that point.
- **After phase 004 ships:** take a break. The arc's largest phase is done. Remaining phases (005–010) are lighter.
