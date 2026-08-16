import RemoteKit
import SwiftUI

/// "The agent is working" — and, more importantly, what on.
///
/// Two decisions from the research, both load-bearing (docs/design-spec.md):
///
/// **The pulse is a heartbeat, not a spinner.** Measured off claude.ai's
/// shipping keyframes: a 1.8s cycle that rises fast, holds bright briefly,
/// then decays slowly and rests dim. The asymmetry is the entire effect —
/// a sine wave reads mechanical.
///
/// **The words matter more than the motion.** Apple's HIG for generative AI
/// asks for specific feedback over "Processing…", and Buell & Norton found
/// people chose a *slower* service 62% of the time when it showed what it
/// was doing. So the label names the activity, and escalates as the wait
/// grows rather than sitting still and looking stuck.
struct WorkingIndicator: View {
    /// What the agent is doing right now, in a few words.
    let activity: String
    /// When this turn started, for the escalating copy.
    var since: Date = .init()

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @ScaledMetric(relativeTo: .body) private var dot: CGFloat = 7
    @ScaledMetric(relativeTo: .body) private var spacing: CGFloat = 10

    private static let cycle: TimeInterval = 1.8

    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 30, paused: reduceMotion)) { timeline in
            let elapsed = timeline.date.timeIntervalSince(since)
            HStack(spacing: spacing) {
                Circle()
                    .fill(Color.clay)
                    .frame(width: dot, height: dot)
                    .opacity(reduceMotion ? 0.7 : pulse(at: elapsed))
                Text(label(after: elapsed))
                    .font(.callout)
                    .foregroundStyle(Color.inkMuted)
                    .contentTransition(.opacity)
            }
            .animation(Motion.easeOut(Motion.feedback), value: label(after: elapsed))
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Working: \(activity)")
        .accessibilityAddTraits(.updatesFrequently)
    }

    /// claude.ai's curve, in proportions of the cycle:
    /// 0–10% fast rise · 10–25% bright hold · 25–65% slow decay · rest dim.
    private func pulse(at elapsed: TimeInterval) -> Double {
        let t = elapsed.truncatingRemainder(dividingBy: Self.cycle) / Self.cycle
        let dim = 0.3, bright = 1.0
        switch t {
        case ..<0.10:
            return dim + (bright - dim) * eased(t / 0.10)
        case ..<0.25:
            return bright
        case ..<0.65:
            return bright - (bright - dim) * eased((t - 0.25) / 0.40)
        default:
            return dim
        }
    }

    /// easeOutQuart — the same curve as everything else here.
    private func eased(_ t: Double) -> Double {
        1 - pow(1 - t, 4)
    }

    /// The activity, escalating with the wait. Users read a static screen
    /// as stuck within about four seconds; this costs nothing and is the
    /// single highest-value part of the indicator.
    private func label(after elapsed: TimeInterval) -> String {
        switch elapsed {
        case ..<10: return activity
        case ..<20: return "\(activity) — still going"
        case ..<45: return "\(activity) — this one's taking a while"
        default: return "\(activity) — still working, Stop is available"
        }
    }
}

extension TurnPart {
    /// This part rendered as a status line — what the working indicator
    /// says while it's the newest thing to have happened.
    var activityLabel: String? {
        switch type {
        case "reasoning": return "Thinking"
        case "tool":
            guard let tool else { return "Working" }
            // The tools people recognise get plain-English verbs; anything
            // else is named rather than guessed at.
            switch tool {
            case "read": return "Reading files"
            case "edit", "write", "patch": return "Editing files"
            case "bash": return "Running a command"
            case "glob", "grep", "find": return "Searching the project"
            case "webfetch", "websearch": return "Searching the web"
            case "task", "subagent": return "Running a subagent"
            default: return tool.capitalized
            }
        case "text": return "Writing"
        default: return nil
        }
    }
}
