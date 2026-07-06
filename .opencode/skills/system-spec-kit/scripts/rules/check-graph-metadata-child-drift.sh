#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-GRAPH-METADATA-CHILD-DRIFT
# ───────────────────────────────────────────────────────────────
# Flags a phase parent whose graph-metadata.json children_ids is missing
# on-disk phase children the graph-metadata writer would add on its next
# refresh. The writer derives children by directory name and merges them into
# children_ids by union: it adds derived children and never prunes. So the only
# change a refresh would ever make is ADDING a derived on-disk child the list is
# missing — that gap is the sole truthful drift signal. A listed entry with no
# matching folder is left untouched by the writer and is deliberately NOT
# reported, to avoid flagging drift no refresh would reconcile.
#
# This rule carries a distinct id from the graph-metadata presence check so the
# default validator runs it alongside that native check instead of deduping it
# away. The child set comes from the one shared writer-mirroring scanner so this
# check and the writer can never disagree on what a child is.
#
# Advisory by default: emits a passing line that surfaces the gap without
# failing --strict, so a repo with known-unreconciled parents still passes. Set
# SPECKIT_CHILD_DRIFT_ENFORCE=true to emit a warning that --strict escalates to
# a failure, once the repo has been reconciled. Flag-only: never edits a file.

set -euo pipefail

run_check() {
    local folder="$1"
    local _level="${2:-}"

    RULE_NAME="GRAPH_METADATA_CHILD_DRIFT"
    RULE_STATUS="pass"
    RULE_MESSAGE="children_ids matches the on-disk phase children"
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local graph_file="$folder/graph-metadata.json"
    # Presence and shape of graph-metadata.json belong to the presence check;
    # with no file there is no children_ids to compare, so this rule stays clean.
    if [[ ! -f "$graph_file" ]]; then
        RULE_MESSAGE="no graph-metadata.json present; child-drift check not applicable"
        return 0
    fi

    # Cheap guard: only a folder with number-prefixed subdirectories can drift,
    # so pure leaves skip the extra process entirely.
    local _has_numbered=0 _entry
    for _entry in "$folder"/[0-9][0-9][0-9]*; do
        [[ -d "$_entry" ]] && { _has_numbered=1; break; }
    done
    [[ "$_has_numbered" -eq 1 ]] || return 0

    local rule_dir child_scanner drift_missing drift_rc
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)" || rule_dir=""
    # Override hook: lets a caller point at a relocated scanner dist, and lets
    # tests drive the dependency-unavailable branch deterministically.
    child_scanner="${SPECKIT_CHILD_SCANNER:-$rule_dir/../dist/spec/is-phase-parent.js}"
    drift_missing=""
    drift_rc=0
    drift_missing=$(node --input-type=module - "$graph_file" "$folder" "$child_scanner" 2>/dev/null <<'NODE_DRIFT'
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { pathToFileURL } from 'node:url';
const [graphFile, folder, scanner] = process.argv.slice(2);
let listDerivedChildNames;
try {
  ({ listDerivedChildNames } = await import(pathToFileURL(scanner).href));
} catch {
  process.exit(20); // scanner module unavailable — skip drift, report clean
}
if (typeof listDerivedChildNames !== 'function') process.exit(20);
let parsed;
try {
  parsed = JSON.parse(readFileSync(graphFile, 'utf8'));
} catch {
  process.exit(21); // unreadable graph metadata — presence check owns that
}
// Compare the immediate parent segment to the checked folder name. This keeps
// tolerance for leading-prefix drift while preventing another parent with the
// same child basename from satisfying the local child.
const parentName = basename(folder);
const listed = new Set();
for (const entry of Array.isArray(parsed.children_ids) ? parsed.children_ids : []) {
  const segments = String(entry).split('/').filter(Boolean);
  if (segments.length >= 2 && segments[segments.length - 2] === parentName) {
    listed.add(segments[segments.length - 1]);
  }
}
const missing = listDerivedChildNames(folder).filter((name) => !listed.has(name));
if (missing.length === 0) process.exit(0);
process.stdout.write(missing.join(', '));
process.exit(9); // drift: children_ids is missing derived on-disk children
NODE_DRIFT
) || drift_rc=$?

    # drift_rc: 0 no drift, 9 drift found, 20 scanner unavailable, 21 unreadable json.
    # A run that could not determine drift (20/21) must not pass silently under
    # enforcement: a real gap could hide behind an unavailable dependency, so fail
    # closed there. Advisory mode stays best-effort and reports clean.
    if [[ "$drift_rc" -eq 20 || "$drift_rc" -eq 21 ]]; then
        if [[ "${SPECKIT_CHILD_DRIFT_ENFORCE:-false}" == "true" ]]; then
            RULE_STATUS="warn"
            RULE_MESSAGE="child-drift check could not run (dependency unavailable, rc=$drift_rc); children_ids currency is unverified"
            RULE_DETAILS=("child-drift dependency unavailable under enforce (rc=$drift_rc)")
            RULE_REMEDIATION="Restore the child-scanner dist or the graph-metadata.json, then rerun validation."
        fi
        return 0
    fi

    [[ "$drift_rc" -eq 9 ]] || return 0

    if [[ "${SPECKIT_CHILD_DRIFT_ENFORCE:-false}" == "true" ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="children_ids is missing on-disk phase children: $drift_missing"
        RULE_DETAILS=("Missing from children_ids: $drift_missing")
        RULE_REMEDIATION="Refresh this phase parent's graph-metadata.json so children_ids includes every on-disk phase child, then rerun validation."
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="children_ids child-drift ADVISORY — missing: $drift_missing (set SPECKIT_CHILD_DRIFT_ENFORCE=true to enforce)"
        RULE_DETAILS=("Missing from children_ids: $drift_missing")
        RULE_REMEDIATION="Advisory only — does not fail validation. Refresh this phase parent's graph-metadata.json to add the missing on-disk phase children."
    fi
}
