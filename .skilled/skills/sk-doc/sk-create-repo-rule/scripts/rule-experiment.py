#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: RULE EXPERIMENT HARNESS
# ───────────────────────────────────────────────────────────────

"""
Run controlled repo-rule experiments in isolated test environments.

Each arm of an experiment is a small git repository: a fixture project plus the
live router and rule files with that arm's edits applied. Every run copies the
arm's template, so a run that writes files never leaks into the next one. The
executor's own global instructions load as usual, which is why only the router,
the rules, the cards and an optional project AGENTS.md vary between arms.

Usage:
    rule-experiment.py build --arms ARMS.json --out DIR [--repo ROOT]
    rule-experiment.py run --arms ARMS.json --envs DIR --prompts PROMPTS.json
                           --executor deepseek|luna --out RUNS.jsonl
                           [--repeat N] [--jobs J] [--seed S] [--limit N]
    rule-experiment.py score --runs RUNS.jsonl [RUNS.jsonl ...] [--json]

Output of `score` is aggregates only: counts, rates and Wilson intervals. Reply
text stays in the executors' own transcripts and is never printed.
"""

import argparse
import concurrent.futures
import glob
import importlib.util
import json
import os
import random
import re
import shutil
import subprocess
import sys
import threading
import time
from typing import Dict, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FIXTURE_DIR = os.path.join(SCRIPT_DIR, "rule-experiment-fixture")
RULES_REL = os.path.join(".skilled", "repo-rules")
ROUTER = "REPO RULES.md"
REPLY_RULES = ("communication.md", "communication-prose.md")
RULE_REF = re.compile(r"(REPO RULES\.md|REPO\\ RULES\.md|repo-rules/(?:cards/)?[a-z0-9-]+\.md)")
PATCH_PATH = re.compile(r"\*\*\* (?:Update|Add|Delete) File: ([^\\\n\"]+)")
RATE_METRICS = ["table_unasked", "table_unasked_rule_delivered", "communication_delivered", "any_prohibition",
                "gate5_miss", "reply_rules_miss", "fallback"]
QUOTA = re.compile(r"usage limit|quota has been exhausted|resource_exhausted|limit will reset|rate limit", re.I)
QUOTA_STOP = 3
SKILL_LINK = re.compile(r"\]\((\.\./skills/[^)#\s]+)")
SESSION_ID = re.compile(r"^session id: ([0-9a-f-]{36})", re.M)
RUN_TIMEOUT = 900

EXECUTORS = {
    "deepseek": ["devin", "-p", "--model", "deepseek-v4-1-flash-max", "--permission-mode", "dangerous"],
    "swe": ["devin", "-p", "--model", "swe-2-max", "--permission-mode", "dangerous"],
    "luna": ["codex", "exec", "--model", "gpt-6-luna", "-c", 'model_reasoning_effort="max"',
             "-c", 'service_tier="fast"', "-c", "approval_policy=never", "--sandbox", "workspace-write"],
}


def load_analyzer():
    """The phase-004 analyzer owns the prohibition checks, so every experiment scores alike."""
    spec = importlib.util.spec_from_file_location("mrc", os.path.join(SCRIPT_DIR, "measure-rule-compliance.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


MRC = load_analyzer()

# ───────────────────────────────────────────────────────────────
# 2. BUILD
# ───────────────────────────────────────────────────────────────


def apply_edit(env: str, edit: Dict, repo: str) -> None:
    path = os.path.join(env, edit["file"])
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if "content" in edit:
        text = edit["content"]
    elif "content_from" in edit:
        with open(os.path.join(repo, edit["content_from"])) as handle:
            text = handle.read()
    else:
        with open(path) as handle:
            text = handle.read()
        for find, replace in edit.get("replace", []):
            if text.count(find) != 1:
                raise SystemExit(f"Error: edit for {edit['file']} expects one match of {find[:60]!r}, found {text.count(find)}")
            text = text.replace(find, replace)
    with open(path, "w") as handle:
        handle.write(text)


def build(args: argparse.Namespace) -> None:
    spec = json.load(open(args.arms))
    repo = os.path.abspath(args.repo)
    for arm in spec["arms"]:
        env = os.path.join(args.out, arm["name"], "template")
        if os.path.exists(env):
            shutil.rmtree(env)
        shutil.copytree(FIXTURE_DIR, env)
        shutil.copy(os.path.join(repo, ROUTER), os.path.join(env, ROUTER))
        os.makedirs(os.path.join(env, RULES_REL))
        for rule in glob.glob(os.path.join(repo, RULES_REL, "*.md")):
            shutil.copy(rule, os.path.join(env, RULES_REL))
            # Rules link into skills the fixture lacks; copy those targets so a followed link resolves.
            for target in SKILL_LINK.findall(open(rule).read()):
                source = os.path.normpath(os.path.join(repo, RULES_REL, target))
                if os.path.isfile(source):
                    dest = os.path.join(env, os.path.relpath(source, repo))
                    os.makedirs(os.path.dirname(dest), exist_ok=True)
                    shutil.copy(source, dest)
        if arm.get("cards"):
            subprocess.run(["node", os.path.join(SCRIPT_DIR, "build-rule-cards.cjs"), "--root", env], check=True,
                           capture_output=True)
        for edit in arm.get("edits", []):
            apply_edit(env, edit, repo)
        subprocess.run(["git", "init", "-q"], cwd=env, check=True)
        subprocess.run(["git", "add", "-A"], cwd=env, check=True)
        subprocess.run(["git", "-c", "user.name=experiment", "-c", "user.email=experiment@example.invalid",
                        "commit", "-q", "--no-verify", "-m", f"arm {arm['name']}"], cwd=env, check=True)
        print(f"built {arm['name']}: {env}")

# ───────────────────────────────────────────────────────────────
# 3. RUN
# ───────────────────────────────────────────────────────────────


def schedule(arms: List[str], prompts: List[Dict], repeat: int, seed: int) -> List[Tuple[str, Dict, int]]:
    """Every arm sees every prompt the same number of times, interleaved in a seeded order."""
    jobs = [(arm, prompt, rep) for rep in range(repeat) for prompt in prompts for arm in arms]
    random.Random(seed).shuffle(jobs)
    return jobs


def run_one(executor: str, template: str, run_dir: str, prompt: Dict, suffix: str) -> Dict:
    shutil.copytree(template, run_dir)
    text = prompt["text"] + (("\n\n" + suffix) if suffix else "")
    env = dict(os.environ, AI_SESSION_CHILD="1", SYSTEM_SPEC_GATE_ENFORCE="0")
    started = time.time()
    record = {"run_dir": run_dir}
    if EXECUTORS[executor][0] == "devin":
        export = run_dir + ".devin.json"
        cmd = EXECUTORS[executor] + ["--export", export, "--", text]
        record["transcript"] = export
    else:
        cmd = EXECUTORS[executor] + [text]
    try:
        proc = subprocess.run(cmd, cwd=run_dir, env=env, stdin=subprocess.DEVNULL, capture_output=True,
                              text=True, timeout=RUN_TIMEOUT)
        record["exit"] = proc.returncode
        if proc.returncode != 0:
            record["error"] = (proc.stderr or proc.stdout)[-400:]
        if EXECUTORS[executor][0] == "codex":
            match = SESSION_ID.search(proc.stdout + proc.stderr)
            found = glob.glob(os.path.expanduser(f"~/.codex/sessions/**/rollout-*{match.group(1)}.jsonl"),
                              recursive=True) if match else []
            record["transcript"] = found[0] if found else None
    except subprocess.TimeoutExpired:
        record["exit"] = "timeout"
    record["seconds"] = round(time.time() - started, 1)
    return record


def run(args: argparse.Namespace) -> None:
    spec = json.load(open(args.arms))
    prompts = json.load(open(args.prompts))
    arms = [arm["name"] for arm in spec["arms"] if args.executor in arm.get("executors", list(EXECUTORS))]
    jobs = schedule(arms, prompts["prompts"], args.repeat, args.seed)[: args.limit or None]
    done = set()
    if os.path.exists(args.out):
        for line in open(args.out):
            row = json.loads(line)
            done.add((row["arm"], row["prompt_id"], row["rep"]))
    todo = [job for job in jobs if (job[0], job[1]["id"], job[2]) not in done]
    print(f"{len(todo)} runs to do ({len(jobs) - len(todo)} already recorded)", flush=True)

    stop = threading.Event()
    lock = threading.Lock()
    streak = [0]

    def task(job):
        if stop.is_set():
            return None
        arm, prompt, rep = job
        run_dir = os.path.join(args.envs, arm, "runs", f"{args.executor}-{prompt['id']}-r{rep}")
        if os.path.exists(run_dir):
            shutil.rmtree(run_dir)
        record = run_one(args.executor, os.path.join(args.envs, arm, "template"), run_dir, prompt,
                         prompts.get("suffix", ""))
        record.update(arm=arm, prompt_id=prompt["id"], rep=rep, executor=args.executor,
                      asked_table=bool(MRC.TABLE_ASK.search(prompt["text"])))
        # A quota failure says nothing about the arm, so it is not recorded and a resume reruns it.
        record["quota"] = bool(QUOTA.search(record.get("error") or ""))
        with lock:
            streak[0] = streak[0] + 1 if record["quota"] else 0
            if streak[0] >= QUOTA_STOP:
                stop.set()
        return record

    with open(args.out, "a") as out, concurrent.futures.ThreadPoolExecutor(args.jobs) as pool:
        futures = [pool.submit(task, job) for job in todo]
        for count, future in enumerate(concurrent.futures.as_completed(futures), 1):
            record = future.result()
            if record is None:
                continue
            if record.pop("quota"):
                print(f"[{count}/{len(todo)}] {record['arm']} {record['prompt_id']} r{record['rep']} quota, not recorded",
                      flush=True)
                continue
            out.write(json.dumps(record) + "\n")
            out.flush()
            print(f"[{count}/{len(todo)}] {record['arm']} {record['prompt_id']} r{record['rep']} "
                  f"exit={record['exit']} {record['seconds']}s", flush=True)
    if stop.is_set():
        print(f"stopped: {QUOTA_STOP} quota failures in a row; resume once the quota resets", flush=True)

# ───────────────────────────────────────────────────────────────
# 4. TRANSCRIPTS
# ───────────────────────────────────────────────────────────────


def relative(path: str, run_dir: str) -> str:
    path = path.strip().strip("'\"")
    if path.startswith(run_dir):
        path = path[len(run_dir):].lstrip("/")
    return path


def devin_events(path: str, run_dir: str) -> List[Tuple]:
    data = json.load(open(path))
    events = []
    for step in data.get("steps", []):
        if step.get("source") != "agent":
            continue
        calls = step.get("tool_calls") or []
        for call in calls:
            name = call.get("function_name")
            arguments = call.get("arguments") or {}
            if name == "read":
                for ref in RULE_REF.findall(arguments.get("file_path", "")):
                    events.append(("read", ref))
            elif name == "exec":
                command = arguments.get("command", "")
                if MRC.READ_VERB.search(command):
                    for ref in RULE_REF.findall(command):
                        events.append(("read", ref))
            elif name in ("edit", "write", "notebook_edit"):
                events.append(("write", relative(arguments.get("file_path", ""), run_dir)))
        if not calls and step.get("message"):
            events.append(("reply", step["message"]))
    return events


def codex_events(path: str, run_dir: str) -> List[Tuple]:
    events = []
    for line in open(path, errors="ignore"):
        try:
            obj = json.loads(line)
        except ValueError:
            continue
        payload = obj.get("payload") or {}
        if obj.get("type") != "response_item":
            continue
        kind = payload.get("type")
        if kind in ("custom_tool_call", "function_call"):
            call = str(payload.get("input") or payload.get("arguments") or "")
            if "exec_command" in call and MRC.READ_VERB.search(call):
                for ref in RULE_REF.findall(call):
                    events.append(("read", ref))
            for target in PATCH_PATH.findall(call):
                events.append(("write", relative(target, run_dir)))
        elif kind == "message" and payload.get("role") == "assistant" and payload.get("phase") in (None, "final_answer"):
            text = "".join(part.get("text", "") for part in payload.get("content") or [] if isinstance(part, dict))
            if text:
                events.append(("reply", text))
    return events


def rule_key(ref: str) -> Tuple[str, bool]:
    """(rule file name, whether the reference is to its card)."""
    if ref.replace("\\ ", " ") == ROUTER:
        return ROUTER, False
    return os.path.basename(ref), "/cards/" in ref

# ───────────────────────────────────────────────────────────────
# 5. SCORE
# ───────────────────────────────────────────────────────────────


def score_run(record: Dict, arm_spec: Dict) -> Optional[Dict]:
    path = record.get("transcript")
    if record.get("exit") != 0 or not path or not os.path.exists(path):
        return None
    run_dir = record["run_dir"]
    events = devin_events(path, run_dir) if EXECUTORS[record["executor"]][0] == "devin" else codex_events(path, run_dir)
    resident = set(arm_spec.get("resident", []))
    delivered, seen_files, first_write_ok, wrote = set(resident), set(), None, False
    cards_read, full_after_card, reply = set(), set(), None
    for event in events:
        if event[0] == "read":
            name, is_card = rule_key(event[1])
            delivered.add(name)
            seen_files.add(event[1])
            if is_card:
                cards_read.add(name)
            elif name in cards_read:
                full_after_card.add(name)
        elif event[0] == "write" and not MRC.is_exempt_target(event[1], run_dir, run_dir):
            if not wrote:
                wrote, first_write_ok = True, ROUTER in delivered
        elif event[0] == "reply":
            reply = event[1]
            # Snapshot at the reply: a rule counts as delivered only if it was read before the final reply.
            reply_delivered = all(rule in delivered for rule in REPLY_RULES)
            communication_delivered = "communication.md" in delivered
    if reply is None:
        return None
    rule_bytes = 0
    for ref in seen_files:
        name, _ = rule_key(ref)
        target = os.path.join(run_dir, ROUTER if name == ROUTER else os.path.join(".skilled", ref))
        if os.path.exists(target):
            rule_bytes += os.path.getsize(target)
    prose = MRC.prose_only(reply)
    long_reply = len(reply) >= MRC.MIN_REPLY_CHARS
    return {
        "long_reply": long_reply,
        "checks": {name: bool(test(reply, prose)) for name, (_, test) in MRC.CHECKS.items()},
        "asked_table": record.get("asked_table", False),
        "communication_delivered": communication_delivered,
        "reply_rules_delivered": reply_delivered,
        "wrote": wrote,
        "gate5_ok": first_write_ok,
        "fallback": bool(full_after_card),
        "used_cards": bool(cards_read),
        "rule_bytes": rule_bytes,
    }


def summarize(rows: List[Dict]) -> Dict:
    long_rows = [r for r in rows if r["long_reply"]]
    unasked = [r for r in long_rows if not r["asked_table"]]
    delivered = [r for r in unasked if r["communication_delivered"]]
    writers = [r for r in rows if r["wrote"]]
    carders = [r for r in rows if r["used_cards"]]

    def rate(subset, key, inner=None):
        k = sum(1 for r in subset if (r["checks"][inner] if inner else r[key]))
        return MRC.rate(k, len(subset))

    return {
        "runs_scored": len(rows),
        "long_replies": len(long_rows),
        "table_unasked": rate(unasked, None, "table"),
        "table_unasked_rule_delivered": rate(delivered, None, "table"),
        "communication_delivered": rate(unasked, "communication_delivered"),
        "prohibitions": {name: rate(long_rows, None, name) for name in MRC.CHECKS},
        "any_prohibition": MRC.rate(sum(1 for r in long_rows if any(r["checks"].values())), len(long_rows)),
        "gate5_miss": MRC.rate(sum(1 for r in writers if not r["gate5_ok"]), len(writers)),
        "reply_rules_miss": MRC.rate(sum(1 for r in long_rows if not r["reply_rules_delivered"]), len(long_rows)),
        "fallback": rate(carders, "fallback"),
        "mean_rule_bytes": (sum(r["rule_bytes"] for r in rows) / len(rows)) if rows else None,
    }


def newcombe(k1: int, n1: int, k2: int, n2: int) -> Optional[Dict]:
    """Second proportion minus the first, with Newcombe's hybrid score 95% interval."""
    if not n1 or not n2:
        return None
    lo1, hi1 = MRC.wilson(k1, n1)
    lo2, hi2 = MRC.wilson(k2, n2)
    p1, p2 = k1 / n1, k2 / n2
    d = p2 - p1
    return {"d": d, "ci95": (d - ((p2 - lo2) ** 2 + (hi1 - p1) ** 2) ** 0.5,
                             d + ((hi2 - p2) ** 2 + (p1 - lo1) ** 2) ** 0.5)}


def compare(result: Dict, order: List[str], metric: str) -> Dict:
    """Difference on `metric` for each pair of arms in arms-file order, within each executor group."""
    out = {}
    prefixes = sorted({name.rsplit("/", 1)[0] for name in result})
    for prefix in prefixes:
        names = [f"{prefix}/{arm}" for arm in order if f"{prefix}/{arm}" in result]
        for first, second in zip(names, names[1:]):
            a, b = result[first][metric], result[second][metric]
            out[f"{second} - {first}"] = newcombe(a["k"], a["n"], b["k"], b["n"])
    return out


def score(args: argparse.Namespace) -> None:
    records = [json.loads(line) for path in args.runs for line in open(path)]
    arm_specs = {}
    if args.arms:
        arm_specs = {arm["name"]: arm for arm in json.load(open(args.arms))["arms"]}
    groups: Dict[Tuple[str, str], List[Dict]] = {}
    failed: Dict[Tuple[str, str], int] = {}
    for record in records:
        key = ("pooled" if args.pool else record["executor"], record["arm"])
        scored = score_run(record, arm_specs.get(record["arm"], {}))
        if scored is None:
            failed[key] = failed.get(key, 0) + 1
        else:
            groups.setdefault(key, []).append(scored)
    result = {f"{executor}/{arm}": dict(summarize(groups.get((executor, arm), [])), unscorable=failed.get((executor, arm), 0))
              for executor, arm in sorted(set(groups) | set(failed))}
    order = list(arm_specs) or sorted({record["arm"] for record in records})
    diffs = compare(result, order, args.metric)
    if args.json:
        print(json.dumps({"groups": result, "differences": {"metric": args.metric, **diffs}}, indent=2))
        return
    for name, summary in result.items():
        print(f"== {name}: runs={summary['runs_scored']} long={summary['long_replies']} unscorable={summary['unscorable']}")
        print(f"   table (unasked) {MRC.fmt_rate(summary['table_unasked'])} | "
              f"with communication.md delivered {MRC.fmt_rate(summary['table_unasked_rule_delivered'])} | "
              f"delivery {MRC.fmt_rate(summary['communication_delivered'])}")
        print("   " + " | ".join(f"{k} {MRC.fmt_rate(v)}" for k, v in summary["prohibitions"].items() if k != "table"))
        mean = summary["mean_rule_bytes"]
        print(f"   gate5 miss {MRC.fmt_rate(summary['gate5_miss'])} | reply-rules miss "
              f"{MRC.fmt_rate(summary['reply_rules_miss'])} | fallback {MRC.fmt_rate(summary['fallback'])} | "
              f"mean rule bytes {'n/a' if mean is None else round(mean)}")
    for name, diff in diffs.items():
        text = "n/a" if diff is None else f"{100 * diff['d']:+.1f} pts [{100 * diff['ci95'][0]:+.1f} to {100 * diff['ci95'][1]:+.1f}]"
        print(f"== {args.metric}: {name} {text}")

# ───────────────────────────────────────────────────────────────
# 6. ENTRY POINT
# ───────────────────────────────────────────────────────────────


def main(argv: List[str]) -> None:
    parser = argparse.ArgumentParser(description="Controlled repo-rule experiments in isolated test environments.")
    sub = parser.add_subparsers(dest="command", required=True)
    b = sub.add_parser("build")
    b.add_argument("--arms", required=True)
    b.add_argument("--out", required=True)
    b.add_argument("--repo", default=os.getcwd())
    r = sub.add_parser("run")
    r.add_argument("--arms", required=True)
    r.add_argument("--envs", required=True)
    r.add_argument("--prompts", required=True)
    r.add_argument("--executor", required=True, choices=sorted(EXECUTORS))
    r.add_argument("--out", required=True)
    r.add_argument("--repeat", type=int, default=1)
    r.add_argument("--jobs", type=int, default=4)
    r.add_argument("--seed", type=int, default=16)
    r.add_argument("--limit", type=int, default=0)
    s = sub.add_parser("score")
    s.add_argument("--runs", nargs="+", required=True)
    s.add_argument("--arms")
    s.add_argument("--json", action="store_true")
    s.add_argument("--pool", action="store_true", help="group by arm across executors")
    s.add_argument("--metric", default="table_unasked_rule_delivered", choices=RATE_METRICS,
                   help="summary rate the arm difference uses")
    args = parser.parse_args(argv)
    {"build": build, "run": run, "score": score}[args.command](args)


if __name__ == "__main__":
    main(sys.argv[1:])
