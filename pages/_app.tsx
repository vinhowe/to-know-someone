import { AppProps } from "next/app";
import "./globals.css";

export default function ToKnowSomeone({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
