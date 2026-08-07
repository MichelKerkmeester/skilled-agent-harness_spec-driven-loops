---
title: "Re-architect deep-improvement feature_catalog + manual_testing_playbook for 3 lanes"
status: in-progress
level: 2
---

# 007 — Deep-Improvement 3-Lane Doc Rebuild

## 1. PURPOSE

Re-architect both `.opencode/skills/deep-improvement/feature_catalog/` and
`.opencode/skills/deep-improvement/manual_testing_playbook/` into ONE mirrored,
lane-grouped taxonomy that completely + symmetrically covers all three lanes —
A: agent-improvement, B: model-benchmark, C: skill-benchmark — plus the shared
surface. Conform to the sk-doc templates. Lane C is currently partial (catalog
landing §6 only, no category dir) / absent (playbook), despite being a larger
code surface than the fully-covered Lane B.

## 2. SCOPE (operator-locked decisions)

1. **Architecture** = lane-grouped, MIRROR both docs (renumber categories +
   scenario IDs into one consistent taxonomy; rewrite all cross-refs/paths).
2. **Content depth** = author Lane C fresh + complete; for existing Lane A/B
   entries, FIX ONLY confirmed-stale text (NOT a full body rewrite). Structural
   moves (git mv into new dirs) + path-metadata/cross-ref updates still apply to
   A/B entries.
3. **Engine** = GPT-5.5 via cli-opencode drafts; I (Opus) verify EVERY drafted
   file against its cited source before it ships.
4. **Gate-3 home** = this folder (packet 122, new child 007). NOT a new 125.

## 3. OUT OF SCOPE

- No code changes to the lanes themselves (docs only).
- Not executing the manual scenarios (authored ready; execution is separate).
- Packet 123 fan-out remediation (separate, specced as its own 009).
- `git add -A` is banned (daemon mass-writes graph-metadata); scope every commit
  by explicit pathspec.

## 4. ACCEPTANCE

- Both trees share an identical lane-grouped category dir set (mirror check).
- Every Lane C script (9) + each Lane A/B script cited by ≥1 catalog entry.
- Each lane has ≥1 playbook scenario category.
- `grep -ri 'two-value\|two lanes\|two co-equal'` → 0 in both trees.
- Every entry conforms to its sk-doc template; both landings carry a 3-lane
  legend + a category table whose links resolve and counts match dirs.
- sk-doc validator exit 0 on both landings; `validate.sh <this folder> --strict`
  green. Commits scoped by pathspec.

See `handover.md` for the full execution contract, taxonomy mapping, dispatch
command, and per-file source inventory.
