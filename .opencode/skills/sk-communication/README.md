---
title: sk-communication
description: Human-facing guide to the sk-communication skill: a projection lane that rewrites terse agent output into plain English byte-safely, and an explanation lane that renders a topic or the prior reply as the smallest visual at a chosen depth.
trigger_phrases:
  - "sk-communication readme"
  - "communication projection skill guide"
  - "explain visually skill guide"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# sk-communication

Make supported CLI and agent output read like careful plain English without ever changing the underlying data — and, when words are the wrong medium, explain it as a picture instead.

## At a glance

| Field | Value |
|-------|-------|
| Kind | Standalone skill (class S) |
| Wraps | `.opencode/skills/sk-communication/cli-communication-projection/` |
| Routes on | Hand-invoked only; held off advisor routing by design |
| Lanes | A: projection (byte-safe rewrite) · B: explanation (visual, depth-calibrated) |
| Entry point | [SKILL.md](SKILL.md) |
| Verify | `npm run check` in the package |

---

## 1. OVERVIEW

Coding CLIs often emit terse, robotic status text. The communication-projection package rewrites it into readable prose behind privacy-first provider routing, while leaving the canonical event stream, transcript, tool data, and model context byte-for-byte unchanged. Anything unsafe or failed returns the exact original.

That is Lane A. Lane B answers a different failure: sometimes the problem is not that the words are dense, it is that words are the wrong medium, or that the reader lacks the background the text assumes. Lane B explains a topic — or the previous reply — as the smallest visual that answers the question, at a depth you choose. It runs in-context, reaches no model, and writes nothing unless you ask for an artifact.

This skill is the entry point for both. It does not duplicate the code — it routes a request to the right lane and enforces the load-bearing invariants. The runtime contract lives in [SKILL.md](SKILL.md); the subsystem-to-path detail lives in [references/package-map.md](references/package-map.md); the visual rubrics live in [references/visual-explanation.md](references/visual-explanation.md).

---

## 2. WHEN TO REACH FOR IT

The skill is held off advisor routing on purpose, so you invoke it by hand.

**Lane A — projection**

- "rewrite this CLI output to plain English"
- "wire up the projection layer for Codex / Pi / OpenCode / Devin / Cursor"
- "route rewriting to a local model, keep my text private"
- "which tier is this runtime — full projection or safe native?"

**Lane B — explanation**

- "draw me the control flow through this dispatch path"
- "show that as a file tree, not a paragraph"
- "explain what just happened like I know nothing about this codebase"
- "diagram what changed between these two states"

For what it deliberately does **not** cover (general code, docs, design, git), see the "When NOT to Use" section of [SKILL.md](SKILL.md).

---

## 3. QUICK START

```bash
# 1. Read the routing contract and the subsystem map
#    .opencode/skills/sk-communication/SKILL.md
#    .opencode/skills/sk-communication/references/package-map.md

# 2. Integrate against the package's subpath exports, then run the gate
cd .opencode/skills/sk-communication/cli-communication-projection
npm run check   # typecheck + build + tests + import smoke
```

Lane B needs none of that. It is a prompt contract, not a package:

```bash
/rewrite:explain-visually                                  # re-render the last reply as a visual
/rewrite:explain-visually --depth=novice how worktrees work  # explain a topic from zero
/rewrite:explain-visually --artifact the dispatch pipeline   # also write a standalone HTML file
```

Consume the package through its subpath exports — `@portable-cli/communication-projection`, plus `./contracts`, `./versioning`, `./providers`, `./privacy`, `./runtimes`, `./evaluation`, `./observability`, `./doctor`, and `./release`.

---

## 4. INVARIANTS THIS SKILL ENFORCES

- Canonical transcripts, events, tool data, and model context stay byte-for-byte unchanged.
- Privacy classification and egress consent run before any cost, quality, or latency ranking.
- Any unsupported, unsafe, or failed path returns the exact original bytes.
- Every runtime path declares full-projection or safe-native, and the two never mix in a 1:1 parity claim.
- Telemetry is content-free; a release requires a human-certified non-inferiority result, never a provisional one.
- Lane B simplifies words, never facts: depth changes vocabulary and framing, never a value, an identifier, a path, or the truth of a claim.
- Lane B is display-only unless `--artifact` is passed, and even then it creates a new file rather than editing an existing one.
- Lane A's enablement flag and egress rules do not apply to Lane B, which synthesizes in-context and carries neither risk.

---

## 5. PACKAGE MAP AND DEEPER DOCS

- [references/package-map.md](references/package-map.md) — subsystem-to-path map and public entry points.
- [references/visual-explanation.md](references/visual-explanation.md) — Lane B: modality table, depth rubric, protected spans, lane boundary.
- [feature-catalog/feature-catalog.md](feature-catalog/feature-catalog.md) — the current shipped-behavior inventory.
- [manual-testing-playbook/manual-testing-playbook.md](manual-testing-playbook/manual-testing-playbook.md) — deterministic operator validation scenarios.
- `.opencode/skills/sk-communication/cli-communication-projection/docs/` — install, configuration, privacy, support-matrix, rollback, and runbook.

---

## 6. VERIFICATION

```bash
# skill conformance
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-communication --strict

# package gate
cd .opencode/skills/sk-communication/cli-communication-projection && npm run check
```

- `validate_skill_package.py --strict` passes.
- `ci-skill-root-metadata` reports the class-S root clean.
- The advisor recommends this skill as the top match for a projection prompt.
