"""Deem prompt format: the letter-slot cross-encoder format.

This module renders the canonical Deem prompt and decodes answer-slot
logits back into typed, calibrated results.  Everything else in the repo
(training, teacher distillation, eval) depends on this format, so it is:

* **Deterministic** — the same inputs always render byte-identical prompts
  (JSON state is serialized canonically with sorted keys), enabling exact
  round-trips, caching and prompt hashing (:func:`prompt_hash`).
* **Dependency-free** — Python 3.10 stdlib only.

Prompt layout (see the canonical snapshot in ``tests/helpers.py``)::

    <state>
    {"compact": "json with sorted keys"}
    </state>

    Question 1: {instructions}
    Options:
    (A) {option}
    (B) {option}
    Answer 1: (

    Question 2: {noul instructions}
    Answer 2: (

The trailing ``Answer k: (`` is the answer *slot*: generation stops there and
the hidden state at that position is read out against the option-letter rows
of the pretrained LM head (per-question isolation — one row per question).

Option letters are spreadsheet-style bijective base-26: ``A``–``Z``, then
``AA``, ``AB`` ... up to the documented cardinality cap of 255 options
(indices 0..254).  Decoding only ever softmaxes over *valid* letters, so
logit vectors may be full LM-head rows — extra positions are ignored.

Design-review notes (glm-5.3-flash-thinking + deepseek-v4.1-flash-thinking,
2026-09-20), for the training lane that consumes this format:

* **String states are JSON-serialized too**, never embedded verbatim, and
  angle brackets inside state content are escaped (``<`` -> ``\\u003c``).
  Verbatim strings allowed prompt injection (state text containing
  ``</state>`` or a forged ``Answer k: (``) and fragmented the state prefix,
  defeating KV-cache reuse across the per-question rows.
* ``ensure_ascii`` is pinned to ``False`` and float formatting delegated to
  ``json.dumps`` — training and serving must use one serialization, byte
  for byte.
* **Tokenizer caveats to verify empirically per backbone, before training:**
  letters past ``Z`` (``AA``...) are multi-token and some two-letter strings
  collide with real vocabulary merges (e.g. ``AI``), so the >26-option
  regime needs its readout rows checked, not assumed; vocabs may merge
  ``(A`` so the row sitting at the slot boundary must be mapped per
  tokenizer, not assumed to be bare ``A``; ``add_special_tokens`` (BOS/EOS)
  must be pinned identically at train and serve time so the readout
  position is stable.
* Suggested (deferred): an explicit per-question type marker in the slot
  (e.g. ``Answer k (choice): (``) was raised as a training-signal aid; the
  uniform ``Answer k: (`` is kept for wire simplicity. Option-order
  randomization is supported via :func:`permute_question`.
"""

from __future__ import annotations

import hashlib
import json
import math
import random
from typing import (
    Iterable,
    Mapping,
    Optional,
    Sequence,
    Union,
)

from .primitives import (
    MAX_OPTIONS,
    ChoiceQuestion,
    ChoiceResult,
    NoulQuestion,
    NoulResult,
    QuestionSet,
    ScoreQuestion,
    ScoreResult,
)

__all__ = [
    "MAX_OPTIONS",
    "LETTERS",
    "LETTER_INDEX",
    "letter_for_index",
    "index_for_letter",
    "render_state",
    "build_prompt",
    "prompt_hash",
    "read_answers",
    "permute_question",
    "marginalize",
    "marginalize_choice",
    "marginalize_score",
    "confidence_from_probabilities",
    "softmax",
    "sigmoid",
]

State = Union[str, Mapping, Sequence, int, float, bool, None]


# ---------------------------------------------------------------------------
# Option letters (spreadsheet-style bijective base-26)
# ---------------------------------------------------------------------------


def letter_for_index(index: int) -> str:
    """Return the 0-based option letter: 0 -> ``A`` ... 25 -> ``Z``,
    26 -> ``AA``, 27 -> ``AB`` ... 254 -> ``IU`` (the 255-option cap)."""
    if isinstance(index, bool) or not isinstance(index, int):
        raise TypeError(f"index must be int, got {type(index).__name__}")
    if index < 0:
        raise ValueError(f"index must be non-negative, got {index}")
    if index >= MAX_OPTIONS:
        raise ValueError(
            f"option index {index} exceeds the documented cardinality cap "
            f"of {MAX_OPTIONS} options"
        )
    letters = []
    n = index + 1
    while n:
        n, rem = divmod(n - 1, 26)
        letters.append(chr(ord("A") + rem))
    return "".join(reversed(letters))


def index_for_letter(letter: str) -> int:
    """Reverse of :func:`letter_for_index`."""
    if not isinstance(letter, str):
        raise TypeError(f"letter must be str, got {type(letter).__name__}")
    if not letter:
        raise ValueError("letter must be non-empty")
    index = 0
    for ch in letter:
        if not ("A" <= ch <= "Z"):
            raise ValueError(f"invalid letter {letter!r}")
        index = index * 26 + (ord(ch) - ord("A") + 1)
    index -= 1
    if index >= MAX_OPTIONS:
        raise ValueError(f"letter {letter!r} exceeds the cap of {MAX_OPTIONS} options")
    return index


#: All valid option letters, in index order: ``("A", ..., "IU")``.
LETTERS: tuple = tuple(letter_for_index(i) for i in range(MAX_OPTIONS))

#: Reverse mapping letter -> option index.
LETTER_INDEX: dict = {letter: i for i, letter in enumerate(LETTERS)}


# ---------------------------------------------------------------------------
# Numerics
# ---------------------------------------------------------------------------


def softmax(logits: Sequence, temperature: float = 1.0) -> list:
    """Numerically stable softmax with temperature. Empty input is an error."""
    if not isinstance(temperature, (int, float)) or isinstance(temperature, bool):
        raise TypeError("temperature must be a number")
    if temperature <= 0:
        raise ValueError(f"temperature must be positive, got {temperature}")
    if len(logits) == 0:
        raise ValueError("softmax of an empty vector is undefined")
    scaled = [x / temperature for x in logits]
    m = max(scaled)
    exps = [math.exp(x - m) for x in scaled]
    total = sum(exps)
    return [e / total for e in exps]


def sigmoid(x: float) -> float:
    """Numerically stable logistic function."""
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    z = math.exp(x)
    return z / (1.0 + z)


def confidence_from_probabilities(probabilities: Sequence) -> float:
    """Derived confidence ``(N * pmax - 1) / (N - 1)``.

    0 for a uniform distribution, 1 for a point mass.  Defined as 1.0 when
    there are 0 or 1 probabilities (no uncertainty over the choice set).
    """
    n = len(probabilities)
    if n <= 1:
        return 1.0
    return (n * max(probabilities) - 1.0) / (n - 1.0)


# ---------------------------------------------------------------------------
# Prompt rendering
# ---------------------------------------------------------------------------

STATE_OPEN = "<state>"
STATE_CLOSE = "</state>"


def _harden(text: str) -> str:
    """Escape angle brackets in serialized state so content can never forge
    the ``</state>`` delimiter (prompt-injection hardening). ``\\u003c`` is a
    valid JSON escape that decodes back to the same character."""
    return text.replace("<", "\\u003c").replace(">", "\\u003e")


def render_state(state: State) -> str:
    """Render the state block body.

    Every state — strings included — is serialized as canonical JSON with a
    single code path: sorted keys, compact separators, ``ensure_ascii=False``
    (pinned: raw UTF-8, never the ``\\uXXXX`` surrogate form, so tokenization
    is stable train-to-serve), then hardened against delimiter injection.

    Serializing string states through JSON too (rather than embedding them
    verbatim) means newlines and angle brackets in state text can never
    spoof the ``</state>`` tag or a forged ``Answer k: (`` slot, and every
    state shares one byte-identical serialization for prefix/KV-cache reuse.
    """
    try:
        serialized = json.dumps(
            state, sort_keys=True, separators=(",", ":"), ensure_ascii=False
        )
    except TypeError as exc:
        raise TypeError(
            f"state must be a str or JSON-serializable, got: {exc}"
        ) from None
    return _harden(serialized)


def _validate_permutation(perm: Sequence, n: int, qid: str) -> list:
    if isinstance(perm, str) or not isinstance(perm, (list, tuple)):
        raise TypeError(f"permutation for {qid!r} must be a list of option indices")
    perm = list(perm)
    if sorted(perm) != list(range(n)):
        raise ValueError(
            f"permutation for {qid!r} is not a permutation of 0..{n - 1}"
        )
    return perm


def _displayed_labels(question, qid: str, perm: Optional[Sequence]) -> list:
    labels = (
        question.options
        if isinstance(question, ChoiceQuestion)
        else question.levels
        if isinstance(question, ScoreQuestion)
        else None
    )
    if labels is None:
        if perm is not None:
            raise ValueError(
                f"permutation given for {qid!r}, which has no options"
            )
        return []
    if perm is None:
        return list(labels)
    perm = _validate_permutation(perm, len(labels), qid)
    return [labels[i] for i in perm]


def build_prompt(
    state: State,
    question_set: QuestionSet,
    permutations: Optional[Mapping] = None,
) -> str:
    """Render the canonical Deem prompt.

    :param state: the decision state — a string or any JSON-serializable
      value; all states go through one canonical JSON path (see
      :func:`render_state`).
    :param question_set: the :class:`~deem.primitives.QuestionSet`.  The
      insertion order fixes the question indices: the *k*-th question
      (1-based) is rendered with slot ``Answer k: (``.
    :param permutations: optional mapping of question id -> permutation.  A
      permutation ``p`` is a list of option indices such that displayed
      position ``i`` shows original option ``options[p[i]]``.  Use
      :func:`permute_question` to draw permutations; pass the same mapping to
      :func:`read_answers` so probabilities land back in original-option
      space.
    :returns: the prompt string.  It ends with the final ``Answer k: (`` —
      no trailing newline — so generation continues directly in the slot.
    """
    if not isinstance(question_set, QuestionSet):
        raise TypeError(
            f"question_set must be a QuestionSet, got {type(question_set).__name__}"
        )
    permutations = dict(permutations) if permutations else {}

    lines = [STATE_OPEN, render_state(state), STATE_CLOSE]
    for k, (qid, question) in enumerate(question_set.items(), start=1):
        lines.append("")
        lines.append(f"Question {k}: {question.instructions}")
        labels = _displayed_labels(question, qid, permutations.get(qid))
        if labels:
            lines.append("Options:")
            for i, label in enumerate(labels):
                lines.append(f"({letter_for_index(i)}) {label}")
        lines.append(f"Answer {k}: (")
    return "\n".join(lines)


def prompt_hash(prompt: str) -> str:
    """Stable SHA-256 of a rendered prompt (hex digest)."""
    return hashlib.sha256(prompt.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Answer decoding
# ---------------------------------------------------------------------------


def _slot_logits(
    logits_by_slot: Mapping, k: int, qid: str, slot_keys: set
) -> list:
    """Fetch the logits for 1-based slot ``k``; keys may be ``"k"`` or ``k``.

    Unknown slot keys are reported together (helps debugging batched inputs).
    """
    for key in (str(k), k):
        if key in logits_by_slot:
            return list(logits_by_slot[key])
    raise KeyError(
        f"missing logits for slot {k} (question {qid!r}); "
        f"provided slots: {sorted(str(s) for s in slot_keys)}"
    )


def _valid_letter_logits(
    logits: list, n_valid: int, qid: str, what: str
) -> list:
    """Softmax must cover valid letters only: keep the first ``n_valid``
    entries of the letter-logit vector and ignore the rest (e.g. a full
    LM-head row).  Fewer entries than options is an error."""
    if len(logits) < n_valid:
        raise ValueError(
            f"question {qid!r} needs {n_valid} {what} logits, got {len(logits)}"
        )
    return logits[:n_valid]


def read_answers(
    logits_by_slot: Mapping,
    question_set: QuestionSet,
    permutations: Optional[Mapping] = None,
    temperature: float = 1.0,
) -> dict:
    """Decode per-slot letter logits into typed results.

    :param logits_by_slot: mapping of slot key -> letter-logit vector.  The
      slot key for the *k*-th question (1-based, :func:`build_prompt` order)
      is ``str(k)`` (int keys are also accepted).  Each vector is indexed by
      *displayed* option position, so vectors may be full LM-head rows:
      anything beyond the valid letters is ignored.
    :param question_set: the same question set the prompt was built from.
    :param permutations: the permutations passed to :func:`build_prompt`, if
      any; probabilities are mapped back to original option order.
    :param temperature: softmax temperature (must be > 0).
    :returns: mapping of question id -> :class:`~deem.primitives.ChoiceResult`
      / :class:`~deem.primitives.NoulResult` /
      :class:`~deem.primitives.ScoreResult`.
    """
    if not isinstance(question_set, QuestionSet):
        raise TypeError(f"question_set must be a QuestionSet, got {type(question_set).__name__}")
    permutations = dict(permutations) if permutations else {}
    results = {}
    for k, (qid, question) in enumerate(question_set.items(), start=1):
        logits = _slot_logits(logits_by_slot, k, qid, logits_by_slot.keys())
        perm = permutations.get(qid)
        results[qid] = _read_question(
            question, logits, perm, qid, temperature
        )
    return results


def _read_question(
    question, logits: list, perm: Optional[Sequence], qid: str, temperature: float
):
    """Read one slot. ``logits`` are indexed by *displayed* position."""
    if isinstance(question, NoulQuestion):
        return _read_noul(question, logits, qid, temperature)
    if isinstance(question, ChoiceQuestion):
        return _read_choice_score(
            question, question.options, "option", logits, perm, qid, temperature
        )
    return _read_choice_score(
        question, question.levels, "level", logits, perm, qid, temperature
    )


def _read_choice_score(
    question,
    labels,
    what: str,
    logits: list,
    perm: Optional[Sequence],
    qid: str,
    temperature: float,
) -> Union[ChoiceResult, ScoreResult]:
    n = len(labels)
    logits = _valid_letter_logits(logits, n, qid, f"{what} logits")
    if perm is not None:
        perm = _validate_permutation(perm, n, qid)
        # ``logits`` is indexed by displayed position; displayed position i
        # shows original option perm[i].  Remap into original option order.
        displayed = logits
        logits = [0.0] * n
        for i, original in enumerate(perm):
            logits[original] = displayed[i]
    probs = softmax(logits, temperature)
    if isinstance(question, ChoiceQuestion):
        probabilities = dict(zip(labels, probs))
        # ties broken by first option in original order
        choice = max(labels, key=lambda label: probabilities[label])
        return ChoiceResult(
            choice=choice,
            probabilities=probabilities,
            confidence=confidence_from_probabilities(probs),
        )
    probabilities = dict(zip(labels, probs))
    level = max(labels, key=lambda label: probabilities[label])
    expected = sum(i * p for i, p in enumerate(probs))
    return ScoreResult(
        level=level,
        probabilities=probabilities,
        expected=expected,
        confidence=confidence_from_probabilities(probs),
    )


def _read_noul(
    question: NoulQuestion, logits: list, qid: str, temperature: float
) -> NoulResult:
    if len(logits) == 1:
        # Sigmoid readout: a single "is-true" logit at the answer slot.
        return NoulResult(value=sigmoid(logits[0] / temperature))
    if len(logits) == 2:
        # Binary readout: [not-true, true] logits.
        return NoulResult(value=softmax(logits, temperature)[1])
    raise ValueError(
        f"Noul question {qid!r} needs 1 (sigmoid) or 2 (binary) logits, "
        f"got {len(logits)}"
    )


# ---------------------------------------------------------------------------
# Permutation support
# ---------------------------------------------------------------------------


def permute_question(question, seed) -> list:
    """Draw a deterministic option permutation for ``question``.

    Returns a permutation ``p`` (``displayed[i] = original[p[i]]``) suitable
    for :func:`build_prompt` / :func:`read_answers`.  ``seed`` may be any int
    or str; the same ``(question, seed)`` pair always yields the same
    permutation.  For Noul questions (no options) returns ``[]``.
    """
    labels = getattr(question, "options", None) or getattr(question, "levels", None)
    n = len(labels) if labels is not None else 0
    if n == 0:
        return []
    perm = list(range(n))
    rng = random.Random(seed)
    rng.shuffle(perm)
    return perm


def marginalize(distributions: Iterable) -> dict:
    """Average per-permutation distributions: ``mean_k p_k(option)``.

    All input distributions must cover exactly the same keys (option texts),
    which permutation readouts always do.
    """
    dists = list(distributions)
    if not dists:
        raise ValueError("marginalize needs at least one distribution")
    keys = dists[0].keys()
    for dist in dists[1:]:
        if set(dist) != set(keys):
            raise ValueError("distributions must share the same keys")
    out = {}
    for key in keys:
        out[key] = sum(float(dist.get(key, 0.0)) for dist in dists) / len(dists)
    return out


def marginalize_choice(results) -> ChoiceResult:
    """Average ChoiceResults across permutations into one calibrated result."""
    if not results:
        raise ValueError("marginalize_choice needs at least one result")
    probabilities = marginalize([r.probabilities for r in results])
    choice = max(probabilities, key=lambda key: probabilities[key])
    confidence = confidence_from_probabilities(list(probabilities.values()))
    return ChoiceResult(
        choice=choice, probabilities=probabilities, confidence=confidence
    )


def marginalize_score(results) -> ScoreResult:
    """Average ScoreResults across permutations into one calibrated result."""
    if not results:
        raise ValueError("marginalize_score needs at least one result")
    probabilities = marginalize([r.probabilities for r in results])
    levels = list(results[0].probabilities.keys())
    level = max(levels, key=lambda key: probabilities[key])
    expected = sum(i * probabilities[key] for i, key in enumerate(levels))
    confidence = confidence_from_probabilities(list(probabilities.values()))
    return ScoreResult(
        level=level, probabilities=probabilities, expected=expected,
        confidence=confidence,
    )
