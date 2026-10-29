# love-court: "Love Trial" demo prototype

## Language rule
- Everything is written in English: code identifiers, comments, config section titles, file names, docs.
- Exception: text shown on screen stays Korean (dialogue, subtitles, verdict text, labels, nicknames, buttons, notices). Keep all of it in one strings/config section at the top of index.html.
- Use English internal keys (judge, prosecutor, defender, juror). Korean display labels are mapped separately.

## Project rules
- Single file: index.html. No external libraries or network requests (API hookup step is the only exception, needs approval).
- Do not change anything outside the requested scope. After finishing, report only the changed file paths.

## Purpose and scope
Demo for the "Love Trial" feature, a side content piece meant to draw users into a dating app. Shown as a participant-POV (juror) demo video. All other roles are scripted NPCs. Real-time play, multi-user access and deployment are out of scope.

## Decisions
- Case: "ex-partner follow" dispute. Vote options: A not guilty / B demand justified / mutual fault (a tie resolves to mutual fault).
- Humans speak and vote. AI only writes the verdict text from the vote result and does not decide the outcome. The only real AI call is verdict generation, and the API hookup comes last, after the design pass.
- Verdict tone: formal court style. Reading aloud: browser TTS (ko-KR).
- The content filter is staged only: input shows masked dots, then a block notice. Never write real profanity or hate terms on screen or in code.

## Stages (STAGES, advanced by a "next" button)
0 role select (staged) -> 1 entry (everyone except the judge) -> 2 judge enters -> 3 opening -> 4 case intro -> 5 opening statements -> 6 issue-by-issue arguments -> 7 closing -> 8 jury discussion (chat) -> 9 verdict vote -> 10 verdict reading (front close-up) -> 11 adjournment

## Visuals
- Main view: top view. Background image bg-top.png (3:2, empty courtroom with one judge bench already in the image). Verdict reading only: front close-up on bg.jpg (temporary image, replace before public release).
- Judge: front view. Prosecutor (left) and defender (right): side view, stand up to speak, sit after. Jurors (7): seen from behind, 3 back row + 4 front row. Upper body visible for all.
- Coordinates, nicknames, dialogue and constants live in the config section at the top of index.html.
