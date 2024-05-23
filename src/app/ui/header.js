import Link from "next/link";
import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex justify-evenly">
      <Link href="/graph">
        <Image
          src="/image/graph.png"
          alt="graph Image"
          width={75}
          height={75}
        />
      </Link>
      <Link href="/tree">
        <Image src="/image/tree.png" alt="Tree Image" width={75} height={75} />
      </Link>
    </div>
  );
};

export default Header;
