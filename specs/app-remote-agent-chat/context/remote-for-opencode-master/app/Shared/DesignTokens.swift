import RemoteKit
import SwiftUI

/// The design system's values, in one place. Full rationale and sources:
/// docs/design-spec.md.

// MARK: - Color

/// Warm neutrals throughout — the load-bearing rule of the palette.
/// `#141413` is not black, `#faf9f5` is not white, and the muted tone is a
/// khaki. A pure grey anywhere and the whole thing stops reading as warm.
/// Values are Anthropic's shipping brand tokens, with the dark accent
/// pulled toward OpenCode's apricot.
extension Color {
    static let canvas = Color(light: 0xFA_F9F5, dark: 0x14_1413)
    static let surface = Color(light: 0xF0_EEE6, dark: 0x1F_1E1D)
    static let surfaceRaised = Color(light: 0xE8_E6DC, dark: 0x26_2624)
    static let ink = Color(light: 0x14_1413, dark: 0xF4_F0EC)
    static let inkMuted = Color(light: 0x5E_5D59, dark: 0xB0_AEA5)
    static let inkFaint = Color(light: 0x87_867F, dark: 0x87_867F)
    static let clay = Color(light: 0xD9_7757, dark: 0xE0_8A63)
    static let positive = Color(light: 0x3D_9A57, dark: 0x7F_D88F)
    static let negative = Color(light: 0xD1_383D, dark: 0xE0_6C75)
    static let caution = Color(light: 0xD6_8C27, dark: 0xF5_A742)

    /// Hairlines are alpha ink, never a grey stroke, and only ever bound a
    /// surface — there are no free-floating dividers in this system.
    static let hairline = Color(light: 0x14_1413, dark: 0xFA_F9F5).opacity(0.10)

    #if canImport(UIKit)
    init(light: UInt32, dark: UInt32) {
        self.init(UIColor { traits in
            UIColor(hex: traits.userInterfaceStyle == .dark ? dark : light)
        })
    }
    #else
    init(light: UInt32, dark: UInt32) {
        // The AppKit twin of UIColor's trait-driven initialiser: a named
        // dynamic color re-resolves whenever the effective appearance
        // changes, which is what keeps a long-lived window honest about
        // System ↔ Light ↔ Dark switches.
        self.init(nsColor: NSColor(name: nil) { appearance in
            let isDark = appearance.bestMatch(from: [.aqua, .darkAqua]) == .darkAqua
            return NSColor(hex: isDark ? dark : light)
        })
    }
    #endif
}

#if canImport(UIKit)
private extension UIColor {
    convenience init(hex: UInt32) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            alpha: 1
        )
    }
}
#else
private extension NSColor {
    convenience init(hex: UInt32) {
        self.init(
            srgbRed: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            alpha: 1
        )
    }
}
#endif

// MARK: - Space

/// Spacing for the transcript and its surroundings.
///
/// The transcript has no divider lines, so these values *are* its
/// structure. The density ladder — line < part < turn — must hold at every
/// text size, which is why every one of these is a scaled metric on the
/// view rather than a constant: 4pt of extra leading is visually nothing
/// against 53pt text at AX5.
///
/// The rule that replaces rules: `betweenTurns / paragraph >= 2.0`.
struct Space {
    @ScaledMetric(relativeTo: .body) var lineExtra: CGFloat = 4
    @ScaledMetric(relativeTo: .body) var paragraph: CGFloat = 16
    @ScaledMetric(relativeTo: .body) var roleLabel: CGFloat = 8
    @ScaledMetric(relativeTo: .body) var betweenParts: CGFloat = 12
    @ScaledMetric(relativeTo: .body) var betweenTurns: CGFloat = 40
    @ScaledMetric(relativeTo: .body) var gutter: CGFloat = 16

    init() {}
}

// MARK: - Radius

/// Radius is semantic here: shape alone should say what kind of thing you
/// are looking at.
enum Radius {
    static let chip: CGFloat = 4
    static let control: CGFloat = 8
    static let block: CGFloat = 12
    static let sheet: CGFloat = 16
    static let composer: CGFloat = 26
}

// MARK: - Motion

enum Motion {
    /// Anthropic's house ease-out (easeOutQuart), the curve driving
    /// claude.ai's own thinking indicator. Never ease-in on UI.
    static func easeOut(_ duration: TimeInterval) -> Animation {
        .timingCurve(0.165, 0.84, 0.44, 1, duration: duration)
    }

    static let feedback: TimeInterval = 0.2
    static let sheet: TimeInterval = 0.35
}
