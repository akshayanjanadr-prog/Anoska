// ============================================================
// CENTRAL CONFIGURATION FILE
// Edit everything here — names, messages, captions, paths.
// ============================================================

export interface PhotoEntry {
  image: string;
  caption: string;
}

export interface DiaryConfig {
  title: string;
  subtitle: string;
  folder: string;
  transitionText: string;
  photos: PhotoEntry[];
}

export const birthdayContent = {
  // ── Her name ──────────────────────────────────────────────
  name: "My Paapa",

  // ── Birthday date (do not change format) ──────────────────
  birthday: "19 September 2026",
  birthdayDate: new Date("2026-09-19T00:00:00"),

  // ── DEV MODE: set true to test birthday mode instantly ────
  // Set to false before deployment!
  DEV_MODE: false,
  DEV_BIRTHDAY_UNLOCKED: false, // only matters when DEV_MODE = true

  // ── Hero section ──────────────────────────────────────────
  hero: {
    beforeBirthday: "Something Beautiful Is About To Begin...",
    afterBirthday: "Happy 16th Birthday",
    countdownLabel: "Her 16th Birthday",
    countdownSubtitle: "Counting down to a day made just for her...",
  },

  // ── Audio paths ───────────────────────────────────────────
  audio: {
    // Background song (plays on the hero page)
    background: "/audio/birthday-song.mp3",
    // Special surprise — mp4 video
    surprise: "/audio/special-surprise.mp4",
  },

  // ── Special Surprise section ──────────────────────────────
  surprise: {
    albumArt: "/album-art/surprise-placeholder.jpg",
    songTitle: "A Song For You",
    artistName: "From Me, With Love ❤️",
    introText: "And now... something from me to you.",
    dedicationText: "This one is for you. ❤️",
  },

  // ── Final birthday message ────────────────────────────────
  // Edit this to your personal message:
  finalMessage:
    "Happy 16th Birthday, my paapa. Every memory we've made has become a little piece of my favourite story. You make ordinary moments feel magical, and I am so grateful to have you in my life. Here's to you — forever my favourite person. ❤️",

  // ── Ending footer ─────────────────────────────────────────
  endingText: "For the girl who makes ordinary moments feel special.",

  // ── Diaries ───────────────────────────────────────────────
  diaries: [
    {
      title: "My Little Paapa",
      subtitle: "The moments that make my heart smile.",
      folder: "/images/diary-1",
      transitionText: "Some memories are too precious to stay in one page...",
      photos: Array.from({ length: 12 }, (_, i) => ({
        image: `/images/diary-1/${i + 1}.jpg`,
        caption: [
          "A memory I'll always keep.",
          "You and your endless charm.",
          "This smile — it gets me every time.",
          "My favourite kind of afternoon.",
          "Laughing at nothing, loving everything.",
          "The little moments that mean the most.",
          "Pure happiness, captured.",
          "You make the ordinary extraordinary.",
          "A page from my favourite story.",
          "Effortlessly you.",
          "This one makes my heart full.",
          "My paapa, always and forever.",
        ][i],
      })),
    },
    {
      title: "Our Little World",
      subtitle: "Every meeting became a memory.",
      folder: "/images/diary-2",
      transitionText: "And then there were the moments we made together...",
      photos: Array.from({ length: 12 }, (_, i) => ({
        image: `/images/diary-2/${i + 1}.jpg`,
        caption: [
          "The beginning of something beautiful.",
          "Our first everything.",
          "Side by side, always.",
          "Lost in our own world.",
          "Every second with you is golden.",
          "Us against the world.",
          "This moment, frozen in time.",
          "Where time stood still for us.",
          "Our little universe.",
          "Together feels like home.",
          "My world got bigger when I found you.",
          "Every meet, a new favourite memory.",
        ][i],
      })),
    },
    {
      title: "A Mother's Love",
      subtitle: "A bond written beyond words.",
      folder: "/images/diary-3",
      transitionText: "And the love that started it all...",
      photos: Array.from({ length: 12 }, (_, i) => ({
        image: `/images/diary-3/${i + 1}.jpg`,
        caption: [
          "The love that holds everything together.",
          "Her first safe place.",
          "A mother's eyes see everything.",
          "Where she learned what love looks like.",
          "Two hearts that were always one.",
          "The warmth only a mother gives.",
          "She carries her mother's strength.",
          "A bond that time cannot touch.",
          "Love that needs no words.",
          "Her first forever.",
          "The woman who made her whole.",
          "A love story that began from the start.",
        ][i],
      })),
    },
  ] as DiaryConfig[],
};
