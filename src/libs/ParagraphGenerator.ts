const paragraphs: string[] = [
  "ut commodo incididunt incididunt in ea nostrud tempor ex do",
  "reprehenderit in consequat nostrud minim ullamco dolor nisi consectetur ex",
  "ullamco dolore laboris ex adipiscing magna ea ullamco incididunt ad",
  "in reprehenderit commodo commodo incididunt minim consequat ut dolor esse",
  "aliqua aute veniam eiusmod ad eu reprehenderit ea eu aliquip",
  "eiusmod consequat in dolor ex ullamco elit duis consectetur tempor",
  "do aute consectetur amet aliquip enim voluptate ut quis incididunt",
  "pariatur amet velit ullamco ea velit quis voluptate irure commodo",
  "in nulla sit nulla pariatur pariatur sit ut ea enim",
  "veniam tempor minim sit ipsum exercitation in cillum ut tempor",
];
export function GenereateRandomParagraph(): string {
  const randomParagraph = Math.floor(Math.random() * 10);
  
  return paragraphs[randomParagraph];
}
