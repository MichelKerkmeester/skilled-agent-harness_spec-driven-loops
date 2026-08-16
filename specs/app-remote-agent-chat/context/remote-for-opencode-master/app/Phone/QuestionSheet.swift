import RemoteKit
import SwiftUI

/// The agent asked something. One sheet answers the whole request — each
/// question gets its options (tap to select; multi-select where allowed),
/// plus a free-text field where the agent said custom answers are fine.
/// Submit sends the labels per question, in order — the shape OpenCode's
/// reply endpoint wants.
struct QuestionSheet: View {
    let request: QuestionRequest
    let submit: ([[String]]) -> Void

    /// Selected labels, per question index.
    @State private var selections: [Int: Set<String>] = [:]
    @State private var custom: [Int: String] = [:]

    var body: some View {
        NavigationStack {
            List {
                ForEach(Array(request.questions.enumerated()), id: \.offset) { index, item in
                    Section {
                        Text(item.question)
                            .font(.callout)
                        ForEach(item.options, id: \.label) { option in
                            Button {
                                toggle(option.label, at: index, multiple: item.multiple == true)
                            } label: {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(option.label)
                                            .foregroundStyle(.primary)
                                        if let detail = option.description, !detail.isEmpty {
                                            Text(detail)
                                                .font(.caption)
                                                .foregroundStyle(.secondary)
                                        }
                                    }
                                    Spacer()
                                    if selections[index]?.contains(option.label) == true {
                                        Image(systemName: "checkmark")
                                            .foregroundStyle(.tint)
                                    }
                                }
                            }
                        }
                        if item.custom == true {
                            TextField("Your own answer…", text: Binding(
                                get: { custom[index] ?? "" },
                                set: { custom[index] = $0 }
                            ), axis: .vertical)
                        }
                    } header: {
                        if let header = item.header { Text(header) }
                    }
                }
            }
            .navigationTitle("The agent asks")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Answer") { submit(answers()) }
                        .disabled(!complete)
                }
            }
        }
        .presentationDetents([.medium, .large])
        .interactiveDismissDisabled()
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
