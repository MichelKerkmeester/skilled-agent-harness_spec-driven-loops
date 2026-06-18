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

> **Tail-grind update (2026-06-13):** Part A doc/code closed — tri-080 (unsupported-language scan counter), tri-104 (telemetry doc); tri-106/107/081/139/149 verified ALREADY-CORRECT; tri-105 divergence-health shipped (data reconcile deferred). The remaining Part A/C smalls (tri-108/109/111/113/117/121/122/124, carry-overs 125/158) were council-deprioritized and routed to the dedicated follow-on — verify-first each (the stale-disposition pattern means several are likely already-fixed). Current program state is authoritative in `../handover.md` §3.

Verification: parts A 17/17, B 17/17, C 15/17 (tri-114, tri-116 OVERTAKEN by this program's own shipped work), D 13/14 (tri-159 REFUTED by pre-existing test assertions). Host correction on record: tri-192 is SUPERSEDED cross-lane — its "3/3 prose" proof was the L8 probe-harness artifact; under correct `--command` dispatch the same inline template passes 3/3 (see L8 disposition). Doc sweep CLOSED 25 findings (verdict `../verify/l9-docs-batch-verdict.md`, three residues remedied in-commit; the env count now ships WITH its counting method).

## Closed in code wave 4 (commit b8c6371669, Fable-verified)
tri-065/066/067 (fixture-validation chain: baseline fixtures regenerated strict-green, .cjs runner on the current JSON contract at 97 pass, all three suites wired into the tracked mcp_server test path via `test:spec-validation` — the scripts workspace package.json is gitignored by design, so its local wiring is convenience only). tri-169 (boundary-aware `keyword_present()` across all three router docs; the verifier found four surviving substring checks, remedied in the same commit). Supporting repair: both shell suites adjudicated case-by-case to the current validator contract (32/32, 108/108) without touching validator code; the orphaned CLI save-lane scrub test joined the tree.

## Stale-queue correction (audited 2026-06-12)
tri-006, tri-179 and tri-182 were already CLOSED by code wave 1 (commit 7c8740a426: escaped spec-folder scoping, the regression dataset-size floor gate, the reachable timeout marker) — the queue lines below had not been reconciled. The floor gate was re-proven live this session: a 3-case dataset fails `gates.total_cases` and exits 1.

## Code wave 7 (implemented, in verification)
tri-161: `code_graph_status` activeScope now exposes `includeGlobs`/`excludeGlobs` as structured fields and the label appends a "narrowed by includeGlobs: …" suffix, so a `*.ts`-only scan no longer reads as a full scan.

## Code wave 8 (implemented via xhigh seats, in verification)
tri-125 (extended-suite header states the real inventory — 38 registry entries, 66 fixtures, the TRUE 13 isolated rule scripts — and the fixtures README topology runs through 067; every count host-recounted, suite unchanged at 108/108). tri-158 (gold battery's 12 drifted line anchors re-anchored, anchor values only; static check 28/0/0/0).

## Code queue (open)
Part A: tri-080 (silent indexer skip), tri-104 (unwired consumption stats), tri-105 (vec dual-write SSOT — code-careful), tri-108, tri-109 (ingest queue honesty — code-careful).
Part C: tri-111, tri-113, tri-117, tri-121, tri-122, tri-123, tri-124, tri-129 (write-path stress — code-careful), tri-135 (live-dim eval harness — code-careful), tri-142.
Scoped follow-up: the ~39 undocumented env vars (tri-064 partial by design).
