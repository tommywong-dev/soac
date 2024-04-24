import Form from "./Form";
import Header from "./Header";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-y-8 w-full p-8 max-w-3xl">
      <Header />
      <Form />
    </main>
  );
}
