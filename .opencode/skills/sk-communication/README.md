---
title: sk-communication
description: Human-facing guide to the sk-communication skill, which surfaces the portable CLI communication-projection package that rewrites terse agent output into plain English while keeping canonical bytes unchanged.
trigger_phrases:
  - "sk-communication readme"
  - "communication projection skill guide"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# sk-communication

Make supported CLI and agent output read like careful plain English, without ever changing the underlying data.

## At a glance

| Field | Value |
|-------|-------|
| Kind | Standalone skill (class S) |
| Wraps | `.opencode/skills/sk-communication/cli-communication-projection/` |
| Routes on | "make CLI output readable", "claudish to english", "privacy-first rewrite", presentation tiers |
| Entry point | [SKILL.md](SKILL.md) |
| Verify | `npm run check` in the package |

---

## 1. OVERVIEW

Coding CLIs often emit terse, robotic status text. The communication-projection package rewrites it into readable prose behind privacy-first provider routing, while leaving the canonical event stream, transcript, tool data, and model context byte-for-byte unchanged. Anything unsafe or failed returns the exact original.

This skill is the advisor-routable entry point. It does not duplicate the code — it routes a request to the right subsystem and enforces the load-bearing invariants. The runtime contract lives in [SKILL.md](SKILL.md); the subsystem-to-path detail lives in [references/package-map.md](references/package-map.md).

---

## 2. WHEN THE ADVISOR PICKS THIS SKILL

Ask for a projection task and the skill advisor loads this skill:

- "rewrite this CLI output to plain English"
- "wire up the projection layer for Codex / Pi / OpenCode / Devin / Cursor"
- "route rewriting to a local model, keep my text private"
- "which tier is this runtime — full projection or safe native?"

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

Consume the package through its subpath exports — `@portable-cli/communication-projection`, plus `./contracts`, `./versioning`, `./providers`, `./privacy`, `./runtimes`, `./evaluation`, `./observability`, `./doctor`, and `./release`.

---

## 4. INVARIANTS THIS SKILL ENFORCES

- Canonical transcripts, events, tool data, and model context stay byte-for-byte unchanged.
- Privacy classification and egress consent run before any cost, quality, or latency ranking.
- Any unsupported, unsafe, or failed path returns the exact original bytes.
- Every runtime path declares full-projection or safe-native, and the two never mix in a 1:1 parity claim.
- Telemetry is content-free; a release requires a human-certified non-inferiority result, never a provisional one.

---

## 5. PACKAGE MAP AND DEEPER DOCS

- [references/package-map.md](references/package-map.md) — subsystem-to-path map and public entry points.
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
