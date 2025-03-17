import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-lg">Library</Link>
        <div className="space-x-4">
          <Link href="/books">Books</Link>
          <Link href="/authors">Authors</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
