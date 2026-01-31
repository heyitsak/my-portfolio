// This file is server-only - reads MDX files
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Tech" | "Startups" | "AI";
  date: string;
  readTime: string;
  featured?: boolean;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "app/blog/_posts");

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDirectory);
  const mdxFiles = files.filter(
    (file) => file.endsWith(".mdx") && !file.startsWith("_")
  );

  const posts = mdxFiles.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      category: data.category || "Tech",
      date: data.date || "",
      readTime: data.readTime || "",
      featured: data.featured || false,
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
