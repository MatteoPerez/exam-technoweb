import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumb = () => {
  const router = useRouter();
  const pathnames = router.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm text-gray-600 my-4">
      <Link href="/" className="text-blue-600">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <span key={routeTo}>
            {" / "}
            <Link href={routeTo} className="text-blue-600">{name}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
