import Foundation

/// The alphabet: each glyph a 4-wide by 5-tall arrangement of inked cells.
/// Shared shape vocabulary with `tools/mark/generate.py`, which draws the
/// app icon from the same grid.
public enum Glyphs {
    public static let rows = 5
    public static let glyphWidth = 4
    /// Between letters. A space is this plus two.
    public static let gap = 1

    private static let table: [Character: [String]] = [
        "O": ["####", "#..#", "#..#", "#..#", "####"],
        "P": ["####", "#..#", "####", "#...", "#..."],
        "E": ["####", "#...", "####", "#...", "####"],
        "N": ["#..#", "##.#", "#.##", "#..#", "#..#"],
        "C": ["####", "#...", "#...", "#...", "####"],
        "D": ["###.", "#..#", "#..#", "#..#", "###."],
        "G": ["####", "#...", "#.##", "#..#", "####"],
        "F": ["####", "#...", "####", "#...", "#..."],
        "R": ["####", "#..#", "####", "#.#.", "#..#"],
        // M and T strain a 4-wide grid: M's twin peaks become a filled
        // second row (the New Alphabet's own concession), and T's stem
        // sits one cell left of true centre because there is no centre.
        "M": ["#..#", "####", "#..#", "#..#", "#..#"],
        "T": ["####", ".#..", ".#..", ".#..", ".#.."],
    ]

    /// Total width in cells, including inter-letter gaps.
    public static func width(of text: String) -> Int {
        var total = 0
        for (index, character) in text.enumerated() {
            if index > 0 { total += gap }
            total += character == " " ? gap + 2 : glyphWidth
        }
        return total
    }

    /// Every inked cell as (column, row).
    public static func cells(of text: String) -> [(Int, Int)] {
        var out: [(Int, Int)] = []
        var x = 0
        for (index, character) in text.enumerated() {
            if index > 0 { x += gap }
            guard let glyph = table[character] else {
                x += gap + 2 // space
                continue
            }
            for (row, line) in glyph.enumerated() {
                for (column, mark) in line.enumerated() where mark == "#" {
                    out.append((x + column, row))
                }
            }
            x += glyphWidth
        }
        return out
    }
}
