import { describe, expect, test } from "vitest";
import {
  emit,
  pluck,
  renderDelimited,
  renderMarkdown,
  renderPluck,
  renderText,
  type View,
} from "../src/output.js";
import { cliHarness } from "./helpers/cli.js";

const ESC = String.fromCharCode(27);

const view: View = {
  head: [`${ESC}[1mBLOCK${ESC}[22m  reason here`, "second line"],
  table: {
    columns: ["A", "B|c"],
    rows: [
      ["1", "a, b"],
      ["2", 'q"uote'],
      ["3", `${ESC}[32mgreen${ESC}[39m`],
    ],
  },
  tail: ["done"],
  kv: [["k", "v"]],
  usage: { usage: { input_tokens: 7, output_tokens: 1 }, model: "jev-1.13.0", provider: "typesafe" },
};

describe("output: renderers", () => {
  test("text: head, blank, table, blank, tail, usage footer; -q drops the footer", () => {
    const t = renderText(view, { color: false, quiet: false });
    expect(t.startsWith(`${ESC}[1mBLOCK`)).toBe(true);
    expect(t).toContain("\n\nA  B|c\n");
    expect(t).toContain("\n\ndone\n7 in / 1 out tokens · jev-1.13.0 via typesafe");
    expect(renderText(view, { color: false, quiet: true })).not.toContain("tokens");
    expect(renderText({ usage: view.usage }, { color: false, quiet: false })).toBe(
      "7 in / 1 out tokens · jev-1.13.0 via typesafe",
    );
  });

  test("text footer says so when no request was made instead of printing an empty model", () => {
    const noCall = { usage: { input_tokens: 0, output_tokens: 0 }, model: "", provider: "" };
    expect(renderText({ usage: noCall }, { color: false, quiet: false })).toBe("no API call made");
    expect(renderMarkdown({ usage: noCall }, { quiet: false })).toContain("_no API call made_");
  });

  test("markdown: strips ANSI, escapes pipes, italic usage; kv becomes a table when there is no table", () => {
    const md = renderMarkdown(view, { quiet: false });
    expect(md).toContain("BLOCK  reason here  \nsecond line");
    expect(md).toContain("| A | B\\|c |\n| --- | --- |\n| 1 | a, b |");
    expect(md).toContain("| 3 | green |");
    expect(md).toMatch(/_7 in \/ 1 out tokens/);
    expect(renderMarkdown({ kv: [["label", "bug"]] }, { quiet: true })).toBe(
      "| Field | Value |\n| --- | --- |\n| label | bug |",
    );
  });

  test("csv/tsv: table (or kv) only, quoting where needed, ANSI stripped", () => {
    expect(renderDelimited(view, ",")).toBe('A,B|c\n1,"a, b"\n2,"q""uote"\n3,green');
    expect(renderDelimited(view, "\t")).toBe('A\tB|c\n1\ta, b\n2\tq"uote\n3\tgreen');
    expect(renderDelimited({ kv: [["label", "bug"]] }, ",")).toBe("field,value\nlabel,bug");
    expect(() => renderDelimited({ head: ["x"] }, ",")).toThrow(/no tabular form/);
  });
});

describe("output: pluck", () => {
  const payload = {
    label: "bug",
    n: 3,
    results: [{ verdict: "verified" }, { verdict: "contradicted" }],
    fields: { email: { value: "a@b.co", normalized: "a@b.co" } },
  };
  test("paths, indexes, wildcards, missing values", () => {
    expect(pluck(payload, "label")).toBe("bug");
    expect(pluck(payload, "results[1].verdict")).toBe("contradicted");
    expect(pluck(payload, "results[].verdict")).toEqual(["verified", "contradicted"]);
    expect(pluck(payload, "fields.email.value")).toBe("a@b.co");
    expect(pluck(payload, "fields[].value")).toEqual(["a@b.co"]);
    expect(pluck(payload, "nope.deeper")).toBeUndefined();
    expect(() =>
      emit({ format: "text", color: false, quiet: true, pluck: "nope.deeper" }, payload, () => ({})),
    ).toThrow(/--pluck path "nope.deeper" matched nothing/);
    expect(() => pluck(payload, "")).toThrow(/Invalid --pluck/);
  });
  test("rendering: scalars raw, arrays one per line, objects as JSON, json formats as JSON", () => {
    expect(renderPluck("bug", "text")).toBe("bug");
    expect(renderPluck(3, "text")).toBe("3");
    expect(renderPluck(["a", "b"], "text")).toBe("a\nb");
    expect(renderPluck({ x: 1 }, "text")).toBe('{"x":1}');
    expect(renderPluck(undefined, "text")).toBe("");
    expect(renderPluck(["a"], "json")).toBe('[\n  "a"\n]');
    expect(renderPluck({ x: 1 }, "jsonl")).toBe('{"x":1}');
  });
});

describe("output: cli formats", () => {
  const h = cliHarness({ injection: { type: "noul", noul: 0.98 } });

  test("--format md renders a GFM table for tabular commands and a kv table for single answers", async () => {
    const v = await h.run(["verify", "a", "b", "-e", "e", "--format", "md", "--fail-on", "none"]);
    expect(v.code).toBe(0);
    expect(v.stdout).toContain("| # | Verdict | Conf | Action | Claim |\n| --- | --- | --- | --- | --- |");
    expect(v.stdout).toMatch(/_42 in \/ 7 out tokens/);
    const s = await h.run(["screen", "x", "--md", "-q"]);
    expect(s.stdout).toContain("BLOCK  injection probability 0.98");
    expect(s.stdout).toContain("| action | block |");
    expect(s.stdout).not.toContain("tokens");
  });

  test("--format csv and tsv; single-answer commands emit field,value rows", async () => {
    const csv = await h.run(["extract", "mail a@b.co", "--want", "email", "--format", "csv"]);
    expect(csv.stdout.split("\n")[0]).toBe("Field,Value,Normalized,Conf,Action,Cands");
    expect(csv.stdout).toContain("email,a@b.co,,0.88,auto,1");
    const tsv = await h.run(["classify", "x", "-l", "a,b", "--format", "tsv"]);
    expect(tsv.stdout).toBe(
      "field\tvalue\nlabel\ta\nconfidence\t0.88\naction\tauto\nprobabilities\ta 0.90, b 0.10\n",
    );
  });

  test("--format jsonl is one-line JSON; JEV_FORMAT sets the default; bad format is a usage error", async () => {
    const j = await h.run(["classify", "x", "-l", "a,b", "--format", "jsonl"]);
    expect(j.stdout.trim().split("\n")).toHaveLength(1);
    expect(JSON.parse(j.stdout).label).toBe("a");
    const env = await h.run(["classify", "x", "-l", "a,b"], { env: { JEV_FORMAT: "json" } });
    expect(JSON.parse(env.stdout).command).toBe("classify");
    const bad = await h.run(["classify", "x", "-l", "a,b", "--format", "yaml"]);
    expect(bad.code).toBe(1);
    expect(bad.stderr).toMatch(/Unknown format "yaml"/);
  });

  test("--pluck prints one value and keeps exit codes", async () => {
    const one = await h.run(["classify", "x", "-l", "a,b", "--pluck", "label"]);
    expect(one.stdout).toBe("a\n");
    const many = await h.run([
      "verify",
      "a",
      "b",
      "-e",
      "e",
      "--pluck",
      "results[].verdict",
      "--fail-on",
      "none",
    ]);
    expect(many.stdout.trim().split("\n")).toHaveLength(2);
    const gated = await h.run(["screen", "x", "--pluck", "recommendation.action"]);
    expect(gated.stdout).toBe("block\n");
    expect(gated.code).toBe(2);
    const asJson = await h.run(["classify", "x", "-l", "a,b", "--pluck", "probabilities", "--json"]);
    expect(JSON.parse(asJson.stdout)).toEqual({ a: 0.9, b: 0.1 });
  });

  test("batch: --format json collects an array, md prints a summary table, --pluck per row", async () => {
    const arr = await h.run(["batch", "classify", "-i", "-", "--format", "json", "--", "-l", "a,b"], {
      stdin: "one\ntwo\n",
    });
    const parsed = JSON.parse(arr.stdout);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
    const md = await h.run(["batch", "classify", "-i", "-", "--md", "--", "-l", "a,b"], {
      stdin: "one\ntwo\n",
    });
    expect(md.stdout).toContain("| id | ok | failed | result |");
    expect(md.stdout).toContain("| 1 | true | false | a |");
    const pl = await h.run(["batch", "classify", "-i", "-", "--pluck", "result.label", "--", "-l", "a,b"], {
      stdin: "one\ntwo\n",
    });
    expect(pl.stdout).toBe("a\na\n");
  });
});
