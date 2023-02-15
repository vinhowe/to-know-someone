import { Inter, Space_Grotesk, Space_Mono } from "@next/font/google";
import { getQuestions } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] });

export const config = {
  unstable_runtimeJS: false
}

interface Question {
  question: string;
  slug: string;
}

export default function Questions({ questions }: { questions: Question[] }) {
  // Responsive multi-column layout using Tailwind styles
  // Questions flow from left to right, top to bottom
  return (
    <>
      <Head>
        <title>To Know Someone</title>
      </Head>
      <div
        className={
          "flex flex-col items-center justify-center min-h-screen " +
          spaceGrotesk.className
        }
      >
        <main className="flex flex-col items-start w-full flex-1 p-10">
          <p className={"text-xs mb-10 font-mono " + spaceMono.className}>
            submit pull requests at{" "}
            <a
              href="https://github.com/vinhowe/to-know-someone"
              className="text-blue-700"
            >
              vinhowe/to-know-someone
            </a>
          </p>
          <h1 className="text-2xl mb-4 font-medium">
            Is it possible to truly know someone?
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl justify-between mt-6 sm:w-full gap-8">
            {questions.map((question) => (
              <a
                href={`#${question.slug}`}
                key={question.slug}
                id={question.slug}
                className="mt-2 text-left w-92 hover:text-blue-600 focus:text-blue-600"
              >
                <h3
                  className="text-base"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                ></h3>
              </a>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const questions = getQuestions(["content"]);
  return {
    props: {
      questions: await Promise.all(
        questions.map(async ({ question, slug }) => ({
          question: await markdownToHtml(question),
          slug,
        }))
      ),
    },
  };
}
