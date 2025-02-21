const paragraphs: string[] = [
  "The quick brown fox jumps over the lazy dog, showcasing agility and speed while the dog remains still.",
  "Consistency and practice are the keys to mastering any skill, whether it be typing, coding, or playing an instrument.",
  "Technology continues to evolve, shaping the way we communicate, work, and interact with the world around us.",
  "Creativity is the spark that fuels innovation, pushing humanity forward with new ideas and groundbreaking solutions.",
  "Patience and persistence are essential when learning something new, as progress often comes in small steps.",
  "Reading expands the mind, offering new perspectives and insights that can inspire change and growth.",
  "Great things are achieved not by luck, but by dedication, perseverance, and a strong belief in one's ability.",
  "A journey of a thousand miles begins with a single step, reminding us that every great achievement starts small.",
  "The best way to predict the future is to create it, turning dreams into reality through focused effort.",
  "Small daily improvements lead to long-term success, proving that consistency beats intensity over time.",
];
export function GenereateRandomParagraph(): string {
  const randomParagraph = Math.floor(Math.random() * 10);

  return paragraphs[randomParagraph];
}
