user
You are a senior code reviewer performing ONE iteration (iteration 1) of an autonomous deep-review loop over the remediated work in packet 122 (the deep-improvement skill's Lane C skill-benchmark, the deep-agent-improvement->deep-improvement rename, and three-lane docs). A prior review already fixed 4 P1 + 6 P2; THIS pass independently confirms the remediation held and looks for anything missed.
Repo root (your workdir): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

REVIEW ONLY THIS ITERATION'S DIMENSION. Be strictly READ-ONLY: inspect files; do NOT modify anything, just report. Be efficient: target 6 to 11 file reads, breadth over exhaustive depth.

THIS ITERATION'S FOCUS:
DIMENSION: three-lane consistency (confirm remediation). Verify .opencode/agents/deep-improvement.md, .claude/agents/deep-improvement.md, .gemini/agents/deep-improvement.md, feature_catalog/feature_catalog.md, and commands/deep/start-skill-benchmark-loop.md now consistently describe THREE lanes (agent-improvement, model-benchmark, skill-benchmark) and that D1-inter is labeled built-but-opt-in. Flag any residual two-lane / stale statement.

Rules:
- Cite EVERY finding with an exact repo-relative file path and line number. Re-read the cited line before recording a P0.
- Classify each finding: P0 (correctness/security/contradiction that breaks behavior), P1 (degraded/incomplete/missing validation), P2 (style/naming/docs/polish).
- Be skeptical and precise. Do NOT invent line numbers. If you cannot confirm an issue from the actual file, do not report it.
- A clean dimension is a valid result. Report zero findings rather than padding.

OUTPUT (exactly this structure):
## Focus
<one line: the dimension>
## Findings
<for each: severity, file:line, issue (1-2 sentences), one-line fix. If none: "No findings.">
## Verdict
<one line>
Then a line that is EXACTLY one of: Review verdict: PASS | Review verdict: CONDITIONAL | Review verdict: FAIL

Then, AFTER the verdict line, emit the machine block:
===FINDINGS_JSON===
[{"id":"f-p122-i1-01","severity":"P0|P1|P2","file":"relative/path","line":123,"issue":"...","fix":"..."}]
===END_FINDINGS===
(emit [] between the markers if there are no findings)
hook: SessionStart
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
Using the `deep-review` skill because this is an explicit autonomous review pass. I’ll keep this read-only and stay inside the requested three-lane consistency dimension.
mcp: mk-spec-memory/memory_match_triggers started
mcp: mk-spec-memory/memory_match_triggers (failed)
user cancelled MCP tool call
codex
The memory trigger call was cancelled, so I’m not going to lean on cached context. I’m reading the skill instructions and then the five requested files directly, with pattern checks for stale two-lane language.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: deep-review
description: "Autonomous iterative code-review loop with externalized state, convergence detection, P0/P1/P2 findings, fresh context per pass."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query]
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.10.2.0
---
<!-- Note: Task is for the command executor (loop management); @deep-review agent is LEAF-only (no Task). No WebFetch: review is code-only. -->

<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agents/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

Convergence threshold semantics and sibling-parity notes (deep-review 0.10 vs deep-research 0.05 vs deep-ai-council 0.20) live in `references/convergence/convergence.md` §1 under "Threshold Semantics and Sibling Parity".

## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code-review` instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code` or `/speckit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/deep:start-review-loop` command. The command's YAML workflow owns state, dispatch, and convergence.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize iterations (ad-hoc shell fan-out)
- Invoke cli-codex / cli-gemini / cli-claude-code directly in a loop to simulate iterations
- Manually write iteration prompts to `/tmp` and dispatch them via `copilot -p`
- Dispatch the `@deep-review` LEAF agent via the Task tool for iteration loops (the agent is LEAF, a single iteration, and MUST be driven by the command's workflow)
- Skip the state machine: `deep-review-state.jsonl`, `deep-review-config.json`, `deltas/`, `prompts/`, `logs/`
- Manage iteration state outside the resolved local review packet under `{spec_folder}/review/`

**COMMAND-DRIVEN FAN-OUT IS SUPPORTED:** use `--executor`/`--executors`/`--concurrency` flags on `/deep:start-review-loop`. The command's YAML `step_fanout_spawn` owns multi-lineage dispatch; `fanout-merge.cjs` applies strongest-restriction (any lineage active P0 → merged FAIL). This is not ad-hoc shell dispatch — it is the canonical fan-out path. Intra-lineage wave orchestration remains deferred.

**ALWAYS:**
- Invoke via `/deep:start-review-loop :auto` or `/deep:start-review-loop :confirm`
- Let the command's YAML workflow own dispatch (auto: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`)
- Let `scripts/reduce-state.cjs` be the SINGLE state writer
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'review')` from `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical review root

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/protocol/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards markdown paths, checks `inventory`, and uses `seen`.
- Pattern 3: Extensible Routing Key - `get_routing_key()` derives the review phase from dispatch context.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns review disambiguation and missing phases return a "no review resources" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/protocol/quick_reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "code audit", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local markdown assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/protocol/loop_protocol.md",
        "references/state/state_format.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
        "assets/deep_review_strategy.md",
    ],
    "REVIEW_ITERATION":   [
        "references/protocol/loop_protocol.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
        "references/state/state_outputs.md",
    ],
    "REVIEW_REPORT":      [
        "references/state/state_format.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
        "assets/deep_review_dashboard.md",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference", "resume deep review", "deep-review wave", "review artifact", "release-readiness audit", "convergence-tracked", "same session lineage", "P0"],
    "ON_DEMAND":         [
        "references/protocol/loop_protocol.md",
        "references/state/state_format.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence_signals.md",
        "references/state/state_outputs.md",
        "references/state/state_reducer_registry.md",
    ],
}

PHASE_RESOURCE_MAP = {
    "init": ["references/protocol/loop_protocol.md", "references/state/state_format.md", "references/state/state_outputs.md"],
    "iteration": ["references/protocol/loop_protocol.md", "references/convergence/convergence.md", "references/convergence/convergence_signals.md"],
    "stuck": ["references/convergence/convergence.md", "references/convergence/convergence_signals.md", "references/protocol/loop_protocol.md", "references/state/state_reducer_registry.md"],
    "synthesis": ["references/state/state_format.md", "references/state/state_outputs.md", "references/state/state_reducer_registry.md", "assets/deep_review_dashboard.md"],
}

NON_MARKDOWN_REFERENCES = {
    "review_contract": "assets/review_mode_contract.yaml",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the review target or spec folder",
    "Confirm the review phase",
    "Provide one concrete file, diff range, or expected finding class",
    "Confirm the verification command set before final review",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(dispatch_context) -> str:
    phase = str(getattr(dispatch_context, "phase", "")).strip().lower()
    if phase:
        return phase
    text = str(getattr(dispatch_context, "text", "")).lower()
    if "recovery" in text:
        return "stuck"
    if "convergence" in text or "synthesis" in text:
        return "synthesis"
    if "iteration" in text or "dimension" in text:
        return "iteration"
    return "init"

def route_review_resources(task, dispatch_context):
    inventory = discover_markdown_resources()
    routing_key = get_routing_key(dispatch_context)
    scores = score_intents(task, INTENT_SIGNALS, NOISY_SYNONYMS)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)


exec
/bin/zsh -lc 'rg -n "two lane|two-lane|2 lane|three lane|three-lane|agent-improvement|model-benchmark|skill-benchmark|D1-inter|D1 inter|built-but-opt-in|opt-in|Lane" .opencode/agents/deep-improvement.md .claude/agents/deep-improvement.md .gemini/agents/deep-improvement.md feature_catalog/feature_catalog.md commands/deep/start-skill-benchmark-loop.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: feature_catalog/feature_catalog.md: No such file or directory (os error 2)
rg: commands/deep/start-skill-benchmark-loop.md: No such file or directory (os error 2)
.claude/agents/deep-improvement.md:29:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.gemini/agents/deep-improvement.md:29:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.opencode/agents/deep-improvement.md:44:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.

codex
Two requested paths are not at repo root, so I’m locating their actual packet paths instead of assuming. The three runtime agent files already show the expected three-lane awareness language at first pass.
exec
/bin/zsh -lc "rg --files | rg '("'^|/)feature_catalog'"\\.md"'$|(''^|/)feature_catalog/feature_catalog'"\\.md"'$|(''^|/)start-skill-benchmark-loop'"\\.md"'$|commands/deep'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml
.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml
.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml
.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml
.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml
.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml
.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml
.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml
.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml
.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml
.opencode/commands/deep/start-model-benchmark-loop.md
.opencode/commands/deep/ask-ai-council.md
.opencode/commands/deep/start-research-loop.md
.opencode/commands/deep/start-review-loop.md
.opencode/commands/deep/start-skill-benchmark-loop.md
.opencode/commands/deep/start-agent-improvement-loop.md
.opencode/skills/deep-research/feature_catalog/feature_catalog.md
.opencode/skills/deep-review/feature_catalog/feature_catalog.md
.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md
.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md
.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md
.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md

exec
/bin/zsh -lc "find . -path '*/feature_catalog/feature_catalog.md' -o -path '*/commands/deep/start-skill-benchmark-loop.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2153ms:
./.opencode/specs/z_future/code-graph-and-cocoindex/backup/mcp-coco-index/feature_catalog/feature_catalog.md
./.opencode/specs/z_future/code-graph-and-cocoindex/backup/system-rerank-sidecar/feature_catalog/feature_catalog.md
./.opencode/commands/deep/start-skill-benchmark-loop.md
./.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
./.opencode/skills/deep-research/feature_catalog/feature_catalog.md
./.opencode/skills/deep-review/feature_catalog/feature_catalog.md
./.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md
./.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md
./.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md
./.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md

exec
/bin/zsh -lc 'wc -l .opencode/agents/deep-improvement.md .claude/agents/deep-improvement.md .gemini/agents/deep-improvement.md .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md .opencode/commands/deep/start-skill-benchmark-loop.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     249 .opencode/agents/deep-improvement.md
     234 .claude/agents/deep-improvement.md
     234 .gemini/agents/deep-improvement.md
     421 .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md
      43 .opencode/commands/deep/start-skill-benchmark-loop.md
    1181 total

exec
/bin/zsh -lc 'rg -n "two lane|two-lane|2 lane|only two|two co-equal|three lane|three-lane|three co-equal|agent-improvement|model-benchmark|skill-benchmark|D1-inter|D1 inter|built-but-opt-in|opt-in|deep-agent-improvement|deep-improvement" .opencode/agents/deep-improvement.md .claude/agents/deep-improvement.md .gemini/agents/deep-improvement.md .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md .opencode/commands/deep/start-skill-benchmark-loop.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/deep/start-skill-benchmark-loop.md:3:skill: deep-improvement
.opencode/commands/deep/start-skill-benchmark-loop.md:6:# /deep:start-skill-benchmark-loop
.opencode/commands/deep/start-skill-benchmark-loop.md:8:Lane C of the `deep-improvement` skill. Benchmarks whether a **skill** is well-structured, well-routed, efficient, and useful **in practice** — how AIs actually discover and use it — and emits a ranked Skill Benchmark Report with concrete, remediable findings. Distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior).
.opencode/commands/deep/start-skill-benchmark-loop.md:12:Read `.opencode/skills/deep-improvement/SKILL.md` and `references/skill-benchmark/operator_guide.md` before dispatch.
.opencode/commands/deep/start-skill-benchmark-loop.md:18:- **outputs dir** — where `skill-benchmark-report.{json,md}` are written.
.opencode/commands/deep/start-skill-benchmark-loop.md:19:- **fixtures dir** (optional) — defaults to `<skill>/assets/skill-benchmark/fixtures/<skill-id>/`.
.opencode/commands/deep/start-skill-benchmark-loop.md:25:node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
.opencode/commands/deep/start-skill-benchmark-loop.md:26:  --mode=skill-benchmark \
.opencode/commands/deep/start-skill-benchmark-loop.md:32:`--advisor-mode=python` enables the built-but-opt-in D1-inter advisor probe (deterministic in-repo SQLite advisor, scored out-of-band; off by default and in CI). The orchestrator (`scripts/skill-benchmark/run-skill-benchmark.cjs`) runs the D5 hard gate first, then per-scenario contamination-lint → router-replay → score, then writes the dual report.
.opencode/commands/deep/start-skill-benchmark-loop.md:36:- `skill-benchmark-report.json` — machine report (verdict, D1–D5, funnel, ranked bottlenecks, scenario rows).
.opencode/commands/deep/start-skill-benchmark-loop.md:37:- `skill-benchmark-report.md` — rendered FROM the JSON (anti-drift).
.opencode/commands/deep/start-skill-benchmark-loop.md:39:Lane C is **diagnostic by default** (no target-skill mutation). Findings hand off to Lane A (`/deep:start-agent-improvement-loop`) or a follow-up spec packet via the remediation taxonomy.
.opencode/commands/deep/start-skill-benchmark-loop.md:43:Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically. D1-inter (advisor selection) is also built and deterministic, but opt-in via `--advisor-mode=python` (off by default and in CI; scored out-of-band through the in-repo SQLite advisor). Only D4 (usefulness ablation) and the live in-situ trace (Mode B) remain follow-on per the 002 implementation playbook; they report as `unscored-mode-a` until built. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
.gemini/agents/deep-improvement.md:2:name: deep-improvement
.gemini/agents/deep-improvement.md:3:description: Proposal-only mutator for bounded deep-improvement candidate generation with evaluator-first rules
.gemini/agents/deep-improvement.md:9:Proposal-only mutator for bounded deep-improvement experiments. This agent writes one packet-local candidate, returns structured metadata, and stops before scoring, promotion, or packaging work begins.
.gemini/agents/deep-improvement.md:29:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.gemini/agents/deep-improvement.md:39:| `deep-improvement` | Improvement loop protocol | Always | Charter, control file, target-profile, evaluator, and promotion guidance |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:2:title: "deep-improvement: Feature Catalog"
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:3:description: "Unified reference combining the evaluation loop, integration scanning, scoring, model-benchmark mode, and skill-benchmark mode surfaces that currently ship in deep-improvement."
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:6:# deep-improvement: Feature Catalog
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:8:This document combines the current feature inventory for the `deep-improvement` system into a single reference. The root catalog acts as the system-level directory: it summarizes the evaluation loop, the integration scanner, the deterministic scoring stack, the model-benchmark mode, and the skill-benchmark mode, then points to the per-feature files that carry the deeper implementation and validation anchors.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:14:Use this catalog as the canonical inventory for the live `deep-improvement` feature surface. The numbered sections below group the skill by runtime responsibility so readers can move from a top-level summary into per-feature reference files without losing the current code and operator-contract context behind each claim.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:18:The skill runs three lanes through one agent. Each category and feature below is tagged with the lane it serves.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:22:| **Lane A** | Agent-improvement: evaluate and improve an agent markdown file via guarded promotion | `/deep:start-agent-improvement-loop`, `loop-host --mode=agent-improvement` |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:23:| **Lane B** | Model-benchmark: benchmark a model or prompt framework, no agent mutation | `/deep:start-model-benchmark-loop`, `loop-host --mode=model-benchmark` |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:24:| **Lane C** | Skill-benchmark: diagnose a skill's routing, discovery, efficiency, and usefulness, no skill mutation | `/deep:start-skill-benchmark-loop`, `loop-host --mode=skill-benchmark` |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:29:| Evaluation loop | 6 features | Lane A | `.opencode/commands/deep/start-agent-improvement-loop.md`, deep-improvement YAML workflows, `scripts/*.cjs` |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:30:| Integration scanning | 3 features | Lane A | `scan-integration.cjs`, `/deep:start-agent-improvement-loop`, `.opencode/agents/deep-improvement.md` |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:33:| Skill-benchmark mode | 6 features | Lane C | `loop-host.cjs --mode=skill-benchmark`, `scripts/skill-benchmark/*.cjs` |
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:39:**Lane:** Lane A (agent-improvement)
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:47:Sets up a fresh packet-local deep-improvement session before any candidate work begins.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:67:Candidate generation is delegated to the `deep-improvement` subagent. That agent must read the copied charter and manifest first, must write only under the packet-local runtime area, returns structured metadata, and stops before scoring, benchmarking, promotion, or mirror synchronization begins.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:141:**Lane:** Lane A (agent-improvement)
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:143:These entries describe how deep-improvement discovers the full agent surface across the repo, evaluates runtime mirrors, and wires command-driven orchestration through the deep-improvement command and YAML workflows.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:181:Owns the command-driven orchestration path that turns the deep-improvement skill into a runnable loop.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:185:The `/deep:start-agent-improvement-loop` command collects setup inputs, selects `:auto` or `:confirm` execution, and points the operator at the matching YAML workflow. The actual loop dispatch lives in the YAML assets, which rescan integration, dispatch `@deep-improvement`, emit journal events, and call score and reducer helpers, while the command markdown explicitly says not to dispatch agents from the command file itself.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:239:`score-candidate.cjs` always runs in `dynamic-5d` mode, regenerates the profile every run, allows optional weight overrides, and emits structured dimension details plus `candidate-acceptable` or `needs-improvement`. `run-benchmark.cjs` is also deterministic, but it still expects a profile JSON and fixture directory under `assets/agent-improvement/target-profiles`, so benchmark gating only becomes runnable when that profile-specific artifact set exists.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:255:`reduce-state.cjs` aggregates the JSONL ledger into `experiment-registry.json` and `agent-improvement-dashboard.md`, records latest and best values per dimension, adds sample-quality, journal, lineage, and mutation-coverage summaries, and computes stop status. It treats both `candidate-acceptable` and `candidate-better` as accepted candidates when building the registry.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:265:**Lane:** Lane B (model-benchmark)
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:267:These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, and the record-level mode field plus the two hardening env gates.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:273:Routes loop-host between the agent-improvement scorer and the model-benchmark materialize-then-run pipeline.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:277:`scripts/shared/loop-host.cjs` resolves `--mode` before any work begins. `--mode=agent-improvement`, or no flag, routes to `scripts/agent-improvement/score-candidate.cjs` unchanged; `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`; and `--mode=skill-benchmark` runs `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C). `VALID_MODES` is a closed three-value set, and an unknown mode warns to stderr and falls back to `agent-improvement`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:281:See [`04--model-benchmark-mode/01-mode-switch.md`](04--model-benchmark-mode/01-mode-switch.md) for full implementation and validation file listings.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:289:Model-agnostic dispatcher that routes prompts across executor CLIs only on the model-benchmark path.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:293:`scripts/model-benchmark/dispatch-model.cjs` routes through an executor map across cli-opencode, cli-claude-code, cli-codex, cli-gemini, and cli-devin, and is loaded only on the model-benchmark path, never in agent-improvement mode. It forwards `cwd` to every executor and applies rate-limit backoff using a non-busy `Atomics` sleep.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:297:See [`04--model-benchmark-mode/02-model-dispatcher.md`](04--model-benchmark-mode/02-model-dispatcher.md) for full implementation and validation file listings.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:305:Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:309:`run-benchmark.cjs --scorer pattern` is the default byte-identical heading and pattern matcher, while `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer. `--grader noop` is the default deterministic grader with no model dispatch, with `--grader mock` and `--grader llm` selecting the stub or real grader, and the report carries `scoringMethod: pattern` or `scoringMethod: 5dim`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:313:See [`04--model-benchmark-mode/03-opt-in-5dim-scorer.md`](04--model-benchmark-mode/03-opt-in-5dim-scorer.md) for full implementation and validation file listings.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:325:Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports plus `benchmark_run` records carry `scoringMethod: pattern|5dim`. `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer, and `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache. Both default to the permissive value for backward-compat.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:329:See [`04--model-benchmark-mode/04-mode-records-and-gates.md`](04--model-benchmark-mode/04-mode-records-and-gates.md) for full implementation and validation file listings.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:335:**Lane:** Lane C (skill-benchmark)
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:337:These entries describe the skill-benchmark path that diagnoses how a *skill* is routed-to, discovered, used, and structured in practice — distinct from doc-shape validation and manual testing playbooks. It is diagnostic by default and emits a ranked Skill Benchmark Report. Mode A (router-replay) and D1-inter (advisor probe) are deterministic; D4 usefulness ablation and live trace capture are follow-on.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:343:Routes loop-host to the skill-benchmark orchestrator with a single additive arm; the orchestrator runs the D5 gate, then per-scenario contamination-lint, router-replay, and scoring.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:347:`scripts/shared/loop-host.cjs` resolves `--mode=skill-benchmark` to `scripts/skill-benchmark/run-skill-benchmark.cjs` via an additive `VALID_MODES` entry, `LANE_SKILL_BENCHMARK` set, and `planInvocation` arm; the agent-improvement and model-benchmark plans stay byte-identical.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:351:`scripts/shared/loop-host.cjs`, `scripts/skill-benchmark/run-skill-benchmark.cjs`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:361:`scripts/skill-benchmark/contamination-lint.cjs` builds banned vocabulary from the target skill's own identity (name, triggers, router keywords, resource path tokens) and treats any leak as a fixture failure, not a skill failure.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:365:`scripts/skill-benchmark/contamination-lint.cjs`, `assets/skill-benchmark/fixtures/`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:375:`scripts/skill-benchmark/router-replay.cjs` extracts `INTENT_SIGNALS`/`RESOURCE_MAP` from the target `SKILL.md` and reproduces the substring routing (D1-intra + D2 proxy); `scripts/skill-benchmark/advisor-probe.cjs` runs `skill_advisor.py` over the SQLite graph for the D1-inter signal.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:379:`scripts/skill-benchmark/router-replay.cjs`, `scripts/skill-benchmark/advisor-probe.cjs`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:389:`scripts/skill-benchmark/d5-connectivity.cjs` flags dead routed paths, dead intent keys, path escapes, orphan references, and an unparseable router; any P0 sets `gateFailed` and caps the verdict to `BLOCKED-BY-STRUCTURE`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:393:`scripts/skill-benchmark/d5-connectivity.cjs`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:403:`scripts/skill-benchmark/score-skill-benchmark.cjs` scores D1 inter+intra, D2 discovery, D3 efficiency, D5 connectivity, and reports D4 usefulness as `unscored` until live mode; weights live in `assets/skill-benchmark/default_profile.json`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:407:`scripts/skill-benchmark/score-skill-benchmark.cjs`, `assets/skill-benchmark/default_profile.json`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:417:`scripts/skill-benchmark/build-report.cjs` renders `skill-benchmark-report.md` FROM `skill-benchmark-report.json`; bottlenecks map through `assets/skill-benchmark/remediation_taxonomy.json` to a target file, locus, one-line fix, and hand-off lane.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:421:`scripts/skill-benchmark/build-report.cjs`, `assets/skill-benchmark/remediation_taxonomy.json`.
.claude/agents/deep-improvement.md:2:name: deep-improvement
.claude/agents/deep-improvement.md:3:description: Proposal-only mutator for bounded deep-improvement candidate generation with evaluator-first rules
.claude/agents/deep-improvement.md:9:Proposal-only mutator for bounded deep-improvement experiments. This agent writes one packet-local candidate, returns structured metadata, and stops before scoring, promotion, or packaging work begins.
.claude/agents/deep-improvement.md:29:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.claude/agents/deep-improvement.md:39:| `deep-improvement` | Improvement loop protocol | Always | Charter, control file, target-profile, evaluator, and promotion guidance |
.opencode/agents/deep-improvement.md:2:name: deep-improvement
.opencode/agents/deep-improvement.md:3:description: Proposal-only mutator for bounded deep-improvement candidate generation with evaluator-first rules
.opencode/agents/deep-improvement.md:24:Proposal-only mutator for bounded deep-improvement experiments. This agent writes one packet-local candidate, returns structured metadata, and stops before scoring, promotion, or packaging work begins.
.opencode/agents/deep-improvement.md:44:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.opencode/agents/deep-improvement.md:54:| `deep-improvement` | Improvement loop protocol | Always | Charter, control file, target-profile, evaluator, and promotion guidance |

codex
The main sweep found one suspicious line in the feature catalog: it still describes state records as only `agent-improvement` or `model-benchmark`. I’m reading the surrounding sections now to check whether that is genuinely stale or scoped to Lane B.
exec
/bin/zsh -lc "nl -ba .claude/agents/deep-improvement.md | sed -n '20,40p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md | sed -n '260,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	
    21	1. **READ THE CONTROL BUNDLE** -> Read the copied charter and control file before generating any candidate.
    22	2. **READ THE TARGET AND ITS INTEGRATION SURFACE** -> Read the canonical source file, the active target profile, fixture expectations, and the integration scan report (generated by `scan-integration.cjs`) to understand how the agent connects across the system.
    23	3. **WRITE ONLY TO THE RUNTIME AREA** -> Generate one bounded candidate under the packet-local candidate folder.
    24	4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, change summary, and Critic-pass notes in machine-readable JSON.
    25	5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.
    26	
    27	**Key Principle**: This is a leaf mutator. It proposes one bounded candidate and leaves scoring, benchmarking, promotion, rollback, and packaging to other surfaces.
    28	
    29	**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
    30	
    31	---
    32	
    33	## 2. ROUTING SCAN
    34	
    35	### Skills
    36	
    37	| Skill | Domain | Use When | Key Features |
    38	| ----- | ------ | -------- | ------------ |
    39	| `deep-improvement` | Improvement loop protocol | Always | Charter, control file, target-profile, evaluator, and promotion guidance |
    40	| `sk-doc` | Documentation quality | When candidate language must stay crisp and explicit | Template alignment and validator-backed clarity |

 succeeded in 0ms:
   260	
   261	---
   262	
   263	## 5. MODEL-BENCHMARK MODE
   264	
   265	**Lane:** Lane B (model-benchmark)
   266	
   267	These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, and the record-level mode field plus the two hardening env gates.
   268	
   269	### Mode switch
   270	
   271	#### Description
   272	
   273	Routes loop-host between the agent-improvement scorer and the model-benchmark materialize-then-run pipeline.
   274	
   275	#### Current Reality
   276	
   277	`scripts/shared/loop-host.cjs` resolves `--mode` before any work begins. `--mode=agent-improvement`, or no flag, routes to `scripts/agent-improvement/score-candidate.cjs` unchanged; `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`; and `--mode=skill-benchmark` runs `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C). `VALID_MODES` is a closed three-value set, and an unknown mode warns to stderr and falls back to `agent-improvement`.
   278	
   279	#### Source Files
   280	
   281	See [`04--model-benchmark-mode/01-mode-switch.md`](04--model-benchmark-mode/01-mode-switch.md) for full implementation and validation file listings.
   282	
   283	---
   284	
   285	### Model dispatcher
   286	
   287	#### Description
   288	
   289	Model-agnostic dispatcher that routes prompts across executor CLIs only on the model-benchmark path.
   290	
   291	#### Current Reality
   292	
   293	`scripts/model-benchmark/dispatch-model.cjs` routes through an executor map across cli-opencode, cli-claude-code, cli-codex, cli-gemini, and cli-devin, and is loaded only on the model-benchmark path, never in agent-improvement mode. It forwards `cwd` to every executor and applies rate-limit backoff using a non-busy `Atomics` sleep.
   294	
   295	#### Source Files
   296	
   297	See [`04--model-benchmark-mode/02-model-dispatcher.md`](04--model-benchmark-mode/02-model-dispatcher.md) for full implementation and validation file listings.
   298	
   299	---
   300	
   301	### Opt-in 5-dimension scorer
   302	
   303	#### Description
   304	
   305	Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs.
   306	
   307	#### Current Reality
   308	
   309	`run-benchmark.cjs --scorer pattern` is the default byte-identical heading and pattern matcher, while `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer. `--grader noop` is the default deterministic grader with no model dispatch, with `--grader mock` and `--grader llm` selecting the stub or real grader, and the report carries `scoringMethod: pattern` or `scoringMethod: 5dim`.
   310	
   311	#### Source Files
   312	
   313	See [`04--model-benchmark-mode/03-opt-in-5dim-scorer.md`](04--model-benchmark-mode/03-opt-in-5dim-scorer.md) for full implementation and validation file listings.
   314	
   315	---
   316	
   317	### Mode records and hardening gates
   318	
   319	#### Description
   320	
   321	Stamps a mode field on every state record and exposes two env gates that harden the 5-dim scorer.
   322	
   323	#### Current Reality
   324	
   325	Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports plus `benchmark_run` records carry `scoringMethod: pattern|5dim`. `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer, and `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache. Both default to the permissive value for backward-compat.
   326	
   327	#### Source Files
   328	
   329	See [`04--model-benchmark-mode/04-mode-records-and-gates.md`](04--model-benchmark-mode/04-mode-records-and-gates.md) for full implementation and validation file listings.
   330	

exec
/bin/zsh -lc "nl -ba .opencode/agents/deep-improvement.md | sed -n '35,55p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    35	
    36	1. **READ THE CONTROL BUNDLE** -> Read the copied charter and control file before generating any candidate.
    37	2. **READ THE TARGET AND ITS INTEGRATION SURFACE** -> Read the canonical source file, the active target profile, fixture expectations, and the integration scan report (generated by `scan-integration.cjs`) to understand how the agent connects across the system.
    38	3. **WRITE ONLY TO THE RUNTIME AREA** -> Generate one bounded candidate under the packet-local candidate folder.
    39	4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, change summary, and Critic-pass notes in machine-readable JSON.
    40	5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.
    41	
    42	**Key Principle**: This is a leaf mutator. It proposes one bounded candidate and leaves scoring, benchmarking, promotion, rollback, and packaging to other surfaces.
    43	
    44	**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
    45	
    46	---
    47	
    48	## 2. ROUTING SCAN
    49	
    50	### Skills
    51	
    52	| Skill | Domain | Use When | Key Features |
    53	| ----- | ------ | -------- | ------------ |
    54	| `deep-improvement` | Improvement loop protocol | Always | Charter, control file, target-profile, evaluator, and promotion guidance |
    55	| `sk-doc` | Documentation quality | When candidate language must stay crisp and explicit | Template alignment and validator-backed clarity |

exec
/bin/zsh -lc "nl -ba .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md | sed -n '1,35p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "deep-improvement: Feature Catalog"
     3	description: "Unified reference combining the evaluation loop, integration scanning, scoring, model-benchmark mode, and skill-benchmark mode surfaces that currently ship in deep-improvement."
     4	---
     5	
     6	# deep-improvement: Feature Catalog
     7	
     8	This document combines the current feature inventory for the `deep-improvement` system into a single reference. The root catalog acts as the system-level directory: it summarizes the evaluation loop, the integration scanner, the deterministic scoring stack, the model-benchmark mode, and the skill-benchmark mode, then points to the per-feature files that carry the deeper implementation and validation anchors.
     9	
    10	---
    11	
    12	## 1. OVERVIEW
    13	
    14	Use this catalog as the canonical inventory for the live `deep-improvement` feature surface. The numbered sections below group the skill by runtime responsibility so readers can move from a top-level summary into per-feature reference files without losing the current code and operator-contract context behind each claim.
    15	
    16	### Lane Legend
    17	
    18	The skill runs three lanes through one agent. Each category and feature below is tagged with the lane it serves.
    19	
    20	| Lane | Meaning | Entry Point |
    21	|---|---|---|
    22	| **Lane A** | Agent-improvement: evaluate and improve an agent markdown file via guarded promotion | `/deep:start-agent-improvement-loop`, `loop-host --mode=agent-improvement` |
    23	| **Lane B** | Model-benchmark: benchmark a model or prompt framework, no agent mutation | `/deep:start-model-benchmark-loop`, `loop-host --mode=model-benchmark` |
    24	| **Lane C** | Skill-benchmark: diagnose a skill's routing, discovery, efficiency, and usefulness, no skill mutation | `/deep:start-skill-benchmark-loop`, `loop-host --mode=skill-benchmark` |
    25	| **Shared** | Surface used by all lanes (reducer, dashboard, profiling, command scaffolding) | reached from any lane |
    26	
    27	| Category | Coverage | Lane | Primary Runtime Surface |
    28	|---|---:|---|---|
    29	| Evaluation loop | 6 features | Lane A | `.opencode/commands/deep/start-agent-improvement-loop.md`, deep-improvement YAML workflows, `scripts/*.cjs` |
    30	| Integration scanning | 3 features | Lane A | `scan-integration.cjs`, `/deep:start-agent-improvement-loop`, `.opencode/agents/deep-improvement.md` |
    31	| Scoring system | 4 features | Shared | `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs` |
    32	| Model-benchmark mode | 4 features | Lane B | `loop-host.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `scorer/score-model-variant.cjs` |
    33	| Skill-benchmark mode | 6 features | Lane C | `loop-host.cjs --mode=skill-benchmark`, `scripts/skill-benchmark/*.cjs` |
    34	
    35	---

exec
/bin/zsh -lc "nl -ba .gemini/agents/deep-improvement.md | sed -n '20,40p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/commands/deep/start-skill-benchmark-loop.md | sed -n '1,45p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md | sed -n '335,421p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	
    21	1. **READ THE CONTROL BUNDLE** -> Read the copied charter and control file before generating any candidate.
    22	2. **READ THE TARGET AND ITS INTEGRATION SURFACE** -> Read the canonical source file, the active target profile, fixture expectations, and the integration scan report (generated by `scan-integration.cjs`) to understand how the agent connects across the system.
    23	3. **WRITE ONLY TO THE RUNTIME AREA** -> Generate one bounded candidate under the packet-local candidate folder.
    24	4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, change summary, and Critic-pass notes in machine-readable JSON.
    25	5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.
    26	
    27	**Key Principle**: This is a leaf mutator. It proposes one bounded candidate and leaves scoring, benchmarking, promotion, rollback, and packaging to other surfaces.
    28	
    29	**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
    30	
    31	---
    32	
    33	## 2. ROUTING SCAN
    34	
    35	### Skills
    36	
    37	| Skill | Domain | Use When | Key Features |
    38	| ----- | ------ | -------- | ------------ |
    39	| `deep-improvement` | Improvement loop protocol | Always | Charter, control file, target-profile, evaluator, and promotion guidance |
    40	| `sk-doc` | Documentation quality | When candidate language must stay crisp and explicit | Template alignment and validator-backed clarity |

 succeeded in 0ms:
     1	---
     2	description: "Benchmark a skill's real-world routing, discovery, efficiency, and usefulness (Lane C). Emits a ranked, remediable Skill Benchmark Report. Modes :auto, :confirm."
     3	skill: deep-improvement
     4	---
     5	
     6	# /deep:start-skill-benchmark-loop
     7	
     8	Lane C of the `deep-improvement` skill. Benchmarks whether a **skill** is well-structured, well-routed, efficient, and useful **in practice** — how AIs actually discover and use it — and emits a ranked Skill Benchmark Report with concrete, remediable findings. Distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior).
     9	
    10	## Phase 0 — self-verification
    11	
    12	Read `.opencode/skills/deep-improvement/SKILL.md` and `references/skill-benchmark/operator_guide.md` before dispatch.
    13	
    14	## Setup
    15	
    16	Resolve:
    17	- **target skill** — the skill id or root to benchmark (must have an `INTENT_SIGNALS` + `RESOURCE_MAP` smart router for Mode A; e.g. the `cli-*` skills).
    18	- **outputs dir** — where `skill-benchmark-report.{json,md}` are written.
    19	- **fixtures dir** (optional) — defaults to `<skill>/assets/skill-benchmark/fixtures/<skill-id>/`.
    20	- **trace mode** — `router` (Mode A, deterministic, default/CI) or `live` (Mode B, follow-on).
    21	
    22	## Run
    23	
    24	```bash
    25	node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
    26	  --mode=skill-benchmark \
    27	  --skill=<skill-id-or-root> \
    28	  --outputs-dir=<path> \
    29	  [--fixtures-dir=<path>] [--trace-mode=router] [--advisor-mode=python]
    30	```
    31	
    32	`--advisor-mode=python` enables the built-but-opt-in D1-inter advisor probe (deterministic in-repo SQLite advisor, scored out-of-band; off by default and in CI). The orchestrator (`scripts/skill-benchmark/run-skill-benchmark.cjs`) runs the D5 hard gate first, then per-scenario contamination-lint → router-replay → score, then writes the dual report.
    33	
    34	## Output
    35	
    36	- `skill-benchmark-report.json` — machine report (verdict, D1–D5, funnel, ranked bottlenecks, scenario rows).
    37	- `skill-benchmark-report.md` — rendered FROM the JSON (anti-drift).
    38	
    39	Lane C is **diagnostic by default** (no target-skill mutation). Findings hand off to Lane A (`/deep:start-agent-improvement-loop`) or a follow-up spec packet via the remediation taxonomy.
    40	
    41	## Scope (current)
    42	
    43	Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically. D1-inter (advisor selection) is also built and deterministic, but opt-in via `--advisor-mode=python` (off by default and in CI; scored out-of-band through the in-repo SQLite advisor). Only D4 (usefulness ablation) and the live in-situ trace (Mode B) remain follow-on per the 002 implementation playbook; they report as `unscored-mode-a` until built. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.

 succeeded in 0ms:
   335	**Lane:** Lane C (skill-benchmark)
   336	
   337	These entries describe the skill-benchmark path that diagnoses how a *skill* is routed-to, discovered, used, and structured in practice — distinct from doc-shape validation and manual testing playbooks. It is diagnostic by default and emits a ranked Skill Benchmark Report. Mode A (router-replay) and D1-inter (advisor probe) are deterministic; D4 usefulness ablation and live trace capture are follow-on.
   338	
   339	### Mode wiring and orchestration
   340	
   341	#### Description
   342	
   343	Routes loop-host to the skill-benchmark orchestrator with a single additive arm; the orchestrator runs the D5 gate, then per-scenario contamination-lint, router-replay, and scoring.
   344	
   345	#### Current Reality
   346	
   347	`scripts/shared/loop-host.cjs` resolves `--mode=skill-benchmark` to `scripts/skill-benchmark/run-skill-benchmark.cjs` via an additive `VALID_MODES` entry, `LANE_SKILL_BENCHMARK` set, and `planInvocation` arm; the agent-improvement and model-benchmark plans stay byte-identical.
   348	
   349	#### Source Files
   350	
   351	`scripts/shared/loop-host.cjs`, `scripts/skill-benchmark/run-skill-benchmark.cjs`.
   352	
   353	### Hint-free fixtures and contamination gate
   354	
   355	#### Description
   356	
   357	Per-skill public/private scenario fixtures keep the expected skill/intents/resources scorer-only; a contamination linter rejects public prompts that leak the answer before dispatch.
   358	
   359	#### Current Reality
   360	
   361	`scripts/skill-benchmark/contamination-lint.cjs` builds banned vocabulary from the target skill's own identity (name, triggers, router keywords, resource path tokens) and treats any leak as a fixture failure, not a skill failure.
   362	
   363	#### Source Files
   364	
   365	`scripts/skill-benchmark/contamination-lint.cjs`, `assets/skill-benchmark/fixtures/`.
   366	
   367	### Router-replay and advisor probe (Mode A)
   368	
   369	#### Description
   370	
   371	Replays the target skill's own router for in-skill routing and discovery, and probes the advisor out-of-band for inter-skill selection — both deterministic, no LLM.
   372	
   373	#### Current Reality
   374	
   375	`scripts/skill-benchmark/router-replay.cjs` extracts `INTENT_SIGNALS`/`RESOURCE_MAP` from the target `SKILL.md` and reproduces the substring routing (D1-intra + D2 proxy); `scripts/skill-benchmark/advisor-probe.cjs` runs `skill_advisor.py` over the SQLite graph for the D1-inter signal.
   376	
   377	#### Source Files
   378	
   379	`scripts/skill-benchmark/router-replay.cjs`, `scripts/skill-benchmark/advisor-probe.cjs`.
   380	
   381	### D5 structural connectivity hard gate
   382	
   383	#### Description
   384	
   385	A static scan runs before any dispatch and caps the verdict on structural failures.
   386	
   387	#### Current Reality
   388	
   389	`scripts/skill-benchmark/d5-connectivity.cjs` flags dead routed paths, dead intent keys, path escapes, orphan references, and an unparseable router; any P0 sets `gateFailed` and caps the verdict to `BLOCKED-BY-STRUCTURE`.
   390	
   391	#### Source Files
   392	
   393	`scripts/skill-benchmark/d5-connectivity.cjs`.
   394	
   395	### D1-D5 scoring and funnel
   396	
   397	#### Description
   398	
   399	Computes the five dimensions with a funnel whose largest single-stage drop is the headline bottleneck; the aggregate normalizes over the dimensions actually measured.
   400	
   401	#### Current Reality
   402	
   403	`scripts/skill-benchmark/score-skill-benchmark.cjs` scores D1 inter+intra, D2 discovery, D3 efficiency, D5 connectivity, and reports D4 usefulness as `unscored` until live mode; weights live in `assets/skill-benchmark/default_profile.json`.
   404	
   405	#### Source Files
   406	
   407	`scripts/skill-benchmark/score-skill-benchmark.cjs`, `assets/skill-benchmark/default_profile.json`.
   408	
   409	### Dual report and remediation taxonomy
   410	
   411	#### Description
   412	
   413	Emits a machine report plus a human report rendered from it (anti-drift), with ranked bottlenecks mapped to concrete remediations and hand-off lanes.
   414	
   415	#### Current Reality
   416	
   417	`scripts/skill-benchmark/build-report.cjs` renders `skill-benchmark-report.md` FROM `skill-benchmark-report.json`; bottlenecks map through `assets/skill-benchmark/remediation_taxonomy.json` to a target file, locus, one-line fix, and hand-off lane.
   418	
   419	#### Source Files
   420	
   421	`scripts/skill-benchmark/build-report.cjs`, `assets/skill-benchmark/remediation_taxonomy.json`.

exec
/bin/zsh -lc 'rg -n "D1-inter|D1 inter|advisor probe|advisor-probe|advisor selection|opt-in|built-but-opt-in|scores D1|Mode A" .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md .opencode/commands/deep/start-skill-benchmark-loop.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/commands/deep/start-skill-benchmark-loop.md:17:- **target skill** — the skill id or root to benchmark (must have an `INTENT_SIGNALS` + `RESOURCE_MAP` smart router for Mode A; e.g. the `cli-*` skills).
.opencode/commands/deep/start-skill-benchmark-loop.md:20:- **trace mode** — `router` (Mode A, deterministic, default/CI) or `live` (Mode B, follow-on).
.opencode/commands/deep/start-skill-benchmark-loop.md:32:`--advisor-mode=python` enables the built-but-opt-in D1-inter advisor probe (deterministic in-repo SQLite advisor, scored out-of-band; off by default and in CI). The orchestrator (`scripts/skill-benchmark/run-skill-benchmark.cjs`) runs the D5 hard gate first, then per-scenario contamination-lint → router-replay → score, then writes the dual report.
.opencode/commands/deep/start-skill-benchmark-loop.md:43:Mode A (router-replay) scores D1-intra, D2, D3, D5 deterministically. D1-inter (advisor selection) is also built and deterministic, but opt-in via `--advisor-mode=python` (off by default and in CI; scored out-of-band through the in-repo SQLite advisor). Only D4 (usefulness ablation) and the live in-situ trace (Mode B) remain follow-on per the 002 implementation playbook; they report as `unscored-mode-a` until built. Modes `:auto` / `:confirm` follow the shared deep-loop command contract.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:267:These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, and the record-level mode field plus the two hardening env gates.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:305:Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:313:See [`04--model-benchmark-mode/03-opt-in-5dim-scorer.md`](04--model-benchmark-mode/03-opt-in-5dim-scorer.md) for full implementation and validation file listings.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:337:These entries describe the skill-benchmark path that diagnoses how a *skill* is routed-to, discovered, used, and structured in practice — distinct from doc-shape validation and manual testing playbooks. It is diagnostic by default and emits a ranked Skill Benchmark Report. Mode A (router-replay) and D1-inter (advisor probe) are deterministic; D4 usefulness ablation and live trace capture are follow-on.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:367:### Router-replay and advisor probe (Mode A)
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:375:`scripts/skill-benchmark/router-replay.cjs` extracts `INTENT_SIGNALS`/`RESOURCE_MAP` from the target `SKILL.md` and reproduces the substring routing (D1-intra + D2 proxy); `scripts/skill-benchmark/advisor-probe.cjs` runs `skill_advisor.py` over the SQLite graph for the D1-inter signal.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:379:`scripts/skill-benchmark/router-replay.cjs`, `scripts/skill-benchmark/advisor-probe.cjs`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:403:`scripts/skill-benchmark/score-skill-benchmark.cjs` scores D1 inter+intra, D2 discovery, D3 efficiency, D5 connectivity, and reports D4 usefulness as `unscored` until live mode; weights live in `assets/skill-benchmark/default_profile.json`.

exec
/bin/zsh -lc "rg -n \"\\btwo\\b|two-lane|two lane|2 lane|only.*agent-improvement|only.*model-benchmark|agent-improvement.*or.*model-benchmark|deep-agent-improvement\" .opencode/agents/deep-improvement.md .claude/agents/deep-improvement.md .gemini/agents/deep-improvement.md .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md .opencode/commands/deep/start-skill-benchmark-loop.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:169:Mirror parity is signal-based, not byte-for-byte. The scanner strips frontmatter, extracts up to three emphasized signal strings from the canonical body, and marks a mirror `aligned` when at least two signals appear in the mirror body. It checks `.claude/agents`, `.codex/agents`, and `.gemini/agents` against the canonical `.opencode/agents`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:267:These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, and the record-level mode field plus the two hardening env gates.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:273:Routes loop-host between the agent-improvement scorer and the model-benchmark materialize-then-run pipeline.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:277:`scripts/shared/loop-host.cjs` resolves `--mode` before any work begins. `--mode=agent-improvement`, or no flag, routes to `scripts/agent-improvement/score-candidate.cjs` unchanged; `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`; and `--mode=skill-benchmark` runs `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C). `VALID_MODES` is a closed three-value set, and an unknown mode warns to stderr and falls back to `agent-improvement`.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:289:Model-agnostic dispatcher that routes prompts across executor CLIs only on the model-benchmark path.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:293:`scripts/model-benchmark/dispatch-model.cjs` routes through an executor map across cli-opencode, cli-claude-code, cli-codex, cli-gemini, and cli-devin, and is loaded only on the model-benchmark path, never in agent-improvement mode. It forwards `cwd` to every executor and applies rate-limit backoff using a non-busy `Atomics` sleep.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:321:Stamps a mode field on every state record and exposes two env gates that harden the 5-dim scorer.
.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:325:Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports plus `benchmark_run` records carry `scoringMethod: pattern|5dim`. `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer, and `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache. Both default to the permissive value for backward-compat.
.gemini/agents/deep-improvement.md:29:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.opencode/agents/deep-improvement.md:44:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.
.claude/agents/deep-improvement.md:29:**Lane awareness**: The deep-improvement skill has three co-equal lanes. Lane A (agent-improvement, `/deep:start-agent-improvement-loop`) dispatches this proposal-only mutator and is unchanged. Lane B (model-benchmark, `/deep:start-model-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=model-benchmark`) benchmarks a model or prompt framework by dispatching MODELS through `scripts/model-benchmark/dispatch-model.cjs` across cli-opencode, claude-code, codex, gemini, and devin, scored by `scripts/model-benchmark/run-benchmark.cjs --scorer pattern|5dim`. Lane C (skill-benchmark, `/deep:start-skill-benchmark-loop`, `scripts/shared/loop-host.cjs --mode=skill-benchmark`) benchmarks whether a SKILL is well-routed, discoverable, efficient, and useful in practice by replaying its smart router through `scripts/skill-benchmark/run-skill-benchmark.cjs`, scored across D1-D5. There is ONE agent: Lanes B and C never spawn a second Claude agent and never dispatch this agent. This note is awareness only and does not change this agent's proposal-only behavior.

codex
## Focus
three-lane consistency (confirm remediation)

## Findings
P2, `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:325`, The catalog still says every state record is either `agent-improvement` or `model-benchmark`, omitting the new `skill-benchmark` lane. Fix: update the mode list to include `mode: skill-benchmark` or narrow the sentence to Lane B records only.

P2, `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:403`, The skill-benchmark scoring summary says D1 inter+intra are scored without labeling D1-inter as built-but-opt-in/off by default, while the command doc correctly marks it opt-in. Fix: qualify D1-inter as enabled only via `--advisor-mode=python`, with default Mode A scoring D1-intra, D2, D3, and D5.

## Verdict
Agent mirrors and the skill-benchmark command held; the feature catalog still has two residual stale/ambiguous Lane C statements.
Review verdict: CONDITIONAL

===FINDINGS_JSON===
[{"id":"f-p122-i1-01","severity":"P2","file":".opencode/skills/deep-improvement/feature_catalog/feature_catalog.md","line":325,"issue":"The catalog still says every state record is either `agent-improvement` or `model-benchmark`, omitting the new `skill-benchmark` lane.","fix":"Update the mode list to include `mode: skill-benchmark` or narrow the sentence to Lane B records only."},{"id":"f-p122-i1-02","severity":"P2","file":".opencode/skills/deep-improvement/feature_catalog/feature_catalog.md","line":403,"issue":"The skill-benchmark scoring summary says D1 inter+intra are scored without labeling D1-inter as built-but-opt-in/off by default, while the command doc correctly marks it opt-in.","fix":"Qualify D1-inter as enabled only via `--advisor-mode=python`, with default Mode A scoring D1-intra, D2, D3, and D5."}]
===END_FINDINGS===
hook: Stop
hook: Stop Completed
tokens used
80,135
## Focus
three-lane consistency (confirm remediation)

## Findings
P2, `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:325`, The catalog still says every state record is either `agent-improvement` or `model-benchmark`, omitting the new `skill-benchmark` lane. Fix: update the mode list to include `mode: skill-benchmark` or narrow the sentence to Lane B records only.

P2, `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:403`, The skill-benchmark scoring summary says D1 inter+intra are scored without labeling D1-inter as built-but-opt-in/off by default, while the command doc correctly marks it opt-in. Fix: qualify D1-inter as enabled only via `--advisor-mode=python`, with default Mode A scoring D1-intra, D2, D3, and D5.

## Verdict
Agent mirrors and the skill-benchmark command held; the feature catalog still has two residual stale/ambiguous Lane C statements.
Review verdict: CONDITIONAL

===FINDINGS_JSON===
[{"id":"f-p122-i1-01","severity":"P2","file":".opencode/skills/deep-improvement/feature_catalog/feature_catalog.md","line":325,"issue":"The catalog still says every state record is either `agent-improvement` or `model-benchmark`, omitting the new `skill-benchmark` lane.","fix":"Update the mode list to include `mode: skill-benchmark` or narrow the sentence to Lane B records only."},{"id":"f-p122-i1-02","severity":"P2","file":".opencode/skills/deep-improvement/feature_catalog/feature_catalog.md","line":403,"issue":"The skill-benchmark scoring summary says D1 inter+intra are scored without labeling D1-inter as built-but-opt-in/off by default, while the command doc correctly marks it opt-in.","fix":"Qualify D1-inter as enabled only via `--advisor-mode=python`, with default Mode A scoring D1-intra, D2, D3, and D5."}]
===END_FINDINGS===
