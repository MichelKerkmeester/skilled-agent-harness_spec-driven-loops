---
name: sk-communication
description: Projects terse CLI output to plain English byte-safely, across six runtimes, leaving canonical bytes unchanged.
allowed-tools: [Read, Write, Bash, Grep, Glob]
version: 1.2.0.0
---

<!-- Keywords: communication projection, claudish to english, rewrite CLI output, plain-english projection, presentation projection, privacy-first rewrite, full-projection, safe-native, provider adapters, exact-original fallback, deepseek ollama llama.cpp, blind non-inferiority evaluation, compatibility doctor, release gate -->

# Communication Projection

Make supported CLI and agent output read like careful plain English, across Claude, Codex, Pi, OpenCode, Devin, and Cursor, while leaving the canonical event stream, transcript, tool data, and model context byte-for-byte unchanged. Every unsafe or failed path returns the exact original. The implementation is the `@portable-cli/communication-projection` package under `.opencode/skills/sk-communication/cli-communication-projection/`; this skill routes you to the right part of it and enforces its invariants.

Projection is off by default for everyone. Nothing rewrites CLI output until an operator opts in on their own machine, by setting `COMMUNICATION_PROJECTION_ENABLED` or by adding a git-ignored `enablement.local.json` at the package root. Every activation path checks `isProjectionEnabled()` first. This skill is also held out of advisor routing on purpose. `sk-communication` is on the advisor route-exclusions denylist (`.opencode/skills/system-skill-advisor/runtime/config/route-exclusions.json`), so the recommender never surfaces it and you invoke it by hand.

### One lane

This skill does one thing: it re-renders an existing byte stream of agent output in plainer words,
without changing the register's content, and returns the exact original whenever it cannot. It acts on
a message that already exists; it never composes new material.

It carried a second lane until this release — an explanation lane that turned a topic into a diagram
at a chosen depth. That lane was retired. What it produced was a fenced Mermaid block, which the
terminals it ran in display as source text rather than as a picture, and the runtimes that can publish
a rendered page now do so natively. The projection lane keeps this skill's whole risk profile, and
that profile is what the enablement flag and the egress rules exist to contain.

The skill stays off advisor routing: it is on the recommender's exclusion list and you invoke it by
hand.

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

### Keyword Triggers

`communication projection`, `claudish to english`, `rewrite CLI output`, `plain-english projection`, `privacy-first rewrite`, `full-projection`, `safe-native`, `provider adapters`, `exact-original fallback`, `compatibility doctor`, `release gate`, `non-inferiority evaluation`.

### When NOT to Use

- General application code implementation → `sk-code`.
- Authoring documentation or markdown → `sk-doc`.
- Live-website CSS to a measured Style Reference → `sk-design-md-generator`.
- Git worktrees, commits, or PRs → `sk-git`.
- Explaining something as a diagram, or publishing a rendered page → the runtime's own visual capability. This skill carried that once and no longer does.
- Rewriting durable Markdown or any on-disk file. That changes canonical bytes and is explicitly out of scope; it needs a separate opt-in product contract, not this projection layer. This bars *editing existing files*.

### Operator Trigger Commands

Two slash commands expose sk-communication as an on-demand trigger surface. Projection stays off by default; no command changes that global state persistently.

- `/rewrite:response` — the active AI re-renders its own most recent reply in plain English, entirely in-context. No local or external LLM. Display-only: canonical bytes stay unchanged.
- `/rewrite:response-by-external-agent` — a one-shot projection of a target through a chosen engine (an external `cli-*` skill, native in-context, or a local LLM). It sets `COMMUNICATION_PROJECTION_ENABLED` inline for the single run so the flag falls away immediately afterward, keeping the default-off invariant even on error. It never writes `enablement.local.json`.

---

## 2. SMART ROUTING

### Routing Signals

The capability is one package split by responsibility. Route to the subsystem the request needs:

| Request signal | Package surface | Public entry points |
|---|---|---|
| Assemble a whole message, bound context, versioned prompt profile | `src/core/`, `src/context/`, `src/contracts/` | `MessageAssembler`, `selectBoundedContext`, `validateContract` |
| Preserve protected spans, validate meaning, decide how to display | `src/fidelity/`, `src/render/` | `protectMarkdown`, `restoreProtectedSpans`, `validateProjectionCandidate`, `decideRender` |
| Pick a local vs hosted model under privacy rules | `src/privacy/`, `src/providers/` | `selectPrivacyRoute`, `executeProviderRoute` |
| Wire a specific CLI adapter or its display | `src/runtimes/`, `src/clients/` | the runtime adapters' `adapt` / `present`; client display and sidecar |
| Score quality or aggregate private telemetry | `src/evaluation/`, `src/observability/` | `evaluateReleaseGate`, `createReleaseReport`, content-free aggregation |
| Check compatibility, gate a release, or roll back | `src/doctor/`, `src/release/` | `runCompatibilityDoctor`, `evaluateReleaseReadiness`, `planRollback` |

Read `src/<subsystem>/index.ts` for the exact public surface before integrating against it.

### Resource Domains

- The package itself under `.opencode/skills/sk-communication/cli-communication-projection/` is the primary resource; its `docs/` folder holds install, configuration, privacy, support-matrix, rollback, and runbook guidance. The subsystem map above is the routing layer and lives inline in this document.
- The design and requirements history lives in the spec epic under `specs/cli-external-orchestration/035-improved-communication/`.

### Loading Levels

- ALWAYS: read the relevant `src/<subsystem>/index.ts` exports before integrating against them.
- CONDITIONAL: read the matching `docs/*.md` when the task is install, privacy, support, or rollback.
- ON_DEMAND: read the spec epic only for the "why" behind a frozen invariant.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent

# This skill routes by subsystem, not by lane. The subsystem map in the table above is the routing
# layer and it lives inline in this document, so a projection request loads no additional markdown —
# what it needs is the package's own `src/<subsystem>/index.ts`, which is code rather than a routable
# skill resource. The router therefore answers which subsystem a request touches, and says so when it
# cannot tell, rather than selecting a file to read.

SUBSYSTEMS = {
    "assembly":    ["assemble", "message", "bound context", "prompt profile", "contract"],
    "fidelity":    ["protected span", "fidelity", "validate", "render decision", "display"],
    "privacy":     ["privacy", "egress", "consent", "local model", "hosted", "provider"],
    "runtimes":    ["adapter", "runtime", "claude", "codex", "pi", "opencode", "devin", "cursor"],
    "evaluation":  ["score", "quality", "telemetry", "non-inferiority", "observability"],
    "release":     ["doctor", "compatibility", "release gate", "rollback"],
}

UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "checklist": [
        "Confirm which subsystem the task touches",
        "Provide one concrete input or expected outcome",
    ],
}

def select_subsystem(request):
    """Name the subsystem a request touches, or ask rather than guess."""
    text = str(getattr(request, "text", request)).lower()
    hits = [name for name, signals in SUBSYSTEMS.items() if any(s in text for s in signals)]
    if len(hits) != 1:
        return {**UNKNOWN_FALLBACK, "candidates": hits}
    return {
        "subsystem": hits[0],
        "read": f"cli-communication-projection/src/{hits[0]}/index.ts",
        "note": "the subsystem map is inline in SKILL.md; no markdown resource is loaded",
    }
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

### Invariants Each Subsystem Upholds

- **core / fidelity / render** — the canonical original is never mutated; a rejected candidate returns exact-original bytes.
- **privacy / providers** — classification and consent run before ranking; no silent local-to-hosted egress; credentials are references, never values.
- **runtimes / clients** — every path declares full-projection or safe-native; safe-native never suppresses the original before a validated replacement exists.
- **evaluation / observability** — telemetry is content-free with rotating keyed digests; a release needs a human-certified non-inferiority result, never a provisional one.
- **doctor / release** — unknown or stale facts fail closed to original-only; the release gate blocks until every evidence lane passes.

### The Two Presentation Tiers

- **full-projection** — only a client-owned or headless path that owns a complete message AND an atomic render decision may claim a full 1:1 rewrite.
- **safe-native** — a constrained native surface may only append, use a sidecar, or show original-only. It never claims 1:1 parity, and it never suppresses the original before a validated replacement exists.

### The Wording Standard

"Plain English" is not defined in this skill. It is the Human Voice Rules at [`../sk-doc/sk-create-with-human-voice/references/hvr-rules.md`](../sk-doc/sk-create-with-human-voice/references/hvr-rules.md), and the workflow that applies them is the `sk-create-with-human-voice` mode under `sk-doc`. Every rewrite path here routes to that standard instead of carrying a private rubric, so a change to the standard reaches this skill with no edit to a command.

Two parts of the standard are excluded, and a projection that honors them has damaged the message it was carrying:

| Excluded | Why |
|---|---|
| `VOICE PERSONALITY` | It asks for opinions, mixed feeling and controlled imperfection in writing you own. A projection carries someone else's message, so a reaction the original never held is a fidelity failure rather than a voice improvement. |
| The scoring bands of `PRE-PUBLISH CHECKLIST` | Nothing in either lane is a document being published. There is no file, no score and no publish threshold. |

Everything else binds, under the invariants in section 4. Where dropping a banned word would change what the original claimed, the word stays and the claim wins. That precedence is the standard's own, at [`../sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md`](../sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md), which also carries the spans a rewrite may never touch: a quotation, an error string, a command, a path or an identifier.

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
- Never write a voice or tone rubric into a command, an asset or a presentation contract here. The standard has one home and this skill routes to it, so a second copy drifts from the first the moment either is edited.

### ⚠️ ESCALATE IF

- A capability, retention, residency, or protocol-major fact is unknown or stale — fail closed to original-only and surface it.
- A release is requested before the powered blind human non-inferiority study has passed, or before a live credentialed provider smoke exists.

---

## 5. REFERENCES AND RELATED RESOURCES

### Core

- `.opencode/skills/sk-communication/cli-communication-projection/` — the implementation; read `src/<subsystem>/index.ts` for the public surface.
- `.opencode/skills/sk-communication/cli-communication-projection/docs/` — install, configuration, privacy, support-matrix, rollback, and runbook.

### Deep Detail

- `specs/cli-external-orchestration/035-improved-communication/` — the eight-phase design record and frozen invariants; load only for the reasoning behind a rule above.

### Related Skills

- `sk-doc` → `sk-create-with-human-voice`, which owns the Human Voice Rules workflow this skill's rewrites are held to. The standard is at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`, the scope gate at that mode's `references/scope-and-exemptions.md`, and its `scripts/hvr_scan.py` scans a file rather than a live reply, so it audits this skill's own documents and never a projection in flight.
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

- `sk-doc` → `sk-create-with-human-voice` owns the wording standard this skill's rewrites are held to, and section 3 records the two parts of it that a projection excludes.
- `sk-code` builds and verifies integration code against this package.
- `sk-design-md-generator` extracts a measured Style Reference from a live source.
- `sk-git` handles the worktree, commits, and PR when integrating.
