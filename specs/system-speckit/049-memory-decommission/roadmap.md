---
title: "Roadmap: Memory DB Decommission"
description: "Level-agnostic forward plan for near-term, next-step and later work."
trigger_phrases:
  - "roadmap"
  - "forward plan"
  - "now next later"
  - "memory decommission milestones"
importance_tier: "normal"
contextType: "general"
---
# Roadmap: Memory DB Decommission

<!-- SPECKIT_TEMPLATE_SOURCE: roadmap | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Plans the removal of the system-spec-memory subsystem from research through build, on branch branches/017-memory-decommission, until the packet's seven completion criteria hold.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** specs/system-speckit/049-memory-decommission
**Status:** Active
**Horizon:** research complete 2026-09-02; build phases 001 to 004 in strict order
**Owner:** operator, executed by the orchestrate agent
**Last updated:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** Done. Focus: evidence before build. Two five-iteration deep-research phases ran, 005 on ripgrep-first retrieval and 006 on the legacy surface inventory, and their findings are folded into the four build phases. The runtime defects they surfaced are fixed in system-deep-loop packet 040. Exit signal: the packet validates recursively with zero errors and every phase carries a goal document, which holds as of 2026-09-02.

**Next:** Planned. Focus: phase 001, the trigger index and ripgrep contract, built alongside the live server so the three-arm parity harness can compare both. Exit signal: two-way parity with zero unexplained differences, byte-identical regeneration, fresh-process p95 and max under 200ms, and Gate 1 answering with the daemon stopped.

**Later:** Planned. Focus: phase 002 rewires every consumer and splits the shared seams, phase 003 deletes the server and its registrations while the preserve set survives, phase 004 writes and enforces the grep convention and retrofits the active corpus. Exit signal: the residue sweep is empty, no runtime declares the server, every session boots daemon-free, and the retrofit rescan reports no residue.
<!-- /ANCHOR:now-next-later -->

---

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

**Research folded in:** phase Now, target 2026-09-02. Status: Done. Evidence: commit 6102eb9d2e; 005 and 006 syntheses under their research/lineages/luna-max directories.

**Runtime defects fixed:** phase Now, target 2026-09-02. Status: Done. Evidence: specs/system-deep-loop/040-cli-lineage-nesting-and-containment-guard, commits 2c2687e260 and 54e65e115a, whole suite 2531 passed.

**Parity proven:** phase Next, target the 001 acceptance rows AC-001 to AC-008 Met. Status: Planned. Evidence: parity-check baseline and latency report committed under phase 001.

**Consumers rewired:** phase Later, target the 002 residue sweep empty outside the mcp-server tree. Status: Planned. Evidence: sweep output and the owner-by-owner reconciliation.

**Server removed:** phase Later, target every runtime boots with no daemon and the advisor embedder still resolves. Status: Planned. Evidence: five config roots inspected, clean session boot per runtime.

**Corpus retrofitted:** phase Later, target zero residue and unchanged body preimages across the active corpus. Status: Planned. Evidence: retrofit rescan and preimage manifest.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Live server during phase 001:** needed by the parity harness, owner phase 001. Status: Ready. Risk and mitigation: the daemon flaps, so an unavailable live arm is blocked, not green, and a captured baseline with availability metadata stands in.

**Continuity writer decision:** needed by phase 002 and consumed by phase 004, owner phase 002. Status: Open. Risk and mitigation: a read-only index cannot write frontmatter, so the writer is a P0 requirement with atomic same-directory semantics named before any rewire.

**Shared embedding socket ownership:** needed by phase 003, owner phase 002. Status: Open. Risk and mitigation: the skill advisor shares the HF socket, so the split is proven by the advisor resolving its embedder before deletion starts.

**Deep-loop runtime fix:** needed by any further fan-out research on this packet, owner system-deep-loop packet 040. Status: Ready. Risk and mitigation: landed and tested; sibling-phase runs need live locks to coexist.
<!-- /ANCHOR:dependencies -->
