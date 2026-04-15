import { FlowView } from "@/components/views/FlowView";

const ver = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";

export const metadata = {
  title: `End-to-End Flow | Pooly.AI ver 10 · v${ver}`,
};

export default function FlowPage() {
  return <FlowView />;
}
