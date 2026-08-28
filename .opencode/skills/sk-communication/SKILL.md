---
name: sk-communication
description: Projects terse CLI output to plain English byte-safely, and explains a topic or reply as the smallest visual at a chosen depth.
allowed-tools: [Read, Write, Bash, Grep, Glob]
version: 1.1.0.0
---

<!-- Keywords: communication projection, claudish to english, rewrite CLI output, plain-english projection, presentation projection, privacy-first rewrite, full-projection, safe-native, provider adapters, exact-original fallback, deepseek ollama llama.cpp, blind non-inferiority evaluation, compatibility doctor, release gate, visual explanation, explain visually, diagram this, draw the flow, visualize, explain simply, explain from zero, modality selection, depth rubric -->

# Communication Projection

Make supported CLI and agent output read like careful plain English, across Claude, Codex, Pi, OpenCode, Devin, and Cursor, while leaving the canonical event stream, transcript, tool data, and model context byte-for-byte unchanged. Every unsafe or failed path returns the exact original. The implementation is the `@portable-cli/communication-projection` package under `.opencode/skills/sk-communication/cli-communication-projection/`; this skill routes you to the right part of it and enforces its invariants.

Projection is off by default for everyone. Nothing rewrites CLI output until an operator opts in on their own machine, by setting `COMMUNICATION_PROJECTION_ENABLED` or by adding a git-ignored `enablement.local.json` at the package root. Every activation path checks `isProjectionEnabled()` first. This skill is also held out of advisor routing on purpose. `sk-communication` is on the advisor route-exclusions denylist (`.opencode/skills/system-skill-advisor/mcp-server/config/route-exclusions.json`), so the recommender never surfaces it and you invoke it by hand.

### Two lanes

The skill adapts an explanation on three axes. Lane A moves one of them; Lane B moves the other two.

| | **Lane A — Projection** | **Lane B — Explanation** |
|---|---|---|
| **Axis** | Register: the same content in plainer words | Modality (prose → visual) and depth (assumed knowledge) |
| **Acts on** | An existing byte stream of agent output | A topic, or the prior reply, explained anew |
| **Produces** | A display-only re-render of that stream | A new diagram, tree, or artifact |
| **Reaches a model?** | May call a local or hosted model | In-context only |
| **Gating** | Off by default; egress rules apply | Always available by command; no enablement flag |
| **Entry point** | `/rewrite:response`, `/rewrite:response-by-external-agent` | `/rewrite:explain-visually` |

The gating asymmetry is deliberate and load-bearing. Lane A is flagged because it rewrites canonical output and may ship that content to a model. Lane B synthesizes new material in-context and touches nothing canonical, so **the enablement flag and egress rules do not apply to it**. Do not extend Lane A's default-off posture to Lane B; that would disable a lane that carries none of the risk the flag exists to contain.

Both lanes stay off advisor routing. Neither is discoverable by recommendation; both are invoked by hand.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:

- Rewriting terse, robotic CLI or agent status output into readable prose without changing the underlying data.
- A provider-neutral "claudish to English" projection layer across multiple CLIs.
- Choosing where rewriting happens — a local model or a hosted one — under explicit privacy and egress rules.
- Wiring one of the six runtime adapters (Claude, Codex, Pi, OpenCode, Devin, Cursor) to a rewrite pipeline.
- Deciding a presentation tier: full 1:1 projection versus a safe-native fallback.
- Measuring whether rewritten output reads as well as a human reference (blind non-inferiority evaluation), or gating a release on that evidence.

Lane B (explanation) additionally covers:

- Turning an explanation into a picture — control flow, structure, sequence, or what changed — instead of more prose.
- Re-rendering the previous reply as a diagram rather than as plainer wording.
- Explaining a topic to a reader with little or no background, leading with imagery over text.
- Choosing which visual form fits the content, and how much prior knowledge to assume.

### Keyword Triggers

`communication projection`, `claudish to english`, `rewrite CLI output`, `plain-english projection`, `privacy-first rewrite`, `full-projection`, `safe-native`, `provider adapters`, `exact-original fallback`, `compatibility doctor`, `release gate`, `non-inferiority evaluation`.

Lane B: `explain visually`, `diagram this`, `draw the flow`, `visualize this`, `sketch the structure`, `explain simply`, `explain from zero`, `explain like i know nothing`, `walk me through it visually`.

### When NOT to Use

- General application code implementation → `sk-code`.
- Authoring documentation or markdown → `sk-doc`.
- Live-website CSS to a measured Style Reference → `sk-design-md-generator`.
- Git worktrees, commits, or PRs → `sk-git`.
- Rewriting durable Markdown or any on-disk file. That changes canonical bytes and is explicitly out of scope; it needs a separate opt-in product contract, not this projection layer. This bars *editing existing files*. It does not bar Lane B from **creating** a new, self-contained explanatory artifact when the operator passes `--artifact` — a new file is not a rewrite of canonical bytes.

### Operator Trigger Commands

Three slash commands expose sk-communication as an on-demand trigger surface. Projection stays off by default; no command changes that global state persistently.

- `/rewrite:response` — the active AI re-renders its own most recent reply in plain English, entirely in-context. No local or external LLM. Display-only: canonical bytes stay unchanged.
- `/rewrite:response-by-external-agent` — a one-shot projection of a target through a chosen engine (an external `cli-*` skill, native in-context, or a local LLM). It sets `COMMUNICATION_PROJECTION_ENABLED` inline for the single run so the flag falls away immediately afterward, keeping the default-off invariant even on error. It never writes `enablement.local.json`.
- `/rewrite:explain-visually` — Lane B. Explains a named topic, or the prior reply when no topic is given, as the smallest visual that answers the question, at a chosen depth (`expert` | `plain` | `novice`). Entirely in-context: no local or external LLM, so no enablement flag applies. Display-only unless `--artifact` is passed, which creates one new self-contained HTML file. Modality table and depth rubric: `references/visual-explanation.md`.

---

## 2. SMART ROUTING

### Routing Signals

The capability is one package split by responsibility. Route to the subsystem the request needs:

| Request signal | Package surface |
|---|---|
| Assemble a whole message, bound context, versioned prompt profile | `src/core/`, `src/context/`, `src/contracts/` |
| Preserve protected spans, validate meaning, decide how to display | `src/fidelity/`, `src/render/` |
| Pick a local vs hosted model under privacy rules | `src/privacy/`, `src/providers/` |
| Wire a specific CLI adapter or its display | `src/runtimes/`, `src/clients/` |
| Score quality or aggregate private telemetry | `src/evaluation/`, `src/observability/` |
| Check compatibility, gate a release, or roll back | `src/doctor/`, `src/release/` |
| Explain a topic or the prior reply as a visual, or pick a depth | `references/visual-explanation.md` (Lane B; no package surface) |

### Resource Domains

- The package itself under `.opencode/skills/sk-communication/cli-communication-projection/` is the primary resource; its `docs/` folder holds install, configuration, privacy, support-matrix, rollback, and runbook guidance.
- The design and requirements history lives in the spec epic under `specs/cli-external-orchestration/035-improved-communication/`.
- Lane B has no package surface. Its whole contract is `references/visual-explanation.md` plus the command file `.opencode/commands/rewrite/explain-visually.md`.

### Loading Levels

- ALWAYS: read the relevant `src/<subsystem>/index.ts` exports before integrating against them.
- CONDITIONAL: read the matching `docs/*.md` when the task is install, privacy, support, or rollback.
- ON_DEMAND: read the spec epic only for the "why" behind a frozen invariant.
- LANE B: read `references/visual-explanation.md` before choosing a visual form or a depth; nothing under the package applies.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references",)
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "checklist": [
        "Confirm which subsystem the task touches",
        "Provide one concrete input or expected outcome",
    ],
}

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError("Only skill-local markdown resources are routable")
    return resolved.relative_to(SKILL_ROOT).as_posix()

EXPLANATION_SIGNALS = (
    "explain visually", "diagram", "draw the flow", "visualize", "sketch",
    "explain simply", "explain from zero", "walk me through",
    "modality", "depth", "explain-visually",
)

def select_lane(request) -> str:
    """Lane B owns visual explanation; everything else is projection."""
    text = str(getattr(request, "text", request)).lower()
    return "explanation" if any(s in text for s in EXPLANATION_SIGNALS) else "projection"

LANE_RESOURCES = {
    "projection": ["references/package-map.md"],
    "explanation": ["references/visual-explanation.md"],
}

def route_resources(request):
    inventory = discover_markdown_resources()
    selected = LANE_RESOURCES[select_lane(request)] if inventory else []
    if not selected:
        return {**UNKNOWN_FALLBACK, "resources": []}
    loaded = []
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in loaded:
            load(guarded)
            loaded.append(guarded)
    return {"lane": select_lane(request), "resources": loaded}
```

---

## 3. HOW IT WORKS

### The Pipeline

```text
canonical event/transcript ──> unchanged persistence + model context
                          └──> assemble message + bound context
                               └──> protect spans
                                    └──> privacy route (classify + consent BEFORE ranking)
                                         └──> provider rewrite (local or hosted)
                                              └──> fidelity validate (deterministic + semantic)
                                                   └──> render decision:
                                                        atomic replace | append | sidecar | original-only
```

Consume it through the package's subpath exports (`@portable-cli/communication-projection`, plus `./contracts`, `./versioning`, `./providers`, `./privacy`, `./runtimes`, `./evaluation`, `./observability`, `./doctor`, `./release`). Key entry points: `selectPrivacyRoute` then `executeProviderRoute`; the runtime adapters' `adapt`/`present`; `runCompatibilityDoctor`; `evaluateReleaseReadiness`.

### The Two Presentation Tiers

- **full-projection** — only a client-owned or headless path that owns a complete message AND an atomic render decision may claim a full 1:1 rewrite.
- **safe-native** — a constrained native surface may only append, use a sidecar, or show original-only. It never claims 1:1 parity, and it never suppresses the original before a validated replacement exists.

### Verification

Run the package's authoritative gate from the package directory: `npm run check` (typecheck, build, tests, import smoke). Test files run serially so latency benchmarks measure without contention.

---

## 4. RULES

### ✅ ALWAYS

- Keep canonical transcripts, events, tool inputs, tool results, and future model context byte-for-byte unchanged.
- Run privacy classification and egress consent BEFORE any cost, quality, or latency ranking.
- Return the exact original bytes on any unsupported, unsafe, timed-out, cancelled, or failed path.
- Make every runtime path declare full-projection or safe-native, and keep the two separate in any parity claim.
- Keep telemetry content-free: reason codes only, never raw transcript, prompt, candidate, protected-span, or credential values; correlate with rotating keyed digests.
- Revalidate OpenCode Go retention and training facts before the OpenCode Go preset's `expiresAt` (`.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts`) and again at every release; a stale hosted-privacy fact blocks hosted routing.

### ❌ NEVER

- Never write a projection back into canonical state to simulate an integration.
- Never move locally classified text to a hosted provider without explicit, configured, allowed fallback.
- Never treat a shared wire protocol as proof of model capability, privacy, retention, or fidelity — require dated evidence and fail closed on unknown.
- Never count a safe-native result toward a full-projection 1:1 claim.
- Never authorize a release on provisional or LLM-judge evaluation evidence; the release gate requires a human-certified non-inferiority result.

### ⚠️ ESCALATE IF

- A capability, retention, residency, or protocol-major fact is unknown or stale — fail closed to original-only and surface it.
- A release is requested before the powered blind human non-inferiority study has passed, or before a live credentialed provider smoke exists.

---

## 5. REFERENCES AND RELATED RESOURCES

### Core

- `references/package-map.md` — the subsystem-to-path map and the public entry points; the smart router loads it.
- `references/visual-explanation.md` — Lane B: the content-to-modality table, the three-level depth rubric, protected spans, and the lane boundary.
- `.opencode/skills/sk-communication/cli-communication-projection/` — the implementation; read `src/<subsystem>/index.ts` for the public surface.
- `.opencode/skills/sk-communication/cli-communication-projection/docs/` — install, configuration, privacy, support-matrix, rollback, and runbook.

### Deep Detail

- `specs/cli-external-orchestration/035-improved-communication/` — the eight-phase design record and frozen invariants; load only for the reasoning behind a rule above.

### Related Skills

- `sk-code` — builds and verifies integration code against the package.
- `sk-design-md-generator` — extracts a measured Style Reference (design tokens from a live source).
- `sk-git` — worktree, commits, and PR for the integration.

---

## 6. SUCCESS CRITERIA

- The chosen path preserves the canonical original exactly and returns it on every failure.
- Privacy runs before ranking, with no silent local-to-hosted egress.
- Each runtime path declares and honors one presentation tier.
- Telemetry is content-free and passes secret and content canaries.
- The package gate (`npm run check`) is green from the final state.

---

## 7. INTEGRATION POINTS

### Inputs

- A runtime's canonical event stream or transcript, plus provider and privacy configuration.

### Outputs

- A validated display projection, or a typed safe fallback that shows the exact original.

### Related Workflows

- `sk-code` builds and verifies integration code against this package.
- `sk-design-md-generator` extracts a measured Style Reference from a live source.
- `sk-git` handles the worktree, commits, and PR when integrating.
