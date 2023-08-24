import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex-1 flex justify-center">
      <div className="mt-4">
        <SignIn />
      </div>
    </section>
  );
}
