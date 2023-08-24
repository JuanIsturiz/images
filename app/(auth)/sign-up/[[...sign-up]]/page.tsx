import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex-1 flex justify-center">
      <div className="mt-4">
        <SignUp />
      </div>
    </section>
  );
}
