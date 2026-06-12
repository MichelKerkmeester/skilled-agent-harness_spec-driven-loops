---
title: "L9 P2/P3 Sweep — Disposition"
description: "Verified across four parts: 60 still-real, 2 overtaken by this program's own work, 1 refuted, 1 superseded cross-lane. 25 doc fixes closed with live CLI spot-runs; code queue ~20 items incl. the two doc-fence carry-overs (.sh header, .json gold anchors)."
trigger_phrases:
  - "L9 sweep disposition"
  - "p2 p3 code queue"
importance_tier: "normal"
contextType: "implementation"
---
# L9 P2/P3 Sweep — Disposition

Verification: parts A 17/17, B 17/17, C 15/17 (tri-114, tri-116 OVERTAKEN by this program's own shipped work), D 13/14 (tri-159 REFUTED by pre-existing test assertions). Host correction on record: tri-192 is SUPERSEDED cross-lane — its "3/3 prose" proof was the L8 probe-harness artifact; under correct `--command` dispatch the same inline template passes 3/3 (see L8 disposition). Doc sweep CLOSED 25 findings (verdict `../verify/l9-docs-batch-verdict.md`, three residues remedied in-commit; the env count now ships WITH its counting method).

## Closed in code wave 4 (commit b8c6371669, Fable-verified)
tri-065/066/067 (fixture-validation chain: baseline fixtures regenerated strict-green, .cjs runner on the current JSON contract at 97 pass, all three suites wired into the tracked mcp_server test path via `test:spec-validation` — the scripts workspace package.json is gitignored by design, so its local wiring is convenience only). tri-169 (boundary-aware `keyword_present()` across all three router docs; the verifier found four surviving substring checks, remedied in the same commit). Supporting repair: both shell suites adjudicated case-by-case to the current validator contract (32/32, 108/108) without touching validator code; the orphaned CLI save-lane scrub test joined the tree.

## Code queue (open)
Part A: tri-006 (specFolder LIKE widening), tri-080 (silent indexer skip), tri-104 (unwired consumption stats), tri-105 (vec dual-write SSOT — code-careful), tri-108, tri-109 (ingest queue honesty — code-careful).
Part C: tri-111, tri-113, tri-117, tri-121, tri-122, tri-123, tri-124, tri-129 (write-path stress — code-careful), tri-135 (live-dim eval harness — code-careful), tri-142.
Part D: tri-161 (activeScope glob honesty), tri-179 (fixture-count gate), tri-182 (timeout marker gating).
Carry-overs from the doc fence: tri-125 (.sh header count), tri-158 (.json gold anchors, 11 stale).
Scoped follow-up: the ~39 undocumented env vars (tri-064 partial by design).
