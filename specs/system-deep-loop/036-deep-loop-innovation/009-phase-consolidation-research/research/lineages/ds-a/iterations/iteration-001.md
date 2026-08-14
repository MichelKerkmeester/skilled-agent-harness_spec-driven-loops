# Iteration 1: Full On-Disk Census of the 036 Phase-Parent Children

## Focus
Complete inventory of all 44 child phase folders (45 dirs minus the 057 host), their structure (leaf vs phase-parent), titles, purposes, and every metadata surface that would need updating under any renumbering.

## Findings

1. **On-disk census is clean and in sync.** 45 dirs match `^[0-9]{3}-`; 44 are children; the parent `graph-metadata.json` `children_ids` has exactly 44 entries and matches on-disk exactly (no orphans, no stale IDs). [SOURCE: bash python diff, specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json:6-51]

2. **Two structural kinds of children exist.**
   - **Leaf children (25):** 001, 002, 003, 005, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 035, 050, 051, 052, 053, 054, 055, 056 — actually these 31 have `plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` directly (own spec packet files).
   - **Phase-parent children (13):** 004, 006, 007, 008, 009, 010, 011, 012, 013, 014, 047, 048, 049 — these have their own `NNN-name/` sub-child folders + spec.md + graph-metadata.json but no plan/tasks/checklist at their own level (lean parent trio).
   - Confirmed via `ls` per folder: 004 has 3 subchildren, 006 has 4, 007 has 7, 008 has 5, 009 has 7, 010 has 5, 011 has 5, 012 has 4, 013 has 8, 014 has 3, 047 has 5, 048 has 3, 049 has 2. [SOURCE: bash census]

3. **Numbering has gaps.** No 034, 036-046 children exist. 001-033 span the original program + remediation; 035 is the CLI stress/playbook scaffold; 047-056 are later hardening/review/executor groups. The 057 host is the newest. This means ~12 numbers are already unused (034, 036-046), which matters for renumbering headroom. [SOURCE: on-disk listing]

4. **Parent spec.md PHASE DOCUMENTATION MAP** lists all 44 children in a 4-column table (Phase | Folder | Focus | Status) at spec.md:213-258. Status is "copied from that child's `graph-metadata.json` `derived.status`" per the map-maintenance note at spec.md:209-211. Every folder name appears verbatim. Any rename breaks this table and the "Map maintenance" contract. [SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/spec.md:207-258]

5. **`manifest/phase-tree.json`** exists (packet-level manifest, kind=phase-parent, live_direct_children=44, has a `phases` array with `phase`/`slug`/`kind`/`depends_on`/`outcome`). It references slugs (e.g. `deep-loop-market-research`) — but notably phase-tree.json lists only up to... need to verify coverage of 047-056. This is a third metadata surface. [SOURCE: file:manifest/phase-tree.json]

6. **`validate.sh` HARDCODES a child manifest for exactly this parent folder** with an embedded sha256: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:216-219` has a `case` matching `*/specs/system-deep-loop/036-deep-loop-innovation` with a hardcoded `$'...\n...'` list of 40 children (001-033, 035, 047-052) and `expected_hash=f6cf1e943d...`. I recomputed the sha256 of the embedded list and it matches exactly. **Critical:** the embedded manifest lists only 40 children — 053, 054, 055, 056 are MISSING from it, yet `validate.sh` still passes today because the hash matches its own embedded list and the missing-newer-children path tolerates extra on-disk dirs (the exact-disk-set requirement only applies when `SPECKIT_CHILD_MANIFEST_FILE` is set). Any rename requires editing this list AND recomputing the hash. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/validate.sh:182-275, recomputed hash]

7. **`specs/descriptions.json`** is a repo-wide index (version 1, generated 2026-07-28) with 3207 folder entries; 133 entries match `036-deep-loop`, including every child folder and every sub-child path. Any rename needs this regenerated (it is auto-generated via generate-context.js/descriptions build, so the migration step is "regenerate", not "hand-edit"). [SOURCE: file:specs/descriptions.json]

8. **Git first-add timestamps** (from `git log --all --follow --diff-filter=A`, surviving the `.opencode/specs → specs` flip at 606e55cb8a9) give a true chronological lineage that partially disagrees with numbering:
   - 001 was added 2026-07-14 (truly first).
   - 002-017 (except 013, 015) were all committed at 2026-07-15 18:45:50 in one batch; 013 at 21:20:48, 015 at 18:59:03.
   - 003-017 except 018, 019, 020 were created in graph-metadata on 2026-07-15/16 (planning batch), so *creation* happened nearly simultaneously.
   - 018 added 2026-07-20; 019/020 2026-07-29; 021 2026-08-03; 022-032 2026-07-31; 033 2026-08-08; 035 2026-08-07; 047-049 2026-08-08; 050 2026-07-27; 051 2026-08-12; 052 2026-08-12; 053-056 2026-08-13. [SOURCE: git log --all --follow --diff-filter=A, graph-metadata created_at]

9. **The 033 ambiguity:** a root-level file `dispositions.md` coexists with folder `033-identity-and-lock-ownership-hardening/`. spec.md:209 explicitly warns they are distinct. Any renumbering must preserve this distinction. [SOURCE: file:dispositions.md, spec.md:209]

10. **Cross-repo reference blast radius:** 98 non-036 files reference `036-deep-loop-innovation` (git grep). Individual children are referenced widely: `001-deep-loop-market-research` in 16 non-self files, `013-mode-and-lane-migrations` in 32, `047-executor-wiring-and-parity` in 4, `022-...` in 8, `053-runtime-code-review` in 8. Files include runtime code (`.opencode/skills/system-deep-loop/runtime/...`), validate.sh, other spec packets (sk-code, sk-doc, sk-design), and test files. [SOURCE: git grep]

## Assessment
- newInfoRatio: 1.0
- Novelty justification: First evidence-gathering pass; the hardcoded validate.sh manifest, phase-tree.json surface, descriptions.json index, and git-first-add vs graph-metadata created_at discrepancies are all net-new to this packet.
- Confidence: High (all findings from direct file reads / commands).

## Reflection
- What worked: `git log --follow` per-folder to survive the specs path flip; the python diff of children_ids vs disk; recomputing the validate.sh hash.
- What failed / ruled out: full-repo `git log --diff-filter=A` timed out (too slow); scoped per-folder --follow worked. `git log <path>` without --follow returned nothing because specs moved (`.opencode/specs` → `specs/`).

## Recommended Next Focus
Iteration 2: Cluster analysis — assign each of the 44 children a theme label + dependency read, then propose candidate multi-phase groups with optimized names. Read each leaf's spec.md purpose line and each phase-parent's description to ground grouping.
