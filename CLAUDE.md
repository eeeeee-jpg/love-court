# love-court: "Love Trial" demo prototype

## Language rule
- Everything is written in English: code identifiers, comments, config section titles, file names, docs.
- Exception: text shown on screen stays Korean (dialogue, subtitles, verdict text, labels, nicknames, buttons, notices). Keep all of it in the SCENARIO CONFIG block at the top of index.html.
- Use English internal keys (judge, prosecutor, defender, juror). Korean display labels are mapped separately.

## Project rules
- Single file: index.html. No external libraries or network requests (API hookup step is the only exception, needs approval).
- Do not change anything outside the requested scope. After finishing, report only the changed file paths.

## Purpose and scope
Demo for the "Love Trial" feature, a side content piece meant to draw users into a dating app. Shown as a participant-POV (juror) demo video. All other roles are scripted NPCs. Real-time play, multi-user access and deployment are out of scope.

## Decisions
- Case: "12-hour no-contact" dispute. Vote options: A not guilty / B protest justified. 7 voters, so no tie; the NPC votes are fixed so A not guilty always wins, whatever "me" votes.
- Humans speak and vote. AI only writes the verdict text from the vote result and does not decide the outcome. The only real AI call is verdict generation, and the API hookup comes last, after the design pass.
- Verdict tone: formal court style, followed by a one-line rider (recommendation). Reading aloud: browser TTS (ko-KR).
- The content filter is staged only: input shows masked dots, then a block notice. It has its own stage (9) and must not appear from the vote on. Never write real profanity or hate terms on screen or in code.

## Stages (STAGES)
0 role select (staged) -> 1 entry (everyone except the judge) -> 2 judge enters -> 3 opening -> 4 case intro -> 5 opening statements -> 6 issue-by-issue arguments -> 7 closing -> 8 jury discussion (chat) -> 9 chat filter demo -> 10 verdict vote -> 11 verdict reading (front close-up, gavel x3) -> 12 reactions + adjournment -> 13 outro (next trial teaser)
- Controls: only two arrow buttons below the stage (prev / next) and the left/right arrow keys. Each stage plays to the end on its own; next is enabled when it finishes.
- Prev stops playback and rebuilds the start state of the previous stage instantly (buildState), then replays it.
- Stage 0 continues on the juror card or next. Stage 10 waits for my vote. 11 -> 12 -> 13 chain without input.
- Every wait has a fallback (TTS onend / onerror / timer, per-stage safety timer), so next is always enabled in the end.

## Visuals
- Main view: top view on bg-top.png (3:2, empty courtroom with the judge bench in the image). Verdict reading only: front close-up on bg-front.png (3:2). Parts of each image are redrawn above the avatars (clip-path) so the desks hide lower bodies.
- Judge: front view (seated upper-body sprite with a gavel in the close-up). Prosecutor (left) and defender (right): side view, stand up to speak, sit after. Jurors (7): seen from behind, 3 back row + 4 front row.
- Gold-on-black nameplates for judge, prosecutor and defender (top view and close-up).
- Verdict reaction: the winner jumps under fireworks and floats away with balloons; the loser kneels in front of the desk and pounds the floor.

## Config
Two blocks at the top of index.html: SCENARIO CONFIG (dialogue, nicknames, issues, votes, verdict text, other screen text) and DESIGN CONFIG (coordinates, sizes, colors, nameplates, images, aspect ratio, timing). Values that could go either way go in DESIGN CONFIG.
