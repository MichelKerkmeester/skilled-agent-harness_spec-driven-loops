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
 63d73f7cc37  docs(sk-doc)     add the initial 017 hyphen-naming migration spec
 d8b8b9f2721  docs(sk-doc)     replan 017 hyphen-naming to 16 phases per design review
 428dfc2c848  docs(specs)      restructure sk-doc/017 into a deep per-component phase tree
 5bfb360a6b7  docs(specs)      author create-generators phase docs for the hyphen-naming program
 b1103aeb53f  docs(specs)      author rename-and-reference tooling phase docs for the hyphen-naming program
 cd36f22b1d8  docs(specs)      author shared cross-cutting closures phase docs for the hyphen-naming program
 d2328cb8a88  docs(specs)      author tail phases and root-consumer coexistence for the hyphen-naming program
 cb12c2eff95  docs(specs)      reconcile the 017 phase topology to the 000-011 tree
 f76b82e4200  docs(specs)      reconcile the 017 sk-git and inventory phases against concurrent work
 e86366db934  docs(specs)      close 017 migration execution-readiness gaps after the parallelization review
 c212f89c20b  refactor(specs)  consolidate sk-doc documentation packets into the sk-doc track

Epoch two  --  packet identity and filesystem-path normalization
 087b57045c0  docs(specs)      renumber the sk-doc hyphen-naming packet 019 to 032
 9d944ff066d  docs(specs)      renumber sk-doc packets to close numbering gaps, including 032 to 020
 cc77a1e550a  refactor(sk-doc) migrate filesystem names to kebab-case (020, squashed)

Epoch three  --  follow-on phases authored as standalone packets
 24115d22ccc  refactor(skills)  normalize skill install-guide filenames to INSTALL-GUIDE.md (021)
 743a5b4f531  docs(specs)      add the naming-standard-hardening spec (022, phased)
 dc7fdfb0a74  docs(sk-doc)     register follow-on phase 012 and reconcile the 020 tree

Epoch four  --  absorption into 020 (013 + 014)
 efd5d5d0a01  refactor(sk-doc) absorb 021 and 022 into 020 as phases 013 and 014
~~~

The ledger contains 18 phase-tree creation or identity commits across four epochs.
It deliberately leaves out later implementation/content commits inside nested child
trees: this packet is Planned, so those commits are not a shipping sequence. The
four commits that touch the current 020 path directly are `9d944ff066d`,
`cc77a1e550a`, `dc7fdfb0a74`, and `efd5d5d0a01`; the earlier entries are recovered
from the 017 source path and the former 021/022 top-level paths.

## A. Epoch one: the 017 scaffold becomes the 000-011 core

The program began as top-level packet 017. `63d73f7cc37` added its initial phase
spec set, including the original convention, generator, and migration slices.
`d8b8b9f2721` then performed the design-review re-plan: it added the immutable
baseline phase 000, renamed and repartitioned the early phases, and established the
phase shape that later became the current 000-011 CORE.

`428dfc2c848` created the deep per-component phase tree and is the first appearance
of the current 007-011 phase-spec paths. The next authoring wave filled the named
generator, rename/reference, shared-closure, and tail-phase documents. The topology
and readiness commits then reconciled the 000-011 tree against concurrent work and
closed the execution-readiness gaps. These were documentation and decomposition
events only; no repo-wide naming migration shipped in this epoch.

`c212f89c20b` moved the 017 tree under the consolidated `sk-doc` track. That move
preserved the phase lineage while changing the packet's surrounding path, which is
why the later numbering commits must be read as identity changes rather than new
phase authoring.

## B. Epoch two: numbering and the current 020 path

The packet was temporarily renumbered from 019 to 032 at `087b57045c0`, then
renumbered to 020 by `9d944ff066d` as the sk-doc numbering gaps were closed.
`cc77a1e550a` recorded the squashed filesystem-name normalization that left the
current packet tree in kebab-case. That commit changed the documentation tree's
path naming; it did not execute the planned repo-wide migration described by 020.

The current-path log therefore starts later than the program's phase authoring:
the source-path commits are required to answer when the phases were created, while
the current-path log is required to answer when the 020 path was touched.

## C. Epoch three: 012, 021, and 022 are follow-on authoring waves

Phase 012 was registered after the 000-011 CORE closeout at `dc7fdfb0a74` on
2026-07-20. It is the newest phase by first appearance in the current tree. It
extends the naming scope into code-directory enforcement and is independent of the
CORE migration sequence.

Phase 013 was not first authored under 020. Its first `spec.md` appeared in the
standalone packet `sk-doc/021-install-guide-canonical-naming` at
`24115d22ccc` on 2026-07-17. Phase 014 likewise began as standalone packet
`sk-doc/022-naming-standard-hardening`; its parent `spec.md` first appeared at
`743a5b4f531` on 2026-07-20, with the two child specs authored in that packet's
subsequent work. Those dates are the phase-creation dates, not the later absorption
date.

## D. Epoch four: absorption into 020

`efd5d5d0a01` absorbed the standalone 021 and 022 trees as current phases 013 and
014. Git records the operation as renames plus metadata regeneration and a parent
phase-map update: the 021 tree became `013-install-guide-canonical-naming`, and
the 022 phase parent became `014-naming-standard-hardening` while retaining its
001/002 children. No phase content was authored in the absorption commit.

The direct phase-creation order is therefore:

| First `spec.md` appearance | Current phase | Source path at first appearance |
|---|---|---|
| 2026-07-13 15:08:10 +0200 — `63d73f7cc37` | `001-convention-policy-and-scope` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 15:08:10 +0200 — `63d73f7cc37` | `003-create-generators-and-templates` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `d8b8b9f2721` | `000-worktree-baseline-and-census` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `d8b8b9f2721` | `002-root-name-consumer-migration` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `d8b8b9f2721` | `004-no-new-snake-guard` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `d8b8b9f2721` | `005-rename-and-reference-tooling` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-13 16:37:27 +0200 — `d8b8b9f2721` | `006-inventory-and-frozen-map` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `428dfc2c848` | `007-shared-and-cross-cutting-closures` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `428dfc2c848` | `008-component-migration` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `428dfc2c848` | `009-remove-transition-aliases` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `428dfc2c848` | `010-whole-repo-gate` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-14 17:31:29 +0200 — `428dfc2c848` | `011-integrate-and-closeout` | `sk-doc/017-hyphen-naming-convention` |
| 2026-07-17 19:16:15 +0200 — `24115d22ccc` | `013-install-guide-canonical-naming` | `sk-doc/021-install-guide-canonical-naming` |
| 2026-07-20 13:22:44 +0200 — `743a5b4f531` | `014-naming-standard-hardening` | `sk-doc/022-naming-standard-hardening` |
| 2026-07-20 14:13:08 +0200 — `dc7fdfb0a74` | `012-code-dir-naming-enforcement` | `sk-doc/020-hyphen-naming-convention` |

Thus `001-convention-policy-and-scope` and
`003-create-generators-and-templates` are tied as the oldest current phases by
first `spec.md` appearance. `012-code-dir-naming-enforcement` is the newest.
