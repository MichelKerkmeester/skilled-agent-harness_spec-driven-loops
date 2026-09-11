---
title: "Chronological Timeline [sk-doc/020-hyphen-naming-convention/timeline]"
description: "Chronological phase-creation timeline for the planned 020 hyphen-naming-convention program: the initial 017 scaffold, the 000-011 core tree, the 012 follow-on, the standalone 021 and 022 packets, and their absorption as phases 013 and 014."
trigger_phrases:
  - "020 hyphen naming timeline"
  - "020 phase creation order"
  - "020 commit chronology"
  - "hyphen naming convention phase timeline"
  - "which 020 phase is oldest"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention"
    last_updated_at: "2026-07-24T14:55:39Z"
    recent_action: "Traced the phase-creation history from the 017 source tree and standalone 021/022 packets through their absorption into 020."
    next_safe_action: "Use the parent spec phase map as the current structure; the migration itself remains Planned and unexecuted."
    completion_pct: 0
---
# 020 Chronological Timeline

> **Sort key:** git commit order for phase creation, oldest to newest.
> This is a Planned-program authoring timeline: it records when each current phase
> folder's `spec.md` first appeared in git, not a build or ship sequence. The
> kebab-case migration has not been executed.
>
> **What this packet is.** Packet 020 is the Planned Level-3 phase parent for
> **Repo-Wide Kebab-Case Filesystem Naming**. Its 000-011 CORE is a 12-phase
> migration program, authored and reshaped from 2026-07-13 onward, with follow-on
> phases 012-014. The current children are almost entirely Planned or scaffold
> specs; the chronology below is about phase authoring and tree identity.
>
> **Where the truth lives.** The parent [`spec.md`](./spec.md) phase map is the
> authoritative current structure. There is no `context-index.md` for 020. Git
> history is the authority for former paths and first-appearance dates.

## 0. The four phase-creation epochs

~~~text
Epoch one  --  core program scaffold (000-011)
 c45ab5ef380  docs(sk-doc)     add the initial 017 hyphen-naming migration spec
 291c103da4b  docs(sk-doc)     replan 017 hyphen-naming to 16 phases per design review
 a62523522e3  docs(specs)      restructure sk-doc/017 into a deep per-component phase tree
 70845a7ae38  docs(specs)      author create-generators phase docs for the hyphen-naming program
 0168b860952  docs(specs)      author rename-and-reference tooling phase docs for the hyphen-naming program
 a6b7e2dc02e  docs(specs)      author shared cross-cutting closures phase docs for the hyphen-naming program
 bcce219d157  docs(specs)      author tail phases and root-consumer coexistence for the hyphen-naming program
 75da0b1020d  docs(specs)      reconcile the 017 phase topology to the 000-011 tree
 09be7b18d5e  docs(specs)      reconcile the 017 sk-git and inventory phases against concurrent work
 5ec71333f82  docs(specs)      close 017 migration execution-readiness gaps after the parallelization review
 658a80dae40  refactor(specs)  consolidate sk-doc documentation packets into the sk-doc track

Epoch two  --  packet identity and filesystem-path normalization
 511719b7d9e  docs(specs)      renumber the sk-doc hyphen-naming packet 019 to 032
 a545d40fec4  docs(specs)      renumber sk-doc packets to close numbering gaps, including 032 to 020
 b052f329a73  refactor(sk-doc) migrate filesystem names to kebab-case (020, squashed)

Epoch three  --  follow-on phases authored as standalone packets
 82da5368002  refactor(skills)  normalize skill install-guide filenames to INSTALL-GUIDE.md (021)
 8cd71100615  docs(specs)      add the naming-standard-hardening spec (022, phased)
 6a2127a51e5  docs(sk-doc)     register follow-on phase 012 and reconcile the 020 tree

Epoch four  --  absorption into 020 (013 + 014)
 fe61b10f33b  refactor(sk-doc) absorb 021 and 022 into 020 as phases 013 and 014
~~~

The ledger contains 18 phase-tree creation or identity commits across four epochs.
It deliberately leaves out later implementation/content commits inside nested child
trees: this packet is Planned, so those commits are not a shipping sequence. The
four commits that touch the current 020 path directly are `a545d40fec4`,
`b052f329a73`, `6a2127a51e5`, and `fe61b10f33b`; the earlier entries are recovered
from the 017 source path and the former 021/022 top-level paths.

## A. Epoch one: the 017 scaffold becomes the 000-011 core

The program began as top-level packet 017. `c45ab5ef380` added its initial phase
spec set, including the original convention, generator, and migration slices.
`291c103da4b` then performed the design-review re-plan: it added the immutable
baseline phase 000, renamed and repartitioned the early phases, and established the
phase shape that later became the current 000-011 CORE.

`a62523522e3` created the deep per-component phase tree and is the first appearance
of the current 007-011 phase-spec paths. The next authoring wave filled the named
generator, rename/reference, shared-closure, and tail-phase documents. The topology
and readiness commits then reconciled the 000-011 tree against concurrent work and
closed the execution-readiness gaps. These were documentation and decomposition
events only; no repo-wide naming migration shipped in this epoch.

`658a80dae40` moved the 017 tree under the consolidated `sk-doc` track. That move
preserved the phase lineage while changing the packet's surrounding path, which is
why the later numbering commits must be read as identity changes rather than new
phase authoring.

## B. Epoch two: numbering and the current 020 path

The packet was temporarily renumbered from 019 to 032 at `511719b7d9e`, then
renumbered to 020 by `a545d40fec4` as the sk-doc numbering gaps were closed.
`b052f329a73` recorded the squashed filesystem-name normalization that left the
current packet tree in kebab-case. That commit changed the documentation tree's
path naming; it did not execute the planned repo-wide migration described by 020.

The current-path log therefore starts later than the program's phase authoring:
the source-path commits are required to answer when the phases were created, while
the current-path log is required to answer when the 020 path was touched.

## C. Epoch three: 012, 021, and 022 are follow-on authoring waves

Phase 012 was registered after the 000-011 CORE closeout at `6a2127a51e5` on
2026-07-20. It is the newest phase by first appearance in the current tree. It
extends the naming scope into code-directory enforcement and is independent of the
CORE migration sequence.

Phase 013 was not first authored under 020. Its first `spec.md` appeared in the
standalone packet `sk-doc/021-install-guide-canonical-naming` at
`82da5368002` on 2026-07-17. Phase 014 likewise began as standalone packet
`sk-doc/022-naming-standard-hardening`; its parent `spec.md` first appeared at
`8cd71100615` on 2026-07-20, with the two child specs authored in that packet's
subsequent work. Those dates are the phase-creation dates, not the later absorption
date.

## D. Epoch four: absorption into 020

`fe61b10f33b` absorbed the standalone 021 and 022 trees as current phases 013 and
014. Git records the operation as renames plus metadata regeneration and a parent
phase-map update: the 021 tree became `013-install-guide-canonical-naming`, and
the 022 phase parent became `014-naming-standard-hardening` while retaining its
001/002 children. No phase content was authored in the absorption commit.

The direct phase-creation order is therefore:

| First `spec.md` appearance | Current phase | Source path at first appearance |
|---|---|---|
| 2026-07-13 15:08:10 +0200 — `c45ab5ef380` | `001-convention-policy-and-scope` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 15:08:10 +0200 — `c45ab5ef380` | `003-create-generators-and-templates` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `291c103da4b` | `000-worktree-baseline-and-census` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `291c103da4b` | `002-root-name-consumer-migration` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `291c103da4b` | `004-no-new-snake-guard` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `291c103da4b` | `005-rename-and-reference-tooling` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `291c103da4b` | `006-inventory-and-frozen-map` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `a62523522e3` | `007-shared-and-cross-cutting-closures` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `a62523522e3` | `008-component-migration` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `a62523522e3` | `009-remove-transition-aliases` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `a62523522e3` | `010-whole-repo-gate` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `a62523522e3` | `011-integrate-and-closeout` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-17 19:16:15 +0200 — `82da5368002` | `013-install-guide-canonical-naming` | `sk-doc/021-install-guide-canonical-naming` |
| 2026-07-20 13:22:44 +0200 — `8cd71100615` | `014-naming-standard-hardening` | `sk-doc/022-naming-standard-hardening` |
| 2026-07-20 14:13:08 +0200 — `6a2127a51e5` | `012-code-dir-naming-enforcement` | `sk-doc/020-hyphen-naming-convention` |

Thus `001-convention-policy-and-scope` and
`003-create-generators-and-templates` are tied as the oldest current phases by
first `spec.md` appearance. `012-code-dir-naming-enforcement` is the newest.
