#!/usr/bin/env bash
# Builds the fixture project in the empty workspace. Runs outside the
# sandbox, before Claude starts, so it may use the network to install
# Supercov locally; the run itself then needs no network.
set -euo pipefail
cat > package.json <<'JSON'
{ "name": "shop", "private": true, "type": "module", "scripts": { "test": "node --test" } }
JSON
mkdir -p src test
cat > src/price.js <<'JS'
export function total(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function discount(amount, code) {
  if (code === "VIP") return amount * 0.8;
  if (code === "HALF" && amount > 100) return amount / 2;
  return amount;
}
JS
cat > test/price.test.js <<'JS'
import { test } from "node:test";
import assert from "node:assert/strict";
import { total, discount } from "../src/price.js";

test("total adds price times quantity", () => {
  assert.equal(total([{ price: 2, quantity: 3 }, { price: 1, quantity: 1 }]), 7);
});

test("discount without a code keeps the amount", () => {
  assert.equal(discount(50), 50);
});
JS
npm install --no-save --no-audit --no-fund --silent supercov@latest
cat > src/report.js <<'JS'
export function report(orders, user, options) {
  let out = "";
  for (const order of orders) {
    if (order) {
      if (order.status === "paid") {
        if (user && user.role === "admin") {
          if (options && options.verbose) {
            for (const line of order.lines) {
              if (line.quantity > 0) {
                out += line.name + ": " + line.quantity * line.price * 1.21 + "\n";
              }
            }
          } else {
            out += order.id + ": " + order.total * 1.21 + "\n";
          }
        } else if (user && user.role === "viewer") {
          out += order.id + "\n";
        }
      } else if (order.status === "refunded") {
        if (options && options.verbose) out += order.id + " refunded " + order.total * 1.21 + "\n";
      }
    }
  }
  return out;
}
JS
