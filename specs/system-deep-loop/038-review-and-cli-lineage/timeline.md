---
title: "Timeline: Deep-loop review and CLI lineage: gateway, state init, opencode-go route, bookkeeping, findings contract and lineage reducer"
description: "Order in which the 7 packets under this parent were started and finished, with the number each had before it moved here."
trigger_phrases:
  - "deep loop review gateway timeline"
  - "review state init and dispatch timeline"
  - "cli pi opencode go route timeline"
  - "038-review-and-cli-lineage number map"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Deep-loop review and CLI lineage: gateway, state init, opencode-go route, bookkeeping, findings contract and lineage reducer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order the 7 packets under `038-review-and-cli-lineage` were started and finished, with the number each packet carried before it moved under this parent. Entries for committed packets come from git; entries for uncommitted packets are dated from the working tree and say so.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `system-deep-loop/038-review-and-cli-lineage`, children 001 to 007
**Status:** In Progress
**Started:** 2026-10-02
**Last updated:** 2026-10-09
**Owner:** the spec-kit maintainers. Dates and hashes come from `git log` over each packet's former path, so the hashes are the ones in history after the commit message rewrite that repointed the old folder names. Commits made after the move under this parent were repository-wide maintenance and are not listed per packet.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

Each entry is a packet's first commit, or for an uncommitted packet the day its folder was created. The outcome names what the packet left behind.

**2026-10-02:** `001-review-gateway-iteration-record` (was `038-review-gateway-iteration-record`) started. 1 commit, first `272ce3cb19` and last `272ce3cb19` on 2026-10-02. Outcome: The review iteration record the agent sends is accepted by the append gateway.

**2026-10-02:** `002-review-state-init-and-dispatch` (was `039-review-state-init-and-dispatch`) started. 4 commits, first `ae1de657cd` and last `0748d2e638` on 2026-10-05. Outcome: Deep-review state-log init goes through the gateway, and the child-dispatch retry rule is fixed.

**2026-10-03:** `003-cli-pi-opencode-go-route` (was `040-cli-pi-opencode-go-route`) started. 2 commits, first `f54c51c0be` and last `e2530f6f85` on 2026-10-03. Outcome: Not built yet, the packet is still a draft.

**2026-10-03:** `004-read-only-and-research-bookkeeping` (was `041-read-only-and-research-bookkeeping`) started. 1 commit, first `6a01bc965c` and last `6a01bc965c` on 2026-10-03. Outcome: Status, query and convergence take --read-only and open the database read-only.

**2026-10-04:** `005-cli-lineage-findings-contract` (was `042-cli-lineage-findings-contract`) started. 2 commits, first `61cea042e0` and last `d4539b2714` on 2026-10-04. Outcome: The findings contract addresses the closeout failure where a lineage enumerated fewer findings than it claimed.

**2026-10-09:** `006-research-lineage-reducer-path` started and finished, created directly under this parent. Not committed yet, so it has no hashes. Outcome: The deep-research reducer takes `--artifact-dir`, both research workflows pass the lineage folder to it during fan-out, and a live two-lineage run confirmed a lineage's registry, dashboard and strategy now land in its own folder.

**2026-10-09:** `007-lineage-reducer-compliance` started, created directly under this parent. Not committed yet, so it has no hashes. Outcome: Not built yet, the packet is planned. It covers the lineage in that live run that skipped the reducer and wrote its projections by hand.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**All children closed:** target 2026-10-05, missed. Status: In Progress. Evidence: 5 of 7 children report complete; `003-cli-pi-opencode-go-route` is still a draft and `007-lineage-reducer-compliance` is planned.
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
- `006-research-lineage-reducer-path` and `007-lineage-reducer-compliance` were created under this parent and never held a track number.
<!-- /ANCHOR:numbers -->
