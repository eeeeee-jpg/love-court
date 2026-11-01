# love-court: "Love Trial" demo prototype

Demo video of the "Love Trial" feature (side content for a dating app), seen from one juror ("me"). Everyone else is a scripted NPC. Real-time play, multi-user and deployment are out of scope for the demo.

## Rules
- Single file index.html. No external libraries, fonts, images or network requests (the AI verdict hookup is the only exception, needs approval). No emoji: draw shapes in CSS/SVG.
- English for code, comments and docs. Text shown on screen stays Korean and lives in SCENARIO CONFIG; internal keys are English (judge, prosecutor, defender, juror).
- Change only what was asked. When done, report only the changed file paths.
- Branches: `scenario` = scenario work, `design` = design work, merged into `main`. Check the current branch before starting.
- Direction: this is a demo first; a fully playable multi-user game follows. Keep scripted parts (NPC lines, NPC votes, auto entry) behind demo-mode flags so they can be replaced by real user input later.

## Case and vote
- Case: "12-hour no-contact". Options: A not guilty / B protest justified.
- 7 votes, so no tie. NPC votes are fixed so A not guilty always wins, whatever "me" votes.
- Humans speak and vote. AI only writes the verdict text from the result and never decides it. Verdict: formal court style + a one-line rider, read aloud with browser TTS (ko-KR).
- Chat filter is staged only (masked dots, then a block notice), on its own stage. Never write real profanity or hate terms.

## Stages (STAGES)
0 role select -> 1 entry -> 2 judge enters -> 3 opening -> 4 case intro -> 5 opening statements -> 6 issue arguments -> 7 closing -> 8 jury discussion (chat) -> 9 chat filter demo -> 10 verdict vote -> 11 verdict reading (close-up) -> 12 reactions + adjournment -> 13 outro (next trial teaser)

## Controls
- Two arrow buttons (prev / next) below the stage, plus the left/right arrow keys.
- Each stage plays on its own; next is enabled when it ends. Stage 10 waits for my vote; 11 -> 12 -> 13 chain without input.
- Prev stops playback, rebuilds the previous stage's start state (buildState) and replays it.
- During a cut-in line, next completes the typing, then skips the hold.

## Systems
Bottom dialogue box (name tag, typewriter, highlight words), framed panels, juror mood gauge (stages 6~9), shout cut-ins, close-up gavel + verdict stamp, winner/loser reactions, gold nameplates, TTS with fallback timers and a per-stage safety timer.

## Config (top of index.html)
- SCENARIO CONFIG: ME, OPTIONS, OPTION_LABELS, OPTION_SHORT, NPC_VOTES, CASE, OPENING, ISSUE_DEBATE (cutin), CLOSING, JUROR_LINES, JUDGMENT_TEXTS, JUDGMENT_RIDERS, VERDICT_STAMPS, CLOSING_LINE, OUTRO, FILTER_NOTICE, GAUGE_TEXT, GAUGE_START, GAUGE_STEPS, HIGHLIGHT_WORDS, PANEL_TABS, NAV_LABELS, PROSECUTOR_NICK, DEFENDER_NICK.
- DESIGN CONFIG (values that could go either way go here): ASPECT_RATIO, BG_TOPVIEW, BG_CLOSEUP, AVATARS, PROPS, PANEL, DESK_CLIP, CLOSEUP_JUDGE, CLOSEUP_DESK_CLIP, NAMEPLATES, NAMEPLATE_GOLD, UI_PALETTE, UI_FONT, DIALOGUE_MODE, DIALOGUE_BOX, CHAT_STAGES, FRAME_PATTERN, FRAME_FILL, GAUGE, CUTIN, CUTIN_INTRO_MS, CUTIN_HOLD_MODE, LINE_HOLD_AFTER_TYPING_MS, LINE_MIN_TOTAL_MS, GAVEL, GAVEL_ENABLED, WINNER, REACTION, SPEECH_MS_PER_CHAR, SAFETY_UNLOCK_MS, DEBUG_LOG.

## Remaining
- Speaker shots (virtual camera): not built yet.
- Detail design fixes.
- Cut transition tempo.
- AI verdict text hookup.
