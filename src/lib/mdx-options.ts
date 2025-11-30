import remarkGfm from "remark-gfm";
import type { SerializeOptions } from "next-mdx-remote/rsc";

export const mdxOptions: SerializeOptions["mdxOptions"] = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [],
};

