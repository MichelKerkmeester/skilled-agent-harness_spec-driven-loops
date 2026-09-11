---
title: "Verdict: CLI and MCP payload parity"
description: "What the parity harness proved across 22 frozen cases, the two allowlisted difference classes and why each is not a divergence."
trigger_phrases:
  - "advisor parity verdict"
  - "cli mcp parity"
  - "parity allowlist"
  - "advisor error envelope"
importance_tier: "important"
contextType: "reference"
---
# Verdict: CLI and MCP payload parity

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> 22 frozen cases across all nine commands, run against the live daemon with mutating cases
> confined to an isolated database copy. Reproduced independently of the run that built the harness.

---

## 1. RESULT

| Measure | Value |
|---------|-------|
| Cases | 22 |
| Identical after volatile fields are stripped | 7 |
| Differing | 15 |
| Distinct difference classes | 2 |
| Real database checksum before and after | identical, `3a9f0f61a2f7…` |

Fifteen differing cases sounds worse than it is. Every difference falls into one of two classes,
and neither is a divergence in what the advisor computes.

---

## 2. CLASS ONE: THE ERROR ENVELOPE

Ten cases, every one of them an error path returning exit 64. They differ at `$.error` and
`$.exitCode`, plus `$.code` on two, `$.tool` on one, and the whole document on the unknown-command
case.

This is the CLI owning something MCP has no concept of. The CLI is a process: it must map a failure
onto an exit code and print a machine-readable error to stderr. MCP returns a protocol error object
to a client that never had an exit status. The two cannot be identical without one of them
pretending to be the other.

**Allowlisted, with the exit taxonomy as the contract.** What must hold after the transport goes is
that the CLI's error behavior stays what it is today, which the taxonomy tests cover.

---

## 3. CLASS TWO: THE CACHE-HIT FLAG

Four cases, all successful recommendations, differing only at `$.data.cache.hit`.

This was tested rather than assumed. Two identical CLI calls made back to back against a novel
prompt return `hit: false` then `hit: true`. The harness runs each case through one surface and
then the other, so whichever runs second reports the hit the first one warmed.

**This is evidence for the packet's central claim, not against it.** The two surfaces share one
daemon and one cache. A CLI front door that missed the cache the MCP surface warmed would be the
real finding.

**Allowlisted as a run-order artifact.**

---

## 4. WHAT THE RESULT ACTUALLY SAYS

On every success path, the recommendation payload is identical between the two surfaces: the same
skills, scores, confidence values, lane attribution and trust state. The only success-path
difference in the whole run is a boolean saying who warmed the cache.

That is the parity claim this packet rests on, and it holds.

---

## 5. WHAT IS STILL OWED IN THIS PHASE

- The harness has no allowlist concept, so its exit status is 1 whenever any case differs. It needs
  to read the two classes above from the frozen set and exit 0 when every difference is allowlisted.
- The exit taxonomy needs a test per code rather than the incidental coverage the error cases give it.
- Two volatile fields were added to the frozen set during this run, `cacheHitP95Ms` and
  `uncachedP95Ms`, which are measured latencies. That moved the identical count from 6 to 7.

---

## 6. SIDE EFFECTS OBSERVED

- The real skill graph was not written: identical checksum before and after.
- The workspace generation counter moved by five per run, from 1088 to 1093. It anchors on the
  repository root and honors no isolation override, which is recorded as a phase finding.
