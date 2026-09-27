#!/usr/bin/env python3
"""Deem `/v1/systemone` server — typed, calibrated decisions over HTTP.

Wire-compatible with the System One API shape (SPEC §2): the official
``typesafe-sdk`` works drop-in against this endpoint (point it at the server
with ``TYPESAFE_BASE_URL``, decider-2b's distribution channel).

Implementation choice: **stdlib ``http.server`` + threading**.  FastAPI is
not installed in either project virtualenv (checked ``.venv`` and
``.venv-sft`` on 2026-09-21), and Deem's core readout is dependency-free
(``src/deem/format.py``), so the HTTP layer stays stdlib-only.  The
heavy backend (torch + transformers) is imported lazily and only when a
real checkpoint is configured — run it with the torch-enabled interpreter
(``.venv-sft``); the stub backend and all of serve/tests/ run anywhere.

Primitives (one request, many questions, all against the same state):

* **choice**  — pick from 2–255 options;
* **score**   — rate against 2–10 ordered levels;
* **noul**    — probability a proposition is true.

Answers carry probabilities, derived confidence ``(N*pmax-1)/(N-1)``
and per-question temperature scaling from a calibration file
(``scripts/sft/temperature_v4.json`` format: ``per_primitive`` +
``per_dataset`` temperatures, optionally nested under a version key).
The v6 format (``scripts/sft/calibration_v6.json``) is also accepted:
per-dataset entries may carry a per-class temperature vector, which is
applied in preference to the scalar fallback chain (per-dataset scalar,
then per-primitive, then 1.0); the reported ``temperature`` is the scalar
fallback.

Environment variables (flags override):

=====================  ==================================================
``DEEM_CHECKPOINT``  HF checkpoint dir; unset -> deterministic stub
``DEEM_CALIBRATION`` calibration JSON with per-primitive/dataset temps
``DEEM_CALIBRATION_KEY``  version key inside the calibration file
``DEEM_MODEL_ID``   served model id (default ``deem-1.5``)
``DEEM_HOST``       bind address (default ``127.0.0.1``)
``DEEM_PORT``       bind port (default ``8300``)
``DEEM_DEVICE``     ``cuda`` / ``cpu`` / ``auto`` (default ``auto``)
``DEEM_BATCH_SIZE`` forward-pass batch size (default 4)
``DEEM_MAX_QUESTIONS`` request question cap (default 64)
=====================  ==================================================

Run:

    DEEM_CHECKPOINT=scripts/sft/checkpoints/v4_17b \
    DEEM_CALIBRATION=scripts/sft/temperature_v4.json \
    DEEM_CALIBRATION_KEY=v4 \
        .venv-sft/bin/python serve/deem_server.py
"""

from __future__ import annotations

import argparse
import inspect as _inspect
import json
import math
import os
import sys
import threading
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Optional

# ---------------------------------------------------------------------------
# Make `deem` importable: installed editable in .venv, or from ../src.
_REPO_ROOT = Path(__file__).resolve().parents[1]
if _REPO_ROOT.name:  # pragma: no branch
    try:
        import deem  # noqa: F401
    except ImportError:
        sys.path.insert(0, str(_REPO_ROOT / "src"))
        import deem  # noqa: F401

from deem.format import (  # noqa: E402
    build_prompt,
    confidence_from_probabilities,
    marginalize_choice,
    marginalize_score,
    read_answers,
)
from deem.primitives import (  # noqa: E402
    MAX_LEVELS,
    MAX_OPTIONS,
    ChoiceQuestion,
    NoulQuestion,
    NoulResult,
    QuestionSet,
    DeemError,
    ScoreQuestion,
)

__all__ = [
    "StubBackend",
    "TorchBackend",
    "Calibration",
    "DeemCore",
    "make_server",
    "main",
]

#: docstring/config defaults
DEFAULT_MODEL_ID = "deem-1.5"
DEFAULT_PORT = 8300
MAX_BODY_BYTES = 8 * 1024 * 1024


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------


class RequestError(Exception):
    """Client-side problem (HTTP 4xx)."""

    def __init__(self, message: str, status: int = 400, code: str = "bad_request"):
        super().__init__(message)
        self.status = status
        self.code = code


class BackendError(Exception):
    """Model-side problem (HTTP 5xx)."""

    pass


# ---------------------------------------------------------------------------
# Backends — produce answer-slot letter logits
# ---------------------------------------------------------------------------


class StubBackend:
    """Deterministic stub: uniform letter logits (zeros).

    Probabilities are uniform over the valid letters for every question:
    choice/score confidence 0, noul value 0.5.  Usage token counts are a
    whitespace-token approximation (no tokenizer in the stub).
    """

    name = "stub"
    #: most letter logits this backend can produce
    max_letters = MAX_OPTIONS

    def slot_logits(self, prompts, n_valids):
        return [
            {"logits": [0.0] * n, "tokens": max(1, len(p.split()))}
            for p, n in zip(prompts, n_valids)
        ]


class TorchBackend:
    """Letter-slot forward pass on a fine-tuned HF checkpoint.

    Mirrors the eval readout byte-for-byte (``deem.training.consistency.
    predict_prompts`` / ``evaluate_v4.predict``): right-padded batch, no
    special tokens, letter logits read at the answer slot from the
    pretrained LM head rows, autocast bf16 on cuda.
    """

    name = "torch"
    max_letters = 26  # letters past Z are multi-token (see format.py notes)

    def __init__(self, checkpoint, device="auto", batch_size=4):
        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer
        except ImportError as exc:  # pragma: no cover
            raise BackendError(
                "torch backend requires torch + transformers; "
                "use the .venv-sft interpreter or unset DEEM_CHECKPOINT"
            ) from exc
        self._torch = torch
        self.checkpoint = str(checkpoint)
        self.batch_size = max(1, int(batch_size))
        if device == "auto":
            device = "cuda" if torch.cuda.is_available() else "cpu"
        self.device = device
        self.tokenizer = AutoTokenizer.from_pretrained(self.checkpoint)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.checkpoint, dtype=torch.bfloat16
        )
        self.model.to(device)
        self.model.eval()
        self._letter_ids = torch.tensor(
            [
                self.tokenizer.encode(chr(ord("A") + i), add_special_tokens=False)[0]
                for i in range(self.max_letters)
            ],
            device=device,
        )
        self._pad_id = (
            self.tokenizer.pad_token_id
            if self.tokenizer.pad_token_id is not None
            else (self.tokenizer.eos_token_id or 0)
        )
        self._lock = threading.Lock()

    def _forward(self, encoded_batch):
        """One padded forward pass -> list of per-row letter-logit vectors."""
        torch = self._torch
        max_len = max(len(ids) for ids in encoded_batch)
        input_ids = torch.full(
            (len(encoded_batch), max_len), self._pad_id, dtype=torch.long
        )
        for j, ids in enumerate(encoded_batch):
            input_ids[j, : len(ids)] = torch.tensor(ids, dtype=torch.long)
        input_ids = input_ids.to(self.device)
        with torch.autocast(
            self.device, dtype=torch.bfloat16, enabled=self.device.startswith("cuda")
        ):
            hidden = self.model.model(input_ids=input_ids).last_hidden_state
        out = []
        for j, ids in enumerate(encoded_batch):
            logits = self.model.lm_head(hidden[j, len(ids) - 1, :]).float()
            out.append(logits.index_select(0, self._letter_ids).tolist())
        return out

    def slot_logits(self, prompts, n_valids):
        for n in n_valids:
            if n > self.max_letters:
                raise RequestError(
                    f"this backend reads at most {self.max_letters} letter "
                    f"logits (single-token letters); got a question with {n} "
                    f"options",
                    code="unsupported_option_count",
                )
        encoded = [
            self.tokenizer.encode(p, add_special_tokens=False) for p in prompts
        ]
        results = []
        with self._lock:
            for i in range(0, len(encoded), self.batch_size):
                results.extend(self._forward(encoded[i : i + self.batch_size]))
        return [
            {"logits": logits, "tokens": len(ids)}
            for ids, logits in zip(encoded, results)
        ]


class EnsembleBackend:
    """Geometric (logit-space) ensemble of several backends.

    Each member's answer-slot logits are softened to probabilities and
    blended in log space: ``q ∝ exp(Σ_k w_k log softmax(z_k))`` — the
    distribution blend validated on JevBench (see RESULTS_LEDGER
    2026-09-23). Weight-space interpolation underperforms this blend by
    3.6 hard points, so the ensemble is served, not merged.

    ``members`` are ``(TorchBackend, weight)`` pairs; weights need not
    sum to 1 (they are normalized).

    When the caller supplies ``groups`` (DeemCore with
    ``DEEM_N_ORDERS > 1``), each member first averages its option-order
    distributions in original option space and the members' averaged
    distributions are then blended — the exact formula the JevBench
    numbers were measured with (average-then-blend, not blend-then-
    average; the two differ by 1 hard item).
    """

    def __init__(self, members):
        if not members:
            raise BackendError("EnsembleBackend needs at least one member")
        total = sum(w for _, w in members)
        self.members = [(b, w / total) for b, w in members]
        self.name = "ensemble:" + "+".join(
            f"{getattr(b, 'name', 'custom')}" for b, _ in self.members
        )
        self.max_letters = min(
            getattr(b, "max_letters", 26) for b, _ in self.members
        )

    @staticmethod
    def _geo_blend(dists, weights):
        import math as _math

        blended = [0.0] * len(dists[0])
        for dist, w in zip(dists, weights):
            for j, p in enumerate(dist):
                blended[j] += w * _math.log(max(p, 1e-12))
        return blended  # log-space; softmax recovers the blend

    @staticmethod
    def _softmax(logits):
        import math as _math

        m = max(logits)
        exps = [_math.exp(x - m) for x in logits]
        return [e / sum(exps) for e in exps]

    def slot_logits(self, prompts, n_valids, groups=None):
        import math as _math

        per_member = [
            (weight, backend.slot_logits(prompts, n_valids))
            for backend, weight in self.members
        ]
        out = []
        if groups is None:
            for i, _ in enumerate(prompts):
                n = n_valids[i]
                blended = [0.0] * n
                for weight, slots in per_member:
                    logits = slots[i]["logits"][:n]
                    probs = self._softmax(logits)
                    for j in range(n):
                        blended[j] += weight * _math.log(max(probs[j], 1e-12))
                out.append({"logits": blended, "tokens": per_member[0][1][i]["tokens"]})
            return out
        # group-aware: per member, average option orders in original
        # option space; then blend members (average-then-blend)
        for group in groups:
            start, n_orders, n, perms = (
                group["start"], group["n_orders"], group["n_valid"], group["perms"]
            )
            member_dists = []
            for weight, slots in per_member:
                order_dists = []
                for oi in range(n_orders):
                    logits = slots[start + oi]["logits"][:n]
                    probs = self._softmax(logits)
                    perm = perms[oi]
                    if perm is not None:
                        remapped = [0.0] * n
                        for displayed, original in enumerate(perm):
                            remapped[original] = probs[displayed]
                        probs = remapped
                    order_dists.append(probs)
                member_dists.append(
                    [
                        sum(od[i] for od in order_dists) / n_orders
                        for i in range(n)
                    ]
                )
            weights = [w for w, _ in per_member]
            blended = self._geo_blend(member_dists, weights)
            out.append(
                {"logits": blended, "tokens": per_member[0][1][start]["tokens"]}
            )
        return out



# ---------------------------------------------------------------------------
# Calibration — per-dataset / per-primitive temperature scaling
# ---------------------------------------------------------------------------


class Calibration:
    """Temperature lookup: dataset wins over primitive, default 1.0.

    Accepted file shapes:

    1. ``{"per_primitive": {"choice": {"temperature": t}, ...},
        "per_dataset":  {"ag_news": {"temperature": t}, ...}}``
    2. The emitted ``temperature_v*.json`` form, i.e. the same structure
        nested under version keys (``{"v4": {...}}``); pick one with
        ``key`` or the first one found.
    3. Flat: ``{"choice": t, "noul": t, "score": t}``.

    The v6 format (``calibration_v6.json``) is also accepted: per-dataset
    entries may additionally carry a ``calibrator`` spec with a per-class
    temperature vector (``{"kind": "per_class_temperature",
    "temperatures": [...]}``).  When one is available, probabilities are
    computed with per-class temperatures; the fallback chain is:

    1. per-class temperatures (v6 ``calibrator`` on the dataset entry),
    2. scalar per-dataset temperature,
    3. scalar per-primitive temperature,
    4. 1.0.

    ``temperature_for`` always returns the scalar view of that chain
    (steps 2–4); ``class_temperatures_for`` returns the step-1 vector or
    ``None``.
    """

    def __init__(self, primitive_temps=None, dataset_temps=None,
                 dataset_class_temps=None):
        self.primitive_temps = dict(primitive_temps or {})
        self.dataset_temps = dict(dataset_temps or {})
        self.dataset_class_temps = {
            name: list(temps)
            for name, temps in (dataset_class_temps or {}).items()
        }
        for mapping in (self.primitive_temps, self.dataset_temps):
            for name, value in mapping.items():
                if not (value > 0) or not math.isfinite(value):
                    raise BackendError(
                        f"invalid calibration temperature for {name!r}: {value}"
                    )
        for name, temps in self.dataset_class_temps.items():
            for value in temps:
                if not (value > 0) or not math.isfinite(value):
                    raise BackendError(
                        f"invalid per-class calibration temperature for "
                        f"{name!r}: {value}"
                    )

    @classmethod
    def from_file(cls, path, key=None):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return cls.from_dict(data, key=key)

    @classmethod
    def from_dict(cls, data, key=None):
        if not isinstance(data, dict):
            raise BackendError("calibration must be a JSON object")
        if "per_primitive" not in data and "per_dataset" not in data:
            # shape 2: versioned wrapper (temperature_v4.json,
            # calibration_v6.json)
            nested = [
                v
                for v in data.values()
                if isinstance(v, dict)
                and ("per_primitive" in v or "per_dataset" in v)
            ]
            if nested:
                if key is not None:
                    if key not in data:
                        raise BackendError(
                            f"calibration key {key!r} not found in file"
                        )
                    data = data[key]
                else:
                    data = nested[0]
            else:
                # shape 3: flat primitive mapping
                return cls(primitive_temps=cls._parse_flat(data))
        primitive = cls._parse_nested(data.get("per_primitive"))
        dataset = cls._parse_nested(data.get("per_dataset"))
        class_temps = cls._parse_class_temps(data.get("per_dataset"))
        return cls(
            primitive_temps=primitive,
            dataset_temps=dataset,
            dataset_class_temps=class_temps,
        )

    @staticmethod
    def _parse_flat(data):
        out = {}
        for name, value in data.items():
            out[name] = float(value) if not isinstance(value, dict) else (
                float(value.get("temperature", 1.0))
            )
        return out

    @staticmethod
    def _parse_nested(mapping):
        out = {}
        if not mapping:
            return out
        for name, value in mapping.items():
            if isinstance(value, dict):
                value = value.get("temperature", 1.0)
            out[name] = float(value)
        return out

    @staticmethod
    def _parse_class_temps(mapping):
        """Extract v6 per-class temperature vectors from a per_dataset map."""
        out = {}
        if not mapping:
            return out
        for name, entry in mapping.items():
            if not isinstance(entry, dict):
                continue
            spec = entry.get("calibrator")
            if not isinstance(spec, dict):
                continue
            if spec.get("kind") != "per_class_temperature":
                continue
            temps = spec.get("temperatures")
            if not isinstance(temps, list) or not temps:
                raise BackendError(
                    f"invalid per-class calibrator for {name!r}: "
                    "temperatures must be a non-empty list"
                )
            out[name] = [float(t) for t in temps]
        return out

    def temperature_for(self, primitive, dataset=None):
        if dataset and dataset in self.dataset_temps:
            return self.dataset_temps[dataset]
        return self.primitive_temps.get(primitive, 1.0)

    def class_temperatures_for(self, dataset, n_valid):
        """Per-class temperature vector for a question, or None.

        Only v6 per-dataset calibrators apply, and only when the vector
        length matches the question's valid-answer count (otherwise the
        scalar fallback chain is used).
        """
        if not dataset:
            return None
        temps = self.dataset_class_temps.get(dataset)
        if temps is None or len(temps) != n_valid:
            return None
        return temps


# ---------------------------------------------------------------------------
# Request parsing
# ---------------------------------------------------------------------------

QUESTION_TYPES = ("choice", "score", "noul")


def _require_str(value, what):
    if not isinstance(value, str) or not value:
        raise RequestError(f"{what} must be a non-empty string")
    return value


def parse_question(qid, spec):
    """Parse one question spec -> (question object, primitive, dataset)."""
    if not isinstance(spec, dict):
        raise RequestError(f"question {qid!r} must be an object")
    qtype = spec.get("type")
    if qtype not in QUESTION_TYPES:
        raise RequestError(
            f"question {qid!r} has invalid type {qtype!r}; "
            f"expected one of {', '.join(QUESTION_TYPES)}"
        )
    instructions = spec.get("instructions")
    dataset = spec.get("dataset")
    if dataset is not None and not isinstance(dataset, str):
        raise RequestError(f"question {qid!r} dataset must be a string")
    try:
        if qtype == "choice":
            options = spec.get("options")
            if not isinstance(options, list):
                raise RequestError(f"question {qid!r} needs an options list")
            question = ChoiceQuestion(
                instructions=instructions, options=options
            )
        elif qtype == "score":
            levels = spec.get("levels")
            if not isinstance(levels, list):
                raise RequestError(f"question {qid!r} needs a levels list")
            question = ScoreQuestion(instructions=instructions, levels=levels)
        else:
            question = NoulQuestion(instructions=instructions)
    except (DeemError, TypeError) as exc:
        raise RequestError(f"question {qid!r}: {exc}") from exc
    return question, qtype, dataset


def parse_questions(payload):
    """Parse the request `questions` field -> ordered [(qid, question, type, dataset)]."""
    questions = payload.get("questions", None)
    if questions is None or (
        isinstance(questions, dict) and not questions
    ):
        raise RequestError("'questions' must contain at least one question")
    if isinstance(questions, dict):
        items = list(questions.items())
    elif isinstance(questions, list):
        items = []
        for spec in questions:
            if not isinstance(spec, dict):
                raise RequestError("question entries must be objects")
            qid = spec.get("id", spec.get("qid"))
            if qid is None:
                raise RequestError("list-form questions need an 'id' field")
            items.append((qid, spec))
    else:
        raise RequestError("'questions' must be an object or a list")
    default_dataset = payload.get("dataset")
    if default_dataset is not None and not isinstance(default_dataset, str):
        raise RequestError("'dataset' must be a string")
    parsed = []
    seen = set()
    for qid, spec in items:
        if not isinstance(qid, str) or not qid:
            raise RequestError("question ids must be non-empty strings")
        if qid in seen:
            raise RequestError(f"duplicate question id {qid!r}")
        seen.add(qid)
        question, qtype, dataset = parse_question(qid, spec)
        parsed.append((qid, question, qtype, dataset or default_dataset))
    return parsed


# ---------------------------------------------------------------------------
# Core — shared by the HTTP server and the MCP server
# ---------------------------------------------------------------------------


def _serialize_answer(result, qtype, temperature):
    if qtype == "choice":
        return {
            "type": "choice",
            "choice": result.choice,
            "probabilities": dict(result.probabilities),
            "confidence": result.confidence,
            "temperature": temperature,
        }
    if qtype == "score":
        return {
            "type": "score",
            "level": result.level,
            "probabilities": dict(result.probabilities),
            "expected": result.expected,
            "confidence": result.confidence,
            "temperature": temperature,
        }
    value = float(result.value)
    # Confidence for noul: the same derived formula applied to the binary
    # {p, 1-p} distribution -> 2*pmax - 1.
    confidence = 2.0 * max(value, 1.0 - value) - 1.0
    return {
        "type": "noul",
        "value": value,
        "confidence": confidence,
        "temperature": temperature,
    }


class DeemCore:
    """The shared readout: state + typed questions -> typed answers.

    Per-question isolation (SPEC §3): each question is rendered as its own
    single-question prompt, batched through the backend in one call.

    ``n_orders > 1`` additionally reads every choice question under
    ``n_orders`` deterministic option orderings (identity first, then
    seeded shuffles shared across models) and probability-averages the
    results in original option space — the two-order readout validated
    on JevBench (reflex-style order averaging).
    """

    def __init__(self, backend, calibration=None, model_id=DEFAULT_MODEL_ID,
                 max_questions=64, n_orders=1):
        self.backend = backend
        self.calibration = calibration or Calibration()
        self.model_id = model_id
        self.max_questions = max_questions
        self.n_orders = max(1, int(n_orders))

    @property
    def backend_name(self):
        return getattr(self.backend, "name", "custom")

    def decide(self, state, questions_payload, default_dataset=None):
        """Build + decode one /v1/systemone request body -> answers dict."""
        from deem.format import permute_question

        parsed = parse_questions(
            {"questions": questions_payload, "dataset": default_dataset}
        )
        if len(parsed) > self.max_questions:
            raise RequestError(
                f"request exceeds the {self.max_questions}-question cap"
            )
        # One prompt per (question, order) — per-question isolation, with
        # choice questions repeated under n_orders option orderings.
        order_perms = []  # per question: list of perms (None = identity)
        prompts = []
        for qid, question, qtype, _ in parsed:
            if qtype == "choice" and self.n_orders > 1:
                perms = [None] + [
                    permute_question(question, f"{qid}:{k}")
                    for k in range(1, self.n_orders)
                ]
            else:
                perms = [None]
            order_perms.append(perms)
            for perm in perms:
                prompts.append(
                    build_prompt(
                        state,
                        QuestionSet({qid: question}),
                        permutations={qid: perm} if perm else None,
                    )
                )
        n_valids = [
            2 if qtype == "noul"
            else len(getattr(question, "options", None) or question.levels)
            for _, question, qtype, _ in parsed
        ]
        # count prompts per question
        counts = [len(p) for p in order_perms]
        slot_n_valids = []
        for n, c in zip(n_valids, counts):
            slot_n_valids.extend([n] * c)

        # Feature-detect group-aware backends (EnsembleBackend): they
        # average option orders per member and blend afterwards — the
        # exact formula the JevBench numbers were measured with.
        groups = None
        try:
            accepts_groups = "groups" in _inspect.signature(
                self.backend.slot_logits
            ).parameters
        except (TypeError, ValueError):
            accepts_groups = False
        if accepts_groups:
            groups = [
                {
                    "start": sum(counts[:i]),
                    "n_orders": len(order_perms[i]),
                    "n_valid": n_valids[i],
                    "perms": order_perms[i],
                }
                for i in range(len(parsed))
            ]

        if accepts_groups:
            slots = self.backend.slot_logits(
                prompts, slot_n_valids, groups=groups
            )
        else:
            slots = self.backend.slot_logits(prompts, slot_n_valids)
        answers = {}
        total_tokens = 0
        idx = 0
        for i, ((qid, question, qtype, dataset), perms) in enumerate(
            zip(parsed, order_perms)
        ):
            if groups is not None:
                order_slots = [slots[i]]
                read_perms = [None]
            else:
                order_slots = slots[idx : idx + len(perms)]
                idx += len(perms)
                read_perms = perms
            temperature = self.calibration.temperature_for(qtype, dataset)
            class_temps = self.calibration.class_temperatures_for(
                dataset, n_valids[i]
            )
            results = []
            for perm, slot in zip(read_perms, order_slots):
                logits = slot["logits"][: n_valids[i]]
                if class_temps is not None:
                    logits = [x / t for x, t in zip(logits, class_temps)]
                    readout_temperature = 1.0
                else:
                    readout_temperature = temperature
                result = read_answers(
                    {"1": logits},
                    QuestionSet({qid: question}),
                    permutations={qid: perm} if perm else None,
                    temperature=readout_temperature,
                )[qid]
                results.append(result)
            total_tokens += order_slots[0]["tokens"]
            if len(results) == 1:
                result = results[0]
            elif qtype == "choice":
                result = marginalize_choice(results)
            elif qtype == "score":
                result = marginalize_score(results)
            else:
                value = sum(r.value for r in results) / len(results)
                result = NoulResult(value=value)
            answers[qid] = _serialize_answer(result, qtype, temperature)
        return {
            "answers": answers,
            "usage": {
                "prompt_tokens": total_tokens,
                "completion_tokens": 0,
                "total_tokens": total_tokens,
                "questions": len(parsed),
            },
        }

    def health(self):
        return {
            "status": "ok",
            "model": self.model_id,
            "backend": self.backend_name,
        }


# ---------------------------------------------------------------------------
# HTTP layer (stdlib)
# ---------------------------------------------------------------------------


class DeemHandler(BaseHTTPRequestHandler):
    server_version = "deem-serve/0.1"
    protocol_version = "HTTP/1.1"
    core: DeemCore = None  # type: ignore[assignment]

    @classmethod
    def with_core(cls, core):
        return type("BoundDeemHandler", (cls,), {"core": core})

    def log_message(self, format, *args):  # noqa: A002
        if os.environ.get("DEEM_ACCESS_LOG"):
            sys.stderr.write(
                "%s - - [%s] %s\n"
                % (self.address_string(), self.log_date_time_string(),
                   format % args)
            )

    # -- helpers ---------------------------------------------------------

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(body)

    def _send_error(self, status, message, code="error"):
        self._send_json(
            status,
            {"error": {"message": message, "type": code, "code": code}},
        )

    def _read_body(self):
        length = self.headers.get("Content-Length")
        if length is None:
            raise RequestError("Content-Length required", code="missing_length")
        try:
            length = int(length)
        except ValueError:
            raise RequestError("invalid Content-Length") from None
        if length > MAX_BODY_BYTES:
            raise RequestError("request body too large", 413, "body_too_large")
        return self.rfile.read(length)

    # -- routing ---------------------------------------------------------

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0].rstrip("/") or "/"
        if path == "/health":
            self._send_json(200, self.core.health())
        elif path == "/v1/models":
            self._send_json(
                200,
                {
                    "object": "list",
                    "data": [
                        {
                            "id": self.core.model_id,
                            "object": "model",
                            "created": 0,
                            "owned_by": "deem",
                        }
                    ],
                },
            )
        elif path == "/v1/systemone":
            self._send_error(405, "POST to /v1/systemone", "method_not_allowed")
        else:
            self._send_error(404, f"no such endpoint: {path}", "not_found")

    def do_POST(self):
        path = self.path.split("?", 1)[0].rstrip("/") or "/"
        if path != "/v1/systemone":
            self._send_error(404, f"no such endpoint: {path}", "not_found")
            return
        try:
            raw = self._read_body()
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise RequestError(f"invalid JSON body: {exc}") from None
            if not isinstance(payload, dict):
                raise RequestError("request body must be a JSON object")
            state = payload.get("state", None)
            if "state" not in payload:
                raise RequestError("'state' is required")
            try:
                json.dumps(state)
            except (TypeError, ValueError):
                raise RequestError("'state' must be JSON-serializable") from None
            result = self.core.decide(
                state, payload.get("questions"), payload.get("dataset")
            )
            response = {
                "id": f"deem-{uuid.uuid4().hex[:24]}",
                "object": "systemone.completion",
                "created": int(time.time()),
                "model": self.core.model_id,
                "answers": result["answers"],
                "usage": result["usage"],
            }
            self._send_json(200, response)
        except RequestError as exc:
            self._send_error(exc.status, str(exc), exc.code)
        except BackendError as exc:
            self._send_error(500, str(exc), "backend_error")
        except Exception as exc:  # pragma: no cover
            self._send_error(500, f"internal error: {exc}", "internal_error")


def make_server(core, host="127.0.0.1", port=0):
    """Build a ThreadingHTTPServer bound to core (port=0 -> ephemeral)."""
    handler = DeemHandler.with_core(core)
    server = ThreadingHTTPServer((host, port), handler)
    server.daemon_threads = True
    return server


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Deem /v1/systemone server (stdlib http + threading)"
    )
    parser.add_argument("--host", default=os.environ.get("DEEM_HOST", "127.0.0.1"))
    parser.add_argument(
        "--port", type=int,
        default=int(os.environ.get("DEEM_PORT", DEFAULT_PORT))
    )
    parser.add_argument(
        "--model-id", default=os.environ.get("DEEM_MODEL_ID", DEFAULT_MODEL_ID)
    )
    parser.add_argument(
        "--checkpoint", default=os.environ.get("DEEM_CHECKPOINT", ""),
        help="HF checkpoint dir (default: deterministic stub backend)",
    )
    parser.add_argument(
        "--calibration", default=os.environ.get("DEEM_CALIBRATION", ""),
        help="calibration JSON with per-dataset/primitive temperatures",
    )
    parser.add_argument(
        "--calibration-key",
        default=os.environ.get("DEEM_CALIBRATION_KEY"),
        help="version key inside the calibration file",
    )
    parser.add_argument(
        "--device", default=os.environ.get("DEEM_DEVICE", "auto"),
        help="cuda | cpu | auto",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=int(os.environ.get("DEEM_BATCH_SIZE", "4")),
    )
    args = parser.parse_args(argv)

    if args.checkpoint:
        # Comma-separated ensemble: "ckptA:0.5,ckptB:0.5" blends the
        # members' answer-slot distributions in log space (EnsembleBackend).
        entries = [
            part.split(":") for part in args.checkpoint.split(",") if part
        ]
        backend = None
        if len(entries) == 1:
            backend = TorchBackend(
                entries[0][0], device=args.device, batch_size=args.batch_size
            )
        else:
            # entries: list of [path] or [path, weight]
            members = [
                (
                    TorchBackend(e[0], device=args.device,
                                 batch_size=args.batch_size),
                    float(e[1]) if len(e) > 1 else 1.0,
                )
                for e in entries
            ]
            backend = EnsembleBackend(members)
    else:
        print(
            "[deem] DEEM_CHECKPOINT not set: using deterministic stub "
            "(uniform logits)",
            file=sys.stderr,
        )
        backend = StubBackend()
    n_orders = int(os.environ.get("DEEM_N_ORDERS", "1"))
    calibration = Calibration()
    if args.calibration:
        calibration = Calibration.from_file(
            args.calibration, key=args.calibration_key
        )
    core = DeemCore(
        backend,
        calibration=calibration,
        model_id=args.model_id,
        max_questions=int(
            os.environ.get("DEEM_MAX_QUESTIONS", "64")
        ),
        n_orders=n_orders,
    )
    server = make_server(core, args.host, args.port)
    print(
        f"[deem] model={args.model_id} backend={core.backend_name} "
        f"listening on http://{args.host}:{args.port}/v1/systemone",
        file=sys.stderr,
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
