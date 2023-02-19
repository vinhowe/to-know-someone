import { Inter, Space_Grotesk, Space_Mono } from "@next/font/google";
import { getQuestions } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] });

export const config = {
  unstable_runtimeJS: false,
};

interface Question {
  question: string;
  slug: string;
  hasMeta: boolean;
  tags?: string[] | null;
}

export default function Questions({
  categories,
}: {
  categories: Record<string, Question[]>;
}) {
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
            Rules of Hardball: the (untested) game of intrusive questions
          </h1>
          <div className="mb-6">
            <p className="text-base mb-4">It&rsquo;s simple:</p>
            <p className="text-base mb-4">
              Pairs of partners rotate on a timer—say, 5 minutes per round—like
              speed dating. The game continues for a set number of rounds.
            </p>
            <p className="text-base mb-4">
              Each pair of partners alternates asking each other <b>softball</b>{" "}
              questions from the list.
            </p>
            <p className="text-base mb-4">
              Neither partner may reuse a question in a round.
            </p>
            <div className="text-base mb-4">
              <p>
                Points are awarded only through the <b>hardball gambit</b>: If
                you would like to ask your partner a <b>hardball</b> question,
                say &ldquo;hardball,&rdquo; and you must first answer a hardball
                question of your partner&rsquo;s choice. Then you may ask them
                your question. Points are assigned as follows:
              </p>
              <ul className="list-disc mt-4">
                <li>
                  If <b>your partner refuses the gambit</b>,{" "}
                  <span className="text-blue-500">
                    <b>you</b> get <b>2 points</b>
                  </span>
                  .
                </li>
                <li>
                  If <b>you refuse to answer your partner&rsquo;s question</b>,{" "}
                  <span className="text-red-500">
                    <b>your partner</b> gets <b>2 points</b>
                  </span>
                  .
                </li>
                <li>
                  If <b>your partner refuses to answer your question</b>,{" "}
                  <span className="text-blue-500">
                    you get <b>4 points</b>
                  </span>
                  .
                </li>
                <li>
                  Otherwise, if the gambit is successful,{" "}
                  <span className="text-blue-500">
                    you get <b>1 point</b>
                  </span>{" "}
                  and your partner gets <b>none</b>.
                </li>
              </ul>
            </div>
            <p className="text-base mb-4">
              <b>Strategically</b>, this rewards players who pose gambits
              frequently and ask the most personal, intrusive questions.
            </p>
            <p className="text-base mb-4">
              You might argue that only a sociopath could conceive of such a
              game. And you might be right.
            </p>
            <p className="text-base mb-4">
              The player with the most points wins, and the object of the game
              is to win.
            </p>
          </div>

          {Object.entries(categories).map(([category, questions]) => (
            <div key={category} className="mb-10">
              <h1 className="text-3xl font-regular mt-4">{category}</h1>
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
            </div>
          ))}
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const questions = getQuestions();
  // Use tags list to create categories (first tag is the category)
  // const categories = questions.reduce((acc: Record<string, Question[]>, question) => {
  //   const { tags } = question;
  //   if (!tags) return acc;
  //   const [category] = tags as Array<string>;
  //   if (!acc[category]) acc[category] = [];
  //   acc[category].push(question);
  //   return acc;
  // }, {});
  // The above but using a plain loop instead because we need to await
  const categories: Record<string, Question[]> = {};
  for (let question of questions) {
    const { tags } = question;
    if (!tags) continue;
    const [category] = tags as Array<string>;
    if (!categories[category]) categories[category] = [];
    question = {
      ...question,
      question: await markdownToHtml(question.question),
    };
    categories[category].push(question);
  }
  // return {
  //   props: {
  //     questions: await Promise.all(
  //       questions.map(async ({ question, slug, hasMeta, tags }) => ({
  //         question: await markdownToHtml(question),
  //         slug,
  //         hasMeta,
  //         tags,
  //       }))
  //     ),
  //   },
  // };
  return {
    props: {
      categories,
    },
  };
}
