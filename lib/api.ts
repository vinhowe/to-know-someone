import fs from "fs";
import { join } from "path";

import { remark } from "remark";
import smartypants from "@silvenon/remark-smartypants";

const questionsFile = join(process.cwd(), "questions.md");

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function getQuestions(fields: string[] = []) {
  const content = fs.readFileSync(questionsFile, "utf8");

  const parsedContent = remark().use(smartypants).parse(content);
  const questions = parsedContent.children
    .filter((child) => child.type === "heading" && child.depth === 2)
    .map((question) => {
      question.type = "paragraph";
      // @ts-ignore
      const questionBody = remark().stringify(question);
      return {
        // @ts-ignore
        question: questionBody,
        slug: slugify(questionBody)
      };
    });

  return questions;
}
