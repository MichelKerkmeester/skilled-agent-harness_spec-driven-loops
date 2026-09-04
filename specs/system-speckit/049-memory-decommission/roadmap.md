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
**Horizon:** research complete 2026-09-02; all four build phases done 2026-09-04; closeout and landing remain
**Owner:** operator, executed by the orchestrate agent
**Last updated:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** Done. Focus: the ten-iteration deep review (phase 007) and its remediation, after phase 004, the grep-optimized doc convention and its retrofit across the active spec corpus. All four build phases are complete — the trigger index and ripgrep contract are built and proven, every consumer is rewired, the memory engine with its registrations and documentation is gone, and the corpus now conforms. Exit signal met: the `GREP_CONVENTION` rule is registered always-on in `validate.sh` and the rescan reports residue 0 across 22,094 documents.

**Next:** Planned. Focus: packet closeout. Seven open decisions are waiting, three carried up from phase 003 and four from phase 004 — the default spawner of the shared HF model server, the eight dependencies with no importer, the fate of `lib/description/repair.ts`, escalating the report-only convention classes from warn to error, authoring frontmatter for the 55 canonical documents that refused a partial block, normalizing the `importance_tier` and `contextType` vocabularies, and sharing `js-yaml` between the retrofit classifier and the validator. Exit signal: `validate.sh --recursive --strict` over the packet exits 0 and every phase reports its acceptance criteria closeable.

**Later:** Planned. Focus: land `branches/017-memory-decommission`. Every phase, the review and the remediation are committed on the branch; nothing is pushed. Landing needs the operator's push go-ahead, the main-checkout dependency reinstall recorded as the release caveat, and the open decisions reviewed at that checkpoint.
<!-- /ANCHOR:now-next-later -->

---

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

**Research folded in:** phase Now, target 2026-09-02. Status: Done. Evidence: commit 6102eb9d2e; 005 and 006 syntheses under their research/lineages/luna-max directories.

**Runtime defects fixed:** phase Now, target 2026-09-02. Status: Done. Evidence: specs/system-deep-loop/040-cli-lineage-nesting-and-containment-guard, commits 2c2687e260 and 54e65e115a, whole suite 2531 passed.

**Parity proven:** phase Done, target the 001 acceptance rows AC-001 to AC-008 Met. Status: Done. Evidence: phase 001 is Complete in the parent Phase Documentation Map; its parity-check baseline and latency report are recorded in `001-trigger-index-replacement/`.

**Consumers rewired:** phase Done, target the 002 residue sweep empty outside the mcp-server tree. Status: Done. Evidence: sweep live 0 with 79 reasoned exemptions, and `002-memory-consumer-rewire/owner-reconciliation.json` covering 588 consumer files.

**Server removed:** phase Done, target every runtime boots with no daemon and the advisor embedder still resolves. Status: Done. Evidence: grep count 0 for the server in all five config roots; five cold boots with no memory process, no memory mention or timeout notice and no launcher lock directory; a live advisor scored recommendation exit 0; the closing sweep live 0 across 3,171 paths now including `mcp-server`. The removal is partial under option A — the package survives as the spec-kit engine at 333 import-closed files.

**Corpus retrofitted:** phase Done, target zero residue and unchanged body preimages across the active corpus. Status: Done. Evidence: the rescan reports residue 0 across 22,094 considered and `verify-preimage` verified all 22,094 with 0 mismatches; 10,210 documents were rewritten across 14 tracks with 0 failures, and the diff classifier put all 36,271 changed lines inside frontmatter with none in the `other` bucket. 63 documents are reported by design — 55 canonical ones needing an authored block and 8 policy cards a flow mapping makes unparseable.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Live server during phase 001:** needed by the parity harness, owner phase 001. Status: Ready. Risk and mitigation: the daemon flaps, so an unavailable live arm is blocked, not green, and a captured baseline with availability metadata stands in.

**Continuity writer decision:** needed by phase 002 and consumed by phase 004, owner phase 002. Status: Ready. Risk and mitigation: settled on `generate-context.js` as the packet-local writer, exercised with no daemon in both phases — exit 0 with the graph-metadata refresh logged.

**Shared embedding socket ownership:** needed by phase 003, owner phase 002. Status: Ready. Risk and mitigation: the advisor is the surviving owner and resolves its embedder with the engine gone, proven by a live scored recommendation and the two-launcher socket test, 3 passed 2 skipped. Open follow-on: nothing spawns the shared model server by default now, which is a decision rather than a break.

**Deep-loop runtime fix:** needed by any further fan-out research on this packet, owner system-deep-loop packet 040. Status: Ready. Risk and mitigation: landed and tested; sibling-phase runs need live locks to coexist.
<!-- /ANCHOR:dependencies -->
