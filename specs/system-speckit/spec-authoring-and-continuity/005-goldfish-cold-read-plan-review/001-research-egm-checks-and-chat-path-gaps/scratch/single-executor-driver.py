#!/usr/bin/env python3
"""Runs the single-executor deep-research workflow by executing the step commands that
deep-research-auto.yaml itself carries, with its placeholders bound. No step logic is
re-implemented here beyond the state reads the YAML describes in prose."""
import json, os, re, subprocess, sys, datetime, shutil, pathlib

ROOT = "/Users/michelkerkmeester/MEGA/Development/Skilled"
SF = "specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review"
ART = f"{SF}/research"
ARCHIVE = f"{SF}/research_archive"
YAML = f"{ROOT}/.skilled/commands/deep/assets/deep-research-auto.yaml"
DL = ".skilled/skills/system-deep-loop"
RUNSTATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dr-runstate.json")
os.chdir(ROOT)

SP = {
    "packet_dir": ART, "config": f"{ART}/deep-research-config.json",
    "state_log": f"{ART}/deep-research-state.jsonl", "status_ledger": f"{ART}/orchestration-status.log",
    "strategy": f"{ART}/deep-research-strategy.md", "registry": f"{ART}/findings-registry.json",
    "dashboard": f"{ART}/deep-research-dashboard.md", "pause_sentinel": f"{ART}/.deep-research-pause",
    "run_now_sentinel": f"{ART}/.deep-research-run-now", "lock_file": f"{ART}/.deep-research.lock",
    "prompt_dir": f"{ART}/prompts", "iteration_dir": f"{ART}/iterations", "delta_dir": f"{ART}/deltas",
    "research_output": f"{ART}/research.md",
}

def now():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def sh(cmd, env=None, check=True, timeout=None):
    e = dict(os.environ); e.update(env or {})
    p = subprocess.run(cmd, shell=True, executable="/bin/bash", capture_output=True, text=True, env=e, timeout=timeout)
    out = (p.stdout + p.stderr).strip()
    if check and p.returncode != 0:
        print(f"STEP FAILED exit={p.returncode}\n$ {cmd[:300]}\n{out[-3000:]}"); sys.exit(1)
    return p.returncode, out

def yaml_block(step_line, key="command"):
    """Return the dedented literal block of the first `<key>: |` at or after step_line."""
    lines = open(YAML).read().split("\n")
    i = step_line - 1
    while not re.match(rf"^\s+{key}: \|$", lines[i]): i += 1
    base = len(lines[i]) - len(lines[i].lstrip())
    body, j = [], i + 1
    while j < len(lines) and (lines[j].strip() == "" or len(lines[j]) - len(lines[j].lstrip()) > base):
        body.append(lines[j]); j += 1
    ind = min(len(l) - len(l.lstrip()) for l in body if l.strip())
    return "\n".join(l[ind:] for l in body)

def bind(text, extra=None):
    cfg = json.load(open(SP["config"])) if os.path.exists(SP["config"]) else {}
    ex, ln = cfg.get("executor", {}), cfg.get("lineage", {})
    v = {f"state_paths.{k}": val for k, val in SP.items()}
    v.update({
        "spec_folder": SF, "artifact_dir": ART, "repo_root": ROOT, "ISO_8601_NOW": now(),
        "AUTO_SESSION_ID": ln.get("sessionId", ""), "reducer_artifact_arg": "",
        "config.executor.kind": ex.get("kind"), "config.executor.model": ex.get("model"),
        "config.executor.timeoutSeconds": ex.get("timeoutSeconds"),
        "config.executor.reasoningEffort": ex.get("reasoningEffort"),
        "config.lineage.sessionId": ln.get("sessionId"), "config.lineage.generation": ln.get("generation"),
    })
    v.update(extra or {})
    def rep(m):
        k = m.group(1)
        return str(v[k]) if k in v else m.group(0)
    out = re.sub(r"(?<!\$)\{([a-zA-Z_][a-zA-Z0-9_.]*)\}", rep, text)
    left = sorted(set(re.findall(r"(?<!\$)\{((?:state_paths|config)\.[a-zA-Z_.]+|current_iteration|spec_folder|artifact_dir|repo_root|ISO_8601_NOW|AUTO_SESSION_ID|reason)\}", out)))
    if left:
        print("UNBOUND PLACEHOLDERS:", left); sys.exit(1)
    return out

def gateway(row):
    """append_to_jsonl / append_jsonl: every such directive goes through the append gateway."""
    f = os.path.join(os.path.dirname(RUNSTATE), f"evt-{os.getpid()}.json")
    open(f, "w").write(json.dumps(row))
    rc, out = sh(f"node {DL}/runtime/scripts/append-mode-event.cjs --mode research --run-directory {ART} --event-json {f}", check=False)
    os.remove(f)
    print(f"  gateway {row.get('event') or row.get('stem')}: exit={rc} {out[-200:] if rc else ''}")
    return rc

def rs():
    return json.load(open(RUNSTATE))

def state_rows():
    if not os.path.exists(SP["state_log"]): return []
    return [json.loads(l) for l in open(SP["state_log"]) if l.strip()]

def section(md, anchor):
    m = re.search(rf"<!-- ANCHOR:{anchor} -->(.*?)<!-- /ANCHOR:{anchor} -->", md, re.S)
    return m.group(1) if m else ""

def read_state():
    rows = [r for r in state_rows() if r.get("type") == "iteration"]
    runs = [r.get("run") or r.get("iteration") for r in rows]
    strat = open(SP["strategy"]).read()
    kq = section(strat, "key-questions")
    remaining = re.findall(r"^- \[ \] (.+)$", kq, re.M)
    answered = re.findall(r"^- \[x\] (.+)$", section(strat, "answered-questions") + kq, re.M | re.I)
    nf = re.sub(r"^## .*\n", "", section(strat, "next-focus").strip()).strip()
    cf = re.sub(r"^## .*\n", "", section(strat, "carried-forward-open-questions").strip()).strip() or "[None yet]"
    reg = json.load(open(SP["registry"])) if os.path.exists(SP["registry"]) else {}
    div = reg.get("divergence", {}) or {}
    last3 = "; ".join(f"run {r.get('run') or r.get('iteration')}: {r.get('focus','')} ({r.get('newInfoRatio')})" for r in rows[-3:]) or "none yet"
    ratios = [r.get("newInfoRatio") for r in rows]
    cur = max(max(runs) if runs else 0, len(set(runs))) + 1
    return {
        "iteration_count": len(set(runs)), "current_iteration": cur,
        "last_focus": rows[-1].get("focus") if rows else "none yet",
        "ratio_prev": ratios[-2] if len(ratios) > 1 else "N/A", "ratio_latest": ratios[-1] if ratios else "N/A",
        "next_focus": nf, "remaining": remaining, "answered_count": len(answered),
        "total_questions": len(answered) + len(remaining), "carried": cf, "last3": last3,
        "pivot_lineage": json.dumps(div.get("completed")) if div.get("completed") else "none yet",
        "saturated": json.dumps(div.get("saturatedDirections")) if div.get("saturatedDirections") else "none yet",
        "key_findings": len(reg.get("keyFindings", [])),
    }

def cmd_init(spec_path):
    spec = json.load(open(spec_path))  # topic, max_iterations, questions[], known_context, parent_session, generation
    # step_classify_session.on_restart: archive the current research packet, start a new lineage segment
    if os.path.isdir(ART):
        os.makedirs(ARCHIVE, exist_ok=True)
        slug = now().replace(":", "-")
        shutil.move(ART, f"{ARCHIVE}/{slug}")
        print(f"restart: archived research/ to {ARCHIVE}/{slug}")
        archived = f"{ARCHIVE}/{slug}"
    else:
        archived = None
    # step_create_directories
    for d in ("prompt_dir", "iteration_dir", "delta_dir"): os.makedirs(SP[d], exist_ok=True)
    # step_detect_resource_map
    rmp = os.path.exists(f"{SF}/resource-map.md")
    # step_acquire_lock
    rc, out = sh(f"node {DL}/runtime/scripts/loop-lock.cjs acquire --lock-path {SP['lock_file']} --packet-id {SF} --ttl-ms 1800000")
    lock = json.loads(out[out.index("{"):])
    L = lock.get("lock", lock)
    if lock.get("acquired") is False: print("LOCK NOT ACQUIRED", out); sys.exit(1)
    state = {"owner_pid": L.get("ownerPid"), "nonce": L.get("acquireNonce"), "stuck": 0, "topic": spec["topic"],
             "max": spec["max_iterations"], "lineage_line": "Lineage context refresh: none loaded yet."}
    json.dump(state, open(RUNSTATE, "w"))
    print("lock acquired", state["owner_pid"], str(state["nonce"])[:8])
    # step_resolve_session_id + step_create_config
    cfg = json.load(open(f"{DL}/deep-research/assets/deep-research-config.json"))
    sid = now()
    cfg.update({"topic": spec["topic"], "maxIterations": spec["max_iterations"], "minIterations": 3,
                "convergenceThreshold": 0.05, "stopPolicy": "max-iterations", "stuckThreshold": 3,
                "minIdeaObservations": 2, "maxDurationMinutes": 120, "specFolder": SF,
                "resource_map_present": rmp, "resource_map": {"emit": True}, "createdAt": sid,
                "status": "initialized", "executionMode": "auto", "nextRunAt": None, "remainingDelayMs": None})
    cfg["antiConvergence"]["convergenceMode"] = "default"; cfg["antiConvergence"]["divergent"] = {}
    cfg["executor"] = {"kind": "cli-pi", "model": "deepseek-v4.1-flash-1017", "reasoningEffort": "max",
                       "serviceTier": None, "sandboxMode": "workspace-write", "timeoutSeconds": 900}
    cfg["lineage"].update({"sessionId": sid, "parentSessionId": spec.get("parent_session"),
                           "lineageMode": "restart" if archived else "new", "generation": spec.get("generation", 1),
                           "continuedFromRun": None})
    json.dump(cfg, open(SP["config"], "w"), indent=2)
    # step_create_state_log (the YAML's own command)
    rc, out = sh(bind(yaml_block(387)))
    print("run_initialized:", out[-160:])
    if archived:
        gateway({"type": "event", "event": "restarted", "mode": "research", "sessionId": sid,
                 "parentSessionId": spec.get("parent_session"), "lineageMode": "restart",
                 "generation": cfg["lineage"]["generation"], "archivedPath": archived, "timestamp": now()})
    # step_create_strategy
    st = open(f"{DL}/deep-research/assets/deep-research-strategy.md").read()
    st = st.replace("[Research topic from config -- set during initialization]", spec["topic"])
    q = "\n".join(f"- [ ] {x}" for x in spec["questions"])
    st = re.sub(r"- \[ \] \[Question 1.*?\n- \[ \] \[Question 2\]\n- \[ \] \[Question 3\]", lambda m: q, st, flags=re.S)
    st = st.replace("[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]",
                    spec["known_context"] + ("\n\nresource-map.md not present; skipping coverage gate." if not rmp else ""))
    st = st.replace("- Max iterations: [from config]", f"- Max iterations: {spec['max_iterations']}")
    st = st.replace("- Convergence threshold: [from config]", "- Convergence threshold: 0.05")
    open(SP["strategy"], "w").write(st)
    # step_create_registry
    open(SP["registry"], "w").write('{"openQuestions":[],"resolvedQuestions":[],"keyFindings":[],"ruledOutDirections":[],"metrics":{"iterationsCompleted":0,"openQuestions":0,"resolvedQuestions":0,"keyFindings":0,"convergenceScore":0,"coverageBySources":{}}}')
    print("init files written; spec check and telemetry are run by the caller")

def cmd_telemetry(which, reason="maxIterationsReached"):
    line = {"started": 536, "progress": 2086, "terminal": 2345}[which]
    s = read_state() if which == "progress" else {}
    rc, out = sh(bind(yaml_block(line), {"current_iteration": s.get("current_iteration", 1) - 1 if s else 1, "reason": reason}), check=False)
    print(f"telemetry {which}: exit={rc} {out[-300:]}")

def cmd_iterate():
    st = rs()
    # step_refresh_lock
    rc, out = sh(f"node {DL}/runtime/scripts/loop-lock.cjs refresh --lock-path {SP['lock_file']} --owner-pid {st['owner_pid']} --nonce {st['nonce']}")
    if '"refreshed":false' in out.replace(" ", ""): print("LOST LOCK", out); sys.exit(1)
    # step_read_state
    s = read_state(); n = s["current_iteration"]
    if s["iteration_count"] >= st["max"]: print("STOP maxIterationsReached"); return
    # step_run_now_check / step_check_pause_sentinel
    if os.path.exists(SP["run_now_sentinel"]): sh(bind(yaml_block(657), {"current_iteration": n}))
    if os.path.exists(SP["pause_sentinel"]): print("PAUSED by sentinel"); sys.exit(2)
    # step_graph_convergence (telemetry only under stopPolicy=max-iterations)
    cfg = json.load(open(SP["config"]))
    rc, out = sh(f'node {DL}/runtime/scripts/convergence.cjs --spec-folder "{SF}" --loop-type "research" --session-id "{cfg["lineage"]["sessionId"]}" --convergence-mode "default" --persist-snapshot --iteration "{n}"', check=False)
    print(f"  graph_convergence (bookkeeping): exit={rc} {out[-220:]}")
    # step_check_convergence: 3a holds, decision = CONTINUE
    # step_dispatch_iteration.pre_dispatch: summary + prompt pack
    summary = (f"STATE SUMMARY (auto-generated):\nSegment: 1 | Iteration: {n} of {st['max']}\n"
               f"Questions: {s['answered_count']}/{s['total_questions']} answered | Last focus: {s['last_focus']}\n"
               f"Last 2 ratios: {s['ratio_prev']} -> {s['ratio_latest']} | Stuck count: {st['stuck']}\n"
               f"Resource map: resource-map.md not present; skipping coverage gate.\n{st['lineage_line']}\n"
               f"Next focus: {s['next_focus']}")
    pv = {"state_summary": summary, "research_topic": st["topic"], "current_iteration": str(n), "max_iterations": str(st["max"]),
          "max_tool_calls_per_iteration": str(cfg.get("maxToolCallsPerIteration", 24)), "next_focus": s["next_focus"],
          "remaining_questions_list": "\n".join(f"- {x}" for x in s["remaining"]) or "[none remaining]",
          "carried_forward_open_questions": s["carried"], "last_3_summaries": s["last3"], "pivot_lineage": s["pivot_lineage"],
          "saturated_directions": s["saturated"], "state_paths_config": SP["config"], "state_paths_state_log": SP["state_log"],
          "state_paths_strategy": SP["strategy"], "state_paths_registry": SP["registry"],
          "state_paths_iteration_pattern": f"{SP['iteration_dir']}/iteration-{n:03d}.md",
          "state_paths_delta_pattern": f"{SP['delta_dir']}/iter-{n:03d}.jsonl"}
    pvf = os.path.join(os.path.dirname(RUNSTATE), "dr-pv.json"); json.dump(pv, open(pvf, "w"))
    tsx = f'node --import "$(node -p "require.resolve(\'tsx\', {{ paths: [\'{DL}/runtime\'] }})")" --input-type=module'
    sh(f"""{tsx} <<'EOF'
import {{ readFileSync, writeFileSync }} from 'node:fs';
import {{ renderPromptPack }} from './{DL}/runtime/lib/deep-loop/prompt-pack.ts';
import {{ writeFirstRecordExecutor }} from './{DL}/runtime/lib/deep-loop/executor-audit.ts';
const v = JSON.parse(readFileSync('{pvf}', 'utf8'));
writeFileSync('{SP['prompt_dir']}/iteration-{n}.md', renderPromptPack('{DL}/deep-research/assets/prompt-pack-iteration.md.tmpl', v));
const cfg = JSON.parse(readFileSync('{SP['config']}', 'utf8'));
writeFirstRecordExecutor('{SP['state_log']}', cfg.executor, {n});
EOF""")
    child_env = {"AI_SESSION_CHILD": "1", "SYSTEM_SPEC_GATE_ENFORCE": "0", "PI_BLACKHOLE_PASSIVE": "true"}
    dispatch = bind(yaml_block(1492), {"current_iteration": n})
    verify = f"node {DL}/runtime/scripts/verify-iteration.cjs --loop-type research --artifact-dir {ART} --iteration {n}"
    for attempt in (1, 2):
        t0 = datetime.datetime.now()
        rc, out = sh(dispatch, env=child_env, check=False, timeout=1200)
        secs = (datetime.datetime.now() - t0).seconds
        vrc, vout = sh(verify, check=False)
        print(f"  dispatch attempt {attempt}: exit={rc} {secs}s | verify exit={vrc} {vout[-200:]}")
        if out.strip(): print("  dispatch stderr tail:", out[-400:].replace("\n", " | "))
        if vrc == 0: break
        if attempt == 1: print("  redispatch_once")
    # step_check_executor_unavailable
    for r in state_rows()[-3:]:
        if r.get("event") == "dispatch_failure" and r.get("executorUnavailable"): print("EXECUTOR UNAVAILABLE", r); sys.exit(3)
    if vrc != 0:
        gateway({"type": "iteration", "iteration": n, "run": n, "mode": "research", "status": "error", "focus": s["next_focus"][:200],
                 "findingsCount": 0, "newInfoRatio": 0.0, "keyQuestions": [], "answeredQuestions": [], "durationMs": 0,
                 "timestamp": now(), "sessionId": cfg["lineage"]["sessionId"], "generation": cfg["lineage"]["generation"]})
    # step_reduce_state
    rc, out = sh(f"node {DL}/deep-research/scripts/reduce-state.cjs {SF}", check=False)
    print(f"  reduce-state: exit={rc} {out[-200:]}")
    # step_graph_upsert
    rc, out = sh(bind(yaml_block(1956), {"current_iteration": n}), check=False)
    print(f"  graph_upsert: exit={rc} {out[-160:]}")
    # step_refresh_lineage_context + step_evaluate_results + step_update_tracking
    s2 = read_state(); rows = [r for r in state_rows() if r.get("type") == "iteration"]
    last = rows[-1] if rows else {}
    ratio = last.get("newInfoRatio", 0) or 0
    st["stuck"] = st["stuck"] if last.get("status") == "thought" else (0 if last.get("status") == "insight" or ratio >= 0.05 else st["stuck"] + 1)
    st["lineage_line"] = (f"Lineage context refresh: {s2['key_findings']} key findings recorded, {len(s2['remaining'])} key questions open, "
                          f"last focus: {last.get('focus','')[:160]}")
    json.dump(st, open(RUNSTATE, "w"))
    cmd_telemetry("progress")
    print(f"Iteration {n} complete. status={last.get('status')} newInfoRatio={ratio} findings={last.get('findingsCount')} stuck={st['stuck']} dispatch_seconds={secs}")

if __name__ == "__main__":
    a = sys.argv[1]
    if a == "init": cmd_init(sys.argv[2])
    elif a == "telemetry": cmd_telemetry(*sys.argv[2:])
    elif a == "iterate": cmd_iterate()
    elif a == "gateway": print(gateway(json.loads(open(sys.argv[2]).read())))
    elif a == "state": print(json.dumps(read_state(), indent=1)[:3000])
    elif a == "release":
        st = rs(); print(sh(f"node {DL}/runtime/scripts/loop-lock.cjs release --lock-path {SP['lock_file']} --owner-pid {st['owner_pid']} --nonce {st['nonce']}", check=False))
