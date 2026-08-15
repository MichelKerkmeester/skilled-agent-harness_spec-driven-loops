#!/usr/bin/env bash
# Central config for the v4 release-notes pipeline. Sourced by every phase script.
# All paths auto-derive from the git repo, so the pipeline runs from any session
# without hard-coded, session-scoped temp paths (the trap that bit the first run).

# --- locations -------------------------------------------------------------
REPO="$(git rev-parse --show-toplevel 2>/dev/null)"
SPEC="$REPO/specs/system-speckit/000-release"
# Durable, regenerable work dir under HOME (survives sessions; safe to delete).
WORK="${V4_RN_WORK:-$HOME/.cache/v4-release-notes}"
SRC_DIR="$WORK/sources"          # bounded per-packet source blobs
FRAG_DIR="$WORK/fragments"       # per-packet extracted fragments (json)
RAW_DIR="$WORK/raw"              # raw model stdout (debug)
FAIL_DIR="$WORK/failures"        # per-packet error logs
STATE_DIR="$WORK/state"          # phase-completion markers (resume)
LOG="$WORK/run.log"
MANIFEST="$WORK/manifest.tsv"

# Durable OUTPUTS (committed with the packet)
OUT_FRAGMENTS="$SPEC/002-per-packet-extraction/fragments.jsonl"
OUT_SECTIONS="$SPEC/003-synthesis/sections"
OUT_NOTES="$SPEC/004-release-notes-reduce/release-notes-v4.0.0.0.md"
OUT_README_DELTA="$SPEC/005-readme-update/readme-delta.md"

# --- release window --------------------------------------------------------
BASELINE_TAG="${V4_RN_BASELINE:-v3.6.0.0}"
TARGET_REF="${V4_RN_TARGET:-HEAD}"
VERSION="v4.0.0.0"

# --- models (CHEAP ONLY) ---------------------------------------------------
# Phase 2 extraction: high-volume, mechanical -> DeepSeek V4 Flash via the
# subsidized opencode-go gateway. Proven clean headless this session.
EXTRACT_MODEL="opencode-go/deepseek-v4-flash"
CONCURRENCY="${V4_RN_CONCURRENCY:-5}"
DISPATCH_TIMEOUT="${V4_RN_TIMEOUT:-180}"

# Phase 3-5 synthesis: reasoning/narrative.
#   opencode -> opencode-go/deepseek-v4-pro (default; same gateway as extract =
#              one auth, one dispatch shape = most reliable for a hands-off run).
#   devin    -> glm-5-2 (GLM-5.2 High, free tier) via cli-devin. The operator's
#              stated synthesis model; needs `devin auth login` + a smoke test.
# Switch with:  export V4_RN_SYNTH_KIND=devin
SYNTH_KIND="${V4_RN_SYNTH_KIND:-opencode}"
SYNTH_MODEL_OPENCODE="opencode-go/deepseek-v4-pro"
SYNTH_MODEL_DEVIN="glm-5-2"

# --- shared dispatch env (fan-out hang guard + child spec-gate neutralize) --
export MK_SPEC_GATE_ENFORCE=0
export AI_SESSION_CHILD=1

# Gate 3 is pre-approved for this packet; dispatched children must not ask.
SPEC_FOLDER_REL="specs/system-speckit/000-release"
