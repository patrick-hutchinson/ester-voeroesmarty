import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PrevPost({ arr }) {
  const router = useRouter();
  const { asPath } = useRouter();
  const [link, setLink] = useState(null);

  useEffect(() => {
    const index = arr.findIndex((a) => a.slug.current === asPath.split("/")[2]);

    index > 0
      ? setLink(
          <a href={`/practice/${arr[index - 1].slug.current}`} className="prev">
            Previous
          </a>
        )
      : setLink(
          <a href={`/practice/${arr[arr.length - 1].slug.current}`} className="prev">
            Previous
          </a>
        );
  }, [router]);

  return <span>{link}</span>;
}
