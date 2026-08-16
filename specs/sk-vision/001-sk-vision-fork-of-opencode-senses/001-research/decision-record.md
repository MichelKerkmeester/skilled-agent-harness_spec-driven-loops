---
title: "Decision Record: sk-vision housing, fork baseline, and host adapters"
description: "Accepted architecture choices for the OpenCode Senses fork into sk-vision with OpenCode and Pi support."
trigger_phrases:
  - "sk-vision ADR"
  - "senses fork decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/001-research"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Accepted four research ADRs."
    next_safe_action: "Implement 002-skill-scaffold from these ADRs."
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone skill, shipped v0.2.0 fork, Pi registerTool, MIT rebrand."
---
# Decision Record: sk-vision 001 research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Standalone skill contains the runtime package

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | cursor-grok, operator (plan approval) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to choose where sk-vision lives: a standalone advisor skill, a parent hub with OpenCode and Pi packets, or a spec-only note with code elsewhere. Wrong class metadata fails `ci-skill-root-metadata`.

### Constraints

- Skill-root class S forbids `description.json`, `mode-registry.json`, and `hub-router.json`
- Class H requires those hub files and nested packets
- `sk-communication` already proves package-inside-standalone-skill
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a standalone skill `.opencode/skills/sk-vision/` (class S) that contains the forked runtime package and thin host adapters.

**How it works**: later children add `SKILL.md`, `graph-metadata.json`, and `leaf-manifest.config.json`. OpenCode and Pi adapters live beside the core, not as separate advisor identities.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone skill + in-skill package** | One advisor identity; matches sk-communication | Skill tree holds Python/TS runtime | 9/10 |
| Parent hub with OpenCode/Pi packets | Per-host routing | Two identities for one runtime | 4/10 |
| Spec docs only, code outside skills | Smaller skill | Breaks "housed in a sk-skill" | 3/10 |

**Why this one**: One vision capability, one advisor identity, adapters are hosts not workflows.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Advisor can route "screenshot OCR" to one skill
- Shared runtime cannot drift between hosts

**What it costs**:
- Skill directory carries a real package. Mitigation: isolate code under a package subfolder like `sk-communication`

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental hub metadata | H | Follow class S matrix in skill-root-metadata-contract.md |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User asked the vision to live in an sk-skill |
| 2 | **Beyond Local Maxima?** | PASS | Hub and spec-only options scored |
| 3 | **Sufficient?** | PASS | One skill, no extra hub router |
| 4 | **Fits Goal?** | PASS | Dual-host adapters stay inside one package |
| 5 | **Open Horizons?** | PASS | A later hub remains possible if hosts diverge |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Later child `002-skill-scaffold` creates `.opencode/skills/sk-vision/`
- No hub files at the skill root

**How to roll back**: delete the skill directory; parent spec stays
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Fork shipped Senses v0.2.0, not PLAN.md

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | cursor-grok |

---

<!-- ANCHOR:adr-002-context -->
### Context

`../context/PLAN.md` describes Moondream 3.1, audio, video, documents, and an evidence graph. Shipped `package.json` is 0.2.0 with default `moondream2` and image-only tools. Forking the design document would invent unbuilt work.

### Constraints

- Dump is the only local source
- First useful product is screenshot/OCR/detect for coding models
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: fork the shipped TypeScript plugin plus `python/runtime.py` image pipeline.

**How it works**: later runtime child copies `src/` and `python/`, rebrands, and ignores PLAN.md phases 2-4 until a new spec asks for them.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shipped v0.2.0** | Real code, tests, 13 tools | No audio/docs | 9/10 |
| PLAN.md MVP | Richer vision | Unbuilt; months of work | 3/10 |

**Why this one**: Evidence over captions already ships; extra modalities are a later packet.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Implementers have a working JSON-RPC contract on day one

**What it costs**:
- Audio/video/docs stay out. Mitigation: parent out-of-scope list

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operators expect PLAN.md Moondream 3.1 default | M | Document `moondream2` default in skill README later |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Need a real fork baseline |
| 2 | **Beyond Local Maxima?** | PASS | PLAN.md considered |
| 3 | **Sufficient?** | PASS | Image tools cover the stated use |
| 4 | **Fits Goal?** | PASS | Dual-host vision for coding |
| 5 | **Open Horizons?** | PASS | PLAN.md remains a future backlog |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `003-runtime-fork` copies shipped sources from `context/`

**How to roll back**: do not copy PLAN.md features into the skill
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Pi adapter uses registerTool and native images

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | cursor-grok |

---

<!-- ANCHOR:adr-003-context -->
### Context

OpenCode Senses registers 13 tools via `@opencode-ai/plugin` `tool()` and auto-inspects on `chat.message`. Pi has a different plugin surface. We needed the strongest native equivalent.

### Constraints

- Installed Pi is `@earendil-works/pi-coding-agent` 0.84.2
- This repo already loads `.pi/extensions/*.ts` via `ExtensionFactory`
- Pi built-in tools are only read/bash/edit/write/grep/find/ls
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: a Pi extension that calls `pi.registerTool()` for vision tools and, when `InputEvent.images` is present, may transform input with a bounded auto-inspect.

**How it works**: the extension spawns the same JSON-RPC Python runtime as OpenCode. Tools take `path` or inline image data. Auto-inspect must not wait for the full GPU run (mirror Senses 2s grace).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **registerTool + input.images** | First-party tools; native images | Must write a Pi extension | 9/10 |
| MCP wrapper | Third host | Extra process; Pi MCP is a package | 5/10 |
| bash CLI via Pi `bash` | No extension | No schema, worse UX | 4/10 |
| Pi-native SKILL.md only | Cheap | No tools | 2/10 |

**Why this one**: Live types confirm `registerTool` and `images?: ImageContent[]` on `input` and `before_agent_start`.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Pi models get named vision tools instead of ad-hoc bash
- Image paste is a typed event, not a guessed TUI feature

**What it costs**:
- Invalid extension exports fail the whole Pi session. Mitigation: keep factory valid; fail-open inside tool execute

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auto-inspect blocks submit | H | Bounded wait; path tools remain |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User required CLI Pi support |
| 2 | **Beyond Local Maxima?** | PASS | Four Pi paths ranked |
| 3 | **Sufficient?** | PASS | Same core, thin adapter |
| 4 | **Fits Goal?** | PASS | Parity with OpenCode tools |
| 5 | **Open Horizons?** | PASS | MCP remains a later host |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Later `005-pi-adapter` adds `.pi/extensions/sk-vision.ts` (symlink from the skill)
- Tool names should be `sk_vision_*` (or `senses_*` kept as alias — decide at implement)

**How to roll back**: remove the extension file; Pi starts without vision tools
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: MIT rebrand of package, env, and cache names

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | cursor-grok |

---

<!-- ANCHOR:adr-004-context -->
### Context

Upstream is MIT, copyright Adarsh Gourab Mahalik 2026. Shipping as `opencode-senses` would collide with npm and imply we are the upstream project.

### Constraints

- MIT requires copyright notice retained
- Cache currently `~/.cache/opencode-senses`
- Env prefix `SENSES_*`
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: rebrand to `sk-vision` for package, env (`SK_VISION_*`), and cache (`~/.cache/sk-vision`), keep the MIT notice, add this project's copyright for modifications.

**How it works**: the runtime child rewrites identifiers; evidence tags become `<SK-VISION>` (or a stable envelope documented in that child). Do not publish as `opencode-senses`.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **sk-vision rebrand** | Clear ownership | Migration from Senses env names | 9/10 |
| Keep SENSES_* names | Less churn | Confusing in this repo | 4/10 |
| Publish as opencode-senses | Familiar | Impersonates upstream | 1/10 |

**Why this one**: MIT allows the fork; the name must not collide with upstream npm.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Operators can install both upstream Senses and sk-vision without cache clashes

**What it costs**:
- Docs must mention `SK_VISION_PYTHON` not `SENSES_PYTHON`. Mitigation: mapping table in later README

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing copyright notice | H | Copy LICENSE and keep Adarsh line |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fork must be legally and nominally distinct |
| 2 | **Beyond Local Maxima?** | PASS | Keep-names and impersonation rejected |
| 3 | **Sufficient?** | PASS | Rename + LICENSE retain |
| 4 | **Fits Goal?** | PASS | First-party skill identity |
| 5 | **Open Horizons?** | PASS | Upstream Senses can still be used |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `003-runtime-fork` rewrites env, cache, package name, evidence tags

**How to roll back**: keep using the dump under `context/` without copying it into the skill
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
