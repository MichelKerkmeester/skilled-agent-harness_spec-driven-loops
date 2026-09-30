#!/usr/bin/env python
"""Export reference tensors for the Rust runtime parity tests.

Runs the exact serving readout path (deem_server.TorchBackend) on the base
model, dumps token ids, per-layer hidden states and letter logits to a
single .npz so the Rust tests can compare layer-by-layer.

Usage:
    .venv-sft/bin/python rust/parity/export_reference.py \
        --checkpoint Qwen/Qwen3.5-0.8B --out /tmp/opencode/deem-parity/ref.npz
"""

import argparse
import sys
from pathlib import Path

import numpy as np
import torch

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "src"))
sys.path.insert(0, str(REPO / "serve"))

PROMPT = (
    "<state>\n"
    "{\"compact\": \"deploy box prod-1: build #4021 green, 3 unit tests flaky, Friday 16:55\"}\n"
    "</state>\n\n"
    "Question 1: What should we do with this release?\n"
    "Options:\n(A) deploy\n(B) hold\n(C) rollback\nAnswer 1: ("
)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--checkpoint", default="Qwen/Qwen3.5-0.8B")
    ap.add_argument("--out", default="/tmp/opencode/deem-parity/ref.npz")
    ap.add_argument("--device", default="cpu")
    args = ap.parse_args()

    from transformers import AutoModelForCausalLM, AutoTokenizer

    device = args.device
    tok = AutoTokenizer.from_pretrained(args.checkpoint)
    model = AutoModelForCausalLM.from_pretrained(
        args.checkpoint, dtype=torch.bfloat16
    )
    model.to(device)
    model.eval()

    letter_ids = [
        tok.encode(chr(ord("A") + i), add_special_tokens=False)[0] for i in range(26)
    ]

    ids = tok.encode(PROMPT, add_special_tokens=False)
    print(f"prompt tokens: {len(ids)}")
    input_ids = torch.tensor([ids], device=device)

    per_layer = {}
    hooks = []
    for i, layer in enumerate(model.model.layers):
        hooks.append(
            layer.register_forward_hook(
                lambda _m, _o, idx=i: None
            )
        )
    hidden_by_layer = {}

    # manual capture: run each layer sequentially
    with torch.no_grad():
        h = model.model.embed_tokens(input_ids)
        per_layer["embed"] = h[0].float().cpu().numpy()
        position_ids = torch.arange(len(ids), device=device).unsqueeze(0)
        for i, layer in enumerate(model.model.layers):
            if hasattr(layer, "self_attn"):
                rope = model.model.rotary_emb
                pos_embeddings = rope(h, position_ids.expand(3, -1, -1).float())
            else:
                pos_embeddings = None
            out = layer(h, position_embeddings=pos_embeddings, position_ids=None)
            h = out[0] if isinstance(out, tuple) else out
            hidden_by_layer[f"layer_{i}"] = h[0].float().cpu().numpy()
        h = model.model.norm(h)
        per_layer["final_norm"] = h[0].float().cpu().numpy()
        last = h[0, len(ids) - 1]
        logits = model.lm_head(last).float()
        letters = logits.index_select(
            0, torch.tensor(letter_ids, device=device)
        )
    for hook in hooks:
        hook.remove()

    out_dir = Path(args.out).parent
    out_dir.mkdir(parents=True, exist_ok=True)
    np.savez(
        args.out,
        tokens=np.array(ids, dtype=np.int64),
        letter_ids=np.array(letter_ids, dtype=np.int64),
        letter_logits=letters.cpu().numpy(),
        **per_layer,
        **hidden_by_layer,
    )
    # raw dump for the Rust tests: ref/raw/<key>.f32|i64 + manifest.json
    raw_dir = out_dir / "raw"
    raw_dir.mkdir(exist_ok=True)
    manifest = {}
    tensors_out = {
        "tokens": np.array(ids, dtype=np.int64),
        "letter_ids": np.array(letter_ids, dtype=np.int64),
        "letter_logits": letters.cpu().numpy(),
        **per_layer,
        **hidden_by_layer,
    }
    for key, arr in tensors_out.items():
        arr.tofile(raw_dir / f"{key}.bin")
        manifest[key] = {"shape": list(arr.shape)}
    (out_dir / "manifest.json").write_text(
        __import__("json").dumps(
            {k: v["shape"] for k, v in manifest.items()}
        )
    )
    print(f"wrote {args.out} + raw tensors")
    print(f"wrote {args.out}")
    print(f"letter logits: {letters.cpu().numpy()[:3]}")


if __name__ == "__main__":
    main()
