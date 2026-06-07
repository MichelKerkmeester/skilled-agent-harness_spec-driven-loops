# Deep Review Report — deep-context 005 / 006 / 007

| Field | Value |
|-------|-------|
| **Review target** | git commit `531dd53028` work across `005-runtime-mirror-parity`, `006-native-default-executor-pool`, `007-deep-command-gate-hardening` |
| **Executor** | `openai/gpt-5.5-fast --variant xhigh` (cli-opencode), 10 parallel READ-ONLY narrow-slice seats |
| **Run shape** | Parallel fan-out (one slice/seat) → central reduce → adversarial verification of every P0/P1 |
| **Date** | 2026-06-07 |
| **Raw discovery** | **P0=1, P1=13, P2=6** (20 findings, 10/10 seats clean exit) |
| **After adversarial verification** | **P0=0, P1=1, P2≈5** in-scope |
| **VERDICT** | **CONDITIONAL** (0 active P0, 1 active P1) |

> The registry (`deep-review-findings-registry.json`) records the **raw** per-seat discovery (20). This report records the **adjudicated** dispositions after verifying each P0/P1 against the actual files — narrow-slice seats can't see what's intentional or handled elsewhere.

---

## 1. Verdict

**CONDITIONAL.** No P0 survived verification. One genuine P1 remains active, and it is a **relocation artifact** (introduced when another session moved `136`→`134/007`), not a flaw in the implementation under review. The implementation work itself (mirrors, native-default pool, command gates) verified clean or only minor-polish. Per deep-review rules, CONDITIONAL → address the P1, then proceed.

---

## 2. Confirmed findings (actionable)

### P1 — active
| ID | Finding | Location | Fix |
|----|---------|----------|-----|
| S10-xxx | **007 packet metadata still references `136`.** `packet_id` / `specFolder` / `spec_folder` point to `skilled-agent-orchestration/136-deep-command-gate-hardening` while the packet now lives at `134/007`. Memory/graph indexing keys off the wrong id. | `007-deep-command-gate-hardening/description.json:12,20`; `graph-metadata.json:3,4` | Rewrite the 4 fields `136`→`134/.../007` (relocation cleanup; not an implementation flaw). |

### P2 — confirmed advisories (in-scope)
| ID | Finding | Location | Note |
|----|---------|----------|------|
| S01 (↓ from P0) | Claude mirror grants the **spec-memory wildcard** (`mcp__mk_spec_memory__*`, includes write tools) on a read-only agent | `.claude/agents/deep-context.md:4` | Downgraded from P0: read-only is enforced by the body + absence of Write/Edit/Bash/Task, and the wildcard matches the sibling convention. But tightening to `…__memory_context, …__memory_search` matches the **original 005 plan** — worth doing. |
| S04 | Command intro still calls the **default** "multi-model" / "parallel heterogeneous sweep" | `start-context-loop.md:270` | De-naming (006) missed the §intro prose; the default is now native-only. Reframe as capability/opt-in. |
| S09 | `deep-loop-runtime` intro lists only **deep-review and deep-research** as consumers | `deep-loop-runtime/SKILL.md:10,16` | Pre-existing staleness; deep-context (+ siblings) also consume it. The new mirror note already implies this — align the intro. |
| S07 | `ask-ai-council` Phase 0 restart names `/deep:ask-ai-council` while the file declares `/speckit:deep-council` canonical | `ask-ai-council.md:62` vs `:92,340` | Dual-naming (already known/flagged in 136 limitations). Pick one canonical name. |

---

## 3. Refuted / not-a-defect (verified)

| Raw finding | Verdict | Why |
|-------------|---------|-----|
| Codex mirror "pins a stale model id" (`gpt-5.4`) | **REFUTED** | House convention — every `.codex/agents/*.toml` uses `gpt-5.4`. Consistent, not stale; a bump is a repo-wide decision. |
| YAML:348 "read-only contradiction" | **REFUTED** | Correct host-writes-state phrasing ("seats write only their own seat JSON; host merges"); pre-existing comment. |
| Context setup omits `executor_pool` from YAML start-condition | **REFUTED** | `executor_pool` is **optional** with a native default — correctly excluded from the required-bind list. |
| Phase-0 restart "drops the mode suffix" | **REFUTED** | `[arguments]` placeholder is the established pattern across all 7 commands and covers `:auto`/`:confirm`. |

## 4. Pre-existing / out-of-scope (real-ish, not introduced by this work)

- Reply-example includes a `convergence` value the parse step doesn't map (`start-context-loop.md:238`) — pre-existing example drift.
- `:restart` advertised without explicit setup/mode routing (`start-context-loop.md:333`) — pre-existing.
- `start-model-benchmark-loop` setup vs `run_label` in confirm mode (`:167`) — that command's setup; this packet only fixed its display box.
- README per-seat path-order (`README.md:171`) — **superseded**: the README was concurrently rewritten by the readme-standardization session (now reads "default pool runs 2 native `@deep-context` seats").

---

## 5. Coverage (10 slices)

| Seat | Slice | Raw P0/P1/P2 | Net after verify |
|------|-------|--------------|------------------|
| 01 | Claude mirror | 1/0/0 | P0→P2 (tighten wildcard) |
| 02 | Codex mirror | 0/1/0 | refuted |
| 03 | canonical agent + native config | 0/0/1 | advisory |
| 04 | context-loop pool options | 0/2/2 | 1 confirmed P2 (intro), rest pre-existing/minor |
| 05 | context-loop gates | 0/2/0 | refuted/pre-existing |
| 06 | research+review gates | 0/0/0 | **clean** |
| 07 | ai-council+skill-bench gates | 0/1/0 | confirmed P2 (dual-name) |
| 08 | cross-command uniformity | 0/2/1 | refuted/pre-existing |
| 09 | YAMLs + skill/README de-naming | 0/3/1 | 1 confirmed P2 (consumer list); README superseded |
| 10 | spec-doc accuracy | 0/2/1 | **1 confirmed P1** (007 metadata) + minor |

**Strongest signal:** the implementation (mirrors, native-default config, command gates) is sound — the only true active defect is the `136`→`007` metadata leftover from the concurrent relocation. Most P1s were narrow-slice false positives (the seat couldn't see repo-wide conventions like the `gpt-5.4` standard or the optional-field design).

---

## 6. Next steps

- **Fix the P1** (007 metadata `136`→`007`) — trivial, safe.
- **Optional P2 polish:** tighten the Claude mirror tools to the read-only pair (matches the 005 plan); reframe the command intro's "multi-model/heterogeneous default"; add deep-context to the deep-loop-runtime consumer line; reconcile the ai-council command name.
- Verdict CONDITIONAL → after the P1, the work is clean.

---

## 7. Remediation applied (2026-06-07)

All confirmed findings fixed and verified (`fail=0`):

| Finding | Action | Verification |
|---------|--------|--------------|
| **P1** 007 metadata `136`→`007` | Rewrote `description.json` + `graph-metadata.json` (packet_id/specFolder/parent_id/specId) and the 5 markdown docs (packet_pointer/session_id/Spec-Folder) to the real `134/.../007` location | `rg 136` → zero refs; `validate.sh --strict` PASS |
| **P2a** Claude mirror over-grant | Tightened `mcp__mk_spec_memory__*` → `…__memory_context, …__memory_search` (read-only pair; matches the 005 plan) | tools line read-only; body still byte-identical to canonical |
| **P2b** intro default-heterogeneous | De-named lines 82/270/364 (multi-model/heterogeneous is now the opt-in); §11 capability mention kept | grep: no default-heterogeneous claim remains |
| **P2c** deep-loop-runtime consumers | Intro now lists deep-review/deep-research/deep-context (+ deep-ai-council via council modules) | grep confirms |
| **P2d** ask-ai-council command name | Reconciled `/speckit:deep-council` → `/deep:ask-ai-council` (registry-canonical) across the file | zero `/speckit:deep-council` refs |

Refuted findings: no action (verified not defects). **Post-remediation verdict: PASS** (0 active P0, 0 active P1).

*Artifacts: `iterations/iteration-001..010.md`, `deep-review-state.jsonl` (config + 10 iterations), `deltas/iter-1..10.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, per-seat raw at `seats/seat-NN.json`.*
