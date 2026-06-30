---
title: "Follow-Ups: 004-code-index-stack"
description: "Ten concrete follow-ups surfaced by the consolidated changelog for the CocoIndex retrieval optimization arc. Each entry names what stalled or remained open, why it matters and the next concrete action."
trigger_phrases:
  - "004-code-index-stack follow-ups"
  - "cocoindex stack follow-ups"
  - "cocoindex retrieval arc follow-ups"
importance_tier: "normal"
contextType: "implementation"
---

# Follow-Ups: 004-code-index-stack

> Ten open follow-ups surfaced by the consolidated [CHANGELOG.md](./CHANGELOG.md). Read the changelog for shipped work. Read this for what remains.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/`

---

## 1. Phase 001 cocoindex-swap reconciliation

**What happened:** The 001 packet planned to swap CocoIndex from gemma to jina-code with an MPS (Apple Silicon Metal Performance Shaders) auto-detect patch. The packet docs are in Pending state. The actual production embedder swap that landed in this repo (`sbert/nomic-ai/CodeRankEmbed`) happened in `001-local-embeddings-foundation/018-*`, not here.

**Why it matters:** Anyone reading 001's spec.md sees a planning document for an embedder swap that has already happened (and to a different model than 001 named). The mismatch makes the packet feel like unfinished work even though the real swap shipped elsewhere.

**Concrete next action:** Either mark 001's spec.md status as "Superseded by 001-local-embeddings-foundation/018" with a forward-pointer link or close the packet entirely if no remaining content applies. The MPS auto-detect work named in 001 should be verified against current `cocoindex_code/settings.py` `_resolve_device` coverage. If the MPS path is already detected, name 001 as Closed-by-018 with a note that MPS is now standard.

---

## 2. Phase 005 declarative-registry reconciliation

**What happened:** Phase 005 is marked Pending in the packet but `cocoindex_code/registered_embedders.py` exists per the parent `spec.md` (which mentions it as the source of the live default). The packet docs and the live code are out of sync.

**Why it matters:** Same problem as follow-up #1. The packet looks unfinished. Worse, anyone planning to implement the registry will discover halfway through that the file already exists and need to back out.

**Concrete next action:** Read `cocoindex_code/registered_embedders.py` to see what shipped. Update the 005 packet docs accordingly. If the file matches the planned shape, mark Complete with a note in implementation-summary.md citing the file path and current manifest count. If gaps remain (e.g. the declarative `EmbedderMetadata` dataclass with `requires_ollama_daemon` field is not present), rescope 005 to cover only the remaining work.

---

## 3. Phase 006 install-guide-updates blocked on 005

**What happened:** Phase 006 plans operator-facing INSTALL_GUIDE and README updates for the new embedder layer. It is blocked on phase 005 reconciliation.

**Why it matters:** New operators landing on the CocoIndex skill have no documentation for the registry, the swap mechanism or the MPS auto-detect behaviour. The 020 P1 remediation touched these files for stale-default sweeps but did not author the new operator-facing section.

**Concrete next action:** Once follow-up #2 lands, ship the "Choosing an embedder" section in INSTALL_GUIDE.md modelled after the 003-skill-advisor-stack/003-install-guide-docs/spec.md template. Six subsections: current active default, registered alternatives (table sourced from `registered_embedders.py`), swap mechanism, operator-safe runbook reference, device selection (MPS plus CUDA plus CPU fallback chain) and cross-references. Add a smaller pluggable-layer subsection to README.md with a link to INSTALL_GUIDE.

---

## 4. Phase 008 chunking-strategy-tuning closed by 015

**What happened:** Phase 008 was a research-only phase planning to explore chunk size sweeps, overlap settings, semantic versus syntactic chunking and code-aware tree-sitter splitters. Phase 015 (code-aware-chunking-tree-sitter) shipped exactly that work.

**Why it matters:** Two packets in the same arc covering substantially overlapping scope creates confusion. A future operator scoping chunking work will not know which packet to read.

**Concrete next action:** Either mark phase 008 spec.md as "Closed by phase 015" with a forward pointer or merge 008's continuity ladder into 015's implementation-summary so the research-plus-implementation story lives in one place. Verify no other 008 deliverables remain (e.g. if 008 named a chunk-size sweep that 015 did not run, surface that as a separate residual).

---

## 5. Phase 010 daemon-resilience 7 patches not applied

**What happened:** Phase 010's deep-research documented 7 patches across `client.py` and `daemon.py` to fix zombie daemon leaks and CPU-spinning log spam. The research is Complete. The patches themselves were not applied inside this packet.

**Why it matters:** Long-running CocoIndex sessions can still leak processes and grow logs without bound. The research diagnoses the failure modes (non-idempotent `start_daemon`, six unsafe `send_bytes` sites, unconditional socket-unlink at startup, missing log rotation) but does not fix them.

**Concrete next action:** Open a follow-on implementation packet that applies the 7 patches. Use 010's research.md as the implementation plan. After the patches land, run the 24-hour 100-client soak test that 010 named as the durable proof point. Acceptance: zero `BrokenPipeError` lines, exactly one daemon process after concurrent `start_daemon` calls, log rotation at 10 MB with 5 backups. Add `test_daemon.py` and `test_e2e_daemon.py` (named in 010's key_files as new files but not yet present).

---

## 6. Phase 011 rerank-model-fit structural finding

**What happened:** Phase 011 identified a structural failure mode where `bge-reranker-v2-m3` (trained for general text retrieval, not code) demotes implementations below tests or references on paraphrase-heavy queries. The research recommendation was to investigate code-aware cross-encoder alternatives.

**Why it matters:** Phase 018's re-bench locked `jina-reranker-v3` as the production default, which may have closed the structural issue empirically (14 of 18 hits on the corrected fixture). But the underlying finding is a durable lesson worth keeping: reranker training corpus matters and general-text rerankers can demote semantically correct results.

**Concrete next action:** If `jina-reranker-v3` performance is satisfactory, mark phase 011 as Closed-by-018 with the structural finding preserved as a "lessons learned" note for future reranker swaps. If paraphrase-heavy regressions surface in production, revisit 011 and run the 4-failure-probe bench against newer code-aware cross-encoders (a candidate list can come from a 007-style HuggingFace survey filtered to cross-encoders).

---

## 7. Phase 023 deep-research arc has not started

**What happened:** Phase 023 scaffolded an 8-packet follow-on arc covering retrieval observability, request-budget hardening, upstream rebase spike, metadata fingerprint, doctor model-swap UX, prompt license registry, fixture calibration and a deferred vec0 migration fix. No implementation has shipped.

**Why it matters:** The 023 arc captures the operator-visible gaps that the deep-research pass surfaced. Until it ships, the production system has no per-query budget enforcement, limited observability into retrieval lane decisions, no automated drift detection against upstream CocoIndex and no in-band fixture calibration. Each gap is small in isolation. Together they are the difference between "this works on my laptop" and "this works under real operator load".

**Concrete next action:** Pick the highest-leverage child to ship first. Suggested priority: 002-retrieval-observability (gives operators visibility into which lane returned each hit, unblocks debugging) followed by 001-request-budget-hardening (prevents runaway memory or latency under pathological queries). The remaining 6 packets can land opportunistically. 008-vec0-migration-fix-deferred is explicitly deferred, so it stays at the back of the queue.

---

## 8. 24-hour 100-client daemon soak test has not been run

**What happened:** Phase 010 named a 24-hour soak test with 100 client connections as the verification target for daemon resilience. The soak was deferred because the patches it would validate were never applied.

**Why it matters:** The soak is the durable signal that the daemon does not leak processes or memory under realistic concurrent load. Without it, "the 7 patches work" is theoretical. With it, the patches become trustable production code.

**Concrete next action:** Bundle this with follow-up #5 (apply the 7 patches). After the patches land, run the soak overnight. Acceptance criteria: zero leaked Python processes after the run (`ps aux | grep cocoindex | wc -l` returns 1), zero `BrokenPipeError` lines in the log, log file size under 50 MB (5 backups × 10 MB cap with at least one rotation).

---

## 9. MPS auto-detect vitest coverage

**What happened:** Phase 001 named a vitest assertion for MPS auto-detect as a verification item. The packet did not ship.

**Why it matters:** MPS detection lives in `cocoindex_code/settings.py` `_resolve_device`. If the device-resolution logic regresses (e.g. someone reorders the fallback chain and accidentally prefers CPU on Apple Silicon), the only signal is users reporting slow inference. A unit test would catch the regression immediately.

**Concrete next action:** Add a small pytest covering `_resolve_device` behaviour: assert MPS is selected on Apple Silicon when available, CUDA when available and CPU as final fallback. Mock the underlying torch device-availability calls so the test runs deterministically on any host. This closes 001's named verification item even if the rest of 001 is closed as superseded.

---

## 10. Phase 019 and 022 are non-standard review packets

**What happened:** Phases 019 (deep-review-arc-013-to-018) and 022 (verification-p1-p2-remediation) are review packets without canonical spec files. They have review iterations, dashboards and reports but no spec.md, plan.md or implementation-summary.md.

**Why it matters:** `validate.sh --strict` may flag these as missing required files on future runs. The packets are real (they shipped useful review evidence) but they do not conform to the standard packet shape, which makes them invisible to tooling that expects canonical spec docs.

**Concrete next action:** Either retrofit minimal `spec.md` files documenting "this is a review-only packet, primary artifact is review-report.md" with the relevant `_memory.continuity` frontmatter or update `validate.sh` (or its config) to recognise review-packet shape as a legitimate variant. Retrofitting is cheaper and keeps tooling unchanged. The 005-cross-cutting-quality stack's 002-deep-review-stack used the same shape, so any solution here should generalise.
