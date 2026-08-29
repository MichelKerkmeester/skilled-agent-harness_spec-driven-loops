---
title: "Derived Packet Repair"
description: "What the repair tool fixes, what it refuses, and why the refusal is the point rather than an omission."
trigger_phrases:
  - "repair derived packets"
  - "repair-derived"
  - "packet autofix boundary"
importance_tier: "high"
contextType: "general"
version: 1.0.0.0
---

# Derived Packet Repair

Packet validation failures come in two kinds, and only one of them is a
machine's work.

---

## 1. THE BOUNDARY

**Derived** failures are facts the repository already knows and the document
records wrongly. Where a packet sits after it is renumbered or moved. What level
it declares. Whether its generated metadata still matches the documents it
summarises. The correct value can be recomputed, so a tool can write it and be
right every time.

**Authored** failures are records of something a person did. Evidence for a
completed checklist item. A verification result. A decision and the alternatives
weighed against it. A handover's account of where the work actually stands.
Nothing in the repository can supply these, because the information never
existed anywhere but in the head of whoever did the work.

This tool repairs the first kind and refuses the second.

The refusal is the point. A tool that filled in the second kind would turn a red
gate green by making packets assert things nobody established — evidence for
tests that were never run, verdicts on decisions nobody made. The gate would
pass and the repository would be lying. Roughly 139 packets and 1,100 rule
instances currently fail for exactly this reason, and they should keep failing
until someone who knows the answer writes it down.

---

## 2. USAGE

```bash
# report what could be repaired, changing nothing
node .opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs --roots specs

# repair one packet
node .../repair-derived.cjs --folder specs/<track>/<packet> --apply

# repair a subtree
node .../repair-derived.cjs --roots specs/<track> --apply
```

Reporting is the default. Application requires `--apply`, so the tool cannot
rewrite the fleet as a side effect of being run. A bare path is refused rather
than ignored: a dropped flag name would otherwise turn a one-packet command into
a rewrite of every packet in the tree.

Every step `--apply` performs is named by the report first, the re-derive
included, so the dry run is a preview of the writes rather than a summary of
some of them.

| Exit | Meaning |
|------|---------|
| 0 | Nothing left that this tool can repair |
| 1 | Repairable work found while reporting |
| 2 | Something failed: a rejected argument, a packet whose report could not be read, or a repair that did not land |

---

## 3. WHAT IT REPAIRS

| Failure | Recomputed from |
|---------|-----------------|
| Recorded folder name in the summary | The packet's own directory name |
| Packet pointer in document frontmatter | The packet's path beneath the specs root |
| Missing level in the generated description | The level the validator detects |
| Stale generated-metadata fingerprint | A re-derive over the packet's current sources |

Re-derivation happens inside the repair, not after it. Editing a document
invalidates the fingerprint taken over that document, so a repair that stopped
short would trade one error for another — which the first prototype did before
the ordering was fixed. It runs when this pass edited something or when a
graph-metadata rule is failing, and it is listed in the plan like any other
step; a re-derive that only happened under `--apply` was a write no report ever
mentioned and no exit code ever counted.

The pointer is read and written only inside a document's leading YAML block. A
`packet_pointer:` in the body is an illustration of the format, not the packet's
own record, and rewriting it corrupts the passage that explains it.

---

## 4. WHAT IT REFUSES

Repairable rules are an explicit allow-list. Any rule absent from it is counted,
reported, and left alone — refused by construction rather than by remembering
to. Widening the list is a deliberate act, and anything added to it must be
recomputable from repository state, not merely tedious to write by hand.

The tool prints what it declined, grouped by rule, so a reader can see how much
of the remaining debt is authored rather than mechanical.

---

## 5. LIMITS

- It shells out to the validator once per packet, and that call is the whole
  cost: about 1.9 seconds, of which the shell wrapper is 0.15 and module
  loading 0.06 — the rest is the validator's own rule subprocesses. Nothing
  here can make a packet cheaper, only run more of them at once, so a walk of
  the ~2,500-packet tree stays in the minutes. Scope with `--folder` or
  `--roots` when possible.
- Every packet is validated even when nothing about it can be repaired, because
  the census of what was refused is the other half of the report.
- Archived and scratch trees are skipped. They are frozen copies that will never
  be brought to current standards, and measuring them reports permanent debt
  nobody can act on.
- In CI it runs without `--apply`. A gate that silently rewrote packets would
  erase the drift it exists to surface.

---

## 6. REFERENCES AND RELATED RESOURCES

- `spec/validate.sh` — the rules this repairs against
- `graph/backfill-graph-metadata.ts` — the re-derivation entry point
- `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` — the precedent: regenerate derived files, leave authored ones to a person, run in CI without the repair flag
