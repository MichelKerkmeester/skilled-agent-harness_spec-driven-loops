#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-GRAPH-METADATA-CHILD-IDENTITY
# ───────────────────────────────────────────────────────────────
# Flags graph-metadata.json children_ids entries whose leading path segments
# do not name this packet's own current identity. A children_ids entry is
# addressed as `<packet identity>/<child>`, so an entry with a different
# leading identity is residue from an earlier name or location of the packet:
# the packet moved on disk and the entry did not move with it. The writer's
# merge unions persisted children and previously never dropped those entries,
# so after a rename the old identity's children stayed listed forever and the
# declared child set drifted away from the real one.
#
# This is the identity-direction complement of GRAPH_METADATA_CHILD_DRIFT:
# that rule reports on-disk children the list is missing (a refresh would add
# them); this one reports listed entries that no refresh of the current
# identity would ever produce. Entries carrying the packet's own identity but
# pointing at a folder that is gone are deliberately NOT reported here — only
# an explicit prune may remove those, and flagging them would demand an action
# a plain refresh does not perform.
#
# The packet's identity is its specs-root-relative path, which the metadata's
# packet_id field carries; the on-disk path is preferred when the folder sits
# under a recognizable specs root so a renamed folder is compared against what
# it is now, not what the metadata last recorded. Entries may carry a legacy
# full prefix (`.opencode/specs/...` or `specs/...`); that prefix is stripped
# before comparing, mirroring the writer's own path normalization.
#
# Enforcing: emits a hard error. Registry severity is error because a
# foreign-identity entry is unambiguously wrong data — no packet shape makes
# it legitimate. Flag-only: never edits a file.

set -euo pipefail

run_check() {
    local folder="$1"
    local _level="${2:-}"

    RULE_NAME="GRAPH_METADATA_CHILD_IDENTITY"
    RULE_STATUS="pass"
    RULE_MESSAGE="children_ids entries all carry the packet's own identity"
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local graph_file="$folder/graph-metadata.json"
    # Presence and shape of graph-metadata.json belong to the presence and
    # shape checks; with no file there is no children_ids to inspect.
    if [[ ! -f "$graph_file" ]]; then
        RULE_MESSAGE="no graph-metadata.json present; child-identity check not applicable"
        return 0
    fi

    local foreign_list="" foreign_rc=0
    foreign_list=$(node --input-type=module - "$graph_file" "$folder" 2>/dev/null <<'NODE_IDENTITY'
import { readFileSync } from 'node:fs';
const [graphFile, folder] = process.argv.slice(2);
let parsed;
try {
  parsed = JSON.parse(readFileSync(graphFile, 'utf8'));
} catch {
  process.exit(21); // unreadable graph metadata — shape/presence checks own that
}
// The packet's current identity is its specs-root-relative path. Under a real
// specs root the on-disk path is authoritative; elsewhere (fixtures, unusual
// layouts) the packet_id field is the best available witness. Both shapes are
// what real metadata carries, and they agree on a refreshed packet.
let identity = null;
for (const marker of ['/.opencode/specs/', '/specs/']) {
  const markerIndex = String(folder).indexOf(marker);
  if (markerIndex >= 0) {
    identity = String(folder).slice(markerIndex + marker.length);
    break;
  }
}
if (identity === null && typeof parsed.packet_id === 'string' && parsed.packet_id.trim() !== '') {
  identity = parsed.packet_id.trim();
}
if (identity === null) process.exit(0); // no identity to compare against — not this rule's finding
// Legacy entries may repeat the specs root inside the id; strip it the same
// way the writer normalizes stored paths before comparing.
const stripSpecsRootPrefix = (entry) => {
  const normalized = String(entry).replace(/\\/g, '/').replace(/^\.\//, '');
  for (const marker of ['.opencode/specs/', 'specs/']) {
    if (normalized.startsWith(marker)) return normalized.slice(marker.length);
  }
  return normalized;
};
const identityPrefix = `${identity}/`;
const foreign = (Array.isArray(parsed.children_ids) ? parsed.children_ids : [])
  .map(stripSpecsRootPrefix)
  .filter((entry) => !entry.startsWith(identityPrefix));
if (foreign.length === 0) process.exit(0);
for (const entry of foreign) process.stdout.write(`${entry}\n`);
process.exit(9); // foreign-identity children_ids entries found
NODE_IDENTITY
    ) || foreign_rc=$?

    if [[ "$foreign_rc" -eq 21 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="graph-metadata.json is malformed; child-identity check could not run"
        RULE_REMEDIATION="Repair the malformed JSON and rerun validation."
        return 0
    fi

    [[ "$foreign_rc" -eq 9 ]] || return 0

    local foreign_count=0 entry
    while IFS= read -r entry; do
        [[ -z "$entry" ]] && continue
        RULE_DETAILS+=("$entry")
        foreign_count=$((foreign_count + 1))
    done <<< "$foreign_list"

    local plural="entries carry"
    [[ "$foreign_count" -eq 1 ]] && plural="entry carries"

    RULE_STATUS="fail"
    RULE_MESSAGE="$foreign_count children_ids $plural an identity other than the packet's own"
    RULE_REMEDIATION="Refresh this packet's graph-metadata.json (the writer drops stale-identity children) or run the scoped backfill for the packet, then rerun validation."
}
