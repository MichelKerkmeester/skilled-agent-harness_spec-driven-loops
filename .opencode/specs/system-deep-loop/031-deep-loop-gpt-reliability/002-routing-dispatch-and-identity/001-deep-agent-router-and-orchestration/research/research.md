# Research: Deep-Agent Router & Orchestration Hardening for GPT-backed OpenCode (v2)

> **Synthesis of a 6-iteration deep-research loop** (3 coverage iterations answered KQ1–KQ10; 3 operator-directed deepening iterations produced concrete artifacts + stress-tests). Converged: coverage closed at iter 3 (`all_questions_answered`); deepening arc (iters 4–6) completed at the planned cap, trend 0.95→0.75→0.58→0.55→0.52→0.46. Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration`. Iteration evidence: `iterations/iteration-001.md` … `iteration-006.md`.

---

## 0. CRITICAL INTEGRITY CAVEAT — READ FIRST

The research-prompt (§2, §4) and `spec.md` cite a prior research synthesis as the confirmed evidence base:
- `030-agent-loops-improved/010-gpt-deep-agent-routing/research/research.md` ("10-iteration synthesis with mis-route taxonomy and fix ranking")
- `../001-gpt-deep-agent-routing/research/research.md` (`spec.md` `predecessor_research`)
- sibling `../002-gpt-routing-fixes` (the validator phase)

**None exist on disk.** `030` has no `010-*` child; `031`'s only child is this packet. Grep across `deep-loops/` returns the mis-route terms only inside *this packet's own files* (which assert them).

**Consequence:** the mis-route taxonomy (modes A/B/C), the FIX-1…FIX-5 ranking, and the "soft identity boundary" root cause are **operator-asserted axioms** (fully stated in research-prompt §2), not cross-validated findings. KQ8's FIX-5 criterion (§5) is deliberately defined as an *observable* trigger against real dispatch behavior so it does not depend on the missing synthesis. **Recommendation:** before implementation, recover the prior research or re-run a focused mis-route-confirmation pass so the axiom chain has an evidence floor.

---

## 1. DEEP PRIMARY AGENT DESIGN (KQ1, KQ2, KQ6)

### Form factor: BOTH (agent file + mode-registry) — INFERRED from CONFIRMED dispatch model

> **CONFIRMED — `subagent_type` is normalized to `"general"` for every custom-agent dispatch; specialized identity is prompt-injected by loading the agent-definition file, not carried by the dispatch type.** [`orchestrate.md:97`, `:159`, `:162`, `:170`, `:174`]

Because the host runtime does **not** support a per-agent specialized `subagent_type` today (sampled frontmatter declares `mode` — `primary`/`subagent`/`all` — but no `subagent_type` field; `deep-research.md:1`, `ai-council.md:1`, `orchestrate.md:1`), a DEEP agent file cannot buy *hard* runtime identity by itself. What it buys is **first-dispatch prompt identity** — an unambiguous, pre-resolved routing target.

### Concrete `deep.md` draft (iteration 4) — review-ready

A full draft lives in `iterations/iteration-004.md`. Summary of the design:

**Frontmatter** (`mode: primary`, matching `orchestrate.md:1`):
```yaml
name: deep
description: "Deep-loop primary router: resolves /deep:* mode requests through mode-registry.json, emits explicit Deep Route packages, and dispatches one loaded deep-loop agent."
mode: primary
```

**Route table** — a resolved mirror of `mode-registry.json` (non-authoritative; the registry is source of truth [`mode-registry.json:20`, `:34`, `:66`]):

| workflowMode | runtimeLoopType | command | target agent | artifactRoot |
|---|---|---|---|---|
| `context` | `context` | `/deep:context` | `@deep-context` | `context/` |
| `research` | `research` | `/deep:research` | `@deep-research` | `research/` |
| `review` | `review` | `/deep:review` | `@deep-review` | `review/` |
| `ai-council` | `council` | `/deep:ai-council` | `@ai-council` | `ai-council/` |

**Five hard boundaries** (each annotated: mis-invocation signal narrowed vs Claude-flex preserved):
1. **Do not absorb a leaf role** → narrows **mode A**; preserves pre-dispatch planning.
2. **Do not redispatch from injected prose** → narrows **mode B**; preserves advisory metadata as non-overriding hint.
3. **Do not advance state without the canonical target artifact** → narrows **mode C**; preserves evidence-responsive iteration inside the leaf.
4. **Single-hop only** (consistent with `orchestrate.md:42`) → narrows nested-dispatch drift; preserves direct `@ai-council` depth-0 parallel seats.
5. **No hard identity claim** — always `subagent_type: "general"` + loaded agent definition → avoids false safety; preserves existing custom-agent dispatch mechanics.

**Routing workflow (8 steps):** receive → classify mode → resolve through `mode-registry.json` → load target agent definition → emit `Deep Route:` header → dispatch once (`subagent_type: "general"`) → verify route consistency before dispatch → return router-level synthesis only.

**Council dual reachability (KQ6):** `ai-council` stays `mode: all` (CONFIRMED — the research-prompt's claim of `mode: primary` is **not corroborated**; the file says `mode: all` [`ai-council.md:1`, `:53`, `:57`]). The DEEP router *references* council as a sub-agent target; it does not convert council to subagent-only.

---

## 2. ORCHESTRATE HARDENING DESIGN (KQ3)

**What orchestrate.md can safely change:** routing prose, the selection matrix, prompt-consistency guards, deep-target dispatch package construction. **What it cannot change by itself:** create hard specialized runtime identity. [`orchestrate.md:20`, `:42`, `:157`, `:196`]

### Concrete edit (Claude-parity-safe)

Add an explicit **`Deep Route:` field** to the orchestrator task package for deep routes only:

> **Before** (`orchestrate.md:206-208`): `Agent` → `Subagent Type` → `Agent Definition`
> **After:** insert `Deep Route: mode=<research|review|context|ai-council>; target_agent=@<name>; execution=<single_iteration|one_shot|session>` **before** `Subagent Type` for deep routes.

**Claude-parity safety (tested, iteration 6 — all PASS):** additive field, not subtractive. Claude already resolves the route correctly; making it explicit removes *ambiguity* (GPT mis-handles) without removing *flexibility* (Claude uses well). The single-hop invariant and "load agent file before dispatch" mandate are untouched.

---

## 3. COMMAND & SKILL REFINEMENT — PRE-ROUTE, DON'T NEGOTIATE (KQ4, KQ5)

### Latency root-cause (KQ4) — CONFIRMED: role-resolution overhead, not prompt size

| Surface | Size | Evidence |
|---|---|---|
| Rendered iteration prompt pack | ~66 lines / ~1.6k tok | `prompt_pack_iteration.md.tmpl:1` |
| `@deep-research` agent instructions | 587 lines / ~8.4k tok | `deep-research.md:27` |
| Full `deep_research_auto.yaml` | 1,510 lines / ~23.3k tok | **not** injected into leaf — native sends `context_source: "rendered_prompt_pack"` (`:825`, `:853-856`) |

Two seams drive the cost: (1) native dispatch names the agent but backs it with `subagent_type: "general"` [`orchestrate.md:162`, `deep_research_auto.yaml:853-856`]; (2) CLI OpenCode has no agent flag — `opencode run … "$(cat prompt)"` passes a positional message [`deep_research_auto.yaml:916-925`]. State-read overhead is bounded/secondary (`:477`).

> **Caveat (inferred):** no GPT-vs-Claude wall-clock logs exist in the file set; mechanism is evidence-backed, magnitude inferred. KQ10 (§7) is the measurement path.

### Pre-route edits — ALL 4 DEEP MODES (iteration 5)

Add a `Resolved route:` header at each mode's prompt/CLI seam. Research/review share a template+CLI pattern; context uses inline per-seat contracts (no standalone template); council uses the round prompt pack + script-owned dispatch (no YAML-level `if_cli_opencode` branch).

| Mode | `Resolved route` header | Edit location (file:line) |
|---|---|---|
| **research** | `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true` | Template `deep-research/assets/prompt_pack_iteration.md.tmpl:1-5` (insert after line 1); CLI `deep_research_auto.yaml:916-925` (prepend before `$(cat prompt)`); preserve native `agent: deep-research` `:853-856` |
| **review** | `mode=review; target_agent=@deep-review; execution=single_review_iteration; …` | Template `deep-review/assets/prompt_pack_iteration.md.tmpl:1-5`; CLI `deep_review_auto.yaml:895-905`; preserve native `agent: deep-review` `:803-806` |
| **context** | `mode=context; target_agent=@deep-context; execution=parallel_read_only_sweep; seat_label={seat.label}; do_not_run_full_loop=true` | No standalone template — inline seat prompt `deep_context_auto.yaml:379-386` + CLI one-shot contract `:442-456`; preserve native `agent: deep-context` `:416-420` |
| **ai-council** | `mode=ai-council; target_agent=@ai-council; execution=multi_topic_session_round; state_source=ai-council/session-state.jsonl; depth_aware=true; do_not_switch_mode=true` | Round prompt `deep-ai-council/assets/prompt_pack_round.md:14-29` (insert before `## Role`); pass route fields through `executor_config_json` — council has executor CLI input (`deep_ai-council_auto.yaml:24-26`) but dispatch is script-owned via `orchestrate-session.cjs:117-119`, **no YAML-level `if_cli_opencode` branch** |

These are additive headers preserving the existing prompt-pack body (the cues Claude uses well) while removing the inference burden GPT mishandles.

---

## 4. AI-COUNCIL DUAL REACHABILITY (KQ6) — resolved in §1

Council stays `mode: all`, referenced (not absorbed) by the DEEP router. **Correction on record:** the research-prompt's `mode: primary` assertion is contradicted by the file (`mode: all`).

---

## 5. FIX-5 DECISION CRITERION (KQ8) — with the critical false-negative (iteration 5)

### The trigger

> **Run one GPT-backed `cli-opencode` first dispatch per deep mode after the §2/§3 edits land. If, for any mode, the dispatch fails the existing mode-local validation while the same packet passes under native/Claude baseline, FIX-5 is mandatory.**

Failure signals (all already emitted by the workflow — `deep_research_auto.yaml:940-968`): no canonical `type:"iteration"` record / `jsonl_wrong_type`; missing iteration artifact or delta file / `delta_file_missing_iteration_record`; `dispatch_failure_logged` / `executor_missing`.

### ⚠ The false-negative (most important FIX-5 finding)

**A GPT mis-dispatch can PASS every signal above if it writes schema-correct artifacts in the expected paths while doing semantically wrong-mode work.** The validators check existence/schema/provenance — NOT that `@deep-research` was actually loaded, that the resolved route was obeyed, or that the content matches the requested mode. [`deep_research_auto.yaml:940-968`; iteration-005.md finding 5]

**Therefore a post-edit "pass" is necessary but NOT sufficient** to disprove mis-dispatch. Two implications:
1. **Add route-proof fields to validation** before treating a GPT pass as decisive: assert `mode`, `target_agent`, `agent_definition_loaded`, and a prompt-echoed `Resolved route` field in the state/delta record. This is packet-local and PR-sized.
2. **FIX-5 (or the upstream hard-identity change, §8b) remains needed** if GPT produces route-mismatched but schema-valid artifacts even after route-proof validation lands.

---

## 6. CLAUDE-FLEXIBILITY PRESERVATION (KQ9) — per-edit test (iteration 6): ALL PASS

Three CONFIRMED flex targets to preserve [`orchestrate.md:53,58,60,319,325`; `deep-research.md:142-194`; `ai-council.md:55-58`]: **(1) planning** (dynamic pre-dispatch decomposition), **(2) evidence-response** (deep agents adapt focus/actions to evidence), **(3) advisory-metadata** (advisory headers + council depth behavior stay non-brittle).

| Proposed edit | Planning | Evidence-response | Advisory-metadata | Verdict |
|---|---|---|---|---|
| `deep.md` route table + hard boundaries + single-hop | PASS (classification happens before dispatch) | PASS (leaf keeps evidence-response) | PASS (advisor non-overriding; council depth preserved) | **PASS** |
| `Resolved route` header (all 4 modes) | PASS (removes mode inference after setup) | PASS (full prompt packs retained) | PASS (council `depth_aware=true`) | **PASS** |
| `Deep Route:` field in orchestrate.md | PASS (added after decomposition, before dispatch) | PASS (doesn't alter leaf instructions) | PASS (loaded def stays authoritative) | **PASS** |
| CLI dispatch prepend | Neutral (native Claude unaffected) / PASS (GPT CLI bound) | PASS (prompt body intact) | PASS (follows cli-opencode constraints) | **PASS** |

**No edit constrains a legitimate Claude flexibility.** Each narrows a mis-invocation signal (modes A/B/C) or is neutral. Full per-edit criteria in `iterations/iteration-006.md`.

---

## 7. VERIFICATION APPROACH (KQ10) — CONFIRMED: existing provenance suffices (+ route-proof gap)

No new benchmark tooling required. The workflow emits: `deep-research-state.jsonl` canonical records (`:940-953`); iteration/delta artifacts + `post_dispatch_validate` (`:940-968`); `observability-events.jsonl` envelopes (`observability-events.cjs:100`); executor provenance/audit (`executor-audit.ts:557,562,572,608,637`).

**Minimal before/after test:** per deep mode, snapshot pre-run state-log count, execute one GPT-backed first dispatch on a tiny packet, inspect only existing outputs (one new canonical iteration record of the *requested* mode, expected artifact/delta paths, no `dispatch_failure`, executor provenance). Baseline identical packet under native/Claude.

**⚠ Augment with route-proof assertions** (per §5 false-negative): also check the iteration/delta record carries `mode`/`target_agent`/`agent_definition_loaded`/echoed `Resolved route` matching the requested mode. Without this, the test cannot catch schema-valid wrong-mode dispatch.

---

## 8. CROSS-RUNTIME PARITY (KQ7)

- **OpenCode ↔ Claude mirrors exist** (matching deep-agent names, different frontmatter formats).
- **Codex mirror absent** (`.codex/agents` not found; zero `**/agents/*.toml`). **Mirror docs inconsistent:** `agents/README.txt:8` says `.codex/agents/` (TOML); `deep-loop-runtime/SKILL.md:253-261` names `.opencode/agents/<name>.toml`.
- **Drift breaks:** missing mirrors silently drop native seats (`deep-loop-runtime/SKILL.md:255,261`).
- **Action:** mirror DEEP + orchestrate edits across `.opencode/agents/` + `.claude/agents/`; resolve the Codex/TOML-location contradiction before claiming REQ-006 parity.

---

## 8b. HOST-RUNTIME HARD-IDENTITY SPEC (KQ2 deepened, iteration 6) — architectural follow-up, NOT this phase

The minimal hard-identity change is a **dispatch-primitive change**, not frontmatter-only or config-only. CONFIRMED the workspace exposes only contract surfaces, not host internals [`opencode.json:2`, `agents/README.txt:4`, `cli-opencode/SKILL.md:390`].

- **What concretely changes:** add a first-class `agent`/`agent_slug`/`subagent_identity` field at the Task/command dispatch boundary that the runtime resolves against `.opencode/agents/<slug>.md` — it must reject unknown slugs, auto-load/enforce the definition, bind permissions/model/system prompt, expose bound identity in provenance, and prevent contradictory prompt text from overriding it. A frontmatter field alone is useless without runtime enforcement [`orchestrate.md:170,174`; `cli-opencode/SKILL.md:281,291`].
- **Minimal (4 deep agents only):** teach the YAML `dispatch.agent` field (`deep_research_auto.yaml:854`, `deep_review_auto.yaml:804`, `deep_context_auto.yaml:417`) to become hard identity + stamp `{mode,target_agent,agent_definition_loaded}` into state/delta/provenance. Leave generic Task custom agents on `subagent_type:"general"`.
- **Complete:** unify primary/subagent/command-owned agents under one resolver; `--agent` and Task dispatch share validation; every session records bound `agent_slug`; mismatched `Agent:`/`Agent Definition:`/prompt route fails closed.
- **Blast radius:** crosses runtime, CLI, command-owned loops, mirror contracts, and existing orchestrator assumptions. **Architectural, not PR-sized.**
- **Recommendation:** **do NOT attempt in this phase.** Implement route-proof headers + validator fields now (§3, §5); keep hard identity as the **FIX-5-alternative / upstream follow-up**, escalated if GPT still produces route-mismatched schema-valid artifacts after route-proof validation.

---

## 9. EXPLICIT DEFERRALS & RESIDUAL RISK

| Item | Status | Residual risk |
|---|---|---|
| Host-runtime per-agent hard identity (`subagent_type` specialization) | Deferred — architectural, upstream (§8b) | Agent-layer fix remains prompt-contract hardening. Escalate per §5 if route-proof validation still leaks. |
| FIX-5 (native→CLI subprocess, process isolation) | Documented follow-up; trigger in §5 | If §5 trigger fires (incl. the schema-valid-wrong-mode false-negative after route-proof fields land), FIX-5 or §8b becomes mandatory. |
| Validator hardening (`../002-gpt-routing-fixes`) | Cited phase does not exist on disk | Detection backstop unverified; no confirmed detection companion to this prevention work. |
| Prior research evidence base (`030/010-…`, `../001-…`) | Missing (§0) | Mis-route taxonomy A/B/C + FIX-ranking are operator-asserted axioms, not cross-validated. |
| Codex runtime parity | Mirror absent + docs inconsistent (§8) | REQ-006 unsatisfied until TOML-location contradiction resolved. |
| GPT-vs-Claude wall-clock latency | Not measured (no logs) | §3.1 latency root-cause is mechanism-level; KQ10 before/after is the measurement path. |
| Route-proof validator fields | **Recommended for THIS phase** (closes §5 false-negative) | Without them, a GPT "pass" does not prove correct first-dispatch. |
| `convergence.cjs` graph convergence | Errored (better-sqlite3 `NODE_MODULE_VERSION` 141 vs 127) | Convergence decided by coverage + deepening-arc rules, independent of graph; future runs need `npm rebuild` in `deep-loop-runtime`. |

---

## RECOMMENDED IMPLEMENTATION ORDER (for `/speckit:plan`)

1. **Route-proof validator fields** (packet-local, PR-sized, closes the §5 false-negative) — assert `mode`/`target_agent`/`agent_definition_loaded`/echoed `Resolved route` in iteration/delta records.
2. **`deep.md`** (land the iteration-4 draft) + `.claude/agents/deep.md` mirror.
3. **Pre-route `Resolved route` headers** across all 4 modes (§3 table).
4. **`Deep Route:` field** in `orchestrate.md` (+ `.claude` mirror).
5. **GPT before/after smoke** (KQ10) per mode, with route-proof assertions — this is the acceptance gate.
6. **If §5 trigger fires** → escalate to FIX-5 or §8b host hard-identity (architectural follow-up).

---

## CONVERGENCE REPORT

- **Stop reason:** coverage closed at iter 3 (`all_questions_answered`); deepening arc (iters 4–6) completed at planned cap.
- **Iterations completed:** 6 of 8.
- **Questions answered:** 10/10 (KQ1–KQ10) + 6 deepened.
- **newInfoRatio trend:** 0.95 → 0.75 → 0.58 (coverage) │ 0.55 → 0.52 → 0.46 (deepening).
- **Deepening arc deliverables:** concrete `deep.md` draft (iter 4); FIX-5 false-negative + 4-mode pre-route edits (iter 5); host-runtime spec + all-PASS flex test (iter 6).
- **Graph convergence:** unavailable (env error, non-blocking — §9).

---

## REFERENCES (key citations)

- `.opencode/agents/orchestrate.md` — `:20,42,53,58,60,97,157,159,162,164,170,174,196-208,247,319,325,832`
- `.opencode/agents/{deep-research,deep-review,deep-context,ai-council,CONTEXT}.md` — frontmatter `mode`; `deep-research.md:27,142-194`; `ai-council.md:1,53-58`
- `.opencode/agents/README.txt:4-8`; `opencode.json:2,10`
- `.opencode/commands/deep/research.md:13,79,151`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:81,477,825,853-856,916-925,940-968`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:71,774,803-806,895-905`
- `.opencode/commands/deep/assets/deep_context_auto.yaml:83,98,379-386,416-420,442-456`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:24-26,116-119`
- `.opencode/skills/deep-loop-workflows/{SKILL.md,mode-registry.json:20-66,README.md:58}`
- `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:1-67`
- `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:1-5`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/prompt_pack_round.md:14-29`
- `.opencode/skills/deep-loop-runtime/SKILL.md:253-261`; `lib/deep-loop/{executor-audit.ts:557-637,observability-events.cjs:100}`
- `.opencode/skills/cli-opencode/SKILL.md:261,281,285,291,294,320,390`
- `.claude/agents/{orchestrate,deep-research,ai-council}.md`

---

*v2 synthesis by the deep-research loop orchestrator (`@general`) from six fresh-context `@deep-research` LEAF iterations (3 coverage + 3 deepening). Iteration narratives in `iterations/`; structured deltas in `deltas/`; state log in `deep-research-state.jsonl`. Concrete `deep.md` draft in `iterations/iteration-004.md`.*
