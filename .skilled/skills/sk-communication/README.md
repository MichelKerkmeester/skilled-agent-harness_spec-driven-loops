---
title: sk-communication
description: Human-facing guide to the sk-communication skill: a projection lane that rewrites terse agent output into plain English byte-safely, and an explanation lane that renders a topic or the prior reply as the smallest visual at a chosen depth.
trigger_phrases:
  - "sk-communication readme"
  - "communication projection skill guide"
importance_tier: normal
contextType: general
version: 1.2.0.8
---

# sk-communication

Make supported CLI and agent output read like careful plain English without ever changing the underlying data: and, when words are the wrong medium, explain it as a picture instead.

## At a glance

| Field | Value |
|-------|-------|
| Kind | Standalone skill (class S) |
| Wraps | `.opencode/skills/sk-communication/cli-communication-projection/` |
| Routes on | Hand-invoked only; held off advisor routing by design |
| Lane | Projection: a byte-safe rewrite of output that already exists |
| Entry point | [SKILL.md](SKILL.md) |
| Verify | `npm run check` in the package |

---

## 1. OVERVIEW

Coding CLIs often emit terse, robotic status text. The communication-projection package rewrites it into readable prose behind privacy-first provider routing, while leaving the canonical event stream, transcript, tool data, and model context byte-for-byte unchanged. Anything unsafe or failed returns the exact original.

This skill is the entry point. It does not duplicate the code: it routes a request to the right subsystem and enforces the load-bearing invariants. The runtime contract lives in [SKILL.md](SKILL.md); the subsystem map is inline in [SKILL.md](SKILL.md); the visual rubrics live in [references/visual-explanation.md](references/visual-explanation.md).

---

## 2. WHEN TO REACH FOR IT

The skill is held off advisor routing on purpose, so you invoke it by hand.

**What it covers**

- "rewrite this CLI output to plain English"
- "wire up the projection layer for Codex / Pi / OpenCode / Devin / Cursor"
- "route rewriting to a local model, keep my text private"
- "which tier is this runtime, full projection or safe native?"

For what it deliberately does **not** cover (general code, docs, design, git), see the "When NOT to Use" section of [SKILL.md](SKILL.md).

---

## 3. QUICK START

```bash
# 1. Read the routing contract and the subsystem map (both live in SKILL.md)
#    .opencode/skills/sk-communication/SKILL.md

# 2. Integrate against the package's subpath exports, then run the gate
cd .opencode/skills/sk-communication/cli-communication-projection
npm run check   # typecheck + build + tests + import smoke
```

- Privacy classification and egress consent run before any cost, quality, or latency ranking.
- Any unsupported, unsafe, or failed path returns the exact original bytes.
- Every runtime path declares full-projection or safe-native, and the two never mix in a 1:1 parity claim.
- Telemetry is content-free; a release requires a human-certified non-inferiority result, never a provisional one.

---

## 5. PACKAGE MAP AND DEEPER DOCS

- [feature-catalog/feature-catalog.md](feature-catalog/feature-catalog.md): the current shipped-behavior inventory.
- [manual-testing-playbook/manual-testing-playbook.md](manual-testing-playbook/manual-testing-playbook.md): deterministic operator validation scenarios.
- `.opencode/skills/sk-communication/cli-communication-projection/docs/`: install, configuration, privacy, support-matrix, rollback, and runbook.

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
