---
title: "Research: sk-design routed-intra recall root cause"
description: "LUNA-xhigh investigation and orchestrator verification of the two low-recall scenarios."
trigger_phrases:
  - "sk-design recall investigation"
  - "routed-intra recall"
importance_tier: "critical"
contextType: "research"
parent: "sk-doc/019-skill-routing-refactor"
---

# Research: sk-design Routed-Intra Recall Root Cause

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research-core | v2.2 -->

## Method

A read-only investigation dispatched to GPT-5.6-LUNA at xhigh reasoning through cli-pi
(`pi -p --model openai-codex/gpt-5.6-luna --thinking xhigh --tools read,grep,find,ls`). The raw
model output is preserved in `luna-raw-findings.txt`. The orchestrator independently verified each
finding against the source files and the benchmark's `router-replay.cjs` resource-resolution path.

## Verified mechanism

The benchmark's `loadSurfaceRouter` reads `shared/references/smart-routing.md` (not the packet
SKILL.md) for a hub's resource recall. That file's INTENT_SIGNALS are scored `weight x keyword-hits`
and `selectIntents` keeps intents within `AMBIGUITY_DELTA = 1` of the top; since scores are multiples
of the weight, co-selection requires an exact tie.

## Findings

**PB-007 -- confirmed (LUNA class B).** The shared INTERFACE resource list carried `brief-to-dials.md`
but not `variation-diversity.md`, so a multi-direction probe scored recall 0.5. A narrow
`VARIATION_DIVERSITY` intent, mapped to both expected files, closes it.

**SR-004 -- LUNA class A refuted; corrected to class B.** LUNA proposed trimming the preflight card
from the gold as "over-specified." But the scenario is titled "Hub Is Routing Only" and is built to
verify the AI names the preflight card as the pass/fail owner -- the card is the expected answer, and
its probe carries the card's own domain vocabulary. Trimming would gut the test. The correct fix is to
wire the probe's vocabulary (`PREFLIGHT_OWNERSHIP`) to the card the scenario expects. The operator
confirmed this correction over LUNA's trim.

## Lineage credibility

Unlike the two cli-cursor review lineages this program dispatched (Composer and Grok, both fabricated
with zero tool activity and anomalous timestamps), the LUNA/cli-pi investigation was genuine: real
file:line citations, correct mechanism, and one of its two calls independently confirmed. Its SR-004
recommendation was still wrong on the merits -- a reminder that a genuine model finding remains a
hypothesis to verify.
