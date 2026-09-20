---
title: "Implementation Summary: sk-code family playbook remediation"
description: "All seven sk-code playbook roots now report zero operator-scenario violations at fail-closed tier, with the hub's single routing-gold exclusion unchanged and no root reclassified to reach the number."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "sk-code family playbook remediation implementation"
  - "sk-code forbidden verdict summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/001-sk-code-family"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the sk-code family cleanup; seven roots verified at zero violations"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-review/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-quality/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:5348cb1c9eedc02236e1710b96b9479fef24fe04582ed05ad86fae89b5fc2162"
      session_id: "2026-08-29-sk-code-031-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-code family playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-sk-code-family |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — 586 violations across five roots cleared to zero, verified per root at fail-closed tier |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five dirty roots in the sk-code family went from 586 operator-scenario contract violations to zero, and the two roots that were already clean stayed clean.

1. **`sk-code` hub: 181 violations to zero.** Final census `scenarios=32 categories=11 operator=31 routing_gold_excluded=1 violations=0 warnings=0`. The single excluded file is the registered `compiled-routing/` routing-gold path, which was carried through the phase untouched.

2. **`sk-code-review`: 129 violations to zero.** Final census `scenarios=31 categories=9 operator=31 routing_gold_excluded=0 violations=0`. Its largest single class was 24 `FORBIDDEN_VERDICT` instances, all of them the residue of a prior literal alignment to sk-doc that had imported a `PARTIAL` grading vocabulary the validator forbids outside a routing-gold root.

3. **`sk-code-webflow`: 156 violations to zero.** Final census `scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0`.

4. **`sk-code-opencode`: 108 violations to zero.** Final census `scenarios=9 categories=3 operator=9 routing_gold_excluded=0 violations=0 warnings=0`.

5. **`sk-code-quality`: 12 violations to zero.** Final census `scenarios=1 categories=1 operator=1 routing_gold_excluded=0 violations=0 warnings=0`.

6. **The two already-clean roots held.** `sk-code-mobile-cli` at `scenarios=26 categories=7` and `sk-code-obsidian` at `scenarios=27 categories=7`, both `violations=0 warnings=0`. Their coverage expansion is `034-surface-playbook-expansion`, not this phase.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The manifest was read before any document was edited, which is what turned `sk-code-review`'s largest violation class from a list of 24 authoring mistakes into one imported decision. sk-doc is registered in `routingGoldRoots`; that registration is what permits its four-way `PASS`/`PARTIAL`/`FAIL`/`SKIP` grading and exempts its scenarios from the operator contract. `sk-code-review` is not registered there, so aligning it literally to sk-doc's surface without its manifest entry gave the package a vocabulary its own `FAIL_CLOSED` tier rejects. The repair was to drop the imported vocabulary, not to add the package to the list that would have made it legal — adding it would have cleared 129 violations by removing the package from enforcement entirely.

Every count in this record is a re-measurement taken by the coordinator with `validate-playbook-package.cjs --package <root> --strict`, not a number reported by the agent that did the remediation. The census line, rather than the exit code, is what was read: it carries `tier`, `operator`, and `routing_gold_excluded` alongside `violations`, so a root that reached zero by repair and a root that reached zero by reclassification look different in the output. Across all seven roots the tier stayed `FAIL_CLOSED` and the exclusion counts stayed where they started.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove `sk-code-review`'s imported grading vocabulary rather than register the package for it | Registration in `routingGoldRoots` would have exempted all 31 of its scenarios from the operator contract and moved it to tier WARN. The count would have gone to zero and the enforcement would have gone with it. |
| Hold every root at `tier=FAIL_CLOSED` and leave `routing_gold_excluded` untouched | These two fields are the difference between a repaired root and a reclassified one. Freezing them makes the census line itself the control on the work. |
| Measure per root with `--package`, never through the fleet roll-up | A fleet run resolves a nested package to its parent identifier, so a sub-package's state can be reported under a name that is not its own. Per-root runs give each package its own id and its own tier. |
| Treat the two already-clean roots as out of scope rather than as free wins | They were at zero before this phase started. Their work was coverage breadth, which belongs to `034-surface-playbook-expansion`; claiming it here would inflate this phase's result with someone else's. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sk-code` hub | PASS — `scenarios=32 categories=11 operator=31 routing_gold_excluded=1 violations=0 warnings=0` |
| `sk-code-review` | PASS — `scenarios=31 categories=9 operator=31 routing_gold_excluded=0 violations=0` |
| `sk-code-webflow` | PASS — `scenarios=13 categories=4 operator=13 routing_gold_excluded=0 violations=0 warnings=0` |
| `sk-code-opencode` | PASS — `scenarios=9 categories=3 operator=9 routing_gold_excluded=0 violations=0 warnings=0` |
| `sk-code-quality` | PASS — `scenarios=1 categories=1 operator=1 routing_gold_excluded=0 violations=0 warnings=0` |
| Already-clean roots held | PASS — `sk-code-mobile-cli` 26 across 7 and `sk-code-obsidian` 27 across 7, both `violations=0 warnings=0` |
| Hub routing-gold exclusion intact | PASS — `routing_gold_excluded=1`, the registered `compiled-routing/` path, unchanged by the remediation |
| No reclassification used to reach zero | PASS — all seven roots report `tier=FAIL_CLOSED`; `warnPackages` contains no sk-code entry |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The starting counts cannot be re-derived from the final state.** Every root is at zero now, so the 181, 129, 156, 108 and 12 recorded here are the coordinator's measurements taken before the repair and cannot be reproduced by anyone reading the packet afterwards. They are recorded as measurements, not as reproducible checks.
2. **Zero violations is not zero warnings.** `sk-code-review` still reports one advisory warning in the final census. The operator-scenario contract does not block on warnings, and none was cleared to reach the result claimed here.
<!-- /ANCHOR:limitations -->
