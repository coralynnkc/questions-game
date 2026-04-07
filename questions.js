const questions = {
  level1: {
    label: "Level 1: Perception",
    description:
      "Do you know how others see you? This level is about gaining perspective on what first impressions we give off and challenging the assumptions we make about others.",
    instruction:
      "Answer the first response that comes to mind. If guessed incorrectly by your partner, feel free to reveal the actual answer.",
    reminders: ["Let go of your attachment to the outcome."],
    wildcards: [
      "Maintain eye contact for thirty seconds. What did you notice?",
      "Close your eyes. What color is my shirt?",
      "Close your eyes. What color are my eyes?",
    ],
    questions: [
      "Do you think I intimidate others? Why or why not?",
      "Do you think I've ever been fired from a job? If so, what for?",
      "What does my Instagram tell you about me?",
      "What is my body language telling you right now?",
      "What fast food restaurant do you think I'm most likely to drive through? What's my order?",
      "What do you think my go-to karaoke song is?",
      "What was your first impression of me?",
      "What's the first thing you noticed about me?",
      "What subject do you think I thrived in at school? Did I fail any?",
      "Do I seem like a morning person or a night owl? Why?",
      "What does my phone wallpaper tell you about me?",
      "If you were to buy me a present, knowing nothing about me other than what I look like, what would it be?",
      "What compliment do you think I hear the most?",
      "Do I look kind? Explain.",
      "What about me is most strange or unfamiliar to you?",
      "How likely am I to go camping? How high maintenance is my set up?",
      "What do you think is the hardest part of what I do for a living?",
      "What reality show do you think I'm most likely to binge watch? Explain.",
      "What do my shoes tell you about me?",
      "Do I seem like more of a creative or analytical type? Explain.",
      "How many speeding tickets do you think I've gotten in my life?",
      "Do I seem like someone who would get a name tattooed on myself? Why or why not?",
      "What do you think I'm most likely to splurge on?",
      "Do I remind you of anyone?",
      "Who do you think my celebrity crush is?",
      "Do you think I've ever checked an ex's phone for evidence?",
      "Do you think I was popular in school? Explain.",
      "On a scale of 1-10, how messy do you think my car is? 1 being cleanest, 10 being a complete disaster. Explain.",
      "Do you think I fall in love easily? Why or why not?",
      "Do you think plants thrive or die in my care? Explain.",
      "Do you think I'm usually early, on time, or late to events? Explain.",
      "If Myspace were still a thing, what would my profile song be?",
    ],
  },

  level2: {
    label: "Level 2: Connection",
    description:
      "Who are you really? This round is about asking the rarely asked questions and connecting on a deeper level.",
    instruction:
      "Be more interested in understanding others than being understood.",
    reminders: [
      "Be more interested in understanding others than being understood.",
    ],
    wildcards: [
      "Press shuffle on your music library. Explain the first song that comes up!",
      "Sing the chorus of your favorite song of all time. Get into it!",
      "Both players write the three most important things in life to you. (30 seconds). Compare.",
      "Show the first photo in your camera roll. Explain.",
      "Think of something you strongly dislike that most people love. On the count of 3, say it loud! (Both players)",
      "Call someone you admire and tell them why you appreciate them! (Put them on speaker phone)",
      "Swap sweaters with your partner.",
    ],
    questions: [
      "What is your 1st love's name and the reason you fell in love with him/her?",
      "If you have, when was the moment you realized you weren't invincible?",
      "What was your mother's name? And the most beautiful thing about her?",
      "Have you ever told someone 'I love you' but didn't mean it? If so, why?",
      "What is a dream you've let go of?",
      "Are you missing anyone right now? Do you think they are missing you too?",
      "If you could get to know someone in your life on a deeper level, who would it be and why?",
      "What are you still trying to prove to yourself?",
      "Are you lying to yourself about anything?",
      "What lesson took you the longest to unlearn?",
      "Do you think the image you have of yourself matches the image people see you as?",
      "If you could have it your way: who would you be with? Where would you be? And what would you be doing?",
      "Is there a feeling you miss?",
      "What's been your happiest memory this past year?",
      "What is something you wouldn't want to change about yourself?",
      "What title would you give this chapter in your life?",
      "What is a compliment you wish you received more frequently?",
      "When was the last time you surprised yourself?",
      "How would you describe the feeling of being loved in one word?",
      "What do you crave more of?",
      "What's been the best compliment a stranger has ever given you?",
      "Have you changed your mind about anything recently?",
      "Describe your perfect day!",
      "What would your younger self not believe about your life today?",
      "Has a stranger ever changed your life?",
      "When you're asked how are you, how often do you answer truthfully?",
    ],
  },

  level3: {
    label: "Level 3: Reflection",
    description: "Time to reflect on your game experience.",
    instruction:
      "Reflect on everything you've learned. These questions are about each other.",
    reminders: [],
    wildcards: [
      "Write down one thing you want to let go of this year. Read out loud, then rip up together. (Both players)",
      "Swap a song suggesting your partner may enjoy. (Both players)",
      "Give your partner a compliment you don't think they hear enough.",
      "Give your partner a hug. Not the crappy kind. A warm fluffy one.",
      "Both players share something you're most grateful for in this current moment.",
      "Scroll through each other's Instagrams. Find the picture you feel best represents your partner's essence and explain why you chose that image.",
    ],
    questions: [
      "Based on what you learned about me, does my social media accurately reflect who I am? Why or why not?",
      "What am I most qualified to give advice about?",
      "What about me is hardest for you to understand?",
      "What do you think I fear the most?",
      "What do you admire most about me?",
      "What do you think our most important similarity is?",
      "What do you think I should know about myself that perhaps I'm unaware of?",
      "What do you think my weakness is?",
      "Why do you think we met?",
      "How do our personalities complement each other?",
      "What parts of yourself do you see in me?",
      "In one word, describe how you feel right now.",
      "What question were you most afraid to answer?",
      "Do you believe everyone has a calling? If so, do you think I've found mine?",
      "What would be the perfect gift for me?",
      "What about me most surprised you?",
      "How would you describe me to a stranger?",
      "What do you think my defining characteristic is?",
    ],
  },

  finalCard: {
    label: "Final Card",
    text: "Each player write a message to the other. Fold and exchange. Open only once you two have parted.",
  },

  digDeeper: {
    label: "Dig Deeper",
    text: "Each player gets a dig deeper card, which can be used once per level. These cards are meant to encourage transparency if you feel your partner is holding back.",
  },
};

// Helper: shuffle an array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper: get shuffled deck for a level, with wildcards mixed in
function getDeck(levelKey) {
  const level = questions[levelKey];
  const cards = [
    ...level.questions.map((q) => ({ type: "question", text: q })),
    ...level.wildcards.map((w) => ({ type: "wildcard", text: w })),
    ...level.reminders.map((r) => ({ type: "reminder", text: r })),
  ];
  return shuffle(cards);
}
