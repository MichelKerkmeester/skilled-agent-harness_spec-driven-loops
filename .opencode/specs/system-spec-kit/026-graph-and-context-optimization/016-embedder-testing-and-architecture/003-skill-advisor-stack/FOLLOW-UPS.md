---
title: "Follow-Ups: 003-skill-advisor-stack"
description: "Five concrete follow-ups surfaced by the consolidated changelog for the skill-advisor embedder parity work. Each entry names what stalled or remained open, why it matters and the next concrete action."
trigger_phrases:
  - "003-skill-advisor-stack follow-ups"
  - "skill-advisor follow-ups"
  - "skill-advisor remaining work"
importance_tier: "normal"
contextType: "implementation"
---

# Follow-Ups: 003-skill-advisor-stack

> Five open follow-ups surfaced by the consolidated [CHANGELOG.md](./CHANGELOG.md). Read the changelog for shipped work. Read this for what remains.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/`

---

## 1. Phase 006 – shared embedder logic with spec-memory has not shipped

**What happened:** Phase 006 is a scaffold only. Spec.md, plan.md and tasks.md exist but no implementation has landed. The packet plans to extract a shared embedder factory between mk-spec-memory and skill-advisor and align skill-advisor's active default to spec-memory's nomic-embed-text-v1.5 choice.

**Why it matters:** Today skill-advisor and mk-spec-memory have separate embedder registries with competing defaults (gemma versus nomic) and duplicated `mcp_server/lib/embedders/` code. The same input can produce different embeddings depending on which skill encoded it. A shared factory removes the drift and reduces maintenance overhead from two registries.

**Concrete next action:** Pick a session to execute the extract-and-align work. Suggested steps: (a) identify the shared subset of code (adapter interface, manifest schema, Ollama adapter, all byte-identical or near-identical), (b) move them to `.opencode/skills/system-spec-kit/shared/embeddings/` or similar, (c) update both skills to import from the shared location, (d) flip skill-advisor's `setActiveEmbedder` default to nomic, (e) reindex `skill-graph.sqlite` with nomic and verify semantic-shadow scoring still returns sane top-3 picks for "memory save", "code search" and "spec folder" probes.

---

## 2. Production active pointer still on gemma

**What happened:** Phases 001 through 004 shipped the infrastructure (pluggable layer, operator runbook, INSTALL_GUIDE docs, writer cross-wire). No one has executed the phase 002 runbook against a real environment. The skill-advisor active pointer is still `embeddinggemma-300m`.

**Why it matters:** The whole architecture exists to make the embedder swappable. Until an operator actually runs the swap against a production environment, the value proposition is theoretical. The runbook is now safe to execute (phase 004 closed the writer/reader asymmetry that originally blocked it).

**Concrete next action:** Run the operator runbook at `002-jina-swap-and-reindex/evidence/swap-runbook.md` against a target environment. Choose nomic-embed-text-v1.5 (the mk-spec-memory choice) rather than jina-v3 to converge with the sibling default or pick whichever model the operator wants to evaluate first. Capture before-and-after semantic-shadow probe latencies and top-3 recommendations for at least three queries. Update the runbook with the actual execution log if anything diverged from the documented steps.

---

## 3. Legacy `skill_nodes.embedding` BLOB column not removed

**What happened:** Phase 004 made the writer dispatch on whether an active pointer is set. When set, writes go to `vec_<dim>`. When unset, writes go to the legacy `skill_nodes.embedding` BLOB (binary-large-object) column. This preserves backward compatibility for installations without an active pointer.

**Why it matters:** The legacy column carries dead weight once every installation has migrated. SQLite BLOB columns inflate database size and slow row scans even when the data is never read. A future cleanup packet should drop the column once all consumers move to the dim-tagged tables.

**Concrete next action:** Wait until the production active pointer has been set in every shipped environment (follow-up #2 is the gate). Then write a one-shot migration: `ALTER TABLE skill_nodes DROP COLUMN embedding` plus a `VACUUM` to reclaim the space. Bump the schema version. Add a vitest that confirms the column does not exist after the migration. Mark `refreshSkillEmbeddingsLegacy()` as `@deprecated` ahead of the migration so any new consumers get a typecheck warning.

---

## 4. Documentation parity with mk-spec-memory

**What happened:** Phase 003 documented 6 registered embedders in INSTALL_GUIDE section 12 (`embeddinggemma-300m`, `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `jina-embeddings-v2-base-code`, `mxbai-embed-large-v1`, `bge-m3`). The mk-spec-memory equivalent ships 8 registered embedders per its own registry.

**Why it matters:** Today the two skills support overlapping but not identical sets. An operator who picks an embedder for one system may try to set it on the other and get an unknown-manifest error. The docs do not call out the difference, which makes the divergence look like an inconsistency rather than a known boundary.

**Concrete next action:** Either (a) extend skill-advisor's registry to match the 8-embedder set from mk-spec-memory (preferred, gives operators one mental model) or (b) explicitly document the divergence in both INSTALL_GUIDEs with a compatibility matrix. Option (a) lines up with follow-up #1 (shared factory). Once the shared registry lands, both skills support the same 8 by definition. Treat (b) as a holding pattern until phase 006 ships.

---

## 5. Numerical-claim audit cadence

**What happened:** Phase 003 caught one doc-versus-code drift by truth-checking against source: the install guide mentioned an env-var swap mechanism that did not exist in the code. The actual swap surface is `setActiveEmbedder(db, name, dim)`, a database helper. Phase 003 fixed this and added explicit scar tissue ("no env var, no MCP tool") so it does not regrow.

**Why it matters:** Numerical claims and surface-name claims rot. Today's 6-manifest table will be wrong the moment phase 006 ships the shared registry. Today's `DEFAULT_ACTIVE_EMBEDDER` value will be wrong the moment follow-up #2 flips the active pointer. Without a periodic audit the drift compounds silently.

**Concrete next action:** Add a small CI job or a quarterly manual sweep that diffs INSTALL_GUIDE section 12's claim list against the live `registry.ts` and `schema.ts`. Three diffs to check on each pass: (a) the manifest count and names, (b) the `DEFAULT_ACTIVE_EMBEDDER` value, (c) the `setActiveEmbedder()` signature. Anything that does not match becomes a 5-minute doc-fix task.
