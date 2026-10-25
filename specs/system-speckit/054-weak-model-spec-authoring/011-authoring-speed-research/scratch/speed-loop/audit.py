#!/usr/bin/env python3
"""Reads the Devin session store read-only for one timed step and prints key=value lines.

usage: audit.py <sessions.db> <sandbox cwd> <t0> <t1> <out prefix>

A session belongs to the step when its working directory is the sandbox and it was created
between dispatch start and end. Tool calls come from tool_call_state, counted with count(*)
so an interrupted (capped) session whose rows lack tool_call_json is still counted; those
rows are also reported as tool_calls_null. Token counts come from the per-response metrics
Devin stores on assistant messages, one row per request id because the store keeps two
copies of each response. Anything the store does not hold prints UNKNOWN.

Contamination reuses the earlier authoring benchmark's patterns over both the tool calls and
their completion updates; every hit is listed in <out prefix>.hits. Its "/private/tmp"
pattern is left out because every sandbox lives under /private/tmp; reads outside the
sandbox are counted by refs_outside instead. A run is contaminated when the model's own calls
name the packet, a specific pattern, or a path outside its sandbox.
"""
import json
import os
import re
import sqlite3
import sys

db, cwd, t0, t1, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
UNKNOWN = "UNKNOWN"
keys = ["sessions", "tool_calls", "tool_calls_null", "validate_calls", "tok_in", "tok_cache_read", "tok_out",
        "refs_054", "refs_054_updates", "contam_hits", "contam_hits_updates", "contam_weak", "refs_outside",
        "contaminated"]
res = {k: UNKNOWN for k in keys}
PKT_NAME = "054-weak-model-spec-authoring"
# The earlier benchmark's patterns, split by how specific they are. The weak ones also
# match hundreds of unrelated files in every tree, so they are listed for review only.
CONTAM = ["baseline-swe-", "baseline-deepseek", "bench-evidence", "bench-packets",
          "009-authoring-benchmark-and-closeout", "authoring-baseline"]
WEAK = ["hints-", "anchors-", "model-eval"]
OUTSIDE = ["Code_Environment/Public", "/scratchpad/", ".worktrees/"]

# A validation run is a command segment that starts with validate.sh (optionally behind
# bash, sh or time) and is not a help or rule listing. Reading the script with head or rg
# is not a run.
SEG_SPLIT = re.compile(r"\n|;|&&|\|\||\|")
VALIDATE_RUN = re.compile(r"^\s*(?:time\s+)?(?:(?:bash|sh)\s+)?\S*validate\.sh(?:\s|$)")
NOT_A_RUN = re.compile(r"--list-rules|--help|\s-h(?:\s|$)")


def command_of(call):
    raw = call.get("rawInput") or {}
    if isinstance(raw.get("command"), str):
        return raw["command"]
    for c in call.get("content") or []:
        text = (((c.get("content") or {}).get("resource")) or {}).get("text")
        if text:
            return text
    return ""


try:
    con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
except sqlite3.Error as e:
    print(f"audit_error={e}")
    con = None

if con is not None:
    dirs = sorted({cwd, os.path.realpath(cwd)})
    marks = ",".join("?" * len(dirs))
    sids = [r[0] for r in con.execute(
        f"select id from sessions where working_directory in ({marks}) and created_at between ? and ? order by created_at",
        (*dirs, t0 - 2, t1 + 1))]
    res["sessions"] = str(len(sids))
    if sids:
        total = 0
        calls, updates = [], []
        for sid in sids:
            total += con.execute("select count(*) from tool_call_state where session_id=?", (sid,)).fetchone()[0]
            for c, u in con.execute(
                    "select tool_call_json, tool_call_update_json from tool_call_state where session_id=?", (sid,)):
                calls.append(c)
                updates.append(u or "")
        nonnull = [c for c in calls if c is not None]
        with open(out + ".calls", "w") as fh:
            fh.write("\n".join(nonnull) + ("\n" if nonnull else ""))
        with open(out + ".updates", "w") as fh:
            fh.write("\n".join(updates) + ("\n" if updates else ""))
        res["tool_calls"] = str(total)
        res["tool_calls_null"] = str(len(calls) - len(nonnull))
        vcount = 0
        for raw in nonnull:
            try:
                call = json.loads(raw)
            except ValueError:
                continue
            if call.get("kind") != "execute":
                continue
            for seg in SEG_SPLIT.split(command_of(call)):
                if VALIDATE_RUN.search(seg) and not NOT_A_RUN.search(seg):
                    vcount += 1
        res["validate_calls"] = str(vcount)

        res["refs_054"] = str(sum(PKT_NAME in c for c in nonnull))
        res["refs_054_updates"] = str(sum(PKT_NAME in u for u in updates))
        counts = {"contam_hits": 0, "contam_hits_updates": 0, "contam_weak": 0}
        with open(out + ".hits", "w") as fh:
            for col, rows in (("calls", nonnull), ("updates", updates)):
                for i, line in enumerate(rows):
                    for p in CONTAM + WEAK:
                        for m in re.finditer(re.escape(p), line):
                            if p in WEAK:
                                counts["contam_weak"] += 1
                            else:
                                counts["contam_hits" if col == "calls" else "contam_hits_updates"] += 1
                            ctx = line[max(0, m.start() - 100):m.end() + 100].replace("\n", " ")
                            fh.write(f"{col}[{i}] {p}{' (weak)' if p in WEAK else ''}: ...{ctx}...\n")
        res.update({k: str(v) for k, v in counts.items()})
        # Paths the model itself named: its calls with the sandbox path removed, so what
        # remains of a worktree or scratchpad path points outside the sandbox.
        strip = sorted(dirs, key=len, reverse=True)

        def outside(t):
            for d in strip:
                t = t.replace(d, "")
            return any(p in t for p in OUTSIDE)
        res["refs_outside"] = str(sum(outside(c) for c in nonnull))
        # Only what the model asked for decides exclusion. Tool output (updates) can name
        # the deleted packet through the trigger index, which holds more of its paths in
        # later variants, so excluding on it would bias the exclusions by variant.
        res["contaminated"] = "1" if int(res["refs_054"]) or counts["contam_hits"] or int(res["refs_outside"]) else "0"

        per_request = {}
        for sid in sids:
            for (msg,) in con.execute("select chat_message from message_nodes where session_id=?", (sid,)):
                try:
                    m = json.loads(msg)
                except ValueError:
                    continue
                if m.get("role") != "assistant":
                    continue
                meta = m.get("metadata") or {}
                met = meta.get("metrics") or {}
                rid = meta.get("request_id") or m.get("message_id")
                if rid and isinstance(met.get("input_tokens"), int):
                    per_request[rid] = met
        if per_request:
            res["tok_in"] = str(sum(m.get("input_tokens") or 0 for m in per_request.values()))
            res["tok_cache_read"] = str(sum(m.get("cache_read_tokens") or 0 for m in per_request.values()))
            res["tok_out"] = str(sum(m.get("output_tokens") or 0 for m in per_request.values()))

for k in keys:
    print(f"{k}={res[k]}")
