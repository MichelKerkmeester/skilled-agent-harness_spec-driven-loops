---
title: "sk-ai-small-model: Small-Model Optimization Sentinel"
description: "Discovery anchor that surfaces alongside cli-devin / cli-opencode and points operators at executor-owned small-model patterns."
trigger_phrases:
  - "small-model dispatch"
  - "small model patterns"
  - "swe-1.6 patterns"
---

# sk-ai-small-model

A thin sentinel skill that gives operators one discoverable entry point for small-model optimization patterns (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, optional Haiku + Gemini Flash).

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This README explains how to discover, navigate, and contribute to the small-model optimization patterns shipped in the 114-small-ai-model-optimization arc. The skill itself is a routing anchor only — it does not host pattern bodies. Read this README when you want a human-facing overview; read `SKILL.md` for runtime instructions and `references/pattern-index.md` for the canonical index of patterns and their executor owners.

### Usage

1. Open `references/pattern-index.md` to locate the pattern you need.
2. Follow the link to the executor-owned file (`cli-devin/...`, `cli-opencode/...`, `sk-prompt/...`, or `system-spec-kit/...`).
3. Apply the pattern from its canonical location. Do not copy pattern bodies into this skill.
4. When adopting a new provider (Haiku, Gemini Flash), follow the checklist in §4 of `pattern-index.md`.

### Key Statistics

| Metric | Value |
|---|---|
| Version | 0.1.0 |
| Operating modes | 1 (sentinel / discovery anchor) |
| References | 1 (`pattern-index.md`) |
| Assets | 0 (intentional) |
| Scripts | 0 (intentional) |
| Owned patterns | 0 (this skill links; it does not own logic) |
| Linked patterns | 14 across `cli-devin`, `cli-opencode`, `sk-prompt`, `system-spec-kit` |

### How This Compares

| Capability | This Skill | Related Skill |
|---|---|---|
| Hosts small-model patterns | No (links only) | `cli-devin`, `cli-opencode` (host the patterns) |
| Routes via advisor | Yes (via `enhances` edges + trigger phrases) | `cli-devin`, `cli-opencode` (route via their own metadata) |
| Holds runtime code | No | `system-spec-kit/mcp_server/lib/deep-loop/` (TS helpers) |
| Holds the model registry | No (links) | `sk-prompt/assets/model-profiles.json` (canonical) |
| Surfaces on frontier-model dispatch | No (out of scope) | n/a |

### Key Features

| Feature | What It Does |
|---|---|
| Pattern index | Lists every small-model pattern with owner + canonical path + ship status |
| `enhances` edges | Pulls this skill into the advisor's top results alongside `cli-devin` / `cli-opencode` |
| Trigger phrases | Lexical-lane matches for small-model keywords (`swe-1.6`, `kimi`, `deepseek`, `qwen`, etc.) |
| Adoption checklist | Step-by-step protocol for adding Haiku, Gemini Flash, or other small-model providers |
| Ownership boundary table | Clarifies which executor owns which pattern, preventing drift |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Invoke the skill.**

Routing is automatic. Mention any small-model name (`SWE-1.6`, `Kimi-k2.6`, `DeepSeek-v4-pro`, `Qwen3.6`, `Claude Haiku`, `Gemini Flash`) or pattern (`context budget`, `output verification`, `permissions matrix`, `quota fallback`, `model profile`, `tool scoring`) in a prompt and the skill-advisor will surface `sk-ai-small-model` alongside the matching CLI skill.

**Step 2: Read the pattern index.**

```bash
cat .opencode/skills/sk-ai-small-model/references/pattern-index.md
```

Expected result: a table mapping each pattern to its owner skill and canonical path.

**Step 3: Navigate to the canonical pattern.**

Click the link in the index row. Read the executor-owned pattern from there. Do not duplicate it.

**Step 4: Verify before delivery.**

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "dispatch SWE-1.6 to read file" --threshold 0.8
```

Expected result: `sk-ai-small-model` appears in the top-3 with confidence ≥ 0.8.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The sentinel deliberately ships with zero runtime logic. Everything operators need is either in the pattern index or in the executor-owned files the index points to. The skill earns its keep through three properties:

- **Discoverability** — one place to look when you think "small model"; advisor co-surfaces it automatically with the relevant CLI skill.
- **Ownership clarity** — the index makes it obvious which CLI skill or shared asset owns each pattern. Drift is minimized because patterns live with their executor.
- **Adoption ergonomics** — adding a new small-model provider is a documented metadata-first checklist, not a multi-packet effort.

### 3.2 FEATURE REFERENCE

| Feature | Inputs | Output | Primary Resource |
|---|---|---|---|
| Pattern discovery | Pattern name or model name | Path to canonical owner file | [`references/pattern-index.md`](./references/pattern-index.md) |
| Routing co-surfacing | Operator prompt with small-model signals | `sk-ai-small-model` in advisor top-3 | [`graph-metadata.json`](./graph-metadata.json) |
| Provider adoption | New provider name + quota-pool category | Updated registry + index | [`references/pattern-index.md`](./references/pattern-index.md) § 4 |
| Ownership boundary | Pattern type | Which CLI / shared skill owns it | [`references/pattern-index.md`](./references/pattern-index.md) § 3 |
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
sk-ai-small-model/
+-- SKILL.md                          # Runtime instructions + smart router
+-- README.md                         # This file — human-facing overview
+-- description.json                  # Memory-system metadata
+-- graph-metadata.json               # enhances edges + trigger phrases for advisor
`-- references/
    `-- pattern-index.md              # Authoritative pattern index
```

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime entry point loaded by the skill-advisor when the sentinel is surfaced |
| `README.md` | Human-facing overview; read by operators onboarding to the 114 arc |
| `description.json` | Memory-system metadata for spec-kit indexing |
| `graph-metadata.json` | Defines `enhances` edges (cli-devin, cli-opencode at weight 0.5) and lexical trigger phrases |
| `references/pattern-index.md` | The only reference; maps every small-model pattern to its executor-owned location |
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

This skill has no configurable settings. Routing weights are encoded directly in `graph-metadata.json`:

| Setting | Default | Purpose |
|---|---|---|
| `enhances → cli-devin` | weight 0.5 | Co-surface sk-ai-small-model when cli-devin is already high-confidence |
| `enhances → cli-opencode` | weight 0.5 | Co-surface sk-ai-small-model when cli-opencode is already high-confidence |
| Trigger phrases | 19 entries | Lexical-lane matches in the advisor scorer |

Tuning advice:

- If the sentinel surfaces too aggressively on non-small-model prompts, lower edge weights to 0.4 and re-index.
- If it under-surfaces, add more specific trigger phrases (model names + pattern names) and re-index.
- Do not introduce new fields beyond what `graph-metadata.json` already defines; the schema is shared with all other skills.

Non-configurable invariants:

- `SKILL.md` must remain ≤ 200 LOC.
- `references/pattern-index.md` must remain ≤ 100 LOC.
- No `assets/` directory; no `scripts/` directory.
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Operator asks about a specific pattern**

```text
User request: "where is the small-model output verification pattern?"
Skill routing: lexical-lane match on "small-model" + "output verification"
Resources loaded: sk-ai-small-model/references/pattern-index.md
Expected output: link to cli-devin/references/output-verification.md, marked shipped via Phase 004
```

**Dispatch surfaces the sentinel automatically**

```text
User request: "use cli-devin for SWE-1.6 code review with output verification"
Skill routing: cli-devin scores high → enhances edge surfaces sk-ai-small-model
Resources loaded: cli-devin/SKILL.md + sk-ai-small-model/SKILL.md + sk-ai-small-model/references/pattern-index.md
Expected output: operator sees both the executor instructions and the pattern index in one advisor brief
```

**Adopting Claude Haiku**

```text
User request: "I'm adding Claude Haiku to the rotation. What do I update?"
Skill routing: lexical-lane match on "haiku"
Resources loaded: sk-ai-small-model/references/pattern-index.md § 4 (Adopting a New Provider)
Expected output: 6-step checklist — populate registry stub, optionally set fallback_target on source models, add trigger phrases, mark index rows shipped, re-index advisor, verify routing
```

**Pattern moves to a new path**

```text
User request: "I refactored cli-devin/references/context-budget.md to a new location. What needs updating?"
Skill routing: lexical-lane match on "context-budget"
Resources loaded: sk-ai-small-model/references/pattern-index.md § 5 (Staleness Policy)
Expected output: update the row's path; if file removed instead, replace path with "(deprecated)" + one-line reason
```
<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `sk-ai-small-model` not surfacing on small-model prompts | Trigger phrases stale or advisor not re-indexed | Run `skill_advisor.py --force-refresh`; verify with a sample prompt |
| Surfaces on TypeScript review or non-small-model prompts | Trigger phrases too broad | Tighten phrases in `graph-metadata.json`; re-index |
| Index points at a missing file | Downstream phase removed or renamed without updating index | Update the row's path or mark `(deprecated)` per § 5 of `pattern-index.md` |
| Operator can't find a pattern they expect to exist | Phase has not shipped yet | Check the "Shipped In" column in the index; if missing, the phase is still pending |
| `SKILL.md` exceeds 200 LOC after an edit | Real pattern logic crept in | Move the logic to the executor skill; revert this skill to link-only content |
| Advisor confidence < 0.8 on clear small-model prompts | Edge weights or trigger weights too low | Inspect `graph-metadata.json` weights; raise from 0.5 to 0.6 if needed |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why is this skill so thin?**

A: Per the 114 research synthesis (HYBRID-with-Anchor verdict, iter 14), the patterns themselves are runtime-specific to their executor. Duplicating them in a generic skill would rot quickly. The sentinel exists for *discovery*, not for hosting logic.

**Q: Why no `assets/` or `scripts/`?**

A: There's nothing to put in them. All operational assets live with the executor that runs them (`cli-devin/assets/`, `cli-opencode/assets/`, etc.). Adding empty directories would imply this skill grows real content over time, which is explicitly out of scope.

**Q: How do I add a new pattern?**

A: Don't add it here. Add it to the executor that runs it, then add a row to `references/pattern-index.md` pointing at the new location.

**Q: How do I add a new small-model provider?**

A: Follow the 6-step checklist in `references/pattern-index.md` § 4. Metadata-first; no code edits required when the provider fits an existing quota-pool category.

**Q: Are frontier models supported?**

A: No. The 114 arc explicitly scopes to small models. Opus, Sonnet, gpt-5.5, and GLM-5.1 are out of scope. Quota fallback is pool-aware, not tier-based.

**Q: What if a pattern needs to live in both cli-devin and cli-opencode?**

A: Ship the body in the primary executor and add a sentinel-style mirror (link-only, ≤ 200 LOC) in the secondary. Phase 006's `cli-opencode/references/context-budget.md` is the canonical example.

**Q: Where's the CI check that catches stale index rows?**

A: There isn't one. Phase 007 (hardening CI) was deleted 2026-05-18 per user direction. Staleness is caught via PR review when patterns move; see `pattern-index.md` § 5 for the policy.
<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, smart-router metadata, and rules for keeping the sentinel thin |
| [`references/pattern-index.md`](./references/pattern-index.md) | Authoritative index of small-model patterns + owners + ship status |
| [`graph-metadata.json`](./graph-metadata.json) | `enhances` edges and trigger phrases consumed by the advisor |
| [`description.json`](./description.json) | Spec-kit memory metadata |
| [`../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/spec.md`](../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/spec.md) | Phase parent with the full roadmap |
| [`../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/research.md`](../../../specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/research.md) | Research synthesis (HYBRID-with-Anchor verdict in §RQ5) |
| [`../cli-devin/SKILL.md`](../cli-devin/SKILL.md) | SWE-1.6 dispatch surface — owns budget, verification, fallback patterns |
| [`../cli-opencode/SKILL.md`](../cli-opencode/SKILL.md) | DeepSeek / Kimi / Qwen dispatch surface — owns permissions matrix, budget propagation |
| [`../sk-prompt/SKILL.md`](../sk-prompt/SKILL.md) | Cross-CLI prompt quality + model registry owner |
| [`../system-spec-kit/SKILL.md`](../system-spec-kit/SKILL.md) | Runtime helpers (bayesian-scorer.ts, fallback-router.ts, permissions-gate.ts) |
<!-- /ANCHOR:related-documents -->
