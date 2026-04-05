import { useEffect } from "react";
import { Header } from "../../sections/index";

export default function Home() {
  useEffect(() => {
    document.title = "academy";
  }, []);
  return (
    <Header />
  );
}
