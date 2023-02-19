import fs from "fs";
import { join } from "path";

import toml from "toml";
import { remark } from "remark";
import smartypants from "@silvenon/remark-smartypants";

const questionsFile = join(process.cwd(), "questions.md");

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function getQuestions() {
  const content = fs.readFileSync(questionsFile, "utf8");

  const parsedContent = remark().use(smartypants).parse(content);
  const questions = [];
  let currentQuestion = null;
  for (let child of parsedContent.children) {
    // @ts-ignore
    if (child.type === "heading" && child.depth === 3) {
      // @ts-ignore
      child.type = "paragraph";
      // @ts-ignore
      const questionBody = remark().stringify(child);
      currentQuestion = {
        // @ts-ignore
        question: questionBody,
        slug: slugify(questionBody),
        hasMeta: false,
        tags: null,
      };
      questions.push(currentQuestion);
    }
    if (currentQuestion && child.type === "code" && child.lang === "toml" && !currentQuestion.hasMeta) {
      // Expand the TOML into current question
      Object.assign(currentQuestion, toml.parse(child.value));
      currentQuestion.hasMeta = true;
    }
  }
  return questions;
}
