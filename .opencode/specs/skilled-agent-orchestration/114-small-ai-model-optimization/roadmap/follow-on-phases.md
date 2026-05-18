# Follow-on Roadmap — Phased Plan for 114 Implementation

> **Status**: Plan only. Phase packets 002-006 created 2026-05-18; Phase 007 deleted same day per user direction. No implementation yet.
> **Source**: Distilled from `001-research-smallcode/research/research.md` (1204 lines) §Execution Playbook, §Infrastructure Prerequisites, and §Final Recommendation.
> **Total estimated effort**: ~78 hours of focused skill-authoring + small TS/JSON additions (down from ~95 hr after the 2026-05-18 small-only-scope bloat-removal pass + Phase F deletion). Free-tier dispatchable; no Pro quota burn required for any phase if cli-devin SWE-1.6 is used as the implementer.

> **Scope confirmation (2026-05-18)**: User's actual model rotation is small-only — SWE-1.6 (Cognition free), DeepSeek-v4-pro + Kimi-k2.6 + Qwen3.6 (share Cognition Pro pool), optional future Claude Haiku + Gemini Flash. Frontier models (Opus, Sonnet, gpt-5.5, GLM-5.1) dropped from scope. Phase D rescoped from small→frontier escalation to quota-pool-aware fallback (fail-fast if no separate-pool target available). Phase A trigger phrases name the actual models. Phase C per-model-budgets.json slimmed to 4 required + 2 optional stubs.

---

## How to read this

Each phase below names: the packets in it, why it ships when it does, what it depends on, what success looks like, and how big it is. Packets within a phase can ship in parallel unless an internal dependency is noted. Phases must ship in order — A before B, B before C, etc. — with the noted exceptions.

Packet IDs (`xxx-name`) are placeholders for spec-folder names that will be created when the packet is actually planned. They sit under `.opencode/specs/skilled-agent-orchestration/`. Numbering may shift as work happens.

---

## Phase A — Foundation (routing + sentinel skill)

**Why first**: Nothing else routes correctly until the skill-advisor knows where to look. Without this, every new `references/` file we add downstream is invisible to operators who haven't memorized the file paths.

**Packets in this phase**:

1. **`xxx-sk-small-model-sentinel`** — Create a new thin skill at `.opencode/skills/sk-small-model/`. Holds:
   - `SKILL.md` with a 1-paragraph philosophy and an index pointing at the real pattern locations in `cli-devin/references/` and `cli-opencode/references/`
   - `graph-metadata.json` with `enhances` edges (weight ~0.5) pointing to `cli-devin` and `cli-opencode`, plus 10–15 trigger phrases like "small model", "swe-1.6", "context budget", "verification pipeline", "permissions matrix"
   - `description.json` for memory indexing
   - A short `references/pattern-index.md` cataloging where each pattern lives across the system
   - Effort: ~4 hours
   - Risk: low (new skill, no existing code touched)

2. **`xxx-routing-wiring`** — Edit existing files only:
   - `AGENTS.md`: add a "Small-model dispatch rule" as a sibling to the existing CLI dispatch rule (§1 line 39)
   - `cli-devin/graph-metadata.json`: add `enhances` edge pointing to `sk-small-model`
   - `cli-opencode/graph-metadata.json`: same
   - `sk-prompt/graph-metadata.json`: optional `enhances` to `sk-small-model` if budget guidance lands later (Phase E)
   - `sk-code/graph-metadata.json`: optional `enhances` if you want sk-code to flag small-model concerns during code review
   - Trigger `skill-advisor` re-index after edits
   - Effort: ~2 hours
   - Risk: low (metadata-only changes; routing tested by simulating prompts)

**Dependencies**: None. Foundation phase.

**Success criteria**:
- Skill-advisor recommends `sk-small-model` (score ≥ 0.8) on prompts containing any of the trigger phrases
- Calling `cli-devin --model swe-1.6` surfaces both `cli-devin` and `sk-small-model` in the advisor brief
- `AGENTS.md` shows the new rule, no existing rule disrupted

**Total Phase A effort**: ~6 hours.

---

## Phase B — Safety (RM-8 prevention via structured permissions)

**Why next**: Highest blast-radius prevention. The current four-layer prose mitigation in `cli-opencode` works but is fragile — every `--dangerously-skip-permissions` dispatch is a roll of the dice. A structured permission gate makes scope violations impossible at the runtime layer, not just discouraged in the prompt.

**Packets in this phase**:

3. **`xxx-cli-opencode-permissions-matrix`** — Add to `cli-opencode`:
   - New schema file: `cli-opencode/assets/permissions-matrix.schema.json` defining the {file_glob, operation_class, scope, allow|deny, rationale} contract
   - Example matrix entries: read-only-corpus pattern, packet-local-write pattern, repo-wide-write pattern
   - New reference doc: `cli-opencode/references/permissions-matrix.md` explaining the schema, the runtime enforcement model (pre-tool-call gate), and the migration path from the four-layer prose
   - Validator addition: small TS function that checks each tool call against the active matrix entries before dispatch (likely in `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` or a sibling pre-dispatch validator)
   - Update `cli-opencode/SKILL.md` ALWAYS #13 to reference the matrix as the preferred pattern, with the four-layer prose marked deprecated-but-supported during transition
   - Effort: ~12 hours
   - Risk: medium — schema design matters; an overly-broad wildcard defeats the point. CI lint required.

**Dependencies**: Phase A (so the advisor surfaces `sk-small-model` → `cli-opencode` → the new permissions doc on small-model dispatch).

**Success criteria**:
- The RM-8 incident replay: feed `cli-opencode` the exact prompt from 2026-05-04 with the matrix active; confirm all 44 file deletions are blocked at the runtime gate
- Schema validator rejects matrices with `**` globs unless explicitly allowlisted
- Existing `cli-opencode` dispatches with no matrix configured still work (backward compat)

**Total Phase B effort**: ~12 hours.

---

## Phase C — Quality (cli-devin SWE-1.6 optimization)

**Why next**: Day-to-day quality lift on the model used in the highest volume. The verification pipeline catches hallucinated code before it ships; the context budget engine ensures SWE-1.6's small window isn't wasted on stale context.

**Packets in this phase**:

4. **`xxx-cli-devin-context-budget`** — Add to `cli-devin`:
   - New reference doc: `cli-devin/references/context-budget.md` with smallcode-derived patterns (percentage budget, fit-to-budget truncation with `[... N tokens cut]` markers, priority eviction)
   - New asset: `cli-devin/assets/per-model-budgets.json` with token defaults for SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1 (and a stub for Opus/Sonnet/gpt-5.5)
   - Update `cli-devin/assets/prompt_templates.md` to inject the truncation marker syntax into copy-paste templates
   - Update `cli-devin/SKILL.md` §3 Model Selection table to cross-reference the new budget asset
   - Effort: ~6 hours
   - Risk: low (additive; nothing replaced)

5. **`xxx-cli-devin-output-verification`** — Add to `cli-devin`:
   - New reference doc: `cli-devin/references/output-verification.md` describing the compile → execute → smoke-test → lint pipeline adapted for our agent-config recipe system
   - Update `cli-devin/assets/agent-config-deep-research-iter.json` (and `agent-config-deep-review-iter.json`, `agent-config-synthesis.json`) `system_instructions` to include a verification block: "after producing output, attempt to compile/run/test the result; if failure, retry with errors fed back, max 2 retries"
   - New asset: `cli-devin/assets/confidence-scoring-rubric.md` with the smallcode-derived formula adapted for research-output scoring (structural pass, citation accuracy, recommendation actionability, etc.)
   - Hard-fail template: literal refused-delivery message cli-devin returns when verification fails
   - Effort: ~10 hours
   - Risk: medium — over-aggressive verification could cause iters to fail more often than they should; needs threshold tuning

6. **`xxx-cli-devin-verification-pipeline`** — Sibling to #5, focused on the orchestrator side:
   - Extend `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` with optional verification-pass step that reads the new confidence rubric and gates iter acceptance
   - Add `agent-config-recipes.md` documentation explaining when to enable the verification gate
   - Effort: ~12 hours
   - Risk: medium — touches existing validator code; needs careful testing

**Dependencies**: Phase A.

**Success criteria**:
- A test iter dispatched with the budget engine active shows the truncation marker in tool results when context exceeds 70% of SWE-1.6's window
- A test iter where SWE-1.6 hallucinates a compile error gets caught by the verification pipeline and is marked degraded in JSONL
- Existing deep-research and deep-review packets still pass with verification OFF by default

**Total Phase C effort**: ~28 hours.

---

## Phase D — Shared model intelligence

**Why next**: Powerful patterns but only worthwhile once at least one CLI skill is consuming them. The model-profile registry is a shared asset that several skills will read; bayesian tool scoring lives inside cli-* agent-config recipes; the escalation engine ties them together.

**Packets in this phase**:

7. **`xxx-sk-prompt-model-profiles`** — Add the shared registry:
   - New asset: `sk-prompt/assets/model-profiles.json` covering SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Opus, Sonnet. Fields: id, provider, context_length, tool_calling_support, chat_template, strengths, weaknesses, free_tier, pro_tier, escalation_target, average_iter_wall_clock_min
   - Reference doc explaining the schema and how to update it when a new model launches
   - Update `sk-prompt/assets/cli_prompt_quality_card.md` to point at the new registry as the source-of-truth for per-model defaults
   - Update each cli-* SKILL.md §3 Model Selection table to defer to `sk-prompt/assets/model-profiles.json`
   - Effort: ~8 hours
   - Risk: low (additive)

8. **`xxx-cli-devin-tool-scoring`** — Bayesian per-task scoring in cli-devin agent-config recipes:
   - Update `cli-devin/assets/agent-config-deep-research-iter.json` `system_instructions` to track tool success/failure per iter and demote tools at >50% failure
   - New asset: `cli-devin/assets/tool-scorer-state.json` (per-packet, written by the iter agent) tracking score history
   - Effort: ~8 hours
   - Risk: medium — scoring state needs to survive across iters but stay packet-scoped

9. **`xxx-cli-devin-escalation-engine`** — Local→cloud fallback:
   - New reference doc: `cli-devin/references/escalation.md` describing the decision matrix (when_to_downgrade, when_to_escalate, quota_aware)
   - Update agent-config recipes to read `model-profiles.json` (from #7) and pick the next-tier model on hard-fail
   - Pro-quota awareness rule: if SWE-1.6 free tier exhausted, escalate to gpt-5.5 NOT DeepSeek (because gpt-5.5 has separate quota; DeepSeek shares the same Pro pool that just got exhausted)
   - Effort: ~10 hours
   - Risk: high — escalation logic across providers is brittle; needs strict testing of every {failed_model, escalation_target} pair

**Dependencies**: Phase A + at least one cli-devin packet from Phase C shipped (so escalation has a verification signal to trigger on).

**Success criteria**:
- A simulated SWE-1.6 free-tier exhaustion event triggers escalation to gpt-5.5, not DeepSeek
- A consistently-failing tool (>50% on 3+ calls in one iter) gets demoted in the next iter's tool list
- All 8 model entries in `model-profiles.json` validate against the schema

**Total Phase D effort**: ~26 hours.

---

## Phase E — Cross-skill propagation (lower priority)

**Why later**: These patterns extend small-model awareness to skills that aren't the primary dispatch surface. Lower urgency; some may be dropped if the team finds the existing distribution sufficient.

**Packets in this phase**:

10. **`xxx-cli-opencode-eviction`** — Port the budget-engine eviction pattern from cli-devin (Phase C #4) to cli-opencode for its larger-context models:
    - New reference doc: `cli-opencode/references/context-budget.md`
    - Update cli-opencode agent-config recipes to use the truncation marker syntax
    - Effort: ~4 hours

11. **`xxx-sk-prompt-budget-awareness`** — Add a "budget awareness" subsection to `sk-prompt/assets/cli_prompt_quality_card.md` mirroring the Composition Guidance pattern already present:
    - One paragraph on token-budget awareness
    - One paragraph on truncation marker recognition
    - Effort: ~2 hours

12. **`xxx-cli-opencode-two-stage-routing`** — OPTIONAL — port smallcode's 2-stage tool routing pattern to cli-opencode:
    - New reference doc: `cli-opencode/references/two-stage-routing.md`
    - Note: research iter 11 verdict-confirmed this overlaps with mcp-code-mode; consider whether to ship at all
    - Effort: ~6 hours; defer until P0-P3 are shipped
    - **Recommendation: drop unless mcp-code-mode is being rewritten anyway**

**Dependencies**: Phase C must be shipped (so the patterns being propagated exist).

**Success criteria**:
- `cli-opencode` dispatches show truncation markers in tool results when budget is exceeded
- `sk-prompt` cli_prompt_quality_card.md surfaces budget guidance in the framework table

**Total Phase E effort**: ~12 hours (drops to ~6 if #12 is skipped).

---

> **Phase F — Hardening (deleted 2026-05-18 per user direction)**. Originally planned CI checks for sentinel pattern-index staleness + permissions-matrix over-broad-glob lint. Now handled via PR review during 003-006 merges. May be revisited as a future packet if manual review proves insufficient.

---

## Phase ordering summary

```
A (foundation) → B (safety) → C (cli-devin quality) → D (shared intelligence) → E (cross-skill)
                       ↓                  ↑
                       └──────────────────┘
                       B and C can run in parallel after A
```

| Phase | Packets | Effort | Cumulative |
|-------|---------|--------|------------|
| A — Foundation | 2 | 6 hr | 6 hr |
| B — Safety | 1 | 12 hr | 18 hr |
| C — Quality | 3 | 25 hr | 43 hr |
| D — Shared intelligence | 3 | 20 hr | 63 hr |
| E — Cross-skill | 3 (1 optional) | 12 hr (or 6) | 75 hr (or 69) |
| ~~F — Hardening~~ | — | — | — (deleted 2026-05-18) |
| **Total** | **12 packets (11 if #12 dropped)** | **~75–78 hr** (was ~90–95 before bloat + Phase F removal) | |

---

## Hard rules across all phases

- **No new patterns invented**: every artifact must trace to a citation in `001-research-smallcode/research/research.md` § per-RQ deltas
- **Sentinel skill stays thin**: if Phase A starts growing real content, that's a violation — patterns belong in cli-devin/cli-opencode, not the sentinel
- **Backward compat**: every change must allow existing dispatches that don't opt-in to the new feature to keep working
- **Free-tier first**: implementer should use cli-devin SWE-1.6 where possible to avoid burning Pro quota during follow-on packet authoring
- **One packet, one Spec Kit folder**: each packet gets its own spec.md/plan.md/tasks.md/checklist.md/decision-record.md (or implementation-summary if Level 1)
- **No cross-packet edits in a single PR**: scope-creep is the failure mode

---

## What's NOT in this plan

- Per-packet sub-plans (spec.md content, ADRs, checklist items) — those happen when each packet is created
- Branching strategy / git workflow — assume normal main-branch flow per existing memory rules
- User communication (announcement, release notes) — not researched here
- Rollback playbooks per packet — each packet will author its own
- Timeline / calendar — depends on operator availability; the 90-hour estimate is sequential focused work, not wall-clock

---

## Recommended first action

When ready to implement Phase A:
1. `/spec_kit:plan sk-small-model-sentinel skill creation` to create the first packet under `.opencode/specs/skilled-agent-orchestration/`
2. The plan-phase asks Gate-3 spec-folder choice — pick "New" under the skilled-agent-orchestration track
3. Author the SKILL.md, graph-metadata.json, and pattern-index.md per the Phase A description above
4. Strict-validate, commit, ship
5. Then in parallel: spawn `xxx-routing-wiring` packet for the AGENTS.md + per-skill graph-metadata edits

After Phase A merges, Phase B and Phase C can start in parallel (they don't share files).
