---
title: "Iteration 7: The retrofit mapping"
trigger_phrases: []
---
# Iteration 7: The retrofit mapping

## Focus

For the existing history: how each commit is assigned a packet and an identifier — from its `Refs:`/`Spec:` line, from the paths it touched under `specs/`, from its numeric scope, or by a fixed ordinal — with measured coverage of each source over the real history, the unmappable remainder, and the rule that applies to it.

## What was read

- No new contract files; the measurement uses the packet-path grammar `specs/<track>/<packet>/...` and the trailer/scope signals established in iterations 2, 4, and 5.
- Live-drift note: `skilled/v4.0.0.0` moved from `440e5dc15c` (9,108) to `9371f99938` (9,112) while this lineage ran — four commits in one session. All mapping counts are pinned at the run shown below.

## What was measured

```text
PIN: tip 9371f99938, commits 9112 (hashes/subjects/bodies read at 9111; path map re-read live)

Rule cascade over the commit set (each commit picks the first applicable source):
refs (Refs: specs/<track>/<packet>)   297
spec (Spec: specs/... or Spec: <track>/<packet>)   65
scope-dir-match (numeric scope + exactly one touched packet with that number)   719
unique-touch (touches exactly one packet)          4250
dominant-touch (multi-packet; winner by changed-file count)   705
fallback (no packet)                              3075   = 41 multi-tie + 310 scope-only + 2724 no-signal
TOTAL                                             9111

Supporting numbers:
- commits touching specs/ or .opencode/specs: 5,987; of those touching exactly one packet: 4,250;
  touching >1 packet: 746; distinct packets seen: 1,563
- multi-packet commits: 746; 705 have a unique top file-count winner; 41 ties
- numeric-scope commits (loose `^[a-z]+\([0-9]+\):` probe): 1,450; 1,127 also touch specs/
  (of which 719 resolve to exactly one matching packet); 310 touch no specs path at all and then:
      exactly 1 candidate track for that number: 52
      2-20 candidate tracks: 258   (e.g. number 80 exists in 13 tracks)
- refs-spec-path commits: 297; 219 also touch specs/ (precision cross-check available)
- fallback composition: 269 merges, 143 exempt-subject commits, 1,491 touch .opencode/skills,
  233 touch tool dirs (.opencode/scripts|commands|agents), ~1,497 neither; 872 contain a 3-digit
  token in the subject (weak, human-reviewable only)

Archetypes:
  cddd84f9f8 fix(sk-design-diagram): ...        -> .opencode/skills/sk-design/sk-design-diagram/...
  06b28f6749 perf(spec-kit): batch the spec re-mint -> .opencode/scripts/git-hooks/...
  9dddd683cb chore(system-plugins): vendor ...      -> skill-tree/tooling, no specs/ path
```

## Findings

1. **The spec-touch signal is the backbone; trailer signals are precise but scarce.** 5,987 commits touch `specs/`; 4,250 touch exactly one packet; 746 touch more than one. `Refs:`/`Spec:` cover only 297 + 65 commits (with 219 of the refs set also touching specs — usable for cross-checking, not as the primary signal). [SOURCE: command:rule cascade]
2. **~66% of commits can carry a packet key; ~34% cannot under any specs signal.** Cascade result: 6,036 of 9,111 get a packet (refs 297 + spec 65 + scope-dir 719 + unique 4,250 + dominant 705); 3,075 fall back (41 multi-tie + 310 scope-only + 2,724 no-signal). [SOURCE: command:rule cascade]
3. **A numeric scope alone cannot resolve a packet.** Of the 310 numeric-scope commits with no `specs/` touch, only 52 have exactly one candidate track for their number; 258 have 2-20 candidate tracks (the number `80` exists in 13 tracks). Packet numbers are unique per track, not per repository — the scope digit is a within-track index, so it needs a path or reference to pick the track. [SOURCE: command:scope-only track analysis]
4. **Dominance resolves most multi-packet commits but is not free.** 705 of 746 multi-packet commits have a unique winner by changed-file count; 41 tie. A documented tie-break is mandatory (proposal: deepest matched path, then lexicographic packet name, then manual adjudication) or those 41 ids are nondeterministic. [SOURCE: command:multi-packet analysis]
5. **The unmapped remainder is not noise; it is non-packet work.** Fallback archetypes: skill-tree commits (`sk-design-diagram` HTML assets under `.opencode/skills/...`), tooling commits (`.opencode/scripts/git-hooks/...`), and merge/exempt subjects. The packet taxonomy covers spec work, not every repository area. [SOURCE: command:archetype checks]
6. **Alternative for multi-packet commits: multi-valued `Spec:` trailers.** Because some commits legitimately serve several packets (831 multi-packet by any count), the grammar can list one `Spec:` per touched packet and keep a single `Commit-Id:` for the dominant owner; queries then find such a commit under each packet. This reduces the pressure on the dominance tie-break but multiplies trailer lines. [SOURCE: iteration 5 shape] [SOURCE: command:multi-packet analysis]
7. **Determinism requires enumeration from the frozen pre-rewrite graph.** The fallback assignment (and the per-packet sequence numbers) must be reproducible from `(committer date, subject, original SHA)` over the frozen commit set, so a re-run of the rewrite cannot shift ids. This is the same property `worktree-naming.sh` gets from its high-water file. [SOURCE: iteration 4 finding 10]
8. **Live drift is a first-class constraint.** The branch gained four commits in one working session; a retrofit plan that pins nothing will race the writers. The map must be built against a SHA and the writers (autosync, other worktrees) stopped for the rewrite window. [SOURCE: command:PIN drift]
9. **Coverage of a *fixed ordinal* source is 100% by construction** (the brief lists it as the last resort): enumerating every commit gives every commit an address, with zero packet context. It is the only source that covers the whole history, which is what makes it the fallback namespace rather than a competing scheme. [SOURCE: command:cascade]
10. **The 872 fallback subjects containing a 3-digit token are not a rule.** They are candidate alias sources for a human-reviewed second pass (`Commit-Id:` plus a soft `Alias:`), never an automatic mapping. [SOURCE: command:fallback weak signal]

## Recommendations

1. **[implementable today]** Adopt the cascade as the mapping rule: `Refs:`/`Spec:` path → numeric scope + unique matching touched packet → unique touched packet → dominant touched packet (file-count; tie-break deepest path, then lexicographic) → fallback namespace. It is deterministic and fully specified except the named tie-break.
2. **[needs a contract decision]** Choose the fallback namespace for the ~3,075 packet-less commits (`Commit-Id: misc-NNNN` by enumeration, versus a repo-wide ordinal). Recommended: `misc-NNNN`, assigned in enumeration order, with no `Spec:` key; this keeps packet ids visually distinct from non-packet ids.
3. **[needs a contract decision]** Decide whether merge commits and git-generated exempt subjects receive ids at all (269+143 in fallback) or remain hash-addressable only. Recommended: give them fallback ids for uniform addressing; leave their subjects exempt from format.
4. **[needs a contract decision]** Choose whether multi-packet commits list every touched packet (`Spec:` repeated) or only the dominant one. Recommended: repeat `Spec:` for semantic membership; single `Commit-Id:` from the primary packet.
5. **[implementable today]** Generate the mapping as a reviewable table (old SHA → packet → id → source → confidence) and freeze it with the SHA before the rewrite; route the 41 ties and disputed dominants to manual adjudication first.
6. **[implementable today]** Stop writers and disable autosync for the rewrite window; the branch moved four commits mid-run.

## What this iteration could not settle

- The fallback namespace spelling and whether skill-tree work deserves skill-scoped ids instead (`sk-design-diagram-NNN`) — a taxonomy decision above this phase.
- How the operator wants multi-packet commits ranked (semantic membership vs single owner).
- The exact enumeration key order for fallback ids (committer date vs author date vs topological order) — must be fixed in the mapping script spec.
