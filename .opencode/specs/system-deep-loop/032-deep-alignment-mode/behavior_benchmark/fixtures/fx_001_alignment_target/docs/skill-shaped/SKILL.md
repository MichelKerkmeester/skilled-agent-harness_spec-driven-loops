---
name: fixture-corpus-guide
description: Illustrative skill doc bundled in the fx_001_alignment_target fixture; documents how the fixture's own docs corpus should be read by a sk-doc conformance audit.
allowed-tools: Read
---

# Fixture Corpus Guide - Illustrative Skill Shape

A small, illustrative SKILL.md used as fixture data, not a real routable skill.

---

## 1. WHEN TO USE

Use this document as a stand-in whenever the `fx_001_alignment_target` fixture needs one artifact classified as `skill` (by exact `SKILL.md` filename match) instead of `reference`, `readme`, or `asset`. It never dispatches, has no `mode-registry.json` entry, and is not wired into any skill router — it exists only so the fixture's `docs/` corpus carries a real skill-shaped conformance gap alongside its reference- and readme-shaped ones.

---

## 2. SMART ROUTING

There is no routing here — this file does not dispatch to a mode packet, and no advisor entry points at it. A real `SKILL.md` would describe how requests land here; this one only needs to exist in the shape a real one would take, so the fixture's structural gap is genuine rather than staged.

---

## 3. HOW IT WORKS

The only "mechanism" this document has is being present, correctly classified, and missing one required section on purpose. The authority's real validator classifies it as `skill` from the exact filename, then checks it against the `skill` document type's required-section list.
