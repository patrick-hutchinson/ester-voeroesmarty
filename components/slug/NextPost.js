import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NextPost({ arr }) {
  const router = useRouter();
  const { asPath } = useRouter();
  const [link, setLink] = useState(null);

  useEffect(() => {
    const index = arr.findIndex((a) => a.slug.current === asPath.split("/")[2]);

    index < arr.length - 1
      ? setLink(
          <a href={`/practice/${arr[index + 1].slug.current}`} className="next">
            Next
          </a>
        )
      : setLink(
          <a href={`/practice/${arr[0].slug.current}`} className="next">
            Next
          </a>
        );
  }, [router]);

  return <span>{link}</span>;
}
