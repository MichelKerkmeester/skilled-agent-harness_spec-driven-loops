/**
 * Tests for UI Utilities
 * @module shared/ui.test
 */

import { describe, it, expect } from "bun:test";
import {
  icons,
  status,
  progressBar,
  box,
  divider,
  list,
  numberedList,
  table,
  stageBanner,
  decisionGate,
  compactProgressRow,
  colors,
  colorize,
  colored,
  UI,
} from "./ui.js";

describe("ui utilities", () => {
  describe("icons", () => {
    it("has success icon", () => {
      expect(icons.success).toBeDefined();
      expect(typeof icons.success).toBe("string");
    });

    it("has error icon", () => {
      expect(icons.error).toBeDefined();
    });

    it("has all expected icons", () => {
      const expectedIcons = [
        "success", "error", "pending", "warning", "info",
        "arrow", "bullet", "check", "cross", "circle", "star", "flag"
      ];

      for (const icon of expectedIcons) {
        expect(icons).toHaveProperty(icon);
      }
    });

    it("icons are non-empty strings", () => {
      for (const [key, value] of Object.entries(icons)) {
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });

  describe("status", () => {
    it("has all expected status codes", () => {
      const expectedStatus = ["ok", "fail", "warn", "info", "work", "wait", "gate"];

      for (const s of expectedStatus) {
        expect(status).toHaveProperty(s);
      }
    });

    it("status codes are bracketed", () => {
      for (const [key, value] of Object.entries(status)) {
        expect(value).toMatch(/^\[.*\]$/);
      }
    });
  });

  describe("progressBar", () => {
    it("shows empty bar at 0%", () => {
      const bar = progressBar(0);
      expect(bar).toContain("0%");
      expect(bar).toContain("░");
      expect(bar).not.toContain("█");
    });

    it("shows full bar at 100%", () => {
      const bar = progressBar(100);
      expect(bar).toContain("100%");
      expect(bar).toContain("█");
      expect(bar).not.toContain("░");
    });

    it("shows half-filled bar at 50%", () => {
      const bar = progressBar(50, 10);
      expect(bar).toContain("50%");
      // With width 10, 50% = 5 filled, 5 empty
      expect(bar.match(/█/g)?.length).toBe(5);
      expect(bar.match(/░/g)?.length).toBe(5);
    });

    it("clamps values below 0 to 0%", () => {
      const bar = progressBar(-10);
      expect(bar).toContain("0%");
    });

    it("clamps values above 100 to 100%", () => {
      const bar = progressBar(150);
      expect(bar).toContain("100%");
    });

    it("respects custom width", () => {
      const bar = progressBar(50, 40);
      // 40 characters total for the bar portion
      const barPortion = bar.split(" ")[0];
      expect(barPortion.length).toBe(40);
    });

    it("handles decimal percentages", () => {
      const bar = progressBar(33.33);
      expect(bar).toContain("33%");
    });

    it("defaults to width 20", () => {
      const bar = progressBar(50);
      const barPortion = bar.split(" ")[0];
      expect(barPortion.length).toBe(20);
    });

    it("rounds percentage display", () => {
      const bar = progressBar(33.7);
      expect(bar).toContain("34%");
    });
  });

  describe("box", () => {
    it("creates box with title and content", () => {
      const result = box("Title", "Content");
      
      expect(result).toContain("Title");
      expect(result).toContain("Content");
      expect(result).toContain("┌");
      expect(result).toContain("└");
      expect(result).toContain("│");
    });

    it("creates box with specified width", () => {
      const result = box("Title", "Content", 40);
      const lines = result.split("\n");
      
      // First line should be exactly 40 characters
      expect(lines[0].length).toBe(40);
    });

    it("wraps long content", () => {
      const longContent = "A".repeat(100);
      const result = box("Title", longContent, 30);
      const lines = result.split("\n");
      
      // Should have multiple content lines
      const contentLines = lines.filter(l => l.includes("A"));
      expect(contentLines.length).toBeGreaterThan(1);
    });

    it("handles multiline content", () => {
      const multilineContent = "Line 1\nLine 2\nLine 3";
      const result = box("Title", multilineContent);
      
      expect(result).toContain("Line 1");
      expect(result).toContain("Line 2");
      expect(result).toContain("Line 3");
    });

    it("pads short content to fill width", () => {
      const result = box("T", "X", 20);
      const lines = result.split("\n");
      
      // All lines should be same width
      for (const line of lines) {
        expect(line.length).toBe(20);
      }
    });

    it("includes separator between title and content", () => {
      const result = box("Title", "Content");
      expect(result).toContain("├");
      expect(result).toContain("┤");
    });

    it("defaults to width 60", () => {
      const result = box("Title", "Content");
      const lines = result.split("\n");
      expect(lines[0].length).toBe(60);
    });
  });

  describe("divider", () => {
    it("creates divider with default width", () => {
      const result = divider();
      expect(result.length).toBe(60);
      expect(result).toMatch(/^─+$/);
    });

    it("creates divider with custom width", () => {
      const result = divider(30);
      expect(result.length).toBe(30);
    });

    it("creates divider with custom character", () => {
      const result = divider(10, "=");
      expect(result).toBe("==========");
    });

    it("handles width of 0", () => {
      const result = divider(0);
      expect(result).toBe("");
    });

    it("handles single character divider", () => {
      const result = divider(1, "*");
      expect(result).toBe("*");
    });
  });

  describe("list", () => {
    it("creates bullet list", () => {
      const items = ["Item 1", "Item 2", "Item 3"];
      const result = list(items);
      
      expect(result).toContain("• Item 1");
      expect(result).toContain("• Item 2");
      expect(result).toContain("• Item 3");
    });

    it("uses custom bullet character", () => {
      const items = ["A", "B"];
      const result = list(items, "-");
      
      expect(result).toContain("- A");
      expect(result).toContain("- B");
    });

    it("handles empty list", () => {
      const result = list([]);
      expect(result).toBe("");
    });

    it("handles single item list", () => {
      const result = list(["Only item"]);
      expect(result).toBe("• Only item");
    });

    it("separates items with newlines", () => {
      const items = ["A", "B", "C"];
      const result = list(items);
      const lines = result.split("\n");
      
      expect(lines.length).toBe(3);
    });
  });

  describe("numberedList", () => {
    it("creates numbered list", () => {
      const items = ["First", "Second", "Third"];
      const result = numberedList(items);
      
      expect(result).toContain("1. First");
      expect(result).toContain("2. Second");
      expect(result).toContain("3. Third");
    });

    it("handles empty list", () => {
      const result = numberedList([]);
      expect(result).toBe("");
    });

    it("handles single item", () => {
      const result = numberedList(["Only"]);
      expect(result).toBe("1. Only");
    });

    it("handles many items", () => {
      const items = Array.from({ length: 15 }, (_, i) => `Item ${i + 1}`);
      const result = numberedList(items);
      
      expect(result).toContain("10. Item 10");
      expect(result).toContain("15. Item 15");
    });
  });

  describe("table", () => {
    it("creates simple table", () => {
      const headers = ["Name", "Value"];
      const rows = [
        ["Foo", "1"],
        ["Bar", "2"],
      ];
      
      const result = table(headers, rows);
      
      expect(result).toContain("Name");
      expect(result).toContain("Value");
      expect(result).toContain("Foo");
      expect(result).toContain("Bar");
    });

    it("aligns columns properly", () => {
      const headers = ["Short", "LongerHeader"];
      const rows = [
        ["A", "B"],
        ["CCC", "D"],
      ];
      
      const result = table(headers, rows);
      const lines = result.split("\n");
      
      // Header row should be aligned
      expect(lines[0]).toContain("Short");
      expect(lines[0]).toContain("LongerHeader");
    });

    it("includes separator between header and data", () => {
      const result = table(["H"], [["D"]]);
      expect(result).toContain("─");
    });

    it("handles empty rows", () => {
      const result = table(["Header"], []);
      expect(result).toContain("Header");
    });

    it("handles missing cell values", () => {
      const headers = ["A", "B", "C"];
      const rows = [
        ["1", "2"],  // Missing C
        ["3"],       // Missing B and C
      ];
      
      // Should not throw
      const result = table(headers, rows);
      expect(result).toContain("A");
    });

    it("uses | as column separator", () => {
      const result = table(["A", "B"], [["1", "2"]]);
      expect(result).toContain(" | ");
    });
  });

  describe("stageBanner", () => {
    it("formats a basic stage banner", () => {
      const result = stageBanner("plan", "Capture intent");
      expect(result).toBe("[STAGE] PLAN - Capture intent");
    });

    it("supports custom width padding", () => {
      const result = stageBanner("execute", "Build", { width: 40 });
      expect(result.length).toBe(40);
      expect(result).toContain("[STAGE] EXECUTE - Build");
    });

    it("keeps ASCII output", () => {
      const result = stageBanner("accept");
      expect(result).toMatch(/^[\x00-\x7F]+$/);
    });
  });

  describe("decisionGate", () => {
    it("formats a decision gate with action", () => {
      const result = decisionGate("Specify", "Confirm the specification");
      expect(result).toContain("[GATE] Specify");
      expect(result).toContain("Action: Confirm the specification");
    });

    it("renders details as list items", () => {
      const result = decisionGate("Accept", "Confirm delivery", {
        details: ["Review summary", "Provide approval"],
      });
      const lines = result.split("\n");
      expect(lines).toContain("- Review summary");
      expect(lines).toContain("- Provide approval");
    });

    it("keeps ASCII output", () => {
      const result = decisionGate("Gate", "Do it");
      expect(result).toMatch(/^[\x00-\x7F\n]+$/);
    });
  });

  describe("compactProgressRow", () => {
    it("formats a compact progress row", () => {
      const result = compactProgressRow([
        { label: "Wave", value: "2/5" },
        { label: "Task", value: "3/7" },
        { label: "Stage", value: "Execute" },
      ]);
      expect(result).toContain("[WORK]");
      expect(result).toContain("Wave 2/5");
      expect(result).toContain("Task 3/7");
      expect(result).toContain("Stage Execute");
    });

    it("supports custom separator and widths", () => {
      const result = compactProgressRow(
        [
          { label: "Wave", value: "1/2", width: 10 },
          { label: "Task", value: "4/9", width: 10 },
        ],
        { separator: " / " },
      );
      expect(result).toContain(" / ");
      expect(result).toContain("Wave 1/2");
    });

    it("keeps ASCII output", () => {
      const result = compactProgressRow([{ label: "Stage", value: "Plan" }]);
      expect(result).toMatch(/^[\x00-\x7F]+$/);
    });
  });

  describe("colors", () => {
    it("has reset code", () => {
      expect(colors.reset).toBe("\x1b[0m");
    });

    it("has bold code", () => {
      expect(colors.bold).toBe("\x1b[1m");
    });

    it("has foreground colors", () => {
      expect(colors.red).toBeDefined();
      expect(colors.green).toBeDefined();
      expect(colors.blue).toBeDefined();
      expect(colors.yellow).toBeDefined();
    });

    it("has background colors", () => {
      expect(colors.bgRed).toBeDefined();
      expect(colors.bgGreen).toBeDefined();
      expect(colors.bgBlue).toBeDefined();
    });
  });

  describe("colorize", () => {
    it("wraps text with color and reset codes", () => {
      const result = colorize("test", "red");
      
      expect(result).toContain(colors.red);
      expect(result).toContain("test");
      expect(result).toContain(colors.reset);
    });

    it("places color code before text", () => {
      const result = colorize("test", "green");
      const colorIndex = result.indexOf(colors.green);
      const textIndex = result.indexOf("test");
      
      expect(colorIndex).toBeLessThan(textIndex);
    });

    it("places reset code after text", () => {
      const result = colorize("test", "blue");
      const textIndex = result.indexOf("test");
      const resetIndex = result.indexOf(colors.reset);
      
      expect(textIndex).toBeLessThan(resetIndex);
    });

    it("handles empty string", () => {
      const result = colorize("", "red");
      expect(result).toBe(`${colors.red}${colors.reset}`);
    });

    it("handles bold", () => {
      const result = colorize("text", "bold");
      expect(result).toContain(colors.bold);
    });
  });

  describe("colored", () => {
    it("has success helper", () => {
      const result = colored.success("ok");
      expect(result).toContain(colors.green);
    });

    it("has error helper", () => {
      const result = colored.error("fail");
      expect(result).toContain(colors.red);
    });

    it("has warning helper", () => {
      const result = colored.warning("warn");
      expect(result).toContain(colors.yellow);
    });

    it("has info helper", () => {
      const result = colored.info("info");
      expect(result).toContain(colors.cyan);
    });

    it("has muted helper", () => {
      const result = colored.muted("dim");
      expect(result).toContain(colors.dim);
    });

    it("has bold helper", () => {
      const result = colored.bold("strong");
      expect(result).toContain(colors.bold);
    });
  });

  describe("UI default export", () => {
    it("includes all utilities", () => {
      expect(UI.icons).toBe(icons);
      expect(UI.status).toBe(status);
      expect(UI.progressBar).toBe(progressBar);
      expect(UI.box).toBe(box);
      expect(UI.divider).toBe(divider);
      expect(UI.list).toBe(list);
      expect(UI.numberedList).toBe(numberedList);
      expect(UI.table).toBe(table);
      expect(UI.stageBanner).toBe(stageBanner);
      expect(UI.decisionGate).toBe(decisionGate);
      expect(UI.compactProgressRow).toBe(compactProgressRow);
      expect(UI.colors).toBe(colors);
      expect(UI.colorize).toBe(colorize);
      expect(UI.colored).toBe(colored);
    });
  });
});
