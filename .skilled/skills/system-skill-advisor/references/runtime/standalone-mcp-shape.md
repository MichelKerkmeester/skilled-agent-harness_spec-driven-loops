---
title: "Standalone Advisor Shape"
description: "Summary of ADR-001 standalone system-skill-advisor topology and migration boundary."
trigger_phrases:
  - "standalone advisor shape"
  - "system_skill_advisor topology"
  - "advisor standalone boundary"
importance_tier: "normal"
contextType: "implementation"
version: 0.8.0.3
---

# Standalone Advisor Shape

Summary of ADR-001 standalone system-skill-advisor topology and migration boundary.

---

## 1. OVERVIEW

### Purpose

Documents the standalone `system_skill_advisor` topology chosen by ADR-001 (its MCP transport later superseded by the CLI front door) and the ownership boundary between advisor routing and adjacent Spec Kit runtimes.

### When to Use

- Confirming which package owns advisor commands, schemas, handlers, scorer code, and skill-graph persistence.
- Checking whether a proposed cleanup crosses from documentation/navigation into runtime migration.
- Explaining why memory and advisor processes must not share database write ownership.

### Core Principle

Advisor routing is a standalone process boundary (the daemon behind the CLI front door); documentation can point across packages, but runtime ownership stays inside `system-skill-advisor`.

### Key Sources

- `runtime/advisor-server.ts`
- [`legacy-tool-bridge.md`](./legacy-tool-bridge.md)
- [`tool-ids-reference.md`](./tool-ids-reference.md)

---

## 2. DECISION

ADR-001 chose a standalone MCP server named `system_skill_advisor`; ADR-005 supersedes the transport, so the CLI front door over the `runtime/` daemon is now the only surface.

The standalone package owns:

- Advisor command descriptors.
- Zod input/output schemas.
- Tool handlers.
- Scorer and projection code.
- Skill graph database path resolution.
- Advisor tests, fixtures, playbook and feature catalog.

---

## 3. BOUNDARY

The standalone boundary is a process boundary, not only a folder move.

```text
system_skill_advisor -> advisor tools and skill graph DB
```

No other runtime owns advisor implementation modules or advisor database writes. Any bridge that proxies legacy `advisor_*` calls is a migration convenience, never the owner.

---

## 4. CHILD PACKET OWNERSHIP

| Packet | Responsibility |
|---|---|
| 002 | Envelope only |
| 003 | Source, tests, DB path move |
| 004 | Launcher and runtime config |
| 005 | Hooks and consumer cutover |
| 006 | Cleanup and bridge removal |
