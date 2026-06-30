#!/usr/bin/env bash
# Deep-review fleet: 10 narrow-slice read-only seats over the work under review.
# Seats 01-05 = claude2-opus (judgment-heavy); seats 06-10 = gpt-5.5-fast (mechanical). Waves respect concurrency caps.
set -u
REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P150="$REPO/.opencode/specs/skilled-agent-orchestration/145-mcp-open-design"
SEATS="$P150/review/seats"
CLAUDE2="/Users/michelkerkmeester/.superset/bin/claude"
mkdir -p "$SEATS"
cd "$REPO" || exit 1
: > "$SEATS/_status.txt"

GT="$P150/001-terminal-control-and-integration-research/research/seats/seat-a.findings.md"
RES="$P150/001-terminal-control-and-integration-research/research/research.md"

PREAMBLE="You are an ADVERSARIAL reviewer. READ-ONLY: do not create, modify, or delete any file, and do not run git. Your job is to find REAL problems, not to rubber-stamp.

CONTEXT: A new skill mcp-open-design was built (terminal control of the installed Open Design desktop app via its od CLI and stdio MCP server), and sk-interface-design was de-vendored from the ui-ux-pro-max MIT data and integrated with it. The VERIFIED ground truth about Open Design is in:
  $GT  (terminal surface, tagged CONFIRMED vs INFERRED)
  $RES  (synthesis)
Hold the work to that ground truth. Stating an INFERRED fact as CONFIRMED, or a capability the research flagged NEEDS-LIVE-VERIFICATION, is a finding.

Review ONLY your assigned slice (narrow scope). FIND: inaccuracies vs the verified OD behavior, over-claims, licensing defects, dangling references (links or paths to deleted files), anti-default leaks (a style-chooser or pick-a-vibe menu), internal inconsistencies, sk-doc non-conformance, and anything that would mislead a user or break.

OUTPUT each finding on its own line as: [P0|P1|P2] path:line - issue - WHY it matters - FIX. (P0 = breaks or ships wrong or a license violation; P1 = inaccurate or misleading; P2 = polish.) Cite real path:line evidence. If a claim cannot be verified from the files, write UNVERIFIED rather than guessing. End with: VERDICT: PASS | PASS-WITH-FINDINGS | FAIL, and counts P0=n P1=n P2=n. Output your COMPLETE findings as your final reply."

S1="SLICE 1 - mcp-open-design SKILL.md accuracy. Read .opencode/skills/mcp-open-design/SKILL.md against the ground-truth files. Is od correctly described as node daemon-cli.mjs (not vela, not on PATH)? Are mutating and destructive tools gated? Is the verify-live-tools-list caveat present? Is the socket-not-7456 and daemon-dies-with-app reality stated? Is the sk-interface-design integration anti-default (no style chooser)?"
S2="SLICE 2 - sk-interface-design de-vendor licensing and completeness. Read .opencode/skills/sk-interface-design/SKILL.md, LICENSE.txt, changelog/v1.1.0.0.md, then run: grep -rn -iE 'ui-ux-pro-max|design_search|assets/data|LICENSE-ui-ux|THIRD-PARTY' .opencode/skills/sk-interface-design . Confirm the skill is Apache-2.0 only, LICENSE.txt (Apache) is kept, design_principles.md is unchanged Anthropic content, and the 9 CSVs plus 2 scripts plus 2 MIT notices are gone. The ONLY acceptable residual matches are the historical changelog/v1.0.0.0.md and the LICENSE.txt boilerplate. Any MIT residue on the live surface, or Apache content shipping without its license, is a P0."
S3="SLICE 3 - Open Design integration soundness. Read .opencode/skills/sk-interface-design/references/claude_design_parity.md, references/design_inventory.md, and SKILL.md sections 2 and 7. Is the integration anti-default (the ~150 OD systems are NEVER a pick-a-vibe menu, resolve ONE system from the subject)? Is the live-read-only and never-cache guardrail explicit? Is design_principles.md still the authority? Is it lean (no generator, no chooser)? A leak that turns the skill into a templated generator is a finding."
S4="SLICE 4 - research honesty and 150 spec validity. Read $RES and the 150 spec docs (parent spec.md, the 001 child spec.md, plan.md, tasks.md, implementation-summary.md). Are CONFIRMED vs INFERRED claims clearly separated? Are NEEDS-LIVE-VERIFICATION items honestly carried? Does any research claim contradict the installed bundle or the seat findings? Are the spec docs internally consistent (phase map, statuses)?"
S5="SLICE 5 - cross-skill coherence. Compare graph-metadata.json + SKILL.md of mcp-open-design and sk-interface-design, plus mcp-magicpath/graph-metadata.json. Are the graph edges reciprocal and correct (mcp-open-design siblings mcp-magicpath and depends_on sk-interface-design; mcp-magicpath sibling mcp-open-design)? Is the shared claude_design_parity loop consistent across all three SKILLs? Any contradiction in what the three say about each other?"
S6="SLICE 6 - mcp-open-design references accuracy. Read .opencode/skills/mcp-open-design/references/od_cli_reference.md, mcp_wiring.md, tool_surface.md against the ground-truth seat-a.findings.md. Are the exact commands correct (the daemon-cli.mjs path, the ELECTRON_RUN_AS_NODE form, the opencode.json mcp.open-design entry shape, the claude mcp add form)? Is the ~18-tool surface (11 read, 5 mutating, 2 destructive) accurate? Any command that would fail or mislead?"
S7="SLICE 7 - mcp-open-design feature_catalog and manual_testing_playbook. Read .opencode/skills/mcp-open-design/feature_catalog/ and manual_testing_playbook/. Run: python3 .opencode/skills/sk-doc/scripts/validate_document.py on both root indexes. Is the negative control present (an unconfirmed mutating call must be refused)? Are feature and scenario counts accurate vs files on disk? Do all index links resolve? sk-doc conformance?"
S8="SLICE 8 - sk-interface-design feature_catalog and manual_testing_playbook post-de-vendor. Read .opencode/skills/sk-interface-design/feature_catalog/ and manual_testing_playbook/. Run validate_document.py on both root indexes. Do the feature counts in the index match the files on disk? Are the rewritten ID-004 (OD system as default-to-deviate) and ID-007 (Apache-only provenance) sound? Any dangling reference to the deleted CSVs, scripts, or notices? Any broken link?"
S9="SLICE 9 - graph-metadata correctness. Read graph-metadata.json of mcp-open-design, sk-interface-design, and mcp-magicpath. Is each valid JSON on its established schema? Do all key_files paths exist on disk (no reference to deleted design_search.py or THIRD-PARTY-NOTICES.md)? Are the edges reciprocal and sensible? Any stale CSV or MIT reference in causal_summary or key_topics?"
S10="SLICE 10 - link and reference integrity sweep. Across .opencode/skills/mcp-open-design/, .opencode/skills/sk-interface-design/, and the 150 packet, do all internal markdown links resolve to files that exist? Are there references (prose or tables) to deleted files (CSVs, design_search.py, MIT notices) on the LIVE surface, excluding the historical changelog/v1.0.0.0.md and LICENSE.txt? Any broken cross-skill relative path (for example to claude_design_parity.md or to mcp-open-design)?"

run_claude2() { local n="$1"; local slice="$2"
  CLAUDE_CONFIG_DIR="$HOME/.claude-account2" AI_SESSION_CHILD=1 gtimeout 900 \
    "$CLAUDE2" -p "$PREAMBLE

$slice" --model claude-opus-4-8 --permission-mode bypassPermissions --output-format text \
    > "$SEATS/seat-$n.out" 2>&1 &
}
run_oc() { local n="$1"; local slice="$2"
  AI_SESSION_CHILD=1 gtimeout 800 \
    opencode run --model openai/gpt-5.5-fast --variant high --format json --dir "$REPO" \
    "$PREAMBLE

$slice" </dev/null > "$SEATS/seat-$n.out" 2>&1 &
}

echo "WAVE A start $(date -u +%H:%M:%S)" >> "$SEATS/_status.txt"
run_claude2 01 "$S1"; run_claude2 02 "$S2"; run_claude2 03 "$S3"; run_oc 06 "$S6"; run_oc 07 "$S7"
wait; echo "WAVE A done $(date -u +%H:%M:%S)" >> "$SEATS/_status.txt"
echo "WAVE B start $(date -u +%H:%M:%S)" >> "$SEATS/_status.txt"
run_claude2 04 "$S4"; run_claude2 05 "$S5"; run_oc 08 "$S8"; run_oc 09 "$S9"
wait; echo "WAVE B done $(date -u +%H:%M:%S)" >> "$SEATS/_status.txt"
echo "WAVE C start $(date -u +%H:%M:%S)" >> "$SEATS/_status.txt"
run_oc 10 "$S10"
wait; echo "WAVE C done $(date -u +%H:%M:%S)" >> "$SEATS/_status.txt"
echo "REVIEW FLEET COMPLETE" >> "$SEATS/_status.txt"
wc -c "$SEATS"/seat-*.out >> "$SEATS/_status.txt" 2>&1
