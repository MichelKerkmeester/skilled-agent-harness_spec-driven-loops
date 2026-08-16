import RemoteKit
import SwiftUI

/// The agent asked something — inline, where it asked. Selection and
/// custom-answer semantics are the phone sheet's: labels per question in
/// order, free text appended where the agent said custom answers are fine.
/// The card sits in the transcript until answered; there is nothing to
/// dismiss because there is no honest way to un-ask a blocking question.
struct QuestionCard: View {
    let request: QuestionRequest
    let submit: ([[String]]) -> Void

    /// Selected labels, per question index.
    @State private var selections: [Int: Set<String>] = [:]
    @State private var custom: [Int: String] = [:]

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 8) {
                Image(systemName: "questionmark.bubble")
                    .foregroundStyle(Color.inkMuted)
                Text("The agent asks")
                    .font(.headline)
                    .foregroundStyle(Color.ink)
                Spacer()
            }
            ForEach(Array(request.questions.enumerated()), id: \.offset) { index, item in
                question(item, at: index)
            }
            HStack {
                Spacer()
                Button("Answer") { submit(answers()) }
                    .buttonStyle(CardButton(tint: .clay, filled: true))
                    .disabled(!complete)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: Radius.block, style: .continuous)
                .fill(Color.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: Radius.block, style: .continuous)
                        .stroke(Color.hairline, lineWidth: 1)
                )
        )
    }

    @ViewBuilder
    private func question(_ item: QuestionItem, at index: Int) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            if let header = item.header {
                Text(header)
                    .font(.footnote.smallCaps())
                    .foregroundStyle(Color.inkFaint)
            }
            Text(item.question)
                .font(.callout)
                .foregroundStyle(Color.ink)
            ForEach(item.options, id: \.label) { option in
                Button {
                    toggle(option.label, at: index, multiple: item.multiple == true)
                } label: {
                    HStack(alignment: .firstTextBaseline) {
                        Image(systemName: selections[index]?.contains(option.label) == true
                            ? "checkmark.circle.fill" : "circle")
                            .foregroundStyle(selections[index]?.contains(option.label) == true
                                ? Color.clay : Color.inkFaint)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(option.label)
                                .foregroundStyle(Color.ink)
                            if let detail = option.description, !detail.isEmpty {
                                Text(detail)
                                    .font(.caption)
                                    .foregroundStyle(Color.inkMuted)
                            }
                        }
                        Spacer(minLength: 0)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            if item.custom == true {
                TextField("Your own answer…", text: Binding(
                    get: { custom[index] ?? "" },
                    set: { custom[index] = $0 }
                ), axis: .vertical)
                .textFieldStyle(.plain)
                .padding(8)
                .background(
                    RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                        .fill(Color.canvas)
                )
            }
        }
    }

    /// Every question needs either a selection or a custom answer before
    /// the reply makes sense.
    private var complete: Bool {
        request.questions.indices.allSatisfy { index in
            !(selections[index] ?? []).isEmpty
                || !(custom[index] ?? "").trimmingCharacters(in: .whitespaces).isEmpty
        }
    }

    private func toggle(_ label: String, at index: Int, multiple: Bool) {
        var set = selections[index] ?? []
        if set.contains(label) {
            set.remove(label)
        } else {
            if !multiple { set.removeAll() }
            set.insert(label)
        }
        selections[index] = set
    }

    private func answers() -> [[String]] {
        request.questions.indices.map { index in
            var picked = Array(selections[index] ?? [])
            let free = (custom[index] ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            if !free.isEmpty { picked.append(free) }
            return picked
        }
    }
}
