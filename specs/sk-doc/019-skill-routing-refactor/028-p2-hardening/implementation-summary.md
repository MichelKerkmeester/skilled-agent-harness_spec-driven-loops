---
title: "Implementation Outcome: Skill-Metadata P2 Hardening"
description: "Closed all ten P2 findings from the skill-metadata program deep review across three lanes (silent-failure hardening, containment tightening, test/doc honesty); added three negative-case tests; full gate sweep green with byte-identical generated manifests and no contract change."
trigger_phrases:
  - "skill metadata p2 hardening outcome"
  - "p2 backlog fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/028-p2-hardening"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Applied all ten fixes; added proving tests; ran the full gate sweep green"
    next_safe_action: "Adversarial diff verify, then commit and push to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
      - ".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-p2-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All ten P2s closed without any contract, schema, or generated-byte change"
      - "The report's suggested shared safeReaddir helper was declined; the two catches are documented in place"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Skill-Metadata P2 Hardening

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Verdict source** | `../027-program-deep-review/review/review-report.md` §3 (10 P2 backlog) |
| **Files changed** | 10 (+188 / -15) |
| **Contract/schema/byte change** | none |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed all ten P2 findings the two-model deep review recorded as an operator-gated hardening backlog, grouped into the report's three remediation lanes.

**Lane A — silent-failure hardening (P2-A, P2-E, P2-H).** Both fleet-gate CLIs gained a `statSync` directory precheck in `run()`: a missing or non-directory `--skills-dir` now exits 2 ("cannot run") instead of falling through discovery to a false-green `checked=0 exit 0`. The top-level `findSkillRoots` catch narrowed to ENOENT-only — a missing tree is still a legitimate empty result, but a permissions error or a regular file passed as the root now surfaces. The freshness gate's "cannot run" code moved from 1 to 2 so the two siblings agree, and both file headers now document exit 2. The two deliberate skip-and-continue subdir catches (which forgo an unreadable packet branch rather than aborting the fleet walk) gained a WHY comment.

**Lane B — containment tightening (P2-B, P2-C, P2-J).** `readStandaloneConfig` now rejects a `packet` that resolves outside its skill root with `PACKET_OUT_OF_ROOT`, before the walker can enumerate — and publish leaf ids for — a sibling skill's files. The command-metadata schema flags a within-entry duplicate owned signal under its own `DUPLICATE_OWNED_SIGNAL_WITHIN_ENTRY` code (dead weight in one list, distinct from cross-command routing ambiguity) and continues. The choreography resource probe dropped its skill-root fallback and now resolves repo-root-relative only, matching the stated contract instead of silently accepting a hub-relative path.

**Lane C — test and documentation honesty (P2-D, P2-F, P2-G, P2-I).** `isWithin` swapped its hardcoded `/`-prefix test for `isAbsolute`, correct for a cross-drive Windows child and unchanged on POSIX (where `relative` never returns an absolute path). The watcher integration test resolves chokidar from a candidate list — the advisor's own `node_modules` first, then the spec-kit shared install — with an existsSync guard, instead of a hardcoded cross-package path. The creation journey proof now asserts scaffold-vs-template shape equivalence for the standalone `graph-metadata.json` and `leaf-manifest.config.json`, catching drift between the scaffolder's inline literals and the hand-author templates. The pre-push first-push diff-guard fallback gained a comment explaining that a first push is deliberately gated by CI, not the local hook.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was re-verified against source at its cited file:line before the fix, then fixed at that exact site. Three new negative-case tests lock the new load-bearing behaviors, each asserting an error or exit code that only exists because of its fix: `DUPLICATE_OWNED_SIGNAL_WITHIN_ENTRY` and the gate exit-2 on a non-directory `--skills-dir` in the contract test, and `PACKET_OUT_OF_ROOT` on an escaping standalone packet in the leaf-resource test. The report's suggested shared `safeReaddir` helper (lane A) was evaluated and declined: the finding was that the catches were undocumented, not that they needed a shared abstraction, so documenting them in place is the smaller correct fix.

A fresh-eyes adversarial review of the full diff returned **CLEAN** with HIGH confidence: every attack surface was refuted against the code — the packet-escape guard defeats the `foo/../..` normalize-back bypass (`path.resolve` normalizes lexically before `relative`), the within-entry `continue` does not hide a later cross-command collision (the first occurrence registers in `seenSignals` before any duplicate `continue` fires), `isWithin` has no POSIX behavior change (`isAbsolute` and `startsWith('/')` are definitionally identical on POSIX, where `relative` never returns an absolute path), and all seven authored `command-metadata.json` files use repo-root-relative resources so dropping the skillDir fallback breaks nothing. One out-of-scope informational note: the schema JSDoc param is still named `hubRelativePath` while the behavior is repo-root-relative — pre-existing drift not touched by this packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Kept every fix additive — guards, tests, and comments — with no change to the H/S contract, the command-metadata schema shape, or any generated-file bytes. Adjudicated P2-B/J as containment tightening rather than a contract rewrite: the contract already said repo-root-relative, so the fix is enforcing it, not redefining it. Moved the freshness gate's "cannot run" exit code to 2 (a breaking change only for a caller that keyed on the old exit 1 for bad input) because exit 1 must stay reserved for a genuinely stale manifest — conflating the two was the traceability finding.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Full gate sweep, all green:
- `ci-skill-root-metadata.cjs`: `checked=11 passed=11 failed=0 fixed=0` (exit 0); exit 2 confirmed end-to-end for a regular file and a missing dir passed as `--skills-dir`.
- `ci-leaf-manifest-freshness.cjs`: `checked=11 fresh=11 failed=0` (exit 0); exit 2 confirmed on bad input — generated manifests regenerate byte-identical.
- Unit suites: `skill-root-metadata-contract.test.cjs`, `leaf-resource-contract.test.cjs`, `create-journey-proof.test.cjs` all pass (with the three new negative cases).
- Watcher: `daemon-watcher-new-root-ingestion.vitest.ts` + `daemon-watcher-resource-leaks-*.vitest.ts` — 12 tests pass, real-chokidar integration included.
- `parent-skill-check.cjs`: 0 FAIL on sk-doc, sk-code, system-deep-loop.
- `run-all-drift-guards.sh`: 3/3 PASS (alignment-drift, stack-folders, router-sync).

Changeset: 10 files, +188 / -15, no `.opencode/package.json` pin bump, no tracked node_modules.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The 3 pre-existing advisor vitest files that fail on an `@opencode-ai/plugin/tool` import-resolution error in the worktree are untouched by this packet and unrelated to these fixes. The `isWithin` cross-drive fix is correct-by-construction and covered by the existing containment tests, but has no Windows CI to exercise the drive-letter path directly — the guarantee rests on `isAbsolute` being the platform-correct predicate.
<!-- /ANCHOR:limitations -->
