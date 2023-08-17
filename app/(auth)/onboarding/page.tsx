import OnboardingForm from "@/components/forms/OnboardingForm";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  const userProp = {
    id: user?.id ?? "",
    imageUrl: user?.imageUrl ?? "",
    username: user?.username ?? "",
    name: `${user?.firstName} ${user?.lastName}`,
  };
  return (
    <section>
      <h2>Onboarding</h2>
      <OnboardingForm user={userProp} />
    </section>
  );
}
