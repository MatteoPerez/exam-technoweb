import { useRouter } from "next/router";
import Layout from "../components/layout";
import Breadcrumb from "../components/breadcrumb";

export default function AuthorDetails() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <Breadcrumb />
      <h1 className="text-2xl font-bold">Author Details - {id}</h1>
    </Layout>
  );
}
