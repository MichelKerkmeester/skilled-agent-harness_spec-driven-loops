---
title: "Implementation Plan: Phase 1: jev-contract-research-and-pin"
description: "Pin the jev 0.6.2 CLI and jev-mcp contract from the vendored source and a live binary, capture the evidence under scratch/, and transcribe it into packet references tagged by evidence class."
trigger_phrases:
  - "implementation plan"
  - "approach and phases"
  - "testing strategy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin"
    last_updated_at: "2026-09-20T10:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan executed as written; no step was re-scoped"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-001-jev-contract-research-and-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: jev-contract-research-and-pin

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language | Python 3.13 (the tool), shell and Python for the probes |
| Install | `uv tool install jev-cli` — reversibly adds `jev` and `jev-mcp` to `PATH` |
| Source of truth | The vendored 0.6.2 tree under `context/jev-cli-main`, cross-checked against the installed binary |
| Evidence | `scratch/` transcripts, excluded from the retrieval index by convention |
| Dependencies | None. The phase installs its own tool and needs no provider credential to pin the unauthenticated surface |

### Overview

Read the vendored source to form a contract hypothesis, install the same version to test it, and write down only what survives both. The probes are deliberately unauthenticated: the exit taxonomy, the flag surface and the MCP tool list are all reachable without a key, and a judgment call would have cost quota to confirm a shape the source already fixes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The vendored tree is present and its version is read before anything is installed
- The install's rollback sentence is written down (`uv tool uninstall jev-cli`)
- Every probe is a script file, so its output is reproducible and its command list is reviewable

### Definition of Done

- Every claim in the packet references carries an evidence tag
- The exit-code matrix covers each documented class, including a negative control with its own expected failure
- Claims that no available credential can settle are listed as unconfirmed rather than asserted
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Hypothesis, then probe, then transcribe. The source fixes the hypothesis (flags, exit codes, request and answer shapes), the binary tests it, and the references are written from the intersection. Where the two disagree — and they did, on `--endpoint` being hidden from help — the reference records the discovery rather than the help text's account of it.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `scratch/probe-surface.sh` | Version, both help surfaces, auth status, and the source map |
| `scratch/probe-matrix.sh` | The 12-command exit-code matrix plus the two controls |
| `scratch/mcp-probe.py` | A stdio client that initializes `jev-mcp` and lists tools without calling one |
| `cli-jev/references/` | The transcribed contract, one file per surface |

### Data Flow

Vendored source → hypothesis → probe scripts → captured transcripts → references. Each arrow is reviewable: a reader who doubts a claim reads the transcript, and a reader who doubts the transcript re-runs the script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Name | Outcome |
|-------|------|---------|
| 1 | Source map | The tree's shape, entry points and declared version |
| 2 | Live install and surface probe | A binary whose version matches the vendored tree, plus its resolved flag surface |
| 3 | Exit-code matrix and controls | Every documented exit class observed, including the credential-free and connection-failure controls |
| 4 | MCP handshake | The live tool set and argument schemas |
| 5 | Transcription | The packet references, tagged by evidence class |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A contract pin is verified by re-running it. Each probe script is standalone and stateless, so a future maintainer can re-run it against a newer release and diff the transcript instead of trusting a summary. The two controls exist because the positive cases alone cannot distinguish "the CLI checked the key" from "the CLI happened to fail": clearing every key and reading the exit status is what proves the credential check precedes the network call.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why it matters | If unavailable |
|------------|----------------|----------------|
| `uv` | Installs and uninstalls the tool | Read the source only and mark every live claim as unverified |
| Network reachability to a provider | Needed only for an authenticated probe | Not required for this phase's criteria |
| Provider credential | Settles the live response body and default model ids | Recorded as unconfirmed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`uv tool uninstall jev-cli` removes both binaries and leaves the vendored tree untouched. The probe artifacts are additive files under `scratch/` and the references are additive documents, so reverting this phase means deleting them; nothing else in the repository was modified.
<!-- /ANCHOR:rollback -->
