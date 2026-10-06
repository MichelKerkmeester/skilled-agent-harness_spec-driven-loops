---
title: "Timeline: Deep-loop review and CLI lineage: gateway, state init, opencode-go route, bookkeeping and findings contract"
description: "Order in which the 5 packets under this parent were started and finished, with the number each had before it moved here."
trigger_phrases:
  - "deep loop review gateway timeline"
  - "review state init and dispatch timeline"
  - "cli pi opencode go route timeline"
  - "038-review-and-cli-lineage number map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Deep-loop review and CLI lineage: gateway, state init, opencode-go route, bookkeeping and findings contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order the 5 packets under `038-review-and-cli-lineage` were started and finished, taken from git, with the number each packet carried before it moved under this parent.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `system-deep-loop/038-review-and-cli-lineage`, children 001 to 005
**Status:** In Progress
**Started:** 2026-10-02
**Last updated:** 2026-10-05
**Owner:** the spec-kit maintainers. Dates and hashes come from `git log` over each packet's former path, so the hashes are the ones in history before this move.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

Each entry is a packet's first commit. The outcome names what the packet left behind.

**2026-10-02:** `001-review-gateway-iteration-record` (was `038-review-gateway-iteration-record`) started. 1 commit, first `90e914852b` and last `90e914852b` on 2026-10-02. Outcome: The review iteration record the agent sends is accepted by the append gateway.

**2026-10-02:** `002-review-state-init-and-dispatch` (was `039-review-state-init-and-dispatch`) started. 4 commits, first `7354017b96` and last `2a6a2ca295` on 2026-10-05. Outcome: Deep-review state-log init goes through the gateway, and the child-dispatch retry rule is fixed.

**2026-10-03:** `003-cli-pi-opencode-go-route` (was `040-cli-pi-opencode-go-route`) started. 2 commits, first `7d1d84cbf2` and last `0fab2163e3` on 2026-10-03. Outcome: Not built yet, the packet is still a draft.

**2026-10-03:** `004-read-only-and-research-bookkeeping` (was `041-read-only-and-research-bookkeeping`) started. 1 commit, first `7b418c9d4f` and last `7b418c9d4f` on 2026-10-03. Outcome: Status, query and convergence take --read-only and open the database read-only.

**2026-10-04:** `005-cli-lineage-findings-contract` (was `042-cli-lineage-findings-contract`) started. 2 commits, first `6fe821b1a9` and last `6813a7a7af` on 2026-10-04. Outcome: The findings contract addresses the closeout failure where a lineage enumerated fewer findings than it claimed.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All children closed:** target 2026-10-05. Status: In Progress. Evidence: 4 of 5 children report complete, the rest are still open.
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:numbers -->
## 4. NUMBER MAP

This parent took the number of its first child, so the numbers of the other packets it holds are now free in `specs/system-deep-loop/`. They are not reused. New packets in the track keep counting from the highest number in use.

- `038-review-gateway-iteration-record` is now `038-review-and-cli-lineage/001-review-gateway-iteration-record`.
- `039-review-state-init-and-dispatch` is now `038-review-and-cli-lineage/002-review-state-init-and-dispatch`.
- `040-cli-pi-opencode-go-route` is now `038-review-and-cli-lineage/003-cli-pi-opencode-go-route`.
- `041-read-only-and-research-bookkeeping` is now `038-review-and-cli-lineage/004-read-only-and-research-bookkeeping`.
- `042-cli-lineage-findings-contract` is now `038-review-and-cli-lineage/005-cli-lineage-findings-contract`.
<!-- /ANCHOR:numbers -->
