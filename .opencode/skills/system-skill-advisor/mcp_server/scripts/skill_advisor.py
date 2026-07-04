#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL ADVISOR
# ───────────────────────────────────────────────────────────────

"""
Skill Advisor - Analyzes user requests and recommends appropriate skills.
Used by Gate 2 in AGENTS.md for skill routing.

Usage: python skill_advisor.py "user request" [--threshold 0.8]
Output: JSON array of skill recommendations with confidence scores

Options:
    --stdin      Read the single prompt from stdin instead of argv
    --stdin-preferred  Prefer stdin for the single-prompt mode, falling back to argv when stdin is empty
    --deep-skill-routing-json  Score deep-loop-workflows mode routing (research|review|ai-council) from JSON stdin
    --health      Run health check diagnostics
    --validate-only  Run strict skill-graph validation
    --threshold   Confidence threshold used by default dual-threshold filtering (default: 0.8)
    --confidence-only  Explicitly bypass uncertainty filtering
"""

import argparse
import hashlib
import importlib.util
import json
import os
import re
import sqlite3
import subprocess
import sys
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional, Set


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Path to skill directory.
# This script lives in .opencode/skills/system-skill-advisor/mcp_server/scripts/.
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
SKILLS_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".."))
REPO_ROOT = os.path.dirname(os.path.dirname(SKILLS_DIR))
DISABLE_ADVISOR_ENV = "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED"
FORCE_LOCAL_ENV = "SPECKIT_SKILL_ADVISOR_FORCE_LOCAL"
NATIVE_TIMEOUT_SECONDS = 2.5
NATIVE_ADVISOR_STATUS = os.path.join(
    REPO_ROOT,
    ".opencode",
    "skills",
    "system-skill-advisor",
    "mcp_server",
    "dist",
    "mcp_server",
    "handlers",
    "advisor-status.js",
)
NATIVE_ADVISOR_COMPAT = os.path.join(
    REPO_ROOT,
    ".opencode",
    "skills",
    "system-skill-advisor",
    "mcp_server",
    "dist",
    "mcp_server",
    "compat",
    "index.js",
)
NATIVE_GENERATION_MODULE = os.path.join(
    REPO_ROOT,
    ".opencode",
    "skills",
    "system-skill-advisor",
    "mcp_server",
    "dist",
    "mcp_server",
    "lib",
    "freshness",
    "generation.js",
)
MODE_REGISTRY_PATH = os.path.join(SKILLS_DIR, "deep-loop-workflows", "mode-registry.json")
ALIASES_TS_PATH = os.path.join(
    SKILLS_DIR,
    "system-skill-advisor",
    "mcp_server",
    "lib",
    "scorer",
    "aliases.ts",
)
TS_PROJECTION_START = "// BEGIN GENERATED DEEP ROUTING PROJECTION"
TS_PROJECTION_END = "// END GENERATED DEEP ROUTING PROJECTION"
PY_HASH_START = "# BEGIN GENERATED DEEP ROUTING " + "PROJECTION HASH"
PY_HASH_END = "# END GENERATED DEEP ROUTING " + "PROJECTION HASH"
PY_LEXICAL_START = "# BEGIN GENERATED DEEP ROUTING " + "LEXICAL PROJECTION"
PY_LEXICAL_END = "# END GENERATED DEEP ROUTING " + "LEXICAL PROJECTION"
PY_LEXICAL_ORDER = ("deep-review", "deep-research", "deep-ai-council")

NATIVE_ADVISOR_BRIDGE = r"""
import { readFileSync } from 'node:fs';
import { readAdvisorStatus, handleAdvisorRecommend } from 'ADVISOR_COMPAT_MODULE';
import { readSkillGraphGeneration } from 'GENERATION_MODULE';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const workspaceRoot = input.workspaceRoot || process.cwd();

function unavailable(reason) {
  return {
    available: false,
    freshness: 'unavailable',
    generation: 0,
    trustState: {
      state: 'unavailable',
      reason,
      generation: 0,
      checkedAt: new Date().toISOString(),
      lastLiveAt: null,
    },
    reason,
  };
}

function probe() {
  if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
    return unavailable('ADVISOR_DISABLED');
  }
  try {
    const status = readAdvisorStatus({ workspaceRoot });
    // Compat-shim eligibility: native MCP callers gate on daemon liveness via
    // status.freshness, but the Python shim is itself a one-shot reader that
    // has no daemon to probe. Fall back to the underlying generation state so
    // a fresh skill-graph artifact is still considered usable when invoked
    // through skill_advisor.py (--force-native and the default routing path).
    let shimEligible = status.freshness === 'live' || status.freshness === 'stale';
    let effectiveFreshness = status.freshness;
    if (!shimEligible) {
      try {
        const generation = readSkillGraphGeneration(workspaceRoot);
        if (generation.state === 'live' || generation.state === 'stale') {
          shimEligible = true;
          effectiveFreshness = generation.state;
        }
      } catch {
        // Keep shimEligible=false; surface the original status reason below.
      }
    }
    return {
      available: shimEligible,
      freshness: effectiveFreshness,
      generation: status.generation,
      trustState: status.trustState,
      daemonPid: status.daemonPid || null,
      reason: (status.errors && status.errors[0]) || status.trustState.reason || null,
    };
  } catch (error) {
    return unavailable((error && error.name ? error.name : 'PROBE_FAILED').toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
  }
}

const probeResult = probe();
if (input.mode === 'status') {
  process.stdout.write(JSON.stringify({ status: 'ok', data: probeResult }));
} else if (!probeResult.available) {
  process.stdout.write(JSON.stringify({ status: 'unavailable', data: probeResult }));
} else {
  const response = await handleAdvisorRecommend({
    prompt: String(input.prompt || ''),
    options: {
      topK: Number.isFinite(input.topK) ? input.topK : 10,
      includeAbstainReasons: true,
      includeAttribution: false,
      confidenceThreshold: Number.isFinite(input.confidenceThreshold) ? input.confidenceThreshold : undefined,
      uncertaintyThreshold: Number.isFinite(input.uncertaintyThreshold) ? input.uncertaintyThreshold : undefined,
    },
  });
  const parsed = JSON.parse(response.content[0].text);
  process.stdout.write(JSON.stringify({
    status: parsed.status || 'ok',
    data: parsed.data,
    probe: probeResult,
  }));
}
"""

RUNTIME_PATH = os.path.join(SCRIPT_DIR, "skill_advisor_runtime.py")
COMPAT_CONTRACT_PATH = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "schemas", "compat-contract.json"))
with open(COMPAT_CONTRACT_PATH, "r", encoding="utf-8") as _compat_contract_file:
    COMPAT_CONTRACT = json.load(_compat_contract_file)
DISABLE_ADVISOR_ENV = COMPAT_CONTRACT["disabledEnv"]
FORCE_LOCAL_ENV = COMPAT_CONTRACT["forceLocalEnv"]
NATIVE_DEFAULT_CONFIDENCE_THRESHOLD = COMPAT_CONTRACT["defaults"]["confidenceThreshold"]
NATIVE_DEFAULT_UNCERTAINTY_THRESHOLD = COMPAT_CONTRACT["defaults"]["uncertaintyThreshold"]
NATIVE_BRIDGE_ENV_ALLOWLIST = {
    "PATH",
    "HOME",
    "USER",
    "LOGNAME",
    "SHELL",
    "TMPDIR",
    "TEMP",
    "TMP",
    "LANG",
    "LC_ALL",
    "CI",
    "VITEST",
    "MK_SKILL_ADVISOR_DB_DIR",
    "SYSTEM_SKILL_ADVISOR_DB_DIR",
    "SPECKIT_RUNTIME",
    "SPECKIT_ADVISOR_FRESHNESS",
    "SPECKIT_SKILL_ADVISOR_FORCE_LOCAL",
    "SPECKIT_OPENCODE_HOOK_TIMEOUT_MS",
    "SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST",
    "SPECKIT_ADVISOR_SHADOW_DELTA_PATH",
    "SPECKIT_METRICS_ENABLED",
    "SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS",
}
_RUNTIME_SPEC = None
_runtime_module = None
_runtime_load_error: Optional[Exception] = None
try:
    _RUNTIME_SPEC = importlib.util.spec_from_file_location("skill_advisor_runtime", RUNTIME_PATH)
    if _RUNTIME_SPEC and _RUNTIME_SPEC.loader:
        _runtime_module = importlib.util.module_from_spec(_RUNTIME_SPEC)
        _RUNTIME_SPEC.loader.exec_module(_runtime_module)
except Exception as exc:  # pragma: no cover - startup safety
    _runtime_load_error = exc
    _runtime_module = None

if _runtime_module is None:
    raise RuntimeError(f"Failed to load runtime helpers from {RUNTIME_PATH}") from _runtime_load_error

# Compiled skill graph for relationship-aware routing
SKILL_GRAPH_PATH = os.path.join(SCRIPT_DIR, "skill-graph.json")
SKILL_GRAPH_COMPILER_PATH = os.path.join(SCRIPT_DIR, "skill_graph_compiler.py")
SKILL_GRAPH_SQLITE_PATH = os.path.normpath(os.path.join(
    os.path.dirname(__file__),
    '..',
    'database',
    'skill-graph.sqlite',
))
GRAPH_ADJACENCY_EDGE_TYPES = ("depends_on", "enhances", "siblings", "prerequisite_for")
GRAPH_ONLY_SKILL_IDS = {"system-skill-advisor"}
GRAPHLESS_INLINE_SKILL_IDS = {
    "create:agent",
    "create:testing-playbook",
    "memory:save",
}

SKILL_ALIAS_GROUPS = {
    "create:agent": {"command-create-agent", "/create:agent", "create:agent"},
    "create:testing-playbook": {
        "command-create-testing-playbook",
        "/create:testing-playbook",
        "create:testing-playbook",
    },
    "memory:save": {"command-memory-save", "/memory:save", "memory:save"},
    "deep-research": {
        "command-spec-kit-deep-research",
        "/deep:start-research-loop",
        "deep:start-research-loop",
        "deep-research",
        "sk-deep-research",
    },
    "deep-review": {
        "command-spec-kit-deep-review",
        "/deep:start-review-loop",
        "deep:start-review-loop",
        "deep-review",
        "sk-deep-review",
    },
    "deep-improvement": {
        "command-spec-kit-deep-agent-improvement",
        "/deep:start-agent-improvement-loop",
        "deep-agent-improvement",
        "sk-deep-agent-improvement",
    },
    "deep-ai-council": {
        "deep-ai-council",
        "deep council",
        "deep-council",
        "sk-ai-council",
    },
}
SKILL_ALIAS_TO_CANONICAL = {
    alias: canonical
    for canonical, aliases in SKILL_ALIAS_GROUPS.items()
    for alias in {canonical, *aliases}
}
# BEGIN GENERATED DEEP ROUTING PROJECTION HASH
DEEP_ROUTING_PROJECTION_HASH = "sha256:5c22ac993d9fb60ec1efcd4688cdf0452eb000ccb8108d581911155e5e9a7d02"
# END GENERATED DEEP ROUTING PROJECTION HASH
STRICT_TOPOLOGY_HEADERS = (
    ("DEPENDENCY CYCLE ERRORS", "dependency cycles"),
    ("SYMMETRY WARNINGS", "asymmetric edges"),
    ("ZERO-EDGE WARNINGS", "orphan skills"),
)
_SKILL_GRAPH: Optional[Dict[str, Any]] = None
_SKILL_GRAPH_SOURCE: Optional[str] = None
_SOURCE_METADATA_DIAGNOSTICS: Dict[str, List[Dict[str, str]]] = {
    "signal_map": [],
    "conflict_declarations": [],
}


def _json_hash(payload: Dict[str, Any]) -> str:
    """Return a stable SHA-256 hash for compact canonical JSON."""
    canonical = json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return f"sha256:{digest}"


def _load_mode_registry_projection(classes: Set[str]) -> List[Dict[str, Any]]:
    """Load projection entries from the parent-skill mode registry."""
    with open(MODE_REGISTRY_PATH, "r", encoding="utf-8") as registry_file:
        registry = json.load(registry_file)

    entries: List[Dict[str, Any]] = []
    for mode in registry.get("modes", []):
        if not isinstance(mode, dict):
            continue
        routing = mode.get("advisorRouting")
        if not isinstance(routing, dict):
            continue
        routing_class = routing.get("routingClass")
        if routing_class not in classes:
            continue
        legacy_id = routing.get("legacyAdvisorId")
        workflow_mode = mode.get("workflowMode")
        if not isinstance(legacy_id, str) or not isinstance(workflow_mode, str):
            raise ValueError(f"Mode registry entry missing legacy id or workflowMode: {mode!r}")
        aliases = routing.get("legacyAliases", [])
        if not isinstance(aliases, list) or not all(isinstance(alias, str) for alias in aliases):
            raise ValueError(f"Mode registry entry has invalid legacyAliases: {mode!r}")
        entries.append({
            "legacyAdvisorId": legacy_id,
            "workflowMode": workflow_mode,
            "routingClass": routing_class,
            "advisorDefaultMode": routing.get("advisorDefaultMode") is True,
            "legacyAliases": aliases,
        })

    return sorted(entries, key=lambda entry: entry["legacyAdvisorId"])


def _projection_hash(entries: List[Dict[str, Any]]) -> str:
    """Hash the generated advisor projection payload."""
    return _json_hash({
        "skill": "deep-loop-workflows",
        "entries": entries,
    })


def _ts_string(value: str) -> str:
    """Render a TypeScript single-quoted string literal for projection data."""
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def _render_ts_projection(entries: List[Dict[str, Any]], projection_hash: str) -> str:
    """Render the TypeScript generated projection block."""
    lines = [
        "/** Hash of the generated deep-loop routing projection embedded below. */",
        f"export const DEEP_ROUTING_PROJECTION_HASH = {_ts_string(projection_hash)};",
        "",
        "const GENERATED_DEEP_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({",
    ]
    for entry in entries:
        lines.append(f"  {_ts_string(entry['legacyAdvisorId'])}: [")
        for alias in entry["legacyAliases"]:
            lines.append(f"    {_ts_string(alias)},")
        lines.append("  ],")
    lines.extend([
        "});",
        "",
        "export const DEEP_MODE_BY_CANONICAL: Readonly<Record<string, string>> = Object.freeze({",
    ])
    for entry in entries:
        lines.append(f"  {_ts_string(entry['legacyAdvisorId'])}: {_ts_string(entry['workflowMode'])},")
    lines.append("});")
    return "\n".join(lines)


def _ordered_lexical_entries(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Keep existing Python tie order for known modes, then append new modes."""
    order = {skill: index for index, skill in enumerate(PY_LEXICAL_ORDER)}
    return sorted(entries, key=lambda entry: (order.get(entry["legacyAdvisorId"], 999), entry["legacyAdvisorId"]))


def _render_python_hash(projection_hash: str) -> str:
    """Render the Python generated projection hash block."""
    return f'DEEP_ROUTING_PROJECTION_HASH = "{projection_hash}"'


def _render_python_lexical_projection(entries: List[Dict[str, Any]]) -> str:
    """Render Python lexical routing constants from the registry projection."""
    ordered = _ordered_lexical_entries(entries)
    skill_items = ", ".join(f'"{entry["legacyAdvisorId"]}"' for entry in ordered)
    if len(ordered) == 1:
        skill_items = f"{skill_items},"
    lines = [
        f"DEEP_ROUTING_SKILLS = ({skill_items})",
        "DEEP_ROUTING_MODE_BY_KEY = {",
    ]
    for entry in ordered:
        lines.append(f'    "{entry["legacyAdvisorId"]}": "{entry["workflowMode"]}",')
    lines.append("}")
    return "\n".join(lines)


def _replace_marked_block(content: str, start: str, end: str, replacement: str) -> str:
    """Replace a generated block delimited by exact marker lines."""
    if start not in content or end not in content:
        raise ValueError(f"Generated projection markers missing: {start} / {end}")
    before, rest = content.split(start, 1)
    _, after = rest.split(end, 1)
    return f"{before}{start}\n{replacement.rstrip()}\n{end}{after}"


def emit_routing_projection(check_only: bool = False) -> int:
    """Emit generated advisor routing projection blocks from mode-registry.json."""
    entries = _load_mode_registry_projection({"lexical", "alias-fold"})
    lexical_entries = [entry for entry in entries if entry["routingClass"] == "lexical"]
    projection_hash = _projection_hash(entries)

    with open(ALIASES_TS_PATH, "r", encoding="utf-8") as aliases_file:
        aliases_content = aliases_file.read()
    with open(__file__, "r", encoding="utf-8") as script_file:
        script_content = script_file.read()

    next_aliases = _replace_marked_block(
        aliases_content,
        TS_PROJECTION_START,
        TS_PROJECTION_END,
        _render_ts_projection(entries, projection_hash),
    )
    next_script = _replace_marked_block(
        script_content,
        PY_HASH_START,
        PY_HASH_END,
        _render_python_hash(projection_hash),
    )
    next_script = _replace_marked_block(
        next_script,
        PY_LEXICAL_START,
        PY_LEXICAL_END,
        _render_python_lexical_projection(lexical_entries),
    )

    changed = []
    if next_aliases != aliases_content:
        changed.append(ALIASES_TS_PATH)
    if next_script != script_content:
        changed.append(__file__)

    if check_only:
        print(json.dumps({
            "status": "stale" if changed else "fresh",
            "projectionHash": projection_hash,
            "changed": changed,
        }, indent=2))
        return 1 if changed else 0

    if next_aliases != aliases_content:
        with open(ALIASES_TS_PATH, "w", encoding="utf-8") as aliases_file:
            aliases_file.write(next_aliases)
    if next_script != script_content:
        with open(__file__, "w", encoding="utf-8") as script_file:
            script_file.write(next_script)

    print(json.dumps({
        "status": "emitted",
        "projectionHash": projection_hash,
        "changed": changed,
    }, indent=2))
    return 0


def _file_url(path: str) -> str:
    """Return a minimal file URL for Node ESM dynamic imports."""
    return Path(path).resolve().as_uri()


def _native_bridge_source() -> str:
    """Render the inline Node bridge with absolute module URLs."""
    return (
        NATIVE_ADVISOR_BRIDGE
        .replace("ADVISOR_COMPAT_MODULE", _file_url(NATIVE_ADVISOR_COMPAT))
        .replace("GENERATION_MODULE", _file_url(NATIVE_GENERATION_MODULE))
    )


def _native_bridge_available() -> bool:
    """Return True when compiled native advisor handlers are present."""
    return os.path.exists(NATIVE_ADVISOR_COMPAT) and os.path.exists(NATIVE_GENERATION_MODULE)


def _native_bridge_env(source_env: Optional[Dict[str, str]] = None) -> Dict[str, str]:
    """Return the explicit environment passed to the Node native bridge."""
    source = source_env if source_env is not None else dict(os.environ)
    return {
        key: value
        for key, value in source.items()
        if key in NATIVE_BRIDGE_ENV_ALLOWLIST and isinstance(value, str)
    }


def _sanitize_native_label(value: Any) -> Optional[str]:
    """Sanitize native labels before translating public compat output."""
    if not isinstance(value, str):
        return None
    cleaned = " ".join(value.split()).strip()
    if not cleaned or len(cleaned) > 160:
        return None
    if re.search(r"\b(ignore|override|forget|bypass|disable|execute|run|call|tool|developer|assistant|previous instructions|all instructions)\b", cleaned, re.I):
        return None
    if re.search(r"<!--|-->|```|<script\b|</script>|^\s*(system|instruction|developer|assistant)\s*:", cleaned, re.I):
        return None
    return cleaned


def _sanitize_native_label_list(value: Any) -> List[str]:
    """Return prompt-safe native label arrays."""
    if not isinstance(value, list):
        return []
    labels: List[str] = []
    for item in value:
        sanitized = _sanitize_native_label(item)
        if sanitized:
            labels.append(sanitized)
    return labels


def _run_native_bridge(payload: Dict[str, Any], timeout: float = NATIVE_TIMEOUT_SECONDS) -> Dict[str, Any]:
    """Call the compiled native MCP advisor handlers through a tiny Node bridge."""
    if not _native_bridge_available():
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": "NATIVE_DIST_MISSING",
            },
        }

    try:
        result = subprocess.run(
            ["node", "--input-type=module", "-e", _native_bridge_source()],
            input=json.dumps(payload),
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=REPO_ROOT,
            env=_native_bridge_env(),
        )
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError) as exc:
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": exc.__class__.__name__.upper(),
            },
        }

    if result.returncode != 0:
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": "NATIVE_BRIDGE_NONZERO",
            },
        }

    try:
        parsed = json.loads(result.stdout or "{}")
    except json.JSONDecodeError:
        return {
            "status": "unavailable",
            "data": {
                "available": False,
                "freshness": "unavailable",
                "generation": 0,
                "reason": "NATIVE_BRIDGE_PARSE_FAILED",
            },
        }
    return parsed if isinstance(parsed, dict) else {"status": "unavailable", "data": {"available": False}}


def probe_native_advisor() -> Dict[str, Any]:
    """Probe native advisor availability without exposing prompt content."""
    if os.environ.get(FORCE_LOCAL_ENV) == "1":
        return {
            "available": False,
            "freshness": "unavailable",
            "generation": 0,
            "reason": "FORCE_LOCAL",
        }
    payload = {
        "mode": "status",
        "workspaceRoot": REPO_ROOT,
    }
    response = _run_native_bridge(payload)
    data = response.get("data") if isinstance(response, dict) else None
    return data if isinstance(data, dict) else {
        "available": False,
        "freshness": "unavailable",
        "generation": 0,
        "reason": "INVALID_NATIVE_PROBE",
    }


def _legacy_kind(skill_id: str) -> str:
    """Infer legacy CLI kind from the native skill id."""
    return "command" if skill_id.startswith("command-") else "skill"


def _legacy_recommendations_from_native(output: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Translate advisor_recommend output to the legacy JSON-array CLI contract."""
    recommendations = output.get("recommendations")
    if not isinstance(recommendations, list):
        return []
    shadow_by_skill: Dict[str, Dict[str, Any]] = {}
    shadow = output.get("_shadow")
    if isinstance(shadow, dict):
        shadow_recommendations = shadow.get("recommendations")
        if isinstance(shadow_recommendations, list):
            for shadow_item in shadow_recommendations:
                if not isinstance(shadow_item, dict):
                    continue
                shadow_skill_id = _sanitize_native_label(shadow_item.get("skillId"))
                if shadow_skill_id:
                    shadow_by_skill[shadow_skill_id] = shadow_item

    legacy: List[Dict[str, Any]] = []
    for recommendation in recommendations:
        if not isinstance(recommendation, dict):
            continue
        skill_id = _sanitize_native_label(recommendation.get("skillId"))
        if not skill_id:
            continue
        item: Dict[str, Any] = {
            "skill": skill_id,
            "kind": _legacy_kind(skill_id),
            "confidence": recommendation.get("confidence", 0),
            "uncertainty": recommendation.get("uncertainty", 0.0),
            "passes_threshold": True,
            "reason": "Matched by native advisor_recommend",
            "source": "native",
        }
        if "score" in recommendation:
            item["score"] = recommendation["score"]
        if "dominantLane" in recommendation:
            item["dominant_lane"] = recommendation["dominantLane"]
        if "status" in recommendation:
            status = _sanitize_native_label(recommendation["status"])
            if status:
                item["status"] = status
        if "redirectFrom" in recommendation:
            item["redirect_from"] = _sanitize_native_label_list(recommendation["redirectFrom"])
        if "redirectTo" in recommendation:
            redirect_to = _sanitize_native_label(recommendation["redirectTo"])
            if redirect_to:
                item["redirect_to"] = redirect_to
        workflow_mode = _sanitize_native_label(recommendation.get("workflowMode"))
        if workflow_mode:
            item["workflowMode"] = workflow_mode
            item.setdefault("mode", workflow_mode)
        if skill_id in shadow_by_skill:
            item["_shadow"] = shadow_by_skill[skill_id]
        legacy.append(item)
    return legacy


def recommend_with_native_advisor(
    prompt: str,
    confidence_threshold: float = 0.8,
    uncertainty_threshold: float = 0.35,
    confidence_only: bool = False,
) -> Optional[List[Dict[str, Any]]]:
    """Return native recommendations when the MCP advisor surface is available."""
    response = _run_native_bridge({
        "mode": "recommend",
        "workspaceRoot": REPO_ROOT,
        "prompt": prompt,
        "topK": 10,
        "confidenceThreshold": confidence_threshold,
        "uncertaintyThreshold": 1.0 if confidence_only else uncertainty_threshold,
    })
    data = response.get("data") if isinstance(response, dict) else None
    if not isinstance(data, dict):
        return None
    if response.get("status") != "ok":
        return None
    recommendations = _legacy_recommendations_from_native(data)
    if recommendations is not None:
        prompt_lower = prompt.lower()
        _apply_deep_research_disambiguation(recommendations, prompt_lower)
        _apply_deep_skill_routing_layer(recommendations, prompt)
        recommendations.sort(
            key=lambda x: (
                -float(x.get("confidence", 0.0)),
                -float(x.get("score", 0.0) if isinstance(x.get("score"), (int, float)) else 0.0),
                str(x.get("skill", "")),
            )
        )
        recommendations = filter_recommendations(
            recommendations=recommendations,
            confidence_threshold=confidence_threshold,
            uncertainty_threshold=uncertainty_threshold,
            confidence_only=confidence_only,
            show_rejections=False,
        )
    return recommendations


def _log_skill_graph_warning(message: str) -> None:
    """Emit skill graph status messages to stderr for CLI visibility."""
    print(message, file=sys.stderr)


def _compute_hub_skills(adjacency: Dict[str, Dict[str, Dict[str, float]]]) -> List[str]:
    """Compute hub skills using the compiled-graph median inbound-degree rule."""
    inbound_counts: Dict[str, int] = {}

    for edge_groups in adjacency.values():
        for targets in edge_groups.values():
            for target in targets:
                inbound_counts[target] = inbound_counts.get(target, 0) + 1

    if not inbound_counts:
        return []

    counts = sorted(inbound_counts.values())
    median = counts[len(counts) // 2]
    return sorted(skill for skill, count in inbound_counts.items() if count > median)


def _normalize_signal_phrase(signal: str) -> str:
    """Normalize graph-declared signal phrases for stable matching."""
    return " ".join(signal.strip().lower().split())


def _expand_signal_variants(signal: str) -> Set[str]:
    """Build phrase variants from graph metadata signals and trigger phrases."""
    normalized = _normalize_signal_phrase(signal)
    if not normalized:
        return set()
    return {
        normalized,
        normalized.replace("-", " "),
        normalized.replace("_", " "),
        normalized.replace("-", "_"),
    }


def _extend_signal_map(
    signal_map: Dict[str, List[str]],
    skill_id: str,
    raw_signals: Any,
) -> None:
    """Merge normalized signal variants into a per-skill routing map."""
    if not isinstance(raw_signals, list) or not raw_signals:
        return

    existing = signal_map.setdefault(skill_id, [])
    seen = set(existing)
    for raw_signal in raw_signals:
        if not isinstance(raw_signal, str):
            continue
        for variant in sorted(_expand_signal_variants(raw_signal)):
            if variant and variant not in seen:
                existing.append(variant)
                seen.add(variant)


def _record_source_metadata_issue(surface: str, file_path: str, reason: str) -> None:
    """Record malformed source metadata so health checks cannot look green."""
    _SOURCE_METADATA_DIAGNOSTICS.setdefault(surface, []).append({
        "path": file_path,
        "reason": reason,
    })


def _source_metadata_health() -> Dict[str, Any]:
    """Summarize source metadata diagnostics collected by fallback loaders."""
    issues: List[Dict[str, str]] = []
    for surface, surface_issues in _SOURCE_METADATA_DIAGNOSTICS.items():
        for issue in surface_issues:
            issues.append({
                "surface": surface,
                "path": issue.get("path", ""),
                "reason": issue.get("reason", "unknown"),
            })
    return {
        "healthy": len(issues) == 0,
        "issue_count": len(issues),
        "issues": issues[:25],
    }


def _doc_trigger_harvest_enabled() -> bool:
    """Opt-in gate mirroring the TS daemon's doc-frontmatter harvest flag."""
    return (os.environ.get("SPECKIT_ADVISOR_DOC_TRIGGERS") or "").strip().lower() == "true"


_DOC_HARVEST_SUBDIRS = ("references", "assets")
_DOC_MAX_PHRASES_PER_DOC = 12
_DOC_MAX_DOCS_PER_SKILL = 200


def _parse_doc_trigger_phrases(raw: str) -> List[str]:
    """Extract trigger_phrases entries from a doc's YAML-ish frontmatter block."""
    if not raw.startswith("---\n") and not raw.startswith("---\r\n"):
        return []
    end = raw.find("\n---", 3)
    if end <= 3:
        return []
    block = raw[raw.find("\n") + 1:end]

    phrases: List[str] = []
    in_phrase_list = False
    for line in block.splitlines():
        list_match = re.match(r"^\s+-\s+(.*)$", line)
        if list_match:
            if in_phrase_list and len(phrases) < _DOC_MAX_PHRASES_PER_DOC:
                phrase = list_match.group(1).strip().strip("\"'").strip()
                if phrase:
                    phrases.append(phrase)
            continue
        key_match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not key_match:
            continue
        in_phrase_list = key_match.group(1) == "trigger_phrases"
        if in_phrase_list and key_match.group(2).startswith("["):
            for entry in key_match.group(2).strip("[]").split(","):
                if len(phrases) >= _DOC_MAX_PHRASES_PER_DOC:
                    break
                phrase = entry.strip().strip("\"'").strip()
                if phrase:
                    phrases.append(phrase)
            in_phrase_list = False
    return phrases


def _load_doc_trigger_phrases(skill_dir: str) -> List[str]:
    """Harvest doc-frontmatter trigger phrases (references/assets, READMEs excluded)."""
    phrases: List[str] = []
    doc_count = 0
    for subdir in _DOC_HARVEST_SUBDIRS:
        root = os.path.join(skill_dir, subdir)
        if not os.path.isdir(root):
            continue
        for dirpath, _dirnames, filenames in os.walk(root):
            for filename in sorted(filenames):
                if doc_count >= _DOC_MAX_DOCS_PER_SKILL:
                    return phrases
                lower = filename.lower()
                if not lower.endswith(".md") or lower == "readme.md":
                    continue
                doc_count += 1
                try:
                    with open(os.path.join(dirpath, filename), "r", encoding="utf-8") as handle:
                        raw = handle.read()
                except OSError:
                    continue
                phrases.extend(_parse_doc_trigger_phrases(raw))
    return phrases


def _load_source_graph_signal_map() -> Dict[str, List[str]]:
    """Load intent signals and derived trigger phrases from source metadata files."""
    _SOURCE_METADATA_DIAGNOSTICS["signal_map"] = []
    signal_map: Dict[str, List[str]] = {}

    try:
        skill_entries = sorted(os.scandir(SKILLS_DIR), key=lambda entry: entry.name)
    except OSError as exc:
        _record_source_metadata_issue("signal_map", SKILLS_DIR, f"scan_failed:{exc.__class__.__name__}")
        return signal_map

    for entry in skill_entries:
        if not entry.is_dir():
            continue

        graph_metadata_path = os.path.join(entry.path, "graph-metadata.json")
        if not os.path.exists(graph_metadata_path):
            continue

        try:
            with open(graph_metadata_path, "r", encoding="utf-8") as handle:
                graph_metadata = json.load(handle)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            _record_source_metadata_issue("signal_map", graph_metadata_path, f"parse_failed:{exc.__class__.__name__}")
            continue

        if not isinstance(graph_metadata, dict):
            _record_source_metadata_issue("signal_map", graph_metadata_path, "invalid_shape")
            continue

        skill_id = str(graph_metadata.get("skill_id") or entry.name)
        _extend_signal_map(signal_map, skill_id, graph_metadata.get("intent_signals"))

        derived = graph_metadata.get("derived")
        if isinstance(derived, dict):
            _extend_signal_map(signal_map, skill_id, derived.get("trigger_phrases"))
        elif derived is not None:
            _record_source_metadata_issue("signal_map", graph_metadata_path, "invalid_derived")

        if _doc_trigger_harvest_enabled():
            _extend_signal_map(signal_map, skill_id, _load_doc_trigger_phrases(entry.path))

    return signal_map


def _load_source_conflict_declarations() -> Dict[str, Set[str]]:
    """Read per-skill `graph-metadata.json` to recover directional conflict edges.

    Defense-in-depth for the runtime conflict penalty. The
    compiled graph's `conflicts` is flattened into undirected pairs, so the
    runtime cannot detect unilateral-declaration asymmetry from that payload
    alone. The compiler's symmetry check gates against unilateral
    declarations at build time, but if a compiled graph is shipped that
    bypassed validation (e.g. a legacy JSON artifact), the runtime must
    refuse to penalize a non-declaring skill. This helper replays the
    per-skill `conflicts_with` arrays so the runtime can cross-check.
    """
    _SOURCE_METADATA_DIAGNOSTICS["conflict_declarations"] = []
    declarations: Dict[str, Set[str]] = {}

    try:
        skill_entries = sorted(os.scandir(SKILLS_DIR), key=lambda entry: entry.name)
    except OSError as exc:
        _record_source_metadata_issue("conflict_declarations", SKILLS_DIR, f"scan_failed:{exc.__class__.__name__}")
        return declarations

    for entry in skill_entries:
        if not entry.is_dir():
            continue

        graph_metadata_path = os.path.join(entry.path, "graph-metadata.json")
        if not os.path.exists(graph_metadata_path):
            continue

        try:
            with open(graph_metadata_path, "r", encoding="utf-8") as handle:
                graph_metadata = json.load(handle)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            _record_source_metadata_issue("conflict_declarations", graph_metadata_path, f"parse_failed:{exc.__class__.__name__}")
            continue

        if not isinstance(graph_metadata, dict):
            _record_source_metadata_issue("conflict_declarations", graph_metadata_path, "invalid_shape")
            continue

        skill_id = str(graph_metadata.get("skill_id") or entry.name)
        edges = graph_metadata.get("edges")
        if not isinstance(edges, dict):
            continue

        conflicts = edges.get("conflicts_with")
        if not isinstance(conflicts, list):
            continue

        for edge in conflicts:
            if not isinstance(edge, dict):
                continue
            target = edge.get("target")
            if isinstance(target, str) and target:
                declarations.setdefault(skill_id, set()).add(target)

    return declarations


def _load_skill_graph_sqlite() -> Optional[Dict[str, Any]]:
    """Load compiled-equivalent skill graph data from SQLite."""
    if not os.path.exists(SKILL_GRAPH_SQLITE_PATH):
        return None

    try:
        with sqlite3.connect(SKILL_GRAPH_SQLITE_PATH) as connection:
            connection.row_factory = sqlite3.Row

            node_rows = connection.execute(
                "SELECT id, family, intent_signals, derived FROM skill_nodes ORDER BY id ASC"
            ).fetchall()
            if not node_rows:
                return None

            edge_rows = connection.execute(
                """
                SELECT source_id, target_id, edge_type, weight
                FROM skill_edges
                ORDER BY source_id ASC, edge_type ASC, target_id ASC
                """
            ).fetchall()

            schema_row = connection.execute(
                "SELECT version FROM schema_version LIMIT 1"
            ).fetchone()
            generated_at_row = connection.execute(
                "SELECT value FROM skill_graph_metadata WHERE key = 'last_scan_timestamp'"
            ).fetchone()
            # Durable topology-warning payload.
            topology_warnings_row = connection.execute(
                "SELECT value FROM skill_graph_metadata WHERE key = 'topology_warnings'"
            ).fetchone()
    except sqlite3.Error:
        return None

    try:
        families: Dict[str, List[str]] = {}
        adjacency: Dict[str, Dict[str, Dict[str, float]]] = {}
        signals: Dict[str, List[str]] = {}
        conflicts: Set[tuple[str, str]] = set()

        for node_row in node_rows:
            skill_id = str(node_row["id"])
            family = str(node_row["family"])
            families.setdefault(family, []).append(skill_id)

            raw_signals = node_row["intent_signals"]
            if raw_signals:
                _extend_signal_map(signals, skill_id, json.loads(raw_signals))

            raw_derived = node_row["derived"]
            if raw_derived:
                parsed_derived = json.loads(raw_derived)
                if isinstance(parsed_derived, dict):
                    _extend_signal_map(signals, skill_id, parsed_derived.get("trigger_phrases"))

        for edge_row in edge_rows:
            source_id = str(edge_row["source_id"])
            target_id = str(edge_row["target_id"])
            edge_type = str(edge_row["edge_type"])
            weight = float(edge_row["weight"])

            if edge_type == "conflicts_with":
                conflicts.add(tuple(sorted((source_id, target_id))))
                continue

            if edge_type not in GRAPH_ADJACENCY_EDGE_TYPES:
                continue

            adjacency.setdefault(source_id, {}).setdefault(edge_type, {})[target_id] = weight

        for family_name in families:
            families[family_name] = sorted(families[family_name])

        # Source metadata supplements the stored columns on every load path:
        # the JSON loader already merges it, and doc-frontmatter trigger
        # phrases exist only on disk, never in skill_nodes rows.
        source_signal_map = _load_source_graph_signal_map()
        for skill_id, raw_signals in source_signal_map.items():
            _extend_signal_map(signals, skill_id, raw_signals)

        generated_at = (
            str(generated_at_row["value"])
            if generated_at_row and generated_at_row["value"]
            else None
        )

        schema_version = int(schema_row["version"]) if schema_row and schema_row["version"] is not None else 1

        # Decode persisted topology warnings (best-effort; missing or
        # malformed payload degrades gracefully to empty).
        topology_warnings_payload: Dict[str, List[str]] = {}
        if topology_warnings_row and topology_warnings_row["value"]:
            try:
                decoded = json.loads(str(topology_warnings_row["value"]))
            except (TypeError, ValueError, json.JSONDecodeError):
                decoded = None
            if isinstance(decoded, dict):
                for category, messages in decoded.items():
                    if not isinstance(category, str):
                        continue
                    if not isinstance(messages, list):
                        continue
                    cleaned = sorted(str(m) for m in messages if isinstance(m, str) and m.strip())
                    if cleaned:
                        topology_warnings_payload[category] = cleaned

        return {
            "schema_version": schema_version,
            "generated_at": generated_at,
            "skill_count": len(node_rows),
            "families": dict(sorted(families.items())),
            "adjacency": dict(sorted(adjacency.items())),
            "signals": dict(sorted(signals.items())),
            "conflicts": [list(pair) for pair in sorted(conflicts)],
            "hub_skills": _compute_hub_skills(adjacency),
            "topology_warnings": dict(sorted(topology_warnings_payload.items())),
        }
    except (TypeError, ValueError, json.JSONDecodeError):
        return None


def _load_skill_graph_json() -> Optional[Dict[str, Any]]:
    """Load the legacy compiled JSON graph."""
    try:
        with open(SKILL_GRAPH_PATH, "r", encoding="utf-8") as f:
            graph = json.load(f)
    except (OSError, json.JSONDecodeError):
        return None

    if not isinstance(graph, dict):
        return None

    signal_map: Dict[str, List[str]] = {}
    for skill_id, raw_signals in (graph.get("signals") or {}).items():
        if isinstance(skill_id, str):
            _extend_signal_map(signal_map, skill_id, raw_signals)

    source_signal_map = _load_source_graph_signal_map()
    for skill_id, raw_signals in source_signal_map.items():
        _extend_signal_map(signal_map, skill_id, raw_signals)

    graph["signals"] = dict(sorted(signal_map.items()))

    # Normalize topology_warnings (older graphs may omit).
    raw_warnings = graph.get("topology_warnings")
    normalized_warnings: Dict[str, List[str]] = {}
    if isinstance(raw_warnings, dict):
        for category, messages in raw_warnings.items():
            if not isinstance(category, str) or not isinstance(messages, list):
                continue
            cleaned = sorted(str(m) for m in messages if isinstance(m, str) and m.strip())
            if cleaned:
                normalized_warnings[category] = cleaned
    graph["topology_warnings"] = dict(sorted(normalized_warnings.items()))
    return graph


def _load_skill_graph() -> Optional[Dict[str, Any]]:
    """Load the runtime skill graph from the SQLite store."""
    global _SKILL_GRAPH, _SKILL_GRAPH_SOURCE
    if _SKILL_GRAPH is not None:
        return _SKILL_GRAPH

    sqlite_exists = os.path.exists(SKILL_GRAPH_SQLITE_PATH)

    sqlite_graph = _load_skill_graph_sqlite()
    if sqlite_graph is not None:
        _SKILL_GRAPH = sqlite_graph
        _SKILL_GRAPH_SOURCE = "sqlite"
        _log_skill_graph_warning("Skill graph: loaded from SQLite")
        return _SKILL_GRAPH

    if sqlite_exists:
        _log_skill_graph_warning("Skill graph: SQLite exists but could not be loaded")
    else:
        _log_skill_graph_warning("Skill graph: SQLite unavailable; JSON export ignored for runtime")

    _SKILL_GRAPH_SOURCE = None
    return None


def _collect_strict_topology_violations(output: str) -> Dict[str, List[str]]:
    """Extract topology issues that strict validation must treat as fatal."""
    collected: Dict[str, List[str]] = {}
    active_category: Optional[str] = None
    header_to_category = dict(STRICT_TOPOLOGY_HEADERS)
    reset_headers = {
        "WEIGHT-BAND WARNINGS",
        "WEIGHT-PARITY WARNINGS",
        "VALIDATION PASSED",
        "VALIDATION FAILED",
    }

    for raw_line in output.splitlines():
        line = raw_line.rstrip()
        matched_header = next(
            (header for header in header_to_category if line.startswith(header)),
            None,
        )
        if matched_header is not None:
            active_category = header_to_category[matched_header]
            collected.setdefault(active_category, [])
            continue

        if any(line.startswith(header) for header in reset_headers):
            active_category = None
            continue

        if active_category and line.startswith("  - "):
            collected[active_category].append(line[4:])
            continue

        if line and not line.startswith(" "):
            active_category = None

    return {category: issues for category, issues in collected.items() if issues}


def run_skill_graph_validation(strict_topology: bool = False) -> int:
    """Run compiler validation and optionally fail hard on topology issues."""
    try:
        result = subprocess.run(
            [sys.executable, SKILL_GRAPH_COMPILER_PATH, "--validate-only"],
            capture_output=True,
            text=True,
        )
    except OSError as exc:
        print(f"Failed to run skill graph validator: {exc}", file=sys.stderr)
        return 2

    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)

    if strict_topology:
        combined_output = "\n".join(part for part in (result.stdout, result.stderr) if part)
        topology_violations = _collect_strict_topology_violations(combined_output)
        if topology_violations:
            summary = ", ".join(
                f"{category}={len(topology_violations[category])}"
                for _, category in STRICT_TOPOLOGY_HEADERS
                if topology_violations.get(category)
            )
            print(
                f"STRICT TOPOLOGY VALIDATION FAILED: {summary}",
                file=sys.stderr,
            )
            return 2

    return result.returncode


def _apply_graph_boosts(
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """Apply transitive boosts from skill graph relationships."""
    graph = _load_skill_graph()
    if not graph:
        return

    adjacency = graph.get("adjacency", {})
    snapshot = dict(skill_boosts)

    for skill_name, current_boost in snapshot.items():
        if current_boost <= 0:
            continue
        edges = adjacency.get(skill_name, {})

        for target, weight in edges.get("enhances", {}).items():
            transitive = current_boost * weight * 0.3
            if snapshot.get(target, 0) <= 0:
                continue
            if transitive >= 0.1:
                skill_boosts[target] = skill_boosts.get(target, 0) + transitive
                boost_reasons.setdefault(target, []).append(
                    f"!graph:enhances({skill_name},{weight:.1f})"
                )

        for target, weight in edges.get("siblings", {}).items():
            transitive = current_boost * weight * 0.15
            if snapshot.get(target, 0) <= 0:
                continue
            if transitive >= 0.1:
                skill_boosts[target] = skill_boosts.get(target, 0) + transitive
                boost_reasons.setdefault(target, []).append(
                    f"!graph:sibling({skill_name},{weight:.1f})"
                )

        for target, weight in edges.get("depends_on", {}).items():
            transitive = current_boost * weight * 0.2
            if snapshot.get(target, 0) <= 0:
                continue
            if transitive >= 0.1:
                skill_boosts[target] = skill_boosts.get(target, 0) + transitive
                boost_reasons.setdefault(target, []).append(
                    f"!graph:depends({skill_name},{weight:.1f})"
                )


def _apply_family_affinity(
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """When one family member has a strong signal, lightly boost siblings."""
    graph = _load_skill_graph()
    if not graph:
        return
    families = graph.get("families", {})

    for family_name, members in families.items():
        boosted = [(m, skill_boosts.get(m, 0)) for m in members if skill_boosts.get(m, 0) > 1.0]
        if not boosted:
            continue
        max_boost = max(b for _, b in boosted)
        for member in members:
            if 0 < skill_boosts.get(member, 0) < 1.0 and max_boost > 1.5:
                affinity = max_boost * 0.08
                if affinity >= 0.1:
                    skill_boosts[member] = skill_boosts.get(member, 0) + affinity
                    boost_reasons.setdefault(member, []).append(f"!graph:family({family_name})")


def _signal_match_boost(signal_phrase: str) -> float:
    """Weight exact graph-signal matches by phrase specificity."""
    token_count = max(1, len(re.findall(r'\b\w+\b', signal_phrase)))
    return min(0.9 + 0.35 * (token_count - 1), 1.8)


def _apply_signal_boosts(
    prompt_lower: str,
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> None:
    """Apply routing boosts from graph intent signals and trigger phrases."""
    graph = _load_skill_graph()
    if not graph:
        return

    for skill_name, signal_phrases in (graph.get("signals") or {}).items():
        if not isinstance(signal_phrases, list):
            continue

        matched_signals: List[str] = []
        total_boost = 0.0
        for signal_phrase in signal_phrases:
            if not isinstance(signal_phrase, str):
                continue
            normalized = _normalize_signal_phrase(signal_phrase)
            if not normalized or normalized in matched_signals:
                continue
            if not _matches_phrase_boundary(prompt_lower, normalized):
                continue

            total_boost += max(_signal_match_boost(normalized) - 0.15 * len(matched_signals), 0.2)
            matched_signals.append(normalized)

        if not matched_signals:
            continue

        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0.0) + min(total_boost, 3.0)
        reasons = boost_reasons.setdefault(skill_name, [])
        for matched_signal in matched_signals:
            reasons.append(f"!{matched_signal}(signal)")


def _apply_graph_conflict_penalty(recommendations: List[Dict[str, Any]]) -> None:
    """Increase uncertainty when conflicting skills are both recommended.

    Defense-in-depth reciprocity check. The compiled graph
    promises that `conflicts` pairs are mutually declared (compiler
    gate), but the runtime re-verifies by reading per-skill
    `graph-metadata.json` before penalizing. If a pair is unilateral, the
    penalty is skipped — a unilateral metadata edit must not silently
    create a bilateral runtime penalty.
    """
    graph = _load_skill_graph()
    if not graph:
        return
    conflicts = graph.get("conflicts", [])
    if not conflicts:
        return

    declarations = _load_source_conflict_declarations()

    def _is_mutually_declared(a: str, b: str) -> bool:
        # Empty declarations map means per-skill metadata was unreadable;
        # trust the compiled graph in that case (backwards compat) so we
        # don't silently break existing routing when running outside the
        # repo checkout.
        if not declarations:
            return True
        return b in declarations.get(a, set()) and a in declarations.get(b, set())

    passing = {r["skill"] for r in recommendations if r.get("passes_threshold")}
    conflict_set: Set[str] = set()
    for pair in conflicts:
        if len(pair) != 2:
            continue
        a, b = pair[0], pair[1]
        if a not in passing or b not in passing:
            continue
        if not _is_mutually_declared(a, b):
            continue
        conflict_set.update(pair)

    for rec in recommendations:
        if rec["skill"] in conflict_set:
            rec["uncertainty"] = min(rec["uncertainty"] + 0.15, 1.0)

get_cache_status = _runtime_module.get_cache_status
get_cached_skill_records = _runtime_module.get_cached_skill_records
parse_frontmatter_fast = _runtime_module.parse_frontmatter_fast

# Comprehensive stop words - filtered from BOTH query AND corpus
# These words have no semantic meaning for skill matching
STOP_WORDS = frozenset({
    'a', 'about', 'able', 'actually', 'agent', 'all', 'also', 'an', 'and', 'any',
    'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by', 'can', 'could', 'did',
    'do', 'does', 'even', 'for', 'from', 'get', 'give', 'go', 'going', 'had',
    'has', 'have', 'he', 'help', 'her', 'him', 'how', 'i', 'if', 'in', 'into',
    'is', 'it', 'its', 'just', 'let', 'like', 'may', 'me', 'might', 'more',
    'most', 'must', 'my', 'need', 'no', 'not', 'now', 'of', 'on', 'only', 'or',
    'other', 'our', 'please', 'really', 'she', 'should', 'skill',
    'so', 'some', 'tell', 'that', 'the', 'them', 'then', 'these', 'they',
    'thing', 'things', 'this', 'those', 'to', 'tool', 'try', 'us',
    'used', 'using', 'very', 'want', 'was', 'way', 'we', 'were', 'what', 'when',
    'where', 'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your'
})

# Synonym expansion - maps user intent to technical terms in SKILL.md
SYNONYM_MAP = {
    # Code structure & analysis
    "ast": ["treesitter", "syntax", "parse", "structure"],
    "codebase": ["code", "project", "repository", "source"],
    "functions": ["methods", "definitions", "symbols"],
    "classes": ["types", "definitions", "structure"],
    "symbols": ["definitions", "functions", "classes", "exports"],

    # Git & version control
    "branch": ["git", "commit", "merge", "checkout"],
    "commit": ["git", "version", "push", "branch", "changes"],
    "merge": ["git", "branch", "commit", "rebase"],
    "push": ["git", "commit", "remote", "branch"],
    "rebase": ["git", "branch", "commit", "history"],
    "stash": ["git", "changes", "temporary"],
    "worktree": ["git", "branch", "workspace", "isolation"],
    "git": ["commit", "branch", "version", "push", "merge", "worktree"],
    "pull": ["git", "fetch", "merge", "remote"],
    "clone": ["git", "repository", "download"],

    # Memory & context preservation
    "context": ["memory", "session", "save"],
    "remember": ["memory", "context", "save", "store"],
    "save": ["context", "memory", "preserve", "store"],
    "recall": ["memory", "search", "find", "retrieve"],
    "forget": ["memory", "delete", "remove"],
    "checkpoint": ["memory", "save", "restore", "backup"],
    "history": ["memory", "context", "past", "previous"],
    "memory": ["context", "session", "save", "store", "database", "vector", "embedding", "index"],
    "session": ["memory", "context", "conversation"],
    "preserve": ["memory", "save", "context", "store"],
    "store": ["memory", "save", "context", "persist"],

    # Documentation
    "doc": ["documentation", "explain", "describe", "markdown"],
    "docs": ["documentation", "explain", "describe", "markdown"],
    "document": ["documentation", "markdown", "write"],
    "write": ["documentation", "create", "generate"],
    "readme": ["documentation", "markdown", "explain"],
    "flowchart": ["documentation", "diagram", "ascii"],
    "diagram": ["documentation", "flowchart", "visual"],

    # Spec & planning
    "plan": ["spec", "architect", "design", "roadmap", "breakdown"],
    "spec": ["specification", "plan", "document", "folder"],
    "folder": ["spec", "directory", "create", "organize"],
    "scaffold": ["create", "generate", "new", "template"],
    "template": ["scaffold", "create", "generate"],

    # Debugging & browser
    "bug": ["debug", "error", "issue", "defect", "verification"],
    "console": ["chrome", "browser", "debug", "log"],
    "devtools": ["chrome", "browser", "debug", "inspect"],
    "network": ["chrome", "browser", "requests", "debug"],
    "inspect": ["chrome", "browser", "debug", "devtools"],
    "breakpoint": ["debug", "chrome", "devtools"],
    "screenshot": ["capture", "image", "browser", "chrome", "devtools"],
    "error": ["bug", "debug", "fix", "issue"],
    "issue": ["bug", "debug", "error", "problem"],

    # Web development, accessibility & cross-cutting concerns
    "layout": ["css", "frontend", "responsive", "grid", "flexbox"],
    "accessibility": ["aria", "wcag", "a11y", "semantic", "keyboard"],
    "aria": ["accessibility", "wcag", "a11y", "role", "label"],
    "audit": ["validate", "verify", "check", "review", "inspect"],
    "deployment": ["deploy", "release", "publish", "cdn", "build"],
    "handler": ["function", "callback", "listener", "event", "hook"],
    "export": ["download", "output", "generate", "har", "asset"],
    "toolchain": ["call_tool_chain", "code_mode", "utcp", "mcp"],
    "conflict": ["merge", "rebase", "resolution", "branch", "diverge"],

    # Cross-AI
    "cross-ai": ["second-opinion", "delegate", "handoff", "dispatch"],

    # Autoresearch
    "autoresearch": ["research", "loop", "iterative", "deep", "autonomous", "convergence"],
    "improvement": ["optimize", "refine", "candidate", "score", "loop"],
    "candidate": ["proposal", "variant", "experiment", "score"],
    "proposal": ["candidate", "experiment", "loop", "score"],
    "evaluator": ["score", "judge", "contract", "rubric"],
    "handover": ["continuation", "resume", "session", "document"],

    # Search & discovery
    "find": ["search", "locate", "explore", "lookup"],
    "search": ["find", "locate", "explore", "query", "lookup"],
    "where": ["find", "search", "locate", "navigate"],
    "lookup": ["find", "search", "locate"],
    "explore": ["search", "find", "navigate", "discover"],
    "navigate": ["find", "search", "locate", "goto"],
    "locate": ["find", "search", "where"],

    # Actions & creation
    "create": ["implement", "build", "generate", "new", "add", "scaffold"],
    "make": ["create", "implement", "build", "generate"],
    "new": ["create", "implement", "scaffold", "generate"],
    "add": ["create", "implement", "new", "insert"],
    "build": ["create", "implement", "generate"],
    "generate": ["create", "build", "scaffold"],

    # Code quality & fixes
    "check": ["verify", "validate", "test"],
    "fix": ["debug", "correct", "resolve", "code", "implementation"],
    "refactor": ["structure", "organize", "clean", "improve", "code"],
    "test": ["verify", "validate", "check", "spec", "quality"],
    "verify": ["check", "validate", "test", "confirm"],
    "validate": ["check", "verify", "test"],

    # Prompt engineering
    "prompt": ["enhance", "improve", "optimize", "engineering", "framework"],
    "enhance": ["prompt", "improve", "optimize", "refine"],

    # Understanding & explanation
    "help": ["guide", "assist", "documentation", "explain"],
    "how": ["understand", "explain", "works", "meaning"],
    "what": ["definition", "structure", "outline", "list"],
    "why": ["understand", "explain", "reason", "purpose"],
    "explain": ["understand", "how", "works", "describe"],
    "understand": ["how", "explain", "learn", "works"],
    "works": ["how", "understand", "explain", "function"],

    # Display & output
    "show": ["list", "display", "outline", "tree"],
    "list": ["show", "display", "enumerate"],
    "display": ["show", "list", "output"],
    "print": ["show", "display", "output"],
}

# Intent boosters - High-confidence keyword → skill direct mapping
# These keywords strongly indicate a specific skill, adding bonus score
# Format: keyword -> (skill_name, boost_amount)
# NOTE: These are checked BEFORE stop word filtering, so question words work here
# Score formula: Two-tiered based on intent boost presence
#   - With intent boost: confidence = min(0.50 + score * 0.15, 0.95)
#   - Without intent boost: confidence = min(0.25 + score * 0.15, 0.95)
# To reach 0.8 threshold with intent boost: need score >= 2.0
INTENT_BOOSTERS = {
    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Context preservation, recall, and specification
    # (Memory functionality merged into system-spec-kit)
    # ─────────────────────────────────────────────────────────────────
    "checkpoint": ("system-spec-kit", 0.6),
    "context": ("system-spec-kit", 0.6),
    "database": ("system-spec-kit", 0.4),
    "embedding": ("system-spec-kit", 0.5),
    "embeddings": ("system-spec-kit", 0.5),
    "forget": ("system-spec-kit", 0.4),
    "history": ("system-spec-kit", 0.4),
    "index": ("system-spec-kit", 0.4),
    "memory": ("system-spec-kit", 0.8),
    "preserve": ("system-spec-kit", 0.5),
    "recall": ("system-spec-kit", 0.6),
    "reindex": ("system-spec-kit", 0.6),
    "remember": ("system-spec-kit", 0.6),
    "restore": ("system-spec-kit", 0.4),
    "session": ("system-spec-kit", 0.4),
    "store": ("system-spec-kit", 0.4),
    "vector": ("system-spec-kit", 0.5),
    "voyage": ("system-spec-kit", 0.5),

    # ─────────────────────────────────────────────────────────────────
    # SYSTEM-SPEC-KIT: Specification and planning
    # ─────────────────────────────────────────────────────────────────
    "checklist": ("system-spec-kit", 0.5),
    "folder": ("system-spec-kit", 0.4),
    "plan": ("system-spec-kit", 0.5),
    "scaffold": ("system-spec-kit", 0.4),
    "spec": ("system-spec-kit", 0.6),
    "specification": ("system-spec-kit", 0.5),
    "speckit": ("system-spec-kit", 0.8),
    "task": ("system-spec-kit", 0.3),
    "tasks": ("system-spec-kit", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # SK-AUTORESEARCH: Autonomous deep research loop
    # ─────────────────────────────────────────────────────────────────
    "autoresearch": ("deep-research", 2.0),
    "convergence": ("deep-research", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-GIT: Version control operations
    # ─────────────────────────────────────────────────────────────────
    "git": ("sk-git", 1.0),
    "branch": ("sk-git", 0.4),
    "checkout": ("sk-git", 0.5),
    "clone": ("sk-git", 0.5),
    "commit": ("sk-git", 0.5),
    "conflict": ("sk-git", 0.6),
    "deploy": ("sk-git", 0.5),
    "diff": ("sk-git", 0.5),
    "fetch": ("sk-git", 0.4),
    "gh": ("sk-git", 1.5),
    "github": ("sk-git", 2.0),
    "issue": ("sk-git", 0.8),
    "log": ("sk-git", 0.4),
    "merge": ("sk-git", 0.5),
    "pr": ("sk-git", 0.8),
    "pull": ("sk-git", 0.5),
    "push": ("sk-git", 0.5),
    "rebase": ("sk-git", 0.8),
    "repo": ("sk-git", 0.6),
    "repository": ("sk-git", 0.5),
    "stash": ("sk-git", 0.5),
    "worktree": ("sk-git", 1.2),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE code-review mode: Stack-agnostic code review baseline
    # ─────────────────────────────────────────────────────────────────
    "review": ("sk-code", 1.2),
    "findings": ("sk-code", 1.1),
    "blocker": ("sk-code", 0.9),
    "blockers": ("sk-code", 0.9),
    "vulnerability": ("sk-code", 1.0),
    "regression": ("sk-code", 0.8),
    "audit": ("sk-code", 1.0),
    "solid": ("sk-code", 0.9),
    "readiness": ("sk-code", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # MCP-CHROME-DEVTOOLS: Browser debugging
    # ─────────────────────────────────────────────────────────────────
    "bdg": ("mcp-chrome-devtools", 1.0),
    "breakpoint": ("mcp-chrome-devtools", 0.6),
    "browser": ("mcp-chrome-devtools", 1.2),
    "chrome": ("mcp-chrome-devtools", 1.0),
    "console": ("mcp-chrome-devtools", 1.0),
    "debug": ("mcp-chrome-devtools", 0.6),
    "debugger": ("mcp-chrome-devtools", 1.0),
    "devtools": ("mcp-chrome-devtools", 1.2),
    "dom": ("mcp-chrome-devtools", 0.5),
    "elements": ("mcp-chrome-devtools", 0.5),
    "inspect": ("mcp-chrome-devtools", 1.0),
    "network": ("mcp-chrome-devtools", 0.8),
    "performance": ("mcp-chrome-devtools", 0.5),
    "screenshot": ("mcp-chrome-devtools", 2.0),

    # ─────────────────────────────────────────────────────────────────
    # WORKFLOWS-DOCUMENTATION: Documentation and diagrams
    # ─────────────────────────────────────────────────────────────────
    "ascii": ("sk-doc", 0.4),
    "diagram": ("sk-doc", 0.4),
    "document": ("sk-doc", 0.5),
    "documentation": ("sk-doc", 0.6),
    "flowchart": ("sk-doc", 0.7),
    "markdown": ("sk-doc", 0.5),
    "readme": ("sk-doc", 0.5),
    "template": ("sk-doc", 0.4),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE: Surface-aware code router
    # (frontend plus system-code surfaces)
    # ─────────────────────────────────────────────────────────────────
    "a11y": ("sk-code", 0.6),
    "accessibility": ("sk-code", 0.6),
    "animation": ("sk-code", 0.8),
    "aria": ("sk-code", 0.6),
    "bug": ("sk-code", 0.5),
    "css": ("sk-code", 0.9),
    "debugging": ("sk-code", 0.7),
    "error": ("sk-code", 0.4),
    "frontend": ("sk-code", 0.5),
    "implement": ("sk-code", 0.6),
    "layout": ("sk-code", 0.6),
    "networking": ("sk-code", 0.5),
    "refactor": ("sk-code", 0.5),
    "responsive": ("sk-code", 0.6),
    "tracing": ("sk-code", 0.5),
    "verification": ("sk-code", 0.5),
    "wcag": ("sk-code", 0.5),
    # Frontend route keywords:
    "expo": ("sk-code", 1.4),
    "component": ("sk-code", 0.5),
    "feature": ("sk-code", 0.4),
    "test": ("sk-code", 0.3),

    # ─────────────────────────────────────────────────────────────────
    # SK-CODE / system-code route: system code standards
    # (JavaScript MCP, Python scripts, Shell scripts, JSONC configs)
    # ─────────────────────────────────────────────────────────────────
    "opencode": ("sk-code", 2.0),
    "mcp": ("sk-code", 1.5),
    "python": ("sk-code", 1.0),
    "shell": ("sk-code", 1.0),
    "bash": ("sk-code", 1.0),
    "jsonc": ("sk-code", 1.5),
    "shebang": ("sk-code", 1.2),
    "snake_case": ("sk-code", 1.0),
    "docstring": ("sk-code", 0.8),
    "jsdoc": ("sk-code", 0.8),
    "commonjs": ("sk-code", 1.0),
    "require": ("sk-code", 0.6),
    "strict": ("sk-code", 0.5),

    # ─────────────────────────────────────────────────────────────────────────────────
    # CLI-CLAUDE-CODE: Cross-AI orchestration via Anthropic Claude Code CLI
    # ─────────────────────────────────────────────────────────────────────────────────

    # ─────────────────────────────────────────────────────────────────────────────────
    # ─────────────────────────────────────────────────────────────────────────────────

    # ─────────────────────────────────────────────────────────────────
    # MCP-CODE-MODE: External tool integration
    # ─────────────────────────────────────────────────────────────────
    "cms": ("mcp-code-mode", 0.5),
    "component": ("mcp-code-mode", 0.4),
    "external": ("mcp-code-mode", 0.4),
    "notion": ("mcp-code-mode", 2.5),
    "page": ("mcp-code-mode", 0.4),
    "pages": ("mcp-code-mode", 0.4),
    "site": ("mcp-code-mode", 0.6),
    "sites": ("mcp-code-mode", 0.6),
    "toolchain": ("mcp-code-mode", 0.6),
    "typescript": ("sk-code", 0.8),
    "utcp": ("mcp-code-mode", 0.8),

    # ─────────────────────────────────────────────────────────────────
    # SK-PROMPT: Prompt engineering and enhancement
    # ─────────────────────────────────────────────────────────────────
    "prompt": ("sk-prompt", 1.5),
    "prompts": ("sk-prompt", 1.2),
    "enhance": ("sk-prompt", 1.2),
    "rcaf": ("sk-prompt", 2.0),
    "costar": ("sk-prompt", 2.0),
    "crispe": ("sk-prompt", 2.0),
    "craft": ("sk-prompt", 1.5),
    "depth": ("sk-prompt", 1.5),
    "ricce": ("sk-prompt", 1.5),
    "scoring": ("sk-prompt", 0.8),

    "semantic": ("system-code-graph", 0.8),
    "discover": ("system-code-graph", 0.5),
    "implementation": ("sk-code", 0.5),
}

# Ambiguous keywords that should boost MULTIPLE skills
# Format: keyword -> list of (skill_name, boost_amount)
MULTI_SKILL_BOOSTERS = {
    "api": [("mcp-code-mode", 0.2), ("sk-code", 0.5)],
    "audit": [("sk-code", 0.6), ("system-spec-kit", 0.3), ("mcp-chrome-devtools", 0.3)],
    "chain": [("mcp-code-mode", 0.3)],
    "changes": [("sk-git", 0.4), ("system-spec-kit", 0.2)],
    "discover": [("system-code-graph", 0.5)],
    "css": [("sk-code", 0.6), ("mcp-chrome-devtools", 0.3)],
    "code": [("sk-code", 0.3)],
    "context": [("system-spec-kit", 0.4)],
    "deployment": [("sk-code", 0.4), ("sk-git", 0.3)],
    "export": [("mcp-chrome-devtools", 0.2)],
    "handler": [("sk-code", 0.3), ("mcp-code-mode", 0.2)],
    "layout": [("sk-code", 0.5), ("mcp-chrome-devtools", 0.2)],
    "mobile": [("sk-code", 0.3), ("mcp-chrome-devtools", 0.2)],
    "mcp": [("mcp-code-mode", 0.3), ("sk-code", 0.4)],
    "plan": [("system-spec-kit", 0.3), ("sk-code", 0.2)],
    "save": [("system-spec-kit", 0.4), ("sk-git", 0.2)],
    "script": [("sk-code", 0.4)],
    "server": [("sk-code", 0.3), ("mcp-code-mode", 0.2)],
    "session": [("system-spec-kit", 0.5)],
    "standards": [("sk-code", 0.6)],
    "style": [("sk-code", 0.5)],
    "task": [("system-spec-kit", 0.3)],
    "test": [("sk-code", 0.3), ("mcp-chrome-devtools", 0.2)],
    "update": [("mcp-code-mode", 0.3), ("sk-git", 0.2), ("sk-code", 0.2)],
    "review": [("sk-code", 0.8)],
    "delegate": [("cli-claude-code", 0.5)],
    "opinion": [("cli-claude-code", 0.3), ("sk-code", 0.2)],
    "validate": [("cli-claude-code", 0.2), ("sk-code", 0.3)],
    "improve": [("sk-prompt", 0.6), ("sk-code", 0.2)],
    "enhance": [("sk-prompt", 0.8)],
    "refine": [("sk-prompt", 0.6), ("sk-code", 0.2)],
    "framework": [("sk-prompt", 0.5)],
}

# Phrase-level intent boosters for high-signal multi-token requests
# Format: phrase -> list of (skill_name, boost_amount)
# NOTE: INTENT_BOOSTERS only matches single-word tokens after
# `all_tokens = re.findall(r'\b\w+\b', prompt_lower)` tokenizes the raw prompt.
# PHRASE_INTENT_BOOSTERS matches multi-word phrases against the raw prompt text
# before tokenization while rejecting embedded alphanumeric substrings.
# NEVER add keys containing spaces or hyphens to INTENT_BOOSTERS - the tokenizer
# splits them, making those keys unreachable at runtime.
# When in doubt, if the key has any whitespace OR hyphen, use
# PHRASE_INTENT_BOOSTERS.
PHRASE_INTENT_BOOSTERS = {
    "create documentation": [("sk-doc", 1.0)],
    "write documentation": [("sk-doc", 1.5)],
    "write docs": [("sk-doc", 1.2)],
    "generate documentation": [("sk-doc", 1.2)],
    "create new agent": [("create:agent", 1.6), ("sk-doc", 0.45)],
    "create agent": [("create:agent", 1.6), ("sk-doc", 0.45)],
    "create a test playbook": [("create:testing-playbook", 1.8), ("command-create-testing-playbook", 1.2), ("sk-doc", 0.2)],
    "create a testing playbook": [("create:testing-playbook", 1.8), ("command-create-testing-playbook", 1.2), ("sk-doc", 0.2)],
    "create test playbook": [("create:testing-playbook", 1.8), ("command-create-testing-playbook", 1.2), ("sk-doc", 0.2)],
    "create testing playbook": [("create:testing-playbook", 1.8), ("command-create-testing-playbook", 1.2), ("sk-doc", 0.2)],
    "save context": [("system-spec-kit", 1.6), ("memory:save", 1.0), ("command-memory-save", 0.8)],
    "save memory": [("system-spec-kit", 1.6), ("memory:save", 1.0), ("command-memory-save", 0.8)],
    "save this context": [("system-spec-kit", 1.6), ("memory:save", 1.0), ("command-memory-save", 0.8)],
    "save conversation": [("system-spec-kit", 1.6), ("memory:save", 1.0), ("command-memory-save", 0.8)],
    "save conversation context": [("system-spec-kit", 1.6), ("memory:save", 1.0), ("command-memory-save", 0.8)],
    "save this conversation context": [("system-spec-kit", 1.6), ("memory:save", 1.0), ("command-memory-save", 0.8)],
    "code review": [("sk-code", 2.4)],
    "pr review": [("sk-code", 2.3), ("sk-git", 0.4)],
    "security review": [("sk-code", 2.2)],
    "review this pr": [("sk-code", 2.4)],
    "review this diff": [("sk-code", 2.2)],
    "quality gate": [("sk-code", 2.0)],
    "quality gate validation": [("sk-code", 1.8)],
    "request changes": [("sk-code", 2.0)],
    "race conditions": [("sk-code", 1.5)],
    "auth bugs": [("sk-code", 1.5)],
    "code audit": [("sk-code", 2.2)],
    "audit this code": [("sk-code", 2.3)],
    "check this code": [("sk-code", 2.0)],
    "check for issues": [("sk-code", 2.0)],
    "solid violations": [("sk-code", 2.2)],
    "solid principles": [("sk-code", 2.0)],
    "merge readiness": [("sk-code", 2.2), ("sk-git", 0.4)],
    "ready to merge": [("sk-code", 2.2), ("sk-git", 0.4)],
    "implement feature": [("sk-code", 0.9)],
    "responsive css": [("sk-code", 1.2)],
    "responsive css layout": [("sk-code", 1.4)],
    "responsive css layout fix": [("sk-code", 2.2)],
    "layout fix": [("sk-code", 1.0)],
    "browser verification checklist": [("sk-code", 1.6)],
    "css animation": [("sk-code", 0.8)],
    "api network": [("sk-code", 0.7), ("mcp-chrome-devtools", 0.4)],
    "frontend deployment guidance": [("sk-code", 1.8)],
    "external tool integration via code mode": [("mcp-code-mode", 2.0)],
    "template level validation": [("system-spec-kit", 0.8)],
    "spec folder workflow": [("system-spec-kit", 1.8)],
    "resume prior session context": [("system-spec-kit", 1.8)],
    "validate spec packet": [("system-spec-kit", 1.6)],
    "constitutional memory": [("system-spec-kit", 1.7)],
    # --- Autoresearch deep research loop ---
    "deep research": [("deep-research", 2.5)],
    "research loop": [("deep-research", 2.5)],
    "autoresearch": [("deep-research", 3.0)],
    "/autoresearch": [("deep-research", 3.0)],
    "auto research": [("deep-research", 2.8)],
    "autonomous research": [("deep-research", 2.5)],
    "iterative research": [("deep-research", 2.5)],
    "multi-round research": [("deep-research", 2.0)],
    "overnight research": [("deep-research", 2.0)],
    # --- Agent improvement loop ---
    "agent improvement": [("deep-improvement", 2.8)],
    "recursive agent": [("deep-improvement", 2.8)],
    "improvement loop": [("deep-improvement", 2.8)],
    "agent improvement loop": [("deep-improvement", 3.2)],
    "proposal-only improvement": [("deep-improvement", 2.6)],
    "proposal only improvement": [("deep-improvement", 2.6)],
    "proposal only": [("deep-improvement", 1.4)],
    "evaluator-first": [("deep-improvement", 2.4)],
    "bounded mutator": [("deep-improvement", 2.2)],
    "candidate scoring": [("deep-improvement", 2.3)],
    "promotion gate": [("deep-improvement", 2.0)],
    "handover target": [("deep-improvement", 2.0)],
    "deep-agent-improvement": [("deep-improvement", 3.2)],
    "/deep-agent-improvement": [("deep-improvement", 3.2)],
    "sk-agent-improvement-loop": [("deep-improvement", 3.0)],
    "/sk-agent-improvement-loop": [("deep-improvement", 3.0)],
    "5-dimension": [("deep-improvement", 1.8)],
    "5-dimension agent scoring": [("deep-improvement", 2.8)],
    "5-dimension evaluation": [("deep-improvement", 2.8)],
    "5d agent scoring": [("deep-improvement", 2.8)],
    "5d scoring": [("deep-improvement", 1.8)],
    "integration scanning": [("deep-improvement", 2.6)],
    "integration scan": [("deep-improvement", 2.2)],
    "dynamic profiling": [("deep-improvement", 2.6)],
    "dynamic profile": [("deep-improvement", 1.6)],
    "evaluate agent quality": [("deep-improvement", 2.8)],
    "score agent dimensions": [("deep-improvement", 2.8)],
    "agent integration surface": [("deep-improvement", 2.6)],
    "/deep:start-agent-improvement-loop": [("deep-improvement", 3.2)],
    "/prompt": [("sk-prompt", 3.2)],
    "improve agent": [("deep-improvement", 2.8)],
    "score agent": [("deep-improvement", 2.6)],
    "evaluate agent": [("deep-improvement", 2.6)],
    "agent evaluation": [("deep-improvement", 2.6)],
    # --- Code discovery and structural search ---
    "semantic search": [("system-code-graph", 1.5)],
    "structural search": [("system-code-graph", 2.2)],
    "code graph search": [("system-code-graph", 2.2)],
    "code search": [("system-code-graph", 2.0)],
    "webflow cms": [("mcp-code-mode", 2.2)],
    "cms collection": [("mcp-code-mode", 2.0)],
    "vector search": [("system-code-graph", 1.2)],
    "concept search": [("system-code-graph", 1.2)],
    "find implementation": [("system-code-graph", 1.5)],
    "find usage": [("system-code-graph", 1.2)],
    "find code that": [("system-code-graph", 1.8)],
    "similar code": [("system-code-graph", 1.4)],
    "where is the logic": [("system-code-graph", 1.5)],
    "search codebase": [("system-code-graph", 2.2)],
    "code that handles": [("system-code-graph", 1.5)],
    "find implementations": [("system-code-graph", 2.0)],
    "find similar": [("system-code-graph", 1.4)],
    "semantic code search": [("system-code-graph", 1.5)],
    "how is.*implemented": [("system-code-graph", 1.2)],
    "how does.*work": [("system-code-graph", 1.0)],
    "convergence detection": [("deep-research", 2.0)],
    # --- Deep review mode (iterative code audit) ---
    "deep review": [("deep-review", 2.5)],
    "review loop": [("deep-review", 2.5)],
    "iterative review": [("deep-review", 2.5)],
    "iterative review loop": [("deep-review", 5.0)],
    "spec folder audit": [("deep-review", 4.0)],
    "iterative audit": [("deep-review", 3.5)],
    "multi-pass review": [("deep-review", 3.5)],
    "review iteration": [("deep-review", 3.0)],
    "review packet": [("deep-review", 3.0)],
    "convergence detection review": [("deep-review", 3.5)],
    "code audit loop": [("deep-review", 2.5)],
    "review mode": [("deep-review", 2.0)],
    "release readiness review": [("deep-review", 2.0)],
    "spec folder review": [("deep-review", 2.0), ("sk-code", 0.8)],
    "review convergence": [("deep-review", 2.5)],
    "auto review release readiness": [("deep-review", 7.0), ("deep-loop-workflows", 7.0)],
    "auto review security audit": [("deep-review", 2.5)],
    "auto review audit": [("deep-review", 2.2)],
    "auto review loop": [("deep-review", 2.5)],
    ":start-review-loop": [("deep-loop-workflows", 3.0)],
    ":start-review-loop:auto": [("deep-loop-workflows", 3.0)],
    ":start-review-loop:confirm": [("deep-loop-workflows", 3.0)],
    ":review:auto": [("deep-loop-workflows", 3.0)],
    ":review:confirm": [("deep-loop-workflows", 3.0)],
    "mcp server code": [("sk-code", 1.8)],
    "system code style guidance": [("sk-code", 1.7)],
    "python shell json standards": [("sk-code", 1.9)],
    "full stack development workflow": [("sk-code", 2.1)],
    "implementation testing verification flow": [("sk-code", 1.8)],
    "detect project stack automatically": [("sk-code", 1.6)],
    "opencode review": [("sk-code", 0.4)],
    # --- Claude Code CLI cross-AI orchestration ---
    "use claude code": [("cli-claude-code", 2.5)],
    "claude code cli": [("cli-claude-code", 2.5)],
    "delegate to claude code": [("cli-claude-code", 2.5)],
    "extended thinking": [("cli-claude-code", 2.0)],
    "deep reasoning": [("cli-claude-code", 1.5)],
    "claude code review": [("cli-claude-code", 2.0), ("sk-code", 0.4)],
    "cross-ai claude": [("cli-claude-code", 2.0)],
    "delegate to opencode": [("cli-opencode", 4.0)],
    "opencode cli": [("cli-opencode", 3.2)],
    "use opencode cli": [("cli-opencode", 3.4)],
    "use cli-opencode": [("cli-opencode", 3.4)],
    "cli-claude-code": [("cli-claude-code", 2.8)],
    "/cli-claude-code": [("cli-claude-code", 2.8)],
    ".opencode/skills/cli-claude-code": [("cli-claude-code", 3.0)],
    # --- Copilot CLI cross-AI orchestration ---
    # --- Prompt Improver: prompt engineering and enhancement ---
    "improve my prompt": [("sk-prompt", 2.5)],
    "improve this prompt": [("sk-prompt", 2.5)],
    "enhance this prompt": [("sk-prompt", 2.5)],
    "enhance my prompt": [("sk-prompt", 2.5)],
    "prompt engineering": [("sk-prompt", 2.5)],
    "prompt improvement": [("sk-prompt", 2.5)],
    "create a prompt": [("sk-prompt", 2.0)],
    "optimize this prompt": [("sk-prompt", 2.2)],
    "optimize prompt": [("sk-prompt", 2.2)],
    "refine this prompt": [("sk-prompt", 2.2)],
    "clear scoring": [("sk-prompt", 2.0)],
    "depth processing": [("sk-prompt", 2.0)],
    "sk-prompt": [("sk-prompt", 2.8)],
    "/sk-prompt": [("sk-prompt", 2.8)],
    ".opencode/skills/sk-prompt": [("sk-prompt", 3.0)],

    # ─────────────────────────────────────────────────────────────────
    # FOLLOW-UP: Hyphenated-token migrations from INTENT_BOOSTERS
    # (tokenizer splits on hyphen via \b\w+\b — same bug as whitespace keys)
    # ─────────────────────────────────────────────────────────────────
    "proposal-only": [("deep-improvement", 1.4)],
    "claude-code": [("cli-claude-code", 2.0)],
    "claude-cli": [("cli-claude-code", 1.5)],
    "extended-thinking": [("cli-claude-code", 1.0)],
    "tidd-ec": [("sk-prompt", 2.0)],
}

DEFAULT_CONFIDENCE_THRESHOLD = NATIVE_DEFAULT_CONFIDENCE_THRESHOLD
DEFAULT_UNCERTAINTY_THRESHOLD = NATIVE_DEFAULT_UNCERTAINTY_THRESHOLD

COMMAND_BRIDGES = {
    # ─────────────────────────────────────────────────────────────────
    # Per-subcommand bridges for /spec_kit family.
    # Previously all /speckit:* subcommands collapsed to `command-spec-kit`
    # at `kind_priority=2`, so `/deep:start-research-loop` lost its owning-skill
    # signal (should route to `deep-research`, not `command-spec-kit`).
    # Dict insertion order IS iteration order in Python 3.7+, so the specific
    # subcommand markers MUST appear BEFORE the deprecated generic bridge —
    # `detect_explicit_command_intent()` returns on the first marker match.
    # Execution-mode suffixes (:auto, :confirm, :with-phases, :with-research)
    # are substring-matched inside each bridge and do NOT need separate entries.
    # ─────────────────────────────────────────────────────────────────
    "command-spec-kit-plan": {
        "description": "Run the SpecKit 8-step planning workflow using /speckit:plan.",
        "slash_markers": ["/speckit:plan", "spec_kit:plan"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-complete": {
        "description": "Run the full SpecKit 14+ step lifecycle using /speckit:complete.",
        "slash_markers": ["/speckit:complete", "spec_kit:complete"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-implement": {
        "description": "Run the SpecKit 9-step implementation workflow using /speckit:implement.",
        "slash_markers": ["/speckit:implement", "spec_kit:implement"],
        "owning_skill": "system-spec-kit",
    },
    "command-spec-kit-deep-research": {
        "description": "Run the autonomous deep-research loop using /deep:start-research-loop.",
        "slash_markers": ["/deep:start-research-loop", "deep:start-research-loop"],
        "owning_skill": "deep-research",
    },
    "command-spec-kit-deep-review": {
        "description": "Run the autonomous deep-review loop using /deep:start-review-loop.",
        "slash_markers": ["/deep:start-review-loop", "deep:start-review-loop"],
        "owning_skill": "deep-review",
    },
    "command-spec-kit-resume": {
        "description": "Resume an existing spec folder using /speckit:resume.",
        "slash_markers": ["/speckit:resume", "spec_kit:resume"],
        "owning_skill": "system-spec-kit",
    },
    # Legacy bridge retained for 1-release compatibility; deprecated.
    # MUST come AFTER the per-subcommand bridges so specific markers win.
    "command-spec-kit": {
        "description": "[DEPRECATED: use per-subcommand bridges] /spec_kit slash-command family; routes generic /spec_kit or spec_kit: prompts without a specific subcommand.",
        "slash_markers": ["/spec_kit", "spec_kit:"],
        "deprecated": True,
        "owning_skill": "system-spec-kit",
    },
    "command-memory-save": {
        "description": "Save conversation context to memory using /memory:save.",
        "slash_markers": ["/memory:save", "memory:save"],
        "owning_skill": "system-spec-kit",
    },
    "command-deep-agent-improvement": {
        "description": "Evaluate and improve any agent across 5 dimensions using /deep:start-agent-improvement-loop.",
        "slash_markers": ["/deep:start-agent-improvement-loop", "deep:start-agent-improvement-loop"],
    },
    "command-prompt-improver": {
        "description": "Create or improve AI prompts using /prompt.",
        # Only the literal slash invocation is an explicit-command signal. The
        # bare word "prompt" appears in ordinary requests ("improve this prompt")
        # and must NOT trigger the command bridge over the owning skill sk-prompt.
        "slash_markers": ["/prompt"],
    },
    "command-create-agent": {
        "description": "Create a new OpenCode agent using /create:agent.",
        "slash_markers": ["/create:agent", "create:agent"],
    },
    "command-create-changelog": {
        "description": "Create a changelog entry using /create:changelog.",
        "slash_markers": ["/create:changelog", "create:changelog"],
    },
    "command-create-sk-skill": {
        "description": "Create or update an OpenCode skill using /create:sk-skill.",
        "slash_markers": ["/create:sk-skill", "create:sk-skill"],
    },
    "command-create-feature-catalog": {
        "description": "Create or update a feature catalog using /create:feature-catalog.",
        "slash_markers": ["/create:feature-catalog", "create:feature-catalog"],
    },
    "command-create-testing-playbook": {
        "description": "Create or update a testing playbook using /create:testing-playbook.",
        "slash_markers": ["/create:testing-playbook", "create:testing-playbook"],
        "owning_skill": "create:testing-playbook",
    },
    "command-create-folder-readme": {
        "description": "Create folder README documentation using /create:folder_readme.",
        "slash_markers": ["/create:folder_readme", "create:folder_readme"],
    },
}

COMMAND_BRIDGE_OWNER_NORMALIZATION = {
    # An explicit /X:y slash command routes to the skill that OWNS the workflow,
    # not to a command-bridge alias. The memory-save workflow is owned by
    # system-spec-kit (its toolchain performs the save), so /memory:save
    # normalizes there rather than to the inline `memory:save` bridge record.
    "command-memory-save": "system-spec-kit",
    "command-create-agent": "create:agent",
    "command-create-testing-playbook": "create:testing-playbook",
    "command-spec-kit-resume": "system-spec-kit",
    "command-spec-kit-deep-research": "deep-research",
    "command-spec-kit-deep-review": "deep-review",
}

COMMAND_BRIDGE_EXPLICIT_ALIASES = {
    # The canonical Python regression contract treats /speckit:plan as the
    # command family bridge. Deep loop/resume subcommands keep their narrower
    # owners because they enforce distinct skill-owned state machines.
    "command-spec-kit-plan": "command-spec-kit",
}

COMMAND_TARGET_IMPLEMENTATION_MARKERS = (
    "add",
    "bridge",
    "carve-out",
    "carve out",
    "command bridge",
    "command target",
    "command-only",
    "command-surface",
    "command surface",
    "guard",
    "implement",
    "implementation",
    "mapping",
    "modify",
    "normalize",
    "normalization",
    "refactor",
    "router",
    "scorer",
    "test",
    "unit test",
    "update",
)

COMMAND_WORKFLOW_INVOCATION_MARKERS = (
    "execute",
    "kick off",
    "launch",
    "run",
    "start",
    "use",
)

INTENT_NORMALIZATION_RULES = {
    "review": {
        "phrases": ["code review", "pr review", "security review", "quality gate", "request changes"],
        "tokens": {"review", "audit", "regression", "findings", "readiness", "vulnerability"},
        "boosts": [("sk-code", 0.8)],
    },
    "implementation": {
        "phrases": ["implement feature", "fix bug", "refactor module", "build feature"],
        "tokens": {"implement", "fix", "refactor", "build", "bug", "feature"},
        "boosts": [("sk-code", 0.35)],
    },
    "documentation": {
        "phrases": ["create documentation", "write readme", "install guide", "markdown docs"],
        "tokens": {"documentation", "document", "readme", "markdown", "guide", "flowchart", "diagram"},
        "boosts": [("sk-doc", 0.45)],
    },
    "memory": {
        "phrases": ["save context", "save memory", "remember this", "restore checkpoint"],
        "tokens": {"memory", "context", "checkpoint", "remember", "restore", "session", "preserve"},
        "boosts": [("memory:save", 0.6)],
    },
    "tooling": {
        "phrases": ["use mcp", "code mode", "chrome devtools", "use external tool"],
        "tokens": {"mcp", "devtools", "chrome", "notion", "toolchain"},
        "boosts": [("mcp-code-mode", 0.3), ("mcp-chrome-devtools", 0.3)],
    },
}


# ───────────────────────────────────────────────────────────────
# 2. SKILL LOADING
# ───────────────────────────────────────────────────────────────

def parse_frontmatter(file_path: str) -> Optional[Dict[str, str]]:
    """Extract frontmatter using fast parser (frontmatter-only reads)."""
    try:
        return parse_frontmatter_fast(file_path)
    except (ValueError, AttributeError, TypeError, KeyError) as exc:  # pragma: no cover - safety fallback
        print(
            f"Warning: Failed to parse frontmatter from {file_path} "
            f"({type(exc).__name__}: {exc})",
            file=sys.stderr,
        )
        return None


def _normalize_terms(text: str) -> Set[str]:
    """Split text into normalized search terms while filtering stop words."""
    terms = re.findall(r'\b\w+\b', text.lower())
    return {term for term in terms if len(term) > 2 and term not in STOP_WORDS}


def _build_variants(skill_name: str) -> Set[str]:
    """Build slash, dollar, and spacing variants for a skill identifier."""
    lowered = skill_name.lower()
    return {
        lowered,
        f"${lowered}",
        f"/{lowered}",
        lowered.replace('-', ' '),
        lowered.replace('-', '_'),
    }


@lru_cache(maxsize=None)
def _phrase_boundary_pattern(phrase: str) -> re.Pattern:
    """Compile the boundary matcher once per metadata phrase."""
    return re.compile(rf"(?<![a-z0-9_-]){re.escape(phrase)}(?![a-z0-9_-])")


def _matches_phrase_boundary(text: str, phrase: str) -> bool:
    """Return True when a phrase is not embedded inside a larger identifier.

    The flank class includes '-' and '_' (not just alphanumerics) so a short
    skill name like 'sk-code' does not match inside a longer hyphenated or
    underscored identifier that merely contains it as a substring — a
    substring hit is not an explicit mention of the shorter skill.
    """
    if not phrase:
        return False
    return _phrase_boundary_pattern(phrase).search(text) is not None


def _build_inline_record(
    name: str,
    description: str,
    kind: str,
    source: str,
    path: Optional[str] = None,
    extra_variants: Optional[Set[str]] = None,
) -> Dict[str, Any]:
    """Create an in-memory skill or command record with normalized metadata."""
    variants = _build_variants(name)
    if extra_variants:
        variants.update(extra_variants)

    return {
        "name": name,
        "description": description,
        "kind": kind,
        "source": source,
        "path": path,
        "name_terms": _normalize_terms(name.replace('-', ' ')),
        "corpus_terms": _normalize_terms(description),
        "variants": variants,
    }


def get_skills(force_refresh: bool = False) -> Dict[str, Dict[str, Any]]:
    """Return skill + command records with cached discovery metadata."""
    skills = get_cached_skill_records(SKILLS_DIR, STOP_WORDS, force_refresh=force_refresh)

    skills["memory:save"] = _build_inline_record(
        name="memory:save",
        description="Memory save command bridge for /memory:save context preservation.",
        kind="skill",
        source="bridge",
        path=None,
        extra_variants={"/memory:save", "save context", "save memory"},
    )
    skills["create:agent"] = _build_inline_record(
        name="create:agent",
        description="Create command bridge for /create:agent OpenCode agent scaffolding.",
        kind="skill",
        source="bridge",
        path=None,
        extra_variants={"/create:agent", "create new agent", "create agent"},
    )
    skills["create:testing-playbook"] = _build_inline_record(
        name="create:testing-playbook",
        description="Create command bridge for /create:testing-playbook manual testing playbook scaffolding.",
        kind="skill",
        source="bridge",
        path=None,
        extra_variants={"/create:testing-playbook", "create testing playbook", "create test playbook"},
    )
    skills["deep-improvement"] = _build_inline_record(
        name="deep-improvement",
        description=(
            "Evaluator-first deep improvement workflow for 5d scoring, "
            "5-dimension agent scoring, integration scan, dynamic profile, "
            "agent improvement, candidate scoring, and proposal-only improvement."
        ),
        kind="skill",
        source="bridge",
        path=None,
        extra_variants={
            "/deep:start-agent-improvement-loop",
            "deep-agent-improvement",
            "sk-deep-agent-improvement",
            "sk-agent-improvement-loop",
        },
    )
    for command_name, command_config in COMMAND_BRIDGES.items():
        markers = set(command_config.get("slash_markers", []))
        skills[command_name] = _build_inline_record(
            name=command_name,
            description=command_config["description"],
            kind="command",
            source="bridge",
            path=None,
            extra_variants=markers,
        )

    return skills


def expand_query(prompt_tokens: List[str]) -> List[str]:
    """Expand user tokens with synonyms for better matching."""
    expanded = set(prompt_tokens)
    for token in prompt_tokens:
        if token in SYNONYM_MAP:
            expanded.update(SYNONYM_MAP[token])
    return list(expanded)


def detect_explicit_command_intent(prompt_lower: str) -> Optional[str]:
    """Return targeted command bridge when explicit slash markers are present."""
    for command_name, command_config in COMMAND_BRIDGES.items():
        for marker in command_config.get("slash_markers", []):
            if marker and marker in prompt_lower:
                return COMMAND_BRIDGE_EXPLICIT_ALIASES.get(command_name, command_name)
    return None


def _command_bridge_references(command_name: str) -> Set[str]:
    """Return command bridge strings that can appear as quoted implementation refs."""
    command_config = COMMAND_BRIDGES.get(command_name, {})
    references = {command_name, command_name.replace("-", " ")}
    for marker in command_config.get("slash_markers", []):
        if isinstance(marker, str) and marker:
            references.add(marker.lower())
    return references


def _has_quoted_command_reference(prompt_lower: str, references: Set[str]) -> bool:
    """Detect command strings quoted as text rather than invoked as workflows."""
    if not references:
        return False

    quoted_segments = re.findall(r"`[^`]+`|\"[^\"]+\"|'[^']+'", prompt_lower)
    return any(any(reference in segment for reference in references) for segment in quoted_segments)


def _quoted_command_reference_is_workflow_invocation(
    prompt_lower: str,
    references: Set[str],
) -> bool:
    """Return True when a quoted command is still being invoked as a workflow."""
    stripped = prompt_lower.strip()
    quote_prefixed_command = any(
        any(stripped.startswith(f"{quote}{reference}") for quote in ("`", '"', "'"))
        for reference in references
    )
    if quote_prefixed_command:
        return True

    return any(marker in prompt_lower for marker in COMMAND_WORKFLOW_INVOCATION_MARKERS)


def _should_guard_command_bridge_normalization(prompt_lower: str, command_name: str) -> bool:
    """Return True when a command bridge is itself the implementation target.

    Command-surface normalization is intended for workflow invocation prompts
    (for example "run /memory:save"), not prompts that quote a command string
    or ask to edit/test the command bridge implementation itself.
    """
    references = _command_bridge_references(command_name)
    if _has_quoted_command_reference(prompt_lower, references) and not (
        _quoted_command_reference_is_workflow_invocation(prompt_lower, references)
    ):
        return True

    command_name_referenced = command_name in prompt_lower or command_name.replace("-", " ") in prompt_lower
    if not command_name_referenced:
        return False

    return any(marker in prompt_lower for marker in COMMAND_TARGET_IMPLEMENTATION_MARKERS)


def normalize_command_bridge_recommendations(
    ranked: List[Dict[str, Any]],
    prompt_lower: str,
) -> List[Dict[str, Any]]:
    """Normalize top command bridge recommendations back to owning skills."""
    if not ranked:
        return ranked

    top = ranked[0]
    command_name = str(top.get("skill", ""))
    owning_skill = COMMAND_BRIDGE_OWNER_NORMALIZATION.get(command_name)
    if not owning_skill:
        return ranked
    if _should_guard_command_bridge_normalization(prompt_lower, command_name):
        return ranked

    owner_index = next(
        (index for index, item in enumerate(ranked) if item.get("skill") == owning_skill),
        None,
    )
    owner = ranked[owner_index] if owner_index is not None else None
    normalized = dict(owner or top)

    normalized["skill"] = owning_skill
    normalized["kind"] = "skill"
    normalized["confidence"] = max(
        float(top.get("confidence", 0.0)),
        float(normalized.get("confidence", 0.0)),
    )
    normalized["uncertainty"] = min(
        float(top.get("uncertainty", 1.0)),
        float(normalized.get("uncertainty", 1.0)),
    )
    normalized["passes_threshold"] = bool(top.get("passes_threshold")) or bool(
        normalized.get("passes_threshold")
    )
    reason = str(normalized.get("reason", "")).strip()
    note = f"[command-normalized: {command_name}->{owning_skill}]"
    normalized["reason"] = f"{reason} {note}".strip()
    normalized["_kind_priority"] = max(
        int(top.get("_kind_priority", 0)),
        int(normalized.get("_kind_priority", 0)),
    )
    normalized["_explicit_skill_match"] = bool(top.get("_explicit_skill_match")) or bool(
        normalized.get("_explicit_skill_match")
    )

    removed = {0}
    if owner_index is not None:
        removed.add(owner_index)
    return [normalized] + [item for index, item in enumerate(ranked) if index not in removed]


def apply_intent_normalization(
    prompt_lower: str,
    tokens: List[str],
    skill_boosts: Dict[str, float],
    boost_reasons: Dict[str, List[str]],
) -> List[str]:
    """Apply lightweight canonical intent boosts before main scoring."""
    detected: List[str] = []
    token_set = set(tokens)

    for intent_name, config in INTENT_NORMALIZATION_RULES.items():
        matched = any(
            _matches_phrase_boundary(prompt_lower, phrase)
            for phrase in config["phrases"]
        ) or bool(token_set.intersection(config["tokens"]))
        if not matched:
            continue

        detected.append(intent_name)
        for skill_name, boost in config["boosts"]:
            skill_boosts[skill_name] = skill_boosts.get(skill_name, 0.0) + boost
            boost_reasons.setdefault(skill_name, []).append(f"!intent:{intent_name}")

    return detected


def _is_memory_preservation_session_intent(prompt_lower: str) -> bool:
    """Detect context-preservation phrasing that avoids literal save/context words."""
    return bool(
        re.search(
            r"\b(preserve|remember|capture|keep|store)\b.*\b(next|future|later)\s+session\b",
            prompt_lower,
        )
        or re.search(
            r"\b(next|future|later)\s+session\b.*\b(lose|lost|preserve|remember|capture|keep|store)\b",
            prompt_lower,
        )
    )


def _is_plain_file_save_prompt(prompt_lower: str) -> bool:
    """Separate editor/file-save requests from memory/context preservation saves."""
    file_save = bool(
        re.search(r"\bsave\b.{0,48}\b(file|files|document|documents|buffer|tab|workspace)\b", prompt_lower)
        or re.search(r"\b(file|files|document|documents|buffer|tab|workspace)\b.{0,48}\bsave\b", prompt_lower)
    )
    if not file_save:
        return False

    without_file_terms = re.sub(r"\b(file|files|document|documents|buffer|tab|workspace)\b", " ", prompt_lower)
    return not bool(
        re.search(
            r"\b(memory|context|conversation|session|handover|checkpoint|resume|preserve|remember|capture|store)\b|/memory:save|memory:save",
            without_file_terms,
        )
    )


def canonical_skill_id(skill_id: str) -> str:
    return SKILL_ALIAS_TO_CANONICAL.get(skill_id, skill_id)


def skill_matches_alias(actual: str, expected: str) -> bool:
    return canonical_skill_id(actual) == canonical_skill_id(expected)


def recommendation_matches_alias(recommendation: Dict[str, Any], expected: str) -> bool:
    """Return True when a recommendation matches a legacy or merged deep-loop alias."""
    actual = str(recommendation.get("skill", ""))
    if skill_matches_alias(actual, expected):
        return True
    if actual != MERGED_DEEP_SKILL_ID:
        return False

    mode = recommendation.get("workflowMode") or recommendation.get("mode")
    expected_canonical = canonical_skill_id(expected)
    return DEEP_ROUTING_MODE_BY_KEY.get(expected_canonical) == mode


def _is_ambiguous_code_problem(prompt_lower: str) -> bool:
    return bool(
        re.search(
            r"\b(figure out|find|diagnose|debug)\b.{0,40}\b(wrong|broken|failing|bug|issue)\b.{0,40}\bcode\b",
            prompt_lower,
        )
        or re.search(r"\b(wrong|broken|failing)\b.{0,30}\bcode\b", prompt_lower)
    )


def _apply_memory_save_file_operation_cap(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Keep plain file-save prompts from passing as memory-save command intent."""
    if not _is_plain_file_save_prompt(prompt_lower):
        return
    for recommendation in recommendations:
        if recommendation.get("skill") in {"memory:save", "command-memory-save"}:
            recommendation["confidence"] = min(float(recommendation.get("confidence", 0.0)), 0.49)


# Deep-skill routing balances lexical, structural, and prior-art signals:
#   total_score = (lexical_score * 1.0) + (structural_score * 2.0) + (prior_art_score * 3.0)
# Fallback to Candidate 2 happens naturally when packet_context is empty: prior_art_score=0.
# LOW confidence (<0.65) returns a clarifying_question payload because ambiguous
# iteration prompts can map to loops with different convergence and findings semantics.
DEEP_ROUTING_CONFIDENCE_THRESHOLD = 0.65

# The five legacy deep-loop skills are folded into one public skill,
# deep-loop-workflows, discriminated by workflowMode. The Candidate-3 internal
# discriminator keys below stay spelled as the legacy skill ids because the
# regex pattern groups and prior-art matchers key off them and match live
# artifact/agent names still present across the live agent and artifact surfaces;
# DEEP_ROUTING_MODE_BY_KEY projects each onto the merged skill's workflowMode so
# the routing contract emits {skill: deep-loop-workflows, mode}. deep-context is
# intentionally NOT a Candidate-3 discriminator: it stays metadata-routed
# (resolved from its graph-metadata.json), so DEEP_ROUTING_SKILLS stays 3.
MERGED_DEEP_SKILL_ID = "deep-loop-workflows"
# BEGIN GENERATED DEEP ROUTING LEXICAL PROJECTION
DEEP_ROUTING_SKILLS = ("deep-review", "deep-research", "deep-ai-council")
DEEP_ROUTING_MODE_BY_KEY = {
    "deep-review": "review",
    "deep-research": "research",
    "deep-ai-council": "ai-council",
}
# END GENERATED DEEP ROUTING LEXICAL PROJECTION

DEEP_ROUTING_LEXICAL_PATTERNS = {
    "deep-review": (
        (r":review:(?:auto|confirm)\b", 2.0),
        (r"\bdeep[- ]review\b", 1.8),
        (r"\breview loop\b|\biterative review\b|\bmulti-pass review\b", 1.4),
        (r"\baudit\b|\breview\b", 0.7),
        (r"\bfindings?\b|\bconvergence\b|\bloop\b|\biterate\b", 0.35),
    ),
    "deep-research": (
        (r"\bautoresearch\b|/autoresearch\b", 2.0),
        (r"\bdeep[- ]research\b|\bresearch loop\b|\biterative research\b", 1.8),
        (r"\binvestigat(?:e|ion|ing)\b|\bresearch\b|\bdiscover(?:y|ing)?\b", 1.2),
        (r"\bnewinforatio\b|\bnegative knowledge\b|\bruled out\b", 1.2),
        (r"\bconvergence\b|\bloop\b|\biterate\b", 0.25),
    ),
    "deep-ai-council": (
        (r"\bdeep[- ]ai[- ]council\b|\bdeep[- ]council\b|\bsk[- ]ai[- ]council\b|\bai[- ]council\b", 2.0),
        (r"\bdeliberat(?:e|ion|ing)\b|\bmulti-seat\b|\bcouncil\b", 1.5),
        (r"\bstrateg(?:y|ies)\b|\boption(?:s)?\b|\bverdict\b|\bdecision\b", 0.7),
        (r"\bconver(?:ge|ges|gence)\b|\biterate\b", 0.2),
    ),
}

DEEP_ROUTING_STRUCTURAL_PATTERNS = {
    "deep-review": (
        (r"\bfindings? stabiliz(?:e|es|ed|ing)\b|\bfindingstability\b", 2.0),
        (r"\b(p0|p1|p2)\b|\bseverity tiers?\b|\badversarial\b|\bdefect(?:s)?\b", 1.4),
        (r"\bcode audit\b|\bquality audit\b|\brelease readiness\b|\bsecurity audit\b", 1.2),
        (r"\bcoverage-graph signals?\b", 0.4),
    ),
    "deep-research": (
        (r"\binvestigation\b|\binvestigate whether\b|\bresearch topic\b|\boriginal .* investigation topic\b", 1.8),
        (r"\bnewinforatio\b|\bnew information\b|\bdiscover new\b|\bdiscovering new\b", 1.6),
        (r"\bnegative knowledge\b|\bruled[- ]out directions?\b|\bdead ends?\b", 1.3),
        (r"\bdeep[- ]research packet\b.*\bdrift\b|\bdrift\b.*\binvestigation topic\b", 1.5),
    ),
    "deep-ai-council": (
        (r"\barchitecture decision\b|\bdesign decision\b|\bstrategy comparison\b", 2.0),
        (r"\bdeliberat(?:e|ion|ing)\b|\bmulti-seat\b|\bopinion synthesis\b", 1.8),
        (r"\bwhether\b.{0,80}\b(or|vs|versus)\b|\bcoverage-graph signals\b.{0,80}\badjudicator self-scoring\b", 1.5),
        (r"\bverdict stability\b|\badjudicator[- ]verdict\b|\brecommend the best\b", 1.4),
    ),
}


def _packet_context_has_prior_art(packet_context: Dict[str, Any]) -> bool:
    """Return True when routing context contains any usable prior-art signal."""
    return bool(packet_context)


def _flatten_context_values(value: Any) -> List[str]:
    """Flatten packet-context primitives into lowercase strings for prior-art matching."""
    if value is None:
        return []
    if isinstance(value, str):
        return [value.lower()]
    if isinstance(value, (int, float, bool)):
        return [str(value).lower()]
    if isinstance(value, dict):
        values: List[str] = []
        for key, item in value.items():
            values.append(str(key).lower())
            values.extend(_flatten_context_values(item))
        return values
    if isinstance(value, (list, tuple, set)):
        values = []
        for item in value:
            values.extend(_flatten_context_values(item))
        return values
    return [str(value).lower()]


def _score_prior_art(packet_context: Dict[str, Any]) -> Dict[str, float]:
    """Score existing packet artifacts and operator history for Candidate-3 routing."""
    scores = {skill: 0.0 for skill in DEEP_ROUTING_SKILLS}
    flattened = " ".join(_flatten_context_values(packet_context))
    if not flattened:
        return scores

    prior_patterns = {
        "deep-review": (
            r"deep-review|review-report|deep-review-findings-registry|p0|p1|p2",
        ),
        "deep-research": (
            r"deep-research|research\.md|deep-research-findings-registry|(^|[\s/])findings-registry|newinforatio|research_topic",
        ),
        "deep-ai-council": (
            r"deep-ai-council|deep-council|sk-ai-council|ai-council|council-report|session-report|verdict stability",
        ),
    }

    for skill, patterns in prior_patterns.items():
        for pattern in patterns:
            if re.search(pattern, flattened):
                scores[skill] += 1.0

    recent = packet_context.get("recent_recommendations") or packet_context.get("operator_history")
    for value in _flatten_context_values(recent):
        for skill in DEEP_ROUTING_SKILLS:
            aliases = SKILL_ALIAS_GROUPS.get(skill, {skill})
            if skill in value or any(alias in value for alias in aliases):
                scores[skill] += 0.75

    return scores


def _score_pattern_group(prompt_lower: str, patterns: Dict[str, Any]) -> Dict[str, float]:
    """Score regex pattern groups against the normalized prompt."""
    scores = {skill: 0.0 for skill in DEEP_ROUTING_SKILLS}
    for skill, entries in patterns.items():
        for pattern, weight in entries:
            if re.search(pattern, prompt_lower):
                scores[skill] += weight
    return scores


def _apply_deep_routing_incompatibility_penalties(
    prompt_lower: str,
    totals: Dict[str, float],
) -> None:
    """Lower plausible-but-wrong siblings when structural intent is explicit."""
    if re.search(r"\bfindings? stabiliz(?:e|es|ed|ing)\b|\bfindingstability\b", prompt_lower):
        totals["deep-research"] *= 0.35
        totals["deep-ai-council"] *= 0.65

    if re.search(r"\binvestigation\b|\binvestigate whether\b|\boriginal .* investigation topic\b", prompt_lower):
        totals["deep-review"] *= 0.45

    if re.search(r"\barchitecture decision\b|\bdeliberat(?:e|ion|ing)\b|\bwhether\b.{0,80}\b(or|vs|versus)\b", prompt_lower):
        totals["deep-review"] *= 0.50
        totals["deep-research"] *= 0.55

    if re.search(r"\bdeep[- ]research packet\b.*\bdrift\b|\bdrift\b.*\binvestigation topic\b", prompt_lower):
        totals["deep-review"] *= 0.55


def _deep_routing_confidence(total_score: float) -> float:
    """Map weighted Candidate scores into a 0..0.95 advisor confidence."""
    return round(min(0.95, total_score / (total_score + 2.0)), 2)


def score_deep_skill_routing(prompt: str, packet_context: dict) -> Dict[str, float]:
    """Return Candidate-3 scores for deep-review/deep-research/deep-ai-council.

    Weighted routing is paired with parity invariants guarded by the Vitest suite.
    """
    prompt_lower = prompt.lower()
    context = packet_context if isinstance(packet_context, dict) else {}
    lexical_scores = _score_pattern_group(prompt_lower, DEEP_ROUTING_LEXICAL_PATTERNS)
    structural_scores = _score_pattern_group(prompt_lower, DEEP_ROUTING_STRUCTURAL_PATTERNS)
    prior_art_scores = _score_prior_art(context) if _packet_context_has_prior_art(context) else {
        skill: 0.0 for skill in DEEP_ROUTING_SKILLS
    }

    totals: Dict[str, float] = {}
    for skill in DEEP_ROUTING_SKILLS:
        totals[skill] = (
            lexical_scores[skill] * 1.0
            + structural_scores[skill] * 2.0
            + prior_art_scores[skill] * 3.0
        )

    _apply_deep_routing_incompatibility_penalties(prompt_lower, totals)
    return {skill: _deep_routing_confidence(totals[skill]) for skill in DEEP_ROUTING_SKILLS}


def _deep_routing_confidence_band(max_score: float) -> str:
    """Classify score confidence using the 130 Candidate-3 bands."""
    if max_score >= 0.75:
        return "HIGH"
    if max_score >= 0.50:
        return "MED"
    return "LOW"


def _deep_routing_clarifying_question(prompt_lower: str, winner: str, runner_up: str) -> str:
    """Return the targeted clarification for low-confidence deep-loop mode routing.

    `winner`/`runner_up` are deep-loop-workflows workflowMode names
    (research|review|ai-council), not legacy skill ids.
    """
    if "architecture" in prompt_lower or "decision" in prompt_lower or "strategy" in prompt_lower:
        return "Are you comparing existing strategies (ai-council mode) or discovering new ones (research mode)?"
    if "findings" in prompt_lower or "convergence" in prompt_lower or "stabilize" in prompt_lower:
        return "Are these findings defects to audit until stable (review mode), research discoveries to exhaust (research mode), or council opinions to deliberate (ai-council mode)?"
    return f"Should this route to {winner} or {runner_up} mode, and what output do you expect: review-report.md, research.md, or council-report.md?"


def deep_skill_routing_payload(prompt: str, packet_context: dict) -> Dict[str, Any]:
    """Return the merged deep-loop routing payload with LOW-confidence clarification.

    The five legacy deep-loop skills are collapsed into deep-loop-workflows, so
    the contract is {skill: deep-loop-workflows, mode: <workflowMode>} plus
    mode-keyed scores. Internal scoring still discriminates per mode; this layer
    projects the legacy discriminator keys onto registry workflowMode names so a
    prompt that used to win "deep-research" now resolves to
    (deep-loop-workflows, research) WITHOUT flattening the mode distinction.
    """
    scores = score_deep_skill_routing(prompt, packet_context)
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    winner_key, max_score = ranked[0]
    runner_up_key = ranked[1][0] if len(ranked) > 1 else ""
    winner_mode = DEEP_ROUTING_MODE_BY_KEY[winner_key]
    runner_up_mode = DEEP_ROUTING_MODE_BY_KEY.get(runner_up_key, runner_up_key)
    mode_scores = {DEEP_ROUTING_MODE_BY_KEY[key]: value for key, value in scores.items()}
    payload: Dict[str, Any] = {
        "skill": MERGED_DEEP_SKILL_ID,
        "mode": winner_mode,
        "scores": mode_scores,
        "winner": winner_mode,
        "confidence": max_score,
        "confidence_band": _deep_routing_confidence_band(max_score),
        "candidate": "Candidate-3" if _packet_context_has_prior_art(packet_context if isinstance(packet_context, dict) else {}) else "Candidate-2",
    }
    if max_score < DEEP_ROUTING_CONFIDENCE_THRESHOLD:
        payload["clarifying_question"] = _deep_routing_clarifying_question(prompt.lower(), winner_mode, runner_up_mode)
    return payload


def _apply_deep_skill_routing_layer(
    recommendations: List[Dict[str, Any]],
    prompt: str,
    packet_context: Optional[Dict[str, Any]] = None,
) -> None:
    """Blend Candidate-3 deep-skill routing into the Python advisor surface."""
    if not recommendations:
        return

    prompt_lower = prompt.lower()
    has_deep_signal = re.search(
        r":review:(?:auto|confirm)\b|/autoresearch\b|\b(autoresearch|auto review release readiness|deep[- ]research|deep[- ]review|deep[- ]council|ai[- ]council|convergence|findings? stabiliz|architecture decision|deliberat|investigation)\b",
        prompt_lower,
    )
    if not has_deep_signal:
        return

    payload = deep_skill_routing_payload(prompt, packet_context or {})
    mode_scores = payload["scores"]  # keyed by workflowMode
    winner_mode = payload["mode"]
    has_merged_deep_candidate = any(
        recommendation.get("skill") == MERGED_DEEP_SKILL_ID
        for recommendation in recommendations
    )

    for recommendation in recommendations:
        skill = recommendation.get("skill")
        # Resolve which mode's confidence to blend in. The merged node
        # (deep-loop-workflows) carries the winning mode; legacy mode-level ids
        # still present mid-migration carry their own mode. Anything else is
        # left untouched.
        if skill == MERGED_DEEP_SKILL_ID:
            mode = winner_mode
        elif skill in DEEP_ROUTING_MODE_BY_KEY:
            mode = DEEP_ROUTING_MODE_BY_KEY[skill]
            if has_merged_deep_candidate and mode in {"research", "review"}:
                recommendation["confidence"] = min(float(recommendation.get("confidence", 0.0)), 0.74)
                recommendation["uncertainty"] = max(float(recommendation.get("uncertainty", 0.0)), 0.42)
                continue
        else:
            continue
        routed_confidence = mode_scores.get(mode, 0.0)
        recommendation["confidence"] = round(max(float(recommendation.get("confidence", 0.0)), routed_confidence), 2)
        recommendation["uncertainty"] = min(float(recommendation.get("uncertainty", 0.0)), 0.30)
        recommendation["mode"] = mode
        recommendation["workflowMode"] = mode
        reason = str(recommendation.get("reason", ""))
        note = f" [Candidate-3 deep routing: {payload['skill']} {mode} {payload['confidence_band']}]"
        if note not in reason:
            recommendation["reason"] = f"{reason}{note}"
        if "clarifying_question" in payload:
            recommendation["clarifying_question"] = payload["clarifying_question"]


# ───────────────────────────────────────────────────────────────
# 3. SCORING
# ───────────────────────────────────────────────────────────────

def calculate_confidence(score: float, has_intent_boost: bool) -> float:
    """
    Calculate confidence score using two-tiered formula.

    The formula distinguishes between queries that match explicit intent keywords
    (INTENT_BOOSTERS) versus those that only match description corpus terms.

    With intent boost (keyword directly matched in INTENT_BOOSTERS):
        confidence = min(0.50 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.80 (meets 0.8 threshold)
        - score=3.0 → 0.95 (max)
        - score=4.0 → 0.95 (capped)

    Without intent boost (corpus matching only):
        confidence = min(0.25 + score * 0.15, 0.95)
        Examples:
        - score=2.0 → 0.55 (below threshold)
        - score=3.0 → 0.70 (below threshold)
        - score=4.0 → 0.85 (meets threshold)
        - score=5.0 → 0.95 (capped)

    The 0.8 threshold in Gate 2 means:
    - With intent boost: Only needs score >= 2.0 to trigger skill routing
    - Without intent boost: Needs score >= 4.0 to trigger skill routing

    This design favors explicit domain keywords while remaining conservative
    for generic corpus matches that may be coincidental.

    Args:
        score: Accumulated match score from corpus matching and intent boosters.
               Higher scores come from matching more terms or important keywords.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
                         True enables the higher-confidence formula.

    Returns:
        float: Confidence score between 0.0 and 0.95
    """
    if has_intent_boost:
        # Intent booster matched - higher confidence curve
        confidence = min(0.50 + score * 0.15, 0.95)
    else:
        # No explicit boosters - conservative (corpus matches only)
        confidence = min(0.25 + score * 0.15, 0.95)

    return confidence


def calculate_uncertainty(num_matches: int, has_intent_boost: bool, num_ambiguous_matches: int) -> float:
    """
    Calculate uncertainty score for skill recommendation.

    Uncertainty measures "how much we don't know" - separate from confidence.
    High confidence + high uncertainty = "confident ignorance" (dangerous state).

    Formula factors:
    - Fewer matches = higher uncertainty (less evidence)
    - No intent boost = higher uncertainty (less clear intent)
    - More ambiguous matches = higher uncertainty (competing interpretations)

    Examples:
    - 5 matches, intent boost, 0 ambiguous: 0.15 (LOW - proceed)
    - 3 matches, intent boost, 1 ambiguous: 0.35 (LOW - proceed)
    - 1 match, no intent boost, 0 ambiguous: 0.55 (MEDIUM - verify)
    - 1 match, no intent boost, 2 ambiguous: 0.75 (HIGH - clarify)
    - 0 matches, no intent boost, 0 ambiguous: 0.85 (HIGH - clarify)

    Args:
        num_matches: Total number of keyword/corpus matches found.
        has_intent_boost: Whether an INTENT_BOOSTER keyword was matched.
        num_ambiguous_matches: Count of MULTI_SKILL_BOOSTER matches (ambiguous keywords).

    Returns:
        float: Uncertainty score between 0.0 and 1.0
               <= 0.35: LOW (proceed)
               0.36-0.60: MEDIUM (verify first)
               > 0.60: HIGH (require clarification)
    """
    # Base uncertainty decreases with more matches
    if num_matches >= 5:
        base_uncertainty = 0.15
    elif num_matches >= 3:
        base_uncertainty = 0.20
    elif num_matches >= 1:
        base_uncertainty = 0.30
    else:
        base_uncertainty = 0.70

    # No intent boost increases uncertainty (less clear intent)
    intent_penalty = 0.0 if has_intent_boost else 0.15

    # Ambiguous matches increase uncertainty (competing interpretations)
    ambiguity_penalty = min(num_ambiguous_matches * 0.08, 0.24)

    uncertainty = min(base_uncertainty + intent_penalty + ambiguity_penalty, 1.0)
    return round(uncertainty, 2)


def passes_dual_threshold(
    confidence: float,
    uncertainty: float,
    conf_threshold: float = 0.8,
    uncert_threshold: float = 0.35,
) -> bool:
    """
    Check if recommendation passes dual-threshold validation.

    READINESS = (confidence >= threshold) AND (uncertainty <= uncert_threshold)

    Note on thresholds:
    - AGENTS.md Gate 1 defines READINESS as: (confidence >= 0.70) AND (uncertainty <= 0.35)
    - Gate 2 skill routing typically uses conf_threshold=0.8 (stricter for routing decisions)
    - The uncertainty threshold of 0.35 matches AGENTS.md exactly

    Args:
        confidence: Confidence score (0.0-1.0)
        uncertainty: Uncertainty score (0.0-1.0)
        conf_threshold: Minimum confidence required (default 0.8 for skill routing)
        uncert_threshold: Maximum uncertainty allowed (default 0.35 per AGENTS.md)

    Returns:
        bool: True if both thresholds pass
    """
    return confidence >= conf_threshold and uncertainty <= uncert_threshold


def refresh_passes_threshold(
    recommendations: List[Dict[str, Any]],
    conf_threshold: float = DEFAULT_CONFIDENCE_THRESHOLD,
    uncert_threshold: float = DEFAULT_UNCERTAINTY_THRESHOLD,
) -> None:
    """Recompute threshold state after score or uncertainty mutators run."""
    for recommendation in recommendations:
        recommendation["passes_threshold"] = passes_dual_threshold(
            recommendation["confidence"],
            recommendation["uncertainty"],
            conf_threshold=conf_threshold,
            uncert_threshold=uncert_threshold,
        )


def apply_confidence_calibration(recommendations: List[Dict[str, Any]]) -> None:
    """Adjust confidence using score margin and ambiguity pressure."""
    if not recommendations:
        return

    ordered = sorted(recommendations, key=lambda item: item["_score"], reverse=True)
    score_map: Dict[str, float] = {}
    for index, current in enumerate(ordered):
        next_score = ordered[index + 1]["_score"] if index + 1 < len(ordered) else 0.0
        score_map[current["skill"]] = current["_score"] - next_score

    for recommendation in recommendations:
        confidence = recommendation["confidence"]
        num_matches = max(1, recommendation.get("_num_matches", 1))
        num_ambiguous = recommendation.get("_num_ambiguous", 0)
        margin = score_map.get(recommendation["skill"], 0.0)

        margin_penalty = 0.0
        if margin < 0.6:
            margin_penalty = min((0.6 - margin) * 0.2, 0.12)

        ambiguity_ratio = num_ambiguous / num_matches
        ambiguity_penalty = min(ambiguity_ratio * 0.1, 0.1)
        evidence_bonus = min(max(num_matches - 3, 0) * 0.01, 0.05)

        calibrated = confidence - margin_penalty - ambiguity_penalty + evidence_bonus
        recommendation["confidence"] = round(max(0.0, min(0.95, calibrated)), 2)


def apply_graph_evidence_calibration(recommendations: List[Dict[str, Any]]) -> None:
    """Temper graph-majority recommendations while lowering graph-separated uncertainty."""
    for recommendation in recommendations:
        graph_boost_count = recommendation.get("_graph_boost_count", 0)
        total_matches = recommendation.get("_num_matches", 1)
        if total_matches <= 0:
            continue

        graph_fraction = graph_boost_count / total_matches
        if graph_fraction <= 0.5:
            continue

        recommendation["confidence"] = round(recommendation["confidence"] * 0.90, 2)
        recommendation["uncertainty"] = round(max(0.0, recommendation["uncertainty"] * 0.85), 2)


def filter_recommendations(
    recommendations: List[Dict[str, Any]],
    confidence_threshold: float,
    uncertainty_threshold: float,
    confidence_only: bool,
    show_rejections: bool,
) -> List[Dict[str, Any]]:
    """Filter recommendations under default dual-threshold or explicit confidence-only mode."""
    filtered: List[Dict[str, Any]] = []

    for recommendation in recommendations:
        passes = passes_dual_threshold(
            recommendation["confidence"],
            recommendation["uncertainty"],
            conf_threshold=confidence_threshold,
            uncert_threshold=uncertainty_threshold,
        )
        recommendation["passes_threshold"] = passes
        # Mirror the native path's source tag so callers can tell which
        # scorer produced a recommendation (native daemon vs local fallback).
        recommendation.setdefault("source", "local")

        if confidence_only:
            if recommendation["confidence"] >= confidence_threshold:
                filtered.append(recommendation)
            continue

        if show_rejections or passes:
            filtered.append(recommendation)

    return filtered


# Iteration-loop phrases that imply skill-owned workflow (deep-research / deep-review)
# When these match AND command-spec-kit is a candidate alongside cli-*, promote the command.
# See CLAUDE.md / AGENTS.md Gate 4: SKILL-OWNED WORKFLOW ENFORCEMENT.
ITERATION_LOOP_PHRASES = (
    "deep-research", "deep research", "deep-review", "deep review",
    "autoresearch", "auto research", "research loop", "review loop",
    "iterative research", "iterative review", "autonomous research", "autonomous review",
    "iterations of", ":auto", "convergence detection",
    "/deep:start-research-loop", "/deep:start-review-loop",
    "deep:start-research-loop", "deep:start-review-loop",
)

# Deep-research disambiguation phrases. When the prompt
# contains one of these and both `deep-research` and `sk-code`
# appear as candidates within a thin margin, enforce a ≥ 0.10 confidence gap
# so `deep-research` keeps the primary slot. Wording-sensitive audit/review
# tokens must not steal a deep-research prompt back into the generic review
# lane.
DEEP_RESEARCH_DISAMBIGUATION_PHRASES = (
    "deep research",
    "deep-research",
    "autoresearch",
    "/autoresearch",
    "research loop",
    "iterative research",
    "autonomous research",
    "auto research",
    "/deep:start-research-loop",
    "deep:start-research-loop",
)

# Symmetric guard for deep-review vs code-review wording collisions.
# NOTE: "auto review" is intentionally omitted because the shipped regression
# corpus treats "auto review this PR" as an sk-code prompt. Strong
# deep-review phrases (e.g. "auto review release readiness") are already
# covered by explicit multi-token PHRASE_INTENT_BOOSTERS entries that win
# on raw score before this disambiguation tier executes.
DEEP_REVIEW_DISAMBIGUATION_PHRASES = (
    "deep review",
    "deep-review",
    "review loop",
    "iterative review",
    "autonomous review",
    "/deep:start-review-loop",
    "deep:start-review-loop",
    ":review:auto",
    ":review:confirm",
)

DISAMBIGUATION_MARGIN = 0.10

# External-tool-chain ("call_tool_chain") vocabulary belongs to mcp-code-mode,
# not the generic code skill. Used to disambiguate toolchain-shaped prompts.
CODE_MODE_TOOLCHAIN_RE = re.compile(r"\b(call_tool_chain|code mode|tool ?chain|api chain)\b")

# Task-intent verbs (parity with the TS scorer's TASK_INTENT). A prompt that
# carries one of these is not treated as an under-specified low-information
# prompt for abstention purposes.
TASK_INTENT_RE = re.compile(
    r"\b(add|append|build|change|configure|create|edit|fix|generate|implement"
    r"|modify|move|patch|refactor|rename|replace|run|start|sweep|update|write)\b"
)

# Uncertainty floor applied to every member of a low-information ambiguity
# cluster: above the default strict threshold so strict callers abstain, but
# below 1 so confidence-only callers still surface the best guess.
AMBIGUITY_MARGIN = 0.05
AMBIGUITY_CONFIDENCE_MARGIN = 0.05
LOW_INFO_AMBIGUITY_UNCERTAINTY_FLOOR = 0.42

# Minimum share of the winner's matches that must be ambiguous multi-skill
# keywords ("(multi)") for low-information abstention to fire. This separates a
# genuinely under-specified prompt ("api chain mcp" — all matches are shared
# keywords) from a terse-but-anchored one ("code audit" — anchored by a phrase
# and an intent), which should still route.
LOW_INFO_AMBIGUITY_MULTI_RATIO = 0.5

# Class B (CLI-vs-skill): a code-edit request is sk-code work even when it names
# a CLI tool ("update the python script following opencode standards"). These
# gate the code-edit disambiguator; the explicit-CLI guard preserves genuine
# "use cli-opencode" / "delegate to opencode" delegation prompts.
CODE_EDIT_VERB_RE = re.compile(r"\b(update|edit|modify|fix|refactor|implement|write|patch|rewrite)\b")
CODE_SURFACE_NOUN_RE = re.compile(r"\b(script|file|module|function|class|handler|component|code|\.py|\.ts|\.js|\.tsx|\.mjs|\.cjs)\b")
REVIEW_PLUS_WRITE_RE = re.compile(r"\breview\b.{0,40}\b(update|edit|modify|fix|patch|rewrite)\b")
CLI_OPENCODE_EXPLICIT_RE = re.compile(r"\b(cli-opencode|opencode cli|delegate to opencode|use opencode)\b")

# Git vocabulary is intentionally broad, but ownership boundaries still matter:
# memory/context preservation belongs to system-spec-kit, and review phrases that
# mention PRs or merge readiness belong to sk-code.
MEMORY_PRESERVATION_INTENT_RE = re.compile(
    r"\b(save|preserve|remember|store|capture|checkpoint)\b.{0,80}"
    r"\b(memory|context|conversation|session|handover)\b"
    r"|\b(memory|context|conversation|session|handover)\b.{0,80}"
    r"\b(save|preserve|remember|store|capture|checkpoint)\b"
    r"|/memory:save|\bmemory:save\b"
)
EXPLICIT_GIT_WORKFLOW_RE = re.compile(
    r"\b(git|commit|branch|checkout|clone|conflict|diff|fetch|github|gh|pull request|push|rebase|stash|worktree)\b"
)
CODE_REVIEW_INTENT_RE = re.compile(
    r"\b(code review|pr review|review this pr|request changes|merge readiness|ready to merge|quality gate|security review|code audit)\b"
)
GIT_REVIEW_OVERLAP_RE = re.compile(r"\b(pr|pull request|merge|changes)\b")


def _find_recommendation(
    recommendations: List[Dict[str, Any]],
    skill_name: str,
) -> Optional[Dict[str, Any]]:
    return next((rec for rec in recommendations if rec.get("skill") == skill_name), None)


def _append_reason_note(recommendation: Dict[str, Any], note: str) -> None:
    reason = str(recommendation.get("reason", ""))
    if note not in reason:
        recommendation["reason"] = f"{reason} {note}".strip()


def _apply_git_boundary_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Apply negative evidence when git overlap terms appear in another owner domain."""
    if not prompt_lower or not recommendations:
        return

    sk_git = _find_recommendation(recommendations, "sk-git")
    if sk_git is None:
        return

    if MEMORY_PRESERVATION_INTENT_RE.search(prompt_lower) and not EXPLICIT_GIT_WORKFLOW_RE.search(prompt_lower):
        sk_git["confidence"] = min(float(sk_git.get("confidence", 0.0)), 0.74)
        sk_git["uncertainty"] = max(float(sk_git.get("uncertainty", 0.0)), 0.42)
        _append_reason_note(sk_git, "[boundary: memory/context preservation is not git work]")

        system_spec = _find_recommendation(recommendations, "system-spec-kit")
        if system_spec is not None:
            system_spec["confidence"] = max(float(system_spec.get("confidence", 0.0)), 0.95)
            system_spec["uncertainty"] = min(float(system_spec.get("uncertainty", 1.0)), 0.20)
            _append_reason_note(system_spec, "[boundary: owns memory/context preservation]")

    if CODE_REVIEW_INTENT_RE.search(prompt_lower) and GIT_REVIEW_OVERLAP_RE.search(prompt_lower):
        code_rec = _find_recommendation(recommendations, "sk-code")
        if code_rec is None:
            return

        review_confidence = float(code_rec.get("confidence", 0.0))
        git_confidence = float(sk_git.get("confidence", 0.0))
        capped = round(max(0.0, review_confidence - 0.03), 2)
        if git_confidence >= review_confidence:
            sk_git["confidence"] = min(git_confidence, capped)
            _append_reason_note(sk_git, "[boundary: review phrasing is not git workflow ownership]")
        code_rec["uncertainty"] = min(float(code_rec.get("uncertainty", 1.0)), 0.25)


def _apply_code_edit_cli_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Keep code-edit requests on sk-code even when a CLI tool is named.

    "update the python script following opencode standards" is sk-code work,
    but the bare "opencode" keyword scores cli-opencode while sk-code fails only
    on uncertainty (not confidence). When code-edit verbs + a code-surface noun
    are present and the prompt does NOT explicitly invoke the CLI, cap sk-code's
    uncertainty so it clears the strict threshold and outranks the keyword match.
    """
    if not prompt_lower:
        return
    if CLI_OPENCODE_EXPLICIT_RE.search(prompt_lower):
        return
    if not (CODE_EDIT_VERB_RE.search(prompt_lower) and CODE_SURFACE_NOUN_RE.search(prompt_lower)):
        return
    sk_code = next((rec for rec in recommendations if rec.get("skill") == "sk-code"), None)
    if sk_code is not None:
        sk_code["uncertainty"] = min(float(sk_code.get("uncertainty", 1.0)), 0.30)


def _apply_cli_opencode_delegation_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Keep explicit OpenCode delegation prompts on the CLI executor route."""
    if not CLI_OPENCODE_EXPLICIT_RE.search(prompt_lower):
        return
    cli_opencode = _find_recommendation(recommendations, "cli-opencode")
    if cli_opencode is None:
        return

    cli_opencode["confidence"] = max(float(cli_opencode.get("confidence", 0.0)), 0.95)
    cli_opencode["uncertainty"] = min(float(cli_opencode.get("uncertainty", 1.0)), 0.20)
    _append_reason_note(cli_opencode, "[disambiguation: explicit opencode delegation]")

    sk_code = _find_recommendation(recommendations, "sk-code")
    if sk_code is not None:
        sk_code["confidence"] = min(float(sk_code.get("confidence", 0.0)), 0.88)
        _append_reason_note(sk_code, "[disambiguation: explicit opencode delegation]")


def _apply_review_plus_write_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Route review-plus-edit wording to code work instead of findings review."""
    if not REVIEW_PLUS_WRITE_RE.search(prompt_lower):
        return
    sk_code = _find_recommendation(recommendations, "sk-code")
    if sk_code is not None:
        sk_code["confidence"] = max(float(sk_code.get("confidence", 0.0)), 0.92)
        sk_code["uncertainty"] = min(float(sk_code.get("uncertainty", 1.0)), 0.25)
        sk_code["_score"] = max(float(sk_code.get("_score", 0.0)), 3.0)
        _append_reason_note(sk_code, "[disambiguation: edit requested]")


def _apply_code_mode_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Lift mcp-code-mode just above sk-code on toolchain-shaped prompts.

    Toolchain vocabulary ("call_tool_chain", "code mode", "api chain") is the
    mcp-code-mode domain. When it appears and both candidates are present,
    raise mcp-code-mode's confidence just above sk-code so it becomes the
    disambiguated best guess, WITHOUT demoting sk-code out of the ambiguity
    cluster — low-information abstention still applies to the cluster.
    """
    if not prompt_lower or not recommendations:
        return
    if not CODE_MODE_TOOLCHAIN_RE.search(prompt_lower):
        return
    mcp = next((r for r in recommendations if r.get("skill") == "mcp-code-mode"), None)
    if mcp is None:
        return
    sk_code = next((r for r in recommendations if r.get("skill") == "sk-code"), None)
    sk_conf = float(sk_code.get("confidence", 0.0)) if sk_code else 0.0
    target = round(min(0.95, max(float(mcp.get("confidence", 0.0)), sk_conf + 0.03)), 2)
    if target > float(mcp.get("confidence", 0.0)):
        mcp["confidence"] = target


def _apply_low_info_ambiguity_abstention(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Floor the uncertainty of a low-information ambiguity cluster (TS parity).

    A short, intent-less prompt that lands in a multi-candidate cluster (two or
    more confidence-passing candidates within either ambiguity margin) is
    under-specified. Flooring uncertainty above the strict threshold makes
    strict callers abstain while confidence-only callers still surface the
    top-ranked best guess.
    """
    if not recommendations:
        return
    meaningful = [token for token in re.findall(r"\b\w+\b", prompt_lower) if len(token) > 1]
    if len(meaningful) > 3 or TASK_INTENT_RE.search(prompt_lower) or "/" in prompt_lower:
        return
    # Confidence-only membership on purpose: a candidate whose uncertainty
    # already fails the strict threshold still belongs in the cluster — it is
    # exactly the near-tie evidence that makes the prompt under-specified.
    passing_conf = [
        rec for rec in recommendations
        if float(rec.get("confidence", 0.0)) >= DEFAULT_CONFIDENCE_THRESHOLD
    ]
    if len(passing_conf) < 2:
        return
    # Confidence keys the top selection: the final ranking surfaces the
    # highest-confidence passing candidate, so the abstention decision must
    # judge that same candidate's match quality.
    top = max(passing_conf, key=lambda rec: float(rec.get("confidence", 0.0)))
    top_score = float(top.get("_score", 0.0))
    top_confidence = float(top.get("confidence", 0.0))
    # Union of the score-margin and confidence-margin clusters, mirroring the
    # native scorer: a candidate is ambiguous when EITHER gap sits inside its
    # margin; only "outside both margins" counts as unambiguously ranked.
    cluster = [
        rec for rec in passing_conf
        if abs(top_score - float(rec.get("_score", 0.0)))
        <= AMBIGUITY_MARGIN + sys.float_info.epsilon
        or abs(top_confidence - float(rec.get("confidence", 0.0)))
        <= AMBIGUITY_CONFIDENCE_MARGIN + sys.float_info.epsilon
    ]
    if len(cluster) < 2:
        return
    # Only abstain when the winner's lead is built from ambiguous multi-skill
    # keywords rather than a distinctive anchor (phrase/intent/explicit match).
    winner = max(cluster, key=lambda rec: float(rec.get("confidence", 0.0)))
    num_matches = max(1, int(winner.get("_num_matches", 1)))
    multi_ratio = int(winner.get("_num_ambiguous", 0)) / num_matches
    if multi_ratio < LOW_INFO_AMBIGUITY_MULTI_RATIO:
        return
    for rec in cluster:
        rec["uncertainty"] = max(float(rec.get("uncertainty", 0.0)), LOW_INFO_AMBIGUITY_UNCERTAINTY_FLOOR)


# Class C breadth/multi-concern abstention gates (parity with the TS scorer).
BREADTH_BUILD_VERB_RE = re.compile(r"\b(build|create|implement|generate|scaffold)\b")
BREADTH_NOUN_RE = re.compile(r"\b(full[- ]?stack|service|platform|application|microservice|saas|backend)\b")
BREADTH_NARROW_ANCHOR_RE = re.compile(
    r"\.[a-z]{2,4}\b|\b(test|tests|error|bug|failure|failing|handler|component|function"
    r"|route|endpoint|class|method|benchmark|review|audit|migration|schema)\b"
)
MULTI_CONCERN_VERB_RE = re.compile(r"\b(optimize|improve|enhance|harden)\b")
CONCERN_PERF_RE = re.compile(r"\b(speed|latency|execution|throughput|performance|startup|memory|cpu)\b")
CONCERN_QUALITY_RE = re.compile(r"\b(quality|accuracy|recommendation|recommendations|correctness|reliability|coverage)\b")


def _apply_breadth_abstention(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Floor uncertainty on under-specified breadth/multi-concern prompts.

    A broad greenfield build ("build full stack typescript service") or a
    multi-concern optimization ("optimize X execution speed and recommendation
    quality") routes over-confidently to a code-like skill. When the would-be
    top is code-like, floor every passing candidate's uncertainty so strict
    callers abstain. Narrow anchors (file/test/handler/route/benchmark/review)
    bypass the broad-build branch; multi-concern requires two concern classes,
    so a file plus a single concern still routes.
    """
    if not prompt_lower or "/" in prompt_lower:
        return
    concern_classes = (1 if CONCERN_PERF_RE.search(prompt_lower) else 0) + (
        1 if CONCERN_QUALITY_RE.search(prompt_lower) else 0
    )
    broad_build = (
        bool(BREADTH_BUILD_VERB_RE.search(prompt_lower))
        and bool(BREADTH_NOUN_RE.search(prompt_lower))
        and not BREADTH_NARROW_ANCHOR_RE.search(prompt_lower)
    )
    multi_concern = bool(MULTI_CONCERN_VERB_RE.search(prompt_lower)) and concern_classes >= 2
    if not (broad_build or multi_concern):
        return
    passing = [rec for rec in recommendations if rec.get("passes_threshold")]
    if not passing:
        return
    top = max(passing, key=lambda rec: float(rec.get("confidence", 0.0)))
    if top.get("skill") not in ("sk-code", "system-skill-advisor"):
        return
    for rec in passing:
        rec["uncertainty"] = max(float(rec.get("uncertainty", 0.0)), LOW_INFO_AMBIGUITY_UNCERTAINTY_FLOOR)


def _apply_deep_research_disambiguation(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Ensure deep-research beats sk-code by ≥ 0.10 on deep-research prompts.

    Audit/review-token overlap between deep-research prompts
    and code-review prompts produced sub-0.02 confidence ties. When the prompt
    contains an unambiguous deep-research marker AND both `deep-research`
    and `sk-code` appear as candidates, widen the margin to at least
    ``DISAMBIGUATION_MARGIN`` so the router returns a stable deep-research
    recommendation instead of a wording-sensitive tie.

    Symmetric handling is applied for `deep-review` vs `sk-code` via
    ``DEEP_REVIEW_DISAMBIGUATION_PHRASES``.
    """
    if not prompt_lower or not recommendations:
        return

    def _find(skill_name: str) -> Optional[Dict[str, Any]]:
        for rec in recommendations:
            if rec.get("skill") == skill_name:
                return rec
        return None

    def _enforce_margin(
        winner: Dict[str, Any],
        loser: Dict[str, Any],
        reason_label: str,
    ) -> None:
        winner_conf = float(winner.get("confidence", 0.0))
        loser_conf = float(loser.get("confidence", 0.0))
        gap = winner_conf - loser_conf
        if gap >= DISAMBIGUATION_MARGIN:
            return
        adjusted = max(0.0, round(winner_conf - DISAMBIGUATION_MARGIN, 2))
        if adjusted >= loser_conf:
            return
        loser["confidence"] = adjusted
        existing_reason = str(loser.get("reason", ""))
        note = f" [disambiguation: {reason_label} reserved for this prompt]"
        if note not in existing_reason:
            loser["reason"] = f"{existing_reason}{note}"

    def _deep_winner(legacy_id: str) -> Optional[Dict[str, Any]]:
        return _find(MERGED_DEEP_SKILL_ID) or _find(legacy_id)

    if any(phrase in prompt_lower for phrase in DEEP_RESEARCH_DISAMBIGUATION_PHRASES):
        winner = _deep_winner("deep-research")
        loser = _find("sk-code")
        if winner and loser:
            _enforce_margin(winner, loser, "deep-research")

    if any(phrase in prompt_lower for phrase in DEEP_REVIEW_DISAMBIGUATION_PHRASES):
        winner = _deep_winner("deep-review")
        loser = _find("sk-code")
        if winner and loser:
            _enforce_margin(winner, loser, "deep-review")


def _apply_iteration_loop_tiebreaker(
    recommendations: List[Dict[str, Any]],
    prompt_lower: str,
) -> None:
    """Promote command-spec-kit over cli-* when iteration-loop phrases are present.

    Background: when a user asks to run iterations of deep-research or deep-review with
    a specific CLI executor (e.g. "use cli-opencode for 50 iterations"), the skill advisor
    previously returned command-spec-kit and the cli-* peer with similar confidence. Picking
    the cli-* peer as the primary route bypasses the skill's state machine, convergence
    detection, and deltas.

    Rule: if the prompt contains iteration-loop phrases AND both a command-spec-kit
    recommendation and a cli-* skill recommendation are present, penalize the cli-*
    confidence so the command wins the primary slot. The CLI executor is still a valid
    tool INSIDE the command's YAML workflow — it just can't BE the workflow.
    """
    if not prompt_lower:
        return

    has_iteration_phrase = any(phrase in prompt_lower for phrase in ITERATION_LOOP_PHRASES)
    if not has_iteration_phrase:
        return

    has_command = any(r.get("skill") == "command-spec-kit" for r in recommendations)
    cli_recs = [r for r in recommendations if r.get("skill", "").startswith("cli-")]
    if not has_command or not cli_recs:
        return

    # Penalize cli-* confidence by 0.20 (capped at 0.60 floor) so command-spec-kit
    # ranks ahead. This preserves the cli-* as an available tool for the command's
    # internal use but removes it as a competing primary route.
    for rec in cli_recs:
        current = rec.get("confidence", 0.0)
        penalized = max(0.60, current - 0.20)
        if penalized < current:
            rec["confidence"] = round(penalized, 2)
            reason = rec.get("reason", "")
            rec["reason"] = f"{reason} [iteration-loop tiebreaker: -0.20; command-spec-kit owns loop, cli-* is tool inside it]"


# ───────────────────────────────────────────────────────────────
# 4. ANALYSIS
# ───────────────────────────────────────────────────────────────

def analyze_request(prompt: str) -> List[Dict[str, Any]]:
    """Analyze user request and return ranked skill recommendations.

    Args:
        prompt: The user request text.
    """
    if not prompt:
        return []

    prompt_lower = prompt.lower()
    all_tokens = re.findall(r'\b\w+\b', prompt_lower)
    skills = get_skills()
    explicit_command_intent = detect_explicit_command_intent(prompt_lower)

    # Intent boosts calculated BEFORE stop word filtering - question words (how, why, what)
    # are important signals for semantic search but would otherwise be filtered
    skill_boosts = {}
    boost_reasons = {}

    apply_intent_normalization(
        prompt_lower=prompt_lower,
        tokens=all_tokens,
        skill_boosts=skill_boosts,
        boost_reasons=boost_reasons,
    )

    for token in all_tokens:
        if token in INTENT_BOOSTERS:
            skill, boost = INTENT_BOOSTERS[token]
            skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
            if skill not in boost_reasons:
                boost_reasons[skill] = []
            boost_reasons[skill].append(f"!{token}")

        if token in MULTI_SKILL_BOOSTERS:
            for skill, boost in MULTI_SKILL_BOOSTERS[token]:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{token}(multi)")

    for phrase, boosts in PHRASE_INTENT_BOOSTERS.items():
        if _matches_phrase_boundary(prompt_lower, phrase):
            for skill, boost in boosts:
                skill_boosts[skill] = skill_boosts.get(skill, 0) + boost
                if skill not in boost_reasons:
                    boost_reasons[skill] = []
                boost_reasons[skill].append(f"!{phrase}(phrase)")

    if _is_memory_preservation_session_intent(prompt_lower):
        for skill, boost in (
            ("memory:save", 1.2),
            ("command-memory-save", 0.8),
            ("system-spec-kit", 0.3),
        ):
            skill_boosts[skill] = skill_boosts.get(skill, 0.0) + boost
            boost_reasons.setdefault(skill, []).append("!memory-preservation-session-intent")

    if _is_ambiguous_code_problem(prompt_lower):
        for skill, boost in (
            ("sk-code", 1.3),
            ("deep-review", 0.55),
        ):
            skill_boosts[skill] = skill_boosts.get(skill, 0.0) + boost
            boost_reasons.setdefault(skill, []).append("!ambiguous-code-problem")

    _apply_signal_boosts(prompt_lower, skill_boosts, boost_reasons)

    # Graph-derived boosts: transitive relationships and family affinity
    _apply_graph_boosts(skill_boosts, boost_reasons)
    _apply_family_affinity(skill_boosts, boost_reasons)

    # Review-plus-write intent (Python parity with the TypeScript explicit
    # lane). Applied AFTER graph boosts so the graph signal does not dilute
    # the anchor. When the prompt contains the word `review` AND any explicit
    # write/edit verb (`update|edit|fix|modify`), the request is
    # implementation work; anchor firmly on `sk-code` so the code hub wins the
    # skill selection (its router then selects the implement mode over the
    # code-review mode).
    if re.search(r"\breview\b", prompt_lower) and re.search(r"\b(update|edit|fix|modify)\b", prompt_lower):
        skill_boosts["sk-code"] = skill_boosts.get("sk-code", 0.0) + 3.0
        boost_reasons.setdefault("sk-code", []).append("!review-plus-write-disambiguation")

    # Strongly prefer the explicitly named skill when users mention it directly.
    # This protects routing in mixed prompts that also contain broad terms like "opencode".
    for skill_name, config in skills.items():
        variants = set(config.get("variants", set())) or _build_variants(skill_name)
        matched_variants = sorted({v for v in variants if _matches_phrase_boundary(prompt_lower, v)})
        if not matched_variants:
            continue

        explicit_boost = 2.5 + 0.3 * (len(matched_variants) - 1)
        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + explicit_boost
        if skill_name not in boost_reasons:
            boost_reasons[skill_name] = []
        for variant in matched_variants:
            boost_reasons[skill_name].append(f"!{variant}(explicit)")

    for skill_name, config in skills.items():
        keyword_variants = set(config.get("keyword_variants", set()))
        matched_keywords = sorted({
            variant
            for variant in keyword_variants
            if _matches_phrase_boundary(prompt_lower, variant)
        })
        if not matched_keywords:
            continue

        keyword_boost = 1.0 + 0.2 * (len(matched_keywords) - 1)
        skill_boosts[skill_name] = skill_boosts.get(skill_name, 0) + keyword_boost
        if skill_name not in boost_reasons:
            boost_reasons[skill_name] = []
        for keyword in matched_keywords:
            boost_reasons[skill_name].append(f"!{keyword}(keyword)")

    # Stop words filtered for corpus matching only
    tokens = [t for t in all_tokens if t not in STOP_WORDS and len(t) > 2]

    if not tokens and not skill_boosts:
        return []

    search_terms = expand_query(tokens) if tokens else []
    recommendations = []
    for name, config in skills.items():
        score = skill_boosts.get(name, 0.0)
        matches = boost_reasons.get(name, []).copy()

        name_parts_filtered = set(config.get("name_terms", set())) or _normalize_terms(name.replace('-', ' '))
        corpus = set(config.get("corpus_terms", set())) or _normalize_terms(config["description"])
        kind = config.get("kind", "skill")

        for term in search_terms:
            if term in name_parts_filtered:
                score += 1.5
                matches.append(f"{term}(name)")
            elif term in corpus:
                score += 1.0
                matches.append(term)
            elif len(term) >= 4:
                for corpus_word in corpus:
                    if len(corpus_word) >= 4 and (term in corpus_word or corpus_word in term):
                        score += 0.5
                        matches.append(f"{term}~")
                        break

        if kind == "command" and explicit_command_intent != name:
            score -= 0.35
            if score > 0:
                matches.append("command_penalty")

        if score <= 0:
            continue

        total_intent_boost = skill_boosts.get(name, 0.0)
        has_boost = total_intent_boost > 0
        confidence = calculate_confidence(
            score=score,
            has_intent_boost=has_boost,
        )
        if name in {"memory:save", "command-memory-save"} and _is_plain_file_save_prompt(prompt_lower):
            confidence = min(confidence, 0.49)

        num_matches = len(matches)
        num_ambiguous = sum(1 for m in matches if '(multi)' in m)
        graph_boost_count = len([m for m in matches if m.startswith('!graph:')])
        uncertainty = calculate_uncertainty(
            num_matches=num_matches,
            has_intent_boost=has_boost,
            num_ambiguous_matches=num_ambiguous
        )

        if explicit_command_intent:
            kind_priority = 2 if name == explicit_command_intent else (1 if kind == "command" else 0)
        else:
            kind_priority = 1 if kind == "skill" else 0

        recommendations.append({
            "skill": name,
            "kind": kind,
            "confidence": round(confidence, 2),
            "uncertainty": uncertainty,
            "passes_threshold": False,
            "reason": f"Matched: {', '.join(sorted(set(matches))[:5])}",
            "_score": round(score, 4),
            "_explicit_skill_match": any('(explicit)' in m for m in matches),
            "_kind_priority": kind_priority,
            "_num_matches": num_matches,
            "_num_ambiguous": num_ambiguous,
            "_graph_boost_count": graph_boost_count,
        })

    apply_confidence_calibration(recommendations)
    apply_graph_evidence_calibration(recommendations)
    _apply_memory_save_file_operation_cap(recommendations, prompt_lower)
    _apply_git_boundary_disambiguation(recommendations, prompt_lower)

    # Disambiguate deep-research vs code-review and
    # deep-review vs code-review before the iteration-loop tiebreaker so the
    # primary-slot selection is stable on audit/review-token prompts.
    _apply_deep_research_disambiguation(recommendations, prompt_lower)
    _apply_code_mode_disambiguation(recommendations, prompt_lower)
    _apply_code_edit_cli_disambiguation(recommendations, prompt_lower)
    _apply_cli_opencode_delegation_disambiguation(recommendations, prompt_lower)
    _apply_review_plus_write_disambiguation(recommendations, prompt_lower)
    _apply_deep_skill_routing_layer(recommendations, prompt)

    # Iteration-loop tiebreaker: when the query mentions iterative investigation/review
    # phrases AND command-spec-kit matches alongside a cli-* executor skill, promote
    # command-spec-kit. The CLI executor is a tool INSIDE the command's workflow, not
    # a replacement for it. Prevents custom bash dispatchers bypassing skill-owned state.
    # See CLAUDE.md / AGENTS.md Gate 4: SKILL-OWNED WORKFLOW ENFORCEMENT.
    _apply_iteration_loop_tiebreaker(recommendations, prompt_lower)

    # A verbatim skill-name mention is the strongest routing signal the user
    # can give. Without this relief, a busy prompt can leave the NAMED skill
    # above the uncertainty gate while a sibling that merely lists that name
    # as a keyword passes — strict callers then surface only the sibling.
    for rec in recommendations:
        if rec.get("_explicit_skill_match"):
            rec["uncertainty"] = min(float(rec.get("uncertainty", 1.0)), 0.30)

    refresh_passes_threshold(recommendations)
    _apply_graph_conflict_penalty(recommendations)
    refresh_passes_threshold(recommendations)

    # Low-information ambiguity abstention runs BEFORE the sort: flooring the
    # cluster's uncertainty makes every member fail the strict dual-threshold,
    # so the sort falls through to confidence and the disambiguated best guess
    # ranks first for confidence-only callers (strict callers still abstain).
    _apply_low_info_ambiguity_abstention(recommendations, prompt_lower)
    refresh_passes_threshold(recommendations)
    _apply_breadth_abstention(recommendations, prompt_lower)
    refresh_passes_threshold(recommendations)

    ranked = sorted(
        recommendations,
        key=lambda x: (
            x['_kind_priority'],
            x['_explicit_skill_match'],
            x['passes_threshold'],
            x['confidence'],
            x['_score'],
        ),
        reverse=True,
    )
    ranked = normalize_command_bridge_recommendations(ranked, prompt_lower)
    refresh_passes_threshold(ranked)

    # Internal sort metadata should not leak in advisor output.
    for rec in ranked:
        rec.pop('_score', None)
        rec.pop('_explicit_skill_match', None)
        rec.pop('_kind_priority', None)
        rec.pop('_num_matches', None)
        rec.pop('_num_ambiguous', None)

    return ranked


# ───────────────────────────────────────────────────────────────
# 5. DIAGNOSTICS
# ───────────────────────────────────────────────────────────────

def load_all_skills() -> List[Dict[str, Any]]:
    """Load all skills for diagnostics."""
    loaded = []
    for name, config in get_skills(force_refresh=True).items():
        loaded.append({
            "name": name,
            "description": config.get("description", ""),
            "kind": config.get("kind", "skill"),
        })
    return loaded


def _collect_graph_skill_ids(graph: Optional[Dict[str, Any]]) -> Set[str]:
    """Extract the union of skill IDs mentioned anywhere in a compiled graph."""
    graph_ids: Set[str] = set()
    if not isinstance(graph, dict):
        return graph_ids
    for family_members in (graph.get("families") or {}).values():
        if isinstance(family_members, list):
            graph_ids.update(
                str(member) for member in family_members if isinstance(member, str)
            )
    for source_id, edge_groups in (graph.get("adjacency") or {}).items():
        if isinstance(source_id, str):
            graph_ids.add(str(source_id))
        if isinstance(edge_groups, dict):
            for targets in edge_groups.values():
                if isinstance(targets, dict):
                    graph_ids.update(
                        str(target) for target in targets.keys() if isinstance(target, str)
                    )
    for signal_id in (graph.get("signals") or {}).keys():
        if isinstance(signal_id, str):
            graph_ids.add(str(signal_id))
    return graph_ids


def _compare_inventories(
    skill_names: List[str],
    graph: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """Thin wrapper around ``skill_advisor_runtime.compare_inventories``.

    The primitive set-comparison lives in
    ``skill_advisor_runtime.py`` so it can be reused from other harnesses;
    this wrapper extracts the compiled-graph skill IDs and forwards to the
    runtime helper.
    """
    graph_ids = _collect_graph_skill_ids(graph)
    parity = _runtime_module.compare_inventories(skill_names, graph_ids)
    missing_in_discovery = set(parity.get("missing_in_discovery", []))
    missing_in_graph = set(parity.get("missing_in_graph", []))
    tolerated_graph_only = sorted(missing_in_discovery & GRAPH_ONLY_SKILL_IDS)
    tolerated_graphless_inline = sorted(missing_in_graph & GRAPHLESS_INLINE_SKILL_IDS)
    blocking_missing = sorted(missing_in_discovery - GRAPH_ONLY_SKILL_IDS)
    blocking_missing_in_graph = sorted(missing_in_graph - GRAPHLESS_INLINE_SKILL_IDS)

    if tolerated_graph_only or tolerated_graphless_inline:
        parity = dict(parity)
        parity["missing_in_discovery"] = blocking_missing
        parity["missing_in_graph"] = blocking_missing_in_graph
        parity["graph_only"] = tolerated_graph_only
        parity["graphless_inline"] = tolerated_graphless_inline
        parity["in_sync"] = not blocking_missing_in_graph and not blocking_missing

    return parity


def health_check() -> Dict[str, Any]:
    """Return skill count and status for diagnostics."""
    skills = load_all_skills()
    real_skills = [s for s in skills if s.get("kind") == "skill"]
    command_bridges = [s for s in skills if s.get("kind") == "command"]
    graph = _load_skill_graph()
    graph_loaded = graph is not None
    _load_source_graph_signal_map()
    _load_source_conflict_declarations()
    source_metadata = _source_metadata_health()
    cache_status = get_cache_status()

    # Surface persisted topology-warning payload (if any).
    topology_warnings: Dict[str, List[str]] = {}
    if isinstance(graph, dict):
        raw = graph.get("topology_warnings")
        if isinstance(raw, dict):
            for category, messages in raw.items():
                if isinstance(category, str) and isinstance(messages, list):
                    cleaned = [str(m) for m in messages if isinstance(m, str) and m.strip()]
                    if cleaned:
                        topology_warnings[category] = cleaned
    has_topology_warnings = any(topology_warnings.values())

    # Inventory parity check between SKILL.md discovery
    # (authoritative for analyze_request's skill records) and the compiled
    # graph (authoritative for adjacency/signal-based boosts). Any mismatch
    # downgrades health to `degraded` even when both sources loaded cleanly.
    skill_discovery_names = [s.get("name", "") for s in real_skills if s.get("name")]
    inventory_parity = _compare_inventories(skill_discovery_names, graph)
    inventory_synced = bool(inventory_parity["in_sync"])

    # Determine status. Error if no skills. Otherwise degraded when any runtime
    # input surface is incomplete or malformed.
    if not real_skills:
        status = "error"
    elif (
        not graph_loaded
        or has_topology_warnings
        or not inventory_synced
        or not bool(cache_status.get("healthy"))
        or not bool(source_metadata.get("healthy"))
    ):
        status = "degraded"
    else:
        status = "ok"

    result = {
        "status": status,
        "skills_found": len(real_skills),
        "command_bridges_found": len(command_bridges),
        "skill_names": [s.get('name', 'unknown') for s in real_skills],
        "command_bridge_names": [s.get('name', 'unknown') for s in command_bridges],
        "skills_dir": SKILLS_DIR,
        "skills_dir_exists": os.path.exists(SKILLS_DIR),
        "cache": cache_status,
        "source_metadata": source_metadata,
        "skill_graph_loaded": graph_loaded,
        "skill_graph_source": _SKILL_GRAPH_SOURCE,
        "skill_graph_skill_count": graph.get("skill_count", 0) if graph else 0,
        "skill_graph_path": (
            SKILL_GRAPH_SQLITE_PATH
            if _SKILL_GRAPH_SOURCE == "sqlite"
            else SKILL_GRAPH_PATH
            if _SKILL_GRAPH_SOURCE == "json"
            else None
        ),
        "skill_graph_sqlite_path": SKILL_GRAPH_SQLITE_PATH,
        "skill_graph_json_path": SKILL_GRAPH_PATH,
        "topology_warnings": topology_warnings,
        "inventory_parity": inventory_parity,
    }

    if not graph_loaded:
        sqlite_path_exists = os.path.exists(SKILL_GRAPH_SQLITE_PATH)
        graph_path_exists = os.path.exists(SKILL_GRAPH_PATH)
        if sqlite_path_exists:
            result["skill_graph_error"] = "sqlite_unavailable"
        elif graph_path_exists:
            result["skill_graph_error"] = "sqlite_missing_json_ignored"
        else:
            result["skill_graph_error"] = "missing"

    return result


def analyze_prompt(
    prompt: str,
    confidence_threshold: float = DEFAULT_CONFIDENCE_THRESHOLD,
    uncertainty_threshold: float = DEFAULT_UNCERTAINTY_THRESHOLD,
    confidence_only: bool = False,
    show_rejections: bool = False,
) -> List[Dict[str, Any]]:
    """Analyze one prompt and apply requested filtering mode."""
    recommendations = analyze_request(prompt)
    return filter_recommendations(
        recommendations=recommendations,
        confidence_threshold=confidence_threshold,
        uncertainty_threshold=uncertainty_threshold,
        confidence_only=confidence_only,
        show_rejections=show_rejections,
    )


def analyze_batch(
    prompts: List[str],
    confidence_threshold: float,
    uncertainty_threshold: float,
    confidence_only: bool,
    show_rejections: bool,
) -> List[Dict[str, Any]]:
    """Analyze multiple prompts in a single process for lower overhead."""
    results = []
    for prompt in prompts:
        trimmed = prompt.strip()
        if not trimmed:
            continue

        results.append({
            "prompt": trimmed,
            "recommendations": analyze_prompt(
                prompt=trimmed,
                confidence_threshold=confidence_threshold,
                uncertainty_threshold=uncertainty_threshold,
                confidence_only=confidence_only,
                show_rejections=show_rejections,
            ),
        })
    return results


def resolve_single_prompt_input(args: argparse.Namespace, stdin: Any = sys.stdin) -> None:
    """Apply stdin modes without blocking tty sessions before argv fallback."""
    if args.stdin:
        args.prompt = stdin.read()
        return

    if args.stdin_preferred and not stdin.isatty():
        stdin_prompt = stdin.read()
        if stdin_prompt:
            args.prompt = stdin_prompt


def _warn_native_fallback(probe: Dict[str, Any]) -> None:
    """Make default native-to-local fallback visible without corrupting JSON stdout."""
    reason = probe.get("reason", "UNKNOWN")
    freshness = probe.get("freshness", "unavailable")
    print(
        f"Native advisor unavailable ({reason}; freshness={freshness}); falling back to local Python scorer.",
        file=sys.stderr,
    )


# ───────────────────────────────────────────────────────────────
# 6. CLI ENTRY POINT
# ───────────────────────────────────────────────────────────────

def main() -> int:
    """Parse CLI arguments and run the requested advisor mode."""
    parser = argparse.ArgumentParser(
        description='Analyze user requests and recommend appropriate skills.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python skill_advisor.py "how does authentication work"
  printf '%s' "how does authentication work" | python skill_advisor.py --stdin
  python skill_advisor.py "create a git commit" --threshold 0.8
  python skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
  python skill_advisor.py --batch-file prompts.txt
  cat prompts.txt | python skill_advisor.py --batch-stdin
  python skill_advisor.py --health
  python skill_advisor.py --validate-only
        '''
    )
    parser.add_argument('prompt', nargs='?', default='',
                        help='User request to analyze')
    parser.add_argument('--stdin', action='store_true',
                        help='Read the single prompt from stdin instead of process arguments.')
    parser.add_argument('--stdin-preferred', action='store_true',
                        help='Prefer stdin for single-prompt input and fall back to argv when stdin is empty.')
    parser.add_argument('--deep-skill-routing-json', action='store_true',
                        help='Read {"prompt": str, "packet_context": object} from stdin and emit Candidate-3 deep routing.')
    parser.add_argument('--dump-routing-maps', action='store_true',
                        help='Dump the hardcoded deep-loop-workflows routing projection maps as JSON (consumed by the registry drift-guard test).')
    parser.add_argument('--emit-routing-projection', action='store_true',
                        help='Regenerate embedded advisor routing projection constants from mode-registry.json.')
    parser.add_argument('--check-routing-projection', action='store_true',
                        help='Check embedded advisor routing projection constants without writing files.')
    parser.add_argument('--health', action='store_true',
                        help='Run health check diagnostics')
    parser.add_argument('--validate-only', action='store_true',
                        help='Run strict skill-graph validation and fail on topology issues.')
    parser.add_argument('--threshold', type=float, default=DEFAULT_CONFIDENCE_THRESHOLD,
                        help='Confidence threshold for recommendations (default: 0.8).')
    parser.add_argument('--uncertainty', type=float, default=DEFAULT_UNCERTAINTY_THRESHOLD,
                        help='Maximum uncertainty threshold for recommendations in dual-threshold mode (default: 0.35).')
    parser.add_argument('--confidence-only', action='store_true',
                        help='Use confidence-only filtering and bypass uncertainty checks explicitly.')
    parser.add_argument('--show-rejections', action='store_true',
                        help='Include recommendations that failed dual-threshold validation')
    parser.add_argument('--force-local', action='store_true',
                        help='Bypass native advisor_recommend and force the local Python scorer path.')
    parser.add_argument('--force-native', action='store_true',
                        help='Require native advisor_recommend; exit non-zero if the native path is unavailable.')
    parser.add_argument('--batch-file', type=str, default='',
                        help='Analyze prompts from file (one prompt per line) in one process.')
    parser.add_argument('--batch-stdin', action='store_true',
                        help='Analyze prompts from stdin (one prompt per line) in one process.')
    parser.add_argument('--force-refresh', action='store_true',
                        help='Force refresh of skill discovery cache before analysis.')

    args = parser.parse_args()

    if args.force_local and args.force_native:
        print(json.dumps({"error": "Use only one of --force-local or --force-native."}, indent=2))
        return 2

    if args.emit_routing_projection and args.check_routing_projection:
        print(json.dumps({"error": "Use only one of --emit-routing-projection or --check-routing-projection."}, indent=2))
        return 2

    if args.emit_routing_projection:
        return emit_routing_projection(check_only=False)

    if args.check_routing_projection:
        return emit_routing_projection(check_only=True)

    if args.force_refresh:
        get_skills(force_refresh=True)

    if args.deep_skill_routing_json:
        try:
            payload = json.loads(sys.stdin.read() or "{}")
        except json.JSONDecodeError as exc:
            print(json.dumps({"error": f"Invalid --deep-skill-routing-json payload: {exc}"}, indent=2))
            return 2
        if not isinstance(payload, dict):
            print(json.dumps({"error": "--deep-skill-routing-json payload must be an object"}, indent=2))
            return 2
        prompt = str(payload.get("prompt", ""))
        packet_context = payload.get("packet_context", {})
        if not isinstance(packet_context, dict):
            print(json.dumps({"error": "packet_context must be an object"}, indent=2))
            return 2
        print(json.dumps(deep_skill_routing_payload(prompt, packet_context), indent=2))
        return 0

    if args.dump_routing_maps:
        print(json.dumps({
            "DEEP_ROUTING_PROJECTION_HASH": DEEP_ROUTING_PROJECTION_HASH,
            "DEEP_ROUTING_SKILLS": list(DEEP_ROUTING_SKILLS),
            "DEEP_ROUTING_MODE_BY_KEY": dict(DEEP_ROUTING_MODE_BY_KEY),
            "PY_ALIAS_GROUP_KEYS": sorted(SKILL_ALIAS_GROUPS.keys()),
        }, indent=2))
        return 0

    if args.health:
        health = health_check()
        print(json.dumps(health, indent=2))
        return 0

    if args.validate_only:
        return run_skill_graph_validation(strict_topology=True)

    if sum(bool(value) for value in [args.batch_file, args.batch_stdin, args.stdin]) > 1:
        print(json.dumps({"error": "Use only one of --batch-file, --batch-stdin, or --stdin."}, indent=2))
        return 2

    if args.batch_file:
        try:
            with open(args.batch_file, 'r', encoding='utf-8') as handle:
                batch_prompts = [line.rstrip('\n') for line in handle]
        except OSError as exc:
            print(json.dumps({"error": f"Failed to read --batch-file: {exc}"}, indent=2))
            return 2

        print(json.dumps(analyze_batch(
            prompts=batch_prompts,
            confidence_threshold=args.threshold,
            uncertainty_threshold=args.uncertainty,
            confidence_only=args.confidence_only,
            show_rejections=args.show_rejections,
        ), indent=2))
        return 0

    if args.batch_stdin:
        batch_prompts = [line.rstrip('\n') for line in sys.stdin]
        print(json.dumps(analyze_batch(
            prompts=batch_prompts,
            confidence_threshold=args.threshold,
            uncertainty_threshold=args.uncertainty,
            confidence_only=args.confidence_only,
            show_rejections=args.show_rejections,
        ), indent=2))
        return 0

    resolve_single_prompt_input(args)

    if not args.prompt:
        print(json.dumps([]))
        return 0

    if os.environ.get(DISABLE_ADVISOR_ENV) == "1":
        if args.force_native:
            print(json.dumps({
                "error": "Native advisor unavailable",
                "reason": "ADVISOR_DISABLED",
                "freshness": "native-unavailable",
            }, indent=2))
            return 2
        print(json.dumps([]))
        return 0

    should_try_native = not args.force_local

    if should_try_native:
        probe = probe_native_advisor()
        if probe.get("available"):
            native_results = recommend_with_native_advisor(
                args.prompt,
                confidence_threshold=args.threshold,
                uncertainty_threshold=args.uncertainty,
                confidence_only=args.confidence_only,
            )
            if native_results is not None:
                print(json.dumps(native_results, indent=2))
                return 0
        elif args.force_native:
            print(json.dumps({
                "error": "Native advisor unavailable",
                "reason": probe.get("reason", "UNKNOWN"),
                "freshness": probe.get("freshness", "unavailable"),
            }, indent=2))
            return 2
        else:
            _warn_native_fallback(probe)

    if args.force_native:
        print(json.dumps({"error": "Native advisor unavailable", "reason": "NATIVE_CALL_FAILED"}, indent=2))
        return 2

    results = analyze_prompt(
        prompt=args.prompt,
        confidence_threshold=args.threshold,
        uncertainty_threshold=args.uncertainty,
        confidence_only=args.confidence_only,
        show_rejections=args.show_rejections,
    )

    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
